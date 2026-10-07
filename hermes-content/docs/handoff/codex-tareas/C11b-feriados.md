# C11b · Días cerrados (feriados) que la reserva online respeta (punto 11 de la 1.0 de Onia, parte 2 de 2)

## Precedencia Codex — plan de desarrollo sin despliegue, 6-oct

Sergio pidió definir el plan y continuar desarrollo después de la propuesta de separar código y publicación. Se reemplaza la exigencia histórica de esperar el merge de C11a para PROGRAMAR C11b: se permite una rama dependiente del HEAD revisado de PR115, `6f940cfc5868efd6de08724785816e86ccb2e3c7`, con ese SHA como ancestro comprobado (`git merge-base --is-ancestor`). La comprobación por texto de commit de abajo queda sustituida por esta prueba de ancestro. Antes de iniciar, verificar que PR115 conserva ese HEAD o revalidar su nuevo delta.

Rama propuesta `codex/punto-11-feriados`, checkout aislado en E. PR borrador dirigida inicialmente a la rama de PR115, de modo que su diff muestre únicamente feriados. No modificar la rama de C11a. Tras integrar C11a con aprobación específica, retarget a master y resolver/verificar sólo el delta que cambie. No auto-merge, autosync, deploy ni cambios reales de datos.

La dependencia funcional de C11a permanece; se elimina únicamente la dependencia de publicación para empezar a desarrollar. META y seis pruebas de hecho de este contrato siguen vigentes. Un autor Astra medium, revisión independiente del nuevo delta; no repetir la revisión de C11a. Leer y registrar paths exactos antes de editar, sin invadir C13/C5/P2. No instalación ni generación de dependencias compartidas.

**Estado: asignada y ejecución activa confirmada**, chat Platform Desarrollo `01a10f46-c910-79a3-9670-7e990fcb1257`, Astra medium. Sergio ordenó lanzar las sesiones en respuesta a propuesta de excepción de cuota hasta85% usado (actual80%). Sólo esta tanda, sin créditos/resets ni fan-out. Checkout `E:/ONIA-Codex/cierre-1.0-20261006/platform-feriados`; lease y revisión en `madre-codex.md`. Se permite commit y push exclusivamente de esta rama codex y draft PR contra `codex/punto-11-reprogramar-y-reserva-avisa`, no master. Esta autorización sustituye el «no push» histórico inferior. Todo texto nuevo de USTED; no revertir cambios ajenos aunque instrucciones históricas lo sugieran. No instalar dependencias ni regenerar Prisma compartido.

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/punto-11-feriados`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Después corré `git log --oneline -30 | grep -i "punto 11"`: tiene que aparecer el commit de la parte 1 («reprogramar pide confirmar de nuevo»). Si no aparece, PARÁ y decilo en el resumen: esta tarea se clona cuando la parte 1 ya está en master, porque las dos tocan el mismo archivo y el mismo test.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
Que el negocio cargue sus días cerrados (feriados) en Configuración › Horarios › Horario de atención, en TODOS los rubros con agenda (no solo dental). Esos días no aparecen horarios libres ni en la reserva online ni en la disponibilidad del panel, y la reserva online los rechaza.

## PRUEBA DE HECHO
Tests verdes que prueban:
1. Los helpers de feriados leen bien, ignoran la basura y rechazan fechas imposibles (2026-02-30).
2. `GET /api/booking/slots` en un día feriado devuelve `slots: []` y `cerrado: "feriado"`.
3. POST `/api/booking/appointments` en un feriado da 409 con un texto de usted, y no crea nada.
4. `/api/appointments/availability` en un feriado devuelve el día sin horarios libres y marcado como feriado.
5. PATCH `/api/clinic-settings/feriados`:
   - da 403 sin `config.write`;
   - con `holidays` mal formado da 400;
   - bien formado, guarda el JSON normalizado;
   - pasa el guard de rubro para un rubro con agenda que no es dental (estética).
6. Un día que no es feriado se comporta exactamente como hoy.

Todo queda en UN commit en la rama.

## REGLA DE PARADA
- **No agregues una lista automática de feriados de Bolivia.** Los móviles (Carnaval, Viernes Santo, Corpus Christi) cambian cada año: anotalo como idea en el resumen.
- **No bloquees el alta manual desde el panel:** la recepción puede abrir un feriado a propósito.
- **No toques el PATCH de citas ni `lib/agenda/crear-cita.ts`, ni el bloque posterior a la creación en `booking/appointments/route.ts`.** Son de la parte 1 (C11a).
- **No toques `app/(dashboard)/settings/page.tsx`:** ya carga `clinicSettings` entero (con `holidays`), y lo toca otra tarea.
- **No cambies los rubros de `"clinic-settings"` en el registro de rutas:** abriría a todos los rubros el resto de la configuración (prompt del bot, horarios). Los feriados van por una ruta propia.

## Contexto mínimo
- **Qué es:** Onia Platform es el SaaS de gestión de Onia para negocios de Bolivia. Hay 7 rubros: nada de «consultorio» ni «paciente» en textos genéricos (el vocabulario por rubro está en `lib/onboarding/vocabulario.ts`).
- **Stack:** Next.js 16 (App Router), React 19, Prisma 7 sobre el Postgres de Supabase self-hosted, Tailwind 4, tests con vitest. Es multi-tenant: todo se filtra por `organizationId`.
- **`master` es producción:** un cron del VPS lo publica cada 3 horas. Vos no empujás nada.
- **Antes de codear:**
  - De `AGENTS.md` alcanza con las reglas.
  - Leé las skills `.claude/skills/onia-backend/SKILL.md` y `.claude/skills/onia-frontend/SKILL.md`.
  - No leas docs largos.
  - Next 16 cambia APIs: ante una duda, `node_modules/next/dist/docs/`.
- **Cómo leer el código:** por sección (`grep -n`, `sed -n 'a,bp'`). Los comentarios largos explican POR QUÉ existe cada guarda: respetalos.

## Lo que hay hoy (medido sobre master 97fe306)
- **El campo existe y nadie lo usa:**
  - `clinic_settings.holidays` existe en `prisma/schema.prisma:1230` como `String?`, pensado como JSON.
  - `PATCH /api/clinic-settings` lo acepta (`app/api/clinic-settings/route.ts:14`, zod `holidays: z.string().optional()`, y en ~:67 lo guarda). Pero esa ruta llama a `requireVerticalRoute("clinic-settings")` (:22, :46) y está registrada SOLO para dental (`lib/platform/api-route-registry.ts:103`, `"clinic-settings": ["dentagest-clinical"]`): estética o servicios profesionales reciben 403. Y ninguna pantalla la llama.
  - NINGÚN cálculo lee `holidays`.
- **Registro de rutas:** `lib/platform/api-route-registry.ts`. Una ruta en `VERTICAL_API_ROUTES` tiene que llamar a `requireVerticalRoute(<clave>)` (`lib/platform/api-guard.ts`) en CADA handler; si no, falla `lib/platform/api-route-registry.test.ts`. `CON_AGENDA` (:43) son los rubros con agenda. Las líneas vecinas son `"appointments/availability": CON_AGENDA`, `"clinic-settings"`, `"doctor-schedules": CON_AGENDA` y `"doctor-schedules/[id]": CON_AGENDA` (~:101-105). Otro PR pendiente inserta una línea JUSTO ARRIBA de `"clinic-settings"`.
- **Los cálculos de horarios miran solo el día de la semana:**
  - `app/api/booking/slots/route.ts:49-75` lee `clinicSettings` con `select: { appointmentDurationMin, timezone }` y mira el horario del profesional por `dayOfWeek`. Recibe `date` ya como 'YYYY-MM-DD' civil.
  - `app/api/appointments/availability/route.ts:95-110` hace lo mismo, a partir del string `date`.
  - El POST de `app/api/booking/appointments/route.ts` valida el horario con `organizationId_doctorId_dayOfWeek`.
- **Zona horaria:** `lib/agenda/fecha-civil.ts` tiene `fechaCivilEnZona(fecha, zona)`, que da 'YYYY-MM-DD' en la zona del negocio. La zona es `clinicSettings.timezone`; por defecto, America/La_Paz.
- **Página pública `/book`:** `app/(public)/book/[orgSlug]/page.tsx`. Pide `/api/booking/slots` en ~:129-138 (guarda solo `d?.slots`). Cuando no hay horarios, en ~:423 pinta «No hay horarios disponibles por ahora.». La página todavía tiene textos de vos (pasarla a usted es otra tarea).
- **Configuración:**
  - `app/(dashboard)/settings/SettingsClient.tsx` es largo: leelo por sección.
  - La sección `horario-atencion` está declarada en `app/(dashboard)/settings/secciones.ts:81` y se muestra también a comercio, que no agenda.
  - **La sección hoy es SOLO DE LECTURA** (`SettingsClient.tsx:693-703`): pinta `modelo.filasHorario` y no tiene ni formulario ni botón de guardar.
  - `clinicSettings` llega como prop (tipo en :64). `settings/page.tsx` lo carga con `findUnique` sin `select`, así que `holidays` ya viene.
- **Tests que ya existen:** `app/api/booking/slots/route.test.ts`, `app/api/appointments/availability/route.test.ts` y `app/api/booking/appointments/route.test.ts`. Seguí sus patrones de mocks. Patrón de test de una ruta de configuración: `app/api/organization/route.test.ts`.

## Qué construir
### 1. Módulo puro `lib/agenda/feriados.ts`
Sin imports de servidor (lo usa también la pantalla). Con un comentario de porqué: punto 11, la agenda no puede ofrecer turnos el día que el negocio está cerrado.
- `leerFeriados(raw: string | null | undefined): string[]`. Con JSON inválido, o con elementos que no sean fechas 'YYYY-MM-DD' reales, ignora lo que no sirve. NUNCA tira.
- `esFeriado(fechaCivil: string, feriados: readonly string[]): boolean`.
- `normalizarFeriados(lista: unknown): { ok: true; valor: string } | { ok: false; error: string }`:
  - el `valor` es el JSON de un array sin repetidos y ordenado;
  - acepta solo fechas reales y como máximo 100;
  - si algo no cumple, el error es «Revisá las fechas de los días cerrados.».

### 2. Ruta nueva `app/api/clinic-settings/feriados/route.ts` (PATCH)
- En este orden: `requireAdmin()`, `await exigirPermisos(profile, "config.write")` y `await requireVerticalRoute("clinic-settings/feriados")`. Copiá el manejo de errores de `app/api/clinic-settings/route.ts`.
- El body es `{ holidays: string[] }` y pasa por `normalizarFeriados`. Si no da ok, 400 con el error.
- Hace upsert/update de `clinicSettings.holidays` de la organización del perfil con el JSON normalizado y devuelve `{ holidays: <array normalizado> }`.
- Registrala en `VERTICAL_API_ROUTES` como `"clinic-settings/feriados": CON_AGENDA,`, JUSTO DEBAJO de `"doctor-schedules/[id]": CON_AGENDA,`. NO la pongas al lado de `"clinic-settings"`: otro PR inserta una línea ahí.
- En `app/api/clinic-settings/route.ts`, el zod de `holidays` pasa también por `normalizarFeriados` (si no da ok, 400): así no hay dos validaciones distintas para la misma columna. No cambies nada más de esa ruta.

### 3. `booking/slots`
- Sumá `holidays: true` al `select` de `clinicSettings` que ya existe.
- Si `esFeriado(date, leerFeriados(holidays))`, devolvé la misma forma de respuesta que cuando el profesional no atiende ese día, con `slots: []` y además `cerrado: "feriado"`.
- En `/book`, cuando la respuesta trae `cerrado: "feriado"`, el texto es «Ese día no hay atención. Por favor, elija otra fecha.» (de USTED: lo lee el paciente). Guardá ese dato junto a `slots` en ~:136-138. El caso sin horarios sigue como está.

### 4. POST `booking/appointments`
Antes de crear nada, calculá la fecha civil de la cita en la zona del negocio con `fechaCivilEnZona`. Si es feriado, 409 con «Ese día no hay atención. Por favor, elija otra fecha.». Tocá solo la zona de validación, no la transacción ni lo que viene después.

### 5. `appointments/availability` (panel)
Si la fecha civil (en la zona del negocio) es feriado, el día sale sin horarios libres y con `feriado: true`. No bloquees el POST de citas del panel.

### 6. Pantalla
Dentro de «Horario de atención» en `SettingsClient.tsx`, debajo de las filas que ya se muestran y SOLO si `!esComercio`, un bloque «Días cerrados (feriados)» con:
- un `input type="date"` y el botón «Agregar»;
- la lista de fechas cargadas, en formato legible es-BO (por ejemplo, «lun 2 nov 2026»), con un botón para quitar cada una;
- el texto de ayuda «Esos días no se ofrecen horarios en la reserva online.».

**Cómo se guarda:** la sección no tiene botón de guardar, así que Agregar y Quitar guardan AL MOMENTO con PATCH a `/api/clinic-settings/feriados`, mandando la lista completa. Mientras guarda, el botón queda deshabilitado; si falla, el error se muestra debajo (`role="alert"`) y la lista vuelve a la anterior. El estado inicial sale de `leerFeriados(clinicSettings?.holidays)`.

Para la prop:
- Agregá `holidays?: string | null` al tipo `clinicSettings` (:64) sin reordenar el resto. Otra tarea agrega una prop al final de `Props`.
- No toques `settings/page.tsx`: ya lo carga.

Mismo estilo visual que los campos vecinos (`inputClass` y el botón «Agregar» de «Horarios de cada…»). No es una pantalla nueva: es un bloque dentro de una sección que existe.

### 7. Tests
- `lib/agenda/feriados.test.ts`.
- Los casos 2 a 4 y 6 de la PRUEBA, en los `route.test.ts` de slots, booking/appointments y availability.
- `app/api/clinic-settings/feriados/route.test.ts` con el caso 5, con el patrón de mocks de `app/api/organization/route.test.ts` (mockeá `requireVerticalRoute` como en los tests que ya lo usan).
- Comando:
  ```
  npx vitest run lib/agenda lib/platform app/api/booking app/api/appointments app/api/clinic-settings "app/(dashboard)/settings" "app/(public)/book" app/api/apis-de-plata-y-configuracion-piden-permiso.test.ts
  ```

## Reglas fijas (no negociables)
- **Nada de producción:** no deploy, no VPS, no SSH, no Supabase, no SQL contra ninguna base, no correos ni WhatsApp, no `git push`.
- **`node_modules` es un junction COMPARTIDO.** No corras `npm install`, `npm ci`, `npx prisma generate`, `prisma migrate` ni `prisma db push`. No agregues dependencias. Esta tarea NO lleva migración: la columna ya existe.
- **`npx tsc --noEmit` local puede fallar** por el cliente de Prisma compartido. El gate de tipos es el CI del PR. Igual, escribí tipos correctos.
- **Textos:**
  - lo que lee un paciente va de USTED;
  - lo del panel del dueño va en el registro que ya usa el archivo (hoy vos). Pasar a los dueños a usted es una decisión pendiente de Sergio Urcullo;
  - en ninguna pantalla puede aparecer «muy pronto», «próximamente», «beta» ni «en construcción».
- **No toques archivos de otra cola:**
  - `lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts`, `lib/subscription-plans.ts` y la página `/precios`;
  - `app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx`;
  - `PlanClient.tsx`, `settings/page.tsx` y la prop `renovacion` de SettingsClient (otra tarea);
  - nada de caja diaria;
  - `prisma/` entero, `lib/audit.ts` y `proxy.ts`.
- **Windows:**
  - si `git status` muestra un `.snap` que no tocaste, hacé `git checkout -- <archivo>`;
  - fallan en Windows y NO son tuyos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).

## Cierre
1. Corré el comando de tests: tiene que estar verde. Si falla algo que no tocaste, comprobá que falle igual sin tus cambios (`git stash`, correr, `git stash pop`), anotalo y seguí.
2. Revisá `git status --short`: tienen que estar solo tus archivos.
3. `git add` de tus archivos y UN commit:
   ```
   feat(agenda): días cerrados del negocio que la reserva online respeta — punto 11 de la 1.0

   <2-4 líneas con el POR QUÉ: holidays existía en la base pero ninguna pantalla lo escribía, ningún cálculo lo leía
   y la única ruta que lo aceptaba era solo de dental; /book ofrecía turnos el día que el negocio está cerrado.>

   Sin migración.
   Punto 11 de la 1.0 (parte 2 de 2) · Codex
   ```
   Sin push.
4. Si el sandbox no te deja escribir en `.git`: dejá los cambios sin commitear y escribí el mensaje completo en `CODEX_COMMIT.txt`, en la raíz. No lo agregues a git.
5. Resumen final: qué hiciste, los archivos, los tests corridos con su resultado, los textos nuevos y qué quedó afuera. Como mínimo: la lista automática de feriados de Bolivia, y que /book sigue mezclando vos y usted hasta que se pase entera.
