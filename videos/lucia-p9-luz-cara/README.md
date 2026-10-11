# P9 · La cara o la escena.

Composición muda HyperFrames: 1080×1920, 24 fps, 480 cuadros / 20 s. Dos tomas ya pagadas; 0 créditos nuevos. Solo se creó esta carpeta. G5/G2, fuentes, cola y skills se leyeron sin modificarlos. No Git, red, instalaciones, generación de voz, publicación ni render.

<!-- ESTADO -->
**BORRADOR · NO APTO PARA MASTER. m4 usa proxy 360p; solo gates estáticos.**
<!-- FIN ESTADO -->

`build.mjs` falla por defecto si falta `v4/prueba-motores-20261008/seedance-mini-refs-dd2d7c91.mp4`. Solo `--borrador` admite el proxy y avisa en consola, aquí y en `qa/build-status.json`. Cuando exista el original, reconstruir SIN flag: el HTML usará `m4-full.mp4`, nunca el proxy anterior. `master-ready.mjs` rechaza un borrador antes de renderizar. Hardlinks de estos dos clips evitan duplicación en C:; fallback copia únicamente los dos archivos si el FS lo exige. No se debe editar ningún archivo de `assets/`: está enlazado a la fuente.

## Decision provisional de la madre (a confirmar)

Choque: el contrato decía «Las caras de estos clips (720p) miden menos de 200 px: el parecido es indicativo». PROCEDENCIA l.97 dice que Seedance pasa de 139 a 347 px; «caras < 200 px poco confiables» es el límite del medidor, no el tamaño de ambas caras durante todo el clip.

Nueva pantalla, literal: «El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.»

Nuevo pie, literal: «el parecido es indicativo: bajo 200 px la cara es poco confiable (en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.»

La constante editorial es `plan.json → textos.limite_cara`. Para cambiarla con decisión de la madre: editar esa línea, el texto equivalente en `pie.txt` y el literal autorizado de `scripts/build.mjs → esperado.limite_cara/pie`. Reconstruir y repetir ventanas. Reponer la frase falsa provoca fallo de build/gate; no se ofrece una reversión que la publique. El guion no contenía «menos de 200 px», conserva las 7 líneas / 304 caracteres (saltos incluidos), cupo 305. No se generó voz.

## Decisiones y cómo revertirlas

- Se copió la estructura de G5 v2: package, hyperframes, ignore, scripts y assets-fijos necesarios. Sus validadores dependían de IDs/placas y rutas Linux de G5; se adaptaron a P9. Volver a la implementación G5 exige conservar el contenido P9 y remapear IDs, no copiar sus resultados QA.
- 20 s: m1 0–6 s, m4 5,75–11,791667 s, placa 11,541667–20 s. Dos empujes rígidos de 6 cuadros; clips a 1× sin congelación ni zoom añadido. Revertir en `plan.json → clips/placa/costuras` y plantilla de build, después repetir gates. La cola estimada de la voz se prolonga a 73 cuadros para completar 480; `voz.ultimo_tramo_cuadros` la controla.
- Gancho y rótulo IA40 desde f0; resultado Kling entra a 1,5 s; Seedance y reencuadre rotulados debajo de las caras heredadas de G2. Cambiar `textos`, coordenadas en build y timeline; medir DOM nuevamente.
- Placa final: ambas tomas, brillo con una barra por clip y parecido con otra, límites completos, CTA en los últimos 2,417 s legibles. Barras calculadas de valores finales; los rótulos muestran ambas puntas. No son ranking. Las notas aparecen juntas para disponer de 8,292 s por nota; ventanas por texto, **no prueba de comprensión de toda la placa simultánea**. Si la revisión pide lectura secuencial, recortar texto con la madre o replantear duración; no acelerar.
- CTA conserva 2,4 s mínimos de lectura/exposición aunque su conteo ordinario da 2,05. Se reconoce en `qa-dom.mjs → need`; no se amplía la exención del resto de textos.
- Acentos de riel cada ≤2 s, reales en el timeline. Se cuentan como eventos (como G5); sin esos acentos la placa permanece quieta más tiempo. Cambiar `plan.eventos` y repetir eventos/aire.
- Fuentes locales de marca, como G5: `build.mjs → FONTS` copia las tres woff2 desde `hermes-content/brand/fonts` a `assets/fonts/` (ignorado). `@font-face` local: Bricolage Grotesque700/66px en título y CTA, DM Sans500/40px en rótulo y filas, 42px en datos y 44px en notas; Spline Sans Mono500/42px en cifras comparativas. No se descargan fuentes ni se modifica su carpeta original. Para cambiar el estilo, editar `scripts/estilos.css` y tamaños de la plantilla de build; volver a medir con las fuentes cargadas.
- Corrección del corte CTA detectado por la madre (1510,71875 >1490): CTA pasa de y1360/52px a y1280/66px en Bricolage, con interlineado1,12 y padding vertical12px. Placa compacta: toma y720, brillo y855, límite de cara y1040; notas DM44/interlineado1,1; filas con margen12px y menos separación interna. Textos obligatorios y tiempos intactos. Título66px, datos42px, rótulo40px, como G5. Revertir coordenadas/tamaños en build y espacios en CSS; la versión anterior corta el CTA y no debe darse por aprobada.
- `medir-dom` ahora acumula todos los incumplimientos geométricos y temporales: cada fila incluye regla, ID, cuadro, tiempo, valor y límite. Escribe `qa/medir-dom.txt` y `qa/medir-dom-fallos.json`, luego termina con exit1 si hay fallos. Regresión pura del reporte (sin navegador): `node scripts/verificar-auditor.mjs`. Los demás gates conservan su comportamiento.
- Apoyo estático de tipografía con fontTools ya instalado: `python -B -X utf8 scripts/estimar-tipografia.py` usa avances de glifos de las woff2 locales. CTA: dos líneas previstas y borde inferior1451,84px (38,16px de aire hasta1490). **Es un modelo sin shaping/kerning del navegador, no una medida DOM.** `medir-dom` además exige que las tres fuentes estén efectivamente cargadas; la madre verifica el layout definitivo.
- **Estado inicial en CSS (corrección de la madre, 11-oct):** GSAP no aplica los `tl.set(...,0)` si el primer `time(0)` llega sobre un timeline recién creado (medido en Chromium: `#dato-m1` y `#cta` seguían en opacity 1 y `#placa`/`#m4` sin desplazar). Resultado: el cuadro 0 habría mostrado la pastilla del dato un cuadro antes de su entrada a 1,5 s. `scripts/estilos.css` (final) fija `#m4,#overlay-m4,#placa{transform:translateX(1080px)}` y `#dato-m1,#cta{opacity:0}`; los `tl.set` quedan igual. G5 no tiene el problema porque usa `fromTo`. Revertir: borrar esas dos líneas (y entonces vigilar el cuadro 0 del render).
- `hyperframes.json → media.autoProxy=false`: evita derivados automáticos. Reactivarlo solo en la sesión con disco y autorización. Package no ofrece publicar ni render directo del borrador.

## Gates y evidencia

Los archivos `qa/*.txt` contienen el resultado y exit code. `--estatico` ejecuta **el timeline entregado con GSAP real sobre objetos**: posiciones horizontales, opacidad, rieles, lectura por texto y continuidad. No es DOM renderizado; no mide wrapping, altura, contraste ni píxeles. Los comandos sin ese flag usan Chromium y miden el DOM real cuadro por cuadro; no hacen render de video.

Resultados vigentes (madre, PC, 11-oct, Chromium local de Playwright, sin render ni red): `qa/RESUMEN-gates.txt` con el exit code de cada gate. Los gates sin `--estatico` (DOM real) son los que dejan `qa/<gate>.txt`; los `--estatico` corrieron antes y se sobrescribieron.

- Build con `--borrador`: validación de parecido/créditos/tamaños contra PROCEDENCIA **l.97**, brillo contra medición del 11-oct y pie literal generado de datos. Δm1 −1,0 se toma del archivo de medición; no se recalcula desde extremos ya redondeados (156,0−155,1 daría −0,9).
- Idempotencia: dos builds, mismo MD5 de index; `qa/idempotencia.txt`.
- Validación negativa: `node scripts/validar-mutaciones.mjs`, exit0; diez alteraciones rechazadas (parecido, créditos, brillo, 139/347, frase de todas las caras, cifras de pantalla/pie/voz y apertura IA). Fuentes locales comprobadas con ffprobe, exit0: ambas24 fps/145 cuadros; m1 720×1280, proxy360×640 (`qa/specs-fuentes.txt`).
- Ventanas estáticas: todos los 11 textos cumplen 0,35 s/palabra +0,3 (CTA ≥2,4); cara indicativa pide 7,3 y recibe 8,292 s.
- Hueco estático: 0 de 480 cuadros sin tarjeta. Costuras: separación0,000 px en ambas, con tarjetas viajando1080 px.
- Eventos:14, hueco máximo1,708 s, contando acentos. Aire del timeline:0,000 s fuera de lectura/clips; sin exención1,708 s. El movimiento de los clips se asume de las fuentes, pendiente corroboración en píxeles.
- Grep: pantalla/pie/voz sin afirmaciones prohibidas. Voz:304 caracteres, 480 cuadros estimados y pausas ≤0,3; la cola del CTA es lectura.
- **medir-dom: VERDE (exit 0)**, corrido por la madre con Chromium local y las tres fuentes de marca cargadas: 1680 cajas / 480 cuadros, 0 fallos (nada sobre y=292, nada cortado bajo y=1490, nada pisado ni sobre la cara), margen mínimo mentón-texto 59 px, rótulo 40 px y título en el cuadro 0, dato a 1,58 s, CTA 2,417 s. La primera corrida (1510,7 > 1490 en la tarjeta CTA) llevó al ajuste de la placa. Caras: cajas heredadas de G2 (detección nueva de caras no corrida).
- **hyperframes check PENDIENTE, NO ejecutado:** ni 0.8.142 ni 0.8.143 están en la caché de npx (`npx --offline` da ENOTCACHED, exit 1; `qa/hyperframes-check.txt`). No se sustituyó versión ni se usó red. Errores/avisos de estilo aún desconocidos.

## Comandos para sesión Lucía (nube)

Desde `videos/lucia-p9-luz-cara/`. Exigen m4 ORIGINAL y herramientas ya disponibles. Si falta versión, navegador o fuente, detener y devolver el bloqueo; no descargar bajo este encargo.

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium/chrome
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
export HYPERFRAMES_SKIP_SKILLS=1
node scripts/build.mjs > qa/build-master.txt 2>&1
node scripts/master-ready.mjs
node scripts/voz.mjs > qa/tramos-de-voz.txt
node scripts/retemporizar.mjs > qa/retemporizar.txt
for g in ventanas hueco-tarjetas eventos aire costuras medir-dom; do node scripts/$g.mjs > qa/$g.txt 2>&1 || exit 1; done
node scripts/grep-prohibidas.mjs > qa/grep-prohibidas.txt
npx --offline --yes hyperframes@0.8.142 check > qa/hyperframes-check.txt 2>&1
# Preview real primero; mirar antes del master. El helper no copia videos.
mkdir -p renders out qa
node scripts/borrador-360.mjs
(cd renders/draft360 && flock /tmp/hf-render.lock npx --offline --yes hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/p9-preview-360p.mp4)
# Solo después de revisar el preview y master-ready:
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 20 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/p9-final-1080x1920.mp4
sha256sum out/p9-final-1080x1920.mp4 > qa/sha-master.txt
ffprobe -v error -show_streams -show_format -of json out/p9-final-1080x1920.mp4 > qa/specs-final.json
ffmpeg -i out/p9-final-1080x1920.mp4 -af volumedetect -vn -f null - 2> qa/aac-silencio.txt
node scripts/pixeles.mjs psnr-clips > qa/psnr-clips.txt
node scripts/pixeles.mjs vacios > qa/vacios.txt
node scripts/pixeles.mjs aire > qa/aire-pixeles.txt
# Hoja a 2fps (cuadros 0,12,...,468), una sola imagen; MIRARLA y escribir resumen.
ffmpeg -y -i out/p9-final-1080x1920.mp4 -vf 'select=not(mod(n\,12)),scale=216:384,tile=8x5' -frames:v 1 -q:v 2 qa/contacto-2fps.jpg
```

El render solicitado usa `npx -y` tal como el contrato; antes debe pasar el check **offline** de esa misma versión. No ejecutar render si no existe en caché. PSNR compara seis cuadros alineados contra fuentes completas en ROI sin tarjetas y exige ≥35 dB; si falla por color/escalado/alineación, corregir, no bajar umbral. Las cifras ArcFace/brillo son mediciones de las fuentes, no nuevas mediciones del proxy.

## Lo que no se pudo cerrar

1. m4 completo AUSENTE. El proxy360p solo permitió gates estáticos; build NO apto para master. La sesión nube debe tener/restaurar la fuente ya pagada por su canal autorizado y ejecutar build sin flag. Este encargo no autoriza recuperarla por red.
2. DOM real: **verde** (medir-dom exit 0, ver arriba). Queda sin medir contraste y la detección NUEVA de caras (se usan las cajas de G2). La hoja `qa/hoja-dom-10-instantes.jpg` son capturas del DOM a 10 instantes (0; 1,7; 3; 5,8; 8; 11,7; 13; 15,5; 17,6; 19,6 s) con el clip m4 en PROXY 360p: sirven para ver el layout, NO son cuadros del master ni sustituyen la hoja de contacto a 2 fps del render.
3. HyperFrames 0.8.142 check: no cacheado (ENOTCACHED también con 0.8.143). PENDIENTE para la sesión Lucía, errores y avisos desconocidos.
4. **SHA-256 master: PENDIENTE. H.2641080×1920/24 fps: PENDIENTE. DuraciónMP4 18–20 s: PENDIENTE. AAC silencio≈−91dB: PENDIENTE. PSNR≥35: PENDIENTE. Preview y hoja de contacto mirada: PENDIENTE.** Comandos exactos arriba. No hay master ni MP4 creado en esta sesión.
5. Decisión provisional del límite: a confirmar por madre marketing. Las fuentes ahora son las de G5. El guion permanece texto; 17car/s es estimación y cualquier voz futura necesita autorización y medición propia.
6. Revisión independiente y verificador: los pone la madre. Ningún resultado estático se presenta como aprobación visual ni permiso para publicar.
