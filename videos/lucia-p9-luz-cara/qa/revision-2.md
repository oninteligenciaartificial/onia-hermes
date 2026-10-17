# Revisión 2 · Lucía P9 «¿La cara o la escena?» v2 (mudo, 20 s) — revisor independiente, 11-oct-2026

**Veredicto: APROBADO CON CAMBIOS. Sin ALTA. Dos MEDIA que conviene cerrar antes de mostrar (H1 pide re-render, H2 no). 7 hallazgos: 0 ALTA · 2 MEDIA · 5 BAJA.**

De los 11 hallazgos de la revisión 1: **7 resueltos de verdad en el master (H1, H3, H4 en el plan, H5, H7, H8, H9), 3 parciales (H2 placa, H6 enteros, H11 entrega pendiente por diseño) y 1 sin acción por diseño (H10)**. Ninguna cifra, nombre ni frase de pantalla, pie o guion de voz es falsa. Lo que queda es de **proporción y claridad del aviso nuevo del sesgo de referencias**, no de verdad:

- **H1 (MEDIA):** el 0,80 de Seedance, que es la cifra favorecida, aparece **8,2 s en la placa final sin el aviso** (el aviso vive solo en la toma de Seedance, 6,5-11,5 s). La placa es el cuadro que más dura y el que se pausa o se captura.
- **H2 (MEDIA):** la frase del pie sobre el sesgo («descontando eso, el efecto estimado es de ≈ 0,03») se puede leer al revés: como que la mejora real de Seedance sería 0,03. Se arregla sin re-render.

**Cómo revisé.** SHA-256 del master completo, `ffprobe`, `volumedetect`, md5 de `index.html` y SHA-256 de las dos fuentes. 40 cuadros a 2 fps, en 2 hojas de contacto (`montage`), las dos **miradas**. A resolución completa: cuadros 0, 182, 479 y los de cada entrada (aviso 155-164, placa 283-300, notas 351-353 y 360, CTA 418-423), más una cinta de los 15 cuadros de los dos empujes. Comparé el desenfoque contra la fuente en 6 instantes (clip 20, 44, 68, 92, 116, 136), contando píxeles distintos y mirando recortes. Barrí en píxeles los 480 cuadros a 1080×1920 (script propio en el scratchpad, no `pixeles.mjs`): movimiento, cuadros vacíos, caja de la interfaz (zona segura), arranque del CTA, cambios locales de la placa. Medí el largo de las cuatro barras. Repetí `signalstats` (luma) sobre los dos clips. Corrí `face-gate.sh` (venv ya instalado) sobre **13 pares** master↔fuente nativa de 720p, 6 de Kling y 7 de Seedance, y reproduje el tamaño de cara. Recalculé el cronograma de voz a 17 car/s y su sensibilidad. No ejecuté `build.mjs`, `hyperframes`, ni nada que renderice o escriba en `qa/`; no instalé nada, no gasté créditos, no generé voz, no publiqué. Solo escribí este archivo; lo demás quedó en el scratchpad. Disclosure: corrí **una vez** `git status --short` (solo lectura, salida vacía) pese a la instrucción de no usar git; no usé git para nada más.

---

## Hallazgos

### H1 · MEDIA · El 0,80 de Seedance sale 8,2 s en la placa sin el aviso del sesgo
- **Dónde:** placa 11,79-20 s (fila «Seedance 2.0 Mini + referencias · parecido 0,71 → 0,80» y su barra); también 6,0-6,5 s (pastilla sin aviso, 0,5 s hasta que entra y 0,67 s hasta plena opacidad).
- **Evidencia.** El aviso es la pastilla `#aviso-refs`, hija de `#overlay-m4`: entra a 6,5 s y sale con el empuje a 11,54 s. En la placa solo hay «Parecido indicativo… Ruido ±0,03.» y «Una toma cada uno: prueba, no regla.»: ninguna menciona que Seedance recibió 2 de las 8 fotos con que se mide. Medí las barras en píxeles (pista de 850 px): 155/255 = 0,607 (mide 0,607), 0,72 → 0,720, 112/255 = 0,439 (0,438), 0,80 → 0,800. Son fieles, y lo que el ojo compara al final es **0,72 contra 0,80**: justo la pareja en que el 0,80 es el favorecido (exceso ≈ 0,026 según `medicion-sin-refs-entrada-20261011.txt`) y el 0,72 está medido a ~116 px de cara. La placa es el 41 % del video y el cuadro que queda al pausar, capturar o dejar el loop. El pie sí lo dice, pero casi nadie lo abre.
- **Proporción.** El aviso en la toma de Seedance tiene el mismo peso visual que el dato (pastilla de 116 px, dos líneas) y dura 5 s: sobra ahí, falta en la placa. No es un error de verdad; es que la divulgación está donde menos hace falta.
- **Arreglo (re-render; es el mismo render de H3-H5).** Poner una marca en la fila de Seedance de la placa. Dos opciones, la madre elige:
  1. **(Recomendada, +6 palabras.)** Alargar el título de la fila a «Seedance 2.0 Mini + referencias · recibió 2 de las 8 fotos» (envuelve a dos líneas, ~+40 px; la placa termina en 1428 y la zona útil llega a 1490, así que entra con ~20 px de margen: medir de nuevo en el DOM).
  2. Marcar «0,80 *» y escribir debajo de la nota del límite «* Seedance recibió 2 de las 8 fotos con que se mide: ventaja ≈ 0,03.» Dice más, pero suma 13 palabras a una placa que ya está densa (H6); no tocar «Brillo: cuadro entero, mezcla luz y encuadre.», que califica el −34.
  Con cualquiera, el aviso de la toma de Seedance puede seguir como está. Sin re-render la alternativa es aceptar y dejarlo solo en el pie con el arreglo de H2.

### H2 · MEDIA · El pie sobre el sesgo se puede leer al revés
- **Dónde:** `pie.txt`: «Seedance recibió 3 imágenes de referencia y 2 de ellas están entre las 8 fotos oficiales con que se mide el parecido; descontando eso, el efecto estimado es de ≈ 0,03 (dentro del ruido de ±0,03). Kling no recibió ninguna.» (el literal está en `scripts/build.mjs` l.67).
- **Evidencia.** «Descontando eso, el efecto estimado es de ≈ 0,03» admite dos lecturas: (a) la querida: el efecto del sesgo es ≈ 0,03; (b) quitado el sesgo, el efecto (la mejora de Seedance) queda en 0,03. La (b) choca con el pie que viene después («las dos diferencias (0,07 y 0,09) lo superan»), y un lector apurado se queda con ella. Lo medido es (a): exceso −0,026 sobre los controles (Seedance + refs, B−A −0,042 contra −0,017 de los controles con el mismo subconjunto).
- **Precisión extra.** «Kling no recibió ninguna» es exacto solo para imágenes de referencia de entrada. Las dos tomas parten del **mismo cuadro inicial K1** (`4afffb96`), que a su vez se generó con 6 referencias, 4 de ellas oficiales (R1, R3, R6, R7: `PROCEDENCIA.jsonl` l.96 contra el manifiesto). Como es igual para ambas no sesga la comparación (los controles de la medición también parten de K1), pero la frase puede leerse como «Kling no vio esas fotos».
- **Arreglo (sin re-render): pie.txt, `build.mjs` l.67 y el literal de `validar-mutaciones`.** Reemplazar la frase por:
  > «Seedance recibió 3 imágenes de referencia y 2 de ellas (R1 y R3) están entre las 8 fotos oficiales con que se mide el parecido, así que su parecido pudo salir favorecido: lo estimo en ≈ 0,03, dentro del ruido de ±0,03. Kling no recibió imágenes de referencia; las dos tomas parten del mismo cuadro inicial.»
  Mantiene «2 de», «3 imágenes», «≈ 0,03» y «±0,03» (lo que el build valida) y pasa `lucia-prohibidas.mjs` (verificar al editarlo).

### H3 · BAJA · El aviso en pantalla dice «efecto estimado ≈ 0,03» sin decir de qué ni a favor de quién; «fotos de puntaje» es opaco
- **Dónde:** pastilla `#aviso-refs`, 6,5-11,54 s: «Seedance recibió 2 de las 8 fotos de puntaje: efecto estimado ≈ 0,03.»
- **Evidencia.** La cifra es verdadera (0,026 ≈ 0,03) y la fuente está bien, pero: (1) no dice el signo («efecto» puede ser una mejora, una pérdida o el efecto del reencuadre); (2) «puntaje» no aparece en ningún otro lado de la pantalla, donde la medida se llama «parecido»; (3) nada explica qué son las «8 fotos». «Dentro del ruido» solo llega en la placa (11,85 s), cuando el aviso ya se fue.
- **Juicio sobre «fotos de puntaje» contra «fotos con que se mide»:** **«fotos con que se mide» es claro y gana**: es el mismo giro que usa el pie («con que se mide el parecido») y cualquiera lo entiende sin saber qué es ArcFace; «de puntaje» es un calco de «scoring photos» que obliga a deducir. Ninguna de las dos aclara «qué fotos», pero no hace falta: «las 8 fotos con que se mide» se lee como «las fotos contra las que se compara».
- **Arreglo (re-render, opcional si ya se re-renderiza por H1):** «Seedance recibió 2 de las 8 fotos con que se mide: ventaja ≈ 0,03.» (13 palabras por el conteo del proyecto: 0,35 s × 13 + 0,3 = 4,85 s ≤ los 5,04 s de ventana; la versión de 12 palabras del editor pide 4,5 s). «Ventaja» da el signo; el «dentro del ruido» queda en la placa y el pie. No agregar «estimada» (14 palabras = 5,2 s, no cabe).

### H4 · BAJA · «146 → 112 (−34)» es un doble redondeo de 145,47
- **Dónde:** placa, fila de Seedance («brillo 146 → 112 (−34)»); `plan.json → clips[m4].entero`.
- **Evidencia.** `signalstats` YAVG del clip, medido por mí: 145,467 → 111,754 (Δ −33,71). El entero más cercano a 145,467 es **145**, no 146: 146 sale de redondear el 145,5 que ya venía redondeado en `medicion-luz-movimiento-20261011.txt`. El −34 es correcto (−33,71) y el 112 también; el 146 se desvía 0,53 de la medida. Kling no tiene el problema (156,041 → 155,077; Δ −0,96; 156 → 155 (−1) es exacto). La revisión 1 recomendó justo este «146 → 112»: error mío de ese informe, con el mismo defecto que le criticó al «156 → 155,1».
- **Impacto:** nulo para el mensaje; es una cifra que el espectador no puede comprobar. Importa porque la serie se apoya en «las cifras salen de la medición».
- **Arreglo (aceptar o re-render; mi preferencia es aceptar).** Con enteros no hay forma de que 145,467 → 111,754 sea a la vez fiel y «cuadre»: «145 → 112 (−34)» es fiel y la resta da 33; «146 → 112 (−34)» cuadra y el 146 no es el entero de la medida. Lo más barato y honesto: dejarlo y **anotar en el README** que el 146 es el redondeo del 145,5 publicado y que el valor real es 145,47. Si la madre prefiere cero discrepancia, la fila de Seedance puede ir con un decimal, «145,5 → 111,8 (−33,7)», que es la medición tal cual (y la de Kling queda en enteros).

### H5 · BAJA · La placa dice «Bajo 200 px» sin «del clip original»; en el lienzo, la cara de Seedance ya mide más de 200 px al inicio
- **Dónde:** placa 11,85-20 s, nota del límite.
- **Evidencia.** La etiqueta «Cara: 139 → 347 px del clip original» (6,0-11,54 s) ya aclara la unidad, pero se va 0,3 s antes de que entre la nota que dice «Bajo 200 px… Seedance, el inicio». En el lienzo que ve el espectador la cara de Seedance mide **222 px a 6,0 s** (SCRFD sobre el master, cuadro 144) y 520 px a 11,5 s; la de Kling 172-181 px. Quien estime a ojo cree que Seedance nunca estuvo bajo 200 px y que «el inicio» es un error. Mi medición sobre los clips originales: Kling 115-120 px en 6 de 6 cuadros; Seedance 147, 173, 198 px (cuadros 6, 18, 30), 280 desde el 66.
- **Arreglo (re-render, opcional) o pie (ya está):** «Parecido indicativo. Bajo 200 px (del clip original) la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.» (+3 palabras, 22: pide 8,0 s y tiene 8,04). El pie ya dice «En el clip original (720p)». Si no se re-renderiza, aceptar.

### H6 · BAJA · La placa sigue densa para una pieza muda (decisión de la madre)
- **Dónde:** placa 11,79-20 s.
- **Evidencia.** El escalonado funciona: en píxeles hay cambios reales en 11,88 (límite), 12,38 (toma), 14,67 (brillo), 17,42 (CTA) y los acentos (13,54, 16,04, 19,12), y nunca pasa más de 0,875 s sin un cambio local (la regla 15 se cumple de verdad, no solo por la exención). La lectura nueva es 33 palabras + 5 del CTA en 8,2 s = **4,6 palabras/s** (7,6 en la v1), pero cada nota llega 0,5-2,75 s después de la anterior. Con la regla del proyecto (0,35 s/palabra + 0,3 s por texto), leerlas **una tras otra** pide 6,95 + 2,75 + 2,75 + 2,4 = **14,85 s contra 8,15 s disponibles (55 %)**. Cada ventana individual se cumple porque se cuentan solapadas.
- **Conclusión sobre «4,6 palabras/s»: razonable con voz (L5-L7 dicen toma, brillo y CTA, y solo el límite pide ojos: 6,95 s de 8,04); apretado en la versión muda estricta,** donde el lector que va en orden termina el límite a ~18,8 s y deja sin leer justo «prueba, no regla».
- **Arreglo (decisión de la madre):** si se re-renderiza, entrar «Una toma cada uno» **primero** (7 palabras, 2,75 s) y el límite después (~12,6 s): así lo esencial se lee aunque no se llegue al detalle. Aceptable no hacer nada si la voz entra.

### H7 · BAJA · Voz futura: cronograma sin margen, sin sensibilidad, y L4 no admite retoma
- **Dónde:** `guion-voz.txt`, `qa/alineacion-voz.txt`.
- **Evidencia.** Recalculé a 17 car/s (21, 24, 47, 96, 36, 48, 33 caracteres; 311 con saltos = 305 + 6): coincide con `alineacion-voz.txt` al milésimo. Tabla línea por línea:

  | L | Línea | Car | Voz (s) | Tramo (s) | Hueco | Pantalla durante el tramo |
  |---:|---|---:|---:|---|---:|---|
  | 1 | ¿La cara o la escena? | 21 | 1,24 | 0-1,46 | 0,22 | título |
  | 2 | Misma foto, misma orden. | 24 | 1,41 | 1,46-3,08 | 0,21 | pastilla de Kling desde 1,5 s (antes de que la voz diga Kling) |
  | 3 | Kling: brillo casi igual, la cara baja un poco. | 47 | 2,76 | 3,08-6,08 | 0,24 | voz termina **5,848 s**: el empuje a Seedance empieza a 5,75 s |
  | 4 | Seedance Mini con referencias: la cara sube, pero el encuadre se acerca y la imagen se oscurece. | 96 | 5,65 | 6,08-11,96 | 0,23 | termina 11,730 s; el empuje a la placa es 11,54-11,79 |
  | 5 | Una toma cada uno: prueba, no regla. | 36 | 2,12 | 11,96-14,29 | 0,22 | límite visible; «toma» entra 12,35 (+0,39 s) |
  | 6 | Brillo del cuadro entero: mezcla luz y encuadre. | 48 | 2,82 | 14,29-17,33 | 0,22 | «brillo» entra 14,65 (+0,36 s) |
  | 7 | Seguime: cada semana, una prueba. | 33 | 1,94 | 17,33-20,0 | 0,73 (cola) | CTA desde 17,40 (+0,07 s) |

  Nada se desborda **por construcción**: los tramos salen de la misma estimación. L3 y L4 dicen algo verdadero y suficientemente claro (brillo casi igual / parecido baja un poco / sube con reencuadre / se oscurece); «la cara baja/sube» sigue el vocabulario del título (cara = parecido). El «pero» de L4 solo contrasta con «se oscurece»; el «se acerca» entre medio no es un defecto, es el matiz honesto del reencuadre.
- **Margen cero.** L3 termina 0,052 s antes del tope de 5,9 s y 0,15 s antes del fin del empuje (6,0 s); sus últimas 0,1 s («un poco») suenan con la pastilla de Kling saliendo. Para que L1-L3 quepan en 0-5,9 s con pausas de 0,22 s la voz real tiene que hablar **≥ 16,85 car/s**: justo la estimación. Sensibilidad (misma pausa):

  | car/s | fin de L3 | inicio de L4 | fin de L7 |
  |---:|---:|---:|---:|
  | 18 | 5,55 | 5,77 | 18,26 |
  | **17** | **5,85** | **6,07** | **19,26** |
  | 16 | 6,19 | 6,41 | **20,38 (se sale)** |
  | 15 | 6,57 | 6,79 | 21,65 |

  A 16 car/s (−6 %) L3 termina 0,2-0,3 s después del corte y L7 no cabe en los 20 s. G2 v2 sí traía columnas de ±1 car/s (`voz-caben.txt`); esta pieza no. No es un defecto del master mudo y el plan ya dice «medir las pistas, retemporizar»; pero conviene dejar escrito que el cronograma es el caso central, no un margen.
- **Cupo:** 311 de 381 (hasta el 13-oct 01:17 UTC) deja 70 caracteres. L4 (96) **no admite retoma**: 311 + 96 = 407 > 381; L3, L5 o L6 sí, una vez. Conviene decidir el texto de L4 antes de generar.
- **Arreglo (sin re-render):** cuando se genere, medir la pista de L1-L3 antes de las demás y, si pasa de 5,4 s, quitar 5 caracteres a L2 («Misma foto y orden.», 19) antes que acelerar; documentar en el README la sensibilidad de arriba.

---

## Estado de los 11 hallazgos de la revisión 1

| # | Sev. | Estado | Evidencia mía en el master |
|---:|---|---|---|
| H1 | ALTA | **Resuelto** | Pantalla (cuadro 479, 11,85-20 s): «Parecido indicativo. Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.» y etiqueta «Cara: 139 → 347 px del clip original · reencuadra» (cuadro 182). Con `face-gate.sh` sobre los originales de 720p: Kling 119, 120, 120, 115, 115, 116 px (6 de 6 bajo 200); Seedance 147, 173, 198, 280, 309, 341, 348 px (bajo 200 hasta ~1,3 s). «Todo el clip / el inicio» es verdadero. Residual: H5 (la placa no repite «del clip original»). |
| H2 | MEDIA | **Parcial** | Ya no es pared: desde 11,79 solo las filas; las notas entran de a una (cuadros 285-288, 297-305, 352-356, 418-420) con acento visible. De 7,6 a 4,6 palabras/s. La lectura secuencial estricta sigue siendo 14,85 s contra 8,15 s (H6). |
| H3 | MEDIA | **Resuelto** | Titular «¿La cara o la escena?» en el cuadro 0 (mirado a resolución completa); «Una toma cada uno: prueba, no regla.» en la placa y el pie. |
| H4 | MEDIA | **Resuelto en el plan** (la voz no existe) | Guion sin cifras (`grep -P '\d'` = 0), L3 termina 5,848 s y L4 empieza 6,083 s (lo recalculé); L5-L7 coinciden con sus notas (+0,39, +0,36, +0,07 s). Las dos líneas desviadas del texto de la madre son verdaderas y claras. Residual: margen de 0,05 s y sin sensibilidad (H7). |
| H5 | MEDIA | **Resuelto** | En 6 instantes (6,6; 7,6; 8,6; 9,6; 10,6 y 11,4 s) el letrero «DVOSS/DMOSS» de la fuente queda **ilegible** (mancha oscura y borrosa); el letrero aparece en la fuente desde el cuadro 28 del clip (≈ 6,9 s en el master: el pie dice «de 7 a 11,5 s», correcto), se ve nítido desde el 32 y siempre cae dentro de la caja de x 0-440, y 0-290. Píxeles que cambian más de 30 niveles contra la fuente: x 0-376, y 0-260; fuera de la caja la diferencia media es 4,3-4,8 (ruido de códec y escalado). Pelo y cara: como máximo 62 píxeles oscuros de esa esquina (pelo, marco) cambiaron más de 25 niveles, y 3 en el instante final. A 390 px se ve como una mancha suave sobre el edificio, no como un parche feo. Pie: «Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe. Lo difuminé en el video.» |
| H6 | BAJA | **Parcial** | Enteros y escalas en pantalla: «156 → 155 (−1)», «146 → 112 (−34)», pastillas «brillo −1» y «brillo −34», «brillo 0 a 255» en cada fila. Kling es exacto; el 146 es un doble redondeo de 145,467 (H4). |
| H7 | BAJA | **Resuelto** | Cada fila lleva «brillo 0 a 255 · parecido 0 a 1» bajo sus barras, con el color de la barra; largos medidos en píxeles: 0,607, 0,720, 0,438 y 0,800 de la pista, iguales a 155/255, 0,72, 112/255 y 0,80. |
| H8 | BAJA | **Resuelto y ampliado** | El aviso de las 2 de 8 fotos está en pantalla (6,5 s) y en el pie; los ids R1 = `a7cfb766` y R3 = `d7d6d36a` coinciden con el manifiesto. Con matices nuevos: H1, H2, H3. |
| H9 | BAJA | **Resuelto** | README con su exención. Mi barrido: en los clips ningún tramo quieto ≥ 4 cuadros (diferencia media mínima 0,56); en la placa, con cambios locales (> 6 niveles en > 300 px), nunca más de 0,875 s sin un cambio. |
| H10 | BAJA | **Sin acción (de acuerdo)** | Ambo dentro del canon (`LUCIA.md` §0); la pieza no dice ni insinúa rubro. |
| H11 | BAJA | **Parcial** | SHA nuevo, `index.html` md5 y fuentes en README, verificados; ArcFace contra fuente escalada y nativa documentado en `qa/arcface-final.txt`; falta copiar el master a `videos/lucia-entrega/` (no hay `p9`): por diseño, tras la aprobación de la madre. |

---

## Qué se arregla sin re-render y qué lo pide

| Cambio | Hallazgo | Re-render |
|---|---|---|
| Frase del sesgo en el pie (sin la lectura al revés, con «mismo cuadro inicial») + `build.mjs` l.67 + mutaciones | H2 | **No** |
| Sensibilidad ±1 car/s y decisión sobre L4 en README/guion | H7 | **No** |
| Marca del aviso en la fila de Seedance de la placa | H1 | **Sí** (recomendado) |
| Aviso en pantalla: «fotos con que se mide» + «ventaja ≈ 0,03» | H3 | Sí (opcional, junto con H1) |
| «145,5 → 111,8» o solo el cambio en la placa | H4 | Sí (opcional) |
| «(del clip original)» en la nota del límite | H5 | Sí (opcional) |
| Orden «toma» antes del límite | H6 | Sí (decisión de la madre) |

Si la madre re-renderiza, que sea **un solo ciclo** con H1+H3+H4+H5+H6 (0 cr, ~1,5 min de render). Después: repetir `face-gate.sh` master↔fuente (el desenfoque y el resto no cambian los píxeles medidos), PSNR, zona segura (la placa con una línea más termina cerca de 1470, debajo de 1490) y SHA nuevo.

---

## Lo que verifiqué y está bien

- **Master.** SHA-256 completo = `4e0593ba…6ca46429` (README y `qa/sha-master.txt`). H.264 High yuv420p 1080×1920 24 fps, 480 cuadros, 20,000 s; AAC LC 48 kHz estéreo, `volumedetect` −91,0 dB (media y máximo). `index.html` md5 `81658e47cb092712732b9d6aa8ece78e` = README. SHA de `assets/m1.mp4` y `m4-full.mp4` = los originales (`b190e879…`, `346173da…`).
- **Cifras, una por una.** 0,79 → 0,72 y 0,71 → 0,80 (PROCEDENCIA l.97); 7,5 y 6 créditos (pie); brillo: Kling 156,041 → 155,077 (Δ −0,96) y Seedance 145,467 → 111,754 (Δ −33,71), repetido con `signalstats`; «139 → 347 px del clip original» (medí 147 px en el cuadro 6 y 348 px en el 138 del clip; los 139 y 347 son los de t = 0 y 5,9 s de la medición sin refs y no los repetí en esos instantes); 2 de 8 fotos (R1, R3); ≈ 0,03 (0,026); «0,07 y 0,09» del pie son 0,791 − 0,721 y 0,801 − 0,707 redondeadas; 200 px y ±0,03. Ninguna cifra fuera de PROCEDENCIA l.97, la medición de luz y la medición sin refs. El 0,82 de Kling O3 no sale.
- **Marca, con el segundo.** Rótulo «Lucía Antelo · personaje IA de Onia» a 40 px en el cuadro 0 (y 300-368); título en el cuadro 0 (y 760-858). Primer número: pastilla de Kling a media opacidad en el cuadro 37 (1,54 s) y plena en el 38 (1,58 s), antes de los 3 s. **CTA «Seguime: cada semana, una prueba.»:** cuadro 418 a media opacidad, plena desde el 419 hasta el 479 = 61 cuadros = **2,54 s** (≥ 2,4). Pie abre con «Personaje hecho con IA» y contiene «Nombro lo que uso; no es una recomendación pagada.» (`startsWith` verdadero). Cero producto de Onia, cero Sergio, cero profesión; solo nombres de la lista válida (Kling 3.0 std, Seedance 2.0 Mini + referencias, Higgsfield, ArcFace). `node scripts/lucia-prohibidas.mjs videos/lucia-p9-luz-cara/pie.txt videos/lucia-p9-luz-cara/guion-voz.txt` → **exit 0**, 0 coincidencias; también sobre los 10 textos de pantalla de `plan.json` (exit 0).
- **Zona segura (píxeles).** Pastillas y 300-1439; placa 292-1439 (el contenido termina en 1428; hasta 1439 llega el acento del CTA; ninguna fila sobre 280); nada bajo 1490; margen derecho de 80 px. A 390 px de ancho (cuadros 0, 182, 479) todo es legible: texto de 40-44 px queda en ~14-16 px, la escala mono de 34 px en ~12 px (justo).
- **Cuadros.** Cero cuadros vacíos (desviación estándar mínima 30,8; luma media mínima 27,5). Saltos de píxeles solo en los dos empujes (cuadros 139-144 y 278-282). Los 15 cuadros de las dos costuras son un deslizamiento **rígido** (rótulo, título y pastillas viajan con su clip, sin rendija ni columna de fondo). Clips sin quietos (diferencia media mínima 0,56; mediana 1,92). Sin texto cortado ni pisado: huecos de 23,6-23,8 px entre pastillas de m4, 12 px entre filas y 40 px entre notas de la placa. Cara y pastillas: en la toma de Seedance las pastillas caen sobre camisa, mano y teléfono; el mentón queda a ≥ 58 px.
- **Entradas.** Aviso: cuadro 155-156 vacío, 157 a media opacidad, 160 pleno (6,5-6,67 s). Placa: cuadro 283 solo las dos filas; límite desde 285; toma 296-297; brillo 351-353; CTA 418-419. Cada entrada con fundido corto + 18 px + acento, sin parpadeo ni salto fuera de lo previsto.
- **ArcFace, 13 pares master ↔ fuente nativa de 720p** (`face-gate.sh`; centroide, master/fuente): m1 0,793/0,791 · 0,797/0,797 · 0,745/0,762 · 0,735/0,738 · 0,709/0,708 · 0,664/0,680; m4 0,789/0,793 · 0,772/0,768 · 0,790/0,791 · 0,754/0,747 · 0,783/0,790 · 0,811/0,812 · 0,801/0,801. **Diferencia máxima 0,017** (m1 cuadro 48), igual a `qa/arcface-final.txt` (0,017); regla ≤ 0,02, cumple. Coinciden además, cifra por cifra, las ocho medidas comunes del master con ese archivo (0,797, 0,745, 0,735, 0,709, 0,790, 0,754, 0,783, 0,811). El desenfoque de la esquina no deforma la cara. PSNR del ROI (y 400-700): m1 cuadro 60 = 38,90 dB, m4 cuadro 60 = 37,54 dB (idénticos a `qa/psnr-clips.txt`).
- **Texto de voz.** `guion-voz.txt` sin dígitos ni decimales; 311 caracteres con saltos (cupo 381); dice algo verdadero, no nombra Sergio, rubro ni producto.
- **Pie.** 1433 caracteres (límite de Instagram 2200); abre con la declaración IA; los hechos (2 clips, misma foto y orden, créditos, −1, −34, 0,79 → 0,72, 0,71 → 0,80, letrero «de 7 a 11,5 s», 3 imágenes, R1 y R3) son verdaderos; el «lo superan» de las dos diferencias es defendible (0,07 y 0,09 contra ±0,03).

## Lo que no pude verificar

- **Voz:** no existe. H7 es un cálculo sobre la tasa de 17 car/s (G1 v2) y una sensibilidad mía; la pronunciación de «Kling», «Seedance» y «Mini» por la voz Marcela no se midió.
- **Los parámetros del job `dd2d7c91`** (que `start_image` = K1 y las 3 referencias son `a7cfb766`, `d7d6d36a` y `abe2e6bd`): están solo en el README y en la cabecera de `medicion-sin-refs-entrada-20261011.txt`, no en PROCEDENCIA. Verifiqué que R1 y R3 de ese manifiesto llevan esos ids; no leí el job en Higgsfield (no usé herramientas de Higgsfield).
- **La medición sin refs** (`parecido_sin_refs.py`): leí el archivo de salida y su aritmética (exceso −0,026 = −0,042 − (−0,017)); no la repetí.
- **Instagram:** no simulé la interfaz del reel; los botones del borde derecho (x > ~960) podrían rozar el final de las pastillas de 80 px de margen. Solo simulé 390 px de ancho.
- **`hyperframes check`, `build.mjs`, `validar-mutaciones.mjs`, `medir-dom.mjs`, `ventanas.mjs`:** necesitan descargar o escriben en `qa/`; leí sus salidas y las contrasté con medición propia donde fue posible (ventanas contadas a mano, zona segura, CTA, quietos, costuras).
- Que no se haya tocado nada fuera de esta carpeta (sin git, no lo puedo comprobar).
- Reproducibilidad bit a bit del render: no se renderizó dos veces.
