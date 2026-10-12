# Enrutamiento de modelos para ONIA/Hermes

Estado: política vigente de modo ahorro 2026-10-12; conserva decisiones previas como historial subordinado. Aplica a Codex, subagentes y automatizaciones que permitan elegir modelo. La disponibilidad puede variar por producto y cuenta.

## Decisión vigente — modo ahorro, Sergio Urcullo 12-oct-2026

- Madres: **gpt-6-luna · low**, solo delegan, revisan evidencia y resumen. Hermes, comprobaciones, recuperación y mecánica verificable: Luna low.
- Código Platform: **gpt-6.1-sol · medium**; QA focal independiente: **Sol low**; cambios mecánicos: **Luna low**.
- Workers creativos existentes de Marca, Lucía y Ventas/pauta: **Sol 6.1 low**; delegar a Luna low solo la parte mecánica.
- Astra no es predeterminado ni escalación automática. Usarlo requiere excepción específica de Sergio, sustentada en un fallo demostrado o riesgo material evidenciado.
- Máximo 1 ejecutor y 1 revisor focal por lote de cada carril; sin fanout masivo. Pruebas proporcionales; usar deltas, no historia/diffs enteros ni repeticiones. Sin loops nuevos y sin ACK si no hay cambio.
- Registrar configuración aceptada y modelo efectivo por separado. No afirmar ahorro medido ni cambio de cuota; esta política tampoco modifica runtime automáticamente.

## Decisión histórica — 9-oct (subordinada a la anterior)

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
