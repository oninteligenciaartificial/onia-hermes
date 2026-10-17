# Método madre/Codex retirado el 17-oct-2026 (texto original)

> **HISTÓRICO, no rige.** Reemplazado por `AGENTS.md` §1 (la jefa reparte, la madre controla la PC, Codex solo revisa) y §4
> («Quién mueve `main`»: solo por PR con CI verde y revisión de Codex; la madre no empuja `main`). Se guarda el texto
> que salió de las skills `onia-sesion-madre` y `equipo-de-agentes` para no perder las mediciones (sandbox de Windows,
> junctions, worktrees sparse, cupos de Codex) por si algún día se rehace un camino de ejecución. Nada de esto autoriza a
> Codex a ejecutar encargos ni a nadie a mover `main`.

## De la skill `onia-sesion-madre`

## El permiso de mover `main` (5-oct)

- Desde el 5-oct el hook Stop solo mueve `main` con permiso (Sergio Urcullo: «sí, la madre sigue directo»).
  **Desde el 9-oct exige además una MARCA en el checkout de la madre**, porque la madre corre en un worktree
  (`claude -w`) y sus subagentes en otros que heredan la variable. Al arrancar una madre en un worktree nuevo,
  una vez: `touch "$(git rev-parse --absolute-git-dir)/onia-autosync-main"` (en PowerShell:
  `New-Item -ItemType File "$(git rev-parse --absolute-git-dir)/onia-autosync-main"`). Sin la marca, el log del
  Stop dice «permiso de main ignorado» y su rama se pushea igual: no se pierde nada.
  La madre lo tiene con **`ONIA_AUTOSYNC_MAIN=1` en el `.claude/settings.local.json` de SU carpeta de
  onia-hermes** (`{"env": {"ONIA_AUTOSYNC_MAIN": "1"}}`), que git ignora desde el 5-oct. Así vale solo para las
  sesiones abiertas en esa carpeta. Nunca en `.claude/settings.json` (se lo daría a todas las sesiones, también
  a las de la nube), ni en `C:\Users\PC\.claude\settings.json` o una variable de Windows (alcanzaría a
  cualquier sesión de la PC; revisión del 5-oct).
- Se verifica en el log del Stop: con permiso dice «main al día (fast-forward)»; sin permiso, «main no se toca».
- Sin el permiso no se pierde nada: la rama se pushea igual, y si la madre estaba EN `main`, sus commits quedan
  en `claude/autosync-<id de la sesión>` y la sesión queda parada en esa rama.
- Las sesiones de la nube no lo tienen: su trabajo llega a `main` por PR, que revisa la madre (v2) y mergea la
  madre o Sergio Urcullo.

## Delegar código a Codex (medido el 4-oct; conexión rehecha el 8-oct)

Sergio Urcullo, 8-oct: **Claude es la madre y Codex trabaja dentro de ella** («aprovechemos mis dos suscripciones»).
Se trabaja en la app de Claude; Codex corre por detrás. Codex no orquesta, no abre sesiones ni mergea.

- **Codex en la NUBE primero (8-oct):** no depende de Windows ni de la PC prendida. Hay 2 entornos:
  - `6abad6a0aae081919f0b315818becb21` = «ONIA Platform — QA y desarrollo» (onia-platform, ~33 MB);
  - `6abad782eba0819196ca234dc3abc327` = «ONIA Hermes — revisión y desarrollo» (onia-hermes).
  Se lanza con `codex cloud exec --env <id> --branch <rama> "<prompt cerrado>"`, se sigue con `codex cloud status <task>` y se
  trae con `codex cloud diff` / `apply`. El CLI 0.139 no elige modelo en la nube.
  ⚠️ El repo de Hermes pesa ~6 GB y su setup corre `pnpm install` de web-factory: la tarea de prueba quedó «pending» más de
  12 min. Esa es la «cola» que ve Sergio Urcullo. **Codex en la nube = código de Platform.** Los docs y fichas de Hermes se delegan a Codex local; la demora histórica de cloud no justifica cargarlos siempre a Claude (corrección 2026-10-09).
  `codex cloud` sin argumentos es una TUI y no corre desde acá. Los entornos se listan con la API que usa el CLI:
  `GET https://chatgpt.com/backend-api/wham/environments`, con el token de `~/.codex/auth.json` y sin imprimirlo.
- **Codex local** (más rápido que la nube para tareas de Hermes): `scripts/codex-tarea.sh <tarea.md> <worktree> [modelo]
  [esfuerzo]`, en segundo plano. Usa el `codex` de npm (0.161) con `windows.sandbox="unelevated"`: así corren gpt-6-astra
  y gpt-6.1-sol con sandbox (las dos probadas el 8-oct). Deja
  `resultado.md`, `eventos.jsonl` y `session_id` en `~/.codex/madre-tareas/<fecha>-<tarea>/`. Para un seguimiento en la
  misma conversación: `scripts/codex-tarea.sh resume <session_id> <seguimiento.md>`.
- ⚠️ **Nunca editar `scripts/codex-tarea.sh` mientras corre una tarea.** Bash lee el script de a pedazos: el 8-oct, al
  agregar el modo `revisar` con U1 en curso, su cierre ejecutó otra rama («sid: unbound variable») y dejó la salida en
  una carpeta `resume-*`. El trabajo de Codex no se perdió (quedó en el worktree), pero el `resultado.md` quedó en la
  carpeta original `…-u1`.
- ⚠️ **En el sandbox local, Codex no corre tsc, vitest ni Playwright** cuando `node_modules` es un junction compartido
  («dependencias ausentes», `spawn EPERM`, 8-oct, 4 de 4 tareas). La validación la da el CI del PR y las capturas las
  saca Plataforma. Cada commit lo dice explícito. **Lo que sí corre:** tests de node puro con
  `node --test --test-isolation=none` (sin procesos hijos). Así C16c, el bot del VPS, pasó 335/335 el 8-oct.
- 🔴 **Causa real (medido el 8-oct con C16d): el junction apuntaba a una carpeta VACÍA.** `C:/dev/proyectos/onia-platform/node_modules`
  tiene 0 paquetes, y todos los worktrees `onia-platform-codex-*` apuntaban ahí. La instalación completa (682 paquetes)
  está en `C:/dev/proyectos/onia-platform-v1-integracion-20260927/node_modules`. Se crea así, en PowerShell:
  `cmd /c mklink /J <worktree>\node_modules C:\dev\proyectos\onia-platform-v1-integracion-20260927\node_modules`.
  Con ese junction, la madre corrió `npx vitest related <archivos tocados> --run` y dio 971/971, y encontró un test viejo
  roto que Codex no había visto (`fetch-con-limite.test.ts`). **Antes de commitear un trabajo de Codex en onia-platform,
  la madre corre la suite COMPLETA ella misma; `vitest related` solo sirve como diagnóstico parcial (corrección 2026-10-09).**
- 🔴 **`vitest related` NO alcanza** (Plataforma, 8-oct): el registro de rutas (`lib/platform/api-route-registry.test.ts`)
  y los ratchets de UI y de voseo solo los atrapa la suite completa. Así se escaparon tres rojos de C16b y C16d después
  de que la madre los dio por buenos con `related` (1002/1002). Antes de commitear: `npx vitest run` COMPLETO y
  `npx tsc --noEmit`, con los números en el commit. Si el tsc falla por el cliente Prisma compartido, se dice.
- **El push va DESPUÉS del resultado de la suite, en el mismo comando con `&&`** (9-oct, S1b: con `;` se pusheó con 57 rojos). Si la máquina está cargada, los tests que lanzan procesos (`backup-onia-postgres`, `rango-gitleaks`, `qa-v1/snapshot`) fallan por tiempo: se corren solos antes de dar el rojo por bueno.
- **Plataforma (nube) no puede pushear ramas nuevas a onia-platform** (9-oct): deja la rama en un bundle en `hermes-content/docs/cola/ramas-locales/*.bundle`. La madre la trae (`git fetch <bundle> refs/heads/X:refs/heads/X`), la pushea y abre el PR con el texto que dejó en `docs/cola/pr-*.md`.
- **Medición histórica: la suite de Codex dio ~148 rojos y la de la madre, 0** (W1b, K2 y K3, 9-oct). En el sandbox, los subprocesos
  dan `EPERM` y fallan tres pruebas de zona horaria. El gate es la corrida COMPLETA de la madre en la PC, no la de Codex.
  Antes de commitear: `git checkout -- '*.snap'`, porque las corridas dejan los snapshots modificados solo por los
  finales de línea.
- **Nombres observados el 8-oct por la noche, no confirmados vivos hoy (corrección 2026-10-09):** «Plataforma Onia 1.0», «Ventas y pauta Onia», «Marca personal de
  Sergio Urcullo», «Sesión Lucía de Onia», «Hermes-Jarvis sesión con Sergio Urcullo». `SendMessage` falla con el nombre
  viejo («Marca personal: comunidad y contenido»): `ListAgents` primero, siempre.
- Los tests de bash de Hermes (`scripts/loops/pedido-*.test.mjs`) fallan en Windows también en `main` (70 de 78): son
  para Linux. Su gate es el CI del PR, no la PC.
- **Codex en un repo pesado (onia-hermes, ~6 GB):** worktree con `--no-checkout` + `sparse-checkout set <carpeta>
  .agents AGENTS.md CLAUDE.md` + `checkout`. Solo baja la carpeta de la tarea. Ruta corta (`C:/dev/proyectos/…`): bajo el
  scratchpad, Windows corta por «Filename too long».
  - 🔴 **En Git Bash, los patrones con `/` adelante se vuelven rutas de Windows.** `'/scripts/'` queda como
    `C:/Program Files/Git/scripts/`, el filtro no aplica nada y el checkout baja el repo entero. Pasó el 8-oct: 6,2 GB y
    el disco quedó en 203 MB libres. Se escribe `MSYS_NO_PATHCONV=1 git -C <wt> sparse-checkout set --no-cone '/scripts/' …`
    y después se confirma con `git sparse-checkout list` y `du -sh`.
  - **Disco de la PC:** antes de lanzar un análisis de videos o un worktree, `df -h /c`. Codex falla con menos de 1 GiB
    libre. Los videos que baja un análisis se borran al terminar cada video: el resultado es el texto, no el mp4.
- **Los informes que escribe Codex** (`docs/C16A_*.md`, `*-ENTREGA.md`) NO van al commit: van al cuerpo del PR, para
  no llenar de docs sueltos los repos del producto.
- **Ver videos e Instagram lo hace la MADRE, no Codex** (probado el 8-oct). Con red habilitada
  (`sandbox_workspace_write.network_access=true`), Codex local igual falla con `spawn EPERM` porque el sandbox sin elevar
  no deja que node lance yt-dlp. La nube no abre Instagram. La madre sí: `fetch-video.mjs` + Gemini + láminas leídas (los 5
  posts del 8-oct). Regla: todo link que Sergio Urcullo le mande a una sesión de la nube, la sesión se lo pasa a la madre;
  ella lo analiza (mensaje, tema, edición), deja la ficha en `references/video-intake/` y lo aprendido en la skill.
- **Codex atiende pedidos de las sesiones de la nube** que ellas no pueden hacer (código y tests). Decide la madre con el
  router, por si conviene Claude o Codex. Codex sigue las mismas reglas (`AGENTS.md` remite a `CLAUDE.md`). «Habla» con la
  madre por su `resultado.md`: si le queda una duda, la escribe ahí, y la madre le contesta con `codex-tarea.sh resume`.
- **Codex verifica a la madre; no hay madre 2 abierta** (Sergio Urcullo eligió esto el 8-oct). Una madre 2 sería un
  segundo orquestador y relee todo el contexto, así que gasta mucho. Antes de mergear un PR propio, la madre corre
  `scripts/codex-tarea.sh revisar <carpeta> origin/main` (gpt-6.1-sol, esfuerzo medio, para no quemar la cuenta; Astra
  solo si toca cobros, producción o permisos) y pega `resultado.md` como comentario del PR. Con esa revisión el control
  de permisos deja mergear. La primera corrida, el 8-oct, tardó ~3 min. Si la madre se cae, el fallback es el handoff
  al día: una madre nueva arranca leyéndolo.
- **Modelos (actualización 2026-10-09, `equipo-de-agentes`):** código cerrado, fichas, auditorías y síntesis con `gpt-6.1-sol` medium por defecto; `gpt-6-astra` medium para seguridad, cobros o arquitectura y decisiones de riesgo. Si el resultado es malo, se escala con la prueba del fallo, no por costumbre. Lista viva:
  `~/.codex/models_cache.json`.
- **La tarea es un prompt cerrado:** META · PRUEBA DE HECHO · REGLA DE PARADA · archivos que toca y los que no · reglas
  fijas (sin push, sin VPS, sin producción, sin instalar). Modelo: `hermes-content/docs/handoff/codex-tareas/*.md`.
- **Cupo:** semanal (plan `prolite`). El uso se lee en el último `rate_limits` de `~/.codex/sessions/**`. Con 80 % usado
  no se lanza nada nuevo (reserva del 20 %, decidida el 6-oct).
- ⚠️ **Sandbox de Windows (8-oct):** el CLI que trae la app de Codex (0.162-alpha) falla SIEMPRE con sandbox
  («setup refresh had errors»: `node_repl.exe` del runtime `cua_node` «en uso»), aun con la app y sus procesos cerrados.
  Correrlo sin sandbox lo frena el control de permisos de Claude Code («Create Unsafe Agents»), y no se rodea: tampoco se
  pueden matar procesos ajenos («Interfere With Workloads»). Qué se probó:
  - el npm 0.161 con el config («elevated») falla igual;
  - con `--ignore-user-config` responde «bloqueado por la política»;
  - con `-c windows.sandbox="unelevated"` **funciona**.
  El npm 0.139 también andaba, pero solo con gpt-5.5, que deja Codex el 14-oct según el aviso oficial que citó Codex.
  Cuando falla, Codex lo reporta honesto en `resultado.md` y no inventa.
- **Codex en la nube SÍ corre:** la prueba del 8-oct en el entorno Hermes terminó READY a los ~20 min (el repo pesa). El
  resultado se trae con `codex cloud diff <task>` y `codex cloud apply <task>`.
- ⚠️ **El modelo de Codex en la nube NO se elige desde la CLI** (medido el 8-oct con el punto 14): se pidió
  `-c model="gpt-6-astra"` y la tarea corrió con **gpt-5.6-sol**. Se verifica con `model_version` en
  `GET /wham/tasks/<task>`. Lo que necesite Astra va a Codex local; la nube sirve para trabajo de calidad Sol.
- **Llevar un diff de Codex a onia-platform sin hacer checkout:** el repo tiene rutas demasiado largas para Windows y
  `git worktree add` falla con «Filename too long». Se arma el commit con un índice temporal:
  `GIT_INDEX_FILE=<tmp> git read-tree origin/master && git apply --cached x.diff && git commit-tree $(git write-tree) -p
  origin/master -F msg`. Después `git branch -f` y `push`. Así salió onia-platform#124.
- Worktree aislado por tarea, rama `codex/<tarea>-<fecha>` (nunca `claude/*`); en onia-platform, `node_modules` por
  junction. **Codex NO commitea:** no se le da el `.git` común, porque sus `hooks/` y su `config` se ejecutan fuera del
  sandbox la próxima vez que la madre usa git (revisión del #151, 8-oct). La red sigue cerrada. La madre revisa el diff
  de la carpeta, commitea, empuja y abre el PR, con 1 o 2 lentes de revisión según el riesgo.
- El `tsc` local falla con el cliente de Prisma compartido: el CI del PR es el gate de tipos.
- **La madre commitea SOLO con los tests en verde, con un gate en el mismo comando**
  (`echo "$out" | grep -q failed && exit 1`). El 4-oct se subió `5c58175c` con un test rojo porque el `grep` de la
  salida no cortaba la cadena; se arregló en `83f93948`.
- Los arreglos de una revisión vuelven al mismo worktree de Codex, en otra corrida con la lista de hallazgos, y
  después vuelve a revisar la madre con Codex; la madre v2 separada es histórica (corrección 2026-10-09). Así salieron los 9 puntos del #110 en 2 vueltas.

## De la skill `equipo-de-agentes`

## 4. Despachar a Codex (paso a paso, medido el 8 y 9-oct)

1. Worktree en una ruta corta, `C:/dev/proyectos/onia-platform-codex-<tarea>`, desde la rama que dice la tarea. Si hay que
   traer `master`: lo hace la madre (Codex no puede git). Conflictos en docs → `git merge-file --union`. En código, se deja
   el merge abierto y se le pide a Codex que resuelva los marcadores.
2. `node_modules`: junction a `C:\dev\proyectos\onia-platform-v1-integracion-20260927\node_modules` (la de
   `onia-platform` está vacía).
3. El prompt lleva la NOTA DE LA MADRE (carpeta, rama, «no hagas git», «PARA LA MADRE:» al final) + el texto de la tarea.
4. `bash scripts/codex-tarea.sh <prompt> <carpeta> <modelo> medium`, en background y desde el worktree correcto. Para `resume`,
   hacer `cd` a la carpeta antes: toma el cwd.
5. Gate de la madre, siempre: `git checkout -- '*.snap'` → `npx vitest run` COMPLETO (JSON) → si hay rojos, ver si son
   reales o de carga (los tests que lanzan procesos se corren solos) → los reales vuelven a Codex con `resume` y la lista.
6. Push SOLO si la suite da 0 rojos, en el mismo comando con `&&`. El informe de Codex no va al commit: va al cuerpo o a un
   comentario del PR.
7. Mensaje de una línea a la sesión dueña: «X hecho en #N, suite N/0».

## 4 bis. Codex al máximo (2026-10-09)

- **Siempre se despacha a Codex** el código de alcance cerrado, las fichas a partir de fuentes disponibles, las auditorías y las síntesis verificables. La madre define el contrato, entrega solo el contexto necesario y verifica el resultado. Si falta acceso, cupo o evidencia, registra el bloqueo y sigue con otra tarea autorizada; no inventa la ficha ni deriva una restricción a otro agente.
- **Concurrencia recomendada:** 2 ejecutores independientes + 1 verificador, solo dentro del cupo de agentes y tokens disponible. La madre también ocupa un puesto si la herramienta la cuenta. Un worktree y archivos exclusivos por ejecutor; las tareas sobre la misma carpeta o archivos se serializan. El verificador revisa el resultado terminado y no compite por sus archivos. Si el cupo es menor, reducir concurrencia.
- **Modelo:** `gpt-6.1-sol` con esfuerzo medio por defecto para estos contratos; `gpt-6-astra` medio para seguridad, cobros, arquitectura ambigua o revisión de riesgo. Escalar con evidencia o por riesgo conocido, no por tamaño. Haiku/Luna quedan para conteos mecánicos cuando están disponibles; no sustituyen el juicio requerido.
- **Codex cloud:** tareas largas de Platform que no necesitan la PC, navegador autenticado, archivos locales ni secretos personales → entorno Platform `6abad6a0aae081919f0b315818becb21`. Antes de lanzar, la madre verifica acceso autorizado, repo/rama, alcance, cupo y modelo observado; disponer del ID no prueba acceso ni ejecución. El modelo solicitado por CLI no garantiza el modelo de la nube (medición 8-oct). Si se requiere Astra y no se confirma, usar el carril local autorizado.
- La madre sigue estado y recupera diff/resultado, revisa y ejecuta los gates del carril. La entrega incluye archivos, prueba ejecutada, limitaciones y `PARA LA MADRE:`. Mantener la reserva de cupo acordada; «al máximo» significa trabajo útil validado, no consumir hasta bloquear al equipo.
