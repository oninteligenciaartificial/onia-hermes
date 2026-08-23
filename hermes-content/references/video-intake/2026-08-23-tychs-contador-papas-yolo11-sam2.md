# TYCHS — el contador que sube es todo el argumento

**Fuente:** https://www.instagram.com/p/Dbyx3bwE6Mp/ — cuenta @TYCHS (agregador). Crédito en el caption: `🎥: X/ Ilir Aliu`.
**Tipo:** MIXTO — el TEMA es IA (un sistema de visión por computadora); el ARTEFACTO es MARKETING (carrusel de 4 láminas con gancho, mecanismo, prueba y pedido de follow).
**Veredicto:** SIRVE_YA
**Cobertura:** 7/7 base + 38/38 texto de `Instagram-Dbyx0QoE6vo` (100%), 2/45 de `Instagram-Dbyxz0pE5pR`, `s02.jpg` y `s04.jpg` enteras, más 18 fotogramas extraídos por mí: **10 CONSECUTIVOS a 1/30 s** (t≈6,0–6,3 s de s01) y 8 de sondeo. Verbatim: caption **97 palabras**, texto en pantalla **61 palabras**, audio **0 palabras**.

> ⚠️ **Los `fotogramas` que me entregaron no son de la lámina 1.** Ambas carpetas muestran el empaque *tarjeta con letterbox* (logo arriba a la derecha, sin titular). La lámina 1 (`s01.mp4`) tiene un **titular quemado y un CTA "SWIPE FOR MORE"** que no aparece en ninguno de los 45 fotogramas. Lo encontré recién al extraer fotogramas del mp4 yo mismo. Es el hallazgo más caro de la ficha anterior: se analizó el post sin ver su copy.

---

## Cifras medidas (no estimadas)

| Qué | Medida | Cómo |
|---|---|---|
| Láminas | 4: `s01.mp4`, `s02.jpg`, `s03.mp4`, `s04.jpg` | listado |
| Formato | **4:5** — video 720×896, imágenes 2048×2549 (ratio 0,803 en las cuatro) | `ffprobe` |
| Duración de cada video | **13,5333 s exactos**, 30 fps, **406 fotogramas** | `ffprobe` |
| Cortes | **CERO**, en s01 y s03, con umbral 0,30 **y** con 0,15 | `ffmpeg select=gt(scene,th)` (verificado por mí, no heredado) |
| Contador, recorrido completo | **0 → 444** en 13,53 s ⇒ **32,8 objetos/s promedio** | leído en pantalla t=0 y t=13,4 |
| Contador, curva real | 0@0s · 70@1s · 150@3s · 197@5s · 250@7s · 318@9s · 377@11s · 434@13s · 444@13,4s | fotogramas base + sondeos |
| Tasa instantánea | Varía **23–40/s** entre muestras de 2 s; en la ventana de 10 fotogramas consecutivos a t≈6,0 s corrió a **~57/s** | conteo directo |
| Contador, fotograma a fotograma | 218 → 222 → 223 → 224 → 225 → 226 → 230 → 231 → 232 → 235 (saltos de +1 a +4, **nunca 0**) | 10 fotogramas consecutivos |
| Audio | HE-AAC 44,1 kHz estéreo 72 kb/s, **mean −16,6 dB / max −2,5 dB**, idéntico en ambos mp4 | `ffmpeg volumedetect` |
| Peso | s01 2,64 MB · s03 2,06 MB (≈1,5 Mb/s: el video se ve macroblockeado) | listado |

*Nota:* el brief traía 540×672; mi `ffprobe` sobre el mismo archivo devuelve 720×896. **Ambos son 4:5 exacto**, así que la conclusión de formato no cambia — pero la cifra que uso es la que medí.

---

## Qué muestra, textual

### Audio
**Cero palabras.** No hay voz, ni locución, ni subtítulos de voz. Pero **no es silencio**: hay una cama instrumental a −16,6 dB medios. El post está diseñado para funcionar **con el sonido apagado**, que es como se ve un carrusel de feed.

### Texto en pantalla — lámina 1 (`s01.mp4`), quemado y ESTÁTICO los 13,5 s
Titular al pie, 4 líneas, alternando **verde** y **blanco** por bloque de sentido:

> **AI ENGINEER** CREATES AN
> **AI SYSTEM** THAT COUNTS
> **POTATOES IN REAL TIME** USING
> JUST **ONE TRAINING IMAGE**

Franja inferior: `SWIPE FOR MORE ▶`
En la costura entre video y banda negra: wordmark `TYCHS` centrado, flanqueado por dos hairlines.
Sobre el video, en verde: el entero del contador (`0` … `444`).

### Texto en pantalla — lámina 2 (`s02.jpg`)
Titular en verde, centrado, 2 líneas:
> **TRAINED WITH JUST**
> **ONE IMAGE**

Cuerpo en blanco, **itálica, sentence case**, sobre banda negra:
> *"The system used YOLO11 Nano and Meta's SAM 2 model to learn potatoes from a single labeled image and count them automatically."*

En el monitor de la foto: `322` en verde.

### Texto en pantalla — lámina 3 (`s03.mp4`)
**Ningún texto editorial.** Solo el wordmark `TYCHS` arriba a la derecha y el contador (`0` … `444`).

### Texto en pantalla — lámina 4 (`s04.jpg`)
> **YOU MAY** *NEVER SEE*
> **OUR** *PAGE* **AGAIN** *IF YOU*
> **DON'T** *FOLLOW US*

(blanco/verde alternado). En el monitor de la foto: `322`, otra vez.

### Caption (verbatim, 97 palabras)
> An AI engineer built a lightweight vision system that can count potatoes in real time using just one training image. 🥔🤖
>
> The system uses YOLO11 Nano with Meta's SAM 2 model to learn what a potato looks like from a single annotated frame, then automatically detects and counts potatoes moving along a conveyor belt.
>
> Instead of requiring a huge dataset or powerful hardware, the setup focuses on one specific industrial task with a small AI model. It shows how practical computer vision can automate repetitive work while keeping the system fast and lightweight.
>
> 🎥: X/ Ilir Aliu
>
> #ai #robotics #computervision #technology #automation

---

## Cómo está hecho — la reconstrucción

### 1) Las láminas 1 y 3 son el MISMO render, empaquetado dos veces
Mismo clip, mismo overlay, misma línea de tiempo del contador (0 en t=0, 444 en t=13,4 en **ambas**). Cambia solo el envoltorio:

- **Lámina 1 — a sangre.** Metraje ocupando ~65% del alto, corte duro contra una **banda negra sólida** (no degradado) donde vive el titular, y una franja fina de CTA abajo.
- **Lámina 3 — tarjeta.** El mismo metraje metido en una tarjeta de esquinas redondeadas con borde hairline blanco, centrada sobre un fondo oscuro que es **el mismo video escalado y desenfocado** (se ven las vetas diagonales de luz). Logo arriba a la derecha, sin titular.

Es una decisión buena y barata: la 1 vende con palabras, la 3 deja **mirar sin texto encima** a quien ya leyó el titular.

### 2) El overlay de visión: qué se ve de verdad
- **Detector + tracker.** Cada objeto lleva caja y un **ID numérico persistente**. En t=0 el contador marca **0** pero ya hay IDs asignados hasta ~55 ⇒ **el ID no es el conteo**.
- **La región es un polígono estático en espacio de imagen.** Un cuadrilátero magenta (trazo brillante, relleno traslúcido oscuro) que **no se mueve en los 13,5 s**. Todo el truco depende de que la cámara esté fija.
- **El color codifica ZONA, no clase.** Fuera del polígono: caja **violeta** con etiqueta violeta. Dentro: caja **ámbar/naranja** con chip de etiqueta **verde lima**. El recoloreo es instantáneo al cruzar el borde.
- **El contador cuenta CRUCES, no ocupación.** En t=0 hay ~16 papas ya dentro del polígono, con caja ámbar, y el contador dice `0`.
- **El contador no está animado.** Posición fija, sin easing, sin odómetro: el entero se redibuja crudo cada fotograma, y salta de +1 a +4 por fotograma.

### 3) Estabilidad de las cajas — medido, no supuesto
Sobre **10 fotogramas consecutivos** (1/30 s) los IDs **332, 375, 443, 456, 421, 405, 415, 418** aparecen en los 10 y se desplazan de forma coherente con sus papas. **Hay tracker con identidad estable.** Lo que sí entra y sale es el chorro que cae del volcador, con motion blur fuerte: ahí las cajas parpadean. Y el rectángulo no tiene suavizado propio (se pega a la salida del detector cada fotograma), pero a 30 fps con tracker eso se lee liso, no nervioso.

### 4) Qué se hizo FUERA del generador
- El polígono, el par de colores por zona y el contador son **overlay dibujado sobre el video** — trabajo de dibujo, no de modelo.
- El titular, el lockup del logo, la banda negra y el CTA están **quemados en el render**, no son texto nativo de Instagram.
- El clip fuente es de terceros (`Ilir Aliu`); TYCHS puso el empaque.

### 5) Las láminas 2 y 4 casi con seguridad son imágenes generadas o compuestas *(INFERIDO)*
No lo dice nadie. Los indicios:
- El **mismo `322`** en el monitor de **dos escenas distintas** (mesa de trabajo y pasillo de planta).
- El esquema de color de las cajas del monitor (magenta/violeta, `#7730B9` aprox.) **no coincide** con el del video real (violeta fuera / ámbar dentro).
- En s04 el monitor **y** la tablet en las manos del operario están los dos perfectamente legibles y encuadrados.
- El caption acredita **solo el video** a Ilir Aliu.

---

## El estilo, como conocimiento portable

**Tipografía.** Grotesca **condensada black**, TODO EN MAYÚSCULAS, tracking apretado, interlineado casi tocándose, x-height grande, terminales cuadrados. *No se dice cuál es*; por forma se parece a una Anton / Druk Condensed / Oswald pesada — eso es **reconstrucción, no dato**. El cuerpo de s02 rompe a propósito: **itálica humanista, peso regular, sentence case**, con apóstrofo curvo (`Meta's`). El contraste titular-condensado-caps vs cuerpo-itálica-oración es toda la jerarquía tipográfica del sistema. El CTA va en versalitas diminutas **tracked-out**. El wordmark reemplaza la `Y` por un brote verde.

**Paleta** *(hex leídos de una pantalla filmada y comprimida — todos APROXIMADOS)*. La lección está en que hay **DOS verdes que nunca se mezclan**:
- Verde de marca (editorial): ≈ **#8CC63F** (medí #92CA3F, #7DBA3A, #94C856 en las tres láminas)
- Verde máquina (salida del sistema): ≈ **#22DD22** (medí #2FE52A, #3FCF2C) — es el `(0,255,0)` crudo de OpenCV, degradado por compresión
- Chip de flecha del CTA: ≈ **#ADF40C**
- Negro banda **#000000** (medido exacto) · Blanco **#FFFDFF** ≈ #FFFFFF (medido)
- Magenta región: trazo ≈ **#FF00FF**, relleno ≈ **#4A0F45** traslúcido
- Violeta "fuera de región" ≈ **#6A3BC0** · Ámbar "dentro de región" ≈ **#C8873C**

**Composición.** 4:5, no 9:16 — es carrusel de feed, no Reel. Metraje arriba, **banda negra sólida abajo** con corte duro (no degradado): el titular nunca pelea con la imagen. El único movimiento "de diseñador" en un layout por lo demás brutalmente simple es **el logo sentado justo en la costura**, centrado, flanqueado por hairlines que llegan a los bordes. Ojo: la consistencia **no** es rígida — s04 no tiene banda, su titular va sobre viñeta.

**Ritmo.** Toma única de 13,5 s, cero cortes. **El ritmo no está en el montaje: está en el número.** 0→444 con tasa variable (23–40/s, con picos a ~57/s cuando el volcador descarga). La aceleración es del proceso real, no del editor.

**Motion.** **Cero motion design agregado.** Ni transiciones, ni entradas de texto, ni zoom, ni parallax. El texto está quemado y quieto los 13,5 s. Todo lo que se mueve es (a) el metraje y (b) el overlay de visión. **La lección: cuando el contenido ya se mueve con sentido, agregarle motion lo ensucia. El contador ES el motion design.**

**Textura.** Fondo de la tarjeta = el mismo video escalado y desenfocado (profundidad gratis). Video visiblemente macroblockeado a ~1,5 Mb/s — y no importa, porque lo que hay que leer es un entero verde de alto contraste. Las fotos, en cambio, son limpias y en alta: paleta industrial cálida (papa ámbar, acero gris, luz de día fría por las ventanas).

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — patrón **"el contador como único motion"**.
- `hermes-content/references/ui-patterns/banda-solida-lockup-en-costura/` — el layout titular quemado + logo en la costura.
- Composición HyperFrames (`hyperframes-core`, `captions-overlay`) — el bloque de titular con énfasis bicolor por bloque de sentido es HTML/CSS puro.
- `sacar-prompt` — para reconstruir el estilo de las láminas fijas 2 y 4.

---

## Las tres preguntas

**1. ¿Qué frente nuestro toca?**
Material de venta de **ONIA Platform**. Es el molde más limpio que vimos para el problema que tenemos escrito en CLAUDE.md: **la venta nunca exhibe obra** y **no se fabrica** (cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras). Este carrusel no promete, no dice "muy pronto", no muestra un testimonio: **pone un número a subir en pantalla y se calla**. El número es la prueba. Es exactamente la salida que necesitamos para mostrar que un módulo funciona sin poder citar a un cliente.

**2. ¿Con qué herramienta NUESTRA se reproduce?**
**HyperFrames** (motor HTML→MP4, ya instalado y probado — memoria `onia-video-hyperframes`) hace el render entero: contador, polígono, titular bicolor, chip de swipe y banda negra son HTML/CSS sobre un video. `editor-videos` para el armado y el nivel de la cama de audio. `copywriting` / `ads` para el molde de 4 láminas. **No hace falta OpenCV ni ningún modelo de visión**: lo que se porta es el FORMATO, no el pipeline de CV.

**3. ¿Qué falta para hacerlo hoy?**
- **Un video fuente de 13–15 s de una pantalla real de ONIA con un número que suba solo** (citas agendadas, mensajes respondidos por el agente, ítems procesados). Toma única, cámara/captura fija.
- **Decidir el par de verdes**: el verde de marca de Onia + un "verde máquina" distinto para la salida del sistema. Hoy no tenemos ese segundo verde definido.
- **Datos que se muevan.** El alta está CERRADA hasta v1.0 y la cuenta de clinica klein se borró ⇒ hace falta un tenant demo con datos sembrados. Y por la regla de no fabricar, **ese material se rotula demo**.
- Lo que **no** falta: el motor, el formato, ni el permiso — es render local y gratis, no toca Higgsfield ni ElevenLabs.

---

## Lo que NO se puede afirmar

- **Qué tracker es** (ByteTrack, BoT-SORT, otro). No se dice en pantalla, ni en el caption, ni en el audio. Solo se ve que **hay** tracking: IDs persistentes.
- **Que el conteo sea correcto.** 444 en 13,5 s no se puede contrastar contra un conteo manual desde este material.
- **Que corra "en tiempo real" en hardware modesto.** Lo afirma el caption; el video no lo prueba: no hay FPS en pantalla ni specs de hardware.
- **Que el entrenamiento haya sido literalmente con UNA imagen.** Es afirmación del caption y del titular de s02. En pantalla no hay evidencia del entrenamiento.
- **Que la máscara violeta de s02 la haya producido SAM 2.** Lo dice el caption; la imagen que la muestra es, con alta probabilidad, generada.
- **Si el contador cuenta ENTRADAS o SALIDAS de la región.** Las papas entran por el borde superior y salen por el inferior; ambos modelos producen la misma curva creciente desde t=0. No es distinguible con estos fotogramas.
- **El nombre de la tipografía.** No se dice. Lo que escribí arriba es parecido de forma, declarado como reconstrucción.
- **Que s02 y s04 sean generadas.** Indicio fuerte (el mismo `322` en dos escenas), **no prueba**.
- **Quién es TYCHS** y qué relación tiene con Ilir Aliu más allá del crédito `🎥: X/ Ilir Aliu`.
- **Jitter sub-fotograma del rectángulo.** Con 10 fotogramas consecutivos puedo afirmar que **los IDs persisten y las cajas no parpadean**; no puedo cuantificar en píxeles cuánto "respira" cada borde.

---

## Que cambio respecto de la primera version

Queda CORREGIDA la afirmación anterior de que las cajas "aparecen y desaparecen con jitter fotograma a fotograma sin ningún suavizado": en 10 fotogramas CONSECUTIVOS (1/30 s) que extraje, los IDs 332, 375, 443, 456, 421, 405, 415 y 418 persisten los 10 y se desplazan coherentes — hay tracker con identidad estable. Lo que sí entra y sale es el chorro con motion blur que cae del volcador. Queda además al descubierto un agujero de cobertura, no de lectura: los `fotogramas` que me pasaron son del OTRO empaque (la tarjeta con letterbox), así que la versión anterior nunca vio el TITULAR QUEMADO ni el "SWIPE FOR MORE" de la lámina 1 — o sea, nunca vio el copy de venta del post. El audio no cambió ni una conclusión (0 palabras), pero corrige un matiz: no es "sin audio" — hay cama HE-AAC estéreo, -16,6 dB medios / -2,5 dB pico, idéntica en los dos mp4.
