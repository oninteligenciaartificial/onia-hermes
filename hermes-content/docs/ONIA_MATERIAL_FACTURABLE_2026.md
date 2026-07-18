# ONIA - Material facturable y quién vende qué 2026

Estado: mapa comercial para poner a facturar a los colaboradores.
Fecha: 2026-07-18.
Uso: qué se puede cobrar HOY, quién lo vende y cómo se paga cada motor. Regla de
colaboradores: `ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`. Nuvia:
`ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`. Servicios: `ONIA_VENDOR_MANUAL_2026.md`.

## Los 3 motores de caja

1. **Servicios / Software** — comisión % para el colaborador. El foco principal.
2. **Nuvia** — productos físicos (skincare) B2B; pago fijo por venta, NO comisión %.
3. **Media** (YT, Lucía) — activo de largo plazo; NO factura ahora → PAUSA.

Regla para no descarrilar: se vende SOLO lo que está listo. Marcado abajo.

## Motor 1 - Servicios / Software (comisión %)

| Oferta | Precio cliente | Gana colaborador | ¿Listo HOY? |
|---|---:|---:|---|
| DentalGest (SaaS clínicas) | Bs. 320-1.500/mes | 35% del 1er pago | ✅ LIVE |
| Landing de captación | Bs. 790 | 12% | ✅ |
| Web Profesional | Bs. 1.500 | 12% | ✅ |
| Web Pro ONIA | Bs. 2.900 | 12% | ✅ |
| Auditoría express | Bs. 250 | 10% | ✅ |
| Diagnóstico + plan | Bs. 690 | 10% | ✅ |
| Automatización n8n | Bs. 790-1.200 | 10% | ✅ |
| Cuidado web mensual | Bs. 190-690/mes | 10% (1er mes) | ✅ |
| GestiOS (SaaS pymes) | Bs. 350-1.250/mes | 35% del 1er pago | ⚠️ AÚN NO — solo demo/lista de espera |

Entrada de caja rápida y fácil de cerrar: **auditoría Bs. 250 y landing Bs. 790**.
Recurrente que vale oro: **DentalGest**.

## Motor 2 - Nuvia (productos físicos, B2B)

**Qué es:** skincare, 315 productos en catálogo. Categorías por peso de margen:

| Categoría | Productos | Ganancia objetivo prom. |
|---|---:|---|
| Antiedad | 98 | fuerte (>Bs. 150) |
| Protección solar | 67 | fuerte |
| Limpieza facial | 35 | media |
| Hidratación | 28 | media |
| Cabello y uñas | 22 | media |

Venta promedio Bs. 236, margen objetivo promedio ~Bs. 173. **Se opera por producto
validado / lote, NO todo el catálogo** (el catálogo sirve de demanda asistida).

**A quién (B2B):** negocios de belleza y salud que compran para usar o revender —
spas, salones, esteticistas, dermatólogos, farmacias, tiendas de cosméticos.

**Cómo se paga al colaborador (DISTINTO de servicios):** Nuvia bootstrap NO paga
comisión porcentual de utilidad (regla del modelo Nuvia). Se paga una **comisión de
venta FIJA, preaprobada, tratada como costo directo de la campaña**, y solo si:
- el margen real del producto es > Bs. 100 (productos fuertes: antiedad, solar);
- hay CRM completo y cobro real;
- no reduce la caja chica ni la Reserva Nuvia.

Recomendación (ajustable por Sergio): **12% del precio cobrado** por venta B2B
Nuvia, como costo directo. Ej.: venta Bs. 236 → Bs. 28 al colaborador. En pedidos
mayoristas (varios productos), preaprobar el monto antes de cerrar.

Registro: Nuvia es **centro contable separado** (`nuvia_closures`), no se mezcla con
las comisiones de servicios. El colaborador registra la venta en el panel; se
liquida en el cierre de Nuvia por lote/campaña.

## Motor 3 - Media (PAUSA)

Canales YT y Lucía. No factura ahora. Los colaboradores NO trabajan esto.

## Qué vende cada colaborador

| Colaborador | Servicios | Nuvia | A quién |
|---|---|---|---|
| **1 - salud/estética** | DentalGest, webs, auditorías | skincare (foco fuerte) | clínicas, consultorios, spas, esteticistas, dermatólogos, farmacias |
| **2 - comercio/pymes** | webs, automatizaciones, auditorías | skincare a beauty retail | tiendas, distribuidoras, comercios, tiendas de cosméticos |

Sinergia clave: el colaborador 1 le vende al MISMO cliente software (DentalGest) y
producto (Nuvia) — doble ticket por cuenta de belleza/salud.

## Foco para empezar a facturar YA

1. Auditoría Bs. 250 + landing Bs. 790 (servicios, cierre fácil, generan caso).
2. DentalGest (recurrente, live).
3. Nuvia productos fuertes (antiedad, solar) a negocios de belleza en su territorio.

NO empujar todavía: GestiOS (no listo), Media. No dispersar a los chicos en lo que
no está listo o no da caja.
