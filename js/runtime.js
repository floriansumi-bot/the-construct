/* ============================================================
   runtime.js — real CPython in the browser via Pyodide,
   plus a sandboxed grader that runs the learner's code against
   per-exercise test cases.
   Exposes: window.Runtime
   ============================================================ */
(function () {
  "use strict";

  // ----- Python side: input mocking, stdout capture, runaway-loop guard, grader -----
  const HARNESS_PY = String.raw`
import sys, io, json, builtins, traceback

def _make_input(values):
    _it = iter(list(values))
    def _input(prompt=""):
        try:
            sys.stdout.write(str(prompt))
        except Exception:
            pass
        try:
            v = next(_it)
        except StopIteration:
            raise EOFError("EOF: program asked for more input than the test provided")
        sys.stdout.write(str(v) + "\n")
        return str(v)
    return _input

class _Guard:
    __slots__ = ("limit", "n")
    def __init__(self, limit):
        self.limit = limit
        self.n = 0
    def __call__(self, frame, event, arg):
        if event == 'line':
            self.n += 1
            if self.n > self.limit:
                raise RuntimeError("EXECUTION HALTED :: instruction ceiling hit — likely an infinite loop")
        return self

_GUARD_LIMIT = 800000

def _exec_capture(src, stdin=None):
    """Run src as a fresh __main__ with mocked input + captured stdout.
       Returns (stdout_text, error_text_or_None, globals_dict)."""
    stdin = list(stdin) if stdin is not None else []
    old_out, old_err, old_in, old_trace = sys.stdout, sys.stderr, builtins.input, sys.gettrace()
    buf = io.StringIO()
    sys.stdout = buf
    sys.stderr = buf
    builtins.input = _make_input(stdin)
    g = {"__name__": "__main__"}
    err = None
    guard = _Guard(_GUARD_LIMIT)
    try:
        code = compile(src, "<your_code>", "exec")
    except SyntaxError:
        sys.stdout, sys.stderr, builtins.input = old_out, old_err, old_in
        return "", _fmt_exc(), g
    try:
        sys.settrace(guard)
        exec(code, g)
    except SystemExit:
        pass
    except BaseException:
        err = _fmt_exc()
    finally:
        sys.settrace(old_trace)
        sys.stdout, sys.stderr, builtins.input = old_out, old_err, old_in
    return buf.getvalue(), err, g

def _fmt_exc():
    lines = traceback.format_exc().rstrip().splitlines()
    keep = []
    for ln in lines:
        if "_exec_capture" in ln or "in _input" in ln or "harness" in ln.lower():
            continue
        if 'File "<your_code>"' in ln:
            ln = ln.split(",", 1)
            ln = "  " + ln[1].strip() if len(ln) > 1 else "  " + "".join(ln)
        keep.append(ln)
    if len(keep) > 16:
        keep = keep[:1] + ["  ...(trimmed)..."] + keep[-14:]
    return "\n".join(keep)

def check_syntax(src):
    try:
        compile(src, "<chk>", "exec")
        return ""
    except SyntaxError as e:
        return "SyntaxError: " + (e.msg or "invalid syntax")
    except Exception:
        return ""

def run_display(user_src, stdin):
    out, err, _g = _exec_capture(user_src, stdin)
    return {"stdout": out, "error": err}

def grade(user_src, tests, preexec):
    results = []
    ns = {"__name__": "__construct__"}
    preexec_err = None
    captured = ""
    if preexec:
        out, err, g = _exec_capture(user_src, [])
        captured = out
        if err is not None:
            preexec_err = err
        else:
            ns.update(g)
    def _run(stdin=None):
        out, err, _g = _exec_capture(user_src, stdin if stdin is not None else [])
        if err is not None:
            raise AssertionError("Your program crashed while running:\n" + err)
        return out
    ns["_run"] = _run
    ns["_src"] = user_src
    ns["json"] = json
    for t in tests:
        name = t.get("name", "check")
        needs_ns = t.get("needs_ns", True)
        if preexec and preexec_err and needs_ns:
            results.append({"name": name, "ok": False,
                            "msg": "Code did not load:\n" + preexec_err})
            continue
        _old_trace = sys.gettrace()
        sys.settrace(_Guard(_GUARD_LIMIT))
        try:
            exec(compile(t["code"], "<test:" + name + ">", "exec"), ns)
            results.append({"name": name, "ok": True, "msg": ""})
        except AssertionError as e:
            results.append({"name": name, "ok": False, "msg": str(e) if str(e) else "Assertion failed."})
        except Exception:
            results.append({"name": name, "ok": False, "msg": _fmt_exc()})
        finally:
            sys.settrace(_old_trace)
    n_ok = sum(1 for r in results if r["ok"])
    return {"results": results, "stdout": captured, "preexec_error": preexec_err,
            "passed": n_ok, "total": len(results), "all_ok": n_ok == len(results) and len(results) > 0}
`;

  const Runtime = {
    pyodide: null,
    ready: false,
    _loading: null,

    async init(onLog) {
      if (this._loading) return this._loading;
      this._loading = (async () => {
        if (typeof loadPyodide !== "function") {
          throw new Error("Pyodide failed to load from the CDN. Check your internet connection.");
        }
        onLog && onLog("mounting CPython 3.12 kernel [WebAssembly]", "");
        this.pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/",
          stdout: () => {},
          stderr: () => {},
        });
        onLog && onLog("kernel online — injecting grading harness", "ok");
        await this.pyodide.runPythonAsync(HARNESS_PY);
        this.ready = true;
        onLog && onLog("harness armed — curriculum mounted", "ok");
        return this.pyodide;
      })();
      return this._loading;
    },

    /** Run user source for display; returns {stdout, error}. */
    async runDisplay(src, ex) {
      const py = this.pyodide;
      py.globals.set("__src", src);
      py.globals.set("__stdin", JSON.stringify((ex && ex.sampleStdin) || []));
      const out = await py.runPythonAsync(
        "json.dumps(run_display(__src, json.loads(__stdin)))"
      );
      cleanup(py);
      return JSON.parse(out);
    },

    /** Grade user source against an exercise. Returns grade dict. */
    async grade(src, ex) {
      const py = this.pyodide;
      const tests = (ex && ex.tests) || [];
      const preexec = !(ex && ex.kind === "script");
      py.globals.set("__src", src);
      py.globals.set("__tests", JSON.stringify(tests));
      py.globals.set("__preexec", preexec);
      const out = await py.runPythonAsync(
        "json.dumps(grade(__src, json.loads(__tests), __preexec))"
      );
      cleanup(py);
      return JSON.parse(out);
    },

    /** Lightweight syntax check (compile only, no run) for the code buddy. */
    async checkSyntax(code) {
      if (!this.ready) return { ok: true };
      try {
        this.pyodide.globals.set("__chk", code);
        const res = await this.pyodide.runPythonAsync("check_syntax(__chk)");
        try { this.pyodide.globals.delete("__chk"); } catch (e) {}
        return { ok: res === "", error: res };
      } catch (e) { return { ok: true }; }
    },
  };

  function cleanup(py) {
    try {
      py.globals.delete("__src");
      py.globals.delete("__tests");
      py.globals.delete("__stdin");
      py.globals.delete("__preexec");
    } catch (e) { /* noop */ }
  }

  Runtime.key = "python";
  Runtime.label = "CPython 3.12";
  Runtime.editorMode = "python";
  Runtime.tag = "CPython 3.12 · WASM";
  Runtime.note = "Real CPython compiled to WebAssembly (Pyodide).";

  window.Runtime = Runtime;
  window.Runtimes = window.Runtimes || {};
  window.Runtimes.python = Runtime;
})();
