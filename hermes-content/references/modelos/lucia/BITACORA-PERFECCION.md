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

### E2 · 🎯 **El experimento central: léxico fancy que NO rompe la cara** · **~6 créditos** · PENDIENTE
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

### E3 · Tres lugares fancy nuevos · **~6 créditos** · PENDIENTE
Con la fórmula ganadora de E2, generá **café de especialidad**, **coworking de diseño** y
**hall de hotel**. 9:16. Las que salgan 9/9 van a `hermes-content/PARA-PUBLICAR/`.

### E4 · Seedance vs Kling sobre LA MISMA imagen · **~13,5 créditos** · PENDIENTE
Hoy `V06` es kling sobre dental y `V07` es seedance sobre peluquería: **distinta fuente, no es
comparación.** Animá **una sola** imagen fancy de E3 con `seedance1_5` (4,8) y `kling3_0` (8,75),
mismo prompt de movimiento. Comparar: aspecto de salida, duración, audio, y casilla 9 —**la cara
aguanta el clip entero**. Conclusión con evidencia a `TECNICA-HIGGSFIELD.md`.

### E5 · ¿`--resolution 2k` se nota en la piel? · **~4 créditos** · PENDIENTE
Misma escena a `2k` y al default, comparadas al 100 % de zoom. Si no se distingue, se baja y se
ahorra en **cada pieza futura**.

### E6 · ¿Se puede pedir más de 4 segundos? · **~10 créditos** · PENDIENTE
`V07` dio 4,05 s y un reel de 4 s obliga a encadenar. Mirá el `--help` del subcomando de video.
**Si no existe flag de duración, anotalo y NO gastes.**

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
