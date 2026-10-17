# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_014HGgof9kHQkdLXhsZsAq6A` (1-oct-2026, sucesora de `session_01VGmpNv4eSMnpA3wXrypR4L`).
La sesión **madre** (local, PC de Sergio Urcullo) controla lo que exige la PC y le habla a la nube con `claude -p --cloud`;
el reparto de tareas es de la jefa (`AGENTS.md` §1; skill `onia-sesion-madre`). Las respuestas se escriben en el transcript
propio: la nube no puede mandar mensajes. Historia anterior: `git log -- hermes-content/docs/handoff/onia-1.0-nube.md`.

## 0. Al arrancar (medido 1-oct)

- La sesión de Plataforma abre en `/home/user` con los DOS repos y **no carga** el hook SessionStart de onia-hermes:
  `ssh onia-vps` da «Could not resolve hostname» aunque las 3 variables estén. Arreglo:
  `cd /home/user/onia-hermes && node scripts/nube-ssh-vps.mjs` (anotado en la skill `onia-infra`).
- `onia-platform` nace **sin `node_modules`**: `npm ci` (≈45 s) + `npx prisma generate` antes de correr tests.
- Las ramas de trabajo son `claude/<nombre-de-la-sesión>` en los dos repos (regla del entorno: no se pushea a otra).

## 1. Objetivo

Desarrollar y publicar Onia Platform 1.0 hasta cobrar al primer cliente. Qué sale y qué falta:
`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (§6 «Lo que falta para cobrar»).

## 2. Qué quedó EN PRODUCCIÓN (verificado)

- **5-oct, release `97fe3061` (prod hoy):**
  - punto 2 de la 1.0 (#111): checkout «factura por correo después de verificar el pago» + aclaración del titular del QR;
  - punto 12 (#109, Codex): CSV con «;» y BOM + WhatsApp de soporte en `/help`.
  - Verificado en el bundle; las pantallas piden login (se miran con la QA `+qapago`).
- **4-oct, release `ed40eaaa` (#108):**
  - P1 (tratamiento a medias en la prueba), P3 (Deuda, Mañana sin confirmar, Reprogramada) y textos a pacientes de USTED;
  - B22: el canal de citas lleva solo `{id}` y la agenda le pide la cita a la API; GET/PATCH de la cita con `select`
    cerrado; la reserva pública no muestra el motivo de otras citas.
  - Verificado: bundle `payload:{id}`, usted 3 / voseo viejo 0, login a 390 y 1440 renderizado.
  - Las 2 tablas abiertas a anon siguen en 200 hasta correr el SQL (§6).

- **Regla vigente (17-oct, `AGENTS.md` §4 «Quién decide»):** lo técnico que pasa los gates (revisión de Codex o de un
  revisor independiente, tsc y tests) se publica sin consultarle. Antes va a Sergio Urcullo lo visual (pantalla o sección
  nueva, rediseño, marca, piezas de contenido) y lo serio (textos legales, precios o cifras, gasto, terceros, datos reales
  de producción, borrado sin copia, secretos y permisos). La regla del 2-oct («solo diseño nuevo y legales») quedó
  superada. No se le habla de PRs.
- **Alcance congelado (madre, 2-oct):** solo se termina lo asignado; lo nuevo va a pendientes. Excepciones con OK de
  Sergio Urcullo del 3-oct: el arreglo de seguridad del botón, el barrido de promesas de la web y el estudio del SIAT.
- **Plataforma en `release-13b67dda`** (3-oct 16:21 UTC, «PUBLICADO Y VERIFICADO», rollback
  `onia-platform-prev-u40ks7ma-20261003-162118`). Lleva, en orden:
  - #99 Recall de tratamiento a medias (2-oct).
  - #102 `POST /api/onia-core/demo` solo SUPERADMIN (cualquier dueño creaba orgs Profesional eternas).
  - #106 **CRITICAL** (madre v2): el botón del recordatorio solo vale desde el inbox de WhatsApp de la org; antes un
    anónimo del widget web cancelaba la cita de otro paciente. Rastro de uso: ninguno (solo la org interna tiene
    inboxes; 0 citas con recordatorio por WhatsApp; 0 avisos de confirmar/cancelar desde el 1-oct). Bundle vivo sin la
    respuesta vieja («No encontramos una cita próxima» ausente).
  - #107 tablero interno «La operación» con números exactos: solo clientes (hoy 0 de 5 pagando, Bs 0; antes decía
    Bs 390 del chatbot regalado de la org interna). Regla única `motivoDeCuentaDeLaCasa`
    (`lib/platform/cuentas-que-no-son-clientes.ts`), también en `/admin/metricas`. Sergio Urcullo aprobó las capturas.
    **Falta MIRARLO en prod con su sesión de superadmin** (la nube no tiene esa cuenta).
- **Web `onia.com.bo`:** 3-oct, `main` `baf02e9df` + RND 38 (`f3282e8d1`, publicándose al escribir esto): titular
  desde el HTML del servidor (sin esperar JS), promesas alineadas con el catálogo (fuera «entiende fotos», «el
  tratamiento a medias no se pierde», «agenda por profesional», «te devuelven clientes»), y `/facturacion` +
  `/guia-facturacion` dicen que la RND 102600000038 (30-sep) dejó sin efecto el plazo del 1-oct. Mirada en vivo a 390 y
  1440 (antes de la RND 38): 0 de las promesas, 0 errores, 0 desbordes, `/precios` sin JS con el h1 visible.
- **Bot de ventas:** publicado 3-oct desde `e630e103c` (37 archivos, responde) y otra vez con la RND 38 (`f3282e8d1`).
  Ya no confirma demos que no agendó (agenda y voz apagadas por config con default seguro); suite 1639/1639.
- **Cuenta demo de venta «Clínica Demo Onia»** (`cmur09d75000601mz12vg59qn`, `oninteligenciaartificial+demo@gmail.com`):
  sembrada el 2-oct con OK explícito de Sergio Urcullo (backup antes: `/root/backups/pre-demo-20261002-1345/`). 25
  pacientes, 50 citas, 28 cobros, 2 tratamientos a medias (Natalia Terceros, Marcelo Vargas). 0 canales de envío,
  pacientes sin correo, teléfonos de ficción `+44 7700 900xxx`. Scripts y método: `onia-platform/scripts/demo-venta/` +
  skill `onia-db`.
- **Cuenta QA del chip «ZZ QA Clínica Chip»** (`cmuqzov3y000001mzmrcq0i2t`, `oninteligenciaartificial+qachip@gmail.com`),
  creada por el alta real el 2-oct. La clave se dio por chat a pedido de Sergio Urcullo: tratarla como expuesta (se le
  pidió cambiarla en /profile).
- Producción: `ONIA_VERIFICACION_WHATSAPP=plantillas`, `ONIA_ALTA_AUTOMATICA=abierta`, `ONIA_REGISTRO_CONFIRMA_CORREO=si`.

## 3. Qué quedó a medias y dónde

| Qué | Dónde | Estado |
|---|---|---|
| SQL del B22 (REVOKE + default privileges) | `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql` | Mergeado, NO aplicado. Solo con el OK textual de Sergio Urcullo. Después: GET anon a `/rest/v1/onia_whatsapp_sends` → 401 y 0 grants |
| P2 presupuesto por fases | `hermes-content/docs/cola/capturas-presupuesto-fases/presupuesto-por-fases-p2.patch` (aplica limpio sobre `ed40eaaa`) + capturas | Espera el OK de Sergio Urcullo (diseño nuevo). Con OK: `git apply`, PR, CI, publicar |
| Punto 1: cobro de punta a punta | QA «ZZ QA Pago» (`oninteligenciaartificial+qapago@gmail.com`, dental), creada por `/register` el 5-oct; clave solo en el scratchpad de la sesión | Falta confirmar su correo (Gmail de Onia). Después: checkout Básico con comprobante «PRUEBA», Sergio aprueba en `/admin/payments` SIN facturar, verificar plan activo. Si la sesión muere, la clave se pierde: «Recuperar acceso» |
| Plantillas A/B de los leads de agosto | texto aprobado en el transcript del 3-oct | NO creadas (el control de permisos lo frenó desde la nube). Las crea Sergio Urcullo en WhatsApp Manager o lo pide él en la sesión. No se mandan hasta que Ventas arme el seguimiento |
| Caja diaria (#110, Codex) | rama `codex/punto-8-caja-diaria` | Aprobada por la madre v2. Faltan las capturas: sin abrir; abierta con 4 cobros y 1 egreso; cerrada con descuadre; como dueño y como recepción. Van a `hermes-content/docs/cola/capturas-caja-diaria/`. No se publica sin OK; la migración `20261004190000` va ANTES del swap |
| Prueba del chip, demo, SIAT | orgs «ZZ QA Clínica Chip» y «Clínica Demo Onia»; `/opt/onia-siat/runner-20260929/` | Sin cambios (§6) |

## 4. Archivos

- Plataforma: `lib/whatsapp/respuesta-al-recordatorio.ts`, `lib/whatsapp/plantilla-recordatorio.ts`,
  `lib/agenda/aviso-respuesta-del-paciente.ts` (aviso compartido con `/cita`), `lib/chatwoot.ts`
  (`MARCA_ENVIO_AUTOMATICO`), `app/api/webhooks/chatwoot/route.ts`. Skill `onia-backend` actualizada.
- Bot: `chatwoot-adapter.mjs` (`esBotonDelRecordatorio`, `takeoverTurn`), `knowledge.mjs` (`esInboxDeCliente`),
  `webhook-server.mjs`. Skill `onia-chatbot` regla 7.
- Web: `web-factory/apps/onia-platform/src/app/(sitio)/{precios,chatbot}/page.tsx`, `sitio.module.css`,
  `src/content/legal/{terminos,privacidad}.md`.
- Catálogo 1.0: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`. Bitácora SIAT (VPS): `/opt/onia-siat/runner-20260929/BITACORA.md`.

## 5. Intentos fallidos e hipótesis falsas

- **Plantilla AUTHENTICATION de Onia:** tampoco se crea desde WhatsApp Manager (madre, 1-oct): «Esta cuenta de WhatsApp
  Business no tiene permiso para crear una plantilla de mensaje» = code 10 / subcode 2388185. Descartado el pago (Visa ···· 4028
  predeterminada). Queda el caso de soporte a Meta (texto abajo, §6). **No** usar UTILITY con el código.
- **«Los botones traen el id del mensaje original»:** falso con Chatwoot 4.12.1 (ver §3). No diseñar sobre `context.id`.
- **«La plataforma recibe el webhook de Chatwoot directo»:** falso. Lo recibe el bot y lo reenvía. Un salteo en el parser
  del bot corta también lo que le llega a la plataforma.
- **Publicar el bot hoy:** `deploy-bot.sh` corre la suite y se niega con 11 tests rojos que ya están en `main`
  (pauta D1/D4, `codigo-del-anuncio`, `frase-de-la-pauta`, `paciente-de-la-pauta`, `tratamiento-a-medias…`,
  `profesionales-de-la-clinica`), del commit `363dcf10` («frase-prefijo de la pauta — REQUIERE FIRMA de Sergio Urcullo»).
  Es del carril Ventas y pauta.
- **Seguir el log del deploy desde la nube** (`tail` de `/tmp/pub-*.log` por SSH en un bucle): lo bloquea el control de
  permisos como «deploy a producción». La verificación la hizo la madre desde la PC.
- **YouTube** bloquea la IP de la nube; **SendMessage** desde la nube falla; los mensajes programados entre sesiones
  están descartados por Sergio Urcullo.
- Turbopack entra en pánico con `node_modules` symlinkeado en worktrees: usar `--webpack`.
- **Escribir en la base de prod desde la nube** (confirmar el correo de una QA, otorgar un add-on): el control de permisos
  lo bloquea («Remote Shell Writes»), aun de a una fila. La demo se sembró con la autorización EXPLÍCITA de Sergio
  Urcullo en el chat; lo demás lo hace él desde la UI de superadmin. El conector de Gmail dio «Precondition check failed».
- **«`tsc` verde acá = verde en el VPS»:** falso. El 3-oct el build de la web murió en el VPS por un
  `/// <reference types="vite/client" />` (pnpm no expone vite); se arregló con `src/import-meta-glob.d.ts`.
- **Workflows largos cortados por el límite de uso** (2-oct 17:30 UTC): la verificación quedó a medias; se retomó el 3-oct
  con `resumeFromRunId` (lo hecho vuelve de caché). Si el script no es «legible» para el tool, copiarlo al scratchpad.
- **`pgrep -f` / `pkill -f` con el patrón en la propia línea de comando** se encuentran a sí mismos (falso «en curso»,
  y dos veces mató la propia shell): usar PID o puerto.
- **Claves de prueba literales en tests (3-oct, PR #108):** «Secret scan» falló por 3 `ENCRYPTION_KEY` de 64 hex en
  tests del presupuesto. Borrarlas en un commit nuevo NO alcanza: gitleaks del CI corre también en modo git sobre cada
  commit del PR. Se reescribió la rama (`filter-branch` → `"a".repeat(64)`) y se verificó con gitleaks v8.30.1 local (mismo
  SHA que el CI) en los dos modos antes del push. Regla en la skill `onia-seguridad`.
- **Lo que el control de permisos frena desde la nube (3-5 oct):**
  - crear plantillas en Meta («transacción real»);
  - commitear una skill a pedido de otra sesión («Self-Modification»);
  - mergear en onia-hermes;
  - escribir en la base de prod.

  Sí pasa: mergear y publicar onia-platform, y leer prod en solo lectura. El conector de Gmail da «Precondition check failed».
- **`publicar.sh` se niega con «hay otro build corriendo»:** el runner del CI vive en el VPS. Esperar 3 chequeos sin
  procesos `_work/onia|npm ci|next build|docker build|vitest` y recién ahí publicar.
- **CI rojo en `next/font` (`loader.js:122`, 3-oct):** respuesta pasajera de Google Fonts. Si se repite, servir las
  fuentes con `next/font/local`.
- **En el bundle las tildes van escapadas** (`\xe9`, `\xed`): un `grep` del texto con tilde da 0 aunque esté publicado.
- **«El 1-oct es obligatorio para los grupos 9-12»:** dejó de ser cierto el 30-sep (RND 102600000038). La web lo
  afirmó tres días; corregido el 3-oct con un gate que lo impide volver.

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

- OK textual para correr el SQL del B22 en prod (solo permisos).
- OK al presupuesto por fases (P2), viendo las capturas de `docs/cola/capturas-presupuesto-fases/`.
- OK a la caja diaria (#110) cuando estén sus capturas.
- Confirmar el correo de `+qapago` en el Gmail de Onia (la nube no puede: el conector de Gmail da «Precondition check failed»).
- Aprobar en `/admin/payments` el pago de PRUEBA de «ZZ QA Pago», sin emitir factura.
- Confirmar que OniaAgency puede facturar en el Portal Web del SIN: el checkout promete factura por correo tras verificar.
- Crear las plantillas A/B en WhatsApp Manager (o pedirlo en la sesión).
- Mirar con su sesión las pantallas nuevas: «A medias» en Pacientes, «Deuda» en la ficha y «Mañana sin confirmar» en la Agenda.
- Decidir si «clientes» incluye a los DUEÑOS: la app y los correos al dueño siguen de vos (pacientes ya van de usted).
- Sin cambios: chip, demo, CAFC y el caso de soporte a Meta.

## 6b. Pendiente priorizado: lo que copiar de Doctocliq (madre, 2-oct)

Fuente: `hermes-content/research/competencia/doctocliq/cuenta-de-prueba/DOCTOCLIQ_ADENTRO.md` (en `main`, `f9ea7a93`).
Confirma la ventaja: allá el tratamiento a medias es MANUAL (lo marca una persona; «Servicios por terminar» es una
tabla sin acción). Nada se construye sin el filtro de Etapa 1. Orden por impacto/esfuerzo:
1. **WhatsApp de muestra al dueño al crear su PRIMERA cita** («ve el valor el día 1»), avisándole antes. Sale del
   número de VENTAS de Onia al DUEÑO (no al paciente; DG-054 no aplica). La plantilla `onia_primera_cita` ya está en
   revisión en Meta: medir si ya hace esto antes de construir nada.
2. **Presupuesto con link público en PDF y «Enviar al paciente» por fase**: va junto con el presupuesto por fases
   desde el odontograma (§7).
3. **Etiqueta «Deuda» automática** cuando se termina un ítem sin pagar.
4. **Bandeja con filtros listos** («No confirman la cita de mañana»): encaja con los botones del recordatorio.
5. **Cita reprogramada visible como «Reprogramada»** al moverla.
- **Medir:** crear una cita en Doctocliq = 6 clics + nombre, 2 campos obligatorios, sin doctor preseleccionado.
  Medir lo nuestro con la misma vara.
- **Lo que ellos tienen y nosotros no:** recordatorio con botones encendido de fábrica sin conectar número (con saldo
  de 5 mensajes de regalo), cierre de caja diario por medio de pago, inventario por lote y vencimiento. Diferencia
  nuestra: QR BCP y bolivianos (ellos son peruanos adaptados: Boleta/Factura, IGV 18 %, sin QR).

## 7. Próximos pasos (en orden)

1. Punto 1 con la QA `+qapago` cuando se confirme su correo. Con esa sesión, MIRAR `/checkout`, `/help` y
   `/patients/import` con un CSV «;» (cierra la verificación visual de los puntos 2 y 12).
2. Arreglos de Meta (madre, 4-oct):
   - `lib/chatbot/meta-cobra-el-servicio.ts`: 1.000 mensajes de servicio gratis por número y por mes, se cobra desde el
     1.001; mantener «cargue el método de pago igual»; de USTED.
   - `lib/pricing.ts`: `utilityBob = 0.113` contra USD 0,0113 × tipo de cambio (~0,128): corregir o explicar.
   - `/precios`: una línea de que el WhatsApp de la clínica lo factura Meta directo.
   - Fuente: `research/ONIA_COSTO_CHATBOT_META_2026.md`.
3. Capturas de la caja diaria (#110) con CI verde, con datos de prueba.
4. SQL del B22 con el OK textual.
5. Puntos 5 a 15 de `ONIA_PLAN_1.0_Y_CAJA.md`, de a uno (sin el 8 ni el 12, que son de Codex; el 13 y el 14 después de P1-P3).
6. Sin orden:
   - `/book` en usted (unos 35 textos de vos);
   - canales privados de Realtime (infra, con OK);
   - verificar el teléfono en la reserva pública;
   - borrar las QA, con el OK de Sergio Urcullo.
