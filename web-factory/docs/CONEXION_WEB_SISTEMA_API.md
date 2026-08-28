# Web de cliente → Onia Platform por API — diseño ejecutable

**Qué resuelve.** Que lo que pasa en la web del cliente (pedido de presupuesto,
consulta) entre como dato al sistema del cliente en Onia Platform, sin que el
navegador toque jamás una credencial. Nace del pedido de Sergio (2026-08-28):
*"tiene que poder conectarse al sistema — ¿cómo lo haría por API?"*.

> Fuente de verdad de ESTE carril (web-factory). Lo que toca el producto o n8n
> se DISEÑA acá y lo ejecuta su carril; los archivos citados del producto son
> referencia de solo-lectura, verificados hoy en `onia-platform` master.

---

## El circuito, de punta a punta

```
[1. web estática out/<slug> — SIN secretos]
    form del bloque inline-quote-form
    POST multipart: nombre, whatsapp, tratamiento, mensaje, src=<slug>
        │
        ▼
[2. n8n — webhook público]  POST https://n8n.onia.com.bo/webhook/web-lead
    valida payload → resuelve slug → organizationId (tabla propia o data table)
    → llama al producto con la credencial guardada EN N8N (nunca en la web)
        │  header  X-N8N-API-KEY: <clave>
        ▼
[3. producto — endpoint NUEVO]  POST /api/n8n/web-leads
    valida con lib/n8n-auth.ts → validateN8nApiKey()  (patrón ya existente)
    → inserta el lead en la organización → visible en el panel
        │
        ▼
[4. panel del cliente]  el dueño ve el pedido y responde
```

## Lo que YA existe (verificado, con archivo y patrón)

| Pieza | Dónde (onia-platform master) | Patrón |
|---|---|---|
| Auth n8n↔producto | `lib/n8n-auth.ts` → `validateN8nApiKey()` | header `X-N8N-API-KEY`, sha256 + `timingSafeEqual`, guarda anti-placeholder, 503 si no configurada |
| Superficie n8n | `/api/n8n/callback/{invoice-status,subscription-approve}` · `/api/n8n/webhook/{payment,recurring-invoices}` · `/api/n8n/whatsapp/send` | todas con la misma auth |
| Server-to-server con Bearer | `/api/chatbot-knowledge/published` (`BOT_KNOWLEDGE_SECRET`) | resuelve org por `organizationId` o `inboxId` |
| Precedente web→lead | `forms.onia.com.bo/alta` → n8n → `onia_center.leads` | el mismo salto 1→2, ya vivo para los leads de ONIA |
| Atribución | bloque `inline-quote-form` manda `src` oculto | el lead llega etiquetado con el slug |

## Lo que FALTA, por dueño de carril

**Carril web-factory (este) — HECHO 2026-08-28:**
- `landing-clinic` renderiza `inline-quote-form` cuando el perfil trae
  `cotizacion.titulo` (entre FAQ y cierre). Sin `accion`, el bloque no pinta un
  form muerto: muestra los canales directos (regla de honestidad del bloque).
- El intake pasa `cotizacion` al perfil (passthrough en `data/intake-schema.ts`).
- Cliente de prueba `dental-amanecer` con la sección cargada y `accion` vacía
  hasta que exista el webhook.

**Carril producto (`onia-platform`) — ~40 líneas:**
- `app/api/n8n/web-leads/route.ts`, calcado de un callback existente:
  `validateN8nApiKey` → zod del payload → resolver org → insertar. Decisión de
  producto: ¿a qué tabla? Candidatas: contacto/lead propio del CRM del cliente
  o `AccessRequest`-equivalente por org. Payload propuesto:
  `{ slug: string, nombre: string, whatsapp: string, tratamiento?: string,
     mensaje?: string, src: string }`.

**Carril infra/n8n (tiene dueño de turno — NO se toca desde acá):**
- Workflow `web-lead`: Webhook (POST, respond immediately con página de gracias
  o redirect) → validación → HTTP Request al producto con credencial Header
  Auth `X-N8N-API-KEY` (credencial de n8n, JAMÁS `$env` ni hardcode — regla
  global). Mapa slug→organizationId en data table de n8n o en el propio
  payload del producto (el producto puede resolver por slug si el endpoint lo
  acepta — preferible: UNA fuente, el producto).

## Cuando el webhook exista, encender la web es UNA línea

En `data/intakes/<slug>.intake.json`:
```json
"cotizacion": { "accion": "https://n8n.onia.com.bo/webhook/web-lead", ... }
```
y `pnpm factory:build <slug> --force`. Nada más: el form aparece, postea con
`src=<slug>`, y el lead entra atribuido.

## Reglas que este diseño respeta (de CLAUDE.md / skills)

- El navegador nunca lleva Bearer ni API key (regla escrita en
  `ONIA_WEB_CONECTADA_AL_SISTEMA.md`).
- Secretos: credencial de n8n > `$env` > nunca hardcode.
- No se promete al cliente hasta que esté encendido y verificado en prod.
- Form sin receptor = no se muestra (un input muerto es peor que ninguno).
