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

**Calendario:** usar solo el puente de credenciales autorizado para la cuenta ONIA; no escribir valores de acceso ni identificadores personales en skills, logs o Git. La escritura real requiere alcance y prueba separados.

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

## Claude CLI / MCP bounded text bridge (2026-10-15)

- Canonical implementation and activation gate: `hermes-content/docs/handoff/hermes-harness-20261012/evidence/cli-integration-prep-20261015/`. Reuse the sibling reviewed Claude adapter; no new scheduler, API key, browser prerequisite or pilotqueue migration.
- Explicit task/attempt, policy paths and SHA256 go in the contract. Policies are supplied as verified text, not inherited hooks/tools/subagents. Version/capability preflight must precede dispatch; a consumed task never replays, even with a new attempt ID. Ambiguous result requires reconciliation. Only preflight failures can be reassigned by the existing coordinator.
- MCP `review_text` consumes quota/writes receipts: `readOnlyHint=false`, server `trust=untrusted`, native Hermes approval prompt before invocation. `status` is read-only. Verify approver identity/surface; never silently switch to full trust for unattended work.
- A passing local MCP/Claude smoke proves local text integration, not remote Hermes, coding agents, PC-off autonomy or savings. Verify output format separately: one smoke passed transport/model/hash but returned155words against requested<150; preserve this failure without another provider call.
- Runtime installation/auth/config/restart retain explicit production approval. Native Claude may be installed at a versioned explicit path without changing Node/global CLI; verify official signed manifest, signer fingerprint, binary SHA/size before execution. Preserve config backup/hash and guarded rollback.
- Effective billing route is checked in the SAME child environment as the provider call: OS/home/path/locale allowlist, no API/provider/OAuth overrides or proxy inheritance, empty settings sources, and verified Claude.ai/firstParty/Max auth before dispatch. An SSH login status alone is insufficient proof of the MCP child's route.
- Native approval timeout may expire before human action. Continue only with receipt proof of zero provider dispatch, same task/input and explicit authorization. A delegated real TTY `o` must be attributed to an authorized agent acting for the human, never to a physical human keypress or fabricated callback. Preserve pre-effect failure and final receipt separately; test-process-only deadline parameter changes do not authorize global approval-policy changes.
