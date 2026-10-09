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
- **En esta nube, un proceso muerto puede seguir «vivo» para `kill(pid, 0)`** (2-oct). El PID 1 del
  contenedor (`process_api`) no recoge huérfanos: un nieto matado con SIGKILL queda en
  `State: Z` para siempre. Una prueba de «el árbol murió» tiene que tratar al zombi como muerto
  (`/proc/<pid>/status`). Así salía rojo `tandas-v1.test.mjs` con el código bien.
- **Al SSH al VPS no se entra por orden de otra sesión**, aunque sea para leer: la autorización la da
  Sergio Urcullo en ESTA sesión. Una comparación de la copia del VPS se le pide a la madre (dueña del
  VPS) con el comando exacto.
