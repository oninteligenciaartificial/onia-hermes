# Handoff — Marca Personal cloud — cierre acotado 11-oct-2026
Estado: lote cerrado para relevo. N02 queda revisable, NO master. DD-A sin resolver. Análisis de referentes/comunidad/workshop COMPLETO y revisado por instrucción posterior de Sergio; propuesta comercial NO aprobada. Su versión canónica final se identifica en el cierre añadido al final.
No se borró, archivó ni migró ninguna sesión/archivo. No se activaron cadenas o loops nuevos. Codex Cloud nativo se verifica por separado; su migración/disponibilidad NO están confirmadas aquí.

## 1. Autoridad y carril
Sergio Urcullo: madres asignan/supervisan/revisan/resumen; workers ejecutan el oficio. Marca ejecuta edición/investigación/registro. No pedir a la madre que implemente por una dependencia de PC.
Publicar sólo pieza+versión+cuenta+copy/calendario ya aprobados y comprobados, verificando que no exista publicación previa; LISTA PARA MOSTRAR no aprueba nada. Nuevas versiones/piezas y gasto requieren OK. En este lote NO se publicó ni se verificó una aprobación para publicar N02/DD-A.
Sin gastos, nuevas generaciones, instalaciones, nuevas voces/caras/música, pauta ni acceso PC/VPS. La continuidad debe ser cloud, no laptop como solución permanente.
Modelo Work no observable. Los dos subagentes se solicitaron con gpt-6-astra/medium mediante herramienta real; sus metadatos NO prueban el modelo efectivo del runtime. Programación futura: Astra medio, o elevar contrato si no se puede configurar. No hay tarea de programación iniciada en este cierre.

## 2. Entorno y capacidades comprobadas
Workspace: /workspace/scratch/786b6dabb916, Linux, host observado a74001b36ed4.
FFmpeg/ffprobe 6.1.1-3ubuntu5; Python 3.12.14; Node 24.19.0. PIL/numpy/scipy presentes; cv2, whisper/faster_whisper/torch/vosk y modelos Whisper no encontrados en los controles del lote.
Persistencia ENTRE TURNOS verificada con cloud-media-ready.md (nonce ONIA-CLOUD-MEDIA-20261011-P2, SHA256 e1de285b422ed9661fa86eb2d995b6d6be1336383f45b162d378c8e8c9ec820f). No garantía tras reinicio/reciclado.
Conector GitHub lectura efectiva; Drive metadata y descarga autenticada efectivas. Los enlaces de descarga GitHub caducan: uno viejo dio 404; una nueva lectura autenticada del directorio permitió recuperar MP4 y comprobar Git blob SHA. No repetir métodos fetch_blob UTF-8 para binarios.
Higgsfield balance pasó en un turno previo: plan Pro, 438,17 créditos entonces; NO es saldo actual verificado, no repetir para este relevo ni asumir permisos de todas las herramientas. No generación.
La emisión del audio original DD-A respondió “audio content omitted because you do not support audio input”; se preservó el WAV, no hubo escucha efectiva. No usar servicios externos o nuevas instalaciones sin alcance autorizado.
Una salida anterior del conector mostró URL temporal; no se copió a Git/estos documentos y no se reproduce aquí.

## 3. Resultado N02 — versión cerrada para revisión
[Preview compatible](sandbox:/workspace/scratch/786b6dabb916/media-adjustment/N02-preview-revisable.mp4)
[Paquete de proyecto/evidencia existente](sandbox:/workspace/scratch/786b6dabb916/N02-ajuste-privado-evidencia.zip)
[Comparación del empalme](sandbox:/workspace/scratch/786b6dabb916/media-adjustment/N02-empalme-comparado.jpg)
[Informe inicial del ajuste](sandbox:/workspace/scratch/786b6dabb916/media-adjustment/RESULTADO-N02-DD-A.md)

Fuente: repo oninteligenciaartificial/onia-hermes, rama claude/gifted-clarke-y4vvtj; N02 commit histórico 90e00270. Cutplan leído en ese commit coincide con rama, Git SHA 57c29f61c01d13598ae0f296f12b50982b4bc173.
Carpeta Git: videos/marca-personal/2026-10-11/n02-sonnet-45/borrador/.
Original recuperado: /workspace/scratch/786b6dabb916/media-review-n06/N02-borrador-original-Claude.mp4, Git blob SHA 920045de1acb6d682167eeb7bb14f74c6661dba4.
Se retiró sólo B11 (arranque en falso documentado), keep 51/52: bruto 142,15–142,89 y 142,99–144,52; salida canónica 102,89–105,16 (2,27 s efectivos, no 2,4 exactos).
Preview a 30 fps elimina cuadros [3087,3155), salida [102,900000,105,166667); 68 cuadros =2,266667 s. No se sustituyó el montaje por el bruto ni por un corte sin gráficos.
Propuestas: cutplan 55→53 keep; storyboard quita únicamente sin-palabras; 19 palabras del CTA desplazadas −2,27 s sin alterar texto.

QA sin pérdida: 3271 cuadros retenidos idénticos píxel por píxel al original tras quitar esos 68; decodificación completa exit0; cero silencios >=0,3 s; cero negros >=0,1 s; −13,2 LUFS, LRA1,8, TP−0,4dBFS; correlación audio 0,99989–0,99999 con desfase 0 muestras en cuatro ventanas.
IMPORTANTE: esa identidad de píxeles se probó sobre N02-preview-sin-arranque-falso.mp4, NO sobre la copia compatible H264 High. Ésta recodifica el video para reproducción y conserva exactamente los paquetes AAC del preview QA.
Compatible: H264 High/yuv420p, 360x640,30fps,3271 cuadros,109,033333s. SHA256 0d0031e88aa8c9b24b50f53a9e4581e7171bdc02b3781e064b4611fb4be4f6e5.
Audio compatible inicio0/duración109,008s; diferencia final con video ≈25ms, parecida a los26ms originales.
“otra.” termina en102,750; “La” original empieza105,278. Fuente propuesta coloca “La” en103,008; preview real103,011333, diferencia3,333ms por redondeo al cuadro.
Se conserva una breve cara completa heredada del CTA: visible102,900; tarjeta visible103,067. NO afirmar empalme invisible ni revisión fonética/labial completa.
No se probó render1080 desde propuestas: cv2/motor/assets completos pendientes. No se aprobó master.

## 4. DD-A — evidencia y bloqueo exacto
[Audio original 01:01–01:09](sandbox:/workspace/scratch/786b6dabb916/media-adjustment/DD-A-original-61-69.wav)
[Marcador/subtítulo original](sandbox:/workspace/scratch/786b6dabb916/media-adjustment/DD-A-marcador-original.png)
Bruto: /workspace/scratch/786b6dabb916/media-adjustment/DD-A-bruto-original.mp4, 92.453.888bytes, SHA256 8220af93f24be363a90c9fcc0fad4c1a77e4f9fb4556abe4cefaaace2f302593.
Drive: F9630B16-57F2-465E-9289-0D0DDBE787A2.mp4; id1rHY7WjqjRaEnfIqgdDMOXXfMhF2oZ3Ae.
Fuente Git: dd-a-openai-sol/, rama gifted-clarke, README también comprobado en5dfefc8f, SHA5f044ede73808a966b27e3ff989e6d0f5c306a8f.
La palabra disputada está en bruto64,8–65,2s, salida≈49,90s. Transcripción previa y subtítulo dicen astra; tarjeta compara Sol y lleva [CONFIRMAR 01:01–01:09]. Eso NO prueba fonéticamente qué se dijo.
Audio extraído intacto a PCM mono16kHz. Root y Editor no encontraron capacidad auditiva local utilizable. NO se resolvió Astra/Sol, NO se alteró marcador ni cifras.

## 5. Agentes REALES — creados, ACK y resultados
Herramientas: collaboration.spawn_agent; estado verificado primero running y después completed mediante collaboration.list_agents; ACK recibidos por collaboration.send_message del agente a root.
Máximo2 simultáneos; no nuevos agentes al relevo.
| ID real devuelto | Rol/contrato | Estado observado | Resultado |
|---|---|---|---|
| /root/editor_marca | solo lectura; revisar propuestas N02 y capacidad auditiva DD-A; máx5min | ACK + completed | los cambios de cutplan/storyboard/segments son coherentes; compatible confirmado; DD-A bloqueado; detectó nota B11 desactualizada y distinción de versiones QA |
| /root/qa_marca | QA puntual de preview existente, empalme/PTS/subtítulos; máx5min | ACK + completed | PTS continuos; texto “otra”→“La” conservado; transición breve cara completa heredada; diferencia audio/video no nueva; sin escucha efectiva |
Ninguno regeneró el preview, creó informe duplicado, instaló, publicó o modificó archivos. Configuración solicitada Astra medium, runtime no observable.

## 6. Contratos pendientes / cambios NO guardados en Git
- N02: revisión humana del empalme a velocidad real; palabras pendientes; vigencia de “quedan46 días” según fecha real de publicación; alineación de subtítulos y master1080 sólo después de validar motor/assets.
- Corrección documental mínima NO aplicada: nota del N02-storyboard-propuesta.json aún dice B11 “va sin texto”; debe indicar bloque eliminado. No repetir el render por ese texto.
- RESULTADO/script/N02-QA documentan la versión sin pérdida. No atribuir al compatible identidad píxel exacta; este handoff hace esa distinción y registra la comprobación del compatible.
- DD-A: escucha/transcripción efectiva de tramo64,8–65,2, sin sustituir nombre por inferencia aritmética o subtítulo.
- Referentes/comunidad/workshop: borradores completos abajo y archivos separados en workspace; pendientes de revisión, registro canónico y decisiones. No reiniciar su investigación ni afirmar inspección propia de videos locales.
- No hay rama nueva, commit ni PR de este análisis. Antes de la orden de relevo sólo se leyó GitHub; NO se intentó escritura, así que no existe un bloqueo de permisos de escritura probado. Base observada de claude/pagos-checkout-strategy-b40756: ea67ca1f92633c93fece4eeb114f42b6a9474122, tree0e024a173c280625cf36c31f425b2c55b88234c3. No llamarlo HEAD actual sin relectura.
- Pendiente canónico propuesto: ficha en hermes-content/references/video-intake/2026-10-11-mrsatiras-referentes-comunidad.md; propuesta en hermes-content/docs/comunidad/PROPUESTA_WORKSHOP_PREPAGO_20261011.md; referencia desde ONIA_COMUNIDAD_CONTENIDO.md y aprendizaje breve en skill existente. NO se modificaron skills ni canons; no se creó community-marketing.
- Ningún nuevo cobro, anuncio, encuesta enviada, publicación, presupuesto, fecha o membresía. Publicación permitida sólo si se comprueba registro exacto aprobado; no hay cadena de publicación activa aquí.
- Codex Cloud nativo y scheduler se verifican aparte. No afirmar disponibilidad/migración/loop y no crear duplicados.

## 7. Preservación observada antes de guardar este handoff
Los ZIP siguientes YA EXISTÍAN; no se creó ni archivó otro en este cierre.
| Archivo | SHA256 medido | Retención confirmada previamente |
|---|---|---|
| Borradores-originales-Claude.zip | 2fcebeb2d097bcd3f3ab721bd7daadf39ba8800a7face6e2941adefa60859473 | libfile_41591966b3b4819189efdd3b30fea716 |
| N02-ajuste-privado-evidencia.zip | e29c4b151b602de862a470c13abf1771c9489f8755791150117bc3f48b920fb6 | libfile_09942e4bb5c48191aaad281ec29e2dee |
| media-adjustment/N02-preview-revisable.mp4 | 0d0031e88aa8c9b24b50f53a9e4581e7171bdc02b3781e064b4611fb4be4f6e5 | libfile_e3173a274284819195bf9968d82b780a |
| PROPUESTA_WORKSHOP_PREPAGO_20261011.md | e93bcb5c1a29f1663a82f07426d1344d10173995181ee4c172ec7540c879ceb9 | workspace; contenido íntegro incorporado a este handoff |
| REFERENTES_MRSATIRAS_20261011.md | 9bed9e089167b99fcb332d65b1f3f3c2fbd2ff02aed2bbe33274df06961935a7 | workspace; contenido íntegro incorporado a este handoff |
| media-adjustment/N02-QA.json | a2ab0bce60ba6372eea838d91c21596d67ed1052713db2fb75d837b024b3f26d | paquete N02 existente |
| media-adjustment/N02-empalme-comparado.jpg | a28d91755f73f7d85e06c469669b650b84e9e7ca2c92f6adcdb81270ab649a2e | paquete N02 existente |
| media-adjustment/DD-A-original-61-69.wav | ebf5c5f9ab2f04fe8aa5520057ab08453f7c65162682ce46f02a0e866fd45aa5 | paquete N02 existente |

No afirmar retención permanente de los brutos locales: el bruto DD-A puede recuperarse mediante el conector Drive y está identificado por hash; no se duplica al guardar handoff.
[Cuatro montajes originales](sandbox:/workspace/scratch/786b6dabb916/Borradores-originales-Claude.zip)
[Borrador completo de propuesta](sandbox:/workspace/scratch/786b6dabb916/PROPUESTA_WORKSHOP_PREPAGO_20261011.md)
[Ficha completa recibida/analizada](sandbox:/workspace/scratch/786b6dabb916/REFERENTES_MRSATIRAS_20261011.md)

## 8. Próximo paso transferible, sin arrancarlo
Retomar desde este handoff y los assets conservados; verificar primero acceso cloud. Revisar la propuesta y resolver el estado de pilotos/preflight, NO anunciar/cobrar. Registrar en rama revisable sólo después de contrastar versiones actuales, sin main. No pedir material local salvo que cambie una decisión concreta: se detalla exactamente cuál en la ficha siguiente.

---

# ANEXO A — Borrador histórico de referentes, superado por el cierre canónico al final
# Referentes compartidos por mrsatiras — lectura heredada y aprendizajes para briefs
Fecha de corte: 11-oct-2026, hora La Paz (UTC-4). Carril ejecutor: Marca personal cloud; madre supervisa/revisa.
Estado: análisis incorporado en una propuesta; ningún nuevo video/carrusel producido ni aplicación visual validada.
mrsatiras es el contacto que comparte enlaces, NO el autor de las piezas.

## Cobertura y procedencia
Esta sesión NO volvió a descargar ni analizar los videos de referencia: conserva evidencia transmitida por Sergio/madre, con los límites originales. Los archivos locales de abajo NO son accesibles desde este cloud.
| Fuente y autor informado | Evidencia transmitida | Cobertura propia cloud de este lote | Qué no se sabe |
|---|---|---|---|
| WhatsApp Video2026-10-11 at12.46.34PM.mp4; @IAdeGuardia | 46,28 s, 576x1024/30 fps; Gemini nativo dos pasadas, 12 cuadros distribuidos y 12 de gancho; carpeta C:/Users/PC/Documents/Codex/scratch/reference-20261011/ | análisis leído; MP4 NO recibido | URLs originales, métricas, licencia; no inferir sonido/transiciones no descritos |
| Andrea @andreaestratega; https://www.instagram.com/p/DeP64W6JynO/ | 34,95 s; descarga pública sin cookies, Gemini completo; 12 cuadros +6 de gancho; ig-references-20261011/ local | análisis transmitido; no inspección nueva de video | demanda, ventas, flujo de entrega por DM, ManyChat |
| Adrien @adrien.ninet; https://www.instagram.com/p/DeWaJ8PgQK8/ | 19,53 s; Gemini completo, 7 cuadros +6 de gancho; MP4 local | análisis transmitido; no inspección nueva | funcionamiento del repo, tiempo prometido de 5 min, licencia de reutilización |
| Enrique @soyenriquerocha; https://www.instagram.com/p/DeTY4y4mwCk/ | caption + las seis láminas leídas en Chrome por madre | lectura de evidencia, no nuevas capturas | elegibilidad/créditos Claude no validados; es estudio visual |
| Erik: https://www.instagram.com/stories/eriktaveras/4005709473972822446?reel_id=10801565739&reel_owner_id=10801565739 | muestra visual: rótulo workshop 10-oct y video testimonial; audio incompleto | evidencia transmitida | narrativa del testimonio, resultados, precio; no unir fecha 10-oct con oferta 17-oct |
| https://workshops.eriktaveras.com/w/sistema-de-edicion-17-oct/ | madre leyó página completa: agotado; 17-oct 10–12 UTC-4; 2 h Zoom; 25 personas, 2 instructores, instalación previa, skills, videos propios máx30 s, cuentas de pago/requisitos; sin precio visible | web fetch dio Internal Error; NO se revalidó estado ni oferta | precio oculto, ventas reales, reembolsos, asistencia/completitud |
| https://www.skool.com/automatizate/about | madre observó 104 miembros y US$59/mes | texto público recuperado por búsqueda/web fetch: 113 miembros, US$59/mes; captura marcada cached/crawled 3 días; NO lectura live de membresía | pagos netos, miembros activos, cancelaciones y rentabilidad |
| https://link.eriktaveras.com/erik | enlace oficial observado por madre | texto recuperado (cache 4 días): conecta Skool y taller; horario 8 PM RD | no determina cuál horario es correcto |

Los .info.json con CDN temporales NO se guardan en Git. No se accede a la PC, a un VPS ni a sesiones de las madres.
Referencias de recuperación web: turn0view0 (Skool), turn0view2 (linkbio), turn0view1 (bloqueo workshop). Las URLs públicas anteriores permiten revisar sin depender de estos IDs de conversación.

## Qué enseñan las piezas y cómo pasarlo a un brief
### IAdeGuardia
Timeline transmitida: resultado HTML→video 0–7 s; GitHub/Hyperframes 7–14; instalar/pedir/render 15–28; guion exacto/datos reales/referencia 29–38; comandos/guardar 39–43; cierre 43–46.
Mensaje/mecanismo: vuelve visible un resultado antes de explicar la herramienta. No contiene comunidad ni precio.
Aplicación: abrir con nuestro preview real; después mostrar entrada, proceso mínimo y cómo reproducir. Separar herramientas disponibles de instalaciones necesarias. No prometer que el pipeline corre en toda máquina.
No copiar: avatar inferior, identidad, negro/lima/morado exactos, guion ni recursos. No convertir la demostración ajena en prueba nuestra.

### Andrea — juicio de una idea
Tribunal 3D con 12 Claudes: acusación→defensa→votos/roles→veredicto→CTA JUICIO.
La metáfora permite enseñar objeciones y contrastar hipótesis. El voto de modelos es una simulación de crítica, NO validación de demanda. No hay evidencia de ManyChat ni de ingresos.
Aplicación económica: un video con una objeción real, evidencia y alternativa. Para ONIA sirve analizar una oferta o automatización con hechos; no hace falta producir tribunal 3D ni 12 agentes.
Brief: problema real→dos criterios enfrentados→dato verificable→decisión provisional→una prueba con personas. CTA a una matriz de decisión existente, no promesa automática por comentario.

### Adrien — resultado y recurso
Resultado Dynamic Island→repo rit3zh/expo-dynamic-notifications→instrucción al agente→resultado→CTA ISLAND.
Visual transmitido: sans fuerte con serif cursiva, blanco/negro, capturas y creador.
Aplicación: explicar un recurso probado con resultado visible y un paso reproducible. Antes de prometer “5 minutos”, medirlo en una máquina limpia y comprobar prerequisitos/licencia. No se probó ese repositorio en este lote.
No copiar: resultado/pantallas como si fueran ONIA, su identidad o CTA literal.

### Enrique — carrusel de seis láminas
Secuencia transmitida: beneficio→aplicación→elegibilidad→tres pasos→límites→CTA de caso/guía.
Visual: foto a sangre, sujeto dominante, título sans blanco y remate serif cursiva amarilla; jerarquía y márgenes consistentes aunque cambia la escena, alternando persona/avatar cúbico.
Tomar: una sola promesa por portada, progresión que responde dudas y límites antes del CTA.
Adaptación: material real propio con permisos, tratamiento B/N de marca cuando proceda, verde ONIA y captura legible. No copiar avatar, fondo o claim de créditos Claude. Mantener Bricolage/DM Sans/Instrument Serif y pack existentes donde corresponda; no introducir un sistema de marca paralelo. Márgenes estables no obligan a añadir headers/footers decorativos.
Brief candidato NO producido:
1. resultado tangible propio; 2. qué problema resuelve; 3. quién tiene requisitos; 4. tres pasos reales; 5. límites/costos; 6. una acción hacia recurso ya existente.
Si el recurso o su ruta no se probaron, dejar CTA pendiente; no fingir que comentarios disparan DM.

### Erik — oferta empaquetada
La ficha pública recuperada presenta llamada semanal, grabaciones y plantillas a US$59/mes, con 113 miembros en el snapshot. Linkbio dice 8 PM RD y Skool 7 PM RD: contradicción sin resolver. Los “30 fundadores” y garantía de 14 días son claims del autor, no ventas ni resultados auditados.
La oferta de taller transmitida concentra un resultado, preparación previa y requisitos; el “agotado” no demuestra cuántos pagaron ni una tasa de conversión. No se conoce su precio.
Aplicación: llevarse la delimitación operativa y la preparación previa, no su precio, horarios o promesas. Un taller piloto antes de membresía tiene menor obligación recurrente.

## Cobertura de dimensiones (sin inventar mediciones)
| Dimensión | Evidencia utilizable | Límite |
|---|---|---|
| Mensaje | descripciones/timelines transmitidas | no verbatim/audio propio |
| Tema y público | tutorial, crítica de ideas, recurso, elegibilidad | no rendimiento causal |
| Gancho | resultado inicial en IAdeGuardia/Adrien; conflicto Andrea | detalle cuadro a cuadro heredado, no inspección propia |
| Guion | progresión descrita | no copiar frases |
| Layout/diseño | sistemas descritos y seis láminas Enrique | no muestras propias de las referencias |
| Tipografía/color | sans/serif, paletas transmitidas | familias exactas no verificadas |
| Prueba | repo, captura y salida visible | funcionamiento/claims no comprobados aquí |
| Ritmo/cortes | rangos de timeline IAdeGuardia | cortes/10s, eases/velocidades no medidos |
| Subtítulos/textos | jerarquía y algunos CTA transmitidos | audio vs subtítulo no verificado |
| Sonido/música | no evidencia suficiente de este lote | no atribuir tema, licencia ni efectos |
| Oferta/comunidad | páginas oficiales + análisis transmitido | precios workshop y ventas desconocidos |
| CTA/resultados | JUICIO/ISLAND y entrega de guía | no prueba de DM, ventas o conversión |

## Ranking de uso
1. Primero: resultado propio visible→instrucción→prueba; jerarquía estable; límites y requisitos.
2. Probar después: crítica de objeciones sin 3D; carrusel de un resultado con seis pasos visuales.
3. Descartar para este lote: avatar ajeno, tribunal caro, promesa de 5 min sin medición, noticias sin aplicación, membresía basada en tutoriales.
4. Investigar sólo si cambia una decisión: reproducción del repo Adrien, audio de historia Erik, licencias/requisitos de materiales.

## Uso en esta tarea
Aplicado a la PROPUESTA de workshop y a los briefs escritos del documento de comunidad. Producción audiovisual/validación de diseño: PENDIENTE, no “aplicada” a una pieza nueva.
Para una futura comparación de motion/audio harían falta exactamente: MP4 limpio y análisis/timeline de IAdeGuardia, Andrea y Adrien; seis imágenes y caption del carrusel; historia completa con audio. Hoy NO son necesarios para revisar la propuesta comercial.
No pedir “todos los archivos” ni reabrir el intake de principio a fin.


---
# ANEXO B — Borrador histórico de propuesta, superado por el cierre canónico al final
# Propuesta revisable — WhatsApp + workshop piloto prepago
Fecha: 11-oct-2026, hora La Paz (UTC-4). Carril Marca personal cloud ejecuta; madre sólo supervisa/revisa.
Estado: PROPUESTA; sin precio, fecha, cupos comerciales, cobro o lanzamiento aprobados. No se cambió el nombre Onia Community.

## Decisión recomendada
Mantener WhatsApp existente y el ritmo lun/mié/vie. Usar recurso→práctica→revisión; probar un workshop acotado antes de una membresía.
El prepago puede validar disposición a pagar, pero sólo después de tener un resultado demostrable, material mínimo, preflight y condiciones completas. No financiar con participantes la búsqueda de un método que todavía no funciona.

El canon ONIA_COMUNIDAD_CONTENIDO.md, actualizado 30-sep, manda sobre las referencias históricas: audiencia de jóvenes/aficionados que construyen o aprenden a vender soluciones, WhatsApp primero, avisos lun/mié/vie 19:00. Las cifras ~30 miembros, 427 seguidores o vistas antiguas NO son el estado actual.
La guía de comunidad conserva la secuencia de medir pilotos presenciales antes del primer producto pago. No se verificó aquí si ocurrieron esos pilotos. Esta propuesta NO la anula: la madre/Sergio deben comprobar esa condición o decidir explícitamente una excepción para un piloto online.

## Fuentes y confianza
Análisis de referentes: ../../references/video-intake/2026-10-11-mrsatiras-referentes-comunidad.md.
mrsatiras compartió los materiales; autores: IAdeGuardia, Andrea, Adrien, Enrique y Erik. Los MP4 locales NO se vieron desde cloud; sus análisis se recibieron como evidencia transmitida.
En cloud se releyeron los tres documentos canónicos y las skills existentes; community-marketing no apareció en hermes-content/skills ni en el listado de .claude/skills, así que NO se creó un duplicado.
Oficiales consultadas: https://www.skool.com/automatizate/about y https://link.eriktaveras.com/erik. Snapshot recuperado: 113 miembros/US$59 al mes, cache 3 días; no es auditoría de miembros pagados activos ni base para fijar nuestro precio. Horarios 7 y 8 PM RD contradictorios. Workshop: información transmitida, no revalidada por fallo de web fetch; precio desconocido.
CLAUDE.md SHA 4831be091b3e936c5dd08d11b23279935d2f5ba8; handoff madre-marketing SHA 526c92ae559b16875dd671e01e8bb2f035057042; canon contenido SHA 31e8efb7508199d8dcc9d26efbf7ec96e3de9ebf; ESTADO_COMUNIDAD SHA 96a6d8785ce47352803e1fb1d6390c1ce4a99169; valor comunidad SHA 986b7fdbc1f13ec65843804333b8aa4919bc7772.
Los textos diarios, rituales dominicales y “wins” del material antiguo no sustituyen la corrección vigente del 30-sep.

## Comunidad: valor y operación sostenibles
La guía pública explica el método; WhatsApp ayuda a aplicar al caso propio. No esconder videos públicos para fabricar exclusividad.
| Día vigente | Entrega propuesta, no publicación | Prueba que pedimos | Tiempo interno sugerido |
|---|---|---|---|
| Lunes | aviso breve + recurso completo del tema del video | elegir un resultado y comprobar requisitos | 30–45 min preparando material reusable |
| Miércoles | práctica pequeña sobre el recurso | captura/archivo propio y un bloqueo concreto en General | revisión agrupada, máximo 30 min |
| Viernes | revisión de dos o tres casos anonimizados con permiso + corrección del recurso | qué cambió después de aplicar | máximo 45 min |
No añadir otra obligación diaria, audio dominical ni sesiones semanales nuevas sin validar tiempo. Presupuesto operativo sugerido: 2 h/semana; es propuesta, no compromiso público ni medición histórica.

Recursos a conservar en rutas canónicas/bóveda existente: entrada, ejemplo real, instrucciones, limitaciones, errores y reproducción. No crear otra plataforma para este piloto.
CTA por defecto: “Buscá PALABRA en Avisos” únicamente cuando el recurso y la ruta funcionan. Comentarios/likes no equivalen a ejecución, ingresos ni compra.

## Workshop candidato: una sola salida
Nombre de trabajo: “De tu clip a un preview revisable con IA”. No anuncio ni nombre aprobado.
- Audiencia: jóvenes y aficionados que ya construyen con IA, tienen laptop y quieren reproducir un flujo de edición, no una academia de edición completa ni negocios esperando una campaña terminada.
- Un resultado: un preview privado de 15–30 s con corte revisado, subtítulos corregidos y una tarjeta/captura propia sincronizada, junto al proyecto para rehacerlo.
- Prueba de entrega: se reproduce el MP4, no hay palabras inventadas, voz y subtítulos coinciden en tres puntos muestreados, tarjeta legible en móvil y segundo render desde el proyecto sin rehacer manualmente.
- Grupo piloto sugerido: máximo 8, con preparación aprobada; no copiar los 25 de Erik. Instructor: Sergio Urcullo sólo si confirma agenda/capacidad; apoyo técnico opcional, no se asume Arthur ni otro colaborador.
- Formato sugerido: online 120 minutos; fecha, hora, plataforma y precio P pendientes. Usar plataforma ya disponible cuando se compruebe; ninguna nueva suscripción asumida.
- No incluir: video largo, cuatro estilos, carruseles como segundo resultado, agentes multiempresa, generación de cara/voz, producción comercial, publicación en redes, instalaciones imprevistas en vivo ni soporte ilimitado.

### Preparación obligatoria antes de cobrar
1. Ejecutar una demo real de 15–30 s de punta a punta y repetirla desde su proyecto con el stack que se enseñará. Los MP4 recuperados prueban que existe montaje; NO prueban que el pipeline se reproduce hoy en todo cloud o PC.
2. Listar sistema operativo/hardware mínimo comprobado, versiones, cuentas y costo real de herramientas C_tool. No vender “gratis” si el alumno necesita un plan pago.
3. Comprobar esta demo en 2–3 máquinas voluntarias de los sistemas admitidos (propuesta futura; no contactadas), sin inventar que ya se hizo. Si sólo funciona en Windows, publicitar sólo ese alcance; no prometer multiplataforma.
4. Paquete mínimo preparado: receta canónica, proyecto ejemplo propio, capturas con permiso, tabla de cortes, guion corto y subtítulos verificados. No copiar assets/paletas/personajes de los referentes.
5. Preflight de alumno antes de reserva: clip propio horizontal/vertical admitido según receta, 15–30 s, audio inteligible, texto de lo dicho, permisos de uso, laptop/cuentas listas y export de prueba.
6. Demostrar cómo resolver errores frecuentes y definir una alternativa de material propio previamente preparada. No sustituir silenciosamente el resultado prometido.
Bloqueo real observado en este cloud: FFmpeg/Python/Node están, pero faltan cv2 y herramientas/modelos de transcripción; audio de entrada no admitido. Aquí NO se instaló nada ni se llamó una API. La oferta no se abre mientras el stack instructor/alumno siga sin prueba.
El ajuste N02 conservó el montaje ya renderizado; eso tampoco valida que el motor completo esté listo para una clase.

### Agenda de 120 minutos (propuesta)
| Minutos | Actividad | Evidencia |
|---:|---|---|
| 0–10 | ver resultado, límites y archivos preparados | objetivo de una sola pieza |
| 10–25 | revisar el corte y texto de cada clip | propuesta de cortes, no eliminación ciega |
| 25–60 | aplicar receta existente + subtítulos revisados | proyecto reproduce el montaje |
| 60–85 | una tarjeta o captura real sincronizada | dato y tiempo reales |
| 85–105 | render, decodificación y controles | MP4 revisable |
| 105–120 | revisión de errores y rehacer | segundo render y siguiente paso |
La instalación ocurre antes, no consume la clase. Si la prueba interna no cabe en ese tiempo, se recorta alcance o se cambia duración ANTES de ofrecerla.

## Soporte y condiciones de prepago — borrador, no texto legal aprobado
- Soporte sugerido: una ventana de siete días, una consulta estructurada por alumno y una revisión agrupada. Sin soporte 24/7 ni sesiones privadas implícitas. Presupuesto máximo de h_post debe entrar en el costo.
- Entrega sugerida: archivos/receta y grabación de pantalla del instructor si plataforma y derechos lo permiten; no grabar ni compartir caras/casos de participantes por defecto. No prometer acceso perpetuo o una biblioteca que no existe.
- Mostrar antes de pagar: resultado, contenido/exclusiones, requisitos, costo adicional C_tool, precio y moneda, fecha/hora UTC-4, duración, responsable de cobro/soporte, cupo máximo por capacidad y mínimo de realización.
- Prepago propuesto: reserva P sólo tras aprobar materiales y condiciones; cobro separado del SaaS/asesoría. Este documento NO autoriza cobrar.
- Si al cierre no se alcanza el mínimo o cancela el organizador: propuesta de devolución total, incluyendo el costo de comisiones a cargo de ONIA. Canal y plazo concreto de devolución D_ref se definen antes de aceptar pagos.
- Cancelación de participante, cambios de fecha, ausencia, acceso a grabación y elegibilidad: condiciones pendientes de redacción/revisión antes de cobro; no usar la garantía de 14 días de Erik como nuestra.
- No garantizar ventas, ingresos, viralidad o empleo. No inventar “agotado”, fundadores, reloj de urgencia o número de interesados.
- Rechazar reservas de personas que no cumplen preflight aunque suban la caja; no usar su pago para solucionar instalaciones no previstas.

## Umbral de equilibrio con variables (Bs; no precio aprobado)
Definir:
P = precio bruto por plaza; f = comisión proporcional; t = carga proporcional aplicable, a confirmar; q = fracción esperada del ingreso devuelto (reserva prudente, no tasa observada); v = costo variable por plaza.
F = h_prep*w + h_live*w + h_post*w + C_demo + C_plataforma + C_admin + C_devoluciones_fijas.
w = valor del tiempo por hora; C_tool es gasto del participante, se declara aparte salvo que ONIA lo subsidie, en cuyo caso entra en v o F.
Contribución conservadora m = P*(1-f-t-q)-v.
Si m <=0: NO-GO. Si m >0: N_BE = techo(F/m). Para margen objetivo G: N_OBJ = techo((F+G)/m).
Este cálculo es de escenario: t y devolución/comisiones deben sustituirse por costos aplicables; no representa asesoramiento tributario ni retorno garantizado.
Máximo operativo N_MAX propuesto =8. Si N_OBJ>N_MAX, ajustar alcance/costo/precio o cancelar; no aumentar cupos sin capacidad.

Ejemplo exclusivamente ilustrativo: F=600 Bs, P=120 Bs, f=3%, t=0 sólo para el ejemplo, q=5%, v=10 Bs. m=100,40 Bs; N_BE=6. Con 8 plazas: contribución 803,20 Bs; excedente esperado sobre F=203,20 Bs. Si F=1.000 Bs con los otros supuestos iguales, N_BE=10: no cabe en 8, NO-GO. No se propone cobrar 120 Bs como tarifa aprobada.
Caja recibida no equivale a beneficio ni dinero disponible: separar reserva de devoluciones y costos hasta impartir la sesión.

## Validación rápida y barata, sin lanzar
1. Preparar la demo + receta y probar requisitos antes de producir landing o curso.
2. Desde un aviso ya programado, propuesta futura de investigación voluntaria: pedir un clip/caso concreto y disposición a pagar P con requisitos; no sólo “¿te interesa IA?”. No se envió ninguna encuesta en este lote.
3. Registrar por persona: problema, resultado buscado, requisitos, tiempo disponible y rechazo de precio. No almacenar aquí emails/telefonos.
4. Ejecutar 2–3 pruebas de preparación; objetivo propuesto: todas completan export básico y al menos 2 terminan el resultado acotado dentro del tiempo. Son gates por validar, no resultados.
5. Sólo con método/condiciones aprobados, usar reservas pagadas como señal fuerte. Interés verbal o likes son señales débiles, no “ventas”.
6. Realizar sólo si N_aptos_preparados_y_pagados >=N_OBJ (y dentro de N_MAX) al cierre. Si se incumple, devolver según términos.
7. Después medir: participantes elegibles, asistentes, previews completos, segundos renders exitosos, bloqueos, devoluciones, horas reales y margen. Umbral candidato de repetición: >=75% completa resultado, sin problemas críticos abiertos y margen positivo incluyendo soporte. No es una tasa pronosticada.
El estado actual de esos contadores es DESCONOCIDO, no cero por falta de consulta.

## Ocho perspectivas del consejo ONIA
| Perspectiva | Lectura y decisión |
|---|---|
| CEO | viable como piloto de distribución/aprendizaje; distrae si se convierte en academia paralela. Tope de horas y un resultado |
| CTO | viable condicional a demo reproducible y stack probado; no prometer equivalencia PC/cloud ni depender de claves personales |
| Programador senior | reutilizar receta/cutplan/renderer; no crear un motor nuevo ni hacer soporte improvisado de ocho instalaciones |
| Arquitecto | receta versionada + material + QA reutilizable; WhatsApp y almacenamiento existentes, sin nueva plataforma |
| Product Manager | promesa observable y criterio de finalización; distinguir grupo gratuito, práctica guiada y soporte pago |
| Consultor de mercado | la audiencia aficionada no equivale a compradores B2B; obtener evidencia de problema y precio propia |
| Inversionista | margen tras horas/devoluciones; recurrencia no probada. Membresía ahora añade obligación sin demanda demostrada |
| Cliente | conocer requisitos/costos antes de pagar; un resultado propio y soporte delimitado, sin presión ni promesas vagas |

## Viabilidad, pros/contras, riesgo, costo/dificultad y escalabilidad
- Viabilidad: condicional; diseño de piloto revisable, operación/cobro NO listos.
- Pros: valida demanda con poca producción, reutiliza montaje/recursos y convierte aplicación en evidencia.
- Contras: ingreso limitado por cupos y tiempo, preflight técnico reduce elegibles, soporte puede consumir el margen.
- Riesgos: vender antes de probar, mezclar públicos, costos ocultos de software, falta de escucha/QA, dependencia del fundador y contradicción con secuencia presencial.
- Costo/dificultad: análisis/preparación moderados; clase guiada en equipos distintos dificultad media-alta hasta completar pruebas. No hay presupuesto real observado; usar F,m,N_OBJ.
- Escala: archivos y ejemplos escalan; diagnóstico/revisión no. Después de dos pilotos con resultados consistentes, evaluar paquetes asincrónicos; membresía sólo con valor recurrente y soporte sostenible.
- Alternativas: conservar comunidad gratuita y revisar casos; práctica gratuita preparada para validar método; taller sólo de carrusel si el video no pasa preflight (nueva oferta, requiere revisión, no sustitución del resultado vendido); luego curso sobre resultado repetido. No abrir Skool por copiar al referente.

## Próximos pasos priorizados
P0 — verificar estado de pilotos canónicos y capacidad/h_semana; elegir mantener secuencia o proponer excepción explícita.
P1 — demo reproducible + lista de requisitos/costos + material mínimo; resolver bloqueo del motor antes de reservar.
P2 — probar 2–3 equipos/casos y registrar tiempo/errores; adaptar alcance.
P3 — decidir precio P, fecha/hora, plataforma, responsable de cobro, términos D_ref y N_OBJ con costo real.
P4 — revisar oferta; sólo otra autorización permitirá encuesta pública, reservas/cobro y celebración.
P5 — tras piloto, medir resultados y margen; no saltar automáticamente a membresía.

## Briefs accionables, escritos pero NO producidos
Video A (prioridad): mostrar preview propio→el error que frenó→entrada/proyecto→prueba de reproducción→un recurso disponible. Usar montaje propio ya existente; no tribunal ni avatar.
Carrusel B: resultado→caso→requisitos→tres pasos→límites/costos→ruta de recurso comprobado. Foto/captura propia, jerarquía estable, verde ONIA; claims de créditos ajenos fuera.
Aviso C: qué puede hacer el recurso y a quién sirve, más recurso íntegro separado y práctica concreta. Revisión en General dentro del límite propuesto.
No emitir promesa de workshop en estas piezas hasta que exista oferta lista y se apruebe; el CTA hoy no es “pagá”.

## Continuidad media ya cerrada
N02 ajuste privado: 102,900–105,166667 s eliminados del render original (68 cuadros); 109,033333 s final. Todos los cuadros retenidos idénticos en copia sin pérdida; audio correlacionado sin nuevo desfase en ventanas comprobadas. Copia compatible H264 High con audio idéntico a la copia QA. No master ni publicación.
DD-A: bruto 01:01–01:09 recuperado; palabra disputada 01:04,8–01:05,2 no confirmada por falta de entrada auditiva/transcriptor. Se mantienen marcador/subtítulo.
Paquete preservado: N02-ajuste-privado-evidencia.zip. Preview: N02-preview-revisable.mp4. Referencia de continuidad, NO evidencia de que la clase completa esté operativa.




# CIERRE VIGENTE — análisis completado por Marca, propuesta no aprobada
Esta sección supera el estado PENDIENTE de los borradores históricos anteriores por instrucción directa posterior de Sergio. No cambia permisos de cobro/publicación ni el estado de DD-A/N02.
Rama revisable: codex/marca-referentes-workshop-20261011. Commit: 7c43db59aed02bc981375336470bd256ad5606f7.
Base: ea67ca1f92633c93fece4eeb114f42b6a9474122; árbol final 7dd42221ee79f99ba8c1a2a728a12184fe69a64f.
GitHub escritura EFECTIVAMENTE probada: create_branch, create_tree, create_commit, update_ref; fast-forward a rama propia, sin main ni despliegue/publicación.
Lectura de los cuatro archivos por commit confirmó content_matches=true.
| Ruta canónica | Git blob SHA |
|---|---|
| hermes-content/docs/comunidad/PROPUESTA_WORKSHOP_PREPAGO_20261011.md | b9a1c96ba63a3252b272fd6af2b76ba3ffb27f6d |
| hermes-content/references/video-intake/2026-10-11-mrsatiras-referentes-comunidad.md | b980cb95e6f555ee195450d4f0570a95a9ed0e27 |
| hermes-content/docs/ONIA_COMUNIDAD_CONTENIDO.md | 0ca80e19a99b0bea465ff01055b60721766687d5 |
| .claude/skills/diseno-contenido-onia/SKILL.md | a33991d27c706defb2e21649a87d9e8bf55e46b9 |
[Informe canónico](https://github.com/oninteligenciaartificial/onia-hermes/blob/7c43db59aed02bc981375336470bd256ad5606f7/hermes-content/docs/comunidad/PROPUESTA_WORKSHOP_PREPAGO_20261011.md)
[Informe descargable](sandbox:/workspace/scratch/786b6dabb916/PROPUESTA_WORKSHOP_PREPAGO_20261011.md)
[Ficha descargable](sandbox:/workspace/scratch/786b6dabb916/REFERENTES_MRSATIRAS_20261011.md)
Copias locales medidas tras revisión: propuesta19221bytes/SHA256 d877904e5868101383b97737ae2dbf1fe6ce0f000c1e3edd650057f12a7e51b7; ficha11049bytes/SHA256 26f3f735c02f076371436b1eb38aefd1ffc1c0615e91fded2e2afacc769b298a. Los Git blob SHA son de contenido canónico; no intercambiar con SHA256 local.
Se corrigió el encabezado contradictorio 1drop/día del canon a lun/mié/vie según la decisión existente30-sep y se añadió enlace a la propuesta no aprobada. Se agregó un aprendizaje breve a la skill de diseño existente, no otra skill; quick_validate.py oficial pasó “Skill is valid!”.
Agentes reutilizados (NO nuevos chats): collaboration.followup_task a /root/editor_marca (análisis) y /root/qa_marca (QA de informe); ACK observados, resultados completed. QA volvió a revisar sólo cambios; dos observaciones menores corregidas: 6plazas dejan2,40Bs y ranking prioriza carrusel privado.
Editor incorporado: carrusel primero, gate presencial/excepción explícita, resultado vinculado a explicar una solución propia, h_preflight y soporte como costos separados, todos los equipos admitidos terminan export+segundo render antes de ofrecer.
QA: cobertura completa; remitente/autor correctos; observado/inferencia/propuesta diferenciados; 104/113 snapshots y 7/8PM no resueltos por invención; no ventas derivadas de likes/testimonios/agotado. Fórmulas verificadas: m100,40; N_BE6; margen con8=203,20; N_OBJ conG200=8; F1000 exige10>cupo8. Son supuestos, no precio aprobado.
Recomendación final: WhatsApp actual→recurso lunes→práctica miércoles→revisión viernes; workshop candidato online2h, máximo8preparados, una pieza15–30s que explique proyecto propio con subtítulos/captura y proyecto reproducible. Primer contenido privado: carrusel6láminas. No hacer academia ni membresía ahora.
Pendiente comercial mínimo: problema/demanda propia, estado de pilotos/excepción, demo y preflight por sistemas admitidos, capacidad de instructor/soporte, P/fecha/plataforma, N_OBJ/costos reales y términos de reserva/devolución. No cobrar ni anunciar antes.
DD-A permanece bloqueado por escucha/transcripción; N02 preview revisable conserva riesgo del empalme y no es master. Su lote no se volvió a renderizar. Ningún loop nuevo ni migración Codex Cloud confirmada.

# ANEXO C — Informe final revisado (sustituye propuesta del anexo B)
# Propuesta revisable — WhatsApp + workshop piloto prepago
Fecha: 11-oct-2026, hora La Paz (UTC-4). Carril Marca personal cloud ejecuta; madre sólo supervisa/revisa.
Estado: ANÁLISIS COMPLETO Y REVISADO; propuesta comercial NO aprobada. Precio, fecha, cupos comerciales, cobro y lanzamiento pendientes. No se cambió el nombre Onia Community.

## Decisión recomendada
Mantener WhatsApp existente y el ritmo lun/mié/vie. Usar recurso→práctica→revisión; probar un workshop acotado antes de una membresía.
El prepago puede validar disposición a pagar, pero sólo después de tener un resultado demostrable, material mínimo, preflight y condiciones completas. No financiar con participantes la búsqueda de un método que todavía no funciona.

El canon ONIA_COMUNIDAD_CONTENIDO.md, actualizado 30-sep, manda sobre las referencias históricas: audiencia de jóvenes/aficionados que construyen o aprenden a vender soluciones, WhatsApp primero, avisos lun/mié/vie 19:00. Las cifras ~30 miembros, 427 seguidores o vistas antiguas NO son el estado actual.
La guía de comunidad conserva la secuencia de medir pilotos presenciales antes del primer producto pago. No se verificó aquí si ocurrieron esos pilotos. Esta propuesta NO la anula: la madre/Sergio deben comprobar esa condición o decidir explícitamente una excepción para un piloto online.

## Fuentes y confianza
Análisis de referentes: ../../references/video-intake/2026-10-11-mrsatiras-referentes-comunidad.md.
mrsatiras compartió los materiales; autores: IAdeGuardia, Andrea, Adrien, Enrique y Erik. Los MP4 locales NO se vieron desde cloud; sus análisis se recibieron como evidencia transmitida.
En cloud se releyeron los tres documentos canónicos y las skills existentes; community-marketing no apareció en hermes-content/skills ni en el listado de .claude/skills, así que NO se creó un duplicado.
Oficiales consultadas: https://www.skool.com/automatizate/about y https://link.eriktaveras.com/erik. Snapshot recuperado: 113 miembros/US$59 al mes, cache 3 días; no es auditoría de miembros pagados activos ni base para fijar nuestro precio. Horarios 7 y 8 PM RD contradictorios. Workshop: información transmitida, no revalidada por fallo de web fetch; precio desconocido.
CLAUDE.md SHA 4831be091b3e936c5dd08d11b23279935d2f5ba8; handoff madre-marketing SHA 526c92ae559b16875dd671e01e8bb2f035057042; canon contenido SHA 31e8efb7508199d8dcc9d26efbf7ec96e3de9ebf; ESTADO_COMUNIDAD SHA 96a6d8785ce47352803e1fb1d6390c1ce4a99169; valor comunidad SHA 986b7fdbc1f13ec65843804333b8aa4919bc7772.
Los textos diarios, rituales dominicales y “wins” del material antiguo no sustituyen la corrección vigente del 30-sep.

## Comunidad: valor y operación sostenibles
La guía pública explica el método; WhatsApp ayuda a aplicar al caso propio. No esconder videos públicos para fabricar exclusividad.
| Día vigente | Entrega propuesta, no publicación | Prueba que pedimos | Tiempo interno sugerido |
|---|---|---|---|
| Lunes | aviso breve + recurso completo del tema del video | elegir un resultado y comprobar requisitos | 30–45 min preparando material reusable |
| Miércoles | práctica pequeña sobre el recurso | captura/archivo propio y un bloqueo concreto en General | revisión agrupada, máximo 30 min |
| Viernes | revisión de dos o tres casos anonimizados con permiso + corrección del recurso | qué cambió después de aplicar | máximo 45 min |
No añadir otra obligación diaria, audio dominical ni sesiones semanales nuevas sin validar tiempo. Presupuesto operativo sugerido: 2 h/semana; es propuesta, no compromiso público ni medición histórica. El workshop tiene un presupuesto SEPARADO para preparación, preflight, directo, administración y soporte; no se absorben esas horas dentro de las dos horas de comunidad.

Recursos a conservar en rutas canónicas/bóveda existente: entrada, ejemplo real, instrucciones, limitaciones, errores y reproducción. No crear otra plataforma para este piloto.
CTA por defecto: “Buscá PALABRA en Avisos” únicamente cuando el recurso y la ruta funcionan. Comentarios/likes no equivalen a ejecución, ingresos ni compra.

## Workshop candidato: una sola salida
Nombre de trabajo: “Explicá tu solución de IA en un video de 15–30 segundos”. No anuncio ni nombre aprobado. La hipótesis es que ayuda a mostrar lo construido; no se comprobó demanda de un taller de edición en esta audiencia. Validar ese problema antes de fijar la oferta.
- Audiencia: jóvenes y aficionados que ya construyen con IA, tienen laptop y quieren reproducir un flujo de edición, no una academia de edición completa ni negocios esperando una campaña terminada.
- Un resultado: un preview privado de 15–30 s que explica una solución/proyecto propio, con corte revisado, subtítulos corregidos y una tarjeta/captura propia sincronizada, junto al proyecto para rehacerlo. No una promesa de ventas, campañas o captación.
- Prueba de entrega: se reproduce el MP4, no hay palabras inventadas, voz y subtítulos coinciden en tres puntos muestreados, tarjeta legible en móvil y segundo render desde el proyecto sin rehacer manualmente.
- Grupo piloto sugerido: máximo 8, con preparación aprobada; no copiar los 25 de Erik. Instructor: Sergio Urcullo sólo si confirma agenda/capacidad; apoyo técnico opcional, no se asume Arthur ni otro colaborador.
- Formato sugerido: online 120 minutos; fecha, hora, plataforma y precio P pendientes. Usar plataforma ya disponible cuando se compruebe; ninguna nueva suscripción asumida.
- No incluir: video largo, cuatro estilos, carruseles como segundo resultado, agentes multiempresa, generación de cara/voz, producción comercial, publicación en redes, instalaciones imprevistas en vivo ni soporte ilimitado.

### Preparación obligatoria antes de cobrar
1. Ejecutar una demo real de 15–30 s de punta a punta y repetirla desde su proyecto con el stack que se enseñará. Los MP4 recuperados prueban que existe montaje; NO prueban que el pipeline se reproduce hoy en todo cloud o PC.
2. Listar sistema operativo/hardware mínimo comprobado, versiones, cuentas y costo real de herramientas C_tool. No vender “gratis” si el alumno necesita un plan pago.
3. Comprobar esta demo en 2–3 máquinas voluntarias de los sistemas admitidos (propuesta futura; no contactadas), sin inventar que ya se hizo. Si sólo funciona en Windows, publicitar sólo ese alcance; no prometer multiplataforma.
4. Paquete mínimo preparado: receta canónica, proyecto ejemplo propio, capturas con permiso, tabla de cortes, guion corto y subtítulos verificados. No copiar assets/paletas/personajes de los referentes.
5. Preflight de alumno antes de reserva: clip propio horizontal/vertical admitido según receta, 15–30 s, audio inteligible, texto de lo dicho, permisos de uso, laptop/cuentas listas y export de prueba.
6. Demostrar cómo resolver errores frecuentes y definir una alternativa de material propio previamente preparada. No sustituir silenciosamente el resultado prometido.
Bloqueo real observado en este cloud: FFmpeg/Python/Node están, pero faltan cv2 y herramientas/modelos de transcripción; audio de entrada no admitido. Aquí NO se instaló nada ni se llamó una API. La oferta no se abre mientras el stack instructor/alumno siga sin prueba.
El ajuste N02 conservó el montaje ya renderizado; eso tampoco valida que el motor completo esté listo para una clase.

### Agenda de 120 minutos (propuesta)
| Minutos | Actividad | Evidencia |
|---:|---|---|
| 0–10 | ver resultado, límites y archivos preparados | objetivo de una sola pieza |
| 10–25 | revisar el corte y texto de cada clip | propuesta de cortes, no eliminación ciega |
| 25–60 | aplicar receta existente + subtítulos revisados | proyecto reproduce el montaje |
| 60–85 | una tarjeta o captura real sincronizada | dato y tiempo reales |
| 85–105 | render, decodificación y controles | MP4 revisable |
| 105–120 | revisión de errores y rehacer | segundo render y siguiente paso |
La instalación ocurre antes, no consume la clase. Si la prueba interna no cabe en ese tiempo, se recorta alcance o se cambia duración ANTES de ofrecerla.

## Soporte y condiciones de prepago — borrador, no texto legal aprobado
- Soporte sugerido: una ventana de siete días, una consulta estructurada por alumno y una revisión agrupada. Sin soporte 24/7 ni sesiones privadas implícitas. Presupuesto máximo de h_post debe entrar en el costo.
- Entrega sugerida: archivos/receta y grabación de pantalla del instructor si plataforma y derechos lo permiten; no grabar ni compartir caras/casos de participantes por defecto. No prometer acceso perpetuo o una biblioteca que no existe.
- Mostrar antes de pagar: resultado, contenido/exclusiones, requisitos, costo adicional C_tool, precio y moneda, fecha/hora UTC-4, duración, responsable de cobro/soporte, cupo máximo por capacidad y mínimo de realización.
- Prepago propuesto: reserva P sólo tras aprobar materiales y condiciones; cobro separado del SaaS/asesoría. Este documento NO autoriza cobrar.
- Si al cierre no se alcanza el mínimo o cancela el organizador: propuesta de devolución total, incluyendo el costo de comisiones a cargo de ONIA. Canal y plazo concreto de devolución D_ref se definen antes de aceptar pagos.
- Cancelación de participante, cambios de fecha, ausencia, acceso a grabación y elegibilidad: condiciones pendientes de redacción/revisión antes de cobro; no usar la garantía de 14 días de Erik como nuestra.
- No garantizar ventas, ingresos, viralidad o empleo. No inventar “agotado”, fundadores, reloj de urgencia o número de interesados.
- Rechazar reservas de personas que no cumplen preflight aunque suban la caja; no usar su pago para solucionar instalaciones no previstas.

## Umbral de equilibrio con variables (Bs; no precio aprobado)
Definir:
P = precio bruto por plaza; f = comisión proporcional; t = carga proporcional aplicable, a confirmar; q = fracción esperada del ingreso devuelto (reserva prudente, no tasa observada); v = costo variable por plaza.
F = (h_prep + h_preflight + h_live + h_post)*w + C_demo + C_plataforma + C_admin + C_devoluciones_fijas.
h_preflight incluye revisar equipos, clips y ayuda de preparación; el soporte de un cofacilitador, si se contrata, también entra en F. El costo incremental de contenido específico de la oferta entra en h_prep/C_admin, no se oculta en el trabajo gratuito de comunidad.
w = valor del tiempo por hora; C_tool es gasto del participante, se declara aparte salvo que ONIA lo subsidie, en cuyo caso entra en v o F.
Contribución conservadora m = P*(1-f-t-q)-v.
Si m <=0: NO-GO. Si m >0: N_BE = techo(F/m). Para margen objetivo G: N_OBJ = techo((F+G)/m).
Este cálculo es de escenario: t y devolución/comisiones deben sustituirse por costos aplicables; no representa asesoramiento tributario ni retorno garantizado.
Máximo operativo N_MAX propuesto =8. Si N_OBJ>N_MAX, ajustar alcance/costo/precio o cancelar; no aumentar cupos sin capacidad.

Ejemplo exclusivamente ilustrativo: F=600 Bs, P=120 Bs, f=3%, t=0 sólo para el ejemplo, q=5%, v=10 Bs. m=100,40 Bs; N_BE=6. Con 8 plazas: contribución 803,20 Bs; excedente esperado sobre F=203,20 Bs. Si se exige G=200 Bs de margen por el piloto, N_OBJ=techo(800/100,40)=8; seis cubren F y dejan 2,40 Bs, no ese objetivo. Criterio de precio para N plazas y margen G: P >= ((F+G)/N + v)/(1-f-t-q), con denominador positivo y costos reales. No copiar US$59 de una membresía extranjera para fijar P. Si F=1.000 Bs con los otros supuestos iguales, N_BE=10: no cabe en 8, NO-GO. No se propone cobrar 120 Bs como tarifa aprobada.
Caja recibida no equivale a beneficio ni dinero disponible: separar reserva de devoluciones y costos hasta impartir la sesión.

## Validación rápida y barata, sin lanzar
1. Preparar la demo + receta y probar requisitos antes de producir landing o curso.
2. Desde un aviso ya programado, propuesta futura de investigación voluntaria: pedir un clip/caso concreto y disposición a pagar P con requisitos; no sólo “¿te interesa IA?”. No se envió ninguna encuesta en este lote.
3. Registrar por persona: problema, resultado buscado, requisitos, tiempo disponible y rechazo de precio. No almacenar aquí emails/telefonos.
4. Ejecutar 2–3 pruebas de preparación; gate propuesto: cada sistema operativo/equipo que se admitirá debe completar el resultado y un segundo render desde proyecto dentro del tiempo, registrando minutos y ayuda requerida. Una máquina fallida no se esconde detrás de un promedio; restringir compatibilidad o reducir alcance ANTES de aceptar reservas. Son gates por validar, no resultados.
5. Sólo con método/condiciones aprobados, usar reservas pagadas como señal fuerte. Interés verbal o likes son señales débiles, no “ventas”.
6. Realizar sólo si N_aptos_preparados_y_pagados >=N_OBJ (y dentro de N_MAX) al cierre. Si se incumple, devolver según términos.
7. Después medir: participantes elegibles, asistentes, previews completos, segundos renders exitosos, bloqueos, devoluciones, horas reales y margen. Umbral candidato de repetición: >=75% completa resultado, sin problemas críticos abiertos y margen positivo incluyendo soporte. No es una tasa pronosticada.
El estado actual de esos contadores es DESCONOCIDO, no cero por falta de consulta.

## Ocho perspectivas del consejo ONIA
| Perspectiva | Lectura y decisión |
|---|---|
| CEO | viable como piloto de distribución/aprendizaje; distrae si se convierte en academia paralela. Tope de horas y un resultado |
| CTO | viable condicional a demo reproducible y stack probado; no prometer equivalencia PC/cloud ni depender de claves personales |
| Programador senior | reutilizar receta/cutplan/renderer; no crear un motor nuevo ni hacer soporte improvisado de ocho instalaciones |
| Arquitecto | receta versionada + material + QA reutilizable; WhatsApp y almacenamiento existentes, sin nueva plataforma |
| Product Manager | promesa observable y criterio de finalización; distinguir grupo gratuito, práctica guiada y soporte pago |
| Consultor de mercado | la audiencia aficionada no equivale a compradores B2B; obtener evidencia de problema y precio propia |
| Inversionista | margen tras horas/devoluciones; recurrencia no probada. Membresía ahora añade obligación sin demanda demostrada |
| Cliente | conocer requisitos/costos antes de pagar; un resultado propio y soporte delimitado, sin presión ni promesas vagas |

## Viabilidad, pros/contras, riesgo, costo/dificultad y escalabilidad
- Viabilidad: condicional; diseño de piloto revisable, operación/cobro NO listos.
- Pros: valida demanda con poca producción, reutiliza montaje/recursos y convierte aplicación en evidencia.
- Contras: ingreso limitado por cupos y tiempo, preflight técnico reduce elegibles, soporte puede consumir el margen.
- Riesgos: vender antes de probar, mezclar públicos, costos ocultos de software, falta de escucha/QA, dependencia del fundador y contradicción con secuencia presencial.
- Costo/dificultad: análisis/preparación moderados; clase guiada en equipos distintos dificultad media-alta hasta completar pruebas. No hay presupuesto real observado; usar F,m,N_OBJ.
- Escala: archivos y ejemplos escalan; diagnóstico/revisión no. Después de dos pilotos con resultados consistentes, evaluar paquetes asincrónicos; membresía sólo con valor recurrente y soporte sostenible.
- Alternativas: conservar comunidad gratuita y revisar casos; práctica gratuita preparada para validar método; taller sólo de carrusel si el video no pasa preflight (nueva oferta, requiere revisión, no sustitución del resultado vendido); luego curso sobre resultado repetido. No abrir Skool por copiar al referente.

## Próximos pasos priorizados
P0 — verificar estado de pilotos canónicos y capacidad/h_semana; elegir mantener secuencia o proponer excepción explícita.
P1 — demo reproducible + lista de requisitos/costos + material mínimo; resolver bloqueo del motor antes de reservar.
P2 — probar 2–3 equipos/casos y registrar tiempo/errores; adaptar alcance.
P3 — decidir precio P, fecha/hora, plataforma, responsable de cobro, términos D_ref y N_OBJ con costo real.
P4 — revisar oferta; sólo otra autorización permitirá encuesta pública, reservas/cobro y celebración.
P5 — tras piloto, medir resultados y margen; no saltar automáticamente a membresía.

## Briefs accionables, escritos pero NO producidos
Carrusel B (primera prueba privada de contenido): resultado propio verificable→caso→requisitos→tres pasos comprobados→límites/costos→ruta de recurso comprobado. Foto/captura propia, jerarquía estable, verde ONIA; claims de créditos ajenos fuera. No convertir este carrusel automáticamente en otro workshop ni sustituir una reserva vendida como video.
Video A (después de probar reproducción): mostrar preview propio→el error que frenó→entrada/proyecto→prueba de reproducción→un recurso disponible. Usar montaje propio ya existente; no tribunal ni avatar. N02 no prueba por sí solo que el método completo se reproduce.
Aviso C: qué puede hacer el recurso y a quién sirve, más recurso íntegro separado y práctica concreta. Revisión en General dentro del límite propuesto.
No emitir promesa de workshop en estas piezas hasta que exista oferta lista y se apruebe; el CTA hoy no es “pagá”.

## Continuidad media ya cerrada
N02 ajuste privado: 102,900–105,166667 s eliminados del render original (68 cuadros); 109,033333 s final. Todos los cuadros retenidos idénticos en copia sin pérdida; audio correlacionado sin nuevo desfase en ventanas comprobadas. Copia compatible H264 High con audio idéntico a la copia QA. No master ni publicación.
DD-A: bruto 01:01–01:09 recuperado; palabra disputada 01:04,8–01:05,2 no confirmada por falta de entrada auditiva/transcriptor. Se mantienen marcador/subtítulo.
Paquete preservado: N02-ajuste-privado-evidencia.zip. Preview: N02-preview-revisable.mp4. Referencia de continuidad, NO evidencia de que la clase completa esté operativa.

## QA del informe y cierre del encargo
Herramienta real: collaboration.followup_task sobre subagentes existentes /root/editor_marca y /root/qa_marca; ACK observados, ambos completed. Se solicitaron Astra/medio en sus spawns iniciales; modelo efectivo no observable. No se crearon nuevas sesiones, renders, publicaciones o cobros.
Editor: revisó coherencia con audiencia y operación; sus cinco ajustes están incorporados (prioridad carrusel, gate de pilotos, explicar solución propia, h_preflight y presupuesto separado, segundo render obligatorio). QA: verificó las seis fuentes, mrsatiras remitente/no autor, cobertura heredada vs propia, snapshots 104/113, contradicción7/8PM y ejemplo financiero. Cálculo adicional de N_OBJ con G200:8. No se presenta ninguna tasa de conversión, venta o resultado como probado.
Registro canónico propuesto en rama revisable; este informe cambia estado de análisis a terminado, no aprueba la oferta. El handoff anterior marcaba el análisis pendiente: queda superado únicamente en ese estado, no en los pendientes de master DD-A/N02 ni permisos de publicación.


# ANEXO D — Ficha final revisada (sustituye ficha del anexo A)
# Referentes compartidos por mrsatiras — lectura heredada y aprendizajes para briefs
Fecha de corte: 11-oct-2026, hora La Paz (UTC-4). Carril ejecutor: Marca personal cloud; madre supervisa/revisa.
Estado: análisis terminado y revisado en propuesta canónica; ningún nuevo video/carrusel producido ni aplicación visual validada.
mrsatiras es el contacto que comparte enlaces, NO el autor de las piezas.

## Cobertura y procedencia
Esta sesión NO volvió a descargar ni analizar los videos de referencia: conserva evidencia transmitida por Sergio/madre, con los límites originales. Los archivos locales de abajo NO son accesibles desde este cloud.
| Fuente y autor informado | Evidencia transmitida | Cobertura propia cloud de este lote | Qué no se sabe |
|---|---|---|---|
| WhatsApp Video2026-10-11 at12.46.34PM.mp4; @IAdeGuardia | 46,28 s, 576x1024/30 fps; Gemini nativo dos pasadas, 12 cuadros distribuidos y 12 de gancho; carpeta C:/Users/PC/Documents/Codex/scratch/reference-20261011/ | análisis leído; MP4 NO recibido | URLs originales, métricas, licencia; no inferir sonido/transiciones no descritos |
| Andrea @andreaestratega; https://www.instagram.com/p/DeP64W6JynO/ | 34,95 s; descarga pública sin cookies, Gemini completo; 12 cuadros +6 de gancho; ig-references-20261011/ local | análisis transmitido; no inspección nueva de video | demanda, ventas, flujo de entrega por DM, ManyChat |
| Adrien @adrien.ninet; https://www.instagram.com/p/DeWaJ8PgQK8/ | 19,53 s; Gemini completo, 7 cuadros +6 de gancho; MP4 local | análisis transmitido; no inspección nueva | funcionamiento del repo, tiempo prometido de 5 min, licencia de reutilización |
| Enrique @soyenriquerocha; https://www.instagram.com/p/DeTY4y4mwCk/ | caption + las seis láminas leídas en Chrome por madre | lectura de evidencia, no nuevas capturas | elegibilidad/créditos Claude no validados; es estudio visual |
| Erik: https://www.instagram.com/stories/eriktaveras/4005709473972822446?reel_id=10801565739&reel_owner_id=10801565739 | muestra visual: rótulo workshop 10-oct y video testimonial; audio incompleto | evidencia transmitida | narrativa del testimonio, resultados, precio; no unir fecha 10-oct con oferta 17-oct |
| https://workshops.eriktaveras.com/w/sistema-de-edicion-17-oct/ | madre leyó página completa: agotado; 17-oct 10–12 UTC-4; 2 h Zoom; 25 personas, 2 instructores, instalación previa, skills, videos propios máx30 s, cuentas de pago/requisitos; sin precio visible | web fetch dio Internal Error; NO se revalidó estado ni oferta | precio oculto, ventas reales, reembolsos, asistencia/completitud |
| https://www.skool.com/automatizate/about | madre observó 104 miembros y US$59/mes | texto público recuperado por búsqueda/web fetch: 113 miembros, US$59/mes; captura marcada cached/crawled 3 días; NO lectura live de membresía | pagos netos, miembros activos, cancelaciones y rentabilidad |
| https://link.eriktaveras.com/erik | enlace oficial observado por madre | texto recuperado (cache 4 días): conecta Skool y taller; horario 8 PM RD | no determina cuál horario es correcto |

Los .info.json con CDN temporales NO se guardan en Git. No se accede a la PC, a un VPS ni a sesiones de las madres.
Referencias de recuperación web: turn0view0 (Skool), turn0view2 (linkbio), turn0view1 (bloqueo workshop). Las URLs públicas anteriores permiten revisar sin depender de estos IDs de conversación.

## Qué enseñan las piezas y cómo pasarlo a un brief
### IAdeGuardia
Timeline transmitida: resultado HTML→video 0–7 s; GitHub/Hyperframes 7–14; instalar/pedir/render 15–28; guion exacto/datos reales/referencia 29–38; comandos/guardar 39–43; cierre 43–46.
Mensaje/mecanismo: vuelve visible un resultado antes de explicar la herramienta. No contiene comunidad ni precio.
Aplicación: abrir con nuestro preview real; después mostrar entrada, proceso mínimo y cómo reproducir. Separar herramientas disponibles de instalaciones necesarias. No prometer que el pipeline corre en toda máquina.
No copiar: avatar inferior, identidad, negro/lima/morado exactos, guion ni recursos. No convertir la demostración ajena en prueba nuestra.

### Andrea — juicio de una idea
Tribunal 3D con 12 Claudes: acusación→defensa→votos/roles→veredicto→CTA JUICIO.
La metáfora permite enseñar objeciones y contrastar hipótesis. El voto de modelos es una simulación de crítica, NO validación de demanda. No hay evidencia de ManyChat ni de ingresos.
Aplicación económica: un video con una objeción real, evidencia y alternativa. Para ONIA sirve analizar una oferta o automatización con hechos; no hace falta producir tribunal 3D ni 12 agentes.
Brief: problema real→dos criterios enfrentados→dato verificable→decisión provisional→una prueba con personas. CTA a una matriz de decisión existente, no promesa automática por comentario.

### Adrien — resultado y recurso
Resultado Dynamic Island→repo rit3zh/expo-dynamic-notifications→instrucción al agente→resultado→CTA ISLAND.
Visual transmitido: sans fuerte con serif cursiva, blanco/negro, capturas y creador.
Aplicación: explicar un recurso probado con resultado visible y un paso reproducible. Antes de prometer “5 minutos”, medirlo en una máquina limpia y comprobar prerequisitos/licencia. No se probó ese repositorio en este lote.
No copiar: resultado/pantallas como si fueran ONIA, su identidad o CTA literal.

### Enrique — carrusel de seis láminas
Secuencia transmitida: beneficio→aplicación→elegibilidad→tres pasos→límites→CTA de caso/guía.
Visual: foto a sangre, sujeto dominante, título sans blanco y remate serif cursiva amarilla; jerarquía y márgenes consistentes aunque cambia la escena, alternando persona/avatar cúbico.
Tomar: una sola promesa por portada, progresión que responde dudas y límites antes del CTA.
Adaptación: material real propio con permisos, tratamiento B/N de marca cuando proceda, verde ONIA y captura legible. No copiar avatar, fondo o claim de créditos Claude. Mantener Bricolage/DM Sans/Instrument Serif y pack existentes donde corresponda; no introducir un sistema de marca paralelo. Márgenes estables no obligan a añadir headers/footers decorativos.
Brief candidato NO producido:
1. resultado tangible propio; 2. qué problema resuelve; 3. quién tiene requisitos; 4. tres pasos reales; 5. límites/costos; 6. una acción hacia recurso ya existente.
Si el recurso o su ruta no se probaron, dejar CTA pendiente; no fingir que comentarios disparan DM.

### Erik — oferta empaquetada
La ficha pública recuperada presenta llamada semanal, grabaciones y plantillas a US$59/mes, con 113 miembros en el snapshot. Linkbio dice 8 PM RD y Skool 7 PM RD: contradicción sin resolver. Los “30 fundadores” y garantía de 14 días son claims del autor, no ventas ni resultados auditados.
La oferta de taller transmitida concentra un resultado, preparación previa y requisitos; el “agotado” no demuestra cuántos pagaron ni una tasa de conversión. No se conoce su precio.
Aplicación: llevarse la delimitación operativa y la preparación previa, no su precio, horarios o promesas. Un taller piloto antes de membresía tiene menor obligación recurrente.

## Cobertura de dimensiones (sin inventar mediciones)
| Dimensión | Evidencia utilizable | Límite |
|---|---|---|
| Mensaje | descripciones/timelines transmitidas | no verbatim/audio propio |
| Tema y público | tutorial, crítica de ideas, recurso, elegibilidad | no rendimiento causal |
| Gancho | resultado inicial en IAdeGuardia/Adrien; conflicto Andrea | detalle cuadro a cuadro heredado, no inspección propia |
| Guion | progresión descrita | no copiar frases |
| Layout/diseño | sistemas descritos y seis láminas Enrique | no muestras propias de las referencias |
| Tipografía/color | sans/serif, paletas transmitidas | familias exactas no verificadas |
| Prueba | repo, captura y salida visible | funcionamiento/claims no comprobados aquí |
| Ritmo/cortes | rangos de timeline IAdeGuardia | cortes/10s, eases/velocidades no medidos |
| Subtítulos/textos | jerarquía y algunos CTA transmitidos | audio vs subtítulo no verificado |
| Sonido/música | no evidencia suficiente de este lote | no atribuir tema, licencia ni efectos |
| Oferta/comunidad | páginas oficiales + análisis transmitido | precios workshop y ventas desconocidos |
| CTA/resultados | JUICIO/ISLAND y entrega de guía | no prueba de DM, ventas o conversión |

## Ranking de uso
1. Primero: carrusel privado de un resultado propio con seis pasos visuales; jerarquía estable, límites y requisitos. Resultado→instrucción→prueba con material existente.
2. Probar después: video sólo tras reproducción demostrada; crítica de objeciones sin 3D.
3. Descartar para este lote: avatar ajeno, tribunal caro, promesa de 5 min sin medición, noticias sin aplicación, membresía basada en tutoriales.
4. Investigar sólo si cambia una decisión: reproducción del repo Adrien, audio de historia Erik, licencias/requisitos de materiales.

## Uso en esta tarea
Aplicado a la PROPUESTA de workshop y a los briefs escritos del documento de comunidad. Producción audiovisual/validación de diseño: PENDIENTE, no “aplicada” a una pieza nueva.
Para una futura comparación de motion/audio harían falta exactamente: MP4 limpio y análisis/timeline de IAdeGuardia, Andrea y Adrien; seis imágenes y caption del carrusel; historia completa con audio. Hoy NO son necesarios para revisar la propuesta comercial.
No pedir “todos los archivos” ni reabrir el intake de principio a fin.

## Separación de observación, inferencia y propuesta
| Referencia | Observación (con procedencia arriba) | Inferencia nuestra | Propuesta concreta ONIA |
|---|---|---|---|
| IAdeGuardia | resultado antes de proceso en timeline transmitida | salida visible hace entendible el método | demo propia antes de enseñar comandos; no anunciar workshop sin método probado |
| Andrea | juicio/roles/veredicto y CTA JUICIO transmitidos | conflicto organiza objeciones, no demuestra compra | explicar una objeción real y probar oferta con personas; evitar 3D/12 agentes |
| Adrien | resultado→repo→agente→resultado y CTA transmitidos | recurso reproducible puede acortar aprendizaje | mostrar proyecto probado y medir tiempo; no repetir “5 min” ni copiar identidad |
| Enrique | seis láminas completas examinadas por madre | jerarquía constante reduce ruido mientras avanza la explicación | primer carrusel privado con caso propio, requisitos, pasos, límites y recurso comprobado |
| Erik | páginas públicas/texto y análisis de oferta; story sólo visual | preparación/revisión justifican una oferta acotada mejor que tutoriales extra | WhatsApp vigente + piloto condicionado a capacidad; precio/fecha/ventas no inferidos |
Ninguna inferencia es una medición causal de retención, conversión o rentabilidad. QA de atribución y cobertura: /root/qa_marca, revisión de estos documentos, sin inspección nueva de los MP4 locales.


