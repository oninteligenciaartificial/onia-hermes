# G2 · «La misma foto, seis clips: ¿quién pierde la cara?» — guion para validar (8-oct-2026)

> **Estado: PARA VALIDAR por la madre. No se publica sin su aviso.**
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Regla de estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja algo aprendido.
> - **Costo: 0 cr más.** Los 6 clips ya se generaron y se pagaron el 8-oct (lote V, 47 cr; Sergio Urcullo: *«tenés derecho a usar todo
>   lo que querrás»*, con tope de 97 cr que se fijó la sesión). Registro: `v4/PROCEDENCIA.jsonl`, últimas líneas.
> - No muestra ni promete ninguna función de Onia. Sin marcas de terceros: los motores van como «Motor 1 a 6».

## Qué aprende quien lo ve

**Que un clip hecho a partir de una foto pierde el parecido con el personaje a medida que se mueve, que las fotos de referencia
lo sostienen pero hacen que el motor invente la escena, y que pagar más no lo arregla.** Con la misma foto, la misma orden y
cuánto cuesta cada clip, medido con una regla que cualquiera puede entender.

## Molde

`FORMULAS-REFERENTES.md` **F4**: misma tarea en varios niveles, «así no / así sí». La tarea es una: *«She slowly lifts her eyes from
the phone to the camera and gives a small knowing smile…»* sobre la foto K1.

## Evidencia (medida el 8-oct con `scripts/face-gate.sh`, 8 referencias oficiales; gate 0,70; una toma por clip)

| Clip | Créditos | Parecido t=0 | a mitad | al final (5,9 s) | Se ve en los cuadros |
|---|---:|---:|---:|---:|---|
| Motor 1 (`start_image`, el clip K1 ya pagado) | 7,5 | 0,79 | 0,73 | 0,72 | Misma escena que la foto; la cara pierde parecido sola |
| Motor 2 (el mismo, versión «pro») | 9 | 0,81 | 0,77 | 0,74 | Mismo movimiento que el 1, más nítido (1080p) |
| Motor 3 (`start_image`, otro modelo barato) | 6 | 0,69 | 0,63 | 0,64 | Misma escena; la cara queda **bajo el piso** |
| Motor 4 (`start_image` + 3 fotos de referencia) | 6 | 0,71 | 0,73 | 0,80 | Sube; pero el plano se acerca (la cara crece 2,5 veces) y **aparece un letrero inventado** en la torre |
| Motor 5 (solo 5 fotos de referencia, sin foto de arranque) | 6 | 0,80 | 0,81 | 0,82 | Sostiene la cara; **inventó otro cuarto** y un plano que se acerca |
| Motor 6 (`start_image`, 4 s a 720p) | 20 | 0,79 | 0,79 | 0,77 | Estable, pero 4 veces el precio del Motor 1 |

- Fuente de los números: `v4/PROCEDENCIA.jsonl` (línea «resultados» del 8-oct), clips en `v4/prueba-motores-20261008/` (proxies 360p y
  hojas `hojas/comparativo-v1.jpg` y `comparativo-v2.jpg`). Los originales se recuperan con `job_display` a 0 cr.
- **Lo que el video NO debe afirmar:** que un motor sea «mejor» en general (es una toma por motor) ni que 0,70 sea una
  frontera objetiva. El pie y una tarjeta lo dicen: *«Una toma cada uno: es una prueba, no una regla.»* Las caras miden entre 89 y 180 px
  en el clip crudo (poco confiable según el propio gate): se muestra el número como orientativo.

## Estructura (58 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | Foto K1 fija a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | «Misma foto. Seis clips.» |
| 3 – 6 | Gancho | La misma foto; entran las 6 miniaturas de los clips en una fila | «¿Quién pierde la cara?» |
| 6 – 12 | **REGLA** | Una muestra de las 8 fotos de referencia de la cara en tira y una escala de 0 a 1 con la marca en 0,70 | «Se mide contra 8 fotos suyas.» → «Idéntica es 1. Piso, 0,70.» |
| 12 – 17 | Motor 1 | Clip del Motor 1 a velocidad 1× (5 s) con el parecido al principio y al final | «Motor 1 · 7,5 créditos» · dato «0,79 → 0,72» |
| 17 – 22 | Motor 2 | Clip del Motor 2 | «Motor 2 · 9 créditos» · dato «0,81 → 0,74» |
| 22 – 27 | Motor 3 | Clip del Motor 3 | «Motor 3 · 6 créditos» · dato «0,69 → 0,64» · sello «bajo el piso» |
| 27 – 32 | **Lección 1** | Placa con los tres arranques y los tres finales | «Atado a la foto: baja.» |
| 32 – 37 | Motor 4 | Clip del Motor 4; aro sobre el letrero inventado | «Motor 4 · 6 créditos · con referencias» · dato «0,71 → 0,80» |
| 37 – 42 | Motor 5 | Clip del Motor 5 | «Motor 5 · 6 créditos · solo referencias» · dato «0,80 → 0,82» |
| 42 – 47 | Motor 6 | Clip del Motor 6 (4 s) | «Motor 6 · 20 créditos» · dato «0,79 → 0,77» |
| 47 – 54,5 | **Lección 2** | Placa con los seis finales ordenados | «Con referencias, la cara se sostiene.» → «Pero el motor inventa la escena.» |
| 54,5 – 58 | **CIERRE** | Clip K1 de 0 a 3,5 s (Lucía mira a cámara y sonríe) | «Seguime: cada semana, una prueba.» |

- **Duración de los clips:** el Motor 6 dura 4,04 s; los otros cinco 6,04 s. Cada uno va a 1×, sin acelerar, estirar ni congelar.
  Los segmentos de 5 s cubren de 0 a 5 s del clip (el Motor 6, 4 s: el último segundo es una placa del puntaje final).
- **Tiempos de las tarjetas** (todas pasan 0,35 s por palabra + 0,3 s, medido con un script el 8-oct): 0,1–3 · 3–6 · 6–9,5 · 9,5–12 ·
  12–17 · 17–22 · 22–27 · 27–32 · 32–37 · 37–42 · 42–47 · 47–51 · 51–54,5 · 54,5–58. Los datos («0,79 → 0,72») son
  etiquetas de dato, no tarjetas narrativas.
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Probé la misma foto y la misma orden en seis clips distintos y medí
cuánto se parece la cara a ella al principio y al final. Los clips atados a la foto de arranque pierden parecido; los que usan
fotos de referencia lo sostienen, pero inventan la escena. Una toma por clip: es una prueba, no una regla. Cada semana hago una
prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas (créditos cobrados y parecido).
- **Sin producto y sin marcas de terceros** en pantalla ni en el pie (nada de nombres de modelos o plataformas).
- **El letrero inventado del Motor 4** es texto de la IA («DAISS»): se marca con un aro y se dice que es inventado; si la madre ve
  parecido con una marca real, se tapa.
- **Antes de renderizar:** `grep` del guion y del pie contra la lista de `editor-videos` § «Reels de Lucía», y el QA del método
  (`montaje-hyperframes.md` §4). Método de montaje: el de G1 (`videos/lucia-g1/` como plantilla).
- **Publicación:** como no muestra ni promete una función del producto ni nombra a terceros, pasa por el control de calidad y se
  publica sin pedir el OK pieza por pieza (`CLAUDE.md` § «Qué se publica sin preguntar»). Después se le avisa a Sergio Urcullo con el
  enlace. La vía real es `ig-reel.mjs --cuenta lucia`, que corre en el VPS: la madre.
