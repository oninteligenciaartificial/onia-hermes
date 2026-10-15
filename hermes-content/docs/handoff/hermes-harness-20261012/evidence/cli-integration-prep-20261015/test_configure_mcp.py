import json
import tempfile
import unittest
from pathlib import Path
import configure_mcp as config


class ConfigTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / "config.yaml"
        self.original = b"model: gpt-5-mini\nprivate: fake-secret\nmcp_servers:\n  other:\n    command: existing\n"
        self.path.write_bytes(self.original)
        self.backups = Path(self.tmp.name) / "backups"

    def test_dry_run_does_not_change_or_copy_secrets(self):
        result = config.merge(self.path, self.backups)
        self.assertEqual(self.path.read_bytes(), self.original)
        self.assertFalse(self.backups.exists())
        self.assertNotIn("fake-secret", json.dumps(result))

    def test_apply_preserves_other_config_and_exact_rollback(self):
        import yaml
        result = config.merge(self.path, self.backups, apply=True)
        merged = yaml.safe_load(self.path.read_bytes())
        self.assertEqual(merged["mcp_servers"]["other"], {"command": "existing"})
        self.assertEqual(merged["model"], "gpt-5-mini")
        self.assertEqual(merged["private"], "fake-secret")
        self.assertEqual(merged["mcp_servers"][config.SERVER]["trust"], "untrusted")
        config.rollback(Path(result["receipt"]), apply=True)
        self.assertEqual(self.path.read_bytes(), self.original)

    def test_existing_server_not_overwritten(self):
        config.merge(self.path, self.backups, apply=True)
        with self.assertRaisesRegex(ValueError, "server_exists"):
            config.merge(self.path, self.backups, apply=True)

    def test_rollback_never_clobbers_later_config(self):
        result = config.merge(self.path, self.backups, apply=True)
        self.path.write_bytes(self.path.read_bytes() + b"new_setting: keep\n")
        with self.assertRaisesRegex(ValueError, "changed_after_merge"):
            config.rollback(Path(result["receipt"]), apply=True)


if __name__ == "__main__":
    unittest.main()
