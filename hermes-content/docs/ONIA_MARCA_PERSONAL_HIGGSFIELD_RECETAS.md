# Recetas Higgsfield — artes y reels para marca personal y comunidad

> Consolidación 2026-09-01, actualizada 2026-09-02 tras probar el **CLI oficial**.
> **La vía de producción es el CLI (`@higgsfield/cli`)** — decisión de Sergio, verificada:
> job type EXPLÍCITO (sin sustitución silenciosa), `generate cost` cotiza ANTES, y el
> cobro medido coincidió exacto (0,12 cr cotizados = 0,12 debitados). Autenticado en
> Windows y en el VPS (token OAuth oficial copiado — no es login de navegador).
> El MCP viejo sigue PROHIBIDO (sustituía modelos y cobraba). La web queda para lo
> manual/exploratorio. IMAGEN lote chico = autorizado con registro. VIDEO = permiso
> explícito caso por caso, cotizado antes. Tope del loop: 2 cr/día, solo imagen.
> Plan ULTRA: 2.019 créditos al 2026-09-02.

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
| 2026-09-29 05:14-05:30 UTC | Portadas de carrusel K1-K3 (plan 3 semanas) con `scripts/carousel_images.mjs` via CLI del VPS. Pedido explicito de Sergio Urcullo («generar imagenes con Higgsfield»), lote de prueba de 3. 2 rechazadas por QA (post de IG falso con caption inventado; letras inventadas en tazas) y regeneradas con prompt de objeto sin impresion | text2image_soul_v2 ×5 (3:4, 2k) | taza/piedras/plantin/pluma, ver briefs `sergio-k1..k3-*-20260929.json` y `out/*/assets/manifest.json` | 0,12 cr ×5 = **0,60 cr** (cotizado = debitado: saldo 573,43 → 572,83, `account status`) |
| 2026-09-29 ~11:30 UTC | Prototipo K1 v2 con el pack nuevo `referentes` (estilo Santiago): 2 acuarelas (globos, aviones de papel) pedidas por Sergio Urcullo al criticar los carruseles «vacíos». Guardadas en `hermes-content/galeria/ilustraciones/` | text2image_soul_v2 ×2 (4:3, 2k, estilo `acuarela`) | ver `galeria/galeria.json` | 0,12 cr ×2 = **0,24 cr** · total del día 0,84 cr |
| 2026-09-29 ~12:00 UTC | Opciones de estilo para la paleta verde + blanco + negro, lote aprobado por Sergio Urcullo («sí», tope 1,5 cr). 7 imágenes: acuarela ×4 (2 con firma inventada, 1 foto de papel, 1 confusa: 3 rechazadas, 1 rescatada con recorte), línea ×1 (rechazada: foto de papel), 3D arcilla ×2 (aceptadas, las mejores). Un corte por timeout NO duplicó cobro: el job en cola se recuperó con `generate wait` | text2image_soul_v2 ×7 (4:3, 2k) | ver `galeria/galeria.json` | 0,12 cr ×7 = **0,84 cr** de 1,5 · total del día 1,68 cr |
| 2026-09-29 ~13:00 UTC | Portadas K3–K9, lote aprobado por Sergio Urcullo («hazlo», 0,84 cr). 7 imágenes: 5 aceptadas, K5 rescatada con recorte (texto inventado abajo), K8 rechazada (palabra inventada en el lente; su portada queda sin imagen) | text2image_soul_v2 ×7 (acuarela ×3, clay ×4) | ver `galeria/galeria.json` | 0,12 ×7 = **0,84 cr** · total del día 2,52 cr |

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

## Lote 2026-09-30 · historias de la comunidad (4 imágenes, 0,48 cr)

Autorizó Sergio Urcullo en el chat: *«podés usar higgsfield o lo que necesites desde este entorno»*. Cotizado antes
(`get_cost`: 0,12 cr c/u), tope 0,48. Modelo `text2image_soul_v2` (estilo clay, 9:16, 2k), por el **MCP de
Higgsfield** porque en la nube el CLI no está instalado. 2 variantes de «sobres con trampa» y 2 de «comunidad en la
mesa». Elegidas las `-b` (la `comunidad-mesa-a` salió con caras verdes raras). Archivos y jobs en `galeria.json`.

## Lote 2026-10-01 · imágenes de arcilla de los carruseles K2v3, K11 y K12 (7 imágenes, 0,84 cr)

Autorizó Sergio Urcullo en el chat: *«los carruseles me gustan, tal vez más imágenes, generalas con higgsfield… y coloca
los logos e imágenes»*. Tope declarado: 2 cr. Cotizado antes con `scripts/carousel_images.mjs` sin `--yes` (0,12 cr
c/u) y generado por el **CLI del VPS** (`HF_CMD="ssh onia-vps higgsfield"`) con `flock` sobre `galeria.json`, porque
cinco subagentes escribían a la vez. Modelo `text2image_soul_v2`, estilo `clay`, 4:3, 2k.

| Carrusel | Lámina | Resultado | Costo |
|---|---|---|---|
| K2v3 | 3 · llave | aceptada | 0,12 |
| K11 | 1 · barrera | **descartada**: fondo gris (esquinas 208-225) y valla de obra en vez de barrera | 0,12 |
| K11 | 1 · barrera (regenerada) | aceptada | 0,12 |
| K11 | 4 · reloj de arena + muro | aceptada | 0,12 |
| K12 | 1 · dos vías con su tren | aceptada | 0,12 |
| K12 | 5 · tren volcado | **descartada**: el tren salió con cara, parado | 0,12 |
| K12 | 5 · vagón (regenerado) | aceptada a medias: sin cara, pero gris y sin volcar | 0,12 |

**K8 y K13 (4 imágenes, 0,48 cr) NO se generaron:** el control de permisos del modo automático frenó la generación
paga, en los subagentes y en la sesión principal. Cero cargo. Queda pendiente del «sí» explícito de Sergio Urcullo.

**Lo aprendido:** Soul 2.0 dibuja «toy train» / «locomotive» con cara (tipo Thomas) y no respeta «tipped over»; un
«boxcar» sale sin cara. La arcilla a veces sale con fondo gris claro (~210-225): sobre lámina blanca no se nota, sobre
portada VERDE queda un bloque turbio. Medí las esquinas antes de montar en verde. El `--out` de `carousel_images.mjs`
tiene que llamarse como el carrusel: el script toma de ahí el nombre del archivo y el `usado_en` de `galeria.json`.

## Lote 2026-10-02 · imágenes que faltaban en K8, K13, N03 y N04 (8 imágenes, 0,96 cr)

Autorizó Sergio Urcullo en el chat (2-oct): *«los carruceles generale las imagenes si hacen falta»*. Cotizado antes
(`carousel_images.mjs` sin `--yes`: 7 × 0,12 = 0,84) y generado por el CLI del VPS con `flock`. Esta vez el modo
automático de permisos NO lo frenó (el 1-oct sí, con el OK dado en otro mensaje).

| Carrusel | Lámina | Resultado |
|---|---|---|
| K8 | 1 · lupa + cuadro | aceptada |
| K8 | 4 · rompecabezas | aceptada |
| K13 | 1 · candado con cadena | aceptada; fondo gris (188) aclarado a blanco con flood fill desde las esquinas |
| K13 | 4 · cronómetro | **descartada** (números inventados, el 3 dos veces) |
| K13 | 4 · cronómetro, regenerado con «blank dial, no numbers» | **descartada** (igual trae números, letras en el botón y firma en el borde): la lámina queda `dato` |
| N03 | 1 · semáforo | aceptada; fondo gris (222) aclarado |
| N03 | 2 · binoculares | aceptada |
| N04 | 1 · escudo con tilde | aceptada |

**Lo aprendido:** Soul 2.0 no respeta «blank dial / no numbers»: un reloj o cronómetro siempre sale con números (y a
veces mal). Para «tiempo» usá un objeto sin cara de reloj (reloj de arena ya está repetido en K11 y N02). Un fondo
gris se arregla sin regenerar: `convert in -fuzz 14% -fill white -draw "color 0,0 floodfill"` (y las otras 3
esquinas) `-type TrueColor`.

## Lote 2026-10-02 · 32 imágenes «con criterio» para los 18 carruseles (33 trabajos, 3,96 cr)

Autorizó Sergio Urcullo en el chat (2-oct): *«Si genera mas 32 pero con criterio y que tengan sentido de lo que
hablas»*, con tope de 4 cr. Cotizado antes con `carousel_images.mjs` sin `--yes` (32 × 0,12 = 3,84) y generado por
el CLI del VPS con `flock`, de 14:14 a 14:33 UTC. Medido en `higgsfield generate list`: 33 trabajos
`text2image_soul_v2` = **3,96 cr**. El saldo bajó de 576,72 a 571,76, o sea 4,96. El crédito de diferencia salió de
dos `seedream_v4_5` de otra sesión (2-oct, 13:33 y 13:35 UTC, terracota, «front view, side view»), que no son de
este lote.

**Antes de generar:** un workflow de editor, juez adversarial, reescritura y cruce de repetidos revisó cada prompt
contra su lámina. Reescribió 30 de los 32 y cambió 3 por repetidos entre carruseles (dos balanzas, dos lupas).

| Resultado | Láminas |
|---|---|
| Aceptadas | 27 |
| Descartada y regenerada dentro del tope | DD-A 3: «coins with smooth blank faces» sacó una moneda con cara sonriente. Se rehízo como bloque grande + cubito |
| Arreglada sin regenerar | K7 4: el mango del pincel traía letras inventadas («pardYjon wrnal»); se pintaron con el color del mango (ImageMagick, trazo de 50 px) |
| Fallidas, sin presupuesto para rehacer | K9 5 (biombo con un muñeco con ojos), K5 3 (globo de diálogo que parece cara), N02 3 (el detector de metales no se reconoce), N02 7 (la palanca de cambios salió como dos hongos) |

**Lo aprendido:**
- La palabra «face» dibuja una cara, también en una moneda.
- Un objeto con forma de globo de diálogo o un biombo invitan a Soul a ponerle ojos.
- Objetos mecánicos poco icónicos (detector de metales, palanca de cambios) no se reconocen en arcilla. Mejor
  objetos de un solo golpe de vista: linterna, llave inglesa, candado.
