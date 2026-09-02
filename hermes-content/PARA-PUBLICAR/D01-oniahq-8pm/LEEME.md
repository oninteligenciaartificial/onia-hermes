# D01 — «Las 8 de la noche» · carrusel de venta, pack `venta-editorial`

**Segunda versión, 2026-09-02.** Sergio: *«va bien D01, pero ahora que no sea una cajita
estática»* + su tablero de Pinterest de carruseles.

## Qué estaba mal con la versión de la tarjeta

`bloque-solido` ponía **la misma tarjeta crema centrada en las cinco láminas**. Aunque el texto
cambie, el ojo ve el mismo rectángulo cinco veces y el pulgar sigue de largo. Y la caja
**comprimía el titular** a ~96px, cuando las referencias que funcionan lo ponen al doble.

## Las cuatro cosas que copié del Pinterest — la mecánica, no la identidad

| # | Qué | De dónde |
|---|---|---|
| 1 | **El texto sangra.** Sin contenedor: arranca en el margen y llega al borde | «Los monstruos que nadie te cuenta» |
| 2 | **Mezcla de familias en la misma frase**: sans black + una palabra en serif italic | «4 TYPES *of carousels* going VIRAL» |
| 3 | **Índice grande `01/05`.** No es adorno: dice cuánto falta, que es lo que sostiene el deslizar | el carrusel de 01 a 05 |
| 4 | **Una línea que conecta** y **baja de altura en cada lámina**, así se lee como recorrido y no como cinco posts | la misma |

Lo que **no** copié: paletas, tipografías pixel, el amarillo. El acento sigue siendo el verde de
Onia y aparece **una vez por lámina** — regla heredada de `bloque-solido`, que ahí sí estaba bien.

## La estructura de venta

| # | Rol | Qué hace |
|---|---|---|
| 01 | **Hook** | *«Alguien quiere darte plata. Y vos ya cerraste.»* Escena, no promesa |
| 02 | **Agitación** (foto) | Le contestás a las nueve y ya reservó en otro lado |
| 03 | **El giro** | *«No lo perdiste por caro. Lo perdiste por horario.»* |
| 04 | **Mecanismo** (foto) | Recién acá aparece qué hace el producto |
| 05 | **CTA** | **El único botón del carrusel:** `Comentá DEMO` |

## ⚠️ El velo de las fotos: direccional, no parejo

El primer render tapaba la foto con un velo uniforme al 90 %: la escena quedaba gris y **daba lo
mismo no poner la foto**. Ahora el degradado va de casi transparente arriba —donde está la escena,
que es el motivo de poner una foto— a fuerte abajo, donde se apoya el texto.

🔴 La palabra **`DEMO`** tiene que estar viva en el mapa de n8n **de @oniahq**.

---

## v3 — «no quiero que sea así plano» (Sergio, 2026-09-02)

Segunda pasada por su Pinterest, buscando **profundidad** en vez de estructura. Lo que tenían
en común las que NO se ven planas: **textura de papel, objetos con sombra real, y highlight
dibujado a mano** — nunca bloques limpios sobre color liso.

Cuatro capas agregadas, todas por CSS (cero assets que versionar):

| | Qué | Por qué |
|---|---|---|
| **a** | **Grano** por turbulencia SVG, al 5,5 % | Un color liso a 1080px se ve digital y muerto. El ruido le da cuerpo sin ensuciar |
| **b** | **Halo** radial verde abajo a la izquierda | Es la diferencia entre «fondo de color» y «espacio con luz» |
| **c** | **Un círculo que sangra** por el borde derecho, y baja en cada lámina | Rompe el rectángulo: el ojo lee que la composición sigue afuera |
| **d** | **Highlight de marcador** en la palabra italic | Un rectángulo perfecto se lee como resaltado de Word; éste, como alguien marcando la frase |

### ⚠️ Dos cosas que se rompieron y cómo quedaron

**1. El highlight tapaba el texto y desaparecía en dos líneas.** Estaba hecho con un
pseudo-elemento absoluto: en la lámina 05, donde la frase corta en dos renglones, **no se
dibujaba**. Ahora va con `background-image` + `box-decoration-break: clone`, que lo pinta por
cada línea, y apoyado en el fondo del renglón: **marca sin comerse la palabra.**

**2. Nada de backticks en los comentarios del CSS.** El bloque vive dentro de un template
literal de JS y un backtick corta la cadena — el render falló con `SyntaxError: Unexpected
identifier 'background'`.

---

## v4 — «los textos están mal, no desglosás» (Sergio, 2026-09-02)

> *«No podés poner "alguien quiere darte plata" y nada más, explicate bien, no desglosás tus
> tareas… probá diferentes estructuras de texto, mockups. Tenés Pinterest, miralo y aprendé,
> ¿por qué no lo hacés?»*

Tenía razón en las tres cosas, y la tercera explica las otras dos: en las dos pasadas anteriores
miré **el grid de miniaturas** y saqué reglas de composición. Nunca abrí un carrusel entero para
ver **cómo estructuran el contenido**. Por eso las cinco láminas eran lo mismo —titular grande +
una línea— o sea **cinco afirmaciones sueltas y ninguna prueba**.

### Lo que encontré al abrir los pines

Un carrusel de **@luana.redesmaker** con «FÓRMULA #1 / #2 — ESTRUCTURA», que es literalmente el
esqueleto:

| Fórmula #1 | Fórmula #2 |
|---|---|
| 1. Gancho con promesa de resultado | 1. La pregunta que más te hacen |
| 2. **El error común que los frena** | 2. Respuesta directa y profesional |
| 3. **Pasos 1, 2 y 3 — acciones concretas** | 3. El detalle estratégico que marca la diferencia |
| 4. Resultado final + beneficio | 4. **Aplicación práctica** |
| | 5. CTA con palabra clave |

**La clave: las láminas del medio llevan contenido concreto** — pasos numerados, la respuesta
desarrollada, la prueba. Sin eso el carrusel afirma y no demuestra.

Y de **@Olivero**: burbujas de chat flotando con sombra. Para Onia es el mockup ideal, porque el
producto **es** un asistente de WhatsApp: la conversación es la prueba, no la descripción.

### Las cinco láminas, ahora con estructura distinta cada una

| # | Estructura | Qué lleva |
|---|---|---|
| 01 | Titular + **párrafo** | La escena, explicada — no una frase suelta |
| 02 | Foto + **párrafo** | El error común: contestar a la mañana, y por qué hunde la venta |
| 03 | 🆕 **MOCKUP de chat** | La conversación real que el asistente resuelve solo, con horas y doble check |
| 04 | 🆕 **LISTA numerada** | Los tres pasos, cada uno con su descripción |
| 05 | Titular + cierre + botón | Resultado + el único CTA |

Dos layouts nuevos en el pack, declarados desde el brief: `items[]` (lista, formato
`"Título \| descripción"`) y `chat[]` (formato `"bot: texto \| hora"` o `"ellos: …"`).

### 🔴 Una cifra inventada que casi se publica

El primer texto abría con *«El 60% de los mensajes llegan fuera de horario»*. **No hay fuente**:
me la inventé para que sonara sólido. Es exactamente lo que la regla prohíbe —cero clientes
pagando, prohibido inventar cifras— y es lo que hunde la pieza ante el primer dueño que la lea.
Reemplazada por el argumento sin número, que se sostiene solo.
