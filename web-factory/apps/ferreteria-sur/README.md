# Ferretería Sur — sitio del cliente (catálogo Web Factory)

Sitio de una ferretería de la zona sur de Santa Cruz. No es una web de Onia: es la web del
negocio, que además captura pedidos y los manda a su Onia Platform.

Stack: Next.js 15 · React 19 · motion · GSAP. Misma base que `apps/dental-premium`, dirección
visual contrastante (industrial utilitario: retícula visible, Archivo Black + IBM Plex Sans/Mono,
naranja de seguridad sobre gris cal).

> Los datos de contacto de `src/data/ferreteria.ts` son **DEMO** (`DEMO_CONTACTO = true`).
> El WhatsApp y el teléfono no son de un negocio real. Al montar esto para un cliente se
> reemplazan ahí y en ningún otro archivo.

## Correr

```bash
cd web-factory/apps/ferreteria-sur
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

## Variables de entorno

Dos, y **las dos son de servidor**. Ninguna lleva prefijo `NEXT_PUBLIC_`: el navegador nunca ve
la credencial, solo postea a `/api/lead`, que corre en el server y reenvía.

| Variable | Obligatoria | Qué es |
|---|---|---|
| `ONIA_LEAD_WEBHOOK` | sí, para que el formulario funcione | URL del webhook de n8n que recibe el lead y llama a `POST /api/n8n/web-leads` de Onia Platform |
| `ONIA_N8N_API_KEY` | según el webhook | Se manda como header `X-N8N-API-KEY`. Si no está, el POST sale sin ese header |

En local, `.env.local` (ya ignorado por git):

```
ONIA_LEAD_WEBHOOK=https://n8n.tu-host/webhook/web-leads
ONIA_N8N_API_KEY=...
```

⚠️ Nunca buildear producción con un `.env.local` presente: Next hornea los `NEXT_PUBLIC_*` en el
bundle. Estas dos no son públicas, pero la regla del repo aplica igual.

## Sin `ONIA_LEAD_WEBHOOK` el sitio NO finge

Es una decisión, no un pendiente. Si el canal no está configurado, `/api/lead` responde **503**
con `{ error, delivered: false }` y deja el lead completo en el log del server
(`[lead] ONIA_LEAD_WEBHOOK sin configurar`). El formulario muestra el error y le ofrece a la
persona el camino que sí está vivo: un link de WhatsApp **con su lista ya escrita adentro del
mensaje**. Mismo comportamiento si el webhook responde mal o no responde (502, log
`[lead] fallo al entregar a Onia`).

Un "gracias, te contactamos" sobre un canal apagado pierde al cliente en silencio. Acá el lead
no se pierde por dos vías: el log del server y el WhatsApp del cliente.

## Campos del formulario

| campo | tipo | requerido | validado en el server |
|---|---|---|---|
| `nombre` | texto (80) | sí | no vacío |
| `whatsapp` | tel (30) | sí | ≥ 7 dígitos tras quitar todo lo que no sea número |
| `tipo` | select | no | recortado a 60 |
| `entrega` | select (retiro / entrega en obra) | no | recortado a 40 |
| `lista` | textarea (2000) | sí | no vacío |
| `src` | oculto (`ferreteria-sur`) | — | atribución de campaña |

La validación del navegador es conveniencia; la que manda es la del borde en
`src/app/api/lead/route.ts`. Los mensajes de 422 dicen qué hacer, no "campo requerido".

## Cómo se verifica que el lead llega

**Honesto: el circuito NO se probó contra el webhook real de n8n.** Lo que sigue es cómo se
prueba, y hay que correrlo antes de dar el sitio por conectado.

1. **Gate sin env** — sin `ONIA_LEAD_WEBHOOK` en el entorno:

   ```bash
   curl -i -X POST localhost:3000/api/lead -H 'content-type: application/json' \
     -d '{"nombre":"Prueba","whatsapp":"+59170000003","lista":"2 kg de tirafondo 6x60"}'
   ```

   Esperado: **503**, cuerpo `{"error":"No podemos recibir el pedido...","delivered":false}`, y en
   la consola del server la línea `[lead] ONIA_LEAD_WEBHOOK sin configurar` con el lead entero.

2. **Validación de borde** — mismo curl sin `whatsapp` (o con `"whatsapp":"123"`): **422** con el
   mensaje que le dice al usuario cómo escribir el número. Sin `lista`: **422**. Cuerpo no JSON: **400**.

3. **Canal apuntando a un receptor de prueba** — levantar cualquier endpoint que loguee
   (`ONIA_LEAD_WEBHOOK=https://webhook.site/<id>`), repetir el curl del punto 1: **200**
   `{"ok":true,"delivered":true}` y el JSON del lead visible en el receptor con `slug`,
   `rubro: "comercio"`, `nombre`, `whatsapp`, `lista`, `tipo`, `entrega`, `src`, `recibido`.

4. **Contra n8n real** — apuntar a la URL del webhook de producción, mandar un pedido desde el
   formulario en el navegador (no solo curl) y **mirar** que la ejecución aparezca en n8n y que el
   lead llegue a Onia Platform. Hasta que esto se haga y se vea en pantalla, el circuito está
   escrito pero no probado punta a punta.

5. **Autosave** — escribir media lista, recargar la página: los campos vuelven. En ventana
   privada no rompe (todo el acceso a `localStorage` va envuelto en `try/catch`).
