# Extracción de referentes para los guiones de Sergio

Revisión 28-sep-2026. Alcance: guiones; sin edición audiovisual ni publicación.
Integrador y tres subagentes, con lotes disjuntos. Este documento distingue la
enseñanza que contiene una fuente de una adaptación nueva escrita para ONIA.

## Qué cuenta como enseñar

El espectador recibe una acción que puede repetir y una forma de reconocer si
la hizo bien. Puede ser un prompt completo, una transformación de un dato, un
cálculo, un caso resuelto o un criterio explicado con un ejemplo. No exige que
todo sea un tutorial técnico. «Usá IA», «dale contexto», una lista de herramientas
o un resultado bonito no entregan por sí solos el procedimiento.

El video debe entregar esa unidad completa antes del CTA. La guía puede ampliar
el procedimiento; la comunidad puede aportar el trabajo preparado y conversación.
El paso siguiente no reemplaza la enseñanza del video ni promete un archivo pendiente.

## Cobertura y procedencia

Universo inventariado: **131 archivos raíz fechados de `video-intake`** y los
**seis registros de `creator-video-references`**. Las fichas de lote contienen
varias piezas; esos archivos no equivalen a 137 videos. Las referencias se
desglosan y deduplican en el registro que acompaña este documento.

[Registro completo](EXTRACCION-REFERENTES-GUIONES.json): 137 archivos asignados
con cobertura registrada y cero faltantes en el inventario; 207 entradas de
extracción, agrupadas en 205 claves de fuente. Incluye antecedentes citados y
cuatro guías públicas adicionales; esas claves no equivalen a 205 videos vistos.
Lotes A/B/C: 70/74/59 entradas, respectivamente. Las bases de observación y
límites de cada entrada se conservan sin duplicar las transcripciones originales.

| Frente | Material asignado | Cobertura documental |
|---|---|---|
| A | 50 archivos hasta el 15-ago y los seis registros de junio | Lectura completa reportada; transcripciones y cinco contact sheets locales revisados |
| B | 19 archivos del 16 al 22-ago, incluidos lotes con múltiples piezas | Lectura completa reportada; fuentes/transcripciones cruzadas por ID |
| C | 62 archivos desde el 23-ago, incluidos septiembre | Lectura completa reportada; fichas con observación visual, captions y transcripciones cruzados |
| Integrador | Cuatro guías públicas de Erik, posicionamiento, reparto y destinos | Guías leídas; web y `/claude-code` responden HTTP 200 y contienen enlace a comunidad |

**Límite:** lectura de transcripción o de una observación audiovisual guardada
no equivale a volver a ver el video completo hoy. Parte de los originales no
está disponible íntegramente. Cada entrada del registro declara su base:
transcripción, lectura visual guardada, fotogramas revisados, acceso público
parcial o fuente inaccesible. No se completan palabras, procedimientos ni
resultados que falten. Las 29 referencias de diseño/historias de los cuatro
JSON de estilo son contexto visual; no cuentan como prueba de enseñanza técnica.

## Lo extraído que cambia los guiones

### Actualidad comprobada · 28-sep

Se distingue la fecha de publicación de la fecha en que guardamos una ficha.
Revisar todo el archivo no prueba haber revisado las últimas piezas del creador.

| Referente / pieza | Fecha comprobada | Uso |
|---|---|---|
| Erik: análisis con subagentes | Publicación 27-sep-2026, `datePublished` y `<time>` en página primaria | Prioridad actual: encargos, evidencia y qué añadir en comunidad |
| Erik: n8n, Claude Code y Hermes | Página primaria muestra 23-sep-2026 | Prioridad actual: trabajos distintos y conexiones |
| Erik: MCP oficiales de Meta | Publicación 21-sep-2026, `datePublished` y `<time>` | Prioridad actual: capacidades y límites; no prueba permisos de nuestra agenda |
| Santiago: tutorial vertical | Ficha recibida 17-sep; fecha original de publicación sin confirmar | Referencia de narración con pantalla; no decir que es su último reel |
| Revolutia / Ingenierobinario | Fichas recibidas 1 y 2-sep; publicación original sin confirmar | Apoyo de formato, cobertura parcial/expirada |
| Ian, Marian, Tiago, Carlos y Hanakoxbt | Fichas de agosto, no fechas originales confirmadas para todos | Archivo estructural; no se presenta como radar actual |
| Erik: skill de edición | Publicación 4-ago-2026, metadata primaria comprobada hoy | Apoyo histórico, sin llamarlo reciente |

En el primer intento de actualización, las búsquedas no recuperaron publicaciones
primarias recientes de Ian/Marian/Tiago y los perfiles dieron error de fetch.
El acceso por navegador se registra por separado; no se sustituye una fecha
ausente por el orden del perfil. No se ha certificado «últimos posts de todos».

La primera pasada del navegador sí abrió tres perfiles y sus primeras piezas
visibles sin icono de fijado, con `datetime/title` de Instagram:

| Perfil | Publicación comprobada | Observación y límite |
|---|---|---|
| [Ian](https://www.instagram.com/ianlee.js/) | [28-sep, Dd0-c9llMY_](https://www.instagram.com/p/Dd0-c9llMY_/) | Caption sobre pitch de 60 s; no prueba completa de eficacia ni revisión de todo el perfil |
| [Marian](https://www.instagram.com/marian.rojass/) | [27-sep, DdzWXO-hyar](https://www.instagram.com/p/DdzWXO-hyar/) | Caption ofrece lista de alternativas a Zara por comentario; no entrega receta de IA ni criterios completos |
| [Tiago](https://www.instagram.com/tiagolemosx/) | [28-sep, Dd1-soxP8L5](https://www.instagram.com/p/Dd1-soxP8L5/) | Fecha comprobada; sin caption sustantiva y sin video completo, no se atribuye enseñanza |

Estas observaciones no cambian automáticamente los guiones: actualidad no
reemplaza pertinencia ni contenido observado. La ampliación a más piezas quedó
limitada: Chrome OnIA reservado por otra tarea; IAB y Edge no disponibles.
La búsqueda pública acotada de Carlos no confirmó pieza/fecha. No se presenta
como análisis completo de perfiles. El detalle está en `freshness.profile_review`
del registro consolidado.

Para el siguiente lote, novedades de herramienta requieren fuente oficial actual;
inspiración de creadores se prioriza desde piezas verificables de las últimas
cuatro semanas. Una pieza antigua puede aportar un mecanismo útil, con fecha y
uso histórico explícitos. El prompt visible, ejemplo resuelto y criterio de
comprobación se extraen de la pieza, no se infieren de que sea reciente.

| Referente / fuente | Qué entrega realmente | Qué se adapta | Qué no se afirma |
|---|---|---|---|
| [Erik: análisis con subagentes](https://comunidad.eriktaveras.com/resources/analisis-con-subagentes-claude-code/) | Encargo con fuentes, roles definidos, resultados concretos y datos ausentes señalados; prompt público | G05: reglas escritas y aceptación. G10/G11: resultado que puede revisarse contra un fragmento original | Que tres agentes siempre sean más rápidos; que su prueba sea una de ONIA |
| [Erik: n8n, Claude Code y Hermes](https://comunidad.eriktaveras.com/resources/n8n-claude-code-hermes-conectados/) | Trabajos distintos de cada herramienta y conexiones documentadas en guía | G02: explicar quién toma la siguiente decisión usando un mismo caso | Que una herramienta sustituya a todas ni que ONIA ejecute su cadena |
| [Erik: MCP de Meta](https://comunidad.eriktaveras.com/resources/tres-mcp-oficiales-de-meta/) | Capacidades, requisitos, límites y acciones iniciales de lectura | G03: agenda con leer/cambiar/enviar. G12: respuesta esperada según información disponible | Que escribir una prohibición en el prompt bloquee un permiso real |
| [@hanakoxbt: loops y grafos](../video-intake/2026-08-29-loops-y-grafos-dejar-de-vigilar-agentes.md) | Criterios que pueden rechazar un trabajo y dependencias comprobables; es texto, no un reel | G01: éxito, límite y dos secuencias. G12: esperado frente a recibido | Que no haya errores sea prueba de corrección ni que una repetición sea por sí sola un loop de mejora |
| [@marian.rojass: prompt en vivo](../video-intake/2026-08-23-cosecha-prompt-en-vivo-canon-g7x-flash-chatgpt.md) | Instrucción visible y comparación de imágenes; audio no recuperado | G09: mostrar el pedido completo y el cambio específico que se busca | Que su receta de imagen sea receta de ventas o garantice conservar un rostro |
| [@ianlee.js: PRD](../video-intake/2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md) | Fragmentos visibles del documento, historia de usuario y contraste de especificaciones; guía promovida por CTA | G04/G10: mostrar una instrucción vaga y una especificación revisable | Que se haya leído la columna recortada o que entregue en el reel toda la guía |
| [@tiagolemosx: tres niveles](../video-intake/2026-08-23-cosecha-escalera-ruim-bom-excelente.md) | Comparación visual de resultados del mismo brief; los prompts no están completos en la evidencia | G06: mantener la tarea fija y mostrar el criterio de comparación, escrito por nosotros | Que explique cómo generar cada resultado ni que pruebe modelos Opus |
| [@carlosdominguez.dev: gestión de cita](../video-intake/2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) | Caso, error en el dato conservado y registro corregido, con lectura audiovisual/transcripción | G14: pedido, datos necesarios y pendiente al reagendar | Multas, ley chilena o supuesto alcance en Bolivia; tampoco que quitar el motivo del resumen borre todo el chat |
| [Santiago: tutorial vertical](../video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md) | Persona narrando su proceso con interfaz y resultados como apoyo; observación guardada | La pantalla tiene que mostrar lo que se explica y la persona aportar criterio | Que leer su ficha sea ver de nuevo sus 92,8 segundos ni copiar su voz/edición |
| [Revolutia](../video-intake/2026-09-01-revolutia-estilo-tiktok.md) / [Ingenierobinario](../video-intake/2026-09-02-ingenierobinario-historia-quiz.md) | Hook/caption parcial y una historia interactiva, respectivamente | Ideas de entrada e interacción; no fuentes de una receta técnica | Montaje completo de Revolutia o locución de una historia estática |

Las otras fuentes y los descartes se conservan en el registro. Una ficha que
sólo vende o enumera no se convierte en tutorial por llamarla «referente».

La revisión final separa inspiración estructural y fundamento técnico: G02 usa
[Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
para distinguir workflows y agentes; G03 usa la
[especificación oficial de tools MCP](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
para consentimiento/control de acceso. Las guías de Erik no demuestran por sí
solas esas definiciones ni el bloqueo de escritura de la agenda propuesta.

## Aplicación en la cola vigente

La única copia de los guiones está en
[Rodaje 27-sep, revisión 28-sep](../../docs/cola/RODAJE-MARCA-PERSONAL-2026-09-27.md).
Se reescribieron los 12 activos. G00 sigue siendo captura de rescate; G07/G08
siguen en banco avanzado. No se ordena regrabar temas con bruto sin localizarlo.

| Guion | Unidad de enseñanza que ahora entrega |
|---|---|
| G01 | Cuatro casillas y dos secuencias para reconocer éxito y límite |
| G02 | Un mismo caso con ruta fija, clasificación y decisión del modelo |
| G03 | Agenda con tres acciones y permisos distintos |
| G04 | Consulta con entrada requerida y tres resultados definidos |
| G05 | Tres reglas reales de ONIA y dos criterios para revisar un encargo |
| G06 | Encargo idéntico, huecos esperados y tabla de comparación |
| G09 | Prompt de taller que pide el dato faltante en vez de un precio inventado |
| G10 | «Incluye soporte» → duración/cobertura ausentes → pregunta |
| G11 | Tres notas → decisión, tarea con responsable/fecha y pendiente |
| G12 | Tres preguntas → respuesta esperada → respuesta recibida |
| G13 | Minutos × volumen × días → fracción automatizable → tiempo neto |
| G14 | Solicitud de cambio de cita → resumen necesario → horario por confirmar |

Ejemplo completo no significa ejecución real: capturas simuladas se rotulan;
comparaciones o workflows no ejecutados quedan como procedimiento propuesto.
G05 sí puede mostrar el archivo real de reglas. La aprobación editorial, los
brutos y el desempeño de audiencia no se deducen de la calidad del texto.

## La regla de subagentes aplicada

Se usa la variante general de Erik: lotes independientes, contrato de salida,
fuente para cada afirmación, «sin dato» cuando falta y un integrador que resuelve
contradicciones. La revisión final compara enseñanza, fidelidad y destino.
No se inventan métricas de comentarios/retención para llenar sus tres roles originales.

Tres acciones ejecutadas a partir de los hallazgos:

1. Sustituir consejos generales por ejemplos que entreguen una acción y su comprobación.
2. Relacionar cada adaptación con una fuente y señalar lo que esa fuente no demuestra.
3. Dar un siguiente paso existente, sin prometer material o entrega automática pendiente.

Los tres lotes están cerrados y el registro consolidado tiene referencias
estructuradas y fuente por entrada. Las revisiones finales se incorporaron:
fundamento técnico separado en G02/G03, fragmentos saneados en G05, notas junto
a sus filas en G11 y protocolo propio inicial, sin certificación, en G12.

La propuesta de frentes ONIA/Platform/Sergio/Lucía, destinos y drops está en
[Mapa de temas](../../docs/ONIA_MAPA_DE_TEMAS.md). No registra recursos por
preparar como ya entregados ni publicaciones propuestas como realizadas.
