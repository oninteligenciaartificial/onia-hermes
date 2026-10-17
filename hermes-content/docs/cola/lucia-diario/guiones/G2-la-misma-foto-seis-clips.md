# G2 · «¿Quién pierde la cara?» Seis clips con la misma orden — guion v2 (≈ 27,8 s, muda, lista para voz)

> **Este es el guion vigente: la v2 de ≤ 30 s** (`videos/lucia-g2-v2/`, re-corte mudo del 11-oct con la revisión 1 aplicada). La v1 de 58 s (`videos/lucia-g2/`, 12 bloques de 3-5 s con los seis clips completos, «La misma foto, seis clips») quedó reemplazada: el nombre del archivo es el de la v1 y se conserva para no romper referencias.
> **D-N1 (Sergio Urcullo, 11-oct):** las herramientas SÍ se nombran, como uso propio y no como recomendación pagada; el pie lleva «Nombro lo que uso; no es una recomendación pagada.»
> **Estado: PARA VER POR LA MADRE (preview 360p en `videos/lucia-g2-v2/qa/`). Sin voz generada** (la voz se pone cuando haya cupo; abajo, el conteo). No se publica sin su aviso.
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Costo: 0 cr más.** Los 6 clips ya se generaron y se pagaron el 8-oct (lote V, 47 cr; Sergio Urcullo: *«tenés derecho a usar todo lo que querrás»*, con tope de 97 cr que se fijó la sesión). Registro: `v4/PROCEDENCIA.jsonl`, línea 97 (la fuente única de las cifras y los créditos de este guion).
> - No muestra ni promete ninguna función de Onia.

## Qué aprende quien lo ve

**Misma orden en seis clips: no todos conservan la cara, y lo que la conserva cambia la escena.** De los cinco que parten de la misma foto (K1), Kling 3.0 std pierde parecido (0,79 a 0,72) y Seedance 2.0 Mini queda bajo el piso de 0,70 (0,69 a 0,64); Kling 3.0 pro hace lo de Kling 3.0 std (0,81 a 0,74); Seedance 2.0 Mini + referencias sube (0,71 a 0,80) pero reencuadra e inventa un letrero; y Cinematic Studio 3.0, también con la foto sola y a 20 créditos, mantiene la cara dentro del ruido (0,79 a 0,77). Kling O3 no recibió foto de arranque, solo cinco fotos de referencia: sostiene la cara (0,80 a 0,82) pero inventa el cuarto y el plano.
**Lo que NO se afirma:** que «la foto sola pierde la cara» como regla (Cinematic Studio 3.0 la contradice: 0,79 a 0,77 cae dentro del ruido de ±0,03), que pagar más arregle o no arregle la caída (Kling 3.0 pro a 9 créditos no la arregló y Cinematic Studio 3.0 a 20 créditos sí mantuvo la cara: con una toma por clip no hay regla de precio) ni que un motor sea «mejor».

## Molde y orden

`FORMULAS-REFERENTES.md` **F4**: misma tarea en varios niveles. La orden es una sola, escrita literal en el pie, para que quien mira pueda repetir la prueba: *«She slowly lifts her eyes from the phone to the camera and gives a small knowing smile, the phone stays in her hands. Subtle handheld camera, natural morning light, no cuts.»* Cinco de los seis clips parten de la foto K1 (`start_image`); Kling O3 recibió solo cinco fotos de referencia y **ninguna foto de arranque** (`kling_o3_image_reference_5_refs`, nota de PROCEDENCIA: «sin start_image: inventa el cuarto y el plano»). Por eso la pieza dice **«misma orden»** y no «misma foto».

## Evidencia (medida el 8-oct con `scripts/face-gate.sh`, ArcFace contra 8 fotos oficiales de 0 a 1; piso 0,70 que eligió Lucía; una toma por clip)

| Clip | Entrada | Créditos | Parecido t=0 | a mitad | al final (5,9 s) | Se ve en los cuadros |
|---|---|---:|---:|---:|---:|---|
| Kling 3.0 std (el clip K1 ya pagado) | foto | 7,5 | 0,79 | 0,73 | 0,72 | Misma escena que la foto; la cara pierde parecido sola |
| Kling 3.0 pro | foto | 9 | 0,81 | 0,77 | 0,74 | Mismo movimiento que el std, más nítido (1080p); 1,5 créditos más no arreglan la caída |
| Seedance 2.0 Mini | foto | 6 | 0,69 | 0,63 | 0,64 | El plano se acerca y **cambia el edificio y la calle** (balcones y palmeras que no están en la foto); la cara queda **bajo el piso** |
| Seedance 2.0 Mini + referencias | foto + 3 referencias | 6 | 0,71 | 0,73 | 0,80 | Sube; pero el plano se acerca (la cara crece 2,5 veces) y **aparece un letrero inventado** en la torre |
| Kling O3 | solo 5 referencias, sin foto de arranque | 6 | 0,80 | 0,81 | 0,82 | Sostiene la cara; **inventó otro cuarto** y un plano que se acerca |
| Cinematic Studio 3.0 (4 s a 720p) | foto sola | 20 | 0,79 | 0,79 | 0,77 | El plano se acerca; 0,79 a 0,77 queda dentro del ruido (±0,03 con caras de 120-180 px); 5 créditos por segundo (el Kling 3.0 std cuesta 1,25), o sea 4× por segundo y 2,7× por clip |

- **Rango del parecido final de los seis:** 0,644 (Seedance 2.0 Mini) a 0,824 (Kling O3), o sea «0,64 a 0,82». Es el número del gancho.
- **Los créditos son de Higgsfield** y los precios son los del 8-oct. Clips en `v4/prueba-motores-20261008/`; los originales se recuperan con `job_display` a 0 cr.
- **Límites del método (van en el pie):** se ven los primeros 2,8 a 4,5 s de cada clip y el parecido «final» es el del segundo 5,9; las caras miden de 89 a 179 px en el clip crudo (el propio gate marca «poco confiable» bajo 200 px), así que los números son orientativos (±0,03). El puntaje no distingue una pequeña mejora (0,80 a 0,82) del ruido: por eso la pieza dice «sostiene» y no «mejora».
- **Lo que el video NO debe afirmar:** que un motor sea «mejor» en general (es una toma por motor), que 0,70 sea una frontera objetiva ni que la foto sola pierda la cara como regla. El pie y una tarjeta lo dicen: *«Una toma: es una prueba.»*

## Estructura v2 (≈ 27,8 s, 24 fps, 1080x1920)

**Tarjetas (12, ≤ 6 palabras, voseo cruceño, 0,35 s por palabra + 0,3 s de lectura medidos en el DOM) y qué se ve.** Tiempos de la versión sin voz (voz estimada a 17 caracteres por segundo); con voz real se re-derivan desde las duraciones de cada pista.

| t (s) | Imagen | Tarjeta |
|---|---|---|
| 0 – 3,75 | **GANCHO.** Foto K1 a pantalla completa con empuje lento hacia la cara; rótulo «Lucía Antelo · personaje IA de Onia» a 40 px desde el cuadro 0 hasta los 3,0 s; las 6 miniaturas de los clips; pastilla **«parecido final: 0,64 a 0,82»** desde ≈ 1,0 s (el resultado antes de los 3 s) | c1 «¿Quién pierde la cara?» (cuadro 0) → c2 «Misma orden. Seis clips.» |
| 3,5 – 8,5 | **REGLA.** 5 de las 8 referencias, escala de 0 a 1 y marca en 0,70 | c3 «Se mide contra 8 fotos suyas.» → c4 «Mi piso: 0,70.» |
| 8,2 – 11,0 | **Kling 3.0 std** (clip a 1×, el cuadro 0 es la foto K1); dato «parecido 0 s: 0,79 → 5,9 s: 0,72» | c5 «Kling 3.0 std · 7,5 créditos» |
| 10,75 – 14,0 | **Seedance 2.0 Mini**; dato «0,69 → 0,64» y sello «bajo el piso» | c6 «Seedance 2.0 Mini · 6 créditos» |
| 13,8 – 18,25 | **Kling O3**; dato «0,80 → 0,82» | c7 «Kling O3 · 6 créditos · solo referencias» → c8 «Inventó el cuarto.» |
| 18,0 – 25,0 | **Lección.** Barras de los finales de los tres clips que se ven, en el orden de aparición (no ordenadas por puntaje), marca en 0,70; rótulos «foto sola» / «foto sola» / «referencias» que cambian a «mantiene el cuarto» / «cambió el plano» / «inventó el cuarto»; nota «Final = segundo 5,9, que no se ve entero.» | c9 «Con referencias, la cara se sostiene.» → c10 «Pero inventa la escena.» → c11 «Una toma: es una prueba.» |
| 24,75 – 27,8 | **CIERRE.** Clip K1 de 2,25 a 5,25 s (Lucía mira a cámara y sonríe) | c12 «Seguime: cada semana, una prueba.» (≥ 2,4 s en pantalla) |

**Sale / no sale (los tres clips que no caben y qué se hace con ellos).** En pantalla salen tres; los otros tres no pueden quedar insinuados sin decirse, así que el **pie** los nombra con sus números y dice que no cupieron:

| Clip | Créditos | Entrada | Parecido (inicio a final) | Dónde va |
|---|---:|---|---|---|
| Kling 3.0 std | 7,5 | foto | 0,79 a 0,72 | pantalla y pie |
| Seedance 2.0 Mini | 6 | foto | 0,69 a 0,64 | pantalla y pie |
| Kling O3 | 6 | solo referencias | 0,80 a 0,82 | pantalla y pie |
| Kling 3.0 pro | 9 | foto | 0,81 a 0,74 | solo el pie (confirma a Kling 3.0 std) |
| Seedance 2.0 Mini + referencias | 6 | foto + 3 referencias | 0,71 a 0,80 | solo el pie (confirma «con referencias se sostiene», pero reencuadra e inventa un letrero) |
| Cinematic Studio 3.0 | 20 | foto sola | 0,79 a 0,77 | solo el pie (la foto sola mantuvo la cara dentro del ruido: no se afirma que la foto sola pierda) |

### Voz (14 líneas, una por tramo; la pieza va muda hasta que haya cupo)

La voz se mide en **caracteres**, a ≈ 17 por segundo (G1 v2: 320 caracteres ≈ 19 s), no en palabras. Cada línea se escribe para que quepa en su tramo sin pisar a la siguiente y con ≤ 0,3 s de pausa (`videos/lucia-g2-v2/qa/voz-caben.txt`, tabla caben / no caben).

| L | Línea | Car |
|--:|---|--:|
| 1 | «¿Quién pierde la cara?» | 22 |
| 2 | «Seis clips con la misma orden.» | 30 |
| 3 | «Se mide contra ocho fotos suyas.» | 32 |
| 4 | «De cero a uno.» | 14 |
| 5 | «Mi piso: cero setenta.» | 22 |
| 6 | «Kling tres, foto sola: pierde parecido.» | 39 |
| 7 | «Seedance Mini, foto sola.» | 25 |
| 8 | «Queda bajo el piso.» | 19 |
| 9 | «Kling O tres, solo referencias: sostiene.» | 41 |
| 10 | «Pero inventó el cuarto.» | 23 |
| 11 | «Con referencias, la cara se sostiene.» | 37 |
| 12 | «Pero el motor inventa la escena.» | 32 |
| 13 | «Una toma por clip: es una prueba.» | 33 |
| 14 | «Seguime: cada semana, una prueba.» | 33 |

- **Total: 402 caracteres con espacios** (el cupo de la pieza es 450; el cupo de voz que queda hoy es **381 hasta el 13-oct 01:17 UTC**). Hay que esperar la renovación del cupo (o recortar ≈ 21 caracteres) y, con retomas (×1,3), son ≈ 520.
- Se dice «Kling tres» y «Kling O tres» (3.0 std y O3); la pantalla trae el nombre completo. «Lo elegí yo» está en el pie y en «mi piso», no en la voz. La voz no dice «misma foto» (no es cierto para Kling O3).
- Después de la última línea quedan ≈ 0,85 s sin voz: el CTA se queda en pantalla ≥ 2,4 s y se lee.

## Pie

*«Personaje hecho con IA: Lucía Antelo, por @oniahq. Misma orden en seis clips de Higgsfield (créditos de Higgsfield, precios del 8-oct): cinco partieron de la misma foto y Kling O3 fue solo referencias, sin foto de arranque. La orden: "She slowly lifts her eyes from the phone to the camera and gives a small knowing smile, the phone stays in her hands. Subtle handheld camera, natural morning light, no cuts." Medí con ArcFace cuánto se parece la cara a ella, de 0 a 1, contra 8 fotos oficiales suyas. Mi piso es 0,70 y lo elegí yo. En el video van tres: Kling 3.0 std (7,5 créditos), con la foto sola, pierde parecido (0,79 a 0,72); Seedance 2.0 Mini (6 créditos), con la foto sola, queda bajo el piso (0,69 a 0,64) y cambia el plano; y Kling O3 (6 créditos), solo con referencias, sostiene la cara (0,80 a 0,82) pero inventa el cuarto. Los otros tres no cupieron: Kling 3.0 pro (9 créditos, 0,81 a 0,74), Seedance 2.0 Mini + referencias (6 créditos, 0,71 a 0,80) y Cinematic Studio 3.0 (20 créditos, clip de 4 s, con la foto sola, 0,79 a 0,77: dentro del ruido). Límites: se ven los primeros 2,8 a 4,5 s de cada clip y el parecido final es el del segundo 5,9; las caras miden de 89 a 179 px en el clip, así que los números son orientativos (±0,03). Una toma por clip: es una prueba, no una regla. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

(El texto vigente del pie vive en `videos/lucia-g2-v2/pie.txt`, que `build.mjs` valida contra PROCEDENCIA; si difieren, manda ese archivo.)

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, a 40 px, y el pie abre con «Personaje hecho con IA». Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados de negocio, sin testimonios, sin clientes.** Las únicas cifras son medidas (créditos cobrados por Higgsfield y parecido).
- **Sin producto de Onia.** **Herramientas y plataforma (D-N1):** se nombran las herramientas que se usan (Kling 3.0 std, Seedance 2.0 Mini y Kling O3 en pantalla y voz; las otras tres, Higgsfield —la plataforma de los créditos— y ArcFace —con qué se mide— solo en el pie) como uso propio, no como recomendación pagada. Siguen prohibidos los logos, las capturas de interfaces de terceros y cualquier «el mejor» o recomendación general.
- **El letrero inventado del Seedance 2.0 Mini + referencias** («DAISS») es texto de la IA y esa tarjeta no sale en pantalla; si algún día entra, se marca con un aro y se dice que es inventado.
- **Antes de renderizar:** `scripts/build.mjs` valida los números contra PROCEDENCIA, las reglas de lectura y el pie; `grep-prohibidas.mjs` revisa la lista de `editor-videos` § «Reels de Lucía» más las frases de «el mejor» y «la foto sola pierde» como regla.
- **Publicación:** como no muestra ni promete una función del producto, pasa por el control de calidad y se publica sin pedir el OK pieza por pieza (`CLAUDE.md` § «Qué se publica sin preguntar»), con la salvedad de que hay que confirmar antes los nombres comerciales exactos (no se consultó Higgsfield en vivo). Después se le avisa a Sergio Urcullo con el enlace. La vía real es `ig-reel.mjs --cuenta lucia`, que corre en el VPS: la madre.
