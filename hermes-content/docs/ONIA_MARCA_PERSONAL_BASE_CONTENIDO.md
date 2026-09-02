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

- [ ] Soul-ID con la cara de Sergio (CLI, costo 0 explorar → cotizar el train)
- [ ] Probar 1 skill del radar (unlazy / shuohao) y anotar veredicto
- [ ] Variante statement-post animado (HyperFrames 6 s del claim "Bs 0 en sueldos")
- [ ] Comparativa nano_banana_flash vs soul_v2 para artes verdes (0,24 cr total)

## 6 · Mejoras de calidad pedidas por Sergio (02-sep) — las trabaja el loop de práctica

- [x] **Tipografía** (probado 02-sep, 2 comparativas renderizadas): primera pasada
      eligió Bricolage y Sergio la corrigió — **la marca Onia es Archivo Variable**
      (ONIA_MARCA_SISTEMA: Archivo para todo, jerarquía por tamaño + eje `wdth`;
      Bricolage está descartada a propósito ahí). Veredicto final aplicado a los 4
      generadores: **claims/títulos Archivo wght 900 wdth 62** (condensed editorial,
      word-spacing .09em) · **números/impacto wdth 125** (expanded poster) ·
      **wordmark "Onia Community" wght 560 wdth 96** (el corte del logo) · cuerpo
      Archivo · **micro-etiquetas y handle Geist Mono** letter-spacing .08em.
- [ ] **Más imágenes**: láminas con foto real de Sergio (identity assets) + artes
      Higgsfield integrados en carruseles (no solo íconos)
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
- [ ] **Mascota 3D Onia**: personaje consistente estilo toy para literalizar metáforas
      (carosia usa el suyo en cada post) — definir con Higgsfield imagen (≤0,12 cr),
      requiere OK de Sergio sobre el diseño elegido
- [x] **Historias-quiz** (02-sep): formato ingenierobinario adaptado a marca —
      `generar-historia-quiz.py`, 3 historias listas con zona para el sticker de
      encuesta; opciones y respuestas en SEMANA1. La interacción es el poll de 1 tap.
