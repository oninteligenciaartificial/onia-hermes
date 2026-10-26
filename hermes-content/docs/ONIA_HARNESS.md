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
| Codex | `~/.codex/AGENTS.md` y el `AGENTS.md` del repo; `~/.codex/config.toml`; skills de `~/.codex/skills` y `.agents/skills` | `CLAUDE.md`. Las skills de `.claude/skills` las recibe por ruta en el contrato |
| Hermes de la PC | `SOUL.md` de su home; **un solo** archivo del cwd (`AGENTS.md`); su memoria; skills de su home y de `skills.external_dirs` | `CLAUDE.md`, porque `AGENTS.md` lo tapa; `~/.claude/**`, que lo rechaza a propósito |
| Hermes del VPS | `/root/.hermes/SOUL.md`, `config.yaml` y `skills/<nombre>/SKILL.md` | Lo que `aplicar` no copió (un `.md` suelto en `skills/` no se carga) |
| Trabajador de la orquesta | Lo de su motor (Claude o Codex), en un worktree limpio, con `scripts/orquesta/trabajador.settings.json` | — |

## 3. Fuente en el repo y dónde se usa

| Qué | Fuente en el repo | Dónde se usa | Cómo llega | Estado al 26-oct |
|---|---|---|---|---|
| Reglas compartidas | `AGENTS.md` | Los tres agentes | Se lee del cwd | Nuevo, en PR |
| Reglas de Claude y sus casos | `CLAUDE.md` | Claude | Se lee del cwd | Vivo |
| Skills de ONIA | `.claude/skills/<nombre>/SKILL.md` | Los tres agentes | Claude: nativo. Hermes de la PC: `external_dirs` → `E:/onia-wt/hermes-base/.claude/skills`. Codex: por ruta en el contrato | Hermes ve 0 de 66 |
| Subagentes de Claude | `.claude/agents/` | Claude | Nativo | Vivo |
| Hermes de la PC: quién es | `hermes-content/deploy/hermes-pc/SOUL.md` | `%LOCALAPPDATA%\hermes\SOUL.md` | `Copy-Item`, con Hermes cerrado | Hoy usa el de fábrica |
| Hermes de la PC: config | `hermes-content/deploy/hermes-pc/config.onia.yaml` | `%LOCALAPPDATA%\hermes\config.yaml` | Esas claves, con Hermes cerrado | Hoy corre con `--yolo` y sin `deny` |
| Hermes del VPS | `hermes-content/deploy/hermes-agent/SOUL.md` y `hermes-content/skills/` | `/root/.hermes` | Workflow `hermes-jarvis` → `aplicar` | El SOUL es viejo: habla de loops y del tablero archivado |
| Codex global | `hermes-content/deploy/codex/AGENTS.global.md` | `~/.codex/AGENTS.md` | `Copy-Item` | Hoy tiene el texto de agencia de las nueve líneas de negocio |
| Reparto | `scripts/orquesta/` y `carriles.json` | GitHub Actions y la PC | Git | Vivo |
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
2. Hermes arma el contrato (`AGENTS.md` §4) y abre el issue con los labels `orquesta`, `carril:<área>`,
   `origen:hermes` y `necesita-ok`.
3. Sergio Urcullo lo suelta sacándole `necesita-ok`, incluso desde el celular.
4. `scripts/orquesta/orquesta.mjs` lo toma:
   - marca, comunidad e investigación corren en la nube (GitHub Actions);
   - plataforma y video corren en la PC (tarea programada).

   Para cada uno crea un worktree en `E:/onia-orquesta/<carril>-<n>` y corre al trabajador del carril con el modelo
   de `carriles.json`: Codex en plataforma, Claude en el resto.
5. Revisa otro modelo, con contexto limpio. Si pasa, deja un PR y un comentario con el recibo. Si no, le pone el
   label `bloqueada` con el motivo.
6. Con `ok: sergio`, el issue queda en `espera-ok`, con capturas, hasta que él conteste.
7. El Hermes de la PC lee el issue y el PR, compara el recibo con el «hecho cuando» y propone el handoff. El del VPS
   lo cuenta en el resumen de las 06:30 y en el cierre de las 21:30.
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
| Tarea programada «ONIA Orquesta», cada 3 h de 8 a 23 con la PC prendida (medida el 26-oct: estado Listo) | La orquesta en la PC |
| Sergio Urcullo en Claude Code | Trabajo directo e integración por PR |
| Workflow `hermes-jarvis` (`diagnostico`, `aplicar`, `revertir`) | Cambios en el VPS |

## 7. Lo que falta para que esto sea cierto

Los pasos y la forma de volver atrás están en `handoff/hermes-local.md`.

1. Mergear el PR con `AGENTS.md`, este mapa, el SOUL y la config de Hermes de la PC, y el `AGENTS.global.md` de
   Codex.
2. Crear el worktree base `E:/onia-wt/hermes-base`. Hermes se lanza desde ahí, nunca desde el checkout principal.
3. Con Hermes cerrado y el respaldo hecho, aplicar `config.onia.yaml` y copiar el SOUL. Después, `/context` tiene que
   mostrar `AGENTS.md` y un `git push` tiene que pedir aprobación.
4. Copiar `AGENTS.global.md` a `~/.codex/AGENTS.md`.
5. En el VPS: pausar la revisión de cada 3 h y reemplazar el SOUL viejo. Va con `aplicar` y lo despacha él.
6. Orca: no lanzar Hermes desde ahí y no activar Orchestration. Cerrar la corrida `run_66e1d03c2397`.
7. Pasar a issues lo vigente de `.hermes/plans` y `.hermes/tasks`, y archivar el resto.
8. Decidir si se mantienen o se revierten las seis reglas globales de Claude que tocó Hermes.

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
| Skills que sirven: `onia-router`, `onia-core`, `onia-propuestas`, `onia-contabilidad-bolivia`, `onia-infra`, `panel-onia`, `aprender-de-todo`, `planificar-orquesta`, `agenda-calendario`, `orca` | Son concretas y están al día |
| `equipo-de-agentes` | Corrigiéndola: menciona 26 veces a la madre |
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
| `onia-sesion-madre` y 25 de los 40 `.md` de `hermes-content/skills/` (sin tocar desde junio o julio) | `historial/` |
| `ONIA_EQUIPO_DE_AGENTES.md`, los dos `ORCHESTRATOR.md`, `PROJECTS_ORCHESTRATION.md`, `HERMES_OS_CONTROL_CENTER_2026.md`, `HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md` y `CODEX_SKILL_ROUTING.md` (en la raíz) | `historial/` con `git mv`. El harness del 10-oct ya está ahí |
| `~/.codex/AGENTS.md`, con el texto de agencia de las nueve líneas de negocio | Lo reemplaza `AGENTS.global.md` |
| De `~/.claude/rules`: 3 de los 4 perfiles token-eficiente y el README cargado como si fuera regla | `~/.claude/rules-archivo/` |
| Las 15 skills personales de `~/.claude/skills` que pisan a las del repo con otro contenido | Archivadas, después de elegir la versión buena |
| El SOUL del VPS que habla de loops y del tablero archivado | Lo reemplaza uno nuevo |
| Las 41 carpetas huérfanas de worktrees (13,3 GiB) y las 196 ramas locales ya mergeadas | Las carpetas se mueven a `E:/archivo-worktrees-20261026/`. Las ramas se borran con `git branch -d`, que se niega si alguna no está mergeada |

### Falta

| Qué | Para qué |
|---|---|
| El worktree base `E:/onia-wt/hermes-base` | Que Hermes lea un repo limpio y no el `main` sucio |
| `planificar-orquesta` en versión PC, con `gh` en lugar de curl | El cómo exacto de cargar y verificar un issue. Con el SOUL y `AGENTS.md` alcanza; no hace falta otra skill de coordinación |
| El SOUL nuevo del VPS | Que el del VPS sepa que solo avisa |
| Descripciones de skills que digan cuándo usarlas en los primeros 57 caracteres | El índice de Hermes corta a los 60 |
| Una prueba que falle si `.agents/skills` se aparta de `.claude/skills` (ignorando CR), o borrar las copias. Ojo: `media-use` la usa `editor-videos` | Que Codex no lea otra versión |
| Una barrera dura sobre `main` | GitHub la cobra en repos privados: el 26-oct la API respondió «Upgrade to GitHub Pro». Mientras tanto, la barrera es local: el `deny` de Hermes y Codex sin Git |
| Una cuenta de GitHub aparte para Hermes | Hoy carga issues con el token de Sergio Urcullo y la orquesta le cree todo |
| Medir si los hijos de Hermes reciben `AGENTS.md` | 21 de 30 prompts de sistema medidos no lo traían |
| Que la prueba de higiene de docs falle con un doc fechado en la raíz sin aviso | Que no vuelva a acumularse historia leída como si fuera vigente |
