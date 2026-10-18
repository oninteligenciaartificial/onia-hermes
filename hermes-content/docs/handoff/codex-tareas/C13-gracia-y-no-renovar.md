# C13 · 7 días de gracia al plan pago y botón «Dejar de renovar» (punto 13 de la 1.0 de Onia)

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/punto-13-gracia-y-no-renovar`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
- **(a)** Un plan PAGO vencido sigue con acceso completo 7 días antes de pasar a solo lectura. El dueño lo ve avisado en el panel, en Mi plan, en el correo y en la campana, y ninguna pantalla le dice «solo lectura» mientras dura la gracia.
- **(b)** El dueño puede apretar «Dejar de renovar» en Configuración › Mi plan, sin escribirle a nadie, y deshacerlo mientras la baja no haya cortado.

## PRUEBA DE HECHO
Tests verdes que prueban:
1. `planAccessLevel` con `planEnd` de hace 3 días da "full"; con `planEnd` de hace 8 días da "read_only".
2. Una baja efectiva (`planCanceledAt` en el pasado) da "read_only" sin gracia, igual que hoy.
3. Una prueba gratis vencida hace 2 días, sin plan pago, da "read_only": la gracia del trial sigue en 1 día.
4. `extendPlanEnd` pagando 3 días después del vencimiento renueva desde el vencimiento viejo. Pagando 10 días después, renueva desde hoy.
5. POST `/api/organization/renovacion`:
   - da 403 sin `config.write`;
   - da 409 sin plan pago;
   - `{renovar:false}` con plan vigente deja `planCanceledAt = planEnd`;
   - `{renovar:true}` con una baja programada deja `null`;
   - `{renovar:true}` con la baja ya efectiva da 409.
6. Mientras dura la gracia, el aviso «vencido» del panel, del correo y de la campana ya no dice que la cuenta quedó en solo lectura.
7. Mi plan, con un plan pago vencido hace 3 días, NO muestra «Cuenta en modo de solo lectura» (`PlanClient.estado-real.test.ts`).

Todo queda en UN commit en la rama.

## REGLA DE PARADA
- **No cambies:**
  - `GRACE_PERIOD_DAYS`, que es la gracia del trial; la usan `lib/whatsapp-onia/activacion.ts`, `lib/plan-limits.ts` y la FAQ;
  - `lib/subscription/baja.ts`;
  - `lib/plan-limits.ts` (`getTrialStatus` sigue siendo solo del trial);
  - `proxy.ts`;
  - `lib/audit.ts`, que tiene un parche pendiente de aplicar que necesita su contexto intacto. Para la auditoría usá la acción que ya existe, `PLAN_CHANGED`.
- **No hagas la gracia distinta por ciclo.** Hay plan semanal: 7 días de gracia equivalen a un ciclo entero. Anotalo en el resumen como decisión para Sergio Urcullo.
- **Los Términos no se tocan.** Los publicados (§3.4) dicen que, si el pago no se confirma al vencimiento, la cuenta pasa a solo lectura. Son texto legal y viven en OTRO repo. Dejá en el resumen el texto propuesto para el §3.4; lo aprueba Sergio Urcullo. Dar más plazo que el contrato no lo incumple.

## Contexto mínimo
- **Qué es:** Onia Platform es el SaaS de gestión de Onia para negocios de Bolivia. Hay 7 rubros; el vocabulario por rubro está en `lib/onboarding/vocabulario.ts`.
- **Stack:** Next.js 16 (App Router), React 19, Prisma 7 sobre el Postgres de Supabase self-hosted, Tailwind 4, tests con vitest. Es multi-tenant: todo se filtra por `organizationId`.
- **Cómo se cobra:** por QR del BCP y con revisión humana. No hay débito automático, así que un pago que llega 2 días tarde es lo normal, no una mora.
- **`master` es producción:** un cron del VPS lo publica cada 3 horas. Vos no empujás nada.
- **Antes de codear:**
  - De `AGENTS.md` alcanza con las reglas.
  - Leé las skills `.claude/skills/onia-backend/SKILL.md` y `.claude/skills/onia-frontend/SKILL.md`.
  - No leas docs largos.
  - Next 16 cambia APIs: ante una duda, `node_modules/next/dist/docs/`.
- **Cómo leer el código:**
  - Por sección (`grep -n`, `sed -n 'a,bp'`).
  - Los comentarios largos explican POR QUÉ existe cada guarda: respetalos.
  - Al cambiar una regla, actualizá su comentario con la fecha (2026-10-06) y el motivo.

## Lo que hay hoy (medido sobre master 97fe306)
- **Estado del plan:** se deriva de fechas en `lib/subscription/plan-state.ts`, que es la fuente única.
  - `GRACE_PERIOD_DAYS = 1` (:32) es la gracia del TRIAL.
  - `graceDeadline()` (:84-90) devuelve `planEnd` tal cual para un plan pago: quien paga un día tarde queda en solo lectura el mismo día. El comentario lo dice: «la gracia es SOLO del trial».
  - El corte lo aplican, todos con `isWriteBlocked`/`planAccessLevel`: `proxy.ts:286-300` (vía `cuentaEnSoloLectura`, de `lib/subscription/escrituras-en-solo-lectura.ts:71`), el layout del panel, los crons, el bot y la reserva pública. Cambiando `plan-state.ts`, cambia todo junto.
- **La EXCEPCIÓN, Mi plan:** `app/(dashboard)/settings/PlanClient.tsx:595` NO usa `planAccessLevel`. Calcula `soloLectura = planStatus === "canceled" || (planStatus === "past_due" && !trialStatus?.isInGrace)`. `trialStatus` sale de `getTrialStatus` (`lib/plan-limits.ts:69`), que devuelve `isInGrace: false` para toda org con `planEnd`. Con la gracia nueva, Mi plan diría «Cuenta en modo de solo lectura» (:683) y apagaría la agenda pública (:612) a una cuenta que tiene acceso completo. El banner «Periodo de gracia» (~:658) hoy es solo del trial.
- **`extendPlanEnd`** (plan-state.ts, al final) renueva desde el vencimiento vigente si todavía no venció, y desde HOY si ya venció. Con 7 días de gracia, eso le regalaría hasta 7 días por ciclo a quien paga siempre en la gracia. Lo llama `buildPlanActivation` en `lib/subscription/activation.ts`.
- **Avisos:**
  - `lib/subscription/vencimientos.ts` (~:155-180). Paso 0 del plan: «Tu plan venció. Renovalo para seguir registrando» / «Tu cuenta quedó en solo lectura (los datos están intactos)…».
  - El correo de renovación en `lib/email.ts` (~:1145-1215, según `step`). El paso 1 dice «Después del corte tu cuenta pasa a solo lectura» y el paso 0, «Tu cuenta quedó en solo lectura…».
  - La banda grande del panel, `lib/subscription/aviso-renovacion.ts`. Su cabecera dice «Vencido NO es de este aviso: ahí manda AvisoSoloLectura». Con la gracia, entre el vencimiento y el corte NO se vería ningún aviso, y eso hay que cerrarlo.
  - `lib/subscription/aviso-solo-lectura.ts` aparece recién con el corte y queda como está.
  - El cron (`lib/subscription/renewal-reminders.ts`) manda el paso 0 hasta `VENCIDO_MAX_DIAS = 7` días después del vencimiento, que coincide con la gracia.
- **La baja:**
  - Es `organizations.planCanceledAt`. `lib/subscription/baja.ts` → `planCanceledAtTrasOrden({ darDeBaja, planEnd, ahora })`: si queda periodo pago, la baja es al FINAL del periodo; si no, es inmediata.
  - `explicarBaja()` arma un texto PARA EL OPERADOR: tercera persona y fecha ISO. No sirve tal cual para el dueño.
  - Hoy solo la escribe el operador (`app/api/admin/clinics/route.ts:251-257`).
  - El aviso de baja programada ya existe y se ve en todo el panel: `lib/subscription/baja-programada.ts`, `components/AvisoBajaProgramada.tsx` y `app/(dashboard)/layout.tsx:36`.
  - Al activar un pago, `activation.ts` pone `planCanceledAt: null`.
  - Los Términos §3.3 dan derecho a NO RENOVAR sin penalidad.
- **Pantalla:**
  - `app/(dashboard)/settings/PlanClient.tsx` tiene 1.248 líneas: leelo por sección.
  - Se pinta desde `app/(dashboard)/settings/SettingsClient.tsx:874`, que recibe sus datos de `app/(dashboard)/settings/page.tsx`. Esa página ya exige `config.write` (:32) y ya lee la organización entera (`include: { organization: true }`; `derivePlanStatus(profile.organization)` en ~:82).
- **Rutas nuevas:**
  - Cada `app/api/**/route.ts` nueva tiene que figurar en `lib/platform/api-route-registry.ts`; si no, falla `lib/platform/api-route-registry.test.ts`.
  - En el dominio `organization` tiene que preguntar `await exigirPermisos(profile, "config.write")`; si no, falla `app/api/apis-de-plata-y-configuracion-piden-permiso.test.ts`.
  - Patrón a copiar: `app/api/organization/qr-cobro/route.ts` (requireAdmin, exigirPermisos, logAudit). Patrón de test: `app/api/organization/route.test.ts`.

## Qué construir
### 1. `plan-state.ts`
- `export const PAID_GRACE_DAYS = 7;`, con un comentario: punto 13 de la 1.0; el cobro es por QR manual y un pago que entra tarde no puede dejar a la clínica sin agendar.
- `graceDeadline` del plan pago pasa a ser `planEnd + PAID_GRACE_DAYS` días. La gracia del trial queda como está.
- `canceled` sigue degradando a `read_only` SIN gracia: el cliente pidió irse.
- Exportá `fechaDeCorte(dates: PlanDates): Date | null`. Es la MISMA fecha con la que corta `planAccessLevel`: que los avisos la lean de ahí, sin recalcularla al lado.
- Actualizá el comentario de cabecera y el de `graceDeadline`: la regla vieja «un contrato pago corta el día que vence» deja de existir. Decí desde cuándo y por qué.

### 2. `extendPlanEnd`
- Si `currentPlanEnd` venció hace como mucho `PAID_GRACE_DAYS` días, la base es `currentPlanEnd`: renovar dentro de la gracia no regala días.
- Si venció hace más, la base es hoy, como ahora.
- Comentá el porqué y revisá los tests de `lib/subscription/activation.test.ts` que dependan de esto.

### 3. Avisos
Los textos del dueño van en el registro de los archivos (hoy, vos). Listalos en el resumen.
- **`vencimientos.ts`, paso 0 del plan:**
  - título: «Tu plan venció: renovalo antes del {corte}»;
  - mensaje: «Hasta el {corte} seguís usando todo. Después la cuenta queda en solo lectura (los datos se conservan). {comoSeRenueva}».
  - La fecha de corte entra como argumento, formateada con el MISMO formateador que `venceElLabel`. Buscá los llamadores con `grep -rn "venceElLabel\|textoDelAviso" lib app`.
  - El aviso del add-on NO cambia.
- **`lib/email.ts`:** solo el correo de renovación del PLAN. El paso 0 va igual que arriba. El paso 1 tiene que decir que, después del vencimiento, hay 7 días para renovar antes de que la cuenta quede en solo lectura. No toques otros correos.
- **`aviso-renovacion.ts`:** durante la gracia de un plan pago (vencido, sin baja y sin corte), la banda grande aparece con «Tu plan venció el {fecha}. Te quedan {N} días para renovarlo antes de que la cuenta quede en solo lectura.» y el mismo botón a renovar que ya usa. Una cuenta cancelada sigue sin banda. Actualizá su cabecera.
- **`lib/ayuda/faq.ts`:** si alguna respuesta dice qué pasa cuando vence un plan PAGO, alineala. La del trial (~:321) queda. `lib/ayuda/faq-promesas.test.ts` tiene que seguir verde.

### 4. Ruta nueva `app/api/organization/renovacion/route.ts` (POST)
- `requireAdmin()` y después `await exigirPermisos(profile, "config.write")`.
- El body se valida con zod: `{ renovar: z.boolean() }`. Si no cumple, 400.
- Lee `planEnd` y `planCanceledAt` de la organización.
- **Sin `planEnd`** (trial o alta manual): 409 con «Tu cuenta no tiene un plan pago que renovar.»
- **`renovar: false`:** escribe `planCanceledAt = planCanceledAtTrasOrden({ darDeBaja: true, planEnd, ahora })`.
- **`renovar: true`:**
  - si `planCanceledAt` está en el futuro, lo pone en `null`;
  - si ya está vigente (en el pasado), 409 con «La baja ya está vigente: para volver, pagá un plan desde Mi plan.»;
  - si no hay baja, 200 sin cambios.
- **Auditoría:** `logAudit` con `action: "PLAN_CHANGED"` y `newValue: { renovar, planCanceledAt }`. No toques `lib/audit.ts`.
- **Respuesta:** `{ planCanceledAt, explicacion }`, con `explicacion = explicarBaja(...)` cuando se da de baja. **La pantalla del dueño NO muestra `explicacion`** (es texto del operador): arma su propio texto con la fecha formateada.
- **Registro:** agregá `"organization/renovacion"` en `lib/platform/api-route-registry.ts`, JUSTO DEBAJO de `"organization/qr-cobro"` (~:272) y con una línea de comentario como las vecinas. No la agregues a `ESCRITURAS_PERMITIDAS_EN_SOLO_LECTURA`: una cuenta ya cortada no tiene nada que dejar de renovar.

### 5. Mi plan
- **Prop nueva:** al FINAL de la interfaz `Props` de `SettingsClient.tsx` (después de `cuentaInterna`), agregá:
  ```ts
  renovacion?: { planEnd: string | null; planCanceledAt: string | null; soloLectura: boolean; corte: string | null };
  ```
  - Va ahí y no dentro de `organization`, porque otra tarea toca las líneas de arriba.
  - La arma `page.tsx` con la organización que ya lee. Las fechas van en ISO; `soloLectura = planAccessLevel(org) === "read_only"` y `corte = fechaDeCorte(org)`. Agregá el prop al final del JSX de `<SettingsClient … />` (después de `cuentaInterna`).
  - `SettingsClient` la destructura y se la pasa a `PlanClient` en ~:874.
- **Arreglar la excepción de Mi plan (`PlanClient.tsx:595`):** `const soloLectura = renovacion ? renovacion.soloLectura : <la expresión de hoy>`. Así Mi plan usa la MISMA regla que el resto (`planAccessLevel`) y deja de decir «solo lectura» durante la gracia paga.
- **Durante la gracia paga** (`planStatus === "past_due"`, `!renovacion.soloLectura` y sin trial en gracia): reusá el bloque «Periodo de gracia» que ya existe (~:658), con su estilo, y el texto «Tu plan venció el {fecha}. Hasta el {corte} seguís usando todo; después la cuenta queda en solo lectura.» y el mismo botón que ya tiene. El texto del trial queda igual para el trial.
- **Con plan pago vigente (`planEnd` en el futuro) y sin baja:** un botón secundario «Dejar de renovar», con el mismo componente `Button` y la variante secundaria que ya usa el archivo.
  - Antes de mandar nada, confirma con: «Tu plan sigue completo hasta el {fecha}. Desde ese día la cuenta queda en solo lectura: vas a poder consultar y exportar todo, pero no registrar nada nuevo. ¿Dejar de renovar?».
  - Si el archivo ya usa un diálogo, usá ese; si no, `window.confirm`.
  - Después hace POST `{ renovar: false }` y recarga.
- **Con una baja programada (`planCanceledAt` en el futuro):** la línea «No se renueva: termina el {fecha}.» y el botón «Seguir renovando», que hace POST `{ renovar: true }`.
- **Sin botón:** en el trial, en las cuentas internas (la sección Mi plan ya no se muestra a la cuenta interna) y sin plan pago.
- No es una pantalla nueva: es un botón y un aviso en una sección que existe, con su estilo.

### 6. Tests
- **`lib/subscription/plan-state.test.ts`:** reemplazá el test «la gracia es SOLO del trial: un contrato pago corta el dia que vence» (:131) por la regla nueva y sumá los casos 1 a 4 de la PRUEBA DE HECHO.
- **Tests que suponían el corte el mismo día:** corré y arreglá, como mínimo, `lib/subscription/renewal-reminders.test.ts`, `aviso-solo-lectura.test.ts`, `aviso-renovacion.test.ts`, `vencimientos.test.ts`, `app/api/cron/appointment-reminders/cuenta-viva.test.ts`, `lib/agenda/reserva-publica.test.ts`, `app/(dashboard)/settings/PlanClient.estado-real.test.ts`, `app/components/trial-vencido-cumple-la-promesa.test.ts`, `lib/whatsapp/atiende-el-bot.test.ts`, `lib/whatsapp-onia/activacion.test.ts`, `app/api/chatbot-canal-web`, `app/api/chatbot-canal-whatsapp` y `app/api/puertas-sin-sesion-preguntan-si-la-cuenta-vive.test.ts`. Cambiá la EXPECTATIVA solo donde la razón era la regla vieja, y que el nombre del test diga la regla nueva.
- **Barrido:** antes de cerrar, `grep -rln "planAccessLevel\|isWriteBlocked\|cuentaEnSoloLectura\|solo lectura" --include=*.test.ts --include=*.test.tsx . | grep -v node_modules`, y corré también los que no estén en el comando.
- **`app/api/organization/renovacion/route.test.ts`:** los casos del punto 5 de la PRUEBA, con el patrón de mocks de `app/api/organization/route.test.ts`.
- **Banda del panel:** un test de `aviso-renovacion` durante la gracia (aparece, con los días que quedan) y con la cuenta cancelada (no aparece).
- Comando:
  ```
  npx vitest run lib/subscription lib/agenda lib/ayuda lib/platform lib/whatsapp lib/whatsapp-onia lib/onia-core/modules app/components app/api/organization app/api/cron app/api/chatbot-canal-web app/api/chatbot-canal-whatsapp "app/(dashboard)/settings" app/api/apis-de-plata-y-configuracion-piden-permiso.test.ts app/api/puertas-sin-sesion-preguntan-si-la-cuenta-vive.test.ts
  ```

## Reglas fijas (no negociables)
- **Nada de producción:** no deploy, no VPS, no SSH, no Supabase, no SQL contra ninguna base, no correos ni WhatsApp, no `git push`.
- **`node_modules` es un junction COMPARTIDO.** No corras `npm install`, `npm ci`, `npx prisma generate`, `prisma migrate` ni `prisma db push`. No agregues dependencias. Esta tarea NO lleva migración.
- **`npx tsc --noEmit` local puede fallar** por el cliente de Prisma compartido. El gate de tipos es el CI del PR. Igual, escribí tipos correctos.
- **Textos:**
  - lo que lee un paciente va de USTED;
  - lo del panel del dueño va en el registro que ya usa el archivo (hoy vos). Pasar a los dueños a usted es una decisión pendiente de Sergio Urcullo, y mezclar dos registros en una pantalla se ve roto;
  - en ninguna pantalla puede aparecer «muy pronto», «próximamente», «beta» ni «en construcción».
- **No toques archivos de otra cola:**
  - `lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts`, `lib/subscription-plans.ts` y la página `/precios`;
  - `app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx`;
  - `components/billing/QRPaymentModal.tsx` (es de otra tarea);
  - nada de caja diaria;
  - `prisma/` entero (no hay migración);
  - `lib/audit.ts` y `proxy.ts`;
  - el checkout y `/admin/payments`.
- **Windows:**
  - si `git status` muestra un `.snap` que no tocaste, hacé `git checkout -- <archivo>`;
  - fallan en Windows y NO son tuyos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).

## Cierre
1. Corré el comando de tests y el barrido: tienen que estar verdes. Si falla algo que no tocaste, comprobá que falle igual sin tus cambios (`git stash`, correr, `git stash pop`), anotalo y seguí.
2. Revisá `git status --short`: tienen que estar solo tus archivos.
3. `git add` de tus archivos y UN commit:
   ```
   feat(plan): 7 días de gracia al plan pago y botón «Dejar de renovar» — punto 13 de la 1.0

   <2-4 líneas con el POR QUÉ: el cobro es por QR manual y un pago que entra tarde cortaba la clínica el mismo día;
   renovar en la gracia no regala días; Mi plan deja de decir «solo lectura» durante la gracia; el contrato ya concede
   no renovar y solo el operador podía registrarlo.>

   Sin migración. Pendiente de Sergio Urcullo: texto de Términos §3.4 (en el PR) y la gracia del plan semanal.
   Punto 13 de la 1.0 · Codex
   ```
   Sin push.
4. Si el sandbox no te deja escribir en `.git`: dejá los cambios sin commitear y escribí el mensaje completo en `CODEX_COMMIT.txt`, en la raíz. No lo agregues a git.
5. Resumen final: qué hiciste, los archivos, los tests corridos con su resultado, los textos nuevos visibles (para pasarlos a usted si Sergio Urcullo lo decide), el texto propuesto para los Términos §3.4, la nota sobre el plan semanal y qué quedó afuera.
