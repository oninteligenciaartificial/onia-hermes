# GUION 001 — Nuvia / ISDIN Fusion Water Magic SPF 50

- **Lane:** cliente (Nuvia). **Formato:** YouTube Short vertical 9:16, ~22s, 30fps.
- **Presentadora:** Mara (Soul `Mara ONIA v1`). **Producto real:** ISDIN Fusion Water Magic SPF 50.
- **Precio real (catalogo Nuvia):** Bs. 201 · -10% este mes -> Bs. 181.
- **Estado:** draft; nada se publica sin aprobacion de Sergio.

## Angulo

Sol en altura (Bolivia) + protector diario liviano. Hook de dolor real, mecanismo claro,
CTA a Nuvia. Claims conservadores del catalogo (proteccion alta, textura agua, no graso,
no comedogenico). Sin cura, sin antiedad, sin antes/despues.

## Gancho (0-4s)
"En altura, el sol pega mas fuerte. Y tu piel lo siente todos los dias."
- Texto en pantalla: "El sol en altura no perdona"
- Toma: Mara selfie UGC, luz natural, cerca a camara.

## Desarrollo (4-16s)
- (4-8s) "Muchos no usan protector diario porque los sienten pesados y grasosos."
  - Toma: Mara gesto de rechazo a crema pesada.
- (8-16s) "ISDIN Fusion Water Magic SPF 50: textura agua, se absorbe al toque y no deja la
  cara grasosa. Proteccion alta, para todos los dias."
  - Toma: producto (packshot real) + precio Bs. 201 + chips de beneficios.

## Cierre + CTA (16-22s)
"Lo conseguis en Nuvia. Consulta disponibilidad y te lo llevamos."
- Tarjeta final: logo Nuvia + "Conseguilo en Nuvia" + Bs. 201 (-10% este mes) + @nuvia.

## Voz / tono
Mara UGC: calido, cercano, creible, espanol latino natural, sin energia de infomercial.
(Voz IA generada aparte; requiere aprobacion para publicar.)

## Prompts visuales (Higgsfield, modelo barato)
Tomas de Mara con `soul_2` + soul_id `b8f5c353-...` (~0.12cr c/u), 9:16:
1. hook: selfie UGC bano/tocador, luz manana, expresion cercana.
2. problem: Mara mira crema pesada con leve rechazo, mismo set.
3. product: Mara sostiene un frasco de protector cerca del rostro (neutro/sin marca; el
   packshot real de ISDIN lo compone el editor).
4. cta: Mara sonrie a camara, gesto de recomendacion.
Voz: 4 lineas del `voiceover` en el spec JSON.

## Seguridad (skincare)
- Beneficios exactos del catalogo. Nada de "elimina manchas", "cura acne", "antiedad".
- Producto real de Nuvia; imagen de producto = referencia hasta media propia/aprobada.
- No exponer proveedor. Precio real, sin inventar stock ni cobro automatico.

## Siguiente comando
`node render.mjs src/data/nuvia-isdin-fusion-water-spf50-001.json` (tras dropear tomas+voz).
Aprobacion necesaria antes de publicar en YouTube.
