# IMAGEN ÚNICA "Necesito vitamina C" — ⛔ **NO SE PUBLICA**

> **Decidido el 10-sep** con la auditoría de las ocho piezas
> ([`AUDITORIA-8-CARRUSELES.md`](AUDITORIA-8-CARRUSELES.md)). **Dos razones, y la primera
> sola ya alcanza:**
>
> 1. **No enseña nada.** La vara del carril es una sola: *¿qué cosa que el lector NO sabía
>    se lleva?* Acá la respuesta es ninguna — es un chiste interno sin dato. Un carrusel
>    que no deja nada gasta alcance y le enseña al lector que tu contenido se puede saltear.
> 2. 🔴 **El panel dice «12 clientes activos · +3 este mes» y las dos cifras son
>    inventadas** (§ más abajo, marcadas en rojo desde el 06-sep como excepción pedida).
>    Es la única de las ocho piezas que afirma algo que no se puede sostener si alguien
>    pregunta.
>
> **Si el chiste se quiere igual, se rehace SIN el panel de clientes:** el resto —Claude,
> café, créditos— es cierto y no cuesta nada. Mientras tanto **su paquete se borró**: un
> ZIP llamado «para-publicar» de algo que no se publica es cómo se publica por error.

**Pieza:** `carousels/out/apple-vitamina-c-inter/lamina-01.png` (1 lámina, 1080×1350).
Patrón `apple-editorial`, **layout B** (grilla 2×2 — referencia #2 del batch del 06-sep).

Es **una sola imagen**, no un carrusel: la referencia también lo es. Formato de humor
seco — el chiste es que las cuatro cosas empiezan con C.

## Las cuatro celdas

| Celda | Qué es | Por qué es honesta |
|---|---|---|
| **Claude** | el logo real | es la única factura de su stack (`$200/mes`) |
| **Clientes** | una línea que sube | **es lo que le falta**, y ése es el remate |
| **Café** | foto de Unsplash | sin comentarios |
| **Créditos** | panel de uso de Claude | en los colores de Claude (crema + coral) con el estallido de la marca: la celda dice "Claude" sin escribir la palabra |

**El remate no está escrito, está en la lista.** Cualquiera lee "Claude, café, créditos" y
se ríe; el que dirige un negocio se detiene en "Clientes" y entiende el chiste completo.

## Caption (IG · copiar tal cual)

Cuatro cosas que necesito para que esto funcione. Tres se compran.

Claude escribe conmigo, el café hace el resto, y los créditos se van en
los artes. Las tres tienen precio y las tres se resuelven con una tarjeta.

La cuarta no. Los clientes no se compran: se salen a buscar, uno por uno,
y es la única de las cuatro que ninguna herramienta te va a resolver.
Podés tener el mejor sistema del mundo montado — si nadie sabe que
existe, sigue siendo un proyecto, no un negocio.

Por eso esta semana estoy haciendo eso: menos construir, más hablar.

¿Cuál de las cuatro te está costando más a vos? Escribí cuál —Claude,
café, créditos o clientes— y te digo qué haría yo.

## Versión X / LinkedIn

Cuatro cosas que necesito para que esto funcione: Claude, café, créditos y clientes.

Tres se compran con una tarjeta.

La cuarta no: los clientes se salen a buscar, uno por uno, y es la única que
ninguna herramienta te resuelve. Podés tener el mejor sistema montado: si nadie
sabe que existe, es un proyecto, no un negocio.

### ⚠️ Por qué cambió el copy el 07-sep

La versión anterior decía **"tres las tengo"** — o sea, que la cuarta, clientes, le
faltaba. Pero la lámina muestra un panel con **"12 clientes activos · +3 este mes"** y una
curva subiendo: **la imagen desmentía al texto**, y en la misma pieza.

Ahora el eje no es *tener o no tener* sino **se compra o no se compra**: las tres primeras
se resuelven con una tarjeta y la cuarta se sale a buscar. Eso funciona con el panel
delante, sostiene el mismo mensaje, y evita que el copy afirme un número de clientes —
que es justo el dato que no conviene reforzar (ver la advertencia roja de más abajo).

## Alt text

> Cuadrícula de cuatro tarjetas blancas sobre fondo gris claro, bajo el título "Necesito
> vitamina C". Arriba: el logo de Claude y un gráfico de línea ascendente etiquetado
> Clientes. Abajo: una taza de café vista desde arriba y un panel oscuro de compra de
> créditos.

## De dónde sale cada cosa

| Afirmación | Fuente |
|---|---|
| Claude está en su stack | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1 — Claude Max, US$200/mes |
| el precio de los tokens | anthropic.com/claude-fable-and-mythos-5-1 — caché $0,25/M. Es la misma cifra que sostiene el carrusel de Fable |
| le faltan clientes | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.2: *"el producto no tiene un problema de rentabilidad, tiene un problema de clientes"* |
| la taza | Unsplash, licencia y autor en `objetos/CREDITOS.md` |

## 🔴 LEER ANTES DE PUBLICAR: hay dos cifras inventadas

Sergio Urcullo pidió el 06-sep "números falsos pero realistas". Va anotado acá porque
choca de frente con una regla suya en `CLAUDE.md`:

> **No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras.

| Cifra | Estado | Detalle |
|---|---|---|
| **12 clientes activos** | 🔴 **INVENTADA** | hoy son cero |
| **+3 este mes** | 🔴 **INVENTADA** | ídem |
| **$0,25 por millón** | ✅ real | precio público de lectura de caché de Fable 5.1, anthropic.com (leído 06-sep) |

**Se eligieron chicas a propósito.** Un "12" lee como arranque; un "340%" sería a la vez
más falso y mucho más caro de sostener el día que alguien pregunte. Aun así son falsas, y
en una cuenta cuyo diferencial es no inflar nada, ése es el riesgo real de esta pieza.

**Si preferís sacarlas:** el gráfico funciona igual sin números — el chiste vive en la
lista, no en la cifra. Es un render.

## Lo que NO hace, y por qué

⚠️ **El panel de tokens NO muestra su saldo ni su consumo.** Muestra el **precio público**
($0,25 por millón), que es un dato de Anthropic y no de su cuenta. Su consumo real no está
registrado en ningún lado del repo, así que ponerlo habría sido inventar una cifra más.

⚠️ **La primera versión mostraba los créditos de Higgsfield** sobre un panel oscuro neutro.
Sergio Urcullo lo marcó el 06-sep: no se leía de quién eran. Ahora usa la crema y el coral
oficiales de Claude, con el estallido de la marca — la celda se identifica sola.

⚠️ **No nombra a ningún cliente, ni real ni inventado.** La cifra es agregada; no hay
logos, nombres ni testimonios. Ésa es la línea que no se cruza ni con permiso.
