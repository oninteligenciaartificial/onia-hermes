# Revisión 1 · Lucía G5 v2 (re-corte mudo de 26,8 s) — revisor independiente, 11-oct-2026

**Veredicto: APROBADO CON CAMBIOS.** 11 hallazgos: **0 ALTA · 5 MEDIA · 6 BAJA.**

Las cifras y afirmaciones del video son fieles a `v4/PROCEDENCIA.jsonl` (línea 97) y no pasan de lo aprobado por la madre el 10-oct. No hay cuadros vacíos, saltos ni parpadeos,
y las reglas de marca (rótulo, título, CTA, zona segura) se cumplen. Lo que impide darlo por listo: el pie (H2, H3), la tarjeta c7 sin sujeto (H4), y la voz, que hoy no cabe en su
cronograma (H1, H5). H3 y H2 se arreglan solo con el pie (sin re-render); H4 pide re-render (0 cr, ~2,5 min).

**Cómo revisé.** Extraje el final a 2 cuadros por segundo (54 cuadros, 3 hojas de contacto) y miré a resolución completa los cuadros 0, 12, 30, 96, 235, 285, 345, 372, 440, 520 y 643,
los 7 empujes cuadro por cuadro y un recorte a 3x del letrero; rendericé tres placas a 390 px de ancho (teléfono). Barrí las diferencias de luma entre los 644 cuadros (independiente de
`vacios.py`/`aire.py`). Comprobé el SHA-256 del master (coincide con el README), `ffprobe`, el silencio del audio (`volumedetect`: −91 dB) y que `index.html` tiene el md5 que el README
declara. Volví a correr `scripts/voz.mjs`, `scripts/grep-prohibidas.mjs` y `scripts/hueco-tarjetas.mjs` (solo lectura, mismas salidas que las del editor, exit 0). Contrasté cada cifra con
PROCEDENCIA, `cara-chica-m5.txt`, `face-gate.sh` y `VALIDACION-G4-G5-MADRE.md`. No rendericé, no usé servicios pagos, no toqué nada fuera de este archivo.

---

## Hallazgos

### H1 · MEDIA · La voz no cabe en su cronograma: el tiempo está calculado en palabras y la voz se mide en caracteres
- **Dónde:** `guion-voz.txt` líneas 2, 3 y 8; `scripts/voz.mjs` (WPS = 3,6); `scripts/poner-voz.mjs`.
- **Evidencia.** `PLAN.md` §4 mide a Marcela en G1 v2 en ≈ 17 caracteres por segundo (320 car en ~19 s). Este guion promedia 5,06 car por palabra, así que 3,6 pal/s equivale a
  18,2 car/s (+7 % sobre lo medido), y línea por línea pide mucho más en dos casos: **L2 21,0 car/s y L8 21,6 car/s**, mientras L3 pide solo 14,4. Duración estimada de cada línea a 17 car/s
  contra su tramo (estimación mía, no medida: no hay voz):

  | Línea | Car | Voz a 17 car/s | Tramo | Resultado |
  |---:|---:|---:|---:|---|
  | 1 | 54 | 3,18 | 3,29 | hueco 0,11 |
  | **2** | 35 | 2,06 | 1,92 | **se pasa 0,14 s** |
  | **3** | 48 | 2,82 | 3,58 | **hueco 0,76 s** (> 0,3) |
  | 4 | 37 | 2,18 | 2,46 | hueco 0,28 |
  | 5 | 45 | 2,65 | 2,75 | hueco 0,10 |
  | 6 | 47 | 2,76 | 3,00 | hueco 0,24 |
  | 7 | 46 | 2,71 | 2,75 | hueco 0,04 |
  | **8** | 54 | 3,18 | 2,75 | **se pasa 0,43 s** |
  | 9 | 31 | 1,82 | 1,92 | hueco 0,09 |
  | 10 | 33 | 1,94 | 2,42 | cola 0,48 (CTA) |

  Un cruce por sílabas (5,9 sil/s, supuesto mío) da el mismo signo en L2, L3 y L8. En el total sí cabe (430 car / 17 = 25,3 s de voz en 26,8 s), pero colocar cada pista en el segundo fijo de su tramo
  (`poner-voz.mjs`, `adelay`) hace que L8 pise el arranque de L9 (`amix`: voz sobre voz) y que L3 deje un hueco largo.
- **Lo que `poner-voz.mjs` no ve.** (a) Avisa si la pista pasa del tramo, pero «recortar silencios» no sirve si la línea es larga por sí misma. (b) No avisa de pistas cortas, y esa es la mitad de la
  regla 15 (≤ 1 hueco de ≥ 0,3 s por 10 s). (c) L1 y L4 llevan dos frases en una pista: la pausa interna la decide el TTS, no el cronograma.
- **Arreglo.**
  1. Sin gastar: acortar L2 → «Ocho fotos oficiales de ella.» (29 car, ~1,7 s) y L8 → «El número no ve letreros inventados.» (36 car, ~2,1 s; «este lo difuminé» ya está en la llamada de pantalla y el aro).
  2. Correcto: generar primero las 10 pistas (necesita el OK de gasto de cupo de voz; no lo hice) y **derivar los tramos de las duraciones reales** (que `voz.mjs` lea un `duraciones.json` en lugar de WPS) y re-renderizar.
     Es el orden de la receta Erik y de G1 v2 (se aprietan pausas, no se acelera).
  3. `poner-voz.mjs`: avisar de huecos > 0,3 s y de solapes; tras la mezcla medir con `silencedetect` (−35 dB, 0,3 s) cuántos huecos hay por 10 s.

### H2 · MEDIA · Herramientas nombradas: se lee como ranking, y el límite solo vive en el pie
- **Dónde:** 0,95–3,0 s (pastilla «Seedream 4.5 · parecido 0,81»), 11,35–13,8 s («Kling O1 Image · parecido 0,35» con «Bajo el piso: otra persona.»), 14–17, 17–19,75 y 19,75–22,5 s (etiquetas); `pie.txt`.
- **Evidencia.** De las 5 herramientas nombradas, 3 llevan al lado una falla o una cautela («otra persona», «Cara chica», «lo inventó el motor»). El único éxito limpio, Seedream 4.5, aparece justo antes de
  la peor toma de Kling O1 Image. PROCEDENCIA l.97: Kling O1 Image dio **0,794 (K1) y 0,831 (K4 café)** en otras dos escenas; Seedream 4.5 dio 0,806 · 0,83 · 0,839. O sea, el 0,35 es 1 de 3 tomas, y en pantalla
  nada dice «una toma». Hoy la única mitigación es la frase del editor en el pie. En G4 (aprobado por la madre) el límite va **en pantalla**: «Una toma cada uno: es una prueba, no una regla.»
- **Juicio sobre «Son tomas sueltas, no una comparación de herramientas.»** Es verdadera (cada número es una imagen o un clip) y la idea es necesaria, pero: (1) solo está en el pie, que la mayoría no abre;
  (2) «no una comparación» es más flojo que lo aprobado en G4 y se contradice con G2 y G4, que **sí** comparan estas mismas herramientas y salen días después; (3) no trae la contraevidencia. Conservar la idea, cambiar texto y lugar.
- **Arreglo.** Pie (sin re-render): reemplazar esa frase por «Una toma de cada una: es una prueba, no una regla. En otras dos escenas, Kling O1 Image dio 0,79 y 0,83.» (0,794 y 0,831 de PROCEDENCIA).
  Opcional, con re-render: llevar «una toma» a la pastilla del café; exige ampliar su ventana (hoy 2,29 s; con 2 palabras más necesita ~2,75 s: de 11,25 a 14,0 s).

### H3 · MEDIA · El pie no abre con «personaje hecho con IA», y el README dice que sí
- **Dónde:** `pie.txt` primera frase; README líneas 13 y 114.
- **Evidencia.** `pie.txt` abre «Lucía Antelo es un personaje hecho con IA por @oniahq.»; la regla de marca (`PLAN.md` §4 y el encargo) pide que **abra con** «personaje hecho con IA». Los pies hermanos del 11-oct la cumplen al pie de la letra:
  G4 v2 «Personaje hecho con IA: Lucía Antelo, de @oniahq.», G3 v2 «Personaje hecho con IA por @oniahq: Lucía Antelo.», G2 v2 «Personaje hecho con IA: Lucía Antelo, por @oniahq.». La apertura de G5 viene del pie de v1 (aprobado 10-oct),
  así que es heredada, no nueva; en la práctica la IA queda dicha en los primeros 55 caracteres. Pero cualquier chequeo literal (`startsWith`) falla y el README afirma lo contrario.
- **Arreglo (sin re-render):** «Personaje hecho con IA: Lucía Antelo, de @oniahq. Así mido si una cara sigue siendo la suya: …» y corregir el README.

### H4 · MEDIA · La tarjeta c7 perdió su sujeto
- **Dónde:** 17,0–19,75 s, «Mismo clip: cabe en ±0,03.»
- **Evidencia.** Lo aprobado (guion G5, fila G12, validado) es «Esa variación cabe en ±0,03.» v2 quitó «variación» y la línea «de 0,77 a 0,80»; la escala muestra dos puntos 0,77 y 0,80 sin decir que son el mínimo y el máximo de seis medidas.
  Leída sola (la pieza es muda y la voz que desambigua, «varía, pero cabe en este margen», todavía no existe), «el clip cabe en ±0,03» es ambigua: ¿qué cabe?, ¿±0,03 de qué? No afirma más que lo aprobado, pero dice menos de lo que hace falta.
- **Arreglo (re-render):** tarjeta → «Esa variación cabe en ±0,03.» (5 palabras, misma ventana de lectura 2,05 s) y etiqueta → «Cinematic Studio 3.0 · mismo clip» (5 palabras, 2,05 s en una placa de 3,0 s).

### H5 · MEDIA · Tres defectos de redacción en la voz (aún se pueden cambiar gratis)
- **L4 «Uno es idéntica.»**: no concuerda (uno / idéntica) y el TTS lo dirá tal cual. Lo aprobado era «Idéntica es 1.» → «**Idéntica es uno.**» (mismo conteo, 3 palabras) y coincide con la escala «idéntica · 1».
- **L3 «Un programa las compara»** frente a **L6 / nota «el medidor avisa»**: dos nombres para lo mismo, y en pantalla solo aparece «medidor» (desde 14,4 s) sin presentación, porque «Un programa…» quedó solo en voz. → L3: «**Un medidor** las compara y da un número de 0 a 1.» (−1 car). El pie (aprobado) dice «un programa»: alinearlo (ver H9).
- **L5 «La del café…»** no tiene antecedente en voz (la pantalla muestra la foto, así que funciona); opcional «La imagen del café…» solo si el tramo se re-mide (H1: +8 car en una línea que ya va justa).

### H6 · BAJA · Los nombres de herramienta están a 34 px
- **Dónde:** `.tag` en `scripts/estilos.css` l.30 (34 px = el mínimo del repo); etiquetas «Kling O3» (14–17 s), «Cinematic Studio 3.0» (17–19,75), «Seedance 2.0 Mini + referencias» (19,75–22,5), nombres dentro de las dos pastillas, y marcas 0,75–0,90 de la escala.
- **Evidencia.** Rendericé las placas a 390 px: los nombres quedan en ~12 px, gris claro sobre casi negro. Se leen, pero son el contenido de D-N1 («quien mira puede repetir la prueba») y las placas tienen mucho espacio libre (r2 usa de y 470 a 950 de 1920).
- **Arreglo (re-render):** 40–44 px en las tres etiquetas y en los nombres de las pastillas; mismo tamaño para las marcas de la escala. Volver a pasar `medir-dom.mjs` y `ventanas.mjs`.

### H7 · BAJA · El gancho muestra 0,81 sobre una cara que, en pantalla, mide menos de 200 px
- **Evidencia.** `qa/face-gate-final.txt`: `f-gancho` cara_px **182 / 185 / 185** → «OK (cara < 200 px: poco confiable)». La foto nativa mide 237 px (`caras-fotos.json`) y ahí se midió 0,806 (PROCEDENCIA), y final ↔ fuente difiere ≤ 0,013: el número se sostiene.
  Pero el video predica «bajo 200 px, el medidor avisa» (14–17 s) y su primer número está sobre una cara de ~180 px en pantalla. No es un error ni nadie lo ve; sí es una grieta si alguien cuenta.
- **Arreglo:** una línea en el README (el 0,81 es de la foto original de 237 px). Sin cambios de video.

### H8 · BAJA · «Sin aire muerto» está sobreafirmado
- **Evidencia.**
  (a) El máximo de 0,250 s depende de eximir la ventana de lectura de cada tarjeta (0,35 s × palabras + 0,3 s). En mi barrido de píxeles (gris 108x192, Δ < 0,02) hay quietos de 0,5–1,0 s: 5,25–5,71 · 6,5–6,96 · 8,96–9,42 · **9,83–10,54 (0,71 s)** · **15,5–16,54 (1,04 s, 0,22 s fuera de la ventana de c6)** · 20,25–20,79.
  Todos caen dentro de una tarjeta en lectura salvo esos 0,22 s, así que la regla se cumple *con la exención*, no sin ella.
  (b) «Hueco máx. entre eventos 1,90 s» cuenta como evento el cambio de color del acento de cada tarjeta (10 de 56 entradas de `qa/eventos-plan.json`). Sin ellos los huecos mayores son **2,42 s (CTA, 24,42→26,83)** y **2,25 s (café, 11,55→13,8)**: tarjetas en lectura, legítimos, pero el 1,90 es producto de la definición.
  (c) La mitad de audio de la regla 15 no se puede medir antes de la voz; la cola de 1,03 s del CTA es por sí sola un hueco ≥ 0,3 s (presupuesto para 26,8 s: ≤ 2,7).
- **Juicio sobre la traducción.** Razonable (pausa ≤ 0,25 s por tramo, tarjeta siempre visible, evento con sentido cada ≤ ~2 s) y mirando los cuadros no hay pantalla muerta: 0 cuadros vacíos, el movimiento lento de las fotos y el cursor sostienen los tramos.
  Debe decirse con su exención, y la prueba real es el audio mezclado (H1).
- **Arreglo:** reescribir las frases del README «todo pasa» / «no queda aire» con la exención; medir con `silencedetect` cuando haya voz.

### H9 · BAJA · El medidor no se nombra, aunque D-N1 lo permite
- El medidor es el centro de la pieza y el espectador no puede repetir la prueba. **Arreglo (sin re-render):** pie «un programa (ArcFace) que las compara» (o «un medidor (ArcFace)», ver H5).

### H10 · BAJA · Pulido visual
- Placa r3 (20–22,5 s): el aro coral sale ~5 px del marco del cuadro por la izquierda (en f520 el trazo está en x≈225 y el borde en x≈232).
- 9,5–11,0 s: la raya vertical de la marca del piso asoma dentro de la pastilla «piso · 0,70», pegada al «·» (f235). El README dice «nada se pisa».
- Placa r2: la etiqueta «Cinematic Studio 3.0» flota ~250 px sobre la escala sin el clip a la vista; se resuelve bien con el texto de H4.

### H11 · BAJA · Rastro del master y flujo con voz
- `out/` está ignorado por git y el render no es reproducible bit a bit (README, duda 10): el único ancla del master aprobado es el SHA del README. Cuando se apruebe, copiarlo a `videos/lucia-entrega/` como g1–g5 (hoy ahí solo están las v1).
- Al mezclar la voz cambia el SHA y hay que repetir la parte de audio del QA: LUFS integrado (−14) medido con `ebur128`, no el «−16,5 dB medio» de la prueba con tonos; `loudnorm` de una pasada suele caer ±1–2 LU; pico verdadero.
- README duda 8 («Sin revisor independiente») queda obsoleta con esta revisión.
- La G5 v1 (57,5 s, «Imagen A» / «Motor 4») sigue en `lucia-entrega/`: marcarla como reemplazada para que no se publique por error tras D-N1.

---

## Juicio sobre cada duda abierta del editor

| # | Duda del editor | Juicio |
|---:|---|---|
| 1 | «Regla 15» no existe en el skill (hay 14; la de pausas es la 2, ≤ 0,5 s; `lucia/SKILL.md` §11 dice 0,25 s) | Razonable aplicar el texto del encargo. Real: `PLAN.md` §4 (11-oct) fija 0,25 s, y coincide con los huecos de 0,22–0,25 s. Falta incorporar la regla al skill (lo dice el editor; lo respaldo). Su traducción a mudo es válida con la exención (H8). |
| 2 | 3,6 pal/s es supuesto del encargo | **No alcanza**: la voz escala con caracteres/sílabas, no con palabras (H1). Dentro del rango 3,2–4,1 de `PLAN.md`, pero L2/L8 no caben y L3 sobra. |
| 3 | Criterio de «tramo quieto» es suyo | Defendible y medido también en píxeles, pero es lo que hace que el máximo sea 0,25 s; el sin-exención (1,79 s DOM / 1,08 s píxeles) debe figurar como dato, no como nota (H8). Coincide con mi barrido (1,04 s). |
| 4 | Hueco entre eventos 1,90 s | Cierto *contando acentos de color*; sin ellos 2,42 s. Ambos son lectura de tarjeta; no agregar un evento decorativo es correcto (H8). |
| 5 | No vio el video en un teléfono con la interfaz de Instagram | Yo tampoco. A 390 px las etiquetas quedan en ~12 px (H6). La zona segura simulada se cumple (ver abajo); la columna de iconos de la derecha de Instagram no se puede confirmar sin el teléfono. |
| 6 | «Kling O1 Image» vs clave `kling_omni_image` | **Cerrada**: `PLAN.md` l.113 la documenta («el nombre con que Higgsfield lo lista; el guion decía “Kling Omni Image”») y `higgsfield-generate/references/model-catalog.md` l.32 lo lista. Archivo y clave (`k2cafe_9f4b5172`) coinciden con la foto mostrada. Sobre G2–G4/G5 v1 con «Imagen A / Motor N»: ver H11. |
| 7 | El pie es nuevo y no pasó por la madre | Cierto. Las cifras nuevas del pie (0,81 y 0,35) están en PROCEDENCIA; lo que cambia de riesgo son los nombres y la frase de «tomas sueltas» (H2) y la apertura (H3). Debe pasar por la madre tras estos cambios. |
| 8 | Sin revisor independiente | Resuelto con esta revisión. |
| 9 | «Seedream 4.5 · parecido 0,81» es de UNA imagen | Cierto y el pie lo dice («Una imagen de…»); en pantalla no. Ver H2. |
| 10 | El render no es reproducible bit a bit | Cierto; por eso H11. Verifiqué el SHA contra el archivo y el md5 de `index.html`: coinciden con el README. |

**Frase añadida al pie («Son tomas sueltas, no una comparación de herramientas.»):** correcta como hecho, necesaria como idea, pero mal ubicada y mal redactada (H2).

---

## Lo que verifiqué y está bien

- **Master:** SHA-256 `72860a55…97af5fa` = el del README; H.264 1080x1920 24 fps, 644 cuadros, 26,833 s; AAC en silencio (−91 dB). Preview 360x640 de 644 cuadros. `index.html` md5 `76180374…5b99` = el declarado (el archivo se volvió a escribir a las 04:33, después del render de las 04:27, con el mismo md5).
- **Cifras contra PROCEDENCIA l.97 y lo aprobado:**
  - «Seedream 4.5 · 0,81» ← `seedream_4_5_K1_4afffb96` 0,806 · foto `k1-1-recepcion-celular-4afffb96`.
  - «Kling O1 Image · 0,35» ← `kling_omni_image_K2cafe_9f4b5172` 0,35, nota «perdió la cara: otra persona, estilo caricatura»; rotulado como otra persona, no como Lucía.
  - «89 px» ← nota «cara de 89 a 168 px»; cuadro 0 = 0,798 (`cara-chica-m5.txt`). «Bajo 200 px» ← `face-gate.sh` l.9 y l.60. El video **no** dice que el número baje (controlado: los textos son «el medidor avisa» y «lo reviso a ojo»).
  - «0,77 / 0,80» ← Cinematic Studio 3.0: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771 → mín. 0,771, máx. 0,799. Banda ±0,03 medida en f440: de x≈340 a 600 = 0,754–0,814, centrada en el promedio 0,784. Las seis medidas están a ≤ 0,015 del promedio, así que «cabe en ±0,03» es verdad con margen; no dice «es ruido».
  - «parecido 0,80» del letrero ← Seedance 2.0 Mini + referencias, muestra 4 (t = 4,0 s) 0,796; nota «invento un letrero en la torre». El recorte difuminado mide 0,791 (ORIGEN.md): ±0,01, irrelevante frente a ±0,03.
  - «Piso 0,70 / Lo elegí yo» queda como decisión, no como frontera objetiva. 8 miniaturas contadas a los 4,5 s.
- **D-N1:** los 5 nombres están en la lista válida y completos; el pie trae exacto «Nombro lo que uso; no es una recomendación pagada.»; no hay logos (teléfonos y fondos sin marca visible), ni capturas de interfaces de terceros (los cuadros son salidas propias), ni «el mejor» ni recomendación general.
- **Letrero:** a 3x queda un trazo claro ilegible, y el aro cubre las dos manchas claras (la del letrero y la de la fachada); la llamada «Lo difuminé: lo inventó el motor.» está al llegar la placa y el aro vuelve a marcar a los 21,7 s.
- **Reglas de marca, con el segundo:** rótulo «Lucía Antelo · personaje IA de Onia» a 40 px presente en el cuadro 0 y hasta ~3,1 s (sale con el empuje de 3,04 s; ≥ 3,0 s) · título «¿Cómo sé que sigue siendo ella?» (6 palabras) desde el cuadro 0 · la prueba (caja de cara 0,85 s y «0,81» 0,95 s) antes de los 3 s · CTA exacto «Seguime: cada semana, una prueba.» de 24,417 a 26,833 s = **2,417 s** (≥ 2,4 s por 0,017 s, menos de medio cuadro: no se puede recortar ni un cuadro) · ninguna profesión (el ambo es vestuario) · ningún producto de Onia · ni cara ni voz de Sergio Urcullo · ninguna cifra inventada.
- **Zona segura:** nada sobre y≈280 (el borde superior de las placas está en y 300–320); las tarjetas terminan en y 1470; el texto a ≥ 80 px de la derecha bajo y 1000. Ningún texto cortado ni sobre una cara (en el café, el cierre y la placa r3 tarjetas y llamadas caen sobre cuerpo, mesa o fondo).
- **Cuadros y costuras:** 0 cuadros vacíos; en mi barrido los únicos saltos de luma son los 7 empujes (3,04–3,29 · 4,96–5,21 · 11,0–11,25 · 13,75–14,0 · 16,75–17,0 · 19,5–19,75 · 22,25–22,5), sin parpadeos fuera de ellos; los empujes se ven rígidos y limpios.
- **Controles del editor que repetí:** `voz.mjs` (exit 0: 10 tramos, huecos 0,222–0,250 s, 439 car), `grep-prohibidas.mjs` (exit 0), `hueco-tarjetas.mjs` (exit 0, 0 de 644). Las salidas coinciden con `qa/`. Son creíbles: leí `grep-prohibidas.mjs` (excluye solo las herramientas permitidas y deja prohibidas las marcas sueltas) y `voz.mjs` (comprueba lo que dice comprobar).
- **Sincronía idea-voz (si la voz cabe, H1):** el cursor 0→1 (7,61–8,51 s) cae sobre «de 0 a 1», la marca del piso (9,49 s) sobre «el piso», el acento «otra persona» (13,45 s) sobre su palabra; el acento de c6 y c7 llega ~0,5 s tarde.

## Lo que no pude verificar

- Cómo se ve en un teléfono con la interfaz de Instagram (solo simulé el ancho de 390 px).
- Cualquier cifra de tiempo de voz: **no hay voz**; H1 es una estimación con la tasa que `PLAN.md` midió en G1 v2 y un cruce por sílabas con un supuesto mío.
- No volví a correr `hyperframes check`, `medir-dom.mjs`, `ventanas.mjs`, `medir-caras.py` ni `face-gate.sh`/ArcFace (necesitan el entorno de render o el venv): confío en sus salidas en `qa/` (las leí: `face-gate-final.txt` da máxima diferencia 0,013 en 9 pares) pero no las reproduje.
- Que «ocho fotos oficiales» no se solapen con las 6 referencias de entrada de las imágenes (pendiente desde la validación de la madre del 10-oct, afecta a todos los motores por igual).
- Que `README` «no se tocó nada fuera de esta carpeta» y «sin git»: no tengo cómo comprobarlo sin ejecutar git.
