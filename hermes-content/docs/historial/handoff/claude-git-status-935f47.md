# Handoff — carril `claude/git-status-935f47` (plataforma · infra · integración)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-04 ~02:50 La Paz** (06:50 UTC).
>
> ⚠️ Las horas de este archivo van en **La Paz**, no UTC. Sergio corrigió el 31-ago:
> *"arregla tus horas, aqui somos america/la paz"*. El VPS y los logs son UTC-4 respecto de
> lo que él lee, y entre las 20:00 y las 24:00 **cambia el día**.

---

## 0. CIERRE DE CORRIDA — 2026-09-04 ~15:00 La Paz

> **Esta sección manda sobre §1-§10 de más abajo**, que son historia del mismo carril.
> Horas en La Paz (UTC−4). Escrita porque Sergio pidió cerrar y abrir sesión nueva.

### Objetivo de la corrida
Dejar la 1.0 usable: cerrar Configuración, rediseñar el panel de inicio, y sacar de la venta lo
que no es cierto. **Hecho** = desplegado y verificado MIRANDO la pantalla, o en rama con las
capturas mandadas a Sergio.

### Qué quedó EN PRODUCCIÓN
**Un solo despliegue, `3606c46`, 18:12 UTC (14:12 La Paz), gates 5/5, 0 errores en 3 min.**
Tres defectos, y **dos eran de todo el sistema, no de la pantalla donde saltaron**:

| Defecto | Causa real | Alcance |
|---|---|---|
| No se podía abrir «Configuración avanzada» | `GuiaInicio` vivía en `Header.tsx` → se montaba en TODA pantalla y su `fixed inset-0` se comía el clic | todas las pantallas |
| El botón flotante tapaba «Guardar» | `pb-32` en `LayoutShell` contra un FAB de 96-152 px | todo el celular |
| El rol decía «Administra» | literal en `vocabulario.ts`, 4 rubros + `ROL_DE_RESPALDO` | perfil, equipo y alta |

Verificado en vivo: login 200 · panel 200 · configuración 200 · «Administrador» leído en pantalla.
14 tests nuevos, cada uno comprobado fallando al revertir el arreglo. Suite 2913.

### Qué quedó a medias, y dónde
1. **`feat/panel-tres-renglones`** (`onia-platform`, worktree `.claude/worktrees/v1-panel`, HEAD
   `110a15c`, **pusheado**). El panel dental en tres renglones, construido y verificado.
   🔴 **Espera el «ok panel» de Sergio.** Se le mandaron 4 capturas y aviso por Telegram. Es una
   pantalla viva: no se reemplaza sin que él vea la pieza (lección cara del 20-ago).
   Medido: 9 interactivos y 103 palabras en la primera pantalla del celular; 21 → 9 consultas.
2. **Port del panel de COMERCIO a tres renglones** — ✅ **TERMINADO**, en la MISMA rama
   `feat/panel-tres-renglones`, pusheado. 25 agentes, 0 errores. HEAD `98b7c97`.
   `comercio-hoy.tsx` 549 → 177 líneas; lógica pura nueva en `lib/comercio/panel-hoy.ts` (248) con
   sus tests. **17 consultas en ~6 tandas encadenadas → 12 en UNA.** Suite **2963**.
   «Tu día» = los tickets del día con «Ahora» al FINAL (el mostrador no tiene futuro agendado) y la
   ventana móvil son las 4 ÚLTIMAS, no las 4 próximas.
   Borrado: `Barcode.tsx` y `protagonistaDelPanel` (+ sus 4 tests). **NO borrado a propósito**:
   `Sparkline.tsx` y los 6 helpers de `lib/comercio/hoy.ts` (22 tests) — huérfanos por efecto del
   port, con destino en `/reports`.

   **Tres defectos de plata que el rediseño destapó** (ninguno era el objetivo):
   - 🔴 **Una venta fiada ANULADA seguía contando como deuda ENTERA** (`3d2efb5`). Dos circuitos
     escriben la misma columna de texto libre: `anularVenta` pone `"anulado"` y el contrato del core
     pone `"cancelled"`; el lector filtraba solo el segundo. Como anular también marca los pagos y
     esos sí se descartaban, el saldo quedaba igual al total. Se veía en **tres** superficies: panel
     de comercio, `/comercio/fiados` y el balance de comprobación fiscal.
   - 🔴 **El panel DENTAL afirmaba cosas de un día que solo había leído a medias** (`98b7c97`).
     `take: 30` sobre las citas: con 4 profesionales se pasa, y «Ahora» se iba al final diciendo que
     el día terminó. **Esto iba a salir en el panel que espera el OK de Sergio Urcullo.**
   - El resumen del mostrador contaba solo los 50 tickets traídos y se **contradecía con «Entró
     hoy»** en la misma pantalla. Ahora el total sale de un `groupBy` del día entero, y el
     parámetro es **obligatorio** para que no se pueda olvidar en silencio.
   - Menor: «Dr(a).» se colaba en cada fila de una estética. El título profesional pasó a ser campo
     del vocabulario, solo en dental y veterinaria.

   **Medido en el celular con datos: 9 interactivos (igual que dental) y 142 palabras.** El tope era
   120: **no cumple**, por la tercera tarjeta de atención («corte de caja», que dental no tiene).
   Queda como deuda declarada, no como éxito.

   El guion del workflow quedó en
   `~/.claude/projects/.../workflows/scripts/portar-comercio-tres-renglones-wf_c19be55b-a26.js`.
3. **`fix/venta-honesta`** (`onia-hermes`, pusheada, **sin mergear**). Saca la promesa de factura
   del SIN de diez lugares y baja el bot a add-on. **Bloquea escribirle a los leads.**
4. **Recorrido del dueño nuevo en producción** — ✅ **terminado, y es lo más caro del día.**
   Con cuenta nueva de rubro **Servicios**, cada pantalla mirada: **un dueño solo NO puede hacer
   lo que su propia alta le promete.** No hay pantalla de clientes (única puerta: Caja → Fiado,
   6 clics, y ese cliente no aparece en la cita); la cita abre con **0 opciones** y frena con un
   globo del navegador **en inglés**; **no hay recibo** (`/print/invoice` cuelga de `/billing`,
   que el rubro no tiene); cobrar un servicio exige **inventar stock** (422) y el **SKU es
   obligatorio sin estar marcado**. Y `/register` le promete textual «Agenda, citas, cobros y
   contabilidad» — `lib/platform/vertical-pack.ts:361` no tiene entrada de clientes y el modal
   lee `/api/patients`.
   **Sí funciona solo:** registrarse (el correo sale) → cargar un servicio → cobrar en efectivo →
   verlo en Contabilidad con IVA 13 % e IT 3 % y CSV. Fechas propias en La Paz; ningún icono como
   texto. Limpieza verificada: 0 filas `zz-qa-%`; quedan las 5 orgs reales intactas.
   ⚠️ **El instrumento miente:** `scripts/recorrido_cliente.mjs` canta «paso 3 ROTO» sobre un
   flujo sano — saca la foto mientras el botón dice «Creando cuenta…». Falso rojo suyo.

### Archivos que importan para retomar
- `app/(dashboard)/dashboard/panel-hoy.tsx` — presentación pura, sin Prisma ni Date. Es el contrato
  para portar cualquier rubro: `PanelHoyDatos`, `FilaAtencion`, `FilaCita`, `AccionPanel`.
- `app/dev/dashboard/page.tsx` — **el banco de pruebas**. Sin esto no hay forma de MIRAR el panel
  sin base ni sesión. Cualquier rubro nuevo agrega su estado acá.
- `lib/onboarding/guia-apertura.ts` (`laGuiaSeAbreSola`) — decide dónde saluda la guía.
- `lib/plan-limits.ts` — **los topes por plan viven acá, no en `subscription-plans.ts`**.
- `app/(dashboard)/dashboard/comercio-hoy.tsx` — 549 líneas, 11 consultas, sin portar.

### Intentos fallidos — lo que NO hay que repetir
- **`setsid` no existe en este Git Bash.** Un servidor lanzado con `setsid nohup …` no arranca y
  el error no aparece hasta que el `curl` da 000. Usar el modo background de la herramienta.
- **Un script de Playwright en `/tmp` no encuentra `playwright`**: ESM resuelve desde el archivo,
  no desde el `cwd`. Escribirlo DENTRO del worktree.
- **El dev server del banco muere sin variables de entorno**: el proxy revienta con *"Your
  project's URL and Key are required"* y TODA ruta da 500. Hace falta un `.env.local` temporal con
  valores falsos — y **borrarlo**, porque un build de producción hornea `127.0.0.1` en el bundle.
- 🔴 **Una captura `fullPage` MIENTE sobre los elementos `position: fixed`**: los dibuja donde no
  se ven. Me hizo creer que la barra «Agendar cita» tapaba la plata. Para juzgar si algo tapa algo:
  capturar el **viewport** arriba y abajo, y medir con `getBoundingClientRect`.
- **«Fuente única» sin decir CUÁL manda al archivo equivocado.** El doc de alcance mandaba a leer
  los topes de `subscription-plans.ts`, que solo tiene montos, y por eso el plan Básico figuraba
  con los topes del plan GRATIS (1 usuario · 30 clientes en vez de 2 · 300). Corregido en
  `a10cd543`. Son TRES archivos: montos, topes y add-ons.
- **Un subagente escribió por error en el checkout principal** en vez de su worktree. Lo detectó y
  restauró; verificado limpio. La ruta explícita en el prompt no alcanza: hay que verificarlo.

### Qué depende de Sergio
1. 🔴 **«ok panel»** — sin eso el panel de tres renglones no se publica.
2. Mergear y desplegar `fix/venta-honesta`, o decir que no. **Hasta entonces no se le escribe a
   ningún lead**, porque el material promete factura del SIN y no la emitimos.
3. Los 7 mensajes a leads · conectar su WhatsApp (1 clic) · credenciales del BCP · Punto de Venta 1
   en el SIN · elegir molde de texto A o B para @oniahq.
4. Decisión: bajar «Facturación» del menú principal (hoy es tracción antes del 1-oct).

### Próximos pasos, en orden
0. 🔴 **Servicios y comercio: o entregan lo que el alta promete, o el alta deja de prometerlo.**
   Es lo primero, antes que el panel y antes que escribirle a nadie. *Listo* = el recorrido
   completo se puede hacer solo en el rubro, o la tarjeta de `/register` dice la verdad.
1. **Confirmar si el port de comercio sobrevivió.** `git -C <worktree v1-panel> log` — si no hay
   commits nuevos sobre `110a15c`, relanzar el workflow guardado. *Listo* = comercio en tres
   renglones, capturas miradas, gates verdes.
2. Con el «ok»: mergear el panel y desplegar con el runbook de siempre. *Listo* = panel nuevo vivo
   y mirado en producción.
3. `importadora-hoy.tsx` (192 líneas) — el único rubro sin portar, y **arrastra el mismo defecto de
   `DEFAULT_TZ` fijo** (`importadora-hoy.tsx:42`) que el port de comercio corrigió.
3-bis. `app/api/comercio/caja/route.ts:46,86` escribe la clave del corte con `DEFAULT_TZ`: hoy
   coincide porque el default de la columna es America/La_Paz, y se rompe el día que una
   organización configure otra zona. Queda marcado en el componente.
3-ter. **Servicios profesionales entra a este panel** y su día son reuniones, no ventas. Hoy ve su
   corrida de caja con el vocabulario correcto; un «día de agenda» sería feature nueva.
3-quater. ~63 de los 85 selectores `.dv2-*` de `dashboard-v2.css` quedaron sin consumidor. El
   archivo sigue vivo por `page.tsx` e `importadora-hoy.tsx`: es poda pendiente, no se hizo acá.
4. Cobros y contabilidad (pasos 3 y 4 del orden de la 1.0).
5. **Código muerto pendiente de decisión**: `Sparkline` queda huérfano al portar comercio, y varios
   helpers de `lib/comercio/hoy.ts` tienen lógica testeada que `/reports` podría querer. NO se
   borran en el mismo carril que un rediseño.

### 12 tests que fallan en Windows, y no son nuestros
Fallan idénticos en `origin/main` puro por una ruta `C:\C:\…`. Consecuencia real: **el gate que
protege los precios recorre 0 archivos en esta máquina**, o sea que hoy no protege nada acá.

---

## 0-mañana. Estado al 2026-09-04 ~08:30 La Paz — PUBLICAR dejó de fallar (y por qué casi sale peor)

**Objetivo:** que publicar deje de fallar; camino de publicación probado punta a punta, sin sacar
nada con la cara de Lucía ni de la marca sin el OK de Sergio.

### Qué estaba roto de verdad

**No era Higgsfield y no era "Postiz caído".** Postiz respondía perfecto; el diagnóstico previo
lo midió contra el puerto equivocado (`127.0.0.1:5000` es el puerto INTERNO del contenedor; el
host mapea **4007**). Lo que estaba muerto era el **backend** de Postiz:

- Postiz v2.23 **no arranca sin Temporal**: revienta en `TemporalRegister.onModuleInit`
  (`Name resolution failed for target dns:temporal:7233`) y nunca hace `listen(3000)`. `/api` daba
  502 y por eso el MCP de Postiz devolvía 502.
- **Nadie lo notó durante ~3 semanas** porque el healthcheck del contenedor solo mira
  `localhost:5000` (el frontend): es **CIEGO al backend**, así que Postiz figuraba `healthy`
  mientras su API estaba muerta. El contenedor `temporal` no existía (cero imágenes bajadas):
  se levantó alguna vez con `--no-deps` y quedó así desde que la imagen se actualizó el 14-ago.

### En producción, verificado mirando

- `temporal` + `temporal-postgresql` + `temporal-elasticsearch` levantados y `healthy`; backend de
  Postiz escuchando en 3000, `GET /api/` → **200**, pm2 con los 3 procesos y **0 reinicios**.
  Redes del contenedor intactas (`easypanel`, `postiz-network`, `temporal-network`).
- **Las 3 cuentas de Instagram están conectadas y sanas**: `@oniahq`
  (`cmsw091nx0001lq9c8kr6dsg8`), `sergio_urcullo` (`cmt39kug00022lq9cnw5z12wb`), Lucía
  (`cmt1sv4eh001alq9cl3y6q7es`). Tokens válidos hasta **13/17/18-oct-2026**, ninguna `refreshNeeded`.
- **El token contra Meta funciona de verdad**: `/public/v1/analytics/<integration>` devolvió
  métricas reales de IG. No es un 200 de cortesía, es la Graph API contestando.
- Circuito `ok <id>` → publicar **cableado y probado punta a punta en seco**: tarea con línea
  `PUBLICAR:` → parseo → validación → subida de la lámina → POST a la API → post creado
  (`postId cmtmxajfi...`), borrado después. Caso negativo (tarea sin línea) sale con código 2.

### 🔴 Lo que hice mal y hay que saber: restaurar Temporal DISPARÓ el backlog

El volumen `temporal-postgres-data` **sobrevivió**: al volver Temporal, los workflows viejos
reanudaron y **publicaron 5 posts vencidos en @oniahq entre 12:03 y 12:15 UTC** (fechas 24, 26,
28, 31-ago y 2-sep) sin OK fresco. Los detecté a los ~10 min, **paré el orchestrator**, y desarmé
el resto:

- Todos los `post_*` workflows vivos → **terminados**.
- Los **57 posts** que quedaban en cola → pasados a **DRAFT** (contenido intacto, se re-programan
  desde la UI). Estado final: `PUBLISHED 14 · DRAFT 57 · QUEUE 0`, cero workflows corriendo.
- Orchestrator reactivado y verificado 2,5 min: **no publicó nada**.

**La lección:** levantar un motor de scheduling dormido no es un acto neutro — reanuda todo lo que
tenía pendiente. Antes de encender Temporal/colas, hay que mirar QUÉ hay en cola y desarmar lo
vencido PRIMERO. `pm2 stop orchestrator` no alcanza como red de seguridad: no sobrevive a un
`docker restart`.

### Por qué se generaron 1.196 imágenes y no se publicó ninguna

Dos causas, y las dos había que arreglar:

1. **La API estaba muerta** (arriba).
2. **`ok <id>` no publicaba.** Corría `kanban unblock` y **nada más**. Peor: los loops habían
   aprendido a pedirle a Sergio que subiera los archivos A MANO desde el teléfono
   (t_7282a714: *"descargalas en orden, guardalas en la galería y subilas"*). El circuito entero
   terminaba en una tarea manual que no ocurre nunca.
3. Los **objetivos de los loops medían PRODUCCIÓN**: `lucia` y `marca-personal` pedían "≥ 1 tarea
   `needs_input` nueva por vuelta", y `contenido-cola` pedía la pieza "para que Sergio la
   publique". Un loop que cobra por dejar una tarea bloqueada deja tareas bloqueadas.

### Archivos

- `scripts/kanban/publicar-aprobado.mjs` **(nuevo)** — publica la pieza de una tarea aprobada.
  Lee una línea `PUBLICAR: cuenta=<oniahq|sergio|lucia> imagenes=<ruta> texto=<brief.json>` del
  cuerpo. **La línea es DATO, no comando**: lista blanca de cuentas, rutas absolutas sin `..`,
  validación en disco, e invocación con `execFile` (sin shell). Trae `--autotest`.
  Códigos: 0 publicó · 2 la tarea no era una pieza · 1 falló.
- `scripts/postiz_schedule.mjs` — `--now` (publica ya) y `--draft` (crea sin publicar: es la única
  forma de probar esto, no hay cuenta de prueba).
- `scripts/kanban/telegram-entrada.py` — al desbloquear, publica; si falla, **manda el error**.
- `scripts/loops/sincronizar.sh` — despliega los dos `.mjs` a `/root/bin`.
- `scripts/loops/prompts/{lucia,contenido-cola,marca-personal}.md` — objetivo pasado de producción
  a **publicación** + exigen la línea `PUBLICAR:`.
- **VPS:** `/root/.hermes/SOUL.md` (bloque nuevo: `ok <id>` corre el publicador; backup
  `.bak-20260904-publicar`) · `/opt/postiz/postiz-docker-compose/docker-compose.override.yaml`
  (comentario de por qué Temporal y ES no son opcionales; backup `.bak-20260904-temporal`) ·
  `/root/.postiz-api-key` (600) · `/root/bin/onia-{publicar-aprobado,postiz-schedule}.mjs`.

### Intentos fallidos (para no repetirlos)

- **Temporal sin Elasticsearch NO se puede.** Lo probé para no meter otra JVM en un VPS que
  Hostinger ya estranguló: con visibilidad SQL, Temporal admite **máximo 3 search attributes de
  tipo Text** y `auto-setup` ya los ocupa, así que el `addSearchAttributes` de Postiz
  (`organizationId` + `postId`) muere con *"cannot have more than 3 search attribute of type
  Text"*. Con ES no hay tope. Queda escrito en el override: **no lo "optimices" sacando ES**.
- **`pm2 restart` deja procesos huérfanos**: el orchestrator quedó en crash-loop con
  `EADDRINUSE :::3002`. Se arregla con `docker restart postiz` (que **sí** conserva las redes,
  a diferencia de `docker compose up -d postiz`, que desconecta `easypanel` — trampa ya conocida).
- El `psql -c` con `$$` dentro de `ssh` + heredoc **sin comillas** se come los `$$` (bash los
  expande al PID). Heredoc con `'EOF'` citado.

### Qué depende de Sergio

1. **Aprobar el primer post real por el circuito nuevo.** Nada salió con su cara ni con la marca
   por decisión mía; el camino está probado en seco pero **el último paso (publicar de verdad)
   nunca se ejerció**, porque no hay cuenta de prueba.
2. **Los 57 borradores**: decidir cuáles se re-programan y cuáles se tiran. Están intactos.
3. **Los 5 posts que salieron solos hoy en @oniahq** — si alguno no debía salir, borrarlo.

### Próximos pasos

- Que Sergio apruebe una pieza y verificar el `ok <id>` real (es el único tramo sin ejercer).
- Arreglar el healthcheck ciego de Postiz para que un backend muerto se vea (tarea en el tablero).
- Los loops ya miden publicación: mirar en 2 vueltas si el número sube.

---

## 0-bis. Estado al 2026-09-03 — historia (sigue valiendo como lección)

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

## 0a. Madrugada del 4-sep — lote 4 (base SaaS) y un login roto por 2 h

**Lo que se publicó:** lote 3b `858752a` (fechas en La Paz, redirects de rutas viejas, CTA del login
según el alta, borrador de /setup, cabeceras cerradas, limiters con `cf-connecting-ip`, bug inbox→org)
y lote 4a `70b6ed3` (login server-side con lockout + auditoría, 2FA TOTP con códigos de respaldo y
gate aal2, política de 2FA para admins con 14 días de gracia, claves de API + `/api/v1` +
`/settings/api`, cuota del chatbot 500/mes con `cuota` en `published`, fechas-solo al mediodía local,
realtime con backoff). Tres migraciones aplicadas a mano en prod y registradas en `_prisma_migrations`:
`mfa_recovery_codes`, `organization_api_keys`, `chatbot_uso_mensual`. Suite: **2.797 verdes**.

**🔴 El error propio de la noche.** Al integrar el login server-side lo apunté a Kong por la red
interna (`SUPABASE_INTERNAL_URL`). `@supabase/ssr` deriva el nombre de la cookie **del host** al que
habla: escribía `sb-kong-auth-token` y el sitio lee `sb-app-auth-token`. Resultado: `POST
/api/auth/login` → 200 `{ok, next:/dashboard}` y **nadie quedaba logueado** (04:00-06:04 UTC, de
madrugada, sin clientes). Detección: probar la ruta protegida CON la cookie, no el 200 del login.
Reversión sin build: comentar la variable en `app.env` + `recreate-container.sh --si-estoy-seguro`.
Arreglo definitivo en `master d956cb9` (`cookieOptions.name` derivado de la URL pública + test);
la variable sigue DESACTIVADA hasta desplegarlo. Detalle: memoria `login-cookie-nombre-por-host`.

**Medido en producción tras el arreglo:** login 200 con cookie correcta, `/dashboard` y `/api/me` 200
como ADMIN; `audit_logs` con LOGIN_FAILED 5, LOGIN_LOCKED 1, LOGIN_OK 2 (el lockout funciona);
`published?inboxId=7` devuelve `cuota {agotada:false, usadas:0, limite:500}`; cero basura de pruebas
en la org de Sergio. Rate limit del login en Traefik (`rl-auth-token`) vivo desde el 3-sep 22:50.

**SIAT:** sectores 17 y 24 emiten 908 contra el piloto; la corrida de volumen terminó con 125/125 en
los tres combos de las etapas IV, VII y XI (275 × 907 y 125 × 905, sin rechazos). El % oficial se lee
en `fman` con el login de Sergio. Sigue bloqueado el **Punto de Venta 1**.

**Cuota de Claude (dato duro):** con 5-8 agentes de la sesión de control, los loops perdieron vueltas
(chatbot-cola 2, onia-cola 2, web-venta 3, recorrido-cliente 1; marca `RAZON: vuelta PERDIDA por
limite` en sus logs). Regla: máximo 2-3 agentes pesados en paralelo si se quiere que los loops corran.
Decisión de plata pendiente de Sergio: segunda suscripción o clave de API para los loops.

**En curso al cerrar este bloque:** verificación de 2FA punta a punta con cuenta QA (capturas a
Telegram), `feat/settings-seguridad` (pestaña Seguridad), corte honesto del bot por cuota (motor
`/opt/onia/bot`, relanzar), y `feat/canal-meta` (Instagram/Messenger, detrás de App Review de Meta).
**Tareas de infra abiertas:** `t_9d970ada` (ufw solo Cloudflare + límite en signup/recover/otp) y
`t_106595a4` (levantar Supabase Realtime: Kong da 503, no existe el contenedor).

---

**Cierre del lote 4 (02:00-02:50 La Paz).** `master eae8795` vivo (BUILD_ID `2LdAuSubezKUq_xpaAb4o`):
pestaña **Seguridad** en Configuración (accesos, bloqueos, sesiones con cierre remoto) y el fix de la
cookie. Con el fix se REACTIVÓ `SUPABASE_INTERNAL_URL` y el login quedó sano (POST 200, cookie
`sb-app-auth-token`, `/dashboard` y `/api/me` 200): el login ya no sale por Cloudflare ni comparte el
bucket de Traefik. El deploy corrió con `/root/deploy-eae8795.sh`, que verifica sesión y **revierte
solo** — patrón a reusar para cambios de env riesgosos.

**Verificado MIRANDO (capturas a Telegram):** 2FA punta a punta con cuenta QA (QR, TOTP, 8 códigos de
respaldo, `/login/2fa`, cookie aal1 → 307 en `/dashboard`, `/profile` y `/api/me`, código de respaldo
deja `mfa_factors` en 0), banner de 14 días de gracia (hoy dice 13), claves de API (crear → `GET
/api/v1/patients` 200 con envelope → revocar → 401), y el recibo con la fecha correcta (`paidAt`
guardado 16:00 UTC = mediodía La Paz). Latencias: login 255 ms, `/dashboard` 3,0 s, `/settings/api` 2,3 s.

**Hueco encontrado y cerrado: la cuota no contaba.** La plataforma cuenta en su webhook y exige el
header `X-Chatwoot-Secret`, pero Chatwoot solo tiene un webhook (al motor) y no manda headers. Ahora
el motor reenvía el payload crudo a la plataforma (`uso-plataforma.mjs`, commit `ab196b9b`), después
del dedup y solo para entrantes reales (un saliente reenviado se le duplicaría al cliente por
WhatsApp). Probado en vivo: conv 55 → 1, segundo mensaje de la misma → sigue 1, conv 56 → 2;
`published?inboxId=7` → `usadas:2`. El corte honesto del bot ya estaba vivo (`1f30e53b`).

**Correcciones a supuestos:** el add-on NO se gatea por `organizations.whatsappAddon` (está en `f` en
todas) sino por el entitlement `addon.whatsapp`. Disco del VPS: 87 % → 78 % borrando builds y runtimes
viejos (receta en la memoria de deploy).

**Abierto:** `t_59b4761d` (cambios de chatbot-cola en el motor sin desplegar: un restart los publica a
medias), `t_5c358c3e` (barridos proactivos ignoran la cuota agotada), `t_9d970ada` (ufw solo Cloudflare
+ límite en signup/recover/otp), `t_106595a4` (Supabase Realtime no existe: Kong da 503),
`feat/canal-meta` (Instagram/Messenger, bloqueado por App Review de Meta).

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
   `hermes-content/docs/historial/ONIA_PLAN_DESARROLLO_Y_VENTA.md` tenía abierto *"Gatear lo que el add-on de inventario
   cobra"*, es doc sin fecha (= fuente de verdad) y está referenciado desde `hermes-content/docs/historial/LEEME-PRIMERO.md`.
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
