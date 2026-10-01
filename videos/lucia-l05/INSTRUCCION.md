# L05 · Lunes: cero llamadas para agendar — instrucción completa (método Santiago)

Una instrucción por video, ejecutada ENTERA (skill `editor-videos`). Guion: `hermes-content/docs/cola/lucia-diario/S1-GUIONES.md`
§ L05. R = `/home/user/onia-hermes` · ES = `R/.claude/skills/editor-videos/scripts/` · P = `R/videos/lucia-l05/`.

## OBJETIVO
Reel 9:16 de ~6 s, **sin voz** (el texto ES la narración), que vende el link de reserva de Onia: dolor (llamadas para
agendar) → respuesta en una palabra («cero.») → mecanismo («El cliente elige el horario y aparece en tu agenda.»).
Tabla de cortes + preview 360p para el OK de Sergio Urcullo. **Costo 0**.

## MATERIAL
- Clip limpio: `P/raw/l05-coworking-kling-07b938b2.mp4` — Kling 3.0, 720×1280, **24 fps**, 6,04 s, sin audio. Tipea en la
  laptop, levanta la vista y sonríe al final.
- Plantillas: `ES/../assets/html/frase-card.html` (tarjeta dark con cejilla y remate en acento), `keyword-marca.html`,
  `tag-ia.html`. SFX: librería de HyperFrames (`node ES/sfx.mjs --list-lib`).
- **Captura REAL del link de reserva: PENDIENTE** (la pide la madre). No se dibuja ninguna pantalla falsa.

## ESTILO (Lucía)
- Lienzo **1080×1920 a 24 fps**. Acento **#10C26B**. Texto en primera persona del producto, sin «muy pronto» ni obra.
- **Texto NUNCA sobre la cara.** Medido con SCRFD en todo el clip (coords 1080×1920): mentón máx 674 → franja libre
  **y=714 a y=1490** (debajo de 1490 tapa la UI de Instagram). Nada en los 80 px de la derecha por debajo de y=1000.
- Sin voz: el lector necesita ~0,25 s por palabra. Sin música de cama (la pone Sergio Urcullo).

## LAYOUT y STORYBOARD (sin voz → tiempos fijos `at`, calculados por lectura)
| t (s) | Qué | Dónde |
|---|---|---|
| 0,15 → 2,30 | `tag-ia` «Lucía · personaje creado con IA» (ancho 520) | centrado, y=730 |
| 0,15 → 2,30 | `frase-card` cejilla «LUNES», «¿Cuántas llamadas para agendar a alguien?» (ancho 900) | centrado, y=850 |
| 2,30 → 3,90 | `frase-card` «Con un link de reserva:» + remate en acento «cero.» | centrado, y=850 |
| 2,45 → 3,90 | keyword «CERO.» (ancho 600) — refuerzo del remate | centrado, y=1190 |
| 3,90 → fin | `frase-card` «El cliente elige el horario y aparece en tu agenda.» | centrado, y=850 |

Fades de 0,22 s. Entre tarjetas, la nueva entra cuando sale la anterior (sin hueco vacío).

## SFX (`P/scripts/sfx-plan.json`, sin voz → `duck:false`)
pop −10 @0,15 · pop −10 @2,30 · impact? NO (exagera) · pop −12 @2,45 (keyword) · pop −10 @3,90.

## ORDEN (1 generación de video)
1. Assets con `make-mockup.mjs --template custom … --accent "#10C26B" --width 1000 --out P/assets/<x>.png`.
2. **gen1 en UNA pasada** `P/scripts/build.mjs` (calcado de `R/videos/tiktok-20260917/scripts/tiktok-build.mjs`, rutas
   relativas a P): `scale=1080:1920:flags=lanczos` + overlays con fade + pista de audio en silencio (para que `sfx.mjs`
   tenga dónde mezclar) → `P/renders/gen1.mp4` (libx264 CRF 14 slow, yuv420p, 24 fps, aac 48 kHz).
3. **SFX:** `node ES/sfx.mjs --video P/renders/gen1.mp4 --plan P/scripts/sfx-plan.json --out P/renders/sfx.mp4`.
4. **Sin master a −14:** sin voz, `loudnorm` subiría los pops a nivel de voz. Dejar los SFX a la ganancia del plan y
   reportar el pico (≤ −3 dBTP). Final: `P/final/l05.mp4`.
5. Copiar a `R/hermes-content/references/modelos/lucia/v4/feed/l05-lunes-link-de-reserva.mp4` (pisa la versión PIL) y
   preview `P/renders/preview-360.mp4` (360×640, CRF 28).

## QA (MIRADO)
- `P/renders/qa-frames.jpg`: entrada, mitad y salida de cada tarjeta + 0,1 s y último cuadro, con guías en y=714 y y=1490.
- Ortografía de cada texto leída en los cuadros (¿Cuántas, tilde y signos de apertura).
- Identidad: 5 cuadros con `R/scripts/face_identity_qa.py` contra las refs de
  `/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs/` → cada uno ≥ 0,70.
- Specs: 1080×1920, 24 fps, h264 yuv420p, aac, `+faststart`.

## SALIDA
`P/README.md` con tabla de cortes (`# | Me quedo con | Tiro | Por qué`), storyboard con tiempos, comandos para regenerar, QA
y lo pendiente (captura real + decisión de voz). **Sin comandos git.**
