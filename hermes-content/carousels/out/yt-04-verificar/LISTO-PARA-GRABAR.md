# Video 04 — LISTO PARA GRABAR

**«La IA te dice "listo" y te está mintiendo»** · serie *Claude Code de cero* · 11 láminas.

> Todo lo de este archivo está **medido el 2026-09-21 en esta máquina**, no heredado.
> Si algo de acá contradice a otro material, el otro material está viejo — la lista de
> los que quedaron viejos está al final, en §6.

---

## 1. Las cifras, recontadas hoy

**Cambió más de lo esperado: de doce cifras del video, cinco no sobrevivieron al reconteo.**
Las cinco ya están corregidas en `GUION.md` y en `deck.html`.

| # | Lo que se dice en cámara | Decía antes | Mide hoy | Comando exacto | Veredicto |
|---|---|---|---|---|---|
| 1 | **18** errores anotados | 18 | **18** (4 en §5.1 + 9 en §5.2 + 5 en §5.3) | `awk '/^## 5\./{f=1} /^## 6\./{f=0} f' hermes-content/docs/handoff/onia-dev-node-setup.md \| grep -cE '^[0-9]+\. '` | ✅ igual |
| 2 | **los 18** los encontró él, ninguno Sergio Urcullo | ídem | **0 menciones** a Sergio Urcullo dentro de §5 | mismo `awk` + `grep -c "Sergio"` → `0` | ✅ igual |
| 3 | en **cinco días** | «en una sola sesión» | §5.1 se titula *«De esta sesión»* y tiene **4**; los commits del archivo van del **04 al 08-sep** y **10 de los 18** ya estaban el 06-sep | `git log --format='%ad' --date=short -- <archivo> \| sort -u` | ❌ **CAMBIÓ** |
| 4 | *(ya no se dice)* | «el 12 no sale de ninguna parte» | **sí sale**: la versión del **06-sep** de ese mismo archivo tiene **12** ítems y abre con *«Doce. Once los agarré verificando; el primero lo agarró Sergio Urcullo»* | `git show 1726b799:hermes-content/docs/handoff/onia-dev-node-setup.md` | ❌ **CAMBIÓ** |
| 5 | *(ya no se dice)* | «contado en las seis versiones» | **25 commits** tocan el archivo, y el conteo fue 12, 6 y 5 antes de ser 18 | `git log --oneline -- <archivo> \| wc -l` → `25` | ❌ **CAMBIÓ** |
| 6 | la di por buena **dos** veces | «tres veces» | la fuente nombra **dos** instrumentos: HTTP 200 y grep | `awk '/## Verificar es MIRAR/,/## Nada a medias/' CLAUDE.md` | ❌ **CAMBIÓ** |
| 7 | *(ya no se dice)* | «durante días» en producción | **ninguna fuente** dice cuánto duró | `grep -rn "credit_card_off" --include=*.md .` | ❌ **SACADO** |
| 8 | el grep encuentra los **cuatro** textos | 4 | **4 de 4** | `bash demo-falso-verde/demo.sh` | ✅ igual |
| 9 | la página responde **200** | 200 | `HTTP 200 - 1417 bytes` | `bash demo-falso-verde/demo.sh` | ✅ igual |
| 10 | tengo **16** años | 16 | **16** (confirmado 2026-07-25) | memoria `sergio-menor-de-edad-quien-firma` | ✅ igual |
| 11 | **11** láminas | 11 | **11** | `python rehacer-png.py` → *11 láminas en total* | ✅ igual |
| 12 | ≈ **8:00** de duración | 8:00 | **no medible antes de grabar** | — | ⚠️ estimación, ver §4 |

### Los otros «sospechosos» — recontados, y NINGUNO se usa en este video

Son del video 03. Se recontaron igual, porque el handoff los marcaba como frágiles.
**Los cinco siguen dando lo mismo**, así que el 03 publicado no tiene otro dato falso:

| Dato | Handoff decía | Mide hoy | Comando |
|---|---|---|---|
| Hooks | 4 | **4** (3 globales + 1 del repo) | `~/.claude/settings.json` (PreToolUse, PostToolUse, Stop) + `.claude/settings.json` (Stop) |
| Subagentes | 3 | **3** | `ls .claude/agents/*.md` da **4** — el cuarto es el `README.md` |
| Conectores MCP | 6 | **6** (2 globales + 4 del proyecto) | `~/.claude.json`: image-gen, stitch + meta, cloudflare, cloudflare-docs, postiz |
| Plugins | 9 | **9** | `ls -d ~/.claude/plugins/cache/*/ \| wc -l` |
| Trabajos por horario | 40 en el VPS | **40** (uptime 28 días) | `ssh …@187.77.16.63 'crontab -l \| grep -cvE "^\s*#\|^\s*$"'` |

---

## 2. Orden de rodaje

Se graba **acapela mirando el deck**. Tecla `N` apaga las chuletas, `→` avanza.
Abrir `deck.html` (es autocontenido: se puede mover de carpeta y no se rompe).

| Tramo | Lámina | Eyebrow en pantalla | Se dice |
|---|---|---|---|
| 1 | `lamina-01` | Claude Code de cero · 04 | Hook |
| 2 | `lamina-02` | Lo que me pasó | El caso **+ DEMO EN VIVO** |
| 3 | `lamina-03` | Por qué pasa | Terminar no es lograr |
| 4 | `lamina-04` | Lado a lado | La que se pausa — **dale aire** |
| 5 | `lamina-05` | La receta | Las tres preguntas |
| 6 | `lamina-06` | El segundo tema | El puente |
| 7 | `lamina-07` | La misma regla, dos veces | La idea más útil |
| 8 | `lamina-08` | El primer mes | Los tres que hacen abandonar |
| 9 | `lamina-09` | Mi caso | La prueba — **cinco días, 18 errores** |
| 10 | `lamina-10` | La parte honesta | Yo tampoco lo hago siempre |
| 11 | `lamina-11` | En una línea | Cierre + anuncio del 05 |

### La demo: dónde entra y cómo se graba

Va **dentro del tramo 2**, justo después de *«Cuando por fin la abrí…»* y antes de
*«Mirá. Los dos me dijeron que estaba bien.»*

```bash
cd hermes-content/carousels/out/yt-04-verificar/demo-falso-verde
bash demo.sh
```

- **Probada hoy, 21-sep: corre y sale con código 0.** Las tres pruebas imprimen lo que
  el guion dice que imprimen: 4 de 4 textos encontrados, `HTTP 200 - 1417 bytes`, y el
  aviso de abrir la pantalla.
- **La prueba 3 es una imagen, no un comando**: se abre `demo-falso-verde/prueba3-mirala.png`
  (o `login.html` en el navegador). Ahí se lee `verified_user` y `credit_card_off` como
  texto, donde van un escudo y una tarjeta tachada. **Mirada hoy: el bug se ve.**
- Encuadre: terminal a la izquierda, la imagen al lado. El corte a la imagen es el remate
  del tramo — que se vea que los dos verdes de arriba nunca miraron eso.
- **Si la prueba 2 no imprime nada**, el puerto 8731 está ocupado. No es un fallo de la
  demo: cambiá el `8731` de `demo.sh` por cualquier otro y volvé a correrla.

---

## 3. Guion en formato rodaje

> Lo tachado con ❌ es lo que se decía antes y **ya no se dice**. Está para que no vuelva
> a entrar de memoria mientras se graba.

**1 · Hook** — *lámina 01*
> Soy Sergio Urcullo, tengo 16 años y corro mi empresa entera con esto.
> Y hoy te voy a contar la vez que me dijo «listo» y no estaba listo.
> Porque te va a pasar. Y lo peor es que no te vas a enterar.

**2 · El caso** — *lámina 02 · contalo con vergüenza, no con distancia*
> Tenía una pantalla en producción. La pantalla donde la gente entra al sistema.
> La di por buena **dos** veces.   ❌ *no «tres»*
> La primera: respondía bien, sin un solo error. Verde.
> La segunda: busqué las palabras adentro del archivo, y ahí estaban todas.
> Nunca la abrí.
> Cuando **por fin la abrí**, los íconos se veían como palabras sueltas. En la pantalla de entrar. En producción.   ❌ *no «cuando alguien la abrió», no «Días»*
>
> **[DEMO EN VIVO — `demo-falso-verde/demo.sh`]**
> Mirá. Los dos me dijeron que estaba bien. Ninguno de los dos la había mirado.

**3 · Por qué pasa** — *lámina 03*
> ¿Y por qué pasa esto? Porque terminar y lograr no son lo mismo.
> Mirá: le pedís que mande un correo a tus clientes. Prepara la lista, manda los correos, termina sin errores. Verde.
> Pero la lista tenía cero clientes. No lo recibió nadie.
> No falló. Hizo exactamente lo que le pediste, sobre nada.
> Y un verde que no mide nada te enseña a ignorar el rojo.

**4 · Lado a lado** — *lámina 04 · la que se pausa, dale aire*
> Entonces, ¿cómo distinguís algo que parece verificado de algo que lo está?
> Una pantalla: parece, porque responde sin error. Lo está, cuando la abriste y la miraste.
> Un cambio: parece, porque dice que lo hizo. Lo está, cuando viste qué líneas tocó.
> Un envío: parece, porque terminó. Lo está, cuando contaste cuántos llegaron.
> Y un dato: parece, porque te lo dijo antes. Lo está, cuando lo volviste a contar hoy.
> La columna de la derecha tarda dos minutos más. Dos.

**5 · Las tres preguntas** — *lámina 05*
> Y para no tener que acordarte de todo eso, son tres preguntas, siempre las mismas.
> ¿Lo miré? Si es algo que ve una persona, se abre y se mira. Una búsqueda sirve para descartar, nunca para confirmar.
> ¿Cuánto salió? Un número, no un «listo». Cuántos correos, cuántas filas, cuántos segundos.
> ¿Lo conté hoy? Un dato de la semana pasada es una suposición con cara de dato.
> Mirar, medir, volver a contar.

**6 · El puente** — *lámina 06*
> Ahora, seamos honestos: hacer esas tres preguntas todos los días, en todo, cansa.
> Por eso uno escribe reglas. «Siempre mirá la pantalla antes de decir que funciona.»
> Y a la semana siguiente nadie la mira.
> A esa regla le falta la única parte que la hace obedecer.

**7 · La idea más útil** — *lámina 07*
> Le falta el porqué.
> Mirá la diferencia. La misma regla, pero con lo que pasó cuando no se cumplió: la pantalla de entrar mostró los nombres de los íconos como texto, **en producción**, y yo la había dado por buena **dos** veces sin abrirla nunca.   ❌ *no «durante días», no «tres veces»*
> Esa segunda mitad es la que hace que se cumpla.
> **Una regla sin su historia se desobedece.** Con el caso real que la originó, no.
> Y esto no es sólo para la IA. Funciona igual con las personas.

**8 · Los del primer mes** — *lámina 08*
> Y ya que estamos, los tres errores que hacen abandonar esto en el primer mes.
> Uno: pedirle todo junto. Cinco cosas a la vez salen las cinco a medias. Un objetivo por sesión, terminado.
> Dos: creerle el resumen. El resumen de lo que hizo lo escribe él. Mirá los cambios, no el resumen.
> Tres: escribir veinte reglas el primer día. No se cumplen. Una por cada cosa que te salió mal dos veces, sí.
> Ninguno de los tres es técnico. Los tres son de hábito.

**9 · Mi caso** — *lámina 09 · acá está el número que más cambió*
> Te doy el número, y es incómodo.
> En **cinco días** trabajando sobre una misma cosa quedaron anotados dieciocho errores suyos.   ❌ *no «en una sola sesión»*
> Y acá está lo que no me esperaba: los dieciocho los encontró él. Revisando su propio trabajo, solo.
> Se corrige muchísimo más de lo que la gente cree.
> Pero el de la pantalla de entrar no está en esa lista. Ese se le escapó, y lo encontré yo, abriéndola — en producción.
> Y ese es todo el punto: el que se le escapa es justo el que llega al cliente.
> Casi ninguno era un error de código. Eran comprobaciones que no comprobaban nada.
>
> Y de los dieciocho hay uno que los resume a todos. Lo escribió él mismo al final del registro:
> **si el instrumento puede dar verde con la cosa rota, el instrumento está roto.**
> El favicon en vez del contenido. La fecha del archivo en vez del archivo. El «terminó sin error» en vez de lo que entregó.

**10 · La parte honesta** — *lámina 10 · no la suavices*
> Ahora te voy a decir algo que me deja mal parado.
> Yo tampoco lo hago siempre.
> Cuando tengo apuro, le creo. Y las veces que me mordió fueron todas con apuro. No es casualidad.
> Escribí una regla que dice «verificá mirando» y la desobedecí el mismo día que la escribí.
> Esto no se aprende leyendo. Se aprende cuando algo tuyo se rompe en público.
> Yo te lo cuento para que te salga más barato que a mí.

**11 · Cierre** — *lámina 11*
> Tres preguntas. ¿Lo miré? ¿Cuánto salió? ¿Lo conté hoy?
> No le creas. Comprobalo.
> Contame en los comentarios una vez que le creíste y no debías — los leo todos, y las peores son las más útiles.
> Y suscribite, porque en el próximo te muestro algo que me hubiera ahorrado meses: casi todo lo que ibas a escribir ya está escrito, y es gratis.

### Trampas de este video

- **El caso de la pantalla es real y es suyo.** En primera persona y sin adornar. Si suena
  a ejemplo inventado, el video se cae.
- **La parte honesta no repite el tema.** Todo el video habla de errores; la penúltima
  lámina es otra cosa: que él tampoco verifica siempre.
- **Nada de frameworks de testing.** Es un video sobre el hábito.
- **Hay una tentación fuerte en el tramo 9**: decir «una sola sesión» suena mejor que
  «cinco días». Es exactamente el error que este video denuncia, y ya se cometió dos veces
  en esta serie. **Cinco días.**

---

## 4. Descripción de YouTube — lista para pegar

⚠️ **Los tiempos de los capítulos NO están.** Se sacan **transcribiendo el render**, nunca
del guion: el 03 tenía escrito 8:10 y el render duró **6:36**. Sin el render, el minutaje
es una suposición con cara de dato — justo lo que dice la lámina 5.

**Título:** `La IA te dice "listo" y te está mintiendo`

```
Que diga "listo" no prueba nada. Yo di una pantalla por buena dos veces y estaba rota.
Cómo comprobarlo en dos minutos, y cómo escribir reglas que de verdad se cumplan.

CAPÍTULOS
[completar con el render] Me dijo listo, no estaba listo
[completar con el render] Lo di por bueno dos veces
[completar con el render] Terminar no es lograr
[completar con el render] Parece verificado, o lo está
[completar con el render] Las tres preguntas
[completar con el render] Verificar todo cansa
[completar con el render] Una regla sin su historia se desobedece
[completar con el render] Los tres errores del primer mes
[completar con el render] Mi caso: dieciocho errores en cinco días
[completar con el render] La parte honesta: yo tampoco lo hago siempre
[completar con el render] En una línea

SERIE «CLAUDE CODE DE CERO»
01 · Claude y Claude Code no son lo mismo → https://www.youtube.com/watch?v=kAsAhGe6zyA
02 · Instalarlo y tu primera skill → https://www.youtube.com/watch?v=oXaqV-HDufA
03 · Que trabaje sin vos → https://www.youtube.com/watch?v=8iMRBo7ppac
05 · No escribas nada → sale mañana

Los ejemplos de la serie, listos para copiar:
https://sergiourcullo.vercel.app/claude-code

Mi archivo de reglas de ejemplo y los archivos de la serie, gratis, en la comunidad:
https://chat.whatsapp.com/ENplPbR8GrbGsdMrGgLxzu

@sergiourcullo
```

**Los cuatro enlaces, verificados hoy:** los tres videos responden en `oembed` con su
título real, y `sergiourcullo.vercel.app` da **200**.

**Al subir, además:** miniatura propia (`miniatura.png`), «no es contenido para niños»,
visibilidad pública, y esperar a que la verificación de copyright termine sin problemas.

---

## 5. Checklist — lo que depende de Sergio Urcullo

| # | Qué | Por qué no lo puede hacer la sesión | Criterio de listo |
|---|---|---|---|
| 1 | 🔴 **Grabar** los 11 tramos mirando el deck, con la demo en vivo dentro del tramo 2 | es su cara y su voz | existe el archivo de video |
| 2 | 🔴 **Arrastrar el archivo** al formulario de YouTube | el puente del navegador corta en 10 MB y el video pesa cientos; **no hay credenciales de YouTube Data API** en el sistema | el archivo empieza a subir |
| 3 | **Transcribir el render** para sacar los 11 tiempos y completar los `[completar con el render]` | depende de que el video exista | la descripción no tiene ningún `[completar…]` |
| 4 | Decidir el **desliz del 03 ya publicado** — en 2:31 dice «cuatro» subagentes y en 4:44 dice «tres». El correcto es **3** (recontado hoy) | es su video publicado | cortado y resubido, o decidido dejarlo |
| 5 | Decidir la **playlist de la serie** — con 3 videos publicados ya conviene | es su canal | creada, o descartada |
| 6 | Elegir el **plugin** que prometió en cámara en el 03 (3:29) | es su recomendación | nombre exacto |

**Nada de lo anterior bloquea la grabación de hoy.** El 1 y el 2 son el rodaje y la
subida; del 3 al 6 son de después.

---

## 6. Material que quedó VIEJO con este reconteo

Son dos archivos **fuera de esta carpeta** — otra sesión los está tocando, así que no se
editaron acá. **Si se publica el video sin corregirlos, la descripción va a decir «doce».**

| Archivo | Qué dice mal | Qué va |
|---|---|---|
| `hermes-content/docs/SERIE_CLAUDE_CODE_DESCRIPCIONES.md` §04 | *«Yo di una pantalla por buena tres veces»* y *«Mi caso: doce errores en una sesión»* | reemplazar el bloque entero por el de §4 de este archivo |
| `hermes-content/docs/SERIE_CLAUDE_CODE.md` §*04 · Cómo saber que no te mintió* | *«los doce errores anotados en una sola sesión, once encontrados revisando»* | **18 errores en cinco días, los 18 encontrados por él** |

Y una corrección al propio handoff del carril
(`hermes-content/docs/handoff/yt-serie-claude-code.md`, §*Datos verificados*): la fila de
los errores dice *«contado en las 6 versiones del archivo»* y *«el 12 no sale de ningún
lado»*. **Las dos cosas son falsas**, con el detalle y los comandos en §1 de este archivo.

---

## 7. Cómo se rehacen los PNG

```bash
python rehacer-png.py          # las 11
python rehacer-png.py 9        # sólo la 9
```

⚠️ **No sirve el `chrome --headless --screenshot` que documentan los decks hermanos.** En
esta máquina **no escribe el archivo**: deja el PNG viejo en su lugar, sin error y sin
aviso. Es el falso verde exacto del que habla este video, viviendo en nuestras propias
instrucciones. `rehacer-png.py` usa Playwright y comprueba el tamaño del archivo escrito.

Las 11 láminas de esta carpeta se rindieron y **se miraron una por una el 21-sep**: sin
texto cortado, sin líneas pisadas y sin ninguna cifra vieja.
