# G5 · «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — guion CORREGIDO por el montaje (9-oct-2026)

> **Qué es este archivo.** El guion del repo (`hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`) **no se tocó** (el editor solo escribe en
> `videos/lucia-g5/`). Este es el guion con las correcciones que el montaje necesitó; **la madre lo pasa a ese archivo** (o lo rechaza y se revierte con `plan.json →
> agregados_al_guion`). `build.mjs` genera `pie.txt` desde el pie de este archivo.
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja algo aprendido.
> - **Costo: 0 cr.** **Sin nombres de terceros:** el medidor es «un programa que compara caras»; los motores, «Imagen A-F» / «Motor 1-6».

## Qué cambió respecto del guion del repo, y por qué

| # | Guion del repo | Corregido | Por qué |
|---|---|---|---|
| G1 | «¿Cómo sé que esta cara es ella?» (7 palabras) | «¿Cómo sé que esta es ella?» (6) | El tope del guion es 6 palabras por tarjeta; el guion se pasaba del suyo. |
| G2 | «Da un número, de 0 a 1. Idéntica es 1.» (10 palabras, una tarjeta) | dos tarjetas: «Un número, de 0 a 1.» (6) → «Idéntica es 1.» (3) | Mismo motivo. |
| G3 | «Por eso, siempre, mirá la imagen entera.» (7) | «Por eso, mirá la imagen entera.» (6) | Mismo motivo; se pierde «siempre» (el cierre «cada semana, una prueba» ya dice que es un hábito). |
| G4 | «Su cara de verdad, fija.» | «Su cara oficial, fija.» | Lucía es un personaje hecho con IA: «de verdad» se lee como «persona real». |
| G5 | **«Cara chica: baja sola.»** (y, en el pie, «una cara chica baja sola») | **«Cara chica: poco confiable.»** (y, en el pie, «con una cara chica el número es poco confiable») | **La afirmación es falsa con los datos guardados y con una prueba de control hecha para G5** (0 cr): en el Motor 5 la cara va de 89 a 168 px y el número va de 0,80 a 0,82 (no baja); y la MISMA foto reducida hasta que la cara mida 60 px baja solo 0,004-0,010 en cinco de seis fotos (la sexta oscila ±0,02), muy bajo los ±0,03 (`qa/cara-chica-control.txt`). Lo que sí se sostiene es la regla del propio gate: bajo 200 px el número se marca «poco confiable» y la imagen se mira a ojo. |
| G6 | «Una diferencia de 0,03 no cuenta» sin más | se agrega en pantalla «±0,03: solo un orden de magnitud.» | El guion mismo dice que ±0,03 no es un intervalo de confianza; sin la nota el espectador lo lee como cota exacta. |
| G7 | las tarjetas de «Paso 1» (6-15 s), «Paso 2» (15-24 s), «Ejemplos» (24-33 s), «Paso 3» (33-45 s), «Lección» (45-52 s), «Cierre» (52-56 s) | Paso 1 6,0-11,5 · Paso 2 11,5-21,0 · Ejemplos 21,0-30,0 · Paso 3 30,0-47,5 · Lección 47,5-53,5 · Cierre 53,5-57,5 (**57,5 s**) | Paso 3 necesita 17,5 s para que se lea cada razón con su nota (el guion le daba 12); se le sacó tiempo al Paso 1 y al 2, que son más simples. |
| G8 | Cierre «Foto A o clip K1 de 0 a 3 s» | Foto K4·5 (Lucía mira a cámara y sonríe), 4 s | La foto A la muestra mirando el celular: el último cuadro no debe dejarla mirando a otro lado sin motivo (ya lo hizo G4). |

## Estructura (57,5 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | Foto A (K1) a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 3,0 s | «¿Cómo sé que esta es ella?» |
| 3 – 6 | Gancho | Misma foto; la caja de la cara medida entra a 3,3 s con «parecido 0,81» | «Con un número. Y con ojo.» |
| 6 – 11,5 | **Paso 1** | Las 8 referencias oficiales (4x2) | «1 · Ocho fotos oficiales.» → «Su cara oficial, fija.» |
| 11,5 – 21 | **Paso 2** | Las 8 en fila → la escala 0-1 con «idéntica · 1» y la marca «mi piso · 0,70» | «2 · Un programa las compara.» → «Un número, de 0 a 1.» → «Idéntica es 1.» → «Piso, 0,70. Lo elegí yo.» |
| 21 – 30 | Ejemplos | Imagen A 0,81 (sobre el piso), Imagen F 0,66 (bajo el piso), Imagen B del café 0,35 (otra persona), cada una con su caja de cara y «parecido» | «0,81: es ella.» → «0,66: se parece poco.» → «0,35: otra persona.» |
| 30 – 47,5 | **Paso 3 · el crítico** | Razón 1: cuadro del clip crudo con la cara de 89 px, su caja y una lupa · Razón 2: la escala ampliada con las medidas 0,79 y 0,77 y la banda ±0,03 · Razón 3: el cuadro del clip con el letrero inventado (difuminado con pluma), su aro y «parecido 0,80» | «3 · Desconfiá del número.» → «Cara chica: poco confiable.» (nota: «Bajo 200 px, lo reviso a ojo.») → «Una diferencia de 0,03 no cuenta.» (nota: «±0,03: solo un orden de magnitud.») → «No ve letreros inventados.» (nota: «El programa solo compara caras.») |
| 47,5 – 53,5 | Lección | Las tres razones juntas, cada una con su miniatura; una caja las rodea | «Por eso, mirá la imagen entera.» |
| 53,5 – 57,5 | **CIERRE** | Foto K4·5 | «Seguime: cada semana, una prueba.» |

- **Tiempos de las tarjetas:** ≥ 0,35 s por palabra + 0,3 s + 0,1 s de margen (lo valida `build.mjs`). Todo texto que no es tarjeta cumple 0,35 s por palabra + 0,3 s.
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Evidencia (todo ya medido salvo la prueba de control de la razón 1)

| Dato en pantalla | De dónde sale |
|---|---|
| 8 referencias oficiales; piso 0,70 | skill `lucia` §0-quater; `v4/qa/manifest-escenas-seedream-20260930.json` |
| A 0,81 · F 0,66 · B del café 0,35 | `v4/PROCEDENCIA.jsonl` línea 97 (0,806 · 0,658 · 0,350); mismos archivos que G4 |
| «Cara chica: poco confiable» (89 px) | `PROCEDENCIA` línea 97 nota del Motor 5 («cara de 89 a 168 px»); cuadro 0 del clip (SCRFD: 89 px); regla del gate: < 200 px = poco confiable. **No se afirma que el número baje**: ese cuadro dio 0,798. Control: `qa/cara-chica-control.txt` |
| «Una diferencia de 0,03 no cuenta» | Motor 6 de G2: 0,785 → 0,771 (0,79 → 0,77, difieren 0,014); sync_so: mayor diferencia entre un clip y su remapeo, 0,024. **±0,03 es un orden de magnitud, no un intervalo de confianza** |
| «0,80» junto al letrero inventado | Motor 4 de G2 a 4,0 s: 0,796 (PROCEDENCIA); nota «reencuadra… e inventó un letrero en la torre» |

- **Lo que el video NO afirma:** que 0,70 sea una frontera objetiva (es una decisión: «Lo elegí yo»); que ±0,03 sea una cota exacta; que el programa «reconozca a una persona» (solo compara
  dos caras); **que una cara chica haga bajar el número** (no se probó; se probó lo contrario).
- **La Imagen B del café no es Lucía:** se rotula «Imagen B · café».
- **El letrero del cuadro del Motor 4 está difuminado con pluma** (sigma 3,5): sin difuminar se lee «DMSS»/«DVOSS» y podría confundirse con una marca real.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Así mido si una cara sigue siendo la suya: ocho fotos oficiales, un programa
que las compara y da un número de 0 a 1, y un piso de 0,70 que elegí yo. Y tres razones para no creerle del todo: con una cara chica el número es poco confiable,
una diferencia de 0,03 no cuenta y el número no ve los letreros inventados. Por eso se mira la imagen entera. Cada semana hago una prueba.
Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, a 40 px, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas.
- **Sin producto y sin marcas de terceros** en pantalla ni en el pie (el medidor no se nombra).
- **Antes de renderizar:** `grep` contra la lista de `editor-videos` § «Reels de Lucía» y el QA de `montaje-hyperframes.md` §4 (`scripts/grep-prohibidas.mjs`).
