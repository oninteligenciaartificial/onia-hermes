# Prueba de motor de Lucía — cuál da el mejor resultado (2026-08-13)

> **Por qué esta prueba.** Dos docs vigentes se contradicen:
> `ONIA_MODELOS_RAIZ.md` §4 (10-ago) manda **`nano_banana_2` + Element para primer plano** y
> `soul_2` para cuerpo/escena. `HIGGSFIELD_AD_SPEC_RECETA_20260812.md` (12-ago) reafirma lo
> contrario: *"Soul + texto es el ÚNICO método para una cara consistente, Reference Elements
> sirve solo para objeto o prenda, nunca para la cara"*. Alguien tenía que medirlo.
>
> **Costo total: 4,74 créditos** de ~2.860. Nano Banana 1,5 c/u (a 1k) · Soul V2 0,12 c/u (a 2k).

## Diseño

Todo constante salvo motor y plano: mismo bloque de identidad congelado
(`RECETA_VISUAL` §2), mismo atuendo A (camisa de lino crema + jeans + cadenita), misma escena
(café tropical en Santa Cruz de la Sierra), 9:16, receta R3-UGC para el medio y R4-beauty para
el cerrado.

| | Motor | Ancla | Plano | Costo |
|---|---|---|---|---|
| **A** | `soul_2` 2k | Soul `36305a9b` | medio | 0,12 |
| **B** | `soul_2` 2k | Soul `36305a9b` | primer plano | 0,12 |
| **C** | Nano Banana 1k | Element `452d8375` (ancla) | primer plano | 1,50 |
| **D** | Nano Banana 1k | Element `452d8375` (ancla) | medio | 1,50 |
| **E** | Nano Banana 1k | Element `902eeebb` (surgical) | primer plano | 1,50 |

## Ranking (1 = mejor)

Escala 1-5. Identidad se juzga contra `references/models/pecas-clean-v2/` (frames del video
real) y contra la propia ancla.

| # | Pieza | Identidad | Piel | Adherencia al prompt | Usable como post | **Total** |
|---|---|---|---|---|---|---|
| **1** | **D · Element ancla, medio** | 5 | 5 | **5** | **5** | **20** |
| 2 | C · Element ancla, cerrado | 5 | 5 | 5 | 3 | 18 |
| 3 | E · Element surgical, cerrado | 4 | 4 | 5 | 4 | 17 |
| 4 | B · Soul, cerrado | 4 | **2** | 4 | 3 | 13 |
| 5 | A · Soul, medio | 4 | **2** | **1** | 2 | 9 |

**Ganador: D — Nano Banana + Element `452d8375`, plano medio.** Es la única que sale
publicable tal cual: atuendo exacto, café creíble con profundidad y gente al fondo, risa
natural, manos bien, props coherentes (taza, celular).

## Los tres hallazgos que cambian la receta

**1. El Soul ignoró el atuendo.** Pedí camisa de lino crema y jeans; devolvió remera blanca
de puño largo. La vía Element respetó la prenda en las 3 piezas. Esto contradice de frente la
regla escrita *"si el prompt fija UNA prenda, el modelo la repite siempre"*: la repite, sí,
pero no necesariamente la que pediste.

**2. El Soul tiñe la cara de rojo.** A y B salieron con rubor rojizo manchado en pómulos y
nariz — leen como quemada de sol, no como piel sana. **No es un defecto del modelo: es
fidelidad.** La persona del video fuente tiene piel reactiva (en los frames de QA sostiene un
tubo de SVR, línea para piel sensible). El Soul aprendió eso; la vía Element lo suaviza. O sea:
**Soul = más fiel al original · Element = más vendible.** Para una cuenta comercial, gana
Element.

**3. La premisa del doc raíz está al revés — pero no como dice el otro doc.** El raíz manda
Soul para cuerpo/escena; ahí es justo donde peor le fue (A, último puesto). Y el Soul en primer
plano **no se rompió** como afirma el raíz: B es aceptable, solo con el rojo. La falla real del
Soul no es el plano cerrado, es **el atuendo y el color de piel**.
⚠️ n=1 por celda. Suficiente para reordenar la recomendación, no para cerrarla: confirmar con
3 semillas del ganador antes de congelarlo en la receta.

## Correcciones de datos para los docs

| Dice | Es |
|---|---|
| `nano_banana_2` cuesta ~2 cr | **1,5 cr a 1k · 2 cr a 2k.** El parámetro `quality` no existe en este modelo: usa `resolution`, y **por defecto sale 1k** |
| Element es "último recurso" (`AVATAR-CONSISTENCY-SCHEME`) / "solo objeto o prenda" (`AD_SPEC_RECETA`) | Ganó las 3 primeras posiciones, incluida la cara |

## 🔴 Pregunta para Sergio, aparte del ranking

Toda la identidad de Lucía cuelga de frames de un **video de una persona real**. En los frames
de QA aparece sosteniendo un producto de marca (SVR), lo que parece contenido de una creadora.
`AVATAR-CONSISTENCY-SCHEME` ya documenta que el "video B" resultó ser **otra persona distinta**,
así que el material vino de más de una fuente. La regla propia de ONIA
(`HIGGSFIELD_AD_SPEC_RECETA` §receta) dice: *"**Nunca** foto de una persona real sin
consentimiento"*.

**No es un problema técnico y no lo puedo resolver yo: ¿de dónde salieron esos videos y hay
permiso?** Si no lo hay, el riesgo no es la calidad de la imagen — es publicar una cuenta
comercial con la cara de alguien que no lo autorizó.

---

Evidencia: `CONTACTO-primeros-planos.jpg` (2 frames reales + B, C, E) ·
`CONTACTO-anclas-y-medios.jpg` (las 2 anclas + A, D) · los 5 JPG sueltos.
