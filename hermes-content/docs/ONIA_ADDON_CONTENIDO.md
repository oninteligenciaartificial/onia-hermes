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

⚠️ Honestidad obligatoria al venderlo: el circuito comentario→DM **está probado en
nuestras propias cuentas** (18-ago), no en la cuenta de un cliente. Se dice así.

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

## 🔴 La restricción que define el margen

**El contenido del cliente se arma con las FOTOS REALES del cliente. No se genera.**

- Un carrusel con fotos propias cuesta **0 créditos**. Uno generado cuesta créditos **por
  cliente y por mes** — eso se come el margen de una suscripción y lo vuelve negocio de
  volumen contra proveedores que fijan el precio.
- Además esquiva entero el problema de identidad y consentimiento de las caras generadas.
- Lucía es la excepción a propósito: es NUESTRA vitrina, no el molde del servicio.

Si un cliente quiere su propio personaje IA, eso es otra venta, con otro precio, y se
cotiza caso por caso.

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

## Pendiente de Sergio

- 🔴 **Precio del add-on.** No lo invento: los add-ons se definen en `lib/pricing.ts` y hoy
  no existe una fila para contenido. Sin precio no se ofrece.
- 🟡 Los 3 negocios concretos a los que se ofrece.
- 🟡 Si la propuesta semanal la revisa Sergio antes de que la vea el cliente, o va directa.

## Señal que puede cambiar todo esto

El lanzamiento de Lucía es el test de demanda y no cuesta nada extra: si HUMO y SISTEMA
traen comentarios de gente real, hay señal comprada con créditos ya gastados. Si no traen
nada, esta decisión se revisa antes de construir la ficha de marca.
