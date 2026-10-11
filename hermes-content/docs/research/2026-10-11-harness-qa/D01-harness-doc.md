# D01 - ONIA_HARNESS.md: qué quedó viejo (v2, corregido por verificador)

Fecha de medición: 2026-10-11. Modelo de la pasada: Haiku 5.5. Solo lectura. No se editó `ONIA_HARNESS.md` (lo aplica el integrador). Sin git. Sin Codex. RemoteTrigger solo con `list`.

Cambios respecto de la v1 (hallazgos del verificador): se corrigió el comando de defaults de Codex; se quitó la cita inventada `:37`; se quitó la cita a una nota de `madre.md` que no existe; se midieron las líneas que la v1 dejó como NO VERIFICADO; se agregaron reemplazos de CLAUDE.md:46 y :181, y de las líneas que hoy son falsas por existir (:11, :15).

## Estado medido

Todas las cifras se midieron en esta pasada, salvo donde se indica UNKNOWN.

| Dato | Doc dice (línea) | Medido hoy | Evidencia (comando, salida corta) |
|---|---|---|---|
| Líneas CLAUDE.md del repo | 631 (:34, :176) | **686** | `wc -l CLAUDE.md` → 686 |
| Reglas en CLAUDE.md | 27 (:34, :176) | UNKNOWN (no recontado) | - |
| Líneas AGENTS.md | 286 (:34) | **295** | `wc -l AGENTS.md` → 295 |
| Líneas `scripts/codex-tarea.sh` | 62 (:37, :177) | **63** | `wc -l` → 63 |
| Defaults de modelo Codex | "los tres valores por defecto son gpt-6.1-sol (45, 51, 57)" (:37) | **46, 52, 58** | `grep -n ':-gpt-6.1-sol' scripts/codex-tarea.sh` → 46, 52, 58 (3 líneas) |
| Cabecera de modelo | "La cabecera dice código = astra" (:37, :177) | **Ya corregida** | `sed -n 19,20p` → "gpt-6.1-sol por defecto, también para código cerrado; gpt-6-astra para seguridad, cobros, infra con root o lógica de riesgo" |
| Skills en `.claude/skills` | 45 (:35) | **64 directorios** | `ls -d .claude/skills/*/ \| wc -l` → 64 |
| Skills en `.agents/skills` | 30 (:35) | **30** | `ls -d .agents/skills/*/ \| wc -l` → 30 |
| Skills en G (`~/.claude/skills`) | 110 (:35) | **110** | `ls -d ~/.claude/skills/*/ \| wc -l` → 110 |
| Agentes de proyecto | 3 (:36) | **6** | `ls .claude/agents \| wc -l` → 6 |
| Agentes en G | 43 (:36, :181) | **43** | `ls ~/.claude/agents \| wc -l` → 43 |
| MEMORY.md (líneas) | 125 (:40, :185) | **131** | `wc -l` sobre `…\projects\C--dev-proyectos-onia-hermes\memory\MEMORY.md` → 131 |
| Carpetas de cola/loop | "6 libros" (:40) | **7 archivos**: madre, plataforma, hermes-jarvis, lucia, marca-personal, ventas-pauta, README | `ls hermes-content/docs/cola/loop/` |
| Libros fuera de loop | TABLERO, EQUIPO, loops, plataforma-v1, chatbot (:40) | **Existen** en `hermes-content/docs/cola/` | `ls hermes-content/docs/cola/` |
| Contratos Codex | 12 sin fila (:40) | **12 contratos** + README + _PLANTILLA (14 archivos en `handoff/codex-tareas/`) | `ls hermes-content/docs/handoff/codex-tareas \| wc -l` → 14 |
| `madre.md` menciona DESARROLLO-INFRA o MARKETING | "0 menciones" (v1) | **0** | `grep -c 'DESARROLLO\|MARKETING' hermes-content/docs/cola/loop/madre.md` → 0 |
| Reparto de las dos madres | no existe en el doc | **Vive en `handoff/madre-local.md`** | `madre-local.md:25` "ARRANQUE madre DESARROLLO-INFRA"; `:27-29` Plataforma y Hermes-Jarvis son de DESARROLLO-INFRA; `:29` Lucía, Marca y Ventas son de MARKETING; `:41` "Ventas pasó a MADRE MARKETING" |
| Ventas en `madre.md` | "Ventas pasa a la madre de marketing (madre.md, nota 11-oct)" (v1) | **Falso como cita.** `madre.md:149` sigue "Ventas \| su propio ScheduleWakeup" | `sed -n 149p hermes-content/docs/cola/loop/madre.md` |
| `scripts/verificar_cola.js` | "se extiende" (:127, :164) | **Existe** | `ls scripts/verificar_cola.js` |
| `handoff/ARRANQUE-SESIONES.md` | "se guarda ahí" (:142) | **Existe** | `ls hermes-content/docs/handoff/ARRANQUE-SESIONES.md` |
| `ONIA_EQUIPOS_POR_SESION.md` | "todavía no existe" (:11) | **Existe** (30 KB, 10-oct 16:12) | `ls -la hermes-content/docs/ONIA_EQUIPOS_POR_SESION.md` |
| Auditoría A4 | "todavía no existe" (:15) | **Existe** (`research/2026-10-10-auditoria-madre-v3.md`, 29 KB) | `ls -la` |
| `subagente-con-modelo.mjs` | no citado | **Existe, sin commit.** Hook PreToolUse, matcher "Agent", exige `model` | `ls .claude/hooks/` → `subagente-con-modelo.mjs`; línea 2 del archivo |
| Hooks del repo | "SessionStart y Stop" (:38) | Correcto para `settings.json` (committed). El PreToolUse nuevo no está cableado en committed | `grep -n '"SessionStart"\|"Stop"' .claude/settings.json` → líneas 3 y 13 |
| `git-autosync.js` | 270 líneas, termina `exit(0)` (:38, :182) | **Vigente** | `grep -n 'exit(0)'` → línea 270; `wc -l` → 270 |
| Permisos globales | defaultMode auto, skip… true (:39, :180) | **Vigente** | `C:/Users/PC/.claude/settings.json` línea 3 `"defaultMode": "auto"`; línea 101 `"skipDangerousModePermissionPrompt": true` |
| CLAUDE.md:486 | citado en :34 como "dice lo contrario" | **Desplazado.** "Qué se publica" está en :532; "Desde el 9-oct" en :541 | `grep -n 'Qué se publica sin preguntar\|Desde el 9-oct, lo que' CLAUDE.md` |
| CLAUDE.md:46 | (no citado) | **Vigente y falso con dos madres**: "UNA madre local, varios carriles y subagentes." | `sed -n 46p CLAUDE.md` |
| CLAUDE.md:181 | (no citado) | **Vigente y falso con dos madres**: "La MADRE corre en la PC … y es la única que ordena." | `sed -n 181p CLAUDE.md` |
| Rules `zh` y `common` | "zh repite los 11 de common" (:34) | **Vigente**: 11 y 11 | `ls …/rules/zh \| wc -l`, `ls …/rules/common \| wc -l` |
| Triggers de latido | 4 latidos (§3) | **Vigentes**: :17 Plataforma (`trig_01XVX9…`), :27 Marca (`trig_01ExDb…`), :47 Lucía (`trig_013YP8…`), :57 Hermes-Jarvis (`trig_01A9hC…`); todos enabled | `RemoteTrigger list` (solo lectura, HTTP 200); búsqueda en la salida guardada |
| Latido de Ventas | "No verificable" (§3 :61), "sin latido" (§4 #7) | **Medido: no existe.** Ninguno de los triggers del listado se llama Ventas | `RemoteTrigger list` → nombres con "Latido": solo Plataforma, Marca, Lucía, Hermes-Jarvis |
| Triggers deshabilitados (14, :70) | "14" | **UNKNOWN** (la salida de list pesa 84,7 KB en una línea; hay al menos 9 `enabled:false` a la vista) | - |
| Cron de la madre (ronda, parte, cierre) | "madre, CronCreate" (§3) | UNKNOWN (vive en la sesión madre; esta pasada no la lista) | - |
| Costo `get_usage` (:44) | "1.503 M tokens en 48 h" | UNKNOWN (no re-medido) | - |
| Cupo Codex | "56 %" (:37) | UNKNOWN (no re-medido; la brecha 2 dice 58 %) | - |

Lo que el doc ya no describe bien, de un vistazo:
- Hay dos madres (DESARROLLO-INFRA y MARKETING), no una. El reparto está en `handoff/madre-local.md:25-41`.
- Codex es la herramienta de todas las sesiones, no solo de la madre. El texto actual no dice eso.
- La cabecera de `codex-tarea.sh` ya no contradice los defaults. La brecha astra/sol de :37 y :177 es falsa hoy.
- Ventas no tiene latido (confirmado con RemoteTrigger list).

## Brecha

1. **Una madre → dos.** Afecta a §6 "Una madre, un libro" (:122), §4 "Dueño hoy" (:78-98), §7 #4 (:165) y §3 (:52-56). `madre.md` no tiene ninguna sección de MARKETING; el reparto solo está en `handoff/madre-local.md`.
2. **Codex no dice que entra en todas las sesiones.** §6 "Costo" (:145-148) y "Lo que NO se usa" (:150-156) no lo mencionan. La fila de Codex cloud (:67) dice "cuando lo lanza la madre", que sigue siendo cierto para Codex cloud, pero la CLI local (`codex-tarea.sh`) es de todas las sesiones según la línea nueva de Sergio. El doc actual no dice ninguna de las dos cosas con precisión.
3. **La contradicción astra/sol ya no existe.** Sigue en :37 y :177. La cabecera está corregida en `scripts/codex-tarea.sh:19-20`.
4. **Loops y triggers.** §3 no tiene la madre de MARKETING ni su latido. Los latidos de Plataforma, Marca, Lucía y Hermes-Jarvis están bien. Ventas no tiene latido. El número de triggers deshabilitados no se pudo recontar.
5. **Frentes y dueños.** §4 asigna Lucía, Marca y Ventas a un solo dueño. El reparto real lo da `handoff/madre-local.md:27-29`. El mapa propuesto en la v1 (L78) asignaba frentes sin fuente y se retira (ver Configuración propuesta).
6. **Brechas cerradas que el doc aún lista.** §5 #8 cita CLAUDE.md como "inflado" sin separar lo hecho. §7 #3 dice "extender `verificar_cola.js`" y lo da por hecho como si no existiera. `ONIA_EQUIPOS_POR_SESION.md` y la auditoría A4 ya existen (:11, :15).
7. **Brechas nuevas no listadas.** `subagente-con-modelo.mjs`, `codex-cupo.mjs` y `codex-worktree.sh` están sin commit. El harness-QA (esta carpeta) no tiene fila en §7.
8. **Cifras viejas.** CLAUDE.md 631 → 686 (:34, :176). AGENTS.md 286 → 295 (:34). codex-tarea.sh 62 → 63 (:37, :177). Skills de `.claude` 45 → 64 (:35). Agentes de proyecto 3 → 6 (:36). MEMORY.md 125 → 131 (:40, :185).
9. **Cita a CLAUDE.md desplazada.** :34 cita CLAUDE.md:486. La regla está en :532 y :541.
10. **Dos frases de una madre en CLAUDE.md.** :46 y :181 contradicen el modelo nuevo. Tocar CLAUDE.md es Clase B (requiere el sí de Sergio Urcullo, ONIA_HARNESS.md:141).

## Configuración propuesta

Texto exacto de reemplazo. Para el integrador, que es quien edita el doc. Nada se edita aquí.

**L122 (§6 "Una madre, un libro"), reemplazar la viñeta completa por:**
```
- **Dos madres, un solo libro.** Madre DESARROLLO-INFRA (nubes Plataforma y Hermes-Jarvis, VPS, infra y harness) y madre MARKETING (Lucía, Marca personal, Ventas y pauta). El libro es `cola/loop/madre.md`, con dos secciones, una por madre. Cada sección la escribe solo su madre. Reparto vigente desde 11-oct-2026 (`handoff/madre-local.md:25-41`).
```

**L123 (§6, "Cada pedido entra con…"):** dejarla igual.

**§7 #3 (L164) "Libro único":** cambiar "libro único" por "libro único con dos secciones (una por madre)".

**L34 (§2 Instrucciones):** `CLAUDE.md del repo: **631 líneas, 27 reglas**` → `CLAUDE.md del repo: **686 líneas**`. `AGENTS.md: 286 líneas` → `AGENTS.md: 295 líneas`. Las reglas no se recontaron: no poner número de reglas.

**L35 (§2 Skills):** `45 en .claude/skills` → `64 en .claude/skills`. `30 en .agents/skills` se queda. `110 en G` se queda.

**L36 (§2 Agentes):** `3 de proyecto` → `6 de proyecto`. `43 en G` se queda.

**L37 (§2 Codex), columna "Qué falla":** borrar las viñetas "La cabecera dice…" y "En la nube no se elige el modelo…", y poner:
```
<li>Codex CLI corre en la PC (`scripts/codex-tarea.sh`, 63 líneas). Cabecera corregida: sol por defecto, astra para riesgo (líneas 19-20). Defaults en líneas 46, 52 y 58.</li>
<li>Codex cloud corre en la nube de OpenAI. En la nube no se elige modelo.</li>
<li>Cupo semanal: ~58 % al 11-oct; reinicio 14-oct 03:57 UTC.</li>
```

**L38 (§2 Hooks, "Qué hay"):** agregar
```
<li>`.claude/hooks/subagente-con-modelo.mjs` (PreToolUse, matcher "Agent"; sin commit; no cableado en `settings.json` versionado)</li>
```

**L11 (encabezado):** reemplazar
`Lo escribe A1 y **todavía no existe**.`
por
`Existe (\`hermes-content/docs/ONIA_EQUIPOS_POR_SESION.md\`). Lo mantiene A1.`

**L15 (encabezado):** reemplazar
`La auditoría A4 (\`research/2026-10-10-auditoria-madre-v3.md\`) todavía no existe; cuando entre se enlaza acá.`
por
`La auditoría A4 existe: \`research/2026-10-10-auditoria-madre-v3.md\`.`

**L41 (§2, fila Loops "Qué falla"):** `No cuenta la capa VPS/casa` se queda. No cambiar.

**L70 (§3, triggers):** cambiar `Además hay 14 triggers deshabilitados en el listado de RemoteTrigger que habría que limpiar.` por `Además hay triggers deshabilitados en el listado de RemoteTrigger (cantidad sin recontar). Se limpian en la ronda de la madre DESARROLLO-INFRA, solo con list; el delete lo aplica Sergio Urcullo.`

**Fila Ventas en §3 (L61):** reemplazar la fila por
```
| Ventas | madre MARKETING, sin latido del servidor | — | Su cola | No | MARKETING | **Medido 11-oct: no hay trigger de Ventas** (RemoteTrigger list) |
```

**L78 (§4, tabla de frentes):** quitar la columna "Dueño propuesto" hasta que la madre o Sergio decidan. Reemplazar el encabezado por `Dueño hoy (madre que lo ordena)` y dejar en cada fila la madre que la ordena según `madre-local.md:27-29` (Plataforma, Hermes → DESARROLLO-INFRA; Lucía, Marca, Ventas → MARKETING). Las filas 11 (web), 12 (fiscal), 15 (harness), 16 (add-ons) y 19 (líneas congeladas) quedan **sin asignar** hasta que la madre o Sergio decidan. La fila 16 no tenía fila en la v1; se agrega como sin asignar.

**L165 (§7 #4):** cambiar `la madre (RemoteTrigger y mensajes)` por `la madre de cada carril (DESARROLLO-INFRA para Plataforma y Hermes-Jarvis; MARKETING para Lucía, Marca y Ventas)`.

**L127 (§6, verificador):** cambiar `Verificador sin LLM: se extiende \`scripts/verificar_cola.js\`` por `Verificador sin LLM: \`scripts/verificar_cola.js\` ya existe; se extiende (no se crea)`.

**L142 (§6, aprobación):** agregar al final `(existe desde el 10-oct)`.

**L176 y L177 (§8):** `CLAUDE.md tiene 631 líneas y 27 reglas.` → `CLAUDE.md tiene 686 líneas.` Y `codex-tarea.sh tiene 62 líneas y la contradicción astra/sol.` → `codex-tarea.sh tiene 63 líneas; la cabecera astra/sol ya está corregida (líneas 19-20).`

**Ajuste en CLAUDE.md (Clase B, solo con sí de Sergio Urcullo):**
- L46: `- **UNA madre local, varios carriles y subagentes.** …` → `- **Dos madres locales (DESARROLLO-INFRA y MARKETING), varios carriles y subagentes.** Reparto en handoff/madre-local.md.`
- L181: `- **La MADRE corre en la PC de Sergio Urcullo** y es la única que ordena.` → `- **Cada madre corre en la PC de Sergio Urcullo** y ordena solo a sus carriles (DESARROLLO-INFRA o MARKETING).`
- L34 (cita :486): cambiar `CLAUDE.md:486` por `CLAUDE.md:541`.

## Quién la aplica

| Cambio | Quién | Por qué |
|---|---|---|
| L122, L123, §7 #3, L165, §4 (mapa), L61 (fila Ventas) | **integrador** | El doc es del integrador. El mapa de frentes solo se corrige a lo medido |
| L34, L35, L36, L37, L38, L176-177 (cifras y Codex) | **integrador** | Las cifras ya están medidas en este documento |
| L11, L15 (existencia de archivos) | **integrador** | Medido con `ls` |
| L70 (limpieza de triggers) | **madre DESARROLLO-INFRA** | Dueña de RemoteTrigger. `delete` lo aplica Sergio Urcullo |
| L127 y L142 (verificador y arranque) | **madre DESARROLLO-INFRA** | Dueña de `verificar_cola.js` y del harness |
| Ajuste de CLAUDE.md:46, :181 y la cita :486 | **Sergio Urcullo** (sí de Clase B) y luego la madre | CLAUDE.md es Clase B (ONIA_HARNESS.md:141) |
| Commit de `subagente-con-modelo.mjs`, `codex-cupo.mjs`, `codex-worktree.sh` | **Sergio Urcullo** (sí de commit) | Sin commit no existen para otras sesiones |
| Fila de Ventas en el libro y su latido | **madre MARKETING** | Dueña de Ventas (`madre-local.md:41`) |
| Frentes 11, 12, 15, 16, 19 | **sin asignar** (decisión de la madre o de Sergio) | No hay fuente en `madre-local.md` |

## Prueba de hecho

Desde el worktree `onia-madre-v2-pr-review-2d85bb`:

1. `grep -n "UNA madre\|Una madre, un libro" hermes-content/docs/ONIA_HARNESS.md` → **0** líneas.
2. `grep -n "Dos madres\|DESARROLLO-INFRA" hermes-content/docs/ONIA_HARNESS.md` → **al menos 3** líneas.
3. `grep -n "631 líneas\|286 líneas\|62 líneas" hermes-content/docs/ONIA_HARNESS.md` → **0** líneas.
4. `grep -n "686\|295\|63 líneas" hermes-content/docs/ONIA_HARNESS.md` → **al menos 3** líneas.
5. `grep -n "código = astra" hermes-content/docs/ONIA_HARNESS.md` → **0** líneas.
6. `grep -n ':-gpt-6.1-sol' scripts/codex-tarea.sh` → **3** líneas (46, 52, 58). La cabecera se comprueba aparte con `sed -n 19,20p scripts/codex-tarea.sh`.
7. `grep -c 'DESARROLLO\|MARKETING' hermes-content/docs/cola/loop/madre.md` → **al menos 2** (tras la edición de la madre).
8. `ls scripts/verificar_cola.js hermes-content/docs/handoff/ARRANQUE-SESIONES.md hermes-content/docs/ONIA_EQUIPOS_POR_SESION.md` → **3** archivos existen.
9. `grep -n "todavía no existe" hermes-content/docs/ONIA_HARNESS.md` → **0** líneas.
10. `git status --short .claude/hooks scripts/codex-cupo.mjs` → **vacío** (tras el commit de Sergio Urcullo; esta prueba la hace el integrador).
11. Para Ventas: `RemoteTrigger list` (solo lectura) → hay un trigger con nombre "Latido: Ventas". Hoy no existe.

No verificado en esta pasada: cron de la madre, costo y cupo al día, recuento de reglas de CLAUDE.md, cantidad de triggers deshabilitados, y los libros de octubre fuera de `cola/loop/`. Quien lo cierre debe medirlo con comando y pegar la salida, no copiar la cifra del doc.
