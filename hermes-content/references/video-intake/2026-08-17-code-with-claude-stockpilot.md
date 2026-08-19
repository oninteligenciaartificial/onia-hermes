# Code w/ Claude — StockPilot: 12 herramientas → 5 skills, 30× más barato

- **Video:** https://x.com/0xrafy/status/2089395090506633621 · **44 min** (no es un reel)
- **Qué es:** taller *stockpilot-workshop* en **Code w/ Claude**, la conferencia de Anthropic.
  Ponente en escenario con el logo de Anthropic detrás.
- **Carril:** B (idea), **nivel de fuente: PRIMERA PARTE** — es Anthropic hablando de sus
  propias herramientas, con números medidos en pantalla.
- **Cobertura real: audio 100%** (5 de 5 chunks, 44 min —
  [verbatim completo](transcripciones/X-code-with-claude-stockpilot.txt)) + **9 de 15 muestras
  de fotograma**. Los primeros 3 chunks fallaron en Speaches (`fetch failed`) y se recuperaron
  al reintentar.
- **Quién habla:** **Will, del equipo Applied AI de Anthropic** — mitad ingeniería interna,
  mitad construyendo agentes con clientes. Code w/ Claude **Londres**.
- **Veredicto: SIRVE YA — es el hallazgo más aplicable de todo el corpus**

---

## La conclusión, en una lámina

> ### One agent. Five skills. Subagents only when a skill says so.

| 15 | 5 | 0 | 92% |
|---|---|---|---|
| líneas de system prompt (arrancaba en **~400**) | skills (cargadas **bajo demanda**) | subagentes hardcodeados | eval score (11/12) |

> **Corrección a lo que escribí ayer:** puse el 92% sin la línea de base. La base documentada era 83%, pero **al correrla en vivo dio 62% (7 de 12)**: *“we ran them and we got 62%, which is worse than the 83% than we started with.”* El salto real es **62% → 92%**, no 83% → 92%. Y el system prompt bajó en dos pasos: **~400 → ~50** líneas al mover la lógica a skills, y **→ 15** al final.

Arquitectura final: `StockPilot (Claude Managed Agents)` · `claude-sonnet-4-6` · system prompt
de 15 líneas, con tres ramas:

- **5 skills**: `reorder-policy`, `supplier-selection`, `forecasting`, `notify-templates`,
  `weekly-report`
- **Agent_toolset**: `Bash · Read · Write`
- **callable_agents → forecaster** (la primitiva multiagente de CMA)

Y la ecuación de la transformación, textual: `12 inline tools → agent_toolset + 5 skills +
callable_agents`.

## Los números medidos — antes y después

Capturado de la terminal en pantalla:

| Métrica | Antes (ciclo 0) | Después (ciclos 1+2) | Cambio |
|---|---|---|---|
| Resultado | **FAIL** (over budget) | **PASS** | ✅ |
| Tiempo | 328 s | 164 s | ~2× más rápido |
| **Tokens** | **216.365** | **7.628** | **~28× más barato** |
| Turnos | 7 | 5 | −2 |
| **Costo** | ~$2 | ~$0,07 | **~30× más barato** |

Y la explicación, verbatim de pantalla:

> *"That 216k → 7.6k token drop is the signature of **compute-over-context** working:*
> - *The 395-row `list_low_stock` dump is gone — replaced by a Python script that sorts in the
>   sandbox and hands back only the top-N*
> - *The 416-line `LEGACY_PROMPT` preamble is gone — replaced by the ~18-line `SHORT_PROMPT` +
>   **skills that load only when triggered***
> - *The subagent-hiders' prose round-trips are gone"*

## Los tres antipatrones — con nombre, y los tres los tenemos

Esta es la parte que hay que leer dos veces. El taller **nombra** las tres formas en que una
herramienta hecha a mano quema plata:

### 1 · Context-dumpers
`list_low_stock` le entrega **395 filas de CSV al modelo en cada llamada**, y el modelo tiene
que escanearlas a ojo para encontrar los 20 SKU urgentes. Una línea de Python los ordenaría por
`(on_hand - reorder_point)` y devolvería los 20 como JSON compacto.

> *"Compute happens in the sandbox, not in the model's head."*

### 2 · Subagent-hiders que devuelven prosa
`forecast_demand` es literalmente `return subagents.forecasting.subagent(...)`. El orquestador
después **parsea un número de un texto libre**. Y ahí está el daño concreto:

> *"That's where F2's confidence gets dropped — **the prose says 'fairly confident,' not 0.72**."*

La skill lo arregla **fijando la forma del JSON de retorno**. Después del arreglo, el subagente
devuelve `{"forecast_qty": 1240, "confidence": 0.72, "method": "rolling_mean_with_promo_lift"}`
en vez de una frase de la que hay que extraerlo.

### 3 · Trivial writes
`create_purchase_order` son 3 líneas: armar un dict, agregar al JSONL, devolver estado. Un
`python -c 'json.dumps(...)' >> sinks/purchase_orders.jsonl` hace lo mismo **sin el overhead de
definir una herramienta**.

### Y una de alcance
`search_web_for_disruptions` es un stub que devuelve texto enlatado. *"Web/news monitoring
doesn't belong in the inventory agent — that's a separate service."*

## Los tres principios del marco

| Principio | Contra qué antipatrón | Qué significa |
|---|---|---|
| **compute-over-context** | context-dumpers | el cálculo va al sandbox, no al contexto del modelo |
| **act via skill** | subagent-hiders | la skill fija el contrato JSON y mata el round-trip de prosa |
| **scope** | subagentes de más | el agente principal queda angosto (orquestación + política); el subagente se queda con el análisis pesado, y **el contrato JSON de la skill impone el traspaso** |

La crítica que el propio taller le hace a las 12 herramientas originales, comentario por
comentario en pantalla:
- `compare_supplier_quotes` — *"Calls a subagent to do what is essentially a sort."*
- `send_slack_alert` — *"Calls a writing subagent to fill what is essentially a template."*
- `generate_weekly_report` — *"Is the report structure a skill or a tool?"*
- `search_web_for_disruptions` — *"Does this belong in this agent at all?"*

## Por qué esto nos pega de lleno

**Tenemos 11 agentes cableados** (`.claude/agents/` + los runtimes de ONIA Center: Vendedor,
Contenido, Finanzas corriendo por cron). Nunca los medimos con evals, y nunca preguntamos si
alguno es un context-dumper.

Y hay una frase del taller que es, palabra por palabra, el reclamo de Sergio de esta misma
sesión:

> *"skills that load only when triggered"*

Sergio: *"tengo hartísimas skills instalada, pero no usas ninguna"*. **La arquitectura correcta
no es tener más agentes: es tener skills que se cargan cuando toca.** Eso ya lo escribimos en
[SKILLS_DEL_CARRIL.md](SKILLS_DEL_CARRIL.md) para este carril; el taller dice que es la
arquitectura del producto entero, y lo respalda con 28× de reducción de tokens.

## ⚠️ Esto CORRIGE un prompt que ya encolé

El prompt **E4** ([lote del 16-ago](PROMPTS_LOTE_2026-08-16.md)) manda a construir un loop de
**tres agentes hardcodeados** — planeador, ejecutador, evaluador — sacado de un reel.

Este taller, que es primera parte y viene con números, dice lo contrario en el título de su
lámina de cierre: **"0 hardcoded subagents. Subagents only when a skill says so."**

**No son incompatibles, pero el orden importa y yo lo tenía al revés:**

| El reel decía | El taller mide |
|---|---|
| tres agentes con memoria propia, siempre | primero **skills**; el subagente entra solo cuando una skill lo pide, con contrato JSON |
| el loop consume muchos tokens, cuidado | el consumo baja 28× **al sacar** subagentes y herramientas, no al agregarlos |

E4 queda **modificado, no anulado**: el rol de evaluador sigue siendo correcto (es el Gate 3), y
el planeador/ejecutador se replantean como skills antes que como agentes. Está escrito en el
prompt.

## Lo que falta verificar y lo digo

- ~~No leí el audio todavía.~~ **Resuelto:** audio 100% leído, verbatim guardado.
- **Claude Managed Agents (CMA)** es la plataforma del taller. **No verifiqué si la tenemos
  disponible ni qué cuesta.** Los principios son portables a `.claude/agents/` + skills; la
  primitiva `callable_agents` puede no serlo.
- El eval score de 92% es de **su** caso (inventario), no una promesa transferible.

## A dónde va

| Sesión | Qué |
|---|---|
| **`pendiente`** (harness) | **F1** — auditar los 11 agentes contra los 3 antipatrones · y E4 corregido |
| **`onia-plattform`** | **F2** — evals con tareas y graders para el agente que más corre |
| **`pendiente`** (harness) | **F3** — partir `CLAUDE.md` en lo que va siempre y lo que va como skill |

---

# Lo que agregó el audio (últimos 14 min, verbatim)

## El system prompt: 400 líneas → 15

> *"we started with an orchestrator, system prompt of about **400 lines** long... We actually
> simplified our system prompt to **15 lines** long and we **replaced all of our business logic
> with skills**. I was just stuffing requirement after requirement into my system prompt. I
> decided to take that, package it up as skills so that Claude could pull that information into
> its brain **only when Claude realized that it needed it** in order to solve a problem."*

## Por qué el código gana al contexto, dicho simple

> *"imagine instead of giving my agent a full CSV that needs to be read into context, I just
> give my agent the ability to **write and run Python** as a means of navigating across all of
> that information. The agent uses a lot less tokens when it can write code and then run code
> and then read the results **instead of having to consume all of that data in Claude's mind**."*

Y la honestidad que conviene copiar: *"this is not something that will happen all the time,
right? **We might see some cases where we regress**."*

## ⚠️ La doctrina de MCP — esto nos pega directo

El orden que recomiendan, en ese orden y no otro:

1. **Primitivas de Claude Code** — sistema de archivos, búsqueda web, ejecución de código. *"we always start there."*
2. **Herramientas propias locales**, solo para ese agente.
3. **MCP ÚNICAMENTE** cuando varios clientes o agentes necesitan el mismo conjunto estandarizado y gobernado.

> *"We see a lot of folks run towards MCP first, and a lot of our customers end up in this
> ecosystem where there's **a lot of chaotic MCP servers** that exist. A lot of times they have
> **overlap**, which can create some problems."*

> *"One of the drawbacks of MCP is that it can cause some **context issues**."*

Y la alternativa que proponen: **darle CLIs y dejar que invoque APIs escribiendo código**, en
vez de conectar un MCP.

**Por qué nos toca:** esta sesión tiene del orden de **20 servidores MCP conectados** (Cloudflare,
n8n, Higgsfield, Figma, Notion, Gmail, Calendar, Supabase, Meta Ads, Stitch, Vercel,
computer-use…), varios con funciones que se pisan. Es literalmente el cuadro que describen. **Y
no lo medimos nunca.** Sale como parte de F1.

## Cuándo SÍ usar un subagente — exactamente dos casos

> *"The two main instances where we see subagents as being really effective is **first when you
> want to throw a lot of Claude at a problem** — deep research, web search, code-based
> exploration. Subagents are a great way to parallelize."*

> *"The second case is **when you need a fresh mind to look at a problem**. If I am writing code,
> **I do not want to be the same person that is writing and also reviewing my code**... one
> instance of Claude doing the writing and then another instance coming over the top and
> reviewing, **that does not have context about the initial instance**."*

**Esto VALIDA el evaluador de E4, y con primera parte.** El rol de evaluador no era el error de
E4: el error era hardcodear también al planeador y al ejecutador. El propio taller conserva **un
solo** subagente — el de forecasting — y por el caso 2:

> *"I don't want anything in my initial context window to distort the forecasting process...
> I don't want the same Claude that my customer is talking with to also be the Claude that
> writes the forecast."*

## Y la advertencia contraria: sacar subagentes

> *"There are a lot of cases where you can just **scrap the subagent entirely** and give more
> flexibility to your main agent. What we have a lot of customers doing is actually just
> consuming capability into their main orchestrator, because **frontier models have gotten
> intelligent enough** to manage across more information where you just **don't need as many
> subagents**."*

Y por qué no exponer un subagente como herramienta: se pierde en la traducción entre orquestador
y subagente, y el logging se vuelve difícil porque hay que juntar transcripciones de varios
agentes. `callable_agents` de CMA existe para resolver esa observabilidad.

## Los tres takeaways, textuales

1. **Un solo loop de agente con primitivas simples y human-like** — sistema de archivos,
   búsqueda web, ejecución de código, a veces una lista de tareas. *"We start there and then we
   build accordingly."*
2. **Progressive disclosure a través de skills** — *"Instead of stuffing our system prompt with
   a lot of information, we made information accessible to Claude whenever Claude realized that
   it needed that information... **we're not polluting our context window**."*
3. **Evals y hill climbing** — *"you establish a baseline, you then tweak your architecture and
   you rerun evals and you get better over time."* Con la condición que casi nadie cumple:
   *"make sure that your evals are **updated as your product capability expands**."*

---

# Lo que agregó la primera media hora de audio

## El problema, planteado tal cual nos pasó a nosotros

> *"imagine that you built and shipped an agent to solve a problem... it works so well that a few
> weeks after shipping, you were asked to add some additional capability. A few weeks after that,
> you received more business requirements and you added additional capability. This pattern
> continued until before you know it, **your system prompt had grown to become several hundred
> lines long. You have dozens of tools and sub agents**... and because of the complexity, **you've
> started to see regressions in the areas that your agent was previously accelerating in**."*

> *"If this is you, you're not alone. We see this type of scenario happen pretty commonly with
> customers — **and actually with ourselves included in that**."*

La pregunta que organiza todo el taller: **¿cuándo va una herramienta, cuándo una skill y
cuándo un subagente?**

## Las tres fallas y su causa raíz — el diagnóstico es lo transferible

| Eval | Qué prueba | Por qué falla |
|---|---|---|
| **F1** | barrido diario de stock bajo | *"the agent is gonna do the right thing, but it's gonna take a **very winding path**"*. Llega al resultado correcto y **falla igual, por ineficiente** |
| **F2** | pedido bajo promoción | *"the sub agent is actually **getting the task right, but there's a communication breakdown** between our sub agent and our orchestrator"* |
| **R8** | pronóstico en mes de promo | **dos políticas en partes distintas del system prompt que se contradicen**. El agente saca bien la base (12 u/día) y bien el multiplicador (3,1×)… y después calcula con 1,35 |

Y la frase que ordena todo el diagnóstico:

> *"**this isn't a model problem, it's an issue with the information that we're surrounding the
> model with**."*

**F1 es la que más nos sirve:** que el eval castigue el **camino**, no solo el resultado. Un
agente que llega bien pero dando vueltas está quemando plata, y sin medirlo no se nota.

## La taxonomía de evals, para copiar

- **R = regression** — tareas realistas de **un solo turno**: se le da una tarea, llama
  herramientas, responde, se evalúa la respuesta.
- **F = failure mode** — tareas **multi-turno** más complicadas.
- **Graders determinísticos**: conteo de turnos, latencia y **tokens usados**, seguidos en el tiempo.
- **Graders no determinísticos**: LLM-as-judge para personalidad, tono, estilo y calidad de salida.

Y el estándar, que a nosotros nos aplica igual:

> *"they're gonna pass up front at about 83%, which is okay, but **if you work in the world of
> manufacturing, that is not okay. 17% failure is a really expensive failure percentage**."*

## La técnica de trabajo: que Claude triage sus propios evals

Corre los evals **desde Claude Code con bash** y le pide el diagnóstico. Los tres temas que
Claude encontró solo:

1. el modelo está **haciendo a mano trabajo para el que debería tener herramienta**
2. problemas de **cumplimiento de la estructura de salida** — el modelo y los subagentes
   devuelven una forma que no es la que se espera
3. **conflictos de política** dentro del system prompt largo

Config que usa, dicho al pasar y útil: **Opus 4.7 con effort en extra high**. *"I usually set
effort as extra high with opus 4.7 and I forget about it."*

## La definición de skill, y la regla de qué va dónde

> *"skills are **packaged, composable information that Claude has the ability to pull into context
> whenever Claude realizes that it needs that information** to complete a particular task."*

> *"**Leave the system prompt only for the information that Claude needs in its mind, regardless
> of the task** you give it. Skills are fantastic for packaging information that Claude is going
> to need **some of the time, not all of the time**."*

Esa frase es el criterio entero, y es de una línea.

## Por qué primitivas y no herramientas a medida — el argumento estratégico

> *"whenever we build agents, we lean into the same primitives that we as humans have access to...
> With Claude Code we've just **given Claude access to a computer**. And this is really powerful
> because **this allows us to drop in better versions of Claude as we release new models, and
> Claude just uses those primitives better than it did before**."*

La analogía: *"imagine yourself after this conference compared to when you walked in — same tools
at your fingertips, but your brain's gonna be a little bigger, and you're gonna be more effective
using the same tools."*

**O sea: las primitivas no envejecen; una herramienta a medida sí.** Cada tool propia es deuda
que hay que volver a validar con cada modelo nuevo.

Y el ejemplo concreto: *"if you need Claude to look across the CSV, giving Claude a bash tool so
that Claude can write a quick Python script and reason across the results **is much more effective
than just uploading the entire CSV into Claude's context window**."*

## Lo que esto dice de NUESTRO CLAUDE.md

El taller describe el problema como *"stuffing requirement after requirement into my system
prompt"* hasta llegar a 400 líneas, y lo arregla dejando 15 y moviendo el resto a skills.

**Nuestro `CLAUDE.md` de proyecto es exactamente eso**: reglas de propuestas, de video, de
carriles, de git, del core, de cuándo separar un repo — todo cargado en cada sesión,
independientemente de la tarea. Por el criterio de arriba, la mayoría es información que hace
falta **algunas veces, no todas**: las reglas de propuestas no sirven de nada en una sesión de
video, y las de video no sirven en una de contabilidad.

Sale como **F3**. No lo toco acá: esta sesión reparte.
