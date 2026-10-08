# Enrutamiento de modelos para ONIA/Hermes

Estado: actualizado por instrucción de Sergio del 2026-10-06. Aplica a Codex, subagentes y automatizaciones que permitan
elegir modelo. La disponibilidad puede variar por producto y cuenta.

## Decisión

### Precedencia 8-oct — calidad evaluada y Claude como madre

Sergio precisó: no usar siempre modelos livianos. Coding: GPT-6 Astra o Claude Opus 5.5; tareas simples: GPT-6.1 Sol o Claude Sonnet 5.5. Esfuerzo medium inicial; verificar modelo efectivo y resultados, no sólo el nombre escrito en el prompt. Ante un fallo de calidad, entregar pruebas del fallo y escalar; ante permisos, datos o cuota, registrar el bloqueo sin cambiar de modelo para eludirlo. No duplicar autores/revisiones. Una implementación activa y revisión posterior.
Claude asume la orquestación por instrucción explícita; Codex ejecuta/revisa. CLI Claude 2.1.288 autenticada como Max, compatible según documentación oficial con `claude-opus-5-5` y `claude-sonnet-5-5`; no se probó inferencia de esos modelos en el puente. La última vista de uso Claude mostró 0% semanal y 2% sesión (8-oct, muestra puntual); créditos adicionales desactivados con autorización de Sergio y switch verificado. No inferir cuota Codex desde esa muestra.
Fuente de compatibilidad: https://code.claude.com/docs/en/model-config . Handoff y límites reales: `handoff/madre-codex.md`, bloque 8-oct. Esta política sustituye toda obligación histórica de Astra para tareas simples o de Sol para todo subagente.

### Precedencia: reducción solicitada por Sergio, 6-oct, después del cierre C11b

Sergio pidió «Bajemoslos las tareas y modelos». Se adopta la opción conservadora: coordinación de madre principal y respaldo rutinario de v2 con `gpt-6.1-sol` medium; programación Platform y revisión técnica con `gpt-6-astra` medium. Resto de carriles Sol6.1 medium. Esto sustituye la obligación histórica de usar Astra para toda tarea de las madres; no rebaja el modelo del código Platform sin otra decisión. La consulta opcional sobre ampliar Sol a correcciones simples queda pendiente, no asumida.

Una implementación activa como máximo y revisión posterior a la entrega, sin fan-out ni ronda documental paralela. No despertar chats finalizados sólo para cambiar su modelo. Asignaciones futuras llevan override explícito según tarea. No repetir suites ni revisiones aprobadas del mismo SHA. La tanda excepcional hasta85% terminó sus implementaciones/revisiones; se conserva la reserva normal20% para trabajo nuevo de fondo. Cuota compartida verificada84%; no estimar ahorro porcentual por modelo.

Default CLI local cambiado a Sol6.1 medium. Esto NO cambia este turno ni el selector de los chats ya abiertos o el modelo de cloud. En la madre actual seleccionar Sol6.1/medium en el selector de modelo de la app para hacer efectivo el cambio del chat; no hay herramienta directa expuesta para cambiar el modelo del propio turno. Heartbeat usa el modelo efectivo del chat; escribir el nombre de modelo en su prompt sólo documenta la política.

### Tabla histórica anterior, superada donde difiere de la precedencia

| Trabajo | Modelo y esfuerzo inicial | Motivo |
|---|---|---|
| Toda programación de Onia Platform y sus revisiones | `gpt-6-astra` · `medium` | Instrucción de Sergio: continuidad y riesgo del producto |
| Madre principal y madre v2, todas sus tareas | `gpt-6-astra` · `medium` | Instrucción de Sergio6-oct: subir ambas madres a Astra |
| Hermes, ventas, marca personal, Lucía, investigación y otros carriles no Platform | `gpt-6.1-sol` · `medium` | Calidad con tiempo y consumo controlados |

La distribución anterior de Astra/Sol/Luna (22-sep) queda superada para este relevo. No cambiar de modelo por
costumbre ni usar la receta histórica CLI `gpt-5.5` como límite de Codex Desktop. Subir effort solo ante duda material.
`send_message_to_thread` configura ambas madres con `model:gpt-6-astra`, `thinking:medium` para próximas continuaciones desde6-oct.
No demuestra cambio del modelo ya ejecutándose en el turno actual.
Asignaciones vigentes y progreso por SHA: `handoff/madre-codex.md`. Ambas madres usan Astra también en documentación/coordinación; no vuelven a Sol. La madre principal mantiene el lease.
Reserva20% semanal: al alcanzar80% usado no iniciar trabajo nuevo. Última muestra compartida23%usado/77%restante; no atribuible exclusivamente a este trabajo. No comprar créditos ni resetear límites.
Default CLI local comprobado6-oct: modeloAstra, efforthigh. Madre corrigió únicamente effort a medium y verificó TOML; no demuestra modelo/esfuerzo cloud. Los chats reciben override explícito de la tabla. La CLIcloud0.139 no expone --model; comprobar metadata del run/selector antes de trasladar trabajo. Runbook: `handoff/cloud-permisos-modelos.md`.

## Regla de escalamiento

1. Definir el resultado y su prueba antes de delegar.
2. Respetar la asignación de la tabla: Platform y ambas madres Astra; otros carriles Sol 6.1.
3. Antes de subir esfuerzo, acotar fuentes y formular la duda que impide cerrar.
4. Un cambio de esta distribución requiere instrucción de Sergio; no bajar calidad para ocultar consumo.
5. Comparar calidad con prueba concreta; ahorrar contexto y rondas vacías primero.

## Presupuesto de contexto

- Leer primero manifestos y runbooks cortos. No cargar `LUCIA.md` completo en cada turno.
- Compartir entre Codex y Claude artefactos del repo, no resúmenes reconstruidos desde el chat.
- Un subagente recibe una pregunta cerrada, fuentes limitadas y un formato de salida.
- No delegar una lectura que el agente principal necesita para cumplir una skill obligatoria.
- Reutilizar hashes, schemas cacheados por version y resultados JSONL.
- Una sola generacion paga candidata antes de variantes; una sola revision final fuerte.
- Terminar una inspeccion cuando ya existe evidencia suficiente para decidir. No explorar por
  curiosidad si no cambia la accion.

## Aplicación a Higgsfield y Lucía

- Sol 6.1 medium: identidad, procedencia/derechos, briefs, revisión, hashes, inventario y ledger de Lucía.
- Higgsfield hace la generacion. El LLM no debe regenerar prompts largos ni volver a leer toda la
  historia para cada job; consume el manifest compacto y el brief aprobado.

## Fuentes oficiales

- https://developers.openai.com/api/docs/guides/model-selection
- https://developers.openai.com/api/docs/guides/latest-model

Verificado 5-oct-2026 en [Model selection](https://developers.openai.com/api/docs/guides/model-selection):
GPT-6.1 Sol medium se recomienda para trabajo técnico complejo y entregables coordinados que se revisarán.
Esto respalda el balance elegido para la madre; Astra Platform es la preferencia expresa de Sergio.
La disponibilidad y límites dependen del producto/cuenta. Los precios API **no** permiten calcular cuotas ni
porcentajes de consumo de la suscripción ChatGPT/Codex; leer límites reales con `get_usage_limits` si hace falta.
