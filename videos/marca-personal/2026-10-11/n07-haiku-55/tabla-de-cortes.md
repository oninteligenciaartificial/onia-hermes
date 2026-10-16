# Tabla de cortes · N07 · Haiku 5.5: clasificar mil mensajes de US$3 a US$0,40
> Bruto en Drive «Videos Onia Octubre»: `15270626-ABFC-4562-9DF0-2E35CDE665DA.mp4` (subido el 11-oct). Molde: Santiago «noticia con tarjetas». Mapeo hecho por lo que dice el audio (transcripción con `faster-whisper small`), no por el tamaño.

Bruto 179.7 s → corte 81.7 s (se tiran 98.0 s). Silencio medido en el audio: `silencedetect -35dB` ≥ 0.3 s; aire que queda en cada empalme: 0.24 s (regla 15: ≤ 0,3 s). **No se cortó nada en definitivo: esto es la propuesta.**

| # | Bruto (entra–sale) | En el corte | Dura | Qué se dice | Lo que se tira |
|---|---|---|---|---|---|
| 1 | 01:14.13–01:25.27 | 00:00.00–00:10.33 | 10.3 s | ¿Cuánto te cuesta que tu bot clasifique mil mensajes? Antes, tres dólares, ahora, 40 centavos. Anthropic [?] sacó Haiku 5 .5 el 7 de octubre. Por token cobra 10 veces menos. | toma anterior descartada (bruto 00:00.00–01:13.50: arrancó y se cortó; se usa la toma completa) · 4 micro-recortes de pausas (0.81 s en total, de ≤ 0.31 s cada uno) |
| 2 | 01:28.53–01:37.86 | 00:10.33–00:19.03 | 8.7 s | Haiku 5 .5 10 centavos del millón de token que entran 50 los que salen. El 4 .5 cobraba un dólar y 5 dólares. | **3.26 s** de aire muerto antes · 4 micro-recortes de pausas (0.63 s en total, de ≤ 0.30 s cada uno) |
| 3 | 01:38.90–01:46.81 | 00:19.03–00:26.71 | 7.7 s | 1000 mensajes con el pensamiento apagado cada uno, 2000 tokens que entran y 200 que salen. Con Haiku 4 .5 eran 3 dólares. | **1.04 s** de aire muerto antes · 1 micro-recortes de pausas (0.23 s en total, de ≤ 0.23 s cada uno) |
| 4 | 01:51.02–02:02.90 | 00:26.71–00:37.71 | 11.0 s | 10 veces menos serían 30 centavos, pero lo que nadie te cuenta, el modelo nuevo cuenta el mismo texto con más tokens, un 30 % más, son unos 40 centavos, aun así, casi 8 veces menos. | **4.21 s** de aire muerto antes · 4 micro-recortes de pausas (0.88 s en total, de ≤ 0.38 s cada uno) |
| 5 | 02:03.72–02:15.96 | 00:37.71–00:49.61 | 11.9 s | ¿Para qué sirve? Anthropic lo pone para clasificar, sacar datos y repartir, como un recepcionista, no no tiene la consulta la manda a quien corresponde, lo difícil se lo deja a Sonnet [?] o a opus. | **0.82 s** de aire muerto antes · 3 micro-recortes de pausas (0.34 s en total, de ≤ 0.14 s cada uno) |
| 6 | 02:18.83–02:27.84 | 00:49.61–00:58.31 | 8.7 s | Si tenes una clínica con bot, esto te toca, repartir mil consultas cuesta menos de medio dolar en el modelo, preguntala a quien armó [?] el bot que modelo usa. | **2.87 s** de aire muerto antes · 2 micro-recortes de pausas (0.31 s en total, de ≤ 0.21 s cada uno) |
| 7 | 02:31.73–02:43.74 | 00:58.31–01:10.05 | 11.7 s | Si tenés más bots [?], dos trampas, si el prompt pasa de 100 mil tokens, cobra 5 veces más y viene con el pensamiento prendido lo que piensa se cobra como salida para clasificar apagarlo y probarlo para | **3.89 s** de aire muerto antes · 2 micro-recortes de pausas (0.27 s en total, de ≤ 0.14 s cada uno) |
| 8 | 02:46.40–02:58.31 | 01:10.05–01:21.72 | 11.7 s | para ponerlo en tu terminal coloca cloud guión haiku 5 .5 y empezá a probarlo la tabla y la cuenta están en mi comunidad gratis link en mi perfil busca haiku en avisos | **2.66 s** de aire muerto antes · 2 micro-recortes de pausas (0.24 s en total, de ≤ 0.15 s cada uno) |
| — | 02:58.31–02:59.70 | — | — | (silencio final) | 1.39 s |

**Los cortes que se ven (0,5 s o más tirados):**

- Entre los bloques 1 y 2: se tiran 3.26 s, entre «…10 veces menos.» y «Haiku 5 .5…».
- Entre los bloques 2 y 3: se tiran 1.04 s, entre «…y 5 dólares.» y «1000 mensajes con…».
- Entre los bloques 3 y 4: se tiran 4.21 s, entre «…eran 3 dólares.» y «10 veces menos…».
- Entre los bloques 4 y 5: se tiran 0.82 s, entre «…8 veces menos.» y «¿Para qué sirve?…».
- Entre los bloques 5 y 6: se tiran 2.87 s, entre «…o a opus.» y «Si tenes una…».
- Entre los bloques 6 y 7: se tiran 3.89 s, entre «…que modelo usa.» y «Si tenés más…».
- Entre los bloques 7 y 8: se tiran 2.66 s, entre «…y probarlo para» y «para ponerlo en…».

**Lo que Whisper oyó mal y se corrigió a ojo (lo marcado [?] hay que confirmarlo con el audio):** «por toque en cobra» → «por token [?] cobra»; «millón de toque entran» → «millón de tokens [?] entran»; «centados» → «centavos [?]»; «Zonet» → «Sonnet [?]»; «zonet» → «Sonnet [?]»; «Antropic» → «Anthropic [?]»; «Anthropics» → «Anthropic [?]»; «cloud guión haiku 5.5» → «claude --model haiku-5.5 [?]»; «termó» → «armó [?]»; «Ser más bots» → «Si tenés más bots [?]»; «centavos [?]» → «centavos».

**Regla 15, medida en el preview:** `silencedetect -35 dB d=0.3` → **0 silencios** de 0,3 s o más (preview de 81.9 s). Cumple.


## Para revisar antes del master

- **Hay dos tomas.** La primera (00:00–01:12) se corta a los 72,4 s con «Preguntarle a quien… ¡Mierda!»; la segunda (01:14–02:58) es completa y trae un tramo que la primera no tenía («dos trampas»). Se usa **solo la segunda**; la primera queda descartada.
- **Cuenta revisada con los precios que dice:** Haiku 5.5 a US$0,10 de entrada y US$0,50 de salida por millón; 1.000 mensajes × 2.000 tokens de entrada y 200 de salida = US$0,30; con un 30 % más de tokens, ~US$0,39 («unos 40 centavos»), casi 8 veces menos que los US$3 de Haiku 4.5 (US$1 y US$5). Cuadra. **Los precios y la fecha del 7-oct no se re-verificaron hoy contra la página de Anthropic.**
- **Tramo nuevo sin fuente a la vista:** «si el prompt pasa de 100 mil tokens, cobra 5 veces más» y «con el pensamiento prendido lo que piensa se cobra como salida». Se verifica contra la doc de Anthropic antes del master.
- «Preguntale a quien armó el bot qué modelo usa» está dicho con trabas («preguntala a quien…»): se mira en el preview.
- **El aviso HAIKU existe** (`AVISOS-COMUNIDAD-8-16-OCT.md`): el cierre «busca haiku en avisos» tiene recurso. Dura 81,7 s (molde: 65–120 s).

## Archivos

- `preview-360.mp4`: el corte ya aplicado, en 360p (sin subtítulos ni molde: es solo el montaje de los cortes).
- `costuras.jpg`: el cuadro antes y después de cada empalme.
- `cutplan.json`: los bloques que se conservan (formato de `editor-videos`).
- `transcript-whisper-small.json`: lo que Whisper oyó, con tiempos por palabra (sin corregir).

Qué sigue: con el «mostrada, publicá» de la madre sobre el corte, el master con el molde y los subtítulos corregidos; después otra vuelta de revisión visual (390 px) antes de publicar.
