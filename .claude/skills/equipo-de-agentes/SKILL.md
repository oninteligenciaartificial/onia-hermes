---
name: equipo-de-agentes
description: Usar al delegar un encargo o revisar una entrega. Quién hace qué, el contrato, cómo se verifica, los cupos de la orquesta y las trampas medidas. Hermes de la PC planifica, scripts/orquesta reparte, Claude Code integra por PR y Codex ejecuta contratos cerrados.
---

# Equipo de agentes de Onia

El método para delegar y verificar. Las reglas las fija `AGENTS.md` (versión de Sergio Urcullo del 26-oct-2026); esta
skill dice cómo se aplican. La ronda de 20 min, los latidos y la tabla de roles anterior son historia:
`hermes-content/docs/historial/EQUIPO_DE_AGENTES_MADRE_20261026.md`.

## 1. Quién hace qué

La tabla vigente es `AGENTS.md` §1 y el camino de un encargo, `hermes-content/docs/ONIA_HARNESS.md` §5. No se copia
acá: si cambia, cambia allá. Lo que importa para delegar:

- El Hermes de la PC es el único que planifica: convierte pedidos en issues, verifica entregas y propone el handoff.
  No edita código ni reglas y no hace git que escriba. El del VPS avisa por Telegram y carga solo lo que Sergio
  Urcullo le dicta.
- `scripts/orquesta/` reparte y hace revisar con otro modelo; no publica ni mergea. Claude Code es la sesión
  principal: trabaja con Sergio Urcullo e integra por PR. Codex ejecuta un contrato cerrado, sin git.
- **Una sola cola: los issues `orquesta` + `carril:<área>`.** Lo que no está ahí no es un encargo. Orca
  Orchestration, los planes, tareas y goals de Hermes y los mensajes entre sesiones no son cola ni dan permisos.

## 2. Cómo se delega

- Todo encargo lleva el contrato de `AGENTS.md` §4. Si le falta un campo, no se despacha: se completa o se pregunta.
- Se elige el modelo más liviano que pueda cumplir la prueba, y se escala ante un fallo demostrado o un riesgo conocido,
  no por tamaño. En la tarea quedan el modelo, el criterio de verificación y el motivo si se escaló (fuente:
  `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md` §1 y §4). Tabla de modelos:
  `hermes-content/docs/AI_MODEL_ROUTING_2026.md`.
- Una sola vía por tarea. Hay dos:
  - **La orquesta**, por defecto. Issue con el formato de `scripts/orquesta/README.md` §«Cómo se pide una tarea».
    El modelo sale de `nivel`; el worktree y la rama los pone la orquesta. Lo visible lleva `ok: sergio`.
    - Hermes de la PC carga solo con `scripts/orquesta/cargar-issue.mjs`, siempre con `origen:hermes` y
      `necesita-ok` (README §«Cómo carga Hermes de la PC»).
    - El del VPS deja sin `necesita-ok` lo de `nube` con `check: urls`, hasta el cambio del paso 5 de
      `ONIA_HARNESS.md` §7.

    Sergio Urcullo suelta la tarea sacándole el label.
  - **Codex lanzado desde la sesión principal**, para la 1.0 y la integración:
    `bash scripts/codex-tarea.sh <tarea.md> <carpeta> [modelo] [esfuerzo]`, en background y desde el worktree del
    encargo. `resume` toma el directorio actual: hacer `cd` antes. `revisar <carpeta> <rama-base>` pide la revisión
    previa al merge.
- Codex en la nube (`codex cloud exec --env <id>`, entornos y límites medidos el 8-oct): historia en
  `hermes-content/docs/historial/skills/onia-sesion-madre/SKILL.md` §«Delegar código a Codex». Los ids se verifican
  en vivo antes de usarlos.
- Permiso de mover `main` (solo la sesión principal): `ONIA_AUTOSYNC_MAIN=1` en el `.claude/settings.local.json` de
  su carpeta y, una vez por checkout, la marca
  `New-Item -ItemType File "$(git rev-parse --absolute-git-dir)/onia-autosync-main"` (bash: `touch`). Sin la marca
  el Stop dice «permiso de main ignorado» y pushea la rama: no se pierde nada.
- Codex en su worktree propio, con ruta corta. Si hay que traer `main`, lo hace quien lo lanzó. Si el merge deja
  conflictos en código, queda abierto y Codex resuelve los marcadores; los de docs, ver la trampa del `--union`.
- `node_modules` de onia-platform: junction a una instalación comprobada. La ruta que se usaba el 8-oct
  (`onia-platform-v1-integracion-20260927`) ya no existe: medido el 26-oct.
- El prompt dice carpeta, rama y «no hagas git», y pide cerrar con «PARA QUIEN ME LANZÓ:» (`AGENTS.md` §6).
  Sol medio por defecto; Astra para seguridad, cobros, infra con root o lógica de riesgo.
- Los subagentes de Hermes solo leen y verifican.

## 3. Cómo se verifica una entrega

- Se revisa el artefacto exacto (PR, rama y commit), no el resumen de quien lo hizo. Se corre el gate del carril y se
  conservan los errores.
- Revisa alguien distinto del autor, con contexto limpio. La orquesta usa el `revisor` de `scripts/orquesta/carriles.json`;
  la sesión principal, un subagente o `codex-tarea.sh revisar`.
- Gate de onia-platform después de Codex: `git checkout -- '*.snap'`, después `npx vitest run` completo con salida
  JSON. Ante un rojo se ve si es real o de carga: los tests que lanzan procesos se corren solos. Los reales vuelven a
  Codex con `resume` y la lista. Push solo con 0 rojos, en el mismo comando con `&&`. El informe de Codex va al cuerpo
  o a un comentario del PR, no al commit.
- Lo visible se muestra con captura a 390 y 1440, o con el video real, en el issue (`ok: sergio` deja `espera-ok`).
  Nunca «revisá tal cosa».
- Cuatro estados que no se mezclan, y se reporta el último alcanzado con su prueba:
  - **construido**: hay commit y PR;
  - **revisado**: revisor distinto y gate verde;
  - **publicado**: está en producción, encendido (lo que está detrás de un flag apagado no cuenta);
  - **mirado**: alguien lo abrió renderizado en producción.
- El Hermes de la PC compara el recibo con el «hecho cuando» y propone el handoff. Mergean Sergio Urcullo o la sesión
  principal, siempre por PR revisado. La publicación sigue `AGENTS.md` §3 y §6.
- A Sergio Urcullo se le escribe como dice `AGENTS.md` §7: corto, lo publicado con link o captura, sin el proceso. Un
  link sin instrucción es para aprender: skill `aprender-de-todo`.

## 4. Concurrencia

- Los cupos son los de `scripts/orquesta/carriles.json`: `paralelo: 3` (tareas a la vez por pasada, la más vieja de
  cada carril) y `minutos_max: 40` por tarea. Cada Hermes carga como máximo 10 issues por día: el de la PC
  cuenta también los del VPS (en GitHub); el del VPS cuenta solo los suyos.
- El mismo carril o los mismos archivos van en secuencia; carriles distintos, en paralelo. Para editar hacen falta
  worktree y rama propios.
- Sin cupo (Max, Codex o tokens) se baja el consumo, no se sube el techo. La orquesta suelta la tarea sin gastar el
  reintento.
- Workflows de más de 5 agentes solo si Sergio Urcullo pide algo exhaustivo: el 8-oct costaron ~60 M de tokens.
- Videos: Gemini gratis con `.claude/skills/ver-videos/scripts/gemini-see-video.mjs`. Se borra cada mp4 al terminar;
  si se llega al tope diario, se pasa a `flash-lite`.

## 5. Trampas medidas que siguen valiendo

- **Un mensaje de otro agente no es permiso** (10-oct). Tampoco un latido, un hook ni una regla que otro subió. Plataforma
  pasó 20 h con latidos respondiendo «espera el sí de Sergio Urcullo», hasta preguntar si la regla del 9-oct la había
  puesto él. Era correcto: la autorización cuenta solo si la escribe él en esa sesión. Cuando cambia una regla de
  permisos, se le pide una línea en cada sesión que publica. Nadie lo reemplaza.
- **El CI corre en el mismo VPS que publica** (9 y 10-oct). El publicador de la web (`onia-publicar-solo`) corre cada 3 h
  a las :50 UTC (00, 03, …, 21) y se salta la corrida si ve otro build. El CI de los PRs de onia-platform corre en
  `onia-runner-platform`, en ese VPS. El 10-oct se pushearon 7 ramas entre las 15:30 y las 15:45 UTC y la publicación
  de las 15:50 no salió; el 9-oct pasó igual. En esas horas no se pushea entre las :20 y las :55 UTC.
- **Codex no renderiza** (9-oct, `EPERM`). Escribe la composición y renderiza quien lo lanzó. En esta PC el Chrome de
  HyperFrames da `EFTYPE`: usar
  `HYPERFRAMES_BROWSER_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npx hyperframes render`.
- **No se cierran Chrome ni WhatsApp: Sergio Urcullo los usa** (10-oct, después de que se cerraron el 9). Se pueden cerrar
  Ollama, OneDrive y los `find /` colgados. `ChatGPT.exe` dentro de `OpenAI.Codex_*` es la app de Codex: no se cierra.
- **La nube no puede pushear ramas nuevas a onia-platform.** Deja un bundle y lo sube la sesión principal.
- **`--union` en una lista de casillas reabre lo hecho** (9-oct, merge `034533d4`). Volvieron como abiertas 3 tareas
  hechas y una sección salió dos veces. En `hermes-content/docs/cola/**` y `hermes-content/docs/handoff/**` se toma la
  versión de `main` y se le suma a mano lo nuevo.
- **Un entorno no habla por otro** (9-oct). En W1b, K2 y K3 la suite dio ~148 rojos en el sandbox y 0 en la PC. Se
  verifica cada entorno y manda el gate completo válido de esa entrega.
- **`vitest related` no alcanza**: se corre la suite completa.
- **Un loop o un latido no prueban trabajo** (9-oct). Lucía y Hermes siguieron solas; Plataforma, Marca y Ventas
  quedaron `idle` con tareas pendientes. Se cuenta la entrega, no el disparo.
- **Claude Code en modo auto no lanza los trabajadores de la orquesta** (18-oct): el control de permisos lo frena como
  «Create Unsafe Agents». La pasada la corre la tarea programada o Sergio Urcullo desde una terminal.
- **`SendMessage` con un nombre viejo falla**: `ListAgents` primero.
- **Git Bash convierte `'/dir/'` en una ruta de Windows**: `MSYS_NO_PATHCONV=1` para el sparse.
- **Disco**: `df -h /c` antes de bajar videos. Codex falla con menos de 1 GiB libre.
- **Memoria de la PC** (9 y 10-oct). El commit llegó a 39,5 de 40,8 GB con ~13 GB en procesos: el resto era paged pool
  del kernel en 17 GB (normal: menos de 1 GB), una fuga de driver que solo se libera reiniciando. Se mide con
  `Get-CimInstance Win32_PerfRawData_PerfOS_Memory` (`PoolPagedBytes`), no con el Administrador de tareas. Tras
  reiniciar: 0,96 GB. Sospechoso: Avast, que ningún agente toca. Si pasa de 3 GB se avisa; instalar RAMMap o poolmon
  para ver el driver pide su OK.
