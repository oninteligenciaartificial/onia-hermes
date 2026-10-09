# G5 · «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — guion para validar (9-oct-2026)

> **Estado: PARA VALIDAR por la madre. No se monta hasta que valide el de G4** (G5 reusa su método y sus fotos).
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Regla de estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja algo aprendido.
> - **Costo: 0 cr.** Solo usa fotos y clips ya pagados el 8-oct y las mediciones guardadas. No muestra ni promete ninguna función de Onia.
> - **Sin nombres de terceros:** el medidor se llama «un programa que compara caras»; los motores, «Imagen A-F» y «Motor 1-6» como en G2 y G4.

## Qué aprende quien lo ve

**Cómo comprobar que una cara hecha con IA sigue siendo la misma, y por qué no hay que fiarse de un solo número**: ocho fotos de referencia,
un número de 0 a 1, un piso que se elige (0,70), y tres razones para desconfiar (cara chica, ruido de unos ±0,03, y que el número
no ve el fondo). Es el control con el que se midieron los demás videos de la serie.

## Molde

`FORMULAS-REFERENTES.md` **F7**: receta en 3 pasos con el paso crítico marcado. Acá el paso crítico es el 3, «desconfiá del número».

## Estructura (56 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | Foto A (K1) a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | «¿Cómo sé que esta cara es ella?» |
| 3 – 6 | Gancho | Misma foto | «Con un número. Y con ojo.» |
| 6 – 15 | **Paso 1** | Tira de 5 de las 8 fotos oficiales (recortes de cara) | «1 · Ocho fotos oficiales.» → «Su cara de verdad, fija.» |
| 15 – 24 | **Paso 2** | Escala 0-1 con la marca en 0,70 | «2 · Un programa las compara.» → «Da un número, de 0 a 1. Idéntica es 1.» → «Piso, 0,70. Lo elegí yo.» |
| 24 – 33 | Ejemplos | Tres fotos con su número: A 0,81 (sobre el piso), F 0,66 (bajo el piso), B del café 0,35 (otra persona) | «0,81: es ella.» → «0,66: se parece poco.» → «0,35: otra persona.» |
| 33 – 45 | **Paso 3 · el crítico** | Tres imágenes, una por razón: una cara de 89 px del clip crudo; dos medidas 0,79 y 0,77 sobre la escala; el letrero inventado de la torre del Motor 4 con un aro | «3 · Desconfiá del número.» → «Cara chica: baja sola.» → «Una diferencia de 0,03 no cuenta.» → «No ve letreros inventados.» |
| 45 – 52 | Lección | Placa de las tres razones juntas | «Por eso, siempre, mirá la imagen entera.» |
| 52 – 56 | **CIERRE** | Foto A o clip K1 de 0 a 3 s | «Seguime: cada semana, una prueba.» |

- **Tiempos de las tarjetas:** ≥ 0,35 s por palabra + 0,3 s (se mide con `hueco-tarjetas.mjs`).
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Evidencia (todo ya medido; ninguna cifra nueva)

| Dato en pantalla | De dónde sale |
|---|---|
| 8 referencias oficiales; piso 0,70 | skill `lucia` §0-quater; `v4/qa/manifest-escenas-seedream-20260930.json` |
| A 0,81 · F 0,66 · B café 0,35 | `v4/PROCEDENCIA.jsonl` línea 97; mismos archivos que G4 |
| «Cara chica: baja sola» (89 px) | `v4/PROCEDENCIA.jsonl` línea 97 nota del Motor 5 («cara de 89 a 168 px») y skill §0-quater («menos de 200 px es poco confiable») |
| «Una diferencia de 0,03 no cuenta» | G2: Motor 6 0,79 → 0,77; sync_so «dif ≤ 0,03» (skill §0-quater). El ±0,03 es un orden de magnitud, no un intervalo de confianza |
| Letrero inventado | Motor 4 de G2 («DAISS»), ya con aro en `videos/lucia-g2/` |

- **Lo que el video NO debe afirmar:** que 0,70 sea una frontera objetiva (es una decisión) ni que ±0,03 sea una cota exacta; ni que el programa
  «reconozca a una persona»: solo compara dos caras.
- **El ejemplo B del café es una imagen de IA que no se parece a Lucía:** se rotula «Imagen B · café · 0,35», no se la hace pasar por ella.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Así mido si una cara sigue siendo la suya: ocho fotos oficiales, un programa
que las compara y da un número de 0 a 1, y un piso de 0,70 que elegí yo. Y tres razones para no creerle del todo: una cara chica baja sola,
una diferencia de 0,03 no cuenta y el número no ve los letreros inventados. Por eso se mira la imagen entera. Cada semana hago una prueba.
Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas.
- **Sin producto y sin marcas de terceros** en pantalla ni en el pie (el medidor no se nombra).
- **Antes de renderizar:** `grep` contra la lista de `editor-videos` § «Reels de Lucía» y el QA de `montaje-hyperframes.md` §4.
- **Publicación:** como no muestra ni promete una función del producto ni nombra a terceros, pasa por el control de calidad y se publica
  sin pedir el OK pieza por pieza (`CLAUDE.md`). Después se le avisa a Sergio Urcullo con el enlace.
