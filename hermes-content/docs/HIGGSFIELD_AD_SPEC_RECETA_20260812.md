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

**Insumos (los tres son imagen fija, y la imagen es gasto trivial: ~0,12 créditos en soul_2 2k):**

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
