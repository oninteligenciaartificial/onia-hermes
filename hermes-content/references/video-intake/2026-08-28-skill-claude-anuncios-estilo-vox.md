# Un skill de Claude que hace anuncios estilo Vox desde la foto del producto

- **Fuente:** https://www.instagram.com/p/Dci8bI6MPnz/ · @no se dice en pantalla
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** 16 de 32 fotogramas (8 base + 10 densos). Duración 15,1 s, **0 cortes medidos**. Sin transcripción.
- **Medido:** 15,07 s · 0 cortes (ffmpeg, umbral 0,3).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **El texto del video, literal, línea por línea:**
- *"I just built a **Claude skill** that makes **VOX-style ads** from your **product picture ONLY**."*
- *"Vox-style is one of the **highest-performing ad formats** right now on **Meta and Google**."*
- *"All you need is to **upload your product**."*
- *"And you get a finished animated ad **in seconds**."*
- **CTA:** *"Comment **\"VOX\"** and I'll send it to you."* (coincide con el caption).
- **La cadena de insumos, mostrada arriba en todos los cuadros:** foto de la botella `+` anuncio de referencia `+` icono de gráfico `+` icono de app.
- **Los anuncios generados (estilo fritz-kola):** `HAMBURG, 2003` sobre un **mapa vintage** con flechas rojas dibujadas a mano señalando un punto circulado y fotos de los fundadores · `330ml GLASS BOTTLE` como **plano técnico acotado** · `MORE CAFFEINE. MORE KICK. 25mg/100ml` con **gráfico de barras** comparando `STANDARD COLA ~8mg` contra `FRUZZ-KOLA ~5mg` · `DRINK FROM GLASS.` sobre **papel rasgado verde ácido** con sellos `NO PLASTIC`.

## Cómo está hecho — la reconstrucción

- **Qué es el "estilo Vox":** anuncio editorial-infográfico. En vez de foto bonita de producto, usa los recursos del periodismo explicativo — mapas anotados, planos técnicos acotados, gráficos de barras comparativos, sellos, papel rasgado, flechas a mano. **Parece un artículo, no un anuncio.** Es el mismo mecanismo que los cuatro moldes de `DbtVtpmT3ZU`: robarle la forma a algo que el usuario consume sin defensas.
- **Y es un skill de Claude**, o sea nuestro propio stack. No hay que aprender una herramienta nueva.
- **El insumo declarado es uno solo: la foto del producto.** Si eso es cierto, es el flujo más corto de todo el corpus para producir un estático.
- ⚠️ **Lo que NO se verifica y hay que verificar antes de creerle:** (1) que el skill sea público y descargable — el CTA lo gatea detrás de un comentario; (2) la afirmación *"uno de los formatos de mejor rendimiento en Meta y Google"* **no trae fuente**; (3) los anuncios mostrados son de una marca real (fritz-kola) con dirección de arte propia — no está claro cuánto puso el skill y cuánto ya existía.

## El estilo, como conocimiento portable

Alterna dos capas sin un solo corte: los anuncios generados **a pantalla completa sobre fondo negro**, con la cadena de insumos flotando arriba en una tarjeta blanca redondeada; y b-roll de oficina con gente de espaldas frente a monitores. Subtítulo blanco de dos líneas abajo, con las palabras clave en **bold**. El estilo real que importa es el de los anuncios: papel envejecido, tipografía condensada de periódico, flechas rojas a mano, verde ácido `#D4E82A`, sellos circulares.

**Se porta a:** El **estilo Vox** entero (mapa anotado, plano técnico, barra comparativa, papel rasgado, sello) a `hermes-content/references/ui-patterns/anuncio-editorial-vox/`.

## Las tres preguntas

1. **Frente:** marketing / ads.
2. **Herramienta nuestra:** Es un skill de Claude, nuestro propio stack. HyperFrames puede reproducir el estilo sin depender del skill ajeno.
3. **Qué falta:** Confirmar que el skill existe y es público. Y buscar fuente para el "formato de mejor rendimiento", que hoy es una afirmación sin respaldo.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R05](prompts-lote-2026-08-28/R05-skill-claude-anuncios-estilo-vox.md)
