# Tabla de cortes · N06 · Gemini CLI se apagó, llega Antigravity
> Bruto en Drive «Videos Onia Octubre»: `1CCFE9FE-10EB-496A-AED1-94386197DECE.mp4` (subido el 11-oct). Molde: Santiago «noticia con tarjetas». Mapeo hecho por lo que dice el audio (transcripción con `faster-whisper small`), no por el tamaño.

Bruto 59.2 s → corte 45.5 s (se tiran 13.7 s). Silencio medido en el audio: `silencedetect -35dB` ≥ 0.3 s; aire que queda en cada empalme: 0.24 s (regla 15: ≤ 0,3 s). **No se cortó nada en definitivo: esto es la propuesta.**

| # | Bruto (entra–sale) | En el corte | Dura | Qué se dice | Lo que se tira |
|---|---|---|---|---|---|
| 1 | 00:00.76–00:14.31 | 00:00.00–00:13.28 | 13.3 s | Si tu Gemini CLI dejó de contestar, no fue por tu computadora, simplemente fue que Google lo apagó [?] el 18 de junio y lo cambió por Antigravity CLI le pasó a quien lo usaba gratis o de pago en planes Pro o Ultra. | 0.76 s de silencio inicial · 3 micro-recortes de pausas (0.27 s en total, de ≤ 0.09 s cada uno) |
| 2 | 00:15.27–00:26.22 | 00:13.28–00:23.72 | 10.4 s | [¿Y los?] que lo usaban, simplemente descargate [?] la nueva aplicación de Antigravity y tenés los planes gratuitos o lo podés usar mediante comando con estos comandos aquí. | **0.96 s** de aire muerto antes · 3 micro-recortes de pausas (0.51 s en total, de ≤ 0.24 s cada uno) |
| 3 | 00:29.13–00:37.09 | 00:23.72–00:31.12 | 7.4 s | Simplemente si lo haces mediante la terminal, marcas tus extensiones y tu configuración y marcas qué querés traer de vuelta. | **2.91 s** de aire muerto antes · 4 micro-recortes de pausas (0.56 s en total, de ≤ 0.31 s cada uno) |
| 4 | 00:39.99–00:49.31 | 00:31.12–00:40.14 | 9.0 s | Lo único que si tenés alguna skill local instalada, la tenés que mover vos mismo, entras a la carpeta de skills [?] y las arrastras a su nueva carpeta. | **2.90 s** de aire muerto antes · 2 micro-recortes de pausas (0.30 s en total, de ≤ 0.18 s cada uno) |
| 5 | 00:52.26–00:57.92 | 00:40.14–00:45.50 | 5.4 s | Y si querés ver el paso a paso de cómo hacerlo está en mi comunidad de WhatsApp, el link está en mi perfil. | **2.95 s** de aire muerto antes · 2 micro-recortes de pausas (0.30 s en total, de ≤ 0.20 s cada uno) |
| — | 00:57.92–00:59.23 | — | — | (silencio final) | 1.31 s |

**Los cortes que se ven (0,5 s o más tirados):**

- Entre los bloques 1 y 2: se tiran 0.96 s, entre «…Pro o Ultra.» y «Sol, de los…».
- Entre los bloques 2 y 3: se tiran 2.91 s, entre «…estos comandos aquí.» y «Simplemente si lo…».
- Entre los bloques 3 y 4: se tiran 2.90 s, entre «…traer de vuelta.» y «Lo único que…».
- Entre los bloques 4 y 5: se tiran 2.95 s, entre «…su nueva carpeta.» y «Y si querés…».

**Lo que Whisper oyó mal y se corrigió a ojo (lo marcado [?] hay que confirmarlo con el audio):** «lo pagó» → «lo apagó [?]»; «Google lo apagó [?]» → «Google lo apagó [?]»; «descarate» → «descargate [?]»; «carpeta de Ains» → «carpeta de skills [?]»; «Sol, de los que lo usaba» → «[¿Y los?] que lo usaban»; «lo puedes usar» → «lo podés usar».

**Regla 15, medida en el preview:** `silencedetect -35 dB d=0.3` → **0 silencios** de 0,3 s o más (preview de 45.5 s). Cumple.


## Para revisar antes del master

- **Con sus propias palabras:** Sergio Urcullo no dijo el guion de `GRABAR-10-16-OCT.md`; subtítulos y cortes salen de lo que dijo. Dura 45,5 s: menos que los 65 s del molde Santiago; no se estira.
- **Hueco de 2,9 s después de «con estos comandos aquí»** (se tira). Si quería mostrar los comandos en pantalla, la tarjeta de los comandos va sobre la frase que sigue.
- **Dato sin re-verificar hoy:** «le pasó a quien lo usaba gratis o de pago en planes Pro o Ultra». El aviso de Google que cita `GRABAR-10-16-OCT.md` acota a «Unpaid tier and Google One users» y dice que las claves de API pagas siguen. Se re-lee geminicli.com el día del master.
- **El cierre no trae PALABRA:** «mi comunidad de WhatsApp, el link está en mi perfil». Es la variante sin palabra. Agregar «Buscá ANTIGRAVITY en Avisos» solo cuando el aviso ANTIGRAVITY esté verificado (hoy es borrador con `[CONFIRMAR]`).

## Archivos

- `preview-360.mp4`: el corte ya aplicado, en 360p (sin subtítulos ni molde: es solo el montaje de los cortes).
- `costuras.jpg`: el cuadro antes y después de cada empalme.
- `cutplan.json`: los bloques que se conservan (formato de `editor-videos`).
- `transcript-whisper-small.json`: lo que Whisper oyó, con tiempos por palabra (sin corregir).

Qué sigue: con el «mostrada, publicá» de la madre sobre el corte, el master con el molde y los subtítulos corregidos; después otra vuelta de revisión visual (390 px) antes de publicar.

