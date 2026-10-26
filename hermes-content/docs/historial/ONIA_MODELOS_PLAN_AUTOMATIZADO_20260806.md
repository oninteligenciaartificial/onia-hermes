# Lucía y Mara — perfeccionarlas y automatizar la venta con carruseles

> 2026-08-06. Sergio: *"dame un plan sobre las modelos que ya tenemos, perfecciónalas, y que
> sea todo automatizado más carruseles para la venta del producto automáticamente."*
>
> **Decisión previa registrada: el Soul de Sergio NO se usa** ("es horrible"). Su marca
> personal va con cara real grabada. El ejército es de MODELOS.

---

> **DUEÑO OPERATIVO: Arthur** (decisión de Sergio, 2026-08-06: *"Arthur hará lo de las
> modelos y Higgsfield y Meta Ads"*). Él genera, arma el banco y el calendario. Sergio crea
> las cuentas, aprueba las piezas y autoriza el gasto de video. Detalle del alcance en
> `ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` §5-ter.

## 1. Qué tenemos y qué le falta a cada una

| | **Lucía** `36305a9b` | **Mara** `6c94bbf0` |
|---|---|---|
| Soul | Entrenado, limpio, verificado | Entrenado |
| Handle | `@lucia.antelo.oficial` (definido) | `@mara.vale` (propuesto) |
| Posicionamiento | Lifestyle SCZ + meta-IA ("es IA y no se esconde") | Beauty / UGC de producto |
| **Vende** | Servicios Onia a negocios + **es la vitrina del producto "tu influencer IA"** | El servicio "modelo IA para tu marca" (packs 450→6.500) |
| Le falta | Consistencia de rasgos entre piezas · vestuario/paleta fijos · cuenta creada | Lo mismo + definir su nicho exacto |

### Perfeccionarlas = 3 cosas concretas, no "mejorar el prompt"

1. **Bloque de identidad fijo** por modelo: un párrafo de descripción física + vestuario +
   paleta que se pega en TODOS los prompts. Es lo que evita que en cada pieza parezca otra
   persona. (El método está en [[avatar-consistency-scheme]]: Soul + texto es el único
   camino; Reference Elements solo para objetos.)
2. **Lote de calibración**: 8 imágenes con el bloque fijo, Sergio marca cuáles sí. Las
   aprobadas definen el estándar; los seeds ganadores se anotan.
3. **Reglas de escena por modelo** (dónde vive, qué usa, qué nunca hace) para que la cuenta
   se sienta una persona y no un banco de imágenes.

**Bloques de identidad (v1, a calibrar):**

- **Lucía:** *mujer boliviana de 26, pelo negro largo con ondas suaves, piel trigueña, ojos
  marrones, maquillaje natural; estilo casual chic — jeans, blusas claras, dorados finos;
  escenarios reales de Santa Cruz (cafés, coworking, mercado, calles con palmeras); luz
  cálida tropical; jamás ropa de oficina formal.*
- **Mara:** *mujer de 24-27, pelo rojo cobrizo, piel clara con pecas leves; estética beauty
  limpia — beige, blanco, vidrio, cerámica; interiores luminosos y minimalistas; luz suave
  de mañana; jamás exteriores caóticos.*

## 2. El motor de venta automática: el post de @nocodealex

El link que pasaste es **la mecánica exacta** que necesitamos, y es replicable hoy:

> Carrusel de valor real (5 herramientas, sin vender nada) + **"Comentá DESIGN y te mando
> el instalador por DM"** + "seguime para que llegue el DM". Resultado: 2.545 likes, **1.640
> comentarios**, 124 compartidos en 2 días. *(Dato lateral: Arthur ya le dio like — el
> formato le llama la atención a él también.)*

**Por qué funciona, en orden de importancia:**
1. **El valor va COMPLETO en el carrusel** — no es un teaser. La gente lo guarda igual.
2. **El CTA es comentar una palabra**, no salir de la app. Fricción casi cero.
3. **Cada comentario es un lead calificado** que pidió algo concreto.
4. El "seguime para que llegue el DM" convierte comentario en seguidor.
5. Los comentarios disparan el alcance del algoritmo — **el CTA ES la distribución**.

### Nuestra versión, automatizada punta a punta

```
Carrusel (HyperFrames, 8 slides, costo 0)
   → publicado por Lucía/Mara con CTA "comentá AGENTE"
   → comentario detectado por webhook de IG
   → DM automático con el material + link onia.com.bo/?src=<pieza>
   → el que hace clic entra como LEAD al panel con su fuente
   → agenda demo en Cal → reunión confirmada sola
```

**Todo ese circuito ya está construido** salvo el primer eslabón: la detección de comentarios
necesita el token de IG (S6). Los demás tramos (`?src=` → lead → Cal → panel) están vivos y
probados. Mientras no haya token: el DM se manda a mano (15 min/día) y el resto sigue
automático — no se pierde ningún lead.

## 3. Los 4 carruseles semilla (uno por ángulo del banco de ads)

Producidos con el molde de 8 slides de `CAROUSEL_PATTERN_BANK_2026.md`:

| # | Carrusel | Publica | CTA | Vende |
|---|---|---|---|---|
| C1 | "5 agentes que todo negocio boliviano necesita" | Onia + Lucía | comentá **AGENTE** | Plataforma / agentes |
| C2 | "¿Cuántos pacientes no volvieron este mes?" | Onia | comentá **PACIENTES** | Plataforma dental |
| C3 | "Tu negocio factura. Tu web no existe." | Lucía | comentá **WEB** | Webs (cliente B) |
| C4 | "Le hicimos un influencer IA a una marca. Esto pasó." | Mara | DM **MODELO** | El servicio de influencer IA |

C4 es el más importante a mediano plazo: es Mara vendiéndose a sí misma como producto.

## 4. Automatización — qué corre solo y qué no (honesto)

| Tramo | Estado |
|---|---|
| Generar imágenes de carrusel | ✅ Automático (HyperFrames + Souls, ~0 costo) |
| Armar el carrusel completo | ✅ Automático (molde de 8 slides) |
| **Publicar en IG** | ❌ **Token IG (S6)** — hoy manual, 15 min/día |
| **Detectar comentarios → DM** | ❌ Mismo token — hoy manual |
| Link `?src=` → lead en panel | ✅ **Vivo y probado** |
| Reserva Cal → reunión confirmada | ✅ **Vivo y probado** |
| Aviso a Sergio de lead nuevo | ⚠️ Pendiente (n8n, chico) |

**Traducción sin adornos:** el 70% del circuito está automatizado. Lo que falta es el token
de Instagram — un trámite tuyo, no código. Con él, esto corre solo de punta a punta.

## 5. Orden de ejecución

| Paso | Quién | Tiempo |
|---|---|---|
| ~~1. Lote de calibración: 8 imágenes por modelo con bloque de identidad~~ | ✅ **HECHO 2026-08-06** — 30 imágenes en 3 rondas, 3,6 cr. Resultado y receta reproducible: `ONIA_MODELOS_RECETA_VISUAL_20260806.md` | — |
| 2. Sergio marca cuáles sí (hojas de contacto en `references/modelos/`) | **Sergio — pendiente** | 5 min |
| 3. Crear las 2 cuentas IG (etiqueta IA en bio, obligatoria) | Sergio | 30 min |
| 4. Cargar avatar, bio, y los 4 carruseles con sus `?src=` | Arthur | 1 h |
| 5. Publicación manual 3×/semana + DM a mano | Arthur (aprueba Sergio) | 15 min/día |
| 6. Token IG → todo automático | Sergio (trámite) → Claude (cableado) | trámite + 1 h |

**Métrica única:** leads con `src=lucia-*` / `src=mara-*` en el panel. Todo lo demás
(likes, followers) es ruido hasta que haya leads.

---

Relacionado: `CAROUSEL_PATTERN_BANK_2026.md` (cómo se arma) · `ADS_PATTERN_BANK_2026.md`
(qué ángulo gana) · `ONIA_EJERCITO_INFLUENCERS_IA_PLAN_20260806.md` (el ejército completo) ·
`ONIA_AI_INFLUENCERS_ACCOUNT_OPS_2026.md` (ops de cuentas) · memorias
[[avatar-consistency-scheme]], [[feedback-sergio-soul-no-usar]].
