"""Read-only skills inventory. Never loads skills or runs setup hooks."""
from __future__ import annotations
import collections
import csv
import hashlib
import io
import json
import os
from pathlib import Path
import re

BASE = Path(__file__).resolve().parent
HOME = Path('C:/Users/PC')
HERMES = Path(os.environ.get('HERMES_HOME', HOME / 'AppData/Local/hermes'))
ROOTS = {
    'hermes-default': HERMES / 'skills',
    'onia-hermes-claude': Path('C:/dev/proyectos/onia-hermes/.claude/skills'),
    'onia-hermes-agents': Path('C:/dev/proyectos/onia-hermes/.agents/skills'),
    'onia-hermes-native': Path('C:/dev/proyectos/onia-hermes/.hermes/skills'),
    'onia-platform-claude': Path('C:/dev/proyectos/onia-platform/.claude/skills'),
    'onia-platform-agents': Path('C:/dev/proyectos/onia-platform/.agents/skills'),
    'onia-platform-native': Path('C:/dev/proyectos/onia-platform/.hermes/skills'),
    'user-claude': HOME / '.claude/skills',
    'user-agents': HOME / '.agents/skills',
    'user-codex': HOME / '.codex/skills',
}
SKIP = {'.git', 'node_modules', '.venv', '__pycache__', '.cache', '.locks'}

def frontmatter(text):
    normalized = text.replace('\r\n', '\n').lstrip('\ufeff')
    match = re.match(r'\A---\s*\n(.*?)\n---(?:\s*\n|$)', normalized, re.S)
    if not match:
        return {}, 'missing'
    raw = match.group(1)
    fields = {}
    for key in ('name', 'description', 'version', 'author', 'license'):
        m = re.search(r'^' + re.escape(key) + r':\s*([^\n]*)', raw, re.M)
        if not m:
            continue
        value = m.group(1).strip()
        if value in ('>', '|', '>-', '|-', '>+', '|+'):
            after = raw[m.end():]
            lines = []
            for line in after.splitlines():
                if line.strip() and not line.startswith((' ', '\t')):
                    break
                if line.strip():
                    lines.append(line.strip())
            value = ' '.join(lines)
        fields[key] = value.strip('\"\'')
    return fields, 'present-scalar-fields-only'

rows = []
root_info = []
errors = []
for label, root in ROOTS.items():
    info = {'label': label, 'path': str(root), 'exists': root.is_dir(),
            'resolved': str(root.resolve()), 'alias': str(root.resolve()).lower() != str(root).lower()}
    before = len(rows)
    visited = set()
    if root.is_dir():
        for current, dirs, files in os.walk(root, followlinks=True):
            canonical = str(Path(current).resolve()).lower()
            if canonical in visited:
                dirs[:] = []
                continue
            visited.add(canonical)
            dirs[:] = [d for d in dirs if d not in SKIP]
            for filename in files:
                if filename.lower() != 'skill.md':
                    continue
                p = Path(current) / filename
                try:
                    raw = p.read_bytes()
                    text = raw.decode('utf-8-sig', errors='replace')
                    fm, fm_status = frontmatter(text)
                    normalized = text.replace('\r\n', '\n').replace('\r', '\n').rstrip() + '\n'
                    rows.append({'root': label, 'path': str(p), 'resolved_path': str(p.resolve()),
                                 'relative': str(p.relative_to(root)), 'name': fm.get('name', p.parent.name),
                                 'description': fm.get('description', ''), 'frontmatter': fm_status,
                                 'has_required_fields': bool(fm.get('name') and fm.get('description')),
                                 'bytes': len(raw), 'characters': len(text),
                                 'sha256_lf': hashlib.sha256(normalized.encode('utf-8')).hexdigest(),
                                 'version': fm.get('version'), 'license': fm.get('license')})
                except (OSError, ValueError) as exc:
                    errors.append({'path': str(p), 'error': type(exc).__name__})
    info['manifest_entries'] = len(rows) - before
    root_info.append(info)

legacy_root = Path('C:/dev/proyectos/onia-hermes/hermes-content/skills')
legacy = [{'name': p.stem, 'path': str(p), 'bytes': p.stat().st_size}
          for p in sorted(legacy_root.glob('*.md'))] if legacy_root.exists() else []
usage_path = HERMES / 'skills/.usage.json'
usage = json.loads(usage_path.read_text(encoding='utf-8')) if usage_path.exists() else {}
unique_physical = {}
for row in rows:
    unique_physical.setdefault(row['resolved_path'].lower(), row)
physical = list(unique_physical.values())
by_hash = collections.defaultdict(list)
by_name = collections.defaultdict(list)
for row in physical:
    by_hash[row['sha256_lf']].append(row)
    by_name[row['name']].append(row)

def brief(row):
    return {k: row[k] for k in ('root', 'name', 'path', 'resolved_path', 'sha256_lf')}

data = {
    'scope': 'Default Hermes profile, both canonical project skill roots and current-user Claude/Agents/Codex roots. Other Hermes profiles, plugin caches, commands and worktree copies excluded.',
    'limitations': ['Frontmatter is extracted statically, not fully YAML-validated.',
                    'A recorded view/use count is loading telemetry, not proof of successful application.',
                    'Global ledger does not measure read_file loads of project skills or other agents.',
                    'Zero or absent telemetry does not authorize deletion.',
                    'Symbolic-link roots/aliases are reported separately from unique physical manifests.'],
    'roots': root_info, 'entries': rows, 'legacy_markdown': legacy, 'errors': errors,
    'exact_content_duplicates': [[brief(r) for r in group] for group in by_hash.values() if len(group) > 1],
    'same_name_different_content': [[brief(r) for r in group] for group in by_name.values() if len({r['sha256_lf'] for r in group}) > 1],
    'usage_source': str(usage_path), 'usage': usage,
    'counts': {'manifest_entries_including_aliases': len(rows), 'unique_physical_manifests': len(physical),
               'unique_names': len(by_name), 'unique_contents_lf': len(by_hash),
               'legacy_markdown': len(legacy), 'read_errors': len(errors)},
}
json_path = BASE / 'inventario-skills-20261025.json'
csv_path = BASE / 'inventario-skills-20261025.csv'
# Files are generated evidence; refuse replacing an earlier audit snapshot.
for out in (json_path, csv_path):
    if out.exists():
        raise FileExistsError(f'Refusing to replace existing audit: {out}')
json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
with csv_path.open('w', newline='', encoding='utf-8-sig') as stream:
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]) if rows else ['name'])
    writer.writeheader()
    writer.writerows(rows)
print(json.dumps({'counts': data['counts'], 'roots': root_info,
                  'top_recorded_loads': sorted([{'name': name, 'views': item.get('view_count', 0),
                   'uses': item.get('use_count', 0), 'last_used_at': item.get('last_used_at')} for name, item in usage.items()],
                    key=lambda item: item['views'], reverse=True)[:12],
                  'json': str(json_path), 'csv': str(csv_path)}, ensure_ascii=False, indent=2))
