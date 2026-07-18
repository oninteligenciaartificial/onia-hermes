# Lucia — Content bank + metodo correcto de generacion (2026-07-09)

## Correccion importante (Sergio lo detecto)

Al generar con **cara + outfit-Element + lugar-Element** juntos, `nano_banana_pro`
**compone las fotos de referencia casi 1:1**: sale la MISMA habitacion del Element de
lugar, la MISMA ropa del flatlay, la MISMA cartera/accesorios — es "foto de referencia
con la cara pegada", NO una escena original. (Ver `sheet-hero.png` en el historial: las
4 salieron identicas a las fotos de referencia.)

## Metodo correcto para contenido ORIGINAL

**Anclar SOLO la cara** (`<<<902eeebb-89e9-4477-8426-c555b20f7ecc>>>`) y describir
outfit + lugar + accion + luz **en texto**. Cada generacion inventa una escena nueva,
manteniendo la identidad lockeada.

```
<<<902eeebb-89e9-4477-8426-c555b20f7ecc>>> Candid photo of her making coffee in a
bright sunlit kitchen, oversized cream knit sweater, laughing, steam from the mug,
golden window light. Keep her identical face, freckles, hair and features, poreless
smooth forehead skin zero wrinkles. Authentic candid phone photo, no brand logos,
no text, no watermark.
```

Resultado (`sheet-scratch.png`): 4 escenas totalmente distintas (cocina/cafe/gym/parque),
misma persona, cada una original. 2cr c/u.

## Cuando SI usar los outfit/lugar Elements

Solo cuando se necesita un objeto/lugar EXACTO real:
- Producto de cliente exacto (ej. el tubo ISDIN real) -> Element del producto.
- Un lugar real especifico que tiene que aparecer igual.
Para todo lo demas (contenido de feed, variedad), cara-Element + texto.

## Contenido en esta carpeta
- `scratch-kitchen.png` — haciendo cafe, sweater crema, cocina soleada.
- `scratch-cafe.png` — terraza de cafe con matcha, camisa lino, lentes en la cabeza.
- `scratch-gym.png` — mirror selfie post-gym, set deportivo sin marca.
- `scratch-park.png` — caminando en parque otoñal, trench camel.
- `sheet-scratch.png` — las 4 en grilla.

Todas: identidad consistente con el shoot quirurgico, forehead liso, sin logos.
