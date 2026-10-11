# S02 · Orden de trabajo de Hermes-Jarvis (QA) tras el clear

Fecha: 2026-10-11. Carril: Hermes-Jarvis (Revisión/QA). Sesión: `session_01SQ7cvuDX5w5jDHk5VdhAEo`.
Método: lectura del worktree y `gh` de solo lectura. No se tocó el VPS, no se ejecutó Codex, no se escribió en GitHub ni fuera del worktree.
Corrección: versión 2, tras el verificador (PARTIAL). Cambios: Q2 y Q5 quedan sin marcar, CI de #194 re-medido, alcance del PR, modelo separado por componente, contratos que dependen de #194.

## Estado medido

| Dato | Evidencia |
|---|---|
| PR #194 abierto, 45 archivos, +4833/-25, 6 commits | `gh pr view 194 --json files,additions,deletions,commits` |
| CI de #194 NO verde ahora. Estado `UNSTABLE`; check «suite del carril hermes-jarvis» `IN_PROGRESS` (run 38115018352, creado 05:30:45Z). La corrida anterior (38113559998, `pull_request`, creada 05:03:34Z) fue `success`, pero un push posterior la reemplazó | `gh pr view 194 --json mergeStateStatus,statusCheckRollup`; `gh run view 38113559998` |
| El PR trae más que Q2 y Q5: `Q9-alta-de-usted.md`, `hermes-L1-web-vs-producto.md`, `ONIA_PROMESA_VS_PRODUCTO.md`, barrido `promesas-web/2026-10-11/` (con capturas), `TELEGRAM_COMMAND_CENTER.md`, la skill `onia-hermes-jarvis` | `gh pr diff 194 --name-only` |
| `hermes-qa-diario.yml` existe en la rama de #194, no en este worktree | `ls .github/workflows` → 8 archivos, sin ese nombre; en #194 aparece en `gh pr diff --name-only` |
| La sección 15 «latidos» / regla MUDO no está en este árbol | `grep -n "MUDO\|latidos" hermes-content/deploy/hermes-jarvis/diagnostico.sh` → 0 coincidencias |
| `test:jarvis-diagnostico` NO existe | `grep "diagnostico" package.json` → 0 coincidencias. El CI (`hermes-jarvis-pruebas.yml:71-72`) corre una lista fija de suites que tampoco lo incluye |
| La cola no refleja Q1 a Q5 | `hermes-content/docs/cola/loop/hermes-jarvis.md` (31 líneas, leído completo). Línea 22: «Cola sin tareas desbloqueadas (9-oct, tarde)». Ninguna línea Q1-Q5 |
| Handoff sin estado del 10 ni 11-oct | `hermes-content/docs/handoff/hermes-jarvis.md`: línea 3 es el bloque «ESTADO 9-oct, tarde», el primero del archivo (arriba, no al final). Leído completo: no hay bloque posterior |
| Plan de QA con Q1 a Q5 | `hermes-content/docs/HERMES_ROL_QA.md` §5 «Cola inicial» (líneas ~108-170). Q1 `aplicar` sin correr. Q2 y Q5 en #194. Q3 aduana fase 2. Q4 resumen con latidos |
| Hechos según el plan (no son «hechos» por estar en un PR) | HERMES_ROL_QA §5 Q2: primera corrida programada en verde, tabla y cuatro respuestas. Q5: VPS simulado y, en vivo, una publicación con renglón en el log. Q4 y Q5 «no cuentan como hechos» sin Q1 |
| Sobre el sí de Q1 hay dos fuentes distintas | HERMES_ROL_QA §5 Q1: «Sí de Sergio Urcullo: no se vuelve a pedir». Cola `hermes-jarvis.md` (Bloqueado) y handoff §6: piden el «sí». La regla de `CLAUDE.md` del proyecto (9-oct, «Qué se publica sin preguntar») incluye «cambios de infraestructura revisados» sin esperar su OK |
| PRs abiertos del carril | `gh pr list --state open`: #195, #194, #191, #172, #162, #145, #144, #143, #40. #136, #140 y #132 no aparecen abiertos. `ONIA_EQUIPOS_POR_SESION.md:240` y `cola/loop/madre.md` los asignan a Revisión/QA. Si fueron mergeados o cerrados: no verificado |
| Modelo: tres fuentes, componentes distintos | (a) `handoff/hermes-jarvis.md:55`: `gpt-5-mini` en chat y 08:00/08:10, `gpt-5-nano` en 13:00/16:00. Es el gateway de Hermes en el VPS, no la sesión de nube. (b) `cola/loop/madre.md:138` (H7): «Hermes con la cola vacía gastando Opus cada hora». (c) `HERMES_ROL_QA.md` §4: Opus cada hora para la sesión de nube; propone Sonnet, 5 turnos/día; dice «no está medido si la madre puede cambiarle el modelo». (a) y (b)/(c) no se contradicen: son componentes distintos |
| Consumo de la sesión de nube | UNKNOWN. `scripts/billetera-tokens.mjs` (solo lectura) suma transcripts locales de `~/.claude/projects` (47 carpetas). No hay transcript local de `session_01SQ7cvuDX5w5jDHk5VdhAEo` (búsqueda por id: 0). No se puede aislar desde la PC |
| Transcript de la sesión Hermes | UNKNOWN. No leído |
| Contratos Codex de Hermes | `hermes-content/docs/handoff/codex-tareas/`: 12 contratos y README/_PLANTILLA. Ninguno con prefijo `hermes-` en este árbol. `hermes-L1-web-vs-producto.md` existe solo en #194 |

## Brecha

1. **Q2 y Q5 no corren.** #194 sigue sin mergear y su CI está en curso. Sin merge no hay workflow diario ni disparador de Q5.
2. **Q1 (`aplicar`) sin correr.** Q5 se enciende desde `aplicar`. Hay contradicción de fuentes sobre el sí (ver tabla). La regla del proyecto del 9-oct sugiere no pedirlo para infra revisada; la decisión la toma la madre. No la asumo.
3. **Desincronía de la cola.** La cola dice «nada desbloqueado» y HERMES_ROL_QA §5 tiene cinco tareas. Probable causa de que el carril perdiera el orden tras el clear. No medido: el transcript quedó UNKNOWN.
4. **Handoff sin entrada del 10 ni 11-oct.** La sesión nueva no sabe que #194 está abierto ni que Q1 sigue pendiente.
5. **Modelo de la sesión de nube sin medir.** No hay dato por sesión (UNKNOWN). Las fuentes (b) y (c) describen Opus cada hora; (a) es otro componente. Mientras no se mida, el costo real es desconocido. La decisión de bajarlo es de Sergio Urcullo (H7).
6. **Alcance de #194 mayor que Q2 y Q5.** 45 archivos, con Q9, L1 y un barrido de promesas que no están en el plan de QA. Mergear el PR completo mete trabajo ajeno sin revisar.
7. **Contratos Codex de Hermes sin escribir.** C1, C2 y C3 tocan `diagnostico.sh` o `hermes-qa-diario.yml`, que existen solo en #194 (C1 y C3 también chocan con los cambios de #194 en `diagnostico.sh`). Se pueden escribir ya, pero se lanzan después del merge.

## Configuración propuesta

### Orden de trabajo (máximo 7)

1. **Madre-dev: revisar y mergear #194.** Esperar el CI en verde del run nuevo. Revisar los 45 archivos: si lo que no es Q2/Q5 (Q9, L1, barrido de promesas, `ONIA_PROMESA_VS_PRODUCTO.md`) no es del carril, pedir separarlo antes de mergear. Antes de mergear, leer `.github/workflows/hermes-qa-diario.yml` y confirmar que no imprime secretos y que falla fuera de `main`.
   ```
   gh pr view 194 --repo oninteligenciaartificial/onia-hermes --json mergeStateStatus,statusCheckRollup
   gh pr diff 194 --repo oninteligenciaartificial/onia-hermes --name-only
   ```
2. **Hermes (nube): sincronizar la cola.** En `hermes-content/docs/cola/loop/hermes-jarvis.md`, reemplazar el bloque de la línea 22 («Cola sin tareas desbloqueadas (9-oct, tarde)…» hasta antes de «## Verificación de aprendizaje») por:
   ```
   ## Cola QA · 2026-10-11 (fuente: HERMES_ROL_QA.md §5)
   - [ ] Q1 Verificar el encendido: la madre desde la PC (ver HERMES_ROL_QA §5 Q1 sobre el sí). Hecho: log de `aplicar` sin ❌
   - [ ] Q2 VPS visible cada día sin la PC: PR #194 abierto, CI en curso; pendiente merge por la madre. Hecho: primera corrida programada en verde
   - [ ] Q3 Fase 2 de la aduana: nada le grita por fuera
   - [ ] Q4 Resumen de las 06:30 con lo que nadie empuja. Hecho: prueba con madre.md de ejemplo y resumen real
   - [ ] Q5 QA después de cada publicación: PR #194; se enciende con Q1. Hecho: renglón en el log tras una publicación real
   ```
3. **Hermes (nube): handoff del 11-oct.** Insertar antes de la línea 3 de `hermes-content/docs/handoff/hermes-jarvis.md`:
   ```
   > **ESTADO 11-oct, mañana.** #194 (Q2 y Q5) abierto, pendiente de merge por la madre. CI en curso al medir
   > (la corrida anterior era verde). El PR trae 45 archivos, no solo Q2 y Q5: revisar alcance antes de mergear.
   > Q1 (`aplicar`) sin correr. Cola sincronizada con HERMES_ROL_QA §5. El transcript del 10-11 no se leyó.
   > Pendiente: el sí a `aplicar` (ver HERMES_ROL_QA §5 Q1) y el modelo de la sesión de nube (sin medir).
   ```
4. **Madre-dev: `aplicar` (Q1).** Desde la PC, con el runbook de `TELEGRAM_COMMAND_CENTER.md` §8, entre 06:30 y 22:00 La Paz. Antes, `diagnostico`. Lo decide la madre según la tabla de fuentes; si pide el sí, pedirlo una sola vez y en la sesión madre.
5. **Hermes (nube): primera corrida diaria.** Tras el merge, verificar la corrida de las 10:00 UTC (06:00 La Paz). Si falla, abrir tarea para la madre; no reejecutar a ciegas.
6. **Madre-dev: medir el modelo.** Correr `diagnostico` y pegar en el handoff el modelo y la cadencia de cada job de Hermes (gateway). Para la sesión de nube, la madre lee el modelo en la consola de la sesión (no verificado desde esta sesión). Si es Opus cada hora, llevar la decisión a Sergio Urcullo (H7) con el dato, sin cambiarla.
7. **Hermes (nube): escribir tres contratos Codex** (no dos) como archivos nuevos en `hermes-content/docs/handoff/codex-tareas/`, en su rama `claude/*`, con estado `pendiente`. La madre los lanza con `scripts/codex-tarea.sh` **después del merge de #194**. Dejar `CODEX-CONTRATO: <ruta>` en el transcript.

### Contratos Codex propuestos (lo mecánico a Luna)

Nombre según `codex-tareas/README.md`: `<carril>-<id>-<slug>.md`. Cabecera según `_PLANTILLA.md` (`modelo: luna` o `gpt-6.1-sol`).

| Archivo | Modelo | Qué hace | Prueba de hecho | Requiere |
|---|---|---|---|---|
| `hermes-C1-latidos-mudo-test.md` | luna | Agrega prueba de la regla «MUDO = log sin tocar desde la penúltima corrida» de `diagnostico.sh` sección 15 | Test nuevo con nombre a crear en `package.json`. **`test:jarvis-diagnostico` no existe**. Verde con el código; rojo contra el caso sin tocar | merge de #194 (la sección 15 no está en este árbol) |
| `hermes-C2-main-guard-test.md` | luna | Prueba que `hermes-qa-diario.yml` falle antes de tocar el VPS cuando corre desde otra rama | Verde con la guarda; rojo si se quita | merge de #194 (el workflow no está en este árbol) |
| `hermes-C3-modelo-por-job.md` | gpt-6.1-sol | `diagnostico.sh` imprime modelo y cadencia por job de Hermes, leyendo la fuente de `poner`, sin llamar al LLM | Salida de `diagnostico` con una línea por job. UNKNOWN si falta la fuente; la fuente de `poner` no se verificó | merge de #194 (cambia `diagnostico.sh`, que #194 también cambia) |

Ninguno toca Plataforma ni el VPS. Lo escribe la nube; lo lanza la madre.

## Quién la aplica

| Paso | Quién | Por qué |
|---|---|---|
| 1 revisar y mergear #194 | madre-dev | La regla del PR lo asigna a la madre; es publicación de workflow; el alcance de 45 archivos lo revisa ella |
| 2 cola, 3 handoff | sesión Hermes (nube) | Son docs del carril; la nube pushea su rama `claude/*`; el integrador o la madre lo mergea |
| 4 `aplicar` (Q1) | madre-dev desde la PC | Toca el VPS. El sí: decisión de la madre según HERMES_ROL_QA §5 Q1 y la cola; si pide el sí, lo pide a Sergio Urcullo una vez |
| 5 primera corrida | sesión Hermes (nube) lee; madre actúa si falla | La nube solo lee GitHub; el arreglo es de la madre |
| 6 medir modelo | madre-dev corre `diagnostico` y mira la consola de la sesión; Sergio Urcullo decide | Sin SSH desde la nube; la decisión de costo es suya (H7) |
| 7 contratos | sesión Hermes escribe; madre lanza Codex tras el merge | Regla de la cola de contratos: la nube no lanza Codex |
| Bajar el modelo de la sesión de nube | Sergio Urcullo | H7 lo deja a su decisión |

## Prueba de hecho

1. Mergeado y verde: `gh pr view 194 --repo oninteligenciaartificial/onia-hermes --json state,mergeStateStatus` → `MERGED`; el run del head de `main` queda `success`.
2. Primera corrida: `gh run list --repo oninteligenciaartificial/onia-hermes --workflow hermes-qa-diario.yml --limit 1 --json conclusion,createdAt` → `conclusion: success`, a las 10:00 UTC del día siguiente al merge.
3. Cola: `grep -n "Q1\|Q2\|Q3\|Q4\|Q5" hermes-content/docs/cola/loop/hermes-jarvis.md` → cinco líneas; `grep -c "desbloqueadas" hermes-content/docs/cola/loop/hermes-jarvis.md` → 0. Las casillas de Q1 a Q5 quedan en `[ ]` hasta su prueba de hecho.
4. Handoff: `grep -n "ESTADO 11-oct" hermes-content/docs/handoff/hermes-jarvis.md` → una línea.
5. Q1: log de `aplicar` sin ❌, verificado por la madre. Hasta entonces Q4 y Q5 no cuentan como hechos.
6. Modelo: `diagnostico` pegado en el handoff con una línea por job. Si la salida no lo muestra, queda UNKNOWN. El modelo de la sesión de nube queda UNKNOWN hasta que la madre lo lea.
7. Contratos: los tres `hermes-C*` existen en `codex-tareas/` con `estado: pendiente`. Tras el merge de #194, cada prueba corre en verde en la rama de Codex.
