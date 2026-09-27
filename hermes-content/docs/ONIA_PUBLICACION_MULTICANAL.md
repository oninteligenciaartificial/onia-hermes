# Operación multicanal · Sergio y ONIA

> Inventario y protocolo de acceso/publicación revisados el 27-sep-2026. Sergio confirmó **seis destinos**: cinco redes iniciales y luego su canal personal de YouTube. Esta página **no** contiene contraseñas, tokens ni códigos 2FA. Los estados históricos no prueban conexión vigente. Complementa la [bóveda de contenido](ONIA_MARCA_PERSONAL_BOVEDA.md) y no sustituye los acuerdos de aprobación por pieza.

## Estado de la infraestructura hoy

- `https://postiz.onia.com.bo/`, `/auth/login` y `/api/` responden **502**; `onia.com.bo` y Chatwoot responden 200. Diagnóstico VPS **sólo lectura** del 27-sep: no hay contenedores ni servicios Docker de Postiz/Temporal/Postgres/Redis, tampoco listeners en 4007/5000/7233. El proyecto Compose `/opt/postiz/postiz-docker-compose` enumera los servicios previstos, pero `compose ps -a` está vacío; los volúmenes siguen presentes. Traefik apunta a un backend inexistente. Aún no se sabe quién/cuándo detuvo o retiró la pila. No hay API key de Postiz ni tokens sociales en el proceso local consultado; eso no demuestra ausencia en el VPS.
- El 4-sep, restaurar Postiz/Temporal liberó **cinco posts vencidos** sin aprobación nueva; 57 restantes pasaron a borrador según el handoff `handoff/claude-git-status-935f47.md`. **No reiniciar ni recuperar el scheduler a ciegas.** Primero inspeccionar cola y jobs en modo lectura, respaldar, y acordar cómo neutralizar vencidos antes de levantarlo.
- n8n responde y conserva el flujo de comentario de Instagram → DM, pero no es un publicador general de todas las redes. Postiz programa publicaciones; no es bandeja de comentarios/DM. No confundir conectividad de un servicio con permiso vigente de cada cuenta.

## Inventario sin credenciales

| Identidad | Destino confirmado por Sergio | Evidencia de acceso / acción |
|---|---|---|
| Sergio | [Instagram `@sergiourcullo`](https://www.instagram.com/sergiourcullo/?hl=es) | URL confirmada 27-sep; integración Postiz histórica, **no verificable hoy** por 502. Sergio confirmó que el primer video ya está publicado, sin URL del post aún. |
| Sergio | [LinkedIn personal](https://www.linkedin.com/in/sergiourcullo/) | URL confirmada 27-sep; OAuth/publicador actual sin verificar. Caption propio, no copia automática del de Instagram. |
| Sergio | [Facebook personal](https://www.facebook.com/sergio.urcullo.7?locale=es_LA) | URL confirmada 27-sep. [Postiz documenta Facebook **Page**, no perfil personal](https://docs.postiz.com/general/platforms/overview); tratar publicación en este perfil como paso nativo/manual, sujeto a aprobación por pieza. No usar cookies/extensión como atajo para eludir esa limitación. |
| ONIA | [Instagram `@oniahq`](https://www.instagram.com/oniahq/?hl=es) | URL confirmada 27-sep; integración Postiz histórica, **no verificable hoy** por 502. Demo/producto y claims pasan catálogo y QA. |
| ONIA | [Página Facebook `oniahq`](https://www.facebook.com/oniahq?locale=es_LA) | URL confirmada 27-sep; conexión directa/cross-post actual sin verificar. Elegir una sola ruta para evitar duplicados. |
| Sergio | [YouTube `@sergiourcullo`](https://www.youtube.com/@sergiourcullo) · `UCk_4mmXsWTxlk63rpz2hRtg` | URL confirmada por Sergio y página pública verificada el 27-sep. **Identidad pública no implica acceso de subida**. Postiz soporta YouTube con OAuth, pero hoy está 502. `scripts/social_publisher.py` sólo prepara metadatos; no sube. No hay `YOUTUBE_*` configuradas en el entorno local ni en el `.env` operativo revisado por presencia. |

TikTok, X, la cuenta de Lucía, un posible YouTube de ONIA y la comunidad WhatsApp aparecen en planes/registros históricos, **pero no forman parte de estos seis destinos confirmados**. La comunidad conserva su propio carril editorial; no se conecta a Postiz por inferencia. La URL `youtube.com/@oniahq` devolvió 404 en la verificación pública; no inferir un canal de ONIA.

## Ruta oficial por destino

Postiz puede volver a ser el panel central para cinco destinos, pero no es hoy
la única vía ni el primer gate. Cada conexión debe usar OAuth oficial y cada
publicación debe verificarse en la plataforma, no sólo en el scheduler.

| Destino | Ruta estable propuesta | Permisos / prerrequisitos | Prueba segura antes de publicar | Evidencia final |
|---|---|---|---|---|
| Instagram Sergio | OAuth de cuenta profesional en Postiz recuperado o API oficial de Instagram | Elegir **una** modalidad: Instagram Login (`instagram_business_basic`, `instagram_business_content_publish`) o Facebook Login con Página vinculada (`pages_show_list`, `instagram_basic`, `instagram_content_publish`, `pages_read_engagement` y tarea de crear contenido). No mezclar modelos por costumbre. | Crear el contenedor, esperar estado `FINISHED` y **no** ejecutar `media_publish`. Es validación transitoria, no borrador duradero. | Media ID y permalink visibles en `@sergiourcullo`. |
| Instagram ONIA | Misma ruta oficial, autorización separada de `@oniahq` | Cuenta profesional, identidad ONIA y acceso correcto; no reutilizar por inferencia la autorización de Sergio. | Igual: contenedor terminado sin publicarlo, o borrador interno de Postiz cuando esté sano. | Media ID y permalink en `@oniahq`; claim contrastado con producto. |
| LinkedIn Sergio | OAuth de miembro + [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api) o integración Postiz | Producto Share on LinkedIn, OAuth 3-legged y `w_member_social`. Para 2–20 imágenes usar MultiImage orgánico, no «carousel» publicitario. | Guardar borrador interno en Postiz. La creación por Posts API usa `PUBLISHED`; **no** usar un POST real como test privado. | Header `x-restli-id`, lectura del URN como autor y URL pública en el perfil correcto. |
| Facebook personal Sergio | Publicación nativa/manual | Sesión de Sergio y aprobación exacta. Los permisos de Pages no habilitan el perfil personal. | Borrador nativo si la interfaz lo permite; no existe test por Postiz para este destino. | URL pública, fecha y perfil `sergio.urcullo.7`. |
| Página Facebook ONIA | OAuth `Facebook Page` en Postiz o Pages API | Rol/tarea con creación de contenido; `pages_manage_posts` y permisos de selección/lectura que la app requiera (`pages_show_list`, `pages_read_engagement`). | Borrador interno Postiz. No afirmar «prueba privada» por Graph API sin validar el formato y visibilidad concretos. | Page post ID y URL visible desde una sesión sin rol de app. |
| YouTube Sergio | OAuth en Postiz o [YouTube Data API `videos.insert`](https://developers.google.com/youtube/v3/docs/videos/insert) | Scope mínimo de subida `youtube.upload`; comprobar antes que la identidad OAuth corresponde a `UCk_4mmXsWTxlk63rpz2hRtg`. No usar tokens del canal Máquina Humana. | Subir con `privacyStatus=private`; un proyecto API no auditado puede quedar limitado a privado incluso si la subida funciona. | Video ID, `videos.list` autenticado, canal correcto y luego URL `youtube.com/watch?v=<id>` cuando la versión sea pública. |

Fuentes operativas: [Meta Instagram API](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api),
[LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api),
[LinkedIn OAuth/access](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access),
[YouTube upload/OAuth](https://developers.google.com/youtube/v3/guides/uploading_a_video) y
[canales admitidos por Postiz](https://docs.postiz.com/general/platforms/overview).
Las páginas de Meta deben revalidarse al implementar porque versión, permisos y
flujos de login pueden cambiar.

## Orden de puesta en marcha

1. Aprobar arte, caption, destino y hora; el
   [paquete de carruseles v2](cola/APROBACION-CARRUSELES-SERGIO-2026-09-27.md)
   sirve como contrato cerrado del primer lote.
2. Mientras Postiz esté 502, usar publicación nativa sólo para piezas exactas
   aprobadas. No introducir una automatización paralela improvisada.
3. Conectar OAuth oficial **una cuenta por vez** y verificar identidad antes de
   cualquier escritura. YouTube empieza con subida privada; LinkedIn no ofrece
   un POST de prueba no público, por lo que su primera escritura debe ser una
   pieza real ya aprobada.
4. Recuperar Postiz sólo en otra intervención autorizada, con respaldo,
   neutralización de vencidos y workers controlados. Después listar
   integraciones y comprobar conexión viva; recién entonces crear borradores.
5. Para cada publicación, verificar URL/ID público en la identidad correcta y
   registrar la fecha. Un contenedor, borrador, `201` o respuesta del scheduler
   no equivale a publicación comprobada.

## Acceso estable, sin perderlo ni exponerlo

1. Sergio mantiene propiedad, correo de recuperación y 2FA. Conectar cada canal mediante el OAuth/rol oficial dentro del publicador aprobado; no pedir ni pegar contraseñas, cookies de sesión, recovery codes o tokens por chat.
2. Postiz self-hosted es el candidato central para las **cinco cuentas que su catálogo puede admitir** (dos Instagram, LinkedIn personal, Página Facebook ONIA y YouTube Sergio), pero primero se recupera sin liberar cola vencida. YouTube además requiere configurar la app OAuth correcta y probar una subida **privada** al canal verificado antes de siquiera programar material público. El Facebook personal de Sergio va por publicación nativa/manual. La [API de Postiz permite listar integraciones](https://docs.postiz.com/public-api/integrations/list) y [verificar conexión](https://docs.postiz.com/public-api/integrations/is-connected); los identificadores y estado, no las credenciales, se registran aquí después de consulta viva.
3. Secretos sólo en almacenamiento restringido del servicio/VPS. La key de Postiz que un handoff antiguo reporta expuesta debe **rotarse** una vez asegurada la recuperación, coordinando scripts dependientes. No guardar valores en Git, Notion ni la bóveda.
4. Una ruta publicadora por cuenta. Si la Página Facebook ONIA cruza nativamente desde IG, no programar una segunda copia directa sin comprobar que no duplica. El perfil Facebook personal de Sergio no se presenta como canal Postiz; registrar enlace/fecha de la publicación manual. Si una plataforma revoca OAuth, registrar el paso humano y no simular que sigue automatizada.
5. Mantener un registro de último acceso verificado, vencimiento conocido si lo hay, próxima revisión y dueño de reconexión. «Cuenta viva» significa detección y reautorización a tiempo + contenido aprobado; ninguna herramienta puede garantizar una sesión perpetua.

## Contrato para publicar sin sorpresas

Una autorización general para **operar** cuentas no equivale a aprobar cualquier video con la cara de Sergio ni posts de producto. Para cada pieza o lote cerrado, registrar antes de programar:

```text
ID de pieza / versión exacta:
Archivo final y hash:
Cuenta(s) y formato(s):
Caption por red + único CTA:
Recurso/DM probado, si se promete:
Fecha/hora y zona horaria:
QA editorial/privacidad:
Aprobación explícita de Sergio para esta versión y destinos:
Postiz draft ID → scheduled ID → URL/ID público verificado:
```

El lote puede aprobarse de una sola vez si especifica cada pieza, cuenta y horario. Cambios en un render/caption después de la aprobación requieren revalidación. No usar automatizaciones para publicar un master rechazado, un carrusel con errores visuales o un CTA sin entrega.

## Recuperación segura de Postiz y puesta en marcha

1. **Sólo lectura, hecho 27-sep:** el 502 es un backend ausente, no un simple OAuth expirado. Compose y volúmenes existen; no hay contenedores, servicios ni listeners de Postiz/Temporal. Revisar cuándo/por qué se retiró la pila y el estado de respaldos. La cola interna **no pudo leerse** sin levantar base/servicio; no confundirlo con «cola vacía».
2. **Antes de reactivar jobs:** diseñar respaldo de volúmenes/DB y una inspección de cola sin levantar el publicador ni sus workers. Preparar tratamiento reversible de publicaciones vencidas y pedir aprobación explícita para cualquier cambio en cola/servicios, porque el arranque podría publicar en cuentas reales.
3. **Recuperar y probar:** tras autorización, validar frontend y `/api/` reales; listar integraciones y detectar deshabilitadas/reauth; crear **borrador** de prueba (no publicación) por tipo de canal; confirmar que la cola vencida no sale sola.
4. **Conectar lo faltante:** OAuth oficial una cuenta a la vez, revisando perfil/identidad/alcance. Sergio completa el paso de identidad/2FA cuando el proveedor lo exija. Registrar ID de integración y fecha, nunca token.
5. **Publicar lote aprobado:** subir asset correcto, programar, verificar publicación real por URL/ID y anotar fallo/reintento. No inferir éxito de un `200` al crear borrador. Para YouTube, comprobar identidad `UCk_4mmXsWTxlk63rpz2hRtg`, privacidad, título, descripción, miniatura y audiencia infantil antes del paso público; no reutilizar el uploader ni los tokens de otro canal del repo.
6. **Vigilar:** alerta sólo si Postiz cae, una integración pide reautorización, hay post vencido/fallido, o una cuenta se queda sin próxima pieza aprobada. Revisar por separado el perfil Facebook personal, porque no está en la cola Postiz. Sin auto-restart ni autopublicar material viejo.

## Cadencia y contenido

El objetivo histórico de 10–13 publicaciones por día no es evidencia de capacidad ni de entregas. Usar una **cola por cuenta** con al menos una próxima pieza aprobada y fecha visible; derivados del mismo tutorial pueden ir a Instagram y LinkedIn con encuadre/caption adecuados, a la Página ONIA sólo si corresponde al producto, y al Facebook personal mediante publicación nativa aprobada. ONIA publica pruebas de producto reales; Sergio enseña herramientas; la comunidad recibe el archivo probado y los casos. Si no hay pieza aprobada, se marca hueco y se prepara una, no se llena con contenido genérico.

## Fuentes de esta revisión

- `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md` — inventario histórico de seis plataformas de Sergio.
- `ONIA_ARQUITECTURA_CUENTAS_Y_MODELOS.md` — tres integraciones Instagram históricas y plan por identidad; fechas de agosto, no estado actual.
- `handoff/claude-git-status-935f47.md` — incidente de Postiz/Temporal y posts vencidos.
- `ONIA_POSTIZ_COMENTARIOS_DM_20260817.md` — separación entre programación y bandeja de mensajes.
- [Postiz, conexión OAuth de canales](https://docs.postiz.com/general/channels/connect) y [API de integraciones](https://docs.postiz.com/public-api/integrations/list) — capacidad técnica actual de la herramienta, no prueba de que nuestras cuentas estén conectadas.
