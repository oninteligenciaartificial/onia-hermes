# Enrutamiento de modelos para ONIA/Hermes

Estado: actualizado 2026-10-09 (alcance de Codex corregido el 17-oct: solo revisa PRs, `AGENTS.md` §1; esta tabla elige el modelo de esa revisión y de los subagentes, no autoriza a Codex a ejecutar código ni contratos cerrados). Aplica a Codex, subagentes y automatizaciones que permitan
elegir modelo. La disponibilidad puede variar por producto y cuenta.

## Decisión

| Trabajo | Modelo y esfuerzo inicial | Motivo |
|---|---|---|
| Arquitectura ambigua, decisiones de negocio, investigación multi-fuente, campaña final, revisión legal/comercial o cambios end-to-end | `gpt-6-astra` · `medium` | El costo de una mala decisión supera el ahorro de tokens |
| Código cotidiano, investigación acotada, documentación con juicio, QA integral | `gpt-6.1-sol` · `medium` | Balance de calidad, costo y velocidad |
| `rg`, inventarios, extracción, normalización JSON, cambios mecánicos, checks repetibles | `gpt-6-luna` · `low` | Alcance cerrado y verificable |

Subir esfuerzo solo si la primera pasada deja una duda material. Bajar a Luna cuando la tarea ya
esta especificada y su salida puede verificarse de forma determinista. No usar un modelo barato
para inventar estrategia, claims, oferta, identidad visual o veredictos finales.

## Regla de escalamiento

1. Definir el resultado y su prueba antes de delegar.
2. Usar el modelo mas liviano que pueda cumplir el contrato con evidencia.
3. Escalar a Sol cuando haga falta juicio o coordinar varios archivos.
4. Escalar a Astra cuando haya ambiguedad, riesgo comercial, identidad, muchas herramientas o una
   entrega final dificil de revertir.
5. Comparar modelos con el mismo input y conservar el mas liviano que pase el umbral de calidad;
   no decidir por impresion general.

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

- Astra: arquitectura de identidad, procedencia/derechos, rubrica y veredicto del A/B.
- Sol: preparar briefs, prompts, runbooks, wrapper CLI y revisar el lote.
- Luna: hashes, manifests, inventario de assets, polling, ledger y validaciones mecanicas.
- Higgsfield hace la generacion. El LLM no debe regenerar prompts largos ni volver a leer toda la
  historia para cada job; consume el manifest compacto y el brief aprobado.

## Fuentes oficiales

- https://developers.openai.com/api/docs/guides/model-selection
- https://developers.openai.com/api/docs/guides/latest-model

La guia oficial describe Astra para problemas ambiguos y entregables exigentes, Sol como conductor
cotidiano con juicio y Luna para tareas acotadas, triage y automatizaciones frecuentes. Tambien
recomienda evaluar con inputs representativos y mantener la opcion mas liviana que alcance el
umbral de calidad.
