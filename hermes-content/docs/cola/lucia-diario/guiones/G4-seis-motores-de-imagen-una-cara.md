# G4 · «Seis motores de imagen, una cara: ¿cuál la conserva?» — guion para validar (9-oct-2026)

> **Estado: PARA VALIDAR por la madre antes del render final.** Se monta igual (0 créditos, cómputo local) para que ella mire el
> preview 360p junto con el guion. No se publica sin su aviso.
> **2da pasada (9-oct):** aplica la revisión independiente (`videos/lucia-g4/qa/revision-1.md`, H1-H7): fotos C y E limpias, el gancho abre con la
> pregunta, la lección 1 trae la nota del ruido, la lección 2 muestra también a A en tres escenas, y el cierre usa una foto donde Lucía mira a cámara.
> El video dura **59,75 s**.
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Regla de estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja algo aprendido.
> - **Costo: 0 cr más.** Las 7 fotos nuevas se pagaron el 8-oct (11,75 cr del lote de aprendizaje, dentro del tope de 97 cr que fijó la
>   sesión) y las tres de Seedream 4.5 ya existían del kit. Registro: `v4/PROCEDENCIA.jsonl` línea 97.
> - No muestra ni promete ninguna función de Onia. Sin marcas de terceros: los motores van como «Imagen A a F».
> - **Nombre corregido:** el 8-oct se dijo «7 motores de imagen» por error; fueron **6 motores** y 7 fotos nuevas (Kling Omni Image se
>   repitió en 3 escenas).

## Qué aprende quien lo ve

**Que pagar más por una foto no la hace más parecida a ella, y que una sola foto buena no prueba nada**: el motor que más cobra
(3 créditos) quedó bajo el piso, el que ya se usa (1 crédito) la sostuvo en las tres escenas, y el más barato (0,5) la perdió en una de tres.
Misma orden, mismas referencias, medido con una regla que cualquiera entiende.

## Molde

`FORMULAS-REFERENTES.md` **F4**: misma tarea en varios niveles, «así no / así sí». La tarea es una: la foto de «Lucía en una recepción mirando el
celular» (K1), con el mismo prompt y las mismas 6 imágenes de referencia en cada motor.

## Evidencia (medida el 8-oct con `scripts/face-gate.sh`, 8 referencias oficiales; piso 0,70; una toma por motor salvo A y B)

| Imagen | Motor (no se nombra en pantalla) | Créditos | Parecido | Archivo |
|---|---|---:|---:|---|
| A | Seedream 4.5 (el método diario) | 1 | 0,81 | `v4/kit/k1-1-recepcion-celular-4afffb96.jpg` |
| B | Kling Omni Image | 0,5 | 0,79 | `v4/prueba-motores-20261008/fotos/img-kling-omni-image-c3706d45.jpg` |
| C | Nano Banana 2.1 | 2 | 0,74 | `…/img-nano-banana-2-1-a4dd1a48.jpg` (en pantalla: la copia **limpia**, `…/fotos-limpias/…-limpia.jpg`) |
| D | Seedream 5.0 Pro | 2,5 | 0,70 | `…/img-seedream-5-pro-b1abe43c.jpg` |
| E | FLUX 3 | 3 | 0,69 | `…/img-flux-3-af9c2d0c.jpg` (en pantalla: la copia **limpia**, `…/fotos-limpias/…-limpia.jpg`) |
| F | GPT Image 2.5 | 2,75 | 0,66 | `…/img-gpt-image-2-5-5da2fa1e.jpg` |

- **Fotos limpias (revisión 1, H1+H2):** en C se veían dos sillones dentales al fondo (da a entender el rubro) y un logo de monitor; en E, un logo en el respaldo del monitor.
  El video usa las copias con desenfoque con pluma de `v4/prueba-motores-20261008/fotos-limpias/` (la cara no se toca; `face-gate`: C 0,726 contra 0,737 del original, E 0,687 contra 0,690).
  Los números en pantalla siguen siendo los del original medido. Los originales quedan en `fotos/` como evidencia.

**Lección 2 — repetir en otra escena (café):**

| Imagen | Escena 2 (café, mostrador) | Escena 3 (café, teclado) | Archivos |
|---|---:|---:|---|
| A | 0,83 | 0,84 | `v4/kit/k2-1-cafe-mostrador-3e05cfd0.jpg`, `v4/kit/k4-3-cafe-teclado-186c82f0.jpg` (valores de `v4/PROCEDENCIA.jsonl` línea 97: 0,830 y 0,839) |
| B | **0,35** (perdió la cara: otra persona, estilo caricatura) | 0,83 | `…/img-omni-image-k2cafe-9f4b5172.jpg`, `…/img-omni-image-k4cafe-dad464de.jpg` |

- La escena 1 de la lección 2 es la recepción de K1: A 0,81 y B 0,79. En pantalla la lección 2 es una tabla: **A 0,81 · 0,83 · 0,84** y **B 0,79 · 0,35 · 0,83**.
- **Lo que el video NO debe afirmar:** que un motor sea «mejor» en general; son una foto por motor (tres para A y B) y el gate tiene ruido de ±0,03.
  El pie y la placa de la lección 1 lo dicen: *«Una toma cada uno: es una prueba, no una regla.»* (en pantalla a 44 px, y debajo: *«Entre 0,66 y 0,70 la diferencia es ruido (±0,03).»*:
  medido sobre el cuadro con zoom, F da 0,685-0,697 y D 0,69-0,70; el ruido es el del método).
- 0,70 no es una frontera objetiva: D (0,702) «cumple por poco» y no se anuncia como aprobado.
- Los nombres de motores no van en pantalla ni en el pie. Se hablan de «Imagen A a F»; la correspondencia está en esta tabla y en el README del proyecto.

## Estructura (59,75 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta, salvo la de la lección 1) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | Foto A a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» **de 0 a 3 s, 40 px** | «¿Cuál conserva su cara?» |
| 3 – 6 | Gancho | La misma foto; entran las 6 miniaturas A-F en una fila | «Misma orden.» → «Seis motores de imagen.» |
| 6 – 12 | **REGLA** | Las 8 fotos de referencia (todas) y la escala de 0 a 1 con la marca en 0,70 | «Se mide contra 8 fotos suyas.» → «Idéntica es 1. Piso, 0,70.» |
| 12 – 17 | Imagen A | Foto A a pantalla completa | «Imagen A · 1 crédito» · dato «parecido 0,81» |
| 17 – 22 | Imagen B | Foto B | «Imagen B · 0,5 créditos» · dato «parecido 0,79» |
| 22 – 27 | Imagen C | Foto C (limpia) | «Imagen C · 2 créditos» · dato «parecido 0,74» |
| 27 – 32 | Imagen D | Foto D | «Imagen D · 2,5 créditos» · dato «parecido 0,70» · «justo en el piso» |
| 32 – 37 | Imagen E | Foto E (limpia) | «Imagen E · 3 créditos» · dato «parecido 0,69» · sello «bajo el piso» |
| 37 – 42 | Imagen F | Foto F | «Imagen F · 2,75 créditos» · dato «parecido 0,66» · sello «bajo el piso» |
| 42 – 49,75 | **Lección 1** | Placa con las 6 ordenadas por precio sobre la escala, y la franja de 0,66 a 0,70 | «Pagar más no la hace más parecida.» (**7 palabras: excepción**; alternativa de 6: «Pagar más no mejora el parecido.») · nota a 44 px «Una toma cada uno: es una prueba, no una regla.» → (a los 45,6 s) «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» |
| 49,75 – 57,25 | **Lección 2** | Tabla **A (0,81 · 0,83 · 0,84)** y **B (0,79 · 0,35 · 0,83)** en tres escenas, y la foto B del café junto a la A del café | «Imagen A: la sostuvo en tres.» → «Una foto sola no mide.» → «El café: B perdió la cara.» (el guion decía «B perdió la cara en el café.»: 7 palabras) |
| 57,25 – 59,75 | **CIERRE** | Foto K4·5 (`v4/kit/k4-5-senala-342c0ab5.jpg`): Lucía mira a cámara y sonríe; ya pagada, sin clips (face-gate 0,832) | «Seguime: cada semana, una prueba.» |

- **Duraciones:** 59,75 s: pasa de 30 y no de 60 (la nota de 19 palabras de la lección 1 y la fila de A en la lección 2 pidieron tiempo; el cierre pasó de 4 a 2,5 s). Las fotos van a pantalla completa con un empuje de 6 cuadros entre una y otra (el método de G2/G3).
- **Tiempos de tarjetas:** ≥ 0,35 s por palabra + 0,3 s (se mide con el script de G2 `hueco-tarjetas.mjs`).
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.
- **Cara bajo el texto:** las fotos A-F tienen la cara en el tercio superior (la del cierre, a media altura: mentón en y≈991 y la tarjeta arranca en 1236); el texto va debajo del mentón + 40 px y sobre y = 1490 (se mide con
  `medir-dom.mjs` y la caja de cara de `scripts/face_identity_qa.py`).

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Probé la misma orden y las mismas fotos de referencia en seis motores de
imagen y medí cuánto se parece cada cara a la de ella. Con 1 crédito, el que ya uso la sostuvo en tres escenas; pagar más no la
mejoró, y el más barato la perdió en una de tres. Una toma cada uno: es una prueba, no una regla. Cada semana hago una prueba.
Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0 hasta los 3 s, a 40 px, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión (las fotos A-F la muestran en ambo en una recepción: no se dice dónde está). **Tampoco la imagen:** nada del rubro a la vista (en C se tapó el consultorio dental del fondo).
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas (créditos cobrados y parecido).
- **Sin producto y sin marcas de terceros** en pantalla ni en el pie, **ni logos incidentales de las fotos** (se difuminaron los de C y E).
- **Foto B del café** (cara perdida): es una imagen de IA que no se parece a Lucía; se rotula «Imagen B · café · 0,35», no se la hace pasar por ella.
- **Antes de renderizar:** `grep` del guion y del pie contra la lista de `editor-videos` § «Reels de Lucía» (`scripts/grep-prohibidas.mjs`), y el QA
  de `montaje-hyperframes.md` §4.
- **Publicación:** como no muestra ni promete una función del producto ni nombra a terceros, pasa por el control de calidad y se publica
  sin pedir el OK pieza por pieza (`CLAUDE.md` § «Qué se publica sin preguntar»). Después se le avisa a Sergio Urcullo con el enlace. La vía real
  es `ig-reel.mjs --cuenta lucia`, que corre en el VPS.
