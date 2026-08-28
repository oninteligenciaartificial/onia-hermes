# UGC sintético con producto real: una foto de persona más una del producto

- **Fuente:** https://www.instagram.com/p/Dcizfw5MI0h/ · @no se dice en pantalla
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** 16 de 40 fotogramas (6 base + 10 densos). Duración 31,2 s, 4 cortes medidos. Sin transcripción.
- **Medido:** 31,2 s · 4 cortes (ffmpeg, umbral 0,3).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Caption:** *"Comenta «QUIERO» y te paso el método completo y el prompt. **Una marca pagaba 4.000€ por un shooting.** Localización, modelo, fotógrafo, equipo, dos días de rodaje y tres semanas de espera. **Hoy eso son cuatro horas y una tarde de trabajo.**"*
- **El overlay que es el hallazgo:** en **todos** los fotogramas, abajo al centro, van dos miniaturas con un `+` entre ellas — **la foto de la persona** y **la foto del producto** (`Bloom clear protein`, bolsa rosa). El insumo del método se muestra encima del resultado, durante todo el video.
- **El resultado:** una mujer sintética en cocina y sala, hablando a cámara, gesticulando, y **sosteniendo la bolsa real del producto** con el packaging legible (`Bloom clear protein`, `20g`).
- **Karaoke palabra por palabra** en blanco, centro-bajo: fragmentos leídos — `Vamos, de` · `imposible` · `levantar para` · `movimiento` · `incluso coger` · `cámara para` · `que veas que` · `imposible` · `distinguirlo` · `tenga por` · `aquí y` · `venderlo como` · `si nada.`
- **Cierre:** collage de fotos con más ejemplos (familia, POV, otra persona con un producto rojo).

## Cómo está hecho — la reconstrucción

- **La receta declarada, en dos insumos:** una foto de la persona + una foto del producto. Eso es todo lo que el overlay muestra, y es lo que hace el post creíble: no promete magia, muestra la entrada.
- **El argumento de venta está en el caption y es un número:** 4.000 € y tres semanas contra cuatro horas. No vende "IA": vende que el shooting desaparece.
- **Lo que resuelve, y es lo difícil:** la persona sintética sostiene el producto **real** con el packaging legible. Ahí es donde fallan la mayoría de los intentos — el logo se deforma o el envase se inventa.
- **Contra lo nuestro:** tenemos Higgsfield ULTRA con créditos, `seedance_2_0` verificado en catálogo con `image_references`, y un esquema de consistencia de cara para Lucía. **La capacidad está; falta el molde de dos insumos aplicado a un producto de cliente.**
- **Lo que NO se puede afirmar:** con qué modelo exacto se generó. El post no lo dice y el overlay tampoco.

## El estilo, como conocimiento portable

UGC crudo deliberado: cámara en mano, sobreexposición, piel brillante, plano muy cerca de la cara alternado con plano medio en cocina. Karaoke palabra por palabra en blanco sin caja, centro-bajo, a corte duro. **El overlay de las dos miniaturas con el `+` no se mueve nunca** — es un ancla fija durante los 31 s. Paleta: rosa del packaging contra beige y madera del ambiente; el producto es lo único saturado del cuadro.

**Se porta a:** Patrón nuevo al banco: **"mostrar el insumo sobre el resultado"** — la prueba del método como overlay permanente. Sirve para cualquier demo nuestra.

## Las tres preguntas

1. **Frente:** INFLUENCERS IA — y directamente aplicable a productos de clientes del rubro comercio.
2. **Herramienta nuestra:** Higgsfield (`seedance_2_0` verificado en catálogo, acepta `image_references`) + el esquema de consistencia de cara ya documentado.
3. **Qué falta:** Un producto real con el que probar. Y generar video es gasto: permiso explícito caso por caso, cotizado antes.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R07](prompts-lote-2026-08-28/R07-ugc-sintetico-persona-mas-producto.md)
