# Bitácora de perfeccionamiento — ventana del 2026-09-02

> **La cola de trabajo del loop.** Cada vuelta: leé esto PRIMERO, tomá el primer `PENDIENTE`,
> hacelo, y **escribí el resultado acá** antes de commitear. Sin esto, cada vuelta reinventa
> qué probar y se gastan créditos midiendo lo ya medido.

**Objetivo de la ventana:** que una generación de Lucía salga **9/9 en `RUBRICA-IMPOLUTO.md`**
sin retoque. No es producir volumen: es **saber qué variable causa cada defecto**.

**Techo de gasto de toda la ventana: 250 créditos.** El corredor corta solo al llegar.

---

## Cola

### E1 · Línea base — auditar lo que ya existe · **0 créditos** · PENDIENTE
Puntuá contra la rúbrica **mirando** (no de memoria) las piezas de `generadas-2026082 8/31/01`:
imágenes `G01..G06`, `B05`, `B06`, `B07`, `B08`, `C01`; videos `V01..V07`.
Para video: `ffmpeg` 4 frames y leelos. Para imagen: abrila.
**Salida:** una tabla acá con la puntuación de cada una y **qué casilla falló**.
Sin esta tabla, los experimentos siguientes no tienen contra qué comparar.

### E2 · ¿9:16 nativo compone mejor que 3:4? · **0 créditos** · PENDIENTE
`B07` y `B08` ya son 9:16 nativos; `G01..G06` son 3:4. Comparalos en composición y luz.
**Lo que se busca saber:** si conviene regenerar el banco viejo en 9:16, o alcanza con animarlo
(Seedance da vertical igual). **Es una decisión de plata: 16 imágenes × 2 cr.**

### E3 · El anti-cartel, prueba limpia · **~2 créditos** · PENDIENTE
`B05-micro` está marcada 🔧 REGENERAR: el prompt **pedía** «a handwritten fare sign» y a la vez
pedía no leer carteles. Ganó el cartel.
**Variable única:** el mismo prompt **sin mencionar el cartel**, cerrando con
`No signs, no labels, no price tags and no screens anywhere in frame`.
**Confirma o refuta** la regla escrita en `TECNICA-HIGGSFIELD.md`.

### E4 · 🎯 Seedance vs Kling sobre LA MISMA imagen · **~13,5 créditos** · PENDIENTE
**El experimento que falta.** Hoy `V06` es kling sobre dental y `V07` es seedance sobre
peluquería: distinta fuente, **no es comparación**.
Animá **una sola imagen** (usá `B06-consultorio-dental`) con los dos:
`seedance1_5` (4,8) y `kling3_0` (8,75). Mismo prompt de movimiento.
**Comparar:** aspecto de salida, duración, audio, casilla 9 (la cara aguanta), naturalidad.
**Salida:** cuál gana y **con qué evidencia**, escrito en `TECNICA-HIGGSFIELD.md`.

### E5 · ¿Se puede pedir más de 4 segundos? · **~10 créditos** · PENDIENTE
`V07` dio 4,05 s. Un reel de 4 s obliga a encadenar. Mirá `higgsfield generate cost` y los
parámetros de duración del CLI (`--help` del subcomando). Si hay flag de duración, probalo.
**Si no existe el flag, anotalo y NO gastes** — pasá al siguiente.

### E6 · ¿`--resolution 2k` vale lo que cuesta? · **~4 créditos** · PENDIENTE
Misma escena a `2k` y al default. Compará al 100% de zoom: poros (casilla 7) y textura de tela.
**Si no se distingue, se baja la resolución y se ahorra en cada pieza futura.**

### E7 · Léxico que conserva la piel · **~4 créditos** · PENDIENTE
Sabemos que `fashion campaign` rompe la cara. Falta saber **qué la mejora**.
Dos variantes de la misma escena cambiando SOLO el bloque de piel
(ej. `visible skin pores, natural asymmetry` vs sin ese bloque). Mirá al 100%.

### E8 · Consolidar la receta ganadora · **0 créditos** · PENDIENTE
Con E1..E7 hechos, escribí en `TECNICA-HIGGSFIELD.md` **la receta única** que sale 9/9,
con el comando exacto copiable. Es el entregable de la ventana.

---

## Resultados

_(cada vuelta agrega su bloque acá — qué probó, qué midió, qué decidió)_
