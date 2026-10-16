# Tabla de cortes · S2-D07-A · La ventana de 24 horas de WhatsApp
> Bruto en Drive «Videos Onia Octubre»: `3941A129-133A-4618-BB88-7C191DC1AF3B.mp4` (subido el 11-oct). Molde: Erik de septiembre (`recetas/erik.json` + `erik_edit.py`). Mapeo hecho por lo que dice el audio (transcripción con `faster-whisper small`), no por el tamaño.

Bruto 104.4 s → corte 90.7 s (se tiran 13.6 s). Silencio medido en el audio: `silencedetect -35dB` ≥ 0.3 s; aire que queda en cada empalme: 0.24 s (regla 15: ≤ 0,3 s). **No se cortó nada en definitivo: esto es la propuesta.**

| # | Bruto (entra–sale) | En el corte | Dura | Qué se dice | Lo que se tira |
|---|---|---|---|---|---|
| 1 | 00:00.74–00:44.31 | 00:00.00–00:40.58 | 40.6 s | Hay algo en WhatsApp que se llama la ventana de 24 horas. Si tenés un chat bot de WhatsApp y querés que envíe mensajes después de las 24 horas de iniciar una conversación con tus clientes, tenés que hacerlo mediante plantillas. Y cómo funciona todo esto? Cuando un cliente te envió un mensaje, el bot le responde de la manera que vos le hayas enseñado. Si, por ejemplo, tu clínica se llama Clínica Dental de Sergio [?], por ejemplo, ahí vos le colocaste. tenemos estos horarios, tenemos estos doctores, tenemos estos tratamientos y demás, después de las 24 horas que pasaron de iniciada la conversación ya no puede ser respondido de esa manera, solo puede ser respondido mediante plantillas de Meta verificadas y probadas. | 0.74 s de silencio inicial · 18 micro-recortes de pausas (2.99 s en total, de ≤ 0.38 s cada uno) |
| 2 | 00:46.42–00:48.70 | 00:40.58–00:42.56 | 2.0 s | Por ejemplo, una plantilla sería un | **2.11 s** de aire muerto antes · 1 micro-recortes de pausas (0.30 s en total, de ≤ 0.30 s cada uno) |
| 3 | 00:49.22–01:23.67 | 00:42.56–01:14.42 | 31.9 s | un mensaje directamente con todos los horarios que tengan, pero no un mensaje con todos los horarios que tienen disponibles en ese momento, porque la plantilla es fija y no puede estar cambiándose con variables porque si no meta te las rechazaría, entonces dentro de las primeras 24 horas puedes reescribirle libremente pero luego con el agente conversacional de whatsapp después de las 24 horas es sólo mediante plantillas fijas que por ejemplo sería el horario sin personalización de [?] estaría disponible ese es el único problema que exista. | **0.52 s** de aire muerto antes · 14 micro-recortes de pausas (2.59 s en total, de ≤ 0.31 s cada uno) |
| 4 | 01:25.62–01:42.98 | 01:14.42–01:30.74 | 16.3 s | Entonces la solución que te daría sería intentar cerrar la venta dentro de las 24 horas y que después de las 24 horas sea mediante plantillas de seguimiento o de remarketing y si querés seguir aprendiendo sobre inteligencia artificial seguime y uníte a mi comunidad que está en el link de mi perfil. | **1.95 s** de aire muerto antes · 5 micro-recortes de pausas (1.04 s en total, de ≤ 0.31 s cada uno) |
| — | 01:42.98–01:44.37 | — | — | (silencio final) | 1.39 s |

**Los cortes que se ven (0,5 s o más tirados):**

- Entre los bloques 1 y 2: se tiran 2.11 s, entre «…verificadas y probadas.» y «Por ejemplo, una…».
- Entre los bloques 2 y 3: se tiran 0.52 s, entre «…plantilla sería un» y «un mensaje directamente…».
- Entre los bloques 3 y 4: se tiran 1.95 s, entre «…problema que exista.» y «Entonces la solución…».

**Lo que Whisper oyó mal y se corrigió a ojo (lo marcado [?] hay que confirmarlo con el audio):** «Clínica Vental de Sergio» → «Clínica Dental de Sergio [?]»; «corario» → «[?]»; «de meta verificadas» → «de Meta verificadas».

**Regla 15, medida en el preview:** `silencedetect -35 dB d=0.3` → **0 silencios** de 0,3 s o más (preview de 90.8 s). Cumple.


## Para revisar antes del master

- **Con sus propias palabras:** no sigue el guion de `GRABAR-10-16-OCT.md`; los subtítulos y los cortes salen de lo que dijo. Dura 90,8 s.
- **⚠ Una frase que hay que revisar:** «una plantilla… no puede estar cambiándose con variables porque si no Meta te las rechazaría» (bruto 00:57–01:04). Las plantillas de WhatsApp **sí admiten variables** ({{1}}); lo que Meta rechaza es una plantilla cuyo contenido no es el aprobado. Dicho así puede confundir a quien arma plantillas. Se confirma con el audio y, si hace falta, se corta o se regraba.
- **Tramo repetido (opcional):** de 01:04 a 01:23 vuelve sobre la idea de 00:17–00:44 (después de 24 horas, solo plantillas fijas). Cortarlo baja la pieza a ~72 s; lo decide la madre o Sergio Urcullo, no se cortó.
- **El cierre pide la comunidad, no la asesoría** («uníte a mi comunidad que está en el link de mi perfil»): el bloqueo del link de la asesoría en la bio **no aplica a esta pieza**.
- Whisper oyó «Clínica Vental» (será «Clínica Dental») y «corario» (sin sentido): se confirman con el audio.

## Archivos

- `preview-360.mp4`: el corte ya aplicado, en 360p (sin subtítulos ni molde: es solo el montaje de los cortes).
- `costuras.jpg`: el cuadro antes y después de cada empalme.
- `cutplan.json`: los bloques que se conservan (formato de `editor-videos`).
- `transcript-whisper-small.json`: lo que Whisper oyó, con tiempos por palabra (sin corregir).

Qué sigue: con el «mostrada, publicá» de la madre sobre el corte, el master con el molde y los subtítulos corregidos; después otra vuelta de revisión visual (390 px) antes de publicar.
