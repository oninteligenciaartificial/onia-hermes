# Revisión acotada del adaptador Windows

24-oct-2026 · `task_479c0f7eee14` · `ctx_6d92f292d68b`.

**Dictamen: CAMBIOS NECESARIOS en la restricción por evento.** No encontré retirada de decisiones de bloqueo; el punto pendiente es que la transformación visual se limita por acción, no por evento Pre/Post compatible.

## Prueba propia

- SHA-256 de `.hermes/tasks/codex-windows-launcher-review-copy.cjs`: `3dccd31e79becfb25d8d9b0606fe610bba2a73658d728de3422957fe17e65298`, coincide con el hash esperado. No inspeccioné el instalado ni otros proyectos; su igualdad con esta copia es información del coordinador.
- Leí la copia y `.hermes/tasks/codex-windows-regression-results.json`: 19 fixtures registrados como pass, alcance expresamente inerte. Son resultados del padre leídos, no pruebas reejecutadas aquí; el resumen no incluye las entradas de cada fixture.
- Ejecuté `node --check .hermes/tasks/codex-windows-launcher-review-copy.cjs` y después `Write-Output ONIA_HOOK_FINAL`: exit0 y salida literal `ONIA_HOOK_FINAL`. No ejecuté el cuerpo del adaptador: el chequeo de sintaxis no lanza sus procesos hijos ni escribe su traza.

## Resultado de lectura

La transformación exige `result.status === 0`, acción `file-context` u `observation`, JSON objeto no array y `suppressOutput === true`. Solo borra esa propiedad y serializa el objeto. Conserva `continue:false`, `stopReason`, `permissionDecision`/deny y los demás campos JSON. Con exit distinto de cero no transforma stdout; con JSON inválido lo deja intacto. Propaga stderr y el código de salida; errores de lanzamiento o fallo al escribir traza terminan en error. No hay conversión deliberada de una denegación o fallo en éxito en el bloque revisado.

**Residual concreto:** la condición de transformación (línea43 de la copia) no comprueba `event`. Por lectura del código, una entrada con `hook_event_name: "Stop"` o evento ausente, acción `file-context` y salida exitosa `{"suppressOutput":true,"continue":false}` también perdería `suppressOutput`. Se conservaría `continue:false`, pero la adaptación ya no estaría restringida a Pre/Post compatibles. Es un contraejemplo estático, no una ejecución realizada. El fixture resumido `other_event_untouched` no permite descartar ese caso porque no muestra acción/entrada.

**Corrección concreta propuesta, no aplicada:** exigir además la pareja compatible de acción/evento (`file-context` con `PreToolUse`, `observation` con `PostToolUse`), y conservar salida original ante evento distinto, ausente o no parseable. Añadir esa combinación negativa al fixture antes de afirmar que solo se adapta Pre/Post. No afirmo que el enrutamiento instalado esté mal: no se inspeccionó; la copia por sí sola no impone ese límite.

## Límite de hooks y cierre

Comandos y esta escritura con `apply_patch` proporcionan actividad real para observar PreToolUse/PostToolUse/Impeccable. **Hermes verifica traza y UI**: los resultados de la API no certifican ausencia de `Hook failed`, carga de handlers ni salud posterior a worker_done. No cambié configuración, permisos globales, binarios ni paquete de contenido. H1–H7 permanecen aprobados como borrador privado según su cierre existente y no fueron revisados de nuevo.

## Fe de cierre del único residual · 24-oct-2026

Tarea `task_0df405935469`, dispatch `ctx_6e84924f5ec8`. **RESUELTO: APROBADO en el alcance estático revisado.** Esta fe sustituye el dictamen pendiente anterior exclusivamente respecto de la restricción por evento.

Leí `.hermes/tasks/codex-windows-launcher-final.cjs`: `compatibleToolEvent` exige exactamente `file-context`/`PreToolUse` u `observation`/`PostToolUse`, y la transformación requiere esa condición. Con `Stop`, evento ausente o entrada no parseable la condición no se cumple y se conserva la salida. La comprobación de éxito y las salvaguardas de salida JSON ya revisadas siguen en el bloque; no se reabrió otra auditoría.

SHA-256 calculado de la copia final: `edf7c4e22f4fcb40a02bb80f27d1a3726f92fb9add7d1c9eebcf32deae42686b`, coincide con el esperado. La identidad con el instalado la informa Hermes; no inspeccioné el instalado. Ejecuté personalmente `node --check .hermes/tasks/codex-windows-launcher-final.cjs`: **exit0**, sin salida. No ejecuté el cuerpo del adaptador.

Leí `.hermes/tasks/codex-windows-regression-final.json`: **25 fixtures pass informados por Hermes**, incluidos los seis casos acción/evento Stop, ausente y malformado para ambas acciones. Son resultados leídos del padre, no reejecutados por mí; su alcance sigue siendo fixtures inertes, no certificación de runtime.

Hermes observa traza y UI de este turno. No se infiere ausencia de errores de hooks desde los outputs de herramientas, ni se certifica carga/salud de todos los handlers. No modifiqué código, configuración ni contenido; con esta fe concluye la comprobación puntual.
