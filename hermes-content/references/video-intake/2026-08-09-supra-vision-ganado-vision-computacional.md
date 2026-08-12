# Visión computacional sobre ganado — Supra Vision "Sheep.AI"

- **Fuente:** https://www.instagram.com/p/DbrAX61oo4w/ · 21 s · sin voz (cencerros)
- **Visto:** 2026-08-09 (Gemini nativo)
- **Archivo:** `Instagram-DbrAX61oo4w.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-09-supra-vision-ganado.md](transcripciones/2026-08-09-supra-vision-ganado.md)

## Qué dice realmente

Pieza publicitaria de **Supra Vision**, sin locución. Un rebaño de ovejas corre por un
camino de tierra; encima, un overlay de escáner táctico dibuja cajas de seguimiento sobre
cada animal con datos por individuo:

```
Sheep.AI // TACTICAL SCANNER      FPS: 5.9 | POS: 85
TARGET [Sheep] | ID: n | CONF: n% | DIST: n m | SPD: n km/h
```

Encabezado: `VISIÓN COMPUTACIONAL · DETECCIÓN • ANÁLISIS • ACCIÓN` y
*"La gestión ganadera también puede ser inteligente."*
Barra inferior: *"> Más productividad. Menos tiempo perdido. Mejores resultados."*
Sin CTA, sin web, sin precio.

## Veredicto: FUTURO (producto) / SIRVE YA (formato de demo)

**Como producto:** toca directamente Ganadero OS, que hoy es el último de la cola de
adopción y está pensado como offline. La tecnología de fondo (detección + tracking tipo
YOLO) es real, madura y barata — no es humo. Lo que sí es marketing: pasar de "detecto y
cuento ovejas en un video" a "gestión ganadera inteligente" hay un abismo de producto
(precisión con animales superpuestos, campo abierto, polvo, noche). El `FPS: 5.9` sugiere
inferencia real, no mockup, pero a 6 fps.

**Como formato:** aquí está el valor inmediato. Un overlay táctico sobre metraje real
comunica "la IA VE tu operación" en 20 segundos, sin voz, sin cara y sin traducción. Ese
recurso sirve para cualquier rubro nuestro, no sólo ganadero: cajas sobre productos en una
ferretería, sobre una sala dental, sobre un depósito.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Ganadero OS | Guardar como referencia competitiva. **No abrir el frente ahora** — está detrás de DentalGest y comercio en la cola |
| Contenido / demos | Adoptar el recurso "overlay táctico sobre video real" para demos de ONIA Platform. Se hace con ffmpeg + overlay, sin modelo entrenado, si es una demo declarada como tal |
| Ventas | Recordatorio de posicionamiento: vende **resultado operativo** (productividad, tiempo, resultados), no la tecnología. Nuestra línea también debe ser esa |

## Riesgo

Si alguna vez montamos un overlay así para una demo, **decir que es una demo**. Mostrar
cajas de detección falsas sobre el ganado de un cliente potencial sería fabricar capacidad
— prohibido.


---

## CORRECCION 2026-08-11 — el encuadre estaba mal

Sergio: *"la onia plattform claro que entra"*. Tenia razon, y el error fue de encuadre, no de
analisis.

Archive esto como **"Ganadero OS, que esta ultimo en la cola"** — o sea, lo trate como una
pregunta de linea de producto. Pero ONIA no vende lineas de producto: vende **UNA plataforma
con modulos por rubro**, y hoy hay seis rubros vendibles (dental, comercio, importadora,
estetica, veterinaria, servicios).

Una camara que detecta y sigue movimiento **no es una funcion ganadera**. Es una capacidad
que enchufa en varios rubros que YA vendemos:

| Rubro | Que resuelve la camara |
|---|---|
| **comercio minorista** | cuanta gente entra, a que hora, cuanto se queda frente a que gondola. Hoy el duenio no tiene ese dato |
| **importadora** | conteo de bultos en la descarga, verificacion contra la lista de packing |
| **servicios** | control de acceso y aforo |
| ganadero | conteo de hacienda (el caso del video) — pero es el ultimo de la cola, no el primero |

Y esto coincide con la doctrina del core escrita en el CLAUDE.md: **un rubro nuevo sale de
ENCENDER capacidades del core, no de escribir codigo nuevo.** La vision es una capacidad
candidata, no un producto aparte.

**Encaje con Onia Box.** La vision por computadora necesita procesar en el lugar (subir video
continuo a la nube es caro y lento). Eso es exactamente lo que Onia Box existe para resolver:
infraestructura on-premise en el negocio del cliente. La camara le da a Onia Box algo concreto
que hacer, y Onia Box le da a la camara donde correr.

**Veredicto corregido: FUTURO -> capacidad candidata de la plataforma.** Sigue sin construirse
hoy — pero se evalua como capacidad transversal, no se archiva bajo un rubro que esta en pausa.
Prompt en PROMPTS_POR_SESION.md, seccion `onia-plattform`.

**Lo que NO cambia:** el video sigue siendo una pieza publicitaria sin CTA ni precio, y el salto
de "detecto ovejas en un video" a "gestion ganadera inteligente" sigue siendo marketing. Si
alguna vez montamos un overlay asi para una demo, se declara que es demo.
