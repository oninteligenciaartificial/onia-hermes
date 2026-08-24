# Contador escalado en una sola toma

- **Fuente:** https://www.instagram.com/p/DcJivjZOOth/ · @bastian.xu
- **Tipo:** MARKETING
- **Veredicto:** SIRVE YA
- **Cobertura:** 43 de 47 fotogramas (91%): 7/7 base + 36/40 texto (90%). Sin leer: texto_004_02, texto_004_04, texto_005_02, texto_005_04 (tramos ya cubiertos por vecinos idénticos a 4/s). **Audio no transcrito** — Speaches falló para todo el lote. El sujeto habla durante casi todo el video (boca abierta en la mayoría de los fotogramas) pero **no se oyó nada**: todo lo que sigue sale del texto en pantalla y del caption.

## Que muestra, textual

**Texto en pantalla** (RECUPERADO, transcrito literal, en el orden en que aparece):

1. `24 Views`
2. `384 Views` / `+ postura`
3. `1,685 Views` / `+ postura` / `+ cara`
4. `84,284 Views` / `+ postura` / `+ cara` / `+ tono`
5. `335,284 Views` / `+ postura` / `+ cara` / `+ tono` / `+ gestos`
6. `1 View`

No hay ningún otro texto en pantalla: **sin logo, sin @, sin CTA, sin flecha, sin "link en bio", sin sticker de comentario**.

**Caption** (RECUPERADO, literal):

```
No es solo lo que dices, sino cómo lo dices.

La forma en la que comunicas puede hacer que te ignoren… o que se detengan a escucharte.
```

## Como esta hecho — la reconstruccion

Es un molde de MARKETING, y su mecánica es que **el video demuestra en vivo lo que afirma**. No cuenta el principio: lo ejecuta delante de la cámara mientras un contador lo puntúa.

### El mapa de beats (medido, no estimado)

Duración **13,116 s** · 720×1280 · 30 fps · 390 frames · **0 cortes detectados** (umbral scene 0.3). Los cortes de beat salen del muestreo denso a 4/s (grupos contiguos de 8 fotogramas):

| Tramo | Overlay | Qué hace el cuerpo (verificado visualmente) |
|---|---|---|
| 0,00 – ~1,50 s | `24 Views` | Encorvado, cabeza baja, hombros caídos, mirada al escritorio |
| ~1,50 – ~3,25 s | `384 Views` + `postura` | Se endereza: la cabeza sube ~4% del cuadro respecto del inicio |
| ~3,25 – ~4,75 s | `1,685 Views` + `cara` | Cejas y boca entran en juego; sonrisa asimétrica, mirada a lente |
| ~4,75 – ~7,25 s | `84,284 Views` + `tono` | (sólo lo dice el rótulo: **no se oyó el audio**) |
| ~7,25 – ~9,75 s | `335,284 Views` + `gestos` | Las manos entran al cuadro; pinza, palmas abiertas, marcado de ritmo |
| ~9,75 – 13,12 s | `1 View` | Vuelve a encorvarse, cabeza baja, mirada al escritorio |

Los límites de tramo se derivan del muestreo a 4/s asumiendo que los 40 fotogramas `texto_*` son contiguos desde 0 s (5 grupos × 8 = 10 s), y los dos últimos `base_*` (10 s y 12 s) confirman el colapso. **Los tiempos internos son medidos por muestreo, no cronometrados fotograma a fotograma.**

### Dónde está el gancho

En el primer fotograma, y son **dos cosas a la vez**: un número humillantemente bajo (`24 Views`) y una persona visiblemente apagada. El espectador no tiene que entender nada: ve el fracaso y ve la causa en el mismo cuadro. Cuesta 1,5 s.

### La escalada como argumento

Cada elemento que suma multiplica el contador: 24 → 384 (×16) → 1.685 (×4,4) → 84.284 (×50) → 335.284 (×4). El salto más grande está en `+ tono`, justo el elemento que **no se puede ver** — el video obliga a subir el volumen para verificarlo. La lista es acumulativa: nada se reemplaza, todo se apila. Es una demostración de suma, no de comparación A/B.

### El cierre: colapso + loop bait

El último beat es el más largo (~3,4 s, más que cualquier beat de la escalada) y hace lo contrario de lo esperado: quita todo de golpe y el contador cae a `1 View`. Y acá está el truco de retención: **la pose final (encorvado, cabeza baja, mirando al escritorio) es prácticamente idéntica a la pose del fotograma 0**. En el autoloop de Instagram el final empalma con el principio sin salto visible, y el espectador que se queda "pegado" suma reproducciones repetidas. El loop no es un accidente: es la única razón para terminar en el estado de fracaso en vez de en el de éxito.

### Qué pide, y en qué orden

**Nada.** No hay CTA en pantalla ni en el caption. Es contenido de tope de embudo puro: su mecánica de conversión es **prueba de competencia** — el tipo que te va a enseñar a comunicar, comunica bien delante tuyo durante 13 segundos sin un solo corte. El caption no vende, resume la tesis.

### Lo que NO está hecho, y ahí está la lección

- **Cero motion gráfico.** En un muestreo a 4/s no aparece ni un fotograma de transición: el texto entra por **cut-in seco**. Nada se desliza, nada hace fade, nada rebota.
- **Cero cortes** (0 detectados en 13,116 s). Cámara fija, encuadre fijo, sin push ni zoom: la cabeza sube y baja porque **él** se mueve, no porque la cámara lo siga.
- **Cero producción.** Escritorio de oficina real, iPhone/cámara apoyada, ventana de piso a techo como softbox.

Todo el ritmo del video lo cargan dos cosas gratis: el overlay que suma y el cuerpo que actúa. Eso es lo que lo hace portable a un equipo sin editores.

⚠️ Los 0 cortes están medidos con umbral scene 0.3. Con encuadre fijo, un corte de continuidad limpio no se detectaría; la toma continua es lo más probable pero no está probada al 100%.

## El estilo, como conocimiento portable

**Tipografía.** Un solo neogrotesco en dos pesos. El número en Bold, la lista en Regular/Medium. La `a` de dos pisos, la `e` de barra horizontal, el `4` cerrado y la `1` sin serif de base apuntan a Helvetica Now Display / Inter / SF Pro Display — **el original no declara la fuente; esto es reconstruido, no recuperado**. Tamaños medidos sobre el fotograma de 1080×1920: número ≈ 60 px de alto (~3,1% de la altura del cuadro), ítems ≈ 40 px (~2/3 del número), interlineado de la lista ≈ 47 px (≈1,2 em). Sin tracking negativo llamativo, sin mayúsculas, sin itálicas.

**Paleta** (hex APROXIMADO — leído de una captura JPEG en pantalla, no de un archivo de diseño):
- Número: blanco `#FFFFFF` con sombra suave apenas perceptible
- Ítems: verde puro saturado ≈ `#2ECC2E` (rango observado `#22C522`–`#3AE33A`)
- Polo del sujeto: negro casi puro ≈ `#0E0F12`
- Escritorio: madera clara ≈ `#C3A277`
- Mousepad de fieltro: gris ≈ `#4A4E52`
- Ventana / cielo quemado: blanco lechoso ≈ `#E9EDEC`
- Ciudad de fondo: gris-azul desaturado ≈ `#97A3A8`
- Único acento cálido de todo el cuadro: el logo rojo del polo ≈ `#C1122B`

Dos colores de texto y nada más. El verde no decora: **marca lo que se suma**. Blanco = resultado, verde = insumo.

**Composición.** Plano medio fijo, vertical 9:16. Sujeto centrado, cabeza en el tercio superior. El escritorio corta el tercio inferior con una horizontal fuerte que ancla el cuadro. El overlay se planta con la línea base del número al **~56% de la altura**, es decir **sobre el torso negro** — nunca sobre el fondo claro. Por eso no necesita caja, ni barra, ni sombra dura: el contraste se lo da la ropa. El número va centrado; la lista va alineada a la izquierda con una sangría de ~6% del ancho respecto del borde izquierdo del número, lo que crea una jerarquía visual de "titular + detalle" sin usar viñetas ni cambio de color de fondo.

**Ritmo.** 13,116 s, 0 cortes, 6 estados de overlay. Beat cada ~1,5–2,5 s en la escalada y ~3,4 s en el remate. La curva es: gancho corto (1,5 s) → cuatro beats de escalada → remate largo. El beat más largo es el último, no el primero: el chiste tiene aire.

**Motion.** Ninguno en el overlay. Cut-in seco, posición fija, sin entradas ni salidas animadas. Todo el movimiento del cuadro es humano: postura, cara, manos. Es una lección al revés para nosotros — nuestro instinto es animar el texto; acá el texto quieto es lo que deja ver la actuación.

**Textura.** Luz de ventana difusa a contraluz suave; el fondo blanco quemado funciona de softbox natural y separa la silueta negra sin necesidad de luz de recorte. Grano bajo, sin filtro de color, sin viñeta, sin grading visible. Se ve caro por la ventana y por el orden del escritorio (Magic Mouse, AirPods, mousepad de fieltro alineados), no por el equipo.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → patrón nuevo **«contador escalado + stack acumulativo»** (posición fija, cut-in seco, texto sobre zona oscura, remate largo, loop bait por pose de inicio = pose de final).
- `hermes-content/references/video-intake/` → esta ficha.

## Las tres preguntas

1. **Frente:** dos, y en este orden. **editor de videos** (construir el overlay reutilizable) y **marketing / INFLUENCERS IA** (adaptar el guion a Onia). El molde es de guion + overlay, no de generación.

2. **Herramienta nuestra:** **HyperFrames** (HTML→MP4, ya instalado y probado, Apache 2.0) para la composición del overlay quemado, con timing por atributos `data-*` según la skill `hyperframes-core`; skills `editor-videos` y `captions-overlay` para el pipeline de quemado sobre la toma. **No hace falta nada de `motion-doctrine` / `cut-the-curve`: el patrón es explícitamente sin motion.** Si se quiere la versión mínima, un `drawtext` de ffmpeg con `enable='between(t,a,b)'` reproduce los 6 estados sin más.

3. **Qué falta:** técnicamente **nada**. Faltan dos cosas de contenido, y una es un bloqueo real:
   - **Un presentador humano que sostenga 13 s en una sola toma con progresión de energía real.** Lucía (Higgsfield/kling) **no** sirve para esto: son clips generados de 5–10 s sin control de micro-actuación progresiva, y el video entero depende de que el cuerpo cambie continuamente. Esto va con Sergio a cámara, o no va.
   - **El contador NO puede llevar cifras de Onia.** Con cero clientes pagando, la regla «no fabricar» prohíbe mostrar métricas propias o de cliente. El patrón se porta con placeholders o con una magnitud verificable y neutra (segundos de una tarea, cantidad de pasos, minutos de agenda). Esto hay que decidirlo con Sergio antes de grabar.

## Lo que NO se puede afirmar

- **Nada de lo que dice.** Habla durante casi todo el video y el audio no se transcribió (Speaches falló). No sé si el guion hablado repite el texto en pantalla, si lo contradice, ni si hay CTA hablado.
- **El `+ tono` no está verificado.** Es un rótulo en pantalla, no algo que yo haya oído. Postura, cara y gestos sí los verifiqué en los fotogramas; el tono no.
- **De dónde salen los números.** El post no dice si 24 / 384 / 1.685 / 84.284 / 335.284 son métricas reales de sus propios reels, un experimento, o cifras ilustrativas. No hay captura de pantalla de analytics ni ninguna fuente.
- **La fuente tipográfica.** No se declara; la identificación es reconstruida.
- **Los hex.** Aproximados, leídos de fotogramas JPEG comprimidos.
- **La toma continua.** 0 cortes detectados con umbral 0.3 y encuadre fijo; un corte de continuidad limpio no se detectaría.
- **Qué herramienta usó para el overlay** (CapCut, Premiere, Final Cut, quemado en el teléfono). No se dice en pantalla ni en el caption.
- **Métricas del propio post** (views, likes, comentarios, guardados) y fecha de publicación: no están en los insumos que recibí.
- **Si hay música o SFX.** No se oyó nada.
