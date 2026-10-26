# Qué se vende, con qué funciones, y a qué precio

**Una sola tabla para dejar de dar vueltas.** Cada cifra sale de su fuente y cada función se
verificó contra el código el **2026-08-24**.

> ⚠️ **Este doc NO es la fuente de los precios.** Las fuentes son
> `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts`
> (add-ons). Acá se transcriben para poder cruzarlos con las funciones. **Si un número de
> acá no coincide con la fuente, gana la fuente y este doc está roto.**

---

## 1. Los planes

Nombres de `PLAN_LABELS`. Montos de `DEFAULT_PLAN_AMOUNTS` — **es lo que valida el cobro**:
si una propuesta dice otro número, el pago se rechaza.

| Plan | Mensual | Anual (total) | Semanal | Clientes | Usuarios | Correos/mes |
|---|---|---|---|---|---|---|
| **Gratuito** | Bs 0 | — | — | 30 | 1 | 0 |
| **Básico** | **Bs 320** | Bs 3.200 | Bs 89 | 300 | 2 | 200 |
| **Profesional** | **Bs 750** | Bs 7.500 | Bs 199 | 1.500 | 5 | 800 |
| **Completo** | **Bs 1.500** | Bs 15.000 | — | ∞ | ∞ | ∞ |
| **Empresa** | **Bs 2.900** | Bs 29.000 | — | ∞ | ∞ | ∞ |

Empresa suma **implementación desde Bs 3.500**. Anual = 10 meses (2 gratis).
El semanal existe solo en Básico y Profesional, con prima: es la puerta para negocios de
caja diaria.

### Qué desbloquea cada escalón (de `PLAN_LIMITS`)

| Función | Gratuito | Básico | Profesional | Completo | Empresa |
|---|:---:|:---:|:---:|:---:|:---:|
| Inventario simple | ✓ | ✓ | ✓ | ✓ | ✓ |
| Exportar tus datos | ✗ | ✓ | ✓ | ✓ | ✓ |
| Reporte básico | ✗ | ✓ | ✓ | ✓ | ✓ |
| Reportes completos | ✗ | ✗ | ✓ | ✓ | ✓ |
| Facturas recurrentes | ✗ | ✗ | ✓ | ✓ | ✓ |
| Agenda pública | ✗ | ✗ | ✓ | ✓ | ✓ |
| Agentes de IA | ✗ | ✗ | ✓ | ✓ | ✓ |

**El salto que vende es Básico → Profesional.** Ahí entran reportes, agenda pública,
facturas recurrentes y agentes. Los de arriba solo levantan topes.

---

## 2. Los add-ons

| Add-on | Precio | Qué entrega | Estado real |
|---|---|---|---|
| **Chatbot WhatsApp con IA** | **Bs 390/mes** o Bs 3.900/año, **sin cargo inicial**. 500 conversaciones/mes incluidas; Meta cobra el consumo directo en la cuenta del cliente | contesta, califica, **deriva a una persona** y hace seguimiento 24/7 con aprobación humana (**no agenda solo**: un pedido de cita lo ESCALA — `bot/recepcionista.mjs`) | 🟢 motor vivo, Tech Provider con App Review aprobado. ⚠️ `knowledge.json` tiene **un solo hecho**: falta CONTENIDO, no código |
| **Agenda pública** | Bs 150/mes | link de reserva sin llamadas | 🟢 vivo — **incluida** en Profesional y Completo |
| **Usuario extra** | Bs 70/usuario/mes | asiento adicional (Básico admite hasta 3) | 🟢 vivo |
| ~~Inventario avanzado~~ | ⛔ **sin precio: no se cobra** | compras a crédito, proveedores, alertas de stock bajo, vencimientos por lote — **incluidas para todos** | ⛔ **RETIRADO de la oferta el 2026-08-27** — ver §4.3 |
| **Self-hosted** | desde Bs 4.500 inst. + Bs 900/mes | instalación en el servidor del cliente, con soporte, backups y monitoreo | ⚠️ NO VERIFICADO en cliente real |
| **Chatbot a medida** | se cotiza | integración con el sistema del cliente o flujos propios | por definición, a pedido |

---

## 3. Qué resuelve el sistema, en el idioma del cliente

Verificado: las 22 pantallas del panel **leen datos reales**. Ninguna es maqueta.

| Función | El problema que saca |
|---|---|
| Agenda + citas + recordatorios | *deja de anotar turnos en un cuaderno y de llamar uno por uno el día anterior* |
| Caja con carrito | *deja de cerrar el día contando billetes contra un cuaderno* |
| Fiados / por cobrar y por pagar | *deja de anotar "fía" en una libreta y de olvidarse a quién le fio* |
| Inventario | *deja de enterarse de que no hay stock con el cliente en el mostrador* |
| Lotes con vencimiento | *deja de descubrir el vencido cuando ya no se puede vender* |
| Costeo de importación | *deja de adivinar a cuánto sale el contenedor puesto en depósito* |
| **Reprecio por devaluación** | *deja de vender bajo costo cuando el dólar se movió* |
| Contabilidad Bolivia | *deja de armarle el registro de ventas al contador a mano* |
| Planilla | *deja de calcular el bono de antigüedad a mano* |
| Cotizaciones B2B | *deja de armar cada cotización en Excel con precios viejos* |

**Rubros vendibles hoy:** clínica dental y estética · comercio y ferretería · importadora
(acotada a cotizaciones B2B y costeo).

---

## 4. Lo que NO cierra, y hay que decidir

### 4.1 Completo y Empresa son el mismo producto
`PLAN_LIMITS` les da **límites idénticos**: los dos con clientes, usuarios y correos
ilimitados y todas las funciones encendidas. **Bs 1.400 de diferencia sin ninguna
diferencia funcional en el código.**

### 4.2 Empresa: la mitad operativa de su promesa ya existe, la fiscal no
Su mensaje de activación promete *"multi-sucursal, contabilidad avanzada, instancia
privada"*. Estado al **2026-08-25**, con el deploy `0fc7e39` en producción:

- **Varios depósitos: SÍ, vivo.** Se dan de alta desde `/comercio/inventario`, el stock
  y los lotes son por depósito, y hay **traspaso interno** entre ellos (el "pedido
  interno" que traba la venta en Bolivian Electric). El buscador de producto muestra el
  saldo **del depósito del que se saca**, no el total.
- **Sucursal FISCAL ante el SIN: NO.** No hay entidad de sucursal con su código, su punto
  de venta ni su CUF. Quedó afuera a propósito: el emisor SIAT todavía es mock, así que
  modelarla ahora obligaría a migrar datos vivos después.
- **contabilidad avanzada** es transversal (`COMMON_SEGMENTS`): la tienen todos los planes
- **instancia privada** es el add-on self-hosted, que se cobra aparte

⚠️ **Corregido 2026-08-25.** Acá decía "multi-sucursal NO EXISTE — `branchId` da cero
coincidencias". El grep era cierto y la conclusión falsa: `branchId` no existe, pero
`OniaCommerceWarehouse` sí, con el stock ya indexado por depósito desde el primer día.
Lo que faltaba era el cableado al producto, no el motor. **Un grep sirve para descartar,
nunca para confirmar** — y acá se usó al revés.

🟡 **Empresa se puede vender por sus depósitos, NO por sucursales fiscales.** Decir
"manejá tus sucursales ante Impuestos" sigue siendo prometer lo que no entregamos.

### 4.3 ✅ RESUELTO — el inventario avanzado cobraba por lo que ya es gratis
De las cuatro cosas que prometía: **compras a crédito, proveedores y alertas de stock bajo
ya funcionan para todos** — `/comercio/fiados` no tiene gate de plan ni de add-on, y
`addon.inventory_advanced` se calcula en `entitlements.ts:55` y **no lo lee ningún archivo**.
Los vencimientos por lote se cablearon el 2026-08-24 y sí son nuevos.
Eran dos salidas: gatear lo que ya existe, o dejar de cobrarlo.

**Sergio eligió la segunda el 2026-08-27: "no se cobra".** El add-on salió de la oferta y
nada se apagó — las cuatro funciones quedan encendidas y gratis para todos. La línea
"Inventario avanzado · Desde Bs 180/mes" se sacó de la portada y de `/precios`
(`web-factory/apps/onia-platform/src/lib/pricing.ts` → `ADDONS`), y el inventario pasó a
contarse donde corresponde: en el `incluye` del plan Básico, que Pro y Full heredan.
Guarda contra la vuelta: `scripts/venta-honestidad.test.mjs`.

### 4.4 La pasarela de pago está apagada en los cinco planes
`gatewayEnabled: false` en Gratuito, Básico, Profesional, Completo y Empresa. Nadie la
tiene. Si algo la necesita, hoy no funciona para ningún cliente.

### 4.5 No hay fuente para webs ni consultoría
`pricing.ts` y `subscription-plans.ts` cubren plataforma y add-ons. Las propuestas de web
(Bs 2.000 / 4.500 / 6.900 / 250 por mes en el generador) **no tienen contra qué medirse**.
No están mal — es que nadie puede verificarlas.

✅ **DECIDIDO 2026-08-24: la línea de webs y consultoría NO lleva lista de precios.** Se
cotiza caso por caso, porque el alcance cambia con cada cliente y una lista fija obliga a
estirar o a regalar. Detalle en `ONIA_WEB_COMO_SE_VENDE.md` §8.
🔴 **Nadie debe "corregir" un precio de web contra `pricing.ts`**: ese archivo no cubre esta
línea. Un barrido que las toque está rompiendo, no ordenando.

---

## 5. Cómo se arma la venta

**PLAN = rubro (1) + módulos encendidos (N) + add-ons (N).** Los cuatro planes son
combinaciones preconfiguradas de eso; un plan a medida no necesita código nuevo — se
enciende una capacidad para UNA organización desde `/admin/organizations/[id]/capacidades`.

### La escalera que yo usaría

1. **Entrada: Básico Bs 320/mes.** El negocio ordena lo suyo y ve su día. Sin agentes, sin
   agenda pública. Es barato de decir y barato de probar.
2. **El salto real: Profesional Bs 750/mes.** Es el único escalón con diferencia funcional
   de verdad. Todo el argumento de venta vive acá.
3. **Completo Bs 1.500** solo cuando los topes molestan de verdad — no como "el plan bueno".
4. **Empresa Bs 2.900: vendible por depósitos, no por sucursales fiscales.** La parte
   operativa (varios depósitos + traspaso interno) está viva desde el 2026-08-25; la
   sucursal ante el SIN no existe. Vender lo primero, callar lo segundo (§4.2).
5. **El chatbot Bs 390/mes se vende DESPUÉS del primer cierre**, sobre cualquier plan.
   Nunca en la primera conversación: duplica la superficie de promesa.

### Lo que no se promete

Emitir factura electrónica (el emisor es mock) · **sucursales fiscales ante el SIN**
(los depósitos sí, la sucursal tributaria no) · modo offline · visión por computadora · cualquier cifra de resultados de Onia (**cero clientes pagando**: prohibido
inventar testimonios, logos o porcentajes).

---

## Fuentes

- `onia-platform/lib/subscription-plans.ts` — `DEFAULT_PLAN_AMOUNTS` (valida el cobro)
- `onia-platform/lib/pricing.ts` — add-ons y `PLAN_LABELS`
- `onia-platform/lib/plan-limits.ts` — `PLAN_LIMITS` (qué desbloquea cada plan)
- `ONIA_CATALOGO_DE_VENTA.md` — qué existe por rubro
- `ONIA_PLAN_ORDENAMIENTO.md` — por qué había cuatro precios vivos y cómo se arregla
