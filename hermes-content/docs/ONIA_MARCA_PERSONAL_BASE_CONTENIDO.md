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
- [x] **Banda segura de historias 9:16** (02-sep, tanda intensiva) — **experimento
      inventado por el loop: §5/§6 no tenían ningún pendiente ejecutable** (los cuatro
      que quedan están bloqueados por assets, por el runtime de HyperFrames o esperando
      el OK de Sergio). A/B/C renderizado y comparado en
      `carousels/out/experimento-safearea-historia/`, con la **interfaz de IG simulada
      encima** (bandas rojas = lo que el usuario no ve): **A** layout actual ·
      **B** banda segura, misma tipografía · **C** banda segura + tipografía al 88 %.
      **Gana C.** Banda usada: `y ∈ [230px, 1498px]` — fuente interna versionada,
      `.agents/skills/embedded-captions/references/aesthetic-principles.md` §17
      ("9:16 TikTok/IG/Shorts: caption zone y ∈ [12%, 78%], bottom 22% is UI"); no se
      pudo citar la spec de Meta porque esta corrida no tiene acceso web.
      **A tenía un defecto real, no estético:** el handle quedaba **tachado por la barra
      "Enviar mensaje"** y ~40 % de la zona punteada de encuesta caía debajo de la UI —
      Sergio habría pegado el sticker medio tapado. B lo corrige pero deja la zona de
      encuesta apretada (~330px); C corrige lo mismo y recupera ~200px para el sticker,
      y la pérdida de tipografía es imperceptible a escala de historia (el claim baja de
      58px a 51px y sigue siendo lo más grande de la pantalla). Aplicado a
      `generar-historia-quiz.py` y **las 6 historias regeneradas**.
      **De paso quedó el gate del formato:** `chequear-banda-segura-historias.py` pega la
      interfaz sobre los PNG ya hechos y arma `CHEQUEO-banda-segura.png` para mirarla.
      Es justo lo que un `>50KB` no puede ver: el PNG suelto se veía impecable.
- [x] **La portada, leída al tamaño en que la ve el público** (02-sep, tanda intensiva) —
      **segundo experimento inventado por el loop**: los pendientes que quedan en §5/§6
      siguen bloqueados (assets de identidad, runtime de HyperFrames, OK de Sergio sobre la
      mascota, captura de un sticker de IG). A/B/C renderizado y comparado en
      `carousels/out/experimento-portada-miniatura/`: **A** el layout que usan HOY todos los
      generadores (icono 300 + título 88 wdth62 + subtítulo gris 44) · **B** sin subtítulo,
      título 112 · **C** jerarquía por tamaño (contexto 62 gris + remate 150 wdth 125).
      **Gana C, y no por poco.** A 33 % (feed) C se lee de un golpe mientras que A hay que
      esforzarse para leerla; a 13 % (grilla de perfil) **C es la única donde algo
      sobrevive** — A y B se vuelven una mancha gris. Es la regla "jerarquía por tamaño +
      eje `wdth`" de ONIA_MARCA_SISTEMA comprobada, y la §13 de
      `.agents/skills/embedded-captions/references/aesthetic-principles.md` ("el énfasis
      escala DENTRO de una frase, no entre frases").
      **Defecto real que destapó, no estético:** el subtítulo gris de las portadas viejas es
      **peso muerto** — ilegible a 33 % y a 13 %, o sea invisible justo en el único momento
      que decide si alguien frena el scroll, y encima obliga al título a achicarse para
      dejarle lugar. Cuesta y no paga.
      **Nota de escala:** el marco spec-sheet tampoco se lee reducido, pero eso está bien —
      ahí funciona como filete decorativo. **No agrandarlo**: se diseñó para la lectura a
      pantalla completa.
      Aplicado a la portada de `generar-carrusel-atender.py` y a la FICHA de
      `spec-sheet-editorial`. **Las portadas ya renderizadas NO se rehicieron**: a diferencia
      de la banda segura (que corregía algo roto), acá el cambio es una mejora, y cada
      portada necesita decidir a mano QUÉ dos o tres palabras son el remate — decisión
      editorial, no reemplazo mecánico. Queda como pendiente abajo.
      Las escalas de la hoja (33 % / 13 %) **no son medidas de la UI de Meta** —esta corrida
      no tiene acceso web para citarla—: son las proporciones a las que se ve una portada
      cuando no la abrís.
      **De paso, el gate se atrapó a sí mismo:** la primera hoja incluía una fila al 100 % y
      salía cortada (tres láminas de 1080 no entran en 1400px de ancho). Y agrandar la hoja
      era peor: al abrirla se reduce entera y las miniaturas dejan de verse al tamaño que se
      quiere juzgar. La fila 100 % se sacó; el tamaño completo se mira en los
      `variante-*.png` sueltos.
- [ ] **Portadas viejas al patrón ganador** (abierto 02-sep): `carrusel-5-prompts`,
      `carrusel-cursos-gratis`, `carrusel-tareas-automatizadas`, `carrusel-chatbot-venta` y
      `carrusel-sistema-venta` siguen con el layout A (título mediano + subtítulo gris).
      Cada una necesita elegir su remate de 2-3 palabras antes de re-renderizar — una por
      vuelta alcanza.
- [ ] **Próximo experimento — ¿la zona punteada es del tamaño del sticker real?**
      El gate de arriba prueba que la zona de encuesta está DENTRO de la banda segura,
      pero nadie verificó que su **tamaño** coincida con el del sticker de encuesta de IG:
      si la zona es más grande, Sergio pega un sticker chico flotando en un rectángulo
      vacío; si es más chica, lo pega desbordando el diseño. **No se puede medir sin una
      captura real de un sticker de IG** — pedírsela a Sergio (una captura de pantalla
      pegando una encuesta, 10 seg) y recién ahí calibrar `.zona`. Anotado acá para que la
      próxima corrida no lo invente a ojo.

## 7 · Decisiones de diseno de Sergio (02-sep tarde) — MANDAN sobre lo anterior

- **Mascota: cartoon 2D SVG** (references/ui-patterns/mascota-onia/), estilo axelyastro:
  linea negra + verde plano. Los 3 candidatos 3D clay quedan DESCARTADOS. La mascota
  protagoniza contenido (tiras, sketches, venta), no decora.
- **Menos es mas**: "hay informacion innecesaria" — 1 idea por lamina, cero metadata
  decorativa. El experimento marco spec-sheet queda DESCARTADO.
- **Verde Onia (#00C661) y tipografia de marca (Archivo + Geist Mono) SIEMPRE.**

### Estado de aplicacion de esta seccion (el loop la ejecuta, no la lee)

- [x] **Verde #00C661 aplicado** (02-sep, tanda intensiva) — **la seccion 7 se escribio
      como decision y NADIE la habia ejecutado sobre el codigo.** Contados los 12
      generadores de `scripts/marca-personal/`, **cuatro estaban en `#1F7A4D`**, un verde
      oscuro que no decidio nadie: `generar-carrusel-atender.py`, `-chatbot.py`,
      `-sistema.py` y `-tareas.py` — es decir **las dos piezas de venta y los dos
      carruseles mas nuevos**. Los otros ocho ya usaban el verde correcto o no usaban
      verde. Corregido en los cuatro.
- [x] **Como se usa el verde: experimento A/B/C con el contraste MEDIDO** (02-sep) —
      renderizado en `carousels/out/experimento-verde-marca/` sobre la lamina de CTA
      real (la palabra "COMUNIDAD", que es la que dispara toda la conversion).
      **Cambiar el hex a secas habria roto la pieza**, y por eso el item se hizo como
      experimento y no como buscar-y-reemplazar: en esos generadores el verde era
      **color de texto**, y `#00C661` es un verde claro.

      | | tratamiento | contraste WCAG sobre `#F7F7F7` | veredicto |
      |---|---|---|---|
      | A | `#1F7A4D` como texto (lo que habia) | **4,96:1** ✅ pasa | legible, pero es el verde equivocado y tan oscuro que ni se lee como verde |
      | B | `#00C661` como texto (arreglo ingenuo) | **2,12:1** ❌ reprueba | verde correcto y visualmente el mas debil: se lava sobre fondo claro |
      | C | `#00C661` de **fondo** + tinta `#0A0A0A` | **8,72:1** ✅ el mejor | **GANA** |

      **Gana C**, y mirada la hoja comparada no es cerca: el bloque verde convierte el CTA
      en lo segundo mas fuerte de la lamina despues del titulo, mientras que B queda mas
      apagado que el gris que lo rodea. C ademas **no era invento**: es exactamente como
      ya lo usaban `generar-lamina-grid-senales.py` y `generar-carrusel-comunidad.py`
      (`.hl{background:#00C661}`) — esa familia ya tenia razon y la otra se habia
      desviado. **Regla que queda:** el verde de marca es un **relleno**, nunca un color
      de texto sobre fondo claro. Aplicado a los 4 generadores, las 4 piezas regeneradas.
- [x] **Marco spec-sheet retirado** (02-sep) — Sergio lo descarto arriba y **seguia vivo
      en los mismos 4 generadores**, imprimiendo "ONIA SYSTEM · GRID 1080×1350 / V1.0" y
      "TECHNICAL SPEC · TEMA: …" en cada portada: justo la "informacion innecesaria" que
      el pidio sacar. Retirado del CSS y del markup, y **corregidos los docstrings**, que
      seguian anunciandolo como "ganador del experimento" — un comentario que miente sobre
      el codigo manda a la sesion siguiente a reponerlo.
- [x] **Bug de paso: el CTA del carrusel de tareas no era verde** — `generar-carrusel-tareas.py`
      declaraba la variable de verde pero **no la usaba**: su "COMUNIDAD" salia en negro,
      distinto al de los otros carruseles. El CTA es una regla del carril y tiene que
      verse igual siempre. Unificado.
- [ ] **Pendiente que abre esto:** las portadas de `chatbot`, `sistema` y `tareas` todavia
      llevan el subtitulo gris que el experimento de miniatura (P22) declaro peso muerto.
      Pasarlas al patron contexto-chico + remate-gigante exige **elegir el remate de cada
      una a mano** — es decision de copy, no mecanica.
