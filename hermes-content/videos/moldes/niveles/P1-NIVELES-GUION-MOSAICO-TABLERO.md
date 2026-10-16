# P1 «Niveles» sobre el molde mosaico-tablero · guion de tarjetas

**LISTA PARA MOSTRAR: P1 Niveles (guion).** Pedido de la MADRE MARKETING, 11-oct. Sin render: el guion, los textos (de vos), la cuenta verificada y la captura real quedan listos para armar P1 **apenas Sergio Urcullo apruebe el molde** (`videos/moldes/mosaico-tablero/`, que sigue esperando su revisión; no se usa ni se publica antes). Reemplaza el plan de molde propio y 45 s de `GRABAR-10-16-OCT.md` §P1 v4 (se conserva ahí el mensaje, el aviso y la cuenta; cambia el molde y la duración).

## Tres decisiones para aprobar

1. **40 s sobre la gramática del molde, no 30.** Los tres primeros cortes no cambian (2,5 / 9 / 16 s). El tablero pasa de 7 a **14 s** (16-30) porque ahí viven los dos niveles que explican algo (Sonnet + prueba y Reparto); el mosaico entra a los 30 s y el cierre a los 34. En 30 s el texto subía a ~190 palabras por minuto; en 40 s da **103 palabras = 154 por minuto** (la regla es 150-170). Cuesta regenerar dos costuras con `seam-stamp.mjs` (ver «Qué cambia en el molde»).
2. **El verde del molde se apaga.** El molde pinta de verde 10 cosas (lista abajo); P1 deja el verde **solo en el 0,10 y en el cierre** (la regla de P1 v4: el verde es «lo que se aprieta»). Todo lo demás va en blanco y gris sobre negro. Sin rojo: las ✓ y ✗ son marcas blancas y grises.
3. **El «tablero» muestra 4 niveles de costo, no el producto.** El README del molde frena el tablero porque muestra Agenda/Clientes/Cobros/Chat (función del producto sin la tabla «se promete / funciona»). P1 lo usa para otra cosa, así que esa traba no le aplica. **Lo que sí pasa por Sergio Urcullo** (CLAUDE.md, contenido en redes): la pieza **muestra la página de precios de un tercero (Anthropic)**.

## Guion por tarjeta (1080×1920 · 40 s · sin voz)

Textos exactos en pantalla. «Elemento» es el id del molde que se reutiliza; «(nuevo)» es lo que hay que agregar. Las palabras cuentan una por cada palabra o número; los signos + = → · × ÷ ✓ ✗ no cuentan.

| Escena | t (s) | Elemento | Texto en pantalla | Pal. |
|---|---|---|---|---|
| Fijo (0-40 s) | 0,0 | #p1-rotulo (nuevo) | «MISMO TRABAJO: 0,60 → 0,10 USD» | 5 |
| 1 · Gancho (0,0-2,5 s) · #hook | 0,0 | #hook-context | «En Claude,» | 2 |
| 1 · Gancho (0,0-2,5 s) · #hook | 0,4 | #hook-verb | «¿cuánto te cuesta» | 3 |
| 1 · Gancho (0,0-2,5 s) · #hook | 1,0 | #hook-lo | «CADA» | 1 |
| 1 · Gancho (0,0-2,5 s) · #hook | 1,3 | #hook-word | «TAREA?» | 1 |
| 2 · Repetición (2,5-9,0 s) · #chat | 2,5 | rótulo de la captura (nuevo) | «platform.claude.com/docs/en/about-claude/pricing» | 1 |
| 2 · Repetición (2,5-9,0 s) · #chat | 3,0 | sello (nuevo) | «PRECIOS 11-OCT» | 2 |
| 2 · Repetición (2,5-9,0 s) · #chat | 3,4 | #p1-contador (nuevo, queda hasta el final) | «0,60 POR TAREA» | 3 |
| 2 · Repetición (2,5-9,0 s) · #chat | 4,2 | .heading | «10 tareas iguales» | 3 |
| 2 · Repetición (2,5-9,0 s) · #chat | 6,0 | línea bajo las casillas (nuevo) | «40.000 entran · 4.000 salen» | 4 |
| 2 · Repetición (2,5-9,0 s) · #chat | 6,5 | #repeat-count | «×10 ejemplo» | 2 |
| 2 · Repetición (2,5-9,0 s) · #chat | 7,0 | nota al pie fija (nuevo, hasta 34 s) | «Supuestos: falla 1 de 5 · reparto 6/3/1» | 7 |
| 3 · Comparación (9,0-16,0 s) · #compare | 9,3 | .column-title izq. | «TODO FABLE» | 2 |
| 3 · Comparación (9,0-16,0 s) · #compare | 10,3 | cuenta izq. | «0,40 + 0,20 = 0,60» | 3 |
| 3 · Comparación (9,0-16,0 s) · #compare | 12,0 | .column-title der. | «TODO OPUS» | 2 |
| 3 · Comparación (9,0-16,0 s) · #compare | 13,0 | cuenta der. | «0,16 + 0,08 = 0,24» | 3 |
| 3 · Comparación (9,0-16,0 s) · #compare | 14,0 | #p1-contador | «0,24» | 1 |
| 4 · Tablero (16,0-30,0 s) · #board | 16,0 | #mod-agenda → nivel 01 | «TODO FABLE 0,60» | 3 |
| 4 · Tablero (16,0-30,0 s) · #board | 16,4 | #mod-clients → nivel 02 | «TODO OPUS 0,24» | 3 |
| 4 · Tablero (16,0-30,0 s) · #board | 17,0 | #mod-payments → nivel 03 (foco) | «SONNET + PRUEBA» | 2 |
| 4 · Tablero (16,0-30,0 s) · #board | 17,8 | detalle 03 | «0,12 por tarea» | 3 |
| 4 · Tablero (16,0-30,0 s) · #board | 19,5 | detalle 03 | «2 fallan → Opus» | 3 |
| 4 · Tablero (16,0-30,0 s) · #board | 21,0 | detalle 03 | «0,168» | 1 |
| 4 · Tablero (16,0-30,0 s) · #board | 22,0 | #p1-contador | «0,17» | 1 |
| 4 · Tablero (16,0-30,0 s) · #board | 23,0 | #mod-chat → nivel 04 (foco) | «REPARTO» | 1 |
| 4 · Tablero (16,0-30,0 s) · #board | 24,0 | detalle 04 | «6 Haiku · 3 Sonnet · 1 Opus» | 6 |
| 4 · Tablero (16,0-30,0 s) · #board | 26,0 | detalle 04 | «fallan 2 → suben uno» | 4 |
| 4 · Tablero (16,0-30,0 s) · #board | 27,5 | detalle 04 | «0,0996» | 1 |
| 4 · Tablero (16,0-30,0 s) · #board | 28,5 | #p1-contador (verde) | «0,10» | 1 |
| 5 · Mosaico (29,95-34,0 s) · #mosaic | 30,05 | #mosaic-chat → tarjeta 1 | «TODO FABLE 0,60» | 3 |
| 5 · Mosaico (29,95-34,0 s) · #mosaic | 30,15 | #mosaic-compare → tarjeta 2 | «TODO OPUS 0,24» | 3 |
| 5 · Mosaico (29,95-34,0 s) · #mosaic | 30,25 | #mosaic-board → tarjeta 3 | «SONNET + PRUEBA 0,17» | 3 |
| 5 · Mosaico (29,95-34,0 s) · #mosaic | 30,35 | #mosaic-count (verde) → tarjeta 4 | «REPARTO 0,10» | 2 |
| 5 · Mosaico (29,95-34,0 s) · #mosaic | 31,55 | #mosaic-caption | «SUBÍ SI FALLA» | 3 |
| 6 · Cierre (34,0-40,0 s) · #close | 34,0 | .close-title | «Probá con el más barato que alcance.» | 7 |
| 6 · Cierre (34,0-40,0 s) · #close | 36,15 | .cta-label (verde) + línea | «Buscá NIVELES en Avisos · link en mi perfil» | 8 |
| **Total** | | | | **103** |

**Qué se ve en cada escena (movimiento del molde, contenido de P1):**
- **1 · Gancho.** La frase se arma por palabras, como el molde (contexto → verbo → «CADA» → palabra dominante). Claude aparece a los 0,0 s (antes de 1,2 s); la palabra dominante es **TAREA?** en blanco, con la regla blanca debajo.
- **2 · Repetición.** A 2,5 s entra la **captura real** (`precios-tabla-3col.png`, de 120 % a 100 % en 3-4 cuadros, rotada −3°) con la URL escrita debajo y el sello «PRECIOS 11-OCT» (−5°): la prueba está en pantalla **antes de los 3 s**. A 4,0 s la captura se achica a una esquina y las **10 casillas** se llenan de a una (es la «consulta repetida» del molde): una tarea igual cada ~0,2 s. El «×40 / ejemplo» del molde pasa a «×10 / ejemplo». El contador «0,60» queda quieto: el molde no lo mueve hasta la escena 3.
- **3 · Comparación.** Dos columnas con las **mismas 10 tareas**: TODO FABLE (0,60) y TODO OPUS (0,24). En cada columna va una **pastilla recortada de la captura real** con los dos precios de ese modelo (rectángulos abajo) y la cuenta debajo, un término por vez. El contador baja a 0,24. Ninguna columna lleva borde verde.
- **4 · Tablero (el centro del video).** Cuatro módulos 2×2 = los cuatro niveles; el **borde activo** (blanco) guía la lectura. 16-17 s: entran TODO FABLE y TODO OPUS en gris (ya vistos). 17-23 s: foco en SONNET + PRUEBA: las 10 casillas con 8 ✓ y 2 ✗, flechas de las ✗ a «Opus», «0,168» y el contador a 0,17. 23-29 s: foco en REPARTO: las 10 casillas rotuladas H, S y O (6, 3 y 1), una ✗ en una H que sube a S y una ✗ en una S que sube a O, «0,0996». 28,5 s: **el contador llega a 0,10, verde, la única vez**.
- **5 · Mosaico.** Las cuatro tarjetas del mosaico recuperan los cuatro niveles con su costo y una barra cada una (la escalera 0,60 · 0,24 · 0,17 · 0,10). La tarjeta REPARTO es la verde. No agrega ningún dato nuevo. Mismo desfase que la corrección del 11-oct: el mosaico entra 0,05 s antes del corte.
- **6 · Cierre.** «Probá con el más barato que alcance.» a 34,0 s, quieta; a 36,15 s el CTA (único): «Buscá NIVELES» en verde y debajo «en Avisos · link en mi perfil». Se sostiene hasta el último cuadro (3,85 s).

**Ritmo.** 103 palabras en 40 s = 154 por minuto (regla 150-170). El tramo más cargado es el 2,5-9 s: 22 palabras (3,4 por segundo), pero incluye la URL y el sello, que se ven más de lo que se leen; v4 llegaba a 5 por segundo. **Sonido:** el molde no trae audio. P1 lleva una cama ambiental a −14 LUFS, sin voz y sin SFX; la pista y su licencia se eligen en la PC (ver «Qué falta»).

## La captura real de la tabla de precios

**Va una sola, y ya está sacada (hoy, desde la nube, sin tocar TLS):**
- `hermes-content/videos/moldes/niveles/capturas/precios-tabla.png` (1520×1224, es 760×612 px de pantalla a 2×) y su versión `precios-tabla-3col.png` (884×1224: solo Model · Input · Output; las columnas de caché las corta el propio sitio con su scroll horizontal y quedan fuera, sin retocar un píxel).
- Fuente: `https://platform.claude.com/docs/en/about-claude/pricing`, leída el **2026-10-11 a las 15:01 UTC** (11:01 en La Paz). Es lo que dice el sello «PRECIOS 11-OCT».
- Muestra, en el bloque principal de la página, las cuatro filas que usa P1 (Fable 5.1, Opus 5.5, Sonnet 5.5 y Haiku 5.5 con sus **dos** tramos: «hasta 100.000 tokens» y «más de 100.000»). La tarea de 40.000 queda en el primer tramo; el segundo se ve y **no se tapa**.
- `capturas.json` guarda los rectángulos de cada fila y celda (px de la captura, `[x, y, ancho, alto]`): `fable-entrada` [462, 373, 128, 38], `fable-salida` [683, 373, 136, 38]; `opus-entrada` [462, 547, 118, 38], `opus-salida` [683, 547, 136, 38]; `sonnet-entrada` [462, 722, 118, 38], `sonnet-salida` [683, 722, 128, 38]; `haiku-entrada` [462, 845, 152, 176], `haiku-salida` [683, 913, 160, 38].

**Pastillas de la escena 3 (recortes de la captura, x0,y0,x1,y1 en px de `precios-tabla.png`):** Fable 5.1 [440,330,884,450] · Opus 5.5 [440,504,884,624] · Sonnet 5.5 [440,679,884,799] · Haiku 5.5 hasta 100.000 [440,829,884,1037] · Haiku 5.5 más de 100.000 [440,1037,884,1211].

**Qué se tapa: nada de lo que importa.**
- Los precios, los nombres de los modelos y el tramo de Haiku quedan a la vista, sin cubrir.
- El script de captura (`capturar-anthropic.mjs`) oculta lo **fijo** de la página (la barra de arriba y el botón «Ask Docs»), que taparía el recorte. No hay barra del navegador, perfil, pestañas ni datos de nadie.
- **La URL va escrita bajo la captura**, copiada de `capturas.json`; no se dibuja un navegador falso. Si la madre prefiere una captura de ventana con la barra de direcciones, tendría que tapar el avatar de perfil, las extensiones, las otras pestañas y los marcadores: **no hace falta**.

**Qué falta sacar desde la PC: ninguna captura.** (La nota de GRABAR v4 decía que Chromium no abre esa página: hoy sí abre, desde la nube, con el mismo script que usó N07.) **Pasos de PC** que sí quedan, abajo en «Qué falta». Si P1 sale otro día que el 11-oct, se vuelve a sacar la captura con un comando, desde cualquier sesión:

```
node videos/marca-personal/2026-10-11/n07-haiku-55/borrador/capturar-anthropic.mjs hermes-content/videos/moldes/niveles/capturas-storyboard.json hermes-content/videos/moldes/niveles/capturas --forzar && python3 hermes-content/videos/moldes/niveles/capturas/recortar-3col.py
```
y el sello pasa a decir la fecha nueva (`fecha_hora` de `capturas.json`). Si un precio cambió, **se rehacen las cuentas** (tabla de abajo).

## Datos y fuentes (leídos el 11-oct)

| Cifra o frase | Fuente | Estado |
|---|---|---|
| Fable 5.1 US$10 entrada / US$50 salida por millón de tokens | https://platform.claude.com/docs/en/about-claude/pricing (la captura, celdas `fable-entrada` y `fable-salida`) | ✓ leído el 11-oct |
| Opus 5.5 US$4 / US$20 · Sonnet 5.5 US$2 / US$10 | misma página y captura | ✓ |
| Haiku 5.5 US$0,10 / US$0,50 «para prompts hasta 100.000 tokens»; US$0,50 / US$2,50 sobre 100.000 | misma página y captura | ✓ (la tarea de 40.000 queda abajo del corte) |
| Por tarea (40.000 entran, 4.000 salen): Fable 0,40 + 0,20 = **0,60** · Opus 0,16 + 0,08 = **0,24** · Sonnet 0,08 + 0,04 = **0,12** · Haiku 0,004 + 0,002 = **0,006** | Cuenta propia con esos precios, rehecha hoy con script | ✓ |
| Sonnet + prueba: (10 × 0,12 + 2 × 0,24) ÷ 10 = 1,68 ÷ 10 = **0,168** → «0,17» | Cuenta propia | ✓ |
| Reparto: 6 × 0,006 + 3 × 0,12 + 1 × 0,24 = 0,636; fallan 2 (una Haiku sube a Sonnet, +0,12; una Sonnet sube a Opus, +0,24): 0,996 ÷ 10 = **0,0996** → «0,10» | Cuenta propia. **En pantalla solo se ve el 0,0996**: el 0,636 y el 0,996 viven en el Aviso | ✓ |
| «Falla 1 de 5» (2 de las 10 casillas) | **Supuesto nuestro, no una medición.** Va en la nota al pie | — |
| Reparto 6/3/1 y cuáles dos tareas fallan | **Ejemplo nuestro.** Va en la nota al pie | — |
| Los 4.000 tokens de salida | **Tamaño de tarea supuesto.** Fable 5.1 y Opus 5.5 piensan siempre y ese pensamiento se cobra como salida: una tarea real puede costar más (solo en el Aviso y el caption) | Fuente: `videos/marca-personal/2026-10-11/n07-haiku-55/borrador/capturas/pensamiento-salida.png` y https://platform.claude.com/docs/en/build-with-claude/thinking, leídas el 11-oct |
| «Probá con el más barato que alcance. Subí solo si falla.» y el nombre «SUBÍ SI FALLA» | Regla interna: `.claude/skills/onia-sesion-madre/SKILL.md` l.34, «Router de modelos: primero el más barato, se verifica según el riesgo y se escala con la prueba del fallo». No dice que ONIA use Haiku para repartir ni el 6/3/1 | ✓ |
| Idea de los cuatro niveles | `hermes-content/references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md` §1 (@doninas, `DeFS0Fes8yu`). Se toma la idea; las etiquetas, los modelos y todos los números son nuestros | ✓ |

**Lo que el video no dice y el rótulo «MISMO TRABAJO» sí supone:** que las 10 tareas pasan la prueba. Todo Fable y Todo Opus **no prueban** (lo que falle ahí no entra en la cuenta). Eso va en el Aviso y en el caption, no en pantalla.

## Texto del post (de vos)

```
Mismo trabajo, de 0,60 a 0,10 dólares por tarea.

La cuenta: 10 tareas iguales, cada una con 40.000 tokens de entrada y 4.000 de salida, a los precios de Anthropic del [FECHA]. Todo en el modelo más caro: 0,60 por tarea. Con prueba y reparto: 0,10.

Ojo: es una cuenta con supuestos míos (falla 1 de cada 5, reparto 6/3/1), no una medición. Una tarea real puede costar más porque los modelos grandes piensan y ese pensamiento se cobra.

Probá con el más barato que alcance. Subí solo si falla.

Buscá NIVELES en Avisos de la comunidad. Link en mi perfil.
```
Hashtags: `#claude #ia #inteligenciaartificial #bolivia`. El aviso **NIVELES** ya existe (`AVISOS-COMUNIDAD-8-16-OCT.md` l.532, con la cuenta completa); lo que pasa por el video es el mismo 0,168 y el mismo 0,0996. Se mide por **guardados por vista**, no por vistas (v4: es pieza de relleno).

## Qué cambia en el molde (la lista para armarlo en una pasada)

Cuando Sergio Urcullo apruebe el molde, copio `videos/moldes/mosaico-tablero/` a `videos/marca-personal/<fecha>/p1-niveles/` (el molde queda intacto) y aplico esto:
1. **Textos** de la tabla de arriba en los ids indicados; `#hook-word` y `#hook-rule` en blanco.
2. **Nuevo, fuera de las escenas** (para que ningún corte lo mueva): `#p1-rotulo` (bajo la barra de marca, 0-40 s) y `#p1-contador` (2,5-40 s, blanco; verde solo de 28,5 s en adelante).
3. **Verde → blanco o gris:** `.green` en los títulos, `.hook-word` (l.33), `.hook-rule` (l.34), `.count` (l.39), `.column.ordered` (l.43), `.state-lines` (l.51), `.agenda-bars span:first-child` (l.61), `.module-focus` (l.62), `.tag.done` (l.27) y `.bubble.reply` (l.29). **Se quedan verdes:** `#mosaic-count` (l.72, la tarjeta REPARTO), `.cta` (l.79), `.cta-label` (l.81) y la barra de marca.
4. **Duraciones** (`data-start` / `data-duration`): `#board` 16 / 14, `#mosaic` 29,95 / 4,05, `#close` 34 / 6; raíz `data-duration` 40.
5. **`ledger.json`:** `tablero-mosaico` cut 30 y `mosaico-cierre` cut 34; luego `node .claude/skills/motion-doctrine/scripts/seam-stamp.mjs --ledger ledger.json --write index.html` (es un generador de texto: corre en la nube, no necesita navegador).
6. Las **casillas** (10), la fila de ✓/✗, las flechas y las 4 barras son HTML con las mismas clases del cuadro de prueba anterior (`videos/moldes/niveles/cuadro-prueba-tramo-03.html`, que conserva esa estética y queda como referencia).

## Qué falta, y de quién

| Falta | Quién | Nota |
|---|---|---|
| **OK de Sergio Urcullo al molde** y a mostrar la página de precios de Anthropic | Sergio Urcullo (lo pasa la madre) | Sin el OK no se arma nada |
| Pista de música ambiental con licencia verificada (de `hyperframes-audio`), −14 LUFS | Madre en la PC | El CLI de HyperFrames no está en la nube |
| Render con HyperFrames 0.8.65 `--offline`, `lint`, `check`, Seam Gate y mirar el cuadro cada 2 s en el celular (la nota al pie tiene que leerse) | Madre en la PC | Mismo paso que ya pidió para el molde |
| Contar de nuevo las palabras en pantalla (deben dar 103) y leer el caption entero | Marca (yo) tras el render | |
| El link de la comunidad en el perfil de Instagram (el cierre lo promete) | Sergio Urcullo | Igual que K4, K7, K8, K2 y K6 |

**Riesgos, dichos de frente.** En el referente (Santiago), las piezas sin cara son las que menos rinden y la noticia sola, sin herramienta propia, hace de 2 a 14 mil; este gancho no trae herramienta propia (es de relleno). El 0,10 sale de dos supuestos nuestros y se dice en pantalla («Supuestos…»), en el caption y en el Aviso. Las cuentas **no cambian si cambia el molde, pero sí si cambia un precio**: se relee la página el día de publicar.
