# Esquema de Consistencia de Avatares (protocolo canonico ONIA)

> Aplica a TODOS los personajes IA (Lucia, Mara, y los que sigan). v1 escrito 2026-07-06
> despues de que Sergio reporto perdida de consistencia (pelo, sonrisa, dientes
> cambiando entre generaciones usando el metodo Elements+nano_banana_2). v2 refinado para
> UGC (Marketing Studio). v3 (esta version, 2026-07-06) — auditoria completa: IDs
> verificados, colision de nombres en la plataforma, y correccion de costos.

## 🔴 HALLAZGO CRITICO (2026-07-06) — el Soul de Lucia estaba contaminado

Al auditar de nuevo, se encontro la causa raiz REAL (mas grave que el problema de
metodologia Elements-vs-Soul): de los 8 frames usados para entrenar el Soul original
de Lucia (`9a0d6953`), **uno (`pecas-B-02.png`) era de OTRA MUJER** (pelo con trenzas,
sin pecas, terraza con tripode) — el video B completo resulto ser de esa otra persona,
no de la de las pecas. El Soul se entreno con 7 fotos correctas + 1 foto de alguien mas,
lo cual mezcla rasgos de forma impredecible. Esto explica la perdida de consistencia
mejor que la mezcla de metodos (Soul vs Elements).

**Fix aplicado:** nuevo Soul **`36305a9b-af24-4390-959b-885082dddd5d`**
("LUCIA-REAL-v2-clean"), entrenado con **18 frames**, TODOS extraidos y verificados
visualmente del video A (el unico 100% confirmado de la persona correcta), con variedad
de angulos/expresiones (sosteniendo producto, aplicandolo, sonriendo, neutral). Este es
el Soul a usar de ahora en mas para Lucia — el viejo `9a0d6953` queda superado (no
compatible con esta correccion).

**✅ Verificado (2026-07-06):** 2 generaciones de prueba con `text2image_soul_v2` + este soul_id
(retrato neutro + bano/producto via texto, 0.12cr c/u) comparadas visualmente contra
`pecas-clean-v2/lucia-clean-01.png` (frame real) — misma cara, pecas, cejas, ojos, labios,
sin deformacion ni deriva. El Soul limpio queda confirmado funcional.

## ⚠️ ALERTA — colision de nombres en Higgsfield (ya resuelta por borrado manual)

`show_characters` y `show_reference_elements` **no tienen accion de rename/delete via
API** (solo list/train-create/status) — pero el sitio web de Higgsfield (higgsfield.ai/character)
SI tiene delete por UI (boton "..." -> Delete en cada tarjeta). Los 2 Souls problematicos
se borraron ahi el 2026-07-06, a pedido explicito de Sergio:

| Nombre en Higgsfield | soul_id | Estado |
|---|---|---|
| "LUCIA-REAL-v2-clean" | `36305a9b-af24-4390-959b-885082dddd5d` | ✅ **USAR ESTE** — 18 frames verificados, solo persona correcta |
| ~~"Valentina ONIA v1"~~ | ~~`9a0d6953-ff2e-40ba-b763-806e0d447325`~~ | 🗑️ **ELIMINADO** (2026-07-06) — era Lucia real pero contaminada (1 de 8 frames era otra persona) |
| ~~"Lucia ONIA v1"~~ | ~~`2fc03fc6-c38b-48ca-91f6-ca1eb022ce29`~~ | 🗑️ **ELIMINADO** (2026-07-06) — no era Lucia, cara equivocada (m2-05) |

**Regla dura (sigue aplicando): nunca elegir un Soul/Element por su NOMBRE en la lista de
Higgsfield, siempre usar el `soul_id`/`element_id` exacto de la tabla de referencia de
abajo.** Aunque los 2 Souls equivocados ya no existen, la Reference Element auto-creada
`44622145` (ver tabla de Lucia abajo) SIGUE viva y SIGUE contaminada — no tiene delete
verificado todavia.

## Diagnostico (v1, sigue valido)

Existen dos mecanismos de identidad con consistencia muy distinta:

| Mecanismo | Que es | Consistencia |
|---|---|---|
| **Soul** (`text2image_soul_v2` + soul_id) | Modelo ENTRENADO con 8+ fotos/frames de la persona | Alta — probado repetidas veces con prompts de texto |
| **Reference Element** (`nano_banana_2` + 1 imagen suelta) | Una sola foto como "sugerencia" de parecido | Baja — el modelo reparte fidelidad entre cara+outfit+lugar a la vez, la cara es la que mas cede |
| **Marketing Studio (avatar custom)** | Sistema dedicado de Higgsfield para UGC: avatar + producto real + guion + lipsync | Alta — probado con Mara+ISDIN real: identidad reconocible, producto real en mano con etiqueta legible, sin la deriva de Elements |

El error de v1 fue tratar Reference Elements como "la forma de conseguir producto real en
mano" para UGC. Ese es exactamente el trabajo de **Marketing Studio**, que ya tiene su
propio mecanismo de identidad (mejor que una imagen suelta) construido para este caso.
Elements queda para un caso mucho mas chico: prop/lugar exacto SIN necesidad de que hable
o sostenga nada especifico.

## Los 3 niveles (usar en este orden de preferencia)

### Nivel 1 — Soul + texto (`text2image_soul_v2`) — 0.12cr — DEFAULT
Para: fotos estaticas, contenido generico de feed, escenas donde el producto/outfit se
puede describir bien en palabras (no necesita ser un objeto real fotografiado).
Como: `text2image_soul_v2` + soul_id + prompt de texto (wardrobe/lugar de la bible). Alta consistencia,
validado repetidas veces.

**⚠️ Pitfall conocido — arrugas de forehead que no estan en la referencia real** (hallado
2026-07-06 con Lucia, Sergio lo detecto en el resultado). Causa: combinar "no makeup" +
enfasis de textura hiper-realista + primer plano muy cerrado + luz cenital dura empuja al
modelo a exagerar lineas de expresion en la frente que la persona real no tiene. Fix que
funciono: encuadre half-body (no primer plano extremo) + luz difusa pareja + negativo
explicito "poreless smooth forehead, zero wrinkles zero fine lines zero creases" en el
prompt. Aplica a cualquier modelo, no solo Lucia — revisar el forehead en el QA visual,
no solo pecas/cejas/ojos.

**Update 2026-07-07 — el fix de prompt NO alcanza con cejas levantadas (expresiones
fuertes: sorpresa, risa grande, shock).** Sergio detecto que en expresiones con cejas
arriba las arrugas seguian apareciendo con `text2image_soul_v2`, y no se veian como arrugas
naturales de la expresion — se veian como artefacto del modelo. Se confirmo con un
test A/B: mismo tipo de expresion (sorpresa, cejas levantadas), mismo `soul_id`, dos
modelos distintos:
- `text2image_soul_v2` + texto -> forehead con lineas no naturales (visible en `emotion-surprised.png`).
- `nano_banana_pro`/`nano_banana_2` + Reference Element `ced20cc2-...` (ancla de cara
  REAL, sin combinar con otros elements de outfit/lugar) + mismo prompt de expresion ->
  forehead LISO, sin artefacto, con la misma expresion de sorpresa/cejas levantadas.
  Costo: 2cr (vs 0.12cr de text2image_soul_v2 — ~16x mas caro por imagen).

**Regla resultante:** para expresiones fuertes/cejas muy levantadas (sorpresa, shock,
risa grande), usar `nano_banana_pro` + el Element de ancla de cara real del personaje
(solo ese Element, no combinar con outfit/lugar para no diluir fidelidad) en vez de
`text2image_soul_v2`. Para expresiones calmas/neutras/sonrisa suave, `text2image_soul_v2` sigue siendo el
default (mas barato, ya validado). Verificar esta regla en Mara y modelos futuros — por
ahora solo confirmada en Lucia.

**Update 2026-07-07 — alternativa para VIDEO (no solo foto): `minimax_hailuo`.**
Probado animando un still ya existente con una reaccion de sorpresa genuina (cejas
subiendo, sonrisa grande): forehead liso en todo el clip, dientes consistentes, 6cr
(mas barato que Kling 10cr), sin necesitar el paso extra de generar antes una imagen
con `nano_banana_pro`. Candidato fuerte para b-roll con emocion/reaccion marcada —
`models_explore` ya lo tenia catalogado como "natural physics, facial emotion" en
`hermes-content/docs/historial/references/higgsfield-capabilities-map-20260706.md`, confirmado con test real.

### Nivel 2 — Marketing Studio (avatar custom) — 42-75cr — UGC CON PRODUCTO REAL (o talking puro sin producto)
`product_ids` es opcional en `generate_video(model=marketing_studio_video)` — tambien
sirve para talking-to-camera SIN producto (`mode: ugc_direct_to_camera`, sin
`product_ids`), y da mejor lipsync que `wan2_7` suelto. Usar cuando el presupuesto lo
permita para el segmento de "hablando a camara" de la estructura b-roll+lipsync.
Para: el caso real de UGC — hablando a camara, sosteniendo el producto REAL (con su
etiqueta/forma exacta), guion natural, lipsync. Es la herramienta correcta para esto,
no Elements.
Como:
1. Crear avatar custom en Marketing Studio desde una foto **Nivel-1** (Soul+texto) de el
   personaje — no desde una foto de Elements ni de un video generado.
2. Crear producto en Marketing Studio desde la foto REAL del packshot (ver
   `hermes-content/references/models/lucia-elements-source/` o assets del cliente).
3. Elegir formato (`ugc_selfie_testimonial`, `ugc_direct_to_camera`, etc.) y setting.
4. Generar. Verificado con Mara+ISDIN: identidad estable, producto fiel, guion espanol
   seguro auto-generado. Costo real por probar: 42cr en 480p (piso), 75cr en 720p/15s.

### Nota sobre b-roll + voz (2026-07-07)
Para clips de b-roll (Kling, movimiento puro, sin que hable a camara): el lipsync
suelto (`wan2_7`) falla demasiado si se fuerza sobre movimiento que no es "hablar a
camara". La solucion NO es mejorar ese lipsync — es no intentarlo ahi. Generar la voz
de Lucia por separado (`seed_audio`) y ponerla como VO en edicion, sin sincronizar
labios. Reservar el lipsync real (Nivel 2 o 3) solo para el/los segmento(s) donde
efectivamente se la ve hablando a camara.

### Nota sobre contenido de bikini/swimwear (investigacion de Sergio, no probado aun)
Algunos modelos rechazan escenas de bikini/swimwear aunque no muestren nada explicito.
Segun su investigacion, `text2image_soul_v2` (ya default) y Seedance 4 son los que mejor generan
ese tipo de escena sin bloquear. Anotado para cuando haga falta, sin validar todavia.

### Nivel 3 — wan2_7 (still Soul + audio) — 15cr/10s — TALKING SIN MARKETING STUDIO
Para: video hablando con voz propia (ElevenLabs/seed_audio) cuando no hace falta el
producto en mano, o se quiere mas control de voz que el guion auto de Marketing Studio.
Como: generar el still con **Nivel 1** (Soul+texto) -> usar ESE still como `start_image`
de `wan2_7` + `audio_references` de la voz. Verificado con Lucia: cara estable en todo el
clip, boca sincronizada. NUNCA partir de un still generado por Elements para esto (mas
deriva compuesta).

**⚠️ Regla dura — el `start_image` DEBE mostrar sonrisa con dientes visibles, nunca boca
cerrada.** `wan2_7` solo acepta UN `start_image` (no tiene rol separado de "dental lock"
como Kling3). Si el still de arranque tiene la boca cerrada, el modelo inventa los
dientes desde cero en cada frame donde habla -> pierden consistencia (forma/blancura
cambia). Hallado 2026-07-06 con Lucia, mismo diagnostico que el "Face + Teeth Lock" de
Sergio (`sergio-approved-media/identity-shoots/20260605-nano-banana-face-teeth-lock/`):
los dientes se anclan con una FOTO real de sonrisa, no con texto de prompt. Fix
verificado: generar el Nivel 1 con sonrisa abierta + dientes visibles explicito en el
prompt, usar ESE como `start_image`.

### Nivel 4 (ultimo recurso) — Reference Elements (`nano_banana_2`) — 2cr
Solo para casos muy especificos donde se necesita un prop/lugar EXACTO de una foto real
y NO hace falta que el personaje hable ni sostenga nada con precision (ej. mostrar un
mueble/ambiente exacto de fondo). Reglas obligatorias si se usa:
- Aceptar de antemano que la cara puede variar — no prometer lock perfecto.
- Generar 2-3 candidatos, nunca aceptar el primero a ciegas.
- QA manual obligatorio contra la referencia real antes de guardar cualquier resultado.
- Nunca usarlo para contenido "hablando" o "sosteniendo producto" — para eso esta Nivel 2.

## Regla de oro (constante en todos los niveles)

1. **La fuente de identidad nunca se reemplaza por un output generado.** El Soul se
   entrena UNA vez desde frames REALES (o su version escalada sin generacion). El avatar
   custom de Marketing Studio (Nivel 2) se crea desde una foto Nivel-1 (Soul+texto), no
   desde Elements ni desde video. Nunca encadenar generado-sobre-generado.
2. **QA obligatorio antes de aprobar cualquier imagen/video:** comparar visualmente contra
   la referencia real canonica del personaje. Si la cara, el pelo o la sonrisa no calzan,
   se DESCARTA.
3. **No se publica ni se deja como "definitiva" ninguna pieza de Nivel 2-4 sin aprobacion
   explicita de Sergio.**

## Decision rapida (cual nivel uso)

| Necesito | Nivel |
|---|---|
| Foto generica de feed, outfit/lugar descriptible en texto | 1 (Soul+texto) |
| UGC hablando + sosteniendo un producto REAL especifico | 2 (Marketing Studio) |
| Hablando con voz propia, sin producto en mano | 3 (wan2.7 desde still Nivel 1) |
| Mostrar un prop/lugar exacto de fondo, sin que hable | 4 (Elements, con QA) — ultimo recurso |

## Tabla de referencia definitiva (IDs verificados, 2026-07-06)

### Lucia (pelinegra con pecas — identidad DEBE ser fiel al video real de Sergio)
| Uso | ID | Fuente |
|---|---|---|
| **Soul (Nivel 1) — USAR ESTE** | `36305a9b-af24-4390-959b-885082dddd5d` | 18 frames verificados, solo video A (`pecas-clean-v2/`) |
| ~~Soul viejo, contaminado~~ | ~~`9a0d6953-ff2e-40ba-b763-806e0d447325`~~ | 🗑️ ELIMINADO de Higgsfield 2026-07-06 (era 8 frames, 1 de otra persona) |
| Ancla real para Nivel 4/Marketing Studio | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` (Element) | frame real (pecas-A-15) escalado 2K |
| ⛔ Element CONTAMINADO, NO USAR | `44622145-b648-4839-85f3-d8fdb7047b19` (Element, auto-creado al entrenar el Soul viejo, mal llamado "Valentina ONIA v1") | frame de OTRA PERSONA (pecas-B-02) — sigue existiendo, Reference Elements no se borraron (solo se borraron los 2 Souls). Pendiente: borrar tambien desde la libreria de assets si Higgsfield lo permite |
| ⛔ Legacy, NO USAR | `de586dbb-0cdd-4ca2-aaac-173d11741c86` (Element "lucia-face-element") | foto YA generada por Soul (1 paso de deriva) |
| Outfits (prop) | `16833b18` cleangirl · `ec1dece5` streetwear · `5503f588` nightout · `6186d80f` loungewear | flatlays reales sin cara, Pinterest |
| Lugares (environment) | `44a4686e` bano · `6a721405` dormitorio · `5cfbdab5` cafe · `cddfa484` calle · `2750ef8b` bar | interiores reales sin gente, Pinterest |
| Referencia QA (comparar SIEMPRE contra esto) | `hermes-content/references/models/pecas-clean-v2/*.png` | 18 frames verificados, SOLO video A |
| ⛔ Carpeta de OTRA PERSONA, no usar | `pecas-source-frames/OTRA-PERSONA-video-B-NO-USAR/` | 34 frames del video B — es una mujer distinta |

### Mara (pelirroja — identidad 100% sintetica, NO representa a nadie real)
| Uso | ID | Fuente |
|---|---|---|
| Soul (Nivel 1) | `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f` | `identity-bank-50/` (50 fotos, ya generadas por IA en rondas previas) |
| Nivel 2 (Marketing Studio) | validado con Mara+ISDIN (2026-07-06), 42cr | avatar custom creado desde una foto Nivel 1 |
| Referencia QA | Round 09 "photoshoot maestro" + `identity-bank-50-sheet-01` | A diferencia de Lucia, NO hay video real que igualar — la QA es contra el master APROBADO por Sergio, no contra una persona real |
| Pendiente | Auditar si el `mara_identity_02.jpg` (ancla historica) sigue siendo la mejor referencia o conviene fijar una nueva desde una generacion Nivel 1 reciente | — |

## Costos verificados (historial real de transacciones, no estimados)

| Accion | Costo real | Nota |
|---|---|---|
| Entrenar un Soul (`show_characters` train) | **25cr** ⚠️ | Antes documentado como "sin cargo" — ERA INCORRECTO. Se gastaron 50cr entrenando 2 Souls esta sesion (25cr de eso en la cara equivocada archivada). Pensarlo antes de entrenar un Soul nuevo. |
| Generar con Soul (`text2image_soul_v2` + texto) | 0.12cr/img | Nivel 1, el barato real |
| z_image (explorar estilo, sin identidad) | 0.15cr/img | Solo para elegir cara/estilo, no fija identidad |
| nano_banana_2 + Elements (combo cara+outfit+lugar) | 2cr/img | Nivel 4 |
| bytedance_image_upscale | 2cr/img | Escalar frame real sin generar |
| wan2_7 (still + audio, lipsync) | 15cr/10s video | Nivel 3 |
| seed_audio (voz) | ~1-2.4cr | Varia con largo del texto |
| Marketing Studio Video (avatar+producto) | 42cr (480p) — 75cr (720p/15s) | Nivel 2 |
| kling3_0_turbo (b-roll movido, sin cara fija) | 7.5cr/5s | Para Radar IA / contenido sin identidad |
| Seedance 2.0 std | **45-135cr** ⚠️ EVITAR | El mas caro, evitar salvo aprobacion explicita |

Balance actual: 2769.9 / 3000 (verificado 2026-07-06).

## Que hacer con lo ya generado con Elements (Nivel 4, sesion previa)

Las imagenes `lucia-elements-combo-*.png` quedan como **pruebas de concepto del Nivel 4**,
no como contenido aprobado ni como referencia de identidad. No usarlas para entrenar nada,
ni como ancla, ni como fuente de un avatar custom de Marketing Studio.

## Como se logran los mejores resultados (resumen ejecutable)

1. **Default siempre Nivel 1** (`text2image_soul_v2` + soul_id correcto de la tabla + texto). Es lo
   mas barato y lo mas consistente — usar para el 90%+ del contenido.
2. **Nunca elegir Soul/Element por nombre** — copiar el ID de la tabla de arriba, siempre.
3. **Antes de aprobar cualquier imagen/video, comparar contra la referencia QA** (frames
   reales para Lucia, master aprobado para Mara). Si no calza, descartar y no seguir
   generando encima.
4. **Antes de entrenar un Soul nuevo, confirmar con Sergio** — cuesta 25cr real, no es gratis.
5. **Para UGC con producto real:** Marketing Studio (Nivel 2), avatar creado desde una
   foto Nivel 1 limpia. **Validado con las 2 modelos** (Mara+ISDIN y Lucia+ISDIN,
   2026-07-06, 42cr c/u). Ojo: el guion auto-generado no es determinista en idioma
   (Mara salio en espanol, Lucia en ingles con el mismo preset) — pasar `prompt`
   explicito en espanol para piezas de produccion real.
6. **Elements (Nivel 4) es el ultimo recurso**, nunca el default, siempre con 2-3
   candidatos + QA, nunca para "hablar" o "sostener algo con precision".

## 📋 PLAYBOOK — de Soul entrenado a produccion (repetir con cualquier modelo nuevo)

Proceso completo aprendido con Lucia (2026-07-06), generalizado para aplicar a Mara,
modelos futuros, o re-perfeccionar uno existente. **Orden estricto: barato primero,
caro recien cuando lo barato ya esta perfeccionado.**

### Paso 1 — Identidad (una sola vez)
- Real: extraer frames de UN SOLO video, verificar cada uno visualmente (contact
  sheet) antes de entrenar — nunca asumir que 2 clips del mismo shoot son la misma
  persona (asi se contamino el Soul original de Lucia). Entrenar Soul (**25cr real**,
  confirmar con Sergio antes).
- Sintetico (estilo Mara): banco de imagenes ya generadas y aprobadas como master.
- QA obligatorio: 2-3 generaciones Nivel 1 comparadas cara a cara contra la
  referencia (frame real o master aprobado) — pecas/cejas/ojos/labios deben calzar.

### Paso 2 — Perfeccionar Nivel 1 (barato, 0.12cr) ANTES de gastar en Nivel 2/3
No pasar a modelos caros hasta resolver estos 3 puntos con el Soul:
1. **Forehead liso**: encuadre half-body (no primer plano extremo) + luz difusa
   pareja (no cenital dura) + negativo explicito "poreless smooth forehead skin,
   zero wrinkles zero fine lines zero creases". Sin esto, el modelo exagera lineas
   de expresion que la persona real no tiene.
2. **Dientes como ancla futura**: si en algun momento se va a animar (Nivel 3), el
   still debe tener sonrisa ABIERTA con dientes visibles — nunca boca cerrada. Un
   video hablado (`wan2_7`) solo recibe un `start_image`, asi que ese still ES el
   unico ancla de dientes; sin dientes visibles ahi, el video los inventa y pierden
   consistencia al hablar.
3. **Accion real > pose estatica para "atractivo"**: selfies neutros/quietos leen
   planos y poco carismaticos incluso con identidad perfecta. Generar variedad con
   ACCION genuina (riendo, caminando, gesto real, situacion social, cuerpo completo,
   saltando, ejercicio) en vez de retrato posado — la diferencia percibida en
   atractivo es grande y es un problema de direccion de foto, no de identidad.
   Confirmado tambien en cuerpo completo/fitness (saltando, gym, estirando). Generar
   4-6+ candidatos variados (escenario x accion x emocion x luz), contact sheet,
   elegir los mejores con el cliente antes de seguir.
4. **Ropa deportiva/casual: forzar "sin logos" explicito.** El modelo a veces mete
   un logo de marca real sin que se pida (ej. "Nike" en un top deportivo) — viola la
   regla de no usar marcas de terceros. Agregar siempre "no brand logos, unbranded
   clothing" en el prompt para cualquier ropa deportiva/casual, revisar en el QA.

### Paso 3 — Recien ahi, Nivel 2/3 (caro) para produccion
- Nivel 3 (`wan2_7`, 15cr/10s): usar el MEJOR still de Nivel 1 ya perfeccionado
  (forehead liso + dientes visibles + accion/expresion ya validada) como
  `start_image`. Audio SIEMPRE en español explicito (el guion/voz no vienen solos en
  español por defecto).
- Nivel 2 (Marketing Studio, 42-75cr): avatar custom creado desde ESE MISMO still
  perfeccionado (nunca desde uno viejo/con bugs conocidos). `prompt` explicito en
  **español** describiendo escena **lifestyle** (no clinica/laboratorio) + reforzar
  "forehead liso, sin arrugas" en el texto. El guion/idioma automatico no es
  confiable — no dejarlo en automatico para piezas de produccion real.
- QA final identico al Paso 1: comparar contra la referencia antes de aprobar.

### Como aplicar esto a un modelo nuevo (checklist rapido)
1. Identidad (real verificada o banco sintetico aprobado) -> Soul.
2. 2-3 fotos Nivel 1, QA contra referencia.
3. Fix forehead + fix dientes (aplicar los prompts de arriba desde el primer intento,
   no esperar a que el cliente lo detecte).
4. Tanda de 4+ Nivel 1 con accion/expresion variada, elegir direccion con el cliente.
5. Solo entonces: Nivel 3 (talking) y/o Nivel 2 (Marketing Studio) para piezas reales.
6. Documentar el modelo (bible propia, como `lucia-onia-identity-bible.md` /
   `mara-onia-identity-bible.md`) con Soul ID, prompts que funcionaron, y pitfalls
   encontrados especificos de ese modelo.
