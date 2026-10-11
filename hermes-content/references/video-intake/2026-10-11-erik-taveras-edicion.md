# Erik Taveras: 3 reels nuevos (9 y 10-oct), edición medida y regla de aire muerto
Recepción: 2026-10-10 (pedido de Sergio Urcullo) · Análisis: 2026-10-11 (descargas hechas el 10-oct a las 23:2x, hora de la PC) · Tipo: 3 videos de TikTok de `@erik.py` (los mismos que publica en IG)
Fuente: https://www.tiktok.com/@erik.py/video/7695096021214350606 (E1, 10-oct), https://www.tiktok.com/@erik.py/video/7694748581311368461 (E2, 9-oct), https://www.tiktok.com/@erik.py/video/7694767352835034382 (E3, 9-oct). Instrucción de Sergio Urcullo: «seguí aprendiendo a editar… quiero que sigas viendo a Erik Taveras y el que te pasé su link, cómo editan» (literal; es para aprender, no para producir)
Acceso: parcial. Los 3 MP4 se bajaron (1080x1920, HEVC) y se miraron cuadro por cuadro; audio medido con ffmpeg y Whisper small local, **no escuchado**. No se vieron comentarios ni retención · Sesión/carril: subagente de la madre v2 (worktree `onia-madre-v2-pr-review-2d85bb`), carril edición/marca personal

Etiquetas: **observado** (visto en cuadros o medido con ffmpeg/OpenCV), **declarado** (lo dice el autor o los metadatos de TikTok), **inferencia** (mía, sin verificar), **propuesta** (para Onia). Colores = muestreo de cuadros, **aproximados**.

## Qué había y qué es nuevo

- Ya medido el 8-oct: 16 piezas hasta el 8-oct (`2026-10-08-referente-eriktaveras.md` §0.2) y la receta `erik.json`. Los 3 IDs de hoy se buscaron contra los 227 IDs de 19 cifras que cita el repo: **ninguno estaba**. No se duplica.
- Lo nuevo: E1 usa un sistema que la ficha del 8-oct no vio («corte del vídeo» con contador de YouTube); E2 y E3 son formatos sin panel (caminando y POV de pantalla).
- **Quedan sin estudiar** (mismos días, mismo canal; para la próxima pasada): `7695096023613476110`, `7695096043477749006`, `7695096069880810766` (hermanos de E1, 10-oct) y 5 de los 6 cortes del largo de los Mods del 8-oct (`7694138021590928653`, `7694138084979379470`, `7694138051986984206`, `7694138041891294478`, `7694138033993551118`; el sexto, `7694138035545459982`, ya estaba medido). No se afirma que usen el mismo sistema que E1: solo se leyeron sus títulos.

## Cobertura y límites

- Qué se miró: hojas a 2 fps con el segundo impreso (todo el video), 12 cuadros a 4 fps de los primeros 3 s, cuadros sueltos en cada salto, cortes con `scene` (0,30 y 0,20), diferencia de cuadros en el recorte de cámara, seguimiento del anillo rojo de neón del fondo de E1 con OpenCV (mide el zoom de la cámara aunque la cara se mueva), `silencedetect=-35dB:d=0.3`, `ebur128`, y los huecos entre palabras con tiempos por palabra de Whisper small.
- **Whisper atrasa el final de las palabras hasta 0,4 s** (trampa ya registrada en `edicion-referentes`): los huecos entre palabras son cotas mínimas. Por eso cada hueco se cruza con `silencedetect`.
- No observable: SFX y música. Los metadatos de TikTok dicen «original sound» en los 3 (**declarado**), eso no prueba que no haya cama. No se tocó el audio.
- Las vistas y likes son de los primeros 1-2 días y de TikTok (E1 2.398 vistas / 124 likes, E2 4.110 / 273, E3 1.990 / 93, al 10-oct): no validan ninguna regla.
- Tipografías: no verificables (sin CSS ni archivos de fuente). Todo lo dicho de familias es inferencia.
- No se instaló nada. No se usó sesión de ninguna red: descarga pública con `yt-dlp --impersonate chrome`.

## Números por pieza (observado)

| Pieza | Duración video / audio | Cortes duros (umbral 0,30) | Saltos de cámara que `scene` no ve | Plano de cámara más largo | Cambios de panel / capa | Palabras/s | `silencedetect` -35 dB d=0,3 | Hueco máx. entre palabras | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| E1 `7695096021214350606` («Mismo archivo, misma Mac», 10-oct) | 48,27 / 45,92 s | 0 | 2 (13,33 y 44,17 s) | 30,84 s | ~24-25 en 48 s (5,2 por 10 s) | 3,34 | 0 | 0,30 s | -13,8 |
| E2 `7694748581311368461` («Cada una en su carril», 9-oct) | 54,52 / 54,52 s | 2 (39,10 y 44,97 s) + 1 suave (10,47 s, 0,18) | n/a (camina) | 39,10 s | gráficos anclados al torso, ~1 nuevo cada 4-6 s | 2,62 | 4 (0,30 a 1,14 s; dentro del habla máx. 0,59 s) | 0,64 s | -20,0 |
| E3 `7694767352835034382` (POV de pantalla, 9-oct) | 24,23 / 24,23 s | 0 | 0 | 24,23 s | 0 (subtítulo manuscrito) | 2,62 | 8 (0,30 a 0,50 s) | 0,48 s | -20,7 |

Cortes por 10 s de cámara: E1 0,4 (los 2 saltos), E2 0,4 (los 2 duros), E3 0. La receta de septiembre pedía 3-5 cada 10 s: ya no vale para E1-E3 (Erik cambia de sistema cada 4-6 semanas, regla 14).

## Aire muerto: lo que hace Erik con las pausas (observado)

Esta tabla es la base de la **regla 15** de `edicion-referentes`. Sergio Urcullo se quejó de «mucho espacio en silencio» en el G1 de Lucía.

| Pieza | Huecos ≥0,3 s entre palabras | por 10 s | Hueco máx. | Suma de huecos ≥0,2 s | `silencedetect` (≥0,3 s) |
|---|---|---|---|---|---|
| E1 (10-oct) | 0 (el máximo es 0,30 s, a los 3,2 y 15,0 s) | 0,0 | 0,30 s | 1,0 s (2,3 % del habla) | 0 |
| E2 (9-oct, camina) | 11 | 2,1 | 0,64 s (20,2 s) | 6,1 s (11,5 %) | 4 (0,39 s a 21,3; 0,59 s a 39,6; 0,30 s a 46,5; 1,14 s a 53,4, cola final) |
| E3 (9-oct, POV) | 3 | 1,3 | 0,48 s (13,1 s) | 1,7 s (7,3 %) | 8 (0,30 a 0,50 s; el primero al arrancar y el último al final) |

- **E1 es la pieza más apretada y la más nueva**: audio de 45,92 s con 0 silencios de 0,3 s y una pausa máxima de 0,30 s. E2 y E3 (9-oct) dejan hasta 0,64 y 0,48 s: son las dos piezas sin panel, y E3 es la que menos rinde de las tres (1.990 vistas, no concluyente).
- **Cómo cubre E1 lo poco que queda de pausa** (observado):
  1. **Se corta la pausa**: los 2 saltos de línea de tiempo (13,33 y 44,17 s) caen a mitad de frase, con la voz continua, y justo cuando el panel se queda vacío 0,1-0,2 s (cuadros 13,3 y 44,2 s). Ver `img/2026-10-11-erik-corte-del-video-saltos.png`.
  2. **El panel nunca descansa**: ~24-25 cambios en 48 s. Intervalo típico 1,2-1,8 s; el más largo es la captura de terminal de 7 s (18,5 a 25,5 s), que tiene zoom y scroll internos (se ve un contenido distinto a 18,5 y a 20,0 s).
  3. **Número en pantalla pegado a la palabra**: la barra de «55» llega con la palabra «55» (dicha a 28,42-29,02 s, la barra pasa de 43,7 a 55,2 entre 28,5 y 29,0 s); el total «16 s» a 31,70-32,0 s; la barra de «144» (dicha a 33,68 s) crece de 121,4 a 143,6 entre 34,0 y 34,5 s; «24 GB» (dicho a 44,66 s) entra a ~44,5 s. Tolerancia de lectura: ±0,5 s (hojas a 2 fps).
  4. **El único silencio de más de 1 s es la tarjeta final**: el audio termina a 45,92 s y el video sigue hasta 48,27 s (2,35 s sin audio); la miniatura del largo con «Vídeo completo en mi canal» entra a ~46,0-46,3 s y ocupa los últimos ~2,0 s.
- Ni E2 ni E3 llenan las pausas con nada especial: cubre el cuerpo (E2 camina, con la cámara siguiéndolo) o la mano que señala (E3). Es el aire que Sergio Urcullo no quiere.

## Edición segundo a segundo (observado)

### E1 `7695096021214350606` (10-oct, 48,3 s): panel arriba, cámara abajo, «corte del vídeo»

- **Layout:** panel arriba de 0 a ~39 % del alto, fondo casi negro neutro (#0B0B0B, 11/11/11); cámara de ~39 a 100 %. Costura: línea gris fina con una **línea roja de progreso** (#FC0033) que se llena como la barra de YouTube. Arriba a la derecha de la cámara, un chip con el logo de YouTube y un **contador** `0:02 / 8:41`.
- **El contador es la clave.** Valores leídos en el cuadro: 0:02 (2 s), 0:13 (12 s), 0:14 (13,2-13,3 s), **6:53 (13,4-13,5 s)**, 6:54 (14 s), 7:01 (20 s), 7:12 (30 s), 7:18 (36 s), 7:23 (40 s), 7:27 (44,1 s), **8:28 (44,2-44,4 s)**, 8:30 (46 s). Es un tráiler de un largo de 8:41 armado con 3 tramos de la misma línea de tiempo (0:00-0:14, 6:53-7:27, 8:28-8:41) y los 2 saltos se avisan solos: el contador salta.
- **Cámara:** una toma continua por tramo, sin cambio de encuadre en los saltos (el anillo del fondo mide 0,154 del ancho antes y después). Tres zooms lentos de **×1,064-1,070, ~1,7 s cada uno**: 6,47-8,17 s, 33,90-35,63 s y 42,10-43,83 s; la entrada tarda ~0,4 s, la salida ~0,3 s. Los dos últimos empiezan en el número que se dice («144» a 33,68 s; «dos veces y media» a ~42,1 s).
- **Apertura:** 0,0-0,5 s una **tarjeta chica** con «Antes de comprar otro Mac para IA local», el logo de YouTube y «CORTE DEL VÍDEO 0:00 / 8:41»; entre 0,5 y ~1,0 s la tarjeta se abre hasta ocupar el cuadro (el anillo pasa de 0,061 a 0,154 del ancho). La voz arranca en 0,0 s. El primer subtítulo llega a ~1,2 s (antes, el título de la tarjeta lleva las mismas palabras).
- **Subtítulo:** sans bold, **minúscula y mayúscula**, 3-4 palabras por bloque, pegado encima de la costura (~37,5 % del alto). **Tres estados por palabra:** ya dicha en blanco #F6F6F3, **activa en menta #60E3B3**, por decir en gris #C2C2C1. Cambia cada ~0,5 s. En los tramos de Splash (41-45 s) la activa pasa a **salmón #D07D6B**, igual (±4) al salmón de la barra y del «2,6×» del panel (#D47B6A): en E1 el color de la palabra activa también sigue a la entidad que se nombra.
- **Panel (estados con su segundo, ±0,25):** 1,5 Apple + «+ GB» + «¿MÁS POTENCIA?» · 5,5-6,0 Apple → chip «EL PROGRAMA QUE LO EJECUTA» · 8,5 dos logos «MISMO MODELO · MISMA MÁQUINA» · 9,5 «=» · 11,5 dos barras «EXPERIENCIA DISTINTA» · 13,3 vacío (salto) · 14,0 «mlx-lm» · 15,5 + «Splash» · 16,0 «MOTOR DE MLX» · 18,5-25,5 captura de terminal «EN EL VÍDEO COMPLETO» · 26,5 «TOKENS POR SEGUNDO · MEDIANA DE 5» · 28,0-29,0 barra mlx-lm · 31,5 «TOTAL 16 s» · 33,5-35,5 barra Splash · 36,0 «6 s» · 37,5 «Splash» · 39,5 «ESTA CONFIGURACIÓN · ESTA TAREA» · 42,0 «2,6×» · 43,5 «143,6 vs 55,2 tok/s» · 44,2 vacío (salto) · 44,5-46,0 anillo «24 GB de 48 GB» · 46,3-48,27 tarjeta final.
- **Cierre:** a 46,3 s la tarjeta de miniatura del largo («IA LOCAL 2,6× MÁS RÁPIDA / MISMO MAC», cara y laptop) con «▶ Vídeo completo en mi canal». Dura 2,0 s con el audio ya terminado. No hay «comenta X». La pregunta de comentarios va en el pie (declarado): «¿Qué motor usas tú para correr modelos locales?».

### E2 `7694748581311368461` (9-oct, 54,5 s): camina y habla, gráficos pegados al cuerpo

- **Toma:** una sola, de pie, caminando por una sala de reuniones, con la cámara siguiéndolo (el fondo cambia 3 veces: mesa, pasillo vidriado, entrepiso). Sin panel. 2 cortes duros con zoom de recomposición: **39,10 s y 44,97 s** (la cara queda más grande, a ojo +15-25 %, no medido) y uno suave a 10,47 s (se corrige el encuadre; el subtítulo y los gráficos siguen).
- **Gráficos:** íconos con rótulo, anclados a la altura del torso (62-78 % del alto), que aparecen con la palabra. Un color por concepto: **n8n rosa, Claude Code naranja, Hermes violeta**. Secuencia: «?» + tres íconos (0,75 s) → «n8n ≠ Claude Code ≠ Hermes» (3,0-12,0 s) → «agente» con el rótulo mono «• TRABAJA AUNQUE NO ESTÉS» y una red de íconos (12,0-17,5 s) → «harness» «• EL ARNÉS ALREDEDOR DEL MODELO» (22,0-26,0 s) → Claude Code → n8n «• ESCRIBE EL FLUJO» y una cadena «• PROCESO» (30,0-36,0 s) → «procesos / asistente / desarrollo» (39-44 s) → triángulo «• JUNTAS» (49,5-54,5 s).
- **Subtítulo:** arriba, ~15 % del alto, minúscula y mayúscula, 1-4 palabras, **la palabra activa toma el color del concepto que nombra** (rosa para n8n, naranja para Claude Code, violeta para Hermes; menta en el resto).
- **Cierre:** sin tarjeta ni CTA. Termina con él mirando de lado y 1,14 s de silencio (53,41-54,55 s).

### E3 `7694767352835034382` (9-oct, 24,2 s): POV de pantalla con la mano

- **Toma:** celular en la mano apuntando a un monitor grande de pared con una terminal y su mano que señala; sin cara, sin título, sin cortes, sin CTA. La cámara se inclina (techo a pantalla a ~2,1 s, a ~19,4 s) y recompone con zoom.
- **Subtítulo manuscrito** (fuente tipo letra de mano, inferencia), blanca con sombra suave, **la palabra que se dice va grande** (~3-4 % del alto, a ojo) y las anteriores chicas; queda fija a ~71 % del alto (12 cuadros leídos entre 0,5 y 23,5 s), cerca de la mano. Sin color.

## Qué se aprende por dimensión

| Dimensión (las 12) | Hallazgo | Evidencia/localizador | Estado de evidencia | Regla transferible y límite | Skill destino + sección |
|---|---|---|---|---|---|
| Patrones | (1) Tráiler del largo propio con el contador de YouTube que avisa los saltos; (2) cada cifra dicha entra en el panel pegada a la palabra; (3) la pausa se corta y el panel no descansa | E1 chip 0:02→8:41, saltos 13,33 y 44,17 s; barras 28,5-29,0 y 34,0-34,5 s | observado (3 piezas de UN canal: candidato, no patrón probado) | Probar «corte del vídeo» en el primer largo de YouTube de Sergio Urcullo (regla 13). Límite: solo E1 usa el contador | `edicion-referentes`, «Erik, 9 y 10-oct» |
| Colores y paleta | Panel #0B0B0B; activa menta #60E3B3; dicha #F6F6F3; por decir #C2C2C1; progreso rojo #FC0033. E2: un color por herramienta (rosa, naranja, violeta) | Muestreo de píxeles de E1 a 2, 30 y 41,6 s; E2 solo a ojo en las hojas (sin muestreo) | observado, aproximado | En ONIA el verde es #10C26B y no se agregan colores por herramienta sin que `diseno-contenido-onia` lo decida. El rojo de YouTube sirve solo si el chip es de YouTube real | `diseno-contenido-onia` (propuesta); «Erik, 9 y 10-oct» |
| Tipografía | Sans bold de 3 estados para el subtítulo; mono en mayúscula para los chips del panel; manuscrita en E3 | Zoom de E1 a 2, 12, 30, 44 s; E3 0,5-23,5 s | inferencia (no hay CSS ni fuentes) | No copiar familias; decidir con `diseno-contenido-onia` | `diseno-contenido-onia` (pendiente) |
| Edición y montaje | E1: 0 cortes duros, 2 saltos escondidos en el vacío del panel, 3 zooms ×1,06-1,07 de ~1,7 s, ~24-25 cambios de panel en 48 s; E2 y E3 casi sin cortes | Tabla de números; hojas a 2 fps | observado y medido | **Regla 15 (aire muerto)** y «Erik, 9 y 10-oct». Límite: E1 es un tráiler de un largo ya editado; los saltos son 2 de una línea de tiempo que ya existía | `edicion-referentes`, reglas 3 y 15 |
| Estilo visual | Panel diseñado arriba con cámara abajo y costura de «reproductor»; en E2 gráficos que parecen estar en la sala | Cuadros 13,2-13,5 y 44,1-44,4 s (E1); 0,75-12 s (E2) | observado | El «reproductor» solo se usa cuando la pieza SÍ es un corte de un largo real. No fingir un contador | `edicion-referentes`; `diseno-contenido-onia` (idea) |
| Estructura de contenido | E1: promesa (0,0) → qué se compara (8-14 s) → condiciones iguales (18-27 s) → resultado con cifras (27-37 s) → veredicto con 2 números (37-45 s) → puntero al largo (46,3 s). E2: confusión → 3 definiciones → síntesis «juntas». E3: gancho de continuidad («¿Se acuerdan de los mods?») → 3 repasos | Transcripts Whisper small; hojas | observado | La estructura «misma condición → dos números → una frase» sirve para comparar herramientas con datos propios. Los resultados de Erik son **declarados**, no verificados | `edicion-referentes`; `onia-ventas-pauta` (si se compara producto) |
| Guion y gancho | E1: «Antes de comprar una computadora más potente para correr inteligencia artificial local, hay algo que te conviene revisar» en 0,0 s: decisión de compra + giro (no es el hardware, es el programa). E2: «Esto es algo que confunde a mucha gente» | Whisper 0,0-8,2 s (E1); 0,0-2,5 s (E2) | observado | Promesa y giro en la primera frase (coincide con la regla 1). No copiar frases ni cifras | `edicion-referentes`, regla 1 (ya existe) |
| Idioma y tono | Español neutro con tuteo: «te conviene», «puedes», «Déjame explicarte»; plural «se acuerdan» | Transcripts | observado | **No se traslada**: marca personal = vos; producto y clientes = usted | `diseno-contenido-onia` (sin cambio) |
| UI y UX | Solo el chip de reproductor y la tarjeta final con «Vídeo completo en mi canal» | E1 46,3-48,27 s | observado | Una pieza que es un corte de un largo cierra con la miniatura y a dónde ir, en ~2 s sin voz | `edicion-referentes`, «Erik, 9 y 10-oct» |
| Frontend | No aplica (las pantallas son terminales y gráficos de edición) | n/a | no aplica | n/a | n/a |
| Backend y arquitectura | No aplica. Las cifras de rendimiento de E1 (55,2 y 143,6 tok/s en MacBook Pro M5 Pro 48 GB, Qwen3.6-35B-A3B 4 bits) son del pie y del habla de la pieza | Pie de E1; Whisper 27-45 s | declarado, **no verificado** | No citar esas cifras como resultado propio. Un dato de rendimiento en una pieza de Onia se mide en Onia | n/a |
| Negocio y oferta | CTA a su largo de YouTube y una pregunta en el pie; sin «comenta X» en E1, E2 ni E3 | Tarjeta 46,3 s; pies de E1 y E2 (declarados por TikTok) | declarado | El CTA de recursos de Onia sigue siendo «Buscá PALABRA en Avisos». «Vídeo completo en mi canal» aplica solo a un corte de un largo | `edicion-referentes` (CTA ya adaptado) |

## Qué se toma y qué NO (propuesta, sin copiar identidad)

**Se toma (E1, el más nuevo):**
- Pausa entre frases ≤0,3 s y nada ≥0,3 s por `silencedetect` (regla 15).
- Un cambio de panel o de capa cada ≤2,5 s; la captura de prueba de 7 s con zoom o scroll interno.
- Saltos de cámara escondidos en el instante en que el panel cambia, a mitad de frase.
- Zoom lento ×1,06-1,07 de ~1,7 s en la cifra clave (una variante suave de los ×1,12-1,15 de la receta de septiembre).
- Subtítulo de tres estados (dicha / activa / por decir), 3-4 palabras, pegado sobre la costura.
- Si la pieza es un corte de un largo de YouTube: contador + línea de progreso + tarjeta final con miniatura.

**Candidatos, no adoptados:** el color por concepto de E2 (hace falta que `diseno-contenido-onia` lo permita dentro de verde, blanco y negro) y los gráficos anclados al torso (requieren caminar con la cámara siguiéndolo y rastreo de persona).

**No se copia:** su cara, set, sudadera, micrófono, tazón, la sala de reuniones, sus frases, sus cifras de rendimiento, el inglés/español neutro, E3 completo (POV con 8 silencios y sin título: es lo contrario de la regla 15) y E2 como ritmo (11 huecos de ≥0,3 s).

## Incorporación

- 2026-10-11: **regla 15 «Aire muerto»** agregada a `.claude/skills/edicion-referentes/SKILL.md` (lista de reglas medidas) y sección «Erik, 9 y 10-oct (11-oct)» tras «Lo que cambió en Santiago y Erik…». No se tocó `erik.json` ni `erik_edit.py` (el sistema vigente sigue pendiente de su pieza de prueba, ver 8-oct).
- No se contradice ninguna decisión de Sergio Urcullo. La regla 2 (pausa máxima 0,5 s) sigue como techo duro: la regla 15 pone el objetivo en ≤0,3 s.
- Propuesta no adoptada: color por concepto (E2).

## Prueba de uso por sesión

Estado: incorporado (regla en la skill; sin pieza aplicada)
Sesión + fecha: subagente de la madre v2, 2026-10-11
Tarea de cola: **Lucía G1 v2** (re-corte en curso por otro agente; la ruta del artefacto la fija la madre). No se editó ese video.
Regla usada: «Edición y montaje», regla 15 (aire muerto) y «Erik, 9 y 10-oct» en `edicion-referentes`
Artefacto: ninguno todavía
Verificación: cuando exista el render de G1 v2, medir `silencedetect=noise=-35dB:d=0.3` (objetivo 0), los huecos entre palabras con Whisper (≤1 hueco ≥0,3 s por 10 s, máximo 0,5 s) y hojas a 2 fps (algo nuevo cada ≤2,5 s). Revisor: la madre
Pendiente: aplicar en G1 v2 y anotar aquí el resultado con los números del render.

### Prueba de uso — aplicada y verificada (11-oct, madre v4)
- Artefacto: Lucía G1 v2 (`lucia-g1-v2.mp4`, local, git-excluido; 20,1 s, antes 56 s).
- Regla usada: `edicion-referentes` regla 15 (aire muerto ≤0,3 s) + receta Erik (corte seco, punch-in 1,00↔1,07, prueba bajo voz).
- Verificación: `silencedetect=noise=-35dB:d=0.3` → 0 silencios; hueco máximo medido 0,25 s; Whisper: las 7 frases en orden; -14,0 LUFS. Revisor: madre v4 (hoja de 8 cuadros mirada).
- Sergio Urcullo la aprobó («publicá G1 de Lucía», 11-oct ~04 UTC); publicación pendiente del token de IG de Lucía.
