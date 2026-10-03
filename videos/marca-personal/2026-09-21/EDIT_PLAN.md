# Plan de edición reproducible · 01-feed-3-nodos

Estado: **composición preparada; pendiente QA visual y render final**.

## Entradas

- `raw/01-feed-3-nodos-camera.mp4` — bruto HEVC original, 1080×1920, 30 fps, 48.73 s.
- `analysis/IMG_4866.transcript.raw.json` — transcripción local con timestamps de palabra.
- `analysis/transcript.edited.json` — texto corregido y agrupado para subtítulos.
- `analysis/edit-plan.json` — segmentos conservados y mapeo de tiempos.

El bruto de `raw/` no se sobrescribe.

## Corte base

- Se eliminan 4.79 s de redundancias y pausas, no pasos del tutorial.
- Se acelera a 1.10× para llegar a 40.0 s sin voz artificial.
- `work/base-cut.mp4`: H.264, 1080×1920, 30 fps, AAC 48 kHz.
- El encuadre conserva el 9:16 original; no hay franjas laterales ni relleno desenfocado.

## Composición

- `index.html` integra el plano de Sergio con cuatro mockups editoriales.
- El PiP mantiene la relación 9:16 de la cámara.
- Transiciones: wipe corto, stagger y cambio de escala del video; sin efectos decorativos permanentes.
- Las dos ramas del IF permanecen visibles en una pantalla dedicada.
- Subtítulos `anchor` en rail frontal con máximo dos líneas.

## Audio y master

1. HyperFrames renderiza la pista visual a `work/visual.mp4`.
2. `scripts/render-guard.mjs` mide loudness del corte base.
3. Segunda pasada `loudnorm`: −14 LUFS, −1.5 dBTP.
4. Mux final H.264 + AAC 48 kHz + `faststart`.
5. Salida: `renders/01-feed-3-nodos-v1.mp4`.

## QA obligatorio

- `npm run check` sin errores.
- Snapshots en gancho, cada pantalla y CTA.
- `ffmpeg -v error -i <render> -f null NUL`.
- `ffprobe`: 1080×1920, 30 fps, H.264/AAC 48 kHz, duración ≤40.1 s.
- Contact sheet del render final revisada visualmente.
