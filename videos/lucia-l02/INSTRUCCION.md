# L02 · Este video no fue grabado — instrucción completa (método Santiago)

Una instrucción por video, ejecutada ENTERA (skill `editor-videos`). Guion: `hermes-content/docs/cola/lucia-diario/S1-GUIONES.md`
§ L02. R = `/home/user/onia-hermes` · ES = `R/.claude/skills/editor-videos/scripts/` · P = `R/videos/lucia-l02/`.

## OBJETIVO
Reel 9:16 de ~6 s, **sin voz**, de presentación del personaje: revelación («Este video no fue grabado.») → contraste
(«No existo. Soy IA.») → promesa («Y aun así te voy a mostrar cosas que sí funcionan.») → «SEGUIME.». En PRIMERA persona
(lo publica la cuenta de Lucía; L01 ya habla así). Tabla de cortes + preview 360p para el OK de Sergio Urcullo. **Costo 0**.

## MATERIAL
- Clip limpio: `P/raw/l02-calle-kling-1d2b5631.mp4` — Kling 3.0, 720×1280, **24 fps**, 6,04 s, sin audio. Camina por una
  calle a la hora dorada, mira a cámara y sonríe.
- Plantillas: `ES/../assets/html/frase-card.html`, `keyword-marca.html`. SFX: librería de HyperFrames.

## ESTILO (Lucía)
- Lienzo **1080×1920 a 24 fps**. Acento **#10C26B**.
- **Texto NUNCA sobre la cara.** Medido con SCRFD (coords 1080×1920): mentón máx 899 → franja libre **y=939 a y=1490**.
  La versión PIL ponía el texto ARRIBA y «Es IA.» tapaba la frente: no se repite.
- Sin voz: ~0,25 s por palabra de lectura. Sin música de cama.
- No hace falta `tag-ia`: la pieza ENTERA es la declaración («No existo. Soy IA.»).

## LAYOUT y STORYBOARD (tiempos fijos `at`)
| t (s) | Qué | Dónde |
|---|---|---|
| 0,10 → 1,70 | `frase-card` «Este video no fue grabado.» (ancho 900) | centrado, y=960 |
| 1,70 → 3,30 | `frase-card` «No existo.» + remate en acento «Soy IA.» | centrado, y=960 |
| 3,30 → 5,20 | `frase-card` «Y aun así te voy a mostrar cosas que sí funcionan.» | centrado, y=960 |
| 5,20 → fin | keyword «SEGUIME.» (ancho 700) | centrado, y=1180 |

## SFX (`duck:false`)
pop −10 @0,10 · pop −10 @1,70 · pop −10 @3,30 · pop −8 @5,20.

## ORDEN (1 generación de video)
1. Assets (`make-mockup.mjs --template custom … --accent "#10C26B" --width 1000`).
2. **gen1 en UNA pasada** `P/scripts/build.mjs` (calcado de `R/videos/tiktok-20260917/scripts/tiktok-build.mjs`):
   scale lanczos a 1080×1920 + overlays con fade 0,22 s + pista de audio en silencio → `P/renders/gen1.mp4` (CRF 14 slow).
3. SFX con `ES/sfx.mjs`. 4. Sin master a −14 (sin voz): pico ≤ −3 dBTP. Final `P/final/l02.mp4`.
5. Copiar a `R/hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4` y preview 360p.

## QA (MIRADO)
Hoja de cuadros con guías en y=939 y y=1490 · ortografía («aun así» sin tilde en «aun» = «incluso así»; «sí funcionan»
con tilde) · identidad 5 cuadros ≥ 0,70 (refs en el scratchpad de L08) · specs.

## SALIDA
`P/README.md` (tabla de cortes, storyboard, comandos, QA, pendiente). **Sin comandos git.**
