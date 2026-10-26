# Cómo operan los profesionales un influencer IA — investigación 2026-09-29

> **Foto de un día, no fuente de verdad.** La hizo un subagente con WebSearch (solo fragmentos
> indexados: el proxy de la sesión bloqueaba WebFetch). Donde choca con lo verificado en vivo, gana
> `HIGGSFIELD_VIDEO_SYSTEM.md` §«Verificado en vivo 2026-09-29». Pedido de Sergio Urcullo:
> *«investigá cómo hacerlo como un pro, o si necesitamos esas apps con nodos… una app era Pletor…
> aprendelo y me decís»*.

## Veredictos

1. **Apps de nodos: no hacen falta.**
   - Qué es **Pletor** ([pletor.ai](https://www.pletor.ai)): una startup de París (2024, levantó €2M) con un lienzo de nodos para equipos de marketing sin programadores. Tiene MCP y API. Cuesta de US$19 a 199 por mes y los créditos no se acumulan de un mes a otro.
   - **Figma Weave, Flora y Krea** son el mismo tipo de producto.
   - Cada una suma **otra billetera de créditos** encima de Higgsfield y no da nada que falte. ONIA ya orquesta por código: Claude Code, el MCP y el CLI de Higgsfield, n8n para horarios y aprobaciones, y git para versionar.
   - El **Canvas de Higgsfield** ya está pagado, pero no se puede llamar desde el CLI, el MCP ni la API ([issue #2 del CLI](https://github.com/higgsfield-ai/cli/issues/2)). Sirve para explorar a ojo, no para producir.
2. **Identidad por capas**, como hacen los estudios:
   - un paquete fijo de referencia (hojas de vistas, expresiones y primeros planos);
   - una identidad entrenada (Soul ID);
   - modelos con referencias (Nano Banana Pro hasta 14 imágenes, GPT Image 2 hasta 16) para cambiar de escena;
   - video siempre desde una foto aprobada.
   - El cambio de cara (face swap) se usa solo como parche.
3. **Para entrenar se usan fotos sueltas, no láminas.**
   - Reparto de ángulos: ~40% de frente, 30% en tres cuartos, 20% de perfil, 10% en picado o contrapicado, más algunas de cuerpo entero. Expresiones variadas y cuatro tipos de luz.
   - **Nunca espejar las fotos**: el lunar va de un solo lado.
   - Las marcas (pecas, lunar) se nombran siempre del mismo lado y se revisan en cada pieza.
4. **Fallas documentadas de Soul ID** en el repo de un operador ([kupercool-KC/ai-influencer#22](https://github.com/kupercool-KC/ai-influencer/pull/22), [#38](https://github.com/kupercool-KC/ai-influencer/pull/38)):
   - con 8 fotos, Soul perdió el pelo rubio y el collar;
   - Soul con una sola referencia copia la escena de esa referencia.
   - **Implicancia para Lucía:** las argollas y la cadenita pueden no fijarse con Soul. Hay que nombrarlas en cada prompt o guardarlas como Element aparte.
   - **Bug abierto del CLI:** `soul-id create --soul-cinematic` falla sin avisar en cuentas ya establecidas; `--soul-2` funciona ([cli#41](https://github.com/higgsfield-ai/cli/issues/41)). **Se entrena tipo `soul_2`.**
5. **Operación diaria:**
   - Se planifica cada semana, se produce en lotes, se deja en borrador y **una persona aprueba antes de publicar**.
   - Instagram: el carrusel ≈ el Reel en interacción, y el Reel tiene más alcance.
   - Instagram: 3–5 posts por semana más historias diarias hacen crecer la cuenta unas 2 veces más rápido que 1–2 por semana ([Buffer 2026](https://buffer.com/resources/social-media-frequency-guide/)).
   - TikTok: la frecuencia no cambia las vistas medianas.
6. **Divulgación, que ya no es opcional:**
   - **Instagram:** desde el **31-ago-2026** deja de recomendar perfiles con persona IA que no lleven la etiqueta **«AI-generated profile»**; con la etiqueta no hay penalidad ([TechCrunch](https://techcrunch.com/2026/08/31/instagram-puts-new-limits-on-undisclosed-ai-profiles/)).
   - **TikTok:** el interruptor de contenido IA es obligatorio si el contenido es realista. Para promocionar el negocio propio se marca «Your brand».
   - **Bolivia:** la ley de IA (PL 178) está pendiente en Diputados. La Ley 453 prohíbe la publicidad engañosa, así que Lucía nunca se presenta como clienta ni como odontóloga.
7. **Publicar:**
   - **Instagram:** por la Graph API propia, con acceso Standard para la cuenta propia. El repo ya tiene un publicador oficial: `hermes-content/deploy/vps-ops/publicar/` (Reels) y `scripts/ig_publisher.py`.
   - **TikTok:** una app propia sin auditar solo publica en privado, y las reglas de TikTok rechazan las herramientas para cuentas propias. Hay dos caminos:
     - la API de Buffer;
     - las herramientas `tiktok_*` del MCP de Higgsfield, donde la persona confirma en el widget.
     - Falta verificar el segundo.
8. **Costos por mes, con ~1 post por día:**
   - Un mes centrado en fotos cuesta **US$35–110**. Con un Soul entrenado, cada foto cuesta **0,12 créditos** (verificado en vivo), contra 2 de Nano Banana Pro.
   - Un **Reel diario con sincronización de labios** cuesta **US$320–760 o más**: hacen falta 6–10 intentos por toma usable.
   - El **Reel híbrido** (5 s de Lucía más la pantalla real del producto) cuesta ~**US$50–100**. Es el formato por defecto razonable y además cumple la regla «producto visible» del CLAUDE.md.

## Correcciones a las recomendaciones del subagente

- ⛔ **«Entrenar un LoRA de respaldo en fal con el dataset» NO se hace.** El 5.2(iv) de los términos de Higgsfield prohíbe usar sus salidas para entrenar **cualquier** modelo fuera del servicio, *«whether or not such system competes»*. La guía oficial solo cubre el Soul ID dentro de Higgsfield. Un respaldo externo exigiría un dataset que no salga de Higgsfield.
- El subagente anotó como «no verificado» el costo de 0,12 créditos de Soul 2.0. **Está verificado** en `transactions` el 2026-09-29.
- **Límite real del plan Pro:** máximo 4 trabajos a la vez (medido el 2026-09-29). Los lotes se envían de a 4.
- La mezcla de contenido que sugirió (60% educativo, 25% rutina, 15% comunidad) **no tiene fuente**. La proporción entre lifestyle y venta la define Sergio Urcullo en el objetivo siguiente, y se mide contra demos agendadas.

## Fuentes principales

- Soul ID: https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character
- Pletor: https://docs.pletor.ai/get-started/key-concepts · https://tech.eu/2025/06/05/french-startup-pletor-bags-eur2m-to-bring-ai-agents-to-the-creative-stack/
- Canvas fuera del CLI, el MCP y la API: https://github.com/higgsfield-ai/cli/issues/2
- Nano Banana Pro: https://blog.google/innovation-and-ai/products/nano-banana-pro/
- Instagram, perfiles IA: https://techcrunch.com/2026/08/31/instagram-puts-new-limits-on-undisclosed-ai-profiles/
- TikTok, etiqueta IA: https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label
- TikTok, reglas de publicación: https://developers.tiktok.com/docs/en/content-sharing-guidelines
- Instagram, publicación por API: https://developers.facebook.com/docs/instagram-platform/content-publishing/
- Bolivia, ley de IA: https://www.opinion.com.bo/articulo/pais/senado-aprueba-ley-regular-uso-inteligencia-artificial/20251023194756982336.html
