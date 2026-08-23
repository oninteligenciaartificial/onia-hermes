# POV 10.000 reels: el reveal por zoom-out sin un solo corte

- **Fuente:** https://www.instagram.com/p/DbtH7_nNRF0/
- **Tipo:** MIXTO (SaaS de fondo + MARKETING de forma + un patron WEB portable)
- **Veredicto:** SIRVE YA — por la FORMA, no por el contenido
- **Cobertura:** Lei 5 de 5 `base_*` y 16 de 36 `texto_*` (21 de 41 fotogramas), mas 5 recortes ampliados con ffmpeg. Lei el analisis nativo de Gemini. **Sin voz:** solo musica (Gemini oyo una cancion en frances; no la identifico). El texto en pantalla es uno solo y no cambia nunca.

## Que muestra, textual

**Caption (completo):**
> Life after getting 750m views every month

**Texto sobreimpreso (unico, fijo del primer al ultimo fotograma):**
> POV: you post 10'000 reels a day

**Texto de la interfaz filmada** (transcrito de los fotogramas, no parafraseado):

- Titulo de la app: `Fleet Control Center`
- Navegacion lateral, en orden: `Control Center` (activo, pill verde) · `Analytics` · `Automation` · `Schedule` (con chevron `>`) · `Store` · `App management` · `Account management` · `Router` · `Billing` · `Settings` · `Help & docs`
- Cabecera del panel: `Live devices` / `858 / 1000 online`
- Ventana secundaria a la izquierda: `operator@fleet.dev` (con chevron de selector de cuenta), link verde `View all`, un pie de grafico que termina en `not relative size.`, y una etiqueta de eje `Aug 5`
- Esquina inferior izquierda: `White mode` (parcialmente legible, parece un toggle de tema)
- Banner superior centrado, pildora oscura con CTA verde: **solo parcialmente legible.** Se distinguen `bulk`, `...is live` y el boton `Learn more →`. La lectura probable es *"New: bulk device provisioning is live"*, pero **no la afirmo palabra por palabra.**

En imagen: un dedo señala la pantalla de un monitor ultrawide curvo, a oscuras, donde corre una cuadricula de telefonos emulados. Cada telefono virtual tiene instaladas Instagram, TikTok, Facebook y YouTube. La camara retrocede y la cuadricula pasa de ~6 dispositivos a mas de 300.

## Como esta hecho — la reconstruccion

### El molde de marketing (lo mas valioso del post)

Segundo a segundo, y sin una sola palabra hablada:

- **0,0 s** — Ya estas adentro. Sin intro, sin logo, sin saludo. El primer frame es el plano **mas cerrado y mas confuso**: no se entiende que son esas pantallitas. La confusion es el gancho.
- **0,0 s** — El texto POV aparece de una y no se va nunca. El gancho es el **numero** (10.000), no el verbo.
- **0,0–0,5 s** — Un dedo señala. El dedo dice "mira ESTO" sin necesidad de voz. Es el sustituto barato de una locucion.
- **0,5–6 s** — Reveal continuo por escala. La pregunta "¿que son?" se responde sola y se reemplaza por otra mejor: "¿CUANTOS hay?".
- **6–8 s** — Quietud. Plano final del escritorio entero.
- **Cero CTA. Cero explicacion. Cero marca.** La mecanica de conversion **no esta en el video**: esta diseñado para que preguntes "¿que app es esa?" en los comentarios. La conversion ocurre en comentario -> DM.

El loop reengancha porque el ultimo frame (plano general) y el primero (close-up) son opuestos: al repetir, vuelve a empezar la confusion.

### El mecanismo de motion (lo que hay que copiar bien)

Un solo gesto, en **dos capas superpuestas que van en la misma direccion al mismo tiempo**:

1. La camara fisica hace un **dolly out real** (la mano se aleja del monitor).
2. Dentro del software, el usuario hace **zoom out del grid**. Se sabe que ocurre porque aparecen **mas filas y columnas**, no solo porque el monitor se achique.

Ese es el truco entero: **el zoom del contenido multiplica el de la camara**, y por eso el reveal se siente exponencial y no lineal. Curva aparente ease-out — los primeros ~2 s recorren casi toda la escala, despues desacelera, y **los ultimos ~1,5 s son quietud casi total** para que el ojo alcance a contar.

Es un caso puro de *una sola corriente* sostenida 8 segundos sin un corte, y de **motion causal**: el zoom del software CAUSA el reveal; no hay un keyframe arbitrario en ningun lado.

### La reconstruccion SaaS (entidades y maquina de estados)

De la navegacion se deduce el modelo de datos completo:

| Entidad | Estado / rol |
|---|---|
| `Device` (virtual) | online/offline. Agregado visible: `858 / 1000 online`. Cada tarjeta es una instancia con su propio home screen |
| `Account` | la cuenta de red social, **separada** del dispositivo. Un device aloja N accounts |
| `App` | IG / TikTok / Facebook / YouTube, instaladas por device |
| `Schedule` | cuando publica cada cosa (tiene submenu propio) |
| `Automation` | la receta de que se ejecuta |
| `Router` | asignacion de proxy/IP por device |
| `Store` | catalogo para aprovisionar |

Quien mueve los estados: `Schedule` dispara -> `Automation` ejecuta en el `Device` -> `Router` le da salida de red -> `Analytics` recoge el resultado.

**El nodo que delata que es una granja es `Router`**: si cada dispositivo no sale por una IP distinta, la plataforma los agrupa y los quema. Esa entrada de menu es la confesion del modelo de negocio.

### Contra ONIA Core

¿Existe la entidad? **Si, parcialmente.** Tenemos `agents` como noveno modulo del core y 11 agentes cableados con runtimes vivos por cron en ONIA Center. Lo que **no** existe es la **pantalla**: una vista de flota viva con grid denso y contador `X / Y activos`. Mismo patron de UI, aplicado a algo que si tenemos y que si es honesto de mostrar. *NO-VERIFICADO: no abri ONIA Center en esta sesion para confirmar que no exista ya algo parecido.*

### El limite: la forma se copia, el contenido no

El contenido de fondo —1.000 dispositivos emulados posteando 10.000 reels/dia— es spam industrial, y copiarlo choca de frente con dos cosas nuestras:

- El circuito de Instagram esta **vivo y sin bloqueos** desde el 18-ago. Una granja de dispositivos es exactamente el patron que hace que Meta queme cuentas. Es un activo que no conviene arriesgar.
- En nuestras cuentas la **etiqueta de IA es obligatoria**. Este modelo se apoya en lo contrario.

Este post es el caso de manual: **flojo (y toxico) de contenido, excelente de forma.**

## El estilo, como conocimiento portable

**Tipografia — dos, y no se mezclan.**
*Del reel:* sans geometrica Black (~peso 800), dos lineas centradas con quiebre manual despues de `10'000`, blanco puro, tracking levemente cerrado, altura de mayuscula ~4,5% del ancho de cuadro. Sin caja de fondo ni contorno duro: solo una sombra difusa que la despega del negro. Detalle fino: usa **apostrofo tipografico como separador de miles** (`10'000`, formato suizo), no coma ni punto. *No se dice que fuente es* — parece la de por defecto del editor de Instagram/CapCut; no lo afirmo.
*De la UI filmada:* sans de interfaz tipo Inter/Geist. Labels de nav ~13px peso 500, titulo de app ~15px semibold, `Live devices` ~18px semibold con su contador ~11px al ~55% de opacidad.

**Paleta — verde lima sobre negro, con disciplina de acento.**
Chrome `#0E0F10`–`#141516`; sidebar `#1A1B1C` con separador de 1px apenas visible. El verde aparece en **tres sitios y en ninguno mas**: logo `~#7BE86B`, pill del item activo `~#86E57F` (con texto casi negro encima), y links/CTA `~#5BFF4A`. Texto primario `#ECECEC`, secundario `~#8A8F8A`. En el panel de analytics, dos series que deliberadamente **no** son verdes: magenta `~#FF3D8B` y lavanda `~#B8A8FF`. Los device frames son un gradiente frio `#B9C6C9 → #C9CDDF`, cada uno con un punto de estado `~#4ADE55`.
*Todos los hex son aproximaciones de una pantalla filmada a oscuras con balance de blancos desconocido: sirven de direccion, no de spec.*

**Composicion.** Vertical 9:16, camara en mano contra un monitor ultrawide **curvo** en un cuarto oscuro. El monitor entra **en diagonal (~10-15 grados)**, nunca paralelo al marco: esa inclinacion es precisamente lo que impide que se lea como screen recording. Unica fuente de luz = la pantalla; el resto es negro puro con bloom en el borde. El texto vive en el tercio superior y **jamas tapa lo que quiere que mires**. Al final entra el escritorio claro (unico gris del cuadro) con teclado, telefono y mano en el mouse: eso ancla la escena en un lugar real.

**Ritmo de corte.** **Cero cortes en ~8 segundos.** Una sola toma continua. Es la decision de forma mas fuerte del video y la mas facil de copiar mal. El ritmo no lo da el montaje: lo da la aceleracion de escala, de ~6 dispositivos a 300+.

**Motion.** Ver arriba: dolly-out fisico + zoom-out interno, misma direccion, simultaneos, ease-out, con quietud final de ~1,5 s.

**Textura.** Grano digital alto por ISO. **Moire/aliasing** sobre el grid de pixeles del monitor: es un artefacto, y aca funciona como textura — es lo que hace que se lea "real, no renderizado". Bloom verde en los acentos, vineteo natural, rebote de la pantalla sobre el escritorio.

**Tratamiento del texto.** Un solo bloque, fijo, sin animacion de entrada ni de salida, presente del frame 1 al ultimo. Sin emoji, sin hashtag, sin CTA, sin marca. **El texto no se mueve mientras todo lo demas se mueve** — ese contraste es lo que lo hace legible en un plano que no para de cambiar de escala.

**Se porta a:**
- Motion (dolly-out + zoom-out interno en una sola corriente con quietud final) → `web-factory/docs/MOTION_PATTERN_BANK_2026.md`
- Patron de UI (grid denso de frames + contador de flota viva) → `hermes-content/references/ui-patterns/live-fleet-grid/`
- Esta ficha → `hermes-content/references/video-intake/`
- El molde de guion POV-reveal → carril marketing / motor de contenido
- La paleta verde-lima-sobre-negro **no** se porta a la landing (la v3 aprobada es base clara): va al banco de patrones y como opcion para superficies internas dark.

## Las tres preguntas

1. **Frente:** dos, y son distintos. **(a) INFLUENCERS IA / motor de contenido** — el molde de reel POV-reveal, portado a ONIA. **(b) onia-platform / ONIA Center** — el patron de pantalla "flota viva" aplicado a nuestros agentes, que ya corren por cron pero no tienen una vista que los muestre a todos vivos a la vez.
2. **Herramienta nuestra:** para el reel, **HyperFrames** (motor HTML→MP4, instalado y probado) + las skills `motion-doctrine` y `cut-the-curve`. **No hace falta Higgsfield ni nada pago**: este video no tiene un solo frame generado por IA, es filmacion directa de un monitor. Para la pantalla: `image-to-code` + `ui-ux-pro-max` + el pattern bank. Y la maquina de conversion que este molde necesita (comentario → DM) ya la tenemos viva y probada en produccion desde el 18-ago.
3. **Que falta:** para el reel, **nada** — se rueda hoy con un telefono contra un monitor, o se renderiza entero con HyperFrames. Para la pantalla de flota de agentes falta **una decision de Sergio, no una credencial**; y por regla, una superficie viva no se reemplaza sin que el VEA la pieza renderizada primero.

## Lo que NO se puede afirmar

- **Objecion del critico del lote (2026-08-23):** el salto “de ~6 dispositivos a **300+** en 8 s” no dice de donde sale el 300+ (contador en pantalla al 55% de opacidad, o conteo de celdas a ojo). Y la ficha **nunca nombra que producto esta filmado**, pese a portar su patron de UI a `ui-patterns/`. Antes de portarlo, nombrar el producto o declarar que no se identifica.
- Audio: **8 palabras en 9,0 s**, y son una alucinacion de Whisper sobre musica (devolvio frances). Tratar como sin voz.

- **Que software es: no se dice.** En pantalla se lee `Fleet Control Center` y `operator@fleet.dev`, pero **no verifique** que exista un producto en ese dominio. NO-VERIFICADO.
- **No se dice** si es un producto real, un mock construido para el video, o un prototipo con datos de demo. Los 1.000 dispositivos podrian ser una siembra.
- **No hay ningun prompt en pantalla:** no hay nada que *recuperar*. Todo lo que describo de estilo es **reconstruido a ojo** del video, y lo digo.
- **No se dice** con que se edito, ni la fuente tipografica, ni el modelo de monitor.
- **La musica:** Gemini oyo una cancion en frances. No identifico el track y no lo voy a nombrar.
- **El banner superior es solo parcialmente legible** (ver arriba). No transcribo lo que no leo.
- **El contador tiene una discrepancia sin resolver:** yo leo `858 / 1000 online` de forma consistente en los fotogramas nitidos (el tercer digito no es 100% seguro); **Gemini reporto `910 / 1000`**. No lo resuelvo — puede ser un dato vivo que cambia durante el video, o un error de lectura de cualquiera de los dos.
- **El caption "750m views every month" es una afirmacion del autor**, no verificada, y esa cifra **no aparece en ningun lado de la pantalla**.
- **No se el handle del autor:** no vi watermark en los 21 fotogramas que lei.
- **Los hex son aproximaciones** de una pantalla filmada en la oscuridad con balance de blancos desconocido.
