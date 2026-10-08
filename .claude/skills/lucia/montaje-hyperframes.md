# Montar un video de Lucía con HyperFrames — lo aprendido en G1 (8-oct-2026)

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
