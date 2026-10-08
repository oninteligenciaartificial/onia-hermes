# G1 · «Este video no fue grabado: así se hace, en 3 pasos» — guion para validar (8-oct-2026)

> **Estado: PARA VALIDAR por la madre. No se edita hasta su OK.**
> - **Premisa nueva (Sergio Urcullo, 8-oct):** *«Lucía no es necesario que muestres el producto, recordá que sos una
>   influencer. Grabar y aprender a usar Higgsfield: esa es tu tarea.»*
> - **Regla de estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja
>   algo aprendido.
> - **Costo: 0 cr.** Solo usa clips y fotos ya pagados. No muestra ni promete ninguna función de Onia.
> - Reemplaza al guion de producto, que quedó en pausa: `G-producto-1-recordatorio-de-cita.md`.

## Qué aprende quien lo ve

**Cómo se hace un video con IA, en 3 pasos: una foto fija con la cara, una orden corta que dice movimiento, cámara y
luz, y una revisión cuadro por cuadro.** Y cuánto cuesta cada paso. Todo con datos reales de los videos de Lucía.

## Molde

`hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`:
- **F7**, receta en N pasos con el paso crítico marcado: se promete el número y se muestran todos.
- **Erik Taveras:** publica el prompt íntegro. Acá se muestra la orden real que dio el clip.
- **No es** una venta de curso ni «creá tu influencer IA»: la IA hace de tema, no de producto.

## Estructura (56 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0 – 3 | **GANCHO** | Clip K1 (Lucía mira el celular, levanta la vista y sonríe). Rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | «Este video no fue grabado.» |
| 3 – 6 | Gancho | Sigue el clip K1 (6,04 s en total) | «Así se hace, en 3 pasos.» |
| 6 – 16 | **DESARROLLO · paso 1** | La foto K1 que dio origen al clip, fija | «1 · Una foto fija.» → «Primero la cara, siempre igual.» · etiqueta de dato: «Imagen · 1 crédito» |
| 16 – 31 | **Paso 2** | Foto K1 de fondo y panel con la **orden real completa** (31 palabras, en inglés, tal como se la dio al motor) | «2 · Una orden corta.» (16–19,5) → panel «Orden real» (19,5–31) con tres marcas sobre el mismo texto: «movimiento» (primera frase), «cámara» (*handheld*) y «luz» (*natural morning light*) |
| 31 – 45 | **Paso 3 · el crítico** | Pantalla partida: foto K1 arriba, clip K1 abajo; después clip K4 (la mano y los dedos), cuadros 0-96 | «3 · Y la foto se mueve.» (etiqueta «Video 6 s · 7,5 créditos») → «Después, se mira cuadro por cuadro.» → «Cuadro 60: cinco dedos.» (recorte ampliado de la mano, sobre el clip) |
| 45 – 50 | Dato | Foto K2 (café) | «Foto y clip: 8,5 créditos.» |
| 50 – 56 | **CIERRE** | Clip K2 (deja el café y mira a cámara) | «Foto, orden y revisión.» → «Seguime: cada semana, una prueba.» |

- **Tiempos de las tarjetas** (todas pasan 0,35 s por palabra + 0,3 s, medido con un script el 8-oct): 0,1–3 · 3–6 · 6–10 ·
  10–16 · 16–19,5 · 31–35 · 35–41 · 41–45 · 45–50 · 50–53 · 53–56.
- **Excepción a validar: el panel «Orden real» no es una tarjeta narrativa.** Es una cita literal del prompt (31 palabras,
  más que las 6 de una tarjeta). Por eso tiene 11,5 s (19,5–31): la lectura exige 31 × 0,35 + 0,3 = 11,15 s. Si la madre
  prefiere que cumpla las 6 palabras, se muestra solo «movimiento · cámara · luz» con las tres frases clave.
- **Duración de los clips:** K1, K2 y K4 duran 6,04 s. G1 usa K1 de 0 a 6 s en el gancho y de 31 a 35 s en la pantalla
  partida, K4 de 41 a 45 s (cuadros 0 a 96) y K2 de 50 a 56 s; ninguno se estira ni se acelera.
- **Material ya pagado:**
  - clips K1 `e470ef4f`, K2 `83130c4a` y K4 `338b751f` (Kling, 6 s);
  - fotos K1 `4afffb96` y K2 `3e05cfd0`.
- **Datos reales** (`v4/PROCEDENCIA.jsonl` y `get_cost`, 5-8 oct):
  - foto: 1 crédito;
  - clip de 6 s: 7,5 créditos;
  - unidad foto + clip: 8,5 créditos. La tarjeta dice «foto y clip», no «este video», porque este video junta varios clips;
  - la orden del panel es el prompt **literal** del clip K1, job `e470ef4f-5464-478e-8b60-44c6493dc547` (Kling std, sin
    sonido, 6 s), guardado el 8-oct en `v4/PROCEDENCIA.jsonl` línea 95:
    *«She slowly lifts her eyes from the phone to the camera and gives a small knowing smile, the phone stays in her hands.
    Subtle handheld camera, natural morning light, no cuts.»*;
  - K4, revisado el 8-oct a resolución completa (hoja `v4/kit/k4-revision-manos-20261008.jpg`, `PROCEDENCIA.jsonl` línea 94):
    **cinco dedos contables en los cuadros 0, 60, 112 y 120**. De 72 a 104 el dedo de la otra mano toca o tapa la mano abierta
    y no se cuenta. La tarjeta pega el número al cuadro 60 (el que entra en el tramo de 0 a 96) y no dice «el clip tiene cinco
    dedos». El conteo previo de 9 cuadros (0,2–5,2 s) no se había hecho cuadro a cuadro.
- **Sin marcas de terceros** en pantalla ni en el pie: dice «imagen» y «video», no el nombre de los modelos ni de la
  plataforma (`CLAUDE.md` § «Qué se publica sin preguntar»).
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Este video no fue grabado: cada clip salió de una foto y una orden
corta. Primero una foto fija con la cara. Después una orden corta que dice movimiento, cámara y luz. Y al final se mira
cuadro por cuadro: manos, cara, letreros. Una foto cuesta 1 crédito y un clip de 6 segundos, 7,5. Cada semana hago una
prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión. No dice que estuvo en un lugar real.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** La única cifra es el costo medido de la foto y el clip.
- **Sin producto:** no nombra ni muestra ninguna función de Onia. `@oniahq` aparece solo como quien creó el personaje.
- **Antes de renderizar:** `grep` del guion y del pie contra la lista de `editor-videos` § «Reels de Lucía», y el QA
  completo de esa receta (cuadro 0, cada entrada, último cuadro, texto debajo del mentón + 40 y sobre y=1490).
- **Publicación:** como no muestra ni promete ninguna función del producto, pasa por el control de calidad y se publica sin
  pedir el OK pieza por pieza (`CLAUDE.md` § «Qué se publica sin preguntar»). Después se le avisa a Sergio Urcullo con el
  enlace. La vía real es `ig-reel.mjs --cuenta lucia`, que corre en el VPS: la madre.

## Lo que sigue (mismas reglas, para los otros videos)

- **G2 · «La misma foto, 4 motores de video»** (formato F4 «así no / así sí»): usa el lote de aprendizaje L1 (`PLAN.md` §3).
  Los motores van como «Motor 1 a 4», sin marca, salvo que Sergio Urcullo dé el OK para nombrarlos. **Necesita su OK al
  costo.**
- **G3 · «Tres errores de la IA que atrapé antes de publicar»** (formato F3 «caso real → error → corrección → regla»), con
  0 cr: el guion está en `G3-tres-errores-de-la-ia.md` (letrero inventado, letra que no dice nada y mano que tapa a la otra).
