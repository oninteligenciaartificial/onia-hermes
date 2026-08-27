# Carrusel de papel con subrayado a mano

> Portado de la ficha **Q04** (IG `DcYltt_IK30`, lote 2026-08-24). Primera pieza hecha con
> él: `oniahq/render/O05` — la mnemotecnia O-N-I-A.

## Para qué sirve

**Para convertir una lista larga en algo que se recuerda.** Ese es el uso, y el único.

El original agrupa 20 herramientas de marketing en cinco "vitaminas" por letra inicial. Una
lista de 20 cosas es ilegible; agrupada en cinco grupos, se recuerda. **La restricción
arbitraria es lo que vuelve memorable el contenido, no el diseño.**

Si lo que tenés no es una lista, este molde no es el tuyo.

## Cómo se usa

```bash
node scripts/carousel_gate.js  --brief <brief.json> --pack papel-subrayado
node scripts/carousel_render.js --brief <brief.json> --pack papel-subrayado \
  --account onia --out <salida>
```

El brief declara por lámina:

```json
{ "letra": "O",
  "headline": "*Ordenar* lo que está suelto",
  "body": "una línea de contexto",
  "items": [ { "rotulo": "El catálogo", "nota": "con precio, costo y código" } ] }
```

**Cuatro `items` por lámina.** Ni tres ni cinco: la grilla es 2×2 y el molde vive de que sea
siempre igual.

## Las dos reglas que lo rompen si se olvidan

### 1. La plantilla es IDÉNTICA en todas las láminas

Mismo titular, misma grilla, mismo lugar del rótulo. **A la tercera lámina el ojo deja de
leer la estructura y va directo a lo que cambia.** Variar el layout "para que no aburra" es
exactamente lo que mata el efecto.

Lo único que rota es **el color del subrayado** y la forma del trazo — tres curvas distintas,
para que dos subrayados seguidos no salgan calcados. Un subrayado perfectamente igual al
anterior delata la plantilla y mata lo artesanal, que es el punto.

### 2. 🔴 No se copian las métricas del original

El original mete tarjetitas de `+15%`, `+120%`, `−15%` **sin fuente**. Es textura de
credibilidad: números puestos para que se vea serio. **Para nosotros eso es fabricar**, y con
cero clientes pagando está prohibido por el catálogo.

Si va un número, va con su fuente. Si no hay fuente, no va número.

## El estilo, y por qué cada decisión

| Elemento | Valor | Por qué |
|---|---|---|
| Fondo | `#F2F0E9` papel hueso **con grano** | Sin el grano el fondo plano delata la plantilla y se pierde lo artesanal |
| Titular | Fraunces (serif) | El molde es cálido; una sans lo vuelve corporativo |
| Subrayado | 5 colores rotando, opacidad `.42` | Colores de resaltador **apagados**: un flúor sobre papel hueso lo vuelve digital |
| Letra grande | 28 % del ancho | Es el ancla de la mnemotecnia: tiene que verse antes que el titular |
| Grilla | 2×2, `margin-top:auto` | Anclada abajo, siempre en el mismo lugar |

## Cuándo NO usarlo

Es el **opuesto exacto** de `dark-product`: cálido, imperfecto y artesanal en vez de frío y
disciplinado. Los dos funcionan — **pero no en la misma pieza, y conviene no alternarlos en
el mismo día del calendario**, porque leídos seguidos parecen dos marcas distintas.

- Pieza de **producto con capturas** → `dark-product`
- Pieza de **dolor con ambiente** → `editorial-photo`
- Pieza de **lista memorable** → este
