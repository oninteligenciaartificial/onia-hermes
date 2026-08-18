# El anuncio UGC de auto — receta completa, y dos correcciones al corpus

- **Video:** https://www.instagram.com/reel/DcMW3Coi6BN/ · 47 s · 960×720 (4:3, no vertical)
- **Carril A.** Sergio: *"aprende a hacer esto"*.
- **Cobertura real:** **6 de 8 fotogramas leídos** + **audio 100%**
  ([verbatim](transcripciones/Instagram-DcMW3Coi6BN.txt), apenas 4 líneas: el video es casi todo
  texto en pantalla).
- **Veredicto: SIRVE YA — es la segunda plantilla de prompt de video, y es distinta de la primera**

---

# 1 · El prompt, transcrito literal de la pantalla

El video lo muestra bajo el rótulo **"Save the prompt"**. Esto es lo que se lee:

```text
Handheld friend-cam UGC, 9:16, 15s, iPhone back cam — grain, compression, wobble,
autofocus hunts, no filters or grading; phone never in frame, reflections, or her hands.
HARD CUTS only. Same car in every shot: <<<image>>> — owner selling it.
Character <<<image>>>: matte real skin — pores, redness, baby hairs, no glare, no retouch;
natural blinks, micro-expressions.

0–3s <<<image>>>: warm downlights, garage echo. She leans on the hood, arms crossed,
smiles to lens: "Okay — I'm SELLING my car. Let me show you."

3–6s HARD CUT, interior <<<image>>>: pan from passenger door, red glow on dash,
red-lit dials. Her hand sweeps frame; soft: "Look at this interior — barely driven."
```

*(El video corta antes del beat de 6-9 s; lo que sigue no se ve.)*

## Verificado: el diálogo sale palabra por palabra

El audio del video generado dice, textual:

```
[21] I'm selling my car.
[22] Let me show you.
[23] Look at this interior, barely driven.
```

Y el prompt pedía `"Okay — I'm SELLING my car. Let me show you."` y
`"Look at this interior — barely driven."`

**Coincide literal.** No es una interpretación del modelo: lo que va entre comillas en el prompt
sale dicho tal cual. Eso convierte el mecanismo 6 de suposición en **hecho comprobado**, y
significa que el guion se escribe en el prompt, no se corrige después.

## Los seis mecanismos, y por qué cada uno está ahí

| # | Mecanismo | Para qué |
|---|---|---|
| 1 | **Cabecera técnica global** — `Handheld friend-cam UGC, 9:16, 15s, iPhone back cam` | fija formato, duración y **qué cámara finge ser**, antes de contar nada |
| 2 | **Defectos pedidos a propósito** — `grain, compression, wobble, autofocus hunts, no filters or grading` | lo que hace que parezca UGC real. **Se le pide fealdad al modelo**, que por defecto tira a pulido |
| 3 | **Negativos del formato** — `phone never in frame, reflections, or her hands` | el modelo mete el celular en el reflejo del auto porque "alguien está filmando". Hay que prohibirlo explícito |
| 4 | **Anclas de consistencia inline** — `Same car in every shot: <<<image>>>` · `Character <<<image>>>` | **la referencia se inyecta EN el punto del texto donde importa**, no como adjunto suelto |
| 5 | **Realismo de piel, detallado** — `matte real skin — pores, redness, baby hairs, no glare, no retouch; natural blinks, micro-expressions` | es lo que separa "modelo de stock" de "persona". Cinco atributos concretos, ninguno genérico |
| 6 | **Beats con timestamp + referencia + diálogo entre comillas** | cada corte es una línea. El diálogo va **literal entre comillas**, no descrito |

Más `HARD CUTS only` declarado una sola vez arriba, que gobierna todo el montaje.

# 2 · Lo importante: son DOS plantillas distintas, no una

Ayer saqué de otro reel una estructura de prompt de 5 bloques
([ficha](2026-08-16-carril-a-como-se-hicieron.md)). **No es la misma que esta, y mezclarlas
arruina las dos.**

| | Plantilla CINE (16-ago) | Plantilla UGC (esta) |
|---|---|---|
| Toma | **una sola**, continua, sin cortes | **muchas**, con cortes duros |
| Lo que ocupa la mitad del prompt | el **recorrido de cámara**, coreografiado | los **beats con diálogo**, cronometrados |
| Cámara | dron FPV, inercia, curvas en S | celular en mano, autofoco que caza |
| Estética | grado cian-teal, grano de cine, aberración | compresión, temblor, **sin grado** |
| Diálogo | no hay | **es el eje** |
| Consistencia | no hace falta: es una toma | `<<<image>>>` repetido en cada beat |
| Sirve para | pieza de marca, hero shot | anuncio, testimonio, demo de producto |

**La regla:** si el video habla, es UGC. Si el video impresiona, es cine. Elegir la plantilla
antes de escribir la primera palabra.

# 3 · El stack está nombrado en pantalla

Una lámina muestra los tres logos: **Claude × ChatGPT × Higgsfield**. Y debajo, la barra de
Higgsfield con el texto escrito: *"Create AI videos for my entire car inventory"*.

O sea: **Claude/ChatGPT escriben el prompt, Higgsfield genera.** Nosotros tenemos el MCP de
Higgsfield conectado. **Es repetible hoy.**

# 4 · El negocio que vende el reel

El arco del video, en orden: una publicación de auto muerta (*"Listed 30+ days ago · 2 views"*,
$56.900) → el anuncio UGC generado con IA → la ficha del vendedor. Y el gancho de apertura es
un DM entrante de un concesionario: *"Your car ads are insane. How much would they cost?"*

**Es un negocio de servicio: anuncios UGC con IA para concesionarias.** Con la salvedad del
Filtro 1: **la prueba es una captura del propio vendedor**, que es la señal débil de siempre. El
negocio puede ser real; la captura no lo demuestra.

Para nosotros: automotoras es un rubro de comercio en Bolivia, y el mismo molde sirve para
cualquier producto con foto y precio.

---

# ⚠️ Dos correcciones al corpus — verificadas contra la cuenta, gratis

## Corrección 1 · Seedance 2.5 **YA EXISTE** en nuestra cuenta

Escribí **seis veces** que "Seedance 2.5 no existe en nuestra cuenta, tenemos `seedance_2_0`,
tope 15 s". Lo consulté de nuevo hoy:

```
seedance_2_5 · Bytedance
  "text-to-video, multimodal omni-reference generation, video edit, and video extension"
  duration: 4–30 s   ·   resolution: 480p / 720p / 1080p
  mode: t2v | omni_reference | video_edit | video_extension
```

**Está, y hace 30 segundos.** Los videos que decían "hasta 30 s" no mentían: decían algo que
todavía no había llegado a nuestro catálogo.

**Lo que esto le cambia al método:** la verificación estaba bien hecha y aun así envejeció. La
regla "verificá contra la cuenta antes de prometer" sigue en pie, pero le falta la mitad:
**una verificación tiene fecha, y hay que repetirla, no citarla.** Un dato verificado hace una
semana es un dato afirmado hoy.

También aparecieron `seedance_2_0_mini` (barato) y los modos `video_edit` y `video_extension`,
que no estaban en ninguna ficha.

## Corrección 2 · Existe **Marketing Studio**, y hace esto mismo sin escribir el prompt

`marketing_studio_video` — *"One-click product ads, TikTok/Reels ready"*, 12-15 s. Y no es un
modelo más: es una máquina de componer el anuncio por partes.

| Parámetro | Qué es |
|---|---|
| `mode` | uno de **26 presets**. Los que nos sirven: `ugc`, `ugc_direct_to_camera` (*"creator speaking straight to camera"*), `ugc_selfie_testimonial`, `product_showcase`, `ugc_before_and_after`, `ugc_how_to`, `tv_spot`, `wild_card` |
| `hook_id` | **el "qué"** — la mecánica que frena el scroll |
| `setting_id` | **el "dónde"** — locación y clima |
| `avatar_ids` | el personaje (máx. 1) |
| `product_ids` | el producto |
| **`ad_reference_id`** | **le pasás un anuncio existente y replica su escenario** — composición de escenas, ritmo, gancho, narración |

**`ad_reference_id` es el hallazgo.** Significa que no hace falta ingeniar el prompt de 300
palabras: se le da como referencia un anuncio que funciona y se le cambia producto y avatar.

Ojo, y está en la doc del propio parámetro: **el avatar y el producto NO se heredan de la
referencia**. Hay que pasarlos explícitos igual, siempre.

Y son mutuamente excluyentes: `ad_reference_id` **o** `hook_id`+`setting_id`. Nunca los dos.

---

## Lo que queda sin verificar, y lo digo

- **`unlim.available` sigue en `false`.** `seedance_2_0`, `seedance_2_0_mini`, `gemini_omni` y
  `wan2_7` figuran como elegibles para generaciones ilimitadas, **pero hoy no se pueden gastar**.
  Cada generación cuesta créditos.
- **La sintaxis `<<<image>>>` inline no está confirmada** para nuestros modelos. En la API que
  vemos, las referencias van como `image_references`, no incrustadas en el texto. Puede ser una
  particularidad de la interfaz de Higgsfield. **Hay que probarlo antes de prometerlo.**
- **No sé qué es "5.6 Sol"** en la barra del video. Aparece donde iría un selector. No lo invento.
- **No leí el audio todavía.**

**Gasto: no generé nada.** Todas las consultas de arriba son de catálogo y son gratis. Generar
video sigue necesitando tu OK caso por caso.

## A dónde va

| Sesión | Qué |
|---|---|
| **`INFLUENCERS IA`** | **G1** — las dos plantillas separadas + Marketing Studio + el catálogo corregido |
| **marketing** | **G2** — el molde de anuncio UGC para un rubro nuestro, sin generar |
