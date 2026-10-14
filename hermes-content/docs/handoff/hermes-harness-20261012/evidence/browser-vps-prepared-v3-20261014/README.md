# Prepared VPS browser runtime (V3)

Preparation and local fake-only guard tests are complete. No image pull, package installation, image build, container launch, browser launch, network navigation, or Telegram action was performed. Public mode remains disabled.

The runner is fail-closed: it requires a separately approved nonce whose SHA-256 is explicitly bound in the source, reserves it with `O_EXCL` plus file and directory fsync before any Docker inspection, and never releases it automatically. Durable reservations live under `/var/lib/onia-browser-control`, which must already exist, be mode 0700, and belong to the runner UID. The container CID is held there, outside `/out`. A timeout cleanup may request a kill only after Docker inspection confirms owner/run-ID/nonce-hash labels; the outcome remains `UNKNOWN` / `needs_reconcile`.

The derived image tag is only a build label. The runner refuses execution until a separately reviewed immutable local image ID is configured. A missing or mismatched ID blocks before launch. The package lock includes `typing-extensions==4.16.0` with the official PyPI wheel hash required transitively by pyee 13.0.1; metadata only was inspected and no wheel was downloaded.

The browser derivative reports execution host `VPS`. A desktop Cloud session ID is not reused or asserted; without an explicit runtime identity it reports `UNKNOWN`. The public route remains disabled pending a separately reviewed egress filter and authorization.

Container restrictions remain: network none for offline smoke, user `pwuser`, all capabilities dropped, `no-new-privileges`, official seccomp profile in-container, CPU 0.50, memory/swap 768 MiB, 256 PIDs, read-only root, bounded tmpfs, no published ports, and one fresh private output mount. No world-writable fallback or host permission changes are prepared. The numeric pwuser UID/GID remains unknown until an approved build is available; the probe fails closed if the fresh output path is not writable.

Validation: nine local unit tests exercise fake Docker boundaries only, including missing-approval and replay-before-preflight, CID mount separation and label matching, immutable image-ID comparison, and ambiguous timeout reconciliation. They ran on Windows; they do not verify POSIX ownership/fsync behavior, execute Docker, import Playwright, launch Chromium, or test actual sandbox/effective network isolation.
