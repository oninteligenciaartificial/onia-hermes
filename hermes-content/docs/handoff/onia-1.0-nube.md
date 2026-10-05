# Handoff — onia-1.0-nube (carril Plataforma, en la nube)

Sesión saliente: `session_014HGgof9kHQkdLXhsZsAq6A` (1-oct-2026, sucesora de `session_01VGmpNv4eSMnpA3wXrypR4L`).
La sesión **madre** (local, PC de Sergio Urcullo) ordena por mensaje (CLAUDE.md §1, skill `onia-sesion-madre` en la rama
`claude/onia-sesion-madre-77f719`). Las respuestas a la madre se escriben en el transcript propio: la nube no puede
mandar mensajes. Historia anterior: `git log -- hermes-content/docs/handoff/onia-1.0-nube.md`.

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

- **Regla de Sergio Urcullo (2-oct):** lo que pasa los gates se mergea y se publica SIN preguntar; solo diseño
  nuevo y legales pasan por él (CLAUDE.md «Qué se publica sin preguntar»). No se le habla de PRs.
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
| **Carril plataforma: P1, P2, P3** | rama `claude/sharp-shannon-sqrmig` de onia-platform, PR #108 en **borrador**, head `92adab94` (12 commits sobre `master` `13b67dda`) | P1 «¿Cuándo fue?» y lista «A medias»; P2 presupuesto por fases con link público; P3 «Deuda», «Mañana sin confirmar», «Reprogramada». Revisión adversarial: 10 hallazgos corregidos. tsc 0, vitest 9535 ✅. **CI verde (3-oct): Secret scan + Lint/Typecheck/Tests/Build; mergeable limpio.** Ya está pusheado: si la sesión muere no se pierde. **Espera el OK de Sergio Urcullo a P2** (diseño nuevo; capturas enviadas el 3-oct). Con el OK: sacar de borrador, merge, publicar, mirar |
| Prueba del chip (WhatsApp del cliente) | org «ZZ QA Clínica Chip» | Sergio Urcullo eligió hacerla el 3-oct. Le faltan 2 pasos: confirmar el correo de `+qachip` y Otorgar `addon.whatsapp` en `/admin/organizations/cmuqzov3y000001mzmrcq0i2t/capacidades`. Después conecta en `/settings/chatbot` |
| Catálogo: «recupera pacientes con tratamiento a medias» | `ONIA_CATALOGO_DE_VENTA.md` §8 | Se barre cuando se VEA en pantalla, en la demo, a «Vuelve a citar» encontrando a Natalia y Marcelo (corrida de agentes 07:00 La Paz). Sergio Urcullo: Otorgar `module.agents` sin fecha a la demo (vence 16-oct). Avisar a la madre v1: destraba el anuncio D4 |
| SIAT: certificación en el piloto | `/opt/onia-siat/runner-20260929/` | 96 % (IX 160/160, VI 380/560). Falta VI motivos 5-7: necesitan el **CAFC**. Estudio y plan completos en `hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md` (decisión: Onia factura a mano en el Portal Web hasta autorizar el 9473; clientes con Onia como proveedor). Riesgo: RND 102600000034 (anexo Ley 1733) puede obligar a rehacer pruebas antes del 16-nov |
| Plan B de verificación inversa (`wa.me`) | ramas `v1/verificacion-inversa` y `wip/bot-verificacion-inversa` | APAGADO; no se enciende sin OK de Sergio Urcullo |

**Cómo funciona el recordatorio con botones (para no re-investigar):**
- Plantilla `recordatorio_cita` (nuevo default de `PLANTILLA_RECORDATORIO_POR_DEFECTO`), UTILITY, 3 QUICK_REPLY. La crea
  `asegurarPlantillaRecordatorio` en la WABA **del negocio** al conectar el número. NO tiene que ver con la plantilla
  AUTHENTICATION bloqueada de la WABA de Onia.
- Chatwoot 4.12.1 entrega del toque **solo el texto**: payload descartado y `in_reply_to_external_id` borrado
  (`Message#ensure_in_reply_to`, el recordatorio sale por Cloud API y no está en la conversación). La cita se resuelve
  por inbox → org + `numeroParaWhatsapp` + `whatsapp24hSentAt|2hSentAt` en 26 h (`lib/whatsapp/respuesta-al-recordatorio.ts`).
- El webhook de Chatwoot apunta al **bot**; el bot reenvía el entrante a `/api/webhooks/chatwoot` (`uso-plataforma.mjs`)
  y DESPUÉS saltea los 3 textos en inboxes de clientes (`reason: boton_del_recordatorio`).
- La respuesta de la plataforma lleva `content_attributes.onia_automatico`: el token de la plataforma es el usuario 2 de
  Chatwoot y el bot es el 3 (`CHATWOOT_BOT_AGENT_ID=3` en `/opt/onia/bot/webhook.env`); sin la marca el bot creía que un
  humano tomó la conversación y se callaba. Verificado con el modelo real que Chatwoot guarda la clave.

### 3b. Lo que se midió el 2-oct (fuentes en `docs/research/`)

- **IA en el producto** (`ONIA_INVENTARIO_IA_20261002.md` + catálogo §8): la única IA encendida es el redactor de
  plantillas de los agentes. El detector de tratamiento a medias EXISTE pero no encontraba a nadie (lo arregla #99).
- **Auditoría** (`ONIA_AUDITORIA_20261002.md`): bot de ventas vivo (≈3 s) pero ofrece demos sin cuenta demo y dice
  «Listo, agendado» y se corrige (Cal.com y transcripción apuntan a servicios que no existen); respaldos solo en el
  disco del VPS; Easypanel/n8n expuestos y contenedor QA contra la base de prod; comercio y servicios sin camino a
  factura; web de venta con LCP 3,4-3,7 s.
- **Dapta** (`research/competencia/DAPTA_TEARDOWN.md`): checklist antes de conectar un número (PIN de dos pasos,
  apagar el asistente de IA de Meta, web que coincida, «Agregar método de pago»). Coexistencia en Onia NO probada con
  +591; Meta exige suscribir `history`, `smb_app_state_sync`, `smb_message_echoes` y saltear el registro del número.
- **Recomendación vigente a Sergio Urcullo:** NO conectar su número personal (Meta avisa a sus contactos, sincroniza
  6 meses de chats, el bot le contestaría a todos). Prueba con chip prepago; su número hace de paciente.

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
- **«El 1-oct es obligatorio para los grupos 9-12»:** dejó de ser cierto el 30-sep (RND 102600000038). La web lo
  afirmó tres días; corregido el 3-oct con un gate que lo impide volver.

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

- **Abrir el caso de soporte a Meta** (Business Support Home → WhatsApp Business Platform → Plantillas):
  > Asunto: No podemos crear plantillas de categoría AUTHENTICATION (error 2388185). Negocio 1451773736711697 (verificado),
  > WABA 4429061034078857. Al crear una plantilla AUTHENTICATION (copiar código, español, recomendación de seguridad, vence
  > en 10 min) recibimos «Esta cuenta de WhatsApp Business no tiene permiso para crear una plantilla de mensaje» (code 10,
  > error_subcode 2388185), igual desde WhatsApp Manager y por Graph API. En la misma WABA sí creamos UTILITY y MARKETING.
  > Negocio verificado, WABA aprobada, calidad OK y método de pago activo. La necesitamos para el código de un solo uso del
  > alta en app.onia.com.bo. ¿Qué restricción tiene la cuenta y cómo la habilitamos?
- ~~OK a la web v1 y a los legales 1.3~~: dado el 2-oct, publicado.
- **OK al presupuesto por fases (P2)**: las capturas no le llegaron; quedaron en `hermes-content/docs/cola/capturas-presupuesto-fases/` (3-oct). Destraba la publicación de P1, P2 y P3 (§3).
- **Prueba con el chip (3-oct):** en la org «ZZ QA Clínica Chip»: (1) confirmar el correo de `+qachip` en el Gmail de
  Onia, (2) Otorgar `addon.whatsapp` en `/admin/organizations/cmuqzov3y000001mzmrcq0i2t/capacidades`, (3) conectar el
  chip en `/settings/chatbot`, (4) avisar «conectado». Después: paciente con SU número personal, cita a 1h30-2h30, tocar
  los 3 botones. Si sale bien, el agente de WhatsApp queda como está en la web (decisión del 3-oct).
- **Demo:** confirmar el correo de `+demo`, «Recuperar acceso» para elegir su clave, Otorgar `module.agents` sin fecha
  (`/admin/organizations/cmur09d75000601mz12vg59qn/capacidades`), y después de las 07:00 una captura de Pendientes.
- **Plantillas A y B para los leads de agosto** (`seguimiento_pedido_acceso`, `seguimiento_consulta_whatsapp`, MARKETING,
  texto aprobado el 3-oct): crearlas desde la nube lo frenó el control de permisos («transacción real») porque la orden llegó
  por la madre. Las crea Sergio Urcullo en WhatsApp Manager o lo pide él en la sesión. NO se mandan hasta que Ventas arme
  el seguimiento.
- **Tablero interno:** abrir `app.onia.com.bo/dashboard` como superadmin y mandar captura (la nube no puede entrar).
- **SIAT:** (1) el CAFC del piloto con captura, (2) llamar al 800 10 3444: ¿el 9473 se autoriza con el formato actual o
  con el de la Ley 1733?, ¿la prórroga de 60 días se suma al 04-nov o corre desde que se pide?, (3) decidir si la
  factura va incluida en los planes (recomendado) o como add-on.
- Aprobar el pago de prueba en `/admin/payments` cuando la madre avise. SIAT: el **CAFC del piloto** y una captura nueva del «Listado de Etapas».

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

1. Con el OK de Sergio Urcullo a P2: PR #108 (onia-platform) fuera de borrador → merge → `publicar.sh` → MIRAR en prod la
   lista «A medias», la ficha con «Deuda», «Mañana sin confirmar» y el presupuesto. Sin OK a P2: sacar sus commits
   (`01db1edf` feat y `c3a74c54` fix, SHAs nuevos tras reescribir la rama) y publicar P1+P3.
1b. **Después de P1-P3 (no antes):** puntos 13 y 14 de `ONIA_PLAN_1.0_Y_CAJA.md` (`fc4dbffb`): 7 días de gracia antes de
   cortar un plan vencido + botón «no renovar», y guardar la aceptación de los términos con fecha y versión. Base:
   `research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`. Orden de la madre del 3-oct.
1c. **Textos a pacientes de USTED** (OK de Sergio Urcullo, 3-oct, por la madre): `recordatorio_cita`, agentes, respuestas
   a los botones y correos al paciente. Tiene que salir ANTES de la prueba del chip: la plantilla se crea en la WABA del
   negocio al conectar y, una vez aprobada, cambiarla la manda a revisión de Meta.
2. Demo: después de la corrida de las 07:00, mirar Pendientes de la demo (captura de Sergio Urcullo o de la madre) →
   barrer la línea del catálogo §8 → avisar a la madre v1 (D4).
3. Chip: con «conectado», verificar plantilla `recordatorio_cita` aprobada, cita de prueba, tocar los 3 botones, MIRAR el
   estado en el panel; recién ahí ✅ en el catálogo.
4. SIAT: con el CAFC, cargarlo en `siat-piloto.env` (SIAT_PILOT_CAFC), backup y lanzar VI motivos 5-7 con
   `run-case-v2.sh`; pedir captura nueva del «Listado de Etapas». Plan de producto: `ONIA_FACTURACION_ESTADO_REAL.md` §5.
5. Pendientes para después (alcance congelado, NO hacer sin orden): reintento del reenvío del bot a la plataforma
   (punto 4 de la madre v2), Recall caso B con presupuesto no aceptado (punto 5: necesita el dato «aceptado»), «Pide
   atención» de `/admin/metricas` mirado en prod, Términos §1.2 «con tus propias credenciales» vs token delegado (legal),
   slugs `demo-` para las demos, «Importadora Rojas» ¿es de la casa?
