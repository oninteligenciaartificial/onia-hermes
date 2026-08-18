# Prompts del lote del 2026-08-16 — E1 a E11

Once videos analizados con el [método de dos carriles](METODO_DE_ANALISIS.md) y las
[skills ruteadas](SKILLS_DEL_CARRIL.md). Cada prompt se pega tal cual en la sesión que dice.

**Antes de pegar cualquiera:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md) aplican igual — Gate 1 (verificar contra el repo,
no contra la memoria), Gate 2 (no inventar datos ni cifras), **Gate 3 (auto-evaluación antes de
responder)**.

---

## Dónde se pega cada uno

| Sesión | Prompts | Orden |
|---|---|---|
| **`onia-plattform`** | **E1** molde del rubro · **E3** las 9 features de gastronomía | E1 primero: E3 se mide contra él |
| **`chatbot`** | **E2** el corte YMYL | después de D1 (el bot roto) |
| **`INFLUENCERS IA`** | **E9** los 5 bloques del prompt + 3D estilizado · **E6** qué dispara la etiqueta de IA | E9 primero: es el que produce |
| **`editor de videos`** | **E8** slate/cara con HyperFrames · **E10** formato gemelo | cualquiera |
| **marketing** | **E7** la demo de 17 s · **E11** la demo en una toma | E11 queda esperando cliente real |
| **`pendiente`** | **E4** el loop de 3 roles · **E5** evaluar Strix | E4 primero: E5 necesita decisión de gasto |

**Choque a cuidar:** E9 y E6 tocan la misma sesión y el mismo tema. Van seguidos, no juntos.

---

# ONIA PLATFORM

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

# CHATBOT

## E2 · El corte YMYL: escalar al humano y decirlo en pantalla

```text
Contexto: una app de nutricion mostro dos guardrails que nosotros necesitamos igual, y por
la misma razon (salud = YMYL). Ficha:
hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md

Los dos, verbatim del video: "si es algo mas importante o algo delicado te pide que lo
consultes con el nutriologo", y en la pantalla del chat hay un descargo visible bajo el
campo de texto.

Tarea:
1. Verifica si el chatbot tiene HOY una regla de escalamiento a humano para temas
   clinicos, y si muestra algun descargo. Verificalo en la conversacion real, no en el
   prompt del sistema.
2. Si no la tiene, escribila: que categorias de consulta cortan (sintoma, dolor, diagnostico,
   dosis, urgencia), que responde el bot al cortar, y a quien deriva.
3. El descargo va VISIBLE en la interfaz, no escondido en terminos y condiciones.
4. Bolivia NO tiene ley integral de proteccion de datos. NO cites leyes extranjeras como si
   aplicaran: ya pasamos por eso una vez. Si necesitas marco legal boliviano, cargá la skill
   onia-contabilidad-bolivia y citá norma vigente con su numero.

Esto es para el pack dental y cualquier rubro sanitario. No aplica al de comercio.

Nota de orden: si el prompt D1 (el bot no guarda mensajes desde el 2026-08-06) sigue
abierto, ESE va primero. Un guardrail sobre un bot que no persiste no sirve de nada.

LISTO = el corte esta activo en produccion y se ve en una conversacion real de prueba, con
el descargo visible en pantalla.
```

---

# INFLUENCERS IA / HIGGSFIELD

## E9 · Los cinco bloques del prompt, y por qué el 3D estilizado gana

```text
Contexto: dos videos hechos con IA analizados a fondo. Ficha con las siete preguntas
contestadas video por video:
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md

HALLAZGO 1 — un reel mostro el prompt COMPLETO en pantalla. La estructura, en orden fijo:
  1. Tipo de toma, una linea      ("Single continuous FPV drone shot, no cuts.")
  2. Entorno y atmosfera
  3. RECORRIDO DE CAMARA — ~120 palabras, la mitad del prompt, paso a paso en el espacio:
     de donde arranca, hacia donde acelera, donde se inclina, que curva describe, donde
     termina
  4. Detalles de movimiento — la fisica: inercia, microcorrecciones, particulas, y
     "speed contrast" (sujeto en camara lenta, camara rapida)
  5. Luz y color, al final — grado, contraste, grano, aberracion
  El insumo fue UNA IMAGEN FIJA + ese texto. Una sola generacion, sin cortes.

  Lo que estamos haciendo mal: describimos la escena y le pedimos a la camara "movimiento
  cinematografico". Por eso sale generico. La camara se COREOGRAFIA.

HALLAZGO 2 — el otro reel es un sketch narrativo con dialogo, en 3D estilizado, NO
  fotorrealista. Tiene defectos de IA a la vista (una mano fundida, logos manchados) y no
  importan: en animacion se leen como estilo. En fotorrealismo se leerian como error.
  Regla: para contenido narrativo con IA, estilizado 3D antes que fotorrealista. Lo
  fotorrealista se reserva para Lucia, que es la unica cara que lo necesita.

VERIFICADO YA contra la cuenta (no lo repitas, usalo):
  - flux_3_video: 5-20 s, 1080p, audio sincronizado por defecto, acepta start/end image,
    referencias y CONTINUACION de video. Es el mejor para narrativa.
  - veo3 (variantes preview/fast), wan2_7 (2-15 s, consistencia de personaje), gemini_omni
    (4-10 s) tambien tienen audio nativo.
  - CORRECCION al corpus: el tope de 15 s era de seedance_2_0. flux_3_video llega a 20 s.
  - unlim.available = false: HOY no hay generaciones ilimitadas. Cada generacion cuesta.
  - CORREGIDO EL 18-AGO: seedance_2_5 SI existe ahora en la cuenta, 4-30 s, con modos
    video_edit y video_extension. Cuando se escribio este prompt no estaba. Volve a
    consultar el catalogo vos mismo antes de usar cualquier dato de modelo de aca:
    una verificacion tiene fecha de vencimiento.

Tarea:
1. Reescribi la plantilla de prompt de video que usemos hoy con los 5 bloques en orden, con
   el bloque 3 obligatoriamente largo. Si no existe plantilla, creala donde ya viven las
   recetas de video (hermes-content/docs/), no en carpeta nueva.
2. Escribi UN prompt completo de ejemplo para una pieza real nuestra, con los 5 bloques.
3. Anota la regla del 3D estilizado en la guia de contenido generativo.
4. Actualiza el catalogo de modelos con los datos verificados de arriba.

GASTO: no generes NADA. Generar video = permiso explicito de Sergio, caso por caso. Entregá
el prompt listo para que el lo apruebe, con el modelo y el costo estimado al lado.

LISTO = plantilla de 5 bloques guardada, un prompt de ejemplo escrito, la regla del 3D
anotada, y el catalogo corregido. Cero generaciones.
```

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

# EDITOR DE VIDEOS

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

# MARKETING

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

## E11 · La demo en una toma, con el cliente usándolo

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

# PENDIENTE (harness / infra)

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
