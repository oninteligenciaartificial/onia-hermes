# Aprendizaje · V2 «El sobre verde» (23-oct-2026)

Checkpoint PARCIAL por cambio de prioridad de Sergio (definir tema del workshop antes de seguir la landing). Esto prueba qué se estudió y dónde se aplicó; **no** prueba que el diseño guste ni que esté aprobado.

## 1. Inventario de skills (existencia comprobada con `wc -l`, nada instalado)
| Skill | Líneas | Leído | Qué cambió en este diseño |
|---|---|---|---|
| `.codex/skills/web-factory-design-director` | 45 | entera | Ruteo: Decidir/Aprender; una «lectura de diseño» antes de codear |
| `.codex/skills/impeccable` + `reference/brand.md`, `critique.md` (copias del repo) | 181 / 109 / 140 | entera / entera / procedimiento | Registro **brand**; lista de fuentes reflejo (DM Sans fuera); carril editorial-tipográfico a evitar; baneos (franja lateral, numeración, eyebrows, em dash, tarjetas iguales); detector `detect.mjs` corrido |
| `.codex/skills/ui-ux-pro-max` + `scripts/search.py` | 658 | reglas 4-7 y flujo; buscador **ejecutado** (local, solo CSV, sin red; sin `--persist`) | Orden de «Webinar Registration»; checklist de foco/contraste/responsive; **rechazado**: su paleta azul/naranja y Poppins (genérico) |
| `.codex/skills/taste-skill` | 1206 | §0, 1, 4.1-4.9, 9 (≈450 líneas) | Dials 8/6/4; hero que cabe en el viewport; sin eyebrow repetido; familias de layout distintas; imágenes reales, no SVG falso |
| `.codex/skills/web-factory-visual-intake` | 83 | entera | Hechos vs. interpretación; principios, no copiar identidad |
| `.codex/skills/frontend-ui-engineering` | 328 | solo índice (encabezados) | **No profundizado**: a11y y responsive se midieron con script propio |
| `.claude/skills/aprender-de-todo` | 128 | entera | Cadena fuente → principio → ubicación → captura (abajo) |
| `.claude/skills/web-factory-design-research` | 45 | entera | Ranking por ajuste/copy-risk; referencias = recetas, no clones |
| `.claude/skills/diseno-contenido-onia` | 361 | §0-5 (≈200 líneas) | **fotobn** = foto B/N + un objeto verde; galería primero; texto nunca dentro de imágenes; voseo en marca personal |
| Hermes `creative/claude-design` | 668 | superficie-first, variaciones, Slop Diagnostic, anti-slop, secuencia de Sergio (≈180 líneas) | Una superficie; dos heroes divergentes; capturas antes de elegir; diagnóstico antes de tratar |
| Hermes `creative/popular-web-designs` (+ `clay.md`, `framer.md`, `apple.md`, encabezados) | 213 | índice + 3 templates (portada y carácter) | Mecanismos, no tokens: Clay (escena + campo de color + interacción táctil), Apple (objeto sobre campo neutro), Framer (tipo compacta, **no** negro puro) |
| Hermes `creative/design-md` | 220 | encabezados | Formato de `DESIGN.md`; **no** se corrió su linter (no instalado/aprobado) |

No leí `frontend-ui-engineering` ni `design-md` más allá del índice; no los cuento como aplicados.

## 2. Diagnóstico de V1 (observable, con captura y detector)
Evidencia: `capturas/comparacion-V1-*.png`, `evidencia/detector/v1.json` (6 hallazgos: 6 em dashes, numeración 01-06, 3 franjas laterales de 4px, cadencia aforística).
1. **Misma plantilla tres veces.** A, B y C comparten fondo crema, etiqueta mono en mayúsculas, titular grotesco y columna centrada; cambia la estructura, no el mundo visual. Es el carril «editorial tipográfico» de Impeccable (mono + filetes + sin imagen).
2. **Casi sin imagen.** Un retrato chico; las fotos fotobn de la galería (existentes) no se usaron, contra la regla «el brief implica imagen, cero imágenes es un bug».
3. **Tablas y rótulos como diseño.** «Hoja de conteo», numeración 01-07, tabla del programa, filetes bajo cada fila: Slop Diagnostic 3 (cuadrícula uniforme) y 8 (pila centrada) más numeración decorativa.
4. **Tipografía por reflejo.** DM Sans + monoespaciada como «técnico» (la marca no es técnica); franjas laterales y em dashes en el copy.
5. **Decisión que lo causó:** se eligió la dirección por el *contenido* (hoja, eje, chat) sin elegir antes el material visual; el color y la tipografía llegaron después como «propuestas reversibles».
No afirmo qué le disgustó a Sergio: no lo dijo. Esto es lo medible.

## 3. Referencias (3 vivas, abiertas y capturadas; principio = mecanismo, no identidad)
| # | Fuente (captura) | Observado | Principio | Ubicación V2 | Captura V2 |
|---|---|---|---|---|---|
| R1 | Clay, `clay.com` (`evidencia/refs/r-clay-1-hero.png`, `-3.png`) | Escena ilustrada ocupa ~60% de la primera pantalla; el titular va debajo sobre campo de color; cada sección con panel de color y su escena | Una escena por idea; titular sobre campo plano, no sobre la imagen | Hero (foto arriba, titular sobre tinta), «Salís con», cierre | `hero-1440x900.png`, `pagina-completa-1440.png` |
| R2 | Apple Mac, `apple.com/mac` (`r-apple-1-hero.png`, `-3.png`) | Objeto fotografiado sobre campo neutro; titulares cortos de una línea; alternancia claro/gris | El objeto carga la idea; el campo es el color de la foto | Páginas sobre `--piedra` (gris real de las fotos), balanza sobre su propia pared | `demo-contador-1440.png` |
| R3 | Maven, `maven.com` (`r-maven-1-hero.png`) | Hechos de cada taller en una línea («6 semanas · empieza…»), instructor junto al título | Los hechos como línea de meta, no como tabla | Línea «Sábado 31 de octubre, 10:00 (La Paz), por Google Meet» y la barra con fecha | `hero-1440x900.png` |
| Contraejemplo | Webinarist (plantilla de Framer «Webinar Brutalist», `p-webinarist-*.png`) | Titular monumental + cinta + un botón de borde; **testimonios en cajas vacías**, monoespaciada en todo | Tipo grande funciona; cajas vacías y mono-disfraz no | Titular grande sí; sin mono ni cajas | — |

**Bloqueadas, no eludidas:** `land-book.com/design/landing-page?industry=education` y `thisisfab.com` devolvieron desafío de Cloudflare («Just a moment…», HTTP 403); no se intentó saltarlo. La página de Awwwards de FAB Workshop (2019) solo muestra un recorte de galería: no se infiere modernidad ni conversión. Webinarist: el primario es una plantilla de venta en Framer; el premio no prueba conversión.

## 4. Matriz de aplicación (regla → dónde → cómo se verifica)
| Regla aprendida | Skill origen | Dónde en V2 | Verificación |
|---|---|---|---|
| Foto B/N + un objeto verde, de galería | diseno-contenido-onia §0, §1 | las 5 escenas; `assets/img/ORIGEN.json` | capturas; hashes de origen |
| Fuente reflejo fuera; una familia elegida | impeccable brand | Archivo única (la de la página personal) | `QA.json` familiasUsadas = Archivo |
| Sin numeración, eyebrow, em dash, franja lateral | impeccable / taste §9 | todo el HTML/CSS | detector: 6 → 1 hallazgo |
| Hero cabe en el viewport, ≤4 elementos | taste §4.7 | hero | CTA a 572 px en 390; titular ≤3 líneas en 1440 |
| ≥4 familias de layout; zigzag máx 2 | taste §4.7 | hero overlay, foto fija + entregas, panel sobre foto, pestañas, mitad/mitad, retrato, franja, preguntas, cierre dividido | `pagina-completa-1440.png` |
| Una superficie, dos heroes divergentes antes de elegir | claude-design | A sobres / B balanza | `comparativa-hero-A-vs-B-*.png` |
| Texto nunca sobre foto | claude-design + contraste | todo el texto sobre sólidos | QA: 0 de 54 pares fallan |
| Movimiento con causa, reduced-motion | impeccable / ui-ux-pro-max | hero, descubrimiento, entregas | capturas con y sin movimiento |
| Estado de venta pausada visible sin dominar | encargo | franja fina arriba, pie, diálogo local | `cta-estado-local-*.png` |

## 5. Elección entre los dos heroes (interna)
A «los sobres»: literal con «contá lo que repetís» (pila) y «una prioridad» (el sobre verde en la bandeja). B «la balanza»: más gráfica, pero «pesar» no es lo que dice el titular. Elegí A; B queda como `?hero=balanza`. Es mi criterio, no una aprobación.

## 6. Límites y trade-offs estéticos (sin autocalificar)
- **No aprobada estéticamente.** Sergio ya rechazó A/B/C; esto es otra hipótesis que él y Hermes/Codex deben juzgar con las capturas.
- Las fotos son generadas con IA (galería de Sergio); las 5 escenas son pocas y se repiten en tema (objetos metálicos). Si el gusto de Sergio apunta a personas, V2 no lo cubre: solo hay un retrato (recortado, ya publicado).
- Verde y gris-piedra con tinta casi negra: sobrio y reconocible, pero puede leerse frío; el verde del botón (#0c7137) no es el verde de marca #00c661.
- «Tu primer paso» activo en verde sobre piedra tiene 3,39:1 (texto grande: pasa 3:1); el botón de foco `#00c661` sobre papel claro tiene 2,06:1 (por eso el aro es doble con tinta).
- El copy es el aprobado; el detector marca 1 cadencia aforística («Una tarea para empezar. No diez.») que viene del canon.
- No probado: móvil real, Firefox/Safari, lector de pantalla, Lighthouse. Pausa de 5 con 37-39 px de ancho (<44) y los inputs de 43 px de alto no llegan a 44 px de objetivo táctil.
- Esta versión pausó antes de revisar «Salís con» a 768/1024 con ojo propio: solo hay captura automática.
