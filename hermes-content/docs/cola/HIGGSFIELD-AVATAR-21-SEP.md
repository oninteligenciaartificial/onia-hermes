# Video 10 · «Cómo crear tu avatar con Higgsfield» — material generado

> Producido el **2026-09-21** sin la sesión de navegador de Sergio Urcullo. Las imágenes
> de este doc se generaron **de verdad**, no son mockups: cada una tiene su `job_id` y su
> cargo verificado en `transactions`. Lo que NO se pudo hacer sin su pantalla está listado
> al final, con el motivo exacto.

---

## 1 · El método que enseña el video (el real, el que usamos)

**La idea en una frase:** la cara NO va en el prompt. La cara va en el **Soul**, que se
entrena una sola vez; el prompt sólo describe la escena.

| Paso | Qué se hace | Costo |
|---|---|---|
| **1. Entrenar el Soul (una vez)** | 5-20 fotos reales de la misma persona, verificadas **una por una** antes de subirlas | **25 cr**, una sola vez |
| **2. Escribir el bloque de personaje** | Una descripción de texto **fija** (ropa, pelo, edad) que **no cambia nunca** entre generaciones | 0 |
| **3. Variar SÓLO la escena** | Pose, encuadre, fondo y luz se cambian; el bloque de personaje se copia y pega igual | 0 |
| **4. Generar** | modelo `soul_2` + `soul_id`, calidad `2k` | **0,12 cr** por imagen |
| **5. MIRAR el resultado** | Abrir la imagen y revisarla antes de aprobarla | 0 |

El Soul de Sergio Urcullo ya existe y es el que se usó: **«Sergio ONIA v2»**
`bce5feb0-f028-4d1f-b2b3-96428a013f85`. **El video no necesita entrenar uno nuevo** — el
paso 1 se narra, no se ejecuta (entrenar cuesta 25 cr y tarda ~10 min).

> ⚠️ **El nombre del modelo se saca del catálogo, nunca de memoria.** En el MCP se pide
> `soul_2`; el servidor lo ejecuta como `text2image_soul_v2` (es el **mismo** modelo, dos
> nombres del mismo motor — verificado en los 6 jobs de hoy). No es una sustitución.

---

## 2 · El prompt literal usado

**Bloque de personaje (idéntico en las 4 generaciones, copiado y pegado):**

```
Young Latin American man in his early twenties, short dark hair, clean shaven,
wearing a plain navy blue polo shirt in solid unbranded fabric.
```

**Bloques de escena (lo único que cambia):**

```
[01 · estudio frontal]
Waist-up portrait, facing the camera directly, arms crossed, calm confident expression.
Solid warm white studio background, soft even studio light. Editorial minimal photography,
natural skin texture, visible pores, sharp detail.

[02 · escritorio 3/4]
Seated at a wooden desk in a warm home office, turned three-quarters toward the camera,
one hand resting on the desk, relaxed smile. Blurred background of warm wooden shelves and
a window with afternoon light. Documentary photograph, shallow depth of field, natural skin
texture, subtle film grain.

[03 · calle, cuerpo entero]
Full body, standing on a city sidewalk at golden hour, walking toward the camera and looking
up, hands in pockets. Blurred street background in warm amber and deep teal tones.
Cinematic photograph, shallow depth of field, natural skin texture.

[04 · perfil 3/4, luz de ventana]
Close-up head and shoulders, three-quarter profile turned to his left, looking off camera,
thoughtful expression. Soft window light from the side, plain neutral grey background.
Editorial portrait photograph, natural skin texture, visible pores, sharp focus on the eyes.
```

**Parámetros:** `model: soul_2` · `soul_id: bce5feb0-…` · `quality: 2k` ·
`aspect_ratio: 3:4` (el 03 va en `9:16`).

> 🔴 **Trampa que el video tiene que decir:** `soul_2` **no tiene campo de prompt negativo**
> (verificado hoy con `models_explore get soul_2`: sus únicos parámetros son `quality` y
> `soul_id`). Todo lo que se escriba cae en el MISMO campo de texto, así que una sección
> «Avoid: …» **no prohíbe, describe**. Los prompts van 100% afirmativos.

---

## 3 · La prueba de consistencia (el corazón del video)

**Cuatro generaciones con distinta pose, distinto encuadre, distinto fondo, distinta luz
y hasta distinto formato — la misma cara.**

| Archivo | Escena | Job ID |
|---|---|---|
| `soul-01-estudio-frontal.png` | estudio, frontal, brazos cruzados, 3:4 | `ee0570df-27be-436a-8dfe-f625df0494e1` |
| `soul-02-escritorio-3-4.png` | escritorio, 3/4, sonriendo, 3:4 | `3131440e-42b2-4a23-93bd-a2404b281093` |
| `soul-03-calle-cuerpo-entero.png` | calle al atardecer, cuerpo entero, 9:16 | `51ed9317-783b-49e7-999d-fd01a990766e` |
| `soul-04-perfil-3-4-ventana.png` | primer plano, perfil 3/4, luz de ventana, 3:4 | `cb39dbd7-fc88-4f84-88de-8429e6008099` |

**Plancha comparativa lista para pantalla:** `PRUEBA-consistencia-4-generaciones.jpg`

Todo en `hermes-content/references/marca-personal-sergio/higgsfield-avatar-21sep/`.

### Veredicto MIRÁNDOLAS

**Sí, es la misma cara.** Se abrieron las cuatro y se compararon rasgo por rasgo: cejas
rectas y gruesas, nariz angosta de punta definida, labios llenos, mentón en punta, cuello
largo, pelo oscuro con volumen peinado al costado. Se mantienen en las cuatro, incluso
cambiando de plano entero a primer plano.

**Contra la foto REAL** (`references/sergio-approved-media/final-avatar-identity-lock/…/previews/IMG_0407.jpg`
y `IMG_0409.jpg`, que es el QA obligatorio de la casa): la identidad es la de Sergio Urcullo
— coinciden cejas, nariz, labios, mentón y tipo de pelo. **Con una salvedad honesta:** el
Soul **idealiza**. El pelo sale más prolijo y más corto a los costados, los brazos más
musculosos y la cara algo más madura y marcada que en la foto real. Es reconocible, no es
un calco.

---

## 4 · El contraejemplo (qué pasa si se cambia de método)

Se corrió el **mismo prompt, palabra por palabra**, quitando únicamente el `soul_id` — es
decir, confiando en que la descripción de texto («young Latin American man, short dark
hair…») alcance para sostener la cara.

| Archivo | Qué es | Job ID |
|---|---|---|
| `contraejemplo-01-sin-soul-estudio.png` | prompt 01 **sin** `soul_id` | `cbffaaf3-5c3a-4f32-a142-8c628e839d93` |
| `contraejemplo-02-sin-soul-escritorio.png` | prompt 02 **sin** `soul_id` | `42137715-0f2d-4ac5-9431-4db379772b99` |

**Plancha comparativa:** `PRUEBA-contraejemplo-sin-soul.jpg` — izquierda con Soul, centro y
derecha sin Soul.

### Veredicto MIRÁNDOLAS

**No es la misma cara, y ésa es exactamente la prueba.** Sin el Soul salió **otra persona**:
corte al ras en lugar de pelo con volumen, cara más ancha, mandíbula y nariz distintas,
contextura más pesada. Y el remate: **los dos contraejemplos tampoco son la misma persona
entre sí** — mismo texto, dos individuos diferentes.

La descripción de texto fija el *tipo* (latino, joven, polo azul). **No fija la identidad.**
Eso es lo único que hace el Soul, y es todo el argumento del video.

---

## 5 · Costo real del lote

| Dato | Valor |
|---|---|
| **Saldo ANTES** | **580,65 créditos** |
| **Saldo DESPUÉS** | **579,93 créditos** |
| **Costo real del lote** | **0,72 créditos** (6 imágenes × 0,12) |
| Cotizado antes con `get_cost:true` | 0,12 cr/imagen → **cotizado = debitado, exacto** |
| Modelo | `soul_2` (ejecutado como `text2image_soul_v2`) |
| Verificación | 6 líneas `Higgsfield Soul V2 -0.12` en `transactions`, 2026-09-21 19:58-19:59 UTC |
| Video generado | **CERO** — no había permiso y no se generó ni uno |

🔴 **Dos datos de cuenta que los docs tienen mal y hay que corregir:** la cuenta hoy está
en plan **`pro`** con **580,65 créditos**, no en «ULTRA ~2.100/3.000» como dicen
`ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md` y la memoria de agosto. El presupuesto real es
**~3,5 veces más chico** de lo que asume cualquier sesión que lea esos docs.

---

## 6 · El «qué NO hace» — honesto

1. **No evita las marcas inventadas, ni pidiéndoselo.** El prompt decía literalmente
   `plain navy blue polo shirt in solid unbranded fabric` y **igual** bordó una marca
   falsa: **«Maptolgan®»** en el pecho de la `soul-01`, y un logotipo ilegible en la
   `soul-03`. Como `soul_2` no tiene campo negativo, la palabra «unbranded» **no prohíbe**,
   sólo agrega la idea de «marca» al texto. Es el cuarto caso registrado (antes: Nike,
   gorra NY, «BOLVIA»). **Mirar pecho, gorra y taza de CADA imagen antes de publicarla.**
   Las `soul-02` y `soul-04` salieron limpias — es azar, no control.
2. **Sin Soul no hay cara.** Probado arriba: el texto solo da el tipo, no la persona.
3. **El Soul cuesta 25 cr entrenarlo**, y es un gasto de una sola vez que hay que decidir
   antes. Generar después es barato (0,12 cr); entrenar no.
4. **Idealiza.** No devuelve la cara real, devuelve una versión más prolija y más marcada.
5. **Tener saldo no garantiza poder generar.** La cuenta es compartida entre carriles y ya
   chocó dos veces con `grace_daily_limit_reached` teniendo créditos disponibles.
6. **En plan `pro` sólo corren 4 jobs en paralelo.** Hoy el 5.º fue rechazado en el acto
   (`max 4 concurrent job(s) on pro (monthly) plan`) y hubo que reenviarlo. Si el video
   muestra un lote grande, se ve este error.
7. **Nada de esto prueba video.** Acá sólo se generaron imágenes.
8. **Etiqueta de IA obligatoria** si el avatar publica en una cuenta propia.

---

## 7 · Shot list final para Samuel

| # | Qué se ve | Narración (idea) | ¿Necesita la pantalla real? |
|---|---|---|---|
| 1 | Las 4 fotos apareciendo una a una (`PRUEBA-consistencia-4-generaciones.jpg`) | «Cuatro fotos. Distinto lugar, distinta pose, distinta luz. La misma cara.» | **No** — el archivo ya existe |
| 2 | El bloque de personaje en pantalla, resaltado | «Este texto no se toca nunca. Es el mismo en las cuatro.» | **No** — es texto, §2 |
| 3 | Los 4 bloques de escena, cambiando debajo del bloque fijo | «Lo único que cambia es la escena.» | **No** — es texto, §2 |
| 4 | **El contraejemplo** (`PRUEBA-contraejemplo-sin-soul.jpg`) | «Ahora saco el Soul y dejo sólo la descripción. Mismo texto… y es otra persona. Y las dos de la derecha tampoco son la misma entre sí.» | **No** — el archivo ya existe |
| 5 | Zoom al pecho de la `soul-01`: «Maptolgan®» | «Le pedí una remera sin marca. Le inventó una. Hay que mirar cada foto.» | **No** — el archivo ya existe |
| 6 | El costo: 0,12 cr por foto, 25 cr entrenar | «Se paga con créditos. La foto es centavos; entrenar la cara, no.» | **No** — cifras de §5 |
| 7 | **Crear el Soul: subir las fotos y darle entrenar** | «Esto se hace una sola vez.» | 🔴 **SÍ** |
| 8 | **La galería de Higgsfield con el historial** | cierre / prueba de que es una cuenta real | 🔴 **SÍ** |

### Los dos tramos que siguen bloqueados, y por qué

**Sólo los pasos 7 y 8 necesitan la pantalla real de Higgsfield.** El resto del video —
que es el argumento entero — se puede montar hoy con lo que está en este doc.

- **Por qué:** el perfil persistente `E:\ONIA-YouTube\grabaciones\_perfiles\higgsfield\`
  está **vacío** (verificado). Sin cookie no hay sesión, y **no escribo contraseñas en un
  formulario**. El CLI oficial tampoco sirve de atajo: en esta PC responde
  `Error: higgsfield: request failed` → `Run: hf auth login`, o sea sin sesión también.
- **Cómo se desbloquea:** `python scripts/marca-personal/abrir_sesion.py higgsfield` en la
  terminal de Sergio Urcullo, entrar a mano una vez y cerrar la ventana. Después el tramo
  se graba por script como los demás.
- **Alternativa si no se desbloquea:** el paso 7 se narra sobre la plancha de fotos («esto
  se hace una vez, y ya está hecho») y el paso 8 se reemplaza por el cierre sobre la
  comparativa. El video **no depende** de esos dos planos.

---

## 8 · Archivos

Todo en `hermes-content/references/marca-personal-sergio/higgsfield-avatar-21sep/`:

```
soul-01-estudio-frontal.png              2k, 3:4   ⚠️ marca inventada «Maptolgan®»
soul-02-escritorio-3-4.png               2k, 3:4   limpia
soul-03-calle-cuerpo-entero.png          2k, 9:16  ⚠️ logotipo ilegible en el pecho
soul-04-perfil-3-4-ventana.png           2k, 3:4   limpia
contraejemplo-01-sin-soul-estudio.png    2k, 3:4   otra persona (a propósito)
contraejemplo-02-sin-soul-escritorio.png 2k, 3:4   otra persona distinta (a propósito)
PRUEBA-consistencia-4-generaciones.jpg   plancha de las 4 con Soul
PRUEBA-contraejemplo-sin-soul.jpg        plancha con Soul vs sin Soul ×2
```

**Para publicar sin retoque: `soul-02` y `soul-04`.** Las otras dos necesitan que se les
tape o se les borre la marca inventada del pecho.
