# P14 · Pack de overlays 'recorte vertical ONIA' en HyperFrames

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-recorte-de-podcast-que-retiene-sin-cortar.md) · `DbJy34KhdyM` · @niidea.tv
- **Fuente:** https://www.instagram.com/p/DbJy34KhdyM/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para CONSTRUIR el pack, nada: cero gasto, cero credencial, cero permiso, HyperFrames es local y gratis. Para USARLO falta metraje propio de talking-head — ONIA no tiene podcast ni archivo de camara equivalente. Y una decision chica de Sergio: la placa de cierre nuestra pide una demo en cal.onia.com.bo, que es un agendamiento 1:1, no una cita recurrente como la de ellos; el molde se porta, el objeto cambia.

---

```text
Objetivo unico de la sesion: construir en HyperFrames un pack de overlays de marca ONIA, reutilizable, para recortes verticales de talking-head, copiando el MECANISMO (no el color) de un reel de @niidea.tv analizado el 2026-08-23 (ficha en hermes-content/references/video-intake/, id DbJy34KhdyM).

Antes de codear: leer las skills hyperframes, hyperframes-core y hyperframes-animation. NO reinventar el motor (regla: revisar .agents/skills/ antes de escribir video). Cargar tambien editor-videos y captions-overlay.

Por que este molde importa, medido con ffprobe sobre el original: 65,364 s con 17 cortes detectados, pero 11 de esos 17 caen dentro de 0,7 s al final (la transicion a la placa). El cuerpo real son 58 s con 6 detecciones, probablemente 3 o 4 transiciones. Es casi un plano secuencia y aun asi retiene: la retencion la sostiene el TEXTO, no el montaje. Ese es el punto que copiamos.

Construir CINCO piezas como composiciones HTML independientes y parametrizables (texto por variable, nada hardcodeado):

1. BUG DE MARCA. Dos logos fijos en las esquinas superiores, uno a cada lado. Nunca se mueven, nunca se animan, viven todo el clip. Usar el tile verde de Onia ya decidido y publicado (memoria: onia-logo-tile-verde-decidido).

2. BARRA DE TITULO QUE SE CONSTRUYE. Caja blanca ~95% opaca con texto negro en grotesca pesada condensada, mayusculas, dos lineas centradas, ancho ajustado a la linea mas larga. Se arma en ~0,5 s en este orden: se traza una linea horizontal, aterriza la linea 1, aterriza la linea 2 y la caja crece hacia abajo. Entra a los 0,5 s, sale a los ~5,8 s. Va en una ranura a ~70% de altura. Motivo: un recorte no controla su primer segundo de audio, asi que la promesa va ESCRITA. El copy debe ser tres verbos en imperativo voseo con promesa doble; en el original era 'LOS PANELES SOLARES: GENERA, VENDE AL SISTEMA Y PAGA MENOS'.

3. KARAOKE DE UNA PALABRA. Misma ranura vertical que la barra de titulo (compiten a proposito: mientras el titular esta, el karaoke se OCULTA, no se corre). Una palabra por vez, centrada, reemplazo DURO sin fundido. Relleno naranja/acento con contorno-sombra oscura para leerse sobre cualquier fondo. Regla dura: cuando no hay voz, la ranura queda VACIA, jamas repite la ultima palabra.

4. ZOCALO TEMPORIZADO. Barra chica con degradado y texto blanco, ~4 s, y se dispara MONTADA SOBRE UN CORTE de camara: el corte justifica el grafico. En el original decia 'E$B 21:00 Mie'; el nuestro lleva la marca y el llamado.

5. PLACA DE CIERRE. Entra con un flash-cut estroboscopico de 0,7 s (la unica transicion fuerte de todo el video, reservada para el momento en que se pide la accion), se queda ~7 s en fijo y termina con fundido de salida. Degradado de marca con grano encima. Contenido: logo Onia + 'Agenda tu demo' + cal.onia.com.bo. Es un agendamiento 1:1, NO una cita recurrente: el molde se porta, el objeto cambia (decision 2026-08-23, el lead magnet es la demo).

Ademas del pack, dejar un push-in continuo lentisimo aplicable al plano fijo (scale progresivo, la unica fuente de movimiento durante decenas de segundos). Cero wobble, cero movimiento ocioso.

Prohibiciones: la placa y la barra NO pueden decir 'muy pronto', 'beta', 'proximamente' ni nada de estado de obra (regla: la venta nunca exhibe obra). NO inventar testimonios, logos ni cifras de clientes (regla: no fabricar, cero clientes pagando). Nada de gasto: HyperFrames es local y Apache 2.0, no tocar Higgsfield ni ElevenLabs.

RENDER Y VERIFICACION: renderizar a 1080x1920 sobre un clip de prueba propio; si no hay metraje de talking-head disponible, generar una placa de color con temporizador como base y decirlo explicito, no simularlo con material ajeno. Antes de aplicar cualquier corte sobre metraje real, mostrar a Sergio la tabla de tiempos y un preview a 360p (REGLA DE ORO: nunca cortar a ciegas). Guardar las piezas donde corresponda segun la tabla de CLAUDE.md y NO dejar nada suelto en la raiz. Al cerrar, escribir el handoff en .claude/handoff/<rama-con-guiones>.md con los 7 campos, incluido 'intentos fallidos'.

LISTO = existe un MP4 de 1080x1920 renderizado con HyperFrames que, abierto y MIRADO (no un grep, no un exit code 0), muestra las cinco piezas funcionando: bugs fijos en ambas esquinas superiores durante todo el clip, barra de titulo de dos lineas que se construye linea por linea y sale a los ~5,8 s, karaoke de una palabra con reemplazo duro y ranura vacia en los silencios, zocalo temporizado disparado sobre un corte, y placa de cierre que entra por flash de 0,7 s y dice cal.onia.com.bo; mas las cinco composiciones HTML parametrizables commiteadas y el patron 'barra de titulo que se construye linea por linea' agregado a web-factory/docs/MOTION_PATTERN_BANK_2026.md.
```
