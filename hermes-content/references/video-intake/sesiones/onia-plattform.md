# Sesión `onia-plattform`

> **Este archivo es la raíz de la sesión `onia-plattform`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **F2 después de F1 (que corre en `pendiente`) · E1 primero de los de producto (define el molde) → E3 se mide contra él → el resto**
>
> Índice general del carril: [../INDEX.md](../INDEX.md) · fichas de origen en `../`

---

## Preambulo — pega esto al inicio de CUALQUIER sesion

Seis reglas que salieron de los errores de la sesion de analisis de reels (2026-08-11). No son
teoria: cada una nacio de algo que se hizo mal y se corrigio.

```text
Antes de escribir una sola linea:
1. Invoca `onia-router` y ubica el carril. Verifica `git branch --show-current`.
2. BUSCA DONDE VIVE LA COSA ANTES DE CREARLA. El repo ya tiene pipeline para casi todo
   (web-factory tiene reels->learned models; ver-videos tiene el intake; el pattern bank tiene
   el motion). Escribir un doc "al lado" del sistema que ya existe es el error mas caro:
   duplica y se desincroniza. Si no encontras donde va, pregunta antes de inventar carpeta.
3. Verifica en vivo lo que toca prod, plata o main. Y deci explicitamente lo que NO pudiste
   verificar: "los estados estan probados, el timing no porque el panel del navegador esta
   oculto y las transiciones no avanzan" es una respuesta correcta; "quedo listo" no lo es.
4. Ninguna cifra, precio o capacidad que venga de afuera se repite como propia sin verificarla.
   Marcala como "a verificar" o no la menciones.
5. Reporta la cobertura real ("audio 100%, 5 de 7 laminas"), nunca "lo vi" desde dos cuadros.
6. Al cerrar: que quedo en produccion, que quedo a medias y donde exactamente, y que depende
   de Sergio. Nada flotando en la conversacion.
```

---

## Los dos gates que aplican a TODOS los prompts de este archivo

Pegá esto junto al prompt. Nacen de errores concretos de esta sesión, no de teoría.

### Gate 1 — control de calidad ANTES de ejecutar

```text
Antes de hacer nada de lo que pide el prompt, verificá que el prompt siga siendo válido:
1. ¿YA ESTA HECHO? Mirá el repo y la memoria del proyecto, no el prompt. Un prompt de esta
   lista mandaba a cerrar la seguridad de produccion cuando ya estaba cerrada y verificada
   dias antes — habria mandado a rehacer trabajo terminado.
2. ¿EL BLOQUEO EXISTE? Si el prompt dice que algo esta trabado, comprobalo. Dos "bloqueos" de
   esta lista se cayeron con un `ls` y una consulta gratis: los SFX estaban en otra carpeta y
   la voz no era ambigua, era un ID truncado en los docs.
3. ¿EL DATO SIGUE VIGENTE? Los numeros de cuenta, precios y capacidades tienen fecha. Si el
   prompt trae uno, confirmalo antes de construir encima.
4. ¿YA VIVE EN ALGUN LADO? El repo tiene pipeline para casi todo. Buscá donde vive la cosa
   antes de crear una carpeta nueva: escribir un doc "al lado" del sistema que ya existe es
   el error mas caro, porque duplica y se desincroniza.
Si algo de esto invalida el prompt, DECILO y no lo ejecutes. Un prompt que quedo viejo se
corrige, no se obedece.
```

### Gate 2 — ordenar en su carpeta ANTES de cerrar

```text
Al terminar, nada queda suelto ni en la raiz del repo. Cada cosa a su lugar:
- Web entera vista en un reel  -> web-factory/data/references/reels/models/ (learned model)
- Componente de UI reconstruido -> hermes-content/references/ui-patterns/<patron>/
- Patron de movimiento          -> web-factory/docs/MOTION_PATTERN_BANK_2026.md
- Analisis de un video          -> hermes-content/references/video-intake/
- Doc de proceso o decision     -> hermes-content/docs/  (es la fuente; la raiz sin gemelos)
- Receta de generacion          -> hermes-content/docs/ y se apunta desde la skill
- Codigo de herramienta         -> scripts/ o .claude/skills/<skill>/scripts/
Si no sabes donde va, PREGUNTA antes de inventar carpeta.
Y antes de commitear: `git status` limpio de archivos huerfanos, y el commit explica el POR QUE,
no solo el que.
```

---

### Gate 3 — el loop: auto-evaluacion ANTES de responder

Sale del reel de AI loops, que en la primera pasada despache como humo y era el mas importante
del corpus ([ficha](../2026-08-09-ai-loops-code-review.md)). La idea no es el comando: es **donde
esta el control**. La verificacion va antes de entregar, no despues de que Sergio encuentre el
error.

```text
Antes de decir que terminaste, corre este loop sobre tu propio trabajo:
1. Reelee el "LISTO =" del prompt. ¿Lo cumpliste, literal? No "casi".
2. Buscá activamente en que te podes haber equivocado. Nombra la parte mas fragil de lo que
   hiciste y comprobala. Si no encontras ninguna parte fragil, no miraste bien.
3. Lo que afirmes, verificalo: si decis que algo existe, abrilo; si decis que funciona,
   corrélo; si decis que se perdio, revisá que estabas mirando el lugar correcto.
4. Deci explicitamente que NO pudiste verificar. Un "esto quedo sin comprobar" vale mas que un
   "listo" que se cae al primer toque.
5. Recien ahi respondé.
Si el paso 2 encuentra algo, corregilo y volve al 1. El loop se cierra cuando una pasada
completa no encuentra nada nuevo — no cuando te cansaste de mirar.
```

**Un gate que depende de acordarse no es un gate.** En una sola sesion, con los Gates 1 y 2 ya
escritos, se entregaron cinco cosas sin verificar: un prompt que mandaba a rehacer trabajo
terminado, dos bloqueos que no existian, un archivo "perdido" que estaba intacto, y una
escritura en el arbol de otra rama. En los cinco casos el dato correcto estaba a una consulta
de distancia.

---

**Para delegar a subagentes** (esto se probo con 8 agentes en paralelo y funciono):

```text
Trabajas en el worktree EXACTO: <ruta completa>
Verifica `git branch --show-current` (debe decir <rama>). No commitees, no hagas push.
Escribis SOLO estos archivos: <lista>. NO toques indices ni docs compartidos — de eso me encargo yo.
Si el video/doc afirma un dato, marcalo como "a verificar", no lo des por cierto.
DEVOLVE: una linea por entregable con <archivo> | <resultado> | <decision que tomaste>.
```

La regla que hace que esto no choque: **cada agente escribe sus propios archivos, el
orquestador escribe los indices.** Ocho agentes en la misma carpeta no se pisaron ni una vez.

---

---

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

## `onia-plattform`

Dos tareas separadas. **La segunda va antes que la primera si hay que elegir**: no es
mejora, es lo que bloquea vender.

### 1 · Seguridad (del [10 errores](../2026-08-09-10-errores-seguridad-apps-ia.md))

```text
Sesión: onia-plattform (o infra). UN SOLO DUEÑO a la vez. git branch --show-current primero.
TAREA ÚNICA: cerrar los 3 bloqueantes de seguridad de producción, en este orden:
  1. RLS en las tablas donde viven los datos de cliente (hoy no hay fuga solo porque
     PGRST_DB_SCHEMAS no expone esos esquemas — eso es un tapón de config, no una defensa).
  2. Firewall del VPS activo + panel de Easypanel detrás de TLS y no abierto a internet.
  3. Logging mínimo para detectar acceso no autorizado.
LISTO = cada punto verificado EN PRODUCCIÓN, con la prueba pegada en la sesión.
NO HAGAS: nada de features, nada de migrar datos, nada de rediseñar el panel.
```

### 2 · Agente de producto (del [PostHog](../2026-08-11-posthog-agentes-producto.md))

```text
Sesión: onia-plattform. git branch --show-current primero.
TAREA ÚNICA: diseñar un agente "Producto" que lea el comportamiento real de uso y devuelva
lecciones accionables con la evidencia que las respalda. Solo el diseño y el schema.
Patrón a adaptar: tabla de lecciones (product_lessons) donde cada fila lleva la lección Y el
dato que la sostiene, para que no queden opiniones sueltas.
LISTO = el schema propuesto + de qué eventos se alimenta, con lo que YA tenemos.
NO HAGAS: NO des de alta PostHog ni ninguna plataforma nueva — es gasto y necesita permiso.
Los MCPs de NotebookLM que muestra el video son repos de terceros no oficiales: descartalos,
ya hay pipeline de voz propio. Verificá contra los agentes que ya corren (Contenido,
Finanzas, Vendedor) antes de crear uno nuevo: puede ser una vista, no un agente.
```

---

### 3 · Vision por computadora como capacidad (corregido 2026-08-11)

Sale de [Supra Vision](../2026-08-09-supra-vision-ganado-vision-computacional.md). Estaba mal
archivado como "Ganadero OS, ultimo en la cola": una camara que lee movimiento no es una
funcion ganadera, es una **capacidad** que enchufa en rubros que ya vendemos.

```text
Sesion: onia-plattform. git branch --show-current primero.
TAREA UNICA: evaluar vision por computadora como CAPACIDAD de la plataforma. Solo evaluar.
No es un rubro nuevo ni un producto: es una capacidad transversal. Contra que rubros ya
vendibles aplica y que dato entrega:
  - comercio minorista: cuanta gente entra, a que hora, cuanto se queda frente a que gondola
  - importadora: conteo de bultos en la descarga, contra la lista de packing
  - servicios: control de acceso y aforo
  - ganadero: conteo de hacienda (ultimo, no primero)
  - SEGURIDAD LABORAL / EPP (rubro NUEVO, no estaba mapeado): detectar si alguien entra a una
    obra sin casco o sin chaleco. Es de OBJETOS, no de vigilancia de clientes, asi que evita el
    problema legal; y construccion/industria es un comprador con plata en Santa Cruz.
    Empeza la evaluacion por aca, no por el aforo de una tienda.
Preguntas a responder con evidencia, no con opinion:
  1. Que precision real da un modelo de deteccion estandar en cada caso (no en el demo).
  2. [CONTESTADA 2026-08-15 — no la re-investigues] Donde corre: EN EL DISPOSITIVO. Un reel
     mostro una app con deteccion en vivo corriendo en un TELEFONO, con selector COCO-SSD /
     YOLO —los dos gratuitos y estandar— sobre la camara del propio equipo. Sin servidor, sin
     subir video, sin costo por minuto. Un telefono viejo apuntando a una puerta ya es el
     hardware. Onia Box deja de ser requisito para el caso simple; sigue teniendo sentido para
     volumen y retencion de video, no para detectar.
     Ficha: 2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md
  3. Que hardware minimo necesita el cliente y quien lo paga.
  4. Cual de los cuatro casos tiene el dolor mas caro HOY para el comprador.
LISTO = una tabla de 4 filas (rubro, dato que entrega, precision esperada, donde corre) + UNA
recomendacion: cual se prototipa primero, o ninguno y por que.
NO HAGAS: NO construyas el detector. NO des de alta plataformas de vision pagas. NO prometas
precision sin medirla — el salto de "detecto ovejas en un video" a "gestion inteligente" es
marketing, y repetirlo seria fabricar capacidad.
Si se arma una demo con overlay de cajas, se declara que es demo. Nunca mostrarlo como
capacidad instalada.
```

---

---

