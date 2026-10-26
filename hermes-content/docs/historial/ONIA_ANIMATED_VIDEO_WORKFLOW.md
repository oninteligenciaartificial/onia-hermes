# Onia Animated Video Workflow

## Objetivo

Crear anuncios animados y videos tipo "frames to film" usando Hermes como
cerebro, Higgsfield/Supercomputer como estudio creativo y modelos de imagen/video
para producir piezas con personajes, storyboard y consistencia visual.

Este workflow nace del analisis de `creator-video-ref-20260601-003`, que muestra
un proceso de anuncios animados:

```text
direccion -> guion tecnico -> character lock -> storyboard -> animacion
```

## Idea central

La oportunidad no es solo crear avatares. La oportunidad es crear anuncios
animados con:

- personajes consistentes;
- escenas aprobadas antes de animar;
- guion tecnico plano a plano;
- estilo visual propio;
- prueba visual clara;
- CTA comercial.

## Agent One / InVideo Research 2026

Agent One es el agente conversacional de InVideo para crear video. Segun la
documentacion oficial, funciona como un "AI filmmaker": conversa sobre el brief,
piensa escena por escena y edita iterativamente. No es solo una plantilla ni un
generador de un prompt.

Fuentes oficiales revisadas:

- `https://help.invideo.io/en/articles/14717491-get-started-with-agent-one`
- `https://help.invideo.io/en/articles/14718442-using-context-to-guide-your-agent`
- `https://help.invideo.io/en/articles/14718640-prompt-guides-what-they-are-and-how-to-set-them-up`
- `https://help.invideo.io/en/articles/14718313-how-credits-are-charged-in-agent-one`
- `https://help.invideo.io/en/articles/14755439-agents-models-on-invideo`
- `https://openai.com/index/invideo-ai/`

Principios utiles para Onia:

- trabajar como director creativo, no como prompt suelto;
- cargar contexto del proyecto antes de generar;
- usar reglas persistentes de tono, ritmo, formato y marca;
- crear prompt guides por modelo o tipo de pieza;
- usar agentes/revision antes de gastar creditos grandes;
- mantener personajes, mundo visual y referencias dentro del proyecto;
- revisar costos por intercambio porque cada respuesta puede generar imagen,
  video, voz y razonamiento.

Riesgo comercial:

- Agent One puede acelerar el storyboard y la produccion, pero usa creditos por
  modelo, duracion, resolucion y regeneraciones.
- Para Onia, nunca dejarlo en modo "generar siempre" en trabajos de cliente.
- Usar primero aprobacion de brief/storyboard y despues generar video.

Decision Onia:

- Higgsfield/Supercomputer sigue como estudio principal por la suscripcion Ultra
  ya pagada.
- Agent One se registra como referencia y posible herramienta externa para
  workflows tipo director conversacional, storyboard y brand films.
- Si Sergio compra o prueba InVideo, Hermes debe preparar primero Context,
  Prompt Guides, Review Agent, Knowledge Bank y control de creditos.

## Workflow Agent One adaptado a Onia

Usar este orden:

```text
Contexto del proyecto -> reglas ONIA -> personajes/brand guide -> storyboard
-> aprobacion -> generacion controlada -> revision -> entrega
```

Contexto recomendado:

```text
Proyecto: anuncio animado vertical para negocio boliviano.
Objetivo: explicar una oferta y convertir curiosidad en consulta.
Audiencia: duenos de negocio o clientes finales segun brief.
Tono: claro, comercial, humano, sin prometer resultados garantizados.
Formato: 9:16, 20-35s, captions cortos en espanol.
Reglas: no copiar creadores, no usar marcas/logos sin permiso, no inventar
testimonios, no generar caras reales sin aprobacion, no publicar sin revision.
```

Prompt Guide base:

```text
Actua como director creativo de ONIA para anuncios cortos. Antes de generar,
divide el video en escenas, define objetivo de cada plano, mantiene personajes
consistentes, propone captions cortos y explica que creditos/modelos se usarian.
Pide aprobacion antes de generar video. Prioriza claridad comercial sobre efectos.
```

Review Agent recomendado:

```text
Revisa si el video cumple: hook en 2 segundos, una sola idea, oferta clara,
CTA simple, claims seguros, personaje consistente, texto legible, sin copia de
creadores ni marcas, y sin gasto de creditos innecesario.
```

## Flujo Onia

### 1. Direccion

Definir:

- producto/servicio;
- problema;
- contexto;
- solucion;
- publico;
- tono;
- estilo visual;
- CTA.

Ejemplo:

```text
Producto: servicio ONIA de videos IA para negocios.
Problema: negocios generan contenido bonito pero sin estrategia.
Solucion: Hermes analiza referencias y crea prompts/escenas vendibles.
Estilo: plastilina premium / mini estudio / stop motion.
CTA: escribe tu rubro.
```

### 2. Guion tecnico plano a plano

Cada plano debe tener:

- duracion;
- visual;
- accion;
- voz en off;
- texto en pantalla;
- objetivo narrativo.

Plantilla:

```text
Plano 1 / 0-2s
Visual:
Accion:
Voz:
Texto:
Objetivo:
```

### 3. Character lock

Antes de animar, crear o definir personaje:

- nombre;
- edad aparente;
- rol;
- ropa;
- expresion base;
- paleta;
- estilo;
- restricciones.

Reglas:

- No usar caras reales sin consentimiento.
- No copiar creadores.
- Para clientes, crear personaje original o usar assets aprobados.
- Si Higgsfield Soul ID o character tools estan disponibles, usarlos solo con
  referencias aprobadas.

### 4. Storyboard por fotogramas

Generar imagen fija de cada escena antes de video.

Herramientas posibles:

- Higgsfield image model;
- Nano Banana Pro;
- Agent One / InVideo si el proyecto ya tiene contexto y control de creditos;
- product-photoshoot;
- Canvas;
- Supercomputer para ideacion;
- otra herramienta de imagen aprobada.

Ventaja:

- se aprueba composicion antes de gastar creditos de video;
- se mantiene consistencia;
- se corrigen personajes, objetos y texto antes de animar.

### 5. Animacion

Pasar fotogramas aprobados al modelo de video.

Modelos posibles:

- Seedance 2.0 para clips rapidos y textura controlada;
- Kling 3.0 para impacto cinematico;
- Veo 3.1 Lite para escenas cortas coherentes;
- Marketing Studio Video cuando sea UGC/ad;
- Higgsfield Canvas cuando haya varias escenas conectadas.

### 6. Estilo de movimiento

Elegir una direccion:

- stop motion;
- plastilina;
- miniatura / diorama;
- producto en mesa;
- cinematic clean;
- paper cutout;
- storyboard animado;
- 3D toy commercial.

### 7. Revision y entrega

El orden seguro:

```text
brief -> storyboard -> aprobacion -> animacion -> preview -> revision -> publicar/entregar con aprobacion
```

## Prompt base: anuncio animado

```text
Create a vertical 9:16 animated commercial using a frames-to-film workflow.
Style: premium stop-motion clay / miniature diorama, warm cinematic lighting,
consistent original characters, handcrafted texture, commercial pacing.

Story:
<problem context>. Main character experiences <problem>. The solution appears as
<product/service>. Show clear cause and effect without exaggerated claims.

Scene flow:
1. Hook scene: <visual interruption>.
2. Problem scene: <problem>.
3. Solution scene: <product/service>.
4. Proof scene: <safe visual proof>.
5. CTA scene: <single CTA>.

Camera: close-ups, small dolly moves, gentle parallax, 9:16 vertical framing,
visual change every 2-3 seconds.

Text: short Spanish captions, max 6 words per caption.

Negative prompt: no copied creator identity, no real person likeness, no fake
testimonials, no fake results, no unapproved logos, no unreadable text, no
distorted hands/faces, no inconsistent character design.
```

## Prompt: character lock

```text
Create a consistent original character sheet for an animated commercial.
Character: <name>, <role>, <age range>, <personality>.
Visual style: <clay / toy / 3D / paper cutout>.
Wardrobe: <simple outfit>.
Facial features: original, friendly, not based on any real person.
Expressions: neutral, surprised, focused, happy.
Angles: front, side, 3/4, back.
Lighting and colors: <palette>.
Do not resemble any real creator, celebrity or known character.
```

## Prompt: storyboard frames

```text
Generate storyboard frame <number> for a vertical 9:16 animated ad.
Keep the same original character, same outfit, same face, same color palette and
same environment as previous frames.

Scene objective:
<objective>.

Visual:
<visual>.

Action:
<action>.

Camera:
<shot type and movement>.

Caption:
<short Spanish text>.

Style:
premium stop-motion clay / miniature commercial / warm cinematic light.
```

## Primer video recomendado para Onia

Titulo:

```text
La oportunidad no son los avatares: son anuncios animados con sistema.
```

Hook:

```text
En 2026, el video IA que vende no empieza con un avatar. Empieza con un storyboard.
```

Guion:

```text
0-2s:
En 2026, el video IA que vende no empieza con un avatar. Empieza con un storyboard.

2-6s:
Porque un avatar bonito sin direccion sigue siendo contenido vacio.

6-12s:
El flujo correcto es: idea, guion tecnico, personaje, storyboard y recien video.

12-20s:
Primero apruebas los fotogramas. Despues animas. Asi no gastas creditos a ciegas.

20-28s:
Hermes arma el sistema y Higgsfield convierte esos frames en una pieza vendible.

28-35s:
Si tienes un producto o negocio, dime el rubro y te preparo una idea animada.
```

## Cuando usar este workflow

Usar para:

- productos fisicos;
- ecommerce;
- SaaS explicado con personajes;
- restaurantes/cafes;
- clinicas con claims seguros;
- campanas premium;
- historias visuales donde un talking head no alcanza.

No usar para:

- videos urgentes de baja produccion;
- anuncios que solo necesitan UGC simple;
- piezas sin aprobacion de claims;
- imitacion de creadores o marcas.

## Comando conceptual para Supercomputer

```text
Actua como estudio creativo de ONIA. Necesito un anuncio animado frames-to-film.
Rubro: <rubro>.
Oferta: <oferta>.
Objetivo: <objetivo>.
Entrega: guion tecnico plano a plano, character lock, storyboard prompts,
prompt de animacion, negative prompt y 3 variantes de hook.
No publiques, no copies referencias, no inventes resultados.
```
