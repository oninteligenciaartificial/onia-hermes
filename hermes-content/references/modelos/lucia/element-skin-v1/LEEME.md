# `lucia-skin-v1` — el ancla con 7 ángulos

**ID:** `58bbd635-9b90-4bd2-b08a-1cd4915bd563` · creado 2026-08-28

Nace de una pregunta de Sergio: *"¿por qué en elements de Lucía solo hay una foto? ¿no tiene
que haber la skin completa?"*. Verificado con `action: get`: el ancla anterior tenía
**exactamente una** — una selfie de espejo del baño. Con eso, el modelo inventaba el perfil,
el tres cuartos y las proporciones en cada generación.

## Las 7, y qué aporta cada una

| # | Archivo | Ángulo |
|---|---|---|
| 1 | `prueba-motor-20260813/C-elem-ancla-closeup.jpg` | Frontal canon — los tres rasgos sagrados juntos |
| 2 | `prueba-motor-20260813/D-elem-ancla-medio.jpg` | 3/4 medio, misma sesión que 1 (misma luz) |
| 3 | `prueba-realismo-20260815/r3-escritorio.png` | Casi frontal, 2400 px — la mejor densidad de pecas |
| 4 | `prueba-realismo-20260815/r2-calle.png` | Casi perfil — el único lateral con argolla visible |
| 5 | `tanda-20260821/L1b-rooftop-natural.png` | 3/4 izquierdo |
| 6 | `tanda-20260821/L6-copyspace.png` | 3/4 derecho |
| 7 | `tanda-20260821/BROLL-TEST/IMG-05-ugc-selfie.png` | Frontal 2752 px |

Las 7 salen de la lista blanca de [`../BANCO-OFICIAL.md`](../BANCO-OFICIAL.md) y **se miraron
una por una** antes de subirlas: pecas, argollas doradas, cadenita, piel de tono parejo.
Ninguna con la rojez del Soul descartado. Ver `_LAS-7-FOTOS.jpg`.

## La prueba, no la promesa

`_AB-viejo-vs-nuevo.jpg`: mismo prompt palabra por palabra, pidiendo **un perfil** — que es
justo lo que el ancla vieja no tenía. Contra la referencia canon:

- **Nuevo (7 fotos):** nariz recta de dorso fino y mandíbula angosta, como la referencia.
  Pecas finas en el pómulo.
- **Viejo (1 foto):** nariz más corta y respingada, mandíbula más redondeada, y manchas
  dispersas en vez de pecas. Derivó, porque tuvo que inventar el lateral.

## Dos trampas que costaron encontrar

1. **Un Element no se puede editar.** `action` sólo acepta `list` / `get` / `create`. Cambiar
   las fotos = crear uno nuevo + actualizar el UUID en los docs (se hizo en 8 archivos).
2. **`action: list` devuelve SOLO la primera media de cada element.** Un element de 7 fotos
   se ve como si tuviera 1. Verificar siempre con `get`.

## Pendiente de limpieza

Quedaron dos elements de prueba en el workspace, `ZZ-TEST-limite-medias` y
`ZZ-TEST-limite-33`, creados al sondear el límite. **El MCP no tiene `delete`**, así que hay
que borrarlos desde la web de Higgsfield.
