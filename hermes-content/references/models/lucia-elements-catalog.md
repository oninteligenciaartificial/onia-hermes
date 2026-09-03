# Lucia — Catalogo de Reference Elements en Higgsfield (2026-07-06)

Respuesta a "cuantas ropas y estilos hiciste": hasta el mensaje anterior, 4 outfits y 5
lugares existian solo como TEXTO en el bible (descripciones/prompts), no como imagen real
subida a Higgsfield. Esta tanda corrige eso: cada outfit/lugar es ahora **una sola imagen
real** (sourced de Pinterest, sin caras de terceros) subida como **Reference Element**
("complemento" reusable) — exactamente lo pedido.

## Elements creados (Higgsfield, categoria + id)

| Nombre | Categoria | Element ID | Fuente |
|---|---|---|---|
| `lucia-outfit-cleangirl` | prop | `16833b18-9e23-434a-99b2-92bac2915e4c` | Pinterest flatlay crema/beige/dorado |
| `lucia-outfit-streetwear` | prop | `ec1dece5-23c4-4ee3-84c6-14a49a926f7c` | Pinterest flatlay jean+remera+cartera |
| `lucia-outfit-nightout` | prop | `5503f588-d543-4925-be56-e4db560f632d` | Pinterest flatlay total black+dorado |
| `lucia-outfit-loungewear` | prop | `6186d80f-cb02-4cd2-89d9-e5afdcce7c6c` | Pinterest flatlay sweater crema+pantuflas |
| `lucia-place-bathroom` | environment | `44a4686e-1733-4b41-811d-1eb5d1cf88fc` | Pinterest bano marmol B&N sin gente |
| `lucia-place-bedroom` | environment | `6a721405-d019-48b3-b3e6-92bdf6a4474e` | Pinterest dormitorio cozy sin gente |
| `lucia-surgical-anchor` ⭐ **USAR ESTE para combos** | character | `902eeebb-89e9-4477-8426-c555b20f7ecc` | Foto 03 (sonrisa completa) del photoshoot quirurgico fondo blanco, **aprobado por Sergio 2026-07-07** como identidad definitiva. Ver `LUCIA_SURGICAL_FACE_LOCK.md` |
| `lucia-face-real-anchor` (ground-truth QA, no combos) | character | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` | Frame REAL del video de Sergio (pecas-A-15) escalado 2K, sin generacion IA — sigue siendo la verdad ultima para comparar, pero para GENERAR combos usar `lucia-surgical-anchor` |
| ~~`lucia-face-element`~~ (legacy, no usar) | character | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | Foto generada por text2image_soul_v2 — ya tiene 1 paso de deriva de IA (pecas reposicionadas, piel mas pareja) |

| `lucia-place-cafe` | environment | `5cfbdab5-3fdd-4cda-b0e3-efb60aa5a9b4` | Pinterest cafe/cocina calida, mostrador madera |
| `lucia-place-street` | environment | `cddfa484-8dea-4920-8d6b-9d00f896ae51` | Pinterest vereda urbana arbolada |
| `lucia-place-bar` | environment | `2750ef8b-7fe6-483c-9d32-01292ce32034` | Pinterest restaurante/bar terciopelo rojo |

**Completo: 4 outfits + 5 lugares + 1 cara = 10 Reference Elements.** Ya no quedan pendientes.

## ⚠️ CORRECCION 2026-07-09 (Sergio lo detecto) — NO combinar los 3 Elements para contenido normal

Combinar **cara + outfit-Element + lugar-Element** hace que `nano_banana_pro` **componga
las fotos de referencia casi 1:1**: misma habitacion exacta del Element de lugar, misma
ropa exacta del flatlay, mismos accesorios — sale "foto de referencia con la cara
pegada", NO una escena original. Se repite igual cada vez.

**Metodo correcto para contenido ORIGINAL (feed, variedad):** anclar SOLO la cara
(`902eeebb`) y describir outfit + lugar + accion + luz **EN TEXTO**. Cada foto es una
escena nueva inventada, identidad lockeada. Ver `lucia-content-bank-20260709/`.

```
<<<902eeebb-89e9-4477-8426-c555b20f7ecc>>> Candid photo of her making coffee in a
bright sunlit kitchen, oversized cream knit sweater, laughing, golden window light.
Keep her identical face, freckles, hair and features, poreless smooth forehead skin
zero wrinkles. Authentic phone photo, no brand logos, no text, no watermark.
```

**Los outfit/lugar Elements (abajo) SOLO se usan cuando se necesita un objeto/lugar
EXACTO real** (producto de cliente, un lugar especifico que debe verse igual) — no para
variedad de feed.

## (Legacy) Como se combinaban los 3 Elements — solo para match exacto

```
<<<902eeebb-89e9-4477-8426-c555b20f7ecc>>> wearing the exact outfit from
<<<16833b18-9e23-434a-99b2-92bac2915e4c>>>, standing in
<<<44a4686e-1733-4b41-811d-1eb5d1cf88fc>>>. Keep her identical face and features,
poreless smooth forehead skin zero wrinkles, no brand logos.
```

## Fix de deriva de identidad (2026-07-06, pedido de Sergio)

Sergio pidio ver la referencia usada y "perfeccionarla para que no rompa la cara". Diagnostico:
`lucia-face-element` (legacy) era una foto ya GENERADA por `text2image_soul_v2` — un paso de aproximacion
de IA sobre la real, con leve suavizado (pecas reposicionadas, piel mas pareja, labios un
toque mas llenos). Cada hop generativo adicional (ej. animar con wan2.7) compone esa deriva.

**Fix:** usar el frame REAL del video de Sergio (`pecas-A-15.png`, sin producto, sonrisa
natural) directo como ancla, en vez de una foto generada. Se escalo 720x1280 -> 2160x3840
con `bytedance_image_upscale` (2cr, sin parametros de "creatividad" que alteren rasgos) solo
para compensar la compresion de video — CERO generacion, solo mas resolucion/nitidez.
Resultado: `lucia-face-real-anchor` (`ced20cc2-3388-4d98-92ee-b0fcd961aa62`).

Verificado: mismo combo (clean-girl+bano) repetido con el ancla real da un resultado
mas fiel — sonrisa/dientes/pecas genuinamente suyas, sin el suavizado sutil de la v1.
`lucia-elements-combo-cleangirl-bathroom-v2-realface.png`.

**Regla para el futuro:** el ancla de cualquier personaje SIEMPRE debe ser el frame real
(o su version escalada), nunca una foto ya generada por otro modelo — asi se evita
acumular deriva en cadena.

**Costo: 2cr por imagen** (nano_banana_2 2k). Mas caro que text2image_soul_v2 solo (0.12cr) pero da
**fidelidad exacta del outfit/lugar real** (accesorios, joyeria, cartera, mueblaje) en vez
de una aproximacion por texto.

## Tests verificados (2026-07-06)

1. `lucia-elements-combo-cleangirl-bathroom.png` — Lucia + look clean-girl + bano, 2cr.
   Accesorios del flatlay transferidos con precision (aros, 2 collares, cartera camel,
   lentes de sol), bano de marmol fiel a la referencia.
2. `lucia-elements-combo-nightout-bar.png` — Lucia + look night-out + bar, 2cr. Trajo
   TODOS los props del flatlay (cami negra, collar con dije, aros, reloj, cartera,
   perfume, labial, lentes) + escenario de terciopelo rojo con luz calida fiel.

2/2 combos exitosos. El sistema (cara+outfit+lugar como Elements combinados en 1 llamada
nano_banana_2) queda validado para produccion.

## Estrategia de uso (cual via segun el caso)

| Necesito | Via | Costo |
|---|---|---|
| Solo la cara, escena generica/aproximada por texto | `text2image_soul_v2` + soul_id | 0.12cr |
| Cara + outfit/lugar EXACTOS de una foto real | `nano_banana_2` + 3 Elements | 2cr |
| Hablando con lip sync | `wan2_7` (still + audio) | 15cr/10s |
| UGC con producto en mano, guion auto | Marketing Studio | 42-75cr |
