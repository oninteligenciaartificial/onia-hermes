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

### E7 · La receta fancy, consolidada · **0 créditos** · HECHO
Con E1..E6 hechos, escribí en `TECNICA-HIGGSFIELD.md` **una sola receta copiable** que sale 9/9
y es fancy, con el comando exacto. Es el entregable de la ventana. → §17, ver Resultados.

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

### E7 · La receta fancy 9/9 consolidada — 2026-09-02 · **0 créditos**

**Cierre de la ventana FANCY.** No se generó nada: E7 es puramente de escritura. E1–E6 habían
probado cada variable por separado y el hallazgo quedaba **disperso en §12–16** — una sesión nueva
que quisiera «hacer una foto fancy de Lucía» tenía que leer cinco secciones y reensamblar el flujo
a mano. E7 lo funde en **una sola receta copiable de punta a punta**: `TECNICA-HIGGSFIELD.md §17`.

**Qué contiene §17 (autocontenido, se copia entero):**
1. **Los 4 ingredientes que hacen 9/9 fancy**, cada uno con su origen y por qué es obligatorio:
   frase de LUZ (E2), lugar fancy real (E1/E3), gesto a medias con las dos manos (E3, es lo que
   separa 9/9 de 8/9), y la guarda anti-pantallas (E3, salva la casilla 3).
2. **Comando de imagen** (`nano_banana_pro`, 2 cr) anclado al **café D13 — la única pieza que ya
   pasó las 9 casillas por este camino** — con la instrucción de cambiar SÓLO el lugar y el gesto.
3. **Export ffmpeg** a 1080×1920 / 1080×1350 (resuelve la casilla 2, que ninguna generación de CLI
   pasa cruda porque el «9:16» del CLI es 1536×2752 ≈ 0,558, no 0,5625).
4. **Puntuar mirando** antes de publicar, y el paso opcional de **animar con `seedance1_5`** (el
   ganador de E4/E6: 9:16 exacto, cierra sobre la cara, `--start-image` no `--image-references`).
5. **Tabla de costos de la receta completa:** foto 9/9 = **2 cr**; con b-roll de 4 s = **6,8 cr**.

**La lista de frases prohibidas quedó junta en §17** (`fashion campaign`, `campaign look`,
`editorial portrait lighting`, `hair pulled back tight`) con su reemplazo aprobado — antes estaba
partida entre §12 y la sesión del 31-ago.

🎯 **La ventana entrega lo que Sergio pidió:** una receta que sale **fancy** (luz dorada, lugar
lindo, aire) **sin costar la cara** (casilla 1 y 7 intactas), escrita como un flujo que **no
requiere volver a experimentar** — se copia y sale. Y deja además una pieza publicable (`D13`).
El cuello de botella de todo el carril —«fancy le cambia la cara»— queda **resuelto y documentado
como receta operativa**, no sólo como hallazgo.

### E8 · El bloqueo NO es un cupo diario: la cuenta entera no genera — 2026-09-02 · **0 créditos** · ⛔ **REFUTADO**

> ⚠️ **Corregido 2026-09-03 (carril docs-auditoría). Esta sección llegó a la conclusión contraria
> a la verdadera, y su consecuencia operativa nº 1 mandaba al carril al lado equivocado.**
>
> **`grace_daily_limit_reached` SÍ era un cupo diario, y sí servía esperar al día siguiente.** Al
> cambiar de fecha la generación volvió sola, sin que Sergio tocara nada y sin entrar por navegador:
>
> | Pieza | Cuándo (UTC) | Cómo |
> |---|---|---|
> | `generadas-20260902/E5-hotel-seedance.mp4` (4,8 MB) | **2026-09-03 00:39** | mismo CLI, mismo `seedance1_5` |
> | `generadas-20260902/E7-rooftop-seedance.mp4` (4,6 MB) | **2026-09-03 03:39** | ídem |
>
> Lo dice también el propio log del carril, `/var/log/onia-loop-lucia-ugc.log:146`: *«el
> `grace_daily_limit_reached` del 02-sep no era bloqueo permanente — era la cuota diaria. Al cambiar
> de día volvió a funcionar sin tocar nada, con el mismo comando que ayer no se pudo lanzar»*.
>
> **Por qué la refutación de abajo no refutaba nada.** La tabla del 21-ago compara **créditos
> gastados** y **piezas generadas**, y concluye que no hay tope diario porque ese día se gastó 4×
> más sin cortar. Pero un cupo `grace_*` no cuenta créditos ni piezas —por eso rebotaba igual el
> modelo de 0,12 cr, que la sección leyó como prueba de que el bloqueo era total—. **Se midió con
> la unidad equivocada, y el resultado pareció una prueba.** Es la trampa de siempre: una
> investigación que no puede refutar su propia hipótesis se vuelve más convincente con cada
> medición, no más cierta. Lo barato era esperar un día; lo caro fue escalarlo a Sergio.
>
> **Lo que SÍ bloquea hoy es otra cosa, medida el 2026-09-03 13:20 La Paz:**
> `higgsfield account status` → salida `Error: Session expired. Hint: Run: hf auth login`, **exit 2**.
> No es el plan ni el saldo: es la sesión del CLI, y sólo se arregla con un `hf auth login`
> interactivo. Ojo con el instrumento: el error sale por **stderr**, así que un `... | head` se
> traga el código de salida y el chequeo parece verde.

**La vuelta salió a animar `E3-hotel.jpg`** (el pendiente heredado, 4,8 cr, dentro del tope) y
volvió a chocar con `grace_daily_limit_reached`. En vez de anotar «el límite sigue» y esperar al
día siguiente —que es lo que decía el pendiente— se midió **qué es** el límite. La respuesta
cambia el plan del carril, así que la vuelta entrega eso.

**Error idéntico en los tres intentos, palabra por palabra:**

```json
{"data":{"modal_data":{"elapsed_days":1},"type":"unlock_full_access_notice"},
 "error_type":"grace_daily_limit_reached"}
```

| Prueba | Modelo | Costo | Resultado |
|---|---|---|---|
| Animar `E3-hotel.jpg` | `seedance1_5` (video) | 4,8 cr | ⛔ `grace_daily_limit_reached` |
| Imagen nueva (vuelta previa) | `nano_banana_pro` | 2 cr | ⛔ mismo error |
| **Imagen más barata del catálogo** | `text2image_soul_v2` | **0,12 cr** | ⛔ **mismo error** |
| `generate cost` de todos ellos | — | **gratis** | ✅ responde normal |

🔴 **El dato que decide: falla el modelo de 0,12 créditos.** Una cuenta con **1948,66 créditos** y
plan `ultra` (`higgsfield account status`, verificado en vivo) no puede gastar doce centavos de
crédito. El bloqueo **no es de video, ni de modelos caros, ni de gasto**: es de **toda creación**.
Cotizar sigue gratis y sigue funcionando, que es lo que hacía parecer que la herramienta estaba viva.

**Y la hipótesis del cupo diario queda REFUTADA por el historial de la propia cuenta**
(`account transactions`, 200 movimientos leídos):

| día | créditos gastados | generaciones | ¿cortó? |
|---|---|---|---|
| **2026-09-02** | **72,67** | **25** | **sí, a las 08:48 UTC** |
| 2026-08-23 | 83,30 | 29 | no |
| **2026-08-21** | **313,45** | **69** | **no** |

Si hubiera un tope diario de créditos o de piezas, el 21-ago —**4× el gasto y casi 3× las
generaciones**— habría cortado mucho antes que el 02-sep. No cortó. **El corte del 02-sep no lo
causó el consumo de ese día.**

**Última generación exitosa: 2026-09-02T08:48:46 UTC** (Seedance 1.5 Pro, 4,8 cr). Al reintentar
a las 21:39 UTC seguía bloqueado: **~13 h sin poder generar nada**.

**Pista observada, sin explicación probada:** las cinco últimas generaciones del día salieron a
**exactamente una por hora** — 04:49 · 05:49 · 06:48 · 07:49 · 08:48 — mientras que antes de las
04:41 hubo ráfagas de tres en el mismo segundo. Parece un goteo forzado antes del corte total,
pero **es una observación, no un mecanismo probado**: no la tomes como causa.

⚠️ **Lo que NO sabemos, y no se inventa.** `unlock_full_access_notice` + `elapsed_days: 1` **suena**
a un cambio de estado de la suscripción (una ventana de «gracia» con acceso recortado), y el
historial muestra que la cuenta ya osciló antes — `Task Reward Cashback Paused` el 27-ago (−80 cr)
y `Resumed` el 01-sep (+80 cr). **Pero eso es una hipótesis, no una medición**, y desde el CLI no
hay forma de refutarla: `account status` informa `ultra` y 1948 créditos, o sea que **la API
miente por omisión sobre el estado que de verdad bloquea**. Sólo se ve entrando a la cuenta por
navegador.

**Consecuencia operativa para el carril, hasta que se destrabe:**

1. ~~**No sirve esperar al día siguiente.** El pendiente de `E3-hotel` no está esperando cupo: está
   esperando a Sergio.~~ ⛔ **Falso, ver la corrección del encabezado.** Sí servía esperar: al día
   siguiente generó dos videos sin intervención de nadie. Lo que hoy espera a Sergio es el
   `hf auth login`, que es otro problema.
2. **Toda vuelta que planee generar tiene que cotizar primero** (`generate cost` es gratis y sigue
   vivo) **y aceptar que `create` puede rebotar**. Plan B de cero créditos, siempre.
3. **No reintentar en bucle.** Tres intentos de tres modelos distintos dieron el mismo error: el
   cuarto no aporta información. Se reintenta **una** vez por vuelta, y si rebota, se hace trabajo
   de 0 créditos.

**Método que hay que repetir:** el pendiente decía «esperá a mañana» y esa era una conclusión
heredada, no medida. Contarla de nuevo —tres modelos, el más barato incluido, y el historial de
gasto— la dio vuelta entera. `CLAUDE.md`: *un dato heredado no se ejecuta sin CONTARLO de nuevo*.

### 🔧 Hallazgo de paso: el banco entero citaba archivos `.png` que no existen — 0 créditos

Al ir a correr el comando heredado saltó que apunta a `E3-hotel.png`, y en disco es **`.jpg`**.
Verificado en todo el carril: **no hay ni un solo `.png`** en `references/modelos/lucia/`. El
`LEEME.md` del banco los nombraba `.png` **13 veces** y `CREATIVO.md` 2 — Higgsfield **descarga**
`.png`, pero al repo entraron convertidas, y los docs copiaron el nombre de la descarga.

**Cualquier comando copiado de esos docs moría en «file not found» antes de tocar el servidor.**
Corregidas las 15 menciones y verificado que cada archivo citado existe en disco. Queda la nota en
el encabezado del `LEEME`: se escribe la extensión **que tiene el archivo**, no la que trajo la
descarga. Es el mismo defecto que la rúbrica combate en las fotos —*medido, no supuesto*— aplicado
a las rutas.

### E9 · El plan mandaba a publicar el carrusel DESCARTADO — 2026-09-03 · **0 créditos**

**La vuelta arrancó corriendo la definición de hecho** («abrí lo que dice estar listo y miralo»)
sobre `PRODUCCION_MES_1.md`. L6 figura como **«✅ RENDERIZADO, espera OK»** y cita
`posts-20260807/render-l6/slide-01..07.png`. **Esa carpeta no existe en este árbol.** Tirando del
hilo salió algo peor que un archivo faltante.

**La carpeta que el plan mandaba a publicar lleva adentro su propia lápida.** Textual, en
`render-l6/_NO-SUBIR.md`, decidido el 31-ago comparando las láminas una a una:

> ⛔ NO SUBIR — esta versión quedó superada. **Subí `L6/` en su lugar.**
> Motivo: acento **mostaza**; el lote del 28-ago lo unifica al **verde Onia**.

O sea: el feed se unificó al verde el 28-ago, se dejó la nota en la carpeta vieja, y **el plan
—la única puerta de entrada del carril— nunca se enteró**. Cualquier sesión que lo siguiera al pie
de la letra publicaba el carrusel del color equivocado, con la nota que lo prohíbe a un `ls` de
distancia. Es exactamente lo que `CLAUDE.md` llama *barrer la promesa en toda la superficie*:
se arregló el color donde saltó y no el doc que manda a la pieza.

**Corregido:** el plan ahora apunta a `posts-20260807/L6/slide-01..07.jpg`. **Mirado, no supuesto** —
extraída `slide-07.jpg` (la última, que es donde nadie llega) y abierta: 1080×1350, acento verde
`#10C26B`, CTA «Comentá SISTEMA», pie `@lucia.antelo.oficial` y la declaración «Soy IA, y no lo
escondo». La pieza buena está impecable; **el que estaba roto era el puntero.**

#### 🔴 Corrección a E8: la causa de los `.png` fantasma NO era el nombre de la descarga

E8 (vuelta anterior) cerró que los docs citaban `.png` porque *«Higgsfield descarga `.png`, pero al
repo entraron convertidas, y los docs copiaron el nombre de la descarga»*. **La corrección de las
15 rutas fue correcta y sigue en pie** — reverificado hoy: los 10 archivos citados por el `LEEME`
del banco 20260902 existen todos. **Pero el mecanismo que E8 nombró está incompleto, y por eso el
mismo defecto seguía vivo en otros tres lugares.**

La causa real es una línea de configuración:

```
hermes-content/references/modelos/.gitignore:2:  *.png
# "Originales PNG de la generacion (pesados, quedan locales). Los JPG q3 son los assets usables."
```

**`*.png` está ignorado en TODO el árbol `references/modelos/`.** No es que los docs copiaran mal
un nombre: es que **cualquier PNG que este carril produzca es invisible para git**, y las láminas
de carrusel se rendean en PNG. El render escribe, el doc anota la ruta que vio, y git descarta los
archivos **sin decir una palabra**. La convención real —PNG local, JPG commiteado— es deliberada y
sana por peso, pero **no está escrita en ningún lado que el carril lea, y nada la hace cumplir**.

**Ya disparó dos veces, y la primera se «arregló» sin desarmarla:**

| cuándo | qué se perdió | cómo se arregló |
|---|---|---|
| commit `de009bc4f` | **74 láminas** — *"el feed entero existia solo en esta maquina"* | se convirtieron a JPG a mano y se commitearon. **No se tocó la regla.** |
| commit `f21948709` | las 7 láminas de L6 | el commit se llama *«L6 renderizado»* y contiene **sólo el brief y ediciones de doc** — cero imágenes |

La trampa quedó armada y volvió a morder. **Un `git commit` que no se queja no prueba que el
entregable entró**: `git status` calla sobre lo ignorado, que es justo lo que hace este fallo
silencioso. Antes de anotar una lámina como lista: `git ls-files <ruta>` — si vuelve vacío, el
archivo **no existe para nadie más que para vos**.

#### 🔴 `main` no tiene ni una lámina de este carril

Medido hoy, contado en vivo y no heredado:

| rama | láminas de Lucía |
|---|---|
| `origin/main` | **0** |
| `origin/claude/ads-creatividades-publicos` | **70** (461 en todo el repo) |
| `claude/lucia-vps` (esta) | **0** |

Esa rama va **151 commits adelante de `main`**. Todo el output visual del carril vive en una sola
rama sin integrar: desde un clon limpio, o desde el VPS donde corre este loop, **no hay carrusel
que abrir**. Es la razón de fondo por la que la vuelta no pudo verificar L6 sin ir a buscarlo a
otra rama.

⚠️ **No se toca desde acá.** `claude/ads-creatividades-publicos` es el carril de Sergio y mergear a
`main` es de `onia-cola`. Queda en el tablero, con el conteo medido.

#### 🔧 De paso: `block` del tablero falla si `--kind` va DESPUÉS del id

Al dejar la tarea bloqueada, esto **no bloquea nada** —y es el orden que traen escrito los prompts
de los loops, incluido el de este carril:

```sh
# ❌ falla: "unrecognized arguments: Sergio: decidir..."
onia-tablero.sh block <id> --kind needs_input "razón"

# ✅ funciona
onia-tablero.sh block --kind needs_input <id> "razón"
```

Con el orden malo el comando **sale por error y la tarea queda en `ready`**. Un carril que no
verifique después de bloquear cree que dejó la pieza frenada esperando el OK de Sergio, y en
realidad la dejó **suelta y reclamable por cualquiera** — que es justo lo contrario de la regla
«toda pieza nace bloqueada». Se detectó porque el paso siguiente fue un `list` mirando el estado
real, no porque el comando avisara.

**Regla:** después de `block`, un `list` que confirme el `⊘ blocked`. El tablero ya tiene una
tarea cerrada sobre esta sintaxis (`t_70696f24`), pero el orden equivocado **sigue vivo en los
prompts** — no es de este carril arreglarlo ahí.

---

### E10 · L2 rendeado — la primera pieza que este carril puede reconstruir solo — 2026-09-03 · **0 créditos**

**Pregunta de la vuelta:** *¿queda alguna pieza del plan que se pueda terminar sin gastar?* Sí: L2,
el carrusel fijado «¿Quién es Lucía?», que figuraba **«brief listo, falta render»** desde el 22-ago.
Doce días parado por nada — el render es local y cuesta cero.

**Entregable: `posts-20260807/L2/slide-01..07.jpg`**, 7 láminas 1080×1350, bloqueadas esperando OK.

#### Lo que apareció al ir a rendear: E9 se quedó corta

E9 (vuelta anterior) midió que las 70 láminas del carril viven sólo en
`claude/ads-creatividades-publicos` y que `main` tiene 0. Correcto, pero **contó los productos y no
los insumos**. Al abrir el brief de L2, sus 7 fondos apuntaban a `tanda-20260821/*.png`. Contado en
vivo, en las tres ramas:

| dónde | imágenes de `tanda-20260821/` |
|---|---|
| disco de este worktree | **0** |
| `origin/main` | **0** |
| `origin/claude/ads-creatividades-publicos` | **0** |

**No están "en otra rama": nunca entraron a git.** Esa carpeta contiene 24 archivos y son todos
`.mp4`/`.mp3`. El banco de fotos que alimenta L2 **y L6** existió sólo en la máquina que lo generó.

Esto sube la gravedad de lo que E9 llamó «la trampa del PNG». No es que el output quede sin
publicar: es que **el insumo se evapora y con él la capacidad de re-rendear la pieza**. Un brief
cuyos `bg` no están versionados es un brief que sólo funciona una vez, en una sola computadora.

#### Cómo se arregló, y por qué el arreglo es la prueba

Repuntados los 7 fondos al banco `generadas-20260902/` (6 imágenes, **todas commiteadas**, las
mejor auditadas del carril) y **rendeado acá, en el VPS**. Que el render haya corrido en la máquina
donde el loop vive —y no en la de Sergio— es la demostración de que la pieza ahora se reconstruye
desde un clon limpio. Antes no.

Ventaja no buscada: las 6 fotos del banco 0902 **comparten la remera de lino beige**, así que el
carrusel salió con raccord de vestuario sin generar nada.

#### La secuencia que hay que repetir para no perder láminas

El renderer escribe **PNG** y `references/modelos/.gitignore` ignora `*.png` **en todo el árbol**.
Rendear y commitear sin más deja el entregable invisible, y `git status` **no dice una palabra**:

```sh
node scripts/carousel_render.js --brief <b> --out <d> --account lucia --pack editorial-clean --format feed
for f in slide-*.png; do ffmpeg -loglevel error -y -i "$f" -q:v 3 "${f%.png}.jpg"; done && rm -f slide-*.png
git check-ignore -v <d>/*.jpg   # VACÍO (exit 1) o no entró
git ls-files <d>                # tiene que listar las 7
```

Verificado para estas 7: ninguna ignorada, las 7 versionadas. **Un `git commit` que no se queja no
prueba que el entregable entró.**

#### Rúbrica: 9/9, mirado a resolución completa

Abiertas 1, 2, 4 y 7 —incluida **la última, que es donde nadie llega**—: misma cara en las 7 (pecas,
cejas, aro, cadenita), `1080×1350` medido con `ffprobe`, cero texto legible (la pantalla de la
lámina 4 es UI borrosa), manos correctas, luz de lugar, piel con poros, verde `#10C26B` y pie
`@lucia.antelo.oficial` — **no** `@oniahq`, que es lo que sale si se olvida `--account lucia`.

**Decisión que Sergio puede querer revertir:** hay 6 fotos para 7 lugares, así que la lámina 7
repite la portada. Se puso el par en los extremos (máxima distancia) y el texto lo convierte en
remate. Si no le cierra, una foto nueva de cierre son ~2 cr.

#### Lo que queda armado y no se tocó

El brief de **L6 tiene el mismo defecto**: sus 7 `bg` apuntan a los mismos PNG inexistentes. No se
repuntó a propósito — L6 ya tiene render bueno (verde, en la rama de ads) y cambiarle los fondos
cambiaría la pieza que Sergio va a aprobar. Anotado en el plan: si alguna vez hay que re-rendear
L6, primero se repuntan los fondos.
