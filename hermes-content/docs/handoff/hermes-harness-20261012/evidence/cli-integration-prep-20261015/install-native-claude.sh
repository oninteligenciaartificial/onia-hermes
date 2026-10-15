#!/usr/bin/env bash
# Prepared only. No download/install occurs unless --apply-approved is supplied.
set -euo pipefail
if [[ "${1:-}" != --apply-approved ]]; then
  printf '%s\n' 'DRY RUN: isolated native Claude 2.1.288 -> /opt/onia/claude-cli/2.1.288/claude; official GPG manifest and pinned SHA256 verification; no global Node/CLI replacement.'
  exit 0
fi
[[ "$(id -u)" == 0 ]] || { printf '%s\n' 'root required'; exit 1; }
[[ "$(uname -m)" == x86_64 ]] || exit 1
for tool in curl gpg sha256sum python3 install mktemp awk wc; do command -v "$tool" >/dev/null; done
target=/opt/onia/claude-cli/2.1.288/claude
expected=0298068b686e7fdbaf9402a7a587bb7f49c0b0e084de09f69145a0719207640c
fingerprint=31DDDE24DDFAB679F42D7BD2BAA929FF1A7ECACE
base=https://downloads.claude.ai/claude-code-releases/2.1.288
[[ ! -e "$target" ]] || { printf '%s\n' 'target exists; inspect instead of overwriting'; exit 1; }
work=$(mktemp -d /tmp/onia-claude-native.XXXXXXXX)
chmod 700 "$work"
# Keep the isolated verification directory as evidence if any check fails.
printf '%s\n' "Verification directory: $work"
mkdir "$work/gnupg"
chmod 700 "$work/gnupg"
curl --fail --silent --show-error --proto '=https' --tlsv1.2 https://downloads.claude.ai/keys/claude-code.asc -o "$work/key.asc"
gpg --batch --homedir "$work/gnupg" --import "$work/key.asc" >/dev/null 2>&1
actual=$(gpg --batch --homedir "$work/gnupg" --with-colons --list-keys | awk -F: '$1=="fpr" {print $10; exit}')
[[ "$actual" == "$fingerprint" ]] || { printf '%s\n' 'signing key fingerprint mismatch'; exit 1; }
curl --fail --silent --show-error --proto '=https' --tlsv1.2 "$base/manifest.json" -o "$work/manifest.json"
curl --fail --silent --show-error --proto '=https' --tlsv1.2 "$base/manifest.json.sig" -o "$work/manifest.json.sig"
gpg --batch --homedir "$work/gnupg" --status-fd 1 --verify "$work/manifest.json.sig" "$work/manifest.json" > "$work/signature-status.txt"
python3 "$(dirname "$0")/verify_signature.py" "$work/signature-status.txt" "$fingerprint"
# The binary SHA is independently pinned to the reviewed official linux-x64 entry.
python3 - "$work/manifest.json" "$expected" <<'PY'
import json, sys
manifest=json.load(open(sys.argv[1], encoding='utf-8'))
platform=manifest['platforms']['linux-x64']
assert platform['binary'] == 'claude'
assert platform['checksum'] == sys.argv[2], 'reviewed checksum differs from signed manifest'
assert platform['size'] == 245734584
PY
curl --fail --silent --show-error --proto '=https' --tlsv1.2 "$base/linux-x64/claude" -o "$work/claude"
printf '%s  %s\n' "$expected" "$work/claude" | sha256sum --check --status
[[ "$(wc -c < "$work/claude")" == 245734584 ]] || exit 1
install -d -m 755 /opt/onia/claude-cli/2.1.288
install -m 755 "$work/claude" "$target"
DISABLE_AUTOUPDATER=1 "$target" --version
printf '%s\n' 'Installed isolated executable only. No authentication/configuration/restart performed.'
