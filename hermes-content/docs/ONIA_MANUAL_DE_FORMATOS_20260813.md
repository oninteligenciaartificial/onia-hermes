# Manual de formatos de video y carrusel — ONIA

*2026-08-13. Unifica las 6 anatomías parciales del corpus de `hermes-content/references/video-intake/`
(46 fichas + transcripciones). Es un manual para PRODUCIR: se abre, se elige un formato en la tabla
de decisión, se ejecuta la receta. Nada de lo que sigue pide investigar antes de filmar.*

---

## 1. Por qué existe este manual

En la primera pasada estos videos se midieron por **capacidad** ("¿nos enseña algo que no
tengamos?") y por esa vara el 40% salió HUMO. Esa vara medía otra cosa.

Medidos por **oficio** — cómo están hechos segundo a segundo, por qué el ojo no se va — casi
ninguno es humo. Un clip mudo de 6 segundos que no enseña una línea de código igual enseña
encuadre, cadencia y montaje; un cebo de comentario igual enseña cómo se construye un gancho.

Eso es justo lo que nos falta: el problema documentado del repo no es que no sepamos hacer, es
que **lo que producimos sale genérico** ([[web-factory-disenos-genericos]]).

Ningún veredicto viejo de las fichas aplica acá. Este documento reemplaza a las 6 anatomías
parciales `_formato-*.md`, que ya se borraron.

---

## 2. Tabla de decisión — elegí en 10 segundos

| Quiero... | Formato | Costo | Con qué se hace |
|---|---|---|---|
| **Frenar el scroll y decir a quién le sirvo** (posicionamiento por rubro) | **P01** Placa muda de alta densidad (12 s) | 0 cr · 1,5 h | `make-mockup.mjs` + `overlay-visuals.mjs` + grabación de pantalla de fondo |
| **Probar que entregamos** (portafolio, el cuello de botella del precio) | **P02** Antes/después wireframe→final (21 s) | 0 cr · 30 min | `capture-web.mjs`* + ffmpeg |
| **Probar que el software existe y se usa** | **P03** Demo de interfaz encadenada, muda (45-55 s) | 0 cr · 2-3 h | Grabación de pantalla + HyperFrames + `zoom-punch.mjs` |
| **Certificado de oficio para quien sabe mirar** (colega, CTO, sobrino asesor) | **P04** Componente en localhost (6-7 s) | 0 cr · 10 min/clip | `_reel.html`* + `film-pattern.mjs`* + Playwright |
| **Mostrar volumen** (que hay muchas piezas, no una) | **P05** Muro al ritmo, 1 pantalla/segundo (12 s) | 0 cr · 30 min | Capturas + ffmpeg `concat` |
| **Que me guarden el post** (autoridad por inventario) | **P06** Carrusel índice en capas (7 láminas) | 0 cr · 30-60 min | `carousel_render.js --pack dark-product` |
| **Construir portafolio serializado** ("Parte 7 de…") | **P07** Carrusel vitrina de componente (8 láminas) | 0 cr · 45 min | Capturas de `ui-patterns/` + `carousel_render.js` |
| **Captar y calificar al mismo tiempo** (que se autodiagnostiquen) | **P08** Lista-interrogatorio, 10 ítems (54 s) | 0 cr · 2,5 h la 1ª / 45 min después | Voz Lucía + `sync-plan.mjs` + placas |
| **Probarle a un técnico que el mecanismo es real** | **P09** Explicador con prueba de pantalla (74 s) | 0 cr · 2 h | Diagrama HyperFrames + 6 s de terminal real |
| **Explicar la plataforma entera a quien no la vio nunca** | **P10** Carta de capacidades (60-68 s) | 0 cr · 1 sesión | Grabación de pantalla + HyperFrames |
| **Vender con oferta al final** (reel de cabecera del perfil) | **P11** Portafolio largo 3 proyectos + galería + precio (36 s) | 0 cr · 45-60 min | Los PNG de P02 × 3 + `vstack` |
| **Vender la sensación** (arriba del embudo, sin leer nada) | **P12** Mockup a pantalla llena, corta en proceso (6,5 s) | 0 cr · 10 min | `_reel.html?marco=phone` — **flojo sin SFX** |
| **Alcance puro con lista rápida** | **P13** Ráfaga nombrada, 1 ítem/segundo (20 s) | 0 cr · 30-40 min | 1 HTML × N placas + `at` en segundos exactos |
| **Vender por honestidad** (decir el costo real que nadie dice) | **P14** Rant del número medido (43 s) | 0 cr · 1 h + medir | Voz o cara + placa que se llena |
| **Hablar con autoridad de un rubro sin tener cliente** | **P15** Caso de cebo + tesis propia (87 s) | 0 cr · 2-3 h | B-roll + voz + curva de densidad de rótulos |
| **Que se reconozcan en el problema** (el molde de más valor comercial) | **P16** Escenificación en 2ª persona, rotulada (27 s) | 0 cr · 1,5 h | Grabación del bot real + voz Lucía + rótulo fijo |
| **Publicar el guion como pieza aparte** (cebo de comentario) | **P17** Pantalla partida resultado/prompt (28 s) | 0 cr si el clip existe | HyperFrames, 2 tracks |
| **Presentar un caso con números** | **P18** Dossier con prueba de pantalla (70 s) | 0 cr · 2 h | **Bloqueado: no hay números propios auditados** |
| **Mostrar un sitio entero funcionando en contexto** | **P19** Producto en contexto (17 s) | 0 cr · 20 min | **Falta plantilla de laptop en escritorio** |
| **Prueba producida para un prospecto antes de que compre** | **P20** AD SPEC (21 s) | ~0,36 cr img + 2 gen **sin medir** | Seedance 2.0 + HyperFrames · **permiso de Sergio** |
| **"Grabalo con el celular y yo lo convierto"** | **P21** Video2Video INPUT/OUTPUT (41 s) | 1 gen **sin medir** | `video_references` · **permiso de Sergio** |
| **Explicar un método sin que parezca clase** | **P22** Dos que caminan, formato diálogo (45 s) | 3 gen **sin medir** | Soul Lucía · **1 sola cara en cuadro** |
| **Captar por comentario con código de regalo** | **P23** Cebo de código (6,7 s) | 0 cr filmarlo | **Motor bloqueado por S6** (token IG) |
| **Testimonio de cliente** | **P24** Confesión desde el mostrador (27 s) | 0 cr | **Bloqueado: cero clientes pagando** |

\* Los tres archivos marcados **no existen todavía** y se escriben una sola vez (§7).

**Regla de elección rápida:** si el objetivo es *probar*, va pantalla real (P02, P03, P04, P09).
Si es *captar*, va densidad y cadencia (P01, P05, P06, P13). Si es *vender*, va estructura con
cierre (P11, P15, P16). Si es *explicar*, va bloque con prueba pegada (P08, P10).

---

## 3. Los formatos, uno por uno

Ordenados por lo que más nos conviene producir primero: costo cero, sin bloqueos, con insumos que
ya están en el repo, y atacando el cuello de botella declarado (no hay portafolio, y por eso el
precio está en Landing 790 / Web Pro 1.500).

### Bloque A — se produce esta semana (0 créditos, cero bloqueos)

---

#### P01 · Placa muda de alta densidad (12 s, sin cara, sin voz)

**Ejemplar:** 8 industrias / 8 agentes, 11,6 s, mudo, 8 placas de ~1 s.
**Trabajo que hace:** vender posicionamiento sin producción. Es el que mejor le habla al comprador
A (dueño de negocio formal): cada placa está escrita desde su silla y termina en plata.

**Anatomía por segundos**

| s | Imagen | Texto/audio | Por qué |
|---|---|---|---|
| 0,0-4,0 | B-roll de fondo (pantalla trabajando), rótulo grande encima | `6 RUBROS = 6 automatizaciones necesarias`. Solo música | **El 34% del video es la portada.** Con placas de 1 s el gancho hace todo el trabajo de frenar el scroll |
| 4,0-12,0 | 6-8 placas a pantalla casi completa, ~1,0 s c/u, mismo b-roll de fondo. Estructura clonada: rubro → **4 dolores** → **1 solución con nombre** → mini-mockup al costado | Sin locución | 1 s es deliberadamente ilegible: la placa **no se lee, se reconoce**. Está construido para la pausa y el re-watch |
| todo | Firma fija abajo | `@onia…` | Cada pausa del espectador es una impresión de marca |
| — | No hay CTA ni placa final | — | La conversión es el perfil |

**Receta**

1. **El copy primero.** Una placa por cada uno de los 6 rubros vendibles (dental, comercio,
   importadora, estética, veterinaria, servicios), con los agentes que el módulo **ya tiene**.
   4 dolores en 2ª persona que terminen en plata o tiempo perdido; 1 línea de solución. La palabra
   "agente" aparece **una sola vez por placa**, en la solución.
2. Un solo HTML con `{{TITLE}}` / 4 dolores / `{{SOLUCION}}`, renderizado 6-8 veces:
   `node .claude/skills/editor-videos/scripts/make-mockup.mjs --template custom --html-file assets/html/placa-rubro.html`
   Fondo transparente, verde `#00D26A` como acento (60-30-10, nunca relleno).
3. **B-roll de fondo:** grabación de pantalla del ONIA Center o de un patrón de `ui-patterns/`.
   Propio, gratis, y encima es prueba de producto en vez de stock de escritorio.
4. `overlay-plan.json` con `at` en segundos enteros (1,0 s por placa; **1,5 s si quedan más densas
   que las del ejemplar**) → `node .claude/skills/editor-videos/scripts/overlay-visuals.mjs`.
   Portada: **4 s mínimo**.
5. Firma fija abajo en todas las placas.

**Costo:** 0 créditos, 0 voz. ~1-1,5 h, casi todo escribiendo los 24-32 dolores. La mejor relación
esfuerzo/resultado de todo el manual.

**Trampa:** copiar el dolor telefónico del ejemplar (su eje es un agente de voz que atiende el
teléfono; nuestro canal es WhatsApp/Chatwoot) · copiar sus cifras (91%, 3,7x, 482 leads: no tienen
fuente y no son nuestras — **la placa de ONIA va sin métricas** hasta que exista un caso real) ·
dejar el copy rioplatense sin pasarlo a uso boliviano.

---

#### P02 · Antes/después wireframe → final (21 s, mudo)

**Ejemplar:** web FIND real estate, 21 s, sin voz.
**Trabajo que hace:** **probar**. Prueba de trabajo, no explicación. Ataca directo el bloqueo
comercial: la línea premium (2.000 / 4.500) exige 3-5 casos mostrables.

**Anatomía por segundos**

| s | Imagen | Texto | Por qué |
|---|---|---|---|
| 0,0-4,0 (19%) | Wireframe gris, scroll corto y lento (~200 px/s) | Rótulo de 2 líneas: encargo del cliente + `ANTES` | El "antes" es corto a propósito: no es el producto, es la vara |
| 4,0→4,03 | **Corte seco de 1 fotograma.** Mismo encuadre, misma posición, mismo tamaño | Del rótulo cambia **una palabra**: `ANTES` → `DESPUÉS` | Todo el efecto vive acá. Si cambia el encuadre, el ojo pierde la comparación |
| 5,0-17,0 (60%) | La web terminada en scroll continuo y parejo (~323 px/s) | Rótulo idéntico | 3 de cada 4 segundos son producto |
| 17,0-21,0 | Footer, el scroll frena | Nada | El final del scroll es el final del video. No hace falta CTA |

**Ratio antes:después = 1:3**, no es opinable. Si el "antes" dura la mitad, el video pasa a ser
sobre lo feo.

**Receta**

```bash
# 1) los dos PNG. Mismo URL, misma resolución, la única diferencia es el flag
node scripts/capture-web.mjs https://<url> renders/antes.png --wireframe
node scripts/capture-web.mjs https://<url> renders/despues.png

# 2) los dos rótulos (cambia UNA palabra)
node .claude/skills/editor-videos/scripts/make-mockup.mjs --template quote \
  --out assets/rotulo-antes.png --width 900 \
  --title "Cliente: necesito una web para mi clinica" --subtitle "ANTES"
# idem --subtitle "DESPUES"

# 3) medir el PNG y sacar la velocidad
ffprobe -v error -select_streams v -show_entries stream=width,height -of csv=p=0 renders/despues.png
# alto_escalado = alto * 1080 / ancho
# px_por_segundo = (alto_escalado - 1320) / (duracion - 0,6)

# 4) mitad ANTES — 4,5 s a 200 px/s
ffmpeg -y -loop 1 -framerate 30 -i renders/antes.png \
  -f lavfi -i color=c=0x0A0F0D:s=1080x1920:r=30 \
  -loop 1 -i assets/rotulo-antes.png \
  -filter_complex "[0:v]scale=1080:-2,crop=1080:1320:0:'min(max(t-0.3\,0)*200\,ih-1320)'[site];[1:v][site]overlay=0:300[bg];[bg][2:v]overlay=(W-w)/2:110[v]" \
  -map "[v]" -t 4.5 -r 30 -c:v libx264 -pix_fmt yuv420p -crf 18 renders/antes.mp4

# 5) mitad DESPUES — 12 s a la velocidad calculada (acá 323)
#    mismo comando cambiando png, rotulo, 200→323 y -t 12

# 6) corte seco, sin recomprimir
printf "file 'antes.mp4'\nfile 'despues.mp4'\n" > renders/list.txt
ffmpeg -y -f concat -safe 0 -i renders/list.txt -c copy final/antes-despues.mp4
```

**Constantes del lienzo** (valen para P02, P05, P11):

| Cosa | Valor | Por qué |
|---|---|---|
| Lienzo | 1080×1920, 30 fps, H.264, `yuv420p`, `-crf 18` | 9:16 nativo |
| Captura | viewport 1440×900, `fullPage` | 1440→1080 es downscale 0,75: el texto queda nítido. Capturar a 1080 lo deja blando |
| Ventana del sitio | 1080×1320 en `y=300` | 300 px arriba para el rótulo, 300 abajo para el logo |
| Velocidad sana | 300-600 px/s | >700 = la página es demasiado larga para ese clip; <250 = se siente muerto |

**Costo:** 0 créditos. ~30 min la primera pieza, ~10 min las siguientes (cambiar URL y rótulo).

**Trampa:** cambiar el encuadre entre mitades (deja de ser comparación) · poner crossfade en la
costura · que el "antes" pase de un cuarto del video · publicar el sitio real viejo de un cliente
(va wireframe propio, siempre) · decir que usamos plantillas (confidencial, CLAUDE.md punto 8).

---

#### P03 · Demo de interfaz encadenada, muda, con SFX por operación (45-55 s)

**Ejemplar:** Higgsfield Layers, 55 s, sin voz (Whisper devolvió un solo token).
**Trabajo que hace:** **probar que una interfaz existe y se usa.** Es el formato de portafolio de
software y el que mejor nos calza: no necesita cámara, ni voz, ni créditos.

**Anatomía por segundos**

| s | Imagen | Audio/texto | Por qué |
|---|---|---|---|
| 0-5 | Apertura de marca sobre fondo liso | Música. Nombre de la pieza | 5 s de branding antes de tocar el producto: fija de quién es |
| 5-16 | **Demo 1 (11 s):** una acción → aparece el resultado → chip corto → aparece el elemento | **SFX de clic/tecleo/destello en CADA operación** | ~2 s por operación. El SFX es lo que hace legible una acción de 1,5 s |
| 17-40 | **Demo 2 (23 s), la larga:** 6-8 operaciones encadenadas sobre **el mismo elemento**, que nunca se corta a otro plano | Sigue música + SFX | La continuidad es la prueba de que es la misma pieza |
| 40-51 | **Demo 3 (11 s), con payoff:** la que termina en algo que se disfruta | SFX + golpe final | Las tres van de menos a más. Termina en alto, no en un menú |
| 52-55 | Pantalla lisa | CTA seco de una línea | 3 s |

**Receta**

1. Grabación de pantalla (gratis) del ONIA Center en **producción** o de los 6 patrones de
   `hermes-content/references/ui-patterns/`. **Grabar a 60 fps**, entregar a 30 con `-r 30` recién
   en el master.
2. `node .claude/skills/editor-videos/scripts/normalize-source.mjs --video raw/pantalla.mov --out raw/p.mp4`
3. Chips y rótulos **en código**: HyperFrames (`node scripts/hyperframes/render.mjs --comp tag|keyword`)
   → `node .claude/skills/editor-videos/scripts/overlay-visuals.mjs --video … --plan overlay-plan.json`.
   El prompt/acción se escribe como **chip corto con `+` adelante** (`+ agenda el turno`): se lee
   en medio segundo. Un chip de párrafo no se puede filmar.
4. `node .claude/skills/editor-videos/scripts/zoom-punch.mjs` en cada clic.
5. SFX: `sfx.mjs` **hoy no corre** (§5) → publicar mudo y poner el audio en la plataforma.
6. `master.mjs` sólo si la pieza terminó con pista de audio.

**Detalle que no se puede saltear:** los nombres de los elementos en pantalla tienen que ser
**visibles y humanos**. El panel lateral es el que cuenta la historia, no la imagen.

**Costo:** CERO. Ni créditos, ni voz, ni permisos. Sólo tiempo (~2-3 h).

**Trampa:** filmar una UI detrás de un flag apagado o en una rama sin mergear (regla del repo:
construido ≠ terminado; **cada plano sale de producción**) · grabar a 30 fps una UI que anima a 60
(se ve entrecortada) · dejar esperas largas sin cortar con ffmpeg · meter voz explicando lo que ya
se ve.

---

#### P04 · Componente en localhost (6-7 s, mudo, con código legible)

**Ejemplares:** dropzone con progreso (7,1 s) · checkout con tarjeta 3D (5,9 s).
**Trabajo que hace:** **probar oficio.** Certificado de 6 segundos: no afirma nada, muestra una
cosa funcionando y el código que la hace funcionar. Ninguno de los dos ejemplares tiene CTA.

**Anatomía por segundos** (medida sobre el dropzone)

| s | Imagen | Audio | Por qué |
|---|---|---|---|
| 0,0-0,3 | El cuadro **ya está armado**: chrome de navegador falso con `localhost/<ruta>`, rótulo `COMPONENT <nombre>`, componente vacío arriba, tira de código abajo | Sin voz | Cero intro. El primer cuadro ya dice qué es y que corre de verdad |
| 0,3-2,0 | El gesto: se sueltan 4 archivos / se tipea el número de tarjeta | Un pop por evento | El gesto arranca antes del segundo 1. Ni un cuadro quieto de más |
| 2,0-5,5 | **El estado intermedio ocupa la mitad del clip**: cada miniatura se revela, el contador va `0 of 4` → `4 of 4` | Tono de confirmación por ítem | **Esto es el video.** La carga no es una transición de 0,3 s: es el contenido |
| 5,5-7,1 | Estado final quieto ~1,5 s | Último tono | El final se sostiene para que al loopear no se sienta cortado |

**Receta**

1. Servir: `npx serve hermes-content/references/ui-patterns` (queda en `:4321`).
2. Armar el cuadro **de una sola pieza** con `_reel.html` (§7): rótulo fijo arriba, `<iframe>` con
   el patrón entre y=10% y y=62%, `<pre>` abajo con 12-16 líneas del propio `index.html`, cursor
   sobreimpreso (`window.cursorTo(x,y,ms)` / `window.cursorTap()`).
   Cursor según la skill `oversized-cursor`: ~7cqw (76 px en 1080), cuerpo blanco + trazo negro,
   `drop-shadow(0 4px 6px rgb(0 0 0 / .3))`, entra **desde fuera del cuadro** (`top:115%`) en un
   solo deslizamiento de 0,4-0,9 s con `power3.out`. Nunca aparece con fade en el lugar.
3. Filmar con `film-pattern.mjs` (§7). Coreografía por patrón, con los tiempos **reales** del
   propio archivo:

| Patrón | Qué se toca | Espera real | Toma |
|---|---|---|---|
| `upload-button` | `.ub` (un clic) | `busy` = 2600 ms fijos | ~5,5 s |
| `checkout-card` | `#cc-numero` (`delay:55`), `#cc-venc`, `#cc-cvc` (flip 0,95 s), submit | `Authorising` = 2400 ms | ~9 s → se recorta a 7 |
| `floating-cart` | `.fc-add` ×2, `#fc-fab` | `<dialog>` entra 0,5-0,75 s | ~7 s, dos actos |
| `dropzone-progress` | `#dz-demo` | `setInterval` 420 ms, paso `0,07+random(0,13)` | ~7 s |
| `chat-widget` | `#cw-launcher`, un chip | bot responde a 1200 ms | ~6 s |
| `sidebar-nav` | `#sb-abrir`, dos `summary` | `<details name>` cierra el otro solo | ~7 s |

4. Cerrar: `ffmpeg -ss 0.3 -i renders/raw/<x>.webm -t 6.8 -r 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -an renders/clip.mp4`
   (`-ss 0.3` come el cuadro en blanco del arranque de Playwright).

**Detalles que no se negocian:** el rótulo **no se mueve y no se va** (en un clip mudo es la única
voz) · **un solo gesto por clip** (el resto de la demo existe y no se filma) · el `localhost/<ruta>`
del chrome falso son 20 px que cambian la lectura completa · el gesto va lento: 0,4 s no se lee,
0,6-0,9 s sí (`ui-patterns/APRENDIZAJE_WEBS.md` §2).

**Los comentarios del código son el copy.** Ya están escritos en nuestros archivos
(`upload-button/index.html`: *"Las 3 etiquetas apiladas: solo una visible. Nada salta de layout"*).
No hay que inventarlos.

**Costo:** 0 créditos. ~2 h la primera vez (escribir los dos archivos), después **~10 min por clip**.

**Trampa:** el rótulo en idioma de dev. `COMPONENT Dropzone / HTML CSS JS` le habla a un
desarrollador; nuestro comprador es el dueño de negocio. **Misma toma, dos rótulos**: para colegas
va el técnico; para el dueño va el resultado en su idioma ("subí las 200 fotos del catálogo de una
vez") **y se saca la tira de código**, que a él no le dice nada y le come el 35% del cuadro.

---

#### P05 · Muro al ritmo — una pantalla por segundo (12 s, mudo)

**Ejemplares:** portafolio de emails (12,4 s, 9 mockups) · montaje de maquetas (7,7 s, 5 piezas).
*Estos dos venían como formatos separados en dos parciales distintos; es el mismo formato y acá va
unificado (ver §6).*

**Trabajo que hace:** **vender volumen.** No prueba un caso, prueba que hay muchos.

**Anatomía por segundos**

| s | Imagen | Texto | Por qué |
|---|---|---|---|
| 0,0-2,0 | Placa de encuadre (fondo de marca, sin movimiento) | Una línea que dice de qué va + el CTA | **El CTA está en el segundo 0, no al final.** El video puede cortarse en el 5 y el mensaje ya se entregó |
| 2,0-11,0 | N pantallas a cuadro completo, **exactamente 1,00 s cada una**, corte seco. Cada una con deriva mínima de 60-90 px | Solo música | La densidad ES el argumento. 9 pruebas en 9 segundos vencen a cualquier frase sobre experiencia |
| 11,0-12,0 | Placa de cierre **idéntica en estilo a la de apertura** | CTA repetido | Enmarcan el montaje; sin eso son N imágenes sueltas |

**Por qué 1,00 s exacto:** a 120 BPM (el pulso de casi todo el pop latino) un beat dura 0,5 s, así
que una grilla de 1,00 s cae en el beat cada dos tiempos con cualquier tema de ese tempo. Ahí está
el truco de por qué "una por segundo" suena montado a la música sin haberla tenido al montar.
Si el tema es otro: `duración por pantalla = 120 / BPM` (100 BPM → 1,2 s; 140 BPM → 0,857 s).

**Receta**

```bash
# 1) una captura por pantalla (con los ui-patterns va ruta file://)
node scripts/capture-web.mjs https://<rubro-dental> renders/p1.png
node scripts/capture-web.mjs file:///C:/dev/.../ui-patterns/checkout-card/index.html renders/p2.png

# 2) un clip de 1,00 s por pantalla, con deriva de 80 px
for i in 1 2 3 4 5 6 7 8 9; do
  ffmpeg -y -loop 1 -framerate 30 -i renders/p$i.png \
    -f lavfi -i color=c=0x0A0F0D:s=1080x1920:r=30 \
    -filter_complex "[0:v]scale=1080:-2,crop=1080:1320:0:'min(t*80\,ih-1320)'[s];[1:v][s]overlay=0:300[v]" \
    -map "[v]" -t 1 -r 30 -c:v libx264 -pix_fmt yuv420p -crf 18 renders/c$i.mp4
done

# 3) placas de 2 s (apertura) y 1 s (cierre) + concat -c copy
```

**Detalles:** cada pantalla se muestra **en su punto más vendedor** (titular arriba y CTA visible
en el mismo cuadro), no en un scroll cualquiera · **ninguna pantalla está quieta** (sin la deriva
son diapositivas y se lee como carrusel exportado a video) · **la primera pantalla es la mejor**
(el segundo 3 decide si el resto se ve) · cero transiciones.

**Costo:** 0 créditos. ~30 min con las pantallas ya elegidas.

**Trampa:** **rellenar para llegar a nueve** — si hay seis pantallas distintas, el muro dura 6
segundos; repetir vistas casi iguales se nota en el acto y arruina el único argumento del formato ·
mostrar marcas ajenas como si fueran cartera (el ejemplar muestra Nike y Zara sin aclarar nada:
nosotros no podemos, choca con "no fabricar") · cortes de 1,5 s o irregulares.

**Lo que NO podemos copiar:** los 2 s de persona real a cámara del original. El reemplazo es la
placa de encuadre, que cumple la misma función y encima deja el texto legible sin audio. Meter a
Lucía ahí gastaría créditos para **empeorar** el formato: sumaría una cara de IA justo donde el
argumento es "esto es trabajo real".

---

#### P06 · Carrusel índice en capas (7 láminas)

**Ejemplares:** 42 skills de diseño (7 láminas) · 10 frameworks de marketing (17 láminas).
**Trabajo que hace:** **probar y captar guardado.** Entrega un inventario tan completo que
guardarlo es más barato que reconstruirlo.

*Sobre los segundos: un carrusel no tiene duración fija, la marca el pulgar. Las permanencias de
abajo (1,5-3 s por lámina, 2-4 s la portada) son un **supuesto declarado** para dimensionar
densidad de texto, no un dato medido. Techo de lectura: 3-5 palabras/s en pantalla chica = **6-12
palabras de titular** o **6-10 líneas cortas**.*

**Anatomía por láminas**

| Lámina | Imagen | Texto | Por qué |
|---|---|---|---|
| L1 portada (2-4 s) | Fondo plano, contraste alto, **sin lista** | **La frase-problema, no el índice** | La portada vende el dolor. Si mostrara la tabla, el que "ya sabe del tema" sigue de largo |
| L2 (2-3 s) | Primera tabla: encabezado de capa + 10 filas | nombre en monoespaciada + 1 línea de función | Densidad máxima ya en la 2ª lámina: confirma que el inventario es real |
| L3-L6 | Misma plantilla, cambia el encabezado de capa | capas de 10/8/10/8/6 ítems | **La capa es la unidad de swipe.** 42 en una lámina es ilegible; 42 en 42 láminas nadie lo termina |
| L7 cierre (2 s) | Lámina de texto, sin tabla | CTA de una palabra | Corta la densidad de golpe |
| Caption | — | Repite la tesis + el trigger, **declara el origen de la lista** | El caption sostiene la credibilidad, no duplica las 42 |

**Detalles:** el número va en el titular y es grande y específico (42, no "muchas") · una fila =
nombre corto + una línea · **la agrupación tiene nombre propio** ("capa 1 · Frontend y UI"): sin el
rótulo son 42 ítems sueltos, con rótulo son 6 ideas · máximo 10 filas por lámina (a 12 la fuente
cae por debajo de lo legible en teléfono).

**Receta**

```powershell
# 1) brief a mano en hermes-content/carousels/briefs/onia-<slug>.json
#    NO usar carousel_generator.py (pide Python + OPENAI_API_KEY; la PC de Sergio no tiene Python)
#    Campos: headline, body, pill, callout, role, save_worthy, object, cta + title/caption/hashtags
#    Roles: cover -> stakes -> point×N -> save (obligatoria) -> cta
npm run carousel:render -- --brief hermes-content/carousels/briefs/onia-<slug>.json `
  --out hermes-content/carousels/out/onia-<slug> --account onia --pack dark-product

# 2) aprobación antes de publicar (el equivalente carrusel a la tabla de cortes)
node scripts/carousel_contactsheet.js --dir hermes-content/carousels/out/onia-<slug> --cols 4 --title "<tema>"

# 3) sólo con aprobación literal ("Apruebo publicar <carrusel>")
npm run carousel:publish -- --brief <brief.json> --dir <dir> --account onia
```

**`--pack dark-product` no es opcional:** el pack por defecto es `typographic` y **todavía imprime
el contador `01/07`** (`scripts/carousel_render.js:161,167,178`), que viola la regla del sistema y
la regla explícita de Sergio. Correr `npm run carousel` sin `--pack` saca el contador impreso.

**Inventario propio que ya da para este formato, sin investigar nada:** las 18 entidades + 9
módulos + 11 rubros de `onia-core/contract.json`; los 11 workflows n8n en vivo; los packs y cuentas
del propio sistema de carruseles.

**Costo:** 0 créditos. ~2-4 min de máquina para 7 láminas; el trabajo real es escribir el brief
(30-60 min si el inventario ya existe). Necesita internet al renderizar (Space Grotesk + Inter).

**Trampa:** el inventario tiene que ser **nuestro y verificado** — el de 42 skills funciona porque
el autor cruzó nombres reales, y cuando nosotros hicimos lo mismo encontramos que 18 de 42 ni
existían acá. Publicar una lista sin cruzarla es fabricar. Segunda: la portada con la tabla.

---

#### P07 · Carrusel vitrina de componente (8 láminas, serializado)

**Ejemplares:** React Sidebars "Part 16" · chat de mensajería HTML/CSS/JS.
**Trabajo que hace:** **probar oficio y capturar DMs.** Es el único de los carruseles que
construye portafolio, porque lo que se ve **es** el trabajo. Y es el que ya tenemos armado y no
estamos usando: `ui-patterns/` tiene 6 componentes propios corriendo = 6 entregas de una serie que
hoy no existe como contenido.

**Anatomía por láminas**

| Lámina | Imagen | Texto | Por qué |
|---|---|---|---|
| L1 (2-3 s) | La pieza terminada, completa, en su mejor estado | Nombre + **número de serie** ("Parte 3") | El número de serie es el activo real: dice "hay 2 antes" sin decirlo |
| L2-L7 (1,5-2,5 s) | **Estados y zooms de la misma pieza**: reposo, hover, activo, error, variante oscura | Poco o ningún texto; el texto tapa lo que se vino a ver | El swipe funciona como animación cuadro a cuadro. No hay que entender nada |
| L8 (2-3 s) | Repite la pieza completa | **Los ingredientes** (tipografías, iconos, pack) + CTA | Listar los ingredientes es la prueba de que está hecho de verdad |
| Caption | — | Ingredientes + condiciones | Escasez acotada concentra el pedido en el día de mayor alcance |

**Detalles:** **una sola pieza, muchos estados** (la tentación es meter tres componentes; el formato
vive de lo contrario) · el texto se corre del centro · **los ingredientes al final, no al principio**
· la serie numerada hace el trabajo pesado.

**Receta:** capturar los estados (screenshot del componente corriendo, costo cero) → brief con las
capturas como `object` por slide → `--pack dark-product` (fondo oscuro: la captura de UI queda como
lo único claro de la lámina) → hoja de contactos → aprobación.
**Variante animada:** el componente ya es HTML, así que **HyperFrames** lo renderiza moviéndose de
verdad y sale un Reel además del carrusel (es el caso exacto para el que sirve el motor).

**Costo:** 0 créditos. ~45 min la primera entrega, media hora las siguientes.

**Trampa:** que se lea como portafolio ajeno — sólo tiene sentido si el componente es **el que
usamos en algo real**, con la captura sacada de lo que corre · **cadencia**: una serie que se corta
en la parte 3 vale menos que no haberla empezado, porque el número de serie era todo el argumento ·
**no copiamos la entrega de código por DM** (depende de permisos de mensajería de IG que no están
verificados): el cierre manda al contacto propio o el código va público y el CTA sólo lo anuncia.

---

### Bloque B — 0 créditos, con voz de Lucía o más armado

---

#### P08 · Lista-interrogatorio (54 s, 10 ítems, ~4,5 s/ítem)

**Ejemplar:** 10 errores de seguridad en apps con IA, 54,1 s.
**Trabajo que hace:** **captar y calificar a la vez.** No enseña: hace que el espectador se
autodiagnostique mientras mira. El que se pone nervioso en el ítem 3 ya es un lead.

**Anatomía por segundos**

| s | Imagen | Audio/texto | Por qué |
|---|---|---|---|
| 0-4 | Rótulo grande arriba | Desafío + **permiso para fallar**: "…versión principiante" | Sin el permiso, el que tiene 3 de 10 abiertos cierra en el segundo 6 |
| 4-8,8 | Infografía del ítem 1. Índice `1. <tema>` | **"¿A, o B?"** | El primer ítem es el más barato de entender: enseña la mecánica con el caso fácil |
| 8,8-41,5 | Una infografía nueva por ítem, **siempre con dos capas de texto**: índice arriba + pie que explica el gráfico | Ítems 2-8, todos con la misma forma, con un beat de 0,2-0,4 s entre uno y otro | La repetición exacta de la estructura deja mirar 8 cosas distintas sin esfuerzo. El beat es donde aterriza el número |
| 41,7-49,4 | Ítems 9 y 10 | Los dos en una bocanada de 7,7 s, sin beat | **Se le acabó el tiempo**: es el defecto visible del ejemplar, no una decisión. Nosotros presupuestamos 4,5 s × N desde el guion |
| 49,7-53,6 | Cierre | CTA de una palabra, minúscula, sin acentos | Fricción cero para tipear |

**La regla dura del formato:** cada ítem es una **pregunta binaria**, nunca una afirmación. Si un
ítem no se puede escribir como "¿A, o B?", **no entra en la lista**. Ese filtro es el 80% de la
calidad. El contraste A/B enseña la respuesta correcta sin enunciarla.

**Receta**

1. Guion en tabla antes de tocar nada: `N | pregunta binaria | apoyo visual`.
2. Voz: `node .claude/skills/editor-videos/scripts/tts-elevenlabs.mjs` con la voz de Lucía
   (Marcela, es-LATAM — ver §6, punto 2). **Las pausas se escriben en el texto**: el beat entre
   ítems se produce en el guion, no en el montaje.
3. Timestamps palabra por palabra: WAV → `.claude/skills/ver-videos/scripts/transcribe.sh`
   (Speaches, gratis, **forzar `Systran/faster-whisper-small`**) → `scripts/segments.json`.
4. Las 10 placas: **un** HTML con `{{TITLE}} {{SUBTITLE}} {{LABEL}}`, renderizado 10 veces con
   `make-mockup.mjs --template custom --html-file`. Ahí está el ahorro real. Placa que tiene que
   animarse → `scripts/hyperframes/render.mjs --comp stat|browser`.
5. `sync-plan.mjs --segments … --storyboard …` con el cue en la palabra clave de cada pregunta
   (`{cue:"backend", asset:"assets/p02", until:"next"}`). Lo que no machea se reporta **SIN
   SINCRONIZAR** — nunca inventa un tiempo.
6. `overlay-visuals.mjs` → `karaoke-captions.mjs` → `master.mjs` **siempre al final**
   (−14 LUFS / −1,5 dBTP, o el video suena 6 dB más bajo que el de al lado).

**Costo:** 0 créditos. ~750 caracteres de ElevenLabs (de ~69k mensuales). ~2,5-3 h la primera pieza,
~45 min a partir de la segunda.

**Trampa:** ítems que no son contraste real (la pregunta queda retórica y quedan 10 sustantivos con
gráfico) y, la que importa: **este formato acusa, y por lo tanto expone.** La ficha del ejemplar
dice que 3 de esos 10 puntos estaban abiertos en nuestra producción. **El formato se publica
después de cerrar lo que enumera, nunca antes.**

---

#### P09 · Explicador de un mecanismo con prueba de pantalla (74 s)

**Ejemplar:** AI loops / code review, 73,8 s, un solo concepto en 5 bloques.
**Trabajo que hace:** **probar.** Es el de mayor autoridad para el comprador técnico, y toda su
credibilidad descansa en **6 segundos de captura real de terminal**.

**Anatomía por segundos**

| s | Imagen | Audio | Por qué |
|---|---|---|---|
| 0-5,5 | **El diagrama completo del mecanismo ya en pantalla** (5 cajas encadenadas) | La tesis, entera | **Regala el contenido en el segundo 1.** Lo contrario del clickbait: el que quiere eso se queda porque ya vio que hay sustancia |
| 5,7-21,8 | Recreación del dolor: interfaz de chat con prompts manuales que no funcionan | "…tenés que estar todo el tiempo aprobando" | **El dolor va antes de la solución y dura 16 s (22%)**, y está dramatizado en pantalla, no contado |
| 22-34,6 | **Plano sin ningún overlay** | La definición, limpia | El único tramo sin gráfico es donde va la definición. **Silencio gráfico = énfasis** |
| 35,1-49,5 | Iconos secuenciales en el orden exacto de las palabras | El mecanismo | La narración es la timeline |
| 49,5-67,5 | **56-62 s: corte a captura real de terminal**, comandos legibles | El comando concreto | **Los 6 s que sostienen el video.** Es lo único que no se puede fabricar |
| 67,9-73,6 | Cierre, subtítulos resaltando la palabra del CTA | CTA | Redundancia deliberada: gesto + palabra resaltada |

**Receta**

1. **La captura tiene que ser NUESTRA y real.** Ventaja estructural: filmamos `cut-plan.mjs`
   imprimiendo la tabla `# | Me quedo con | Tiro | Por qué`, la cola de aprobación del panel con un
   corte pendiente, `sync-plan.mjs` reportando "SIN SINCRONIZAR", el subagente `code-reviewer`
   corriendo. Gratis, y casi nadie en el nicho puede filmar su propio pipeline.
2. Diagrama del segundo 1: HyperFrames, 5 cajas encadenadas. **Dibujado en código, no generado**
   (la IA erra la letra).
3. Recreación del dolor: `make-mockup.mjs --template phone|browser` con el chat falso. Barato, y es
   el bloque que más retiene.
4. Voz → `transcribe.sh` → `sync-plan.mjs` → `overlay-visuals.mjs` → `zoom-punch.mjs --auto` →
   `karaoke-captions.mjs` → `master.mjs`.
5. **Un solo concepto por pieza.** Si hay 3 mecanismos, son 3 videos.

**Costo:** 0 créditos, ~1.700 caracteres de voz, ~2 h (de las cuales ~40 min son montar la captura
que valga la pena filmar).

**Trampa:** **vender como método propio algo que viene incluido.** El ejemplar hace exactamente eso
(`/code-review` es nativo de Claude Code). Nuestra versión sólo tiene sentido si la pantalla muestra
**nuestro pipeline real corriendo**.

---

#### P10 · Carta de capacidades (60-68 s)

**Ejemplar:** anuncio oficial de Higgsfield/Seedance, 67,6 s.
**Trabajo que hace:** **explicar y vender un producto entero a quien no lo vio nunca.** Es el video
de portada de la plataforma.

**Anatomía por segundos**

| s | Imagen | Texto | Por qué |
|---|---|---|---|
| 0-10 | **Cold open**: el producto haciendo algo, sin explicar nada | Titular fijo arriba durante los 68 s | 10 s de demostración pura ANTES de la primera feature. Nadie mira una lista de funciones de algo que no vio andar |
| 3-5 | La tarjeta de marca aparece **dentro** del cold open | Marca | No interrumpe la escena, se monta encima |
| 11-21 | Bloque 1 | **TÍTULO EN MAYÚSCULA + párrafo chico + la toma que prueba esa palabra** | Nunca hay un título sin su prueba pegada |
| 22-27 | Bloque 2 (el más corto, 5 s) | Antes/después que se entiende de un vistazo | **La duración del bloque es proporcional a la dificultad de la capacidad**, no repartida en partes iguales |
| 36-38 | 2 s de oferta a mitad del video | Oferta | Dos toques (acá y en el cierre), no uno |
| 43-57 | Bloque más largo (14 s) | La capacidad que necesita tiempo para leerse | idem |
| 58-68 | Cierre con lo más difícil de fingir + tarjeta final | Oferta | — |

**Receta (100% grabación de pantalla + HyperFrames, cero generación):**

1. Cold open 8-10 s **sin rótulos**: el panel real, un agente detecta algo, redacta, cae en la cola
   de aprobación.
2. Cinco bloques de 6-12 s, cada uno título en código + una línea + captura real:
   `SEIS RUBROS` · `AGENTES 24/7` · `FACTURA CON EL SIAT` · `WHATSAPP QUE RESPONDE` ·
   `CONTABILIDAD BOLIVIANA`. **La duración de cada bloque se decide por lo difícil que es de creer.**
3. Rótulos: HyperFrames. Nunca generados.
4. `zoom-punch.mjs` en cada entrada de título.
5. Voz opcional (Lucía, ~600 caracteres). Funciona igual sin voz.

**Costo:** cero créditos de video. Una sesión.

**Trampa:** poner un bloque de una capacidad que está **detrás de un flag apagado** o en una rama
sin mergear — construido ≠ terminado; cada bloque entra sólo si la captura sale de **producción**.
Segunda: repartir los bloques en tiempos iguales.

---

#### P11 · Portafolio largo: 3 proyectos + galería + oferta (36 s, mudo)

**Ejemplar:** portafolio de emails con preventa, 36,5 s.
**Trabajo que hace:** **vender**, no sólo probar. El único de los de portafolio que termina en una
oferta. Sirve como reel de cabecera del perfil o adjunto de prospección por rubro.

**Estructura: 1 + 3×8 + 4 + 3.**

| s | Imagen | Texto | Por qué |
|---|---|---|---|
| 0-1 | Plano de ambiente | **Tres palabras** de posicionamiento | Ni nombre, ni logo, ni "hola soy" |
| 1-9 / 10-18 / 19-26 | Proyecto 1, 2 y 3, misma mecánica, 8 s cada uno | Solo música | 8 s es el máximo antes de que un bloque mudo canse. El patrón repetido crea expectativa: al tercero el ojo ya sabe qué va a pasar |
| 27-31 | **Galería**: los tres terminados en **un solo scroll vertical continuo** | Solo música | Se lee como una sola página larga: da volumen, no repetición |
| 32-35 | **Cambio de fondo** (claro) + objeto | La oferta con precio vigente | El corte de contexto es lo que hace que el CTA se lea como CTA |

**El bloque de "proceso" del original no se copia tal cual.** Nosotros no diseñamos en un canvas: no
hay timelapse de arrastrar cajas que filmar, y fabricarlo sería inventar. Dos reemplazos honestos:
1. **Wireframe → final en dos estados** (3 s + 5 s por proyecto, con los mismos PNG de P02). Es
   literalmente cierto y ya sabemos producirlo.
2. **Grabar el proceso real**: la generación del sitio corriendo en la fábrica. Es más raro de ver
   que un timelapse de Figma y es nuestro de verdad.

**Galería (4 s):** apilar los tres PNG finales en UNO y recorrerlo rápido.

```bash
ffmpeg -y -i renders/final1.png -i renders/final2.png -i renders/final3.png \
  -filter_complex "[0]scale=1080:-2[a];[1]scale=1080:-2[b];[2]scale=1080:-2[c];[a][b][c]vstack=inputs=3" \
  renders/galeria.png
# velocidad = (alto - 1320) / 3.4 ; si supera 700 px/s, recortar cada PNG a su mitad superior
```

**Cierre (3 s):** `make-mockup.mjs --template quote --theme light` sobre fondo `#F4F5F2`, con el
**precio vigente** (lanzamiento: Landing 790 / Web Pro 1.500). Un reel circula meses: un precio
viejo en pantalla es una promesa que después hay que sostener.

**Costo:** 0 créditos. ~45-60 min la primera vez (8 bloques), ~25 min después.

**Trampa:** fabricar el "proceso" · estirar los bloques más allá de 9 s (la galería, que es lo que
vende, nunca llega) · el original cierra vendiendo un curso propio: nosotros no tenemos curso, el
cierre es la web.

---

#### P12 · Mockup a pantalla llena, corta en el estado de proceso (6,5 s)

**Ejemplar:** checkout con flip 3D, 6,5 s.
**Trabajo que hace:** **vender la sensación.** No explica, no enseña, no pide. Arriba del embudo,
donde el espectador no va a leer un rótulo.

| s | Imagen | Audio | Por qué |
|---|---|---|---|
| 0-1 | Teléfono a cuadro completo, sin rótulo, sin marca | Lo-fi + **tecleo y clics** | El SFX hace el trabajo que haría el rótulo |
| 2-3 | El gesto se completa, el cursor baja y toca el botón | Clic audible | **El cursor cuenta la historia**; no hay texto que la cuente |
| 4-5 | Pantalla de proceso: spinner + `Procesando…` | La música termina | **No hay pantalla de éxito: corta en el proceso.** Al loopear, el arranque limpio se lee como continuación |

**Receta:** mismo `film-pattern.mjs` con `_reel.html?marco=phone` (sin rótulo, sin `<pre>`).
Candidato natural: `checkout-card` — nuestra reconstrucción ya tiene el flip al CVC (0,95 s) y la
fase `Authorising` de 2,4 s, que es **exactamente** el estado donde este formato corta. También
sirve `chat-widget` a pantalla completa, que además le habla al dueño y no al dev.

**Costo:** 0 créditos, ~10 min. **Hoy pierde la mitad de lo que lo hace funcionar** porque el audio
ES el rótulo y no tenemos SFX (§5).

**Trampa:** el corte sin resolver es una decisión, no un descuido: corta bien porque corta en un
estado que el ojo reconoce como *en curso* (spinner + texto de proceso); a mitad de una animación
cualquiera queda "se colgó el video" · **no filmar un flujo de pago propio**: no tenemos pasarela en
producción, esto es una pieza de patrón y no se publica como producto nuestro andando.

---

#### P13 · Ráfaga nombrada (20 s, 1 ítem por segundo)

**Ejemplar:** 15 términos de startup, 20,4 s, 1,04 s/ítem.
**Trabajo que hace:** **captar, y nada más.** Alcance puro: retención por velocidad y un remate que
halaga. Lo documentamos porque la mecánica de cadencia es excelente y porque es el molde que más
fácil se copia mal.

| s | Imagen | Audio | Por qué |
|---|---|---|---|
| 0-2 | Rótulo tipo quiz | Marco de examen ("a ver si de verdad entendés…") | El espectador se queda para probarse, no para aprender |
| 2-18 | **Una tarjeta por segundo**, cambiando en segundos enteros. Alterna gráfico/plano cada uno o dos ítems | La lista enunciada de corrido | **La cadencia de 1 s es un metrónomo, no una estimación.** Si un ítem dura 1,4 s y el siguiente 0,8 s se siente sucio de inmediato |
| 18,2-20,1 | Cierre | **Un veredicto sobre el espectador**, no un CTA | Cierra el bucle de examen que abrió el gancho |

**Corrección obligatoria si lo usamos:** **cada tarjeta lleva su definición en una línea, en español
de Bolivia.** Sin eso es humo — el dueño de una ferretería no compra por "beachhead market". Si la
definición no entra en una línea, el ítem no entra. Con definición la cadencia real pasa a 1,5-2 s
y el máximo a ~10 ítems en 20 s.

**Receta:** un solo HTML con `{{TITLE}}` + `{{SUBTITLE}}` × N con `make-mockup.mjs --template
custom` → **no usar `sync-plan` acá**: es un metrónomo fijo, el `overlay-plan.json` se escribe con
`at` en segundos exactos (`{at:2.0}`, `{at:3.0}`…) → `overlay-visuals.mjs` → `master.mjs`.
Este es el caso donde el timing a mano es lo correcto.

**Costo:** 0 créditos. ~30-40 min una vez escrita la lista con sus definiciones.

**Trampa:** **nombrar sin definir.** Es lo que hace el ejemplar y lo que lo vuelve relleno: 15
sustantivos y un gráfico ilegible producen la *sensación* de haber aprendido sin dejar nada.

---

#### P14 · Rant del número medido (43 s)

**Ejemplar:** rant sobre cuánto tarda de verdad una web, 43 s.
*Cobertura: este video entró sin timeline visual (sólo audio); los tramos están prorrateados por
cantidad de palabras.*

**Trabajo que hace:** **vender por honestidad.** Es una lista disfrazada de queja: la enumeración
no es el contenido, es la **evidencia** del número.

| s (est.) | Audio | Por qué |
|---|---|---|
| 0-6 | "Adiviná cuánto me tomó…" | Gancho de acertijo: obliga a estimar. El espectador ya está jugando |
| 6-14 | **El número, completo** | **Llega temprano.** No se guarda para el final: es el activo del video |
| 14-20 | "…sin contar X, que tampoco resuelve" | Amplía el número negando lo que NO incluye. Sube la credibilidad de la cifra |
| 20-32 | La enumeración con nombres propios | **La lista es la prueba forense del número.** Una lista genérica no probaría nada |
| 32-43 | El veredicto **con su límite** | Conceder la mitad ("para un componente sí, para una web entera no") es lo que lo separa del hater |

**Receta:** el número tiene que ser **propio y medido** — tenemos los nuestros y son mejores porque
son verificables en el repo (cuánto tarda un rebuild real, cuántos gates corre una entrega, cuántas
herramientas encadena una pieza de Web Factory, cuánto silencio se cortó en un clip real). **Si hay
que estimar un número, no se publica la pieza.** La enumeración va en pantalla mientras se dice,
como placa que se va llenando (`sync-plan.mjs` con el cue en cada nombre): que el espectador pueda
contar es la mitad del efecto. El veredicto se escribe primero, con su concesión incluida.
**Sin nombrar competidores**: el blanco es la promesa, no una empresa.

**Costo:** 0 créditos, ~800 caracteres de voz, ~1 h + el tiempo de **medir el número de verdad**.

**Trampa:** un rant con un número inventado es peor que no publicar: si es estimado, cualquiera que
pruebe lo contrario nos borra la autoridad de todas las piezas anteriores.

---

#### P15 · Caso de cebo + tesis propia (87 s)

**Ejemplar:** Climatic / asesoría "MARCA PROPIA", 87,2 s.
**Trabajo que hace:** **captar hablando de un rubro sin tener cliente propio.** Resuelve el hueco de
"cómo hablo con autoridad si todavía no tengo casos": el caso lo pone otro, la tesis la ponés vos.

**Proporción 40 / 35 / 25:** 40% cebo, 35% tesis propia, 25% credencial + CTA.
**El giro va exactamente al 40%** ("ahora lo interesante no es el producto, es la estrategia"). Si
"esto es lo que yo hago" llega antes, el video entero se lee como anuncio.
**La primera vez que dice "yo" es en el segundo 70 de 87 (80%):** la credencial llega cuando ya te
ganó.

**La curva de densidad de rótulos es el hallazgo del formato:** 11 rótulos en los primeros 24 s →
**15 segundos enteros sin ninguno** durante el b-roll fuerte → vuelve a apretar en el remate. Los
rótulos aprietan donde hay que retener y aflojan donde la imagen sostiene sola. **Pico:** una lista
que se construye a 1 ítem por segundo (3 s, 3 ítems), y **la prueba va inmediatamente después**,
mientras la lista sigue fresca.

**Receta:** camino faceless (corre hoy, costo cero): b-roll al 100% del cuadro, voz de Lucía en off,
y el "yo" del cierre se vuelve "en ONIA" (skill `faceless-explainer` + HyperFrames). Nuestro cebo
natural no es un producto ajeno sino **una capacidad puesta como caso**. La curva de densidad **se
escribe en el storyboard a propósito** → `sync-plan.mjs` → `overlay-visuals.mjs`.
Ojo: `overlay-visuals` no pone rótulos abajo si hay karaoke — ese rail ya está ocupado.

**Costo:** 0 créditos. ~1.500 caracteres de voz. ~2-3 h, la mayoría juntando b-roll.

**Trampa:** **la anti-lección del ejemplar, que es lo más valioso que tiene:** llama "demostración
científica" a un gráfico del sitio del propio vendedor. El montaje es bueno, la evidencia es falsa.
**Nunca hacemos eso en dental, estética ni veterinaria** (en Bolivia la publicidad con efecto
terapéutico es terreno regulado). Un gráfico nuestro es un gráfico nuestro. Y no hay prueba social:
**no hay reseñas de clientes y no se fabrican** — el sustituto legítimo es grabación del producto
funcionando, que es prueba de que existe, no prueba social.

---

#### P16 · Escenificación en 2ª persona, rotulada (27 s)

**Ejemplar:** la pastelera con chatbot, 27 s.
*Cobertura: audio 100%, sin lectura de fotogramas; los tramos son una reconstrucción prorrateada
del verbatim a ~3,5 palabras/s.*

**Trabajo que hace:** **vender.** Es el molde de mayor valor comercial de todo el corpus: le habla
directo al comprador A y hace que se reconozca en un problema.

| s | Audio | Por qué |
|---|---|---|
| 0-1,5 | *"Otro pedido de encargo,"* | Primera palabra: **"Otro"**. Ni saludo ni presentación: llegás tarde a una vida que ya venía pasando |
| 1,5-6 | *"…les cuento algo mientras, porque me pasó algo que ya no aguanté"* | **Invitación, no promesa.** "Mientras" hace explícito que hay dos hilos. Abre un bucle sin decir qué pasó |
| 6-9,5 | Contexto en una línea | Fija la escala: no es una empresa, es alguien como el espectador |
| 9,5-15 | **El dolor, con número chico y consecuencia física**: 15 pedidos, "casi se me quema uno" | 15, no 500. Una pérdida que se ve; "perdía ventas" no se ve |
| 15-21 | Punto de quiebre → solución. **El producto nunca se nombra** | Entra en el segundo 15 de 27 (>50%). Si el nombre aparece antes, deja de ser confesión y pasa a ser anuncio |
| 21-24 | Beneficio **en vocabulario de oficio** ("con las manos en la masa") | No "ahorro de tiempo" |
| 24-27 | **Cierre suave con salida física** ("bueno, a entregar") | Se va porque tiene trabajo, no porque terminó el guion. Cero "link en bio" |

**🔴 El límite duro:** un testimonio en primera persona **no se puede fingir**. NO va en boca de
Lucía — es una influencer IA declarada, y que "cuente" que vende pasteles fabrica un cliente que no
existe; **rotularlo no lo arregla**, porque su cara ya está asociada a una identidad pública.
Sólo dos variantes legítimas: **(a)** cliente real con permiso escrito (bloqueada hoy) y **(b)** la
que sigue.

**Receta (variante b, producible hoy y gratis):** mismo esqueleto de 7 tramos pero **en 2ª persona**
— *"Son las 9 de un sábado de diciembre. Tenés 15 pedidos y el WhatsApp no para…"*. Cambiar la
persona gramatical convierte un testimonio falso en una **proyección** honesta.
Imagen: **grabación de pantalla del bot real de ONIA tomando un pedido de verdad**, en marco de
teléfono (`make-mockup.mjs --template phone`). Es el producto funcionando, no una actriz.
**Rótulo de escenificación permanente desde el segundo 0**, arriba (abajo vive el karaoke):
*"Escenificación — así se vería tu sábado con el bot"*.

**Si algún día se edita material de un cliente real:** `cut-plan.mjs` con **sólo silencios largos
(>0,9 s) y la lista de muletillas VACÍA**. Las muletillas son la prueba de que es real, y eso
**contradice el default de nuestro `editor-videos`**: en este formato se apaga esa parte del corte.
Y siempre `publish-cut-review.mjs` antes de cortar (regla de oro).

**Costo:** 0 créditos Higgsfield. ~900 caracteres de voz, ~1,5 h.

**Trampa:** **pulirlo** (si le sacás las muletillas, le enderezás las frases y le ponés música
épica, se convierte en un anuncio y pierde exactamente lo que lo hacía funcionar) · nombrar el
producto temprano · cara quieta y manos vacías: **sin tarea en cuadro el formato se cae a
talking-head genérico**; ese colchón de dos hilos (historia en el audio, tarea en la imagen) es el
80% del formato.

---

#### P17 · Pantalla partida: resultado arriba / prompt abajo (28 s)

**Ejemplar:** Seedance con prompt por escenas, 27,6 s.
*Cobertura: leído con 2 de 6 fotogramas + audio confirmado sin locución. La composición está
verificada; los tiempos exactos de cada rótulo no.*

**Trabajo que hace:** **captar.** Es un lead magnet disfrazado de tutorial, y el formato más barato
de todos **si el clip de arriba ya existe**.

**Composición (todo es capa fija durante los 28 s, no hay tramos):**
- Franja superior: contexto permanente para quien entra tarde.
- Mitad superior: el resultado corriendo **en loop e independiente** del texto — el ojo puede irse
  abajo y volver sin perderse nada. Cero riesgo de desfase, cero montaje fino.
- Mitad inferior izquierda: `INPUT` = **una sola foto**.
- Mitad inferior derecha: `PROMPT` = el guion por escenas **scrolleando lento**, a velocidad
  **ilegible pero reconocible**.
- Capa de cebo: `ROBATE MI GUION` / `COMENTÁ "GUION"`.

**Los dos detalles que son todo el formato:** (1) **la desproporción visual es el argumento** — una
foto contra cuarenta líneas dice "el trabajo está en el guion" sin escribirlo; (2) **el prompt es
ilegible a propósito**: si se pudiera leer, nadie comentaría. La duración la fija el texto, no la
imagen: dura lo que tarda el prompt en pasar (calibrar ~4 s por escena).

**Receta:** HyperFrames puro, 9:16, dos tracks (un `<video>` arriba, un bloque de texto que traslada
en Y abajo). El formato se alimenta de P20: primero producís el AD SPEC, después publicás su guion
como pieza aparte, a costo marginal cero.

**Trampa:** publicar un guion que nombra al cliente, su producto o su precio sin permiso · prometer
un DM automático (§5) · mostrar un prompt corto: si el guion no es largo y estructurado, el formato
pierde su único argumento.

---

### Bloque C — bloqueados o con costo, sólo con permiso explícito

---

#### P18 · Dossier con prueba de pantalla (70 s) — bloqueado por falta de insumo

**Ejemplar:** caso Nicole, 70,4 s.
**Trabajo que hace:** **probar.** Narrador en tercera persona + **una captura por cada afirmación**
+ texto cinético palabra por palabra.

| s | Imagen | Por qué |
|---|---|---|
| 0-10 | **Envase de ventana retro** alrededor del metraje + la cifra más grande | El marco convierte metraje 16:9 en 9:16 sin barras muertas, da identidad y permite meter capturas de escritorio sin que se vean pegoteadas |
| 11-32 | Cada afirmación con **su** captura: ficha de producto, gráfico con los peldaños escritos | La voz nunca da un número sin que la pantalla muestre de dónde sale |
| 33-47 | El método, en 14 s | Es un dossier, no un tutorial |
| 48-61 | La herramienta corriendo | — |
| 62-70 | CTA | Los últimos 8 s (11%) son publicidad pura |

**Detalles:** **texto cinético palabra a palabra** (1-3 palabras grandes que cambian cada 0,7-1 s
exactamente sobre la palabra dicha) — es lo que hace que un video denso en datos se siga **sin
audio** · densidad 3,2 palabras/s sin pausas · ninguna toma dura más de ~4 s · zooms sobre las
capturas para que un dashboard fijo no muera en pantalla (`zoom-punch.mjs --auto`).

**Ojo:** texto cinético ≠ karaoke. `karaoke-captions.mjs` es un rail de subtítulos abajo; esto es
texto grande centrado disparado por palabra (`sync-plan.mjs` → `overlay-visuals.mjs`). Se pueden
combinar, no confundir.

**Por qué está bloqueado:** no hay caso propio con números auditados. Hoy lo único con números
propios verificables es el sistema mismo (rubros encendidos en producción, entidades del core, tests
verdes). **Si el número no lo podemos abrir, no entra.**

**Trampa — la anti-lección, y es grave:** en el ejemplar la captura dice **408,8M en 7 días** y la
voz narra **400-500M al mes**. La pantalla no prueba lo que dice la voz y nadie lo nota. Regla dura:
**el número en pantalla y el número dicho tienen que ser la misma métrica y el mismo período.** Si
un prospecto lo nota, se cae la venta entera, no sólo el dato.

---

#### P19 · Producto en contexto (17 s) — falta un asset

**Ejemplar:** podium.global, 17 s, mudo.
**Anatomía:** una laptop en un escritorio con la web ya cargada → **un solo gesto sostenido de 17 s**
(scroll continuo, sin un corte) → queda en una sección. Rótulo: **dominio + técnica, dos palabras
cada uno**; sirve de crédito y de explicación al mismo tiempo.

Aguanta 17 s sin cortes porque **la recompensa es continua**: cada centímetro de scroll cambia la
imagen. Con una landing estática, 17 s de scroll son 17 s de nada.
El encuadre **incluye el escritorio**: recortada al borde parecería una captura; con el escritorio
alrededor parece un momento.

**Receta:** `page.mouse.wheel(0, N)` en pasos chicos y regulares (un `wheel` grande sale a los
tirones) sobre una landing propia servida en local. **El límite real es el marco:** `make-mockup.mjs`
tiene `--template browser` y `--template phone`, **no hay plantilla de laptop en escritorio** y no
tenemos foto propia. Salidas: (a) escribir `laptop.html` para `--template custom` (queda producto en
fondo liso, no producto en contexto), o (b) fotografiar un escritorio real y componer con
`overlay-visuals.mjs`. La (b) es la que reproduce el formato y necesita una sesión de fotos.

**Trampa:** este formato promete lo que el sitio tenga. El original muestra secuencias de video
atadas al scroll, que choca con nuestro presupuesto de 150 kb de JS por landing. Y no se filma el
sitio de un cliente sin su OK.

---

#### P20 · AD SPEC: insumos rotulados → comercial firmado (21 s) — generación paga

**Ejemplar:** spec ad de Puma por Mindshft.ai, 21,5 s.
**Trabajo que hace:** **vender.** Prueba producida para un prospecto concreto **antes** de que
compre. No demuestra una herramienta: demuestra que sabemos dirigir.

| s | Imagen | Texto | Por qué |
|---|---|---|---|
| 0-3 | Fondo liso. **Tres imágenes fijas de insumo, una por segundo** | `Avatar IA` · `Escenario IA` · `producto (foto real)` | **Enseña el truco ANTES del resultado.** El gancho es la desproporción entre lo que entra y lo que sale |
| 3-9 | Tres planos de ~2 s: **producto primero**, después rostro, después acción | SFX sincronizados al impacto | La cara vende; el producto es lo que se vende |
| 9-11 | **Un plano estilizado (B&N) exactamente en el medio** | — | El respiro, justo antes de donde se cae la retención (segundo 9-10) |
| 11-14 | El plano más "caro": contraluz + panorámica | — | Después del respiro |
| 14-19 | Planos cortos; cierra **mirando a cámara** | — | La mirada a cámara es el punto final |
| 19-20 | **Logo de la marca** | — | La MARCA cierra la pieza |
| 20-21,5 | Pantalla negra con el crédito técnico | — | **La HERRAMIENTA va aparte y después.** Mezclarlas convierte el comercial en un anuncio de software |
| 3-19 (capa fija) | Marco tipo cámara en las 4 esquinas | `AD SPEC` · `Nº 04` · `DIRECTOR: ONIA` · fecha | Fijo, no animado, en las esquinas: no tapa nada y **sobrevive a la captura de pantalla** |

**Los rótulos van en idioma de director, no de herramienta:** `accesorios + Ropa`, no
`image_references[2]`. Se leen en 0,4 s.

**Datos verificados en la cuenta (2026-08-13, consulta gratis):** plan `ultra`, **2.857,94 créditos**
· modelos `seedance_2_0` y `seedance_2_0_mini` (**`seedance_2_5` NO existe**) · duración **4 a 15 s**
por generación (default 5, **no 30**) · `unlim` = `available:false` (**los "33 días ilimitados" no
aplican**) · roles: `start_image` `end_image` `image_references` `video_references`
`audio_references` · `generate_audio` default **true** · existe `soul_location` para escenarios ·
**`Show Cinema` NO está en `presets_show`**.

**Dos restricciones que hacen fallar el primer intento:**
1. **Un `soul_id` NO se pasa a `seedance_2_0`.** El Soul sólo corre en `text2image_soul_v2`
   (`text2image_soul_v2`) y `soul_cinema_studio`. A Seedance entra **el PNG que produjo el Soul**.
2. **Escenas ≠ generaciones.** El tope de 15 s es de la GENERACIÓN, no del plano: dentro de una
   generación entran 4-6 escenas con timestamps. **Un comercial de 20 s son 2 generaciones, no 7.**

**Guion:** bloques `Scene N — nombre (Xs–Ys)` con encuadre, movimiento de cámara, foco y luz
escritos. Costura A→B: `ffmpeg -sseof -0.1 -i genA.mp4 -frames:v 1 lastframe.png` y ese PNG entra
como `start_image` de B. Marco, cierre de marca y tarjeta de crédito: **HyperFrames, nunca
generados**.

**Insumos:** avatar = `generate_image` con `text2image_soul_v2` + soul de Lucía (~0,12 cr) · escenario =
`soul_location` o **foto real del local del cliente** · producto = **FOTO REAL del cliente, del
celular** (generarlo con IA es inventar el producto que se vende).

**Costo:** las 3 imágenes ≈ 0,36 cr (trivial). **El costo de las 2 generaciones de video NO está
medido** — no hay `get_cost` en el MCP. Método (tarea V-3, abierta): `balance` → generar UNA toma de
4 s en `seedance_2_0_mini` a 480p → `balance` otra vez; la resta es el costo unitario. Prototipar
siempre en `mini`/`fast`/480p. **Video = permiso explícito de Sergio, caso por caso.**

**Trampa:** pasarle el `soul_id` a Seedance · pedir 7 escenas en 20 s · presentar un spec ad de
marca ajena como campaña oficial (se rotula `AD SPEC` SIEMPRE) · generar el producto con IA ·
presupuestar 7 generaciones cuando son 2.

---

#### P21 · Video2Video "grabalo con el celular y yo lo convierto" (41 s) — generación paga

**Trabajo que hace:** **vender a quien no tiene producción.** Es el pitch más fácil de creer que
tenemos para un comercio de Santa Cruz: no es "te genero un comercial de la nada", es "grabalo como
puedas, yo lo convierto".

*Cobertura: audio 100%, sin lectura de fotogramas.*

| s | Audio | Por qué |
|---|---|---|
| 0-6 | Promesa **con el año dicho** | Data el contenido y lo hace sentir de hoy |
| 6-16 | Paso 1, **nombrando la herramienta** | Nombrar es lo que lo vuelve creíble |
| 16-24 | Paso 2: *"subís tu video grabado con el móvil"* | **El insumo es deliberadamente humilde** |
| 24-36 | Paso 3: los tres insumos juntos | La estructura "primero / luego / por último" es lo que hace que se guarde |
| 36-41 | *"en minutos ya tenés el resultado"* + CTA | **No muestra el resultado completo: lo anuncia.** El pago está en el comentario |

**El bloque `INPUT`/`OUTPUT` (5 s, del anuncio oficial):** pantalla partida rotulada, en mayúscula,
sin explicación. **El "antes" se muestra feo a propósito**: si el antes ya se ve bien, no hay salto,
y todo el formato vive del salto.

**Receta:** `seedance_2_0` acepta `video_references` (**verificado hoy en la cuenta**, no es promesa
de un modelo que no existe). Metraje de celular + `image_references` [escenario, producto]. Split
screen compuesto en HyperFrames, rótulos en código.

**Trampa:** **prometer que preserva "exactamente" el movimiento y la cámara** — eso lo dice el
marketing del proveedor y **nosotros no lo probamos**. Antes de ofrecérselo a un cliente hay que
hacer UNA conversión con metraje propio y mirarla. Segunda: convertir metraje con personas
identificables sin consentimiento. Tercera: el video de origen repite "Seedance 2.5" y "33 días
ilimitado" — el segundo sigue siendo falso, pero **"Seedance 2.5" dejó de serlo: al 15-ago existe en la cuenta** — una tercera fuente repitiéndolo no lo vuelve cierto.

---

#### P22 · Dos que caminan (45 s, formato diálogo) — generación paga + no verificado

**Trabajo que hace:** **explicar** un método en menos de 45 s sin que parezca clase. La estructura
de diálogo elimina el "hola chicos" y convierte la explicación en una respuesta. Es legítimo con
Souls: no cuenta la biografía de nadie, alguien pregunta y alguien contesta.

| s | Imagen | Audio | Por qué |
|---|---|---|---|
| 0-3 | Dos personas caminando, selfie a brazo extendido | **La pregunta la hace la otra persona** | Espiás una charla en vez de escuchar un discurso |
| 3-7 | idem | **Promesa con reloj**: "te lo enseño en 30 segundos" | Contrato explícito en el segundo 5 |
| 7-14 | **Corta a B-roll**: ilustración esquemática, rótulos de 1-3 palabras | El problema | A los 7 s la cara ya cedió el cuadro |
| 14-19 | Captura: mismo insumo, dos resultados lado a lado | *"fíjate"* | **Prueba visual A/B**: no dice un número, te lo muestra |
| 19-24 | Una sola palabra grande en pantalla | — | Puntuación visual: rompe el bloque de capturas |
| 24-32 | Antes/después **dentro de la misma toma** | La capacidad | Se demuestra, no se enumera |
| 32-34 | **Vuelve la cara** | *"lo que viste es sólo la mitad"* | **Segundo gancho al 73%**, justo donde cae la retención |
| 34-41 | Captura con 3 rótulos | Remate memorizable de 5 palabras | Los rótulos prueban que el sistema existe |
| 41-44 | **Cierre físico**: la mano tapa la lente | CTA | Corta el video sin fundido |

**La cara ocupa 12 de 44 s (27%): es puntuación, no contenido.** Los otros 32 s son capturas, demos
y animación — y esos 32 s son **costo cero**. Techo duro: **30% del metraje con cara**; si generás
44 s de avatares caminando gastás créditos y el resultado se ve IA.

**Lo no verificado, dicho explícito:** dos caras IA consistentes en la misma toma **no está probado
en nuestra cuenta** → camino seguro para la primera pieza: **una sola persona en cuadro (Lucía) y la
pregunta en off**, fuera de campo. Se conserva la estructura y se elimina el riesgo doble.
Y **la segunda voz no existe**: la única voz oficial es Lucía; si la pieza es a dos voces hay que
elegir y fijar una segunda voz de ElevenLabs primero. Decisión abierta.

**Trampa:** prometer "en 30 segundos" y durar 45 (el reloj del segundo 5 es un contrato) · el cambio
de vestuario entre tomas (es la huella de que son generaciones separadas, y es justo el problema que
el video vende resolver: nuestro riesgo número uno) · copiar la comparación contra marcas ajenas —
nuestro A/B es contra un antes/después nuestro.

---

#### P23 · Cebo de código (6,7 s) — motor bloqueado por S6

Mismo montaje que P04 con dos cambios: el `<pre>` va desenfocado o en opacidad baja (**el código es
textura, no contenido** — en el ejemplar ni un solo fotograma captura una línea real), y **el CTA
vive en el centro del cuadro los 6,7 segundos**, no en una placa final: en un clip de 6 s o está
desde el principio o no se lee. Un panel lateral **lista funciones en texto** (3-6 palabras) y hace
parecer completo lo que en pantalla son dos clics. El clip **cierra en el estado de éxito**, nunca a
mitad de la animación: el pago emocional del espectador es el check verde.

**Filmarlo cuesta 0 y 10 min. El motor no lo podemos encender:** el mecanismo comentario→DM está
bloqueado por el token de Instagram (S6). Prometer un recurso que no existe es spam, no lead magnet.
Si lo hacemos, el recurso tiene que ser real y nuestro: el `index.html` autocontenido del patrón, que
ya está escrito — **esa es la única razón por la que podríamos usar el formato sin quedar en el mismo
lugar que el ejemplar**, que nunca mostró el código que prometía.

---

#### P24 · Confesión desde el mostrador — testimonio de cliente real

Es el techo de P16 y está bloqueado: cero clientes pagando. Cuando haya, **cuestionario de 7
casillas, no un guion para leer**: (1) qué estás haciendo cuando grabás, (2) qué pasó el peor día,
(3) cuántos eran / cuánto tardaba, (4) qué se te arruinó por eso, (5) el momento en que dijiste
basta, (6) qué hace el bot ahora dicho con tus palabras, (7) cómo te despedís. Si lee, se nota y
muere. Graba **él**, con su celular, en su local, haciendo su trabajo, vertical, cámara apoyada, una
sola toma. **Permiso de uso por escrito antes de grabar.**

---

### Módulo transversal · El cierre (se enchufa a cualquier carrusel o pieza)

| Cierre | Qué es | Qué produce | ¿Hoy? |
|---|---|---|---|
| **A · cebo de una palabra** | Lámina limpia, contraste invertido, **una palabra en mayúsculas** sin tildes ambiguas | Comentarios → alcance | Sí, **respondiendo a mano** (S6) |
| **B · lead magnet con índice** | Pregunta + **6 líneas de qué contiene** + la palabra | Más conversión que el cebo simple: se pide una acción a cambio de algo descrito | **No: no hay guía.** Se produce el activo primero (`make-pdf`) y recién después se anuncia |
| **C · oferta con precio** | Precio explícito | Filtra en vez de captar: pocos comentarios, pero califica | Sí, con el precio vigente (790 / 1.500) |

**Reglas del cierre:** rompe el patrón visual del interior (si el interior era oscuro y denso, el
cierre es claro y vacío — el corte de estilo dice "terminó" mejor que la palabra "fin") · **un solo
pedido** (ningún cierre pide comentar *y* seguir *y* guardar) · el trigger **se repite en el
caption**, porque el que no llegó a la última lámina igual ve el pedido.

**El caption nunca es un resumen.** O **reemplaza** el contenido (para el que no swipea), o lo
**condiciona** (deja un ítem afuera para forzar el swipe), o lo **respalda** (declara de dónde salió
la lista). Escribirlo como resumen es desperdiciar el segundo post. Y el corte de "ver más" cae
temprano: **lo que tiene que sobrevivir va en las primeras ~2 líneas.**

**Trampa:** el cebo sin capacidad de responder. Si entran 40 comentarios y nadie contesta, el efecto
neto es negativo: queda público que no cumplimos.

---

## 4. Las 10 reglas transversales

Salen de cruzar los que funcionan con los que son relleno. Aparecen en **todos** los que funcionan.

1. **Nadie saluda.** Segundo 0 = una frase que ya está en marcha, la afirmación más rara, o el
   número más grande. En piezas de menos de 15 s la portada se lleva 13-34% del total: es el único
   tramo que puede frenar el scroll y se presupuesta como tal.
2. **Se entiende con el sonido apagado.** Rótulo fijo que no se va, gráfico con su pie de una línea,
   subtítulos quemados. La mitad del feed se ve en silencio, y tres de los mejores del corpus son
   mudos de fábrica.
3. **Un rótulo es una palabra clave, no una frase — y su densidad es una curva.** Aprieta en los
   primeros 20 s, **afloja hasta desaparecer** donde el b-roll sostiene solo (15 s sin un solo
   rótulo en el mejor ejemplar), y vuelve a apretar en el remate. Rótulos parejos todo el video =
   papel tapiz que deja de anclar.
4. **Cada afirmación fuerte tiene su imagen, y la imagen prueba lo mismo que dice la voz** — misma
   métrica, mismo período. Dos de los ejemplares mejor montados del corpus hacen trampa acá
   (una captura de 7 días narrada como mensual, un gráfico del propio vendedor llamado "demostración
   científica"). Copiamos el hábito, nunca la trampa.
5. **El "antes" va primero, corto y pobre.** Ratio 1:3 contra el "después". Tres fotos fijas, un
   wireframe gris, un auto de juguete, un video de celular: el formato entero vive de la
   desproporción, y un "antes" prolijo lo mata.
6. **El marco no se mueve.** Entre las dos mitades de una comparación: mismo encuadre, misma
   posición, mismo tamaño de rótulo. Sólo cambia **una palabra**. El marco constante es lo que
   convierte dos clips en una comparación.
7. **Corte seco y cadencia de metrónomo.** 1,00 s exacto, no "más o menos" (a 120 BPM cae en el beat
   solo). En acción, corte cada ~2 s. Un gesto de 0,4 s no se lee, uno de 0,6-0,9 s sí. La única
   transición admitida en todo el manual es un `fade` de 0,25 s entre proyectos de P11; el resto
   vive del corte seco y `transitions.mjs` **no se usa**.
8. **El tiempo se reparte por dificultad de creer, no en partes iguales.** 5 s a lo que se entiende
   de un vistazo, 14 s a lo que hay que sostener. El remate se lleva 20-25% (el último ítem dura el
   doble). El bucle abierto se declara antes del segundo 6 y se paga en el remate. Y el segundo
   gancho va al 73% del video, exactamente donde el espectador decide irse.
9. **Sin silencio: 3,2-3,5 palabras por segundo, sostenidas.** Las pausas se escriben en el guion,
   no se editan después. No hay un solo hueco por donde entre el pulgar.
10. **El ítem tiene que dejar algo aplicable** — un contraste binario, un dolor con consecuencia en
    plata, un número medido, o pantalla real corriendo. Un sustantivo con un gráfico es relleno, y
    **el relleno no se arregla con producción**: el ejemplar de 15 términos está montado con más
    precisión que el de 8 industrias (metrónomo perfecto, montaje impecable) y no deja nada. El
    defecto es de guion.

**Corolario de producción (vale por las 10):** texto, tipografía, marcos y diagramas van **en
código** (HyperFrames / `make-mockup.mjs`), nunca generados — la IA erra la letra. Y todo lo que se
filma sale de **producción**, no de una rama ni de un flag apagado: construido ≠ terminado.

**El diferenciador más barato que tenemos es la prueba de pantalla.** Es lo que le falta a los dos
rellenos del corpus y lo que sostiene al mejor. Grabar pantalla cuesta cero, y tenemos qué mostrar:
el panel, los 6 patrones de `ui-patterns/`, la tabla de cortes, los gates. Casi nadie en el nicho
puede filmar su propio pipeline corriendo.

---

## 5. Lo que NO podemos hacer hoy, y con qué lo reemplazamos

| No podemos | Por qué | Reemplazo con lo que sí tenemos |
|---|---|---|
| **Cara real hablando** todos los días | Cinco de los seis talking-heads del corpus la usan; nosotros no la tenemos como capacidad automática | **Placa muda (P01)** o **voz de Lucía sobre pantalla**. Si Sergio graba: **10 ganchos y 10 CTAs de una sentada** = 10 piezas de cara para el mes. La restricción se resuelve con lotes, no con IA |
| **Talking-head IA de 54 s con lip-sync en español** | Tope de 15 s por toma → 4 generaciones que además tienen que machear en encuadre y luz; el sync a un audio de ElevenLabs **nunca se probó** | Voz en off + pantalla real. Es experimento a validar en una pieza corta, **no el camino por defecto** |
| **Dos caras IA consistentes en la misma toma** | No verificado en la cuenta → deriva de identidad entre planos | Una sola persona en cuadro, la otra voz **en off, fuera de campo** |
| **Testimonio de cliente** | Cero clientes pagando. Y **ponerlo en boca de Lucía no es una opción**: es una influencer IA declarada, rotularlo no arregla una biografía falsa | **Escenificación en 2ª persona rotulada** (P16) + grabación del bot real |
| **Música con licencia** | No hay librería en el repo | Publicar el MP4 **mudo** y elegir el audio dentro de Instagram al subir: es gratis, es legal, y el audio de la plataforma pesa más en el alcance que uno importado |
| **SFX de la librería HyperFrames** | **Verificado hoy:** en `.agents/skills/media-use/audio/assets/sfx/` sólo hay `CREDITS.md` y `manifest.json`; **los `.mp3` NO están**. `sfx.mjs` falla si se le pide un cue | Bajar los archivos de Pixabay (licencia ya revisada en `CREDITS.md`) — es la tarea que más formatos destraba (P03, P12) — o publicar mudo |
| **comentario → DM automático** | Bloqueo **S6** (token IG) | Responder **a mano**. Funciona igual, no escala. **Nunca prometer automático lo que es manual** |
| **Prueba social (reseñas, testimonios)** | No existe | Grabación del producto funcionando: prueba de que **existe**, no prueba social. Y se dice así |
| **Números de resultado de venta** | Cero clientes pagando | Números de **proceso medidos**: tiempos, gates, tests verdes, herramientas encadenadas. La honestidad no es una limitación del formato, es su materia prima (P14) |
| **Marco de laptop sobre escritorio** | No hay plantilla ni foto propia | `--template browser` (producto en fondo liso) o una sesión de fotos de un escritorio real |
| **Carrusel en 1080×1080 o 1080×1920** | Los 5 packs están clavados en 1080×1350: **14 hardcodes de `1350`** en `scripts/carousel_render.js` (192,194 · 316,317,325 · 412,413 · 498,499 · 603,604,610 · viewBox 274 y 568 · `--window-size` en 693) | Publicar en 1350. Si se hace el cambio: flag `--size feed\|square\|story` con un solo origen, **más un factor de escala sobre la tipografía** (bajar a 1080 de alto pierde 270 px y los titulares están en 88-118 px con `line-height` cerrado: no reencuadra, **corta**) |
| **Publicación automática de carruseles** | `carousel_publish.js` sirve los PNG desde el VPS por el puerto **8099**, que se cerró en el endurecimiento de seguridad | Probar el circuito con un carrusel de prueba **antes** de prometerlo |
| **Filmar un flujo de pago propio** | No hay pasarela en producción | Filmar el **patrón** y decir que es un patrón, no un producto nuestro andando |
| **`seedance_2_5` · "33 días ilimitados" · `Show Cinema`** | **Ninguno existe en nuestra cuenta** (verificado 2026-08-13). Tres fuentes distintas del corpus lo repiten y sigue siendo falso | `seedance_2_0` / `_mini`, 4-15 s, `soul_location` para escenarios |
| **P02, P04, P05, P11, P12 y P23 tal como están escritos** | **Los tres archivos de §7 NO EXISTEN:** `scripts/capture-web.mjs`, `scripts/film-pattern.mjs` y `hermes-content/references/ui-patterns/_reel.html` (verificado 2026-08-21 con `find` sobre todo el repo: cero resultados). Las recetas de §3 los invocan por línea de comandos como si estuvieran escritos | Escribirlos (§7: ~105-165 líneas en total, ~2,5 h). Mientras tanto: capturas a mano + `make-mockup.mjs`, y **no prometer esos formatos como "un comando por pieza"** |

---

## 6. Contradicciones entre los parciales, resueltas

1. **SFX.** Dos parciales usan `sfx.mjs` como si funcionara y uno verificó que faltan los `.mp3`.
   **Manda la verificación** (reconfirmada al escribir este manual): hoy no hay SFX reproducible.
   Toda receta que lo nombre queda pendiente de bajar los archivos.
2. **Voz de Lucía: dos identificadores en circulación.** `86V9x9hr…` (Marcela, es-LATAM) y
   `8de5db95-…`. **Resolución:** para `tts-elevenlabs.mjs` va la voz de ElevenLabs (Marcela); el
   UUID largo es el *element* de Higgsfield para narración generada, y son cosas distintas.
   **Antes del primer TTS, confirmar con el listado de voces** — no arrancar la primera pieza
   asumiendo cuál es, porque el síntoma de equivocarse es "Voice not found".
3. **"Muro de piezas" y "montaje al ritmo" eran el mismo formato** en dos parciales distintos.
   Unificados en **P05**, con la fórmula de cadencia de uno (120/BPM) y las placas de apertura y
   cierre del otro.
4. **`master.mjs`.** Un parcial dice que no corre y varios lo exigen al final. **Resolución:** hace
   loudnorm de dos pasadas sobre el audio, así que **sólo corre si la pieza tiene pista de audio**.
   Las piezas mudas se exportan sin master y el audio entra en la plataforma.
5. **`transitions.mjs`.** Todos los formatos viven del corte seco excepto una costura (entre
   proyectos de P11, `fade` 0,25 s). Queda como regla 7.
6. **Rótulo de P04.** El ejemplar usa idioma de dev y el propio parcial marca que nuestro comprador
   no es dev. **Resolución:** se filma una vez y se rotula dos veces (versión colega con código,
   versión dueño sin código).

---

## 7. Lo que se escribe una sola vez (y después no se vuelve a tocar) — 🔴 NINGUNO ESTÁ ESCRITO

> **Verificado 2026-08-21 (`find` sobre todo el repo, cero resultados): los tres archivos de
> esta sección NO EXISTEN.** La tabla de abajo es la **especificación de lo que hay que
> escribir**, no un inventario de herramental disponible. Toda receta de §3 que invoque
> `capture-web.mjs`, `film-pattern.mjs` o `_reel.html` **hoy no corre**. El `*` de la tabla
> de decisión (§2) ya lo avisaba, pero esta sección y las recetas se leen como si
> existieran — por eso queda dicho acá también.

Tres archivos, ~105-165 líneas en total. Con ellos, siete formatos saldrían a un comando por pieza.

| Archivo | Líneas | Qué hace | Destraba |
|---|---|---|---|
| `scripts/capture-web.mjs` | ~50 | PNG de página completa: despierta imágenes lazy (baja en pasos de 600 px y vuelve arriba), pasa `fixed`/`sticky` a `static`, y con `--wireframe` aplica grayscale + tipografía del sistema + fondos a bloque gris | P02, P05, P11 |
| `hermes-content/references/ui-patterns/_reel.html` | ~60 | Recibe `?p=<patron>`, arma el cuadro 1080×1920 completo (rótulo fijo + iframe + `<pre>` con el código + cursor sobreimpreso). **La grabación ya sale compuesta**, sin una sola pasada de ffmpeg | P04, P12, P23 |
| `scripts/film-pattern.mjs` | ~45 | Playwright con `recordVideo`, helper `tocar(sel)` que mueve el cursor, espera y hace clic. Una coreografía por patrón | P04, P12, P23 |

**Por qué el wireframe es CSS y no un diseño aparte:** el "antes" tiene que tener exactamente el
mismo layout que el "después", si no el ojo no compara nada. Aplicando grayscale + imágenes
aplanadas a bloques grises + tipografía del sistema sobre la web final, el layout es idéntico **por
construcción** y no hay que dibujar nada.

**Notas de Windows:** las expresiones de `crop` llevan `\,` para escapar la coma (si no, ffmpeg la
lee como separador de filtros); funciona igual en Git Bash y PowerShell. Si se usa `drawtext` con
una fuente de `hermes-content/brand/fonts/`, correr ffmpeg **desde la raíz del repo con ruta
relativa**: la ruta absoluta lleva `C:` y los dos puntos rompen el filtro.

Playwright graba `.webm` VP8 a ~25 fps y **no dibuja el cursor del sistema** (por eso va inyectado).
Si alguna vez hace falta 60 fps o el cursor real: `ffmpeg -f gdigrab -draw_mouse 1 -framerate 60 -i
title=<ventana>` — pero ahí la toma depende del pulso de la mano.

---

## 8. Plan de la primera semana — 5 piezas, en este orden

Todas 0 créditos, todas mudas o con audio de plataforma, todas con insumos que ya están en el repo.
Publicación **manual** mientras siga el bloqueo S6.

| # | Día | Pieza | Formato | Insumo | Trabajo |
|---|---|---|---|---|---|
| 1 | Lun | **"6 rubros = 6 automatizaciones necesarias"** (12 s) | P01 | Los 6 rubros vendibles + agentes que el módulo ya tiene + b-roll del panel | ~1,5 h (casi todo escribir los 24 dolores) |
| 2 | Mar | **Antes/después de una web propia** (21 s) | P02 | Una vertical viva. Antes 4,5 s / después 12 s | ~30 min pieza **+ ~30 min escribir `capture-web.mjs`** |
| 3 | Mié | **Demo encadenada del panel, muda** (45-55 s) | P03 | ONIA Center en producción: 3 demos (11 s + 23 s + 11 s), la larga con 6-8 operaciones sobre el mismo elemento | ~2,5 h |
| 4 | Jue | **Clip de componente en localhost** (7 s) | P04 | `dropzone-progress` (o `checkout-card`) | **~2 h escribir `_reel.html` + `film-pattern.mjs`** + 10 min el clip. Deja los otros 5 patrones a 10 min cada uno |
| 5 | Vie | **Muro al ritmo** (12 s) | P05 | Reusa los PNG de las piezas 2 y 4 + los 6 patrones + landings propias. 9 pantallas × 1,00 s | ~30 min |

**Costo total de la semana: 0 créditos de Higgsfield, 0 caracteres de ElevenLabs, 0 gasto en
plataformas. ~9-10 h de trabajo**, de las cuales ~2,5 h son escribir tres archivos que no se vuelven
a escribir nunca.

**Qué queda listo el viernes:** 5 piezas publicables + el motor para sacar **5 clips más de
componente a 10 minutos cada uno** + las capturas ya hechas para el carrusel vitrina (P07) y para el
portafolio largo (P11).

**Orden de los desbloqueos, después de la semana 1:**
1. **Bajar los `.mp3` de SFX** (licencia ya revisada). Es lo que más formatos destraba: P03 y P12
   pasan de "flojo" a completo.
2. **Medir el costo unitario de `seedance_2_0`** (tarea V-3: `balance` → 1 toma de 4 s en `mini`
   480p → `balance`). Sin ese número no se puede presupuestar P20, P21 ni P22.
3. **Token IG (S6).** Destraba todos los cierres con cebo. Hasta entonces se responde a mano y no se
   promete automático.

---

*Fuentes: 46 fichas + transcripciones en `hermes-content/references/video-intake/`. Herramientas:
`.claude/skills/editor-videos/scripts/` (25 scripts), `scripts/hyperframes/` (11 composiciones),
`scripts/carousel_render.js`, `hermes-content/references/ui-patterns/` (6 patrones), skills
`ver-videos`, `editor-videos`, `hyperframes-*`, `oversized-cursor`, `faceless-explainer`,
`carruseles-onia`. Datos de la cuenta Higgsfield verificados 2026-08-13.*


---

# ✅ Los dos bloqueos se resolvieron consultando — no eran tareas

Verificado el 2026-08-13, minutos después de escribir este manual. **Dos de los tres bloqueos
que el manual declaraba no existían**: eran preguntas sin responder, no trabajo pendiente. Se
resolvieron mirando, sin escribir un prompt ni pedirle nada a nadie.

## 1. Los SFX SÍ están — el manual miró la carpeta equivocada

El manual dice que faltan los `.mp3` y que eso bloquea P03 y P12. Es cierto para
`media-use/audio/assets/sfx/` (0 archivos, solo `manifest.json` y `CREDITS.md`), pero **hay una
segunda librería que sí está poblada**:

```
.claude/skills/editor-videos/assets/sfx/
  ping.wav    1,00 s   192 KB
  pop.wav     0,20 s    38 KB
  swish.wav   0,50 s    96 KB
  thud.wav    0,55 s   106 KB
  whoosh.wav  0,60 s   115 KB
```

Verificados con `ffprobe`: son audio real, no archivos vacíos. Y son exactamente los cinco
gestos que los formatos de este manual necesitan:

| Gesto | Archivo | Dónde se usa |
|---|---|---|
| aparición de rótulo | `pop.wav` | P01, P13 — una por placa |
| cambio de plano rápido | `swish.wav` | P05 muro al ritmo, P03 entre pantallas |
| entrada pesada / remate | `thud.wav` | cierre de P02, revelación del "después" |
| transición larga | `whoosh.wav` | P11 entre proyectos |
| confirmación / éxito | `ping.wav` | P03 cuando la acción del panel completa |

**P03 y P12 NO están bloqueados.** El manual queda corregido acá.

## 2. La voz de Lucía: no hay ambigüedad, son dos plataformas distintas

El manual marca "dos IDs de voz de Lucía a confirmar". Consultado el listado de voces de la
cuenta:

```
voice_id:   8de5db95-e898-46a6-bb68-26d02f311686
voice_type: element          ← el tipo importa: se pasa el par (id, type)
name:       Lucia-voz
```

El otro ID (`86V9x9hr…`) es de **ElevenLabs**, que es otro servicio. No compiten ni se
contradicen:

| Generás en... | Usás |
|---|---|
| Higgsfield (`generate_audio`, `voice_change`) | `8de5db95-e898-46a6-bb68-26d02f311686` · `element` |
| ElevenLabs (voz Marcela es-LATAM) | `86V9x9hr…` |

La causa del "voice not found" que hay registrado en la memoria era el **ID truncado en los
docs**, no la existencia de dos voces. Está completo arriba.

## 3. El único que sí es decisión de Sergio: el costo de `seedance_2_0`

Medirlo exige **generar**, y generar gasta créditos. Ese no se resuelve consultando.

Cuando haya OK: `balance` → una toma de **4 s en `seedance_2_0_mini`, `mode: fast`, 480p** →
`balance` otra vez. La diferencia es el costo unitario del piso. Con eso se presupuestan P20,
P21 y P22, que hoy dicen "sin medir".

---

## La lección de método (vale más que los tres arreglos)

De tres "bloqueos", **dos eran ignorancia, no falta de trabajo**. Se cayeron con dos consultas
gratis: un `ls` y un listado de voces.

**Antes de escribir un prompt para destrabar algo, verificar que esté trabado.** Un prompt para
"bajar los SFX que faltan" habría mandado a alguien a bajar archivos que ya estaban en el repo,
en otra carpeta. La regla del preámbulo de `PROMPTS_POR_SESION.md` —*buscá dónde vive la cosa
antes de crearla*— aplica igual a los bloqueos: **buscá si el bloqueo existe antes de encolarlo.**
