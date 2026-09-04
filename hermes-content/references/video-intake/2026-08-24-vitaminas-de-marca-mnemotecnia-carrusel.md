# Las vitaminas de marca: una mnemotecnia que convierte una lista en carrusel

- **Fuente:** https://www.instagram.com/p/DcYltt_IK30/ · @diseño (marcado por Sergio)
- **Tipo:** MARKETING · **Veredicto:** SIRVE YA
- **Cobertura:** las 6 láminas, al 100%.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Molde:** cinco láminas con el mismo titular — `Your brand needs Vitamin C / A / B / D / E` — y cuatro ítems cada una, todos empezando con esa letra.
- **Vitamin C:** Claude · Conversions · Copywriting · Campaigns
- **Vitamin A:** Ads · Analytics · Audience · A/B Testing
- **Vitamin B:** Bolt.new · Bounce Rate · Billboards · Budget
- **Vitamin D:** Design · Data · Discounts · Dashboard
- **Vitamin E:** ElevenLabs · Email List · Events · Editing
- **Cierre:** `Follow For More — Marketing & AI`.
- Cada ítem lleva un icono ilustrado a mano, y algunos una tarjetita de métrica: `Conversion Rate +15%`, `Engagement +120%`, `Bounce Rate −15%`, `Growth +50%`, `Open Rate 85%`.

## Cómo está hecho — la reconstrucción

- **El truco es la mnemotecnia.** Una lista de 20 herramientas de marketing es ilegible; agrupada en cinco "vitaminas" por letra inicial, se recuerda. La restricción arbitraria (todo con la misma letra) es lo que hace el contenido memorable.
- **La plantilla es idéntica en las cinco.** Mismo titular, misma grilla 2×2, mismo lugar del icono y del rótulo. Eso es el patrón de repetición estricta que el corpus ya tenía identificado (P6 del deduplicado del 23-ago): a la tercera lámina el ojo ya no lee la estructura y va directo a lo que cambia.
- **Las métricas son decorativas.** `+15%`, `+120%`, `−15%` no tienen fuente ni contexto. Son textura de credibilidad. Se copia el molde, **no** ese recurso: sin fuente es fabricar.

## El estilo, como conocimiento portable

Fondo de **papel texturado hueso `#F2F0E9`** con grano visible. Titular en **serif clásica** (aparenta una didona o transicional, no se dice cuál), con la palabra clave subrayada a mano en resaltador — y el color del subrayado **cambia por lámina**: verde, naranja, azul, rosa, violeta. Iconos ilustrados a mano en paleta terracota apagada. Rótulos bajo cada icono, también subrayados a mano en colores rotativos. Es el opuesto exacto del carrusel de Anthropic: cálido, imperfecto y artesanal en vez de frío y disciplinado — y los dos funcionan.

**Se porta a:** `hermes-content/references/ui-patterns/carrusel-papel-subrayado/` — el molde de lámina cálida con serif + subrayado a mano.

## Las tres preguntas

1. **Frente:** marketing / motor de contenido.
2. **Herramienta nuestra:** HyperFrames renderiza las láminas; el grano de papel y el subrayado son CSS.
3. **Qué falta:** Nada técnico. Falta elegir la mnemotecnia nuestra, que es la parte difícil.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q04](prompts-lote-2026-08-24/Q04-vitaminas-de-marca-mnemotecnia-carrusel.md)
