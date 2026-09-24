# Handoff — continuar la 1.0 en Codex

> ## 🎯 GOAL VIGENTE (24-sep-2026) — «terminar la 1.0» — leer esto primero
>
> **Pedido de Sergio Urcullo, 24-sep:** *"corre un goal de finalizar la versión 1.0: agentes AI,
> chatbots, sistema, SIAT… anota, sigue tu claude.md, subagentes, hooks, loops, revisa"*.
> Lo ejecuta una sesión de Claude Code (orquestador + subagentes por carril).
>
> **Objetivo medible:** las 9 puertas de `cola/plataforma-v1.md` en verde medidas en vivo, y el
> criterio de cierre de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §11 (un cliente real de los 5 rubros se
> registra solo, carga datos, usa un día real, paga y vuelve a paga). **Hoy §11 = 0/5**: 4 orgs en
> prod, ninguna cliente, 0 pagos. Las condiciones 2-5 NO las cierra el código: necesitan clientes;
> el código solo saca lo que haría fallar a ese cliente. Fecha mínima de cierre: ~30 días después
> del primer pago (condición 5).
>
> ### Hecho y verificado EN PRODUCCIÓN el 24-sep
> | Qué | Evidencia |
> |---|---|
> | Lote Codex (DG-055..085) + revisión Claude **commiteado y en `master`** | platform `9497a1a0`, `8c87aba4`, `7bcd0a83`; CI + Security verdes |
> | **Swap a la imagen Node 22** (`onia-platform:release-7bcd0a83`, BUILD `FU8j_OHPyRH1XCCr6-0uY`) | canario sin tráfico con cuenta ZZ QA: alta por pantalla → onboarding 5 pasos → 8 pantallas 200, 0 errores; post-swap mismo recorrido en `app.onia.com.bo` 200/0 errores; QA borrada 0/0/0. Rollback: contenedor `onia-platform-prev-9tuk-20260924` |
> | Respaldo diario v3 (alerta Telegram, candado viejo recuperado con aviso, identidad por repo) | copia supervisada 17:30Z exit 0, 1,97 MB, gzip OK; cron sin cambios |
> | 🔒 4 tablas `backup_*_20260904` que `anon` podía leer/modificar/borrar por la API pública | REVOKE + RLS; API ahora 401; copia root-only `/root/backups/security-20260924/` |
> | DG-085 (artefacto mirado en navegador aislado) | r3 pasa 8 vistas/12 capturas; la r1 de Codex había fallado sin registrarse (bug del arnés) |
>
> ### Decisiones de Sergio Urcullo del 24-sep (no se vuelven a pedir)
> VPS renovado · commit+push+merge del lote Codex · rebuild+canario+swap · instalar respaldo v3 ·
> cerrar las tablas expuestas · **receta de deploy ÚNICA = imagen Docker Node 22** · checkout con
> **QR estático** del banco (falta que él pase la imagen y el titular) · **quitar** el cartel
> «Documento base operativo» de Términos.
>
> ### ✅ Segundo release del día + publicador migrado (19:05-19:11 UTC)
> - Carril A en prod: platform `3986b807` (BUILD `VREeqNSncIqDIOTMbfLTQ`) — cartel de Términos fuera,
>   **guard de solo lectura como clase** en `proxy.ts` (canario: org QA vencida → POST/PUT 403
>   `PLAN_READ_ONLY`, GET 200), fiado anulado ya no cuenta como deuda, vencimientos sin cuentas
>   propias, «Aprobar y enviar» no se ofrece ni consume sin WhatsApp propio/cupo, Equipo sin
>   «Bs 0,00/mes». Suite 6.374/0. Rollback: `onia-platform-prev-FU8j-20260924`.
> - Carril D en `main` (`3a3677f4`, conciliado con el arreglo del loop `908057a6`): publicador,
>   `build-and-stage.sh`, `swap-imagen.sh` y `recreate-container.sh` sobre la IMAGEN; sincronizados
>   al VPS. Dry-run: «YA ESTA PUBLICADO — producción corre 3986b807». La trampa de la receta vieja
>   quedó cerrada. Skill `onia-deploy` actualizada (platform `99a403dc`).

> ### ✅ Tanda 2 instalada y publicada (24-sep, 20:15-20:36 UTC, con OK de Sergio Urcullo)
> - **Seguridad 2:** 5 tablas de `onia_center` (`cost_items`, `ai_radar_items`, `respaldo_reloj_20260919`,
>   `finance_entries`, `calcom_bookings`) que CUALQUIER usuario registrado podía leer/borrar por la
>   API → RLS + política `is_sergio()` como sus hermanas; respaldo revocado. Simulado: extraño ve 0,
>   borra 0. Copia `/root/backups/security-20260924/onia-center-5-tables.sql.gz`.
> - **Vigías:** comprobantes pendientes → Telegram cada 10 min (cron nuevo); `security-watch` reparado
>   y con alerta de CLASE (tabla sin RLS en esquema servido por la API). Corridos a mano: limpios.
> - **Web:** DG-072 + Términos §3.4 y Privacidad alineados con el producto (plan vencido = solo
>   lectura, nada se borra de inmediato; Completo = 500 conversaciones/mes). Gate de precios VERDE
>   (44 cifras), gate de privacidad OK. Publicado y verificado en onia.com.bo 20:28 UTC, mirado.
> - **Todas las cuentas de producción son de PRUEBA** (Sergio Urcullo): §11 = 0/5.
> - ⚠️ El integrador `onia-cola` mergea solo a `main` toda rama `claude/*` que se empuje: no empujar
>   ramas a medias.
> - **Restauración PROBADA (puerta 9), 20:58 UTC:** el respaldo real de las 17:30 restaurado en un
>   contenedor aislado (misma imagen `supabase/postgres:15.8.1.085`, red none): 171 tablas, 0
>   faltantes, 164 idénticas; las 7 que difieren son actividad posterior (prod tiene MÁS). Políticas y
>   RLS difieren exactamente en los cierres de seguridad posteriores al volcado. Evidencia:
>   `/root/backups/restore-test-20260924/`. Contenedor de prueba borrado.
> - **Respaldo de comprobantes (Storage):** `onia-backup-storage.sh` (hermes `b3f621cc`), cron 07:10
>   UTC, últimas 30 copias en `/root/backups/onia-storage-v1/`; primera copia OK (2 archivos).
> - **Tercer release del día, 22:48 UTC, por el PUBLICADOR OFICIAL migrado (primera corrida real):**
>   platform `39234c89` (BUILD `1fCNCDEJaOeFVV1KczGHP`): código muerto de OpenAI borrado + «Enséñale
>   conversando» con error honesto y Sentry. `OPENAI_API_KEY` fuera de `app.env` (backup
>   `app.env.bak-pre-sin-openai-20260924`). Build + 9 gates + canario + swap + verificación, solo.
> - **IA con tope:** claves LiteLLM `onia-platform-agentes` (US$5/30 d) y `onia-bot-motor` (US$10/30 d),
>   solo gpt-4.1-mini, en `/root/.config/onia/litellm-*.key`. El bot las usa recién con el próximo
>   deploy del bot (verifica la clave al arrancar y cae a la maestra si no sirve). Vigía de crédito de
>   IA cada 15 min (Telegram directo).
> - **Diseño del agente de cada negocio:** `hermes-content/docs/platform/ONIA_AGENTE_DEL_NEGOCIO.md`
>   (decisiones D1-D4 de Sergio; D5 = número del WhatsApp del dueño, pendiente). La redacción mensaje por
>   mensaje (`claude/v1-agentes-llm-20260924`, `56752b95`+`6292f750`) NO se publica: D2 la reemplaza por
>   plantilla por negocio; su cliente, validación y topes se reusan.
> - **Bot: fuga de procesos zombie cortada (21:21 UTC).** `onia-center` tenía 13.559 zombies (pids
>   13.581/19.092, +720/día): el `timeout` de busybox que el watchdog corría DENTRO del contenedor dejaba
>   un hijo huérfano por corrida que el PID 1 (`node`) nunca recoge; en ~7 días el bot no podía crear
>   procesos. Arreglo en `main` (`5dd54711`, test de clase), hotfix del watchdog instalado solo, contenedor
>   reiniciado: zombies 0, pids 22, bot sano y de vuelta en el conocimiento del panel (v4) en 20 s.
>   Pendiente de clase: recrear `onia-center` con `--init` junto con el próximo deploy del bot.
> - **Auditoría de IA (24-sep):** los 6 agentes NO usan ningún LLM (reglas + plantillas; se venden como
>   «Agentes con IA»). IA real = gpt-4.1-mini vía LiteLLM (reformular en el bot, fotos, «Enséñale
>   conversando») y gpt-4o-mini-transcribe directo (audios). Gasto IA 30 días: US$12,20, de los cuales
>   US$11,93 es Hermes (interno). Del 9 al 17-sep OpenAI sin crédito y nadie se enteró.
> - **PC:** 14 worktrees viejos de `onia-platform` archivados (ramas intactas; las 4 que solo vivían
>   en la PC, en GitHub como `archivo/*`; scripts sueltos en `E:/onia-wt/archivo-worktrees-20260924/`).
>   C: de 5,2 → 16,5 GB libres (+ cachés npm/pip). Queda compactar `docker_data.vhdx` (31 GB, necesita
>   admin + Docker apagado).

> ### Cola que sigue (autónomo), en orden
> 1. Checkout: QR estático + datos de la cuenta BCP (cuando llegue la imagen) — bloquea «paga».
> 2. Vigía de comprobantes PENDING → Telegram (hoy el único aviso es un correo).
> 3. `security-watch.sh` ciego hace 41 días + alerta de clase «tabla en `public` sin RLS».
> 4. Backup de Storage (comprobantes) al respaldo diario; copia offsite (necesita token R2 de Sergio).
> 5. DG-072 (web pública: gracia real, «sin techos», inventario por rubro) portado desde el checkout
>    sucio de `onia-hermes` a una rama limpia de `main`.
> 6. Web: «Agentes con IA» (los agentes no llaman a ningún LLM) — decisión de Sergio.
> **No tocar (lo llevan loops):** recorridos de estética/importadora/servicios y trial vencido en
> prod (`recorrido-cliente`), publicación y embudo del bot (`chatbot-cola`), /terminos de la web
> (`web-venta`).
>
> ### Depende de Sergio Urcullo (lo que quedó sin respuesta)
> Imagen del QR + titular exacto de la cuenta · firma S17 para publicar el bot (el «precio» que lo
> frena es el teléfono fijo) · marcador del SIN y pedir Fase 2 antes del 04/11 · método de pago de
> Meta antes del 1-oct · probar Embedded Signup con un +591 · token R2 para offsite · decisión
> «facturar la suscripción a mano por el Portal Web mientras el SIN no autoriza» · y lo único que
> cierra §11: **clientes**.

> ## ACTUALIZACIÓN 2026-09-21 (tarde) — leer esto primero
>
> **Este archivo no estaba en `main`.** Vivía solo en la rama `claude/cobro-e2e-punto-1-25ba65`,
> así que Codex abriendo el repo no lo encontraba. Ya está en `main`. La regla de la casa dice
> «un handoff sin pushear no existe para la sesión nueva» — pushear a una rama de carril no
> alcanza: tiene que llegar a `main`.
>
> **Lo que cambió en el pedido.** Sergio Urcullo: *"tengo credinet, pero aún no la api del
> banco… los cobros si es necesario manuales"*. Traducido: el §6.2 (credenciales del API QR del
> BCP) **deja de ser bloqueante del trabajo** — su login de Credinet se destrabó, pero el API
> no llegó. El cobro sigue MANUAL y el objetivo pasa a ser que el circuito manual corra con la
> menor cantidad posible de clics de Sergio Urcullo. Nada de lo que venga ahora debe esperar al
> banco.
>
> **🔴 LO MÁS URGENTE NO ES TÉCNICO: el VPS vence el 24-sep-2026.** Faltan 3 días y sólo lo
> puede renovar Sergio Urcullo (hPanel, `srv1360183`). Si cae, se apaga TODO: panel, base, bot,
> n8n, correo. Nada de esta cola importa si eso no pasa.
>
> **Cerrado hoy, desplegado y verificado:** el punto 1 de la cola (§7). Los puntos 1 y 3
> estaban **mal diagnosticados** — el recuadro de §3 explica en qué, porque el error de
> diagnóstico es más caro que la tarea.

> Escrito el **2026-09-21** por la sesión de Claude Code que venía del bloque de UI
> (patrón Hostinger) y del deploy del 18/19-sep. **Se escribió porque se acaban los
> créditos de esta cuenta**: lo que sigue lo continúa Codex.
>
> Todo lo que dice este documento fue **verificado en vivo el 21-sep**, no recordado.
> Donde no se pudo verificar, dice NO VERIFICADO.

---

## 1. Objetivo

**Dejar la versión 1.0 vendible**: que un dueño de negocio boliviano se registre, pague,
y use el sistema por rubro + el chatbot de WhatsApp, sin que Sergio Urcullo tenga que
tocar nada por cada cliente.

**Definición de "hecho"**: el circuito registro → prueba → cobro → activación →
sistema + chatbot funciona punta a punta en producción, y un cliente puede conectar su
propio WhatsApp sin intervención nuestra.

**Estado: NO cumplido todavía.** Faltan las dos cosas del §6 (lo que depende de Sergio
Urcullo) y la cola del §7. Todo lo demás del circuito está vivo.

---

## 2. Qué quedó EN PRODUCCIÓN (verificado el 21-sep)

| Qué | Evidencia |
|---|---|
| **Panel vivo** en `app.onia.com.bo` | login HTTP 200; BUILD_ID vivo `9tuk1Qk2BjQ2j2HdJcL8u` (build `251f64c`) |
| **Navegación de secciones estilo Hostinger** en `/settings` y `/settings/chatbot` | commit `c51a33de`; `data-seccion` presente en el bundle vivo (`runtime-next/.next/static/chunks/`) y mirado renderizado con cuenta real |
| **Motor del chatbot** en `onia-center:3020` | `/health` → `ok:true`, `db.ok:true`, knowledge `v4` desde el panel (`source:"panel"`, 6 productos, 3 FAQ) |
| **14 commits del carril `chatbots-platform-review`** posteriores al mío, ya deployados | `git log c51a33de..origin/master` = 14; incluyen fixes de cupo, inbox, portal del paciente, equipo/coadmins y horarios que el motor rechazaba |
| 2FA obligatoria solo para SUPERADMIN; `/settings` sin venta para cuentas internas | desplegado el 18-sep, sigue vivo |

**Árboles limpios**: `onia-platform-v1-candidate` en `master` sin cambios sin commitear y
0 commits sin pushear. El worktree de `onia-hermes` (`claude/cobro-e2e-punto-1-25ba65`)
también limpio. **Nada en vuelo, nada se pierde.**

---

## 3. 🔴 Lo que se encontró CAÍDO hoy (y se arregló, pero la causa sigue viva)

**El motor del chatbot estaba MUERTO desde el 19-sep ~19:00 UTC.** Dos días sin
contestar WhatsApp. `webhook-server.sh status` devolvía `{"ok":false,"reason":"no responde"}`
y el puerto 3020 no escuchaba.

**Causa raíz**: un sync dejó los archivos del bot **anidados un nivel de más** dentro del
contenedor — `/tmp/onia-bot/bot/webhook-server.mjs` en vez de `/tmp/onia-bot/webhook-server.mjs`.
El arranque moría con `MODULE_NOT_FOUND` y, peor, el `.stamp` del 19-sep hacía creer al
script que ya estaba sincronizado, así que **no se volvía a copiar solo**.

**Arreglo aplicado hoy** (paliativo, el servicio está vivo):
```
docker exec onia-center sh -c "cp -a /tmp/onia-bot/bot/. /tmp/onia-bot/ && rm -rf /tmp/onia-bot/bot"
/opt/onia/bot/webhook-server.sh start
```

**El watchdog existía, detectó la caída, y no alcanzó.** Hay un cron cada 2 minutos
(`*/2 * * * * /opt/onia/bot/webhook-watchdog.sh`). Durante dos días escribió, cada 2 minutos:

```
[…] el webhook NO responde en :3020 — reiniciando
[…] ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs
```

**800 KB de log gritando en una habitación vacía.** Reiniciar no arregla un archivo que no
está. A las 19:34 del 21-sep, apenas se corrigió el anidamiento, su siguiente ciclo levantó
el servicio y cerró el incidente solo.

> ## ⚠️ CORREGIDO Y CERRADO el 2026-09-21 (leer antes de trabajar en esto)
>
> **Los tres puntos de abajo se cerraron, y dos de los tres estaban mal diagnosticados.**
> Se dejan escritos porque el error importa más que la tarea: los dos mandaban a construir
> algo que ya existía.
>
> **1. «El watchdog no avisa a nadie» era FALSO.** Medido en el VPS: `tg_error` aparece 9
> veces en el script desplegado y `TG_BOT_TOKEN`/`TG_CHAT_ID` están cargados en
> `/root/.config/onia/backup.env`. El watchdog detectó la caída al primer minuto y **mandó
> su alarma**. UNA. Un viernes a las 19:00, a un Telegram donde Sergio Urcullo ya tiene
> decenas de tareas abiertas. Después se calló 1.440 ciclos con el bot todavía muerto,
> porque el marcador que evita el spam evitaba también el segundo aviso, **para siempre**.
> No faltaba una sonda ni una alerta: **faltaba INSISTIR**.
> → Arreglado en `6037d83a`: las tres ramas (contenedor, webhook, camino a Chatwoot) comparten
> una escalada que re-avisa a los 15 min, 1 h, 6 h y después una vez por día, diciendo hace
> cuánto lleva así; la recuperación dice cuánto duró. Una caída corta sigue costando UN
> mensaje — hay caso que lo fija, porque un watchdog que manda 30 mensajes/hora se silencia
> igual, por el camino contrario. **Verificado en vivo**: 3 avisos de prueba llegaron al
> Telegram de Sergio Urcullo y los 2 que debían callarse se callaron.
>
> **2. «Encontrar qué sync anidó la carpeta» YA ESTABA ARREGLADO en `master`** (`525d282f`):
> el sync copia a `$DEST.new` y recién ahí hace el swap, así que el destino nunca existe
> cuando se copia. Y `sync-no-deja-al-bot-sin-archivos.test.mjs` lo cuida. La causa raíz,
> para el registro: `docker cp ORIGEN DESTINO` crea el destino si no existe pero mete ORIGEN
> **adentro** si ya existe, y el bloque de sync vivía duplicado en 8 scripts que corren por
> cron a horas que se solapan (:17, :32, :47, cada 30 min) mientras el watchdog reinicia cada
> 2 min. Dos syncs a la vez = anidado, y como ambos escriben el mismo `.stamp`, ningún sync
> posterior vuelve a copiar: **el daño era permanente y silencioso**.
> ⚠️ Esta sesión llegó a escribir su propia versión —peor— antes de mirar `origin/main`.
> **La lección: medir contra `origin/main` ANTES de arreglar, no después.** Este handoff
> estaba escrito sobre una base de 760 commits de atraso.
>
> **3. «Distinguir "no responde" de "no arranca"» sí era real y está hecho** (`6037d83a`,
> paso 3.bis): ante `MODULE_NOT_FOUND` borra el árbol del contenedor (y `.new`/`.old`, que usa
> el swap) y fuerza re-sync limpio, en vez de reintentar 1.440 veces un arranque al que le
> falta un archivo.
>
> **Y de paso: el gate del deploy del bot estaba ROJO desde el 15-sep sin que nadie lo viera.**
> `simulate.test.mjs` fijaba `ONIA_BOT_SLOTS` con fechas literales del 14 y 15 de septiembre;
> el motor descarta horarios vencidos, así que dos casos se pusieron rojos **solos**. Como
> `deploy-bot.sh` corre `node --test` antes de copiar, una fecha vencida en un instrumento
> **bloqueaba el despliegue del bot vivo**. (En `master` ya estaba corregido con fechas
> derivadas del reloj; se descubrió trabajando sobre la base vieja.) Lo que sí seguía roto y
> se arregló: `simulate.mjs` resolvía la llave SSH con `/root/.ssh/` **fija** — el escalón que
> nació el 7-sep para arreglar «un instrumento atado a una ruta absoluta deja de medir cuando
> el carril se muda» se había cableado a **otra ruta absoluta**. Tercera vuelta del mismo bug,
> ahora en Windows, y en silencio. Ahora se resuelve por `ONIA_VPS_KEY` → `$HOME/.ssh` →
> `/root/.ssh`, con guarda verificada por mutación.

---

## 3.bis — Inventario del 21-sep: qué falta REALMENTE para lanzar

Tres inventarios verificados contra el código y contra producción. Ordenados por lo que
cuesta la venta.

### 🔴 BLOQUEANTE 1 — el cliente que conecta su WhatsApp **recibe pero no envía con su número**

El Embedded Signup de Meta funciona y está montado sin flag en la pantalla del cliente
(`app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx:163`, API en
`app/api/chatbot-canal-whatsapp/route.ts`, canje en `lib/chatbot/canal-whatsapp.ts:79`),
con `META_APP_ID` y `META_CONFIG_ID` **cargados en producción** (verificado en el contenedor).

**Pero escribe SOLO `clinic_settings.chatwootWhatsappInboxId` (`canal-whatsapp.ts:92`) y
NUNCA `whatsappPhoneNumberId` / `whatsappAccessToken`.** Esas dos únicamente las escribe el
backoffice de superadmin (`app/api/admin/organizations/[id]/whatsapp/route.ts:63-64`).

Medido en la base de producción el 21-sep:
```
inbox por signup = 1     credenciales salientes = 0     inbox web = 1
```
**Consecuencia real**: el chatbot ENTRANTE contesta bien, pero todo lo SALIENTE —
recordatorios de cita, `/api/n8n/whatsapp/send`, despacho de agentes, relay agente→cliente —
cae al fallback global del número de Onia (`lib/whatsapp.ts:28-33`, comentado ahí mismo como
*"testing only — not for production with real clinics"*) o falla con 422.

*Listo cuando*: conectar por Embedded Signup deja también las credenciales de envío de esa
org, y un recordatorio de prueba sale **desde el número del cliente**. Es el trabajo más
importante de la cola: sin esto, cada cliente nuevo exige que un superadmin le pegue las
credenciales a mano.

### 🔴 BLOQUEANTE 2 — no hay checkout del add-on; cada alta la aprueba Sergio Urcullo a mano

El cliente pide los datos por WhatsApp (`AddonChatbotClient.tsx:416`), transfiere, sube el
comprobante, y **un SUPERADMIN aprueba** en `/api/admin/subscription-payments` para que
`isWhatsAppAddonActive` pase a `true`. Hasta entonces el POST de conexión da 403. Lo mismo
con las recargas de conversaciones (`/api/admin/organizations/[id]/recarga-chatbot`, **sin
test**). Se destraba con el API QR del BCP (§6.2): mientras no llegue, cada venta lleva un
clic tuyo — aceptable con los primeros clientes, no a escala.

### 🟡 El sistema de diseño está escrito y **nadie lo usa** (riesgo de venta ALTO)

`DESIGN.md` fija la dirección y `app/globals.css` tiene los tokens buenos (`font-label` en
`:793`, `--shadow-card`/`--shadow-raised` en `:785-786`). Pero:
- `components/ui/card.tsx` → **0 importadores**. `StatCard` → 0. `button.tsx` → 1.
- `--shadow-card` como clase → **0 usos**; `shadow-raised` → 8, y 6 escritos a mano.
- La superficie de tarjeta se sigue copiando a mano: **108 ocurrencias en 42 archivos**.
- **8 valores distintos de `inputClass` en 28 archivos** (`px-3 py-2 rounded-lg` vs
  `px-4 py-3 rounded-xl`, dos fondos distintos). Un prospecto que pasa de Configuración a
  Facturas ve tres alturas de campo: eso se lee como "no está terminado".
- **`app/(dashboard)/dashboard/` — la primera pantalla después del login — corre con su
  propio CSS** (`dashboard-v2.css`, tokens `--dv2-*` propios), fuera del sistema. Igual
  `app/checkout/checkout.css`.
- Kicker de zona: **9 de 24 rutas** lo tienen. Y hay 105 `uppercase tracking` improvisados en
  41 archivos contra 38 usos de `font-label`.
- `tailwind.config.ts` es **decorativo** y lo admite en su encabezado: en Tailwind 4 no se
  carga. Quien vaya a tocar tipografía ahí no cambia nada.

**Lo que SÍ salió limpio**: el vocabulario por rubro. 46 archivos lo consumen, la lista
`DEUDA` del test está vacía, y ninguna pantalla de cliente le dice "paciente" a un comercio.

### 🟢 Vivo y funcionando en producción (verificado el 21-sep)

- **Agentes ENCENDIDOS y trabajando**: `AGENTS_RUNTIME=1` y `PLATFORM_LAYER=1` en el
  contenedor; **93 corridas** en `onia_agents_runs`, la última el 21-sep 11:00 UTC. Seis
  agentes (`recall`, `cobrador`, `captador`, `reponedor`, `confirmador`, `seguidor`); los que
  contactan a un tercero pasan siempre por aprobación humana en `/pending`. Planes que los
  habilitan: crece/professional/clinic/enterprise.
  ⚠️ Solo **1 acción** generada en 93 corridas — corren, pero casi no tienen de qué hablar:
  hay 2 orgs con add-on y poca data real. No es un bug, es falta de clientes.
- **Alta automática ABIERTA** (`ONIA_ALTA_AUTOMATICA=abierta`): el registro crea la cuenta solo.
- **Cupo del chatbot**: 500 conversaciones/mes del add-on (`lib/pricing.ts:96`), conteo
  idempotente por conversación única, avisos al 80% y al agotarse, y `cuota.agotada` viajando
  al motor (fail-open: si el cupo no se puede leer, el bot sigue contestando).
- **Bandeja nativa**: el dueño ve y responde sin entrar a Chatwoot.
- **Editor de conocimiento**: publica y el motor lo sirve (`source:"panel"`, v4).

### Apagado a propósito (no bloquea, pero conviene saberlo)

- `META_PAGES_PUBLIC` ausente → Instagram/Messenger no se ofrece (espera App Review de Meta).
- `AGENT_RUNTIME_SECRET` ausente → el feed y las acciones para un runtime **externo** de
  agentes dan 503. El módulo interno funciona igual.
- `BCP_QR_*` ausentes → el cobro automático no se ofrece (§6.2).

### Sin test (deuda anotada)

`app/api/bandeja/[id]/route.ts` (responder y cerrar — la superficie que el dueño más toca),
`recarga-chatbot`, y las tres rutas del runtime de agentes.

---

## 4. Archivos y cambios que importan para retomar

**Producto** (`onia-platform`, branch `master`):
- `app/(dashboard)/settings/secciones.ts` — modelo puro de las 6 secciones de `/settings`.
  **Reemplazó a `avanzado.ts`** (borrado). Si agregás un ajuste, va acá y su bloque en el
  `switch` de `SettingsClient.tsx`; el test lo exige.
- `app/(dashboard)/settings/SettingsClient.tsx` — nav lateral (desktop) + chips (móvil),
  una sección visible por vez, deep-link `#hash`.
- `app/(dashboard)/settings/secciones.test.ts` — los guards de que nada se perdió.
- `app/(dashboard)/settings/chatbot/ChatbotClient.tsx` — barra 01/02/03 navegable.
  ⚠️ Las secciones quedan **montadas y ocultas por CSS** a propósito: `bloque-cita.test.ts`
  renderiza el HTML estático completo y desmontarlas lo rompe.

**Runbooks que se usaron y funcionan** (no reinventar):
- Deploy del panel: `/opt/onia-platform/build-and-stage.sh <ref>` (lanzar con
  `setsid nohup … </dev/null &`; log `build-<sha7>.log`) → gate del CI verde **verificado por
  RUN ID** (`gh run view <id> --json conclusion`; `gh run list --limit 1` agarra el run viejo
  y da falsos rojos) → `/opt/onia-platform/deploy-gates-swap.sh <sha7>` (5 gates + backup) →
  smoke (login 200, chunk viejo 404 con cache-buster contra el origen, `docker logs`).
- Bot: `/opt/onia/bot/webhook-server.sh start|stop|status|logs|knowledge`.
- Mirar el panel sin contraseñas: magic link por la Admin API de GoTrue **desde dentro del
  VPS** (`docker exec onia-platform sh -c "wget … http://auth:9999/admin/generate_link"`),
  luego `https://app.onia.com.bo/auth/confirm?token_hash=<X>&type=magiclink&next=/settings`.
  El link es de **un solo uso**: si se venció, se genera otro.

---

## 5. Intentos fallidos (para no repetir el callejón)

- **`next dev` con Turbopack no arranca en `onia-platform-v1-candidate`**: muere con
  *"Symlink [project]/node_modules is invalid, it points out of the filesystem root"* porque
  `node_modules` es un junction a `onia-platform`. **Se levanta con `npx next dev --webpack`**,
  y además hay que pasarle `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (valores placeholder alcanzan) o `proxy.ts` tira 500 en toda ruta.
- **`setState` dentro de un `useEffect` lo rechaza el lint del CI** (`react-hooks/set-state-in-effect`).
  El salto automático a la sección con error se resolvió en el handler que recibe el rechazo,
  no en un efecto. Mismo espíritu que el bug de `useRef` leído en render de la semana pasada.
- **Los selectores de Playwright con `[data-seccion="x"]` agarran DOS elementos** (el chip móvil
  y el botón de la nav lateral). Hay que usar `.last()` o el móvil oculto rompe el click.
- **El SSH al VPS se corta solo en comandos largos** (`Connection reset`, exit 255). El comando
  suele haber corrido igual: **verificar el efecto antes de reintentar**, no relanzar a ciegas.
- **`docker exec -i` se traga el stdin de un heredoc por SSH** — usar sin `-i` y cerrar con
  `</dev/null`.

---

## 6. Qué depende de Sergio Urcullo (bloquea la venta)

1. 🔴 **RENOVAR EL VPS — vence el 24-sep-2026.** Visto en su hPanel (`srv1360183`, botón
   "Renovar"). Si cae, se apaga TODO: panel, base, bot, n8n, correo. Es lo más urgente de
   esta lista y no lo puede hacer nadie más.
2. 🔴 **Credenciales del API QR del BCP** (trámite con Jassir Chahin, pedido el 17-sep): usuario,
   contraseña, token público, `APP_USER_ID`, certificado `.pfx` y **la URL de producción**
   (hoy el banco solo publica sandbox). También sigue trabado su login de Credinet. Nuestro
   lado del cobro automático está construido y probado con mock (`lib/gateway/bcp-qr.ts`,
   `app/api/subscription-payment/bcp-qr/`, callback en `app/api/webhooks/bcp`): el día que
   lleguen, se cargan en `app.env` del VPS, **se RECREA el contenedor** (un `docker restart`
   no relee el env-file) y el checkout enciende solo.
   ⚠️ Sergio Urcullo **NO quiere la capacitación** que ofrece el banco: declinarla si insisten.
3. 🟡 **Conectar un número de WhatsApp de prueba** con el popup de Meta desde su cuenta, para
   vivir el flujo tal como lo verá un cliente. Es el único tramo del alta que exige un humano
   con navegador; después de eso se puede verificar el circuito entero E2E.

---

## 7. Próximos pasos, en orden (cola para Codex)

Cada uno con su criterio de "listo". **No abrir el siguiente sin cerrar el anterior.**

1. ~~**Que el watchdog avise cuando no puede arreglarlo** (§3.1).~~ ✅ **HECHO el 21-sep**
   (`6037d83a`, desplegado y verificado en vivo). El diagnóstico estaba mal: el watchdog sí
   avisaba — avisaba **una vez**. Ver el recuadro de §3.
2. **WhatsApp saliente por cliente** (§3.bis, BLOQUEANTE 1): que el Embedded Signup deje
   también `whatsappPhoneNumberId`/`whatsappAccessToken` de esa org. Sin esto, cada cliente
   nuevo exige que un superadmin pegue credenciales a mano, y mientras tanto los recordatorios
   salen del número de Onia. **← ES EL SIGUIENTE.**
3. ~~**Arreglar la causa del anidado del bot** (§3.2).~~ ✅ **Ya estaba hecho en `master`**
   (`525d282f`): el sync copia a `$DEST.new` y hace el swap. Ver el recuadro de §3.
4. **Adoptar el sistema de diseño que ya existe** (§3.bis): portar las 42 pantallas a la
   primitiva `Card`, unificar los 8 `inputClass` en un form kit, y meter
   `app/(dashboard)/dashboard/` dentro del sistema (hoy tiene CSS propio y es la PRIMERA
   pantalla que ve un prospecto en la demo). *Listo cuando*: `grep -c "rounded-xl border
   border-outline-variant"` baja de 108 a cerca de 0 y hay un solo estilo de campo.
5. **Limpiar el VPS**: disco al **78% (151G de 193G)** y subiendo; hay un contenedor
   `onia-platform-qa` (staging) levantado hace días, builds y tarballs viejos, y un log de
   watchdog de 800 KB. *Listo cuando*: el disco baja de 70%.
6. **Portar WF-05 y WF-11 al patrón SSH e importarlos a n8n** (hoy sus nodos de Postgres
   apuntan a hosts muertos; los JSON del repo ya llevan `idempotencyKey` y los nodos de Resend
   deshabilitados, commit `51328d91`). *Listo cuando*: importados y **dejados INACTIVOS** hasta
   que exista el primer cliente con `whatsappPhoneNumberId`.
7. **Tandas de UI que siguen abiertas** (del doc comparativo): form kit (Input/Field/Select —
   la mayor inconsistencia que queda), skeletons, DataTable, y breadcrumbs en las pantallas
   hondas del panel.
8. **Flakies locales de vitest en Windows** (rotativas: backup-onia-postgres, rango-gitleaks,
   cuentas-que-no-son-clientes, fechas-de-calendario). Verdes aisladas; **el CI de Linux es el
   árbitro**. No perseguirlas sin datos nuevos.

---

## 8. Reglas de esta casa que Codex debe respetar

- **Verificar es MIRAR**: una pantalla de cliente se abre renderizada y se lee la captura. Un
  200 y un `grep` no son verificación.
- **Construido ≠ terminado**: solo cuenta lo encendido en producción y verificado ahí.
- **Nada de precios escritos a mano**: planes desde `lib/subscription-plans.ts`, add-ons desde
  `lib/pricing.ts`.
- **Nada de sustantivos de dominio hardcodeados**: el producto vende 7 rubros; todo sale de
  `lib/onboarding/vocabulario.ts`. "Paciente" en una pantalla genérica rompe la venta a comercio.
- **La venta nunca exhibe obra**: prohibido "muy pronto", "beta", "en construcción" en cualquier
  superficie que vea un cliente.
- **Los secretos no salen del VPS**: se leen dentro de la shell remota y nunca se imprimen.
- **Un solo dueño a la vez** para VPS, n8n y Supabase.
