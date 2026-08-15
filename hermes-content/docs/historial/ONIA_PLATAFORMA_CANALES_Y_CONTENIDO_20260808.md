# ONIA: plataforma unica de canales y contenido

**Fecha:** 2026-08-09 (encargo del 2026-08-08)
**Objetivo del documento:** decidir COMO llegamos a una sola plataforma donde (1) se crean y manejan los chatbots de todos los clientes, (2) se publica contenido en las redes propias y de las influencers IA, y (3) el cliente se auto-conecta sin que Onia toque nada.
**Metodo:** inventario medido en el VPS y en los repos (2026-08-09) + investigacion de mercado con fuente y fecha. Lo que no esta publicado se dice, no se estima.

> **Regla de la casa aplicada:** ningun gasto externo se contrata sin OK explicito de Sergio. Todo costo de este documento esta **reportado**, no contratado. La lista completa de aprobaciones esta en la seccion 7.

---

## Resumen en una pagina

1. **Las tres opciones comparten el mismo cuello de botella y es gratis:** el **App Review de Meta** para acceso avanzado a `whatsapp_business_management` y `whatsapp_business_messaging`. Sin eso no hay self-service en ninguna opcion, salvo alquilarle el estatus a un tercero por EUR 250/mes. **Se presenta esta semana y no cuesta un peso.**
2. **Descubrimiento que cambia el calendario:** Chatwoot self-hosted, que ya corre en el VPS, **soporta Embedded Signup de WhatsApp de forma nativa** con 3 variables de entorno. El flujo de "el cliente conecta su numero solo" no hay que construirlo para tenerlo la semana que viene. Fuente: [Chatwoot Developer Docs, WhatsApp Embedded Signup](https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup) (consultado 2026-08-09).
3. **Segundo descubrimiento:** con solo App Review aprobado (sin Access Verification) ya se pueden onboardear **10 clientes nuevos cada 7 dias**. Access Verification sube el tope a 200. O sea: el tramite largo no bloquea a los primeros 10 clientes. Fuente: [Meta, Embedded Signup Overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/).
4. **Publicacion en redes: se compra, no se construye.** USD 24/mes cubre Onia + Mara + Lucia. Construirlo propio cuesta 2 a 4 meses de calendario por los reviews de plataforma y ahorra USD 24/mes. No cierra.
5. **Lo mas urgente del documento no es una opcion, es una fecha:** el token de Instagram vence el **2026-08-17**, dentro de 8 dias. Si vence, se pierde la unica via de publicacion que existe hoy.

---

## 1. Como lo hacemos HOY

### 1.1 Inventario real (medido 2026-08-09)

| Capacidad | Herramienta hoy | Auto o manual | Cuello de botella real |
|---|---|---|---|
| **Crear chatbot para un cliente** | `config.mjs` hardcodeado del bot vivo, o alta por superadmin en `/admin/organizations/[id]` del producto | **Manual** | El bot vivo **no tiene dimension de tenant**: cliente nuevo = editar un `.mjs` y correr otra instancia. La ruta multi-tenant del producto si existe y esta bien hecha, pero **esta muerta en produccion** |
| **Conectar WhatsApp** | El cliente arma todo en la consola de Meta y le pasa credenciales a Onia | **Manual, 8 pasos del lado del cliente** | Falta el **App Review** que habilita Embedded Signup |
| **Conectar IG / Messenger / TikTok** | No existe | **No existe** | Cero codigo de canal fuera de WhatsApp |
| **Atender mensajes (bandeja)** | **Chatwoot en el VPS, funcionando** | Auto (bot) + manual (agente) | Una sola cuenta de Onia, **un solo agente**. El cliente no entra |
| **Guardar historial** | Chatwoot DB + `onia_center.bot_conversations` | Auto | **El producto (`onia-platform`) no guarda ni un mensaje en su propio schema.** El historial no vive donde se vende |
| **Publicar contenido** | `ig_publisher.py` / `social_publisher.py` corridos a mano | **Manual 100%** | Nada los dispara. Cero cron, cero workflow. Solo `@oniahq` conectada |
| **Producir video** | video-factory + HyperFrames/Remotion + Higgsfield + ElevenLabs | Semi-auto | Produccion parada desde junio (4 jobs en `.hermes/video-lab/jobs/`) |
| **Manejar cuentas y numeros** | `ClinicSettings` en Prisma | **Manual, superadmin** | Tokens de Meta **en texto plano** en la DB |

### 1.2 Seis correcciones al estado que teniamos escrito

| Lo que creiamos | Lo verificado el 2026-08-09 |
|---|---|
| Chatwoot con **0 inboxes** | **3 inboxes** en la cuenta `OnIA Agency`: `ONIA Demo` (Api), `Onia Web` (WebWidget) y **`Onia WhatsApp` (Channel::Whatsapp, provider `whatsapp_cloud`, +59175414930)**. 10 conversaciones, 16 mensajes |
| El chatbot vivo esta en el producto | Esta **fuera** del producto: es un Node suelto en `/tmp/onia-bot/webhook-server.mjs` **dentro del contenedor `onia-center`** |
| El envio por WhatsApp "existe" en el producto | Existe el **codigo**. En produccion las 4 vars `WHATSAPP_*` y las 4 `CHATWOOT_*` estan en `SIN_CONFIGURAR` y el webhook devuelve **503** antes de leer nada. La ruta esta **muerta**, no incompleta |
| No se guarda ni un mensaje | Cierto **para el schema de `onia-platform`**. El bot vivo si persiste: Chatwoot guarda los 16 mensajes y `persistence.mjs` escribe en `onia_center.bot_conversations`, `leads` y `review_queue` |
| No hay bandeja | **Chatwoot ES la bandeja y funciona.** La limitacion real es que es **una sola cuenta de Onia** |
| Instagram bloqueado por falta de token (S6) | **El token existe y es valido**, con scope `instagram_content_publish`, cuenta `@oniahq`. **Vence el 2026-08-17 19:24 UTC** |

### 1.3 El numero honesto

> **Poner un chatbot nuevo en manos de un cliente hoy: 13 a 16 pasos manuales. Y aun asi no funciona.**
> **Self-service del cliente hoy: 0 de 16.**

Desglose de la ruta disenada (`docs/WHATSAPP_ONBOARDING_CHECKLIST.md` + codigo):

- **8 pasos los hace el CLIENTE dentro de la consola de Meta:** crear Business Manager, crear la App, verificar un numero que no puede ser su WhatsApp personal, crear System User, generar token permanente, copiar Phone Number ID, registrar Callback URL, suscribirse a `messages`.
- **3 pasos el SUPERADMIN de Onia:** pegar Phone Number ID, pegar token, activar add-on.
- **2 a 5 pasos sueltos:** crear o vincular el inbox de Chatwoot (no se auto-crea si la organizacion ya existia), registrar el webhook, aprobar la plantilla en Meta.
- **1 paso absurdo:** el cliente tiene que **escribirle a soporte** para que le pasen el Verify Token, porque no se muestra en ninguna UI.

Y el conteo real es infinito, porque antes del primer cliente hay que encender cosas apagadas:

1. Setear 5 variables en produccion (`WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `CHATWOOT_API_TOKEN`, `CHATWOOT_ACCOUNT_ID`, `CHATWOOT_WEBHOOK_SECRET`). El propio doc interno las lista como pendientes y siguen en `SIN_CONFIGURAR` 2,5 meses despues.
2. Activar en n8n `WF-10 WhatsApp Addon Onboarding`, `WF-11 Patient Sync Chatwoot` y `WF-13 WhatsApp Quota Alert`. Verificado con `n8n list:workflow --active=true`: **los tres estan inactivos**. El boton "Activar add-on" dispara un webhook que no responde nada.
3. Definir `DEMO_SLOTS` en `config.mjs`. Hoy tiene `pending: true` y el motor devuelve `slots_sin_definir`: **el bot vivo no puede cerrar un agendamiento**.

Esto es exactamente el patron que el CLAUDE.md llama `PLATFORM_LAYER` vacio: semanas de trabajo construido y apagado. **No hay que construir el multi-tenant de WhatsApp. Hay que encenderlo.**

### 1.4 Fragilidades que ya se estan cobrando

- **El bot de produccion vive en `/tmp`.** Se arranca con `docker exec -d`, no cuelga de ningun supervisor. Si el contenedor reinicia, Chatwoot sigue mandando webhooks a un puerto muerto y el bot deja de contestarle a prospectos reales **en silencio**. Lo sostiene un cron cada 2 minutos. **Ya se disparo dos veces el 2026-08-06** (`/var/log/onia-bot-watchdog.log`).
- **El codigo desplegado esta adelantado al repo.** `config.mjs` desplegado pesa 25.722 bytes contra 12.552 en el worktree; `audio-transcribe.mjs` existe en produccion y no esta en la rama. El deploy es copia de archivos, no build desde git.
- **Riesgo de cruce entre clientes.** `getWhatsAppConfig()` cae a `process.env.WHATSAPP_ACCESS_TOKEN` global si al cliente le falta el token: el mensaje del cliente B saldria por el numero de Onia. Se cierra antes del segundo cliente, no despues.
- **Token de WhatsApp en texto plano** en `ClinicSettings.whatsappAccessToken`, cuando el modelo hermano `GatewayConfig` ya cifra con `lib/encryption.ts` (AES-256-GCM). La herramienta existe, no se aplico.
- **El VPS ya esta en swap:** 5,0 GB de 8 usados con `vm.swappiness=10`. 43 contenedores, dos stacks Supabase completos corriendo a la vez.

### 1.5 El reloj

| Fecha | Que pasa | Fuente |
|---|---|---|
| **2026-08-17** (8 dias) | Vence `META_LONG_LIVED_TOKEN`. Muere la unica via de publicacion en IG | `GET graph.facebook.com/v21.0/debug_token`, `expires_at: 1786994695`, consultado 2026-08-09 |
| **2026-09-16** | Vence el data access del mismo token | mismo, `data_access_expires_at: 1789586694` |
| **2026-10-01** | Meta empezaria a cobrar los mensajes de servicio dentro de la ventana de 24h | **Ver advertencia abajo** |
| **2026-10-15** | **Embedded Signup v2 queda deprecado.** Hay que implementar directo en **v4** | [Meta, Embedded Signup Overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/) |

> **Advertencia sobre el 1-oct-2026.** Lo anuncian multiples BSPs de forma consistente ([hello charles](https://www.hello-charles.com/blog/whatsapp-service-message-pricing-what-changes-in-2026), [AiChat](https://www.aichat.com/blog/whatsapp-business-pricing-changes-2026), [ChakraHQ](https://chakrahq.com/article/whatsapp-api-pricing-update-service-messages-october-2026/)). **La pagina oficial de precios de Meta, consultada el 2026-08-09, NO lo menciona**: sigue diciendo "Effective November 1, 2024 - Service conversations are now free for all businesses" ([developers.facebook.com/docs/whatsapp/pricing](https://developers.facebook.com/docs/whatsapp/pricing)). Tratarlo como **muy probable pero no confirmado por fuente primaria**, y no construir el pricing al cliente sobre una cifra que Meta todavia no publico.

---

## 2. Las tres opciones

### Lo que las tres comparten (y no se puede saltear)

**El App Review de Meta para acceso avanzado a `whatsapp_business_management` + `whatsapp_business_messaging`** (mas `business_management` para el flujo de Embedded Signup). Sin eso no hay self-service de WhatsApp en ninguna opcion.

- Onia **ya tiene la verificacion de negocio aprobada**, que es el prerrequisito.
- Lo que falta del App Review son **dos videos**: uno mostrando el envio de un mensaje y otro la creacion de una plantilla. Meta acepta explicitamente **un screen recording del script cURL de API Setup** o el uso de WhatsApp Manager, no hace falta una app terminada. Fuente: [Meta, Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers).
- **Costo: cero.** Tiempo: Meta promedia dias, no meses, para permisos de este tipo, pero no publica SLA.
- **Con App Review aprobado ya se onboardean 10 clientes nuevos cada 7 dias.** Access Verification (el tramite largo) solo sube el tope a 200. Fuente: [Meta, Embedded Signup Overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/).

**Conclusion operativa: el App Review se presenta esta semana pase lo que pase, y con la evidencia que ya existe.** No es parte de una opcion: es el piso de las tres.

---

### OPCION A - LA RAPIDA: encender lo que ya esta puesto

**Que es.** Chatwoot self-hosted (ya corriendo) como bandeja y como puerta de entrada de canales, con **Embedded Signup nativo de WhatsApp**, el bot actual conectado por webhook, n8n como pegamento, y **Upload-Post** para la publicacion en redes. Cero software nuevo escrito.

**El hallazgo que la hace viable.** Chatwoot self-hosted soporta Embedded Signup con tres variables de entorno seteadas por el super admin en `/super_admin/app_config?config=whatsapp_embedded`: `WHATSAPP_APP_ID`, `WHATSAPP_CONFIGURATION_ID`, `WHATSAPP_APP_SECRET`, mas la app de Meta con `whatsapp_business_management`, `whatsapp_business_messaging` y `business_management`. Fuente: [Chatwoot Developer Docs](https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup) (2026-08-09). **El flujo de auto-conexion no hay que construirlo.**

**Que resuelve.**
- Bandeja multiagente funcionando, con cuentas aisladas por `account_id` (una cuenta de Chatwoot por cliente).
- **Self-service real de WhatsApp** apenas pase el App Review.
- Historial de conversaciones guardado (en Chatwoot).
- Publicacion en las 3 cuentas propias desde n8n: Upload-Post tiene **nodo oficial de n8n**, y su app de Meta y su auditoria de TikTok ya estan aprobadas, asi que **destraba el pendiente S6 sin pelearse con la Graph API**.
- Resuelve la fecha del 17 de agosto sin depender de refrescar el token a mano.

**Que NO resuelve.**
- **El cliente vive en Chatwoot, no en Onia Platform.** Se ve la marca de Chatwoot; el white-label esta en Premium Support, **USD 19/agente/mes** ([Chatwoot self-hosted plans](https://www.chatwoot.com/pricing/self-hosted-plans)).
- **El historial no queda en el producto que vendemos.** Ese es el activo que hace que el agente mejore por rubro. Se mitiga espejando a `onia-platform` (ver seccion 4).
- Sin facturacion por cliente, sin entitlements, sin cupos: eso vive en Onia Platform, no en Chatwoot.
- No resuelve IG DM ni Messenger para clientes (necesitan sus propios App Review), ni TikTok DM (no hay API abierta, seccion 5).
- No arregla que el bot vivo sea **mono-tenant**: su `config.mjs` es el guion de Onia calificando clinicas dentales, no un motor por rubro.

**Costo mensual real.**

| Concepto | USD/mes | Bs (a 11,37) |
|---|---|---|
| Chatwoot CE self-hosted | 0 | 0 |
| n8n self-hosted | 0 | 0 |
| App Review Meta | 0 | 0 |
| **Upload-Post Basic (5 perfiles)** | **24** (16 en anual, -40%) | **273** (182) |
| **Total** | **24** | **273** |

Opcional si se quiere borrar la marca Chatwoot de la cara del cliente: +USD 19/agente/mes.

**Tiempo hasta tenerlo andando.** 3 a 5 dias de trabajo, mas la espera del App Review. Sin el App Review, A igual sirve internamente y para clientes onboardeados a mano.

**De que dependemos.** Del App Review de Meta (unica dependencia externa dura), de que Upload-Post mantenga sus aprobaciones, y de resolver el bug 402 de Chatwoot CE si aparece. **Evidencia a favor: la instancia ya tiene 3 inboxes creados**, asi que el [issue #13422](https://github.com/chatwoot/chatwoot/issues/13422) no esta mordiendo hoy.

---

### OPCION B - LA INTERMEDIA: bandeja propia dentro de Onia Platform

**Que es.** Guardar los mensajes en el schema de Onia Platform, construir la bandeja adentro del producto, implementar Embedded Signup v4 propio en la UI de Onia, y hacer el motor del bot configurable por rubro. La publicacion en redes se sigue resolviendo con Upload-Post.

**Que resuelve.**
- **Es el producto.** El cliente entra a Onia, ve su bandeja, contesta, y el historial es nuestro.
- Multi-tenant de verdad, con los entitlements, cupos y facturacion que ya existen (`lib/platform/`, 4.415 lineas con tests).
- Self-service de WhatsApp con la marca de Onia, sin Chatwoot en el medio.
- Motor de respuestas por rubro en vez del guion dental hardcodeado.

**Que NO resuelve.**
- Multi-canal: sigue siendo solo WhatsApp. IG DM, Messenger y TikTok quedan afuera.
- No resuelve la publicacion (se compra), ni el equipo de soporte que una bandeja 24/7 exige.

**Costo mensual real.** USD 24/mes de Upload-Post. El costo verdadero es **calendario**, no plata.

**Tiempo hasta tenerlo andando.** **35 dias-persona, unas 7 semanas.** Desglose:

| Pieza | Dias | Nota |
|---|---|---|
| Modelos `Conversation`/`Message` + migracion + escritura en entrante y saliente + media | 5 a 6 | |
| Bandeja (lista, hilo, composer, asignacion, indicador de ventana 24h, plantillas, notas) | 10 a 14 | Realtime **ya esta en produccion**: alcanza con una publicacion y una policy RLS, 0,5 dia |
| Embedded Signup v4 + modelo `ChannelConnection` + refresh + health | 6 a 7 | `lib/encryption.ts` ya existe |
| Motor del bot configurable por rubro + handoff bot/humano | 5 a 7 | Se reusa `whatsapp-ai.ts` y `whatsapp-bot.ts` |
| UI del panel (nav, pagina de canales, gating, wizard) | 4 a 5 | |
| Transversal (routing multi-tenant, rate limits, tests, deploy) | 5 | |

**De que dependemos.** Del mismo App Review, de que nadie desvie el carril durante 7 semanas, y de la migracion obligatoria a **Embedded Signup v4** (v2 muere el 2026-10-15).

**El riesgo que hay que mirar de frente:** 7 semanas contra un runway estimado de ~11. B consume dos tercios del runway y aterriza justo sobre el 1-oct-2026.

---

### OPCION C - LA COMPLETA: plataforma propia multicanal y multi-tenant

**Que es.** B mas: canales de Instagram DM y Messenger, programador de publicaciones propio dentro del producto (modelo `Post` con estado por destino, adapters IG/FB/TikTok, reintentos, preview), TikTok en lo que TikTok permita, y self-service para todos los canales.

**Que resuelve.** Todo el encargo, en una sola plataforma con nuestra marca y nuestro dato.

**Que NO resuelve.**
- **TikTok DM sigue sin resolverse**, porque no hay API abierta para nadie (seccion 5). Ninguna cantidad de codigo lo destraba.
- No resuelve la operacion: mas canales = mas superficie de soporte 24/7 con el equipo actual.

**Costo mensual real.** USD 0 de licencias, pero **55 a 70 dias-persona, 11 a 14 semanas en un solo carril**. Es el runway entero.

**Tiempo hasta tenerlo andando.** 3 meses largos, mas los tramites que corren en serie con feedback: App Review de Meta por permiso (1 a 3 semanas por envio, contar un rechazo), auditoria de TikTok (2 a 4 semanas, varias rondas), auditoria de cuota de YouTube (semanas a meses).

**De que dependemos.** De aprobaciones que no controlamos, de mantenimiento perpetuo de versiones (la Graph API esta hardcodeada en `v21.0` en `lib/whatsapp.ts:3`, y v19.0 muere el 21-may-2026, v20.0 el 24-sep-2026), y de que el runway aguante 3 meses sin ingresos nuevos.

**Veredicto sobre C:** no es una opcion para 2026. Es el destino de B, por partes, financiado por clientes.

---

## 3. Comparacion cara a cara

| | **A - Rapida** | **B - Intermedia** | **C - Completa** |
|---|---|---|---|
| **Costo mensual** | USD 24 (Bs 273) | USD 24 (Bs 273) | USD 24 + 3 meses de calendario |
| **Costo de una vez** | 3 a 5 dias | 35 dias-persona (7 sem) | 55 a 70 dias-persona (11 a 14 sem) |
| **Tiempo a primer cliente** | **Esta semana** (a mano) / dias tras App Review (self-service) | 7 semanas | 3 meses y medio |
| **Control** | Bajo: el cliente vive en Chatwoot, historial fuera del producto | **Alto**: producto propio, dato propio, marca propia | Total |
| **Riesgo principal** | Se ve la marca ajena; el dato no es nuestro; bug 402 de Chatwoot CE | Consume 7 de ~11 semanas de runway | **Consume el runway entero y llega tarde** |
| **Con 10 clientes** | Aguanta. 10 cuentas Chatwoot, tope Meta de 10 nuevos cada 7 dias = justo. RAM: el VPS ya esta en swap, hay que ordenarlo | Aguanta comodo. El almacenamiento no es problema: **529 bytes por mensaje medidos**, 50 clientes = 3,8 GB/ano contra 91 GB libres | Aguanta, pero para cuando este listo la pregunta ya no es esta |
| **Trabajo tirado si migramos** | **~2 dias** (solo la config de Chatwoot) | 0, es la base de C | n/a |
| **Self-service WhatsApp** | Si, nativo de Chatwoot | Si, propio | Si, propio |
| **Self-service IG / Messenger** | No | No | Si |
| **TikTok DM** | No (nadie puede) | No | No (nadie puede) |
| **Publicacion redes** | Si, Upload-Post | Si, Upload-Post | Si, propio |

**Nota sobre escalar, medida no estimada.** Cree una tabla temporal en el Postgres de produccion con el esquema realista y 100.000 filas: **529 bytes por mensaje** entre heap e indices. Un millon de mensajes son 529 MB. Con 91 GB libres, **el texto de las conversaciones no es problema en anos**. El problema real es otro y en este orden: (1) la RAM, que ya swapeo 5 GB; (2) el **media**, mil veces mas pesado y con reloj, porque **la URL de descarga de Meta expira a los 5 minutos** ([Media Download API](https://developers.facebook.com/documentation/business-messaging/whatsapp/reference/media/media-download-api)) y 2.000 fotos de 300 KB por cliente son 600 MB al mes; (3) Realtime, con techo de ~3.000 msg/s bajo RLS, muy lejos.

---

## 4. La recomendacion

> **A ahora, B en paralelo, C nunca como proyecto (solo como acumulacion de B).**
> Concretamente: **presentar el App Review esta semana, encender Chatwoot con Embedded Signup y contratar Upload-Post Basic (USD 24/mes), y arrancar el carril de la bandeja propia en Onia Platform el mismo dia.**

**Por que, en cinco lineas:**

1. Las tres opciones dependen del mismo tramite gratuito, asi que el App Review se presenta ya y no es una decision, es una obligacion.
2. A no es "construir rapido", es **encender lo que ya esta construido y apagado**, que es exactamente lo que el CLAUDE.md manda hacer antes de abrir un frente nuevo.
3. A cuesta USD 24/mes y 3 a 5 dias; C cuesta el runway entero y llega despues del 1-oct-2026.
4. Lo unico que se tira al migrar de A a B son ~2 dias de configuracion de Chatwoot: es la insurance mas barata del documento.
5. Lo que hace defendible a Onia no es el transporte HTTP hacia Meta, es el agente por rubro y el historial. Eso se construye en B, no se compra, y por eso B arranca ya y no despues de A.

### Camino de migracion sin trabajo tirado

Lo que se hace en A y **se reusa entero** en B y C:

| Pieza | Se reusa en B/C | Por que |
|---|---|---|
| **App Review de Meta** | Si, entero | Es de la app de Onia, no de Chatwoot |
| **Tablas `Conversation`/`Message` en `onia-platform`** | Si, es la base | **Se construyen en A, no en B** (ver abajo) |
| **Upload-Post** | Si | Sigue siendo la respuesta hasta ~100 perfiles |
| **n8n como scheduler** | Si | `vercel.json` define 3 crons pero el producto corre en el VPS, no en Vercel: n8n es el unico scheduler real |
| **Realtime de Supabase** | Si, ya esta en prod | Una publicacion y una policy RLS, 0,5 dia |
| **Cola de aprobacion y despacho** | Si | `lib/onia-core/dispatch/`, 1.327 lineas con 694 de tests, idempotencia por indice unico. Publicar en redes es **un `actionType` nuevo y un adapter**, 1 a 2 dias, no 10 |
| Config de Chatwoot | **No, ~2 dias tirados** | Costo aceptado |

**La bisagra que evita el trabajo tirado:** las tablas de conversaciones se construyen **en la semana 1, dentro de A**, y el webhook escribe ahi aunque la bandeja todavia sea Chatwoot. Son 3 dias. **Cada dia sin esto es dato quemado**: el historial que no se guarda hoy se perdio para siempre, y el historial es el activo.

### Orden concreto de las proximas dos semanas

**Esta semana (~5 dias, y destraba todo lo demas):**
1. **Presentar el App Review** con los dos screencasts (sirve el cURL de API Setup, no hace falta app terminada). Costo cero, es la ruta critica.
2. **Refrescar o migrar el token de Instagram antes del 17-ago.** Es lo mas urgente del documento y son minutos.
3. **Guardar mensajes YA** en `onia-platform` (3 dias), aunque la bandeja siga siendo Chatwoot.
4. Cifrar `whatsappAccessToken` con `lib/encryption.ts` (0,5 dia) y **matar el fallback a `process.env` global** en `getWhatsAppConfig`, que hoy puede sacar el mensaje de un cliente por el numero de Onia (0,5 dia).
5. Sacar el bot de `/tmp`: darle un contenedor propio o al menos un `restart` de docker en vez de un cron de rescate. Y definir `DEMO_SLOTS`, porque **hoy el bot no puede cerrar un agendamiento**.
6. Decidir Chatwoot: se usa de verdad o se apaga. Dejarlo prendido "por si acaso" en un servidor que ya esta en swap es lo peor de las dos opciones. **La recomendacion de este documento es usarlo.**

**Semanas 2 a 8:** carril B (bandeja propia + Embedded Signup v4 + motor por rubro), con los clientes de A ya operando.

---

## 5. Lo que TikTok deja hacer de verdad

Separado del marketing de las plataformas, que vende "TikTok DM automatico" como si fuera abierto.

### 5.1 Mensajeria (DM): cerrado

- **Existe** una *Business Messaging API* dentro de TikTok API for Business v1.3, pero **no es de acceso abierto**. Se accede via "Messaging Partners" aprobados por TikTok. El API general de desarrollador (Content Posting / Display) **no expone DMs**. Fuentes: [TikTok Business API](https://business-api.tiktok.com/portal/docs/business-messaging/v1.3), [TikTok For Business, Messaging Partners](https://ads.tiktok.com/help/article/about-message-management-tools), [UnifyPort](https://www.unifyport.ai/blog/tiktok-no-dm-api-receive-messages/).
- **Partners confirmados:** respond.io (badged partner, integracion en **Beta**) y ManyChat.
- **Bloqueos regionales de ManyChat:** no se puede conectar TikTok desde UK ni EU, con reportes de usuarios tambien en USA. Comment-to-DM solo en Vietnam, Tailandia e Indonesia; en el resto el usuario tiene que mandar el keyword por DM. Fuente: [Manychat Help](https://help.manychat.com/hc/en-us/articles/17928990909084-How-to-connect-TikTok-to-Manychat).
- **No pude verificar si Bolivia esta soportada.** Ni TikTok ni ManyChat publican la lista de paises incluidos, solo las exclusiones. Hay que probarlo con una cuenta real antes de prometerselo a un cliente.

> **Conclusion: Onia no puede ofrecer TikTok DM en el corto plazo, con ninguna de las tres opciones.** Si un cliente lo exige, la unica via honesta es revender respond.io y **decir que es respond.io**.

### 5.2 Publicacion: abierto, con auditoria

- La **Content Posting API** es gratuita y accesible, con el scope `video.publish`, pero **exige una auditoria** de 2 a 4 semanas con varias rondas.
- **Sin auditar:** el cliente API queda limitado a **5 usuarios cada 24 horas**, las cuentas deben estar en privado y el contenido sale `SELF_ONLY`.
- **El modo draft (inbox upload) funciona sin auditoria:** deja el video en borradores para que un humano lo publique desde el telefono. **Cubre el 80% del caso de uso de Onia sin tramitar nada.**
- **TikTok prohibe el posteo silencioso.** Las guidelines exigen que el cliente API deje al usuario ingresar o elegir titulo, privacidad, ajustes de interaccion y declaracion de contenido comercial antes de publicar, nada de valores preseteados. **Un boton "publicar en todas" totalmente automatico viola esto**: hace falta una pantalla de confirmacion por post de TikTok. Fuente: [TikTok Content Posting Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines).
- **Dato del toolbox, sin verificar:** el MCP de Higgsfield que Onia ya tiene conectado expone `tiktok_connect`, `tiktok_prepare_publish` y `tiktok_publish`. Si funciona, Onia tendria publicacion en TikTok para sus cuentas propias **sin tramitar la auditoria**. **No lo probe** porque una prueba podria consumir creditos y eso requiere OK de Sergio. Vale 15 minutos verificarlo.

---

## 6. El self-service del cliente, red por red

Que hace falta para que un cliente conecte sus canales solo, sin que Onia toque nada.

### WhatsApp: **alcanzable en dias**

| Requisito | Estado |
|---|---|
| Verificacion de negocio de Meta | **Ya aprobada** |
| App de Meta con caso de uso WhatsApp | Ya existe, app publicada |
| **App Review: acceso avanzado a `whatsapp_business_management` + `whatsapp_business_messaging`** | **Pendiente. Es el unico bloqueo real** |
| `business_management` para el flujo de Embedded Signup | Pendiente, va en el mismo envio |
| Configuration ID de Facebook Login for Business | Se genera despues del review |
| **Access Verification** | **Opcional al principio:** sube el tope de 10 a 200 clientes nuevos por 7 dias |
| Metodo de pago del cliente en su WABA | **Obligatorio.** Un Tech Provider no puede compartir su linea de credito: cada cliente pone su tarjeta |
| Version | **Implementar v4 directo.** v2 muere el 2026-10-15 |

**Camino corto:** las 3 variables de Chatwoot self-hosted (`WHATSAPP_APP_ID`, `WHATSAPP_CONFIGURATION_ID`, `WHATSAPP_APP_SECRET`) dan el flujo completo sin escribir codigo.
**Camino largo:** implementar Embedded Signup v4 en la UI de Onia, 4 a 5 dias, dentro de B.

### Instagram DM: **no antes de resolver WhatsApp**

Requiere `instagram_manage_messages` con Advanced Access, o sea **otro App Review con screencasts**. El cliente autoriza con Instagram Login o Facebook Login. Recomendacion: **no meter estos permisos en el mismo envio que el de WhatsApp**. El review de Tech Provider es la ruta critica contra el 1-oct-2026, y sumarle superficie de rechazo a un tramite que no podemos permitirnos demorar es mal negocio. (Esto es criterio, no politica publicada: Meta revisa por permiso.)

### Messenger: **igual que IG, menor demanda**

`pages_messaging` con Advanced Access; el cliente autoriza su Pagina. Canal de menor demanda en Bolivia: hacerlo solo si un cliente lo pide y lo paga.

### Instagram publicacion (para el cliente): **App Review aparte**

`instagram_content_publish` con Advanced Access, cuenta profesional obligatoria (Business o Creator, nunca personal), solo JPEG, media accesible por URL publica durante la publicacion. Limite: **100 posts cada 24 horas moviles por cuenta**, con reportes de limites efectivos mas bajos segun antiguedad de la cuenta. Fuente: [Meta, Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing).

### TikTok: **DM imposible, publicacion con auditoria**

Ver seccion 5. Para publicacion de cliente: OAuth por creador mas la auditoria; sin auditar, 5 usuarios cada 24 horas y `SELF_ONLY`.

### Atajo transversal

**Upload-Post desde el plan Professional (USD 50/mes, 25 perfiles) incluye white-label**, o sea que el cliente puede vincular sus cuentas contra una pagina con la marca de Onia sin que Onia pase ningun App Review de publicacion. Fuente: [Upload-Post](https://www.upload-post.com/llms-full.txt), consultado 2026-08-09. **No se contrata hasta que haya un cliente que lo pida.**

---

## 7. Decisiones que necesita tomar Sergio

Una linea cada una, con recomendacion. Las marcadas con **[GASTO]** no se contratan sin OK explicito.

| # | Decision | Recomendacion |
|---|---|---|
| 1 | **Presentar el App Review de Meta esta semana** (2 permisos + `business_management`), con screencasts del cURL de API Setup | **Si, hoy.** Costo cero, es la ruta critica de las tres opciones y destraba el self-service |
| 2 | **Refrescar el token de Instagram antes del 2026-08-17** | **Si, es lo mas urgente del documento.** Vence en 8 dias y muere la unica via de publicacion |
| 3 | **[GASTO] Upload-Post Basic: USD 24/mes (Bs 273), o USD 16/mes en anual (-40%)** | **Aprobar.** Cubre Onia + Mara + Lucia + 2 de sobra, tiene nodo oficial de n8n, y evita 2 a 4 meses de reviews propios |
| 4 | **Chatwoot: usarlo de verdad o apagarlo** | **Usarlo** como Opcion A. Son ~650 MB en un servidor que ya esta en swap: dejarlo prendido sin usar es lo peor de las dos opciones |
| 5 | **Arrancar el carril de bandeja propia (B) en paralelo, 7 semanas** | **Si.** Es el producto. Si se posterga "hasta que A funcione", nunca arranca |
| 6 | **Guardar mensajes en `onia-platform` desde ya, aunque la bandeja sea Chatwoot** | **Si, 3 dias.** Cada dia sin esto es historial perdido para siempre |
| 7 | **[GASTO] 360dialog Partner Platform: EUR 250/mes (Starter, 5 canales; extra EUR 49 c/u)** | **NO ahora.** Es el plan B si el App Review se traba y aparece un cliente que no puede esperar. EUR 250/mes fijos con cero clientes contra un runway de ~11 semanas no cierra. Fuente: [docs.360dialog.com](https://docs.360dialog.com/partner/get-started/pricing). Nota: la web comercial dice "desde EUR 49/mes" y la doc tecnica EUR 250: **contradiccion sin resolver, hay que preguntarles** |
| 8 | **[GASTO] Chatwoot Premium Support: USD 19/agente/mes** (white-label, Captain AI) | **NO por ahora.** Solo si un cliente objeta ver la marca Chatwoot antes de que B este listo |
| 9 | **[GASTO] Upload-Post Professional: USD 50/mes** (25 perfiles + white-label) | **NO hasta que haya un cliente que pida publicacion.** Recien ahi, y directo a este plan, no a Ayrshare (USD 299 por lo mismo) |
| 10 | **Postiz self-hosted en vez de Upload-Post** | **NO ahora.** Ahorra el codigo pero **no ahorra los tramites**: con Postiz igual pasas vos el App Review de Meta y la auditoria de TikTok, y suma Temporal.io + Redis + Postgres a un VPS que ya swapea. Ademas es AGPL-3.0: si se le da al cliente, es una decision legal, no tecnica |
| 11 | **Politica de etiquetado IA para Mara y Lucia** | **`is_ai_generated` en true por defecto**, mapeado al campo nativo de cada red. TikTok, YouTube y Meta detectan por C2PA aunque no declares, y **la sancion es por no declarar**, no por ser IA. Ya esta decidido en memoria: "es IA no se esconde" |
| 12 | **Postura del pitch del chatbot** | **"Asistente de ESTE negocio", nunca "IA que responde cualquier cosa".** Los WhatsApp Business Solution Terms (rev. 2026-03-06) prohiben proveedores cuya funcionalidad primaria sea un LLM de proposito general. Es texto de marketing, no arquitectura |
| 13 | **Ordenar el VPS antes de pensar en otro servidor** | **Si.** Apagar el stack Supabase duplicado y revisar `shared_buffers=128MB` compra mas margen que un servidor nuevo, y cuesta cero |
| 14 | **Prometer TikTok DM a clientes** | **No prometerlo.** No hay API abierta para nadie; si un cliente lo exige, revender respond.io y decir que es respond.io |
| 15 | **[GASTO, trivial] Probar los tools de TikTok del MCP de Higgsfield** | **Aprobar la prueba** (15 minutos). Si funciona, hay publicacion en TikTok para las cuentas propias sin auditoria |

### Lo que NO recomiendo, y por que

- **Evolution API / Baileys / WAHA: no, ni para una demo.** Violan los Terminos de Meta por ingenieria inversa del protocolo de WhatsApp Web, sin importar que se mande. El riesgo no es el numero de Onia: es **quemar el numero del cliente que paga**, y eso no se recupera pidiendo disculpas.
- **Dify: descartar.** Su licencia (Apache 2.0 modificada) **prohibe el uso multi-tenant** sin permiso escrito. Sirve para uso interno; usarlo para servir clientes seria violar la licencia. Fuente: [Dify discussion #32254](https://github.com/langgenius/dify/discussions/32254).
- **Pararse sobre ManyChat o respond.io como base del producto.** Son competidoras, no cimientos: Onia venderia el producto de otro con markup y el cliente puede saltearla. respond.io ademas cobra el multi-workspace desde USD 279/mes.
- **Construir el posteador propio.** 2 a 4 meses de calendario por tramites, para ahorrar USD 24/mes.

---

## 8. Fuentes

**Meta / WhatsApp (primarias):**
- [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) - pasos, screencasts aceptados (cURL de API Setup sirve)
- [Embedded Signup Overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/) - permisos, limite 10 por 7 dias (200 tras Access Verification), v2 deprecado el 2026-10-15
- [App Review para Solution Providers](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/app-review)
- [WhatsApp Pricing](https://developers.facebook.com/docs/whatsapp/pricing) - consultado 2026-08-09: **no menciona el cambio de octubre 2026**
- [Media Download API](https://developers.facebook.com/documentation/business-messaging/whatsapp/reference/media/media-download-api) - la URL expira a los 5 minutos
- [Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing) - 100 posts cada 24h, solo cuentas profesionales, JPEG
- [Instagram Messaging API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/)
- [WhatsApp Business Solution Terms](https://www.whatsapp.com/legal/business-solution-terms) (rev. 2026-03-06)

**Cambio de precios de octubre 2026 (secundarias, sin confirmacion primaria):**
- [hello charles](https://www.hello-charles.com/blog/whatsapp-service-message-pricing-what-changes-in-2026) - [AiChat](https://www.aichat.com/blog/whatsapp-business-pricing-changes-2026) - [ChakraHQ](https://chakrahq.com/article/whatsapp-api-pricing-update-service-messages-october-2026/) - [quali-d](https://quali-d.com/blog/whatsapp-api-service-message-pricing-2026)

**Chatwoot:**
- [WhatsApp Embedded Signup en self-hosted](https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup) - las 3 env vars
- [Self-Hosted Plans](https://www.chatwoot.com/pricing/self-hosted-plans) - CE gratis, Premium Support USD 19/agente
- [Issue #13422, 402 al crear inboxes en CE](https://github.com/chatwoot/chatwoot/issues/13422) - abierto feb-2026; **no esta mordiendo en nuestra instancia (3 inboxes creados)**
- [Multi-tenancy](https://deepwiki.com/chatwoot/chatwoot/3.1-account-and-multi-tenancy)

**TikTok:**
- [Business Messaging API v1.3](https://business-api.tiktok.com/portal/docs/business-messaging/v1.3) (doc JS-only, no extraible)
- [Messaging Partners](https://ads.tiktok.com/help/article/about-message-management-tools) - [UnifyPort](https://www.unifyport.ai/blog/tiktok-no-dm-api-receive-messages/)
- [Content Posting Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) - auditoria, 5 usuarios/24h, `SELF_ONLY`, prohibicion de posteo silencioso
- [respond.io TikTok Business Messaging](https://respond.io/integrations/tiktok-business-messaging) (Beta) - [Manychat Help](https://help.manychat.com/hc/en-us/articles/17928990909084-How-to-connect-TikTok-to-Manychat)

**Publicacion multi-red (precios consultados 2026-08-09):**
- [Upload-Post](https://www.upload-post.com/llms-full.txt) - Free 0 / Basic 24 (5 perfiles) / Professional 50 (25, white-label) / Advanced 147 (75) / Business 438 (225), anual -40%, 22 plataformas - [nodo n8n oficial](https://github.com/Upload-Post/n8n-nodes-upload-post)
- [Ayrshare](https://www.ayrshare.com/pricing/) - USD 149 (1 perfil) / 299 (10) / 599 (30) + USD 8,99 por perfil
- [Zernio](https://zernio.com/pricing) - [Blotato](https://www.blotato.com/pricing) - [Mixpost](https://mixpost.app/pricing) - [Postiz, AGPL-3.0](https://github.com/gitroomhq/postiz-app)
- [YouTube Data API, cuotas](https://developers.google.com/youtube/v3/determine_quota_cost) - [X API pricing](https://docs.x.com/x-api/getting-started/pricing) (USD 0,015 por post, **0,200 si lleva link**)

**Plataformas de chatbot:**
- [360dialog Partners](https://360dialog.com/partners) - [pricing de partner](https://docs.360dialog.com/partner/get-started/pricing) (EUR 250/500/1.000; extras EUR 49/25/15; sin markup sobre Meta; 4% sobre pagos con tarjeta)
- [respond.io](https://respond.io/pricing) - [Manychat](https://help.manychat.com/hc/en-us/articles/25800347122716-Manychat-subscription-How-to-choose-the-right-one-for-you) - [Botmaker](https://botmaker.com/es/precios) - [Wati](https://www.wati.io/pricing/) - [Botpress](https://botpress.com/blog/pricing-update-may-2026)
- [Dify discussion #32254, licencia y multi-tenant](https://github.com/langgenius/dify/discussions/32254)
- [SporeSec, riesgo de baneo con APIs no oficiales](https://sporesec.com/en/blog/whatsapp-unofficial-api-ban-risk)

**Etiquetado de contenido IA:**
- [YouTube, contenido alterado o sintetico](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) - [Meta Transparency Center](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/) - [Storrito sobre TikTok 2026](https://storrito.com/resources/tiktoks-2026-ai-labeling-rules-and-what-they-signal-for-platform-governance/)

**Internas y mediciones propias (2026-08-09):**
- `hermes-content/docs/platform/ONIA_META_WHATSAPP_CLIENTES_20260808.md`
- VPS 187.77.16.63 por SSH: 43 contenedores, `free -h`, `n8n list:workflow --active=true`, `/var/log/onia-bot-watchdog.log`
- Medicion de 529 bytes por mensaje: tabla temporal con 100.000 filas en `dentalgest-staging-supabase-db`
- Token de Instagram: `GET graph.facebook.com/v21.0/debug_token`
- Repos: `C:\dev\proyectos\onia-platform` (62 modelos Prisma, 78.838 lineas TS/TSX, 267 archivos de test), `onia-hermes`

### Lo que no pude verificar (no lo estime)

- Si **Bolivia** esta soportada para TikTok Business Messaging: ni TikTok ni ManyChat publican la lista de paises incluidos.
- La **contradiccion de 360dialog**: "desde EUR 49/mes" en la web comercial contra EUR 250/mes Starter en la doc de partners. Hay que preguntarles.
- El **cambio de precios del 1-oct-2026** en fuente primaria de Meta: la pagina oficial de pricing no lo menciona al 2026-08-09.
- Si **Chatwoot self-hosted CE** soporta el canal TikTok (solo esta confirmado en los planes cloud) y si el Embedded Signup es CE o Enterprise (la doc no lo aclara).
- Si los tools `tiktok_publish` del MCP de Higgsfield funcionan: **no los probe** porque podrian consumir creditos.
