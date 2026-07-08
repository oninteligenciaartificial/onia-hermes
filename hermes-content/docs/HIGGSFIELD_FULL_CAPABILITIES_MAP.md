# Higgsfield Full Capabilities Map

## Objetivo
Definir que funciones de Higgsfield debe usar ONIA primero para crear contenido propio, contenido de Sergio y piezas comerciales para clientes.

Este documento es operativo: sirve para decidir modelo, flujo, comandos, limites de seguridad y plan de arranque.

## Estado actual
Validado el 2026-06-01 por CLI local:

- Cuenta: `oninteligenciaartificial@gmail.com`
- Plan: `ultra`
- Creditos disponibles al validar: `3000`
- Ruta recomendada actual: CLI
- Ruta futura: MCP nativo cuando Codex/Hermes lo exponga como herramienta directa

Fuentes revisadas:

- https://higgsfield.ai/cli
- https://higgsfield.ai/marketing-studio-intro
- https://higgsfield.ai/canvas-intro
- https://higgsfield.ai/supercomputer-intro
- https://higgsfield.ai/apps
- https://github.com/higgsfield-ai/cli
- Sesion Chrome autenticada
- CLI local de Higgsfield

## Inventario de funciones

### CLI y MCP
La CLI es la ruta que Hermes puede operar hoy desde el workspace.

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
higgsfield soul-id create --name <name> --image <id1> --image <id2> --image <id3>
```

Capacidades:

- `auth`: login OAuth/device flow.
- `account`: creditos, plan y transacciones.
- `workspace`: seleccionar workspace de facturacion.
- `model`: listar modelos y ver parametros.
- `generate`: estimar costo, crear, esperar, obtener y listar jobs.
- `upload`: subir imagenes, videos o audio para usarlos como input.
- `soul-id`: entrenar identidad consistente con 3-5 referencias.
- `marketing-studio`: gestionar avatars, hooks, products, brand kits y formatos.
- `product-photoshoot`: generar fotos de producto con prompt mejorado.
- `marketplace-cards`: generar imagenes tipo marketplace y modulos de producto.

MCP:

- Endpoint publicado: `https://mcp.higgsfield.ai/mcp`
- Usar MCP cuando aparezca como tool directo en Codex/Hermes.
- Hasta entonces, usar CLI.

### Marketing Studio
Uso principal para ONIA: vender anuncios UGC y videos comerciales a negocios.

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

Regla ONIA:

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

Regla ONIA:

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

### Regla Supercomputer ONIA

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

Apps utiles para ONIA:

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

## Mejores funciones para ONIA

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

## Plan de arranque

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
