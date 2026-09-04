# P10 · Marco HUD de cuatro esquinas + cierre por elemento portador, como composicion reutilizable de HyperFrames

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-marco-hud-y-cierre-en-wordmark.md) · `DaAjqtugWF_` · @formd.designs
- **Fuente:** https://www.instagram.com/p/DaAjqtugWF_/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para el COMPONENTE: nada. Se construye y renderiza hoy con metraje de prueba, sin credencial, sin permiso, sin gasto. Para el REEL COMPLETO de ONIA: falta metraje real — alguien filmando a Sergio trabajando (no es credencial ni permiso, es una filmacion). Y falta corregir el formato: este video es 16:9 y en Reels eso es una franja chica con bandas negras; nuestra version tiene que nacer 1080x1920 con el HUD dentro del area segura, no portar el 16:9 tal cual.

---

```text
Objetivo unico de la sesion: dejar en el repo una composicion de HyperFrames reutilizable que le ponga a CUALQUIER metraje nuestro un marco HUD de cuatro esquinas, una placa de apertura y un cierre por elemento portador, y renderizarla a MP4 para verla.

ANTES DE CODEAR NADA, leer en este orden (regla del proyecto: no reinventar el motor de video):
1. .agents/skills/hyperframes/ (skill de entrada, rutea)
2. .agents/skills/hyperframes-core/ (contrato de composicion, atributos data-*, class="clip", tracks, reproduccion de media que maneja el framework)
3. .agents/skills/motion-doctrine/ (elemento portador, seam gate, prohibicion del wobble ocioso)
4. .agents/skills/hyperframes-cli/ (check, preview, render)
Si alguna de esas rutas no existe, listar .agents/skills/ y usar la que corresponda antes de escribir codigo.

De donde sale esto: analisis del reel https://www.instagram.com/p/DaAjqtugWF_/ de @formd.designs, fichado en hermes-content/references/video-intake/. Medido con ffprobe: 16.739 s, 1276x718, 29.97 fps, 31 cortes. Leer la ficha si hace falta contexto.

QUE HAY QUE CONSTRUIR — tres piezas en UNA composicion parametrizable:

1. HUD DE CUATRO ESQUINAS
   - Cuatro rotulos en mayusculas, grotesca bold, tamano ~1.3% de la altura del cuadro, tracking ~0.05em. Parametrizables por variable: arribaIzq, arribaDer, abajoIzq, abajoDer. Valores por defecto para ONIA: "PRODUCTO" / "ONIA" / "<rubro>" / "2026(c)".
   - Color: blanco puro con mix-blend-mode: difference. Ese es el punto de todo el ejercicio — sobre metraje oscuro se lee blanco, sobre un fondo blanco se lee NEGRO solo, y sobre altas luces quemadas se apaga en vez de pelearse con la imagen. NO hardcodear dos versiones de color.
   - El HUD NO aparece en el primer plano. Entra recien en el primer corte. Dejarlo como parametro (retrasoHud, default 1.4 s).

2. PLACA DE APERTURA
   - Titular a dos lineas, centrado en el eje horizontal, blanco, grotesca pesada, sobre metraje a sangre completa y SIN HUD.
   - Cero animacion de texto: aparece y desaparece. Nada de entrada, salida, rebote ni fade elaborado. Es deliberado y es la mitad del efecto (camara salvaje + tipografia inmovil).
   - Duracion por defecto 1.4 s, parametrizable.

3. CIERRE POR ELEMENTO PORTADOR
   - El wordmark aparece en pantalla, en su posicion y tamano FINALES, mientras detras todavia siguen cambiando planos de metraje.
   - Despues el fondo se blanquea (#F5F4F2) y el wordmark queda quieto, sin moverse un pixel, invirtiendose a negro por el mismo mix-blend-mode: difference.
   - Duracion del cierre por defecto 1.6 s.

FORMATO — esto es una CORRECCION al original, no una copia:
   - Salida primaria 1080x1920 (9:16), con el HUD dentro del area segura de Reels/TikTok (nada de rotulos pegados al borde absoluto: dejar margen para la UI de la app).
   - Salida secundaria 1920x1080 (16:9) desde la MISMA composicion, via variable de formato.
   - El original es 16:9 y en Reels se ve como una franja chica entre bandas negras. No portar ese error.

GRADE Y RITMO (si tocan el metraje de prueba, con ffmpeg o el paso de grade que ya tengamos en editor-videos):
   - Teal & orange disciplinado, DOS temperaturas y nada mas: sombras a turquesa (~#1E9C9E), medios y piel a ambar (~#E08A3C), negros aplastados. Sin tercer color.
   - Cadencia de referencia medida del original: plano 1 = 1.43 s, plano 2 = 1.41 s, luego 0.50/0.16/0.30/0.47, rafaga de TRES cortes de 0.10 s (3 fotogramas), pulso sostenido de media ~0.47 s, frenada de 0.97 s, cierre de 1.59 s. Regla: el plano mas largo es el primero, el segundo mas largo es el ultimo.

LIMITES DEL PROYECTO QUE APLICAN:
   - Regla de oro de video: la tabla de cortes + preview 360p se le MUESTRAN a Sergio ANTES de aplicar ningun corte sobre metraje real. En esta sesion se trabaja con metraje de prueba, asi que no aplica todavia, pero dejarlo escrito en el README del componente.
   - Gasto: cero. Nada de Higgsfield ni ElevenLabs aca. HyperFrames + ffmpeg y listo.
   - No inventar clientes, testimonios ni cifras en el metraje de prueba ni en los textos por defecto.
   - Un carril, un worktree, rama propia, commits conventional, y gates antes de mergear.

DONDE VA: la composicion en la carpeta de composiciones de HyperFrames que corresponda segun hyperframes-core; los dos patrones nuevos anotados en web-factory/docs/MOTION_PATTERN_BANK_2026.md con los nombres "HUD de cuatro esquinas por diferencia" y "cierre por elemento portador".

LISTO = existen dos MP4 renderados desde la MISMA composicion (uno 1080x1920 y uno 1920x1080) donde, mirando las capturas: (a) el HUD se lee blanco sobre el metraje oscuro Y negro sobre la placa final blanca, sin que exista ninguna version de color hardcodeada en el codigo; (b) el HUD esta ausente en el primer plano y presente desde el primer corte; (c) el wordmark aparece sobre metraje y termina quieto en la placa blanca en identica posicion y tamano, verificable comparando dos fotogramas; y (d) MOTION_PATTERN_BANK_2026.md tiene los dos patrones nuevos escritos.
```
