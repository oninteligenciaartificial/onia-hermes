# Handoff — carril `claude/git-status-935f47` (plataforma · infra · integración)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-03 ~23:10 La Paz** (03:10 UTC del 4-sep).
>
> ⚠️ Las horas de este archivo van en **La Paz**, no UTC. Sergio corrigió el 31-ago:
> *"arregla tus horas, aqui somos america/la paz"*. El VPS y los logs son UTC-4 respecto de
> lo que él lee, y entre las 20:00 y las 24:00 **cambia el día**.

---

## 0. Estado al 2026-09-03 — lo vigente (lo de abajo es historia y sigue valiendo como lección)

**Objetivo del día:** Sergio opera solo por Telegram con la PC apagada, y el sistema pasa de
"terminar" a "llegar" (reel de @eriktaveras: *"no es terminar el SaaS, es llegar antes"*).
Definición de hecho: base probada + leads contestados + decisiones en UNA hoja `ok/no`.

**En producción, verificado mirando:**
- `app.onia.com.bo` corre master `38a0c8a` desde las 15:44 (migración WhatsApp + META en `app.env`,
  contenedor recreado; el viejo quedó como `onia-platform-prev-20260903-194404`).
- `onia.com.bo/contacto` ya no manda a `cal.onia.com.bo` (muerto): main `1c26cc337`, `DEPLOY_OK`,
  `grep -c cal.onia.com.bo` = 0, CTA → WhatsApp.
- Cuenta de Sergio `sergio@onia.com.bo` (org `clinica-sergio-p2ljs`) creada por el flujo real y
  refutada por un segundo agente: agenda usable. Clave SOLO en `/root/.config/onia/sergio-cuenta.env`.
- Hermes en `gpt-5-mini`; memoria compartida con 64 entradas (4 de hoy); 15 loops en el VPS.
  Los 6 loops con >60 % de vueltas vacías bajaron de cadencia (crontab respaldado en `/root/backups/crontab-*.bak`).
- Contenido: 195 commits en GitHub (`claude/carril-contenido` = `c859167b`) sin `b3.mp4`
  (156 MB; respaldo en el bundle y en `C:/dev/proyectos/_respaldo-contenido/`). El worktree
  Windows quedó en ese HEAD con `reset --soft`: sus 5 láminas modificadas siguen sin commitear.
- `CLAUDE.md` §3: el sistema es la oferta, el bot add-on, cero autobombo, vender como Lety/Dapta
  (`62a74a56`). Runbook landing: `.commit` queda en el stage publicado (`0ea6dfe1`).

**A medias, y dónde:**
- Tarjeta Embedded Signup `t_6bf938b7`: código en `claude/chatbots-platform-review-0d1d09`
  (`14f1ab7`, gates verdes), SIN merge, deploy ni captura — se le anotó lo que falta.
- D2 aviso por Telegram `t_b18ca430`: construido apagado (`7d13e4a0f`); falta flag + merge + deploy
  del bot + prueba con captura.
- Lucía: cron de video pausado y push de `claude/lucia-vps` (8 commits varados) en manos de un
  subagente (`t_d2a99e3b`); reactivar el cron es plata → espera `video sí/no`.
- Tareas de base creadas hoy para los loops: `t_6f5b8f52` bandeja lee 4 y 5 · `t_72ddeedb`
  "Saltar por ahora" mata la agenda · `t_ef571e36` D1/D4 · `t_8ba6bb4e` agentes 0 acciones ·
  `t_9f4baa34` corte de mediodía · `t_1b78de19` un recordatorio real · `t_0651707c` precios en
  el bot · `t_3a60bfef` Onia interna fuera del rubro dental · `t_3dbed2c4` web como Lety/Dapta.

**Archivos tocados hoy:** `CLAUDE.md`; `hermes-content/deploy/onia-landing/build-and-stage.sh`;
`hermes-content/docs/research/whatsapp-chatwoot-embedded-signup.md` (movido de la raíz);
memoria local (`feedback-objetivo-es-llegar-no-terminar`, `onia-vende-el-sistema-no-el-bot`,
`cuenta-sergio-en-el-sistema`, + 2 ampliadas). VPS: crontab; `/root/.hermes/memories`;
`/root/qa-audit/sergio/*` (capturas); `/root/onia-leads-borradores.md`.

**Intentos fallidos / trampas de hoy (no repetir):**
- `hermes kanban edit --priority` no existe (`edit` exige `--result`): la prioridad va al crear.
- El Bash tool corta a los 120 s: `gemini-see-video.mjs` necesita `timeout` ≥ 300 s.
- `[ -d .git ]` falla en un worktree (`.git` es archivo): usar `git -C … rev-parse`.
- El `pre-push` de `.githooks` bloquea push a main salvo `ONIA_LOOP_ID=onia-cola`; un `| tail`
  enmascaró el rc y el swap corrió antes del push (quedó consistente, pero el orden es build → push → swap).
- chatbot-cola comentó "HECHO Y PUSHEADO" sin deploy ni captura, y el runner contó la vuelta
  "sin commit" porque mide el worktree de onia-hermes, no el de onia-platform. Se dice, no se
  arregla: maquinaria congelada hasta el 10-sep salvo loop muerto.
- El verificador refutó 8 puntos de los 7 borradores a leads (recordatorios jamás enviados en prod,
  CSV solo en plan Completo, cita cancelada cuenta como cita, fechas UTC vs La Paz, "sesiones"
  no existe): **material de cliente nunca sale sin refutador**.

**Depende de Sergio (ya está en su Telegram, 4 mensajes):** mandar los 7 mensajes con su voz y
marcar "contactado" en `/admin/solicitudes`; contestar la hoja `ok/no` (`t_7282a714`, `t_a9ff7367`,
`t_3b261fb7` + cuenta, `t_8919077e`, `t_92c0755d`, `t_4f09995c`, `video sí/no`, Meta App Review);
cambiar su contraseña; credenciales BCP; Punto de Venta 1 en el SIN (límite 04/11/2026).

**Próximos pasos de la sesión de control:** (1) reporte del subagente de Lucía; (2) cuando un
loop bloquee `needs_input` con captura, el vigía se la manda; (3) deploy del bot cuando
`t_b18ca430` comente `DEPLOY BOT PEDIDO <sha>`; (4) build + swap de `app.onia.com.bo` cuando
`t_6bf938b7`/`t_72ddeedb` lleguen a master (runbook en `onia-platform-oferta-en-prod`);
(5) nada de maquinaria de loops hasta el 10-sep.

---

## 0b. Noche del 3-sep — el panel se reorganiza (lotes 1-3 vivos, lote 4 en curso)

Sergio, 16:52: *"organizá las pestañas y que estén completas… barra lateral como Hostinger… 100 %
funcional, latencia, vida real, instalable"*; 17:05: *"hazlo de una vez"*; 22:45: *"Meta y APIs para
chatbots, 2FA, firewall, lo del reel de Django, manos a la obra"*. Tarea de la sesión de control (no
de los loops), integrada en `feat/panel-pestanas-completas` → `master` → un build por lote.

**En producción (app.onia.com.bo), verificado MIRANDO con la cuenta de Sergio:**
- Lote 1 `1f0b221` (17:42): "Agendar Cita" muestra el error del server y no ofrece horas pasadas
  (`availability` marca `available:false`); todo pago daba 500 por `"$transaction" in db` en Prisma 7
  (`lib/fiscal/invoice-status.ts:96`) → arreglado con test real + log/Sentry en los catch; tarjeta
  "Tu WhatsApp" (merge de `claude/chatbots-platform-review-0d1d09`).
- Lote 2 `b84811d` (18:21): `/setup` real de 4 pasos (sin `{v.negocio}`, no pisa `oniaCoreOnboarding`,
  el intake lee canales con persona fija); barra lateral agrupada (4 fijos + Operación/Dinero/
  Automatización/Sistema, 7 visibles, `w-64`+`md:ml-64`+`md:left-64` juntos, localStorage
  `onia.sidebar.grupos`); `/operations` y `/accounting` borrados.
- Lote 3 `146cd54` (22:44): factura con ítem manual, recibo por pago (`/print/receipt/[paymentId]`),
  "Nota de venta" sin CUF y sin logo de Onia, QR de cobro por archivo (bucket `payment-proofs`, GET
  propio que redirige a URL firmada), "Gastos" en Dinero, libro de compras (RCV) visible y exportable,
  `/api/fiscal/iva-summary`, IVA a pagar = 13 % ventas − Σ `ivaAmount` de compras. Verificación
  visual en curso.
- Infra: rate limit del login en Traefik (`rl-auth-token`, 22:50); runner de loops con "TU ULTIMA
  VUELTA" + `LECCION:` automática + `RAZON: vuelta PERDIDA por limite`; 15 prompts con `OBJETIVO
  (medible)`; recorrido-cliente cierra 9/9 con cita real; SIAT sectores 17 y 24 emiten 908 en piloto.

**Defectos vistos en la verificación de lotes 1+2 → rama `fix/post-verificacion-lotes12` (en curso):**
borrador de `/setup` no persiste (LS `step` se pisa al montar), `/operations`/`/accounting` 404 en vez
de redirect, dashboard con fecha en UTC, login con "Pedí tu acceso" (alta abierta), copy "queda armado".

**Lote 4 en curso (ramas):** `feat/seguridad-base` (cabeceras, limiters unificados con `cf-connecting-ip`,
bug inbox→org del bot), `feat/login-lockout-2fa` (login server-side + lockout + TOTP con códigos de
respaldo + gate aal2 + política admins 14 días). Después: `feat/api-keys` (`/api/v1`, `/settings/api`),
`feat/chatbot-cuota` (500/mes del add-on + corte honesto en `/opt/onia/bot/run-turn.mjs`),
`feat/canal-meta` (Instagram/Messenger detrás de `META_PAGES_PUBLIC`). Plan completo con archivos y
verificación: memoria `onia-panel-diagnostico-y-plan` + `feedback-panel-pestanas-completas-estilo-hostinger`.

**Trampas de esta noche:** la cuota de Claude es UNA para loops y sesión (5 agentes murieron a las
22:00 UTC; lección: al retomar, medir builds y basura `zz-qa`/`AGENTE-VERIF` antes de relanzar);
`vitest run` reescribe snapshots con CRLF → `git checkout -- .` antes de mergear; el swap no recrea el
contenedor (mirar `BUILD_ID`, no `docker inspect Created`); `profiles.themePreference` pisa la cookie
del tema; el numerador de facturas consume números en pruebas; `onia-manual-routes.yaml` es JSON;
`nohup … &` dentro de `ssh` cuelga sin `< /dev/null`.

**Depende de Sergio:** hoja `ok/no` de las 17:00; `video sí/no`; Meta (producto Messenger, App Review
de páginas/IG, cuenta tester); Cloudflare rate limiting + Bot Fight Mode; PdV 1 en el SIN; activar su
2FA recién cuando esté probada con QA; segunda suscripción/API key para los loops (plata).

---

## 1. Objetivo

Que el producto sea **usable por un negocio de verdad**: que lo que está roto se arregle en
la misma vuelta que se encuentra, y que el trabajo llegue a producción.

Sergio, textual: *"TERMINA LAS COSAS PORQUE DEJAS A MEDIAS… SI DECIS QUE UN CLIENTE NO PUEDE
CONECTAR WHATSAPP, ENTONCES HACE QUE SEA POSIBLE"*, y *"SI NO TIENES CREDENCIALES NO TE
QUEDES PENSANDO, DESARROLLA HASTA DONDE PUEDAS"*.

**LISTO =** cada defecto encontrado, cerrado y verificado por un refutador independiente que
corre los gates él mismo y muta la implementación para probar que el test se pone rojo.

**Estado: cumplido en lo cerrado; tres frentes quedan en rama esperando a Sergio.**

## 2. Qué quedó EN PRODUCCIÓN

- **El 404 de los correos de recuperación: arreglado y probado en vivo.** `supabase-auth2` se
  recreó con los cuatro `GOTRUE_MAILER_URLPATHS_*` apuntando a `/supabase/auth/v1/verify`.
  Llegó un correo real (`status=sent (250 2.0.0 Ok)`, evento `user_recovery_requested`), login
  200 en 0,66 s, canario OK. **Rompía la recuperación de contraseña Y la confirmación de correo
  de todo cliente nuevo desde que se abrió el alta el 29-ago.**
- **`main` de `onia-hermes` integrada**: 30 commits de los carriles chatbot y web-factory, que
  llevaban días sin llegar. El último commit de `main` era un `chore: auto-sync`, no un merge.
  Gates verdes (`tsc` 0 · vitest 277 · `npm run lint` 0 errores · `npm test` raíz con 728 del
  bot). Cero marcadores de conflicto.
- **`onia-platform` master**: PR #66 (movimiento del dashboard), #67 (un solo WhatsApp),
  **#68 (pantallas de sistema en marca)** y **#69 (correos de auth en castellano)**.
- **Los seis loops, auditados uno por uno y reconfigurados** (ver §6).

## 3. Qué quedó en rama, esperando a Sergio

| Rama / PR | Qué cierra | Por qué no se mergeó |
|---|---|---|
| [PR #30](https://github.com/oninteligenciaartificial/onia-hermes/pull/30) `fix/lockfile-deploy-center` | El lockfile que tenía rojas dos superficies + el deploy pasa a manual | **Mergearlo podría publicar 77 commits en `onia.com.bo`.** Ver §5. **Es el único que quedó abierto** |
| `design/hero-{ui-viva,resultado,mecanica}` | Tres heroes sin capturas del sistema, ya en su **segunda** versión (pusheadas) | **Sergio elige uno.** Ver §7 |

**Mergeados antes de cerrar:** [#31](https://github.com/oninteligenciaartificial/onia-hermes/pull/31)
(el precio del inventario, tres vueltas de refutación) y
[#32](https://github.com/oninteligenciaartificial/onia-hermes/pull/32) (la auto-cura de los loops).

⚠️ **La laptop se apagó el 31-ago ~23:55 La Paz por pedido de Sergio.** Mientras esté apagada
**los cinco loops no corren**; los 18 crons del VPS sí. Al prender, la auto-cura del §6 rearma
lo que se haya desregistrado — pero **sólo si al menos un loop quedó registrado**. Si al abrir
no aparecen commits de carriles en unas horas, hay que rearmarlos a mano desde
`hermes-content/docs/cola/loops.md`.

## 4. Los defectos que se cerraron, y lo que enseñan

**Las pantallas de sistema salían en el tema equivocado.** `not-found`, `error` y `global-error`
eran las únicas superficies sin `public-light`. No eran "otros colores": eran los mismos tokens
en el tema oscuro. La peor no era la 404 sino **`/book`, la agenda pública**, con el titular casi
invisible sobre fondo blanco.

**Los correos de auth salían en inglés — y las plantillas ni se servían.** El middleware
devolvía **307 al login** para `public/correos-auth/*.html`: el matcher de `proxy.ts` excluye por
extensión y `.html` no estaba. GoTrue se habría traído la landing de login de 45 KB como
"plantilla", con cero `{{ .ConfirmationURL }}`. **El mismo agujero tenía muertos los dos PDF de
`/recursos/`** — los imanes de leads que nadie podía descargar.

**Una guarda que se aprobaba a sí misma.** El test leía el archivo crudo **con los comentarios
adentro**, y el comentario que explicaba el arreglo nombraba `public-light`. Borrando el arreglo
real de tres archivos, la suite seguía en `8 passed`. Es una trampa que puede estar en cualquier
guarda del repo que haga `grep` sobre fuente.

## 5. 🔴 Lo más caro que apareció, y no lo estábamos buscando

**`onia.com.bo` no se publica desde el 22-ago 21:19.**

El workflow publica **dos cosas seguidas**: `center.onia.com.bo` y después el sitio de venta. El
paso de center muere y **el del landing nunca corre**. **77 commits** acumulados, sin que la app
del landing tuviera nada roto: se la llevó puesta el vecino.

Y el primer fallo (24-ago) **ni siquiera fue el lockfile**: el deploy de center **funcionó**
(`DEPLOY_OK`, login 200) y el job murió después, en el paso cosmético `[6/6] maintenance
dry-run`, con `Broken pipe` → exit 255 bajo `set -e`. **Un paso decorativo convirtió un deploy
exitoso en un run rojo, y ese rojo tapó el sitio de venta nueve días.**

- `center.onia.com.bo` está **bajado a propósito desde el 29-ago 12:53** — firmado en el VPS:
  `onia-manual-routes.yaml.bak-bajar-center-20260829165348`. La palabra de Sergio y la medición
  coinciden.
- ⚠️ **El contenedor `onia-center` NO se apaga**: el auditor diario lo usa como runtime
  (`docker exec onia-center node`). Bajar el deploy y bajar el servicio son cosas distintas.
- El mismo lockfile tenía roja la producción de **Vercel `nuvia-store`**.
- 🔴 **`tsconfig.packages.json` es `include: ["packages/**/*.ts"]` — cero código de app.** Las 5
  apps tienen script `typecheck` y **4 no las llama ningún gate, incluida `onia-platform`, que es
  la que sirve `onia.com.bo`**. Decir "`main` compila" no dice nada sobre el sitio de venta.

## 6. Los loops: qué se hizo y por qué

Se auditaron los seis, uno por uno, **abriendo sus commits** en vez de contarlos.

**Se apagaron dos:** `web-factory-salud` (7 de 8 corridas fueron no-ops y cero rastro en el repo
en 48 h; sus 4 chequeos los absorbió el dev-loop, que corre 3× más seguido) y
`cerrar-y-revisar-web-factory` (corrió una vez, no tocó el repo, competía por el mismo plato con
un hermano 288× más rápido). Sus `SKILL.md` quedan en disco.

**Se corrigió el agujero que tenían cinco de los seis:** el prompt cubría "tomá el primer ítem"
y "si la cola se vacía", y el estado real no era ninguno — **"Ahora" agotado con la cola llena**.
Dos colas tenían 6 y 5 ítems en "Después" que el prompt no autorizaba a bajar a buscar. Por eso
`chatbot-cola` escribió **once párrafos** que dicen "sigue igual".

**Se sumó `canario-visual`**, y su oficio no es vigilar: **es alimentar**. El sistema tenía seis
consumidores de cola y **cero productores** — el refill estaba documentado como "lo hace el cron
de 10 minutos" y **ese cron no existe**.

**Se arregló el escalonado, que era ficción**: el `jitter` va de 70 a 517 segundos y se comía la
separación de 2 minutos; los cuatro loops de 20 min **colapsaban en dos pares en el mismo
minuto**. Ahora: `:03 · :17 · :31 · :41 · :45`.

**Auto-cura:** cada loop compara al arrancar contra `hermes-content/docs/cola/loops.md` y
**re-registra el que falte**. Es redundante a propósito: mientras quede **uno** vivo, el conjunto
se recompone solo.

### 2026-09-02 — la mudanza se completó, y lo que apareció al hacerla

Pedido de Sergio: *"arma tu loop y termina de desarrollar, acomoda tus loops y documentos para
que termines, **trabaja desde el vps**, sin eso no podemos avanzar"*.

Ahora corren **cinco loops en el VPS** (`crontab -l` en `187.77.16.63`) y **uno solo en Windows**
(`contenido-cola`, que Sergio maneja en su propia sesión y nadie toca).

**Lo que más dolía: `onia-cola` seguía en Windows.** Es el **único** loop que mergea ramas de
carril a `main`, y las tareas de Windows sólo disparan cuando la app está quieta — así que
llevaba días sin correr. `claude/chatbots-platform-review-0d1d09` acumulaba **7 commits** sin
llegar a `main`, que es lo que alimenta el deploy del VPS y el de Vercel. Peor: `loops.md`
**justificaba** dejarlo ahí ("dos publicadores sobre `main` es el conflicto que `CLAUDE.md`
prohíbe"). El razonamiento estaba mal — lo prohibido es que haya **dos integradores**, no que el
único corra en Linux. **Una regla mal escrita defendió el bloqueo durante días.**

**Se sumó `docs-auditoria`** (`/root/bin/loops/docs-auditoria.md`, rama del carril, cada 4 h): un
foco por vuelta entre *docs falsos · trabajo pisado · ítems fantasma*, siempre verificando en
vivo, y **prohibido inventar hallazgos**. Su combustible no se agota.

**🔴 `web-factory-dev-loop` NO se migró, a propósito.** Su cola está seca: `LOOP_COLA.md` tiene
`CARRIL A` y `CARRIL B` con **cero** ítems sin marcar (27 hechos), y los 2 que quedan están en
*"Bloqueadas (esperan a Sergio)"*, que no es cola. Un loop sin combustible no se planta:
**inventa trabajo**. Para revivirlo hay que **rellenar la cola, no rearmar el cron** — y eso es
decisión de Sergio.

**Dos defectos que sólo aparecieron al mudarse:**

1. **El canario corría un prompt viejo.** El repo tenía la versión de **diez pantallas con
   umbrales medidos** (commit `52e359c1`), ya mergeada a `main`; el VPS ejecutaba la de **cinco**
   y su worktree estaba **100 commits atrás de `main`**, con el script viejo de 4.572 bytes que ni
   siquiera acepta `--self-check`. Arreglado: FF limpio de la rama a `main` + prompt desplegado.
   Verificado: `node scripts/canario_visual.mjs --self-check` → *"ok — 13 casos de umbral + 10
   pantallas con cola existente"*. **Commitear una mejora no la enciende.**
2. **`marca-personal` fallaba cada vuelta por un `upstream` mal puesto.** Apuntaba a `origin/main`
   en vez de a su propia rama, así que `git push` se negaba y el corredor avisaba *"quedaron N
   commits SIN pushear"* — **una alarma falsa**, porque el trabajo ya estaba en el remoto.
   Además **nunca había estado escrito en `loops.md`**: el archivo existía y la lista contra la
   que se compara, no. Un loop fuera de esa tabla **no lo rearma nadie**.

**Cómo se agrega o se saca un loop** quedó escrito al final de
[`cola/loops.md`](../cola/loops.md), y los prompts versionados viven en
[`scripts/loops/prompts/`](../../../scripts/loops/prompts/).

### El equipo quedó organizado, y el VPS ya no depende de la laptop

Pedido de Sergio, el mismo día: *"organizá tu equipo, porque chocan tanto — uno desarrolla, otro
audita, otro investiga, otro perfecciona, otro revisa"* y *"mandá todo al VPS que voy a apagar
la PC"*.

**Siete loops en el VPS, uno en Windows** (`contenido-cola`, que él maneja). El organigrama —
quién hace qué oficio y **qué rutas escribe cada uno** — vive en
[`cola/EQUIPO.md`](../cola/EQUIPO.md).

**Chocaban por tres causas, no por mala suerte**, y cada una tiene ahora una regla mecánica:
dos loops sobre la misma rama · cuatro editando el mismo archivo de cola (**el que MIRA agrega
al final, el que ARREGLA marca `[x]`**) · superficies vivas sin dueño.

**Dos loops nuevos, los dos con combustible medido antes de existir:**
- **`web-venta`** — dueño de `onia.com.bo/` y `/empezar`. Primera vuelta: metió el gate de tipos
  a la app que sirve el sitio, **lo probó rompiéndolo a propósito** y revirtió (`1c9538d6`).
- **`investigacion`** — cotiza las decisiones del radar. Primera vuelta: **cerró 4 decisiones
  fantasma** que ya se habían resuelto solas (`a7a28f63`).

**"Perfecciona" NO recibió loop, a propósito.** Ya se intentó (`web-factory-salud`: 7 de 8
corridas en no-op). Sin una lista finita de qué está mal, un loop no se planta: **inventa
trabajo**. Vive dentro de cada desarrollador como el escalón 2 de su escalera. La lista primero,
el loop después.

**Y el arreglo que hace autónomo al VPS:** `/root/bin/onia-loops-sync.sh` corre cada hora al
minuto 44 —once después del integrador— y despliega el corredor y los prompts **desde `main`**,
de forma atómica. Antes había que copiarlos a mano desde Windows, y por eso el canario pasó un
día ejecutando la versión vieja. **Commitear una mejora no la enciende; ahora sí.**

⚠️ **Dos trampas nuevas, las dos medidas hoy** (están en
[`COMO_SE_ARMA_UN_LOOP.md`](../COMO_SE_ARMA_UN_LOOP.md), trampa 5):
1. **Editar el corredor en caliente rompe la vuelta que corre.** Bash lee los scripts por
   **offset de bytes**: reescribir el mismo inodo le hace ejecutar basura. Pasó con `web-venta`
   — el agente ya había pusheado, pero el corredor nunca escribió `TERMINA`, **nunca soltó el
   `flock`** y quedó un zombi que habría bloqueado todas sus vueltas siguientes. `bash -n` en
   verde no protege de esto. → Instalar con `mv`, nunca sobreescribir.
2. **Copiar prompts desde Windows mete CRLF**, y la guarda anti-drift (`cmp -s`, byte exacto)
   veía distintos dos archivos idénticos. **Una alarma que siempre suena es una alarma apagada.**
   → El sync copia desde el propio checkout de `main`: los dos lados salen del mismo git.

### La bandeja 4, vinculada (2026-09-02, con permiso explícito de Sergio)

`onia-interna` → **inbox 4** (el widget de `onia.com.bo`), donde estaban **7 conversaciones
reales** que nadie podía leer desde el panel. Respaldo previo en
`/root/backups/clinic_settings-20260902T025252Z.sql`.

⚠️ **El costo, y hay que saberlo:** `clinic_settings.chatwootInboxId` es **una sola columna
entera** — un inbox por org. Vincular la 4 **desvinculó la 5** (Onia WhatsApp, 3
conversaciones). No se perdió nada y se revierte con un `UPDATE`, pero **una org no puede leer
su web y su WhatsApp a la vez**. Eso es un límite de diseño, no un olvido, y es decisión de
Sergio si se arregla.

## 7. Los tres heroes

Sergio pidió que el hero **no lleve capturas literales del sistema**. Se desarmó Lety y el dato
es contundente: **cero `<img>`, cero `<video>`, cero `<canvas>`** — su panel es un dashboard
**inventado** que muestra la plata que gana el cliente. No fotografían su software.

Los tres heroes cumplen (cero píxeles del producto, todo divs y CSS) y los tres sacaron **6/10**.
Y los tres cometieron **la misma mentira**: que el agente avisa, manda o cobra solo.
**No es casualidad — "agentes 24/7" se lee como "envía", y lo que hace es preparar un borrador y
dejarlo en la cola de aprobación.** Si tres diseñadores que intentaban no mentir mintieron igual,
cualquier material futuro lo va a repetir.

### Lo que quedó a mitad al apagar

Las tres piezas **ya tienen su segunda versión commiteada y pusheada** (matan la promesa falsa
del agente y dicen qué es Onia). Lo que NO alcanzó a terminar es la **pasada de los críticos**
que verificaba si llegaron a 10 — se cortó al cerrar la sesión.

**Al retomar:** no hay que rehacer los diseños. Sólo correr la crítica sobre las tres ramas ya
pusheadas, con el criterio duro: *una sola afirmación falsa tapa la nota en 7*, y el 10 exige que
un desconocido en tres segundos sienta que le resuelven algo que le duele **y** entienda qué es
Onia.

## 8. Intentos fallidos — lo que NO hay que repetir

1. **Usar `grep` para CONFIRMAR.** Otra vez. El caso nuevo: se declaró un conflicto de números de
   WhatsApp leyendo **el comentario** que explicaba el número viejo, no el código.
2. **`npm run lint` no existe en `onia-hermes`** — es de `onia-platform`. Escribirlo en el prompt
   de un loop de `onia-hermes` es darle un gate fantasma.
3. **Los gates NO corren desde la raíz de `onia-hermes`**: `npx tsc` cae en un paquete señuelo
   (*"This is not the tsc command you are looking for"*). Corren desde `web-factory/`.
4. **Arreglar el precio donde el cliente lo ve y dejar vivo el doc que manda a cobrarlo.**
   `ONIA_PLAN_DESARROLLO_Y_VENTA.md` tenía abierto *"Gatear lo que el add-on de inventario
   cobra"*, es doc sin fecha (= fuente de verdad) y está referenciado desde `LEEME-PRIMERO.md`.
5. **Sacar una fila de una grilla de 2 columnas** y no mirar la página: quedó la última fila con
   un solo ítem y la línea cortada a mitad de ancho.
6. **El disco llegó al 100%** (2,7 GB) y `git worktree add` empezó a fallar con *No space left*.
   Se liberó a 12 GB borrando `node_modules` y `.next` de worktrees mergeados. **Quedan ~19
   worktrees vivos y un worktree completo pesa 6,4 GB.**

## 9. Qué depende de Sergio

| # | Qué | Por qué no lo puedo hacer yo |
|---|---|---|
| S1 | **Publicar los 77 commits de `onia.com.bo`** (PR #30, después `workflow_dispatch`) | Publicar el sitio de venta sin que lo vea es lo que la regla prohíbe |
| S2 | **Elegir uno de los tres heroes** | Es la cara de la marca |
| S3 | **¿La prueba de 14 días pide tarjeta?** (radar) | Cambia lo que promete la superficie de venta |
| S4 | **Aplicar las 8 `GOTRUE_MAILER_*`** al contenedor | Recrear `supabase-auth2` exige conservar el alias `auth`; el runbook está en el repo |
| S5 | **Credenciales del BCP** | Son del banco |
| S6 | **Contestarle a Máximo (21-ago), Leonardo (23-ago) y Edwin (28-ago)** | Pidieron acceso y siguen sin respuesta |
| S7 | **Borrar el proyecto `dental-gest` de Vercel** | El MCP da 403 y no expone borrado |

## 10. Próximos pasos

1. **Cerrar el precio del inventario** (tercera vuelta) y ver si `main` lo integra.
2. **Los heroes a 10/10** y elegir uno.
3. **Sumar el typecheck de las 5 apps al gate** — hoy el sitio de venta no lo tiene.
4. **Limpiar worktrees**: 19 vivos, el disco al 98%.
5. **Medir qué queda vivo de ONIA Center** antes de tocar sus seis memorias.
