import json, os, sys, time
here = os.path.dirname(os.path.abspath(__file__))
print("py", sys.version.split()[0], flush=True)
harness = open(os.path.join(here, "harness.py"), encoding="utf-8").read()
G = {}
t0 = time.time()
exec(harness, G)
print("harness exec ok in %.2fs" % (time.time() - t0), flush=True)
grade = G["grade"]

# one function exercise
sol = "def amplify(signal):\n    return signal * 2\n"
tests = [{"name": "x", "code": "assert amplify(21)==42"}]
t0 = time.time()
r = grade(sol, tests, True)
print("function grade:", r["all_ok"], "in %.2fs" % (time.time() - t0), flush=True)

# one script exercise
sol2 = 'print("hello")\n'
tests2 = [{"name": "y", "needs_ns": False, "code": 'out=_run([])\nassert "hello" in out'}]
t0 = time.time()
r2 = grade(sol2, tests2, False)
print("script grade:", r2["all_ok"], "in %.2fs" % (time.time() - t0), flush=True)

# GUARD TEST A: infinite loop INSIDE a function, called from test code
sol3 = "def spin():\n    while True:\n        pass\n    return 1\n"
tests3 = [{"name": "halts", "code": "assert spin()==1"}]
t0 = time.time()
r3 = grade(sol3, tests3, True)
dt = time.time() - t0
halted = (not r3["all_ok"]) and ("HALTED" in (r3["results"][0]["msg"]))
print("guard(func-loop): halted=%s in %.2fs" % (halted, dt), flush=True)

# GUARD TEST B: infinite loop in a SCRIPT program
sol4 = "while True:\n    pass\n"
tests4 = [{"name": "halts", "needs_ns": False, "code": "out=_run([])\nassert out==''"}]
t0 = time.time()
r4 = grade(sol4, tests4, False)
dt = time.time() - t0
haltedB = not r4["all_ok"]
print("guard(script-loop): halted=%s in %.2fs" % (haltedB, dt), flush=True)
print("DIAG DONE", flush=True)
