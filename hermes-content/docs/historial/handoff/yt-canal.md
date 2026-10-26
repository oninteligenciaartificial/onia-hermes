# Handoff — carril yt-canal

Última actualización: **2026-09-06**, cierre de la sesión de setup.
Rama: `claude/youtube-video-setup-d1c520`.

---

## 1. Objetivo de la sesión

Dejar a Sergio Urcullo en condiciones de grabar el primer video del canal de YouTube:
cámara del iPhone entrando a OBS, audio decente, OBS configurado, y el guion del video 1
escrito.

**Definición de "hecho":** OBS abre con el perfil correcto, la cámara y el micrófono
entran, una grabación de prueba sale con la resolución y el nivel de audio correctos, y
existe el guion.

**Estado: cumplido salvo la verificación final del audio corregido** (ver §3).

---

## 2. Qué quedó funcionando

Todo esto está **verificado midiendo**, no de vista.

### Cadena de captura

```
iPhone (app Camo Camera)
   ↓ USB
Camo Studio  →  crea una cámara virtual "Camo" que Windows ve como webcam
   ↓
OBS  ←  DJI MIC MINI por USB (fuente de audio aparte)
   ↓
E:\ONIA-YouTube\grabaciones\ONIA-YT-*.mp4
```

### OBS (fuera del repo, en `%APPDATA%\obs-studio`)

Perfil **`ONIA YouTube`** y colección **`ONIA YouTube`**, ambos activos.

| | |
|---|---|
| Grabación | 1920×1080 · 30 fps · NVENC (RTX 3050) · calidad Indistinguible · 2 pistas de audio |
| Cámara | `Camo`, 1280×720 @30, sin buffer |
| Micrófono | `DJI MIC MINI` |
| Monitor | el de 1920×1080 (el otro es 1536×864 y saldría borroso) |
| Escenas | `Ctrl+1` Pantalla · `Ctrl+2` Pantalla + círculo 480px · `Ctrl+3` Cara · `Ctrl+4` Pausa |
| Grabar | `F9` · pausar `F10` |

Backups en `%APPDATA%\obs-studio\onia-backups\` y `.bak-*` junto al JSON de escenas.

### Prueba real (`ONIA-YT-2026-09-06-20-47-32.mp4`)

```
video: 1920x1080 · 30 fps · h264 · 5,1 Mbps      ✅
audio: 2 pistas, 48 kHz                          ✅
nivel: mean -42,6 dB · max -21,4 dB              ❌ 20 dB bajo -> corregido, SIN reprobar
```

---

## 3. Qué quedó a medias

**La corrección de audio no está probada.** Se cambió la cadena de filtros a
`Ganancia +12 > RNNoise > Compresor > Limitador` (se eliminó la compuerta, que abría a
−35 dB y cortaba una voz que promedia −42). La proyección da mean ~−26,6 y max ~−5,4, pero
**nadie grabó todavía con esa cadena**.

👉 **Primera acción de mañana:** grabar 30 segundos y medir:

```bash
ffmpeg -hide_banner -nostats -i ARCHIVO.mp4 -map 0:a:0 -af volumedetect -f null - 2>&1 | grep volume
```

Objetivo: **mean −18 a −24 dB, max −6 a −9 dB**. Si queda alto, bajar la ganancia; si sigue
bajo, subirla.

**El video 1 no está grabado.** El guion está escrito y aprobado por nadie todavía — Sergio
Urcullo lo lee mañana antes de grabar.

---

## 4. Archivos

| Qué | Dónde |
|---|---|
| Setup técnico (fuente de verdad) | `hermes-content/docs/yt/SETUP-GRABACION.md` |
| Guion del video 1 | `hermes-content/docs/yt/VIDEO-01-QUE-ES-CLAUDE.md` |
| Este handoff | `hermes-content/docs/handoff/yt-canal.md` |
| Config de OBS | `%APPDATA%\obs-studio\basic\{profiles,scenes}\ONIA_YouTube*` |
| Config de Camo | `%APPDATA%\Reincubate\Camo\camo.config` (backup `.onia-bak`) |
| Máscara del círculo | `E:\ONIA-YouTube\assets\mask-circulo.png` |
| Grabaciones | `E:\ONIA-YouTube\grabaciones\` |

---

## 5. Intentos fallidos y errores propios

Lo que costó la tarde. **Esto es lo que no hay que repetir.**

1. **Dije que el iPhone no podía conectarse por cable.** Escribí una regla entera sobre
   grabación doble basándome en un **resumen de buscador** que decía que todas las apps
   limitan el plan gratis a 640×480 con marca de agua. La página oficial de Camo dice
   *"no watermark, no ads"*. Leer la fuente primaria habría ahorrado dos vueltas.

2. **La geometría de OBS: calculé lo relativo contra el ancho.** `pos_rel` y `bounds_rel`
   se miden contra **la mitad de la ALTURA** (540 en 1080p), con origen en el centro. Con
   `x/960` el archivo carga **sin error** pero con todo deformado: la captura de pantalla
   quedó en 540×540 y el círculo en 95×170.

3. **La escena anidada medía el canvas entero.** Una escena usada como fuente mide
   1920×1080 aunque su contenido ocupe una esquina. Hay que darle `custom_size` (720×720).
   Sin eso el cuadro delimitador daba `666×416` y el círculo salía deformado.

4. **Puse una compuerta de ruido sin conocer el nivel real de la señal.** Abría a −35 dB
   sobre una voz de −42: cortaba palabras. **Un filtro no se configura con valores de
   manual, se configura después de medir la fuente.**

5. **Diagnostiqué "Camo va lento" sin mirar.** La causa era que iba por WiFi porque faltaba
   el driver de Apple. Y después: instalar *Apple Devices* **no alcanza** — hay que abrirla
   una vez con el iPhone conectado para que registre el driver USB.

6. **Le dije que subiera la calidad de grabación** cuando `RecQuality=HQ` **ya es**
   "Indistinguible" en OBS. Afirmé sin verificar el mapeo de los valores.

---

## 6. Qué depende de Sergio Urcullo

- **Subir la ganancia en el DJI** (receptor o app DJI Mimo). La ganancia de OBS es un
  parche que también amplifica el ruido de fondo.
- **Decidir el tamaño final del círculo.** Quedó en 480 px (25% del ancho). Se cambia con
  `Ctrl+E` → *Tamaño de cuadro delimitador*, los dos números iguales.
- **Leer el guion** antes de grabar.
- **Decidir si el canal va a su nombre o de Onia.** No se decide en el video 1.
- **La luz.** Es lo que más va a mejorar la imagen y no depende de ninguna configuración:
  luz de frente, nunca a la espalda.

---

## 7. Próximos pasos

1. Grabar 30 s y **medir el audio** (§3). Sin eso no se graba el video entero.
2. Grabar el video 1 **en tomas de 2-3 minutos** — Camo se desconecta cada ~3,5 minutos y
   OBS no recupera la fuente solo (doble clic en `Camara` → Aceptar la reinicia).
3. Orden del guion: **las demos primero**, la cara al final.
4. Editar. Pendiente decidir con qué — está `editor-videos` en el repo.
5. Miniatura y título: candidatos en el guion.

### Anotado, fuera del alcance de esta sesión

- Intro animada y lower-thirds con **HyperFrames** (ya está en el repo, no instalar nada).
- Si Camo sigue molestando: plan B = iPhone grabando aparte con su app Cámara (4K real,
  cero cortes) y sincronizar en la edición.
- Camo Pro (USD 49,99/año) sube a 1080p/4K pero **no arregla las desconexiones**. Decidido
  el 2026-09-06: no se paga.
