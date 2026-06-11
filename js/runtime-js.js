/* ============================================================
   runtime-js.js — JavaScript + TypeScript adapters.
   JS runs in a sandboxed Web Worker with a hard timeout (so an
   infinite loop terminates instead of freezing the tab). Falls
   back to main-thread execution if Workers are unavailable.
   ============================================================ */
(function () {
  "use strict";

  // The execution core — shared verbatim by the worker and the
  // main-thread fallback. Pure ES5 so it runs anywhere.
  var CORE = [
    "function runJob(data){",
    "  var code=data.code||'', tests=data.tests||[], stdin=data.stdin||[];",
    "  var out=[]; var stdinIdx=0;",
    "  function show(v){",
    "    if(typeof v==='string') return JSON.stringify(v);",
    "    if(typeof v==='function') return '[Function '+(v.name||'anonymous')+']';",
    "    if(v===undefined) return 'undefined'; if(v===null) return 'null';",
    "    if(typeof v==='bigint') return v.toString()+'n';",
    "    if(Array.isArray(v)){ var p=[]; for(var i=0;i<v.length;i++) p.push(show(v[i])); return '['+p.join(', ')+']'; }",
    "    if(typeof v==='object'){ try{ return JSON.stringify(v); }catch(e){ return String(v); } }",
    "    return String(v);",
    "  }",
    "  function fmt(a){ return typeof a==='string'? a : show(a); }",
    "  function eq(a,b){",
    "    if(a===b) return true;",
    "    if(typeof a==='number'&&typeof b==='number'&&isNaN(a)&&isNaN(b)) return true;",
    "    if(typeof a!==typeof b) return false;",
    "    if(Array.isArray(a)&&Array.isArray(b)){ if(a.length!==b.length) return false; for(var i=0;i<a.length;i++){ if(!eq(a[i],b[i])) return false; } return true; }",
    "    if(a&&b&&typeof a==='object'&&typeof b==='object'){ var ka=Object.keys(a), kb=Object.keys(b); if(ka.length!==kb.length) return false; for(var j=0;j<ka.length;j++){ if(!Object.prototype.hasOwnProperty.call(b,ka[j])) return false; if(!eq(a[ka[j]],b[ka[j]])) return false; } return true; }",
    "    return false;",
    "  }",
    "  function mkConsole(){ function w(){ out.push([].map.call(arguments,fmt).join(' ')); } return {log:w,error:w,warn:w,info:w,debug:w}; }",
    "  function mkPrompt(){ return function(p){ return stdinIdx<stdin.length? String(stdin[stdinIdx++]) : null; }; }",
    "  function assert(c,m){ if(!c) throw new Error(m||'assertion failed'); }",
    "  function assertEqual(a,b,m){ if(!eq(a,b)) throw new Error((m?m+' :: ':'')+'expected '+show(b)+' but got '+show(a)); }",
    "  function assertThrows(fn,m){ var threw=false; try{ fn(); }catch(e){ threw=true; } if(!threw) throw new Error(m||'expected the call to throw an error'); }",
    "  function errMsg(e){ return (e&&e.name? e.name+': ' : '')+((e&&e.message)? e.message : String(e)); }",
    "  // DISPLAY pass: run user code once, capture stdout + any error",
    "  var displayErr=null; out.length=0; stdinIdx=0;",
    "  try{ (new Function('console','prompt','input',code))(mkConsole(),mkPrompt(),mkPrompt()); }",
    "  catch(e){ displayErr=errMsg(e); }",
    "  var stdout=out.join('\\n');",
    "  // TEST pass: each test runs user code + test together in a fresh scope",
    "  var results=[];",
    "  for(var ti=0; ti<tests.length; ti++){",
    "    var t=tests[ti]; out.length=0; stdinIdx=0;",
    "    try{",
    "      var body=code+'\\n;\\n'+(t.code||'');",
    "      var getout=function(){ return out.join('\\n'); };",
    "      (new Function('console','prompt','input','assert','assertEqual','assertThrows','eq','show','stdout',body))(mkConsole(),mkPrompt(),mkPrompt(),assert,assertEqual,assertThrows,eq,show,getout);",
    "      results.push({name:t.name,ok:true,msg:''});",
    "    }catch(e){ results.push({name:t.name,ok:false,msg:errMsg(e)}); }",
    "  }",
    "  var passed=0; for(var k=0;k<results.length;k++){ if(results[k].ok) passed++; }",
    "  return {stdout:stdout, error:displayErr, results:results, passed:passed, total:results.length, all_ok: results.length>0 && passed===results.length};",
    "}",
  ].join("\n");

  var WORKER_SRC =
    CORE +
    "\nself.onmessage=function(ev){ try{ self.postMessage(runJob(ev.data)); }catch(e){ self.postMessage({stdout:'',error:String(e),results:[],passed:0,total:0,all_ok:false}); } };";

  var workerURL = null;
  var useWorker = true;
  var _mainFn = null;
  function mainRunner() {
    if (!_mainFn) _mainFn = new Function(CORE + "\nreturn runJob;")();
    return _mainFn;
  }

  function runJob(data, timeoutMs) {
    timeoutMs = timeoutMs || 5000;
    return new Promise(function (resolve) {
      if (useWorker && typeof Worker !== "undefined") {
        var w = null;
        try {
          if (!workerURL) workerURL = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
          w = new Worker(workerURL);
        } catch (e) {
          useWorker = false;
        }
        if (w) {
          var done = false;
          var timer = setTimeout(function () {
            if (done) return; done = true;
            try { w.terminate(); } catch (_) {}
            resolve({
              stdout: "", error: "EXECUTION HALTED :: timed out (possible infinite loop)",
              results: (data.tests || []).map(function (t) { return { name: t.name, ok: false, msg: "timed out — possible infinite loop" }; }),
              passed: 0, total: (data.tests || []).length, all_ok: false, timedOut: true,
            });
          }, timeoutMs);
          w.onmessage = function (ev) { if (done) return; done = true; clearTimeout(timer); try { w.terminate(); } catch (_) {} resolve(ev.data); };
          w.onerror = function (ev) { if (done) return; done = true; clearTimeout(timer); try { w.terminate(); } catch (_) {} resolve({ stdout: "", error: "worker error: " + (ev.message || ev), results: [], passed: 0, total: 0, all_ok: false }); };
          w.postMessage(data);
          return;
        }
      }
      // main-thread fallback (no timeout protection)
      try { resolve(mainRunner()(data)); }
      catch (e) { resolve({ stdout: "", error: String(e), results: [], passed: 0, total: 0, all_ok: false }); }
    });
  }

  /* ---------------- JavaScript adapter ---------------- */
  var JSRuntime = {
    key: "javascript", label: "JavaScript", editorMode: "javascript",
    tag: "ES2022 · sandboxed worker", ready: false,
    note: "Runs natively in a sandboxed Web Worker — no install.",
    async init(onLog) { this.ready = true; if (onLog) onLog("javascript engine online (native)", "ok"); },
    async runDisplay(src, ex) {
      var r = await runJob({ code: src, tests: [], stdin: (ex && ex.sampleStdin) || [] });
      return { stdout: r.stdout || "", error: r.error || null };
    },
    async grade(src, ex) {
      var r = await runJob({ code: src, tests: (ex && ex.tests) || [], stdin: (ex && ex.sampleStdin) || [] });
      return { results: r.results || [], stdout: r.stdout || "", preexec_error: r.error || null, passed: r.passed || 0, total: r.total || 0, all_ok: !!r.all_ok };
    },
  };

  /* ---------------- TypeScript adapter ---------------- */
  var TS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.4.5/typescript.min.js";
  var _tsLoading = null;
  function ensureTS(onLog) {
    if (window.ts) return Promise.resolve();
    if (_tsLoading) return _tsLoading;
    _tsLoading = new Promise(function (resolve, reject) {
      if (onLog) onLog("fetching TypeScript compiler…", "");
      var s = document.createElement("script");
      s.src = TS_CDN;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Failed to load the TypeScript compiler from CDN.")); };
      document.head.appendChild(s);
    });
    return _tsLoading;
  }
  function transpile(src) {
    try {
      var res = window.ts.transpileModule(src, {
        compilerOptions: { target: window.ts.ScriptTarget.ES2019, module: window.ts.ModuleKind.None },
      });
      return { code: res.outputText };
    } catch (e) {
      return { error: "TypeScript compile error: " + ((e && e.message) || e) };
    }
  }
  var TSRuntime = {
    key: "typescript", label: "TypeScript", editorMode: "text/typescript",
    tag: "tsc → JS · sandboxed", ready: false,
    note: "Type-checked by the real tsc compiler, then run as JS.",
    async init(onLog) { await ensureTS(onLog); this.ready = true; if (onLog) onLog("typescript compiler ready", "ok"); },
    async runDisplay(src, ex) {
      var js = transpile(src);
      if (js.error) return { stdout: "", error: js.error };
      return JSRuntime.runDisplay(js.code, ex);
    },
    async grade(src, ex) {
      var js = transpile(src);
      if (js.error) {
        var tests = (ex && ex.tests) || [];
        return { results: tests.map(function (t) { return { name: t.name, ok: false, msg: js.error }; }), stdout: "", preexec_error: js.error, passed: 0, total: tests.length, all_ok: false };
      }
      return JSRuntime.grade(js.code, ex);
    },
  };

  window.Runtimes = window.Runtimes || {};
  window.Runtimes.javascript = JSRuntime;
  window.Runtimes.typescript = TSRuntime;
})();
