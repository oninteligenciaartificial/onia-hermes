# Semana 3 — Contenido con IA sin editor (y agentes que te avisan)

Mié 14 → mar 20-oct-2026 · 21 piezas: 3 YouTube horizontales + 18 verticales. Carruseles
K7–K9 en `CARRUSELES.md`. Solo se lee a cámara el texto bajo cada ficha; los `####` no se leen.
Lo que dice «lo ves en pantalla» sale del drop indicado en la línea de Evidencia.

Antes de grabar, re-verificar: costos de Higgsfield (cotizados el 29-sep con `higgsfield generate
cost`), cuota gratis de Gemini (medida en julio), y que el YouTube del miércoles se edite con la
misma cadena que describe.

---

## Miércoles 14-oct

### D14-A · Vertical · Cortá los silencios de tu video con un pedido a Claude Code
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** 4 Contenido con IA · **Destino:** comentá CORTES
**Evidencia:** `.claude/skills/editor-videos/scripts/cut-plan.mjs` (medido 2026-07-30: clip de 15 s, 3,16 s de silencio; sin `--video` 0,00 s, con `--video` 2,58 s) · github.com/SYSTRAN/faster-whisper · pantalla: drop D1

Este clip duraba quince segundos y tenía más de tres segundos de silencio. Mi primer plan de cortes dijo: cero. Te muestro por qué, y el pedido que lo arregla.

Necesitás Claude Code, ffmpeg y faster-whisper: Whisper en tu computadora.

Paso uno: transcribir con el tiempo de cada palabra. En faster-whisper es una opción: word timestamps.

Paso dos, el crítico: el silencio se mide en el audio, no en el texto. Whisper deja las pausas adentro de las frases. Si buscás huecos entre frases, no encontrás ninguno. Con el filtro silence detect de ffmpeg, a menos treinta y dos decibeles, aparecieron más de dos segundos y medio para cortar.

Paso tres: una tabla. Con qué me quedo, qué tiro y por qué. La leés antes de cortar.

Paso cuatro: un preview en trescientos sesenta. Si un corte se comió una sílaba, lo escuchás ahí.

Si tu plan dice cero segundos de silencio en un video hablado, está midiendo el texto.

Comentá CORTES y te paso el pedido completo.

### D14-B · Vertical · Borrador en 480p antes de pagar el render
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** 4 Contenido con IA · **Destino:** comunidad de WhatsApp
**Evidencia:** https://higgsfield.ai/creator-hub/changelog (22-sep-2026, Seedance 2.5 Draft Mode; no dice cuánto ahorra) · cotizado por CLI el 29-sep: `higgsfield generate cost seedance_2_5 --draft true --resolution 480p` = 15 cr; 720p = 35; 1080p = 60 (5 s; parámetros `draft`/`draft_job_id` en `model get`). Recotizar el día de grabar · `CLAUDE.md` «Higgsfield — superficie, identidad y gasto» · pantalla: drop D2

Desde el veintidós de septiembre, Higgsfield tiene modo borrador para Seedance dos coma cinco. Generás en cuatrocientos ochenta, elegís la toma que sirve, y recién esa la hacés en mil ochenta.

Qué cambia: antes pagabas el render final para descubrir que la toma no servía. Ahora descartás en chico.

Pero la propia nota de Higgsfield trae la condición: el final repite el prompt, las referencias, la semilla, el formato y la duración del borrador. Si cambiás uno, ya no es la misma toma. Así que anotá la semilla de cada borrador que te guste.

¿Cuánto ahorra? El anuncio no lo dice, así que lo coticé con la CLI, que no cobra por cotizar: cinco segundos en borrador, quince créditos. En mil ochenta, sesenta. El borrador cuesta la cuarta parte. El comando es higgsfield generate cost, y lo ves en pantalla.

Cómo sabés que te salió bien: el final se parece al borrador que elegiste. Si no se parece, cambiaste algo.

La planilla donde anoto cada generación, con la semilla y el costo, está en la comunidad de WhatsApp.

### D14-C · YouTube · Grabo, la IA edita: mi sistema paso a paso
**Fórmula:** F1 Resultado primero → cómo → comprobación → siguiente paso · **Pilar:** 4 Contenido con IA · **Destino:** comunidad de WhatsApp
**Evidencia:** `.claude/skills/editor-videos/SKILL.md` (pasos 1, 2, 3, 3b, 6, 7b, 11, 13, «Orden del render», «Common mistakes») · `editor-videos/scripts/normalize-source.mjs` · `.claude/skills/ver-videos/SKILL.md` (distil solo inglés) · pantalla: drop D3

#### Resultado

Este video lo grabé de corrido, con el celular, trabándome como me trabo siempre. Nadie lo editó a mano. Lo cortó, lo subtituló y le niveló el audio una cadena de pasos que corre desde Claude Code.

Te voy a mostrar esa cadena completa, paso por paso, con las herramientas reales y los números que medí. Al final vas a poder armar la tuya, aunque sea con los primeros tres pasos.

#### Por qué importa

Editar un video de diez minutos a mano te lleva horas. Si publicás todos los días, o pagás un editor o dejás de publicar.

Hay un tercer camino: que la parte mecánica la haga código, y vos te quedes con las dos o tres decisiones que dañan tu marca si salen mal. Esa es la idea de todo el sistema. La IA hace el trabajo pesado, pero hay puntos donde se frena y te muestra algo antes de seguir.

#### Las herramientas

Cuatro, y todas gratis. Claude Code, que orquesta. ffmpeg, que corta y codifica. faster-whisper, que transcribe. Y HyperFrames, que es de HeyGen, para los gráficos animados.

Yo la transcripción la corro en mi servidor, con un servicio que sirve ese mismo modelo. Vos la podés correr en tu computadora.

#### Paso uno: arreglar lo que grabó el celular

El iPhone graba en HDR. Si pasás ese video al formato normal sin un paso que se llama tone mapping, la imagen queda lavada: la piel gris, todo muy blanco.

Lo medí. El brillo casi no cambia, por eso en los números no te das cuenta. Lo que se pierde es el color. Sin la conversión correcta, la saturación quedaba en cincuenta. Con ella, en setenta y dos. Cuarenta y cuatro por ciento más color.

El script mira si el video es HDR y aplica la conversión. Si no lo es, no toca nada. Y un detalle: el cuadro de control sacalo del original, no del convertido. Si no, estás comparando lo malo contra lo malo.

#### Paso dos: transcribir con el tiempo de cada palabra

Después transcribo. Pero no quiero solo el texto: quiero el segundo exacto de cada palabra. En faster-whisper es una opción, word timestamps. Sale un archivo con frases y palabras, cada una con su inicio y su final.

Ese archivo es la columna del sistema. De ahí salen los cortes, los subtítulos y el momento en que entra cada gráfico. La narración es la línea de tiempo.

#### Paso tres: el plan de cortes, que no corta

Con la transcripción y el audio, un script arma el plan de cortes. Busca tres cosas. Silencios largos. Frases que son pura muletilla: eh, este, o sea. Y frases repetidas: cuando me trabo y vuelvo a empezar, se queda con la segunda, que es la que me salió.

Y acá está la regla más importante del sistema: el script no corta. Imprime una tabla. Número, con qué me quedo, qué tiro y por qué. Esa tabla la leo yo antes de que se toque el video.

#### Paso cuatro: el preview y la tira de costuras

Con el plan sale un preview en trescientos sesenta. Es rápido y tiene el corte aplicado con el mismo filtro que el final, así que lo que apruebo es lo que sale.

Y sale una imagen más, que es mi favorita: la tira de costuras. En cada empalme pone el cuadro de antes y el de después, uno al lado del otro. Ahí ves si un corte se comió una sílaba o si quedó un salto feo. Si algo está mal, se ajusta el plan, no el video.

#### Paso cinco: el orden importa

Con mi ok, se aplica. Y el orden es este: cortar, zoom, gráficos, subtítulos y sonido.

¿Por qué el zoom antes que los subtítulos? Porque el zoom agranda el cuadro. Si los subtítulos ya estaban, se agrandan con él, y se ve amateur.

El zoom tiene un truco: un tamaño distinto para cada bloque del corte. Así el salto entre dos tomas deja de notarse.

Los gráficos no se ponen a ojo. Escribo en palabras cuándo entra cada uno —cuando diga tal cosa, entra esta tarjeta— y un script busca esa palabra en la transcripción y le pone el tiempo real. Si la palabra no aparece, me avisa en vez de inventar un tiempo. Y las letras de esos gráficos se dibujan con código, no se generan con IA. Así no hay faltas inventadas.

Los subtítulos salen igual, palabra por palabra. Antes de quemarlos hay una lectura a ojo que ningún script hace. A eso le dedico el video de mañana.

#### Paso seis: una sola pasada

Este error me costó calidad dos veces. Desarrollar por pasos está bien: cada paso se verifica solo. Pero si el final sale de cuatro codificaciones seguidas, cada una le saca un poco de detalle. En uno de mis videos, cuatro pasadas dejaron la cámara en cinco coma cinco megabits por segundo, y se notaba a ojo: la piel sin textura.

La solución: el final sale en una sola pasada, con el corte, el zoom y los gráficos en el mismo filtro. Subió a seis coma seis, y volvió la textura.

#### Paso siete: el audio, siempre al final

Último paso: el volumen. Mi material salía a menos veinte LUFS, que es la medida del volumen que percibís. Las redes normalizan cerca de menos catorce. Resultado: mi video sonaba seis decibeles más bajo que el de al lado.

Ahora el último paso es un loudnorm de dos pasadas a menos catorce, y el script vuelve a medir la salida para decirme dónde quedó. La imagen no se toca: se copia.

#### Cómo sabés que funcionó

Tres pruebas. La tabla de cortes muestra silencios reales: si dice cero en un video hablado, algo está mal. La tira de costuras no tiene sílabas comidas. Y el master te devuelve un número cerca de menos catorce.

#### El error que más cuesta

Si transcribís en español, no uses los modelos distil de Whisper. Son solo inglés. No te avisan: te traducen. Te devuelven un texto prolijo en otro idioma, y todo lo que sigue sale mal. Usá el multilingüe; yo uso el small.

#### Cierre

Si querés armarlo, empezá por tres pasos: grabá un minuto, transcribí con tiempos y pedí la tabla de cortes. La cadena completa, con cada filtro de ffmpeg escrito, la dejé en la comunidad de WhatsApp.

---

## Jueves 15-oct

### D15-A · Vertical · Subtítulos karaoke: el paso que ningún script hace
**Fórmula:** F1 Resultado primero → cómo → comprobación → siguiente paso · **Pilar:** 4 Contenido con IA · **Destino:** comunidad
**Evidencia:** `.claude/skills/editor-videos/scripts/karaoke-captions.mjs` (4 palabras, 1,6 s, `--style apple`, imprime la tabla de frases) · `editor-videos/SKILL.md` §5b (Seedance → «see dance», VSL → «viesel», medidos en reels ajenos) · pantalla: drop D4

Cada palabra de estos subtítulos se enciende justo cuando la digo. No es a ojo: la transcripción trae el segundo exacto de cada palabra.

El script agrupa de a cuatro palabras como mucho, en un segundo y seis décimas, y las ubica para no taparme la cara. La palabra activa va en verde. Sale un archivo de subtítulos que ffmpeg quema en el video.

Pero hay un paso que ningún script hace: leer la transcripción a ojo antes de quemarla. Whisper escribe español prolijo y mal escrito. En reels de otros que analicé, Seedance salía como «see dance», y VSL como «viesel».

Leo cuatro cosas, en este orden: eñes, acentos, la a con hache, y nombres propios contra la pantalla.

Si se escapa una, no se tapa con otra capa: se corrige la transcripción y se vuelve a renderizar.

Cómo sabés que está bien: el script imprime la tabla de frases. Esa tabla se lee entera antes de quemar.

Lo tenés completo en la comunidad: el link está en mi web.

### D15-B · Vertical · GPT Image 2.5 para fotos de producto: la IA toca el fondo, no el producto
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** 4 Contenido con IA · **Destino:** comunidad
**Evidencia:** https://developers.openai.com/api/docs/models/gpt-image-2.5-flare y `…/gpt-image-2.5-sunburst` (snapshot 2026-09-08; radar R6) · `CLAUDE.md` «Producto visible o no sale» · `editor-videos/SKILL.md` («la tipografía se dibuja en código») · pantalla: drop D5

El ocho de septiembre OpenAI sacó GPT Image dos coma cinco, en dos variantes. Flare: rápida, para lo de todos los días. Sunburst: para cuando la precisión de la edición importa. Las dos editan tu foto, y está en ChatGPT.

Para fotos de producto, eso significa: partís de tu foto real.

Es la regla que uso en todo lo que publico. La IA puede cambiar el fondo, la luz o la escena. El producto no se inventa. Y el texto —precio, nombre, promo— lo pongo después, por código, porque la IA se equivoca en letras.

Probalo así: subí una foto de tu producto y pedí: «Cambiá solo el fondo por una mesa de madera con luz de mañana. No modifiques el producto, la etiqueta ni los colores. Sin texto».

Cómo sabés que salió bien: poné la original al lado y hacé zoom a la etiqueta. Si cambió una letra, esa foto no se usa: estarías vendiendo algo que no existe.

Lo tenés completo en la comunidad: el link está en mi web.

### D15-C · Vertical · Mi agente arregló un botón y la home seguía prometiendo lo viejo
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** 6 Errores y lecciones · **Destino:** comunidad de WhatsApp
**Evidencia:** `CLAUDE.md` §2 «Una promesa que cambia se barre en TODA la superficie» (2026-08-23) y su corrección del 2026-09-03

Mi agente arregló un botón y dejó otros cuatro prometiendo lo contrario.

En agosto, el registro de mi sistema dejó de crear cuentas y pasó a ser una solicitud de acceso. Mi agente arregló esa página y la dio por terminada.

Pero la home tenía cuatro botones y una pregunta frecuente que decían: «Probá catorce días gratis, te registrás y usás el sistema». El visitante hacía clic esperando entrar, y encontraba un formulario. La peor fricción, en el último clic.

Y hubo una segunda parte. Cuando el registro se reabrió, la regla que escribí con este caso siguió diciendo que estaba cerrado. Cinco días se leyó como presente.

La regla: cuando cambia una promesa, buscá la frase vieja en toda la superficie. La web, los mensajes del bot, y también tus propias notas.

Hoy: elegí algo que cambiaste este mes —precio, horario, condición— y pedile a Claude Code que busque la frase vieja en todos los archivos de tu web.

Contame en la comunidad cuántas encontraste.

---

## Viernes 16-oct

### D16-A · Vertical · Carruseles por código: de un JSON a las láminas
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** 4 Contenido con IA · **Destino:** comentá LAMINAS
**Evidencia:** `scripts/carousel_render.js` (roles cover/stakes/point/cta; `--virtual-time-budget=10000` por el 2026-08-17; Chrome primero porque Edge dio PNG de 0 bytes el 2026-08-20) · pantalla: drop D6

Este carrusel no lo diseñé en ningún programa. Salió de un archivo de texto y un navegador.

Paso uno: un JSON. Una lista de láminas, cada una con título y texto. La primera es la portada, la segunda sube lo que está en juego, la última es el cierre. Las del medio: una idea por lámina.

Paso dos: un script arma una página web por lámina, de mil ochenta por mil trescientos cincuenta.

Paso tres: Chrome, sin ventana, le saca una captura a cada página. El comando lo ves en pantalla.

El paso crítico: darle tiempo a las fuentes. Con cuatro segundos, en un mismo carrusel salió una lámina con una letra y la siguiente con otra, porque la fuente no llegó a cargar. Ahora le doy diez.

Cómo comprobás: abrí todas las láminas juntas y mirá que la letra sea la misma en todas.

Por qué importa: el texto escrito en código no tiene faltas que la IA invente.

Comentá LAMINAS y te paso el JSON y el comando.

### D16-B · Vertical · Sora se apagó en la API: cómo saber si te afecta
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** 4 Contenido con IA · **Destino:** web `sergiourcullo.vercel.app/claude-code`
**Evidencia:** https://developers.openai.com/api/docs/deprecations (anunciado 24-mar-2026, apagado 24-sep-2026, reemplazo recomendado: «—»; radar R16) · búsqueda de `sora-2` en el repo el 29-sep: cero llamadas en código · `HIGGSFIELD_VIDEO_SYSTEM.md` («replaceable video generation engine»)

El veinticuatro de septiembre OpenAI apagó Sora en su API. Sora dos, Sora dos pro, sus versiones fechadas y la Videos API entera. Lo había anunciado el veinticuatro de marzo.

Y en la columna de reemplazo recomendado dice: nada.

Qué cambia para vos: si tenés un script o una automatización que pedía video a Sora por API, desde ese día falla. La app es otra cosa; esto es la API.

Probalo así. Abrí tu proyecto en Claude Code y pedile: «Buscá en todo este proyecto cualquier llamada a sora guion dos o a la Videos API, y listame archivo y línea».

Yo lo corrí en mi repositorio: cero llamadas. Mi video pasa por la CLI de Higgsfield, donde el modelo es un parámetro. Si uno se apaga, cambio una palabra.

Y el reemplazo no lo elijas de memoria ni de un video: higgsfield model list te muestra el catálogo del día.

Si todavía no usás Claude Code, en mi web está la guía para empezar.

### D16-C · YouTube · Generar con IA sin fundirte: el costo antes de crear
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** 4 Contenido con IA · **Destino:** comunidad de WhatsApp
**Evidencia:** costos cotizados por CLI el 29-sep (`text2image_soul_v2` 0,12 · `seedream_v5_lite` 1 · `nano_banana_flash` 1,5 · `gpt_image_2` 6,5) · `.claude/skills/higgsfield-generate/SKILL.md` UX rule 5 · `CLAUDE.md` Higgsfield · `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md` (0,12 cotizado = 0,12 debitado; `grace_daily_limit_reached` 02-sep) · `CONOCIMIENTO_DE_LOS_LOOPS.md` §7 · higgsfield.ai help center «What is the Higgsfield API» y changelog 16-sep · memoria `higgsfield-cobro-anual-no-deseado.md` · pantalla: drop D7

#### Resultado

Cuatro imágenes, cuatro precios: cero coma doce créditos, uno, uno coma cinco y seis coma cinco. Los saqué antes de generar nada, y sacarlos no me costó nada. La más cara sale cincuenta y cuatro veces la más barata.

En este video te muestro cómo trabajo con Higgsfield para que cada generación tenga su precio anotado antes de existir: los comandos, la aprobación por lote, el registro, y las trampas que me costaron plata o tiempo.

#### Por qué importa

Hacé la cuenta con un lote de diez imágenes: uno coma dos créditos en el modelo barato, sesenta y cinco en el caro. Si tu agente elige el modelo por vos y no te dice cuánto sale, te enterás mirando el saldo.

Y no es paranoia. La skill oficial de Higgsfield, la que le enseña a tu agente a usar su herramienta, le indica que no estime el costo antes, salvo que el usuario lo pida, y que prefiera la calidad por defecto. Para ellos es razonable. Para mí no.

Así que en mi archivo de instrucciones, el CLAUDE.md, escribí una regla que la pisa: siempre se cotiza antes, y se aprueba antes de generar. Las instrucciones de tu proyecto mandan sobre las de una skill que instalaste.

#### Paso uno: el nombre exacto del modelo

Todo pasa por la CLI de Higgsfield, que usa los créditos de tu plan. Primer comando: higgsfield model list. Te muestra el catálogo del día, con el nombre técnico de cada modelo.

¿Por qué no usar el nombre que ves en la web? Porque los nombres chocan. El modelo nano banana flash aparece en su propia tabla como Nano Banana dos. Pedís uno, pagás otro. El nombre técnico sale de model list, nunca de memoria ni de un documento viejo.

Dos detalles que me costaron una vuelta cada uno. El subcomando para generar es generate create: generate image no existe. Y en Windows escribí higgsfield completo, porque el atajo hf puede ser otra herramienta.

#### Paso dos: cotizar

Segundo comando: higgsfield generate cost, el nombre del modelo y los mismos parámetros que vas a usar. Te devuelve el precio en créditos, sin gastar nada.

Estos son los cuatro que coticé preparando este video. Text to image soul v dos: cero coma doce. Seedream v cinco lite: uno. Nano banana flash: uno coma cinco. GPT image dos: seis coma cinco.

Los precios cambian. Se cotiza el día que generás. No se copian de un video, tampoco de este.

#### Paso tres: aprobar por lote

Con el precio armo un lote: para qué pieza es, con qué modelo, cuántas imágenes, cuánto sale cada una y el tope total. Una aprobación cubre ese lote y sus imágenes, así no confirmo una por una. Pero no queda como permiso abierto: el lote siguiente se aprueba de nuevo.

Un lote real mío: tres candidatos para una mascota en tres D, con el modelo barato. Tres por cero coma doce: cero coma treinta y seis créditos. Cotizado antes, aprobado como lote, confirmado en el historial después.

El video va aparte. Cada video se aprueba solo, porque cuesta más y porque puede salir muy distinto de lo que esperabas.

#### Paso cuatro: una primero

No genero el lote entero de una. Genero una, la miro, y recién si vale, las variantes. Si la primera sale mal, perdiste una, no diez.

#### Paso cinco: registrar y comprobar

Cada generación queda anotada: modelo, parámetros, costo cotizado, costo real y para qué era.

Y el costo real se comprueba. Higgsfield account transactions, antes y después. La primera vez que lo hice, cotizó cero coma doce y debitó exactamente cero coma doce. Desde ahí confío en la cotización, y la sigo comprobando.

Y la prueba de que el sistema funciona es una suma: lo que dice tu planilla tiene que ser igual a lo que bajó tu saldo. Si no coincide, algo está generando sin pasar por un lote aprobado.

#### La trampa que tu tope no controla

El dos de septiembre, mi trabajo de imágenes llevaba gastado cero coma seis de un tope de un crédito por día. El modelo cotizaba cero coma doce. Y la generación falló: límite diario alcanzado.

No era mi tope. Era el de la cuenta, que es compartida: otro trabajo ya había gastado fuerte esa mañana. Cero cargo, lo verifiqué en las transacciones. Y reintentar ese día no sirvió de nada: el límite es diario y devuelve el mismo error.

La lección: si una pieza depende de generar, tené un plan que no dependa. Mis carruseles salen completos aunque no haya imagen generada ese día.

#### Plan o API

El dieciséis de septiembre Higgsfield lanzó su API como un producto aparte. Más de cincuenta modelos y pago por generación, con un saldo en dólares separado del plan. Solo cobra las generaciones que terminan bien. La CLI y la conexión con agentes, en cambio, descuentan créditos del plan.

¿Cuál te conviene? Si generás vos, o con tu agente, el plan. Si estás armando un producto que genera para otros, con cola y presupuesto propio, la API. En mi caso, la API queda para cuando exista esa fábrica. Mezclar los dos saldos es la forma más rápida de no saber cuánto gastaste.

#### El error común

Suscribirte sin leer cómo se baja de plan. A mí me pasó: el primero de septiembre, en mi cuenta, el único botón era cancelar la suscripción entera. Para bajar de plan tuve que escribirle a soporte. Leé eso antes de pagar, no después.

#### Cierre

Lo que podés hacer hoy: instalá la CLI, corré model list y cotizá el modelo que usás siempre. Si nunca lo habías mirado, vas a saber por primera vez cuánto te sale cada imagen.

El pedido que uso para armar y aprobar un lote, con los comandos en orden, está en la comunidad de WhatsApp.

---

## Sábado 17-oct

### D17-A · Vertical · Difuminar caras de terceros: tres fuerzas y una sola es irreversible
**Fórmula:** F4 Misma tarea, varios niveles · **Pilar:** 4 Contenido con IA · **Destino:** comunidad de WhatsApp
**Evidencia:** `.claude/skills/editor-videos/scripts/blur-faces.mjs` + `blur-faces-detect.py` (YuNet) · `editor-videos/SKILL.md` «Censurar caras — lo que NO se puede prometer» · pantalla: drop D8

Si grabás en la calle, aparece gente que no te dio permiso. Así la tapo, y lo que casi nadie te dice.

Mi script detecta caras con YuNet, un modelo chico de OpenCV, y las sigue cuadro a cuadro.

Tiene tres fuerzas. Difuminado: el más prolijo. Pixelado: más fuerte. Y caja: un rectángulo sólido. De las tres, la caja es la única irreversible. Para algo sensible de verdad, caja o pixelado.

Lo importante: la detección falla. De perfil, de lejos, con la cara tapada. Por eso el script imprime cuántos cuadros tuvieron cara y qué tramos quedaron sin tapar. Y si no detecta ninguna, no genera archivo. Un video sin censurar que creés censurado es peor que no tener nada.

Los huecos los tapo a mano, con regiones fijas por tiempo.

Cómo comprobás: mirá el render entero antes de publicar. Y nunca le digas a alguien que quedó anónimo sin haberlo mirado.

El pedido para armarlo y el formato de las regiones están en la comunidad de WhatsApp.

### D17-B · Vertical · Sacar el prompt de una imagen: recuperar o reconstruir
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** 4 Contenido con IA · **Destino:** comunidad
**Evidencia:** `.claude/skills/sacar-prompt/SKILL.md` (~58 reels; el prompt apareció en un solo cuadro) · `.claude/skills/ver-videos/scripts/text-frames.mjs` · pantalla: drop D9

Antes de adivinar el prompt de una imagen, fijate si ya está escrito. Analicé cerca de cincuenta y ocho reels, y varios lo mostraban en pantalla.

Paso cero, el crítico: buscar el texto. En un carrusel, leé todas las láminas. En un video, no mires un cuadro cada tantos segundos: en uno de esos reels el prompt apareció en un solo cuadro. Y leé la descripción.

Si lo encontraste, eso es recuperar: tenés el prompt exacto.

Si no está, reconstruís: escribís uno que da algo parecido. Y la regla es decirlo. «Este no es el prompt original, es uno que produce algo parecido». Presentar una reconstrucción como original es mentirle a quien te lo pidió.

Para reconstruir una foto uso ocho bloques, en orden fijo: apertura, sujeto con acción, rasgos, ropa, pose, fondo como lista de objetos, técnica de cámara, y lo que no querés.

Cómo sabés que funcionó: generá una y ponela al lado de la original.

Lo tenés completo en la comunidad: el link está en mi web.

### D17-C · Vertical · Mi agente publicó un rediseño que yo no había visto
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** 6 Errores y lecciones · **Destino:** web `sergiourcullo.vercel.app/claude-code`
**Evidencia:** `CLAUDE.md` «Velocidad» (2026-08-20: landing v2 publicada, rechazada y revertida en producción) · `hermes-content/skills/carruseles-onia.md` «Reglas de aprobacion»

En agosto le dije a mi agente: «ya te di todo lo que quería». Lo tomó como permiso para publicar. Y publicó la landing nueva.

Cuando la vi, la rechacé entera: no vendía nada. Hubo que revertirla en producción.

El agente no se equivocó en el código. Se equivocó en el permiso. Para él, construir y publicar eran lo mismo.

Desde ese día son dos permisos distintos. Primero me muestra la pieza renderizada, la captura de esa versión exacta. Después espera un sí explícito sobre esa pieza.

Y lo dejé escrito con la frase exacta. Para publicar un carrusel, la aprobación es «Apruebo publicar» y el nombre de la pieza. «Ok», «dale» o «hazlo» no cuentan.

Si trabajás con un agente, o con alguien que te arma la web, pedí lo mismo: vista previa antes de tocar lo que está en el aire.

Hoy: escribí en tus instrucciones qué frase cuenta como permiso para publicar. En mi web, en la guía de Claude Code, está dónde van esas reglas.

---

## Domingo 18-oct

### D18-A · Vertical · Que la IA «vea» tu video, y que te diga cuánto vio
**Fórmula:** F4 Misma tarea, varios niveles · **Pilar:** 4 Contenido con IA · **Destino:** comunidad de WhatsApp
**Evidencia:** `.claude/skills/ver-videos/SKILL.md` (Gemini nativo probado el 2026-07-24 con un tutorial de 28 min por link de YouTube; tope gratis ~20 videos/día; regla de cobertura) · pantalla: drop D10

Cuando le pedís a una IA que mire un video, preguntale cuánto vio. Hay tres niveles.

Nivel uno: un modelo que mira el video de verdad, imagen y audio juntos. Yo uso Gemini: le paso el link de YouTube y me devuelve un resumen con los minutos. Así mi sistema vio entero un tutorial de veintiocho minutos. En el plan gratis, me corta cerca de los veinte videos por día.

Nivel dos: fotogramas más transcripción. Sacás un cuadro cada cinco segundos con ffmpeg, transcribís el audio con Whisper, y la IA lee las dos cosas. Sirve, pero pierde el movimiento.

Nivel tres: solo la descripción del post. Barato, y en carruseles muchas veces alcanza.

La regla: la IA te dice qué camino usó y cuánto cubrió. «Audio completo, vi quince de sesenta cuadros». Nunca «vi el video» desde dos imágenes.

Probalo: pedile a Claude Code que analice un video y que cierre con esa línea de cobertura.

El pedido exacto está en la comunidad de WhatsApp.

### D18-B · Vertical · Un video que sale de una página web
**Fórmula:** F1 Resultado primero → cómo → comprobación → siguiente paso · **Pilar:** 4 Contenido con IA · **Destino:** web `sergiourcullo.vercel.app/stack`
**Evidencia:** `scripts/hyperframes/README.md` «Motor de la casa» (A/B 2026-07-30; Apache-2.0 verificado 2026-08-21) · `~/.claude/skills/hyperframes-cli/SKILL.md`, copia global desde el 29-sep (Node 22+, FFmpeg; init / check / preview / render) · guía `/stack` sección HyperFrames

Esta tarjeta animada no la hice en un editor. Es una página web con tiempos, y sale un MP4.

La herramienta es HyperFrames. No es mía: es de HeyGen, de código abierto, con licencia Apache. Yo la uso para los apoyos de mis videos: el número que sube, la cita, el rótulo con un nombre.

Cómo arranca: con Node veintidós y ffmpeg instalados, npx hyperframes init y el nombre del proyecto. Editás el HTML, corrés npx hyperframes check, lo mirás con preview, y render te da el video.

La trampa: tiene que ser determinista. Si usás un número al azar o la hora actual, el render sale roto.

Antes de elegirla la medí contra Remotion, con la misma pieza y los mismos tiempos. Salieron visualmente iguales. HyperFrames no necesita armar un paquete antes de renderizar, y sus imágenes pesaban la mitad.

Para qué no sirve: no corta ni edita lo que grabaste. Es para piezas que repetís.

En mi web, en la guía del stack, está cómo instalarla.

### D18-C · Vertical · Mis agentes me piden permiso por Telegram, con la foto
**Fórmula:** F6 Construyo en público · **Pilar:** 2 Agentes y loops · **Destino:** comunidad
**Evidencia:** `scripts/loops/vigia-aprobaciones.sh` (2026-09-03: 11 tareas esperando, resumen cada 2 h, 0 imágenes; álbum hasta 10; el resumen falló por comillas) · memoria `onia-circuito-aprobaciones-telegram.md` · pantalla: drop D11

Mis agentes trabajan de noche, pero nada se publica sin mi ok, desde el celular.

El tres de septiembre conté once tareas esperando mi decisión. Ningún aviso me llegaba al momento: solo un resumen cada dos horas. Y cuando había que aprobar una imagen, me mandaban la ruta del archivo. Una ruta. Desde el celular no se aprueba una ruta.

Ahora el agente frena la tarea y escribe por qué. Un vigía revisa cada dos minutos y me la manda a Telegram con la foto. Si es un carrusel, llegan todas las láminas en un álbum. Contesto «ok» y el número, o «no», el número y el motivo.

Lo que salió mal: la primera vez, el resumen de las once falló por un error de comillas. Y el script igual las marcó como avisadas. Ahora solo marca cuando Telegram confirma que llegó.

Si tenés un negocio, así delegás sin perder el control: la pregunta llega con la prueba.

Lo tenés completo en la comunidad: el link está en mi web.

---

## Lunes 19-oct

### D19-A · Vertical · La miniatura de YouTube se busca, no se elige
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** 4 Contenido con IA · **Destino:** comunidad
**Evidencia:** `.claude/skills/editor-videos/SKILL.md` «Miniatura de YouTube» · `videos/claude-vs-claudecode/scripts/buscar-cara.py` (pesos) · memoria `miniatura-youtube-metodo.md` (2026-09-08: tres rondas; 19 archivos, 3.723 caras) · pantalla: drop D12

Rehicimos tres veces la misma miniatura. El problema no era el diseño: era mi cara.

Mi agente elegía el cuadro a ojo, del tramo donde parecía que sonreía. Tres rondas, tres correcciones mías.

Entonces cambiamos el método: puntuar todo. Barrió diecinueve archivos de grabación y puntuó tres mil setecientas veintitrés caras. Nitidez, que mire de frente, sonrisa y boca cerrada. El mejor cuadro no estaba en el video que se estaba editando: estaba en otra toma del mismo día.

Y el error que más me enseñó: al principio medía la sonrisa por el ancho de la boca. Las doce mejores salieron con la boca abierta a mitad de palabra. En un video hablado, boca ancha es hablar, no sonreír. Ahora pesa más que la boca esté cerrada.

La regla: el puntaje ordena, yo elijo. Y la miro a doscientos diez píxeles de ancho, que es como se ve en el feed.

Lo tenés completo en la comunidad: el link está en mi web.

### D19-B · Vertical · El verde de tu marca puede ser ilegible
**Fórmula:** F5 Abrí la fuente: número primero → lectura → consecuencia práctica · **Pilar:** 7 Web y landing · **Destino:** web `sergiourcullo.vercel.app`
**Evidencia:** `hermes-content/sitio-sergiourcullo/estilo.css` (`--onia:#00C661`, `--onia-texto:#007A44`, fondo `#FBFBFC`) · contraste recalculado el 29-sep con la fórmula WCAG de `scripts/marca-personal/experimento-verde-marca.py`: 2,20:1 y 5,25:1 (el README del sitio dice 1,7:1; el número medido es 2,2)

El verde de mi marca, sobre el fondo claro de mi web, da dos coma dos a uno de contraste. Para texto normal, el mínimo recomendado es cuatro coma cinco. Se ve lindo y no se lee.

Lo medí con la fórmula de contraste de la WCAG, las pautas de accesibilidad web.

La solución: usarlo en dos tonos. El verde de marca va como superficie: botones y etiquetas, con letra oscura encima. Y para texto sobre fondo claro, el mismo verde con menos luminosidad: cinco coma dos a uno.

Probalo: pedile a Claude Code «calculá el contraste WCAG entre este color y este fondo». Si da menos de cuatro coma cinco, ese color no va como texto.

Por qué importa: si el enlace a tu WhatsApp va en tu color de marca, es el texto más importante de la página y el que peor se lee.

Entrá a mi web y fijate: el verde de los botones y el de los enlaces no es el mismo.

### D19-C · YouTube · Agentes que trabajan de noche: de 443 avisos a un parte por día
**Fórmula:** F3 Caso real → error → por qué → corrección → regla (horizontal: caso → auditoría → corrección → regla aplicada a más casos) · **Pilar:** 2 Agentes y loops · **Destino:** comunidad de WhatsApp
**Evidencia:** `scripts/loops/onia-tg.sh` (443/256/242/226 mensajes del 04 al 07-sep; 18 scripts; negación, 2026-09-10) · `scripts/loops/parte-diario.sh` (orden, 2026-09-21) · `scripts/loops/vigia-ci.sh` (2026-09-06) · `CLAUDE.md` «`main` se mueve DEBAJO tuyo» · memoria `hermes-gasto-bajar-no-subir.md` · pantalla: drop D13

#### El caso

El cuatro de septiembre, mis agentes me mandaron cuatrocientos cuarenta y tres mensajes por Telegram. En un día. El cinco, doscientos cincuenta y seis. El siete, doscientos veintiséis.

Hoy me mandan uno por día: un parte que dice «todo en orden», o la lista corta de lo que no pudieron arreglar. Más las preguntas que sí son mías.

Te muestro cómo se pasó de uno a otro, las dos veces que el arreglo nuevo mintió, y las reglas que podés copiar si tenés automatizaciones que te escriben.

#### Por qué importa

Dieciocho scripts me escribían por el mismo canal. Eso es un mensaje cada tres minutos. Y un aviso cada tres minutos no es un aviso: es ruido. El ruido esconde justo el mensaje que importa.

Además, el ruido cuesta. Muchos de esos mensajes los redactaba un agente, y cada llamada a un modelo se paga. Cuando llegué a un techo de gasto, la tentación era subir el tope. Hice lo contrario: bajar el consumo. Los mensajes sin sentido eran el gasto.

#### Regla uno: un aviso no es un mensaje, es una tarea

El cambio de fondo fue este. Por defecto, un aviso ya no se manda. Se convierte en una tarea del tablero, que es de donde mis loops sacan trabajo. Un CI roto o un loop caído ahora se arregla, no se avisa.

Solo dos cosas salen directo al celular: lo que necesita mi aprobación y las preguntas de desarrollo. Todo lo demás va al tablero. Y el registro guarda todo igual. Nada se pierde: solo deja de interrumpir.

#### Regla dos: solo lo roto ocupa lugar

Primer problema, a las horas de encenderlo. El tablero se llenó de avisos del tipo «terminé, un commit». Eso no es trabajo: es un loop contando que le fue bien. Había mudado el ruido de Telegram al tablero, donde molesta más, porque compite con el trabajo real.

Corrección: solo los problemas se vuelven tarea. Y se clasifica por la primera línea, el titular, no por el mensaje entero. Un aviso que dice «rescaté un mensaje perdido» nombra en el cuerpo el error del que lo rescató. Si mirás el cuerpo entero, todo relato se vuelve tarea.

#### Donde el filtro mintió

Dos días después entraron cuatro tareas de éxito. ¿Por qué? Porque cuando un aviso es un solo párrafo, la primera línea es el mensaje entero. Y un loop al que le fue bien escribe cosas como «nada roto». La palabra roto está ahí. Negada, pero está.

Resultado: una tarea diciendo que algo estaba roto, porque el loop dijo que no lo estaba. La corrección: antes de buscar la palabra, se borra la negación. La palabra nunca se saca del filtro.

#### Regla tres: un solo parte por día

Lo único que me habla sin que pregunte es el parte diario. Dice una de dos cosas: «todo en orden», o cuántas cosas el sistema no pudo arreglar. Y solo cuenta las que llevan abiertas más de unas horas, o sea las que el sistema ya intentó y no pudo. Una tarea recién creada no se reporta: el loop todavía no tuvo su vuelta.

#### Donde el parte mintió

Y acá el error más caro. El diecinueve de septiembre se cayeron cuatro loops de una de mis máquinas. El vigía lo detectó bien. Pero su tarea entró al tablero como la dieciséis de dieciséis.

El parte nombraba cinco y resumía el resto. Y tomaba las cinco primeras de una lista ordenada por fecha de creación: las cinco más viejas. Dos mañanas seguidas, mi único mensaje del día nombró pendientes de más de diez días y resumió la caída real como «y once más en el tablero».

Un recorte por antigüedad esconde, por diseño, lo que se acaba de romper. Corrección: primero lo grave, y dentro de cada grupo, lo más nuevo arriba.

#### Regla cuatro: vigías que avisan por cambio

La última pieza son los vigías. El seis de septiembre, un ícono guardado con un formato de color que el framework no acepta tumbó el build. GitHub lo marcó como fallido. Nos enteramos diez minutos después, de casualidad. Tenía unos veinte vigías, y ninguno miraba el CI.

El vigía nuevo es tonto a propósito: lee el estado, lo compara con el anterior y avisa. No reintenta, no arregla. Y avisa por cambio, no por estado: un mensaje cuando se pone rojo y otro cuando se recupera. Si sigue rojo, no repite. Treinta mensajes iguales hacen que nadie lea el treinta y uno.

Un detalle que costó una vuelta: el token que ya tenía leía el repositorio, pero no el estado del CI. Un token válido no es un token con permisos. Para eso hace falta permiso de lectura de Actions.

#### Lo que no hay que hacer

Un día un agente mío midió mal porque otros cambios entraron mientras medía. La primera idea fue: que me avise por Telegram cada merge. Son unos veintiocho por día. Eso es volver al principio. La señal ya existía en git; lo que faltaba era mirarla. Sumar un aviso a un canal saturado es apagarlo.

#### Cómo lo armás vos

Si tenés automatizaciones que te escriben, son tres pedidos a Claude Code.

Uno: que tus scripts, por defecto, anoten en una lista de tareas en vez de mandarte un mensaje, y que solo lo que empieza como problema cree tarea, borrando antes las negaciones.

Dos: un parte diario. Un solo mensaje, con lo grave primero y lo más nuevo arriba.

Tres: vigías que guarden el último estado y avisen solo cuando cambia.

Y para saber si funcionó, contá. Cuántos mensajes por día antes, cuántos después. Yo lo conté en el registro del mismo script: de cuatrocientos cuarenta y tres a uno.

#### Cierre

Los tres pedidos, escritos para copiar y pegar, están en la comunidad de WhatsApp.

---

## Martes 20-oct

### D20-A · Vertical · Que tu sistema no pague el mismo error todos los días
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** 2 Agentes y loops · **Destino:** comunidad
**Evidencia:** `scripts/loops/extraer-fallos.sh` (2026-09-04: umbral 2, firma normalizada, ancla de línea, `--autotest`) · `hermes-content/docs/handoff/supervisor.md` · pantalla: drop D14

Mi sistema pagaba el mismo error todos los días, y nadie lo convertía en lección. Así lo arreglé, sin IA.

Un supervisor reportaba qué loop no avanzaba, pero nadie comparaba una vuelta con la anterior.

Ahora corre un script sin modelo. Lee los registros de las últimas veinticuatro horas y cuenta lo que se repite.

El paso crítico es la firma. El mismo error nunca se escribe dos veces igual: cambia la hora, la ruta, el número. Así que antes de contar, el script borra fechas, rutas, códigos y números. Lo que queda es la firma, y esa sí se repite.

Y solo cuenta líneas que empiezan como error de máquina; si no, contaría las frases de informes que dicen «error».

El umbral es dos. Una vez es mala suerte; dos, es un patrón. Ese patrón le llega al supervisor, que escribe la lección.

Prueba: el mismo error a dos horas distintas sale como una sola firma, contada dos veces.

Lo tenés completo en la comunidad: el link está en mi web.

### D20-B · Vertical · Un loop sin cola inventa trabajo
**Fórmula:** F5 Abrí la fuente: número primero → lectura → consecuencia práctica · **Pilar:** 2 Agentes y loops · **Destino:** web `sergiourcullo.vercel.app/claude-code`
**Evidencia:** `hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md` (25 %–46 % inexistente; once párrafos «sigue igual»; seis consumidores y cero productores; el cron que no existía)

Entre el veinticinco y el cuarenta y seis por ciento de las tareas que mis loops tenían pendientes no existían.

Un loop es un agente que se despierta cada tanto, toma el siguiente ítem de su cola, lo cierra y se apaga. No piensa: come. Y si la cola no tiene trabajo real, inventa.

Me pasó así. Uno de mis loops escribió once párrafos seguidos diciendo «sigue igual». Y tenía seis loops que comían de colas y cero que las llenaran. El relleno estaba documentado como «un cron cada diez minutos». Ese cron no existía.

Tres reglas. Antes de automatizar, la cola tiene ítems reales, verificables por un desconocido. Prohibido inventar una tarea que no está en la cola. Y una vuelta sin cambios es un resultado válido.

Si armás varios loops, armá al menos uno que produzca trabajo. El mío abre las pantallas del producto, las mira, y anota cada diferencia con su captura.

En mi web, la guía de Claude Code muestra cómo dejarlo trabajando por horario.

### D20-C · Vertical · «Ya está hecho»: tres niveles, y solo uno vale
**Fórmula:** F4 Misma tarea, varios niveles · **Pilar:** 6 Errores y lecciones · **Destino:** comunidad de WhatsApp
**Evidencia:** `CLAUDE.md` «Nada a medias» (2026-08-01: capa multi-rubro construida y apagada) · `hermes-content/docs/CONOCIMIENTO_DE_LOS_LOOPS.md` §2 (mergeado · construido · vivo; build cerrado con 8 commits detrás)

«Ya está hecho». Hay tres niveles de hecho, y solo uno vale plata.

Nivel uno: está guardado. El código está en el repositorio; el diseño, en la carpeta.

Nivel dos: está construido. La versión nueva se armó, pero todavía no es la que ve la gente. Me pasó: una versión completa, cerrada, con ocho cambios nuevos, mientras producción seguía sirviendo la anterior.

Nivel tres: está vivo. Encendido en producción, y alguien lo miró funcionando ahí.

En agosto encontré una parte entera de mi sistema construida y apagada. Trabajo terminado, valor cero, porque nadie la podía usar.

Desde entonces tengo una regla: prohibido reportar como hecho lo que está detrás de un interruptor apagado.

Si le encargás algo a alguien, o a un agente, pedí la prueba del nivel tres: el link, la captura de la pantalla real, o probarlo vos.

Contame en la comunidad qué tenés hoy en el nivel dos.

---

## Drops de la semana

Texto literal para la comunidad o el DM. Cada uno responde a la pieza que lo promete.

**D1 · CORTES** (D14-A, por DM)
```
Pedile esto a Claude Code (necesitás ffmpeg y `pip install faster-whisper`):
"Tengo crudo.mp4, hablado en español. En orden, y NO cortes nada hasta que yo diga ok:
1. Transcribilo con faster-whisper (modelo small, language='es', word_timestamps=True) y guardá segments.json con frases y palabras.
2. Medí los silencios en el AUDIO: ffmpeg -i crudo.mp4 -af silencedetect=noise=-32dB:d=0.45 -f null -  (no uses los huecos del transcript).
3. Marcá para tirar: silencios, frases que sean solo muletillas (eh, este, o sea, a ver) y frases repetidas (me quedo con la segunda).
4. Mostrame una tabla: # | Me quedo con | Tiro | Por qué, más la duración antes y después.
5. Con mi ok: preview a 360p con select/aselect de los tramos que quedan, y una imagen con el cuadro de antes y después de cada empalme."
```

**D2 · Planilla de generaciones** (D14-B, comunidad)
```
Una fila por generación, ANTES de apretar:
fecha · pieza · modelo (nombre técnico, de `higgsfield model list`) · parámetros (resolución, formato, duración) · semilla · costo cotizado (`higgsfield generate cost`) · quién aprobó · costo real (`higgsfield account transactions` antes y después) · ¿sirvió? y por qué
Borrador elegido → el final se corre con el MISMO prompt, referencias, semilla, formato y duración.
Si el costo real no coincide con el cotizado, se frena el lote y se revisa.
```

**D3 · La cadena de edición** (D14-C, comunidad)
```
Orden: normalizar → transcribir → plan de cortes (tabla) → preview 360p + costuras → [tu ok] → cortar → zoom → gráficos → subtítulos → sonido → master
1. HDR del iPhone: -vf "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"
2. faster-whisper, modelo small (multilingüe). Los distil son solo inglés y traducen. word_timestamps=True.
3. Silencios: silencedetect=noise=-32dB:d=0.45 sobre el AUDIO. Muletillas y repetidas, por texto.
4. Corte: -vf "select='between(t,A,B)+between(t,C,D)',setpts=N/FRAME_RATE/TB" -af "aselect='between(t,A,B)+between(t,C,D)',asetpts=N/SR/TB"
5. Final en UNA pasada: corte + zoom + gráficos en el mismo filter_complex. Nada de cuatro codificaciones seguidas.
6. Master al final: loudnorm de dos pasadas a I=-14 : TP=-1.5 : LRA=11, video copiado (-c:v copy). Volvé a medir la salida.
```

**D4 · SUBTITULOS** (D15-A, por DM)
```
Antes de quemar subtítulos, leé la transcripción entera, en este orden:
1. Eñes (año, mañana, araña): es lo que más se pierde, y en mayúsculas no se nota.
2. Acentos que cambian el sentido: más/mas, está/esta, sí/si, él/el.
3. "a" delante de un participio es "ha" (ha generado).
4. Nombres propios y términos técnicos: contra la pantalla o la fuente. Los números dichos a cámara, dos veces.
Si no podés verificar cómo se escribe algo, preguntá: no se quema una adivinanza.
Se corrige en la transcripción. Si ya se quemó, se vuelve a renderizar; no se tapa.
```

**D5 · FOTO** (D15-B, por DM)
```
Subís tu foto real y pedís:
"Cambiá solo el fondo por [mesa de madera clara, luz de mañana desde la izquierda]. No modifiques el producto, la etiqueta, el logo, los colores ni la forma. Sin texto y sin marcas de agua."
Otras escenas para el corchete: [estante de tienda] · [una mano sosteniéndolo] · [fondo liso de un color].
Precio, nombre y promo: se agregan después, en tu editor. No se los pidas a la IA.
Control: original al lado y zoom a la etiqueta. Si cambió una letra, el logo o el color, esa foto no se usa.
```

**D6 · LAMINAS** (D16-A, por DM)
```
brief.json:
{"title":"Mi carrusel","slides":[
 {"headline":"Portada: el problema en una frase","body":"..."},
 {"headline":"Lo que está en juego","body":"..."},
 {"headline":"Una idea por lámina","body":"..."},
 {"headline":"Cierre: una sola acción","body":"..."}]}
Pedido a Claude Code: "Por cada lámina de brief.json armá un HTML de 1080x1350 con mi fuente y mi color, y sacale captura con Chrome."
Captura: chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=10000 --screenshot=slide-01.png file:///C:/ruta/slide-1.html
Control: abrí todas juntas y mirá que la letra sea la misma en todas.
```

**D7 · El lote en Higgsfield** (D16-C, comunidad)
```
1. higgsfield model list → copiá el nombre técnico, no el de la web.
2. higgsfield generate cost <modelo> [los mismos parámetros] → precio por unidad, sin gastar.
3. Lote para aprobar: pieza · modelo · cantidad · costo por unidad · tope total. Una aprobación = este lote, no los siguientes.
4. Aprobado → generá UNA (higgsfield generate create <modelo> ... --wait), mirala, y recién después las variantes.
5. higgsfield account transactions antes y después → costo real = cotizado. Si no coincide, se frena.
6. Anotalo en la planilla (drop del miércoles). Video: una aprobación por cada video, nunca por lote.
7. Si falla por límite diario de la cuenta, no reintentes ese día: la pieza sale sin esa imagen.
```

**D8 · Caras de terceros** (D17-A, comunidad)
```
Pedido a Claude Code:
"Armá un script que detecte caras con YuNet (OpenCV, modelo face_detection_yunet_2023mar.onnx de opencv_zoo), las siga cuadro a cuadro y las tape con ffmpeg en modo blur, pixelate o box.
Que imprima cuántos cuadros tuvieron cara, cuántos no, y los tramos que quedaron SIN tapar.
Que falle sin generar archivo si no detecta ninguna cara.
Que acepte regiones manuales: {"regions":[{"x":0,"y":0,"w":200,"h":200,"start":3.2,"end":5.0}]}"
Requisito: python -m pip install opencv-python
Para algo sensible: box o pixelate. Mirá el render entero antes de publicar: no es garantía de anonimato.
```

**D9 · PROMPT** (D17-B, por DM)
```
Paso 0: ¿está el prompt en pantalla? Todas las láminas, la descripción, y en video los cuadros donde aparece texto.
Si no está, reconstruís y lo decís: "no es el prompt original, es uno que da algo parecido".
Ocho bloques, en este orden:
1 Apertura ("Ultra-realistic vertical ... photo of") · 2 Sujeto con acción · 3 Rasgos (pelo, piel, expresión, mirada) · 4 Vestuario (prenda, material, color) · 5 Pose, miembro por miembro · 6 Fondo como lista de objetos · 7 Técnica (cámara, luz) · 8 Negativo
Negativo base: CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening, blurry subject, text, watermark
Sumale 2 o 3 negativos propios de tu sujeto.
```

**D10 · Que la IA vea un video** (D18-A, comunidad)
```
Pedido a Claude Code:
"Analizá este video: <link o archivo>. Bajalo en 360p con yt-dlp (-f 18). Sacá un fotograma cada 5 segundos con ffmpeg (fps=1/5, 640 px de ancho) y el audio en mono. Transcribí el audio con faster-whisper (small, es).
Leé 10 a 15 fotogramas repartidos de principio a fin, más los que coincidan con momentos clave del audio.
Devolveme: qué se dice, qué se muestra (con el minuto) y una última línea de cobertura: 'audio X %, vi N de M fotogramas'."
Si tenés clave de Gemini: que mire el video nativo (imagen + audio) y que igual diga qué camino usó.
```

**D11 · PERMISO** (D18-C, por DM)
```
El mensaje que manda el vigía (cada 2 minutos, solo tareas frenadas esperando una decisión humana):
Pregunta: <título de la tarea> · <número>
Motivo: <una línea>
<extracto de lo que hay que aprobar> + la foto, o el álbum si son varias láminas (hasta 10)
Contestá: ok <número> · no <número> motivo
Reglas: un aviso por tarea, nunca dos · la primera vez, un solo resumen de lo que ya esperaba · se marca "avisado" SOLO si Telegram confirmó que llegó · los bloqueos técnicos no se mandan: son del sistema, no tuyos · si la foto no pasa, la pregunta va igual en texto.
```

**D12 · MINIATURA** (D19-A, por DM)
```
Pedido a Claude Code: "Recorré todos mis videos a cámara de esta carpeta, detectá caras con YuNet (OpenCV) y puntuá cada cuadro con esta fórmula:"
puntaje = 0,30 × sonrisa + 0,26 × nitidez + 0,62 − penalidad por boca abierta (hasta 0,62) − penalidad por pose (ojos desnivelados hasta 0,34; nariz descentrada hasta 0,24)
Sonrisa = comisuras más arriba respecto de la nariz. NO el ancho de la boca: eso mide que estás hablando.
Nitidez = varianza del laplaciano sobre la cara. Sonrisa y nitidez normalizadas de 0 a 1.
Hoja de contactos con un cuadro por momento (sin seis casi iguales). Elegís vos.
Control: mirala a 210 px de ancho.
```

**D13 · Los tres pedidos de avisos** (D19-C, comunidad)
```
1 · Enrutador: "Hacé que todos mis scripts de aviso llamen a uno solo. Por defecto no me manda mensaje: si la PRIMERA línea es un problema, crea una tarea en mi lista; si no, solo lo registra. Antes de buscar palabras de error, borrá las negaciones ('nada roto', 'sin errores'). Solo con una marca explícita (aprobaciones y preguntas) sale al celular."
2 · Parte diario: "Una vez al día mandame UN mensaje: 'Todo en orden', o las tareas que llevan abiertas más de N horas. Lo grave primero y, dentro de cada grupo, lo más nuevo arriba. Nombrá cinco y contá el resto."
3 · Vigía: "Guardá el último estado que viste. Avisame solo cuando cambia: al ponerse rojo y al recuperarse. No reintentes ni arregles."
Medí: mensajes por día antes y después.
```

**D14 · FALLOS** (D20-A, por DM)
```
Pedido a Claude Code: "Armá un script sin IA que lea mis logs de las últimas 24 horas y devuelva un JSON con lo que se repite.
- Solo líneas que empiezan como error de máquina (Error:, fatal:, Traceback, npm ERR!) o que contienen 'Permission denied', 'command not found', 'No such file'. Nada de prosa de informes.
- Firma de cada error: borrá fechas, horas, hashes, rutas y números; pasá a minúsculas.
- Reportá las firmas que aparecen 2 o más veces, con cuántas veces, en qué procesos y un ejemplo.
- Agregá un modo --autotest que se pruebe solo."
Después, que un agente lea ese JSON y escriba la lección en tus instrucciones.
```

---

## Esqueleto de la guía del domingo

`sergiourcullo.vercel.app/contenido-ia` (no existe aún; se escribe para el domingo 18):

1. **Qué hace la IA y qué decidís vos** — la cadena entera en un diagrama y los dos puntos donde se frena a esperar tu ok.
2. **Grabar con el celular** — el HDR del iPhone, el tone mapping y el cuadro de control sacado del original.
3. **Transcribir con el tiempo de cada palabra** — faster-whisper small, `word_timestamps`, y por qué los distil traducen.
4. **Cortar sin cortar a ciegas** — silencios medidos en el audio, la tabla de cortes, el preview y la tira de costuras.
5. **Subtítulos que no queman faltas** — karaoke por palabra y la lectura a ojo en cuatro barridos.
6. **Gráficos y láminas en código** — HyperFrames para lo animado, un JSON y Chrome para los carruseles.
7. **Generar imágenes y video sin fundirte** — `model list`, `generate cost`, aprobación por lote, registro y límite diario.
8. **Proteger a terceros** — caras difuminadas, las tres fuerzas y el render mirado entero.
9. **Que la IA vea videos y saque prompts con honestidad** — la línea de cobertura y recuperar vs reconstruir.
10. **Agentes que avisan poco y bien** — aprobaciones desde el celular, el parte diario y vigías por cambio.

---

## Autocrítica contra las 7 condiciones

| # | Condición | Estado | Dónde flojea |
|---|---|---|---|
| 1 | Promesa en 3 s | Cumple en las 21 | D14-B y D16-B abren con fecha de noticia, no con resultado: es la forma de F2, pero pierden fuerza frente al resto. |
| 2 | Unidad completa | Cumple; los comandos y pedidos exactos van en los drops D1–D14 | D17-A y D20-A enseñan scripts propios que el espectador no tiene: se resolvió dando el pedido para construirlos (D8, D14), no el script. D18-B nombra los comandos de HyperFrames pero no una composición mínima. |
| 3 | Ejemplo real | Cumple, con evidencia por pieza | **D15-B (R6)** es la más débil: fuente primaria de OpenAI + regla de ONIA, sin prueba propia de GPT Image 2.5. Si Sergio Urcullo la corre antes de grabar, conviene sumar el antes/después. **D14-B (R14)**: el changelog no dice cuánto ahorra el borrador, y no verifiqué si el modo borrador existe en la CLI; por eso la pieza pide cotizar y no promete ahorro. **D16-B (R16)**: «qué usar» se contesta con método (catálogo del día + cotizar), no con un modelo, porque OpenAI no indica reemplazo. |
| 4 | Verificación | Cumple en las 21 | D14-B y D15-B verifican a ojo (parecido con el borrador; zoom a la etiqueta), sin número. |
| 5 | Por qué importa | Cumple | D18-B lo dice de forma débil («para piezas que repetís»). |
| 6 | Un solo cierre a destino existente | Cumple: 8 comunidad · 8 «comentá» con drop escrito · 5 web (`/claude-code`, `/stack`, raíz) | La entrega por DM de las 8 palabras es manual; no hay cableado comentario → DM. `/contenido-ia` no se usa como destino. |
| 7 | Cero relleno | Cumple: sin «mis clientes», sin disclaimers, sin secretos (ni IDs, ni Soul IDs, ni IPs, ni cuentas) | **D19-B:** el README del sitio dice 1,7:1; recalculé 2,2:1 sobre el fondo real (2,27 sobre blanco puro). El guion usa el número medido; el README queda por corregir. **D16-C:** los cuatro costos son del 29-sep; se re-cotizan el día de grabar. **D18-A:** la cuota gratis de Gemini es de julio y Google movió modelos en septiembre (R10). **D14-C** dice «este video nadie lo editó a mano»: solo vale si se edita con esa cadena. |

Repetición de ejemplos: el circuito de aprobaciones (A-05) está en D18-C y el YouTube del lunes solo lo nombra como excepción, sin repetir el caso. El clip de 15 s va solo en D14-A; el YouTube del miércoles usa HDR, costuras, codificación y LUFS. El reel ajeno con faltas quemadas no se usa; D15-A usa «see dance» y «viesel».
