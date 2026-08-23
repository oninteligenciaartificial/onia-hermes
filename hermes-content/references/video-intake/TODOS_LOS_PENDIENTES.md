# TODOS LOS PROMPTS PENDIENTES — 25, listos para pegar

Foto del 2026-08-20. Son los que **no tienen evidencia de haberse ejecutado**, más los
bloqueados y los tres nuevos (J5, J6, K1). Los 23 ya ejecutados y los 12 parciales no están acá:
el estado completo está en [ESTADO_DE_LOS_PROMPTS.md](ESTADO_DE_LOS_PROMPTS.md).

**Cada prompt es autocontenido.** Se copia el bloque de texto y se pega en la sesión que dice.
Antes de pegar, los tres gates del preámbulo de [PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

> ⚠️ Este worktree estaba **494 commits** atrás de `main` y se sincronizó el 20-ago. **Antes de
> ejecutar cualquiera, verificá contra `origin/main`, no contra el checkout local** — varios
> prompts dan por faltante algo que ya existe en `main`.

## Si hay que elegir el orden

1. **F1** (`pendiente`) — auditar los agentes que ya existen. Antes de construir más, ver cuáles sobran.
2. **I1** (`onia-plattform`) — el onboarding de cliente: deja de perseguirse documentos por WhatsApp.
3. **G3** (`marketing`) — la prueba de venta que ningún demo consigue. ⛔ falta un cliente real.
4. **C4** (CRM) — la ruta al primer cliente. ⛔ bloqueado por lo mismo.
5. **H1** (`pendiente`) — cablear el análisis por escenas al intake. Gratis y mejora todo el carril.
6. **J5** (`web-factory`) — interiores: servicio vendible, y el insumo es lo que el cliente ya tiene.

## Los tres bloqueados esperan lo mismo

**G3, C4 y E11** esperan **un cliente real usando el sistema**. No se pueden simular sin fabricar,
y fabricar está prohibido. No se fuerzan.

## Lo que gasta

| Prompt | Qué gasta |
|---|---|
| **E5** Strix | consumo de LLM, necesita API key propia |
| **H2** `ad_reference` | crear la referencia es gratis; **generar cuesta** |
| **J5** interiores | imagen: barato y permitido |
| **G3** video_edit | créditos, **se factura por la duración del video FUENTE** |
| **D2** búsqueda de marca | Bs 75 |

Todos entregan guion/prompt/costo y **paran** hasta tu OK.

---

# Sesión `onia-plattform`

Archivo completo de la sesión: [sesiones/onia-plattform.md](sesiones/onia-plattform.md)

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

---

## E1 · El molde de un rubro completo — checklist, no features sueltas

```text
Contexto: un reel mostró una app de nutrición construida con Claude Fable 5 que, en 78
segundos, recorre un producto entero. Ficha con el verbatim y la evidencia visual:
hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md

Lo valioso no son sus features: es que los 7 pasos son el esqueleto de CUALQUIER vertical
profesional-cliente, y CLAUDE.md ya dice que un rubro nuevo debe salir de ENCENDER
capacidades del core, no de escribir codigo nuevo.

El esqueleto:
1. el profesional define un PLAN y se lo asigna al cliente
2. el cliente entra con auth propia y ve su plan completo
3. el cliente REGISTRA su cumplimiento (incluida una foto)
4. la IA estima a partir de ese registro y EL HUMANO CONFIRMA O CORRIGE
5. del plan salen ARTEFACTOS derivados (una lista, un presupuesto, una orden)
6. hay un chat con el contexto de ese cliente YA CARGADO
7. lo delicado ESCALA al profesional humano

Tarea:
1. Verifica contra onia-core/contract.json y el schema cuales de los 7 pasos ya tienen
   entidad y capability, y cuales NO. Contra el archivo, no contra la memoria.
2. Para los que faltan, deci si falta la capacidad en el core o solo falta ENCENDERLA en
   el producto. Esa distincion es el punto entero.
3. Escribi el checklist de completitud de rubro en el lugar donde ya viven los docs del
   core (onia-core/*.md). Si ya existe un doc que cubre esto, EDITALO; no crees otro.
4. Aplica el checklist a los rubros ya vendibles en produccion y deci, por rubro, cuantos
   de los 7 estan encendidos HOY en prod.

NO implementes nada todavia. Esto es diagnostico.

LISTO = el checklist existe en onia-core/, y hay una tabla rubro x 7 pasos con el estado
real verificado en produccion, no en el codigo.
```

---

---

## E3 · Las 9 features que un negocio de comida ya da por sentadas

```text
Contexto: dos competidores directos de comandas/pedidos, uno argentino y uno brasilero,
analizados desde sus reels. Ficha con la evidencia visual (URL del panel, tarjeta de
pedido, editor de menu):
hermes-content/references/video-intake/2026-08-16-comandas-competidores.md

Las 9 features que ambos tratan como normales:
1. tablero por estados arrastrable, en vivo
2. ticket con cliente + telefono + direccion + MAPA embebido
3. metodo de pago visible en la tarjeta
4. impresion de comanda en impresora termica (uno tiene pareo Bluetooth en la UI)
5. estados que llegan hasta ENTREGADO, con reloj de minutos
6. metricas del dia al pie: total de pedidos, recaudacion, ticket promedio
7. editor de menu con STOCK y toggle VISIBLE por producto
8. canal separado: salon/mostrador vs delivery
9. suscripcion con niveles (badges PRO en el menu)

Tarea:
1. Verifica cual de las 9 existe hoy en el modulo de comercio/gastronomia de la
   plataforma, EN PRODUCCION. Abri la pantalla; un grep no alcanza.
2. Clasifica cada faltante en: (a) el core ya lo cubre y falta encenderlo, (b) hay que
   construirlo, (c) no lo queremos y por que.
3. Para las (b), ordenalas por cuanto pesan en una demo de 20 segundos a un dueno de
   local. La 4 (impresora) y la 6 (metricas) son las que el dueno pide primero: si no
   coincidis, decilo con el motivo.
4. Deja el resultado en el doc del modulo que ya exista. No crees carpeta nueva sin
   buscar antes donde vive.

Contexto competitivo para no perder el foco: ellos son UNA app de UN rubro; nosotros somos
plataforma con facturacion fiscal boliviana. El foso es lo fiscal de cara al 1-oct-2026,
no el tablero kanban. No gastes el tiempo en empatar features que no mueven la venta.

LISTO = tabla de 9 filas con estado verificado en prod, clasificacion y orden, guardada en
el doc del modulo.
```

---

---

---

## F2 · Evals para el agente que mas corre — medir antes de opinar

```text
Contexto: el mismo taller de Anthropic no mejoro el agente a ojo: lo midio. Ficha:
hermes-content/references/video-intake/2026-08-17-code-with-claude-stockpilot.md

Su montaje: 12 tareas de eval con 5 tipos de grader (desde "exact match" hasta graders que
comparan contra una referencia). Cada ciclo de mejora se corre contra la misma suite, y el
resultado se lee en una tabla antes/despues con tokens, costo, tiempo, turnos y PASS/FAIL.
Sin eso, "quedo mejor" es una opinion.

Nosotros tenemos agentes corriendo en produccion por cron y NUNCA los medimos.

Tarea:
1. Elegí UN agente: el que mas corre o el que mas cuesta. Justifica cual y por que.
2. Escribi 8 a 12 tareas de eval reales -- casos que ese agente ya enfrenta en produccion,
   no inventados. Sacalos de corridas reales si hay registro.
3. Para cada tarea defini el grader: como se decide si paso. Empeza por los baratos
   (coincidencia exacta, presencia de un campo, forma del JSON) antes de meter un grader
   que use el modelo.
4. Corre la baseline y guarda la tabla: PASS/FAIL, tokens, costo, tiempo, turnos.
5. Deja la suite corrible con un comando y documentado donde ya viven los docs de agentes.
   No crees carpeta nueva sin buscar antes donde vive.

Gasto: correr la suite consume tokens. Estima el costo de UNA corrida antes de correrla y
decilo. Si supera lo trivial, presentaselo a Sergio antes.

No inventes numeros de baseline. Si no llegaste a correrla, la entrega es la suite escrita
y el costo estimado -- y se dice que la baseline quedo sin correr.

LISTO = suite de 8-12 tareas con graders, corrible con un comando, y la tabla de baseline
real o la razon explicita de por que no se corrio.
```

---

---

# Sesión `web-factory`

Archivo completo de la sesión: [sesiones/web-factory.md](sesiones/web-factory.md)

## J5 · Interiores con Nano Banana — cuatro recetas image-to-image

```text
Contexto: un carrusel regala CUATRO recetas image-to-image de diseno de interiores, con los
prompts literales. Ficha y datos:
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md
hermes-content/references/video-intake/analisis/2026-08-20-items.json (item DcEYP7tjsIA)

LOS CUATRO PROMPTS, literales de las laminas:
  1. clay/wireframe 3D -> foto fotorrealista del MISMO encuadre:
     "show me the AD magazine photography version of image 1."
  2. cambiar TODO el mobiliario contra un moodboard:
     "in image 1, swap all furniture with the furniture shown in image 2"
  3. moodboard de productos -> escena amueblada desde cero:
     "In a minimalist dark wooden living room, add all products and furniture shown on image 1.
      Add also other objects to make the space feels alive."
  4. plano 2D de linea -> render cenital tipo casa de munecas: mismo prompt que el 3, cambiando
     la descripcion del ambiente.

LOS CUATRO MECANISMOS — esto es el conocimiento, no los prompts:
  a. El catalogo de muebles va como UNA SOLA IMAGEN-COLLAGE, no como N referencias sueltas.
  b. El prompt direcciona POR INDICE ("image 1", "image 2"), asi que EL ORDEN DE CARGA de las
     referencias es parte del prompt. Cambiar el orden cambia el resultado.
  c. ENCADENA: la salida de un paso es la "image 1" del siguiente. Asi conserva la arquitectura
     (paneles, cuadro, curva del cielorraso) mientras reemplaza todo el mobiliario.
     LA CONSISTENCIA NO LA SOSTIENE EL TEXTO NI EL SEED: LA SOSTIENE LA REFERENCIA.
  d. El texto es CORTO y SIN JERGA FOTOGRAFICA: ni lente, ni f-stop, ni esquema de luz. La
     instruccion de estilo entera es un nombre propio -- "the AD magazine photography version".
     Delega el estilo en una referencia cultural que el modelo ya tiene, en vez de describirla.

  OJO, TENSION A PROPOSITO con el prompt G6 (plantilla de foto realista de 8 bloques largos con
  negative prompt): las dos sirven, para cosas distintas. Bloques largos = generar desde cero.
  Referencia nombrada + frase corta = EDITAR sobre algo que ya existe. No las mezcles.

VERIFICADO EN LA CUENTA el 2026-08-20 (volve a consultarlo vos: una verificacion tiene fecha de
vencimiento): existen nano_banana, nano_banana_pro, nano_banana_2, nano_banana_2_lite y
nano_banana_2_shots, todos de Google, con rol image_references SIN tope declarado de cantidad --
que es exactamente lo que estos prompts necesitan para direccionar "image 1" e "image 2".
nano_banana_2 y nano_banana_pro dan 1k/2k/4k. Alternativa para el swap: seedream_v5_pro tiene
flag is_inpaint.

POR QUE ESTO ES DE WEB-FACTORY Y NO DE INFLUENCERS: es un SERVICIO VENDIBLE a un rubro que
existe en Bolivia -- inmobiliaria, estudio de arquitectura, muebleria. Y el insumo es lo que el
cliente YA TIENE: un plano, una foto del ambiente vacio, un catalogo de productos. No hace falta
sesion de fotos ni render 3D pago.

Tarea:
1. Escribi la receta de las 4 transformaciones como doc reusable, donde ya vivan las recetas de
   imagen. Busca primero; no crees carpeta nueva.
2. Anota los 4 mecanismos como REGLAS, no como datos sueltos. El (b) y el (c) son los que nadie
   escribe y los que hacen la diferencia.
3. Preparalo como oferta: que le pedimos al cliente (plano / foto / catalogo), que le devolvemos,
   y en cuantas pasadas. Sin precio -- eso lo decide Sergio.
4. Verifica vos el catalogo antes de prometer nada, y anota la fecha de tu verificacion.

GASTO: generar imagen esta permitido y es barato. Aun asi, si vas a hacer una tanda de prueba,
avisa el costo estimado antes. unlim.available devolvio false, o sea cada generacion sale de
creditos.

LISTO = la receta de 4 transformaciones escrita con sus 4 mecanismos como reglas, el catalogo
re-verificado por vos con fecha, y la oferta descrita en terminos de que pide y que entrega.
```

---

---

## G5 · Secuencia de scroll con GSAP — el patrón de Apple

```text
Contexto: un tutorial en espanol recrea la animacion de scroll de los AirPods Pro de Apple y
muestra el CODIGO literal en pantalla. Ficha y verbatim:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md
hermes-content/references/video-intake/transcripciones/Instagram-Db8hFCFFTZg.txt

La tecnica: NO es un video. Es una secuencia de PNGs dibujada en un <canvas>, con el numero
de frame atado al scroll por GSAP ScrollTrigger. Parametros que se ven en pantalla:
  snap: "frame"   ease: "none"   scrub: 0.5   onUpdate: render

Verificado en el repo: GSAP ya esta autorizado y las skills gsap-* estan instaladas. El
patron NO existe todavia (grep de drawImage da 0).

EL BLOQUEANTE REAL ES EL PESO, no el codigo: ~69 KB por frame. Una secuencia de 150 frames
son ~10 MB, y el presupuesto de una landing es 150 KB de JS. Si no resolves esto, no lo
construyas.

Tarea:
1. Antes de codear, resolve el peso. Opciones a evaluar con numeros, no a ojo: menos frames
   con interpolacion, WebP/AVIF en vez de PNG, resolucion menor con escalado en canvas,
   carga progresiva por tramos, y un tope duro de peso total.
2. Recien con el numero decidido, arma el bloque reusable de web-factory. Carga las skills
   gsap-scrolltrigger y gsap-core primero -- no improvises la API.
3. prefers-reduced-motion: sin scrub, se muestra un frame fijo. Obligatorio.
4. Medi Core Web Vitals antes y despues. Si empeora LCP o CLS, no entra.

Esto es un TECHO visual, no una prioridad de venta. Si hay algo de la lista de web-factory
que convierta (G4, C1), va primero. Deci explicitamente que dejaste de lado por hacer esto.

LISTO = el bloque existe con el peso resuelto y medido, reduced-motion cubierto, y CWV que no
empeoran. O la decision escrita de NO hacerlo, con el numero que la justifica.
```

---

---

# Sesión `marketing`

Archivo completo de la sesión: [sesiones/marketing.md](sesiones/marketing.md)

## G3 · El cliente real con la pantalla sustituida — la prueba que ningún demo consigue ⛔ **BLOQUEADO**

```text
Contexto: un reel sustituyo un auto barato por un deportivo DENTRO del mismo plano filmado
con celular, conservando a la persona real, su ropa, sus gestos, el fondo, la luz y el
movimiento de camara. Sintesis tecnica:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md (tecnica T1)

Por que importa mas que cualquier otra cosa del lote: la tecnica elimina el problema mas caro
de la IA de video -- sostener una cara entre planos -- simplemente NO GENERANDO al humano. Y
eso, traducido a lo nuestro, es el antes/despues de software EN UN SOLO PLANO:

  filmamos al cliente real en su negocio real, con su realidad de HOY (el mostrador con
  papeles, el cuaderno, la planilla impresa, la pantalla vieja) y sustituimos SOLO la
  pantalla / el escritorio por el panel de ONIA corriendo.

Mismo dueno, mismo local, misma luz, mismo movimiento de camara. La comparacion es
irrefutable porque no hay nada actuado. Para venderle software a un dueno de negocio en
Bolivia, eso pega mas fuerte que cualquier demo grabada.

VERIFICADO contra la cuenta (no lo repitas, usalo):
- seedance_2_5, modo video_edit: "edit one reference video (billed by that video's duration;
  'duration' and 'aspect_ratio' are ignored)". 480p/720p/1080p, 9:16.
- El creador afirma, verbatim: "Ya no hace falta que tengamos el celular en un tripode, lo
  podemos agarrar con la mano y moverlo naturalmente y la camara entiende como se esta
  moviendo." Eso es AFIRMADO, no verificado por nosotros. Probalo antes de prometerlo.
- CUIDADO DE GASTO: video_edit se factura por la duracion del video FUENTE. Filma plantillas
  CORTAS (5-8 s) y monta despues. Un plano de 30 s cuesta 4 veces uno de 8.

Y la segunda mitad, que es montaje puro y cuesta cero: el BARRIDO SPLIT-SCREEN vertical.
Izquierda la situacion real del cliente, derecha el mismo plano con ONIA, con la misma mano
del que filma visible en las dos mitades. Sale con editor-videos / HyperFrames. Sirve igual
para web-factory: la web vieja del cliente y la nueva, en el mismo plano.
El truco de oficio en toda comparacion de un solo cuadro: la jerarquia, no el copy. El
ganador va mas grande y mas arriba; el perdedor achicado y hundido. El ojo decide antes de leer.

Tarea:
1. Escribi el guion de rodaje: que 3 planos se le piden al cliente (5-8 s cada uno), en que
   orden, y que se sustituye en cada uno. Sin jerga: el cliente filma con su celular.
2. Deja el prompt de video_edit escrito y listo para cada plano.
3. Deja la plantilla del barrido split-screen armada en HyperFrames, con un render de prueba
   hecho con material que YA tengamos.
4. Estima el costo en creditos de los 3 planos y ponelo al lado.

NO GENERES NADA. Generar video = permiso explicito de Sergio, caso por caso. Entrega el
guion, los prompts y el costo; el aprueba.

PRECONDICION HONESTA: necesita un cliente real con el sistema andando. Si hoy no lo hay,
marcalo como bloqueado por eso y NO lo simules -- fabricar un caso esta prohibido.

LISTO = guion + prompts + plantilla split-screen con render de prueba + costo estimado. Cero
generaciones pagas.
```

---

---

## E11 · La demo en una toma, con el cliente usándolo ⛔ **BLOQUEADO**

```text
Contexto: un reel de hardware hace la mejor demo del corpus con cero produccion. Ficha:
hermes-content/references/video-intake/2026-08-16-descartados-y-formato.md (seccion 2)

El formato: una sola toma, camara en mano, sin cortes ni musica. Alguien pregunta fuera de
cuadro "que es esto?" y a partir de ahi es puro HACER. Nunca dice "es rapido de armar": lo
arma en camara. Y al final contesta la objecion real con el gesto -- "lo mejor es lo rapido
que se arma, pero mejor todavia, lo rapido que se desarma" -- y lo desarma.

Traduccion para nosotros: se filma en el local de un cliente. Alguien pregunta, y EL DUENO
usa el sistema: entra un pedido, mueve la tarjeta, imprime la comanda. Nada de pantalla
grabada con voz en off. La credibilidad viene de que el que lo usa no somos nosotros.

Tarea:
1. Dejá el guion de preguntas listo (3 o 4, no mas) y la lista de acciones que el dueno
   tiene que hacer en camara, en orden.
2. Anotá cual es la objecion real del rubro y con que GESTO se contesta, no con que frase.
3. Guardalo en el plan de contenido como pieza PREPARADA Y EN ESPERA.

PRECONDICION HONESTA: necesita un cliente real usando el sistema. Hoy no lo hay. Esta pieza
NO se puede simular sin fabricar un caso, y fabricar esta prohibido. Queda lista para el dia
que exista el primer cliente; no se fuerza antes.

LISTO = guion guardado y marcado como bloqueado por "primer cliente real", con la condicion
de desbloqueo escrita.
```

---

---

---

## E7 · La demo de 17 segundos que vende un rubro

```text
Contexto: un competidor de comandas vende su producto entero en 17 segundos. Ficha con la
transcripcion y la evidencia de pantalla:
hermes-content/references/video-intake/2026-08-16-comandas-competidores.md

La estructura, cronometrada: promesa en el primer segundo ("Asi de simple podes organizar
todas las comandas de tu negocio") -> entra un pedido y se ve la tarjeta completa -> se
arrastra la tarjeta y cambia de estado -> el beneficio en una linea ("menos caos, pedidos
mucho mas organizados") -> CTA a la web. Nada mas. No hay logo animado, no hay musica epica,
no hay "hola que tal".

Un detalle que copiamos sin costo: las fotos del catalogo de demo son generadas con IA (hay
hamburguesas de pan azul y rosado). No hace falta sesion de fotos para que el catalogo se
vea profesional. Imagen generada = permitido y gratis; video generado NO.

Tarea:
1. Escribi el guion de 17 segundos para el modulo de comercio/gastronomia de ONIA con esa
   misma estructura, cronometrado segundo a segundo.
2. Prepará los datos de demo: catalogo con fotos generadas, un pedido de ejemplo con
   direccion boliviana real de una zona conocida, y precios en bolivianos.
3. NO inventes metricas, ni clientes, ni testimonios. La demo muestra el producto
   funcionando; no afirma resultados que no tenemos.
4. NO digas nunca al cliente que usamos plantillas.

Precondicion: hace falta que el modulo tenga las pantallas que el guion muestra. Si el
prompt E3 (en onia-plattform) todavia no corrio, el guion se escribe igual pero se marca
que pantallas faltan.

LISTO = guion cronometrado + datos de demo listos + lista explicita de las pantallas que
faltan para poder grabarlo.
```

---

---

# Sesión `influencers-ia`

Archivo completo de la sesión: [sesiones/influencers-ia.md](sesiones/influencers-ia.md)

## A4 · Estructura de escenas para video IA — preparar, no generar

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: escribir UN guion con la estructura de escenas que encontramos, SIN generar nada.
Formato (de 2026-08-11-seedance-prompt-por-escenas-timestamps.md, sale de una sola foto):
    Scene N — <nombre> (Xs-Ys)
    <encuadre y angulo> · <camara> · <que queda en foco y que sale> · <luz>
Es lo que le falta a nuestras piezas: hoy se genera plano por plano y la consistencia entre
tomas se rompe. Aca la continuidad esta escrita en el prompt.
LISTO = un guion de 15-20 s por escenas con sus rangos de tiempo, listo para aprobar.
NO HAGAS: NO generes video — eso es credito y va con OK explicito de Sergio caso por caso.
Antes de proponer generar, verifica que Seedance 2.5 este en la cuenta y a cuanto sale la
generacion (consultar el catalogo es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el auto.
```

---

---

## E6 · Qué dispara la etiqueta de "contenido IA" — leer el código, no el reel

```text
Contexto: X abrio su algoritmo. VERIFICADO con fuente, no con el reel: el repo es
github.com/xai-org/x-algorithm, Apache 2.0, publicado el 20-ene-2026, con un directorio
visibility-filtering; y el 13-ago-2026 se le agregaron los pesos con que se combinan las
acciones predichas en el score final. Ficha con el analisis y las trampas del video:
hermes-content/references/video-intake/2026-08-16-x-algoritmo-publico.md

Lo que NO hay que hacer: creerle a la tarjeta de codigo que muestra el reel. Esta dibujada
(comentarios en espanol, no es una captura de GitHub). Los numeros que da -- retweet +1,
reporte -200, link copiado = 40 likes -- son AFIRMADOS, sin fuente.

Lo que SI importa para nosotros, y no es "como hacerse viral":
Lucia es una influencer IA DECLARADA. Si una red grande esta etiquetando y sancionando
contenido generado con IA a nivel de CUENTA ENTERA -- no del post -- eso pega de lleno en
toda nuestra produccion generativa. Y esas senales tienden a copiarse entre plataformas.

Tarea:
1. Leé visibility-filtering en el repo publico y contesta con evidencia: existe una
   etiqueta de contenido generado con IA, que la dispara, y que efecto tiene (alcance
   reducido, invisible para no-seguidores, cuenta entera o solo el post).
2. Cita archivo y linea de cada afirmacion. Si algo no esta en el codigo, deci que no esta;
   no rellenes con lo que dice el reel.
3. Contrasta con las politicas publicadas de Instagram y TikTok sobre contenido generado
   con IA y su etiquetado obligatorio.
4. Concluí en una tabla: que practica nuestra es segura, cual es riesgosa, y que cambiamos.

Regla que NO cambia: la etiqueta de IA en el contenido de Lucia se mantiene. No la sacamos
para esquivar un filtro; eso es exactamente el fraude que descartamos en otros videos.

LISTO = tabla de practicas con archivo:linea del repo como respaldo, y la lista de cambios
concretos a como publicamos.
```

---

---

---

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

---

## J6 · La biblioteca de encuadres — nueve angulos con su uso comercial

```text
Contexto: un carrusel muestra NUEVE angulos de camara sostenidos sobre la MISMA modelo, y cada
uno viene emparejado con su USO COMERCIAL. Los prompts estan detras del cebo, pero la taxonomia
esta entera en las laminas -- y la taxonomia es la mitad que casi nadie escribe.

LOS NUEVE PARES angulo -> uso, leidos de las laminas:
  low angle         -> poder / lujo    (contrapicado desde escalon inferior, lineas de
                                        arquitectura convergiendo)
  high angle        -> lifestyle       (picado 45 grados sobre mesa, sujeto mirando desde abajo)
  over-the-shoulder -> narrativa       (sujeto de espaldas 3/4, la MESA es la protagonista)
  extreme close-up  -> belleza         (media cara, poro y textura visibles)
  eye-level         -> editorial       (simetria frontal, fondo neutro)
  dutch             -> streetwear      (horizonte inclinado ~15 grados, neon mojado)
  wide              -> campana         (figura entera chica dentro de un interior grande)
  side profile      -> perfume         (perfil puro 90 grados sobre color plano saturado)
  bird's-eye        -> editorial       (cenital cerrado, la clavicula abre el encuadre)

DOS OBSERVACIONES QUE VALEN MAS QUE LA LISTA:
1. El EXTREME CLOSE-UP es la toma que DELATA al generador. Si vas a usarla, es donde mas hay que
   mirar el resultado antes de publicar.
2. La consistencia de cara SE SOSTIENE EN LAS TOMAS DE ESTUDIO Y SE DEGRADA EN LAS DE ESCENARIO.
   En las de fondo neutro la cara aguanta; en la escalera y en la calle la estructura del rostro
   y la edad aparente se corren. Regla: CUANDO LA ESCENA MANDA MAS QUE LA REFERENCIA, LA CARA SE
   PIERDE. Para Lucia, priorizar fondos simples cuando la cara tiene que ser reconocible.

METODO DEL CARRUSEL, que tambien se copia: la lamina 2 fija el CANON (retrato frontal, fondo
blanco liso, blazer negro) y recien despues vienen las variaciones. La referencia primero, las
derivadas despues.

Tarea:
1. Escribi la biblioteca de encuadres: los 9, cada uno como un FRAGMENTO DE TEXTO fijo listo para
   concatenar al prompt base de Lucia, con su caso de uso al lado. Guardala donde ya vivan las
   recetas -- candidata: junto al molde de 11 bloques que ya esta en LUCIA.md. NO crees carpeta
   nueva y NO armes un doc al lado del que manda.
2. Anota las dos observaciones de arriba como reglas, sobre todo la de escena vs referencia.
3. Marca cuales de los 9 NO convienen para Lucia y por que.

OJO, ANTES DE ESCRIBIR: el archivo que manda sobre Lucia es
hermes-content/references/modelos/lucia/LUCIA.md y su §6 ya tiene un molde de 11 bloques con 4
colas de camara (R1 Feed / R2 Copy-space / R3 UGC / R4 Beauty). Los 9 encuadres se suman a ESO,
no lo reemplazan. Si algo choca, gana LUCIA.md.

Consistencia de cara: el unico metodo verificado sigue siendo el ancla + Element. Nada de este
lote lo reemplaza.

GASTO: no generes. La biblioteca es texto y sale gratis. La tanda de prueba con la cara de Lucia
necesita OK explicito de Sergio, caso por caso.

LISTO = los 9 encuadres escritos como fragmentos concatenables con su uso comercial, sumados al
molde que ya existe en LUCIA.md, las dos reglas anotadas, y la lista de cuales no van para Lucia.
```

---

---

# Sesión `editor-de-videos`

Archivo completo de la sesión: [sesiones/editor-de-videos.md](sesiones/editor-de-videos.md)

## E10 · El formato gemelo — comparación sin decir una palabra

```text
Contexto: un reel de 14 segundos compara dos formas de trabajar sin una sola palabra
hablada, y no usa IA. Ficha:
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md (seccion 3)

Como esta hecho: camara fija en tripode, DOS TOMAS de la misma persona en el mismo sillon,
mascara vertical al medio en el montaje. Izquierda frustrado, derecha tranquilo. Encima,
texto en tres niveles: los dos titulos, la situacion en el medio ("Cliente nuevo:"), y el
resultado de cada lado -- rojo a la izquierda, verde a la derecha.

Por que importa: se entiende con el sonido apagado, que es como se ve la mayoria de los
reels. Y el tema es literalmente nuestro argumento: rehacer todo por cliente vs duplicar y
personalizar. O sea ONIA Platform con modulos contra el desarrollo a medida.

Tarea:
1. Armá la plantilla de composicion gemela: dos clips de la misma toma fija, mascara
   vertical, y las tres capas de texto parametrizadas (titulo izq/der, situacion, resultado
   izq en rojo / der en verde).
2. Documentá el procedimiento de grabacion en una linea, porque de eso depende que funcione:
   tripode que NO se mueve entre tomas, misma luz, mismo encuadre.
3. Dejá un render de prueba con material que ya tengamos.

Costo: cero. Sin generacion, sin creditos.

LISTO = plantilla parametrizada + render de prueba + las tres lineas de como grabarlo.
```

---

---

---

## E8 · El formato slate/cara, como plantilla de HyperFrames

```text
Contexto: el reel del algoritmo de X usa la composicion mas eficiente que vimos para
explicar algo con numeros, y cuesta cero. Ficha con el detalle visual:
hermes-content/references/video-intake/2026-08-16-x-algoritmo-publico.md

La composicion, verificada en fotogramas:
- Pantalla partida ~40/60: arriba el slate, abajo la cabeza parlante.
- Slate: fondo crema plano, tarjetas minimalistas con UN glifo grande y una etiqueta chica
  debajo en mayusculas espaciadas ("↻ +1 / RETWEET" contra "🚩 / UN REPORTE"), esquinas
  redondeadas, sombra suave.
- Titular en naranja de peso alto sobre el slate, para el numero que importa.
- Abajo: cabeza parlante con subtitulos karaoke, y LA PALABRA CLAVE RESALTADA EN EL MISMO
  NARANJA del titular. El color ata el slate con lo que se esta diciendo en ese segundo.
  Ese es el truco: no es decoracion, es sincronizacion.

Tarea:
1. Armá esto como plantilla reusable de HyperFrames (HTML -> MP4): los slates se renderizan
   y se componen sobre el video de la cabeza. Los subtitulos karaoke ya los hace
   embedded-captions; el resaltado en color debe poder marcarse por palabra.
2. NO reinventes el motor. Revisá primero .claude/skills/ (talking-head-recut,
   embedded-captions, captions-overlay, media-use) -- las mismas viven tambien en
   .agents/skills/ -- y usá lo que ya existe.
3. Parametros minimos de la plantilla: proporcion del corte, color de acento, y una lista de
   slates con {glifo, etiqueta, titular, segundo de entrada}.
4. Probala con 3 slates de ejemplo y dejá el MP4 de prueba.

REGLA DE ORO: la tabla de cortes y el preview 360p se le muestran a Sergio ANTES de aplicar
nada. Nunca cortar a ciegas.

LISTO = plantilla en el repo, MP4 de prueba de 3 slates renderizado y visto, documentada
donde ya viven las plantillas del editor.
```

---

---

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

---

---

## K1 · Radar de ganchos — herramienta INTERNA, decidido por Sergio el 2026-08-20

```text
Contexto: un reel muestra un panel de marca personal con un modulo "Radar Viral" que rastrea
ganchos que estan funcionando y los sugiere. Ficha y datos:
hermes-content/references/video-intake/2026-08-20-sintesis-lote-13.md (item DcKABGBRkdY)

DECISION DE SERGIO, ya tomada, no la vuelvas a abrir: ES UNA HERRAMIENTA INTERNA DEL CARRIL DE
CONTENIDO. NO es un modulo de ONIA Platform, no va al core, no se le vende a nadie. Eso simplifica
todo: no necesita entidad en el core, ni RLS multi-tenant, ni pantalla de producto.

LO PRIMERO, Y ES UNA ADVERTENCIA SOBRE LA FUENTE: el video afirma "5 veces mas alcance" y su
PROPIA CAPTURA lo contradice — muestra 43 mil vistas en el titulo descriptivo contra 11,2 mil en
el titulo con el gancho copiado, o sea 3,8x MENOS, con un asterisco "2 dias despues" sin fechas
ni linea de base. NO REPITAS ESA CIFRA NI NINGUNA PARECIDA. Copiar un gancho no multiplica nada
por si solo; lo unico que sabemos es que el gancho es UNA de las variables.

QUE TIENE QUE HACER, en su version mas chica que sirva:
1. Juntar ganchos que ya funcionaron, de fuentes que YA TENEMOS y son gratis:
   - los reels que Sergio manda (ya estan analizados: hermes-content/references/video-intake/)
   - nuestras propias publicaciones y sus numeros reales
   - la biblioteca de anuncios de Meta, que es publica y gratis (ver prompt D4)
2. Guardar por gancho: el texto literal, el formato en el que aparecio, la fecha, y la fuente.
   NADA de metricas ajenas sin fuente verificable. Si no podes verificar el numero, no lo guardes:
   guarda el gancho igual, sin numero.
3. Poder buscarlo por tema y por formato cuando toca escribir una pieza.

QUE NO HAGAS:
- NO construyas un panel. Un archivo estructurado en el repo alcanza y es lo que se mantiene solo.
  Si termina siendo una tabla en markdown o un JSON, mejor.
- NO scrapees Instagram con automatizacion que viole ToS. La biblioteca de anuncios de Meta es
  publica y tiene API; los reels que analizamos ya estan en el repo.
- NO inventes metricas. Un gancho sin numero sigue sirviendo; un numero inventado envenena todo.
- NO lo llames "viral". Se llama radar de ganchos.

BUSCA PRIMERO DONDE VIVE: el carril ya tiene el corpus analizado y una sintesis por lote. Si el
radar se puede armar leyendo lo que YA esta escrito en video-intake/, no hace falta una fuente
nueva. Ese es el camino barato y es el que hay que probar primero.

LISTO = existe un archivo con los ganchos que ya tenemos identificados del corpus, cada uno con
su texto literal, formato, fecha y fuente, y se puede buscar por tema. Sin panel, sin metricas
inventadas, y con el metodo escrito para agregarle uno nuevo cuando aparezca.
```

---

---

# Sesión `pendiente`

Archivo completo de la sesión: [sesiones/pendiente.md](sesiones/pendiente.md)

## F1 · Auditar los 11 agentes contra los tres antipatrones

```text
Contexto: un taller de Code w/ Claude (primera parte de Anthropic, con numeros medidos en
pantalla) rehizo un agente de inventario y bajo el costo 30x. Ficha con las capturas:
hermes-content/references/video-intake/2026-08-17-code-with-claude-stockpilot.md

Los numeros medidos, antes -> despues: 216.365 -> 7.628 tokens (28x), ~$2 -> ~$0,07 (30x),
328s -> 164s, y el resultado paso de FAIL (over budget) a PASS.

Como lo lograron: sacaron 12 herramientas hechas a mano y dejaron
  agent_toolset (Bash/Read/Write) + 5 skills que se cargan solo cuando se disparan
  + subagentes SOLO cuando una skill los pide.
Lamina de cierre: "One agent. Five skills. Subagents only when a skill says so."
15 lineas de system prompt, 0 subagentes hardcodeados, 92% de eval.

LOS TRES ANTIPATRONES, con nombre:
1. CONTEXT-DUMPERS. Una herramienta le entrega 395 filas de CSV al modelo en cada llamada
   y el modelo tiene que escanearlas a ojo. Arreglo: el calculo va al sandbox (bash, awk,
   un script chico) y vuelve solo el top-N en JSON compacto.
   Principio: compute-over-context.
2. SUBAGENT-HIDERS QUE DEVUELVEN PROSA. Una herramienta llama a un subagente y despues el
   orquestador PARSEA un numero de un texto libre. Ahi se pierde el dato: "la prosa dice
   'bastante seguro', no 0.72". Arreglo: la skill fija la forma del JSON de retorno.
   Principio: act via skill.
3. TRIVIAL WRITES. Una herramienta de 3 lineas (armar dict, agregar al JSONL, devolver
   estado) que un bash hace igual sin el overhead de definir la herramienta.
Y una de alcance: si la herramienta no pertenece al dominio del agente, es otro servicio.
   Principio: scope.

Tarea:
1. Lista TODOS los agentes que existen hoy: .claude/agents/ y los runtimes de ONIA Center
   que corren por cron (Vendedor, Contenido, Finanzas y los demas). Listado completo,
   verificado en el repo, no de memoria.
2. Por cada uno, decidi contra los tres antipatrones. Uno por uno, con el motivo:
   - dumpea contexto? (le pasa listados crudos al modelo en vez de calcular antes)
   - esconde un subagente devolviendo prosa? (se extrae un dato de texto libre)
   - hace escrituras triviales envueltas en herramienta?
   - esta fuera de su alcance?
3. Deci cuales SOBRAN: cuales se reemplazan por una skill que se carga cuando toca, y
   cuales por dos lineas de bash. El objetivo es tener MENOS agentes, no mas.
4. Medi lo que puedas medir sin gastar: cuantos tokens de contexto arrastra cada agente en
   una corrida tipica. Si no se puede medir, decilo; no estimes a ojo.
6. LOS MCP TAMBIEN ENTRAN EN LA AUDITORIA. El taller da un orden explicito y advierte:
   "we see a lot of folks run towards MCP first, and a lot of our customers end up in this
   ecosystem where there's a lot of chaotic MCP servers... a lot of times they have overlap,
   which can create some problems" y "one of the drawbacks of MCP is that it can cause some
   context issues".
   El orden correcto, en este orden y no otro:
     1) primitivas (file system, web search, code execution) -- "we always start there"
     2) herramientas propias LOCALES, solo para ese agente
     3) MCP UNICAMENTE cuando varios clientes/agentes necesitan el mismo conjunto
        estandarizado y gobernado
   Alternativa que proponen a conectar un MCP: darle el CLI y que invoque la API escribiendo
   codigo.
   Tarea concreta: lista los servidores MCP conectados hoy, marca cuales se pisan entre si,
   cuales usa realmente algun agente, y cuales se pueden reemplazar por un CLI. Esta sesion
   tiene del orden de 20 conectados y nunca se midio lo que cuestan en contexto.

7. CUANDO SI CORRESPONDE UN SUBAGENTE -- son exactamente dos casos, y hay que respetarlos:
   (a) tirarle mucho Claude a un problema en paralelo (research, exploracion de codigo)
   (b) una mente fresca que mire el trabajo de otra: "I do not want to be the same person
       that is writing and also reviewing my code" -- y clave: el revisor NO tiene el
       contexto del que escribio.
   Si un agente nuestro no cae en (a) ni en (b), es candidato a desaparecer. El propio
   taller advierte: "there are a lot of cases where you can just scrap the subagent entirely
   and give more flexibility to your main agent... frontier models have gotten intelligent
   enough where you just don't need as many subagents".

8. Entrega UNA tabla con todo junto:
   agente o MCP | antipatron detectado | cae en (a)/(b)? | reemplazo propuesto | ahorro esperado

NO refactorices nada en esta pasada. Es diagnostico. El refactor sale despues, uno por uno.

Un limite honesto: el taller usa Claude Managed Agents (CMA) y su primitiva callable_agents.
NO esta verificado que la tengamos ni que cueste. Los tres principios SI son portables a
.claude/agents/ + skills; la primitiva puede no serlo. No planifiques asumiendo CMA.

LISTO = la tabla existe con TODOS los agentes, cada uno juzgado contra los tres antipatrones
con motivo escrito, y la lista explicita de cuales sobran.
```

---

---

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

---

## B4 · Probar los 6 patrones en vivo (chico, 20 min)

```text
Sesion: cualquiera con navegador. git branch --show-current primero.
TAREA UNICA: mirar los 6 patrones moverse y anotar si el timing esta bien.
  npx serve hermes-content/references/ui-patterns
Patrones: upload-button, checkout-card, floating-cart, dropzone-progress, chat-widget, sidebar-nav.
Por que hace falta: se verifico estado, DOM, accesibilidad y estados finales, pero NO el timing
— con el panel del navegador oculto las transiciones CSS no avanzan y getComputedStyle devuelve
el valor inicial. Nadie los vio moverse todavia salvo el upload-button.
LISTO = una linea por patron: timing OK o "queda lento/rapido en X". Y probar con
reduced-motion activado en DevTools (los 6 tienen que quedar legibles y completos).
NO HAGAS: no toques el codigo en esta sesion. Solo mirar y anotar.
```

---

---

---

## D2 · Las fechas que corren solas

Tres plazos de la memoria del proyecto, con la cuenta hecha al 2026-08-12. Ninguno depende de
que mires un video mas; todos se vencen aunque nadie los mire.

| Fecha | Que pasa | Faltan |
|---|---|---|
| **30-sep-2026** | facturacion en linea obligatoria en Bolivia | ~7 semanas |
| **1-oct-2026** | se cierra la ventana gratuita de 24 h de WhatsApp | ~7 semanas |
| **~oct-2026** | fin del runway estimado (11 semanas contadas desde el 26-jul) | ~8 semanas |

```text
Sesion: la de estrategia/fiscal segun corresponda. git branch --show-current primero.
TAREA UNICA: convertir tres fechas en un plan con responsable, no en una nota.
  1. FISCAL (30-sep): verificar contra la RND vigente que la fecha sigue siendo esa y que
     alcanza a nuestros clientes objetivo. La homologacion SIAT depende del NIT (bloqueo S2 de
     Sergio) — sin eso no hay emision real, y el producto lo promete.
  2. WHATSAPP (1-oct): recalcular que le cuesta al cliente el chatbot DESPUES del cambio. Hoy el
     costeo asume la ventana gratis. Si el numero cambia, cambia el precio del add-on.
  3. RUNWAY: contra el plan vigente, cuantas semanas quedan y que se cae si no entra el primer
     cliente. Sin dramatizar: numeros.
LISTO = una tabla de 3 filas: fecha, que se cae, quien lo destraba, y que se hace ANTES.
NO HAGAS: no cites ninguna fecha fiscal sin la fuente (RND o DS con numero) — usa la skill
`onia-contabilidad-bolivia`. Una fecha mal citada en una propuesta es peor que no citarla.
NO inventes el runway: si el dato no esta, se dice que no esta.
```

---

---

## E4 · El loop de tres roles, guardado como artefacto

> ### ⚠️ CORRECCIÓN 2026-08-17 — leé esto antes de hacer E4
>
> Un taller de **Code w/ Claude** (primera parte de Anthropic, con números medidos) cierra con
> la lámina opuesta: **"One agent. Five skills. Subagents only when a skill says so. 0 hardcoded
> subagents."** Y mide 28× menos tokens **al sacar** subagentes y herramientas, no al agregarlos.
> Ficha: `hermes-content/references/video-intake/2026-08-17-code-with-claude-stockpilot.md`
>
> **E4 no se anula, se reordena:**
> - El **evaluador** sigue en pie tal cual. Es el Gate 3 y es lo que más falta hace.
> - **El evaluador queda VALIDADO por el propio taller**, no solo tolerado: *"I do not want to
>   be the same person that is writing and also reviewing my code"*, y el revisor **no lleva el
>   contexto** del que escribió. Ese era el rol correcto de E4; el error era hardcodear también
>   al planeador y al ejecutador.
> - **Planeador y ejecutador NO se crean como agentes hardcodeados.** Primero se prueban como
>   **skills que se cargan cuando toca**. Si una skill alcanza, no hay agente.
> - Un subagente entra **solo cuando una skill lo pide**, y devuelve **JSON con forma fija**,
>   nunca prosa de la que haya que extraer un número.
> - Antes de construir el loop, corré **F1** (auditar los agentes que ya existen contra los tres
>   antipatrones). Puede que sobren agentes en vez de faltar.


```text
Contexto: un reel describe el loop que usa quien lo publica, y por primera vez da la forma
concreta: TRES agentes -- planeador, ejecutador, evaluador -- cada uno con instrucciones,
objetivos y MEMORIA propios. Ficha:
hermes-content/references/video-intake/2026-08-16-loop-tres-agentes.md

Por que la separacion importa: un solo agente que se revisa a si mismo arrastra su propio
sesgo, porque ya decidio que estaba bien cuando lo escribio. Tres roles con contexto
distinto no comparten ese sesgo.

Lo que YA tenemos (verificado, no lo rehagas): subagentes con instrucciones propias en
.claude/agents/, y la herramienta Workflow que hace pipeline()/parallel() y bucles. Lo que
NO existe: el loop guardado como artefacto reusable. Hoy se rearma a mano cada vez, y eso es
exactamente el problema que el Gate 3 nombra -- un gate que depende de acordarse no es un
gate.

Diseño a implementar:
  planeador  -> lee el objetivo y el "LISTO =", devuelve plan + criterios de aceptacion.
                NO ve el codigo.
  ejecutador -> implementa contra ese plan.
  evaluador  -> recibe SOLO el "LISTO =" y el diff. Responde aprobado/rechazado + motivo.
                NO ve el plan del planeador: si lo ve, hereda su justificacion.
  rechazado  -> vuelve al ejecutador con el motivo.
  cierra cuando una pasada completa no encuentra nada nuevo.

Tarea:
1. Guardalo como workflow reusable en .claude/workflows/ con esos tres roles. Esa carpeta
   todavia NO existe en el repo: crearla es parte de la tarea.
2. TOPE DE VUELTAS OBLIGATORIO y visible. El propio video advierte: "si no sabes disenar un
   buen loop, esto te puede costar muy caro porque los loops consumen muchos tokens". Sin
   tope, un loop mal disenado quema presupuesto sin avisar.
3. Que loguee, al cerrar: cuantas vueltas dio, que rechazo el evaluador en cada una, y si
   cerro por convergencia o por tope. Si cerro por tope, que lo diga fuerte: NO esta listo.
4. Probalo contra una tarea chica y real, y pegá el log de vueltas.

LISTO = el workflow existe, corrio contra una tarea real, y el log muestra las vueltas y el
motivo de cierre.
```

---

---

## E5 · Strix — evaluar, con el costo puesto sobre la mesa antes

```text
Contexto: de cinco plugins que recomendaba un reel, cuatro ya los teniamos. El quinto no, y
es el de seguridad. Ficha con la verificacion:
hermes-content/references/video-intake/2026-08-16-cinco-plugins-strix.md

VERIFICADO con fuente (no repetido del reel): github.com/usestrix/strix, Apache 2.0. Son
agentes autonomos que CORREN la app, la exploran, explotan fallas y validan cada hallazgo
con una prueba de concepto real -- no un listado de "posibles vulnerabilidades". Tienen
proxy HTTP, navegador para XSS/CSRF, terminal y entorno Python para exploits propios. La
CLI es gratis; se paga el consumo de LLM.

Por que nos toca: la plataforma maneja registro de clientes, datos de pacientes en el pack
dental, y hay carrito y checkout en construccion. La seguridad de produccion se cerro y
verifico el 2026-08-11, pero eso fue una REVISION, no un ataque. Un agente que valida con
prueba de concepto encuentra otra clase de cosa.

BLOQUEO REAL, decilo antes de intentar nada: Strix consume LLM y necesita API key propia.
Las keys del .env estan invalidas, y la suscripcion de Claude Code NO sirve para esto: no es
una API. O sea, HOY no se puede correr sin gasto nuevo.

Tarea, en este orden y sin saltarse el 1:
1. Estimá el costo de una corrida contra UNA app chica nuestra. Numero concreto, con el
   supuesto de tokens escrito. Si no se puede estimar, decilo y pará ahi.
2. Presentale a Sergio: costo estimado + que app se atacaria + que se rompe si sale mal.
3. NO CORRAS NADA hasta que Sergio apruebe el gasto explicitamente.
4. Si aprueba: corré SOLO contra un entorno de prueba, NUNCA contra produccion, y entregá
   los hallazgos con su prueba de concepto.

Gasto pago sin permiso explicito = prohibido. Esto no es la excepcion.

LISTO = la estimacion de costo esta escrita y presentada. Si no hubo aprobacion, LISTO es
exactamente eso y nada mas -- no se corre igual "para probar".
```

---

---

## F3 · Partir CLAUDE.md: lo que va siempre y lo que va como skill

```text
Contexto: el taller de Code w/ Claude arranca describiendo un problema que es identico al
nuestro, y lo dice con estas palabras:
  "your system prompt had grown to become several hundred lines long. You have dozens of
   tools and sub agents... and because of the complexity, you've started to see REGRESSIONS
   in the areas that your agent was previously accelerating in."
  "If this is you, you're not alone. We see this commonly with customers -- and actually
   with ourselves included in that."
Ficha: hermes-content/references/video-intake/2026-08-17-code-with-claude-stockpilot.md

Lo arreglaron bajando el system prompt de ~400 lineas a ~50 (moviendo la logica a skills) y
despues a 15. El criterio, textual y de una linea:

  "LEAVE THE SYSTEM PROMPT ONLY FOR THE INFORMATION THAT CLAUDE NEEDS IN ITS MIND,
   REGARDLESS OF THE TASK you give it. Skills are fantastic for packaging information that
   Claude is going to need SOME of the time, not all of the time."

Y la definicion de skill que usan: "packaged, composable information that Claude has the
ability to pull into context whenever Claude realizes that it needs it".

NUESTRO CASO: CLAUDE.md de proyecto carga en CADA sesion las reglas de propuestas
comerciales, de video, de carriles, de git, del core, de cuando separar un repo, de pricing,
y varias mas. Una sesion de video no necesita las reglas de propuestas; una de contabilidad
no necesita las de video. Ademas ya existen skills propias (onia-router, onia-propuestas,
onia-contabilidad-bolivia, onia-core, onia-web-factory, ver-videos, editor-videos) que en
varios casos cubren el mismo contenido que el CLAUDE.md repite.

Tarea:
1. Medi primero: cuantas lineas y cuantos tokens aproximados carga hoy CLAUDE.md en cada
   sesion. Numero concreto.
2. Clasifica CADA seccion de CLAUDE.md en una de dos:
   (a) SIEMPRE -- se necesita sin importar la tarea (ej: la regla de git autosync, el
       objetivo por sesion, que main siempre compile)
   (b) A VECES -- solo para cierto tipo de tarea (ej: propuestas, video, core, pricing)
   Con el motivo en una linea por seccion. Si dudas, es (b).
3. Para cada (b), verifica si YA existe una skill que lo cubre. Si existe, la seccion se
   reemplaza por un puntero de una linea. Si no existe, decilo -- no la crees en esta pasada.
4. Propone el CLAUDE.md corto, y deja el contenido movido en su skill, sin perder nada.
   REGLA: no se borra informacion, se reubica. Si algo no tiene donde ir, se queda.
5. Antes de aplicar, MOSTRALE A SERGIO el antes/despues: que secciones salen, a que skill
   va cada una, y cuantas lineas quedan. No lo apliques sin que lo vea.

Cuidado con dos cosas:
- CLAUDE.md tiene reglas que nacieron de errores caros (nada a medias, main siempre compila,
  gasto con permiso). Esas son (a) casi seguro: se necesitan aunque la tarea no las toque,
  porque justamente evitan que alguien las ignore.
- onia-router ya es el indice del stack de skills. Si el CLAUDE.md corto apunta bien a
  onia-router, la mayoria del ruteo se resuelve solo.

LISTO = el antes/despues esta escrito y mostrado, con la medicion de lineas/tokens de las dos
versiones, y NADA se aplico sin aprobacion.
```

---

---

# Sesión `crm-prospeccion`

Archivo completo de la sesión: [sesiones/crm-prospeccion.md](sesiones/crm-prospeccion.md)

## C4 · El hueco #1 no lo cierra ningun video ⛔ **BLOQUEADO**

De los **45 videos ingresados, CERO** hablan de como conseguir el primer cliente pagando, B2B, en
Bolivia (§6.1 de la [sintesis](SINTESIS_CORPUS.md)). Las tres piezas de `BANDEJA.md` que parecian
tapar el hueco se procesaron el 12-ago y **ninguna lo tapo**:
[8 industrias](2026-08-12-ocho-industrias-ocho-agentes-ia.md) da copy, no ruta;
[5 formatos](2026-08-12-cinco-formatos-anuncio-estatico-meta.md) es ecommerce DTC gringo;
[caso Climatic](2026-08-12-caso-exito-ajeno-climatic-marca-propia.md) le vende asesoria a un
aspirante a emprendedor. **Este hueco no se cierra mirando mas reels. Se cierra con fuentes.**

```text
Sesion: ventas / prospeccion. git branch --show-current primero.
TAREA UNICA: escribir la ruta al PRIMER cliente pagando, con fuentes reales, no con videos.
  1. Pregunta abierta que decide Sergio y va PRIMERO (no la decidas vos): la plataforma es
     multi-rubro, pero ¿el ESFUERZO COMERCIAL se concentra en UN rubro hasta cerrar los primeros
     casos? Seis rubros son seis mensajes, seis landings y seis listas, con cero clientes hoy.
     Presentale la pregunta con el pro y el contra en 5 lineas y esperá la respuesta.
  2. Con el rubro elegido: 20 prospectos REALES y verificables en Santa Cruz, cada uno con la
     fuente de donde salio (registro publico, directorio del gremio, su propia web o IG) y una
     senal concreta de por que es candidato — no una lista de volumen.
  3. El guion de primer contacto por el canal que SI tenemos hoy (WhatsApp/Chatwoot), no por el
     que esta bloqueado. Maximo 5 lineas, nombrando el dolor exacto del rubro (gate de C2).
LISTO = la pregunta contestada por Sergio + la tabla de 20 prospectos con fuente por fila + el
guion. Nada enviado todavia.
NO HAGAS: NO ingreses ni analices un video mas para esto — 45 piezas no lo cubrieron y la 46 no
lo va a cubrir. Las fuentes son registros, gremios y las webs de los propios negocios.
NO inventes un prospecto ni un dato de contacto: fila sin fuente, fila que no va.
NO automatices el envio (es S6 + spam con nuestra marca) ni uses un Lead Finder de volumen — eso
ya esta decidido en el prompt de `CRM` / prospeccion, que sigue siendo el que discute la
arquitectura de agentes. Este prompt es la lista de verdad, hecha a mano, y no lo reemplaza.
```

---

---
