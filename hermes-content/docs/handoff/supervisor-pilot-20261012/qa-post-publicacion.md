# QA post publicación — 12-oct-2026

Agente /root/qa_independiente; Sol6.1 solicitado, servido no observable. Publicación UI recibida explícitamente por madre. QA no duplica requests endpoint/cloudlist/curl ni crea tarea/wake/worker/scheduler.

## Estado efectivo comunicado por raíz

Post UI publicación: spec_revision12, observed_spec_revision12, observations_current=true y network_policy.state=enforced, effectivechatgpt=false; source_config_version_id conserva 62649aa4-3f3f-42dd-b063-2475cdc094a9~cecfgver_6acd2a3aefe88198b1ce9a7ecc43d3d3. Es snapshot herramienta leído por raíz, no sondeo independiente QA. La publicación UI no se niega: configuración publicada y runtime ligado son dimensiones distintas. Revisión12 actual/enforced no implica que sea sourceversion UI nueva o incluya chatgpt.com; la regla efectiva falta.

[Cloud environments oficial](https://learn.chatgpt.com/docs/environments/cloud-environments), Reuse and update saved state: reusable setup actualizado se publica/republica y usa en nuevas tareas; existentes conservan estado. Refresh automático repo conserva caches, no documenta refresh red. Skill cloud-environment-runtime/networking dice environment_status currentHTTP puede cambiar tras arranque y /etc policyfile es snapshot startup; no editar file para otorgar acceso. No mecanismo refreshred tarea existente documentado/callable en catálogo (solo environment_status). Sin inventar refresh/restart/nuevo worker; snapshot actual rige hasta evidencia nueva.

## WAKE existente frente a tarea nueva

Ayuda instalada codex cloud exec --help exit0: comando env+QUERY **submit NEW cloud task**. No TASK_ID destino ni garantía reutilizar worker; NO usar como wake existente.

Ayuda instalada codex queue --help exit0: queue mensaje existing session con --thread UUID/name; admite --remote app-server endpoint y auth-token-env. Confirma sintaxis de sesión existente pero no acredita que cinco UUID Codexcloud estén en ese daemon ni endpoint/auth soportado ya autorizado. No buscar endpoints ni credenciales; no ejecutar queue. Referencia oficial CLI consultada no encontró entrada codex queue. No inferir ausencia universal de capacidad; gate integración actual missing.

[Referencia oficial CLI](https://learn.chatgpt.com/docs/developer-commands?surface=cli) describe cloud list chats/tasks recientes JSON y auth principal CLI; status requiere TASK_ID en help instalada. Solo correspondencia de ID exacto en inventario validado permitiría probar identidad de task; UUIDdurable no asumido equivalente. Cuatro UUID declarados (Platform/Marca/Lucía/Ventas), HermesUUID no inyectado; no afirmar5consultados.

## Gates

- metadata_read: CLI sintaxis soportada, resultado ejecución única de fuentes pendiente para cierre; no duplicación por QA.
- id_match: no validado sin inventario exitoso y match exacto; HermesID missing.
- wake: BLOQUEADO dependiente de read+idmatch y mecanismo oficial reutilización probado; cloudexecNEWtask no cumple autorización UNAexistingtask.
- scheduler/24x7/laptopapagada: no probados; wake único aun exitoso no validaría recurrencia.

Cero nuevas instalaciones/servicios/workers; costos tokens existentes no total0. Revisar resultado sanitizado worker y conservar misma rama privada. Sin login/authcache/secretos ni producción.

## Cierre sobre ejecución única sanitizada

QA leyó postpublication-read-gate.json y comprobó SHA256 **6e5d9cf1f94b8bbb6bd1594350503a05e1a9b1c156299017c558a1758cca02fb**. Snapshot worker coincide con raíz: revision12/current/enforced y sourceversion anterior, effectivechatgptfalse/policyfilerules vacías.

UNA CLI worker con red oficial por comando: exit1, stdout0bytes, list_tasks_failed/error_sending_request. HTTPstatus/auth NO observados, returned_task_ids vacíos. Cuatro comparisons no observables sin respuesta, HermesUUID no inyectado. Wake no intentado. No lectura de rawresponse por QA ni rerun.

Veredicto: metadata lectura status/policy VALIDADA en su alcance; lectura inventario workers BLOQUEADA; idmatch NO OBSERVABLE; wake NO EJECUTADO/BLOQUEADO dependiente. No afirmar nuevo proxy403: postCLI no entregó HTTPstatus. Política efectiva anterior sin host concuerda con diagnóstico proxy previo, causa precisa del nuevo envío permanece sin respuesta.

Intervención concreta: lograr por workflow oficial que runtime use sourceversion publicada con regla aplicada/enforced; mecanismo refresh existente no documentado/callable. Docs contemplan tarea nueva para reusable setup, pero ese paso requiere coordinación explícita de relevo del carril existente evitando duplicado, no creación autónoma de worker. Conservar artefactos privados y no seguir reintentando ni activar wake para ocultar mismatch de runtime/publicación.
