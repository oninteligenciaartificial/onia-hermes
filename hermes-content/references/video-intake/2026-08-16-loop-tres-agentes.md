# El loop, ahora con la forma concreta: planeador · ejecutador · evaluador

- **Video:** https://www.instagram.com/p/Dbt8cuwIqV1/ · 76 s
- **Carril:** B
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-Dbt8cuwIqV1.txt)) · 3 de 19 fotogramas
- **Veredicto: SIRVE YA.** Es la continuación del reel de loops que en la primera pasada
  despaché como humo y Sergio corrigió ([ficha original](2026-08-09-ai-loops-code-review.md)).

---

## Qué agrega respecto del anterior

El de agosto 9 decía *qué* es un loop. Este dice **cómo está armado**, y ahí está el valor:

> *"En un buen loop vas a tener diferentes inteligencias artificiales con **diferentes memorias,
> diferentes instrucciones, diferentes objetivos**."*

> *"Este es el loop que yo estoy usando actualmente y se compone de **tres agentes. Un planeador,
> un ejecutador y un evaluador**."*

> *"velo como un equipo de agentes que van a trabajar por un objetivo, se van a estar revisando,
> van a estar haciendo las correcciones **para que tú solo tengas que revisar el resultado**."*

La diferencia con "usá un code-reviewer" es la **separación de roles con memoria propia**. Un
solo agente que se revisa a sí mismo arrastra su propio sesgo: ya decidió que estaba bien cuando
lo escribió. Tres roles con contexto distinto no comparten ese sesgo.

## Lo que advierte, y hay que tomarlo en serio

> *"si no sabes diseñar un buen loop, esto te puede costar muy caro **porque los loops consumen
> muchos tokens**."*

Y atribuye la duración a terceros: *"pueden estar corriendo... horas, días o incluso semanas, lo
que dicen los ingenieros de Antropiq [Anthropic]"*. Eso es **AFIRMADO**, sin fuente citada. No se
repite como dato nuestro.

## Qué tenemos y qué no — contra el repo, no contra la memoria

| Pieza del loop | Estado real |
|---|---|
| Roles separados con instrucciones propias | **YA** — `.claude/agents/` tiene planner, code-reviewer, tdd-guide, y 9 subagentes ONIA |
| Un orquestador que los encadena y repite | **YA** — la herramienta `Workflow` hace `pipeline()` / `parallel()` y bucles `while` |
| Auto-evaluación antes de responder | **YA, escrito** — Gate 3 en `PROMPTS_POR_SESION.md` |
| **Un loop nombrado, guardado y reusable** que corra plan → ejecuta → evalúa → repite-hasta-verde | **NO EXISTE** |

Ahí está el hueco. No falta capacidad: falta **un artefacto guardado** en vez de rearmar el
mismo ciclo a mano en cada sesión. Es el mismo error que el propio Gate 3 nombra: *"un gate que
depende de acordarse no es un gate."*

## El diseño que sale de acá, aterrizado

```
planeador   → lee el objetivo y el "LISTO =", devuelve el plan y los criterios de aceptación
                (NO ve el código; su sesgo es el alcance, no la implementación)
ejecutador  → implementa contra ese plan
evaluador   → recibe SOLO el "LISTO =" + el diff, y responde aprobado / rechazado + por qué
                (NO ve el plan del planeador: si lo ve, hereda su justificación)
              rechazado → vuelve al ejecutador con el motivo. Cierra cuando una pasada completa
              no encuentra nada nuevo — no cuando se acabaron las vueltas.
```

**El tope de vueltas es obligatorio** por lo que el propio video advierte del costo. Sin tope,
un loop mal diseñado quema presupuesto sin avisar.

## Filtro 1

Cierra con *"comenta esta palabra y te lo mando"* — cebo. El diseño de tres roles ya está dicho
en cámara; no hace falta comentar. Fuente: **AFIRMADO** en lo de Anthropic, **VERIFICADO** en que
las piezas existen de nuestro lado (`.claude/agents/`, `Workflow`).

## A dónde va

| Sesión | Qué |
|---|---|
| **`pendiente`** (infra/harness) | guardar el loop de 3 roles como workflow reusable con tope de vueltas (prompt E4) |
