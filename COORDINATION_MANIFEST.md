# Hermes Coordination Manifest

## Autoridad y uso

Hermes planifica; `scripts/orquesta/` reparte la cola canónica. `AGENTS.md`, `CLAUDE.md` §«Quién orquesta» y `scripts/orquesta/README.md` fijan el método. Este archivo registra **propiedad y alcance**, no crea permisos ni tareas.

Consultar el handoff del carril y el runtime antes de usar una sesión. Un worktree, un Run, un mensaje enviado o una fila antigua no prueban agente activo. No reactivar IDs, triggers, loops o autorizaciones históricas.

## Revisión vigente · 25-oct-2026

Encargo actual: auditar y conciliar los 27 pendientes/entregas de la sesión, terminar lo autorizado y distinguir aprobaciones/bloqueos sin cierres ficticios. Incluye corregir las entradas del repo, ordenar fuentes empresa/marca y conservar los seis materiales enviados de Anunciante Supremo; lectura semanal de repos sin instalar. Responsable general: esta sesión Hermes con Sergio Urcullo. Revisores: encargos acotados; no otra coordinación ni producción.

| Frente | Propiedad / ubicación | Estado y límite |
|---|---|---|
| Reglas/harness | Raíz `C:/dev/proyectos/onia-hermes`, skills ONIA de proceso e informes de auditoría | Cambios locales revisados y reversibles; sin Git/publicación ni cambios de permisos/hooks por reflejo |
| Marca personal | `C:/Users/PC/orca/workspaces/onia-hermes/marca-personal-20261024` | Espacio preparado; confirmar runtime antes de asignar trabajo |
| Workshop, hijo de marca | `C:/Users/PC/orca/workspaces/onia-hermes/iman-workshop-20261022` | Conserva entregas anteriores; siete guiones revisados técnicamente pero rechazados editorialmente |
| Startup Onia Platform | `C:/Users/PC/orca/workspaces/onia-platform/startup-onia-20261024` | Base/worktree preparado, no hereda WIP de `C:/dev/proyectos/onia-platform` |

Contratos y decisiones de esos espacios: `hermes-content/docs/handoff/SESIONES_LOCALES_20261024.md`. Sus handles fechados no se tratan como inventario vivo. Este registro no reanuda por sí mismo esos frentes.

## Antes de editar o delegar

### Continuación vigente: infraestructura antes de producción de los carriles

Hermes `20261025_170250_33fabc` ejecuta el contrato INF-01 a INF-07 en `.hermes/plans/puesta-en-orden-hermes.md`. Ese contrato reemplaza el piloto sintético cancelado; no reactiva los encargos históricos. Sergio revisará tareas y referentes antes de lanzar contenido o producto. Sin commit/push/deploy, instalaciones, gasto ni nuevas conexiones; cupo total dos ejecutores.

Cambios propios de esta preparación: entrada `AGENTS.md` y retirada exclusiva de Stop auto-sync en `.claude/settings.json` del worktree `marca-personal-20261024` (respaldos en jobs/harness-readiness-20261025/brand-preparation-backups); regla crítica añadida a AGENTS del workshop; plan canónico actualizado. WIP restante conservado. Las sesiones nativas de solo lectura Opus5.5/Startup y Sonnet5.5/contenido finalizaron sin producto; recibos y trazas en `C:/Users/PC/AppData/Local/hermes/jobs/harness-readiness-20261025/`.

Orca: Run existente `run_66e1d03c2397` vinculado a `term_91515484-d46b-4425-99ca-63d53506d5ac`, generación4, readback correcto. Su objetivo histórico no autoriza reactivar producción. `task_bde09537b245` / `gate_e7da503b8382` es exclusivamente comprobación humana de avisos móviles, sin worker productivo ni permiso de lanzamiento. La entrega/respuesta móvil sigue sin probar. Revisión final independiente INF-07 en curso; no declarar infraestructura completa antes de resolver sus criterios o registrar bloqueos.

### Ajuste de harness local autorizado, sin reanudar producción

Sergio pausó la otra sesión para configurar y probar el harness. La sesión Hermes `20261025_170250_33fabc` asume únicamente `.claude/settings.json` del checkout raíz (rama `main`, delta local revisado, sin commit), `.claude/settings.json` y `AGENTS.md` del workshop (rama `oninteligenciaartificial/iman-workshop-20261022`): retirar Stop auto-sync y alinear la entrada con AGENTS canónico actual. Los tres destinos estaban limpios y se respaldaron. El desarrollo, entregables y WIP restantes conservan su dueño. No se reactivan los 27 pendientes.

Settings nativos Hermes/Claude/Codex y pruebas aisladas: `C:/Users/PC/AppData/Local/hermes/jobs/harness-readiness-20261025/PRUEBAS-VERIFICADAS.md`. La revisión de configuración no prueba recarga de conversaciones abiertas. Antes de otro despacho, contrastar las reglas del worktree con la entrada canónica actual; no asumir que un cambio sin commit en la raíz se propagó.

Estado de ese ajuste: aplicado y verificado localmente; Stop auto-sync retirado en los dos settings, AGENTS del workshop alineado con respaldo. 19 comprobaciones ad hoc (incluyen 23 unittest) y 19 tests docs-hygiene aprobados; diff-check sin errores. Sin commit/push ni reanudación de las tareas pausadas. La propiedad temporal de esos archivos queda liberada; los dueños pueden retomarlos tras leer el estado y verificar recarga nativa.

1. Confirmar repo, rama, worktree, WIP y dueño de archivos. No tocar trabajo de otra sesión sin coordinar.
2. Buscar fuente canónica y handoff del carril; encargo con salida, permisos, prueba y parada.
3. Tareas independientes pueden correr en paralelo dentro del cupo; las que comparten archivos/servicios se serializan. Revisiones de lectura no exigen otro worktree.
4. Infra, base, n8n/Chatwoot y puertos tienen un dueño a la vez: comprobar el turno antes de operar. No cerrar apps personales, aumentar permisos ni detener procesos ajenos para facilitar una tarea.

## Al entregar, pausar o relevar

- Actualizar el estado vigente, no solo agregar una nota que contradiga «en curso». Separar preparado/enviado/consumido/ejecutado/verificado/aceptado.
- Conservar artefactos, pruebas, intentos fallidos, procesos y siguiente acción en el handoff canónico. Un bloqueo no borra otros pendientes.
- Gates y Git siguen el contrato y AGENTS/CLAUDE. No usar auto-sync/Stop como aprobación; no dejar conflictos. No hacer `--union` en colas/handoffs ni reabrir hechos desde copias viejas.
- Secretos solo mediante el mecanismo autorizado, nunca en docs/logs/Git. La historia sobre tokens expuestos exige su verificación/rotación autorizada; no demuestra acceso ni permiso actual.

## Historia accesible, no contexto obligatorio

El contenido previo completo se conserva en `hermes-content/docs/historial/coordination-manifest-hasta-20261025.md`. Incluye «EL HILO», carriles de junio–septiembre, inventarios fechados, canales y antecedentes. Consultarlo solo para recuperar un dato histórico pertinente; **no son sesiones vivas ni instrucciones para iniciar loops**.
