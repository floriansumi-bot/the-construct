# Runs every reference solution (and every starter) through the EXACT grading
# harness shipped in runtime.js, on real CPython. Proves the in-browser tests
# are correct: solutions must pass all tests; starters must NOT pass all.
import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
harness = open(os.path.join(here, "harness.py"), encoding="utf-8").read()
G = {}
exec(harness, G)
grade = G["grade"]

cur = json.load(open(os.path.join(here, "curriculum.json"), encoding="utf-8"))

issues = []
n_ex = 0
for mod in cur["modules"]:
    for ex in mod["exercises"]:
        n_ex += 1
        preexec = ex.get("kind") != "script"
        tests = ex["tests"]

        # 1) reference solution must clear all tests
        res = grade(ex["solution"], tests, preexec)
        if not res["all_ok"]:
            bad = [r for r in res["results"] if not r["ok"]]
            issues.append(("SOLUTION_FAIL", mod["code"], ex["id"], bad, res.get("preexec_error")))

        # 2) starter must NOT clear all tests (otherwise the test is vacuous)
        sres = grade(ex.get("starter", ""), tests, preexec)
        if sres["all_ok"]:
            issues.append(("STARTER_PASSES", mod["code"], ex["id"], [], None))

print("exercises checked:", n_ex)
print("issues:", len(issues))
print("=" * 60)
for kind, code, exid, bad, pe in issues:
    print(f"[{kind}] sector {code} :: {exid}")
    if pe:
        print("   preexec_error:")
        for ln in pe.splitlines():
            print("     " + ln)
    for r in bad:
        print("   ✘ test:", r["name"])
        for ln in (r["msg"] or "").splitlines():
            print("       " + ln)
    print("-" * 60)

if not issues:
    print("ALL SOLUTIONS PASS · ALL STARTERS FAIL · harness verified ✅")
    sys.exit(0)
sys.exit(1)
