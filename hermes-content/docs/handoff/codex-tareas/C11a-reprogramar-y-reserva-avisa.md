# C11a · Reprogramar pide confirmar de nuevo, y la reserva online avisa (punto 11 de la 1.0 de Onia, parte 1 de 2)

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/punto-11-reprogramar-y-reserva-avisa`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
- **(a)** Mover una cita de hora la vuelve a «Pendiente» y le borra el link de confirmación viejo (`confirmToken`). Así la agenda no dice «Confirmada» de una hora que nadie confirmó, y el link viejo no confirma la hora nueva.
- **(b)** Una reserva que hace el paciente en `/book` avisa al profesional (campana y push) y aparece sola en la agenda abierta, como ya pasa con las citas que se cargan en el panel.

## PRUEBA DE HECHO
Tests verdes que prueban:
1. Una cita CONFIRMADA que se mueve sin mandar estado queda PENDIENTE y con `confirmToken` en null. Las marcas `reminder24hSentAt`, `reminder2hSentAt`, `whatsapp24hSentAt` y `whatsapp2hSentAt`, los booleanos `reminder24Sent`/`reminder2hSent` y `confirmTokenExpiresAt` NO aparecen en el `data` del update.
2. Si se mueve mandando `status: "CONFIRMADA"` (la recepción lo acordó por teléfono), queda CONFIRMADA, pero el `confirmToken` igual se limpia.
3. Cambiar solo las notas, o mandar la misma hora, no limpia nada: el `data` queda igual que hoy.
4. POST `/api/booking/appointments` que responde 201 llama UNA vez al aviso del profesional y UNA vez a `publicarCita`.
5. Si el aviso tira un error, la reserva igual responde 201.

Todo queda en UN commit en la rama.

## REGLA DE PARADA
- **No cambies:** el candado de horarios (`conElHorarioReservado`), `cambioQueMereceAviso` / `avisarCambioDeCita`, el cron de recordatorios ni las pantallas de agenda.
- **NO pongas en null las marcas `*SentAt` ni los booleanos de recordatorio.** Esas columnas son también el CONTADOR del cupo mensual: `whatsappDelMes` y `emailsDelMes` (`app/api/cron/appointment-reminders/route.ts:215-245`) cuentan las citas con esas marcas dentro del mes contra `WHATSAPP_ADDON_MONTHLY_LIMIT` y el cupo de correos del plan. Borrarlas le devuelve cupo a la clínica y le manda más WhatsApp de los pagados, que Onia le paga a Meta por mensaje. Volver a recordar la hora nueva cuando el recordatorio ya salió queda para otra tarea, con un registro de consumo aparte: anotalo en el resumen.
- **No toques `confirmTokenExpiresAt`:** también decide si sigue vivo el link de «Mis citas» de /book (`booking/appointments/route.ts:77-81` y el PATCH ~:405). Si se pusiera en null, una reserva de hace más de 30 días perdería su portal.
- **No agregues el correo de confirmación al paciente en la reserva pública:** hoy no existe, la reserva queda PENDIENTE, y es otra decisión.
- **Si ves que los agentes («Confirma») tienen acciones pendientes con la hora vieja,** anotalo y no lo toques.

## Contexto mínimo
- **Qué es:** Onia Platform es el SaaS de gestión de Onia para negocios de Bolivia. Hay 7 rubros: nada de «paciente» en textos genéricos (el vocabulario por rubro está en `lib/onboarding/vocabulario.ts`).
- **Stack:** Next.js 16 (App Router), React 19, Prisma 7 sobre el Postgres de Supabase self-hosted, Tailwind 4, tests con vitest. Es multi-tenant: todo se filtra por `organizationId`.
- **`master` es producción:** un cron del VPS lo publica cada 3 horas. Vos no empujás nada.
- **Antes de codear:**
  - De `AGENTS.md` alcanza con las reglas.
  - Leé la skill `.claude/skills/onia-backend/SKILL.md`.
  - No leas docs largos.
  - Next 16 cambia APIs: ante una duda, `node_modules/next/dist/docs/`.
- **Cómo leer el código:**
  - Por sección (`grep -n`, `sed -n 'a,bp'`).
  - Los comentarios largos explican POR QUÉ existe cada guarda: respetalos.
  - Si cambiás una regla, actualizá su comentario con la fecha (2026-10-06) y el motivo.

## Lo que hay hoy (medido sobre master 97fe306)
- **El PATCH de citas no cambia el estado al reprogramar:**
  - `app/api/appointments/[id]/route.ts`, en ~:122-136, hace `tx.appointment.update` dentro de `conElHorarioReservado(prisma, decidirReprogramacion(appointment, data), …)` y escribe solo `status`, `reason`, `notes` y `dateTime`.
  - Cuando cambia `dateTime`, deja la cita CONFIRMADA y deja vivo el `confirmToken` viejo.
  - Resultado: un paciente que confirmó el martes a las 10 y pidió pasar al jueves figura «Confirmada» el jueves sin haber confirmado nada, y si aprieta el link del correo del martes, «confirma» el jueves.
  - El cron (`app/api/cron/appointment-reminders/route.ts`) elige citas con `status in [CONFIRMADA, PENDIENTE]` y `reminder24hSentAt: null` (~:551-570). Si falta el token, lo regenera con `ensureConfirmToken` (~:86-91), que escribe `confirmToken` y `confirmTokenExpiresAt`. Si la cita se reprograma ANTES de que salga el recordatorio, el de la hora nueva sale solo.
- **`decidirReprogramacion(cita, cambios)`** (`lib/agenda/reprogramar-cita.ts:67`) devuelve algo distinto de null solo cuando llega un `dateTime` Y es distinto del que tiene la cita. Es el predicado correcto: usalo.
- **La reserva pública no avisa a nadie:**
  - `app/api/booking/appointments/route.ts`, en el POST, crea la cita dentro de una transacción (`tx.appointment.create` en ~:342, sin devolverla).
  - Después solo llama a `avisarSiElAltaPasoElTope` (~:360) y, si hubo reactivación, a `logAudit`. No publica en vivo ni avisa al profesional.
- **El alta del panel sí avisa:**
  - `lib/agenda/crear-cita.ts:131-134` llama a `avisarCitaCreada` (función privada, ~:236) y a `publicarCita("insert", aCitaEnVivo(appointment))`.
  - `aCitaEnVivo` y `publicarCita` están en `lib/realtime/publicar-cita.ts`. `aCitaEnVivo` solo necesita `{ id, organizationId }`.
  - `avisarCitaCreada` carga la org (para la zona horaria) y hace tres cosas: la notificación in-app (`prisma.notification.create`, con `recipientId: appointment.doctorId`), el push al profesional (`sendPushToUser`) y el correo de confirmación al paciente.
- **Tests que ya existen:** `app/api/appointments/[id]/route.test.ts`, `app/api/booking/appointments/route.test.ts`, `app/api/booking/appointments/reserva-reactiva.test.ts` y `lib/agenda/reprogramar-cita.test.ts`. Seguí sus patrones de mocks. Si un mock de `$transaction` devuelve `undefined`, los avisos nuevos lo tienen que tolerar (van en try/catch).

## Qué construir
### 1. Helper puro en `lib/agenda/reprogramar-cita.ts`
`camposAlReprogramar(input: { statusActual: AppointmentStatus; statusPedido?: AppointmentStatus | null })` devuelve el objeto que se mezcla en el `data` del update:
- **`status`:** si viene `statusPedido`, ese; si no, y el actual es CONFIRMADA, `PENDIENTE`; si no, el actual.
- **Token:** `confirmToken: null`. NADA más: ni las marcas de recordatorio ni `confirmTokenExpiresAt` (ver REGLA DE PARADA).

Con un doc comment que cuente el POR QUÉ (punto 11: la agenda no puede decir «Confirmada» de una hora que nadie confirmó) y POR QUÉ no se tocan las marcas (son el cupo mensual).

### 2. PATCH
Cuando `decidirReprogramacion(appointment, data)` no es null, mezclá esos campos en el `data` del `tx.appointment.update`. Si no hay reprogramación, el update queda EXACTAMENTE como hoy. El audit log ya guarda el status y la hora, viejos y nuevos.

### 3. `lib/agenda/crear-cita.ts`
- Separá de `avisarCitaCreada` una función exportada: `avisarAlProfesionalDeCitaNueva(organizationId, cita, opciones?: { origen?: "panel" | "reserva-online" })`.
  - Carga la zona horaria igual que hoy y hace la notificación in-app y el push.
  - `cita` es un tipo mínimo: `{ id, organizationId, doctorId, dateTime, reason, patient: { name } }`.
  - Con `origen: "reserva-online"`, el título es «Reserva online: {nombre}»; si no, el de hoy, «Nueva cita: {nombre}».
- `avisarCitaCreada` la llama y después manda el correo como hoy. Para el panel, el comportamiento es idéntico.

### 4. Reserva pública (POST)
- Hacé que la transacción devuelva la cita creada con lo necesario (`id`, `organizationId`, `doctorId`, `dateTime`, `reason`, y el nombre del paciente; podés usar `data.patientName`).
- Después de `avisarSiElAltaPasoElTope`, llamá a `avisarAlProfesionalDeCitaNueva(org.id, cita, { origen: "reserva-online" })` y a `publicarCita("insert", aCitaEnVivo(cita))`.
- Cada llamada va en su propio try/catch, que registra el error con el mismo helper de errores que ya usa el archivo (o `captureSentryError`) y NO tumba el 201: la reserva ya está guardada.
- No toques la validación de horarios de arriba de la transacción: la toca la parte 2 (feriados).

### 5. Tests
- `lib/agenda/reprogramar-cita.test.ts`: los casos de `camposAlReprogramar`, incluido que el objeto NO tiene claves de recordatorio ni `confirmTokenExpiresAt`.
- `app/api/appointments/[id]/route.test.ts`: los casos 1 a 3 de la PRUEBA. Verificá el `data` que recibe el update.
- `app/api/booking/appointments/route.test.ts`: los casos 4 y 5. Mockeá `@/lib/realtime/publicar-cita` y el aviso.
- Comando:
  ```
  npx vitest run lib/agenda "app/api/appointments" "app/api/booking" app/api/cron/appointment-reminders
  ```

## Reglas fijas (no negociables)
- **Nada de producción:** no deploy, no VPS, no SSH, no Supabase, no SQL contra ninguna base, no correos ni WhatsApp, no `git push`.
- **`node_modules` es un junction COMPARTIDO.** No corras `npm install`, `npm ci`, `npx prisma generate`, `prisma migrate` ni `prisma db push`. No agregues dependencias. Esta tarea NO lleva migración.
- **`npx tsc --noEmit` local puede fallar** por el cliente de Prisma compartido. El gate de tipos es el CI del PR. Igual, escribí tipos correctos.
- **Textos:**
  - lo que lee un paciente va de USTED;
  - lo que lee el profesional o el dueño va en el registro que ya usa el archivo;
  - en ninguna pantalla puede aparecer «muy pronto», «próximamente», «beta» ni «en construcción».
- **No toques archivos de otra cola:**
  - `lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts`, `lib/subscription-plans.ts` y la página `/precios`;
  - `app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx`;
  - nada de caja diaria;
  - `prisma/` entero, `lib/audit.ts` y `proxy.ts`;
  - `app/api/cron/appointment-reminders/route.ts` (solo se lee);
  - las pantallas de agenda (`app/(dashboard)/agenda`, `app/(dashboard)/appointments`);
  - en `booking/appointments/route.ts`, la validación de horarios: la toca otra tarea (feriados). Vos tocás solo la transacción y lo que viene después.
- **Windows:**
  - si `git status` muestra un `.snap` que no tocaste, hacé `git checkout -- <archivo>`;
  - fallan en Windows y NO son tuyos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).

## Cierre
1. Corré el comando de tests: tiene que estar verde. Si falla algo que no tocaste, comprobá que falle igual sin tus cambios (`git stash`, correr, `git stash pop`), anotalo y seguí.
2. Revisá `git status --short`: tienen que estar solo tus archivos.
3. `git add` de tus archivos y UN commit:
   ```
   fix(agenda): reprogramar pide confirmar de nuevo y la reserva online avisa — punto 11 de la 1.0

   <2-4 líneas con el POR QUÉ: mover una cita la dejaba «Confirmada» sin que nadie confirmara la hora nueva y con el
   link viejo vivo; las marcas de recordatorio no se tocan porque son el cupo mensual; la reserva de /book no avisaba
   ni aparecía sola en la agenda abierta.>

   Sin migración.
   Punto 11 de la 1.0 (parte 1 de 2) · Codex
   ```
   Sin push.
4. Si el sandbox no te deja escribir en `.git`: dejá los cambios sin commitear y escribí el mensaje completo en `CODEX_COMMIT.txt`, en la raíz. No lo agregues a git.
5. Resumen final: qué hiciste, los archivos, los tests corridos con su resultado, los textos nuevos y qué quedó afuera. Como mínimo: volver a mandar el recordatorio de la hora nueva cuando el de la vieja ya salió (necesita un registro de consumo aparte, con migración), y que `lib/agenda/sin-confirmar.ts` puede decir «Le mandamos el recordatorio» de la hora vieja.
