# Plantilla de prompt para práctica de diseño — el molde de 7 puntos

> Sale del reel del bucle de práctica (síntesis lote 13, 2026-08-20). El hallazgo no es
> la herramienta: es CÓMO pide. Cada punto reemplaza un vicio nuestro conocido.
>
> El generador de briefs vive como Artifact: **Ruleta de Briefs**
> (https://claude.ai/code/artifact/d60172a6-3ff5-4d7e-b21d-9b8315ec4195) — sortea
> pantalla × rubro con los rubros reales de Onia y arma este prompt solo.

## El molde

```text
Quiero que me ayudes a crear [PANTALLA] para [RUBRO] en Bolivia.
1. Andá hacia lo que [PRODUCTO REAL] hace bien estéticamente: esa suavidad y ese
   cuidado tipográfico, con elementos mínimos.
2. Experiencia [móvil/escritorio], tema [claro/oscuro].
3. Colores donde [regla de color EN LENGUAJE HUMANO, no hex].
4. Escondé todo lo innecesario en cada paso: la jerarquía se logra sacando.
5. Una interacción concreta: [nombrarla — p.ej. "el elemento elegido se despliega
   para ver su detalle ahí mismo"].
6. Flujo de 2 o 3 pasos, no más.
7. Dame un prototipo lindo para previsualizarlo acá.
```

## Por qué cada punto (contra el vicio que corrige)

| # | Regla | El vicio que mata |
|---|---|---|
| 1 | **Producto real como referencia estética** ("lo que Uber hace bien"), no adjetivos | "Clean minimal", que es el nombre técnico de no elegir nada |
| 2 | Dispositivo y tema, dichos | El agente decide escritorio-oscuro por defecto |
| 3 | Color en lenguaje humano | Pegar hex ajenos sin retokenizar |
| 4 | Jerarquía **por sustracción** | Agregar badges/iconos para "dar jerarquía" |
| 5 | UNA interacción concreta, nombrada | Micro-animaciones decorativas por todos lados |
| 6 | Flujo acotado a 2-3 pasos | La pantalla que quiere hacer todo |
| 7 | Prototipo previsualizable | Entregar descripción en vez de cosa que se mira |

## El bucle completo (no es solo el prompt)

1. **Sortear** el brief en la Ruleta (o "Modo loco" para una restricción rara).
2. **Referencia ANTES de diseñar**: un caso de estudio del líder del rubro + tablero
   de referencias. Sin este paso el resultado sale genérico aunque el prompt sea bueno.
3. Cargar `impeccable` + `web-design-guidelines` **antes** de generar.
4. Generar con el molde.
5. Juzgar con `ui-ux-pro-max` contra las **≥4 Required Qualities** de
   `~/.claude/rules/web/design-quality.md`. Si no las pasa, **no entra a la galería** —
   se itera o se tira.
6. Lo que pasa, entra a
   `data/references/design-sources/gallery-examples/` con nota de qué ley aplicó.

Esto es entrenamiento y banco de referencias, **no prioridad de venta**: si hay algo de
web-factory que convierte pendiente, va primero.
