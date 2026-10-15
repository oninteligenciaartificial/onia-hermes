import json
import os
import tempfile
import threading
import time
import unittest

import development_job as dj

GOOD = {"state": "ok", "observed_model": None, "response_sha256": "a" * 64,
        "usage": None, "tools": []}


class Harness:
    def __init__(self, case):
        self.tmp = os.path.realpath(tempfile.mkdtemp())  # ancestors must not be links
        case.addCleanup(self._rm)
        self.state = os.path.join(self.tmp, "state")
        self.ws = os.path.join(self.tmp, "ws")
        os.mkdir(self.ws)
        self.fallback = self.exe("fallback.exe")
        self.primary_missing = os.path.join(self.tmp, "absent.exe")
        self.executed, self.preflights = [], []
        self.pre = {}
        self.cb = lambda p, e, r: dict(GOOD)

    def _rm(self):
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def exe(self, name):
        path = os.path.join(self.tmp, name)
        with open(path, "w") as f:
            f.write("x")
        os.chmod(path, 0o755)
        return path

    def req(self, task="t1", attempt="a1"):
        return {"task_id": task, "attempt_id": attempt, "operation": "development",
                "workspace": self.ws, "prompt": "SECRET PROMPT TEXT"}

    def preflight(self, provider, exe, ws):
        self.preflights.append(provider)
        return self.pre.get(provider, {"ok": True, "auth": True})

    def execute(self, provider, exe, request):
        self.executed.append(provider)
        return self.cb(provider, exe, request)

    def run(self, primary=None, request=None, **kw):
        return dj.run_job(request or self.req(), self.state, primary or self.primary_missing,
                          self.fallback, self.execute, self.preflight, **kw)

    def read(self, kind, name):
        with open(os.path.join(self.state, kind, name + ".json"), encoding="utf-8") as f:
            return json.load(f)


class DevelopmentJobTests(unittest.TestCase):
    def setUp(self):
        self.h = Harness(self)

    def test_missing_primary_runs_fallback_exactly_once(self):
        r = self.h.run()
        self.assertEqual(r["status"], "completed")
        self.assertEqual(self.h.executed, ["fallback"])
        self.assertEqual(self.h.preflights, ["fallback"])

    def test_existing_primary_used_and_no_fallback(self):
        primary = self.h.exe("primary.exe")
        self.assertEqual(self.h.run(primary)["provider"], "primary")
        self.assertEqual(self.h.executed, ["primary"])

    def test_primary_auth_failure_never_falls_back(self):
        primary = self.h.exe("primary.exe")
        self.h.pre["primary"] = {"ok": True, "auth": False}
        r = self.h.run(primary)
        self.assertEqual(r["status"], "stopped")
        self.assertEqual(self.h.executed, [])
        self.assertEqual(self.h.preflights, ["primary"])

    def test_primary_preflight_error_never_falls_back(self):
        primary = self.h.exe("primary.exe")
        self.h.pre["primary"] = {"ok": False, "error": "version_bad", "auth": True}
        r = self.h.run(primary)
        self.assertEqual((r["status"], r["error"]), ("stopped", "version_bad"))
        self.assertEqual(self.h.executed, [])

    def test_preflight_exception_and_malformed_stop(self):
        primary = self.h.exe("primary.exe")
        self.h.pre["primary"] = "garbage"
        self.assertEqual(self.h.run(primary)["status"], "stopped")
        self.h.pre["primary"] = {"ok": True, "auth": "yes"}
        self.assertEqual(self.h.run(primary, self.h.req("t2"))["status"], "stopped")
        self.assertEqual(self.h.executed, [])

    def test_fallback_needs_auth_and_preflight(self):
        self.h.pre["fallback"] = {"ok": True, "auth": False}
        self.assertEqual(self.h.run()["status"], "stopped")
        self.h.pre["fallback"] = {"ok": False, "error": "nope", "auth": True}
        self.assertEqual(self.h.run()["status"], "stopped")
        self.assertEqual(self.h.executed, [])

    def test_preflight_failure_does_not_consume_task(self):
        self.h.pre["fallback"] = {"ok": False, "error": "nope", "auth": True}
        self.h.run()
        self.h.pre.clear()
        self.assertEqual(self.h.run(request=self.h.req(attempt="a2"))["status"], "completed")

    def test_missing_fallback_stops(self):
        os.remove(self.h.fallback)
        self.assertEqual(self.h.run()["status"], "stopped")
        self.assertEqual(self.h.executed, [])

    def test_primary_present_but_not_executable_does_not_fall_back(self):
        if os.name == "nt":
            self.skipTest("execute bit not modelled on Windows")
        primary = self.h.exe("primary.exe")
        os.chmod(primary, 0o644)
        self.assertEqual(self.h.run(primary)["status"], "stopped")
        self.assertEqual(self.h.executed, [])

    def test_no_replay_with_new_attempt(self):
        self.assertEqual(self.h.run()["status"], "completed")
        r = self.h.run(request=self.h.req(attempt="a2"))
        self.assertEqual(r["status"], "consumed")
        self.assertEqual(self.h.executed, ["fallback"])

    def test_concurrent_invocations_single_execution(self):
        barrier, out = threading.Barrier(2), []

        def slow(p, e, r):
            time.sleep(0.3)
            return dict(GOOD)
        self.h.cb = slow

        def go(attempt):
            barrier.wait()
            out.append(self.h.run(request=self.h.req(attempt=attempt))["status"])
        ts = [threading.Thread(target=go, args=(a,)) for a in ("a1", "a2")]
        [t.start() for t in ts]
        [t.join() for t in ts]
        self.assertEqual(sorted(out), ["completed", "consumed"])
        self.assertEqual(self.h.executed, ["fallback"])

    def test_callback_exception_is_reconcile_and_consumed(self):
        def boom(p, e, r):
            raise TimeoutError("slow")
        self.h.cb = boom
        r = self.h.run()
        self.assertEqual(r["status"], "needs_reconcile")
        self.assertEqual(self.h.read("attempts", "t1/a1")["state"], "needs_reconcile")
        self.assertEqual(self.h.run(request=self.h.req(attempt="a2"))["status"], "consumed")
        self.assertEqual(self.h.executed, ["fallback"])
        self.assertFalse(os.path.exists(os.path.join(self.h.state, "results", "t1", "a1.json")))

    def test_postdispatch_failure_on_primary_never_runs_fallback(self):
        primary = self.h.exe("primary.exe")

        def boom(p, e, r):
            raise RuntimeError("died mid-run")
        self.h.cb = boom
        self.assertEqual(self.h.run(primary)["status"], "needs_reconcile")
        self.assertEqual(self.h.run(primary, self.h.req(attempt="a2"))["status"], "consumed")
        self.assertEqual(self.h.executed, ["primary"])

    def test_ambiguous_results_need_reconcile(self):
        bad = [None, {"state": "ok"}, dict(GOOD, response_sha256="zz"),
               dict(GOOD, tools="x"), dict(GOOD, state="error"), dict(GOOD, usage={"a": "b"})]
        for i, b in enumerate(bad):
            self.h.cb = lambda p, e, r, b=b: b
            self.assertEqual(self.h.run(request=self.h.req(task=f"b{i}"))["status"],
                             "needs_reconcile", b)

    def test_markers_exist_before_callback_effect(self):
        seen = {}

        def probe(p, e, r):
            seen["task"] = self.h.read("tasks", "t1")
            seen["attempt"] = self.h.read("attempts", "t1/a1")
            seen["result"] = os.path.exists(os.path.join(self.h.state, "results", "t1", "a1.json"))
            return dict(GOOD)
        self.h.cb = probe
        self.h.run()
        self.assertEqual(seen["task"]["state"], "reserved")
        self.assertEqual(seen["attempt"]["state"], "dispatching")
        self.assertFalse(seen["result"])

    def test_result_receipt_separate_and_preserves_fields_without_prompt(self):
        self.h.cb = lambda p, e, r: dict(GOOD, observed_model="m-1", usage={"in": 3, "out": None},
                                         tools=["read"], extra="leak")
        self.h.run()
        res = self.h.read("results", "t1/a1")
        self.assertEqual((res["observed_model"], res["usage"], res["tools"], res["response_sha256"]),
                         ("m-1", {"in": 3, "out": None}, ["read"], "a" * 64))
        self.assertTrue(res["model_observed"])
        self.assertNotIn("extra", res)
        self.assertEqual(self.h.read("attempts", "t1/a1")["state"], "completed")
        for kind, name in (("tasks", "t1"), ("attempts", "t1/a1"), ("results", "t1/a1")):
            p = os.path.join(self.h.state, kind, name + ".json")
            with open(p, encoding="utf-8") as f:
                self.assertNotIn("SECRET PROMPT", f.read())

    def test_dry_run_has_no_effect(self):
        self.assertEqual(self.h.run(dry_run=True)["status"], "dry_run")
        self.assertEqual(self.h.executed, [])
        self.assertEqual(self.h.run()["status"], "completed")

    def test_input_validation(self):
        for patch in ({"task_id": "../x"}, {"attempt_id": "a/b"}, {"task_id": ""},
                      {"operation": "review"}, {"prompt": "x" * (dj.MAX_PROMPT + 1)},
                      {"workspace": "relative"}, {"workspace": os.path.join(self.h.tmp, "nope")}):
            with self.assertRaises(dj.JobError, msg=patch):
                self.h.run(request=dict(self.h.req(), **patch))
        self.assertEqual(self.h.executed, [])

    def test_symlink_workspace_and_state_rejected(self):
        link_ws, link_state = os.path.join(self.h.tmp, "lws"), os.path.join(self.h.tmp, "lst")
        try:
            os.symlink(self.h.ws, link_ws, target_is_directory=True)
            os.symlink(self.h.ws, link_state, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest("symlinks unavailable")
        with self.assertRaises(dj.JobError):
            self.h.run(request=dict(self.h.req(), workspace=link_ws))
        with self.assertRaises(dj.JobError):
            dj.run_job(self.h.req(), link_state, self.h.primary_missing, self.h.fallback,
                       self.h.execute, self.h.preflight)
        self.assertEqual(self.h.executed, [])

    def test_finalization_failure_is_needs_reconcile(self):
        real = dj._replace

        def fail(path, data):
            raise OSError("disk full")
        dj._replace = fail
        try:
            r = self.h.run()
        finally:
            dj._replace = real
        self.assertEqual((r["status"], r["error"]), ("needs_reconcile", "finalize_failed"))
        self.assertEqual(self.h.read("attempts", "t1/a1")["state"], "dispatching")
        self.assertEqual(self.h.run(request=self.h.req(attempt="a2"))["status"], "consumed")
        self.assertEqual(self.h.executed, ["fallback"])

    def test_reservation_oserror_needs_reconcile_and_blocks_retry(self):
        real = dj._write_new

        def partial(path, data):
            if os.sep + "tasks" + os.sep in path:
                with open(path, "w") as f:
                    f.write("{")  # partial reservation left behind
                raise OSError("disk full: secret detail")
            return real(path, data)
        dj._write_new = partial
        try:
            r = self.h.run()
        finally:
            dj._write_new = real
        self.assertEqual((r["status"], r["error"]), ("needs_reconcile", "reservation_write_failed"))
        self.assertNotIn("secret", json.dumps(r))
        self.assertEqual((self.h.executed, self.h.preflights), ([], ["fallback"]))
        r2 = self.h.run(request=self.h.req(attempt="a2"))
        self.assertEqual(r2["status"], "consumed")
        self.assertEqual(self.h.executed, [])

    def test_nonfinite_usage_rejected_and_never_persisted(self):
        for bad in (float("nan"), float("inf"), float("-inf")):
            h = Harness(self)
            h.cb = lambda p, e, r, bad=bad: dict(GOOD, usage={"tokens": bad})
            r = h.run()
            self.assertEqual(r["status"], "needs_reconcile")
            self.assertEqual(h.executed, ["fallback"])
            self.assertFalse(os.path.exists(os.path.join(h.state, "results", "t1", "a1.json")))
        self.assertIsNone(dj._sanitize_result(dict(GOOD, usage={"x": True})))
        self.assertIsNotNone(dj._sanitize_result(dict(GOOD, usage={"x": 1, "y": 1.5, "z": None})))

    def test_nonfinite_cannot_serialize_and_persist_failure_fails_closed(self):
        with self.assertRaises(ValueError):
            dj._write_new(os.path.join(self.h.tmp, "nan.json"), {"v": float("nan")})
        real = dj._sanitize_result
        dj._sanitize_result = lambda res: dict(GOOD, usage={"v": float("nan")})
        try:
            r = self.h.run()
        finally:
            dj._sanitize_result = real
        self.assertEqual(r["status"], "needs_reconcile")
        self.assertEqual(self.h.executed, ["fallback"])
        self.assertEqual(self.h.run(request=self.h.req(attempt="a2"))["status"], "consumed")
        self.assertEqual(self.h.executed, ["fallback"])

    def test_dry_run_writes_nothing(self):
        self.assertFalse(os.path.exists(self.h.state))
        self.assertEqual(self.h.run(dry_run=True)["status"], "dry_run")
        self.assertFalse(os.path.exists(self.h.state))

    def test_ancestor_symlink_rejected_before_mkdir(self):
        real = os.path.join(self.h.tmp, "real")
        link = os.path.join(self.h.tmp, "link")
        os.mkdir(real)
        try:
            os.symlink(real, link, target_is_directory=True)
        except (OSError, NotImplementedError):
            self.skipTest("symlinks unavailable")
        with self.assertRaises(dj.JobError):
            dj.run_job(self.h.req(), os.path.join(link, "new", "state"), self.h.primary_missing,
                       self.h.fallback, self.h.execute, self.h.preflight)
        self.assertEqual(os.listdir(real), [])
        self.assertEqual(self.h.executed, [])

    def test_injected_ancestor_reparse_rejected_before_mkdir(self):
        bad = os.path.join(self.h.tmp, "junction")
        os.mkdir(bad)
        real = dj._is_reparse
        dj._is_reparse = lambda p: os.path.normcase(p) == os.path.normcase(bad) or real(p)
        try:
            with self.assertRaises(dj.JobError):
                dj.run_job(self.h.req(), os.path.join(bad, "a", "b"), self.h.primary_missing,
                           self.h.fallback, self.h.execute, self.h.preflight)
        finally:
            dj._is_reparse = real
        self.assertEqual(os.listdir(bad), [])

    def test_id_fullmatch_and_windows_devices_rejected(self):
        for bad in ("t1\n", "CON", "con", "Nul", "COM1", "lpt9", "Aux"):
            for key in ("task_id", "attempt_id"):
                with self.assertRaises(dj.JobError, msg=(key, bad)):
                    self.h.run(request=dict(self.h.req(), **{key: bad}))
        self.assertEqual(self.h.executed, [])

    def test_relative_executable_paths_invalid_and_never_fallback(self):
        r = self.h.run(primary="claude")
        self.assertEqual((r["status"], r["error"]), ("stopped", "primary_path_invalid"))
        r = dj.run_job(self.h.req(), self.h.state, self.h.primary_missing, "codex",
                       self.h.execute, self.h.preflight)
        self.assertEqual((r["status"], r["error"]), ("stopped", "fallback_path_invalid"))
        self.assertEqual((self.h.executed, self.h.preflights), ([], []))

    def test_joined_ids_do_not_collide(self):
        for t, a in (("a__b", "c"), ("a", "b__c")):
            self.assertEqual(self.h.run(request=self.h.req(task=t, attempt=a))["status"], "completed")
        self.assertEqual(self.h.read("results", "a__b/c")["task_id"], "a__b")
        self.assertEqual(self.h.read("results", "a/b__c")["task_id"], "a")

    def test_unknown_model_stays_unknown(self):
        self.h.run()
        res = self.h.read("results", "t1/a1")
        self.assertIsNone(res["observed_model"])
        self.assertFalse(res["model_observed"])

    def test_prompt_limit_is_utf8_bytes(self):
        big = "é" * (dj.MAX_PROMPT // 2 + 1)  # under MAX_PROMPT chars, over in bytes
        self.assertLess(len(big), dj.MAX_PROMPT)
        with self.assertRaises(dj.JobError):
            self.h.run(request=dict(self.h.req(), prompt=big))
        self.assertEqual(self.h.run(request=dict(self.h.req(), prompt="é" * (dj.MAX_PROMPT // 2)))
                         ["status"], "completed")


if __name__ == "__main__":
    unittest.main()
