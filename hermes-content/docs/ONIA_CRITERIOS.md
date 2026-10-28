# Lo que Sergio Urcullo aprueba y rechaza

Sus lentes: los criterios con que juzga una entrega, sacados de sus propias correcciones. La orquesta se los pasa a
cada trabajador y a cada revisor (`scripts/orquesta/orquesta.mjs`), y Hermes los usa al verificar. Una entrega que
choca con uno se rechaza nombrando cuál.

- Acá van la calidad y la forma. Los permisos (publicar, gastar, contactar, producción) están en `AGENTS.md` §3.
- Cada criterio lleva su cita literal (con la ortografía original), la fecha y la fuente. Un criterio nuevo entra por
  PR, igual. Si uno nuevo contradice a otro, se reemplaza el viejo: no conviven dos.
- Fuentes: HP = `hermes-content/docs/handoff/`, SK = `.claude/skills/`, HS = `hermes-content/skills/`, MEM = memoria
  de la PC (la nube no la ve; por eso la cita queda acá).

## Siempre

- **Terminado es funcionando, no commiteado:** lo que se construye está hecho cuando anda de punta a punta en
  producción, encendido y con la latencia medida; lo que está detrás de un flag apagado vale cero. Una entrega que no
  llega hasta ahí (la orquesta no despliega) lo dice y deja listo el paso que falta; un documento no reemplaza a lo que
  se pidió construir. «recordá el nivel de calidad y que sea 100 % funcional y operativo, pensá nivel de latencia, cómo
  se acomoda a la vida real» (3-sep, MEM)
- **Primero lo que el cliente ve y toca**, después lo interno: «coloca y perfecciona tus reglas porque estás
  construyendo cosas inútiles» (10-ago, MEM)
- **Rechaza exhibir obra** en lo que ve un cliente («muy pronto», «beta», «en construcción», listas de lo que falta):
  «hace escapar a los clientes porque hacen creer que el sistema no funciona. Como regla nunca hagas eso.» (20-ago, MEM)
- **Rechaza inventar o agregar lo no pedido:** testimonios, logos, clientes, cifras o capacidades que producción no
  tiene. Cada cifra va con su fuente primaria y su fecha, y «verificado» solo si se corrió el comando entero. «no
  inventes cosas, y el nombre tiene que ser onia.» (26-jul, MEM)
- **Rechaza lo genérico:** si se puede cambiar el rubro, el negocio o el creador y el texto sigue igual, se rehace. Los
  ejemplos inventados (taller de bicicletas, imprenta) le parecieron «vacíos». (28-sep, MEM; 21-sep, `CLAUDE.md`
  §«Publicidad que no parezca hecha por IA»)
- **Rechaza lo que se ve hecho por IA:** plantillas repetidas, logos rotos o inventados. «muy IA lo estás haciendo».
  Ante la duda, menos elementos, todos atados a lo que se dice. (17-sep, MEM)
- **Rechaza la información basura y los pasos de más:** «fuera información basura, y que se vea todo simple y mientras
  menos pasos o páginas mejor». Ante dos soluciones, gana la de menos clics. (1-oct, `CLAUDE.md` §«Simple»)
- **Trae la mejor opción, no la primera ni la más cara:** tres opciones con su costo y la recomendada. «me diste la
  opción más cara, tienes que encontrar siempre la mejor opción» (8-ago, MEM)
- **Lee la consigna literal y busca a fondo** antes de decir que algo no existe: el doc propio, el listado completo y
  las variantes del nombre. «como regla revisa siempre y investiga para que no cometas estos errores» (15-ago, MEM)
- **Rechaza «solo dental»:** son 5 rubros, cada uno con su vocabulario. «recordá que no solo somos para dentistas,
  TENEMOS OTROS RUBROS, quedate claro eso» (29-sep, MEM)
- **Rechaza mezclar Onia Platform con su marca personal y la comunidad:** «aquí es solo marca personal y comunidad, ya
  si querés postear algo de onia platform ya vemos cómo lo hacemos». (30-sep, HP/marca-personal.md)
- **Aprueba el criterio propio:** evaluar el pedido y contradecir con evidencia. Lo que haría además se propone en una
  línea, no se hace. «No siempre
  tienes que cumplir lo que yo te digo, porque alguna idea puede ser mala o puede ser buena» (22-jul, MEM)

## Lo que le llega a él

- **Corto, normal y al grano, sin rótulos:** «que no hablen de esa manera, con pasó, sigue… que hablen normal pero
  resumido y al grano» (20-oct); «me entregas demasiado texto y me pierdo» (8-oct). Primero lo que importa y después
  los pasos que le tocan: «explicas demasiado y no dices que debemos hacer al grano» (13-ago). Unas 5 líneas. (MEM)
- **Capturas literales, de la página real:** «enviame capturas literales, no me digas revisá tal y no sé dónde está o
  cómo se ve, capturas». De una vista previa dibujada a mano dijo «no tiene la tipografía ni los colores de Onia».
  (10-oct, MEM)
- **Las decisiones, a la vista, con opciones y la recomendada:** «cuando me pedís ver las decisiones no las mostrás»
  (17-oct, MEM)
- **Lo técnico no se le consulta:** «si tiene cosas técnicas no me lo digas y aceptalo, porque sabes que no lo
  entiendo, solo hago vibe coding» (17-oct). Lo que se resuelve con herramientas no se le devuelve: «quiero que siempre
  tengas que hacer, no me preguntes a cada rato… ponte en marcha» (3-sep). (MEM)
- **Antes de lanzar o subir algo, qué hace y qué va a notar:** «¿qué vas a lanzar? estás salteando información que
  decirme» (20-oct, MEM); «explicame qué vas a subir y con qué diseño» (8-oct, HP/marca-personal.md).
- **Un PR se nombra por lo que hace, con el enlace:** «cuando me digas PR, hashtag y el número, en lugar de decirme eso,
  me digas de qué estamos hablando, porque eso no lo entiendo» (26-oct, MEM)
- **Lo que tiene que usar, listo para copiar:** «dame el artefacto ordenado», por día y con el texto. (8-oct,
  HP/marca-personal.md)
- **Forma:** en español; comandos en PowerShell; horas en La Paz («arregla tus horas, aqui somos america/la paz»,
  31-ago); el gasto de Higgsfield en créditos, no en bolivianos («Solamente es crédito.», 26-jul). (MEM)

## Marca personal (vos)

- **Guiones:** un ejemplo real de ONIA, con pasos exactos y la premisa probada antes. Rechaza los negocios inventados,
  el mismo tema en varias piezas (el cotizador en 4 de 10) y los avisos a cámara tipo «todavía no ejecutamos la
  prueba». Él solo se graba a cámara; las pantallas las hacen los agentes. (28-sep, MEM; 5 y 8-oct, HP/marca-personal.md)
- **Carruseles que enseñan:** cada pieza trae una noticia (con la fuente oficial del día), una función (con el paso
  para copiar) o una app, no una tesis propia. «los 3 nuevos no enseñan nada interesante, busca cosas interesantes,
  noticias» (17-sep, MEM)
- **Titular concreto y visual que muestre el mecanismo:** «se ve muy simple o coloca el logo de github grande o cosas
  mas visuales, siempre te corrigo lo mismo» (17-sep, MEM). Rechaza la pastilla «ONIA» y el contador «PASO 02/08»
  arriba, los textos cortados y la lámina sin visual de apoyo. (HS/carruseles-onia.md)
- **Logos oficiales, solo cuando se nombra la marca:** «los logos están rotos y no tienen sentido» (17-sep, MEM); de
  uno recreado: «poné la original» (18-sep, SK/editor-videos).
- **Historias que venden:** una secuencia con un solo CTA, no foto + etiqueta + titular. «no me gustan las historias,
  el diseño hay que mejorarlo; recordá que hay estructuras de contenido para vender» (8-oct, HP/marca-personal.md)
- **Imágenes:** foto editorial en blanco y negro con un solo objeto verde (eligió la opción 9 de 9; reemplaza a la
  arcilla), generadas, no de stock: «decía higgsfield, no sé qué es pexels» (29-sep). Rechaza las letras inventadas,
  las formas con cara y las interfaces falsas. (8-oct, MEM)
- **Paleta:** verde ONIA, blanco y negro. Rechaza el crema y el papel tibio: el pack community-editorial le pareció
  «vacío y con demasiado texto». (29-sep, SK/diseno-contenido-onia)
- **Su cara no se genera:** «el de sergio no lo usas, es horrible.» (6-ago, MEM)
- **Miniatura:** el cuadro de su cara se busca entre todo lo grabado: «busca otro frame de mi cara y mejoralo, eso hace
  que no me guste» (8-sep, MEM)
- **Montaje:** «lo que quiero que hagas tal cual son los videos de Eric Taveras y Santiago Munoz» (skill
  `edicion-referentes`). Rechaza la edición básica de corte + karaoke + recuadros: «esa no sigue siendo tu manera de
  editar, porque no lo hacés como antes». Se edita con HyperFrames: «¿y por qué no usás HyperFrames como quedamos?»
  (2-oct, SK/edicion-referentes; 26-jul, MEM)
- **Su video modelo** es «Tu primera automatización» (22-sep): gancho a cámara completa, recuadro chico, pantallas que
  cambian justo en el corte, subtítulos por frase, sin zooms ni efectos de sonido. (2-oct, SK/editor-videos)
- **Sonido:** «elimina ese sonido horrible cada que sale un mockup» (2-oct, SK/editor-videos). Sin música de fondo: la
  pone él. (18-sep, MEM)
- **Subtítulos:** karaoke «apple style, sin bordeado negro», con la palabra activa en verde. (17-sep, SK/editor-videos)
- **Cada video, completo:** «Dejás a medias cada video» (18-sep, MEM). Lo que sale a redes pasa por `editor-videos` y
  el render final va en una sola pasada (recodificar varias veces lo deja blando). (1-oct, SK/editor-videos)

## Pauta, web y venta de Onia (usted)

- **Usted con clientes y prospectos**, en el bot, los mensajes, las plantillas, la web y los anuncios: «no se usa vos,
  es muy informal, usted». (3-oct; la web y los anuncios desde el 19-oct; MEM)
- **Primero la Biblioteca de Anuncios:** «DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA COMPETENCIAS». (2-oct,
  SK/onia-ventas-pauta)
- **La pauta del producto no lleva el estilo de su marca personal:** «es diferente el contenido de la onia platform que
  el de mi cuenta personal». (2-oct, SK/onia-ventas-pauta)
- **Rechaza los anuncios «demasiado básicos»:** una losa de texto sin foco visual. Una pieza muestra el dolor exacto
  del rubro, lo que cuesta, un mecanismo comprobable y un solo CTA, con UI real del producto. (8-oct,
  SK/onia-ventas-pauta; 21-sep, `CLAUDE.md` §«Publicidad que no parezca hecha por IA»)
- **Una web que no vende se rehace entera:** de la anterior dijo «Nada se te escapa no vende nada»; de la aprobada, de
  base clara, «me encanta el diseño». (21-ago, MEM)
- **En la web no van capturas del sistema:** «no coloques capturas literales del sistema, se ve mal, coloca cosas
  referenciales» (1-sep, MEM). En los anuncios, en cambio, sí va UI real: son superficies distintas.
- **Un pedido de diseño sigue vigente hasta verlo en pantalla** (animaciones, tipografía, logo, tarjetas de igual alto).
  (10-ago, MEM). De una animación de 0,4 s dijo «no se ve». (SK/onia-web-factory)
- **Se vende el sistema; el chatbot es un add-on.** Cero autobombo, nada sobre la competencia ni el equipo: «hay
  inconsistencias en la web, datos que no son importantes, habla de nuestras competencias y demás cosas» (3-sep, MEM).
  Onia se presenta como «un sistema con IA». (2-oct, HP/mercado-y-pauta.md)
- **Los agentes se nombran por lo que hacen** («Confirma citas», «Recuerda cobros») y preparan un borrador que alguien
  aprueba: no «avisan» ni «cobran» solos. (1 y 29-sep, MEM)
- **Oferta:** «prefiero un solo pago y listo» (17-sep). La web se mantiene en la oferta: «un negocio con sistema no
  opera sin página web» (8-oct). Los precios salen solo de `subscription-plans.ts` y `pricing.ts`, y se promete solo
  lo que producción cumple hoy (`ONIA_ADQUISICION_Y_PAUTA.md` §5.4). (MEM)
- **Nada para vendedores:** «ya no crees nada sobre vendedores, por el momento no tenemos equipo de ventas» (27-ago, MEM)

## Producto

- **Una pantalla se aprueba mirándola renderizada**, nunca por un 200 o un grep: «no tienes nada listo, tienes errores
  muy básicos» (14-ago, MEM). El login de producción mostraba los nombres de los iconos como texto y lo encontró él.
- **Velocidad y que no se caiga:** «quiero que priorices más que todo lo que es velocidad del sistema y que no vaya
  lento y que no se pueda caer.» (29-sep, MEM)
- **Panel chico y completo:** «la barra lateral más pequeña, resumida, con apartados dentro de apartados, como
  Hostinger». Una sección entra al menú solo cuando su flujo funciona entero: «demasiadas funciones y demasiada
  información, o no están completas ni detalladas» (3-sep). De pantallas con poco contenido y mucho texto: «lo veo
  vacio, mucho texto» (29-sep). (MEM)
- **Toda pantalla rediseñada se captura en al menos dos rubros** (dental y comercio), con su vocabulario. (29-sep,
  `CLAUDE.md` §«Trato y criterio»)

## Comunidad y taller

- **Avisos que se entiendan sin leer el recurso largo:** «no entiendo esas, mejorá lo que decís». (8-oct,
  HP/marca-personal.md)
- La oferta del taller sale de `hermes-content/docs/TALLER_31_OCT.md`: no se inventan precios, cupos ni horarios.

## Investigación

- **La competencia se mira en su web de hoy,** con enlace y fecha: «no quiero que mires guías, guiate mediante la web,
  sus guías son viejas». Sus ideas se evalúan, no se copian: «no significa que sea mejor que la nuestra o que tengas que
  copiarla» (29-sep, MEM)
- **Lo que él manda se analiza entero:** «cuando te envío contenido tenés que analizar el mensaje, el tema, la edición y
  mirar bien el video» (3-oct). Un link sin instrucción es para aprender, no para producir: «no te lo envié para que lo
  desarrolles, simplemente te lo envié para que lo aprendas» (9-oct). (MEM; skill `aprender-de-todo`)
- **Bolivia:** lo fiscal y contable, específico y vigente, con la norma citada: «contabilidad no está nada detallada
  (Bolivia es súper estricta)» (3-sep, MEM)
- **Proveedores:** fabricantes verificados, nunca distribuidores: «siempre vamos a comprar de fábrica, nunca de
  distribuidor, pensá así y mirá dónde debemos ir» (6-ago, MEM)
