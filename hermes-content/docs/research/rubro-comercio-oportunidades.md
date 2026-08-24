# Rubro comercio — qué falta, qué se adopta, qué diferencia

Investigación de producto para el rubro **comercio / tienda / ferretería / mostrador** (Bolivia,
negocios de 1-5 personas). Verificado contra `onia-platform/prisma/schema.prisma`, `lib/comercio/`
y `app/(dashboard)/comercio/` el 2026-08-23.

---

## ⚠️ Corrección de premisa (verificado, no heredado)

El encargo decía "NO tiene proveedores, órdenes de compra, lotes/vencimientos, alertas de stock".
Contado de nuevo en el schema y el código, es **falso en 3 de 4**. Lo que pasa es peor y más barato
de arreglar: **está construido y apagado**.

| Pieza | Estado real verificado |
|---|---|
| Proveedores | ✅ Existe. `OniaCoreBusinessPartner` con `partnerType="proveedor"`. `compras.ts` hace find-or-create por NIT/nombre. **Cero pantallas**: no hay catálogo de proveedor |
| Compras | ⚠️ Existe a medias. `OniaCommercePurchase` + `lib/comercio/compras.ts` + `app/api/comercio/compras`. **Header sin líneas**: `RegistrarCompraArgs` recibe `total: number` y nada más → la compra **nunca toca el stock ni el costo** |
| Lotes / vencimientos | ⚠️ Tabla `OniaCommerceStockLot` (con `expiresAt`) + `lib/comercio/lots.ts` (FEFO, `lotsExpiringWithin`, ventana de 30 días). `grep oniaCommerceStockLot` en `lib/` y `app/`: **cero llamadas fuera de tests**. Funciones puras que nadie invoca |
| Alertas de stock | ❌ El campo `reorderPoint` existe en `OniaCommerceStockItem`. `grep reorderPoint` en `lib/comercio` y `app/api/comercio`: **cero**. Nadie lo lee |
| Kardex valorado | ✅ Vivo. `kardex.ts` (promedio ponderado) + columnas `unitCost/avgCostAfter/valueAfter` en los movimientos |
| Listas de precios | ⚠️ `OniaCommercePriceList` solo se escribe en `demo-seed.ts` y `onboarding.ts`. Sin pantalla |
| Código de barras | ❌ `OniaCommerceProductVariant.barcode` existe. `grep barcode` en `lib`/`app`: **cero** |

Consecuencia comercial: el add-on "Inventario avanzado" no está tan lejos como se creía — pero hoy
sigue sin poder venderse, porque **nada de eso tiene pantalla**. Regla del proyecto: construido ≠
terminado.

---

## A) Qué le falta de verdad — ordenado por cuánto duele

| # | Falta | El dolor, en una frase | Costo |
|---|---|---|---|
| 1 | **Líneas en la compra** | Llega el proveedor con 40 ítems y el dueño los carga uno por uno a mano en inventario, porque registrar la compra solo guarda un total | **Grande** |
| 2 | **Recepción → costo → precio sugerido** | Subió el flete y nadie sabe a cuánto hay que vender ahora; el precio de venta se decide de memoria | **Grande** |
| 3 | **Reprecio masivo** | Con el dólar de 6,96 a 11,37, retocar 800 precios producto por producto es media semana de trabajo, y mientras tanto se vende a pérdida | **Medio** |
| 4 | **Alerta de stock bajo** | Se entera de que no hay tornillos de 3/8 cuando el cliente ya está en el mostrador. El campo `reorderPoint` está y nadie lo lee | **Chico** |
| 5 | **Pantalla de compras y proveedores** | La API existe, el dueño no puede verla: no sabe cuánto le debe a cada proveedor ni qué vence esta semana | **Medio** |
| 6 | **Encender lotes/vencimientos** | La ferretería no lo necesita; la tienda de barrio con lácteos y medicamentos sí. FEFO ya está escrito, falta cablearlo | **Medio** |
| 7 | **Lector de código de barras en la caja** | Cobrar 12 ítems tipeando el nombre es lento y con el cliente mirando. El campo `barcode` ya existe: falta escuchar el teclado del lector USB | **Chico** |
| 8 | **Precio por cantidad (mayoreo)** | La ferretería vende por unidad y por caja a distinto precio; hoy hay que crear dos productos | **Medio** |
| 9 | **Caja sin internet** | Se corta la luz o el internet y la tienda deja de vender. Hoy la caja es 100% online | **Grande** |
| 10 | **Devolución al proveedor / nota de crédito de compra** | Llegaron 3 fallados y no hay forma de descontarlos de la deuda | **Chico** |

**La cadena de compra completa que falta** (hoy corta en el paso 2):
`proveedor` ✅ → `orden` ❌ → `recepción parcial` ❌ → `costo unitario real` ❌ → `precio sugerido` ❌ → `stock` ⚠️ (solo manual)

---

## B) Open source adoptable

Todo verificado con `gh api` / `gh search code` el 2026-08-24. Estrellas y último push a esa fecha.

| Proyecto | Licencia | ⭐ | Último push | Qué sirve | Veredicto |
|---|---|---|---|---|---|
| [inventree/InvenTree](https://github.com/inventree/InvenTree) | **MIT** | 7.440 | 2026-08-23 | `PurchaseOrder` + `PurchaseOrderLineItem` + `SupplierPart` (verificado por code search: 56 y 128 hits). Es exactamente la cadena de compra que falta, con recepción parcial y precio por proveedor | **Portar el modelo de datos.** Es Django/Python: se porta el schema y la máquina de estados, no el código |
| [opensourcepos/opensourcepos](https://github.com/opensourcepos/opensourcepos) | **MIT** (el archivo LICENSE dice MIT; la API de GitHub reporta `NOASSERTION`) | 4.358 | 2026-08-23 | `app/Models/Receiving.php` + `app/Views/receivings/receiving.php` (verificado): flujo de recepción de mercadería pensado para mostrador, no para fábrica | **Mirar la UX.** PHP/CodeIgniter, no se porta código |
| [grocy/grocy](https://github.com/grocy/grocy) | **MIT** | 9.410 | 2026-08-16 | Vencimientos y consumo FEFO con lista de compra que se arma sola desde el stock mínimo (`best_before_date`: 72 hits) | **Solo se mira.** PHP; el concepto de "lista de compra automática" es lo valioso |
| [medusajs/medusa](https://github.com/medusajs/medusa) | **MIT** con carve-out: el LICENSE excluye los materiales "Enterprise Edition" (`ENTERPRISE-LICENSE.md`) | 35.972 | 2026-08-23 | Módulos `product`/`inventory` en TypeScript — el stack más cercano al nuestro | **Adoptar patrones**, no el paquete. Revisar archivo por archivo que no sea EE |
| [saleor/saleor](https://github.com/saleor/saleor) | **BSD-3-Clause** | 23.260 | 2026-08-21 | Modelo de variantes y precios por canal | Solo se mira (Python/GraphQL) |
| [bagisto/bagisto](https://github.com/bagisto/bagisto) | **MIT** | 27.988 | 2026-08-22 | Catálogo con atributos y precios por grupo de cliente | Solo se mira (Laravel) |
| [Sylius/Sylius](https://github.com/Sylius/Sylius) | **MIT** | 8.514 | 2026-08-23 | Modelo de canal/precio | Solo se mira (Symfony) |

### Descartados por licencia — **no tocar**

| Proyecto | Licencia | Por qué no |
|---|---|---|
| [frappe/erpnext](https://github.com/frappe/erpnext) | **GPL-3.0** (38.421 ⭐) | Copiar código nos obliga a liberar ONIA Platform entera |
| [odoo/odoo](https://github.com/odoo/odoo) | **LGPL-3.0** (53.889 ⭐, el LICENSE lo dice explícito) | LGPL permite enlazar, no copiar módulos. Portar un módulo `purchase` crea obra derivada |
| [vuestorefront/vue-storefront](https://github.com/vuestorefront/vue-storefront) | **Sin LICENSE en la raíz**; la API de GitHub devuelve `null` y `/license` da 404. Último push 2026-06-09 | Licencia **NO VERIFICADA** ⇒ se trata como propietaria. Además está quieto hace 2 meses |

### Piezas chicas de npm (todas verificadas en el registry)

| Paquete | Licencia | Última versión | Para qué |
|---|---|---|---|
| `@zxing/library` | Apache-2.0 | 0.23.0 (2026-04-29) | Leer código de barras. Vivo |
| `dinero.js` | MIT | 2.0.2 (2026-03-13) | Plata en enteros: el reprecio con `Decimal` de Prisma + floats de JS es un bug esperando |
| `currency.js` | MIT | 2.0.4 (2025-08-11) | Alternativa más chica a dinero.js |
| `dexie` ([dexie/Dexie.js](https://github.com/dexie/Dexie.js)) | Apache-2.0 | 14.544 ⭐, push 2026-08-21 | IndexedDB para la caja offline. La opción liviana |
| `rxdb` ([pubkey/rxdb](https://github.com/pubkey/rxdb)) | Apache-2.0 (el repo; **hay plugins premium de pago — NO VERIFICADO cuáles**) | 23.360 ⭐, push 2026-08-22 | Replicación offline↔online ya resuelta. Verificar qué plugin es gratis antes de decidir |
| `quagga` | MIT | 0.12.1 (**2022** — muerto) | No usar |
| `html5-qrcode` | Apache-2.0 | 2.3.8 (**2023** — quieto) | Solo si se necesita cámara del celular |

**Lo barato primero:** un lector de código de barras USB **se comporta como un teclado**. No hace falta
`@zxing` ni cámara: un `keydown` listener que junta dígitos hasta el `Enter` resuelve el 90% del caso,
en ~30 líneas. `@zxing` solo si se escanea con la cámara del celular.

---

## C) Innovación que diferencia (anclada al dolor, no a la moda)

### 1. Reprecio por devaluación en un botón
**El problema:** el dueño compró en dólares a 6,96 y hoy repone a 11,37. Repreciar 800 SKUs a mano
es media semana; no repreciar es vender bajo costo sin enterarse.
**Qué hacer:** guardar el costo con su **moneda y su tipo de cambio del día de compra** (hoy no
existe: `grep tipoCambio|exchangeRate` en `lib`/`app` da **cero**). Con eso, una pantalla que dice
*"32 productos se venden por debajo del costo de reposición"*, con el precio nuevo ya calculado a
margen constante, y un botón "aplicar a los 32".
**Por qué nadie lo tiene:** Square, Shopify y Loyverse asumen moneda estable. Es una función que
solo tiene sentido en un país que devalúa, y por eso ninguno la construye.

### 2. El fiado como producto, no como tabla
**El problema:** el cuaderno de fiados es donde se muere la plata. ONIA ya tiene `fiados.ts`; lo que
falta es lo que hace que se cobre.
**Qué hacer:** (a) límite de crédito por cliente que la caja avisa **antes** de cerrar la venta;
(b) antigüedad del saldo (30/60/90 días) en el panel del día; (c) recordatorio por WhatsApp
redactado, que el dueño revisa y manda con un toque — nunca automático, la relación es del barrio.
**Nota honesta:** Loyverse **no documenta** control de deuda de cliente (búsqueda 2026-08-23, sus
docs cubren stock bajo y fidelidad, no fiado). Es un hueco real del líder gratuito.

### 3. Venta por WhatsApp que descuenta stock
**El problema:** el 80% de los pedidos entran por WhatsApp y terminan en un papel; el stock del
sistema y el del depósito no coinciden nunca.
**Qué hacer:** ONIA ya tiene Chatwoot y el editor de conocimiento del chatbot. El paso corto es
**el carrito compartible**: el dueño arma la venta en la caja y manda un link con el detalle y el
total; si el cliente confirma, la venta se cierra y descuenta stock. No hace falta que el bot
entienda lenguaje natural para resolver el problema.

### 4. La lista de compra que se arma sola
**El problema:** el dueño va al proveedor con un papel de memoria y vuelve sin la mitad.
**Qué hacer:** juntar `reorderPoint` (ya en el schema, sin usar) + velocidad de venta de las últimas
4 semanas + deuda al proveedor, en una lista agrupada **por proveedor**, lista para mandar por
WhatsApp. Es el patrón de grocy aplicado a una ferretería. Loyverse lo tiene solo como alerta por
email; agruparlo por proveedor y mandarlo por WhatsApp es la vuelta local.

### 5. El SIAT como puente, no como venta
Desde el 1-oct-2026 la facturación en línea es obligatoria. La regla de marca prohíbe vender
"obligatorio por ley" — pero sí se puede **enganchar sin fricción**: la compra ya guarda NIT y
número de factura para el RCV. Que el mismo dato sirva para emitir es diferencial contra cualquier
POS importado que no sabe qué es un RCV.

---

## D) Referencias visuales

Estado HTTP verificado el 2026-08-24 (`202` = pasa por challenge de Cloudflare pero el sitio existe).

| # | URL | Estado | Qué patrón concreto robar |
|---|---|---|---|
| 1 | https://loyverse.com/es · https://help.loyverse.com/help/low-stocks | 200 | El competidor a batir en este segmento (gratis + $29/mes). Su alerta de stock bajo es **una lista en el back office + un mail diario**, no una notificación intrusiva. Robar la mesura; superarlo agrupando por proveedor |
| 2 | https://squareup.com/us/en/point-of-sale | 200 | La grilla de productos en cuadros grandes con color por categoría: se cobra sin leer, mirando forma y color. Es el estándar de "caja de mostrador" |
| 3 | https://www.shopify.com/pos | 200 | Carrito lateral fijo con el total siempre visible y el botón de cobro ocupando el ancho completo abajo — pensado para el pulgar |
| 4 | https://dribbble.com/tags/pos | 202 | Volumen alto de conceptos de caja: sirve para el **layout** (dónde va el buscador, dónde el carrito), no para el color |
| 5 | https://dribbble.com/tags/inventory-management | 202 | Cómo se muestra un stock bajo sin que la pantalla parezca un tablero de errores: chip ámbar en la fila, no banner rojo arriba |
| 6 | https://www.behance.net/search/projects/pos%20app | 200 | Casos completos con flujo (venta → cobro → recibo), no pantallas sueltas |
| 7 | https://mobbin.com/browse/web/apps | 200 | Patrones de producto **real** en producción, no conceptos. Lo más útil para copiar un flujo de recepción de mercadería que ya funciona |
| 8 | https://godly.website | 200 | Solo para dirección visual de la superficie de venta, no del dashboard |
| 9 | https://www.alegra.com/bolivia/ | 200 | Competencia regional con presencia declarada en Bolivia: mirar cómo presenta la parte fiscal sin asustar |
| 10 | https://www.siigo.com | 200 | Competencia regional; mismo criterio |

**No verificados / caídos:** `land-book.com` → 403 (bloqueo de bots, el sitio existe);
`contabilium.com` → 403 (ídem); `bsale.com.bo` → **no resuelve** (código 000). El dominio boliviano
de Bsale que menciona el encargo **NO EXISTE o cambió**: NO VERIFICADO.
Mobbin y Land-book requieren cuenta para ver el detalle.

---

## Lo que yo haría primero

1. **Cablear lo que ya está escrito** (semana 1): pantalla de compras + proveedores sobre la API que
   ya existe, y la alerta de `reorderPoint` que nadie lee. Costo chico, desbloquea vender el add-on.
2. **Líneas en la compra** (semanas 2-3): portar el modelo de InvenTree (MIT). Es lo que cierra la
   cadena costo → precio y lo que hace real todo lo demás.
3. **Costo con moneda y tipo de cambio** + pantalla de reprecio. Es el único de la lista que ningún
   competidor internacional va a construir.
