# D02 - Skill onia-sesion-madre: datos viejos

Fecha: 2026-10-11. Archivo revisado: `.claude/skills/onia-sesion-madre/SKILL.md` (352 lineas).
Alcance: solo lectura del skill y comprobaciones puntuales. No se hizo git ni se lanzo Codex.

## Estado medido

| # | Afirmacion en el skill | Linea(s) | Evidencia | Veredicto |
|---|---|---|---|---|
| 1 | Una sola madre, «UNA sola madre, no una por area» | 16-17 | Reparto nuevo (11-oct): DOS madres locales, desarrollo-infra y marketing (dato del encargo, no verificado en ListAgents por este subagente) | DESACTUALIZADO |
| 2 | «La madre corre en la PC... es la UNICA que ordena» | 12, 13 | Mismo cambio | DESACTUALIZADO |
| 3 | Tabla de sesiones: Plataforma `session_01HhnFgkeF6nLGvjrfjt1o2C` (l.70) | 70 | Coincide con el contexto vivo | OK en id, pero el titulo y el carril cambian (ahora nube de Plataforma bajo madre desarrollo-infra) |
| 4 | Tabla: Ventas `session_0143C5fMXVs8eWEf7uBpC9SF` (l.71) | 71 | Coincide, pero sin latido (entorno Default) | OK en id; falta la nota «sin latido» y que ahora la ordena madre marketing |
| 5 | Tabla: Marca `session_01WPecmppa9uZEc4fJDjSmaS` (l.72) | 72 | Coincide | OK en id; falta latido y madre marketing |
| 6 | Tabla: Lucia `session_01XSzFcs1k18ijqjSHGjnzD4` (l.73) | 73 | Coincide | OK en id; falta latido y madre marketing |
| 7 | Tabla: Hermes-Jarvis `session_01SQ7cvuDX5w5jDHk5VdhAEo` (l.74) | 74 | Coincide | OK en id; ahora la ordena madre desarrollo-infra |
| 8 | Fila Madre «local `202a717e...`, worktree onia-madre-v2-pr-review-2d85bb» (l.68) | 68 | Sin verificar en este subagente | UNKNOWN en vigencia; el nombre de la madre cambia a dos |
| 9 | Ids de la tabla «historicos» y «para archivar» (l.62-85) | 62-85 | El skill mismo los marca como a verificar | Mantener, pero no son vivos |
| 10 | «Un subagente de la madre NO tiene RemoteTrigger» | 105-106 | FALSO segun la medicion del 11-oct 05:10 UTC. Ademas, RemoteTrigger figura en la lista de herramientas diferidas de este mismo subagente (se lista; no se cargo ni se llamo) | DESACTUALIZADO |
| 11 | Cadencia «cada 20 min (CronCreate `7,27,47 * * * *`)» | 51-52, 112 | `madre-local.md` l.36, 175, 362 dicen lo mismo. `P02-crons-madre.md` l.161 propone Programador de tareas cada 20 min (mecanico, no madre). Hay una decision pendiente que el skill no recoge | PARCIAL: la cadencia de la madre coincide con el handoff; falta que los latidos de las nubes (:17, :27, :47, :57) son otra cosa |
| 12 | Version Codex: «npm 0.161», «CLI que trae la app 0.162-alpha», «npm 0.139 tambien andaba» (l.230, 295-296, 302) | 230, 295-302 | `codex --version` = codex-cli 0.161.0 (PATH de este subagente). El 0.139 y la app 0.162-alpha no se pudieron revisar desde aqui | PARCIAL: 0.161 vigente en PATH; el resto UNKNOWN |
| 13 | «gpt-5.5 deja Codex el 14-oct» (l.302) | 302 | Dato citado de un aviso oficial; no verificado en este subagente | UNKNOWN (verificar antes del 14-oct) |
| 14 | «Codex verifica a la madre; no hay madre 2 abierta» (l.283-284) | 283 | Choca con la nueva madre de marketing (dos madres) | DESACTUALIZADO |
| 15 | «Codex NO commitea» y «la madre commitea» (l.314-316) | 314-316 | Coincide con el encargo (Codex no hace git) | OK |
| 16 | Modelos: `gpt-6.1-sol` por defecto; `gpt-6-astra` para riesgo (l.289) | 289 | Coincide con el encargo (Sol por defecto, Astra para seguridad/plata/riesgo) | OK, falta mencionar Luna para mecanico |
| 17 | «Cola de contratos» (ausente) | - | Cola nueva: `hermes-content/docs/handoff/codex-tareas/` (12 archivos, README y _PLANTILLA nuevos) | FALTA en el skill |
| 18 | Codex en la nube: entorno `6abad6a0aae081919f0b315818becb21` (l.221) | 221 | Coincide con el encargo | OK |
| 19 | Entorno Hermes `6abad782eba0819196ca234dc3abc327` (l.222) | 222 | Sin verificar | UNKNOWN |
| 20 | Cupo Codex: «reserva del 20 %, con 80 % no se lanza» (l.293-294) | 293-294 | Encargo: 58 % al 11-oct, reinicio 14-oct. `scripts/codex-cupo.mjs` existe (nuevo, sin commit) | PARCIAL: el umbral sigue; falta apuntar al script nuevo |
| 21 | Gasto: «Codex falla con menos de 1 GiB libre» (l.271) | 271 | No medido aqui | UNKNOWN |
| 22 | Frontmatter `description` dice «Ids historicos a verificar» (l.3) | 3 | Ya marcado | OK |
| 23 | Referencias: `handoff/madre-local.md` (l.8) | 8 | Existe (cita en 36, 150, 175, 362) | OK |
| 24 | Dato de tokens (l.178-194) «medido el 3-oct» | 178-194 | Historico | Mantener como antecedente |
| 25 | Entornos de la nube: Onia, onia-higgsfield, Default (l.118-122) | 118-122 | Coincide con el contexto | OK |
| 26 | Ronda: «La madre revisa cada 20 min... verificador Haiku disponible» (l.112) | 112 | Encargo: LLM por rol Haiku/Sonnet/Opus; subagentes con model explicito | OK, falta nombrar roles (ver punto 4 de la propuesta) |
| 27 | Plan de madres y «Madre NO se muda a la nube» (l.21-23) | 21-23 | Sigue valido | OK |

Resumen: 4 datos caducos con certeza (una madre, madre verificadora unica, RemoteTrigger en subagente, falta cola `codex-tareas`), 2 pendientes de verificar (version de Codex app/0.139, aviso del 14-oct), y el resto son ids coherentes con el contexto vivo.

## Brecha

1. El skill dice «una sola madre» y «Codex verifica a una madre». Hoy hay dos madres locales por area. Quien lea el skill elige mal.
2. Dice que un subagente no tiene RemoteTrigger. Eso bloquea una capacidad que existe. Falso con la medicion del 11-oct.
3. La tabla de sesiones no indica latido, entorno ni madre que ordena cada sesion. Con dos madres eso es necesario.
4. Falta la cola de contratos Codex (`hermes-content/docs/handoff/codex-tareas/`) y el script de cupo (`scripts/codex-cupo.mjs`). Ambos son nuevos y no estan en el skill.
5. La version de Codex y el umbral de cupo quedaron sin fecha ni fuente.
6. La cadencia de 20 min se repite en tres lugares, con dos mecanismos distintos (CronCreate de la madre y el Programador de tareas propuesto en P02). El skill no dice cual vale.
7. La seccion «Histórico: madre v2 revisora» y «Cómo se manda» tienen mediciones de agosto a octubre sin marca de vigencia clara.

## Configuracion propuesta

Diff exacto sobre `.claude/skills/onia-sesion-madre/SKILL.md`. Reemplazos de texto (cada bloque va en lugar del texto original indicado):

**(a) Reemplazar lineas 12-20 (la madre unica):**

```
- **Hay DOS madres locales en la PC de Sergio Urcullo, una por area** (reparto del 11-oct-2026):
  - **MADRE DESARROLLO-INFRA**: ordena las nubes Plataforma y Hermes-Jarvis (QA), mas VPS, infra y harness.
  - **MADRE MARKETING**: ordena Lucia, Marca personal, Ventas y pauta.
  Cada madre ordena solo a sus sesiones. Lo que una sesion necesite de la otra area se le pide a su madre,
  no a la otra madre. Las dos comparten la PC: el navegador con el login de Sergio Urcullo se usa en serie.
  Lo largo (render, build, medicion de disco) va a un subagente de fondo de la madre que lo necesite.
```

**(b) Reemplazar linea 84 (vigencia de la tabla) con:**

```
Tabla vigente al 11-oct-2026 (ids confirmados con el contexto del encargo; verificar con ListAgents antes de enviar):
| Sesion | id nube | Latido | Ordena |
|---|---|---|---|
| Plataforma | session_01HhnFgkeF6nLGvjrfjt1o2C | trig_01XVX9kgMExkapoN5XDdamx4 :17 | Madre desarrollo-infra |
| Hermes-Jarvis | session_01SQ7cvuDX5w5jDHk5VdhAEo | trig_01A9hCX7s5ZuaQ24TkK3Rr8d :57 | Madre desarrollo-infra |
| Lucia | session_01XSzFcs1k18ijqjSHGjnzD4 | trig_013YP8Nxhwi8HbdufMuv2Var :47 | Madre marketing |
| Marca personal | session_01WPecmppa9uZEc4fJDjSmaS | trig_01ExDbhoaxaXpzpvj26DEeQ8 :27 | Madre marketing |
| Ventas y pauta | session_0143C5fMXVs8eWEf7uBpC9SF | sin latido (entorno Default) | Madre marketing |
```

**(c) Reemplazar lineas 105-106 (RemoteTrigger en subagentes):**

```
- Un subagente de la madre SI puede cargar `RemoteTrigger` (ToolSearch `select:RemoteTrigger`) y leer el log
  de una sesion nube con `get_run_log` (medido el 11-oct 05:10 UTC, Haiku, 200 eventos). Los permisos siguen
  siendo solo list/get/list_runs/get_run_log; create, update y run quedan para la madre.
```

**(d) Agregar debajo de la linea 112 (ronda):**

```
La ronda la hace cada madre sobre sus sesiones, con roles por modelo: Haiku cuenta y verifica, Sonnet
sintetiza, Opus solo lo ambiguo o riesgoso. Los latidos de las nubes (:17, :27, :47, :57) son de cada sesion;
no los reemplaza la ronda. Mecanismo de la madre: CronCreate `7,27,47 * * * *`, vence a los 7 dias.
Pendiente de decision de Sergio Urcullo: si el Programador de tareas de Windows (P02) toma la parte mecanica.
```

**(e) Reemplazar linea 283 (Codex verifica a una madre):**

```
- **Codex no tiene madre propia.** Cada madre le manda trabajo cerrado con
  `scripts/codex-tarea.sh` (Sol por defecto, Astra para seguridad, cobros o riesgo, Luna para mecanico).
  Cola de contratos: `hermes-content/docs/handoff/codex-tareas/` (README y `_PLANTILLA.md`).
  Antes de lanzar, la madre revisa cupo con `scripts/codex-cupo.mjs` (corte 80 %; hoy ~58 %, reinicio 14-oct 03:57 UTC).
```

**(f) Reemplazar linea 230 (version):**

```
- **Codex local:** CLI npm `codex-cli 0.161.0` (`codex --version`, verificado el 11-oct). Cualquier otra version se
  mide antes de usarla. El aviso de retiro de gpt-5.5 (14-oct) se verifica antes de esa fecha, no se supone.
```

**(g) Agregar al inicio de la seccion «Cómo se manda» una nota:**

```
Los ids de esta tabla son HISTORICOS salvo que la tabla vigente de (b) los confirme. Antes de enviar: ListAgents.
```

## Quién la aplica

- **Madre desarrollo-infra** (aplica a): bloques (a), (b) sus filas Plataforma y Hermes-Jarvis, (c), (d), (e), (f). Es la madre que edita el skill, porque la skill es de la madre de desarrollo y el harness queda en su area.
- **Madre marketing**: solo la fila Lucia, Marca y Ventas del bloque (b) y su rol en (d). Lo revisa antes de su siguiente ronda.
- **Sesion Plataforma (nube)** no edita la skill: si detecta un dato caduco, lo avisa por su transcript.
- **Sergio Urcullo**: decide la cadencia final (cron de madre vs Programador de tareas, P02) y confirma el corte de cupo al 80 %. Son decisiones de proceso, no tecnicas.
- **Integrador**: merge a `main` del PR que toca el skill. No hay codigo, solo docs; revisa que `onia-router` y `equipo-de-agentes` no contradigan el cambio (ambos citan esta skill).

## Prueba de hecho

1. `grep -n "una sola madre\|UNA sola madre\|NO tiene \`RemoteTrigger\`\|Codex verifica a la madre" .claude/skills/onia-sesion-madre/SKILL.md` no devuelve nada.
2. `grep -n "MADRE DESARROLLO-INFRA\|MADRE MARKETING" .claude/skills/onia-sesion-madre/SKILL.md` devuelve al menos 2 lineas.
3. Cada id de la tabla vigente aparece en `ListAgents` con su nombre actual. Si falta uno, se marca como no vivo en la tabla.
4. Un subagente Haiku de prueba carga `RemoteTrigger` con ToolSearch y devuelve `get_run_log` de una sesion. Con eso queda cerrado el punto 10.
5. `codex --version` devuelve `codex-cli 0.161.0` en la PC, igual que la linea (f).
6. El skill aparece en `onia-router` y `equipo-de-agentes` sin contradiccion (grep de «una sola madre» en esos dos archivos devuelve vacio o queda corregido).
