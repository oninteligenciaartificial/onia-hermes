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

---

# ACTUALIZACION 21-ago (noche): entra la 3ra cuenta — la marca personal de Sergio

Sergio pasó el plan "Sistema Sergio" de Samuel Aguilera (19-ago): marca personal
`@sergio_urcullo` (IG 410 seg.) + `@sergiourcullom` (TikTok 574 seg.), 8 videos
guionizados el mes 1, 2/semana, reto de los $5.000 al 31-dic. Samuel produce; nuestro
sistema orquesta la infraestructura (comentario→DM, medición, comunidad).

> ⚠️ **Nota del 2026-09-25.** `@sergio_urcullo` era el handle de Instagram de Sergio Urcullo
> ese día. La cuenta se renombró después: hoy es **`@sergiourcullo`** (él lo confirmó el 06-sep,
> commit `2ee86efb`). Esta foto del 21-ago se deja como se escribió.

## El mapa completo de cuentas

| | @oniahq | Lucía | Sergio (personal) |
|---|---|---|---|
| **Qué es** | LA marca. Vende sistemas | Influencer IA declarada. Alcance | Autoridad personal. 16 años + reto $5.000 |
| **Quién produce** | Yo (motor carruseles + fotos) | Yo (ancla + kling natural / veo lite) | **Samuel** (graba Sergio real) |
| **Pilares** | dolor→sistema, prueba, educación | "soy IA", detrás de escena, IA sin humo | 5/8 adaptadas · 1/8 historia · 2/8 informativas |
| **Palabras CTA** | LISTA · SISTEMA | SISTEMA (con su voz) | EDICIÓN·SISTEMA·RETO·HIGGSFIELD·SKILL·CURSOS·RANKING |
| **Destino del DM** | PDF/recursos + pipeline | recursos + `?src=lucia-ig-sistema` | comunidad WhatsApp del reto |
| **Estado hoy** | ✅ cola llena hasta 09-sep | 🟡 lista para lanzar (falta OK) | 🔴 guiones listos, falta grabar + conectar DM |
| **Identidad visual** | tokens Onia (tile verde) | natural, sin filtro | paleta Samuel: #0B0D0D/#17F28A, Archivo Black |

## ⚠️ Colisión de palabra detectada: SISTEMA vive en las TRES cuentas

El video 2 de Sergio pide SISTEMA; @oniahq y Lucía ya la usan. **Técnicamente no choca**
(el workflow v8 rutea por entry_id de cada cuenta), pero el DM debe ser distinto por
cuenta y la medición separa por cuenta. Regla nueva: **antes de asignar palabra a un
video nuevo, revisar esta tabla** — la unicidad es POR CUENTA, no global.

## Qué le falta a la cuenta de Sergio para enchufarse al sistema

1. Conectar su IG/FB al workflow comentario→DM v8 (entry_id + 7 respuestas por palabra) —
   necesita su cuenta como activo en el Business Manager o token propio.
2. Comunidad de WhatsApp del reto creada (destino de TODOS sus DMs).
3. UTM por video y por red (`?src=sergio-ig-reto` etc.) si el destino tiene link.
4. Tracker público del reto $5.000 (módulo 08 del plan de Samuel) — candidato: página en
   onia.com.bo o Notion público.
