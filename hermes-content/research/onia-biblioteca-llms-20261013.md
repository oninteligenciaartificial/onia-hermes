# Biblioteca LLMs ONIA — corpus y libros recuperables
Fecha: 2026-10-13. Dueño: Sergio Urcullo. Worker: biblioteca_llms, supervisión madre.
META: tres libros de estudio útiles para autonomía de todas las sesiones ONIA.
PRUEBA DE HECHO: libros guardados y reabiertos en cuaderno; primarias abiertas; síntesis citada separada de decisiones.
REGLA DE PARADA: sin afirmación de runtime operativo, savings, modelo servido ni exactly-once externo sin evidencia.

## Acceso y evidencia
Cuaderno existente reutilizado: [ONIA · Ingeniería de agentes · Piloto](https://notebook.google.com/notebook/4976c6a9-2609-4f63-98db-514149c85f82).
Sesión web vigente comprobada; no prueba acceso a KeePassXC. No secretos transferidos.
Tres notas guardadas como libros breves de estudio, títulos exactos:
- Libro 1 · Modelos, contexto, routing y límites · ONIA · 2026-10-13
- Libro 2 · Orquestación durable, colas y reconciliación · ONIA · 2026-10-13
- Libro 3 · Relevos, memoria, skills y aprobaciones · ONIA · 2026-10-13

La app presenta notas también en Fuentes. Los libros están excluidos de la selección primaria para evitar autorreferencia. El informe "HIPÓTESIS NO VALIDADA · Deep Research arquitectura ONIA · QA rechazado 2026-10-13" permanece deseleccionado. Nueve primarias añadidas sobre el corpus existente; selección final de 13 primarias. No se crearon cuadernos duplicados.

## Corpus primario de síntesis (13)
1. OpenAI Compaction — https://developers.openai.com/api/docs/guides/compaction
2. OpenAI Rate limits — https://developers.openai.com/api/docs/guides/rate-limits
3. Anthropic Effective context engineering — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
4. Anthropic Effective harnesses for long-running agents — https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
5. Cloudflare Queues Delivery guarantees — https://developers.cloudflare.com/queues/reference/delivery-guarantees/
6. NousResearch Hermes Agent repositorio — https://github.com/NousResearch/hermes-agent
7. Hermes Agent Persistent Memory — https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
8. Hermes Agent Skills System — https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
9. Hermes Agent Security — https://hermes-agent.nousresearch.com/docs/user-guide/security
10. Google Add/discover notebook sources — https://support.google.com/gemininotebook/answer/16215270
11. Google Enterprise notebooks management API — https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks
12. LangGraph Persistence — https://docs.langchain.com/oss/python/langgraph/persistence
13. Temporal Workflow execution — https://docs.temporal.io/workflow-execution

Consultadas originales mediante web.open 2026-10-13. Las URLs presentes no prueban implementación ONIA.

## Libro 1 — contenido y aplicación
Compaction del contexto es distinta de estado operacional; la salida del endpoint compact standalone se conserva como ventana siguiente. Cuotas: Retry-After válido; de faltar, backoff con jitter, límites de intentos/tiempo y evitar retries multiplicados. Errores billing/cuota requieren intervención.
Anthropic sustenta recuperación por demanda y memoria de notas; no demuestra ahorro ONIA.
Política recibida: madre/mecánica Luna low, código Sol 6.1 medium, QA Sol low, Astra sólo con excepción explícita de Sergio Urcullo y evidencia de fallo o riesgo; sin escalación automática. No inferir modelo servido.
Medir entrada actual, salida, cache, latencia, calidad/costo por tarea. Tokens acumulados no son ocupación actual.
Ejercicio pendiente: lote reproducible, modelos autorizados, QA independiente y costos observados.

## Libro 2 — contenido y aplicación
Cloudflare Queues: entrega al menos una vez; duplicados posibles. LangGraph checkpoints y Temporal historial durable son mecanismos de persistencia, no implementación ONIA automática.
Propuesta: task_id, owner, estado, contrato/version, intento, lease_until, fencing_token, approval_ref, idempotency_key, prueba, next_action. Claim transaccional, fencing contra escritor vencido. Estados ready/claimed/running/waiting_event/waiting_approval/retry_at/needs_reconcile/qa/done/blocked.
Timeout posterior a efecto externo: needs_reconcile y consulta estado remoto antes de retry; idempotencia del proveedor si disponible. Marca local antes de efecto no cierra ventana de fallo.
Prueba pendiente: matar worker antes/después claim, timeout después efecto, duplicar evento, vencer lease, resultado tardío. Criterio: un efecto observado, reconciliación, QA.
VPS de ONIAPlatform conserva aislamiento de producto; no transferir bóveda/cookies/sesiones personales. Hosting se decide por costo/límites/recuperación probados.

## Libro 3 — contenido y aplicación
Anthropic: inicialización, progreso incremental, notas/Git entre sesiones; compactación sola insuficiente.
Hermes Agent NousResearch tiene memoria/skills y seguridad; no confundir agente con modelos Hermes ni con repo ONIA Hermes.
Política de relevo vigente: objetivo, dueño, estado, evidencia URL/commit, fecha, intentos/causa, aprendizaje observado versus hipótesis, next_action y aprobación específica. Contrato + resumen vigente + archivos bajo demanda.
Madre delega/revisa; worker ejecuta; QA reproduce. Sesión autenticada conserva sólo alcance autorizado.
NotebookLM sintetiza corpus; primarias/pruebas tienen prioridad. No scheduler, supervisor, verdad o memoria canónica. API Enterprise documenta gestión y pide setup/licencia; no prueba API query/chat consumer.
Prueba pendiente: sesión nueva resuelve tarea sólo con contrato/relevo, QA compara y gate detiene acción sensible.

## Autonomía real pendiente
Estado durable y dueño único, disparo por eventos, runner autorizado disponible, leases/fencing, reconciliación, límites de recursos/costo, aprobación ligada a acción, QA/cierre auditable. Estudiar no instala estos componentes.
No instalaciones, compras, deploy, nuevas cuentas, traslado de secretos ni cambios en producción realizados.

## Limitación local
create_worktree operación 238db8db-4f9b-4c53-894a-3e456c270821 falló al copiar media: No space left on device. No se borró ni reparó espacio. Ficha preservada por GitHub App en rama codex/biblioteca-llms-20261013; main local dirty intacto.

## QA de la síntesis NotebookLM
Respuesta citada generada desde 13 primarias. No aprobada como autoridad: atribuye recuperación just-in-time de Hermes Agent a una cita de Anthropic y mezcla complejidad de atención O(n²) con causalidad de context rot. Conservada sólo en chat del cuaderno; no se promovió a fuente/libro. Los tres libros manuales conservan claims delimitados y propuestas identificadas. Las capacidades de ejecución cloud y autonomía no se probaron.

## IDs observados y persistencia
IDs leídos de controles DOM de notas (sin inventar deep links): Libro 1 f7adf3a6-a8b1-4541-ac08-35df903f8c66; Libro 2 7a3d91bb-1121-4196-a462-365ee320d902; Libro 3 d5772e33-269d-4930-b266-b580eb09007d. La app no expuso enlaces independientes de notas; abrir el cuaderno y pulsar título exacto.
Reapertura real validó cuerpos completos de los tres libros. El Libro 2 requirió guardar cuerpo otra vez después de detectar nota vacía al reabrir; corregido y comprobado. Evitar cerrar editor inmediatamente tras fill: observar cuerpo y reabrir para prueba de persistencia.
Capturas privadas locales en carpeta visualizations de la madre: biblioteca-libro1.jpg, biblioteca-libro2.jpg y biblioteca-libro3.jpg. No se subieron imágenes de la sesión al repo.
