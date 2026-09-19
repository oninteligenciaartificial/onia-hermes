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
| Servicios profesionales | `gestios-servicios-profesionales` | ✅ **sí — arreglado el 2026-08-30, ampliado el 2026-09-04.** Acá decía "NO, en arreglo": quedó viejo y **costaba un rubro entero**. El primer arreglo fue **alta inline del cliente en el propio modal de nueva cita**, contra `/api/patients`, que sí es suya (`CON_AGENDA`). Verificado en `app/(dashboard)/appointments/page.tsx:129-143` y con tres guards en `page.test.ts`. ⚠️ **Acá decía además «y no fue abrirle `/patients`» — vencido el 2026-09-04: sí se le abrió**, y las dos objeciones que esta misma celda nombraba están resueltas. La ficha esconde alertas médicas, alergias, tipo de sangre, historia clínica y tratamientos cuando el pack no es clínico (`fichaClinica()` en `lib/platform/vertical-pack.ts`, **derivada** de si el nav declara `/treatments` — no es una lista que haya que mantener a mano), y **no hay 403** porque el segmento `patients/*` entero pasó a `CON_AGENDA` en `lib/platform/api-route-registry.ts`. El alta inline SE QUEDA: agendar sin salir del modal sigue siendo el camino corto. Recontado el 2026-09-05, ver §8.1 |
| Veterinaria | `vetgest-clinical` | ⛔ **NO todavía — pero es MÁS BARATO de lo que decía acá.** El bloqueo es real: la factura toma el CI del paciente (`lib/fiscal/rcv-export.ts:148`, `invoice.patient?.ci` → `nitCliente`), y en una veterinaria el paciente es el animal. **Lo que era falso es el costo:** esto NO es "migrar datos vivos". Es agregar columnas **anulables** de responsable a `Patient` y una lectura con fallback (`responsable?.ci ?? patient.ci`), así que **las filas que ya existen siguen funcionando sin backfill**. Cotizado el 2026-08-30 — ver el detalle en `COLA.md` |
| Ganadería | `ganadero-offline` | ⛔ **NO.** El track está encendido y las orgs que ya existen siguen andando, pero no hay entidades de hacienda ni sanidad: es el catálogo de comercio con otro nombre. Además el nombre promete **modo offline que no existe** |

**Regla:** un rubro nuevo se ENCIENDE desde el core, no se escribe de cero. El core declara
11 tracks; el producto usa 7; se venden **5**.

⚠️ **Acá decía "se venden 3" — corregido 2026-09-03.** Es el mismo número viejo que la nota
de arriba (§2) ya había corregido el 30-ago en la prosa y en la tabla: el barrido arregló
las dos superficies visibles y se olvidó de esta línea de resumen. Quedó un archivo que se
contradice a sí mismo a 15 líneas de distancia, y **la línea de resumen es la que se lee
cuando se busca el número**, así que mandaba al revés y le sacaba DOS rubros a la venta.
Contado en vivo contra `origin/master`, no de memoria: `lib/platform/rubros-activos.ts`
tiene 5 entradas en `RUBROS_ACTIVOS` (dental, comercio, importadora, estética, servicios
profesionales), `SUPPORTED_VERTICAL_TRACK_IDS` en `lib/platform/types.ts` tiene 7 y
`onia-core/contract.json` declara 11 tracks y 21 capacidades — esos tres sí estaban bien.

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
| Contabilidad | `/contabilidad` | sí | 🟡 |
| RRHH / planillas | `/rrhh` | sí | 🟡 |
| Empresa (gastos, comisiones, colaboradores) | `/empresa` | sí | 🟡 |
| Agentes de IA | `/agents` | sí | 🟡 corren solos, una vez al día — ver §7 |
| Comunicaciones | `/communications` | sí | 🟡 |
| Reportes | `/reports` | sí | 🟡 |
| Requerimientos al cliente | `/requerimientos` | sí | 🟡 |

⚠️ **Corregido 2026-09-06 — esta tabla vendía un módulo que no existe y subvendía uno que
sí funciona.** Los cuatro errores, medidos contra el árbol de rutas del producto y no contra
un doc:

- **«Operaciones» no es un módulo: se quitó la fila.** `app/(dashboard)/operations` **no
  existe**, `next.config.ts:80` redirige `/operations` → `/dashboard`, y no aparece ni en
  `route-access.ts` ni en `vertical-pack.ts`. (Lo único llamado `operaciones` en el código es
  un **rol** de `vertical-pack.ts:237`, no una pantalla.) La redirección es justo lo que lo
  hizo sobrevivir: quien tipeaba la URL no veía un 404, veía el panel.
- **`/accounting` tampoco existe** — `next.config.ts:81` la manda a `/contabilidad`, que es la
  pantalla viva. Se quita de la celda para que nadie la enlace.
- **Los agentes SÍ corren solos.** La fila decía «no corren solos — ver §7» y **§7 dice lo
  contrario desde el 2026-08-30**: cron del host `0 11 * * *`, 14 días de `http=200`. La
  corrección se aplicó a §7 y no viajó a esta tabla, así que durante días el catálogo mandaba
  a leer la sección que lo desmiente — subvendiendo una capacidad real.
- **`/requerimientos` ya no es huérfana.** Acá decía «cero `href` en todo el repo»: hoy está en
  `components/layout/navigation.ts:100` (grupo Automatización) y la tienen los **siete** packs.
  Se le puede decir a un cliente "entrá y la ves".

Lo sostiene un gate, para que la tabla no se vuelva a despegar del producto —
cruza cada ruta declarada contra `app/(dashboard)/` y exige que §4 no contradiga a §7:

    node scripts/catalogo_modulos_vivos.mjs

---

## 5. Add-ons

Se venden **después del primer cierre**, sobre cualquier plan. Precios: `lib/pricing.ts`.

| Add-on | Qué hace | Estado |
|---|---|---|
| **Chatbot con IA (web + WhatsApp)** | asistente 24/7 que contesta, califica, **deriva a un humano** y hace seguimiento (un pedido de cita lo ESCALA a una persona — `deploy/vps-ops/bot/recepcionista.mjs`); el dueño lo edita CONVERSANDO, ve su guion en pasos, atiende desde la bandeja propia (el bot se aparta cuando contesta él), entiende FOTOS y audios; IA incluida y atiende 500 conversaciones al mes — las que pasan ese cupo van a una persona del equipo, y se suman de a 200 con una recarga que vence con el mes (cupo y recarga salen de `pricing.ts`, los aplica `lib/chatbot/cupo.ts`) | ✅ vivo (falta solo la prueba del popup +591 para el alta self-service de WhatsApp; canal web ya self-service) |
| **Chatbot a medida** | integración con el sistema del cliente o flujos propios. **Sin precio de lista**: se define el alcance y recién ahí se cotiza | por definición, a pedido |
| Agenda pública | link de reserva sin llamadas | 🟢 |
| Usuario extra | asiento adicional | 🟢 |
| ~~Inventario avanzado~~ | — | ⛔ **RETIRADO de la oferta (Sergio, 2026-08-27: "no se cobra").** Las funciones NO se quitaron: compras a crédito, proveedores, alertas de stock bajo y vencimientos por lote siguen disponibles **para todos, gratis**. Lo que se quitó es el cobro — cobrar Bs 180 por lo que el cliente ya tiene es una promesa que no sobrevive a la primera pregunta. Ver el bloque de decisión en `lib/pricing.ts:120` |
| Self-hosted | instalación en servidor del cliente | 🟡 |

⚠️ **Las tres claves de add-on siguen sin lector — revisado una por una el 2026-08-30.**
✅ **Y desde el 2026-09-05 ya no se pueden OTORGAR.** El backoffice las marcaba «Sin efecto todavía» y al lado dejaba apretar Otorgar igual: escribía la fila, quedaba «activa» en la ficha del cliente y no encendía nada. No eran tres sino **cinco** (las tres de acá más `addon.extra_seats` y `module.public_booking`), así que el arreglo fue una condición en la ruta `PATCH /api/admin/organizations/[id]/entitlements` (409) y en el botón, no clave por clave. Revocar sigue permitido, para poder limpiar un otorgamiento anterior. Qué enciende y qué no sale de `CON_EFECTO_REAL`, con un test que falla si el mapa miente.
Ningún archivo de `app/` o `components/` consulta `addon.inventory_advanced`,
`addon.chatbot` ni `addon.web`; el único ítem de nav gateado por feature es `/agents`
(`module.agents`). Pero **no es el mismo problema en las tres**:

| Clave | Qué pasa de verdad | Qué corresponde |
|---|---|---|
| `addon.inventory_advanced` | **Ya resuelto.** El add-on se retiró de la oferta el 2026-08-27. Que la clave no la lea nadie es ahora lo correcto, no un bug | nada — cerrado |
| `addon.chatbot` | ⚠️ **La clave está muerta y la que trabaja es OTRA** (verificado el 2026-08-31: `addon.chatbot` sólo aparece en tests; el gate vivo es `addon.whatsapp`, con `isWhatsAppAddonActive()` en `lib/plan-limits.ts`). Y **medio chatbot ya está gateado**: `GET /api/chatbot-knowledge/published` exige el add-on desde el 2026-08-18. Lo que sigue abierto es la bandeja `/inbox`, en el nav de todos los packs sin gate | **decide Sergio** (ítem F2 de `COLA.md`): gatear `/inbox` con `addon.whatsapp` baja una superficie viva — ⚠️ **acá decía «hoy ninguna org tiene el add-on» y es falso, contado en la base de producción el 2026-09-05: la tienen **cuatro**, todas por `grant` manual (Clínica Sergio 09-04, Onia interna 09-02, y las dos ZZ QA del 08-18). Ninguna es de un cliente pagante, así que el espíritu se sostiene, pero el número no: gatear `/inbox` hoy **sí** apaga algo, y lo apaga justo en las dos orgs propias donde Sergio Urcullo lo vería—, o dejar de crear el inbox de Chatwoot salvo add-on activo, que ataca la raíz sin apagar nada |
| `addon.web` | La web del cliente la entrega **web-factory**, otro repo, y no tiene ni debería tener pantalla en la plataforma **resuelto el 2026-09-05 por una tercera vía**: la clave se queda (borrarla pierde el rastro de un otorgamiento viejo) pero **ya no se puede otorgar** — la ruta la rechaza con 409 y la pantalla tiene el botón apagado |

**Servicios que no son software:**

- **Auditoría por Zoom, 30 min: GRATIS.** Es gancho, no producto.
- **Consultoría personalizada:** se cobra. Precio caso por caso — **no hay tarifa de
  lista y no se improvisa una**.

---

## 6. Cómo se da de alta un cliente

⚠️ **CORREGIDO el 2026-08-31 — el alta está ABIERTA.** Acá decía *"El alta automática está
CERRADA"* y que cambiaba el guion de venta entero. **Es falso desde el 2026-08-29.** Medido en
el `app.env` del contenedor de producción:

```
ONIA_ALTA_AUTOMATICA=abierta
ONIA_REGISTRO_CONFIRMA_CORREO=si
```

Los dos flips están hechos (el segundo va con `GOTRUE_MAILER_AUTOCONFIRM=false` en
`supabase-auth2`). `/register` sirve el formulario de registro, no el pedido de acceso.

**El daño de dejarlo escrito mal:** manda a cada sesión nueva —y a cada material de venta— a
ofrecerle "alta acompañada, te contactamos" a alguien que **puede entrar solo en dos pasos**.
Es fricción inventada en el último clic, que es donde más caro sale.

Lo que sigue abajo describe el circuito de **cuando estaba cerrada** y se conserva porque el
formulario de pedido de acceso sigue existiendo como camino alternativo — pero **no es el
camino por defecto**.

```
solicitud en /register  →  fila en access_requests  →  alguien de Onia contacta
                        →  alta manual y configuración del rubro  →  el cliente entra
```

- **Con el alta cerrada** (no es el caso hoy), `/register` no crea cuentas: es un Server
  Component que bifurca según `altaAutomaticaAbierta()` (`lib/registration.ts`) y en esa rama
  muestra un formulario de pedido de acceso (seis campos, sin contraseña) que graba un
  `AccessRequest`, trabajado a mano desde `/admin/solicitudes`. **El default del código es
  cerrado, pero producción corre con `ONIA_ALTA_AUTOMATICA=abierta`**, así que la rama viva es
  la otra. Verificar cuál rige, sin suponer: `docker exec onia-platform env | grep ALTA`.
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

No es una lista de deseos, es el trabajo pendiente, en orden.

> **Último reconteo: 2026-09-05.** Dos de los seis ítems ya estaban hechos y esta lista
> seguía pidiéndolos (1 y 3). Una lista de pendientes sin fecha de reconteo no envejece:
> **manda a construir lo que ya está construido.** Quien la lea después de esta fecha,
> cuenta primero y edita acá la fecha — aunque no cambie ningún ítem.

1. ✅ **Servicios profesionales: HECHO, `/patients` está en su nav desde el 2026-09-04**
   (`5b67bbf`, en `origin/master`). El rubro tenía Citas y ninguna pantalla donde vivir a
   quién citar: la única puerta era Caja → Fiado, seis clics, y ese cliente ni siquiera
   aparecía en el selector de la cita. Hoy la entrada «Clientes» está en el menú, la lista
   blanca de rutas —que se **deriva** del nav— la permite, y la pantalla ya habla el idioma
   del rubro (`vocabularioDeTrack`: «clientes», no «pacientes»).
   **Medido el 2026-09-05 por dos carriles por separado, contra `origin/master` y contra
   producción, no contra un doc:**
   `resolveRouteAccess("/patients", VERTICAL_PACKS["gestios-servicios-profesionales"], …)`
   → `{allowed:true}`; la entrada está en `SERVICIOS_NAV_ITEMS` etiquetada «Clientes»
   (`onia-platform/lib/platform/vertical-pack.ts:388`) y **en el bundle que hoy sirve
   producción** (`{href:"/patients",icon:"group",label:"Clientes"}` dentro de
   `/opt/onia-platform/runtime-next`). Verde entre `api-route-registry.test.ts`,
   `appointments/page.test.ts`, `route-access.test.ts`, `patients/ficha-por-rubro.test.ts`
   y `lib/platform/api-guard.test.ts`.

   ⚠️ **Acá había escrito lo contrario el 2026-09-05, y la corrección es la lección.**
   Este ítem llegó a decir que `/patients` **no debe** entrar al nav de ese rubro, "medido
   haciendo el cambio". El método era bueno; el árbol, no: se midió en un worktree **109
   commits detrás de `origin/master`**, o sea *antes* de que existiera el arreglo. En ese
   árbol fósil agregar la entrada sí rompía dos gates, así que el veredicto salió
   **invertido** — «no debe estar» en vez de «ya está». Obedecerlo le habría sacado a un
   rubro vendible la única pantalla donde carga a sus clientes.
   **Un árbol viejo no da un rojo obvio: da un rojo coherente.** Antes de medir haciendo el
   cambio va `git merge origin/master` (`git rev-list --count HEAD..origin/master` = 0).
   Anclado para que no vuelva: el gate `agenda-necesita-clientes` (suite `lib/platform` de
   `onia-platform`) — todo pack que ofrezca agenda tiene que poder abrir la pantalla de sus
   clientes, así que sacar la entrada siguiendo un doc viejo se pone **rojo**. Escrito el
   2026-09-05 en la rama del carril; entra a `master` con el merge.

   ✅ **MIRADO el 2026-09-06, que es lo único que faltaba: todo este ítem se había discutido
   leyendo código.** Se abrió `/appointments` de producción con la sesión del dueño y se
   apretó «Nueva Cita»: el modal ofrece **«+ Nuevo paciente»** justo arriba del desplegable
   —el rótulo sale del rubro, así que en servicios profesionales dice «+ Nuevo cliente»—.
   Captura: `hermes-content/docs/recorrido/capturas/alta-inline-en-el-modal-de-cita.png`.
   Se mira con `node scripts/mirar_bandeja_dueno.mjs --ruta /appointments --click "Nueva Cita"`.
   **Lo que NO se probó, dicho de frente:** no existe ninguna organización de ese rubro en
   producción (contado en `supabase-db`), así que el modal se miró en una dental; el botón
   no depende del rubro ni de que ya haya clientes (`page.tsx:716-722`), el rótulo sí.

   ⚠️ **Las dos objeciones que esta celda usaba para justificar el «no» también vencieron**
   (§2, misma fecha): la ficha esconde alertas médicas, alergias, tipo de sangre, historia
   clínica y tratamientos cuando el pack no es clínico (`fichaClinica()` en
   `vertical-pack.ts`, **derivada** de si el nav declara `/treatments`, no una lista a
   mano), y **no hay 403** porque el segmento `patients/*` entero pasó a `CON_AGENDA` en
   `api-route-registry.ts`. El alta inline del cliente en el modal de cita **se queda**:
   agendar sin salir del modal sigue siendo el camino corto.
2. **Cerrar la revisión de los add-ons sin consumidor** (`addon.inventory_advanced`,
   `addon.chatbot`, `addon.web`): o los consume algo, o salen del catálogo.
3. ~~**Decidir qué hacer con `/requerimientos`:** enlazarla desde el nav~~ → **el enlace
   ya existe; esta línea también estaba vencida.** Medido el 2026-09-05: **tres** navs la
   declaran —`proveegest-electrico`, `gestios-general` y `gestios-servicios-profesionales`
   (`vertical-pack.ts:175,279,395`)— y el bundle desplegado trae 12 apariciones de esa
   entrada. Los dos packs clínicos (dental, estética) siguen sin ella, y **eso sí** es una
   decisión abierta: si un consultorio quiere pedirle un estudio al paciente, hoy no tiene
   camino. Lo que ya no hay que decidir es si la pantalla está huérfana — no lo está.
4. Recorrer cada módulo 🟡 con datos reales y **mirarlo renderizado**.
5. Cerrar el pendiente fiscal (`SIAT_EMISSION`) para poder facturar de verdad.
6. Decidir si los agentes se agendan (cron propio) o se venden como disparo manual.

Ver `CLAUDE.md` (regla de una sola fuente de verdad) · `onia-core/contract.json` ·
`onia-platform/lib/pricing.ts` · `onia-platform/lib/subscription-plans.ts`.
