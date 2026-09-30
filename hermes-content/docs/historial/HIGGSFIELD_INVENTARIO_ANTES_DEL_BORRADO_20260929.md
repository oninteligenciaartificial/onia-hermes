> ⚠️ **Corregido el mismo 2026-09-29.** Esta foto repite una afirmación FALSA de docs anteriores:
> que la cara de Lucía venía de «cuadros de video de una persona real». Sergio Urcullo la hizo 100%
> con IA (el video fuente es `hf_20260615_…mp4`, una salida de Higgsfield). Las fuentes de Lucía se
> CONSERVAN; el alcance real del borrado está en `LUCIA-HIGGSFIELD-IDENTITY.json` →
> `deletion_scope_2026_09_29`.

# Inventario de Higgsfield antes del borrado total — 2026-09-29

> **Foto de un día, NO fuente de verdad.** Lo vigente vive en
> `hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json`.

**Por qué existe.** Sergio Urcullo, 2026-09-29: *«borralo nomás, no pasa nada, solo queremos empezar
de cero pero el learning mantenelo para no perderlo, solo las caras lo hacemos de nuevo para empezar
con las caras ya fijadas y con photoshoot donde se marquen todos los rasgos»*.

Se borra la **identidad** (Souls y Elements), no el aprendizaje: los docs de `references/modelos/`
y esta lista quedan. Cuenta al momento del inventario: plan **Pro**, **570,91 créditos**, un solo
workspace privado (`ed5a2a8f-5a06-4087-a680-81bc592b1b4e`). Listado en vivo por MCP (`show_characters`,
`show_reference_elements`) el 2026-09-29 ~20:05 UTC.

## Lo que se aprendió de este inventario — lo que NO hay que repetir

1. **Cuatro sistemas de identidad para una sola cara** (Souls, Elements, avatar de Marketing Studio,
   referencias sueltas) y ninguno portable. Resultado: cada sesión elegía una distinta.
2. **Nombres que se repiten** (`LUCIA-SINTETICA-v3` es a la vez Soul y Element; `Mara BO v2` también):
   un Soul entrenado crea su Element solo. Se elige por ID, nunca por nombre.
3. **La cara nació de cuadros de video de una persona real** (`lucia-face-real-anchor`) sin
   consentimiento documentado. Todo lo que desciende de ahí quedó sin poder publicarse.
4. **Datasets chicos y mezclados**: el Soul v3 se entrenó con 6 fotos de linajes distintos y derivó.
   La guía vigente de Higgsfield pide 20 a 80 fotos de la MISMA cara.
5. **Encadenar salidas** (generar → usar la salida como nueva referencia) acumula deriva en pecas,
   ojos y edad aparente.

## Souls (9)

| Nombre | ID | Qué era |
|---|---|---|
| LUCIA-SINTETICA-v3 | `e6d8703c-ea48-4d37-9e66-afae59ebe84a` | Soul 2 de Lucía con 6 imágenes. Rechazado: derivó (color de ojos) y perdió contra el ancla el 22-ago. |
| LUCIA-REAL-v2-clean | `36305a9b-af24-4390-959b-885082dddd5d` | PROHIBIDO: entrenado con cuadros de una persona real sin consentimiento; deriva, piel roja. |
| Mara BO v2 | `6c94bbf0-bc71-4fe1-841e-f366bdb00b6e` | Modelo IA 'Mara' (mestiza urbana), v2. Línea influencers, congelada. |
| Mara ONIA v1 | `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f` | Modelo IA 'Mara' v1. |
| Sergio Onia | `a5f9ee23-8c53-46d0-afc8-e3cb5c9e2b2b` | Soul de Sergio Urcullo (fotos propias). Mal hecho según Sergio Urcullo. |
| Sergio ONIA v2 | `bce5feb0-f028-4d1f-b2b3-96428a013f85` | Soul de Sergio Urcullo v2. |
| Sergio ONIA Face Teeth Lock 20260605 | `aeaa74af-5243-4dc0-8101-09b25e98a7d7` | Soul de Sergio Urcullo con foco en dientes. |
| Sergio ONIA 20260604 All Black | `1238064e-1295-4cbf-9a41-861d4106e0e8` | Soul de Sergio Urcullo, ropa negra. |
| Sergio ONIA 20260603 | `05cebe09-5672-4d50-90b2-d92c680957f7` | Primer Soul de Sergio Urcullo. |

## Elements (38)

| Nombre | ID | Tipo | Creado | Qué era |
|---|---|---|---|---|
| lucia-skin-v1 | `58bbd635-9b90-4bd2-b08a-1cd4915bd563` | character | 2026-08-28 | Ancla multi-ángulo de Lucía (7 tomas del banco blanco). Baseline operativo hasta hoy; linaje con derechos NO resueltos. |
| ZZ-TEST-limite-33 | `9f31a06c-0808-4ba0-8a4e-11ece7478db2` | character | 2026-08-28 | Sonda técnica: techo de medias por Element. |
| ZZ-TEST-limite-medias | `3bf30c8d-c9c2-4cdc-805f-7203ee0f9bf3` | character | 2026-08-28 | Sonda técnica: límite de medias por Element. |
| LUCIA-SINTETICA-v3 | `e420dc31-73f7-4d8c-9de0-73534adcae8f` | character | 2026-08-23 | Element auto-creado por el Soul v3. |
| modelo2-ancla-v3-bases | `06404192-fe02-48e6-9ce8-3e146f977f67` | character | 2026-08-21 | Modelo 2: 3 fotos base (gpt_image_2). |
| modelo2-ancla-v2-gpt | `213993a2-620f-4e73-b105-8eed91d5bc51` | character | 2026-08-21 | Modelo 2 v2, multi-referencia. |
| modelo2-ancla-2026-08 | `9d81f43c-7301-4384-b829-5cffcd35ff63` | character | 2026-08-21 | Modelo 2 v1 (casting B2). |
| lucia-ancla-2026-08 | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` | character | 2026-08-08 | Ancla de UNA sola foto (selfie de espejo). Jubilada el 28-ago: inventaba el perfil. |
| Mara BO v2 | `221b3ca8-f79d-4151-ab3d-ef68ff51e251` | character | 2026-08-06 | Element auto-creado por el Soul Mara BO v2. |
| mara-bo-v2-cara | `550088fc-a18d-4762-9d51-0aed5a9044bf` | character | 2026-08-06 | Cara base de Mara v2. |
| Sergio Onia | `19b0ae8d-68d6-4c4f-a744-5d6d653c0e02` | character | 2026-07-30 | Element auto-creado por el Soul de Sergio Urcullo. |
| lucia-fit-gym-v2 | `8352ef80-63b4-4cb1-be8b-b21cbacb22be` | prop | 2026-07-09 | Outfit gym (turnaround). |
| lucia-fit-loungewear-v2 | `23135bd8-8827-4bb5-9045-fe08ef80f9e1` | prop | 2026-07-09 | Outfit loungewear (turnaround). |
| lucia-fit-nightout-v2 | `3c9d1e87-ea1b-4ae1-8c5e-60683a848033` | prop | 2026-07-09 | Outfit night-out (turnaround). |
| lucia-fit-streetwear-v2 | `db9608fd-5f72-49df-b681-9414382c5cbb` | prop | 2026-07-09 | Outfit streetwear (turnaround). |
| lucia-fit-cleangirl-v2 | `cac118e1-a683-4874-b32a-eee4efbbed36` | prop | 2026-07-09 | Outfit clean-girl (turnaround). |
| lucia-surgical-anchor | `902eeebb-89e9-4477-8426-c555b20f7ecc` | character | 2026-07-08 | Frontal sonrisa, fondo blanco. Backup del ancla; A/B nunca corrido. |
| LUCIA-REAL-v2-clean | `d5e323ef-4d0e-41bf-863e-ec30aede20ae` | character | 2026-07-06 | Element del Soul prohibido. |
| lucia-face-real-anchor | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` | character | 2026-07-06 | Cuadro REAL de un video de una persona (pecas-A-15). Origen del problema de derechos. |
| lucia-place-bar | `2750ef8b-7fe6-483c-9d32-01292ce32034` | environment | 2026-07-06 | Lugar: bar nocturno terciopelo rojo. |
| lucia-place-street | `cddfa484-8dea-4920-8d6b-9d00f896ae51` | environment | 2026-07-06 | Lugar: vereda urbana arbolada. |
| lucia-place-cafe | `5cfbdab5-3fdd-4cda-b0e3-efb60aa5a9b4` | environment | 2026-07-06 | Lugar: café/cocina cálida. |
| lucia-face-element | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | character | 2026-07-06 | Cara generada por Soul (un paso de deriva). |
| lucia-place-bedroom | `6a721405-d019-48b3-b3e6-92bdf6a4474e` | environment | 2026-07-06 | Lugar: dormitorio cozy. |
| lucia-place-bathroom | `44a4686e-1733-4b41-811d-1eb5d1cf88fc` | environment | 2026-07-06 | Lugar: baño mármol. |
| lucia-outfit-loungewear | `6186d80f-cb02-4cd2-89d9-e5afdcce7c6c` | prop | 2026-07-06 | Outfit v1 loungewear. |
| lucia-outfit-nightout | `5503f588-d543-4925-be56-e4db560f632d` | prop | 2026-07-06 | Outfit v1 night-out. |
| lucia-outfit-streetwear | `ec1dece5-23c4-4ee3-84c6-14a49a926f7c` | prop | 2026-07-06 | Outfit v1 streetwear. |
| lucia-outfit-cleangirl | `16833b18-9e23-434a-99b2-92bac2915e4c` | prop | 2026-07-06 | Outfit v1 clean-girl. |
| Mara ONIA v1 | `75925115-ba03-4721-856d-0a17c8c61ea1` | character | 2026-07-05 | Element auto-creado por el Soul Mara ONIA v1. |
| Maya-Lin | `548740ab-2d87-4109-a499-c3c897fccad5` | character | 2026-06-14 | Personaje de prueba (junio). |
| svr-jabon | `b16f3869-e8c2-4608-ae7b-437b58725df1` | auto:prop | 2026-06-13 | Producto de prueba (SVR). |
| avayat-sergio | `f7e021dc-4c38-4e23-bfa0-88770749afd9` | character | 2026-06-13 | Avatar de pruebas de Sergio Urcullo. |
| isdin | `2296f924-4dba-4b03-9c33-028b7b1fff92` | auto:prop | 2026-06-13 | Producto de prueba (ISDIN). |
| Sergio ONIA v2 | `556c9050-4234-4703-9ba9-797c4dca1011` | character | 2026-06-09 | Element auto-creado por el Soul. |
| Sergio ONIA Face Teeth Lock 20260605 | `ce811531-3576-4347-8791-9bf576fc667e` | character | 2026-06-05 | Element auto-creado por el Soul. |
| Sergio ONIA 20260604 All Black | `c0e4b1de-c55f-4cb1-bfde-06d920ba8921` | character | 2026-06-04 | Element auto-creado por el Soul. |
| Sergio ONIA 20260603 | `f62ac93d-073b-46b4-b7e6-075d2151308b` | character | 2026-06-03 | Element auto-creado por el Soul. |

## Fuera de este listado

- Avatar de Marketing Studio **`Lucia ONIA v4 FINAL`** (`a1e334f3-5316-4132-b454-ddd9dcc06943`), según
  el manifest del 23-sep. No se pudo listar por MCP en esta sesión.
- Las generaciones (imágenes y videos) quedan en *Assets* de la cuenta: borrar una identidad no
  borra lo ya generado.
