# Identity Bible — Lucia (ONIA modelo "pelinegra con pecas")

> Identidad REAL elegida por Sergio (Mujer 1 de sus videos aprobados, tubo verde SVR).
> Entrenada desde SUS frames reales — NO cambiar sus rasgos. Ficticia/ownable como personaje
> de marca. No publicar sin aprobacion. Renombrada 2026-07-06 (antes "Valentina" en un paso
> intermedio de la sesion) para alinear con el nombre que usa Sergio.

## Ficha
- **Nombre:** Lucia. **Rol:** influencer skincare/UGC + cuenta propia + contenido de clientes.
- **Higgsfield Soul (el bueno, real):** `9a0d6953-ff2e-40ba-b763-806e0d447325` (`soul_2`). Gen ~0.12cr/img.
- **Entrenada desde:** 8 frames reales de los videos aprobados de Sergio (`hermes-content/references/models/pecas-source-frames/`): `pecas-A-02,10,11,12,13,14,15`, `pecas-B-02` (videos `hf_20260615_013651_d60afdd2...` + `hf_20260615_005124_cde0c155...`). Frames REALES, no generados.
- **Soul viejo `2fc03fc6-...` = ARCHIVADO/NO USAR.** Era una cara distinta (m2-05, generada por error). No confundir.

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

Fuente: busquedas Pinterest "UGC content creator outfit casual beige aesthetic",
"clean girl outfit", "brunette casual chic outfit going out night". Extraidos solo
principios de estilo/color — no copiar fotos de personas reales como referencia de cara.

| Look | Descripcion | Uso |
|---|---|---|
| **Clean girl / skincare diario** | Top crema/beige liso o acanalado (ribbed), pantalon o jean claro, dorado minimalista (cadena fina, aros chicos). Paleta: crema, beige, arena, blanco roto. | Contenido skincare/UGC diario, bano, rutina — el look BASE de Lucia. |
| **Casual streetwear** | Remera blanca o top basico + jean recto + zapatillas blancas. Joyeria dorada discreta. | Calle, cafe, salidas cortas, "iba caminando y..." |
| **Night out chic (elegante)** | Total black: top halter o musculosa + pantalon de vestir, o vestido corto negro con blazer, o top de encaje + palazzo. Accesorios plateados/dorados discretos. | Contenido "salida", restaurante, bar, review de noche. |
| **Loungewear / casa** | Top o sweater crema oversized, pantalon suelto de friza clara. Sin joyeria o minima. | Contenido "GRWM", rutina de noche, storytime en casa. |

Reglas de vestuario: sin logos de terceros, sin marcas reales visibles salvo el producto
que se esta promocionando, colores coherentes con su paleta calida (crema/beige/negro),
nunca ropa que exponga de mas (mantener seguro para marca).

## Lugares / escenarios (curado de Pinterest 2026-07-06)

Fuente: busquedas "UGC creator bedroom bathroom aesthetic setting", "UGC creator kitchen
street cafe aesthetic lifestyle". Principios de ambiente, no fotos de personas.

| Escenario | Descripcion | Uso |
|---|---|---|
| **Bano (base)** | Mesada de marmol blanco/beige, espejo grande, luz calida suave (ring light sutil), toallas neutras, 1-2 productos de skincare visibles. | Rutina, review de producto, hook diario. Ya validado (test wan2.7). |
| **Dormitorio cozy** | Ropa de cama blanca/crema, luz natural de ventana, ambiente calido y ordenado, sin desorden. | Storytime, GRWM, contenido mas intimo/calido. |
| **Cocina/cafe** | Mesada de madera clara o cafeteria con luz calida, taza de cafe, ambiente acogedor. | Contenido lifestyle, "mi rutina de mañana", pausa/reflexion. |
| **Calle / urbano** | Vereda o pasillo exterior, luz natural de dia, fondo desenfocado (vidrieras, gente borrosa). | Walking hooks, "iba caminando y penso en...", descubrimiento. |
| **Restaurante/bar (noche)** | Luz calida baja, madera oscura o cortinas de terciopelo, ambiente elegante. | Contenido "salida", solo con look night-out. |

## Voz
- Preset sugerido `seed_audio` **Isabella** (`80924413-1ea8-4e64-9719-e00b86796f05`) — distinta de Mara. O clonar voz propia con **ElevenLabs** (Sergio la tiene) para consistencia real en produccion 24/7.

## Personalidad / tono
- Cercana, honesta, natural. Skincare desde la experiencia, sin humo. Claims seguros
  (sin cura/antiedad/antes-despues). Lenguaje de cuidado, no medico.

## Produccion (ver [[higgsfield-models-roster]] y `PIPELINE-lipsync-24-7.md`)
- **Fotos (barato, 0.12cr):** `soul_2` + soul_id `9a0d6953-...` + prompt de outfit/lugar de esta bible.
- **Lip sync (barato-medio, 15cr/10s):** `wan2_7` con still de Lucia + audio de voz. Ya
  verificado estable (`valentina-lipsync-wan27-10s.mp4`, cara sin romperse, boca sincronizada).
- **Hero/UGC con producto en mano (42-75cr):** Marketing Studio, avatar custom.
- **Branded/precio (barato, ~3cr):** editor Remotion (content-engine).
- **Negative constante:** no app/IG UI, no texto en pantalla, no logos, no watermark,
  no identity drift, no quitarle las pecas, no cambiar estructura facial, no piel plastica.

## Orden de trabajo (2026-07-06, pedido de Sergio)
1. ✅ Cara real lockeada (Soul `9a0d6953`), verificada estable.
2. ✅ Guardarropa + lugares definidos (esta seccion).
3. ⏳ Pruebas BARATAS (soul_2, 0.12cr) combinando outfits x lugares — verificar que no se rompe.
4. Recien despues: mas trabajo de video/lipsync ("caras" es la fase cara, se hace al final).
