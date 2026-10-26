---
name: equipo-de-agentes
description: Método ONIA para delegar y verificar entregas. Hermes planifica; scripts/orquesta reparte. Usar al coordinar, despachar o revisar un encargo, no para iniciar loops históricos.
---

# Equipo de agentes de ONIA

## 1. Contrato y responsabilidad

Hermes mantiene un responsable general. El programa fijo `scripts/orquesta/` reparte la cola canónica; `scripts/orquesta/README.md` define su contrato. No hay madre, ronda periódica ni latido por defecto. La sesión principal trabaja con Sergio Urcullo.

Antes de despachar: META, archivos de salida/propiedad, fuentes mínimas, permisos, PRUEBA DE HECHO y REGLA DE PARADA. No inventar un sprint para una sesión solo preparada. Un bloqueo no permite cambiar de cuenta, presupuesto o frontera de seguridad.

El recibo debe distinguir modelo solicitado/configurado del observado, herramientas realmente disponibles y número de auxiliares autorizado. Un límite de llamadas escrito en el prompt no es un hard cap del runtime; contar el resultado real y no equiparar llamadas API, herramientas, tokens y factura.

## 2. Elegir una vía y separar archivos

- Una vía de despacho por tarea; Orca y la cola del repo no ejecutan la misma unidad a la vez.
- Subagentes internos para encargos acotados; Claude/Codex externos cuando el contrato requiera esa CLI/sesión. Modelo, contexto y permisos de un ejecutor no se heredan del coordinador.
- Revisiones de solo lectura pueden compartir checkout con artefactos distintos. Para editar, asignar worktree/rama y archivos exclusivos; lo que comparte escritura o servicio se serializa.
- Un worktree no es sandbox ni sesión autenticada. Respetar capacidad de hijos/recursos, reservando revisión sin aumentar el cupo por reflejo.
- Codex despachado no hace Git, publicación u orquestación fuera de su contrato. Entrega resultado, prueba y bloqueos, no permisos nuevos. El coordinador verifica y realiza solo las transiciones autorizadas.
- Los hijos internos Hermes son hojas cuando no tienen herramienta de redelegación. Una sesión Claude/Codex solo usa auxiliares propios si su cliente los expone y el contrato los autoriza dentro del cupo total; no se supone esa capacidad ni se crea otra cola para aparentarla.

## 3. Entrega y siguiente acción

- Mensaje aceptado no prueba consumo; fin de turno no prueba entregable. Leer el artefacto exacto y ejecutar/contrastar la prueba antes de aprobar.
- Revisar contra el pedido: seguridad, corrección, cobertura y aceptación editorial cuando corresponda. Cuentas/hashes correctos no prueban valor educativo o estética.
- **Revisor independiente del coordinador:** antes de declarar terminado un hito o relevar su responsabilidad, un agente distinto contrasta el pedido y sus criterios con los artefactos actuales, las pruebas y lo que Hermes afirma. Recibe el contrato y fuentes, no solo el resumen del autor. Devuelve APROBADO, RECHAZADO o BLOQUEADO, con evidencia y faltantes concretos. Sin revisión, declarar «pendiente de revisión», nunca «terminado». Luna sirve para comprobaciones acotadas; decisiones complejas o sensibles requieren un revisor acorde al riesgo. La aceptación editorial sigue siendo de Sergio Urcullo.
- Ejecutar esa revisión por hitos, no con vigilancia permanente, un segundo coordinador ni un loop de auditorías. El revisor no modifica ni publica: devuelve defectos al responsable, quien corrige y solicita una comprobación de esos defectos. Respetar el cupo total de dos ejecutores; reservar o liberar un puesto para revisar. Esta regla es un procedimiento, no un bloqueo técnico infalible ni garantía de cero errores.
- Si falta corregir, enviar hallazgos reproducibles al autor original; congelar la corrección y comprobar solo esos hallazgos. Fijar un límite de ciclos, sin auditorías generales indefinidas.
- Al terminar, actualizar estado y avisar brevemente aquí con alcance y verificación. Continuar la siguiente acción del mismo encargo si está autorizada; no esperar otro prompt ni activar pendientes ajenos.

## 4. Modelos, coste y relevo

`hermes-content/docs/AI_MODEL_ROUTING_2026.md` rutea por complejidad/riesgo. Usar el modelo más liviano que cumpla la prueba; no atribuir a cuotas, tokens o contexto una factura no medida. No cambiar el principal por una tarea mecánica ni prometer gratuidad de una API.

Cargar solo contexto pertinente. La skill/handoff no entrena pesos ni prueba aplicación. Al relevar: objetivo, permisos, artefactos, pruebas, fallos, procesos y siguiente acción; confirmar recepción, sin otra madre ni borrado de historia.

Relevar por ocupación efectiva y señales verificables de degradación, no por tokens acumulados ni un porcentaje genérico. El relevo requiere recepción y primera acción del sucesor. No reiniciar, limpiar historial o cambiar retención para simular contexto libre.

Visibilidad en Hermes TUI: `/agents` muestra procesos/subagentes; seleccionar y `d` para detalles/modelo, `t` para actividad. La barra compacta desaparece sin actividad. No es el backlog completo ni una sesión de Orca; las entregas finalizadas se concilian con la lista nativa y su evidencia.

## 5. Publicar

Rige `AGENTS.md` y `CLAUDE.md` §«Qué se publica sin preguntar»: lo visible a cliente/público llega con captura/video real y espera el OK de Sergio Urcullo. Arreglos sin cambio visible, infra y migraciones revisados siguen sus condiciones y backup/rollback. Gasto, terceros, actos legales, cara/voz y producción conservan sus aprobaciones. Nada de esto supera el límite de un Codex despachado ni un veto del encargo.

## 6. Trato y aprendizaje

Prosa normal, corta y al grano, sin «Pasó/Necesito/Sigue». Usted con clientes/web/anuncios; vos con Sergio Urcullo y marca personal. Link sin instrucción: aprender, no producir. Ante referencias, `aprender-de-todo` exige evidencia por dimensión y prueba de uso; una ficha guardada sola no acredita mejora.

## 7. Trampas vigentes

- No `--union` en colas/handoffs: puede reabrir casillas cerradas. Preservar estado vigente e incorporar lo nuevo explícitamente.
- Pruebas de otro entorno no certifican esta entrega; correr gates del carril, no ocultar fallos con filtros de salida.
- Hook configurado/worker_done no prueba salud. No desactivar hooks ni ampliar permisos para esconder errores; ver la revisión/runtime pertinentes.
- Verificar contexto de Git y cambios ajenos antes de integrar. Auto-sync/Stop no autoriza publicar ni resuelve conflictos.
- No cerrar Chrome, WhatsApp ni otras apps personales para facilitar la tarea. RAM, disco, permisos y procesos se miden en el host, no se heredan de un incidente viejo.
- Render, navegador y herramientas deben existir en este runtime; una receta histórica de otro host no prueba disponibilidad ni autoriza instalar.

## 8. Historia y evidencia

El método anterior completo, incluidas rondas, latidos y casos fechados, se conserva en `hermes-content/docs/historial/equipo-agentes-anterior-20261025.md`. No ejecutarlo como instrucciones actuales. `onia-sesion-madre` conserva canales históricos, no autoridad de orquestación.

Ejemplo actual de contrato → entrega → verificación: informes y pruebas en `hermes-content/research/harness-hermes-20261024/`; para la enseñanza sobre contexto/checks/orquestación, ficha `hermes-content/references/video-intake/2026-10-25-leon-harness-z1EaBe9oIME.md`. Esa referencia no certifica un scheduler 24/7 ni activa nuevos servicios.
