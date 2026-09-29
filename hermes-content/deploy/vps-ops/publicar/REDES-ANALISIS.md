# Publicar en todas las redes: qué se puede automatizar y qué exige cada una

Investigado el 29-sep-2026 para el publicador de esta carpeta (Instagram ya publica por API: Reels + Trial reels).
Solo fuentes primarias (documentación del proveedor), leídas ese día. No se creó ninguna cuenta ni se inició sesión.

- **[V]** = verificado ese día en la fuente enlazada.
- **[I]** = inferido: deducción propia o dato que la fuente no trae. Se prueba antes de apoyarse en él.
- **Citas.** Las páginas de *Google for Developers* están bajo licencia CC BY 4.0 (lo dice su pie), así que
  se citan textuales. El resto (TikTok, Meta, LinkedIn, Buffer, Metricool y los centros de ayuda) va
  parafraseado, con la sección y la URL exactas y una sola cita corta de TikTok. Números, códigos de error,
  nombres de campos y rótulos de menú se copian tal cual porque son datos.

## Lo decisivo

1. **TikTok: una app propia no sirve.** Sin auditoría, lo publicado queda en privado (`SELF_ONLY`) y la
   cuenta tiene que estar en privado al publicar. La auditoría descarta por escrito una herramienta para
   subir contenido a las cuentas propias o del equipo. La ruta es una herramienta ya auditada.
2. **YouTube: el plan del README está incompleto.** Un cliente OAuth propio en Producción sube, pero cada video
   queda bloqueado en privado, sin apelación, mientras el proyecto no pase la auditoría de YouTube API
   Services. Hay dos verificaciones distintas: la del OAuth (Google) y la de YouTube API. El README solo
   cubre la primera.
3. **Instagram:** 100 publicaciones por API cada 24 h móviles. Los Trial reels no tienen un cupo propio
   documentado.
4. **LinkedIn (perfil):** se puede publicar con video usando el producto self-serve *Share on LinkedIn*
   (`w_member_social`). La app pide una Página de LinkedIn y el token dura 60 días.
5. **Facebook:** el compartido automático de IG a FB se activa en el Centro de cuentas del teléfono. Meta no
   documenta que se dispare con reels publicados por API. Se prueba con el primero.

---

## 1. TikTok (Content Posting API)

| Aspecto | Qué dice la fuente | Estado | Fuente |
|---|---|---|---|
| Dos modos | **Direct Post** publica directo en el perfil (scope `video.publish`). **Upload** manda el video a la bandeja de TikTok como borrador (scope `video.upload`). El usuario toca la notificación y termina de publicar en la app. | [V] | [Get Started Direct Post](https://developers.tiktok.com/doc/content-posting-api-get-started), [Get Started Upload](https://developers.tiktok.com/doc/content-posting-api-get-started-upload-content) |
| Qué pide cada modo | Una app registrada, con el producto Content Posting API agregado. Para Direct Post además hay que activar su configuración. La app tiene que estar **aprobada** para el scope y el usuario tiene que autorizarla. | [V] | las dos de arriba |
| App sin auditar (Direct Post) | Puede publicar como máximo **5 usuarios cada 24 h**. Las cuentas tienen que estar en **privado** al momento de publicar y solo se admite `SELF_ONLY`. Para hacerlo público después, el dueño cambia la cuenta a pública y luego cada video a "Everyone", uno por uno. | [V] | [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines), sección *Direct Post API - Developer Guidelines* |
| Uso previsto (bloqueo) | La app tiene que servir a una audiencia amplia, no a un grupo interno ni a un uso privado. Figura como NO aceptable una "utility tool to help upload contents to the account(s) you or your team manages" (cita textual). | [V] | misma página, sección *Intended Use* |
| Revisión de la app (cualquier modo) | La app no puede ser de uso privado o personal. Una app en desarrollo o en pruebas no se aprueba. Exige un sitio web completo, que no sea landing ni login, con enlaces visibles a Términos y Privacidad. Exige uno o más videos demo (hasta 5, de 50 MB cada uno); la primera vez, grabados en sandbox. | [V] | [App Review Guidelines](https://developers.tiktok.com/doc/app-review-guidelines) |
| Tiempo de revisión | De varios días a dos semanas. No hay acceso a las APIs hasta la aprobación. | [V] | [App Review FAQ](https://developers.tiktok.com/doc/getting-started-faq) |
| Sandbox (sin revisión) | Es un entorno restringido de prueba: hasta 5 sandboxes y hasta 10 cuentas objetivo. **No da acceso a Content Posting API para videos públicos.** | [V] | [Add a Sandbox](https://developers.tiktok.com/doc/add-a-sandbox) |
| Upload en sandbox: ¿se puede terminar público desde la app? | No documentado. Además, el sandbox es para pruebas y no para operar. | [I] | - |
| Límites | **Direct Post:** tope de publicaciones por cuenta de creador cada 24 h, que suele rondar las 15 y se **comparte entre todas las apps** que usan Direct Post. Hay además un tope de creadores activos por app, que sale de lo que se declara en la auditoría. **Upload:** hasta 5 borradores pendientes cada 24 h (error `spam_risk_too_many_pending_share`). **Las dos:** 6 requests por minuto por token. | [V] | [Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines), [Upload ref](https://developers.tiktok.com/doc/content-posting-api-reference-upload-video), [Direct Post ref](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) |
| Errores que delatan el bloqueo | `unaudited_client_can_only_post_to_private_accounts`, `spam_risk_too_many_posts`, `url_ownership_unverified`, `privacy_level_option_mismatch` | [V] | [Direct Post ref](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) |
| Subir el archivo vs. dar una URL | `FILE_UPLOAD`: se sube el archivo en trozos de 5 a 64 MB (el último, hasta 128 MB), y la `upload_url` dura 1 h. `PULL_FROM_URL`: el dominio o prefijo de URL tiene que estar **verificado** (se recomienda un registro DNS), en https y sin redirección, y TikTok tiene 1 h para bajarlo. **Con `FILE_UPLOAD` no hace falta alojar el video.** | [V] | [Media Transfer Guide](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide) |
| Formato | Contenedor MP4 (recomendado), WebM o MOV; códec H.264 (recomendado), H.265, VP8 o VP9; de 23 a 60 FPS; de 360 a 4096 px por lado; hasta 4 GB. Todas las cuentas pueden publicar 3 min, algunas 5 o 10, y la API admite hasta 10 min. La duración máxima de cada cuenta sale de `max_video_post_duration_sec`. No se exige una relación de aspecto: 9:16 es lo habitual, no un requisito. | [V] | Media Transfer Guide + [Query Creator Info](https://developers.tiktok.com/doc/content-posting-api-reference-query-creator-info) |
| Pantalla obligatoria (Direct Post) | Mostrar el apodo de la cuenta. La privacidad se elige en un desplegable **sin valor por defecto**. Mostrar la declaración de Music Usage Confirmation, una vista previa y la opción de declarar contenido comercial. No se manda nada sin el consentimiento expreso del usuario. | [V] | [Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines), *Required UX* |
| Tokens | El access token dura 24 h y el refresh token 365 días. | [V] | [Manage User Access Tokens](https://developers.tiktok.com/doc/oauth-user-access-token-management) |
| Cuenta y app | Se necesita una cuenta de desarrollador con email. Conviene una organización: TikTok desaconseja registrar la app a nombre personal para integraciones reales. Una app web o de escritorio pide la URL del sitio oficial. | [V] | [Register Your App](https://developers.tiktok.com/doc/getting-started-create-an-app) |
| ¿Disponible desde Bolivia? | La documentación de Content Posting API no trae ninguna restricción por país. Las únicas que aparecen son de Research API, Data Portability y Commercial Content API. | [I] | búsqueda en developers.tiktok.com |

**Pasos humanos con app propia:** cuenta de desarrollador, sitio con Términos y Privacidad, video demo,
revisión (con alta probabilidad de rechazo por "uso personal") y autorización OAuth. Sin auditoría, además,
hay que poner la cuenta en privado y pasar cada video a público a mano. **Con Upload API**, cada video exige
abrir la notificación en el teléfono y terminarlo.

---

## 2. YouTube (Data API v3)

| Aspecto | Qué dice la fuente | Estado | Fuente |
|---|---|---|---|
| **Bloqueo en privado (crítico)** | "All videos uploaded via the videos.insert endpoint from unverified API projects created after 28 July 2020 will be restricted to private viewing mode. To lift this restriction, each API project must undergo an audit to verify compliance with the Terms of Service." | [V] | [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) |
| Qué ve el creador | "Creators who use an unverified API client to upload video will receive an email explaining that their video is locked as private, and that they can avoid the restriction by using an official or audited client." (entrada del 28-jul-2020) | [V] | [Revision History](https://developers.google.com/youtube/v3/revision_history) |
| ¿Se puede apelar o hacerlo público? | **No.** Un video bloqueado por venir de una API sin verificar no se puede apelar: hay que volver a subirlo con una API verificada o desde la app o el sitio de YouTube. El servicio puede pedir la auditoría. | [V] | [Ayuda: videos bloqueados como privados](https://support.google.com/youtube/answer/7300965) |
| Cómo se pide la auditoría | Con el formulario *YouTube API Services - Audit and Quota Extension Form*. "A member of YouTube's API Services team will contact you as soon as possible." No hay un plazo publicado. | [V] plazo: no publicado | [Quota and Compliance Audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) |
| Cuota por defecto | "Projects that enable the YouTube Data API have a default quota allocation of 100 search.list calls, 100 videos.insert calls, and 10,000 units per day combined for all other endpoints." | [V] | [Getting Started](https://developers.google.com/youtube/v3/getting-started), [Quota costs](https://developers.google.com/youtube/v3/determine_quota_cost) |
| Costo de `videos.insert` | "Quota impact: 100 calls per day. A call to this method has a quota cost of 1 unit in the Video Uploads quota bucket." Viene del cambio del 1-jun-2026: "API calls to the videos.insert and search.list methods will be charged to their own respective quota buckets." El 4-dic-2025 ya había bajado de "approximately 1600 units to approximately 100 units". **Resultado: 100 subidas por día y proyecto.** El resumen de la página de costos todavía dice 1600, pero es texto viejo: la tabla y el historial de revisiones mandan. | [V] | videos.insert + Revision History |
| Límites del archivo | "Maximum file size: 256GB", tipo `video/*` | [V] | videos.insert |
| Cómo se vuelve Short | Desde YouTube Studio se sube como Short un archivo de **hasta 3 minutos, cuadrado o vertical**. Por API no hay campo "short": YouTube lo clasifica por la duración y la relación de aspecto. | [V] Studio / [I] API | [Ayuda: subir Shorts](https://support.google.com/youtube/answer/12779649) |
| App OAuth "sin verificar" en Producción | Para uso personal (menos de 100 usuarios) se puede seguir usando sin verificar la app: se acepta la pantalla de advertencia al iniciar sesión. El tope es de 100 usuarios nuevos. | [V] | [Excepciones a la verificación](https://support.google.com/cloud/answer/13464323), [Apps sin verificar](https://support.google.com/cloud/answer/7454865) |
| `youtube.upload`, ¿sensible? | Google pone como ejemplo de scope sensible "deleting a YouTube video". Que `youtube.upload` sea sensible no figura textual. | [I] | [Sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) |
| Regla de 7 días | "A Google Cloud Platform project with an OAuth consent screen configured for an external user type and a publishing status of "Testing" is issued a refresh token expiring in 7 days, unless the only OAuth scopes requested are a subset of name, email address, and user profile" | [V] | [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) |
| ¿Vence el refresh token en Producción? | La regla de 7 días es solo para "Testing". El token igual deja de funcionar si se revoca, si "has not been used for six months", o si se supera el tope: "There is currently a limit of 100 refresh tokens per Google Account per OAuth 2.0 client ID." | [V] reglas / [I] que en Producción no vence solo | OAuth 2.0 |

**Conclusión:** la cuota (100 por día) y el OAuth (Producción sin verificar) no son problema. **El bloqueo es
la auditoría de YouTube API.** Un proyecto nuevo sin auditar deja cada video privado, sin arreglo posterior.

---

## 3. Instagram (ya vivo: lo que falta saber)

| Aspecto | Qué dice la fuente | Estado | Fuente |
|---|---|---|---|
| Tope de publicación | Hasta **100 publicaciones por API en 24 h móviles**. Un carrusel cuenta como una. El tope se aplica en `media_publish`, y el consumo se consulta con `GET /<IG_ID>/content_publishing_limit`. | [V] | [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) (actualizada el 30-jun-2026) |
| Contenedores | Hasta **400 contenedores cada 24 h**. Un contenedor que no se publica en 24 h pasa a `EXPIRED`. | [V] | [IG User Media](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media) + Content Publishing |
| Trial reels | Se muestran solo a quienes no te siguen. Se crean con `trial_params.graduation_strategy` = `MANUAL` o `SS_PERFORMANCE`. **Ninguna de las dos páginas documenta un cupo propio.** Cuentan dentro de las 100 publicaciones, porque también son publicaciones por API. | [V] ausencia / [I] que cuentan en las 100 | las dos de arriba |
| Cuándo "gradúa" un trial | Con el pase automático, Instagram lo comparte con los seguidores si rinde bien según las reproducciones de las **primeras 72 h**. | [V] | [Instagram for Creators, 10-dic-2024](https://creators.instagram.com/blog/instagram-trial-reels) |
| Reels | De 3 s a 15 min, hasta 300 MB, relación de aspecto recomendada 9:16 | [V] | IG User Media |
| Inconsistencia de Meta | En la sección de carruseles, la misma guía menciona un máximo de 50 publicaciones cada 24 h. El tope general documentado es 100. | [V] | Content Publishing |

---

## 4. LinkedIn (perfil personal)

| Aspecto | Qué dice la fuente | Estado | Fuente |
|---|---|---|---|
| Permiso | `w_member_social` sirve para publicar en nombre del miembro autenticado. Se obtiene agregando el producto **Share on LinkedIn** en la pestaña Products de la app. | [V] | [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin) |
| Sin revisión | Es un "Open Permission": disponible para cualquier desarrollador, por autoservicio, sin aprobación especial. | [V] | [Getting Access](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access) |
| Video en el perfil | **Sí.** Primero se registra la subida (`/v2/assets?action=registerUpload`, receta `feedshare-video`), después se sube el binario y al final se crea el post en `/v2/ugcPosts` con `shareMediaCategory: VIDEO`. | [V] | Share on LinkedIn |
| Formato de video | De 3 s a 30 min, de 75 KB a 500 MB, MP4. Si el dueño es un miembro, el que llama tiene que ser ese mismo miembro. | [V] | [Videos API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/videos-api) |
| Límite diario | 150 requests por día por miembro y 100.000 por día por app | [V] | Share on LinkedIn, *Rate Limits* |
| Requisitos de la app | El formulario de creación pide una **Página de LinkedIn** (si no hay, ofrece crear una), la URL de la política de privacidad y un logo. La app queda asociada a esa Página para siempre. El superadministrador de la Página aprueba la asociación y tiene 30 días para hacerlo. | [V] | [Crear app](https://www.linkedin.com/help/linkedin/answer/a1667239), [Asociar a una Página](https://www.linkedin.com/help/linkedin/answer/a548360) |
| Token | Todos los access tokens duran **60 días**. Los refresh tokens programáticos son para socios aprobados del Marketing Developer Platform. **Por lo tanto, una app self-serve tiene que re-autorizarse cada unos 60 días.** | [V] 60 días / [I] sin refresh | [Authorization Code Flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow), [Refresh tokens](https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens) |

---

## 5. Facebook

| Aspecto | Qué dice la fuente | Estado | Fuente |
|---|---|---|---|
| IG a perfil de FB, automático, sin API | En la app de Instagram: Perfil, luego **Menú**, **Centro de cuentas** y **Compartir en otros perfiles**. Se elige la cuenta de origen y la de destino, y en *Compartir automáticamente* se activa **Tus reels de Instagram**. | [V] | [Compartir reels de Instagram en Facebook](https://help.instagram.com/459497729122868) (versión iPhone) |
| Condiciones | No está disponible para todos. Solo se hace desde la app de Instagram para Android o iPhone. Un reel se comparte al crearlo. El público en FB sale de la privacidad de IG: si la cuenta de IG es pública, el reel en FB es público. | [V] | misma página |
| IG a Página de FB | Requiere una cuenta profesional de IG, control total de la Página y las dos conectadas. En la app: **Menú**, luego **Publicación cruzada** y el Centro de cuentas; se elige la Página y se activa compartir automáticamente publicaciones, historias o reels. Una cuenta personal de IG ya no puede compartir a una Página. | [V] | [IG profesional a Página](https://help.instagram.com/356902681064399) |
| ¿Funciona con reels publicados por API? | **No documentado.** La ayuda habla solo de la app móvil. | [I] | probar con el primer reel |
| Alternativa manual (en tanda) | Se pueden importar hasta 100 reels anteriores de IG a FB: si son 5 o menos se publican ya, y de 6 a 100 se programan durante 30 días. No entran los reels que ya se publicaron cruzados ni los de contenido de marca, entre otros. En IG: Menú, luego *Controles y herramientas para creadores* y *Compartir reels anteriores en Facebook*. | [V] | [Importar reels de IG a FB](https://www.facebook.com/business/help/1805707773578651) |
| API de FB | La API de Reels publica **solo en Páginas**, de 3 a 90 s en 9:16, con un tope de **30 publicaciones cada 24 h** móviles. Permisos: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`. **El perfil personal no tiene API.** | [V] | [Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing) |

---

## 6. Herramientas pagas con integraciones ya auditadas

Precios publicados el 29-sep-2026, en USD y sin impuestos.

| | **Buffer** | **Metricool** | **Ayrshare** |
|---|---|---|---|
| Precio | Se cobra **por canal**: Essentials US$6 por canal al mes (US$5 con pago anual, US$60 al año), Team US$12 (US$10 anual). Free: 3 canales y 10 posts programados por canal. Prueba de 14 días. [V] | **Starter** desde US$25 al mes (US$20 anual), hasta 5 marcas. **Advanced** desde US$67 al mes (US$53 anual), hasta 15 marcas. Free: 1 marca, 20 posts al mes, sin LinkedIn. Precios sin IVA. [V] | **Premium** US$149 al mes: 1 perfil social y hasta 14 cuentas en 14 redes. Se cobra al alta, sin prueba (la prueba de 28 días es del plan Launch). [V] |
| API para el agente | **Sí, en todos los planes** (GraphQL: crear, leer y borrar posts). Por clave, cada 24 h: 100 requests en Free, 250 en Essentials y 500 en Team. [V] | **API REST solo en Advanced o Custom.** El **MCP** está en todos los planes, incluso Free, y crea y edita posts programados. La conexión por token pasa por la API, así que exige Advanced. [V] | Todos los planes incluyen la API. [V] |
| Video por API | No hay endpoint de subida. Se pasa una URL pública, que tiene que seguir accesible hasta que el post salga. [V] | La URL tiene que ser pública y no vencer. Se "normaliza" para que quede alojada en Metricool y se usa su `mediaId`. [V] ¿El MCP adjunta video? Solo se documenta que algunos ajustes de adjuntos "pueden" requerir el planificador. [I] | no revisado |
| TikTok | Publica automático. La tabla de precios lo lista solo para "TikTok business profiles". [V] Con cuenta personal: no documentado. [I] Música o encuestas se agregan a mano, por notificación. [V] Video de 3 s a 10 min, hasta 1 GB. [V] | Publica automático para **cuentas personales y business**, de 3 s a 10 min, hasta 500 MB. [V] | no revisado |
| YouTube | **Solo Shorts**: los videos largos no están soportados. [V] | **Videos largos (más de 60 s, horizontales) y Shorts (hasta 3 min)**, hasta 500 MB. Privacidad pública, oculta o privada. Hasta 20 posts cada 24 h en planes pagos. Un canal sin verificar no sube más de 15 min. [V] | no revisado |
| LinkedIn perfil | Publica automático. [V] | Sí, perfil o Página (no los dos en la misma marca). No está en el plan Free. [V] | no revisado |
| Facebook | Solo Páginas. El perfil personal no se puede conectar por restricciones de la API. [V] | Páginas: en todos los planes, dentro de "todas las redes excepto LinkedIn y X" en Free. [V] | no revisado |
| Fuentes | [pricing](https://buffer.com/pricing), [API](https://buffer.com/api), [Hosting Media](https://developers.buffer.com/guides/hosting-media.html), [Create Video Post](https://developers.buffer.com/examples/create-video-post.html), [YouTube Shorts](https://support.buffer.com/en-us/articles/using-youtube-shorts-with-buffer-Jl8iR6jIck), [TikTok](https://support.buffer.com/en-us/articles/using-tiktok-with-buffer-oGEroY9Of2), [canales](https://support.buffer.com/en-us/articles/supported-channels-LM3P7Y4zsp) | [pricing](https://metricool.com/pricing/), [API](https://help.metricool.com/basic-guide-for-api-integration-r97af), [MCP vs API](https://help.metricool.com/mcp-vs-api-access-what-is-the-difference-5y3ib), [límites MCP](https://help.metricool.com/mcp-limits-and-plan-requirements-h72jg), [TikTok](https://help.metricool.com/en/article/schedule-and-post-on-tiktok-pl1qpr/), [YouTube](https://help.metricool.com/en/article/schedule-and-publish-on-youtube-btmd1m), [LinkedIn](https://help.metricool.com/how-to-connect-linkedin-to-metricool-jq80g) | [pricing](https://www.ayrshare.com/pricing/) |

**Lectura:** Metricool es la única de las tres revisadas a fondo que cubre las 4 redes que faltan, incluido
**YouTube horizontal**. Buffer es la más barata con API, pero no sube videos largos a YouTube. Ayrshare
cuesta más del doble que Metricool Advanced y no aporta nada que haga falta acá.

---

## 7. Ruta recomendada por red

| Red | Ruta | Por qué |
|---|---|---|
| **Instagram** | Seguir con `ig-reel.mjs`, sin cambios. | Ya funciona. El tope de 100 por día no se toca. |
| **TikTok** | **Por una herramienta auditada, no con app propia.** Primero Metricool Free (US$0): conectar TikTok y probar que el agente publique un video por el MCP. Si funciona, pasar a Starter; si el MCP no adjunta video, a Advanced (API documentada). | La app propia queda en privado y su auditoría la rechaza por escrito. Metricool admite cuentas personales. |
| **YouTube Shorts y horizontales** | **Metricool**, que publica en público. **No ejecutar el paso a paso de YouTube del README tal como está:** el resultado serían videos privados sin arreglo. Si igual se quiere API propia, primero se crea el proyecto y se envía el formulario de auditoría, y `yt-video.mjs` se escribe cuando esté aprobado. | El bloqueo en privado está verificado y no se apela. Metricool cubre largo y Short. Buffer solo Shorts. |
| **LinkedIn perfil** | Si se contrata Metricool Starter o superior: por Metricool, sin otro token que mantener. Si no: app propia *Share on LinkedIn* (gratis), asociada a la Página de ONIA, con re-autorización cada unos 60 días. | Las dos rutas están documentadas. La propia cuesta mantenimiento humano cada 2 meses. |
| **Facebook** | Activar el compartido automático en el Centro de cuentas (perfil y, si hay, Página) y mirar si aparece el primer reel publicado por API. Si no aparece: Página por Metricool (o Reels API a la Página), y el perfil con la importación manual de reels anteriores en tanda. | No hay API para el perfil. El compartido automático con reels publicados por API no está documentado. |

**Costo de la ruta:** US$0 para probar (Metricool Free, sin LinkedIn). US$25 al mes (Starter) si el MCP
publica video y se suma LinkedIn. US$67 al mes (Advanced) si hace falta la API REST. **Es gasto: lo decide
Sergio Urcullo.**

## 8. Qué tiene que hacer Sergio Urcullo (y nada más)

1. **Facebook:** activar *Compartir en otros perfiles*, luego *Tus reels de Instagram*, en la app de
   Instagram del teléfono. Si también va a la Página: *Publicación cruzada*. Son 2 minutos.
2. **Decidir el gasto** de la herramienta: US$0 para la prueba, US$25 o US$67 por mes.
3. **Conectar sus cuentas** a la herramienta: una vez por red, con OAuth, aceptando sus términos. Es un
   paso suyo, no del agente.
4. **Solo si se elige LinkedIn propio:** crear la app con la Página de ONIA, aprobar la asociación como
   superadministrador, apretar "Permitir" y repetirlo cada unos 60 días.
5. **Solo si se quiere YouTube por API propia:** enviar el formulario de auditoría. Mientras no se apruebe,
   no se sube nada por esa vía.
6. **TikTok con música de la app:** esa pieza sale por notificación y la termina él en el teléfono.

## 9. Lo que no está verificado (probar, no suponer)

- Si los reels publicados por API disparan el compartido automático a Facebook.
- Si el MCP de Metricool adjunta video, no solo texto. Se prueba en el plan Free antes de pagar.
- Si Buffer publica automático en una cuenta **personal** de TikTok. Su tabla menciona solo cuentas business.
- Si la Upload API de TikTok en sandbox deja terminar un video en público desde la app. Igual no se
  recomienda.
- El plazo de la auditoría de YouTube API y si aprueba una herramienta de uso personal: no está publicado.
- TikTok desde Bolivia: no hay restricción por país documentada para Content Posting API.
- El MCP de Higgsfield tiene herramientas `tiktok_*`. No se evaluaron, y la regla del repo reserva ese MCP
  para agentes de chat.
