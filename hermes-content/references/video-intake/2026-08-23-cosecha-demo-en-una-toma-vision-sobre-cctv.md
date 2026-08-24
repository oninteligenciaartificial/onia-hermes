# Demo en una sola toma: visión por computadora sobre las cámaras que el cliente ya tiene

- **Fuente:** https://www.instagram.com/p/DadOo9Mo3AA/ · @supra_digitalsolutions
- **Tipo:** MIXTO (SaaS de video-analítica + MARKETING; la IA es el motor, no el tema)
- **Veredicto:** SIRVE YA — pero lo que sirve ya es el **molde**, no el producto. El producto va a BANCO y lo digo abajo con nombre y apellido.
- **Cobertura:** 64 de 72 fotogramas (32/32 `base_*` + 32/40 `texto_*` = 80%). Caption entero. **Sin transcripción de audio**: Speaches falló ("fetch failed") y el tipo habla los 64,7 s enteros — todo lo que sigue sobre "lo que dice" son sus PROPIOS subtítulos quemados, no una transcripción mía.

---

## Que muestra, textual

### Subtítulos quemados, en orden (RECUPERADOS — están escritos en pantalla, se transcriben literal, con sus errores)

1. `Muchas personas nos preguntan si nosotros hacemos este tipo de`
2. `implementaciones fíjese como podemos medir los tiempos de productividad,`
3. `recorrido, tiempos que tardan en atender las mesas, cuanto tiempo tarda una`
4. `persona promedio en cada mesa, cuanto tiempo le tardan en llevar la cuenta,`
5. `la comida, incluso también se puede medir los tiempos de espera en la fila`
6. `de su de los supermercados, eh evitar fraude como que te roben objetos que`
7. `básicamente la productividad del empleado, etcétera se puede medir`
8. `absolutamente todo en cualquier tipo de industria De servicio, quioscos,`
9. `almacenes, fábricas, ah centros logísticos lo que vos necesites nosotros lo`
10. `podemos medir lo podemos pasar una métrica para darte un y en tiempo real`
11. `vas a poder saber lo que está pasando en tu negocio incluso se puede`
12. `configurar para que te eh para que WhatsApp te envíe notificaciones con toda`
13. `la información como por ejemplo hey hoy tuviste un día de productividad`
14. `mucho más abajo que lo`
15. `lo normal así que haceme`
16. `el formulario básicamente te contactas con nosotros y podemos hablar de.`
17. `Hacer una demo totalmente gratis y básicamente`
18. `y además esto también se puede usar con tus propias cámaras de seguridad eso`
19. `está muy muy bueno así que te esperamos`

(El "lo" repetido entre 14 y 15 está así en pantalla. Entre el bloque 6 y el 7 hay ~2 s sin subtítulo, y otro hueco corto entre 16 y 17.)

### Texto DENTRO del video de las cámaras (RECUPERADO, con el nivel de legibilidad declarado)

**Escena A — cenital de una cafetería/panadería (0-14 s aprox.):**
- Etiquetas verdes de duración, legibles: `1 hour 15 min` (dos instancias distintas), `25 min`, `5 min`.
- Etiquetas azules de nombre + conteo, legibles: `Anna 20 cups`, `Elena 10 cups`, `Vika 10 cups` / `Vika 11 cups` (cambia entre fotogramas), `Olga _ cups` (el número no se lee), `Diego 1? ...` (parcial).
- Trazas de recorrido dibujadas en violeta-azul y en rojo sobre el piso.

**Escena B — cenital de un minimarket/almacén (14-64,7 s):**
- Etiquetas de clase + índice, legibles: `person 2`, `person 3`, `person 4`, `person 5`, `person 6`, `person 7`, `person 8`, y una `person 0` o `person 9` parcial arriba a la derecha.
- Máscaras de segmentación rojas rellenas sobre cada persona, cajas rojas, y líneas rojas finas de trayectoria que bajan hasta el piso.
- Una mochila/objeto queda pintado de AZUL, no de rojo: hay más de una clase detectada.
- Overlay del DVR arriba a la derecha: `18:26:4x` y un `...22` (fecha parcial, ilegible).
- Marca de agua abajo a la derecha: **`AMCREST`** — la marca del equipo de CCTV, no del software.

### Caption (RECUPERADO, literal, con sus errores)

`Convertí tu negocio físico en un lugar inteligente que te proporcione las estafisticas claves , usando las mismas cámaras de seguridad que ya tenes implementadas. Abarcamos todo tipo de industrias, escribimos y obtén más información 💪`

---

## Como esta hecho — la reconstruccion

### 1. La máquina de estados del producto (lo que importa, tipo SaaS)

Nada de esto se dice en pantalla; lo **infiero** de lo que se ve y lo marco como inferido.

| Capa | Qué es | Evidencia en pantalla |
|---|---|---|
| **Entrada** | RTSP del DVR/NVR que el cliente **ya tiene**. No venden hardware. | Marca de agua `AMCREST` + timestamp de DVR quemado en el frame ⇒ están consumiendo el stream tal cual sale del grabador, no una cámara propia. El bloque 18 lo dice literal: "esto también se puede usar con tus propias cámaras de seguridad". |
| **Detección** | Detector de instancias con máscara, clase `person`. | La etiqueta literal es `person N` — la firma de la clase COCO `person` con índice de instancia. Hay máscara rellena (segmentación), no solo caja. Hay al menos una segunda clase (la mochila azul). **El modelo NO se nombra ni en pantalla ni en el caption.** |
| **Tracking** | ID persistente por persona + traza acumulada. | El mismo `person 2` conserva su número entre fotogramas separados por segundos, y arrastra una polilínea de trayectoria. |
| **Zonas** | Regiones dibujadas a mano sobre el plano (mesa, fila, caja). | En la escena A las duraciones (`1 hour 15 min`, `25 min`) están ancladas a UBICACIONES fijas (mesas), no a personas ⇒ hay un polígono de zona con un cronómetro por zona. |
| **Reidentificación / identidad** | Nombre propio asociado a una persona recurrente. | `Anna 20 cups`, `Elena 10 cups`. Un nombre + un contador acumulado por persona es reidentificación, y es la parte más pesada y más delicada legalmente de todo el sistema. **No se explica cómo se hace.** |
| **Métricas** | Dwell time por zona, tiempo de atención, tiempo de fila, conteo por persona. | Recuperado del bloque 2 al 7. |
| **Salida 1** | Dashboard "en tiempo real". | Bloque 10-11. **Nunca se muestra el dashboard**: los 64,7 s son el video con overlays, no la app. |
| **Salida 2** | **Resumen del día empujado a WhatsApp.** | Bloque 12-15, con el ejemplo textual: "hey hoy tuviste un día de productividad mucho más abajo que lo normal". |

**La pieza más vendible de toda la arquitectura no es el modelo: es la salida 2.** El modelo es commodity. Que el sistema TE HABLE por WhatsApp cuando el día salió mal es el único momento del reel donde el producto deja de ser una demo bonita y se vuelve un empleado.

### 2. El molde de marketing (lo que se copia hoy)

Cinco bloques, en este orden exacto, medidos contra los tiempos reales del reel:

| # | Bloque | Tramo aprox. | Mecánica |
|---|---|---|---|
| 1 | **Gancho por pregunta frecuente** | 0-3 s | "Muchas personas nos preguntan si nosotros hacemos este tipo de implementaciones". Cero promesa, cero cifra, cero "descubrí el secreto". Abre con la duda del que mira y la responde mostrando. |
| 2 | **Demostración con el dedo** | 3-30 s | La pantalla YA está corriendo cuando arranca el plano. Enumera 8 mediciones seguidas señalándolas físicamente con la mano sobre el monitor. Las encadena con "incluso también se puede…". |
| 3 | **Amplitud de rubro** | 30-40 s | "…absolutamente todo en cualquier tipo de industria: de servicio, quioscos, almacenes, fábricas, centros logísticos, lo que vos necesites nosotros lo podemos medir." Convierte un caso (un minimarket) en un mercado. |
| 4 | **El remate que vende** | 40-52 s | La notificación de WhatsApp, dicha en primera persona del sistema. Es el único momento con una frase citada textual, y por eso es el único que se recuerda. |
| 5 | **Cierre a demo** | 52-65 s | "haceme el formulario… podemos hablar de hacer una demo totalmente gratis". Fricción baja, objeto claro, palabra "gratis" al final y no al principio. |

Lo que el molde **no** hace y conviene notar: no pone logo, no pone marca de agua propia, no pone CTA gráfico, no pone cifras de ROI, no muestra un solo testimonio. Vende con la pantalla encendida y nada más.

### 3. La producción del video

- **UNA SOLA TOMA.** Medido: **64,700 s, 360x640, 30 fps, 1941 fotogramas, 0 cortes** (umbral scene 0.3). No hay montaje. Lo que parece un corte a los ~14 s (cambia de la cafetería al minimarket) es un cambio de CONTENIDO EN EL MONITOR, no un corte de edición: la mano, la planta y el reflejo de la ventana siguen siendo continuos.
- **Cámara en mano** filmando el monitor **en diagonal**, nunca frontal. Eso genera profundidad y perspectiva reales sin un solo efecto de post.
- **La mano es el editor.** Entra en cuadro a señalar cada vez que la voz nombra una métrica nueva. Reemplaza al corte, al zoom y al puntero animado.
- **PiP del hablante** arriba a la derecha, rectángulo vertical de esquinas muy redondeadas, sin borde ni sombra. **Flota**: compará base_001 con base_017 y base_025 — cambia de tamaño y de posición. Es el PiP de una app de grabación de pantalla+cámara, no un compositor de edición.
- **Subtítulos quemados**: 3 líneas máximo, **caja negra opaca por RENGLÓN** (no un rectángulo único: cada línea tiene su propio fondo del ancho del texto), blanco sobre negro, a ~75-80% de la altura. Cambia el bloque entero, sin karaoke palabra por palabra. Con 19 bloques leídos en 64,7 s da **~3,4 s por bloque** — cifra derivada por mí, no medida por ffmpeg.

---

## El estilo, como conocimiento portable

**Aviso: los hex son APROXIMADOS.** Se leen de un JPEG de 360x640 que a su vez es una foto de un monitor. Sirven como dirección, no como token.

- **Tipografía:** sans grotesca pesada, altura de x grande, contraste nulo — familia Montserrat ExtraBold / Poppins Bold / la fuente por defecto de los subtituladores automáticos. Sin tracking negativo. Sin versalitas: se respeta la capitalización natural del habla, incluso cuando queda mal ("industria De servicio").
- **Paleta:**
  | Rol | Hex aprox. |
  |---|---|
  | Caja de subtítulo | `#000000`-`#0A0A0A` (opaco, sin blur) |
  | Texto de subtítulo | `#FFFFFF` |
  | Máscara de persona detectada | `#E8231E` a `#F01B12`, alpha ~0.75 |
  | Segunda clase (mochila) | `#1A2FD8` |
  | Etiqueta de duración (escena A) | `#25E03C` sobre negro |
  | Traza de recorrido (escena A) | `#5A3BE0` |
  | Madera del escritorio | `#8A5A32` |
  | Pared / luz de ventana | `#EDE9E0` |
  | Planta | `#8FBF4A` |

  La lectura importante: **un solo rojo saturado hace todo el trabajo semántico**. Rojo = "el sistema te está viendo". El azul aparece una vez y por eso significa "otra cosa". Es color usado semánticamente, no decorativamente.
- **Composición:** dos tercios inferiores = monitor en cuña entrando desde la izquierda. Tercio superior derecho = PiP. Tercio superior izquierdo = ventana + planta. Ese tercio de "respiro" es lo que impide que la pieza se lea como una captura de pantalla y la convierte en una escena.
- **Ritmo:** plano-secuencia. 0 cortes en 64,700 s. El pulso lo dan tres cosas: la mano que entra, el contenido que cambia en el monitor, y el bloque de subtítulo cada ~3,4 s (derivado).
- **Motion:** micro-handheld continuo (deriva de pocos píxeles por fotograma, estimado a ojo), acercamientos lentos al panel, PiP que flota. Cero animación sintética. Cero transición.
- **Textura:** moiré real del monitor filmado, reflejo de la ventana en el panel curvo, cables sueltos, teclado sucio, una silla gamer al fondo. Es textura de escritorio real. **Esa suciedad es el argumento**: si estuviera limpio parecería un render.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — patrón nuevo: **"plano-secuencia sobre pantalla, la mano hace el corte"**. Es la contracara barata de todo lo que tenemos ahí: cero motion, cero seams, y aun así el ojo no se va.
- `hermes-content/references/ui-patterns/` — el **lenguaje visual de "el sistema está viendo"**: máscara rellena + caja fina + label `clase N` + polilínea al piso. Es directamente portable a cualquier pantalla nuestra que quiera comunicar "esto se está procesando ahora" (el probador del chatbot, por ejemplo).
- Skill `editor-videos` — el patrón de subtítulo de 3 líneas con caja negra POR RENGLÓN (no el rectángulo único que solemos hacer).
- Skill `hyperframes` — si algún día queremos falsificar el overlay en HTML para un mockup, esto es la referencia de cómo se ve uno de verdad.

---

## Las tres preguntas

1. **Frente:** dos, y hay que no confundirlos.
   - **marketing** (+ `editor-videos` para el rodaje): el molde de 5 bloques y el plano-secuencia son adoptables tal cual, hoy, sobre una pantalla de ONIA Platform.
   - **onia-core / onia-platform**: acá el post no aporta código, aporta un **diagnóstico**. La capacidad "medir lo que pasa en el local físico" NO existe en el core (18 entidades, 9 módulos, ninguno de sensores ni de visión), y encenderla no es "encender un rubro": es un producto nuevo con infra nueva.
2. **Herramienta nuestra:**
   - Para el molde: **sí, completa.** `copywriting` + `marketing-psychology` para el guion, `editor-videos` para el corte y los subtítulos, `hyperframes` si hay que componer algo. Y la salida por WhatsApp del bloque 4 **ya la tenemos viva**: n8n + Chatwoot (memoria `chatwoot-canal-chatbot`) empujan mensajes a producción hoy. El remate más fuerte del reel es la parte que sí podemos cumplir.
   - Para el producto de visión: **no existe nada nuestro.** No hay capability de visión en ONIA Core, no hay ingesta RTSP, no hay modelo servido, no hay GPU. El VPS de Hostinger no está dimensionado para inferencia continua sobre streams.
3. **Qué falta:**
   - Para el molde: **nada.** Se graba hoy con un celular, el monitor y una cuenta de demo de ONIA Platform.
   - Para el producto: falta todo lo caro — una decisión de Sergio de si Onia entra a video-analytics (es un vertical nuevo, no un pack del core), un cliente real que preste su NVR, hardware de inferencia, y una postura legal sobre reidentificación por nombre en Bolivia. Eso es **BANCO**, no descarte: la idea es buena, el momento no.

---

## Lo que NO se puede afirmar

- **Qué modelo usan.** No se nombra ni en pantalla ni en el caption. La etiqueta `person N` es compatible con media docena de detectores; decir "es YOLO" sería fabricar.
- **Qué dice la voz.** Speaches falló para los 26 del lote. El sujeto habla los 64,7 s completos y no se transcribió. Todo lo citado arriba son **sus subtítulos quemados**, que él escribió — no una transcripción independiente.
- **Si el sistema existe o es un video renderizado una vez.** Nunca se muestra la aplicación: ni un dashboard, ni un login, ni una URL, ni un panel de configuración. Los 64,7 s son un archivo de video con overlays reproduciéndose a pantalla completa. Podría estar corriendo en vivo o podría ser un render de hace un mes.
- **Si las cámaras y los locales son de clientes suyos.** El `AMCREST` es la marca del DVR, no una firma de ellos. Las dos escenas podrían ser clips de demo públicos.
- **Qué significan "Anna 20 cups" o "1 hour 15 min".** Se leen los strings; no se dice qué los calcula ni con qué precisión.
- **Cifras de rendimiento, precio, plazo o clientes.** El post no da ninguna. No hay testimonios, ni logos, ni ROI. (Esto, para ser justos, es también lo mejor del post: cumple sin saberlo nuestra propia regla de "no fabricar".)
- **Cuánto de lo que promete está construido.** El bloque 3 promete siete tipos de industria y el bloque 4 promete integración de WhatsApp. Se ve UNA escena de minimarket y UNA de cafetería. El resto es afirmación.
- **Métricas del post.** No tengo likes, vistas, comentarios ni fecha de publicación: no se cosecharon.
