"""Reensambla bytes conservados; verifica cada parte y hash completo antes de abrir.
Uso: python reensamblar-marca-partes.py DELTA.json CARPETA_PARTES CARPETA_SALIDA
No sobrescribe archivos existentes ni abre medios. Sólo biblioteca estándar.
"""
import hashlib
import json
import pathlib
import sys

def measure(path):
    h = hashlib.sha256()
    n = 0
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1048576), b''):
            h.update(chunk)
            n += len(chunk)
    return n, h.hexdigest()

def main():
    if len(sys.argv) != 4:
        raise SystemExit('Uso: python reensamblar-marca-partes.py DELTA.json PARTES SALIDA')
    data = json.loads(pathlib.Path(sys.argv[1]).read_text())
    parts_dir, out_dir = map(pathlib.Path, sys.argv[2:])
    for group in data['groups']:
        relative = pathlib.Path(group['relative'])
        if relative.is_absolute() or '..' in relative.parts:
            raise SystemExit('Ruta de salida inválida')
        parts = sorted(group['parts'], key=lambda p: p['order'])
        if [p['order'] for p in parts] != list(range(1, len(parts) + 1)):
            raise SystemExit('Orden de partes inválido')
        for p in parts:
            if pathlib.Path(p['name']).name != p['name']:
                raise SystemExit('Nombre de parte inválido')
            if measure(parts_dir / p['name']) != (p['bytes'], p['sha256']):
                raise SystemExit('Parte inválida: ' + p['name'])
        target = out_dir / relative
        temporary = target.with_name(target.name + '.sin-verificar')
        if target.exists() or temporary.exists():
            raise SystemExit('Salida existente; no se sobrescribe: ' + str(target))
        target.parent.mkdir(parents=True, exist_ok=True)
        h = hashlib.sha256()
        n = 0
        with temporary.open('xb') as output:
            for p in parts:
                with (parts_dir / p['name']).open('rb') as source:
                    for chunk in iter(lambda: source.read(1048576), b''):
                        output.write(chunk)
                        h.update(chunk)
                        n += len(chunk)
        if (n, h.hexdigest()) != (group['original_bytes'], group['original_sha256']):
            raise SystemExit('Hash completo no coincide; conservar .sin-verificar sin abrir')
        temporary.rename(target)
        print(json.dumps({'file': str(target), 'bytes': n, 'sha256': h.hexdigest(), 'verified': True}))

if __name__ == '__main__':
    main()
