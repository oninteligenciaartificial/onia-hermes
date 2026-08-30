# Catálogo de venta de Onia

**Qué se vende, en qué estado está, y con qué se arma un plan.**

> Este archivo dice **QUÉ existe**. Los **PRECIOS** viven en otro lado y en **dos** archivos,
> cada uno sobre lo suyo: los **planes** en `onia-platform/lib/subscription-plans.ts`
> (`DEFAULT_PLAN_AMOUNTS`, que es el que valida el pago) y los **add-ons** en
> `onia-platform/lib/pricing.ts`. Acá no se escribe ni un número de precio — si aparece
> uno, está roto. Un tema, un archivo, sin fecha en el nombre: esto se EDITA, no se
> reemplaza por una copia nueva.

**Verificado el 2026-08-23.** Contra el **código** (`onia-platform`, rama `master`): rubros,
nav por rubro, lista blanca de rutas, entitlements, crons y pantallas del panel. Contra
**producción** (`/opt/onia-platform/app.env` en el VPS): los flags encendidos y los ausentes.

> **Este archivo cubre la PLATAFORMA (rubros, módulos, add-ons).** Las **páginas web** son
> otra línea y tienen su propio doc: `ONIA_WEB_COMO_SE_VENDE.md` — qué se vende, el proceso,
> el plazo, cómo se compra y el precio con su fuente. No se duplica acá.

---

## Los tres estados (leer esto antes que nada)

La única razón por la que este archivo sirve es que separa lo que se puede vender de lo
que solo existe. Construido no es terminado.

| Estado | Significa | Se puede vender |
|---|---|---|
| 🟢 **Vivo** | tiene tablas, pantallas y **un cliente real lo usó** | sí |
| 🟡 **Sin estrenar** | tiene tablas y pantallas **completas y leyendo datos reales**, pero nadie lo usó con un cliente | sí, mostrándolo — **no se promete "probado"** |
| ⚪ **Futuro** | existe en el core o en el plan, no en el producto | no se nombra al cliente |
| ⛔ **Bloqueado** | hay un impedimento concreto en el código o el schema | no se ofrece |

**🟡 no significa "a medias".** Esto cambió el 2026-08-23: se auditaron todas las pantallas
del panel y **ninguna es maqueta** — todas leen datos reales de la base (Prisma en el
server component, o el API vía cliente). Lo que le falta a un 🟡 es **kilometraje**, no
código. La base de producción sigue con 0 organizaciones de cliente, así que 🟡 es el
estado por defecto de casi todo, y se pasa a 🟢 cuando alguien real lo usa y se verifica
mirándolo.

---

## 1. Lo que se vende, en una frase

**Una plataforma, un rubro, y add-ons encima.**

El cliente no compra "módulos": elige su rubro y el sistema se arma solo con el
vocabulario, las pantallas y los agentes de ese rubro. Los add-ons son lo que se suma
después del primer cierre.

---

## 2. Rubros

El código declara siete tracks (`SUPPORTED_VERTICAL_TRACK_IDS`) y ofrece cinco en el
formulario de acceso (`lib/platform/rubros-activos.ts`). **Desde el 2026-08-30 los CINCO
ofrecidos se pueden vender**: el que faltaba (servicios profesionales) se destrabó y el
formulario y el producto vuelven a decir lo mismo. Antes acá decía "el corte real es de
TRES" — quedó viejo y le sacaba un rubro a la venta sin motivo.

| Rubro | Track | Se vende hoy |
|---|---|---|
| Clínica dental | `dentagest-clinical` | ✅ **sí** — el único con recorrido real |
| Estética y spa | `esteticagest-clinical` | ✅ **sí** — es la MISMA nav dental con el vocabulario cambiado (`navClinicaDe`), no un rubro aparte. Calza porque la clienta es una persona con CI y es quien recibe la factura |
| Comercio / ferretería / tienda | `gestios-general` | ✅ **sí** — catálogo, inventario, caja, fiados |
| Importadora / distribuidora | `proveegest-electrico` | ⚠️ **sí, ACOTADO** — se venden **cotizaciones B2B + costeo de importación**, y nada más del rubro. Fuera de eso no hay pantallas propias |
| Servicios profesionales | `gestios-servicios-profesionales` | ✅ **sí — arreglado y verificado el 2026-08-30.** Acá decía "NO, en arreglo": quedó viejo y **costaba un rubro entero**. El arreglo ya está en `master` y **no fue abrirle `/patients`** (eso le daría la ficha clínica —`medical-alerts`, `records`— a un estudio contable, con sus APIs devolviendo 403): es **alta inline del cliente en el propio modal de nueva cita**, contra `/api/patients`, que sí es suya (`CON_AGENDA`). Verificado en `app/(dashboard)/appointments/page.tsx:129-143` y con tres guards en `page.test.ts` |
| Veterinaria | `vetgest-clinical` | ⛔ **NO todavía — pero es MÁS BARATO de lo que decía acá.** El bloqueo es real: la factura toma el CI del paciente (`lib/fiscal/rcv-export.ts:148`, `invoice.patient?.ci` → `nitCliente`), y en una veterinaria el paciente es el animal. **Lo que era falso es el costo:** esto NO es "migrar datos vivos". Es agregar columnas **anulables** de responsable a `Patient` y una lectura con fallback (`responsable?.ci ?? patient.ci`), así que **las filas que ya existen siguen funcionando sin backfill**. Cotizado el 2026-08-30 — ver el detalle en `COLA.md` |
| Ganadería | `ganadero-offline` | ⛔ **NO.** El track está encendido y las orgs que ya existen siguen andando, pero no hay entidades de hacienda ni sanidad: es el catálogo de comercio con otro nombre. Además el nombre promete **modo offline que no existe** |

**Regla:** un rubro nuevo se ENCIENDE desde el core, no se escribe de cero. El core declara
11 tracks; el producto usa 7; se venden 3.

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

Lo que tiene pantalla propia hoy. **Las tablas existen** (se aplicaron las migraciones el
2026-08-15) y **las pantallas leen esas tablas**: ninguna es maqueta. Lo que separa 🟢 de
🟡 acá es haber sido usado por un cliente, no estar completo.

| Módulo | Pantalla | Lee datos reales | Estado |
|---|---|---|---|
| Agenda y citas | `/agenda`, `/appointments` | sí | 🟢 |
| Clientes / pacientes | `/patients` | sí | 🟢 |
| Servicios / tratamientos | `/treatments` | sí | 🟢 |
| Inventario simple | `/inventory` | sí | 🟢 |
| Cobros y facturación | `/billing` | sí | 🟡 fiscal en trámite (ver §7) |
| Comercio (catálogo, caja, fiados, importar) | `/comercio/**` | sí | 🟡 |
| Importadora (costeo, cotizaciones B2B) | `/importadora/cotizaciones` | sí | 🟡 |
| Contabilidad | `/contabilidad`, `/accounting` | sí | 🟡 |
| RRHH / planillas | `/rrhh` | sí | 🟡 |
| Empresa (gastos, comisiones, colaboradores) | `/empresa` | sí | 🟡 |
| Agentes de IA | `/agents` | sí | 🟡 **no corren solos** — ver §7 |
| Comunicaciones | `/communications` | sí | 🟡 |
| Reportes | `/reports` | sí | 🟡 |
| Operaciones | `/operations` | sí | 🟡 |
| Requerimientos al cliente | `/requerimientos` | sí | 🟡 **pantalla huérfana** — ver abajo |

⚠️ **`/requerimientos` no está enlazada desde ningún lado.** Existe, tiene su portal
público con token, sus endpoints y sus e2e propios, y está en la lista de segmentos
comunes a todos los rubros — pero **cero `href` en todo el repo**: no figura en ninguna nav
ni en ninguna acción rápida. Solo se llega tipeando la URL. Sirve para una demo guiada; no
se le puede decir a un cliente "entrá y la ves".

---

## 5. Add-ons

Se venden **después del primer cierre**, sobre cualquier plan. Precios: `lib/pricing.ts`.

| Add-on | Qué hace | Estado |
|---|---|---|
| **Chatbot WhatsApp con IA** | contesta, califica, agenda y hace seguimiento 24/7 con aprobación humana | 🟡 gateado por Meta |
| **Chatbot a medida** | integración con el sistema del cliente o flujos propios. **Sin precio de lista**: se define el alcance y recién ahí se cotiza | por definición, a pedido |
| Agenda pública | link de reserva sin llamadas | 🟢 |
| Usuario extra | asiento adicional | 🟢 |
| ~~Inventario avanzado~~ | — | ⛔ **RETIRADO de la oferta (Sergio, 2026-08-27: "no se cobra").** Las funciones NO se quitaron: compras a crédito, proveedores, alertas de stock bajo y vencimientos por lote siguen disponibles **para todos, gratis**. Lo que se quitó es el cobro — cobrar Bs 180 por lo que el cliente ya tiene es una promesa que no sobrevive a la primera pregunta. Ver el bloque de decisión en `lib/pricing.ts:120` |
| Self-hosted | instalación en servidor del cliente | 🟡 |

⚠️ **Las tres claves de add-on siguen sin lector — revisado una por una el 2026-08-30.**
Ningún archivo de `app/` o `components/` consulta `addon.inventory_advanced`,
`addon.chatbot` ni `addon.web`; el único ítem de nav gateado por feature es `/agents`
(`module.agents`). Pero **no es el mismo problema en las tres**:

| Clave | Qué pasa de verdad | Qué corresponde |
|---|---|---|
| `addon.inventory_advanced` | **Ya resuelto.** El add-on se retiró de la oferta el 2026-08-27. Que la clave no la lea nadie es ahora lo correcto, no un bug | nada — cerrado |
| `addon.chatbot` | 🔴 **Este sí cuesta plata.** El chatbot **se cobra** (Bs 390/mes) y su bandeja `/inbox` **está en el nav de TODOS los packs sin ningún gate** desde el 2026-08-30. El que no lo paga ve la misma pantalla que el que sí | gatear `/inbox` con `requiresFeature: "addon.chatbot"`, y derivar la clave en `entitlements.ts` (hoy ni siquiera se calcula) |
| `addon.web` | La web del cliente la entrega **web-factory**, otro repo, y no tiene ni debería tener pantalla en la plataforma | sacar la clave del catálogo, o dejarla documentada como decorativa |

**Servicios que no son software:**

- **Auditoría por Zoom, 30 min: GRATIS.** Es gancho, no producto.
- **Consultoría personalizada:** se cobra. Precio caso por caso — **no hay tarifa de
  lista y no se improvisa una**.

---

## 6. Cómo se da de alta un cliente

**El alta automática está CERRADA.** Esto no es un detalle de implementación: cambia el
guion de venta entero.

```
solicitud en /register  →  fila en access_requests  →  alguien de Onia contacta
                        →  alta manual y configuración del rubro  →  el cliente entra
```

- `/register` **no crea cuentas**. Es un Server Component que bifurca según
  `altaAutomaticaAbierta()` (`lib/registration.ts`), y **el default es cerrado**: muestra un
  formulario de pedido de acceso (seis campos, sin contraseña) y graba un `AccessRequest`.
  La solicitud se trabaja a mano desde `/admin/solicitudes`.
- El encuadre al cliente es **positivo y verdadero**, nunca una disculpa: cada cuenta se
  activa con la configuración del rubro puesta y alguien que la explica. **Prohibida
  cualquier palabra de obra** ("todavía no", "en construcción", "beta").
- El rubro se elige **en la solicitud**, y la lista que se ofrece sale de un solo lugar
  (`lib/platform/rubros-activos.ts`), validada también en el servidor. La pantalla y el
  endpoint no pueden desincronizarse.
- La atribución viaja: el `?src=` de la campaña llega hasta la fila del interesado.
- **Reabrir el alta es UN cambio, no un rebuild:** `ONIA_ALTA_AUTOMATICA=abierta` en el
  env del contenedor y recrearlo. Nada de código.

### Qué compone un plan

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

⚠️ **Capacidades que se pueden encender y NO hacen nada** (cero referencias en `app/`,
`lib/` y `components/` — solo aparecen en el catálogo de claves y en tests):

- `module.accounting`
- `module.payroll`
- `module.commerce`
- `addon.inventory_advanced`, `addon.chatbot`, `addon.web` (ver §5)

Las pantallas de contabilidad, planilla y comercio **existen y funcionan**: llegan por el
nav de su pack y por la lista de segmentos comunes, no por esas claves. Encender la clave
no agrega ni quita nada. Mirarlo antes de prometer.

---

## 7. Lo que NO se puede prometer todavía

Esto es lo que evita vender algo que después no se entrega.

- **Emitir factura electrónica.** El SIAT está en trámite, y **producción lo confirma**:
  al 2026-08-23 `app.env` **no tiene `SIAT_EMISSION`**, y el emisor solo se enciende con
  el valor exacto `1` — así que hoy el emisor fiscal es **mock**. Se dice "en trámite",
  nunca "no disponible" y nunca "obligatorio por ley" — el SIN tiene portal gratis y decir
  lo contrario es mentir.
- **Multi-sede / sucursales.** **No existe y no se está construyendo.** `branchId` da
  **cero** coincidencias en todo el repo. Lo único parecido es `branchCode String?` en
  `prisma/schema.prisma:1533`, que es un **campo fiscal** de `OniaInvoicingInvoice` (el
  código de sucursal que pide el SIAT), no una sucursal del producto. La versión anterior
  de este catálogo decía "se está construyendo por decisión del 2026-08-15": era falso —
  ocho días después no hay una línea. Si un cliente lo necesita, es desarrollo a cotizar,
  no una casilla por encender.
- ⚠️ **Corregido 2026-08-30 — los agentes SÍ corren solos.** Acá decía que "nadie los
  dispara automáticamente" porque se miró `vercel.json`. **Se miró el sistema equivocado:
  la plataforma la sirve un contenedor del VPS, no Vercel, así que los crons de
  `vercel.json` no son los que mandan.** El disparador real es el **crontab del host**:
  `0 11 * * * /root/bin/run-onia-agents-cron.sh` (07:00 La Paz), y
  `/var/log/onia-agents-cron.log` muestra **14 días seguidos de `http=200`**, con un solo
  fallo (un 524 el 24-ago). Lo mismo el drip del trial (`0 13 * * *`). Se puede vender
  "corren todos los días sin que hagas nada" — es cierto y estaba escrito al revés.
  **Lo que sí falta**: todas las corridas dan `proposed: 0` porque no hay datos de cliente
  todavía, y el agente **`captador` nunca se enciende** (`kind_not_enabled` en todas las
  orgs, todos los días). Recall y cobrador corren; el que trae clientes no.
- **Modo offline.** El rubro ganadero lo promete en el nombre y no existe.
- **Visión por computadora.** Evaluada el 2026-08-15: hay caso, **no hay producto**.
  Sin dataset propio y sin medir en obra real, cualquier precisión prometida es
  inventada. No se vende.
- **Cualquier cifra de resultados de Onia.** Cero clientes pagando. Prohibido inventar
  testimonios, logos o porcentajes.

**Lo que SÍ está encendido en producción** (`/opt/onia-platform/app.env`, 2026-08-23):
`PLATFORM_LAYER=1` (capa de packs, entitlements y aislamiento de rutas por rubro) y
`AGENTS_RUNTIME=1`.

---

## 8. Lo que hay que cerrar

No es una lista de deseos, es el trabajo pendiente, en orden:

1. **Terminar el arreglo de servicios profesionales** (`/patients` en su nav) — es lo
   único que separa a ese rubro de ser vendible.
2. **Cerrar la revisión de los add-ons sin consumidor** (`addon.inventory_advanced`,
   `addon.chatbot`, `addon.web`): o los consume algo, o salen del catálogo.
3. **Decidir qué hacer con `/requerimientos`:** enlazarla desde el nav, o dejar de
   contarla como módulo.
4. Recorrer cada módulo 🟡 con datos reales y **mirarlo renderizado**.
5. Cerrar el pendiente fiscal (`SIAT_EMISSION`) para poder facturar de verdad.
6. Decidir si los agentes se agendan (cron propio) o se venden como disparo manual.

Ver `CLAUDE.md` (regla de una sola fuente de verdad) · `onia-core/contract.json` ·
`onia-platform/lib/pricing.ts` · `onia-platform/lib/subscription-plans.ts`.
