# Nuvia — Checkout real + envíos (diseño)

- Fecha: 2026-07-05
- Estado: diseño aprobado (decisiones cerradas con Sergio). Pendiente: revisión del spec → plan de implementación.
- Carril: Nuvia (app real). NO tocar `onia-center` ni otras landings.
- App objetivo: storefront Next.js servido en `/nuvia` (`web-factory/apps/site`). NO el template estático `store.ts` → `out/nuvia/`.

## 1. Objetivo

Convertir el carrito de Nuvia en un **pedido accionable**: página de checkout que captura datos del
cliente y de entrega, calcula el total de **productos** (autoridad en el servidor) y entrega el
pedido por **WhatsApp** (canal desbloqueado). El costo de envío **no se calcula en la web**: se
coordina y se cobra al despachar, según la zona. El camino de pago QR-BNB/Supabase queda intacto y
compatible para activarse cuando lleguen credenciales (fuera de alcance de esta iteración).

## 2. Estado actual (verificado)

- El drawer del carrito ([`nuvia-store.tsx`](../../../web-factory/apps/site/src/components/nuvia/nuvia-store.tsx)) hace `POST /api/nuvia/checkout` con **solo los items** (sin cliente ni entrega) y, sin credenciales BNB/Supabase, devuelve `configuration_pending` → callejón sin salida.
- Existe [`buildNuviaCheckoutHref`](../../../web-factory/apps/site/src/lib/nuvia-data.ts) (WhatsApp) pero **no está conectado**.
- 315 productos con precio real (BOB); 12 destacados con -10%. El carrito ya calcula subtotal/descuento/total.
- `contacto.whatsapp` está **vacío** en `nuvia.json` → bloqueante de lanzamiento (dato humano, no código).
- El hook `useCart` vive dentro del monolito `nuvia-store.tsx` (1692 líneas) y está acoplado al storefront (notices/drawer/promo).
- La suite E2E actual (`playwright.config.ts`) prueba el **sitio estático** `out/<slug>/` en :4319, **no la app Next**. El checkout real no tiene arnés E2E hoy.

## 3. Decisiones cerradas

| Tema | Decisión |
| --- | --- |
| Superficie | Página dedicada `/nuvia/checkout` (no multi-paso en drawer, no mínimo) |
| Canal del pedido | WhatsApp deep-link con el pedido completo (productos + cliente + entrega + código) |
| Número WhatsApp | Provisional = número ONIA `59175470140` (swappable). Mensaje con marcador `#NuviaPedido` para ruteo del futuro bot |
| Envío | **No se calcula ni se muestra monto en la web.** Se coordina y cobra al despachar según zona |
| Total en web | Productos − descuento. Nota honesta bajo el total sobre el envío |
| Ubicación capturada | Ciudad (lista) + zona/barrio + dirección + referencia |
| Factura / NIT | No (fuera de alcance) |
| Pago online (BNB QR) | No en esta iteración (camino se mantiene, no se activa) |
| Retiro en punto / envío gratis por umbral | No |
| Base de Nuvia | 6º anillo, Av. Banzer (norte de Santa Cruz) — relevante solo como contexto, no para tarifar |

## 4. Alcance

**Dentro:** página `/nuvia/checkout`, captura de cliente + entrega, total de productos validado en
servidor, handoff por WhatsApp, extracción del hook de carrito, estilos mobile-first, tests (unit +
E2E de la app Next).

**Fuera (YAGNI):** cálculo/tarifa de envío, pago QR-BNB online, factura/NIT, retiro en punto, envío
gratis por umbral, tracking de pedido, cuentas de usuario, inventario, GPS/mapa (posible fase 2).

## 5. Arquitectura — archivos

| Acción | Archivo | Rol |
| --- | --- | --- |
| NEW | `apps/site/src/app/nuvia/checkout/page.tsx` | Ruta server: metadata, lee productos, renderiza el checkout cliente |
| NEW | `apps/site/src/components/nuvia/nuvia-checkout.tsx` | UI cliente: resumen del pedido + formulario + CTA WhatsApp |
| NEW | `apps/site/src/lib/nuvia-cart.ts` | Hook `useNuviaCart` **extraído** del monolito (core: estado + storage + totales) |
| NEW | `apps/site/src/lib/nuvia-order.ts` | **Sin imports de Next.** Schema Zod del checkout + `buildWhatsappOrderMessage` |
| EDIT | `apps/site/src/lib/nuvia-commerce.ts` | Acepta `customer` + `delivery`; total = productos − descuento; devuelve `whatsappUrl`; sin cálculo de envío |
| EDIT | `apps/site/src/components/nuvia/nuvia-store.tsx` | Drawer: CTA → `/nuvia/checkout`; consume el hook extraído (compone notices/drawer/promo encima) |
| EDIT | `apps/site/src/app/globals.css` | Estilos `.nuvia-checkout-*` (mobile-first) |
| NEW | `apps/site/src/lib/nuvia-order.test.ts` | Unit: schema + builder de mensaje |
| NEW | `web-factory/playwright.next.config.ts` + `tests/e2e-next/nuvia-checkout.spec.ts` | Primer arnés E2E de la app Next |
| DATO | `web-factory/data/clients/nuvia.json` → `contacto.whatsapp` | Lo carga Sergio; no se inventa |

## 6. Modelo de datos

### Payload del checkout (cliente → `POST /api/nuvia/checkout`)

```ts
type NuviaCheckoutRequest = {
  storeSlug?: "nuvia";
  items: { id: string; quantity: number }[];
  customer: {
    name: string;      // requerido
    phone: string;     // requerido (formato BO tolerante)
    email?: string;    // opcional
  };
  delivery: {
    city: string;      // requerido — lista abajo
    cityOther?: string; // requerido solo si city === "Otra"
    zone?: string;     // barrio/zona (texto libre; placeholder con perímetros para SCZ)
    address: string;   // requerido — dirección exacta
    reference?: string; // cómo llegar / referencia
    notes?: string;    // notas del pedido
  };
};
```

Lista de ciudades (dropdown): `Santa Cruz de la Sierra` (default), `Cochabamba`, `La Paz`,
`El Alto`, `Sucre`, `Tarija`, `Oruro`, `Potosí`, `Montero`, `Warnes`, `La Guardia`, `Cotoca`,
`Otra`. Para `Santa Cruz de la Sierra`, el campo `zone` usa como placeholder los perímetros
investigados (Norte/Equipetrol, Centro, Sur/Plan 3000, etc.) — solo como ayuda para ubicar, sin
tarifa.

### Respuesta (`NuviaCheckoutResponse` para el flujo WhatsApp)

El flujo de checkout de esta iteración devuelve esta forma (nueva, específica del canal WhatsApp):

```ts
{
  ok: boolean;
  mode: "whatsapp" | "configuration_pending" | "invalid_request";
  message: string;
  order: {
    publicCode: string;   // NV-...
    persisted: boolean;   // true solo si Supabase está configurado
    subtotal: number;
    discountTotal: number;
    total: number;        // = subtotal - discountTotal (SOLO productos)
    currency: "BOB";
    items: NuviaCheckoutLine[];
  };
  whatsappUrl: string | null;      // null si falta contacto.whatsapp
  requiredConfiguration: string[]; // p.ej. ["contacto.whatsapp"]
}
```

Nota: **no hay línea de envío con monto.** El total es solo productos. El mensaje de WhatsApp y la UI
dejan explícito que el envío se coordina al despachar.

**Sobre el camino QR-BNB (dormido, sin contradicción):** las funciones actuales de QR/pago
(`createBnbQrPayment`, `persistPayment`, y los `mode: "payment" | "quote"`) **permanecen en el
módulo pero no se invocan** desde `/nuvia/checkout` en esta iteración. El nuevo flujo entra por un
`channel` implícito = `whatsapp`; cuando en el futuro se active el pago online, se ramifica por
`provider`/`channel` sin reescribir lo hecho. "Se mantiene" = el código sigue ahí y compilando, no
que se ejecute ahora. El drawer deja de hacer su `POST` propio (ahora navega a `/nuvia/checkout`),
así que nadie consume los modos viejos en el MVP.

## 7. Flujo de datos

1. Carrito (localStorage `nuvia-next-cart-v1`) → botón **"finalizar compra"** → navega a `/nuvia/checkout`.
2. La página lee el carrito con el hook compartido (`useNuviaCart`) y muestra: resumen de líneas,
   subtotal, descuento, **total de productos**, y la nota de envío.
3. El cliente completa el formulario (cliente + entrega). Validación en vivo (Zod).
4. Submit → `POST /api/nuvia/checkout` con `{ items, customer, delivery }`.
5. Servidor ([`nuvia-commerce.ts`](../../../web-factory/apps/site/src/lib/nuvia-commerce.ts)):
   - **Recalcula** líneas + descuento + total desde `nuviaCartProducts` (nunca confía en el cliente).
   - Persiste orden + items en Supabase **si está configurado** (reusa `persistOrder`; guarda `delivery` en columnas existentes: `delivery_city`, `delivery_address`, `customer_*`, `customer_notes`).
   - Construye `whatsappUrl` desde `nuvia.contacto.whatsapp` con `buildWhatsappOrderMessage(order, customer, delivery)`.
   - Devuelve `{ mode, order, whatsappUrl, requiredConfiguration }`.
6. Cliente:
   - Si `whatsappUrl` existe → `window.open(whatsappUrl, "_blank")` + limpia carrito + muestra confirmación con código.
   - Si `whatsappUrl` es null (`configuration_pending`) → muestra el código + aviso honesto ("canal en configuración") y, si `contacto.email` existe, ofrece `mailto` de respaldo.
   - **Resiliencia:** si el `POST` falla (red/servidor), el cliente arma un `wa.me` básico local (helper reutilizado) para no dejar al cliente atascado; el total mostrado es el del carrito.

## 8. Contrato del mensaje de WhatsApp

`buildWhatsappOrderMessage` (en `nuvia-order.ts`, puro, testeable) produce:

```
#NuviaPedido {publicCode}
Hola Nuvia 👋 Confirmo mi pedido:

🛒 PEDIDO {publicCode}
• {qty}× {title} — {lineLabel}
• ...

Subtotal: Bs. {subtotal}
Descuento: -Bs. {discount}
Total productos: Bs. {total}
Envío: se coordina al despachar según mi zona

👤 CLIENTE
Nombre: {name}
Teléfono: {phone}
{Email: {email}}   (solo si hay)

📍 ENTREGA
Ciudad: {city}
Zona: {zone}         (solo si hay)
Dirección: {address}
Referencia: {reference}  (solo si hay)
Notas: {notes}       (solo si hay)
```

URL final: `https://wa.me/{digits}?text={encodeURIComponent(message)}`, con `digits` normalizado desde
`nuvia.contacto.whatsapp` (acepta número crudo o URL `wa.me` completa, igual que el helper actual).

La **primera línea `#NuviaPedido {publicCode}`** es un marcador legible por máquina: cuando el número
destino se convierta en chatbot multi-tenant, el bot detecta ese prefijo y **enruta el pedido como
Nuvia** (acusa recibo + deriva a humano/CRM) en vez de responder como agencia ONIA. Ver
`WEB_FACTORY_CHATBOT_MULTITENANT_ARCHITECTURE.md`.

**Número destino (provisional):** `59175470140` (número ONIA, `+591 75470140`) en `contacto.whatsapp`.
Es swappable por un número dedicado de Nuvia con un cambio de una línea en `nuvia.json`, sin tocar
código.

## 9. Validación

Schema Zod único en `nuvia-order.ts` (cliente + servidor reusan el mismo):

- `name`: string, min 2.
- `phone`: string, regex tolerante BO (`^\+?[\d\s().-]{7,15}$` sobre dígitos).
- `email`: `union([string().email(), literal("")])`, opcional.
- `city`: string no vacío (de la lista); si `= "Otra"`, `cityOther` requerido (min 2).
- `zone`: opcional.
- `address`: string, min 5.
- `reference`, `notes`: opcionales.
- `items`: array, min 1; cada `id` debe existir en `nuviaCartProducts` (el servidor descarta ids desconocidos y falla si no queda ninguno → `invalid_request`).

El servidor revalida con el mismo schema y **siempre** recalcula el total. Errores → respuesta con
`mode` y `message` claros; nunca revienta el POST sin cuerpo JSON.

## 10. Refactor acotado — extracción del hook de carrito

Motivo: la página de checkout necesita el mismo estado de carrito que el drawer, y `nuvia-store.tsx`
ya excede el límite de 800 líneas. Extracción **de comportamiento preservado**:

- `lib/nuvia-cart.ts` → `useNuviaCart(cartProducts)`: estado core (líneas, `add/addMany/increase/decrease/remove/clear`, `productMap`, sync localStorage, `subtotal/discountTotal/total/priced/totalCount`, `ready`). **Sin** notices/drawer/promo.
- `nuvia-store.tsx` → un wrapper `useStorefrontCart` compone `useNuviaCart` y agrega notices + drawer `open` + promo, envolviendo `add`/`addMany` para notificar y abrir el drawer.
- La página de checkout usa `useNuviaCart` directo.
- Constantes compartidas (`STORAGE_KEY`, tipo `CartLine`) se mueven a `nuvia-cart.ts`.

No se toca ningún otro comportamiento del storefront. No se hace refactor no relacionado.

## 11. Estilos (mobile-first)

`.nuvia-checkout-*` en `globals.css`, reutilizando los tokens de marca existentes (navy `#0F2D52`,
teal, coral CTA, crema `#FFFBF4`) y el header fijo de Nuvia. Layout: una columna en mobile (resumen
arriba colapsable, formulario abajo, CTA sticky), dos columnas en desktop (formulario izquierda,
resumen sticky derecha). Respeta `prefers-reduced-motion`. Sin animar propiedades de layout.

## 12. Testing

**Unit (vitest, `pnpm test`) — gate primario:**
- `nuvia-order.test.ts`: `buildWhatsappOrderMessage` (formato, campos opcionales omitidos, encoding,
  normalización del número), y el schema Zod (casos válidos/ inválidos: falta nombre, phone malo,
  city "Otra" sin cityOther, address corta, items vacío).
- `nuvia-order.ts` no importa Next → el test importa por ruta relativa (evita el alias `@/`).

**E2E (Playwright, app Next) — arnés nuevo:**
- `playwright.next.config.ts`: `webServer` que hace build + `next start` de `apps/site` en un puerto
  propio; `testDir: tests/e2e-next`; script `e2e:next`. Separado del `pnpm e2e` estático (que seguirá
  probando `out/`).
- `nuvia-checkout.spec.ts`: agregar producto → ir a `/nuvia/checkout` → ver total de productos →
  completar formulario → submit → **assert** que se dispara un `wa.me` con el código y los items
  (con `contacto.whatsapp` inyectado por fixture/env de test para no depender del número real).
- a11y básica de `/nuvia/checkout`: labels asociados, foco visible, navegación por teclado.

Nota honesta: el gate `pnpm e2e` existente NO cubre la app Next; este spec agrega el primer E2E de la
app real como infraestructura nueva.

## 13. Seguridad

- El servidor es la autoridad del total; el total del cliente es solo display.
- El browser nunca recibe claves de Supabase ni credenciales BNB (se mantiene el patrón actual).
- El mensaje de WhatsApp contiene PII del propio cliente (es su pedido) — **no** loguear el mensaje
  completo ni la PII en el servidor; loguear solo `publicCode` y `mode`.
- Validación estricta en el boundary (Zod) antes de procesar; ids de producto verificados contra el
  catálogo real.
- Sin secretos hardcodeados. `contacto.whatsapp` es dato público de negocio, va en `nuvia.json`.

## 14. Estado de lanzamiento (sin bloqueantes duros)

1. **Número WhatsApp: resuelto (provisional).** Destino = número ONIA `59175470140` en
   `contacto.whatsapp`. El checkout entrega pedidos desde el día uno. Mejora futura (no bloqueante):
   número dedicado de Nuvia (SIM prepago) — swap de una línea en `nuvia.json`.
2. **Bot Nuvia-aware (carril aparte, no bloquea el checkout).** Cuando el número ONIA se convierta en
   chatbot, debe reconocer el marcador `#NuviaPedido` y enrutar el pedido; hasta entonces lo atiende
   un humano. Es trabajo del carril de chatbot/infra, no de este checkout.
3. (Opcional, más adelante) credenciales BNB + Supabase service role para pago online y persistencia.

## 15. Plan de implementación (alto nivel — el detalle va al writing-plans)

1. `nuvia-order.ts` (schema + builder) + su unit test. (TDD: test primero.)
2. Extraer `useNuviaCart` a `nuvia-cart.ts`; recablear `nuvia-store.tsx` (drawer CTA → `/nuvia/checkout`).
3. Extender `nuvia-commerce.ts` (customer + delivery, total productos, `whatsappUrl`, persistencia condicional).
4. `nuvia-checkout.tsx` + ruta `page.tsx` + estilos `globals.css`.
5. Arnés E2E Next (`playwright.next.config.ts` + spec) + a11y.
6. QA de navegador (mobile-first, reduced-motion, responsive) vía `pnpm preview:nuvia`.
7. Gates: `tsc --noEmit`, `pnpm lint`, `pnpm test`, `pnpm e2e:next`, code-reviewer → merge a main.
