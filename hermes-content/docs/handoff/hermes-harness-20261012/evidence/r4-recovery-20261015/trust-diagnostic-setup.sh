#!/bin/sh
# Read-only diagnostic; intentional failure exposes setup stdout in provider UI.
set -e
python3 -I -B - --execute <<'ONIA_TRUST_DIAGNOSTIC_PY'
#!/usr/bin/env python3
"""Bounded offline source/trust diagnostics. --execute explicitly reads public APT metadata.

Never read auth.conf, proxy config, environment values or private keys. No writes,
downloads, installs, browser, or source modifications. All subprocesses are fixed
absolute existing tools and offline queries; raw stdout/stderr never exported.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import stat
import subprocess
import threading
from urllib.parse import urlsplit

KEYRING = Path('/usr/share/keyrings/ubuntu-archive-keyring.gpg')
# Exact apt_package_names_approved from frozen manifest Git blob 0e01dc09.
PACKAGES = ('fonts-freefont-ttf', 'fonts-ipafont-gothic', 'fonts-liberation',
            'fonts-noto-color-emoji', 'fonts-tlwg-loma-otf', 'fonts-unifont',
            'fonts-wqy-zenhei', 'libasound2t64', 'libatk-bridge2.0-0t64',
            'libatk1.0-0t64', 'libatspi2.0-0t64', 'libcairo2', 'libcups2t64',
            'libdbus-1-3', 'libdrm2', 'libfontconfig1', 'libfreetype6', 'libgbm1',
            'libglib2.0-0t64', 'libnspr4', 'libnss3', 'libpango-1.0-0', 'libx11-6',
            'libxcb1', 'libxcomposite1', 'libxdamage1', 'libxext6', 'libxfixes3',
            'libxkbcommon0', 'libxrandr2', 'xfonts-cyrillic', 'xfonts-scalable', 'xvfb')
SAFE_WORD = re.compile(r'[a-zA-Z0-9][a-zA-Z0-9._+:~-]{0,160}')
MAX_OUTPUT = 262144


def no_symlinks(path):
    # All components, not only the leaf. Runtime is Linux; tests also run Windows.
    for component in [path] + list(path.parents):
        if component.is_symlink():
            raise ValueError('SYMLINK_REJECTED')


def bounded_directory(path, limit):
    no_symlinks(path)
    result = []
    for item in path.iterdir():
        if len(result) >= limit:
            raise ValueError('DIRECTORY_COUNT_EXCEEDED')
        result.append(item)
    return sorted(result)


def safe_word(value):
    return value if SAFE_WORD.fullmatch(value) else 'REDACTED_UNSAFE_VALUE'


def bounded_read(path, limit=65536):
    no_symlinks(path)
    metadata = path.lstat()
    if not stat.S_ISREG(metadata.st_mode) or metadata.st_size > limit:
        raise ValueError('NONREGULAR_OR_OVERSIZE')
    descriptor = os.open(path, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0) | getattr(os, 'O_NONBLOCK', 0))
    with os.fdopen(descriptor, 'rb') as handle:
        opened = os.fstat(handle.fileno())
        if not stat.S_ISREG(opened.st_mode) or (metadata.st_dev, metadata.st_ino) != (opened.st_dev, opened.st_ino):
            raise ValueError('FILE_CHANGED')
        raw = handle.read(limit + 1)
    if len(raw) > limit:
        raise ValueError('OVERSIZE')
    return raw


def public_uri(value):
    try:
        uri = urlsplit(value)
        host = uri.hostname or ''
        # Public infrastructure identity only. Never userinfo, port, query or fragment.
        hostname = host if re.fullmatch(r'[a-zA-Z0-9.-]{1,253}', host) else 'REDACTED_UNSAFE_HOST'
        if len(uri.path) > 1024:
            return {'hostname': hostname, 'path': 'REDACTED_OVERSIZE_PATH',
                    'userinfo_present': bool(uri.username or uri.password),
                    'query_or_fragment_present': bool(uri.query or uri.fragment)}
        segments = uri.path.split('/')
        safe_path = []
        for segment in segments:
            if not segment:
                safe_path.append('')
            elif (not re.fullmatch(r'[a-zA-Z0-9._-]{1,64}', segment)
                  or re.search(r'(?i)(token|password|secret|credential|api.?key)', segment)
                  or re.fullmatch(r'[0-9a-fA-F]{24,}', segment)):
                safe_path.append('REDACTED_SEGMENT')
            else:
                safe_path.append(segment)
        return {'hostname': hostname, 'path': '/'.join(safe_path),
                'scheme': uri.scheme if uri.scheme in {'http', 'https'} else 'OTHER',
                'userinfo_present': bool(uri.username or uri.password),
                'query_or_fragment_present': bool(uri.query or uri.fragment)}
    except ValueError:
        return {'status': 'INVALID_URI'}


def signed_by(value):
    if value is None:
        return {'state': 'IMPLICIT_GLOBAL_TRUST', 'values': []}
    if 'BEGIN PGP' in value:
        return {'state': 'EMBEDDED_KEY_NOT_EXPORTED', 'values': []}
    values = []
    for item in value.replace(',', ' ').split()[:16]:
        if re.fullmatch(r'(?:/usr/share/keyrings/|/etc/apt/keyrings/|/etc/apt/trusted.gpg.d/)[A-Za-z0-9_.-]{1,100}\.(?:gpg|asc)', item):
            values.append(item)
        elif re.fullmatch(r'[A-Fa-f0-9]{40}!?', item):
            values.append(item.upper())
        else:
            values.append('REDACTED_NONPUBLIC_KEY_REFERENCE')
    return {'state': 'EXPLICIT', 'values': values}


def source_fields(text, deb822):
    if deb822:
        for block in re.split(r'\n[ \t]*\n', text):
            result, current = {}, None
            for line in block.splitlines():
                if not line.strip() or line.startswith('#'):
                    continue
                if line[0].isspace() and current:
                    result[current] += ' ' + line.strip()
                elif ':' in line and not line[0].isspace():
                    key, value = line.split(':', 1)
                    key = key.lower()
                    if key in result:
                        raise ValueError('DUPLICATE_FIELD')
                    result[key], current = value.strip(), key
                else:
                    raise ValueError('MALFORMED_SOURCE')
            if result:
                yield result
    else:
        for line in text.splitlines():
            line = line.split('#', 1)[0].strip()
            if not line:
                continue
            match = re.fullmatch(r'(deb|deb-src)\s+(?:\[([^\]]*)\]\s+)?(\S+)\s+(\S+)\s+(.+)', line)
            if not match:
                raise ValueError('MALFORMED_SOURCE')
            result = {'types': match[1], 'uris': match[3], 'suites': match[4], 'components': match[5]}
            for option in shlex.split(match[2] or ''):
                if '=' not in option:
                    raise ValueError('MALFORMED_OPTION')
                key, value = option.split('=', 1)
                if key in result:
                    raise ValueError('DUPLICATE_OPTION')
                result[key.lower()] = value
            yield result


def metadata(path):
    try:
        raw = bounded_read(path, 1048576)
        m = path.lstat()
        protected = all(p.stat().st_uid == 0 and not p.stat().st_mode & 0o022
                        for p in [path] + list(path.parents))
        return {'exists_regular': True, 'bytes': len(raw), 'uid': m.st_uid,
                'mode': oct(stat.S_IMODE(m.st_mode)), 'sha256': hashlib.sha256(raw).hexdigest(),
                'root_protected': protected}
    except (OSError, ValueError):
        return {'exists_regular': False}


def offline(argv, timeout=5):
    if argv[0] not in {'/usr/bin/gpgv', '/usr/bin/apt-cache'}:
        return {'status': 'TOOL_NOT_ALLOWED'}, ''
    try:
        tool = Path(argv[0])
        no_symlinks(tool)
        m = tool.stat()
        if not stat.S_ISREG(m.st_mode) or m.st_uid != 0 or m.st_mode & 0o022:
            return {'status': 'TOOL_UNPROTECTED'}, ''
        # Fixed environment, no inherited proxy/auth/GPG/APT overrides. apt-cache
        # also overrides main/parts below, so no local APT hooks/config are loaded.
        process = subprocess.Popen(argv, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
                                   stderr=subprocess.DEVNULL, shell=False,
                                   env={'PATH': '/usr/bin:/bin', 'LC_ALL': 'C',
                                        'APT_CONFIG': '/dev/null', 'HOME': '/nonexistent'})
        output = bytearray()
        overflow = threading.Event()

        def collect():
            while True:
                chunk = process.stdout.read(4096)
                if not chunk:
                    break
                if len(output) + len(chunk) > MAX_OUTPUT:
                    overflow.set()
                    process.kill()
                    break
                output.extend(chunk)

        reader = threading.Thread(target=collect, daemon=True)
        reader.start()
        try:
            code = process.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=1)
            reader.join(timeout=1)
            process.stdout.close()
            return {'status': 'TIMEOUT'}, ''
        reader.join(timeout=1)
        process.stdout.close()
        if overflow.is_set() or reader.is_alive():
            return {'status': 'OUTPUT_OVERSIZE_OR_INCOMPLETE'}, ''
        return {'status': 'EXECUTED', 'returncode': code}, output.decode('utf-8', 'replace')
    except FileNotFoundError:
        return {'status': 'TOOL_MISSING'}, ''
    except (OSError, ValueError, subprocess.TimeoutExpired):
        return {'status': 'TOOL_ERROR_OR_TIMEOUT'}, ''


def verify_release(path, keyring, raw=None):
    if raw is not None and not all(marker in raw for marker in (
            b'-----BEGIN PGP SIGNED MESSAGE-----', b'-----BEGIN PGP SIGNATURE-----',
            b'-----END PGP SIGNATURE-----')):
        return {'state': 'UNKNOWN', 'reason': 'CLEARSIGNED_SIGNATURE_ABSENT'}
    if not keyring.get('root_protected'):
        return {'state': 'UNKNOWN', 'reason': 'KEYRING_MISSING_OR_UNPROTECTED'}
    check, _ = offline(['/usr/bin/gpgv', '--homedir', '/nonexistent', '--keyring', str(KEYRING), str(path)])
    state = 'UNKNOWN'
    if check.get('status') == 'EXECUTED':
        state = 'VERIFIED_WITH_EXISTING_UBUNTU_KEYRING' if check['returncode'] == 0 else 'FAILED'
    return {'state': state, 'tool': check}


def package_policy():
    check, output = offline(['/usr/bin/apt-cache', '-o', 'Dir::Etc::main=-',
                             '-o', 'Dir::Etc::parts=-', '-o', 'Dir::Cache::pkgcache=',
                             '-o', 'Dir::Cache::srcpkgcache=', '-o', 'Debug::NoLocking=true',
                             'policy', *PACKAGES])
    # Raw policy includes full repository URLs; export only two version fields.
    parsed, current = {}, None
    for line in output.splitlines():
        if line.endswith(':') and line[:-1].split(':')[0] in PACKAGES and not line[0].isspace():
            current = line[:-1].split(':')[0]
            parsed[current] = {}
        elif current:
            match = re.fullmatch(r'\s*(Installed|Candidate): (\S+)\s*', line)
            if match:
                parsed[current][match[1].lower()] = 'NONE' if match[2] == '(none)' else safe_word(match[2])
    return [{'package': package, 'query': check,
             'installed': parsed.get(package, {}).get('installed', 'UNKNOWN'),
             'candidate': parsed.get(package, {}).get('candidate', 'UNKNOWN')}
            for package in PACKAGES]


def inspect():
    report = {'schema': 1, 'kind': 'APT_TRUST_OFFLINE_DIAGNOSTIC', 'network_requests': 0,
              'installs': 0, 'writes': 0, 'keyring': metadata(KEYRING), 'sources': [], 'release_files': [],
              'trust_limit': 'Local signature verification uses only the existing protected Ubuntu-named keyring, whose external provenance is not established. Metadata alone is untrusted. Freshness, source-to-index linkage and package payload integrity are UNKNOWN; no download or install.',
              'overall_trust': 'UNKNOWN', 'package_manifest_git_blob': '0e01dc09',
              'bounds': {'source_files': 129, 'source_bytes_each': 65536,
                         'list_entries': 512, 'release_files': 16, 'release_bytes_each': 4194304,
                         'subprocess_timeout_seconds': 5, 'subprocess_stdout_bytes': MAX_OUTPUT}}
    parts = Path('/etc/apt/sources.list.d')
    try:
        discovered = bounded_directory(parts, 128)
        paths = [Path('/etc/apt/sources.list')] + sorted(p for p in discovered if p.suffix in {'.list', '.sources'} and re.fullmatch(r'[a-zA-Z0-9_.-]+', p.name))
    except (OSError, ValueError):
        report['source_directory_status'] = 'UNREADABLE_OR_LIMIT_OR_SYMLINK'
        paths = [Path('/etc/apt/sources.list')]
    for index, path in enumerate(paths):
        item = {'ordinal': index, 'format': 'deb822' if path.suffix == '.sources' else 'one_line'}
        try:
            text = bounded_read(path).decode('utf-8')
            item['entries'] = []
            for fields in source_fields(text, path.suffix == '.sources'):
                signed = fields.get('signed-by')
                item['entries'].append({
                    'types': [safe_word(v) for v in fields.get('types', '').split()],
                    'uris': [public_uri(v) for v in fields.get('uris', '').split()],
                    'suites': [safe_word(v) for v in fields.get('suites', '').split()],
                    'components': [safe_word(v) for v in fields.get('components', '').split()],
                    'enabled': fields.get('enabled', 'yes').lower() == 'yes',
                    'signed_by': signed_by(signed),
                    'architectures': [safe_word(v) for v in fields.get('architectures', fields.get('arch', 'default')).split()],
                    'trust_bypass_present': any(fields.get(k, '').lower() in {'yes', 'true', '1'} for k in ('trusted', 'allow-insecure', 'allow-weak', 'allow-downgrade-to-insecure')),
                    'trust_options': {k: (fields[k].lower() if fields[k].lower() in {'yes', 'no', 'true', 'false', '1', '0'} else 'UNKNOWN_VALUE')
                                      for k in ('trusted', 'allow-insecure', 'allow-weak', 'allow-downgrade-to-insecure', 'check-valid-until', 'check-date') if k in fields},
                })
            item['status'] = 'READ'
        except (OSError, ValueError, UnicodeError):
            item['status'] = 'MISSING_OR_UNSUPPORTED'
        report['sources'].append(item)
    lists = Path('/var/lib/apt/lists')
    try:
        list_paths = bounded_directory(lists, 512)
        report['index_state'] = {'directory_entries': len(list_paths),
                                 'package_index_file_count': sum(bool(re.search(r'_Packages(?:\.(?:lz4|gz|xz|bz2|zst))?$', p.name)) for p in list_paths),
                                 'freshness': 'UNKNOWN', 'package_payload_integrity': 'UNKNOWN'}
        release_paths = [p for p in list_paths if p.name.endswith('_InRelease')]
        if len(release_paths) > 16:
            report['release_status'] = 'TOO_MANY_FILES'
            release_paths = []
        else:
            report['release_status'] = 'PRESENT' if release_paths else 'NO_LOCAL_INRELEASE'
        for index, path in enumerate(release_paths):
            entry = {'ordinal': index}
            try:
                raw = bounded_read(path, 4194304)
                entry['sha256'] = hashlib.sha256(raw).hexdigest()
                for key in ('Origin', 'Label', 'Suite', 'Codename', 'Architectures', 'Components', 'Date', 'Valid-Until'):
                    matches = re.findall(r'^' + re.escape(key) + r': ([^\r\n]*)$', raw.decode('utf-8'), re.M)
                    entry[key] = matches[0] if len(matches) == 1 and re.fullmatch(r'[a-zA-Z0-9 ,:+._/-]{1,200}', matches[0]) else 'ABSENT_OR_UNSAFE'
                entry['metadata_authentication'] = 'UNTRUSTED_UNLESS_SIGNATURE_VERIFIED'
                entry['ubuntu_keyring_verification'] = verify_release(path, report['keyring'], raw)
                # Fail closed if bytes changed while gpgv was inspecting the file.
                if (hashlib.sha256(bounded_read(path, 4194304)).hexdigest() != entry['sha256']
                        or metadata(KEYRING) != report['keyring']):
                    entry['ubuntu_keyring_verification'] = {'state': 'UNKNOWN', 'reason': 'FILES_CHANGED_DURING_VERIFICATION'}
            except (OSError, ValueError, UnicodeError):
                entry['status'] = 'UNREADABLE'
            report['release_files'].append(entry)
    except (OSError, ValueError):
        report['release_status'] = 'DIRECTORY_UNREADABLE_OR_LIMIT_OR_SYMLINK'
        report['index_state'] = {'status': 'UNKNOWN'}
    report['packages'] = package_policy()
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--execute', action='store_true')
    args = parser.parse_args()
    print(json.dumps(inspect() if args.execute else {'status': 'DRY_RUN', 'effects': 0}, sort_keys=True))


if __name__ == '__main__':
    main()

ONIA_TRUST_DIAGNOSTIC_PY
printf '%s\n' DIAGNOSTIC_EXPECTED_EXIT_42
exit 42
