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

## Cómo se genera — ruta vigente 2026-09-22

> Este archivo controla **que imagen puede usarse**, no toda la arquitectura de Higgsfield. La
> politica de superficies vive en
> [`../../../docs/HIGGSFIELD_VIDEO_SYSTEM.md`](../../../docs/HIGGSFIELD_VIDEO_SYSTEM.md) y los
> IDs/estados legibles por maquina en
> [`LUCIA-HIGGSFIELD-IDENTITY.json`](LUCIA-HIGGSFIELD-IDENTITY.json).
>
> - **Element-lock / imagen protagonista:** navegador local con `@lucia-skin-v1` y QA manual.
> - **Produccion reproducible:** CLI con referencias permitidas y costo aprobado.
> - **Soul-lock:** no esta promovido; requiere dataset sintetico limpio y ganar un A/B fijo.
> - **MCP:** chat/exploracion, no backbone productivo.
> - **Playwright en VPS:** no generar ni comprar por clicks automatizados.

### Regla historica que originó el carril navegador

> 🔴 **Sergio, 2026-08-28: *"a partir de ahora no usarás MCP, harás todo desde el navegador a
> mi cuenta de Higgsfield, cometes muchos errores por MCP"*.**
>
> El motivo verificado: el MCP pedía `nano_banana_2` y el servidor resolvía a
> `nano_banana_flash` **sin avisar**. En la web el modelo se elige a mano.
>
> ⚠️ **Corregido el 2026-08-28**: acá decía que la web «no gasta créditos» por el toggle
> `Unlimited`. **Es falso.** Ese toggle abre una venta de $5 a $23 por día o semana, aparte del
> plan. Generar por web cuesta los mismos 2 créditos. No tocar el toggle sin permiso.

**El flujo Element-lock, probado en vivo:**

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

**Hoy se genera con el Element-ancla cuando la fidelidad facial es critica.** Un nuevo Soul
completamente sintetico solo puede sustituirlo despues de superar el A/B y los gates de derechos,
identidad, costo y QA. El Soul v3 existente no cumple esos gates.

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

---

# 🔴 Reconciliación de anclas — leer ANTES de disparar (2026-09-03)

> **Por qué está acá.** La Parte II de abajo la escribió el carril `calidad-generado` en su rama,
> en un archivo con **este mismo nombre**, sin ver esta parte. Al fusionarlas aparece que hablan de
> anclas distintas — y una pieza se genera con **un** UUID, así que esto no se puede dejar
> ambiguo.

Hay **tres** Elements en circulación, no dos, y el test del 13/08 comparó sólo dos de ellos:

| UUID | Nombre | Qué dice esta parte | Qué dice la Parte II (P5) | Veredicto |
|---|---|---|---|---|
| `452d8375-…` | `lucia-ancla-2026-08` | ⛔ **Jubilado**: 1 sola foto, inventaba el perfil | Sostiene la **Familia B** — es *la causa raíz de la deriva*, medido | ⛔ **NO SE USA.** Los dos lados coinciden, por caminos distintos |
| `902eeebb-…` | `lucia-surgical-anchor` | Respaldo | **La mejor de las tres** que midió: cara del canon + mejor micro-detalle | ✅ Respaldo confirmado |
| `58bbd635-…` | `lucia-skin-v1` (7 fotos) | ✅ **Ancla vigente** | **No la midió: no existía el 13/08** | ✅ Vigente — y su ventaja sobre `902eeebb…` **está sin medir** |

**Lo que esto cierra, y no costó un crédito:** la recomendación de la Parte II («cambiar el ancla
vigente a `902eeebb…`») fue escrita contra un carril que todavía disparaba `452d8375…`. Este banco
ya lo había jubilado **antes**, y las cuatro tandas del 28-ago al 02-sep se generaron con
`58bbd635…`. **No hay contradicción entre los dos documentos: hay dos relojes.** El de la Parte II
se detuvo el 13/08.

**Lo que esto NO cierra, y hay que decir que no:** nadie comparó nunca `58bbd635…` contra
`902eeebb…`. El vigente ganó por antigüedad y por tener 7 fotos (ver *«Por qué el ancla tiene 7
fotos y no 1»*), **no por una medición cara a cara**. Es una hipótesis fuerte, no un hecho
verificado — y así se escribe hasta que alguien la mida.

⚠️ **El bug que esto destapó, y que ya estaba disparando:** `452d8375…` seguía escrito como
*«ancla vigente»* en los dos documentos que **dirigen una generación** —
`ORDEN-DE-DISPARO-L3-L4-L7-L8.md` y `PRODUCCION_MES_1.md`, el plan del mes — mientras este banco y
`TECNICA-HIGGSFIELD.md` ya lo daban por jubilado. **Cuatro papeles, dos anclas, y las dos que un
generador lee para disparar tenían la mala.** Corregido en el mismo commit que esta fusión: es
exactamente *«una promesa que cambia se barre en TODA la superficie»* de `CLAUDE.md` — el cambio se
hizo donde se lo estaba mirando y no en los hermanos que llaman a lo mismo.

---

# PARTE II · Inventario contado en vivo y las dos familias de cara

> Escrita por `calidad-generado` el 2026-09-02. Se conserva **entera y sin editar**: su §3 es la
> evidencia que identifica la Familia B, y es lo que hace auditable la tabla de arriba.

**Fuente de verdad de QUÉ piezas hay y cuál es la cara canónica.** Un tema, un archivo, sin
fecha en el nombre: si cambia, se edita este. Las carpetas `*-2026MMDD/` son fotos de un día
y NO son fuente de verdad.

> **Contado en vivo el 2026-09-02** con `find` sobre
> `hermes-content/references/modelos/lucia/`. No heredado de ningún veredicto anterior.

---

## 1. Inventario — 76 imágenes y 73 videos

| Carpeta | Imágenes | Videos | Qué es |
|---|---:|---:|---|
| (raíz) | 4 | — | Anclas: `INVENTARIO-caras`, `INVENTARIO-ropa`, `FIJADO-ancla-outfits-lugares`, `STACK-rasgos-10-angulos` |
| `avatar-20260806` | 8 | — | Foto de perfil y alternativas |
| `perfil-20260806` | 8 | — | Set de perfil (P1–P6 + grid) |
| `posts-20260807` | 16 | — | 6 posts + auditorías y descartes. ⚠️ **4 de los 6 NO PASAN** — ver §4 |
| `biblioteca-20260808` | 2 | — | Café/celular |
| `calibracion-20260806` | 16 | — | L1–L15 + contacto |
| `prueba-motor-20260813` | 7 | — | **A/B Soul vs Element ancla** (ver §3) |
| `prueba-lipsync-20260815` | 12 | 11 | Comparativa de 4 motores de lipsync |
| `prueba-realismo-20260815` | 1 | — | Comparación vieja vs nuevas |
| `tanda-20260821` | — | 22 | Test de motores de video + b-roll |
| `reel-lanzamiento-20260822` | — | 24 | Reel de lanzamiento (v7 es el final) |
| `historias-20260823` | — | 16 | H01–H08, base y final |
| `l5-negocio-atiende-solo-20260823` | 1 | — | Captura de panel |
| **`generadas-20260828`** | **1** | — | **Lote más nuevo: `G06-peluqueria.jpg`** |

⚠️ **El "lote" más nuevo es UNA sola imagen.** Toda conclusión sobre "el último lote" se apoya
en n=1. No se puede medir deriva de tendencia con una pieza: se puede detectar, no cuantificar.

---

## 2. La cara canónica — rasgos que definen a Lucía

Leídos de `INVENTARIO-caras.jpg` (6 cuadros), abierto y mirado el 2026-09-02.

| Rasgo | Canon |
|---|---|
| Piel | Cálida, tostada, pareja |
| Pecas | Sí — nariz y pómulos, dispersas y finas |
| Pelo | **Castaño medio con puntas acarameladas** (efecto sol), ondulado, largo medio |
| Cejas | **Arqueadas, de grosor medio, con cola que baja** |
| Ojos | Marrones, almendrados, párpado con pliegue visible |
| Cara | **Óvalo, mandíbula suave** |
| Labios | Llenos, rosados |
| Edad aparente | **25–27** |
| Gesto por defecto | Cálido, sonriente o a punto de |
| Accesorios recurrentes | Argollas doradas chicas, cadenita fina |

---

## 3. 🔴 El banco NO contiene una sola cara: contiene DOS

**Encontrado el 2026-09-02 abriendo `prueba-motor-20260813/CONTACTO-primeros-planos.jpg`.**
La hoja de contacto de la propia prueba de motor muestra cinco cuadros que se separan en dos
familias visuales nítidas:

| | **Familia A** (la de `INVENTARIO-caras`) | **Familia B** (la que se adoptó) |
|---|---|---|
| Pelo | Castaño medio, ondulado, puntas claras | **Más oscuro, más liso** |
| Cejas | Arqueadas, grosor medio | **Rectas, gruesas, más bajas y oscuras** |
| Mandíbula | Suave, óvalo | **Más ancha y marcada; cara más larga** |
| Rubor | Marcado en pómulos y nariz | Ausente |
| Gesto | Sonriente | **Neutro, más severo** |
| Edad que aparenta | 25–27 | **28–32** |

⚠️ **Corregido 2026-09-03: el "rubor marcado" NO sirve como rasgo discriminante.** Abierto
`B-soul-closeup.jpg` a tamaño real, ese rubor no es rubor: es **piel manchada de rojo**, con la
textura pastosa y los pelos de ceja apelmazados. Es exactamente la falla que
`ONIA_MODELOS_PERFILES_ALTA_20260806.md` ya había registrado del `soul_2` en plano cerrado
(*"piel manchada de rojo, nariz difusa, dientes con artefactos"*, tras 11 avatares malos).

Y los cuadros 3, 4 y 5 de `INVENTARIO-caras.jpg` **muestran ese mismo manchón**. O sea: es
probable que el propio banco canónico tenga el artefacto del generador horneado adentro. **Se
canonizó un defecto como si fuera un rasgo de la cara.**

Consecuencia práctica: los rasgos en los que hay que confiar son los **estructurales** —
cejas (1.1), mandíbula y largo de cara (1.2), edad aparente (1.3)—, que es justo lo que la
rúbrica ya pone primero. El rubor sale de la lista.

**Esto importa más que cualquier pieza suelta:** la deriva no empezó en el lote del 28/08.
Ya estaba **el 13/08**, dentro del test que eligió el método. El ancla que quedó vigente
codifica la Familia B, y el banco de referencia de caras muestra sobre todo la Familia A. Por
eso cada pieza nueva "se corre" de forma consistente: no es azar del modelo, es el ancla.

### ✅ Resuelto el 2026-09-03: el mapeo, abriendo los cuadros SUELTOS

Acá decía *"no está resuelto qué cuadro corresponde a qué método"* porque se había mirado sólo
la hoja de contacto, que no rotula. **Pero los cuadros sueltos existen y sí traen el método en
el nombre.** Abiertos y mirados uno por uno el 2026-09-03. Evidencia guardada en
`hermes-content/docs/research/calidad-generado/evidencia-anclas-20260903/`.

**Y el test no era de dos métodos: es de TRES fuentes de identidad distintas.**

| Cuadros | Fuente | Cara que sostiene | Micro-detalle |
|---|---|---|---|
| `A-soul-medio`, `B-soul-closeup` | **Soul** `36305a9b…` (`LUCIA-REAL-v2-clean`) | **Familia A** | ✗ pastosa |
| `C-elem-ancla-closeup`, `D-elem-ancla-medio` | **Element `452d8375…`** (`lucia-ancla-2026-08`) | **Familia B** | ✓ fotográfico |
| `E-elem-surgical-closeup` | **Element `902eeebb…`** (`lucia-surgical-anchor`) | **coincide con el canon** | ✓ fotográfico |

El mapeo de `E` sale de que **`lucia-surgical-anchor` es el único Element "surgical" del
registro** (`ONIA_MODELOS_RAIZ.md` §3), y lo corrobora el píxel por dos lados independientes:
`E` tiene el micro-detalle de un Element (no la pasta del Soul) y su cara **no** es la de
`452d8375…`. Son dos líneas que convergen, no una inferencia de nombre suelta.

### 🔴 El ancla vigente es la EQUIVOCADA, y cambiarla es gratis

`ORDEN-DE-DISPARO-L3-L4-L7-L8.md` (23/08) fijó como vigente
`452d8375-fb67-4df7-9ae0-8f1b257aa51f` — **la que produce la Familia B**. Con esa se generó
`G06-peluqueria.jpg`, y por eso su cara no es la del banco.

**No es "Soul contra Element": es que hay DOS Elements y quedó escrito el que deriva.** El otro
(`902eeebb…`) da la cara del banco **y además** el mejor micro-detalle de los tres. Corregirlo
es cambiar un UUID dentro del prompt: **cero créditos.**

⚠️ Pero los papeles se contradicen sobre cuál va en primer plano, y esto **decide Sergio**:

- `ONIA_MODELOS_RAIZ.md` (sin fecha ⇒ fuente de verdad) rotula `452d8375…` como
  *"Element (PRIMER PLANO)"* y `902eeebb…` como *"Element (photoshoot)"*.
- `ONIA_MODELOS_PERFILES_ALTA_20260806.md` prescribe lo inverso y con motivo:
  `nano_banana_2 + <<<902eeebb…>>>` **para primer plano**, porque es el ancla que resolvió el
  *"se ve muy IA"*.

Los píxeles le dan la razón al segundo. Pero el que manda por regla de `CLAUDE.md` es el
primero — así que la corrección la firma Sergio, no este loop.

### La contradicción de método — qué queda de ella

La doctrina del carril de calidad dice que el aprobado es **Soul + texto** y que es *"el único
que da consistencia de cara"*. **Medido, eso es falso en primer plano de cara:** el Soul sostiene
la Familia A pero entrega piel pastosa y manchada; el Element `902eeebb…` sostiene la misma cara
**y** resuelve pelo, pestañas y pecas de verdad. La consistencia no la da el Soul: la da **usar
el ancla correcta**.

---

## 4. 🔴 Y el banco tampoco contiene una cara POR LOTE

**Encontrado el 2026-09-03 montando la tira de las seis caras de `posts-20260807`.** §3 probó que
el banco tiene dos familias *entre* métodos. Esto es peor y es aparte: **dentro de un solo lote,
del mismo día y del mismo método, hay dos caras.**

- **P1, P2, P6** → la cara del banco: óvalo suave, pecas densas, 25–27.
- **P3** → la misma cara, con los manchones rojos del `soul_2` encima.
- **P4, P5** → **otra**: cara larga y angosta, mandíbula marcada, 28–32.

Tira en `docs/research/calidad-generado/evidencia-posts-20260807/TIRA-6-caras.png`. Veredictos
pieza por pieza y salvedades de ángulo/gesto en `BITACORA-PERFECCION.md` (P7).

⚠️ **Consecuencia para este archivo:** *"qué piezas hay"* no es lo mismo que *"qué piezas sirven"*.
El inventario de §1 cuenta 76 imágenes; **P1 y P6 son las únicas que pasan el filtro visual de
ese lote**. Eso no autoriza publicación: el gate de procedencia/derechos del manifest sigue
bloqueado. Todo lo demás es material de prueba, descarte o pieza sin juzgar.

⚠️ **Y la deriva no empezó donde decía §3.** Acá se leía que la deriva estaba *"ya el 13/08"*, en
el test que eligió el método. Con la tira, **el 07/08 el lote ya traía dos caras** — seis días
antes, y antes de cualquier ancla Element. La causa del ancla (§3) sigue en pie para la
*dirección* del corrimiento; no explica la *dispersión* dentro de un lote.

---

## 4b. 🔴 Fuera del banco: `generadas-20260902/E2-B-rooftop.jpg` — seis dedos

**Dado de baja el 2026-09-03.** Su LEEME la canoniza como *"la mejor rooftop"* y por eso terminó
de **portada del carrusel fijado** del perfil. La cara es correcta; **la mano no**: sostiene el
vaso con cinco crestas de dedo de un lado y el pulgar del otro. Cómo se cuenta y por qué el
recorte de mano que ya existía no lo mostró → `BITACORA-PERFECCION.md` **P10**. Evidencia:
`docs/research/calidad-generado/L2-portada-seis-dedos.jpg`.

**No arrastra al lote.** Contadas con el mismo método, las manos de `E3-cafe.jpg` están **bien**
(3 + 3 yemas con uña). Las otras cuatro de `generadas-20260902/` no tienen manos en cuadro, así
que 2.1 no aplica y **siguen usables**: `E2-A-rooftop.jpg`, `E2-C-rooftop.jpg`, `E3-hotel.jpg`,
`E3-coworking.jpg`.

⚠️ **Y hay una consecuencia que no se ve desde acá:** `E3-cafe.jpg` es la foto base de los tres
videos del lote (`E4-cafe-kling3_0.mp4`, `E4-cafe-seedance1_5.mp4`, `E6-cafe-seedance-8s.mp4`).
Esa foto pasó, así que **los videos no quedan tocados por esta baja** — pero ninguno de los tres
fue mirado contra la rúbrica todavía, y un video hereda la mano de su foto base más lo que el
motor le agregue al moverla. **Pendiente abierto, no cerrado por omisión.**

---

## 5. Qué NO existe

- **No hay video aprobado como canónico.** Los 73 videos son tests de motor, renders
  intermedios y bases. El único terminado es `reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`.
- **No hay pieza publicada.** Nada de esto salió a un feed.
- **No hay registro de costo por pieza** salvo donde quedó en el nombre del archivo
  (`*-5cr.mp4`, `*-12cr.mp4`, `*-16cr.mp4`, `*-24cr.mp4`, `32.5cr`).
