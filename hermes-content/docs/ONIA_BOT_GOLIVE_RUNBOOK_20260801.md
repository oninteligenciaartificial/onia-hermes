# Onia Bot — Runbook de producción (2026-08-01)

> Estado al escribir: el bot está **EN PRODUCCIÓN** en el canal Chatwoot
> (`ONIA_BOT_DRY_RUN=false` desde hoy). Falta solo el canal WhatsApp, gateado por
> la disputa de Meta (caso **1047562948135567**, escalado, respuesta a
> `business@onia.com.bo`). Este runbook deja escrito lo que se hace el día que
> Meta libere el número — son ~30 minutos de trabajo, todo lo demás ya está.

## 1. Qué ya está corriendo (no volver a hacer)

| Pieza | Estado | Dónde |
|---|---|---|
| Servidor de webhook | vivo, puerto 3020, fail-closed | contenedor `onia-center`, código `/opt/onia/bot` |
| Watchdog | cron cada 2 min, probado matándolo | `/opt/onia/bot/webhook-watchdog.sh` |
| Webhook de Chatwoot | cuenta 2 → nuestro server (id 2, `message_created`) | cubre TODOS los inboxes, presentes y futuros |
| Inbox 3 "ONIA Demo" | API channel, producción | Chatwoot |
| Inbox 4 "Onia Web" | web_widget, token `9k5i7xnAgCbSse1EZwVChZLw` | Chatwoot |
| Motor | multirubro + rama dental + soporte + audio (Speaches) + reserva real Cal.com | 292 tests, benchmark 60/60 |
| Reserva | `demo-bot` (id 5, oculto) reserva; `demo-onia` (público) da disponibilidad | Cal.com |
| Dry run | **APAGADO** (2026-08-01): el bot postea de verdad | `/opt/onia/bot/webhook.env` |

Secretos: `/opt/onia/bot/webhook.env` (chmod 600, fuera de git). El token de la API
de Chatwoot se lee de su propia base en cada arranque.

## 2. Widget web — HANDOFF a la sesión dueña de onia.com.bo

`onia.com.bo` ya NO apunta a Vercel/web-onia: el DNS va al VPS (187.77.16.63) y
sirve `web-factory/apps/onia-platform` vía el contenedor `onia-platform`
(runtime standalone en `/opt/onia-platform/runtime-next`). Ese carril tiene dueño
activo — **el widget lo agrega esa sesión**, es un bloque autocontenido en su
layout raíz:

```tsx
// apps/onia-platform/src/app/layout.tsx — antes de </body>
import Script from 'next/script'

<Script id="onia-chatwoot" strategy="afterInteractive">{`
  (function(d,t){
    var BASE_URL="https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";g.defer=true;g.async=true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){window.chatwootSDK.run({websiteToken:"9k5i7xnAgCbSse1EZwVChZLw",baseUrl:BASE_URL})};
  })(document,"script");
`}</Script>
```

No hay nada que configurar del lado del bot: el inbox 4 ya existe y el webhook de
la cuenta lo cubre. Con pegar ese bloque y redeployar, el bot atiende la web.
(El mismo snippet ya quedó commiteado en el repo Web-Onia por si el dominio
vuelve a Vercel algún día.)

## 3. Número interino del bot — chip nuevo (DECIDIDO 2026-08-01)

> Sergio decidió no esperar la disputa: el bot sale a WhatsApp **hoy** con un
> número nuevo por Cloud API oficial, y migra al 78491375 cuando Meta lo libere
> (§4). La disputa sigue corriendo en paralelo — no se cancela nada.

**Lo que compra Sergio (única tarea física):**
- Chip prepago Entel o Tigo (Bs 10–20). Solo necesita **recibir SMS/llamadas**.
- Registrarlo a su nombre o el del negocio (el SIM es la llave del número).
- **REGLA DURA: NO activar la app de WhatsApp con ese chip, nunca.** Un número
  registrado en la app no puede entrar a Cloud API sin liberarlo antes (el mismo
  pozo del 78491375). El chip solo recibe el SMS de verificación.
- Recargarle algo cada 2–3 meses para que la línea no se recicle.

**Lo que hago yo cuando el chip esté en mano (~10 min + SMS):**
1. WhatsApp Manager → WABA verificada (1730104971691715) → Agregar número →
   verificación por SMS (Sergio me pasa el código) → display name **"Onia"**.
2. Token permanente de system user en Business Settings + `phone_number_id`.
3. Chatwoot → Inbox WhatsApp (Cloud API). El webhook de la cuenta ya lo cubre →
   el bot atiende al instante.
4. Zona horaria de la WABA → `America/La_Paz`.
5. Leads nuevos al bot: setear `NEXT_PUBLIC_WA_PHONE=<numero-bot>` en el build
   de la landing y redeployar (`swap-and-verify.sh`). Es build-time: sin rebuild
   no cambia. El 78491375 sigue siendo el número del negocio (SEPREC, legal,
   la app de Sergio); solo el CTA wa.me de la web apunta al bot.
6. Plantillas (§4 paso 4) apenas esté el método de pago.
7. Prueba real del embudo desde otro número → M0 → calificar → reserva Cal.com.

## 4. El día que Meta libere el número (+591 78491375)

Prerrequisito: correo de resolución en `business@onia.com.bo` del caso
1047562948135567. **No intentar antes** — dispara el mismo error y quema SMS.

1. **Vincular el número** — Business Suite → OniaAgency → Cuentas de WhatsApp →
   "Test WhatsApp Business Account" → Agregar → **"Vincular una cuenta de
   WhatsApp Business"**. Elegir SIEMPRE el portfolio `OniaAgency` (verde, todo
   junto). Con suerte ofrece **coexistencia** (QR desde la app; oficial desde
   may-2025). Si rechaza por país (Bolivia aún sin cobertura): reintentar en
   unas semanas — la app sigue intacta mientras tanto.
2. **Inbox de WhatsApp en Chatwoot** — Chatwoot → Inboxes → Add → WhatsApp
   (Cloud API): número, `phone_number_id` y token del WhatsApp Manager.
   El webhook de la cuenta ya lo cubre → el bot atiende al instante.
3. **Zona horaria de la WABA** — está en `America/Los_Angeles`; cambiar a
   `America/La_Paz` (WhatsApp Manager → cuenta → configuración).
4. **Plantillas** (necesitan el método de pago cargado): crear las 4 ya
   redactadas en `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` §plantillas —
   `onia_demo_confirmada`, `onia_demo_recordatorio`, `onia_seguimiento_pendiente`
   (utility) y `onia_lead_reactivacion` (marketing). Regla dura: ni una palabra
   de venta en las utility. Muestra obligatoria al crearlas.
5. **Webhooks de plantillas** — suscribir `message_template_status_update` y
   `account_update` en la app de Meta (avisan recategorizaciones con 1 día).
6. **Probar el embudo real**: mandar "hola quiero info" desde otro número →
   M0 → calificar → horario → verificar reserva en Cal.com.

Al liberarse: decidir si el interino queda como número de soporte/backup o se
recicla. La migración del CTA de la web es el mismo env `NEXT_PUBLIC_WA_PHONE`.

## 5. Pendientes que NO dependen de Meta

- **n8n (espera login de Sergio):** workflow del aviso de handoff por Telegram
  (el bot ya emite `notifyCount`/`notifyReasons`; falta quien lo escuche) +
  activar validación de secreto en el disparador de agentes (el panel ya manda
  la llave).
- **Método de pago de Meta** (Sergio): destraba plantillas = escribir primero.
- **Voz (fase siguiente):** WhatsApp Calling API + Pipecat + Speaches + piper.
  Veredicto completo y costos en el research del 2026-08-01 (entrantes gratis,
  salientes ~USD 0,01/min). Arrancar por F0 con el número de test.

## 6. Vigilancia de la disputa

- Revisar `business@onia.com.bo` a diario (y spam). Responder el mismo día.
- Sin respuesta en 5 días hábiles → reabrir el chat "Disputa De Administrador
  WhatsApp" en Business Support Home citando el caso.
- El ticket paralelo de soporte consumer también sigue vivo (mismo número de
  caso); la respuesta bilingüe de escalamiento quedó lista para reenviar.
