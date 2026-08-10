# AI Loops + `/code-review` como auto-verificación

- **Fuente:** https://www.instagram.com/p/DbyhC0csyaB/ · 74 s · español
- **Visto:** 2026-08-09 (Gemini nativo)
- **Archivo:** `Instagram-DbyhC0csyaB.mp4` (no versionado)

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
