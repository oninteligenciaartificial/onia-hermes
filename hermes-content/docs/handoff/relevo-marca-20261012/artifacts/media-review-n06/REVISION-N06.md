# N06 — preview privado del corte propuesto; NO MASTER

## Alcance y resultado
Se continúa N06, sin iniciar un guion ni estilo nuevo. El preview se reconstruye desde el bruto real y los 19 intervalos `keep` del cutplan existente. No constituye recuperación del borrador gráfico Santiago: faltan sus bytes y cv2. No tiene subtítulos ni tarjetas añadidas. No se aprobó, publicó ni agendó nada.

## Procedencia verificable
- Bruto: Drive `1CCFE9FE-10EB-496A-AED1-94386197DECE.mp4`, id `1rlbdA9zLE9SZJInPmFjd1jP3S8r8yk08`; descargado mediante conector autorizado. Copia de trabajo `bruto.mp4`, 69.843.125 bytes; SHA256 `6e3702e1378de3432843633c2bff2f76c654acaa251b3c38b9f1f3a9acff8fb9`. HEVC, 1080x1920, 30 fps, AAC estéreo 44,1 kHz; duración 59,233333 s.
- Repo: `oninteligenciaartificial/onia-hermes`; ref leído `claude/gifted-clarke-y4vvtj`.
- Carpeta: `videos/marca-personal/2026-10-11/n06-antigravity/`.
- Corte existente: `cutplan.json`, Git blob SHA `e194400740876759afae1a407747e7a27fa92cfa`; tabla `tabla-de-cortes.md`, SHA `2b87ada60170ff2893b90c4f6a1bff6b46241453`.
- Borrador existente: `borrador/BORRADOR-no-es-master-360p.mp4`, SHA `a506c6a8b61f66d42a59dbdd6329f9cbf3c0e3c7`, 1.163.863 bytes; listado verificable, bytes no recuperados.
- Receta existente: `borrador/rehacer.sh`, SHA `f6984e772f02c47af380239e42910f642f5b7478`; `README.md`, SHA `eb7262c841c452f7a942eb5d37fd60aaaaea2612`.
- Commit histórico aportado: `fbad86d1`; NO se afirma que sea HEAD ni aprobación.
- Handoff leído en `claude/pagos-checkout-strategy-b40756`: `hermes-content/docs/handoff/madre-marketing.md`, SHA `526c92ae559b16875dd671e01e8bb2f035057042`.
- Se leyeron AGENTS, COORDINATION y skills canónicas editor-videos, edicion-referentes y motion-doctrine; no se duplicaron ni ejecutaron scripts de publicación.

## Comparación corte / guion / borrador
La tabla documenta cinco bloques narrativos y 19 intervalos efectivos: 59,23 → 45,50 s. El README confirma que Sergio grabó con sus propias palabras y no el guion de GRABAR; se preserva su toma, sin reemplazarla por el guion escrito. El plan del borrador gráfico tiene 18 escenas y 53 bloques de subtítulos. Hay tres saltos visibles documentados a 22,58, 26,89 y 30,50 s; las dudas de palabras siguen sin aprobación. En su plan aparecen fundidos; la conformidad de motion-doctrine del borrador NO está demostrada. Aquí no se reautoraron animaciones.

## Cambios realizados
Se materializaron el bruto y los archivos de planificación existentes. Se aplicaron EXACTAMENTE los intervalos existentes únicamente para un preview privado de revisión; se redujo a 360x640. Se normalizó la voz y se dejó margen de pico. Sin música, voz/cara generada, sustitución de identidad, nuevos claims, nuevas tarjetas o nuevas decisiones de corte.

## QA y límites
`qa.json` contiene la medición final de duración, codecs, fps, silencios, LUFS, true peak y SHA256. Decodificación completa con FFmpeg. Se revisó una hoja de nueve momentos a intervalos de cinco segundos: encuadre vertical estable, sujeto visible, sin deformación apreciable ni overlays que tapen la cara. La casilla negra final de la hoja es relleno de la grilla, no evidencia de un cuadro negro en video. No se declara QA exhaustiva cuadro a cuadro, sincronización labial por escucha, ortografía de subtítulos ni QA visual del borrador gráfico original. Audio final a volumen cómodo de preview; si queda por debajo de −13±0,5 LUFS, se registra como desviación del molde.

## Bloqueos concretos y búsqueda efectuada
GitHub `fetch_file` con base64 devolvió contenido vacío para MP4; `fetch_blob` falló con UnicodeDecodeError de UTF-8; endpoint de blob vía fetch fue rechazado. No se usaron URLs GitHub con token. Drive respondió sin resultados a búsquedas BORRADOR y N06. El bruto sí llegó por el conector. Python dispone de PIL/numpy/scipy, pero no cv2; no se instaló nada. No se pasó a N07/DD-A/N02 porque N06 permite revisar su corte sin inventar assets y es la prioridad del contrato.

## Reproducción y acceso privado
Colocar la copia autorizada del bruto como `bruto.mp4` junto a los archivos y ejecutar `bash reproducir-preview.sh`. La ruta Drive anterior permite recuperarlo mediante el conector sin cambiar permisos. FFmpeg/ffprobe 6.1.1 ya instalados. El paquete excluye el bruto para evitar duplicar 69,8 MB; contiene preview, script y evidencia. Los archivos de planificación extraídos son copias de evidencia, NO una skill ni implementación paralela del motor.

## Para OK
1. Revisar y aprobar o ajustar los cortes (este preview no los aprueba).
2. Recuperar el borrador gráfico mediante transferencia binaria soportada o habilitar explícitamente la dependencia cv2 para su receta; no instalar sin autorización.
3. Confirmar las lecturas dudosas con el audio, alcance de skills locales/proyecto y el recurso/link de comunidad.
4. Revalidar datos y capturas oficiales al preparar master; sincronía, textos y motion requieren QA propia del render gráfico.
5. Aprobación separada de master; publicación fuera de este contrato.

Incidencia de filtrado: una salida intermedia de Drive expuso una URL temporal de descarga en la respuesta de herramienta. No se incluye en los entregables ni se repite aquí.

## Medición final de esta pasada
45,600000 s; H264 360x640 a 30 fps, 1366 cuadros; AAC estéreo 48 kHz. Decodificación exit 0. Cero silencios >=0,3 s a -35 dB; cero intervalos negros >=0,1 s. -15,4 LUFS; LRA 2,2 LU; true peak -3,0 dBFS. Desviación de loudness respecto a -13±0,5: pendiente para master, preview seguro. SHA256 preview: 41d5541d69e71b85bfe3f80268fd7d650259196656c9d2dd06309be46f41d492.
