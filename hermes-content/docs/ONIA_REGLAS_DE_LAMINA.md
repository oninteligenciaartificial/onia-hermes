# Por qué se perdía la información — reglas de lámina

> Fuente de verdad para el visual de los carruseles de @oniahq. Sin fecha en el nombre: si
> algo cambia, se **edita este archivo**, no se crea uno nuevo al lado.
>
> **Origen.** Sergio, 2026-08-25: *"los carruceles estan mal estructurados, colocas imagenes
> sin sentido, mejor explicalo bien y con mejor visual porque se pierde la informacion, sigue
> aprendiendo"*. Lo que sigue no es una guía de estilo: es la lista de errores concretos que
> se cometieron en O01, O02, O03 y O04, con el arreglo de cada uno.
>
> Complementa (no reemplaza) a `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` y
> `hermes-content/docs/ONIA_ESTRUCTURAS_ONIAHQ.md`. Donde este doc los contradice, **gana
> este**, y abajo se dice por qué.

---

## 1. El diagnóstico, con el número

**De 28 láminas publicadas en las cuatro piezas, UNA sola tiene una imagen que prueba lo que
dice su texto.** Es la lámina 3 de O04, y se salva por un motivo mecánico: el cuerpo **cita
textual** lo que está escrito en la tarjeta que muestra («Cobranza: Maestro Julio Choque —
saldo vencido Bs 285 hace 10 días»). Nada más.

El resto, contado:

| Pieza | Pack | Láminas | Con captura de producto | Imagen que prueba su frase |
|---|---|---|---|---|
| O01 | editorial-photo | 7 | 0 | 0 (4 negras vacías, 3 fotos de stock) |
| O02 | editorial-photo | 7 | 0 | 0 (4 negras vacías, 3 fotos de stock) |
| O03 | bright-retail | 7 | 1 (la del CTA) | 0 (5 láminas son la misma plantilla de texto) |
| O04 | dark-product | 7 | 7 | 1 |

Los tres datos duros, medidos sobre los PNG, no opinados:

1. **La lámina 2 y la lámina 5 de O04 son el mismo archivo de píxeles.**
   `ImageChops.difference` sobre la región de imagen devolvió bbox `None`: cero diferencia. El
   brief lo dice sin disimulo — las dos apuntan a `panel-bandeja.png`
   (`O04-agentes-aprobacion.json`).
2. **El dashboard completo de la portada de O04 va a 562 px de ancho sobre un lienzo de
   1080.** `panel-real.png` mide 2160×1620. A esa escala (0,26) el texto de la UI queda en
   **~8 px**. El piso de legibilidad en el lienzo es 28 px. La lámina que promete "te lo
   muestro con la pantalla" muestra una mancha.
3. **La tarjeta oscura de la lámina 2 tiene 1,02:1 de contraste** contra el fondo (píxeles
   leídos: tarjeta 17,15,13 · fondo 10,15,13). Al 20% de tamaño —el tamaño real en el
   scroll— es un rectángulo vacío.

Y los dos cortes que se comen justo el píxel que importa: la portada rebana la tarjeta "El
sistema trabajó por vos" (el elemento que sostiene el carrusel entero) y la lámina 3 corta por
la mitad el botón "Revisar y aprobar" **en la misma lámina cuyo cuerpo dice "Falta un
botón"**. Ese corte no viene del recorte: `panel-real.png` ya llega cortado abajo. La captura
de origen está mal tomada.

El defecto no es estético. Es el **split-attention effect**: imagen flotando en el tercio
superior, texto clavado al pie, nada que los ate. Y el mecanismo exacto está en el código, en
una línea: `.dp-h { margin-top:auto }` (`scripts/carousel_render.js:605`). Ese `auto` empuja
el titular al fondo del lienzo y abre la banda de 260 a 520 px entre la frase y su supuesta
prueba. No es un descuido del brief: es el layout.

---

## 2. La regla de la imagen

### La regla madre

> **Cada lámina es un par frase-prueba.** La frase afirma UNA cosa; la imagen contiene ESA
> cosa. Si el dato que dice el texto no está adentro de la imagen, la imagen no ilustra:
> decora. Y si decora, no va.

La regla ya estaba escrita en `ONIA_ESTRUCTURAS_ONIAHQ.md:131` — *"si el texto nombra algo
concreto, la imagen tiene que mostrar ESO, no una foto de la app en general"*. Se escribió el
20 de agosto y O04 se renderizó el 24 sin aplicarla. Por eso acá va con su prueba operativa,
que es lo que faltaba:

**Test del tapado.** Tapá el texto de la lámina. Si la imagen sola no sugiere la afirmación,
es decorativa. **Test del barajado.** Intercambiá las imágenes de dos láminas. Si nadie nota,
ninguna de las dos era evidencia. En O04, seis de siete se barajan sin que cambie nada.

### Cuándo NO va imagen

**Si no tenés la evidencia literal, la lámina va SIN IMAGEN.** No hay tercera opción, y no es
una concesión: es la opción con más respaldo. El principio de coherencia de Mayer (**23 de 23
tests experimentales, efecto medio 0,86**) dice que el material ajeno excluido gana contra el
incluido. Y Sung & Mayer (2012) muestran que el gráfico *decorativo* no mueve la comprensión y
el *seductor* la **perjudica** — mientras que en los tres casos la gente dice que le gustó
más. **"Gustó" y "entendió" se disocian.** Un recorte del producto puesto donde entraba sube
el gusto y baja la comprensión: es exactamente el error de O04.

⚠️ **"Sin imagen" NO es "el mismo layout con un hueco".** Éste es el error de O01 y O02: las
cuatro láminas negras son el layout de foto con la foto sacada, y dejan 34-48% del lienzo
muerto arriba. Sin imagen significa **el texto sube y ocupa el lienzo**: titular más grande,
cuerpo con aire, la lámina se lee como una decisión y no como un asset faltante. En el motor
esto es una capacidad que hoy no existe (ver §6, cambio 1).

### Tabla: qué texto pide qué imagen

| Lo que dice el texto | Lo que va | El caso real que lo originó |
|---|---|---|
| Nombra una **pantalla** ("miralo en tu Oficina Virtual") | Captura de **esa** pantalla, anotada sobre el dato | O03 L2/L3/L6 nombran la Oficina Virtual y el Portal Web cinco veces y no muestran ninguna |
| Nombra un **número** ("saldo vencido Bs 285") | La captura donde ese número está, con el número resaltado | O04 L3, la única que funciona |
| Es una **secuencia de fechas** | Línea de tiempo **dibujada**, no foto | O03 L5: tres hitos y dos RND de 12 dígitos escritos como párrafo corrido |
| Es una **lista de pasos** | Lista dibujada con badges numerados | O03 L6 y O01 L6: el "2." y el "3." arrancan a mitad de renglón |
| Es una **abstención** ("no manda un cobro solo") | La frase de la UI que lo dice, o un estado en espera | O04 L4: hoy muestra un botón "Ver fiados y cobrar", que lee como lo contrario |
| Habla de **tiempo o de carga mental** | Lo que el sistema recuerda por vos (la lista de vencidos) | O04 L6: hoy muestra facturación del día, que es otro tema |
| Es el **CTA** | Sin imagen. Fondo invertido, un solo pedido | O03 L7 mete el dashboard en la lámina que dice "te paso el checklist, no la factura" |
| Es **ambiente / gancho emocional** | Foto sólo si el objeto que la frase nombra está en el encuadre | O01 L2: el texto dice "a las 10" y la foto es un desayuno a pleno sol |
| **No tenés la evidencia** | **Sin imagen**, con el texto ocupando el lienzo | O01 L4 describe una pantalla que existe y la lámina es negro plano con un tercio vacío |

### Tres reglas de contenido que salen de las piezas

- **Nada de stock genérico.** Las fotos de O01/O02 traen texto en inglés legible seis veces
  ("Grain & Good") y carteles "CLOSED" en una pieza en español boliviano. Si la foto trae
  letras que no escribimos nosotros, no va.
- **Una imagen, una lámina.** Ningún archivo se repite en la misma pieza. Repetirlo estanca el
  scroll y el lector cree que se salteó una lámina (O04 L2 = L5).
- **Datos reales y bolivianos.** Bs, nombres locales, fechas reales. Cero "Cliente 1". Esto ya
  se cumple y es lo mejor que tienen las piezas (§7).

---

## 3. La captura anotada

La anotación es lo que convierte una captura en prueba. Hoy, en las 28 láminas, hay **cero
anotaciones**: ni una flecha, ni un resaltado, ni una etiqueta dentro de la imagen. Sin señal,
el lector escanea la captura entera buscando qué mirar y gasta ahí toda su atención
(*signaling principle*, Cambridge Handbook of Multimedia Learning, cap. 17).

Y la etiqueta va **adentro o pegada** a la imagen, nunca como bloque suelto al pie: la
contigüidad espacial es el arreglo con más efecto medido de toda esta lista — **22 de 22 tests
a favor, efecto 1,10** en Mayer, y **g = 0,63 sobre 58 comparaciones, n = 2.426** en el
meta-análisis de Schroeder & Cenkci (2018). No se encontró **ni un solo estudio** donde separar
texto e imagen produzca mejor aprendizaje.

### Cuánto zoom hace falta (la cuenta)

```
px_final = px_del_texto_en_el_archivo × (ancho_del_slot ÷ ancho_del_recorte)
```

Piso: **28 px** en el lienzo de 1080. Con los archivos que hay hoy:

| Recorte | Ancho nativo | Slot actual | Resultado |
|---|---|---|---|
| `panel-real.png` entero | 2160 px | 562 px | ~8 px — **mancha** (medido sobre el PNG) |
| `panel-curva.png` | 930 px | 620 px | se **reduce** a 0,67 — ilegible |
| `panel-ticket.png` | 560 px | 620 px | 20-26 px — al filo, todavía bajo el piso |

Los cinco recortes salieron 1:1 de `panel-real.png` y después el slot los **achica**. Regla
dura que sale de la tabla: **el recorte nunca puede ser más ancho que el slot donde va.** Con
el slot de 620 px de hoy, ningún recorte de más de ~500 px de ancho llega al piso.

**Y las versalitas de la UI no llegan nunca.** Los micro-rótulos ("ESPERANDO TU APROBACIÓN",
"FIADO · EN LA CALLE") viven a ~15 px en el archivo: para llevarlos a 28 px haría falta un slot
de más de 1.000 px para un recorte de 560. Por eso la etiqueta se **vuelve a escribir** en
tipografía de carrusel al lado de la captura, en vez de confiar en que se lea la de la UI. Esto
no es opcional: es la razón por la que anotar gana contra hacer zoom.

**Test de cierre, gratis:** achicá la lámina al 20% (el tamaño real en el feed). Si no leés
cada palabra que importa, el texto es chico.

### Las cinco técnicas, y cuál conviene en cada caso

**1. Resaltado / spotlight — oscurecer todo menos el dato.** Es el `coach mark` del onboarding.
Un solo `div` vacío con una sombra gigante apaga la captura entera y deja la ventana limpia:

```css
.shot{ position:relative; overflow:hidden; border-radius:14px }
.spot{ position:absolute; left:58%; top:36%; width:22%; height:9%;
  border-radius:8px;
  box-shadow: 0 0 0 9999px rgba(8,12,10,.72);   /* apaga TODO menos este rect */
  outline: 3px solid var(--onia-green); }
```

**Cuándo:** el dato está adentro de una captura con contexto alrededor y el contexto ayuda (la
portada de O04). Bonus: garantiza fondo oscuro para la etiqueta, o sea que resuelve el
contraste AA de paso.

**2. Recorte con zoom sin tocar el PNG.** `background-position` en porcentaje hace coincidir el
punto X% de la imagen con el X% del marco: es literalmente "centrame este detalle".

```css
.crop{ --zoom:3; --cx:62%; --cy:41%;
  aspect-ratio:16/9;
  background-image:url(panel-real.png);
  background-size: calc(var(--zoom) * 100%) auto;
  background-position: var(--cx) var(--cy);
  background-repeat:no-repeat; border-radius:14px }
```

**Cuándo:** el contexto no aporta y el dato es chico. Evita generar un PNG nuevo por cada
encuadre — que es lo que produjo los cinco archivos sueltos de 545 a 930 px que ya no se pueden
agrandar.

**3. Etiqueta anclada con línea guía.** El `viewBox` del SVG igual al tamaño intrínseco del PNG:
así las coordenadas se leen directo del archivo y todo escala solo.

```html
<figure class="shot">
  <img src="panel-fiado.png" width="620" height="270" alt="">
  <svg class="guias" viewBox="0 0 620 270">
    <line x1="470" y1="196" x2="560" y2="120" stroke="#19d27c" stroke-width="5"/>
    <circle cx="470" cy="196" r="9" fill="#19d27c"/>
  </svg>
  <b class="label" style="--x:78%; --y:20%">Esto lo recuerda el sistema</b>
</figure>
```

```css
.guias{ position:absolute; inset:0; width:100%; height:100% }
.label{ position:absolute; left:var(--x); top:var(--y); transform:translate(-50%,-50%) }
```

**Cuándo:** hay que decir algo *sobre* el dato que la UI no dice. Es el reemplazo directo del
"texto abajo" y el que arregla el split-attention de las 7 láminas de O04.

**4. Badges numerados + lista espejada.** Badges 1, 2, 3 sobre cada elemento, en el orden en que
pasan, y la lista de texto numerada igual. **Cuándo:** hay que señalar dos o tres cosas de la
misma captura y las etiquetas no entran adentro. Mantiene la contigüidad **por número** aunque
no por posición.

**5. Recuadro delimitador simple.** **Cuándo:** basta con decir "mirá acá" y el elemento ya se
lee solo.

**Techo de anotaciones: 1 a 3 por imagen.** Si necesitás cuatro, estás metiendo dos pasos en una
lámina y va otra lámina.

**Lo que NO se usa sobre la captura que lleva el dato:** perspectiva 3D ni marco de dispositivo
inclinado. Se ven bien y castigan la legibilidad, que es justo lo que falta.

---

## 4. Jerarquía: cómo se deja de perder la información

### Qué gana, y en qué orden

El tamaño y el contraste se procesan en **menos de 500 ms**, antes de la atención voluntaria
(Einhäuser & König, *Vision Research*). O sea: **la jerarquía decide qué se lee primero sin
pedirle permiso al lector.** Si lo más grande de la lámina no contiene el punto, el punto no se
lee.

Orden que la evidencia respalda, y que es el que hay que armar:

1. **Titular = afirmación en oración completa**, no etiqueta de tema.
2. **La evidencia visual que prueba esa afirmación.**
3. **Texto de apoyo mínimo, pegado a la parte de la imagen que explica.**

Esto tiene nombre y experimento: **assertion-evidence** (Garner & Alley, *Int. J. Engineering
Education* 29(6), 2013). Contra el clásico "título temático + viñetas", el grupo
assertion-evidence entendió mejor el proceso, ganó en las preguntas de orden superior en el quiz
inmediato y ganó en **todos** los tipos de pregunta una semana después (λ = 63,4; p = 0,011).

**Buena noticia: nuestros titulares ya son afirmaciones.** "El SIN tiene un portal gratis", "El
plazo ya se corrió dos veces", "Tu negocio cerrado sigue perdiendo ventas". Lo que falta es la
*evidence*, no la *assertion*. **No convertirlos en sustantivos** tipo "CONTROL DE INVENTARIO".
Las dos excepciones a arreglar: O03 L2 ("Lo que dice la norma, sin adorno" es etiqueta, y es lo
más grande de la lámina, así que lo primero que se lee está vacío) y O03 L4 (arranca con
"Entonces": no se sostiene sola).

### Cuánta información entra

- **Techo de trabajo: ~25-30 palabras de cuerpo por lámina.** Sale de un estudio de 105 charlas
  con 1.222 evaluaciones (Ferguson et al., PMC5226752): media de **25,61 palabras** por lámina.
  Ojo con cómo se cita: en ese mismo estudio la densidad de texto **no predijo nada**
  (r = −0,084; p = 0,394). Lo que **sí** predijo fue la fracción de láminas basadas en imagen
  (r = 0,197; p = 0,044). O sea: es un promedio observado, **no un umbral probado**, y el
  hallazgo que importa es el otro — pesa más que la lámina tenga imagen real que cuántas
  palabras tenga. O04 ya está dentro del rango (25-35 palabras). **El problema nunca fue el
  exceso de palabras.**
- **Una afirmación por lámina.** Si hay dos, son dos láminas. El carrusel **ya es**
  segmentación, y ésa es la única ventaja estructural que el formato regala: el efecto de
  segmentación tiene **10 de 10 tests a favor, efecto medio 0,79** (Mayer; meta-análisis en Rey
  et al., *Educ Psychol Rev* 2019). Meter dos ideas en una lámina la tira a la basura.
- **La densidad es una curva, no una línea.** Aprieta en la lámina 2, afloja al medio, corta de
  golpe en el cierre (`ONIA_MANUAL_DE_FORMATOS_20260813.md:355-357`).

**Contradicción resuelta:** la regla "7 bullets" / "6x6" / "7±2" **no se cita más**. Miller
(1956) midió recuerdo de ítems inconexos, no diseño de láminas; Tufte lo dice sin vueltas y
Cowan (2001) bajó el límite real a ~4. Lo que queda del pattern bank es "5 bullets, ni uno más",
que está bien como convención nuestra — pero no se presenta como ciencia.

### El titular gigante que se come el cuerpo

**Máximo 2 líneas de titular.** Y el arreglo no es agrandar el lienzo: es **escribir el titular
más corto**. O04 L5 ocupa tres líneas por redacción, no por falta de espacio.

Escala en el lienzo 1080: hook 60-90 px · titular 40-55 px · cuerpo 28-36 px. Hoy `dark-product`
está en 88/36 (`carousel_render.js:605,608`) y **el cuerpo no está chico**: se lee al 20%. **El
que se come el espacio no es el titular: es el vacío del medio.** Sacar los `margin-top:auto`
que empujan el texto al piso devuelve entre 260 y 520 px sin tocar una sola palabra.

Y una advertencia sobre lo que **no** hay que hacer con esto: existe un experimento (Katzir et
al., PLoS ONE 2013) donde achicar la fuente un 20% **mejoró** la comprensión en chicos de 5º
grado. Es literatura de "dificultad deseable", tiene fallas de replicación conocidas y no aplica
a un lector distraído en un teléfono. **No sirve como excusa para achicar el cuerpo y meter
imagen.** Si no entra, se sacan palabras.

### Jerarquía progresiva, tres niveles

En vez de "titular blanco + una palabra verde", tres escalones: rótulo gris chico → titular
blanco mediano → **el dato en acento, grande**. Cambio de copy: cero. Está pedido desde el 17 de
agosto (`ONIA_CARRUSELES_SUBIR_EL_TECHO_20260817.md:108`) y nunca se aplicó.

Corolario que O04 rompe: **el acento verde tiene que caer sobre el dato, no sobre una palabra de
relleno.** Hoy el verde marca "sigue", "espera", "tu", "dos veces". El verde es la señal más
fuerte de la lámina; gastarla en una conjunción es tirarla.

### Contraste

**4,5:1 en cuerpo, 3:1 en texto grande** — también para el texto que va encima de una captura.
La tarjeta de O04 L2 está en **1,02:1**: eso no es una decisión de estilo, es un elemento
invisible. Cualquier tarjeta oscura sobre fondo oscuro necesita borde, o el spotlight de la
técnica 1, o no va.

### Numeración de lámina — contradicción resuelta

Tres docs, tres posturas: `CAROUSEL_SYSTEM.md:9-10` prohíbe el contador, el pattern bank
(`:106,133`) lo exige, y `ONIA_MANUAL_DE_FORMATOS_20260813.md:382-384` lo trata como bug. El
código imprime `PASO 03 / 07` (`carousel_render.js:192-197`) sólo en el pack `typographic`.

**Decisión: la píldora lleva la serie y el episodio, no "PASO n / N", salvo que la lámina sea de
verdad un paso de una secuencia.** Razón: el manual tiene razón sobre el bug concreto —imprimir
"PASO 04" sobre una lámina que no es un paso miente sobre la estructura— y el pattern bank tiene
razón sobre el principio: alguna señal de "dónde estoy" es el sistema de navegación más barato
que hay. El marcador de serie que ya se implementó (`carousel_render.js:843-851`) cumple las dos
cosas. Queda cerrado.

### Molde de 7 u 8 láminas — contradicción resuelta

`CAROUSEL_PATTERN_BANK_2026.md:23-33` dice 8; `ONIA_ESTRUCTURAS_ONIAHQ.md:38-51` dice "7,
siempre". **Gana 7**: es lo que usan los cuatro briefs reales y lo que ya está publicado. El
pattern bank queda como referencia de *roles*, no de cantidad.

---

## 5. El rediseño de O04, lámina por lámina

Brief: `hermes-content/references/oniahq/briefs/O04-agentes-aprobacion.json`. Pack
`dark-product`. **El copy se conserva casi entero** — lo que cambia es la imagen, la anotación y
dos titulares que prometían algo que la imagen no daba.

Coordenadas de recorte en el sistema nativo de `panel-real.png` (**2160×1620**), formato
`x1,y1 → x2,y2`.

| # | Rol | Texto propuesto | Imagen exacta | Qué se anota |
|---|---|---|---|---|
| 1 | cover | **Titular igual:** "Nadie te explica *qué hace* la IA en tu negocio" · Cuerpo igual: "Así que te lo muestro con la pantalla." | `panel-real.png` **a sangre, 1080 px de ancho** (no 562, no centrado en un slot de 620) | **Spotlight** (técnica 1) sobre el panel negro "El sistema trabajó por vos" (~`497,1199 → 2117,1620`); todo lo demás al 72% de negro. Etiqueta dibujada en tipografía de carrusel: **"1 propuesta esperando tu aprobación"**, con línea guía al contador. La afirmación es "hay una pantalla" y la pantalla entera la prueba; el dato lo pone la etiqueta, no la UI |
| 2 | stakes | **Titular nuevo:** "Hay **una propuesta** esperando. No te la mandó: te la *dejó*." · Cuerpo igual | `panel-bandeja.png` (contador), **con borde de 2 px** para salir del 1,02:1 | Resaltado sobre el **"1"** + etiqueta "no salió nada". ⚠️ **Se cambia el titular, no la imagen:** "es una bandeja" exige mostrar 2-3 propuestas apiladas y esa captura **no existe**. Si se captura la bandeja con tres ítems, se vuelve al titular original — es mejor. Mientras no exista, se afirma lo que la imagen prueba |
| 3 | point | **Igual, no se toca.** El cuerpo cita textual la tarjeta; es la única que ya funcionaba | `panel-ticket.png` **re-cortada con el botón entero**. Hoy el archivo (560×280) corta "Revisar y aprobar" por la mitad — y `panel-real.png` **también lo corta abajo**, así que hace falta **re-capturar con scroll**, no re-recortar | **Badge 1** sobre `Bs 285`, **badge 2** sobre el botón completo, y la lista espejada al lado: "1. el monto ya está calculado · 2. falta que lo aprietes". El cuerpo dice "Falta un botón": el botón tiene que verse entero o la lámina se contradice sola |
| 4 | point | **Igual:** "Lo que *no* hace, a propósito" | **Recorte nuevo** de `panel-real.png`: la línea de la UI que dice **"Nada sale sin que vos apretés el botón"**, dentro del panel negro (~`529,1290 → 1180,1360`) | Resaltado sobre esa frase. Es evidencia **literal**: la abstención está escrita en el producto. **Se retira `panel-fiado.png` de esta lámina**: un botón "Ver fiados y cobrar" al lado de "no manda un cobro solo" lee como lo contrario |
| 5 | save | **Igual:** "Por qué eso importa más que la IA" | **SIN IMAGEN.** El texto habla de un error caro evitado y no existe captura de un error que no pasó | Nada. El texto sube y ocupa el lienzo (§6, cambio 1). Rompe el patrón visual justo en la lámina que se guarda, que es lo correcto. **Elimina de una el duplicado L2 = L5** |
| 6 | point | **Titular nuevo (afirmación, no pregunta):** "No te devuelve *horas*. Te devuelve la cabeza." · Cuerpo igual | `panel-fiado.png` (~`1474,900 → 2071,1132`), la que hoy está en la 4 | Resaltado sobre "**Vencido (cobrar ya) Bs 285**" + etiqueta "esto lo recuerda el sistema, no vos". Hoy la lámina muestra facturación del día, que no tiene un solo dato de tiempo ni de memoria; y el titular viejo preguntaba "¿cuánto tiempo?" sin que el cuerpo ni la imagen dieran un número |
| 7 | cta | **Titular igual:** "¿Qué delegarías *primero*?" · Cuerpo igual · **se elimina la píldora "20 minutos, gratis"** o se la baja al cuerpo | **SIN IMAGEN.** Fondo verde (ya lo hace) | Nada. Hoy hay dos ofertas peleando a ~700 px de distancia —píldora arriba, "Comentá SISTEMA" abajo— y la imagen es un desglose de medios de pago que no tiene nada que ver con delegar tareas. **Jamás dos CTAs** |

**Se descartan de la pieza:** `panel-pagos.png` y `panel-curva.png`. Ninguna frase del carrusel
los pide. Quedan disponibles para una pieza sobre medios de pago o sobre el cierre del día, que
es de lo que hablan.

**Lo que hay que producir antes de re-renderizar** (dos ítems, no siete):

1. **Re-captura del panel negro con scroll**, para que "Revisar y aprobar" entre entero.
2. **Recorte de la línea "Nada sale sin que vos apretés el botón"** — sale de `panel-real.png`,
   no hace falta capturar de nuevo.

Opcional, y mejora la lámina 2: captura de la bandeja con 2-3 propuestas apiladas.

---

## 6. Lo que hay que cambiar en el motor

Todo sobre `C:\dev\proyectos\onia-hermes\scripts\carousel_render.js`. Ordenado por lo que
desbloquea el rediseño de §5.

**1. Anclar el texto a la imagen, y permitir la lámina sin imagen.**
`.dp-h { margin-top:auto }` (`:605`) empuja el titular al piso y abre la banda muerta. Hay cuatro
`margin-top:auto` más en `typographic` (`:396,433,445,453`) y uno en `editorial-clean` (`.spacer`,
`:1018`). Hace falta: (a) que el bloque de texto se pegue al pie de la imagen cuando hay imagen;
(b) que cuando **no** hay imagen el texto **suba y ocupe el lienzo** en vez de dejar el hueco. Sin
(b), "sin imagen" va a seguir produciendo las láminas negras de O01/O02.

**2. Capa de anotación — es la capacidad nueva grande.**
Función nueva `annotate(slide)` que lea `slide.marks[]`:

```js
marks: [
  { type:'spot',  x:58, y:36, w:22, h:9, label:'1 propuesta esperando' },
  { type:'badge', x:31, y:64, n:2 },
  { type:'box',   x:10, y:44, w:70, h:12 }
]
```

Coordenadas en **% del recorte**, envueltas en `<figure class="shot">` con un
`<svg viewBox="0 0 W H">` del tamaño intrínseco del PNG (así las coordenadas se leen del archivo
y escalan solas). CSS de las tres primitivas: §3, técnicas 1, 3 y 4. **Sin esto, §5 no se puede
implementar.**

**3. Recorte por CSS: `slide.crop = { zoom, cx, cy }`.**
Hoy `.object` es un `<img>` con `max-width:620px; max-height:420px` (`:601`). Pasarlo a
`background-image` + `background-size/position` (§3, técnica 2) permite reencuadrar sin generar
un PNG por encuadre — que es lo que produjo los cinco archivos de 545 a 930 px que ya no se
pueden agrandar.

**4. Slot de imagen variable: `slide.object_width`, o `object_fit:'bleed'`.**
El slot fijo de 620 px es lo que deja el dashboard en 8 px. La portada necesita 1080 a sangre.

**5. `.dato` está definido en 2 packs de 6.**
Sólo en `typographic` (`:460`) y `editorial-clean` (`:917`). Consecuencia medible: el
`{{Bs 285}}` de O04 lámina 3 sale **sin ningún estilo** en `dark-product`. Mover la regla a un
bloque común a los seis packs.

**6. `editorial-photo` y `editorial-clean` no leen `slide.object`.**
`slide.object` sólo se lee en `dark-product` (`:543`), `dark-neon` (`:651`) y `bright-retail`
(`:975`). `editorialPhotoHtml` (`:738-819`) y `editorialCleanHtml` (`:825-962`) lo ignoran.
**Ésta es la razón por la que O01 y O02 tienen 0 capturas de 7**: aunque el brief las declarara,
el motor las tira. Es un bug, no una decisión de diseño.

**7. `slide.callout` desaparece en silencio en los dos packs que más se usan.**
Se renderiza en `dark-product` (`:555`), `dark-neon` (`:659`) y `bright-retail` (`:981`), y **no**
en `editorial-photo` ni en `editorial-clean`. Copy escrito ahí se pierde sin aviso.

**8. La onda verde tacha el eyebrow verde en el rol `save`.**
En O04 L5 se lee "FRAMEWOR". **No es orden de capas:** `.curve` ya va a `z-index:0` y
`.slide > *:not(.curve)` a `z-index:2` (`:588-591`). Es **colisión de color**: un trazo verde de
16 px detrás de un `.savetag` de texto verde a 28 px (`:611-612`). Arreglo: que la curva no cruce
la banda de texto en el rol `save`, o que el `.savetag` lleve fondo propio.

**9. El botón de CTA existe y lo usa un solo pack.**
`ctaButton()` (`:261`) se llama únicamente en `editorial-photo` (`:805`). `dark-product` (`:563`),
`dark-neon` (`:667`) y `bright-retail` no dibujan botón. Es el pendiente #1 de la auditoría del
17-ago y sigue abierto.

**10. El gate — lo que evita que esto vuelva a pasar.**
Script nuevo `scripts/carousel_gate.js`, que corre antes de renderizar y **falla** si:

- una lámina tiene `object` y no tiene `marks` (imagen sin señal);
- dos láminas de la misma pieza apuntan al **mismo** archivo (el caso L2 = L5);
- el ancho nativo del recorte es mayor que el ancho del slot (el caso de los 8 px);
- una lámina de rol `cta` tiene `object`;
- un `{{dato}}` va a un pack que no define `.dato`.

Es el único ítem de esta lista que se paga solo: los cinco chequeos son aritmética sobre el JSON
y sobre las dimensiones del PNG.

**Pendiente que hay que CERRAR, no hacer:** el #4 de
`ONIA_CARRUSELES_SUBIR_EL_TECHO_20260817.md` pedía serif-italic Fraunces para los packs oscuros.
Sergio **retiró** el serif el 17-ago (`CAROUSEL_PATTERN_BANK_2026.md:191`). Está muerto, no
atrasado.

---

## 7. Lo que NO hay que romper

Nada de esto se toca al arreglar el visual. Todo verificado sobre los PNG.

1. **Los datos bolivianos, y que cuadren.** Bs, "Ferretería El Carmen", "Maestro Julio Choque",
   fiado en la calle, QR al 39%, viernes 21 de agosto de 2026. Y la aritmética cierra:
   1.147,50 + 1.806 + 1.109,90 + 570 = **4.633,40 exacto**. Esto es lo que hace creíble la pieza.
   Cero placeholder, nunca.
2. **Los titulares como afirmación en oración completa.** Es el hallazgo con más respaldo
   experimental de toda la investigación (§4). No convertirlos en etiquetas de tema.
3. **La redacción.** Segunda persona, voseo cruceño, concreta, sin jerga. "Le escribe a tres.
   Compra al que contestó. No perdiste por precio ni por producto: perdiste por hora." "Sin fecha
   no se cobra: se regala." "Es tu plata comprada hace tres meses." No se toca una palabra.
4. **El ángulo anti-venta de O03** — "no tenés que comprarle nada a nadie", "te está vendiendo".
   Es el diferenciador de esa pieza. Ninguna imagen nueva puede contradecirlo (ojo con volver a
   meter el dashboard en su CTA).
5. **La arquitectura del guion:** problema → costo real → tres o cuatro acciones → resumen
   guardable → CTA. Lo que falla es la evidencia de cada paso, no el orden.
6. **El sistema de marca:** píldora arriba a la izquierda, marcador de serie (`:843-851`), acento
   verde sobre una palabra del titular, "DESLIZÁ →", firma @oniahq abajo. Reconocible al scroll y
   consistente en las 28 láminas.
7. **El quiebre de fondo en el CTA** (verde en O04, negro en O03). Invertir el fondo en la última
   es la decisión de ritmo correcta.
8. **La onda verde como hilo continuo** entre láminas. La idea es buena; se arregla el cruce con
   el texto (§6, cambio 8), no se borra.
9. **Las píldoras de remate** de O03 ("El problema no es emitir. Es re-tipear.", "20 minutos,
   gratis"): cortas, con fondo propio, cierran la lámina.
10. **El cuerpo a 36 px.** Sobrevive el scroll y se lee al 20%. **No achicarlo para que entre una
    imagen** — si no entra, se sacan palabras.

---

## Gate de una lámina (checklist, antes de renderizar)

- [ ] La frase afirma **una sola** cosa, y ese dato **está adentro de la imagen**.
- [ ] Hay entre **1 y 3** señales apuntando a ese dato.
- [ ] El texto más chico que importa mide **≥ 28 px** en el lienzo de 1080.
- [ ] Ninguna etiqueta describe algo que quedó **fuera** del recorte.
- [ ] Ningún archivo de imagen se repite en la pieza.
- [ ] Al **20%** de tamaño se lee todo lo que importa.
- [ ] Los datos son reales y bolivianos.
- [ ] El titular entra en **2 líneas**.
- [ ] Si no hay evidencia literal: **sin imagen**, y el texto **ocupa** el lienzo.
- [ ] Contraste ≥ 4,5:1 en cuerpo, también sobre la captura.

---

## Fuentes

- Garner & Alley — *How the Design of Presentation Slides Affects Audience Comprehension*,
  Int. J. Engineering Education 29(6):1564-1579 (2013).
  https://writing.engr.psu.edu/ae_comprehension.pdf
- Schroeder & Cenkci — *Spatial Contiguity and Spatial Split-Attention Effects*, Educ Psychol Rev
  (2018); 58 comparaciones, n = 2.426, g = 0,63.
  https://link.springer.com/article/10.1007/s10648-018-9435-9
- Mayer — *Applying the Science of Learning: Evidence-Based Principles* (contigüidad 22/22
  d = 1,10 · coherencia 23/23 d = 0,86 · segmentación 10/10 d = 0,79).
  https://pressbooks.pub/learningenvironmentsdesign/chapter/mayer-applying-the-science-of-learning-evidence-based-principles-for-the-design-of-multimedia-instruction/
- Rey et al. — *A Meta-analysis of the Segmenting Effect*, Educ Psychol Rev (2019).
  https://link.springer.com/article/10.1007/s10648-018-9456-4
- Sung & Mayer — *When graphics improve liking but not learning*, Computers in Human Behavior
  (2012). https://nschwartz.yourweb.csuchico.edu/Sung%20&%20Mayer%202012.pdf
- *The Signaling (or Cueing) Principle in Multimedia Learning*, Cambridge Handbook of Multimedia
  Learning, cap. 17.
- Ferguson et al. — densidad de texto vs. láminas basadas en imagen (PMC5226752).
  https://pmc.ncbi.nlm.nih.gov/articles/PMC5226752/
- Einhäuser & König — *Components of bottom-up gaze allocation*, Vision Research.
  https://www.sciencedirect.com/science/article/pii/S0042698905001975
- NN/G — *F-Shaped Pattern: Misunderstood, But Still Relevant*.
  https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Tufte — *The magical number seven: Not relevant for design*.
  https://www.edwardtufte.com/notebook/the-magical-number-seven-plus-or-minus-two-not-relevant-for-design/
- Katzir, Hershko & Halamish — *Font size and comprehension* (PMC3777945). Citado como
  advertencia, no como regla. https://pmc.ncbi.nlm.nih.gov/articles/PMC3777945/
- Appcues — patrones de product tour (coach mark, hotspot).
  https://www.appcues.com/blog/product-tours-ui-patterns
- Smashing Magazine — *A Few Interesting Ways To Use CSS Shadows*.
  https://www.smashingmagazine.com/2023/08/interesting-ways-use-css-shadows/

**Docs internos que este archivo consolida:**
`web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` ·
`hermes-content/docs/ONIA_ESTRUCTURAS_ONIAHQ.md` ·
`hermes-content/docs/ONIA_CARRUSELES_SUBIR_EL_TECHO_20260817.md` ·
`hermes-content/docs/ONIA_MANUAL_DE_FORMATOS_20260813.md` ·
`hermes-content/carousels/CAROUSEL_SYSTEM.md` ·
`hermes-content/references/carruseles-referencia/josecarlosttb/ANALISIS.md`

---

## 8. Qué pack para qué pieza — el hallazgo del 2026-08-25

Se intentó arreglar O01 metiéndole la captura del chat como **fondo a sangre** en
`editorial-photo`. **No funciona, y hay que dejarlo escrito para no repetirlo.**

En `editorial-photo` el texto va **encima** de la foto. Una foto de ambiente sirve porque
es oscura y difusa: el scrim la aplasta y el titular se lee limpio. Una **captura de
producto tiene información** — texto de UI, burbujas, botones — y esa información **compite
con el titular**. Resultado medido mirando el PNG: no se lee ni la captura ni el texto.

**La regla, entonces, es de reparto, no de capacidad:**

| Si la pieza… | Va en | Porque |
|---|---|---|
| Habla del **dolor** ("tu negocio pierde plata cerrado") | `editorial-photo` | El dolor se ilustra con ambiente. **No necesita producto** |
| Habla de lo que **hace el producto** | `dark-product` | Imagen y texto tienen zonas separadas: la captura se lee y el titular también |
| Es **informativa / fiscal** | `bright-retail` | Claro, de día, no dramático |

**Corolario que corrige la sección 2:** "si la imagen no prueba la frase, no va imagen" sigue
en pie — pero **no toda pieza necesita probar algo con una captura**. Una pieza de dolor con
tres láminas negras y buena tipografía está *bien*, no incompleta. El error de O01 no era la
falta de capturas: era que sus fotos eran de stock genérico con cartelería en inglés
("CLOSED", "Grain & Good") bajo titulares que hablaban de otra cosa.

La capacidad de anotar el fondo en `editorial-photo` **queda igual** en el motor: sirve para
una foto con un detalle que señalar. Lo que no sirve es meter una captura de UI ahí.
