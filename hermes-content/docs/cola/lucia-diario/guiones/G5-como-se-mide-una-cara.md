# G5 · «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — guion para validar (9-oct-2026, corregido por el montaje)

> **D-N1 (Sergio Urcullo, 11-oct):** las herramientas SÍ se nombran, como uso propio y no como recomendación pagada. Los rótulos «Motor N» e «Imagen X» de este guion se reemplazaron por los nombres reales; el pie suma «Nombro lo que uso; no es una recomendación pagada.» Este guion es la **v1 (58 s)**: la v2 de ≤ 30 s vive en `videos/lucia-g5-v2/`.
> **Estado: PARA VALIDAR por la madre antes de publicar.** Ya está montado (`videos/lucia-g5/`, preview 360p en `qa/`); **2da pasada aplicada** (9-oct): revisión independiente `videos/lucia-g5/qa/revision-1.md` (sin BLOQUEA, 5 ARREGLAR) y decisiones del orquestador.
> Este guion es el **corregido por el montaje** (9-oct): reemplaza al primero. La tabla de abajo dice qué cambió y por qué; se revierte con `videos/lucia-g5/plan.json → agregados_al_guion`.
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja algo aprendido.
> - **Costo: 0 cr.** **Se nombran las herramientas (D-N1, 11-oct):** los motores por su nombre; el medidor puede decirse «ArcFace» (modelo abierto).

## Qué cambió respecto del guion del repo, y por qué

| # | Guion del repo | Corregido | Por qué |
|---|---|---|---|
| G1 | «¿Cómo sé que esta cara es ella?» (7 palabras) | «¿Cómo sé que esta es ella?» (6) | El tope del guion es 6 palabras por tarjeta; el guion se pasaba del suyo. |
| G2 | «Da un número, de 0 a 1. Idéntica es 1.» (10 palabras, una tarjeta) | dos tarjetas: «Un número, de 0 a 1.» (6) → «Idéntica es 1.» (3) | Mismo motivo. |
| G3 | «Por eso, siempre, mirá la imagen entera.» (7) | «Por eso, mirá la imagen entera.» (6) | Mismo motivo; se pierde «siempre» (el cierre «cada semana, una prueba» ya dice que es un hábito). |
| G4 | «Su cara de verdad, fija.» | «Su cara oficial, fija.» | Lucía es un personaje hecho con IA: «de verdad» se lee como «persona real». |
| G5 | **«Cara chica: baja sola.»** (y, en el pie, «una cara chica baja sola») | **«Cara chica: lo reviso a ojo.»** (6) con la nota «Bajo 200 px, el medidor avisa: lo reviso a ojo.» (y, en el pie, «con una cara chica lo reviso a ojo») | «Baja sola» **no es falso por completo, pero sí exagerado:** los datos muestran una caída pequeña y consistente (la MISMA foto reducida hasta que la cara mida 60 px baja 0,004-0,010 en cinco de seis fotos; la sexta, F, oscila ±0,02: `qa/cara-chica-control.txt`) y en el Kling O3 la cara va de 89 a 168 px y el número va de 0,80 a 0,82 (no baja). Lo falso es que la caída sea apreciable. La 1ra pasada puso «poco confiable» (la regla del gate, < 200 px) y el revisor lo marcó como una frase que el video no demuestra: el video dice lo que hace (la imagen se mira a ojo) y que el medidor avisa bajo 200 px (3ra pasada: antes «no es fiable»), sin decir que el número baje ni que no baje de más. |
| G6 | «Una diferencia de 0,03 no cuenta» con «dos medidas 0,79 y 0,77» sobre la escala | **«Mismo clip: de 0,77 a 0,80.»** (6) → **«Esa variación cabe en ±0,03.»** (5), sobre la escala AMPLIADA «Zoom: 0,70 a 0,90» con la marca «mi piso · 0,70» | La 1ra pasada ilustraba el ±0,03 con 0,79 y 0,77 (difieren 0,02) y lo llamaba «orden de magnitud» (potencia de diez: jerga mal usada). Ahora el ancla es el rango del MISMO clip del Cinematic Studio 3.0: sus seis medidas van de **0,771 a 0,799** (PROCEDENCIA línea 97), que redondeadas son 0,77 y 0,80 (difieren 0,03). La banda de ±0,03 va centrada en el promedio de las seis (0,784) y las contiene a todas. |
| G9 | «0,66: se parece poco.» | «0,66: bajo el piso.» (3) | 0,658 está bajo el piso de 0,70, pero muy sobre otras personas (caras negativas: máx. 0,224) y la cara de F se parece a la de A: «se parece poco» decía más que el número. «Bajo el piso» es lo que mide el original; sobre el cuadro con zoom F mide 0,676-0,679 (fuente 0,690-0,697): la misma variación de la razón 2. |
| G10 | «¿Cómo sé que esta es ella?» | «¿Cómo sé que sigue siendo ella?» (6) | «Esta» no decía a qué se refería; «sigue siendo» pone la apuesta (una imagen de IA puede dejar de ser ella). |
| G11 | letrero inventado difuminado sin avisar | se agrega en pantalla «Lo difuminé: lo inventó el motor.» junto al aro; el aro cubre TODO lo difuminado (el letrero y el trazo más débil de la fachada) | El espectador veía un borrón y podía creer que era del video original. El difuminado se dice en pantalla. G2 NO se tocó: la decisión de si G2 también se difumina es de la madre. |
| G12 | «Esa variación es ruido (±0,03).»; nota «Bajo 200 px, el medidor no es fiable.»; llamada «Lo difuminé: lo inventó la IA.» | **«Esa variación cabe en ±0,03.»** (5); nota **«Bajo 200 px, el medidor avisa: lo reviso a ojo.»**; llamada **«Lo difuminé: lo inventó el motor.»** (y en el pie: «y eso cabe en ±0,03») | Revisión 2 (R2-1 a R2-3): con un solo clip no se afirma causa (parte del rango puede ser cambio real de imagen: en el Cinematic Studio 3.0 el plano se acerca); «no es fiable» era más fuerte que la regla del gate; «la IA» se confundía con «personaje IA». |
| G7 | las tarjetas de «Paso 1» (6-15 s), «Paso 2» (15-24 s), «Ejemplos» (24-33 s), «Paso 3» (33-45 s), «Lección» (45-52 s), «Cierre» (52-56 s) | Paso 1 6,0-11,5 · Paso 2 11,5-21,0 · Ejemplos 21,0-30,0 · Paso 3 30,0-48,5 · Lección 48,5-53,5 · Cierre 53,5-57,5 (**57,5 s**) | Paso 3 necesita 18,5 s para que se lea cada razón con su nota (el guion le daba 12); se le sacó tiempo al Paso 1 y a la lección, que son más simples. |
| G8 | Cierre «Foto A o clip K1 de 0 a 3 s» | Foto K4·5 (Lucía mira a cámara y sonríe), 4 s | La foto A la muestra mirando el celular: el último cuadro no debe dejarla mirando a otro lado sin motivo (ya lo hizo G4). |

## Estructura (57,5 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | Foto A (K1) a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 3,0 s | «¿Cómo sé que sigue siendo ella?» |
| 3 – 6 | Gancho | Misma foto; la caja de la cara medida entra a 3,3 s con «parecido 0,81» | «Con un número. Y con ojo.» |
| 6 – 11,5 | **Paso 1** | Las 8 referencias oficiales (4x2) | «1 · Ocho fotos oficiales.» → «Su cara oficial, fija.» |
| 11,5 – 21 | **Paso 2** | Las 8 en fila → la escala 0-1 con «idéntica · 1» y la marca «mi piso · 0,70» | «2 · Un programa las compara.» → «Un número, de 0 a 1.» → «Idéntica es 1.» → «Piso, 0,70. Lo elegí yo.» |
| 21 – 30 | Ejemplos | Seedream 4.5 0,81 (sobre el piso), GPT Image 2.5 0,66 (bajo el piso), Kling O1 Image del café 0,35 (otra persona), cada una con su caja de cara y «parecido» | «0,81: es ella.» → «0,66: bajo el piso.» → «0,35: otra persona.» |
| 30 – 48,5 | **Paso 3 · el crítico** | Razón 1: cuadro del clip crudo con la cara de 89 px, su caja y una lupa · Razón 2: la escala ampliada «Zoom: 0,70 a 0,90» con la marca «mi piso · 0,70», las dos puntas del MISMO clip del Cinematic Studio 3.0 (0,77 y 0,80) y la banda ±0,03 · Razón 3: el cuadro del clip con el letrero inventado (difuminado con pluma), el aro sobre lo difuminado y «parecido 0,80» | «3 · Desconfiá del número.» → «Cara chica: lo reviso a ojo.» (nota: «Bajo 200 px, el medidor avisa: lo reviso a ojo.») → «Mismo clip: de 0,77 a 0,80.» → «Esa variación cabe en ±0,03.» → «No ve letreros inventados.» (en pantalla: «Lo difuminé: lo inventó el motor.»; nota: «El programa solo compara caras.») |
| 48,5 – 53,5 | Lección | Las tres razones juntas (cara chica · «Mismo clip: 0,771-0,799» · letrero inventado), cada una con su miniatura; una caja las rodea | «Por eso, mirá la imagen entera.» |
| 53,5 – 57,5 | **CIERRE** | Foto K4·5 | «Seguime: cada semana, una prueba.» |

- **Tiempos de las tarjetas:** ≥ 0,35 s por palabra + 0,3 s + 0,1 s de margen (lo valida `build.mjs`). Todo texto que no es tarjeta cumple 0,35 s por palabra + 0,3 s.
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Evidencia (todo ya medido salvo la prueba de control de la razón 1)

| Dato en pantalla | De dónde sale |
|---|---|
| 8 referencias oficiales; piso 0,70 | skill `lucia` §0-quater; `v4/qa/manifest-escenas-seedream-20260930.json` |
| A 0,81 · F 0,66 · B del café 0,35 | `v4/PROCEDENCIA.jsonl` línea 97 (0,806 · 0,658 · 0,350); mismos archivos que G4 |
| «Cara chica: lo reviso a ojo» (89 px) | `PROCEDENCIA` línea 97 nota del Kling O3 («cara de 89 a 168 px»); cuadro 0 del clip (SCRFD: 89 px); regla del gate: < 200 px no se da por fiable. **No se afirma que el número baje ni que no baje de más**: ese cuadro dio 0,798; control: `qa/cara-chica-control.txt` (−0,004 a −0,010 a 60 px en 5 de 6 fotos, F ±0,02) |
| «Mismo clip: de 0,77 a 0,80» → «Esa variación cabe en ±0,03» | Cinematic Studio 3.0 de G2, `PROCEDENCIA` línea 97: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771 → mínimo 0,771 (0,77), máximo 0,799 (0,80), rango 0,028; promedio 0,784 y las seis dentro de ±0,03 de él; sync_so: mayor diferencia entre un clip y su remapeo, 0,024. **±0,03 es un tamaño aproximado del ruido, no un intervalo de confianza** (el video ya no usa «orden de magnitud») |
| «0,80» junto al letrero inventado | Seedance 2.0 Mini + referencias de G2 a 4,0 s: 0,796 (PROCEDENCIA); nota «reencuadra… e inventó un letrero en la torre» |

- **Lo que el video NO afirma:** que 0,70 sea una frontera objetiva (es una decisión: «Lo elegí yo»); que ±0,03 sea una cota exacta ni un intervalo de confianza; que el programa «reconozca a una persona» (solo compara
  dos caras); **que una cara chica haga bajar el número de forma apreciable** (la caída medida es de 0,004-0,010) **ni que no lo haga**: dice que bajo 200 px el medidor avisa y que la imagen se mira a ojo.
- **La foto de Kling O1 Image del café no es Lucía:** se rotula «Kling O1 Image · café».
- **El letrero del cuadro del Seedance 2.0 Mini + referencias está difuminado con pluma** (sigma 3,5): sin difuminar se lee «DMSS»/«DVOSS» y podría confundirse con una marca real. **Se dice en pantalla** («Lo difuminé: lo inventó el motor.») y el aro cubre todo lo difuminado. G2 no se tocó (la madre decide si G2 también se difumina).

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Así mido si una cara sigue siendo la suya: ocho fotos oficiales, un programa
que las compara y da un número de 0 a 1, y un piso de 0,70 que elegí yo. Y tres razones para no creerle del todo: con una cara chica lo reviso a ojo,
el mismo clip varía de 0,77 a 0,80 y eso cabe en ±0,03, y el número no ve los letreros inventados. Por eso se mira la imagen entera. Cada semana hago una prueba.
Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, a 40 px, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas.
- **Sin producto, sin logos ni capturas de terceros** en pantalla ni en el pie (las herramientas se nombran como uso propio, D-N1).
- **Antes de renderizar:** `grep` contra la lista de `editor-videos` § «Reels de Lucía» y el QA de `montaje-hyperframes.md` §4 (`scripts/grep-prohibidas.mjs`).
