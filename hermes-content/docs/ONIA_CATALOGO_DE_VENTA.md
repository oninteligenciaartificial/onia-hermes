# Catálogo de venta de Onia

**Qué se vende, en qué estado está, y con qué se arma un plan.**

> Este archivo dice **QUÉ existe**. Los **PRECIOS** están en un solo lugar:
> `onia-platform/lib/pricing.ts`. Acá no se escribe ni un número de precio — si aparece
> uno, está roto. Un tema, un archivo, sin fecha en el nombre: esto se EDITA, no se
> reemplaza por una copia nueva.

Verificado contra el código y la base de producción el 2026-08-15.

> **Este archivo cubre la PLATAFORMA (rubros, módulos, add-ons).** Las **páginas web** son
> otra línea y tienen su propio doc: `ONIA_WEB_COMO_SE_VENDE.md` — qué se vende, el proceso,
> el plazo, cómo se compra y el precio con su fuente. No se duplica acá.

---

## Los tres estados (leer esto antes que nada)

La única razón por la que este archivo sirve es que separa lo que se puede vender de lo
que solo existe. Construido no es terminado.

| Estado | Significa | Se puede vender |
|---|---|---|
| 🟢 **Vivo** | tiene tablas, pantallas y está probado en producción | sí |
| 🟡 **Construido, sin probar** | tiene tablas y pantallas, pero nadie lo uso con datos reales | **no prometer** — se muestra como demo |
| ⚪ **Futuro** | existe en el core o en el plan, no en el producto | no se nombra al cliente |

Al 2026-08-15 la base de producción tiene **0 organizaciones**: todo lo 🟡 está sin
estrenar por definición. Se pasa a 🟢 cuando un cliente real lo usa y se verifica
mirándolo.

---

## 1. Lo que se vende, en una frase

**Una plataforma, un rubro, y add-ons encima.**

El cliente no compra "módulos": elige su rubro y el sistema se arma solo con el
vocabulario, las pantallas y los agentes de ese rubro. Los add-ons son lo que se suma
después del primer cierre.

---

## 2. Rubros

Siete declarados en el código (`SUPPORTED_VERTICAL_TRACK_IDS`), **cinco contratables hoy**.

| Rubro | Track | Estado |
|---|---|---|
| Clínica dental | `dentagest-clinical` | 🟢 el único con recorrido real |
| Comercio / tienda | `gestios-general` | 🟡 |
| Importadora / distribuidora | `proveegest-electrico` | 🟡 |
| Estética y spa | `esteticagest-clinical` | 🟡 |
| Servicios profesionales | `gestios-servicios-profesionales` | 🟡 **y el asistente `/empezar` le dice al cliente "en construcción" mientras el registro se lo vende** — contradicción a resolver |
| Veterinaria | `vetgest-clinical` | ⛔ **cerrada por decisión** (2026-08-15). Anotada para retomar |
| Ganadería | `ganadero-offline` | ⛔ cerrada. El nombre promete modo offline **que no existe** |

**Regla:** un rubro nuevo se ENCIENDE desde el core, no se escribe de cero. El core ya
declara 11 tracks; el producto usa 7.

---

## 3. Capacidades del núcleo

El core declara **21 capacidades**. Son los ladrillos: un rubro es una combinación de
estas, no código nuevo.

`tenant` · `team_roles` · `relationships` · `work_items` · `evidence_activity` ·
`alerts_reports` · `data_ops` · `partners` · `permissions` · `collaboration` ·
`approvals` · `scheduling` · `saved_reporting` · `channels` · `catalog_inventory` ·
`sales_cash` · `quotes_b2b` · `knowledge_base` · `whatsapp` · `tr4_adapter` · `siat`

---

## 4. Módulos del producto

Lo que tiene pantalla propia hoy. **Corrección importante:** hasta el 2026-08-15 estos
módulos tenían pantallas pero **ninguna tabla en producción** — 47 de 70 tablas no
existían. Ese día se aplicaron las migraciones. Ahora tienen las dos cosas; falta que
alguien los use.

| Módulo | Pantalla | Tablas | Estado |
|---|---|---|---|
| Agenda y citas | `/agenda`, `/appointments` | sí | 🟢 |
| Clientes / pacientes | `/patients` | sí | 🟢 |
| Servicios / tratamientos | `/treatments` | sí | 🟢 |
| Inventario simple | `/inventory` | sí | 🟢 |
| Cobros y facturación | `/billing` | sí | 🟡 fiscal en trámite (ver §7) |
| Comercio (catálogo, caja, fiados, importar) | `/comercio/**` | sí desde hoy | 🟡 |
| Importadora (costeo, cotizaciones B2B) | `/importadora` | sí desde hoy | 🟡 |
| Contabilidad | `/contabilidad`, `/accounting` | sí desde hoy | 🟡 |
| RRHH / planillas | `/rrhh` | sí desde hoy | 🟡 |
| Empresa (gastos, comisiones, colaboradores) | `/empresa` | sí desde hoy | 🟡 |
| Agentes de IA | `/agents` | sí desde hoy | 🟡 el cron existe y corre |
| Comunicaciones | `/communications` | sí | 🟡 |
| Reportes | `/reports` | sí | 🟡 |
| Operaciones | `/operations` | sí | 🟡 |

---

## 5. Add-ons

Se venden **después del primer cierre**, sobre cualquier plan. Precios: `lib/pricing.ts`.

| Add-on | Qué hace | Estado |
|---|---|---|
| **Chatbot WhatsApp con IA** | contesta, califica, agenda y hace seguimiento 24/7 con aprobación humana | 🟡 gateado por Meta |
| **Chatbot a medida** | integración con el sistema del cliente o flujos propios. **Sin precio de lista**: se define el alcance y recién ahí se cotiza | por definición, a pedido |
| Agenda pública | link de reserva sin llamadas | 🟢 |
| Usuario extra | asiento adicional | 🟢 |
| Inventario avanzado | compras, proveedores, vencimientos, alertas | 🟡 |
| Self-hosted | instalación en servidor del cliente | 🟡 |

**Servicios que no son software:**

- **Auditoría por Zoom, 30 min: GRATIS.** Es gancho, no producto.
- **Consultoría personalizada:** se cobra. Precio caso por caso — **no hay tarifa de
  lista y no se improvisa una**.

---

## 6. Cómo se arma un plan

Un plan es una combinación de tres cosas, y solo tres:

```
PLAN = rubro (1) + módulos encendidos (N) + add-ons (N)
```

Los planes estándar (`basic` · `professional` · `clinic` · `enterprise`, que el cliente
lee como **Básico · Profesional · Completo · Empresa**) son combinaciones preconfiguradas
de eso. Las CLAVES no se tocan: viven en la base.

### Planes personalizados

Es la misma máquina, no una excepción: se enciende una capacidad para UNA organización
sin cambiar su plan. Ya existe el mecanismo —`organizationEntitlement`, con su pantalla
en `/admin/organizations/[id]/capacidades`— así que un plan a medida **no requiere
código nuevo**.

⚠️ La pantalla marca las capacidades que todavía **no tienen consumidor en el código**
("Sin efecto todavía"). Encender una de esas no hace nada: mirarlo antes de prometer.

---

## 7. Lo que NO se puede prometer todavía

Esto es lo que evita vender algo que después no se entrega.

- **Emitir factura electrónica.** El SIAT está en trámite. Se dice "en trámite", nunca
  "no disponible" y nunca "obligatorio por ley" — el SIN tiene portal gratis y decir lo
  contrario es mentir. Ver qué falta exactamente en el pendiente de facturación.
- **Multi-sede / sucursales.** El one-pager lo vendía; **el schema no tiene `branchId`**.
  Se está construyendo por decisión del 2026-08-15.
- **Modo offline.** El rubro ganadero lo promete en el nombre y no existe.
- **Visión por computadora.** Evaluada el 2026-08-15: hay caso, **no hay producto**.
  Sin dataset propio y sin medir en obra real, cualquier precisión prometida es
  inventada. No se vende.
- **Cualquier cifra de resultados de Onia.** Cero clientes pagando. Prohibido inventar
  testimonios, logos o porcentajes.

---

## 8. Lo que hay que verificar antes de vender cada 🟡

No es una lista de deseos, es el trabajo pendiente:

1. Recorrer cada módulo 🟡 con datos reales y **mirarlo renderizado**.
2. Confirmar que el asistente `/empezar` y el registro dicen lo mismo de cada rubro.
3. Revisar qué capacidades de `/admin/.../capacidades` no tienen consumidor.
4. Cerrar el pendiente fiscal para poder facturar.

Ver `CLAUDE.md` (regla de una sola fuente de verdad) · `onia-core/contract.json` ·
`onia-platform/lib/pricing.ts`.
