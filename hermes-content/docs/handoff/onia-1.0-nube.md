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

- **Regla nueva de Sergio Urcullo (2-oct):** lo que pasa los gates se mergea y se publica SIN preguntar; solo diseño
  nuevo y legales pasan por él (CLAUDE.md «Qué se publica sin preguntar»). No se le habla de PRs.
- **Plataforma `release-af2ded5c`** (onia-platform#99, Recall de tratamiento a medias), 2-oct 12:52 UTC. Log:
  «PUBLICADO Y VERIFICADO»; contenedor de rollback `onia-platform-prev-VanPmF3l-20261002-125220`. `/login` mirado con
  Chromium: 200, 0 errores de consola, sin íconos como texto.
- **Web `onia.com.bo`** (onia-hermes#84, web v1 + legales 1.3), publicada 2-oct 12:58 UTC desde `main` `ae4a1fc53`
  («PUBLICADO Y VERIFICADO»; backup `/opt/onia-landing/runtime-next.bak-deploy-20261002125830`). Mirada a 390 y 1440:
  `/`, `/precios`, `/terminos` y `/privacidad` 200 en <2 s, «Versión 1.3» en los dos legales, 0 errores, 0 desbordes,
  0 carteles de obra.
- **Plataforma `release-8f07e537`** (onia-platform#98, recordatorio con botones), mergeada a `master` el 1-oct
  22:25 UTC. **Verificada por la madre desde la PC** (aviso por rutina, 1-oct 23:49 UTC): `docker ps` →
  `release-8f07e537` healthy; el log termina en «PUBLICADO Y VERIFICADO»; `/login` 200 y mirado con Chromium,
  0 errores de consola, íconos como glifos. Inerte hasta que un cliente conecte su número.
- `POST /api/auth/register` rechaza los rubros que no se venden: medido en vivo hoy, `vetgest-clinical` y
  `onia-interna` → 400 (`Invalid enum value`). El catálogo §6.5 ya lo marca cerrado.
- Producción: `ONIA_VERIFICACION_WHATSAPP=plantillas` (la verificación por WhatsApp del alta queda APAGADA por orden de
  la madre hasta que Sergio Urcullo diga), `ONIA_ALTA_AUTOMATICA=abierta`.
- Clientes con número de WhatsApp conectado: **0** (la única fila con inbox es la org interna, inbox 5 = ventas de Onia).

## 3. Qué quedó a medias y dónde

| Qué | Dónde | Estado |
|---|---|---|
| **Recordatorio con botones Confirmar / Cancelar / Reprogramar** | onia-platform#98 MERGEADO (`8f07e537`) + bot en onia-hermes#84 (`2f85bdd2`, `ffb65f75`) | Plataforma: publicada y verificada (§2). Falta: publicar el bot (bloqueado, ver §5); prueba real con el chip prepago. NO se nombra en venta ni ayuda hasta esa prueba |
| Web v1 + legales 1.3 | onia-hermes#84 MERGEADO (`eda2f34a`) | ✅ publicada y mirada (§2) |
| Recall de tratamiento a medias + texto con IA | onia-platform#99 MERGEADO (`af2ded5c`) | ✅ publicado (§2). Falta verlo encontrar a alguien con datos: lo cubre la cuenta demo |
| **Cuenta demo de venta** (clínica dental, datos inventados, en prod) | OK de Sergio Urcullo 2-oct. Diseño en `scratchpad/demo/` de la sesión | En curso: primero se prueba que ningún paciente inventado pueda recibir un WhatsApp/correo real (aprobar un Recall, recordatorios). Email `oninteligenciaartificial+demo@gmail.com` (NO `+qa`: las limpiezas QA borran `+qa%`) |
| **Desarrollo en paralelo** (workflow de la sesión) | worktrees `/home/user/wt-plat-dev` (rama `dev/plataforma`) y `/home/user/wt-hermes-bot` (`dev/bot`), SIN commits al 2-oct 13:00 | Plataforma: P1 fecha retroactiva del tratamiento + lista «en curso sin próxima cita», P2 presupuesto dental por fases con link público e impresión (diseño nuevo → se le muestra a Sergio Urcullo antes de publicar), P3 lo de Doctocliq. Bot: B1 cortar el «Listo, agendado» falso y la promesa de audio, B2 los 11 tests sin cambiar el texto firmado, B3 deploy-bot en seco. Web: W1 titular sin JS / LCP, W2 barrido de promesas. **Si la sesión muere, lo no commiteado de esos worktrees se pierde** |
| Plan B de verificación inversa (`wa.me`) | ramas `v1/verificacion-inversa` (plataforma) y `wip/bot-verificacion-inversa` (hermes) | APAGADO y NO se enciende sin OK de Sergio Urcullo (orden de la madre 1-oct) |
| SIAT: certificación en el piloto | `/opt/onia-siat/runner-20260929/emisor-v2/` + rama `wip/siat-validar-cada-paquete`; detalle en `BITACORA.md` (2-oct) | 2-oct (conteo local): **IX 160/160**, **VI 380/560**, general 96 %, 0 rechazos. Falta SOLO VI motivos 5-7 (180): necesitan el **CAFC** del piloto. Pedido a Sergio Urcullo: CAFC + captura nueva del «Listado de Etapas» para confirmar en el portal |
| Respuestas con datos de la ayuda (deuda, stock) leen tablas del pack dental | — | Anotado: revisar la fuente para comercio, importadora y servicios |

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

## 6. Qué depende de Sergio Urcullo (lo canaliza la madre)

- **Abrir el caso de soporte a Meta** (Business Support Home → WhatsApp Business Platform → Plantillas):
  > Asunto: No podemos crear plantillas de categoría AUTHENTICATION (error 2388185). Negocio 1451773736711697 (verificado),
  > WABA 4429061034078857. Al crear una plantilla AUTHENTICATION (copiar código, español, recomendación de seguridad, vence
  > en 10 min) recibimos «Esta cuenta de WhatsApp Business no tiene permiso para crear una plantilla de mensaje» (code 10,
  > error_subcode 2388185), igual desde WhatsApp Manager y por Graph API. En la misma WABA sí creamos UTILITY y MARKETING.
  > Negocio verificado, WABA aprobada, calidad OK y método de pago activo. La necesitamos para el código de un solo uso del
  > alta en app.onia.com.bo. ¿Qué restricción tiene la cuenta y cómo la habilitamos?
- ~~OK a la web v1 y a los legales 1.3~~: dado el 2-oct, publicado.
- **Prueba con el chip (2-oct, en curso):** conecta el chip en `app.onia.com.bo/settings/chatbot` con `sergio@onia.com.bo`
  (org «Clínica Sergio» `cmtlyz6y9000001nw2934n3cw`) y avisa «conectado». Después: paciente con SU número personal, cita
  a 1h30-2h30 (ventana del cron de 2 h: 90-150 min), tocar los 3 botones.
- Firma de la frase-prefijo de la pauta (`363dcf10`): destraba la suite del bot y con eso su publicación.
- Chip prepago para la prueba del WhatsApp del cliente (recordatorio con botones y agente conversacional).
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

0. **Cuenta demo** (§3): seguridad de envíos probada → crear por el alta real → plan sin vencer → datos inventados
   con 2 casos de Recall → MIRAR /agents y /pending encontrando a esos dos.
0a. **Workflow de desarrollo** (§3): revisar cada carril, gates, mergear a las ramas `claude/sharp-shannon-sqrmig`
   (plataforma reiniciada desde `master` `af2ded5c`, hermes desde `main` `ae4a1fc53`), PR, publicar según la regla.
0b. **Bot de ventas:** apagar Cal.com y la transcripción (servicios inexistentes → «Listo, agendado» falso), arreglar
   los 11 tests de pauta y publicarlo (necesita la firma de `363dcf10` o sacar ese commit del deploy).
1. ~~Mergear onia-hermes#84~~ hecho y publicado (§2). Los commits del bot ya están en `main`; falta publicarlo.
2. Con la suite del bot en verde (firma de la pauta): `deploy-bot.sh --aplicar` (o `publicar.sh` del bot).
3. Con el chip: conectar el número a una org QA → plantilla `recordatorio_cita` aprobada → cita a 24 h → tocar los 3 botones → MIRAR el estado en el panel y que el bot siga contestando después. Recién ahí ✅ en el catálogo y en la ayuda.
4. Pago de prueba de punta a punta cuando la madre avise. SIAT: con el CAFC, cargarlo en `siat-piloto.env` (SIAT_PILOT_CAFC) y lanzar VI motivos 5-7 con `run-case-v2.sh` (respaldo antes, como dice la bitácora).
5. Producto, según la competencia: presupuesto por fases desde el odontograma.
