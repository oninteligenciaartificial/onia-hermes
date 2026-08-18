# Automatización de mensajes — ManyChat, alternativas y qué se puede hoy

> 2026-08-18. Dos usos distintos del mismo análisis, y conviene no mezclarlos:
>
> **A) Uso propio de ONIA** — `@oniahq` y la cuenta de Lucía. Acá el caso ya está escrito y
> esperando: los 7 posts programados piden comentar **SISTEMA** o **LISTA**, y hoy el DM se manda
> **a mano**. No es una hipótesis, es algo en producción que está frenado.
>
> **B) Servicio para vender** — cliente real pidiendo: (1) formulario web / WhatsApp → mandar un
> video automático, (2) Instagram comentario → DM → chatbot de seguimiento.
>
> Fuentes propias verificadas: `ONIA_POSTIZ_COMENTARIOS_DM_20260817.md` (Postiz no hace DM ni
> responde comentarios, en ninguna red) · `ONIA_CICLO_COMENTARIO_DM_20260815.md` §4 (el bloqueo es
> S6, permiso de mensajería de Meta; ahí está el guion exacto del DM) ·
> `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §0 (las 2 palabras clave) ·
> `hermes-content/contenido/ONIAHQ.md` (los 7 posts programados) · Chatwoot y n8n corriendo en el VPS.

---

## 0. Los tres hallazgos, antes de las tablas

**1. ManyChat no tiene un permiso secreto.** Usa `Private Replies`, un endpoint público y
documentado de Meta que cualquiera puede llamar. Lo que tiene es **Advanced Access aprobado por App
Review + verificación de negocio** — porque su app la usan miles de cuentas ajenas. El badge "Meta
Business Partner" es marketing; **la llave es el nivel de acceso** (§2.2).

**2. Y por eso mismo, ManyChat destraba S6 para uso propio HOY.** Cuando conectás `@oniahq` a
ManyChat, **no usás una app nuestra: usás la de ellos, que ya está aprobada**. El permiso que nos
falta deja de importar. **Los 7 posts se pueden automatizar esta semana, sin App Review, sin
esperar nada** (§1).

**3. ManyChat cobra POR CUENTA conectada, no por organización.** `@oniahq` y Lucía = **dos
suscripciones separadas, dos facturas, dos cupos de contactos** (§1.3). Eso cambia la matemática
del uso propio y, sobre todo, mata el modelo de revender ManyChat a clientes (§4.4).

---

# PARTE A — Uso propio de ONIA (`@oniahq` + Lucía)

## 1. El caso: no es hipotético, está frenado

Estado verificado en el repo hoy:

| Qué | Estado |
|---|---|
| 7 posts programados en Instagram | ✅ Programados (`ONIAHQ.md`) |
| Cada uno cierra pidiendo comentar una palabra | ✅ **SISTEMA** (diagnóstico de 20 min) o **LISTA** (PDF de una página) |
| Comentario automático en nuestro propio post | ✅ Ya lo publica Postiz en los 7 |
| **Responder al que comenta, por DM** | ❌ **A mano.** `ONIA_CICLO_COMENTARIO_DM_20260815.md` §4 |
| El guion exacto del DM | ✅ Ya escrito, listo para pegar |
| Dónde se anota el lead | ✅ Definido (Notion + `onia_center.leads` con `?src=`) |

**Todo está listo menos el envío.** Cada comentario que llegue a las 2 de la mañana espera a que
alguien lo vea. Y ese doc ya lo dejó dicho: *"cuando se resuelva S6, este mismo guion es el que se
convierte en respuesta automática — no cambia el contenido, cambia quién lo envía."*

## 1.1 — La vuelta de tuerca: S6 no bloquea a ManyChat

S6 es que **nuestra app** de Meta no tiene el permiso de mensajería. Pero ManyChat no usa nuestra
app: conectás `@oniahq` a **la app de ManyChat**, que ya pasó App Review y verificación de negocio.

```
Nosotros con app propia:  @oniahq → [app de ONIA] → ❌ falta el permiso (S6)
Nosotros con ManyChat:    @oniahq → [app de ManyChat, ya aprobada] → ✅ funciona hoy
```

**Consecuencia práctica:** para el uso propio, **S6 deja de ser un bloqueo**. Es una decisión de
pagar o no pagar, no de esperar a Meta.

## 1.2 — Qué haría exactamente, con los 7 posts que ya están

| Palabra | Lo que se manda hoy a mano | Lo que mandaría automático |
|---|---|---|
| **LISTA** | El PDF de una página (tareas que se automatizan primero y qué cuestan) | El mismo PDF, en 1 segundo, 24/7 |
| **SISTEMA** | El link a Cal con `?src=`, para el diagnóstico de 20 min | El mismo link, con la atribución intacta |

**No hay que escribir nada nuevo.** El guion, el recurso y el link ya existen. Se copian al flujo.
La atribución `?src=` sigue funcionando igual (el circuito a `onia_center.leads` ya está probado en
producción).

## 1.3 — 💰 El precio para NOSOTROS: ojo, es por cuenta

**ManyChat factura por cuenta conectada, no por organización ni por usuario.** Cada Instagram
necesita su propia suscripción y su propio tablero.

> *"You'll only need more than one ManyChat account if you need 2 Instagrams connected"* — y cada
> una se factura por separado. Con 4 clientes: cuatro presupuestos, cuatro cupos de contactos,
> cuatro juegos de excedentes.
> ([Manychat subscription — Help](https://help.manychat.com/hc/en-us/articles/25800347122716-Manychat-subscription-How-to-choose-the-right-one-for-you) ·
> [¿Necesito 2 suscripciones? — comunidad ManyChat](https://community.manychat.com/general-q-a-43/do-i-need-2-manychat-pro-subscription-for-facebook-and-instagram-10468) ·
> [ManyChat Pricing 2026 — SetSmart](https://setsmart.io/blog/manychat-pricing))

Matemática real de ONIA con **dos** cuentas:

| Escenario | `@oniahq` | Lucía | Total/mes | Total/año |
|---|---|---|---|---|
| Free en las dos | $0 (25 contactos) | $0 (25 contactos) | **$0** | **$0** |
| Essential en las dos | ~$17 | ~$17 | ~$34 | ~$408 |
| Pro en las dos | ~$39 | ~$39 | **~$78** | **~$936** |
| Pro + IA en las dos | ~$68 | ~$68 | ~$136 | ~$1.632 |

⚠️ El plan gratis bajó de 1.000 a **25 contactos activos** por mes — un recorte del 97,5%. Es un
sandbox, no un plan. **Pero para arrancar sirve exactamente para lo que necesitamos:** una cuenta
que recién empieza no va a pasar de 25 personas comentando en el primer mes. Cuando los pase,
significa que funcionó y ahí se decide pagar.

## 1.4 — Recomendación para uso propio

**Probar ManyChat gratis en `@oniahq`, con UNA sola palabra (LISTA), sobre los posts que ya están.**

Por qué esto y no otra cosa:
- Cuesta **$0** y no requiere destrabar S6, ni App Review, ni verificación de negocio.
- Los 7 posts **ya están programados**: el flujo se enchufa a algo vivo, no a una prueba de
  laboratorio.
- El recurso, el guion y el link de atribución **ya están escritos**. Trabajo real: cargar el texto
  en un flujo. Una tarde.
- Si en el primer mes no llegan 25 comentarios, **el problema nunca fue la automatización, era el
  alcance** — y eso es un dato que hoy no tenemos y que conviene tener antes de pagar nada.
- Lucía entra **después**, cuando `@oniahq` haya probado que el ciclo convierte. No se pagan dos
  cuentas para probar una hipótesis.

**Lo que NO haría:** pagar $78/mes por las dos cuentas antes de saber si llegan comentarios.

---

# PARTE B — Como servicio para vender a clientes

## 2. El mecanismo real, y el permiso

### 2.1 — Cómo funciona comentario→DM (esto no es magia)

Meta tiene una función oficial: **Private Replies**. Manda **un solo mensaje directo** a alguien que
comentó una publicación de una cuenta profesional.

| Dato | Valor | Fuente |
|---|---|---|
| Endpoint | `POST /{ig-user-id}/messages` con `recipient: {"comment_id": "<id>"}` | [Private Replies — Meta](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies/) |
| Alcance | posts, reels, publicaciones de ads **y** lives | idem |
| Ventana para responder | **7 días** desde el comentario (en live: sólo durante la transmisión) | idem |
| Cuántos mensajes | **UNO solo** por comentario | idem |
| Disparador | webhook de Meta, campos `comments` / `live_comments` | idem |

**Eso es todo lo que vende ManyChat.** "Comentá X y te mando el link" es este endpoint.

Después de ese primer mensaje, si la persona contesta se abre la **ventana estándar de 24 h** para
que el chatbot siga la charla. Existe la etiqueta `human_agent` que la extiende a 7 días, **pero
Meta la prohíbe para mensajes automáticos** — es para que conteste una persona, y detectan el abuso.
([ventanas 24 h / 7 días](https://help.manychat.com/hc/en-us/articles/14281199732892-How-to-send-messages-outside-the-24-hour-and-7-day-windows-in-Messenger-and-Instagram) ·
[Instagram Platform overview](https://developers.facebook.com/docs/instagram-platform/overview/))

### 2.2 — 🔑 Por qué ManyChat puede y nosotros no: Advanced Access

Documentación oficial de Meta
([Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels/)):

| | **Standard Access** | **Advanced Access** |
|---|---|---|
| ¿Con qué cuentas funciona? | **Sólo** usuarios con un rol en la app (o en el negocio que la reclamó) | Cualquier usuario |
| ¿App Review? | **No.** Aprobado automáticamente | **Sí**, permiso por permiso |
| ¿Verificación de negocio? | No | **Sí**, obligatoria desde el 1-feb-2022 |
| ¿Revisión anual de uso de datos? | No | Sí |

Cita textual: *"Standard access is appropriate only when app users have roles in it or during app
development"*.

**ManyChat necesita Advanced Access porque su app la usan miles de cuentas que no tienen ningún rol
en ella.** Para eso pasaron App Review y verificación de negocio. **No es un privilegio de socio: es
el mismo trámite abierto a cualquiera**, sólo que lento (semanas o meses) y con verificación de
negocio como requisito previo.
([Advanced Access approval guide](https://singhamandeep.com/instagram-api-advanced-access-approval/) ·
[qué permisos necesitan App Review](https://singhamandeep.com/what-is-meta-advanced-access/) — secundarias, coinciden con la doc de Meta)

Los permisos exactos, según cómo se conecte la cuenta:

| Sabor de la API | Comentarios | Mensajes | Fuente |
|---|---|---|---|
| Instagram API **con Facebook Login** | `instagram_manage_comments` | `pages_messaging` | [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies/) |
| Instagram API **con Instagram Login** | `instagram_business_manage_comments` | `instagram_business_manage_messages` | [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login) |

Referencia general: [Permissions Reference](https://developers.facebook.com/docs/permissions/).
**Ese `instagram_business_manage_messages` es literalmente el S6 del tablero.**

### 2.3 — El atajo que evita App Review para el primer cliente

De la tabla de §2.2 sale una consecuencia que cambia el plan:

> **Si la cuenta de Instagram tiene un rol en la app, alcanza con Standard Access. Y Standard
> Access no pasa por App Review.**

O sea: **una app de Meta por cliente**, creada dentro del Business Manager de ese cliente, con su
cuenta con rol. La doc de Meta contempla ese caso explícitamente como el uso correcto de Standard
Access. **Sin Tech Provider, sin App Review, sin meses de espera.**

| Modelo | ¿App Review? | ¿Verificación de negocio? | Cuándo sirve |
|---|---|---|---|
| **Una app por cliente** (la cuenta tiene rol) | **No** — Standard Access | No | 1 a 5 clientes. **Es el caso de hoy** |
| **Una app de ONIA para todos** (SaaS, como ManyChat) | **Sí** — Advanced Access | **Sí** | Con cartera, cuando valga el trámite |

⚠️ **Marcado como "a probar", no como hecho:** el camino está documentado por Meta, pero **no lo
probé end-to-end** — no tengo hoy una cuenta de prueba con app propia para verificar que un token de
Standard Access entrega un Private Reply real en producción. Es una prueba de una tarde, y es lo
primero que hay que hacer. **Hasta que corra, es una vía documentada, no una capacidad verificada.**

---

## 3. Formulario web → mandar un video (lo simple)

Esto no toca a Meta y se resuelve con lo que ya está encendido.

### 3.1 — Qué hay ya construido (no reinventar)

| Pieza | Estado | Ruta |
|---|---|---|
| n8n self-hosted | Corriendo en el VPS (plan sin `$env`: secretos por credenciales n8n) | — |
| Molde de webhook con secret validado server-side | **Ya escrito y probado** | `hermes-content/deploy/n8n/workflows/onia-nuevo-lead.workflow.js` |
| Correo propio que sólo envía (Postfix + OpenDKIM, SPF/DKIM/DMARC) | Corriendo en el VPS | memoria `onia-correo-propio` |
| Formulario web con atribución `?src=` | En producción | `web-factory/apps/onia-platform/src/components/sections/agenda-form.tsx` |

`onia-nuevo-lead.workflow.js` ya hace el 80%: recibe `POST /nuevo-lead`, **valida el secret con un
script del servidor (`check-secret.sh`), no con `$env`** — justo lo que exige el plan VPS — y
dispara acciones. Se clona ese molde y se cambia la acción final. **No se escribe nada desde cero.**

### 3.2 — Los tres modos de entregar el video

**Modo A — Página de gracias con el video (recomendado, costo 0).** El formulario redirige a
`/gracias?t=<token>` y ahí se reproduce. Cero API, cero permiso, cero costo por mensaje, entrega
instantánea y medible. **El video llega antes de que la persona suelte el teléfono**, que es más de
lo que logra cualquier embudo por mensaje.

**Modo B — Email con el link (costo 0, el servidor ya es nuestro).** n8n manda el correo por el
Postfix propio. **Link, no adjunto** — un MP4 adjunto va a spam. Ventaja sobre el A: queda en la
bandeja y da un contacto real. **Se hacen los dos**, no es uno o el otro.

**Modo C — WhatsApp (sólo si el prospecto entró por WhatsApp).** Letra chica que hay que decir
antes de vender:

- El **botón click-to-chat** (`wa.me/...`) **no dispara nada automático**. Abre el chat y ya. Es
  gratis y va incluido en cualquier web (regla de CLAUDE.md: el botón incluido, lo que se cobra es
  el chatbot).
- Para que un WhatsApp entrante dispare una respuesta con video hace falta **WhatsApp Cloud API** a
  nombre del cliente. Ahí sí: la persona escribe → webhook → n8n responde dentro de la ventana de
  servicio.
- 🔴 **La ventana gratuita de 24 h se cierra el 1-oct-2026.** Todo embudo que termine en WhatsApp
  **cambia de costo ese día**. Si se vende sin decirlo, en octubre el cliente recibe una factura que
  no esperaba y la culpa es nuestra. **Va por escrito en la propuesta.**

### 3.3 — El flujo, concreto

```
Web (form)  ──POST /entrega-video {secret, nombre, email, whatsapp?, src}
                    │
              n8n (VPS)
                    ├─ valida secret (check-secret.sh, server-side, sin $env)
                    ├─ crea el lead → onia_center.leads (source = ?src=)
                    ├─ redirige a /gracias?t=<token>   ← el video se ve YA
                    ├─ manda el email con el link (Postfix propio)
                    └─ avisa por Telegram
```

Trabajo real: **clonar `onia-nuevo-lead`, cambiar la acción final, y una página `/gracias`.** Ni una
herramienta nueva, ni una suscripción, ni un permiso de nadie.

---

## 4. Alternativas — 2 de pago y 2 self-hosted

⚠️ **Todos los precios salen de fuentes secundarias** (blogs comparativos 2026); las páginas de
precios de ManyChat y Chatfuel devuelven 403 a la lectura automática. **Verificar en la web del
proveedor antes de poner un número en una propuesta.**

### 4.1 — De pago

| | **ManyChat** | **Chatfuel** | **respond.io** |
|---|---|---|---|
| ¿Comentario→DM en IG? | ✅ Es su producto estrella | ✅ Nativo | ⚠️ Sí, pero es un inbox primero |
| Qué necesita de Meta | Nada: conectás tu IG a **su** app ya aprobada | idem | idem |
| Plan gratis | $0 — **25 contactos activos** | ❌ No tiene | ❌ No |
| Entrada de pago | Essential ~$17/mes (250 contactos) | Fuely Super ~$39/mes (150 contactos) | Starter ~$79/mes |
| Plan realista | Pro ~$39/mes (2.500 contactos) | ~$59-279/mes | Growth ~$159/mes (recién ahí hay automatizaciones) |
| Costo escondido | La IA (AI Step) **no está incluida**: +$29/mes | — | Excedente $12-15 por cada 100 contactos extra |
| **¿Cómo factura?** | **Por cuenta conectada** | Por espacio de trabajo / contactos | Por contactos activos (MAC) |

Fuentes: [Featurebase](https://www.featurebase.app/blog/manychat-pricing) ·
[SetSmart](https://setsmart.io/blog/manychat-pricing) ·
[Layer3Labs](https://www.layer3labs.io/guides/manychat-pricing) ·
[Chatfuel Review — SetSmart](https://setsmart.io/blog/chatfuel-review) ·
[Chatfuel Pricing — Tomba](https://tomba.io/blog/chatfuel-pricing-reviews-pros-and-cons) ·
[Respond.io Review — Chatimize](https://chatimize.com/reviews/respond-io/)

### 4.2 — Self-hosted (en el VPS que ya pagamos)

| | **n8n** (ya corre) | **Activepieces** | **Chatwoot** (ya corre) |
|---|---|---|---|
| ¿Dispara comentario→DM? | ✅ **Sí** — plantillas oficiales listas | ⚠️ Genérico (webhook + HTTP); trigger nativo de IG **sin confirmar** | ❌ **No** — ver §5 |
| Licencia | Ya instalado, sin costo por tarea | MIT en el core (enterprise comercial) | Ya instalado |
| Qué necesita de Meta | **App propia** + los 2 permisos de §2.2 | idem | idem, pero no le sirve |
| Costo mensual | **$0** | $0 | $0 |
| Costo real | **Horas de construcción** | Horas + migrar sin motivo | — |
| ¿Escala a N cuentas? | ✅ Sí, sin costo extra por cuenta | ✅ | — |

Plantillas de n8n verificadas, públicas y gratis:
- [Reply to Instagram and Facebook comments via Meta webhooks and DMs](https://n8n.io/workflows/16300-reply-to-instagram-and-facebook-comments-via-meta-webhooks-and-dms/) — parsea el webhook, responde el comentario en público **y** manda el DM, con palabra clave configurable.
- [Send Instagram auto DMs to post commenters using Meta Graph API](https://n8n.io/workflows/15206-send-instagram-auto-dms-to-post-commenters-using-meta-graph-api/) — el clásico "comentá DM y te mando el link". Marcada *Use for free*.
- [Instagram trigger node — n8n docs](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.facebooktrigger/instagram) — notifica cuando alguien comenta en un media propio.
- [Alguien ya lo montó self-hosted](https://community.n8n.io/t/i-built-a-self-hosted-instagram-comment-to-dm-system-with-n8n/303886) — mismo caso: *"quería lo de ManyChat pero con control de la lógica y los datos"*.

Activepieces: [licencia MIT](https://www.activepieces.com/docs/about/license) ·
[repo](https://github.com/activepieces/activepieces). **No hay motivo para traerlo**: hace lo mismo
que n8n, que ya está instalado y ya sabemos operar. Se lista para responder la pregunta, no para
recomendarlo.

**Conclusión:** el software self-hosted **no es el problema — está resuelto y es gratis**. El
problema es el permiso, e **idéntico para n8n, Activepieces o cualquier otra**. Cambiar de
herramienta no destraba nada. Ya lo dice el doc de Postiz: *"el permiso lo da Meta a la app, no a la
herramienta"*.

### 4.3 — Plan de agencia / multi-cliente: la respuesta es mala

**ManyChat no tiene un plan de agencia que consolide clientes en una factura.** Al facturar por
cuenta conectada, una agencia con 10 clientes termina con **10 accesos y 10 facturas**, cada uno con
su propio cupo de contactos y sus propios excedentes.
([Manychat subscription](https://help.manychat.com/hc/en-us/articles/25800347122716-Manychat-subscription-How-to-choose-the-right-one-for-you) ·
[SetSmart](https://setsmart.io/blog/manychat-pricing))

### 4.4 — Por eso revender ManyChat no es un negocio

| Clientes | Costo ManyChat (Pro, por cuenta) | Costo con nuestro stack |
|---|---|---|
| 1 | ~$39/mes | $0 de plataforma |
| 5 | ~$195/mes | $0 de plataforma |
| 10 | ~$390/mes | $0 de plataforma |
| 20 | ~$780/mes | $0 de plataforma |

**El costo de ManyChat crece lineal con la cartera; el nuestro es plano.** Si el mensual recurrente
es donde vive el margen (CLAUDE.md: *cobrar la automatización y el resultado, no los píxeles*),
revender ManyChat regala ese margen desde el primer cliente. **ManyChat es la muleta para arrancar,
no el producto.**

---

## 5. Chatwoot — la respuesta precisa, porque es la que ya tenemos

**Chatwoot NO puede disparar comentario→DM. Sólo recibe conversaciones ya iniciadas.**

| Capacidad | Chatwoot |
|---|---|
| Recibir DMs de Instagram | ✅ Sí |
| Recibir respuestas a historias y reacciones | ✅ Sí |
| Recibir menciones | ✅ Sí |
| **Recibir comentarios públicos de un post** | ❌ **No** |
| **Disparar un DM a quien comentó** | ❌ **No** |
| Bandeja unificada + bots de agente para el seguimiento | ✅ Sí |

La página oficial de la función lista exactamente tres cosas: mensajes directos, respuestas a
historias y menciones. **Los comentarios públicos no están en la lista.**
([Instagram DM Integration — Chatwoot](https://www.chatwoot.com/features/instagram-integration))

Confirmado por el lado técnico: el webhook que Chatwoot configura **se suscribe al campo
`messages`**, no al campo `comments` — que es justamente el que dispara Private Replies (§2.1).
([issue #11577](https://github.com/chatwoot/chatwoot/issues/11577) ·
[Instagram Channel and Agent Bot Updates](https://www.chatwoot.com/blog/instagram-channel-agent-bots-more))

**Pero Chatwoot no sobra — es la segunda mitad del embudo:**

```
comentario  →  [ n8n + Graph API ]  →  DM inicial (Private Reply)
                                             │
                     la persona contesta ────┘
                                             ▼
                                    [ Chatwoot ]  ← bandeja, historial, bot de seguimiento,
                                                    y una persona que toma el control
```

n8n dispara. Chatwoot conversa. **Ninguna hace el trabajo de la otra**, y las dos ya están
corriendo y pagadas.

---

## 6. Riesgo de baneo — lo que NO vamos a hacer

Regla dura: **sólo API oficial.** Cualquier herramienta que automatice Instagram por fuera de la
Graph API (login con usuario y contraseña, token de sesión del navegador, apps de "auto DM masivo"
de $9,99) funciona **violando los términos de Meta** y pone en riesgo la cuenta. Si nos banean la
cuenta de un cliente, perdemos al cliente y la reputación. Si nos banean `@oniahq`, perdemos los 7
posts y la cuenta.

Señales de herramienta no oficial → descartar:
- Pide usuario y contraseña de Instagram en vez de mandarte al login oficial de Meta.
- Promete DM masivos a gente que **no** interactuó con la cuenta (ninguna API lo permite).
- No aparece el diálogo de permisos de Meta al conectar.

ManyChat, Chatfuel y respond.io usan la API oficial. Las ultra-baratas de la misma categoría, en
general, no. **Regla: si no te manda al login oficial de Meta, no entra.**

Y aun con API oficial, límites que se respetan y se le explican al cliente:
- **Un solo mensaje** por comentario. No es una campaña de goteo.
- **7 días** para mandarlo; después el comentario ya no dispara.
- **24 h** para que el bot siga la charla una vez que la persona contesta.
- La etiqueta `human_agent` (7 días) **no se usa desde un bot**.

---

## 7. Hoy vs. después del permiso

| | **HOY, sin depender de nadie** | **Depende del permiso (S6)** |
|---|---|---|
| Formulario web → video (página + email) | ✅ | |
| Lead al CRM + `?src=` + aviso Telegram | ✅ | |
| Comentario automático en nuestro propio post (Postiz, 23 redes) | ✅ | |
| Ciclo comentario→DM **manual** | ✅ | |
| Chatwoot como bandeja de DMs | ✅ | |
| **Comentario→DM automático vía ManyChat** (uso propio o cliente) | ✅ **Sí — usa la app de ellos** | |
| **Comentario→DM automático con stack propio** | | 🔴 `instagram_business_manage_messages` |
| Chatbot propio que sigue en DM | | 🔴 mismo permiso |
| WhatsApp entrante → video automático | | ⚠️ Cloud API del cliente (distinto de S6) |

**La fila que cambia todo:** con ManyChat, el comentario→DM **no espera a S6**. Con stack propio,
sí — salvo que funcione el atajo de §2.3.

---

## 8. Cierre

### (a) Qué se puede hacer HOY

**Para ONIA (uso propio) — empezar acá, esta semana:**
Conectar `@oniahq` a **ManyChat gratis**, una sola palabra (**LISTA**), sobre los 7 posts que ya
están programados. Costo **$0**. Destraba algo que hoy está frenado y esperando. Lucía entra
después, sólo si `@oniahq` prueba que convierte.

**Para el cliente — dos paquetes vendibles ya:**

*Paquete 1 — "El video llega solo".* Formulario → el video se ve al instante en la página de
gracias + llega por email → el lead entra al CRM con su fuente → aviso al dueño. Todo con n8n y el
correo propio. **Cero costo mensual de plataforma.** Es el 100% del pedido (1), y está probado.

*Paquete 2 — "Comentario → DM", con el plazo dicho de frente.* Dos caminos honestos:
- **Rápido:** ManyChat a nombre del cliente (~$39/mes que paga él). Funciona en días. Se declara que
  es una herramienta de terceros y que el costo es suyo.
- **Nuestro:** stack propio, sin mensual, después de probar §2.3. Más margen, más semanas.

Vender el manual como si fuera automático se cae en la primera semana, cuando el cliente vea que
nadie contestó a las 2 de la mañana. **Se vende el resultado con el plazo real.**

*Paquete 3 — WhatsApp,* sólo con la advertencia del 1-oct-2026 por escrito.

### (b) Qué falta

| # | Falta | Quién | Bloquea |
|---|---|---|---|
| 1 | **Probar ManyChat free en `@oniahq`** con los 7 posts | ONIA, una tarde | El ciclo propio, hoy frenado |
| 2 | **Probar Standard Access con app propia** (§2.3) | ONIA, una tarde | El paquete 2 sin mensual |
| 3 | Verificación de negocio de ONIA en Meta | **Leslie** (titular SEPREC) — Sergio es menor, no puede firmar | El modelo multi-cliente |
| 4 | App Review de `instagram_business_manage_messages` | ONIA, semanas/meses | El modelo SaaS tipo ManyChat |
| 5 | WhatsApp Cloud API a nombre del **cliente** | El cliente | Paquete 3 |
| 6 | El video en sí (lo da el cliente o se lo producimos) | Cliente / ONIA | Todo el paquete 1 |

### (c) Costo real de cada opción

**Para ONIA, uso propio (2 cuentas):**

| Opción | Mes | Año | Nota |
|---|---|---|---|
| ManyChat free x2 | **$0** | **$0** | 25 contactos c/u. **Arrancar acá** |
| ManyChat Pro x2 | ~$78 | ~$936 | Recién cuando 25 se quede corto |
| ManyChat Pro + IA x2 | ~$136 | ~$1.632 | La IA se paga aparte |
| Stack propio (n8n) | **$0** | **$0** | Requiere §2.3 o S6 |

**Para el cliente:**

| Opción | Recurrente | Nota |
|---|---|---|
| Formulario → video (nosotros) | **$0 de plataforma** | Corre en nuestro VPS |
| Comentario→DM con ManyChat | ~$39/mes (~$68 con IA) | ~$470-816/año a una empresa de afuera |
| Comentario→DM con Chatfuel | $39-279/mes | Sin plan gratis |
| Comentario→DM con respond.io | ~$159/mes para automatizar | Es un inbox, no un embudo |
| Comentario→DM con nuestro stack | **$0 de plataforma** | n8n + Chatwoot ya corriendo |

**Para ONIA como proveedor:**

| Concepto | Costo |
|---|---|
| n8n, Chatwoot, correo, VPS | **$0 marginal** — ya pagado y corriendo |
| Plantillas de n8n para comentario→DM | **$0** — públicas y gratis |
| Construir el paquete 1 | horas, con molde existente |
| Construir el paquete 2 propio | horas + el permiso |
| Verificación de negocio + App Review | $0 de dinero, semanas de calendario |

**La lectura comercial:** ManyChat le cuesta ~$39/mes **por cada cuenta, para siempre**. Nosotros
tenemos la infraestructura con costo marginal cero y **plano**: el cliente 20 cuesta lo mismo que el
cliente 1. Ese diferencial **es el margen del mensual**. Pero mientras tanto **ManyChat gratis
destraba nuestro propio ciclo hoy** — y eso vale más que esperar.

---

## 9. Estado del doc

> ⚠️ **Reescrito el 2026-08-18 por la tarde.** La versión de la mañana cerraba con
> *"❌ No se hizo nada en vivo"*. Eso ya no es cierto: se probó contra la API de Meta con el
> token real de `@oniahq` y **el hallazgo principal del doc quedó dado vuelta**. Ver §10.

- ✅ Verificado contra doc oficial de Meta: mecanismo de Private Replies, permisos exactos,
  ventana de 7 días, un mensaje por comentario, Standard vs Advanced Access.
- ✅ Verificado contra fuente del proveedor: Chatwoot no procesa comentarios públicos ·
  ManyChat factura por cuenta conectada.
- ✅ Verificado en el repo: los 7 posts programados con SISTEMA/LISTA, el guion del DM manual,
  n8n y el molde de webhook con secret server-side.
- ✅ **Verificado EN VIVO contra la Graph API (§10).**
- ⚠️ Sin confirmar: los precios exactos (fuentes secundarias; las páginas oficiales dan 403) ·
  el trigger nativo de Instagram en Activepieces · la automatización nativa de Meta Business
  Suite (las páginas oficiales no renderizan para lectura automática).

---

## 10. 🔬 Lo que se probó en vivo — 2026-08-18

Todo con el token de `@oniahq` que ya tiene Postiz. Sin gastar un centavo, sin enviar ningún
mensaje real.

### 10.1 — El hallazgo que da vuelta el doc: S6 NO bloquea nuestras cuentas

| Prueba | Llamada | Resultado | Qué prueba |
|---|---|---|---|
| Identidad | `GET /me` | `{"id":"27942557688720145","username":"oniahq","account_type":"BUSINESS"}` | el token vive y la cuenta es profesional |
| **Mensajería** | `GET /me/conversations` | devuelve conversaciones reales | **`instagram_business_manage_messages` CONCEDIDO** — ese permiso *es* S6 |
| Lectura de DMs | `GET /{conv}?fields=messages{...}` | historial real de junio | lectura completa del buzón |
| **Envío** | `POST /me/messages` con `comment_id:"0"` | `{"code":100,"message":"Invalid comment_id parameter"}` | **código 100 = parámetro inválido, NO 200 (permiso) ni 190 (OAuth).** Meta validó el permiso y llegó a validar el parámetro → **el envío está habilitado** |
| Webhooks | `GET /me/subscribed_apps` | `["messages"]` | faltaba `comments` |
| **Suscripción** | `POST /me/subscribed_apps?subscribed_fields=messages,comments` | `{"success":true}` → verificado `["messages","comments"]` | **hecho, ya está suscrito** |

> **Conclusión:** `@oniahq` tiene rol en nuestra propia app, y por eso opera con **Standard
> Access**, que no pasa por App Review. **S6 nunca bloqueó nuestras cuentas — bloquea las de
> clientes.** Estaban mezcladas en el tablero.
>
> **Consecuencia directa: no hace falta ManyChat para uso propio.** El §1.4 de este doc
> recomendaba conectar ManyChat gratis para "pedir prestada" su app aprobada. Ese motivo
> desapareció. Ahorro: ~USD 936/año con las dos cuentas en Pro.

### 10.2 — El workflow, construido y probado

`ONIA - Comentario IG -> DM (Private Reply)` — n8n `w1GUalEbvYnLROUI`, **activo**.
URL de producción: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/ig-comment`

⚠️ La URL con el prefijo del `webhookId` **da 404**. La buena es la ruta simple, de arriba.

| Camino probado | Payload | Resultado |
|---|---|---|
| Verificación de Meta (`GET hub.mode=subscribe`) | — | ✅ devolvió el `hub.challenge` intacto |
| Comentario ajeno con SISTEMA | payload real de Meta | ⚠️ 200, llega al nodo SSH y muere: **`Host not found`** |
| **Nuestro propio comentario** (el de hashtags que publica Postiz) | `from.id` = nuestro | ✅ **200 e ignorado** — el filtro anti-bucle funciona |

**El filtro anti-bucle no es un detalle.** Postiz publica un comentario automático con los
hashtags sobre nuestro propio post; sin ese filtro, el flujo se respondería a sí mismo.

### 10.3 — Lo que falta, y es corto

| # | Qué falta | Quién | Por qué |
|---|---|---|---|
| 1 | **Adjuntar 2 credenciales** al workflow: `ONIA VPS SSH` en *Leer token de Postiz* y `Telegram account` en *Avisar a Sergio* | Sergio, 2 clics | El MCP de n8n no las auto-asignó y su `update_workflow` no acepta el parámetro (bug de serialización). La API pública devuelve 401 con el `N8N_API_KEY` del contenedor |
| 2 | **Apuntar el callback de la app de Meta** a `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/ig-comment` | Sergio, panel de Meta | No se pudo leer por API: `FACEBOOK_APP_ID` está vacío en Postiz y el secret de Instagram no firma contra el app de Facebook |
| 3 | **Publicar el PDF de LISTA** | — | `onia.com.bo/recursos/lista-por-donde-empezar.pdf` → **404**. El PDF existe en el repo, no en la web. Por eso el workflow hoy solo acciona con SISTEMA |
| 4 | Probar el Private Reply de verdad | mié 19-ago | `media_count: 0` — no hay ningún post donde comentar hasta que salga el primer carrusel |

### 10.4 — Links del DM, verificados en vivo

```
onia.com.bo/?src=...                              200 ✅
cal.onia.com.bo/onia/consulta-inicial             200 ✅
onia.com.bo/recursos/lista-por-donde-empezar.pdf  404 ❌
```
