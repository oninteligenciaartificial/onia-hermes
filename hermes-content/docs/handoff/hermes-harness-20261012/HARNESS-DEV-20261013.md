# Harness de desarrollo offline — 13-oct-2026

Estado: candidato local, sin servicio, scheduler, credenciales, despacho ni prueba PC apagada.
El core SQLite recibe una tarea con repo/ref/SHA y hash de input, concede un solo
claim por worker, verifica checkpoint al recuperar, conserva un efecto ambiguo para
reconciliación, prepara handoff compacto, exige ACK del sucesor ligado al digest y
SHA, transfiere ownership con fencing y archivo local en una transacción, y cierra
con recibo de resultado. Las pruebas usan tiempo, owners y adapter falsos; el ACK
no autentica identidad real. `dispatch_external` falla cerrado incluso si las
banderas de prueba dicen que credenciales, permiso y presupuesto están listos.
`dispatch_effect_once` acepta por tipo exacto únicamente `OfflineEffectFixture`,
que no hace IO; una bandera `offline_fixture` autodeclarada por otro adapter no
habilita ejecución.

## Etapas y contrato de integración

1. **Hermes coordinador, ahora solo offline.** SQLite estándar en un host; cola,
   exclusión local, checkpoints, handoff y reconciliación. Antes de una prueba
   aislada en VPS se requiere elegir ruta/cuenta dedicada, backups, retención,
   control de acceso, pausa y reinicio, revisión de arquitectura y aprobación
   explícita de instalación. Esto no habilita trabajo remoto por sí solo.
2. **Ejecutor soportado, después.** `OfficialCodexCloudAdapter` para los cinco
   chats existentes permanece bloqueado: no hay API oficial verificada de
   follow-up de esos UUID. Candidato distinto para **sesiones nuevas**:
   [Agents API sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions)
   y [self-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
   describen create/continue/observe y `codex exec-server`; no hay adapter ni
   llamadas aquí. Exige elegibilidad, identidad API con scopes `api.agents.read`,
   `api.agents.write`, `api.responses.write`, environment key separada, revisión
   de privacidad/consentimiento, costo API y límite aprobado, más canario finito.
   El resultado se confirma con recibo y outcome, no solo aceptación de envío.
3. **Muse y Dots, futuro.** Nombres de candidatos de ejecutor; proveedor y API
   aún no atribuidos por fuente oficial verificable. Contrato propuesto:
   interfaz `submit(input_hash, checkpoint, effect_key) -> receipt/outcome`,
   `observe(receipt)`, `resume(provider_session_ref)` y cancelación/pausa
   verificable. Cada uno necesita documentación oficial actual que pruebe esas
   operaciones, identidad y scopes mínimos, compatibilidad de sesión, costo,
   consentimiento y QA de deduplicación/fencing. No se afirma integración,
   acceso ni compatibilidad entre proveedores. No se importan transcripts.

## Contexto, alerta y continuidad

La referencia **aproximada** de Sergio Urcullo es 500 000 tokens de **ocupación
activa del contexto** de la sesión, no acumulados de tokens de una sesión, tokens
cacheados o facturación. El objetivo observable es `min(500000, ventana efectiva)`.
Con `U` ocupación activa y `R` reserva de trabajo restante, salida y handoff,
`context_rotation_decision` emite `alert_review` cuando `U + R >= objetivo`,
para que Sergio decida en un punto seguro; no rota automáticamente. `R` se debe
estimar y registrar para la tarea concreta; el valor de fixtures no es una
política universal. Si falta `U`, ventana o reserva fiables, estado `UNKNOWN`
y relevo humano en un checkpoint seguro. `ContextSnapshot` registra fuente,
instante UTC epoch, modelo, ocupación activa y ventana efectiva; acumulado queda
en otro campo y jamás dispara alerta. `evaluate_context_snapshot` exige fuente
`provider_usage`, modelo idéntico al observado y una lectura fresca (máximo 300 segundos en la preparación
de handoff offline). Esta vigencia es un parámetro de prueba, no un sondeo ni
un límite universal. El piloto recibe inputs simulados; no mide este runtime.

Fuentes primarias cotejadas para un futuro medidor:

| Runtime | Señal documentada/observada en fuente | Gate pendiente |
|---|---|---|
| Codex app server | El [código upstream de Hermes, `codex_runtime.py`](https://github.com/NousResearch/hermes-agent/blob/8f817911723e3ec13e7f47fc022fdcc9e2149354/agent/codex_runtime.py) consume `token_usage_last` y `model_context_window` por turno. | Verificar en el runtime elegido que son frescos y representan contexto activo. El Codex Cloud de estos chats no expone aquí un medidor verificado. |
| Agents API | Las guías oficiales de [sesiones](https://developers.openai.com/api/docs/guides/agents-api/sessions) describen ciclo de sesión nueva, no prueban en este piloto una pareja fiable U/ventana para alertar. | Examinar eventos/usage de una sesión autorizada y distinguir consumo por turno de ocupación activa; hasta entonces `UNKNOWN`. |
| Claude Code | La [fuente oficial de hooks](https://github.com/anthropics/claude-code/blob/bf2323b3021c9d3db7a31e1e7d61068c3f704497/plugins/plugin-dev/skills/hook-development/SKILL.md) muestra `session_id`, `transcript_path` y evento `PreCompact`; esos campos no miden U/ventana. La [status line oficial](https://code.claude.com/docs/en/statusline) sí ofrece ocupación/ventana e incluye tokens de caché en el input del último request, no un acumulado de sesión. | Verificar señal y frescura en la CLI concreta antes de automatizar. Claude CLI no está disponible en este runtime. |
| Hermes Agent | [`context_breakdown.py`](https://github.com/NousResearch/hermes-agent/blob/8f817911723e3ec13e7f47fc022fdcc9e2149354/agent/context_breakdown.py) separa `provider_usage` de `local_estimate`/`provider_usage_plus_estimate` y afirma que throughput de vida no sustituye ocupación actual. | Admitir alerta automática solo con fuente `provider_usage`, ventana confirmada y frescura registrada; estimaciones se muestran como orientación y el gate queda `UNKNOWN`. |

Para Claude Code, `prepare_claude_resume` construye un plan **sin ejecutarlo**:
conserva `session_id`, propone argv `claude --resume <session_id>` y solo
conserva `transcript_path` si la ruta existe dentro de un directorio privado,
con permisos privados en POSIX; en Windows la ruta de transcript queda bloqueada
hasta contar con validación de ACL. El test offline comprueba el plan y el rechazo
de ruta externa. El comando y la sesión real requieren validación contra una
CLI oficial instalada y autorización antes de usarse; esta runtime no tiene
Claude CLI. No guardar transcript ni ruta absoluta privada en Git o handoff
canónico. No existe adapter que invoque Claude en este lote.
El artefacto canónico del relevo en repo contiene tarea,
branch/ref/SHA, checkpoint y digest, evidencias, decisiones, bloqueos, siguiente
acción y aceptación ligada al sucesor; el paquete SQLite representa este
contrato offline. Su publicación/ACK remoto autenticado siguen pendientes.

Límite operativo único para **activar un entorno real**: falta aprobar y acreditar
un ejecutor remoto soportado para el circuito elegido, con identidad/scopes,
privacidad, costo y prueba finita de recibo/resultado. Antes de activarlo también
se debe aprobar instalación aislada y operación durable; ninguna prueba local
acredita PC apagada. No usar Dots/Muse ni chats existentes como sustituto tácito.

Prueba de portabilidad: `_connection()` cierra explícitamente cada conexión;
los accesos SQLite directos del test ahora usan `closing()` además de la
transacción, porque `with sqlite3.connect(...)` por sí solo no cierra el handle.
Una fixture elimina el directorio temporal después de operar la cola. La
ejecución observada de la reparación fue Linux/cloud; Windows requiere repetición.

Revisión Windows separada del SHA remoto `68d12e3962e2892cb853ca9df53ba0600a67aeec`:
Python 3.12.10/SQLite 3.49.1 registró 16 PASS y 3 ERROR `WinError 32`
al limpiar temporales en rutas de reconciliación. La causa en el código era
`with self._connect() as conn`: el contexto de `sqlite3.Connection` confirma o
revierte la transacción, pero **no cierra** el handle. `resolve_reconciliation`
ahora usa `_connection()`, que cierra en `finally`; un test focal instrumenta
el cierre tanto al rechazar como al aplicar reconciliación; otro verifica
el cierre si falla la configuración PRAGMA antes de devolver la conexión. Esta
reparación solo se verificó en Linux hasta que el canario Windows repita la suite
actual de 21 casos; el resultado 16 PASS + 3 ERROR corresponde al SHA anterior.

## Snapshot de acceso y pruebas del runtime actual

En el entorno cloud observado `ccarenv_b64_Y2NhcmVudl9jM2YzZjk3NTZkYmM4MTkxYTM3NTc0MDgwMTNiYTIzNQ`,
`environment_status` informó fase `running`, observaciones actuales y política
de red restringida/enforced. No hay capacidad, binding de secreto, variable de
runtime ni outbound identity configurados para este entorno; la lista efectiva
no incluye un host de Agents API. `codex-cli 0.159.2` existe y `codex cloud`
ofrece tareas experimentales; no se llamó `cloud list`, `exec` ni endpoint.
`claude`, `hermes` y `sqlite3` como CLIs no están en PATH; Python 3 sí.
La sesión cloud presente permite probar el harness offline, **no** un canario
remoto de Agents API ni despertar autónomo con PC apagada.

Comandos ejecutados desde este directorio: `python3 -m unittest -v
test_sqlite_pilot.py` (21 tests PASS, incluido cierre de conexiones),
`python3 test_gate.py` (18 casos baseline PASS) y `git diff --check`.
El resultado Windows de 19 casos señalado arriba sigue rojo para el SHA anterior;
no hay repetición Windows de este parche ni ejecución real de Claude CLI.

El canario **offline** stdlib en directorio temporal del VPS existente es una
prueba distinta: puede comprobar compatibilidad de SQLite, limpieza y recuperación
sin Agents API, autenticación de modelo ni gasto API. La madre coordina esa
repetición con el SHA publicado y la ruta autorizada; aquí no se tocó el VPS.

Gate humano mínimo para un **canario real separado de sesiones nuevas**:
aprobar arquitectura y presupuesto de Agents API self-hosted, privacidad del
input, scopes restringidos y entorno aislado con red/identidades oficiales
configurados. Después se validaría una sola sesión nueva con receipt/outcome y
cleanup, sin inferir acceso a los cinco hilos existentes. Mientras ese gate no
exista, adapter y despacho permanecen deshabilitados.

## Metadata local acotada de la madre — preparación 14-oct

`desktop_context_meter.py --token-metadata-only --events <ruta-privada-absoluta.jsonl>
--expected-session-id <thread-id-exacto-de-esta-madre>` prepara una lectura puntual
del scope `DESKTOP_LOCAL_ROOT`. La ruta y el thread se pasan explícitamente fuera
de Git; no se descubren archivos ni se leen otros chats. Se valida la primera
`session_meta`, su ID y timestamp, una línea inicial de hasta 256 KiB y una cola
de hasta 1 MiB del mismo descriptor. Cada registro seleccionado admite hasta
64 KiB; como máximo se examinan 8192 líneas de cola. Una fila final incompleta
se omite. La identidad del archivo y los bytes seleccionados se revalidan;
errores, schema no soportado, muestra mayor a 300 segundos, timestamp futuro
mayor a 30 segundos o falta de muestra dentro de la cola devuelven `UNKNOWN`.

Salida permitida: scope, estado/causa fija, timestamp UTC de `token_count`,
`last_token_usage` (input, cached input, output y total), ventana observada,
`last_total_to_window_percent`, su base **condicionada a `U=last.total`**, y
`active_context_usage=UNKNOWN`. Cached input es subconjunto de input y jamás
se suma nuevamente. No salen mensajes, credenciales, ruta, ID ni rawlogs; el
modo tampoco guarda fuentes, consulta proveedor, lee DB/profile ni ingiere
compactación. Conserva la semántica del modo anterior y sólo se activa con
este flag, sin opciones de calibración, ventana esperada o ACK de compactación.

La madre aportó una observación sanitizada del 14-oct a
`2026-10-14T19:28:59.402Z`: input 135423, cached 134400, output 64, last total
135487, ventana 475000; ratio descriptivo 28.52 % **sólo si `U=last.total`**.
Es una muestra puntual histórica y no una lectura nueva de este probe.
Contexto activo, costo/facturación, cuota global, consumo agregado del goal y
contexto Cloud permanecen `UNKNOWN`. Ese ratio por sí solo no puede disparar
70 %, relevo, turno, alerta ni creación de otra tarea. No sustituye un recibo
Cloud ni el hito de relevo. Preparado con revisión estática; probe, imports
productivos y tests no ejecutados en este frente. Sin stage/commit/push durante
el freeze del canario Cloud.
