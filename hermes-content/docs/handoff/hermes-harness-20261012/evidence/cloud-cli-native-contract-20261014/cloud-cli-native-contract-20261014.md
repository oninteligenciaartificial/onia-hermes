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

Documental completada. Sin CLI, login, llamadas de red/backend, modelo, creación de tareas, instalación ni API privada. No se construyó orquestador alternativo. La equivalencia CLI ↔ Codex desktop sigue sin probarse; una correlación exacta de solo lectura es el siguiente paso posible.
