# AI Loops + `/code-review` como auto-verificación

- **Fuente:** https://www.instagram.com/p/DbyhC0csyaB/ · 74 s · español
- **Visto:** 2026-08-09 (Gemini nativo)
- **Archivo:** `Instagram-DbyhC0csyaB.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-09-ai-loops-code-review.md](transcripciones/2026-08-09-ai-loops-code-review.md)

## Qué dice realmente

Creadora a cámara con diagrama superpuesto. El bucle que plantea:

```
TÚ DAS LA TAREA + OBJETIVO
  → LA IA HACE LA TAREA
  → VERIFICA SI CUMPLE EL OBJETIVO
  → CORRIGE LOS ERRORES Y VUELVE A INTENTAR
  → RESPUESTA FINAL
```

Argumento: la mayoría escribe prompt → revisa → ajusta prompt → reintenta, *"aprobando y
aprobando"*. Un AI loop en cambio le da a la IA **un objetivo + cómo evaluarse a sí misma**,
y la deja iterar antes de devolver.

Tip concreto (00:49-01:07): *"pídele que haga un `/code-review` de tu propio código antes de
darte una respuesta final"*. En pantalla se ve Claude Code con `/code-review`, `/doctor`,
`/simplify` y `Running in the background as @code-review`.

CTA: comentar `loop` → guía por DM.

## Veredicto: HUMO PARCIAL — el "secreto" es un comando que ya viene incluido

Es contenido de divulgación bien armado, pero vende como método propio algo que es
funcionalidad nativa de Claude Code. Nosotros ya operamos así: subagente `code-reviewer`,
gates antes de mergear a `main`, `tsc --noEmit`, `verification-before-completion`.

Dicho eso, hay **un hueco real que el video señala sin querer**: nuestros gates son
*reglas escritas en CLAUDE.md que dependen de que el agente se acuerde*, no un paso
forzado por el harness. El único hook automático que corre es el `Stop` de autosync. Si el
agente se olvida del review, nadie lo frena.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Harness / agentes ONIA | Evaluar un hook que corra la verificación antes de cerrar, en vez de confiar en la regla escrita. Pendiente, **no** para esta sesión |
| Contenido ONIA | El formato sí sirve: explicación técnica de 60-70 s con diagrama animado + captura real de terminal + CTA a DM. Es el molde exacto para hablarle al comprador técnico |

## Riesgo

Copiar el contenido tal cual nos pondría a vender humo igual que ella. Si ONIA publica
sobre loops, que sea mostrando **nuestro** pipeline real corriendo, no un diagrama genérico.


---

# CORRECCION 2026-08-15 — el veredicto estaba mal. Es el más importante del corpus.

Sergio: *"el más importante es el del loop"*. Tiene razón, y lo escribo con la evidencia
de esta misma sesión, que es lo que me faltaba cuando lo despaché como HUMO PARCIAL.

## Por qué lo descarté, y por qué ese razonamiento era pobre

Escribí: *"vende como método propio algo que es funcionalidad nativa de Claude Code... nosotros
ya operamos así: subagente code-reviewer, gates antes de mergear, verification-before-completion"*.

Todo eso es cierto **y no importa**. Que la herramienta exista no significa que el loop esté
corriendo. Confundí *tener el comando* con *tener el hábito*.

## La evidencia: los errores de esta sesión, todos del mismo tipo

En una sola sesión, con todos esos gates "ya escritos", entregué:

| Error | Qué habría bastado |
|---|---|
| Un prompt que mandaba a cerrar la seguridad de producción, **ya cerrada y verificada días antes** | mirar la memoria antes de escribirlo |
| Dos "bloqueos" que no existían: los SFX estaban en otra carpeta, la voz no era ambigua sino un ID truncado | un `ls` y una consulta gratis |
| Dije que un prompt **se había perdido en un rebase** — nunca se perdió: leí el repo desde otra rama | mirar `git branch --show-current` del árbol que estaba leyendo |
| Escribí en el árbol de trabajo de **otra rama ajena**, dejándoselo sucio | verificar la ruta antes de escribir |
| Marqué 40% del corpus como humo midiéndolo con la vara equivocada | preguntarme qué estaba midiendo |

**Cinco entregas sin auto-verificación previa.** No falló el conocimiento: en todos los casos
el dato correcto estaba a una consulta de distancia. Falló que no me detuve a comprobar mi
propio trabajo antes de darlo por bueno.

Eso es exactamente lo que el video propone y yo desestimé:

> *"Un AI loop consiste en darle a la IA un objetivo, decirle cómo evaluar su propio trabajo, y
> permitirle mejorar por sí sola antes de darte una respuesta."*

> *"Cuando le vayas a enviar el prompt con el loop a tu agente, pedile que haga un code review
> de su propio código **antes** de darte una respuesta final."*

## Veredicto corregido: SIRVE YA

Lo que aporta no es el comando `/code-review` —eso ya lo teníamos— sino **la posición del
control**: la verificación va ANTES de responder, no después de que el humano encuentre el
error. Nuestros gates viven en documentos que dependen de que alguien se acuerde de leerlos.

**Un gate que depende de la memoria no es un gate.**

| Frente | Acción |
|---|---|
| TODAS las sesiones | El loop entra como Gate 3 del preámbulo de `PROMPTS_POR_SESION.md`: auto-evaluación contra el `LISTO =` antes de dar por terminado |
| harness | Evaluar un hook que lo fuerce, en vez de confiar en la regla escrita. Sigue pendiente y ahora con razón documentada |

## Lo que sigue siendo cierto de mi análisis original

El video **sí** gatea su guía tras un cebo de comentario, y **sí** presenta como método propio
algo que la herramienta ya trae. Eso no cambia. Lo que cambia es que la idea de fondo —cerrar el
loop antes de entregar— es correcta y nosotros no la estábamos aplicando, por más que la
tuviéramos escrita.
