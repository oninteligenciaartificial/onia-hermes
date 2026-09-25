# Skill: carruseles-onia

## Cuando usar
Cuando Sergio pida crear, renderizar o publicar un carrusel de Instagram para
ONIA. Cubre desde la idea hasta el PNG final y la publicacion aprobada.

## Comandos
- `Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`
- `Renderiza carrusel: <brief>` (brief ya existente en `hermes-content/carousels/briefs/`)
- `Publica carrusel: <nombre>` (requiere aprobacion explicita, ver Reglas)

## Pipeline real (estado 2026)
El pipeline vive en `scripts/` del repo `onia-hermes`:

1. **Brief JSON** en `hermes-content/carousels/briefs/`. Se escribe a mano o lo
   redacta Hermes. `scripts/carousel_generator.py` existe pero necesita
   Python + `OPENAI_API_KEY` y la PC de Sergio no tiene Python: NO depender de el.
2. **Render**: `node scripts/carousel_render.js` -> PNG 1080x1350 con Node +
   Edge headless. Gratis, sin APIs.
3. **Publicacion**: `node scripts/carousel_publish.js` (publish-only) -> sube los
   PNG ya renderizados al VPS y postea via `ig-publish`. Sin Python.

Cuenta IG ONIA: `17841423363059652` con token Meta default. Las cuentas
personales de Arthur/Sergio NO tienen credenciales Meta: no intentar publicar ahi.

## Packs visuales disponibles (`carousel_render.js`)
- `community-editorial` — **default para ONIA, educación y producto**. Portada
  humana/editorial, interiores claros, tarjetas de conocimiento, diagramas y UI real.
- `dark-product` — estilo Solaris. Usar sólo cuando el concepto publicitario pida
  deliberadamente una pieza oscura de performance; no usarlo como default para un
  carrusel completo.
- `dark-neon` — glow + grid, estilo Perfluence.
- `editorial-photo` — foto editorial histórica; no usar como default para Sergio.

## Reglas de diseno de Sergio (obligatorias)
- **NO** mostrar el pill "ONIA" ni un contador grande tipo "PASO 02 / 08" en la parte
  superior. La marca y el episodio van en una barra editorial discreta.
- Titulares y objetos con tamano reducido: todo debe entrar con margen seguro,
  los callouts no se cortan en los bordes.
- ONIA green como acento, nunca como paleta completa.
- Layouts profesionales: jerarquia clara, espacio util, tarjetas de prueba,
  diagramas simples, procesos y ejemplos concretos. Un slide sin visual de apoyo
  se considera incompleto.

## Gate anti-plantilla y de venta (obligatorio)

Origen: corrección de Sergio Urcullo del 2026-09-21 después de una campaña de ONIA
que se veía generada por IA y no desarrollaba un argumento de venta.

- Una plantilla no es una idea. Repetir fondo negro, verde, mayúsculas y la misma
  composición en todas las láminas se rechaza aunque esté bien renderizado.
- Cada slide debe cumplir una función diferente y tener un objeto visual propio:
  foto humana, interfaz real, flujo, tabla, contrato de decisión o evidencia.
- La secuencia mínima para pauta es: dolor exacto del rubro → plata en juego → causa
  operativa → producto real → mecanismo → control humano/prueba → oferta y CTA.
- Para software, incluir capturas reales del tenant demo. Nunca inventar UI con un
  generador de imágenes. Revisar que no haya datos personales antes de renderizar.
- Usar como piso de calidad el pack editorial de la sesión de marca personal
  (`community-editorial`, commit `e9b80e22`), adaptado a ONIA; no copiar su copy.
- La pieza se rechaza si: el rubro puede reemplazarse sin cambiar el texto, el dolor
  no termina en dinero, no aparece el producto, o el CTA compite con otro CTA.

## Assets e imagenes
- Objeto 3D on-brand reusable: `hermes-content/assets/onia/automation-node-clean-3d.png`
  (Higgsfield Nano Banana, ya recortado). **Cachear y reusar, no regenerar por slide.**
- Imagenes nuevas con OpenAI:
  `npm run image:openai -- --prompt "<prompt>" --out <archivo>.png --transparent`
  (gpt-image-1, fondo transparente nativo, no necesita quita-fondo).
- La key vive en `onia-hermes/.env` como `OPENAI_API_KEY=sk-...` (gitignored).
  Si falla la auth, verificar que el .env tenga el prefijo `OPENAI_API_KEY=`.
- Nunca copiar assets de referencias (Pinterest u otros); referencias solo como
  notas de estilo via skill `referencias-pinterest`.

## Estructura narrativa
- Entre 3 y 10 slides (default 8 para pauta; 6 para orgánico breve).
- Slide 1: hook claro que detenga el scroll.
- **Pauta de ONIA (`@oniahq`):**
  - Slide 2: costo o consecuencia económica sin inventar cifras.
  - Slides intermedios: causa -> producto real -> mecanismo -> prueba/control.
  - Último slide: CTA único y específico (`cta`, sin «Comentá»).
- **Orgánico de Sergio Urcullo (`@sergiourcullo`):**
  - Slides intermedios: problema -> insight -> solución -> ejemplo concreto.
  - Último slide: CTA único y específico, con firma o posición personal y un motivo concreto
    para seguirlo (`identity`, `follow_cta`).
  - «Comentá PALABRA» (`comment_trigger`) sólo si alguien la va a contestar: hoy
    `@sergiourcullo` no tiene palabras activas y el comentario no dispara nada
    (`hermes-content/docs/contenido/PUBLICACION.md` §2).
  - Recurso de la Bóveda (`resource`) sólo si su URL ya responde 200: al 25-sep `/boveda` no
    está desplegada.
  - El renderer no agrega recurso ni firma por defecto: van en el brief o no aparecen.
- Lenguaje claro para empresas bolivianas, sin jerga tecnica innecesaria.

## Checklist de calidad antes de publicar
- [ ] Sin pill ONIA ni numero de slide arriba; footer `@oniahq` presente.
- [ ] Ningun texto o callout cortado; margen seguro respetado.
- [ ] Hook del slide 1 concreto (numero, error, resultado), no generico.
- [ ] Cada slide tiene una prueba visual distinta; no es una serie de afiches.
- [ ] El producto aparece en UI real y sin datos personales.
- [ ] Dolor del rubro -> dinero -> mecanismo -> oferta, sin claims inventados.
- [ ] Caption con primera linea fuerte + CTA.
- [ ] Hashtags relevantes a Bolivia/B2B, sin listas infladas.
- [ ] Prompts visuales originales, sin copiar referencias.
- [ ] PNGs renderizados y verificados (1080x1350, `image/png`).

## Reglas de aprobacion
- Nunca publicar sin aprobacion explicita: `Apruebo publicar <carrusel>`.
- `ok`, `dale` o `hazlo` NO cuentan como aprobacion de publicacion.
- Publicar exactamente la pieza aprobada, sin cambios posteriores silenciosos.
- Tras publicar, avisar SIEMPRE a Arthur Y Sergio por Telegram con el
  `published_id`.

## Errores comunes
- Graph API falla -> mostrar el error exacto, no resumirlo.
- URL de imagen no devuelve `image/png`/`image/jpeg` -> corregir antes de publicar.
- Sin placeholders: si falta un asset, generarlo o pedirlo, nunca publicar con
  imagen provisoria.

## Angulos recomendados ONIA
- Errores que hacen perder leads.
- Procesos que una empresa ya no deberia hacer a mano.
- Antes/despues de automatizar.
- Checklist para saber si un negocio esta listo para IA.
- Flujo real: Instagram/WhatsApp -> Chatwoot -> n8n -> seguimiento.
- Caso clinica dental: citas, recordatorios, seguimiento y pacientes.

## Resultado esperado
Responder con: titulo, slides numeradas, caption, hashtags, prompts visuales,
pack visual elegido y siguiente accion (renderizar, pedir aprobacion o publicar).
