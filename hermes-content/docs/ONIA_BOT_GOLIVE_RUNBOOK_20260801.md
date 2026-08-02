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

## 3. DECISIÓN FINAL (2026-08-01, tarde): cambio TOTAL de número

> Tras descartar el número interino ("solo quiero un número"), Evolution API
> (riesgo de ban) y la espera pasiva (muy lenta), Sergio decidió el corte
> limpio: **un número NUEVO pasa a ser EL número del negocio.** Un solo
> número, oficial, sin esperar a Meta.

- Sergio compra el chip y pasa el número **el 2026-08-02**.
- El número entra **directo a Cloud API** en la WABA verificada (NUNCA
  registrarlo en la app de WhatsApp — el chip solo recibe el SMS del alta).
- El bot lo atiende 24/7; Sergio responde los handoffs **desde el celular con
  la app de Chatwoot** (self-hosted, ya corre en el VPS). No hay app de
  WhatsApp para ese número: Chatwoot ES la interfaz. Eso es exactamente lo
  que se le venderá al cliente.
- El CTA wa.me de la web pasa al número nuevo (`NEXT_PUBLIC_WA_PHONE` +
  rebuild de la landing).
- Legal: actualizar el teléfono en SIAT (padrón) y SEPREC + demás puntos —
  checklist con fuentes en `ONIA_CAMBIO_NUMERO_PLAN_20260801.md` (research
  en curso al escribir esto).
- El 78491375 queda como línea personal de Sergio (app intacta) y la disputa
  con Meta sigue en paralelo como vía de recuperación, ya sin urgencia.

## 4. Si Meta libera el 78491375 (ya NO es el gate — fallback opcional)

> Con la decisión de §3, el negocio migra a un número nuevo y esta sección
> deja de ser la ruta crítica. Si la disputa se gana, el 78491375 vuelve
> entero a manos de Sergio como línea personal; usarlo comercialmente de
> nuevo sería una decisión nueva. Los pasos quedan por si acaso:

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

Nota: si algún día el CTA de la web debe apuntar a otro número, es el env
`NEXT_PUBLIC_WA_PHONE` en el build de la landing (build-time: exige rebuild).

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
