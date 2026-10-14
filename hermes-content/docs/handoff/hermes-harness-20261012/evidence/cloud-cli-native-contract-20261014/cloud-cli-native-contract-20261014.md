# Codex Cloud CLI vs app nativo — contrato comprobado

Fecha: 2026-10-14 · alcance: solo fuentes públicas oficiales, tag `rust-v0.161.0`.

## Hallazgo

`codex cloud` es una interfaz cliente para tareas de Codex Cloud, no prueba que trabaje sobre las cinco tareas existentes del Codex desktop. Su `exec` crea una tarea contra un environment y devuelve su URL; `list --json` enumera IDs/URLs del backend de tareas. El código no demuestra mapeo entre esos IDs y los UUID visibles en Codex desktop. No deducirlo por prefijos o forma del UUID.

## Contrato observado

- CLI: `exec QUERY --env ENV_ID [--attempts 1..4] [--branch BRANCH]`; también admite prompt por stdin. Sin `--branch`, resuelve rama actual, luego default y finalmente `main`.
- `exec` inicia backend, resuelve ambiente por ID exacto o etiqueta visible no ambigua, crea la tarea con `qa_mode=false` y obtiene URL desde el ID de respuesta.
- `codex cloud` sin subcomando abre el selector TUI de environments. `list` tiene filtro `--env`, límite/cursor y `--json`; JSON da `id`, `url`, título, estado, fecha, environment ID/label, resumen, review y total de intentos.
- El código revisado no declara campos de modelo, sandbox, límite temporal, token budget, retry o idempotency en `ExecCommand`; `attempts` es best-of-N (1 por defecto, hasta 4), no retry documentado. Esto describe este CLI/tag, no todas las superficies Cloud.
- Tareas CLI construyen URLs `/codex/tasks/{task_id}` sobre el backend base. URL/ruta compartida aún no establece identidad con la UI nativa.

## Correlación y prueba mínima segura

No se probó sesión ni backend en vivo. Primero, solo en la UI nativa ya abierta, obtener de una tarea existente su URL exacta/campo ID y environment visible. Comparar el ID literal (sin transformar) con `codex cloud list --json` de la cuenta existente, y verificar URL/estado/environment. Si no aparece el mismo ID o el ambiente, declarar sin correlación; no crear tarea de prueba. La prueba CLI sería lectura/listado y quedó fuera de este encargo documental.

Para acreditar igualdad de cuenta/entorno hacen falta la misma cuenta autenticada comprobable y el mismo environment ID/label asociado a la tarea; la metadata local cacheada o un UUID no bastan. Evitar `exec` en la correlación: el contrato mostrado crea una Codex Cloud task; su relación con los UUID de la UI nativa sigue UNKNOWN. El código no demuestra que sea una tarea ChatGPT Work.

## Evidencia primaria (tag fijo)

- [cloud-tasks/src/lib.rs, tag rust-v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cloud-tasks/src/lib.rs): exec, environment resolution, list JSON, TUI.
- [cloud-tasks/src/cli.rs, tag rust-v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cloud-tasks/src/cli.rs): commands, flags and best-of-N.
- [cloud-tasks/src/util.rs, tag rust-v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cloud-tasks/src/util.rs): task URL construction.
- [cloud-tasks-client/src/api.rs, tag rust-v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cloud-tasks-client/src/api.rs): backend client contract.
- [cloud-tasks/src/env_detect.rs, tag rust-v0.161.0](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cloud-tasks/src/env_detect.rs): environment discovery.

## Estado de la prueba

La revisión inicial del tag `rust-v0.161.0` fue documental. Revalidación local de solo lectura el 2026-10-14: CLI instalado `codex-cli 0.161.0`; `codex cloud list --limit 10 --json` devolvió `tasks: []`, `cursor: null`. **Delta posterior:** el 14-oct, una única invocación `codex cloud exec` con prompt read-only y `--attempts 1` creó `task_e_6acfabf62b9c8327b796306ed2d62e07` en el entorno etiquetado `ONIA Hermes — revisión y desarrollo`; `codex cloud list --env 6abad782eba0819196ca234dc3abc327` la devolvió `PENDING`, `environment_id:null`, `attempt_total:1`, cero archivos modificados, y después `[READY]`. La UI mostró su salida bajo `chatgpt.com/remote/task_e_6acfabf62b9c8327b796306ed2d62e07`: raíz `/workspace/onia-hermes`, rama de ejecución `work`, SHA `6cc89c20e60184eff65117abff4c5a4ea1f8afde`, `origin` ausente. El prompt paró al diferir el nombre de rama esperado; por esa parada no inspeccionó el lector ni campos de contexto. Resultado: creación, visibilidad en la UI y ejecución del comando de identificación confirmadas; auditoría de contexto incompleta por la parada. Este handle no se reenvió; la auditoría separada del lector tiene su propio registro en `codex-cloud-pc-20261011.md`.

Esta tarea no prueba igualdad con UUID de chat Codex desktop ni una sesión sucesora con transferencia de ownership. El resultado inicial vacío sólo correspondía al momento/contexto de esa consulta; ninguno de estos resultados permite inferir incompatibilidad o equivalencia de IDs entre superficies.

En la misma instalación, `codex app-server generate-json-schema --experimental` emitió el protocolo a una carpeta temporal. Se observaron `thread/start`, `turn/start`, `environment/add`, `environment/info` y `environment/status`. `environment/add` requiere un `environmentId` y `execServerUrl`, y opcionalmente bearer token; permite asociar un executor remoto ya identificado, no descubrir ni crear por sí solo una tarea del catálogo nativo Cloud. El protocolo no expone un método con nombre `cloud/task/create` ni `cloud/tasks/list`. La API `app-server` documenta el lifecycle de hilos/turnos, pero no acredita que esos IDs sean los UUID de Codex desktop.

La ruta oficial de `app-server` con Sign in with ChatGPT excluye native computer use; la documentación vigente lista esa herramienta entre las no soportadas en esa configuración ([limitaciones](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)). La vía documentada que sí opera un navegador alojado y devuelve screenshots es Agents API Computer Use ([guía](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use)); requiere una API key, facturación API y aprobación por origen. Es una alternativa separada, no sustituto autorizado del requisito Cloud nativo.

No se construyó un orquestador alternativo ni se inició hilo, turno, executor, sesión Agents API o gasto. Próxima correlación útil, si vuelve a haber una tarea nativa existente accesible: comparar en modo lectura su URL/ID/env exactos con `codex cloud list`; no crear una tarea de prueba para forzar coincidencia.

## Delta de aprobación y gate de navegador — 2026-10-14

Sergio autorizó un segundo intento único de navegador Cloud para `https://example.com` → IANA, UID 1000, JPEG en el workspace Cloud y límite 75+2 s, sin instalación, cuentas, cookies, reintentos ni gasto adicional. La autorización está vigente; no se pidió de nuevo.

**Corregido: atribución al environment CLI no probada.** El preflight citado describe el runtime duradero `/workspace`: egress `restricted/enforced` denegó `example.com` e `iana.org`, `unshare --user --map-root-user true` terminó con código 1 y `/usr/lib/chromium/chrome-sandbox` tenía UID/GID 65534. El recibo QA del primer intento duradero acredita aborto SUID y fallo Crashpad. Estas pruebas no identifican el environment CLI `6abad782eba0819196ca234dc3abc327`; allí sandbox/egress siguen `UNKNOWN`. No se cambió el sandbox ni se usó `--no-sandbox`. Directorios privados propios pueden atender la escritura de Crashpad, pero no prueban resolver el sandbox.

**Resultado corregido: segundo lanzamiento aún no ejecutado.** No se abrió navegador ni se navegó y el nonce nuevo no se consumió; no hay JPEG. El gate duradero citado no puede trasladarse al executor CLI. La tarea de auditoría independiente `task_e_6acfae6a1ca48327a4022d331f4e0efe` figuraba `PENDING` a `2026-10-14T16:39Z` (snapshot histórico; véase READY posterior), sin diff y con un único intento; no se duplicó. La siguiente tarea browser, de propósito distinto, debe comprobar en su propio executor egress para los hosts del contrato y sandbox bajo UID1000 antes de una navegación, sin cambiar políticas ni eludir aislamiento. La autorización del segundo intento sigue vigente.

### Corrección de alcance y resultado de segunda auditoría — 2026-10-14, ~16:40Z

La evidencia de egress restringido, `unshare` fallido y helper Chromium con propietario UID/GID 65534 proviene de una sesión duradera en `/workspace` (también reportada como `/workspace/work`), **no** de la ejecución CLI cuyo checkout fue `/workspace/onia-hermes`. No demuestra que ambos usen el mismo environment. Por tanto, el bloqueo de sandbox/egress queda verificado solo para el runtime duradero; sandbox y egress del environment CLI siguen `UNKNOWN`. La autorización para un segundo intento único sigue vigente y su nonce no se consumió.

La tarea CLI `task_e_6acfae6a1ca48327a4022d331f4e0efe` quedó `READY`, `updatedAt=2026-10-14T16:40:08.531702Z`, con un intento y cero cambios. La salida de solo lectura reporta `/root` como directorio, repo `onia-hermes`, HEAD `8f8acee9c9fded45dcbd39d5c4d1d6345d4fd256`, rama `work` y remoto `origin` ausente/`UNKNOWN`. El lector `desktop_context_meter.py` fue consultado: `U_activo`, remaining y utilization son `null` intencionales; `W=model_context_window`; `last_token_usage` expone cuatro campos proxy; la validación descrita es de sesión/ruta/archivo estable. Compactación aparece como señal de checkpoint separada, no como sesión limpia ni ACK.

El modelo de la tarea quedó configurado por CLI como `gpt-6-luna`, low. La salida atribuye al worker mecánico la autoidentificación “GPT-5.6 Sol”, sin ID/runtime que confirme modelo servido; QA queda `UNKNOWN`. La salida reporta dos agentes internos con ACK (`/root/mapeo_mecanico` y `/root/qa_independiente`), pero los IDs opacos no se expusieron y no se inspeccionaron sus mensajes: es reporte del worker, no verificación independiente de los agentes. La auditoría reporta cero pruebas, ediciones, red o uso de browser. No equivale a sesión limpia, lectura de `U_activo`, ACK de transferencia ni cierre del ciclo autónomo.
