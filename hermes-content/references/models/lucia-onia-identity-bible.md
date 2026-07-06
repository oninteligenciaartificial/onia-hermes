# Identity Bible — Lucia (ONIA modelo "pelinegra con pecas")

> Identidad REAL elegida por Sergio (Mujer 1 de sus videos aprobados, tubo verde SVR).
> Entrenada desde SUS frames reales — NO cambiar sus rasgos. Ficticia/ownable como personaje
> de marca. No publicar sin aprobacion. Renombrada 2026-07-06 (antes "Valentina" en un paso
> intermedio de la sesion) para alinear con el nombre que usa Sergio.

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

## Voz
- Preset sugerido `seed_audio` **Isabella** (`80924413-1ea8-4e64-9719-e00b86796f05`) — distinta de Mara. O clonar voz propia con **ElevenLabs** (Sergio la tiene) para consistencia real en produccion 24/7.

## Personalidad / tono
- Cercana, honesta, natural. Skincare desde la experiencia, sin humo. Claims seguros
  (sin cura/antiedad/antes-despues). Lenguaje de cuidado, no medico.

## Produccion — ver [[AVATAR-CONSISTENCY-SCHEME]] (4 niveles, leer antes de generar)
- **Nivel 1 (0.12cr, DEFAULT):** `soul_2` + soul_id `36305a9b-af24-4390-959b-885082dddd5d` + prompt de texto.
- **Nivel 2 (42-75cr, UGC con producto real):** Marketing Studio, avatar custom creado
  desde una foto Nivel 1 (nunca desde Elements). **VALIDADO 2026-07-06** con ISDIN
  Fusion Water SPF 50 (`ms-lucia-isdin-480p-12s.mp4`, 42cr, avatar `fc5c6553-...`):
  identidad estable, producto real en mano con etiqueta legible, sin deformacion.
  Ojo: el guion auto salio en ingles esta vez (no es determinista) — forzar espanol
  con `prompt` explicito para piezas de produccion real.
- **Nivel 3 (15cr/10s, talking sin producto):** still Nivel 1 -> `wan2_7` + audio.
  Verificado estable con Lucia.
- **Nivel 4 (2cr, ultimo recurso):** `nano_banana_2` + Elements, solo prop/lugar exacto
  sin que hable. QA obligatorio. Ver [[lucia-elements-catalog]].
- **Lip sync (barato-medio, 15cr/10s):** `wan2_7` con still de Lucia + audio de voz. Ya
  verificado estable (`valentina-lipsync-wan27-10s.mp4`, cara sin romperse, boca sincronizada).
- **Hero/UGC con producto en mano (42-75cr):** Marketing Studio, avatar custom.
- **Branded/precio (barato, ~3cr):** editor Remotion (content-engine).
- **Negative constante:** no app/IG UI, no texto en pantalla, no logos, no watermark,
  no identity drift, no quitarle las pecas, no cambiar estructura facial, no piel plastica.

## Orden de trabajo (2026-07-06, pedido de Sergio)
1. ✅ Cara real lockeada (Soul `36305a9b-af24-4390-959b-885082dddd5d`, 18 frames verificados de un solo video), entrenado y verificado.
2. ✅ Guardarropa + lugares definidos (esta seccion).
3. ✅ Pruebas BARATAS (soul_2, 0.12cr) — 2/2 generaciones verificadas (retrato neutro + bano/producto vs texto), identidad fiel al frame real (pecas, cejas, ojos, labios), sin deformacion. Souls viejos (`9a0d6953`, `2fc03fc6`) eliminados de Higgsfield.
4. Recien despues: mas trabajo de video/lipsync ("caras" es la fase cara, se hace al final).
