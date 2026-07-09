# Identity Bible — Lucia (ONIA modelo "pelinegra con pecas")

> Identidad REAL elegida por Sergio (Mujer 1 de sus videos aprobados, tubo verde SVR).
> Entrenada desde SUS frames reales — NO cambiar sus rasgos. Ficticia/ownable como personaje
> de marca. No publicar sin aprobacion. Renombrada 2026-07-06 (antes "Valentina" en un paso
> intermedio de la sesion) para alinear con el nombre que usa Sergio.

## Referencia maestra definitiva — `LUCIA_SURGICAL_FACE_LOCK.md` (2026-07-07) ✅ APROBADA
Photoshoot completo de 10 tomas en fondo blanco (frontal neutral/sonrisa suave/sonrisa
grande, perfil izq/der, 3/4 izq/der, detalle nariz, detalle oreja, cuerpo completo) via
`nano_banana_pro` + ancla real. **Aprobado explicitamente por Sergio** ("ahora esta
perfecta") — es el banco de QA mas completo que existe, comparar CUALQUIER generacion
nueva contra estas 10 fotos. Carpeta: `lucia-surgical-shoot-20260707/`.

**Nuevo Element de estilo:** `902eeebb-89e9-4477-8426-c555b20f7ecc`
("lucia-surgical-anchor", desde la foto 03 sonrisa completa) — USAR ESTE para combos
de outfit/lugar de ahora en mas (reemplaza a `ced20cc2` para generar variedad; `ced20cc2`
sigue siendo el ground-truth real para QA, no se descarta).

## Ficha
- **Nombre:** Lucia. **Rol:** influencer skincare/UGC + cuenta propia + contenido de clientes.
- **Higgsfield Soul (USAR ESTE):** `36305a9b-af24-4390-959b-885082dddd5d` ("LUCIA-REAL-v2-clean", `soul_2`). Gen ~0.12cr/img.
- **Entrenada desde:** 18 frames reales verificados, TODOS del mismo video (`hf_20260615_013651_d60afdd2...`, tubo verde SVR): `hermes-content/references/models/pecas-clean-v2/`. Frames REALES, no generados.
- **Soul `9a0d6953-...` = ELIMINADO de Higgsfield (2026-07-06).** Estaba contaminado: 1 de sus 8 frames de entrenamiento (`pecas-B-02.png`) era de OTRA MUJER (video B resulto ser una persona distinta). Esto probablemente causo la perdida de consistencia reportada por Sergio. Borrado por UI a pedido explicito de Sergio. Ver `AVATAR-CONSISTENCY-SCHEME.md`.
- **Soul `2fc03fc6-...` = ELIMINADO de Higgsfield (2026-07-06).** Era una cara distinta (m2-05, generada por error). Borrado por UI a pedido explicito de Sergio.

## Rostro (face lock) — NO romper
- Pelo castano oscuro ondulado, largo-medio, raya al medio.
- Piel calida oliva/bronceada con textura real.
- **Pecas marcadas** en nariz y mejillas (rasgo distintivo — mantener SIEMPRE, nunca "limpiar" la piel).
- Ojos marrones, almendrados. Cejas gruesas oscuras naturales.
- Labios llenos naturales. Aritos de argolla dorados chicos.
- Edad ~26-28. Vibe: relatable, natural, sin maquillaje pesado, skincare-autentica.

## Cuerpo
- Esbelta natural, proporcionada. Postura relajada y cercana (no pose de modelo rigida).

## Guardarropa (curado de Pinterest 2026-07-06, por Sergio+Claude)

Fuente: busquedas Pinterest de flatlays (prenda sola, SIN cara de terceros) — cada look es
UNA imagen real subida a Higgsfield como **Reference Element** (categoria `prop`), no solo
texto. Ver catalogo completo + como generar: [[lucia-elements-catalog]].

| Look | Descripcion | Element ID | Uso |
|---|---|---|---|
| **Clean girl / skincare diario** | Top crema acanalado, cadena/aros dorados, cartera camel, lentes de sol | `16833b18-9e23-434a-99b2-92bac2915e4c` | Contenido skincare/UGC diario, el look BASE |
| **Casual streetwear** | Remera blanca, jean, cartera marron, dorado discreto | `ec1dece5-23c4-4ee3-84c6-14a49a926f7c` | Calle, cafe, salidas cortas |
| **Night out chic** | Total black: vestido/top, tacos, cartera, joyeria dorada | `5503f588-d543-4925-be56-e4db560f632d` | "Salida", restaurante, bar, review de noche |
| **Loungewear / casa** | Sweater y pantalon crema, pantuflas | `6186d80f-cb02-4cd2-89d9-e5afdcce7c6c` | GRWM, storytime en casa |

Reglas de vestuario: sin logos de terceros, sin marcas reales visibles salvo el producto
que se esta promocionando, colores coherentes con su paleta calida (crema/beige/negro),
nunca ropa que exponga de mas (mantener seguro para marca).

## Lugares / escenarios (curado de Pinterest 2026-07-06)

Cada lugar = UNA imagen real (sin personas) subida como Reference Element (`environment`).

| Escenario | Descripcion | Element ID | Uso |
|---|---|---|---|
| **Bano (base)** | Marmol blanco/negro, ducha de vidrio, luz calida | `44a4686e-1733-4b41-811d-1eb5d1cf88fc` | Rutina, review, hook diario. Validado (wan2.7 + combo elements). |
| **Dormitorio cozy** | Ropa de cama clara, luz natural de ventana | `6a721405-d019-48b3-b3e6-92bdf6a4474e` | Storytime, GRWM |
| **Cocina/cafe** | Mostrador de madera calida, plantas, luz calida | `5cfbdab5-3fdd-4cda-b0e3-efb60aa5a9b4` | Lifestyle, "rutina de manana" |
| **Calle / urbano** | Vereda arbolada, vidrieras y autos desenfocados | `cddfa484-8dea-4920-8d6b-9d00f896ae51` | Walking hooks |
| **Restaurante/bar (noche)** | Terciopelo rojo, luz calida baja, copas | `2750ef8b-7fe6-483c-9d32-01292ce32034` | "Salida" con look night-out. Validado (combo elements). |

## Voz (LOCKEADA 2026-07-09)
- **Voz canonica: `seed_audio` + voice_type='element' + `8de5db95-e898-46a6-bb68-26d02f311686` ("Lucia-voz").**
  Asset propio clonado del preset Isabella, español, tono cercano/natural skincare. Usar SIEMPRE este id.
- Fallback: preset Isabella `80924413-1ea8-4e64-9719-e00b86796f05` (la fuente del clon).
- Muestra de referencia ("Hola, soy Lucia..."): `lucia-voice/lucia-voz-signature.wav`.
- Opcional a futuro: re-clonar desde una voz real (ElevenLabs) si se quiere una voz mas unica.

## ⚠️ Metodo de generacion de fotos (CORRECCION 2026-07-09, Sergio)
Para contenido ORIGINAL: anclar SOLO la cara (`902eeebb`) + describir outfit/lugar/accion
en TEXTO. NO combinar los Elements de outfit+lugar (eso copia las fotos de referencia
1:1, sale "foto vieja con la cara pegada"). Los outfit/lugar Elements solo para match
exacto de producto/lugar real. Ver `lucia-elements-catalog.md` y `lucia-content-bank-20260709/`.

## Personalidad / tono
- Cercana, honesta, natural. Skincare desde la experiencia, sin humo. Claims seguros
  (sin cura/antiedad/antes-despues). Lenguaje de cuidado, no medico.

## Produccion — ver [[AVATAR-CONSISTENCY-SCHEME]] (4 niveles, leer antes de generar)
- **Nivel 1 (0.12cr, DEFAULT):** `soul_2` + soul_id `36305a9b-af24-4390-959b-885082dddd5d` + prompt de texto.
- **Nivel 2 (42-75cr, UGC con producto real):** Marketing Studio, avatar custom creado
  desde una foto Nivel 1 (nunca desde Elements). **VALIDADO 2026-07-06** con ISDIN
  Fusion Water SPF 50 (`ms-lucia-isdin-480p-12s.mp4`, 42cr): identidad estable,
  producto real en mano con etiqueta legible, sin deformacion.
  - Avatar `fc5c6553-...` ("Lucia ONIA") = **SUPERADO** — su foto fuente tenia arrugas
    de forehead que no estan en la referencia real (Sergio lo detecto). Causa: prompt
    con "no makeup" + enfasis de textura realista + luz cenital dura + primer plano muy
    cerrado empujaron al modelo a exagerar lineas de expresion en la frente.
  - Avatar `d9a80b78-...` ("Lucia ONIA v2") y `e9b6eca1-...` ("Lucia ONIA v3
    identity-kit") = **SUPERADOS** (2026-07-07) por el shoot quirurgico.
  - **Avatar `a1e334f3-5316-4132-b454-ddd9dcc06943` ("Lucia ONIA v4 FINAL") = USAR
    ESTE**, creado desde `03-front-big-smile.png` del `LUCIA_SURGICAL_FACE_LOCK.md`
    (aprobado por Sergio). No hay delete de avatares via API — los superados quedan
    en la libreria de Higgsfield pero NO se usan, elegir siempre por ID exacto.
    Foto fuente corregida: forehead liso igual a la referencia real. Fix que funciono:
    encuadre "half-body" (no primer plano muy cerrado) + luz difusa pareja (no cenital
    dura) + negativo explicito "poreless smooth forehead, zero wrinkles zero fine lines
    zero creases". Bonus: el encuadre half-body en ambiente casero ya lee como
    "lifestyle" en vez de selfie clinico.
  - **Para videos de produccion real:** SIEMPRE pasar `prompt` explicito en **espanol**
    (el guion auto no es determinista en idioma — con Mara salio en espanol, con Lucia
    en ingles usando el mismo preset) describiendo una escena **lifestyle** (rutina en
    casa, mañana, algo cotidiano — no clinico/laboratorio) y reforzar "forehead liso,
    sin arrugas" en el prompt para evitar que reaparezca el artefacto.
  - **Update 2026-07-07 — Identity Kit definitivo.** El fix de texto no alcanza en
    expresiones fuertes (cejas muy levantadas: sorpresa, risa grande) — `soul_2` sigue
    generando arrugas no naturales ahi. Fix: `nano_banana_pro` + Reference Element
    `ced20cc2-3388-4d98-92ee-b0fcd961aa62` (ancla real, sola, sin combinar con
    outfit/lugar), 2cr/img. Kit completo de 6 imagenes (neutral, sonrisa suave, sonrisa
    completa, 3/4, perfil, sorpresa) verificado sin arrugas en ningun caso, en
    `lucia-identity-kit-20260707/`. **Regla: `soul_2` sigue de default para expresiones
    calmas (barato); `nano_banana_pro`+ancla real para expresiones fuertes.**
- **Nivel 3 (15cr/10s, talking sin producto):** still Nivel 1 -> `wan2_7` + audio.
  Verificado estable con Lucia.
- **Nivel 4 (2cr, ultimo recurso):** `nano_banana_2` + Elements, solo prop/lugar exacto
  sin que hable. QA obligatorio. Ver [[lucia-elements-catalog]].
- **Lip sync (barato-medio, 15cr/10s):** `wan2_7` con still de Lucia + audio de voz.
  **El still SIEMPRE debe tener sonrisa abierta con dientes visibles** — con boca
  cerrada el modelo inventa dientes desde cero al hablar y pierden consistencia (fix
  verificado 2026-07-06, ver `AVATAR-CONSISTENCY-SCHEME.md`). Version corregida:
  `lucia-lifestyle-talking-es-v2-teeth-fix.mp4`.
- **Hero/UGC con producto en mano (42-75cr):** Marketing Studio, avatar custom.
- **Branded/precio (barato, ~3cr):** editor Remotion (content-engine).
- **Negative constante:** no app/IG UI, no texto en pantalla, no logos, no watermark,
  no identity drift, no quitarle las pecas, no cambiar estructura facial, no piel plastica.

## Patron de contenido: barato/generico vs caro/marca real (2026-07-06)
Probando una tanda de 4 fotos Nivel 1 (dormitorio, cocina, calle, bano+producto) se
confirmo un patron estructural util: **Nivel 1 (0.12cr, solo texto) NUNCA puede traer una
marca/producto real** — cuando el prompt pide "sostener un frasco verde de skincare" el
modelo INVENTA una etiqueta generica (ej. "ROXIA"), no reproduce el packshot real. Recien
Nivel 2 (Marketing Studio, image-conditioning real) o Nivel 4 (Elements) muestran la
marca real y legible.

**Esto simplifica la pregunta "cuenta propia vs cuenta Nuvia":** no es necesariamente un
account distinto por marca — es el mismo patron que usan influencers reales: contenido
generico/lifestyle (barato, frecuente, SIN marca) vive bien en cualquier cuenta como
"vida cotidiana", y el contenido con producto real (caro, puntual, Nivel 2+) es la pieza
"sponsoreada". Ambos pueden convivir en la MISMA cuenta propia — el nivel de produccion
ya separa naturalmente que es organico y que es contenido de cliente/Nuvia, sin necesidad
de duplicar cuentas.

## Orden de trabajo (2026-07-06, pedido de Sergio)
1. ✅ Cara real lockeada (Soul `36305a9b-af24-4390-959b-885082dddd5d`, 18 frames verificados de un solo video), entrenado y verificado.
2. ✅ Guardarropa + lugares definidos (esta seccion).
3. ✅ Pruebas BARATAS (soul_2, 0.12cr) — 2/2 generaciones verificadas (retrato neutro + bano/producto vs texto), identidad fiel al frame real (pecas, cejas, ojos, labios), sin deformacion. Souls viejos (`9a0d6953`, `2fc03fc6`) eliminados de Higgsfield.
4. Recien despues: mas trabajo de video/lipsync ("caras" es la fase cara, se hace al final).
