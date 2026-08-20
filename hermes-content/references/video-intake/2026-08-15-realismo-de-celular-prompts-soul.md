# Realismo de celular — la anatomía del prompt que NO busca cine

- **Fuente:** https://www.instagram.com/p/DZIxrQ9kR-N/ · carrusel de **20 láminas** · español
  (autor `@imjay_ai`, el mismo del carrusel de anclas de identidad)
- **Visto:** 2026-08-15 — caption íntegro + láminas leídas con visión propia. Sin Gemini.
- **Cobertura:** caption completo + 1 de 20 láminas leída a fondo (trae el prompt entero)

## La tesis, textual

> *"El error de muchos creadores es pensar que cuanto más cinematográfico, más real. Yo diría
> justo lo contrario. Las imágenes que más reales parecen son las fotos hechas con el móvil,
> estilo iPhone, escena cotidiana e improvisada."*

Y a diferencia de casi todo el corpus, **no gatea nada**: las 20 láminas traen los prompts
completos, cada uno junto a la imagen que produjo.

## La anatomía del prompt, sacada de una lámina completa

El ejemplo: dos jóvenes tomando cerveza en la tribuna de un estadio, de noche. Once bloques,
en este orden:

| # | Bloque | Ejemplo textual |
|---|---|---|
| 1 | Encuadre y ángulo | *"slightly high-angle wide close-up shot"* |
| 2 | Sujetos, descripción física | pelo, edad aproximada, posición en el cuadro |
| 3 | Vestuario **con marca visible** | *"black jacket with a Carhartt logo patch, zipped up"* |
| 4 | Acción, y **qué oculta** | *"drinking from transparent pint cups... partially obscuring their lower faces"* |
| 5 | Entorno poblado, con variedad | *"people of varied ages and genders... some sitting, others standing, on concrete bleachers"* |
| 6 | Contexto de fondo que fecha la escena | *"a lush green soccer pitch glimpsed, illuminated signage and a dark sky, suggesting a night event"* |
| 7 | **La luz descrita como DEFECTO** | *"strong highlights and washed-out tones"* |
| 8 | **La firma óptica del celular** | *"minor chromatic aberration at the image edges, characteristic of a modern smartphone camera with a slightly wide lens"* |
| 9 | Paleta en palabras | *"predominantly cool—blues, grays and greens... contrasted by warm skin tones"* |
| 10 | Mood | *"lively, festive, sociable"* |
| 11 | **HEX VALUES explícitos** | `["#0a0e19", "#1c2531", "#313843", "#4b5259", "#efcab2", "#938b80", …]` — 13 colores |

## Veredicto: SIRVE YA — es la pieza que le faltaba al problema de Lucía

Los bloques **7, 8 y 11 son los que no teníamos**, y son justamente los que producen realismo:

**El defecto óptico se nombra, no se evita.** *"Aberración cromática en los bordes"*, *"altas
luces quemadas"*, *"lente ligeramente ancho"*. Un prompt que pide belleza produce esa piel de
plástico que ya identificamos; uno que pide los defectos de una cámara de celular produce una
foto que parece tomada, no generada.

**La paleta va como lista de valores hex.** Trece colores explícitos en vez de adjetivos. Es un
control mucho más fino que "tonos fríos", y es gratis de agregar a cualquier prompt.

**Lo que oculta la cara importa.** El vaso tapando la mitad inferior del rostro no es casualidad:
oclusión parcial = menos superficie donde el modelo puede fallar, y más sensación de instantánea.

Sumado al [carrusel de anclas](2026-08-15-bloquear-identidad-avatar-anclas.md) del mismo autor,
queda el método completo: **anclas de identidad** (quién es) + **realismo de celular** (cómo se
ve la foto).

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| INFLUENCERS IA / Lucía | Reescribir el brief de imagen con los 11 bloques, especialmente 7, 8 y 11. Es imagen: ~0,12 cr la prueba |
| INFLUENCERS IA | Definir la **paleta hex fija de Lucía** — 10-13 valores que vayan en todos sus prompts. Hoy no existe y es lo que daría coherencia de feed |
| Calidad | Volver a mirar las piezas que "se ven muy IA" con esta vara: probablemente les falta defecto, no calidad |

## Riesgo

**No comentar "Soul" para pedir los prompts.** No hace falta: están en las láminas y ya están
extraídos acá.

Y el de siempre: se toma la **estructura de once bloques**, no las escenas ni el personaje del
autor. Sus prompts describen a su avatar; los nuestros describen a Lucía.
