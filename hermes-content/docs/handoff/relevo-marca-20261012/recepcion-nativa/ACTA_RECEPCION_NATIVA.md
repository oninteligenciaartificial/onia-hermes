# Marca — acta de recepción nativa, 12-oct-2026

**Recepción parcial verificada: 43/59 archivos exactos, 16 rutas bloqueadas, cero diferencias de hash en lo recibido. No se acredita relevo completo ni se archiva Work.**

META: recibir y conservar el lote Work existente, incluidos N02 ajustado, originales y handoffs; conservar referentes terminados. PRUEBA: comparación independiente de las 59 filas, SHA256 y bytes medidos en destino, apertura de medios/proyectos. PARADA: totalidad cotejada o diferencia exacta; sin nuevos renders, piezas, instalaciones, gasto, cara/voz, publicación, main o merge.

## Identidad, fuentes y alcance

- Ejecutor nativo Marca: `01a13170-b488-71d9-83f8-12663d5a0013`; madre Marketing: `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`. Fuente Work: `6acbce63-abc8-83e9-8422-d849d5e15aa4`, preservada.
- Manifest origen: rama `codex/relevo-marca-20261012`, commit `1467b2d3ed4e794137311d6451165430124b30c6`, archivos `RELEVO_MARCA_20261012_MANIFIESTO.{md,json}` y SHA256SUMS en el directorio padre. Sus 59/59 pruebas son del origen; esta acta acredita solamente lo comprobado en destino.
- Análisis/referentes/workshop canónico: `7c43db59aed02bc981375336470bd256ad5606f7`, conservado sin investigación repetida. Oferta, precio, fecha, cobro y lanzamiento siguen sin aprobar; Bs120 es ejemplo.
- Instrucciones vigentes leídas: audit `154e1a15157ab6bc0c0a1d9b3fd883dfdab18edd`; delta CODEX/AGENTS de autonomía aplicado. El snapshot anterior `ed3ffa047f3bf2a99cbfd8ede5a230359932b164` permanece como procedencia.
- Runtime cloud propio: `/workspace/onia-hermes`, rama original `work`, HEAD `2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9`; no se modificó su contenido. FFmpeg/ffprobe7.1.5. Worktree de acta aislado `/workspace/work/onia-marca-acta-git`, rama `codex/recepcion-marca-20261012`, base del manifiesto. Sin main/merge.
- Equipo real retomado, máximo dos simultáneos: `/root/editorial_sol` recepción y `/root/qa_sol` QA independiente; ambos configurados `gpt-6.1-sol`, medium. Modelo interno no observable. `/root/metadatos_luna` terminó el lote previo. Solo turnos; no rondas/loops nuevos.

## Recepción y QA propios

La matriz [RECEPCION_NATIVA_59.json](RECEPCION_NATIVA_59.json) contiene todas las rutas esperadas, SHA256/bytes esperados y medidos, método de recepción y bloqueo. El manifiesto tiene 55 contenidos únicos: 43 recibidos, 12 únicos ausentes; cuatro pares de seamPNG duplicados explican la diferencia con las 59 rutas. Los duplicados ausentes no se cuentan como recibidos.

- Los 28 textos/proyectos Git se leyeron/restauraron y cotejaron; QA cotejó también los tres archivos de manifiesto: 31/31 Git exactos.
- Los ocho objetos Drive privados fueron leídos por acceso propio con el conector y exportados a referencia de archivo. Cinco llegaron efectivamente al filesystem y sus bytes fueron hasheados; tres no llegaron. Leer/exportar remoto no equivale a descargar al runtime.
- Dos ZIP pequeños recibidos se inspeccionaron y restauraron por los paths del manifiesto. No extracción ciega, paths absolutos, `..` ni symlinks.
- `media-review-n06/N02-borrador-original-Claude.mp4` se restauró por procedencia Git alternativa, bytes exactos ya preservados, commit `781df7d87b53913ac9790fa1df88e53357408bc3`, blob `920045de1acb6d682167eeb7bb14f74c6661dba4`. No se declara recibido el ZIP grande por esa copia.
- QA independiente: 43/59 SHA256+bytes PASS, 16 BLOCKED, cero FAIL; ocho medios completos (siete MP4 y WAV) con ffprobe y decodificación `-xerror` exit0; 13/13 JSON abiertos; 4/4 scripts `bash -n` exit0. Los scripts se conservan como datos, no se ejecutaron renders ni comandos de producción. Evidencia compacta en [QA_NATIVA.json](QA_NATIVA.json).

### N02 y DD-A

| Archivo recibido | Bytes | SHA256 |
|---|---:|---|
| `media-adjustment/N02-preview-revisable.mp4` | 6258418 | `0d0031e88aa8c9b24b50f53a9e4581e7171bdc02b3781e064b4611fb4be4f6e5` |
| `media-adjustment/DD-A-original-61-69.wav` | 256078 | `ebf5c5f9ab2f04fe8aa5520057ab08453f7c65162682ce46f02a0e866fd45aa5` |

N02 Work revisable: 109,033333s, 360×640, 3271 cuadros; original Claude: 111,3s, 3339 cuadros. Se recibió el render existente, sin rehacerlo. QA miró tres cuadros existentes extraídos del preview alrededor del empalme y cierre: tarjeta→cara completa→tarjeta; muestra visual, no revisión completa del movimiento. Los proyectos/cortes original y propuesto conviven. La copia sin pérdida y comparativas del ZIP grande aún faltan: no se atribuye prueba propia de igualdad de todos los cuadros retenidos ni aprobación del empalme/master/publicación.

El WAV DD-A original [61,69) está recibido y decodifica; **no fue escuchado**. Este harness rechaza audio de entrada: `audio content omitted because you do not support audio input`. No hay ASR local instalado observado (`whisper`, `faster_whisper`, `vosk`, `transformers`, `speech_recognition` ausentes); no se instaló ni llamó ASR pagado. «Astra»/«Sol» sigue sin resolver. No inferirlo del hash, transcripción o waveform.

## Bloqueo exacto y solicitud de continuación

Los tres objetos siguientes se exportaron por el conector, pero `download_file` rechazó cada uno: `file exceeds the executor transfer limit of 32 MiB`.

| Objeto existente | Drive ID privado | Bytes | SHA256 original | Partes de hasta20MiB requeridas |
|---|---|---:|---|---:|
| `N02-ajuste-privado-evidencia.zip` | `1dAZfGj0T2nKIgAdyXoKIVeFXyU5AeX6Z` | 53323533 | `e29c4b151b602de862a470c13abf1771c9489f8755791150117bc3f48b920fb6` | 3 |
| `media-adjustment/DD-A-bruto-original.mp4` | `1xFKbMIvoStrjVPbfrg6hG742kVirTPY5` | 92453888 | `8220af93f24be363a90c9fcc0fad4c1a77e4f9fb4556abe4cefaaace2f302593` | 5 |
| `media-review-n06/bruto.mp4` | `18WULGYFlDTEaAneWUDzxWrxYi5OZFbSY` | 69843125 | `6e3702e1378de3432843633c2bff2f76c654acaa251b3c38b9f1f3a9acff8fb9` | 4 |

Permiso de red oficial por comando sí funciona para Git (`sandbox_permissions: with_additional_permissions`, `additional_permissions.network.enabled: true`). La prueba HEAD oficial del ZIP grande mantiene proxy/TLS y devuelve curl56, CONNECT403, http_code000 en `sdmntprbrazilsouth.oaiusercontent.com`: el proxy rechaza ese host antes de llegar al recurso. No es fallo de autorización Drive ni un HTTP403 del archivo final. Evidencia segura en [TRANSPORTE_NATIVO.json](TRANSPORTE_NATIVO.json). No se evadió la política ni se trasladaron secretos/sesiones.

**Madre Marketing confirmó el encargo a Work para exportar los mismos tres objetos divididos en partes de hasta20MiB**, con orden, bytes/SHA256 por parte y hash/bytes original; sin recomprimir ZIP ni renderizar video. El receptor concatenará y comprobará el original antes de extraer. Alternativa: transporte binario oficial grande compatible o configuración soportada del host por madre Desarrollo. No hay nuevas piezas ni gasto autorizado por esta solicitud.

Las 16 rutas ausentes exactas son:

1. `N02-ajuste-privado-evidencia.zip`
2. `media-adjustment/DD-A-bruto-original.mp4`
3. `media-adjustment/DD-A-marcador-original.png`
4. `media-adjustment/N02-antes-ajuste.jpg`
5. `media-adjustment/N02-despues-ajuste.jpg`
6. `media-adjustment/N02-empalme-comparado.jpg`
7. `media-adjustment/N02-preview-sin-arranque-falso.mp4`
8. `media-adjustment/seam-0.png`
9. `media-adjustment/seam-1.png`
10. `media-adjustment/seam-2.png`
11. `media-adjustment/seam-3.png`
12. `media-adjustment/seam-4.png`
13. `media-adjustment/seam-5.png`
14. `media-adjustment/seam-6.png`
15. `media-adjustment/seam-7.png`
16. `media-review-n06/bruto.mp4`

## Conservación

Archivos recibidos actuales: `/workspace/work/onia-marca-recepcion-20261012/received/`; fuentes y pruebas propias: `source/`, `transport/`, `qa/` del mismo directorio. Son rutas de este runtime, no sandbox heredado ni garantía tras reinicio. Git/Drive originales siguen siendo fuentes durables; esta rama conserva acta/matriz/QA mínimos, sin duplicar binarios grandes ni skills, sin URLs firmadas o credenciales.

Los referentes PC nunca recibidos en cloud figuran como fuentes externas, no como pérdida de Work; el análisis canónico permanece intacto. No se borró/archivó ningún origen. No master sin ok cortes, publicación, nueva edición, instalación, gasto, infraestructura, ronda automática ni promoción a main. El próximo paso dependiente es recibir partes/transporte compatible y cotejar las 16 rutas; la palabra DD-A requiere capacidad real de escucha o confirmación explícita.
