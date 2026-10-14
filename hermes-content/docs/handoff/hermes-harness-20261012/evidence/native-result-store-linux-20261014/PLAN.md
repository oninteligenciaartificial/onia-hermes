# Prepared Linux filesystem QA — NOT EXECUTED
Root ACK required after review of source-manifest.json, remote_probe.py and launch_probe.py.
Command after ACK only: python -B E:/onia-wt/native-result-store-probe-prepared-20261014/launch_probe.py
One SSH connection, no retries, existing documented local key, BatchMode/StrictHostKeyChecking; no login or host-key enrollment.
Remote command: python3 -I -B - (stdin is pinned remote_probe.py, 244506 bytes).
Public sources: exactly six manifest files; see exact per-file bytes in manifest. No repo clone or installation.
Actual decoded source total is 178997 bytes. Encoded complete payload <256KiB.
Creates one tempfile.mkdtemp root /tmp/onia-native-result-store-qa-20261014-* with mode0700; source files0600; fixture temps confined there by tempfile.tempdir.
Only 17 filesystem fixtures. POSIX uses actual file and directory fsync; Windows-only fixture should skip once. No runtime claimed before receipt.
Test timer25s, CPU25s, address space100MiB, file-size8MiB, no core dump, nice+10; transport deadline40s.
Audit rejects sockets, subprocesses, os.system/os.posix_spawn and SQLite connections inside probe. No provider, production queue, service, Git or environment/credential content reads.
Suppress suite output and exception messages; receipt only public hashes/python/platform/counts/duration/real-fsync counts, bounded16KiB. SSH stderr discarded with2KiB capture bound.
Cleanup requires resolved exact created root under /tmp, required prefix, same device/inode and real directory; removes only that tree. No broad cleanup command.
Failure/timeout means stop without automatic reconnect. Transport termination may leave cleanup UNKNOWN; never infer success.
Includes no production connector; adapter->sink->load uses existing step mock and real isolated filesystem.
Final gates: PASS requires17tests, zero failures/errors, exactly the Windows-only fixture skip, and positive successful real file AND directory fsync counts. Any other skip yields fail.
One-shot launcher checks prior receipt, exclusively creates and fsyncs attempt-once.json BEFORE Popen, rechecks receipt, never resets marker. Failure/timeout consumes attempt. Marker contains only UTC timestamp/payload SHA/scope/retry policy, no authority claim.
remote_probe.py SHA256 237997c300ce89d3c75bcede454c2c2a2c706a84fc5ffdfef466eeaac68a6a39
launch_probe.py SHA256 C4ACD4E1F589684E354D7C4B213DA2DD615EF43EF578347D5B21BDE328992DEC
source-manifest.json SHA256 6C11EC9CEE30B5C1252953D98D874693C16BDB7408B32E50C2DA2727E0E16700
