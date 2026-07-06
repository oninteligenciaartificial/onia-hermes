# Handoff: Meta Pixel + Conversions API en las landings

> **Para:** sesión `wf-landing-*` (dueña de `web-factory/apps/site`).
> **De:** sesión `meta-ads`.
> **Regla de carriles:** yo **no** edito las landings. Este doc + el generador de
> snippet (`src/pixel.js`) dejan todo listo para que ustedes lo integren.
> **Bloqueante:** necesita `META_PIXEL_ID` (lo genera Sergio, ver runbook §5). Sin
> ese id, dejen el componente detrás de un guard (no rompe si falta).

---

## Qué hay que lograr

1. **Pixel (navegador)** en el `<head>` de las landings → mide PageView y eventos.
2. **Conversions API (servidor)** para los eventos que importan (Lead, Contact,
   Purchase) → recupera lo que el navegador pierde por bloqueadores/ITP.
3. **Dedup**: el mismo `event_id` en el evento del navegador y en el de servidor,
   para no contar doble.

El destino de cada anuncio (lo arma `meta-ads`) apunta a **estas** landings con
`?utm_source=meta&utm_medium=paid_social&utm_campaign=…`. El Pixel de la landing
es lo que cierra el loop de medición.

---

## 1) Pixel base — dónde va

- **Archivo:** `web-factory/apps/site/src/app/layout.tsx` (el `<head>` raíz del
  App Router). Hoy **no** hay ningún pixel/analytics ahí — es campo limpio.
- **Env var (pública, no secreta):** `NEXT_PUBLIC_META_PIXEL_ID`.
- **Generar el snippet exacto** (no lo escriban a mano):

  ```bash
  node -e "console.log(require('./hermes-content/integrations/meta/src/pixel').generatePixelBaseCode(process.env.META_PIXEL_ID || '000'))"
  ```

### Opción recomendada en Next 15 (App Router) — componente con `next/script`

En vez de pegar el `<script>` crudo, usen `next/script` con `strategy="afterInteractive"`
y el id desde env. Ejemplo de componente (lo crean ustedes en
`web-factory/apps/site/src/app/`):

```tsx
// MetaPixel.tsx  (lo crea la sesión wf-landing)
import Script from 'next/script';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixel() {
  if (!PIXEL_ID) return null; // guard: sin id no rompe, no renderiza
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','${PIXEL_ID}');fbq('track','PageView');
      `}</Script>
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
      </noscript>
    </>
  );
}
```

Y en `layout.tsx`, dentro del `<body>` (o `<head>` vía metadata), renderizan
`<MetaPixel />`. El guard `if (!PIXEL_ID) return null` es la clave: **mientras
Sergio no cargue el id, no rompe nada.**

> El HTML crudo equivalente (por si prefieren no usar `next/script`) sale de
> `generatePixelBaseCode(pixelId)` en `src/pixel.js` — es el snippet oficial de
> Meta, ya con el id inyectado.

---

## 2) Evento de conversión con dedup

Cuando el usuario convierte en la landing (envía un form, hace click en el CTA de
WhatsApp, etc.), disparen el evento en el navegador **con un `event_id`** y manden
ese **mismo** `event_id` a la Conversions API (paso 3):

```ts
// 1. generan un id único por conversión
const eventId = crypto.randomUUID();
// 2. navegador
fbq('track', 'Lead', {}, { eventID: eventId });
// 3. y lo mandan al endpoint server-side (paso 3) con el MISMO eventId
```

`src/pixel.js → generateBrowserTrackCall(eventName, eventId)` genera exactamente
esa línea si la quieren centralizar.

---

## 3) Conversions API (server-side) — dónde vive

- **No** va en el cliente (el `META_CAPI_TOKEN` es secreto, server-side only).
- Opción A (recomendada, sin tocar infra de landing): un **workflow n8n** recibe
  el evento y llama a `POST https://graph.facebook.com/<version>/<pixel_id>/events`.
  Lo arma la sesión `infra-deploy-n8n` (ver `HANDOFF.md`). El payload del evento
  lo construye `src/pixel.js → buildCapiEvent(...)` (hashea el email/teléfono con
  sha256 antes de salir).
- Opción B: un route handler server-side en la landing
  (`app/api/meta/capi/route.ts`) que use `buildCapiEvent`. Si lo hacen ustedes,
  el token se lee de env server-side (`META_CAPI_TOKEN`), **nunca** `NEXT_PUBLIC_`.

Forma del evento (lo devuelve `buildCapiEvent`):

```json
{
  "event_name": "Lead",
  "event_time": 1751761234,
  "event_id": "<mismo-uuid-que-el-navegador>",
  "action_source": "website",
  "event_source_url": "https://onia.com.bo/dentalgest-demo",
  "user_data": { "em": ["<sha256>"], "client_user_agent": "…" }
}
```

Se envía como `{ "data": [evento], "access_token": "<META_CAPI_TOKEN>" }`.

---

## Checklist para wf-landing

- [ ] Crear `MetaPixel.tsx` con guard `if (!NEXT_PUBLIC_META_PIXEL_ID) return null`.
- [ ] Renderizarlo en `layout.tsx`.
- [ ] Agregar `NEXT_PUBLIC_META_PIXEL_ID` al entorno de la landing (cuando Sergio
      dé el id).
- [ ] Disparar `fbq('track', 'Lead', {}, { eventID })` en la conversión real.
- [ ] Decidir CAPI: n8n (infra) **o** route handler server-side. Si es route
      handler, `META_CAPI_TOKEN` server-side, nunca público.
- [ ] Confirmar en Events Manager → Test Events que llegan Pixel + CAPI y **se
      deduplican** por `event_id`.

Cualquier ayuda con el payload/hasheo: `require('.../integrations/meta/src/pixel')`.
