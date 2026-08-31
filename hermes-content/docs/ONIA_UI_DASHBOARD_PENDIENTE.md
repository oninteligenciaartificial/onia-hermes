# Pendiente — subir el nivel visual del producto

**Pedido de Sergio, 2026-08-29**, mirando el dashboard:

> *"hay diseños que los veo muy simples y que no tienen animación, hay tipografías que no
> me gustan y colores que no me gustan. Tiene que mantener el color Onia."*

No es un rediseño de marca: la marca está bien. Es que el producto se quedó en "funciona"
y nunca pasó a "se ve caro".

---

## Lo que YA está hecho (no rehacer)

Verificado en `app/globals.css` el 2026-08-29:

- ✅ **La paleta Onia existe y es token.** `--color-verde-50` (#EDFBF3) a `--color-verde-900`
  (#013925), con **#027650** como `verde-600`. Ya se hizo la pasada que unificó
  `green-*`/`emerald-*` de Tailwind con la escala Onia, así que no se pueden volver a
  mezclar sin querer.
- ✅ **La tipografía ya es la de marca**: Archivo para todo, Geist Mono para
  micro-etiquetas. Antes eran Manrope + Inter por `@import` a Google Fonts.

## Lo que falta, medido

- 🔴 **Casi no hay movimiento.** Sólo **9 archivos** de todo `app/` + `components/` tienen
  algo de animación (`framer-motion`, `gsap`, `@keyframes` o `animate-`). Para un producto
  entero eso es nada: el sistema se siente estático.
- 🔶 **Los diseños son planos.** Sin profundidad, sin jerarquía por escala, sin composición.
  Es el "card grid uniforme" que la propia regla de diseño del repo prohíbe.
- 🔶 **Tipografías y colores que no le gustan a Sergio.** Esto es subjetivo y **no se
  resuelve adivinando**: la tarea arranca mostrándole opciones renderizadas, no cambiando
  cosas y esperando que acierte.

## El límite duro

**El verde Onia no se toca.** La paleta de `globals.css` es el piso; lo que se agregue
(neutros, acentos, superficies, sombras) tiene que convivir con ella, no reemplazarla.

## Material que ya existe — usarlo, no reinventar

| Qué | Dónde |
|---|---|
| Galería de patrones (11) — incluye `paletas-lujo`, `panel-claro-premium`, `sidebar-nav` | `hermes-content/references/ui-patterns/` |
| Banco de patrones de movimiento (28 secciones) | `web-factory/docs/MOTION_PATTERN_BANK_2026.md` |
| Skill de calidad visual | `.agents/skills/impeccable/` |
| Reglas anti-template y las 10 Required Qualities | reglas globales, `web/design-quality.md` |

La regla del repo es explícita: **cargar `impeccable` + la galería ANTES de codear UI**, y
exigir ≥4 de las Required Qualities. No shippear mediocre para iterar.

## Cómo se ejecuta, sin repetir el error del 2026-08-20

Ese día se rediseñó la landing entera y Sergio la rechazó al verla — hubo que revertir en
producción. La lección quedó escrita: **construir y publicar son dos permisos distintos, y
una superficie viva no se reemplaza sin que Sergio VEA la pieza terminada.**

Entonces:

1. **Primero preguntar qué NO le gusta**, con capturas de las pantallas actuales al lado.
   "Tipografías que no me gustan" es un síntoma; hace falta saber cuál y en qué pantalla.
2. **Elegir una dirección explícita** de la lista de direcciones válidas (editorial, dark
   luxury, bento, Swiss…). Nada de "limpio y minimalista", que es no elegir.
3. **Una pantalla piloto**, renderizada y mostrada, antes de tocar las otras. La candidata
   natural es el **dashboard**, que es lo que él estaba mirando cuando lo pidió.
4. Recién con el OK sobre ESA pieza, propagar. Los tokens se arreglan una vez y las heredan
   todas — cero pantallas redibujadas a mano.
5. **Movimiento**: sólo propiedades que no disparan layout (`transform`, `opacity`,
   `clip-path`). Y respetar `prefers-reduced-motion`.

## Definición de hecho

El dashboard abierto en el navegador y **mirado**, no un check verde: con jerarquía por
escala, movimiento que aclara el flujo, estados de hover/focus que se sienten diseñados, y
el verde Onia intacto. Con el OK explícito de Sergio sobre esa captura.
