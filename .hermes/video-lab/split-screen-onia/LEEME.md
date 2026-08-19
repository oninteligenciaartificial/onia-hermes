# Barrido split-screen — plantilla ONIA

Comparación antes/después **en un solo plano**, montaje puro. **Cero créditos.**

## Para qué

La situación real del negocio y el mismo plano con ONIA corriendo, en el mismo cuadro.
Las dos mitades están superpuestas: **el barrido no mueve las imágenes, mueve el recorte**
(`clip-path`). Por eso el fondo, la luz y el encuadre coinciden cuadro a cuadro — que es lo
que vuelve irrefutable la comparación.

Sirve igual para web-factory: la web vieja del cliente y la nueva, mismo plano.

## Cómo se usa

```bash
cd .hermes/video-lab/split-screen-onia
cp <tu-antes.png>   assets/antes.png
cp <tu-despues.png> assets/despues.png
npx hyperframes check                                    # gate obligatorio
npx hyperframes render --quality high --output salida.mp4
```

Editar las etiquetas ("Hoy" / "Con Onia") en `index.html`.

## La regla de jerarquía, que está en el CSS a propósito

> El ganador va **más grande y más arriba**; el perdedor **achicado y hundido**.
> El ojo decide antes de leer.

Fuente: `hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md` §5.9.
Por eso `#et-despues` es 52px arriba a la derecha y `#et-antes` es 30px hundido a la
izquierda. **No es decoración: es lo que hace la comparación.** Si se igualan los tamaños,
la pieza deja de decir quién gana.

## Render de prueba

`prueba-barrido.mp4` — 1080x1920, 180 fotogramas, 6.0 s, 749 KB. Hecho con dos slides del
carrusel "WhatsApp a mano" que ya teníamos. `check` pasó: 0 errores de layout, 0 de motion,
6/6 contrastes WCAG AA.

## Nota sobre el registro de HyperFrames

`before-after-wipe` y `comparison-split` **existen en el registro pero están rotos**: instalan
el lock y no el `index.html` ("The registry item may be malformed"). Por eso esta plantilla se
escribió sobre `--example blank`. Si algún día se arreglan, vale compararlas.
