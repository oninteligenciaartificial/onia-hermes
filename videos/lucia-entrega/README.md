# Entrega de Lucía — G1, G3, G2, G4, G5 y los carruseles L01, C1, C2 (9-oct-2026)

Videos finales de Lucía listos para publicar. **Cualquiera con la llave del VPS los publica en un paso**; esta sesión de la
nube no tiene cliente `ssh` y la decisión de la madre (8-oct) es que la llave vive solo en la sesión «Onia».

| Orden | Pieza | Archivo | Duración | Pie | Preview 360p (la mirada de la madre) |
|---|---|---|---:|---|---|
| 1 | G1 «Este video no fue grabado: así se hace, en 3 pasos» | `g1-final-1080x1920.mp4` | 56 s | `../lucia-g1/pie.txt` | `../lucia-g1/qa/g1-preview-360p.mp4` |
| 2 | G3 «Tres errores de la IA que atrapé antes de publicar» | `g3-final-1080x1920.mp4` | 58 s | `../lucia-g3/pie.txt` | `../lucia-g3/qa/g3-preview-360p.mp4` |
| 3 | G2 «La misma foto, seis clips: ¿quién pierde la cara?» | `g2-final-1080x1920.mp4` | 58 s | `../lucia-g2/pie.txt` | `../lucia-g2/qa/g2-preview-360p.mp4` |
| 4 | G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» (**guion APROBADO por la madre el 10-oct**; sale solo con «mostrada, publicá G4») | `g4-final-1080x1920.mp4` | 59,75 s | `../lucia-g4/pie.txt` | `../lucia-g4/qa/g4-preview-360p.mp4` |
| 5 | G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (**guion APROBADO por la madre el 10-oct**; sale solo con «mostrada, publicá G5»; guion: `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`) | `g5-final-1080x1920.mp4` | 57,5 s | `../lucia-g5/pie.txt` | `../lucia-g5/qa/g5-preview-360p.mp4` |

> ⚠️ **CORRECCIÓN (11-oct, ~07:45 UTC, revisión 2 de G2 v2.2 + `job_display` de 4afffb96).** El «exceso ≈ 0,026 / 0,012, dentro del ruido» de la tabla de abajo **NO está sostenido**: la foto de arranque K1 (4afffb96, Seedream 4.5) se
> generó con R1, R3, R6 y R7 como entrada, así que TODOS los clips con K1 descienden de esas fotos y los «controles» no son independientes (el exceso real puede ser mayor). La única base limpia son las 4 fotos que nadie recibió
> (R2, R4, R5, R8). Se mide la **prueba estricta** contra esas 4 (sección final de `medicion-sin-refs-entrada-20261011.txt`) y los pies/etiquetas de G2 v2, G5 v2 y la pieza 9 se reescriben con esos números, sin «≈ 0,03 dentro del ruido».

> **Tabla viejo contra nuevo (11-oct, `medicion-sin-refs-entrada-20261011.txt`; 0 cr).** A = contra las 8 fotos (lo publicado); B = contra solo las fotos que el motor NO recibió. El B−A crudo no es la fuga: las fotos R2, R4 y R8 puntúan bajo en todos los clips,
> así que el número que cuenta es el exceso sobre los controles sin entradas.
>
> | Clip (fotos recibidas) | A inicio → fin | B inicio → fin | B−A (media) | Exceso por fuga (tras control) | Cara |
> |---|---|---|---:|---:|---|
> | Seedance 2.0 Mini + refs (R1, R3) | 0,707 → 0,801 | 0,679 → 0,761 | −0,042 | **−0,026** | 139 → 347 px |
> | Kling O3 (R1, R3, R6, R7) | 0,798 → 0,824 | 0,753 → 0,749 | −0,068 | **−0,012** | 89 → 168 px (poco confiable) |
> | Kling 3.0 std (control, ninguna) | 0,791 → 0,721 | igual | 0 | — | 115–120 px |
> | Cinematic Studio 3.0 (control) | 0,785 → 0,771 | igual | 0 | — | 117–238 px |
>
> Los dos excesos quedan dentro de ±0,03: la fuga existe (el coseno a R1 y R3 de Seedance supera en +0,126 al de las otras seis) pero se diluye en el centroide de 8. `lucia-qa-tabla.mjs` no se usó: lee el JSON del face-gate y esta medición sale de
> `.claude/skills/lucia/scripts/parecido_sin_refs.py`, que tiene su propio formato.

> ✅ **RETENCIÓN LEVANTADA el 11-oct ~09:15 UTC:** G2 v2.4, G5 v2 (pie) y la pieza 9 v3.1 ya llevan la divulgación del sesgo de referencias con la prueba estricta (contra R2, R4, R5, R8). El texto de abajo queda como historia del hallazgo.
>
> 🛑 **(HISTORIA) Retención de G2 v2 (y revisión de G5 v2 y la pieza 9) — hallazgo del 11-oct, ~07:00 UTC, medido con `job_display` (0 cr).** El parecido se puntúa contra 8 fotos oficiales, y dos clips
> RECIBIERON fotos de esas 8 como referencia de entrada: **Seedance 2.0 Mini + referencias** (R1 y R3 de 3 referencias; la tercera es la selfie «look ancla») y **Kling O3** (R1, R3, R6 y R7 de 5; la quinta es la selfie).
> Sus parecidos finales (0,80 y 0,82), que en G2 son «los mejores», están favorecidos; los clips sin referencias (Kling 3.0 std/pro, Seedance sin refs, Cinematic Studio) no. El medidor está calculando el parecido
> contra SOLO las fotos que cada motor no recibió (`hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt`). Hasta tenerlo y corregir pantalla y pie, **G2 v2 no se
> muestra como «LISTA PARA MOSTRAR» sin esta advertencia**. G5 v2 usa el 0,80 de Seedance+refs solo como ejemplo del letrero inventado: **resuelto el 11-oct con una frase en el pie** (sin re-render, master intacto). **Medido:** el exceso atribuible a la fuga es ≈ 0,026 (Seedance+refs) y ≈ 0,012 (Kling O3), dentro del ruido de ±0,03; casi toda la caída contra las fotos no recibidas es efecto del subconjunto (R2, R4 y R8 puntúan bajo en todos los clips). G4 compara motores de imagen que recibieron las mismas referencias
> (comparación pareja, número absoluto inflado).

> ⚠️ **No publicar las v1 de G2, G3, G4 y G5.** Las de G2, G4 y G5 llevan «Motor 1 a 6» / «Imagen A a F» (D-N1 del 11-oct pide los nombres reales); la de G3 (58 s) queda reemplazada por su v2 (27,9 s, regla 15 de aire muerto). Las reemplazan las v2 mudas de ≤ 30 s en
> `../lucia-gN-v2/` (estado y SHA en la sección «Re-cortes v2» más abajo; G3 también tiene v2, recortada por la regla 15 de aire muerto, no por nombres).
> G1 v2 (con voz Marcela, hecha por la madre) llega aparte: falta su SHA.

SHA-256 de lo entregado:

```
5903cd9c6c65bc134ca8c0faf83432007197399b95a8cb31ff901bdca7516ca7  g1-final-1080x1920.mp4
75642fd093569109a4adb3346dda13afe5991dcd0e3eb430b62c1c080c17a3e3  g3-final-1080x1920.mp4
429793f0ff2f544cc2185f29c83916d76c47adf632ab9df6fb7c95a2448d46e6  g2-final-1080x1920.mp4
ec4c450f3e0c4f682b675b65ef913a2e1e0400d31b29c35aa948119bf702f997  g4-final-1080x1920.mp4
6eed3adecbaf2eea5b31cfc00edf0fad41cdaa3a70200c2424ea5e0e4931f136  g5-final-1080x1920.mp4
```

- G1 y G3 son **byte por byte** el render que pasó el QA (`../lucia-gN/out/`, ignorado en git).
- G2 es el mismo render recodificado a 6 Mbps máx. para que entre en git (61 → 16,7 MB): PSNR contra el original 47,9 dB
  de promedio y 43,8 dB en el peor cuadro, o sea sin diferencia visible; misma duración (58,00 s), 24 fps, audio silencioso copiado.
- G4 también está recodificado a 6 Mbps máx., crf 18 (60,4 → 21 MB; PSNR 49,2 dB de promedio, 44,2 dB en el peor cuadro).
- G5 (3ra pasada, 9-oct: «cabe en ±0,03», «el medidor avisa: lo reviso a ojo», «lo inventó el motor») también está recodificado a 6 Mbps máx., crf 18 (37,8 → 13,1 MB; master SHA-256 `133346a5fbec4ebfe2f523ca2a4598ee0d9cd6f232d2ee654a4d85ba7564aaea`; PSNR 50,6 dB de promedio (53,0 dB promediando los cuadros), 43,97 dB en el peor cuadro).
- Todos son 1080×1920, H.264 + AAC (silencioso: D4, sin voz ni música), 24 fps.

## Re-cortes v2 (mudos, ≤ 30 s, nombres reales D-N1, regla 15) — estado y SHA

Reemplazan a las v1 de G2, G4 y G5. **Mudas, 0 créditos.** Nada sale sin «mostrada, publicá <pieza>» de la madre; el pie de cada una es nuevo y también pasa por ella.
La voz (Marcela) se mezcla después y **cambia el SHA**: hay que repetir el QA de audio (−14 LUFS, pico verdadero, `silencedetect`).

| Pieza | Archivo | Duración | SHA-256 | Estado |
|---|---|---:|---|---|
| G5 v2 «Cómo mido si una cara es la de Lucía» | `g5-v2-final-1080x1920.mp4` | 26,625 s | `030e8f65aabc0fddda83f234acebb410b951b7b81c3dc9c2657410f5ec399b3f` | **LISTA PARA MOSTRAR** (11-oct): revisión 1 aplicada, cara medida con ArcFace sobre este master (diferencia final↔fuente ≤ 0,009), cuadros mirados, SHA/specs/pie/cifras contados por verificador haiku y gates de lectura re-corridos por la madre (0 de 639 cuadros sin tarjeta, ventanas y frases prohibidas exit 0); pie en `../lucia-g5-v2/pie.txt` |
| G2 v2.4 «Misma orden, seis clips: ¿quién pierde la cara?» | `g2-v2-final-1080x1920.mp4` | 27,792 s | `1eb22374d77ca744f2c18c946d1adb72662a76b01912a09d9e9fd56cd1a778a8` | **LISTA PARA MOSTRAR** (11-oct, v2.4; reemplaza a la de SHA `1b12e832…`): 3 revisiones independientes aplicadas (`../lucia-g2-v2/qa/revision-1..3.md`: 9 + 7 + 5 hallazgos, ninguno ALTA), verificador haiku (47 chequeos; sus FALLA son de alcance, ver el README de la carpeta), `lucia-prohibidas.mjs` exit 0, 78 mutaciones rechazadas, ArcFace final↔fuente ≤ 0,015; `lucia-qa-tabla.mjs` sale 1 por diseño (el clip de Seedance 2.0 Mini sin referencias queda bajo el piso: es la tesis); divulgación del sesgo de referencias en el gancho, el clip de Kling O3, la lección y el pie; pie en `../lucia-g2-v2/pie.txt` |
| G3 v2 «Tres errores que casi publico» | `g3-v2-final-1080x1920.mp4` | 27,917 s | `ac032dc76b832c006f1b0d97693270a7c3ec923faa9d1c25d848e346c165193b` | **LISTA PARA MOSTRAR** (11-oct): revisión 1 aplicada (10 hallazgos), cara medida con ArcFace por el editor y repetida por la madre en 8 cuadros (coinciden al milésimo), SHA, specs, pie y cifras contados por verificador haiku, gates de lectura re-corridos por la madre (0 de 670 cuadros sin tarjeta, ventanas, frases prohibidas exit 0), cuadros mirados; pie en `../lucia-g3-v2/pie.txt` |
| G4 v2 «Seis motores de imagen, una cara» | `g4-v2-final-1080x1920.mp4` | 28,042 s | `13cdd1d2f5f0ab2eef1fb0ffd065007d47bf5946a2bb15a5bd24c435142d2a43` | **LISTA PARA MOSTRAR** (11-oct): revisión 1 aplicada (10 hallazgos), cara medida con ArcFace sobre este master (diferencia final↔fuente ≤ 0,012), gates de lectura re-corridos por la madre (hueco-tarjetas, ventanas 35/35, frases prohibidas exit 0), cuadros mirados; pie en `../lucia-g4-v2/pie.txt` |
| P9 «¿La cara o la escena?» (pieza 9, composición de Codex `codex:lucia-p9`) | `p9-final-1080x1920.mp4` | 20,000 s | `49b40ea55dc67f784ae479964d50c8cc3119cff0be557c32b0ee37f0b92a9e04` | **LISTA PARA MOSTRAR** (11-oct, v3.1): 3 revisiones independientes aplicadas (`../lucia-p9-luz-cara/qa/revision-1..3.md`: 11 + 7 + 6 hallazgos, ninguno ALTA al final), verificador haiku 0 FALLA (SHA, specs, pie, frases retiradas ausentes, cifras trazadas), gates `lucia-prohibidas.mjs` exit 0 y `lucia-qa-tabla.mjs` exit 0 (5 cuadros, ninguno bajo 0,70; `qa/qa-tabla-v31.md`), 56 mutaciones rechazadas, ArcFace master↔fuente ≤ 0,017; pie en `../lucia-p9-luz-cara/pie.txt` |

Pendiente en la pieza 9 (decisiones de la madre): **(1)** la placa final es densa en mudo: 40 palabras nuevas de lectura (tope de diseño ≈ 36) y la lectura estricta en orden suma 17,6 s contra 8,2 s; cada texto cumple su ventana y con voz (L5 «una toma», L6 «brillo») es razonable; si se prefiere, se saca la nota de brillo de pantalla. **(2)** La voz son 311 caracteres (cupo 381), pero el cronograma tiene margen de 0,05 s y la voz real debe hablar ≥ 16,85 car/s; la L4 (96 caracteres) no admite retoma. **(3)** El aviso de la pastilla de Seedance entra a 6,0 s, un cuadro después del dato. **(4)** El límite de cara es de 15 palabras («Kling siempre; Seedance al inicio»). **(5)** Sesgo de referencias: ambas tomas parten de K1, que se hizo con R1, R3, R6 y R7 de las 8 fotos de puntaje; el pie lo dice y da la prueba estricta contra R2, R4, R5 y R8 (Kling 0,72 → 0,67, Seedance 0,64 → 0,73: el sentido no cambia).

Pendiente en G2 v2 (decisiones de la madre): **(1)** el gancho dura 3,75 s y no 3,417 (c1 y c2 de 4 palabras no alcanzaban su lectura); revertible con una tarjeta c2 de 3 palabras. **(2)** Regla 15: el mayor tramo quieto es 1,000 s, bajo la tarjeta «Mi piso» en lectura; sin tarjeta en lectura 0,250 s (tope 0,3). **(3)** El último cuadro del cierre da 0,699 contra 0,708 en la fuente, a 0,001 del piso (ruido ±0,01); ninguna cifra de pantalla se apoya en él. **(4)** Cinematic Studio 3.0 y Kling O3 salen con esos nombres; el catálogo los lista «Cinema Studio Video 3.0» y «Kling 3.0 Omni». **(5)** La voz son 402 caracteres contra 381 de cupo hasta el 13-oct 01:17 UTC (≈ 21 de más; ≈ 520 con retomas). **(6)** Corregido por la madre al verificar: el pie decía «el parecido final es el del segundo 5,9» para todos los clips y solo Kling 3.0 std tiene ese segundo registrado (Cinematic Studio termina en 3,85; los otros cuatro tienen 7 puntos sin su segundo en PROCEDENCIA): ahora dice «el último punto medido de cada clip (en Kling 3.0 std, el segundo 5,9)». **Sin corregir (pide re-render):** el rótulo en pantalla «Final = segundo 5,9, que no se ve entero» es exacto para Kling 3.0 std y aproximado para Seedance 2.0 Mini y Kling O3; y `plan.json` (medios[6].capa) dice «ninguno bajo 0,70» cuando el cuadro 660 da 0,699 (nota interna, no sale en pantalla). No hecho, opcional: subir la nota del segundo 5,9 a la tarjeta del clip (recarga la zona segura).

Pendiente en G3 v2 (decisiones de la madre): **(1)** la identidad de la cara en los clips K1 y K4 baja de 0,70 en 11 de 229 cuadros en reposo (mínimo 0,680, caras de 173 a 179 px: poco confiables y dentro del ruido de ±0,03); el «aprobado» de la etiqueta es solo el de la foto descartada (0,835) y el video no dice nada de los clips. **(2)** Con tonos sintéticos, `silencedetect` mide 8 pausas de 0,30 a 0,33 s (3 por cada 10 s; la regla de G5 tolera 1): la mitad de audio de la regla 15 no se cierra hasta tener voz real; opciones, costuras de 5 cuadros o adelantar cada pista 3-4 cuadros. **(3)** El pie nombra Higgsfield, Seedream 4.5, Kling 3.0 std y ArcFace (el medidor); el video no nombra ninguna herramienta. **(4)** Entre los cuadros en reposo hay 4 con diferencia final↔fuente de 0,021 a 0,025 (F484, F485, F592, F640; límite 0,02; caras de K1 de 173 a 179 px, poco confiables): el «máximo 0,020» de `qa/face-gate.txt` es el de su muestra de 14 cuadros. **(5)** La etiqueta «Parecido: 0,835 · aprobado» va sobre la foto que se descartó por el letrero inventado: dice que la cara pasó, no que la foto sirvió; el siguiente cartel lo aclara («La cara pasó. El fondo, no.»).

Pendiente en G4 v2: la lámina dice «Una toma cada uno» y poco después Kling O1 Image y Seedream 4.5 aparecen con una segunda toma (0,35 y 0,83 en el café); el pie lo aclara («Una toma por motor en la primera escena…»), la pantalla no. Decisión de la madre.

**Nombres contra el catálogo de Higgsfield (`models_explore`, 11-oct, consulta gratuita).** Coinciden: Seedream 4.5, Kling O1 Image, Nano Banana 2.1, Seedream 5.0 Pro, GPT Image 2.5 y Seedance 2.0 Mini; «FLUX 3» se lista como «FLUX 3 Image». **Difieren dos nombres de video que G2 y G5 muestran en pantalla y en el pie:** «Kling O3» se lista como **Kling 3.0 Omni** y «Cinematic Studio 3.0» como **Cinema Studio Video 3.0**. «Kling 3.0 std/pro» son los niveles de «Kling v3.0». D-N1 pide el nombre con que Higgsfield lo lista: corregirlo toca `plan.json`, el pie y un re-render en G2 y G5 (G5 ya fue mostrada). Decisión de la madre.

Pendiente en G5 v2: el 0,35 de Kling O1 Image se muestra sin su contrapeso (0,79 y 0,83) dentro del video: solo lo dice el pie (la pastilla del café ya está en su tope de palabras). Decisión de la madre.

## Orden y ritmo (plan v5 §5: hasta 3 piezas por semana, 19:00 La Paz)

| Semana | Pieza | Por qué en ese orden |
|---|---|---|
| 1 · día 1 | **G1** (reel) | Abre la cuenta: enseña el método y declara la IA en el cuadro 0 |
| 1 · día 1-2 | **L01** (carrusel, se fija) | Presentación; va **después** de G1 y se fija al perfil |
| 1 · día 3-4 | **G3** (reel) | Errores que atrapé: confianza y el dato que más se guarda |
| 2 · día 1 | **C1** (carrusel) | Repite G1 en formato guardable con la orden real |
| 2 · día 3 | **G2** (reel) | La prueba de los seis clips; usa lo aprendido en G1/G3 |
| 2 · día 5 | **G4** (reel; guion aprobado el 10-oct, falta «mostrada, publicá G4») | Seis motores de imagen |
| 2 · día 5 / 3 · día 1 | **G5** (reel; guion aprobado el 10-oct, falta «mostrada, publicá G5») | Cómo se mide una cara y cuándo no creerle al número; cierra la serie de pruebas |
| 3 · día 1 | **C2** (carrusel, 6 láminas) | **LISTA PARA MOSTRAR (11-oct, v2):** `hermes-content/carousels/out/lucia-c2-seis-motores-de-imagen/` (láminas, `pie.txt`, `REVISION-1.md`, `QA-*`); incluye la lámina «Ojo con el número» y el aviso del sesgo. Sale después de G4 |

El token de Instagram de Lucía vence entre el 13 y el 18-oct: **la primera pieza tiene que salir antes**, o hay que renovarlo.

## Carrusel L01 «Hola, soy Lucía. No existo.» (presentación, va fijado después de G1)

- Láminas: `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png` (1080×1350). Pie: campo `caption` +
  `hashtags` de `hermes-content/carousels/briefs/lucia/l01-hola-no-existo.json`.
- En el VPS: `node /root/bin/ig-carrusel.mjs --cuenta lucia --dir <carpeta con las 5 láminas> --caption <pie>`; el ensayo debe decir
  «listo en Instagram … etiqueta IA».

## Carrusel C1 «Un video sin grabar, en 3 pasos» (la versión carrusel de G1)

- Láminas: `hermes-content/carousels/out/lucia-c1-un-video-sin-grabar/slide-01..05.png` (1080×1350). Pie: `caption` + `hashtags` de
  `hermes-content/carousels/briefs/lucia/c1-un-video-sin-grabar.json`. Mismo comando que L01.
- Sale **después** de G1 (repite su enseñanza en otro formato y guarda la «orden real» para el que quiera copiarla).

## Antes de publicar (una vez)

> Los dos publicadores ya pasaron `--selftest` en el repo (9-oct, esta sesión): `node ig-reel.mjs --selftest` y `node ig-carrusel.mjs --selftest` dicen
> «selftest ok». En el VPS hay que repetirlo después de copiarlos.

1. Token de Lucía en `/root/.config/onia-publicar/ig-lucia.env` (no se midió desde el 4-sep; vencía entre el 13 y el 18-oct).
   Pasos exactos para ponerlo y renovarlo (camino A si no venció, camino B si venció): `hermes-content/docs/cola/loop/lucia.md`,
   ítem «Renovar el token de Lucía». Una vez puesto, `ig-refrescar.sh` lo renueva cada lunes.
2. `hermes-content/deploy/vps-ops/publicar/ig-reel.mjs` **e** `ig-carrusel.mjs` copiados **juntos** a `/root/bin`, con
   `--selftest` en los dos (el carrusel importa del reel; copiar uno solo rompe los de `@sergiourcullo`).
3. La madre mira los previews 360p de arriba (regla de oro de `CLAUDE.md` § Video).

## Por pieza (en el VPS)

```bash
# ensayo: Instagram procesa y valida, NO publica; debe decir FINISHED
node /root/bin/ig-reel.mjs --cuenta lucia --video g1-final-1080x1920.mp4 --caption pie.txt
# agendado a las 19:00 de La Paz (23:00 UTC) y publicación real
agendar-publicacion.sh lucia-g1 "AAAA-MM-DD 23:00:00" node /root/bin/ig-reel.mjs --cuenta lucia \
  --video g1-final-1080x1920.mp4 --caption pie.txt --publicar
```

Después: abrir el permalink, confirmar «Información de IA» y que `is_ai_generated` quedó en `true` en
`/root/publicar/publicado.jsonl`. El aviso a Sergio Urcullo lleva el enlace.

## Qué NO tocan estas piezas (por eso salen sin el OK pieza por pieza)

Ninguna muestra ni promete una función de Onia, las piezas v1 de G2, G4 y G5 (mudas, de 56 a 59 s) llevan «Motor 1 a 6» e «Imagen A a F»; desde D-N1 (11-oct) las herramientas se nombran, y esas piezas las reemplazan las v2 de ≤ 30 s (`../lucia-gN-v2/`) con los nombres reales. C2 ya está re-renderizada con los nombres, no
hay voz, no hay testimonio, no hay cliente. Greps contra la lista de frases prohibidas en `../lucia-gN/qa/grep-prohibidas.txt`
y control de cara en `../lucia-gN/qa/face-gate.txt`.

## Si se pierde el contenedor

Los renders de `out/` se reconstruyen: `videos/lucia-gN/README.md` dice cómo (clips con `job_display` a 0 créditos, `node
scripts/build.mjs`, render de 3 a 4 min). Esta carpeta es la copia que sobrevive.
