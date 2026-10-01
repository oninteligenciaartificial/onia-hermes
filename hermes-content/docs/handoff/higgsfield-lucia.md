# Handoff — Lucía v4 y Higgsfield

> Formato: [`README.md`](README.md). Se **sobrescribe**: es el estado ACTUAL del carril.
> Rama `claude/confident-ramanujan-j79bkq` (sesión en la nube, entorno `Default`). Todo está en
> `main`: PR oninteligenciaartificial/onia-hermes#42, #43 y #44, integrados por el autosync.
> Última escritura: **2026-09-30 ~02:50 UTC**, en el cambio de sesión.
> Reemplaza a `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`, que queda como historia.

## ▶ ESTADO VIGENTE — 1-oct-2026 ~05:10 UTC (lo de abajo es historia)

**Decidido y medido** (detalle en `v4/PROCEDENCIA.jsonl` y `HIGGSFIELD_VIDEO_SYSTEM.md`):
- Fotos: **Seedream 4.5 + ancla espejo** (`LUCIA-HIGGSFIELD-IDENTITY.json` → `v4.metodo_diario`), 1 cr, parecido 0,80–0,86.
- Respaldo barato: **Soul `LUCIA-v5`** `cd42c065-…` (0,12 cr, media 0,803; no llegó a principal). El v4 queda retirado.
  `LUCIA-v5b` `1fd04bfa-…` sigue en cola: cobrado (25 cr), sin uso previsto.
- B-roll: **Kling 3.0 std sin sonido** (7,5 cr / 6 s) — sostiene la cara; **falta el OK de Sergio Urcullo** al comparativo.
- Hablando a cámara: MiniMax H3, máx. 1/semana. Mezcla: 70 % fotos/carruseles, 20 % b-roll, 10 % hablando.
- Investigación de influencers IA: `hermes-content/research/competencia/LUCIA_INFLUENCERS_IA_B2B_20260930.md`
  (lecciones: declarar IA en el primer segundo, pantalla real de Onia, nada «anti-humano»).

**Falta para publicar (de Sergio Urcullo):** cuenta `@lucia.antelo.oficial` conectada a la app `OnIA Social API`
y token guardado en `/root/.config/onia-publicar/` (VPS); etiqueta de IA del perfil + bio «IA creada por
@oniahq»; OK a Kling 3.0; OK al tope ~150 cr/mes. Opcional: red del entorno `onia-higgsfield` a
instagram/tiktok/facebook/graph.facebook.com y secreto `ELEVENLABS_API_KEY`.

**Reparto:** la sesión en la nube (`onia-higgsfield`) genera con Higgsfield. Una sesión LOCAL (con el Chrome
de Sergio Urcullo) hace lo que la nube no puede: Instagram, Meta y mirar perfiles.

**Siguiente:** rehacer `cola/lucia-diario/S1-PIEZAS.md` con lo aprendido, generar los 3 primeros días y
mandar el paquete a Sergio Urcullo.

## ▶ Arranque de la sesión siguiente, en el entorno `onia-higgsfield`

Esta sesión corre en `Default` y no puede ver Higgsfield: el entorno se fija al crear la sesión.
Sergio Urcullo creó `onia-higgsfield` el 30-sep 02:26 UTC para eso. Todo lo que queda, que es
aprobar fotos, entrenar el Soul, probarlo y después el contenido diario, necesita **mirar**.

**En vuelo al cerrar: nada.** No hay trabajos corriendo en Higgsfield, ni rutinas pendientes, ni
nada sin commitear. Si esta sesión muere, no se pierde nada.

1. `git branch --show-current`. Después leé este handoff y `COORDINATION_MANIFEST.md` §EL HILO.
> **Estado 30-sep 19:50 UTC — EN VUELO:** Soul `LUCIA-v5` `cd42c065-e18c-4176-b9ad-e2de075fe362`
> (soul_2, 16 fotos del look vigente, **25 cr medidos**) lanzado 19:46 y en cola. Lote de prueba
> aprobado por Sergio Urcullo con **tope 75 cr: gastados 52,98** (8 fotos V01–V08 0,777–0,858; b-roll
> Seedance Mini / Kling 3.0 / Cinema Studio v2; Soul). Quedan del tope: 6 imágenes `soul_2` de A/B
> (0,72 cr) cuando el Soul esté `ready`. Cinema Studio 3.0 (20 cr) **no se envió**: lo bloqueó el
> control de permisos; decide Sergio Urcullo. Si la sesión muere: `show_characters status` del
> v5; NO reentrenar (otro cobro de 25). Todo el detalle en `v4/PROCEDENCIA.jsonl`.
> **Estado 30-sep 03:50 UTC — EN VUELO:** Soul `LUCIA-v4` `c4281765-c031-40ed-b430-e5fd313ef207`
> (soul_2, 20 fotos) lanzado 03:12 y **en cola (`queued`) sin arrancar** a las 03:48. Dataset de 20
> completo (D03…D13 en `PROCEDENCIA.jsonl`, 0,748–0,893). Escenas fijas Seedream: 0,884/0,749/0,766.
> Contenido viejo (L1, banco L2) ≈0,70. Audio Marcela subido: media `d0eacead-…`. Lote de video
> cotizado, **sin OK**. Si la sesión muere: chequear el Soul con `show_characters status`; NO
> reentrenar sin OK (otro cobro). Prompts Soul de las 3 escenas: `v4/prompts` pendiente de copiar
> (hoy en el scratchpad: S1 primer plano, S2 café con manos, S3 cuerpo entero en oficina).

> **Estado 30-sep 03:05 UTC (sesión en `onia-higgsfield`, rama `claude/lucia-v4-onia-higgsfield`):**
> red **confirmada** (CDN 200; la raíz da 403 de S3, no del proxy). T101–T204 bajados y MIRADOS.
> Cotizado en vivo: 7 fotos Seedream = **7 cr**. Soul: sin preflight en el MCP; la última vez
> costó **25 cr** (transacción «Soul ID», 23-ago). Saldo 533,87. **Nada lanzado: esperando el OK
> de Sergio Urcullo** para las dos cosas.

2. **Confirmá la red** con `curl -sS -o /dev/null -w '%{http_code}\n' https://d8j0ntlcm91z4.cloudfront.net/`.
   - `000` significa que el entorno no tiene los dominios: avisale a Sergio Urcullo y seguí
     midiendo en `sandbox_exec`, como se hizo acá.
   - Cualquier otro código significa que hay red. **Mirá** T201–T204
     (`v4/qa/manifest-metodos-20260929.json` trae las URLs) y el photoshoot.
3. **7 fotos nuevas**, solo con el OK de Sergio Urcullo. Recomendado: Seedream 4.5, 7 créditos.
   - Prompts: D03, D06, D07, D09, D10, D12 y D13 de `v4/prompts/dataset-vida.json`.
   - Referencias: las 7 `media_ids` de `lucia-skin-v1` como `image_references`.
   - Formato: 9:16, en lotes de 4 como máximo. Cotizá antes con `get_cost`.
   - Puntuá cada foto con `face_identity_qa.py`: el gate es 0,70 en caras frontales o de tres
     cuartos. **Además, miralas**: piel, manos, argollas y cadenita.
   - Registrá todo en `v4/PROCEDENCIA.jsonl`.
4. **Soul ID v4** (`soul_2`) con 20 fotos.
   - 13 canónicas:
     - las 6 medias de `lucia-skin-v1` sin `1714a347` (`lucia_original_sources_keep`);
     - los job_ids 01–07 del photoshoot (`trait_photoshoot_local.higgsfield_job_ids`).
   - Más las 7 nuevas.
   - **Antes, OK específico de Sergio Urcullo con el costo cotizado.**
5. **Prueba en 3 escenas fijas:** medir con 0,70 o más y mirarlas.
6. Recién ahí, el objetivo siguiente: contenido diario (vende Onia + lifestyle).

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
- **Dataset recompuesto el 30-sep: 13 fotos canónicas + 7 nuevas = 20.**
  - Las 13 canónicas ya están en Higgsfield:
    - 6 medias de `lucia-skin-v1`, sin `R2` (`1714a347`), que tiene dos personas de fondo;
    - las fotos 01 a 07 del photoshoot, por job_id.
  - Las 7 nuevas son D03, D06, D07, D09, D10, D12 y D13 de `v4/prompts/dataset-vida.json` (D11
    queda de reserva). Aportan la luz y las escenas que el photoshoot de estudio no tiene.
  - Cuesta **7 créditos con Seedream** (13 antes de recomponerlo) y 14 con Nano Banana Pro.
- **⚠️ Corregido el 30-sep: el photoshoot de 10 ángulos SÍ está en Higgsfield.**
  - Acá decía «no tiene IDs; subirlo requiere esa red». Era falso: cada PNG de
    `references/models/lucia-surgical-shoot-20260707/` trae su job en el metadato `hf-job-id`, y los
    12 jobs figuran `completed`.
  - Los IDs están en el manifest (`trait_photoshoot_local.higgsfield_job_ids`) y la medición en
    `v4/qa/identidad-photoshoot-20260930.json`.
  - Identidad: 01 da 0,738; 02, 0,744; 05, 0,703; 06, 0,758; 07, 0,729. El 04 (perfil) da 0,689:
    los perfiles bajan solos, no es deriva.
- **Red:** Sergio Urcullo creó el entorno **`onia-higgsfield`** (30-sep 02:26 UTC). `Default` sigue
  bloqueando Higgsfield; lo medí el 29-sep 23:49 UTC. Esta sesión corre en `Default`, porque el
  entorno se fija al crear la sesión: sigue midiendo en `sandbox_exec`, pero no puede mirar. **La
  próxima sesión del carril arranca en `onia-higgsfield`** y confirma primero la red con `curl` al
  CDN.
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

1. Elegir el motor de las 7 fotos nuevas. Recomendación medida: Seedream 4.5 con las 7 fotos de
   referencia (7 créditos; el total quedaría en ~44 de 100). Si al mirar le gusta más la estética de
   Nano Banana Pro, son 14 créditos.
2. ~~Agregar los dominios~~. **Hecho el 30-sep:** creó el entorno `onia-higgsfield`. Falta
   confirmarlo desde una sesión de ese entorno.
3. Borrar en la web lo que no es de Lucía.
4. Dar el OK específico del costo del entrenamiento del Soul.
5. Aprobar toda publicación.

**Próximos pasos** (cada uno con su «listo»)

1. **Dataset:** D03, D06, D07, D09, D10, D12 y D13 de `dataset-vida.json`, con las 7 `media_ids`
   como `image_references`, de a 4.
   - Cada foto se puntúa con `face_identity_qa.py`. Si da menos de 0,70 (frontal o tres cuartos),
     se regenera.
   - Listo = 7 fotos que pasan, registradas, y Sergio Urcullo conforme con la estética.
2. **Soul ID v4:** `show_characters action=train`, tipo `soul_2`, con las 20: 13 canónicas por
   media_id o job_id, más las 7 nuevas.
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
