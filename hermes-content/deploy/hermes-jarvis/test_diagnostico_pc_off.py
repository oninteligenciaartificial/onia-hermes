"""Focused static QA for the unconnected PC-off diagnostic candidate."""
from pathlib import Path
import re
import unittest


BASE = Path(__file__).resolve().parent
REMOTE = (BASE / "diagnostico-pc-off.sh").read_text()
RUNNER = (BASE / "diagnostico-pc-off-runner.sh").read_text()


class PcOffDiagnosticCandidateTests(unittest.TestCase):
    def test_remote_scope_is_allowlisted_and_has_no_service_channels(self):
        self.assertIn("emit_tool bash bash --version", REMOTE)
        self.assertIn("emit_tool chromium chromium --version", REMOTE)
        self.assertIn("df -Pk /", REMOTE)
        self.assertIn("free -k", REMOTE)
        self.assertIn("emit_path hermes_jobs", REMOTE)
        forbidden = re.compile(
            r"(?i)telegram|n8n|curl|wget|urllib|https?://|systemctl|crontab|"
            r"docker|journalctl|\.env|token|secret|cookie|chat_id|api[_-]?key"
        )
        self.assertIsNone(forbidden.search(REMOTE))

    def test_remote_has_no_write_or_mutation_primitives(self):
        forbidden = re.compile(
            r"(?m)^\s*(?:touch|mkdir|rm|mv|cp|tee|install|systemctl|service|"
            r"curl|wget|chmod|chown|crontab)\b|>(?!/dev/null)\s*[/A-Za-z0-9_.-]+|"
            r"\b(sed\s+-i|apt(-get)?\s+install)\b"
        )
        self.assertIsNone(forbidden.search(REMOTE))

    def test_runner_fails_closed_on_missing_identity_or_trusted_pin(self):
        self.assertIn("${VPS_SSH_KEY_FILE:?", RUNNER)
        self.assertIn("${VPS_KNOWN_HOSTS_FILE:?", RUNNER)
        self.assertIn("ssh-keygen -F", RUNNER)
        self.assertIn("StrictHostKeyChecking=yes", RUNNER)
        self.assertNotIn("StrictHostKeyChecking=no", RUNNER)
        self.assertNotIn("StrictHostKeyChecking=accept-new", RUNNER)
        self.assertNotIn("ssh-keyscan", RUNNER)
        self.assertIn("UpdateHostKeys=no", RUNNER)
        self.assertIn("VerifyHostKeyDNS=no", RUNNER)

    def test_runner_is_bounded_and_not_wired_to_workflow(self):
        self.assertIn("timeout --signal=TERM 60s ssh", RUNNER)
        self.assertIn("2>/dev/null | awk", RUNNER)
        self.assertIn('awk \'', RUNNER)
        self.assertIn("diagnostic_output_rejected=true", RUNNER)
        self.assertIn("exit 65", RUNNER)
        workflow = (BASE.parents[2] / ".github/workflows/hermes-jarvis.yml").read_text()
        self.assertNotIn("diagnostico-pc-off-runner.sh", workflow)
        self.assertNotIn("diagnostico-pc-off.sh", workflow)

    def test_output_is_constrained_to_boolean_version_and_capacity_fields(self):
        self.assertIn("available=true", REMOTE)
        self.assertIn("present=true", REMOTE)
        self.assertIn("root_free_kb", REMOTE)
        self.assertIn("memory_available_kb", REMOTE)
        self.assertNotIn("hostname", REMOTE.lower())
        self.assertNotIn("identity", REMOTE.lower())


if __name__ == "__main__":
    unittest.main()
