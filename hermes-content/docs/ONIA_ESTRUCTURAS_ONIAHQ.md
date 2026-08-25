# Estructuras de contenido de @oniahq — carruseles y reels

> Pedido de Sergio, 2026-08-24: *"en Onia pueden salir personajes ficticios o Lucía misma,
> buscá diferentes diseños y seguí, armá las estructuras de contenido y reels"*.
>
> Esta página dice **con qué diseño se hace cada cosa y con qué estructura**. Los formatos
> con código (P01-P24) viven en `ONIA_MANUAL_DE_FORMATOS_20260813.md`; la decisión sobre
> personajes, en `ONIA_FORMATOS_ADENDA_PERSONAJES.md`.

## 1. Un diseño por pilar, y el motivo

El error a evitar no es la monotonía: es el collage. Si cada pieza se ve distinta porque sí,
el feed no significa nada. Acá **cada pilar tiene su diseño, y el diseño dice de qué se está
hablando antes de leer una palabra.**

| Pilar | Pack | Se ve así | Por qué ese |
|---|---|---|---|
| **El dolor del rubro** | `editorial-photo` | Oscuro, serif, foto a sangre alternada con láminas de texto | Es de noche, es pérdida, es lo que no mirás. La foto pone al lector adentro de su propio local |
| **La prueba / qué hace** | `dark-product` | Negro, sans grotesk en mayúsculas, capturas reales flotando | El dato manda. La pantalla es el argumento, no el adorno |
| **Bolivia (fiscal, normativa)** | `bright-retail` | Claro, crema y verde, cinta ondulada | Es informativo, es de día, y **no debe dar miedo**. El pack oscuro haría ver una prórroga como una amenaza |
| **Escenificación** | reel P16 | Video vertical, plano de situación + rótulo en 2ª persona | Es la única forma de mostrar el problema en vez de describirlo |

🔴 **`bright-retail` necesitaba un kit de marca propio.** Caía por defecto al de Nuvia y
firmaba las piezas de @oniahq con **logo, paleta arcoíris y el tagline de otra marca**. Se
agregó el kit `onia` a `carousel_render.js` el 2026-08-24. Si aparece "EVERYTHING FOR
EVERYONE" en una pieza de Onia, el kit no se está aplicando.

## 2. Las piezas que existen hoy

| Pieza | Pilar | Pack | Palabra | Estado |
|---|---|---|---|---|
| **O01** · Tu negocio cerrado | Dolor | `editorial-photo` | SISTEMA | Producido, sin publicar |
| **O02** · Ferretería, la plata no se pierde en el mostrador | Dolor | `editorial-photo` | SISTEMA | Producido, sin publicar |
| **O03** · Faltan 37 días para el 30 de septiembre | Bolivia | `bright-retail` | SISTEMA | Producido, sin publicar |
| **O04** · Nadie te explica qué hace la IA | Prueba | `dark-product` | SISTEMA | Producido, sin publicar |
| **R01** · Son las 10 y seguís contestando | Escenificación | reel P16 | SISTEMA | Producido, sin publicar |

## 3. La estructura del carrusel — 7 láminas, siempre

Las cuatro piezas usan el mismo esqueleto. **La constancia es la marca**; lo que cambia es
el diseño según el pilar.

| # | Rol | Qué hace |
|---|---|---|
| 1 | **Portada** | Gancho en 2ª persona. Nunca el nombre del producto. Píldora con la serie |
| 2 | **Aterrizaje** | Traduce el gancho a la situación concreta del lector |
| 3 | **La prueba** | Un número, una captura o un caso literal. Sin esto es una opinión |
| 4 | **El giro** | Dónde está el costo real, que casi nunca es donde el lector cree |
| 5 | **`role: save`** | La lámina que se guarda: el dato duro, la lista, la norma citada |
| 6 | **Qué hacer** | Pasos accionables **que el lector puede dar sin nosotros** |
| 7 | **`role: cta`** | La palabra clave + qué recibe a cambio. Recompensa concreta, no "te contacto" |

**Reglas que no se negocian:**

- **Segunda persona siempre.** "Tu negocio", "vos", "te pasa". Nunca "las empresas".
- **Termina en plata o en tiempo**, nunca en "eficiencia".
- **`comment_reward` declarado en el brief.** Sin recompensa nombrada, la palabra clave no
  se pide: se mendiga. El motor solo dibuja la línea de "Guardalo" si hay recompensa.
- **La lámina 6 le sirve aunque no nos contrate.** Es lo que hace que valga la pena guardarla.
- 🔴 **Nada que no se pueda sostener.** Cero clientes pagando ⇒ cero testimonios, cero
  logos, cero cifras de resultados.

### La regla del dato honesto (la que más se rompe)

O03 es el ejemplo a copiar: **decimos nosotros primero que el SIN tiene un portal gratis.**
Vender "es obligatorio, compranos" es falso y se refuta con un Google — se pierde la venta
**y** la confianza. El diferenciador nunca es cumplir la ley: es no tipear dos veces.

Lo mismo con el plazo: se nombran las dos prórrogas que ya hubo (RND 102500000036 y RND
102600000007) y se dice que una tercera es posible. **El gancho es el timing, no el miedo.**

## 4. La estructura del reel — el molde P16

R01 es la plantilla. **20 segundos, 4 tiempos de 5 s**, sin voz, sin cara, sin música cara.

| t | Plano | Rótulo (2ª persona) |
|---|---|---|
| 0-5 | Situación: chat, mostrador, cuaderno | El problema, en presente: *"Son las 10 y seguís contestando"* |
| 5-10 | El costo invisible | *"Mañana no vas a recordar quién preguntó"* |
| 10-15 | La pantalla real haciendo la cosa | *"El sistema sí"* |
| 15-20 | El resultado, en la pantalla | *"Comentá SISTEMA"* |

**Cómo se arma, técnicamente:**

1. Capturas reales del producto (o b-roll de Lucía) → paneo lento con `ffmpeg`.
2. Placas con `make-mockup.mjs --template quote`.
3. Montaje con `overlay-visuals.mjs`, `marginY: 0.20` para no chocar con la UI de Instagram.

🔴 **Dos trampas de rendimiento, documentadas en `reel-R01/build.sh`:**

- **`zoompan` tardaba más de 10 minutos por clip.** Se reemplaza por cover-scale + `crop`
  con desplazamiento en función de `t`.
- **`crop` fijo revienta con imágenes apaisadas.** El paneo tiene que ser consciente del eje:
  se escala primero con `force_original_aspect_ratio=increase` y recién ahí se recorta.

**Y una de lectura:** si dos planos salen de la misma captura, el segundo **panea al revés**.
Sin eso se lee como plano repetido y el espectador se va.

## 5. Personajes: qué se puede y qué no

Resumen; el detalle y la línea completa están en `ONIA_FORMATOS_ADENDA_PERSONAJES.md`.

| ✅ | ❌ |
|---|---|
| Un personaje **vive el problema** (atiende, anota, cierra caja) | Un personaje **dice que compró** o que le funcionó |
| Lucía **explica**, declarada como IA | Lucía **testimonia** como si fuera clienta |

**Prueba antes de publicar:** si un espectador pudiera pensar que esa persona es cliente de
Onia, la pieza está mal.

⚠️ **Lucía en @oniahq va como invitada, no como presentadora.** Si aparece seguido, las dos
cuentas se vuelven la misma y desaparece el motivo de tener dos.

## 6. Los recortes como zona de prueba

O04 se renderizó primero con **la misma captura en las 7 láminas**. Se veía bien y no probaba
nada: el mockup era relleno. La corrección fue partir la captura en **cinco recortes**, y que
la lámina que cita el ticket muestre **ese** ticket.

| Recorte | Qué muestra |
|---|---|
| `panel-bandeja.png` | El contador "1 propuesta esperando tu aprobación" |
| `panel-ticket.png` | El ticket de cobranza citado en el texto |
| `panel-curva.png` | Cobrado hoy + la curva de la semana |
| `panel-fiado.png` | Fiado en la calle, con montos |
| `panel-pagos.png` | Cómo te pagaron, por método |

Para eso hubo que agregar **objeto por lámina** a `dark-product` y `dark-neon`
(`slide.object`, con `--object` como respaldo). `bright-retail` ya lo tenía.

**La regla:** si el texto nombra algo concreto, la imagen tiene que mostrar **eso**, no una
foto de la app en general.

**Cómo se sacan los recortes sin adivinar:** se le tira una grilla encima a la captura
(`drawgrid`), se leen las coordenadas, y recién ahí se recorta. Recortar a ojo produjo tres
tandas cortadas a mitad de tarjeta antes de que esto quedara escrito.

## 7. La trampa de la cartelería en inglés

Los fondos generados traen carteles en inglés porque el prompt delega el estilo a revistas
anglosajonas. Ya salieron un **"CLOSED"** en una tienda y una revista **"Grain & Good"** — y
llegaron a estar publicables en O02 y en el primer O03.

**Se resuelve eligiendo la toma o encuadrando el cartel afuera**, nunca agregando "no text"
al prompt: pedir ausencia produce imágenes muertas (regla 4 del molde M03).

⚠️ **O02 todavía tiene el "CLOSED" en la portada y la revista en inglés en la lámina 2.**
Pendiente de reemplazo antes de publicarla.

## 8. Lo que sigue

1. 🔴 **Reemplazar los dos fondos con texto en inglés de O02.**
2. 🔴 **El recurso de la palabra SISTEMA** — hoy la palabra promete algo que no está escrito.
   Sin recurso, el DM llega vacío.
3. Escribir `capture-web.mjs`, `_reel.html` y `film-pattern.mjs`: tres archivos que
   desbloquean cuatro formatos de costo cero (P02, P04, P12).
4. Producir el pilar de escenificación con el b-roll de Lucía, que ahora se puede usar.
