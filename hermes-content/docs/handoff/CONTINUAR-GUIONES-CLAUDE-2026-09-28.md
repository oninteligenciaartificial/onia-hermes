# Continuar los guiones con Claude

## LEER PRIMERO — última corrección de Sergio y entrega actual

Actualizado después de su petición final de handoff. **Esta sección prevalece
sobre las versiones anteriores de la sesión que se conservan más abajo.**

### Qué quiere realmente

- Estudiar a sus referentes: cómo enseñan, qué tipos de contenido combinan,
  cómo editan y cómo conectan redes, recursos, producto y comunidad. Elegir
  temas parecidos y leer captions no equivale a estudiar sus videos completos.
- Preparar y verificar contenido con sentido para Sergio/ONIA; él solo se
  graba. El agente/editor prepara demostraciones, recursos, capturas y edición.
- **Mínimo diez videos al día**, con al menos una hora diaria de grabación.
  Es una meta de producción, no garantía de alcance. No hay horario fijado ni
  automatización de agenda creada. No imponer diez variaciones de un mismo tema.
- Archivo de entrega con **solo guiones hablados**, sin ficha, instrucciones
  de producción ni fuentes mezcladas. Enseñanza personal fuera de ese archivo.
- También quiere ideas no guionizadas, incluyendo **vlog POV con Meta Ray-Ban**,
  construcción real y decisiones de ONIA. No convertir el vlog en monólogo
  memorizado ni inventar un día de trabajo/cliente/resultado.
- Dijo que la idea del vertical 2 y 3 va mejorando, pero todavía enseñaban
  poco. Pidió ejemplo concreto, procedimiento y comprobación. **La nueva
  versión aún no tiene aprobación editorial de Sergio.**

### Archivos y estado exacto

1. **ENTREGA SOLO HABLADO:**
   `hermes-content/docs/cola/GUIONES-PARA-GRABAR-2026-09-28.md`.
   Diez narraciones escritas: un YouTube sobre cotizador y nueve verticales
   (Opus; costo completo; entrega no confirmada; cotizador; subtítulos;
   primera automatización; escalado humano; cómo enseñar; revisión de una app).
   Esa distribución 1+9 fue una decisión operativa, no una proporción aprobada.
   Vertical 2 ahora calcula 100+200×3+120×3=1060; vertical 3 usa pedido de
   200 unidades para el viernes sin stock/plazo confirmado, con prompt y
   ejemplo de respuesta que deja la confirmación pendiente.
2. **INVESTIGACIÓN/PRODUCCIÓN/HISTORIAL:**
   `hermes-content/docs/cola/GUIONES-REINICIO-2026-09-28.md`.
   Conservar fichas y fuentes; no volver a entregar como paquete principal sus
   versiones anteriores centradas en tres variantes del mismo presupuesto.
3. **DEMO COTIZADOR:** `hermes-content/docs/cola/cotizador-tarjetas-demo.html`.
   Creada por Codex, NO por Opus. Sin red/dependencias. Precios ficticios:
   unidad Bs1,20; diseño Bs30 una vez; cantidades 100/200/500. Totales sin/con
   diseño: 120/150, 240/270, 600/630. Desglose, resumen seleccionable, copiar
   con fallback manual. Subagente comprobó sintaxis JS, seis combinaciones y
   copia/fallback con DOM simulado. **Falta revisión en navegador real**;
   `file://` fue bloqueado por política del navegador del agente. Servir solo
   la carpeta por localhost es una alternativa ya usada con el otro HTML.
4. **VISUALES DEL EJERCICIO:** `hermes-content/docs/cola/opus55-ejercicio-editor.html`.
   Cinco pantallas horizontales/verticales revisadas. Son solución didáctica
   calculada, no captura de una respuesta de Claude. Se pueden reutilizar
   para vertical 2; no confundirlas con la prueba de modelo pendiente.

### Investigación adicional que sí cambió la dirección

Consulta 28-sep local / 29-sep UTC. Dos agentes revisaron Erik/Ian y Tiago/Carlos;
principal revisó Santiago/Enrique y tutorial largo. No hubo compra ni envío de DM.

- **Santiago:** bio y diálogo de enlaces de
  https://www.instagram.com/sanmunoz.ia/ verificados en navegador. Dirige a
  https://www.forjabots.com/, https://www.horizontesia.com/ y testimonios.
  La web de formación enlaza Skool; se leyó la página pública de oferta,
  no el contenido privado. El hub https://link.me/sanmunoz.ia también enlaza
  YouTube; la bio actual prioriza Forja/comunidad.
  Tutorial reciente: https://www.youtube.com/watch?v=5REPWhjX64A,
  publicado 26-sep, duración20:16, sobre animación con Claude/Opus.
  **Se leyeron descripción completa, capítulos y prompts publicados, y se vio
  fotograma de apertura; no se vio entero.** Estructura de capítulos: resultado
  temprano → requisitos/configuración → creación → revisión → personalización.
  Ofrece recurso descargable y ampliación en comunidad. Dos intentos de exportar
  transcripción devolvieron no disponible; el panel visible quedó vacío.
  No seguir repitiendo esa ruta ni afirmar transcripción analizada.
  Ficha histórica más profunda de edición:
  `hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`:
  análisis previo de video+audio completo y ocho fotogramas; se releyó, no
  se reprodujo hoy. Enseña persona abajo y demostración arriba, zoom al dato.
- **Enrique:** https://www.instagram.com/soyenriquerocha/ bio y enlaces
  confirmados: https://www.tododeia.com/, libro Claude, llamadas, eventos
  https://luma.com/soyenriquerocha y colaboraciones. Sitio y bóveda
  https://www.tododeia.com/community leídos; ofrece guías/proyectos y conecta
  aprendizaje con recursos/eventos/servicios. No se inspeccionó toda la bóveda
  ni se verificó eficacia de sus tutoriales. Sus reels recientes previamente
  observados eran captions y fotogramas, no análisis integral del montaje.
- **Erik:** https://link.eriktaveras.com/erik enlaza recursos, formación,
  newsletter y llamada. AutoDev público y foro accesibles. Guía completa:
  https://comunidad.eriktaveras.com/resources/analisis-con-subagentes-claude-code/
  asociada a https://www.instagram.com/eriktaveras/reel/Ddxz2P_uCp6/ (27-sep).
  Enseña entradas/prompt/archivos/comprobación y pide compartir resultado en
  foro. Otra guía: https://comunidad.eriktaveras.com/resources/n8n-claude-code-hermes-conectados/
  y reel https://www.instagram.com/eriktaveras/reel/DdpF111p5Iz/ (23-sep).
  Captions y fotogramas vistos; no video íntegro. Automatízate no abrió por
  fallo técnico; no afirmar revisión de esa comunidad.
- **Ian @ianlee.js:** identidad y enlace a https://www.getnexor.ai/es verificados
  desde perfil; destino comercial con demo/docs, no comunidad observada.
  https://www.instagram.com/ianlee.js/reel/DdmNXhGOnHe/ (22-sep) combina
  construcción de una función y decisiones B2B; relato en exterior.
  https://www.instagram.com/ianlee.js/reel/DcpMghFBI-d/ (29-ago local/30 UTC)
  relata construir una web para conseguir una oportunidad. Captions y
  fotogramas; no transcripciones. Aprendizaje: también hay relato de fundador
  y conversación, no solo recetas o noticias. No copiar su experiencia a Sergio.
- **Tiago:** bio de https://www.instagram.com/tiagolemosx/ comprobada por CUA:
  edición con IA, enlace real https://mestres.ai/meia-pv1-bio. Corrige inferencia
  previa sobre otro dominio como destino. Reel edición27-sep
  https://www.instagram.com/tiagolemosx/reel/DdzhIFKRQ43/ pide EDIÇÃO; solo
  caption/fotogramas previos. Comparativa histórica
  https://www.instagram.com/p/Db60O6OxWU5/ usa resultados visuales progresivos;
  ficha guardada23-ago con48fotogramas, sin audio revisado hoy.
- **Carlos:** bio de https://www.instagram.com/carlosdominguez.dev/ enlaza
  https://lafragua.dev/, https://carlosdominguez.com.mx/ y comunidad
  https://www.skool.com/imperio/about con referido. **Dominio confirmado desde
  perfil**, pese a que el sitio conserva otro handle; no mantener la sospecha
  inicial como bloqueo. Reel28-sep15:59UTC:
  https://www.instagram.com/carlosdominguez.dev/reel/Dd1j7n7xRyM/.
  Caption enumera flujo de leads; fotograma usa etiqueta de episodio T1/E3,
  cara y encabezado del proceso. CTA PROMPT. No verificamos ejecución ni DM.
  No copiar su afirmación comercial de multiplicar ingresos.

### Qué hacer ahora sin volver a empezar

1. Leer los diez guiones hablados. Revisar repetición: cotizador aparece en
   YouTube y varios verticales; el usuario acaba de pedir variedad. Mantener
   solo reutilización que enseñe una pregunta distinta; no rellenar la cuota.
2. Abrir el cotizador por servidor local de carpeta y probar las seis opciones,
   cambios de selección, copia, fallback y móvil. Ajustar frases del guion
   a lo demostrado. No afirmar que la prueba UI ya está hecha.
3. Entregar a Sergio el archivo solo hablado, ya creado; no obligarlo a leer
   esta investigación. Su última solicitud fue handoff, no seguir investigando.
4. Preparar aparte ideas espontáneas Ray-Ban: objetivo real del día, decisión
   durante trabajo y balance al cerrar. Pautas de observación, sin inventar
   resultados. Capturar terceros solo con permiso y ocultar datos de clientes.
5. Diseñar el siguiente paso a comunidad según recursos realmente disponibles
   en ONIA. Hoy no se verificó un destino público listo para todos estos
   archivos; no prometer «comentá y te envío» ni inventar comunidad activa.
6. Continuar edición cuando llegue el A-roll/POV. No hay MP4 final, no hay
   publicación autorizada y no se ejecutó Opus/Sonnet por falta de sesión.

Aprendizaje para el agente: el problema fue elegir demasiadas variaciones de
una prueba abstracta en lugar de estudiar enseñanza, contexto y formatos.
Sergio preguntó si debía subir el modelo: se le respondió que el fallo de
enfoque puede corregirse sin cambiarlo. No prometer rendimientos por volumen.

Handoff pedido por Sergio el 28-sep-2026. Leer este archivo y el guion enlazado;
no reiniciar una auditoría extensa. Incorporar el bloque diario de grabación
pedido al cierre; no inventar un horario ni una cuota de publicaciones.

## 1. Dónde continuar

- Worktree: `C:/Users/PC/.codex/worktrees/6af1/onia-hermes`.
- Rama: `codex/guiones-reinicio-20260928`.
- Archivo de trabajo único:
  `hermes-content/docs/cola/GUIONES-REINICIO-2026-09-28.md`.
  Tiene primero la Sesión 1: YouTube horizontal de 5–7 minutos y tres verticales
  de unos 45–60 segundos, enseñanza personal, ficha técnica O55, fuentes, caso
  de prueba y clave de corrección. Después conserva un borrador corto y dos guiones
  anteriores (cotizador HTML y corrección de SRT).
- Leer AGENTS.md y COORDINATION_MANIFEST.md. No mezclar cambios de otras tareas,
  no usar `git add -A`, no publicar ni desplegar.
- Este worktree es distinto del checkout `C:/dev/proyectos/onia-hermes`.
  Si Claude arranca allí, abrir estos archivos por su ruta absoluta o trabajar
  en este worktree. No asumir que las ramas contienen lo mismo.

## 2. Qué pidió Sergio y qué corregimos

Quiere contenido de calidad, actual, pertinente y con señales reales de interés
en su nicho. Sus referentes enseñan cosas actuales; no quiere recetas evergreen
elegidas sin explicar por qué importan ahora.

Pidió empezar simple: **un guion sobre el nuevo Opus 5.5**. Preguntó cómo se
decidía que una técnica era la mejor y exigió una **ficha técnica que permita
saber de dónde sale la información, cómo se aprendió y qué se comprobó**.
Le parece lógico hacer una pequeña prueba, sin inventar resultados.

Sergio graba a cámara. El agente/editor se ocupa de prompts, archivos,
demostraciones, capturas, pantallas, subtítulos y montaje. **La entrega para
Sergio es solo el guion hablado y una enseñanza para él al final, fuera de
cámara.** La ficha y la preparación se conservan en el archivo de trabajo,
accesibles pero sin llenar la respuesta con producción o investigación.

Los temas de cotizador y SRT le gustaron como punto de partida, pero cambió la
prioridad a actualidad. No insistir con esos dos antes de terminar Opus.
Eso no autoriza publicación ni significa que sus demos estén ejecutadas.

La sesión anterior a este reinicio fue rechazada por vacía/incompleta.
`RODAJE-MARCA-PERSONAL-2026-09-27.md` y el JSON `EXTRACCION-REFERENTES-GUIONES.json`
no certifican guiones aprobados. No traerlos como conclusiones editoriales.

## 3. Hacia dónde va el contenido

El recorrido editorial acordado es:

**Actualidad pertinente → para qué sirve → pequeña prueba → tarea reproducible
→ aprendizaje propio → aplicación real en ONIA/ONIA Platform cuando encaje.**

- Sergio: enseñar y documentar como constructor; lenguaje conversado y concreto.
- ONIA/Platform: prueba comercial y aplicación real, sin convertir cada reel
  en publicidad ni atribuir funciones o resultados que no se verificaron.
- La comunidad/web puede recibir recursos y profundización cuando existan.
  No prometer «comentá X y te envío» si el recurso y la entrega no están listos.
- Primera pieza: Opus 5.5, qué cambió y cómo evaluarlo hoy.
- Continuación lógica, condicionada a la prueba: mostrar un resultado real,
  explicar el procedimiento y después su aplicación en una tarea de negocio.
  Hay un mínimo diario de una hora para grabar (ver sección 8), sin horario
  definido ni obligación de publicar diariamente en todos los canales.

La ficha debe registrar fecha, versión/producto, fuente primaria, señal social,
material realmente observado, decisión editorial, prueba y resultado o bloqueo.
Comprobar actualidad otra vez el día de publicar. Una tendencia ayuda a elegir
tema; no demuestra que una herramienta funcione mejor. Una demo prueba un caso,
no superioridad general. No confundir vistas/likes con eficacia didáctica.

## 4. Referentes y fuentes concretas

Sergio añadió explícitamente que le encantan **Santiago Muñoz y Enrique Rocha**.
Incluirlos entre los principales, junto con Erik e Ian. Tiago y Carlos también
están en la selección usada. Inspirarse en claridad y estructura sin copiar
frases, identidad ni afirmaciones personales.

| Referente | Perfil | Pieza / estado observado el 28-sep |
|---|---|---|
| Santiago Muñoz | https://www.instagram.com/sanmunoz.ia/ | Opus: https://www.instagram.com/sanmunoz.ia/reel/DdpMVvQopMC/ — 23-sep 20:42 UTC, caption y fecha; señala Opus5.5 y condiciones del costo. Sonnet: https://www.instagram.com/sanmunoz.ia/reel/Dd2KbhWIRap/ — 28-sep 21:35 UTC, caption y fragmento visual |
| Enrique Rocha | https://www.instagram.com/soyenriquerocha/ | https://www.instagram.com/soyenriquerocha/reel/Dd2S811ODEy/ — 28-sep 22:52 UTC, Sonnet5.5; caption, fecha y fragmento a cámara |
| Erik Taveras | https://www.instagram.com/eriktaveras/ | https://www.instagram.com/eriktaveras/reel/Ddxz2P_uCp6/ — 27-sep UTC, subagentes; fragmentos y guía pública leída |
| Ian Lee | https://www.instagram.com/ianlee.js/ | https://www.instagram.com/ianlee.js/reel/DdmNXhGOnHe/ — 22-sep, construcción con API/Higgsfield; caption y fragmentos |
| Tiago Lemos | https://www.instagram.com/tiagolemosx/ | https://www.instagram.com/tiagolemosx/reel/DdzhIFKRQ43/ — 27-sep 20:56 UTC, edición con Claude; caption y fragmento. No verificamos su afirmación de edición integral por IA |
| Carlos Domínguez | https://www.instagram.com/carlosdominguez.dev/ | https://www.instagram.com/carlosdominguez.dev/reel/Dd1j7n7xRyM/ — 28-sep 15:59 UTC, workflow n8n creado con Claude Code; caption y fecha. No ejecución propia ni modelo Opus confirmado |

No se vieron completos todos esos reels. No decir «analicé todo su contenido».
La muestra muestra actividad contemporánea del nicho; no es un estudio de
tendencia global ni prueba de que todos estén hablando de Opus.

Fuentes oficiales consultadas para el guion:

1. https://www.anthropic.com/claude-opus-5-5 — anuncio fechado 22-sep-2026.
2. https://www.anthropic.com/claude/opus — disponibilidad y precio; su encabezado
   conserva “Opus4.8”, aunque el cuerpo describe5.5. Preferir anuncio fechado.
3. https://www.anthropic.com/claude-sonnet-5-5 — lanzamiento 28-sep-2026.

Hechos que cambian el guion:

- **Opus5.5 salió el22; Sonnet5.5 salió el28.** No decir que Opus salió hoy.
  El lanzamiento nuevo de Sonnet mantiene relevante elegir dónde usar Opus.
- Anthropic reporta aproximadamente40% menos costo frente a Opus5 en tareas
  típicas facturadas por tokens, a configuración predeterminada. **No es una
  rebaja de40% de la mensualidad ni un ahorro garantizado.**
- Opus normal: USD4/M entrada, USD20/M salida, USD0,20/M lectura de caché.
  El precio por token entrada/salida baja20%; el ahorro total40% combina
  precios y consumo. Fast mode tiene otra tarifa; no mezclar.
- Disponibilidad general publicada: Pro, Max, Team, Enterprise y API/plataformas.
  No se comprobó acceso en la cuenta de Sergio.
- Trabajo complejo y comunicación más clara: afirmaciones del fabricante,
  no resultados propios de ONIA. Evitar superlativos universales.

## 5. Prueba preparada y bloqueo concreto

La ficha O55 contiene el prompt íntegro de tres presupuestos ficticios para
una web durante tres meses, con presupuesto máximo Bs1200, dominio propio y
exportación de datos obligatorios. Clave revisada:

- A: 300 +250×3 =1050; cumple todo.
- B: 100 +200×3 +120×3 =1060; anuncia700 omitiendo dominio y no permite exportar.
- C: 350×3 +300 =1350; excede el máximo.

**No se ejecutó el prompt en Opus ni Sonnet.** Está listo para una prueba
pequeña usando la misma entrada y condiciones; registrar salida completa,
modelo, esfuerzo, fecha, tiempo y correcciones. Si ambos aciertan, decirlo.
No inventar un ganador ni inferir calidad general de un caso tan pequeño.

Acceso comprobado:

- CLI Claude Code2.1.267 instalada.
- `claude auth status`: `loggedIn:false`, `authMethod:none`.
- Navegador integrado: `https://claude.ai/login`.
- No se usaron APIs pagadas ni se instalaron herramientas.

Antes de pedir login, seguir
`C:/dev/proyectos/onia-hermes/hermes-content/skills/seguridad-credenciales.md`.
Una sesión web y la autenticación de CLI son distintas. Reutilizar mecanismos
autorizados si Claude dispone de ellos, sin leer/imprimir secretos. No configurar
nuevos accesos ni gastar. Si no hay sesión disponible, conservar el bloqueo y
entregar el guion como explicación del anuncio, sin experiencia de prueba falsa.

## 6. Próxima acción de Claude

1. Leer la Sesión 1 y la ficha O55 en el archivo único indicado. Las cuatro
   narraciones ya están escritas y revisadas; evitar redactarlas desde cero.
2. Revalidar únicamente los datos que hayan cambiado desde28-sep. Evitar otra
   exploración masiva: ya están el tema, las fuentes y el caso de prueba.
3. Si existe acceso autorizado sin nuevo gasto, ejecutar la prueba pequeña y
   completar la ficha; si no, mantener la limitación explícita.
4. Si la ejecución aporta evidencia nueva, ajustar únicamente las frases
   afectadas. Las narraciones actuales funcionan como explicación del anuncio
   y ejercicio con solución calculada, sin afirmar experiencia propia.
5. Entregar solo los guiones del bloque de grabación + enseñanza personal al final, con un enlace discreto
   a la ficha. El editor prepara todo lo visual. No pedirle capturas ni demos
   a Sergio. Si posteriormente encarga montaje, localizar primero su A-roll.

## 7. Trabajo y límites al cerrar

Se usaron dos subagentes: fuentes/validación oficial y revisión de referencias/
ejecutabilidad. Hay revisión de cálculos y `git diff --check` sin errores.
Eso no equivale a ejecución del modelo ni prueba con audiencia.

Archivos de este carril: manifiesto, archivo único de guiones/fichas y este
handoff. No hubo publicación, deploy, instalación, contacto con terceros ni
cambios de precio/producto. Conservar y revisar estos archivos antes de integrar;
no arrastrar trabajo ajeno del checkout principal.

## 8. Una hora diaria de grabación y formatos

Última instrucción de Sergio: dejar **al menos una hora al día para grabar**
contenido para YouTube horizontal y TikTok, Instagram y otros canales verticales.
La investigación, escritura, preparación de demos y edición deben ocurrir fuera
de esa hora y estar listas antes de que Sergio empiece. No hay hora del reloj
acordada ni evento de calendario creado.

Distribución inicial propuesta, ajustable según el tema:

- 35 minutos: grabación horizontal 16:9 de una explicación/tutorial de fondo
  para YouTube, con ejemplo y aprendizaje. Es tiempo de rodaje, no duración final.
- 20 minutos: grabación vertical 9:16 de 2–3 piezas breves relacionadas, cada
  una con contexto, gancho y enseñanza propios. Es objetivo de sesión, no cuota.
- 5 minutos: retomas de frases, aperturas y cierres.

Trabajar una idea central por sesión: actualidad de IA, tutorial reproducible,
o construcción/aplicación real en ONIA. La explicación horizontal desarrolla
el proceso; las piezas verticales resuelven una pregunta concreta. Reutilizar
investigación y demostraciones; adaptar narración y encuadre. No asumir que
recortar automáticamente el horizontal produce buenos verticales.

Antes de grabar, dejar un paquete breve: guion horizontal, guiones verticales,
enseñanza personal y ficha interna con fuentes y estado de la demo. El editor
se encarga de las pantallas, recursos y montaje. Mantener Opus como siguiente
tema; no abrir otra investigación editorial general.

## 9. Por qué se alargó esta tarea y cómo corregirlo

Diagnóstico del proceso observado; no hay medición por etapa para asignar
minutos o porcentajes ni atribuir la demora al modelo:

1. Se extendió la exploración de varios referentes y temas antes de cerrar una
   pieza grabable. Faltó un criterio de cuándo había evidencia suficiente.
2. Se mezclaron diseño editorial, investigación técnica, revisión visual,
   preparación de demos y comprobación de acceso en una misma entrega.
3. Los intentos de acceso y la navegación social añadieron fricción: perfiles
   con modal de login, uso de enlaces directos y Claude sin sesión disponible.
4. Sergio tuvo que corregir el alcance varias veces: actualidad, solo guion,
   fuentes trazables y enseñanza. Esas correcciones produjeron retrabajo.

Corrección para Claude:

- Partir de esta ficha y del tema elegido; refrescar solo información cambiante.
- Para cada pieza, comprobar fuente primaria y referencias recientes pertinentes.
  Revisar todos los referentes a lo largo del radar, sin recorrer los seis de
  nuevo para cada guion. Si solo se leyó caption, no atribuir análisis del video.
- Cerrar investigación cuando las afirmaciones del guion estén respaldadas y
  exista un ejemplo útil. Si la señal de tendencia es insuficiente, decirlo.
- Ejecutar una demo acotada con acceso disponible. Ante bloqueo de autenticación,
  registrar qué falta y entregar una explicación atribuida, sin fingir resultados
  ni seguir probando rutas indefinidamente.
- Mostrar pronto un guion completo. Conservar investigación y producción en
  la ficha; no obligar a Sergio a revisar el proceso entero para poder grabar.
- Medir desde la próxima pieza inicio/fin de investigación, demo y escritura,
  y número de revisiones. Esa evidencia permitirá ajustar tiempos; hoy no hay
  base para prometer una reducción concreta.

Esta ampliación se hizo localmente en el frente de contenido/documentación;
no necesitó más subagentes ni nueva investigación web.

## 10. Ampliación posterior: paquete de grabación revisado

Sergio pidió seguir avanzando y revisar lo preparado. Se añadió al archivo
canónico la Sesión 1 completa: horizontal 5–7 minutos y tres verticales de
45–60 segundos, con enseñanza personal. Dos subagentes existentes retomaron
trabajo acotado: fuentes oficiales y revisión de las narraciones. Se aplicaron
sus dos correcciones al ejercicio. La prueba en Opus/Sonnet sigue pendiente.

Se creó `hermes-content/docs/cola/opus55-ejercicio-editor.html`: cinco escenas
didácticas, con selector horizontal/vertical, navegación y modo captura. Es
material del editor, no una interfaz de Claude ni una salida del modelo.
No contiene precios reales de ONIA ni llamadas a servicios externos.

Abrir el HTML por doble clic. Para capturar, elegir formato y escena y pulsar
C; volver a pulsar C recupera controles. Usar el marco de la escena al encuadrar.
Conservar sus etiquetas de procedencia. El servidor local de revisión se cierra
al terminar; no depender de que 127.0.0.1:8766 permanezca disponible.

Verificación: fuentes oficiales reconsultadas, aritmética revisada, conteos de
palabras y diez combinaciones de escena/formato comprobadas sin desbordamiento
por geometría DOM. Tres composiciones inspeccionadas en capturas. No hay montaje
final: requiere localizar el material que grabe Sergio. No solicitarle que
produzca las pantallas ni los recursos, que son responsabilidad del editor.

La sección 9 diagnosticaba la sesión anterior a esta ampliación. En esta pasada
el intervalo observado entre 01:15:56 y 01:22:00 UTC fue de 6 min 4 s e incluyó
escritura, creación de pantallas y revisión; no cubre la exploración anterior
ni este cierre. No usarlo como duración total de la tarea ni comparación entre
modelos. En siguientes piezas, registrar cada fase desde su inicio.
