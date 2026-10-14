# Referencia de infraestructura: publicación atribuida a @thedelost

**Fecha de revisión:** 2026-10-14 (UTC)
**Estado actualizado:** el intento de lectura web respondió 403, como antecedente de ese canal; Root confirmó el post exacto en Chrome el 2026-10-14, autor visible `@thedelost`, UI `14 Oct 4:48 PM`. No se instalaron herramientas ni se ejecutaron instrucciones del post. Esta copia incorpora la observación de Root y la fuente primaria revisada.
**Base ONIA usada:** estado compartido por Root: `HEAD 2a1cc10`, documentos `e597+`; receptor Gateway con allowlist existe; no hay `NativeWorkAuthority` verificada por concesión humana, conector/CLI VPS con ruta y autenticación confirmadas, ni evidencia de ejecución desde Cloud o con PC apagada. No verifiqué esos datos de repo en esta pasada.

## Identidad y evidencia del post

- [Post exacto de X](https://x.com/thedelost/status/2110472847084650726?s=46). Root lo observó directamente en Chrome: autor visible `@thedelost`, fecha/hora de UI `14 Oct 4:48 PM` (zona de UI no documentada). El objetivo quedó identificado por esa observación.
- El 403 y la ausencia de resultado por ID corresponden al intento web previo y son solo historial del canal; ya no sostienen que el post exacto o su fecha visible sean `UNKNOWN`. No usamos como evidencia el perfil espejo, que no confirmaba el ID. La decodificación Snowflake permanece una inferencia y no reemplaza la hora visible de UI.

## Qué respaldan las fuentes primarias

La documentación oficial de Claude Code sí describe subagentes con instrucciones y permisos propios. El subagente Explore incluido es de solo lectura y ayuda a buscar/leer el código. Los subagentes corren dentro de la misma sesión de Claude Code y consumen el mismo presupuesto de uso; crear más puede aumentar el consumo. [Subagents de Claude Code](https://code.claude.com/docs/en/sub-agents)

La función advisor de Claude Code está documentada como experimental y envía al asesor la conversación completa, incluidas llamadas y resultados de herramientas. La llamada puede sumar coste; el modelo decide cuándo solicitar consejo y la documentación dice que eso no es una regla exacta ni un límite garantizado. [Advisor de Claude Code](https://code.claude.com/docs/en/advisor)

Jev/TypeSafe documenta un modelo de decisiones tipadas (Choice, Score o Noul), no un modelo que escriba código ni sustituya al agente. El patrón de routing recomienda que el código componga la acción a partir de la salida tipada. Confianza es una estimación basada en la distribución, no garantía de corrección. [Introducción de TypeSafe](https://docs.typesafe.ai/introduction), [Jev para agentes de código](https://docs.typesafe.ai/introduction/coding-agents), [routing por intención](https://docs.typesafe.ai/patterns/intent-routing), [confianza](https://docs.typesafe.ai/confidence)

Según la tabla oficial consultada, Jev 1.14 salió el 14-oct-2026; el alias `jev-latest` todavía apunta a 1.13 y `jev-preview` a 1.14. La página lista $0.042 por millón de tokens de entrada y salida sin cargo para los modelos listados. La misma documentación indica que el inglés es el idioma principal y recomienda evaluar otros idiomas; Zero Data Retention solo está disponible en Enterprise. Un alias móvil y un servicio alojado deben tratarse como dependencias operativas y de privacidad. [Modelos y precios de TypeSafe](https://docs.typesafe.ai/models), [manejo de datos](https://docs.typesafe.ai/legal)

El SDK Python publicado por TypeSafe es MIT y el repositorio muestra versiones recientes 0.7.x. La licencia del SDK no elimina el coste, la dependencia de API, la gestión de clave ni la revisión de datos enviados al servicio. [Repositorio oficial](https://github.com/typesafe-ai/typesafe-sdk-python), [releases](https://github.com/typesafe-ai/typesafe-sdk-python/releases)

## Contraste con ONIA y acción

La idea útil es separar exploración de solo lectura, ejecución por un autor y revisión independiente, y pedir una segunda opinión en puntos de decisión concretos. Eso encaja con la forma actual de trabajo de ONIA: un worker ejecutor y QA independiente, coordinados por Root; delegar solo tareas realmente separables. En el flujo Codex existente no hace falta adoptar una configuración de Claude Code ni sumar un modelo de routing para lograr ese patrón.

| Brecha | Componente ONIA existente según estado compartido | Siguiente acción concreta |
|---|---|---|
| Investigación acotada vs. cambios | Delegación Codex y revisión por Root/QA | Mantener helpers de lectura para explorar fuentes; preservar un autor por carril y QA independiente. Aplicar “asesor” como revisión explícita en arquitectura, error repetido y cierre, sin cambiar configuración global de modelos. |
| Autorización humana verificable | Gateway Telegram con allowlist; existe interfaz nativa de autoridad, pero no concesión humana verificada | Conectar el callback autenticado existente a la autoridad nativa, vinculando actor, operación, request hash, nonce y expiración. El payload de evento o un clasificador Jev no debe emitir grants ni saltar STOP/fence/deduplicación. |
| Ejecución independiente de la PC | Adaptador/almacén de resultado local en rama; conector VPS/CLI operativo no confirmado | Identificar y validar el proceso autorizado en el entorno de ejecución; demostrar persistencia de cola y resultado con un caso acotado antes de afirmar PC-off/Cloud. No crear un segundo scheduler o cola. |
| Resultado recuperable | `FileResultSink` existente en el cambio local según Root; despliegue/conexión real no probado | Enlazarlo desde el conector confiable a un directorio POSIX privado y fuera de Git; verificar fsync de archivo/directorio, recuperación e idempotencia allí. |
| Routing por modelo | No hay uso productivo justificado de Jev establecido | Mantener decisiones simples como código determinista. Si aparece una decisión ambigua con valor medible, evaluar primero con entradas sintéticas y de bajo riesgo, sin authority ni control de retries. |

## Recomendación

**No copiar el prompt ni instalar el SDK/skill de TypeSafe ahora.** Con el post exacto no verificable, la recomendación respaldada es adoptar solo el patrón de trabajo: lectura aislada, un autor, QA independiente y consultas de criterio explícitas. Para el objetivo de autonomía ONIA, el cuello de botella es la concesión humana autenticada y el conector que persiste/recupera la misma cola y resultados; un router LLM no resuelve esos huecos.

Si más adelante se evalúa Jev, limitarlo a seleccionar entre opciones no autoritativas; fijar versión, probar precisión/confianza en español, revisar contrato/retención, costo total y comportamiento ante indisponibilidad. No enviar código privado, credenciales, tareas de clientes o transcript sensible a un tercero sin revisión y autorización. El precio documentado no implica aprobación de gasto. La eventual integración debe dejar autoridad, STOP, nonce, expiración, hashes y política de reintento en código y en la autorización humana verificable.

**Límites:** esto no demuestra que el post objetivo diga lo mismo; tampoco prueba Gateway autenticado en vivo, `NativeWorkAuthority` con grants reales, ejecución del conector VPS/Cloud, cola recuperable desplegada, ni autonomía con PC apagada.

## Actualización 2026-10-14: identidad del post confirmada por Root y contraste oficial

**Corrección del estado anterior:** mi inspección web inicial recibió 403 y no pudo identificar el post. Después, Root lo abrió en la sesión Chrome ya autorizada y observó en la interfaz accesible el post completo de `delost` (`@thedelost`), publicado el 14-oct a las 4:48 PM según UI. Esta observación de Root confirma la identidad y el resumen siguiente; no implica que mi canal web haya podido leer X. El perfil espejo citado arriba ya no es necesario para identificar el post y no debe usarse como evidencia del post objetivo.

**Resumen del post, según observación de Root (no transcripción):** propone un workflow generado/planificado por Opus 5.5; agentes Haiku 5.5 baratos y de solo lectura para escanear; Sonnet 5.5 para editar en copias aisladas; otro Sonnet 5.5 para verificación independiente; Opus revisa los resultados verificados y aprueba el cierre. También aconseja parar después de dos rondas sin cambios y asigna a Jev microdecisiones. El post atribuye `/effort ultracode` a Claude. No adopté ni ejecuté el prompt, la bandera, Jev, ni ninguna instrucción externa.

La [documentación oficial de workflows de Claude Code](https://code.claude.com/docs/en/workflows) confirma que los **dynamic workflows** existen: scripts JavaScript generados para orquestar subagentes, con intermediarios guardados en variables del script; pueden repartir auditorías, migraciones y research con verificación cruzada. También documenta ejemplos de copias aisladas, revisión por agente, y un ciclo que se detiene tras dos rondas consecutivas sin progreso. Eso respalda la forma general del workflow, no que esos modelos/versiones específicos sean los recomendados por Anthropic ni que Jev sea parte de Claude Code.

La guía también confirma el opt-in `ultracode` y `/effort ultracode`; con este último Claude planifica workflows para tareas sustantivas, activa nivel de esfuerzo `xhigh`, puede encadenar varios workflows y usa más tokens/tiempo. La propia documentación aclara que el consentimiento/aviso del primer workflow se omite cuando ultracode está activado; por tanto, no es equivalente a una puerta de aprobación por cada ejecución. Los agentes mantienen las reglas de permisos de Claude Code, pero un workflow no admite input humano arbitrario entre etapas: si se requiere sign-off entre fases, se separan en workflows distintos. La guía describe 16 agentes concurrentes por defecto y hasta 1,000 agentes totales por workflow (con límites por CPU/configuración), lo cual es capacidad máxima, no una configuración eficiente para cada tarea.

### Consecuencia para ONIA

El post aporta un patrón más específico y reproducible que la lectura inicial: plan por script, lectura sin escritura, edición en copias aisladas, verificación independiente y cierre tras un criterio de no progreso. ONIA ya usa delegación por frentes y revisión independiente en Codex; la diferencia es que Claude dynamic workflows trasladan branching/estado intermedio a un script que se puede rerun. No cambia la brecha operativa: esa capacidad no autentica grants, no crea autoridad humana, no demuestra el conector VPS/Cloud y no persiste la cola ONIA. Tampoco hay motivo probado para añadir Jev a la autoridad o política de STOP. La adaptación razonable es conservar los límites existentes y formalizar el criterio “dos rondas sin progreso” en el workflow solo cuando haya una tarea repetible que se beneficie del estado del script; no activar globalmente ultracode sin medir consumo y revisar su menor intervención por ejecución.

**Fuente oficial consultada en esta actualización:** [Claude Code: dynamic workflows](https://code.claude.com/docs/en/workflows).
**Proveniencia de X:** observación directa de Root en Chrome, compartida el 2026-10-14; mi solicitud web directa sigue registrada como 403.
