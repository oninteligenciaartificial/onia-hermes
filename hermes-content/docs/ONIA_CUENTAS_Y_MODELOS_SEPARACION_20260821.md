# Quién es quién — la separación de cuentas y modelos IA

> 2026-08-21. Sergio pidió: cómo se separan Lucía y Onia, qué modelo usa cada una, y una
> modelo nueva. Este doc fija la estructura ANTES de generar de más.

## 1. La separación, en una tabla

| | **@oniahq** | **Lucía** | **Modelo nueva** (en casting) |
|---|---|---|---|
| Qué es | el vendedor | el medio / la marca editorial | la cara UGC de PAUTA |
| Habla de | TU negocio (dolor → sistema) | IA, herramientas, **prompts**, detrás de escena | el producto en anuncios |
| Cara en sus piezas | **el mundo del dueño** (objetos, mostrador, cuaderno) + Lucía SOLO de invitada y nombrándola | ella siempre | ella, en anuncios pagados |
| Motor de imagen | `z_image` (0.15) para objetos · `nano_banana_2` (2.00) cuando aparece Lucía | `nano_banana_2` + su ancla `<<<452d8375>>>` | `nano_banana_2` + SU ancla nueva (a crear tras el casting) |
| Motor de video | b-roll `veo3_1_lite` (1 cr/s) | `kling3_0_turbo` desde imagen ancla (7.5 cr/5s) | Marketing Studio (avatar) + kling |
| Palabras | SISTEMA · LISTA | SISTEMA (su voz, `?src=lucia-ig-sistema`) | ninguna — la pauta lleva link directo |
| Estética | editorial-clean (serif Instrument, foto oscura, verde Onia) | su paleta propia (§1-quater de LUCIA.md, acento terracota `#E4714E`) | por definir tras el casting |

**La regla que separa:** en @oniahq la protagonista es la REALIDAD del dueño; una cara solo
aparece si deriva. En Lucía la protagonista es ELLA. La modelo nueva no publica orgánico:
**trabaja en anuncios**, donde una cara distinta evita que la pauta queme la marca editorial
de Lucía.

## 2. "Enseñemos prompts de IA" — dónde vive

Es el **pilar genérico de Lucía** (el 60 del 60/40 que Sergio fijó). Serie propuesta:
**"El prompt de hoy"** — carrusel typographic (0 créditos, texto puro) con UN prompt copiable
por pieza, sacado de nuestras recetas ya escritas (molde 11 bloques, plantilla 8 bloques,
recetas Nano Banana de interiores). El radar de ganchos alimenta las portadas.
En @oniahq NO va — la prueba del vendedor lo prohíbe (le sirve a cualquiera).

## 3. La modelo nueva — método de creación

**Las referencias que pasó Sergio parecen fotos de una persona real.** La regla del repo
(nacida con Lucía) prohíbe usar la cara de una persona real sin consentimiento. Por eso:

1. Las referencias se leen como **dirección de estilo**: piel muy bronceada, ojos claros
   verdes, pelo largo castaño oscuro, energía segura, contexto de lujo casual (auto, playa,
   rooftop). **La cara NO se clona.**
2. Se generan **3 candidatas 100% sintéticas** con esos atributos en contextos distintos
   (auto / playa / rooftop Santa Cruz). Sergio elige UNA.
3. A la elegida se le crea su **ancla** (mismo método que Lucía: Element + molde de bloques)
   y recién ahí existe como modelo operable con cara consistente.
4. Nombre, cuenta y bio se deciden DESPUÉS del casting, no antes.

Costo del casting: 3 × 2.00 cr. Costo del ancla: se cotiza al elegir.

## 4. Lo que esto NO cambia

- La etiqueta de IA es obligatoria en toda cara sintética publicada.
- Los Souls de Sergio siguen prohibidos para generación.
- Generación de video sigue siendo caso por caso con OK explícito.
