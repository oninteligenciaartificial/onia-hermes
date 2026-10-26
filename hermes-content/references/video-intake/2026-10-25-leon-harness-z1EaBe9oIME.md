# Leon van Zyl · los tres niveles del harness · 25-oct-2026

- Fuente: https://www.youtube.com/watch?v=z1EaBe9oIME
- Título: *The 3 Levels of Harness Engineering (Beginner to Pro)*.
- Autor: Leon van Zyl. Publicación declarada por YouTube: 14-oct-2026. Recepción/análisis: 25-oct-2026.
- Pedido: entender **qué enseña para configurar nuestro harness**, revisar su aplicación en ONIA y, secundariamente, analizar sus presentaciones.
- Cobertura: archivo público 1280×720, 969,851 segundos; lectura de los subtítulos automáticos ingleses completos (421 segmentos), 32 muestras visuales repartidas y cinco ampliaciones inspeccionadas a 03:38, 04:50, 06:50, 11:17 y 13:12. No fue escucha corregida a oído ni reproducción visual continua. Ocho fotogramas puntuales fueron extraídos; no se confunden los extraídos con los cinco abiertos individualmente.
- Evidencia visual: `evidencia-leon-harness-z1EaBe9oIME-20261025/`. Cobertura técnica: `../../research/harness-hermes-20261024/video-z1EaBe9oIME-cobertura.json`.

## 1. Enseñanza principal, no solo estética

| Momento | Qué enseña el autor | Aplicación y límite en ONIA |
|---|---|---|
| 01:23–03:57 | El agente combina modelo y entorno: instrucciones, herramientas, checks y memoria. | Coincide con las capas verificadas de Hermes. Cambiar el modelo no sustituye configurar ni comprobar herramientas y permisos. |
| 03:57–06:33 | Configurar un harness existente; mantener una entrada de reglas que enlace documentos específicos y un handoff para continuar. | Depurar AGENTS/CLAUDE y rutear al dominio, en vez de pegar toda la historia al comienzo. Un link tampoco garantiza que cada runtime importe ese archivo: comprobar el loader. |
| 06:33–07:54 | Un hook Stop puede comprobar un entregable y rechazar el cierre si falta; muestra un changelog y configuración de hooks. | Pasar de recordatorios a checks ejecutables cuando la condición sea objetiva. No añadir aquí un Stop global: antes revisar origen, permiso, idempotencia, presupuesto y prueba de bloqueo/éxito. |
| 07:54–09:43 | Un harness propio puede ajustar herramientas, políticas y experiencia manteniendo el modelo. | Hermes ya nos da esa base; esta idea no justifica construir otro agente desde cero. Los números de benchmarks que muestra no se reprodujeron en esta revisión. |
| 09:43–13:00 | Su herramienta Smol Coder limita contexto y herramientas para un caso de modelos locales. | Principio útil: entorno mínimo suficiente por encargo. No copiar sus límites a Sol/Luna sin medir; sus cifras no son nuestra ocupación ni factura. |
| 13:00–final | Una capa de orquestación reparte trabajos entre ejecutores, gestiona disponibilidad y sigue una cola; muestra AutoForge y una representación 3D. | Un responsable general, ejecutores con contratos y archivos propios, revisión y transición al siguiente trabajo. No duplicar la misma tarea entre Orca y scripts/orquesta; el tablero o la vista 3D no prueban ejecución. |

### Lo que no adoptamos literalmente

- La recomendación de agregar una regla por cada fallo puede producir precisamente el exceso de instrucciones que estamos corrigiendo. Consolidar la causa en el procedimiento canónico, retirar contradicciones y probar la siguiente ejecución; no acumular prohibiciones indefinidamente.
- Que un modelo local no necesite MCP o subagentes es una elección del producto mostrado, no una imposibilidad general. Tampoco todos los agentes descubren AGENTS/CLAUDE con la misma prioridad.
- Un worktree separa archivos/ramas; no es por sí solo una frontera de permisos del sistema. Un hook presente tampoco acredita que esté cargado, confiado o ejecutándose en la sesión actual.
- La cola duradera y el siguiente despacho deben existir realmente. Un LLM que promete continuar no equivale a scheduler activo; respetar presupuesto y aprobaciones.

## 2. Qué observé en sus presentaciones

- A 03:38: titular grande arriba, subtítulo breve y cuatro tarjetas alineadas para instrucciones, herramientas, checks y memoria. Los iconos y el color diferencian funciones, sin convertir cada tarjeta en un párrafo.
- Fondo muy oscuro, blanco para el mensaje principal, azul como acento y una trama/onda de puntos baja. Contornos, sombras y brillos suaves separan planos.
- El concepto se presenta antes de mostrar el archivo real. A 04:50 aparece AGENTS.md con un índice de fuentes; a 06:50, una entrada concreta de changelog dentro del editor. Esa alternancia convierte una abstracción en una operación visible.
- A 11:17 contrasta el presupuesto de contexto y un conjunto pequeño de herramientas. A 13:12 usa un diagrama simple de orquestador y ejecutores; después aparecen demos de tableros y espacio 3D.
- La cámara del autor ocupa un recuadro lateral, sin tapar el foco de la explicación. Las zonas resaltadas ayudan a encontrar el elemento relevante; no se midieron animaciones ni cadencia completa desde las muestras.

**Herramienta de autoría no confirmada.** El video renderizado no demuestra si las láminas se hicieron con PowerPoint, Keynote, Figma, HTML/React u otra herramienta. No se atribuye ninguna. Extraemos jerarquía, progresión concepto→ejemplo→prueba y legibilidad, no su identidad, frases, iconografía o edición exacta.

## 3. Revisión por las doce dimensiones

| Dimensión | Resultado y cobertura |
|---|---|
| Patrones | Definición → niveles → demostración concreta → orquestación. Observado en capítulos, subtítulos e imágenes. |
| Color | Fondo oscuro, blanco, azul y acentos por categoría. Valores hex no medidos. |
| Tipografía | Sans grande en diagramas; serif en un documento renderizado; monoespaciada en código. Familias no confirmadas. |
| Montaje | Alterna láminas, documento, editor y demos. Continuidad, cortes exactos, J/L cuts y audio no medidos. |
| Estilo visual | Tarjetas, iconos, foco por contorno y profundidad moderada. No adoptar como marca ONIA. |
| Estructura | Progresión de configuración a implementación propia y reparto de trabajo. |
| Guion/hook | Plantea la configuración como primer nivel y promete explicar dos capas adicionales; lectura desde captions, no cita corregida a oído. |
| Idioma/tono | Explicación técnica inglesa con demostraciones; nuestro análisis conserva voseo y no copia su voz. |
| UI/UX | Foco claro por pantalla y demos de una operación. No se recorrió la UX de los productos mostrados. |
| Frontend | Componentes y diagramas visibles; framework de las presentaciones no confirmado. |
| Backend/arquitectura | Conceptos narrados, no auditoría de seguridad o código de Smol Coder/AutoForge/Cubefarm. |
| Negocio/oferta | Hay promoción de comunidad/cursos; no acredita resultados propios ni justifica cambiar la oferta ONIA. |

## 4. Aplicación y estado

- **Hecho:** extracción/lectura e inspección visual con evidencia; distinción entre enseñanza de configuración y presentación.
- **Hecho:** corrección en la skill canónica `ver-videos`: no equiparar captions con audio escuchado, ni muestras con visionado continuo, ni ASR vacío con ausencia de voz; retirar garantías no verificadas de cuota/coste y actualizar que el CLI actual admite prompt específico.
- **En revisión por agentes:** instrucciones activas/duplicadas e inventario de hooks. Esta ficha no los declara corregidos antes de recibir y verificar sus entregas.
- **Prueba de uso del principio técnico:** se cerrará con los recortes exactos y sus comprobaciones en el encargo `depuracion-reglas-hooks-video-20261025`. Guardar esta ficha no significa que el harness ya mejoró.
- **Sin activar:** nuevos hooks, schedulers, AutoForge, Smol Coder, Cubefarm, instalaciones, generaciones pagadas, permisos globales, publicación o tareas históricas.

## 5. Acceso y límites

YouTube permitió descargar el medio público y los subtítulos ingleses sin cookies ni login. Los subtítulos españoles dieron429: no se reintentó ni se eludió el bloqueo. No había clave Gemini en el entorno del proceso; se usó el fallback existente, sin solicitar claves ni instalar dependencias. El video bruto y los captions completos permanecen fuera de Git en scratch; no se reproduce ni publica aquí una transcripción completa.
