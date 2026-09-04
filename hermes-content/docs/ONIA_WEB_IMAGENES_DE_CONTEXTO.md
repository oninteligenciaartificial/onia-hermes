# Imágenes de contexto de onia.com.bo

> **Fuente de verdad** del tema "fotos humanas en la web de venta". Sin fecha en el nombre:
> si cambia, se EDITA este archivo.
> Superficie a la que aplica: `web-factory/apps/onia-platform/src/app/(sitio)/**`.

---

## 1. La decisión que gobierna todo

La web es hoy 100% texto + interfaz: **explica el producto con precisión y no muestra ni una
vez qué le PASA a un negocio.** Las fotos humanas cubren ese hueco.

**La interfaz sigue siendo captura REAL.** Higgsfield genera **contexto y uso** — personas de
Bolivia en su negocio —, nunca producto. Una UI dibujada por IA es *fabricar producto*, que
está prohibido, y es exactamente lo que la home ya prohíbe por escrito:

> `(sitio)/page.tsx` ~24: *"La imagen social es una captura REAL del sistema… Regla de la
> casa: nada de pantallas dibujadas haciendo de prueba."*

De ahí sale la regla operativa: **en la foto generada no hay pantalla legible.** El
dispositivo va boca abajo, cerrado, o con la pantalla girada hacia la palma. Si una sección
necesita mostrar la pantalla, la captura real se compone ENCIMA.

---

## 2. Reglas vinculantes (las que ya existen, aplicadas a imagen)

| # | Regla | Cómo muerde en una foto |
|---|---|---|
| R1 | **No fabricar** (`CLAUDE.md` §5) | Una imagen es una AFIRMACIÓN. Prohibido: nombre de negocio, letrero, logo (real o inventado), cara recurrente que funcione como testimonio, cifra de resultado dentro de la escena. Permitido: negocio boliviano genérico, sin identidad. |
| R1b | **Tampoco se PROCLAMA la debilidad** (`lib/proof.ts`) | Prohibido el disclaimer "imagen ilustrativa, no es un cliente real". La solución no es rotular la foto: es que **la foto no reclame nada** que haya que desmentir. |
| R2 | **La venta nunca exhibe obra** (`CLAUDE.md` §3) | Sólo los **5 rubros publicados** (dental, comercio, importadora, estética, servicios). Ganadería, veterinaria y el resto **no aparecen ni de fondo**. Nada de watermark, "preview" o placeholder gris en producción. |
| R3 | **Etiqueta "hecho con IA"** | Obligatoria en **Meta** (IG/FB, orgánico y pauta) si la imagen se reusa ahí. **NO existe ninguna regla que la exija en onia.com.bo** — se revisó CLAUDE.md, memoria y docs. No inventarla. La ausencia de etiqueta obliga MÁS a R1, no menos. |
| R4 | **Gasto** | Imagen en lote chico = gasto trivial ya validado (~0,12 cr por imagen 2k). Video = permiso explícito con `get_cost` por delante. |
| R5 | **Construir ≠ publicar** (`CLAUDE.md` §4) | Se genera, se cablea y se le muestra RENDERIZADO a Sergio. Pedir las imágenes **no** es aprobar esas imágenes en esa página. El 2026-08-20 esa confusión obligó a revertir la landing v2 en producción. |
| R6 | **Caras** | Nunca la cara de Sergio ni sus Souls. Nunca Lucía ni Mara (son el canal D, no clientes). **Ninguna cara se repite en 3 secciones**: cuando se repite deja de ser ambiente y pasa a ser personaje, que es otro régimen entero. |
| R7 | **Correlación** | Cada foto ilustra la capacidad que SU sección vende. El comprador es dueño de negocio formal que ya factura, 30-55 años — no el emprendimiento que arranca, no estética startup, no puesto informal. **Nada folclórico**: Bolivia se lee por el negocio y la gente. |
| R8 | **Verificar es MIRAR** | Cada imagen se abre y se mira **montada al tamaño real** en que se va a ver, en móvil y desktop. Y se mide el peso: un lote de fotos es el camino corto a repetir el desastre de los 3,9 MB. |

---

## 3. Dirección fotográfica

**Personas.** Bolivianos de 28-55, rasgos andinos/cruceños, piel morena, ropa de trabajo con
uso. **Máximo 2 por foto**, una es mejor. Nadie mira a cámara, nadie sonríe a cámara, todas
las manos están ocupadas con un objeto físico.

**Luz.** Una sola fuente dominante y diegética. La Paz/Cochabamba → ventana de altura, fría,
sombra dura. Santa Cruz → difusa tropical, cálida, ventilador o split en cuadro. Comercio →
tubo fluorescente del local mezclado con luz de puerta; el verde-cian del fluorescente es
marca de verdad. Nada de flash frontal ni rim-light de estudio.

**Óptica.** 35 mm para contexto, 50 mm para una persona trabajando, 85 mm sólo para manos.
f/2.8-f/4 (el fondo se lee: el negocio se reconoce). 1/60 para permitir barrido leve de mano.
Grano fino tipo ISO 400.

**Ángulo.** Altura de ojo, o a la altura del mostrador — el espectador queda **del lado del
cliente**. Prohibido cenital heroico, dron, contrapicado.

**Posado: cero.** Momento intermedio (agachándose, girando, tomando el celular), nunca la pose
de llegada.

**Color**, para convivir con `#F9FBFA` papel / `#12100e` tinta / `#013925`-`#00d26a` verde:
saturación −12, rojos y naranjas otro −10, negros levantados apenas, blancos frenados a ~96%
para que no se fundan con el papel. Sin viñeteo, sin HDR, sin split-toning.
**Marca diegética: cada foto lleva un verde DENTRO de la escena** — mandil, balde, carpeta,
planta — para que el verde Onia entre por el mundo real y no por un filtro encima.

**Entrega.** WebP, 4:3 (`--shape-ratio`), más 16:9 para bandas anchas. El radio de esquina lo
pone el CSS (`--r-block`), no la imagen.

---

## 4. ⚠️ La trampa del modelo: la lista de "evitar" INVOCA lo que nombra

**`text2image_soul_v2` no tiene parámetro `negative_prompt`.** Verificado con `models_explore get text2image_soul_v2`:
sus únicos parámetros son `quality` y `soul_id`. Todo lo que se escriba va al MISMO campo de
texto — así que una sección "Avoid: dashboards, blue neon, candlestick charts, man in a suit
pointing at a whiteboard" no prohíbe nada: **describe la imagen**.

El primer lote de 6 lo demostró sin margen de duda. Cada elemento prohibido apareció, y salió
textual de la lista de prohibidos:

| Imagen | Qué apareció | De dónde salió |
|---|---|---|
| dental | monitor con código verde-azul + tablet con esfera de partículas azul | `blue neon`, `data visualization`, `holograms` |
| servicios | gráfico de velas en la pared, señor de **traje y corbata roja señalando una pizarra** | `candlestick stock charts`, `handshake in a blue suit with a red tie`, `pointing at a whiteboard` |
| hero | UI inventada en el celular + ícono azul de persona incrustado | `user interface`, `icons` |
| 4 de 6 | firma/watermark de basura en el margen | `watermark` |

**Regla:** con un modelo sin `negative_prompt`, el prompt se escribe **100% afirmativo**. Lo
que no querés que aparezca **no se nombra**: se reemplaza por su opuesto descrito como hecho
físico.

- ❌ `no readable screen, no UI, no dashboards`
- ✅ `a dark phone lying face down with its plain back panel facing up` · `a closed silver
  laptop rests shut on the box` · `the screen turned toward her palm and away from view`
- ❌ `not smiling at camera, no eye contact`
- ✅ `she looks down at her own hands, her mouth relaxed and closed, concentrating`
- ❌ `no group of people, alone`
- ✅ `she stands alone behind the counter`
- ❌ `no teal and orange, no HDR, no oversaturation`
- ✅ `muted and desaturated, calm neutral colour, soft low contrast, lifted blacks, highlights
  held below pure white`

Los clisés de la §6 siguen siendo criterio de **rechazo al mirar la imagen**, no texto de
prompt.

---

## 5. Plantilla de prompt (afirmativa)

```
Candid documentary photograph on 35mm film, f/3.2, 1/60s, ISO 400, fine natural grain.
One dominant light source: <ventana lateral | tubo del local | portón abierto | lámpara de escritorio>.
<PERSONA: boliviano/a de ~N años, rasgos andinos/cruceños, piel morena, pelo negro,
 ropa de trabajo concreta>. <Está SOLO/A> en <LUGAR concreto y boliviano>.
<MANOS: qué objeto sostiene cada una, a mitad de movimiento>.
<DISPOSITIVO: boca abajo / cerrado / girado hacia la palma>.
<MIRADA: looks down at ..., mouth closed, concentrating>.
<ENTORNO: 8-12 objetos reales del rubro, incluido UN objeto verde>.
The photograph is muted and desaturated, calm neutral colour, soft low contrast,
lifted blacks, highlights held below pure white.
Camera at eye level, framing slightly off-centre, <hombro> cropped by the <lado> edge.
```

Sin sección "Avoid". Sin negaciones.

---

## 6. Clisés = criterio de rechazo al MIRAR (no van al prompt)

Traje, corbata, apretón de manos · oficina blanca vacía · sonrisa a cámara o cualquier mirada
al lente · gráficos/dashboards/datos flotando, hologramas, nodos azules · pantalla o texto
legible · grupo de 4+ aplaudiendo o alrededor de una laptop · post-it de colores en vidrio ·
manos vacías gesticulando, manos gigantes en primer plano · cabezas de robot, cerebros de
circuitos, azul cibernético · modelo de agencia (piel perfecta, ropa planchada, look Miami) ·
skyline genérico, coworking con neón · latte art junto a laptop plateada · **billetes a la
vista** (en Bolivia la plata no se exhibe) · contenedores, barco o grúa de puerto (Bolivia no
tiene mar: delata banco de imágenes al instante).

---

## 7. Shot list — 6 imágenes, con su ubicación y su correlación

Cada foto es **el segundo previo o posterior a la pantalla real que esa sección ya muestra**
(`switcher.tsx` ~50-55), no una escena genérica del rubro.

| # | Sección | Captura real que ya se muestra | El momento a fotografiar |
|---|---|---|---|
| 1 | `#rubros` dental | agenda del día con hora, motivo y **teléfono** | recepcionista de pie tras el mostrador, celular en una mano y la otra todavía sobre el cuaderno de citas abierto |
| 2 | `#rubros` comercio | caja: total del día por método de pago | fin de la tarde, el dueño con el **cuaderno de fiados** abierto y la tablet boca abajo al lado |
| 3 | `#rubros` importadora | cotizaciones B2B con estado y monto | de pie junto al rack, guía impresa en la mano, laptop cerrada sobre una caja |
| 4 | `#rubros` estética | agenda: sesiones y controles post-tratamiento | entre clienta y clienta, camilla vacía con papel nuevo puesto |
| 5 | `#rubros` servicios | contabilidad: IVA e IT del mes | de noche, archivador de palanca abierto, calculadora recién soltada |
| 6 | Hero (junto a la captura real) | panel con lo cobrado del día | cenital del mostrador a las 7:40: celular boca abajo, café, cuaderno, manos entrando en cuadro |

**Dolor real por rubro** (lo que la foto tiene que dejar entender sin leer): dental → el
paciente que no vino y el sillón parado · comercio → el fiado en un cuaderno que se moja, y
la caja que no cuadra entre efectivo, QR y transferencias · importadora → cotizar a mano
abriendo el Excel del último contenedor, y no saber cuáles siguen vivas · estética → el
paquete de 6 sesiones que quedó en 3 y la agenda viviendo en los DM · servicios → 25 NITs,
el Libro de Ventas IVA y el vencimiento por último dígito del NIT.

---

## 8. Gate — cada imagen, una por una, antes de cablear

1. ¿Hay texto o pantalla legible? → rechazar.
2. ¿Alguien mira a cámara o sonríe posando? → rechazar.
3. ¿Se reconoce el rubro en 0,3 s sin leer? → si no, rechazar.
4. ¿Los rasgos son bolivianos/andinos? (el modelo deriva a otras regiones con facilidad) → si no, regenerar.
5. ¿Hay un verde dentro de la escena? → si no, regenerar.
6. ¿Las manos están bien y ocupadas? → **contar dedos**.
7. ¿Hay firma o watermark de basura en el margen? → recortar.
8. Puesta sobre `#F9FBFA` **al tamaño real de su ranura**: ¿el blanco se funde con el papel o pelea con el verde? → corregir en color, no regenerando.
9. Peso: WebP, dimensiones explícitas, `loading="lazy"` fuera del hero.

---

## 9. Registro de lotes

| Lote | Modelo | Imágenes | Costo aprox. | Resultado |
|---|---|---|---|---|
| 1 | `text2image_soul_v2` 2k | 6 | ~0,7 cr | **6/6 rechazadas** — método con lista "Avoid" (§4) |
| 2 | `text2image_soul_v2` 2k | 6 | ~0,7 cr | **5/6 aprobadas**; dental rechazada |
| 3 | `text2image_soul_v2` 2k | 2 | ~0,25 cr | dental, dos variantes: **1 aprobada** |

Total ~1,7 cr de un saldo de 2.178 (plan `ultra`).

**Aprobadas y en `web-factory/apps/onia-platform/public/contexto/`** — 512 KB las seis:
`dental.webp` 1280×960 · `comercio.webp` 1280×960 · `importadora.webp` 1280×874 ·
`estetica.webp` 1280×960 · `servicios.webp` 1280×1078 · `mostrador.webp` 1280×720.
Dos llevan recorte: `importadora` −9% abajo (etiqueta espejada en una caja) y `servicios` −11%
a la izquierda (calendario de pared con texto basura).

**Rechazos del lote 2-3, y por qué** — sirven de calibración:
- *dental v2*: una **MacBook con el logo de Apple** en el mostrador (marca real en cuadro) y la
  mano izquierda gesticulando al aire en vez de sobre un objeto.
- *dental v3b*: el uniforme salió con un bordado **"BOLVIA"** — marca inventada, y encima con
  falta de ortografía. Es el tercer caso del mismo tropiezo (antes fueron un logo de Nike y una
  gorra de NY): **cuando el prompt describe ropa, el modelo le pone marca.** Mirar el pecho, la
  gorra y la taza de cada imagen antes de aprobar.

## 9-bis. Las capturas de PRODUCTO — por qué no se leen, y por qué NO se falsifican

> Sergio, 2026-08-23: *"en las que muestras el sistema, mejora esas imágenes, no se llegan a
> ver bien… puedes usar higgsfield para generarlas pero que tengan correlación o que sean
> ilustrativas"* + *"mejores visualmente el sistema, no sigue la correlación de estilo de marca"*.

**El diagnóstico, medido mirando el panel del hero a tamaño real (no supuesto):**

**No es falta de resolución.** `public/v2/capturas/panel.webp` es **2160×1620** y se renderiza a
~565 px. Píxeles sobran. Lo que pasa es que **el panel muestra una pantalla ENTERA de app en un
espacio chico**: los rótulos secundarios quedan a 5-6 px reales. Sobra contenido, no faltan
píxeles. Recortar a la región que el titular promete rinde más que subir la resolución.

**Y el producto no sigue la marca.** Confirmado a la vista:

| Qué | En el producto | En la marca |
|---|---|---|
| Logotipo | dibuja el SVG: `aria-label="onia"`, trazados, **minúscula** | **tipea** el wordmark: `Onia<b>.</b>` (`ui.tsx:171`) |
| Verde | pastel / menta claro | `--senal #00d26a`, `--verde-700 #016141`, `--verde-900 #013925` |
| Papel | blanco puro | `--bg #F9FBFA` / `--bg-deep #F3F5F4` |
| Íconos y tipografía | otra familia, sin sistema | la del sitio |
| Moneda | 🔴 `Bs 1.806` y `Bs 1.147,50` **en la misma tarjeta** | un solo formato |

⚠️ **Corregido 2026-08-23.** Acá decía *"dos logos distintos conviven en la misma pantalla"*.
**Falso, y la verdad es más útil:** `onia-platform/public/onia-logo.svg` y el
`brand/v2/onia-logo.svg` de la web son **byte a byte idénticos** (verificado con `cmp`). El
archivo es el mismo.

Lo que difiere es **cómo lo pinta cada superficie**: el producto **dibuja el SVG**
(`BrandLogo.tsx:53` → `aria-label="onia"`, trazados, minúscula), y el sitio **tipea el
wordmark como texto HTML** (`(sitio)/ui.tsx:171` → `Onia<b>.</b>`, mayúscula y punto en
negrita). Por eso se ven distintos aunque el asset sea uno solo.

**Decisión pendiente:** el wordmark es texto o es asset, pero no las dos cosas. Mientras
convivan los dos caminos, cualquier cambio de tipografía los separa de nuevo — que es
exactamente lo que pasó.

### 🔴 El límite: la interfaz NO se dibuja con IA

Se puede generar material **ilustrativo** con Higgsfield. **No** se puede generar una pantalla
del sistema. Tres razones, ninguna estética:

1. Es la regla escrita en el propio código de la home (`(sitio)/page.tsx` ~24): *"Regla de la
   casa: nada de pantallas dibujadas haciendo de prueba."*
2. Es *fabricar producto* — la misma familia de "no fabricar" que prohíbe testimonios y cifras.
3. Ya costó caro: es lo que obligó a revertir la landing v2 en producción el 2026-08-20.

### El orden correcto — lo fijó Sergio, no es invento

De `landing-v3-aprobada-base-clara`: **"funcional + pestañas faltantes → restilar los dashboards
→ recién entonces capturas"**. O sea que "las capturas se ven mal" y "el sistema no sigue la
marca" **son el mismo problema**, y se resuelven en este orden:

1. **Restilar el producto a la marca** — arreglando la CAPA (tokens, logotipo, familia de
   íconos, formateador de moneda), no pantalla por pantalla. Un diff chico en la base y todas
   las pantallas heredan. *En curso, carril `onia-platform`.*
2. **Re-fotografiar**, esta vez **recortando a la región que el titular promete** en vez de
   meter la app entera. Una tarjeta legible vale más que un escritorio completo ilegible.
3. Recién ahí, evaluar si falta algo **ilustrativo** — y que sea ilustrativo de verdad
   (diagrama, esquema, escena), nunca una UI dibujada.

**Bloqueante:** el paso 2 no se hace antes del 1, o hay que fotografiar dos veces.

---

## 9-ter. Interfaz ILUSTRADA — decisión de Sergio, 2026-08-23

> *"no debes usar fotos literales, puedes generar similares con el mismo estilo de marca desde
> higgsfield"* → elegido explícitamente: **interfaz ilustrada (dibujo, no captura)**.

Es compatible con la regla de §1: lo prohibido nunca fue **ilustrar**, fue **hacer pasar un
dibujo por producto**. Una ilustración que se lee como diagrama de marca —y que nadie
confundiría con un screenshot— no afirma nada falso.

⚠️ **El bloque abstracto de forma+color YA SE PROBÓ Y FALLÓ.** `switcher.tsx` lo documenta:
*"se leía como una imagen que no cargó"*. La ilustración tiene que ser **reconocible** como
agenda, caja o panel. Formas abstractas no son una salida.

### El modelo correcto: `recraft_v4_1`, no `text2image_soul_v2`

`text2image_soul_v2` es para fotografía realista de personas — herramienta equivocada. `recraft_v4_1` con
`model_type: "utility_vector"` resuelve el problema de raíz porque **acepta la marca como
parámetro**, no como adjetivo:

```
model_type: "utility_vector"      → salida SVG real
resolution: "1k"                   → 2,5 cr (a 2k son 10 cr, y 1024px sobra)
background_color: "#F9FBFA"
colors: ["#F9FBFA","#F3F5F4","#12100e","#00d26a","#013925","#016141","#86D9B0","#69716D"]
```

Verificado en el SVG generado: los fills salen **exactos** — `rgb(18,16,14)` = `--tinta`,
`rgb(1,57,37)` = `--verde-900`, `rgb(0,210,106)` = `--senal`. La correlación de marca deja de
depender de que el modelo "entienda" un adjetivo. **Y al ser SVG, un color que se escape se
corrige con `sed`, sin regenerar.** Peso: 22-38 KB contra 148 KB de una captura webp.

### 🔴 La trampa: el texto sale como TRAZADOS, no como `<text>`

`grep -c "<text"` dio **0 en los tres** SVG… y al mirarlos tenían **"New Leads"**,
**"Active Projects"**, **"Total Sales"**, **"Cash vs Card"** en inglés, más las cifras
inventadas **"82K"** y **"745"**. Recraft **vectoriza el texto a paths**, así que el grep no lo
ve nunca.

Es la regla de la casa fallando por no aplicarla: **un grep sirve para DESCARTAR, nunca para
CONFIRMAR.** El único chequeo válido es abrir la imagen y mirarla.

### Qué separó el acierto del fallo

De 3 pruebas, sólo pasó la que describía **exclusivamente formas**. Los dos fallos pedían
"un numeral grande" y tarjetas con encabezado — y el modelo llenó esos huecos inventando.

- ❌ `one very big geometric numeral as the hero figure` → devolvió "82K", "745"
- ❌ `a card with a heading` → devolvió "Active Projects"
- ✅ `two short rounded bars standing in place of a heading`
- ✅ `every label, heading and figure is drawn as a plain rounded bar`
- ✅ **cero numerales pedidos**: el gráfico de línea ascendente ya dice "sube" sin cifra

### Registro

| Lote | Modelo | Imágenes | Costo | Resultado |
|---|---|---|---|---|
| 4 | `recraft_v4_1` 1k | 3 | 7,5 cr | **1/3** — agenda ✅; caja y panel con texto inventado |
| 5 | `recraft_v4_1` 1k | 2 | 5 cr | **2/2** ✅ con el método corregido |

Aprobadas y sin cablear (scratchpad): `ui-agenda.svg` · `ui-caja2.svg` · `ui-panel2.svg`.
Detalle menor pendiente: `ui-caja2` trae un glifo **`$`** en la banda inferior — en Bolivia la
moneda es Bs. Cambiarlo por edición del SVG, no regenerando.

**No están cableadas.** Reemplazar capturas reales por ilustración en una superficie de venta
viva es cambio de pieza: necesita el OK de Sergio sobre ESA pieza (regla R5 de §2).

---

## 10. Qué material de `public/` es publicable y qué no

**Recontado carpeta por carpeta el 2026-09-02** contra
`web-factory/apps/onia-platform/public/` — `ls`, no memoria. Las carpetas son las que hay hoy:
`brand · capturas · contexto · fotos · og · recursos`.

| Carpeta | Estado | Detalle |
|---|---|---|
| `public/contexto/**` | ✅ **publicable** | Las 6 fotos de contexto de este doc (`comercio · dental · estetica · importadora · mostrador · servicios`). Gate de §8 pasado una por una, y es una de las dos carpetas que el guard de forma deja pasar. |
| `public/fotos/*.webp` | 🟡 **permitida por forma, NO por estética** | 6 archivos. El guard la deja pasar; el gate de §8 rechaza a dos de ellos — ver abajo. |
| `public/capturas/rubros-onia.webp` | 🔴 **NO cablear en el sitio vivo** | Único archivo de la carpeta. Hoy lo sirve **sólo `components/landing-v1/how-it-works.tsx`**, o sea el archivo `/v1`. Es una captura literal del producto: cablearla en `(sitio)` rompe el guard, que es exactamente lo que el guard existe para impedir. |
| `public/og/onia-rubros.jpg` | 🔴 **NO reutilizar — tiene "MUY PRONTO" impreso** | Sigue en disco **a propósito**: lo usa `src/app/v1/page.tsx`, que conserva sus imágenes tal como se publicaron. El `og:image` del sitio vivo lo dibuja `src/app/(sitio)/opengraph-image.tsx`, no este archivo. |
| `public/brand/**` · `public/recursos/**` | ⚪ **fuera de este doc** | No son material de contexto ni capturas de producto. Se listan para que la tabla cubra las seis carpetas y nadie deduzca que "no está = no existe". |

⚠️ **Corregido el 2026-09-02: esta tabla mandaba a buscar tres cosas que ya no existen.** Decía
`public/rubros/*.webp` **"✅ publicable — los 5 recortes del conmutador"**, y esa carpeta se borró
cuando el conmutador pasó a dibujar cada rubro con divs (`c98543e2`); listaba `public/v2/capturas/**`
y `public/v2/*.webp` como si `public/v2/` existiera, y **no existe**. Los tres renglones sobrevivieron
al cambio porque nadie los volvió a mirar: el commit tocó el código, no el doc que lo describe.

**Por qué era peor que un renglón viejo:** una sesión que leyera "✅ publicable" iba a buscar cinco
archivos que no están y, al no encontrarlos, a **recapturarlos** — reponiendo justo las capturas
literales que Sergio mandó sacar el 2026-09-01. Un doc que declara publicable lo inexistente no
confunde: **fabrica trabajo prohibido.** Es la misma regla que "una promesa que cambia se barre en
TODA la superficie" (`CLAUDE.md` §2), aplicada al revés — cuando el código borra algo, el doc que
lo daba por vivo es parte de la superficie.

**Los `public/fotos/*.webp` viejos NO pasan el gate de §8.** `dentista.webp` y `ferreteria.webp`
son de un lote anterior: sonríen **a cámara**, bata blanca, grade teal-naranja. Son los dos clisés
de rechazo automático. Hoy `ferreteria.webp` lo sirve `components/landing-v1/how-it-works.tsx` —
el archivo `/v1`, que conserva lo publicado y por eso no se toca; `dentista.webp` no lo usa nadie.
No cablearlos en el sitio vivo creyendo que son material aprovechable.
⚠️ El renglón anterior culpaba a `components/landing-v2/rubros.tsx`: **ese archivo ya no existe**
(era la landing v2 rechazada, borrada con ella). Citarlo mandaba a auditar una ruta muerta.

⚠️ **Ojo con el guard: `/fotos/` pasa por FORMA, no por estética.** `src/app/(sitio)/forma.test.ts`
enumera `PERMITIDAS = ["/contexto/", "/fotos/"]` y falla ante cualquier otra carpeta de imagen en
el sitio. Es un gate de "no servir capturas literales del producto", **no** el gate visual de §8:
que el test pase no dice nada sobre si la foto es publicable. Los dos gates se cumplen aparte.

⚠️ **El esquema del MCP exige envoltorio `params`**: `generate_image({params:{model, prompt,
aspect_ratio, quality}})`. Los parámetros sueltos devuelven `Input validation error: params:
Invalid input`. Para varios prompts distintos va `generate_image_batch`; `count` es para
variantes del MISMO prompt.

⚠️ **El esquema del MCP exige envoltorio `params`**: `generate_image({params:{model, prompt,
aspect_ratio, quality}})`. Los parámetros sueltos devuelven `Input validation error: params:
Invalid input`. Para varios prompts distintos va `generate_image_batch`; `count` es para
variantes del MISMO prompt.
