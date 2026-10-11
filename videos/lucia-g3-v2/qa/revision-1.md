# Revisión 1 · Lucía G3 v2 (re-corte mudo de 27,5 s) — revisor independiente, 11-oct-2026

**Veredicto: APROBADO CON CAMBIOS.** 10 hallazgos: **0 ALTA · 2 MEDIA · 8 BAJA.**

Lo que se ve es fiel a lo medido y al guion G3: los tres errores son hechos de `v4/PROCEDENCIA.jsonl` (líneas 93, 94 y 95), las únicas cifras son 1·2·3, 0,835 y 120, y las reglas de marca
se cumplen (rótulo en el cuadro 0, título de 5 palabras, prueba antes de 3 s, CTA exacto, zona segura, pie que abre con «Personaje hecho con IA», cero producto, cero Sergio Urcullo, cero profesión,
cero logo legible). No hay cuadros vacíos, parpadeos ni empujes torcidos, y el control de cara, que el editor no pudo correr, **sí se pudo correr** y da identidad estable (H9). Lo que impide darlo
por listo es la voz: el cronograma de 3,6 palabras por segundo no cabe en 17 caracteres por segundo (H1), y la regla D-N1 queda como decisión abierta (H2). H2 se arregla solo con el pie.
H1 se resuelve en el re-render que de todos modos exige la voz. Ninguno de los otros pide re-render por sí solo.

**Cómo revisé.** Extraje 55 cuadros exactos (uno cada 12 = 0,5 s; mi primera pasada con `fps=2` iba ~0,2 s adelantada y la rehice) en 5 hojas de contacto con su tiempo, y las miré. A resolución
completa miré los cuadros 0, 12, 36, 60, 72-79 (rótulo), 215, 482 y 520, el CTA (598-658), el letrero a 3x, el teléfono del cierre y los cinco empujes cuadro por cuadro (171-179, 224-232, 375-383, 487-495,
540-548). Rendericé 8 cuadros a 390 px de ancho. Barrí 659 cuadros en píxeles (gris 108x192, aparte de `aire.mjs` y `vacios.mjs`): 0 planos, 0 idénticos, saltos de luma > 8 solo en los 5 empujes y en el cambio de recorte de la agenda (12,1 s, Δ 8,6).
Alineé cada clip contra su fuente por PSNR (K4 y K1, 17 cuadros) y comparé el preview 360p contra el master reducido (27-35 dB, ningún cuadro < 25). Corrí `scripts/face_identity_qa.py`
(SCRFD + ArcFace) con el entorno ya instalado. Comprobé el SHA-256 completo, `ffprobe`, el silencio del audio (`volumedetect` −91 dB), y contrasté cada cifra con PROCEDENCIA, el guion G3 y `PLAN.md`
§4/§4-bis/§5. No rendericé, no instalé ni descargué nada, no usé git, no gasté créditos, y no toqué nada fuera de este archivo.

---

## Hallazgos

### H1 · MEDIA · La voz no cabe en el cronograma: está calculado en palabras y la voz se mide en caracteres
- **Dónde:** `plan.json` → `voz.palabras_por_s: 3.6`; `scripts/build.mjs` líneas 95-106; `guion-voz.txt`; README «Cuando llegue la voz».
- **Evidencia.** `PLAN.md` §4-bis mide a Marcela en G1 v2 en ≈ 17 car/s (320 car ≈ 19 s). Este guion promedia 5,03 car por palabra, así que 3,6 pal/s equivale a **18,1 car/s** (+6,6 %), y línea por línea el
  tramo pide entre 13,8 y 24,0 car/s. Duración estimada a 17 car/s contra su tramo (estimación mía: no hay voz):

  | Línea | Car | Voz a 17 car/s | Tramo | Resultado | Car/s que pide el tramo |
  |---:|---:|---:|---:|---|---:|
  | 1 | 39 | 2,29 | 2,21 | se pasa 0,09 | 17,7 |
  | 2 | 35 | 2,06 | 1,96 | se pasa 0,10 | 17,9 |
  | 3 | 42 | 2,47 | 2,50 | cabe (hueco 0,03) | 16,8 |
  | **4** | 42 | 2,47 | 1,96 | **se pasa 0,51** | 21,5 |
  | 5 | 42 | 2,47 | 2,21 | se pasa 0,26 | 19,0 |
  | 6 | 21 | 1,24 | 1,13 | se pasa 0,11 | 18,7 |
  | 7 | 37 | 2,18 | 2,21 | cabe (hueco 0,03) | 16,8 |
  | 8 | 35 | 2,06 | 2,21 | hueco 0,15 | 15,9 |
  | 9 | 36 | 2,12 | 1,96 | se pasa 0,16 | 18,4 |
  | **10** | 27 | 1,59 | 1,96 | **hueco 0,37 (> 0,3)** | 13,8 |
  | **11** | 49 | 2,88 | 2,50 | **se pasa 0,38** | 19,6 |
  | **12** | 33 | 1,94 | 1,38 | **se pasa 0,57** (y 0,02 más allá del último cuadro: tramo + cola = 1,92) | 24,0 |

  Total: la voz sola dura 25,76 s contra 24,16 s de tramos. Con las 11 pausas de 0,25 s y la cola de 0,54 s, **la pieza pide 29,06 s, no 27,46**; a 16 car/s sería 30,67 s (fuera del encargo de 26-30 s),
  a 18 car/s 27,63 s y a 19 car/s 26,34 s. A 19 car/s (si el 17 de G1 v2 incluía pausas) solo L4 (+0,25) y L12 (+0,36) se pasan más de 0,1 s; a 15 car/s se pasan 11 de 12.
  Si cada pista se coloca en el segundo fijo de su tramo, L4 atraviesa el empuje de 9,375-9,625 s y pisa el arranque de L5 (el empuje a la agenda caería sobre «siempre»), y la última sílaba del CTA queda en el corte.
- **Lo que el README promete y el build no hace.** «Cuando llegue la voz» (paso 2) dice «o, mejor, fijar `dur_s` real por tramo». `build.mjs` solo sabe `palabras_por_s` y corta si algún tramo no es
  palabras/ritmo ± medio cuadro (línea 106): esa vía no existe todavía.
- **Cupo.** 438 car > 381 que quedan hasta el 13-oct 01:17 UTC (`PLAN.md` §4-bis); con retomas ×1,3, ≈ 570. No se puede generar antes de la renovación.
- **Arreglo.**
  1. Sin gastar, antes de generar la voz: recortar ≥ 27 car para no crecer (máx. 411 a 17 car/s). Propuesta, 31 car menos (407 car → 23,9 s de voz → 27,2 s de pieza): L1 «Tres errores que casi publico.» (−9, es el título
     de pantalla y arregla H3) · L4 «Mi regla: mirar también el fondo.» (−9) · L8 «Tres: una mano tapa a la otra.» (−5) · L11 «Reviso cuadro a cuadro antes de publicar.» (−8).
  2. Generar las 12 pistas (con el sí de gasto de cupo, que no tengo) y **derivar los tramos de las duraciones reales**: agregar a `build.mjs` la lectura de un `duraciones.json` en lugar de palabras/ritmo. El `media_inicio`
     del clip K4 hay que subirlo a mano (el build corta y lo dice): con tramos más cortos pasa de 14 a ≈ 26-33 y la mano entra 0,5-0,85 s después de T8 en vez de 1,08 s, que además la acerca a «tapa a la otra».
  3. Tras mezclar, medir con `silencedetect` (−35 dB, 0,3 s) los huecos de audio por 10 s: es la mitad de la regla 15 que hoy no se puede medir (H6).

### H2 · MEDIA · D-N1: G3 cumple a la letra pero deja la decisión abierta, y el pie es el lugar para cerrarla sin re-render
- **Dónde:** README (aviso de la línea 6, decisión 8); `pie.txt`; `PLAN.md` §4-bis.
- **Evidencia.** No quedó ningún rótulo genérico donde debería haber un nombre: los textos de pantalla son «Orden», «Cara», «Foto nueva», «Difuminado al editar»; no hay «Motor N» ni «Imagen A» (G3 nunca los tuvo: la madre
  lo anota en `videos/lucia-entrega/README.md`, «recortada por la regla 15, no por nombres»). Pero `PLAN.md` §4-bis pone D-N1 entre las «Reglas de toda pieza» y el pie «suma» la frase de uso propio. Cada error tiene herramienta
  conocida: la foto del letrero (job `6708e444`, seed 422318, PROCEDENCIA l.95) es **Seedream 4.5**, y la «foto nueva» (`eddca486`) y la agenda (`1422fa94`) comparten `metodo_fotos: seedream_v4_5` (l.93; conviene
  confirmarlo con `job_display`); los clips K4 `338b751f` y K1 `e470ef4f` son **Kling 3.0 std** (l.93). Ambos nombres están en la lista válida de D-N1.
- **Juicio.** No hace falta nombrarlas en pantalla, y no lo recomiendo: cada caso es una toma (el letrero es **1 de 8 fotos** de esa tanda: K1_1, K2_1, K2_2, K4_1 descartada, K4_1, K4_3, K4_4, K4_5) y el error 3 ni siquiera es
  un fallo de la herramienta, sino un límite de verificación (guion G3, nota del 8-oct: «las manos son correctas en todos los cuadros mirados»). Un nombre al lado de un fallo de una toma se lee como veredicto, el problema que
  G5 ya tuvo. Sí corresponde cerrar D-N1 en el pie, donde el límite cabe y no hay ranking.
- **Arreglo (sin re-render), si la madre quiere cumplir D-N1 en esta pieza:** agregar al pie, antes de «Reviso cuadro a cuadro…»: «Las fotos las hice con Seedream 4.5 y el clip con Kling 3.0 std. Es una muestra chica, no una regla:
  de las 8 fotos de esa tanda, una trajo letrero.» y, al final, «Nombro lo que uso; no es una recomendación pagada.» (el pie sigue abriendo con «Personaje hecho con IA»). Quitar entonces esas dos herramientas de la lista de
  `grep-prohibidas.mjs`. Si prefiere no nombrarlas, no hay que cambiar nada, y entonces la frase de D-N1 tampoco va (consistente con lo que hizo el editor).

### H3 · BAJA · «Tres errores de la IA» (voz L1) generaliza el error 3
- **Dónde:** `guion-voz.txt` línea 1; README decisión 7.
- **Evidencia.** El error 3 no es un fallo de la IA: el guion G3 (nota de cambios del 8-oct) dice que «las manos son correctas en todos los cuadros mirados» y que la mano que cruza es un **límite de verificación**
  (PROCEDENCIA l.94 solo registra qué cuadros se pueden contar). La pantalla es correcta («Tres errores que casi publico.» no dice «de la IA»); solo la voz lo dice. Los otros dos sí lo son (letrero, letra).
- **Arreglo (sin re-render, antes de generar la voz):** L1 → «Tres errores que casi publico.» (igual al título de pantalla; ver H1). La decisión 7 del editor (conservar «una mano tapa a la otra» como límite de verificación) es correcta.

### H4 · BAJA · «Cara: 0,835 · aprobada» no dice qué mide
- **Dónde:** etiqueta `e_cara` (4,75-7,0 s); voz L3 «La cara pasó el control».
- **Evidencia.** Es la única cifra con significado de la pieza y G3 sale antes que G5 (que explica el medidor): el espectador no sabe qué es 0,835, de 0 a cuánto, ni qué es «el control». El número es correcto: **lo reproduje**, 0,835
  en el cuadro 24 del final con SCRFD + ArcFace contra las 8 referencias oficiales (PROCEDENCIA l.93: 0,835).
- **Arreglo.** Pie (sin re-render): «El 0,835 es el parecido de esa cara con las fotos oficiales de Lucía, de 0 a 1; mi piso es 0,70.» Opcional, con re-render: etiqueta «Parecido: 0,835 · aprobado» (mismas 3 palabras, misma ventana de 2,13 s).

### H5 · BAJA · Dos tropiezos de redacción en la voz (gratis hoy)
- **L8 «Tres: una mano tapa a la otra mano.»** repite «mano»; la tarjeta dice «Una mano tapa la otra.» → «Tres: una mano tapa a la otra.» (−5 car, ya en H1).
- **L3 «el control»** no está presentado en voz ni pantalla (H4): con la etiqueta «Parecido» alcanza; si no, «La cara pasó el control de parecido, pero el fondo no.» suma 13 car y no cabe en el presupuesto de H1.
- Concordancia pantalla-voz: las 12 líneas coinciden con su tarjeta (L1↔c1 … L12↔c12); L4 y L7 dicen más que su tarjeta (el «siempre» y el «para publicar»), y eso es correcto.

### H6 · BAJA · «Sin aire muerto» está sobreafirmado
- **Evidencia.** `aire.txt` da 0,000 s porque cuenta el empuje lento de las fotos y del visor como movimiento. En mi barrido (gris 108x192, diferencia media entre cuadros < 0,10 sobre 255) el mayor tramo quieto
  es **1,25 s en la placa (21,29-22,54 s)**: tras el sello de 21,08 s solo corre el zoom 1,00→1,05 del visor. Con < 0,15 hay 0,83 s (11,08-11,92 s, agenda); con < 0,30 hasta 1,96 s (4,88-6,83 s, foto descartada con su empuje lento). Todos caen dentro de una
  tarjeta en lectura salvo ~0,34 s en la placa (c10 pide 1,7 s y se acaba de leer a los 22,2 s). La diferencia con el editor es de definición, no de datos: el propio `aire.txt` y el README (línea 85) ya muestran 1,75 s con la exención.
  La mitad de audio de la regla 15 (huecos de voz ≤ 0,3 s) no se puede medir hasta la voz.
- **Arreglo:** el README debe decir «0,000 s contando el empuje lento como movimiento; 1,25 s de plano casi fijo (placa) dentro de una tarjeta en lectura» y medir el audio mezclado con `silencedetect`.

### H7 · BAJA · El CTA cumple por 0,06 s, y el README dice 2,5 s
- **Evidencia.** Píxeles de la tarjeta: en los cuadros 598 y 599 (24,917-24,958 s) c11 y c12 están a medias (fundido de 2 cuadros); el texto de c12 llega a opacidad plena en el cuadro 600 (25,000 s) y dura hasta el 658 = **2,458 s**.
  El «2,5 s» del README cuenta desde el fundido. Cumple ≥ 2,4 s por 1,4 cuadros: no se puede recortar ni un cuadro.
- **Matiz.** El margen es fino solo porque el tramo T12 es artificialmente corto (1,375 s). Con la voz real (L12 ≈ 1,9 s) la ventana sube a ≈ 3,1 s (0,58 + 1,94 + 0,54), así que se arregla solo al retemporizar (H1).
  **Arreglo:** decir «2,46 s» en el README y que `build.mjs` mida el CTA desde la opacidad plena (≥ 0,9), no desde el fundido.

### H8 · BAJA · El difuminado del letrero conserva la silueta de un logo
- **Evidencia.** A 3x el sigma 9 deja ilegible toda letra, pero queda una banda azul oscura con un arco rojo encima: la silueta de un logo de banco (decisión 6 del editor). Está declarado en pantalla (aro + «Difuminado al editar»), pero en el
  cuadro 0 y de 0 a 1,5 s se ve antes de que nada lo declare. Ni letra legible ni marca identificable: no es un bloqueo.
- **Arreglo (opcional, re-render):** subir el sigma a 14-16 o tapar el arco rojo con un parche liso del color de la fachada. Si no, dejarlo como está y que la madre lo decida (ya figura en el README).

### H9 · BAJA · Identidad: estable, pero K4 y K1 viven cerca del piso y con caras chicas
- **Evidencia** (control corrido, ver «Lo que verifiqué»): final contra fuente, diferencia máxima **0,017** en 14 pares (≤ 0,02 del repo). Pero K4 (mira a las manos) mide 0,706-0,775 y K1 (cierre) 0,713-0,797 con caras de 173-179 px, que el
  gate marca «poco confiable» por debajo de 200 px. Todos ≥ 0,70; el más justo es el cuadro 48 de K4 (0,706). La edición no los deteriora; es el material (PROCEDENCIA l.93: K4 0,81/0,726/0,725; G3 v1: 0,717-0,830).
- **Arreglo:** una línea en el README («K4 y K1 miden 0,71-0,78; el 0,835 de pantalla es el de la foto descartada») y reemplazar el «NO corrido» de `qa/face-gate.txt`.

### H10 · BAJA · Rastro del master y mantenimiento
- `out/` está ignorado por git y el render no es reproducible bit a bit: el SHA del README (`222c8ceb…eff44`, verificado completo) es el único ancla. Al aprobar, copiar el master a `videos/lucia-entrega/` y su SHA a ese README.
- `videos/lucia-entrega/README.md` advierte «No publicar las v1 de G2, G4 y G5» pero **no la de G3** (58 s, `g3-final-1080x1920.mp4`, la del aire muerto de 1,9 s). Marcar G3 v1 como reemplazada.
- `index.html`, `plan-resuelto.json` y `README.md` tienen fecha 04:59:15, seis minutos **después** del render (04:53): no puedo demostrar que `index.html` sea el que produjo el master (el README no declara su md5). Declararlo.
- `qa/face-gate.txt` dice que SCRFD no se pudo correr; ya no es cierto (ver abajo).

---

## Juicio sobre cada duda abierta del editor

| # | Duda del editor | Juicio |
|---:|---|---|
| 1 | SCRFD/ArcFace no corrido («faltan numpy/cv2/insightface») | **Se pudo correr sin instalar nada.** Hay dos venvs ya creados el 8-oct (`…/scratchpad/lucia-face-gate/venv` y `…/venv-face`, con numpy, cv2, onnx, onnxruntime) y los modelos `det_10g.onnx` y `w600k_r50.onnx` en `…/lucia-face-gate/models`, todos en el scratchpad de la sesión 62db117f. `face-gate.sh` los busca en `/tmp/lucia-face-gate` y por eso el editor no los vio; basta `FACE_GATE_HOME=<esa carpeta>`. El PSNR/SSIM del editor probaba que el escalado no deforma pero no mide identidad: ahora sí hay número (H9). |
| 2 | «Regla 15» no está en `edicion-referentes` (llega a la 14; la de pausas es la 2, ≤ 0,5 s; `lucia/SKILL.md` §11 dice 0,25 s) | Razonable aplicar el texto del encargo. Coincide con `PLAN.md` §4-bis (0,25 s) y con los huecos de 6 cuadros. Falta escribirla en el skill (lo anota `cola/loop/lucia.md`). La traducción a mudo es válida con la exención que digo en H6. |
| 3 | 3,6 pal/s es un supuesto | **No alcanza**: dentro del rango 3,2-4,1 de `PLAN.md`, pero la voz escala con caracteres y L4, L5, L11 y L12 se pasan 0,26-0,57 s mientras L10 deja 0,37 s (H1). |
| 4 | «Tramo quieto» es criterio propio | Defendible, medido en píxeles con la sensibilidad a la vista en `aire.txt`. Mi barrido da 1,25 s en la placa donde el editor da 0,000: es definición, no error (H6). |
| 5 | Decisión 1: título «Tres errores que casi publico.» | Correcto: es el gancho de `PLAN.md` §5 («Casi publico esto.»), 5 palabras, en el cuadro 0. |
| 6 | Decisión 2: empuje lento 1,00→1,03 | Bien: evita cuadros idénticos (0 en mi barrido) y no deforma la foto (PSNR contra su fuente 31-37 dB, `psnr-fotos.txt`). Es lo que hace que «tramo quieto» sea 0 (H6). |
| 7 | Decisión 3: CTA entra 14 cuadros antes de su línea | Bien: da 2,46 s de CTA pleno; con la voz real sobra margen (H7). |
| 8 | Decisión 4: tarjetas más cortas que la voz | Bien: todas se leen enteras con empuje (`ventanas.txt`: 19 de 19; la más justa, c6, 1,29 s para 2 palabras). |
| 9 | Decisión 5: sin cifras de costo | Correcto: el «1 crédito» salió con la pantalla partida, y el costo es contenido del lunes, no del viernes (`PLAN.md` §4-bis). |
| 10 | Decisión 6: letrero difuminado | Correcto como política; ver H8 para el residuo de silueta. |
| 11 | Decisión 7: error 3 como límite de verificación | Correcta; ver H3 para la voz de L1. |
| 12 | Decisión 8 / aviso D-N1: «G3 no nombra ninguna herramienta» | Cierto y consistente; falta decidir si se cumple D-N1 en el pie (H2), no en pantalla. |

---

## Lo que verifiqué y está bien

- **Master:** SHA-256 `222c8cebe518c695fd57dda6c229ab0c1b1ab4c28a79dec44469cb4ddf6eff44` = el del README y `qa/sha256-final.txt`; H.264 1080x1920 24 fps, 659 cuadros (leídos), 27,458 s, bt709, AAC 48 kHz en silencio
  (−91,0 dB). Preview 360x640 de 659 cuadros, coincide con el master (PSNR 27-35 dB).
- **Cifras contra PROCEDENCIA:** 0,835 ← `K4_1_descartada` (l.93) y reproducido en el cuadro 24 con ArcFace; «120» y «cinco dedos» ← l.94 («cinco dedos contables en los cuadros 0, 60, 84, 96, 112 y 120»; el cuadro 120 mostrado tiene
  pulgar + 4 dedos y la otra mano cerrada, abajo a la derecha, sin cruzar); «Orden: «no signs anywhere»» ← fragmento literal de l.95 («No screens visible, no text, no logos, no signs anywhere.»); 1-2-3 es numeración. Sin cifra de costo, sin
  testimonio, sin cliente, sin promesa, sin «el mejor» (mi grep de pantalla, voz y pie: solo «siempre» en L4 y «nadie» en el pie, ambos legítimos).
- **Lo que el video no exagera:** no dice que la herramienta falle siempre (no nombra ninguna); presenta cada caso como lo que pasó en una toma; «mi regla» es una práctica propia, no un hecho sobre la IA. La «foto nueva» es el rehacer de 1 crédito (l.93).
- **Marca (`PLAN.md` §4), con el cuadro:** rótulo «Lucía Antelo · personaje IA de Onia» a 40 px en el cuadro 0, a plena opacidad en el 72 (3,00 s; `ventanas.txt` mide 3,17 s), en fundido en el 77 y fuera en el 78 · título «Tres errores que casi publico.» (5 palabras) en el cuadro 0 ·
  prueba antes de 3 s: aro a 1,5 s y recorte a 1,92 s · CTA exacto «Seguime: cada semana, una prueba.» de 25,000 a 27,458 s (2,458 s, H7) · pie abre literal «Personaje hecho con IA por @oniahq: Lucía Antelo.» · IA declarada en rótulo y pie ·
  sin producto de Onia (solo «Onia» en el rótulo) · sin cara ni voz de Sergio Urcullo · ninguna profesión (el ambo es vestuario) · ningún logo ni interfaz de terceros: el teléfono del cierre tiene lentes triples y ningún logo visible.
- **Zona segura:** nada sobre y=290 (c8-c10 desde 290, c4 desde 300, recorte del letrero desde 300); todo texto termina antes de y=1455; ningún texto en los 80 px derechos bajo y=1000; ninguno sobre una cara (rótulo bajo el mentón + 58 px; tarjetas
  sobre cielo, mesa y cuerpo). El recuadro «origen» del cuadro 120 baja hasta y≈1905 durante 6 cuadros: es un marco, no texto.
- **Edición:** 0 cuadros planos (std mínima 53), 0 idénticos, saltos de luma solo en los 5 empujes (≤ 17 en los claros, 42 en los dos que tocan la placa oscura) y 8,6 en el cambio de recorte de la agenda; los empujes son rígidos (viejo y nuevo pegados borde con borde, la tarjeta viaja con su escena);
  ninguna tarjeta parpadea (fundido de 2 cuadros entre c11 y c12, nunca vacío); ningún texto cortado. A 390 px todo se lee: rótulo y etiquetas a ~14 px, tarjetas a ~24 px.
- **Alineación de los clips (independiente de `psnr-clips.mjs`):** el cuadro n de la fuente cae exactamente en el cuadro prometido. K4 n=28…124 ↔ F=390…486 y K1 n=31…137 ↔ F=552…658: en los 17 cuadros medidos el mejor vecino es el
  esperado (PSNR 41-44 dB contra 26-39 dB de los vecinos); el contador marca 22/72/104/120 en F=384/434/466/482. El cuadro 120 cae a los 20,083 s.
- **Control de cara (`scripts/face_identity_qa.py`, SCRFD det_10g + ArcFace w600k_r50, 8 referencias oficiales locales de `videos/lucia-g4-v2/assets/refs-orig/`, sin negativos: el piso de 0,224 sale de G5, mismas refs):**

  | Tramo | Cuadros finales (parecido) | Fuente al mismo cuadro | Diferencia | Cara |
  |---|---|---|---:|---:|
  | Descartada | F24 0,835 · F84 0,831 · F108 0,827 | foto 0,830 | ≤ +0,005 | 186-189 px |
  | Foto nueva | F190 0,813 · F215 0,815 | foto 0,810 | ≤ +0,005 | 261-264 px |
  | K4 | F410 0,706 · F434 0,722 · F462 0,746 · F466 0,718 · F482 0,775 | 0,710 · 0,719 · 0,748 · 0,735 · 0,762 | −0,017 a +0,013 | 252-269 px |
  | K1 | F551 0,797 · F581 0,744 · F621 0,745 · F651 0,713 | 0,803 · 0,737 · 0,738 · 0,719 | −0,006 a +0,007 | 173-179 px |

  Máxima diferencia absoluta **0,017** (F466) en 14 pares: la edición no deforma la cara. Todos ≥ 0,70; las caras < 200 px (descartada y K1) son «poco confiables» según el propio gate y se miraron: es ella. Referencias entre sí: media de pares 0,642, mínimo leave-one-out 0,698.
- **Controles del editor que contrasté:** `hueco-tarjetas` (0 de 659; mi pixel-check coincide), `ventanas` (19 de 19; las miré en las hojas), `zona-segura`, `costuras` (5 de 5), `grep-prohibidas` (limpio; mi grep coincide), `specs-final`, `sha256-final`.

## Lo que no pude verificar

- Cómo se ve en un teléfono con la interfaz de Instagram (solo simulé el ancho de 390 px); en particular la columna de iconos de la derecha (el DOM deja el texto a ≥ 80 px del borde derecho bajo y=1000, pero no lo vi en un teléfono).
- Cualquier cifra de tiempo de voz: **no hay voz**. H1 es una estimación con los 17 car/s de G1 v2, que puede incluir pausas (a 19 car/s el cuadro mejora, ver H1) y no conozco el ritmo real de Marcela con este texto.
- El piso de caras negativas (0,224): sus 3 imágenes solo existen como URL del CDN y no descargué nada; confío en el de G5.
- Que `index.html` sea el que produjo el master (H10), y no volví a correr `hyperframes check`, `medir-dom.mjs` ni `ventanas.mjs`: no re-renderizo. Sus salidas coinciden con lo que medí en píxeles y en las hojas.
- Que la agenda `1422fa94` sea de Seedream 4.5 (PROCEDENCIA l.93 lo da por método común; falta `job_display`).
- Que «no se tocó nada fuera de esta carpeta» ni «sin git» del README: no tengo cómo comprobarlo sin ejecutar git.
- Si las 8 referencias de medición se solapan con las 6 de entrada de las imágenes (pendiente desde la validación de la madre del 10-oct; afecta a todas las piezas por igual).
