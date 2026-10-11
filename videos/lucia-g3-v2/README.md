# Lucía · G3 v2.1 «Tres errores que casi publico» (27,917 s, 1080x1920, 24 fps, muda y lista para la voz)

Re-corte de `videos/lucia-g3/` (58 s, muda, con mucho tiempo muerto) pedido por la madre el 11-oct-2026: **26-30 s, sin aire muerto (regla 15) y cronometrado como si hablara**.
**v2.1 = v2 + la revisión 1** (`qa/revision-1.md`: APROBADO CON CAMBIOS, 0 ALTA · 2 MEDIA · 8 BAJA; todos aplicados, ver «Revisión 1»).
Montaje con HyperFrames 0.8.142 y el método de `.claude/skills/lucia/montaje-hyperframes.md`. **Costo: 0 créditos** (fotos y clips ya pagados: descartada K4·1 `6708e444`, nueva `eddca486`,
agenda `1422fa94`, clip K4 `338b751f`, clip K1 `e470ef4f`). **No se llamó a Higgsfield, ElevenLabs ni a ningún servicio; hoy NO hay voz: la pista es AAC en silencio** (−91 dB).
Estado: **PARA VER POR LA MADRE (preview 360p). No se publica nada.**
**Herramientas (D-N1, decisión de la madre del 11-oct):** el video (pantalla y voz) NO nombra ninguna herramienta; el **pie sí**, con su límite dicho y solo donde `PROCEDENCIA.jsonl` lo respalda (ver H2).

| Qué | Dónde |
|---|---|
| **Guion de voz** (12 líneas = 12 tramos, 401 caracteres; 412 con saltos de línea; cupo 450) | `guion-voz.txt` |
| Plan en CUADROS o expresiones `T<n>`/`L<n>`/`END` (inicio/fin de la ventana de voz n) | `plan.json` |
| Plan resuelto en segundos (lo escribe el build y lo leen los controles) | `plan-resuelto.json` |
| Generador: calcula las ventanas desde `plan.voz` (o `duraciones.json`), valida reglas, cifras y pie contra `PROCEDENCIA.jsonl`, escribe `index.html` | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Tabla caben / no caben de la voz, por línea | `scripts/voz-tabla.mjs` → `qa/voz-tramos.txt`, `qa/voz-tramos.json` |
| Medir y mezclar la voz cuando exista (adaptado de G5 v2; probado SOLO con tonos sintéticos) | `scripts/poner-voz.mjs` |
| Preview 360p (render REAL de HyperFrames a 360x640, no un reescalado) | `qa/g3-v2-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (git lo ignora) | `out/g3-v2-final-1080x1920.mp4` |
| Pie para publicar (abre con «Personaje hecho con IA»; verificado por el build) | `pie.txt` |
| QA mirado y medido | `qa/` (ver «QA») |

## Revisión 1 (11-oct): qué se hizo con cada hallazgo
| # | Sev. | Hallazgo | Resultado |
|---|---|---|---|
| H1 | MEDIA | La voz no cabe: el cronograma estaba en palabras (3,6/s) y la voz se mide en caracteres | **HECHO (solo texto y tramos).** Cronograma en **caracteres a 17/s** (`plan.voz.cps`). Las 12 ventanas se **congelaron** en sus valores de v2.0 (`plan.voz.tramos_cuadros`): **no se movió ninguna tarjeta, empuje ni clip**. Guion **438 → 401 car** (412 con saltos; el revisor pedía ≤ 411). **Las 12 líneas caben y dejan un hueco de 0,017 a 0,208 s** (tope 0,30; `qa/voz-tramos.txt`). De las 4 propuestas del revisor se aceptaron L4 y L11 tal cual; **L1 y L8 se cambiaron** porque con las ventanas congeladas sus 30 car dejaban un hueco de 0,44 s (> 0,30): L1 «Mirá: tres errores que casi publico.» (36) y L8 «Y tres: una mano le tapa a la otra.» (35). Además L2 35→31, L5 42→34 (sin «de la agenda»), L6 21→17, L9 36→32 y L10 27→30 para caber o no dejar hueco. **La última ventana (el CTA) pasó de 33 a 47 cuadros** (la línea de 33 car pide 1,94 s y tenía 1,375 s) y la cola de 13 a 10: la pieza pasó de 27,458 a **27,917 s**; K1 usa ahora los cuadros 14-142 (antes 20-137; `media_inicio` «auto»). `build.mjs` ahora **lee `duraciones.json`** (voz real: cada ventana = ceil(voz × 24) cuadros, `media_inicio` de K4 y K1 automático) y `poner-voz.mjs` lo escribe. **No hecho: la voz** (no se generó ni se midió; sigue siendo una estimación de ±10 %) |
| H2 | MEDIA | D-N1 abierta: nombrar o no las herramientas | **HECHO sin nombrarlas en el video.** El **pie** las nombra (Higgsfield; fotos de Lucía con Seedream 4.5; clips con Kling 3.0 std), dice el límite («muestra chica, no una regla: de las 8 fotos de esa tanda, una trajo un letrero»; lo de las manos «es lo que yo no puedo verificar») y suma «Nombro lo que uso; no es una recomendación pagada.»; sigue abriendo con «Personaje hecho con IA». **Regla dura:** el build exige que cada atribución esté en `PROCEDENCIA.jsonl` (foto del letrero `6708e444`: `modelo` seedream_v4_5, l.95; foto nueva `eddca486`: `metodo_fotos` del lote, l.93; clips `338b751f` y `e470ef4f`: `metodo_clips` kling3_0 std, l.93, y el de K1 también l.95). **La agenda (`1422fa94`) no se nombra ni se le atribuye herramienta**: el repo solo trae el `metodo_fotos` del lote y ningún registro propio por job (el revisor tampoco pudo confirmarlo con `job_display`), y la agenda es una foto sin persona mientras el método del lote describe fotos de Lucía con referencias. `grep-prohibidas.mjs` separa ahora: pantalla y voz sin ninguna herramienta; pie solo esas tres, y cualquier otra marca sigue prohibida |
| H3 | BAJA | «Tres errores de la IA» (voz L1) generaliza el error 3 | **HECHO.** L1 ya no dice «de la IA» (ver H1) |
| H4 | BAJA | «Cara: 0,835 · aprobada» no dice qué mide | **HECHO.** Etiqueta «**Parecido: 0,835 · aprobado**» (pastilla de 568 px en y 1010-1096, dentro de la zona segura; ventana de lectura 2,13 s, pide 1,35) y el pie dice qué mide: «ArcFace, de 0 a 1, contra ocho fotos oficiales de Lucía; mi piso es 0,70. Mide la cara, no el fondo.» |
| H5 | BAJA | «mano … otra mano» repetido; «el control» sin presentar | **HECHO.** L8 ya no repite «mano» (ver H1). **L3 conserva «el control»**: con «Parecido» en pantalla y la frase del pie alcanza, y «el control de parecido» suma 13 car y no cabe en la ventana |
| H6 | BAJA | «Sin aire muerto» sobreafirmado | **HECHO.** Reescrito abajo con la medida honesta y su regla de lectura; `aire.mjs` ahora imprime las dos medidas. **La mitad de audio de la regla 15 sigue sin poder cerrarse (ver «Pendientes»)** |
| H7 | BAJA | El CTA cumple por 0,06 s y el README decía 2,5 s | **HECHO.** CTA **2,92 s a opacidad plena** (2,96 s con el fundido) en vez de 2,46 s: la ventana 12 más larga y la cola de 10 cuadros. `build.mjs` y `ventanas.mjs` miden desde la opacidad plena (≥ 0,9), y `ventanas.mjs` ahora exige ≥ 2,4 s |
| H8 | BAJA | El difuminado del letrero deja la silueta de un logo (arco rojo) | **HECHO.** Sigma **9 → 44** (el mismo difuminado, 5 veces más fuerte; no hizo falta parche liso). Mirado a 2x y 4x en el cuadro 0 y en el 69, y con contraste y saturación forzados: queda una mancha gris lisa, **sin banda azul, sin arco rojo, sin silueta de logo**. Sigue declarado («Difuminado al editar») |
| H9 | BAJA | K4 y K1 viven cerca del piso 0,70 | **HECHO y con un hallazgo más.** Control corrido (`qa/face-gate.txt`): final↔fuente, máxima diferencia **0,020** en los 14 cuadros de muestra. **Mirando TODOS los cuadros en reposo hay 11 de 229 entre 0,680 y 0,699** (4 de K4, 7 de K1; la fuente ya los trae) y la diferencia llega a 0,025: el «todo ≥ 0,70» del revisor valía para su muestra. K4 mide 0,706-0,775 y K1 0,699-0,780 en la muestra; el 0,835 de pantalla es el de la foto descartada |
| H10 | BAJA | Rastro del master y mantenimiento | **HECHO en lo mío.** `index.html` es idempotente (md5 `b1ab1c39…` al construir dos veces) y el master se renderizó **después** de dejarlo así (índice 05:33 UTC, master 05:37; reconstruido a las 05:59 con el mismo md5). SHA-256 y md5 en este README y en `qa/sha256-final.txt`. `qa/face-gate.txt` reemplazado por la medición nueva. **No se tocó `videos/lucia-entrega/`:** a la madre le toca copiar el master, su SHA y marcar G3 v1 (58 s, `g3-final-1080x1920.mp4`) como reemplazada |

## Voz: los 12 tramos (17 caracteres por segundo; 6 cuadros = 0,25 s entre ventanas)
Cada línea tiene una **ventana** de voz (valores congelados de v2.0) y entre ventana y ventana hay 6 cuadros (0,25 s), que es donde cae cada empuje de pantalla completa. **Cabe** = voz estimada ≤ ventana; **hueco** = ventana − voz (objetivo ≤ 0,25 s, tope 0,30 s). El silencio real entre dos líneas es el hueco + 0,25 s de la costura (0,27-0,46 s antes de la voz real; con `duraciones.json` baja a 0,25 s + menos de 1 cuadro). Tras la última palabra quedan 10 cuadros (0,42 s) para que el CTA termine de leerse.
Total: 80 palabras, 401 caracteres (412 con saltos), voz estimada 23,6 s, pieza 27,917 s. **Margen < 0,05 s en L3, L4, L7 y L12** (si Marcela habla más lento que la estimación se salen hasta ~0,25 s hacia la costura, sin pisar a la siguiente).

| Tramo | Ventana (s) | Car. | Voz est. (s) | Hueco (s) | Línea de voz (voseo) | Pantalla |
|---|---|---:|---:|---:|---|---|
| T1 | 0,000–2,208 | 36 | 2,118 | 0,091 | Mirá: tres errores que casi publico. | foto descartada; tarjeta c1 y rótulo de IA ya en el cuadro 0; aro 1,5 s; recorte del letrero 1,9 s |
| T2 | 2,458–4,417 | 31 | 1,824 | 0,135 | Uno: sin letreros, y salió uno. | c2 «1 · Letrero que no pedí.»; etiqueta «Orden: «no signs anywhere»» |
| T3 | 4,667–7,167 | 42 | 2,471 | 0,029 | La cara pasó el control, pero el fondo no. | c3 «La cara pasó. El fondo, no.»; marco de la cara; etiqueta «Parecido: 0,835 · aprobado» |
| T4 | 7,417–9,375 | 33 | 1,941 | 0,017 | Mi regla: mirar también el fondo. | empuje → foto nueva; c4 «Mirar también el fondo.»; etiqueta «Foto nueva» |
| T5 | 9,625–11,833 | 34 | 2,000 | 0,208 | Dos: una letra que parece escrita. | empuje → agenda; c5 «2 · Letra que parece escrita.»; recorte ampliado de la libreta con su recuadro de origen |
| T6 | 12,083–13,208 | 17 | 1,000 | 0,125 | Ahí no dice nada. | c6 «Sin mensaje.»; recorte ampliado de la nota amarilla (en foco) |
| T7 | 13,458–15,667 | 37 | 2,176 | 0,032 | Si no se lee, no sirve para publicar. | c7 «No se lee, no sirve.» |
| T8 | 15,917–18,125 | 35 | 2,059 | 0,150 | Y tres: una mano le tapa a la otra. | empuje → clip K4; c8 «3 · Una mano tapa la otra.»; contador «cuadro N»; la otra mano entra en el cuadro 60 (17,583 s) |
| T9 | 18,375–20,333 | 32 | 1,882 | 0,076 | Si cruza, no puedo contar dedos. | c9 «Si cruza, no cuento.»; las tres cruzadas (cuadros ~63-78, ~87-93, ~102-108) caen dentro de esta línea |
| T10 | 20,583–22,542 | 30 | 1,765 | 0,194 | Y yo cuento solo lo que se ve. | empuje → placa; c10 «Cuadro 120: cinco dedos.»; cuadro 120 ampliado y sello «5 dedos» (la ceremonia: 1,96 s en reposo) |
| T11 | 22,792–25,292 | 41 | 2,412 | 0,088 | Reviso cuadro a cuadro antes de publicar. | empuje → clip K1; c11 «Reviso cuadro a cuadro.» |
| T12 | 25,542–27,500 | 33 | 1,941 | 0,017 | Seguime: cada semana, una prueba. | c12 CTA «Seguime: cada semana, una prueba.» (24,958–27,917 s = 2,96 s en pantalla, 2,92 s a opacidad plena) |

**Cupo de voz:** el guion (401 car) **no cabe en los 381 que quedan** de ElevenLabs hasta el 13-oct 01:17 UTC (20 de más) y con retomas ×1,3 serían ≈ 520: no se puede generar antes de la renovación. Bajar todas las líneas al mínimo que admite su ventana daría ≈ 372 car (una sola toma, sin retomas y con hueco de 0,30 s), no recomendable.

## Tabla de cortes (t, capa, texto)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000–7,417 | **Foto descartada** a pantalla completa (letrero inventado difuminado) con empuje lento 1,00→1,03 | rótulo «Lucía Antelo · personaje IA de Onia» 0–3,0 s a **40 px** (sale 3,0–3,25) · c1 «Tres errores que casi publico.» (**ya en el cuadro 0**, 0–2,458) · aro verde sobre el letrero a 1,5 s · recorte ampliado del letrero con la leyenda «Difuminado al editar» (1,917–4,167) · c2 «1 · Letrero que no pedí.» (2,458; «no pedí.» a 3,625) · «Orden: «no signs anywhere»» (2,667–4,667) · c3 «La cara pasó. El fondo, no.» (4,667; «El fondo, no.» a 5,917) · marco de la cara 4,917 · «Parecido: 0,835 · aprobado» (4,750–7,000) |
| 7,167–9,625 | **Foto nueva** sin letrero (llega con empuje 7,167–7,417) | c4 «Mirar también el fondo.» (arriba, en el cielo; «el fondo.» a 8,5) · «Foto nueva» |
| 9,375–15,917 | **Foto de la agenda** (empuje 9,375–9,625) | c5 «2 · Letra que parece escrita.» (9,625; «parece escrita.» a 10,875) · recorte 1 (9,958–12,167, recuadro verde de origen en la foto) · c6 «Sin mensaje.» (12,083; «mensaje.» a 12,875) · recorte 2, la nota amarilla en foco (12,417–15,5) · c7 «No se lee, no sirve.» (13,458; «no sirve.» a 14,875) |
| 15,667–20,583 | **Clip K4 a 1×**, cuadros 14 a 131 de 145 (empuje 15,667–15,917). El cuadro 120 cae a 20,083 s | c8 «3 · Una mano tapa la otra.» (15,917; «tapa la otra.» a 17,583, cuando entra la otra mano) · contador «cuadro N» (uno por cuadro) · c9 «Si cruza, no cuento.» (18,375; «no cuento.» a 18,958) · recuadro «origen» y destello del contador en los cuadros 120-125 (20,083–20,333) |
| 20,333–22,792 | **Placa oscura** (empuje 20,333–20,583; no se congela a Lucía) | c10 «Cuadro 120: cinco dedos.» (20,583) · visor con el cuadro 120 ampliado + «cuadro 120» · sello «5 dedos» a 21,083 |
| 22,542–27,917 | **Cierre: clip K1**, cuadros 14 a 142 de 145 (empuje 22,542–22,792) | c11 «Reviso cuadro a cuadro.» (22,792; «a cuadro.» a 23,792) · c12 CTA «Seguime: cada semana, una prueba.» (24,958–27,917; «una prueba.» a 26,375) |

Costuras: cinco empujes rígidos de 6 cuadros a la izquierda (0,25 s, `power3.inOut`), cada uno **dentro del hueco de voz de 6 cuadros** entre dos líneas (T3→T4 7,167–7,417; T4→T5 9,375–9,625; T7→T8 15,667–15,917; T9→T10 20,333–20,583; T10→T11 22,542–22,792). Las tarjetas viajan con el empuje. Son las mismas de v2.0: la revisión 1 no movió ninguna.
El cuadro n del clip cae donde dice el plan (PSNR contra la fuente, abajo), así que el 120 es el 120.

## Qué se quitó de G3 (58 s → 27,917 s) y por qué
| Se quitó | Por qué |
|---|---|
| Pantalla partida descartada/buena con los dos morphs (4 s), «Descartada. Una foto, 1 crédito.», «Fondo: letrero inventado (difuminado)», «Con letrero» | Eran evidencia del error 1 repetida; la regla (mirar el fondo) se dice sobre la foto nueva en 2,2 s. Con ellas desaparece el «1 crédito»: v2 no lleva ninguna cifra de costo |
| Tarjetas de 4-5 s sobre fotos fijas (aire muerto) | Cada tarjeta dura ahora lo de su línea de voz (1,4-2,8 s) y siempre dentro de su tiempo de lectura + 0,3 s |
| Placa de evidencia de 7,5 s con los cuadros 72 y 104 | La ceremonia de contar dedos se comprime a **1,96 s en reposo** (cuadro 120 ampliado + sello). Las cruzadas ahora se ven en vivo, con el contador, dentro de «Si cruza, no puedo contar dedos» |
| Error 2 de 13 s | 6,5 s: el mismo recorte de la libreta y el de la nota amarilla, con una tarjeta por línea de voz |
| Clip K4 completo (6,04 s) | Se usan los cuadros 14-131 (4,9 s): la mano entra y cruza dentro de las líneas T8-T9 |
| Etiqueta «Letrero difuminado al editar» como pastilla aparte | Pasó a ser la leyenda del recorte ampliado del letrero (misma declaración: el difuminado es de edición) |
| Rótulo de 34 px y 2,4 s | Ahora 40 px y 3,0 s completos (regla de marca) |

Se **conservó**: el gancho en los 3 primeros segundos (título de 5 palabras con la promesa en el cuadro 0 y la prueba —el aro y el recorte del letrero— antes de los 3 s), los tres errores con su evidencia en pantalla (letrero inventado, letra que no dice nada, mano que tapa a la otra), la idea de que se revisa cuadro a cuadro antes de publicar, la regla y el cierre.

## Decisiones que la madre puede revertir
1. **Título «Tres errores que casi publico.»** en vez de «Tres errores de la IA.» (G3); la voz abre «Mirá: tres errores que casi publico.» (propuesta de `PLAN.md` §5: «Casi publico esto.»). Revertir: línea 1 de `guion-voz.txt` y `c1` en `plan.json`.
2. **Empuje lento 1,00→1,03 en las fotos** y 1,00→1,05 en el visor de la placa (`plan.json → escenas.*.zoom`, `scripts/timeline.js`): evita cuadros idénticos. Quitarlo deja las fotos quietas.
3. **El CTA entra 14 cuadros (0,58 s) antes de su línea de voz y la ventana 12 mide 47 cuadros + 10 de cola** (`c12.a`, `plan.voz.tramos_cuadros[11]`, `voz.cola_cuadros`): así el CTA exacto está **2,92 s a opacidad plena** (regla: 2,4-5,5 s) sin que la tarjeta anterior pierda su lectura.
4. **Tarjetas más cortas que la voz** («Sin mensaje.», «No se lee, no sirve.», «Si cruza, no cuento.», «Mirar también el fondo.»): una tarjeta que sale con un empuje pierde 6 cuadros de lectura, así que se acortaron para que se lean enteras aunque haya empuje (`ventanas.mjs` lo mide en el DOM).
5. **Sin cifras de costo.** «1 crédito» salió con la pantalla partida. Las únicas cifras en pantalla son 1/2/3 (numeración), 0,835 y 120 (validadas contra `PROCEDENCIA.jsonl` por el build, que corta si aparece cualquier otra, también en la voz).
6. **El letrero «Equperarto» sigue difuminado, ahora con sigma 44** (`plan.json → letrero.desenfoque.sigma`, 9 antes): ya no queda silueta de logo. Mostrar el nombre inventado como texto propio sigue siendo decisión de la madre. Las imágenes derivadas (`descartada.jpg`, `letrero-inset.jpg`) se regeneran solo si faltan: al cambiar el sigma se borraron antes de construir.
7. **El error 3 es un límite de verificación, no una mano mal dibujada** (las manos son correctas en todos los cuadros mirados): la voz dice «una mano le tapa a la otra» y «no puedo contar dedos»; el pie lo dice («lo que yo no puedo verificar»).
8. **Herramientas solo en el pie** (D-N1, H2): ni la pantalla ni la voz las nombran; la agenda queda sin herramienta atribuida por falta de procedencia por job.
9. **Etiqueta «Parecido: 0,835 · aprobado»** (mismo vocabulario que G4/G5) en vez de «Cara: … aprobada».

## QA (final `out/g3-v2-final-1080x1920.mp4`)
Todos los resultados están en `qa/`. Salidas de los controles sobre el master y el `index.html` finales:

| Control | Resultado (exit) | Evidencia |
|---|---|---|
| `scripts/build.mjs` (dos veces) | **exit 0**; mismo md5 de `index.html` (`b1ab1c395e281cc151a8270ddc72f29e`) y de `plan-resuelto.json` (`086c814bfab0e81577ab0f0c6bb2f638`) | consola; `qa/sha256-final.txt` |
| `hyperframes check` (0.8.142, bajo `flock`) | **exit 0, 0 errores**; runtime 0, layout 0 avisos + 3 informativos (`content_overlap` en el cuadro de relevo entre dos tarjetas, 1 cuadro), motion 0, contraste **13/13 AA**; 27 avisos de estilo (`nested_structure_needs_subcomposition`, `timeline_track_too_dense`, igual que G3) | `qa/hyperframes-check.txt` |
| Duración y voz (build + `voz-tabla.mjs`) | **exit 0**; 27,917 s (670 cuadros; pedido 26-30 s); 12 ventanas, huecos de costura de 6 cuadros = 0,25 s, **12 de 12 líneas caben** con hueco 0,017-0,208 s; 401 caracteres (412 con saltos; ≤ 450); cifras: solo 1-2-3, 0,835 y 120; CTA exacto **2,92 s a opacidad plena** (2,4-5,5 s) hasta el final; rótulo 0-3,25 s | `qa/voz-tramos.txt`, `.json` |
| `medir-dom.mjs` (zona segura en el DOM) | **exit 0**: todo texto dentro de y 280-1490 (tarjetas de arriba desde 290, recorte del letrero desde 300); la pastilla «Parecido: 0,835 · aprobado» mide 568 px (x 256-824, y 1010-1096); nada en los 80 px de la derecha bajo y=1000; ningún texto < 34 px (tamaños 36/38/40/44/52/66; el **rótulo mide 40 px**); ningún texto se pisa (cada 0,25 s); el contador marca el cuadro n del clip en los 118 cuadros | `qa/zona-segura.txt` |
| `hueco-tarjetas.mjs` | **exit 0**: **0 de 670 cuadros sin tarjeta** | `qa/hueco-tarjetas.txt` |
| `ventanas.mjs` (lectura medida en el DOM, con empujes) | **exit 0**: ok en 19 de 19 (12 tarjetas, rótulo 3,17 s desde el cuadro 0, 3 etiquetas, leyenda, sello y visor); **CTA 2,92 s a opacidad plena (pide ≥ 2,4)**; «Parecido…» 2,13 s (pide 1,35); la más justa es c6 «Sin mensaje.» (1,29 s para 2 palabras: pide 1,00) | `qa/ventanas.txt` |
| `eventos.mjs` | **exit 0**: 41 eventos visuales en 27,9 s = 14,7 por 10 s; hueco máximo 1,616 s (≤ 2,0 s); tramo quieto *de diseño* (sin contar el empuje lento ni los clips) 0,25 s (≤ 0,3) | `qa/eventos-visuales.txt`, `.json` |
| **Aire muerto, en los píxeles del final** (`aire.mjs`) | **exit 0.** Ver «Sin aire muerto» abajo | `qa/aire.txt` |
| `vacios.mjs` | **exit 0**: **0 cuadros planos** (std < 6); saltos de luma ≤ 17 en las costuras claras y ≤ 42 en las dos que tocan la placa oscura (repartidos en 4-5 cuadros) | `qa/vacios-y-saltos.txt` |
| `costuras.mjs` (empuje rígido de 6 cuadros en el DOM) | **exit 0**: 5 de 5 ok, separación entre bordes 0,0 px en cada cuadro, cada empuje EXACTO en el hueco de voz | `qa/costuras.txt`, `qa/hoja-costuras.jpg` (7 cuadros de cada costura, mirados) |
| `psnr-clips.mjs` (el clip cae en el cuadro prometido; la cara no se deforma) | **exit 0**: K4 cuadros 20, 72, 104, 120, 125 y K1 30, 100, 130 con el PICO en el cuadro n (vecinos 25-40 dB); cara 43-45 dB / SSIM 0,985-0,987 (32,6 dB en el 120 por el resplandor del recuadro «origen» sobre el borde del recorte). Con `media_inicio` automático el script mide solo los cuadros que el clip muestra | `qa/psnr-cara-clips.txt` |
| `fotos-psnr.mjs` | **exit 0**: las 3 fotos contra su fuente al zoom del plan, 30,8-36,6 dB | `qa/psnr-fotos.txt` |
| **Control de identidad (ArcFace)** | **corrido** (ver H9): muestra de 14 cuadros, máxima diferencia final↔fuente **0,020**; todos los cuadros en reposo: 11 de 229 entre 0,680 y 0,699 (K4 y K1) | `qa/face-gate.txt` |
| `grep-prohibidas.mjs` sobre pantalla, pie y **voz** | **exit 0**: sin marcas de terceros ni herramientas en pantalla y voz; el pie solo nombra Seedream 4.5, Kling 3.0 std y Higgsfield (una vez cada una); sin profesión de salud, sin producto de Onia, sin nombre de Sergio Urcullo, sin «tapada», sin promesas | `qa/grep-prohibidas.txt` |
| `ffprobe` | H.264 1080x1920, 24 fps, **670 cuadros = 27,917 s**, bt709; AAC 48 kHz estéreo −91 dB. Preview 360p: 360x640, 670 cuadros (render real de HyperFrames) | `qa/specs-final.txt` |
| **Mirado renderizado** | hojas de contacto del FINAL a 1080x1920 a 2 cuadros por segundo con guías (y=1490 rojo, x=1000 magenta, mentón cian) y hoja de las 5 costuras; mirados a resolución completa: cuadro 0 (título + rótulo), cuadro 36 (aro), cuadro 69 (2,9 s: rótulo, recorte con leyenda, etiqueta «Orden»), la etiqueta «Parecido: 0,835 · aprobado» (cuadro 130), **el letrero difuminado a 2x (cuadros 0 y 69) y a 4x (cuadro 0)**, el recorte del letrero a 2x, el CTA en el cuadro 601 (opacidad plena) y el 669 (último), y las 5 costuras | `qa/hoja-2fps-1.jpg`, `-2`, `-3`, `qa/hoja-costuras.jpg`, `qa/portada-1.6s.jpg` |

### Sin aire muerto: la medida honesta y su regla de lectura (H6)
La regla 15 pide que ningún tramo de más de 0,3 s tenga la pantalla quieta sin una tarjeta en lectura ni un evento nuevo. Hay dos formas de medirlo y dan números distintos:
- **Contando el empuje lento (1,00→1,03 de las fotos, 1,00→1,05 del visor) como movimiento** (0,02 % de píxeles cambiados > 3 niveles y diferencia media < 0,05, gris 270x480): **0,000 s** (0 de 670 cuadros quietos, 0 idénticos al anterior). Es la cifra que aparecía en v2.0 como «sin aire muerto».
- **Sin perdonar ese empuje** (gris 108x192, diferencia media entre cuadros consecutivos): hay **plano casi fijo**: **1,250 s en la placa (21,33→22,58 s)**, donde tras el sello de 21,08 s solo corre el zoom lento del visor; 0,83 s en la agenda (11,13 s) con umbral 0,15; y hasta 1,958 s en la foto descartada (4,92→6,88 s) con umbral 0,30.
- **Regla de lectura:** un plano casi fijo solo cuenta como aire muerto si no hay una tarjeta en lectura (0,35 s por palabra + 0,3 s desde que entra en reposo). La parte que queda **fuera de toda tarjeta en lectura es de 0,292 s** en los tres umbrales (con 0,10 y 0,15, en la placa 22,29→22,58 s: c10 pide 1,7 s y se acaba de leer a los 22,28 s; con 0,30, en 13,08→13,38 s); justo bajo el límite de 0,3 s: 7 cuadros. O sea: **cumple, pero por 1 cuadro y con 1,25 s de plano casi fijo dentro de una tarjeta que se está leyendo.**
- La mitad de **audio** de la regla 15 (huecos de voz ≤ 0,3 s) **no se puede medir hasta que haya voz** (ver «Pendientes»).

## Identidad (resumen de `qa/face-gate.txt`)
SCRFD + ArcFace contra las 8 fotos oficiales locales (`videos/lucia-g4-v2/assets/refs-orig/`). Muestra de 14 cuadros: descartada 0,825-0,834 (cara 186-190 px, «poco confiable» para el gate por < 200 px) · foto nueva 0,809-0,812 · **K4 0,706-0,775** · **K1 0,699-0,780** (caras de 173-179 px); máxima diferencia final↔fuente **0,020** (límite 0,02). **Todos los cuadros en reposo:** K4 mínimo 0,682 (4 cuadros < 0,70 de 106), K1 mínimo 0,680 (7 de 123; en v2.0 eran 5 de 112: el CTA más largo usa 11 cuadros más de K1). La fuente ya trae esos cuadros bajos (`PROCEDENCIA`: «el 0,68 del final es por la inclinación; es ella»). El 0,835 de pantalla es el de la foto descartada (el cuadro 24 del master da 0,834). Si se quiere cerrar el cuadro más bajo de K1 sin otro costo: `escenas.k1.media_inicio` a 3 y re-renderizar (no se hizo).

**SHA-256 del final** `out/g3-v2-final-1080x1920.mp4` (33.780.322 bytes):
```
ac032dc76b832c006f1b0d97693270a7c3ec923faa9d1c25d848e346c165193b
```
(`qa/sha256-final.txt`). El render no es bit a bit reproducible entre ejecuciones: este es el hash del que pasó los controles. **Se renderizó desde este `index.html`** (md5 `b1ab1c395e281cc151a8270ddc72f29e`, sha256 `9d29371c1edff4f82348a7314636d77dc61962822a2282e79f32812908787600`; índice construido a las 05:33 UTC y master de 05:37 UTC; el índice se reconstruyó a las 05:59 para comprobar la idempotencia: la fecha del archivo es posterior, el md5 es el mismo). Render alto: captura 1 min 55 s, exit 0 a la primera (sin 137); preview 360p con el mismo `index.html`.

## Pendientes y dudas abiertas (para la madre)
1. **Voz:** no existe. Hay que generarla (cupo: 401 car > 381 hasta el 13-oct 01:17 UTC) y medirla; la estimación de 17 car/s tiene ±10 %.
2. **Mitad de audio de la regla 15 (probable problema de diseño, medido con tonos sintéticos, no con voz):** probé `poner-voz.mjs` con 12 pistas de tono cuya duración sigue la ventana de `duraciones.json` (pausa efectiva 0,253-0,291 s) y `silencedetect` (−35 dB, 0,3 s) midió **8 silencios de 0,30-0,33 s**, o sea 3 en 10 s cuando la regla de G5 tolera 1. El detector alarga cada pausa ~0,04 s sobre la real, así que **una costura fija de 6 cuadros (0,25 s) no deja margen**. Opciones (no tocadas, mueven costuras): costuras de 5 cuadros, o que la mezcla adelante cada pista 3-4 cuadros hacia la costura. Con voz real puede variar (los bordes de la voz no son los de un tono).
3. **K1 y K4 con cuadros sueltos bajo 0,70** (ver Identidad): decisión de la madre si se acepta o se mueve la ventana de K1.
4. **Cómo se ve con la interfaz de Instagram** en un teléfono: no verificado (solo el ancho de 390 px y las guías de zona segura).
5. **`videos/lucia-entrega/`:** copiar el master y su SHA al README de esa carpeta y marcar G3 v1 como reemplazada (no se tocó).
6. **Skill `lucia/montaje-hyperframes.md`** (no se tocó): trampas nuevas de esta pasada: la voz se mide en caracteres; `media_inicio` «auto»; usar más del final de un clip puede meter cuadros de identidad baja (K1 n132); `grep-prohibidas` por zona (video vs pie); `silencedetect` alarga las pausas ~0,04 s.
7. La «regla 15» sigue sin escribirse en `edicion-referentes` (llega a la 14; anotado en `cola/loop/lucia.md`).

## Cuando llegue la voz
1. Generar el audio de `guion-voz.txt` línea por línea (12 pistas `t01`…`t12`, wav/mp3/m4a/aac/flac; **no se generó ninguna: 0 créditos**).
2. `node scripts/poner-voz.mjs --medir DIR` mide la voz útil de cada pista y escribe `duraciones.json`.
3. `node scripts/build.mjs`: cada ventana pasa a ser `ceil(voz real × 24)` cuadros y las tarjetas, empujes y clips se mueven solos con `T<n>`; `media_inicio` de K4 (el cuadro 120 en `T10−12`) y K1 se recalculan; si algo no cabe (una tarjeta que ya no se lee entera, la duración fuera de 26-30 s) el build corta y dice qué ajustar. Luego `node scripts/voz-tabla.mjs`, `hyperframes check`, los controles de «Reproducir», render (bajo `flock`) y mux en silencio.
4. `node scripts/poner-voz.mjs DIR` mezcla a −14 LUFS (sin cama de música, sin acelerar la voz) y mide huecos con `silencedetect` y el volumen con `ebur128` (ver «Pendientes» 2).

## Reproducir
```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
node scripts/build.mjs                       # copia el material del kit si falta, valida y escribe index.html + plan-resuelto.json (dos veces = mismo md5)
                                             # ⚠️ las imágenes derivadas (descartada.jpg, letrero-inset.jpg, ag-inset1/2.jpg, k4cuadros/) se generan SOLO si faltan: al cambiar sus cajas o el sigma en plan.json, borrarlas antes
node scripts/voz-tabla.mjs                   # qa/voz-tramos.txt (sale con 1 si una línea no cabe)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 check
# 1) PREVIEW 360p REAL primero (~1 min)
node scripts/borrador-360.mjs renders/draft360 && (cd renders/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o ../draft360.mp4)
# 2) recién después el final (~2-5 min, 4 núcleos, sin GPU)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 27.9166667 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g3-v2-final-1080x1920.mp4
for s in medir-dom hueco-tarjetas ventanas eventos costuras grep-prohibidas; do node scripts/$s.mjs; done     # (eventos.mjs: redirigir a qa/eventos-visuales.txt)
node scripts/aire.mjs out/g3-v2-final-1080x1920.mp4 > qa/aire.txt; node scripts/vacios.mjs out/g3-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
node scripts/psnr-clips.mjs out/g3-v2-final-1080x1920.mp4; node scripts/fotos-psnr.mjs out/g3-v2-final-1080x1920.mp4
COLS=6 bash scripts/hoja.sh out/g3-v2-final-1080x1920.mp4 hoja.jpg 300 f0 f12 f24 …     # «fNNN» = cuadro NNN exacto
# identidad (venv y modelos ya instalados): $V -I scripts/face_identity_qa.py manifest.json  con FACE_QA_MODELS=…/face_models (ver qa/face-gate.txt)
```
