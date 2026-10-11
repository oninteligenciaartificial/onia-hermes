# Cola · Lucía

> **REGLA VIGENTE desde el 10-oct 20:25 UTC (Sergio Urcullo: «mostrame antes de subir o hacer Lucía», por la madre v4).** Nada de Lucía se
> publica ni se genera —tampoco en lote chico— sin que la madre se lo muestre antes y escriba **«mostrada, publicá <pieza>»**. Esto restringe,
> no autoriza. Estado: **G1 ya mostrada** (`g1-final-1080x1920.mp4`, SHA 5903cd9c…) y **espera su OK**. Mi revisión «¿vende Onia Platform?» **no
> cambió G1 ni el orden de entrega**: son propuestas, no piezas hechas. Nada está en «LISTA PARA MOSTRAR» porque no hay nada nuevo que mostrar.
> **Estructura de contenido (pedido de la madre v4, 11-oct): LISTA PARA MOSTRAR.** Semana fija (lun reel «La prueba», mié carrusel, vie reel «El error»), las 9 próximas piezas y lo que falta
> producir: `PLAN.md` §4-bis y §5. Recomiendo la opción B (token nuevo desde Meta) para `ig-lucia.env`. Nada se produce ni se publica hasta su «mostrada, publicá <pieza>».
> **Decisiones de Sergio Urcullo, 11-oct ~04:05 UTC (vía la madre v4): D-N1 = SÍ se nombran las herramientas** (uso propio, no recomendación pagada) y **D4 = la voz Marcela queda con su acento**.
> Hecho: guiones G2, G4, G5 y C2 con los nombres reales (C2 re-renderizada y mirada), `PLAN.md` y skill al día. En curso: los cuatro re-cortes v2 (regla 15) ya con los nombres. **LISTA PARA MOSTRAR** cuando
> terminen y pasen revisión independiente. Sin gasto nuevo: voz y generación paga siguen pidiendo su sí escrito en esta sesión.
> **G1 con voz:** la madre le pone la voz Marcela (ElevenLabs, aprobado por Sergio Urcullo) y avisará el SHA del archivo; entonces actualizo la tabla de entrega. D4 la decidió Sergio Urcullo el 11-oct: Marcela queda con su acento.
> **Modelos y Codex (aviso de la madre v2, 11-oct):** hasta hoy mis subagentes (4 editores de los re-cortes v2 y el revisor de G5) corrieron como `general-purpose`
> SIN `model` explícito (heredan sonnet-5-5). Desde ahora: editores, revisores y arreglos → `sonnet` explícito (`control-identidad`/`editor` de mi sección
> de `ONIA_EQUIPOS_POR_SESION.md`); cuenta/verifica (SHA, duraciones, grep) → `haiku`; `opus` solo gasto, cara o voz. Las composiciones HyperFrames están en la lista
> «siempre a Codex (Sol)»: los 4 re-cortes ya estaban en vuelo en esta nube cuando llegó el aviso (el render y ArcFace viven aquí); la próxima pieza (9) sale como contrato
> en `docs/handoff/codex-tareas/`. Al marcar `[x]` anoto `modelos: …` y `codex:<id>` si hubo.

- [~] Re-cortes MUDOS v2 de G3, G2, G4, G5 (≤30 s, regla 15, nombres reales D-N1) — `videos/lucia-g{3,2,4,5}-v2/`. modelos: editor sonnet (sin `model` explícito) ·
  revisor G5 sonnet (sin `model` explícito) · arreglos G5 sonnet explícito · (11-oct, tarde) editor G4 y revisor G2 también sin `model` explícito (heredan sonnet-5-5); desde aquí `model: sonnet` explícito.
  Estado 11-oct ~05:45 UTC: **G5 v2 LISTA PARA MOSTRAR** (SHA `030e8f65…b3f`, 26,625 s; revisión 1 aplicada; verificada: SHA/specs/pie/cifras por verificador haiku, ArcFace final↔fuente ≤ 0,009, hueco-tarjetas 0/639, ventanas y grep-prohibidas exit 0, cuadros mirados; sin voz; decisión abierta para la madre: el 0,35 de Kling O1 Image lleva su contrapeso solo en el pie) · **G3** revisado (`videos/lucia-g3-v2/qa/revision-1.md`: 0 ALTA · 2 MEDIA · 8 BAJA; la voz no cabe a 17 car/s; `index.html` posterior al render), editor `sonnet` aplicando · **G4** revisado (`videos/lucia-g4-v2/qa/revision-1.md`: aprobado con cambios, 0 ALTA · 4 MEDIA · 6 BAJA; cifras verificadas contra PROCEDENCIA l.97), **G4 v2 LISTA PARA MOSTRAR** (SHA `13cdd1d2…a43`, 28,042 s; revisión 1 aplicada, 10 hallazgos; verificada: SHA/specs/pie/cifras por verificador haiku, ArcFace final↔fuente ≤ 0,012, hueco-tarjetas · ventanas 35/35 · grep-prohibidas exit 0 re-corridos sobre una copia, cuadros mirados; sin voz; el pie ya no dice «una toma cada uno» a secas, la lámina sí) ·
  **G2** revisada (`videos/lucia-g2-v2/qa/revision-1.md`: 0 ALTA · 4 MEDIA · 5 BAJA; «misma foto» es falso para Kling O3, ningún número antes de los 3 s, la voz no cabe a 17 car/s), editor `sonnet` aplicando. Pendiente al cerrar cada una: SHA final en `videos/lucia-entrega/README.md` y commit «LISTA PARA MOSTRAR: <pieza>». La «regla 15» sigue sin escribirse en `edicion-referentes/SKILL.md` (G2 y G4 la aplicaron del encargo): escribirla al cerrar.
  **Sin voz hasta el sí de la madre:** cupo ElevenLabs 381 car hasta el 13-oct 01:17 UTC contra ~437 car del guion G4. **LISTA PARA MOSTRAR** al pasar cada una revisión independiente y quedar commiteada.
- [x] Contrato Codex de la pieza 9 «La cara o la escena» — `hermes-content/docs/handoff/codex-tareas/lucia-p9-luz-cara.md` (commit «CODEX LISTO: lucia-p9»). modelos: contrato escrito en esta sesión
  (sonnet-5-5); ejecución `gpt-6.1-sol` medium, la lanza la madre desde la PC (`codex:` pendiente). Salvedad: el nombre de trabajo «La luz cambia cuando la cara se sostiene» **no se sostiene como regla**
  (Kling O3 sostiene la cara con brillo +2,1; Cinematic Studio con foto sola queda en 0,785 → 0,771): el contrato fija el gancho «La cara o la escena.» y limita la afirmación a los 2 clips mostrados, una toma cada uno.
  La voz del guion propuesto son 298 car (≈ 17,5 s a 17 car/s), no los 341 del primer borrador. Si la madre prefiere otro título, que lo cambie antes de lanzar.
- [ ] Voz Marcela para G3, G2, G5 y G4 v2 (≤ 450 car cada una, ≈ 1.600 en total): guion ≤ 30 s, voz, retemporizar a las duraciones reales (`poner-voz.mjs` de G5 v2 como base), render, SHA nuevo.
  **Espera el sí escrito de la madre y el cupo** (381 car hasta el 13-oct 01:17 UTC).
- [x] Escribir la «regla 15» (aire muerto con su exención de lectura) en `edicion-referentes/SKILL.md` y el método «la voz se mide en caracteres a ~17 car/s, no en palabras» en
  `lucia/montaje-hyperframes.md`: G2, G3, G4 y G5 lo pagaron con una revisión cada una. Suma lo del editor de G4: una pastilla de 2 palabras necesita 1,0 s entera; una tarjeta con `a: 0` no lleva entrada; el `a` del plan es el fin del empuje y la tarjeta entra 1 cuadro antes de que empiece. Al cerrar G2, G3 y G4. **Hecho 11-oct (latido de las 05:47 UTC):** regla 15 en `edicion-referentes` y §11 de `montaje-hyperframes.md`; modelos: escrito en esta sesión (sonnet-5-5); si G2 o G3 aprenden algo más, se suma a esa §11.
- [ ] **Decisión de la madre (nombres vs catálogo de Higgsfield, `models_explore` 11-oct):** «Kling O3» se lista como **Kling 3.0 Omni** y «Cinematic Studio 3.0» como **Cinema Studio Video 3.0** (G2 y G5 los muestran en pantalla y en el pie); el resto coincide («FLUX 3» = «FLUX 3 Image»). Corregir = `plan.json` + pie + re-render + gates en G2 y G5 (G5 ya mostrada). Detalle en `videos/lucia-entrega/README.md`.
- [ ] Reescribir el cuerpo del PR #144 (aún dice «videos listos para publicar» y describe las v1) con el estado real de las v2.
- [ ] Revisión independiente (sonnet) y verificador (haiku) de P9 cuando Codex devuelva el diff.
- [~] ~~G1 con la captura real de Pendientes de la demo~~ — **reemplazada por la premisa v5** (Sergio Urcullo, 8-oct: *«Lucía no
  es necesario que muestres el producto… grabar y aprender a usar Higgsfield es tu tarea»*). G1 salió sin producto:
  `videos/lucia-g1/` (`e35bb77d1`, `ec26f3bb6`). La captura de Pendientes queda para Marca, no para Lucía.
- [x] G2 y G3 según el plan v5, cada video estructurado — G3 `4ce62301c`, G2 `192b4f5a9`, G1 `ec26f3bb6`; PR #144; finales y
  SHA-256 en `videos/lucia-entrega/`; previews 360p en `videos/lucia-gN/qa/`. 0 créditos más.
- [ ] Publicar en la cuenta de Lucía lo que pase el control de identidad — **pasa a Bloqueado** (abajo): corre en el VPS.

## Dirección de Sergio Urcullo · 10-oct (vía la madre): que Lucía venda Onia Platform y sea influencer

> **SUPERADA por la madre v4 (~01:30 UTC del 11-oct), con las palabras de Sergio Urcullo: «Lucía sigue aprendiendo Higgsfield para venderlo y ser una modelo AI
> independiente».** No se reconvierten G1, C1 ni L01 a vender Onia Platform, y el CTA de G1 se mantiene («Seguime: cada semana, una prueba»). Sigue **vigente el apartado 2**
> (técnica de Higgsfield). El apartado 1 queda como evidencia de lo que el catálogo deja decir, por si la dirección vuelve. Qué podría venderse con lo aprendido:
> skill `lucia` §10, como propuesta sin ejecutar.

> Literal, relayado por la madre: «quiero ver las piezas de Lucía y que tengan sentido, ya que la idea es que venda Onia Platform y que
> sea influencer, y hasta ahora no perfeccionás tu técnica con Higgsfield». Choca en la letra con el 8-oct («no es necesario que muestres
> el producto, sos una influencer»). **Cómo lo leo:** el 10-oct es posterior y más concreto, así que manda; el 8-oct sigue valiendo en
> «no se hace un tour de pantallas». Lucía vende **por el problema, la frase que el catálogo deja decir y un CTA**, no por una demo.
> Si Sergio Urcullo lo lee distinto, que lo diga en esta sesión.
> ⚠️ Aviso honesto: `CLAUDE.md` («El objetivo del NEGOCIO manda…») dice que el influencer **no pasa el test de tres preguntas** de la
> estrategia. No lo reabro; lo anoto porque «venda Onia Platform» la convierte en canal de venta, no en línea nueva, y eso sí es coherente
> con congelarla como aprendizaje + cuenta para facturar después.

### 1) Las 8 piezas listas: ¿venden Onia Platform? **Hoy, 0 de 8.**

Todas enseñan a hacer contenido con IA. Quien las busca es un creador o alguien curioso de la IA, no el dueño de una clínica de Santa Cruz
con 2-6 profesionales (`ONIA_CLIENTE_IDEAL.md`). Sirven para audiencia de «influencer» y para aprender; no traen un solo lead de Onia.

Lo que **se puede decir** hoy (`ONIA_CATALOGO_DE_VENTA.md` §3 y §8): recordatorio de cita por **correo** a las 24 h y 2 h, sin abrir el sistema ·
«Onia te propone con IA el texto de cada recordatorio; vos lo aprobás una vez; la IA no ve los datos de tus pacientes» · «Todas las
mañanas Onia te deja anotado a quién escribirle (quien no vuelve, quien te debe, quien tiene cita mañana) con el mensaje listo; nada sale sin tu
aprobación» · «Preguntale a Onia ¿cuánto me deben? ¿cuánto cobré hoy?». **NO se puede decir:** que la IA atiende o agenda por WhatsApp, que
recupera pacientes con **tratamiento a medias** (el detector no encuentra a nadie hoy), ni que ya lo usan clínicas (0 pagos). Reglas que no
se tocan: Lucía es un personaje IA declarado; **no se hace pasar por clienta ni por odontóloga**; sin testimonio, sin cifras inventadas, sin
cartel de «muy pronto». Toda pieza que prometa una función necesita la tabla «se promete / funciona» y el OK de Sergio Urcullo antes de salir.

| Pieza | ¿Vende? | Cómo quedaría si mostrara un problema de un negocio que Onia resuelve |
|---|---|---|
| **G1** Este video no fue grabado (3 pasos) | **No** | Misma estructura gancho-3 pasos-CTA, otro tema: «Tu paciente no vino. No fue mala fe: se olvidó». Paso 1: el hueco en la agenda. Paso 2: el aviso llega por correo 24 h y 2 h antes sin que nadie lo mande. Paso 3: «Probalo 14 días gratis». Lucía lo cuenta como personaje IA de Onia, sin cliente que hable. |
| **G2** La misma foto, seis clips | **No** | No se arregla cambiando el texto: es una prueba de motores. Se conserva como **pieza de aprendizaje** (1 por semana) o se congela. |
| **G3** Tres errores de la IA que atrapé | **No (casi)** | La idea «la IA se equivoca, por eso se revisa antes de salir» sí conecta con «Onia propone el texto y vos lo aprobás una vez». Pero eso exige ejemplos de plantillas reales del redactor y hoy hay **0 aprobadas**: no se fabrican. Queda para cuando existan. |
| **G4** Seis motores de imagen | **No** | Aprendizaje. Sin versión de venta. |
| **G5** Cómo se mide una cara | **No** | Aprendizaje. Sin versión de venta. |
| **L01** Hola, soy Lucía. No existo. | **No, pero es la más fácil** | Cambiar la última lámina por «Me hizo Onia: el sistema que le avisa a tu paciente antes de la cita» + CTA. 0 créditos, un render. |
| **C1** Un video sin grabar, en 3 pasos | **No** | Versión carrusel de la G1 nueva: problema → 3 pasos → CTA. |
| **C2** Seis motores de imagen | **No** | Aprendizaje. Sin versión de venta. |

**Veredicto:** de 8, 3 se pueden reconvertir (G1, C1, L01), 1 queda condicionada (G3) y 4 son aprendizaje puro (G2, G4, G5, C2). **Propuesta de
ritmo (3 por semana):** 2 piezas de problema-de-negocio + 1 de aprendizaje de Higgsfield. Las piezas nuevas salen a 0 créditos
(fotos del kit + HyperFrames + capturas reales de la demo, que sigue pendiente de la cuenta demo). Nada de esto se produce hasta que la madre
confirme el rumbo, porque cambia lo ya validado.

### 2) Plan de técnica de Higgsfield

**Qué falla hoy, con el ejemplo medido** (`v4/PROCEDENCIA.jsonl`, líneas del 3 y 8-oct; `videos/lucia-g2/`, `videos/lucia-g3/`):

| Área | Qué falla | Evidencia |
|---|---|---|
| **Identidad en clip** | Anclar el clip a la foto (`start_image`) hace decaer la cara con los segundos | Kling std 0,79 → 0,72; Kling pro 0,805 → 0,739; Seedance mini 0,69 → 0,64 (6 s, misma foto K1) |
| **Identidad vs escena** | Lo que sostiene la cara (referencias) cambia la escena | Kling O3 con 5 refs, sin foto de inicio: 0,80 → 0,82 pero inventa el cuarto y el plano. Seedance mini con foto + 3 refs: 0,71 → 0,80, pero reencuadra (cara de 139 a 347 px) e inventa un letrero |
| **Manos** | Falla de verificación más que de generación: no hay medición automática | K4 mirado cuadro a cuadro: 5 dedos contables en 6 de 8 cuadros; en 2 cruza el dedo de la otra mano; desde el 128 las manos se juntan y salen |
| **Fondo** | Objetos inventados que dan a entender un rubro o una marca; los «no» del prompt se ignoran | Sillones dentales y logos de monitor en 2 de 6 fotos de motores (hubo que limpiarlas); K4_1 descartada pese a «no screens, no text, no logos»; el maniquí escribió texto basura |
| **Movimiento** | Pagar más no mueve mejor | Kling pro no mejora el movimiento de std (solo nitidez); Cinema Studio cuesta 5 cr/s contra 1,25 de Kling std. **No tengo métrica de movimiento**, solo mirado |
| **Luz** | **Sin dato propio**: ningún QA la midió | Hueco declarado, no inventado. Se mediría con luma y temperatura de color entre cuadro 0 y último |
| **Tamaño de cara** | Caras de ~120 px a 720p hacen poco fiable el control de cara | Kling a 720p: 115-120 px; bajo ~200 px el control de cara es poco fiable |

**3 pruebas chicas** (cotizadas **sin gastar** con `get_cost:true` del MCP el 10-oct, que es el mismo preflight que `higgsfield generate cost`;
esta nube no tiene la CLI. Cotizadas con la foto K1 de inicio y sin las referencias, que no cambian el precio en estos modelos; el 8-oct la
cotización con referencias coincidió con el cobro):

| # | Eje | Prueba | Cotización | Qué decide |
|---|---|---|---:|---|
| **P1** | **Prompt** (imagen) | Seedream 4.5, recepción: A) prompt con lista de «no», como K4_1 · B) describir lo que SÍ hay («pared lisa blanca y una puerta de madera cerrada, nada más») · C) B + fondo desenfocado. 3 tomas, 6 referencias de cara | **1 cr c/u = 3 cr** | Si describir en positivo evita fondos inventados sin bajar de 0,80. Una toma cada una: indicio, no estadística |
| **P2** | **Referencia** (clip) | Seedance mini, 6 s, 720p, mudo, foto K1 + 3 refs + prompt «cámara fija, mismo encuadre, sin zoom, sin letreros» | **6 cr** | Si se mantiene la ganancia de cara (0,80) **sin** reencuadre ni letrero. Éxito: final ≥ 0,78, cara que no crece más de 1,3× (antes 2,5×), 0 letreros |
| **P3** | **Modelo** (clip) | MiniMax H3, 6 s, foto K1 + refs, 9:16, 2K. Único modelo sin probar que acepta foto de inicio **y** referencias a 2K (cara más grande = control más fiable) | **12 cr** | Si un modelo distinto rompe el dilema «cara o escena». Alternativas cotizadas: Kling Turbo 9 cr (solo foto), Grok 1.5 27 cr, Seedance 2.5 42 cr (descartado por precio) |

**Total: 21 cr** (P1 3 + P2 6 + P3 12). **Qué necesita permiso:** P1 es lote chico de imagen (< 5 cr), autorizado el 8-oct, pero **desde el 10-oct 20:25 UTC espera el «mostrada,
generá» de la madre** (regla de arriba). **P2 y P3 son video: piden el sí de Sergio Urcullo, escrito en esta sesión.** Además, del tope mensual de Lucía (150) quedan
**11 cr** (139 gastados): P1 + P2 caben (9); **P3 no cabe** sin que Sergio Urcullo suba el tope o la espere a noviembre.
**No gasté nada en esta tanda.**

**Corrección de saldo:** mi nota decía «saldo 454,76 al 8-oct»; era una resta (541,26 − 86,5), no una medida. El saldo real hoy es **438,17**.
El libro de movimientos (`transactions`) cuadra mis 86,5 al céntimo hasta las 22:13 UTC del 8-oct y muestra **16,59 cr más** entre las 22:17 y las 23:11
de ese día (18 imágenes «GPT Image 2.5 Flare», 8 «Soul V2» y un Kling v3.0 de 3,75) que **no figuran en mi registro**. No sé qué sesión los
gastó: la que haya sido debería sumarlos a su gasto de octubre, y la madre puede cruzarlos con las otras colas.

## Verificación de aprendizaje · 2026-10-09 (pedida por la madre)

- [x] **Prueba de uso de `equipo-de-agentes` y `aprender-de-todo`** (leídas del commit `ca1fde0a`, sin fusionar su rama):
  - **Sesión + fecha:** `session_01XSzFcs1k18ijqjSHGjnzD4` (Lucía, nube), 9-oct-2026.
  - **Tarea de cola:** G5 «Cómo mido si una cara es la de Lucía» (`videos/lucia-g5/`).
  - **Regla usada:** ficha `2026-10-04-reels-para-lucia.md` §2 (otro avatar IA se llama «Lucía» y esconde que es IA) → siempre «Lucía Antelo», con apellido,
    y rótulo «personaje IA de Onia» desde el cuadro 0 (`LUCIA.md` §0-canon dato 2), dimensión «Negocio y oferta / Idioma y tono». De `equipo-de-agentes` §9: contrato →
    resultado → verificación (prompt del editor con META/PRUEBA, informe del editor, revisión independiente 1 y 2).
  - **Artefacto:** `videos/lucia-g5/index.html` (rótulo «Lucía Antelo · personaje IA de Onia» a 40 px, cuadro 0) y `pie.txt`.
  - **Verificación:** `videos/lucia-g5/qa/revision-1.md` y `revision-2.md` (rótulo ≥ 40 px desde el cuadro 0 sin tapar la cara; sin marcas de terceros ni profesión).
    Revisión de identidad: face-gate de A, F, B café y K4·5 (`qa/face-gate*.txt`).
  - **Lo que NO aplica y no se adoptó:** la micro-interacción «clic → hecho» y el «Comentá X» (premisa v5: Lucía no muestra el producto; CTA de mecanismo sin probar).
  - **Costos (§7):** el juicio fue de Sonnet (editor y revisor); no se usaron verificadores Haiku porque los chequeos eran de juicio, no de conteo.

## Siguientes 3 (sacadas del plan v5 y del GOAL de `handoff/madre-local.md`; todas 0 créditos y sin VPS)

- [x] L01 «Hola, soy Lucía. No existo.» reescrito a la premisa v5 — láminas en `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/`,
  brief en `briefs/lucia/l01-hola-no-existo.json`, 5 láminas miradas completas y grep limpio (commit de esta tanda). Sale por
  `ig-carrusel.mjs --cuenta lucia` en el VPS (receta en `videos/lucia-entrega/README.md`); no hay otra pieza que lo bloquee.
- [x] G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» — montado en tres pasadas con revisor independiente
  (`videos/lucia-g4/`, revisiones 1 y 2 en `qa/`; 59,75 s; copia en `videos/lucia-entrega/`, SHA en su README). Corregidos: consultorio
  dental y logos de monitor (fotos limpias en `v4/prueba-motores-20261008/fotos-limpias/`), nota de ruido, tabla de A y B. **Guion APROBADO por la madre el 10-oct** (`hermes-content/docs/cola/lucia-diario/VALIDACION-G4-G5-MADRE.md`):
  los sellos rojos de E/F se dejan como están (R2-1, opción a). Retoques que no bloquean y solo entran si se vuelve a renderizar: «El café: B perdió
  la cara.» → «Escena 2: B perdió la cara.» y «Pagar más no mejora…» → «Pagar más no mejoró el parecido.». Sale solo con «mostrada, publicá G4».
- [x] Carrusel C1 «Un video sin grabar, en 3 pasos» — versión carrusel de G1 con fotos y un cuadro real del clip: láminas en
  `hermes-content/carousels/out/lucia-c1-un-video-sin-grabar/`, brief en `briefs/lucia/c1-un-video-sin-grabar.json`. 5 láminas miradas
  completas, grep limpio, 1080×1350 sin franja. Sale por `ig-carrusel.mjs --cuenta lucia` (receta en `videos/lucia-entrega/README.md`).

## Siguientes (cuando G4 cierre) — todas 0 créditos y sin VPS

- [x] G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — montado en tres pasadas con revisor independiente (`videos/lucia-g5/`,
  revisiones 1 y 2 en `qa/`; 57,5 s; copia en `videos/lucia-entrega/`, SHA en su README). Corrigió el guion mismo: «una cara chica baja sola» exageraba (se midió: −0,004 a −0,010)
  y «0,79 y 0,77 difieren 0,03» eran 0,02. **Guion APROBADO por la madre el 10-oct** (mismo documento; no lleva revisión independiente de cuadros de la 3ra pasada, solo los tres textos que pidió el revisor). Sale solo con «mostrada, publicá G5». **Sigue abierto:** si G2 difumina el letrero inventado como G5.
- [x] C2 carrusel «Seis motores de imagen: cuánto cuesta y cuánto se parece» — láminas en
  `hermes-content/carousels/out/lucia-c2-seis-motores-de-imagen/`, brief en `briefs/lucia/c2-seis-motores-de-imagen.json`; 5 láminas miradas
  completas, grep limpio. Mismos números que el guion de G4 (que la madre valida).
- [ ] **Renovar el token de Lucía antes del 13-oct** (estimado, sin medir desde el 4-sep) y confirmar `is_ai_generated` en la primera
  pieza. Lo hace quien corra el VPS (pedido de la madre, 10-oct). Pasos exactos, sacados de `ig-refrescar.sh`, `publicar/README.md` y la
  skill `lucia` §6 (nada de esto se corrió desde esta nube):
  - **Cómo se renueva:** el token es de Instagram Login (`graph.instagram.com`), app «OnIA Social API», dura 60 días. Renovar =
    `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<token>`; **exige token con más de 24 h
    y NO vencido**. `ig-refrescar.sh` recorre todos los `ig-*.env`, así que toma `ig-lucia.env` solo apenas exista. Cron: lunes 13:00 UTC
    (09:00 La Paz), o sea **lun 12-oct** y lun 19-oct. Si falla, avisa por `onia-tg.sh` (sistema).
  - **Camino A, sin Sergio Urcullo (solo si el token no venció):**
    1. Levantar **solo** `postiz-postgres` (Postiz entero publica posts vencidos sin OK: pasó el 4-sep). Leer el token y el id de la
       integración `cmt1sv4eh001alq9cl3y6q7es` sin imprimirlos, igual que el 29-sep con `@sergiourcullo` y `@oniahq`. Apagar `postiz-postgres`.
    2. Escribir `/root/.config/onia-publicar/ig-lucia.env` (`IG_USER_ID=` e `IG_TOKEN=`), `chmod 600`.
    3. Correr `/root/bin/ig-refrescar.sh` a mano (renueva también las otras dos cuentas, inofensivo): debe decir `ig-lucia renovado`.
       Si estaba en su lugar antes del lun 12-oct 13:00 UTC, el cron lo hace solo, pero correrlo a mano ya mide.
    4. Medir cuánto queda: la misma llamada de renovación imprimiendo **solo** `expires_in` (≈ 5.184.000 s = 60 días). Nunca el token.
    5. Probar que es la cuenta: `GET https://graph.instagram.com/v25.0/me?fields=username&access_token=<token>` → `lucia.antelo.oficial`.
  - **Camino B, si el token venció** (la renovación devuelve error de sesión o token vencido; ya no hay refresh posible): lo genera Sergio Urcullo
    en developers.facebook.com → app «OnIA Social API» → Instagram con inicio de sesión de Instagram → generar token para
    `@lucia.antelo.oficial` (cuenta Creador, conectada a la app desde el 20-ago). Se pega **en el VPS**, nunca en un chat. Después pasos 2 a 5.
    ⚠️ Los nombres exactos de los botones del panel de Meta no se verificaron en esta sesión.
  - **Después:** el cron semanal lo mantiene; mientras el archivo exista y el lunes corra, el plazo del 13-18-oct deja de existir.
    En la primera pieza publicada, abrir el permalink y leer `is_ai_generated=true` en `/root/publicar/publicado.jsonl`.

## Bloqueado

- **Aviso de la madre, 10-oct (mensaje entre sesiones, no es un permiso mío):** la madre corre la receta de `videos/lucia-entrega/README.md`
  desde la PC (ensayo de G1 y luego publicación) y avisará con el enlace; valida hoy los guiones de G4 y G5. Mi parte: dejar el token
  listo (arriba) y seguir el plan v5, hasta 3 piezas por semana. Hay 8 piezas listas (≈ 3 semanas), así que no se produce más hasta que
  salgan. La generación paga sigue pidiendo el sí de Sergio Urcullo por lote, escrito en esta sesión.
- **El desbloqueo más corto, y es de Sergio Urcullo (solo si la madre no puede correr la receta):** el OK para instalar el cliente `ssh` (paquete `openssh-client`) en esta nube, solo para
  correr la receta de `videos/lucia-entrega/README.md` por el túnel que el hook de arranque ya deja configurado (llave en el entorno, `ssh onia-vps`).
  Sin ese OK, o sin que la madre/«Onia» corra la receta, nada se publica. Antes de pedirlo se validó offline: los dos publicadores pasan `--selftest`.

- **Publicar G1 / G3 / G2 (y lo que siga)** — necesita (a) la llave del VPS, que por decisión de la madre vive solo en la
  sesión «Onia» (esta sesión de nube no tiene cliente `ssh` y no se instala sin aprobación), (b) el token de Lucía en
  `ig-lucia.env` (vence entre el 13 y el 18-oct), (c) la mirada de la madre a los previews 360p. Receta lista en
  `videos/lucia-entrega/README.md`; **quien la corra reporta `PUBLICADO:`**.
- Generaciones pagas de video: con el sí de Sergio Urcullo, por lote. Tope vigente que me fijé: 97 cr (quedan 10,5); falta que
  Sergio Urcullo lo confirme o lo corrija.
- Voz (L2, D4) y Motion Control (L3, requiere que Sergio Urcullo grabe 10 s): dependen de él.
