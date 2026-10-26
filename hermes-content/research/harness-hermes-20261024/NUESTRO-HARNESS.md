# Nuestro harness: qué es, qué está preparado y qué está activo

**Fecha de inspección:** 24-oct-2026. **Alcance:** investigación y diagrama; sin reactivar producción, modificar modelos/permisos, instalar ni desplegar.

## Conclusión

Conviene mantener **un responsable general —Hermes—**, no un solo modelo haciendo todo. Los ejecutores reciben contratos y contexto acotados; un programa registra/transporta el trabajo y la entrega se comprueba antes de aceptarse. Es nuestra decisión operativa, no una restricción universal de Hermes.

Un harness es la capa de software que prepara contexto, llama al modelo, ejecuta herramientas y conserva/controla el trabajo. Hermes documenta subsistemas de prompt, proveedor, herramientas, sesiones y compresión: cambiar el LLM no reemplaza esos componentes.[1]

## Esquema actual

```text
Sergio: objetivo, criterio y decisiones reservadas
└── Hermes: único responsable general
    ├── LLM: gpt-6.1-sol / proveedor openai-codex
    ├── Contexto: repo + handoffs + historial + memoria + skills pertinentes
    ├── Hijos internos: Luna, hasta 2 concurrentes, 40 turnos/hijo
    └── Ejecución por contrato (UNA vía, no ambas para la misma tarea)
        ├── Canónica: scripts/orquesta/ → issues → worker → revisión → PR
        │   [documentada; no verificada en ejecución por esta investigación]
        └── Piloto local: Orca → Run → Task → Dispatch → sesión/worktree
            ├── Marca personal: worktree preparado
            │   └── Workshop: worktree hijo preparado y archivos conservados
            ├── Onia Platform: repo/worktree propio preparado
            └── Revisión: un revisor para una entrega concreta, no otra madre

Entrega → prueba real → contraste independiente → revisión editorial
        → aprobación de Sergio cuando corresponda → publicación/producción
```

El padre/hijo de Orca organiza el árbol. **No sincroniza archivos, conversaciones, estados, dependencias ni permisos por sí solo.** Los worktrees separan cambios Git; no equivalen a contenedores de seguridad. La documentación distingue controles de escritura, aprobación e aislamiento de ejecución; el backend local no debe presentarse como Docker.[2]

## Qué está efectivamente comprobado ahora

Evidencia primaria local: `estado-observado.json`, obtenido por CLI nativa y lectura restringida a claves no secretas.

- Hermes instalado: **v0.22.2**, commit **d923a5eb48**. Orca: **1.4.238**. No se actualizó ninguno.
- Modelo del runtime: **gpt-6.1-sol / openai-codex**. También coincide con el valor resuelto de configuración.
- El esfuerzo máximo fue pedido y confirmado anteriormente; **el footer actual no lo expone y esta inspección no lo revalida**. No confundir la orden histórica con una lectura nueva.
- Delegación resuelta: **Luna**, proveedor **openai-codex**, **2** hijos concurrentes y **40** turnos de herramientas por hijo. No es el límite global de ventanas de Orca.
- Compresión activada, umbral base **0,50**; modelo auxiliar vacío y proveedor `auto`. **No significa que siempre comprima al 50 %:** la documentación y el código instalado elevan el porcentaje a al menos 75 % para ventanas menores de 512.000 tokens, y existen ajustes por reserva de salida y topes. No se calculó el disparador efectivo de esta sesión ni se atribuye un modelo auxiliar concreto sin observar su resolución.[7][10]
- Terminal de Hermes: backend **local**.
- Los cuatro worktrees del esquema existen. El runtime actual de Orca es diferente del anterior y **solo lista la terminal de Hermes**. Los handles antiguos devolvieron `terminal_handle_stale`.
- Por tanto: los espacios están preparados, pero **no se acreditan trabajadores de producción vivos con aquellos handles**. Tampoco se concluye que todos sus procesos terminaron; no se inspeccionó el árbol completo del sistema ni se relanzó nada.
- Se utilizó un hijo de investigación documental para este pedido. Eso es diferente de reactivar Marca personal o la startup.

## Cómo opera Hermes un LLM

El motor prepara un prompt y el estado de conversación, resuelve el proveedor, consulta al modelo y despacha las herramientas solicitadas. Sus resultados se incorporan al siguiente paso; el motor continúa hasta una respuesta final, límite o interrupción. La arquitectura documenta varios modos de API y almacenamiento de sesión separados del modelo.[1]

El ciclo detallado y la resolución de proveedor fueron contrastados también contra sus páginas oficiales específicas, no solo contra la página general de arquitectura.[6][7]

**LLM:** produce texto y solicitudes de herramientas. **Agente:** programa que mantiene contexto y ejecuta el ciclo. **Herramienta:** capacidad operativa con argumentos, resultado y permisos. **Orca:** superficie y transporte de sesiones/contratos. **Worktree:** copia de trabajo Git. No son nombres intercambiables.

### Hijos internos frente a sesiones externas

Los hijos de `delegate_task` reciben conversación/terminal/toolset propios y devuelven un resumen, no todo el historial intermedio. Se les debe enviar el objetivo, fuentes y límites necesarios; no asumir que conocen esta conversación. La guía los recomienda para trabajo con razonamiento independiente o mucho volumen intermedio, no para una sola operación mecánica.[5]

**Contexto aislado no implica archivos aislados:** la guía documenta directorio compartido por defecto y una opción explícita `delegation.worktree_isolation` para separar checkouts. No se activó ni se comprobó esa opción local en esta investigación. Los dos worktrees de nuestros ejecutores externos de Orca son una separación distinta de la delegación interna.[8]

Codex o Claude lanzados en Orca son programas y sesiones externos. Su selección de modelo/permisos es independiente de `delegation.model` de Hermes. Un resultado o mensaje aceptado no demuestra por sí solo que el destinatario lo consumió o completó. Esta última distinción está documentada en la guía **nativa instalada de Orca**, no se atribuye a Hermes.

### Información y aprendizaje

Las skills son conocimiento procedimental cargado bajo demanda, con divulgación progresiva para no incorporar todo su contenido en cada consulta.[4] Leer un catálogo no prueba haber cargado ni aplicado una skill.

Los perfiles de Hermes permiten separar configuración, memoria, sesiones y skills en homes distintos. No es lo mismo que abrir otra pestaña o crear un worktree; aquí se inspeccionó el perfil `default`, no se crearon otros.[3]

El inventario de sesiones e historial no debe usarse como prueba de procesos vivos. Guardar una corrección ayuda a recuperarla, pero el criterio local de aprendizaje exige comprobar su aplicación en otra tarea; esta investigación no afirma modificación de pesos del modelo.

La memoria incorporada documenta un snapshot del prompt congelado al comienzo de la sesión para preservar caché. Una escritura se guarda en disco y su resultado de herramienta permite verla inmediatamente, pero no reescribe por sí sola ese snapshot del prompt; la recuperación por búsqueda de sesiones es otro mecanismo.[9]

## Qué nos hizo fallar y cómo lo limitamos

**Hechos de esta conversación:** el paquete pasó pruebas técnicas y fue rechazado por Sergio por poco educativo; se mezclaron entregable e infraestructura; se acumularon revisiones y mucha salida técnica; el tablero quedó desactualizado; se trataron sesiones históricas como si siguieran accesibles.

**Correcciones propuestas, no configuración cambiada:**

1. **Contrato pequeño y una fuente de tareas.** META, archivos propios, prueba y parada. Elegir reparto canónico o piloto local; no encolar lo mismo en ambos.
2. **Contexto mínimo por ejecutor.** Handoff breve y enlaces concretos, no la conversación completa ni todas las skills. Restringir herramientas/permisos reales además del prompt.[2][4][5]
3. **Máximo dos ejecutores útiles en esta ola.** Revisor después del artefacto, no una red de coordinadores permanentes. Un hijo interno acotado no autoriza crear otra sesión.
4. **Separar prueba técnica de aceptación.** Para contenido, la prueba incluye entrada, acción, salida y qué aprende alguien; una cuenta correcta no demuestra que el video enseñe.
5. **Una corrección y verificación puntual.** Solo un contraejemplo reproducido puede justificar un arreglo residual; no otro barrido general.
6. **Actualizar estados al entregar o pausar.** Distinguir preparado, enviado, consumido, ejecutado, comprobado y aceptado.
7. **Coste medido, no supuesto.** Modelo, esfuerzo, contexto, entrada cacheada y gasto real son magnitudes distintas. El umbral base 0,50 no acredita el disparador efectivo: hay un piso para ventanas pequeñas y otros topes. La compresión puede perder detalles; las cifras de ahorro documentadas para Anthropic no se trasladan a nuestro proveedor openai-codex ni se convierten en una factura confirmada.[10]

## Qué no se activó ni comprobó

No se activaron Kanban, Bots, cron, nuevos perfiles, gateways ni flujos de publicación. No se hizo una prueba 24/7, una auditoría global de seguridad ni un inventario del VPS/Actions. No se comprobó salud completa de todos los hooks en el runtime nuevo. No se leyó `.env`, `auth.json`, cookies ni credenciales.

No recomiendo migrar ahora a otra cola para corregir mala ejecución: primero una tarea representativa con esta estructura, un criterio de aceptación editorial y una entrega visible. Los cambios de automatización requieren un encargo aparte.

## Evidencia local y fuentes

- `estado-observado.json`: valores resueltos y diferencia de runtimes.
- `ESQUEMA-HARNESS.html`: esquema visual offline.
- `INVESTIGACION-OFICIAL.md`: investigación documental del hijo Luna, recibida y contrastada por Hermes abriendo las cinco páginas primarias citadas. No se usaron los marcadores de cita opacos del resumen como evidencia.
- Código instalado `agent/context_compressor.py:1150–1151,2754–2774`: piso del porcentaje y reserva de salida. Se leyó, no se modificó ni se evaluó contra el estado efectivo de esta sesión.
- `scripts/orquesta/README.md:3–16,29–45,55–86`: contrato canónico y flujo descrito, sin afirmar que esté ejecutándose.
- `COORDINATION_MANIFEST.md`: responsabilidad general y registro de espacios.
- Guías nativas: `orca skills get orchestration`, `orca worktree set --help`, `orca terminal list --json`.

Las referencias web debajo corresponden a documentación oficial consultada; la documentación actual puede describir funciones posteriores al commit instalado. Una capacidad documentada no queda acreditada en nuestra sesión sin prueba específica.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/developer-guide/architecture
[2] https://hermes-agent.nousresearch.com/docs/user-guide/security
[3] https://hermes-agent.nousresearch.com/docs/user-guide/profiles
[4] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills
[5] https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns
[6] https://hermes-agent.nousresearch.com/docs/developer-guide/agent-loop
[7] https://hermes-agent.nousresearch.com/docs/developer-guide/provider-runtime
[8] https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
[9] https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
[10] https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching
