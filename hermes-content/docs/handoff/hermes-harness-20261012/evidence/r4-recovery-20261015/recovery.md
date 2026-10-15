# R4 recovery — observed facts, 2026-10-15

- Authenticated Chrome OnIA exposes the exact R4 at `/remote/task_e_6ad045ab00c08327bb4ea958581c5c82`. The CLI still returns `/codex/tasks/…`, which previously showed a composer. Use the task link observed in UI; do not infer an account mismatch.
- Provider UI reports environment setup failure. Exact terminal error: `BLOCKED: no supported existing official Ubuntu binary source; no new repository`. `setup_recipe.py --apply-reviewed-manifest` exits 1 before agent/browser. This is not a browser sandbox failure.
- Frozen recipe at Git 0e01dc09 checks only archive/security Ubuntu hosts. Its final error means zero eligible records; existing source definitions are not included in the failure log. The earlier metadata-only Cloud inspection hid names and URLs, so cannot identify the rejected source.
- A separate read-only diagnostic is authorized, reviewed, and submitted. Probe uses Python standard library; no subprocess, networking, writes, installation, or browser. Returned classification is not signature verification or an installation authorization.
- Temporary setup wrapper and maintenance `:` prevent incidental pnpm installation. Original fields are saved outside Git and must be restored and verified by hash. Other environment settings remain unchanged. Historical R4 and its queue remain intact.
- Diagnostic task: `task_e_6ad0c5a6abec8327a067f26b0e8445f2`; Cloud branch `codex/orquestacion-subagentes-20261013`; operation receipt separate from R4. No blind replay.

Status: diagnostic reached agent; JSON not recovered from successful setup UI. Original fields restored with exact hashes. No all-cloud or PC-off claim.

## Additional verified lessons

1. Successful setup stdout was not exposed by the `/remote` task UI after the diagnostic reached the agent phase. The minimal response did not contain the JSON. This is an observability design failure, not evidence the classification failed. Do not count this task as a recovered diagnostic result.
2. Original setup and maintenance restored, reopened, and matched their original SHA-256 exactly (see diagnostic-config-restore.json). The cache toggle was unchanged, but script edits invalidate material cache automatically according to [official docs](https://learn.chatgpt.com/docs/environments/cloud-environment).
3. QA corrected the probe host flag to match the recipe's `endswith` filter exactly; a narrower regex mislabeled nested archive subdomains. The flag only explains selection, not full trust validation.
4. Initial repeated broad policy reads wasted context; prefer current ownership block, current checkpoint, and exact evidence/code ranges. No full transcript or unchanged suite repetition.
5. Routing requested by Sergio: Luna low for bounded checks/mechanics, Sol 6.1 medium for code, Sol low for focal QA, Astra only for ambiguous material cause/risk. One executor and one reviewer per batch; no ornamental fanout.

Next prepared diagnostic wrapper uses the same reviewed probe and then prints DIAGNOSTIC_EXPECTED_EXIT_42 and exits 42 intentionally. Provider ERROR is expected solely to expose setup stdout; success requires recovered JSON plus the marker, not the ERROR label. This wrapper has not been submitted. Restore originals after each bounded run; never replay R4 or alter its queue.

Second diagnostic submitted 2026-10-15 12:36 UTC: task_e_6ad0c8cad0808327a72fa0c2980d7f76. Expected setup exit42 is intentional and must include JSON plus marker before any diagnosis. Preflight showed eight terminal tasks and no active tasks. Setup SHA2cfeeb16d06bae8d93af84315c8957eb13c285f36a0c956898564b93a424cc4c readback matched; maintenance ':' matched. Awaiting provider result, restoration pending for this second operation.

## Installation gate, prepared from exact historical evidence

Frozen `0e01dc09:.../cloud-browser-prepared-20261014/r4/r4-reviewed-install-manifest-candidate.json` declares `APPROVED_FOR_SETUP_ONLY`, `downloads_and_install_approved=true`, human reference `user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:setup-R4-autonomia-20261014`, bound to recipe SHA369f5ddd83e43a102a713baa109dc38bf717107fc341d07d420a2abf67495519 and historical operation R4. Component set: 33 APT names, Playwright1.64.0, greenlet3.5.6, pyee13.0.1, typing-extensions4.16.0, Chromium156.0.8078.4 revision1248. This is evidence of that exact prior approval, not authority to replace its recipe/origins or replay operation.

If classification reveals a mirror, prepare a change limited to its exact observed source selection while preserving existing URI/suite/components/keyring and signed Ubuntu Release verification. Do not accept arbitrary mirrors or add repositories; no trust bypass. Review new hashes/manifest/lineage before asking for a specific sensitive approval. Unknown host remains redacted in the probe and cannot be admitted from a category alone; additional bounded inspection may be necessary. No package execution is authorized by the current diagnostics themselves.

## Recovered diagnostic, 2026-10-15 12:45 UTC

The second task returned JSON and DIAGNOSTIC_EXPECTED_EXIT_42. Three one-line source files were present, one containing four binary Noble entries. Every URI had recipe_host_eligible=false and ubuntu_path=false, with credentials/query/fragment absent. Therefore existing Noble entries were rejected by the recipe's host filter (and would fail its URI path filter); missing APT or deb822 incompatibility is not the demonstrated cause. Actual hosts/paths were redacted, so this does not establish trusted mirror identity or signature validity. The original setup/mantenimiento were restored with exact readback hashes again at 12:45:02 UTC.

Learning: over-redaction removed the diagnostic fields needed for a correction, causing another incomplete observation. The next bounded read-only inspection must return sanitized host/path, suites/components, keyring identity and local Release/signature evidence in one coherent batch. Never expose userinfo/query/fragment, proxy credentials, auth files or raw environment. No change to installation trust is approved by this classification alone.

## Complete trust diagnostic recovery and pending snapshot recipe, 2026-10-15

The existing task task_e_6ad0ceffce048327a2ac40888465fe00 setup log returned the
complete bounded trust JSON and expected marker/exit42. `trust-result-full.json`
now preserves all 11707 JSON bytes plus one LF (11708 file bytes). Raw JSON SHA256
is `1be880a4428df75a2095349ad719800f03273245b3d8c6eab2f8ad34493139d7`, identical
to the DOM extraction and earlier reported digest. The separate
`trust-result-full-receipt.json` records raw/file/canonical hashes and 4 source
records, 6 InRelease records, 33 packages. Previous `trust-result.json` is a
1609-byte summary, preserved unchanged. The prior Luna delivery did not produce
the requested complete recoverable JSON; summary delivery was insufficient.
No measured model cost/saving conclusion follows from that failure.

The observed Noble source is `snapshot.ubuntu.com` with sanitized path
`/ubuntu/20260828T000000Z/`, exact existing Ubuntu Signed-By, four Noble suites
and main/restricted/universe/multiverse. Four local Ubuntu InRelease signatures
verified against the existing protected Ubuntu keyring; LLVM and mise records
failed against that Ubuntu keyring. Overall trust/freshness/source-index-payload
linkage remain UNKNOWN. Candidate policy is 20 UNKNOWN, 2 NONE, 11 known versions;
that is not proof all dependencies are available or installation-ready.

Observability lessons: exit42/marker must follow successful JSON-producing Python
only, so the reviewed wrapper uses `set -e`; fake Python success/failure tests
verify expected42 versus original error7 without marker. A successful setup UI
previously hid stdout; this expected failure is an observation mechanism, not a
provider success claim. Extract the full probe JSON and verify its digest before
claiming delivery, without replacing it by a summary.

`snapshot-recipe-candidate/` prepares a local, unexecuted recipe, pending manifest,
lineage, focal tests and review/restoration plan. It adds a literal HTTPS snapshot
host with a strict real UTC timestamp path while preserving existing source URI,
suites/components/keyring and normal APT authentication. Unresolved candidates
stop before install with sanitized phase/package names. No new repository,
dependency fallback or trust bypass was added. Installation is NOT APPROVED;
the candidate manifest explicitly has PENDING_APPROVAL, downloads/install=false
and null approval references. No Cloud submit, setup execution or Git mutation
was performed in this candidate work.

Real remaining integration gap: native_cloud_lineage.py pins the historical recipe
at line18; controller intent at lines78-90/129-155, configuration receipt at
lines222-282 and setup/contract checks at lines319-344 all bind that historical
digest. A new snapshot recipe cannot satisfy that consumer unchanged. This is a
setup candidate, not the complete R4 fix. The accompanying plan proposes an
explicit Root-approved pinned recipe revision preserving historical acceptance,
never an arbitrary digest supplied by the task or default approval. Consumer,
final admission guard, queue, intent, lease and historical R4 task remain untouched.
Any future setup diagnostic needs explicit approval, a distinct Cloud execution
and exact restoration/readback; it does not authorize replay of consumed R4.

## Architecture decision: setup-only gate first

After identifying that only historical literal Root grants currently back
NativeWorkAuthority, the proposed consumer change was paused before editing.
Architecture selected a distinct setup-only trial first; no new authority,
consumer, final validator, DB, intent or queue was created or changed.
The candidate recipe/manifest now pin new locally generated trial UUID
`9fc238a7-aa41-433c-8681-a9bf6ec6a340`; parent R4 remains lineage only.
The recipe records exact approved manifest SHA256 in its actual protected setup
receipt. The manifest is still PENDING_APPROVAL/false with null grant references.
Future activation changes only its four documented approval fields, then renders
the exact wrapper without changing recipe bytes. No real approval exists here.

`snapshot-recipe-candidate/setup-trial-wrapper.sh` embeds exact recipe and pending
manifest. Pending approval rejects before staging/install. An approved run must
complete recipe exit0 and match the actual root-owned protected setup receipt
before printing JSON, ONIA_SETUP_TRIAL_COMPLETED and expected exit42. set-e blocks
the marker on failure. Tests mock pending/failure/empty-receipt cases only; they
are not an installation proof. Current ownership was acknowledged/stopped before
each writing handoff to avoid duplicate executors. Full setup-only contract and
restoration steps are in review-and-restoration.md; the E2E consumer plan remains
unimplemented and requires separate review after a real setup receipt.

## Independent restoration reverification, 2026-10-15 13:46 UTC

The earlier Luna `trust-config-restore.json` transcribed setup SHA256 incorrectly
by copying the maintenance hash suffix. Preserve that original record as historical
evidence of the transcription error. A new read-only reload of the existing edit
page and exact DOM textarea.value hashing, compared to the original private files
outside Git, confirmed setup 14832 bytes SHA256
`57f1f52c4898c6aad6ba494d2e010e009959fd17296089fcf223b3f7a3817a62`
and maintenance 144 bytes SHA256
`6a3ea5b3f45cc9a6066d94824ccfedb8c301dd572f5a36ee3bac398d9ad2a726`.
Both match the original bytes/hash independently. Cache enabled, read-only HTTP
and domains example.com/iana.org/www.iana.org were also observed unchanged.
`trust-config-restore-reverified.json` records this current evidence without raw
scripts. No settings edit, submit or installation occurred during the check.

## Byte-preserving Git archival

During staging, core.autocrlf initially normalized CRLF JSON to LF, changing the
reviewed manifest/lineage digests even though recipe/wrapper bytes matched. A
directory-scoped `.gitattributes` now disables text conversion for this evidence
tree and permits CR-at-EOL in whitespace checks. Explicit restaging with
`git add --renormalize -- <reviewed paths>` reapplies that policy to already-staged
paths. Compare every evidence Git blob byte-for-byte against its reviewed local
file, then verify pinned recipe/manifest/wrapper digests from the remote commit.
Do not regenerate or silently update approval hashes to hide line-ending drift.

## Real human approval and one setup-only trial admission

Sergio replied literally `Aprobado` in mother chat
`01a13f7b-a156-7150-ba99-b4ff682163a1` to the concrete one-trial setup-only question.
`snapshot-setup-approved-20261015/approval-materialization.json` records the
reference, base commit and exact four changed manifest fields; candidate pending
files remain unchanged. Independent QA verified those four values, exact builder
output and shell syntax. Approved recipe SHA256 remains
`27609d8506e41dcdf4190a68991bbffcdf76499cf3aecd9a57e8c097431d4b15`;
approved manifest SHA256 is
`30a21d596b5592c3db5af2f15a0a56be06edd2adb560e93b5318424d34d6a86c`;
approved wrapper SHA256 is
`21071fdd75a92e9c3644efb4bf36be8b3d16f9a7c521081bed82b4efbd849ed4`.
The approval permits one new setup-only task for UUID
`9fc238a7-aa41-433c-8681-a9bf6ec6a340`, original components and existing observed
snapshot origin, temporary setup/maintenance changes and exact restoration.
It does not permit agent/browser, production, queue/intents/leases, replay or
origin/version/security fallback. No installation result exists at this checkpoint.

## Approved setup-only installation: actual result and restoration

The exact human-approved package was published in commit 608e445d and one new
task was accepted: `task_e_6ad0e692ae0083279e999732576d8c31`, branch
`codex/hermes-controller-hardening-20261013`. Preflight: ten terminal tasks,
zero active and cursor null. Baseline DOM hashes matched original private files.
Temporary approved wrapper SHA21071fdd75a92e9c3644efb4bf36be8b3d16f9a7c521081bed82b4efbd849ed4
and maintenance `:` were saved/reopened and matched exact field hashes before
the only dispatch. Policy/cache toggle and domains remained unchanged.

UI terminal log exposed a complete actual `INSTALLED_METADATA_ONLY` receipt,
`ONIA_SETUP_TRIAL_COMPLETED` and explicit exit42. The provider error label is
expected for this deliberate observability exit, supported by receipt/marker.
Recipe ran 14:48:37.207573 through 14:57:24.973093 UTC. The full JSON is preserved
in `snapshot-setup-approved-20261015/setup-receipt-full.json`: raw1692 bytes SHA256
`6e6e9f83155018302f55decbb3174f32d30427844d196471eb221cd9c2c8b2a4`, plus one LF.
It binds new UUID9fc238a7-aa41-433c-8681-a9bf6ec6a340, parent lineage, recipe27609d…
and approved manifest30a21d… exactly. It records four selected snapshot entries,
APT resolved-version digest f388f2087992c0ac3343b4b9adb0a2b9da8d574ecca3833d75583a6851d2fa25
and Chromium executable digest377a9fc07b495c3b8d0ab8ec1fdfd153641759f9756fea34d8dfce4de82f5025.
browser_launched=false, browser_uid_required=1000. The approved wrapper checked
that stdout JSON matched the bounded protected root-owned actual receipt before
emitting the completion marker. No agent/browser operation ran.

At14:58:45.160 UTC, original setup14832 bytes SHA57f1f52c4898c6aad6ba494d2e010e009959fd17296089fcf223b3f7a3817a62
and maintenance144 bytes SHA6a3ea5b3f45cc9a6066d94824ccfedb8c301dd572f5a36ee3bac398d9ad2a726
were saved back, reopened and hashed from exact DOM values. Both raw-string
equality and comparison against independently hashed private originals passed.
Policy/cache toggle remained unchanged. Receipts `terminal-result.json` and
`config-restore-readback.json` preserve the result/restoration. Material provider
cache state and readiness to resume installed files remain UNKNOWN: restoring
fields does not prove cache retention and this run made no browser/E2E/PC-off claim.
There was one submit, no retry, no R4 replay and no queue/DB/intent/consumer changes.
Independent runtime QA returned GO for INSTALLED_METADATA_ONLY before the final
evidence commit, without rerunning closed suites or widening the scope.

Transfer lesson: a first compressed literal copy failed decompression before
any field edit; a subsequent7052-character gzip/base64 bundle was transferred in
three short chunks and verified by compressed-bundle SHA and final wrapper SHA
before fill. No recipe/wrapper bytes were altered and the failure did not cause
an extra submit. stdout was buffered until recipe terminal, so intermediate
APT/pip/Chromium phase was UNKNOWN; existing timeout evidence was read only,
not changed mid-run. No cutoff or cancellation was imposed on partial installation.

Coordination lesson: a draft apt_trust_diagnostic.py was written immediately before mother transferred its ownership to Sol. No execution or data loss. /root/r4_recovery stopped editing on notification; /root/apt_trust_code is now sole code/wrapper/test writer, recovery retains browser and docs. Require prior writer stop ACK before future handoff to avoid simultaneous edits. Mother acknowledged dispatch timing issue.
