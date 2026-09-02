# Bitácora de experimentación — ventana del 2026-09-02 · eje **FANCY**

> **La cola del loop.** Cada vuelta: leé esto PRIMERO, tomá el primer `PENDIENTE`, hacelo,
> y **escribí el resultado acá** antes de commitear. Sin esto cada vuelta reinventa qué probar
> y se gastan créditos midiendo lo ya medido.

## El problema que abre esta ventana

Sergio, 2026-09-02: *«experimentar para perfeccionar, **recordá que Lucía es fancy**»*.

**El banco actual no es fancy.** Es documental de barrio: peluquería, tienda de esquina, parada
de micro, mercado, ferretería, taller mecánico. Se construyó así a propósito —para que la foto
no desmienta el copy multi-rubro— y para eso funciona. **Pero no es la estética de una influencer
de IA**, que es lo que Lucía tiene que ser para que alguien la siga.

### 🎯 Y acá está el conflicto técnico que hay que resolver

`TECNICA-HIGGSFIELD.md` prohíbe `fashion campaign` y `campaign look` **porque le cambian la
cara**. Pero «fancy» es exactamente lo que esas palabras traen.

**Entonces la pregunta de la ventana es:**
> ¿Con qué léxico se consigue una imagen **fancy** (aspiracional, luz cuidada, lugar lindo)
> **sin** que el modelo pierda la cara de `@lucia-skin-v1`?

Si se resuelve, Lucía deja de parecer un banco de stock documental y pasa a ser una cuenta que
alguien quiere seguir. **Es el cuello de botella de todo el carril.**

### Qué es «fancy» acá, para que no quede a gusto de cada vuelta

| Fancy **sí** | Fancy **no** |
|---|---|
| Luz dorada de ventanal, hora dorada, sombra suave | Flash duro de estudio |
| Rooftop, café de especialidad, coworking de diseño, hotel, boutique | Pasarela, editorial de moda |
| Ropa cuidada y real (lino, tejidos con caída) | Alta costura, vestuario imposible |
| Composición con aire, profundidad, fondo desenfocado | Fondo plano de catálogo |
| **La cara de Lucía intacta** | Cara «mejorada» = ya no es ella |

🔴 **Fancy nunca puede costar la casilla 1** (la cara) ni la 7 (poros). Una Lucía linda que no es
Lucía **no sirve para nada**: lo único irreemplazable del personaje es que sea siempre la misma.

**Techo de gasto de la ventana: 250 créditos.** El corredor corta solo al llegar.

---

## Cola

### E1 · ¿Qué tan poco fancy es el banco? · **0 créditos** · HECHO
Mirá `G01..G06`, `B05..B08`, `C01`. Puntuá cada una **contra la tabla fancy de arriba**, no
contra la rúbrica técnica. **Salida:** qué piezas ya tienen algo fancy (sospecha: `C01-terraza`
y `B07`) y qué exactamente las hace verse de barrio en el resto — luz, lugar, ropa o encuadre.
Sin esto, los experimentos siguientes no saben qué corregir.

### E2 · 🎯 **El experimento central: léxico fancy que NO rompe la cara** · **~6 créditos** · HECHO
**Una escena fija** (rooftop de Santa Cruz a la hora dorada, ella apoyada en la baranda con un
café, media vuelta hacia el lente). **Tres variantes cambiando SOLO el bloque de estilo:**

| Variante | Bloque de estilo |
|---|---|
| **A · control** | `NATURAL TRUE-TO-LIFE COLORS, visible skin pores, natural asymmetry` |
| **B · fancy por la LUZ** | igual que A + `warm golden hour backlight, soft falloff, shallow depth of field` |
| **C · fancy por el OFICIO** | igual que A + `editorial portrait lighting, styled but candid, elevated everyday` |

Mismo prompt de escena, mismo seed si el CLI lo permite. **Mirá las tres al 100 %** y puntuá
casilla 1 (¿sigue siendo Lucía?) y casilla 7 (¿quedan poros?).
**Salida:** cuál da fancy sin costo de cara, y **la frase exacta** que lo logra, escrita en
`TECNICA-HIGGSFIELD.md`. Éste es el entregable que desbloquea el resto.

### E3 · Tres lugares fancy nuevos · **~6 créditos** · HECHO
Con la fórmula ganadora de E2, generá **café de especialidad**, **coworking de diseño** y
**hall de hotel**. 9:16. Las que salgan 9/9 van a `hermes-content/PARA-PUBLICAR/`.

### E4 · Seedance vs Kling sobre LA MISMA imagen · **~13,5 créditos** · HECHO
Hoy `V06` es kling sobre dental y `V07` es seedance sobre peluquería: **distinta fuente, no es
comparación.** Animá **una sola** imagen fancy de E3 con `seedance1_5` (4,8) y `kling3_0` (8,75),
mismo prompt de movimiento. Comparar: aspecto de salida, duración, audio, y casilla 9 —**la cara
aguanta el clip entero**. Conclusión con evidencia a `TECNICA-HIGGSFIELD.md`.

### E5 · ¿`--resolution 2k` se nota en la piel? · **0 créditos** · HECHO
Resuelto SIN generar: la premisa («si no se distingue, se baja y se ahorra») es **falsa en el
CLI**. `higgsfield generate cost nano_banana_pro` da **1k = 2k = 2 cr** y **2k es el default**.
No hay nada que ahorrar bajando; ver bloque en Resultados.

### E6 · ¿Se puede pedir más de 4 segundos? · **9,6 créditos** · HECHO
`V07` dio 4,05 s y un reel de 4 s obliga a encadenar. Mirá el `--help` del subcomando de video.
**Si no existe flag de duración, anotalo y NO gastes.** → Existe (`--duration 4/8/12`); ver Resultados.

### E7 · La receta fancy, consolidada · **0 créditos** · PENDIENTE
Con E1..E6 hechos, escribí en `TECNICA-HIGGSFIELD.md` **una sola receta copiable** que sale 9/9
y es fancy, con el comando exacto. Es el entregable de la ventana.

---

## Resultados

_(cada vuelta agrega su bloque: qué probó, qué midió mirando, qué decidió)_

### E1 · Auditoría fancy del banco — 2026-09-02 · 0 créditos

Abrí y miré las 11 piezas nombradas (`G01..G06`, `B05..B08`, `C01`). Puntué **fancy 0–5**
(mezcla de luz + lugar + ropa + encuadre) contra la tabla fancy, no la rúbrica técnica.
La **cara de Lucía es consistente en las 11** — el banco no tiene problema de identidad,
tiene problema de estética.

| Pieza | Fancy | Por qué |
|---|---|---|
| **C01-terraza-torre-cristal** | **4/5** | Rooftop de cristal (lugar fancy real), chaleco sastre negro, skyline desenfocado con aire. Único techo: luz de **mediodía dura/plana**, no dorada. |
| **G01-cafe-pizarra** | **3/5** | Retrato cercano, luz cálida de interior, bokeh de luces tibias, top de canalé beige. Café de barrio pero **acogedor y aspiracional** — la más fancy fuera de C01. |
| B05-micro-al-trabajo | 2/5 | Camisa de **lino crema** (mejor ropa del set barrio) + algo de luz lateral cálida, pero micro lleno con carteles → sigue leyendo documental. |
| G02-parada-de-micro | 1/5 | Cielo **gris plano**, pared descascarada, camiseta gris. |
| G03-mercado | 1/5 | Toldo verde, cajones de verdura, camiseta gris, fondo saturado. |
| G04-tienda-de-barrio | 1/5 | **Foco pelado**, heladera Coca-Cola, estantería cargada, camiseta gris. |
| G05-oficina-de-tramites | 1/5 | **Fluorescente**, pared descascarada, sillas plásticas, camiseta gris. |
| G06-peluqueria | 1/5 | **Fluorescente**, espejo viejo, shampoos genéricos, capa negra. |
| B06-consultorio-dental | 1/5 | **Fluorescente verdoso**, pared con humedad, scrub blanco. |
| B07-ferreteria | 1/5 | **Foco pelado**, delantal azul manchado, estantería de pintura. |
| B08-taller | 1/5 | **Fluorescente**, delantal con grasa, repuestos de moto. |

**Corrección de una sospecha de la bitácora:** el ítem E1 apostaba a `C01` **y `B07`**.
Mirado al 100 %, **`B07`-ferretería es barrio PURO (1/5)** — foco pelado, delantal manchado.
La segunda pieza semi-fancy real es **`G01`-café-pizarra**. (Verificar es mirar, no suponer.)

**Qué las hace verse de barrio, ordenado por peso — y esto le da el orden de ataque a E2:**
1. **LUZ (el killer #1 y el más barato de corregir).** 8 de 11 tienen fluorescente verdoso,
   foco pelado o cielo gris plano. Las **dos** semi-fancy (C01, G01) comparten una sola cosa:
   **luz natural/cálida**, no dura. → valida que la variante **B de E2 (golden hour por la LUZ)**
   es la primera palanca a probar.
2. **LUGAR.** Entornos de barrio saturados de clutter (estanterías, cables, paredes rotas).
3. **ENCUADRE.** Fondos llenos sin aire ni profundidad; solo C01 y G01 tienen bokeh/profundidad.
4. **ROPA — lo MENOS decisivo.** La camiseta gris / lino es real y correcta; el delantal es
   contextual. **Cambiar solo la ropa no da fancy** — no gastar una variante en eso.

**Conclusión para E2:** el eje causal de "fancy" es **luz > lugar > encuadre > ropa**. Empezar
por la luz. Nota de una variable: C01 ya prueba que un **lugar** fancy sube a 4/5 aun con luz
dura → si E2-B (luz dorada) confirma que la luz sola sube sin tocar la cara, **luz + lugar** es
la receta de techo.

### E2 · Léxico fancy que NO rompe la cara — 2026-09-02 · 6 créditos (3×2 cr, `nano_banana_pro`)

**Diseño de una variable:** misma referencia (`G01`), misma escena base **light-neutral**
(rooftop de Santa Cruz al atardecer, apoyada en la baranda de cristal con un café, media vuelta
al lente), variando SÓLO el bloque de estilo. 9:16, 2k, CLI headless, 3 en paralelo ~1 min c/u.
Piezas: `generadas-20260902/E2-{A,B,C}-rooftop.png` + sus `_E2-*-FACE-crop.png` al 100 %.

| Var | Bloque de estilo | Fancy /5 | Cas.1 cara | Cas.7 poros |
|---|---|---|---|---|
| **A** control | `visible skin pores, natural asymmetry` | 3,5 | ✅ Lucía nítida | ✅ poros reales |
| **B** ⭐ LUZ | A + `warm golden hour backlight, soft falloff, shallow depth of field` | **4,5** | **✅ fuerte** | **✅** |
| **C** oficio | A + `editorial portrait lighting, styled but candid, elevated everyday` | 4 | ⚠️ deriva leve | ⚠️ piel algo pulida |

**Las 3 salieron mucho más fancy que TODO el banco documental** — rooftop, aire, luz cálida,
todas leen influencer. Y **las 3 mantuvieron la cara de Lucía y los poros** (la referencia
sostuvo la identidad). El diferencial:

- **B es la ganadora.** La frase **`warm golden hour backlight, soft falloff, shallow depth of
  field`** da el look aspiracional (rim dorado + fondo desenfocado limpio) **sin costo de cara**:
  pecas y poros intactos, identidad fuerte. Es la palanca de LUZ que E1 predijo como la más barata.
- **C descartada como frase:** `editorial portrait lighting…` es fancy pero **alisa la piel y
  afina el rostro** hacia un genérico-lindo — el mismo defecto de `fashion campaign`, más suave.
  Confirma que el problema no es la palabra «fancy» sino pedir **luz de estudio/retrato**; pedir
  **luz natural dorada** sí sirve.

**Medición honesta (nota de una variable):** la escena base decía "late afternoon", así que la
variante A **no fue un control 100 % neutro** — le filtró algo de calidez. El ranking relativo
igual se sostiene (B claramente > A > la barrio del banco), pero un control más limpio pediría la
escena en luz plana. No re-medir: la conclusión de B no cambia.

**Por qué B NO se publica (no es 9/9):** miradas las 8 casillas de foto: pasa 1,3,4,6,7,8;
**falla la casilla 2** (el CLI da 1536×2752 = ratio 0,558, no el 1080×1920 exacto — necesita
export) y la **casilla 5 es débil** (sostiene el vaso, sin acción a medias). Es **CASI (8/9)**,
excelente base para animar (E4) o para regenerar con una acción a medias. No va a PARA-PUBLICAR.

**Entregable escrito** en `TECNICA-HIGGSFIELD.md` §12: la frase ganadora, el comando exacto
copiable, la frase prohibida (C) y la trampa nueva del `9:16` del CLI ≠ 1080×1920.
**El cuello de botella de la ventana queda resuelto:** hay léxico fancy que no cuesta la cara.

### E3 · La fórmula fancy en 3 lugares nuevos — 2026-09-02 · 6 créditos (3×2 cr)

Apliqué la fórmula ganadora de E2 (frase de LUZ) cambiando SÓLO la escena: **café de
especialidad**, **coworking de diseño**, **hall de hotel boutique**. Misma referencia (`G01`),
9:16, 2k, CLI. Piezas: `generadas-20260902/E3-{cafe,coworking,hotel}.png` + crops al 100 %.
**La fórmula generaliza: las 3 salieron fancy y con la cara de Lucía intacta.** Puntuación de
foto (casillas 1-8; la 9 es de video):

| Pieza | Veredicto | Detalle mirado al 100 % |
|---|---|---|
| **E3-café ⭐** | **9/9 → PUBLICABLE** | Cara Lucía nítida (la mejor de la sesión), poros reales, **manos 5+5** sobre la taza, **acción a medias** (ambas manos cradleando), luz de ventana real, cero texto, colores true-to-life. Casilla 2 resuelta con export a 1080×1920 y 1080×1350. → **`PARA-PUBLICAR/D13-lucia-cafe-fancy/`** con caption. |
| E3-coworking | CASI / ROTA | Fancy, cara ✅, pero la **pantalla del laptop tiene texto de UI corrupto → casilla 3 FALLA**, y casilla 5 débil (sin acción). El flare de sol un poco quemado. |
| E3-hotel | CASI (8/9) | Fancy, cara y poros ✅, pero **casilla 5 débil** (posada, sin acción) y **casilla 8 al límite**: tinte naranja fuerte en pelo/piel, roza el «filtro dorado». |

**Dos hallazgos nuevos (van a la técnica):**
1. 🔴 **No poner pantallas con contenido** (laptop, celular de frente, TV): la IA **rompe el texto
   de la UI** y mata la casilla 3. El coworking se cae por eso. Si hay pantalla, que esté apagada,
   de canto o fuera de foco total.
2. **La acción a medias es lo que separa 9/9 de 8/9.** El café la tiene (dos manos + taza) y por
   eso publica; E2-B, coworking y hotel no la tienen y se quedan en CASI. Confirma la casilla 5:
   una escena fancy **con un gesto a medias** es la receta de techo — y además es la mejor base
   para animar (E4).

**La ventana ya tiene su entregable doble:** receta fancy 9/9 escrita **y** una pieza publicable.

### E4 · Seedance vs Kling sobre LA MISMA imagen — 2026-09-02 · 13,55 créditos (4,8 + 8,75)

**Por fin una comparación real:** antes `V06` (kling/dental) y `V07` (seedance/peluquería) eran
**fuentes distintas** — no comparaban nada. Acá animé **la misma** imagen fancy 9/9 (`E3-cafe.png`,
la de la taza cradleada = acción a medias, la mejor base para animar), **mismo prompt de
movimiento mínimo**, `9:16`, cambiando SÓLO el modelo. Piezas: `E4-cafe-seedance1_5.mp4`,
`E4-cafe-kling3_0.mp4` + sus tiras de 4 frames `_E4-{seedance,kling}-frames.jpg` (inicio·⅓·⅔·final).

Truco de flujo que ahorró la cacería del asset id: **`--start-image` acepta un PATH LOCAL y lo
auto-sube.** No hace falta el asset id de la cuenta — se le pasa el `.png` del repo directo.

| Dimensión | **seedance1_5** (4,8 cr) | kling3_0 (8,75 cr) |
|---|---|---|
| **Costo** | **4,8** ✅ 45% más barato | 8,75 |
| **Formato (cas.2)** | **720×1280 = 9:16 exacto** ✅ | 716×1284 — casi, **necesita recorte** ⚠️ |
| **Duración** | 4,04 s · param `duration` ofrece **4/8/12** | 5,04 s · default 5 |
| **Audio (cas. de video)** | pista AAC | pista AAC — inerte para nosotros (voz va aparte) |
| **Casilla 9 — cara aguanta el clip** | **✅ los 4 frames** | ⚠️ **falla** |
| **Cómo termina** | resuelve el sorbo y **vuelve la cara a cuadro** — cierra SOBRE la cara ✅ | se queda **cabizbaja bebiendo** la mitad de atrás y **cierra con la cara tapada** por taza+pelo ❌ |

**Ganador: `seedance1_5`, decisivo.** Más barato, 9:16 exacto sin recorte, y —lo que más importa
para un reel— **su arco de movimiento devuelve la cara a cuadro**: mira→levanta→sorbe→baja→vuelve
a mirar. Kling se compromete con la pose de beber y **muere enterrado en la acción**, que es medio
defecto de `V04` en versión suave: la identidad se sostiene donde la cara se ve, pero el clip no
termina sobre ella y pierde ~medio de contacto visual.

**Hallazgo de modelo (no de prompt):** con el MISMO prompt, seedance **cierra la acción** y kling
**la sostiene abierta**. Para Lucía —donde el último frame de un reel tiene que ser su cara— eso
hace a seedance la elección correcta más allá del precio.

**Cruce con E6 (gratis, ya visto):** `higgsfield model get seedance1_5` muestra `duration: 4,8,12`
(default 4). O sea **sí se puede pedir más de 4 s** en seedance sin encadenar — E6 queda casi
respondido sin gastar; falta sólo medir el costo de 8/12 s (otra vuelta).

**El clip de seedance es b-roll Story-ready (9/9 de video).** NO lo copio a `PARA-PUBLICAR/`:
la escena café ya está publicada como `D13` (la foto fija), y meter un clip casi idéntico de la
misma escena es sobre-publicar la misma cara. Queda disponible en `generadas-20260902/` para
cuando Sergio arme un reel; publicar es su decisión.

### E5 · ¿`--resolution 2k` se nota en la piel? — 2026-09-02 · **0 créditos** (decidido por precio)

**No se generó nada, y esa es la respuesta correcta.** La variable que decide E5 no es cómo se ve
la piel: es **cuánto se ahorra bajando la resolución**. Medido en el CLI con `higgsfield generate
cost nano_banana_pro` (mismo prompt base de E2, 9:16, consulta gratis):

| resolución | costo | nota |
|---|---|---|
| `1k` | **2 cr** | mismo precio que 2k |
| `2k` | **2 cr** | **es el DEFAULT** del modelo (`higgsfield model get nano_banana_pro`) |
| `4k` | 4 cr | el doble |

**Conclusión — la premisa de E5 está muerta:** bajar a `1k` **no ahorra un solo crédito**, y `2k`
ya viene por defecto. Aunque `1k` se viera idéntico al 100 %, la decisión sería la misma: **usar
2k siempre**. Gastar 4 cr en comparar piel de una decisión ya tomada es tirar créditos — por eso
se cierra mirando el precio, no la foto. (Confirma en el CLI lo que `TECNICA §🔻` ya decía del
navegador: «2K cuesta lo mismo que 1K».)

**Dato de píxeles medido, para no re-medirlo:** `2k` + `9:16` en el CLI = **1536×2752** (ratio
0,558), verificado con `ffprobe` en `E3-cafe.png`, `E2-B-rooftop.png` y `E3-hotel.png` — las tres
idénticas. **No es 1080×1920:** toda pieza publicable necesita el export (casilla 2), como ya
resolvió E3-café. → va a `TECNICA-HIGGSFIELD.md`.

**Lo que E5 NO responde (queda como futuro, es OTRO experimento):** si `4k` (4 cr, el doble) da
poros visiblemente mejores para una pieza *hero*. Ahí sí habría una decisión de plata real. Hoy
no se toca — cada pieza normal va a 2k y punto.

### E6 · Clips de 8 s: ¿aguanta la cara el arco largo? — 2026-09-02 · 9,6 créditos

**Parte gratis (flag + costo), primero.** El `--help` del subcomando de video no lista params; se
leen con `higgsfield model get seedance1_5`: hay `duration = 4,8,12` (default 4). O sea **sí se
puede pedir más de 4 s sin encadenar**. Costo medido con `generate cost` (gratis), **lineal ~1,2
cr/s**: 4 s = 4,8 · 8 s = 9,6 · 12 s = 14,39. Con eso la pregunta literal de E6 quedaba respondida
sin gastar — pero el flag no dice lo que de verdad importa para Lucía: **¿la cara aguanta el doble
de tiempo?** Eso sólo se sabe mirando, así que un experimento de UNA variable (misma `E3-cafe.png`,
mismo prompt de sorbo de E4, sólo `4 s → 8 s`) sí valía los 9,6 cr.

**Diseño de una variable:** idéntico a E4-seedance salvo `--duration 8`. Piezas:
`generadas-20260902/E6-cafe-seedance-8s.mp4` + `_E6-seedance-8s-frames.jpg` (6 frames:
0·1,6·3,2·4,8·6,4·7,9 s) + `_E6-FACE-compare.png` (crop 100 % del **primer vs último frame**).

Salida técnica: **720×1280 = 9:16 exacto**, **8,04 s**, audio AAC.

| Casilla | Veredicto (mirado, no supuesto) |
|---|---|
| **1 · cara** | **✅ aguanta los 8 s.** Crop 100 % inicio vs final: misma Lucía — mismos ojos/cejas, gesto igual. |
| **7 · poros** | **✅** pecas en nariz/mejillas y textura de piel **visibles al inicio Y al final**, sin alisado. |
| **9 · cara en el clip entero** | **✅** los 6 frames son ella; **cierra sobre su cara** (taza abajo, mirando al lente). |

**El hallazgo que no da el flag (⚖️ trade-off de duración):** con el mismo prompt de sorbo, seedance
**estira el gesto para llenar el doble de tiempo** — el clip de 8 s pasa ~3 s del medio (≈t1,6–4,8)
con la **taza tapando la boca**. La cara nunca se pierde, pero hay más "tiempo muerto" bebiendo que
en los 4 s tensos de E4. Regla escrita a `TECNICA §16`: **4 s = máximo contacto visual por segundo**
(reel donde cada segundo muestra la cara); **8/12 s = b-roll largo/relajado** donde no molesta que
el medio sea el sorbo. 8 s no es "peor": llena el tiempo extra con MÁS del mismo gesto, no con
acción nueva.

**No va a PARA-PUBLICAR:** es la MISMA escena café que ya se publicó (`D13` foto) y que E4 (seedance
4 s). Un tercer corte casi idéntico de la misma cara es sobre-publicar. Queda de b-roll en
`generadas-20260902/` para cuando Sergio arme un reel. Entregable de la vuelta: la receta de
duración escrita en `TECNICA §16` con el comando exacto y la regla 4 s vs 8/12 s.
