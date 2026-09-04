# P09 · Portar el patron 'overlay dibujado que golpea la UI' a un reel de 7 s de Onia Platform

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-latigo-dibujado-sobre-captura-de-terminal.md) · `Day9oS2ClDu` · @algorithmicscaracasccct
- **Fuente:** https://www.instagram.com/p/Day9oS2ClDu/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Nada bloqueante: cero gasto, cero credencial, cero permiso. Solo dos insumos nuestros: (a) una captura de pantalla de Onia Platform ya restilada — la memoria de la landing v3 dice explicitamente que los dashboards se restilan ANTES de las capturas, ese es el orden; (b) decidir que accion concreta dramatiza el gesto. ADVERTENCIA DE MARCA: si portamos el molde hay que agregarle el cierre que este post NO tiene (agendar demo en cal.onia.com.bo), y jamas copiar la mecanica del titular — el post afirma una capacidad que su propia pantalla desmiente (todos los Web Search salen Interrupted y Claude termina respondiendo de memoria), que es justo lo que la regla de no fabricar prohibe.

---

```text
Sos la sesion del carril editor-de-videos. Objetivo unico: producir UN reel vertical de ~7 segundos que porte el patron de motion documentado en la ficha de video-intake `Day9oS2ClDu` (latigo dibujado sobre captura de terminal), aplicado a una pantalla real de Onia Platform.

ANTES DE CODEAR, cargar en este orden: la skill `hyperframes` (entrada), `hyperframes-core` (contrato de composicion), `motion-doctrine` (ley de continuidad y prohibicion de wobble ocioso), `cut-the-curve` (curva del golpe), `oversized-cursor` (el patron hermano: elemento grafico fuera de escala sobre una UI real) y `hyperframes-animation` + `hyperframes-keyframes`. NO reinventar el motor: HyperFrames vive en `.agents/skills/`, revisarlo antes de escribir nada.

EL PATRON A REPRODUCIR (medido con ffprobe sobre el original, no estimado):
- 6.9 s aprox, 30 fps, formato 9:16.
- CERO cortes. Un solo plano continuo. Todo el ritmo lo pone el elemento animado, no el montaje.
- Lienzo negro puro #000000 con letterbox arriba y abajo; la captura de pantalla FLOTA en el centro al ancho del area util, NO se recorta a pantalla completa.
- UN solo titular estatico, presente el 100% del tiempo, en el tercio superior negro: sans humanista peso regular (NO bold), blanco #FFFFFF, caja baja, centrado, 3 lineas maximo, interlineado ~1.25, ancho ~78%. Sin sombra, sin caja de fondo, sin contorno, sin emoji.
- Encima de la captura: un elemento grafico SOBREDIMENSIONADO en trazo de contorno blanco #FFFFFF de 3-4 px, SIN relleno, blend normal. Entra fuera de cuadro, describe un arco en S, 'golpea' cerca del punto de interes de la UI, sale de cuadro. ~3 pasadas en los 7 s.
- SMEAR FRAMES obligatorios en el pico de cada pasada: 3-5 copias del mismo path desfasadas con opacidad decreciente, encendidas SOLO en los fotogramas del pico. Esto es lo que hace que el golpe se sienta rapido sin un solo corte. Implementacion: <svg> con <path> animado por stroke-dasharray + transform keyframeado; las copias son paths hermanos con opacity keyframeada a 0 fuera del pico.
- El elemento NO deforma la UI. La ilusion de impacto es solo trayectoria + smear + SFX sincronizado al frame del restallo.

QUE DRAMATIZAR (elegir UNO y no mezclar): una accion real y VIVA de Onia Platform. Ejemplo valido: la agenda del modulo dental donde una cita se confirma sola. Prohibido dramatizar algo que no este encendido en produccion.

INSUMOS QUE TENES QUE CONSEGUIR VOS ANTES DE RENDERIZAR:
1. La captura de pantalla de Onia Platform. Grabar la pantalla REAL, no un mockup — la mugre autentica (barra del navegador, datos reales de demo) es lo que hace creible el patron. OJO CON EL ORDEN: si la pantalla no esta restilada segun la linea de la landing v3, se restila ANTES de capturar. No capturar una pantalla vieja.
2. El SVG del gesto, en trazo de contorno sin relleno.

REGLAS DE MARCA — NO NEGOCIABLES:
- El original NO tiene CTA. El nuestro SI: cierra mandando a agendar demo en cal.onia.com.bo. Ese es el lead magnet decidido; no es un PDF.
- PROHIBIDO copiar la mecanica del titular del original. Ese post afirma 'hace que Claude funcione mas rapido' mientras su propia pantalla muestra que cancela todas las busquedas. No fabricamos capacidades.
- PROHIBIDO todo estado de obra en pantalla: nada de 'muy pronto', 'beta', 'proximamente', 'en construccion'.
- Cero cifras, cero testimonios, cero logos de clientes: no hay clientes pagando.

GASTO: cero. Todo con HyperFrames local. NO usar Higgsfield ni ElevenLabs sin permiso explicito caso por caso.

REGLA DE ORO DEL CARRIL: la tabla de cortes y el preview 360p se le MUESTRAN a Sergio antes de dar nada por bueno. Nunca cortar ni publicar a ciegas. Construir y publicar son dos permisos distintos.

Al cerrar, escribir el handoff del carril en `.claude/handoff/<rama-con-guiones>.md` con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md, incluido el campo de intentos fallidos.

LISTO = existe un MP4 renderizado en el arbol de trabajo que ffprobe reporta como 1080x1920, 30 fps, entre 6.0 y 8.0 s; `ffmpeg` con filtro de escena a umbral 0.3 reporta 0 cortes; y abriendo con Read el fotograma del segundo 3 se ve simultaneamente el titular estatico, la captura de Onia Platform y el trazo blanco del overlay con sus smear frames.
```
