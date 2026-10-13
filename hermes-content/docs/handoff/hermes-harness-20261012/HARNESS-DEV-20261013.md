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
3. **Muse (Meta) y Dots (OpenAI), futuro.** Únicamente candidatos de ejecutor:
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
y relevo humano en un checkpoint seguro. El piloto recibe estos valores como
inputs simulados, no mide este runtime.

Fuentes primarias cotejadas para un futuro medidor:

| Runtime | Señal documentada/observada en fuente | Gate pendiente |
|---|---|---|
| Codex app server | El [código upstream de Hermes, `codex_runtime.py`](https://github.com/NousResearch/hermes-agent/blob/8f817911723e3ec13e7f47fc022fdcc9e2149354/agent/codex_runtime.py) consume `token_usage_last` y `model_context_window` por turno. | Verificar en el runtime elegido que son frescos y representan contexto activo. El Codex Cloud de estos chats no expone aquí un medidor verificado. |
| Agents API | Las guías oficiales de [sesiones](https://developers.openai.com/api/docs/guides/agents-api/sessions) describen ciclo de sesión nueva, no prueban en este piloto una pareja fiable U/ventana para alertar. | Examinar eventos/usage de una sesión autorizada y distinguir consumo por turno de ocupación activa; hasta entonces `UNKNOWN`. |
| Claude Code | La [fuente oficial de hooks](https://github.com/anthropics/claude-code/blob/bf2323b3021c9d3db7a31e1e7d61068c3f704497/plugins/plugin-dev/skills/hook-development/SKILL.md) muestra `session_id`, `transcript_path` y evento `PreCompact`. | Esos campos no miden U/ventana; validar telemetría y comando de reanudación en CLI oficial instalada antes de automatizar. Claude CLI no está disponible en este runtime. |
| Hermes Agent | [`context_breakdown.py`](https://github.com/NousResearch/hermes-agent/blob/8f817911723e3ec13e7f47fc022fdcc9e2149354/agent/context_breakdown.py) separa `provider_usage` de `local_estimate`/`provider_usage_plus_estimate` y afirma que throughput de vida no sustituye ocupación actual. | Admitir alerta automática solo con fuente `provider_usage`, ventana confirmada y frescura registrada; estimaciones se muestran como orientación y el gate queda `UNKNOWN`. |

Para Claude Code se reserva un contrato privado de adapter: conservar
`provider=claude_code`, `session_id`, un `transcript_path` **solo** si su ruta y
permisos se verificaron dentro de almacenamiento privado, y un `resume_argv`
validado contra la CLI oficial antes de ejecutarlo. No guardar transcript ni
ruta absoluta privada en Git o handoff canónico. No se implementa ni se ejecuta
el adapter en este lote. El artefacto canónico del relevo en repo contiene tarea,
branch/ref/SHA, checkpoint y digest, evidencias, decisiones, bloqueos, siguiente
acción y aceptación ligada al sucesor; el paquete SQLite representa este
contrato offline. Su publicación/ACK remoto autenticado siguen pendientes.

Límite operativo único para **activar un entorno real**: falta aprobar y acreditar
un ejecutor remoto soportado para el circuito elegido, con identidad/scopes,
privacidad, costo y prueba finita de recibo/resultado. Antes de activarlo también
se debe aprobar instalación aislada y operación durable; ninguna prueba local
acredita PC apagada. No usar Dots/Muse ni chats existentes como sustituto tácito.
