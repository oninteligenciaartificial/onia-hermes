# Cómo editan Santiago Muñoz y Erik Taveras — medido el 1-oct-2026

> Pedido de Sergio Urcullo (1-oct): *«quiero que mires si editás como vimos que lo hace Santiago Muñoz o Erik
> Taveras; podés mirar sus últimos videos y aprender de ellos»*. Foto de un día: la regla que sale de acá vive en
> `.claude/skills/editor-videos/SKILL.md` § «Reels de Lucía». Evidencia completa (por video, con tiempos):
> [`2026-10-01-santiago-erik-edicion-medida.json`](2026-10-01-santiago-erik-edicion-medida.json).

## Qué se miró y cómo
- **Santiago (@sanmunoz.ia):** sus 4 últimos videos por TikTok (Instagram da 429 sin sesión): Sonnet 5.5 (28-sep,
  82,7 s), Opus 5.5/Clawd (23-sep, 68,3 s, 100 % animación), «¿Qué es Jev?» (22-sep, 103 s), animaciones con IA (19-sep,
  66,1 s). Por video: cuadros a 2 por segundo mirados, cortes por ffmpeg + flujo óptico, caras con YuNet, transcript
  con faster-whisper, audio por niveles y espectrograma.
- **Erik (@eriktaveras en IG, `@erik.py` en TikTok, @ErikTaverasT en YouTube):** 6 TikToks del 27-sep al 1-oct, más
  sus guías del 4-ago y del 19-sep que ya estaban en el repo.
- Un crítico verificó cada afirmación contra las hojas de cuadros y corrigió 17 generalizaciones (abajo, las que
  importan).

**Cómo se bajan desde la nube** (sirve para la próxima vez): `yt-dlp --impersonate chrome` con
`pip install "yt-dlp[default,curl-cffi]"`. TikTok lista y baja; Instagram da 429 sin sesión; YouTube pide
verificación de bot. Sin `--impersonate`, TikTok también falla.

## Lo que hacen (medido)
| Regla | Medida |
|---|---|
| Arranque en caliente | Santiago: primer subtítulo a 0,13 s, prueba en pantalla entre 0,10 y 0,37 s. Erik: voz entre 0,01 y 0,18 s |
| La prueba entra cuando se la nombra | Sonnet: captura de la página oficial, titulares y tabla con «Fuente: Anthropic». Jev: crédito bajo cada captura. (Clawd y Animaciones, sin fuente) |
| Pantalla partida | Santiago: panel 0–46 % / cámara abajo / subtítulo en la costura (49–51 %). Erik: subtítulo en la costura (~44 %) |
| La persona se mueve, no se tapa | Animaciones: la cámara baja 600 px, se corre ~30 % o pasa a PiP del 34 %. Jev: baja ~17 % del alto en 3–4 cuadros |
| Ritmo con persona y voz | 0,57–1,12 elementos nuevos por segundo; Santiago tolera 2,7–4,6 s sin elemento nuevo mientras corre el subtítulo |
| Subtítulos | 1–3 palabras, una palabra activa (Sonnet `#F9CA36`, ~0,2 s); Jev usa píldora de 2–6 palabras sin palabra activa |
| Zoom | Golpe de +2,5–3 % que vuelve en 0,13–0,27 s, en el cuadro exacto del número o sello. Sin Ken Burns sobre la cámara |
| Sellos | De 120–130 % a 100 % en 3–4 cuadros, rotados ~5° |
| Audio | Con voz: **sin música** (Sonnet, Jev, Animaciones) y 0–4 SFX con causa visible. Sin voz (Clawd): música continua a −13,8 LUFS |
| Tarjetas | Erik: «ninguna tarjeta repite lo que se oye» (regla escrita, la incumple a veces) y apaga el subtítulo con las tarjetas de datos |
| CTA | Una sola acción, en pantalla y sostenida (Clawd pide dos) |

## Correcciones del crítico (para no repetir afirmaciones falsas)
- «Nunca más de 3,1 s sin la persona» es falso: Jev llega a 10 y 16 s solo con panel.
- El zoom lento continuo es de Clawd (animación), no de sus videos con persona.
- El adelanto a la palabra varía de −0,5 a +0,3 s; solo Jev adelanta siempre 0,1–0,25 s.
- El intake del 17-sep (Gemini) y la cabecera de `split-layout.mjs` hablan de música de cama, whoosh en cada cambio y
  corte cada ~2 s: lo medido a fines de septiembre dice lo contrario en las piezas con voz.
- Erik pudo haber cambiado: sus 3 últimos reels rondan −20 LUFS y Dots usa otro subtítulo.

## Lo que NO se copia
Cabeza hablante y jump cuts (Lucía no habla a cámara) · el split con la persona ABAJO (en los clips de Lucía la cara
está arriba: se invierte) · paletas y firmas de autor · interfaces simuladas (editor falso, tarjeta de perfil con
cursor) · prueba social y autobombo · texto detrás de la cabeza (exige rotoscopiar 720p) · «comentá PALABRA» (la
cuenta de Lucía no tiene quién responda) · música y export a 30 fps (la fuente es 24).

## Preguntas que quedaron para Sergio Urcullo
1. L08 y L05 venden con prueba: ¿esperan la captura REAL (hoy no hay cuenta demo en producción) o salen antes?
2. L02 y L05 sin voz no entran en 6 s a velocidad de lectura: ¿voz de Marcela también o texto recortado a ≤6 palabras?
