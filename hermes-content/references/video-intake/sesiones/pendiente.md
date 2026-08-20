# Sesión `pendiente` (harness / infra / varios)

> **Este archivo es la raíz de la sesión `pendiente`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **F1 PRIMERO** (auditar los agentes que ya existen — puede que sobren, no que falten) → E4 corregido → D2 y D3 son fechas que corren → E5 necesita decisión de gasto
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

## D3 · La busqueda de marca de Bs 75 que bloquea todo lo demas

De la memoria: antes de gastar en registrar la marca hay que hacer la busqueda **PI-112 en el
SENAPI, que cuesta Bs 75**. Es P0 y sigue sin hacerse. Registrar sin buscar es arriesgar el
gasto entero.

```text
Sesion: la administrativa/legal. git branch --show-current primero.
TAREA UNICA: dejar lista la busqueda de antecedentes marcarios PI-112 en SENAPI (Bs 75) para
que Sergio la presente: formulario, requisitos, donde se paga, y a nombre de quien va.
OJO QUIEN FIRMA: la titular legal es Leslie Mercado Moreno (SEPREC), no Sergio. Todo acto legal
va a su nombre.
LISTO = el tramite armado y el costo confirmado, listo para presentar. Y la decision escrita:
se registra la marca MIXTA (nombre + logo), que es lo que ya estaba definido.
NO HAGAS: no inicies el registro antes de la busqueda — si hay un antecedente, se pierde la
tasa. No propongas que firme Sergio.
```

---

**Por que estos tres y no mas.** Salen de verificar hechos, no de opinar. D1 se confirmo contra
la base de produccion hoy; D2 son fechas escritas; D3 es un tramite con precio. El resto de la
memoria (S1-S9, Postiz bloqueado por DNS, etc.) son bloqueos de Sergio: no necesitan prompt,
necesitan que los haga.

**Total: 30 prompts escritos · 1 anulado · 29 vigentes.**

---

## B3 · Encender el intake automatico de video

```text
Sesion: infra (carril G, UN SOLO DUENO). git branch --show-current primero.
TAREA UNICA: dejar el intake de video corriendo sin Sergio. El codigo ya existe y esta verde:
  - `scripts/video-intake.mjs` (link -> mp4 -> lectura -> verbatim -> ficha)
  - `.github/workflows/video-intake.yml` (workflow_dispatch + repository_dispatch)
Falta SOLO cablear: (1) crear el secret GEMINI_API_KEY en el repo; (2) opcional IG_COOKIES_B64
(se regenera con `node .claude/skills/ver-videos/scripts/fetch-video.mjs --login`; la sesion de
IG caduca, hay que refrescarlo); (3) un workflow n8n que escuche Telegram, detecte un link de
IG/TikTok/YouTube y dispare repository_dispatch con event_type "video-intake".
LISTO = Sergio manda un link por Telegram y la ficha aparece commiteada en
hermes-content/references/video-intake/ + aviso de vuelta por Telegram. Probado punta a punta
con un link real.
NO HAGAS: el token de GitHub para n8n va como CREDENCIAL de n8n (Header Auth), NUNCA como
$env — el plan VPS no lo soporta. No pegues la key en el workflow.
LIMITE CONOCIDO: la cuota gratis de Gemini corta a ~20 videos por dia. Si se supera, el script
ya cae al camino alternativo (Whisper + fotogramas); no hay que arreglarlo.
```

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

## `pendiente`

Dos evaluaciones baratas que no encajan en ningún frente de producto.

```text
Sesión: pendiente. Dos micro-tareas, ninguna gasta plata todavía.
1. APIFY — de 2026-08-11-cinco-herramientas-contenido-claude.md. Evaluar qué puede extraer de
   Instagram sin token propio, con qué límites y a qué precio. Importa porque el token de IG
   está bloqueado (S6) y eso frena prospección y medición. LISTO = una tabla: qué extrae,
   límites, precio, y si destraba o no lo que S6 tiene frenado. NO des de alta la cuenta.
   AGREGADO 2026-08-15: compará Apify contra `scrapling` (github.com/D4Vinci/Scrapling), que es
   open source, gratis y trae bypass de Cloudflare. Si scrapling alcanza, Apify no se paga.
   Sale de 2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md.
2. HANDY (dictado por voz) — de 2026-08-11-handy-dictado-voz-alternativa-wispr-flow.md.
   La demo del video es en Mac y acá se trabaja en Windows 11: VERIFICAR soporte Windows,
   repo y licencia ANTES de instalar nada. LISTO = sí/no con la fuente.
NO HAGAS: no evalúes "Last 30 Days" a fondo sin antes comparar contra el Radar de Novedades
IA que ya corre por cron cada 2 h. Si no aporta algo que el radar no cubra, se descarta.
```

---

---

