---
name: onia-whatsapp
description: Invocar para integrar u operar WhatsApp Business/Cloud API (Meta Graph) en ONIA o en features de cliente — enviar/recibir mensajes, plantillas HSM, webhooks, Chatwoot, o el chatbot IA que califica y deriva. Distinto del botón click-to-chat (wa.me, gratis e incluido en la web). Respeta el plan VPS (sin $env, credenciales n8n) y pide aprobación antes de enviar mensajes a un cliente.
---

# ONIA — WhatsApp Business / Cloud API

Gap sin skill pública buena → skill propia. Delegar integraciones: subagente `onia-integrations`.

## Distinción que NO se debe confundir (fuente: onia-propuestas)
- **Botón click-to-chat (`wa.me`)** = simple, **gratis, INCLUIDO** en la web del cliente.
- **Cloud API + chatbot IA** (responde, califica, deriva solo) = **add-on PAGO**. Es lo que se cobra.

## Leer primero
- `hermes-content/docs/ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md` (auditoría del stack)
- `hermes-content/docs/BOLIVIAN_ELECTRIC_META_WHATSAPP_CASE_20260627.md` (caso real)

## Infra actual (verificada, no re-descubrir)
- Motor Meta en VPS `/opt/onia/meta-ads/`; secretos en `/root/.hermes/.env` (helper `set-secrets.sh`).
- Cuenta Meta: ad account `act_1073680778314945`, app Marketing API `1562215408796050`, pixel `1012611478191231`.
- Chatwoot como bandeja/omnicanal.

## Reglas plan VPS / n8n (dura)
- **NO usar `$env`** en nodos n8n. Secretos = credencial n8n **"Header Auth"** (o `supabaseApi`); URLs de webhook hardcodeadas en el nodo.
- WhatsApp Cloud API exige **verificación de negocio** (SEPREC/NIT `5371375010`) — hoy bloqueo (token/S6). Número **non-VoIP** (VoIP no sirve para registro).
- Plantillas HSM: usar solo las **aprobadas por Meta**; no fabricar contenido de plantilla ni asumir aprobación.

## Enviar = acción externa → aprobación
Construir el flujo, webhooks y plantillas es libre. **Enviar un mensaje a un cliente/lead** necesita
OK explícito de Sergio (mensaje y canal exactos) + opt-in. Respetar etiqueta y ventana de 24h de Meta.
Para el copy del mensaje, apoyarse en las skills `copywriting`/`cold-email`; el registro va al CRM (`onia-crm-ventas`).
