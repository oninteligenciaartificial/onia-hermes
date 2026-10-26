# Higgsfield — Mapa completo de funciones -> pipeline ONIA (2026-07-06)

> **Verificado 2026-07-07 contra `models_explore(action=list)` en vivo — el catalogo de
> este doc (imagen/video) sigue siendo exacto.** Este es el doc a consultar SIEMPRE que
> la pregunta sea "¿existe/tenemos el modelo X?" — no usar `models_explore(action=search)`
> con 1-2 palabras sueltas para esa pregunta, el matching de esa herramienta no es
> exhaustivo y da falsos negativos (paso con Veo 3: se dijo "no disponible" por una
> busqueda angosta cuando en realidad ya estaba listado aca mismo).

Auditoria de TODAS las funciones del MCP de Higgsfield y como usarlas para: (a) modelos
IA influencer, (b) contenido UGC que vende, (c) movimiento/formatos, (d) automatizacion.
Regla: **barato por defecto**, validar antes de gastar, no publicar sin aprobacion.
Plan: ultra, 3000 creditos.

## 0. Anclas de costo (creditos) — verificado por preflight/historial

| Barato | Medio | Caro (evitar salvo aprobacion) |
|---|---|---|
| z_image 0.15 · text2image_soul_v2 / soul_cinematic ~0.12 · nano_banana ~2 · marketing_studio_image 2 · seed_audio ~2.4/voz | nano_banana_2 1k/2k/4k = 1.5/2/3 · recraft 8 · gpt_image 7 · kling3_0_turbo 7.5/5s · veo3.1_lite (batch) | seedance_2_0 45-135 · kling3_0 (audio/4k) · veo3.1 preview/ultra · cinema studio 4k |

Movimiento "movido" barato = kling3_0_turbo (7.5/clip) o edicion en nuestro editor (0.12/foto). Video con voz/lipsync realista = caro (wan2.7/kling3/seedance): solo con aprobacion.

## 1. IMAGEN (modelos)

| Modelo | Uso | Tier |
|---|---|---|
| **z_image** | explorar caras/estilos rapido (text-only, cara distinta c/vez) | barato |
| **text2image_soul_v2 / soul_v2** | UGC/retrato con **Soul entrenado** (identidad fija) | barato ~0.12 |
| **soul_cinematic** | igual pero look cine | barato |
| **nano_banana** / **nano_banana_2** (Pro) / **_lite** / **_shots** | image-to-image, **banco de identidad** desde 1 foto ref, 4K, texto/diagramas (Pro) | medio |
| **seedream_v4_5 / v5_lite** | edicion por instruccion, 4-6K, transformaciones | medio |
| **gpt_image_2 / openai_hazel** | mejor render de **texto/logos**, edicion | caro (7) |
| **flux_2 / flux_kontext** | prompt adherence, style transfer/edicion contextual | medio |
| **kling_omni_image / grok_image** | fotorrealista/expresivo | medio |
| **recraft_v4_1** | vector/logos/iconos/mockups/paleta (usado en Radar IA) | 8 |
| **cinematic_studio_2_5** | stills cine 4K | medio |
| **marketing_studio_image** | **ad de producto 1-click** para social | 2 |
| **ms_image (DTC Ads)** | ads con **brand kit** + avatar + producto (requiere style_id) | medio |
| **soul_location** | fondos/ambientes | barato |
| **image_auto** | auto-elige modelo | — |
| Edicion: **outpaint** (expandir), **image_background_remover**, **topaz_image / _generative** (upscale+cara), **bytedance_image_upscale** (2k/4k), **autosprite** (sprite de juego) | post-produccion de imagen | varia |

## 2. VIDEO (modelos)

| Modelo | Uso | Tier |
|---|---|---|
| **kling3_0_turbo** | **image-to-video rapido** (animar 1 foto) — nuestro caballo barato | 7.5/5s |
| **kling3_0** | multi-shot, **audio-sync**, motion-transfer, 4k | caro |
| **kling2_6** | motion cinematico + audio | medio-caro |
| **veo3_1_lite** | **batch barato** de clips (audio opcional) | barato-medio |
| **veo3 / veo3_1** | cine ultra-realista (preview/ultra) | caro |
| **seedance1_5** | motion confiable, audio nativo | medio |
| **seedance_2_0** | **reference-driven identidad** (img/video/audio ref), multi-SKU e-commerce, 4k | **caro 45-135** |
| **seedance_2_0_mini** | version barata de seedance 2.0 (480/720) | medio |
| **minimax_hailuo** | fisica natural, **emocion facial** | medio |
| **wan2_6 / wan2_7** | **audio-sync, personaje consistente** (talking) | medio-caro |
| **gemini_omni** | reference-driven + audio nativo | medio |
| **grok_video / _v15** | text/img-to-video con audio | medio |
| **cinematic_studio_video / _v2 / _3_0** | cine con genero/multi-shot/speedramp | medio-caro |
| **marketing_studio_video** | **UGC ad 1-click** (avatar+producto+hook+setting), TikTok/Reels, 12-15s | caro (video) |
| **clipify (Personal Clipper)** | 1 YouTube -> N clips con subtitulos y face-tracking | medio |
| **higgsfield_preset** | **image-to-video con preset viral** (ver seccion 5) | medio |
| **explainer_video** | ensambla bloques narrados con subtitulos | — |
| Post: **topaz_video / bytedance_video_upscale** (up a 4k), **video_deflicker**, **sam_3_video / video_background_remover** (quitar fondo), **video_upscale** | | varia |

## 3. AUDIO / VOZ

- **seed_audio** (ByteDance): TTS default, es femenino "Elena" ya usado (~2.4). Params: speech_rate, pitch, loudness, formato. Puede clonar de audio ref.
- **text2speech_v2**: motor seleccionable (**elevenlabs**, minimax, seed_speech, vibe_voice, cozy_voice) + voz preset/element.
- **create_voice / create_voice_from_confirmed_audio**: **clonar voz** (voz propia de cada modelo).
- **dubbing**: traducir/doblar un video a otro idioma manteniendo voz.
- **voice_change**: cambiar la voz de un audio.
- (game-only, NO usar: sonilo_music, mirelo_text_to_audio, inworld_tts.)

## 4. IDENTIDAD (crear/definir modelos) — lo mas importante

- **z_image** -> explorar y elegir UNA cara (barato).
- **nano_banana (2/Pro)** con esa cara como **image ref** -> **contact sheet** multi-pose (mismo rostro). Recortar en fotos individuales = banco de identidad. (Probado: mantiene identidad.)
- **show_characters (Soul train)**: subir 5-20 fotos del banco -> **Soul entrenado** (~10 min, **25cr** — corregido 2026-07-06, se creyo gratis por error). Genera con **text2image_soul_v2** a ~0.12/img. Solo text2image_soul_v2 / soul_cinematic.
- **show_reference_elements**: guardar 1 imagen como **Element** reusable (instantaneo) -> sirve con nano/seedream/gpt/kling/seedance/cinema (NO text2image_soul_v2). Para multi-personaje o modelos sin Soul.
- **Cuerpo completo / vestuario**: generar sheets de cuerpo y looks con nano/soul y documentarlos en el bible.
- Souls actuales: Mara `b8f5c353` (pelirroja) + 4 de Sergio. Modelo 2 (morena m2-05): banco listo, falta entrenar Soul.

## 5. PRESETS image-to-video (templates virales) — "mas movido"

`presets_show` da ~45 presets cinematicos aplicables a UNA foto de la modelo via
`higgsfield_preset`. Utiles para trends: **BASEBALL GAME (stargirl), RED CARPET, ENDING FAIRY,
2000'S/CANDID PAPARAZZI, RACE TRACK, SUMMER HAZE, DROWN IN MUSIC, DRIFT RACING**, etc.
Uso: foto de la modelo (Soul) -> preset -> clip viral con movimiento y camara pro. Costo = video (medio). Ideal para contenido de la cuenta de la influencer (no product-sell).

## 6. WORKFLOWS (multi-paso)

`get_workflow_instructions`: catalogo. Expuesto hoy: **video-explainer** (narrado animado no-fotoreal, 1 voz + bloques 10s + subtitulos). Referencia a otros (ugc-*, tv-ad, cinematic-flow, podcast-flow) que se cargan por nombre cuando se necesiten.

## 7. MARKETING STUDIO (UGC ads nativos de Higgsfield)

`show_marketing_studio` gestiona: **brand_kit** (logo/colores/fuentes/tono), **product** (hasta 4),
**avatar** (preset o custom), **hook** (mecanica de atencion), **setting** (lugar/vibe),
**ad_reference** (recrea el escenario de un ad existente). Con `marketing_studio_video` = UGC ad
12-15s TikTok/Reels con avatar hablando + producto. **Alternativa nativa** a nuestro editor Remotion:
mas "movido" y con avatar hablando, pero mas caro y menos control de marca/precio. Estrategia:
Remotion para branded/preciso/barato; Marketing Studio para UGC con avatar hablando cuando valga el costo.

## 8. OTRAS FUNCIONES

- **shorts_studio_***: genera shorts automaticos (sesiones/presets).
- **personal_clipper_***: YouTube -> clips (clipify).
- **virality_predictor**: predice performance de un video (hook/retencion). GRATIS-ish, correr antes de publicar.
- **video_analysis_***: analiza un video de referencia (estructura/hook) sin copiar identidad.
- **3D**: image-to-3d / multi-image-to-3d / rigging / animation (678 acciones) / text-to-3d / sam3 — para producto 3D, packshots animados, mascota.
- **Website/Game**: create_website/deploy_website (link-in-bio / landing de la influencer), create/deploy_game.
- **animation_actions**: libreria de 678 animaciones para rigs 3D.
- **balance / transactions / show_plans_and_credits**: control de gasto.
- **media_upload / media_import_url / media_confirm / show_medias**: subir refs.
- **job_display / show_generations**: recuperar resultados.

## 9. MAPEO A ONIA (estrategia barato-first)

1. **Crear modelo** (barato): z_image (elegir cara) -> nano contact sheet (banco) -> Soul train (gratis) -> text2image_soul_v2 0.12/img. Bible por modelo (rostro/cuerpo/vestuario/voz/personalidad).
2. **Producir contenido**:
   - **Branded/product-sell/preciso** -> nuestro **editor Remotion** (content-engine), movimiento por edicion (barato). Fotos de la modelo con text2image_soul_v2.
   - **Movido/trend/lifestyle de la cuenta** -> foto Soul -> **higgsfield_preset** (viral) o **kling3_0_turbo** (animar). 
   - **UGC con avatar hablando** (cuando valga) -> **marketing_studio_video** o **wan2.7/kling3** (lipsync) — caro, aprobacion.
3. **Voz**: seed_audio/elevenlabs por modelo; clonar voz propia (create_voice) para consistencia.
4. **Formatos** (1 template -> N): product-sell (hecho), GRWM/rutina, storytime/POV, review, trend. Cada uno = template Remotion + variantes de preset Higgsfield.
5. **QA/optimizar**: virality_predictor antes de publicar; topaz upscale para calidad final.
6. **Publicar**: cuenta propia por modelo; automatizacion n8n (calendario -> guion -> Higgsfield Soul -> editor -> cola aprobacion -> IG/YouTube con token). Nada sin aprobacion.
7. **Costo**: identidad y branded baratos (0.12-3cr); video realista (kling/seedance/veo) solo puntual y aprobado.

## 10. Lo que NO conviene por costo

- Seedance 2.0 std (45-135cr) para b-roll rutinario. Usar kling3_0_turbo o edicion.
- Recraft/gpt_image (7-8cr) salvo cuando se necesite texto/logo/vector especifico.
- Video con audio nativo en todos los clips (sube costo): preferir voz aparte (seed_audio) + edicion.
