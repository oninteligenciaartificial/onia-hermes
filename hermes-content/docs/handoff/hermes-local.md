# Handoff — hermes-local (Hermes Agent en la PC, dentro de Orca)

**Objetivo**
Dejar a Hermes local configurado una sola vez como coordinador que lee las reglas y skills de ONIA, no se salta permisos y aprende por PR. Hecho = Hermes arranca desde un worktree limpio, `/context` muestra el AGENTS.md acordado, el índice de skills nombra las de `.claude/skills`, un `git -C . push` sale bloqueado y `--dry` de
`scripts/orquesta/cargar-issue.mjs` muestra `necesita-ok`.
Estado al 26-oct, 21:30: **PR #269 mergeado (`4fd5f64f`) y `aplicar.ps1 -EscrituraSegura -Codex` corrido a las
19:56.** Respaldo para volver atrás: `%LOCALAPPDATA%\hermes\backups\pre-orden-20261026-195633` (`revertir.ps1 -Respaldo …`).
Medido después, sin abrir la TUI (⚠️ sobre la copia de la app de Claude, no vale: ver «26-oct, 23:06» abajo):
- `probar-deny.py --vivo`: «mismo approvals.deny», 173 bloqueos, 41 lecturas, 0 fallas.
- `hermes skills list` en `E:\onia-wt\hermes-base`: 65 skills `external` del repo, sin `onia-sesion-madre`.
- `build_context_files_prompt(cwd=hermes-base)`, con el python de Hermes: carga el `AGENTS.md` del 26-oct y no
  `CLAUDE.md`; `load_soul_md()` trae el SOUL nuevo.
- `cargar-issue.mjs --dry` desde `hermes-base`: pone `orquesta`, `carril:investigacion`, `origen:hermes` y
  `necesita-ok`, y no crea nada.

Falta la prueba con la TUI abierta (`/context`) y la primera tarea real.

**26-oct, 23:06: el #274 quedó aplicado de verdad.** Sergio Urcullo corrió `aplicar.ps1 -EscrituraSegura -Codex`
desde su PowerShell, con 24 claves cambiadas y `probar-deny` en 183/45/0. Después se midió desde el panel Terminal:
`config.yaml` de 134.857 bytes, `default: gpt-6.1-sol`, `adopt_external_logins: false`, `HERMES_WRITE_SAFE_ROOT` en
handoff, pedidos y cache\scratch, y otra vez 183/45/0. Respaldo: `backups\pre-orden-20261026-230615`.

⚠️ **La corrida de las 19:56 nunca llegó a Hermes.** La hizo una herramienta de Claude, y la app (paquete MSIX)
desvía a `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\hermes` lo que sus herramientas escriben en
`%LOCALAPPDATA%`. Esa era la causa de que la TUI arrancara con Astra «aunque config.yaml diga Sol». Por lo mismo,
las mediciones de la sección de arriba («Medido después, sin abrir la TUI») leían esa copia, no la config real.
La copia se apartó a `hermes-copia-vieja-20261026`. Desde ahora `aplicar.ps1` y `revertir.ps1` frenan si los corre
Claude. Método completo: skill `onia-hermes-jarvis`, «Trampas ya pagadas». La auditoría completa sigue en
`hermes-content/docs/research/2026-10-26-auditoria-hermes-local.md`.

Lo que decidió Sergio Urcullo el 26-oct:
1. **Manda un AGENTS.md nuevo y compacto.** Se armó desde la reescritura de Hermes, sacándole lo que se había
   autorizado a sí mismo («piloto de Orca»), y se le sumaron: quién hace qué, qué fuente manda, cuándo parar y los
   casos de CLAUDE.md.
2. **Planifica el Hermes de la PC; el del VPS avisa.** El del VPS carga una tarea solo cuando él se la dicta. El de la
   PC carga siempre con `origen:hermes` y `necesita-ok`; el del VPS, también, salvo `nube` con `check: urls`, hasta
   el PR del paso 5 de §7 de `ONIA_HARNESS.md`. Hay una sola cola: Orca Orchestration, `.hermes/plans` y los goals
   dejan de serlo.

En el PR quedaron:
- `AGENTS.md` y `CLAUDE.md` §«Quién orquesta».
- `hermes-content/deploy/hermes-pc/{SOUL.md,config.onia.yaml}`.
- `hermes-content/deploy/codex/AGENTS.global.md`.
- `hermes-content/docs/ONIA_HARNESS.md`, reescrito: el mapa de archivos, el flujo de un encargo y qué se queda,
  sale y falta.
- La fila «Cerebro» de `scripts/orquesta/README.md`.
- `scripts/orquesta/cargar-issue.mjs` con su prueba: las barandas del VPS portadas a la PC.
- La skill `equipo-de-agentes` reescrita sin la madre.

Una revisión independiente encontró que el primer `approvals.deny` se esquivaba con `git -C x push` y con `git.exe`,
y que con un `gh issue create` suelto un `check: cmd` corría sin sandbox en la PC. El `deny` se rehízo con patrones
probados contra la lógica real de Hermes, y la carga pasó al cargador.

Lo que sigue abierto: el `deny` no resuelve alias ni variables, no frena `write_file` (por eso
`HERMES_WRITE_SAFE_ROOT`) y no se sabe si lo heredan los hijos.

**Qué quedó EN PRODUCCIÓN**
Nada en producción. Cambios en la PC, fuera del repo, hechos el 26-oct:
- Reglas globales: se mantienen las 6 que tocó Hermes; tres perfiles token-eficiente y el README pasaron a
  `~/.claude/rules-archivo/20261026`; las reglas web cargan solo con archivos de interfaz.
- Se archivaron 15 skills personales viejas en `~/.claude/skills-archivadas-20261026`.
- Se borraron 178 ramas locales ya mergeadas. Los nombres y los SHA están en
  `E:/respaldo-ramas-mergeadas-20261026.txt`, por si hay que recrearlas.

**Qué quedó a medias, y dónde**
- **Checkout principal (paso 0): limpio.** Sergio Urcullo corrió `E:\onia-wt\limpiar-checkout-principal.ps1` el
  26-oct. Antes se re-verificó que sus 30 cambios trackeados y los 96 archivos a borrar seguían iguales en
  `rescate/checkout-principal-20261026`. Quedan sin trackear, a propósito, `.hermes/plans`, `.hermes/tasks`,
  `references/formacion` y `harness-hermes-20261024/panel-ejecucion`: el `.gitignore` de `main` ya los ignora.
- **Tarea programada:** sigue la vieja (`… & set ORQUESTA_TELEGRAM=1 && …`, medido 19:45). La reinstala él con el
  comando de `scripts/orquesta/README.md` §«Correr».
- **Worktrees.** `E:\onia-wt\limpiar-worktrees.ps1` corría a las 20:00 (C: pasó de 33 a 85 GB libres).
  - Sus «Falló mover … (código 9)» no perdieron nada: las seis carpetas quedaron enteras en
    `E:\archivo-worktrees-20261026` y eran casi todo `node_modules` (de 25 a 3.026 archivos fuera de él). Ver
    «Intentos fallidos».
  - `web-v1-revision` y `confident-dirac-a1b422` quedaron sin registrar, con unos 540 MB cada una de
    `web-factory/node_modules` más copias de archivos de Git. Se borran con `cmd /c rd /s /q "\\?\<ruta>"`.
  - `onia-hermes-contenido` no se rescató: tiene clips de Lucía de más de 5 MB. No lo toca ningún script.
- El VPS sigue sin el cambio del paso 5 de §7 (PR propio de `aplicar.sh`).

**Archivos y cambios**
- Home de Hermes: `C:/Users/PC/AppData/Local/hermes` (config.yaml, SOUL.md de fábrica, memories/USER.md, skills/onia con 2 skills creadas por él). `C:/Users/PC/.hermes` lo escribe Orca y Hermes no lo lee.
- Orca lanza `hermes --tui --yolo` con `Set-Location C:/dev/proyectos/onia-hermes`. Hay dos TUI vivas sobre la misma home.
- El portal es `hermes dashboard --no-open` → `http://127.0.0.1:9119` (entrada `hermes-dashboard` en `.claude/launch.json`).

**Intentos fallidos**
- Hermes con Claude como proveedor (`claude-opus-5-5`, `claude-sonnet-4-6`, 21 y 22-oct): falló el refresh de OAuth, y además la vía Max solo gasta créditos de *extra usage*. No reintentar (onia-router: «el token de Max en Hermes» va en No usar).
- Delegar a hijos `gpt-6-luna` con `max_iterations: 40`: cortó los guiones, que fueron rechazados.
- Hipótesis falsa: que `skills.external_dirs` es de solo lectura. Es escribible (`skills.md:424-425`), y por eso hace falta `skills.write_approval: true` (el orden de las claves en el YAML no importa).
- Hipótesis falsa: que hay 16 skills divergentes entre `.agents/skills` y `.claude/skills`. La diferencia real es 1 SKILL.md y 1 referencia; el resto es CRLF.
- **`robocopy /E /MOVE` sin `/XJ` sigue las junctions de pnpm, también las que salen de la carpeta** (26-oct). Los
  `node_modules` de los worktrees huérfanos tenían junctions con ruta absoluta a los paquetes del checkout principal.
  `limpiar-worktrees.ps1` movió así 490 archivos versionados de `web-factory/apps/onia-platform`,
  `apps/dentalgest-landing` y `packages/templates` del checkout principal a
  `E:\archivo-worktrees-20261026\cta-home\web-factory\node_modules\…`. Se restauraron con `git restore`; lo no
  versionado que se fue a E: es solo build (`.next`, `tsbuildinfo`, `next-env.d.ts`, un `node_modules` chico). El
  «código 9» (8 = algo falló + 1 = copió) sale por eso. **Para mover carpetas con `node_modules`: `/XJ` siempre**, y
  después de mover, `git status` en todo checkout que pudiera ser destino de una junction.
- **El hook Stop de la sesión commiteó en el checkout principal** (26-oct, 19:46). Recién limpio, ya no tenía los
  archivos `C:Users…` que hacían fallar `git add -A`, así que el autosync commiteó lo que seguía sin trackear
  (`.hermes/plans`, `.hermes/tasks`, los originales del curso de `references/formacion` y `panel-ejecucion`), dejó el
  checkout parado en `claude/autosync-e24cb7a5-…` y la pusheó (`b185a4e4`, 56 archivos, sin secretos según el
  barrido). Se volvió a `main` con `symbolic-ref` + `reset --mixed` (sin tocar archivos) y `pull`; con el
  `.gitignore` de `main` esos archivos ya quedan ignorados. La rama se borró de GitHub y de la PC el 26-oct, con el
  OK de Sergio Urcullo. Falta que `git-autosync.js` no actúe nunca en el checkout que usa la tarea programada (PR
  propio, junto con sacar la excepción del integrador).
- Comparar el árbol de un worktree contra su rama de rescate con un índice temporal (`read-tree` + `add -A` +
  `write-tree`) da «cambió» en falso si el HEAD avanzó por un pull o si el worktree es sparse. Lo que vale es
  comparar por archivo lo que el script descarta: `git status` y `hash-object` contra la rama de rescate.

**Qué depende de Sergio**
1. ~~Qué AGENTS.md manda~~ y ~~el rol de cada Hermes~~: decididos el 26-oct (arriba).
2. ~~Correr los dos scripts de limpieza, mergear #269 y correr `aplicar.ps1`~~: hecho el 26-oct. Falta reinstalar
   la tarea programada y, en Orca, poner Settings → Agents → Agent permissions en **Manual** (sin eso abre a Hermes
   con `--yolo`).
3. ~~Cerrar el PR #226~~: hecho el 26-oct con su OK, junto con otros 12 PR de la época madre (#143, #195, #199,
   #201, #202, #204, #206, #221, #227, #228, #229, #232) y el issue #268. Se borraron 32 ramas remotas que ya estaban
   en `main`; las `rescate/*` quedan. El #265 (los trabajadores leen el handoff y dejan «## Aprendido») **no** se
   cerró: sirve y está por revisar.
4. Identidad propia de Hermes: el 26-oct eligió cuenta bot de GitHub y usuario de Windows propio, y ese mismo día,
   más tarde, dijo que por ahora no hace falta un usuario por agente (plan de supervivencia en
   `ONIA_ESTRATEGIA_DE_EMPRESA.md`). Además la cuenta bot no sirve como se pensó: en un repo privado de una cuenta
   personal todo colaborador puede escribir. El reemplazo, para cuando se retome: token fine-grained de su cuenta que
   solo lee y crea issues para Hermes, y una GitHub App para la orquesta (`research/2026-10-26-grok-y-aislamiento.md`).
5. Despachar `aplicar` en el VPS para pausar la revisión de cada 3 h y poner el SOUL nuevo (el control de permisos
   frena ese despacho desde una sesión).
6. Orca: Hermes corre ahí solo con Agent permissions en Manual y abierto en `hermes-base`; Orchestration queda
   apagado. Falta Workspace Directory en E:, la telemetría apagada y la regla de firewall del puerto 6768 solo en el
   perfil Privado.
7. ~~Reglas globales y `~/.codex/config.toml`~~: se mantienen (26-oct). Lo de Hermes era mejor que lo anterior.
8. Sacar del autosync la excepción del integrador apagado (`scripts/git-autosync.js:43`) y que no actúe en el
   checkout que usa la tarea programada, en un PR propio con su prueba.
9. La protección de la rama `main` en GitHub. Medido el 26-oct: en un repo privado del plan gratis la API responde
   «Upgrade to GitHub Pro». Es un gasto (4 USD por mes según el FAQ de planes de GitHub, que es de 2020: confirmar el
   monto en Settings → Billing), así que lo decide él; mientras tanto, la barrera es local.
10. Túnel SSH solo con 3108: hecho el 26-oct (PR #271), medido después del reinicio.

**Próximos pasos** (relevo del 26-oct, ~22:30; la sesión principal `e24cb7a5` llegó al límite de contexto)

Ya en `main` el 26-oct: #269 (harness), #270 (estado y los dos informes en `research/2026-10-26-*`), #271 (túnel
solo 3108), #272 (plan de supervivencia), #273 (el revisor de la orquesta nunca es de la familia del trabajador, con
respaldo si falta cupo) y #274 (Hermes endurecido: sin logins prestados, sin cron ni kanban, bloqueo de `hermes*` y
`python -m hermes`, 48 skills de fábrica apagadas, escritura solo en handoff, pedidos y cachescratch;
`probar-deny` 183/45/0).

### Revisión para dejarlo operando (26-oct, 23:45, a pedido de Sergio Urcullo)

Medido desde el panel Terminal (fuera de la copia de la app de Claude):
- `hermes auth list`:
  - openai-codex tiene login propio (`device_code`).
  - Siguen anthropic (oauth) y copilot. **El de copilot es su token de GitHub** (`gh auth token`).
  - gemini viene de la variable `GEMINI_API_KEY`.
- `hermes skills list`: 69 habilitadas. Son 61 del repo (todas las de carriles: video, web, backend…) y 8 de fábrica.

| # | Paso | Quién | Prueba de hecho |
|---|---|---|---|
| 1 | `hermes auth remove copilot 1` y `hermes auth remove anthropic 1` | Sergio Urcullo | `hermes auth list` muestra solo openai-codex y gemini |
| 2 | ~~Recortar skills a 7~~: descartado el 26-oct. Sergio Urcullo quiere que Hermes sepa lo mismo que Claude. Se limpian en el origen las repetidas y las que se contradicen (`research/2026-10-26-skills-y-autonomia-hermes.md` §5) | Claude, por PR, con su OK | Las contradicciones de §4.2 corregidas |
| 3 | Leer X: perfil dedicado `C:/Users/PC/BovedaPrivada/BrowserProfiles/x`, donde Sergio Urcullo inicia sesión una vez, más el lector de Playwright | Sergio Urcullo (login) y Claude (lector) | Una búsqueda en X devuelve posts con autor y fecha |
| 4 | Abrir Hermes en una PowerShell o en el panel Terminal de la app, **no en Orca**: Orca lo abre con `--yolo` (sin aprobaciones) y en el checkout principal | Sergio Urcullo | `/context` muestra `AGENTS.md`; `/status` muestra Sol |
| 5 | Reinstalar la tarea programada (`scripts/orquesta/README.md` §«Correr») | Sergio Urcullo | `schtasks /Query /TN "ONIA Orquesta" /V /FO LIST` sin `&` suelto |
| 6 | Primera tarea real: la página del taller, que a Sergio Urcullo no le gusta, como pedido de Hermes con `--dry` y después cargado | Hermes, con su OK | Issue con `necesita-ok` en la cola |
| 7 | Decidir la autonomía (abajo) | Sergio Urcullo | Línea en `AGENTS.md` §1 |

**Autonomía propuesta** (pendiente de su decisión):
- **Hermes decide solo:**
  - leer el repo, los issues y los PR;
  - investigar en la web;
  - elegir carril, nivel y prueba de cada pedido;
  - cargarlo con `necesita-ok`;
  - ordenar la cola según la etapa vigente;
  - revisar entregas contra su «hecho cuando»;
  - escribir el handoff.
- **Nuevo, si lo aprueba:** cargar **sin** `necesita-ok` las tareas que solo leen. Son las de investigación en la nube
  con `check: urls`, con un tope de 3 por día: es la misma excepción que ya tiene el Hermes del VPS. Necesita un PR a
  `cargar-issue.mjs`, con su prueba, y a `AGENTS.md`.
- **Siempre con él:** lo visible, el gasto, contactar personas, producción, mergear e instalar.

En este orden (actualizado el 26-oct, 23:30, por la sesión que siguió al relevo):
1. ~~Aplicar #274~~: hecho a las 23:06 (arriba). Le falta a Sergio Urcullo, en una PowerShell nueva: `hermes auth list`;
   si no hay un openai-codex propio, `hermes auth add openai-codex`; `hermes auth remove copilot <n>` y
   `hermes auth remove anthropic <n>` (el número sale de la lista). Después abrir con
   `hermes --tui -m gpt-6.1-sol --provider openai-codex` desde `E:\onia-wt\hermes-base` y mirar `/context`.
   Con la config real en Sol, el `-m` ya no debería hacer falta: probarlo sin él una vez.
2. **Reinstalar la tarea programada** (comando de `scripts/orquesta/README.md` §«Correr»; la corre él). Se le pasó
   el comando el 26-oct.
3. **Plan de supervivencia** (`ONIA_ESTRATEGIA_DE_EMPRESA.md`, sección del 26-oct): Bs 3.000 al 3-nov. El número de
   WhatsApp ya estaba desde el 19-oct (`handoff/comunidad.md`). La página `/auditoria` quedó con el número (y con
   `noindex` hasta su OK) en el PR «página lista para abrir la venta y ofertas 1 a 1» (#276), pero **a Sergio
   Urcullo no le gusta el resultado**. No se publica hasta saber qué cambiar. Falta además el QR fijo de Credinet
   Web (Leslie Mercado Moreno). Las ofertas 1 a 1 están en `sales-kit/07-OFERTAS-1-A-1.md`; a la llamada paga le
   falta el precio.
4. **Primera tarea real de Hermes** con `cargar-issue.mjs --dry` y después la carga (siempre con `necesita-ok`).
5. Pendientes que no corren esta semana: guarda del autosync para el checkout principal y sacar `onia-cola`
   (ítem 8 de arriba); conectar YouTube, TikTok, LinkedIn y Facebook en Buffer (con su login); banco de 30 pruebas de
   decisiones de Hermes (`research/2026-10-26-onia-autonoma-propuesta.md` §5, él lo pidió para después); el BCP
   (María Bayá espera el contacto y la certificación electrónica del NIT); Codex vence el 13-nov y el carril
   plataforma corre con Codex.

El orden de §7 de `ONIA_HARNESS.md` sigue valiendo para lo del harness; la §10 de la auditoría queda solo como
referencia de comandos y de cómo volver atrás.
