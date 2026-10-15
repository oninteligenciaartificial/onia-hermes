---
name: onia-hermes-jarvis
description: Invocar ANTES de tocar a Hermes (el asistente de Sergio Urcullo por Telegram), su resumen de las 06:30, su cierre de las 21:30, la aduana de avisos (onia-tg.sh), su calendario, los pedidos a Claude en la nube, o el workflow hermes-jarvis (diagnostico / aplicar / revertir). Dice cómo se mide en solo lectura, cómo se aplica y se deshace, qué frenó el control de permisos y por qué, y las trampas ya pagadas. El ESTADO del carril está en handoff/hermes-jarvis.md; esto es el MÉTODO.
---

# Hermes y Jarvis: el método

> Creada el 2026-10-01 a pedido de Sergio Urcullo: *«tienen que aprender a hacer las cosas, que quede
> como autoconocimiento, sin eso investigamos y perdemos las cosas»*. Cada trampa tiene su caso y su
> fecha. Lo que se aprenda nuevo se agrega acá, en el mismo commit que lo usa.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Estado del carril: qué está encendido, qué falta, intentos fallidos | `hermes-content/docs/handoff/hermes-jarvis.md` |
| Qué le llega a Sergio Urcullo y cuándo (06:30, 21:30, las 4 interrupciones) | `hermes-content/docs/ONIA_CEREBRO.md` §«La regla de entrega» |
| Pedidos a Claude desde Telegram: diseño, prompt de la rutina, llave | `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md` |
| El acceso al VPS y sus tres acciones | `hermes-content/deploy/hermes-jarvis/` (+ `README.md`) |
| El VPS visto cada día sin la PC (10-oct, Q2) | `.github/workflows/hermes-qa-diario.yml`: a las 10:00 UTC corre SOLO `diagnostico.sh` (24 h). La sección 15 da cada línea del crontab con su cadencia, su log y si está MUDA (log más viejo que su penúltima corrida programada; «el hueco más largo en 8 días» daba «ok» a un semanal muerto). Su propio grupo de `concurrency`: el de `aplicar` le dejaba cancelar un `revertir` pendiente. Se lee con el MCP de GitHub: `actions_list` → `get_job_logs` |
| La constitución de Hermes y sus skills | `hermes-content/deploy/hermes-agent/SOUL.md` · `hermes-content/skills/{agenda-calendario,pedir-a-claude}.md` |
| Resumen y cierre · aduana · calendario · pedidos · su vuelta | `scripts/loops/{jarvis-resumen,onia-tg,agenda,pedido-claude,respuestas-pedidos}.sh` |
| ¿Hermes o el asistente de Codex / dots? Decisión, pruebas y cuándo revisarla (8-oct: queda Hermes; dots bloqueado por edad) | `hermes-content/docs/ASISTENTE_CODEX_VS_HERMES.md` |
| Fuentes del resumen/cierre que no son del carril (9-oct) | qué sale: `hermes-content/docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-<d1>-<d2>-<MES>.md` (el rango sale del nombre); qué salió: `/root/publicar/publicado.jsonl` del VPS (lo escriben los publicadores de `hermes-content/deploy/vps-ops/publicar/`); relojes (10-oct): tabla §G de `hermes-content/docs/cola/loop/madre.md`, leída de `origin/main` del clon; colas paradas: `git log` de `cola/loop/*.md` en `origin/main`; trabajos mudos: `/var/lib/onia-latido/<nombre>` («epoch código cadencia», lo escribe `onia-latido.sh`) |
| Formato de todo lo que le llega (8-oct) | PASÓ · NECESITO · SIGUE: `jarvis-resumen.sh` (`parte`/`grupo`), SOUL `## Formato fijo de cada mensaje`, prompt de la rutina §5 |

## Cómo se llega al VPS desde la nube, y qué NO anda

- **El camino es el workflow `hermes-jarvis.yml`**, en el runner propio del VPS: `diagnostico` (solo
  lee), `aplicar` y `revertir`. El input solo elige el script: un cambio nuevo es un commit nuevo.
- **La integración de GitHub (MCP) LEE Actions pero NO despacha**: `actions_run_trigger` → `403
  Resource not accessible by integration` (29 y 30-sep). No reintentar.
- **`GH_ACTIONS_TOKEN`** (entorno «Onia», desde el 30-sep): `POST
  /repos/oninteligenciaartificial/onia-hermes/actions/workflows/hermes-jarvis.yml/dispatches` →
  204. El token anda (una lectura dio 200), **pero el control de permisos de la sesión frenó el
  despacho** de `aplicar` («Modify Shared Resources», 30-sep 20:30 UTC). La autorización escrita
  decía «cuando la principal termine la 1.0»; la principal *cedió* el VPS, y eso no se leyó como la
  misma condición. **Se destraba con una orden explícita de Sergio Urcullo sobre la situación de ese
  momento, o con su toque en el workflow.** Nunca por otra vía.
- **SSH desde la nube:** desde el 1-oct el hook `scripts/nube-ssh-vps.mjs` arma `ssh onia-vps` por el
  túnel de Cloudflare. El 30-sep, el SSH por dentro del proxy lo frenó el control de permisos como
  «escape del contenedor». **Una autorización que llega de rebote desde otra sesión no alcanza**: se
  la pide Sergio Urcullo directamente en ESA sesión.
- **Infra tiene un dueño a la vez.** Antes de `aplicar`, el dueño del VPS del momento (la madre o la
  principal) tiene que cederlo, y no puede tocar crontab, n8n ni `/root/.hermes` mientras corre.

## Medir en SOLO LECTURA (medido por la sesión madre el 1-oct)

| No | Por qué | Sí |
|---|---|---|
| `hermes cron list` | el CLI escribe en `/root/.hermes/logs` al arrancar | leer `/root/.hermes/cron/jobs.json` con python |
| `n8n export:workflow --all` | inicializa la base y corre migraciones | `GET /api/v1/workflows` con `N8N_MANAGEMENT_API_KEY` (de `/opt/onia-platform/app.env`) |
| `onia-tablero.sh list` | pasa por el mismo CLI de Hermes | SQLite del tablero con `?mode=ro` |
| `getUpdates` de Telegram | le roba los mensajes al gateway, que hace polling | `getMe` |

`diagnostico.sh` ya sigue esta tabla desde el 1-oct.

## Hermes por dentro

- **Gateway:** `hermes-gateway.service` (systemd), vivo desde el 18-sep con 0 reinicios, v0.21.0,
  `gpt-5-mini` por LiteLLM `:4000`. Bot `@aalfredhq_bot` por polling.
- **Modelos, por trabajo** (la pregunta «¿mini o nano?» de la madre, 8-oct: son los dos). `gpt-5-mini`: el chat
  del gateway y los trabajos de las 08:00 (agenda) y 08:10 (plan de video). `gpt-5-nano`: el ordenador del
  tablero de las 13:00 y el veredicto de las 16:00. Medido el 27-sep (`jobs.json` y config viva) y el 1-oct
  (gateway); no se volvió a medir. Después de `aplicar` quedan pausados 08:00, 08:10 y 16:00, y el resumen y
  el cierre de Jarvis usan `gpt-5-mini` (`ONIA_JARVIS_MODELO`): en `nano` queda solo el tablero. Se mira en
  solo lectura con `diagnostico` (imprime «modelo:» por trabajo) y `grep -n model /root/.hermes/config.yaml`.
- **Arma su lista de skills al ARRANCAR** (`.skills_prompt_snapshot.json`). El 1-oct la lista era del
  08-sep y no nombraba `agenda-calendario`, que existía desde el 28-sep: una skill copiada en caliente
  existe en el disco y él no la conoce. **Toda skill o SOUL nuevo exige reiniciar el gateway**:
  `systemctl restart hermes-gateway.service` y verificar que volvió. Nunca `pkill`: el 03-sep dejó al
  supervisor vivo y hubo «Gateway (re)started 6 times in 120s» (`hermes-gateway-restart.sh` cuenta
  por qué).
- **Pausar un trabajo:** `hermes cron pause <id>` deja `enabled=False`, `state=paused` y `paused_at`
  en `jobs.json`. `estado_job()` de `aplicar.sh` lo lee así.
- **Hermes NO programa.** Es un modelo barato: ya inventó una agenda entera
  (`handoff/infra-cerebro-loops.md` §5). El trabajo real va a Claude en la nube (skill
  `pedir-a-claude`). Hermes no publica, no gasta y no le escribe a nadie.
- **El «sí» de un pedido es un CÓDIGO que le llega a él directo por la aduana**, no por la salida
  que lee Hermes (revisión de la madre, 1-oct: con un sí que solo pasaba por Hermes, vista previa y
  `--si` en el mismo turno salían sin que él dijera nada). El pedido va por stdin con
  `<<'FIN_PEDIDO_ONIA_7f3c'` (con `<<'PEDIDO'`, un renglón «PEDIDO» del texto cerraba el heredoc y lo
  que seguía se ejecutaba; revisión de la madre, 2-oct): nada del texto pasa por la shell. Como
  argumento sale 64. **El código frena un error del modelo** (mandar sin preguntar, o mandar otro
  texto), **no a alguien con root en el VPS**: ese puede leer el código del disco. Tope: 3 códigos por
  hora, porque cada uno le suena aunque sea de noche. La rutina corre en un entorno PROPIO, sin la
  llave SSH del VPS (con ella, el hook `nube-ssh-vps.mjs` le arma SSH a cada sesión).

## `aplicar` es TODO O NADA (desde el 1-oct)

1. **Fase A, requisitos, en dos tandas.** Primero lo que se comprueba sin crear nada (1b): la API de
   n8n y los 12 flujos que apaga, las skills y el SOUL en `origin/main` del clon del VPS, el SOUL de
   Hermes en el VPS, los 3 trabajos de Hermes que pausa en `jobs.json`, y la forma de la llave de
   pedidos si vino (token `^[A-Za-z0-9._-]+$`). Con llave, también lo que 5d va a necesitar: la skill
   `pedir-a-claude` y la regla «## Pedidos a Claude» en `origin/main`, y que `--estado` la acepte. Recién con eso en verde, su calendario: LEERLO y
   CAMBIARLO (con un evento de prueba que crea, mueve y cancela). Si algo falla, `abortar()` apaga solo lo que **esta corrida**
   prendió (`$BK/prendido-*`), y no toca crontab, Hermes, los 12 flujos de n8n, el SOUL ni el
   interruptor.
2. **Crontab.** Si no se puede instalar, también aborta: todavía no se tocó nada más.
3. Después: pausas de Hermes, los 12 flujos, skills y SOUL, pedidos (inertes sin llave), interruptor
   y **6b: reinicio controlado del gateway** si cambió algo de Hermes o si su lista no nombra las
   skills.
4. `revertir` corre el `rollback.sh` del último `aplicar` vigente. Deshace el crontab por marcas
   (`#jarvis`), reanuda lo pausado, reactiva los flujos de n8n, restaura skills y SOUL, **reinicia el
   gateway** y apaga el interruptor. Si algo no se pudo deshacer, NO marca «revertido» y se
   reintenta. `rollback.sh` y la marca «aplicado» se escriben al terminar la Fase A, antes de tocar
   nada: si aplicar se corta a mitad, `revertir` igual lo encuentra.

**La calendarización se escribe con la credencial de la cuenta ONIA (`a3FResZHqQ32ptyt`) sobre
`sergio.urcullo.m@gmail.com`.** Hasta el 1-oct esa credencial solo había LEÍDO su calendario; la
escritura la prueba recién `aplicar`. Si la prueba queda a medias, el log da el id del evento
«🧪 Prueba de Jarvis»: se borra con el conector de Google Calendar.

Se prueba en un VPS simulado: `npm run test:jarvis-aplicar`. Esa prueba corre el `aplicar.sh` real,
con las rutas desviadas a una carpeta temporal y dobles para crontab, la API de n8n, systemctl y el
CLI de Hermes.

## Trampas ya pagadas

- **El hook Stop hacía avanzar `main` solo** (`scripts/git-autosync.js`, hasta el 5-oct): pusheaba la
  rama y, si `main` era ancestro, la empujaba a `main`. El PR #68 apareció «merged» sin que nadie lo
  mergeara. **Desde el 5-oct solo lo hace con permiso** (la madre con `ONIA_AUTOSYNC_MAIN=1`, el
  integrador con `ONIA_LOOP_ID=onia-cola`; Sergio Urcullo eligió «sí, la madre sigue directo»). Lo que
  llega a `main` llega igual, ≈1 h después, al VPS (el sincronizador de `/root/bin`): lo nuevo se diseña
  INERTE hasta encenderlo. **Mientras el cambio del 5-oct no esté en `main`,** con una rama que sale de
  `main` y un PR sin revisar: pushear a mano y soltar el turno con `git checkout --detach`. Con el hook
  nuevo en tu árbol ya no hace falta, pero no cuesta nada.
- **El permiso de la madre exige una marca en SU checkout** (revisiones de la madre al #138 y al #173, 9-oct):
  sus procesos hijos heredan `ONIA_AUTOSYNC_MAIN`, y los subagentes trabajan en worktrees. **Intento fallido:**
  «solo en el clon principal» (`--git-dir` == `--git-common-dir`) dejaba sin permiso a la madre real, que corre
  en el worktree `onia-madre-v2-pr-review-2d85bb` (`claude -w`); lo encontró el revisor del #173. Ahora vale
  con la variable Y el archivo `onia-autosync-main` en `git rev-parse --absolute-git-dir` de ese checkout: no
  se versiona, no se hereda y ningún otro worktree lo comparte. Residuo: un worktree en una rama anterior
  al #138 corre el autosync viejo, que movía main sin mirar nada.
- **Un runbook se escribe con los `echo` del script delante, no de memoria** (9-oct). El §8 del doc de
  pedidos decía que 1b imprime «✅ llego a GitHub» y 5d «✅ pedidos a Claude: configurado»: 1b es muda
  salvo que falle (`--probar` y `--estado` van a `/dev/null`) y 5d dice «✅ llave de la rutina guardada…».
  Con eso, quien corría `aplicar` iba a buscar una línea que nunca aparece. Se sacan con
  `grep -n '^sec \|echo "✅' aplicar.sh`.
- **Una respuesta rechazada avisa, una vez por pedido** («⛔ Rechazada · id · link», sin el texto rechazado;
  9-oct). Antes se descartaba en silencio. «⚠️ Respuesta rechazada» con un link real pasaba los 90 bytes y
  la aduana guardaba solo el emoji: la etiqueta se eligió por bytes, no por gusto.
- **Las sesiones de la NUBE sí pueden pushear a `main`** (medido el 5-oct): 23 de los 48 avances directos
  de `main` del 28-sep al 5-oct traen el `Claude-Session` de dos sesiones de la nube (Lucía,
  `session_01Whdadt…`, y Marca personal, `session_01CE21my…`; `environment_kind: anthropic_cloud`). El
  proxy de git no lo frena. Contarlo: `git log --first-parent --no-merges --since=… origin/main` y el
  trailer `Claude-Session` de cada commit.
- **El permiso de mover `main` no puede vivir en el repo.** `.claude/settings.local.json` no estaba en
  `.gitignore` (5-oct): si la madre lo hubiera puesto ahí, el `add -A` del autosync lo subía y todas las
  sesiones tenían el permiso. Ahora `**/.claude/settings.local.json` está ignorado y `pedido-rama.test.mjs`
  lo verifica. La madre lo pone en el `settings.local.json` de SU carpeta: la config de usuario o una
  variable de Windows alcanzarían a cualquier sesión de la PC (revisión del 5-oct).
- **El autosync arma los comandos de git SIN shell** (`execFileSync('git', args)`, 5-oct). Antes eran
  cadenas para `execSync`, y una rama `x$(touch${IFS}/ruta)` —nombre válido para git— ejecutaba el
  comando en la máquina de quien la abriera (la madre, al revisar la rama de otra sesión). Y la rama se
  lee con `symbolic-ref` (ref completa): con un tag `main`, `--abbrev-ref` decía `heads/main` y el push
  igual movía `refs/heads/main`.
- **Lo rescatado sale de `main`** (5-oct): el autosync pushea a `claude/autosync-<id>`, deja la sesión
  parada en esa rama (con upstream) y vuelve el `main` local a `origin/main`. Si quedaba en el `main`
  local, la primera corrida CON permiso en ese clon lo publicaba sin PR. Una rama de rescate reescrita
  (rebase, amend), o una local con commits que HEAD no tiene, no se fuerza ni se pisa: va a
  `claude/autosync-<id>-<sha>` y la sesión sigue ahí.
- **A quien TIENE permiso el hook nunca lo mueve de rama** (tercera pasada de revisión, 5-oct). Una
  versión intermedia exigía `tsc` también en `main` con permiso y, si fallaba, rescataba: el integrador
  quedaba fuera de `main`, y `onia-loop.sh` aborta si no está ahí, así que dejaba de integrar para
  siempre. Hueco conocido, como antes del 5-oct: con permiso y parado en `main`, se pushea sin `tsc` de
  `apps/site` (el integrador tiene sus gates; la madre, la regla «main siempre compila»).
- **Una sección del SOUL se copia con un rango.** El `aplicar` viejo hacía `sed '/^## Su calendario/,$p'`:
  arrastraba TODO lo que viniera después. La sección de pedidos va ANTES de la del calendario, y
  cada copia termina en el próximo `---`.
- **El registro de publicaciones miente si se lo lee a la ligera** (9-oct, segunda revisión del #176).
  `yt-video.mjs` sube en PRIVADO por defecto (ensayo) y lo anota igual: solo cuenta `privacidad: public`.
  `ig-historia.mjs` no pide `permalink`: la historia va sin link. `buffer-post` anota el envío, no la
  salida: se cuenta por `cuando` (o `fecha` si es «ya») y solo lo que ya pasó. Y no ve lo que Sergio
  Urcullo sube a mano: se dice «en el registro», nunca «no salió nada».
- **Un calendario sin año** (`CALENDARIO-PUBLICACION-28-3-ENE.md`): el año es el que hace que el rango
  cubra la fecha; la fila se casa por el número de día (normalizado a NFC); entre dos que se solapan
  gana el que empieza después; y desde que existe uno, los `S*-GUIONES` (sin año) no vuelven nunca.
- **Leer una tabla de un `.md` de la madre** (10-oct, relojes de `madre.md` §G). La cabecera se guarda al
  entrar a la sección y NO se borra al salir: el primer parser la borraba en cada `## `, y como §G no es la
  última sección, la `## H.` de abajo la dejaba en `None` y el resumen decía «no pude leer los relojes»
  con la tabla sana. Columnas por nombre exacto (`fecha`, `qué`, `dueño`; un prefijo `qu` casaba «Quién»),
  nunca por posición. Fecha sin año = la PRÓXIMA vez que cae, salvo que haya pasado hace 60 días o menos
  («la más cercana» leía un 15-abr en octubre como «vencido hace 178 días»). Un rango arranca a mostrarse
  desde su primer día y vence al terminar («28 al 2-nov»: el 28 es de octubre). Lo que no entiende sale
  con ❓, no se calla: NECESITO diría «Nada.» con un reloj vivo. Probado contra el `madre.md` real de la
  rama de la madre antes de escribir la prueba: el fixture solo no lo habría encontrado.
- **El latido del cron (10-oct, Q4c).** Cada línea que agrega `aplicar` corre como
  `/root/bin/onia-latido.sh <nombre> <cada-seg> '<comando>'`. El envoltorio nunca rompe el trabajo: si no
  puede anotar, igual corre y sale con el código del comando. Por eso `aplicar` exige verlo en `/root/bin`
  ANTES de tocar el crontab: sin él, ninguna línea nueva correría. Un `[ -x X ] && X` adentro anotaría
  código 1 cuando X falta, que no es una falla: se escribe `[ ! -x X ] || X`. La cadencia de
  `agenda-bloques` (1800) es de día: de madrugada no corre, y el resumen de las 06:30 la lee cinco minutos
  después de su primera corrida. El resumen lee SOLO los nombres de `LATIDOS_ESPERADOS` (una prueba los
  compara con el crontab de `aplicar`): así un archivo viejo de un trabajo renombrado no queda «mudo»
  para siempre, y un trabajo frecuente sin ningún latido sale como «nunca corrió». La prueba que importa
  corre cada línea instalada contra un `/root/bin` que anota sus argumentos: sin las comillas, la línea
  de la aduana corría `sh -c 'ONIA_AVISO_SOLTAR=1'`, salía 0 y el latido la daba por sana (revisión del
  10-oct, lo vio una revisión Opus; la prueba anterior solo miraba que hubiera latido).
- **El QA después de cada publicación (10-oct, Q5): `scripts/loops/qa-release.sh`.** Lee el release con
  `docker inspect --format '{{.Config.Image}}' onia-platform`, lo mismo que `deploy-vivo.mjs`. El correo de
  QA va en una constante `readonly`: el script no acepta argumentos ni lo lee del entorno, porque
  `onia-mirar.js` abre sesión con CUALQUIER correo usando la clave service role.
  - **ROTO solo con evidencia de la plataforma:** la URL final, el texto de error, la pantalla vacía,
    la lentitud, `page.*`, `fetch failed`, `generate_link` 5xx o el contenedor parado. `docker inspect` da
    la etiqueta aunque el contenedor esté parado; lo que falla es el `docker exec` de la clave.
  - **Todo lo demás es NO MEDIDO**, con exit 2 y una tarea del carril, nunca la interrupción 4: el
    `generate_link` 4xx, Chromium que no arranca o que murió (`Page crashed`, `has been closed`), el DNS
    del VPS, una salida sin `FALLO:` (SIGKILL, un `onia-mirar.js` con error de sintaxis), una salida con
    código 0 sin `URL_FINAL=` ni `---TEXTO---` (archivo truncado) o el tope de 150 s.
  - La primera versión mandaba cualquier salida distinta de 0 a ROTO. Así un Chromium faltante habría
    despertado a Sergio Urcullo con «la app está rota» (revisión del 10-oct).
  - Lo roto se vuelve a mirar una vez, 60 s después, antes de abrir la tarea: recién swapeado, Next puede
    estar arrancando.
  - Todo hijo corre con tope de tiempo y `8>&-`. Si un Chromium huérfano se quedaba con el candado, cada
    corrida saltaba con exit 0 y el latido decía «sano». Ahora una corrida trabada más de 20 min sale con 75.
  - Cada tarea guarda su id y se cierra sola cuando vuelve. Antes de confiar en el id se mira que siga
    abierta: si alguien la cerró a mano, la próxima falla abre otra.
  - Las ventanas del publicador se leen por su encabezado `== AAAA-MM-DD HH:MM La Paz ==` (lo escribe al
    tomar el lock o al rendirse), en la hora que sigue a la :50 y una hora y diez después.
    - «al dia» no cuenta como fallida, y «NO publico solo» por un monto tampoco: espera una firma.
    - El `--dry-run` («publicaria») no cuenta.
    - Si el bloque no tiene veredicto y el lock del publicador está tomado, se lee en la próxima corrida.
    - Sin el log no se da la ventana por leída: exit 2 y una tarea.
  - En las pruebas, `onia-tg.sh` del repo no tiene permiso de ejecución: se llama con un envoltorio
    `exec bash`. Si no, `"$TG"` falla mudo y no se crea ninguna tarea.
- **Mirar páginas desde la nube** (11-oct): el Chromium de Playwright rechaza el certificado del proxy de salida
  (`ERR_CERT_AUTHORITY_INVALID`, también con `channel: "chromium"`). Funciona si cada pedido lo hace Node:
  `context.route("**/*", async r => r.fulfill({ response: await r.fetch() }))`, que usa `NODE_EXTRA_CA_CERTS`. La
  verificación TLS sigue entera; nunca `--ignore-certificate-errors`. El «[SW] registration failed» que aparece así
  es del interceptor. **El BUILD_ID de Next SÍ está en el HTML** (corregido el 11-oct: había escrito que no): en el payload RSC de `/login`, como `\"b\":\"<id>\"`
  (`curl -s https://app.onia.com.bo/login | grep -o '\\"b\\":\\"[^\\"]*'`; `mirar-publico.mjs` lo saca como `buildId`). Cambia con CADA build: es la huella para saber que hubo una publicación nueva (medido: `D5DzLXxrhp8Sx1o0cQhQs`
  con #136 y #146). No dice QUÉ commit trae; eso lo da la hora de la publicación (:50) y lo que `master` tenía entonces. **El nombre de `webpack-<hash>.js` NO sirve de huella**
  (corregido el 11-oct, E1: la imagen cambió, con `sw.js`, `manifest.json` y los títulos nuevos, y el nombre fue el mismo
  `webpack-2a706587264c6b91.js` antes y después). Huella que sí funciona: el SHA-1 de `public/manifest.json` y de
  `public/sw.js` servidos por `app.onia.com.bo`, contra `git show <commit>:public/<archivo> | sha1sum` en `onia-platform`
  (así se supo que corría `a7d8c1ed` y no el anterior a #136), más el `Last-Modified` de esos archivos como hora aproximada
  del checkout del build (06:55:58 GMT). Solo cambia si ese archivo cambió en el commit: elegí uno que sí. Para saber
  QUÉ commit corre sin acceso al VPS, comparar varios archivos de `public/` contra varios commits de `master`.
  **La hora del build SIN depender de qué archivo cambió (15-oct):** `curl -sI https://app.onia.com.bo/_next/static/<buildId>/_buildManifest.js | grep -i last-modified`.
  Ese archivo se regenera en CADA build, así que su `Last-Modified` es la hora del build (medido: `LIM7jeUwfaFnEKQWS22-R` → `12:54:16 GMT` en la publicación
  de las 12:50, con `master` en `e28c7e90`, #172 mergeado a las 12:02). Une el `buildId` (qué build) con su hora (cuándo); sigue sin decir qué commit, pero la hora
  más lo que `master` tenía entonces lo cierra. Hay que medir el `buildId` ANTES de la publicación para tener con qué compararlo.
  **La imagen nueva se ve ~5 min DESPUÉS de la hora del build** (medido dos veces el 15-oct: build `12:54:16` → ya servida a las 12:58:46; build `15:54:24` → todavía la vieja a las
  15:58:45 y la nueva a las 15:59:21). Medir a las :58 da «sin cambio» aunque la publicación haya salido: se espera hasta las :00 o más, con
  `hermes-content/docs/research/qa-publicacion/2026-10-15/espera-build.sh <buildId viejo>` (mira cada 20 s hasta 9 min y imprime el nuevo y la hora de su manifiesto), en segundo plano.
  `app.onia.com.bo` está detrás de Cloudflare (`server: cloudflare`).
- **El ejemplo de la prueba de un instrumento sale del sistema real, no del contrato** (11-oct, dos veces el mismo día). C3 (sección 16 del
  diagnóstico) pasó sus 10 pruebas con líneas de crontab directas y, con el crontab que instala `aplicar.sh` (todo envuelto en `onia-latido.sh '<comando>'`),
  nombró seis veces `onia-latido.sh` y dejó vacío el modelo del resumen. L1 (`web-vs-producto.mjs`) pasó 13 pruebas con HTML inventado y, con el HTML
  real de `onia.com.bo`, no ubicó ni un plan. Al revisar a Codex: correr el instrumento contra el sistema real (las líneas de `aplicar.sh`, `curl` de las
  páginas, el código de `master`) ANTES de aceptar «N de N en verde», y escribir el contrato pidiendo que la prueba **lea** esa fuente real.
- **Revisar PRs de otros carriles (11-oct, E2):** una lente sonnet por PR (dos si toca el VPS, plata o el bot), cada
  HIGH verificado por un haiku que cita líneas y corre el repro, y nada se comenta en GitHub. Lee las ramas con `git
  show origin/<rama>:<ruta>` y `git archive … | tar -x` en `/tmp`: nunca `checkout` en el árbol del carril. La
  verificación cambia veredictos: el «cursor CAFC repite números» de #145 bajó a MEDIUM porque el runner falla cerrado
  sin conciliación. Y dos lentes del mismo PR (#162) se contradijeron sobre si el silencio dispara; el repro lo decidió.
- **PR «de usted» (copia) de más de 20 archivos: probar que es SOLO texto, no leerlo a ojo** (15-oct, #174: 68 archivos, +1.189 −211). Tres pasos, con los scripts de
  `hermes-content/docs/research/qa-publicacion/2026-10-15/`: (1) `solo-texto.cjs <repo> <base> <cabeza> <archivos…>` normaliza cada `.ts/.tsx` con el AST de TypeScript
  (todo texto, plantilla fija, texto JSX y comentario pasa a «§») y dice cuáles quedan idénticos: de 50 archivos, **45 idénticos** y 5 con estructura distinta, que se
  leen a mano. (2) `literales-logicos.cjs` busca, en los idénticos, cadenas de **un solo token** que hayan cambiado (rutas, `href`, estados, códigos, palabras que espera el
  bot): el paso 1 NO las ve porque también las reemplaza por «§»; en #174 salieron 0 de 45. Los números y las expresiones regulares sí se comparan en el paso 1. (3) Si el PR
  toca el DETECTOR de tú/vos, `comparar-detector-tu-y-vos.mts` corre el viejo y el nuevo sobre casos escritos a mano (usted que no debe cazar, tú/vos que sí) y cuenta las
  regresiones: el de #174 acertó 86 de 87 contra 68 del anterior, 0 regresiones. Límite: el método dice «solo texto», no «el texto es correcto»; la gramática de
  `negocioSu` y los artículos del rubro se leen aparte. El TypeScript sale de `/opt/node22/lib/node_modules/typescript` (la nube no instala nada).
- **Mirar páginas públicas con un solo script** (11-oct): `hermes-content/docs/research/qa-publicacion/2026-10-11/mirar-publico.mjs
  <carpeta> <etiqueta> <ruta>...`, con `BASE=https://onia.com.bo` para la web (por omisión, la app). Por ruta y ancho
  (390 y 1440) saca estado, tiempo, título de la pestaña, descripción, tarjeta al compartir, huella del build, ligaduras de
  íconos dibujadas como texto, desborde horizontal, textos de obra, voseo o tuteo visible y los precios en Bs. Corre con
  `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`. Para un asistente de pasos (el alta) se hace clic en la tarjeta del
  paso 1 y se mira el paso 2 **sin escribir ni enviar nada**: `/register` no se tocó más que eso. Trampas: `getByText`
  del rubro agarra primero un texto oculto del pie («Clínicas dentales · Comercios…»): hay que pedir el `button` por nombre;
  y el nombre del PNG puede pisar una captura vieja de otro script si comparten etiqueta.
- **Una revisión con lentes se verifica DESPUÉS, y baja severidades** (11-oct, E3, #136): de 5 HIGH que dieron cuatro
  lentes sonnet, el haiku verificador confirmó 2, bajó 2 a MEDIUM (una carrera de milisegundos que no pierde plata, un
  reenvío que el cupo de 10 por hora acota) y dejó 1 como compuerta que solo mide la madre en el VPS. Además corrigió dos
  citas de línea que no existían (un archivo de 89 líneas citado en la 147) y desmintió una frase («el CI lo atraparía»:
  el test deriva solo relaciones sin `onDelete`, y un `Cascade` le es invisible). Dos lentes que llegan a lo mismo por
  caminos distintos (el «1.500» de la caja lo vieron la A y la D) es la mejor señal de que es real: igual se corre el
  `node -e` con la función copiada, que dio 1,5.
- **El texto legal también se mide en la web** (11-oct): `/terminos` y `/privacidad` están de vos como el resto de
  `onia.com.bo`. Las palabras «borrador» y «beta» que el barrido marca ahí son de la IA que propone borradores, no
  de obra: un barrido de obra sin leer la línea da falsos positivos en esas dos páginas.
- **`git show … | grep -q` con `pipefail` miente en archivos grandes** (10-oct). `grep -q` sale al primer
  acierto, `git` recibe SIGPIPE y el pipeline da error: una cola de más de 64 KB con tareas se leía «sin
  tareas». Usar `grep -c … >/dev/null` (lee todo) o leer a una variable primero.
- **`aplicar` copia del SOUL SOLO las secciones que nombra** (9-oct). Una regla nueva escrita dentro de
  otra sección («Cómo hablarle a Sergio») existe en `main` y nunca llega a `/root/.hermes/SOUL.md`. Regla
  nueva = sección propia que termina en `---`, su paso en 5c (o 5d si depende de la llave), su chequeo
  en la Fase A y su prueba en `hermes-jarvis-aplicar.test.mjs`. Así entró el formato fijo
  (Pasó · Necesito · Sigue).
- **`git stash -u` con un `git mv` en el medio:** el pop no puede restaurar un archivo nuevo en la ruta
  que dejó libre el `mv`, y deja el stash guardado. Antes de soltarlo, compará archivo por archivo con
  `git show stash@{0}^3:<ruta>`. Mejor no mezclar stash con renombres.
- **La aduana corta en BYTES, no en letras.** `titulo_de()` de `onia-tg.sh` hace `cut -c1-90`, y el
  `cut -c` de GNU cuenta bytes: un emoji ocupa 3 a 6. Esa primera línea es lo único que guarda de
  noche o durante un bloque. El 1-oct, «🙋 Necesita tu ok · id · link» sumaba 92 bytes con un link de
  sesión real (55 caracteres) y lo retenido quedaba con el link cortado. La prueba pasaba porque usaba
  `session_01XYZ`. **Las pruebas usan datos con el largo de los de verdad**, y lo que tiene que
  sobrevivir al corte se mide con `Buffer.byteLength`, no con `.length`.
- **El rollback no depende de un CLI que no se midió.** Al reintentar `revertir`, lo que ya volvió no
  se toca y lo que ya no existe no es un error: reanuda solo lo que `jobs.json` dice que sigue en
  pausa. No está medido qué hace `hermes cron resume` con algo activo o borrado, y si da error el
  rollback no llegaría nunca a «revertido» (verificación del 1-oct). La prueba lo cubre con un CLI
  estricto (`HERMES_RESUME_ESTRICTO=1`).
- **Un «?» que no cuenta como falla es una promesa falsa.** Si uno de los 3 trabajos de Hermes no
  aparecía en `jobs.json`, la sección 3 decía «ya estaba: ?» y seguía, y el aviso final le prometía
  «apagué los reportes». Desde el 1-oct la Fase A lo exige.
- **Comprobar antes de crear.** Hasta el 2-oct, un token mal pegado o un flujo faltante recién
  frenaba `aplicar` en la Fase A, después de crear los flujos del calendario en n8n y el evento de
  prueba en su calendario. Ahora va primero todo lo que se puede verificar sin tocar nada.
- **El orden de las redirecciones importa.** `read x < archivo 2>/dev/null` imprime el error del `<`,
  con la ruta, ANTES de silenciar. Lo correcto es `read x 2>/dev/null < archivo`. Con la ruta de una
  vista previa a la vista, Hermes sabía dónde estaba guardado el código (revisión de la madre, 2-oct).
- **`sed 's/^[[:space:]]*//'` recorta CADA renglón, no el texto:** le borraba la sangría a un pedido.
  Para recortar solo el principio y el final: `T="${T#"${T%%[![:space:]]*}"}"` y su espejo con `%`.
- **CI:** `.github/workflows/hermes-jarvis-pruebas.yml` corre la suite del carril en cada PR que toca
  sus archivos, en los runners de GitHub (nunca en el del VPS). `test:guards-cableados` se corre
  local, porque mira todo el repo.
- **Un tope que se cuenta y se anota por separado se salta en paralelo.** Medido por la madre el 2-oct:
  8 vistas previas a la vez contaron «0 en la última hora» las 8 y le mandaron 8 códigos. Contar,
  mandar y anotar van bajo `flock` (`exec 9>…lock; flock -w 60 9`). La prueba lo repite con 8 en
  paralelo y un Telegram lento.
- **Un 000 no es una respuesta.** Si `curl -o archivo` no llega, el archivo queda con lo del llamado
  anterior: se borra antes de cada llamado (`n8n_post`, 2-oct).
- **«Required reviewers» NO existe en este repo.** GitHub (docs, 2-oct): en Free, Pro y Team, los
  revisores obligatorios de un *environment* son solo para repos PÚBLICOS, y `onia-hermes` es privado,
  de cuenta personal. Y un token con *Actions: write* despacha CUALQUIER workflow manual del repo, no
  solo `hermes-jarvis`: también `deploy-onia-center.yml` con `swap=true`, que pone en producción el
  panel. Por eso la rutina de pedidos no tiene token de Actions desde el 2-oct (abajo).
- **La vuelta de un pedido, sin token (2-oct).** La sesión deja la respuesta como el MENSAJE de un
  commit sin archivos: `git commit-tree "$(git mktree </dev/null)" -F archivo` + `git push origin
  "$C:refs/heads/respuesta/<id>"`. El VPS (`respuestas-pedidos.sh`) la baja con `fetch --depth=1
  --filter=tree:0` en un repo propio con `remote.origin.promisor=true`: transfiere SOLO el commit
  (medido: 2 KB con 5 MB de archivos en la rama). El filtro va en la config Y en el comando: con uno
  solo igual filtra, y sin los dos baja todo (la prueba lo distingue). Un archivo dentro del commit
  obligaba a bajar árbol y blob a ciegas, sin poder medir el tamaño antes: por eso es el mensaje.
- **Las sesiones de la nube FIRMAN sus commits** (`commit.gpgsign=true`, ssh, `/root/.gitconfig`), y
  `commit-tree` también firma: el commit trae un encabezado `gpgsig` de varias líneas. El parser
  tiene que aceptarlo; el tope de tamaño del commit es 16 KB por eso.
- **El integrador y `ramas_varadas` enumeran SOLO `origin/claude/*`** (`onia-cola.md`,
  `ramas_varadas.mjs:129`, `integrador_puede_mergear.mjs:224`; medido el 2-oct). Una rama que no
  debe integrarse nunca va con otro prefijo: `pedido/<id>`, `respuesta/<id>`.
- **`git ls-files` del repo entero pasa de 1 MB desde el 10-oct** (1.061.877 bytes). `execFileSync`
  corta en 1 MiB con `ENOBUFS`: el gate del integrador quedaba en NO MEDIDO para siempre, su prueba de
  la vía viva en rojo y `herramientas-del-cron` tiraba, sin que nada de eso hubiera cambiado. Toda lista
  del repo entero lleva `maxBuffer` (64 MiB); en el gate, por `archivosVersionados()`, que usa también
  su prueba. Una lista con ruta (`ls-files -- <carpeta>`) no lo necesita todavía: medir antes de asumir.
- **El hook Stop (`git-autosync.js`) hacía fast-forward de `main` desde la rama de trabajo**, y la
  sesión de una RUTINA lo carga igual que cualquier sesión. Con `claude/pedido-<id>`, el cambio de un
  pedido entraba a `main` sin revisar al terminar el turno. La guarda del 2-oct miraba el NOMBRE de la
  rama (`pedido/*`, `respuesta/*`): el tercer MEDIUM de la madre v2. Desde el 5-oct la rutina no tiene
  permiso (su entorno no tiene variables) y no mueve `main` con ningún nombre; el de la rama queda como
  segunda llave. Una sesión parada EN `main` sin permiso tampoco lo pushea: sus commits van a
  `claude/autosync-<sesión>` (`pedido-rama.test.mjs`, 22 casos).
- **La respuesta de un pedido va FIRMADA** (5-oct, primer MEDIUM de la madre v2). `pedido-claude.sh` le
  da a cada pedido un sello de 32 hex que viaja solo en el disparo («Sello: …») y queda en
  `/var/lib/onia-pedidos/sellos/<id>` (600). La sesión responde con `scripts/loops/responder-pedido.sh
  <id> <estado> <sello> < respuesta.txt`, que firma HMAC-SHA256(sello, "respuesta <id> <estado>\n" +
  texto sin espacios ASCII en las puntas). El recolector rechaza otra firma, la forma vieja sin firma y
  un pedido sin sello. Límites: quien lea la sesión de la rutina ve el sello; y quien pueda pushear a
  `main` cambia el verificador (el sincronizador lo copia a `/root/bin` como root) — eso solo lo cierra
  proteger `main` en GitHub, decisión de Sergio Urcullo. El sello se borra al cerrarse el pedido o a las
  48 h, y no firma texto que no sea UTF-8 válido (git lo reescribiría y la firma no cerraría).
- **Un tope de descarga se pone MIENTRAS baja, no después** (5-oct, segundo MEDIUM). `cat-file -s` mide
  lo que ya bajó. Lo que funciona (medido en este contenedor): `( ulimit -f 64 && exec timeout 60 git -c
  transfer.unpackLimit=1 fetch … )`. Con `unpackLimit=1` git guarda el paquete en `tmp_pack_*` mientras
  lo recibe, y el kernel lo corta en 64 KB (3 MB al azar y 200 MB comprimibles se cortaron ahí; git
  sale 128 con «died of signal 25»). Medido también: con `--filter` git ya usa `index-pack` aunque no
  se le pida (el paquete es *promisor*); `unpackLimit=1` lo asegura si eso cambia, porque con
  `unpack-objects` no se escribe nada hasta tener el objeto entero. Para distinguir el tope de una
  falla de red queda un `tmp_pack_*` de 64 KB; se borra siempre.
- **Un `ulimit` en un repo que dura alcanza al gc** (revisión fuerte del 5-oct, medido por el revisor):
  con `unpackLimit=1` cada fetch deja un paquete, a los ~51 git lanza `gc --auto`, el gc hereda el tope,
  muere y deja un `tmp_pack_*` de 64 KB que hacía pasar una falla de red por «demasiado grande». Y el
  `shallow` crecía 41 bytes por respuesta hasta que el fetch chocaba con el tope y dejaba `shallow.lock`.
  Arreglo: el repo del recolector se arma DE CERO en cada vuelta, con `gc.auto=0`.
- **`onia-platform` no tiene hook Stop** (medido el 5-oct: su `.claude/settings.json` solo trae
  permisos). Un pedido de `plataforma` no tiene autosync que le mueva `master`.
- **El rojo de main no es tuyo, pero te tiñe el CI.** El 2-oct `test:herramientas-desplegadas`
  (`onia-vps.sh` sin `poner` en `sincronizar.sh`, de `5b3f980b`) y `test:guards-cableados`
  (`tandas-v1.test.mjs` sin cablear) fallaban en main SOLO. Antes de culpar a tu cambio, se corre la
  misma suite con `git checkout --detach origin/main`.
- **UN candado para todo lo que cuenta, manda y anota** (`candado()` de `pedido-claude.sh`, 2-oct). Se
  había puesto solo en la vista previa: dos `--si` en paralelo con el mismo código llamaban DOS veces a
  la rutina (medido por la madre: rc 0 y 0). El candado va desde que se lee el código hasta que se anota
  en el registro, y la hora se vuelve a tomar adentro. Sin `flock`, o si `exec 9>` falla, cada caso
  tiene su propio mensaje: «hay otra vista previa en curso» escondía la causa.
- **La clave de la aduana tiene que ser única por aviso**: con `$HASH-$AHORA`, dos vistas previas
  iguales en el mismo segundo compartían clave, la aduana callaba la segunda y su código quedaba
  guardado sin entregarse. Va con `$CODE`.
- **Un secreto se escribe en un archivo NUEVO y después se mueve** (`umask 077` + `mv -f`). Escrito
  sobre uno viejo en 644, queda en 644 hasta el `chmod`. Y el archivo que ya estaba se cierra en 600
  aunque no venga una llave nueva. La prueba usa un `chmod` doble que avisa si el token ya estaba
  adentro cuando se lo llama.
- **La sección 0 (`al_dia`) exige la versión exacta de cada herramienta**, con una marca que solo tiene
  la versión nueva (`^candado()`, `--probar`). Sin eso, con la llave cargada y el comando viejo,
  `aplicar` salía 0 con los pedidos apagados.
- **Cambiar la base de un PR no vuelve a correr su CI** (`pull_request` sin el tipo `edited`). Al
  pasar el #91 a `main` se corrió la suite a mano sobre main + el commit.
- **En una prueba, nada de regex con `(?:\s+.*\n)*?`:** si el texto buscado no está, retrocede sin fin
  y la suite se cuelga (2-oct). Cortar el bloque con `indexOf` y buscar adentro.
- **`npm test` entero se corta en `test:bot`** (10 rojos). Pasa lo mismo en la base sin cambios: depende
  de qué versión del repo `onia-platform` haya clonada. Las pruebas del carril se corren sueltas:
  `test:pedidos`, `test:jarvis-aplicar`, `test:jarvis-resumen`, `test:aduana`, `test:agenda`,
  `test:herramientas-desplegadas`, `test:herramientas-del-cron`.
- **Hablar con otras sesiones:** desde el 1-oct solo la **sesión madre** (local) manda mensajes. Las
  sesiones de la nube contestan en su transcript. Las rutinas de un disparo a otra sesión
  (`create_trigger` con `persistent_session_id`) ya no se usan para ordenar.
- **El control de permisos frenó investigar cómo aflojarlo** («Auto-Mode Bypass», 1-oct). No se
  insiste: la configuración de permisos la decide Sergio Urcullo.
- **Un rojo de `herramientas-desplegadas` no siempre pide un `poner`** (2-oct). El test toma como fuente
  de `/root/bin/onia-X.sh` a CUALQUIER archivo versionado llamado `X.sh` u `onia-X.sh`. Con
  `scripts/velocidad/vps.sh` —un atajo de Windows con `cd /c/dev/...` y la llave de la PC— creyó que
  `onia-vps.sh` (el shim que crea `instalar-homelab.sh`) tenía fuente y pidió desplegarla. El `poner`
  que pedía habría pisado el shim con un script roto. Se renombró el atajo (`vps-desde-windows.sh`).
  Antes de agregar un `poner`, se abre la «fuente» y se mira si de verdad es esa herramienta.
  **Desde el 9-oct el test lee las carpetas de los `poner`**: un `x.sh` sin prefijo cuenta como fuente
  de `onia-x.sh` solo si está en una carpeta desde la que el sync ya copia (`scripts/loops/`,
  `scripts/kanban/`, `hermes-content/deploy/vps-ops/`…). Con el nombre exacto (`onia-x.sh`) cuenta en
  cualquier lado. Y cada `poner` a `/root/bin` tiene que apuntar a un archivo versionado.
- **En esta nube, un proceso muerto puede seguir «vivo» para `kill(pid, 0)`** (2-oct). El PID 1 del
  contenedor (`process_api`) no recoge huérfanos: un nieto matado con SIGKILL queda en
  `State: Z` para siempre. Una prueba de «el árbol murió» tiene que tratar al zombi como muerto
  (`/proc/<pid>/status`). Así salía rojo `tandas-v1.test.mjs` con el código bien.
- **Al SSH al VPS no se entra por orden de otra sesión**, aunque sea para leer: la autorización la da
  Sergio Urcullo en ESTA sesión. Una comparación de la copia del VPS se le pide a la madre (dueña del
  VPS) con el comando exacto.
