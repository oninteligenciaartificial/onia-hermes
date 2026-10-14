import shutil
import subprocess
import unittest
from pathlib import Path


HERE = Path(__file__).parent
WRAPPER = HERE / "run-once.sh"


class RunOnceTemporaryCleanupTests(unittest.TestCase):
    def test_wrapper_uses_private_unique_output_and_exit_cleanup(self):
        source = WRAPPER.read_text(encoding="utf-8")
        self.assertIn("umask 077", source)
        self.assertIn('mktemp --tmpdir=. .run-once-output.XXXXXXXXXX', source)
        self.assertIn("trap cleanup_output EXIT", source)
        self.assertIn('>"$output_tmp" 2>/dev/null', source)
        timeout_lines = [line for line in source.splitlines() if line.lstrip().startswith("timeout ")]
        self.assertEqual(len(timeout_lines), 1)
        self.assertIn("--kill-after=2s 75s", timeout_lines[0])
        self.assertNotIn("--kill-after=3s 82s", timeout_lines[0])
        bash = shutil.which("bash")
        if not bash:
            self.skipTest("bash unavailable for offline cleanup verification")
        parsed = subprocess.run([bash, "-n"], input=source.replace("\r\n", "\n").encode(), capture_output=True)
        self.assertEqual(parsed.returncode, 0, parsed.stderr.decode(errors="replace"))

    def test_private_temp_is_removed_on_success_and_failure_exit(self):
        bash = shutil.which("bash")
        if not bash:
            self.skipTest("bash unavailable for offline cleanup verification")
        snippet = r'''set -Eeuo pipefail
test_dir="$(mktemp -d /tmp/run-once-cleanup-test.XXXXXXXXXX)"
cleanup_test_dir() { rmdir -- "$test_dir" >/dev/null 2>&1 || true; }
trap cleanup_test_dir EXIT
for requested in 0 23; do
  set +e
  (
set -Eeuo pipefail
umask 077
output_tmp=""
cleanup_output() { if [[ -n "$output_tmp" ]]; then rm -f -- "$output_tmp" >/dev/null 2>&1 || true; fi; }
trap cleanup_output EXIT
trap "exit 129" HUP
trap "exit 130" INT
trap "exit 143" TERM
output_tmp="$(mktemp --tmpdir="$test_dir" .run-once-output.XXXXXXXXXX)"
chmod 600 -- "$output_tmp"
[[ "$(stat -c %a -- "$output_tmp")" == "600" ]]
printf '%s' "$output_tmp" > "$test_dir/path"
printf 'synthetic-output' > "$output_tmp"
exit "$requested"
  )
  rc=$?
  set -e
  [[ "$rc" == "$requested" ]]
  output_path="$(cat "$test_dir/path")"
  rm -- "$test_dir/path"
  [[ -n "$output_path" && ! -e "$output_path" ]]
done
echo cleanup-ok
'''
        proc = subprocess.run([bash], input=snippet.encode(), capture_output=True)
        self.assertEqual(proc.returncode, 0, proc.stderr.decode(errors="replace"))
        self.assertEqual(proc.stdout.decode().strip(), "cleanup-ok")


if __name__ == "__main__":
    unittest.main()
