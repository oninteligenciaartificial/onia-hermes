# QA independiente — entrada nativa, ronda 2 — 2026-10-14

Veredicto: PASS limitado a las tres correcciones y suite offline. Sustituye NEEDS_INTEGRATION_FIX anterior.
Worktree: E:/onia-wt/native-event-intake-20261014; base 5e8cb7c7bda3de50ce2b350d84615d4036eb7bb8.
Fuentes bajo hermes-content/docs/handoff/hermes-harness-20261012/:
- native_work_entrypoint.py SHA256 5B304AE0B77C30BDE16EA97EEEA79F4C469869718B9645F7980FC2DCBEEE182C
- test_native_work_entrypoint.py SHA256 421D690C42951A387EC0E989C67BB7F5ECD8BB8E3CD8F936F8A49CD0594744A5
Ambos hashes comprobados y coincidentes con freeze de Root.

## Correcciones verificadas
1. Exception durante step devuelve needs_reconcile/dispatch_outcome_unknown/retry=forbidden, sin texto de excepción; no repite despacho. Salida ausente, estado no admitido o identidad discordante también es ambigua, no HOLD exitoso.
2. provider_status conserva enum pública normalizada pending/running/ready/failed/cancelled/unknown, compatible por lectura con NativeCloudCLI.status. READY no implica QA ni cierre; retry=forbidden se conserva.
3. result exige sink.store callable antes de invocar step. El bundle awaiting_independent_qa debe coincidir en operation_id, input_sha y conjunto exacto de paths; metadatos sha256/bytes/json tienen tipos comprobados.
El bundle completo se serializa una vez en bytes JSON canónicos y se entrega una vez al sink, con operation_id y request digest. Se comprueba ACK de SHA256, longitud y ref opaca sin traversal. Respuesta pública añade digest/ref y omite files.
Fallo de sink/ACK/serialización produce reconciliación sin retry ni segunda lectura; no demuestra persistencia exitosa.
Las estructuras files/sha256/bytes/json y estado de collect_result actual son compatibles por lectura focal del productor.
No nuevo hallazgo bloqueante concreto en el delta revisado.

## Validación ejecutada una vez
python -B -m unittest discover -s hermes-content/docs/handoff/hermes-harness-20261012 -p test_native_work_entrypoint.py -v
18/18 PASS, 0 fallos/errores, duración unittest 0.015 s, exit 0.
Inspección previa: step simulado con mocks; sink de prueba escribe y relee un archivo real dentro de TemporaryDirectory, eliminado al salir. Sin DB ni proveedor.
Fixture verifica igualdad exacta de bytes canónicos completos, digest/ref devueltos, binding op/request y una sola llamada al step/sink.
Otros nuevos fixtures prueban ausencia de sink antes del step, fallo de sink sin retry, operación discordante, READY sin QA y excepción después de marcador de posible efecto.
No se repitieron otras suites.

## Límites explícitos
PASS de harness offline, no integración viva con step/queue/bridge, Cloud o VPS. Caps persistidas y autenticidad de autoridad no se ejercitan con cola real aquí.
ACK del callback no prueba durabilidad de un sink operativo; el sink real del conector VPS sigue sin implementar. El archivo temporal demuestra únicamente almacenamiento de prueba.
No es QA del contenido de artifacts: conservar bundle y comprobar identidad externa no verifica semántica ni acredita el resultado del objetivo.
Runtime y sink son bindings internos confiables; no son sandbox de código Python arbitrario. No se prueban recuperación tras crash, fsync ni disponibilidad de almacenamiento real.
Sin SSH, Telegram, navegador, proveedor, instalación, despliegue o realqueue; sin cambios de fuente/index/commits. Única escritura persistente propia: este informe público fuera Git.
