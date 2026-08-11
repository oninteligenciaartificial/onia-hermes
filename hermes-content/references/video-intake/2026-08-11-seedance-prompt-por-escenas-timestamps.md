# Seedance 2.5 — prompt por escenas con timestamps, desde UNA foto

- **Fuente:** https://www.instagram.com/p/DbmahL7PNcH/ · 27,6 s · sin voz (solo música)
- **Visto:** 2026-08-11 — **camino alternativo** (cuota de Gemini agotada): 2 de 6
  fotogramas leídos con visión + audio confirmado sin locución
- **Lectura completa:** [transcripciones/2026-08-11-fallback-sin-gemini.md](transcripciones/2026-08-11-fallback-sin-gemini.md) (sección 2)

## Qué dice realmente

No dice nada — lo muestra. Pantalla partida: arriba el video generado (un Aston Martin,
tablero marcando 321, freno Brembo, carretera con luz dorada), abajo el prompt completo
scrolleando bajo el rótulo `STEAL MY PROMPT` · `COMMENT "AGENT"`.

Lo importante son las dos columnas de abajo:

- **`INPUT` = una sola foto.** Un retrato de estudio de un hombre de smoking sobre fondo
  gris. Nada más. Ni video de referencia, ni múltiples ángulos.
- **`PROMPT` = un guion por escenas numeradas con rangos de tiempo explícitos.**

```
Scene 2 — Omega Watch (3.0s–5.5s)
Scene 3 — Digital Speedometer (5.5s–8.0s)
Scene 5 — Driver Portrait (10.5s–13.5s)
Scene 6 — Car Drives Toward Camera (13.5s–17.0s)
```

Cada escena especifica encuadre, ángulo, comportamiento de cámara ("cámara en mano con
vibración de la ruta", "micro-vibraciones que refuerzan el realismo"), qué queda en foco y
qué sale de foco, y la calidad de la luz. El sujeto de la foto aparece en la Scene 5
manejando, coherente con el resto.

## Veredicto: SIRVE YA

Este es el video más útil de toda la tanda, y hay que leerlo junto con el del 9-ago
([SOUL 2.0 + Seedance](2026-08-09-higgsfield-soul2-seedance25.md)). Aquel decía la
consigna — *"no es un prompt, es arquitectura"*, con lock de vestuario, raccord de luz y
timestamps — pero no mostraba la estructura. **Este la muestra entera y se puede copiar.**

Es exactamente lo que nos falta para Lucía. Hoy generamos plano por plano y la consistencia
entre tomas se rompe; esto es un guion único donde la continuidad está escrita en el prompt,
no arreglada después. Y el input es una sola foto — que es precisamente lo que tenemos con
los Souls ya creados.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| INFLUENCERS IA | Portar la plantilla `Scene N — <nombre> (Xs–Ys)` + encuadre + cámara + foco + luz al brief de generación de Lucía. Es la estructura, no el contenido del auto |
| editor de videos / skills | Los tres campos que faltaban (`lock_vestuario`, `raccord_luz`, `timestamps`) dejan de ser una idea: acá están escritos como se ven en producción |
| marketing con IA | El formato "pantalla partida: resultado arriba, prompt abajo" es un formato de contenido en sí, y muestra autoridad sin revelar nada crítico |

**Gate:** probarlo consume créditos de Higgsfield → permiso explícito, caso por caso. Antes
de gastar, verificar que Seedance 2.5 esté en la cuenta y a qué costo por generación (eso
ya está encolado como V-3 en [PENDIENTES.md](PENDIENTES.md)).

## Riesgo

El prompt que se ve es de un anuncio de auto de lujo: si se copia el contenido en vez de la
estructura, salen piezas que no tienen nada que ver con ONIA. Lo que se roba es el
**esqueleto por escenas con timestamps**, no el Aston Martin.

Y ojo con el costo: 17 segundos divididos en 6 escenas es una generación larga. Medir el
costo unitario antes de meterlo al pipeline de producción continua.
