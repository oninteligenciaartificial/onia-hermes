# Revisión 1 · Carrusel C2 v2 «Seis motores de imagen, una cara» (para guardar, miércoles; prueba estricta, 11-oct-2026) — revisor independiente

**Veredicto: APROBADO CON CAMBIOS (ninguno bloquea por falsedad; recomiendo corregir H1 a H5 antes de publicar).** 11 hallazgos: **0 ALTA · 5 MEDIA · 6 BAJA.**

**Nada de lo que dicen las láminas o el pie es falso**: cada cifra (créditos, parecidos, ±0,03, 0,70, «entre 0,03 y 0,09», «dos pares») coincide con `PROCEDENCIA.jsonl` l.97 y con la sección «PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN». «Pagar más no ayudó» sigue en pie con la prueba estricta. Lo que queda es de **proporción y claridad**, y se concentra en una idea: **el aviso del sesgo llega tarde y a medias.** (H1) los números de las láminas 2 a 4, con su veredicto contra el piso, se leen **tres láminas antes** del aviso y el pie lo trae recién en el carácter 415 (la parte visible llega a ≈ 125); (H2) la lámina 5 cuenta solo la mitad tranquilizadora (el orden casi no cambia) y calla la otra (todos los valores bajan de 0,03 a 0,09, que es del tamaño del ruido o más); (H3) esa misma lámina usa de fondo la imagen donde el efecto se ve más claro (casi una copia de una de las fotos de entrada) sin decirlo. Y (H5) «para guardar» no trae nada guardable: no hay tabla ni «la orden exacta».
**Sin re-render (solo el pie, `caption` del brief):** H1, H5 (la lista), H6 (parte del pie), H11. **Piden re-render (0 cr):** H2 y H3 (lámina 5), H4 (lámina 4), H6, H7, H9, H10 (láminas 6, 3, 1 y 4); H8 es decisión.

**Cómo revisé.** Brief y pie completos; `PROCEDENCIA.jsonl` l.93, 95, 96, 97; la sección estricta (l.329 en adelante) y su tabla por imagen; `PLAN.md` §2 y §4-bis; `SKILL.md` §0; `LUCIA-HIGGSFIELD-IDENTITY.json`; `prueba-motores-20261008/README.md`. Las seis láminas a **resolución completa** (Read de cada PNG de 1080×1350), la hoja de contacto, y recortes a 100 % de los cuatro puntos de riesgo (título de la 2 sobre la taza, título de la 5, cuerpo de la 6 sobre la taza, píldora de la 4 sobre la cara). **Simulación a 390 px** de ancho de las seis (`convert -resize 390x`, hoja propia). **Contraste** medido en título y cuerpo de cada lámina (relación de luminancia WCAG contra el fondo local, mediana y percentil 90). **Face-gate** (`face-gate.sh`, venv del scratchpad, 0 cr) sobre los seis fondos. `lucia-prohibidas.mjs` sobre un `.txt` con título, pie, hashtags y el texto de las seis láminas con sus `alt_text` y sobre el pie solo. Comparé a ojo la imagen de la lámina 5 con `R3_casi_frontal.png`. **No usé git, no generé nada, no gasté créditos, no publiqué, no instalé nada.** Lo único que escribí en el repo es este archivo (intermedios en mi scratchpad: `c2rev/`).

---

## Hallazgos

### H1 · MEDIA · El aviso del sesgo no está en la parte visible del pie ni en las láminas donde salen los números; solo en la lámina 5 y en el 3.er párrafo del pie
- **Dónde:** pie (`caption`): «Ojo con el número…» empieza en el **carácter 415** (de 961); «Personaje hecho con IA» sí está en el 0 y «Nombro lo que uso…» en el 836. Los primeros ≈ 125 caracteres (lo que se ve antes del «más…») terminan en «…en seis motores de im»: dicen que se probaron seis motores y no que el número tiene un problema. Láminas 2, 3 y 4: muestran 0,81 · 0,74 · 0,70 · 0,69 · 0,66 · 0,79 · 0,83 y «bajo mi piso» **sin aviso**; el aviso (lámina 5) es la 5.ª de 6.
- **Evidencia.** El estándar de este mismo carril, fijado en la revisión 3 de G2, es que el aviso acompañe al número o, al menos, esté **dentro de lo visible del pie** (allí, caracteres 51-121). Aquí quien mira solo las láminas 2 y 3 (o guarda/comparte una sola) se lleva «Seedream 5.0 Pro cumple, FLUX y GPT no» con los números que el propio equipo dice que **pueden estar inflados** (los seis motores recibieron R1, R3, R6 y R7, que son 4 de las 8 con que se mide). Lo mismo para quien lee solo la parte visible del pie.
- **Juicio.** No es oculto (está en la lámina 5 y en el pie) pero está en el lugar más barato de pasar por alto. Es el hallazgo de más valor y el más barato de arreglar.
- **Arreglo SIN re-render (pie).** Abrir con el aviso, dentro de los primeros ≈ 125 caracteres, y dejar el resto igual. Propuesta (113 caracteres, queda dentro): «Personaje hecho con IA: Lucía Antelo, de @oniahq. Ojo: los números de esta prueba salen inflados (explico abajo).» **Use «pueden estar inflados» si prefiere ceñirse a la medición**: el propio archivo advierte que un centroide de 4 fotos puntúa distinto de uno de 8 y que «la columna B\*-A no aísla una fuga»; la **dirección** del sesgo es cierta, el **tamaño** no se conoce. Con re-render (opcional): una línea chica «puede estar inflado: ver lámina 5» en las láminas 2 y 3.

### H2 · MEDIA · La lámina 5 es verdadera pero minimiza y no se entiende sola
- **Dónde:** lámina 5, cuerpo: «Piso 0,70: lo elegí yo. Ruido ±0,03. Los seis motores vieron 4 de las 8 fotos con que se compara. Con solo las otras 4, se cruzan dos pares, dentro del ruido.»
- **Evidencia.**
  1. **Es exacta.** Con R2, R4, R5 y R8 en la escena K1 se cruzan **exactamente dos pares** (Seedream 4.5 ↔ Kling O1 Image, 1.º y 2.º; Seedream 5.0 Pro ↔ FLUX 3, 4.º y 5.º) y los dos están dentro del ruido (diferencias +0,022 y +0,006). Por media de escenas también cruzan dos pares (Seedream 5.0 Pro ↔ FLUX 3 y Kling O1 ↔ GPT Image 2.5, +0,006 y +0,020).
  2. **Minimiza.** Cuenta solo lo tranquilizador (el orden casi no cambia) y **omite que los valores bajan** de 0,03 a 0,09 (media −0,059 en 10 imágenes), caída **igual o hasta tres veces el ±0,03** que la lámina cita. El pie sí lo dice («los valores bajan entre 0,03 y 0,09»); la lámina, que es lo que se guarda, no. «Dentro del ruido» al final se lee como «todo está dentro del ruido».
  3. **No dice cuál par es uno de los cruzados.** Uno es el de arriba: Seedream 4.5 (la que ya uso) y Kling O1 Image (el más barato) **intercambian el 1.º y el 2.º lugar**; con las 4 fotos limpias Kling O1 queda primero (0,753 contra 0,731). La lámina 4 dice «el más barato la perdió» y la 2 «la que ya uso»: el lector no sabe que, medido sin las fotos de entrada, los dos quedan empatados arriba.
  4. **Jerga.** «vieron» (los motores recibieron las fotos como referencia de entrada), «se cruzan dos pares» (¿pares de qué?, hay que leerlo como «dos motores intercambian puesto»), «las otras 4» (hay que recordar «las 8» de la lámina 2). No dice que la **comparación entre motores es pareja** (todos tuvieron la misma ventaja) y que lo sesgado es el **número absoluto**, ni que por eso no hay que leer el 0,70 como aprobado/desaprobado.
- **Arreglo (re-render, 0 cr).** Cuerpo de ≈ 210 caracteres (5 líneas, ver «Lo que pide el re-render» abajo): «Piso 0,70: lo elegí yo. Ruido ±0,03. Los seis motores recibieron 4 de las 8 fotos con que se mide, así que el número puede salir inflado. Con solo las otras 4 bajan de 0,03 a 0,09 y dos motores se cruzan, dentro del ruido.» (≈ 211 caracteres; si 5 líneas no caben, quitar «Piso 0,70: lo elegí yo.», que ya está en la lámina 2). Cambia «vieron» por «recibieron» y suma «pueden salir inflados» + «bajan» + «se cruzan dos motores».

### H3 · MEDIA · El fondo de la lámina 5 es casi una copia de R3 (una de las fotos de entrada), sin decirlo; ese mismo caso infla el «0,83» de la lámina 4
- **Dónde:** lámina 5 (fondo `img-omni-image-k4cafe-dad464de.jpg`, Kling O1 Image, escena K4 café) y, por arrastre, el «0,83» del cuerpo de la lámina 4.
- **Evidencia.** Comparé la imagen con `videos/lucia-g4-v2/assets/refs-orig/R3_casi_frontal.png` (una de las seis entradas): **misma pose** (autorretrato, cabeza apoyada en la mano), **mismo encuadre y entorno** (ventana blanca a la derecha, laptop abierta a la izquierda, taza terracota detrás, mismo pelo mojado); cambia la ropa (el ambo que sí se pidió) y entra la taza blanca. En la tabla de la medición, coseno de esa imagen con **R3 = 0,927**, contra 0,56-0,73 con las demás referencias; ninguna otra de las diez imágenes pasa de 0,82 con ninguna referencia (el máximo es Seedream 4.5 K4: R7 0,812 y R3 0,793). Con el centroide sin R3, B\* = 0,743 contra 0,831 (A).
- **Juicio.** El 0,83 de Kling O1 en K4 es **cierto y medido** (lo repito: 0,834 con el face-gate), pero describe un motor que **repitió una foto de entrada** más que uno que «sostuvo la cara en una escena nueva». La lámina 5 es justo la de «ojo con el número» y muestra, sin rotular, el caso que mejor lo explica. Como está, el lector ve un retrato espléndido como si fuese un resultado cualquiera.
- **Arreglo.** (a) **Sin re-render**, una frase en el pie: «En una de las escenas Kling O1 Image casi repitió la pose de una de las fotos que le di.» (≈ 105 caracteres). (b) **Con re-render**, cambiar el fondo de la lámina 5 por otra imagen del lote (p. ej. la K4 de Seedream 4.5, que ya está en la 6, o la K1 de Kling O1 Image) o aprovecharla a propósito con un rótulo «copia casi la foto de entrada». Es decisión de la madre: la imagen es bella y no es incorrecta.

### H4 · MEDIA · Lámina 4: «El más barato la perdió» sin proporción, y «en el café» no dice cuál café
- **Dónde:** lámina 4, titular y cuerpo: «0,5 créditos: 0,79 · 0,35 · 0,83. En el café salió otra persona: esa imagen no es Lucía.»
- **Evidencia.**
  1. **Proporción.** Kling O1 Image perdió la cara **una vez de tres** (K2 café mostrador, 0,354). En las otras dos quedó **dentro del ruido de Seedream 4.5** (0,794 contra 0,806; 0,831 contra 0,839) a la mitad de precio, y con la prueba estricta es **1.º en K1** (+0,022, dentro del ruido). El titular («la perdió») es verdadero y el pie lo dice bien («en una de tres»), pero en la lámina «una de tres» solo se deduce de tres números sin rótulo. Mi lectura: es titular selectivo, no falso; con H3 (la 3.ª escena es casi copia) el cuadro completo no favorece a Kling, pero tampoco es «la perdió» a secas.
  2. **«En el café» es ambiguo.** Se probaron **dos cafés**: K2 (mostrador, la que perdió la cara) y K4 (teclado). La lámina siguiente (5) es **la otra imagen de café de Kling O1 Image, y sí es Lucía**. Quien pasa de la 4 a la 5 lee «en el café salió otra persona» y a continuación ve a Lucía en un café con el mismo motor, sin que nada lo explique. La píldora dice «Kling O1 Image · café» en singular.
- **Arreglo (re-render, 0 cr).** Titular «El más barato *la perdió una vez*» (cabe en la caja verde) y cuerpo «0,5 créditos: 0,79 · 0,35 · 0,83. En el café del mostrador salió otra persona: esa imagen no es Lucía.»
- Pie (sin re-render): ya dice «en una de tres»; no hace falta tocarlo.

### H5 · MEDIA · «Para guardar» no trae nada guardable (ni tabla, ni orden exacta, ni «Guardalo» en una lámina)
- **Dónde:** el carrusel entero y el pie.
- **Evidencia.** `PLAN.md` §4-bis define el miércoles como «**La misma prueba como tabla o receta: la orden exacta, los créditos y el parecido**» y el cierre «Guardalo para cuando armes el tuyo». El carrusel reparte los seis motores en prosa corrida en las láminas 2 a 4 (la 3 mete cuatro motores, cuatro precios y cuatro parecidos en tres líneas de 34 px); **no hay tabla ni lista**, **no está «la orden exacta»** (el prompt de la escena K1, que el G1/C1 sí muestran) y «Guardalo» solo está en el pie, no en la lámina de cierre. Las `save_worthy: true` (2, 3, 5) marcan láminas que no son más guardables que las otras. Tampoco cumple el gate 5 de `CAROUSEL_SYSTEM.md` («cada slide debe demostrar algo distinto»): las seis láminas son la misma plantilla (foto + titular + cuerpo), con fotos distintas pero ninguna **prueba visual** de la comparación (no hay una lámina con los seis rostros juntos).
- **Mejora mínima.**
  - **Sin re-render (pie):** una lista de seis líneas ordenada **por crédito** (no por parecido, para que no sea un ranking; el pie tiene 1.239 caracteres libres): «Lo que salió, por crédito (parecido en la misma escena, de 0 a 1): 0,5 Kling O1 Image 0,79 · 1 Seedream 4.5 0,81 · 2 Nano Banana 2.1 0,74 · 2,5 Seedream 5.0 Pro 0,70 · 2,75 GPT Image 2.5 0,66 · 3 FLUX 3 0,69.» (≈ 188 caracteres, o en seis renglones para que se pueda copiar). Cada cifra sale de PROCEDENCIA l.97 y coincide con la lámina. Añadir la orden exacta de K1 si la madre la quiere pública.
  - **Con re-render (la mejora real):** reemplazar la lámina 3 por una **tabla** de los seis (motor · créditos · parecido · «escenas») con la línea «puede estar inflado» debajo. Ya existe `prueba-motores-20261008/hojas/comparativo-imagenes.jpg` (fotos lado a lado, 0 cr) como base de una lámina de prueba visual; **ojo**: los originales de Nano Banana 2.1 y FLUX 3 traen logos y sillones dentales (por eso existen las copias `-limpia`), usar esas.

### H6 · BAJA · Lámina 6 y pie: «Una escena por motor, tres para los dos primeros» es exacta pero ambigua
- **Dónde:** lámina 6, cuerpo; pie, 4.º párrafo.
- **Evidencia.** Exacta: Seedream 4.5 y Kling O1 Image tuvieron tres escenas (K1, K2 café, K4 café); Nano Banana 2.1, Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5, una (K1). Pero (1) «una escena por motor, tres para…» se contradice a sí misma si se lee literal; (2) **«los dos primeros» no es lo que el lector ve**: en las láminas son Seedream 4.5 (2) y Nano Banana 2.1 (3); Kling O1 Image aparece **después de los otros cuatro** (lámina 4). Solo en el pie, que los lista en ese orden, «los dos primeros» es correcto.
- **Arreglo.** Pie (sin re-render): «Cuatro motores, una escena; Seedream 4.5 y Kling O1 Image, tres.» Lámina (re-render): el mismo texto en vez de «Una escena por motor, tres para los dos primeros».

### H7 · BAJA · Lámina 3: «Las dos últimas, bajo mi piso» es exacto, pero la tercera está en el piso y se lee como aprobada
- **Dónde:** lámina 3, cuerpo.
- **Evidencia.** FLUX 3 0,691 y GPT Image 2.5 0,658 están bajo 0,70: **exacto**. Seedream 5.0 Pro (0,702, «0,70») pasa por **0,002**, mucho menos que el ruido; con las 4 fotos de la prueba estricta queda en 0,646 (6 de 10 imágenes pasan en B\* contra 7 de 10 en A; la que cambia es esa). El guion G4 lo decía («justo en el piso», «cumple por poco» y «no se anuncia como aprobado») y el carrusel lo perdió. El lector entiende «dos fallan, dos cumplen».
- **Arreglo (re-render).** «…Las dos últimas, bajo mi piso; la de 2,5, justo en él.» (+18 caracteres; la lámina tiene tres líneas llenas, pasa a cuatro).

### H8 · BAJA · Imágenes sin rótulo de motor (1, 3, 5, 6); la de la lámina 3 es una copia retocada y deja una mancha
- **Dónde:** láminas 1, 3, 5 y 6 (solo la 4 rotula el motor, en la píldora).
- **Evidencia.** La **lámina 3** («Los otros cuatro») muestra **la imagen de uno solo** (Nano Banana 2.1, copia `-limpia`, 0,724 en el face-gate; el texto dice «0,74», que es el del original): no dice cuál y puede leerse como representativa de los cuatro; además el retoque (desenfoque con pluma, para tapar sillones y logo) deja una **mancha oscura** a la derecha del hombro (x ≈ 890-1080, y ≈ 640-860), visible incluso a 390 px. Las demás son salidas de Seedream 4.5 (1, 2, 6) y Kling O1 Image (5), sin decirlo. En un carrusel cuyo tema es «qué motor conserva la cara», la imagen no ayuda a comparar si no se sabe de quién es.
- **Arreglo.** Rotular en una línea chica («imagen: Nano Banana 2.1») o aceptarlo; para la mancha, usar la copia sin retocar si no tiene logo en cuadro, o recortar la zona. Decisión de la madre.

### H9 · BAJA · Ninguna lámina dice que Lucía es un personaje de IA
- **Dónde:** láminas 1 a 6 (pie y etiqueta de API sí).
- **Evidencia.** `PLAN.md` §4-bis fija para toda pieza «rótulo “Lucía Antelo · personaje IA de Onia”… etiqueta de IA por API · el pie abre con “personaje hecho con IA”». El pie abre bien (carácter 0); no revisé la etiqueta de API (no se publicó). Las láminas no dicen nada: están pensadas para **guardarse**, y una lámina guardada o reenviada viaja sin pie. El contexto («motores de imagen») lo sugiere pero no lo declara. **Precedente:** C1 y la ficha del carrusel L01 siguen la misma convención (L01 sí lo dice en la lámina 1), así que lo dejo como BAJA y decisión de la madre.
- **Arreglo (re-render, 0 cr).** Agregar a la línea de pie de todas las láminas «@lucia.antelo.oficial · personaje IA» (el pie de lámina ya existe y tiene espacio hasta x ≈ 1000), o en la lámina 1 «¿Cuál conserva la cara de Lucía, mi personaje IA?».

### H10 · BAJA · Detalles visuales
- **Lámina 4:** la píldora «KLING O1 IMAGE · CAFÉ» (x 96-474, y 96-150) **tapa la ceja y parte de la frente** de la cara que justamente se muestra como evidencia (la cara llega al borde superior); es un recorte del encuadre original, no de las imágenes. Cambiar a `object-position` hacia abajo o mover la píldora.
- **Lámina 6:** al borde izquierdo (x 0-90, y 600-720) hay un **mueble blanco con una bandeja turquesa** que se lee a clínica; es la foto K4 de Seedream 4.5. «Nada del rubro a la vista» fue criterio de las revisiones de G4 (se limpiaron los sillones de C y E); aquí es leve (desenfocado) y no hay ningún letrero ni logo en las seis láminas.
- **Láminas 5 y 6** son casi la misma imagen (autorretrato con taza, laptop y mano en la mejilla, consecutivas): pierden contraste visual entre sí. No es un defecto del texto.
- Lámina 2: «4.5:» pasa por encima de la taza blanca (contraste p90 ≈ 5,8: se lee).

### H11 · BAJA · Pie: códigos «R2, R4, R5 y R8» sin explicar y «solo se cruzan dos pares» sin decir que uno es el primero
- **Dónde:** pie, 3.er párrafo.
- **Evidencia.** «R2, R4, R5 y R8» y «4 de ellas entre las 8» no le dicen nada a quien solo vio las láminas (en ninguna aparece «R»); es lo mismo que la revisión 3 de G2 anotó (H3). El pie tampoco dice **que uno de los dos pares es Seedream 4.5 ↔ Kling O1 Image**, que son justo los dos motores de las láminas 2 y 4 (ver H2). «De @oniahq» en la primera línea es menos claro que «por @oniahq» (hecho por).
- **Arreglo (pie).** Quitar «(R2, R4, R5 y R8)» (≈ 20 caracteres) y escribir «solo se cruzan dos pares, dentro del ruido: Seedream 4.5 y Kling O1 Image intercambian el 1.º y el 2.º, y Seedream 5.0 Pro y FLUX 3, el 4.º y el 5.º» (≈ 100 caracteres de más; el pie queda en ≈ 1.100 de 2.200).

---

## Respuestas a los cinco puntos del encargo

| # | Pregunta | Respuesta |
|---|---|---|
| 1a | Cada cifra de láminas y pie contra PROCEDENCIA l.97 y la medición | **Todas coinciden** (tabla abajo). Créditos 1 · 0,5 · 2 · 2,5 · 2,75 · 3 ✓; parecidos 0,81 · 0,83 · 0,84 ✓, 0,74 ✓, 0,70 ✓, 0,69 ✓, 0,66 ✓, 0,79 · 0,35 · 0,83 ✓; «entre 0,03 y 0,09» (de −0,030 a −0,090) ✓; «dos pares» ✓; piso 0,70, ±0,03 ✓. |
| 1b | ¿«Pagar más no ayudó» sigue siendo verdadero y proporcionado? | **Verdadero y proporcionado.** Los cuatro motores de 2 a 3 cr quedan por debajo de Seedream 4.5 (1 cr) con las 8 y con las 4 fotos; solo Nano Banana 2.1 queda **dentro del ruido** en la escena K1 con las 4 fotos (−0,024), y por media de escenas sigue abajo (−0,041). «No ayudó» (no mejoró) es exacto; sería excesivo «empeoró». Descansa en **una sola escena por motor** para esos cuatro, cosa que la lámina 6 dice. |
| 1c | ¿«El más barato la perdió» sigue siendo verdadero y proporcionado? | **Verdadero, no del todo proporcionado** (H4, H3): una vez de tres; en las otras dos empata con Seedream 4.5 a la mitad de precio y con la prueba estricta es 1.º en K1; y la 3.ª es casi copia de R3. |
| 1d | ¿«Las dos últimas, bajo mi piso» es exacto? | **Exacto** (0,691 y 0,658). Falta decir que la de 2,5 cr está en el piso por 0,002 (H7). |
| 1e | ¿La lámina 5 es verdadera, clara y sin exagerar ni minimizar? | **Verdadera: sí. Clara para quien no conoce «las 8 fotos»: a medias** (se define en la lámina 2, tres láminas antes; «vieron» y «pares» son jerga). **Minimiza** al omitir que todos los valores bajan (H2). No exagera. |
| 1f | ¿«Una escena por motor, tres para los dos primeros» es exacto? | **Exacto en los datos** (Seedream 4.5 y Kling O1 Image tuvieron tres); **ambiguo en la forma** (H6). |
| 2 | Pie | Abre con «Personaje hecho con IA» ✓ (carácter 0). Trae «Nombro lo que uso; no es una recomendación pagada.» ✓ (carácter 836). **961 caracteres** de 2.200 (974 bytes), 4 hashtags, voseo, sin «el mejor». **El aviso del sesgo está en el carácter 415, fuera del pliegue (≈ 125)** y la lámina 5 lo cubre pero tarde (H1). Coherente con las láminas, salvo lo anotado (H6, H11). `lucia-prohibidas.mjs` sobre el texto completo y sobre el pie: **«0 coincidencias en 0 archivos», salida 0.** |
| 3 | Marca | Cumple: ningún producto de Onia, nada de Sergio Urcullo, ninguna profesión (el ambo es solo vestuario; ninguna frase habla de oficio), la lámina 4 muestra la imagen de 0,35 **y lo dice** («esa imagen no es Lucía»). Las demás caras pasan (face-gate abajo). Sin letreros ni logos en los seis fondos. Matices: H8, H9, H10. |
| 4 | Imagen | Texto sin cortar ni pisado; jerarquía estable (píldora, titular de dos líneas con caja verde, cuerpo, «DESLIZÁ →», @ con aro) idéntica en las seis; degradado inferior suficiente. Contraste (mediana del fondo local): 7,1 a 13,8 en titulares, 9,4 a 12,9 en cuerpos; p90 3,8 a 10,0 (el peor, «OJO CON» de la lámina 5: 3,8, texto grande, aceptable). **A 390 px** el cuerpo (≈ 36 px a 1080) mide ≈ 13 px y se lee; la píldora y «DESLIZÁ →», ≈ 9 px, son decorativas. Lámina 5 (fondo claro con taza y laptop): **legible y no pisa la cara** (mentón en y ≈ 440, el titular arranca en y ≈ 685). Excepciones: H10 (píldora de la 4 sobre la ceja) y H8 (mancha en la 3). |
| 5 | ¿Sirve «para guardar»? | **Solo a medias** (H5): es narrativa; falta una tabla o lista y «la orden exacta». Mínimo sin re-render: la lista por crédito en el pie. |

### Cifras contra la fuente

| Cifra en lámina o pie | Fuente | Estado |
|---|---|---|
| Seedream 4.5: 1 cr · 0,81 · 0,83 · 0,84 | PROCEDENCIA l.97: 0,806 · 0,830 · 0,839 | ok |
| Kling O1 Image: 0,5 cr · 0,79 · 0,35 · 0,83 | 0,794 · 0,350 · 0,831 | ok |
| Nano Banana 2.1: 2 cr · 0,74 | 0,737 | ok (la imagen mostrada, `-limpia`, mide 0,724) |
| Seedream 5.0 Pro: 2,5 cr · 0,70 | 0,702 | ok («en el piso», H7) |
| FLUX 3: 3 cr · 0,69 | 0,691 | ok |
| GPT Image 2.5: 2,75 cr · 0,66 | 0,658 | ok |
| «Las dos últimas, bajo mi piso» | FLUX 0,691; GPT 0,658 | ok |
| «Los valores bajan entre 0,03 y 0,09» | B\*−A: −0,030 (Nano Banana 2.1) a −0,090 (Seedream 4.5 K4) en 10 imágenes | ok |
| «Solo se cruzan dos pares, dentro del ruido» | K1: Seedream 4.5 ↔ Kling O1 (+0,022), FLUX ↔ Seedream 5.0 Pro (+0,006); por media: +0,006 y +0,020 | ok |
| «Los seis motores recibieron las mismas fotos… 4 entre las 8» | cabecera de la prueba estricta: abe2e6bd, R1, R3, R6, R7, 688d63a7; el kit (PROCEDENCIA l.93) usó la misma lista para Seedream K1/K2/K4 | ok (no repetí `job_display`) |
| «Una escena por motor, tres para los dos primeros» | medición: escenas K1/K2/K4 solo para Seedream 4.5 y Kling O1 | ok (H6) |
| Piso 0,70 · ruido ±0,03 | `SKILL.md`/medición | ok |

### Control de cara de los seis fondos (face-gate.sh, ArcFace buffalo_l contra las 8 referencias; 0 cr)

| Lámina | Fondo | Centroide | Cara (px) | Veredicto |
|---|---|---:|---:|---|
| 1 | Seedream 4.5 K1 | 0,806 | 237 | OK (igual al brief) |
| 2 | Seedream 4.5 K2 café | 0,830 | 225 | OK |
| 3 | Nano Banana 2.1 K1 `-limpia` | 0,724 | 242 | OK |
| 4 | Kling O1 Image K2 café | **0,354** | 287 | BAJO, **por diseño** (rotulado «esa imagen no es Lucía») |
| 5 | Kling O1 Image K4 café | 0,834 | 476 | OK (H3: 0,927 con R3, que es entrada) |
| 6 | Seedream 4.5 K4 | 0,839 | 456 | OK |

Los seis coinciden con lo declarado (diferencia ≤ 0,003). Piso de las caras negativas del gate: 0,224. Todas las caras pasan de 200 px.

---

## Lo que verifiqué y está bien

- **Honestidad de las cifras:** ninguna cifra de lámina o pie difiere de la fuente; no aparecen «ranking», «el mejor» ni «ninguna fuga»; el pie dice «bajan» y no «fuga», fiel a la advertencia de la medición («la columna B\*−A no aísla una fuga»).
- **Marca:** el pie abre con «Personaje hecho con IA» y cita al creador; «Nombro lo que uso; no es una recomendación pagada.» ✓; cero profesión, cero producto de Onia, cero Sergio Urcullo; las herramientas se nombran como uso propio (D-N1); la imagen que no es Lucía está rotulada; sin letreros, logos ni capturas de terceros en los seis fondos.
- **Pie:** 961 de 2.200 caracteres (974 bytes), 4 hashtags, voseo cruceño, lenguaje llano; **la prohibidas sale 0** sobre título, pie, hashtags, textos y `alt_text`.
- **Layout:** las seis láminas son 1080×1350, con el mismo margen izquierdo (x = 96), la misma píldora, titular, cuerpo, «DESLIZÁ →» (menos la última, correcto) y el @ con aro, todo bajo y = 1250; nada sobre y ≈ 96; nada a menos de 80 px del borde.
- **Gate de cara:** los seis fondos con la cifra declarada.
- **Rótulo de la lámina 4:** la cara que no es Lucía está en pantalla **y dicho** en el cuerpo; la lámina no se hace pasar por ella.
- **El texto de la lámina 5 es falso en nada**: cada afirmación se comprueba contra la tabla de la medición (H2 es de proporción).

## Lo que pide el re-render, en una línea cada uno

| Qué | Hallazgo | Nota |
|---|---|---|
| Cuerpo de la lámina 5 (más largo, «bajan 0,03 a 0,09», «recibieron») | H2 | ≈ 211 caracteres: probablemente 5 líneas; el titular sube ≈ 54 px (hay ≈ 240 px de aire hasta el mentón): **mirar** que no pise la cara |
| Fondo de la lámina 5 | H3 | decisión de la madre |
| Titular y cuerpo de la lámina 4 | H4 | «la perdió una vez» y «café del mostrador» |
| Lámina 3 → tabla (opcional, H5) y «justo en él» (H7) | H5, H7 | |
| Texto de la lámina 6 | H6 | |
| Píldora de la 4, mancha de la 3, rótulo «personaje IA» | H8, H9, H10 | |

## Lo que no pude verificar

- **`job_display` de los seis motores** (qué recibió cada uno y con qué orden): no usé el MCP de Higgsfield en esta revisión. Me apoyo en la cabecera de la prueba estricta (verificada por la madre el 11-oct), PROCEDENCIA l.93-97 y el README de la prueba. En particular, que la **orden** de K2 y K4 en Kling O1 Image sea literalmente la del kit de Seedream 4.5 lo toma el README («con el mismo prompt y referencias»); no lo comprobé.
- **Efecto de selección en Seedream 4.5:** sus tres imágenes son del **kit aprobado** (K1_1, K2_1, K4_3, entre varias tomas por escena: K2_1/K2_2, K4_1 a K4_5, una descartada por un letrero inventado), mientras que las de Kling O1 son una toma cada una. Los kit puntúan 0,81 a 0,85 (todas), así que el efecto es pequeño, pero «la sostuvo en tres escenas» no es «tres tomas al azar». No lo cuantifiqué.
- **La selfie «ancla» `abe2e6bd`** (que la medición declara fuera de las 8) y **688d63a7** (ropa): no tengo copia local y no pude compararlas con R1-R8 (en particular con R8, «anchor»).
- **Cómo se ve dentro de Instagram** (corte real del pie en ≈ 125 caracteres, el recorte 3:4 de la cuadrícula del perfil, los iconos sobre la imagen): solo simulé 390 px de ancho; la cuadrícula 3:4 recorta ≈ 3 % por lado (≈ 34 px) y no toca ningún texto (todo está entre x = 96 y x = 1000).
- **La etiqueta «Información de IA» por API:** no se publicó nada.
- **El face-gate mide identidad, no belleza ni realismo.** Ni la copia retocada de la lámina 3 ni la de la 5 son una medida de «se parece para una persona».
- **Que la mancha de la lámina 3 la vea un espectador sin zoom:** la veo a 390 px, pero es ligera; lo dejo como BAJA.


---

## Estado tras aplicar la revisión (sesión Lucía, 11-oct)

Aplicado y re-renderizado (6 láminas 1080×1350, `QA-prohibidas.txt` exit 0, `QA-tabla-identidad.md` exit 0 sobre los 5 fondos que presentan a Lucía; el de la lámina 4 es la imagen que perdió la cara, 0,354, por diseño):
- **H1:** el pie abre con «Ojo: los números de esta prueba pueden salir inflados (explico abajo)» (carácter 50; «pueden», porque la medición no aísla el tamaño del sesgo).
- **H2:** lámina 5 reescrita («todos bajan de 0,03 a 0,09 y se cruzan dos pares»); el detalle de cuáles pares (Seedream 4.5 con Kling O1 Image, 1.º y 2.º; Seedream 5.0 Pro con FLUX 3, 4.º y 5.º) va en el pie (H11).
- **H3:** fondo de la lámina 5 cambiado a Kling O1 Image K1 (0,789, limpia); el pie dice que en el café con teclado la imagen de Kling O1 Image es casi una copia de una foto de entrada (coseno 0,927 con R3; lo medí también yo) y que sin R1, R3, R6 y R7 su 0,83 baja a 0,74. La K4 de Seedream 4.5 NO es una copia (R3 0,793, por debajo de R7 0,812).
- **H4:** lámina 4: «La perdió una vez de tres» y «café del mostrador».
- **H5 (parcial):** lista por crédito en el pie (sin ranking de parecido). La conversión de la lámina 3 en tabla no se hizo (decisión de la madre).
- **H6, H7:** láminas 6 y 3 reescritas («Una escena por motor; Seedream 4.5 y Kling O1 Image, tres»; «0,70, justo en el piso»).
- **H11:** el pie nombra los dos pares que se cruzan.
Sin cambiar, decisión de la madre: **H8** (las imágenes no dicen de qué motor son), **H9** (ninguna lámina dice «IA»; solo el pie y la etiqueta de API, igual que C1), **H10** (píldora sobre la ceja en la lámina 4; láminas 5 y 6 parecidas).
