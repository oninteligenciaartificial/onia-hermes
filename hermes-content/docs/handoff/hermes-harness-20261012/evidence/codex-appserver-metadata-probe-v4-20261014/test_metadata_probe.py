import json
import queue
import threading
import inspect
from io import BytesIO
import unittest

import metadata_probe as probe


class MetadataProbeSafetyTests(unittest.TestCase):
    def test_v4_accepts_optional_emitted_at_ms_i64_in_notification_envelope(self):
        for raw in (
            b'{"method":"account/updated","params":{},"emittedAtMs":1760440000123}\n',
            b'{"method":"account/updated","params":{},"emittedAtMs":null}\n',
            b'{"method":"account/updated","params":{}}\n',
        ):
            with self.subTest(raw=raw):
                kind, message=probe.validate_jsonrpc_line(raw,2)
                self.assertEqual(kind,"notification")
                self.assertIsNone(message)

    def test_v4_rejects_invalid_emitted_at_ms_type_and_i64_range(self):
        invalid=(
            b'{"method":"account/updated","params":{},"emittedAtMs":true}\n',
            b'{"method":"account/updated","params":{},"emittedAtMs":1.0}\n',
            b'{"method":"account/updated","params":{},"emittedAtMs":"1760440000123"}\n',
            b'{"method":"account/updated","params":{},"emittedAtMs":9223372036854775808}\n',
            b'{"method":"account/updated","params":{},"emittedAtMs":-9223372036854775809}\n',
        )
        for raw in invalid:
            with self.subTest(raw=raw), self.assertRaisesRegex(probe.ProbeError,"protocol_notification_timestamp_invalid"):
                probe.validate_jsonrpc_line(raw,2)

    def test_v4_trace_and_unknown_notification_fields_remain_rejected(self):
        for raw in (
            b'{"method":"account/updated","params":{},"trace":{"traceparent":"secret"}}\n',
            b'{"method":"account/updated","params":{},"private_extra":"secret"}\n',
        ):
            with self.subTest(raw=raw), self.assertRaisesRegex(probe.ProbeError,"protocol_notification_shape_invalid"):
                probe.validate_jsonrpc_line(raw,2)

    def test_v4_failure_diagnostics_track_timestamp_type_without_value(self):
        raw=b'{"method":"account/updated","params":{},"emittedAtMs":true}\n'
        with self.assertRaises(probe.ProbeError) as caught:
            probe.validate_jsonrpc_line(raw,2)
        shape=caught.exception.diagnostic
        self.assertTrue(shape["key_present"]["emittedAtMs"])
        self.assertEqual(shape["value_types"]["emittedAtMs"],"boolean")
        self.assertNotIn("1760440000123",json.dumps(shape))

    def test_v3_notification_trace_rejection_exposes_shape_only(self):
        raw=b'{"method":"account/updated","trace":{"traceparent":"private-trace"},"params":{"email":"private@example.invalid"}}\n'
        with self.assertRaises(probe.ProbeError) as caught:
            probe.validate_jsonrpc_line(raw,2)
        self.assertEqual(str(caught.exception),"protocol_notification_shape_invalid")
        shape=caught.exception.diagnostic
        self.assertEqual(shape["protocol_reason"],"protocol_notification_shape_invalid")
        self.assertTrue(shape["key_present"]["trace"])
        self.assertEqual(shape["value_types"]["trace"],"object")
        self.assertEqual(shape["unknown_key_count"],0)
        self.assertEqual(shape["known_method"],"allowlisted")
        self.assertNotIn("private-trace",repr(shape))
        self.assertNotIn("private@example.invalid",repr(shape))

    def test_v3_private_unknown_key_names_and_payload_values_are_not_reported(self):
        raw=b'{"method":"private-method-name","private_api_key":"fixture-token-SECRET","params":{"message":"fixture-private-body"}}\n'
        with self.assertRaises(probe.ProbeError) as caught:
            probe.validate_jsonrpc_line(raw,2)
        shape=caught.exception.diagnostic
        self.assertEqual(shape["known_method"],"unknown")
        self.assertEqual(shape["unknown_key_count"],1)
        serialized=json.dumps(shape,sort_keys=True)
        for sensitive in ("private-method-name","private_api_key","fixture-token-SECRET","fixture-private-body"):
            self.assertNotIn(sensitive,serialized)

    def test_v3_types_and_id_match_are_boolean_or_categories_not_values(self):
        raw=b'{"id":2.0,"result":{},"privateField":"identity-123"}\n'
        with self.assertRaises(probe.ProbeError) as caught:
            probe.validate_jsonrpc_line(raw,2)
        shape=caught.exception.diagnostic
        self.assertEqual(shape["value_types"]["id"],"number")
        self.assertFalse(shape["expected_id_match"])
        self.assertEqual(shape["unknown_key_count"],1)
        self.assertNotIn("identity-123",repr(shape))

    def test_v3_rpc_error_diagnostic_masks_error_contents(self):
        raw=b'{"id":2,"error":{"code":-32000,"message":"account email private@example.invalid","data":{"token":"fixture-token"}}}\n'
        with self.assertRaises(probe.ProbeError) as caught:
            probe.validate_jsonrpc_line(raw,2)
        self.assertEqual(str(caught.exception),"rpc_error")
        shape=caught.exception.diagnostic
        self.assertEqual(shape["value_types"]["id"],"integer")
        self.assertTrue(shape["expected_id_match"])
        safe=json.dumps(shape)
        self.assertNotIn("private@example.invalid",safe)
        self.assertNotIn("fixture-token",safe)

    def test_v3_only_extracts_semver_from_exact_sdk_user_agent_shape(self):
        shape=probe.safe_envelope_shape({"id":1,"result":{"userAgent":"codex-cli 0.161.0"}},1,"fixture")
        self.assertEqual(shape["sdk_version"],"0.161.0")
        other=probe.safe_envelope_shape({"id":1,"result":{"userAgent":"codex-cli 0.161.0 /root/private"}},1,"fixture")
        self.assertIsNone(other["sdk_version"])
        self.assertNotIn("/root/private",repr(other))

    def test_v2_accepts_pinned_versionless_initialize_and_account_replies(self):
        init=b'{"id":1,"result":{"serverInfo":{"name":"fixture"}}}\n'
        account=b'{"id":2,"result":{"account":{"type":"chatgpt","email":"private","id":"secret"}}}\n'
        kind, reply=probe.validate_jsonrpc_line(init,1)
        self.assertEqual(kind,"response")
        self.assertEqual(reply["result"],{"serverInfo":{"name":"fixture"}})
        kind, reply=probe.validate_jsonrpc_line(account,2)
        self.assertEqual(kind,"response")
        self.assertEqual(probe.project_account_read(reply),{"account_present":True,"auth_kind":"chatgpt"})

    def test_v2_accepts_optional_exact_version_and_account_null(self):
        versioned=b'{"jsonrpc":"2.0","id":2,"result":{"account":null}}\n'
        kind, reply=probe.validate_jsonrpc_line(versioned,2)
        self.assertEqual(kind,"response")
        self.assertEqual(probe.project_account_read(reply),{"account_present":False,"auth_kind":"unknown"})
        self.assertEqual(probe.project_account_read({"id":2,"result":{"account":None}}),
                         {"account_present":False,"auth_kind":"unknown"})

    def test_v2_rejects_invalid_versions_and_extra_envelope_fields(self):
        for raw in (
            b'{"jsonrpc":"1.0","id":1,"result":{}}\n',
            b'{"jsonrpc":null,"id":1,"result":{}}\n',
            b'{"id":1,"result":{},"extra":"private"}\n',
            b'{"id":1,"error":{"code":-1,"message":"private"},"extra":1}\n',
        ):
            with self.subTest(raw=raw[:24]), self.assertRaises(probe.ProbeError):
                probe.validate_jsonrpc_line(raw,1)

    def test_v2_rejects_malformed_error_and_notification_shapes_without_echo(self):
        for raw in (
            b'{"id":1,"error":{"code":true,"message":"secret"}}\n',
            b'{"id":1,"error":{"code":-1,"message":"secret","extra":1}}\n',
            b'{"method":"account/updated","extra":"secret"}\n',
            b'{"method":7}\n',
            b'{"id":7,"method":"account/read","params":{}}\n',
        ):
            with self.subTest(raw=raw[:24]):
                try:
                    probe.validate_jsonrpc_line(raw,1)
                except probe.ProbeError as exc:
                    self.assertNotIn("secret",str(exc))
                else:
                    self.fail("malformed envelope accepted")

    def test_v2_outgoing_rpc_frames_are_versionless(self):
        source=inspect.getsource(probe.run_probe)
        self.assertIn('"id": 1, "method": "initialize"',source)
        self.assertIn('{"method": "initialized"}',source)
        self.assertIn('{"id": 2, "method": "account/read", "params": {}}',source)
        self.assertNotIn('"jsonrpc": "2.0"',source)

    def test_account_projection_never_returns_identity_fields(self):
        msg = {"jsonrpc":"2.0", "id":2, "result":{"account":{
            "type":"chatgpt", "email":"private@example.invalid", "id":"fixture-id",
            "token":"fixture-secret"}}}
        self.assertEqual(probe.project_account_read(msg),
                         {"account_present":True, "auth_kind":"chatgpt"})

    def test_account_projection_handles_signed_out_and_unknown_auth(self):
        self.assertEqual(probe.project_account_read({"jsonrpc":"2.0","id":2,"result":{"account":None}}),
                         {"account_present":False,"auth_kind":"unknown"})
        self.assertEqual(probe.project_account_read({"jsonrpc":"2.0","id":2,"result":{"account":{"type":"headers"}}}),
                         {"account_present":True,"auth_kind":"unknown"})

    def test_unexpected_server_request_and_turn_notification_fail_closed(self):
        server_request=b'{"jsonrpc":"2.0","id":7,"method":"account/chatgptAuthTokens/refresh","params":{}}\n'
        turn_notification=b'{"jsonrpc":"2.0","method":"turn/started","params":{}}\n'
        with self.assertRaisesRegex(probe.ProbeError,"unexpected_server_request"):
            probe.validate_jsonrpc_line(server_request, 2)
        with self.assertRaisesRegex(probe.ProbeError,"unexpected_server_notification"):
            probe.validate_jsonrpc_line(turn_notification, 2)

    def test_bad_id_rpc_error_and_oversize_are_rejected_without_echo(self):
        bad_id=b'{"jsonrpc":"2.0","id":9,"result":{}}\n'
        rpc_error=b'{"id":2,"error":{"code":-32000,"message":"private detail"}}\n'
        self.assertRaisesRegex(probe.ProbeError,"response_id_mismatch",probe.validate_jsonrpc_line,bad_id,2)
        self.assertRaisesRegex(probe.ProbeError,"rpc_error",probe.validate_jsonrpc_line,rpc_error,2)
        self.assertRaisesRegex(probe.ProbeError,"oversized",probe.validate_jsonrpc_line,b"x"*(probe.MAX_LINE_BYTES+1),2)

    def test_boolean_and_float_ids_are_not_integer_ids(self):
        for value in (True, 2.0):
            raw=(json.dumps({"jsonrpc":"2.0","id":value,"result":{}})+"\n").encode()
            with self.subTest(value=value), self.assertRaisesRegex(probe.ProbeError,"response_id_mismatch"):
                probe.validate_jsonrpc_line(raw, 1 if value is True else 2)

    def test_shutdown_rejects_late_request_turn_and_extra_response(self):
        terminal=(probe.SUPERVISOR_FRAME+
                  b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":true}\n')
        bad_lines=(
            b'{"jsonrpc":"2.0","id":3,"method":"tool/call","params":{}}\n',
            b'{"jsonrpc":"2.0","method":"turn/started","params":{}}\n',
            b'{"jsonrpc":"2.0","id":2,"result":{}}\n',
        )
        for bad in bad_lines:
            with self.subTest(bad=bad[:40]), self.assertRaises(probe.ProbeError):
                probe.validate_shutdown_stream([bad, terminal])

    def test_shutdown_requires_complete_valid_terminal_frame_and_no_trailer(self):
        valid=(probe.SUPERVISOR_FRAME+
               b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":true}\n')
        for invalid in (
            probe.SUPERVISOR_FRAME+b'{"child_exit_code":0,"child_stopped":true',
            probe.SUPERVISOR_FRAME+b'{"child_exit_code":0,"child_stopped":false,"scratch_cleaned":true}\n',
            probe.SUPERVISOR_FRAME+b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":false,"group_quiescent":true}\n',
            probe.SUPERVISOR_FRAME+b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":false}\n',
        ):
            with self.subTest(invalid=invalid[:50]), self.assertRaises(probe.ProbeError):
                probe.validate_shutdown_stream([invalid])
        with self.assertRaisesRegex(probe.ProbeError,"stdout_after_supervisor_frame"):
            probe.validate_shutdown_stream([valid,b'{"jsonrpc":"2.0","method":"account/updated"}\n'])

    def test_runtime_drain_consumes_terminal_frame_then_eof(self):
        terminal=(probe.SUPERVISOR_FRAME+
                  b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":true}\n')
        output=queue.Queue()
        output.put(b'{"jsonrpc":"2.0","method":"account/updated"}\n')
        output.put(terminal)
        output.put(None)
        frame=probe._drain_shutdown(output,probe.time.monotonic()+1)
        self.assertEqual(frame,{"child_exit_code":0,"child_stopped":True,"scratch_cleaned":True,"group_quiescent":True})

    def test_runtime_drain_does_not_accept_missing_eof(self):
        terminal=(probe.SUPERVISOR_FRAME+
                  b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":true}\n')
        output=queue.Queue()
        output.put(terminal)
        with self.assertRaisesRegex(probe.ProbeError,"watchdog_timeout"):
            probe._drain_shutdown(output,probe.time.monotonic()+0.001)

    def test_stdout_line_flood_is_cumulatively_bounded(self):
        raw=b'{"jsonrpc":"2.0","method":"account/updated"}\n' * (probe.MAX_STDOUT_LINES + 2)
        output=queue.Queue()
        counters={"stdout_lines":0,"stdout_bytes":0}
        probe._read_stdout_lines(BytesIO(raw),output,counters,threading.Lock())
        self.assertGreater(counters["stdout_lines"],probe.MAX_STDOUT_LINES)
        collected=[]
        while not output.empty():
            collected.append(output.get_nowait())
        self.assertTrue(any(isinstance(item,probe.ProbeError) for item in collected))

    def test_stdout_byte_budget_is_cumulative_even_when_each_line_fits(self):
        padding=b"x"*(240*1024)
        line=b'{"jsonrpc":"2.0","method":"account/updated","params":{"pad":"'+padding+b'"}}\n'
        self.assertLess(len(line),probe.MAX_LINE_BYTES)
        raw=line*10
        output=queue.Queue()
        counters={"stdout_lines":0,"stdout_bytes":0}
        probe._read_stdout_lines(BytesIO(raw),output,counters,threading.Lock())
        self.assertLessEqual(counters["stdout_lines"],probe.MAX_STDOUT_LINES)
        self.assertGreater(counters["stdout_bytes"],probe.MAX_STDOUT_BYTES)
        collected=[]
        while not output.empty():
            collected.append(output.get_nowait())
        self.assertTrue(any(isinstance(item,probe.ProbeError) for item in collected))

    def test_default_entrypoint_is_prepare_only_and_rpc_allowlist_has_no_turn(self):
        remote=probe._remote_supervisor_source()
        compile(remote,"remote_supervisor","exec")
        self.assertIn('"features.plugins=false"', remote)
        self.assertIn('process_group=0', remote)
        self.assertIn('process_group=keeper.pid', remote)
        self.assertIn('os.killpg(keeper.pid, signal.SIGKILL)', remote)
        self.assertIn('members=active_group_members(keeper.pid, keeper.pid)', remote)
        self.assertIn('child.wait(timeout=45)', remote)
        self.assertIn('__CODEX_PROBE_SUPERVISOR_DONE__:', remote)
        self.assertIn('child_stopped', remote)
        self.assertIn('group_quiescent', remote)
        self.assertNotIn('"--stdio"', remote)
        self.assertNotIn('thread/start', remote)
        self.assertNotIn('turn/start', remote)
        self.assertNotIn('model/list', remote)
        self.assertIn('if keeper is not None and not group_close_result:', remote)
        self.assertIn('if scratch is not None and group_close_result:', remote)

    def test_exited_leader_does_not_prove_owned_group_is_closed(self):
        active_descendant_frame=(probe.SUPERVISOR_FRAME+
            b'{"child_exit_code":0,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":false}\n')
        with self.assertRaisesRegex(probe.ProbeError,"cleanup_unconfirmed"):
            probe.validate_shutdown_stream([active_descendant_frame])

    def test_terminal_nonzero_exit_never_counts_as_success(self):
        terminal=(probe.SUPERVISOR_FRAME+
            b'{"child_exit_code":7,"child_stopped":true,"scratch_cleaned":true,"group_quiescent":true}\n')
        with self.assertRaisesRegex(probe.ProbeError,"child_exit_nonzero"):
            probe.validate_shutdown_stream([terminal])

    def test_method_tracker_counts_only_successful_local_flush(self):
        class Writer:
            def __init__(self, fail_flush=False):
                self.fail_flush=fail_flush
                self.written=b""
            def write(self, value):
                self.written += value
            def flush(self):
                if self.fail_flush:
                    raise OSError("fixture")
        class Proc:
            def __init__(self, writer):
                self.stdin=writer
        tracked=[]
        payload={"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}
        with self.assertRaisesRegex(probe.ProbeError,"app_server_stdin_closed"):
            probe._send_tracked(Proc(Writer(fail_flush=True)),payload,tracked)
        self.assertEqual(tracked,[])
        probe._send_tracked(Proc(Writer()),payload,tracked)
        self.assertEqual(tracked,["initialize"])


if __name__ == "__main__":
    unittest.main()
