# Dos proveedores con una sola coordinación — borrador de diseño

Estado: propuesta, 2026-10-15. No activa servicios, rutinas ni despachos. [NotebookLM ONIA · Ingeniería de agentes · Piloto](https://notebook.google.com/notebook/4976c6a9-2609-4f63-98db-514149c85f82) fue consultado con 40 fuentes seleccionadas; su síntesis orienta preguntas, pero las capacidades se validan con fuentes originales y pruebas de ONIA.

## Hechos y límite de evidencia

- [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) documenta subagentes con contexto y herramientas propios dentro de una sesión, compartiendo sus límites de uso. [Claude Code en la web](https://code.claude.com/docs/en/claude-code-on-the-web) y [Routines](https://code.claude.com/docs/en/routines) documentan ejecución remota; Routines puede continuar con la laptop apagada. Que *los subagentes funcionen en la modalidad Cloud concreta de ONIA* sigue **UNKNOWN** hasta prueba acotada allí.
- [Codex Cloud](https://help.openai.com/en/articles/20001545-using-codex-cloud) ejecuta tareas remotas. La [API multiagente de OpenAI](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) describe otro producto y no prueba subagentes en una tarea Codex Cloud concreta.
- ONIA probó una invocación local Claude Code **PASS con `claude-sonnet-5-5`**, exit 0 y respuesta `COLABORACION_LOCAL_OK`; recibo temporal `C:/Users/PC/AppData/Local/Temp/claude-collab-test-result-20261015.json`, SHA-256 `86addb5f034d8124259574ac29ef8e7479a5922274d7ed1afd5da8eabacc5493` verificado localmente. Esto prueba solo esa invocación local, sin herramientas web; cualquier `cost_cli_estimate` del recibo es una estimación, no factura ni costo real. El ensayo setup-only de Codex, UUID `9fc238a7-aa41-433c-8681-a9bf6ec6a340`, quedó en `INSTALLED_METADATA_ONLY` y es independiente del R4 fallido; navegador, E2E y operación con PC apagada siguen sin prueba.
- El adaptador Claude actual usa safe/restricted mode, `--tools ""`, un turno y sin persistencia de sesión. Sirve para una consulta o revisión de texto acotada; **no** ejecuta un agente con herramientas, subagentes ni hereda las skills de ONIA.

## Diseño mínimo recomendado

Codex coordina ahora con la cola y el ledger de efectos existentes. Claude y Codex son proveedores de ejecución; cada uno puede administrar sus subagentes *dentro de la sesión y capacidad demostrada*, sin crear una segunda autoridad para la cola. Hermes remoto sería coordinador futuro solo después de permiso para infraestructura y prueba de continuidad con PC apagada. Mantener una operación/nonce por efecto externo, un dueño con lease/fencing, recibos vinculados a tarea/proveedor/intento y cuotas registradas. No transferir secretos ni sesiones personales al VPS.

Un futuro contrato de agente con herramientas debe inyectar la orden humana, las instrucciones aplicables `AGENTS.md`/`CODEX.md`, y únicamente la skill pertinente con ruta/hash verificados y permisos explícitos. No cargar la biblioteca completa por defecto. `task_id`, nonce y recibos viven en la cola/ledger canónicos fuera de la sesión del proveedor; registrar cambios de modelo observados en su JSON. No asumir que una sesión de un proveedor se puede reanudar en el otro.

El fallback entre proveedores se permite antes de reservar o despachar un efecto, si capacidad, cuota, costo y autorización del destino están verificados. Después de reservar, enviar o perder certeza sobre el resultado, conservar nonce/estado `needs_reconcile`; observar y reconciliar el efecto original antes de otro intento. Un fallo de cuota pausa o elige proveedor elegible antes del efecto; no rota cuentas/credenciales automáticamente. Los subagentes no pueden eludir esta barrera.

Enrutamiento económico propuesto: optimizar **costo, latencia y consumo de cuota por tarea aceptada**, no número de llamadas ni precio nominal del modelo. Usar Sonnet o Sol para tareas normales; Luna solo para pasos mecánicos y deterministas con contrato verificable; Astra u Opus cuando el riesgo, la ambigüedad o un error material justifiquen revisión más fuerte. No hacer fanout de ambos proveedores por defecto. El snapshot de cuentas observado el 2026-10-15 es Codex 22 % de ventana semanal consumida (78 % disponible), créditos extra 0, `ordinaryUsageAllowed=true`; Claude Max 10 % semanal consumido, 0 % de sesión, extra usage desactivado. Estos porcentajes no son tokens, dólares facturados ni garantía de capacidad futura. La primera tarea útil tras QA podría ser una revisión Claude acotada del contrato browser, sin repetir una revisión completa solo para un benchmark.

| Etapa | Gate verificable | Salida permitida |
| --- | --- | --- |
| 1. Adaptador Claude local | Invocación acotada, recibo sanitizado con modelo/costo/resultado y tests del adaptador | Proveedor local disponible solo con PC encendida |
| 2. Cola común | Claim/lease/fencing, nonce, estado de efecto y recibo persistidos; fallo ambiguo no reintenta | Enrutamiento manual o automático **antes** del efecto |
| 3. Cloud por proveedor | Grant independiente, prueba real de tarea y subagentes si se requieren, límites/cuotas observados | Uso remoto del proveedor probado, sin inferir paridad entre productos |
| 4. Navegador/E2E | Nuevo ensayo browser con identidad y permiso propios, recibo real; reconciliación separada del R4 anterior sin replay | Afirmar solo el flujo efectivamente probado, sin renombrar el R4 fallido |
| 5. Hermes remoto/PC-off | Permiso de despliegue, runner remoto, checkpoint/lease/recovery, prueba con laptop apagada y rollback | Coordinación remota; antes de eso, **UNKNOWN** |

El costo por tarea y el ahorro son **UNKNOWN** hasta medir recibos comparables de ambos proveedores; el diseño evita prometer ahorro por usar subagentes o fallback.
