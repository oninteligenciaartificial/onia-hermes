# Checkout por visión: detecta el producto, decodifica el código y arma el recibo solo

- **Fuente:** https://www.instagram.com/p/DcRflPJDLhG/ · @suprapixel
- **Tipo:** SaaS · **Veredicto:** SIRVE YA
- **Cobertura:** 15 de 29 fotogramas (5 base + 10 densos). Duración 84,6 s, **0 cortes medidos** con ffmpeg. Sin transcripción.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Rótulo fijo todo el video:** `AI Barcode Detection and Product Recognition System`.
- **Sobre cada producto:** caja de detección con `ID: 0041 | Conf: 98.2%` y `Product: Juice (Brand A)`. Otros leídos: `Conf: 99.1% · Product: Cereal (Brand B)`, `Product: Soup (Brand C)`, `Product: Apple`, `Product: Chips`.
- **Al pasar el código de barras:** lupa circular que lo amplía y muestra el número decodificado (`0 09253 00553` en varios cuadros).
- **Panel derecho:** `CHECKOUT ANALYTICS HUD` — un recibo que se va llenando línea por línea con producto y precio, y un `Total price` que sube. Se leen ítems y un total en torno a `$59.99`.
- **Caption:** *"detecting and identifying products in real time as they move past a scanner, decoding each barcode, matching it to a product name and price, and building a live receipt"*. Y declara que son **dos capacidades distintas trabajando juntas**: detección/clasificación visual del producto, y lectura del código.

## Cómo está hecho — la reconstrucción

- **La máquina de estados:** producto entra al campo → detectado y clasificado (con confianza) → se busca el código de barras dentro del recorte → se decodifica → se matchea contra catálogo (nombre + precio) → se agrega línea al recibo → se recalcula total.
- **Las entidades:** producto (con código, nombre, precio, marca), detección (id, confianza, bbox), línea de recibo, recibo, total.
- **El truco de producto, no de modelo:** la clasificación visual sola no distingue dos marcas del mismo envase; el código de barras sí pero necesita estar visible. Combinar las dos es lo que lo hace usable: la visión encuentra DÓNDE mirar, el código dice QUÉ es.
- **Contra nuestro core:** producto con stock y precio ya existe. Lo que no existe es la entidad "detección" ni el flujo de caja por visión.

## El estilo, como conocimiento portable

Fondo de código desenfocado en verde sobre negro (decorativo, no legible — es textura, no información). Rótulo en **verde `#39FF7A`** con sombra, tres líneas centradas arriba. Cajas de detección en **amarillo `#FFD400`** y la activa en **rojo**, con etiqueta chica arriba de la caja. Recibo en panel blanco a la derecha, tipografía monoespaciada. Lupa circular con borde amarillo para el zoom al código.

**Se porta a:** El patrón de UI "HUD de detección + recibo en vivo" a `hermes-content/references/ui-patterns/`. El fondo de código decorativo NO se copia: es relleno.

## Las tres preguntas

1. **Frente:** onia-platform / onia-core — rubro comercio.
2. **Herramienta nuestra:** ONIA Core tiene producto, stock y precio. La capa de visión no existe.
3. **Qué falta:** Una decisión, no una credencial: si el rubro comercio quiere caja por visión o le alcanza con lector de código. Es un salto grande de alcance.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q07](prompts-lote-2026-08-24/Q07-checkout-por-vision-recibo-en-vivo.md)
