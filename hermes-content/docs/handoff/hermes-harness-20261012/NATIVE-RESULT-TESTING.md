# Native result recovery fixtures: explicit private temporary root

The production `FileResultSink` intentionally rejects a result directory with a
`.git` marker on itself or any ancestor (`native_result_store.py:124–130`). Do not
remove, patch, mock or bypass that guard to make recovery tests pass.

`NativeResultRecoveryTests` previously used `tempfile.TemporaryDirectory()` with
no parent. Python selected `/tmp` on this executor (`TMPDIR` absent). Since
`/tmp/.git` exists, all six tests failed in setup before exercising recovery.
The checked-out repository itself was not the explicit fixture location.

Set **`HERMES_RESULT_TEST_TMPDIR`** to an existing writable parent outside every
Git ancestry. The fixtures create/remove only their own `mkdtemp` directory
(0700 on POSIX), and its `results` child remains 0700. They never chmod the
parent or modify production configuration. Omitting the variable preserves the
stdlib default; the fixture override also works when `tempfile.gettempdir()` has
already been cached by the process. An unsuitable parent still fails rather than
being skipped or silently replaced. No production sink code changes.

On a permitted executor, first inspect each ancestor of the chosen parent for
`.git`, then run these commands in the harness folder. In PowerShell, set the
variable to the actual approved directory for that host (do not copy a sample
machine's path):

```powershell
$env:HERMES_RESULT_TEST_TMPDIR = '<existing-approved-parent-outside-Git>'
python -B -m unittest test_native_work_entrypoint.NativeResultRecoveryTests -q
python -B -m unittest test_native_thread_qa test_native_thread_artifacts test_native_cloud_cli test_native_receipt_bridge test_native_work_entrypoint.NativeWorkEntrypointTests -q
```

The second command is the 77-test focal regression set as of base
`eb99d5c2fefa6c4dd5ead11fbe45721fdc114af5`; the first is the separate six-test
recovery class. A complete result must report both, not call 77 PASS full green.
Use an absolute parent; it must already exist and be writable under the actual
execution tool's granted permissions. OS `access(W_OK)` alone is not a sandbox
grant. `TMPDIR` is a general Python alternative when established before startup;
the dedicated override is narrowly scoped to these six fixtures.

## Contract 11 observations, not a claim about every host

Read-only inspection saw `/var/tmp` and `/dev/shm` without `.git`. Each was tried
once with the execution tool's explicit additional write permission. A newly
created private child was 0700, but the actual granted executions observed
`/var/tmp/.git` and `/dev/shm/.git` respectively. The `/dev/shm` trial invoked the
real production sink constructor, without fixture hooks: it rejected the ancestor
with `ResultStoreIntegrityError: result root must be outside Git worktrees`.
Only each trial's own directory was removed. No system chmod, mount, proxy,
permission bypass or Git marker removal was performed.

The fixture override cannot cure a Git ancestor. The origin/creation mechanism of
those tool-visible markers is UNKNOWN; do not infer a platform implementation from
their changing visibility. This executor remains blocked for real sink setup on
the tested roots. A runner/host must provide an approved private result path whose
actual execution view has no Git ancestor. No further filesystem sweep is needed.

## Real persistence check, once such a root is available

The six existing tests use real files/SQLite but inject a fixture directory-fsync
hook. Passing them alone does not prove production fsync or cloud durability.
For a separate real smoke check, use `FileResultSink(private_root)` **without**
`_fixture_dir_fsync`; in process A call `store(operation_uuid, request_sha,
exact_bundle_bytes)` and preserve its opaque ref/hash/length. Exit A. In process B
construct a new sink on the same private root and call
`load(ref, operation_uuid, request_sha, bundle_sha256)`, checking exact byte equality
and SHA-256. Keep the root outside Git and owner-private throughout. Use synthetic
bytes/IDs, no provider or credentials. Do not report this check as PASS if the
constructor, directory fsync, process start or reopen is blocked.

Contract 11 cannot reach store/reopen on the tested execution roots because the
production constructor rejects them first. The receipt records that limitation,
the actual test summary and hashes. No PC-off, native cloud durability or pipeline
completion follows from this fixture parameter or runbook.
