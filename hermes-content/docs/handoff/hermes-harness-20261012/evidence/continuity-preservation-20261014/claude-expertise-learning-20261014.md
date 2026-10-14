# Claude Code: aprendizaje aplicable a la orquestación ONIA

- Fecha de síntesis: 2026-10-14.
- META: convertir investigación oficial de Anthropic sobre uso de Claude Code en reglas concretas para orquestación ONIA con foco en calidad, contexto y costo, sin ampliar permisos.
- PRUEBA DE HECHO: dos fuentes oficiales añadidas al cuaderno existente y una sola consulta NotebookLM usando exclusivamente esas dos fuentes; contrastar afirmaciones contra originales.
- REGLA DE PARADA: no instalar, autenticar de nuevo, habilitar SDK/API/modelos pagados, cambiar configuración Claude, pagar, publicar, contactar terceros ni compartir el cuaderno.

## Fuentes y cobertura

1. [Anthropic, “Agentic coding and persistent returns to expertise”](https://www.anthropic.com/research/claude-code-expertise), 2026-06-16. Analiza aproximadamente 400.000 sesiones interactivas de Claude Code de unas 235.000 personas, oct-2025 a abr-2026, con clasificadores apoyados en transcripciones y telemetría. En promedio, los usuarios toman alrededor del 70% de decisiones de planificación y Claude el 80% de decisiones de ejecución; más expertise específica se asocia con más señales de éxito verificado. El éxito “verificado” requiere juicio del clasificador y al menos una señal dura; no representa resultado real observado, el propio informe lo califica preliminar y excluye uso headless/SDK. No prueba causalidad, ahorros ni resultados de ONIA.
2. [Claude Code Docs, “Best practices for Claude Code”](https://code.claude.com/docs/en/best-practices), consultado 2026-10-14. Recomienda criterios ejecutables de verificación, exploración y plan antes de cambios inciertos, contexto preciso y subagentes para investigación que sature el contexto. También dice que planear agrega costo para tareas claras y pequeñas. Son recomendaciones para Claude Code; no una medición de ahorro transferible ni autorización para habilitar features.

## Síntesis de evidencia frente a propuesta ONIA

| Hallazgo oficial / observado | Regla propuesta para ONIA | Prueba local para medirla |
|---|---|---|
| En la muestra estudiada, las personas retuvieron la mayor parte de decisiones de planificación; el reporte no observa los resultados en el mundo real. (Investigación, §§ “Who decides what”, “Success depends…”) | La madre fija objetivo, alcance, permisos y criterio de cierre; worker elige implementación dentro del contrato. Es consistente con ONIA, no una regla empírica universal. | En un piloto, registrar si el contrato evitó desvíos, aclaraciones, retrabajo o cambios fuera del alcance. No quitar gates humanos. |
| La guía recomienda criterios que se puedan ejecutar/observar y mostrar evidencia del resultado. | Aceptar resultado sólo con prueba determinista adecuada y evidencia legible; QA separado revisa cuando el riesgo lo amerita. | Comparar aceptación de QA, defectos detectados tras cierre y tiempo de revisión frente a la línea base. |
| La guía recomienda separar exploración y plan para cambios inciertos; admite que planificar añade overhead en arreglos pequeños y claros. | Tarea acotada de una frase: ejecutar directamente. Incertidumbre o varios archivos: explorar y planear antes de editar. | Medir tiempo total y número de correcciones por categoría; verificar que planificación no agregue demora a tareas triviales. |
| La guía aconseja subagentes para investigación intensiva en archivos/contexto, en entorno propio, y menciona sesiones paralelas aisladas. No dice que cientos de agentes sean práctica necesaria ni barata. | Delegar sólo subtareas independientes que produzcan un artefacto verificable; un worker y un revisor focal por lote según política vigente. Evitar fan-out masivo y duplicar investigación. | Comparar contexto/costo observable, tiempo de ciclo y conflictos/retrabajo contra ejecución sin delegación en tareas emparejadas. |
| La guía advierte degradación al crecer contexto y aconseja contexto preciso, `/clear` entre tareas distintas y compaction. | Pasar instrucciones, archivos y estado mínimo por demanda; resumen de handoff con hecho, decisión, evidencia y siguiente paso. No cargar el historial completo por defecto. | Registrar fuentes/archivos cargados, tokens/costo si el runtime real los expone, latencia y correcciones. Si no se exponen, dejar costo/token como UNKNOWN. |
| Recomienda corregir desvíos pronto; checkpoints/rewind son reversibles para cambios realizados por herramientas de edición, pero no reemplazan Git. | Al primer desvío, reencauzar; ante repetición, pausar, preservar estado y replantear contexto. Límite de reintentos se configura conservadoramente y se valida antes de automatizar. | Medir repeticiones de la misma corrección, intentos, errores y recuperación; verificar que revertir no borre cambios fuera del mecanismo de checkpoint. |

## Prueba de aplicación propuesta

Ejecutar un piloto pequeño y reversible con tareas internas repetibles y sin datos privados/clientes. Comparar con tareas equivalentes recientes de la línea base: tiempo de ciclo, número de correcciones/reintentos, aceptación QA y tokens/costo únicamente cuando el proveedor los exponga realmente. Fijar igual criterio de aceptación y no subir paralelismo durante la comparación. Si los datos no existen, marcar UNKNOWN; no derivar ahorro de la longitud de contexto o de la cantidad de agentes. Mantener aprobaciones humanas para gasto, secretos, producción, publicaciones y contacto con clientes.

## Observado, inferido y propuesto

- **Observado:** sólo se registró visualmente la lámina 6/6 del carrusel de Instagram; la ficha del worker dice que la lámina muestra “Be open to being wrong”. La caption atribuye a Boris Cherny “cientos de agentes por día” y no responder manualmente a revisiones, pero la investigación oficial consultada no valida esas afirmaciones. La cobertura de 1/6 no basta para reconstruir consejos de las otras láminas.
- **Oficial:** los puntos y límites arriba provienen de las dos páginas de Anthropic, enlazadas. Estudio agregado, de uso interactivo, preliminar; excluye headless/SDK y no observa si artefactos se adoptan o su valor real.
- **Propuesto:** la matriz de reglas y el piloto son hipótesis operativas para ONIA, no resultados medidos. NotebookLM sintetiza, no verifica ni modifica pesos/modelos; sus respuestas se comprobaron contra los originales.

## NotebookLM

- Cuaderno existente: **ONIA · Ingeniería de agentes · Piloto** ((enlace privado omitido)). Antes: 37 fuentes. Añadidas sólo las dos URLs oficiales arriba; total visible después: 39.
- Consulta única, completa: solo las dos nuevas fuentes fueron seleccionadas; estado visible antes y al terminar: **2 fuentes**. La consulta pidió máximo 6 reglas, tabla de hechos/propuestas/pruebas, límites del estudio, medición de costo y gates humanos. La respuesta quedó guardada como nota **“ONIA · Claude Code: orquestación y costos · 2026-10-14”** en el mismo cuaderno; luego se deseleccionó para que no participe en futuras consultas basadas solo en las fuentes oficiales.
- El cuaderno no se compartió ni publicó; no se generaron artefactos Studio ni se añadieron fuentes del post/corpus privado.
- Modelo usado, tokens, tiempo de NotebookLM y métricas/costos ONIA: UNKNOWN salvo que UI o telemetría los exponga. No se registró cronómetro de ejecución.

## Límites

Nada aquí implementa una orquestación nueva, cambia la política actual de routing, modifica sesiones Claude/CLI, elimina gates ni demuestra ahorro de dinero. Las prácticas documentadas de Claude Code sólo se pueden transferir como hipótesis y deben validarse en ONIA con evidencia propia.

### Resultado consultado en NotebookLM (contrastado)

La respuesta sintetizó seis propuestas: madre retiene objetivo/alcance/éxito/permisos; delegar aisladamente sólo investigación o trabajo independiente; tareas de una frase van directas, cambios inciertos o multiarchivo pasan por plan; contexto mínimo/JIT; QA ejecutable con evidencia; reorientar/resetear tras intentos repetidos. Incluyó una propuesta de comparar un lote de tres correcciones con la línea base en tiempo, reintentos y aceptación QA, anotando que costo directo no es observable si faltan logs/API telemetry. Es una propuesta de NotebookLM, no un benchmark de ONIA. El informe oficial respalda patrones/metodología, no el límite de “resetear al segundo intento” como ley universal ni que ese tamaño de lote sea óptimo; esto queda como hipótesis a validar.
