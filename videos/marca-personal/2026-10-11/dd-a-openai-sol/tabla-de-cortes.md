# Tabla de cortes · DD-A · OpenAI Sol cuesta un quinto y la caché 20 veces menos
> Bruto en Drive «Videos Onia Octubre»: `F9630B16-57F2-465E-9289-0D0DDBE787A2.mp4` (subido el 11-oct). Molde: Santiago «noticia con tarjetas». Mapeo hecho por lo que dice el audio (transcripción con `faster-whisper small`), no por el tamaño.

Bruto 78.5 s → corte 58.4 s (se tiran 20.1 s). Silencio medido en el audio: `silencedetect -35dB` ≥ 0.3 s; aire que queda en cada empalme: 0.24 s (regla 15: ≤ 0,3 s). **No se cortó nada en definitivo: esto es la propuesta.**

| # | Bruto (entra–sale) | En el corte | Dura | Qué se dice | Lo que se tira |
|---|---|---|---|---|---|
| 1 | 00:01.20–00:13.65 | 00:00.00–00:11.83 | 11.8 s | El modelo nuevo de OpenAI cobra 2 dólares por millón de token. El grande GPT 6 Astra cobra 10. Este modelo se llama GPT 6 .1 Sol, lo presentaron el 29 de septiembre en su Dev Day. | 1.20 s de silencio inicial · 4 micro-recortes de pausas (0.62 s en total, de ≤ 0.21 s cada uno) |
| 2 | 00:15.34–00:31.43 | 00:11.83–00:27.36 | 15.5 s | Los dos cobran lo que entra y lo que sale. Sol cobra 2 y Astra cobra 10. Y según OpenAI Sol se acerca Astra. Si tu bot usa Astra yo lo probaría con Sol antes de cambiarlo. Pero para investigación científica y programación te sigo [?] recomendando Astra, | **1.69 s** de aire muerto antes · 3 micro-recortes de pausas (0.56 s en total, de ≤ 0.26 s cada uno) |
| 3 | 00:34.26–00:44.17 | 00:27.36–00:36.93 | 9.6 s | pero hay una tarifa mucho más económica, la caché es lo que va igual al principio como tu lista de precios, si sale de la caché cuesta 10 centavos el millón, 20 veces menos. | **2.83 s** de aire muerto antes · 2 micro-recortes de pausas (0.34 s en total, de ≤ 0.21 s cada uno) |
| 4 | 00:47.54–00:58.71 | 00:36.93–00:46.78 | 9.9 s | Te hago [?] la cuenta, instrucciones y lista de precios 2 .000 tokens por mensaje, por mil mensajes 2 millones, a 2 dólares el millón, 4 con caché, 20 centavos, | **3.37 s** de aire muerto antes · 5 micro-recortes de pausas (1.32 s en total, de ≤ 0.35 s cada uno) |
| 5 | 01:01.55–01:09.13 | 00:46.78–00:54.10 | 7.3 s | o sea si tu negocio recibe 100 mil mensajes al mes con astra [?] son 400 dólares en cambio que con sol son solo 20 dólares, | **2.84 s** de aire muerto antes · 2 micro-recortes de pausas (0.26 s en total, de ≤ 0.13 s cada uno) |
| 6 | 01:12.44–01:16.88 | 00:54.10–00:58.42 | 4.3 s | si querés que lo probemos en tu negocio asesoría gratis, link en mi perfil | **3.31 s** de aire muerto antes · 1 micro-recortes de pausas (0.12 s en total, de ≤ 0.12 s cada uno) |
| — | 01:16.88–01:18.47 | — | — | (silencio final) | 1.59 s |

**Los cortes que se ven (0,5 s o más tirados):**

- Entre los bloques 1 y 2: se tiran 1.69 s, entre «…su Dev Day.» y «Los dos cobran…».
- Entre los bloques 2 y 3: se tiran 2.83 s, entre «…recomendando Astra,» y «pero hay una…».
- Entre los bloques 3 y 4: se tiran 3.37 s, entre «…20 veces menos.» y «Te hago [?]…».
- Entre los bloques 4 y 5: se tiran 2.84 s, entre «…20 centavos,» y «o sea si…».
- Entre los bloques 5 y 6: se tiran 3.31 s, entre «…solo 20 dólares,» y «si querés que…».

**Lo que Whisper oyó mal y se corrigió a ojo (lo marcado [?] hay que confirmarlo con el audio):** «Tavo la cuenta» → «Te hago [?] la cuenta»; «te siguió recomendando» → «te sigo [?] recomendando»; «si queres» → «si querés»; «con astra son 400» → «con astra [?] son 400».

**Regla 15, medida en el preview:** `silencedetect -35 dB d=0.3` → **0 silencios** de 0,3 s o más (preview de 58.4 s). Cumple.


## Para revisar antes del master

- **⚠ La cifra de la cuenta puede estar mal dicha.** Whisper oyó: «100 mil mensajes al mes **con Astra** son 400 dólares, en cambio **con Sol** son solo 20». Con los precios que dice la propia pieza: 100 mil mensajes × 2.000 tokens = 200 millones de tokens. **Sol sin caché: US$400. Sol con caché (US$0,10 el millón): US$20. Astra sin caché (US$10 el millón): US$2.000.** Entonces «400 contra 20» es Sol sin caché contra Sol con caché. Si de verdad dijo «con Astra», el dato es falso y hay que regrabar o cortar esa frase (bruto 01:01–01:09). Hay que escuchar ese tramo antes del master.
- «te sigo recomendando Astra» y «Te hago la cuenta» son lo que Whisper oyó como «te siguió» y «Tavo»: confirmar con el audio.
- **El cierre pide la asesoría gratis** («si querés que lo probemos en tu negocio, asesoría gratis, link en mi perfil»): el link de la asesoría en la bio todavía no está, así que no sale con este cierre hasta que esté.
- Dura 58,4 s (el molde Santiago pide 65–120 s). Sin yap ni remate: la pieza termina en el CTA.

## Archivos

- `preview-360.mp4`: el corte ya aplicado, en 360p (sin subtítulos ni molde: es solo el montaje de los cortes).
- `costuras.jpg`: el cuadro antes y después de cada empalme.
- `cutplan.json`: los bloques que se conservan (formato de `editor-videos`).
- `transcript-whisper-small.json`: lo que Whisper oyó, con tiempos por palabra (sin corregir).

Qué sigue: con el «mostrada, publicá» de la madre sobre el corte, el master con el molde y los subtítulos corregidos; después otra vuelta de revisión visual (390 px) antes de publicar.
