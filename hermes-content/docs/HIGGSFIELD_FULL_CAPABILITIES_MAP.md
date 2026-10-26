# Higgsfield Full Capabilities Map

## Objetivo
Definir que funciones de Higgsfield debe usar Onia primero para crear contenido propio, contenido de Sergio y piezas comerciales para clientes.

Este documento es operativo: sirve para decidir modelo, flujo, comandos, limites de seguridad y plan de arranque.

> ## Estado vigente — 2026-09-22
>
> La decision actual no es "una herramienta para todo":
>
> | Superficie | Rol ONIA | Estado |
> |---|---|---|
> | CLI oficial + skills | Cotizar y ejecutar desde Codex, Claude Code y VPS | **Principal** |
> | Navegador local | Crear/ajustar Elements, Marketing Studio y hacer QA visual | **Complementario manual** |
> | MCP oficial | Explorar y operar desde agentes de chat cuando este conectado | **Opcional; no backbone** |
> | API | Workers y volumen con presupuesto separado | **Futuro** |
> | Playwright en VPS | Automatizar clicks de la web | **No usar para produccion** |
>
> El endpoint MCP oficial sigue siendo `https://mcp.higgsfield.ai/mcp`, pero Higgsfield recomienda
> CLI + skills para Claude Code y Codex por su menor overhead de contexto. En ONIA, **toda**
> generacion paga debe pasar por schema vivo, cotizacion viva y aprobacion registrada. Nunca usar
> precios, defaults o nombres de modelo recordados de este archivo.
>
> El bloque "Estado actual" siguiente queda conservado como **snapshot historico del 2026-08-06**.
> Saldo, plan, catalogo, Souls y conexiones pueden haber cambiado y no son evidencia vigente.

## Estado historico — snapshot 2026-08-06

**Verificado el 2026-08-06 por MCP nativo** (reemplazaba la validacion por CLI del 2026-06-01):

- Cuenta: `oninteligenciaartificial@gmail.com` · Plan: `ultra` · Creditos: **2.993,73**
- **Ruta de esa sesion: MCP** (`https://mcp.higgsfield.ai/mcp`). Ya no define la arquitectura
  vigente; ver la matriz superior.
- Souls `ready`: `LUCIA-REAL-v2-clean` (`36305a9b-…`), `Mara BO v2` (`6c94bbf0-…`),
  `Sergio Onia` + 3 variantes historicas de Sergio.
- Costo medido: **imagen Soul 2k = 0,12 cr**. Video segun modelo (cotizar con `get_cost:true`).
- Sin allowance `unlim` activo (plan Ultra paga con creditos; `unlim.available: false`).
- TikTok conectado: 0 cuentas (existe `tiktok_connect` para publicar directo desde Higgsfield).

Lo que cambio respecto de junio y hay que saber:

1. El MCP expone **mucho mas que la CLI**: workflows empaquetados, generacion en lote,
   publicacion a TikTok, sitios web, juegos, 3D, clipper y predictor de viralidad.
2. El catalogo de modelos se movio fuerte (Seedance 2.0, Kling 3.0, Veo 3.1, FLUX 3, Nano
   Banana Pro/2, GPT Image 2, MiniMax H3, Wan 2.7). Verificar con `models_explore` antes de
   citar parametros: **este doc envejece rapido**.

Fuentes: MCP `balance`, `show_characters`, `models_explore`, `get_workflow_instructions`
(2026-08-06) · https://higgsfield.ai/cli · marketing-studio / canvas / supercomputer / apps.

## Inventario de funciones

### CLI y MCP
La CLI oficial es la ruta principal para agentes de codigo. El MCP es una interfaz valida para
agentes conversacionales, pero no debe asumirse conectado ni usarse como motor automatico.

Comandos principales:

```powershell
higgsfield auth login
higgsfield account status --json
higgsfield model list --video --json
higgsfield model list --image --json
higgsfield model get <job_set_type> --json
higgsfield generate cost <job_set_type> --prompt "<prompt>"
higgsfield generate create <job_set_type> --prompt "<prompt>" --wait
higgsfield upload create <file>
higgsfield soul-id create --name <name> --image <id1> --image <id2> --image <id3> --image <id4> --image <id5>
```

Capacidades:

- `auth`: login OAuth/device flow.
- `account`: creditos, plan y transacciones.
- `workspace`: seleccionar workspace de facturacion.
- `model`: listar modelos y ver parametros.
- `generate`: estimar costo, crear, esperar, obtener y listar jobs.
- `upload`: subir imagenes, videos o audio para usarlos como input.
- `soul-id`: entrenar identidad consistente. El CLI actual acepta **5-20** imagenes; la guia web
  recomienda **20-80**. Resolver el carril antes de preparar el dataset.
- `marketing-studio`: gestionar avatars, hooks, products, brand kits y formatos.
- `product-photoshoot`: generar fotos de producto con prompt mejorado.
- `marketplace-cards`: generar imagenes tipo marketplace y modulos de producto.

### MCP — snapshot de capacidades observado el 2026-08-06

Endpoint: `https://mcp.higgsfield.ai/mcp`. Su disponibilidad debe verificarse por sesion. No es la
ruta productiva por defecto de ONIA.

**Herramientas nucleo**

| Grupo | Herramientas | Para que |
|---|---|---|
| Generar | `generate_image` / `generate_video` / `generate_audio` + sus `_batch` (1-12 jobs en paralelo) | produccion; el `_batch` + `jobs_wait` + `show_generation_by_ids` es el patron de volumen |
| Costos | `get_cost` / param `get_cost:true` · `balance` · `transactions` | cotizar ANTES de generar (regla de gasto) |
| Identidad | `show_characters` (list/train/status) · `show_reference_elements` | Souls (1 persona, ~10 min de entreno) vs Elements (varios sujetos/objetos, instantaneo) |
| Catalogo | `models_explore` (list/search/get/recommend) · `presets_show` | parametros y aspect ratios reales, no de memoria |
| Edicion | `upscale_image` / `upscale_video` (2K/4K) · `outpaint_image` · `reframe` · `remove_background` · `motion_control` | retocar en vez de re-generar (mas barato) |
| Marketing | `show_marketing_studio` (avatars, hooks, settings, products, brand kits, ad references) | anuncios de cliente con marca cargada |
| Analisis | `virality_predictor` · `video_analysis_*` | revisar hook/retencion antes de publicar |
| Volumen | `personal_clipper_*` (YouTube largo → clips) · `shorts_studio_*` (+ presets) | reciclar video largo a verticales |
| Publicacion | `tiktok_connect` / `tiktok_prepare_publish` / `tiktok_publish` / `tiktok_music_trending` | **publica a TikTok sin token de Meta** — no depende de S6 |
| Otros | `generate_3d` (GLB) · `create_website`/`deploy_website` · `deploy_game` · `dubbing` · `voice_change` · `create_voice` | capacidades laterales; no reemplazan web-factory |

**Workflows empaquetados** (`get_workflow_instructions`, cargan un SKILL.md completo que
orquesta los `generate_*`). Son la parte mas vendible y hay que cargarlos ANTES de producir:

| Workflow | Que produce | Uso comercial Onia |
|---|---|---|
| `ugc-flow` | talking-head de creador reseñando un producto | **el default de un ad UGC** |
| `ugc-product-flow` | solo producto, voz en off, sin persona | marcas que no quieren cara |
| `ugc-saas-flow` | UGC con capturas REALES del sitio del cliente | **anuncio de web/tienda — el que vende web-factory** |
| `ugc-unboxing-flow` · `ugc-try-on-flow` · `ugc-tutorial-flow` | unboxing / prueba de ropa / paso a paso | e-commerce, moda, servicios |
| `brandkit` | logos, identidad, mockups, packaging, social graphics | add-on de marca |
| `character-sheet` | hoja de personaje consistente | crear modelos IA nuevas |
| `faceless-channel-video` | video narrado sin cara, 30s a 10+ min | canales K y L (YT faceless) |
| `youtube-thumbnail-generator` | miniaturas 4K nivel MrBeast | miniaturas propias y de cliente |

Regla: **cargar el workflow con `get_workflow_instructions` antes de llamar a `generate_*`.**
Improvisar el prompt en vez de cargar el workflow es la causa #1 de piezas mediocres.

### Marketing Studio
Uso principal para Onia: vender anuncios UGC y videos comerciales a negocios.

Funciones:

- URL to Ad: convertir URL/producto en anuncio.
- UGC: talking head, reviews, tutorials.
- Unboxing: producto en uso y primera impresion.
- Product showcase: mostrar beneficios y contexto.
- Product review: review-style seguro, sin fingir testimonio real.
- TV spot: pieza mas comercial/cinematica.
- Wild Card: dejar direccion creativa a IA para exploracion.
- Virtual try-on: moda, belleza, ecommerce.
- Avatars: presentadores predefinidos o personalizados.
- Hooks: presets de interrupcion/retencion.
- Products: perfiles de producto editables.
- Brand kits: colores, tono y assets de marca.
- Settings y ad references: direcciones visuales reutilizables.

Modos CLI del modelo `marketing_studio_video`:

```text
ugc
ugc_how_to
ugc_unboxing
product_showcase
product_review
tv_spot
wild_card
ugc_virtual_try_on
virtual_try_on
```

Parametros utiles:

- `aspect_ratio`: usar `9:16` para Reels, Shorts y TikTok.
- `duration`: usar 15s para anuncios rapidos.
- `resolution`: empezar en `720p`; subir a `1080p` para entregas finales.
- `generate_audio`: usar `false` por defecto; preferir ElevenLabs o audio editado.
- `avatars`, `hook_id`, `product_ids`, `web_product_ids`: usar cuando el setup del cliente este listo.

Presets CLI validados:

- Avatares preset disponibles por CLI: Jayden, Stefan, Mei, Yuna, Adriana,
  Clara, Maria, Sofia, Valentina, Jia, Lily, Tae, Felix, Malik, Liam, Joon,
  Erik, Nia, Hana y Ryu.
- Hooks preset utiles: Product Hit, Interview, Random Object Mic, Product
  Dodge, Camera Bump, Product Crash, Spicy.
- Settings preset utiles para UGC realista: Kitchen, Office, Gym, Street, In
  Car, Bedroom, Bathroom, Nature.

Regla Onia:

- Usar presets realistas primero.
- Evitar presets de riesgo o fantasia para clientes serios: Airplane Wing,
  Volcano Rim, Car Roof, Train Surf, Roofing, Tiny Reviewer.
- Usar hooks stunt solo para awareness o pruebas internas; para clientes usar
  hooks sutiles y demo clara.

### Canvas
Uso principal: campanas con variaciones y flujos visuales de varios pasos.

Canvas es un workspace de nodos para conectar:

- prompts;
- imagenes;
- videos;
- referencias;
- variaciones;
- estilos;
- generaciones con distintos modelos.

Usarlo cuando:

- una campana requiere varias versiones;
- hay que probar estilos;
- una imagen alimenta un video;
- se necesita storyboard;
- el cliente tiene producto y varios anuncios.

No usarlo para:

- una pieza simple que se puede hacer con Marketing Studio Video;
- pruebas rapidas de bajo costo;
- trabajos urgentes donde CLI basta.

### Supercomputer
Uso principal: ideacion, clips largos, tareas creativas extensas y produccion a escala dentro de Higgsfield.

Funciones observadas:

- New task.
- Skills.
- Connectors.
- Files.
- Memory.
- Tasks.
- Personal Clipper.
- Build with skills.
- Create UGC.
- Run marketing.
- Shoot cinema.
- Animate cartoon.

Casos utiles:

- convertir entrevistas largas en clips verticales;
- pedir muchas variantes de anuncios;
- generar ideas de campana;
- crear briefs largos dentro de Higgsfield;
- usar modelos como GPT, Claude y Gemini dentro de Higgsfield consumiendo creditos.

Regla Onia:

- Usar Supercomputer para investigacion creativa o clipper.
- No reemplazar Hermes como cerebro operativo.
- No publicar desde Supercomputer.
- Usar Supercomputer cuando haya 10+ variantes, clipping de videos largos,
  investigacion creativa recurrente, campanas completas, skills creativas
  reutilizables o necesidad de memoria entre assets.
- No usar Supercomputer para videos simples que la CLI resuelve, manejo de
  secretos, aprobaciones, publicacion, finanzas o decisiones comerciales.
- Todo output de Supercomputer debe volver a Hermes Video Lab como brief,
  asset, referencia o URL revisable antes de generar, entregar o publicar.

### Regla Supercomputer Onia

Supercomputer es el estudio creativo pesado. Hermes sigue siendo el operador.

Usar:

| Caso | Uso Supercomputer | Vuelve a Hermes como |
|---|---|---|
| Muchas variantes | 10-100 hooks, angulos o anuncios por producto | brief batch o referencia |
| Video largo | Personal Clipper para sacar clips verticales | lista de clips + URLs |
| Competencia | scan semanal de creadores/anuncios | notas de patrones |
| Campana completa | idea, guion, storyboard, assets, variantes | plan de campana |
| Skill creativa | flujo `/ugc-ecommerce-onia`, `/clip-sergio` | skill documentada |

No usar:

- publicar en redes;
- tocar secretos;
- reemplazar Notion, CRM o finanzas;
- saltar aprobaciones de Sergio/cliente;
- crear claims comerciales sin validacion.

Prompt operativo recomendado:

```text
Actua como estudio creativo de ONIA, no como publisher.
Objetivo: <objetivo>.
Producto/rubro: <producto o rubro>.
Referencias permitidas: <links o IDs>.
Entrega solo: hooks, estructura, shot list, prompts Higgsfield, riesgos,
variantes y recomendacion de modelo.
No publiques, no uses claims no verificados, no copies creadores.
Devuelve todo listo para registrar en Hermes Video Lab.
```

### Apps
Uso principal: herramientas especificas de edicion, identidad, producto y virality checks.

Apps utiles para Onia:

- Virality Predictor: revisar hook antes de publicar.
- Similarity Score: revisar similitud/IP cuando se usan referencias.
- Angles 2.0: generar angulos de un producto o imagen.
- Shots: obtener 9 tomas desde una imagen.
- Face Swap: solo con consentimiento.
- Headshot Generator: fotos profesionales para marca personal.
- Recast: character swap en video, solo con consentimiento.
- Video Face Swap: solo con consentimiento.
- Video Background Remover: recortar fondo de videos.
- Click to Ad: convertir links/productos en anuncios.
- Billboard Ad, Truck Ad, Product Ads: formatos llamativos para awareness.

Regla:

- Apps de cara/identidad requieren consentimiento explicito.
- Apps de IP/similitud se usan para evitar copiar referencias.
- Apps de producto sirven para demos comerciales y muestras de venta.

### Modelos clave

#### Catalogo verificado 2026-08-06 (lo que hay que elegir hoy)

**Video** — 30+ modelos; los que importan:

| Modelo | Id | Cuando |
|---|---|---|
| Marketing Studio | `marketing_studio_video` | anuncio de cliente con avatar/producto/brand kit (12-15s) |
| Seedance 2.0 | `seedance_2_0` | **el caballo de batalla**: identidad consistente por referencia, multi-SKU, audio nativo, hasta 4K |
| Seedance 2.0 Mini | `seedance_2_0_mini` | misma logica, barato, 480/720p — pruebas y volumen |
| Kling v3.0 | `kling3_0` | multi-shot, transferencia de movimiento, modo 4k |
| Veo 3.1 / Lite | `veo3_1` / `veo3_1_lite` | ultra realista (caro) / lotes baratos de 4-8s |
| Cinema Studio 3.0 | `cinematic_studio_3_0` | pieza cine, 4-15s, hasta 4K |
| FLUX 3 Video | `flux_3_video` | continuacion de video + audio sincronizado, 5-20s |
| Personal Clipper | `clipify` | 1 YouTube → hasta 20 clips 9:16 con subtitulos |
| Lipsync 3 | `sync_so` | pegar voz de ElevenLabs a un video ya generado |
| Upscale / deflicker | `topaz_video`, `bytedance_video_upscale`, `video_deflicker` | terminar la entrega al cliente |

**Imagen:**

| Modelo | Id | Cuando |
|---|---|---|
| Soul 2.0 | `text2image_soul_v2` (+`soul_id`) | **modelos IA, UGC, retrato** — 0,12 cr a 2k |
| Nano Banana Pro / 2 | `nano_banana_pro` / `nano_banana_2` | 4K, texto legible y diagramas, mockups |
| GPT Image 2 | `gpt_image_2` | tipografia y edicion precisa, 4K |
| Marketing Studio Image / DTC Ads | `marketing_studio_image` / `ms_image` | ads estaticos; `ms_image` exige `style_id` y acepta brand kit |
| Seedream 4.5 | `seedream_v4_5` | 4K-6K, transformaciones precisas |
| Cinema Studio Image 2.5 | `cinematic_studio_2_5` | stills cinematograficos 4K |

> Regla dura: **antes de citar parametros, correr `models_explore action=get`.** El catalogo
> cambia mes a mes; lo de arriba es foto del 2026-08-06.

#### Marketing Studio Video
Mejor para:

- anuncios UGC;
- video de producto;
- video local para clientes;
- prueba de oferta;
- pack ventas IA.

Usar primero para clientes.

#### Seedance 2.0
Mejor para:

- videos rapidos 9:16;
- UGC simple;
- ideas con buena relacion velocidad/calidad;
- piezas de contenido diario.

Parametros validados:

- `aspect_ratio`: `9:16`
- `duration`: 5 por defecto; ajustar segun pieza.
- `mode`: `std` o `fast`
- `resolution`: 480p, 720p, 1080p

#### Kling 3.0
Mejor para:

- piezas cinematicas;
- clips con mas impacto visual;
- anuncios premium;
- experimentos virales.

Parametros validados:

- `aspect_ratio`: 16:9, 9:16, 1:1
- `duration`: 5 por defecto
- `mode`: `std`, `pro`, `4k`
- `sound`: `on` u `off`

#### Veo 3.1 Lite
Mejor para:

- pruebas de video corto;
- escenas con buena coherencia;
- variantes de 4, 6 u 8 segundos;
- piezas con o sin audio generado.

Parametros validados:

- `aspect_ratio`: 16:9, 9:16, auto
- `duration`: 4, 6, 8
- `generate_audio`: true/false

#### Nano Banana Pro
Mejor para:

- miniaturas;
- ads estaticos;
- producto;
- mockups;
- imagenes para alimentar videos;
- piezas 9:16/1:1/16:9.

Parametros validados:

- `aspect_ratio`: auto, 1:1, 3:2, 2:3, 4:3, 3:4, 4:5, 5:4, 9:16, 16:9, 21:9
- `resolution`: 1k, 2k, 4k
- `input_images`: referencias opcionales

#### Soul V2 / Soul ID
Mejor para:

- identidad consistente;
- lookbooks;
- marca personal;
- AI influencer;
- avatares con permiso.

Regla:

- Solo usar con consentimiento.
- No publicar cara generada de Sergio o cliente sin aprobacion.
- Para Sergio, usar la ruta validada `text2image_soul_v2` o `soul_cinematic`
  con `--soul-id` para crear un still revisable antes de animar.
- Evitar `soul_cast` por CLI para identidad de Sergio hasta que Higgsfield
  documente o corrija el payload de `prompt` objeto. El intento fallido del
  2026-06-03 produjo `character_params: {}` e identidad inventada.
- Referencia del issue publico: https://github.com/higgsfield-ai/cli/issues/4

## Mejores funciones para Onia

Prioridad 1:

- Marketing Studio Video para vender anuncios UGC a negocios locales.
- Nano Banana Pro para ads estaticos, miniaturas, producto y mockups.
- Seedance 2.0 para videos rapidos 9:16.

Prioridad 2:

- Kling 3.0 para piezas cinematicas o virales de mayor impacto.
- Virality Predictor para revisar hooks antes de publicar.
- Product Photoshoot para ecommerce, restaurantes y productos fisicos.
- Marketplace Cards para tiendas y catalogos.

Prioridad 3:

- Canvas para campanas con muchas variaciones.
- Supercomputer para clips largos e ideacion a escala.
- Soul ID para Sergio/clientes solo con consentimiento.
- AI Influencer para experimentos de canal, no para claims de cliente.

## Matriz de decision

| Necesidad | Funcion recomendada | Motivo |
|---|---|---|
| Cliente local necesita anuncio | Marketing Studio Video | Produce UGC/ad listo con formatos comerciales |
| Producto fisico | product-photoshoot + marketplace-cards + Marketing Studio | Cubre foto, anuncio y piezas de catalogo |
| Video diario ONIA/Sergio | Seedance 2.0 | Rapido y suficiente para 9:16 |
| Video premium/cinematico | Kling 3.0 o Veo 3.1 Lite | Mejor para impacto visual |
| Miniatura o ad estatico | Nano Banana Pro | Alta calidad visual y resoluciones utiles |
| Avatar/persona consistente | Soul ID | Mantiene identidad, requiere permiso |
| Campana con muchas variaciones | Canvas | Nodos y flujo visual reutilizable |
| Clip largo a Shorts/Reels | Supercomputer / Personal Clipper | Diseñado para cortar contenido largo |
| Revisar hook | Virality Predictor | Reduce riesgo antes de publicar |
| Evitar copiar referencias | Similarity Score | Ayuda a revisar similitud/IP |

## Higgsfield como PRODUCTO de la plataforma ONIA

> Pedido de Sergio 2026-08-06: *"aprendelo como la palma de tu mano para que lo usemos como
> producto para la ONIA plattform"*. Esta seccion es la respuesta: **que se vende**, no que
> se puede hacer.

### La tesis

Higgsfield no se vende como "videos con IA" (commodity, lo ofrece cualquiera). Se vende como
**el Estudio de Contenido dentro de la plataforma que el cliente ya usa**: su marca cargada,
su modelo/avatar, su cola de aprobacion, su calendario, su atribucion. El foso no es el
modelo generativo — es que el contenido **cae adentro del panel donde el cliente ya gestiona
su negocio** y termina en un lead atribuido, no en un archivo por WhatsApp.

Consecuencia de producto: el modulo vive en `onia-center` y reusa lo que ya existe
(cola de aprobacion, agentes, `?src=` → lead → Cal). Higgsfield es el **motor**, no la marca.

### Los 4 SKU (de menor a mayor compromiso)

| SKU | Que recibe el cliente | Motor | Costo de generacion |
|---|---|---|---|
| **Demo de venta** (gratis, arma la reunion) | 1 pieza vertical con SU producto/local | `ugc-saas-flow` desde la URL del cliente | 1 video, cotizar con `get_cost` |
| **Pack de piezas** (add-on de propuesta) | N videos + estaticos al mes, aprobados en el panel | `ugc-flow` / `marketing_studio_video` + `ms_image` con brand kit | ~0,12 cr/imagen + video por pieza |
| **Modelo IA de la marca** (ticket alto) | Soul propio del cliente + banco mensual de piezas con esa cara | `show_characters(train)` + `text2image_soul_v2` + receta visual | entreno ~10 min · 0,12 cr/imagen |
| **Estudio gestionado** (recurrente, el que importa) | todo lo anterior + calendario + publicacion + reporte de leads atribuidos | pipeline completo + `virality_predictor` antes de publicar | presupuesto de creditos por cliente |

**Precios: NO se inventan aca.** Salen del generador de propuestas (add-on "videos IA") y de
`ONIA_CATALOGO_DE_IDEAS.md` §3.6-3.7. Este doc define el producto; el precio
vive en su fuente. Ver tambien `historial/HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md` §2 (escalera de ofertas).

### Por que el margen es real

El plan Ultra ya esta pagado y da **2.994 creditos**. Una imagen Soul cuesta **0,12 cr** — un
banco mensual de 30 imagenes para un cliente cuesta **~3,6 creditos**. El costo marginal de
sumar un cliente al Estudio es practicamente el video, y el video se cotiza por pieza antes de
generar. **Lo que se cobra es el sistema y la aprobacion, no el render.**

### Lo que hace el modulo dentro del panel (spec corta)

1. **Brand kit del cliente** cargado una vez (`show_marketing_studio type='brand_kit'`) → todas
   sus piezas salen con su paleta, logo y tono.
2. **Producto/es** cargados (`type='product'`) → `ms_image` y `marketing_studio_video` los
   componen solos.
3. **Cola de aprobacion** (ya existe en onia-center): nada sale sin OK humano. Regla dura.
4. **Publicacion:** TikTok directo por MCP (`tiktok_publish`, no depende del token de Meta);
   Instagram queda atado a S6.
5. **Atribucion:** cada pieza lleva su `?src=` → lead en el panel. **La metrica del modulo es
   leads atribuidos, no piezas entregadas.**

### Lo que NO se vende (limites que evitan quemar la cuenta)

- Nada de testimonios ni resultados fabricados (FTC) — la modelo **presenta y demuestra**.
- No se usa cara ni voz de nadie sin consentimiento escrito.
- No se replica el anuncio de un competidor identificable (usar `ads_library_search` para
  entender el angulo, no para copiar la pieza).
- No se promete alcance ni ventas: se promete **produccion + sistema**.

## Plan de arranque *(historico — junio 2026; el arranque vigente es la seccion de arriba)*

### Dia 1: tres demos vendibles
Crear briefs, no generar sin aprobacion.

1. Restaurante/cafe:
   - formato: Marketing Studio Video
   - modo: `ugc`
   - objetivo: reservas por WhatsApp
   - pieza: plato estrella + ambiente + CTA

2. Clinica/estetica:
   - formato: Marketing Studio Video
   - modo: `ugc_how_to` o `product_showcase`
   - objetivo: consultas ordenadas
   - pieza: problema de mensajes perdidos + seguimiento

3. Inmobiliaria:
   - formato: Seedance 2.0 o Marketing Studio Video
   - modo: `product_showcase`
   - objetivo: visitas y lead capture
   - pieza: propiedad + ficha + CTA

### Dia 2: tres variantes por demo
Para cada nicho:

- variante UGC: natural, humano, telefono.
- variante producto/servicio: mostrar oferta.
- variante before/after de proceso: antes sin sistema, despues con seguimiento.

### Dia 3: outreach a 20 negocios
Distribucion:

- 5 restaurantes/cafes.
- 5 clinicas/esteticas.
- 5 inmobiliarias.
- 5 gimnasios/ecommerce/locales.

Usar mensaje consultivo:

```text
Hola, soy Sergio de ONIA. Estamos creando videos UGC/IA para negocios locales, pero conectados a WhatsApp para que el contenido termine en conversaciones. Vi su negocio y puedo mandarles una idea de video aplicada a su rubro si les interesa.
```

### Semana 1
Objetivo:

- cerrar 1 cliente de Pack ventas IA;
- recuperar 1400 Bs de herramientas;
- registrar costos y creditos usados;
- crear un caso interno sin inventar resultados.

### Semana 2
Objetivo:

- convertir el primer cliente en caso operativo;
- documentar proceso;
- crear 2 demos mas;
- ofrecer Pack mensual si el cliente queda satisfecho.

## Reglas de uso

- No usar cara o voz de personas sin consentimiento.
- No usar testimonios falsos.
- No publicar sin aprobacion.
- No generar videos de cliente sin brief aprobado.
- Estimar costo antes de generar cuando el video sea para cliente.
- Registrar creditos usados por proyecto.
- No copiar logos, marcas, claims o estilos de terceros sin permiso.
- No prometer ventas garantizadas.
- Usar lenguaje seguro: "puede ayudar", "disenado para", "ordena el seguimiento", "reduce trabajo manual".
- Construir prompts con personaje, escenografia, hook, escena, camara, safe
  proof y negative prompt.
- Para UGC de venta, priorizar demostracion visual sobre review hablado.

## Comandos base

### Estado
```powershell
npx -y -p @higgsfield/cli higgsfield account status --json
```

### Modelos
```powershell
npx -y -p @higgsfield/cli higgsfield model list --video --json
npx -y -p @higgsfield/cli higgsfield model list --image --json
npx -y -p @higgsfield/cli higgsfield model get marketing_studio_video --json
```

### Estimar costo
```powershell
npx -y -p @higgsfield/cli higgsfield generate cost marketing_studio_video --prompt "<prompt>" --aspect_ratio 9:16 --duration 15 --mode ugc --resolution 720p
```

### Generar despues de aprobacion
```powershell
npx -y -p @higgsfield/cli higgsfield generate create marketing_studio_video --prompt "<prompt>" --aspect_ratio 9:16 --duration 15 --mode ugc --resolution 720p --wait
```

### Subir referencia
```powershell
npx -y -p @higgsfield/cli higgsfield upload create "C:\path\to\asset.png"
```

## Flujo recomendado Hermes

1. Crear brief con `Crea video cliente: <negocio> | <oferta> | <estilo>`.
2. Elegir funcion Higgsfield con la matriz de decision.
3. Estimar costo.
4. Pedir aprobacion.
5. Generar por CLI.
6. Guardar URL/metadata.
7. Revisar preview.
8. Entregar o publicar solo con aprobacion.
9. Registrar creditos, cliente, estado y siguiente accion.

## Acceptance checklist

- Funcion elegida segun matriz.
- Brief aprobado.
- Costo estimado.
- No hay datos sensibles.
- No hay claims peligrosos.
- Consentimiento registrado si hay cara/voz.
- Resultado revisado antes de publicar/entregar.
