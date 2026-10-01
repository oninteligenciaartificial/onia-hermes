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
| **Web v1 + 4 detalles de la madre + legales 1.3** | onia-hermes#84 (rama `claude/sharp-shannon-sqrmig` = `wip/web-v1-correcciones-20261001` + arreglos) | Borrador. Espera el OK de Sergio Urcullo a la web y a los legales 1.3 (términos pasó de 1.2 a 1.3). Mergear = publicar la web. La rama `wip/` quedó vieja: se recaptura la `claude/` |
| Plan B de verificación inversa (`wa.me`) | ramas `v1/verificacion-inversa` (plataforma) y `wip/bot-verificacion-inversa` (hermes) | APAGADO y NO se enciende sin OK de Sergio Urcullo (orden de la madre 1-oct) |
| SIAT: runner que valida cada paquete | `/opt/onia-siat/runner-20260929/emisor-v2/` + rama `wip/siat-validar-cada-paquete` | Comandos de VI y IX en `BITACORA.md`, sin lanzar: esperan las capturas del portal |
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
- OK a la web v1 y a los legales 1.3 (onia-hermes#84).
- Firma de la frase-prefijo de la pauta (`363dcf10`): destraba la suite del bot y con eso su publicación.
- Chip prepago para la prueba del WhatsApp del cliente (recordatorio con botones y agente conversacional).
- Aprobar el pago de prueba en `/admin/payments` cuando la madre avise. Capturas del SIAT (filas 4 y 6, «Listado de Etapas», CAFC).

## 7. Próximos pasos (en orden)

1. Con el OK de Sergio Urcullo: mergear onia-hermes#84 (publica web + legales 1.3). Si tarda, llevar solos a `main` los commits del bot.
2. Con la suite del bot en verde (firma de la pauta): `deploy-bot.sh --aplicar` (o `publicar.sh` del bot).
3. Con el chip: conectar el número a una org QA → plantilla `recordatorio_cita` aprobada → cita a 24 h → tocar los 3 botones → MIRAR el estado en el panel y que el bot siga contestando después. Recién ahí ✅ en el catálogo y en la ayuda.
4. Pago de prueba de punta a punta cuando la madre avise. SIAT VI y IX con las capturas.
5. Producto, según la competencia: presupuesto por fases desde el odontograma.
