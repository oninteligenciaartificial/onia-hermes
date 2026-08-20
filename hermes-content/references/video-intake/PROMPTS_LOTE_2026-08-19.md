# Prompts del lote del 2026-08-19 — H1 a H3, I1 e I2

Dos orígenes distintos:
- **H1–H3** salen del hallazgo de que Higgsfield hace la ingeniería inversa solo, gratis
  ([ficha](2026-08-19-la-herramienta-lee-el-video.md)).
- **I1–I2** salen del reel del portal de onboarding de cliente
  ([spec completa](2026-08-19-portal-cliente-onboarding-spec.md)) — el que Sergio marcó como
  *"es justo cosas que estamos desarrollando"*.

**Antes de pegar cualquiera:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

## Dónde se pega cada uno

| Sesión | Prompt | Orden |
|---|---|---|
| **`onia-plattform`** | **I1** el módulo de onboarding de cliente | **el más importante del lote** — ataca un costo semanal |
| **`web-factory`** | **I2** usarlo primero para nosotros | después de I1 |
| **`pendiente`** | **H1** cablear el análisis por escenas al intake | independiente |
| **`INFLUENCERS IA`** | **H2** el primer `ad_reference` | independiente |
| **`editor de videos`** | **H3** el molde de anuncio de 6 actos | independiente |

---

# ONIA PLATFORM

## I1 · El módulo de onboarding de cliente — dejar de perseguir por WhatsApp

```text
Contexto: un reel muestra un portal de cliente para agencia de software (se llama K100) que
resuelve un costo que nosotros pagamos todas las semanas. Reconstruccion completa, con
entidades, maquina de estados y el analisis de seguridad:
hermes-content/references/video-intake/2026-08-19-portal-cliente-onboarding-spec.md

El problema, verbatim del video: "Perseguir a un cliente para que te mande sus credenciales y
documentos es de las tareas que mas tiempo roba a un equipo... cada una de esas acciones
dispara una notificacion automatica clasificada directamente en su perfil. El equipo asignado
recibe la alerta exacta de que se completo, sin tener que revisar carpetas sueltas ni preguntar
por whatsapp si ya se envio algo."

LA MAQUINA DE ESTADOS, que es lo unico que hay que construir bien:
Todo lo que se le pide al cliente es UN REQUERIMIENTO, sea un documento, una credencial, una
firma o un cuestionario. Todos recorren lo mismo:

  PENDIENTE -> (el cliente entrega) -> ENTREGADO -> (el equipo revisa) -> EN_REVISION
                                                       -> ACEPTADO
                                                       -> RECHAZADO (con motivo) -> PENDIENTE

  Cada transicion escribe un EVENTO y dispara una notificacion al equipo asignado.
  Una FASE se completa SOLA cuando todos sus requerimientos estan ACEPTADO. Nadie marca nada
  a mano. Ese es el ahorro entero.

Cuatro tipos de requerimiento y como se aceptan:
  documento  -> el equipo lo revisa
  respuesta  -> automatico al llegar al 100% del cuestionario
  firma      -> automatico al firmar
  acceso     -> el equipo CONFIRMA que el acceso funciona. Nunca automatico.

PASO 1, ANTES DE ESCRIBIR UNA LINEA -- y puede cambiar toda la tarea:
Verifica contra onia-core/contract.json y el schema si los work items del core ya tienen esta
maquina de estados o una equivalente. Si la tienen, ESTO ES ENCENDER, NO CONSTRUIR, y el
requerimiento es un work item con un tipo nuevo, no una tabla nueva. CLAUDE.md lo dice: "un
rubro nuevo debe salir de ENCENDER capacidades del core, no de escribir codigo nuevo".
Revisa tambien: el asistente /setup, el intake del pack dental, y la cola de aprobacion de los
agentes -- ese ultimo ya es el patron entregado -> en revision -> aceptado.
Deci que encontraste ANTES de proponer nada.

ORDEN DE CONSTRUCCION -- el riesgo va al final, a proposito:
  Fase 1: requerimiento + maquina de estados + subida de documentos + cuestionario con
          AUTOGUARDADO (el del video tarda 45-60 min y se completa en varias sesiones).
          Riesgo bajo. Aca esta el 80% del ahorro.
  Fase 2: evento + notificacion al equipo + la fase que se cierra sola.
  Fase 3: ACCESOS DELEGADOS -- un instructivo por plataforma con checklist de verificacion.
  Fase 4: boveda de credenciales, SOLO si algo no se puede delegar.

Si la fase 4 nunca se construye, el sistema igual sirve. Eso es la senal de que el orden esta bien.

SEGURIDAD -- aca el video hace algo que nosotros NO vamos a copiar:
K100 guarda contrasenas, tokens y API keys de terceros con un boton "Mostrar valor". Un portal
con las credenciales de Google, Meta y Stripe de N clientes vale mas para un atacante que
cualquiera de esos clientes por separado.

  NUESTRA REGLA: ACCESO DELEGADO, NO CREDENCIAL GUARDADA.
  Google Workspace -> que nos agregue como usuario/admin
  Meta Business    -> que nos asigne como socio; el token lo emite Meta a nuestro nombre
  Stripe           -> Stripe Connect o team member de su cuenta
  Hosting/dominio  -> a nombre del cliente (ya es regla en CLAUDE.md) con acceso delegado
  El acceso delegado se revoca de un clic y no nos hace responsables de la contrasena de nadie.

  Si de verdad no hay alternativa (panel viejo sin usuarios multiples, proveedor local sin
  roles): cifrado con la clave FUERA de la base (si la clave vive en la misma base, no esta
  cifrado) · nunca en logs ni en la respuesta por defecto de la API · "mostrar valor" es una
  accion AUDITADA (quien, cuando, cual) y el cliente puede ver ese registro · RLS por cliente
  verificada en la base, no en el front · rotacion al cerrar el proyecto.
  TARJETAS: NUNCA. Ni numero, ni CVV, ni cifrado. Es PCI-DSS y ya es regla.

Y el resto del checklist que aplica igual: subida con tope de tamano y lista blanca de tipos y
extensiones · validacion con Zod en el borde · RLS en todas las tablas nuevas · rate limit en
el endpoint de subida · errores genericos al cliente y detalle solo en el log del servidor.

LISTO = la fase 1 esta ENCENDIDA EN PRODUCCION y verificada ahi: se crea un requerimiento, el
cliente sube algo, el equipo lo acepta, y la fase avanza sola. Con el resultado del paso 1
escrito (que habia en el core y que no). Construido detras de un flag apagado NO cuenta.
```

---

# WEB FACTORY

## I2 · Usarlo primero para nosotros — la lista real de lo que se le pide a un cliente de web

```text
Contexto: se especifico un modulo de onboarding de cliente que reemplaza perseguir por WhatsApp:
hermes-content/references/video-intake/2026-08-19-portal-cliente-onboarding-spec.md
El modulo lo construye la sesion onia-plattform (prompt I1). Esta tarea es la otra mitad: SIN
LA LISTA REAL DE REQUERIMIENTOS, el modulo es una tabla vacia.

Y web-factory es quien mas sufre el problema: cada web de cliente necesita logo, textos, fotos,
acceso al dominio, acceso a las redes -- y hoy todo eso se persigue a mano.

Tarea:
1. Escribi la lista COMPLETA de lo que se le pide a un cliente para una web, sacada de los
   proyectos REALES que ya hicimos, no inventada. Por cada item:
     - tipo: documento / respuesta / firma / acceso
     - en que fase del proyecto se pide (no todo al principio: eso abruma y frena)
     - si bloquea o no bloquea el avance
     - como se verifica que esta bien (un logo en JPG de 200px no sirve, y eso hay que decirlo
       ANTES, no despues)
2. Para los de tipo ACCESO, escribi el instructivo por plataforma: que tiene que hacer el
   cliente, paso a paso, para darnos acceso DELEGADO sin pasarnos su contrasena. Uno por
   plataforma: dominio, hosting, Google Business, Instagram/Meta, y lo que aparezca.
   Este instructivo es lo que reemplaza la boveda de credenciales. Es lo mas valioso de la tarea.
3. Escribi el Cuestionario Maestro de una web: las preguntas que de verdad cambian el resultado.
   Referencia del video: el suyo tarda 45-60 min y se guarda solo entre sesiones.
   REGLA DE CLAUDE.md que esto hace cumplir: "No fabricar. Si falta dato del cliente, no
   inventar -- pedirlo o marcarlo". Este cuestionario ES el mecanismo de pedirlo.
4. Ordena las preguntas por cuanto cambian el diseno. Las que no cambian nada, sacalas.

NO construyas la UI. Esta tarea entrega el CONTENIDO que el modulo va a servir. Si I1 todavia
no corrio, igual sirve: la lista y los instructivos valen solos, y hoy se pueden mandar por
correo mientras tanto.

Cuidado con dos cosas:
- Nunca le digas al cliente que usamos plantillas. Es regla.
- El dominio y el hosting van a nombre del CLIENTE. El instructivo tiene que reforzar eso, no
  pedirle que nos los transfiera.

LISTO = la lista completa con tipo/fase/bloqueante/verificacion, un instructivo de acceso
delegado por plataforma, y el cuestionario ordenado por impacto en el diseno.
```

---

# PENDIENTE

## H1 · Cablear el análisis por escenas al intake de video

```text
Contexto: se descubrio y se MIDIO que video_analysis_create (MCP de Higgsfield, ya conectado)
hace analisis escena por escena de cualquier video, gratis. Prueba completa:
hermes-content/references/video-intake/2026-08-19-la-herramienta-lee-el-video.md
Ejemplo de salida: hermes-content/references/video-intake/analisis/DcMW3Coi6BN-escenas.md

Lo medido: 25 escenas en 55 segundos, creditos 2.567,78 antes y 2.567,78 despues. Cada escena
trae timestamp_start, timestamp_end, shot_type, label de funcion narrativa, descripcion visual
y descripcion del AUDIO. Encontro cinco cosas que la lectura manual de fotogramas se habia
perdido, incluida una secuencia entera de 9 segundos.

Hoy el intake (scripts/video-intake.mjs) hace: fetch -> Gemini -> Whisper -> ficha. NO usa el
analisis por escenas. Se pierde gratis.

Tarea:
1. Agrega el paso: media_upload -> media_confirm -> video_analysis_create -> poll de
   video_analysis_status hasta completed -> guardar las escenas en
   hermes-content/references/video-intake/analisis/<shortcode>-escenas.md, con el mismo formato
   de tabla del ejemplo.
2. El poll tarda 3-5 min. Que NO bloquee: encolar y seguir con Whisper mientras tanto.
3. TOPE POR CORRIDA. Una corrida salio gratis; NO esta probado que cien tambien. Limite
   configurable (arranca en 10) y logueá cuantas se hicieron. Si el balance baja despues de un
   analisis, que corte y avise.
4. Solo para videos de menos de 3 minutos. La propia herramienta advierte: "the longer the
   video, the less accurate the scene-by-scene analysis becomes". Los largos se saltean.

Y tres arreglos del mismo pipeline, del mismo diagnostico:
5. MUESTREO DE FOTOGRAMAS POR TEXTO, no a intervalo fijo. Hoy se saca 1 cuadro cada N segundos
   y por poco se pierde un prompt completo que aparecia en UN solo cuadro. Detecta los cuadros
   con mucho texto (varianza de bordes, o un OCR barato) y muestrea denso ahi.
6. TRAER EL CAPTION DE LOS VIDEOS. Hoy solo se baja para carruseles (ig-carousel.mjs ya lo
   hace). Varios creadores ponen el prompt en el caption y lo estamos tirando. Es gratis.
7. Nota fija al pie de cada .txt: Whisper degrada los terminos tecnicos. Casos medidos:
   "SIDANZ 2.5" = Seedance, "Hitsfield" = Higgsfield, "viesel" = VSL. Ningun termino tecnico
   de la transcripcion se cita sin contrastarlo con la imagen.

LISTO = un video nuevo entra por el pipeline y deja, sin intervencion: el mp4, el verbatim, el
caption, los fotogramas muestreados por densidad de texto, y el archivo de escenas. Con el
contador de analisis logueado.
```

---

# INFLUENCERS IA

## H2 · El primer `ad_reference` — que la herramienta replique el escenario

```text
Contexto: Marketing Studio tiene ad_reference_id, que "follows the analyzed scenario of an
existing reference video (scene composition, pacing, hook, narration) instead of inventing a
structure from the prompt alone". Hoy tenemos CERO referencias creadas (la lista vuelve vacia).

Y ya hay un anuncio analizado escena por escena, con su estructura medida:
hermes-content/references/video-intake/analisis/DcMW3Coi6BN-escenas.md

Su molde, en 6 actos y 46 segundos:
  0:00-0:02  Opening Hook           -- el producto sobre fondo blanco, logos flotando
  0:02-0:12  Product Information    -- la herramienta funcionando, capturas de pantalla
  0:12-0:19  Product Selling Points -- el producto en estudio: revelado, detalles, texturas
  0:19-0:27  Real Experience        -- la persona hablando a camara, 3 beats de dialogo
  0:27-0:36  Usage Scenarios        -- SEGUNDO escenario, el producto EN USO
  0:36-0:46  Real Experience -> CTA -- la prueba social (chat con "delivered") y los logos

Tarea, en este orden:
1. Crea el ad_reference a partir de ese anuncio (show_marketing_studio con type='ad_reference').
   Crear la referencia es GRATIS. Verificá el balance antes y despues y anotá el numero.
2. Prepara la generacion de UNA pieza nuestra con ese escenario: elegi el rubro, el producto y
   el avatar. RECORDA, esta en la doc del propio parametro: avatar y producto NO se heredan de
   la referencia, van explicitos SIEMPRE (avatars / product_ids).
3. ad_reference_id es MUTUAMENTE EXCLUYENTE con hook_id y setting_id. Un camino, nunca los dos.
4. Estima el costo en creditos de esa generacion y PARA. No generes.

GASTO: generar video = permiso explicito de Sergio, caso por caso. La referencia es gratis; el
video no.

Un limite honesto que hay que verificar y no asumir: no esta probado si ad_reference acepta un
video que NO generamos nosotros, ni si hay restriccion por derechos. Averigualo antes de subir
material ajeno; si no queda claro, usá material propio.

LISTO = el ad_reference existe (la lista ya no vuelve vacia), la llamada de generacion esta
escrita con avatar y producto explicitos, el costo estimado al lado, y NO se genero nada.
```

---

# EDITOR DE VIDEOS

## H3 · El molde de anuncio en 6 actos, medido

```text
Contexto: el analisis escena por escena de un anuncio real dio, gratis, una taxonomia de funcion
narrativa que no teniamos. Los labels que devuelve la herramienta:
  Opening Hook · Product Information · Product Selling Points · Real Experience ·
  Usage Scenarios · Call to Action
Ordenados, son el molde completo de una pieza de 46 s. Tiempos medidos en
hermes-content/references/video-intake/analisis/DcMW3Coi6BN-escenas.md

Lo contraintuitivo del reparto, y es lo que hay que respetar:
- el gancho dura DOS segundos
- el producto "bonito" en estudio se lleva 7 s
- la persona hablando a camara se lleva 8 s y trae TRES frases, no un monologo
- hay un SEGUNDO escenario (9 s) que muestra el producto EN USO, distinto del primero
- la prueba social va casi al final, no al principio
- el CTA son 2 segundos y son tres logos

Tarea:
1. Convertilo en plantilla de HyperFrames parametrizable: 6 tramos con su duracion objetivo y
   que va en cada uno. Que se pueda cambiar el reparto de segundos sin rehacer nada.
2. Los tramos que NO necesitan generacion (Opening Hook con el producto sobre fondo blanco,
   Product Information con capturas de pantalla, el CTA de logos) se arman con HyperFrames a
   costo cero. Dejalos resueltos.
3. Render de prueba con material que YA tengamos, aunque los tramos de video queden como
   placeholder. La idea es ver el RITMO.
4. NO reinventes el motor: revisá .claude/skills/ (talking-head-recut, embedded-captions,
   captions-overlay, media-use) y usá lo que existe.

Dos gates que no se saltean:
- La REGLA DE ORO: tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte.
- El gate de ortografia en subtitulos quemados: el SRT se revisa a ojo antes de quemarlo, con
  foco en enyes y acentos. En el corpus hubo un reel con DOS faltas quemadas en 10 fotogramas.

LISTO = plantilla de 6 tramos parametrizable, con los tramos de costo cero ya resueltos y un
render de prueba que deje ver el ritmo.
```
