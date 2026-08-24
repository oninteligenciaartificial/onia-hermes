# Recorte de podcast que retiene sin cortar

- **Fuente:** https://www.instagram.com/p/DbJy34KhdyM/ · @niidea.tv
- **Tipo:** MIXTO (MARKETING — el molde de recorte; + paquete gráfico portable a editor-videos)
- **Veredicto:** SIRVE YA
- **Cobertura:** 65 de 70 fotogramas (93%). Los 33 `base_*` completos (0–64 s, uno cada 2 s) y 32 de 37 `texto_*` (86%). Los 5 no leídos son de la placa final estática, idéntica en los 8 vecinos que sí abrí. Caption completo. **No se pudo leer el audio**: Speaches falló para todo el lote, no hay transcripción.

## Que muestra, textual

**Texto en pantalla — RECUPERADO (transcrito literal de los fotogramas):**

Barra de título (dos líneas, se construye línea por línea, en pantalla ≈0,5 s → ≈5,8 s):
> LOS PANELES SOLARES: GENERÁ,
> VENDÉ AL SISTEMA Y PAGÁ MENOS

Bugs permanentes en las esquinas superiores, los 65 s salvo la placa final:
> EMPRENDE $ BROTHERS (arriba izquierda) · NiIDEA (arriba derecha)

Zócalo temporizado, visible sólo alrededor de 29–34 s:
> E$B | 21:00 | Mie

Placa final (58,2 s → fin):
> EMPRENDE $ BROTHERS
> [icono YouTube] | EN VIVO
> Miércoles
> 21:00
> NiIDEA

Karaoke, una palabra por vez. Lo que aparece en cada fotograma muestreado (es un MUESTREO, no la frase completa — no puedo reconstruir oraciones sin la transcripción):
`ENTONCES` (0,0 s) · `LO` (0,25) · `PASANDO` (0,5) · [tapado por la barra de título 0,75–5,8] · `EL` (6) · `PERO` (8) · `INYECTÁS` (10) · `VOS` (12) · `LA` (14) · `BATERÍA` (16) · `CREE` (18) · `CIUDAD` (20) · `PESOS` (22) · `CANTIDAD` (24) · `PLATA` (26) · [sin palabra] (28) · [sin palabra] (30) · [sin palabra, segundo conductor] (32) · `LO` (34) · [sin palabra] (36) · `YO` (38) · `DOS` (40) · `IRME` (42) · `MONTERO` (44) · `PANELES` (46) · `LO` (48) · `RESTAURANTES` (50) · `SIQUIERA` (52) · `VOS` (54) · `Y` (56).

**Caption, verbatim:**
> 🟠 Aprendé cómo vender tu energía al sistema y ahorrar sin estar en casa ☀💡
>
> 🟠 EMPRENDE BROTHERS
> En vivo por YouTube | Los Miercoles a las | 21:00
>
> #santacruzdelasierra🇳🇬 #bolivia🇧🇴 #ahorro #energia #panelsolar

(El emoji del primer hashtag es la bandera de Nigeria, no la de Bolivia. Lo transcribo tal cual; no lo interpreto.)

## Como esta hecho — la reconstruccion

Es un **recorte vertical de un podcast en vivo**, no una pieza filmada para Reels. Dos conductores con PodMic y auriculares, set con luces de neón y estantería de merch al fondo, público/producción visible detrás. Se ve un segundo conductor con camisa azul entre ~30 y ~34 s, en otra cámara y otro encuadre del mismo set.

**El dato duro que rompe el dogma del corte rápido.** ffprobe/ffmpeg midió **17 cortes en 65,364 s**, pero están mal distribuidos a propósito:

| Bloque | Cortes medidos | Qué son |
|---|---|---|
| 0 – 58,2 s (el 89% del video) | 6 (11,97 · 12,43 · 30,50 · 30,83 · 31,57 · 33,63) | Cambios de cámara. Los pares casi consecutivos (11,97+12,43 y 30,50+30,83+31,57) parecen **una** transición con flash cada uno, no cortes distintos — eso es **inferido**, no medido. |
| 58,23 – 58,93 s (0,7 s) | 11 | Un **flicker/estroboscopio** de entrada a la placa final. Once detecciones de escena en 700 ms. |

O sea: **58 segundos de cuerpo con 3 o 4 cambios de plano reales**. Casi un plano secuencia. La retención no la sostiene el montaje: la sostiene el **texto**. Ese es el hallazgo.

**Cómo se sostiene, mecanismo por mecanismo:**

1. **El gancho es una barra de texto, no la primera frase.** El primer fotograma no tiene título: es un hombre mirando hacia abajo. A ~0,5 s empieza a construirse una barra blanca en el tercio inferior: primero se traza una línea blanca horizontal, después aterriza la línea 1 (`LOS PANELES SOLARES: GENERÁ,`), después la línea 2 (`VENDÉ AL SISTEMA Y PAGÁ MENOS`) y la caja crece hacia abajo. Se va a ~5,8 s. **Un recorte de podcast no controla su primer segundo de audio, así que la promesa va escrita.** Tres verbos en imperativo voseo, dos líneas, una promesa doble (ingreso + ahorro).
2. **Karaoke de una palabra, corte duro.** Cada palabra reemplaza a la anterior sin fundido, siempre en la misma ranura vertical (~70% de altura), centrada, con relleno naranja y contorno/sombra oscura para leerse sobre cualquier fondo. Cuando el sujeto no habla (28 s, 30 s, 36 s) **no hay palabra**: la ranura queda vacía en vez de repetir la última. Eso evita el efecto "subtítulo pegado".
3. **La barra de título tapa al karaoke.** Ocupan la misma zona. Durante los primeros 5,8 s el karaoke está oculto. Es una decisión de jerarquía: mientras el gancho está en pantalla, nada compite.
4. **El zócalo de horario entra montado sobre el corte.** El `E$B 21:00 Mie` aparece justo en la ventana 29–34 s, que es exactamente donde ocurre el cambio de cámara. El corte justifica la aparición del gráfico — no aparece "porque sí" en mitad de un plano.
5. **Empuje continuo lentísimo.** Comparando texto_001 con texto_003 (mismo plano, 5 s de diferencia) el encuadre está sensiblemente más cerrado. Hay un scale progresivo sobre el plano fijo. No es un zoom llamativo: es la única fuente de movimiento durante decenas de segundos.
6. **Salida por flash a placa fija.** 0,7 s de estroboscopio, luego 6,4 s de placa estática, y el último fotograma (texto_033_05) está claramente atenuado — fundido de salida.

**La mecánica de conversión: es una CITA, no una captura.** No hay link, ni "comentá X", ni PDF, ni lead magnet. Toda la conversión es "volvé el miércoles 21:00 a YouTube", dicha tres veces: en el bug del zócalo, en la placa final y en el caption. El objeto que venden es **el próximo episodio**.

## El estilo, como conocimiento portable

**Tipografía.** Dos familias, pareadas a propósito.
- *Titular y karaoke:* grotesca pesada condensada, TODO MAYÚSCULAS, tracking apretado, sin itálica. Familia estilo Anton / Druk Condensed. **Es una lectura visual, no está declarada en ninguna parte del post.**
- *Placa final ("Miércoles 21:00", "EN VIVO"):* palo seco humanista redondeada, semibold, caja mixta en "Miércoles". Deliberadamente más blanda que el titular — el contraste entre las dos es lo que hace que la placa se lea como marca y no como subtítulo.
- *Logo del programa:* letras pesadas deformadas dentro de un banner arqueado tipo bandera, con el `$` reemplazando la conjunción. Vectorial, no tipografía viva.

**Paleta (hex APROXIMADO — leído de una pantalla comprimida a 360×640, no muestreado de un archivo fuente):**
| Rol | Hex aprox. |
|---|---|
| Naranja de marca (logo, relleno karaoke) | `#F07C22` |
| Naranja claro / salmón del relleno de palabra | `#F5924E` |
| Contorno-sombra de la palabra | `#2B1A12` |
| Amarillo del degradado (esquina superior izq. de la placa) | `#F2D411` |
| Naranja medio del degradado | `#E2631A` |
| Marrón-rojo del degradado (borde inferior) | `#8C3A1C` |
| Marrón muy oscuro del banner del logo | `#3A1410` |
| Fondo de la barra de título | `#FFFFFF` (≈95% opaco) |
| Texto de la barra de título | `#111111` |
| Zócalo de horario | degradado `#F2761B` → `#D6252B`, texto blanco |

Una sola familia cromática (naranja→rojo) más blanco y negro. Cero color frío en los gráficos: todo el azul y violeta de la imagen viene del set, no del diseño. Eso es lo que hace que los overlays se despeguen del fondo sin necesitar caja.

**Composición.** 9:16. Tres franjas fijas: bugs de marca en las dos esquinas superiores (nunca se mueven, nunca se animan), sujeto en el centro, texto en una ranura a ~70% de altura. Nada toca el borde inferior — la zona de la UI de Instagram queda limpia. El titular es de dos líneas centradas con la caja justificada al ancho del texto más largo.

**Ritmo.** 65,364 s. 17 cortes medidos, de los que **11 están dentro de 0,7 s** al final: el cuerpo real corre 58 s con 6 detecciones que probablemente son 3–4 transiciones. Palabra de karaoke sostenida ~0,5–1,5 s (estimado a partir del muestreo, no medido). Titular en pantalla ≈5,3 s (0,5 → 5,8 s, leído de los fotogramas, ±0,25 s). Zócalo ~4 s. Placa final ~7 s de los 65 = 11% del video dedicado a la cita.

**Motion.** Cuatro gestos, ninguno decorativo: (1) barra de título que se **construye** — línea trazada, línea 1, línea 2, caja crece hacia abajo; (2) karaoke por **reemplazo duro**, sin fundido; (3) **push-in continuo** casi imperceptible sobre el plano fijo; (4) **flash-cut estroboscópico** de 0,7 s como única transición fuerte de todo el video, reservada para el momento en que se pide la acción. Cero wobble, cero movimiento ocioso.

**Textura.** Grano visible sobre el degradado naranja de la placa final (no sobre el metraje). El banner del logo tiene deformación de onda y esquinas recortadas, estética de cartel impreso.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → los patrones "barra de título que se construye línea por línea" y "flash-cut de 0,7 s a placa de cierre".
- Skills `editor-videos`, `captions-overlay` y `hyperframes` (+ `hyperframes-animation`) → el pack de overlays como componentes HTML reutilizables.
- `motion-doctrine` / `cut-the-curve` → el caso de "movimiento que performa": el push-in continuo como corriente única de 58 s.
- Esta ficha, en `hermes-content/references/video-intake/`.

## Las tres preguntas

1. **Frente:** el **editor de videos** (skill `editor-videos`, motor HyperFrames) y, detrás, el **Estudio de Contenido**. NO es web-factory: acá no hay ningún mecanismo de interfaz, hay un paquete gráfico de video.
2. **Herramienta nuestra:** existe y está en main. **HyperFrames** (HTML→MP4, Apache 2.0, el motor decidido el 21-ago) para componer los cinco overlays; skill `editor-videos` para el corte y el quemado; `captions-overlay` para el karaoke, que ya lo hacemos. Lo que **no** tenemos es el paquete de marca ONIA como piezas reutilizables — hoy cada video se arma a mano.
3. **Qué falta:** para **construir** el pack, nada. Cero gasto, cero credencial, cero permiso — HyperFrames es local y gratis. Para **usarlo** falta metraje propio de talking-head: ONIA no tiene podcast ni un archivo de cámara equivalente. Y una decisión chica de Sergio: la placa de cierre nuestra pide una demo en `cal.onia.com.bo`, que es un agendamiento 1:1, no una cita recurrente como la de ellos — el molde se porta, el objeto cambia.

## Lo que NO se puede afirmar

- **Nada sobre lo que se dice.** Speaches falló para todo el lote. Los dos conductores hablan durante los 65 s; no hay transcripción. Las palabras del karaoke que listé son texto EN PANTALLA leído fotograma a fotograma, y son un muestreo cada 2 s: no forman frases y no las voy a reconstruir.
- **Ninguna herramienta se dice.** No se nombra editor, plugin, preset ni generador de subtítulos, ni en pantalla ni en el caption. No sé si el karaoke es automático (CapCut, Submagic, Opus Clip) o hecho a mano. **No se dice.**
- **La tipografía es lectura visual.** Nombré familias parecidas; el post no declara ninguna.
- **Los hex son aproximados** y salen de una pantalla de 360×640 recomprimida, no de un archivo fuente.
- **Los 6 cortes del cuerpo pueden ser 3 o 4 transiciones.** Que los pares consecutivos sean un flash y no dos cortes es inferencia mía a partir de los fotogramas vecinos, no está medido.
- **No sé quién es el segundo conductor** ni el primero: nadie aparece nombrado en pantalla.
- **No verifiqué la afirmación técnica del video.** Que en Bolivia se pueda inyectar y vender energía solar al sistema es lo que el post asegura; no lo comprobé y no es una afirmación nuestra.
- **No hay ninguna métrica.** No sé vistas, alcance ni si el formato funciona. Cero datos de rendimiento.
- **No sé si el flicker de 0,7 s es un zoom-blur, un stack de fotogramas blancos o un glitch de plantilla.** A 30 fps y 2 s de muestreo no cae ni un fotograma dentro de la transición.
