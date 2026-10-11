# Lucía · G3 v2 «Tres errores que casi publico» (27,458 s, 1080x1920, 24 fps, muda y lista para la voz)

Re-corte de `videos/lucia-g3/` (58 s, muda, con mucho tiempo muerto) pedido por la madre el 11-oct-2026: **26-30 s, sin aire muerto (regla 15) y cronometrado como si hablara**.
Montaje con HyperFrames 0.8.142 y el método de `.claude/skills/lucia/montaje-hyperframes.md`. **Costo: 0 créditos** (fotos y clips ya pagados: descartada K4·1 `6708e444`, buena `eddca486`,
agenda `1422fa94`, clip K4 `338b751f`, clip K1 `e470ef4f`). **No se llamó a Higgsfield, ElevenLabs ni a ningún servicio; hoy NO hay voz: la pista es AAC en silencio** (−91 dB).
Estado: **PARA VER POR LA MADRE (preview 360p). No se publica nada.** No se nombra ninguna herramienta ni modelo (aviso del 11-oct sobre nombrar herramientas: G3 no las nombra, el pie no cambia y la lista de prohibidos de `grep-prohibidas.mjs` queda igual).

| Qué | Dónde |
|---|---|
| **Guion de voz** (12 líneas = 12 tramos, 438 caracteres; 449 con saltos de línea; cupo 450) | `guion-voz.txt` |
| Plan en CUADROS o expresiones `T<n>`/`L<n>`/`END` (inicio/fin del tramo de voz n) | `plan.json` |
| Plan resuelto en segundos (lo escribe el build y lo leen los controles) | `plan-resuelto.json` |
| Generador: calcula los tramos desde `guion-voz.txt`, valida reglas y cifras contra `PROCEDENCIA.jsonl`, escribe `index.html` | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Preview 360p (render REAL de HyperFrames a 360x640, no un reescalado) | `qa/g3-v2-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (git lo ignora) | `out/g3-v2-final-1080x1920.mp4` |
| Pie para publicar (abre con «Personaje hecho con IA»; verificado por el build) | `pie.txt` |
| QA mirado y medido | `qa/` (ver «QA») |

## Voz: los 12 tramos (3,6 palabras por segundo, 6 cuadros = 0,25 s entre líneas)
Cada tramo dura `palabras / 3,6` s (al cuadro entero más cercano); entre línea y línea hay 6 cuadros (0,25 s), que es donde cae cada empuje de pantalla completa. Tras la última palabra quedan 13 cuadros (0,54 s) para que el CTA termine de leerse.
Total: 87 palabras, 438 caracteres sin saltos (449 con 11 saltos), 27,458 s. Cuando haya voz, se mide la duración real de cada línea y se retemporiza (ver «Cuando llegue la voz»).

| Tramo | Voz (s) | Pal. | Car. | Línea de voz (voseo) | Pantalla |
|---|---|---:|---:|---|---|
| T1 | 0,000–2,208 | 8 | 39 | Tres errores de la IA que casi publico. | foto descartada; tarjeta c1 y rótulo de IA ya en el cuadro 0; aro 1,5 s; recorte del letrero 1,9 s |
| T2 | 2,458–4,417 | 7 | 35 | Uno: pedí sin letreros y salió uno. | c2 «1 · Letrero que no pedí.»; etiqueta «Orden: «no signs anywhere»» |
| T3 | 4,667–7,167 | 9 | 42 | La cara pasó el control, pero el fondo no. | c3 «La cara pasó. El fondo, no.»; marco de la cara; etiqueta «Cara: 0,835 · aprobada» |
| T4 | 7,417–9,375 | 7 | 42 | Mi regla: mirar también el fondo, siempre. | empuje → foto nueva; c4 «Mirar también el fondo.»; etiqueta «Foto nueva» |
| T5 | 9,625–11,833 | 8 | 42 | Dos: la letra de la agenda parece escrita. | empuje → agenda; c5 «2 · Letra que parece escrita.»; recorte ampliado de la libreta con su recuadro de origen |
| T6 | 12,083–13,208 | 4 | 21 | Fijate: no dice nada. | c6 «Sin mensaje.»; recorte ampliado de la nota amarilla (en foco) |
| T7 | 13,458–15,667 | 8 | 37 | Si no se lee, no sirve para publicar. | c7 «No se lee, no sirve.» |
| T8 | 15,917–18,125 | 8 | 35 | Tres: una mano tapa a la otra mano. | empuje → clip K4; c8 «3 · Una mano tapa la otra.»; contador «cuadro N»; la otra mano entra en el cuadro 60 (17,583 s) |
| T9 | 18,375–20,333 | 7 | 36 | Si cruza, no puedo contar los dedos. | c9 «Si cruza, no cuento.»; las tres cruzadas (cuadros ~63-78, ~87-93, ~102-108) caen dentro de esta línea |
| T10 | 20,583–22,542 | 7 | 27 | Y cuento solo lo que se ve. | empuje → placa; c10 «Cuadro 120: cinco dedos.»; cuadro 120 ampliado y sello «5 dedos» (la ceremonia: 1,96 s en reposo) |
| T11 | 22,792–25,292 | 9 | 49 | Por eso reviso cuadro a cuadro antes de publicar. | empuje → clip K1; c11 «Reviso cuadro a cuadro.» |
| T12 | 25,542–26,917 | 5 | 33 | Seguime: cada semana, una prueba. | c12 CTA «Seguime: cada semana, una prueba.» (24,958–27,458 s = 2,5 s en pantalla) |

## Tabla de cortes (t, capa, texto)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000–7,417 | **Foto descartada** a pantalla completa (letrero inventado difuminado) con empuje lento 1,00→1,03 | rótulo «Lucía Antelo · personaje IA de Onia» 0–3,0 s a **40 px** (sale 3,0–3,25) · c1 «Tres errores que casi publico.» (**ya en el cuadro 0**, 0–2,458) · aro verde sobre el letrero a 1,5 s · recorte ampliado del letrero con la leyenda «Difuminado al editar» (1,917–4,167) · c2 «1 · Letrero que no pedí.» (2,458; «no pedí.» a 3,625) · «Orden: «no signs anywhere»» (2,667–4,667) · c3 «La cara pasó. El fondo, no.» (4,667; «El fondo, no.» a 5,917) · marco de la cara 4,917 · «Cara: 0,835 · aprobada» (4,750–7,000) |
| 7,167–9,625 | **Foto nueva** sin letrero (llega con empuje 7,167–7,417) | c4 «Mirar también el fondo.» (arriba, en el cielo; «el fondo.» a 8,5) · «Foto nueva» |
| 9,375–15,917 | **Foto de la agenda** (empuje 9,375–9,625) | c5 «2 · Letra que parece escrita.» (9,625; «parece escrita.» a 10,875) · recorte 1 (9,958–12,167, recuadro verde de origen en la foto) · c6 «Sin mensaje.» (12,083; «mensaje.» a 12,875) · recorte 2, la nota amarilla en foco (12,417–15,5) · c7 «No se lee, no sirve.» (13,458; «no sirve.» a 14,875) |
| 15,667–20,583 | **Clip K4 a 1×**, cuadros 14 a 131 de 145 (empuje 15,667–15,917). El cuadro 120 cae a 20,083 s | c8 «3 · Una mano tapa la otra.» (15,917; «tapa la otra.» a 17,583, cuando entra la otra mano) · contador «cuadro N» (uno por cuadro) · c9 «Si cruza, no cuento.» (18,375; «no cuento.» a 18,958) · recuadro «origen» y destello del contador en los cuadros 120-125 (20,083–20,333) |
| 20,333–22,792 | **Placa oscura** (empuje 20,333–20,583; no se congela a Lucía) | c10 «Cuadro 120: cinco dedos.» (20,583) · visor con el cuadro 120 ampliado + «cuadro 120» · sello «5 dedos» a 21,083 |
| 22,542–27,458 | **Cierre: clip K1**, cuadros 20 a 137 de 145 (empuje 22,542–22,792) | c11 «Reviso cuadro a cuadro.» (22,792; «a cuadro.» a 23,792) · c12 CTA «Seguime: cada semana, una prueba.» (24,958–27,458; «una prueba.» a 26,375) |

Costuras: cinco empujes rígidos de 6 cuadros a la izquierda (0,25 s, `power3.inOut`), cada uno **dentro del hueco de voz de 6 cuadros** entre dos líneas (T3→T4 7,167–7,417; T4→T5 9,375–9,625; T7→T8 15,667–15,917; T9→T10 20,333–20,583; T10→T11 22,542–22,792). Las tarjetas viajan con el empuje.
El cuadro n del clip cae donde dice el plan (PSNR contra la fuente, abajo), así que el 120 es el 120.

## Qué se quitó de G3 (58 s → 27,458 s) y por qué
| Se quitó | Por qué |
|---|---|
| Pantalla partida descartada/buena con los dos morphs (4 s), «Descartada. Una foto, 1 crédito.», «Fondo: letrero inventado (difuminado)», «Con letrero» | Eran evidencia del error 1 repetida; la regla (mirar el fondo) se dice sobre la foto nueva en 2,2 s. Con ellas desaparece el «1 crédito»: v2 no lleva ninguna cifra de costo |
| Tarjetas de 4-5 s sobre fotos fijas (aire muerto) | Cada tarjeta dura ahora lo de su línea de voz (1,4-2,8 s) y siempre dentro de su tiempo de lectura + 0,3 s |
| Placa de evidencia de 7,5 s con los cuadros 72 y 104 | La ceremonia de contar dedos se comprime a **1,96 s en reposo** (cuadro 120 ampliado + sello). Las cruzadas ahora se ven en vivo, con el contador, dentro de «Si cruza, no puedo contar los dedos» |
| Error 2 de 13 s | 6,5 s: el mismo recorte de la libreta y el de la nota amarilla, con una tarjeta por línea de voz |
| Clip K4 completo (6,04 s) | Se usan los cuadros 14-131 (4,9 s): la mano entra y cruza dentro de las líneas T8-T9 |
| Etiqueta «Letrero difuminado al editar» como pastilla aparte | Pasó a ser la leyenda del recorte ampliado del letrero (misma declaración: el difuminado es de edición) |
| Rótulo de 34 px y 2,4 s | Ahora 40 px y 3,0 s completos (regla de marca) |

Se **conservó**: el gancho en los 3 primeros segundos (título de 5 palabras con la promesa en el cuadro 0 y la prueba —el aro y el recorte del letrero— antes de los 3 s), los tres errores con su evidencia en pantalla (letrero inventado, letra que no dice nada, mano que tapa a la otra), la idea de que se revisa cuadro a cuadro antes de publicar, la regla y el cierre.

## Decisiones que la madre puede revertir
1. **Título «Tres errores que casi publico.»** en vez de «Tres errores de la IA.» (G3) y voz «…casi publico» (es la propuesta de `PLAN.md` §5: «Casi publico esto.»). Revertir: línea 1 de `guion-voz.txt` y `c1` en `plan.json`.
2. **Empuje lento 1,00→1,03 en las fotos** y 1,00→1,05 en el visor de la placa (`plan.json → escenas.*.zoom`, `scripts/timeline.js`): evita cuadros idénticos. Quitarlo deja las fotos quietas, pero entonces el control de aire de diseño (0,25 s) es el único que lo sostiene.
3. **El CTA entra 14 cuadros (0,58 s) antes de su línea de voz** y la video queda 0,54 s tras la última palabra: así el CTA exacto está **2,5 s** en pantalla (regla: 2,4-5,5 s) sin que la tarjeta anterior pierda su lectura. Revertir: `c12.a` y `voz.cola_cuadros`.
4. **Tarjetas más cortas que la voz** («Sin mensaje.», «No se lee, no sirve.», «Si cruza, no cuento.», «Mirar también el fondo.»): una tarjeta que sale con un empuje pierde 6 cuadros de lectura, así que se acortaron para que se lean enteras aunque haya empuje (`ventanas.mjs` lo mide en el DOM).
5. **Sin cifras de costo.** «1 crédito» salió con la pantalla partida. Las únicas cifras en pantalla son 1/2/3 (numeración), 0,835 y 120 (los dos validados contra `PROCEDENCIA.jsonl` por el build, que corta si cualquier otra cifra aparece).
6. **El letrero «Equperarto» sigue difuminado** (decisión de G3 que sigue en pie): ya difuminado no se lee ninguna letra, pero el **arco rojo** de arriba sigue viéndose como mancha roja (riesgo residual bajo). Mostrar el nombre inventado como texto propio sigue siendo decisión de la madre.
7. **H9 de G3 sigue abierta:** el error 3 no es una mano mal dibujada sino un límite de verificación (las manos son correctas en todos los cuadros). La voz dice «una mano tapa a la otra mano» y «no puedo contar»; si se prefiere «una mano que tapa y no deja verificar», se cambia la línea T8.
8. **Voz sin nombrar herramientas** (ver arriba). Si se nombra alguna, `pie.txt` agrega «Nombro lo que uso; no es una recomendación pagada.» y se quita de `grep-prohibidas.mjs`.

## QA (final `out/g3-v2-final-1080x1920.mp4`)
Todos los resultados están en `qa/`. Resumen y resultado:

__QA__

## Cuando llegue la voz
1. Generar el audio de `guion-voz.txt` línea por línea (no se generó ninguno: 0 créditos) y medir la duración real de cada línea.
2. Si la voz de Marcela habla a un ritmo distinto de 3,6 palabras/s, cambiar `voz.palabras_por_s` en `plan.json` (o, mejor, fijar `dur_s` real por tramo en `build.mjs`) y volver a correr `node scripts/build.mjs`: los tramos, tarjetas, empujes y el clip K4 se mueven solos con `T<n>`. **El cuadro del clip K4 que cae en `T10−12` (el 120) y las costuras en el hueco de voz se validan en el build**; si el ritmo cambia mucho, `build.mjs` corta y dice qué ajustar (la tarjeta que ya no se lee entera, el cuadro 120 que se corre).
3. Mezclar el audio sobre la pista AAC en silencio (−14 LUFS, sin cama de música, pausa máxima 0,25 s) y volver a correr los controles de abajo.

## Reproducir
```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
node scripts/build.mjs                       # copia el material del kit si falta, valida y escribe index.html + plan-resuelto.json
                                             # ⚠️ las imágenes derivadas (descartada.jpg, letrero-inset.jpg, ag-inset1/2.jpg, k4cuadros/) se generan SOLO si faltan: al cambiar sus cajas en plan.json, borrarlas antes
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 check
# 1) PREVIEW 360p REAL primero (~1 min)
node scripts/borrador-360.mjs renders/draft360 && (cd renders/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o ../draft360.mp4)
# 2) recién después el final (~4,5 min, 4 núcleos, sin GPU)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 27.4583333 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g3-v2-final-1080x1920.mp4
for s in medir-dom hueco-tarjetas ventanas eventos costuras grep-prohibidas; do node scripts/$s.mjs; done
node scripts/aire.mjs out/g3-v2-final-1080x1920.mp4 > qa/aire.txt; node scripts/vacios.mjs out/g3-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
node scripts/psnr-clips.mjs out/g3-v2-final-1080x1920.mp4; node scripts/fotos-psnr.mjs out/g3-v2-final-1080x1920.mp4
COLS=6 bash scripts/hoja.sh out/g3-v2-final-1080x1920.mp4 hoja.jpg 300 f0 f12 f24 …     # «fNNN» = cuadro NNN exacto
```
