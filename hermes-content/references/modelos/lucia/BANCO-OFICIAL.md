# Banco oficial de Lucía — qué se puede usar HOY

> **Este archivo manda sobre qué imagen de Lucía entra en una pieza.** Se lee ANTES de
> escribir un brief. Si una foto no está en la lista blanca de abajo, no se usa: no importa
> que se vea linda, que esté en el repo, ni que otra pieza vieja la haya usado.
>
> Nace del error del 2026-08-28: se produjeron L08 y L09 con el banco `calibracion-20260806`,
> que Sergio había descartado el 15-ago. `LUCIA.md` lo decía, pero tiene 50 KB y el dato
> estaba en la línea 90. Un archivo largo no es una fuente de verdad consultable.
>
> El detalle de personaje, voz, prompts y motores sigue en [`LUCIA.md`](LUCIA.md). Acá van
> **solo los archivos** y **solo el veredicto**.

---

## Cómo se genera — SOLO por navegador

> 🔴 **Sergio, 2026-08-28: *"a partir de ahora no usarás MCP, harás todo desde el navegador a
> mi cuenta de Higgsfield, cometes muchos errores por MCP"*.**
>
> El motivo verificado: el MCP pedía `nano_banana_2` y el servidor resolvía a
> `nano_banana_flash` **sin avisar**. En la web el modelo se elige a mano.
>
> ⚠️ **Corregido el 2026-08-28**: acá decía que la web «no gasta créditos» por el toggle
> `Unlimited`. **Es falso.** Ese toggle abre una venta de $5 a $23 por día o semana, aparte del
> plan. Generar por web cuesta los mismos 2 créditos. No tocar el toggle sin permiso.

**El flujo, probado en vivo:**

1. `higgsfield.ai` → **Image** → **Create Image**.
2. En el prompt escribir `@` + el nombre: **`@lucia`** autocompleta a **`@lucia-skin-v1`**.
   Reemplaza al `<<<uuid>>>` del MCP.
3. Modelo **Nano Banana Pro**, aspecto 3:4.
4. Generar (2 créditos) y **mirar** el resultado ampliado.

La receta de prompt que funciona está en [`TECNICA-HIGGSFIELD.md`](TECNICA-HIGGSFIELD.md).

La web además tiene funciones que el MCP no expone: **AI Influencer**, Soul ID Character, Soul
Moodboard, Canvas, Relight.

---

## La cara

**No se genera con Soul. Se genera con el Element-ancla.**

| Rol | Qué | ID |
|---|---|---|
| **ANCLA** — con esto se genera | `lucia-skin-v1` · **7 fotos**: frontal canon, 3/4 medio, casi frontal, casi perfil, 3/4 izq, 3/4 der y frontal alta. Va como `<<<58bbd635-…>>>`, motor `nano_banana_2` @ 2k | `58bbd635-9b90-4bd2-b08a-1cd4915bd563` |
| **RESPALDO** — si el ancla falla en un encuadre | `lucia-surgical-anchor` | `902eeebb-89e9-4477-8426-c555b20f7ecc` |
| ⛔ **Jubilado** — 1 sola foto, inventaba el perfil | `lucia-ancla-2026-08` | `452d8375-…` |
| **VARA de QA** — se compara, NO se genera | `STACK-rasgos-10-angulos.jpg` | — |

⛔ **Soul `36305a9b` (LUCIA-REAL-v2-clean): PROHIBIDO.** Sale con la piel roja, ignora el
atuendo pedido, y se entrenó con frames de una persona real sin permiso documentado.
⛔ **Soul v3 `e6d8703c`:** perdió el A/B del 22-ago y le cambia el color de ojos a gris azulado.

### Cómo se reconoce la cara correcta

Piel oliva de **tono parejo** con textura · **pecas contables** en nariz y pómulos ·
**argollas doradas chicas** + cadenita fina · ojos marrones almendrados · cejas gruesas
oscuras · pelo castaño ondulado a los hombros.

### Cómo se reconoce la MUERTA (la que hay que rechazar)

**Mejillas y nariz rojas o inflamadas**, tipo rosácea, con las pecas tapadas por la rojez ·
cara más redonda · pelo más lacio y parejo. Es la piel de la persona real del video fuente.
**Si la cara está roja, la foto está mal. Es la señal más rápida que hay.**

### Rasgos sagrados (nunca se limpian)

`pecas` > `argollas de oro + cadenita` > `algo terracota #E4714E en cuadro`.

✅ **El color de marca de sus piezas es el VERDE de Onia `#00D26A`.** Sergio, 2026-08-28:
*"usa color verde siempre"* — *"Lucía es verde porque es de Onia y Onia es verde"*. El
terracota es dirección de arte DENTRO de la foto (una taza, una pared), no el acento gráfico.

---

## ✅ Lista blanca — lo único que se puede usar en una pieza

| Carpeta / archivo | Qué hay | Formato |
|---|---|---|
| `generadas-20260830-lujo/` | ⚠️ **VACÍA — no hay ni una imagen.** Se creó el 30-ago junto con la decisión de `LUCIA.md` §3-ter y nunca se produjo la tanda. Está en la lista blanca del gate, así que el gate la aprobaría: no la uses como evidencia de que el look nuevo existe | — |
| `tanda-20260821/` | **El banco principal.** 10 PNG: `L1`, `L1b`, `L2`, `L2b`, `L3`, `L4`, `L4b`, `L5`, `L5b`, `L6` | 896×1200 (3:4) |
| `tanda-20260821/BROLL-TEST/` | `IMG-01`…`IMG-05` + `frame-ugc-0s`, `frame-ugc-6s` | varía |
| `prueba-realismo-20260815/` | `r1-cafe`, `r2-calle`, `r3-escritorio` | 1792×2400 (3:4) |
| `biblioteca-20260808/` | **Solo** `13-cafe-celular.jpg` y `14-cafe-tecleando.jpg` (las otras 10 nunca bajaron) | 1856×2304 (4:5) |
| `avatar-20260806/FOTO-PERFIL-LUCIA.jpg` | **Solo ese archivo** de esa carpeta. Es la foto de perfil | 1:1 |
| `historias-20260823/` | Lo más reciente. 8 historias | 9:16 |
| `reel-lanzamiento-20260822/final/` + `qc/` | El reel v7 y su tira de QC | 9:16 |
| `prueba-motor-20260813/` | **Solo** `C-elem-ancla-closeup`, `D-elem-ancla-medio`, `E-elem-surgical-closeup` | 9:16 |

El render de carrusel es **1080×1350 (4:5)**, así que el 3:4 de `tanda` y `prueba-realismo`
entra con recorte mínimo. Las 9:16 se recortan fuerte: sirven para historias, no para carrusel.

---

## 🔴 Lista negra — archivado en `_ARCHIVO-NO-USAR/`

| Qué | Por qué |
|---|---|
| `calibracion-20260806/` (las 15, incluidas v2 y v3) | **Piel roja del Soul prohibido.** Es la carpeta que rompió L08 y L09 |
| `perfil-20260806/` (completa) | Misma rojez |
| `avatar-20260806/` salvo `FOTO-PERFIL-LUCIA.jpg` | Rojez; y dos archivos son directamente **otra cara** |
| `prueba-soul-v3/A-soul-v3.png` | Ojos gris azulados, pecas borradas |
| `prueba-motor-20260813/A-soul-medio`, `B-soul-closeup` | Tomas del Soul perdedor |
| `references/models/pecas-clean-v2/`, `pecas-source-frames/` | Frames de una persona real. Dejaron de ser la vara el 15-ago |
| `references/models/lucia-content-bank-20260709/`, `lucia-demos-20260709/` | Banco viejo con look de IA, rechazado por Sergio |

**Mixta, no se archiva pero no se usa en bloque:** `posts-20260807/` es el workspace activo
(ahí viven los briefs). De su banco de fotos, `P1-hace-un-ano.jpg` es canónica; `P3` y `P5`
tienen piel roja; `P2`, `P4` y `P6` tienen deriva de estructura.

### Docs superados que ordenan lo contrario

- `docs/ONIA_MODELOS_RAIZ.md` — se autodeclara "este índice manda", es del 10-ago y manda usar
  el Soul prohibido. **Superado por `LUCIA.md`.**
- `docs/ONIA_FORMATOS_ADENDA_PERSONAJES.md` — del 24-ago, planifica con "Soul de Lucía".

---

## Por qué el ancla tiene 7 fotos y no 1 (ni 30)

Sergio, 2026-08-28: *"¿por qué en elements de Lucía solo hay una foto? ¿no tiene que haber la
skin completa?"*. Tenía razón: con una sola selfie de espejo, **el modelo inventaba el perfil,
el tres cuartos y las proporciones** en cada generación.

Pero 30 fotos tampoco: **un Element no entrena, inyecta referencias en el momento de generar**,
y ahí la variedad se promedia. Las 20-80 fotos son la receta de un *Soul*, que es otro
mecanismo. El punto correcto son **5-7 imágenes muy coherentes entre sí** que cubran los
ángulos que faltan — misma luz, misma piel, mismos rasgos.

⚠️ **CORREGIDO el 2026-08-29: un Element SÍ se puede editar — pero solo desde la web.**

Acá decía "no se puede editar, el enum es `list`/`get`/`create`". Eso es cierto **del MCP**, y yo
lo generalicé a la herramienta entera. **La web sí puede**: en el menú `…` de cualquier imagen hay
**`Assign to element`**, y también **`Create Element`**.

🪤 **La trampa que lo escondía:** el diálogo abre con el filtro **"Empty elements only"** tildado,
así que muestra *"No elements yet"* y parece que no hay a dónde asignar. **Destildándolo aparecen
todos**, `@lucia-skin-v1` incluido.

**Lo que esto habilita:** reforzar el ancla con las mejores fotos nuevas (G05, G05c) **sin crear
un Element nuevo ni actualizar el UUID en todos los docs**, que era el costo que nos frenaba.

### ⚠️ 29-ago: Sergio dijo "reforzá" — y G05/G05c NO son las fotos para eso

Se frenó antes de ejecutarlo, con el criterio que este mismo archivo ya tiene escrito:

> *"El punto correcto son **5-7 imágenes muy coherentes entre sí** que cubran los ángulos que
> faltan — **misma luz, misma piel, mismos rasgos**."*

**G05 y G05c son ESCENAS, no retratos.** Luz fluorescente plana, cara chica, una de perfil y la
otra en tres cuartos, y con otra persona en cuadro. **No cubren un ángulo que falte: cubren un
lugar.** Y como un Element **no entrena, inyecta referencias al generar**, más fotos no es mejor:
más fotos COHERENTES es mejor. Dos inconsistentes empujan el promedio hacia esa luz.

**Lo que sí reforzaría:** generar 2-3 retratos limpios **con el ancla actual** —frontal y tres
cuartos, luz pareja—, mirarlos, y agregar esos. **2 créditos cada uno.** Es un bucle de refuerzo
de verdad: el ancla mejora con su propia salida, filtrada por el ojo.

⚠️ **Y falta un dato antes de tocar nada: no sabemos si una foto se puede QUITAR de un Element.**
Si no se puede, una foto mala es permanente. Averiguarlo va primero.

🔴 **Pero NO se hizo, y no se hace de paso.** Tocar el ancla cambia **toda** generación futura de
su cara. Es una decisión de Sergio, con su prueba A/B antes y después. Queda anotado, no ejecutado.

⚠️ **`action: list` devuelve SOLO la primera media de cada element.** Verificar siempre con
`action: get`, o un element de 7 fotos parece tener 1.

## Cómo se hace cumplir

No depende de que alguien se acuerde. `scripts/carousel_gate.js` valida toda ruta de imagen de
una pieza de Lucía contra esta lista blanca y **falla antes de renderizar** si aparece una
descartada. La lista vive en `scripts/lucia_banco.json`, y este archivo es su explicación.
