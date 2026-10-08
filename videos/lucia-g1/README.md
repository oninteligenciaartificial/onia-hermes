# Lucía · G1 «Este video no fue grabado: así se hace, en 3 pasos» (56 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G1-de-una-foto-a-un-video.md`.
**Costo: 0 créditos** (clips K1 `e470ef4f`, K2 `83130c4a`, K4 `338b751f` y fotos `4afffb96`, `3e05cfd0`, ya pagados).
**Estado: PARA VER POR LA MADRE (preview 360p). No se publica nada.** Sin voz ni música: pista AAC en silencio.

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, zonas y medición de caras | `plan.json` |
| Generador (valida reglas de texto → escribe `index.html`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Preview 360p (también en `qa/`, que sí va a git) | `out/g1-preview-360p.mp4` |
| Final 1080x1920 (ignorado en git) | `out/g1-final-1080x1920.mp4` |
| QA mirado: hoja con guías, zona segura, grep, cara, specs | `qa/` |

## Tabla de cortes (la del guion; lo que se agregó está marcado)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0 – 6 | K1 cuadros 0-143, pantalla completa | rótulo «Lucía Antelo · personaje IA de Onia» 0-2,4 · «Este video no fue grabado.» · «Así se hace, en 3 pasos.» |
| 6 – 16 | Foto K1 fija | ① «Una foto fija.» · «Primero la cara, siempre igual.» · etiqueta «Imagen · 1 crédito» · marco de esquinas sobre la cara (10,4 s) |
| 16 – 31 | Foto K1 de fondo + panel «Orden real» | ② «Una orden corta.» · panel con las 31 palabras literales y tres marcas: movimiento (21,4 s), cámara (25,2), luz (28,0) |
| 31 – 35 | Partida: foto K1 arriba (morph desde pantalla completa), clip K1 cuadros 0-95 abajo | ③ «Y la foto se mueve.» · «Video 6 s · 7,5 créditos» · *(agregado)* «Imagen · 1 crédito» arriba |
| 35 – 41 | *(el guion no decía qué imagen)* visor + tira de los 8 cuadros de la hoja de manos de K4 (0, 60, 72, 84, 96, 104, 112, 120), recortes a resolución completa | «Después, se mira cuadro por cuadro.» · «5 dedos» / «tapada» según `PROCEDENCIA.jsonl` línea 94 |
| 41 – 45 | K4 cuadros 0-95 | «Cuadro 60: cinco dedos.» · barra de cuadros · en t=43,5 s (= cuadro 60, verificado con PSNR) cae el recorte de la mano + sello «5 dedos» + golpe de zoom +3 % |
| 45 – 50 | Foto K2 | «Foto y clip: 8,5 créditos.» · *(agregado)* «1 + 7,5 = 8,5» |
| 50 – 56 | K2 cuadros 0-143 | «Foto, orden y revisión.» · «Seguime: cada semana, una prueba.» (se queda hasta el último cuadro) |

## Decisiones que la madre puede revertir (cada una en `plan.json`)
1. **K4 tiene la cara abajo** (mentón máx 1405 px): no hay franja hasta y=1490, así que ahí el texto va ARRIBA, en el cielo (y 290-885), no bajo el mentón.
2. «1 · Una foto fija.» se dibuja como insignia numerada + texto, sin el «·» (así la tarjeta cuenta ≤ 6 palabras con criterio estricto).
3. El panel «Orden real» (cita literal de 31 palabras, 11,5 s) es la excepción documentada del guion.
4. Agregados no escritos en el guion: la placa de 35-41 s, la etiqueta «Imagen · 1 crédito» en la partida y la cuenta 1 + 7,5 = 8,5.
5. Cortes de pantalla completa entre clips y fotos: duros, a mitad del gesto; la corriente (entra por la derecha, sale por la izquierda) la llevan las tarjetas y paneles.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material del kit a assets/ (ignorado), valida y escribe index.html
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check            # lint + runtime + layout + motion + contraste
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4    # ~3 min, 4 núcleos, sin GPU
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 56 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g1-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/grep-prohibidas.mjs      # zona segura y frases prohibidas
scripts/hoja.sh out/g1-final-1080x1920.mp4 hoja.png 300 0.0 3.3 …   # hoja de contactos con guías (el último cuadro es 55.95, no 56)
```
