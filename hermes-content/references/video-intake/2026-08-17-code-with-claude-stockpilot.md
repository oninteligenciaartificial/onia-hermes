# Code w/ Claude — StockPilot: 12 herramientas → 5 skills, 30× más barato

- **Video:** https://x.com/0xrafy/status/2089395090506633621 · **44 min** (no es un reel)
- **Qué es:** taller *stockpilot-workshop* en **Code w/ Claude**, la conferencia de Anthropic.
  Ponente en escenario con el logo de Anthropic detrás.
- **Carril:** B (idea), **nivel de fuente: PRIMERA PARTE** — es Anthropic hablando de sus
  propias herramientas, con números medidos en pantalla.
- **Cobertura real:** leído por fotograma **9 de 15 muestras** (1 cada 3 min). **El audio está
  en transcripción y todavía NO lo leí** — todo lo de abajo sale de lo que se ve escrito en
  pantalla, que en este video es casi todo, porque es una terminal.
- **Veredicto: SIRVE YA — es el hallazgo más aplicable de todo el corpus**

---

## La conclusión, en una lámina

> ### One agent. Five skills. Subagents only when a skill says so.

| 15 | 5 | 0 | 92% |
|---|---|---|---|
| líneas de system prompt | skills (cargadas **bajo demanda**) | subagentes hardcodeados | eval score (11/12) |

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

- **No leí el audio todavía.** 18 chunks en transcripción; puede haber matices que los
  fotogramas no muestran, sobre todo en el porqué de cada decisión.
- **Claude Managed Agents (CMA)** es la plataforma del taller. **No verifiqué si la tenemos
  disponible ni qué cuesta.** Los principios son portables a `.claude/agents/` + skills; la
  primitiva `callable_agents` puede no serlo.
- El eval score de 92% es de **su** caso (inventario), no una promesa transferible.

## A dónde va

| Sesión | Qué |
|---|---|
| **`pendiente`** (harness) | **F1** — auditar los 11 agentes contra los 3 antipatrones · y E4 corregido |
| **`onia-plattform`** | **F2** — evals con tareas y graders para el agente que más corre |
