# Estado del stack chatbot de Onia — loop de verificación total

Auditoría 2026-08-18 (pedido de Sergio: pago, incremento, construcción, conexión WhatsApp,
pestañas). Todo lo listado como FUNCIONA fue **mirado renderizado** (Playwright + capturas
en el scratchpad de la sesión, `loop-chatbot/`) o **verificado en la base de producción**
(supabase-db del VPS, schema public). Dos pasadas; la segunda no encontró nada nuevo → loop
cerrado. Capturas: `...\946633e2-...\scratchpad\loop-chatbot\*.png`.

---

## 1. CONSTRUIDO Y FUNCIONA (probado, no supuesto)

### El loop completo del dueño — VERIFICADO PUNTA A PUNTA
1. Login QA clínica → `/settings/chatbot` (link "Chatbot" visible en la fila de tabs de
   Configuración: Clínica · Doctores · Equipo · Mi Plan · **Chatbot**).
2. **Editar**: se cambió "Cómo se dice el horario" con un marcador de auditoría.
3. **Probar**: el probador ("Probá tu bot") NO simula — relaya al motor del VPS vía
   `/api/chatbot-knowledge/preview` → `BOT_PREVIEW_URL`. Contestó con el borrador editado
   (captura `b21-chatbot-probador.png`).
4. **Publicar**: la versión subió en base **v3 → v4**, `status='publicado'`
   (tabla `public.chatbot_knowledge`, verificado por SQL).
5. **El widget real contesta el cambio**: se abrió el widget vivo de Chatwoot del inbox #7
   (`chat.onia.com.bo/widget?website_token=vsB37…`), se escribió "¿qué horario atienden?" y
   el bot respondió CON el marcador publicado minutos antes (captura
   `d03-widget-respuesta.png`). Circuito completo: widget → Chatwoot → webhook :3020
   (onia-center) → motor → `GET /api/chatbot-knowledge/published?inboxId=7` (Bearer
   `BOT_KNOWLEDGE_SECRET`) → respuesta como recepcionista. TTL de la copia por org: 300 s
   (`ORG_CACHE`, `knowledge.mjs`) — el "<5 min" se cumple por diseño y se vio en vivo.

### Paso b (bot lee la fila por organización) — YA ESTÁ VIVO
La memoria decía "falta paso b". **Ya no falta**: el proceso corriendo
(`webhook-server.mjs` en onia-center) tiene `ONIA_BOT_KNOWLEDGE_URL=http://onia-platform:3000/api/chatbot-knowledge/published`
(default en `webhook-server.sh:170`) + secreto, la conectividad contenedor→contenedor
funciona (probada con wget desde onia-center: 404 limpio para org inexistente, 200 con
documento para inbox 7), y la respuesta del widget lo demostró con tráfico real.
El `/health` del motor muestra `knowledge.source: "file"` pero eso es la copia GLOBAL del
bot de ventas; la copia por org vive en un cache aparte que el health no expone.

### Validación del conocimiento — todo o nada, servidor manda
`PUT /api/chatbot-knowledge` estampa `version`/`updatedBy` en el servidor, valida con el
MISMO allowlist del motor y rechaza el documento entero si un campo falla. El motor vuelve
a validar al leer (`fetchOrgKnowledge` → `validateKnowledge`): un documento que el archivo
rechazaría, la db tampoco lo entrega. Guardrails: sin precios, sin promesas nuevas.

### Pago del PLAN (no del add-on) — circuito completo
- `/settings` → Mi Plan → botón "Pagar Plan Completo/Empresa" abre `QRPaymentModal`:
  QR + formulario (pagador, CI, teléfono, banco, ref) → `POST /api/subscription-payment`
  → valida monto contra `lib/subscription-plans.ts` (fail-closed, env-override posible) →
  sube comprobante a Storage `payment-proofs` → fila `subscription_payments` PENDING →
  email al admin.
- Superadmin `/admin/payments` ("Pagos de Suscripción — Revisa y aprueba"): aprobar activa
  el plan TRANSACCIONALMENTE (`admin/subscription-payments/route.ts`, con lock contra
  doble activación). Rechazo guarda motivo que el cliente ve en `/checkout` (status route).
- Estado real: **0 pagos históricos** en la tabla. El circuito existe; nadie lo usó aún.

### Gate del add-on WhatsApp en el runtime del producto
`checkWhatsAppAddon(orgId)` (lib/plan-limits): exige `organizations.whatsappAddon` **O**
entitlement `addon.whatsapp` activo, y además cupo técnico de **200 mensajes
operativos/mes** (cuenta recordatorios + despachos de agentes; fail-closed: si el conteo
falla, se niega). Esto gatea el bot Meta directo del producto y los crons que gastan plata.

### WhatsAppOrgConfig del superadmin — FUNCIONA (probado con toggle real)
`/admin/organizations/<id>`: "Activar add-on" → banner "Add-on activado correctamente" →
`whatsappAddon=t` en base (verificado por SQL) → "Desactivar" lo revirtió limpio (quedó
como estaba). La pantalla además tiene: credenciales Meta por org (Phone Number ID, System
User token, plantilla), estado técnico (Inbox 7, Onboarding Pendiente), e instrucciones
del webhook (`/api/webhooks/whatsapp` + verify token).

### Panel superadmin de Chatbots — FUNCIONA
`/admin/chatbots`: motor OK · base OK 39 ms · conocimiento file 2026-08-06.1 (bot de
ventas) · 3 orgs listadas · QA clínica "#7 · v4 · publicado · Vinculada — el bot atiende
su widget" · botón "Crear inbox web + vincular" para las orgs sin inbox
(captura `c06-admin-chatbots.png`).

### Las 16 pestañas del dashboard (org QA clínica, ADMIN)
Las 16 entradas del sidebar abren sin error, con iconos renderizados (verificado
visualmente, no con grep) y vocabulario dental correcto: Dashboard, Operaciones, Agenda de
hoy, Citas, Pacientes, Tratamientos, Inventario simple, Facturación, Facturas Recurrentes,
Comunicaciones, Agentes (por `module.agents` otorgado a mano), Contabilidad, Reportes,
Equipo, Configuración, Ayuda. La ferretería QA muestra el pack comercio (Catálogo,
Inventario, Caja, Fiados, Contabilidad, Equipo, Planilla…) y su editor de chatbot carga
con placeholders de rubro (no dental). Capturas `b02`–`b17`, `e04`, `e05`.

### Motor y crons en el VPS
- `/health` del webhook (dentro de onia-center, :3020): ok, db ok (latencia ~47 ms),
  auth por ruta secreta activa.
- Crons vivos y limpios: followup :17, reminder :32, postdemo :47, usage 08:00 La Paz —
  logs con formato "MANDARIA/NO SE MANDA", 0 candidatos (no hay tráfico), sin errores.
- Watchdog cada 2 min: ya recuperó el webhook 2 veces (13 y 15 ago) — funciona.
- Medidor de gasto (usage-run): tipo de cambio BCB 11,66; mes corriente Bs 1,99 (cliente
  onia). Honesto sobre sus límites (techo/piso) en el propio log.
- Logs del contenedor onia-platform: sin errores en las últimas 8 h.

---

## 2. CONSTRUIDO PERO MANUAL / COJO (con el hueco exacto)

### El PAGO del add-on chatbot es 100 % manual (la pregunta grande)
**Cómo contrata HOY un cliente el chatbot**: en `/settings` → Mi Plan → tarjeta "Chatbot
WhatsApp" → link **"Solicitar activación"** = mensaje wa.me pre-armado a Onia. De ahí en
adelante todo es humano: cobrar los Bs 390/mes por fuera, y el superadmin
activa el add-on a mano (WhatsAppOrgConfig o entitlement en /capacidades).
**Hueco exacto**: `POST /api/subscription-payment` solo valida PLANES
(`isSubscriptionPlan`: basic/professional/clinic/enterprise) — no existe `addon` como
producto pagable, ni fila de pago de add-on, ni activación automática al aprobar. El
add-on no pasa por el circuito de comprobante+aprobación que el plan sí tiene.

### "Cómo lo incrementan": las 500 conversaciones NO se cuentan
`includedConversations: 500` existe solo como TEXTO de pricing (labels + tests). No hay
contador de conversaciones por org, ni aviso de excedente, ni upsell automático. Lo único
medido es: (a) cupo técnico de 200 mensajes operativos/mes del producto, y (b) el gasto
Meta en Bs del usage-run (por cliente del bot de ventas, no por org). **Hueco**: si un
cliente pasa las 500 conversaciones, nadie se entera ni se factura el excedente.
El propio pricing.ts avisa: recalcular el cupo antes del 1-oct-2026 (fin de ventana 24 h
de Meta; tarifa `service` aún sin publicar).

### El editor /settings/chatbot NO está gateado por el add-on
Cualquier ADMIN de cualquier plan (incluso free/trial) ve y publica el conocimiento; el
gate real es operativo: sin inbox de Chatwoot vinculado por el superadmin no hay tráfico.
Coherente con venderlo, pero es política implícita, no decidida. Además
`GET /published` tampoco chequea `whatsappAddon`: si la org tiene inbox vinculado y
add-on apagado, el bot la atiende igual (hoy pasa EXACTO eso con la QA clínica:
`whatsappAddon=f` y el widget contesta). **Hueco**: apagar el add-on no apaga el bot.

### WhatsApp por organización: pantalla lista, conexión NO
`clinic_settings` tiene las columnas (`whatsappPhoneNumberId`, `whatsappAccessToken`,
`whatsappTemplateName`, `whatsappOnboardingAt`) y la pantalla del superadmin para
cargarlas, pero **ninguna org tiene credenciales** (todo null, onboarding pendiente).
El webhook Meta del producto (`/api/webhooks/whatsapp`, HMAC + rate-limit) está desplegado
pero sin número que le hable. El único WhatsApp vivo es el inbox 5 de Chatwoot ("Onia
WhatsApp", el número propio del bot de ventas). El canal WhatsApp de clientes depende de:
credenciales Meta por org cargadas a mano + App Review de Meta (no verificable desde acá).

### Dos motores de chatbot conviven
(a) El motor del VPS (`/opt/onia/bot`, Chatwoot, lee `chatbot_knowledge` por org) — el que
se vende y el que el editor alimenta. (b) `lib/whatsapp-bot.ts` en el producto (Meta Cloud
API directo, menú de citas 1-5, `WhatsAppSession`, con gate y cupo) — construido, sin
tráfico, y **NO lee el conocimiento editable**. Cuando el WhatsApp por org se encienda por
la vía (b), va a contestar el menú dental genérico, no lo que el dueño editó. **Hueco**:
decidir cuál motor atiende WhatsApp por org, o unirlos, antes del onboarding real.

### QR de pago: estático, marca vieja, monto 0
El modal "Pagar Plan Completo" muestra `/assets/qr-payment.png`: QR de Banco Ganadero a
nombre "Urcullo Montenegro Ruddy", leyenda **"SERVICIO DENTALGEST"**, monto **Bs 0,00**
(el cliente tipea el monto), vence 2028. Funciona, pero: marca muerta visible en el
checkout de Onia, y monto libre = comprobantes que no cuadran. (La regla "DentalGest no
se muestra como marca" se rompe justo en la pantalla donde el cliente paga.)

### Conocimiento QA cruzado entre orgs
La fila publicada de la org **clínica** (cmsvyguui…) dice `productName: "ZZ QA Ferreteria
Tornillo"` con productos de ferretería — el widget de la clínica se presenta como
ferretería (visible en `d03-widget-respuesta.png`). Es data QA mal cargada (v1–v3 por "QA
Chatbot Onia"), no bug del producto, pero ensucia cualquier demo. La org ferretería está
"Sin publicar" y además quedó un inbox 6 huérfano en Chatwoot ("ZZ QA Ferreteria") que el
producto no mapea.

### Menudencias vistas (LOW)
- `/capacidades` etiqueta `addon.whatsapp` como "Sin efecto todavía — ninguna pantalla ni
  API lee esta capacidad": **FALSO**, `checkWhatsAppAddon` la lee desde el fix del
  despachador. Etiqueta vieja que puede hacer creer que otorgar no sirve.
- `/settings` pestaña Clínica muestra "Plan: Premium" al pie mientras el chip dice "Pro"
  y la base dice `professional` — "Premium" no existe en `PLAN_LABELS`.
- La frase de horario se inserta después de "Atendemos " en la plantilla: si el dueño
  escribe una frase que empieza con "Atendemos", el bot dice "Atendemos Atendemos…"
  (reproducido en el widget). El editor no lo avisa ni lo previsualiza compuesto.
- El tour de bienvenida (13 pasos) reaparece en cada página hasta completarse/saltarse —
  molesto para cuentas QA; para un dueño real es una sola vez.
- CSP bloquea `static.cloudflareinsights.com/beacon.min.js` en todas las páginas (error
  de consola constante; analytics de CF no carga).
- Webhook Chatwoot: firma HMAC no configurada (`auth.firma:false`); la seguridad es la
  ruta secreta + tolerancia de timestamp. Diseño documentado como aceptable, pero es
  una sola capa.

---

## 3. NO CONSTRUIDO (y qué implicaría)

- **Checkout self-serve del add-on chatbot**: aceptar `addon: whatsapp` en
  `subscription-payment` (o tabla propia), monto Bs 390 (o Bs 3.900 anual) validado contra
  `pricing.ts`, y que la aprobación del superadmin encienda `whatsappAddon`
  automáticamente. Hoy: wa.me + toggle manual.
- **Contador de conversaciones por org** (las 500 incluidas): tabla/contador mensual por
  organización alimentado por el webhook del bot, aviso al 80 %, y política de excedente
  (cobrar por consumo Meta ya está definido en pricing). Sin esto el "cómo lo
  incrementan" no existe: no hay upsell posible sobre un consumo que no se mide.
- **Gate del bot por add-on**: que `GET /published` (o el motor) verifique
  `whatsappAddon`/entitlement antes de servir conocimiento, para que apagar el add-on
  apague el bot. Hoy el apagado real es desvincular el inbox a mano.
- **Onboarding WhatsApp por org de punta a punta**: Embedded Signup vía Chatwoot (la
  decisión ya tomada: encender, no construir) o carga manual de credenciales + verificar
  el primer mensaje. Bloqueado por App Review/verificación de negocio de Meta.
- **Unificación de motores**: retirar o reconvertir `lib/whatsapp-bot.ts` (menú dental)
  para que WhatsApp por org hable con el motor del VPS que sí lee el conocimiento editado.
- **Panel del conocimiento del bot de ventas**: el knowledge.json global (inbox 5) se
  edita por deploy; el propio panel lo admite ("no desde este panel, todavía").
- **Firma HMAC del webhook Chatwoot**: configurar el secreto de firma para sumar la
  segunda capa que el código ya soporta.

---

## Estado de las cuentas QA al cierre
Sin cambios netos: add-on activado y desactivado (quedó `f` como estaba); el conocimiento
de la clínica QA quedó en **v4 publicado** con la frase de horario marcada
"(aud 11:52)" — un dato QA sobre datos QA ya cruzados; si molesta, se edita desde
`/settings/chatbot` en 30 segundos.
