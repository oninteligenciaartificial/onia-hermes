# P9 · ¿La cara o la escena?

Composición HyperFrames MUDA: 1080×1920, 24 fps, 480 cuadros / 20 s. Dos tomas ya pagadas (m1 Kling 3.0 std, m4 Seedance 2.0 Mini + referencias); 0 créditos nuevos. La composición la escribió Codex (borrador); el 11-oct-2026 la sesión Lucía (editor, contenedor Linux) construyó SIN `--borrador`, pasó los gates, renderizó, midió y miró el master (v1, SHA `969ac27d…282e`). El mismo día un revisor independiente entregó `qa/revision-1.md` (11 hallazgos: 1 ALTA, 4 MEDIA, 6 BAJA) y el editor aplicó la revisión: **este master es la v2**. Sin Git, voz, publicación, instalaciones ni descargas.

<!-- ESTADO -->
**MASTER v2 RENDERIZADO (revisión 1 aplicada), PENDIENTE DE VERIFICADOR Y DE «mostrada, publicá P9».** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar. Sigue MUDO: la voz no existe; su cronograma (`guion-voz.txt`) es una estimación a 17 car/s.
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/p9-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `4e0593bacc572c7afd94f44e604c767a5f364ab7c1caf51aea6d76748ca46429` (`qa/sha-master.txt`); el de la v1 era `969ac27d219bec9ea9ba013aee0c55c8d055c2dff463ddc940abf14a4075282e` |
| Video | H.264 High, yuv420p, 1080×1920, 24 fps, 480 cuadros, 20,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 21,0 MB (8,4 Mb/s) |
| `index.html` | md5 `81658e47cb092712732b9d6aa8ece78e`, idempotente (dos builds, mismo md5; `qa/idempotencia.txt`) |
| Fuentes | `assets/m1.mp4` y `assets/m4-full.mp4` (hardlinks a los originales, 720×1280, 145 cuadros; SHA en `qa/specs-fuentes.txt`); nunca el proxy |
| Render | `hyperframes@0.8.142`, `--quality high -f 24`, 1 min 31,9 s (el compilador avisa de keyframes dispersos en m1 y m4, 6,04 s; sin congelados: PSNR 37-39 dB y quietud máxima 0,125 s en píxeles), captura por pantallazo (Chromium completo, sin GPU); preview 360p real 37 s |

Línea de tiempo: m1 0–6 s · empuje rígido 5,75–6,0 s · m4 6,0–11,54 s · empuje 11,54–11,79 s · placa 11,79–20 s.
Entradas (`plan.json → eventos`; todas con fundido + acento de riel y tarjeta): dato de Kling 1,5 s · aviso de las fotos recibidas por Seedance 6,5 s · placa con las dos filas 11,79 s · **límite de cara 11,85 s · «Una toma cada uno» 12,35 s · límite del brillo 14,65 s · CTA 17,4 s** (CTA a plena opacidad desde 17,46 s: 2,54 s ≥ 2,4). Acentos intermedios (13,5 · 16,0 · 19,1 s) para no dejar más de 2 s sin evento.

## Revisión 1 (`qa/revision-1.md`): qué cambió por hallazgo

| # | Sev. | Estado | Qué cambió |
|---|---|---|---|
| **H1** | ALTA | **Resuelto** | La pantalla dice «Parecido indicativo. Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.» (19 palabras) y la etiqueta «Cara: 139 → 347 px del clip original · reencuadra». El pie lleva la frase propuesta por el revisor. Evidencia: `qa/cara-px-fuente.txt` (corrida propia de `face-gate.sh` sobre los dos originales, 7 puntos por clip: Kling 115-120 px en 7 de 7; Seedance 139 y 181 px y de 243 a 347 desde los 2 s). El build valida «todo el clip / el inicio» contra la medición sin refs; las mutaciones rechazan «Seedance parte de 139 px» como única mención de tamaño (pantalla y pie). |
| **H2** | MEDIA | **Resuelto (con una reserva, ver dudas)** | La placa ya no es una pared: desde 11,79 s solo las dos filas; las notas entran **de a una**, cada una con su acento (riel naranja + tarjeta teñida 0,55 s): límite de cara 11,85 s → «Una toma cada uno: prueba, no regla.» 12,35 s → «Brillo: cuadro entero, mezcla luz y encuadre.» 14,65 s → CTA 17,4 s. Lectura nueva de la placa: 33 palabras (19 + 7 + 7) + 5 del CTA en 8,2 s (4,6 palabras/s; antes 7,6). Cada texto cumple 0,35 s/palabra + 0,3 desde su propia entrada (`qa/ventanas.txt`: límite 8,04 s con 6,95 pedidos; toma 7,54/2,75; brillo 5,25/2,75; CTA 2,54/2,4). Huecos verticales iguales (40 px) y flecha en DM Sans (ya no diminuta). |
| **H3** | MEDIA | **Resuelto** | Titular «¿La cara o la escena?» (mismas 5 palabras, pregunta). |
| **H4** | MEDIA | **Resuelto en el plan; la voz sigue sin existir** | `guion-voz.txt` sin cifras ni decimales hablados. L1-L3 terminan a 5,848 s (el corte a Seedance es 5,75-6,0 s) y L4 empieza a 6,083 s. L5, L6 y L7 empiezan a 11,96 / 14,29 / 17,33 s y sus notas entran a +0,39 / +0,36 / +0,07 s (`qa/alineacion-voz.txt`). Dos desvíos del texto de la madre, por el cronograma: L3 sin «3.0 std» (con él, L3 terminaba a 6,32 s) y L4 con «el encuadre se acerca» (sin eso, L5 empezaba a 10,5 s, antes de la placa). 311 caracteres con saltos (cupo 381; la v1 tenía 304: sube por la L4 alargada). |
| **H5** | MEDIA | **Resuelto** | Desenfoque + oscurecido fijo (`backdrop-filter`, máscara radial; esquina superior izquierda x 0-440, y 0-290) dentro de `#overlay-m4`: viaja con m4 y no toca la cara ni la zona del PSNR (y 400-700). Pie: «Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe. Lo difuminé en el video.» (la segunda frase la agregó el editor). |
| **H6** | BAJA | **Resuelto** | Brillo en enteros: «brillo 156 → 155 (−1)» y «brillo 146 → 112 (−34)»; pastillas «brillo −1» y «brillo −34»; «de 0 a 255» en la escala de cada fila. El build comprueba que el redondeo cuadre (156→155 = −1; 146→112 = −34) contra la medición de luz. |
| **H7** | BAJA | **Resuelto** | Cada fila lleva debajo de sus dos barras «brillo 0 a 255 · parecido 0 a 1», con el color de su barra. |
| **H8** | BAJA | **Resuelto y ampliado** | Ver «Dato nuevo» abajo: Seedance recibió 3 imágenes de referencia, 2 de ellas entre las 8 fotos con que se mide; Kling, ninguna. En pantalla (aviso de ≤ 12 palabras) y en el pie. |
| **H9** | BAJA | **Resuelto** | Regla 15 explicada con su exención (sección «Regla 15»). |
| **H10** | BAJA | Sin acción (por diseño) | El ambo naranja está dentro del canon (`LUCIA.md` §0: vestuario, nunca se presenta como profesional); la pieza no dice ni insinúa rubro. No hay otra toma pagada con otra ropa. |
| **H11** | BAJA | **Resuelto (README y rastro)** | SHA nuevo, gates, ArcFace con las dos fuentes (ver Gates), README al día. Falta copiar el master a `videos/lucia-entrega/` (como g1-g5) cuando la madre apruebe: no se tocó nada fuera de esta carpeta. |

### Dato nuevo (sesión Lucía, 11-oct): lo que recibió Seedance
- `job_display` del job `dd2d7c91` (0 cr): `start_image` = foto K1 (`4afffb96`) + 3 referencias: `a7cfb766` = R1_frontal_canon y `d7d6d36a` = R3_casi_frontal, que **son dos de las 8 fotos oficiales** con que se puntúa el parecido (manifest del face-gate, `$FACE_GATE_HOME/manifest.json`: R1..R8), y `abe2e6bd` = la selfie de espejo «look ancla» (no está entre las 8). Kling 3.0 std no recibió ninguna.
- Consecuencia: el 0,80 final de Seedance está medido en parte contra fotos que el motor recibió (favorecido).
- Medición independiente: `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt` (método: `.claude/skills/lucia/scripts/parecido_sin_refs.py`, ArcFace buffalo_l contra el centroide de SOLO las 6 fotos que Seedance no recibió, con matriz cruzada y tres clips de control sin entradas). Contra esas 6 fotos el parecido de Seedance baja de 0,707–0,801 a 0,673–0,761 (B−A media −0,042), pero casi todo es efecto del subconjunto (R2, R4 y R8 puntúan bajo en todos los clips: los controles caen −0,017 con el mismo subconjunto). Exceso atribuible a la fuga: **−0,026 ≈ 0,03, dentro del ruido de ±0,03**. La señal individual existe (coseno a R1/R3 +0,126 sobre las otras seis, contra +0,03 a +0,05 en controles) pero se diluye en el centroide de 8.
- Decisión de la madre: no se cambian los números de pantalla (0,71 → 0,80 siguen siendo los de PROCEDENCIA l.97); se agrega la divulgación. El build lee el archivo anterior y valida «2 de las 8», las 3 referencias y el «≈ 0,03» (`scripts/build.mjs`); la mutación que borra la divulgación (pantalla o pie) se rechaza.

## Lo que se vio (hoja 2 fps de los 40 cuadros del master y cuadros a resolución completa; preview 360p mirado antes)

Mirado: preview 360p real (3 veces: scrim de degradado, scrim de desenfoque y versión final) + en el master la hoja de 2 fps completa (`qa/contacto-2fps.jpg`, 40 cuadros) y a resolución completa los cuadros 0, 38, 156, 160, 182, 230, 274, 283, 286, 290, 297, 300, 324, 352, 356, 384, 418, 424 y 479 (entrada de cada nota, 6-11,5 s con el desenfoque, placa completa, CTA). Recortes a resolución completa del desenfoque en los cuadros 182 (7,6 s), 230 (9,6 s) y 274 (11,4 s).

- **Cuadro 0 (0 s):** rótulo «Lucía Antelo · personaje IA de Onia» (40 px, y 300-368) y título «¿La cara o la escena?» (y 760-858) sobre m1 en movimiento; la pastilla del dato NO está.
- **Dato de Kling:** entra a 1,5 s, a plena opacidad en 1,583 s: «Kling 3.0 std · brillo −1 · parecido 0,79 → 0,72». Primer número antes de 3 s.
- **Empuje m1 → m4 (5,75-6,0 s):** rígido; rótulo y título salen con m1.
- **m4 (6,0-11,54 s):** dato (y 1090-1206), reencuadre en una línea (y 1230-1300, «Cara: 139 → 347 px del clip original · reencuadra») y, desde 6,5 s con fundido y acento, el aviso «Seedance recibió 2 de las 8 fotos de puntaje: efecto estimado ≈ 0,03.» (y 1324-1440). Ninguna pastilla toca la cara (margen mínimo 59 px). **Letrero de la torre:** en la v1 se leía «DMOSS» desde ~7,1 s; en la v2 queda una mancha borrosa y más oscura sin letras en los tres recortes (7,6, 9,6 y 11,4 s), con borde suave, sin tocar el pelo ni la cara.
- **Placa (11,79-20 s):** llega solo con las dos filas (flecha de trazo visible, escala «brillo 0 a 255 · parecido 0 a 1» con el color de cada barra). Entran de a una: límite de cara 11,85 s (acento naranja + tarjeta teñida), «Una toma cada uno: prueba, no regla.» 12,35 s, «Brillo: cuadro entero, mezcla luz y encuadre.» 14,65 s, CTA 17,4 s; acentos intermedios a 13,5 y 16,0 s. Huecos verticales de 39,6 a 40,3 px. Sin cortes ni solapes; CTA y 1256-1428.
- **Zona segura (píxeles del master, `qa/zona-segura-pixeles.txt`):** pastillas y 300-1439, placa y 300-1427; nada sobre y 292 ni bajo 1490. El desenfoque de la esquina (y 0-290) es imagen retocada, no texto ni pastilla.
- **Defectos hallados en esta ronda y corregidos antes del master:** (1) scrim de degradado negro (primer preview): se veía como un óvalo negro, se cambió por desenfoque con máscara; (2) 1.ª render de la v2: la flecha de DM Sans seguía chica y el «0» de DM Sans en «brillo 0 a 255» se leía «O»: flecha SVG y escala en mono (2.ª render, la que es master).
- **Observaciones sin corregir:** (a) de 6,5 a 11,5 s las tres pastillas de m4 tapan de y 1090 a 1440 (parte de la mano y del teléfono); (b) en la placa, entre 11,79 y 17,4 s, queda vacío todo lo de abajo de y 1216-1428 (es la zona de la interfaz de Instagram: no se puede usar); (c) el límite y «una toma cada uno» entran con 0,5 s de diferencia (el límite no puede entrar antes de 11,79 s y la voz estimada fija la toma en ~12,35 s).

## Regla 15 («aire muerto», de `edicion-referentes`) y su exención

La regla 15 no existe como tal en el skill del repo; se aplica el texto del encargo (mismo criterio que G5 v2): pausa de voz ≤ 0,3 s, ningún tramo quieto > 0,3 s **fuera de la lectura**, un evento cada ≤ 2,0 s y a lo sumo un hueco de voz ≥ 0,3 s por cada 10 s.
- **Exención:** un texto cuenta «en lectura» durante su ventana (0,35 s/palabra + 0,3 s desde que entra), y un tramo quieto dentro de esa ventana no cuenta como aire. Con la exención el mayor tramo quieto es **0,000 s** (DOM, `qa/aire.txt`) y 0,125 s en píxeles (`qa/aire-pixeles.txt`).
- **Dato real sin exención** (cuadro a cuadro del DOM): **1,500 s** de mayor tramo igual (v1: 1,708 s); en los clips el movimiento es el de la fuente (el revisor midió que no hay quietos de 0,13 s). Es la placa, quieta entre entradas, y se cumple por la exención (cada nota está dentro de su ventana de lectura). Los «eventos» son entradas reales de texto (fundido + 18 px + acento) y acentos de riel (borde de 10 px y tarjeta teñida): 17 eventos, hueco máximo 1,700 s.
- Voz (no medible sin voz): pausas estimadas 0,213–0,235 s; el único hueco ≥ 0,3 s es la cola del CTA (0,725 s, de 19,3 a 20,0 s).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN `--borrador` (x2) | 0 / 0 | datos, pie y voz validados contra PROCEDENCIA l.97, la medición de luz del 11-oct y la medición sin refs; 311 caracteres con saltos (cupo 381), 480 cuadros; idempotente (mismo md5) |
| `master-ready.mjs` | 0 | «Fuentes completas; apto para comenzar QA/render» |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | cronograma ESTIMADO a 17 car/s; pausas 0,213-0,235 s; L1-L3 terminan a 5,848 s, L4 empieza a 6,083 s; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 12 textos, cada uno con su ventana contada desde su propia entrada; CTA 2,542 s (mín. 2,4); aviso 5,04 s (mín. 4,5) |
| `hueco-tarjetas.mjs` | 0 | 0 de 480 cuadros sin tarjeta (las filas de la placa cuentan como tarjeta) |
| `eventos.mjs` | 0 | 17 eventos, hueco máximo 1,700 s (entradas y acentos) |
| `aire.mjs` | 0 | quieto fuera de lectura 0,000 s (DOM); sin exención 1,500 s |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px |
| `medir-dom.mjs` | 0 | 1718 cajas / 480 cuadros, 0 fallos; margen mentón-texto 59 px; dato a 1,583 s; CTA 2,542 s |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias (el texto nuevo no casa con la regex «las/todas las/ambas caras… 200») |
| `lucia-prohibidas.mjs pie.txt guion-voz.txt` | 0 | 0 coincidencias (también sobre el texto de pantalla) |
| `validar-mutaciones.mjs` | 0 | **22** alteraciones rechazadas, entre ellas «Seedance parte de 139 px» como única mención de tamaño (pantalla y pie), el aviso de fotos recibidas borrado o con otro efecto (pantalla y pie), el scrim ausente, el letrero ausente del pie, voz con decimales y L3 que vuelve a cruzar el corte |
| `verificar-auditor.mjs` | 0 | regresión del reporte |
| gates `--estatico` (5) | 0 | reconfirmados |
| `hyperframes check` (0.8.142, `npx -y`) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan, como G5) · layout 0 problemas / 9 muestras · runtime 0/0 · motion 0/0 · contraste 38/38 AA |
| preview 360p real | 0 | `qa/p9-preview-360p.mp4`, 360×640, 24 fps, 480 cuadros, 20,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-clips` | 0 | mínimo 37,06 dB (m1: 38,82 / 38,90 / 38,88; m4: 38,32 / 37,54 / 37,06), umbral 35; el desenfoque cae fuera de la zona medida (y 400-700) |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 480 cuadros, 0 planos; quietud fuera de lectura 0,125 s (tope 0,3) |
| ArcFace master ↔ fuente (`face-gate.sh`) | 0 | 8 pares: diferencia máxima **0,014** contra la fuente escalada y **0,017** contra la nativa de 720p (regla ≤ 0,02); `qa/arcface-final.txt` dice con cuál se compara |
| Tamaño de cara de las fuentes (`face-gate.sh`, 14 cuadros) | 0 | reproduce la tabla de la revisión; `qa/cara-px-fuente.txt` |
| Layout DOM | 0 | `qa/layout-dom.txt` (alturas, líneas y huecos reales); sustituye a `tipografia-estimada.txt` (necesitaba fontTools; no se instala) |

La detección de caras sobre el master (`qa/caras-detectadas-master.txt`) es la de la v1 con una nota: rótulo, título y datos de Kling y de Seedance no se movieron, y el reencuadre y el aviso van más abajo del mentón; la separación de la v2 la cubre `medir-dom` (margen 59 px).

## Decisiones y cómo revertirlas

- **Texto del límite de cara:** reemplazado por la reformulación de la revisión (H1) por decisión de la sesión Lucía. Constante: `plan.json → textos.limite_cara` (y `reencuadre`); el pie y el literal autorizado de `scripts/build.mjs → esperado` van a la par. Reponer la frase vieja («Seedance parte de 139 px») o «todas las caras…» rompe build/gates y no se ofrece reversión.
- **Alineación de la voz estimada (H4):** L4 se alargó a 96 caracteres para que L5 empiece junto a la placa y L3 perdió «3.0 std». Revertir = editar `guion-voz.txt` y el literal `vozEsperada` del build; el build avisa si L3 cruza el corte o si L5-L7 se desalinean de su nota. Cuando haya voz real: medir cada pista, `duraciones.json`, retemporizar y corregir `plan.json → eventos` (`voz: n`).
- **Placa en serie (H2):** el orden de entrada es límite → toma → brillo → CTA, con el límite primero porque pide más lectura. Para cambiarlo: `plan.json → eventos` (t, `entrada`) y `layout` (y de cada bloque, medidos en el DOM; huecos de 40 px).
- **Scrim del letrero (H5):** `plan.json → scrim_m4` (caja, centro, radios, `desenfoque_px`, `brillo`). Cambiarlo exige mirar los cuadros 7-11,5 s a resolución completa y repetir PSNR y ArcFace.
- **Aviso de fotos recibidas:** pastilla `#aviso-refs` en m4 (6,5 s), no en la placa, para no pasar el tope de ≈ 34 palabras nuevas de lectura en la placa; es la duda 3 de abajo.
- Se copió la estructura de G5 v2 (package, hyperframes, scripts, assets-fijos). Los validadores se adaptaron a P9 (IDs, placas, rutas). Volver a G5 exige conservar el contenido P9 y remapear IDs.
- 20 s: m1 0–6 s, m4 5,75–11,791667 s, placa 11,541667–20 s. Dos empujes rígidos de 6 cuadros; clips a 1× sin congelación ni zoom añadido.
- Gancho y rótulo IA a 40 px desde el cuadro 0; el resultado de Kling entra a 1,5 s; Seedance y el reencuadre van rotulados debajo de las caras (y 1090-1440). Cambiar `textos`, `layout` y el build; medir DOM otra vez.
- Fuentes locales de marca (`build.mjs → FONTS` copia las tres woff2 desde `hermes-content/brand/fonts` a `assets/fonts/`, ignorado): Bricolage Grotesque 700 / 66 px en título y CTA, DM Sans 500 / 40 px en rótulo y filas, 42 px en datos, 44 px en notas y 34 px en la escala; Spline Sans Mono 500 / 42 px en cifras. No se descarga nada.
- CTA conserva 2,4 s mínimos de lectura/exposición aunque su conteo ordinario da 2,05 (`qa-dom.mjs → need`); no se amplía la exención del resto.
- `medir-dom` acumula todos los incumplimientos (`qa/medir-dom.txt`, `qa/medir-dom-fallos.json`) y termina con exit 1 si hay fallos. Regresión sin navegador: `node scripts/verificar-auditor.mjs`.
- **Estado inicial:** GSAP no aplica `tl.set(...,0)` si el primer `time(0)` llega a un timeline recién creado; por eso el estado inicial va con `tl.fromTo` y la opacidad oculta en CSS (no `transform` en CSS: falla `hyperframes check` con `gsap_css_transform_conflict`).
- `hyperframes.json → media.autoProxy=false`: evita derivados automáticos.
- `scripts/build.mjs` no pisa el bloque `ESTADO` de este README cuando las fuentes están completas y el estado ya no dice BORRADOR.

## Cómo reproducir (los comandos que se corrieron)

Desde `videos/lucia-p9-luz-cara/`. Con red para `npx -y` (en este contenedor la 0.8.142 se resuelve así; `--offline` no tiene caché).

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
node scripts/build.mjs > qa/build-master.txt 2>&1      # SIN --borrador; valida textos/pie/voz contra PROCEDENCIA l.97, la medición de luz y la medición sin refs
node scripts/master-ready.mjs
node scripts/voz.mjs > qa/tramos-de-voz.txt && node scripts/retemporizar.mjs > qa/retemporizar.txt   # también escribe qa/alineacion-voz.txt
for g in ventanas hueco-tarjetas eventos aire costuras medir-dom; do node scripts/$g.mjs > qa/$g.txt 2>&1 || exit 1; done   # los --estatico SOBREESCRIBEN qa/<gate>.txt: correrlos antes o repetir los DOM después
node scripts/grep-prohibidas.mjs > qa/grep-prohibidas.txt; node scripts/validar-mutaciones.mjs > qa/validar-mutaciones.txt; node scripts/verificar-auditor.mjs
node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 check > qa/hyperframes-check.txt 2>&1
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
# Tamaño de cara de los originales: face-gate.sh <clip>@0,1,2,3,4,5,5.9 sobre m1 y m4 (qa/cara-px-fuente.txt)
```

No se renderizó dos veces el master: NO se verificó que el SHA del MP4 sea reproducible (sí lo es el `index.html`). `qa/sha-master.txt` fija el SHA de este master; si se vuelve a renderizar, comparar por PSNR/cuadros y no solo por hash.

## Lo que quedó sin medir y dudas abiertas

1. **Verificador y revisión de esta v2:** los pone la madre. Ningún resultado de este README es aprobación visual ni permiso de publicar. Falta copiar el master a `videos/lucia-entrega/` (como g1-g5) cuando se apruebe.
2. **Voz: NO existe.** El master es mudo (AAC en silencio). Cronograma ESTIMADO a 17 car/s sobre `guion-voz.txt` (311 caracteres con saltos; 305 sin ellos). Dos desvíos del texto de la madre por el cronograma: L3 sin «3.0 std» (con él terminaba a 6,32 s, después del corte) y L4 con «el encuadre se acerca» (con la L4 de 72 caracteres, L5 empezaba a 10,5 s, antes de que exista la placa; la alternativa es un silencio de ~1,4 s, que sumado a la cola del CTA daría dos huecos ≥ 0,3 s en los últimos 10 s). Cuando haya voz real hay que medir las pistas, retemporizar y corregir las entradas (`plan.json → eventos`, `voz: n`).
3. **Densidad de lectura:** la placa pasó de 63 palabras a la vez (7,6 palabras/s) a 33 de lectura nueva + 5 del CTA en 8,2 s (4,6/s), pero la lectura **secuencial estricta** de las tres notas (12,45 s) no cabe en 8,2 s: las ventanas se cumplen contando cada texto desde su propia entrada, con las notas solapadas, como pidió la madre. Además el aviso de fotos recibidas dejó el tramo de Seedance en 29 palabras en 5,75 s (5,0/s; antes 17 palabras, 3,0/s); en la placa habría sumado 12 palabras (45, por encima del tope de ≈ 34). Alternativas si pesa: pasar el aviso a la placa fundido con «Una toma cada uno» o recortar la nota del brillo.
4. **«fotos de puntaje»** (texto de la madre) puede no decirle nada al espectador; «fotos con que se mide» cabe en las mismas 12 palabras. No se cambió.
5. **El 0,80 sigue favorecido en pantalla:** la divulgación dice «efecto estimado ≈ 0,03» (exceso −0,026 de la medición sin refs, dentro del ruido de ±0,03). La señal por foto (coseno a R1/R3 +0,126 sobre las otras seis) no se muestra. Los números de pantalla (0,71 → 0,80) son los de PROCEDENCIA l.97, por decisión de la madre.
6. **Desenfoque del letrero:** `backdrop-filter` funciona en el modo «screenshot» de este render (preview y master). No se probó con `chrome-headless-shell` (modo beginFrame): si se renderiza así hay que mirar los cuadros 7-11,5 s otra vez.
7. **Instagram:** no se simuló la interfaz. A 390 px de ancho, el texto de 34 px de la escala queda en ~12 px (legible, justo).
8. **Pie:** el editor agregó «Lo difuminé en el video.» tras la frase del letrero (honestidad sobre el retoque).
9. El render no es reproducible bit a bit (el `index.html` sí). El compilador de HyperFrames avisa de keyframes dispersos en m1 y m4 (6,04 s) y el render de un `404` «non-blocking» (probablemente el favicon); no hay congelados ni cuadros rotos.
10. **Ambo (H10):** sin acción, dentro del canon (`LUCIA.md` §0); la pista visual sigue ahí y no hay otra toma pagada con otra ropa.
11. `scripts/estimar-tipografia.py` no se corrió (falta `fontTools`; no se instala nada); lo sustituye la medida DOM de `qa/layout-dom.txt`.
12. Contraste: `hyperframes check` midió 38/38 AA; no hay medición propia fuera de ese gate.
13. Avisos de estilo de `hyperframes check` (3× `nested_structure_needs_subcomposition`): no frenan; no se refactorizó a subcomposiciones.
14. El render se hizo en modo «screenshot» porque el Chromium completo no expone `HeadlessExperimental` (PSNR 37-39 dB y ArcFace ≤ 0,017 muestran que no degradó la imagen).
