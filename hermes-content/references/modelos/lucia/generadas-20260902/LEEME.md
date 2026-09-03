# Banco del 2026-09-02 — la ventana FANCY (E1–E7)

Índice de piezas con su **asset id** (imágenes) y estado. Los creativos de anuncio de los videos
de café están en [`CREATIVO.md`](CREATIVO.md); la receta consolidada, en
[`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md) §12–17.

Generadas con `lucia-skin-v1` (`58bbd635-…`) por CLI en el VPS, Nano Banana Pro, **2K · 9:16**
(`1536×2752`), 2 créditos cada una. Asset id sacado del nombre del archivo que descarga Higgsfield
(`hf_<fecha>_<hora>_<uuid>.png`), guardado en los `_E*.log` de esta carpeta.

## Imágenes

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `E2-A-rooftop.png` | Rooftop de Santa Cruz al atardecer, vaso para llevar sobre la baranda de vidrio — toma A | `460df6ae-a209-4953-82c9-16e719bb940f` | ✅ **la 2ª mejor rooftop, y la próxima a animar** — pelo suelto, identidad fiel, sin carteles. **Auditada 2026-09-03, ver abajo** |
| `E2-B-rooftop.png` | Misma rooftop — **toma B, la referencia de LUZ de la receta (§12)** | `378291da-bfc4-4795-963c-101206116865` | ✅ **la mejor rooftop** — pelo suelto, pecas marcadas, rim dorado, cara fiel al ancla, sin pantallas ni texto. **Animada 2026-09-03 → `E7-rooftop-seedance.mp4`** |
| `E2-C-rooftop.png` | Misma rooftop — toma C | `af2771c7-e66b-4592-86e8-0fe59b02128a` | ⚠️ **pelo recogido** (falla §6) pero la piel y la acción (dos manos al vaso) son las mejores de las tres. Feed sí, base de video sólo si se quiere ese gesto. **Auditada 2026-09-03, ver abajo** |
| `E3-cafe.png` | Café de especialidad, luz cálida de ventana, ladrillo, plantas colgando, **las dos manos en la taza** (acción a medias) | `c31c1333-dbd6-4be7-890f-07dcbb1cfc59` | ✅ **la prueba 9/9 de la receta** — es la que se animó (→ E4/E6) |
| `E3-coworking.png` | Coworking de diseño, sol de ventana con flare, plantas, laptop con UI | `bc39fa80-5144-4230-8171-c56bfc77aee5` | ⚠️ fancy y fiel, pero **pelo recogido** y **laptop con UI** en cuadro (de canto y suave, no legible de frente). Sin animar — **auditada 2026-09-02, ver abajo** |
| `E3-hotel.png` | Hall de hotel con boiserie de madera, lámparas cálidas, ventanal al jardín | `43bb8397-45ed-4307-b4f8-ba592ff2bdaa` | ✅ **la más limpia** — pelo suelto, sin pantallas ni texto, cara muy fiel al ancla. **Animada 2026-09-03 → `E5-hotel-seedance.mp4`** |

**Las tres tomas E2 salen del mismo base prompt** — está en `_E2-BASE-prompt.txt`. A y C son
tomas alternas de la misma escena; **B es la que la receta canonizó** como palanca de luz fancy
(`warm golden hour backlight, soft falloff, shallow depth of field`), la que NO cuesta la casilla
de identidad.

## Videos (E4/E6 animan `E3-cafe.png`; E5 anima `E3-hotel.png`; E7 anima `E2-B-rooftop.png`)

Formatos verificados con `ffprobe` (detalle y creativos en [`CREATIVO.md`](CREATIVO.md)):

| Archivo | Formato | Dur. | Modelo | Costo | Estado |
|---|---|---|---|---|---|
| `E4-cafe-seedance1_5.mp4` 🎯 | 720×1280 = 9:16 exacto · aac | 4,0 s | `seedance1_5` | 4,8 cr | ✅ **el default publicable** — cierra sobre su cara (casilla 9) |
| `E6-cafe-seedance-8s.mp4` | 720×1280 = 9:16 exacto · aac | 8,0 s | `seedance1_5` | 9,6 cr | ✅ b-roll largo/relajado; el medio es el sorbo (§16) |
| `E4-cafe-kling3_0.mp4` ⛔ | 716×1284 (necesita recorte) · aac | 5,0 s | `kling3_0` | 8,75 cr | ⚠️ **NO se publica** — termina cabizbaja, cara tapada (§15). Se guarda como contraejemplo |
| `E5-hotel-seedance.mp4` 🎯 | 720×1280 = 9:16 exacto · aac | 4,0 s | `seedance1_5` | 4,8 cr | ✅ **publicable** — anima `E3-hotel.png`: se acomoda un mechón (acción a medias real), parpadeo suave, cierra sobre la cara (casilla 9). Cara fiel al ancla en los 6 frames. Asset id del MP4: `0a7c63e4-5075-4c92-ab6e-7ce9d2ecae40` (rescatado del nombre de descarga — este SÍ quedó guardado). **Creativo escrito 2026-09-03 → [`CREATIVO.md`](CREATIVO.md) §hotel** |
| `E7-rooftop-seedance.mp4` 🎯 | 720×1280 = 9:16 exacto · aac | 4,0 s | `seedance1_5` | 4,8 cr | ✅ **publicable** — anima `E2-B-rooftop.png`: **levanta el vaso para llevar, da un sorbo y lo baja** (acción a medias que SÍ se resuelve, mejor que hotel/coworking que son retratos), parpadeo suave, cierra sobre la cara plenamente visible (casilla 9). Identidad intacta en los 6 frames (`_E7-rooftop-frames.jpg`): cejas gruesas, pecas marcadas, aro de oro, pelo suelto, golden hour. Sin pantallas ni texto. Job id del MP4: `5a80fdb2-1a0d-46ba-a1c3-87fdd7572802` (del nombre de descarga; seed 28172). **Creativo escrito 2026-09-03 → [`CREATIVO.md`](CREATIVO.md) §rooftop** |

🔴 **Los `job_id` de estos tres videos NO quedaron guardados.** La `CREATIVO.md` decía que estaban
en los `_E*.log`, pero esos logs son **sólo de imágenes** (contienen la URL del PNG, no la del
MP4). Verificado esta vuelta: no hay `job_id` de video en ningún `.log` ni `.txt` de la carpeta.
No bloquea re-animar: `--start-image` acepta la **ruta local del PNG** y la sube sola (hallazgo de
V09), así que para re-generar cualquiera de estos videos se pasa el path de `E3-cafe.png`, no el
`job_id` viejo. Lo que se pierde es sólo recuperar *ese* render exacto.

## 🔍 Auditoría de `E3-coworking.png` contra el brief (2026-09-02, mirada)

Vuelta con **generación bloqueada** (`grace_daily_limit_reached` cubre imagen Y video, no sólo
video — confirmado esta vuelta con un intento de imagen nueva a 0 cr). Sin poder generar, se hace
trabajo de cero créditos: auditar una pieza vieja contra su brief. Se auditó `E3-coworking.jpg` a
resolución completa **mirándola** contra el brief §6 del loop y las casillas de la rúbrica.

| Eje del brief | Resultado |
|---|---|
| Cara fiel al ancla | ✅ es Lucía: cejas gruesas, ojos marrones, pecas marcadas en nariz/pómulos, aro de oro + cadenita fina. Identidad intacta |
| Piel real (poros/pecas/asimetría) | ✅ de lo mejor del banco — pecas y textura muy marcadas, cero alisado |
| Luz real / fancy | ✅ flare dorado de ventana detrás, look influencer fuerte |
| **Pelo suelto** | ❌ **recogido** (tirante hacia atrás). El brief pide suelto |
| **Acción a medias** | ❌ es un **retrato** — mira sobre el hombro, cabeza apoyada, sin las dos manos sobre un objeto. Es el motivo por el que se queda en CASI (§14) |
| **Sin pantallas legibles** | ⚠️ laptop a la derecha **en 3/4, UI blanda pero presente** (app de diseño, un bloque verde). No es frontal ni nítida, pero está en cuadro: riesgo vivo de casilla 3 si se anima y la pantalla se mueve |

**Veredicto:** deprioridad. Cuando vuelva el cupo, **hotel va primero** (pelo suelto, sin pantalla,
más limpia). El coworking sólo se anima si se quiere expresamente una escena "trabajando", y con un
prompt que **fije la laptop quieta y fuera de foco** (nada de paneo hacia la pantalla) para no
despertar la casilla 3. Como imagen fija sirve para feed; como base de video es la más riesgosa de
las tres E3.

## ✅ Resuelto 2026-09-03: `E3-hotel.png` animada → `E5-hotel-seedance.mp4`

El límite diario del 02-sep (`grace_daily_limit_reached`) **se reseteó al cambiar de día**: el
03-sep la generación de video volvió a funcionar sin tocar nada. Se lanzó el comando de abajo tal
cual (4,8 cr medidos y confirmados antes de generar), salió a la primera y se miró frame por frame
(`_E5-hotel-frames.jpg`): identidad intacta, pelo suelto, acomoda un mechón, cierra sobre la cara.
Publicable. **Lección:** un `grace_daily_limit_reached` NO es un bloqueo permanente — es la cuota
del día; la próxima vuelta en fecha distinta se reintenta, no se re-mide dentro del mismo día.

Comando que se usó (queda como receta para re-animar el hotel):

```bash
IMG="hermes-content/references/modelos/lucia/generadas-20260902/E3-hotel.png"
PROMPT="She gently tucks a loose strand of hair behind her ear, blinks once softly, and shifts her weight slightly while keeping her gaze toward the lens. Warm afternoon light glows on her hair and the wood-paneled hotel lounge behind her. The camera barely moves, like a casual clip filmed while standing. Natural true-to-life colors. Nobody else looks at the camera."
higgsfield generate cost   seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16   # 4,8 cr (medido)
higgsfield generate create seedance1_5 --start-image "$IMG" --prompt "$PROMPT" --aspect-ratio 9:16 --json
```

⚠️ **Ojo con la casilla 9 en el hotel/coworking:** a diferencia del café, estas dos escenas NO
tienen la acción a medias con las dos manos sobre un objeto — son retratos. Animan a b-roll sutil
(parpadeo, mechón, cambio de peso) manteniendo la cara en cuadro, no una acción que se resuelve.
`E3-coworking` además arrastra el pelo recogido y la laptop; si sólo hay cupo para un video, va
**hotel**.

## 🔍 Auditoría de las variantes rooftop `E2-A` y `E2-C` contra el brief (2026-09-03, mirada)

Vuelta con **generación bloqueada por auth** (`hf auth login` da *Session expired* y el balance por
MCP pide un permiso que esta sesión no interactiva no puede conceder — bloqueo duro, distinto del
`grace_daily_limit` que resetea por día). Sin poder generar, trabajo de cero créditos: auditar las
dos tomas rooftop que el LEEME sólo etiquetaba «variante», mirándolas a resolución completa (los
`.jpg`) contra el brief §6 y con `E2-B` (la canonizada) como ancla de identidad.

| Eje del brief | `E2-A` | `E2-C` |
|---|---|---|
| Cara fiel al ancla | ✅ cejas gruesas, ojos marrones, pecas en nariz/pómulos, aro de oro + cadenita | ✅ ídem, + pulsera de oro en la muñeca. Identidad intacta |
| Piel real (poros/pecas/asimetría) | ✅ pecas marcadas, textura, cero alisado | ✅ **de las mejores del banco** — pecas muy marcadas |
| Luz real / fancy | ✅ golden hour con pérgola metálica arriba; algo **más frontal/plana** que B (menos rim dorado) | ✅ golden hour fuerte, rim cálido en la cara — la más «influencer» de las tres |
| **Pelo suelto** | ✅ **suelto**, ondas sobre el hombro | ❌ **recogido** (tirante). Falla §6, misma marca que coworking |
| **Acción a medias** | ⚠️ una mano al vaso, el otro brazo en la baranda — semi-acción, animable a un sorbo (como se resolvió B en E7) | ✅ **las dos manos envuelven el vaso** — la acción-a-medias más limpia de las tres |
| **Sin carteles legibles** | ✅ skyline de fondo, ningún cartel/pantalla | ✅ ídem |

**Veredicto:**
- **`E2-A` es la próxima rooftop a animar** cuando vuelva el cupo: pelo suelto, identidad fiel, sin
  riesgo de cartel, y da un **segundo ángulo de la misma escena** para A/B-testear contra `E7` sin
  cambiar de set. Mismo comando que hotel/E7 con `--start-image E2-A-rooftop.png`. Único reparo: la
  luz es más plana que B, así que el prompt debe pedir el rim dorado (`warm golden hour backlight`).
- **`E2-C` es excelente como imagen fija de feed** (piel y luz top), pero **como base de video
  arrastra el pelo recogido** — igual que coworking, se queda en CASI del §14. Se anima sólo si se
  quiere expresamente el gesto de las dos manos al vaso, asumiendo el recogido.

Orden de animación rooftop pendiente cuando haya cupo: **`E2-A` primero** (suelto), luego `E2-C`
sólo si se busca el gesto de dos manos.
