# Handoff — Lucía v4 y Higgsfield

> Formato: [`README.md`](README.md). Se **sobrescribe**: es el estado ACTUAL del carril.
> Rama `claude/confident-ramanujan-j79bkq` (sesión en la nube, entorno `Default`). El PR
> oninteligenciaartificial/onia-hermes#42 quedó mergeado el 29-sep a las 22:45 UTC: el autosync
> hizo fast-forward de `main`. Lo nuevo va en un PR aparte desde la misma rama, reiniciada sobre
> `main`. Última escritura: **2026-09-30 ~00:10 UTC**.
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
- 8 pruebas con la cara original: T101–T104 con el método Element, T201–T204 con las 7 fotos
  explícitas en dos motores.

Gasto total: **37,04 créditos**. La medición de identidad costó 0; la última transacción sigue
siendo la de las 21:25:51 UTC.

**Qué quedó a medias, y dónde**

- **Medido, falta el OK de Sergio Urcullo para seguir.** La cara se midió con
  `scripts/face_identity_qa.py` (ArcFace). Coseno contra el centroide de las 8 fuentes, con el
  mismo prompt:

  | Escena | Element + Nano Banana Pro | 7 fotos + Nano Banana Pro | 7 fotos + Seedream 4.5 |
  |---|---|---|---|
  | Café | 0,822 | 0,806 | **0,883** |
  | Calle, cara chica | 0,693 | 0,683 | **0,836** |

  - **Por identidad gana Seedream 4.5 con las 7 `media_ids`**, y además cuesta la mitad.
  - Las fuentes, medida cada una contra las otras, dan 0,70–0,82. Las caras del casting dan 0,22 o
    menos.
  - La métrica no ve belleza ni piel: la estética la decide Sergio Urcullo mirando.
  - Detalle: `v4/qa/identidad-metodos-20260929.json` y `HIGGSFIELD_VIDEO_SYSTEM.md` §9.
- **Dataset listo para lanzar:** `v4/prompts/dataset-vida.json`, con 13 prompts (antes
  `dataset-12-vida.json`).
  - Pasaron a 13 porque la fuente `R2` (`1714a347`) tiene dos personas de fondo y queda fuera del
    Soul.
  - Composición del entrenamiento: 6 medias de `lucia-skin-v1` + la frontal `902eeebb` + 13 nuevas
    = 20.
  - Con Seedream son 13 créditos; con Nano Banana Pro, 26.
- **Red:** medido el 29-sep a las 23:49 UTC, sigue en 403 por política para `higgsfield.ai`,
  `upload.higgsfield.ai` y los dos CDN. Mirar sigue dependiendo de eso. **Medir ya no**: la métrica
  corre en `sandbox_exec`.
- **Photoshoot de 10 ángulos** (`references/models/lucia-surgical-shoot-20260707/`): no tiene IDs en
  Higgsfield. Subirlo requiere esa red.
- **Borrado en la web:** pendiente. Alcance corregido: no se toca nada de Lucía (manifest →
  `deletion_scope_2026_09_29`).

**Archivos y cambios**

| Archivo | Qué es |
|---|---|
| `scripts/face_identity_qa.py` | QA de identidad: SCRFD + ArcFace de insightface `buffalo_l`, con el preprocesado oficial y sin compilar nada. Recibe un manifest de URLs y devuelve JSON |
| `hermes-content/references/modelos/lucia/v4/qa/` | Manifest y resultado de la medición de métodos del 29-sep |
| `hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json` (schema v3) | Autoridad. Nuevo bloque `v4.identity_qa`: gate 0,70, línea base, ranking y exclusión de `R2` |
| `hermes-content/references/modelos/lucia/v4/PROCEDENCIA.jsonl` | Cada imagen con job, modelo, seed, método, referencias usadas y costo. Ahora también el puntaje de identidad (filas `qa_identidad`) |
| `hermes-content/references/modelos/lucia/v4/prompts/dataset-vida.json` | Los 13 prompts del dataset: cambia lo que rodea a la cara, nunca la cara |
| `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md` §«Verificado en vivo 2026-09-29» (puntos 1–9) | Términos, costos, límites, cómo se consigue la misma cara y **cómo se mide** |
| `hermes-content/docs/research/INFLUENCER_IA_PIPELINE_PRO_20260929.md` | Nodos contra código (Pletor), operación diaria, etiquetas IA y costos |

**Intentos fallidos** (y por qué, para no repetirlos)

- **🔴 El más caro: tomar como hecho una afirmación del repo sin preguntarle al creador.**
  - El manifest del 22-sep decía que la cara venía de una persona real. En realidad era un «frame
    REAL» de un video **de Higgsfield**.
  - Sobre esa premisa se planeó borrar todo y se hicieron 26 caras nuevas: 23,04 créditos y unas
    2 horas.
  - **Regla:** la procedencia de un activo se le pregunta a quien lo creó antes de descartarlo.
- **Casting v1 (C01–C12):** las «digitals» de agencia, con cara lavada y luz plana, matan la
  belleza. Sergio Urcullo lo rechazó: *«no las veo fancy o cutes»*.
- **Casting v2 (C13–C26):** caras nuevas en estilo Pinterest. Quedó sin objeto al saberse que la
  original es 100% IA.
- **`<<<element_id>>>` por MCP** mete solo 1 de las 7 fotos del Element. Medido después: en Nano
  Banana Pro, pasar 1 o 7 da la misma identidad. Lo que mueve la aguja es el motor.
- **Prompts largos (~300 tokens) que redescriben la cara:** van contra la guía oficial, que pide
  menos de ~200 tokens y describir solo el cambio.
- **Borrar por MCP, CLI o API:** no existe (ver el manifest).
- **Subir archivos del repo a Higgsfield desde la nube:** `upload.higgsfield.ai` está bloqueado, y
  las instrucciones del propio MCP prohíben pasar bytes en base64.
- **`soul_cast`:** ignora el prompt.
- **GPT Image:** da 429 si se lanzan varios a la vez.
- **Plan Pro:** máximo 4 trabajos a la vez.
- **Primer intento de borrado antes del OK explícito:** lo frenó el clasificador. Lección: pedir el
  OK antes de cualquier acción irreversible.

**Qué depende de Sergio Urcullo**

1. Elegir el motor del dataset. Recomendación medida: Seedream 4.5 con las 7 fotos (13 créditos,
   el total quedaría en ~50 de 100). Si al mirar le gusta más la estética de Nano Banana Pro, son
   26 créditos.
2. Agregar los dominios. Pasos: cloud «Default» → engranaje → Network access **Custom** → Allowed
   domains `higgsfield.ai`, `*.higgsfield.ai`, `d2ol7oe51mr4n9.cloudfront.net`,
   `d8j0ntlcm91z4.cloudfront.net`, `onia.com.bo`, `*.onia.com.bo` → «Also include default list…»
   → Save.
3. Borrar en la web lo que no es de Lucía.
4. Dar el OK específico del costo del entrenamiento del Soul.
5. Aprobar toda publicación.

**Próximos pasos** (cada uno con su «listo»)

1. **Dataset:** los 13 prompts de `dataset-vida.json`, con las 7 `media_ids` como
   `image_references`, de a 4.
   - Cada foto se puntúa con `face_identity_qa.py`. Si da menos de 0,70, se regenera.
   - Listo = 13 fotos con 0,70 o más, registradas, y Sergio Urcullo conforme con la estética.
2. **Soul ID v4:** `show_characters action=train`, tipo `soul_2`, con las 20.
   - Listo = el Soul está `ready`, aparece como Element y pasa 3 escenas fijas con 0,70 o más.
3. **Argollas y cadenita:** nombrarlas en cada prompt, o guardarlas como Element aparte si el Soul
   las pierde.
4. **Objetivo de la sesión SIGUIENTE:** contenido diario (vende Onia + lifestyle). Formato base:
   el Reel híbrido. Publicación por API, con aprobación de Sergio Urcullo.

**Congelado (anotado, no se hace ahora)**

- **«Ejército de modelos» como producto.**
  - Es la línea influencers IA, que falla las tres preguntas de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10.
  - Antes de venderlo hay que pedir a Higgsfield confirmación escrita del entrenamiento.
  - Se venden salidas, no acceso al servicio.
- **Soul nuevo de Sergio Urcullo:** es del carril marca personal. Con sus propias fotos, los
  términos lo permiten sin discusión.
