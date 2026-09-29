# Handoff — Lucía v4 y Higgsfield

> Formato: [`README.md`](README.md). Se **sobrescribe**: es el estado ACTUAL del carril.
> Rama `claude/confident-ramanujan-j79bkq` (sesión en la nube, entorno `Default`), PR
> oninteligenciaartificial/onia-hermes#42 (borrador). Última escritura: **2026-09-29 ~21:30 UTC**.
> Reemplaza a `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`, que queda como historia.

**Objetivo**

**Fijar de verdad la cara ORIGINAL de Lucía** y aprender Higgsfield entero haciéndolo. Sergio
Urcullo: *«me gusta más como era antes Lucía»* · *«NO ES CARA REAL, LA PRIMERA LUCÍA LA HICE 100%
IA»* · *«quiero que vuelvas a generar desde esa imagen, cómo conseguimos los mejores resultados,
investigá y aprendé»*. Objetivo del personaje, decidido por él: *«que vende Onia y que tenga
lifestyle»*.

**Hecho =**
1. Método ganador elegido por Sergio Urcullo mirando la comparación.
2. Dataset de 20 con procedencia.
3. Soul ID v4 (tipo `soul_2`) entrenado.
4. Prueba en 3 escenas fijas contra el stack de 10 ángulos.
5. Docs sin afirmaciones falsas.

**Qué quedó EN PRODUCCIÓN**

Nada publicado. En Higgsfield quedaron:
- el proyecto `c6c080a7-fbe9-4314-a5b5-e5f8ec6f59ad`;
- 26 caras de casting descartadas;
- 8 pruebas con la cara original: T101–T104 con el método Element, T201–T204 con las 7 fotos explícitas en dos motores.

Gasto total del día: **37,04 créditos**.

**Qué quedó a medias, y dónde**

- **Esperando a Sergio Urcullo:** que diga qué método o motor da la mejor Lucía. Galería en este orden:
  1. café, Element;
  2. café, Nano Banana Pro con 7 fotos;
  3. café, Seedream 4.5 con 7 fotos;
  4. calle, Element;
  5. calle, Nano Banana Pro con 7 fotos;
  6. calle, Seedream 4.5 con 7 fotos;
  7. coworking, Element;
  8. selfie de espejo, Element.
- **Red:** la sesión no puede MIRAR ni SUBIR a Higgsfield. Faltan `higgsfield.ai`,
  `*.higgsfield.ai` (incluye `upload.`) y los dos CDN de cloudfront en *Allowed domains*.
- **Photoshoot de 10 ángulos** (`references/models/lucia-surgical-shoot-20260707/`): no tiene IDs en
  Higgsfield. Subirlo requiere esa red. Mientras tanto, el dataset usa las 7 medias de
  `lucia-skin-v1`, que ya están en Higgsfield.
- **Borrado en la web:** pendiente. Alcance corregido: no se toca nada de Lucía (manifest →
  `deletion_scope_2026_09_29`).

**Archivos y cambios**

| Archivo | Qué es |
|---|---|
| `hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json` (schema v3) | Autoridad: cara original, fuentes a conservar con sus 7 `media_ids`, gate de derechos corregido, alcance real del borrado |
| `hermes-content/references/modelos/lucia/v4/PROCEDENCIA.jsonl` | Cada imagen del día con su job, modelo, seed, método, referencias usadas de verdad y costo, más los aprendizajes |
| `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md` §«Verificado en vivo 2026-09-29» (puntos 1–8) | Términos, costos, límites, rarezas y **cómo se consigue la misma cara** |
| `hermes-content/docs/research/INFLUENCER_IA_PIPELINE_PRO_20260929.md` | Nodos vs código (Pletor), operación diaria, etiquetas IA, costos |
| `DEPRECATIONS.md`, `LUCIA.md`, `BANCO-OFICIAL.md`, `TECNICA-HIGGSFIELD.md`, `LUCIA-V4-PERFECTION-PLAN.md` | Corregidos, con la marca ⚠️ visible |

**Intentos fallidos** (y por qué, para no repetirlos)

- **🔴 El más caro: tomar como hecho una afirmación del repo sin preguntarle al creador.** El
  manifest del 22-sep decía que la cara venía de una persona real; en realidad era «frame REAL» de
  un video **de Higgsfield**. Sobre esa premisa se planeó borrar todo y se hicieron 26 caras nuevas
  (23,04 cr y ~2 h). **Regla:** la procedencia de un activo se le pregunta a quien lo creó antes de
  descartarlo.
- **Casting v1 (C01–C12):** las «digitals» de agencia (cara lavada, luz plana) matan la belleza.
  Rechazado: *«no las veo fancy o cutes»*.
- **Casting v2 (C13–C26):** caras nuevas en estilo Pinterest. Quedó sin objeto al saberse que la
  original es 100% IA.
- **`<<<element_id>>>` por MCP:** mete solo 1 de las 7 fotos del Element. Hay que pasar las
  `media_ids` explícitas.
- **Prompts largos (~300 tokens) que redescriben la cara:** van contra la guía oficial (menos de
  ~200 tokens, describir el cambio).
- **Borrar por MCP, CLI o API:** no existe (ver el manifest).
- **Subir archivos del repo a Higgsfield desde la nube:** `upload.higgsfield.ai` está bloqueado.
  Relevar bytes en base64 está prohibido por las instrucciones del propio MCP.
- **`soul_cast`:** ignora el prompt.
- **GPT Image:** da 429 si se lanzan varios a la vez.
- **Plan Pro:** máximo 4 trabajos a la vez.
- **Primer intento de borrado antes del OK explícito:** el clasificador lo frenó. Lección: pedir el
  OK antes de cualquier acción irreversible.

**Qué depende de Sergio Urcullo**

1. Mirar la comparación (1 a 8) y decir qué método o motor da la mejor Lucía.
2. Subir el tope a ~100 créditos. Van 37,04 de los 40 aprobados.
3. Agregar los dominios. Pasos: cloud «Default» → engranaje → Network access **Custom** → Allowed
   domains `higgsfield.ai`, `*.higgsfield.ai`, `d2ol7oe51mr4n9.cloudfront.net`,
   `d8j0ntlcm91z4.cloudfront.net`, `onia.com.bo`, `*.onia.com.bo` → «Also include default list…»
   → Save.
4. Borrar en la web lo que no es de Lucía.
5. OK específico del costo del entrenamiento del Soul.
6. Toda publicación.

**Próximos pasos** (cada uno con su «listo»)

1. **Dataset:** con el método ganador, 12 fotos de vida (luz, ángulo, expresión y distancia
   variados). Se suman a las 7 medias de `lucia-skin-v1` y la frontal de `902eeebb` para llegar a 20.
   Listo = 20 aprobadas contra el stack de 10 ángulos y registradas.
2. **Soul ID v4:** `show_characters action=train`, tipo `soul_2`, con esas 20. Listo = el Soul está
   `ready`, se verificó que aparece como Element y pasó 3 escenas fijas con 88/100 o más.
3. **Argollas y cadenita:** nombrarlas en cada prompt, o guardarlas como Element aparte si el Soul
   las pierde.
4. **Objetivo de la sesión SIGUIENTE:** contenido diario (vende Onia + lifestyle), con el Reel
   híbrido como formato base, publicación por API y aprobación de Sergio Urcullo.

**Congelado (anotado, no se hace ahora)**

- «Ejército de modelos» como producto: es la línea influencers IA, que falla las tres preguntas de
  `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10. Antes de venderlo hay que pedir a Higgsfield confirmación
  escrita del entrenamiento y recordar que se venden salidas, no acceso al servicio.
- Soul nuevo de Sergio Urcullo: es del carril marca personal. Con sus propias fotos, los términos
  lo permiten sin discusión.
