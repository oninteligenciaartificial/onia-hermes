# Supervisor cloud: inventario y QA — 12-oct-2026

META: comprobar supervisión de los cinco trabajadores Codex Cloud nativos con la PC apagada, sin gasto nuevo ni producción. PRUEBA DE HECHO: ejecución remota, lectura real de cinco estados y despertar remoto verificable. REGLA DE PARADA: capacidad ausente o consulta fallida; no instalar, contratar, mover secretos ni sustituir Codex por Work.

Hermes QA es dueño del piloto; este archivo conserva la revisión de arquitectura y el inventario de herramientas. No cambia continuidad, producto ni servicios.

## Resultado observado

| Gate | Resultado | Evidencia |
|---|---|---|
| Ejecutar código en runtime cloud existente | PASS, bajo demanda | `python /workspace/work/supervisor-pilot/probe.py`, exit 0; UTC 2026-10-12T19:04:52.437366+00:00 |
| Leer estados actuales de cinco trabajadores | BLOQUEADO | Runtime sin `read_thread`, `list_threads`, `wait_threads`; cinco estados `not_observable` |
| Despertar supervisor/trabajadores sin laptop | NO PROBADO | `scheduler_dispatch:false`; no scheduler creado ni despacho remoto autónomo |

Recibo inicial JSON SHA256: `3f28a920d9bc9af7b1c639c3eed87e02b7d91ee673b40fa62757bdbe644f517d`. Runtime declarado por observación de entorno: `ccarenv_b64_Y2NhcmVudl9jM2YzZjk3NTZkYmM4MTkxYTM3NTc0MDgwMTNiYTIzNQ`. Turno externo observable desde madre: `01a1317f-b0f1-7596-a524-f487219d4c04`; el runtime no inyectó su thread/turn ID. IDs suministrados por contrato no son lectura live. No se verificó físicamente apagar la laptop.

Hermes preservó recibo, fuente e informe con QA en rama privada `codex/supervisor-pilot-20261012`, commit `3ff6b10cf76a09e1c7ad808865dea043ced39a28`, carpeta `hermes-content/docs/handoff/supervisor-pilot-20261012/`. El addendum CLI posterior seguía en conservación al escribir esta revisión.

## Inventario verificado

- Herramientas app de madre local permiten inspeccionar chats; no se heredan automáticamente al runtime cloud. `automation_update` declara ejecución local: no cumple PC apagada.
- n8n conectado: búsqueda `ONIA` devolvió 41 workflows; búsqueda `supervisor` y `sesion`, cero. Gateway administrado `available:false`. No se creó ni ejecutó workflow.
- `WF-SENTRY-01 - Sentry Codex Triage`, ID `wImYWwbHGVK5tvIA`, activo, siete nodos: webhook, normalización, condición, creación de issue GitHub, respuestas. Su nombre no demuestra API de chats Codex; no tiene puente probado de lectura/despertar.
- `ONIA - Disparador de Agentes (panel)`, ID `fek4OoxRlNfpD6GZ`, usa SSH/scripts del panel; no acredita control de estos UUID Codex nativos. Workflows activos de producción quedan fuera del piloto.
- Pages controller automation requiere Page/controlador y es otro producto. Sites schedule requiere Site publicado. Ninguno acredita supervisión nativa Codex; no fueron activados.
- `create_thread` expuesto ofrece local/worktree o `chatgptWorkCloud`; esta última opción fue rechazada por Sergio como sustituto. No se crearon trabajadores duplicados.

## Última alternativa CLI: resultado real

QA Hermes encontró `/opt/codex/bin/codex`. `codex --help` y `codex cloud list --help` salieron 0 y confirmaron `--json --limit 20`. La consulta salió 1: `http list_tasks failed, error sending request`. Repetida con permiso adicional de red soportado por el runtime cloud: mismo fallo. No se recibió HTTP status/body ni JSON de tareas. Esto no demuestra credencial faltante, login caducado o compatibilidad con los cinco UUID; no se inspeccionó authcache ni se inició login.

Evidencia remota: `/workspace/work/supervisor-readonly/output/qa-cli-alternativa.md`. La [referencia oficial de comandos](https://learn.chatgpt.com/docs/developer-commands) documenta `codex cloud list`; no equivale a demostrar que observe/controla estos chats nativos.

## Siguiente componente concreto

Falta una interfaz soportada y autenticada en runtime remoto que lea exactamente los cinco UUID y permita continuar/despertar sus turnos. n8n ya ofrece un lugar para scheduler, pero sin ese puente no puede cumplir el contrato. Primero resolver la consulta CLI y comprobar coincidencia de IDs sin copiar sesiones ni inventar endpoints; luego validar un único despertar remoto. No hace falta pedir aprobación genérica ni una nueva credencial sin diagnóstico.

No se provisionó servicio/API paga, instalaron dependencias o modificaron producción. Los turnos consumen cuota/tokens existentes: no se afirma costo total cero. No quedaron scheduler ni procesos de fondo nuevos; se conservan únicamente artefactos de auditoría. Resultado del supervisor autónomo: `capability_missing`, no operativo 24/7.

## Preservación local de esta revisión

El checkout aislado administrado `supervisor-inventory-20261012` falló por `No space left on device` (operación `71358c73-6a96-4fda-b296-76dccd4c86e4`). No se reintentó ni borró información. Este archivo único se guarda en el worktree de auditoría ya existente de la madre, rama `codex/cloud-pc-audit-20261011`; no se editó main ni archivos de continuidad compartidos.
