# Lucia — Catalogo de ropa (fichas turnaround) 2026-07-09

Fichas de ropa controladas: cada outfit en UNA imagen, front/side/back sobre maniqui
invisible, accesorios al costado, fondo blanco, **sin marcas**. Generadas con
`nano_banana_pro`. Sirven para SABER exactamente que es cada look y para vestir a Lucia
con el outfit EXACTO en escenas originales.

## Elements registrados (usar el ID en `<<<...>>>`)

| Look | Element ID | Contenido |
|---|---|---|
| Clean girl | `cac118e1-a683-4874-b32a-eee4efbbed36` | top crema ribbed, pantalon beige, dorado minimo, cartera camel, mocasines |
| Streetwear | `db9608fd-5f72-49df-b681-9414382c5cbb` | remera blanca, jean claro straight, gorra lisa, zapatillas blancas, cartera camel |
| Night out | `3c9d1e87-ea1b-4ae1-8c5e-60683a848033` | vestido negro un-hombro midi, tacos, cartera negra, dorado, lentes |
| Loungewear | `23135bd8-8827-4bb5-9045-fe08ef80f9e1` | sweater crema + pantalon knit crema + pantuflas |
| Gym | `8352ef80-63b4-4cb1-be8b-b21cbacb22be` | top deportivo gris carbon + calza high-waist + zapatillas blancas |

Archivos locales: `outfit-01..05-*.png` + `sheet-wardrobe.png` (grilla).

## Flujo de generacion controlado (VALIDADO 2026-07-09)

**cara-Element + ficha-de-ropa-Element + escena/lugar EN TEXTO** = outfit EXACTO en
escena original, identidad lockeada.

```
<<<902eeebb-89e9-4477-8426-c555b20f7ecc>>> wearing the exact outfit from
<<<cac118e1-a683-4874-b32a-eee4efbbed36>>>, making coffee in a bright sunlit kitchen,
laughing, golden window light. Keep her identical face, freckles, hair, poreless smooth
forehead skin zero wrinkles. Authentic phone photo, no brand logos, no text, no watermark.
```

Validado: `lucia-content-bank-20260709/combo-cleangirl-kitchen.png` (outfit clean-girl
exacto, cocina original) y `combo-gym-mirror.png` (set gym exacto, gym original).

## ⚠️ Regla dura

- ✅ cara + ficha-ropa (Element) + lugar EN TEXTO -> outfit exacto, escena original.
- ✅ cara sola + todo en texto -> maxima variedad (cuando no importa el outfit exacto).
- ❌ cara + ficha-ropa (Element) + lugar-Element (imagen) -> COMPONE las fotos 1:1
  (el pitfall del 2026-07-09). El lugar va en TEXTO, salvo que se necesite un lugar
  real EXACTO (ahi si Element de lugar, ver mas abajo).

## Lugares

- **Lugar generico / original:** describirlo en texto (parte de la escena).
- **Lugar real ESPECIFICO (que debe verse igual):** conseguir 1 foto de referencia
  (Pinterest, sin marcas) y subirla como Element de `environment`, luego usar cara +
  ficha-ropa + `<<<lugar-element>>>`. Pedir a Sergio/definir cual es el lugar exacto
  antes de sourcing.

## Agregar mas ropa

Repetir el prompt de ficha turnaround ("Fashion product turnaround sheet, [outfit],
front/side/back, invisible ghost mannequin, white studio, no brand logos, no face") con
el nuevo outfit, registrar como Element `prop` con nombre `lucia-fit-<nombre>`.
