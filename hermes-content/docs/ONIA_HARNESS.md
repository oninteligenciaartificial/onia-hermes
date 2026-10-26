# Harness de ONIA

> **Fuente de verdad del harness.** Dice qué archivo configura a cada agente, dónde vive y cómo pasa un encargo de
> un agente a otro. Es un documento vivo y se edita en el lugar.
>
> Se rehízo el 26-oct-2026 con las dos decisiones de Sergio Urcullo de ese día:
> - manda un AGENTS.md nuevo y compacto;
> - planifica el Hermes de la PC y el del VPS solo avisa.
>
> La versión del 10-oct, de la época de la madre y los loops, está en `historial/ONIA_HARNESS_20261010.md`.
> La evidencia de todo esto está en `research/2026-10-26-auditoria-hermes-local.md`.

## 1. Reglas de diseño

- Todo lo que configura a un agente vive en el repo y entra por PR, salvo los secretos. La carpeta de cada agente
  (su *home*) recibe una copia o un puntero a esa fuente. Nadie la edita a mano, y el agente tampoco.
- Los secretos viven solo en el home del agente o en la bóveda. Nunca en el repo.
- Cada tema tiene una sola fuente:

  | Qué | Dónde |
  |---|---|
  | Reglas | `AGENTS.md` |
  | Método | `.claude/skills/` |
  | Estado | `hermes-content/docs/handoff/` |
  | Encargos | los issues `orquesta` |

## 2. Qué carga cada agente al arrancar

| Agente | Carga | No carga |
|---|---|---|
| Claude Code | `CLAUDE.md` y `AGENTS.md` del repo; `~/.claude/CLAUDE.md` y `~/.claude/rules/`; skills de `.claude/skills` y `~/.claude/skills` (con el mismo nombre gana la personal); `.claude/agents/` | — |
| Codex | `~/.codex/AGENTS.md` y el `AGENTS.md` del repo donde trabaja; `~/.codex/config.toml`; skills de `~/.codex/skills` y `.agents/skills`. En el carril plataforma el repo es `onia-platform`, que tiene su propio `AGENTS.md`: ahí las reglas duras de ONIA le llegan por el global | `CLAUDE.md`. Las skills de `.claude/skills` las recibe por ruta en el contrato |
| Hermes de la PC | `SOUL.md` de su home; **un solo** archivo del cwd (`AGENTS.md`); su memoria; skills de su home y de `skills.external_dirs` | `CLAUDE.md`, porque `AGENTS.md` lo tapa; `~/.claude/**`, que lo rechaza a propósito |
| Hermes del VPS | `/root/.hermes/SOUL.md`, `config.yaml` y `skills/<nombre>/SKILL.md` | Lo que `aplicar` no copió (un `.md` suelto en `skills/` no se carga) |
| Trabajador de la orquesta | Lo de su motor, en un worktree limpio, más el prompt de `orquesta.mjs` («no hagas commit, push ni merge»). Claude, con `scripts/orquesta/trabajador.settings.json`; Codex, con `-s workspace-write` | — |

## 3. Fuente en el repo y dónde se usa

| Qué | Fuente en el repo | Dónde se usa | Cómo llega | Estado al 26-oct |
|---|---|---|---|---|
| Reglas compartidas | `AGENTS.md` | Los tres agentes | Se lee del cwd | Nuevo, en PR |
| Reglas de Claude y sus casos | `CLAUDE.md` | Claude | Se lee del cwd | Vivo |
| Skills de ONIA | `.claude/skills/<nombre>/SKILL.md` | Los tres agentes | Claude: nativo. Hermes de la PC: `external_dirs` → `E:/onia-wt/hermes-base/.claude/skills`. Codex: por ruta en el contrato | Hermes ve 0 de 66 |
| Subagentes de Claude | `.claude/agents/` | Claude | Nativo | Vivo |
| Hermes de la PC: quién es | `hermes-content/deploy/hermes-pc/SOUL.md` | `%LOCALAPPDATA%\hermes\SOUL.md` | `Copy-Item`, con Hermes cerrado | Hoy usa el de fábrica |
| Hermes de la PC: config | `hermes-content/deploy/hermes-pc/config.onia.yaml`, con su prueba `probar-deny.py` | `%LOCALAPPDATA%\hermes\config.yaml` | Esas claves, con Hermes cerrado | Hoy corre con `--yolo` y sin `deny` |
| Hermes del VPS | `hermes-content/deploy/hermes-agent/SOUL.md` y `hermes-content/skills/` | `/root/.hermes` | Workflow `hermes-jarvis` → `aplicar` | El SOUL es viejo: habla de loops y del tablero archivado |
| Codex global | `hermes-content/deploy/codex/AGENTS.global.md` | `~/.codex/AGENTS.md` | `Copy-Item` | Hoy tiene el texto de agencia de las nueve líneas de negocio |
| Reparto | `scripts/orquesta/` y `carriles.json` | GitHub Actions y la PC | Git | Vivo |
| Carga de tareas desde la PC | `scripts/orquesta/cargar-issue.mjs` | Hermes de la PC | Lo corre Hermes; `gh issue create` le queda bloqueado | Nuevo, en PR |
| Skills del Hermes del VPS | `hermes-content/skills/*.md` (`planificar-orquesta`, `agenda-calendario`…) | Solo el VPS | `aplicar` las copia a `skills/<nombre>/SKILL.md` | El Hermes de la PC no las ve, y no las necesita |
| Estado de cada carril | `hermes-content/docs/handoff/<carril>.md` | Todos | Git | Vivo |

## 4. Lo que vive solo en cada home

**Hermes de la PC** (`%LOCALAPPDATA%\hermes`):
- `.env` y `auth.json`: las llaves.
- `memories/`: con aprobación.
- Sesiones, logs y `cron/`.
- `skills/` de fábrica. `skills/onia/` sale de ahí: lo útil pasa al repo.

`C:\Users\PC\.hermes` lo crea Orca, y Hermes no lo lee.

**Codex** (`~/.codex`):
- `auth.json`, `secrets/` y el historial.
- `config.toml`, con `model = "gpt-6.1-sol"`, `approval_policy = "on-request"` y `sandbox_mode = "workspace-write"`,
  más sus plugins. Hermes cambió esas dos claves el 25-oct (antes eran `never` y `danger-full-access`). El cambio es
  más seguro y se mantiene.

**Claude** (`~/.claude`):
- Las credenciales y `settings.json`.
- `CLAUDE.md` global y `rules/`. Hermes reescribió seis reglas el 25-oct; falta decidir si se mantienen o se
  revierten.
- Las skills personales.

**VPS** (`/root/.hermes`):
- `.env`.
- El token de Issues, en `/root/.config/onia/gh-issues-token`.

## 5. Cómo pasa un encargo

1. Sergio Urcullo pide algo. Puede hacerlo de dos formas:
   - en la TUI del Hermes de la PC, abierta a mano en PowerShell desde `E:/onia-wt/hermes-base`, sin `--yolo`;
   - dictándoselo al Hermes del VPS por Telegram.
2. Hermes arma el contrato (`AGENTS.md` §4) y lo carga:
   - el de la PC, con `node scripts/orquesta/cargar-issue.mjs` (primero con `--dry`, para mostrárselo);
   - el del VPS, con `scripts/loops/orquesta-hermes.sh`.

   El de la PC pone siempre `orquesta`, `carril:<área>`, `origen:hermes` y `necesita-ok`. El del VPS hace lo mismo,
   salvo `nube` con `check: urls`, que hoy carga sin `necesita-ok`; eso se corrige en el PR del paso 5 de §7.
3. Sergio Urcullo lo suelta sacándole `necesita-ok`, incluso desde el celular. El workflow no escucha cuando se saca
   un label:
   - una tarea de la nube arranca en la próxima pasada de Actions (cada 3 h, de 8 a 23) o al comentar el issue;
   - una de la PC arranca en la próxima pasada de la tarea programada (cada 3 h, de 8 a 23, con la PC prendida).

   El comentario le llega al trabajador como indicación.
4. `scripts/orquesta/orquesta.mjs` lo toma:
   - marca, comunidad e investigación corren en la nube (GitHub Actions);
   - plataforma y video corren en la PC (tarea programada).

   Crea un worktree limpio (en la PC, `E:/onia-orquesta/<carril>-<n>`; en Actions, bajo `runner.temp`) y corre al
   trabajador del carril con el modelo de `carriles.json`: Codex en plataforma, Claude en el resto.
5. Revisa otro modelo, con contexto limpio. Si pasa, deja un PR y un comentario con el recibo. Si falla, reintenta
   una vez; a la segunda falla seguida le pone el label `bloqueada`, con el motivo.
6. Con `ok: sergio`, el issue queda en `espera-ok`, con capturas, hasta que él conteste.
7. El Hermes de la PC lee el issue y el PR y compara el recibo con el «hecho cuando». Escribe el handoff en
   `E:/onia-wt/hermes-base`, y lo commitea la sesión principal de Claude. Antes de actualizar `hermes-base` a
   `origin/main`, ese handoff tiene que estar commiteado. El del VPS cuenta el avance en el resumen de las 06:30 y
   en el cierre de las 21:30.
8. Mergea Sergio Urcullo o la sesión principal de Claude Code, siempre por PR revisado. La publicación sigue
   `AGENTS.md` §3 y §6.

Fuera de la cola quedan solo dos cosas:
- El trabajo directo de Sergio Urcullo con Claude Code (la 1.0 y la integración). Desde ahí, Claude puede lanzar
  un Codex cerrado con `scripts/codex-tarea.sh`.
- Los subagentes de Hermes, que solo leen y verifican.

Nada más es una vía de despacho: ni Orca Orchestration, ni `.hermes/plans`, ni `.hermes/tasks`, ni los goals.

## 6. Quién dispara qué

| Disparo | Qué corre |
|---|---|
| Sergio Urcullo en la TUI de Hermes | Planificar, cargar issues y verificar entregas |
| Sergio Urcullo por Telegram | Hermes del VPS: resumen, cierre, calendario, dictar una tarea |
| Etiquetar o comentar un issue, y cada 3 h de 8 a 23 (La Paz) | La orquesta en Actions |
| Tarea programada «ONIA Orquesta», cada 3 h de 8 a 23 con la PC prendida. El 26-oct estaba en estado Listo, pero corre desde el checkout principal sucio (§7, paso 0) | La orquesta en la PC |
| Sergio Urcullo en Claude Code | Trabajo directo e integración por PR |
| Workflow `hermes-jarvis` (`diagnostico`, `aplicar`, `revertir`) | Cambios en el VPS |

## 7. Lo que falta para que esto sea cierto

Los pasos y la forma de volver atrás están en `handoff/hermes-local.md`.

0. **Antes del merge: limpiar el checkout principal.**
   - ✅ El 26-oct sus 116 cambios se copiaron a la rama `rescate/checkout-principal-20261026` (pusheada) y se
     verificaron archivo por archivo.
   - Falta que él corra `E:\onia-wt\limpiar-checkout-principal.ps1`: la revisión de seguridad no dejó borrar desde
     la sesión.
   - También hay que reinstalar la tarea programada con el comando de `scripts/orquesta/README.md` §«Correr».

   Si no, la tarea corre desde ese checkout, su `git pull` falla y, con el `&` actual, sigue sobre el código viejo
   sin dejar el error en el log.
1. Mergear el PR. Lleva:
   - `AGENTS.md`;
   - este mapa;
   - el SOUL, la config y el instalador de Hermes de la PC;
   - el cargador de issues;
   - el `AGENTS.global.md` de Codex.
2. a 4. **Un solo comando, con Hermes cerrado y desde una copia del repo con el PR mergeado:**
   `powershell -ExecutionPolicy Bypass -File hermes-content\deploy\hermes-pc\aplicar.ps1 -EscrituraSegura -Codex`.
   El script hace, en orden:
   - el respaldo en `%LOCALAPPDATA%\hermes\backups\pre-orden-<fecha>`;
   - el worktree `E:/onia-wt/hermes-base`, en `origin/main`;
   - la comprobación de que el `AGENTS.md` sea el nuevo;
   - la mezcla de `config.onia.yaml` con el escritor de Hermes, sin borrar claves;
   - la copia del SOUL;
   - el archivo de `skills/onia` en el respaldo;
   - la carpeta `pedidos`;
   - `probar-deny.py --vivo`;
   - con `-EscrituraSegura`, la variable `HERMES_WRITE_SAFE_ROOT`;
   - con `-Codex`, el `AGENTS.md` global de Codex.

   Se deshace con `revertir.ps1`. Sobre una copia, el 26-oct, dio 18 claves cambiadas y 0 fallas, y la vuelta atrás
   quedó idéntica byte a byte. Cambia el modelo por defecto de `gpt-6-astra-900k` a `gpt-6.1-sol` y la zona horaria
   de Caracas a La Paz.

   Prueba de hecho:
   - `/context` muestra `AGENTS.md`;
   - `git -C . push` sale bloqueado sin preguntar;
   - `--dry` del cargador muestra `necesita-ok`;
   - `probar-deny.py --vivo`, corrido con el python de Hermes (el comando está en la cabecera del script), da
     «mismo approvals.deny» y 0 fallas. Hoy falla a propósito, porque el `config.yaml` vivo no tiene deny. En modo
     repo, sin `--vivo`, hoy da 0 fallas: 173 comandos que tienen que bloquearse y 41 lecturas que tienen que pasar.
     Se vuelve a correr en cada actualización de Hermes.
5. En el VPS: pausar la revisión de cada 3 h y reemplazar el SOUL viejo. **Hoy `aplicar` no puede hacerlo**: su
   control previo falla si el SOUL no trae `## Planificar la orquesta` (`aplicar.sh:309-314`), y además crea ese
   trabajo y no tiene un paso para pausarlo. Hace falta cambiar `aplicar.sh` y su prueba
   (`hermes-jarvis-aplicar.test.mjs`) en un PR propio, junto con `hermes-content/skills/planificar-orquesta.md`, que
   todavía dice «vos planificás». Después lo despacha él.
6. Orca: no lanzar Hermes desde ahí y no activar Orchestration. Cerrar la corrida `run_66e1d03c2397`.
7. Pasar a issues lo vigente de `.hermes/plans` y `.hermes/tasks`, y archivar el resto.
8. ✅ Reglas globales de Claude (26-oct):
   - Se mantienen las seis que tocó Hermes, porque son mejores que las de antes: sacan los modelos viejos y el 80 %
     genérico y suman el contrato de Codex sin Git.
   - Se archivaron en `~/.claude/rules-archivo/20261026` tres perfiles token-eficiente y el README.
   - Las reglas web ahora se cargan solo con archivos de interfaz.
9. Limpiar worktrees y disco:
   - ✅ El 26-oct se rescató a ramas `rescate/*` el trabajo de 13 worktrees, verificado y pusheado.
   - ✅ Las 11 ramas que solo existían en la PC están en `E:/respaldo-ramas-solo-locales-20261026.bundle`.
   - ✅ Se borraron 178 ramas locales ya mergeadas; nombres y commits en `E:/respaldo-ramas-mergeadas-20261026.txt`.
   - Falta que él corra `E:\onia-wt\limpiar-worktrees.ps1`. Saca los worktrees viejos y mueve a
     `E:\archivo-worktrees-20261026` las 41 carpetas huérfanas (unos 22 GB) y el clon suelto de Orca.

## 8. Qué se queda, qué sale y qué falta

Pedido de Sergio Urcullo del 26-oct. Lo que figura en «Sale» va a `historial/` o se apaga: no se borra nada que no
se pueda recuperar. La evidencia está en las secciones 3, 4 y 6 de la auditoría.

### Se queda

| Qué | Por qué |
|---|---|
| `AGENTS.md` nuevo y `CLAUDE.md` con sus casos | Reglas compartidas y su historia, cada cosa en su lugar |
| `ONIA_ESTRATEGIA_DE_EMPRESA`, `ONIA_CATALOGO_DE_VENTA`, `ONIA_CLIENTE_IDEAL`, `ONIA_ADQUISICION_Y_PAUTA`, `AI_MODEL_ROUTING_2026` | Son las fuentes únicas del negocio y de los modelos |
| Los handoffs de siete campos | Son lo que deja retomar el trabajo |
| Issues `orquesta`, `scripts/orquesta/`, `carriles.json` y el revisor distinto del autor | Es la cola única y el reparte sin un LLM que coordine |
| El Hermes del VPS para Telegram, y el workflow `hermes-jarvis` | Los avisos funcionan, también con la PC apagada |
| Skills que sirven: `onia-router`, `onia-core`, `onia-propuestas`, `onia-contabilidad-bolivia`, `onia-infra`, `panel-onia`, `aprender-de-todo`, `orca`, y del VPS `planificar-orquesta` y `agenda-calendario` | Son concretas y están al día. `planificar-orquesta` necesita el cambio del paso 5 de §7 |
| `equipo-de-agentes` | Reescrita en este PR sin la madre; lo de esa época pasó a `historial/` |
| `scripts/orquesta/cargar-issue.mjs` | Nuevo en este PR: las barandas del VPS portadas a la PC |
| Claude Code como sesión principal, Codex con contratos cerrados y Orca como tablero | Cada uno tiene un solo papel |
| El cambio que Hermes le hizo a Codex el 25-oct (`on-request`, `workspace-write`) | Es más seguro que lo que había |

### Sale

| Qué | Adónde |
|---|---|
| El `AGENTS.md` de `main`, la reescritura de Hermes en el checkout principal y el encabezado de marca personal | Los reemplaza el nuevo. El PR #226 se cierra y su tabla de 184 reglas queda como insumo |
| Las colas paralelas: Orca Orchestration (`run_66e1d03c2397`), `.hermes/plans`, `.hermes/tasks` y los goals usados como cola | Lo vigente pasa a issues; lo demás, a archivo |
| La revisión de cada 3 h del Hermes del VPS | Se pausa con `aplicar`, sin borrarla |
| Lanzar Hermes con `--yolo`, desde Orca o desde el checkout principal | Desde ahora: TUI a mano en `E:/onia-wt/hermes-base` |
| `skills/onia/` de Hermes (`onia-operar-harness`, `onia-relevo-sesion`) | Lo útil va a las skills del repo; el resto, a `backups/` |
| `onia-sesion-madre` y 25 de los 40 `.md` de `hermes-content/skills/` (sin tocar desde junio o julio) | ✅ **Hecho el 26-oct:** `onia-sesion-madre` y 23 `.md` en `historial/skills/`. Quedan 6 porque algo los lee: `guiones-diarios-onia` y `marca-personal-sergio` (`carriles.json`), `radar-creativo-onia` (workflow n8n), `audio-elevenlabs` (script del VPS) y las dos fiscales que cita `onia-contabilidad-bolivia`. Entraron 4 que solo tenían el revert del 2-oct |
| `ONIA_EQUIPO_DE_AGENTES.md`, los dos `ORCHESTRATOR.md`, `PROJECTS_ORCHESTRATION.md`, `HERMES_OS_CONTROL_CENTER_2026.md`, `HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md` y `CODEX_SKILL_ROUTING.md` (en la raíz) | `historial/` con `git mv`. El harness del 10-oct ya está ahí. ✅ **Hecho el 26-oct:** `ONIA_EQUIPO_DE_AGENTES`, `HERMES_OS_CONTROL_CENTER_2026` y `HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026`. **Pendientes**, porque los nombra código: los dos `ORCHESTRATOR.md` (`scripts/n8n-fix-assignments.js`, `docs-hygiene.test.mjs` y respaldos de n8n), `PROJECTS_ORCHESTRATION.md` (seed SQL y `operating-source.ts` de ONIA Center) y `CODEX_SKILL_ROUTING.md` (lista de la raíz de `docs-hygiene.mjs`) |
| El resto de los docs viejos de `hermes-content/docs/` (época madre, loops, ONIA Center, vendedores, precios y pauta de agosto, Lucía de agosto) | ✅ **Hecho el 26-oct:** 130 a `historial/` con `git mv`. 43 quedan en su lugar hasta sacar su nombre de un script, test, seed, `.ts` o `hermes-content/deploy/` |
| `~/.codex/AGENTS.md`, con el texto de agencia de las nueve líneas de negocio | Lo reemplaza `AGENTS.global.md` |
| De `~/.claude/rules`: 3 de los 4 perfiles token-eficiente y el README cargado como si fuera regla | ✅ **Hecho el 26-oct:** `~/.claude/rules-archivo/20261026` |
| Las 15 skills personales de `~/.claude/skills` que pisan a las del repo con otro contenido | ✅ **Hecho el 26-oct:** `~/.claude/skills-archivadas-20261026`. Eran de septiembre y las del repo, del 2 y el 10-oct |
| El SOUL del VPS que habla de loops y del tablero archivado | Lo reemplaza uno nuevo |
| Las 41 carpetas huérfanas de worktrees (13,3 GiB) y las 196 ramas locales ya mergeadas | Las carpetas se mueven a `E:/archivo-worktrees-20261026/`. Las ramas se borran con `git branch -d`, que se niega si alguna no está mergeada |

### Falta

| Qué | Para qué |
|---|---|
| El worktree base `E:/onia-wt/hermes-base` | Que Hermes lea un repo limpio y no el `main` sucio |
| El cambio de `aplicar.sh` y el SOUL nuevo del VPS (§7, paso 5) | Que el del VPS deje de planificar solo y lo sepa |
| `HERMES_WRITE_SAFE_ROOT` puesta en Windows | `approvals.deny` frena comandos pero no `write_file`, y así fue el incidente del 25-oct |
| Descripciones de skills que digan cuándo usarlas en los primeros 57 caracteres | El índice de Hermes corta a los 60 |
| Una prueba que falle si `.agents/skills` se aparta de `.claude/skills` (ignorando CR), o borrar las copias. Ojo: `media-use` la usa `editor-videos` | Que Codex no lea otra versión |
| Una barrera dura sobre `main` | GitHub la cobra en repos privados: el 26-oct la API respondió «Upgrade to GitHub Pro». Mientras tanto, la barrera es local: el `deny` de Hermes y Codex sin Git. El `deny` no resuelve alias ni variables (`$g='git'; & $g push` pasa), así que no es un sandbox |
| **Una cuenta de GitHub aparte para Hermes, con un token que solo lea el código y escriba issues** | Es la única barrera dura. El `deny` frena errores del modelo, no a un modelo inyectado: un script propio (`node x.js`, `bash x.sh`) corre sin preguntar y adentro puede hacer `git push` con las credenciales de Sergio Urcullo. Además, la orquesta le cree todo lo que firma su cuenta |
| Que el cargador rechace las definiciones de referencia de Markdown (`[x]: …` al principio de una línea) | GitHub las esconde igual que el HTML: el trabajador las lee y Sergio Urcullo no las ve |
| Medir si los hijos de Hermes reciben `AGENTS.md` y heredan `approvals.deny` | 21 de 30 prompts de sistema medidos no traían `AGENTS.md` |
| Qué shell usa la terminal de Hermes en la PC | Decide si `cmd /c git push` se le escapa al `deny` |
| Que la prueba de higiene de docs falle con un doc fechado en la raíz sin aviso | Que no vuelva a acumularse historia leída como si fuera vigente |

## 9. Las 4 áreas

Sergio Urcullo, 26-oct: Onia se ordena en 4 áreas. Los carriles de la orquesta no se renombran (tienen labels y
tests): cada uno cae en un área. Skills en orden, agentes y «no usar» de cada área: `onia-router` §«Las 4 áreas de
Onia». Lo viejo de cada área está en `historial/`.

| Área | Carriles | Skill de entrada | Handoff | Docs fuente |
|---|---|---|---|---|
| Marca personal | `marca`, `video` | `diseno-contenido-onia` (piezas) · `hyperframes` (video) | `handoff/marca-personal.md` | `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` · `ONIA_MOTOR_SEMANAL_CONTENIDO.md` · `HIGGSFIELD_VIDEO_SYSTEM.md` |
| Workshops y comunidad | `comunidad` | cuartito `community-marketing` (no hay skill propia todavía) | `handoff/comunidad.md` | `TALLER_31_OCT.md` · `comunidad/ESTADO_COMUNIDAD.md` · `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` |
| Onia Platform | `plataforma` | las `onia-*` de `onia-platform` · `onia-ventas-pauta` (venta y pauta) | `handoff/codex-continuar-1.0.md` · `handoff/mercado-y-pauta.md` | `ONIA_CATALOGO_DE_VENTA.md` · `ONIA_CLIENTE_IDEAL.md` · `ONIA_ADQUISICION_Y_PAUTA.md` · precios en `subscription-plans.ts` y `pricing.ts` |
| Otros (infra, Hermes, orquesta, investigación, fiscal propio, Lucía, clientes web, Bolivian Electric) | `investigacion` | `onia-infra` · `onia-hermes-jarvis` · `aprender-de-todo` | `handoff/hermes-local.md` · `handoff/orquesta.md` · `handoff/hermes-jarvis.md` | Este documento · `ONIA_ESTRATEGIA_DE_EMPRESA.md` · `AI_MODEL_ROUTING_2026.md` |
