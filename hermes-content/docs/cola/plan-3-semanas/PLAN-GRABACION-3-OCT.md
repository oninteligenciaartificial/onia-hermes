# Plan de grabación · sábado 3-oct

Para Sergio Urcullo. Las piezas son **36**, no 38: según el archivo, D01-B y N03 ya están grabadas.
Fuente de los guiones: `hermes-content/docs/cola/plan-3-semanas/GRABAR-2-14-OCT.md`. Si cambia una frase, se cambia en `GUIONES-2-SEMANAS-1-14-OCT.md`.

## 0. Lo que tenés que saber antes de arrancar

- **Pantalla verde:** ninguno de nuestros referentes la usa, y el editor no tiene escrito el paso que recorta el fondo. Con tela verde se resuelve con el filtro chromakey de ffmpeg. Sin tela no hay un camino probado. Por eso el bloque verde se encuadra para que la misma toma sirva también como pantalla partida (receta Santiago, que sí está probada) si el recorte sale mal.
- **Capturas de páginas públicas** (README, precios, documentación): no las grabás vos, se sacan aparte. Vos grabás solo tu cara y las demos de tu PC.
- **La PALABRA del final:** cada pieza cierra con la suya. Hasta que funcione el paso de comentario a mensaje privado (hoy tiene 0 contactos), los comentarios se contestan a mano.
- **Tiempo total:** unas 8 h 45 min de grabación, sin contar descansos. Si no te alcanza el día, el bloque 4 (los 4 YouTube, unas 2 h 30 min) pasa a mañana.

## 1. Formato de cada pieza

Leyenda:
- **Verde:** pantalla verde con la captura detrás. Si el recorte falla, pantalla partida.
- **Erik:** cara a pantalla completa con tarjetas de datos sobre el pecho.
- **Rocha:** cabeza parlante con tres capas de texto.
- **Demo:** pantalla partida con la grabación de tu PC.
- **Top:** lista numerada.
- **REVISAR:** antes de grabar, abrí la fuente hoy y confirmá la fecha o el precio.

| Pieza | Palabra | Principal | Secundario | Por qué | Revisar |
|---|---|---|---|---|---|
| D02-B | TARIFA | Verde | Erik (cuenta en 3 pasos) | Noticia con prueba: la tabla de Meta detrás | REVISAR: era para el 1-oct; precios de Meta de hoy |
| D02-A | EFFORT | Verde | Demo (`/effort`) | Noticia: la doc de Anthropic es la prueba | REVISAR: noticia del 2-oct; confirmar que el default es medium |
| DD-A | CACHE | Verde | Erik (2 / 0,10 / 10 contra 10 / 1 / 50) | Precio comparado = prueba | REVISAR: precios de OpenAI del 2-oct |
| D04-C | MIRAR | Rocha | Antes/después (login roto y login sano) | Historia propia con una sola captura | - |
| D01-C | TRAMPA | YouTube horizontal | Demo (los dos modelos) | Comparación larga con la prueba corrida | REVISAR: precios de Opus y Sonnet 5.5 |
| N06 | ANTIGRAVITY | Verde | Demo (`agy` entrando) | Noticia con aviso oficial | REVISAR: que el aviso de geminicli siga igual |
| D01-A | SKILL | Erik | Demo | Tutorial de un minuto | - |
| N02 | MIGRAR | Verde | Demo (`/claude-api migrate`) | Noticia con fecha oficial | REVISAR: la nota del 30-sep en las release notes |
| S2-D07-A | VENTANA | Erik | Tarjeta con el error 131047 | Regla de negocio, la prueba es un error | - |
| D03-B | AGENTS | Verde | Erik (la tabla como tarjeta) | La tabla de la doc es la prueba | REVISAR: la tabla de la doc de hoy |
| N04 | VERIFY | Erik | Demo (crear verify en vivo) | Tutorial sobre una novedad | REVISAR: función del 30-sep |
| S2-D08-A | PROMESA | Erik | Antes/después (sin reglas / con dos listas) | Dos respuestas reales, lado a lado | - |
| D03-C | HISTORIA | YouTube horizontal | Demo (`/context` y las 3 pruebas) | Explicación larga con casos propios | - |
| R01 | DIAGRAMA | Verde | Demo (clic en un componente) | El truco se ve en la dirección | - |
| D03-A | HOOK | Rocha | Demo (settings y la guarda frenando) | Abre con la historia y cierra con el cómo | - |
| G04 | ESCANEO | Verde | Top de 3 pasos (Erik) | README detrás, tres pasos numerados | - |
| D04-A | DELEGAR | Rocha | Demo (el prompt de listar) | Historia propia | - |
| D04-B | DOCTOR | Erik | Demo (`/skill-doctor`) | 215 -> 110 entra como contador | - |
| R06 | CODEGRAPH | Verde | Erik (la tabla de 7 repos) | README detrás | - |
| S2-D12-B | CLAVE | Erik | Demo (el grep encuentra la clave) | El riesgo se ve en pantalla | - |
| G11 | REPOS | YouTube horizontal | Demo (trending, issues, LICENSE) | Muchas pruebas seguidas | REVISAR: cifras del trending al 30-sep |
| R03 | PDF | Verde | Demo, si corrés un PDF propio | README detrás | - |
| D05-A | WORKTREE | Erik | Demo (comandos git) | Tutorial con la historia de los 424 commits | - |
| R05 | MARKETING | Verde | Top (README contra STORE.md) | Las dos cifras distintas son la prueba | - |
| S2-D09-A | DOBLE | Erik | Tarjeta (aviso x2 -> 1 respuesta) | Explicación de negocio corta | - |
| D05-B | CHAT | Erik | Demo (cuenta Free en vivo) | Tutorial | - |
| R02 | DERECHOS | Verde | - | README y el aviso de la música | - |
| S2-D08-C | ANUNCIO | Verde | Erik | La página de Meta detrás | REVISAR: «desde el 1-oct» y la ventana de 7 días |
| D06-A | HANDOFF | Erik | Top (7 campos) | Lista que se arma en tarjetas | - |
| R07 | REMOTION | Verde | - | README y LICENSE | - |
| D05-C | CONTAR | Rocha | Lámina con el número 44 | Historia propia con un solo dato | - |
| S2-D07-C | CAPAS | YouTube horizontal | Demo (el control de ONIA y el If de n8n) | Explicación larga con prueba | - |
| G10 | README | Verde | - | README detrás | - |
| S1-D07-B | CONEXIONES | Rocha | Demo (`/usage`, `/context`) | Historia con medición | - |
| R04 | BUCLE | Verde | Demo (corre `main.py`) | README y la salida real | - |
| S2-D13-C | CLIENTE | Erik | Top (5 preguntas) | Lista numerada | - |

## 2. Orden de grabación por preparación (la escena se arma una sola vez)

Dentro de cada bloque, las piezas van en el orden en que se publican: si cortás antes, quedan hechas las más urgentes.

### Bloque 1 · Pantalla verde (16 piezas, unas 2 h 10 min)
- **Escena:** tela verde planchada a 1-1,5 m detrás tuyo, con una luz pareja para la tela y otra para vos. Nada verde en la ropa.
- **Encuadre:** de la cintura para arriba, con aire a los costados y la cabeza en la mitad de abajo del cuadro. Así la misma toma sirve como pantalla partida.
- **Tomas:** 2 por pieza. Señalá hacia arriba, donde va a ir la captura. Una idea por bloque y una pausa entre bloques.
- **Orden:** D02-B, D02-A, DD-A, N06, N02, D03-B, R01, G04, R06, R03, R05, R02, S2-D08-C, R07, G10, R04.
- **Cálculo:** 16 x 7 min + 15 min de armado.

### Bloque 2 · Cámara vertical, Erik y Rocha (16 piezas, unas 2 h 20 min)
- **Escena:** sacás la tela; misma silla y misma luz. Contraluz LED si tenés.
- **Encuadre:** plano medio, cabeza al 30 % del alto, cara un poco corrida a la derecha. El pecho queda libre (del 50 al 75 % del alto) para las tarjetas: solapa chica, nada en las manos.
- **Tomas:** 2 por pieza. En los Top, decí cada número en voz alta, con 1 s de pausa antes del ítem y 2 s después. Para las Demo grabás solo tu cara: la pantalla va en el bloque 5.
- **Orden:** D04-C, D01-A, S2-D07-A, N04, S2-D08-A, D03-A, D04-A, D04-B, S2-D12-B, D05-A, S2-D09-A, D05-B, D06-A, D05-C, S1-D07-B, S2-D13-C.
- **Cálculo:** 16 x 8 min + 10 min.

### Bloque 3 · B-roll (unos 20 min, con la misma luz de día)
- 10 a 15 planos verticales de 5-8 s, sin hablar, con el celular quieto o con movimiento lento.
- **Lista:** teclado escribiendo, scroll de Onia en el celular, la mano tocando «enviar» en WhatsApp, la PC vista desde atrás tuyo, tu cara mirando la pantalla, y un plano limpio del escritorio de 5 s para poner texto encima.
- 2 versiones de cada plano: una cerrada y una abierta.

### Bloque 4 · YouTube horizontal (4 piezas, unas 2 h 30 min)
- **Escena:** celular girado a horizontal (16:9) en el trípode, misma luz y misma solapa. Plano medio.
- **Orden:** D01-C, D03-C, G11, S2-D07-C.
- **Cálculo:** 4 x 35 min + 10 min.
- Si no llegás, este es el bloque que pasa a mañana.

### Bloque 5 · Pantalla de tu PC, sin cámara (unos 90 min)
- **Herramienta:** OBS o Recortes (Win+Shift+R) a 1920x1080, con el navegador al 125-150 %. Notificaciones apagadas, sin pestañas privadas.
- **Tomas:** una toma por demo, con 2 s de pausa entre pasos. Cortá los tiempos de carga en edición.
- **Demos:** D02-A `/effort`, D01-C los dos modelos, N06 `agy`, D01-A la skill, N02 migrate, N04 verify, D03-C las 3 pruebas, R01 el clic, D03-A la guarda, D04-A el prompt, D04-B skill-doctor, S2-D12-B el grep (**solo con una clave inventada**), D05-A worktree, D05-B la cuenta Free, S1-D07-B usage/context, S2-D07-C el control y el If, R04 `main.py`, D05-C la lista de n8n, D06-A el handoff (R03 solo si lo corrés).
- **Cálculo:** unas 20 demos x 4 min + 10 min.

**Total:** 2 h 10 + 2 h 20 + 20 min + 2 h 30 + 1 h 30 = **unas 8 h 50 min**.

## 3. Guía de formatos (una página)

### Nuestros referentes (medidos o vistos en sus cuentas)

**Pantalla partida, receta Santiago** (@sanmunoz.ia)
- Qué es: la prueba arriba (captura, tabla o titular) y tu cara abajo, con el subtítulo en la costura.
- Cuándo: noticia con prueba. Es el respaldo de toda pieza Verde.
- Cómo se graba: trípode, plano medio corto, solapa. Hablás por bloques y cerrás con 4 s de remate y «Chau».
- Cómo se edita: `santiago.py` con `--plan`; la tabla se te muestra antes. Algo cambia cada 3-5 s, de 5 a 8 pruebas, karaoke amarillo, 65-120 s.

**Tarjetas sobre el pecho, receta Erik** (@eriktaveras)
- Qué es: cara a pantalla completa con tarjetas claras del 51 al 75 % del alto, y números que entran como contador.
- Cuándo: tutorial, top o producto con datos.
- Cómo se graba: sentado, cabeza al 30 %, pecho libre.
- Cómo se edita: `erik_edit.py`. Una tarjeta cada 4-6 s y 3-5 cortes cada 10 s. Para las demos pasa a pantalla partida. 44-52 s (noticia) o 105-127 s (top).

**Top / lista** (Erik y Rocha)
- Qué es: lista numerada; una tarjeta o una caja por ítem.
- Cuándo: «las N herramientas o pasos».
- Cómo se graba: un ítem por bloque, con el número dicho en voz alta.
- Cómo se edita: el número que decís dispara la tarjeta. Las cajas van entre el 60 y el 72 % del alto, nunca sobre la cara.

**Tres capas, receta Rocha** (@soyenriquerocha)
- Qué es: cabeza parlante con título arriba, caja de palabra clave en el medio y subtítulo en minúsculas.
- Cuándo: tus historias («me pasó esto»). Es lo más cercano a tu marca. 53-89 s.
- Cómo se graba: celular a la altura de los ojos, luz cálida, fondo en penumbra, ropa lisa.
- Cómo se edita: capas en HyperFrames o editor-videos. El ritmo no está medido, todavía no se copia.

**Antes/después**
- Qué es: el mismo encuadre, arriba el resultado y abajo el original. La comparación es el gancho.
- Cuándo: S2-D08-A, D04-C, tutoriales de imagen o video.
- Cómo se graba: el material tiene que ser propio. Después, la pantalla del cómo y el CTA a cámara.
- Cómo se edita: dos paneles apilados en 1080x1920. 15-38 s.

**B-roll sin cara** (el corte «viral» de Santiago)
- Qué es: el caso real con un título de 2-5 palabras y música de la biblioteca de IG.
- Cuándo: como segundo corte del mismo tema (147 mil vistas contra 32,9 mil, aunque no fue un A/B limpio).
- Cómo se graba: planos del lugar o del objeto, con luz natural.
- Cómo se edita: el primer cuadro es la portada. La música se elige al subir.

**Remate corto a cámara** (Rocha)
- Qué es: primer plano cerrado, luz baja, 12-15 s y una sola línea de texto.
- Cuándo: humor o cierre.
- Cómo se graba: una toma.
- Cómo se edita: mínimo, solo la línea de subtítulo.

### De la web (sin datos medidos salvo donde se indica)

**Pantalla verde**
- Qué es: vos recortado delante de la captura.
- Cuándo: noticia o comentario.
- Cómo se graba: con tela verde, o con el efecto de TikTok/CapCut sin tela.
- Cómo se edita: hoy no hay paso escrito en el pipeline; con tela se hace con chromakey de ffmpeg. El «+31 %» que se lee por ahí es de un blog y no se usa.

**Reacción a noticia**
- Qué es: el titular más tu postura en una frase.
- Cuándo: el mismo día o el siguiente.
- Cómo se graba: qué pasó (5 s), qué significa para un negocio en Bolivia (10-15 s), qué hacer (5 s).
- Cómo se edita: con la receta Verde o Santiago.

**Tutorial con cara en recuadro (PiP)**
- Qué es: la pantalla grande y tu cara chica.
- Cuándo: paso a paso.
- Cómo se graba: la cara aparte con el celular, sin la burbuja de OBS. Aplaudí una vez al empezar para sincronizar.
- Cómo se edita: `split-layout.mjs`. La sincronización hoy se hace a mano.

**POV**
- Qué es: texto «POV: sos dueño de una clínica…» y una escena corta.
- Cuándo: mostrar el dolor del cliente.
- Cómo se graba: una escena de 10-20 s que termina en la pantalla real del sistema.
- Cómo se edita: texto y música. El «42 %» es de un blog.

**Carrusel en video**
- Qué es: 5-8 láminas de 2-3 s.
- Cuándo: sin cámara, para reciclar un carrusel.
- Cómo se graba: no se graba.
- Cómo se edita: HyperFrames. Solo material propio, nunca reposteos.

### Reglas para todos los formatos
- **Gancho:** la frase más fuerte primero, sin «hola, soy», con texto desde el primer cuadro. Grabá 2-3 ganchos por pieza para probarlos en Trial Reels. Dato medido (Facebook IQ, vía Kapwing): 65 % de quienes pasan los 3 s llega a 10 s.
- **Duración:** reacción y antes/después 15-30 s; top y tutorial 30-60 s; hasta 90 s solo si cada bloque trae algo nuevo. Dato de terceros: la mejor interacción está en 21-34 s.
- **Subtítulos siempre:** +12 % de tiempo de visualización (medido, Kapwing y Facebook IQ). 2-4 palabras por línea y la palabra clave en verde.

## 4. Checklist antes de apretar grabar

1. Celular en el trípode, a la altura de los ojos, lente limpio. Vertical (horizontal solo en el bloque 4).
2. Exposición y foco bloqueados sobre la cara (mantené apretado sobre la cara).
3. Luz de frente o a 45 grados. Nada de ventana detrás. Luz del techo apagada si marca sombras.
4. Solapa a un palmo de la boca. Probá 10 s y escuchá con auriculares.
5. Ventilador y aire apagados. Modo avión en el celular, notificaciones de Windows apagadas.
6. Batería al 80 % o más y 20 GB libres como mínimo.
7. Bloque verde: tela planchada y separada de vos, ropa sin verde, aire a los costados.
8. Bloque 2: el pecho libre del 50 al 75 % del alto; nada en las manos.
9. Antes de cada pieza REVISAR: abrí la fuente y confirmá la fecha o el precio. Si cambió, corregilo en `GUIONES-2-SEMANAS-1-14-OCT.md` antes de grabar.
10. Guion a mano: gancho (2-3 versiones), bloques y PALABRA.
11. Hablá por bloques, una idea por bloque, con 2 s de pausa. Si te trabás, repetí la frase entera.
12. Al final de cada pieza: el remate con «Chau» (4 s) y 3 s quieto, en silencio, mirando al lente.
13. Bloque 5: navegador al 125-150 %, sin pestañas privadas. En S2-D12-B, solo la clave inventada.
14. Nombrá cada archivo con el código de la pieza al terminarla (D02-B_toma1…) para que la edición no adivine.
