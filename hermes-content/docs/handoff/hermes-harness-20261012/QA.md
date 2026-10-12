# QA independiente del harness — 12-oct-2026

**Aceptado como propuesta documental y validación offline; no activación.** Revisor real /root/qa_independiente, modelo configurable solicitado gpt-6.1-sol; servido no observable. Independiente del implementador; sin subdelegación, dispatch, scheduler, CLI401, Platform/Confirmador ni llamadas Alfred.

Ruta revisada /workspace/work/hermes-harness/repo/hermes-content/docs/handoff/hermes-harness-20261012: README.md, contract.json, gate.py y test_gate.py. La revisión previa detectó flags truthy y checkpoint vacío; autor corrigió antes de RUNREADY. Sin fixes pendientes que bloqueen alcance offline.

## Evidencia nueva y alcance

QA fetch propio por GitHub de hermes-content/docs/audits/SUPERVISOR-CLOUD-INVENTARIO-20261012.md en ae12aa635dcb27cb37b09c7f3b72db35bb26b778 devolvió blob47d345575ee856ecfae814cc4dc45ebeb74c2c35, idéntico al contrato. Addendum vigente: Alfred lectura5PASS documentada; envío único Hermes20:19UTC NOT_FOUND/CloudThreadNotFoundError sin turnId; lectura posterior sin canario. Esto supera falta de lectura inicial documental, pero no demuestra envío/wake. QA verifica fuente documental, no repite operación real. Correcta separación de lectura Alfred y herramientas del runtime Hermes.

Routing del contrato: madres Sol6.1; código Platform Astra; mecánica Luna y QA Sol. Cinco IDs y owners coinciden con registro canónico. Automatizaciones MarketingACTIVEhourly followup y legacyPAUSED son declaraciones madre; no prueba loopPlatform/cloudwake. No se adoptan triggers históricos.

## Pruebas propias

`python test_gate.py`, desde directorio artifact: exit0, **18/18 PASS**, chunkb6c228. Solo stdlib, fixtures temporales y concurrencia local; sin red/API/worker. Revisión adversarial independiente por script inline, exit0 chunk8bc0bc: cuatro errores terminales NOT_FOUND/CloudThreadNotFoundError/401/403 bloquean incluso recibo con turno/canario; siete flags string false no autorizan; canario string false no confirma; contract trigger apagado, quota sin measurement/newlimit y recibo real sin ACK. No implementación nueva.

Casos relevantes comprobados: idle+blocked no se confunde con trabajo nuevo; transición blocked→pending exige nueva evidencia coincidente; cerrado no reabre; snapshot fresco requerido; active turn/reserva incierta/clave completada excluyen duplicado; attemptcounter exactint0 y errores terminales sin retry; quota current+sourced y límite autorizado sin cifras inventadas; scope/aprobación y trigger oficial; checkpoint exactschema/identidades/revisión/paso; O_EXCL permite solo una reserva para dos contratos del mismo worker. Recibo turnId+canario es inicio, nunca completitud.

O_EXCL/fsync es prueba **local**, no exclusión distribuida ni almacén remoto activado. Restauración compara checkpoint; reconciliación turn/reserva requerida por policy, integración remota no implementada. Flags/evidencias de fixtures son simulaciones, no estados/consumo reales. No liberar reserva por timeout/idle. Contract false/null mantiene operación retenida; eligible no significa enviado.

## Integridad revisada

- README.md SHA2567bd876d4b1839dcfce7c746a745ee2baf6f7372f54b3f558d2ca69a0e556c4c0.
- contract.json SHA25652f658b31c18fe0c6ee90fe4d4f5b631968fcdeef350273db836084a9fbc1bc6.
- gate.py SHA2562fd3350b7198a17ae3446a2f08b22074fb20fab4f835130b466a3aacbe9a0dff.
- test_gate.py SHA256246b21018a1b65cadccba8ac2af29c1421830d228324443bf274ca8b26f98a41.

Git status durante QA solo artifact nuevo sin versionar; revisor no editó producto ni índice audit compartido. QA fuera de namespace autor para copia revisada posterior. No inferir preservación remota hasta commit/push verificados.

## Única parada externa

Artefacto preparado y validado offline. **Operación sigue bloqueada por follow-up oficial al Hermes existente sin turno/canario confirmado.** La evidencia no atribuye causa a UUID/login/cuota/VPS ni aporta arreglo usuario comprobado. Incidencia producto preparada, no enviada; madre coordina trámite autorizado. Continuación humana en mismo chat UI oficial disponible. No scheduler/reintento/reemplazo nuevo para rodear ese bloqueo; no afirmar supervisor autónomo.
