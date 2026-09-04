# Cuatro moldes de anuncio estático que no son "foto de producto"

- **Fuente:** https://www.instagram.com/p/DbtVtpmT3ZU/ · @no se dice en pantalla
- **Tipo:** MARKETING · **Veredicto:** SIRVE YA
- **Cobertura:** 14 de 25 fotogramas (4 base + 10 densos). Duración 7,2 s, 4 cortes medidos. Sin transcripción.
- **Medido:** 7,2 s · 4 cortes (ffmpeg, umbral 0,3).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en este lote y en los dos anteriores. Nada
> de lo que sigue afirma qué se *dice*: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Rótulo:** *"4 Anuncios Que Te Volverán Ridículamente Bueno En Ads En 67 Horas"*, con una lista numerada 1-4 vacía que se va llenando.
- **Caption:** *"Estos son formatos ganadores que todas las marcas deberían empezar a aplicar en sus anuncios en el 2026."*
- **Molde 1 — OLIVEA:** `TU DOSIS DIARIA DE POLIFENOLES`. Mano sosteniendo la cápsula, y encima **cuatro capturas de reseñas de 5 estrellas apiladas** como tarjetas. CTA `PRUEBA OLIVEA`.
- **Molde 2 — thehoopgang:** `ÚLTIMA HORA: LOS SWEATPANTS CROPPED MÁS DESEADOS ACABAN DE SALIR — ¡SOLO $40!` sobre el producto en fondo negro, con un **círculo rojo dibujado a mano** señalando el detalle del ruedo.
- **Molde 3 — Rheal Balance Tonic:** `NO COMPRES ESTE JUGO` … *"Si disfrutas vivir con el cortisol alto."* Producto sobre un escritorio real, con tres badges de atributo (`600MG DE KSM-66 ASHWAGANDHA` · `ACREDITADO COMO APTO PARA MENOPAUSIA` · `PROBADO POR TERCEROS`) y una barra verde de **Trustpilot 4.4 · 1M+ clientes felices**.
- **Molde 4 — colostro:** `LA VERDAD SOBRE EL COLOSTRO` con **una palabra tachada en negro**, sobre polvo blanco. *"La mayoría de las marcas esconden lo que el procesamiento hace a la bioactividad. Descubre lo que están ocultando."*

## Cómo está hecho — la reconstrucción

- **Los cuatro tienen el mismo truco de fondo: ninguno se ve como un anuncio.** Uno parece una captura de reseñas, otro una alerta de noticias, otro una advertencia, otro un documento censurado. El formato le roba la forma a algo que el usuario ya consume sin defensas.
- **Molde 1 — prueba social apilada:** el producto es el fondo; el contenido son las reseñas. Se copia con capturas reales y nada más.
- **Molde 2 — última hora + anotación a mano:** el círculo rojo trazado a mano dirige el ojo al detalle que justifica el precio. Barato y efectivo.
- **Molde 3 — negación reversa:** *"NO COMPRES ESTO — si disfrutas vivir con el cortisol alto"*. Nombra el dolor en la negación. Y apoya con badges verificables + calificación de tercero.
- **Molde 4 — exposé con tachado:** el tachado promete información oculta. **Es el más riesgoso:** insinúa que "las marcas esconden algo" sin probarlo. Con la regla de no fabricar, para nosotros solo sirve si de verdad tenemos el dato que otros no dicen.
- **Ya existe una ficha hermana en el corpus** sobre cinco formatos de estático de Meta (12-ago). Estos cuatro son distintos: conviene fundir las dos en un solo banco en vez de dejarlas sueltas.

## El estilo, como conocimiento portable

El reel es talking-head con los anuncios **compuestos flotando a pantalla casi completa** sobre la escena real, con sombra suave. Rótulo blanco de tres líneas arriba con lista numerada que se llena. Los anuncios mismos no comparten estilo entre sí — y ese es el punto: cada molde imita un formato nativo distinto (captura de reseñas, alerta, packaging, documento censurado).

**Se porta a:** Fundir con `2026-08-12-cinco-formatos-anuncio-estatico-meta.md` en un banco único de moldes de estático.

## Las tres preguntas

1. **Frente:** marketing / ads.
2. **Herramienta nuestra:** HyperFrames o cualquier editor de imagen; el motor de Meta Ads para publicarlos.
3. **Qué falta:** Nada técnico. El molde 4 requiere tener un dato real que otros oculten, o no se usa.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex son aproximados: se leyeron de una captura comprimida, no de un archivo.

**Prompt:** [R04](prompts-lote-2026-08-28/R04-cuatro-moldes-anuncio-estatico.md)
