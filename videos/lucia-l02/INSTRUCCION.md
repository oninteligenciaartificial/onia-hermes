# L02 · Este video no fue grabado — instrucción completa (método Santiago)

Una instrucción por video, ejecutada ENTERA. **Receta: `.claude/skills/editor-videos/SKILL.md` § «Reels de Lucía»** (leerla primero). Guion: `hermes-content/docs/historial/cola/lucia-diario/S1-GUIONES.md`
§ L02. R = `/home/user/onia-hermes` · ES = `R/.claude/skills/editor-videos/scripts/` · P = `R/videos/lucia-l02/`.

## OBJETIVO
Reel 9:16 de ~6 s, **sin voz**, de presentación del personaje: revelación («Este video no fue grabado.») → contraste
(«No existo. Soy IA.») → acción («SEGUIME.»). En PRIMERA persona (lo publica la cuenta de Lucía; L01 ya habla así). La promesa
«lo que te muestro sí funciona» va al pie: en pantalla no entraba a velocidad de lectura. Tabla de cortes + preview 360p para
el OK de Sergio Urcullo. **Costo 0**.

## MATERIAL
- Clip limpio: `P/raw/l02-calle-kling-1d2b5631.mp4` — Kling 3.0, 720×1280, **24 fps**, 6,04 s, sin audio. Camina por una
  calle a la hora dorada, mira a cámara y sonríe.
- Plantillas: `ES/../assets/html/frase-card.html`, `keyword-marca.html`. SFX: librería de HyperFrames.

## ESTILO (Lucía)
- Lienzo **1080×1920 a 24 fps**. Acento **#10C26B**.
- **Texto NUNCA sobre la cara.** Medido con SCRFD (coords 1080×1920): mentón máx 899 → franja libre **y=939 a y=1490**.
  La versión PIL ponía el texto ARRIBA y «Es IA.» tapaba la frente: no se repite.
- Sin voz: ≥ 0,35 s por palabra + 0,3 s de entrada. Sin música de cama (la pone Sergio Urcullo).
- No hace falta `tag-ia`: la pieza ENTERA es la declaración («No existo. Soy IA.»).

## LAYOUT y STORYBOARD (sin voz: ≤ 6 palabras por tarjeta, ≥ 0,35 s por palabra + 0,3 s de entrada)
| t (s) | Qué | Dónde |
|---|---|---|
| 0,10 → 2,15 | `frase-card` «Este video no fue grabado.» (ancho 900) | centrado, y=960 |
| 2,15 → 3,95 | `frase-card` «No existo.» + remate en acento «Soy IA.» | centrado, y=960 |
| 3,95 → fin | sello «SEGUIME.» (`keyword-marca`, ancho 640, rotado −5°) + golpe de zoom +3 % 5 cuadros a 3,95 | centrado, y=1170 |

## SFX (`duck:false`, pico ≤ −3 dBTP)
pop @0,10 · pop @2,15 · pop @3,95 (sello, −8).

## ORDEN (1 generación de video)
1. Assets (`make-mockup.mjs --template custom … --accent "#10C26B" --width 1000`).
2. **gen1 en UNA pasada** `P/scripts/build.mjs` (calcado de `R/videos/tiktok-20260917/scripts/tiktok-build.mjs`):
   `scale=iw*2:ih*2` + `zoompan` (golpe del sello) a 1080×1920 + overlays con fade 0,22 s + pista de audio en silencio → `P/renders/gen1.mp4` (CRF 14 slow).
3. SFX con `ES/sfx.mjs`. 4. Sin master a −14 (sin voz): pico ≤ −3 dBTP. Final `P/final/l02.mp4`.
5. Copiar a `R/hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4` y preview 360p.

## QA (MIRADO)
§12 de la receta: stills de cada entrada · hoja de cuadros con guías en y=939 y y=1490 · YuNet/SCRFD sobre crudo y final ·
ortografía leída en cuadros («IA.», «SEGUIME.») · identidad ≥ 0,70 en 5 cuadros (refs:
`/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs/`) · pico ≤ −3 dBTP · specs.

## SALIDA
`P/README.md` (tabla de cortes, storyboard, comandos, QA, pendiente). **Sin comandos git.**
