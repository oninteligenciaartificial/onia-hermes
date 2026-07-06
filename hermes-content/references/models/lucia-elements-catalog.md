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
| `lucia-face-element` | character | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | Foto verificada de Lucia (soul_2, identidad confirmada) |

**Pendientes (bloqueado por rate-limit de Pinterest a mitad de sesion, retomar despues):**
lugar cocina/cafe, lugar calle, lugar bar/restaurante nocturno. El guardarropa (4 looks)
esta completo.

## Como generar (combinar cara + outfit + lugar en 1 sola llamada)

Modelo: `nano_banana_2` (soul_2 NO soporta Reference Elements). Embeber los 3 placeholders
en el prompt:

```
<<<de586dbb-0cdd-4ca2-aaac-173d11741c86>>> wearing the exact outfit from
<<<16833b18-9e23-434a-99b2-92bac2915e4c>>>, standing in
<<<44a4686e-1733-4b41-811d-1eb5d1cf88fc>>>. Keep her identical face and features.
```

**Costo: 2cr por imagen** (nano_banana_2 2k). Mas caro que soul_2 solo (0.12cr) pero da
**fidelidad exacta del outfit/lugar real** (accesorios, joyeria, cartera, mueblaje) en vez
de una aproximacion por texto.

## Test verificado (2026-07-06)

`lucia-wardrobe-locations-test/lucia-elements-combo-cleangirl-bathroom.png` — Lucia +
look clean-girl + bano, 2cr. Resultado: identidad reconocible (pecas, pelo, ojos), TODOS
los accesorios del flatlay transferidos con precision (aros, 2 collares, cartera camel,
lentes de sol), bano de marmol fiel a la referencia. Combo exitoso.

## Estrategia de uso (cual via segun el caso)

| Necesito | Via | Costo |
|---|---|---|
| Solo la cara, escena generica/aproximada por texto | `soul_2` + soul_id | 0.12cr |
| Cara + outfit/lugar EXACTOS de una foto real | `nano_banana_2` + 3 Elements | 2cr |
| Hablando con lip sync | `wan2_7` (still + audio) | 15cr/10s |
| UGC con producto en mano, guion auto | Marketing Studio | 42-75cr |
