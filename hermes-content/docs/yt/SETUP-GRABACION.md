# Setup de grabación — canal de YouTube

Fuente de verdad del setup técnico del carril K (yt-canal). Sin fecha en el nombre: si
cambia, se **edita este archivo**.

Máquina medida el 2026-09-06: laptop i5-11400H · 24 GB RAM · **RTX 3050 Laptop** (NVENC
disponible) · 2 monitores (1920×1080 primario + 1536×864) · OBS **32.0.4** · ffmpeg en
`C:\Users\PC\tools\ffmpeg\bin` · E:\ con 83 GB libres.

---

## 1. La decisión de cámara: el iPhone NO se conecta a la laptop

Es contraintuitivo, así que va primero, con el porqué.

**Todas las apps de iPhone-como-webcam limitan el plan gratuito a 640×480 con marca de
agua** (verificado 2026-09-06): [Iriun](https://iriun.com/), [Camo](https://camo.com/pricing)
(gratis = 720p + marca de agua), [DroidCam](https://apps.apple.com/us/app/-/id1510258102).
Ninguna sirve para YouTube sin pagar.

Y aun pagando, hay un problema peor: **el iPhone convertido en webcam comprime la imagen
para pasarla por USB/WiFi**. Sale peor que el mismo iPhone grabando en su propia memoria.

### El método que se usa: grabación doble

| Qué graba | Con qué | Qué produce |
|---|---|---|
| Pantalla | OBS (perfil `ONIA YouTube`) | `E:\ONIA-YouTube\grabaciones\ONIA-YT-*.mp4` |
| Cara **y voz** | iPhone, app Cámara normal, 1080p 30 fps | el archivo del carrete |

Se sincronizan en la edición con **una palmada** delante del iPhone al empezar.

**El audio que va al video final es el del iPhone.** Esto es lo que más sube la calidad
del canal y es gratis: el único micrófono de esta laptop es el array interno
(`Intel Smart Sound`), que graba el ventilador. El mic del iPhone le pasa por encima.

Ventaja adicional: 0 latencia, 0 marca de agua, 0 drivers, y el iPhone puede grabar en
4K si algún día se quiere reencuadrar.

Contra: no ves tu encuadre en vivo. Se resuelve encuadrando con la cámara frontal antes
de arrancar.

### Alternativas, y por qué no son la primera opción

- **Logitech StreamCam** — aparece configurada en el perfil viejo `ONIA_Reuniones`, así
  que existió en esta máquina. Hoy **no está conectada** (Windows solo ve la webcam
  interna `HP Wide Vision HD`). Si aparece: 1080p60 por USB, encuadre en vivo, cero
  fricción. Pero su micrófono es mediocre — el audio seguiría viniendo del iPhone.
- **Camo Pro** (~USD 40/año) — si algún día molesta no ver el encuadre en vivo.
- **Capturadora HDMI** (~USD 25) + adaptador — máxima calidad en vivo, más cables.

---

## 2. OBS — ya está configurado

Perfil **`ONIA YouTube`** y colección de escenas **`ONIA YouTube`**, dejados como activos.
El perfil viejo `ONIA_Reuniones` (640×360 @ 10 fps) quedó intacto.

Backup previo en `%APPDATA%\obs-studio\onia-backups\obs-config-20260906-175641\`.

### Perfil

| Ajuste | Valor | Por qué |
|---|---|---|
| Base y salida | 1920×1080 | 1:1 con el monitor primario. **Grabá en ese monitor**, no en el de 1536×864 — ese escalaría y se vería borroso. |
| FPS | 30 | Un screencast de terminal no gana nada con 60 y pesa el doble. |
| Encoder | NVENC (RTX 3050), preset p5 | La GPU codifica; la CPU queda libre para el trabajo que estás mostrando. |
| Calidad | HQ, `hybrid_mp4` | MP4 que sobrevive a un cierre inesperado de OBS. |
| Pistas de audio | 1 y 2 | Pista 1 mezclada, pista 2 solo el mic → se puede arreglar el audio en edición. |
| Carpeta | `E:\ONIA-YouTube\grabaciones` | C:\ tiene 46 GB; E:\ tiene 83 GB. |

### Escenas y atajos

| Escena | Atajo | Cuándo |
|---|---|---|
| `1 · Pantalla` | `Ctrl+1` | El 80% del video |
| `2 · Pantalla + cara` | `Ctrl+2` | Cámara en círculo abajo a la derecha |
| `3 · Cara` | `Ctrl+3` | Intro y cierre |
| `4 · Pausa` | `Ctrl+4` | Cortina mientras pensás |
| `_cam · circulo` | — | Auxiliar. **No la toques**: es la que recorta la cámara a círculo. |

`F9` = grabar / parar · `F10` = pausar / reanudar.

El círculo se hace con `E:\ONIA-YouTube\assets\mask-circulo.png` (generado con ffmpeg) y
un filtro *Image Mask/Blend* sobre la escena anidada — OBS no admite filtros por
scene-item, por eso la escena auxiliar.

### Los 2 clics que faltan (OBS no los puede adivinar)

1. **Fuente `Pantalla`** → doble clic → elegir el monitor de **1920×1080**.
2. **Fuente `Camara`** → doble clic → elegir el dispositivo. Solo hace falta si algún día
   conectás la StreamCam; con el método de grabación doble esta fuente queda sin usar.

Si la cámara que elegís entrega **1280×720** en vez de 1920×1080, abrí `_cam · circulo`,
seleccioná `Camara` y cambiá el tamaño del *bounding box* de 1080×1080 a 720×720. Si no,
el círculo recorta de más.

---

## 3. Antes de cada grabación

- [ ] Monitor de 1920×1080 como pantalla de trabajo
- [ ] Terminal con fuente grande (a 1080p, menos de 16 pt no se lee en celular)
- [ ] Notificaciones en silencio (`Win+N` → Asistente de concentración)
- [ ] iPhone en horizontal, apoyado, **modo avión**
- [ ] Grabar en el iPhone → **palmada** → recién ahí `F9` en OBS
- [ ] Al terminar: parar los dos, y pasar el archivo del iPhone a `E:\ONIA-YouTube\`

---

## 4. Pendientes anotados (no se hacen hasta que haga falta)

- Script de sincronización automática iPhone↔OBS por la palmada (ffmpeg detecta el pico).
  No se escribe hasta tener el primer par de archivos reales que probarlo.
- Lower-thirds e intro animada con **HyperFrames** (ya está en el repo, no instalar nada).
- Micrófono lavalier de 3,5 mm (~Bs 150) — solo si el método de grabación doble molesta.
