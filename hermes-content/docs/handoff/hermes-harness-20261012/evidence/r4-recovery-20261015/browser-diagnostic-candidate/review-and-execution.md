# Next browser diagnostic and queue E2E preparation — NOT APPROVED

META: obtain one real bounded public browser diagnostic, then prove queue E2E
through the existing controller rather than relabelling that diagnostic as E2E.
PRUEBA: exact source/manifest pins, independent Root approval/readback, actual
runtime receipts and independent QA. Offline fixtures prove only their contracts.
PARADA now: before new installation, Cloud submit, real queue/schema mutation,
production, client data, account access, credentials or spending.

Owner: `/root/apt_trust_code`; review coordinated by mother. CODE branch
`codex/hermes-controller-hardening-20261013`, preparation base
`bbff7d1a492650883055e3b699b0319e191baa87`. No historical R4 source, intent, grant,
nonce, receipt, consumer, queue or default admission was edited. This directory
is a candidate, not an active grant or second orchestration system.

## One concrete runtime package

Browser diagnostic UUID: `4d53a71b-80d9-4c53-83f1-df53f824ab7f`.
Optional explicitly selected new installer UUID:
`857f90fa-12b7-4641-a326-e6bbad9f6745`. Historical R4 and setup-only9fc238a7
are lineage, not successful causal predecessors. There is no queue reservation
or invented worker for this diagnostic. It cannot bypass the unresolved queue.

The recommended combined mode is `INSTALL_PINNED`, because material cache is
UNKNOWN and saving setup/maintenance/env pins invalidates the legacy cache.
It requires explicit approval of a fresh installation; the previous single
installation grant was consumed. No task is submitted just to discover a cache
miss. `PRESENCE_ONLY` is a separately selectable internal gate and never installs
when required files are absent. There is no automatic switch between modes.

`setup_recipe.py` differs from the previously approved snapshot recipe ONLY in
the setup UUID literal. New recipe SHA256:
`0237492e3cb76032bc64e6d4d737bd9de079997ebdf1f282da5cc313af6c430d`.
The original 33 APT package names remain exact in
`install-manifest-candidate.json`; resolution is through the already-observed
official Ubuntu Noble snapshot `/ubuntu/20260828T000000Z/` with native APT
signature/hash verification. No new repository, authentication bypass, unknown
candidate fallback or relaxed freshness setting is introduced. Exact Python
packages: playwright1.64.0, greenlet3.5.6, pyee13.0.1,
typing-extensions4.16.0. Chromium156.0.8078.4 revision1248, full browser;
installer may obtain the originally reviewed support utility ffmpeg1013.
No new API billing/account/production/service work is included.

The pending setup wrapper embeds the recipe and pending install manifest.
`set -e` plus the reviewed builder gate ensures failure cannot print the success
marker. On actual successful installation it prints the controlled actual setup
receipt and `ONIA_BROWSER_SETUP_COMPLETED`, returns0 and permits the task agent
phase. This differs intentionally from the earlier setup-only exit42: here the
agent must run the separately admitted browser entry. The setup marker alone
proves neither browser nor E2E. No real installation has used this wrapper.
The inherited recipe deliberately blocks if its runtime directory already
exists; it never deletes, overwrites or reinstalls over a previous cache. Thus a
surviving cache also requires the independently selected presence-only mode;
this candidate does not silently install over it or switch modes after dispatch.

## Admission and browser behavior

`manifest-candidate.json` is pending, browser=false, install=false, human ref=null.
It cannot pass admission or install. Root, outside the task, must verify actual
human consent and publish/read back the exact manifest SHA in the public
`ONIA_BROWSER_DIAGNOSTIC_ROOT_MANIFEST_SHA256` environment pin. The task must not
set that pin or select an arbitrary receipt digest. A `verified=True` field or
caller-supplied approval reference cannot replace it.

Root materialization fields, only after approval:

- Installer sibling: state `APPROVED_FOR_SETUP_ONLY`, install flag=true and the
  two actual human references, keeping all component/recipe/operation pins fixed.
- Browser sibling: state `APPROVED_BROWSER_DIAGNOSTIC`, browser flag=true, actual
  human ref, explicit mode and its corresponding install flag, selected setup
  operation/recipe/approved-manifest SHA, actual published checkout HEAD,
  configuration readback SHA and actual provider configuration object.
- Source hashes are recomputed and compared to the reviewed package, not changed
  to accept task-provided code. No historical grant or fabricated message ID.

The manifest/approved-config receipts must be supplied as exact root-owned
protected runtime files named `manifest-approved.json` and
`configuration-readback.json` beside these sources. Root freezes the published
source HEAD first. Approved manifests stay outside that checkout until after the
trial, to avoid a self-referential Git HEAD/manifest digest. Pass their exact
public bytes to the task, independently pinned before dispatch; preserve them in
Git with the result afterward. Do not advance the selected branch between the
source freeze and submit. If provider cannot select that exact source checkout,
stop; do not fabricate observed HEAD.

`bootstrap.py --help`, default invocation and imports have no execution effects.
The eventual explicit root command is:

```sh
/usr/bin/python3 -I -B "$CANDIDATE/bootstrap.py" --execute \
  --checkout "$CHECKOUT" \
  --output-dir /workspace/browser-diagnostic-4d53a71b
```

The root bootstrap verifies the independent manifest pin, protected source and
configuration bytes, actual root-owned setup receipt, actual Chromium bytes and
the real checkout HEAD. It creates a new private UID1000 output directory and
root-owned frozen contract, then uses existing `runuser` and the installed
interpreter. Final admission runs again in the supervisor and child before any
browser launch, recomputing actual setup/executable/source/config bindings.
Missing cache/receipt or mismatch means BLOCK, with no install/retry command.

The cores are byte-exact frozen R3 sources from blob0e01dc09:
browser `aac64bb8ebc82441141787838458767125b7cdb01b28d75c0bdf2b5f46201ebb`,
supervisor `7aa687a7c694923ed8f30f3e7172926e854f6031a809b8656dd1b17fb6940ee9`.
Small wrappers change admission generation/ref/config binding and pin the new
helper/child; browser behavior is inherited: UID1000, one full Chromium launch,
normal sandbox=true, local `chrome://sandbox` proof, public example.com to IANA
navigation, GET/HEAD/OPTIONS, exact three-host allowlist, bounded public JPEG
at most90KiB, four public JSON outputs and one exclusive local claim. Supervisor
deadline75s plus2s reap grace, metadata preflight10s; outer bootstrap100s bound.
Any timeout/unknown result is reconciled on the same task, never replayed.
External helper cleanup/provider policy enforcement remain UNKNOWN unless
independently observed; local browser guards do not prove provider enforcement.

Recover `preflight.json`, `execution-receipt.json`, `supervisor-receipt.json` and
`screenshot-artifact.json` completely, hash the bytes, validate declared JPEG
hash/size, then independent QA. An agent summary or UI ERROR label is not proof.
No raw environment/config/auth/cookies/private stderr is exported. The private
contract and claim are not public result artifacts. Do not post to clients.

## Concrete execution/restoration gate

After local QA, request one combined new task: fresh pinned installation (33APT,
four Python packages, Chromium/support utility above), followed by this one
bounded public diagnostic under UUID4d53a71b, in environment6abad782… and the
reviewed published source HEAD. Approval does not include queue migration,
native E2E, another task/install, production or secret access. If human approves
presence-only instead, no fresh installation is allowed and a cache miss stops.

Before submit: zero active tasks; save exact existing setup/maintenance and both
public environment-pin values outside Git, compare hashes to private originals;
record actual policy/cache UI; render the approved installation wrapper with
`prepare_candidate.install_wrapper(recipe_bytes, approved_install_manifest_bytes)`.
Save its exact bytes plus maintenance`:`, provider policy unchanged. Read back
exact DOM `.value` and computed hashes, generate actual config receipt; materialize
browser manifest with that receipt and approved-install-manifest SHA. Save its
independent Root SHA and matching public provider JSON, then read back both pins,
scripts and policy again before the only submit. The second pin readback must not
silently substitute a different script/config. No raw scripts or credentials in Git.

After any terminal outcome, restore setup, maintenance and previous public pin
values exactly; save/reopen/read exact values and compute hashes/equality against
the private originals. Preserve result/failure phase and receipt before restoration.
No retry/reset/bypass after partial installation, missing receipt, timeout or
ambiguous submit. Report precise failed gate; any changed components/origin or
additional installation needs a new specific approval. Cache retention remains
UNKNOWN after restoration. Keep R4 and DB/lease/intents untouched.

## Queue E2E: implemented offline candidate, activation NOT approved

The existing v3 schema lacks terminal failure states. `queue_failure_candidate.py`
prepares a v3→v4 migration only for an explicit `.offline.sqlite3` copy, <=64MiB.
It verifies original CHECK layout and foreign keys, creates a write-once SQLite
backup, transactionally rebuilds only `tasks` with added `failed` status/effect,
preserves columns/indexes/references and changes user_version3→4. No new tables,
authority, worker, database service or queue is introduced. Existing production
`SQLiteQueue` stays v3; its constructor deliberately rejects v4 until a separately
reviewed activation patch. `open_offline_queue_v4` is a local-copy adapter only.

Fail-only closure requires an exact already-failed native observation (operation,
input, nonce, remote/surface/time/digest), task needs_reconcile/native_execution
with matching effect key and previous owner/fence, no task lease and independently
reviewed evidence. One transaction inserts `failed_frozen` with the observation,
makes task/effect `failed`/`failed`, preserves native record, nonce, STOP, event
counters, fences and lease tables. Exact repeat is idempotent; conflict rolls back.
This v4 closure is distinct from a v3 blocked+needs_reconcile freeze, which would
add no useful capability and was not implemented. Neither applied nor not_applied
is used; no task becomes pending/not_started.

Offline tests cover migration rollback, snapshot restoration, exact binding,
closure transaction rollback, conflicting repetition, and one queue/same worker
claiming/completing an independent synthetic fixture after failure while preserving
the original native record. This is OFFLINE fixture evidence, not native/browser
E2E. A failed task remains an invalid *causal successful predecessor* under the
unchanged bridge. Future native work must retain a genuinely successful causal
predecessor or receive an explicit reviewed contract change; R4 is lineage only.

Before real queue E2E: review/approve separately (a) original unknown→failed
observation with bounded prior-observation archive, (b) exact cold v3 backup/hash,
STOP/worker quiescence and no active leases, (c) migration activation patch making
the canonical queue understand v4 without auto-migrating on import/init, (d) Root
grant for one NEW exact TaskSpec/request/nonce with verified causal dependency,
finite effects and final admission pins. First rehearse on a consistent private
copy of the actual queue under explicit copy permission, not this synthetic fixture.
Do not infer any of these real mutations from browser-diagnostic approval.

Rollback before new events: verified backup and exact post-migration digest only;
`rollback_copy()` rejects any intervening event or backup change. If events have
occurred, no destructive rollback: STOP and review a forward repair, preserving
all receipts. No real DB copy/migration or reconciliation has been executed here.

## Focused validation and learning

Run locally with the existing Python, no installs:

```sh
python -B prepare_candidate.py --build
python -B -m unittest test_admission test_queue_failure_candidate -q
```

Builder is deterministic and cannot approve; defaults/help are inert. Candidate
installer execution is tested only with pending approval and mocked subprocess,
so it cannot be presented as another successful installation. Frozen core behavior
and old suites are not rerun as evidence of live readiness. Focused review must
check full source hashes and package-specific tests before publication.

Applied lessons: exact bytes and compressed chunk hashes before any UI fill;
DOM `.value` preserves newlines whereas AX text may normalize; no success marker
after a failed Python process; complete controlled JSON recovery instead of a
summary; ACK exclusive writer before transfer; setup success is metadata only;
do not solve authorization by caller boolean or pretend failed work was applied.
