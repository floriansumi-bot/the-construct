# Verifies the patched tests: correct solutions PASS (incl. input-prompts/floats),
# wrong solutions FAIL. Mirrors the real grader's _run/_src injection.
import io, sys, contextlib

def run_solution(src, stdin_lines):
    inp = iter(stdin_lines)
    out = io.StringIO()
    def fake_input(prompt=""):
        sys.stdout.write(str(prompt))   # real input() echoes the prompt to stdout
        return next(inp)
    g = {"input": fake_input, "__name__": "__main__"}
    with contextlib.redirect_stdout(out):
        exec(compile(src, "<sol>", "exec"), g)
    return out.getvalue()

def grade(src, test_code, kind="script"):
    ns = {"_src": src}
    if kind == "function":
        g = {"__name__": "__c__"}
        exec(compile(src, "<sol>", "exec"), g)
        ns.update(g)
    ns["_run"] = lambda stdin=None: run_solution(src, stdin or [])
    ns["_src"] = src
    try:
        exec(compile(test_code, "<test>", "exec"), ns)
        return "PASS"
    except AssertionError as e:
        return "FAIL(assert): " + str(e)[:60]
    except Exception as e:
        return "FAIL(error): " + repr(e)[:60]

WARP_T1 = r'''import re as _re
out=_run(["7","35"])
nums=_re.findall(r"-?\d+\.?\d*", out)
assert nums and float(nums[-1])==42, "The last number printed should be 42. Got: "+repr(out)'''
WARP_T2 = r'''import re as _re
out=_run(["10","20"])
nums=_re.findall(r"-?\d+\.?\d*", out)
assert nums and float(nums[-1])==30, "Should print 30. Got: "+repr(out)'''
AVG_T1 = r'''import re as _re
out=_run(['10','20'])
nums=_re.findall(r"-?\d+\.?\d*", out)
assert nums and float(nums[-1])==15.0, 'Got: '+repr(out)'''
AVG_T2 = r'''import re as _re
out=_run(['2','3'])
nums=_re.findall(r"-?\d+\.?\d*", out)
assert nums and float(nums[-1])==2.5, 'Got '+repr(out)'''
REC_GUARD = r'''import re as _re
_code=_re.sub(r"#.*", "", _src)
assert "for " not in _code and "while " not in _code, "Solve it with recursion, not a loop."'''

def show(label, src, tests, kind="script"):
    res = [grade(src, t, kind) for t in tests]
    print(("  PASS " if all(r=="PASS" for r in res) else "  ---- "), label, "::", res)

print("vars-warp (expect first 3 PASS, last FAIL):")
show("int sol", "print(int(input())+int(input()))", [WARP_T1, WARP_T2])
show("float sol (robust)", "print(float(input())+float(input()))", [WARP_T1, WARP_T2])
show("input-prompt sol (robust)", "a=int(input('a: '))\nb=int(input('b: '))\nprint(a+b)", [WARP_T1, WARP_T2])
show("string-concat (WRONG->FAIL)", "print(input()+input())", [WARP_T1, WARP_T2])

print("vars-average (expect float PASS, int FAIL on 2.5):")
show("float sol", "print((float(input())+float(input()))/2)", [AVG_T1, AVG_T2])
show("prompt sol (robust)", "a=float(input('x'))\nb=float(input('y'))\nprint((a+b)/2)", [AVG_T1, AVG_T2])
show("int sol (WRONG->FAIL on 2.5)", "print((int(input())+int(input()))//2)", [AVG_T1, AVG_T2])

print("func-recurse-countdown guard (expect recursion PASS incl. comment, loop FAIL):")
show("recursion", "def countdown(n):\n return [0] if n==0 else [n]+countdown(n-1)", [REC_GUARD], "function")
show("recursion + 'for' in comment (robust)", "def countdown(n):\n # works for n>=0\n return [0] if n==0 else [n]+countdown(n-1)", [REC_GUARD], "function")
show("loop sol (WRONG->FAIL)", "def countdown(n):\n out=[]\n for i in range(n,-1,-1): out.append(i)\n return out", [REC_GUARD], "function")
