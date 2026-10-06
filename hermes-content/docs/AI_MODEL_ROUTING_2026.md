# Enrutamiento de modelos para ONIA/Hermes

Estado: actualizado por instrucción de Sergio del 2026-10-05. Aplica a Codex, subagentes y automatizaciones que permitan
elegir modelo. La disponibilidad puede variar por producto y cuenta.

## Decisión

| Trabajo | Modelo y esfuerzo inicial | Motivo |
|---|---|---|
| Toda programación de Onia Platform y sus revisiones | `gpt-6-astra` · `medium` | Instrucción de Sergio: continuidad y riesgo del producto |
| Madre, v2, Hermes, ventas, marca personal, Lucía, investigación y otros trabajos | `gpt-6.1-sol` · `medium` | Instrucción de Sergio: calidad con tiempo y consumo controlados |

La distribución anterior de Astra/Sol/Luna (22-sep) queda superada para este relevo. No cambiar de modelo por
costumbre ni usar la receta histórica CLI `gpt-5.5` como límite de Codex Desktop. Subir effort solo ante duda material.
`send_message_to_thread` a la madre aceptó `model:gpt-6.1-sol`, `thinking:medium` para próximas continuaciones.
No demuestra cambio del modelo ya ejecutándose en el turno actual.
Asignaciones vigentes y progreso por SHA: `handoff/madre-codex.md`. La v2 usa Astra sólo para revisión Platform y vuelve a Sol para documentación/coordinación. La madre principal mantiene el lease.
Reserva20% semanal: al alcanzar80% usado no iniciar trabajo nuevo. Última muestra compartida23%usado/77%restante; no atribuible exclusivamente a este trabajo. No comprar créditos ni resetear límites.
Default CLI local comprobado6-oct: modeloAstra, efforthigh. Madre corrigió únicamente effort a medium y verificó TOML; no demuestra modelo/esfuerzo cloud. Los chats reciben override explícito de la tabla. La CLIcloud0.139 no expone --model; comprobar metadata del run/selector antes de trasladar trabajo. Runbook: `handoff/cloud-permisos-modelos.md`.

## Regla de escalamiento

1. Definir el resultado y su prueba antes de delegar.
2. Respetar la asignación de la tabla: Platform Astra; resto Sol 6.1.
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
