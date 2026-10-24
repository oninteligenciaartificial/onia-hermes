# Dictamen independiente del complemento Gadzhi

Fecha: 23-oct-2026. Task: task_f7ddcba35434. Dispatch: ctx_1e0e6ed0d085.

**CAMBIOS NECESARIOS.** Un pase local acotado sobre complemento y adenda S08; no constituye revisión nueva del paquete original ni aprobación de publicación o investigación completa.

## Integridad y alcance

- Snapshot del complemento: 69/69 archivos SHA-256 coincidentes, sin discrepancias.
- Snapshot final original: 19/19 archivos SHA-256 coincidentes, preservados.
- Leídos COMPLEMENTO.md, cobertura-complemento.json y S08-VERIFICACION-LOCAL.md. Contrastados extractos DOM/CSS, mediciones y estados de formularios, metadatos, transcripciones ASR (campos y segmentos pertinentes), logs de escenas, las cinco hojas de contactos S11/S05/S12/S13/S14 y muestras visuales pertinentes de móvil y S08. No hubo escucha de audio ni visionado continuo del revisor, investigación externa o nueva descarga.

## Hallazgos prioritarios

1. **Alta — C4 usa una premisa contradicha por su propia evidencia.** COMPLEMENTO.md:157 dice «S12, S13 (cero CTA hablado en ~50 min)» para justificar CTA solo al final. Pero :125 documenta en S12 la petición de like/comentario y sorteo; S12-transcripcion-whisper-local-en.json contiene el tramo 377.64–414.62 s. :126 solo establece ausencia del CTA *al reto* en el ASR, no de toda llamada a la acción. El canon de un CTA es compatible con la propuesta, pero no está demostrado por ese ejemplo: distinguir CTA comercial, CTA de interacción y ausencia de menciones detectadas; presentar la colocación solo al final como decisión propuesta.

2. **Media — Ausencia de detección ASR presentada como ausencia de habla.** COMPLEMENTO.md:58 afirma apertura «sin habla» hasta 9 s y :60 atribuye música/imagen a huecos ASR. :79–83 y cobertura-complemento.json, pieza S05, también usan «sin habla»/«sin diálogo reconocible» aunque ningún audio fue escuchado y el único segmento se descarta por no fiable. La evidencia solo permite «ASR no detecta habla fiable»; no certifica silencio, música sin voz ni ausencia de CTA auditivo. Conservar las advertencias generales de :20, :36 y :70, pero aplicarlas también a esas afirmaciones concretas.

3. **Media — Picos de diferencia de escena usados como conteo de cortes y ritmo.** COMPLEMENTO.md:53,75,120,130,137 traduce scene>0.3 y agrupación temporal a ≈cortes/minuto. Los logs preservados son timestamps de detección; por ejemplo S05 contiene 22 picos, varios cercanos (2.88/3.04; 6.60/6.72; 9.48/9.52/9.68), sin validación visual continua de cada límite ni criterio de agrupación completamente reproducible. Informar «eventos/candidatos agrupados por minuto» y no cortes confirmados; no usar esos números como benchmark probado de edición.

## Cobertura real de las seis fuentes

| ID | Verificado en este pase | Límite |
|---|---|---|
| S11 | ASR de medio de 313.144 s, 87 segmentos; 15 fotogramas y metadatos fechados 12-oct | Audio no escuchado; muestras no equivalen a visionado completo |
| S05 | 12 fotogramas y extracto del post, medio reportado de 22.407 s | ASR de un segmento descartado; sonido desconocido; año del post inferido, prensa mostrada no auditada |
| S12 | ASR de 1440.264 s, 747 segmentos y 12 fotogramas; publicación 21-oct en metadatos | Muestreo visual y ASR, no audio validado; contiene CTA de interacción |
| S13 | ASR de 1621.449 s, 700 segmentos y 12 fotogramas; publicación 15-oct en metadatos | Muestreo visual y ASR; ausencia de invitación al reto solo dentro del texto reconocido |
| S14 | ASR de 1661.457 s, 570 segmentos y 12 fotogramas; publicación 18-ago en metadatos | Sorteo explícito; captura de descripción dentro del video no fecha por sí sola cuándo cambió la descripción pública |
| S08 | Adenda: medio actual 54.976 s y muestreo de 18 frames, varios inspeccionados aquí; cierre y CTA visibles | Recuperación/decode reportados por coordinador, no repetidos por revisor; no prueba VSL larga ni audio completo |

La adenda S08:31–34 supera expresamente el estado histórico «bloqueado» del complemento para el clip actual, sin recuperar la VSL histórica. El JSON sigue describiendo la fase anterior: consumirlo junto con la adenda, no como estado final autosuficiente. El MP4 temporal no forma parte de los 69 hashes verificados; no se certificó aquí su integridad de manera independiente.

## Utilidad, canon y pendientes

Los extractos DOM/CSS ahora existen y permiten inspeccionar valores reportados (familias, enlaces y CTA); no demuestran conversiones ni que las cifras comerciales sean verdaderas. Las fechas de publicación se sustentan en metadatos locales, no se reconsultaron fuentes externas. Las capturas de prensa y claims de valuación/ingresos siguen siendo declaraciones de terceros, no resultados auditados.

C1 (filtro), C2 (pasos concretos), C3 (pitch), C5 (fuente visible) y C6 (jerarquía de CTA) son propuestas útiles, sin adopción automática; cualquier duración prometida en C2 debe medirse antes de publicarse. C4 requiere corregir su fundamento. C7 mantiene explícitamente la lista de espera como alternativa pendiente, sin autorización de implementación.

No se detectó alteración de oferta: 31-oct, 50 cupos en tramos 15×Bs50/20×Bs60/15×Bs70 por acreditación, 90 min de contenido más 5 de pausa, cierre 29-oct 20:00, venta pausada, CTA bio → /auditoria → WhatsApp y límites de promesas preservados.

Móvil significa iframe de ~390×700 CSS px, no dispositivo ni touch; S06 no mostró hero/CTA. Formularios no observados/no enviados; Instagram sin recorrido de publicaciones; audio humano y audiovisual continuo no verificados; VSL larga S08 y datos de conversión siguen pendientes. Ninguno de estos huecos queda cerrado por descarga, decode, ASR o muestreo.

No se editaron entregables congelados. Solo se creó este dictamen fuera del snapshot; el cierre por lifecycle se reporta separadamente con respuesta real de Orca.
