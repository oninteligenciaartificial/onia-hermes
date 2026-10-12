# QA independiente — cinco previews con música

12-oct-2026. Revisor real `/root/qa_sol`, separado del autor `/root/editorial_sol`. Se revisaron solo las cinco mezclas nuevas, sin repetir recepción59/59 ni crear renders.

**PASS técnico5/5 y licencia documental. Previews privados revisables; no master/publicación ni aprobación auditiva.**

| Pieza | LUFS mezcla | True peak dBFS | Cama bajo voz (LU) | Correlación voz estimada |
|---|---:|---:|---:|---:|
| N06 | -13.2 | -1.4 | 19.5 | 0.999790 |
| N07 | -13.0 | -1.1 | 19.2 | 0.999872 |
| DD-A | -13.0 | -1.4 | 19.3 | 0.999833 |
| N02-Work | -13.2 | -1.3 | 19.0 | 0.999834 |
| S2-D07-A | -14.1 | -1.4 | 18.2 | 0.999800 |

## Prueba propia de preservación

Cinco archivos mezclados decodifican por completo con ffmpeg `-v error -xerror -map0 -f null`: exit0/stderr vacío. ffprobe y hashes SHA256 de payloads de video comparados contra cada fuente:5/5exactos. Se cotejaron todos los paquetes de video (PTS,DTS,duración,tamaño,flags), número de cuadros y duración de contenedor:5/5exactos. Copies SIN-MUSICA idénticas byte por byte a fuentes; fuentes y mezclas coinciden con hashes del manifiesto.

N02-Work es la versión109,033333s revisable; S2 usa el borradorClaude original. Como el video se copia sin cambios, tarjetas, variables y marcadorDD-A se conservan. No nuevos cortes, velocidad, subtítulos, cara/voz generada o overlay. No se declara revisión fonética del marcador.

Se midieron LUFS/truepeak propios de voz, mezcla y stem de música. Cama ducked18,2–19,5LU por debajo del nivel integrado de voz, con mezcla-13,0 a-14,1LUFS y truepeak-1,4 a-1,1dBFS. La diferencia de LUFS entre pistas completas es aproximación de balance global, no garantía de inteligibilidad en cada instante.

Comprobación numérica adicional: PCMmono16kHz de fuente/mezcla/stem y ajuste de mínimos cuadrados mezcla≈voz*g0+cama*g1; sustraer cama estimada da correlación0,999790–0,999872 con voz fuente. Tres ventanas de1s por pieza, búsqueda ±32muestras (±2ms), mejor lag0en15/15ventanas. AAC, mezcla y limitador alteran muestras/dinámica: no igualdad exactaPCM de voz ni prueba de ausencia de cambio en cada palabra. Código/probes/métricas/logs en `music-independent.json` y `verify-music.py`.

## Licencia verificada de fuente

Pista `House In a Forest Loop`, HorrorPen2012, CC BY3.0Unported. GET independiente con permiso oficial de red de READMEGodot commitb761b4cd y legalcodeCreativeCommons commit7f525334: HTTP200, blobsbd461bd... y1a16e055... exactos. ActivoOGGlocal1.430.743bytes SHA25632680f2b... yblob ece3640... coincide. No se trata de autorización heredada de catálogoInstagram/TikTok.

Legalcode define sync con video como adaptación y concede creación/distribución/interpretación en todos los medios sin restricciónNC, sujeto a atribución/notices y condiciones. Cinco archivos de crédito y comentarios en metadata coinciden con autor,título,año,origen,URIlicencia y cambios(loop/trim/fades/volumen/ducking/mezcla). Para publicación futura deben mantenerse los créditos en un medio adecuado; este QA no autoriza publicación. No implica endorsement.

Los dos archivos de documentación del autor tienen solo unLFfinal adicional respecto al documento primario; contenido igual. Copias primarias exactas guardadas en qa/ sin modificarlicencias/. Prueba `license-independent.json`.

## Escucha y aprobación

**No escuché las cinco mezclas.** Harness no acepta audioinput; noASR/servicioexterno/instalación/gasto. Nivel bajo y correlación son evidencia técnica, no percepción de volumen, gusto, voz inteligible, música/SFX apropiados o syncfonético. SergioUrcullo puede audicionar las cinco versionesCON-MUSICA junto con susSIN-MUSICA. Esta limitación no impide entregar previewsprivados.

DD-A sigue con Astra/Solpendiente; el gate de contenido es independiente del gate técnico de mezcla. No archivarfuentes, master/publicación por inferencia.
