# Lo que cuesta analizar un lote, y cómo bajarlo

**2026-08-23.** Sergio cortó un lote a mitad de camino preguntando *"¿por qué tantos tokens?"*.
Tenía razón en preguntar, y el número explica por qué.

---

## Lo medido

| Tanda | Agentes | Tokens |
|---|---|---|
| 18 fichas + crítico | 19 | **3,20 M** |
| 8 fichas rehechas con audio | 8 | **2,00 M** |
| 32 fichas (cortada a los 15) | 33 | iba a ~4–5 M |

## De dónde sale el costo: **son las imágenes, no el texto**

Cada agente lee entre **30 y 50 fotogramas JPEG a 1080px**. Una imagen así cuesta del orden de
**1.000–1.500 tokens**. Cuarenta fotogramas son **~50.000 tokens por agente sólo en mirar**, antes
de razonar o escribir una línea.

El prompt del método, la ficha y el prompt repartible juntos son calderilla al lado.

Factor agravante: la sesión corría con **ultracode** encendido, que instruye a ser exhaustivo sin
mirar el costo. No es excusa — es el dato que faltaba para entender el número.

---

## El abaratamiento, aplicado

En [`preparar.sh`](../../../.claude/skills/sacar-prompt/scripts/preparar.sh), dos cambios:

1. **Fotogramas a 640px** en vez de 1080. El texto en pantalla de un reel vertical se lee
   perfecto a 640; el costo por imagen baja a cerca de un tercio.
2. **3 ventanas densas en vez de 5** → ~24 fotogramas densos en vez de 40. El muestreo por
   densidad ya ordena por dónde hay texto: las últimas dos ventanas casi nunca aportan.

Juntos: **un lote de 32 pasa de ~4–5 M a ~1 M.**

Si algún día hace falta leer letra chica de verdad, se sube la escala **para ese video**, no para
todos.

## Lo que NO se recortó, y por qué

- **La pasada de corrección.** Costó 2,00 M y encontró que la mascota de un reel no era generada
  por IA (con lo que un bloqueo de gasto inventado desapareció) y que una medición mía de cortes
  estaba mal hecha. Se paga cuando el lote va a alimentar decisiones; no en cada lote.
- **El crítico de completitud.** Es un agente, no treinta. Barato y es lo que encuentra que
  "18 de 18 SIRVE YA" no está filtrando nada.

## Las dos palancas que quedan sin usar

- **Gemini nativo** (`gemini-see-video.mjs`): una llamada mira el video entero — imagen, audio y
  texto con timeline. Sale mucho más barato que 40 imágenes. El 23-ago la cuota gratis se agotó a
  los 8 videos; repartido en el tiempo, cubre un lote entero.
- **Triaje por caption antes de mirar nada.** Ya se probó: de 93 posts cosechados quedaron 32.
  Los 61 descartados no costaron un solo fotograma. **Ésta es la palanca más grande y ya está en
  uso.**
