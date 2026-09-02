# D18 — «Esta foto costó dos créditos» · primer carrusel de VENTA de Lucía

5 láminas 1080×1350 · `--pack venta-editorial --format feed` · **cero créditos**.

## Qué hueco cierra

Lucía tenía cuatro piezas en la cola y **ninguna con estructura de venta**: `D16` son cuatro
fotos con una frase cada una — exactamente el defecto que Sergio marcó en `D01` («no podés poner
una frase y nada más, explicate, desglosá»). Ésta aplica la fórmula completa.

| # | Estructura | Qué lleva |
|---|---|---|
| 01 | Foto + **frase corta** | El gancho: la foto costó dos créditos y no hay nadie en ella |
| 02 | Color + **párrafo** | El error común: pedir «una foto profesional» devuelve un catálogo |
| 03 | **Mockup de chat** | El prompt malo y el bueno, uno al lado del otro, con ❌ y ✅ |
| 04 | **Lista numerada** | Los tres pasos, cada uno con su porqué |
| 05 | Foto + **frase corta** + botón | El único CTA: `Comentá COMUNIDAD` |

**El mockup enseña el método en vez de describirlo**, que es lo que hace que alguien guarde el
post. Y es honesto: son los dos prompts reales, el que sale a catálogo y el que sale bien.

## ⚠️ Lo que se rompió: párrafo largo sobre foto

Primer render: las láminas 01 y 05 llevaban un párrafo de cuatro líneas **sobre la cara de
Lucía**. Ilegible y encima desperdicia la foto.

Intenté arreglarlo subiendo el encuadre (`object-position: 8%`) y **empeoró**: el texto seguía
igual de largo y tapaba más.

**El arreglo real no era de CSS sino de contenido: una lámina con foto no lleva párrafo.** La
foto ya está diciendo algo; el texto encima tiene que ser una frase. El desarrollo se mudó a la
lámina 02, que es de color plano y tiene lugar de sobra.

Regla para el pack: **`photo` + `body` largo no conviven.** Foto = frase; color = párrafo.

🔴 La palabra **`COMUNIDAD`** tiene que estar viva en el mapa de n8n **de la cuenta de Lucía**.
