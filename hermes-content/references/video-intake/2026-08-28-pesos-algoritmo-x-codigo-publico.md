# Los pesos reales del algoritmo de X, leídos de su código público

- **Fuente:** https://www.instagram.com/p/DcE8336Ixby/ · @sanmunoz.ia
- **Tipo:** MARKETING · **Veredicto:** SIRVE YA
- **Cobertura:** 16 de 61 fotogramas (6 base + 10 densos). Duración 74,6 s, 5 cortes medidos. Sin transcripción.
- **Medido:** 74,6 s · 5 cortes (ffmpeg, umbral 0,3).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Rótulo:** *"así te haces **VIRAL** en `X`"*. **Caption:** *"Claude analizó el algoritmo de twitter y esto encontró"*.
- **La fuente en pantalla:** `el código de X · 2.814 archivos`, repo `xai-org / x-algorithm`.
- **El código mostrado:** `fn rank_post(p: &Post) { score += 20.0 * p.copy_link; score -= 234.0 * p.reports; }`
- **Y la tabla completa — `lo que puntúa el algoritmo`, con su peso:**
| Acción | Peso |
|---|---|
| **copiar el link** | **20.0** |
| reply (comentar) | 5.0 |
| compartir por DM | 5.0 |
| quote al tweet | 5.0 |
| retweet | 1.0 |
| like | 0.5 |
- **Y el castigo:** un **report resta 234.0** — más de diez veces lo que suma copiar el link.
- **Prueba mostrada:** un tweet propio (`@sanmunoz.ia`, *"le pasé el algoritmo de X a una IA y esto encontré"*) con 214 · 1.2K · 3.4K y el botón `enlace copiado`.

## Cómo está hecho — la reconstrucción

- **El hallazgo, en una línea:** copiar el link vale **40 veces un like** y 4 veces un comentario. La acción que más puntúa es la que nadie pide.
- **Consecuencia práctica para nuestro contenido en X:** el CTA no es "dale like" ni "retuiteá" — es **"copiá el link y mandáselo a alguien"**. Y compartir por DM vale lo mismo que comentar.
- **El castigo cambia la estrategia de riesgo:** −234 por report significa que un solo contenido que moleste borra el efecto de once links copiados. Contenido polémico en X sale carísimo.
- **Esto cierra un pendiente viejo del corpus:** había un prompt sobre leer `xai-org/x-algorithm` que quedó `SIN EVIDENCIA` porque nadie lo abrió. Acá están los pesos, aunque de segunda mano.
- ⚠️ **Lo que NO está verificado:** estos números salen de una captura, no de haber abierto el repo. **Antes de construir estrategia sobre ellos hay que confirmarlos contra el código real.** El repo es público, así que es barato.

## El estilo, como conocimiento portable

Tres registros que se alternan: talking-head en habitación cálida con micrófono rojo y **tarjetas de UI oscuras flotando** al lado de la cara; escenas a pantalla completa con un **grafo de nodos naranja sobre negro** y karaoke palabra por palabra en blanco con las palabras clave en **naranja `#FF6B2C`**; y un split donde la tabla ocupa arriba y la cara abajo. Una lámina de transición en blanco con manchas difusas azul y naranja. El naranja es el único color saturado y sólo toca los datos.

**Se porta a:** El patrón "tarjeta de UI flotando junto a la cara" al banco de motion; el resto ya está cubierto.

## Las tres preguntas

1. **Frente:** marketing / contenido — canal X, que hoy no usamos.
2. **Herramienta nuestra:** Ninguna hace falta. Es una decisión de CTA.
3. **Qué falta:** Verificar los pesos contra el repo público antes de construir nada encima.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R03](prompts-lote-2026-08-28/R03-pesos-algoritmo-x-codigo-publico.md)
