# BORRADOR, no es master · N07 · Haiku 5.5: el precio y la cuenta de un bot

Molde: Santiago «noticia con tarjetas» (`edicion-referentes/scripts/santiago/`). 81,7 s, 1080x1920, 30 fps, −13,0 LUFS.
Armado sobre el corte **PROPUESTO** (`../cutplan.json`: 30 tramos de la **segunda toma**, la primera se descarta; 8 bloques de la
`../tabla-de-cortes.md`), todavía **sin el «ok cortes»** de Sergio Urcullo. Si el corte cambia, se rehace con un solo comando.
No se publicó ni agendó nada; no se tocó `santiago.py` ni `capturar.mjs`. **Nadie escuchó el audio**: todo lo dudoso (lista abajo) se
confirma oyendo el bruto. El render de 1080x1920 queda en la carpeta de trabajo `S`, no en el repo.

## Rehacerlo con un comando

```bash
bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/n07-haiku-55/borrador/rehacer.sh
```

Con el corte aprobado (se reemplaza `../cutplan.json`, formato `{"keep":[{"start","end"}…]}` en segundos del bruto, y `silences` si se
quiere el ajuste de bordes de palabra) y otras rutas:

```bash
cp <cutplan-aprobado.json> /home/user/onia-hermes/videos/marca-personal/2026-10-11/n07-haiku-55/cutplan.json
RECAPTURAR=1 BRUTO=/ruta/E_15270626.mp4 S=/ruta/de/trabajo bash .../n07-haiku-55/borrador/rehacer.sh
```

`BRUTO` (por defecto el de la sesión; sale de Drive «Videos Onia Octubre», `15270626-ABFC-4562-9DF0-2E35CDE665DA.mp4`), `S` (por defecto
`scratchpad/N07/borrador`: ahí quedan `video.mp4`, `sheets/` con la hoja de control a 2 fps, `work/`), `RECAPTURAR=1` (vuelve a sacar las
10 capturas oficiales de hoy: hacerlo el día del master). Hace, en orden: `armar-transcript.py` (→ `segments-cut.json`,
`palabras-a-confirmar.txt`) · `capturar-anthropic.mjs` (solo con `RECAPTURAR=1`) · `santiago.py --plan` (→ `plan.txt`) · render completo con
**`--sin-aire`** (la regla 15, aire muerto ≤ 0,3 s, manda sobre las pausas de 0,34-0,52 s que el molde abre por defecto) · `silencedetect` +
`ebur128` + salto de cara en los empalmes (→ `medicion.txt`) · `BORRADOR-no-es-master-360p.mp4` y `cuadros/`.
`santiago.py` se llama **directo**: con OpenCV 5 ya no hace falta `santiago-cv5.py` ni `correr-santiago.py` (arreglado el 11-oct, 80a03dd24).

**Tiempos medidos (4 CPU, máquina compartida):** primer `--plan` 128 s (analiza el bruto de 180 s: saltos, cara por toma, voz; después queda en
`S/work` y el `--plan` tarda 2-3 s) · render 199 s, 204 s y 266 s para 81,7 s (tres corridas) · capturas oficiales (10 páginas + logo) ≈ 90 s ·
`armar-transcript.py` <1 s · medición del audio 3 s + salto de cara 42 s · 360p 10 s. Pipeline entero ya con caché: 232 s (sin recapturar), 362 s (con `RECAPTURAR=1`).

## Si el corte cambia, o se agrega / saca un bloque

- **Se recalcula solo:** `segments-cut.json` (palabras dentro de cada `keep`, corrimiento acumulado restado, bordes pegados a la voz con los
  `silences` del cutplan), `plan.txt`, el render. `arreglos.json` se aplica por texto: una frase que quedó fuera del corte avisa y se salta.
- **Depende del corte: el storyboard.** Cada escena se dispara por una frase real; `"corte": true` la pega al corte más cercano (hasta 0,45 s
  antes de la palabra). Mapa bloque (tabla de cortes) → escenas:

  | Bloque | En el corte | Escenas |
  |---|---|---|
  | B1 · gancho y lanzamiento | 0,0-10,3 s | `gancho, antes-ahora, lanzamiento, por-token` |
  | B2 · precios de 5.5 y de 4.5 | 10,3-19,0 s | `precio-55, precio-45` |
  | B3 · la cuenta con 4.5 | 19,0-26,7 s | `cuenta-1` (sigue hasta 29,0 s) |
  | B4 · 30 centavos, la letra chica, 40 centavos | 26,7-37,7 s | fila 4 de `cuenta-1`, `nadie, mismo-texto, cuarenta` |
  | B5 · para qué sirve | 37,7-49,6 s | `para-que, recepcionista, lo-dificil` |
  | B6 · la clínica con bot | 49,6-58,3 s | `clinica, medio-dolar` |
  | B7 · las dos trampas | 58,3-70,0 s | `armas, trampa-1, trampa-2, apagalo` |
  | B8 · terminal y CTA | 70,0-81,7 s | `terminal, comunidad, cta` |

  - **Sacar un bloque:** las escenas cuya frase ya no está hacen que `santiago.py` aborte con «el storyboard pide «frase» y no está en el
    transcript». Se borra esa escena (y los `hasta`/`en` que la nombran: `recepcionista` y `clinica` usan `hasta` de la escena siguiente).
    Salidas limpias: sacar B7 = borrar las 4 escenas de B7; sacar la letra chica = borrar `nadie, mismo-texto, cuarenta` (la fila de 0,30 queda en `cuenta-1`).
  - **Agregar un bloque** (o devolver un hueco hoy tirado): sus palabras entran a los subtítulos, pero sin escena el apoyo anterior se queda en
    pantalla. Hay que escribir la escena con su frase. Si el audio es nuevo, transcribir (faster-whisper small, el mismo modelo) y reemplazar
    `../transcript-whisper-small.json`; lo dudoso nuevo va a `arreglos.json` / `dudosas-extra.json`.
  - **Mover un borde de bloque:** no pide nada. Atado al corte actual: las escenas con `corte:true` cuyo corte no existe en el corte nuevo
    imprimen «pide corte y no hay corte» (hoy ya lo hacen 6, porque la pausa de antes no se cortó: el cambio queda en la palabra). Mirar «a la vista» en `plan.txt`.
  - **Disparadores que toman la PRIMERA aparición:** «para clasificar apagarlo» (no «para clasificar»), «mil mensajes con» (no «mil mensajes»), «10 centavos»,
    «40 centavos» y «el 7» son únicos hoy; si el corte devuelve frases repetidas, leer «— disparos —» de `plan.txt`.

## Palabras a confirmar con el audio (segundo del BRUTO, toma 2)

Los subtítulos NO llevan `[?]`: llevan la mejor lectura. La lista sale de `palabras-a-confirmar.txt`. «2.ª pasada» = Whisper small de nuevo con
`beam_size=5` y, aparte, con un `initial_prompt` de vocabulario (el prompt no cambió ninguna lectura dudosa).

| Prioridad | Bruto (s) | Whisper oyó | Subtítulo dice | Por qué |
|---|---|---|---|---|
| alta | 130,48-133,80 | «no no tiene la consulta la manda» | «no **atiende** la consulta, la manda» | las dos pasadas dicen «tiene» (con una palabra de 0 s); la toma 1 oyó «atiende» y el guion también. **Si dijo «tiene», no tiene sentido y hay que regrabar o cortar la frase** |
| alta | 145,28-147,72 | «preguntala a quien termó el bot que modelo usa» | «preguntale a quien **te armó** el bot qué modelo usa» | «termó» = «te armó» (el guion: «te armó»); «preguntala» salió en las tres pasadas, el guion dice «preguntale» |
| alta | 151,50-152,46 | «Ser más bots» | «Si **armás** bots» | la tabla de cortes proponía «Si tenés más bots»; la 2.ª pasada y el guion dicen «Si armás bots» (suena igual a «ser más»). En pantalla: «Si armás bots, dos trampas» |
| alta | 168,36-170,92 | «coloca cloud guión haiku 5.5» | «colocá **claude-haiku-5-5**» | el guion dice «claude guion haiku guion cinco guion cinco» y la doc de Claude Code da `claude --model claude-haiku-5-5`; la tabla de cortes proponía «claude --model haiku-5.5». Whisper oyó un solo «guión»: **confirmar qué dijo** |
| media | 134,82-135,16 | «zonet» | «Sonnet» | |
| media | 90,62-92,26 | «millón de token que entran» | «millón de **tokens** que entran» | la 2.ª pasada dice «token» |
| media | 80,10-80,72 | «Anthropics» | «Anthropic» | |
| baja | 133,88-134,82 | «se lo deja a Sonnet» | igual | ¿«deja» o «dejás»? la toma 1 oyó «dejas», el guion «dejás»; con «se lo deja» el sujeto es Haiku y también tiene sentido |
| baja | 162,26-163,66 | «apagarlo y probarlo» | igual | ¿«apagalo y probalo»? En pantalla va «apagalo y probalo» (voseo del guion) |
| baja | 128,80-130,18 | «como un recepcionista» | igual | el guion dice «una recepcionista» |
| baja | 92,26-94,04 | «50 los que salen» | igual | dice «50» sin unidad: son centavos (página: `$0.50 / MTok`); en pantalla va «50 centavos salen» |
| baja | 152,78-153,38 | «dos trampas» | igual | este tramo no está en la toma 1; confirmar |

`segments-cut.json`: 237 palabras, todas con tiempo, ninguna retrocede, la última termina en 81,53 s de 81,72, **0 «[?]»**. Los tiempos por palabra
son los de Whisper small ajustados a los silencios del cutplan (54 bordes), **no** alineación forzada: el karaoke puede ir unas centésimas corrido
(«y» 63,34-63,92 y «la» 75,76-76,42 son palabras que Whisper estiró). Una palabra mal oída que cambia de cantidad («cloud guión haiku 5.5» → «claude-haiku-5-5»)
reparte el tiempo de todo el tramo viejo; en la versión de N06 las palabras que sobraban le prestaban su tiempo a la siguiente y esa arrancaba antes.

## Verificación contra las páginas oficiales (capturas del 11-oct-2026, 04:45-04:47 hora La Paz = 08:45-08:47 UTC)

Todas con `capturar-anthropic.mjs`, Chromium por el proxy de la sesión, TLS intacto. `capturas.json` guarda URL y fecha-hora de cada una.

| Lo que dice Sergio Urcullo | Página | Cuadra |
|---|---|---|
| «Anthropic sacó Haiku 5.5 el 7 de octubre» | `platform.claude.com/docs/en/models/haiku-5-5/overview`: «Released October 7, 2026»; notas de la versión: «October 7, 2026 · We've launched Claude Haiku 5.5» | sí |
| «10 centavos el millón de tokens que entran, 50 los que salen» | misma página, tarjeta «Pricing»: Input `$0.10 / MTok for prompts up to 100,000 tokens`, Output `$0.50 / MTok for prompts up to 100,000 tokens` (la caja de arriba dice «From $0.10» y «From $0.50») | sí |
| «El 4.5 cobraba un dólar y 5 dólares» | `…/models/haiku-4-5/overview`: Input pricing `$1 / MTok`, Output pricing `$5 / MTok` (misma lista de precios `…/about-claude/pricing`) | sí. Ojo: Haiku 4.5 sigue cobrando eso (está «Active (legacy)», retiro «not sooner than October 15, 2026») |
| «Por token cobra 10 veces menos» | $0,10 contra $1 y $0,50 contra $5 | sí, **solo hasta 100.000 tokens de prompt**; por encima Haiku 5.5 cobra $0,50 / $2,50, o sea la mitad de 4.5. El video lo aclara 40 s después con la trampa 1 |
| «un 30 % más de tokens» | misma página, «Overview»: «the same text counts as approximately 30% more tokens than on Claude Haiku 4.5» | sí (aproximado) |
| «si el prompt pasa de 100 mil tokens, cobra 5 veces más» | tarjeta «Pricing»: Input $0,50 contra $0,10, Output $2,50 contra $0,50 = ×5 exacto. `…/about-claude/pricing` (evidencia, `capturas/precio-larga.png`): «a request whose prompt is over 100,000 tokens pays higher prices» y el prompt cuenta lecturas y escrituras de caché | sí |
| «con el pensamiento prendido lo que piensa se cobra como salida» | `…/build-with-claude/thinking`: «the tokens Claude spends reasoning are billed as output tokens, even when the thinking text isn't returned to you» | sí |
| «viene con el pensamiento prendido… apagalo» | misma página (evidencia, `capturas/pensamiento-apagar.png`): «Claude Haiku 5.5 also has thinking on by default and accepts `thinking: {type: "disabled"}` at effort high or below» | sí, **en la API**. **En Claude Code no se puede apagar en Haiku 5.5** (`code.claude.com/docs/en/model-config`: «You can't turn thinking off on Opus 5.5, Sonnet 5.5, Haiku 5.5, or the Fable models»). El video dice «apagalo» para clasificar con el bot y 15 s después manda a probarlo en la terminal: puede confundir |
| «para ponerlo en tu terminal, colocá claude-haiku-5-5» | `code.claude.com/docs/en/model-config`: «Its model ID is `claude-haiku-5-5`… start Claude Code from your shell with `claude --model claude-haiku-5-5`»; pide Claude Code 2.1.293 o posterior | sí |
| «para clasificar, sacar datos y repartir» | «For high-volume, latency-sensitive tasks such as classification, extraction, and routing» | sí (extraction = sacar datos, routing = repartir) |
| «lo difícil se lo deja a Sonnet o a Opus» | la lista de modelos de la doc trae Sonnet 5.5 y Opus 5.5 por encima en precio y capacidad | sí; él no dice versión y en pantalla tampoco |

**Cuenta recalculada con los precios que muestra la página:** 1.000 mensajes × 2.000 tokens de entrada = 2 M; × 200 de salida = 0,2 M.
Haiku 4.5: 2 × $1 + 0,2 × $5 = **$3,00**. Haiku 5.5 sin recargo: 2 × $0,10 + 0,2 × $0,50 = **$0,30** (justo 10 veces menos).
Con 30 % más de tokens: 2,6 M × $0,10 + 0,26 M × $0,50 = $0,26 + $0,13 = **$0,39** («unos 40 centavos»); $3 / $0,39 = **7,7**: «casi 8 veces menos».
«Menos de medio dólar» por mil consultas: $0,39 < $0,50. **Cuadra todo.** Dos supuestos que **no salen de ninguna página** y se dicen en el aviso HAIKU
(`AVISOS-COMUNIDAD-8-16-OCT.md`, coincide con 0,39): (1) los **2.000 y 200 tokens por mensaje** son de Sergio Urcullo; (2) aplicar el +30 % también a la salida (la página lo dice «del
mismo texto», no da un porcentaje propio para la salida). El aviso HAIKU existe y trae la misma cuenta; el cierre «Buscá HAIKU en Avisos» tiene recurso.
No hubo que poner ninguna tarjeta «[VERIFICAR]»: ningún dato en pantalla quedó sin respaldo de una página capturada hoy.

## Qué hay en pantalla y de dónde sale (cada texto: sus palabras o una página oficial de hoy)

| Desde (s) | Layout | Qué muestra | Fuente |
|---|---|---|---|
| 0,00 | split | «Clasificar mil mensajes» + caja «Input pricing From $0.10 · Output pricing From $0.50» (prueba en el cuadro 0) | sus palabras + Haiku 5.5, captura |
| 2,52 | split | «Antes 3 dólares» → «Ahora 40 centavos» (golpe de zoom en «40 centavos») | sus palabras |
| 5,43 | split | «Haiku 5.5» + logo Anthropic + «Released October 7, 2026» (marcado) + sello «7 OCT» + «Sacó el 7 de octubre» | sus palabras + Haiku 5.5, captura |
| 8,48 | split | «Por token cobra 10 veces menos» | sus palabras |
| 10,33 | split | tarjeta «Pricing» (Input/Output, dos tramos) con $0,10 y $0,50 marcados + «10 centavos entran · 50 centavos salen · por millón de tokens» | Haiku 5.5, captura + sus palabras |
| 15,70 | split | Haiku 4.5: «Input pricing $1 · Output pricing $5» marcados + «1 dólar entra · 5 dólares sale» | Haiku 4.5, captura + sus palabras |
| 19,03 | pip | «La cuenta» con la persona reducida: mil mensajes sin pensamiento · 2000 tokens entran y 200 salen · Haiku 4.5: US$3 (2 millones × US$1 + 0,2 millones × US$5) · Haiku 5.5: US$0,30 | sus palabras + cuenta recalculada |
| 29,00 | split | «Lo que nadie te cuenta» | sus palabras |
| 30,45 | split | párrafo oficial «…approximately 30% more tokens than on Claude Haiku 4.5» marcado + «El mismo texto, 30 % más tokens» | Haiku 5.5, captura + sus palabras |
| 33,20 | pip | «La cuenta» otra vez: 4.5 US$3 · 5.5 US$0,30 · 30 % más de tokens (2.600 entran, 260 salen) · «Unos 40 centavos» (US$0,39, casi 8 veces menos) + sello «CASI 8 VECES» (golpe de zoom en «casi 8») | sus palabras + cuenta recalculada |
| 37,71 | split | titular oficial «…classification, extraction, and routing» marcado + «Clasificar · Sacar datos · Repartir» | Haiku 5.5, captura + sus palabras |
| 42,51 | cara | «Como un recepcionista · No atiende la consulta, la manda a quien corresponde» | sus palabras |
| 47,53 | lámina | «Lo difícil se lo deja a Sonnet · Opus» | sus palabras |
| 49,61 | cara | «Si tenés una clínica con bot» | sus palabras |
| 52,54 | split | «Mil consultas, menos de medio dólar» + «con el pensamiento apagado» + «Preguntale a quien te armó el bot · ¿Qué modelo usa?» | sus palabras |
| 58,31 | cara | «Si armás bots, dos trampas» | sus palabras |
| 60,07 | split | «TRAMPA 1 · MÁS DE 100 MIL TOKENS»: tarjeta «Pricing» con $0,50 «over 100,000 tokens» marcado + «cobra 5 veces más» + sello «×5» (golpe de zoom en «cobra 5 veces») | Haiku 5.5, captura + sus palabras |
| 63,92 | split | «TRAMPA 2»: «…billed as output tokens» marcado + «Pensamiento prendido, se cobra como salida» | thinking, captura + sus palabras |
| 67,79 | cara | «Para clasificar, apagalo y probalo» | sus palabras |
| 70,05 | split | «Para ponerlo en tu terminal» + párrafo de Claude Code con `claude --model claude-` marcado + «claude-haiku-5-5» + «y empezá a probarlo» | Claude Code docs, captura + sus palabras |
| 75,76 | cara | «La tabla y la cuenta están en mi comunidad, gratis» | sus palabras |
| 79,33 | split | tarjeta de cierre «Buscá HAIKU en Avisos · link en mi perfil» (8 palabras, una sola acción, 2,4 s hasta el final) | sus palabras |

**Capturas** (`capturas/`, todas de hoy): `haiku-spec`, `haiku-precios`, `haiku-liberado`, `haiku-30`, `haiku-uso` (https://platform.claude.com/docs/en/models/haiku-5-5/overview),
`haiku45-spec` (https://platform.claude.com/docs/en/models/haiku-4-5/overview), `pensamiento-salida` y `pensamiento-apagar` (https://platform.claude.com/docs/en/build-with-claude/thinking),
`terminal` (https://code.claude.com/docs/en/model-config), `precio-larga` (https://platform.claude.com/docs/en/about-claude/pricing). **`pensamiento-apagar` y `precio-larga` son evidencia: no se ven en pantalla.**
`logo-anthropic.png`: `hermes-content/references/brand-claude/anthropic.svg` (logo oficial, no recreado) en su tile blanco; no se usó el starburst terracota de Claude.

## Medido (render final; `medicion.txt` y `plan.txt`)

| Qué | Resultado |
|---|---|
| **Regla 15**, `silencedetect noise=-35dB d=0.3` sobre el audio del render | **0 silencios** (también 0 a −45 dB; a d=0,2 salen 11 pausas de 0,2-0,3 s: los empalmes de 0,24 s) |
| Sonido | **−13,0 LUFS · LRA 2,6 LU · TP −1,6 dBFS** (receta −13 ±0,5 · LRA 2,3-3,4 · TP ≤ −1) |
| Control contra la receta | 22 escenas · 14 cambios de layout (1,71 por 10 s; receta 0,75-2,1) · split 61 % · cara 19 % · persona reducida 18 % · lámina 3 % · tramo sin cara más largo 2,1 s · algo cambia cada 2,3 s · 71 elementos nuevos (8,7 por 10 s; receta 6-9) · 3 golpes de zoom · 2,90 palabras/s (receta 2,65-3,2) · prueba en pantalla a 0,00 s · primer subtítulo a 0,12 s |
| Ojos | 67,5 % en split y 46,0 % en cara completa; paso split→cara 413 px; escala por toma ×1,08-1,10 (5 tomas) |
| Saltos internos del bruto | 0,9 · 72,7 · 137,3 · 165,2 s: el de 72,7 es el pegue entre las dos tomas; los cuatro caen en tramos que el corte tira |
| Cortes «a la vista» (sin cambio de panel) | 10 de 29: 3,31 · 12,93 · 14,15 · 16,84 · 40,17 · 44,09 · 51,23 · 55,72 · 72,83 · 78,83 s, más 4 dentro de la ventana reducida (23,91 · 26,71 · 28,06 · 34,32). Salto de ojos en los 10 (`medir-salto-cara.py`, YuNet sobre el render): dx ≤ 9,5 px, dy ≤ 27 px; 9 de 10 con dy ≤ 8,4 px. **Mirar en el preview 55,72 s (dy 27 px) y 72,83 s (la cara se achica 27 px de ancho)**. Referencia sin corte, mismos 3 cuadros dentro de un tramo: dx mediana 2,8 y p90 6,7 px; dy mediana 2,0 y p90 5,1 px |
| Rojo / terracota | ninguno de diseño: en el recorte del panel (0-900 px) el único rojo son ≈ 203 px por cuadro = el punto `#FF5F57` del marco de navegador del molde (santiago.py:303). El subtítulo activo sigue amarillo `#FDC82F` del molde |
| **No cumple** | duración 81,7 s sí entra (65-120); **cola tras la última palabra 0,19 s** (receta 0,3-0,65) y **sin remate ni despedida** (necesitan toma nueva, no se arman con otras palabras); el CTA dura 2,4 s en pantalla (receta 2,4-5,5, justo en el piso) |

## Qué miré y qué no

Miré: 22 cuadros sueltos (`--fotos`), las hojas de control `sheets/sheet-01…09` a 2 fps (1, 2, 4, 6, 8 y 9 enteras), el panel de 8,4 · 14,8 · 27,9 s a 720 px y los 6 cuadros de `cuadros/`.
Medí con ffmpeg/YuNet: silencios, LUFS/LRA/TP, salto de cara, rojo. **No escuché el audio** (no tengo cómo): el karaoke, el tono, los roces del micrófono y las palabras de la tabla de arriba quedan sin confirmar.

## Trampas de este armado (nuevas respecto de N06 y DD-A)

1. **La cabecera «Pricing»/«Availability» de las tarjetas de platform.claude.com es `position: sticky`.** `capturar-openai.mjs` oculta lo fijo Y lo sticky, y la tarjeta salía con un hueco vacío arriba; pasarlo a `relative` conservaba su `top` y la cabecera caía encima de la primera fila. `capturar-anthropic.mjs` oculta solo lo `fixed` y pasa lo sticky a `static`.
2. **Páginas larguísimas** (`code.claude.com/docs/en/model-config`: el ancla cae a y = 46.517 px): el viewport de 15.000 px de la copia de OpenAI no alcanza («Clipped area is empty»). Con `fullPage: true` + `clip` sale sin tocar el viewport (documento que scrollea; la de OpenAI scrolleaba el body).
3. **`capturas.json` y `--forzar`:** si se cambia el texto de una `frase` de una captura que ya existe, el script la salta («ya existe») y el `marcas` de santiago.py falla con KeyError; hay que borrar su entrada del JSON o usar `--forzar`. Me pasó con `terminal`.
4. **`<dt>Released</dt><dd>October 7, 2026</dd>`:** la búsqueda de frases cruza nodos de texto pero no inventa el espacio entre elementos; se ancla a «Released» y se marca solo «October 7, 2026». Un `<code>` que se parte en dos renglones da una caja que tapa las letras vecinas (se marcó solo la parte de un renglón: `claude --model claude-`).
5. **Rojo escondido en la página oficial:** el código en línea de la página de pensamiento (`max_tokens`, `thinking: {type: "disabled"}`) sale en rojo; el recorte de `pensamiento-salida` se achicó a 2 renglones para que no entre. La tarjeta de Haiku 4.5 sale de su propia página de modelo (misma caja «Input pricing / Output pricing» que la de 5.5) y no de la tabla de precios de 25 filas, que no deja ver el encabezado de columnas junto a la fila.
6. **Un disparador toma la PRIMERA aparición:** «para clasificar» pegó a 39,73 s (la frase de «para qué sirve») en vez de 68,2 s; con «para clasificar apagarlo» sale bien. Se ve en «— disparos —» de `plan.txt`.
7. **Segunda pasada de Whisper como segunda opinión, gratis:** `beam_size=5` dio «Si armás bots» y «te armó» (Whisper small de una pasada decía «Ser más bots» y «termó»). Antes de inventar una corrección, buscar la frase en el guion de la pieza (`GRABAR-10-16-OCT.md`, N07): las cuatro lecturas «altas» de la tabla estaban ahí. El `initial_prompt` con vocabulario no cambió nada.
8. **Un tramo largo en `split` sin cambio de layout** (60,07-75,76 s, cuatro escenas) se rompió pasando «apagalo» a cara completa; partir una escena larga de panel en el corte (`gancho`/`antes-ahora`, `nadie`/`mismo-texto`, `por-token`) bajó los cortes «a la vista» de 13 a 10.
9. **Texto en pantalla que repite el subtítulo en el mismo segundo** («esto te toca» sobre la cara, con el mismo subtítulo debajo) se sacó; en la cara completa quedan solo los titulares.
10. **El autosync ya commiteó estados intermedios de esta carpeta** (`capturas/capturas.json`, `plan.txt`, `storyboard.json` figuran como modificados contra un commit previo); esta carpeta se commitea entera cuando la madre lo decida. `Broken pipe` al final del log del render es el decodificador del bruto cerrado: inofensivo.

## Archivos

`rehacer.sh` · `armar-transcript.py` + `arreglos.json` + `dudosas-extra.json` → `segments-cut.json` + `palabras-a-confirmar.txt` · `storyboard.json` ·
`capturar-anthropic.mjs` → `capturas/` (10 PNG + logo + `capturas.json`) · `plan.txt` · `medicion.txt` · `medir-salto-cara.py` · `cuadros/` (6 JPG del render a 540 px: 1,0 · 14,6 · 28,4 · 36,9 · 62,9 · 80,6 s) ·
`BORRADOR-no-es-master-360p.mp4` (2,0 MB; es el 1080x1920 reducido, con subtítulos y molde). El render completo y la hoja de control (`sheets/`, 9 hojas a 2 fps) quedan en la carpeta de trabajo.
