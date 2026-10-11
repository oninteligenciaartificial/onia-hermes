# P9 · La cara o la escena.

Composición HyperFrames MUDA: 1080×1920, 24 fps, 480 cuadros / 20 s. Dos tomas ya pagadas (m1 Kling 3.0 std, m4 Seedance 2.0 Mini + referencias); 0 créditos nuevos. La composición la escribió Codex (borrador); el 11-oct-2026 la sesión Lucía (editor, contenedor Linux) construyó SIN `--borrador`, pasó los gates, renderizó, midió y miró el master. Sin Git, voz, publicación, instalaciones ni descargas.

<!-- ESTADO -->
**MASTER RENDERIZADO, PENDIENTE DE REVISIÓN INDEPENDIENTE.** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar: nada sale sin «mostrada, publicá P9» de la madre.
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/p9-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `969ac27d219bec9ea9ba013aee0c55c8d055c2dff463ddc940abf14a4075282e` (`qa/sha-master.txt`) |
| Video | H.264 High, yuv420p, 1080×1920, 24 fps, 480 cuadros, 20,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 21,3 MB (8,5 Mb/s) |
| `index.html` | md5 `0cb8fb6c71c5a6453dc52c3aabb7eb71`, idempotente (dos builds, mismo md5; `qa/idempotencia.txt`) |
| Fuentes | `assets/m1.mp4` y `assets/m4-full.mp4` (hardlinks a los originales, 720×1280, 145 cuadros; SHA en `qa/specs-fuentes.txt`); nunca el proxy |
| Render | `hyperframes@0.8.142`, `--quality high -f 24`, 1 min 10,7 s, captura por pantallazo (Chromium completo, sin GPU); preview 360p real 34 s |

Línea de tiempo: m1 0–6 s · empuje rígido 5,75–6,0 s · m4 6,0–11,54 s · empuje 11,54–11,79 s · placa 11,79–20 s · CTA a plena opacidad 17,583–20,0 s (cuadros 422–479 = 58 = 2,417 s).

## Lo que se vio (preview 360p, hoja 2 fps `qa/contacto-2fps.jpg` y cuadros a resolución completa)

Mirado: preview 360p completo en hoja de 40 cuadros (antes del master) + hoja 2 fps del master + a resolución completa los cuadros 0, 40, 138/141/144, 200, 270/283/284/290, 400, 421/422/424, 479.

- **Cuadro 0 (0 s):** rótulo «Lucía Antelo · personaje IA de Onia» (40 px, y 300–367) y título «La cara o la escena.» (y 760–857) ya sobre m1 en movimiento; la pastilla del dato NO está (el arreglo del estado inicial funciona).
- **Dato de Kling:** ausente hasta el cuadro 36 (1,5 s), entra en el 37 (1,542 s) y está completo en el 39 (1,625 s): «Kling 3.0 std · brillo −1,0 · parecido 0,79 → 0,72». El primer número queda antes de los 3 s.
- **Empuje m1 → m4 (cuadros 138–144):** rígido, sin separación; rótulo y título salen con m1. El tramo lento inicial del `power3.inOut` (cuadros 139–140 casi quietos) es del ease, no un fallo.
- **m4 (6,0–11,54 s):** el reencuadre se ve (cara pequeña con medio cuerpo → primer plano; la cara del lienzo pasa de ~209 a ~520 px) y el brillo baja a ojo. Pastilla del dato (y 1090–1205) y «Cara: 139 → 347 px · reencuadra» (y 1270–1339) sobre la camisa/manos; ninguna toca la cara.
- **Placa (11,79–20 s):** las dos filas con su par de barras (verde = brillo final, naranja = parecido final), las tres notas y, desde 17,58 s, el CTA «Seguime: cada semana, una prueba.» en dos líneas (y ≈1280–1455). Sin cortes ni solapes.
- **Zona segura (píxeles del master, `qa/zona-segura-pixeles.txt`):** el contenido empieza en y=300 y termina en y=1455 en todo el video; nada sobre y≈280 y nada bajo 1490. Los 2 px sueltos en la fila 288 son ruido H.264 (diferencia ≤ 7 niveles).

Observaciones concretas (ninguna rompe un gate; la madre decide):

1. **Placa densa (11,79–20 s):** 63 palabras a la vez durante 8,29 s (la nota del límite de cara son 20 palabras en 3 líneas) y 68 con el CTA. Cada texto cumple su tiempo individual de `ventanas.mjs`, pero eso NO prueba que se lea toda la placa de golpe (esto ya estaba avisado en «Decisiones»). La mitad inferior (y 1455–1920) queda vacía en la placa.
2. **«brillo 156 → 155,1 (−1,0)»:** la medición dice 156,0 y la fila lo imprime como «156» (sin decimal); es el mismo valor. El «−1,0» y el «−34» van con U+2212 en fuente monoespaciada y se ven casi como un guion corto. Cosmético.
3. **Los «139 → 347 px» son píxeles del clip fuente de 720p** (la caja SCRFD de la cara mide 148 px en el cuadro 144 del master ÷1,5, y 522 ÷1,5 = 348 px al final de m4). En el lienzo 1080×1920 que ve el espectador la cara mide ~209 → ~520 px. La pantalla es fiel a PROCEDENCIA l.97, pero quien vea una cara de 500 px y lea «bajo 200 px la cara es poco confiable» puede sentir una contradicción. Además la cara de m1 mide ~119 px de clip (172–181 px en el lienzo): también está bajo 200 px y la pantalla solo nombra la de Seedance. No se tocó el texto (decisión de la madre, ver abajo).
4. **Letrero inventado en la torre (arriba a la izquierda de m4, ~6–9 s):** texto ilegible tipo «DMOSS». Es el «inventó un letrero» ya anotado en PROCEDENCIA; está en el clip, no se retocó y la pantalla no lo menciona.
5. **Ropa:** Lucía lleva un conjunto naranja tipo uniforme sanitario en ambos clips (es la toma ya pagada). Ningún texto afirma profesión, pero es una pista visual.

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN `--borrador` | 0 | datos/pie/voz validados contra PROCEDENCIA l.97 y la medición de luz del 11-oct; 304 caracteres, 480 cuadros |
| `master-ready.mjs` | 0 | «Fuentes completas; apto para comenzar QA/render» |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | cronograma ESTIMADO a 17 car/s (no hay voz); huecos 0,216–0,240 s |
| `ventanas.mjs` | 0 | 11 textos con su tiempo; CTA 2,417 s (mín. 2,4) |
| `hueco-tarjetas.mjs` | 0 | 0 de 480 cuadros sin tarjeta |
| `eventos.mjs` | 0 | 14 eventos, hueco máximo 1,708 s (contando acentos de riel) |
| `aire.mjs` | 0 | quieto fuera de lectura 0,000 s (DOM); sin exención 1,708 s |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px |
| `medir-dom.mjs` | 0 | 1680 cajas / 480 cuadros, 0 fallos; margen mentón-texto 59 px; dato a 1,58 s; CTA 2,417 s |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias |
| `validar-mutaciones.mjs` | 0 | 10 alteraciones rechazadas |
| `verificar-auditor.mjs` | 0 | regresión del reporte |
| gates `--estatico` (5) | 0 | reconfirmados tras el arreglo del timeline |
| `hyperframes check` (0.8.142, `npx -y`) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan, como G5) · layout 0 problemas / 9 muestras · runtime 0/0 · motion 0/0 · contraste 26/26 AA |
| preview 360p real | 0 | `qa/p9-preview-360p.mp4`, 360×640, 24 fps, 480 cuadros, 20,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-clips` | 0 | mínimo 37,07 dB (m1: 38,80 / 38,87 / 38,88; m4: 38,33 / 37,53 / 37,07), umbral 35 |
| `pixeles.mjs vacios` | 0 | 480 cuadros, 0 planos |
| `pixeles.mjs aire` | 0 | quietud fuera de lectura 0,083 s (tope 0,3) |
| ArcFace master ↔ fuente (`face-gate.sh`) | 0 | diferencia máxima 0,017 (regla ≤ 0,02), 8 pares; `qa/arcface-final.txt` |
| Detección nueva de caras en el master (SCRFD) | 0 | 24 cuadros a 2 fps: ninguna pastilla toca la cara, margen mínimo 58 px; `qa/caras-detectadas-master.txt` |

**Un fallo real, ya arreglado en la fuente:** la primera corrida de `hyperframes check` dio exit 1: `gsap_css_transform_conflict` por el `transform:translateX(1080px)` en CSS de `#m4,#overlay-m4,#placa` (el arreglo del cuadro 0 de la madre). No se tocó ningún umbral: `scripts/timeline.js` fija ahora ese estado con `tl.fromTo(...)` en t=0 (`immediateRender`, exento de la regla) para `#m4,#overlay-m4,#placa` (x 1080) y `#dato-m1,#cta` (opacidad 0); `scripts/estilos.css` conserva solo `#dato-m1,#cta{opacity:0}`. Comprobado en Chromium (`time(0)` primero, ir a 10 s y volver a 0: x=1080/opacidad 0 donde toca) y en el render (cuadro 0 sin la pastilla). Todos los gates se repitieron tras el cambio. El `tl.set(...,0)` original ya no existe (ni su aviso `gsap_timeline_set_initial_hide`).

ArcFace sobre 8 cuadros con cara (m1 cuadros 12/48/84/120; m4 cuadros de clip 30/66/102/130) — centroide contra las 8 refs oficiales, master vs fuente escalada igual: m1 0,793/0,801 · 0,742/0,759 · 0,740/0,747 · 0,701/0,711; m4 0,792/0,789 · 0,754/0,749 · 0,790/0,796 · 0,814/0,813. Estas muestras NO son las cifras de pantalla (esas son las 7 mediciones por clip de PROCEDENCIA l.97): solo prueban que el render conserva la cara de la fuente. Las caras de m1 (172–181 px en el lienzo) son «poco confiables» según el propio gate.

## Decisiones y cómo revertirlas

- **Texto del límite de cara (decisión de la sesión Lucía, 11-oct: se mantiene como lo dejó Codex).** Choque de origen: el contrato decía «Las caras de estos clips (720p) miden menos de 200 px»; PROCEDENCIA l.97 dice que Seedance pasa de 139 a 347 px, y «caras < 200 px poco confiables» es el límite del medidor, no el tamaño de ambas caras todo el clip. Pantalla literal: «El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.» Pie literal: «el parecido es indicativo: bajo 200 px la cara es poco confiable (en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.» Constante editorial: `plan.json → textos.limite_cara`. Para cambiarla: esa línea, el texto equivalente en `pie.txt` y el literal autorizado de `scripts/build.mjs → esperado.limite_cara/pie`; reconstruir y repetir ventanas y render. Reponer la frase falsa («todas las caras…») rompe build/gate y no se ofrece reversión.
- Se copió la estructura de G5 v2 (package, hyperframes, scripts, assets-fijos). Los validadores se adaptaron a P9 (IDs, placas, rutas). Volver a G5 exige conservar el contenido P9 y remapear IDs.
- 20 s: m1 0–6 s, m4 5,75–11,791667 s, placa 11,541667–20 s. Dos empujes rígidos de 6 cuadros; clips a 1× sin congelación ni zoom añadido. Revertir en `plan.json → clips/placa/costuras` y la plantilla de build, y repetir gates. La cola de la voz estimada se prolonga a 73 cuadros para completar 480 (`voz.ultimo_tramo_cuadros`).
- Gancho y rótulo IA a 40 px desde el cuadro 0; el resultado de Kling entra a 1,5 s; Seedance y el reencuadre van rotulados debajo de las caras. Cambiar `textos` y coordenadas del build y del timeline; medir DOM otra vez.
- Placa final: ambas tomas, brillo con una barra por clip y parecido con otra, límites completos, CTA en los últimos 2,417 s. Barras calculadas de valores finales; los rótulos muestran ambas puntas; no son ranking. Las notas aparecen juntas (8,292 s por nota): ventanas por texto, **no prueba de comprensión de toda la placa a la vez**. Si la revisión pide lectura secuencial, recortar texto con la madre o replantear duración; no acelerar.
- CTA conserva 2,4 s mínimos de lectura/exposición aunque su conteo ordinario da 2,05 (`qa-dom.mjs → need`); no se amplía la exención del resto.
- Acentos de riel cada ≤2 s, reales en el timeline, se cuentan como eventos (como G5). Cambiar `plan.eventos` y repetir eventos/aire.
- Fuentes locales de marca (`build.mjs → FONTS` copia las tres woff2 desde `hermes-content/brand/fonts` a `assets/fonts/`, ignorado): Bricolage Grotesque 700 / 66 px en título y CTA, DM Sans 500 / 40 px en rótulo y filas, 42 px en datos y 44 px en notas, Spline Sans Mono 500 / 42 px en cifras. No se descarga nada.
- Corte del CTA (1510,7 > 1490) corregido antes: CTA y1280 / 66 px; placa compacta (toma y720, brillo y855, límite y1040). Revertir coordenadas en el build y espacios en CSS; la versión anterior corta el CTA y no debe aprobarse.
- `medir-dom` acumula todos los incumplimientos (`qa/medir-dom.txt`, `qa/medir-dom-fallos.json`) y termina con exit 1 si hay fallos. Regresión sin navegador: `node scripts/verificar-auditor.mjs`. Apoyo estático de tipografía: `python -B -X utf8 scripts/estimar-tipografia.py` (modelo de avances de glifos, NO una medida DOM).
- **Estado inicial (cambiado el 11-oct por el editor, ver «Un fallo real»):** GSAP no aplica `tl.set(...,0)` si el primer `time(0)` llega a un timeline recién creado; por eso el estado inicial va con `tl.fromTo` (no con `tl.set` ni con `transform` en CSS). Revertir NO es recomendable: la CSS con `translateX` falla `hyperframes check`.
- `hyperframes.json → media.autoProxy=false`: evita derivados automáticos.
- `scripts/build.mjs` ya no pisa el bloque `ESTADO` de este README cuando las fuentes están completas y el estado ya no dice BORRADOR (antes lo reescribía en cada build); en `--borrador` sigue escribiendo el aviso.
- Se borraron de `qa/` los resultados del borrador con proxy, que quedaron obsoletos: `build.txt`, `build-segundo.txt`, `build-sin-flag.txt` y `hoja-dom-10-instantes.jpg` (capturas DOM con m4 en 360p). Los reemplazan `build-master*.txt` y `contacto-2fps.jpg`.

## Cómo reproducir (los comandos que se corrieron)

Desde `videos/lucia-p9-luz-cara/`. Con red para `npx -y` (en este contenedor la 0.8.142 se resuelve así; `--offline` no tiene caché).

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
node scripts/build.mjs > qa/build-master.txt 2>&1      # SIN --borrador
node scripts/master-ready.mjs
node scripts/voz.mjs > qa/tramos-de-voz.txt && node scripts/retemporizar.mjs > qa/retemporizar.txt
for g in ventanas hueco-tarjetas eventos aire costuras medir-dom; do node scripts/$g.mjs > qa/$g.txt 2>&1 || exit 1; done   # los --estatico SOBREESCRIBEN qa/<gate>.txt: correrlos antes o redirigirlos
node scripts/grep-prohibidas.mjs > qa/grep-prohibidas.txt; node scripts/validar-mutaciones.mjs > qa/validar-mutaciones.txt; node scripts/verificar-auditor.mjs
npx -y hyperframes@0.8.142 check > qa/hyperframes-check.txt 2>&1
mkdir -p renders out qa
node scripts/borrador-360.mjs
(cd renders/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/p9-preview-360p.mp4)   # mirar antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4   # proceso hijo directo; ~70 s
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 20 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/p9-final-1080x1920.mp4
sha256sum out/p9-final-1080x1920.mp4 > qa/sha-master.txt
ffprobe -v error -show_streams -show_format -of json out/p9-final-1080x1920.mp4 > qa/specs-final.json
ffmpeg -i out/p9-final-1080x1920.mp4 -af volumedetect -vn -f null - 2> qa/aac-silencio.txt
node scripts/pixeles.mjs psnr-clips > qa/psnr-clips.txt; node scripts/pixeles.mjs vacios > qa/vacios.txt; node scripts/pixeles.mjs aire > qa/aire-pixeles.txt
ffmpeg -y -i out/p9-final-1080x1920.mp4 -vf 'select=not(mod(n\,12)),scale=216:384,tile=8x5' -frames:v 1 -q:v 2 qa/contacto-2fps.jpg
# ArcFace (venv con numpy/cv2/onnxruntime fuera del repo): export FACE_GATE_HOME=…/lucia-face-gate; .claude/skills/lucia/scripts/face-gate.sh <cuadros FINAL y fuente>
```

No se renderizó dos veces el master: NO se verificó que el SHA del MP4 sea reproducible (sí lo es el `index.html`). `qa/sha-master.txt` fija el SHA de este master; si se vuelve a renderizar, comparar por PSNR/cuadros y no solo por hash.

## Lo que quedó sin medir y dudas abiertas

1. **Revisión independiente y verificador:** los pone la madre. Ningún resultado de este README es aprobación visual ni permiso de publicar.
2. **Voz: NO existe.** El master es mudo (AAC en silencio). El cronograma de voz es una ESTIMACIÓN a 17 car/s sobre `guion-voz.txt` (304 caracteres, cupo 305); cuando haya voz real autorizada hay que medir sus duraciones y retemporizar, y es posible que cambien los tiempos de las tarjetas.
3. **Legibilidad real de la placa final:** 63 palabras simultáneas en 8,29 s; solo hay prueba por texto, no de toda la placa a la vez (observación 1). Decisión de la madre: dejarla, recortar texto o secuenciar.
4. **Texto «139 → 347 px» / «bajo 200 px la cara…»:** fiel a PROCEDENCIA l.97 pero son px del clip fuente; en el lienzo la cara mide ~209 → ~520 px, y la cara de m1 (~119 px de clip) también está bajo 200 px. La madre marketing confirma o reformula (observación 3; cómo cambiarlo, en «Decisiones»).
5. Contraste: `hyperframes check` midió 26/26 AA; no hay medición propia fuera de ese gate.
6. El brillo y la cara de las dos tomas son «una toma cada una, prueba no regla»: así lo dice la pantalla y el pie; este master no añade ninguna afirmación general.
7. Avisos de estilo de `hyperframes check` (3× `nested_structure_needs_subcomposition`): no frenan, iguales que en G5; no se refactorizó a subcomposiciones.
8. Durante el render apareció un `Failed to load resource: 404` «non-blocking» (probablemente el favicon del servidor de render; todos los recursos del HTML existen). No se investigó más.
9. El render se hizo en modo «screenshot» porque el Chromium completo no expone `HeadlessExperimental` (el aviso del propio render pide `chrome-headless-shell`, que existe en `/opt/pw-browsers/chromium_headless_shell-1194` pero no se usó para no cambiar el entorno de G5). PSNR 37–39 dB contra la fuente y ArcFace ≤ 0,017 muestran que no degradó la imagen.
