# Loops y grafos: dejar de vigilar agentes y aprobar sólo el último paso

- **Fuente:** https://x.com/hanakoxbt/status/2091515787366306154 · @hanakoxbt
- **Tipo:** SaaS / método · **Veredicto:** SIRVE YA
- **Cobertura:** el post completo, leído entero en el navegador. Sin video ni imágenes: es un ensayo de texto largo.
- **Publicado:** 23-ago-2026, 9:19. **678,8 mil reproducciones**, 966 marcadores.

> **Primer item del corpus que NO es de Instagram.** `yt-dlp` falló con 404 y encima resolvió un
> id distinto al pedido. Se leyó abriendo el post en el navegador. Queda anotado: para X, el
> camino es el navegador, no el bajador.

---

## Qué dice, textual

**La tesis, en dos frases:** *"A **loop** makes a unit of work correct without you. A **graph**
decides which units exist at all."* Y el diagnóstico de por qué nadie sale de la silla: *"almost
everyone builds only one of them"*.

### El loop es un check que puede fallar

> *"Strip everything else away and a loop is four parts: **produce, check, correct, repeat until
> green**. The check is the whole thing. Without something that can fail the work while you are
> out of the room, **you do not have a loop. You have a scheduler**."*

Y el error que nombra: *"They build the work, then bolt a review onto the end, and the review is
another model asked to look at the output. **Two optimists agreeing.**"*

La condición se escribe **primero**, y de forma que un programa pueda evaluarla:

```text
GREEN          the test suite exits 0
GREEN          every claim carries a source line
GREEN          the diff touches only files listed in the plan

NOT A CHECK    the output looks good
NOT A CHECK    the model says it is confident
NOT A CHECK    no errors were raised
```

> *"That last one catches careful people. **Absence of an error is not evidence of
> correctness.**"* Y la consecuencia: *"a system that confidently repeats a mistake until the
> budget runs out, with a clean log the whole way."*

### El techo del loop

> *"A loop makes one unit of work better. It **cannot decide which units exist**, or their order,
> or notice that two of the five steps never needed to wait for each other. So you get a very good
> agent running the wrong three steps, in the wrong order, one at a time. **Every step is correct.
> The result is still slow and still wrong-shaped.**"*

### El grafo es la capa de arriba

Nodo = una unidad de trabajo acotada, una entrada, una salida. Arista = una dependencia real.

> **El test que vale la pena copiar tal cual:** *"The mistake behind every unnecessary wait is
> treating **'and then'** as an edge. `Summarize the file` **and then** `check the weather` has no
> edge between them — the weather does not consume the summary. So run this on every arrow in a
> pipeline you already have: **does the next step actually read the previous step's output? If you
> cannot name the variable that crosses, there is no edge, and the wait is pure waste.**"*
>
> *"Most chains have two or three arrows like that, and finding them is usually the largest single
> speedup available."*

### Cuatro tipos de nodo, y uno no es un modelo

| Nodo | Qué hace | La trampa que nombra |
|---|---|---|
| **Splitter** | corta el trabajo en unidades, va al frente | *"decide more than any other node"*. Cortar un repo **por carpeta** hace que cuatro workers auditen los mismos tres archivos. Cortar **por radio de impacto** hace que cada uno vea algo que los otros no. |
| **Worker** | una unidad, **una lente, su propio contexto** | *"Give four auditors a shared window and they converge… **You paid four times for one opinion with three echoes.**"* |
| **Code node** | merge, ranking, dedupe, comparar | *"None of that is reasoning… **If you can describe the transformation without using the words judge, decide, assess or summarize, it is code.**"* Y: *"A graph where every edge is an agent pays rent on its own wiring."* |
| **Gate** | deja pasar o devuelve | ver abajo |

### Dónde vive cada cosa

> *"**The loop lives inside a node. The graph lives between them.**"* Dentro de una unidad:
> producir, chequear, corregir. Entre unidades: partir, abanicar, unir, gatear, devolver.
>
> *"A graph without loops in its nodes produces unverified work in parallel, **which is worse than
> serially because there is more of it**."*

### Los dos caminos de vuelta, y el que todos saltan

- **Arista de corrección** — corta. Un gate devuelve *una* unidad al paso que la produjo. Arregla
  la corrida en curso.
- **Arista de aprendizaje** — larga. Un resultado aceptado vuelve **al splitter** como restricción.
  Arregla todas las corridas siguientes.

> *"Almost everyone builds the first and skips the second. **The tell is a system that is fast and
> never gets smarter.**"*

Y no viaja la salida, viaja una **restricción**:

```text
ACCEPTED   utils slice ported, green on first pass
DERIVED    adapters preserve keyword args exactly
LANDS IN   the splitter's brief for every later slice
```

> *"Notice where it lands. **Not in the worker's instructions, in the brief that shapes how the
> work gets cut.**"*

### Devolvé la unidad, no el lote

> *"Four slices were ported. One fails its tests. If the whole batch goes back, **three correct
> slices get rewritten**. Their next version is different, not better, because nothing was wrong
> with them… **You converted one failure into four uncertain outcomes and paid for the privilege.**
> From the outside this looks like the model failing repeatedly. **It is a return path destroying
> correct work.**"*

Lo que viaja con una devolución:

```text
UNIT      handlers slice
VERDICT   red
REASON    test_auth_redirect failed
EVIDENCE  expected 302, got 200, handlers/auth.py:88
SCOPE     fix this file only, do not touch other slices
```

> *"The **scope** line matters more than it looks. Without it a returned unit grows: the agent
> opens the file, notices two adjacent issues, fixes those too, and your one-slice correction
> becomes a four-file diff nobody reviewed."*
>
> *"**Cap it at three attempts.** If a unit fails three corrections the problem is in the plan that
> produced it, and the loop cannot see the plan."*

### El gate abre por radio de impacto, no por confianza

> *"Most write-ups build a confidence score, set a threshold, and let anything above it through.
> **That is the wrong variable.** Confidence is the weakest input in that decision, for a reason
> that is easy to miss: **it is the only one the model can influence.**"*

| Carril | Qué entra | Cuándo abre |
|---|---|---|
| **Reversible y contenido** | cambio de copy, un test, una función aislada con cobertura | abre primero — *"one bad merge costs a revert"* |
| **Reversible pero ancho** | una utilidad compartida, un campo de schema, algo que tocan doce llamadores | checks deterministas + trayectoria limpia |
| **Difícil de revertir** | migraciones, borrados, escribir en datos de producción, **mover plata** | *"**This lane does not open, regardless of score.**"* |

> *"That third row is **not a threshold set very high. It is a lane that does not open**, and the
> distinction matters because **thresholds get adjusted and closed lanes do not**."*

Y el orden en que el gate lee la evidencia: resultados deterministas → trayectoria de esta corrida
→ cuántas veces se revirtió trabajo de ese nodo → **la autoevaluación del modelo, última**.

### Por dónde empezar

> *"**Build the gate first.** Everything gets easier once something can fail loudly, and a graph
> without a gate is just a faster way to produce unverified output."* Después los carriles. La
> arista de aprendizaje, al final.
>
> *"Put the human on **one** step, at the point of **highest consequence and lowest
> reversibility**. Approve the merge. Choose which fixes ship. **Not reviewing intermediate
> output.** A human in the middle of a graph becomes the slowest node in it, and the graph runs
> exactly as fast as a person reading things."*

**Las tres líneas de cierre:** *"Measure the path, not only the answer it landed on. A verdict that
does not change what runs next is a report. And any failure you do not turn into a permanent
constraint, you will meet again."*

---

## Cómo está hecho — la reconstrucción

- **Es un ensayo, no un hilo.** Un solo post largo, sin imágenes, sin video. La estructura es
  clásica: tesis en dos frases → el error común → el mecanismo → las trampas no obvias → por dónde
  empezar. Y cada sección termina en una frase citable.
- **El recurso que lo hace legible:** los bloques `GREEN` / `NOT A CHECK` y `ACCEPTED / DERIVED /
  LANDS IN`. Convierte abstracciones en algo que se puede copiar y pegar.
- **La mecánica de conversión:** el ensayo es gratis y completo — no gatea el contenido. Vende el
  curso de 20 lecciones (`agent-layers.vercel.app`) tres veces, y pide DM con la palabra `Graph`
  para la versión de una página. **Regala el qué, cobra el orden y las plantillas.**

### Esto describe, con nombre y apellido, los errores que cometí hoy

Y ese es el motivo real por el que esta ficha vale más que la mayoría:

| Lo que dice el post | Lo que pasó en esta sesión |
|---|---|
| *"the review is another model asked to look at the output — two optimists agreeing"* | El workflow de 18 fichas **no tenía gate**. El crítico corrió *después*, como paso final, no como condición que pudiera fallar. Encontró 8 fichas malas — pero recién cuando ya estaban escritas y pagadas. |
| *"Return the unit, not the batch"* | Acá **acerté sin saber por qué**: se rehicieron 8 fichas, no las 18. Si hubiera devuelto el lote entero, 10 fichas correctas se habrían reescrito distintas, no mejores. |
| *"If you cannot name the variable that crosses, there is no edge"* | Corrí descarga → fotogramas → transcripción **en serie** cuando la transcripción no consume los fotogramas. Eran dos nodos independientes encadenados por el orden en que los escribí. |
| *"one lens, in their own context"* | Esto sí estuvo bien: cada agente leyó **sólo su item**. |
| *"the learning edge lands in the splitter's brief"* | La segunda pasada le pasó a cada agente **su propio reproche**. Eso es arista de corrección, no de aprendizaje: no cambió cómo se parte el trabajo la próxima vez. |
| *"Absence of an error is not evidence of correctness"* | 25 de 26 transcripciones devolvieron `SIN_VOZ` sin error, y estaban **rotas**. La pista fue `duration=0`. |

## El estilo, como conocimiento portable

Sin estilo visual que copiar: es texto plano en X. Lo portable es el **formato de ensayo técnico**
— tesis en dos frases, una sección por mecanismo, bloques de texto monoespaciado como ejemplo
concreto, y una frase citable al cierre de cada sección. Y la mecánica comercial: **regalar el
ensayo completo y cobrar el orden**.

**Se porta a:** `hermes-content/references/ui-patterns/` no aplica. El método va a la skill de
orquestación y al módulo de agentes.

## Las tres preguntas

1. **Frente:** onia-platform / módulo de agentes — y de rebote, **cómo orquesto yo este carril**.
2. **Herramienta nuestra:** ONIA Center ya corre agentes por cron, y el carril usa workflows con
   fan-out. Lo que falta no es motor: **son los gates y la arista de aprendizaje.**
3. **Qué falta:** nada externo. Es método, no herramienta.

## Lo que NO se puede afirmar

- **Es una opinión bien argumentada, no un paper.** No hay datos, benchmarks ni fuentes. Vale por
  la calidad del razonamiento, no por evidencia.
- **El autor vende un curso.** El ensayo es real y completo, pero está diseñado para vender
  `agent-layers.vercel.app`. Nada de lo que dice está verificado por nosotros.
- **Dice "Four things travel with a return" y lista cinco** (`UNIT`, `VERDICT`, `REASON`,
  `EVIDENCE`, `SCOPE`). Tercer post de esta tanda con el número del gancho sin coincidir con el
  contenido.
- No hay video ni audio: no aplica transcripción.

**Prompt:** [T01](prompts-lote-2026-08-28/T01-loops-y-grafos-gates-y-arista-de-aprendizaje.md)
