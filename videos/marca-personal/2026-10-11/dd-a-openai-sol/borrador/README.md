# BORRADOR, no es master · DD-A · OpenAI «Sol» y la caché

Molde: Santiago «noticia con tarjetas» (`edicion-referentes/scripts/santiago/`). 58,4 s, 1080x1920, 30 fps, −13,0 LUFS.
Armado sobre el corte **PROPUESTO** (`../cutplan.json`, 23 bloques de pausa = 6 bloques de la tabla), todavía **sin el «ok cortes»**
de Sergio Urcullo. Si el corte cambia, se rehace con un solo comando. No se publicó ni agendó nada. No toqué `santiago.py` ni `capturar.mjs`.
**Nadie escuchó el audio:** todo lo dudoso (lista abajo) se confirma oyendo el bruto.

## Rehacerlo con un comando

```bash
bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/dd-a-openai-sol/borrador/rehacer.sh
```

Con el corte aprobado (se reemplaza `../cutplan.json`, formato `{"keep":[{"start","end"}…]}` en segundos del bruto) y otras rutas:

```bash
cp <cutplan-aprobado.json> /home/user/onia-hermes/videos/marca-personal/2026-10-11/dd-a-openai-sol/cutplan.json
BRUTO=/ruta/F9630B16.mp4 S=/ruta/de/trabajo CIERRE=A RECAPTURAR=1 bash .../dd-a-openai-sol/borrador/rehacer.sh
```

`BRUTO` (default: el de esta sesión en el scratchpad; sale de Drive «Videos Onia Octubre», `F9630B16-57F2-465E-9289-0D0DDBE787A2.mp4`),
`S` (carpeta de trabajo, default `/tmp/dd-a-openai-sol-borrador`: ahí queda el 1080x1920 `video.mp4`, `sheets/`, `work/`; **no va al repo**),
`CIERRE=A|B` (ver «Cierre»), `RECAPTURAR=1` (vuelve a sacar las capturas oficiales del día; hacerlo el día del master).
Hace, en orden: `hacer-segments.py` (transcript en tiempo de salida) · `armar-storyboard.py` (variante de cierre) · `[capturar-openai.mjs]` ·
`correr-santiago.py --plan` (→ `plan.txt`) · render completo con **`--sin-aire`** (la regla 15 manda sobre el aire de 0,34-0,52 s del molde) ·
`silencedetect -35dB d=0.3` y `ebur128` (→ `medicion.txt`) · `BORRADOR-no-es-master-360p.mp4` · `cuadros/`.

**Tiempos medidos (4 CPU, máquina compartida, 3 corridas completas):** pipeline entero 114 s · 147 s · 162 s. El primer `--plan` analiza el bruto
(saltos, cara por toma, voz) en 34 s y lo deja en `work/`; después `--plan` tarda 2 s. **Render 96 s · 125 s · 146 s** para 58,4 s.
Capturas oficiales (3 páginas + logo) 19 s. `hacer-segments.py` 0,05 s. Cuadros sueltos (`--fotos`) ≈14 s.

## Si el corte cambia, o se agrega / saca un bloque

- **Se recalcula solo:** `segments-cut.json` (palabras por bloque `keep`, restando el corrimiento acumulado; se pega a la voz real con `pad`),
  `plan.txt`, el render. `arreglos.json` se aplica por texto: si la frase quedó fuera del corte avisa y la salta.
- **Depende del corte: el storyboard.** Cada escena se dispara por una frase real. Mapa bloque (tabla de cortes) → escenas:
  B1 `gancho-precios, lanzamiento` · B2 `lo-que-cobran, segun-openai, probalo, recomiendo` · B3 `tarifa, cache-precio` ·
  B4 `cuenta-1, cuenta-2` · B5 `confirmar` · B6 `cta-cara, cta`.
  - **Sacar un bloque:** las escenas cuya frase ya no está hacen que `santiago.py` aborte con «el storyboard pide «frase» y no está en el
    transcript». Se borra o reescribe esa escena en `storyboard.json`. Sacar B5 (la cuenta de 100 mil) = borrar `confirmar`: es la salida limpia si la
    alerta de aritmética resulta ser «con Astra».
  - **Agregar un bloque** (o devolver un hueco hoy tirado): sus palabras entran a los subtítulos, pero sin escena el apoyo anterior queda en pantalla.
    Hay que escribir la escena con su frase. Si el audio es nuevo, transcribir (faster-whisper small) y reemplazar `../transcript-whisper-small.json`.
  - **Mover un borde de bloque:** no pide nada; `"corte": true` se pega al corte más cercano. Dos cosas están atadas al corte actual:
    la escena `cta` (`{"frase":"asesoría","offset":0.15}`: el corte de 56,25 s cae a 0,15 s del inicio de «asesoría» y `corte:true` no lo encuentra)
    y el chip `[CONFIRMAR 01:01–01:09]` (segundos del bruto de la frase en duda: si cambia el tramo, se reescribe).
  - Mirar en `plan.txt` «a la vista» (cortes sin cambio de panel) y «pide corte y no hay corte…».

## Palabras a confirmar con el audio (segundo del BRUTO)

| Subtítulo | Whisper oyó | Bruto | Salida |
|---|---|---|---|
| «Te **hago** la cuenta» | «Tavo la cuenta» | 00:47.5–00:48.1 | 37,05 s (los tiempos de «Te hago» son aproximados: Whisper los puso a caballo del corte) |
| «te **sigo** recomendando Astra» | «te siguió recomendando» | 00:29.9–00:30.1 | 25,79 s |
| «con **astra** son 400» | «con astra son 400» | 01:04.8–01:05.2 | 49,90 s → **ver la alerta** |
| «**4** con caché, 20 centavos» (lo agregué yo) | «4 con caché» | 00:56.3–00:56.7 | 44,69 s. La fila «4 dólares» sale de su cuenta (2 millones × US$2), no de una palabra oída: confirmar que dice «4» |
| «se acerca (a) Astra» (lo agregué yo) | «se acerca Astra» | 00:21.3–00:22.9 | 18,5 s. El subtítulo queda como Whisper; la tarjeta dice «se acerca a Astra» |
| «en su **Dev Day**» (lo agregué yo) | igual | 00:13.1–00:13.5 | 11,3 s. El changelog oficial dice «Sep 29 · Released GPT-6.1 Sol» y no nombra el Dev Day: en pantalla va solo la fecha |

Sin `[?]` en ningún subtítulo (`segments-cut.json`: 184 palabras, todas con tiempo, ninguna retrocede, la última termina en 58,30 s de 58,42).
La lista de las tres primeras con su segundo también sale de `dudosas.json`.

## ⚠ ALERTA de aritmética: «400 contra 20»

Whisper oyó «100 mil mensajes al mes **con Astra** son 400 dólares, en cambio **con Sol** son solo 20» (bruto 01:01–01:09 = salida 46,78–54,10 s).
Con SUS precios: 100.000 mensajes × 2.000 tokens = 200 M tokens → **Sol sin caché 200 × US$2 = US$400 · Sol con caché 200 × US$0,10 = US$20 ·
Astra sin caché 200 × US$10 = US$2.000** (Astra con su caché de US$1 el millón: US$200). «400 contra 20» solo cuadra como Sol sin caché contra Sol con caché.
- **Si dijo «con Sol»** (400 sin caché → 20 con caché): el dato es cierto y la tarjeta del borrador ya lo muestra así; se quita el chip y el crédito de «pendiente».
- **Si dijo «con Astra»:** el dato es falso (Astra sin caché son US$2.000): se corta o se regraba esa frase (bruto 01:01–01:09) y se borra la escena `confirmar`.
- **No resolví la duda.** La tarjeta va como `[CONFIRMAR 01:01–01:09]` con «Sol sin caché 400 dólares → Sol con caché 20 dólares» y el crédito «pendiente: confirmar con el audio».
  Aparte: la cuenta usa solo el precio de ENTRADA; las páginas oficiales listan además salida (Sol US$10, Astra US$50) y «Cache writes» (Sol US$2,50): el 400 → 20 vale si
  todo el prompt fijo sale de la caché.

## Cierre: A (audio) y B (alternativa), con flag

El audio dice «si querés que lo probemos en tu negocio, **asesoría gratis, link en mi perfil**»; **ese link de la asesoría en la bio todavía no existe**, así que
el cierre hablado espera el link (no sale así hasta que esté, o se regraba el cierre). No toqué el audio.
- **A (default, lo que dice el audio):** tarjeta «Asesoría GRATIS · link en mi perfil» → `CIERRE=A` (`cuadros/t057.4.jpg`).
- **B (alternativa, mientras no esté el link):** «Lo que probé está en mi comunidad. Link en mi perfil.» (corregido el «Lo lo que») → `CIERRE=B bash rehacer.sh`
  (`cuadros/cierre-B.jpg`). Con B el audio sigue pidiendo la asesoría: la tarjeta y la voz no dicen lo mismo, por eso A es el default.
El flag vive en `storyboard.json` (`cierre`, `cierre_alternativa_B`); `armar-storyboard.py` arma el storyboard de cada variante. `rehacer.sh` deja además el cuadro de la otra variante.

## Qué hay en pantalla y de dónde sale (cada texto: sus palabras o una página oficial de hoy)

| # | Desde (s) | Layout | Qué muestra | Fuente |
|---|---|---|---|---|
| 1 | 0,00 | split | tabla de precios: Sol US$2,00 (marcado), Astra US$10,00 + logo OpenAI | pricing, captura |
| 2 | 6,09 | split | changelog «Sep 29 · Released GPT-6.1 Sol» + sello 29 SEP | changelog, captura |
| 3 | 11,83 | cara | «Los dos cobran lo que entra y lo que sale» + «Sol cobra 2» «Astra cobra 10» | sus palabras |
| 4 | 17,03 | split | «Near-Astra performance for complex work at a lower cost.» (marcado) + «Según OpenAI, se acerca a Astra» | models, captura |
| 5 | 19,68 | cara | «Si tu bot usa Astra, yo lo probaría con Sol antes de cambiarlo» | sus palabras |
| 6 | 22,85 | lámina | «Pero para» investigación científica · programación → «te sigo recomendando Astra» | sus palabras |
| 7 | 27,36 | split | «Hay una tarifa mucho más económica»: La caché → «Lo que va igual al principio» · «como tu lista de precios» | sus palabras |
| 8 | 33,29 | split | changelog «$2 input, $0.10 cached input» (marcados) + «10 centavos el millón» + sello 20 VECES MENOS | changelog + sus palabras |
| 9-10 | 36,93 / 41,27 | lámina → persona reducida | «La cuenta»: 2.000 tokens por mensaje · por mil mensajes 2 millones de tokens · a 2 dólares el millón 4 dólares · con caché 20 centavos | sus palabras |
| 11 | 46,78 | split | `[CONFIRMAR 01:01–01:09]` 100 mil mensajes al mes: Sol sin caché 400 → Sol con caché 20 | sus palabras + alerta |
| 12-13 | 54,10 / 56,25 | cara → split | «Si querés que lo probemos en tu negocio» → tarjeta de cierre | sus palabras |

**Capturas oficiales** (`capturas/`, sacadas el **11-oct-2026 a las ~07:37 UTC = ~03:37 La Paz** con `capturar-openai.mjs`, Chromium por el proxy, TLS intacto;
`capturas.json` guarda URL y fecha de cada una):
- `precios.png` · https://developers.openai.com/api/docs/pricing · pestaña Standard, Short context: gpt-6-astra Input $10.00 / Cached $1.00 / Output $50.00; gpt-6.1-sol Input $2.00 / Cached $0.10 / Output $10.00.
- `modelo-sol.png` · https://developers.openai.com/api/docs/models · tarjeta de GPT-6.1 Sol («Near-Astra performance for complex work at a lower cost.»; Input $2, Output $10 por MTok).
- `changelog-sol.png` · https://developers.openai.com/api/docs/changelog · «Sep 29 … Released GPT-6.1 Sol … Standard pricing per 1M tokens for prompts with up to 272K input tokens is $2 input, $0.10 cached input, $2.50 cache write, and $10 output.»
- `logo-openai.png` · `hermes-content/references/brand-logos/openai.svg` en su tile blanco (el SVG es `currentColor`: oscuro sobre el panel negro no se ve).
Confirmado con ellas: «Sol 2, Astra 10» (entrada), «10 centavos el millón» de caché (Sol), «20 veces menos» (2,00 / 0,10), «29 de septiembre» y «según OpenAI se acerca a Astra».
`openai.com` da 403 desde la nube (probé `/api/pricing/`); todo sale de `developers.openai.com`. **No se puso en pantalla:** precios de salida, Luna, ni el «Dev Day» (no está en la página).

## Medido (render final, `medicion.txt` y `plan.txt`)

| Qué | Resultado |
|---|---|
| **Regla 15**, `silencedetect noise=-35dB d=0.3` | **0 silencios** (también 0 a −45 y −55 dB). A d=0,2 salen 9 pausas de 0,2-0,3 s: los empalmes de 0,24 s (pad 0,12 + 0,12) |
| Sonido | −13,0 LUFS · LRA 1,8 (receta 2,3-3,4: queda corto) · TP −1,7 · piso p1 −63 dBFS |
| Control contra la receta | split 57 % · cara 18 % · persona reducida 9 % · lámina 15 % · 10 cambios de layout (1,71 por 10 s; receta 0,75-2,1) · algo cambia cada 2,3 s · 43 elementos nuevos (7,4 por 10 s; receta 6-9) · 2 golpes de zoom · 3,15 palabras/s · prueba en pantalla a 0,00 s · tramo sin cara más largo 4,5 s |
| Cara entre tomas (YuNet sobre el render) | ojos al 67,0-67,7 % en split (5 tomas) y 45,6-46,6 % en cara completa; el bruto trae 4 saltos internos y todos caen en un hueco que el corte tiró y en un cambio de escena |
| Micro-cortes a la vista (8, de 0,12-0,35 s, misma toma) | salto de cara máximo 13 px en y, 16 px en x |
| Subtítulos contra la voz | mediana 0,00 s respecto al arranque de voz (21 palabras tras pausa; peor −0,28 s, «si» del cierre) |
| **No cumple** | duración 58,4 s (receta 65-120; el corte propuesto no trae yap ni remate) · cola tras la última palabra 0,12 s (receta 0,3-0,65) |

## Trampas de este armado

1. **`santiago.py` revienta con OpenCV 5.0** (`cv2.CascadeClassifier` ya no existe): `correr-santiago.py` lo ejecuta sin tocarlo y le pone un detector de la misma interfaz
   con YuNet (modelo ya en `editor-videos/assets/models/`). Arreglo de fondo: `FaceDetectorYN` en `analizar_bruto()`.
2. **`capturar.mjs` con `ancla` falla en developers.openai.com** («Clipped area is either empty or outside the resulting image»): la página scrollea el BODY, no el documento
   (`window.scrollTo` no mueve nada). `capturar-openai.mjs` agranda el viewport hasta que entra el recorte; suma `celdas` (rectángulo de una celda de tabla: la tabla trae filas
   ocultas de Batch/Flex/Fast/Ultrafast que repiten el nombre del modelo) y `tile` para logos `currentColor`. Sin ancla, `capturar.mjs` sí anda.
3. **Un disparador toma la PRIMERA aparición en todo el transcript:** «tu negocio» pegó a 47,49 s (la frase de la cuenta) en vez de 55,5 s. Leer «— disparos —» de `plan.txt`; usar la frase larga o `#2`.
4. **En una escena `full` el texto de arranque se pisa con el panel viejo** mientras la cámara sube (0,33 s) y, sin `hasta`, sigue 0,6 s tras la escena: retrasé el primer texto 0,3 s y puse `hasta` al inicio de la siguiente.
5. `caja(titulo, sub)` dibuja el sub 6 px encima del título: usé título de dos líneas. Una `tarjeta` con `aire: 0` entre líneas las pega: ≥14. Un `*acento*` pega la coma: `*Astra,*`.
6. **Whisper corre los bordes sobre los silencios que el corte tiró** («pero» 32,00-34,52 con el bloque arrancando en 34,26). `hacer-segments.py` lleva el inicio al arranque de voz del bloque (`start + pad`) y el final a `end − pad`;
   una palabra mal oída que se parte en dos («Tavo» → «Te hago») se parte DESPUÉS de pasarla a tiempo de salida (si no, la mitad cae entera en el hueco y desaparece).
7. El marco de navegador del molde trae tres puntos de semáforo (`#FF5F57` es **rojo**, santiago.py:303); es el único rojo del video. Quitarlo pide `"marco": false` + crédito en texto o tocar `santiago.py`.
8. `Broken pipe` al final del log del render: es el decodificador del bruto cerrado; inofensivo. El autosync ya commiteó estados intermedios de esta carpeta (e672becb8, 9a178ab46, 1a5ac4808).

## Archivos

`rehacer.sh` · `hacer-segments.py` + `arreglos.json` → `segments-cut.json` (+ `dudosas.json`) · `storyboard.json` + `armar-storyboard.py` · `capturar-openai.mjs` → `capturas/` ·
`correr-santiago.py` · `plan.txt` · `medicion.txt` · `cuadros/` (6 cuadros del render + `cierre-B.jpg`) · `BORRADOR-no-es-master-360p.mp4` (1,4 MB).
