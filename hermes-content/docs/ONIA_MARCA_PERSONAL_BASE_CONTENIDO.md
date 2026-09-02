# BASE DE CONTENIDO — materia prima para videos, drops y guiones (también para Samuel)

> Inventario VIVO de cosas que usamos/probamos y su ángulo de contenido. El loop del VPS
> lo alimenta cada corrida (lo que descubre el radar entra acá con ángulo). Cada ítem:
> qué es → por qué le importa a la audiencia → demo posible. Pedido por Sergio 2026-09-02.
> Regla: solo entra lo PROBADO por nosotros o verificable con fuente. Nada de humo.

## 1 · Lo NUESTRO (ventaja injusta: nadie más puede mostrar esto)

| Tema | Qué es | Ángulo de contenido | Demo |
|---|---|---|---|
| **HERMES** ⭐ (pedido por Sergio) | El "cerebro" de Onia: un agente Python que vive en el servidor con su propia identidad (`SOUL.md`), memoria, caché de audio, directorio de canales y config — coordina bots, radar de IA y alertas 24/7 | "Mi empresa tiene un empleado que no duerme: le puse nombre, alma y memoria" — build-in-public premium; serie propia posible ("Hermes hizo X hoy") | pantalla real del VPS: SOUL.md, alerts.txt, los crons corriendo |
| **El guardián del VPS** | Claude corre cada 10 min en el servidor: autocura contenedores y manda diagnóstico a Telegram | "Mi servidor se arregla solo y me avisa por Telegram" | captura del cron + un aviso real de Telegram |
| **Los loops de contenido** | Este mismo sistema: el VPS escribe drops, artes y videos solo, 4×/día | "Mi contenido se produce solo mientras duermo" (meta-contenido — MUY compartible) | el log del loop + un commit automático |
| **Claude Code + skills** | Con qué construimos todo (el stack del video de Revolutia, pero NOSOTROS operamos una empresa real) | "El mismo Claude que tenés vos — la diferencia es lo que le instalás" | pantalla generando una web/sistema real |
| **HyperFrames** | Video desde HTML: el teaser de la comunidad se renderizó en el servidor en 30 s | "Hago motion graphics sin editor: HTML → MP4" | el teaser + el código al lado |
| **Higgsfield CLI** | Artes 3D por terminal, cotizadas antes de generar (0,12 cr/imagen) | "Genero los artes de mi marca por terminal, con presupuesto exacto" | terminal: cost → create → resultado |
| **n8n** | Automatizaciones (embudo, seguimientos del chatbot cada hora) | "El empleado de operaciones que no cobra" | workflow real corriendo |
| **Chatbot Onia (Chatwoot + WhatsApp)** | Recepcionista IA con seguimientos, recordatorios y post-demo automáticos | "Atiende, agenda y hace seguimiento solo" (para dueños de negocio) | conversación real (datos tapados) |

## 2 · Herramientas/modelos para PROBAR y contar (entran cuando se prueban)

| Qué | Estado | Ángulo si funciona |
|---|---|---|
| Claude Skills nuevas de la comunidad (radar GitHub: unlazy 2.9K⭐, shuohao-skills 2.5K⭐...) | por probar | "Probé la skill que está explotando en GitHub — esto hace" |
| Nano Banana Pro / Seedream 4.5 / FLUX.2 (roster Higgsfield) | disponibles en el CLI | comparativa honesta con costos reales |
| Soul-ID (entrenar la cara de Sergio en el CLI) | por probar (0 costo de explorar) | "Entrené a la IA con mi cara — mirá lo que sale" |
| Elements of AI / Anthropic Academy | probados (certificado real) | ya en drops D0 |

## 3 · Lenguaje y formatos que FUNCIONAN (evidencia propia + medida)

- **Voseo boliviano directo**, cero anglicismo forzado; "sin humo" como firma.
- Identidad SIEMPRE: "16 años · Bolivia · empresa real" (5× en sus números).
- Formatos ganadores: POV/humor deadpan (5.407) · objeción personal (4.020) ·
  save-bait "guardá esto" (47K TikTok) · interactivo "decime tu negocio" (18K) ·
  statement-3d (guardados > likes).
- Palabras que convierten en ES: "gratis", "con certificado", "de verdad", "paso a paso",
  "sin pagarle a nadie".
- **CTA estándar: "Comentá COMUNIDAD y te paso el enlace para unirte"** (regla Sergio 02-sep) — el
  comentario alimenta el algoritmo; el link en bio es respaldo. DM roto = responder a mano.

## 4 · Para SAMUEL (brief que se le entrega con el radar mensual)

Cada tema de §1 es un guion potencial de sus 20 pilares. Prioridad del mes: Hermes
(serie nueva), Claude Code setup, chatbot para dueños de negocio, "mi contenido se
produce solo". Los ganchos del banco (RADAR §2) se cruzan con estos temas.

## 5 · Cola de pruebas del loop (una por corrida de práctica)

- [ ] Soul-ID con la cara de Sergio (CLI, costo 0 explorar → cotizar el train) — requiere
      fotos de identidad de Sergio, que viven fuera de este carril (`references/marca-personal/`
      no las tiene); no se ejecuta sin ellas ni sin que Sergio decida el gasto del train.
- [x] **Probar 1 skill del radar (unlazy / shuohao) y anotar veredicto** (02-sep) —
      **evaluadas por lectura de fuente (README/SKILL.md vía GitHub raw), sin instalar
      ni ejecutar**: instalar tocaría `~/.claude/skills/` o `.claude/skills/` del repo,
      fuera de los archivos permitidos a este carril (REGLA DURA). **`unlazy`**
      (`Leonxlnx/unlazy`, 2.950⭐): disciplina de cierre — obliga a escribir una lista de
      gates verificables ANTES de dar algo por terminado y los re-corre con un checker de
      Node, bloqueando el `Stop` hasta que pasen. Es literalmente la regla "Nada a medias
      — cerrar antes de abrir" de este mismo `CLAUDE.md`, pero automatizada con un gate
      ejecutable en vez de honor system — **candidata real para el carril
      `docs-auditoria` o `onia-cola` (el integrador)**, no para este. **`shuohao-skills`**
      (`eternityspring/shuohao-skills`, 2.527⭐): pipeline de 5 skills para producir
      cortometrajes/dramas chinos desde una novela (outline→personajes→arte→guion→
      storyboard), con paywall de comunidad en WeChat — dominio ajeno (ficción china, no
      automatización de negocio boliviano), **no aplica al contenido de este carril**.
      **Veredicto: ninguna se adopta en marca-personal; `unlazy` se anota como propuesta
      para quien sea dueño de `.claude/skills/` a nivel repo — no es esta sesión.**
- [ ] Variante statement-post animado (HyperFrames 6 s del claim "Bs 0 en sueldos") —
      probado 02-sep: no hay CLI de HyperFrames instalado en el VPS (`hyperframes` no
      existe, `npx hyperframes-cli` da 404). Queda pendiente de que se resuelva el runtime.
- [x] **Comparativa nano_banana_flash vs soul_v2 para artes verdes** (02-sep) — **el ítem
      estaba mal cotizado**: `higgsfield generate cost` dio **nano_banana_flash = 1,5 cr**
      (y nano_banana / nano_banana_2_lite = 1 cr), muy por encima del tope 0,12 cr/imagen
      de la regla dura. Solo `text2image_soul_v2` entra en presupuesto (0,12 cr). Se
      **abortó sin generar** con Nano Banana — la regla "cotizar ANTES" hizo justo su
      trabajo. No hay comparativa posible dentro del tope; no reintentar con estos modelos.

## 6 · Mejoras de calidad pedidas por Sergio (02-sep) — las trabaja el loop de práctica

- [x] **Tipografía** (probado 02-sep, 2 comparativas renderizadas): primera pasada
      eligió Bricolage y Sergio la corrigió — **la marca Onia es Archivo Variable**
      (ONIA_MARCA_SISTEMA: Archivo para todo, jerarquía por tamaño + eje `wdth`;
      Bricolage está descartada a propósito ahí). Veredicto final aplicado a los 4
      generadores: **claims/títulos Archivo wght 900 wdth 62** (condensed editorial,
      word-spacing .09em) · **números/impacto wdth 125** (expanded poster) ·
      **wordmark "Onia Community" wght 560 wdth 96** (el corte del logo) · cuerpo
      Archivo · **micro-etiquetas y handle Geist Mono** letter-spacing .08em.
- [x] **Más imágenes — mitad "artes Higgsfield integrados"** (02-sep, experimento A/B
      renderizado y comparado en `carousels/out/experimento-arte-higgsfield-vs-icono/`):
      misma portada ("Un sistema, no una lista de apps"), **A** icono Fluent (laptop,
      gratis) vs **B** arte Higgsfield (engranajes verdes, `text2image_soul_v2`, 0,12 cr
      cotizado y verificado en `account transactions`). **Gana B**: el engranaje
      literaliza "sistema" mejor que un laptop genérico y el verde de marca encaja con
      la caja redondeada tipo app-icon; el laptop además traía celeste/violeta que
      chocan con la paleta. **Regla de uso, por costo:** el arte pago se reserva para
      la portada/hero de una pieza (1 por pieza), el interior sigue en íconos Fluent
      gratis — meter Higgsfield en cada lámina de un carrusel de 5-7 rompería el tope
      de 1 cr/día en una sola pieza. Aplicado ya a `generar-carrusel-sistema.py`
      (portada real, no solo el experimento); arte guardado en
      `references/marca-personal/higgsfield-artes/sistema-engranajes.png`.
- [ ] **Más imágenes — mitad "foto real de Sergio"**: sin ejecutar, no hay identity
      assets en este carril (mismo bloqueo que Soul-ID arriba) — separada del ítem de
      arriba porque esa mitad sí se pudo cerrar.
- [ ] **Sonido**: BGM en teasers HyperFrames (media-use resolve BGM) + SFX en beats
      clave; probar en el teaser de comunidad v3
- [x] **Texturas/atmósfera** (02-sep, experimento A/B/C renderizado y comparado en
      `carousels/out/experimento-textura-statement/`, sobre la pieza real "Mi oficina
      entera"): **gana la sombra de ícono más rica** (`drop-shadow` más profundo,
      `0 30px 45px rgba(0,0,0,.25)`) — se nota, da presencia sin ensuciar el fondo
      plano. **El grano sutil (feTurbulence) se descarta**: triplicó el peso del PNG
      (172KB → 900KB) y a esta escala de publicación es imperceptible — costo sin
      beneficio visible, justo lo que la regla "verificar es MIRAR" existe para
      atrapar. Aplicado a `generar-statement-post.py`; el papel envejecido de carosia
      queda sin adoptar (no rindió en nuestro fondo claro).
- [x] **Marco spec-sheet** (02-sep, experimento A/B renderizado y comparado en
      `carousels/out/experimento-marco-specsheet/`): **gana la variante CON marco**
      (header "ONIA SYSTEM · GRID 1080×1350 / V1.0" + footer "TECHNICAL SPEC ·
      TEMA: X / FORMATO: Y", Geist Mono mayúscula, filete negro arriba y abajo) —
      da look editorial de sistema real sin tapar nada ni cortar texto, y encaja con
      la firma "sin humo" del carril. Aplicado a la portada de
      `generar-carrusel-chatbot.py`; próximos generadores de portada lo copian de ahí.
- [ ] **Mascota 3D Onia** (candidatos listos 02-sep, **falta el OK de Sergio** — no se
      adopta sin él): 3 variantes generadas con `text2image_soul_v2` (0,12 cr c/u, 0,36 cr
      total) en `carousels/out/experimento-mascota-onia/` — **A-cubo.png** (cabeza cubo
      redondeada, cuerpo simple, un solo material verde `#1F7A4D`), **B-blob.png** (cuerpo
      blob con antena), **C-chip.png** (cabeza con patrón de circuito y cara realista
      dentro — mezcla de materiales que rompe la pureza "toy"). **Recomendación: gana
      A-cubo** — es el más limpio, el único material consistente de punta a punta, el más
      parecido al cubo-head que ya usa carosia (referencia de `spec-sheet-editorial/FICHA.md`)
      y el más fácil de hacer sostener props para literalizar metáforas (el objetivo
      original del ítem). B es genérico y sin gancho de marca; C mezcla plástico de juguete
      con piel fotorrealista, se ve inconsistente. **Pendiente de Sergio: mirar los 3 y dar
      el OK sobre A (o pedir otra variante) antes de usarlo en cualquier pieza publicable.**
- [x] **Historias-quiz** (02-sep): formato ingenierobinario adaptado a marca —
      `generar-historia-quiz.py`, 3 historias listas con zona para el sticker de
      encuesta; opciones y respuestas en SEMANA1. La interacción es el poll de 1 tap.
- [x] **Label de ícono en statement-3d-minimal** (02-sep, tanda intensiva) —
      A/B renderizado y comparado en `carousels/out/experimento-label-icono-statement/`
      sobre la pieza real "16 años. 4 herramientas. 1 empresa.": **A** sans regular
      negra (la que había) vs **B** Geist Mono mayúscula gris. **Gana B** — no compite
      en peso visual con el claim (A usaba el mismo negro pleno) y unifica el
      lenguaje con el marco spec-sheet y el handle. Aplicado a
      `generar-statement-post.py` (regenerado, mismo PNG) y al generador nuevo
      `generar-statement-16anos.py`. FICHA.md actualizada. **Hallazgo extra:** el
      mismo experimento destapó que con un claim de 2-3 líneas los íconos/gaps que
      traía el generador original invadían el handle — bug real de layout, corregido
      antes de publicar (íconos 230px→196px, gaps más chicos).
