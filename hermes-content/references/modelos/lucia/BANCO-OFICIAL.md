# Banco oficial de Lucía — qué existe de verdad

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
El inventario de §1 cuenta 76 imágenes; **las que se pueden publicar hoy son P1 y P6**. Todo lo
demás es material de prueba, descarte o pieza sin juzgar.

⚠️ **Y la deriva no empezó donde decía §3.** Acá se leía que la deriva estaba *"ya el 13/08"*, en
el test que eligió el método. Con la tira, **el 07/08 el lote ya traía dos caras** — seis días
antes, y antes de cualquier ancla Element. La causa del ancla (§3) sigue en pie para la
*dirección* del corrimiento; no explica la *dispersión* dentro de un lote.

---

## 5. Qué NO existe

- **No hay video aprobado como canónico.** Los 73 videos son tests de motor, renders
  intermedios y bases. El único terminado es `reel-lanzamiento-20260822/final/lucia-lanzamiento-v7.mp4`.
- **No hay pieza publicada.** Nada de esto salió a un feed.
- **No hay registro de costo por pieza** salvo donde quedó en el nombre del archivo
  (`*-5cr.mp4`, `*-12cr.mp4`, `*-16cr.mp4`, `*-24cr.mp4`, `32.5cr`).
