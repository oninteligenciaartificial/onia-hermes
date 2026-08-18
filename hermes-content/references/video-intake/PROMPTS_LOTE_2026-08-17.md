# Prompts del lote del 2026-08-17 — F1, F2 y F3

Salen de **dos videos largos de X**, no de reels: un taller de **Code w/ Claude** (44 min,
primera parte de Anthropic) y una clase de Karpathy (2 h 06). Fichas:
[StockPilot](2026-08-17-code-with-claude-stockpilot.md) ·
[Karpathy](2026-08-17-karpathy-como-funciona-un-llm.md).

**Antes de pegar cualquiera:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md) aplican igual.

> ⚠️ **Este lote corrige el prompt E4** del lote anterior. Si E4 todavía no se ejecutó, leé
> primero la corrección que quedó escrita adentro de E4 en
> [PROMPTS_LOTE_2026-08-16.md](PROMPTS_LOTE_2026-08-16.md).

## Dónde se pega cada uno

| Sesión | Prompt | Orden |
|---|---|---|
| **`pendiente`** (harness) | **F1** auditar los 11 agentes contra los 3 antipatrones | **antes que E4** — puede que sobren agentes en vez de faltar |
| **`onia-plattform`** | **F2** evals para el agente que más corre | después de F1: F1 dice cuál medir |
| **`pendiente`** (harness) | **F3** partir `CLAUDE.md` en lo que va siempre y lo que va como skill | independiente; se puede en paralelo con F1 |

---

# PENDIENTE (harness)

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
5. Entrega una tabla: agente | antipatron detectado | reemplazo propuesto | ahorro esperado.

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


# ONIA PLATFORM

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

