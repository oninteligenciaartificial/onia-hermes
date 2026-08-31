# Reel de lanzamiento de Lucía — tabla de cortes (para OK de Sergio)

> 19.7 s · 1080×1920 · voz Marcela (defaults del casting) en off · SIN lipsync (la cara
> nunca habla en cámara — el formato que pediste). Gaps de 0.25 s entre beats.

| # | t | Me quedo con | Tiro | Por qué |
|---|---|---|---|---|
| B1 | 0.00–2.76 | kling-natural rooftop: ella gira a cámara, media sonrisa | los 2.2 s finales del clip | el gancho "No soy real" sobre SU cara mirándote — el clip que elegiste como mejor motor |
| B2a | 2.76–5.45 | estudiando en el café (2.7 s) | resto del clip de 6 s | "Soy Lucía, personaje digital" sobre su vida normal — el contraste ES el mensaje |
| B2b | 5.45–8.16 | gimnasio, curl con mancuerna (2.7 s) | resto | segundo plano de "su banco": rutina real, cero pose de IA |
| B3 | 8.16–14.59 | trabajando en la laptop (6 s, retime 1.072× imperceptible) | nada | "mostrarte cómo la IA le sirve a un negocio" sobre ella trabajando — literal |
| B4 | 16.40–22.07 | **rooftop veo-8s, mira a cámara (5.7 s)** | el resto del clip | "Seguime" con la cara del ancla y la sonrisa que construye hasta el final |

## ⚠️ v7 (2026-08-23) — se cambió el último clip

> Sergio: *"el último clip de L1 pierde mucha consistencia, mejoralo"*. Tenía razón.

**Diagnóstico, mirando frames:** el clip de playa **perdió las pecas** — el marcador de
identidad del ancla, el mismo por el que se descartó el Soul v3. Se notaba el doble porque
el plano anterior (gimnasio) **sí** las tiene y están pegados. Encima cerraba en plano
entero: cara chica **y** derivada.

**Reemplazo:** `VIDEO-rooftop-veo-8s` (trim 2.30–8.00). Mira a cámara, pecas intactas,
misma remera y misma hora dorada, y el arco del clip construye hacia la sonrisa más
abierta — justo lo que pide "¡Seguime!". Cierra donde abrió: bookend deliberado.
**Costo: 0 créditos**, el clip ya estaba generado.

**El audio NO se tocó:** se remuxeó el del render aprobado. Verificado: −14,3 LUFS,
pico real −1,6 dBTP, idéntico al master.

🔴 **Trampa cazada al hacerlo:** quemar el `.ass` con `ffmpeg -vf subtitles=` **sin
`fontsdir`** hace que libass sustituya la fuente de marca por otra más ancha — el
subtítulo salía con otra tipografía y partido en dos líneas. El script `karaoke-captions.mjs`
copia la fuente a `renders/_fonts/` y se la pasa; una llamada cruda de ffmpeg NO.
Se descubrió comparando los recuadros del subtítulo, no leyendo el código.

Reconstrucción: `scripts/build-v7.sh` → karaoke (`reel-v6.ass` + `fontsdir=_fonts`) →
`overlay-visuals` con `overlay-plan.json` → remux del audio original.
Entrega: `final/lucia-lanzamiento-v7.mp4` · preview `renders/preview-v7-360.mp4`

**Voz por beat:** B1 "No soy real. Mirá bien: no existo." · B2 "Soy Lucía. Un personaje
digital, creado en Bolivia por el equipo de Onia." · B3 "Estoy acá para mostrarte, sin humo,
cómo la inteligencia artificial le sirve a un negocio de verdad." · B4 "No escondo lo que
soy. Vos tampoco deberías perderte lo que viene. Seguime."

**Cumple:** IA declarada en la primera frase (doble declaración con la etiqueta de cuenta) ·
deriva a Onia UNA vez (B2) · no testifica como usuaria · subtítulos karaoke con texto
AUTORADO (gate de ortografía: Whisper solo pone tiempos, las letras las pone el guion).

**Pendiente tras tu OK:** master de audio (−14 LUFS) → render final 1080p → cola de
publicación con caption + etiqueta IA.
