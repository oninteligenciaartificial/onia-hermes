# G3 · «Tres errores de la IA que atrapé antes de publicar» — guion para validar (8-oct-2026)

> **Estado: PARA VALIDAR por la madre. No se edita hasta su OK.**
> - **Premisa (Sergio Urcullo, 8-oct):** Lucía es influencer y aprende Higgsfield; no muestra el producto.
> - **Regla de estructura (Sergio Urcullo, 8-oct):** gancho en 3 s · desarrollo con valor · cierre con CTA · 30-60 s · deja
>   algo aprendido.
> - **Costo: 0 cr.** Solo usa fotos y un clip ya pagados. No muestra ni promete ninguna función de Onia.

## Qué aprende quien lo ve

**Tres cosas que revisar en una imagen hecha con IA antes de usarla: el fondo (no solo la cara), el texto que parece
escrito y las manos que se tapan.** Cada una con un caso real, su corrección y una regla de una línea.

## Molde

`hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`: **F3** (caso → error → corrección → regla), repetido tres
veces con el mismo orden para que se aprenda el patrón.

## Evidencia (todo en el repo, mirado el 8-oct)

| # | Caso | Prueba | Corrección |
|---|---|---|---|
| 1 | Foto K4·1 **descartada**, job `6708e444`: en la torre del fondo apareció un letrero con un nombre inventado («Equperarto»). El prompt decía «no text, no logos, no signs anywhere» | `v4/kit/k4-1-DESCARTADA-6708e444.jpg` (bajada de Higgsfield por `rawUrl`, 0 cr). La cara midió **0,835** (gate ≥ 0,70): aprobada por cara, mala por fondo. `PROCEDENCIA.jsonl` línea 93 | Se descartó (1 cr) y se generó otra, K4·1 `eddca486`, sin letrero: `v4/kit/k4-1-saluda-eddca486-recorte.jpg` |
| 2 | Foto K2·2 **agenda de papel**, job `1422fa94`: la letra del cuaderno y de los papelitos parece escrita pero no dice nada | `v4/kit/k2-2-agenda-papel-1422fa94.jpg`; el veredicto de `PROCEDENCIA.jsonl` ya decía «letra de la agenda ilegible» | No se usa para mostrar ningún dato; solo de plano de apoyo, sin acercar a la letra |
| 3 | Clip K4 **cuenta dedos**, job `338b751f`: de los cuadros 72 a 96 la otra mano tapa a la mano abierta y los dedos no se pueden contar | `v4/kit/k4-clip-cuenta-dedos-338b751f.mp4`, revisado a resolución completa: cuadros 0 y 60, cinco dedos contables | La tarjeta pega el número al cuadro 60. El conteo previo de 9 cuadros era histórico y Codex no lo daba por exacto |

## Estructura (58 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (voseo cruceño; ≤ 6 palabras por tarjeta) |
|---|---|---|---|
| 0,1 – 3 | **GANCHO** | La foto descartada a pantalla completa; rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | «Tres errores de la IA.» |
| 3 – 6 | Gancho | Misma foto; a 4 s aparece un aro verde sobre el letrero de la torre | «Los atrapé antes de publicar.» |
| 6 – 23 | **ERROR 1 · el fondo** | Foto descartada, con el aro sobre el letrero. Etiqueta de dato «Cara: 0,835 · aprobada» desde 14,5 s. De 19 a 23 pantalla partida: descartada / la foto buena sin letrero | «1 · Un letrero que no pedí.» → «La orden decía: sin letreros.» → «Escribió uno igual.» → «Descartada. Una foto, 1 crédito.» |
| 23 – 27 | Regla 1 | Foto buena K4·1 (sin letrero) | «Regla: mirar también el fondo.» |
| 27 – 40 | **ERROR 2 · la letra** | Foto de la agenda (K2·2); a 31 s un recorte ampliado de la letra | «2 · Letra que no dice nada.» → «Parece escrita. No se lee.» → «Si no se lee, no sirve.» |
| 40 – 52 | **ERROR 3 · la mano** | Clip K4: de 40 a 48,5 s el tramo con la otra mano tapando; a 48,5 s un recorte ampliado de la mano en el cuadro 60 | «3 · Una mano tapa la otra.» → «Así no se cuentan dedos.» → «Cuadro 60: cinco dedos.» |
| 52 – 54,5 | Regla 3 | Sigue el clip K4 | «Solo cuento lo que se ve.» |
| 54,5 – 58 | **CIERRE** | Clip K1 (Lucía mira a cámara y sonríe) | «Seguime: cada semana, una prueba.» |

- **Tiempos de las tarjetas** (todas pasan 0,35 s por palabra + 0,3 s, medido con un script el 8-oct): 0,1–3 · 3–6 · 6–10 ·
  10–14,5 · 14,5–19 · 19–23 · 23–27 · 27–31 · 31–35,5 · 35,5–40 · 40–44 · 44–48,5 · 48,5–52 · 52–54,5 · 54,5–58.
- **Sin marcas de terceros** en pantalla ni en el pie. El letrero de la torre es texto inventado por la IA («Equperarto»);
  la madre lo mira antes de editar por si se parece a una marca real y, si se parece, se tapa con el aro y el recorte.
- **Sin voz** (D4) y sin música: la pone Sergio Urcullo.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Estos tres errores salieron en mis pruebas y los atrapé antes de
publicar: un letrero que nadie pidió en el fondo de una foto, una letra que parece escrita pero no dice nada, y una mano que
tapa a la otra y no deja contar los dedos. Lo que hago: miro el fondo y no solo la cara, no uso un texto que no se lee y
cuento solo lo que se ve. Cada semana hago una prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** el ambo es vestuario y ninguna frase habla de profesión.
- **Sin promesas ni resultados, sin testimonios, sin clientes.** Las únicas cifras son medidas: 0,835 de cara, 1 crédito por
  foto, cuadro 60.
- **Sin producto:** no nombra ni muestra ninguna función de Onia.
- **Antes de renderizar:** `grep` del guion y del pie contra la lista de `editor-videos` § «Reels de Lucía», y el QA
  completo de esa receta (cuadro 0, cada entrada, último cuadro, texto debajo del mentón + 40 y sobre y=1490). Aquí el
  texto va sobre fotos de fondo claro (la torre, el mármol): se prueba la legibilidad con velo oscuro debajo.
- **Publicación:** como no muestra ni promete una función del producto ni nombra a terceros, pasa por el control de calidad y
  se publica sin pedir el OK pieza por pieza (`CLAUDE.md` § «Qué se publica sin preguntar»). Después se le avisa a Sergio
  Urcullo con el enlace. La vía real es `ig-reel.mjs --cuenta lucia`, que corre en el VPS: la madre.
