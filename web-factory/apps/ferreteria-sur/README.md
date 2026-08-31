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

**Qué se probó y qué no, sin adornos.** Los puntos 1 a 5 se corrieron contra un receptor local
(un `http.createServer` de 20 líneas en un temporal, no en el repo) con `next dev`, y se miraron
los resultados. El punto 6 —n8n real y Onia Platform— **NO se probó**: el circuito está escrito y
verificado hasta el borde de salida, pero nadie vio todavía una ejecución del lado de n8n.

1. **Gate sin env** ✅ — sin `ONIA_LEAD_WEBHOOK` en el entorno:

   ```bash
   curl -i -X POST localhost:3000/api/lead -H 'content-type: application/json' \
     -d '{"nombre":"Prueba","whatsapp":"+59170000003","lista":"2 kg de tirafondo 6x60"}'
   ```

   Verificado: **503** con `{"error":"No podemos recibir el pedido por el formulario en este
   momento.","delivered":false}`, y en la consola del server `[lead] ONIA_LEAD_WEBHOOK sin
   configurar` con el lead entero.

2. **Validación de borde** ✅ — `"whatsapp":"123"` → **422** "Dejá tu WhatsApp con código de
   país…". Sin `lista` → **422**. Sin `nombre` → **422**. Cuerpo no JSON y cuerpo `null` → **400**.

3. **Canal encendido** ✅ — con `ONIA_LEAD_WEBHOOK` apuntando a un receptor que loguea
   (sirve `https://webhook.site/<id>`): **200** `{"ok":true,"delivered":true}`, y el receptor vio el
   JSON completo con `slug: "ferreteria-sur"`, `rubro: "comercio"`, `nombre` (con los espacios ya
   recortados), `whatsapp`, `lista`, `tipo`, `entrega`, `src` (respetando la atribución que mandó el
   formulario, no el slug) y `recibido`. El header `X-N8N-API-KEY` llegó con el valor de
   `ONIA_N8N_API_KEY`; sin esa variable, el POST sale sin el header y el receptor lo ve en `null`.

4. **Upstream caído** ✅ — receptor devolviendo 500: la ruta responde **502**
   `{"error":"No pudimos entregar el pedido al sistema.","delivered":false}` y deja
   `[lead] fallo al entregar a Onia` con el lead en el log. No se finge un "gracias".

5. **El formulario en el navegador** ✅ — montado en una página de prueba y manejado con el
   panel abierto: autosave escribe el draft en `localStorage` (sin el campo `src`) y los campos
   vuelven tras recargar; con el upstream caído aparece el `role="alert"` con el mensaje honesto y
   el link de WhatsApp **con la lista, el nombre y la forma de entrega ya escritos adentro**; con el
   canal sano aparece el panel `role="status"` "Lista recibida…" y el draft se borra.

6. **Contra n8n real** ⬜ **pendiente** — apuntar a la URL del webhook de producción, mandar un
   pedido desde el formulario en el navegador y **mirar** que la ejecución aparezca en n8n y que el
   lead llegue a Onia Platform. Hasta que eso se vea en pantalla, el sitio no se declara conectado.
