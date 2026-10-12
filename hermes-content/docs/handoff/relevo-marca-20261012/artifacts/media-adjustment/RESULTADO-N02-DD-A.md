# N02 — una pieza revisable, ajuste privado conservando montaje Claude

## Resultado
Preview: N02-preview-sin-arranque-falso.mp4, 360x640, 30 fps, duración 109,033333 s. No es master y no está aprobado ni publicado.
Se editó el render original ya compuesto; NO se sustituyó por el bruto ni por un corte sin tarjetas. El video se codificó sin pérdida para conservar píxel por píxel todos los cuadros retenidos. Se recodificó únicamente el audio AAC con el mismo contenido y ganancia, sin voz nueva.

## DD-A: audio original recuperado, duda NO resuelta
Fuente: Drive F9630B16-57F2-465E-9289-0D0DDBE787A2.mp4, id 1rHY7WjqjRaEnfIqgdDMOXXfMhF2oZ3Ae; copia DD-A-bruto-original.mp4 de 92.453.888 bytes, SHA256 8220af93f24be363a90c9fcc0fad4c1a77e4f9fb4556abe4cefaaace2f302593.
Se extrajo el intervalo original [61,69) s a DD-A-original-61-69.wav, PCM mono 16 kHz, sin normalización ni transcripción nueva.
La herramienta de emisión respondió: "audio content omitted because you do not support audio input". No hay whisper, faster_whisper, torch ni vosk instalados, ni modelo Whisper cacheado. Por ello NO pude escucharlo ni contrastar fonéticamente el nombre. No se afirma que el audio sea ambiguo o ininteligible: el bloqueo es del entorno.
La transcripción existente dice "con astra son 400 dólares ... con sol"; la escena confirmar mantiene [CONFIRMAR 01:01–01:09] y un crédito pendiente. La captura DD-A-marcador-original.png muestra astra como subtítulo. Son hipótesis/transcripción previa, no prueba auditiva independiente.
La palabra disputada está documentada en bruto 64,8–65,2 s, salida ≈49,90 s. Se conserva marcador y subtítulo. No se cambiaron cifras ni datos.
Fuentes GitHub: rama claude/gifted-clarke-y4vvtj, carpeta videos/marca-personal/2026-10-11/dd-a-openai-sol/. README comprobado también en 5dfefc8f, SHA 5f044ede73808a966b27e3ff989e6d0f5c306a8f. Transcript SHA 4ff97339154072d93a221bb80936a478ee5a5db6; storyboard SHA b3ced26f80e18d7b252638dcaa98010a2de2fd65.

## Ubicación exacta de N02, no inferida
Fuentes: oninteligenciaartificial/onia-hermes, rama claude/gifted-clarke-y4vvtj, videos/marca-personal/2026-10-11/n02-sonnet-45/.
Cutplan original: SHA Git 57c29f61c01d13598ae0f296f12b50982b4bc173, comprobado idéntico en commit 90e00270.
Storyboard original: SHA 297c8e36782b013959bc4bcc5e068f0e186f7ca5.
Segments original: SHA 831ef6c7964bc1e361752ab292d482e8ce1fcb47.
Render original: ../media-review-n06/N02-borrador-original-Claude.mp4, Git blob 920045de1acb6d682167eeb7bb14f74c6661dba4.
El README identifica B11, escena sin-palabras, salida [102,89,105,16), bruto 142,15–144,52. La tabla orientativa lo llama 2,3/2,4 s, pero el cutplan contiene dos intervalos keep:
- índice 51: bruto [142,15,142,89), salida [102,89,103,63)
- índice 52: bruto [142,99,144,52), salida [103,63,105,16)
Son 2,27 s efectivos: el hueco bruto 142,89–142,99 ya estaba cortado.
La documentación lo describe como posible arranque en falso de "La lista", sin subtítulos ni tarjeta, con salto de toma. No se declara una escucha nueva de esa frase. La propuesta elimina el bloque documentado, no inventa su contenido.

## Cambio privado exacto
En el render a 30 fps se eliminan cuadros [3087,3155), es decir [102,900000,105,166667) s: 68 cuadros, 2,266667 s. Todo lo posterior se desplaza ese tiempo, conservando tarjetas y subtítulos quemados.
La diferencia de 3,333 ms respecto a los 2,27 s canónicos es redondeo al cuadro, no un corte extra.
La primera palabra del CTA en la fuente empieza a 105,278 s; el intervalo eliminado no se solapa con ninguna palabra anotada.
El preview pasa de 3339 a 3271 cuadros: 111,30 → 109,033333 s.

## Propuesta del proyecto existente
Copias de evidencia original y propuestas están en este paquete. Se retiraron keep 51/52 del cutplan (55 →53; duración canónica 109,0 s), la escena sin-palabras del storyboard y se desplazaron 19 palabras posteriores 2,27 s en segments.
No se alteró ningún texto ni disparador por frase del CTA.
El comando original rehacer.sh está incluido como evidencia; NO se ejecutó ni se afirma validado el render desde estas propuestas: requiere el motor/assets y cv2, ausente aquí. La reproducción demostrada del preview es reproducir-N02-preview.sh sobre el render original recuperado.

## QA efectiva
- Decodificación completa exit 0; H264 360x640 30 fps, AAC estéreo 48 kHz.
- 3271/3271 cuadros retenidos coinciden exactamente con los MD5 de cuadros originales, retirando solo los 68 citados. Por ello tarjetas y textos quemados son idénticos.
- Correlación audio con la referencia original recortada: 0,99989–0,99999 en ventanas 20,0 / 102,7 / 103,2 / 106,0 s, mejor desfase 0 muestras en todas. No se declara revisión fonética/labial completa.
- Cero silencios >=0,3 s a -35 dB; cero intervalos negros >=0,1 s.
- Loudness -13,2 LUFS, LRA 1,8 LU, true peak -0,4 dBFS. El margen de pico es menor al objetivo de un master; se mantiene el audio original para esta revisión.
- N02-empalme-comparado.jpg muestra cuadros inmediatamente antes y después. Se revisaron visualmente: texto previo termina en "otra", CTA comienza en "La lista"; no se cortó texto anotado ni se taparon tarjetas.
- Se conserva la breve bajada de cámara existente al inicio del CTA: hay un momento de cara completa heredado antes de la tarjeta. No se declara un empalme invisible; revisarlo a velocidad real antes de master.
- El proyecto usa timings de Whisper sin alineación forzada. Lo verificado es ausencia de desfase NUEVO; la exactitud original palabra a palabra sigue pendiente.

## Acceso y reproducción
El paquete mantiene media-adjustment/ y media-review-n06/ para que bash media-adjustment/reproducir-N02-preview.sh encuentre el original. No necesita descargar ni instalar nada.
Audio DD-A y evidencia del marcador están incluidos; el bruto de 92,5 MB se conserva solo en el workspace y no se duplica en el paquete.
SHA256 del preview: c60a66dacd416b1712afab6a31604b118f8a1af4a053047b3562a5ee7d6793a1.

## Pendiente de OK
Revisar este recorte privado y el empalme; escuchar/verificar lecturas pendientes y contenido original; preparar master 1080 desde proyecto con dependencia autorizada cuando corresponda. DD-A continúa bloqueado por falta de escucha/transcripción efectiva. No se aprobó un master, no se publicó, no se contactó a otras sesiones, no se instaló ni gastó créditos.

