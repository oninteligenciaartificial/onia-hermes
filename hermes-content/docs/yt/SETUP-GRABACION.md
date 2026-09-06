# Setup de grabación — canal de YouTube

Fuente de verdad del setup técnico del carril K (yt-canal). Sin fecha en el nombre: si
cambia, se **edita este archivo**.

Máquina medida el 2026-09-06: laptop i5-11400H · 24 GB RAM · **RTX 3050 Laptop** (NVENC
disponible) · 2 monitores (1920×1080 primario + 1536×864) · OBS **32.0.4** · ffmpeg en
`C:\Users\PC\tools\ffmpeg\bin` · E:\ con 83 GB libres.

---

## 1. La cámara: iPhone por cable, con Camo gratis

**El iPhone se conecta por cable USB y aparece en OBS como una cámara más.** La app es
[Camo](https://camo.com/pricing), de Reincubate.

Lo que entra en el plan **gratuito** (verificado en la fuente oficial el 2026-09-06):

- **720p**, uso ilimitado, sin límite de tiempo
- **Sin marca de agua.** La marca que aparece al abrir es una *capa de escena de demo*:
  se borra desde el editor de escenas de Camo sin pagar nada
  ([Reincubate lo confirma](https://x.com/reincubate/status/1983561587400081415))
- **El micrófono del iPhone, gratis.** Desde [Camo 1.2](https://camo.com/blog/camo-audio-support-release)
  el mezclador de audio multi-fuente está disponible para todos, con cancelación de ruido

Esto último es lo que decide: el único micrófono de esta laptop es el array interno
(`Intel Smart Sound`), que graba el ventilador. **El mic del iPhone le pasa por encima**, y
entra por el mismo cable que el video.

> ⚠️ **Corregido el 2026-09-06.** Acá decía que el iPhone NO se conectara, porque "todas
> las apps limitan el plan gratis a 640×480 con marca de agua". Eso era un resumen de
> buscador, no la fuente. La página oficial de Camo dice *"no watermark, no ads, no spam"*
> en el plan gratis. La regla vieja mandaba al método más complicado por no leer la fuente
> primaria: 720p sin marca de agua y con audio alcanza de sobra, sobre todo para una cámara
> que va en un círculo de 340 px.

### 720p alcanza — y por qué

La cámara va en un círculo de 340 px en la esquina (escena `2 · Pantalla + cara`). De un
frame de 1280×720 se recorta el cuadrado central de 720×720 y después se muestra a 340 px:
sobra resolución. Solo en `3 · Cara` (pantalla completa) se nota un poco de blandura, y es
aceptable.

### Alternativas, si algún día molesta

- **Logitech StreamCam** — aparece configurada en el perfil viejo `ONIA_Reuniones`, así
  que existió en esta máquina. Hoy **no está conectada** (Windows solo ve la webcam
  interna `HP Wide Vision HD`). Si aparece: 1080p60 por USB. Pero su micrófono es peor que
  el del iPhone.
- **Camo Pro** — solo para pasar de 720p a 1080p/4K.
- **Grabación doble** (OBS la pantalla, iPhone grabando aparte con su app Cámara,
  sincronizados con una palmada al empezar). Es el plan B si Camo falla: da la mejor imagen
  posible, pero no ves tu encuadre en vivo y hay que sincronizar dos archivos.
- **Capturadora HDMI** (~USD 25) + adaptador — máxima calidad, más cables.

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

### Los clics que faltan (OBS no los puede adivinar)

1. **Fuente `Pantalla`** → doble clic → elegir el monitor de **1920×1080**.
2. **Fuente `Camara`** → doble clic → elegir **`Reincubate Camo`** (aparece recién después
   de instalar Camo y conectar el iPhone).
3. En `_cam · circulo`, seleccionar `Camara` → `Ctrl+E` → cambiar el *bounding box* de
   **1080×1080 a 720×720**, porque Camo gratis entrega 1280×720. Si no, el círculo recorta
   de más.

---

## 3. Instalar Camo (una sola vez)

1. En el iPhone: **Camo Camera** desde la App Store.
2. En Windows: **Camo Studio** desde [camo.com/downloads](https://camo.com/downloads).
3. Conectar el iPhone **por cable USB**. En el iPhone: *Confiar en esta computadora* → sí.
4. Abrir Camo Studio. Debería mostrar la imagen del iPhone.
5. **Borrar la capa de marca de agua** en el editor de escenas de Camo. Es una capa demo,
   no hace falta pagar.
6. En Camo Studio → audio → elegir el **micrófono del iPhone** y activar la cancelación de
   ruido.

> Si Windows no detecta el iPhone: probá **otro cable**. Muchos cables son solo de carga y
> no llevan datos. Si sigue sin aparecer, instalá **Apple Devices** desde la Microsoft
> Store (en esta máquina no hay nada de Apple instalado).

Con Camo el audio y el video llegan por el mismo cable y quedan en **un solo archivo**: no
hay que sincronizar nada.

---

## 4. Antes de cada grabación

- [ ] Monitor de 1920×1080 como pantalla de trabajo
- [ ] Terminal con fuente grande (a 1080p, menos de 16 pt no se lee en celular)
- [ ] Notificaciones en silencio (`Win+N` → Asistente de concentración)
- [ ] iPhone conectado por cable, apoyado a la altura de los ojos, **modo avión** (el modo
      avión no corta el USB, pero sí las llamadas que interrumpen la grabación)
- [ ] Camo Studio abierto **antes** que OBS
- [ ] Hablar 10 segundos y mirar el medidor de `Mic Sergio` en OBS: tiene que moverse en el
      **verde**, tocando amarillo en los picos. Si toca rojo, bajar el volumen de la fuente
- [ ] `F9` para grabar

---

## 5. Pendientes anotados (no se hacen hasta que haga falta)

- Lower-thirds e intro animada con **HyperFrames** (ya está en el repo, no instalar nada).
- Script de sincronización por palmada — **solo si algún día se usa grabación doble**. Con
  Camo no hace falta.
