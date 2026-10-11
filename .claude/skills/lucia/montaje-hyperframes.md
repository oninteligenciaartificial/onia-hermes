# Montar un video de Lucía con HyperFrames — lo aprendido en G1 y G3 (8-oct-2026)

> Detalle de la skill `lucia` (§0-quater). Caso: **G1** «Este video no fue grabado: así se hace, en 3 pasos» (56 s, 0 cr),
> `videos/lucia-g1/`. Se montó con `editor-videos` § «Reels de Lucía» + `motion-doctrine` + HyperFrames 0.8.142, en **tres
> pasadas** con un revisor independiente después de cada una. Todo lo de acá está medido en esa nube.

## 1. Puesta en marcha (5 minutos)

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1   # usa el Chromium ya instalado; nada se descarga
npx -y hyperframes@0.8.142 telemetry disable                                            # una vez
cd videos && npx -y hyperframes@0.8.142 init lucia-gN --non-interactive --example=blank --resolution=portrait --skip-transcribe
```
- `init` deja **`AGENTS.md` y `CLAUDE.md` dentro del proyecto**: se borran, porque un `CLAUDE.md` anidado se carga como
  instrucción.
- Sin Docker, sin Whisper, sin Kokoro y sin MusicGen: no hacen falta (el `doctor` los marca como opcionales).
- Ciclo: `check` (15-27 s) → `snapshot --at t1,t2,… -o <scratchpad>` (17 s por 9 cuadros) → borrador → render alto.
- **Render** (4 núcleos, sin GPU, ~9 cuadros/s): alto de 56 s **3 min**; borrador **1 min 13 s**. Sale **sin pista de audio**:
  se agrega AAC en silencio con `ffmpeg -i raw.mp4 -f lavfi -t 56 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -shortest -movflags +faststart`
  (`-c:v copy` conserva el bt709).
- Un render lanzado con `( comando ) &` dentro de Bash **muere** («render_cancelled_parent_exited»): se lanza directo con
  `run_in_background: true` y se espera con `until [ -s archivo ]`. Un Monitor con `! pgrep -f "hyperframes.*render"` se
  matchea a sí mismo y nunca termina.
- **Borrador 360p REAL** (regla de oro de `CLAUDE.md`: preview antes del final): `scripts/borrador-360.mjs` copia el
  `index.html`, declara el lienzo en 360×640 y deja `#root` en 1080×1920 con `zoom:0.3333 !important`. Con `transform:scale` la
  imagen salía a 1/9; sin `!important` queda recortada. El render alto no baja de resolución, solo sube.

## 2. Estructura del proyecto (para no pelearse con git)

- **Dos capas:** `plan.json` (tiempos, zonas, caras medidas, textos) + `scripts/build.mjs`, que **valida las reglas y recién
  entonces escribe `index.html`** (DOM estático + un único timeline GSAP). Valida: ≤ 6 palabras por tarjeta; ≥ 0,35 s por
  palabra + 0,3; el panel citado el tiempo de lectura real; bordes ≤ 1490; clips ≤ 6,04 s; que cada empuje entre en T−6 cuadros
  y salga en T. Si algo incumple, **el build se corta**. Reconstruir desde cero da el mismo `index.html` (`cmp`).
- **El material pesado no se copia a git:** `build.mjs` copia los clips del kit, las fuentes de marca y GSAP 3.14.2 a `assets/`
  (el scaffold lo trae por CDN y el render no debe depender de la red). `assets/*.mp4`, `*.jpg`, fuentes, `vendor`, `out/`,
  `renders/` y `node_modules/` van al `.gitignore`. Se versionan `plan.json`, `scripts/`, `index.html`, `README.md`, `qa/` y `pie.txt`.
- `pie.txt` es el texto que se publica tal cual: **no lleva notas de edición**. Esas van al README y a `plan.json`.

## 3. Técnicas que funcionaron

- **Tarjetas en HTML** (réplica de `frase-card`, sin PNG de `make-mockup`): Bricolage Grotesque 700 a 66 px, riel de acento de
  12 px, sombra con **dos capas `filter:blur`** (la `box-shadow` deja costuras por mosaicos). Cada tarjeta es un `div.clip` a lienzo
  completo con ancla flex; **se anima el hijo, nunca el `.clip`**.
- **Corriente a la izquierda** (`motion-doctrine`): entrada x:+80 `power3.out` y salida x:−80 `power3.in`, 0,18 s, y **la tarjeta
  siguiente entra un cuadro antes de que termine la anterior** (nunca más de un cuadro sin tarjeta). En GSAP `power3` es una
  cuártica y `power4` una quíntica (el nombre va corrido).
- **Costura entre capas de pantalla completa = empuje rígido:** lo que sale va de 0 a −W y lo que entra de +W a 0, con la
  misma curva y duración, pegado borde con borde, en la ventana [T−6 cuadros, T]; el elemento entrante lleva `data-start` = T−6
  cuadros. Un `cut-the-curve` con salida y entrada separadas deja tiras de fondo vacío. **Las tarjetas también viajan con el
  empuje** (saliente −W, entrante +W): si solo viaja la saliente quedan 2 cuadros vacíos. `seam-stamp`/`seam-gate`/`ledger.json`
  **no aplican** a un montaje de una sola raíz.
- **Morph de foto a ventana de pantalla partida:** la misma `<img>` anima `clipPath: inset(...)` y `y`; el clip de abajo sube
  desde el borde inferior con la misma curva (así los bordes nunca se pisan) y sin fundido. Un `<video>` se recorta a una
  ventana sin envoltorio con `object-fit:cover; object-position:50% P%`. Para videos conviene `opacity` y no `autoAlpha`.
- **Marcar una cita literal sin romper su maquetación:** color + subrayado animado (`background-size` 0 → 100 %, 4 px) y la
  numeración en una fila de chips aparte. Las insignias dentro de la frase dejan huecos visibles hasta que llegan.
- **Placa de evidencia** (cuadro 60 de un clip): se pre-recorta con ffmpeg a un archivo propio en vez de un `<img>` gigante con
  offsets (evita los avisos `container_overflow`). **No se congela a Lucía**: la placa es una tarjeta de evidencia sobre fondo oscuro.
- Si un clip entra dentro de un empuje, **sus primeros cuadros ya cuentan**: todo lo anclado a su cuadro N (barra, recorte, sello,
  golpe de zoom) se corre con él (`t_foco = inicio + N/24`).
- La foto de arranque de un clip ES su cuadro 0 (PSNR 42 dB en K2): el corte foto → clip es invisible por construcción y **no
  lleva empuje**; el corte clip → foto sí.
- Con la cara **abajo** del cuadro (K4: mentón en y=1405) no hay franja hasta y=1490: el texto va **arriba**, en el cielo
  (excepción documentada en el README; la receta de `editor-videos` no la contempla).

## 4. Controles numéricos (reemplazan el «mirar si parpadea»)

| Control | Qué atrapa |
|---|---|
| `scripts/medir-dom.mjs` (Playwright en `/opt/node-tools`) | zona segura medida en el DOM (`getBoundingClientRect` a la mitad de cada elemento), **ningún texto < 34 px**, sello sin pasar de y=885. Salta los cuadros con opacidad < 0,05 |
| `scripts/hueco-tarjetas.mjs` | cuadros sin tarjeta (opacidad ≥ 5 % **y** caja ≥ 25 % dentro del lienzo: una tarjeta ya salida con opacidad 1 engaña) |
| `scripts/vacios.py` (numpy + cv2 del venv del face-gate) | cuadros planos (std de luma < 6) y los mayores saltos de luma entre cuadros |
| PSNR contra la fuente | que el clip caiga en el cuadro prometido: se mira **qué cuadro da el PICO** (final 1038 contra K4·60 = 36-46 dB; el vecino 23-31 dB). El PSNR absoluto depende del escalador; contra clips sin `color_space` (Kling) da 23-25 dB aunque la imagen sea igual (bt601 contra bt709): para color se compara la media RGB (≤ ±2 niveles) |
| `scripts/face-gate.sh` | que el escalado ×1,5 y el H.264 no deformen la cara (diferencia ≤ 0,02 contra la fuente en el mismo instante) |
| `hyperframes check` | errores de runtime, layout, motion y contraste (31/31 AA). Deja ~24 avisos de estilo (`nested_structure_needs_subcomposition`, `timeline_track_too_dense`) que no frenan |

## 5. Trampas (todas pagadas en G1)

- `ffmpeg -ss` **antes** de `-i` entrega el primer cuadro con pts ≥ t, no el que contiene a t: una hoja de contactos salía corrida un
  cuadro. Para caer en el cuadro F: `-ss (F−0,4)/24`. El último cuadro de 56,000 s a 24 fps es el **55,95**, no el 56.
- `crop=369:…` sobre yuv420p se redondea a 368 y el filtro `psnr` falla («Failed to inject frame»): dimensiones pares.
- `tl.set(sel,{autoAlpha:0},0)` no pinta en t=0 si el playhead ya está ahí: `immediateRender:true`. Los on/off puestos a ±0,5
  cuadro no dependen del redondeo de f/24.
- Contraste: una insignia con `opacity 0,32` dio 1,59:1 y `check` la frenó; con 0,62 pasa.
- Los detalles de rotulado se miran **a resolución completa**: un sello que pisaba la etiqueta no se veía en el borrador 360p.
- Copiar clips a `assets/` metió 18 MB repetidos en git: se copian en cada build y se ignoran.

## 6. El método (lo que más pesó)

1. **Un revisor independiente después de cada pasada, mirando el video renderizado.** Atrapó lo que el editor no vio: una
   etiqueta «tapada» **falsa** sobre dos cuadros que se veían limpios, una etiqueta que ocultaba la punta del dedo que prueba
   «cinco dedos», un recuadro «origen» que resaltaba un instante en que la otra mano cruzaba, un borde verde que sugería una
   verificación que el video no hace, y cuadros vacíos entre tarjetas.
2. **Cada afirmación que el video hace sobre sí mismo se verifica contra los cuadros** (el rótulo «tapada» salió de agrupar un
   bloque entre dos muestras de los extremos). Un bloque de cuadros no se rotula por dos muestras.
3. **Un agregado que el guion no trae se marca como reversible** (`plan.json` → `agregados_al_guion`) y se le dice a la madre.
4. Tres pasadas fueron 54 + 51 + 19 minutos de reloj y ~1,6 millones de tokens entre editor y revisor. La primera ya salió
   publicable en lo técnico; las otras dos corrigieron honestidad y oficio.

## 7. Lo que sumó G3 (58 s, 8-oct: montar → revisor independiente → corregir, 69 minutos de reloj, ~1 millón de tokens)

- **Plantilla:** G3 se arrancó copiando `videos/lucia-g1/` (README, plan.json, scripts) y adaptando contenido y validaciones. El montaje salió
  en un solo agente; el revisor encontró 10 hallazgos (1 alto, 2 medios, 7 bajos) y todos se aplicaron o se dejaron como decisión de la madre.
- **Un clip que entra en un empuje arranca en el INICIO del empuje** (T = tiempo del guion + 0,25 s para el plano que sale): así sus cuadros
  caen en los segundos del guion. Si el clip sale en un empuje, sus últimos 6 cuadros viajan dentro y el último cae fuera de pantalla.
- **Validar el guion contra la evidencia ANTES de montar.** G3 dejaba 0,9 s sin tarjeta y afirmaba «la otra mano ya se fue» en el cuadro 120
  (falso). Mandó la evidencia. Y la tarjeta sobre un BLOQUE de cuadros se escribe después de contar los cuadros a resolución completa, de a 3,
  en una hoja con el número de cuadro: «Así no se cuentan dedos.» era cierta solo en 72 y 104 → «Si cruza, no se cuentan.».
- **Una tarjeta en el hueco de una pantalla partida tapa la cara que se encoge durante el morph** (el `clip-path` no escala el contenido):
  la tarjeta entra al terminar el morph y las ventanas de la partida se eligen **solo con fondo**.
- **Desenfoque con pluma de un letrero** (ffmpeg, sin rectángulo visible): `split` → `crop` → `gblur=sigma=S:steps=3` → `geq` con alfa
  `255*min(1,min(min(X,W-1-X),min(Y,H-1-Y))/PLUMA)` → `overlay`. Medido: sigma 4 y 6 siguen legibles a 1080 px; sigma 9 con pluma 30 es ilegible.
  La caja debe cubrir los descendentes (q, p).
- **Contador de cuadros sin callbacks:** una tira de N números con `ease 'steps(N-1)'` de GSAP animada en y, arrancando 1/4 de cuadro antes
  del cuadro 0 del clip para que cada instante n/24 caiga en el MEDIO de su escalón. Se verifica leyendo la transform en los 145 cuadros
  (`medir-dom.mjs`). Evita `onUpdate`: los seeks de HyperFrames pueden suprimir eventos.
- **Planos largos sobre una foto fija** (13 s) se sostienen con eventos reales baratos: acentos de texto a mitad de tarjeta, recortes
  ampliados con su recuadro exacto en la foto (se sacan de la foto NATIVA, no del plano escalado) y un segundo recorte de OTRA zona. El hueco
  máximo entre eventos se mide con script desde `plan.json` (`scripts/eventos.mjs`): el primer arreglo dejó 3 s sin evento y el script lo atrapó.
- **El puntaje de cara depende de la imagen medida:** la foto descartada da 0,835 en el original de 1440×2560 y 0,826 en el JPG de 720 px. Con
  caras de ~120-180 px el número es ruidoso (diferencia hasta 0,03): para separar ruido de deformación se mide también la fuente llevada a
  1080×1920 sin comprimir y se **alinean los instantes con el cuadro 0 de cada clip**.
- **`medir-dom.mjs` detecta choques:** cada 0,25 s mide la caja de todo texto visible y reporta intersecciones > 4 px entre elementos distintos.
- **Trampa de los derivados:** `build.mjs` genera las imágenes derivadas (`ag-inset*.jpg`, `letrero-inset.jpg`, `descartada.jpg`, `k4cuadros/`)
  SOLO si faltan: al cambiar una caja en `plan.json` se borra el archivo derivado antes de reconstruir (quedó escrito en el README).
- **Trampas menores:** el letrero de la torre está en y≈70-146, dentro de la barra superior de Instagram (un aro ahí queda medio tapado: lo dicen
  la tarjeta y una etiqueta); con 30 elementos con `filter:blur` `check` avisa «composition_heavy_overlay_count_high» pero el render salió bien
  (si se pasa de ~35 tarjetas conviene fusionar las dos sombras en una); una hoja PNG de 30 recortes pesó 4,4 MB y en JPG 426 KB; el validador
  cuenta bien las palabras y el revisor se equivocó de a una («A veces no se cuentan.» son 5): se cuenta con el script.
- **El hook Stop de auto-sync commitea a mitad de trabajo** el andamio del proyecto aunque se diga «sin git»: no rompe nada (solo scripts de
  video) pero deja una versión intermedia en la rama; el orquestador commitea el estado final encima.

## 8. Lo que sumó G2 (58 s, 9-oct: montar → revisor independiente → corregir, 81 minutos de reloj, ~1,1 millones de tokens)

- **Las cifras que el video pone en pantalla se validan DENTRO del build contra la fuente** (`v4/PROCEDENCIA.jsonl`): arranque y final
  redondeados a 2 decimales con media hacia arriba (con epsilon 1e-7: 0,805 × 100 da 80,4999…), créditos, segundo de la última muestra y la
  cuenta del «4×». Si no coinciden, el build se corta. Los puntos y barras de las placas se posicionan desde el dato (`x = 100 + 880 × valor`)
  y `medir-dom` lo verifica en el DOM.
- **«4× el precio» solo es cierto por segundo** (20 cr por 4 s = 5 cr/s contra 1,25): por clip son 2,67×. Un comparativo de precios dice a qué
  unidad se refiere.
- **Pila de texto anclada al fondo como un contenedor flex en columna** (sello / pastillas / tarjeta) en vez de coordenadas a mano; `medir-dom`
  compara contra el mentón MEDIDO por cuadro (`qa/caras-por-clip.json`, SCRFD cada 2 cuadros). Caso: la cara crece 2,5× y el mentón baja de 726 a 1016.
- **`scripts/ventanas.mjs`:** mide la ventana REAL en que cada texto que no es tarjeta es legible (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo)
  contra 0,35 s/palabra + 0,3. El plan decía 1,5 s para el «4×» y el revisor midió 0,7 s: `build.mjs` valida el plan pero no ve entradas ni empujes.
- **Cuando un hallazgo pide más tiempo de lectura del que cabe, se RECORTA el clip** (a 1×, sin congelar) y se adelanta la placa; mover todo lo
  posterior desancla cada clip de su segundo del guion. Los elementos estáticos que llegan con la placa cuentan desde el reposo.
- **GSAP pisa el CSS `transform`:** un `translateX(-50%)` en CSS que luego se anima con `x` queda descentrado: se centra con un contenedor flex. Una
  barra que crece con texto adentro se anima en `width` con `overflow:hidden`, no en `scaleX` (aplasta el texto).
- **Fundido cruzado de dos rótulos en la misma caja:** a mitad ambos pasan el umbral y `medir-dom` reporta «texto pisado»: se apaga el viejo 0,1 s
  y recién después se enciende el nuevo. Una tarjeta que NO viaja en un empuje arrastra lo que cuelga de ella (z 10 contra z 4 de las placas): todo
  sale antes de que empiece el empuje.
- **Dos `<video>` pueden apuntar al mismo archivo** (Motor 1 y cierre) sin copiarlo; los que se solapan en un empuje llevan `track-index` distinto.
  `data-media-start="2"` recorta el inicio sin reencodear, pero el offset hay que propagarlo a todos los scripts de QA (PSNR contra el cuadro n+48).
- **Una placa de ranking sugiere «el mejor»** aunque el guion lo prohíba: se neutraliza en la MISMA placa con «Una toma cada uno: es una prueba, no una
  regla» y marcando que el piso lo fijó la sesión.
- **Extraer el pie del guion con una regex sobre un markdown con varias citas toma la primera cita del archivo** (salió media tabla de evidencia):
  se ancla al bloque `## Pie` y se compara con `pie.txt` en cada build.
- **El guion mismo se equivocó dos veces y el video lo corrigió:** «Motor 3: misma escena» y «Motor 6: estable» eran falsas (los dos reencuadran), y
  «caras de 89 a 180 px» eran 89 a 348. Y «Atado a la foto: baja» generalizaba desde tres motores: pasó a «suele bajar». El guion se corrige con lo medido.
- **El render no es bit a bit reproducible entre herramientas** (miniaturas con OpenCV INTER_AREA o con ffmpeg lanczos) y hasta un comentario en
  `timeline.js` cambia el `index.html` (se embebe). El cierre (clip K1) arranca en 2,0 s para que el CTA caiga sobre la mirada a cámara.
- **Tiempos (4 núcleos, sin GPU):** borrador real 1 min 40 s, final con un clip nativo de 1080p 3 min 38 s (60 MB; sin clip 1080p, G3 pesó 23 MB).

## 9. Lo que sumó G4 (57 s, 9-oct: solo fotos fijas; montar → revisor independiente → corregir, ~45 min de reloj el montaje)

- **Fotos fijas con empuje lento (1,00 → 1,04):** el contenedor `.clip` con `overflow:hidden` viaja en el empuje rígido y la `<img>` hace el zoom, así los bordes
  quedan pegados aun al 1,04. La `<img>` lleva `data-layout-allow-overflow` o `hyperframes check` avisa `container_overflow`. El mentón de `medir-dom` se corre con el
  zoom de cada instante. Verificación numérica: `psnr-fotos.py` arma el encuadre (cover + zoom con origen en la cara) y lo compara con las 8 fotos candidatas;
  el pico tiene que ser la foto del plan y la escala del plan (en G4, 34,9-41,7 dB contra 9-14 dB de las otras siete, 24/24 cuadros).
- **El puntaje de cara de un cuadro no es el del original.** La foto F pasó de 0,658 (PNG) a 0,672 (JPG de 1080) y a 0,685-0,696 (cuadro con zoom), sin deformar la cara. El
  escalado se comprueba contra la fuente al mismo zoom (`fuente-con-zoom.py` + `face-gate.sh`, ≤ 0,02), no contra el número del guion. En pantalla va el número del original medido.
- **Las afirmaciones se validan en el build, y el guion se equivoca antes de renderizar.** `build.mjs` recalcula contra PROCEDENCIA «pagar más no la parece más»,
  «la sostuvo en tres escenas» y «la perdió en una de tres» y corta si fallan. Atrapó una tarjeta de 7 palabras con máximo 6.
- **`ventanas.mjs` con `textContent` pega hermanos** («Escena 1» + «0,79» cuenta como 2 palabras): se cuenta con un TreeWalker sobre los nodos de texto.
- **El borrador 360p da 1 «error» de lint** (`root_zoom_rescales_a_fixed_canvas`) y 1 aviso que no frenan el render: no usar `--strict`.
- **Un número solo no dice qué mide:** el dato dice «parecido 0,81», no «0,81».
- **Una imagen que no es Lucía** (la B del café, 0,35) se rotula como lo que es («Imagen B · café») y la tarjeta lo dice: «El café: B perdió la cara».
- **Dos formas incidentales** (un perfil gris tipo letra en C, un óvalo borroso en el monitor de E) vienen de la imagen de IA: se evalúa si se leen como marca; si sí,
  se difuminan con pluma como en G3.

## 10. Lo que sumó G5 (57,5 s, 9-oct: placas con datos y cuadros fijos de clips; montar → revisor → corregir → re-revisar → pasada mínima)

- **Tres pasadas de redacción, ninguna de imagen.** Los hallazgos del revisor fueron de honestidad del texto: «baja sola» exageraba (se midió −0,004 a −0,010), «0,66: se parece poco»
  cae dentro del ruido que el video declara 15 s después, y «es ruido» afirma una causa con un solo clip (rango 0,028): quedó «cabe en ±0,03». El `build.mjs` corta si reaparece una
  frase vieja (lista de frases retiradas) y valida las cifras contra PROCEDENCIA; así una corrección no se pierde en la pasada siguiente.
- **Un cuadro fijo sacado de un clip se versiona** (`assets-fijos/` con `ORIGEN.md`, clip, cuadro, SHA y `extraer-cuadros.sh`): el clip crudo vive en el disco de la nube y se pierde.
- **Difuminar un letrero inventado exige decirlo en pantalla** («Lo difuminé: lo inventó el motor.») y un aro que cubra TODO lo difuminado; si no, la prueba de que el motor inventa queda invisible y
  una mancha sin explicar parece un defecto.
- **Escala ampliada para valores muy juntos:** en la escala 0-1, 0,77 y 0,79 quedan a 17 px y se pisan; se amplía (0,70-0,90), se rotula «Zoom» y se repite la marca del piso.
- **Control propio antes del guion:** reducir la misma foto hasta que la cara mida 60 px (0 cr) mostró que la afirmación del guion no se sostenía. Un número del gate medido en cuadros con zoom difiere hasta 0,04 del PNG
  original (F): en pantalla va el del original y el README dice las cuatro medidas.
- **Una llamada o nota nueva se mide en el DOM** (`ventanas.mjs`): la de 44 px entra a 32,0 s y necesita 3,80 s; las 3 piezas tocadas se rehacen siempre que se cambia texto.

## 11. Lo que sumaron los re-cortes mudos v2 de G2, G3, G4 y G5 (≤ 30 s, 11-oct: editor → revisor independiente → arreglos → verificación de la madre)

- **La voz se mide en CARACTERES a ≈ 17 car/s, no en palabras** (G1 v2: 320 car ≈ 19 s). Los cuatro re-cortes calcularon sus tramos a 3,6 pal/s (≈ 20 car/s) y en los cuatro el revisor halló líneas que pisan a la
  siguiente (G4: L5 se pasaba 0,57 s) y huecos > 0,25 s. El arreglo fue acortar el TEXTO hasta que cada línea cupiera en su ventana, sin mover tarjetas; cuando haya voz real, mandan las duraciones medidas y se retemporiza.
  Herramientas en `videos/lucia-g5-v2/scripts/`: `voz.mjs` (tramos por caracteres), `retemporizar.mjs`, `poner-voz.mjs` (avisa de solapes y de huecos > 0,25 s; mide con `silencedetect` y `ebur128`, −14 LUFS). 100 car ≈ 6 s.
- **Un gate que no cubre todo da falsa paz.** `ventanas.mjs` de G2 no medía las 12 tarjetas (4 quedaban 0,01 a 0,16 s cortas de su lectura). Al cerrar, contar que el gate mide TODAS.
- **El master se renderiza SIEMPRE desde el `index.html` final** (en G2 y G3 el HTML era posterior al master). Build idempotente: dos builds, mismo md5.
- **Toda afirmación general se contrasta con TODOS los casos medidos antes de ir a pantalla.** «Misma foto» era falso para Kling O3 (5 referencias, sin foto de inicio); «una toma cada uno» era falso (Seedream 4.5 y Kling O1 Image se repitieron);
  «la luz cambia cuando la cara se sostiene» lo desmienten Kling O3 y Cinematic Studio (pieza 9). Con un contraejemplo, la afirmación se limita a lo que el video muestra y lleva «una toma cada uno: es una prueba, no una regla».
- **Un fallo con nombre lleva su contrapeso** en el video o en el pie: Kling O1 Image 0,35 en el café y 0,79 y 0,83 en las otras dos escenas.
- **Gancho (§4-bis):** título o pregunta en el cuadro 0 (`a: 0`; una tarjeta con `a: 0` no lleva entrada) y un número medido antes de los 3 s. Una pastilla de 2 palabras necesita 1,0 s entera. El `a` del plan es el FIN del empuje: la tarjeta entra
  1 cuadro antes de que empiece (por eso `plan.json` e `index.html` difieren 0,25 s; es diseño, no error).
- **ArcFace sí corre en la nube sin instalar nada si ya existen el venv y los modelos** (los dejó una sesión anterior en su scratchpad: `venv-face` y `face_models`; referencias locales en `videos/lucia-g4-v2/assets/refs-orig/`, ignoradas por git):
  `FACE_QA_MODELS=<modelos> <venv>/bin/python -I scripts/face_identity_qa.py manifest.json` con un manifest `{refs locales, negatives: {}, tests}` (el manifest base trae URLs: sin red no sirve). El editor de G5 dio por imposible medirlo
  («no hay venv») y la madre lo midió con eso: final↔fuente 0,009 (límite 0,02). Si el contenedor es nuevo, `face-gate.sh` lo instala y pide aprobación.
- **Renders concurrentes:** con 4 núcleos y varios agentes un render murió al 74 % (carga ≈ 10). Todo render va bajo `flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render …`.
- **Los gates DOM** (`hueco-tarjetas`, `ventanas`, `grep-prohibidas`, `medir-dom`) corren con el Chromium por defecto de Playwright aunque `/opt/pw-browsers/chromium/chrome` no exista (caen al `chromium-1194`): un verificador que dice «no hay Chromium»
  leyó la ruta, no la máquina. Se corren sobre una COPIA de la carpeta, porque algunos escriben en `qa/`.
- **Nombres contra el catálogo (`models_explore`, gratis, 11-oct):** Seedream 4.5, Kling O1 Image, Nano Banana 2.1, Seedream 5.0 Pro, GPT Image 2.5 y Seedance 2.0 Mini coinciden; «FLUX 3» se lista «FLUX 3 Image»; **«Kling O3» se lista «Kling 3.0 Omni» y
  «Cinematic Studio 3.0» «Cinema Studio Video 3.0»** (decisión de la madre pendiente en G2 y G5).
- **El editor no se auto-aprueba.** En cada pieza el revisor halló lo que el editor no vio (título después del cuadro 0, pie falso, «misma foto», voz que no cabe) y la madre repite la verificación (ArcFace, gates en copia, cuadros mirados, SHA por
  un verificador haiku) antes de escribir «LISTA PARA MOSTRAR». Un «todo exit 0» del editor no se acepta sin repetirlo.
