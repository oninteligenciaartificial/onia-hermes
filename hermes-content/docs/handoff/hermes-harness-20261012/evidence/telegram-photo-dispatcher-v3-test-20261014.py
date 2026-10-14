import base64
import contextlib
import hashlib
import io
import json
import sqlite3
import subprocess
import sys
import tempfile
from types import SimpleNamespace
import unittest
from pathlib import Path
from unittest.mock import patch

import dispatcher


def directory(*rows):
    return {"platforms": {"telegram": list(rows)}}


class DispatcherTests(unittest.TestCase):
    def test_owner_resolution_requires_one_exact_alias(self):
        self.assertEqual(dispatcher.resolve_owner_chat(directory({"name": "Sergio Urcullo", "id": "123456"})), "123456")
        with self.assertRaises(ValueError):
            dispatcher.resolve_owner_chat(directory({"name": "Sergio Urcullo", "id": "123456"}, {"name": "Sergio Urcullo", "id": "654321"}))
        with self.assertRaises(ValueError):
            dispatcher.resolve_owner_chat(directory({"name": "Sergio", "id": "123456"}))
        with self.assertRaises(ValueError):
            dispatcher.resolve_owner_chat(directory({"name": "Sergio Urcullo", "id": "channel"}))

    def test_identity_requires_exact_bot_and_private_owner(self):
        me = {"ok": True, "result": {"is_bot": True, "username": "aalfredhq_bot"}}
        chat = {"ok": True, "result": {"id": 123456, "type": "private", "first_name": "Sergio", "last_name": "Urcullo"}}
        dispatcher.validate_identity(me, chat, "123456")
        for bad_chat in (
            {"ok": True, "result": {**chat["result"], "type": "group"}},
            {"ok": True, "result": {**chat["result"], "first_name": "Other"}},
            {"ok": True, "result": {**chat["result"], "id": 999}},
        ):
            with self.assertRaises(ValueError):
                dispatcher.validate_identity(me, bad_chat, "123456")

    def test_payload_is_fixed_text_and_chat_only(self):
        payload = dispatcher.build_payload("-123456")
        self.assertEqual(payload, {"chat_id": -123456, "text": dispatcher.MESSAGE})
        self.assertNotIn("parse_mode", payload)

    def test_success_receipt_requires_exact_chat_and_text(self):
        good = {"ok": True, "result": {"message_id": 77, "date": 1791840000, "chat": {"id": 123456}, "text": dispatcher.MESSAGE}}
        receipt = dispatcher.parse_send_receipt(200, good, "123456")
        self.assertEqual(receipt["recipient"], "Sergio Urcullo")
        self.assertNotIn("message_id", receipt)
        for bad in (
            {"ok": True, "result": {**good["result"], "chat": {"id": 1}}},
            {"ok": True, "result": {**good["result"], "text": "different"}},
            {"ok": False, "description": "redacted"},
        ):
            with self.assertRaises(ValueError):
                dispatcher.parse_send_receipt(200, bad, "123456")

    def test_single_attempt_never_retries_ambiguous_error(self):
        calls = []
        def timeout(_payload):
            calls.append(1)
            raise TimeoutError("synthetic ambiguous timeout")
        state, receipt = dispatcher.single_attempt(timeout, dispatcher.build_payload("123456"), "123456")
        self.assertEqual(calls, [1])
        self.assertEqual(state, "needs_reconcile")
        self.assertIsNone(receipt)

    def test_nonce_ledger_refuses_replay(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "ledger.sqlite3"
            self.assertTrue(dispatcher.ledger_reserve(path, "synthetic-nonce"))
            self.assertFalse(dispatcher.ledger_reserve(path, "synthetic-nonce"))

    def test_media_policy_accepts_only_local_allowlisted_bounded_files(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp).resolve()
            good = root / "panel.html"
            good.write_text("<html>fixture</html>", encoding="utf-8")
            result = dispatcher.validate_media_path(str(good), root)
            self.assertEqual(result[1], "text/html")
            self.assertGreater(result[2], 0)
            with self.assertRaises(ValueError):
                dispatcher.validate_media_path("https://example.invalid/panel.html", root)
            (root / "untrusted.exe").write_text("fixture", encoding="utf-8")
            with self.assertRaises(ValueError):
                dispatcher.validate_media_path(str(root / "untrusted.exe"), root)
            with self.assertRaises(ValueError):
                dispatcher.validate_media_path(str(Path(temp).parent / "outside.html"), root)

    def test_media_policy_rejects_symlinks_and_oversize(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp).resolve()
            target = root / "real.html"
            target.write_text("ok", encoding="utf-8")
            link = root / "linked.html"
            link.write_text("fixture", encoding="utf-8")
            original = Path.is_symlink
            def symlink_fixture(path):
                return path.name == "linked.html" or original(path)
            with patch.object(Path, "is_symlink", autospec=True, side_effect=symlink_fixture):
                with self.assertRaisesRegex(ValueError, "symlink media path"):
                    dispatcher.validate_media_path(str(link), root)
            large = root / "large.html"
            large.write_bytes(b"x" * (dispatcher.MAX_MEDIA_BYTES + 1))
            with self.assertRaises(ValueError):
                dispatcher.validate_media_path(str(large), root)

    def test_local_send_path_requires_complete_receipt_and_reserves_before_call(self):
        with tempfile.TemporaryDirectory() as temp:
            ledger = Path(temp) / "ledger.sqlite3"
            receipt = {
                "status": "accepted",
                "recipient": "Sergio Urcullo",
                "message_id_sha256": "a" * 64,
                "sent_at_utc": "2026-10-14T03:30:00+00:00",
                "text_sha256": dispatcher.sha256_text(dispatcher.MESSAGE),
            }
            with patch.object(dispatcher, "LOCAL_LEDGER", ledger), patch.object(dispatcher, "run_remote", return_value=(0, json.dumps(receipt), "")) as run:
                out = io.StringIO()
                with contextlib.redirect_stdout(out):
                    result = dispatcher.local_main("--send-once")
                self.assertEqual(result, 0)
                self.assertEqual(run.call_count, 1)
                self.assertNotIn("chat_id", out.getvalue())
                with contextlib.redirect_stdout(io.StringIO()):
                    replay_result = dispatcher.local_main("--send-once")
                self.assertEqual(replay_result, 4)
                self.assertEqual(run.call_count, 1)
            con = sqlite3.connect(ledger)
            try:
                row = con.execute("SELECT state, receipt_sha256, sent_at_utc FROM dispatch").fetchone()
            finally:
                con.close()
            self.assertEqual(row[0], "accepted")
            self.assertRegex(row[1], r"^[0-9a-f]{64}$")
            self.assertEqual(row[2], receipt["sent_at_utc"])

    def test_local_send_path_malformed_success_is_ambiguous_and_redacted(self):
        with tempfile.TemporaryDirectory() as temp:
            ledger = Path(temp) / "ledger.sqlite3"
            malformed = {"status": "accepted", "recipient": "Sergio Urcullo", "text_sha256": dispatcher.sha256_text(dispatcher.MESSAGE)}
            with patch.object(dispatcher, "LOCAL_LEDGER", ledger), patch.object(dispatcher, "run_remote", return_value=(0, json.dumps(malformed), "")) as run:
                out = io.StringIO()
                with contextlib.redirect_stdout(out):
                    result = dispatcher.local_main("--send-once")
                self.assertEqual(result, 5)
                self.assertEqual(run.call_count, 1)
                self.assertIn("needs_reconcile", out.getvalue())
                self.assertNotIn("message_id", out.getvalue())
            con = sqlite3.connect(ledger)
            try:
                state = con.execute("SELECT state FROM dispatch").fetchone()[0]
            finally:
                con.close()
            self.assertEqual(state, "needs_reconcile")

    def test_no_argument_entry_is_a_safe_usage_error(self):
        result = subprocess.run([sys.executable, str(Path(dispatcher.__file__).resolve())], stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=5, check=False, text=True)
        self.assertEqual(result.returncode, 2)
        self.assertIn("usage:", result.stdout)
        self.assertNotIn("Traceback", result.stderr)

    def test_remote_ledger_reservation_matches_schema_and_preserves_existing_path(self):
        with tempfile.TemporaryDirectory() as temp:
            fresh = Path(temp) / "fresh-operation"
            with patch.object(dispatcher, "REMOTE_LEDGER_DIR", str(fresh)), patch.object(dispatcher.os, "umask", return_value=0o022):
                db = dispatcher._remote_ledger_reserve()
            con = sqlite3.connect(db)
            try:
                row = con.execute("SELECT state,body_sha256,recipient,receipt_sha256,sent_at_utc FROM dispatch WHERE nonce=?", (dispatcher.APPROVAL_REF,)).fetchone()
            finally:
                con.close()
            self.assertEqual(row, ("in_flight", dispatcher.sha256_text(dispatcher.MESSAGE), dispatcher.OWNER_ALIAS, None, None))

            existing = Path(temp) / "existing-operation"
            existing.mkdir()
            marker = existing / "keep.txt"
            marker.write_text("fixture", encoding="utf-8")
            with patch.object(dispatcher, "REMOTE_LEDGER_DIR", str(existing)), patch.object(dispatcher.os, "umask", return_value=0o022):
                with self.assertRaises(FileExistsError):
                    dispatcher._remote_ledger_reserve()
            self.assertEqual(marker.read_text(encoding="utf-8"), "fixture")

    def test_photo_multipart_contains_only_expected_fields_and_jpeg(self):
        jpeg = b"\xff\xd8\xfffixture"
        body = dispatcher.build_photo_multipart("a" * 32, "123456", jpeg)
        self.assertIn(b'name="chat_id"', body)
        self.assertIn(b'name="caption"', body)
        self.assertIn(b'name="photo"; filename="codex-cloud-piloto-real.jpg"', body)
        self.assertIn(dispatcher.PHOTO_CAPTION.encode("utf-8"), body)
        self.assertTrue(body.endswith(b"--" + b"a" * 32 + b"--\r\n"))
        self.assertIn(jpeg, body)
        self.assertNotIn(b"token", body.lower())

    def test_photo_path_requires_pinned_hash_and_jpeg_magic(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp).resolve()
            photo = root / "fixture.jpg"
            data = b"\xff\xd8\xfffixture-image"
            photo.write_bytes(data)
            digest = hashlib.sha256(data).hexdigest().upper()
            with patch.object(dispatcher, "MEDIA_ROOT", root), patch.object(dispatcher, "PHOTO_SHA256", digest):
                self.assertEqual(dispatcher.read_approved_photo(photo), data)
                with patch.object(dispatcher, "PHOTO_SHA256", "0" * 64):
                    with self.assertRaises(ValueError):
                        dispatcher.read_approved_photo(photo)
            bad = root / "fake.jpg"
            bad.write_bytes(b"not-jpeg")
            with patch.object(dispatcher, "MEDIA_ROOT", root), patch.object(dispatcher, "PHOTO_SHA256", hashlib.sha256(b"not-jpeg").hexdigest().upper()):
                with self.assertRaises(ValueError):
                    dispatcher.read_approved_photo(bad)

    def test_photo_bytes_are_embedded_only_in_ssh_stdin_memory(self):
        photo = b"\xff\xd8\xffsmall-fixture"
        captured = {}
        def fake_run(command, **kwargs):
            captured["command"] = command
            captured["stdin"] = kwargs["input"]
            return SimpleNamespace(returncode=0, stdout=b"{}\n", stderr=b"")
        with patch.object(dispatcher.subprocess, "run", side_effect=fake_run) as run:
            result = dispatcher.run_remote("--remote-photo-send", photo_bytes=photo)
        self.assertEqual(result[0], 0)
        self.assertEqual(run.call_count, 1)
        self.assertEqual(captured["command"][-1], "--remote-photo-send")
        encoded = base64.b64encode(photo)
        self.assertIn(b"PHOTO_DATA_B64 = " + repr(encoded.decode("ascii")).encode("ascii"), captured["stdin"])
        self.assertNotIn(photo, captured["stdin"])
        self.assertFalse(any(encoded.decode("ascii") in str(arg) for arg in captured["command"]))

    def test_remote_photo_fake_transport_accepts_once_and_blocks_replay(self):
        with tempfile.TemporaryDirectory() as temp:
            photo = b"\xff\xd8\xfffixture-photo"
            photo_sha = hashlib.sha256(photo).hexdigest().upper()
            payload = {"ok": True, "result": {"message_id": 71, "date": 1791930000, "chat": {"id": 123456}, "caption": dispatcher.PHOTO_CAPTION, "photo": [{"file_id": "fixture", "width": 1, "height": 1}]}}
            operation_dir = Path(temp) / "photo-operation"
            with patch.object(dispatcher, "_remote_preflight", return_value=("synthetic-token", "123456")), patch.object(dispatcher, "_remote_api_photo", return_value=(200, payload)) as api, patch.object(dispatcher, "PHOTO_DATA_B64", base64.b64encode(photo).decode("ascii")), patch.object(dispatcher, "PHOTO_SHA256", photo_sha), patch.object(dispatcher, "PHOTO_REMOTE_LEDGER_DIR", str(operation_dir)), patch.object(dispatcher.os, "umask", return_value=0o022):
                first_out = io.StringIO()
                with contextlib.redirect_stdout(first_out):
                    first = dispatcher.remote_photo_main()
                replay_out = io.StringIO()
                with contextlib.redirect_stdout(replay_out):
                    replay = dispatcher.remote_photo_main()
            self.assertEqual(first, 0)
            self.assertEqual(replay, 4)
            self.assertEqual(api.call_count, 1)
            receipt = json.loads(first_out.getvalue())
            self.assertEqual(receipt["status"], "accepted")
            self.assertEqual(receipt["photo_sha256"], photo_sha.lower())
            self.assertNotIn("file_id", first_out.getvalue())
            self.assertEqual(json.loads(replay_out.getvalue())["stage"], "ledger_reservation")
            con = sqlite3.connect(operation_dir / "send.sqlite3")
            try:
                row = con.execute("SELECT state,body_sha256,recipient,receipt_sha256,sent_at_utc FROM dispatch WHERE nonce=?", (dispatcher.PHOTO_APPROVAL_REF,)).fetchone()
            finally:
                con.close()
            self.assertEqual(row[0], "accepted")
            self.assertEqual(row[1], dispatcher.photo_operation_hash(photo_sha.lower()))
            self.assertEqual(row[2], dispatcher.OWNER_ALIAS)
            self.assertRegex(row[3], r"^[0-9a-f]{64}$")
            self.assertTrue(row[4].endswith("+00:00"))

    def test_photo_receipt_rejects_unusable_photo_sizes(self):
        base = {"ok": True, "result": {"message_id": 71, "date": 1791930000, "chat": {"id": 123456}, "caption": dispatcher.PHOTO_CAPTION}}
        invalid_sizes = ([{}], [{"file_id": "fixture", "width": 0, "height": 1}], [{"file_id": "fixture", "width": 1, "height": True}], [{"file_id": " ", "width": 1, "height": 1}])
        for sizes in invalid_sizes:
            with self.subTest(sizes=sizes):
                payload = {"ok": True, "result": {**base["result"], "photo": sizes}}
                with self.assertRaises(ValueError):
                    dispatcher.parse_photo_receipt(200, payload, "123456", "a" * 64)

    def test_photo_receipt_accepts_well_formed_photo_size(self):
        payload = {"ok": True, "result": {"message_id": 71, "date": 1791930000, "chat": {"id": 123456}, "caption": dispatcher.PHOTO_CAPTION, "photo": [{"file_id": "fixture", "width": 1, "height": 1}]}}
        receipt = dispatcher.parse_photo_receipt(200, payload, "123456", "a" * 64)
        self.assertEqual(receipt["photo_sha256"], "a" * 64)

    def test_malformed_photo_response_is_ambiguous_and_never_accepted(self):
        with tempfile.TemporaryDirectory() as temp:
            photo = b"\xff\xd8\xfffixture-photo"
            photo_sha = hashlib.sha256(photo).hexdigest().upper()
            payload = {"ok": True, "result": {"message_id": 71, "date": 1791930000, "chat": {"id": 123456}, "caption": dispatcher.PHOTO_CAPTION, "photo": [{}]}}
            operation_dir = Path(temp) / "photo-operation"
            with patch.object(dispatcher, "_remote_preflight", return_value=("synthetic-token", "123456")), patch.object(dispatcher, "_remote_api_photo", return_value=(200, payload)) as api, patch.object(dispatcher, "PHOTO_DATA_B64", base64.b64encode(photo).decode("ascii")), patch.object(dispatcher, "PHOTO_SHA256", photo_sha), patch.object(dispatcher, "PHOTO_REMOTE_LEDGER_DIR", str(operation_dir)), patch.object(dispatcher.os, "umask", return_value=0o022):
                output = io.StringIO()
                with contextlib.redirect_stdout(output):
                    result = dispatcher.remote_photo_main()
            self.assertEqual(result, 5)
            self.assertEqual(api.call_count, 1)
            self.assertEqual(json.loads(output.getvalue())["status"], "needs_reconcile")
            con = sqlite3.connect(operation_dir / "send.sqlite3")
            try:
                state = con.execute("SELECT state FROM dispatch WHERE nonce=?", (dispatcher.PHOTO_APPROVAL_REF,)).fetchone()[0]
            finally:
                con.close()
            self.assertEqual(state, "needs_reconcile")

    def test_remote_fake_transport_reserves_sends_once_persists_receipt_and_blocks_replay(self):
        with tempfile.TemporaryDirectory() as temp:
            operation_dir = Path(temp) / "operation"
            response = {"ok": True, "result": {"message_id": 42, "date": 1791930000, "chat": {"id": 123456}, "text": dispatcher.MESSAGE}}
            with patch.object(dispatcher, "REMOTE_LEDGER_DIR", str(operation_dir)), patch.object(dispatcher, "_remote_preflight", return_value=("synthetic-token", "123456")), patch.object(dispatcher, "_remote_api", return_value=(200, response)) as api, patch.object(dispatcher.os, "umask", return_value=0o022):
                first_out = io.StringIO()
                with contextlib.redirect_stdout(first_out):
                    first = dispatcher.remote_main("--remote-send")
                second_out = io.StringIO()
                with contextlib.redirect_stdout(second_out):
                    replay = dispatcher.remote_main("--remote-send")
            self.assertEqual(first, 0)
            self.assertEqual(replay, 4)
            self.assertEqual(api.call_count, 1)
            first_receipt = json.loads(first_out.getvalue())
            self.assertEqual(first_receipt["status"], "accepted")
            self.assertEqual(first_receipt["text_sha256"], dispatcher.sha256_text(dispatcher.MESSAGE))
            self.assertNotIn("message_id", first_receipt)
            self.assertEqual(json.loads(second_out.getvalue()), {"status": "blocked", "stage": "ledger_reservation"})
            con = sqlite3.connect(operation_dir / "send.sqlite3")
            try:
                row = con.execute("SELECT state,body_sha256,recipient,receipt_sha256,sent_at_utc FROM dispatch WHERE nonce=?", (dispatcher.APPROVAL_REF,)).fetchone()
            finally:
                con.close()
            self.assertEqual(row[0], "accepted")
            self.assertEqual(row[1], dispatcher.sha256_text(dispatcher.MESSAGE))
            self.assertEqual(row[2], dispatcher.OWNER_ALIAS)
            self.assertRegex(row[3], r"^[0-9a-f]{64}$")
            self.assertTrue(row[4].endswith("+00:00"))

    def test_blocked_remote_stage_is_preserved_safely_without_post(self):
        with tempfile.TemporaryDirectory() as temp:
            ledger = Path(temp) / "ledger.sqlite3"
            response = {"status": "blocked", "stage": "ledger_reservation"}
            with patch.object(dispatcher, "LOCAL_LEDGER", ledger), patch.object(dispatcher, "run_remote", return_value=(4, json.dumps(response), "")) as run:
                out = io.StringIO()
                with contextlib.redirect_stdout(out):
                    result = dispatcher.local_main("--send-once")
            self.assertEqual(result, 3)
            self.assertEqual(run.call_count, 1)
            self.assertEqual(out.getvalue().strip(), "send=blocked_before_post; stage=ledger_reservation; no_retry")
            self.assertNotIn("sendMessage", out.getvalue())
            con = sqlite3.connect(ledger)
            try:
                state = con.execute("SELECT state FROM dispatch").fetchone()[0]
            finally:
                con.close()
            self.assertEqual(state, "blocked_before_post")

    def test_unknown_remote_mode_fails_before_preflight_or_post(self):
        out = io.StringIO()
        with patch.object(dispatcher, "_remote_preflight") as preflight, patch.object(dispatcher, "_remote_ledger_reserve") as reserve, patch.object(dispatcher, "_remote_api") as api:
            with contextlib.redirect_stdout(out):
                result = dispatcher.remote_main("--remote-preflght")
        self.assertEqual(result, 2)
        self.assertEqual(json.loads(out.getvalue())["stage"], "invalid_mode")
        preflight.assert_not_called()
        reserve.assert_not_called()
        api.assert_not_called()


if __name__ == "__main__":
    unittest.main(verbosity=2)
