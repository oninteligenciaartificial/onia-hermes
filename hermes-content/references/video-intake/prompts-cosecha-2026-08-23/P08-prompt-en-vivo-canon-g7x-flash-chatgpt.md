# P08 · Tres reels con el molde 'prompt en vivo' (screen recording + overlay estático)

- **Destino:** `marketing`
- **Sale de:** [la ficha](../2026-08-23-cosecha-prompt-en-vivo-canon-g7x-flash-chatgpt.md) · `DbqmAEYhJsF` · @marian.rojass
- **Fuente:** https://www.instagram.com/p/DbqmAEYhJsF/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Nada para portar el molde. HyperFrames está instalado y probado, el editor de videos está completo y en main, la plataforma tiene rubros encendidos en producción para grabar, y el destino del CTA ya está decidido (demo en cal.onia.com.bo). El único límite es de contenido, no de herramienta: solo se graba lo que está VIVO en producción — nada detrás de un flag apagado y ningún cartel de 'muy pronto' en cámara.

---

```text
Objetivo único de la sesión: producir TRES reels verticales de Onia con el molde 'prompt en vivo', extraído de https://www.instagram.com/p/DbqmAEYhJsF/ (@marian.rojass). La ficha completa del análisis está en hermes-content/references/video-intake/ con el slug prompt-en-vivo-canon-g7x-flash-chatgpt — leela ANTES de empezar.

EL MOLDE (cifras medidas con ffprobe sobre el original, no estimadas):
1. Gancho de 4 palabras en overlay fijo, con la forma 'No tengo <lo caro> pero sí <Onia>'. Cuatro líneas, quiebre por sentido, centrado.
2. 40-45% del metraje es UN SOLO PLANO continuo mostrando el trabajo en curso en pantalla. En el original son 9,5 s de tecleo sin un solo corte.
3. La espera se MUESTRA, no se corta.
4. UN solo corte (el original tiene 2, ambos en el mismo instante: 9,47 s y 9,80 s) y ahí entra el reveal a pantalla completa.
5. Cierre: comparación antes/después y termina en el DESPUÉS.
6. Duración total 13-15 s.

ESPEC DEL OVERLAY (medido sobre el original, portalo tal cual):
- Sans geométrica redondeada ExtraBold/Black, caja mixta, SIN contorno, SIN sombra, SIN caja de fondo.
- Cuerpo = 2,7% de la altura del cuadro. Interlínea 1,1 (apretada).
- Color #C042E5 (magenta-violeta) sobre fondo claro. UN SOLO acento, cero degradados, cero segundo color.
- Bloque centrado, entre y=20% e y=30% de la altura.
- CERO animación de entrada: el overlay es estático todo el video. El movimiento lo pone la UI grabada, no el editor. No agregues keyframes, no agregues transiciones.

LOS TRES REELS (grabar pantalla de onia-platform en PRODUCCIÓN, con datos de prueba, nunca datos de un cliente real):
A) 'No tengo recepcionista pero sí Onia' — grabar el editor de conocimiento del chatbot en vivo, escribiendo una respuesta y probándola en el probador.
B) 'No tengo secretaria pero sí Onia' — grabar el alta de una cita en el módulo dental de punta a punta.
C) Tercero a tu criterio, elegido SOLO entre capacidades encendidas y verificadas en producción hoy.

REGLAS DURAS, no negociables:
- Solo se graba lo que está VIVO en producción y verificado ahí. Nada detrás de un flag apagado. Si al ir a grabar algo no funciona, NO lo grabes: cambiá de reel y anotá el pendiente.
- PROHIBIDO que aparezca en cámara 'muy pronto', 'beta', 'en construcción' o cualquier estado de obra. Un solo cartel contamina el producto entero.
- No fabricar: cero testimonios, cero logos de clientes, cero cifras de resultados. No hay clientes pagando.
- Datos en pantalla: inventados y obviamente de prueba. Ningún nombre, teléfono ni NIT real.
- CTA: el objeto que mandamos es AGENDAR UNA DEMO en cal.onia.com.bo (decisión del 2026-08-23). NO un PDF. Va como última línea del caption, no como overlay en el video.
- El original no tiene CTA porque su conversión es el guardado; el nuestro sí lo lleva.

ENTREGABLES:
- 3 MP4 verticales 1080x1920 renderizados con HyperFrames (leé la skill hyperframes ANTES de codear; no reinventes el motor).
- 1 archivo de caption por reel, con el CTA a cal.onia.com.bo.
- La tabla de cortes y el preview 360p de los tres, MOSTRADOS a Sergio ANTES de dar nada por cerrado (regla de oro del carril video: nunca cortar a ciegas).

LISTO = los 3 MP4 existen en disco, ffprobe confirma en cada uno duración entre 13 y 15 s, resolución 1080x1920 y como máximo 2 cortes detectados con umbral scene 0.3; los 3 previews 360p y su tabla de cortes fueron mostrados a Sergio; y ningún fotograma de ningún reel contiene las cadenas 'muy pronto', 'beta', 'próximamente' ni 'en construcción'.
```
