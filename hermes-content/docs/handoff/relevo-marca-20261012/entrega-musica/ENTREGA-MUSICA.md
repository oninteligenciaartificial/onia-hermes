# Cinco previews con música · 12-oct-2026

Autorización directa de Sergio Urcullo: añadir música y producir derivados locales revisables de los montajes existentes, sin rehacer proyectos, cortes ni imágenes. La autorización actual prevalece sobre la antigua regla de skill que entregaba sin cama musical; esta excepción queda limitada al encargo.

Autor: `/root/editorial_sol`, modelo configurable gpt-6.1-sol medium. QA independiente: `/root/qa_sol`. Sin gasto, suscripción, instalación, generación de música/cara/voz nueva ni publicación. Fuentes limpias permanecen intactas.

## Entrega

En `previews/`, para cada pieza **N06, N07, DD-A, N02-Work y S2-D07-A**:

- `<pieza>-CON-MUSICA-BORRADOR.mp4`: versión revisable con música.
- `<pieza>-SIN-MUSICA.mp4`: copia exacta de los bytes de la fuente limpia.
- `<pieza>-CREDITO-MUSICA.txt`: crédito de autor/licencia y modificaciones, debe acompañar la distribución.

N02 usa el preview Work ya recibido de 109,033333 s. El original Claude de 111,300 s continúa preservado en el lote anterior, sin sustitución. DD-A conserva su marcador y subtítulos dudosos; S2 conserva la frase de variables. La mezcla no resuelve datos, cortes ni permisos de master/publicación.

## Pista y licencia comprobadas antes de mezclar

**House In a Forest Loop — HorrorPen, copyright 2012. CC BY 3.0 Unported.** Música preexistente, no generada con IA y distinta de los SFX disponibles.

Fuente musical declarada: https://opengameart.org/content/loop-house-in-a-forest . El README de `godotengine/godot-demo-projects` identifica expresamente ese archivo y licencia; se leyó en commit `b761b4cd5718a7118f2c95eb55f181d0a5f004f1`, blob `bd461bd788aaa55a0374a8497651838aa61a0f80`. El asset recibido coincide con blob Git `ece36402739a3cb884647df78e6ea95315cbf223`; 1.430.743 bytes; SHA256 `32680f2b2631eb9f6e2902ebbbec1b43ab82b4dbf154fdc9bfbfa17b03270504`. Sus tags internos TITLE/ARTIST coinciden; ENCODER declara FL Studio. Es un loop de 25,174830 s, Vorbis estéreo, 44,1 kHz.

Se leyó el texto legal completo de CC BY 3.0 desde el repositorio oficial `creativecommons/creativecommons.org`, commit `7f5253347532fc0cb6cf51d78a7085d081fb4216`, `docroot/legalcode/by_3.0.txt`, blob `1a16e05564d2aaa880bbe9e506a0a0226d8742cc`. La sincronización musical se define como adaptación (§1a); se permiten adaptaciones, distribución y ejecución pública (§3b–d), mediante licencia mundial sin royalties y en todos los medios/formatos (§3), sin prohibición de uso comercial.

Esto cubre el uso musical comercial en videos para Instagram, TikTok, Facebook, YouTube, LinkedIn y X **con las condiciones de CC BY 3.0**: atribución de título/autor/fuente/licencia, identificar modificaciones, mantener avisos, no imponer restricciones/DRM sobre la música ni sugerir aval del autor. No se otorgan derechos exclusivos ni sublicencias ajenas a esa licencia. No se verificaron cuentas o publicación en plataformas durante este encargo.

Crédito completo en `licencias/CREDITO-OBLIGATORIO.txt`, archivos por pieza y metadata MP4. Para cualquier futura publicación autorizada deberá aparecer también en caption/descripción: no depender de que la plataforma conserve o muestre metadata. Se guardan README, licencia íntegra y `REGISTRO-LICENCIA.json`, fecha de comprobación 12-oct-2026.

La lectura directa de creativecommons.org recibió HTTP 403; se usó su repositorio oficial accesible mediante GitHub. El asset se descargó de raw.githubusercontent.com con permisos oficiales de red por comando. Sin bypass de proxy/TLS ni cambio de política.

## Mezcla y validación de autor

FFmpeg 7.1.5. `mezcla/mezclar.py` y los comandos JSON por pieza reproducen el lote. `-c:v copy` conserva el video; la voz original mantiene su estructura temporal y solo se vuelve a codificar dentro de la mezcla AAC. Música repetida a duración de cada video, normalizada a −26 LUFS antes de ducking, filtrada 60–8000 Hz, fade inicial 0,25 s y final 0,6 s. Sidechain por RMS de la voz: threshold 0,06, ratio 3, ataque 10 ms, release 180 ms. Mezcla sin normalizar/sumar ganancia a la voz y limitador a −1,5 dB antes de AAC; se mide el pico real de la salida ya codificada.

**Cinco de cinco hashes del payload de video originales y derivados coinciden**, las copias limpias coinciden con SHA256 de fuente y el delta de duración de contenedor es **0,0 s** en todas. También se conservan probes y medidas EBU R128 completas en `manifest.json` y logs. `MEDICIONES.md` resume los resultados: mezcla −13,0 a −14,1 LUFS; pico real final −1,4 a −1,1 dBFS; música ducked −32,7 a −32,2 LUFS. La música queda aproximadamente 18–20 LU debajo de la voz integrada. Es medida técnica, no juicio de audición.

El primer intento falló por formato incorrecto de argumentos de metadata; se corrigió antes de producir los derivados y se conservaron el comando y log fallidos. No afectó las fuentes. La ejecución final completó cinco piezas y las comprobaciones anteriores.

**No escuchado por el modelo.** El harness no admite audio de entrada. El carácter de la pista, volumen subjetivo, loop y mezcla necesitan audición real de Sergio Urcullo; no se afirma «suena bien» o «sincronizado al oído» desde métricas. QA independiente registra sus propios controles separados.

## Conservación y siguiente paso

`manifest.json` tiene hashes/bytes, fuentes, salidas, controles de video, métricas, licencia y flags editoriales. `SHA256SUMS.txt` cubre el paquete; stems de música ducked y logs están en `mezcla/`. Se mantienen originales limpios y los proyectos anteriores; lote Work continúa 43/59 sin modificar ni olvidar partes pendientes.

Estas son versiones privadas **para revisar**, no masters. Root podrá transferir los outputs privados autorizados después del QA; no se hizo sharing nuevo, publicación en redes, commit/push/main/merge ni contacto con terceros por el ejecutor.
