# QA alternativa CLI — 12-oct-2026

Agente /root/qa_independiente; modelo solicitado gpt-6.1-sol, servido no observable. Contrato solo lectura: CLI ya instalada/help/list con autenticación existente; sin login, cache auth, secretos, instalación, nuevo exec/task ni scheduler.

## Comandos y evidencia propia

- command -v codex: exit0, /opt/codex/bin/codex.
- codex --help: exit0; subcomando cloud documentado para navegar tasks Codex Cloud. Warning accesorio: could not create PATH aliases, Read-only file system (os error30).
- codex cloud list --help: exit0; sintaxis confirmada codex cloud list [OPTIONS], --json, --limit N (1-20), --cursor y --env disponibles.
- codex cloud list --json --limit20 (espaciado real --limit 20): exit1, chunk5f50e0. Error http list_tasks failed, error sending request al endpoint oficial https://chatgpt.com/backend-api/wham/tasks/list?limit=20&task_filter=current. No cuerpo HTTP/status/auth devuelto.
- Mismo comando mediante permiso soportado de red por comando, sandbox_permissions with_additional_permissions y network.enabled true: exit1, chunk52bf31; mismo error. Proxy/TLS intactos. No bypass, token ni config alterada.

No inventario JSON recibido; por tanto no estados ni IDs de task observados. Error de envío no permite concluir login ausente, token inválido o cuenta específica. No inspección de caches/credenciales ni login.

## Comparación exacta y gates

| Carril | UUID declarado madre | Match observado CLI |
|---|---|---|
| Platform | 01a12c7e-97e2-7115-8561-0b7658008003 | No observable; list falló |
| Marca | 01a13170-b488-71d9-83f8-12663d5a0013 | No observable; list falló |
| Lucía | 01a13171-0fdb-72c6-9fdc-81244d7e6006 | No observable; list falló |
| Ventas | 01a13171-6ac1-771e-b285-52e7284e203a | No observable; list falló |
| Hermes | Thread UUID no inyectado | Comparación imposible sin ID fuente |

**read_gate BLOQUEADO:** CLI existe y ayuda confirma lectura, pero request list no devuelve respuesta incluso con red soportada por comando. No equiparar cloud task UUID con durable/thread UUID sin correspondencia documental y match exacto.

**wake_gate NO PROBADO/NO EJECUTADO:** lectura de list, aun si funcionara, no demostraría despertar workers/scheduler. Ningún create/exec/queue/run/login ejecutado. No recurrencia ni prueba laptop apagada.

Se agota alternativa autorizada sin wait/reintentos indefinidos ni investigar endpoints privados. Conservar piloto como recibo on-demand de metadatos declarados y UTC observado; no sondeo live de cinco workers. Entrega Git privada queda con fuentes_relevo para evitar duplicado.
