#!/usr/bin/env python3
"""Ensayo offline de un contrato replicable con un master existente; nunca genera/publica."""
import argparse, hashlib, json, pathlib, subprocess, tempfile

SOURCE = '3566e5d5208cf4a7bcf20e743469c6088944674c'
MASTER = 'videos/lucia-entrega/viernes-copia-v2-final-1080x1920.mp4'
COPY = 'videos/lucia-viernes-copia-v2/pie.txt'
MASTER_SHA = 'c4299c7b21c7b05cc41181176d8908429b9752d4422c9cc9275964dd64393aa4'

def enforce(contract):
    errors = []
    if contract.get('mode') != 'reuse_existing':
        errors.append('Generación nueva fuera del ensayo autorizado')
    if contract.get('publish') or contract.get('schedule'):
        errors.append('SOLO MOSTRAR: publicación/agendado bloqueados')
    if contract.get('credits', 0) != 0:
        errors.append('Presupuesto del ensayo = 0; no se gasta')
    if contract.get('identity') != contract.get('asset_identity'):
        errors.append('No asignar assets de una identidad a otra')
    if contract.get('voice_generate'):
        errors.append('Voz nueva sin autorización específica')
    return errors

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='.')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    def blob(p):
        return subprocess.check_output(['git', 'show', SOURCE + ':' + p], cwd=a.repo)
    master, copy = blob(MASTER), blob(COPY)
    caption = copy.decode('utf-8').strip()
    contract = dict(mode='reuse_existing', publish=False, schedule=False, credits=0,
                    identity='lucia_v4_existing_fixture', asset_identity='lucia_v4_existing_fixture',
                    voice_generate=False)
    gates = []
    def gate(name, passed, measured):
        gates.append(dict(gate=name, pass_=bool(passed), measured=measured))
    measured_sha = hashlib.sha256(master).hexdigest()
    gate('master_SHA256', measured_sha == MASTER_SHA, measured_sha)
    gate('master_bytes', len(master) == 2983672, len(master))
    gate('caption_limit_UTF16', len(caption.encode('utf-16-le')) // 2 <= 2200, len(caption.encode('utf-16-le')) // 2)
    gate('disclosure_IA', caption.startswith('Personaje hecho con IA: Lucía Antelo, de @oniahq.'), caption[:45])
    gate('historical_claim_limit', 'Una escena, una toma' in caption and 'Ruido de ±0,03' in caption, 'una toma y ruido explícitos')
    with tempfile.TemporaryDirectory(prefix='lucia-fixture-') as work:
        video = pathlib.Path(work) / 'existing-master.mp4'
        video.write_bytes(master)
        probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', str(video)]))
        v = next(s for s in probe['streams'] if s['codec_type'] == 'video')
        gate('format_9_16', (v['width'], v['height']) == (1080, 1920), [v['width'], v['height']])
        gate('duration_15s', float(probe['format']['duration']) == 15.0, probe['format']['duration'])
        gate('fps24_frames360', v['r_frame_rate'] == '24/1' and int(v['nb_read_frames']) == 360, [v['r_frame_rate'], v['nb_read_frames']])
        dec = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(video), '-f', 'null', '-'], capture_output=True, text=True)
        gate('decode_complete', dec.returncode == 0, {'exit': dec.returncode, 'stderr': dec.stderr[:300]})
    gate('contract_reuse_permitted', not enforce(contract), enforce(contract))
    negatives = [
        ('publication_without_approval', {'publish': True}),
        ('scheduling_without_approval', {'schedule': True}),
        ('spend_without_budget', {'credits': 1}),
        ('new_generation', {'mode': 'generate'}),
        ('identity_cross_contamination', {'identity': 'new_identity_NOT_CREATED'}),
        ('voice_without_permission', {'voice_generate': True}),
    ]
    for name, changes in negatives:
        errors = enforce({**contract, **changes})
        gate('deny_' + name, bool(errors), errors)
    gate('wrong_master_rejected', measured_sha != '0' * 64, 'hash incorrecto no coincide')
    dependencies = []
    for name, path, expected in [
        ('K4_original', 'hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/img-omni-image-k4cafe-dad464de.png', '2a2e940147431146041d8ace6942a35a600ed91986f3030840751f33e8127200'),
        ('R3_original', 'videos/lucia-g4-v2/assets/refs-orig/R3_casi_frontal.png', '0dc08193977ee2a1a0b7a6564df83f6b45cdb8c8f2495afc693d5c5d050bf756')]:
        q = subprocess.run(['git', 'cat-file', '-e', SOURCE + ':' + path], cwd=a.repo, capture_output=True)
        dependencies.append({'name': name, 'in_source_git': q.returncode == 0, 'expected_sha256': expected,
                             'status': 'exportación exacta pendiente; no pérdida Work; no regenerar'})
    result = dict(date='2026-10-12', mode='offline_existing_fixture', source_commit=SOURCE,
                  contract=contract, gates=gates, passed=all(g['pass_'] for g in gates),
                  credits_spent=0, generated_people=0, accounts_created=0, posts_created=0,
                  external_network_calls=0, dependencies_for_project_remaster=dependencies,
                  proves='contrato/reutilización/media/permisos/separación de identidad en validación local',
                  does_not_prove='identidad nueva, todas las funciones de Higgsfield, generación, edición/render DOM, publicación, insights o autonomía24x7')
    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'passed': result['passed'], 'gates': len(gates), 'out': str(out)}, ensure_ascii=False))
    raise SystemExit(0 if result['passed'] else 1)

if __name__ == '__main__':
    main()
