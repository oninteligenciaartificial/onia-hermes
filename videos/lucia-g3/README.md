# Lucía · G3 «Tres errores de la IA que atrapé antes de publicar» (58 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G3-tres-errores-de-la-ia.md`, con el método de G1
(`.claude/skills/lucia/montaje-hyperframes.md`, `videos/lucia-g1/`). **Costo: 0 créditos** (foto descartada K4·1 `6708e444` bajada en su
resolución original 1440x2560 por la URL pública, foto buena `eddca486`, agenda `1422fa94`, clip K4 `338b751f`, clip K1 `e470ef4f`; todo ya pagado).
**Estado: 2da pasada (8-oct), aplica la revisión independiente de la 1ra (H1-H10, ver «Segunda pasada»). PARA VER POR LA MADRE (preview 360p). No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (queda sitio para la música de Sergio Urcullo; los pops se omiten, ver «Audio»).

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, zonas, costuras, caras medidas, agregados | `plan.json` |
| Generador (descarga/copia el material, valida reglas → escribe `index.html`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Preview 360p (render REAL de HyperFrames a 360x640; también en `qa/`, que sí va a git) | `out/g3-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (ignorado en git) | `out/g3-final-1080x1920.mp4` |
| Pie para publicar (idéntico al del guion, verificado por script) | `pie.txt` |
| QA mirado y medido | `qa/` (hojas `hoja-qa-1/2`, `hoja-costuras`, `hoja-morphs`, `hoja-manos-k4.jpg` (evidencia de H1: cuadros 45-132 de a 3); `zona-segura`, `hueco-tarjetas`, `vacios-y-saltos`, `grep-prohibidas`, `psnr-cuadros-k4`, `face-gate`, `eventos-visuales`, `specs-final`, `hyperframes-check`) |
| Portada sugerida (cuadro a 0,6 s) | `qa/portada-0.6s.jpg` |

## Tabla de cortes (la del guion; **cambiado** y **agregado** marcados)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,1 – 6 | Foto descartada a pantalla completa. **2da pasada (H8): el aro verde entra a 1,5 s** (antes 4,0 s) sobre el letrero. **Cambiado:** el letrero está desenfocado. **2da pasada (H3): a 4,0 s entra un recorte ampliado del letrero (ya difuminado) bajo el aro** (x 480-980, y 300-522; el aro es su recuadro de origen), hasta 9,0 s | rótulo «Lucía Antelo · personaje IA de Onia» 0-2,4 · «Tres errores de la IA.» (0,1-3) · «Los atrapé antes de publicar.» (3-6) · **2da pasada (H2):** etiqueta «Letrero difuminado al editar» 4,0-9,0 (a y=905: el texto no puede ir sobre la cara) |
| 6 – 19,5 | La misma foto (corte de continuidad, solo cambia la tarjeta). El aro se queda | «1 · Un letrero que no pedí.» (6-10; «no pedí.» se enciende a 8,0) · «La orden decía: sin letreros.» (10-14,5; «sin letreros.» a 12,2) · **agregado:** etiqueta «Orden: «no signs anywhere»» (10,5-14,5, fragmento literal del prompt, `PROCEDENCIA.jsonl` l. 95) · «Escribió uno igual.» (14,5-19,5, **cambiado:** el guion la cierra a 19,0) · etiqueta «Cara: 0,835 · aprobada» desde 14,5 + marco de esquinas en la cara a 14,6 · **agregado:** «Fondo: letrero inventado (difuminado)» (16,7-19,0; **2da pasada, H2:** declara el difuminado) |
| 19 – 23 | **Pantalla partida** descartada (arriba, ventana de la torre con el aro) / buena (abajo, el cielo limpio). Morph de 0,5 s: la descartada se encoge y la buena sube desde el borde de abajo | «Descartada. Una foto, 1 crédito.» (**cambiado:** 19,5-23; guion 19-23) · **agregado:** rótulos «Con letrero» (19,7) / «Foto nueva» (20,1; **2da pasada, H4:** antes «Sin letrero» sobre una nube, que no prueba nada) |
| 23 – 27 | Foto buena a pantalla completa (la ventana de abajo sube y cubre a la descartada, 23,0-23,5) | «Regla: mirar también el fondo.» (arriba, en el cielo; «el fondo.» a 25,0) |
| 27 – 40,25 | Foto de la agenda. Entra en empuje 26,75-27,0 y sale en empuje 40,0-40,25 | «2 · Letra que no dice nada.» (27-31) · «Parece escrita. No se lee.» (31-35,5) · «Si no se lee, no sirve.» (35,5-40,25). A 31,0 s recorte ampliado de la letra de la libreta (recuadro verde en la foto = región ampliada). **Agregado:** 2º recorte 36,2-39,75 s; **2da pasada (H5): la nota amarilla de arriba** (en foco: garabato y «Cancam») en vez de la otra página de la libreta (fuera de foco), retrato 420x569 en x 580-1000, y 330-899 |
| 40 – 46,04 | **Clip K4 completo a 1×** (145 cuadros): cuadro 0 = 40,0 s, cuadro 72 = 43,0 s, cuadro 104 = 44,333 s, cuadro 120 = 45,0 s. Entra en empuje 40,0-40,25; sale en empuje 45,75-46,0 | «3 · Una mano tapa la otra.» (40,25-42,875; **2da pasada, H6:** «tapa la otra.» se enciende a 42,375 s, cuando entra la otra mano, y no a 41,7) · **«Si cruza, no se cuentan.» (42,875-45,0; 2da pasada, H1: antes «Así no se cuentan dedos.», una afirmación general que la mitad de los cuadros desmentía; cambiado respecto del guion 43-45,1)** · **agregado:** contador «cuadro N» (uno por cuadro) y, en los cuadros 120-125, destello verde + recuadro «origen» sobre la mano |
| 45 – 53,25 | Placa oscura (no se congela a Lucía) con el recorte ampliado del cuadro 120 | «Cuadro 120: cinco dedos.» (**cambiado:** entra a 45,0 sobre el propio cuadro 120 y se queda quieta sobre la costura hasta 50,0; guion 46-50) · sello «5 dedos» a 46,9 · **agregado:** cuadros 72 (48,2) y 104 (48,9) rotulados «cruza» (**2da pasada, H7:** 410x345 px, antes 300x253; etiquetas de 38 y 42 px, sin atenuar) · «Solo cuento lo que se ve.» (50-53,25; «lo que se ve.» a 51,4) |
| 53 – 58 | **Cierre:** clip K1 de 0 a 5 s (cuadros 0-119; cuadro 0 = 53,0 s). Entra en empuje 53,0-53,25 | «Seguime: cada semana, una prueba.» (53,25-58; «una prueba.» a 55,6) |

Tarjetas: todas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3 (lo valida `build.mjs`; el mínimo más justo es c12 «Si cruza, no se cuentan.»: 2,125 s para 2,05). Cada tarjeta entra 1 cuadro antes de que
termine la anterior; en los empujes viajan con la imagen. **Medido:** solo los cuadros 0-2 (0,0-0,125 s, el gancho entra a 0,1 s) no tienen tarjeta
(`qa/hueco-tarjetas.txt`). Un evento visual como máximo cada 2,7 s (medido, ver «QA medido»).

## Costuras — la corriente va a la IZQUIERDA (`motion-doctrine`)
Empuje rígido de 6 cuadros (0,25 s, `power3.inOut`): lo que sale va de 0 a −1080 y lo que entra de +1080 a 0, misma curva, pegados borde con borde. Un clip que entra
arranca en T−6 cuadros (su cuadro 0 cae ahí): por eso 40,0 / 45,0 s son los cuadros 0 / 120 de K4 y 53,0 s el cuadro 0 de K1.

| T (s) | Costura | Cómo |
|---|---|---|
| 6,0 | foto descartada → misma foto | corte de continuidad a propósito (solo cambia la tarjeta) |
| 19,0 | descartada → pantalla partida | morph 19,0-19,5: la foto se encoge a la ventana de arriba y, en la misma curva, la buena sube desde el borde de abajo (bordes 1920−1180·p y 1920−910·p: nunca se pisan); el aro viaja con la foto |
| 23,0 | pantalla partida → foto buena | morph 23,0-23,5: la buena sube a pantalla completa y cubre a la descartada. **Única excepción a la corriente a la izquierda, con causa:** arriba = lo bueno se eleva sobre lo descartado |
| 27,0 | buena → agenda | empuje 26,75-27,0, las tarjetas c7/c8 viajan |
| 40,25 | agenda → clip K4 | empuje 40,0-40,25, las tarjetas c10/c11 viajan |
| 46,0 | clip K4 → placa | empuje 45,75-46,0; los 6 últimos cuadros del clip (139-144) pasan dentro del empuje y el 144 (46,0 s) cae fuera de pantalla. La tarjeta c13 NO viaja: es la misma antes y después |
| 53,25 | placa → clip K1 | empuje 53,0-53,25, las tarjetas c14/c15 viajan |

## Cambios respecto del guion y decisiones que la madre puede revertir
1. **El letrero «Equperarto» NO se muestra nítido** (parece el logo de un banco: azul con un arco rojo). Se **desenfoca** (gblur σ 9 sobre la foto nativa, con pluma de 30 px) en todas sus apariciones
   —el gancho, el error 1, la ventana de arriba de la pantalla partida y, desde la 2da pasada, el recorte ampliado (sale de la foto YA difuminada)—. **2da pasada (H2):** el video ahora **declara** que el difuminado es de edición
   («Letrero difuminado al editar» 4,0-9,0 s y «Fondo: letrero inventado (difuminado)» 16,7-19,0 s); antes el espectador solo veía una mancha y no podía comprobar nada. **Lo que NO se muestra** es el nombre inventado: eso sigue siendo
   decisión de la madre (ver «No aplicado»). Aviso honesto: ya difuminado no se lee ninguna letra, pero el **arco rojo** de arriba sigue viéndose como mancha roja (en el recorte, 1,8× más grande): riesgo residual bajo, no nulo.
   Revertir el difuminado: `plan.json → letrero → desenfoque → "activo": false`, borrar `assets/descartada.jpg` y `assets/letrero-inset.jpg` y `node scripts/build.mjs` (queda pequeño y nítido, ~170 px de ancho).
   Revertir solo el recorte: `plan.json → letrero → inset → "activo": false` (y la etiqueta `e_difum`).
   ⚠️ En la foto el letrero está en y≈70-146: ahí Instagram pone su barra superior. **2da pasada (H3):** el aro (y 46-170) puede seguir medio tapado en el teléfono, pero el recorte ampliado (y 300-522, x 480-980) cae fuera de esa barra y de los botones de la derecha.
2. **Excepción de texto arriba, la misma que G1/K4** (la cara de Lucía está abajo: mentón en 1364 en la foto buena y 1405 en K4, no hay franja hasta y=1490): las tarjetas c7 (y 300-536), c11, c12 y c13 (y 290-452) van ARRIBA, en el cielo, y terminan antes del cabello (y≈915); nada de texto baja de y=885 mientras se ve ese plano (`scripts/medir-dom.mjs`).
3. **La segunda tarjeta del error 3 termina a 45,0 s (guion 45,1) y «Cuadro 120: cinco dedos.» entra a 45,0 s (guion 46,0).** Dos motivos: el guion dejaba 0,9 s sin tarjeta (45,1-46,0) y una frase sobre «no se cuentan dedos» encima del cuadro 120, que es el limpio, contradecía la imagen (lo mandó la evidencia). Por eso «Una mano tapa la otra.» y la segunda tarjeta cortan a 42,875 s (la segunda necesita ≥ 2,05 s).
   **2da pasada (H1): esa segunda tarjeta ya no dice «Así no se cuentan dedos.» (guion) sino «Si cruza, no se cuentan.»** — ver «Segunda pasada». Es un cambio de texto respecto del guion; revertir = poner el texto original en `plan.json → tarjetas → c12` (la frase original solo es cierta en los cuadros 72 y 104).
4. **«Escribió uno igual.» llega hasta 19,5 s y «Descartada. Una foto, 1 crédito.» entra a 19,5 s (guion 19,0):** durante el morph la cara de la descartada sigue a la vista hasta ~19,45 s y la tarjeta del hueco le tapaba el mentón.
5. **La pantalla partida muestra solo FONDOS** (arriba la torre con el letrero, abajo el cielo de la foto buena): las dos ventanas excluyen las caras para poder poner la tarjeta entre ellas sin tapar a nadie. La cara reaparece cuando la buena sube a pantalla completa.
   **2da pasada (H4):** el rótulo de abajo pasa de «Sin letrero» a «Foto nueva». Una nube no puede llevar letrero y no prueba nada; la ausencia de letrero se ve en la foto buena completa (23-27 s). No se pudo mostrar skyline de la foto buena sin que entrara la cara: el horizonte (y≈1020) queda detrás del cabello (desde y≈912) y las franjas a los lados miden 300-380 px (habría que ampliarlas ×3).
6. **Costuras con clip entrante:** el cuadro 0 de K4 cae a 40,0 s y el de K1 a 53,0 s (el empuje ocupa los 6 cuadros siguientes), para que 43,0 / 44,3 / 45,0 s sean exactamente los cuadros 72 / 104 / 120 como dice el guion (PSNR, abajo). La agenda dura 0,25 s más (hasta 40,25) y la placa hasta 53,25.
7. **Tarjeta final a 53,25 s** (guion 53,3; 53,25 es cuadro exacto: 1278).
8. **Agregados al guion (`plan.json → agregados_al_guion`, cada uno con su forma de revertir):**
   - etiqueta «Orden: «no signs anywhere»» 10,5-14,5 s (literal de `PROCEDENCIA.jsonl` l. 95; está en inglés porque es la orden que se dio);
   - **(2da pasada)** recorte ampliado del letrero (ya difuminado) 4,0-9,0 s, con el aro como recuadro de origen, y el aro adelantado a 1,5 s (`plan.json → letrero → inset` / `aro.a`);
   - **(2da pasada)** etiqueta «Letrero difuminado al editar» 4,0-9,0 s (`e_difum`);
   - etiqueta «Fondo: letrero inventado (difuminado)» 16,7-19,0 s (contrapunto de «Cara: 0,835 · aprobada»: aprobada por cara, mala por fondo);
   - rótulos «Con letrero» / «Foto nueva» en las dos ventanas;
   - 2º recorte ampliado de la agenda 36,2-39,75 s: **la nota amarilla en foco** (garabato y «Cancam»; 2da pasada, antes la otra página de la libreta fuera de foco);
   - contador «cuadro N» (una tira de 145 números que avanza 1 por cuadro, `steps`) 40,3-45,45 s y destello + recuadro «origen» en los cuadros 120-125: **solo 6 cuadros**, porque en 128 las manos se juntan; el contador se va antes de que el cuadro 129+ contradiga la tarjeta «Cuadro 120»;
   - los cuadros 72 y 104 («cruza», según el registro) debajo del 120 en la placa (410x345 px desde la 2da pasada).
9. **«Cara: 0,835 · aprobada» usa el puntaje del registro del 3-oct (0,835).** Reproducido hoy con el control de cara de la nube sobre la imagen ORIGINAL de 1440 px: 0,835; sobre el JPG de 720 px del kit da 0,826 (`qa/face-gate.txt`).
10. **Lo que el video afirma contra los cuadros reales (contado de nuevo en la 2da pasada, `qa/hoja-manos-k4.jpg`):** solo se rotulan los cuadros del registro (`PROCEDENCIA.jsonl` l. 94): «5 dedos» en el 120 y «cruza» en 72 y 104. En el 120 la otra mano **sigue a la vista** (cerrada, abajo a la derecha) pero no cruza la abierta; la placa la deja ver.
    **Cuadros del clip K4, mirados de a 3 a resolución completa:** contables (cinco dedos, la otra mano no tapa) 48-60, 81-84, 96-99 y 111-126; la otra mano cruza en ~63-78, ~87-93 y ~102-108. Un bloque no se rotula por dos muestras, así que solo 72 y 104 llevan «cruza».
    La tarjeta del bloque 42,875-45,0 s (cuadros 69-120) tiene que ser cierta para todo el bloque: **«Si cruza, no se cuentan.»** lo es (condicional); «Así no se cuentan dedos.» solo era cierta en 72 y 104 y el contador «cuadro N» la desmentía en 84, 96 y 111-119.

## Segunda pasada: hallazgos de la revisión independiente y qué se hizo
| # | Sev. | Qué pidió | Qué se hizo |
|---|---|---|---|
| H1 | alta | La tarjeta «Así no se cuentan dedos.» afirma en general sobre 69-120, donde ~la mitad de los cuadros SÍ se cuentan | **Hecho.** c12 = «Si cruza, no se cuentan.» (5 palabras, 2,05 s mínimo, 2,125 s disponibles). Cuadros contados de nuevo (arriba). |
| H2 | media | El difuminado del letrero es de edición y el video no lo dice | **Hecho.** «Letrero difuminado al editar» (4,0-9,0 s) y «Fondo: letrero inventado (difuminado)» (16,7-19,0 s). El nombre inventado NO se muestra (decisión de la madre). |
| H3 | media | El único objeto de prueba del error 1 queda en la zona de la barra de Instagram | **Hecho.** Recorte ampliado del letrero (ya difuminado) en x 480-980, y 300-522, 4,0-9,0 s, sin capas de blur extra (el aviso de `check` sigue en 30 elementos, no sube). |
| H4 | baja | «Sin letrero» sobre una nube no prueba nada | **Hecho por la vía del rótulo:** «Foto nueva». No se pudo cambiar de tramo sin que entrara la cara (ver cambio 5). |
| H5 | baja | Los recortes de la agenda muestran letra desenfocada; la nota amarilla está en foco | **Hecho.** El 2º recorte (36,2-39,75 s) es la nota amarilla, retrato 420x569, con su recuadro «origen». |
| H6 | baja | «tapa la otra.» se enciende 1,7 s antes de que haya otra mano | **Hecho.** `acento_t` de c11: 41,7 → 42,375 s (la otra mano entra a 42,5 s, el primer cruce cae en ~42,6 s). Para eso el build acepta un acento hasta b−0,5 s (antes b−1,0). **No aplicado (opcional):** que el contador siga hasta 45,75 s, porque en 129-138 un «cuadro 130» bajo la tarjeta «Cuadro 120» contradice (decisión de la 1ra pasada, G1-C1). |
| H7 | baja | Las miniaturas 72 y 104 miden 300x253 px y se ven poco | **Hecho.** 410x345 px (x 100-510 y 570-980, y 1130-1475), etiquetas de 38 px («cuadro N») y 42 px («cruza»), sin atenuar. |
| H8 | baja | 4 s de imagen fija antes de que algo marque lo que hay que mirar | **Hecho.** El aro entra a 1,5 s (antes 4,0 s) y a 4,0 s entra el recorte del letrero (a 3,0 s ya hay tarjeta nueva: el hueco máximo sin evento queda en 2,7 s). |
| H9 | baja | El error 3 no es un error de dibujo de la IA (las manos están bien) sino un límite de verificación | **No aplicado: decisión de guion para la madre.** Opciones: dejarlo con la nota en el pie, o renombrar el tercero como «una mano que tapa y no deja verificar». El montaje no cambia. |
| H10 | baja | `qa/face-gate.txt` comparaba el final contra K1 con 0,5 s de desfase | **Hecho.** Tabla remedida con instantes alineados (final 54-57 s ↔ K1 1-4 s; final 41,5 y 43 s ↔ K4 1,5 y 3 s). Sin cambios en el video. |

**No aplicado, con su motivo:** (a) mostrar el nombre inventado «Equperarto» como texto propio («Decía: «Equperarto»»): el revisor lo dejó como decisión de la madre; (b) H9; (c) el contador hasta 45,75 s (opcional, ver H6).

## Audio
La pista es silencio (−91 dB) y NO se agregan pops/SFX en las costuras, a propósito (dejan sitio a la música de Sergio Urcullo; los SFX de HyperFrames no están en esta nube). Si se quiere un golpe por costura:
26,75 / 40,0 / 45,75 / 53,0 s (inicio de cada empuje) y 19,0 / 23,0 s (morphs).

## Publicación
El cuadro 0 lleva el rótulo de IA pero el gancho entra a 0,1 s: elegir como portada el cuadro a ≈ 0,6 s (`qa/portada-0.6s.jpg`). La nota va aquí, NO en `pie.txt` (se publica tal cual). Etiqueta «Información de IA» por API; la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre).

## QA medido (final `out/g3-final-1080x1920.mp4`, 2da pasada)
- `ffprobe`: H.264 1080x1920, 24 fps, **58,000 s** (1392 cuadros), bt709; AAC 48 kHz estéreo −91 dB (`qa/specs-final.txt`). Borrador 360p REAL (`out/g3-preview-360p.mp4`, también en `qa/`): 360x640, 1392 cuadros, render de HyperFrames, no un reescalado.
- `hyperframes check`: 0 errores, 0 advertencias de runtime/layout/motion; contraste **14/14 AA** (los avisos de estilo `nested_structure_needs_subcomposition` / `timeline_track_too_dense` / `composition_heavy_overlay_count_high` no frenan). **El conteo de overlays pesados sigue en 30** (los dos recortes nuevos usan solo `box-shadow`, sin `filter` ni `clip-path`); el render salió completo, sin cuadros negros.
- Zona segura **en el DOM** (`medir-dom`): todo texto entre las reglas de su plano (la etiqueta nueva «Letrero difuminado al editar» a y=905, bajo el mentón + 40); ningún texto < 34 px (mínimo 34: rótulo de IA; los demás 38-66); los cuadros de la placa terminan en y=1475 (≤ 1490) y x=980 (≤ 1000); el recorte del letrero queda en y 300-522, x 480-980; ningún texto se pisa con otro (muestreo cada 0,25 s); el contador marca el cuadro n a 40,0 + n/24 para los 145 cuadros.
- `hueco-tarjetas`: solo los cuadros 0-2 sin tarjeta. `vacios.py`: **0 cuadros planos**; saltos de luma ≤ 47 en las costuras con la placa oscura (repartidos en 4-5 cuadros), ≤ 23 en las demás (`qa/vacios-y-saltos.txt`; idénticos a la 1ra pasada).
- `grep-prohibidas` sobre pantalla y pie: limpio (sin marcas de terceros, sin «tapada», sin promesas).
- **PSNR contra la fuente** (cara, sin tarjetas encima): el render cae en el cuadro prometido: 43,000 s = K4 cuadro **72**, 44,333 s = **104**, 45,000 s = **120** (picos de 38,4-38,7 dB, los vecinos 25-33 dB); K1: cuadros 6, 60 y 119 en su instante (`qa/psnr-cuadros-k4.txt`).
- Cara (`face-gate`, 6 cuadros del final contra la fuente en el MISMO instante — H10): 0,830 / 0,809 / 0,732 / 0,723 / 0,731 / 0,717 contra 0,835 / 0,812 / 0,726 / 0,724 / 0,762 / 0,726 (diferencias 0,005 / 0,003 / 0,006 / 0,001 / **0,031** / 0,009), todos ≥ 0,70. El 0,031 es en 55,0 s, con una cara de 180 px (120 px en K1): la medida es ruidosa a ese tamaño (el K1 sin comprimir da 0,758) y se miró; las caras < 200 px son poco confiables por tamaño (`qa/face-gate.txt`).
- Eventos visuales (tarjeta, acento, etiqueta, recorte, aro, sello, cuadros de la placa, costura): el hueco máximo entre eventos es **2,7 s** (20,1 → 22,8 s, pantalla partida), medido por script desde `plan.json` (`scripts/eventos.mjs`, `qa/eventos-visuales.txt`); el gancho tiene evento a 0,1 / 1,5 / 3,0 / 4,0 / 6,0 s.
- Mirado renderizado (hojas de contacto del FINAL a 1080x1920 con guías, y borrador 360p): cada costura (6 cuadros de empuje), los dos morphs, la entrada y salida del aro y del recorte del letrero, la etiqueta «Foto nueva», la nota amarilla, el acento de c11 a 42,375 s, c12 sobre los cuadros 69-120, los cuadros 72 y 104 a 410x345 y el último cuadro.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material del kit (y baja la foto original por curl, 0 cr), valida y escribe index.html
                                            # ⚠️ las imágenes derivadas (descartada.jpg, letrero-inset.jpg, ag-inset1/2.jpg, k4cuadros/) se generan SOLO si faltan: al cambiar sus cajas en plan.json, borrarlas antes
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~70 s). Mirar las costuras ahí:
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
# 2) recién después el final (~2,5 min, 4 núcleos, sin GPU)
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 58 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g3-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/grep-prohibidas.mjs && node scripts/eventos.mjs
COLS=5 bash scripts/hoja.sh out/g3-final-1080x1920.mp4 hoja.jpg 360 f0 f12 …     # «fNNN» = cuadro NNN exacto
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g3-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
# instantes ALINEADOS con la fuente (K4 cuadro 0 = 40,0 s; K1 cuadro 0 = 53,0 s): final 41,5 y 43 s ↔ K4 1,5 y 3 s; final 55 y 57,5 s ↔ K1 2 y 4,5 s
bash .claude/skills/lucia/scripts/face-gate.sh out/g3-final-1080x1920.mp4@1,24.5,41.5,43,55,57.5 assets/descartada-orig.png assets/buena.jpg assets/k4.mp4@1.5,3 assets/k1.mp4@2,4.5     # FACE_GATE_HOME fuera del repo
```
