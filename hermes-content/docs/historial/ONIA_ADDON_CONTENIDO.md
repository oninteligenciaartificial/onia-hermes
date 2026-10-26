# Add-on de contenido — decisión y alcance

> Decidido por Sergio el 2026-08-23. **No es un producto nuevo**: es un add-on de Onia
> Platform, como el chatbot. Comprador: entre agencia y dueño de negocio. Se construye la
> **versión mínima en paralelo** y se valida **cobrando**, ofreciéndola a mano a 3 negocios
> concretos — no preguntando si les interesaría.
>
> Fuente de verdad del alcance. Precios: `onia-platform/lib/pricing.ts`, nunca acá.

## Por qué add-on y no producto

Se evaluaron cuatro caminos. Se descartaron tres:

| Descartado | Por qué |
|---|---|
| Influencer IA propio por cliente (ticket alto) | El 80% del valor es el operador. Termina siendo vender horas, que es justo lo que Onia decidió no hacer |
| Software de diseño (él escribe, el sistema arma) | El valor está en el criterio, no en el render. Sin criterio saca contenido feo y le echa la culpa al producto |
| Producto aparte para creadores de influencers IA | Mercado global en inglés, otro soporte, otra cobranza. Nada que ver con el resto de Onia |

Queda **add-on sobre la plataforma**: cero adquisición nueva, se le vende a quien ya
compró, y hereda multi-tenant, aprobación humana y el panel que ya existen.

## El diferencial real — y es el único argumento que gana

La objeción que va a aparecer siempre es **"ya tengo quien me lleva las redes"**. Contra
eso, "posts más lindos" no gana: una agencia en Santa Cruz cobra por mes e incluye una
persona a quien llamar.

Lo que ninguna agencia entrega es **el circuito cerrado**:

```
post → comentario con palabra clave → DM automático con el recurso
     → el lead entra al panel → queda en el mismo sistema que ya maneja el negocio
```

No vendemos contenido. Vendemos **que el contenido termine en un lead adentro del
sistema**. La agencia te deja el lead en un DM que nadie mira.

✅ **Verificado en la bandeja el 2026-08-23** (y no por el registro de ejecuciones, que me
hizo concluir mal dos veces): un comentario con la palabra el 18-ago a las 23:17:58 disparó
el DM automático a las **23:18:04 — 6 segundos**. El circuito funciona.

⚠️ **Lo que se puede decir vendiendo, y lo que no:** funciona **en nuestras propias cuentas**.
Nunca corrió en la cuenta de un cliente, y para eso hace falta App Review. Se dice así.

⚠️ Y el workflow que lo logró está **apagado**; el activo hoy solo fue probado con datos
falsos. Antes de vender esto, el activo tiene que entregar un DM real.

## Alcance de la versión mínima

Regla: **solo lo que ya existe**, con pegamento fino. Nada de pantalla nueva.

| # | Función | Con qué se hace | Estado hoy |
|---|---|---|---|
| 1 | Ficha de marca del negocio | colores, logo, rubro, tono y **fotos reales del cliente**. Reusa `hermes-content/brand/tokens.css` y los packs del renderizador | falta el formulario |
| 2 | Propuesta semanal de piezas | el sistema propone N piezas con su copy; el dueño aprueba la TANDA una vez | motor hecho, **falta el que propone — es el único hueco real** |
| 3 | Render de carrusel | `scripts/carousel_render.js` (6 packs, 3 formatos) | ✅ existe y probado |
| 4 | Render de historias | `.claude/skills/editor-videos/scripts/story-batch.mjs` | ✅ existe, hecho 23-ago |
| 5 | Programación | Postiz por MCP: `integrationSchedulePostTool`, soporta `post_type: story` | ✅ probado 23-ago |
| 6 | Palabra clave → DM | workflow de comentario→DM | ✅ vivo en producción |
| 7 | El lead cae en el panel | pipeline de leads con atribución `?src=` | ✅ vivo en producción |

**5 de 7 ya funcionan.** Lo que falta es la ficha de marca y el que propone.

## Cómo se generan las piezas — y por qué Higgsfield queda afuera

> Sergio, 2026-08-23: *"¿cómo generarías las piezas? ¿con Higgsfield? ¿y cómo lo
> mantendrías?"*

**No se generan: se COMPONEN.** Las piezas son HTML renderizado a PNG/MP4 con Chrome
headless — `carousel_render.js`, `story-batch.mjs`, HyperFrames. Eso es CPU, no créditos.

Prueba del mismo día: el carrusel L6 (7 slides) y las 8 historias de Lucía costaron **0
créditos**. Lo único que costó créditos fue el b-roll generado, que ya estaba pago.

### La cuenta que obliga a esto

| | |
|---|---|
| Ingreso por cliente | **fijo**: Bs 390/mes |
| Costo de generar | **escala con cada cliente y cada mes** |
| Un reel generado (L1) | ~50 créditos |
| El plan entero | ~3.000 créditos/mes |

Si cada cliente necesitara generación, el techo sería ~20 clientes con el plan completo —
y eso antes de nuestro propio contenido. Un abono plano contra un costo que crece por
cliente es un negocio que empeora cuando funciona.

**Higgsfield queda fuera del abono.** Se usa para Lucía (que es NUESTRA vitrina) y para
ventas cotizadas aparte, como el personaje IA propio de un cliente. Nunca dentro de los
Bs 390.

### ¿Y si el cliente no tiene fotos?

Probado el 2026-08-23 con un caso real de ferretería y **cero fotos**: el pack
`typographic` no usa ninguna imagen y saca un carrusel publicable. De los 6 packs del
renderizador, los tipográficos funcionan sin una sola foto.

Orden de preferencia: fotos del cliente → packs tipográficos → **nunca** imágenes
generadas dentro del abono.

## Cómo se mantiene

- **El código es nuestro y no depende de red.** `make-mockup.mjs` es self-contained por
  diseño (bloquea cualquier pedido externo) y `carousel_render.js` no tiene dependencias.
  No hay proveedor que pueda subir el precio ni apagar el servicio.
- **Lo que se mantiene de verdad son los moldes por rubro**, y ahí está la palanca: es la
  misma tesis de ONIA Core. El rubro #1 cuesta trabajo escribirlo; el cliente #50 de ese
  rubro cuesta 0. Se mantiene una vez por rubro, no una vez por cliente.
- **Lo que sí cambia solo es la API de Meta** — pero eso ya lo mantenemos para el chatbot
  y el comentario→DM. No es costo nuevo del add-on.

### 🔴 Hueco concreto encontrado al probarlo

`carousel_render.js` resuelve la marca con un **mapa hardcodeado** de cuentas
(`onia`/`arthur`/`sergio`/`nuvia`/`lucia`). Para clientes tiene que leer la ficha de marca
del cliente — handle, logo, colores. Es exactamente la función #1 de la tabla de arriba, y
es bloqueante: sin eso, todo carrusel de cliente sale firmado @oniahq.

## 🔴 La restricción que define el margen

**El contenido del cliente se arma con las FOTOS REALES del cliente. No se genera.**

- Un carrusel con fotos propias cuesta **0 créditos**. Uno generado cuesta créditos **por
  cliente y por mes** — eso se come el margen de una suscripción y lo vuelve negocio de
  volumen contra proveedores que fijan el precio.
- Además esquiva entero el problema de identidad y consentimiento de las caras generadas.
- Lucía es la excepción a propósito: es NUESTRA vitrina, no el molde del servicio.

Si un cliente quiere su propio personaje IA, eso es otra venta, con otro precio, y se
cotiza caso por caso.

## ¿Quién hace las piezas? Ni nosotros ni ellos

> Sergio, 2026-08-23: *"las piezas las hacemos nosotros o ellos"*.

Las dos respuestas obvias están mal:

| | Por qué no |
|---|---|
| **Las hacemos nosotros** | Es una agencia. Se vende por horas, no escala, y contradice la decisión de que Onia vende software y nunca horas |
| **Las hace el cliente** | No las va a hacer. Si tuviera tiempo y criterio no contrataría a nadie. El resultado depende de su gusto y después le echa la culpa al producto |

**Las hace el sistema, con la materia prima de ellos, y ellos aprueban la tanda.** Es el
mismo patrón que ya usa toda la plataforma: *"el sistema trabajó por vos · propuestas
esperando tu aprobación"*.

| Lo pone el cliente | Lo pone el sistema |
|---|---|
| Sus fotos reales (una vez) | Qué decir, a quién y cuándo |
| Colores, logo, rubro, tono (una vez) | El copy pasado por el gate §10.2 |
| Un sí de 10 segundos por tanda | El render, la programación, el DM y el lead |

### 🔴 La ventaja injusta: los datos que ya están en el ERP

Esto es lo que ninguna agencia puede hacer, y no por talento sino por acceso.

La plataforma **ya sabe** qué vende el negocio, a qué precio, qué stock tiene parado, quién
le debe y a qué hora vende más — son módulos 🟢 vivos (Catálogo, Inventario, Caja, Fiados).
El que propone lee eso:

- 40 unidades de un producto sin moverse hace 90 días → propone la pieza de ese producto.
- Hora pico a las 18 → programa ahí, no a una hora de manual.
- Fiados vencidos subiendo → propone el contenido que empuja cobranza, no uno de marca.

Una agencia te pregunta "¿qué querés publicar este mes?". El sistema **ya sabe** qué
conviene publicar. Ese es el add-on, no el diseño de los carruseles.

### ⚠️ Los primeros 3 los operamos a mano — y eso tiene fecha de vencimiento

Para los 3 negocios de validación, el que propone todavía no existe: los operamos nosotros
para aprender los moldes por rubro. **Eso es temporal a propósito.**

Condición de salida, escrita para que no se olvide: **cuando el tercer negocio esté
andando, el que propone tiene que estar hecho.** Si seguimos operando a mano después de
eso, dejó de ser un add-on de software y se convirtió en una agencia sin que nadie lo
decidiera.

## Automatización: qué ya corre solo y qué NO puede correr solo

> Sergio, 2026-08-23: *"el sistema quiero que puedas automáticamente postear, enviar DMs
> automáticamente y demás"*.

**Ya corre solo, hoy, sin que nadie apriete nada:**

| Acción | Cómo | Prueba |
|---|---|---|
| Publicar posts y carruseles | cola de Postiz | la cuenta @oniahq viene publicando sola |
| Publicar historias | Postiz acepta `post_type: story` | schema verificado por MCP el 23-ago |
| Responder un comentario con DM | workflow comentario→DM | vivo en producción, probado 18-ago |
| Entregar el recurso en ese DM | palabra HUMO → PDF | vivo, HTTP 200 verificado |
| Que el lead entre al panel | atribución `?src=` | vivo en producción |

O sea: **el circuito automático ya existe**. Lo único que hoy hace una persona es
**decidir qué se publica**. Ese es el hueco real, no la publicación.

### 🔴 Lo que NO se puede automatizar, y no es un problema técnico

**DM masivo o en frío = cuenta bloqueada.** Instagram permite el DM automático como
*respuesta a una interacción* (alguien comentó), no como mensaje no solicitado a listas de
gente. No hay forma de "resolverlo" con código: es política de Meta, y el castigo cae sobre
la cuenta del CLIENTE. Prometer eso es venderle un bloqueo.

Lo mismo con el volumen: publicar 20 veces por día o mandar cientos de DMs dispara los
límites aunque cada acción sea legítima.

**Cómo se dice al vender:** el sistema contesta solo a todo el que interactúa, 24/7, y
convierte esa interacción en un lead adentro del sistema. No sale a perseguir desconocidos.

⚠️ Fecha con la que hay que contar: **1-oct-2026** se termina la ventana gratis de 24 h de
WhatsApp de Meta. Afecta al seguimiento por WhatsApp, no al DM de Instagram.

### Dónde queda la aprobación humana

No en cada acción — eso no sería automático. Va **una sola vez por tanda**: el cliente
aprueba la semana de contenido y a partir de ahí publica, contesta y captura leads solo.

Publicar en la cuenta de un cliente sin que él haya visto NADA es un riesgo reputacional
suyo, no nuestro, y la primera pieza desafortunada termina el contrato. La aprobación por
tanda cuesta 10 segundos y salva eso.

## Lo que NO entra en la versión mínima

- Pantalla de diseño o editor visual.
- Video generado por cliente (ver la restricción de arriba).
- Personaje IA por cliente.
- Aprobación por WhatsApp: primero se aprueba en el panel, que ya tiene el patrón
  "el sistema propone, vos apretás el botón".
- DM en frío o masivo: **no se construye nunca** (ver arriba).

## Comprador: entre agencia y dueño

Sergio eligió los dos. Consecuencia de diseño, no una frase de marketing:

- **Multi-cliente desde el día 1** — una agencia opera varias marcas. Ya lo resuelve el
  `organizationId` de la plataforma; no hay que inventar nada.
- **Aprobación simple** — el dueño tiene que poder decir sí en el teléfono en 10 segundos.
- El copy sale del gate §10.2: **segunda persona, desde la silla del dueño, terminando en
  plata**. Si no nombra el dolor exacto del rubro, no se propone.

## Cómo se valida: cobrando, no preguntando

3 negocios concretos, no una lista larga. Criterio: que **ya tengan Instagram con
movimiento** (si no publican nada, el problema no es el contenido), que el dueño decida
solo, y de rubros distintos para ver si el molde aguanta el cambio de vocabulario.

Se les cobra desde la primera pieza. Un "me interesa" gratis no es validación.

## Precio — decidido 2026-08-23

**Bs 390/mes**, igual que el chatbot. Anual = 10 meses (Bs 3.900), **sin instalación**,
mismo trato que el resto del catálogo.

Por qué el mismo número: un solo precio de add-on es más fácil de recordar y de vender;
el costo variable nuestro es ≈ 0 (fotos del cliente, renderizadores propios, publicación
por Graph API); y quien lleva chatbot + contenido paga Bs 780, que sigue siendo menos que
el plan Professional.

**Volumen incluido: 8 piezas al feed por mes + historias diarias.** Es una cláusula de uso
justo, no un límite de nuestro trabajo: como las piezas las arma el sistema, el costo de la
número 9 es el mismo que el de la 1. El número existe para que el add-on no se convierta en
"pedime todo lo que quiera", que es como un abono de software se transforma en un retainer
de agencia.

⚠️ **Falta escribirlo en `onia-platform/lib/pricing.ts`** — hasta que esa fila exista, el
precio no es real y no se ofrece. Es otro carril (el producto), no éste.

## Pendiente de Sergio
- 🟡 Los 3 negocios concretos a los que se ofrece.
- 🟡 Si la propuesta semanal la revisa Sergio antes de que la vea el cliente, o va directa.

## Señal que puede cambiar todo esto

El lanzamiento de Lucía es el test de demanda y no cuesta nada extra: si HUMO y SISTEMA
traen comentarios de gente real, hay señal comprada con créditos ya gastados. Si no traen
nada, esta decisión se revisa antes de construir la ficha de marca.
