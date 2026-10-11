# C05 - Codex cloud: lanzar y aplicar desde la madre (11-oct-2026)

## Estado medido
| Hecho | Evidencia |
|---|---|
| CLI tiene `codex cloud` (EXPERIMENTAL) | `codex --version` = codex-cli 0.161.0; `codex cloud --help` lista `exec, status, list, apply, diff` |
| `exec` | `codex cloud exec --env <ENV_ID> [--attempts N] [--branch B] [-c k=v] "<prompt>"`. `--env` obligatorio; `--branch` por defecto = rama actual |
| `status/diff/apply` | `status <TASK_ID>`; `diff <TASK_ID> [--attempt N]`; `apply <TASK_ID> [--attempt N]` |
| `list` funciona | `timeout 30 codex cloud list --json` OK: `--env`, `--limit` (20), `--cursor`, `--json`. Devuelve 3 tareas en total |
| Tareas existentes | 10-oct 14:45 UTC `ready` "usted" Platform +66/-21 (8 arch.); 8-oct "acceptance record" Platform +164/-9 (6 arch.); 8-oct "Test git branch" Hermes, sin diff |
| Entornos | `list --json` da `environment_id: null` y solo la etiqueta. Labels vistos: "ONIA Platform - QA y desarrollo" y "ONIA Hermes - revision y desarrollo". IDs (skill onia-sesion-madre:221-222): Platform `6abad6a0aae081919f0b315818becb21`, Hermes `6abad782eba0819196ca234dc3abc327`. CLI no lista entornos; vigencia hoy de los IDs = UNKNOWN (no probado, requiere API con token) |
| Hermes cloud existe pero es inviable | Repo ~6 GB, setup `pnpm install`; prueba 8-oct quedo pending >12 min, READY ~20 min (onia-sesion-madre SKILL:224-226, 304) |
| Modelo NO se elige | 8-oct: `-c model="gpt-6-astra"` corrio con gpt-5.6-sol; verificable en `model_version` de `GET /wham/tasks/<task>` (SKILL:306-308). Docs oficiales (learn.chatgpt.com/docs/cloud, ex developers.openai.com/codex/cloud) no documentan `cloud exec`, ni el modelo, ni best-of-N por CLI: UNKNOWN |
| Hoy nada del repo automatiza cloud | grep `codex cloud` en scripts/*.sh: sin resultados; solo prosa en skills |

## Brecha
1. No hay script: cada lanzamiento es a mano; no hay registro de task_id/branch/costo/modelo observado.
2. Sin paralelismo definido: `exec` es de una tarea; N tareas = N llamadas, y no hay regla de tope ni de colision de archivos.
3. `list` no da `environment_id`: no se puede verificar que el entorno es el pedido; solo la etiqueta.
4. `apply` aplica al checkout actual; onia-platform tiene rutas largas (Windows) y `git worktree add` falla: hace falta la via por indice temporal (SKILL onia-sesion-madre, "Llevar un diff de Codex a onia-platform").
5. Modelo no garantizado: sin chequeo de `model_version`, una tarea que pedia Astra puede volver como Sol.
6. Cloud solo ve lo pusheado a GitHub: la rama debe existir en origin antes de `--branch`.

## Configuracion propuesta
Nuevo `scripts/codex-cloud.sh` (lo escribe la madre-dev; no se creo aqui). Procedimiento exacto:

```bash
# 0. Pre-vuelo (madre): cupo semanal (reinicia 14-oct 03:57 UTC), rama pusheada, tarea cerrada y SIN secretos/archivos locales.
ENV=6abad6a0aae081919f0b315818becb21        # Platform. Hermes NO por cloud (6 GB).
BR=claude/<carril>-<tema>                    # debe existir en origin de onia-platform
git -C C:/dev/proyectos/onia-platform ls-remote --exit-code origin "$BR"

# 1. Lanzar N en paralelo (una rama/tarea; archivos disjuntos). Tope sugerido N<=4.
for t in B1 B3 K1 K2; do
  codex cloud exec --env "$ENV" --branch "$BR-$t" --attempts 1 "$(cat hermes-content/docs/handoff/codex-tareas/$t-*.md)" \
    | tee -a ~/.codex/madre-tareas/cloud-$(date +%F).log &    # guardar task_id, rama, hora
done; wait

# 2. Seguir
codex cloud list --env "$ENV" --limit 20 --json     # status: pending|ready|error
codex cloud status <TASK_ID>

# 3. Traer
codex cloud diff <TASK_ID> > /tmp/<T>.diff           # revisar alcance
#   en onia-platform SIN worktree: indice temporal (GIT_INDEX_FILE) + commit en rama claude/*; luego PR.
#   Solo `codex cloud apply <TASK_ID>` si hay checkout limpio de la rama correcta.
```
Reglas:
- Tras `ready`, la madre lee `model_version` de `GET https://chatgpt.com/backend-api/wham/tasks/<task>` (token de `~/.codex/auth.json`, sin imprimirlo). Si exige Astra y vino otro: descartar y relanzar por `scripts/codex-tarea.sh` local.
- Pasar `-c model=...` no sirve; no documentarlo como garantia.
- `--attempts >1` (best-of-N) solo para tareas ambiguas; consume mas cupo; elegir con `diff --attempt N`.
- La madre revisa el diff, corre la suite completa y abre PR; Codex no hace git ni mergea.
- Texto para SKILL onia-sesion-madre (reemplazar "El CLI 0.139 no elige modelo"): "CLI 0.161: `codex cloud exec|status|list|diff|apply`; modelo no elegible, verificar `model_version`."

## Quien la aplica
- **madre-dev**: escribe `scripts/codex-cloud.sh`, actualiza la skill y lanza/trae (es infra/harness y Plataforma es su nube).
- **Sesion Plataforma**: solo pushea la rama base y define tareas cerradas (sin lanzar).
- **Integrador**: mergea el PR resultante.
- **Sergio Urcullo**: solo si el entorno Platform cambio o caduco (se administra en chatgpt.com/codex/cloud/settings/environment).
- madre-marketing: no aplica (no usa cloud).

## Prueba de hecho
1. `bash scripts/codex-cloud.sh --dry-run` imprime los comandos y sale 0 sin crear tareas.
2. Tarea de prueba trivial en Platform: `codex cloud list --env $ENV --json` la muestra `ready` y `codex cloud diff <id>` devuelve diff no vacio.
3. Log `~/.codex/madre-tareas/cloud-<fecha>.log` registra task_id, rama, `model_version` observado.
4. PR en onia-platform con ese diff y CI/suite verde.
