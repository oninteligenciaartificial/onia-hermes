# TikTok que mandó Sergio Urcullo (3-oct-2026): «Día 4/7 · Skills de Claude», la skill UI/UX Pro Max

`https://vt.tiktok.com/ZSbm3Scje/` → `https://www.tiktok.com/@kevinarce98/video/7690718770599316757`
**@kevinarce98** («Kevin Arias | Dev + IA», firma `kevinarias.dev`) · **45,8 s** · 1080×1920 · 30 fps · subido el
29-sep. Al 5-oct tenía 141.100 vistas, 13.700 likes, **11.361 guardados** (83 % de los likes), 1.352 compartidos y
**72 comentarios**. En español: la voz tutea y los textos de pantalla van en voseo.

Caption: «Los devs escogiendo colores: "azul, porque sí" 😂 Skill de nextlevelbuilder en GitHub. #diseñoUI #uxui
#ClaudeAI #programacion #IA».

**Cómo se miró** (regla del 3-oct: mensaje, tema y edición):
- Se bajó con `fetch-video.mjs`. En esta nube no había `yt-dlp`: se instaló `yt-dlp[default,curl-cffi]`, como dice
  `edicion-referentes`. Metadatos con `--write-info-json`.
- Sin Gemini: no hay `GEMINI_API_KEY` en la nube (`gemini-see-video.mjs` → «falta GEMINI_API_KEY»).
- La transcripción por `transcribe.sh` falló porque el contenedor no tiene `ssh` (`scp al VPS falló`). Se hizo local
  con `faster-whisper` y el mismo modelo que usa Speaches (`Systran/faster-whisper-small`, `es`, con palabras). Lo que
  Whisper oyó mal se corrigió con el subtítulo quemado: «la skill» y no «Last Kill» (1,64 s); «con IA» y no «con mía»
  (41,0 s).
- **Cobertura:** audio 100 %. Se miraron los 46 cuadros a 1 fps, **los 90 cuadros de 0-3 s uno por uno**, ventanas a
  10 fps en las 9 transiciones y los 12 picos de `text-frames.mjs`.
- **Mediciones:** detección de escena (`select='gt(scene,…)'`), diferencia cuadro a cuadro, posición de la caja del
  subtítulo cuadro a cuadro, `ebur128` y espectrogramas de las pausas.
- **El audio no se escuchó.** La música y los efectos se deducen del nivel y del espectrograma en las pausas de voz.
  Mientras él habla, no se pueden separar.

## Mensaje

Literal:
- «Día 4 de 7, la skill que escoge colores y te ayuda a mejorar la experiencia de usuario.»
- «Esta skill tiene una base de datos de estilos, paletas, combinaciones de fuentes y todas las guías de experiencia
  de usuario que necesitas en tu aplicación.»
- «Solo le dices que revise problemas de accesibilidad en los diferentes botones y elementos y te hará un listado de
  todos los problemas que debes de corregir.»
- «Es muy útil, ya que tienes la parte de experiencia de usuario e interfaz en una sola skill: tendrías toda la parte de
  diseño cubierta.»
- «Mañana: ¿por qué todas las páginas hechas con IA dicen lo mismo y cómo evitarlo?»

Le habla al programador que usa Claude Code y no es diseñador. El caption lo dice: «los devs escogiendo colores:
"azul, porque sí"».

| Tramo | Qué se ve | Qué se dice |
|---|---|---|
| 0-1,6 s | Portada «Día 4/7 · Skills de Claude». Siete soportes en «T»: los días 1-3 con su miniatura, el 4 con marco azul y los 5-7 vacíos | «Día 4 de 7,» |
| 1,7-5 s | «UI/UX Pro Max» con la URL `github.com/nextlevelbuilder/ui-ux-pro-max-skill`. Abanico de paletas (2,6-5 s) | «la skill que escoge colores y te ayuda a mejorar la experiencia de usuario.» |
| 5-7 s | Tarjeta de una app de tareas («Tareas de hoy», botón «Empezar») | pausa de voz, 5,8-7,0 s |
| 7-14 s | «Esta skill tiene una **base de datos.**» Cuatro contadores: **79** estilos · **192** paletas · **74** combinaciones de fuentes · **119** guías de UX | «Esta skill tiene una base de datos de… tu aplicación.» |
| 14-17 s | Al frente, la ficha «#36 Accessibility · Color Contrast · Minimum 4.5:1 ratio for normal text» | pausa de voz, 14,7-17,2 s |
| 17,4-19,6 s | «Solo le pedís que revise» y una terminal «claude — sobres» que tipea: «revisá los problemas de accesibilidad en los diferentes botones y elementos de la app y haceme un listado de todo lo que debo corregir» → «Usando la skill ui-ux-pro-max» | «Solo le dices que revise problemas de accesibilidad…» |
| 19,7-23 s | «la **accesibilidad.**» Un teléfono con la app «sobres» (montos en ₡) y 6 marcadores rojos numerados | «…en los diferentes botones y elementos y te hará…» |
| 23-29 s | «Y te hace un **listado.**» Lista «Accesibilidad · Sobres»: Texto gris ilegible (Crítico), Transferidos casi invisibles, Botones diminutos, Copiar monto solo con hover, Foco equivocado en ₡/$, Borra sin preguntar (Alto). Abajo: **«29 problemas» · 2 críticos · 8 altos · 10 medios · 9 bajos** | «…un listado de todos los problemas que debes de corregir.» Pausa de voz de 25,3 a 29,1 s |
| 29-38 s | «Es muy útil: UX + UI en una sola **skill.**» Dos tarjetas: UX («Aa» 2.85:1 → 4.87:1 y cinco ítems) y UI (paleta, «Playfair Display + Inter» y cinco ítems), que se tildan una por una → «Todo el diseño, cubierto · 10/10 categorías» | «Es muy útil… diseño cubierta.» |
| 38,5-45,8 s | «Mañana **Día 5/7**»: 9 landings iguales («Lleva tu negocio al siguiente nivel / Empezar gratis»), «05 Páginas con IA que dicen lo mismo.» y la firma «Kevin Arias kevinarias.dev» (43,7 s) | «Mañana: ¿por qué todas las páginas hechas con IA dicen lo mismo y cómo evitarlo?» |

## Tema

**Una herramienta gratis de GitHub que resuelve un dolor de programador**: no saber elegir colores ni revisar la
accesibilidad. Se muestra con **el resultado sobre una app real** (29 problemas clasificados), no con una explicación.

Por qué rinde:
- **Es una serie numerada.** «Día 4/7» y la barra de 7 segmentos crean hábito. El cierre promete el día 5 con otro
  dolor («todas las páginas hechas con IA dicen lo mismo»).
- **Es contenido para guardar.** Tiene 11.361 guardados contra 72 comentarios: no pide comentar, pide volver. Es la
  misma familia que nuestra serie R (repos para Claude Code).

## Edición (verificada en los cuadros)

**No hay cara ni cámara.** Todo el video es motion graphics con voz en off, sobre un fondo blanco hueso con un brillo
cálido arriba y un degradé gris abajo. El 22 % de abajo (por debajo de y≈1500) queda vacío: es la zona que tapa la
interfaz de TikTok.

Arriba, todo el video, hay una barra de 7 segmentos (y≈10 %). Los segmentos 1-3 están en negro. El 4 se llena en azul
al ritmo del video (≈20 % a los 9 s, ≈80 % a los 36,8 s) y los 5-7 están en gris. Desde 7,0 s, debajo de la barra va
el chip «● Día 4/7 · Skills de Claude».

### 1. Ritmo de corte

**Cero cortes secos.** Con el umbral de escena en 0,25 no detecta ninguno; con 0,12, tampoco. El valor máximo del
video es 0,097, en 38,43 s. Cada cambio es una transición animada. Por eso se miden **los cambios de pantalla**: el
gráfico central se reemplaza.

| Tramo | Cortes secos | Cambios de pantalla (s) | Elementos que entran (contados en las hojas) | Bloques de subtítulo |
|---|---|---|---|---|
| 0-10 s | 0 | **4**: 1,67 · 2,7 · 5,0 · 7,0 | ~15 (miniaturas, «/7», letras, URL, abanico, tarjeta, contadores) | 9 |
| 10-20 s | 0 | **3**: 14,0 · 17,4 · 19,9 | ~10 (2 contadores, fichas, Color Contrast, terminal, tipeo, teléfono) | 8 |
| 20-30 s | 0 | **2**: 23,2 · 28,9 | ~9 (6 marcadores, lista en cascada, contador 6→29, 4 píldoras) | 6 |
| 30-40 s | 0 | **1**: 38,5 | ~6 + 10 tildes (UX, UI, «una sola skill.», checklist, banda 10/10, «Día 5/7») | 8 |
| 40-45,8 s | 0 | 0 (la grilla entra en 40,1-40,7, dentro de la misma pantalla) | 4 (9 landings, leyenda «05», tachado, firma) | 3 |

**El ritmo se frena:** 4 → 3 → 2 → 1 cambios por cada 10 s.

La voz va a **3,24 palabras/s** mientras habla y a 2,55 en promedio. Tiene **4 pausas largas que dejan terminar al
gráfico**: 1,2 s (5,8-7,0), 2,6 s (14,7-17,2), **3,8 s** (25,3-29,1) y 1,7 s (37,1-38,7). En ninguna pausa la pantalla
queda quieta del todo, salvo 14,5-16,9 s, que es la ficha «Color Contrast» fija. La diferencia entre cuadros en ese
tramo es ≈0.

### 2. Subtítulos

- **Caja:** negra sólida, rectangular, sin redondeo, de ~84 px de alto (a 1080 de ancho). Va centrada y su centro
  queda en **y≈1412, el 73,5 % del alto**, fijo de 0,17 a 44,8 s. Medida cuadro a cuadro; el ancho va de 210 a 660 px.
- **Letra:** sans grotesca bold de ~46 px, en minúsculas como se habla y con puntuación («Día 4 de 7,», «¿Y cómo
  evitarlo?»).
- **Animación:** karaoke por revelado. El bloque entra entero con corte de 1 cuadro y sin pop. Lo ya dicho va en
  **blanco**; lo que falta, en **gris medio**. Se ve en los recortes de 4,6 s («a mejorar | la experiencia»), 18,9 s
  («revise problemas | de») y 40,0 s («¿por qué | todas las»).
- **Bloques:** 2-4 palabras, 34 bloques en 43 s, ~1,1-1,3 s cada uno.
- **Se apaga en las pausas** (6,3-7,3 s; ~25-29,3 s; 37,6-38,7 s), salvo «tu aplicación.», que queda de 14,1 a 17,1 s.
  Se mueve una sola vez: entre 17,47 y 17,67 s entra deslizándose desde la derecha junto con la terminal (x de 818 a
  278 px).
- **Transcribe la voz tal cual, aunque la lámina diga otra cosa.** A los 17,6 s el subtítulo dice «Solo le dices que»
  y el titular, «Solo le pedís que revise».
- **El titular de la lámina es otra pieza** (y≈16-22 %) y tiene dos pisos:
  - arriba, una línea chica en gris medium;
  - abajo, una línea heavy en negro con la palabra clave en color: azul en «datos.», «accesibilidad.», «skill.» y
    «5/7»; coral en «listado.».
  - Sube desde una máscara: a los 8,0 s «base» está a medio subir.

### 3. Transiciones, zooms, b-roll, efectos de sonido y música

**Transiciones** (todas animadas, de 0,2 a 0,5 s):
- **1,47-1,63 s:** la portada se desvanece y sube.
- **1,67-2,40 s:** «UI/UX Pro Max» cae letra por letra, con cada letra rotada y pasando de gris a negro; la «/» va en
  azul.
- **2,63-3,5 s:** una tira de paleta sube desde abajo y se abre en abanico, mientras el título se corre hacia arriba.
- **5,0-5,3 s:** del abanico se arma la tarjeta: primero el esqueleto (bloque verde azulado y barra naranja), después
  el contenido.
- **6,97-7,4 s: empuje vertical.** Lo viejo sale por arriba y lo nuevo entra desde abajo. Es el pico de movimiento del
  video: 203 de diferencia en 0,5 s.
- **9-13 s:** cada contador sube en el mismo tramo en que se dice su palabra, con ±0,5 s de diferencia (Whisper corre
  los tiempos hasta 0,3 s). Medido en las hojas a 1 fps:
  - «estilos» (9,08 s): 78 a los 9 s, 79 a los 10 s;
  - «paletas» (9,82 s): 192 a los 10 s;
  - «combinaciones» (10,48 s): 34 a los 10 s, 74 a los 11 s;
  - «guías» (12,4 s): 85 a los 12 s, 119 a los 13 s.

  Detrás de cada contador asoman fichas («Glassmorphism», «Fintech/Crypto», «Classic Elegant · Playfair Display»,
  «#36 Color Contrast»).
- **17,0-17,5 s: empuje horizontal** hacia la izquierda, que arrastra también el subtítulo. Después, tipeo con cursor
  de 17,5 a 19,3 s.
- **19,6-20,1 s:** el teléfono sube por encima de la terminal, que se oscurece y queda atrás. Entre 20,5 y 22 s
  aparecen los marcadores rojos con contorno punteado.
- **23,0-23,9 s:** la lista cae desde arriba sobre el teléfono, el teléfono sale y las filas entran en cascada.
- **24,9-25,8 s:** sube la barra negra, el contador corre 6 → 12 → 23 → 27 → 28 → 29 y aparecen las 4 píldoras.
- **28,8-29,3 s:** destello cálido naranja sobre la lista y fundido a blanco. Las tarjetas UX/UI aparecen lavadas y
  ganan contraste.
- **31 y 33 s:** se «enciende» UX y después UI, cada una con su palabra. Entre 34 y 36,6 s se tildan los 10 ítems y a
  los 36,9 s sube la banda azul «Todo el diseño, cubierto 10/10».
- **38,0-38,9 s:** todo se achica y sube (zoom-out con empuje). Queda «Mañana» en blanco y entra «Día 5/7» en heavy.
- **40,1-40,7 s:** 9 landings iguales entran en cascada en una grilla de 3x3. Entre 43,0 y 43,3 s se apagan y queda
  resaltada la del centro, con el titular tachado en rojo.
- **45,0-45,8 s:** cuadro final quieto.

**Zooms:** no hay punch-in porque no hay cámara. Hay dos zooms de gráfico:
- 14,0-14,3 s: la ficha #36 se adelanta y el resto baja a ~20 % de opacidad;
- 38,0-38,5 s: zoom-out.

**B-roll:** nada filmado. Todo son mockups animados: terminal, teléfono con la captura de la app «sobres», tarjetas y
contadores.

**Motivo que se repite:** las tarjetas cuelgan de un soporte en «T» con un brillo cálido debajo. Pasa con las
miniaturas de los días (0-1,6 s), con la lista, con UX/UI y con la grilla (23-45 s).

**Sonido:** −16,0 LUFS integrado, LRA 5,7 LU, pico −0,4 dBFS. Voz en off sola.
- **Música:** una cama tenue. En las pausas queda a −31/−36 dB RMS, 15-20 dB por debajo de la voz. El espectrograma
  muestra notas sostenidas (armónicos entre 400 y 1.600 Hz) que cambian de nota cerca de 27,0 y 28,6 s.
- **Efectos.** Solo se pueden ver en las pausas:
  - 17,35-17,45 s: una ráfaga de golpes cortos, justo antes de que arranque el tipeo;
  - 25,71 s: un «ding» tonal de ~1,9 kHz (pico −10 dBFS, el más fuerte fuera de la voz), cuando cierra el contador y
    entran las píldoras;
  - 36,9-37,4 s: un arpegio de 5-6 «blips» que suben de 1,6 a 5,1 kHz, con la banda 10/10;
  - 37,92 y 38,4 s: dos golpes en el empuje hacia «Mañana»;
  - 43,68-44,9 s: un tono sostenido de ~3 kHz cuando entra la firma.

### 4. Primeros 3 s, cuadro por cuadro (90 cuadros a 30 fps)

| Cuadro (s) | Qué pasa |
|---|---|
| 0 (0,000) | Ya están en pantalla «**Día 4**» en negro heavy, la barra de 7 segmentos (3 llenos) y la primera miniatura colgando de su «T». **La voz arranca en este cuadro** («Día» en 0,00 s). Todavía no hay subtítulo |
| 1-4 (0,033-0,133) | Entran en cascada las miniaturas de los días 2 y 3. «Skills» empieza a subir desde una máscara |
| 5 (0,167) | Aparece «/7» en gris claro y la caja «Día 4 de 7,», con solo «Día» en blanco |
| 5-11 (0,167-0,367) | «Skills de Claude» sube palabra por palabra |
| 11-14 (0,367-0,467) | Entra la miniatura del día 4 con marco azul: llega grande y se asienta |
| 15-28 (0,50-0,93) | La imagen queda quieta y avanza el karaoke: «Día 4 de 7,» queda todo en blanco a los 0,83 s |
| 29-39 (0,97-1,30) | Entran los soportes vacíos de los días 5, 6 y 7 («05 06 07»), uno cada ~0,1 s |
| 44-49 (1,47-1,63) | La portada se desvanece y sube |
| 50 (1,667) | Único cuadro casi vacío: empiezan a caer la «U» y la «/» azul |
| 51 (1,70) | Subtítulo «la skill que escoge» |
| 50-72 (1,67-2,40) | «UI/UX Pro Max» cae letra por letra |
| 73 (2,433) | Aparece la URL `github.com/nextlevelbuilder/ui-ux-pro-max-skill` |
| 79-89 (2,63-2,97) | Sube desde abajo una tira de paleta (verde azulado, naranja) y el título se corre hacia arriba. El abanico se abre entre 3,0 y 3,5 s, sobre la palabra «colores» (3,18 s) |

**Lectura:** el gancho **no es un dolor dicho**. Es la serie («Día 4 de 7») más el nombre de la herramienta, con algo
que entra cada 0,1-0,3 s. El chiste del dolor («azul, porque sí») está solo en el caption, no en el video.

## Qué tomar (marca personal de Sergio Urcullo)

- **Copiar: la serie numerada y el cierre «Mañana».** El chip «Día N/7» y la barra de 7 segmentos van arriba (todo el
  video). El remate «Mañana: Día N+1/7» nombra el próximo dolor (38,7-45,8 s). Nuestra serie R (R01-R07) también tiene
  siete. Este cierre reemplaza al «comentá N», que hoy no tiene envío automático: acá hubo 72 comentarios contra
  11.361 guardados. Ponerle nombre a la serie y prometer el día siguiente lo decide Sergio Urcullo. Además, el «mañana»
  solo se promete si ese video ya está grabado.
- **Copiar: la prueba con el dato real, que se arma mientras se dice.** Los contadores suben con su palabra
  (79/192/74/119, 9-13 s) y el listado de 29 problemas está hecho sobre una app real (23-25,8 s). Es el piso común de
  `edicion-referentes` («tarjetas con código y dato real») y la regla de Erik «cada número dicho entra como contador».
  En los moldes Pablo o Erik va en la mitad de arriba o sobre el pecho, no a pantalla completa.
- **Copiar: el titular de dos pisos.** Una línea chica en gris y otra heavy con la palabra clave en color (8,0, 19,7,
  23,0 y 34 s). Sirve como lámina de 1,5-3 s del molde Erik, con el verde ONIA en lugar del azul.
- **No copiar: el formato sin cara, sus pausas ni sus transiciones.** Las pausas de 2,6-3,8 s (14,7-17,2 y 25,3-29,1)
  y los empujes animados funcionan porque nadie está a cámara. En el talking head de Sergio Urcullo serían la cara
  callada. Santiago no deja pausas de más de 0,6 s y Erik solo corta seco. Si alguna vez se hace sin cara, el molde es
  Boceto (HyperFrames).
- **No copiar: la caja negra con karaoke gris ni la mezcla de tú y vos.** El subtítulo lo fija el molde: en Erik,
  mayúsculas sin caja con la palabra activa en verde; en Pablo, la palabra clave fija en amarillo. Él dice
  «dices»/«tienes» mientras la pantalla dice «pedís»/«revisá» (17,6 y 18,8 s). Sergio Urcullo habla en voseo y usa un
  solo registro en todo.
