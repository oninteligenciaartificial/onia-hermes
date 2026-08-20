# Karpathy — 2h06 de cómo funciona un LLM por dentro

- **Video:** https://x.com/0xwhrrari/status/2089336474923667665 · **2 h 06 min** (no es un reel)
- **Carril:** B · **nivel de fuente: PRIMERA PARTE de un experto** — es material de Andrej
  Karpathy: su pizarra de Excalidraw, su herramienta `tiktokenizer.vercel.app`, y su frase
  *"zip file of the internet"*.
- **Cobertura real, y es baja:** **3 de 25 muestras de fotograma** (1 cada 5 min) y **1 de 13
  chunks de audio**. Los otros 12 siguen transcribiéndose. **Lo de abajo cubre bien el arranque
  y da el tema general; no puedo afirmar qué hay en la segunda hora.**
- **Veredicto: SIRVE como formación · NO genera tarea propia**

---

## Qué es

Clase de pizarra sobre cómo se entrena y cómo funciona un modelo de lenguaje. Lo que se ve:

> *"Large Language Model (LLM) ~= 1TB lossy, probabilistic **'zip file of the internet'**
> (parameters store world knowledge, though usually out of date by ~few months)"*
> - *pre-training: ~$10M, 3 months of training on internet documents*
> - *post-training: much much cheaper finetuning with SFT, RLHF, RL on Conversations*

Y el **modelo del queso suizo**: *"some things work really well; some things (almost at random)
show brittle"* — por qué un modelo excelente falla de golpe en algo tonto.

Del audio (chunk 1 de 13), verbatim:

> *"When we click new chat, we begin a token sequence... a one-dimensional sequence of tokens.
> The user, we can write tokens into this stream and then when we hit enter, we transfer control
> over to the language model... Together we are building out the token stream."*

También compara pretraining / SFT / RL con un libro de estudio: *exposición → problemas
resueltos → problemas de práctica*.

## ⚠️ La fecha importa, y no está a la vista

En pantalla se ve la página de precios de OpenAI con **GPT-4o, o1, o3-mini, Sora y Operator**
como lo nuevo. **Eso es de principios de 2025**, unos 18 meses atrás.

El video lleva una marca **"ANTHROP\C"** abajo a la derecha, sobreimpresa. **No es de Anthropic**:
es material de Karpathy con una marca agregada por quien lo re-subió. Lo digo porque a simple
vista parece primera parte de Anthropic y no lo es.

**Los conceptos no vencen. Los modelos y los precios de esas pantallas, sí.** Nada de esa lámina
de precios se usa como dato nuestro.

## Por qué igual vale, y con qué se lee

Este video **explica por qué funciona el otro**. Los dos llegaron juntos y no es casualidad:

| Este video dice | Y el taller de Code w/ Claude hace |
|---|---|
| la ventana de contexto es una **secuencia finita de tokens**, y todo lo que metés ahí ocupa lugar | **compute-over-context**: no metas 395 filas de CSV, calculá en el sandbox y devolvé 20 |
| el modelo **escanea** el token stream; no tiene una base de datos adentro | por eso pedirle que "encuentre a ojo el top-N" en un volcado es la forma cara de hacerlo |
| el conocimiento de los parámetros está **desactualizado unos meses** | por eso las skills y los datos frescos entran por contexto o por herramienta, no por memoria del modelo |

Leído solo, es una clase. Leído junto a
[la ficha de StockPilot](2026-08-17-code-with-claude-stockpilot.md), es **el porqué del ahorro
de 28× en tokens**.

## Qué NO hacer con esto

- No abrir una tarea. Es formación, y no hay nada roto que arregle.
- No citar sus precios, modelos ni capacidades como estado actual.
- No mandarlo a una sesión de trabajo: 2 horas de video no entran en un carril de ejecución.

## A dónde va

| Sesión | Qué |
|---|---|
| ninguna | queda como **material de formación** en el carril. Se referencia desde la ficha de StockPilot, que sí genera trabajo |
