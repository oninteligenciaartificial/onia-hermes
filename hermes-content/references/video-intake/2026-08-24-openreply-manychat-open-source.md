# OpenReply: el comentario→DM de Instagram, open source, contra los $139/mes de ManyChat

- **Fuente:** https://www.instagram.com/p/DceDGTbjOtI/ · @anas.tecnologia
- **Tipo:** SaaS · **Veredicto:** SIRVE YA
- **Cobertura:** 16 de 40 fotogramas (6 base + 10 densos). Sin transcripción: Speaches sigue caído. Todo sale del texto en pantalla y del caption.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Caption:** *"Este joven de 17 años solucionó el mayor problema de ManyChat. Deja tu comentario y implementa esto ahora mismo."*
- **Precios de ManyChat, leídos de la captura:** plan **Advanced $139/mes** (25.000 contactos activos/mes) y plan **Business $69/mes** (7.500 contactos incluidos, después se paga por contacto).
- **El producto:** *"It is called **OpenReply** — Open-sourced ManyChat for Instagram comment-to-DM automation."*
- **Del README en pantalla:** *"Full environment variables and the production layout are in `docs/setup.md`."*
- **Y la parte que más importa:** *"**Set it up with your AI assistant.** If you use Claude Code, Cursor, or a similar tool, the Meta setup is a lot faster with an assistant driving it. There is a ready-made prompt in the `Set it up with an AI assistant` section of the setup guide. Paste it into your assistant inside a clone of this repo, hand over your keys, and it will walk you through connecting Instagram and going live."*
- **Prueba social mostrada:** hilo de comentarios reales donde la gente escribe "Repo" y el bot responde *"link in your DMs, check it out"* / *"dm sent, check your inbox"*.

## Cómo está hecho — la reconstrucción

- Es el mismo mecanismo que ya tenemos vivo: comentario en IG dispara un DM automático. **No es un descubrimiento de capacidad — es un punto de comparación.**
- Lo que aporta: (1) es open source y gratis contra $69–139/mes; (2) trae `docs/setup.md` con variables de entorno y layout de producción; (3) trae un **prompt listo para pegar en Claude Code** que hace el setup de Meta, que es la parte que más duele.
- El dato de precio sirve para la venta: si un cliente ya paga ManyChat, ahí hay $69–139/mes de ahorro para argumentar.

## El estilo, como conocimiento portable

Talking-head sobre fondo turquesa desenfocado, sujeto centrado con producto en mano (un objeto pequeño que sostiene todo el video como ancla visual). **Subtítulo quemado de 2-4 palabras**, caja negra con texto blanco, anclado abajo-centro, que cambia por corte duro. Alterna cara / captura a pantalla completa cada ~1-2 s. La captura se muestra ampliada y con scroll lento, no estática.

**Se porta a:** El patrón "cara / captura alternada con subtítulo de 2-4 palabras" al banco de motion; ya está cubierto por P1 (texto ancla) del deduplicado del 23-ago.

## Las tres preguntas

1. **Frente:** chatbot / marketing — el circuito comentario→DM que sostiene 8 prompts del lote O.
2. **Herramienta nuestra:** Ya tenemos circuito propio comentario→DM, probado en producción el 18-ago. OpenReply es alternativa, no reemplazo.
3. **Qué falta:** Nada para evaluarlo: el repo es público. Lo que falta es CONTAR de nuevo si nuestro circuito sigue vivo — es un dato heredado de hace 6 días del que dependen 8 prompts.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q06](prompts-lote-2026-08-24/Q06-openreply-manychat-open-source.md)
