# TikTok: qué se puede automatizar de verdad para una cuenta de negocio (2026-08-20)

> Carril: `research-estrategia` (I). Solo investigación — no se publicó ni generó nada.
> Pregunta que contesta: publicar / leer comentarios / responder comentarios / DM disparado por
> comentario, para `@oniahq` y la cuenta de Lucía, desde Bolivia.
> Contraste obligado: en Instagram el ciclo comentario→DM (Private Reply) YA está vivo con app
> propia y Standard Access, sin App Review. Ver [[instagram-publicacion-desbloqueada]].

## 0. Los 4 veredictos en una tabla

| # | Qué | Veredicto | Con qué requisito |
|---|-----|-----------|-------------------|
| 1 | Publicar video vertical por API | **SÍ** | Dos caminos distintos. El barato (Content Posting API) publica en **privado** hasta pasar auditoría. El de verdad público es Accounts API con permiso "TikTok Accounts" + formulario de acceso. |
| 2 | Leer comentarios de nuestros propios videos | **SÍ** | Solo por **Accounts API** (`business-api.tiktok.com`). NO existe en el API de developers. Permiso "TikTok Accounts" + formulario obligatorio desde 20-mar-2026. |
| 3 | Responder un comentario públicamente | **SÍ** | `/business/comment/reply/create/`, mismo gate que el punto 2. Ojo: el endpoint que aparece primero al buscar (`/comment/post/`) es de **anuncios**, no sirve. |
| 4 | DM disparado por un comentario (Private Reply de Meta) | **NO — bloqueado por región** | La función existe y se llama **Comment-to-Message**, pero solo para cuentas de negocio registradas en **Vietnam, Indonesia y Tailandia**. Bolivia queda fuera. No hay workaround por API. |

**Lo esencial:** TikTok sí tiene el equivalente exacto del Private Reply. No nos sirve porque el gate
no es técnico ni de permisos: es **el país de registro de la cuenta de negocio**.

---

## 1. Publicar un video vertical — SÍ, pero hay dos APIs distintas y conviene no confundirlas

TikTok tiene **dos plataformas de desarrollador separadas**, con portales, apps y permisos distintos.
Casi toda la confusión de blogs viene de mezclarlas.

| | Developer API | API for Business |
|---|---|---|
| Portal | `developers.tiktok.com` | `business-api.tiktok.com` |
| Para publicar | Content Posting API | Accounts API |
| Comentarios | **no existe** | sí |
| DM | **no existe** | sí (Business Messaging) |

### Camino A — Content Posting API (el que ya tenemos implementado vía Postiz)

- Scope requerido: `video.publish` para publicar directo al perfil; `video.upload` solo manda el
  archivo al inbox del creador para que lo termine a mano.
  Fuente: <https://developers.tiktok.com/doc/tiktok-api-scopes>
- Endpoint: `/v2/post/publish/video/init/`, con `creator_info/query` obligatorio antes.
  Fuente: <https://developers.tiktok.com/doc/content-posting-api-reference-direct-post>

**El problema, citado literal de la doc oficial:**

> "All content posted by unaudited clients will be restricted to private viewing mode."
> — <https://developers.tiktok.com/doc/content-posting-api-get-started>

Y las restricciones concretas mientras la app no pase auditoría:

> "Unaudited API Clients can allow up to 5 users to post in a 24 hour window."
> "All user accounts using the API client to post must be set to private at the time of posting."
> "Unaudited API Clients can only post contents in `SELF_ONLY` viewership."
> — <https://developers.tiktok.com/doc/content-sharing-guidelines>

Hay hasta un código de error dedicado: `unaudited_client_can_only_post_to_private_accounts`.

Traducido: sin auditoría, publicar por API **no sirve para nada comercial**. El video sale en
privado, y para hacerlo público hay que entrar a mano a la app y cambiarlo. Es exactamente el
trabajo manual que queríamos eliminar.

### Camino B — Accounts API (`/business/video/publish/`)

La guía oficial de Accounts API lo dice al pasar, pero es el dato importante:

> "If you don't have one and want to publish a public video to your TikTok account, use `/business/video/publish/`."
> — <https://business-api.tiktok.com/portal/docs/manage-comments-on-owned-tiktok-videos/v1.3>

Esta ruta publica **público** sin el castigo del `SELF_ONLY`. Es la misma que da comentarios, así
que un solo trámite ("TikTok Accounts") destraba los puntos 1, 2 y 3 a la vez.

**No verificado:** no encontré la página de referencia individual de `/business/video/publish/`
(el slug directo no resolvió). El endpoint está citado en la guía oficial de Accounts API y la
búsqueda en el portal lo describe como "Publish a public video post to an owned account", pero no
leí su tabla de parámetros. Antes de codear contra él, abrir la API Reference → Accounts → Video.

---

## 2. Leer comentarios propios — SÍ, y solo por un lado

**No existe ningún scope de comentarios en el Developer API.** Verificado contra la lista completa
de scopes: hay `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`,
`video.publish`, `video.upload`, los `portability.*`, los `research.*` y los `local.*`. Ninguno
menciona comentarios.
Fuente: <https://developers.tiktok.com/doc/tiktok-api-scopes>

El Display API tampoco: solo tiene `/v2/user/info/`, `/v2/video/list/` y `/v2/video/query/` —
perfil y metadatos de video, nada de comentarios.
Fuente: <https://developers.tiktok.com/doc/display-api-overview>

Donde sí está es en **Accounts API**, con un set completo:

| Acción | Endpoint |
|---|---|
| Listar comentarios de primer nivel | `/business/comment/list/` |
| Listar respuestas a un comentario | `/business/comment/reply/list/` |
| Crear un comentario | `/business/comment/create/` |
| **Responder un comentario** | `/business/comment/reply/create/` |
| Dar / quitar like | `/business/comment/like/` |
| Ocultar / mostrar | `/business/comment/hide/` |
| Borrar | `/business/comment/delete/` |

Fuente: <https://business-api.tiktok.com/portal/docs/manage-comments-on-owned-tiktok-videos/v1.3>

**Además hay webhook, que es lo que hace viable un agente reactivo:**

> "The comment webhook event `comment.update` enables you to get notifications within five minutes
> of a comment or reply being created, deleted, or the comment or reply visibility settings being
> modified on any public video under an owned TikTok account."

Se suscribe con `/business/webhook/update/` y `event_type=COMMENT`. Cinco minutos de latencia — no
es tiempo real como el webhook de Instagram, pero alcanza para un agente de respuesta.

---

## 3. Responder un comentario — SÍ, pero cuidado con el endpoint equivocado

Buscar "TikTok reply to a comment" devuelve primero **el endpoint incorrecto**. Anotarlo para no
perder tiempo después:

| | `/v1.3/comment/post/` (Ad Comments) | `/business/comment/reply/create/` (Accounts) |
|---|---|---|
| Sirve para | comentarios bajo **anuncios** | comentarios en **nuestros videos orgánicos** |
| Exige | `advertiser_id`, `ad_id`, `identity_id` | `business_id`, `video_id`, `comment_id`, `text` |
| Nos sirve | **no** (requiere campaña pagada activa) | **sí** |

El de Ad Comments además aclara que solo aplica a identidades `TT_USER` o `CUSTOMIZED_USER` con
permisos de gestión de comentarios, y solo a comentarios de primer nivel bajo los ads.
Fuente: <https://business-api.tiktok.com/portal/docs/reply-to-a-comment/v1.3>

---

## 4. DM disparado por comentario — la respuesta completa

### Existe, y se llama Comment-to-Message

La Business Messaging API tiene exactamente lo que buscábamos. Sus endpoints de DM:

- `Send a message to a conversation`
- `Get a list of conversations` / `Get a list of messages`
- `Upload an image` / `Download an image or a video from a message`
- **`Enable or disable Comment-to-Message for a Business Account`**
- **`Get the Comment-to-Message setting of a Business Account`**

Fuente: <https://business-api.tiktok.com/portal/docs/business-messaging/v1.3>

Cómo funciona, citado literal:

> "The Comment-to-Message feature enables businesses to proactively engage with users by sending
> direct messages in response to high-intent comments on their video posts. A high-intent comment
> is one that expresses a strong intention to purchase or seek further information. When you enable
> this feature, the TikTok system will identify those high-intent comments, allowing you to send
> customized replies using `/business/message/send/`."

Se activa con `POST /open_api/v1.3/business/message/direct_reply/update/` pasando
`direct_reply_type=COMMENT_TO_MESSAGE` y `operation_status=ENABLE`.

Nótese una diferencia de diseño con Meta: en Instagram **nosotros** decidimos qué comentario
dispara el DM. Acá **TikTok clasifica** cuáles son "high-intent" y solo sobre esos habilita el DM.
Menos control.

### Por qué NO nos sirve — el bloqueo es geográfico

La misma página, en el recuadro de nota:

> "The Comment-to-Message feature is only available for Business Accounts registered in **Vietnam,
> Indonesia, and Thailand**."
> "Once you enable Comment-to-Message for a Business Account, the Business Account can only reply
> to comments published by TikTok accounts that are registered in the APAC, LATAM, and METAP regions."
> — <https://business-api.tiktok.com/portal/docs/enable-or-disable-comment-to-message-for-a-business-account/v1.3>

Leer con cuidado: **LATAM aparece, pero del lado equivocado.** Un usuario de LATAM puede ser el que
comenta. La cuenta de negocio que responde tiene que estar registrada en VN / ID / TH. `@oniahq`
está en Bolivia. Queda fuera.

Los otros requisitos de elegibilidad (que sí cumpliríamos) son:

> "The account owner is over 18 years old."
> "The account is a Registered Business Account or a Business Account that has run TikTok Messaging Ads."
> "The messaging permissions 'Potential connections' and 'Other on TikTok' of the account are set to 'Requests'."

Ojo con el primero para la cuenta de Lucía y en general: **Sergio es menor de edad**
([[sergio-menor-de-edad-quien-firma]]), así que la titularidad va por Leslie de todos modos.

### Y aunque el país no bloqueara, hay un segundo gate

Acceder a la Business Messaging API no es autoservicio. Requiere una **revisión manual de seguridad
y privacidad** de la empresa desarrolladora:

> "Business Messaging API developers are required to complete necessary reviews as a prerequisite
> for Business Messaging API access."
> "The TikTok API for Business team will process your request and initiate the review process
> within 10 working days after your submission."
> — <https://business-api.tiktok.com/portal/docs/access-to-business-messaging-api/v1.3>

Llega un cuestionario "TikTok/ByteDance Third-Party Due Diligence Questionnaire" (DSPR DDQ), y la
doc recomienda adjuntar **certificado ISO 27001, informe SOC 2, o un pentest reciente** para
acelerar. Onia hoy no tiene ninguno de los tres. Además el progreso no es rastreable:

> "both reviews are manually managed by TikTok and progress tracking is not available through the
> developer portal for self-serve developers."

Nota de alcance: Bolivia cae en "Rest of World", que es el caso **más liviano** — solo el DSPR, no
el US Data Security Review ni el USDS Addendum. La EEA, Suiza y el Reino Unido están directamente
excluidos del Business Messaging API. Así que si algún día se destrabara la región, el trámite
sería el corto.

---

## 5. ¿Hay equivalente al "Standard Access" de Meta? — NO

Esta era la pregunta de fondo y la respuesta es clara: **no existe**.

En Meta, tener rol en nuestra propia app nos deja operar en serio sin App Review. Eso es lo que
hoy sostiene el ciclo comentario→DM de Instagram. En TikTok lo más parecido es el **sandbox**, y
está capado justo donde importa:

> "You may add up to 10 accounts as target users."
> "Sandbox mode does not offer access to Content Posting API for public videos or Data Portability API."
> — <https://developers.tiktok.com/doc/add-a-sandbox/>

O sea: el sandbox evita la revisión, pero **excluye publicar video público**, que es exactamente lo
que queríamos hacer. No es un Standard Access; es un ambiente de prueba.

Y el lado de Business tiene su propio gate, nuevo y reciente:

> "starting March 20, 2026 at 00:00 (GMT+0), developers must complete the Accounts API Access
> Application Form before submitting a new developer app or requesting a scope increase that
> includes the 'TikTok Accounts' permission scope."
> — <https://business-api.tiktok.com/portal/docs/accounts-api-overview/v1.3>

Un cambio de permisos se revisa en 2-3 días hábiles.
Fuente: <https://business-api.tiktok.com/portal/docs/app-permissions/v1.3>

### Requisitos de registro como developer — nos afectan directo

De <https://business-api.tiktok.com/portal/docs/register-as-a-developer/v1.3>, citado literal:

> "communication email must be a verified company domain email. You will be rejected if you are
> using a personal email or a temporary email."
> "Currently, we are unable to onboard personal accounts or individual developers. If you are part
> of a company, please use your company website."

Y sobre la web de la empresa: pública, funcional, "professionally presented", con contenido de
negocio accesible sin login, en dominio propio de la empresa — **explícitamente no vale un dominio
de red social, hosting de terceros o plataforma de ecommerce**, ni un acortador.

Buena noticia: esto lo cumplimos. Onia tiene entidad legal (SEPREC, matrícula 5371375010,
[[onia-datos-legales-seprec]]), dominio propio y correo propio en el VPS
([[onia-correo-propio]]). El trámite es viable. Resultado en tres días hábiles.

**No verificado:** no encontré en la doc oficial ninguna lista de países elegibles para registrarse
como developer, ni exclusión de Bolivia. El formulario pide un "Primary Developer Location" que es
un selector. **No se puede saber si Bolivia aparece en ese selector sin abrir el formulario con una
cuenta TikTok for Business creada.** No lo afirmo en ninguna dirección.

---

## 6. Qué hace (y qué no hace) el proveedor TikTok de Postiz

Leído del fuente TypeScript en el contenedor en producción:
`/app/libraries/nestjs-libraries/src/integrations/social/tiktok.provider.ts` (~1150 líneas).

**Scopes que pide:**
```
video.list, user.info.basic, video.publish, video.upload, user.info.profile, user.info.stats
```
Son exactamente los del Developer API — **cero comentarios, cero DM**, porque no existen ahí.

**Endpoints que toca** (todos `open.tiktokapis.com/v2`, o sea Camino A):

| Endpoint | Para qué |
|---|---|
| `/oauth/token/` | login y refresh |
| `/user/info/` | perfil |
| `/post/publish/creator_info/query/` | prerequisito antes de publicar |
| `/post/publish/...` | init de la subida (video o foto) |
| `/post/publish/status/fetch/` | polling del estado |
| `/video/list/`, `/video/query/` | analytics de posts propios |

**Métodos de la clase:** `refreshToken`, `generateAuthUrl`, `authenticate`, `maxVideoLength`,
`postPending`, `post`, `analytics`, `missing`, `postAnalytics`. No hay ningún método de comentarios
ni de mensajes — consistente con el dato ya conocido de que Postiz no responde comentarios en
ninguna red.

**Lo que sí sabe hacer bien** (de las reglas declaradas en el propio provider):
- Distingue `DIRECT_POST` (publica) de `UPLOAD` (solo deja el archivo en el inbox de la app, el
  usuario tiene 24h para terminarlo a mano o se descarta).
- Advierte que en modo `UPLOAD` TikTok **ignora en silencio** todo ajuste salvo el título:
  `privacy_level`, `duet`, `stitch`, `comment`, `video_made_with_ai`, `brand_content_toggle`.
- Soporta video, una foto o varias fotos. Nunca sin adjunto. Máx 2000 caracteres.
- Maneja `SEND_TO_USER_INBOX` y `PUBLISH_COMPLETE` como estados finales distintos.

**Estado real hoy — verificado en el contenedor:**

```
CLIENT_ID_len=0
SECRET_len=0
```

Las variables `TIKTOK_CLIENT_ID` y `TIKTOK_CLIENT_SECRET` **existen pero están vacías**. Postiz no
puede conectar ninguna cuenta de TikTok hasta que creemos la app de developer y las carguemos. El
código está listo; la credencial no existe. Aplica la regla de "construido ≠ terminado".

---

## 7. Qué exigen las herramientas TikTok del MCP de Higgsfield

Consultado solo en lectura. **No se publicó ni se conectó nada.**

`tiktok_accounts` devuelve:
```json
{"accounts":[]}
```
**No hay ninguna cuenta de TikTok conectada a Higgsfield hoy.**

`tiktok_music_trending` (la única otra de lectura pura) falla con:
```
Invalid arguments: connector_id: Invalid input: expected string, received undefined
```

O sea: **todas las tools TikTok del MCP se apoyan en un `connector_id`**, que sale de haber
vinculado una cuenta con `tiktok_connect`. Sin esa vinculación no opera ninguna, ni siquiera las de
solo lectura de música.

**No verificado, y es una limitación del MCP, no mía:** los esquemas que expone el servidor para
`tiktok_connect`, `tiktok_publish`, `tiktok_prepare_publish` y `tiktok_publish_status` vienen
**vacíos** (`{"type":"object"}`, sin propiedades declaradas). No se puede saber desde el schema qué
parámetros exige cada una. Habría que llamar a `tiktok_connect` para descubrirlo, y eso es una
acción de vinculación de cuenta — fuera del alcance de esta investigación.

Tampoco está documentado si Higgsfield publica con su propia app auditada (lo que evitaría nuestro
trámite) o si delega en credenciales nuestras. **Es la pregunta más valiosa que queda abierta**, y
se contesta conectando una cuenta de prueba, no leyendo docs.

---

## 8. Qué NO se puede hacer, y por qué

| Lo que no se puede | Por qué | ¿Destrabable? |
|---|---|---|
| **DM automático disparado por comentario** | Comment-to-Message es solo para cuentas de negocio registradas en Vietnam, Indonesia y Tailandia | **No.** Depende del país de registro de la cuenta, no de permisos ni de plata. Fingir el país sería fraude de registro. |
| Publicar público sin ningún trámite | Cliente no auditado = `SELF_ONLY` + cuenta privada + 5 usuarios/24h | Sí: auditoría del cliente API, o usar Accounts API |
| Leer o responder comentarios desde el Developer API | No existe scope de comentarios; el Display API solo da perfil y metadatos | No por ese lado. Hay que ir por Accounts API |
| Probar publicación pública en sandbox | "Sandbox mode does not offer access to Content Posting API for public videos" | No. El sandbox sirve para el resto del flujo |
| Registrarse como developer individual | "we are unable to onboard personal accounts or individual developers" | Ya resuelto: Onia es entidad con dominio y web propios |
| Business Messaging en Europa / UK / Suiza | Excluidos explícitamente de la API | No aplica a nuestro caso |
| Acceso rápido a Business Messaging | Revisión manual, 10 días hábiles solo para arrancar, sin tracking | Parcialmente: ISO 27001 / SOC 2 / pentest aceleran. No tenemos ninguno |
| Saber qué exigen las tools TikTok de Higgsfield | El MCP expone esquemas vacíos | Sí, conectando una cuenta de prueba |
| Saber si Bolivia está en el selector de "Primary Developer Location" | No documentado en ninguna página oficial | Sí, abriendo el formulario con una cuenta TikTok for Business |

### La comparación que importa

| | Instagram (hoy, andando) | TikTok |
|---|---|---|
| Publicar | sí | sí, con trámite |
| Leer comentarios | sí | sí, con trámite |
| Responder comentario | sí | sí, con trámite |
| **Comentario → DM** | **sí, vivo y probado** | **no desde Bolivia** |
| Sin App Review | sí (Standard Access) | **no existe equivalente** |

**Conclusión honesta:** en TikTok se puede reconstruir 3 de las 4 patas del circuito de Instagram.
La cuarta — la que convierte un comentario en una conversación privada, que es donde se captura el
lead — no está disponible para una cuenta boliviana y no hay forma legítima de forzarla. Cualquier
plan de captación en TikTok tiene que asumir que el lead se mueve por **respuesta pública** (con
CTA al perfil/link) y no por DM automático.

---

## 9. Fuentes

Todas consultadas el 2026-08-20. Las de `business-api.tiktok.com` son una SPA que no se puede leer
con fetch simple — se leyeron con navegador renderizando la página.

**developers.tiktok.com (Developer API)**
- <https://developers.tiktok.com/doc/tiktok-api-scopes>
- <https://developers.tiktok.com/doc/content-posting-api-get-started>
- <https://developers.tiktok.com/doc/content-posting-api-reference-direct-post>
- <https://developers.tiktok.com/doc/display-api-overview>
- <https://developers.tiktok.com/doc/content-sharing-guidelines>
- <https://developers.tiktok.com/doc/add-a-sandbox/>

**business-api.tiktok.com (API for Business)**
- <https://business-api.tiktok.com/portal/docs/business-messaging/v1.3>
- <https://business-api.tiktok.com/portal/docs/enable-or-disable-comment-to-message-for-a-business-account/v1.3>
- <https://business-api.tiktok.com/portal/docs/access-to-business-messaging-api/v1.3>
- <https://business-api.tiktok.com/portal/docs/authorization/v1.3>
- <https://business-api.tiktok.com/portal/docs/manage-comments-on-owned-tiktok-videos/v1.3>
- <https://business-api.tiktok.com/portal/docs/accounts-api/v1.3>
- <https://business-api.tiktok.com/portal/docs/accounts-api-overview/v1.3>
- <https://business-api.tiktok.com/portal/docs/get-started/v1.3>
- <https://business-api.tiktok.com/portal/docs/register-as-a-developer/v1.3>
- <https://business-api.tiktok.com/portal/docs/app-permissions/v1.3>
- <https://business-api.tiktok.com/portal/docs/reply-to-a-comment/v1.3>

**Verificado en vivo (no doc)**
- Postiz en el VPS: `docker exec postiz` → fuente del provider + longitud de credenciales
- MCP Higgsfield: `tiktok_accounts`, `tiktok_music_trending`

**No verificado — declarado como tal en el cuerpo del doc**
- Tabla de parámetros de `/business/video/publish/` (endpoint citado en guía oficial, sin página de
  referencia individual leída)
- Elegibilidad de Bolivia en el selector "Primary Developer Location"
- Parámetros de las tools TikTok del MCP de Higgsfield (esquemas vacíos)
- Si Higgsfield publica con app propia auditada o con credenciales del usuario

---

## ADDENDUM — 2026-08-20: el trámite de developer puede sobrar

> Verificado en vivo con el MCP de Higgsfield **después** de escribir lo de arriba.
> Cambia el camino recomendado, no los veredictos.

### El hallazgo

`tiktok_connect` devuelve una URL de autorización de la **app propia de Higgsfield**
(`client_key=7641488082520244240`) que pide estos scopes:

```
video.publish · video.upload              ← publicar
comment.list · comment.list.manage        ← leer Y gestionar comentarios
video.list · video.insights · user.insights · user.info.*
biz.spark.auth · biz.creator.info · biz.creator.insights · biz.brand.insights
```

**Es una app ya aprobada, de nivel business.** Conectar una cuenta ahí da acceso a publicar y a
gestionar comentarios **sin pasar por nuestro propio registro de developer** — los 3 días hábiles
y el trámite descritos arriba dejan de ser el único camino.

`tiktok_accounts` → `{"accounts":[]}`: no hay ninguna cuenta conectada todavía.

### Lo que esto NO cambia

- **Comentario → DM sigue siendo NO.** `comment.list.manage` no es *Comment-to-Message*. El gate
  geográfico (Vietnam, Indonesia, Tailandia) no lo levanta ningún scope.
- **No verificado: que el MCP EXPONGA la gestión de comentarios como herramienta.** Las tools
  visibles son `tiktok_accounts`, `tiktok_connect`, `tiktok_publish`, `tiktok_prepare_publish`,
  `tiktok_publish_status`, `tiktok_music_trending`, `tiktok_reconnect`. **Ninguna de comentarios.**
  Puede que el permiso esté y la herramienta no. Se sabe conectando una cuenta, no leyendo docs.

### Consecuencia práctica

**Orden correcto: probar Higgsfield primero, y recién si no alcanza, hacer el trámite.**
Media hora contra tres días. El trámite queda como plan B, no como paso 1.

⚠️ La URL de autorización lleva PKCE y **vence en horas**. Se regenera con `tiktok_connect`.
