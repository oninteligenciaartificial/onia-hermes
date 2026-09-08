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
sobra resolución. Solo en `3 · Cara` (pantalla completa) se nota un poco de blandura —
mitigado con escalado `lanczos` — y es aceptable.

**Subir de 720p cuesta USD 49,99/año** (Camo Pro; también USD 9,99/mes o 99,99 de por vida).
Decidido el 2026-09-06: **no se paga.** El material principal es la pantalla, que ya es
1080p nativo; la cámara va en un círculo. Pagar sube la resolución de lo que menos pesa.

### ⚠️ Camo se desconecta cada 3-4 minutos

Medido en su propio log el 2026-09-06:

```
20:17:55  ProcessHello                     ← conecta
20:21:30  Disconnected, app closed         ← se cae a los 3,5 min
20:28:06  get_device_list returned 1       ← vuelve solo
```

El iPhone **nunca** desapareció del USB durante esos cortes, así que no es el cable ni el
driver: es la app del iPhone que se suspende. Se probó apagar `PowerEfficiencyMode` y
`highQualitySegmentation`, y poner el bloqueo automático en Nunca.

**Consecuencia operativa, no cosmética:** cuando Camo se cae, OBS pierde la fuente y **no
la recupera solo** — queda negra hasta que se reinicia la fuente (doble clic en `Camara` →
Aceptar).

**Por eso se graba en tomas de 2-3 minutos, nunca 10 seguidos.** Una desconexión cuesta una
toma, no el video entero. El guion ya está en bloques, así que esto no agrega trabajo.

Si algún día molesta demasiado: el plan B es el iPhone grabando aparte con su app Cámara
(4K real, cero cortes) y juntar en la edición.

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

### ⚠️ Una escena anidada mide el CANVAS ENTERO salvo que se le diga otra cosa

El círculo de la cámara se hace con una escena anidada (`_cam · circulo`) porque OBS no
admite filtros por scene-item. Pero una escena, usada como fuente, **mide 1920×1080 aunque
su contenido ocupe una esquina**. Metida en un recuadro de 480×480 con "escalar hasta
límites externos", OBS escala el canvas completo y muestra su centro — que está vacío.

Se ve como un cuadro delimitador imposible (apareció `666×416`) y un círculo deformado.

**El arreglo es darle tamaño propio a la escena anidada:**

```json
"settings": { "custom_size": true, "cx": 720, "cy": 720, "items": [ ... ] }
```

Con la escena midiendo 720×720 y el recuadro en 480×480, las proporciones coinciden y el
círculo sale redondo. Ojo: dentro de una escena con tamaño propio, lo relativo se mide
contra **su** mitad de altura (360), no contra 540.

### ⚠️ Las coordenadas de OBS son relativas a la MITAD DE LA ALTURA

Costó una tarde. Al generar el `.json` de escenas a mano, `pos_rel` y `bounds_rel` **no**
son fracciones del ancho: OBS los mide contra **la mitad de la altura del canvas**, con el
origen en el centro. Para 1920×1080 la unidad es **540**:

```
bounds_rel = ancho / 540 , alto / 540
pos_rel    = (x - 960) / 540 , (y - 540) / 540
```

Calculado como `x/960` (que es lo intuitivo), OBS reinterpreta todo al cargar: la captura
de pantalla de 1920×1080 quedó en un recuadro de **540×540** y el círculo de la cámara en
**95×170**. No da error — carga mal y ya.

### Los clics que faltan (OBS no los puede adivinar)

Ya hechos el 2026-09-06 y verificados en el `.json`: monitor de 1920×1080, cámara `Camo`,
micrófono `DJI MIC MINI`, recorte del círculo a 720×720.

Si la cámara queda negra tras una desconexión de Camo: **doble clic en `Camara` → Aceptar**.
Eso la reinicia.

---

## 3. Instalar Camo (una sola vez)

1. En el iPhone: **Camo Camera** desde la App Store.
2. En Windows: **Camo Studio** desde [camo.com/downloads](https://camo.com/downloads).
   El `.msi` pesa **475 MB** — dejarlo terminar. Abrirlo a medio bajar da el error
   *"no es un paquete de Windows Installer válido"*, que parece corrupción y es solo
   descarga incompleta.
3. **Apple Devices** desde la Microsoft Store — `winget install --id 9NP83LWLPZ9K --source msstore`.
   Sin esto Windows no monta el iPhone por USB y **Camo cae a WiFi**, que es mucho más
   lento. No alcanza con instalarla: hay que **abrirla una vez con el iPhone conectado**
   para que registre el driver.
4. Conectar el iPhone por cable. En el iPhone: *Confiar en esta computadora* → sí.
5. En Camo Studio, panel derecho: elegir la escena **`Blank`** (`Ctrl+3`), no `Watermark`.
   Ahí se va la marca de agua **sin pagar**.
6. `Lens` elige la cámara física del iPhone (zoom óptico, sin pérdida). `Framing` es zoom
   digital — dejarlo en 100 %.

> Si el iPhone no aparece: probá **otro cable**. Muchos son solo de carga y no llevan datos.

**El audio NO sale del iPhone: sale del DJI MIC MINI** por USB, como fuente aparte en OBS.
Camo aporta solamente la imagen.

---

## 3.b El audio entra bajo — medido, no supuesto

Primera grabación de prueba (2026-09-06, `ONIA-YT-2026-09-06-20-47-32.mp4`):

```
video: 1920x1080 · 30 fps · h264 · 5,1 Mbps   ✅
audio: mean -42,6 dB · max -21,4 dB           ❌ unos 20 dB por debajo
```

Para voz hablada lo sano es **mean −18 a −24 dB** y **max −6 a −9 dB**.

Y había una trampa peor: la compuerta original abría a **−35 dB**. Con una voz que
promedia −42, la compuerta **cortaba las palabras** y dejaba pasar solo los picos. Un
filtro puesto para limpiar ruido se estaba comiendo el contenido.

**Cadena corregida** (la compuerta se eliminó; RNNoise ya limpia el fondo y una segunda
pieza que puede tragarse sílabas no vale el riesgo):

```
1 Ganancia +12 dB  >  2 Ruido (RNNoise)  >  3 Compresor (thr -24, salida +4)  >  4 Limitador (-2)
```

⚠️ **Esto es un parche, no el arreglo de raíz.** Amplificar en OBS sube también el ruido de
fondo. Lo correcto es **subir la ganancia en el DJI** (receptor o app DJI Mimo) y después
bajar la ganancia de OBS en la misma proporción. Medir de nuevo con:

```bash
ffmpeg -hide_banner -nostats -i ARCHIVO.mp4 -map 0:a:0 -af volumedetect -f null - 2>&1 | grep volume
```

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
