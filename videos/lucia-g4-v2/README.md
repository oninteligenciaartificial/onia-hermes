# Lucía · G4 v2 «Seis motores de imagen, una cara: ¿cuál la conserva?» (28,04 s, 1080x1920, 24 fps)

Re-corte de `videos/lucia-g4/` (59,75 s) pedido por la madre el 11-oct-2026: **sin aire muerto fuera de lectura (máx. 0,21 s; la lectura de tarjetas y notas está exenta; el audio se mide con voz)** (regla 15), **26-30 s** y **cronometrado para una voz que se agrega después**.
Montaje con HyperFrames 0.8.142 y el método de G1-G5 (`.claude/skills/lucia/montaje-hyperframes.md`). **Costo: 0 créditos** (fotos ya pagadas el 8-oct, 8 referencias oficiales; ningún servicio pago ni de voz).
**Estado: PARA VER POR LA MADRE (preview 360p) con la revisión 1 aplicada (12-oct; `qa/revision-1.md`, tabla H1-H10 más abajo). No se publica nada.** Sin voz ni música: pista AAC en silencio (−91 dB) a propósito.
El guion aprobado el 10-oct (`hermes-content/docs/cola/lucia-diario/guiones/G4-seis-motores-de-imagen-una-cara.md`) manda en cifras y límites; este re-corte cambia la forma, no los datos. El pie nuevo es `pie.txt`, no el del guion.

**D-N1 (11-oct-2026, decisión de Sergio Urcullo, transmitida por la madre): los motores se NOMBRAN**, como uso propio y no como recomendación pagada. Se reemplazó «Imagen A a F» por los nombres reales en tarjetas, rótulos de fila, pies de foto, `guion-voz.txt`, `pie.txt`, `plan.json` y las validaciones (`build.mjs` y `grep-prohibidas.mjs` solo dejan de prohibir estas seis herramientas; todo lo demás sigue prohibido, incluido «Omni» y «ChatGPT»). Desde la revisión 1, «Higgsfield» y «ArcFace» se pueden nombrar **solo en el pie** (H8; en pantalla y en la voz siguen prohibidos).
Equivalencias (la clave de PROCEDENCIA se comprueba en el build): **Seedream 4.5** 1 cr · **Kling O1 Image** 0,5 cr (el guion lo llamaba «Kling Omni Image»; O1 Image es el nombre con que Higgsfield lo lista) · **Nano Banana 2.1** 2 cr · **Seedream 5.0 Pro** 2,5 cr · **FLUX 3** 3 cr · **GPT Image 2.5** 2,75 cr.
Siguen valiendo: rótulo de IA, CTA exacto, piso 0,70 «lo elegí yo» (marca «mi piso · 0,70» y la voz), «Una toma cada uno: es una prueba, no una regla.» (en pantalla) y «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» (44 px), fotos limpias de C y E, nada de «el mejor» ni de recomendación general (el grep lo corta).

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, datos, costuras, énfasis | `plan.json` |
| Voz de Lucía en voseo, UNA línea por tramo, 444 caracteres con saltos (cupo 450). **No se generó audio.** | `guion-voz.txt` |
| Generador: valida reglas, cronograma de la voz **por caracteres** y **cada cifra y afirmación contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html` | `scripts/build.mjs` + `scripts/voz-lib.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Controles (todos en Node + ffmpeg + el Playwright de `/opt/node-tools`; nada se instaló) | `scripts/aire.mjs` · `eventos.mjs` · `hueco-tarjetas.mjs` · `ventanas.mjs` · `medir-dom.mjs` · `costuras.mjs` · `vacios.mjs` · `psnr-fotos.mjs` · `grep-prohibidas.mjs` · `voz-tramos.mjs` · `lib-dom.mjs` |
| Tabla «caben / no caben» de la voz (por caracteres, 16 · 17 · 18 car/s) y sincronía palabra-evento | `qa/voz-tramos.txt` |
| Material que el build necesita sin red (8 recortes de las referencias con su origen, GSAP) | `assets-fijos/` (versionado) |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición, con AAC en silencio) | `qa/g4-v2-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (**master**, ignorado en git, 27,6 MB) | `out/g4-v2-final-1080x1920.mp4` |
| **SHA-256 del final** | `13cdd1d2f5f0ab2eef1fb0ffd065007d47bf5946a2bb15a5bd24c435142d2a43` (`qa/sha256-final.txt`) |
| Pie para publicar (abre con «personaje hecho con IA»; lo comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s) | `qa/portada-0.6s.jpg` |
| Medición del aire (mayor tramo quieto, eventos por 10 s) | `qa/aire.txt` |

### Rastro del master (revisión 1, H10)
`out/` está **ignorado por git** (`.gitignore`): el único ancla del master es el SHA-256 de arriba (el de la v2 sin revisión, `fd7769e8…25fe32`, queda reemplazado). Cuando la madre lo apruebe, se copia a `videos/lucia-entrega/` como g1-g5 (hoy ahí solo está la v1, marcada «no publicar»). **Al mezclar la voz el SHA cambia** y hay que repetir el QA de audio: LUFS integrado −14 (`ffmpeg … ebur128`), pico verdadero, `silencedetect` (−35 dB, 0,3 s: ≤ 1 hueco ≥ 0,3 s por 10 s; pausas ≤ 0,25 s), y repetir `hyperframes check` sobre el `index.html` con voz si algún tramo se movió.

## Cronograma de la voz (por CARACTERES a 17 car/s; cada línea arranca en su costura o hasta 0,15 s después)
Revisión 1 (H1): el cronograma v2 contaba **palabras ÷ 3,6**, pero este guion tiene 5,0 car/palabra (18 car/s: +6 % sobre los ≈ 17 car/s que `PLAN.md` §4-bis midió en G1 v2: 320 car ≈ 19 s). Ahora `plan.voz.inicios` fija cuándo arranca cada línea y `build.mjs` valida a 17 car/s que **ninguna línea se pise con la siguiente y que ninguna pausa pase de 0,25 s**; a 16 y 18 car/s solo avisa. Las costuras (empujes) **no se movieron**: cada una cae en el comienzo de una línea o hasta 0,15 s antes de que la voz entre (la imagen llega y luego habla). Detalle y sincronía palabra-evento: `qa/voz-tramos.txt`. El video termina 0,48 s después de la última palabra y el CTA queda 2,42 s en pantalla (pedido: 2,4 a 5,5 s).

| Línea | Inicio (s) | Car. | Voz a 17 c/s | Pausa → siguiente (16 · **17** · 18 c/s) | Línea para la voz | Qué se ve mientras tanto |
|---:|---:|---:|---:|---|---|---|
| 1 | 0,100 | 30 | 1,76 | +0,04 · **+0,16** · +0,25 | A ver, ¿cuál conserva su cara? | gancho, c1, pastilla «parecido 0,81» |
| 2 | 2,020 | 44 | 2,59 | 0,00 · **+0,16** · +0,31 | Probé la misma orden en 6 motores de imagen. | c2 + 6 miniaturas |
| 3 | 4,770 | 26 | 1,53 | +0,02 · **+0,11** · +0,20 | Medí contra 8 fotos suyas. | las 8 referencias |
| 4 | 6,410 | 31 | 1,82 | −0,01 · **+0,11** · +0,21 | Piso cero setenta: lo elegí yo. | marca «mi piso · 0,70» |
| 5 | 8,340 | 33 | 1,94 | −0,03 · **+0,09** · +0,20 | Seedream, 1 crédito: la sostiene. | Seedream 4.5 |
| 6 | 10,370 | 42 | 2,47 | +0,07 · **+0,22** · +0,36 | Seedream Pro, 2 y medio: justo en el piso. | Seedream 5.0 Pro |
| 7 | 13,060 | 32 | 1,88 | +0,11 · **+0,23** · +0,33 | FLUX, el más caro, bajo el piso. | FLUX 3 |
| 8 | 15,170 | 39 | 2,29 | +0,06 · **+0,21** · +0,33 | Y ojo: pagar más no mejoró el parecido. | lección, c7 |
| 9 | 17,670 | 40 | 2,35 | +0,08 · **+0,23** · +0,36 | Fue una toma cada uno: prueba, no regla. | nota 1 (ya en la placa) |
| 10 | 20,250 | 43 | 2,53 | +0,09 · **+0,25** · +0,39 | Si dos parecidos se rozan, eso ya es ruido. | nota 2 + franja coral |
| 11 | 23,025 | 40 | 2,35 | +0,10 · **+0,25** · +0,38 | En otra escena, el Kling perdió la cara. | escena 2 (café) |
| 12 | 25,625 | 33 | 1,94 | cola +0,35 · **+0,48** · +0,58 | Seguime: cada semana, una prueba. | CTA |

- **Cambios de texto** (decisión de la madre, H1/H6): L5 «Seedream, con un crédito, la sostiene.» (38 car, se pasaba 0,57 s de su tramo de 1,67 s y pisaba a L6) → «Seedream, 1 crédito: la sostiene.» (33 car) · L10 «puntajes» → «parecidos» (la pantalla dice «parecido») · L11 «En la escena 2, el Kling…» → «En otra escena, el Kling…» (no había escena 1). **L6 se deja** «Seedream Pro, 2 y medio: justo en el piso.» (42 car): la variante «… 2 y medio de crédito …» (53 car, 3,12 s) desborda su tramo (10,25 → 13,00 = 2,75 s) por 0,37 s y pisaría a L7; la unidad la dice la tarjeta («2,5 créditos») sobre la voz.
- **Desfases** sobre la costura: L6 +0,12 s, L7 +0,06, L11 +0,15 (el hueco de 0,40 s antes del CTA pasa a 0,25), L3 +0,02. Las pausas a 17 c/s quedan entre 0,09 y 0,25 s. **L5 sigue siendo la más justa**: a 16 c/s se pisa 0,03 s con L6 (y L4 0,01 s); a 18 c/s todas las pausas de L6 a L11 pasan de 0,25 s. Es estimación (±1 car/s): **con voz real los inicios se DERIVAN de las duraciones medidas** (ver «Lo que no se pudo cerrar», 7).
- Se dicen en voz «Seedream», «Seedream Pro», «FLUX» y «el Kling»; **«Nano Banana 2.1», «GPT Image 2.5», «Higgsfield», «ArcFace» y los números de versión solo se leen o van en el pie** (comen caracteres y la voz los diría como «dos punto uno»). Los números de la voz van en palabras o en cifras que ElevenLabs dice igual en español («6», «8», «1», «2 y medio»): una cifra con coma («0,70») se dice como tres palabras y desajusta el reloj.
- Cupo de voz: el guion tiene **444 caracteres con saltos (433 sin ellos)** y hasta el 13-oct 01:17 UTC quedan **381**: no alcanza para generarlo hoy (la madre lo confirma).

## Tabla de cortes (T = comienzo de la escena en reposo; el empuje rígido de 6 cuadros ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,00 – 4,75 | **Foto de Seedream 4.5** fija, empuje lento 1,00 → 1,04 | rótulo «Lucía Antelo · personaje IA de Onia» del cuadro 0 a 3,0 s a 40 px · c1 **«¿Cuál conserva su cara?»** **ya en el cuadro 0, sin entrada** (0,00-2,04; acento «su cara?» 1,5) · **pastilla «parecido 0,81» sobre la foto (0,66-2,04: el resultado antes de los 3 s)** · c2 **«Misma orden. Seis motores de imagen.»** 2,04-4,75 (acento 3,4) con las 6 miniaturas (sin letras) entrando de 2,10 a 2,70 |
| 4,50 – 8,33 | **Regla.** Placa: 4 referencias presentes, 4 entran 4,75-5,05; escala 4,95; «idéntica · 1» 5,20 | c3 **«Contra 8 fotos suyas. Piso: 0,70.»** (UNA tarjeta, 5,50-8,33; acento «Piso: 0,70.» 6,4) · marca «mi piso · 0,70» cae a 6,35 |
| 8,08 – 10,25 | **Seedream 4.5** | c4 «Seedream 4.5 · 1 crédito» (acento «1 crédito» 8,9) · «parecido 0,81» 8,68 (su cifra se enciende en verde a 9,58) |
| 10,00 – 13,00 | **Seedream 5.0 Pro** | c5 «Seedream 5.0 Pro · 2,5 créditos» (acento 10,8) · «parecido 0,70» 10,65 · pastilla neutra «justo en el piso» 10,90 (golpe 11,8; el dato 12,3) |
| 12,75 – 15,17 | **FLUX 3** (foto limpia) | c6 «FLUX 3 · 3 créditos» (acento 13,5) · «parecido 0,69» 13,35 · sello «bajo el piso» 13,50 (golpe 14,5) |
| 14,92 – 22,88 | **Lección.** Placa con los 6 motores por precio sobre la escala (filas de 15,31 a 16,31, cada 0,2 s; pulsos Seedream 4.5 y FLUX 3 a 16,87 y 17,47) | c7 **«Pagar más no mejoró el parecido.»** 15,17-17,75 (acento 16,6) · **nota 1 a 44 px «Una toma cada uno: es una prueba, no una regla.»** ya en la placa al llegar (15,17) · **nota 2 «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).»** a 18,97 · **franja 0,66-0,70 en coral suave** a 20,17 (visible a 390 px) · pulsos de Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5 a 20,57 / 20,87 / 21,17 |
| 22,63 – 25,63 | **Escena 2.** Placa con las dos fotos del café (430x764): Seedream 4.5 ya está al llegar; Kling O1 Image entra a 23,21, su pie a 23,46 y el anillo a 24,00 | c8 **«Kling O1 Image perdió la cara.»** 22,88-25,63 (acento «perdió la cara.» 24,3) · pies «Seedream 4.5 0,83» y «Kling O1 Image 0,35» |
| 25,38 – 28,04 | **Cierre:** foto K4·5 (Lucía mira a cámara y sonríe) con empuje lento | c9 **«Seguime: cada semana, una prueba.»** 25,63-28,04 (acento 26,2; la raya de la tarjeta pulsa a 27,63 como último evento) |

Costuras: 7 empujes rígidos de 6 cuadros a la izquierda en T = 4,750 · 8,333 · 10,250 · 13,000 · 15,167 · 22,875 · 25,625 s. Las tarjetas **y el dato, la pastilla y el sello** viajan con la imagen que los lleva (así ganan tiempo de lectura). La pastilla del gancho no viaja: sale con c1 (2,04 s), antes de las miniaturas.

## Qué se quitó de G4 y por qué (59,75 s → 28,04 s)
| Quitado | Por qué |
|---|---|
| Las escenas completas de **B, C y F** (3 × 5 s) | El contraste esencial cabe en tres: el que sostiene (Seedream 4.5), el que queda justo en el piso (Seedream 5.0 Pro) y el más caro bajo el piso (FLUX 3). Los seis siguen visibles: las 6 miniaturas del gancho y las 6 filas de la lección con su cifra, para que el «pagar más no mejoró» no dependa de tres elegidos |
| La **tabla de tres escenas** de A y B y las tarjetas «Imagen A: la sostuvo en tres.» y «Una foto sola no mide.» | 5,5 s de lectura. Queda la escena 2 con el par del café (Seedream 4.5 0,83 contra Kling O1 Image 0,35). **El pie ya no dice «tres escenas» ni «una de tres»**: dice el contrapeso (Kling O1 Image dio 0,79 y 0,83 en las otras dos) |
| La regla en **dos tarjetas** (3 s cada una) | Una sola tarjeta de 6 palabras («Contra 8 fotos suyas. Piso: 0,70.») que entra cuando ya llegaron las referencias y sale con el empuje; «lo elegí yo» queda en la voz y en la marca «mi piso» |
| Los **5 s fijos por foto**, con el dato y el sello quietos 3 s | Era el aire muerto: G4 tenía un hueco de hasta 2,55 s entre eventos (`../lucia-g4/qa/eventos-visuales.txt`) y escenas de 5 s sostenidas con una tarjeta y un dato. Ahora cada escena dura lo que su línea de voz (1,9-2,8 s) y el último tramo de cada una lo llena un golpe de énfasis |
| Las filas de la lección cada 0,4 s y la espera de 4 s por la nota 2 | Filas cada 0,2 s; la nota 1 ya está en la placa al llegar y la 2 entra cuando la 1 terminó de leerse (3,8 s), el piso de lectura que no se puede acortar: **la lección dura 7,71 s porque las dos notas de honestidad piden 7,25 s** |
| Las letras A-F en las miniaturas y las «Imagen X» | D-N1: ahora se lee el nombre real |

## Decisiones que la madre puede revertir (todas en `plan.json`; la que cambia texto, también en `guion-voz.txt`)
1. **«Kling O1 Image perdió la cara.»** (H5, 12-oct): nombre completo, 6 palabras (el tope), sin «Escena 2:» (no había escena 1). Reemplaza a «Escena 2: Kling perdió la cara.», que usaba «Kling» a secas para caber. La voz dice «el Kling» (no lee «O1»).
2. **Énfasis de cierre en cada escena de motor** (un golpe de escala del dato, la pastilla o el sello, y el número de Seedream 4.5 pasa a verde): son los eventos que cubren el último tramo antes del empuje. Revertir = `imagenes[].enfasis = []` y `aire.mjs` falla.
3. **Pulsos en la lección** (Seedream 4.5 y FLUX 3 a 16,87 / 17,47; Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5 dentro de la franja): evitan 2,4 s sin evento antes de la nota 2.
4. **La A del café se muestra junto a la B** (comparación en la misma escena); sin ella la escena 2 sería más corta, pero Kling O1 Image quedaría sin referencia.
5. **Tarjetas que se quedan más que su lectura** (medido en `qa/hueco-tarjetas.txt`): c5 sobra 0,66 s, c6 0,43, c8 0,31, c9 0,45 y la nota 1 3,87 (la nota 2 la releva). En todas hay otro texto en lectura o un evento en pantalla (pastilla, sello, pie, nota), y `aire.mjs` mide que ningún tramo queda idéntico más de 0,21 s. **No se recortan** (revisión 1, juicio 3): su holgura es el margen para el desborde de la voz real (c5 +0,66 absorbe L5; c9 +0,45 absorbe L12).
6. **El CTA dura 2,42 s** (el mínimo del pedido es 2,4) y el video termina 0,48 s después de la última palabra de la voz (estimada).
7. **Las referencias**: 4 llegan con la placa y 4 entran (antes entraban las 8: la placa llegaba casi vacía).
8. El pie suma «Nombro lo que uso; no es una recomendación pagada.» (D-N1), nombra los seis motores, la plataforma de los créditos y el medidor (H2/H8); ya no menciona «el que ya uso».
9. **Título en el cuadro 0** (H3): c1 con `a: 0` y sin entrada (`desde_cero`), igual que G5 v2: el cuadro 0 ya trae la tarjeta plena. Revertir = `c1.a = 0,1` (y `timeline.js` vuelve a animarla).
10. **Pastilla «parecido 0,81» sobre la foto del gancho** (H4, opción B, `plan.json → gancho.dato`): 0,66-2,04 s, encima de la tarjeta c1, en la pila de c1. Entra a 0,66 s y no a ~1,2 s porque `build.mjs` y `ventanas.mjs` exigen 0,35 s por palabra + 0,3 s (1,0 s para 2 palabras) con la pastilla entera: 0,66 + 0,18 de entrada + 1,02 s de lectura = salida con c1. **Opción A** (número bajo cada miniatura, 0,81 · 0,79 · 0,74 · 0,70 · 0,69 · 0,66, a 2,3-2,7 s) **no hizo falta**: B cabe sin chocar con c1, c2, el rótulo ni la zona segura (mentón y=660; pastilla desde y≈1204; nada sobre y=292; 60 px de margen mínimo mentón-texto).
11. **Franja de ruido en coral suave** (H7): mismo ancho (0,66-0,70), color de «bajo el piso»; a 390 px se ve (13 px de franja). **El sello «bajo el piso» de FLUX 3 NO se cambió**: es literal con el piso declarado (0,691 < 0,70) y el ±0,03 ya está en pantalla y en el pie.

## Revisión 1 (12-oct): qué se aplicó (`qa/revision-1.md`: 0 ALTA · 4 MEDIA · 6 BAJA)
| # | Hallazgo | Estado | Dónde / motivo |
|---|---|---|---|
| H1 | La voz no cabía: L5 se pisaba y tres líneas dejaban hueco de más | **Hecho (solo texto y tiempos de voz)** | `guion-voz.txt` (L5, L10, L11), `plan.json → voz.inicios`, `scripts/voz-lib.mjs`, `build.mjs` (valida por caracteres), `qa/voz-tramos.txt`. **No** se generó voz ni se escribió `poner-voz.mjs` (pendiente: cupo de voz + sí de Sergio Urcullo) |
| H2 | El pie decía «Una toma cada uno» y dejaba a Kling con medio veredicto | **Hecho** | `pie.txt` reescrito (cifras verificadas contra PROCEDENCIA l.97 por `build.mjs`: 0,806 · 0,691 · 0,35 · 0,794 · 0,831); `build.mjs` ahora corta si el pie dice «Una toma cada uno» como frase general. La nota **de pantalla** («Una toma cada uno…», aprobada el 10-oct) no se tocó |
| H3 | El título no estaba en el cuadro 0 | **Hecho** | c1 `a: 0`, `desde_cero`; cuadro 0 mirado: tarjeta plena |
| H4 | Ningún número antes de los 3 s | **Hecho (opción B)** | pastilla «parecido 0,81» 0,66-2,04 s (ver decisión 10) |
| H5 | «Escena 2: Kling perdió la cara.» | **Hecho** | «Kling O1 Image perdió la cara.» (6 palabras; ventana 2,71 s ≥ 2,40 s) y L11 «En otra escena, el Kling perdió la cara.» |
| H6 | Detalles de redacción de la voz | **Hecho** | L5, L10, L11 como decidió la madre; L6 se deja (ver arriba). L4 «Piso cero setenta» se deja (el piso lo explica la escala) |
| H7 | Franja de ruido casi invisible; «bajo el piso» de FLUX 3 | **Hecho la franja; «bajo el piso» NO** (decisión de la madre) | `estilos.css .ruido` en coral suave |
| H8 | El pie no decía de qué plataforma son los créditos ni con qué se mide | **Hecho** | «seis motores de imagen de Higgsfield», «medí con ArcFace, contra ocho fotos oficiales», «Créditos de Higgsfield, precios del 8-oct.»; `grep-prohibidas.mjs` permite «Higgsfield» y «ArcFace» solo en el pie |
| H9 | «Sin aire muerto» sin su exención | **Hecho** | frase reescrita arriba; N = **0,21 s** medido tras el re-render (0,208 s en el DOM y en píxeles fuera de lectura: 0,167 s) |
| H10 | Rastro del master, flujo con voz, nombres | **Hecho el rastro y la actualización de «Lo que no se pudo cerrar»; nombres de motor PENDIENTES** | ver «Rastro del master» y «Lo que no se pudo cerrar» 8 (no hay CLI de Higgsfield en esta máquina) |

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/build-y-cronograma.txt`)
- «Pagar más no mejoró el parecido»: FLUX 3 (3 cr, 0,691) queda bajo Seedream 4.5 (1 cr, 0,806) y Kling O1 Image (0,5 cr, 0,794); ninguno de los que cuestan más que Seedream 4.5 lo supera.
- «Seedream, 1 crédito: la sostiene» 0,806 ≥ 0,70 · «justo en el piso» Seedream 5.0 Pro 0,702 (entre 0,70 y 0,71) · «bajo el piso» FLUX 3 0,691 y GPT Image 2.5 0,658 · franja 0,66-0,70: GPT Image 2.5, FLUX 3 y Seedream 5.0 Pro caen adentro.
- «Kling O1 Image perdió la cara»: en el café Seedream 4.5 da 0,83 y Kling O1 Image 0,35. **Contrapeso (en el pie): Kling O1 Image dio 0,794 y 0,831 en las otras dos escenas (0,79 y 0,83)**, Seedream 4.5 0,806 · 0,83 · 0,839; solo Seedream 4.5 y Kling O1 Image se repitieron en otras dos escenas (los otros cuatro motores, una toma). Kling O1 Image es el más barato (0,5 cr). Todo número en pantalla = el de PROCEDENCIA redondeado a 2 decimales; «parecido 0,81» del gancho = la misma foto de Seedream 4.5 (0,806).
- No afirma que un motor sea «mejor» en general, ni promete nada de Onia; sin logos incidentales (C y E son las copias limpias de `v4/prueba-motores-20261008/fotos-limpias/`), sin profesión, sin cara ni voz de Sergio Urcullo.

## QA medido (final `out/g4-v2-final-1080x1920.mp4`; los resultados están en `qa/`)
| Control | Resultado | Archivo |
|---|---|---|
| `build.mjs`: tope de 6 palabras, lectura, costuras, cronograma de la voz **por caracteres** (≤ 450 car., sin solapes, pausas ≤ 0,25 s a 17 car/s, 26-30 s, CTA 2,4-5,5 s), cifras y afirmaciones (incluido el contrapeso de Kling), frases exactas, pie | **ok** | `qa/build-y-cronograma.txt` |
| `voz-tramos.mjs` | las 12 líneas caben a 17 car/s; pausas 0,09-0,25 s; a 16 y 18 car/s hay avisos (L4, L5 se rozan; L6-L11 pasan de 0,25 s a 18) | `qa/voz-tramos.txt` |
| `hyperframes check` | **0 errores, 0 avisos** de runtime, layout y motion; contraste **32/32 AA**; 22 avisos de estilo que no frenan; 3 «info» de layout = la primera costura a mitad del empuje (la tarjeta c2 y la miniatura F ya van saliendo) | `qa/hyperframes-check.txt` |
| `aire.mjs` (regla 15) en el DOM | mayor tramo quieto **0,208 s** (estricta: solo tarjetas y notas cuentan como lectura; 1,71 s y 25,17 s) y **0,167 s** (completa); límite 0,3 s | `qa/aire.txt` |
| `aire.mjs` sobre los píxeles del final | placas: mayor tramo quieto fuera de lectura **0,167 s** (coincide con el DOM) | `qa/aire.txt` |
| `eventos.mjs` | 65 eventos visuales nuevos (23 por 10 s); **hueco máximo 1,68 s** (límite 2,0 s) | `qa/eventos-visuales.txt` |
| `hueco-tarjetas.mjs` | cada tarjeta y nota se lee entera; c1 pasa de 1,79 a **2,00 s** de lectura (pide 1,70); sobras por tarjeta (ver decisión 5) | `qa/hueco-tarjetas.txt` |
| `ventanas.mjs` | **35 de 35** textos alcanzan 0,35 s por palabra + 0,3 s en la ventana REAL (empujes incluidos; el 35.º es la pastilla del gancho: 1,25 s contra 1,00 s); holgura más justa: sello de FLUX 3 con 0,11 s | `qa/ventanas-de-lectura.txt` |
| `medir-dom.mjs` | todo texto entre mentón+40 y y=1490, nada sobre y=280, ninguno < 34 px (rótulo 40 px, notas 44 px), ningún texto se pisa; **margen mínimo mentón-texto 60 px**; los puntos y la franja están donde dice el número (±1,5 px; también la pastilla del gancho); los nombres de fila terminan 82 px antes de la marca de 0,70; la escena 2 no tapa ninguna foto (pies hasta y=1171, la tarjeta de dos líneas arranca en y=1234) | `qa/zona-segura.txt` |
| `costuras.mjs` | **7 de 7** empujes rígidos: junta borde con borde 0,00 px en los 7 cuadros, empiezan en T−6 y terminan en T; lo que viaja se desvía 0,00 px | `qa/costuras-rigidas.txt` |
| `vacios.mjs` | **0 cuadros planos**; saltos de luma solo en los empujes (foto clara ↔ placa oscura); fuera de ellos ≤ 8,2 | `qa/vacios-y-saltos.txt` |
| `psnr-fotos.mjs` | **15 de 15** cuadros: el pico es la foto del plan y el zoom del plan (29,4-38,6 dB contra ≤ 14,5 dB de las otras 8); en la caja de la cara ≥ 31,6 dB (igual que el heredado) | `qa/psnr-fotos.txt` |
| `grep-prohibidas.mjs` | 0 coincidencias en pantalla, pie y voz; las 14 frases obligatorias están; el pie trae «créditos de Higgsfield», «ArcFace», «ocho fotos oficiales», «Una toma por motor en la primera escena», no dice «Una toma cada uno», 4 hashtags | `qa/grep-prohibidas.txt` |
| `ffprobe` | final H.264 1080x1920, 24 fps, 673 cuadros = 28,042 s, bt709, 7,9 Mbps; AAC 48 kHz estéreo −91 dB. Preview 360x640, 673 cuadros | `qa/specs-final.txt`, `qa/specs-preview-360p.txt` |
| Mirado | 5 hojas de contacto a 2 cuadros por segundo del FINAL (57 cuadros, con las guías y=1490 / x=1000) leídas una por una; cuadros 0, 1,5, 2,5, 3,0, 14,2 (sello de FLUX 3), 21,0 (franja de ruido, y a 390 px de ancho contra la franja gris anterior), 24,0 (tarjeta de Kling) y 27,0 (CTA) vistos a resolución completa | `qa/hoja-2fps-1…5.jpg` |
| `build.mjs` repetido | `index.html` idéntico (md5 `314507df…`) al que se renderizó | `qa/index-idempotente.txt` |
| Fotos | las 9 fotos del montaje tienen el mismo SHA que las de G4 (9 de 9): los puntajes de cara medidos en G4 (0,806 · 0,794 · 0,724/0,737 · 0,707 · 0,687/0,690 · 0,672; limpias dentro de 0,02) siguen valiendo; el revisor corrió ArcFace sobre el final anterior (≤ 0,012) y esta pasada no cambió fotos, zoom ni caja de cara (PSNR de la cara ≥ 31,6 dB en 15 cuadros) | `qa/procedencia-fotos.txt`, `qa/face-gate-heredado-de-g4.txt`, `qa/psnr-fotos.txt` |

Hallazgos del mirado que se corrigieron antes del render: (1) la placa de la regla llegaba casi vacía (0,6 s con 3 referencias) → 4 referencias ya están al llegar y la escala se dibuja antes; (2) la tarjeta «Seedream 5.0 Pro · 2,5 créditos» partía el nombre en dos líneas («Seedream 5.0 / Pro») → espacios de no separación: el corte cae entre el nombre y el costo; (3) revisión 1: con c1 en el cuadro 0 el acento «su cara?» a 1,2 s dejaba un tramo quieto de 0,25 s (1,67-1,92 s) → acento a 1,5 s (queda en 0,21 s, y cae con «su cara» de la voz, ≈ 1,39 s).

## Lo que no se pudo cerrar (dicho de frente)
1. **El control de cara ArcFace sobre el final NO lo corrió el editor** (pide `pip install` y bajar `buffalo_l`; `CLAUDE.md` exige aprobación). **Ya lo corrió el revisor** (y la madre sobre el master v2 final: `qa/arcface-madre-11oct.txt`, ≤ 0,012) (`qa/revision-1.md`, venv y modelos ya instalados en su scratchpad, 8 referencias locales): diferencia máxima contra las fotos fuente **≤ 0,012** en 8 cuadros con cara ≥ 179 px, dentro del ±0,03 que el video declara. Esta pasada **no cambió ninguna foto, zoom ni caja de cara**; el sustituto del editor (SHA 9/9 + PSNR de la caja de cara ≥ 31,6 dB) vuelve a dar lo mismo. `medir-caras.py` queda sin correr porque `qa/caras-fotos.json` es el de G4 (mismas fotos).
2. **La «regla 15» de `edicion-referentes` no está escrita en la copia del repo** (la skill termina en la regla 14). Apliqué los criterios tal como los dio el encargo: pausa ≤ 0,25 s entre frases (PLAN §4-bis), ningún tramo de más de 0,3 s con la pantalla idéntica y sin una tarjeta en lectura, un evento nuevo como máximo cada 2,0 s. El revisor confirmó en píxeles la traducción a mudo; falta escribirla en la skill.
3. **«Tarjeta en lectura»**: lo medí de dos maneras (estricta: solo las tarjetas y las notas; completa: cualquier texto con tiempo de lectura). Las dos pasan; la estricta lo logra con los golpes de énfasis (decisión 2).
4. **Revisor independiente: hubo uno** (`qa/revision-1.md`, aplicado arriba). Sigue sin verse el video en un teléfono con la interfaz de Instagram (solo se simuló 390 px de ancho: la columna de iconos de la derecha y el pie de la cuenta no se confirman sin el teléfono).
5. `hyperframes check` no vio el `index.html` de un render con voz: la voz real puede durar distinto (ver «Cronograma de la voz»). Si los tramos se mueven con la voz real, hay que re-renderizar y repetir `check`.
6. La B del café (Kling O1 Image, 0,35) en la placa se ve como una mujer parecida pero otra persona; el pie dice su nombre y su cifra, y la tarjeta que perdió la cara. La foto es la misma que aprobó la madre el 10-oct (ArcFace sobre el recorte de la placa: 0,371).
7. **PENDIENTE: `poner-voz.mjs` y la voz.** Necesita (a) el cupo de voz: el guion tiene 444 caracteres con saltos y hasta el 13-oct 01:17 UTC quedan 381, y (b) el sí escrito de Sergio Urcullo al gasto de voz. Receta: generar las 12 pistas, **derivar los inicios de las duraciones reales** (no de caracteres), avisar de solapes y de pausas > 0,25 s, mezclar a −14 LUFS y repetir el QA de audio (ver «Rastro del master»). Si una costura se mueve, re-renderizar. Hasta entonces la pista es silencio.
8. **PENDIENTE: confirmar en vivo los nombres «FLUX 3», «Seedream 5.0 Pro» y «Nano Banana 2.1»** (`lucia/SKILL.md` l.103 escribe «Seedream 5 Pro»; el catálogo viejo `higgsfield-generate/references/model-catalog.md` no los trae; salen de la lista de la madre, PLAN §4-bis, y de las claves de PROCEDENCIA). `which higgsfield` no encuentra la CLI oficial en esta máquina (12-oct), así que no se consultó nada; la madre puede autorizar un `models_explore` (consulta de catálogo, gratis) antes de publicar. Si cambia algún nombre: `plan.json` (`imagenes[].nombre`, `l2`), `build.mjs` (`NOMBRES`, `SLUG`), `grep-prohibidas.mjs` (obligatorias), `pie.txt` y, si se dice en voz, `guion-voz.txt`.
9. **Observación que NO se tocó (decisión de la madre, 12-oct):** la nota de pantalla «Una toma cada uno: es una prueba, no una regla.» y la voz L9 «Fue una toma cada uno: prueba, no regla.» siguen tal cual (aprobadas el 10-oct). Son literales para la escena de la recepción; la escena 2 repite Seedream 4.5 y Kling O1 Image, y la voz L11 («En otra escena…») y el pie («Una toma por motor en la primera escena; Seedream 4.5 y Kling O1 Image se repitieron en otras dos») lo aclaran.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (fotos JPG del repo —C y E las limpias—, fuentes y assets-fijos/), valida y escribe index.html; imprime el cronograma de la voz (por caracteres)
node scripts/voz-tramos.mjs > qa/voz-tramos.txt   # tabla «caben / no caben» y sincronía palabra-evento (sin audio)
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~40 s). Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas): NO frena, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o preview.mp4)
# 2) recién después el final (~1 min 35 s, 4 núcleos, sin GPU). SIEMPRE con flock: nunca dos renders a la vez en esta máquina
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 28.0417 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g4-v2-final-1080x1920.mp4
for s in medir-dom ventanas hueco-tarjetas costuras eventos grep-prohibidas; do node scripts/$s.mjs; done
node scripts/aire.mjs out/g4-v2-final-1080x1920.mp4 > qa/aire.txt
node scripts/vacios.mjs out/g4-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
node scripts/psnr-fotos.mjs out/g4-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
COLS=6 bash scripts/hoja.sh out/g4-v2-final-1080x1920.mp4 qa/hoja.jpg 270 f0 f12 f24 …      # «fNNN» = cuadro NNN exacto (2 cuadros por segundo = de 12 en 12)
```
Trampas de esta pasada: `ventanas`/`aire` miden en el DOM con el timeline pausado (no hace falta renderizar); cambiar una medida de foto en `plan.json` exige borrar el derivado (`assets/cf-*.jpg`, `th-*.jpg`) antes de reconstruir; el hook Stop de auto-sync puede commitear a mitad de trabajo (no rompe nada: solo scripts de video); **una tarjeta con `a: 0` no lleva entrada** (si no, el cuadro 0 sale sin título: `desde_cero` en `timeline.js`); **el dato de una pastilla debe estar entero ≥ 0,35 s por palabra + 0,3 s antes de que empiece a salir** (por eso la del gancho entra a 0,66 s); el pie no puede decir «Una toma cada uno» a secas (el build lo corta).
