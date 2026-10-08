# Bandeja del chatbot: interfaz propia, velocidad y app móvil

> Pedido de Sergio Urcullo (8-oct): cambiar la interfaz (Chatwoot es open source) o tener la nuestra, que vaya rápido, que se pueda descargar local, usarla desde nuestra plataforma y una app móvil. Lo verificaron 3 agentes con fuentes primarias y un cuarto armó la recomendación. Un tema = un archivo sin fecha.

Sergio Urcullo, la interfaz propia ya existe. La pantalla `/inbox` de Onia Platform es nuestra y solo usa Chatwoot por detrás para traer los datos. El dueño del negocio nunca ve la pantalla de Chatwoot. Lo que falta es hacerla rápida e instalable.

### 1. Recomendación

1. Seguimos con Chatwoot detrás y con la interfaz propia en Onia Platform. No lo rebrandeamos ni lo reemplazamos.
2. **Rebrandear Chatwoot no conviene.** Se puede porque su código es MIT, pero habría que mantener su código al día con cada versión. Además, quitar el "Powered by Chatwoot" es una función paga, y hacerlo a mano en una copia propia es terreno gris (no verificado con un abogado).
3. **Reemplazar Chatwoot tampoco conviene.** Hoy nos resuelve el canal de WhatsApp, las plantillas y los avisos de mensajes nuevos. Rehacer eso es construir, y con cero clientes construir es lo que sobra (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §4-5).
4. La lentitud no viene de Chatwoot. Viene de cómo nuestra pantalla le pide los datos: pregunta cada 5 y cada 15 segundos en vez de que le avisen. Se arregla en nuestro código.
5. La app móvil va primero como app instalable desde el navegador (PWA), sin costo. Las tiendas de Apple y Google, solo si eso se queda corto.

### 2. Punto por punto

| Pedido | ¿Se puede? | Cómo | Quién | Costo | Orden |
|---|---|---|---|---|---|
| Interfaz propia | Sí, ya existe | `/inbox` en Onia Platform. Pendiente: sumar la rama `codex/c16b-bandeja` (paginación y plantillas de WhatsApp) | Plataforma: revisar y mergear | 0 | 1 |
| Velocidad | Sí | **(a) Ajustes rápidos:** pausar las consultas con la pestaña oculta, marcar como leído solo al abrir y guardar unos segundos qué empresa es dueña de cada conversación. Hoy son unas 40-45 llamadas por minuto (estimado, no medido). **(b) Tiempo real:** que los avisos de Chatwoot lleguen solos a la pantalla, con la consulta periódica solo como respaldo. Pedir solo los mensajes nuevos depende de que la API de Chatwoot lo permita (no verificado) | (a) Codex · (b) Plataforma | 0 | 2 y 3 |
| Descargar local | Sí, como app instalable (si "descargar local" era otra cosa, aclarámelo) | El manifiesto ya existe. Falta que la app guarde su pantalla base para abrir sin internet: hoy sin red no abre | Codex | 0 | 4 |
| Nuestra plataforma | Sí, ya es así | Chatwoot queda como motor detrás y no se le muestra a nadie | - | 0 | - |
| App móvil | Sí, en tres escalones | **Hoy, puente:** la app oficial de Chatwoot (MIT) contra nuestro servidor, gratis. Muestra la pantalla de Chatwoot, no la nuestra; sirve solo para tu uso personal. **Después:** nuestra PWA con avisos al celular, con el código ya hecho. Falta confirmar la clave de avisos en producción (no verificado). En iPhone los avisos solo funcionan si se agrega a la pantalla de inicio. **Más adelante:** tiendas con Capacitor, USD 99/año Apple + USD 25 una vez Google (precios de blogs, falta confirmarlos con Apple y Google). Apple suele rechazar apps que son solo la web envuelta | Puente: Sergio Urcullo · PWA: Codex · Tiendas: Plataforma | 0 / 0 / ~USD 124 el primer año | Ya / 4 / solo si hace falta |

**Sin verificar:** la velocidad real (no se midió nada en producción), qué ajustes de marca de Chatwoot están bloqueados en la versión que tenemos instalada, y las reglas vigentes de Apple y Google.

### 3. Primeras 3 tareas

**T1 (Codex, código cerrado): bajar las llamadas a Chatwoot.**
- Archivos: `InboxClient.tsx` y `app/api/bandeja/[id]/route.ts`.
- Cambios: pausar las consultas cuando la pestaña está oculta, marcar como leído solo al abrir la conversación y guardar unos 30 segundos qué empresa es dueña de cada conversación.
- **Hecho cuando:**
  - tsc y los tests pasan.
  - Se cuentan las llamadas a Chatwoot por minuto en desarrollo, antes y después, con una conversación abierta.
  - Bajan al menos a la mitad, y llegan a 0 con la pestaña oculta.

**T2 (Plataforma): mensajes en tiempo real.**
- Primero se suma la rama `codex/c16b-bandeja`.
- Después, el aviso de mensaje nuevo que ya entra en `app/api/webhooks/chatwoot/route.ts` se reenvía a la pantalla abierta.
- La consulta periódica queda como respaldo cada 60 segundos.
- **Hecho cuando** un WhatsApp de prueba aparece en `/inbox` de producción en menos de 2 segundos, mirado en pantalla, no deducido de un 200.

**T3 (Codex, código cerrado; al final, 5 minutos tuyos): la app instalable.**
- **Codex:**
  - En `public/sw.js`: que la app guarde su pantalla base para abrir sin internet.
  - En `public/manifest.json`: separar los íconos `maskable` y evaluar que la app abra directo en `/inbox`.
- **Plataforma:** confirmar que la clave de avisos (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`) esté puesta en el build de producción.
- **Sergio Urcullo:** instalarla en tu celular desde "Agregar a inicio".
- **Hecho cuando:**
  - La app se instala.
  - Abre sin internet mostrando su pantalla base.
  - Te llega el aviso "te escribieron" al celular.

---

## Verificaciones (fuentes)

=== CHATWOOT ===
Todo se verificó leyendo fuentes primarias (el repo y la doc oficial), sin instalar, editar ni iniciar sesión en nada. Lo que no pude confirmar va marcado "no verificado".

| # | Punto | Respuesta | Fuente |
|---|---|---|---|
| 1 | Licencia | El repo es MIT ("MIT Expat", © 2017-2026 Chatwoot Inc.). Las excepciones son la carpeta `enterprise/`, que tiene su propia licencia, y los componentes de terceros, que mantienen la suya. | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/LICENSE |
| 1 | Licencia de `enterprise/` | No es libre. Usarla en producción exige un acuerdo de uso (los Enterprise Terms) más una licencia Enterprise por cantidad de usuarios. Puedes modificarla y copiarla para desarrollo y pruebas sin suscripción. Copiar, distribuir, sublicenciar o vender está prohibido. Qué funciones concretas son enterprise: no verificado, porque ese archivo no las lista. | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/enterprise/LICENSE |
| 2 | Cambiar interfaz, marca y logo | El código base es MIT, así que se puede forkear y modificar la interfaz. Además hay ajustes de instalación para nombre (`INSTALLATION_NAME`), logo y logo oscuro (`LOGO`, `LOGO_DARK`), favicon (`LOGO_THUMBNAIL`), `BRAND_NAME`, `BRAND_URL` y `WIDGET_BRAND_URL`. Si esos ajustes están bloqueados por plan en self-hosted: no verificado. | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/config/installation_config.yml |
| 2 | Quitar "Powered by Chatwoot" del widget | La función `disable_branding` está marcada `premium: true`, es decir, es una función de pago. El widget lee ese flag por cuenta. Con el código MIT se podría quitar a mano en un fork, pero eso queda fuera de la licencia Enterprise. Si el aviso de derechos de autor del MIT lo impide: no verificado, y conviene que lo confirme un abogado. | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/config/features.yml (líneas 35-38); https://raw.githubusercontent.com/chatwoot/chatwoot/develop/app/views/widgets/show.html.erb (línea 31) |
| 2 | Nombre y marca registrada "Chatwoot" | La licencia MIT no trae cláusula de marca. Si hay una política aparte de uso de la marca: no verificado. | https://raw.githubusercontent.com/chatwoot/chatwoot-mobile-app/develop/LICENSE (solo para la app móvil) |
| 3 | API para una interfaz propia | Hay tres familias, disponibles en self-hosted. La **Application API** sirve para agentes y automatización, con el token de acceso del usuario. La **Client API** sirve para construir un chat propio para el cliente final, con `inbox_identifier` y `contact_identifier`. La **Platform API** administra cuentas y usuarios, y solo existe en self-hosted. | https://developers.chatwoot.com/api-reference/introduction |
| 3 | Conversaciones | Se pueden listar, crear, filtrar, ver detalle, actualizar, cambiar estado y prioridad, asignar, indicar que se está escribiendo, marcar como leído y gestionar atributos y etiquetas. | https://developers.chatwoot.com/llms.txt (sección Conversations) |
| 3 | Mensajes, adjuntos y plantillas de WhatsApp | Los endpoints de mensajes permiten listar, crear, actualizar y borrar. Los adjuntos se suben por `multipart/form-data` en el campo `attachments[]`. Las plantillas de WhatsApp se envían con `template_params` (nombre, categoría, idioma y parámetros). Las plantillas disponibles se listan en la sección de inboxes. | https://developers.chatwoot.com/api-reference/messages/create-new-message.md ; https://developers.chatwoot.com/api-reference/inboxes/list-whatsapp-message-templates.md |
| 3 | Webhooks | Hay endpoints para crear, listar, actualizar y borrar. Los 10 eventos son: `conversation_created`, `conversation_status_changed`, `conversation_updated`, `message_created`, `message_updated`, `contact_created`, `contact_updated`, `webwidget_triggered`, `conversation_typing_on` y `conversation_typing_off`. | https://developers.chatwoot.com/api-reference/webhooks/add-a-webhook.md |
| 3 | Tiempo real | Usa ActionCable (el websocket de Rails) con Redis, y el canal `RoomChannel`. Emite eventos de presencia y transmite por `pubsub_token`. La doc oficial no lo documenta como API, así que una interfaz propia depende de internos que pueden cambiar. Los eventos de mensajes por ese canal: no verificado. Alternativa documentada: webhooks para recibir y la API para enviar. | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/app/channels/room_channel.rb ; https://raw.githubusercontent.com/chatwoot/chatwoot/develop/config/cable.yml |
| 4 | App móvil oficial | Es open source bajo MIT (© Chatwoot Inc.), hecha con React Native y Expo. Requiere iOS 13.4 o superior, Android 6.0 o superior y Chatwoot 3.13.0 o superior. Está publicada en App Store y Google Play. | https://github.com/chatwoot/chatwoot-mobile-app ; https://raw.githubusercontent.com/chatwoot/chatwoot-mobile-app/develop/LICENSE |
| 4 | Rebrandear y publicar como propia | La doc oficial describe cómo hacer una build personalizada con tu propio identificador de app. Los pasos son: proyecto Firebase para notificaciones push, configurar `.env`, cargar `FIREBASE_PROJECT_ID` y `FIREBASE_CREDENTIALS` en Super Admin, configurar deep links y compilar y enviar con EAS (Expo). Las cuentas de desarrollador de las tiendas "presumiblemente" hacen falta, pero la página no lo dice. La licencia MIT permite modificar y distribuir. Políticas de las tiendas: no verificado. | https://developers.chatwoot.com/self-hosted/custom-mobile-app.md |
| 4 | Cliente Flutter para la Client API | Existe un SDK en Flutter para armar un chat propio. Licencia y estado: no verificado. | https://github.com/chatwoot/chatwoot-flutter-sdk (enlazado desde la introducción de la API) |

**Respuesta a tus preguntas**
- **¿Se puede cambiar la interfaz a nuestro gusto?** Sí, por el código MIT. Evitemos tocar `enterprise/` y no usemos sus funciones de pago.
- **¿Interfaz propia sobre la API de Chatwoot, o interfaz propia sin Chatwoot?** Es viable con la API de Chatwoot, con una condición. Enviar es sencillo (mensajes, adjuntos y plantillas). Recibir en tiempo real queda mejor con webhooks que con ActionCable, porque el websocket no es API documentada.
- **App móvil:** sí, es posible, ya sea con una build propia de la app oficial o con una app nuestra sobre la API.
- **Velocidad:** no pude medirla. Sería una prueba aparte, hecha sobre nuestra instalación.

**Pendientes antes de decidir:** conseguir el texto exacto de los Enterprise Terms, ver qué ajustes de marca están bloqueados por plan en self-hosted, y confirmar las políticas de publicación de Apple y Google.

=== BANDEJA ===
**Verificado leyendo `origin/master` y `origin/codex/c16b-bandeja` de `C:/dev/proyectos/onia-platform` con `git show` y `git grep`. No se editó ni instaló nada, y no se midió nada en producción. Lo que no pude verificar va marcado como "no verificado" o "estimado".**

## 1. Cómo funciona hoy `/inbox`

**Archivos:**
- `app/(dashboard)/inbox/page.tsx` es solo el control de acceso (`bandejaProfile()`) y el título.
- `app/(dashboard)/inbox/InboxClient.tsx` (424 líneas) es la interfaz.
- `app/api/bandeja/route.ts` devuelve la lista de conversaciones.
- `app/api/bandeja/[id]/route.ts` devuelve el detalle y recibe las acciones de responder y cambiar el estado.
- `lib/chatwoot.ts` es el cliente de Chatwoot.

**Cómo trae los datos:** es por sondeo (polling), no en tiempo real. No hay `EventSource`, WebSocket ni Supabase Realtime en el inbox. `page.tsx` lo dice: "polling suave".
- `InboxClient.tsx:125` pide la lista cada 15 s (`setInterval(cargarLista, 15_000)`).
- `InboxClient.tsx:134` pide el detalle de la conversación abierta cada 5 s (`setInterval(…, 5_000)`).
- Cada pedido va del navegador a `/api/bandeja` y de ahí a la API REST de Chatwoot (`/api/v1`), con `api_access_token` de servidor (`lib/chatwoot.ts:55`).
- Cada llamada a Chatwoot tiene un timeout propio (`AbortSignal.timeout`, línea 53) y las escrituras tienen un tope de 20 s (`lib/chatwoot.ts:41`).

**Qué llamadas hace:**
- Lista: `listConversations(inboxId)` por cada inbox de la org, en paralelo. Pide `status=all&sort_by=last_activity_at_desc` (`lib/chatwoot.ts:615-620`). Luego filtra en el servidor con `esDeInbox` y ordena.
- Detalle: `getConversation` (para validar de qué org es), `markConversationSeen` (un POST), `listMessages` (`app/api/bandeja/[id]/route.ts`).

**Qué agrega la rama `codex/c16b-bandeja`** (19 archivos, +760/-114):
- **Paginación de la lista:** `listConversations(inboxId, page)`, el parámetro `?page=` en la ruta, `hayMas` en la respuesta, y `paginacion.ts` con `fusionarPorId` para unir páginas sin duplicar.
- **Paginación de mensajes:** `listMessages(id, before?)`. Es un parámetro `?before=` hacia atrás.
- **Plantillas de WhatsApp:**
  - `PlantillasBandeja.tsx`, `lib/chatbot/plantillas-bandeja.ts` y la acción `"plantilla"` con el botón "Enviar plantilla".
  - `listInboxTemplates` lee `message_templates` del inbox y solo si es `Channel::Whatsapp`.
  - `sendAgentMessage` acepta `template_params`.
  - `ventana-de-respuesta.ts` fue modificado (no leí el diff).
- **Qué no cambia:** los intervalos de 15 s y 5 s siguen igual (`InboxClient.tsx:183` y `:190` de la rama). Sigue siendo sondeo.
- **Tests y banco de pruebas:** hay tests, `e2e/inbox-c16b.spec.ts` y una pantalla de pruebas en `app/dev/inbox/`. No los ejecuté.

## 2. Velocidad

**Llamadas por pantalla** (contadas en el código):

| Situación | Llamadas del navegador | Llamadas a Chatwoot por vuelta |
|---|---|---|
| Lista sola, cada 15 s | 1 | N, una por inbox (web y WhatsApp = 2) |
| Con una conversación abierta, cada 5 s | 1 | 3: `getConversation`, `update_last_seen` (POST), `listMessages` |
| Abrir una conversación | detalle + una recarga de la lista | 3 + N |

- Con una conversación abierta y 2 inboxes, el servidor hace unas 3 llamadas a Chatwoot cada 5 s y otras 2 cada 15 s (detalle y lista corren en paralelo).
- Si las vueltas coinciden, son hasta 5 llamadas en una misma ráfaga. Estimado: unas 40 a 45 por minuto por usuario con una conversación abierta.

**Dónde están los cuellos:**
1. **Sondeo constante.** Lo que llega tarda hasta 5 s en el detalle y hasta 15 s en la lista. No hay pausa cuando la pestaña está oculta: no encontré `visibilitychange` en el cliente, ni en master ni en c16b.
2. **El detalle repite el guard de tenencia** (`getConversation`) y escribe `update_last_seen` en cada vuelta. Marcar como leída cada 5 s es una escritura innecesaria.
3. **La lista trae todo.** En master pide `status=all` sin límite propio. El tamaño de página que devuelve Chatwoot no lo verifiqué (estimado: 25 por página en Chatwoot v4, sin fuente). Los mensajes se traen completos en cada vuelta y se reemplazan con `setMensajes(json.mensajes)` (`InboxClient.tsx:112`).
4. **Todo pasa por dos saltos.** Navegador, luego Next, luego Chatwoot, y cada hop va por HTTP con JSON. Latencia y tamaño de respuesta reales: no verificado, no se midió.
5. **Sin caché.** No hay `revalidate`, `unstable_cache` ni SWR en el inbox ni en `lib/chatwoot.ts`.

**Los 5 cambios de mayor impacto en velocidad:**
1. **Cambiar el sondeo por eventos en tiempo real.**
   - Archivos: `app/api/webhooks/chatwoot/route.ts` (ya recibe los eventos de Chatwoot y llama a `notificarMensajeEntrante`) y `InboxClient.tsx:125,134`.
   - Idea: publicar el evento hacia el navegador (SSE o Supabase Realtime) y dejar el sondeo solo como respaldo lento. En el repo ya hay un antecedente: la memoria dice que se eligió "broadcast" porque el realtime "conecta pero no entrega". Eso viene de mi memoria, no del repo, y no lo verifiqué.
2. **Pausar el sondeo con la pestaña oculta y cortar el `update_last_seen` repetido.** Archivos: `InboxClient.tsx:125-135` y `app/api/bandeja/[id]/route.ts` (`markConversationSeen` solo al abrir, no en cada vuelta).
3. **Pedir solo lo nuevo.** En vez de reemplazar todos los mensajes, traer los posteriores al último id. Archivos: `lib/chatwoot.ts:634` y `InboxClient.tsx:112`. La rama c16b ya trae `before=` hacia atrás, pero no hacia adelante.
4. **Caché breve del guard de tenencia.** Guardar durante unos segundos qué org es dueña de cada conversación para no llamar a `getConversation` en cada vuelta. Archivo: `app/api/bandeja/[id]/route.ts` (`conversacionDeLaOrg`).
5. **Fusionar la paginación de c16b a master** (`listConversations(page)` + `hayMas` + `fusionarPorId`). Acota el tamaño de la lista. Después, que el sondeo traiga solo la página 1 y no la historia completa.

## 3. PWA

**Lo que ya existe en master:**
- `public/manifest.json`: `name`, `short_name`, `display: standalone`, `start_url: /dashboard`, `theme_color #013925`, íconos de 32, 48, 192 y 512 px.
- `app/layout.tsx:96-106`: enlaza el manifiesto, define `icons`, y tiene `appleWebApp` con las metas de iOS.
- `components/layout/ServiceWorkerRegistrar.tsx` registra `/sw.js`, y está montado en `app/layout.tsx:163`.
- `public/sw.js` es solo para push: tiene los eventos `push`, `notificationclick`, `install` y `activate`. No tiene `fetch` ni caché.
- `next.config.ts:135` sirve `/sw.js` con `max-age=0, must-revalidate`.
- Push ya implementado:
  - `hooks/usePushNotifications.ts`
  - `app/api/push/subscribe/route.ts`
  - `lib/push.ts`
  - `lib/chatbot/push-te-escribieron.ts`, llamado desde el webhook de Chatwoot
  - la campana en `NotificationBell.tsx`
  - `badge-96.png`

**Qué falta:**

| Objetivo | Falta |
|---|---|
| Instalar en el celular y en la PC | No encontré lo que falta; con lo que hay debería poder instalarse. Falta verificar en un dispositivo real, y que `start_url` apunte a `/inbox` si ese es el uso principal. |
| "Descargar local" / funcionar sin red | `sw.js` no tiene `fetch` ni caché, así que sin conexión la app no abre. Hace falta caché de la carga inicial (el "app shell"). |
| Íconos | Faltan capturas de pantalla en el manifiesto (`screenshots`), y los íconos de 192 y 512 px declaran `"any maskable"` juntos. Conviene separar `maskable`. No verifiqué cómo se ven. |
| Push | Código listo, pero depende de `NEXT_PUBLIC_VAPID_PUBLIC_KEY` en el build. Si no está, el hook solo registra un error en consola (`usePushNotifications.ts:45-48`). Si está configurada en producción: no verificado. |
| iOS | El push en iOS exige que la app esté instalada en la pantalla de inicio. No se probó. |

## Sobre Chatwoot y la propia interfaz

Lo que decís (Chatwoot es open source y se puede cambiar) lo dejo como **no verificado**: no abrí la licencia de Chatwoot ni su repositorio.

Lo que sí está en el código es que **la interfaz de Onia ya es propia**. `/inbox` usa Chatwoot solo como backend de datos por API, y el dueño nunca ve su interfaz (`page.tsx`: "Chatwoot no existe para él"). No hace falta modificar Chatwoot para tener interfaz propia ni para la app móvil. Esa decisión ya está tomada en el código.

Lo que falta para una app móvil es completar la PWA (tabla de arriba). Una app nativa en las tiendas es otra opción, pero no la analicé.

Archivos relevantes, todos en `C:/dev/proyectos/onia-platform`: `app/(dashboard)/inbox/InboxClient.tsx`, `app/api/bandeja/route.ts`, `app/api/bandeja/[id]/route.ts`, `lib/chatwoot.ts`, `public/manifest.json`, `public/sw.js`, `app/layout.tsx`, `next.config.ts`.

=== MOVIL ===
Respuesta para Sergio Urcullo. No edité, instalé ni inicié sesión en nada. Los datos salen de búsquedas web; no abrí las páginas oficiales de Apple ni de Google, así que hay que confirmar precios y reglas allí antes de pagar.

## Resumen
- **Recomendación:** primero una PWA instalable, después Capacitor, y recién entonces las tiendas.
- **Chatwoot:** ya tiene apps oficiales de iOS y Android que se conectan a un servidor propio. Para el uso personal eso evita construir una app desde cero.
- **Competencia:** no encontré app móvil propia en Lety ni en Dapta. Kommo sí tiene.

## 1. PWA instalable
| Punto | Dato | Fuente |
|---|---|---|
| Push en iOS | Funciona desde iOS 16.4, pero solo si la PWA está agregada a la pantalla de inicio; Safari normal no puede pedir el permiso | [WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados) |
| Permiso | Solo se puede pedir tras un toque del usuario | [WebKit](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados) |
| Iconos de badge | Soportados vía Web Push API | [9to5Mac](https://9to5mac.com/2023/02/16/iphone-web-app-new-features-ios-16-4/) |
| Instalación en iOS | No hay API de instalación ni banner. El usuario debe usar "Agregar a inicio" a mano | [steele.blue (iOS 17)](https://www.steele.blue/web-push-ios17) |

- Los datos de iOS son de 2023 y de un blog posterior. Cambios más recientes de Apple: no verificado.
- En Android no verifiqué las limitaciones: no verificado.

## 2. Capacitor o Expo/React Native
- **Push con Capacitor:** el plugin oficial solo da el token de APNs. Para tokens de FCM hay que sumar un plugin de la comunidad o el de Capawesome. Fuente: [Capawesome](https://capawesome.io/docs/sdks/capacitor/firebase/cloud-messaging/).
- **APNs en iOS:** hace falta una clave `.p8` de la cuenta de Apple, subida a Firebase con el Key ID y el Team ID. Fuente: [skills.cat, guía de terceros](https://skills.cat/skills/cap-go/capgo-skills/capacitor-push-notifications).
- **Conflicto de paquetes:** una guía advierte que el plugin push base choca con `@capacitor-firebase/messaging`. Hay que elegir uno.
- **Esfuerzo en horas o días:** no verificado. Es mi estimación, no un dato.
- **Expo/React Native:** no lo investigué con fuentes: no verificado. Sí existe un camino ya hecho: la app oficial de Chatwoot está en React Native con licencia MIT ([GitHub](https://github.com/chatwoot/chatwoot-mobile-app)).

## 3. Costos y revisión de Apple
| Concepto | Costo | Fuente |
|---|---|---|
| Apple Developer | USD 99/año, renovación automática | [Magora](https://magora-systems.com/apple-developer-fee/) |
| Google Play | USD 25, pago único por cuenta | [PrimeTestLab](https://primetestlab.com/blog/google-play-developer-fee) |

- Ambos precios los confirman varios blogs, no Apple ni Google. Hay que verificarlos en sus páginas.
- **Cuenta personal de Google Play creada después de nov-2023:** exige un periodo de pruebas antes de pasar a producción. Fuente: [PrimeTestLab](https://primetestlab.com/blog/google-play-developer-fee).
- **Guideline 4.2 (funcionalidad mínima):** Apple rechaza apps que son una capa fina sobre la web, "no suficientemente diferentes" de navegar. Fuente: [ptkd.com](https://ptkd.com/journal/fix-app-store-guideline-4-2-minimum-functionality).
- **Push más geolocalización más compartir no alcanzan** según un rechazo citado. Fuente: [ptkd.com](https://ptkd.com/journal/fix-app-store-guideline-4-2-minimum-functionality).
- **Cómo pasarla (consejos de blogs, no oficiales):**
  - Dar valor nativo real que el navegador no da.
  - Que la app no se vea como un navegador en modo avión.
  - Navegación nativa del flujo principal.
  - Si la rechazan, responder en el Resolution Center o apelar.
  - Fuentes: [MobiLoud](https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper), [ptkd.com](https://ptkd.com/journal/fix-app-store-guideline-4-2-minimum-functionality).
- El texto oficial de Apple no lo leí: no verificado.

## 4. Qué hacen los demás
| Producto | App móvil | Fuente |
|---|---|---|
| Chatwoot | Sí, oficial en iOS y Android. Funciona contra servidor propio ingresando su URL. Soporta push | [Chatwoot iOS](https://www.chatwoot.com/docs/product/mobile-app/ios), [Chatwoot Android](https://www.chatwoot.com/docs/product/mobile-app/android), [repo](https://github.com/chatwoot/chatwoot-mobile-app) |
| Kommo | Sí, iOS y Android, con push | [Kommo](https://support.kommo.com/docs/install-app) |
| Lety | No encontré evidencia de app propia; es una plataforma web que despliega agentes en WhatsApp, Instagram y otros canales | [G2 y Product Hunt, vía búsqueda](https://www.producthunt.com/p/lety-ai) |
| Dapta | No encontré app propia; es una plataforma web | [navtools](https://navtools.ai/tool/dapta-ai) |

- Que Lety y Dapta no tengan app es "no encontrado", no "confirmado que no existe". Hay que mirar su sitio oficial y las tiendas.
- El compromiso del chatbot: los clientes finales lo usan por WhatsApp. La app solo la necesita quien atiende.

## Sobre cambiar la interfaz de Chatwoot
- La edición comunitaria es MIT, y la carpeta `/enterprise` está bajo licencia propietaria. Fuente: [Chatwoot docs](https://developers.chatwoot.com/self-hosted/enterprise-edition).
- El white-label figura como función Enterprise, con planes desde USD 19 por agente al mes. Fuentes: [docs](https://www.chatwoot.com/docs/product/others/enterprise-edition/), [precios, vía agregador](https://apis.io/plans/chatwoot-com/chatwoot-com-plans-pricing/).
- Para uso personal, cambiar la interfaz parece posible por ser MIT. No lo confirmé en la letra de la licencia ni en el FAQ de auto-hospedaje: no verificado.
- Si luego lo revenden a clientes, hay que leer esa restricción antes.
- La velocidad de Chatwoot auto-hospedado: no medida, no verificado.

## Tabla: vía, esfuerzo, costo, riesgo
Los esfuerzos son estimaciones mías, no datos de fuente.

| Vía | Esfuerzo | Costo | Riesgo |
|---|---|---|---|
| App oficial de Chatwoot, apuntada a su servidor | Mínimo | Gratis | Bajo. Depende de que el servidor ande |
| PWA propia | Bajo | Gratis | Medio. iOS exige instalación manual y push solo desde la pantalla de inicio |
| Capacitor envolviendo la web | Medio | USD 99/año Apple, USD 25 Google | Medio-alto. El rechazo 4.2 de Apple y la configuración de push |
| Expo/React Native propio, o fork de la app de Chatwoot | Alto | Igual que la anterior | Medio. Mantenimiento propio |

## Recomendación en orden
1. **Ahora:** usar la app oficial de Chatwoot contra tu servidor. Resuelve el "desde todos lados" sin construir nada.
2. **Después:** una PWA de la interfaz propia, con push, para probar sin pagar tiendas.
3. **Luego:** Capacitor, solo si la PWA se queda corta. Hay que sumar funciones nativas reales para pasar la revisión 4.2 y pagar USD 99/año más USD 25.

Antes de decidir faltan por verificar: la licencia exacta de Chatwoot para modificar la interfaz, los precios en las páginas de Apple y Google, y la existencia de apps de Lety y Dapta en las tiendas.
