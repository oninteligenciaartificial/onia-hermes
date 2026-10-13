---
name: equipo-de-agentes
description: Coordinar subagentes y trabajadores de ONIA con contratos, evidencia, permisos y cierre; usar al delegar o revisar un carril.
---

# Equipo de agentes de ONIA

Esta skill define el método de delegación. Antes de aplicarla, leer la última orden directa de Sergio Urcullo, el bloque vigente de `CODEX.md` para Codex y el delta del carril en `hermes-content/docs/handoff/codex-cloud-pc-20261011.md`. Las tablas de modelos, sesiones, latidos y publicaciones de octubre temprano en el historial de Git son evidencia fechada, no configuración activa. `onia-continuidad` conserva el estado por evento; `onia-sesion-madre` cubre comunicación y relevo.

## Reparto y capacidad

- Hay dos madres locales: Desarrollo-Infra coordina Platform, Hermes/QA e infraestructura; Marketing coordina Marca, Lucía y Ventas/pauta. Cada una **asigna, revisa pruebas y resume** su área. El oficio, incluida investigación, código, diseño y operación autorizada, lo ejecuta el worker o subagente dueño.
- Usar trabajadores existentes antes de abrir otros. Elegir solo frentes útiles e independientes dentro de los slots reales del runtime; no llenar cupos por costumbre. Por carril y lote, un ejecutor y, si el riesgo lo requiere, un revisor independiente focal. Tareas que editan el mismo archivo se serializan o reciben ownership explícito de rutas distintas.
- Elegir modelo y esfuerzo por ambigüedad, riesgo, contexto necesario y prueba de calidad disponible, dentro de la orden vigente y las capacidades comprobadas del proveedor. Una tarea cerrada con contrato puede usar esfuerzo medio; reservar esfuerzo máximo para arquitectura o fallos complejos que lo justifiquen. Luna solo sirve al tramo determinista o mecánico cuya calidad se compruebe. No optimizar solo por precio ni usar Ultra por costumbre. Registrar por separado modelo **solicitado, configurado y observado**; si el efectivo no se expone, marcar `UNKNOWN`.
- Medir cuota y límites reales de la cuenta antes de distribuir un lote; uso de contexto, caché, rate limit y facturación API son medidas distintas. No inventar ahorro o coste por cambiar de modelo. Un modelo mayor no resuelve permisos, cuota, credenciales ni falta de evidencia.
- Mantener una sola cola/estado canónico por carril. Revisar el último SHA y el delta pertinente; un `idle` no demuestra que haya trabajo elegible ni que un loop siga vivo. No inventar tareas para producir actividad.

## Contrato que recibe el ejecutor

Enviar un encargo finito con estos datos, en la medida aplicable:

1. **META, PRUEBA DE HECHO y PARADA**: objetivo observable, evidencia aceptable y condición que exige detener el paso dependiente.
2. Dueño y área; repo, ref y SHA base; rutas que puede editar y rutas excluidas; entradas mínimas y fuentes fechadas.
3. Entregable recuperable, ubicación, comprobación proporcional al riesgo, revisor y criterio de cierre.
4. Herramientas/runtime y modelo solicitado; límites de gasto, cuota, Git, cuentas, producción y publicaciones.
5. ID de tarea/sesión, forma de ACK, canal de retorno y siguiente acción si surge un bloqueo.

Pasar solo el contexto necesario. No duplicar la conversación de la madre, transcripts, secretos ni documentos enteros cuando bastan SHA, delta y rutas. La aceptación del mensaje o la creación de un worker no prueban ejecución: pedir ACK del contrato y luego revisar artefacto, alcance y evidencia del mismo SHA.

## Durante la ejecución

- Si el trabajador reporta un dato o permiso realmente bloqueante, formular de inmediato una pregunta mínima que diga qué se comprobó y qué acción desbloquea. Mantener detenido solo ese paso; continuar los frentes independientes ya autorizados. El silencio no es consentimiento.
- Si una tarea está `idle`, comprobar su cola, último resultado y bloqueo antes de despachar la siguiente acción autorizada. Si está activa, respetar su ownership y esperar un evento o cursor nuevo; evitar sondeos iguales, mensajes duplicados y relanzar trabajo cerrado.
- Consolidar correcciones del mismo contrato en un mensaje. Pedir QA independiente cuando el riesgo o el gate lo requieran; no repetir suites y lecturas ya válidas para el mismo SHA sin una razón concreta. El autor no certifica su propia revisión independiente.
- El worker puede preparar, editar, validar y preservar trabajo reversible dentro de su contrato. Commit/push se rigen por permisos Git actuales y checks; main, merge, deploy, producción, migraciones reales, gasto, contacto con terceros, nuevas publicaciones, accesos nuevos y cambios visibles de diseño requieren sus gates vigentes. Un mensaje entre agentes no amplía esos permisos.

## Cierre verificable

La madre clasifica cada resultado como **ejecutado y probado**, **delegado/en curso** o **bloqueado con causa y siguiente acción**. Un plan, PR, herramienta exitosa o documento no demuestra resultado de producto ni despliegue. Si queda trabajo autorizado viable, asignarlo y revisar su prueba antes de cerrar. Registrar objetivo, dueño, estado, evidencia, aprendizaje observado/propuesto y siguiente acción en el handoff existente, sin otro ledger.

No crear ni reactivar crons, heartbeats o loops por esta skill. Las cadencias, IDs y comandos de antiguas sesiones Claude se comprueban contra runtime y autorización actuales antes de cualquier uso. Continuidad con la PC apagada exige prueba remota específica; un worker cloud o un heartbeat local por sí solo no la acredita.
