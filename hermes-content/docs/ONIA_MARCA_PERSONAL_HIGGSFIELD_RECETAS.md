# Recetas Higgsfield — artes y reels para marca personal y comunidad

> Consolidación 2026-09-01, actualizada 2026-09-02 tras probar el **CLI oficial**.
> **La vía de producción es el CLI (`@higgsfield/cli`)** — decisión de Sergio, verificada:
> job type EXPLÍCITO (sin sustitución silenciosa), `generate cost` cotiza ANTES, y el
> cobro medido coincidió exacto (0,12 cr cotizados = 0,12 debitados). Autenticado en
> Windows y en el VPS (token OAuth oficial copiado — no es login de navegador).
> El MCP viejo sigue PROHIBIDO (sustituía modelos y cobraba). La web queda para lo
> manual/exploratorio. IMAGEN lote chico = autorizado con registro. VIDEO = permiso
> explícito caso por caso, cotizado antes. Tope del loop: 2 cr/día, solo imagen.
>
> 🔴 **Corregido 2026-09-21, medido en vivo — dos cosas de acá arriba ya no son ciertas:**
> 1. **El plan NO es ULTRA y el saldo NO es 2.019.** Hoy: plan **`pro`** con **580,65
>    créditos** (`balance`). Una sesión que lea «2.019» planifica con **3,5 veces** más
>    presupuesto del que hay.
> 2. **El CLI NO está autenticado en Windows.** `higgsfield account status` devuelve
>    `request failed` → `Run: hf auth login`. La vía que sí funcionó hoy fue el **MCP**,
>    y cotizando antes: `get_cost:true` → 0,12 cr, debitado 0,12 cr, **exacto**.
>    El motivo real del veto al MCP («no cotiza antes») **ya no aplica**: sí cotiza.
>    Y la «sustitución de modelo» era la colisión de nombres ya documentada — se pide
>    `soul_2` y se ejecuta `text2image_soul_v2`, que es el **mismo** motor (verificado en
>    los 6 jobs del 21-sep). Regla que sigue firme: **el job type sale del catálogo
>    (`models_explore get`), nunca de memoria.**
>
> ⚠️ **Límite nuevo del plan `pro`: 4 jobs concurrentes.** El 5.º de un lote se rechaza en
> el acto con `max 4 concurrent job(s) on pro (monthly) plan` — hay que reenviarlo.

## Qué modelo para qué (roster del repo)

| Necesidad | Modelo | Nota de costo/uso |
|---|---|---|
| Cara REAL de Sergio en una escena | **Soul + texto** — ÚNICO método aprobado para cara consistente | ~0,12 cr por imagen 2k con text2image_soul_v2 |
| Ediciones sobre una imagen, negaciones, objetos | **nano_banana** (+ Element para fijar atuendo/props) | las negaciones FUNCIONAN por esta vía |
| Video barato (movimiento simple) | **kling** | video = permiso caso por caso |
| Íconos/artes planas estilo 3D | NO usar Higgsfield: plantilla + Fluent 3D (gratis, ya probado) | 0 |

## El activo que ya tenemos: identity lock de Sergio

`references/sergio-approved-media/identity-shoots/20260605-nano-banana-face-teeth-lock*`
(plancha 6 poses, fondo gris, remera negra) + fotos reales en `final-avatar-identity-lock/`.
Ese lock es la referencia para que Soul/nano_banana mantengan SU cara. La foto verde de
perfil (polo azul, fondo #00-verde) es el look "oficial" de perfil.

## Receta 1 — ARTE con la cara de Sergio (statement-post premium)

Para portadas de carrusel o statement-posts donde aparece él (no ícono):

1. En Higgsfield web → Image → **Soul**, adjuntar identity lock (2 imágenes de la plancha).
2. Prompt base (ajustar escena):
   > "Young latino entrepreneur, EXACT same face as reference, wearing navy polo shirt,
   > standing confidently with arms crossed, isolated on solid warm white background
   > #F7F7F7, soft studio light, editorial minimal style, waist-up, high detail"
3. 2k, lote de 2-4 variantes (≈0,5 cr). Elegir 1, recortar, componer en la plantilla
   statement (la caja de texto y los íconos los pone el generador nuestro).
4. Registrar el lote (prompt, modelo, costo) en esta sección al final.

## Receta 2 — REEL UGC estilo Revolutia (el formato que pidió Sergio)

El video se GRABA real (Sergio a cámara — más barato y más auténtico que generarlo).
Higgsfield solo aporta piezas:
- **Overlay 3D del logo/objeto** (tipo el Claude flotante): nano_banana → "3D clay style
  app icon of [logo], floating, soft shadow, transparent-friendly solid background" →
  se recorta y se anima en el editor (editor-videos hace el overlay).
- **B-roll imposible** (ej. "servidor en llamas", "oficina del futuro"): SOLO si el clip
  real no existe. Es VIDEO → cotizar con get_cost y pedir permiso ANTES.

## Receta 3 — Artes de comunidad SIN Higgsfield (el default diario)

Plantilla statement-3d-minimal + íconos Fluent → PNGs. Costo 0, corre en el VPS,
ya probado. Higgsfield se reserva para lo que la plantilla no puede: la cara, escenas,
realismo.

## Flujo operativo (quién hace qué)

| Paso | Quién |
|---|---|
| Spec del arte (claim, escena, modelo, prompt) | yo (sesión madre o loop VPS escribe el spec al repo) |
| Generación en Higgsfield web | **Sergio con su navegador** (yo dirijo con el spec exacto) o la sesión de creativos |
| Descargar SIEMPRE el resultado (no dejarlo en el CDN) | quien genera — regla por las 12 piezas perdidas |
| Composición final (texto, plantilla, export) | la máquina (generadores del repo) |
| Registro del lote (prompt+modelo+costo) | quien genera, en este doc |

## Vía API futura (propuesta, decide Sergio)

Higgsfield NO tiene API con key. Para que el VPS genere imagen/video sin navegador, la
puerta es **fal.ai** (API key, pago por uso, modelos flux/kling/etc.). Es dar de alta
una plataforma nueva = permiso de gasto explícito. Hasta entonces: VPS = plantillas;
navegador = Higgsfield.

## Registro de lotes

| Fecha | Pieza | Modelo | Prompt (resumen) | Costo |
|---|---|---|---|---|
| 2026-09-02 | Test CLI: overlay starburst 3D clay (usable para reel "El setup") | text2image_soul_v2 | 3D clay render, orange starburst icon, rounded square, warm white bg | 0,12 cr (cotizado = debitado ✓) |
| 2026-09-02 | Práctica: 3 candidatos mascota 3D Onia (cubo/blob/chip), pendiente §6 BASE_CONTENIDO — ver veredicto ahí | text2image_soul_v2 ×3 | toy 3D clay mascot, verde marca #1F7A4D, variando forma de cabeza (cubo / blob / chip-circuito) | 0,12 cr ×3 = 0,36 cr (cotizado y confirmado por `account transactions` antes y después) |
| 2026-09-02 | Experimento arte vs ícono (gana arte, ver §6 BASE_CONTENIDO) + portada real `carrusel-sistema-venta` | text2image_soul_v2 | 3D clay render, abstract interlocking gears, verde marca #1F7A4D, rounded toy-like, warm white bg #F7F7F7 | 0,12 cr (cotizado = debitado ✓, verificado en `account transactions`) — **total del día para este carril: 0,60 cr de 1 cr** |

### ⚠️ El tope que frena no siempre es el nuestro (02-sep)

Al pedir el arte de portada del carrusel de atención, con el gasto del carril en
**0,60 de 1 cr** y el modelo cotizado en 0,12 cr (`higgsfield generate cost
text2image_soul_v2` → `0.12 credits`), la generación falló:

```
{"error_type":"grace_daily_limit_reached", ...}
```

**Cero cargos** — verificado en `higgsfield account transactions` antes y después: la
última línea seguía siendo `2026-09-02 08:48 Seedance 1.5 Pro -4.8`, sin entrada nueva.
El límite es **de la cuenta compartida**, que ese día ya venía gastando fuerte por otro
carril (Seedance 4,8 ×3 + Nano Banana Pro 2 ×2 ≈ 18 cr antes de las 09:00).

**Lo que hay que saber:** el presupuesto propio de 1 cr/día **no garantiza** que se pueda
generar. Un carril puede tener saldo y aun así quedar bloqueado por lo que gastó otro.
La pieza tiene que poder salir sin arte pago — por eso el default sigue siendo la
Receta 3 (plantilla + íconos Fluent, costo 0), y el arte Higgsfield es un **plus de la
portada**, nunca un requisito. El carrusel de atención salió completo con íconos.

| 2026-09-02 ~17:00 UTC | Mascota cartoon 2D pedida por Sergio: intento CAPADO por `grace_daily_limit_reached` (cuenta en periodo de gracia por el cobro anual reclamado; el cupo diario ya lo consumio la otra sesion: 3x Seedance + 2x Nano Banana = 18,4 cr). CERO cargo, verificado en transactions (ultima entrada 08:48). Pendiente: generar en la primera corrida con cupo. <!-- mascota cartoon capada --> | text2image_soul_v2 (cotizado 0,12) | ver prompts exactos en docs/cola/marca-personal.md | 0 cr |
| 2026-09-02 18:0x UTC | Mascota cartoon 2D, **segundo intento** (corrida 17:56): mismo `grace_daily_limit_reached`. Cotizado antes (`generate cost text2image_soul_v2` → `0.12 credits`) y verificado despues: `account transactions` sigue encabezada por `2026-09-02 08:48 Seedance 1.5 Pro -4.8`, **sin entrada nueva** → cero cargo otra vez. Gasto del carril en el dia: **0,60 cr de 1**, sin tocar. | text2image_soul_v2 (cotizado 0,12) | prompt TILE de docs/cola/marca-personal.md | 0 cr |

### El cupo no se libera por esperar unas horas (02-sep)

Dos corridas seguidas (~17:00 y ~18:00 UTC) chocaron con el **mismo** `grace_daily_limit_reached`.
El limite es **diario y de la cuenta compartida**, y ese dia lo agoto otro carril antes de
las 09:00. Reintentar dentro del mismo dia **no sirve**: cuesta una llamada y devuelve
exactamente el mismo error. La mascota se reintenta **en la primera corrida de un dia
nuevo**, no en la siguiente vuelta. Lo unico que cambia el resultado es que pase la
medianoche del reset o que se resuelva el periodo de gracia de la cuenta.

## Lote 2026-09-07 · foto «el dueño duerme» para la landing /v4

| Dato | Valor |
|---|---|
| Job type | `text2image_soul_v2` (tomado de `higgsfield model list`, no de memoria) |
| Cotizado ANTES | `generate cost` → **0,12 créditos** |
| Job id | `5e110877-8627-4804-ba00-1c79ca8a8392` |
| Parámetros | `--aspect-ratio 16:9 --quality 2k` |
| Salida | 2048×1152 PNG → `public/fotos/dueno-duerme.webp` (1600×900, 104 KB) |
| Para qué | Sección «Cerrás vos. El negocio no.» de `/v4` — pedido de Sergio Urcullo del 1-sep repetido el 7-sep |

Prompt (inglés, para igualar el estilo cálido y cinematográfico de `public/fotos/`):

> Warm cinematic photograph, shallow depth of field, soft golden lamp light. A middle-aged
> Latin American small business owner sleeping peacefully in bed at night, seen from the side,
> calm face, soft blanket. Blurred bedroom background in muted earth tones, dark teal and warm
> amber. Natural skin texture, subtle film grain, documentary feel. No text, no logos, no screens.

Se generó desde el **VPS**: el CLI de Windows está sin sesión (`Not authenticated`).

## Lote 2026-09-21 · prueba de consistencia de avatar (video 10 del brief de Samuel)

| Dato | Valor |
|---|---|
| Vía | **MCP** (el CLI de Windows sigue sin sesión), cotizado con `get_cost:true` antes |
| Job type | `soul_2` pedido → `text2image_soul_v2` ejecutado (mismo motor, ver cabecera) |
| Soul | «Sergio ONIA v2» `bce5feb0-f028-4d1f-b2b3-96428a013f85` |
| Imágenes | 6 (4 con `soul_id`, 2 sin `soul_id` como contraejemplo) |
| Parámetros | `quality: 2k`, `aspect_ratio: 3:4` (una en `9:16`) |
| Cotizado / debitado | 0,12 cr c/u → **0,72 cr**, exacto |
| Saldo antes → después | **580,65 → 579,93** |
| Video generado | **cero** (sin permiso) |
| Salida | `hermes-content/references/marca-personal-sergio/higgsfield-avatar-21sep/` |
| Doc | `hermes-content/docs/cola/HIGGSFIELD-AVATAR-21-SEP.md` (método, prompts, shot list) |

Prompt: bloque de personaje fijo (`Young Latin American man in his early twenties, short
dark hair, clean shaven, wearing a plain navy blue polo shirt in solid unbranded fabric.`)
+ 4 bloques de escena que varían. Literal completo en el doc del video.

**Resultado, MIRADO:** las 4 con Soul son la misma cara (y coinciden con la foto real del
identity-lock, aunque el Soul **idealiza**: pelo más prolijo, brazos más musculosos). Las 2
sin Soul son **otra persona** — y ni siquiera la misma entre sí. El texto fija el *tipo*,
no la identidad.

### ⚠️ Cuarto caso de marca inventada — y el prompt decía «unbranded»

El prompt pedía literal `plain navy blue polo shirt in solid unbranded fabric` y aun así
bordó **«Maptolgan®»** en el pecho de una imagen y un logotipo ilegible en otra. Confirma
la trampa ya documentada y la **agranda**: como `soul_2` no tiene campo negativo
(`models_explore get soul_2` → sólo `quality` y `soul_id`), escribir «unbranded»
**no prohíbe, agrega la idea de marca al texto**. Después de Nike, la gorra NY y «BOLVIA»,
éste es el cuarto. **Mirar pecho, gorra y taza de cada imagen antes de publicarla.**
