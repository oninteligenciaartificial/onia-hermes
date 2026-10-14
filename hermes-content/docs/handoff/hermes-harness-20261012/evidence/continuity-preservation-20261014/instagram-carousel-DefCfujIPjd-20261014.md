# Registro de referencia — Claude Code / Boris Cherny

- Fuente recibida: https://www.instagram.com/p/DefCfujIPjd/?img_index=6&vrfl=b3lsaDE0cWh0dGJl
- Revisión: 2026-10-14; hora final registrada: 2026-10-14 22:49:26 UTC.
- Cuenta/autor visible: `@claudeai`, verificada.
- Antigüedad visible al consultar: `4 h` / «Hace 4 horas». Instagram no expuso en pantalla el timestamp absoluto; la fecha exacta queda UNKNOWN (el día aparente es 14-oct según el contexto de revisión).
- Total visible: seis indicadores de lámina; la URL solicitada y el estado del carrusel ubican la lámina seleccionada en 6/6.
- Cobertura visual real: **1/6**. La lámina 6 se vio en pantalla. No se logró capturar el contenido visual de las láminas 1–5; el árbol accesible no incluía texto alternativo útil. No se infiere su contenido.

## Evidencia observable

**Caption visible (paráfrasis):** dice que Boris Cherny, ingeniero detrás de Claude Code, usa cientos de agentes por día y lleva meses sin responder manualmente a revisiones de código; presenta lo que sigue como consejos para aprovechar Claude Code. Estas son afirmaciones del caption de Instagram, no mediciones independientes de esta revisión.

**Lámina 6/6:** gráfica titulada “Be open to being wrong”, con una fotografía de Boris Cherny, el rótulo `/rewind` y una cita que dice que ahora se equivoca con frecuencia y que debe descartar parte de lo aprendido sobre ingeniería a lo largo de los años. La cita y su atribución se registran tal como las presenta la pieza, sin verificación independiente de la entrevista de origen.

**Propuesta observable:** mantener apertura para corregir creencias o prácticas técnicas cuando nueva evidencia las contradiga. La referencia gráfica a `/rewind` es parte del diseño; no demuestra por sí misma que el producto o el entrevistado propongan una operación de rollback de infraestructura.

## Utilidad para ONIA / decisión

- Utilidad conceptual acotada para Infra: revisar supuestos técnicos con evidencia actual, y distinguir lo medido de lo inferido antes de cambiar decisiones.
- El repo ya contiene ese mecanismo de trabajo: `CODEX.md` exige evidencia para el cierre y diferencia estados; `.claude/skills/onia-continuidad/SKILL.md` pide registrar evidencia y aprendizaje observado/propuesto.
- La frase sobre trabajar con cientos de agentes y no responder manualmente a revisiones no autoriza escalar el paralelismo ni quitar revisiones/gates en ONIA. El caption no describe arquitectura, permisos, costos ni verificación de ese flujo. Tampoco se adopta la cita como una instrucción de producto o de operación.
- **Resultado:** referencia registrada para consulta; no se actualizan skills ni referencias canónicas porque solo se pudo observar 1/6 láminas y la idea visible ya está cubierta por la continuidad y los controles existentes. La revisión completa queda pendiente de acceso visual a las láminas 1–5, sin usar descargas de medios ni rutas alternativas.

## Fuentes primarias pertinentes

1. [Publicación original de Claude](https://www.instagram.com/p/DefCfujIPjd/?img_index=6): fuente de la caption y de la lámina 6 observada.
2. [Buenas prácticas oficiales de Claude Code](https://code.claude.com/docs/en/best-practices): Anthropic recomienda criterios de verificación con señales comprobables y revisión de evidencia; coincide con el método ya aplicado por ONIA, sin justificar cambios de permisos o autonomía.
3. [Investigación de Anthropic sobre experiencia y uso de Claude Code](https://www.anthropic.com/research/claude-code-expertise): el estudio describe que las personas toman la mayoría de decisiones de planificación y que la verificación observable sirve como señal de éxito. Es evidencia general sobre sesiones analizadas, no prueba de la afirmación de uso del caption ni de la infraestructura ONIA.

## Trazabilidad

- Recurso original consultado en el Chrome autenticado ya disponible; no se pidió login nuevo.
- No se descargó contenido remoto; no se llamó a APIs de proveedor; no hubo gasto, publicación, contacto ni cambios de repo/Git.
- Modelo configurado: Luna low (según contrato); modelo servido: UNKNOWN.
- Inicio UTC: UNKNOWN (no se registró reloj al despachar); fin UTC: 2026-10-14 22:49:26 UTC.
- Motivo de cobertura parcial: tras la primera captura de la lámina 6, las capturas siguientes expiraron en `Page.captureScreenshot`; no se intentaron workarounds de extracción ni descarga.
