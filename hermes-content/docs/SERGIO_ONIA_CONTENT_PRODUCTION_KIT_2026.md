# Sergio / ONIA Content Production Kit 2026

Estado: canonico interno para briefs, guiones y prompts de video.

No reemplaza aprobaciones humanas. La cara y voz de Sergio pueden usarse como referencia interna, pero generar video con su cara, clonar voz o publicar contenido requiere aprobacion explicita por pieza.

## Objetivo

Tener un sistema listo para producir videos de:

- Sergio como marca personal y fundador operador.
- ONIA como empresa de automatizacion, IA y consultoria.
- Clientes externos con estilo UGC, demostracion o venta.

Cada pieza debe elegir un carril antes de escribir: `sergio`, `onia` o `cliente`. No mezclar precios, promesas, servicios ni mensajes comerciales entre marcas.

## Estado de identidad de Sergio

- Referencias de cara: listas para analisis y prompts internos.
- Referencias de voz: audios extraidos y listos como referencia.
- Transcripcion fina de voz: pendiente si no hay `OPENAI_API_KEY` disponible.
- Generacion con cara de Sergio: bloqueada hasta aprobacion explicita.
- Clonacion o recreacion de voz: bloqueada hasta aprobacion explicita.
- Publicacion: bloqueada hasta aprobacion final de Sergio.

## Uniforme visual de Sergio

Sergio debe verse reconocible, serio y consistente: ropa negra, limpia, simple, sin logos grandes y sin colores llamativos.

### Outfits listos

| ID | Outfit | Uso principal | Prompt visual |
| --- | --- | --- | --- |
| `black_operator_basic` | Camiseta negra limpia, pantalon negro o jean oscuro, zapatos oscuros | Videos diarios, hooks directos, marca personal | `wearing a clean all-black outfit: black t-shirt, black pants, dark shoes, no visible logos` |
| `black_consultant` | Camiseta negra con overshirt, chaqueta ligera o blazer negro | Auditorias, consultoria, ventas B2B, ONIA | `wearing a black t-shirt with a black overshirt or lightweight black jacket, professional but approachable` |
| `black_technical_demo` | Hoodie negro o chaqueta negra con cierre, pantalon oscuro | Demos tecnicas, n8n, Notion, IA, builds | `wearing a black hoodie or black zip jacket, practical technical operator look` |
| `black_premium_meeting` | Blazer negro o chaqueta estructurada, camiseta negra, pantalon oscuro | Propuestas, autoridad, clientes premium | `wearing a black blazer over a black t-shirt, clean premium consultant look` |
| `black_content_casual` | Camiseta negra, reloj sencillo, fondo real de trabajo | Clips espontaneos, reels, historias | `wearing a simple black t-shirt, natural creator setup, authentic phone-camera look` |

Evitar: logos grandes, estampados fuertes, ropa brillante, colores neon, trajes que parezcan disfraz, lujo falso, accesorios que roben atencion.

## Modelos de personaje

### Sergio casual/directo

- Carril: `sergio`.
- Energia: directo, calle, real, sin sonar guru.
- Outfit: `black_operator_basic` o `black_content_casual`.
- Escenas: escritorio, telefono en mano, caminando, pantalla con proceso.
- Uso: lecciones, errores, decisiones, aprendizajes, mini historias.

### Sergio consultor ONIA

- Carril: `onia`.
- Energia: estratega practico, auditor, solucionador.
- Outfit: `black_consultant` o `black_premium_meeting`.
- Escenas: llamada con cliente, tablero de diagnostico, WhatsApp/CRM, automatizacion.
- Uso: auditorias, instalacion, consultoria, diagnostico, ventas B2B.

### Sergio demo tecnica

- Carril: `sergio` u `onia`, segun el mensaje.
- Energia: operador tecnico que muestra como se construye.
- Outfit: `black_technical_demo`.
- Escenas: pantalla, n8n, Notion, Chatwoot, Meta, Higgsfield, prompts.
- Uso: tutoriales, antes/despues, pruebas, errores solucionados.

### Sergio founder story

- Carril: `sergio`.
- Energia: fundador sincero, proceso real, aprendizaje.
- Outfit: `black_operator_basic`.
- Escenas: noche de trabajo, cafe, escritorio, notas, dashboard.
- Uso: autoridad humana, storytelling, confianza.

### ONIA narrator/system explainer

- Carril: `onia`.
- Energia: claro, comercial, consultivo.
- Outfit: no depende de Sergio; puede ser voz/narrador o avatar generico aprobado.
- Escenas: diagramas, flujos, pantallas, CRM, WhatsApp, n8n, dashboards.
- Uso: explicar servicios ONIA sin centrar todo en Sergio.

### Client UGC operator

- Carril: `cliente`.
- Energia: usuario realista, vendedor natural, no testimonio falso.
- Outfit: adaptado al negocio del cliente.
- Escenas: tienda, producto, escritorio, recepcion, local, cocina, oficina.
- Uso: venta, demostracion, objeciones, prueba de producto, oferta.

## Biblioteca de escenas

### Sergio

| ID | Escena | Uso |
| --- | --- | --- |
| `sergio_desk_direct` | Sergio habla a camara desde escritorio real, laptop visible, luz natural o LED suave | Hooks, opinion, aprendizaje |
| `sergio_screen_overlay` | Pantalla de trabajo con cara en esquina o corte rapido a Sergio | Demos y tutoriales |
| `sergio_walk_phone` | Video vertical caminando con telefono, ambiente urbano o pasillo | Reflexiones y hooks espontaneos |
| `sergio_build_timelapse` | Cortes rapidos creando workflow, escribiendo prompt, revisando Notion | Proceso y autoridad |
| `sergio_decision_board` | Pizarra, Notion o tablero con decisiones y prioridades | Estrategia, negocio, auditoria |
| `sergio_whatsapp_lead` | Telefono con WhatsApp/CRM simulado, sin datos reales visibles | Ventas y automatizacion |

### ONIA

| ID | Escena | Uso |
| --- | --- | --- |
| `onia_audit_table` | Mesa de diagnostico con laptop, notas y mapa simple de proceso | Consultoria y auditoria |
| `onia_whatsapp_to_crm` | Flujo visual WhatsApp -> Chatwoot -> CRM -> seguimiento | Ventas con IA y humano |
| `onia_n8n_workflow` | Workflow n8n limpio con nodos visibles, sin secretos | Automatizaciones |
| `onia_before_after` | Comparacion caos manual vs sistema automatizado | Oferta y educacion |
| `onia_client_call_prep` | Preparacion de llamada, checklist, pipeline y notas | Profesionalismo |
| `onia_dashboard_ops` | Dashboard de leads, seguimientos, tareas y conversion | Operaciones y escala |

### Clientes

| ID | Escena | Uso |
| --- | --- | --- |
| `client_product_counter` | Producto sobre mesa o mostrador, manos demostrando uso | E-commerce y producto fisico |
| `client_local_reception` | Recepcion o local con cliente entrando, ambiente realista | Servicios locales |
| `client_operator_explains` | Persona del negocio explica una objecion o beneficio | Confianza y venta |
| `client_customer_pov` | POV del problema del cliente antes de comprar | Hooks de dolor |
| `client_ecommerce_demo` | Empaque, pagina, checkout o entrega simulada | Tienda online |
| `client_service_result` | Proceso del servicio, no resultado exagerado | Servicios profesionales |

## Hooks reutilizables

### Problema directo

- `Si tus clientes te escriben y nadie responde rapido, estas perdiendo ventas antes de empezar.`
- `El problema no es que falten leads; es que nadie los ordena, califica y persigue.`
- `Si cada venta depende de acordarte manualmente, tu negocio tiene una fuga.`

### Error comun

- `El error es poner un bot a vender cuando todavia no tienes claro el proceso humano.`
- `La mayoria automatiza el caos y despues culpa a la IA.`
- `No necesitas otro sistema; necesitas que el sistema actual deje de estar roto.`

### Contrario

- `Yo no empezaria con un chatbot. Empezaria con el flujo de ventas.`
- `La IA no deberia cerrar todas tus ventas. Deberia preparar mejores oportunidades para tu equipo.`
- `Un solo numero de WhatsApp puede vender mas si esta bien operado.`

### Backstage

- `Te muestro como convertimos una idea en un workflow que realmente se puede usar.`
- `Esto es lo que reviso antes de recomendar una automatizacion a un negocio.`
- `Asi preparo un video UGC antes de tocar Higgsfield.`

### Prueba de mecanismo

- `Mira este flujo: entra el lead, se califica, se asigna y queda seguimiento.`
- `Esto no es magia; son tres partes bien conectadas.`
- `El secreto no es el prompt. Es el sistema que decide que prompt usar.`

### Cliente/producto

- `Si vendes esto y la gente pregunta siempre lo mismo, este video te ayuda a cerrar mas rapido.`
- `Antes de comprar, tu cliente necesita entender una sola cosa: por que esto le resuelve el problema.`
- `Un buen video no grita oferta; elimina dudas.`

## Estructura base de 30 segundos

| Tiempo | Funcion | Contenido |
| --- | --- | --- |
| 0-2s | Hook | Problema, error o promesa concreta |
| 2-6s | Contexto | Para quien aplica y por que importa |
| 6-14s | Mecanismo | Explicar el proceso, sistema o producto |
| 14-23s | Escena variable | Demo, comparacion, prueba, pantalla o UGC |
| 23-28s | Payoff | Resultado esperado sin prometer cifras falsas |
| 28-30s | CTA | Escribir, agendar, pedir auditoria, guardar o comentar |

## Prompt base Sergio con ropa negra

```text
Vertical realistic phone-camera video, Sergio as a founder/operator and practical consultant, wearing a clean all-black outfit: black t-shirt, black pants, dark shoes, no visible logos, natural confident posture, direct eye contact, authentic working environment, subtle handheld movement, realistic lighting, modern Latin American business context, serious but approachable tone.
```

## Sergio Avatar System 2026-06-04

Estado: brief/router implementado localmente en `video-lab`; el render real se
hace por Higgsfield CLI/MCP y requiere QA de identidad antes de publicar.

Avatar operativo actual creado en Higgsfield con el paquete de fotos del
2026-06-04:

```text
Soul ID: 1238064e-1295-4cbf-9a41-861d4106e0e8
Nombre: Sergio ONIA 20260604 All Black
Tipo: soul_2
Estado: completed
```

Soul ID legado:

```text
05cebe09-5672-4d50-90b2-d92c680957f7
```

El Soul ID actual es la identidad base de Sergio para generaciones internas,
pero la ruta mas fiel observada fue editar una foto real aprobada con
`nano_banana_2` para cambiar solo outfit/escena y despues animar con
Seedance/Veo. No usar `soul_cast` por CLI para fijar identidad hasta que
Higgsfield documente o corrija el payload de `prompt` objeto. No implica permiso
de publicacion automatica.

Ruta validada para outfit negro 2026-06-04:

```text
IMG_0331_preview.jpg -> nano_banana_2 outfit edit -> identity QA
-> seedance_2_0 minimal motion -> video QA -> review by Sergio
```

Comando:

```bash
video-lab telegram --message "Crea avatar Sergio: <objetivo> | <variante>"
```

Ejemplo:

```bash
video-lab telegram --message "Crea avatar Sergio: Tengo 16 anos y estoy construyendo ONIA como sistema real | black_operator_basic"
```

Variantes soportadas:

| Variante | Uso | Look |
| --- | --- | --- |
| `black_operator_basic` | videos diarios, founder story, hooks directos | camiseta negra, pantalon oscuro, sin logos |
| `black_consultant` | auditorias ONIA, ventas B2B, consultoria | camiseta negra con overshirt o chaqueta ligera negra |
| `black_technical_demo` | n8n, Notion, prompts, demos tecnicas | hoodie negro o chaqueta negra con cierre |
| `black_premium_meeting` | propuestas premium, autoridad, reuniones | blazer negro sobre camiseta negra |

Formula de prompt que debe usar Hermes:

```text
Identity reference pack -> stable Sergio avatar -> all-black outfit -> scene and camera -> micro-movement -> Spanish script/lip-sync -> subtitles -> safe claims -> negative prompt
```

Prompt maestro para avatar:

```text
Create a realistic vertical 9:16 talking-avatar / UGC creator video of Sergio for ONIA. Use Sergio's approved private reference pack to preserve identity consistently across shots: same face structure, short dark hair, natural expression, direct eye contact, slim young founder/operator presence. Outfit: all-black, clean, simple, no visible logos. The video must feel like a real phone-camera creator clip, not a glossy stock ad. Use natural Spanish delivery, small pauses, subtle hand movement, believable breathing, readable captions, and visual change every 2-3 seconds. Structure: hook, context, mechanism, proof of process, CTA. Use fictional/safe screens only.
```

Escenas listas para avatar:

| ID | Uso | Prompt |
| --- | --- | --- |
| `avatar_desk_confession` | founder story | Sergio seated at a real desk, laptop open, direct eye contact, one decisive sentence, warm practical tone |
| `avatar_audit_table` | consultoria ONIA | Sergio reviewing a simple sales audit board, sticky notes, WhatsApp-to-CRM flow with fictional data only |
| `avatar_screen_operator` | demo tecnica | Sergio beside a screen overlay showing a clean automation workflow, pointing at one key step |
| `avatar_phone_walk` | reflexion rapida | Sergio walking slowly with phone-camera selfie, black outfit, natural hallway or urban background |
| `avatar_client_call_prep` | confianza B2B | Sergio preparing for a client call, laptop, notes, CRM checklist, calm confident body language |
| `avatar_lipsync_closeup` | clips cortos | tight talking-avatar close-up, consistent face, natural lip-sync, subtle head movement, readable captions |

Negative prompt especifico para avatar:

```text
No celebrity likeness, no copied creator identity, no changing Sergio's identity, no older-age transformation, no sexualized styling, no logos unless provided, no private screens, no real phone numbers, no fake client results, no fake revenue claims, no exaggerated guru gestures, no distorted face, no extra fingers, no broken lip-sync, no voice clone or publication unless explicitly approved.
```

Regla operativa:

- Crear avatar brief es seguro.
- Renderizar con cara real requiere aprobar el job.
- Clonar/recrear voz sigue bloqueado hasta aprobacion explicita de voz.
- Publicar requiere `Publicar video <job_id>`.
- Si el video menciona que Sergio tiene 16 anos, mantener encuadre fundador/proceso/educativo; nada de adulto aspiracional, sexualizado o claims exagerados.

## Prompt base ONIA

```text
Vertical business content video for ONIA, practical AI automation and sales operations consultancy, clean real workspace, WhatsApp leads, CRM board, n8n workflow and Notion dashboard shown only with fictional/safe data, consultant-led explanation, modern but realistic production, clear business problem, human sales handoff, no exaggerated claims.
```

## Sergio AI Influencer Identity OS 2026-06-06

Estado: canonico interno para producir fotos, videos y referencias de Sergio
como avatar/influencer IA. Este bloque extiende el `Sergio Avatar System
2026-06-04` y lo vuelve mas estricto: identidad primero, cuerpo completo
despues, video al final.

Config JSON:

```text
hermes-content/references/sergio-ai-influencer-identity-system-20260606.json
```

### Regla principal

La identidad real de Sergio manda sobre cualquier output generado. Las imagenes
generadas pueden servir como estilo, vestuario, encuadre o start frame, pero no
como fuente primaria de identidad si contradicen las fotos/videos reales.

Fuente de identidad:

- fotos/videos reales del paquete `final-avatar-identity-lock/20260605-upload-0405-0409`;
- anclas reales del shooting quirurgico `20260606-avatar-surgical-identity-shoot/source-anchors`;
- `SERGIO_SURGICAL_FACE_LOCK.md`;
- `SERGIO_FACE_VOICE_ASSET_GUIDE.md`;
- manifest de medios aprobados.

Mejores assets generados para estilo/start frame, no para reemplazar identidad:

```text
hermes-content/references/sergio-approved-media/higgsfield-runs/20260606-avatar-natural-multiref-attempt-02/outputs/01_natural_multiref_identity_attempt.png
hermes-content/references/sergio-approved-media/higgsfield-runs/20260606-avatar-natural-video-test-01/outputs/sergio-natural-avatar-kling3-motion-4k.mp4
```

### Face lock quirurgico

Preservar siempre:

- edad aparente joven, no adulto mayor ni ejecutivo generico;
- cara alargada y natural, no cara cuadrada de modelo;
- ojos oscuros almendrados, con asimetria humana natural, no ojos enormes ni
  demasiado separados;
- cejas oscuras, gruesas, naturales y alineadas con la mirada real;
- nariz recta y natural, sin afinar ni cambiar puente, punta o fosas;
- labios medianos/llenos, labio inferior ligeramente mas lleno, sin boca
  plastica;
- dientes limpios, alineados y naturales, sin diente chueco, sin carillas
  falsas gigantes;
- mandibula definida pero joven, no exagerada ni caricaturesca;
- menton y cuello proporcionales, sin cuello alargado;
- piel morena clara/calida con textura real, poros naturales y limpieza sutil;
- cabello negro con side part italiano, brillo sano, volumen frontal peinado
  hacia atras/lateral, sin flequillo caido.

Se puede limpiar:

- granos, marcas pequenas de acne, brillo duro, rasgunos del cuello, manchas de
  luz, ojeras fuertes y arrugas creadas por mala iluminacion.

No cambiar:

- distancia de ojos, tamano de ojos, nariz, labios, dientes, mandibula, edad,
  forma de craneo, orejas, linea de pelo, tono de piel, sonrisa base ni energia.

### Body lock cuerpo completo

Sergio debe verse joven, natural y mas robusto que las versiones flacas, pero
sin transformarlo en fisicoculturista ni modelo generico.

Descripcion base:

```text
young Latin founder/operator, warm light-brown skin, lean athletic but fuller
build, naturally broader shoulders than the thin avatar attempts, proportional
torso, slim waist, straight relaxed posture, natural neck length, realistic
hands and fingers, clean nails, no tattoos unless provided, no jewelry unless
approved, no exaggerated muscles, no luxury-flex styling.
```

Proporciones:

- hombros: ligeramente anchos y naturales;
- pecho/torso: atletico ligero, no hundido, no voluminoso;
- cintura: normal/fit, no extremadamente delgada;
- brazos: proporcionados, no palillos, no enormes;
- manos: naturales, no protagonistas salvo en demos;
- postura: segura, relajada, inteligente, no pose de modelo de moda.

### Vestuario canonico

Usar ropa negra como uniforme de marca. Variar textura y capas, no identidad.

| ID | Uso | Prompt |
| --- | --- | --- |
| `black_operator_basic` | contenido diario, hooks, backstage | `clean black fitted t-shirt, dark straight pants or dark jeans, dark minimalist sneakers, no visible logos` |
| `black_consultant` | auditorias, ONIA, B2B | `black t-shirt under a clean black overshirt or unstructured black blazer, tailored dark pants, professional but approachable` |
| `black_technical_demo` | n8n, pantallas, sistemas | `black technical zip jacket or black hoodie, dark pants, practical operator look, no logos` |
| `black_premium_meeting` | piezas premium, propuestas | `structured black blazer over black crew neck or black mock neck, tailored black trousers, clean black loafers or minimalist sneakers` |
| `black_lifestyle_casual` | TikTok/Reels mas organicos | `black t-shirt, black open overshirt, dark jeans, natural creator style, no luxury flex` |
| `black_urban_walk` | caminata, POV, reflexion | `black bomber or light black jacket, black t-shirt, dark jeans, clean dark sneakers` |

Evitar: logos, marcas visibles, colores chillones, ropa brillante, joyeria que
robe atencion, gafas oscuras, traje demasiado formal, estetica de lujo falso.

### Higgsfield decision map

Ruta default para identidad:

```text
real identity references -> Nano Banana Pro still -> Nano Banana Shots
multi-angle sheet -> manual identity QA -> Kling 3.0 / Seedance / Veo motion
test -> captions/edit -> review -> publish only with approval.
```

Herramientas por tarea:

- `nano_banana_2`: fotos base, cuerpo completo, outfits, fondos, 4K;
- `nano_banana_2_shots`: shooting multiangulo de identidad/cuerpo;
- `nano_banana_2_ai_stylist`: pruebas de outfit cuando haya preset usable;
- `nano_banana_2_skin_enhancer`: limpieza sutil de piel, nunca cambio facial;
- `kling3_0`: video realista/cinematico, 5s, modo `4k`, `sound off` para
  pruebas de identidad;
- `seedance_2_0`: motion social rapido 9:16, 5s, 1080p cuando no haga falta
  cine pesado;
- `veo3_1`: escenas mas realistas o con camara/storytelling, 4-8s;
- `marketing_studio_video`: UGC/ad formats, solo si permite mantener identidad
  propia; no usar avatares preset como Sergio;
- `brain_activity`: virality predictor para revisar hook/retencion de videos ya
  exportados;
- `reframe`: adaptar a 9:16/1:1/16:9 sin re-generar cara;
- `topaz_video`: mejora final si el video aprobado tiene buena identidad;
- `soul_cast`: no usar como fuente de identidad de Sergio por el fallo local
  documentado; puede inventar persona.

Cuenta Higgsfield local validada el 2026-06-06: plan Ultra activo y creditos
disponibles. No depender de precio; priorizar mejor calidad.

Fuentes investigadas para este mapa:

- Higgsfield MCP oficial: `https://higgsfield.ai/mcp`;
- Higgsfield AI Image: `https://higgsfield.ai/ai-image`;
- Higgsfield AI Influencer: `https://higgsfield.ai/ai-influencer`;
- Higgsfield CLI oficial: `https://github.com/higgsfield-ai/cli`;
- CLI local validada con `higgsfield model list`, `higgsfield model get`,
  `higgsfield account status`, `higgsfield soul-id list` y
  `higgsfield marketing-studio ad-formats list`.

### TikTok reference recreation workflow

Usar TikTok Creative Center y Top Ads como radar, no para copiar personas.

Fuentes investigadas:

- TikTok Creative Center: `https://ads.tiktok.com/business/creativecenter/pc/en`;
- TikTok Top Ads: `https://ads.tiktok.com/business/creativecenter/inspiration/topads/pc/en`;
- TikTok Creative Center help: `https://ads.us.tiktok.com/help/article/creative-center?redirected=2`.

Proceso:

1. Buscar 10 referencias por tema en Creative Center/Top Ads: IA, founder,
   software, automatizacion, UGC business, productividad.
2. Extraer solo estructura: hook visual, primera frase, ritmo de cortes,
   escena, subtitulos, CTA, mecanismo de retencion.
3. Clasificar en uno de estos formatos:
   `pov_walk_hook`, `desk_confession`, `screen_proof`, `before_after_system`,
   `comment_reply`, `outfit_scene_transition`, `whiteboard_operator`,
   `phone_scenario`.
4. Reescribir con voz Sergio/ONIA, datos seguros y escenas propias.
5. Generar primero still/cuerpo completo si la escena cambia outfit o angulo.
6. Animar solo el still que pasa QA de identidad.
7. Pasar por `brain_activity` si ya hay MP4 y el objetivo es retencion/ads.

No copiar:

- cara, voz, gestos reconocibles, musica, texto exacto, marca, logo,
  thumbnails, claims, ritmo frame-by-frame ni chistes propios de otro creador.

### Prompts listos

#### Identity block

```text
Use the real Sergio identity reference pack as the source of truth. Preserve
the exact same person: same young face, almond dark eyes with natural human
asymmetry, same eye spacing, thick dark eyebrows, straight natural nose, same
medium-full lips, same natural smile shape, clean aligned natural teeth, same
defined but youthful jaw and chin, same ears, same warm light-brown skin tone,
same black glossy Italian side-part hair with volume and no falling fringe,
same age appearance and confident intelligent presence. Do not create a similar
person. Do not beautify into a generic male model.
```

#### Full-body photoshoot

```text
Create one ultra-realistic vertical 9:16 full-body editorial photo of Sergio
for a premium AI influencer identity bank. Use the uploaded real images/videos
as the identity source of truth. Preserve the exact face and hair identity.
Body: young Latin founder/operator, lean athletic but fuller and more robust
than previous thin avatar attempts, natural broader shoulders, proportional
torso, slim but not skinny waist, relaxed confident posture, natural hands and
fingers. Outfit: <outfit_prompt>. Scene: <scene_prompt>. Camera: realistic
phone/camera hybrid, 35mm equivalent, eye-level or slightly below eye-level,
clean cinematic light, premium but natural, sharp face, realistic skin texture,
no logos, no text, no watermark.
```

#### Multi-angle identity sheet

```text
Create a consistent Sergio AI influencer identity sheet in one 4K image with
six clean panels: front neutral, front slight smile, 3/4 left, 3/4 right, left
profile, full-body standing. Same exact person in every panel, same face, same
hair, same skin tone, same age, same body proportions, same black outfit. Use
simple neutral studio/workspace lighting. This is an internal identity lock
sheet, not a fashion ad. Prioritize identity consistency over creativity.
```

#### Kling 3.0 motion test

```text
Animate this approved Sergio full-body or portrait still for a 5-second
internal identity test. Keep identity perfectly locked: same eyes, eyebrows,
nose, lips, teeth, jaw, chin, ears, hairline, Italian side-part hair, skin tone,
body build and outfit. Motion: natural breathing, tiny head movement, one blink,
subtle posture shift, minimal hand movement only if hands are already visible.
Camera almost still, no zoom, no face morph, no speaking mouth unless a
separate lipsync test is approved. No audio, no subtitles, no text.
```

#### TikTok adaptation prompt

```text
Recreate the structure of this TikTok reference for Sergio/ONIA without copying
the creator, voice, exact script, music, brand, edit, or identity. Extract only:
hook type, first visual, cut rhythm, scene logic, caption placement, retention
mechanism, CTA style. Then write an original Sergio version about <topic> with
the same pacing but new wording, safe claims, fictional/private-safe screens,
black outfit, vertical 9:16, premium realistic AI avatar style.
```

#### Negative prompt global

```text
No identity drift, no different person, no older face, no generic male model,
no wide-set eyes, no one eye larger, no changed nose, no changed lips, no fake
veneers, no crooked teeth, no stretched neck, no exaggerated jaw, no skinny
body, no bodybuilder body, no falling fringe, no helmet hair, no beard unless
visible in real reference, no neck scratches, no plastic skin, no cartoon, no
anime, no logos, no private data, no fake testimonials, no guaranteed results,
no copied creator likeness, no copyrighted music.
```

### Default production settings

- Plataforma: TikTok/Reels/Shorts.
- Formato: vertical 9:16.
- Still quality: 4K cuando sea identidad o cuerpo completo.
- Motion test: 5s primero.
- Video final organico: 12-25s.
- Video anuncio: 15-30s.
- Audio: subtitulos o voz generica primero; voz Sergio/lipsync solo con
  aprobacion explicita por pieza.
- Publicacion: bloqueada hasta aprobacion explicita.

### Checklist de QA

Antes de animar:

- el still se reconoce como Sergio sin explicar;
- ojos, nariz, labios, dientes y mandibula coinciden;
- no parece mas viejo, mas flaco o mas falso;
- pelo side part italiano vivo y peinado;
- cuerpo robusto natural, no extremo;
- ropa negra limpia y sin logos;
- manos no deformes si aparecen;
- no hay datos privados ni marcas no autorizadas.

Antes de publicar:

- Sergio aprueba identidad;
- claims seguros y verificables;
- caption y CTA revisados;
- musica/voz con derechos o generica;
- video final sin drift, flicker fuerte, mouth warp ni textos raros.

## Prompt base cliente UGC

```text
Vertical UGC-style sales video for a real client product or service, natural creator energy, realistic location related to the business, clear problem in the first 2 seconds, simple demonstration, believable benefit, conversational tone, no fake testimonial, no guaranteed result, no unapproved brand logos.
```

## Negative prompt seguro

```text
No fake celebrity, no copying a real creator identity, no unapproved logos, no confidential screens, no visible private phone numbers, no fake income claims, no guaranteed results, no medical/legal/financial promises, no exaggerated testimonial, no deepfake publication, no voice clone unless approved.
```

## Recetas por tipo de video

### Sergio opinion rapida

- Carril: `sergio`.
- Persona: `sergio_casual_directo`.
- Outfit: `black_operator_basic`.
- Escena: `sergio_desk_direct` o `sergio_walk_phone`.
- Hook: error comun o contrario.
- CTA: comentar, guardar, pedir que revise un caso.

### ONIA auditoria

- Carril: `onia`.
- Persona: `sergio_consultor_onia`.
- Outfit: `black_consultant`.
- Escena: `onia_audit_table` + `onia_before_after`.
- Hook: problema directo.
- CTA: pedir auditoria o diagnostico.

### ONIA demo tecnica

- Carril: `onia`.
- Persona: `sergio_demo_tecnica`.
- Outfit: `black_technical_demo`.
- Escena: `onia_n8n_workflow` + `onia_whatsapp_to_crm`.
- Hook: prueba de mecanismo.
- CTA: agendar revision del proceso.

### Cliente producto UGC

- Carril: `cliente`.
- Persona: `client_ugc_operator`.
- Outfit: adaptado al cliente.
- Escena: `client_product_counter` + `client_customer_pov`.
- Hook: cliente/producto.
- CTA: comprar, escribir o pedir info.

### Cliente servicio local

- Carril: `cliente`.
- Persona: `client_ugc_operator`.
- Outfit: ropa real del negocio.
- Escena: `client_local_reception` + `client_operator_explains`.
- Hook: dolor del cliente.
- CTA: reservar, escribir o solicitar cotizacion.

## Checklist antes de producir

1. Confirmar carril: Sergio, ONIA o cliente.
2. Confirmar si se usara cara real, avatar generico o solo B-roll.
3. Confirmar si se usara voz real, TTS generico o subtitulos.
4. Elegir outfit, persona, escena y hook.
5. Revisar que no haya datos reales sensibles en pantallas.
6. Crear brief con `video-brief-template.json`.
7. Generar solo borrador interno.
8. Solicitar aprobacion antes de publicar o usar cara/voz real.
