# Jelou → aplicación ONIA

Fecha: 2026-10-06. Alcance: revisión pública focalizada; no auditoría técnica ni prueba contratada.

META: extraer una mejora aplicable a la demo dental sin ampliar la 1.0 por imitación.
PRUEBA DE HECHO: fuentes registradas y matriz de comprobación incorporada al guion comercial existente.
REGLA DE PARADA: cerrar con esa adaptación; no crear cuentas, contratar, publicar ni abrir desarrollo sin priorización.

## Hallazgo y límite

[Jelou](https://jelou.ai/en/) vende agentes que ejecutan procesos, con herramientas de pagos, identidad y firma. Su [caso Veris](https://jelou.ai/en/case-studies/veris) es la referencia más cercana al vertical dental: un recorrido de atención por chat con escalamiento humano. Son capacidades y resultados presentados por el proveedor; esta revisión no los ensayó.

**Inferencia comercial:** el aprendizaje útil es demostrar un trabajo completo y su resultado observable. Una animación de conversación o un catálogo de funciones no demuestra ejecución. No corresponde deducir superioridad técnica, costes o meses de diferencia desde una web.

## Comparación con nuestro alcance documentado

| Dimensión | Referencia pública | ONIA según catálogo local; no verificación de producción |
|---|---|---|
| Atención conversacional | Jelou presenta ejecución de procesos en chat | WhatsApp pendiente de prueba real; el alcance documentado envía enlace de reserva y deriva, no agenda dentro del chat |
| Trabajo clínico | El caso Veris describe el recorrido del paciente | El catálogo ONIA incluye ficha, odontograma, agenda y cobros; no implica equivalencia con la plataforma Jelou |
| Evidencia comercial | Casos publicados por el proveedor | Nos falta demostrar recorridos completos con cuenta demo autorizada y capturas verificadas |
| Pagos | Jelou presenta componentes transaccionales | Registrar saldo no acredita cobro bancario ni emisión SIAT; ambos requieren sus pruebas y gates propios |

Fuente ONIA: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`, §§2–8, consultado en esta revisión. No se usan estados históricos como prueba live.

## Decisión aplicada

Se amplió `datec-battlecard-onia.md`, el guion canónico ya existente, con una matriz de evento → acción → registro → excepción humana. No se duplica otra demo ni se modifica el producto.

Usar primero la rama que resuelve la necesidad de recepción y anotar el resultado. Para venta, texto original condicionado a demo preparada: «Elija una tarea de su clínica. La comprobamos con un paciente de ejemplo y dejamos claro qué resuelve Onia y qué necesita intervención de su equipo».

Medición propuesta para un piloto autorizado: reservas completadas / intentos válidos, inasistencias / citas elegibles y casos derivados / casos iniciados. Registrar periodo, denominador y línea base; sin porcentajes objetivo inventados ni resultados de Jelou atribuidos a ONIA.

Se pospone construir un Studio genérico, KYC, firma o crédito: no hay evidencia en este pedido de que sean necesarios para cobrar a las primeras cinco clínicas. Integrar Jelou como proveedor también queda sin evaluar hasta conocer precio, contrato, API y compatibilidad local.

Estado: adaptación documental terminada; ejecución de demo bloqueada por cuenta y capturas verificadas ya pendientes. Sin nueva solicitud de login ni tarea duplicada para Lucía. Evidencias: `raw/jelou/2026-10-06/evidence-notes.md`.
