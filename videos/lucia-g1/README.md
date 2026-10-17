# Lucía · G1 «Este video no fue grabado: así se hace, en 3 pasos» (56 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G1-de-una-foto-a-un-video.md`.
**Costo: 0 créditos** (clips K1 `e470ef4f`, K2 `83130c4a`, K4 `338b751f` y fotos `4afffb96`, `3e05cfd0`, ya pagados).
**Estado: 3ra pasada (8-oct) aplicados C1-C6 de la 2da revisión independiente (sobre la 2da pasada, que aplicó H1-H11). PARA VER POR LA MADRE (preview 360p). No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (ver «Audio» abajo).

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, zonas, costuras y medición de caras | `plan.json` |
| Generador (valida reglas → escribe `index.html`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Preview 360p (render REAL de HyperFrames a 360x640, también en `qa/`, que sí va a git) | `out/g1-preview-360p.mp4` |
| Final 1080x1920 (ignorado en git) | `out/g1-final-1080x1920.mp4` |
| QA mirado: hojas con guías (`hoja-qa`, `hoja-costuras`, `hoja-eventos`, y de la 3ra pasada `hoja-c1-origen`, `hoja-c2-lupa`, `hoja-c3-sello`, `hoja-c4-empuje-35`, `hoja-c4-empuje-41`, `hoja-c5-morph`), zona segura + tamaño mínimo + sello de K4 (`zona-segura`), grep, cara, specs, cuadros planos y saltos de luma (`vacios-y-saltos`), huecos de tarjeta (`hueco-tarjetas`), cuadro 60 de K4 (`k4-cuadro60`) | `qa/` |
| Para publicar: qué cuadro es la portada | `plan.json` → `publicacion` y `qa/portada-0.6s.jpg` |

## Tabla de cortes (la del guion; **cambiado** y **agregado** marcados)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0 – 6 | K1 cuadros 0-143, pantalla completa. **Cambiado:** sale en un empuje a la izquierda de 5,75 a 6,0 | rótulo «Lucía Antelo · personaje IA de Onia» 0-2,4 · «Este video no fue grabado.» · «Así se hace, en 3 pasos.» |
| 6 – 16 | Foto K1 fija (entra en el empuje 5,75-6,0) | ① «Una foto fija.» · «Primero la cara, siempre igual.» («siempre igual.» se enciende a 14,2 s: acento de texto) · etiqueta «Imagen · 1 crédito» · marco de esquinas sobre la cara (10,4 s) · **agregado (H4):** lupa de la cara de la foto a 12,5 s, sin texto. **Cambiado (C2):** el borde de la lupa queda NEUTRO todo el tiempo (antes se «confirmaba» en verde a 14,2 s) |
| 16 – 30,5 | Foto K1 de fondo + panel «Orden real». **Cambiado (H6):** la tarjeta ② dura 16,0-18,5 (antes 16,0-19,5) y el panel entra a 18,5 y se queda hasta 30,5 (antes 19,5-31,0) | ② «Una orden corta.» · panel con las 31 palabras literales y tres marcas **solo con color y subrayado (H5)**: movimiento (20,4 s), cámara (24,2), luz (27,0); las insignias ①②③ van en los chips de abajo |
| 30,5 – 35 | Partida: foto K1 arriba (morph desde pantalla completa), clip K1 abajo. **Cambiado (C5):** el clip arranca a 30,5 s (antes 31,0) y SUBE desde el borde de abajo con el morph de la foto, en la misma curva; cuadros 0-107 (antes 0-95). Sale en empuje 34,75-35,0 | ③ «Y la foto se mueve.» **entra a 30,75 s** (antes 31,0) · «Video 6 s · 7,5 créditos» · *(agregado)* «Imagen · 1 crédito» arriba |
| 34,75 – 41 | *(el guion no decía qué imagen; agregado)* visor + tira de los 8 cuadros de la hoja de manos de K4 (0, 60, 72, 84, 96, 104, 112, 120), recortes a resolución completa. Entra y sale en empuje | «Después, se mira cuadro por cuadro.» · **cambiado (H1):** «5 dedos» en 0, 60, 84, 96, 112 y 120 · «cruza» solo en 72 y 104 (fuente: `v4/PROCEDENCIA.jsonl` línea 94). La palabra «tapada» ya no existe. **C4:** la tarjeta de esta placa viaja con el empuje de entrada (34,75-35,0) y con el de salida (40,75-41,0) |
| 40,75 – 45 | K4 **cuadros 0-101** (antes 0-95: los 6 primeros pasan dentro del empuje de entrada). El cuadro 60 cae ahora a 43,25 s (antes 43,5) | «Cuadro 60: cinco dedos.» (entra con el empuje de 40,75-41,0) · barra de cuadros · a 43,25 s cae el recorte de la mano + sello «5 dedos» + golpe de zoom +3 %. **Cambiado (H2):** la etiqueta «cuadro 60» va abajo a la izquierda del recorte (sobre la muñeca) y las cinco puntas quedan libres. **Cambiado (C1):** el recuadro verde «origen» sobre la mano en vivo solo está a la vista en f1038-f1041 (K4 cuadros 60-63) y desaparece en f1042 (antes seguía hasta 44,1 s, f1056, con el dedo de la otra mano cruzando). **Cambiado (C3):** el sello «5 dedos» subió 40 px: borde de abajo a y=878-879 (antes ≈912, tangente al cabello en ≈915) |
| 44,75 – 50 | Foto K2 (entra en empuje 44,75-45,0) | «Foto y clip: 8,5 créditos.» · *(agregado)* «1 + 7,5 = 8,5», **cambiado (H4):** los cinco términos entran de a uno (46,0 · 46,8 · 47,5 · 48,2 · 48,9) |
| 50 – 56 | K2 cuadros 0-143. Corte de continuidad a propósito (ver costuras) | «Foto, orden y revisión.» · «Seguime: cada semana, una prueba.» (se queda hasta el último cuadro) |

**Tarjetas (H8):** cada tarjeta, salvo la 1ª de cada cadena, entra **1 cuadro antes** de que termine de salir la anterior (a - 1/24) y las dos
usan 0,18 s / 80 px con eases espejados (power3.out / power3.in): nunca hay un cuadro sin tarjeta y la velocidad coincide. Medido: `qa/vacios-y-saltos.txt`.
**Excepción (C4, 3ra pasada):** en los empujes de 35,0 y 41,0 s las dos tarjetas (la que sale y la que entra) VIAJAN con el empuje: −1080 y +1080 con la misma curva
(`power3.inOut`, 6 cuadros) que la imagen, a `plan.json → costuras[].tarjetas`. Antes la saliente quedaba fija 2-3 cuadros sobre la imagen que entraba («Y la foto se mueve.» sobre la
tira en f837-f839; «Después, se mira cuadro por cuadro.» sobre el cuerpo de Lucía en f981-f983). Ahora imagen y tarjeta son una pieza rígida: el hueco entre la que sale y la que
entra es constante (≈ 245 px en 35,0 s), no se pisan con nada y en cada cuadro hay una tarjeta a la vista (`hueco-tarjetas` ahora exige que la tarjeta esté dentro del lienzo, no solo con opacidad).
Las costuras de 6,0 y 45,0 s conservan la entrada/salida de 80 px (la revisión no marcó solapes ahí); si se quiere el mismo trato, es agregar `tarjetas` a esas dos costuras.

## Costuras (H3) — la corriente va a la IZQUIERDA (`motion-doctrine`)
Una costura de pantalla completa es un **empuje rígido de 6 cuadros** (0,25 s, `power3.inOut` de GSAP = cuártica): lo que sale va de 0 a −1080 y lo que
entra de +1080 a 0, con **la misma curva, la misma duración y pegado borde con borde**. La velocidad coincide en cada cuadro, nunca queda un cuadro vacío ni un
destello y el cuadro T ya es la imagen nueva en reposo (su tarjeta entra en ese mismo cuadro). Hacerlo con salida y entrada separadas (cut-the-curve a
medias) sobre capas de pantalla completa deja tiras de fondo vacías en los bordes; el empuje rígido evita eso.

| T (s) | Costura | Antes | Ahora |
|---|---|---|---|
| 6,0 | K1 (sonrisa a cámara) → foto K1 | corte duro, pose reiniciada | empuje 5,75-6,0 |
| 30,5 | foto → ventana de arriba / clip sube | morph; el clip entraba a 31,0 s con fundido y el lienzo quedaba oscuro y vacío ~0,5 s (f730-f745) | **3ra pasada (C5):** el clip sube desde el borde de abajo EN LA MISMA CURVA que la foto se encoge (borde de la foto 1920 − 1130·p, borde de arriba del clip 1920 − 940·p: nunca se pisan) y la tarjeta ③ entra a 30,75 s. Medido: sin tarjeta 7 cuadros (30,50-30,79 s, con el clip subiendo) en vez de 13 (30,50-31,04 s con el lienzo oscuro); luma mínima 105 en 30,5-31,2 s (antes 59,5), ningún cuadro plano |
| 35,0 | pantalla partida → placa de cuadros | se apagaba en 3 cuadros, cuadro 840 VACÍO (luma 14,7) | empuje 34,75-35,0 (luma 105 → 34 en 4 cuadros, saltos máx. 28, sin cuadro plano). **C4:** las tarjetas ③ y de la placa viajan con el empuje |
| 41,0 | placa → K4 | luma 25 → 164 en un cuadro (destello) | empuje 40,75-41,0 (luma 35 → 150 repartida en 5 cuadros, salto máx. 46). **C4:** las tarjetas de la placa y de K4 viajan con el empuje |
| 45,0 | K4 (cielo) → foto K2 (interior) | corte duro | empuje 44,75-45,0 |
| 50,0 | foto K2 → clip K2 | corte duro | **sin cambios, a propósito:** la foto K2 ES el cuadro 0 del clip (PSNR 42,2 dB), el corte no se ve; un empuje movería la misma imagen y rompería el momento en que la foto cobra vida |

## Decisiones que la madre puede revertir (cada una en `plan.json`)
1. **K4 tiene la cara abajo** (mentón máx 1405 px): no hay franja hasta y=1490, así que ahí el texto va ARRIBA, en el cielo (tarjeta y 290-452,
   recorte 492-885), no bajo el mentón. **Excepción documentada (H9):** la receta de `editor-videos` («texto entre mentón + 40 y 1490») no contempla texto
   arriba; en K4 manda «no tapar la cara». Nada de texto baja de y=885 mientras se ve ese clip: **medido** por `scripts/medir-dom.mjs` (3ra pasada, C3) en cada cuadro del sello «5 dedos»
   con su rotación y su escala (borde de abajo y=879 en el primer cuadro visible, 878 en reposo; el recorte termina en 885; el cabello empieza en ≈915).
2. «1 · Una foto fija.» se dibuja como insignia numerada + texto, sin el «·» (así la tarjeta cuenta ≤ 6 palabras con criterio estricto).
3. El panel «Orden real» (cita literal de 31 palabras, 12 s en pantalla, 11,38 s legibles contra 11,15 exigidos) es la excepción documentada del guion.
4. **Agregados al guion** (`plan.json` → `agregados_al_guion`, cada uno con su forma de revertirlo):
   - la **placa de 35 a 41 s** (no se apaga sin decidir qué va en esos 6 s: se cambia el medio `plate` por otro clip o foto ya pagados);
   - la etiqueta **«Imagen · 1 crédito»** de 31,6 s en la partida (`etiquetas → d3 → "activo": false`);
   - la cuenta **«1 + 7,5 = 8,5»** (`etiquetas → eq → "activo": false`);
   - (2da pasada) la **lupa de la cara** a 12,5 s (`lupa → "activo": false`), recorte de la foto nativa 1440x2560 a ×1,6, sin texto ni afirmaciones.
5. Costuras: empuje rígido de 6 cuadros (ver arriba); el 50,0 s queda como corte de continuidad.
6. Las marcas del panel se anclan a la entrada del panel (+1,9 / +5,7 / +8,5 s) para que «luz» tenga 3,3 s a la vista (antes 2,3).
7. **Audio (C6, decisión escrita): la pista es silencio (−91 dB) y NO se agregan pops/SFX en las costuras, a propósito.** Dos motivos: (a) dejan sitio a la música que pone
   Sergio Urcullo (un pop en cada empuje se pisaría con el ritmo de la pista que él elija); (b) los SFX de HyperFrames no están disponibles en esta nube, así que no hay material sonoro
   verificado. Si después se quiere un golpe por costura, caen en 5,75 / 34,75 / 40,75 / 44,75 s (inicio de cada empuje) y 30,5 s (morph). Está también en `plan.json → audio`.
8. **Cambios respecto del guion en la 3ra pasada** (cada uno en `plan.json`): la tarjeta ③ «Y la foto se mueve.» entra a **30,75 s** (el guion la tenía a 31,0) y el clip de abajo de la
   partida arranca a **30,5 s** (guion: 31,0), con lo que K1 usa los cuadros 0-107 en esa ventana (antes 0-95); la pantalla partida sigue terminando a 35,0 s. El resto de los tiempos del guion no se movió.

## Publicación (H10)
El cuadro 0 lleva el rótulo de IA pero el gancho entra de 0,1 a 0,25 s. Si Instagram toma el cuadro 0 como portada, no dice nada.
**Elegir como portada el cuadro a ≈ 0,6 s** (rótulo + «Este video no fue grabado.», ver `qa/portada-0.6s.jpg`). El montaje no cambia.
La nota va aquí y en `plan.json`, NO en `pie.txt`: ese archivo es el texto que se publica tal cual.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material del kit a assets/ (ignorado), valida y escribe index.html
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check            # lint + runtime + layout + motion + contraste (~15 s)
# 1) BORRADOR 360p REAL primero (~75 s; el final tarda ~3 min). Mirar las costuras ahí:
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
# 2) recién después el final
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4    # ~3 min, 4 núcleos, sin GPU
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 56 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g1-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/grep-prohibidas.mjs   # zona segura (34 px mínimos + sello de K4), tarjeta a la vista en cada cuadro, frases prohibidas
COLS=6 scripts/hoja.sh out/g1-final-1080x1920.mp4 hoja.png 300 f140 f141 f142 …   # hoja con guías; «fNNN» = cuadro NNN exacto
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g1-final-1080x1920.mp4 > qa/vacios-y-saltos.txt   # cuadros planos, saltos de luma y la luma de cada costura (incluye el morph de 30,5 s)
bash .claude/skills/lucia/scripts/face-gate.sh out/g1-final-1080x1920.mp4@1,12,33,43,52,55   # cara (FACE_GATE_HOME fuera del repo)
```
