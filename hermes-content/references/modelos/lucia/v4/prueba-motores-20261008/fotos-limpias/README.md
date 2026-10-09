# Fotos limpias (9-oct-2026)

Copias de dos fotos de la prueba de motores con un **desenfoque con pluma** sobre lo que no se debe ver en una pieza pública:

| Archivo | Qué se tapó | Por qué |
|---|---|---|
| `img-nano-banana-2-1-a4dd1a48-limpia.jpg` (Imagen C) | Dos sillones dentales y una pantalla al fondo (derecha, x 860-1080, y 720-970) y un logo tipo marca en el borde del monitor (x 1030-1080, y 1025-1085) | El ambo es vestuario: un consultorio dental detrás da a entender el rubro (`LUCIA.md`: nunca profesional de salud) y el logo es una marca de tercero |
| `img-flux-3-af9c2d0c-limpia.jpg` (Imagen E) | Un logo tipo marca en el respaldo del monitor (x 855-930, y 720-795) | Marca de tercero |

La cara no se toca. Los originales siguen en `../fotos/` (evidencia de la prueba); para publicar se usan estas.
Receta: ffmpeg, un solo paso en RGB (`format=gbrp`, `gblur` + `maskedmerge` con máscara difuminada, salida `yuvj420p`).
Con dos pasos por YUV los colores se corren: un solo paso desde el original.
