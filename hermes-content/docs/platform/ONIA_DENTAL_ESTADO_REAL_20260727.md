# ONIA — Estado real del sistema dental (auditoría de código, 2026-07-27)

> Auditoría de **solo lectura** sobre `C:\dev\proyectos\DentaGest\dental-saas`
> (rama `feat/onia-dental-medical-alert`, HEAD `fc94a20`) contrastada contra
> `hermes-content/docs/ONIA_KIT_VENTA_DENTAL_20260727.md`.
> Nada se modificó en el repo del producto. Toda afirmación lleva `archivo:línea`.
> Lo que no se pudo verificar está marcado como tal, no rellenado con suposiciones.

---

## VEREDICTO

**No se puede vender la semana que viene con el guion actual.** El producto compila,
pasa 501 tests y tiene una base clínica sólida y real (agenda, ficha, odontograma,
pagos, reportes) — el problema no es que esté roto.

**Lo que traba es que el guion vende lo que no está desplegado y, en dos puntos, lo
que no existe en ningún lado.** El minuto 7-11 —"EL MOMENTO", el agente que detecta
el hueco y manda el WhatsApp al aprobar— **no ocurre**: aprobar no envía nada
(`lib/onia-core/collab.ts:206-232`), ningún agente reacciona a un no-show, y todo el
módulo de agentes vive en una rama **31 commits adelante de `master`**, que es lo que
Vercel despliega (`docs/RUNBOOK.md:18`). `www.dentalgest.app` responde 200, pero corre
código del **8 de julio**: sin `/agents`, sin capa fiscal, sin la semilla de demo.

**Se puede vender en ~1 semana de trabajo** si se hace lo del §5: mergear a `master`,
encender flags, sembrar el ambiente demo, y **reescribir el minuto 7-11 y tres
objeciones** para que prometan lo que el sistema realmente hace hoy (proponer un
borrador que el humano copia y envía a mano). Eso sigue siendo un buen pitch. Lo que
no aguanta la primera demo es el "aprobás y sale el WhatsApp".

---

## 1. ¿Arranca? SÍ — todos los gates en verde

Ejecutado el 2026-07-27 sobre `C:\dev\proyectos\DentaGest\dental-saas`
(`node_modules` ya presente, no hizo falta instalar).

| Gate | Comando | Resultado |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | **exit 0**, cero errores |
| Tests | `npx vitest run` | **exit 0** — 501 passed, 5 skipped (43 archivos) |
| Build producción | `npm run build` (prisma generate + next build + standalone) | **exit 0**, build completo, 58 rutas emitidas |

No hay ningún error textual que reportar. El repo está sano.

**Ojo con la ubicación:** `C:\dev\proyectos\DentaGest` **no es** el repo git. El repo
real es `C:\dev\proyectos\DentaGest\dental-saas` (remoto
`github.com/oninteligenciaartificial/Dental-Gest.git`). La rama por defecto es
**`master`**, no `main`.

---

## 2. Qué funciona de punta a punta

### 2.1 DEMOSTRABLE (UI + backend + persiste)

| Función | Evidencia |
|---|---|
| **Agenda del día** | `app/(dashboard)/agenda/page.tsx:20-39` — query real por org, tenant-scoped, timezone de `ClinicSettings`. Colores por estado en `AgendaClient.tsx:12` |
| **Citas (calendario mensual)** | `app/(dashboard)/appointments/page.tsx:293-298` grilla del mes; estados con color incl. `NO_ASISTIO` (`:33`, `:41`, `:50`) |
| **Ficha del paciente** | `app/(dashboard)/patients/[id]/page.tsx` — Contacto, Alertas médicas (`:172`), Notas (`:220`), Citas (`:245`), Historial Clínico (`:287`), Tratamientos (`:338`), Facturas (`:374`), Colaboración con comentarios y documentos (`:412`) |
| **Odontograma** | `app/(dashboard)/patients/[id]/odontogram/page.tsx` + persistencia real con `upsert` tenant-scoped en `app/api/teeth/route.ts:24-34`. 7 condiciones (SANO/CARIES/RESTAURADO/AUSENTE/CORONA/IMPLANTE/FRACTURA) |
| **Documentos y consentimientos** | `components/patients/PatientCollab.tsx:193` (subida) y `:312` (descarga) contra `/api/onia-core/documents`. Montado en ficha (`patients/[id]/page.tsx:412`) y en factura (`billing/[id]/page.tsx:200`) |
| **Cobros manuales de paciente** | `/billing/[id]` → `PaymentModal.tsx:46-50` → `app/api/payments/route.ts:45-107`. Transacción con `SELECT ... FOR UPDATE`, anti-sobrepago (`:70-72`), pasa la factura a PAGADA sola (`:89-90`), auditoría (`:110-119`) |
| **Tablero del dueño** | `app/(dashboard)/dashboard/page.tsx:155-252` — ~11 queries Prisma reales. Incluye `noShowsThisMonth` (`:202-206`), por cobrar, cobrado del mes, stock crítico. Bloque financiero gateado por rol (`:12`, `:221-252`) |
| **Reportes** | `app/(dashboard)/reports/page.tsx` — ingresos/mes por SQL crudo (`:155-166`), pacientes/mes (`:169-179`), citas por estado y doctor (`:207-218`), top 5 tratamientos (`:221-234`). Gateado por plan (`:30-52`) |
| **Balance clínico** | `app/(dashboard)/reports/clinical-balance/page.tsx:57-69` — reconcilia producción → facturado → cobrado |
| **Contabilidad** | `app/(dashboard)/accounting/page.tsx:43-109` — libro de ventas 6 meses, conciliación por método, cuentas por cobrar |
| **Inventario y tratamientos** | CRUD completo real: `InventoryClient.tsx:82/118/155`, `TreatmentsClient.tsx:49/58/85` |
| **Alta autónoma de la clínica** | `app/api/auth/register/route.ts:168-240` — crea Organization + Profile ADMIN + ClinicSettings en transacción, con trial |
| **Wizard de onboarding (3 pasos)** | `app/onboarding/page.tsx:76-121`, forzado desde `app/(dashboard)/layout.tsx:55-57` |
| **Invitar usuario al equipo** | `app/(dashboard)/team/InviteModal.tsx:44` → `app/api/team/route.ts:82-126` crea el usuario en Supabase Auth con acceso inmediato |
| **Importar pacientes por CSV** | `app/(dashboard)/patients/import/page.tsx` → `app/api/patients/import/route.ts:28-132`, validación por fila con nº de línea |
| **Bot de WhatsApp conversacional** | `app/api/webhooks/whatsapp/route.ts:26-100` (HMAC + `timingSafeEqual`) → `lib/whatsapp-bot.ts:33-244` (menú que confirma/cancela citas de verdad, `:151-154`, `:103-106`) → texto libre a `gpt-4o-mini` (`lib/whatsapp-ai.ts:129-136`) → escalado a Chatwoot (`whatsapp-bot.ts:270-302`). **Esto es lo más subestimado del producto y no está en el guion.** |

### 2.2 A MEDIAS (existe la pantalla, falta el cierre)

| Función | Qué falta exactamente |
|---|---|
| **Agentes IA (Recall + Cobrador)** | Existen y la lógica es seria (`lib/onia-core/modules/agents-runtime.ts`). Pero: (a) requieren `AGENTS_RUNTIME=1` **y** `PLATFORM_LAYER=1` (`agents-flags.ts:17`, `platform/flags.ts:10`) — **ninguna de las dos está en ningún `.env`** del repo; (b) requieren entitlement `module.agents`, y **no hay forma de otorgárselo a una org real**: los entitlements sólo se crean en `lib/platform/provisioning.ts:154`, cuya única cadena de llamada es el endpoint de demo (`app/api/onia-core/demo/route.ts:32`); el registro público (`app/api/auth/register/route.ts:168-191`) no crea ninguno; (c) **`vercel.json` no programa `/api/cron/onia-agents`** — sólo `appointment-reminders`, `recurring-invoices` y `onia-core-workitems`. Los agentes **nunca corren solos**. |
| **Cola de aprobación `/pending`** | La página funciona (`app/(dashboard)/pending/page.tsx`), pero **no muestra el mensaje redactado**: `pending-client.tsx:19-25` sólo renderiza tipo, monto, quién pidió y motivo. El texto del borrador está guardado (`agents-runtime.ts:471`) pero sólo se ve en `/agents` (`agents/page.tsx:156-160`). El aprobador decide a ciegas. |
| **Facturación SIAT** | Es un **mock honestamente etiquetado**, no un emisor. CUF por hash FNV-1a (`lib/fiscal/siat-client.ts:47-63`, comentario propio: *"NOT crypto; mock only"*), CUFD literal `MOCKCUFD` (`:90`), QR que es ruido SVG no decodificable (`:66-83`), impresión con badge `SIMULACION — SIN VALOR FISCAL` (`app/print/invoice/[id]/page.tsx:429`). **No hay generación ni firma de XML, ni CUIS.** El `siat-service` externo al que llamaría (`siat-client.ts:202-214`) no existe ni está configurado. |
| **Recordatorios automáticos de cita** | Salen por **email**, no WhatsApp, salvo que un SUPERADMIN encienda `whatsappAddon` por clínica (`app/api/cron/appointment-reminders/route.ts:117-120`; el add-on nace en `false`, `register/route.ts:186`). Si WhatsApp falla **no hay fallback** salvo `ALLOW_EMAIL_FALLBACK_AFTER_WA_FAILURE=true`, que no está en `.env`. Además el cron corre **una vez al día a las 12:00** (`vercel.json`), así que la ventana de 2h sólo atrapa citas cerca de las 14:00. |
| **Envío saliente de WhatsApp** | El código cierra contra Meta Cloud API (`lib/whatsapp.ts:77-115`), pero las credenciales las carga **sólo un SUPERADMIN** (`app/api/admin/organizations/[id]/whatsapp/route.ts:10`); la clínica no tiene UI para hacerlo. **Riesgo de seguridad**: el token se guarda en texto plano (`whatsapp/route.ts:26`) pudiendo usar `lib/encryption.ts`, que ya se usa para pasarelas. |
| **Wizard `/setup` (7 pasos ONIA Core)** | Persiste de verdad (`lib/onia-core/onboarding.ts:131-258`), pero es opcional, no está en la navegación (único enlace: `dashboard/page.tsx:398`) y los pasos 3 y 5 se guardan como JSON sin ningún consumidor. |
| **Roles finos (dueño/doctor/recepción/caja)** | La matriz existe (`lib/onia-core/roles.ts:28-34`) y el panel `/team/roles` persiste asignaciones. Pero `hasPermission()` (`roles.ts:49-51`) **no se llama desde ningún punto de producción** — sólo desde su test y desde la leyenda visual. Asignar "recepción" no cambia nada. |
| **Exportación RCV** | Backend funcional (`lib/fiscal/rcv-export.ts:119-146`) pero **sin ningún botón ni link en la UI**: sólo accesible pegando `/api/fiscal/rcv-export?month=YYYY-MM` a mano. Y el propio archivo aclara que **no es el RCV oficial del SIAT** (`:2-3`). |
| **Cobro de la suscripción a ONIA** | Funciona pero es manual: QR estático (`components/billing/QRPaymentModal.tsx:159`) + comprobante subido (`app/api/subscription-payment/route.ts:98-130`) + aprobación de un SUPERADMIN (`app/api/admin/subscription-payments/route.ts:66-74`). |

### 2.3 NO EXISTE (se habla en los docs, no está en el código)

| Función prometida | Realidad |
|---|---|
| **Agente que detecta un no-show y propone reprogramar** | **No existe ningún agente así.** El catálogo tiene exactamente dos (`agents-runtime.ts:55-75`): `recall` (paciente sin volver hace **180 días** y sin cita futura) y `cobrador` (factura vencida). Lo único que reacciona a un no-show es un generador de tareas que crea un to-do de texto plano: `"Reagendar a X (no asistio)"` con acción `"Llamar al paciente y ofrecer nueva cita"` (`lib/onia-core/work-items.ts:145-150`). Es un post-it, no un agente. |
| **"Aprobás con un click y sale el WhatsApp"** | **Aprobar no envía nada.** `decideApproval` (`lib/onia-core/collab.ts:206-232`) sólo escribe `status`, `approvedByProfileId` y `decidedAt`. Cero efectos externos. El propio código lo dice en `agents-runtime.ts:5-6`: *"el envio real es external_gate, bloqueado por S6"*. El único código que envía WhatsApp (`lib/whatsapp.ts`) se llama **exclusivamente** desde el cron de recordatorios (`appointment-reminders/route.ts:125,203`). |
| **"Mensaje con dos horarios libres de esta semana"** | El mensaje que genera el agente Recall (`agents-runtime.ts:245-253`) dice *"tu última visita fue hace más de N meses… ¿Te agendamos un control? Responde este mensaje"*. **No propone horarios.** |
| **"Recepción ve agenda y caja, no la historia clínica"** | **Falso, y además invertido.** `/patients` es `ALL_ROLES` (`components/layout/navigation.ts:28`), la ficha no tiene gate de rol sobre el historial (`patients/[id]/page.tsx:287`, el único gate es `canManageBilling` en `:44`), y las APIs clínicas usan sólo `requireAuth()`: `patients/[id]/records/route.ts:18,46`, `treatments/route.ts:19,53,96`, `medical-alerts/route.ts:22,51`. **Recepción lee y escribe historia clínica.** Lo que sí es cierto es lo contrario: `/billing` es `ADMIN_ROLES` (`navigation.ts:31`), reforzado en backend (`api/invoices/route.ts:33`, `api/payments/route.ts:28`) — **recepción NO ve la caja**. |
| **Agenda semanal / por sillón** | No hay vista semanal (`/agenda` es del día — el propio menú dice *"Agenda de hoy"*, `navigation.ts:26`; `/appointments` es grilla mensual) y **no existe el concepto de sillón/box** en el modelo (`prisma/schema.prisma:634-671`: `Appointment` tiene doctor, no sillón). |
| **Pasarelas de pago automáticas (QR BCP/PagosNet/Circle)** | Código muerto por triple partida: el endpoint devuelve **410 Gone** (`app/api/invoices/[id]/pay/route.ts:16-19`), `processPayment()` (`lib/gateway.ts:54`) **no tiene ningún caller**, y `gatewayEnabled: false` en **los cinco planes** (`lib/plan-limits.ts:49,61,73,85,97`). Los webhooks están bien escritos pero devuelven 404 si no hay `gatewayConfig`, fila que nadie puede crear. `docs/GATEWAY.md:189-191` documenta botones que no existen. |

### 2.4 Bugs colaterales que conviene saber antes de una demo

- **`Invoice.tax` se graba siempre en 0** (`app/api/invoices/route.ts:65-66`), pero la impresión rotula *"Impuesto IT (3%)"* (`print/invoice/[id]/page.tsx:368`), Contabilidad muestra *"Impuesto registrado este mes"* siempre en Bs 0,00 (`accounting/page.tsx:77`) y el RCV calcula 13% (`rcv-export.ts:58-60`). Tres criterios fiscales sobre un campo que nunca se llena. **Si un dentista mira la factura impresa, ve IT 3% = Bs 0,00.**
- **Aprobar no actualiza la acción del agente.** Nadie escribe `OniaAgentsAction.status` después de la decisión (único `update` es `agents-runtime.ts:492-495`, durante la creación). Aprobar en `/pending` y volver a `/agents` sigue mostrando *"Esperando aprobacion"*.
- **`POST /api/payments` pasa BORRADOR → ENVIADA sin pasar por lo fiscal** (`payments/route.ts:91-93`), así que incluso con las flags encendidas una factura pagada desde borrador nunca se emitiría.
- **"Saltar configuración" deja la clínica en blanco**: `app/onboarding/page.tsx:346` marca `onboardingCompletedAt` sin guardar nombre, teléfono, dirección ni horario.
- **El parser CSV de importación se rompe con comas entre comillas** (`patients/import/page.tsx:26` usa `line.split(",")`), y no deduplica: reimportar duplica pacientes.
- **`/pending` no está en el menú lateral.** Se llega desde el dashboard (`dashboard/page.tsx:359,383`), desde `/agents` y desde `/setup`. No es huérfana, pero hay que saber el camino.

---

## 3. ¿Hay un ambiente demo usable? A MEDIAS — y no en producción

### Lo que existe

Hay una semilla de demo **bien pensada**: `lib/onia-core/demo-seed.ts`, invocable por
cualquier admin sobre su propia org vía `POST /api/onia-core/demo-seed`
(`app/api/onia-core/demo-seed/route.ts:8-19`), idempotente (`demo-seed.ts:45-48`), y
también expuesta como botón en el wizard de onboarding (`app/onboarding/page.tsx:127`).

Siembra: 4 tratamientos, **4 pacientes**, 3 producciones clínicas, 2 facturas (una con
cobro parcial, una vencida), **2 citas**, 1 pendiente y 1 nota. Incluye a propósito un
paciente "frío" (Jorge Quispe, última visita hace 220 días + factura vencida) para
alimentar a Recall y Cobrador (`demo-seed.ts:33-36`, `:148-187`).

Existe además un endpoint de **tenant demo instantáneo**
(`app/api/onia-core/demo/route.ts`) que crea una "Clínica Demo" completa con el
entitlement `module.agents` incluido (`lib/platform/demo-provisioning.ts:88`).

### Por qué hoy no alcanza para la demo de 15 minutos

1. **Nada de esto está en producción.** Ver §4.0. En `master`, `demo-seed.ts` tiene 174
   líneas y **no incluye al paciente frío** (verificado con `git show origin/master`),
   y `demo-provisioning.ts` no existe.
2. **La agenda del día quedaría vacía.** La única cita futura de la semilla es a **+2
   días** (`demo-seed.ts:134-135`). `/agenda` muestra sólo hoy. En la demo se abriría
   una agenda sin nada.
3. **No hay ninguna cita en estado `NO_ASISTIO`** en la semilla. El "hueco visible" que
   sostiene toda la narrativa del guion **no se siembra**.
4. **El odontograma del paciente demo está vacío.** La semilla no crea ningún
   `toothRecord`. El minuto 4-7 mostraría una boca en blanco.
5. **El tenant demo instantáneo no se puede loguear** por defecto: crea un
   `ownerUserId` sintético (`demo-provisioning.ts:36-38`, `:82`); hay que pasarle un
   usuario real de Supabase Auth. Y devuelve 404 sin `PLATFORM_LAYER=1`
   (`demo/route.ts:18-20`).
6. **Las capturas de respaldo no existen.** `hermes-content/sales-kit/capturas/` no
   está creada. El `05-CHECKLIST-CAPTURAS.md` lista 12 piezas, ninguna tomada.

**Conclusión del §3:** la demo hoy sólo es posible **en local** (`npm run dev` con las
flags encendidas), sembrando a mano el no-show y el odontograma. No hay una URL a la
que Sergio pueda entrar y mostrar una clínica cargada.

*Pendiente de verificación (no se pudo comprobar sin navegador ni credenciales de
Vercel): los valores reales de las variables de entorno en el proyecto Vercel
`dental-gest`. En el repo, `PLATFORM_LAYER`, `AGENTS_RUNTIME` y `SIAT_EMISSION` están
ausentes de `.env`, `.env.prod`, `.env.production` y `.env.vercel` — es decir, OFF en
todo lo que se puede leer localmente.*

---

## 4. El guion de demo, paso a paso, contra el código

### 4.0 El problema que está encima de todos los demás

`docs/RUNBOOK.md:18` — *"Vercel despliega automaticamente cuando `master` recibe un push."*

- `origin/master`: último commit `96b89a9`, **2026-07-08**.
- Rama actual `feat/onia-dental-medical-alert`: `fc94a20`, 2026-07-26, **31 commits
  adelante**.
- `www.dentalgest.app` responde **200** (verificado por HTTP).

Qué hay y qué no hay en lo que está desplegado (verificado con `git cat-file` contra
`origin/master`):

| Pieza | ¿En `master` (producción)? |
|---|---|
| `/agenda`, `/pending`, odontograma, ficha | **SÍ** |
| `app/(dashboard)/agents/page.tsx` | **NO** |
| `lib/onia-core/modules/agents-runtime.ts` (Recall/Cobrador) | **NO** |
| `lib/fiscal/flags.ts` y toda la capa SIAT | **NO** |
| `lib/platform/demo-provisioning.ts` (tenant demo) | **NO** |
| `prisma/migrations/20260728000000_add_onia_agents` | **NO** |
| Paciente frío en la semilla de demo | **NO** |
| Alertas médicas estructuradas | **NO** |

Además, dos commits declaran explícitamente que sus migraciones **no fueron
aplicadas**: `d2a3351` (*"add OniaDentalMedicalAlert model + migration (no aplicada)"*)
y `0a1e98f` (*"schema aditivo + migracion (NO aplicada)"*). Las tablas `onia_agents_*`
y `platform` muy probablemente **no existen en la base de producción**.

**Traducción comercial:** el kit dice que el producto está *"~90% vendible y EN VIVO en
www.dentalgest.app"*. Lo que está en vivo es el DentalGest del 8 de julio: agenda,
fichas, facturación interna y cobros. **Sin agentes. Sin capa fiscal.** Todo lo que el
guion usa como diferenciador está en una rama sin mergear.

### 4.1 Minuto a minuto

| Momento del guion | Qué promete | Veredicto | Evidencia |
|---|---|---|---|
| **0-2 · La pregunta** | Nada del producto | **DEMOSTRABLE** | No toca código. Mantener tal cual |
| **2-4 · La agenda** | "Agenda de la **semana**: citas **por sillón**, colores por estado, y **un hueco visible** (paciente que faltó)" | **NO SE SOSTIENE** (3 de 4 fallan) | Semana: no existe (`/agenda` = hoy, `navigation.ts:26`; `/appointments` = mes, `appointments/page.tsx:293`). Sillón: no existe en el modelo (`schema.prisma:634-671`). Colores por estado: **sí** (`AgendaClient.tsx:12`, `appointments/page.tsx:33-50`). Hueco: hay que sembrarlo a mano, la semilla no lo crea |
| **4-7 · La ficha** | Odontograma, historial, documentos/consentimientos, **roles (recepción no ve la historia clínica)** | **PARCIAL** | Odontograma: **DEMOSTRABLE** (`api/teeth/route.ts:24-34`) pero **vacío en la semilla**. Historial y documentos: **DEMOSTRABLE** (`patients/[id]/page.tsx:287`, `:412`). Roles: **FALSO E INVERTIDO** — recepción SÍ ve la historia (`records/route.ts:18,46` sólo `requireAuth`) y NO ve la caja (`navigation.ts:31`) |
| **7-11 · EL MOMENTO** | "El agente **ya detectó el hueco**"; "mandarle un WhatsApp con **dos horarios libres**"; "**aprueba con un click y recién ahí sale el mensaje**"; "mostrar el WhatsApp **saliendo al celular demo**" | **NO SE SOSTIENE — ninguna de las cuatro** | (a) Ningún agente reacciona a no-shows; sólo hay un to-do de texto (`work-items.ts:145-150`); Recall dispara a los **180 días** (`agents-runtime.ts:60-63`). (b) El mensaje no ofrece horarios (`agents-runtime.ts:245-253`). (c) `decideApproval` no envía nada (`collab.ts:206-232`). (d) El único envío de WhatsApp está en el cron de recordatorios (`appointment-reminders/route.ts:125,203`). **Además**: `/pending` ni siquiera muestra el texto del borrador (`pending-client.tsx:19-25`) |
| **7-11 · panel del dueño** | "Pendientes del día, 15 segundos" | **DEMOSTRABLE** | `dashboard/page.tsx:155-252`, datos reales incl. no-shows del mes |
| **11-13 · La factura** | "Nuestro emisor está **en homologación**; hasta entonces le dejamos la venta lista y factura por el Portal Web" | **SE SOSTIENE — es el tramo mejor escrito del guion** | Honesto y correcto. Ojo: la factura impresa muestra *"Impuesto IT (3%): Bs 0,00"* (`print/invoice/[id]/page.tsx:368` + `invoices/route.ts:65`). Corregir el rótulo o no mostrar el impuesto |
| **13-15 · Cuenta y cierre** | Pro Bs 750/mes | **DEMOSTRABLE** | Precios exactos en `lib/subscription-plans.ts:18-20`: basic 320, professional 750, clinic 1500. Coincide con el kit |

### 4.2 Los mensajes y las objeciones oversellen MÁS que el guion

El minuto 11-13 es honesto sobre el SIAT. Pero fuera de la demo, cuatro piezas del kit
lo presentan como **una función que ya existe**:

- **§1.3** (reapertura de lead): *"la factura SIAT va incluida en los 3 planes, sin
  costo aparte"* — presente afirmativo.
- **§3.1**: *"DentalGest no le cobra por facturar (va incluido en los 3 planes)"*.
- **§3.2**: *"Bs 750 al mes… **con la factura SIAT incluida**"* y *"plan Básico a Bs 320
  … **y ya incluye la factura SIAT**"*.
- **§3.7**: *"hay un plan de entrada a Bs 320 que la ordena y **ya trae la factura
  SIAT**"*.

Hoy eso es un mock etiquetado *"SIMULACION — SIN VALOR FISCAL"*. Si el prospecto pide
ver la factura, se ve el badge. **Riesgo de credibilidad alto**: el guion prometió
honestidad ("se lo digo yo antes de que lo googlee") y la objeción lo contradice.

También **§1.3** dice *"ahora tiene un agente que trabaja solo — cuando un paciente
falta, detecta el hueco y te propone reprogramarlo por WhatsApp, vos aprobás con un
click y recién ahí sale el mensaje"* — la misma promesa imposible del minuto 7-11.

### 4.3 El checklist de capturas es directamente inejecutable

`sales-kit/05-CHECKLIST-CAPTURAS.md` pide 12 piezas. Estas cuatro **no se pueden
producir hoy**:

- **#1 "Agenda semanal — citas por sillón"** → no hay vista semanal ni sillones.
- **#6 "/pending con la propuesta del agente ⭐ — qué propone el agente, botón de
  aprobar"** → `/pending` no renderiza el mensaje propuesto; el texto está en `/agents`,
  donde no hay botón de aprobar. Son dos pantallas distintas.
- **#7 "Aprobación → WhatsApp saliendo (MP4)"** → imposible: aprobar no dispara envío.
- **#11 "Roles (vista de recepcionista): agenda sí, historia clínica no"** → la captura
  mostraría lo contrario de lo que se quiere probar.

---

## 5. Ruta crítica — lo mínimo para que una clínica pague

Ordenado por lo que desbloquea. Estimación gruesa, un desarrollador.

### Bloque A — Para poder hacer UNA demo creíble (~2-3 días)

| # | Ítem | Esfuerzo | Por qué es el mínimo |
|---|---|---|---|
| A1 | **Reescribir el minuto 7-11 y §1.3/§3.1/§3.2/§3.7 del kit** para prometer lo que el sistema hace: *"el sistema detecta al paciente que faltó y al que no vuelve, te redacta el mensaje, y vos lo mandás desde tu WhatsApp"*. Quitar "sale el mensaje solo" y "factura SIAT incluida" en presente | **2-3 h** | Es gratis y elimina el riesgo #1 de quemarse en la primera demo |
| A2 | **Mergear la rama a `master`** (31 commits) y verificar el deploy. Aplicar las migraciones pendientes (`add_onia_agents`, `add_platform_layer`, `add_onia_dental_medical_alerts`) contra la base de producción | **4-6 h** | Sin esto, nada de lo demás existe en la URL que Sergio va a mostrar |
| A3 | **Encender `PLATFORM_LAYER=1` + `AGENTS_RUNTIME=1`** en Vercel y otorgar `module.agents` a la org de demo | **1-2 h** | Los agentes están triplemente apagados |
| A4 | **Ampliar `demo-seed.ts`**: ~15 citas repartidas en la semana **incluyendo al menos una `NO_ASISTIO` de ayer**, odontograma cargado en el paciente estrella, 3+ atenciones de historial, 1 documento subido | **3-4 h** | Es lo que sostiene los minutos 2-4 y 4-7 del guion |
| A5 | **Correr el cron de agentes una vez** antes de cada demo (o agregar `/api/cron/onia-agents` a `vercel.json`) para que haya una propuesta viva en `/pending` | **1 h** | Hoy los agentes nunca corren solos |
| A6 | **Mostrar el mensaje propuesto en `/pending`** (pasar `metadata.suggestedMessage` a `pending-client.tsx`) y **agregar un botón "Copiar mensaje"** | **2-3 h** | Convierte el minuto 7-11 en algo real y honesto: se aprueba viendo el texto y se copia al WhatsApp |
| A7 | **Tomar las 12 capturas** del checklist (ajustadas a lo que existe) | **1-2 h** | Respaldo si falla el internet en la clínica |

### Bloque B — Para que la clínica pueda usarlo de verdad (~3-4 días)

| # | Ítem | Esfuerzo | Por qué |
|---|---|---|---|
| B1 | **Arreglar el gate de recepción**: exigir rol DOCTOR/ADMIN en `patients/[id]/records`, `treatments`, `medical-alerts` y en la sección de historial de la ficha. Cablear `hasPermission()` de `roles.ts` o, más rápido, un `requireClinical()` en `lib/auth.ts` | **1 día** | Es una promesa de venta Y un tema de datos sensibles (historia clínica). Hoy cualquier usuario logueado de la org lee y escribe |
| B2 | **Arreglar `Invoice.tax`** o quitar el rótulo "IT 3%" de la impresión y "Impuesto registrado" de Contabilidad | **2-4 h** | Un dentista mira la factura y ve "IT 3% = Bs 0,00". Se nota |
| B3 | **Poner un enlace a `/pending` en el menú lateral** y escribir la vuelta de estado (aprobar debe pasar `OniaAgentsAction` a `approved`) | **2-3 h** | Hoy aprobar y volver a `/agentes` muestra "Esperando aprobación" |
| B4 | **UI para que la clínica cargue sus credenciales de WhatsApp** (hoy sólo SUPERADMIN) y **cifrar el token** con `lib/encryption.ts`, que ya está en el repo | **1 día** | Sin esto, cada alta necesita que Sergio entre como superadmin. Y el token en texto plano es deuda de seguridad real |
| B5 | **Arreglar el parser CSV** de importación (comillas) y agregar dedupe por CI/teléfono | **3-4 h** | "Cargamos sus pacientes" es parte de la implementación regalada que se promete en el cierre |
| B6 | **Quitar el botón "Saltar configuración"** del onboarding o hacer que exija los campos mínimos | **1 h** | Evita clínicas nuevas en blanco |

### Bloque C — Bloqueos que NO son de código (Sergio / terceros)

| # | Ítem | Estado |
|---|---|---|
| C1 | **Homologación SIAT + NIT** (S2). Sin esto la facturación electrónica no existe, sólo el mock. Ventana dura: 30-sep-2026 | Bloqueado, humano |
| C2 | **Token / verificación Meta para WhatsApp** (S5/S6). Sin esto no hay envío automático ni bot en vivo | Bloqueado, humano |
| C3 | **QR/cuenta para cobrar el primer trimestre a mano** | Bloqueado, decisión de Sergio (ya identificado en el kit §5.3) |

**Total del camino a "vendible con demo honesta": Bloque A ≈ 2-3 días. A + B ≈ 1
semana.** El Bloque C no bloquea la venta si el guion es honesto sobre el SIAT — y ya
lo es en el minuto 11-13.

---

## 6. Lo que el informe NO pudo verificar

- **Variables de entorno reales en Vercel** (proyecto `dental-gest`, `prj_foZ5wCg…`).
  No se usó navegador por indicación explícita. Todo lo dicho sobre flags apagadas se
  basa en los `.env` del repo, donde `PLATFORM_LAYER`, `AGENTS_RUNTIME` y
  `SIAT_EMISSION` están **ausentes** en los cuatro archivos.
- **Estado real de las migraciones en la base de producción.** Se infiere de los
  mensajes de commit (*"no aplicada"*) y de que las migraciones no están en `master`.
  Requiere consultar Supabase directamente.
- **Si los valores de `WHATSAPP_*`, `OPENAI_API_KEY` y `CHATWOOT_*` en `.env` son reales
  o placeholders.** Están presentes y con contenido, pero no se leyeron los secretos.
- **Comportamiento en vivo de la app** (login, recorrido real de pantallas). Toda la
  auditoría es estática sobre el código, más los tres gates de build ejecutados.

---

## 7. Los tres huecos más graves, en una línea cada uno

1. **Aprobar no manda nada.** El "wow" del minuto 7-11 no existe: `decideApproval`
   (`lib/onia-core/collab.ts:206-232`) sólo cambia un estado en la base.
2. **Nada de esto está en producción.** El módulo de agentes y la capa fiscal viven en
   una rama 31 commits adelante de `master`, que es lo que Vercel despliega
   (`docs/RUNBOOK.md:18`); `www.dentalgest.app` corre código del 8 de julio.
3. **Recepción sí ve la historia clínica.** El guion promete lo contrario y el sistema
   hace lo inverso (no ve la caja, sí ve la historia) — falsable en dos clics con un
   usuario STAFF.

---

Relacionado: `ONIA_KIT_VENTA_DENTAL_20260727.md` (guion auditado) ·
`sales-kit/02-GUION-DEMO.md` · `sales-kit/05-CHECKLIST-CAPTURAS.md` ·
`ONIA_ENFOQUE_20260727.md` · `ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md`
(bloqueo C1) · repo auditado: `C:\dev\proyectos\DentaGest\dental-saas` @ `fc94a20`.
