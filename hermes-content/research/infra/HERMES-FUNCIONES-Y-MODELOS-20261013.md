# Hermes Agent y selección de modelos: inventario con evidencia

Fecha de consulta: 2026-10-13. Dueño: Desarrollo-Infra, investigación documental. Estado: **fuentes públicas revisadas; capacidad instalada pendiente de prueba por familia**.

## META, PRUEBA DE HECHO y PARADA

- **META:** entender las familias de funciones de *Nous Hermes Agent* y elegir modelo/esfuerzo por calidad, riesgo y consumo observable para ONIA.
- **PRUEBA DE HECHO:** índice oficial cubierto por familias, fuentes y límites explícitos; cualquier afirmación de operación local requiere comando o evento de la versión instalada, configuración saneada y resultado reproducible.
- **PARADA:** no instalar, iniciar sesión, activar automatizaciones, acceder a datos privados, gastar, contactar, publicar ni cambiar producción con base en esta investigación. La documentación de la versión pública no prueba que una función exista o esté habilitada en el VPS de ONIA.

Este documento investiga el producto público de Nous Research. **Hermes Agent** y el proyecto propio **ONIA/Hermes** son entidades distintas. El [índice oficial `llms.txt`](https://hermes-agent.nousresearch.com/docs/assets/files/llms-a684d74fa6569106d1488e804e4bcafb.txt) enumera las páginas públicas por categoría y se genera con cada publicación de la documentación. Los plugins, proveedores, skills y plataformas añadibles hacen imposible una lista cerrada de cada función futura; el mapa siguiente cubre las **familias documentadas al 13-oct**, no cada extensión dinámica.

## Estado local que sí se puede afirmar

El snapshot técnico comunicado por el frente de infraestructura para esta investigación registra **VPS con Hermes Agent `v2026.8.31-5411-g7166071fca`, gateway activo y `gpt5mini` configurado**. Registra además **Codex CLI ausente** y **Claude CLI 2.1.197 con autenticación falsa**. Es una foto fechada, no una prueba de que todas las funciones del índice estén instaladas, operativas o conectadas. No se hizo login, invocación de modelo ni prueba de plataforma en este frente. Las comprobaciones indicadas abajo son propuestas read-only y requieren ejecutarse en el entorno autorizado por su dueño.

| Familia documentada | Qué hace, según Nous | ONIA hoy | Prueba mínima para pasar de `UNKNOWN` a observado | Fuente |
|---|---|---|---|---|
| CLI, TUI, Desktop, configuración y proveedores | Conversación, interfaz, selección de modelo, configuración y resolución de credenciales. | Sólo gateway y modelo configurado del snapshot; CLI/TUI/Desktop y modelo **servido** `UNKNOWN`. | Versión, ayuda, estado y claves de configuración **sin valores secretos**; turno inocuo sólo si el dueño lo autoriza. | [configuración](https://hermes-agent.nousresearch.com/docs/user-guide/configuration), [proveedores](https://hermes-agent.nousresearch.com/docs/integrations/providers) |
| Bots, perfiles de gateway y servidor API | Agentes con rol, memoria y chats propios; exponer una API compatible con OpenAI o conectar interfaces. | `UNKNOWN`; gateway activo no prueba Bot Mode ni un endpoint público autorizado. | Inventario de perfiles, binds y listeners sin secretos; comprobar aislamiento antes de habilitar canales. | [Bot Mode](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode), [API](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server) |
| Herramientas, toolsets, terminal y `execute_code` | Registrar herramientas por conjunto y agrupar llamadas programáticas; backend de terminal seleccionable. | `UNKNOWN`; una herramienta documentada no equivale a habilitada. | Inventario de toolsets y backend efectivo, con salida saneada; caso read-only acotado. | [herramientas](https://hermes-agent.nousresearch.com/docs/reference/tools-reference), [toolsets](https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference), [ejecución](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution) |
| Skills, archivos de contexto y memoria | Cargar instrucciones a demanda; `MEMORY.md`/`USER.md` conservan hechos; búsqueda de sesiones recupera mensajes de SQLite/FTS5. | `UNKNOWN`; no extraer recuerdos ni mensajes privados para probarlo. | Inventario de nombres/estado; prueba con datos sintéticos si procede. | [skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [memoria](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) |
| Sesiones, búsqueda y compresión | Persistir, reanudar y buscar sesiones; comprimir contexto y reutilizar prefijos de caché cuando son elegibles. | `UNKNOWN`; la longitud del transcript no mide ocupación actual. | Estado/metadata de sesión y configuración de compresión saneados; comprobar ventana efectiva y uso actual del proveedor. | [sesiones](https://hermes-agent.nousresearch.com/docs/user-guide/sessions), [compresión y caché](https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching) |
| Perfiles, worktrees, delegación y Kanban | Separar identidades/estado, aislar checkouts, crear subagentes breves o una cola persistente multiagente. La delegación anidada requiere configuración explícita y multiplica llamadas. | `UNKNOWN`; no lanzar agentes para verificar. | Leer perfil, límites de delegación, cola y rutas; luego un contrato sintético sólo si se aprueba. | [perfiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles), [delegación](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation), [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban) |
| Gateway, plataformas, identidad y entregas | Recibir mensajes de múltiples adaptadores, aplicar allowlist/pairing y entregar resultados. El estado de ejecución y el de entrega cron son distintos. | Gateway activo en snapshot; canal, allowlist, identidad y entrega real `UNKNOWN`. Telegram como canal único de ONIA sigue siendo propuesta. | Estado del adaptador, política de destinatarios y evidencia de entrega en un canal de prueba autorizado. | [gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging), [cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) |
| Cron, goals, heartbeats, loops y hooks | Programar trabajos, reentrar en sesiones o ejecutar código ante eventos; algunos trabajos pueden operar sin LLM. | `UNKNOWN`; no crear ni reactivar bucles por este inventario. | Listar trabajos y estados sin ejecutarlos; verificar dueño, destinatario, entorno y política de fallos. | [cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron), [goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals), [heartbeats](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat), [loops](https://hermes-agent.nousresearch.com/docs/user-guide/features/loops), [hooks](https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks) |
| Navegador, MCP, plugins y credenciales | Añadir herramientas web, servidores MCP, extensiones y acceso a sitios mediante mecanismos de credenciales. | `UNKNOWN`; ningún plugin, puente ni login queda probado por estar descrito. | Inventario de nombres y configuración saneada; seguir el procedimiento local de credenciales antes de un acceso autorizado. | [navegador](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser), [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp), [plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins), [bóveda](https://hermes-agent.nousresearch.com/docs/user-guide/features/credential-vault) |
| Web, visión, voz, imagen y TTS | Buscar/extraer web, analizar imágenes, conversar por voz y generar imagen/audio con proveedor externo. | `UNKNOWN`; cada proveedor puede necesitar cuenta, licencia o gasto propios. | Inventario de backend y permisos; una muestra sintética sólo tras confirmar costo y autorización. | [índice oficial, Media & Web](https://hermes-agent.nousresearch.com/docs/assets/files/llms-a684d74fa6569106d1488e804e4bcafb.txt), [voz](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode) |
| Procesamiento por lotes y extensibilidad | Ejecutar trayectorias en lote; añadir proveedores, adaptadores o herramientas como plugins. | `UNKNOWN`; no instalar extensiones para probar el catálogo. | Revisar paquetes y configuración presentes, luego prueba aislada si existe necesidad concreta. | [índice oficial, Automation y Developer Guide](https://hermes-agent.nousresearch.com/docs/assets/files/llms-a684d74fa6569106d1488e804e4bcafb.txt), [plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins) |
| Seguridad, egress, checkpoints y rollback | Controlar comandos peligrosos, destinos de red y restauración de archivos escritos por el agente. El rollback tiene límites con repos anidados y contenedores. | `UNKNOWN`; no hacer un rollback de prueba en datos reales. | Leer modos de aprobación/egress y disponibilidad de checkpoints; prueba sintética aislada si se autoriza. | [seguridad](https://hermes-agent.nousresearch.com/docs/user-guide/security), [egress](https://hermes-agent.nousresearch.com/docs/user-guide/egress), [rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback) |
| Observabilidad, fallback y recuperación | Exportar salud operacional, reintentar o cambiar proveedor ante fallos y diagnosticar estado. Un fallback puede invalidar caché y cambiar el modelo efectivo. | `UNKNOWN`; gateway activo no demuestra observabilidad ni entrega sana. | Estado/doctor y métricas de salud sin contenido; verificar proveedor y modelo **observados** en cada turno. | [monitoring](https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-monitoring), [fallback](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers) |
| Runtime opcional Codex | Puede delegar turnos a `codex app-server` y usar herramientas/plugins de Codex con Hermes como envoltura. | **No operativo según snapshot:** falta Codex CLI. No equivale a usar esta app Codex local dentro del VPS. | Instalar y autenticar sólo con autorización previa; luego verificar versión, login, modelo y herramientas observadas. | [runtime Codex](https://hermes-agent.nousresearch.com/docs/user-guide/features/codex-app-server-runtime) |
| Integración Claude | Hermes puede usar Anthropic como proveedor de modelo. Importar configuración de Claude Code es un flujo diferente. | Claude CLI del snapshot no está autenticada. Soporte de proveedor **no prueba control nativo de Claude Code**. | Verificar cuota, credencial, modelo servido y permisos en runtime autorizado antes de afirmarlo. | [proveedores](https://hermes-agent.nousresearch.com/docs/integrations/providers), [índice oficial](https://hermes-agent.nousresearch.com/docs/assets/files/llms-a684d74fa6569106d1488e804e4bcafb.txt) |

### Límites que cambian la decisión

- En el runtime opcional de Codex, `delegate_task`, `memory`, `session_search` y `todo` **no están disponibles dentro del turno** porque exigen el contexto de `AIAgent`. Kanban sí puede usar su callback. Cron con esa ruta consta como “not specifically tested” en la propia [documentación](https://hermes-agent.nousresearch.com/docs/user-guide/features/codex-app-server-runtime). No activar la ruta esperando equivalencia funcional.
- En la [delegación de Nous](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation), profundidad anidada mayor que uno es opt-in. Un árbol de agentes suma llamadas y puede multiplicar el gasto; el resultado del hijo que vuelve al padre tampoco es gratis. Usar tarea finita, dueño, alcance y evidencia.
- [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban) es cola durable con estado y revisión; `delegate_task` es llamada subordinada breve. No crear otra cola en ONIA sin necesidad probada.
- [Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) separa ejecución `ok`, entrega fallida y entrega `UNVERIFIED`; aceptación del adaptador sin ID/respuesta positiva no es prueba de recepción humana.
- [Fallback](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers) puede resolver un error técnico, pero cambia proveedor/modelo y potencialmente caché. Registrar solicitado, configurado y observado; no presentar fallback como continuidad de calidad equivalente.

## Política propuesta de modelos, esfuerzo y contexto

La orden vigente en `CODEX.md` prevalece sobre la tabla histórica `AI_MODEL_ROUTING_2026.md`: madres Luna low, Platform Sol 6.1 medium, QA focal Sol low y Astra sólo ante la excepción específica que Sergio autorice con fallo o riesgo material. La nueva intención de Sergio es **mejores resultados con reparto consciente**, sin bajar todo al modelo más económico ni subir todo a Ultra. La [guía oficial de OpenAI](https://developers.openai.com/api/docs/guides/model-selection) recomienda comparar el **mismo trabajo** y conservar la configuración más ligera que cumpla su barra de calidad. La [guía de Anthropic](https://platform.claude.com/docs/en/build-with-claude/effort) explica que esfuerzo intercambia capacidad, latencia y tokens y exige evaluación propia.

| Trabajo | Inicio dentro del permiso vigente | Criterio de aceptación | Escalada permitida |
|---|---|---|---|
| Extracción, hash, inventario, edición mecánica | Luna low con contrato cerrado | Salida contra fuente, diff o cálculo determinista | Sol si aparece juicio, ambigüedad o rework. |
| Coordinación de madre | Luna low según `CODEX.md`; instrucciones mínimas y evidencia breve | Ningún gate omitido, dueño y siguiente acción correctos, estado real | Subir esfuerzo/modelo sólo con error material observado y cambio autorizado; no convertir a worker ejecutor. |
| Investigación acotada y QA focal | Sol 6.1 low/medium según riesgo y orden del carril | Fuente primaria, hallazgos trazables y revisión proporcional | Mayor esfuerzo Sol si hay contradicción material; Astra sólo con excepción de Sergio. |
| Código Platform e integración multiarchivo | Sol 6.1 medium | Build/caso crítico y QA independiente del autor según riesgo | Sol high/xhigh/ultra sólo si una falla o complejidad concreta lo justifica y el runtime lo permite; Astra requiere excepción específica. |
| Arquitectura o decisión comercial/seguridad de alto impacto | Plan y evidencia con Sol 6.1 medium; pedir revisor si aplica | Opciones y riesgos comprobables, autorización del gate sensible | Astra medium sólo con excepción específica de Sergio; subir esfuerzo si la comparación demuestra beneficio material. |

Un subagente tiene sentido cuando su trabajo es independiente, tiene salida verificable y evita espera o mezcla de contexto. Comparar **calidad de tarea terminada**, latencia total, reintentos, tokens de raíz e hijos, caché y cuota compartida. No deducir ahorro de usar Luna, de porcentaje de caché o de menos texto final. [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/observability) declara uso por turno best-effort, a veces `null`, e incluye input, cached input, output y razonamiento; sumar raíz, subagentes y reintentos. La [caché de OpenAI](https://developers.openai.com/api/docs/guides/prompt-caching) exige prefijo elegible coincidente y no garantiza hit por mantener sesión; la compresión puede romper parte del prefijo. Cambiar esfuerzo superior de una conversación Claude con caché puede invalidarla según [Anthropic](https://platform.claude.com/docs/en/build-with-claude/effort).

### Lectura correcta de contexto y cuota

Snapshot sanitizado de la raíz Codex a **2026-10-13 19:11:40 UTC**, obtenido de metadata local tipo `event_msg/token_count`: último `input=192296`, de los cuales `cached=187648` **están incluidos en input**; último `total=192980`; ventana informada `W=354350`. Los `total=46968080` acumulados son flujo histórico, **no ocupación actual**. Estas cifras no certifican el uso activo exacto `U` después de herramientas/turnos posteriores ni la ventana efectiva de otra sesión. Sin `U` y `W` observables y actuales, registrar `UNKNOWN` para una alarma automática de relevo. En Claude Code, la [status line](https://code.claude.com/docs/en/statusline) distingue campos de ventana, entrada y caché; usar el porcentaje explícito del runtime cuando esté disponible y no calcular “porcentaje usado” a partir de contadores acumulados.

El snapshot de cuenta Codex consultado el 13-oct indicó **5 % de ventana semanal usada**, uso ordinario permitido y balance de créditos `0`; es estado **compartido de la cuenta**, no atribuye consumo a este frente ni a un subagente y puede cambiar. No equivale a precio API ni a presupuesto en dólares. Para un benchmark futuro, usar un conjunto pequeño de tareas ONIA no sensibles, misma entrada y criterio de calidad, registrar modelo solicitado/configurado/observado, esfuerzo, tiempo, rework y tokens por categoría sólo cuando el runtime los exponga. No se hicieron pruebas de inferencia pagada ni se instaló nada aquí.

## Artificial Analysis: dato externo, alcance y límites

La [página del release GPT-6 Sol](https://artificialanalysis.ai/models/releases/gpt-6-sol) y las páginas de cada variante publican **Intelligence Index v4.3.2** y costo ponderado por tarea del índice (USD). Es una medición histórica de API para **GPT-6 Sol**, que Artificial Analysis ya marca *deprecated* y remite a GPT-6.1 Sol. No mide el precio de la suscripción Codex, la calidad de ONIA, uso de herramientas privadas, español comercial ni los modelos efectivos del VPS. Su [metodología](https://artificialanalysis.ai/methodology/intelligence-benchmarking) pondera agentes 30 %, código 20 %, ciencia 20 % y general 30 %; el índice principal es predominantemente texto en inglés. Las tareas y precios incluyen entrada, lectura/escritura de caché, razonamiento y respuesta.

| Variante histórica | Intelligence Index | Costo USD/tarea del índice | Fuente |
|---|---:|---:|---|
| GPT-6 Sol Max | 48 | 1,04 | [AA Max](https://artificialanalysis.ai/models/gpt-6-sol) |
| GPT-6 Sol Xhigh | 44 | 0,52 | [AA Xhigh](https://artificialanalysis.ai/models/gpt-6-sol-xhigh) |
| GPT-6 Sol High | 42 | 0,37 | [AA High](https://artificialanalysis.ai/models/gpt-6-sol-high) |
| GPT-6 Sol Medium | 40 | 0,25 | [AA Medium](https://artificialanalysis.ai/models/gpt-6-sol-medium) |
| GPT-6 Sol Low | 34 | 0,13 | [AA Low](https://artificialanalysis.ai/models/gpt-6-sol-low) |
| GPT-6 Sol sin razonamiento | 29 | 0,33 | [AA sin razonamiento](https://artificialanalysis.ai/models/gpt-6-sol-non-reasoning) |

**Inferencia acotada:** en *ese índice*, mayor esfuerzo mejoró la puntuación y a menudo aumentó el costo por tarea. El caso sin razonamiento costó más que Low y Medium; el costo no es función monótona del nivel de esfuerzo. “Max” de Artificial Analysis no demuestra equivalencia con el ajuste “Ultra” de Codex. La decisión local debe medirse con tareas ONIA y calidad aceptada, no con una sola clasificación global.

## Corpus público para NotebookLM

El corpus base consta de **40 URL públicas**: 32 de Nous Hermes Agent y 8 de Artificial Analysis. Se añaden 4 fuentes de contraste OpenAI/Anthropic/Claude Code para lectura humana; los enlaces no contienen secretos. Títulos abreviados y consulta 2026-10-13; las páginas Nous reflejan el despliegue público vigente al consultarlas, sin equivaler al commit instalado en ONIA.

| Nº | Fuente Nous Hermes Agent: título y URL |
|---:|---|
| 01 | [Índice de documentación](https://hermes-agent.nousresearch.com/docs/assets/files/llms-a684d74fa6569106d1488e804e4bcafb.txt) |
| 02 | [Configuración](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) |
| 03 | [Proveedores](https://hermes-agent.nousresearch.com/docs/integrations/providers) |
| 04 | [Referencia de herramientas](https://hermes-agent.nousresearch.com/docs/reference/tools-reference) |
| 05 | [Referencia de toolsets](https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference) |
| 06 | [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) |
| 07 | [Memoria](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) |
| 08 | [Sesiones](https://hermes-agent.nousresearch.com/docs/user-guide/sessions) |
| 09 | [Compresión y caché](https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching) |
| 10 | [Delegación](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation) |
| 11 | [Kanban](https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban) |
| 12 | [Perfiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles) |
| 13 | [Mensajería y gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging) |
| 14 | [Cron](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) |
| 15 | [Seguridad](https://hermes-agent.nousresearch.com/docs/user-guide/security) |
| 16 | [Navegador](https://hermes-agent.nousresearch.com/docs/user-guide/features/browser) |
| 17 | [Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins) |
| 18 | [MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp) |
| 19 | [Hooks](https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks) |
| 20 | [Checkpoints y rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback) |
| 21 | [Monitoring de gateway](https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-monitoring) |
| 22 | [Runtime Codex app-server](https://hermes-agent.nousresearch.com/docs/user-guide/features/codex-app-server-runtime) |
| 23 | [Bóveda de credenciales](https://hermes-agent.nousresearch.com/docs/user-guide/features/credential-vault) |
| 24 | [Egress](https://hermes-agent.nousresearch.com/docs/user-guide/egress) |
| 25 | [Servidor API](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server) |
| 26 | [Goals](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals) |
| 27 | [Loops](https://hermes-agent.nousresearch.com/docs/user-guide/features/loops) |
| 28 | [Heartbeats](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat) |
| 29 | [Code execution](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution) |
| 30 | [Fallback providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/fallback-providers) |
| 31 | [CLI commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) |
| 32 | [Voice Mode](https://hermes-agent.nousresearch.com/docs/user-guide/features/voice-mode) |

| Nº | Artificial Analysis: título y URL |
|---:|---|
| 33 | [Release GPT-6 Sol](https://artificialanalysis.ai/models/releases/gpt-6-sol) |
| 34 | [Intelligence Benchmarking Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |
| 35 | [GPT-6 Sol Max](https://artificialanalysis.ai/models/gpt-6-sol) |
| 36 | [GPT-6 Sol Xhigh](https://artificialanalysis.ai/models/gpt-6-sol-xhigh) |
| 37 | [GPT-6 Sol High](https://artificialanalysis.ai/models/gpt-6-sol-high) |
| 38 | [GPT-6 Sol Medium](https://artificialanalysis.ai/models/gpt-6-sol-medium) |
| 39 | [GPT-6 Sol Low](https://artificialanalysis.ai/models/gpt-6-sol-low) |
| 40 | [GPT-6 Sol sin razonamiento](https://artificialanalysis.ai/models/gpt-6-sol-non-reasoning) |

Fuentes de contraste fuera del lote 40: [selección de modelos OpenAI](https://developers.openai.com/api/docs/guides/model-selection); [observabilidad de Agents API](https://developers.openai.com/api/docs/guides/agents-api/observability); [caché de OpenAI](https://developers.openai.com/api/docs/guides/prompt-caching); [esfuerzo de Anthropic](https://platform.claude.com/docs/en/build-with-claude/effort); [status line de Claude Code](https://code.claude.com/docs/en/statusline). El runtime Codex app-server ya figura en la fuente 22.

### Pregunta de síntesis preparada para NotebookLM

> Con estas fuentes, elabore (A) un mapa exhaustivo **por familias**, no por plugins individuales, de funciones actuales de Nous Hermes Agent; para cada familia cite URL, explique entrada, acción, estado persistente, permisos, límites y prueba mínima; (B) separe documentación pública reciente de capacidades verificadas en ONIA: snapshot VPS `v2026.8.31-5411-g7166071fca`, gateway activo y `gpt5mini` configurado, Codex CLI ausente, Claude CLI 2.1.197 sin autenticación; marque `UNKNOWN` donde falte prueba; (C) destaque incompatibilidades del runtime Codex, seguridad de canales, costos, caché y delegación; (D) extraiga de Artificial Analysis Intelligence/Cost para las seis variantes históricas GPT-6 Sol con versión/metodología, sin convertir costo API en cuota Codex ni equiparar Max con Ultra; (E) proponga hasta diez pruebas locales read-only para convertir `UNKNOWN` en observado. Distinga observado, inferido y propuesto. Cite cada celda de benchmark a la página de su variante. No invente soporte nativo Claude Code.

**NotebookLM no se ejecutó ni recibió este corpus.** El control de Windows/Chrome se detuvo por revisión automática al no poder comprobar la URL actual frente a la política del navegador; no se intentó eludir ese bloqueo y no hubo transmisión. El material queda listo para importación posterior mediante una sesión autorizada.
