# El marco HUD de cuatro esquinas y el cierre que invierte el wordmark

- **Fuente:** https://www.instagram.com/p/DaAjqtugWF_/ · @formd.designs
- **Tipo:** MIXTO — el CONTENIDO es MARKETING (un molde de guion BTS de 16 s), el MECANISMO portable es WEB/motion (un overlay HTML de 4 esquinas + un cierre por inversión de color)
- **Veredicto:** SIRVE YA
- **Cobertura:** 48 de 48 fotogramas (8 `base_*` + 40 `texto_*`) = 100%. Caption completo. Audio NO transcrito (Speaches falló en el lote) — el sujeto aparece hablando en cámara en varios planos y no se oyó nada. Ilegibles: texto del hoodie, pizarrones del menú, 3 filas de la lista de Spotify.

## Que muestra, textual

**Texto en pantalla (recuperado, literal):**

1. Placa de apertura, 0.00–1.43 s, blanca centrada a dos líneas sobre metraje a sangre completa:
   > Don't post your work,
   > post you working.

2. HUD fijo en las cuatro esquinas, presente desde el corte 1 (1.43 s) hasta el final:
   - arriba izquierda: `BRANDING`
   - arriba derecha: `FORMDSTUDIO`
   - abajo izquierda: `CAFE WORK`
   - abajo derecha: `2026©`

3. Placa de cierre, 15.15–16.739 s, dos líneas centradas:
   > FORMD
   > STUDIO

**Texto recuperado DE LAS PANTALLAS filmadas (está escrito, se transcribe):**

- Adobe Illustrator 2026 (barra de título legible). Lienzo con un layout de marca: **"Come Stay"** en blanco sobre una foto de café naranja/turquesa.
- Panel Carácter de ese mismo archivo — **la tipografía del trabajo del cliente está escrita en pantalla: `Creato Display` / `Bold` / `143.8 pt` / `116.16` / `-10`**. También `X: -4201.19  W: 382.2173`, `Y: -3872.98  H: 268.8922`, `Opacity 100%`, `Properties / Retype / Libraries`, `Turntable`.
- Lámina naranja de presentación (parcialmente encuadrada, el encabezado se corta terminando en `s:`):
  > 02 Brand Strategy
  > 03 Visual Identity
  > Applications
- Segundo documento de Illustrator, grilla editorial de moodboard: **`THE OPPORTUNITY`** + una línea cortada que empieza `CONNE…`
- Navegador con una grilla tipo masonry de fotografía de café y, en la columna derecha, sugerencias de tablero: `Coffee beans photography`, `Coffee marketing`, `Coffee grain`, `SATURDAY Coffee advertising` (legibilidad parcial, texto pequeño y desenfocado).
- Dock de macOS con íconos rotulados `Ps` y `Ai`.
- Sticker de laptop: `Give Your Laptop` (aparece en dos laptops distintas).
- Spotify en el teléfono, filas legibles: `KALYANI — ARJN, KDS, FIFTY4, and RONN`, `GALL — Video • Kunwarr`, `Humraah (From "Malang - Unleash The Madne…" — Sachet Tandon, Kunaal Vermaa, and The Fusion Pr…`, `Sprinter — Video • Dave, Central Cee`, `Raindance (feat. Tems) — Video • Dave, Tems`, `What You Saying — … Lil Uzi Vert`. La fila superior (`Dhurandhar The Revenge …`) está demasiado fantasmeada por el efecto de eco para transcribirla con confianza.
- Máquina de café: `LA MARZOCCO` (parcialmente legible, invertida por el reflejo).

**Caption, literal y completo:**

> OKAY.
>
> FORMD Studio™
>
> #formdstudio #formd #brandingstudio #designstudio #creativeagency #brandidentity #branddesign #visualidentity #graphicdesign #logodesign #identitydesign #visualcommunication #designprocess #creativeprocess #behindthescenes #designersofinstagram #designinspiration #creativebusiness #brandingagency #modernbranding #strategicdesign #creativeindustry #digitaldesign #motiondesign #motiongraphics #designcommunity #indiancreatives #indiandesigners #buildinpublic #creativework

Eso es todo el caption: **dos palabras y 30 hashtags. Ni CTA, ni oferta, ni link, ni pregunta.**

## Como esta hecho — la reconstruccion

### El molde de guion (MARKETING) — medido, no estimado

31 cortes en 16.739 s = **un corte cada 0.540 s de promedio**. Pero el promedio miente: la forma es una campana invertida.

| Tramo | Duración del plano | Qué pasa |
|---|---|---|
| 0.00 → 1.43 | **1.43 s** | La tesis sola. El plano más largo de todo el video después del cierre. |
| 1.43 → 2.84 | **1.41 s** | Segundo plano largo: un barrido con desenfoque real que atraviesa una pantalla filmada (bandas de escaneo visibles). Sirve de "puerta": es donde entra el HUD. |
| 2.84 → 4.27 | 0.50 / 0.16 / 0.30 / 0.47 | Aceleración. Entra el trabajo real (Illustrator, moodboard). |
| **4.27 → 4.57** | **0.10 / 0.10 / 0.10** | **Ráfaga: tres cortes de 3 fotogramas cada uno.** El pico de energía. |
| 4.57 → 14.18 | 0.17 a 0.97, media ≈ 0.47 | Pulso sostenido. Alterna pantalla / gente / POV / bebida. |
| 14.18 → 15.15 | 0.97 | Frenada: un plano casi al doble de largo justo antes del final. |
| **15.15 → 16.739** | **1.59 s** | Cierre. El plano más largo del video. El wordmark queda quieto. |

La estructura es: **enunciar → acelerar → estallar (3×0.10 s) → sostener → frenar → firmar.** No hay un solo dato, ni una cifra, ni un cliente nombrado. La única afirmación del video es la placa de apertura.

Los tres cortes de 0.10 s casi con seguridad caen sobre un patrón de tres golpes de la música — **no verificado, el audio no se transcribió.**

### El mecanismo del HUD (WEB/motion) — esto es lo que hay que robar

El HUD son cuatro rótulos en las esquinas, en mayúsculas, grotesca bold, tamaño chico, con un poco de tracking. Lo que lo hace bueno no es el diseño, es cómo maneja el fondo:

- **Sobre metraje oscuro se lee blanco.** Sobre la placa final blanca **se lee negro.** Sobre las zonas quemadas del metraje (la ventana, la pantalla naranja) **se apaga y casi desaparece** en vez de pelearse con la imagen.
- Eso es exactamente el comportamiento de `mix-blend-mode: difference` con el texto en blanco puro: sobre negro devuelve blanco, sobre blanco devuelve negro, sobre un naranja saturado devuelve su complemento apagado. **INFERIDO** — no está dicho en ningún lado. La alternativa es que sean dos versiones estáticas del HUD (una blanca y una negra) intercambiadas en el corte final, pero eso no explica el apagado gradual sobre las zonas claras del metraje, que sí se ve en `texto_003_05` y `texto_006_01`.
- El HUD **no aparece en el primer plano** (0.00–1.43 s). Entra recién en el corte 1. Es un gesto barato y efectivo: la tesis se dice a sangre completa, el "expediente" se abre después.

### El cierre por elemento portador

En `texto_008_01` a `_04` el wordmark FORMD STUDIO ya está en pantalla, blanco, **en la misma posición y el mismo tamaño que tendrá en la placa final**, mientras detrás siguen cambiando planos del café. En `_05` el fondo se blanquea y el wordmark se invierte a negro. En `_06`, `_07`, `_08` queda la placa limpia.

O sea: **el wordmark es el elemento que sobrevive al corte.** El metraje se va, el logo no se mueve un píxel. Es la regla del carrier de `motion-doctrine` aplicada sin adornos. Cuesta cero y resuelve el problema más caro del cierre de un reel (que el logo aparezca "pegado" al final).

### Lo demás del oficio

- **Cámara:** todo a mano, gran angular con barrilete visible (`texto_006_05..08`, `texto_003_03`). Hay POV de primera persona mirando los propios pies. Los barridos tienen **desenfoque de movimiento real**, no plugin: se ve en `base_002` y en la secuencia `texto_006_04..08`.
- **Efecto de eco en la pantalla del teléfono** (`texto_003_06`, `_07`): la lista de Spotify aparece duplicada y desplazada, con la posición vieja fantasmeada. Dos lecturas posibles: (a) un efecto de mezcla de fotogramas / echo aplicado en edición, (b) el obturador rodante capturando el scroll de la pantalla a un ángulo de obturador bajo. **Inferido, no verificado.** Fuera cual fuera, el resultado es un "glitch" que se ve caro y no costó nada.
- **Formato: el archivo mide 1276×718 — es HORIZONTAL, 16:9.** Es una decisión, no un accidente: refuerza el registro "cine". En el feed de Reels eso se ve como una franja chica con dos bandas negras enormes. Para nosotros es un error a no copiar (ver más abajo).
- **Nada de esto es IA.** Es metraje filmado en un café real, con dos personas reales, editado. No hay ningún generador involucrado y el post no dice lo contrario.

### El juicio por los dos ejes

- **Contenido: flojo.** Una sola frase, ninguna prueba, ningún caso, ningún dato, ningún cliente, ninguna oferta. El caption es "OKAY." + 30 hashtags. Cero mecánica de conversión: no hay comentario→DM, no hay link, no hay pregunta. Si el objetivo era conseguir un cliente, este post no tiene por dónde recibirlo.
- **Forma: excelente.** La estructura de ritmo, el HUD que se comporta con el fondo, y el cierre por elemento portador son tres piezas reutilizables y baratas. Es un post que enseña más por cómo está armado que por lo que dice.

## El estilo, como conocimiento portable

**Tipografía.** Dos registros:
1. *Titulares* (placa de apertura y wordmark de cierre): grotesca neo, muy pesada, tracking negativo notorio en el wordmark, 'R' de pata diagonal recta, 'S' de terminales horizontales, 'O' casi circular, 'g' de un piso. **La familia exacta no se dice en pantalla ni en el caption.** El esqueleto es compatible con una Helvetica Now Display / Neue Haas Grotesk Display en peso Bold–Black, pero eso es **reconstrucción, no lectura**.
2. *HUD*: la misma grotesca en peso bold, tamaño ~1.3% de la altura del cuadro, mayúsculas, tracking positivo leve (~0.05em, estimado).
3. **Dato recuperado, no inferido:** la tipografía del trabajo del CLIENTE que se ve en Illustrator es **`Creato Display Bold`**, escrita en el panel Carácter. Es de la familia de las grotescas geométricas — buena pista de a qué suena el gusto de este estudio.

**Paleta (hex APROXIMADO — leídos de una pantalla comprimida, no del archivo original):**

| Rol | Hex aprox. | Dónde |
|---|---|---|
| Turquesa de ambiente (dominante) | `#1E9C9E` – `#2AA7A0` | malla de obra, pared del café, sombras |
| Naranja ámbar (segundo dominante) | `#C46B2E` – `#E08A3C` | madera de las mesas, el café, la piel |
| Azul portón | `#1D6FA8` | reja del fondo |
| Verde neón (acento puntual) | `#5BE24A` | pantalla del barrido, texto del hoodie |
| Blanco de titular | `#FFFFFF` | placa de apertura, HUD sobre oscuro |
| Blanco roto de la placa final | `#F5F4F2` | fondo del cierre |
| Negro del wordmark | `#0A0A0A` | cierre |

Es **teal & orange llevado al extremo**: sombras empujadas a turquesa, medios y piel empujados a ámbar, negros aplastados. No hay un tercer color. La disciplina es la gracia: dos temperaturas y nada más.

**Composición.** El HUD divide el cuadro en un marco de expediente y deja el centro libre. Los titulares van **siempre centrados en el eje horizontal**, nunca alineados a un borde. La acción real (la laptop, la cara, la mano) se coloca deliberadamente descentrada, y el titular pasa por encima sin negociar. Nunca hay dos textos compitiendo: o hay HUD y metraje, o hay HUD y titular.

**Ritmo.** Ver la tabla medida arriba. La regla portable: **el plano más largo es el primero y el segundo más largo es el último.** Todo lo del medio es relleno de energía.

**Motion.** Barridos con desenfoque real de cámara como transición (no cortes secos entre planos estáticos); POV a mano con gran angular; un efecto de eco/fantasma sobre una pantalla; y el elemento portador que sobrevive al corte final. Cero animación de texto: los titulares no entran, no salen, no rebotan. Aparecen y desaparecen. Ese contraste — cámara salvaje, tipografía inmóvil — es la mitad del efecto.

**Textura.** Halación fuerte en las altas luces (la ventana quemada sangra sobre lo que tiene al lado), grano visible, bandas de escaneo de una pantalla filmada, y desenfoque de movimiento honesto. Nada de esto es un plugin: es una cámara barata bien usada.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → dos patrones nuevos: **"HUD de cuatro esquinas por diferencia"** y **"cierre por elemento portador"**.
- `.agents/skills/hyperframes-creative/` y `.agents/skills/motion-doctrine/` → el elemento portador ya es doctrina nuestra; este post es el ejemplo mínimo para citarla.
- `hermes-content/references/ui-patterns/` → el HUD por `mix-blend-mode: difference` sirve igual para un overlay web sobre hero de video.

## Las tres preguntas

1. **Frente:** dos, y en este orden. (a) **Editor de videos** — construir el marco HUD + placa de cierre como componente reutilizable de HyperFrames, que es la pieza concreta y se puede hacer hoy. (b) **Marketing / influencers IA** — el molde de guion "no publiques tu trabajo, publicate trabajando", que para ONIA se traduce en filmar el proceso de encender un rubro en vez de mostrar capturas del dashboard.

2. **Herramienta nuestra:** **HyperFrames** (HTML→MP4, ya instalado y probado, Apache 2.0) para el HUD, la placa de apertura y el cierre; **editor-videos** + ffmpeg para el ritmo de cortes y el grade teal/orange. El `mix-blend-mode: difference` es CSS puro, no necesita nada. **No hace falta ninguna herramienta que no tengamos.**

3. **Que falta:** para el **componente** — nada. Se puede construir y renderizar hoy con metraje de prueba. Para el **reel completo de ONIA** — falta metraje real: alguien filmando a Sergio trabajando. No es una credencial ni un permiso, es una filmación. Y falta una decisión de formato: **este video es 16:9 y eso en Reels es una franja chica con bandas negras; nuestra versión tiene que nacer 1080×1920 con el HUD dentro del área segura**, no portar el 16:9 tal cual.

## Lo que NO se puede afirmar

- **Qué se dice.** El sujeto habla a cámara en al menos cinco planos y **no hay transcripción**: Speaches devolvió "fetch failed" para los 26 videos del lote. Todo lo que sé del contenido viene del texto en pantalla y del caption.
- **La tipografía de los titulares del reel.** No se nombra en ninguna parte. Lo único recuperado es `Creato Display Bold`, y eso es del archivo del CLIENTE abierto en Illustrator, no necesariamente de los titulares del video.
- **El `mix-blend-mode: difference`.** Es mi reconstrucción del mecanismo, no un dato. Nadie lo dice.
- **El efecto de eco en la pantalla del teléfono.** Puede ser edición o puede ser obturador rodante. No lo verifiqué.
- **La música.** Se ve una lista de Spotify siendo scrolleada, pero eso no prueba que ninguna de esas canciones sea la del reel — es un plano de B-roll de alguien eligiendo música. Sin audio, no puedo decir cuál sonó.
- **Con qué se editó.** No se dice. Se ven `Ps` y `Ai` en el dock y `Adobe Illustrator 2026` en la barra de título, pero eso es el software de DISEÑO que sale filmado, no el de edición de video.
- **Qué resultado tuvo.** No hay métricas de alcance, guardados ni conversiones a la vista.
- **Si hubo cliente.** El video muestra un layout llamado "Come Stay" y una lámina de entregables, pero **no se nombra ningún cliente ni se afirma que esté pago o entregado.**
