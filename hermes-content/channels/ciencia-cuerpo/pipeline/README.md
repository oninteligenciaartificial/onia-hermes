# Pipeline v1 — La Ciencia de tu Cuerpo

Flujo por episodio (resumen en `../PLAN.md` §8):

```
tema (topics-backlog.json)
  -> research-brief.json      (research-brief.template.json)
  -> script.md                (script.template.md, marcadores [n])
  -> shot-list.json           (shot-list.template.json — Higgsfield + pan/zoom ffmpeg)
  -> assets/                  (SOLO tras aprobacion de gasto — ver approval-matrix.json)
  -> ensamblado (ffmpeg concat + narracion) -> final.mp4
  -> metadata.json            (metadata.template.json — fuentes resueltas + disclaimer)
  -> scripts/upload-youtube.mjs --dry-run   (siempre primero)
  -> gate Sergio -> scripts/upload-youtube.mjs (subida real, privacy=private)
  -> gate Sergio -> publicar (fuera de este pipeline; manual en YouTube Studio)
```

## Carpetas por episodio

Cada tema aprobado vive en `../pilot/<NNN-slug>/` (piloto) o
`../episodes/<NNN-slug>/` (producción regular, carpeta a crear cuando exista)
con:

```
<NNN-slug>/
├── research-brief.json
├── script.md
├── shot-list.json
├── metadata.json
├── STATUS.md      # que esta hecho, que falta, que espera aprobacion
└── assets/        # generado SOLO tras aprobacion de gasto
```

## Validar un episodio

```bash
cd hermes-content/channels/ciencia-cuerpo
npm install   # una vez
npm test      # valida los schemas en si (zod)
node pipeline/validate.mjs pilot/001-azucar-y-el-cerebro
```

`validate.mjs` valida `research-brief.json`, `shot-list.json` y `metadata.json`
contra `pipeline/schemas.mjs`. Las reglas duras del canal están codificadas
como tipos, no solo como texto: `metadata.made_for_kids` solo acepta `false`,
`metadata.privacy_status_initial` solo acepta `"private"`,
`metadata.contains_synthetic_media` solo acepta `true`,
`research_brief.disclaimer_required` solo acepta `true`, y cada fuente citada
(`key_claims[].source_url`) debe ser una URL real. Si alguien intenta poner
`made_for_kids: true` o `privacy_status_initial: "public"` a mano, la
validación falla — hay que forzar el cambio a propósito y queda visible en el
diff.

No valida el guion en sí (es texto libre en Markdown), pero el template trae
la estructura y el recordatorio de disclaimer.

## Reglas duras (detalle en `../PLAN.md` §4 y `approval-matrix.json`)

- Ninguna llamada real a Higgsfield (imagen/video/voz) sin aprobación de gasto
  explícita de Sergio.
- Ninguna subida a YouTube sin pasar primero por `--dry-run`.
- Ninguna publicación pública sin aprobación explícita de Sergio.
- `video-factory/` (raíz del repo) es el motor de video compartido — se REUSA
  como referencia de patrón (su adapter de Higgsfield con estimación de costo
  en `video-factory/engine/higgsfield/adapter.mjs` inspiró el campo
  `estimated_credits` de este pipeline) pero **no se edita**: no tiene un lane
  que modele "canal educativo de formato largo", así que este pipeline define
  su propio `shot-list.json` en vez de forzarlo al esquema de
  `lanes`/`formats` de `video-factory`.
