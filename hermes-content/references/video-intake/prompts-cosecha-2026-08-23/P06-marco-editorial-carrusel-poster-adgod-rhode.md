# P06 · Molde B del banco de carruseles: la campaña conceptual (sándwich de 10 láminas)

- **Destino:** `marketing`
- **Sale de:** [la ficha](../2026-08-23-cosecha-marco-editorial-carrusel-poster-adgod-rhode.md) · `Db2swVmk7eI` · @adgod.ai
- **Fuente:** https://www.instagram.com/p/Db2swVmk7eI/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Tres cosas concretas: (a) decidir que es 'el producto' en nuestra version — Onia no vende un objeto fisico, el equivalente son capturas del producto, y los dashboards se restilan ANTES de sacar capturas (landing v3 aprobada); (b) permiso explicito de gasto si se generan las laminas fotorrealistas en Higgsfield (regla: generacion paga = permiso caso por caso); (c) la palabra-gatillo del comentario y el texto del DM, que hoy no existen escritos. ADVERTENCIA al portar: adgod usa una marca ajena real. Nosotros no podemos — la version legitima es la campana conceptual de la marca Onia misma o de un rubro nombrado en generico, nunca de un negocio identificable que no nos contrato.

---

```text
Objetivo de esta sesión: agregar un SEGUNDO molde de carrusel al banco, y dejar armados los dos pósters de sus extremos, sin gastar un crédito.

Contexto. El carril video-intake analizó el carrusel https://www.instagram.com/p/Db2swVmk7eI/ de @adgod.ai (10 láminas, leídas todas). Descubrimiento: existe un molde de carrusel que es el OPUESTO del que ya tenemos en `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md`. El nuestro (8 slides: hook→costo→causa→resolución→prueba→CTA) pone copy en todas las láminas y persuade con argumento. El de adgod pone copy SOLO en las dos primeras y la última, deja 7 láminas mudas en el medio, y persuade por demostración de capacidad. No es mejor ni peor: sirve para otro trabajo (mostrar que sabemos hacer algo, no explicar por qué duele un problema). La ficha completa está en `hermes-content/references/video-intake/` con el slug `marco-editorial-carrusel-poster-adgod-rhode`.

QUÉ HACER

1) Escribir la sección "Molde B — campaña conceptual" en `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md`, debajo de la sección 2 (el molde de 8 slides), sin tocar ni contradecir lo que ya está. Debe decir explícitamente cuándo se usa cada molde: Molde A cuando vendemos la solución a un dolor; Molde B cuando mostramos capacidad de ejecución. La estructura del Molde B, exacta:
   - Lámina 1: póster-portada. TODO el copy conceptual + la firma + el disclaimer de IA.
   - Lámina 2: hoja de contactos. Co-branding arriba, grilla 3×2 de lo que viene, CTA blando al pie.
   - Láminas 3-9: siete piezas visuales SIN una sola palabra sobreimpresa. Reparto obligatorio: 2 con persona / 5 de objeto, en 3 escalas distintas (plano medio, pieza entera, macro), y ninguna repite tipo de plano.
   - Lámina 10: póster-cierre con el CTA duro de comentario.
   La regla de una línea que resume el molde: **el texto vive solo en los extremos**.

2) Construir la plantilla del póster (láminas 1 y 10) como HTML autocontenido en `hermes-content/references/ui-patterns/poster-editorial/`, 1440×1920 (3:4), lista para renderizar con HyperFrames. Especificación medida del original, respetala:
   - Corchetes en las 4 esquinas a ~7% del borde; marcas de registro (crosshair de imprenta) a media altura izquierda y derecha.
   - Rejilla de 3 columnas arriba y 3 al pie, con bullets `·` de separador.
   - Dos bloques de metadatos flanqueando el centro, a la altura del sujeto.
   - Titular único gigante (~85% del ancho) y TODO lo demás a cuerpo diminuto (~1,2% de la altura). Salto de escala ~20×, sin tamaños intermedios.
   - El sujeto se SOLAPA sobre el titular, tapándole el centro. Ese solape es el único recurso de profundidad; no lo omitas.
   - Grano de papel dentro de las letras del titular.
   - Paleta del original, como referencia de estructura (los valores finales salen de la identidad Onia ya cerrada, no de acá): papel `#EDE4D7`, tinta `#1A1A18`, y un solo color caliente `#C40E19` usado EXCLUSIVAMENTE en los dos puntos de firma (logo del autor y tarjeta de CTA). La regla portable es esa: el color caliente marca dónde está la venta, y no aparece en ningún otro lado.

3) Adaptar el copy del marco a Onia, respetando dos reglas duras del proyecto:
   - **No fabricar.** adgod usa una marca ajena real (rhode) sin encargo. Nosotros NO. La campaña conceptual es de la marca Onia misma, o de un rubro nombrado en genérico ("módulo dental"). Jamás un negocio identificable que no nos contrató, ni testimonios, logos o cifras de clientes.
   - **La venta nunca exhibe obra.** Nada de "muy pronto", "beta" ni "en construcción" en ninguna lámina.
   El CTA de la lámina 10 va al lead magnet YA decidido: agendar demo en cal.onia.com.bo. Si usás la mecánica comentario→DM (el circuito IG comentario→DM está vivo en producción desde el 18-ago), lo que manda el DM es el link de la demo, NO un PDF ni una guía. Dejá escritas la palabra-gatillo y el texto exacto del DM, que hoy no existen.

NO HAGAS
- No generes imágenes en Higgsfield ni en ningún generador pago: eso requiere permiso explícito de Sergio, caso por caso. Esta sesión entrega el MARCO y el MOLDE; las 7 láminas del medio quedan anotadas como pendiente con su costo estimado.
- No saques capturas de dashboards para las láminas del medio: los dashboards se restilan ANTES de las capturas (decisión de la landing v3 aprobada). Anotalo como dependencia.
- No reescribas el molde de 8 slides que ya está en el banco. Se agrega, no se reemplaza.

LISTO = `CAROUSEL_PATTERN_BANK_2026.md` tiene una sección "Molde B" con la tabla de 10 láminas y el criterio de cuándo usar A vs B; existe `hermes-content/references/ui-patterns/poster-editorial/` con el HTML renderizando las dos variantes (portada y cierre) a 1440×1920, ABIERTAS Y MIRADAS en el navegador (no solo un 200), con los corchetes, los crosshairs, el solape sujeto/titular y el color caliente apareciendo en exactamente dos lugares; y la palabra-gatillo + el texto del DM apuntando a cal.onia.com.bo están escritos en el mismo doc.
```
