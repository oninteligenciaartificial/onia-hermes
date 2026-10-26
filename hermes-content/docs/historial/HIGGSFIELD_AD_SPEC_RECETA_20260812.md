# Receta AD SPEC — comercial de marca desde 3 imágenes (Higgsfield + Seedance 2.5)

Replicable con la cuenta y los assets que ya tenemos. Sale de analizar un spec ad de Puma
hecho por Mindshft.ai: https://www.instagram.com/p/Db5k7VGsLbu/ (21,5 s).
Lectura completa: `../references/video-intake/transcripciones/2026-08-12-Instagram-Db5k7VGsLbu.md`.

## Qué enseña el video (está todo en los primeros 3 segundos)

Antes del comercial muestra sus tres insumos, rotulados en pantalla:

```
Avatar IA          -> el rostro de la modelo (imagen fija)
Paisaje IA         -> la cancha de tenis (imagen fija)
accesorios + Ropa  -> zapatillas Puma + raqueta (imagen fija)
```

De ahí sale un comercial de 20 s con la modelo jugando: primeros planos de las zapatillas en
la pista, saque a contraluz, revés, plano en blanco y negro detrás de la red, cierre con el
logo. Consistencia de cara, de prenda y de escenario en todos los planos.

El marco superpuesto (`AD SPEC` · `Nº: 04` · `DIRECTOR: Mindshft.ai` · fecha) es parte del
formato: se presenta como pieza de dirección, no como demo de herramienta. Eso es lo que lo
hace vendible en vez de parecer una prueba técnica.

## Por qué esto nos sirve: confirma nuestro esquema y le agrega una pata

Ya teníamos escrito que **Soul + texto es el ÚNICO método para una cara consistente**, y que
**Reference Elements sirve solo para objeto o prenda**, nunca para la cara. El video hace
exactamente eso, sin decirlo: el avatar va por un lado, la ropa y los accesorios por otro.

Lo nuevo es la **tercera pata: el escenario como insumo propio**. Nosotros hoy describimos el
lugar en el prompt; ellos lo fijan con una imagen. Eso es lo que evita que la cancha cambie
entre plano y plano.

## La receta con nuestros assets

**Insumos (los tres son imagen fija, y la imagen es gasto trivial: ~0,12 créditos en text2image_soul_v2 2k):**

| Insumo | De dónde sale acá |
|---|---|
| Avatar | Soul ya creado (Lucía, Mara o Sergio). **Nunca** foto de una persona real sin consentimiento |
| Escenario | generado con el mismo Soul-less pipeline, o foto real del local del cliente |
| Producto / prenda | **foto real del producto del cliente**, no generada — es lo que se está vendiendo |

**Guion:** usar la estructura por escenas con timestamps que ya está documentada
(`../references/video-intake/2026-08-11-seedance-prompt-por-escenas-timestamps.md`):

```
Scene 1 — <nombre> (0.0s–3.0s)
<encuadre y ángulo> · <comportamiento de cámara> · <qué queda en foco y qué sale> · <luz>
Scene 2 — ...
```

Para un comercial de 20 s: 6-7 escenas. El patrón del video de Puma, que sirve de molde:

1. producto en contexto, primer plano (las zapatillas en la pista)
2. rostro, plano cerrado, con textura real (sudor, esfuerzo)
3. acción principal, plano medio
4. plano estilizado que rompe el ritmo (el blanco y negro)
5. acción a contraluz
6. plano abierto del escenario
7. cierre: producto + logo

**Cierre de marca:** logo sobre fondo limpio, 1-2 s. Y el marco `AD SPEC / Nº / DIRECTOR /
fecha` si la pieza se muestra como portafolio.

## Gates — leer antes de generar

- **Imagen: libre.** Los tres insumos se pueden generar sin pedir permiso.
- **Video: permiso explícito de Sergio, caso por caso.** Un comercial de 20 s en 6-7 escenas es
  una generación larga: **medir el costo unitario antes de meterlo a producción continua.**
- **Verificar primero (gratis):** que Seedance 2.5 esté en la cuenta ULTRA y a cuántos créditos
  sale la generación. Consultar el catálogo no cuesta. Esto es la tarea V-3 de PENDIENTES.
- **No fabricar la marca.** Si se hace un spec ad de una marca real sin encargo, se presenta
  como **spec** (ejercicio de dirección), nunca como campaña oficial ni con el visto de la
  marca. El video de referencia hace exactamente eso y por eso es legítimo.
- **Producto real, foto real.** Generar el producto del cliente con IA es inventar el producto.

## El ángulo comercial (esto es lo que lo vuelve plata, no demo)

ONIA vende a **comercio minorista e importadora**, entre otros rubros. Un comerciante boliviano
no tiene cómo filmar un comercial: no hay presupuesto de producción, ni modelo, ni set.

Con esta receta, de **tres fotos** sale una pieza de 20 s. El pitch no es "te hago un video con
IA" — es *"mandame una foto de tu producto y te muestro cómo se vería tu comercial"*. Una pieza
hecha para un prospecto real, antes de que compre, es el argumento de venta más fuerte que
tenemos disponible sin filmar nada.

Encaja con lo que ya está encolado: es el mismo movimiento que las piezas antes/después de
webs — producir prueba con material que ya existe, para dejar de vender a precio de lanzamiento.

## Lo que NO hay que copiar del video

- La marca. Puma es de ellos; un spec ad de Puma no nos sirve de portafolio para vender en
  Santa Cruz. Se hace con un producto de un prospecto real o de Bolivian Electric.
- La música y el audio: es de ellos.
- El realismo del rostro como argumento. La cara IA sigue teniendo que declararse cuando la
  pieza es de ONIA, según la regla de etiquetado que ya tenemos.


---

## Capacidades reales de Seedance 2.5 (del anuncio OFICIAL de Higgsfield)

Segunda fuente del mismo día: https://www.instagram.com/p/DbwPW9VvZ9H/ (68 s, anuncio de
Higgsfield). Es marketing del proveedor, pero **primera parte** — no un creador repitiendo.
Verbatim de los rótulos:

| Capacidad | Lo que dice textual |
|---|---|
| **50 INPUTS** | *"Mix prompts with up to 50 multi-image inputs including character, shoes, locations, items, motion references, 3D elements and style."* |
| **VIDEO2VIDEO** | *"Transform existing footage or animation into fully rendered shots. Precisely preserve original motion and camera movements."* |
| **UP TO 30 SECONDS** | por toma |
| Cámara | *"Lifelike physics and complex camera movements with precise control over trajectory"* |
| Actuación | lip sync y expresiones faciales mejoradas |
| Piel y luz | subsurface scattering, micro-shading, geometría facial |

**Queda verificada la cifra de "50 referencias"** que en la ficha del 9-ago estaba marcada como
afirmación sin fuente de un creador. La lista de tipos —character, shoes, locations, items— es
exactamente la estructura de tres insumos del spec ad de Puma: nuestra receta es el caso mínimo
de una capacidad que llega hasta 50.

### Lo que cambia el juego: VIDEO2VIDEO

Preservar el movimiento y la cámara del material original significa que **el cliente puede
filmar con su celular** y nosotros re-renderizamos cinematográfico. Para un comerciante de
Santa Cruz eso elimina el modelo, el set y la producción: graba su producto en el mostrador y
sale una pieza de marca.

Es un pitch distinto y más fácil de creer que "te genero un comercial de la nada": *"grabalo
con tu celular como puedas, yo lo convierto"*.

### 🔴 URGENTE Y CON PLAZO — verificar antes de planificar nada

El anuncio dice `33 DAYS UNLIMITED` / `UNLIMITED FOR 33 DAYS ON HIGGSFIELD.AI`, marcado como
`LIMITED OFFER`.

**Si eso aplica a nuestra cuenta ULTRA, el gate de gasto de video se cae durante la ventana** —
y toda la regla de "video sólo con permiso caso por caso" cambia mientras dure.

Lo que hay que verificar (consultar es gratis, no gasta créditos):

1. ¿La oferta está activa en NUESTRA cuenta, o es sólo para planes nuevos?
2. ¿Desde cuándo corre? **La ventana puede haber empezado ya y estar consumiéndose sola.**
3. ¿"Unlimited" cubre Seedance 2.5 o sólo modelos más baratos?
4. Si es real: ¿qué producimos en esos días que de otro modo no podríamos pagar?

**No planificar producción masiva antes de responder esas cuatro.** Y si resulta cierto, el
plan no es "generar mucho": es generar **lo que quedó encolado y bloqueado por costo** — las
piezas de portafolio, el spec ad para un prospecto real, el reel de Lucía con guion por escenas.


---

# ✅ VERIFICADO EN LA CUENTA — 2026-08-12 (consulta gratis, cero créditos)

Consultado con el MCP de Higgsfield: `balance` y `models_explore`. **Tres cosas que este mismo
documento afirmaba quedan corregidas.** Se dejan escritas las dos versiones para que nadie
repita la equivocada.

| Lo que decían los videos | Lo que tiene la cuenta |
|---|---|
| "Seedance **2.5**" | ~~NO existe en el catálogo~~ → **al 15-ago SÍ existe**, con `video_edit`, `video_extension` y hasta 30 s. La verificación del 12-ago fue correcta ESE día; el catálogo cambió |
| "hasta **30 segundos** por toma" | **4 a 15 s** por toma (`duration` min 4, max 15) |
| "**33 DAYS UNLIMITED**" | `unlim: {available: false, remaining: null, expires_at: null}` → **no aplica a nosotros** |

**Cuenta:** plan `ultra`, **2.862,68 créditos**.

## La buena noticia: la receta funciona igual, con Seedance 2.0

`seedance_2_0` acepta exactamente los roles que la receta necesita:

```
medias.roles = start_image · end_image · image_references · video_references · audio_references
```

- **`image_references`** → los tres insumos (avatar, escenario, producto). La receta de 3
  imágenes corre sin cambios.
- **`video_references`** → **Video2Video ya existe en 2.0**. El pitch de "grabalo con tu celular
  y yo lo convierto" es viable hoy, no espera a 2.5.
- Tags del modelo: `reference · identity · consistent · product · multi-sku · e-commerce`. Está
  pensado literalmente para vender producto — que es nuestro caso de comercio e importadora.
- Resolución hasta `4k` con `mode: std`; `mode: fast` es más barato y llega a 720p.
- `generate_audio` nativo, y `genre` como pista cinematográfica (auto/action/drama/epic...).

## Qué cambia en el plan por esto

1. **El gate de costo SIGUE EN PIE.** No hay ventana ilimitada. Video = permiso explícito de
   Sergio, caso por caso, como estaba.
2. **Un comercial de 20 s no es una generación: son 2 o 3.** Con tope de 15 s por toma, la
   pieza se arma por escenas y se une después. Eso encaja bien con el guion por escenas —
   cada escena es una generación corta— pero **multiplica el costo**: presupuestarlo así.
3. **Prototipar con `seedance_2_0_mini` y `mode: fast`**, no con std/4k. Se valida la
   estructura barata y recién después se paga la versión buena.
4. Antes de la primera generación real, medir el costo unitario con `get_cost` de UNA toma
   corta. Sigue siendo la tarea V-3 y sigue sin hacerse.

**Lección de método:** los dos videos son marketing de Higgsfield anunciando un modelo que la
cuenta todavía no expone. Sirve para saber a dónde va la herramienta, no para planificar
producción. Toda capacidad se confirma contra `models_explore` antes de prometer nada.


---

# ✅ V-3 RESUELTA — costo de video MEDIDO (2026-08-14)

La tarea que quedaba pendiente desde el 12-ago. **Ya no se presupuesta a ojo.**

## La medición

```
balance antes    2.857,94
1 toma real      seedance_2_0_mini · 4 s · 480p · 9:16 · generate_audio por defecto (true)
balance despues  2.853,94
                 ------------
diferencia         4,00 creditos     job ed3622b1-a742-47bd-a112-30ec96d168c6
```

**`get_cost: true` habia preflighteado exactamente 4.** Coincide al centavo, asi que
**`get_cost` es confiable en este modelo y el resto de la tabla se levanto GRATIS**, sin
generar nada mas.

## Tarifario completo (medido/preflighteado, no estimado)

| Modelo | mode | Resolución | 15 s | **cr por segundo** |
|---|---|---|---|---|
| `seedance_2_0_mini` | — | 480p | 15 | **1,00** |
| `seedance_2_0_mini` | — | 720p | 37,5 | **2,50** |
| `seedance_2_0` | fast | 480p | 22,5 | **1,50** |
| `seedance_2_0` | fast | 720p | 52,5 | **3,50** |
| `seedance_2_0` | std | 720p | 67,5 | **4,50** |
| `seedance_2_0` | std | 1080p | 135 | **9,00** |
| `seedance_2_0` | std | 4k | 330 | **22,00** |

**El precio es lineal por segundo.** 4 s costaron 4 y 15 s cuestan 15 en la misma config.

### Corrección a la ficha del modelo

`seedance_2_0_mini` **no tiene parámetro `mode`** — ese es del `seedance_2_0` completo. En mini
los controles son `resolution` (480p/720p) y `bitrate_mode`. Pedirle `mode: fast` no hace nada.

### El tope de 15 s cuesta trabajo, no créditos

Como el precio es lineal, partir 21 s en 15+6 sale **igual** que una sola toma de 21 s. El tope
**no encarece la pieza**: encarece la operación (más tomas que empalmar, raccord de luz y
vestuario que cuidar, más chances de tener que rehacer una). Presupuestar créditos por segundo
total; presupuestar TIEMPO por cantidad de tomas.

## Presupuesto de las 3 piezas generativas (9:16)

| Pieza | Duración | Tomas | Prototipo<br>mini 480p | Publicable<br>2.0 fast 720p | Premium<br>2.0 std 1080p |
|---|---|---|---|---|---|
| **AD SPEC** | 21 s | 2 (15+6) | **21 cr** | 73,5 cr | 189 cr |
| **Video2Video** | 41 s | 3 (15+15+11) | **41 cr** | 143,5 cr | 369 cr |
| **Dos que caminan** | 45 s | 3 (15×3) | **45 cr** | 157,5 cr | 405 cr |
| | | **Total** | **107 cr** | **374,5 cr** | 963 cr |

Sumar aparte, y es despreciable: los 3 insumos de imagen **0,36 cr** con `text2image_soul_v2` (o 6 cr si van
con `nano_banana_2` 2k, que es la vía ganadora para cara) · narración ElevenLabs ~2,4 cr.

**Contra un saldo de 2.853 cr:** prototipar las tres en mini 480p cuesta **107 cr = 3,7% del
saldo.** Es dinero de bolsillo.

### La recomendación

**Prototipar las tres en `mini` 480p (107 cr), elegir la que funciona, y re-renderizar SOLO
esa en `2.0 fast` 720p.** Rehacer la ganadora en calidad publicable suma entre 73 y 157 cr según
la pieza. Ir directo a `std` 1080p sin haber visto el corte es pagar 9 cr/s por algo que
todavía no sabés si sirve — y 4k a 22 cr/s no tiene ningún sentido para vertical de redes.

Reservar ~20% extra para retomas: con 3 tomas por pieza, que una salga mal es lo esperable,
no la excepción.

## ⛔ "Show Cinema" NO existe

El reel que lo nombraba para generar la imagen de escenario **no aplica a esta cuenta**.
Verificado con `presets_show`: los ~60 presets son de personaje (EARTH ZOOM, ORBIT 360,
CGI BREAKDOWN, RED CARPET…), ninguno se llama así ni cumple esa función.

**El escenario se genera como una imagen fija más**, con la misma vía que el resto de los
insumos. La receta de 3 insumos no cambia; lo que se cae es el atajo del preset.

Cuarto video del corpus que afirma algo que la cuenta no tiene, después de "Seedance 2.5",
"30 s por toma" y "33 días ilimitado". **Todo lo que sale de un reel se verifica contra la
cuenta antes de escribirlo como plan.**
