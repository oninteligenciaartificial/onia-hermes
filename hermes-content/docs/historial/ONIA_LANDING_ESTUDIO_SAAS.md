# Estudio: cómo venden los SaaS de gestión todo-en-uno — y qué copia la landing de Onia

> **Por qué existe.** Sergio rechazó la landing v2 (2026-08): "Nada se te escapa" no vende
> nada, capturas estáticas horribles, animaciones que no eran las de Fanvue, información
> innecesaria, textos sin sentido de venta. Su directiva: *"tienes de ejemplo millones de
> startups que tienen este tipo de servicio, hazlo tal cual como ellos… busca realmente
> qué toman en cuenta… sencillo y fácil de explicar… apartados con videos interactivos
> con hyperframes"*. Este doc es esa investigación. La v1 volvió a producción; el
> rediseño se hace CON este estudio, en su propia sesión.
>
> **Cómo se midió.** Cada sitio pasó por nuestro instrumento
> (`web-factory/harvester/vision/extract_web_anatomy.mjs`, contrato en
> `web-factory/docs/ANATOMIA_DE_UNA_WEB.md`) el **2026-08-20**, más una pasada humana
> mirando capturas de cada pantalla y un inventario medido de cada `<video>` (duración,
> autoplay, tamaño, sección). Reportes crudos:
> `web-factory/data/references/design-sources/anatomia/{squareup-com, housecallpro-com,
> fresha-for-business, vagaro-pro, agendapro-com, kommo-com-es}.{json,md}`.

## Los 6 medidos (y los 2 que bloquearon)

| Sitio | URL medida | Qué es | Nota |
|---|---|---|---|
| Square | squareup.com | POS + gestión completa (EEUU) | 10,5 pantallas |
| Housecall Pro | housecallpro.com | Gestión para oficios del hogar | 8,5 pantallas |
| Fresha (negocio) | fresha.com/for-business | Gestión para salones/spas | 14,3 pantallas. ⚠️ fresha.com raíz es el **marketplace del consumidor**, no el pitch SaaS — se midió `/for-business`, que es el comparable |
| Vagaro (negocio) | sales.vagaro.com | Gestión belleza/bienestar/fitness | 11,3 pantallas |
| Agendapro | agendapro.com | Gestión citas LATAM (Chile) | 13,1 pantallas |
| Kommo | kommo.com/es | CRM de chats LATAM (sirvió precios en Bs) | 8,7 pantallas |

**Bloqueados y reemplazados** (2026-08-20): **Jobber** (getjobber.com) devolvió el muro
"Just a moment…" de Cloudflare y **Toast** (pos.toasttab.com) un CAPTCHA de verificación
humana — ninguno se midió ni se saltó el muro. Sus lugares los tomaron Vagaro y la
medición extra de Fresha `/for-business`.

---

## 1. El orden EXACTO de secciones (capa 5), sitio por sitio

Todo citado del sitio vivo, 2026-08-20. En **negrita** el tipo de media de cada sección.

### Square (squareup.com)
1. Hero: "Local legend or global icon. Make it big on your block." + `Get started` / `Contact sales` — **video montaje de clientes a pantalla completa, 18,4 s, autoplay/loop/mudo** (medido), con **barra de logos** (Ben & Jerry's, Shake Shack, SoFi Stadium…) al pie del mismo hero.
2. Hardware: carrusel de productos con precio — **fotos de producto** (fondo neutro).
3. "See your whole business click into place": acordeón de 5 trabajos (Take payments / Manage your team / Grow your customer base / Control your cash flow / Connect your apps) — **UI real del POS** al lado; los clips del carrusel de producto miden **6–9,8 s** c/u (medido).
4. "BUILT FOR EVERY INDUSTRY — Keep your business growing": 4 paneles expandibles (Food+Beverage / Retail / Beauty / Services) con "450,000+ food and beverage sellers" — **foto por rubro + un video de 16 s por panel** (medido). *Es un conmutador de rubros.*
5. "SQUARE AI — Make smart decisions, fast" — **foto editorial** con el teléfono.
6. Precios: 3 planes con monto en el home ($0 / $49 / $149 por sucursal, versión es-US).
7. Cierre: "Make your next move" + los mismos 2 CTAs del hero — **foto**.
+ Chip pegado todo el scroll: "Book a meeting with Square Sales".

### Housecall Pro (housecallpro.com)
1. Hero: "Everything to run and grow your business" + **formulario de 1 campo (email) + `Start Free Trial` + "No credit card required."** — **foto de un técnico + 3 notificaciones flotantes del producto** ("Job booked", "Rerouting complete", "Payment received"): el RESULTADO como push. Sub: "Powered by AI built from 100M+ jobs."
2. Carrusel de rubros: Home Cleaning, Electrical, HVAC, Plumbing, General Contractor… — **fotos por rubro**.
3. "Grow your business, not your to-do list": bento de 5 resultados (Manage jobs / Win work / Run your business / Get paid / Build trust) — cada tarjeta con **un ARTEFACTO de UI real flotando sobre foto** (la factura con botón Pay, el SMS de confirmación, la llamada transcrita). No pantallas enteras: el pedazo que prueba el resultado.
4. "Trusted by 200K+ Pros. Built for teams of 1 to 100+."
5. "Meet your AI Team inside Housecall Pro".
6. "Top-rated software for the trades" + "Customized solutions for 50+ industries".
7. "Hear from Housecall Pros": 4 testimonios con nombre de negocio — **video-testimonios embebidos (iframe)**.
8. Recursos + cierre "Get a $50 gift card" (formulario largo de demo: 9 campos).
+ El formulario email+`Start Free Trial` vive TAMBIÉN en la nav fija: el CTA nunca sale de pantalla.

### Fresha for Business (fresha.com/for-business, versión es)
1. Hero: "El software n.º 1 para salones y spas" + "Un software de reservas sencillo, flexible y eficaz para tu negocio." + `Get started now` / **`Watch an overview` (CTA de video)** — debajo, **captura REAL del calendario del producto** (escritorio + móvil lado a lado), colorida, sin retoque. El producto ES el hero.
2. "Una plataforma, infinitas posibilidades" — **UI real**.
3. "Todo lo que necesitas para gestionar tu negocio": 3 pestañas (Gestionar / Crece / Recibe pagos) — **UI real por pestaña**.
4. "Software todo en uno para gestionar tu negocio" — bullets con check + **loops de producto de 7 s dentro de marcos de teléfono** (medido: webm 202×438, autoplay/loop/mudo).
5. "El mejor marketplace para potenciar tu negocio" — **loop de 7 s** (medido).
6. "La plataforma mejor valorada en el sector": ~20 tarjetas de reseñas — **texto** + un **video con controles** (testimonio, no autoplay).
7. "Toma el control de tu negocio": **números de resultado en grande**: "26% más clientes · 89% menos inasistencias · 20% más ventas · 290% más propinas · 392% de retorno de la inversión · 41% más reservas fuera del horario de atención" (afirmaciones de Fresha, sin fuente visible en el home — se citan como copy, no como verdad).
8. "Nos comprometemos con tu éxito" (gestor de éxito, soporte 24/7) → FAQ → "La plataforma que se adapta a tu negocio" (14 tipos de negocio) → cierre "No pierdas más tiempo" → apps móviles.

### Vagaro (sales.vagaro.com)
1. Hero: "The #1 software & app for beauty, wellness, and fitness" + `Start Free Trial` — **video demo del producto en un marco de monitor CON botón de play** (el único de los 6 que pide clic para el video del hero).
2. "Featured in": prensa — Newsweek, Fast Company, People, Entrepreneur — **logos**.
3. "Built for everyone, from solopreneurs to enterprise." + números: "300K professionals trusting us · 162M+ appointments made in 2026 · 17 years in business · 99.9% uptime".
4. Bloques de funcionalidad y rubros (Business Types en nav) — **UI + fotos**.
5–7. Reseñas, recursos, cierre con `Start Free Trial`.

### Agendapro (agendapro.com) — LATAM
1. Hero: "El software n°1 para salones, spa, estética y salud" + "Organiza citas, cobra sin fricciones y haz crecer tu negocio. Hazlo simple, hazlo Pro." + **UN solo botón: `Prueba gratis`** — debajo, 5 pestañas (Agenda Online / Sitio de Reservas / Whatsapp & IA / Ventas y Pagos / Marketing) con **carrusel de dispositivos mostrando UI real** por pestaña.
2. Números inmediatos: "+20.000 negocios · +135.000 profesionales · +100 millones de citas · +20 países" + **logos de rating** (Capterra, Software Advice, GetApp).
3. "AgendaPro hace crecer tu negocio" + `Prueba gratis` → grilla de **14 rubros en tarjetas con foto** (Centros de estética… Clínicas).
4. "El único software que ordena tu negocio y acelera su crecimiento un 82%": funcionalidades agrupadas en 6 familias (citas, CRM, inventario, marketing, pagos, reportes) — **texto agrupado**, no las 40 features sueltas.
5. "Un universo de herramientas…" — **iconos**.
6. "Hazlo simple, hazlo Pro." + números de resultado: "82% menos inasistencias · 90% de ahorro en gestión · 320% de aumento en retorno de inversión · 40% más de clientes recurrentes · 70% más de reservas fuera de horario" ("Crecen nuestros clientes en 24 meses" — afirmación de Agendapro, sin fuente visible).
7. "Más de 20.000 negocios como el tuyo ya confían en AgendaPro" — logos/testimonios.
8. "Soporte 24/7 y acompañamiento gratis por siempre" → FAQ → "AgendaPro se adapta a tu negocio" (lista de rubros de nuevo) → cierre "Crea tu cuenta y empieza gratis".
Movimiento atado al scroll: SÍ (medido, 5 estados en 5 posiciones) — pero al servicio de entrar contenido, no decorativo.

### Kommo (kommo.com/es) — LATAM
1. Hero centrado: iconos de canales (WhatsApp/TikTok/Instagram/Telegram) sobre el H1 "Potencia tus chats, evita todo el caos" + "El CRM con IA todo en uno que automatiza chats, reservas y procesos en WhatsApp, TikTok e Instagram." + `Gratis por 14 días` — bajo el CTA, **confianza inmediata: "Meta Business Partner" + G2 4.6/5**.
2. Pestañas Capta / Automatiza / Escala / Analiza — **captura del producto en video: 32 s, loop, mudo** (capture.webm, medido).
3. "Respaldado por empresas en expansión en más de 100 países" — **logos**.
4. "Gestiónalo desde un solo lugar": 4 bloques de resultado (Atiende rápido con IA / Mueve leads con IA / Reserva citas con IA / Impulsa ventas con IA) — cada bloque con **un clip webm del flujo real: 5,6 s · 3,5 s · 4 s · 10 s** (medido: mudo, sin loop, se dispara al entrar en viewport). *El patrón exacto de "apartados con videos" que pidió Sergio.*
5. Bloque Kommo IA (features de IA).
6. "+100,000 clientes confían en nosotros" + 3 testimonios CON número, nombre, cargo y empresa: "Crecimos 16% en el canal de domicilios…" (Miguel Ángel Arroyo, King Papa) · "…impulsó nuestras ventas en un 67% el año pasado" (Rodrigo Batista, Benexia) · "el 100% de nuestras conversaciones están automatizadas" (Renato Molina, Superavi).
7. Precios EN el home: 4 planes con monto localizado (Bs 173/289/519 por usuario/mes + Empresarial) — geo-detectó Bolivia.
8. Cierre: "Vende más con automatizaciones potentes de IA" + `Gratis por 14 días` / `Habla con ventas`.

---

## 2. Cómo muestran el producto (lo que alimenta los HyperFrames)

Medido con el inventario de `<video>` (2026-08-20):

| Sitio | Hero | Bloques de producto | Duraciones medidas |
|---|---|---|---|
| Square | Video lifestyle 18,4 s autoplay | UI real + clips en carrusel | 6 · 6,1 · 6,1 · 9,8 s; rubros 16 s |
| Housecall Pro | Foto + artefactos de UI flotantes | Artefactos de UI (factura, SMS) estáticos | video solo en testimonios (iframe) |
| Fresha | **Captura real gigante del calendario** | Loops en marco de teléfono | 7 s · 7 s (autoplay/loop/mudo) |
| Vagaro | Video demo con botón play | UI + fotos | hero on-demand |
| Agendapro | Carrusel de dispositivos con UI real | Capturas estáticas agrupadas | 0 videos (todo screenshot) |
| Kommo | Screenshot + video 32 s bajo pestañas | **1 clip webm por bloque de resultado** | 3,5 · 4 · 5,6 · 10 s (mudo, in-view) |

**Lo que se repite (5 de 6): el producto REAL en la primera o segunda pantalla.** Fresha,
Agendapro, Kommo y Vagaro muestran la UI verdadera (calendario con citas, embudo con
clientes, chat contestando); Housecall Pro muestra sus artefactos (la notificación, la
factura). Solo Square abre con lifestyle — y aún él pone la UI real en la pantalla 3.

**El movimiento explica, no decora.** Los clips de Kommo y Fresha son el flujo del
producto (un chat que se contesta, un lead que avanza de columna, una cita que cae al
calendario) en 3,5–10 s, mudos, disparados al entrar en viewport. Nadie anima el layout
por deporte: Square y Kommo ni siquiera tienen movimiento atado al scroll (medido); los
dos que sí (Fresha, Agendapro) lo usan para entrar contenido.

**Capturas estáticas: nunca "a pelo".** Cuando no hay video, la captura va (a) dentro de
un marco de dispositivo (Agendapro, Fresha), (b) recortada al artefacto que prueba el
resultado (Housecall Pro), o (c) simplificada/anotada (Kommo agranda la tarjeta del lead
sobre el embudo). La captura entera de un dashboard sin marco ni foco — lo que Sergio
llamó "capturas estáticas horribles" — no la usa ninguno de los 6.

---

## 3. Los textos que venden (h1/h2 reales, citados 2026-08-20)

**Patrón A — Categoría + n°1 + rubro (3 de 6 = ley del rubro):**
- "El software n°1 para salones, spa, estética y salud" — Agendapro
- "El software n.º 1 para salones y spas" — Fresha /for-business
- "The #1 software & app for beauty, wellness, and fitness" — Vagaro

**Patrón B — Todo tu negocio en un lugar (5 de 6 lo dicen en h1 o h2 = ley):**
- "Everything to run and grow your business" — Housecall Pro (h1)
- "Power your entire business" — Square (title) · "Todo tu negocio, en un solo lugar" (h2, versión es)
- "All-in-one software to run your business" — Fresha (h2)
- "El CRM con IA todo en uno…" — Kommo (bajada del h1)
- "Un universo de herramientas para hacer crecer negocios de belleza y bienestar" — Agendapro (h2)

**Patrón C — Dolor nombrado con su objeto (h1 en Kommo; h2/tarjetas en el resto):**
- "Potencia tus chats, evita todo el caos" — Kommo (h1)
- "Get paid. Every payment collected, no chasing required." — Housecall Pro (tarjeta)
- "89% menos inasistencias" — Fresha · "82% menos inasistencias" — Agendapro (stats)
- "Grow your business, not your to-do list" — Housecall Pro (h2)

**La bajada siempre es 3 verbos con objeto:** "Organiza citas, cobra sin fricciones y haz
crecer tu negocio" (Agendapro) · "Save time, earn more, and build a top reputation"
(Housecall Pro) · "automatiza chats, reservas y procesos" (Kommo).

### Por qué "Nada se te escapa" falló, medido contra esto

1. **No dice qué es.** Los 6 líderes nombran la categoría ("software", "CRM") o el
   negocio completo en el primer segundo. "Nada se te escapa" podría ser un antivirus,
   un curso o una alarma.
2. **"Nada" no es un objeto.** Los líderes venden con sustantivos del dueño: citas,
   cobros, chats, clientes, inasistencias. La negación abstracta no activa ningún dolor
   concreto.
3. **Sin audiencia.** Los 3 titulares "#1" llevan el rubro DENTRO del h1. "Nada se te
   escapa" le habla a nadie.

**"Tu negocio no pierde citas ni cobros mientras dormís" (v1) está más cerca** porque ya
cumple C (dolor con objetos reales: perder citas, perder cobros) y suma el diferenciador
honesto de Onia (los agentes trabajan de noche). Lo que le falta del canon: la
**categoría** explícita al lado (los 6 la ponen en h1, kicker o bajada — "software de
gestión para tu rubro") y la bajada de 3 verbos. Lo que NO puede copiar: "el n°1" —
regla de la casa, cero clientes pagando ⇒ nada de rankings ni cifras fabricadas.

---

## 4. Qué NO tienen (tan ley como lo que sí)

- **Precio en el hero:** 0 de 6. El precio vive en su sección (Square, Kommo) o en el
  nav (los otros 4). Pero "Precios" está en la nav de los 6.
- **La lista completa de funciones:** 0 de 6. Agrupan todo en 3–6 trabajos/resultados.
  Agendapro tiene ~40 funcionalidades y las muestra en 6 familias plegadas.
- **"Quiénes somos" / equipo / historia / tecnología:** 0 de 6 en el home. A nadie le
  importa el stack: ni una palabra de arquitectura, IA "de última generación" ni nube.
- **Párrafos:** no existen. Frase de 1–2 líneas + bullets con check. La medida de línea
  de la bajada ronda 46–60 caracteres.
- **Animación decorativa:** el movimiento es del producto o de entrada. Square y Kommo:
  cero scroll-linked (medido). Nadie tiene parallax ornamental.
- **CTAs que compiten:** el primario es UNO y se repite idéntico (Housecall Pro repite
  "Start Free Trial" en nav+hero+secciones; Agendapro un solo botón en el hero).
- **Testimonios anónimos o logos truchos:** los testimonios llevan nombre, cargo y
  negocio (Kommo, Housecall Pro). Donde no hay quote, hay número agregado (+20.000
  negocios) o rating de terceros verificable (Capterra, G2).

**Lo que los 6 SÍ hacen y nosotros NO vamos a copiar: el peso.** Square 42,7 MB · Kommo
21 MB · Vagaro 10,9 MB · Fresha-biz 9 MB · Housecall Pro 8,5 MB (medido 2026-08-20).
Nuestra ley sigue: 150 KB JS / 30 KB CSS. Se copia la mecánica, nunca el presupuesto.

---

## 5. SÍNTESIS — el esqueleto por mayoría (regla: 3+ de 6 = ley)

| # | Sección | Evidencia | Media |
|---|---|---|---|
| 1 | **Hero**: h1 con categoría+audiencia o dolor+objeto · bajada de 3 verbos · UN CTA "Prueba gratis" (+ "sin tarjeta") · producto visible | 6/6 CTA en pantalla 1; 4/6 producto real en el hero | Captura real en marco o clip del producto |
| 2 | **Confianza inmediata** (misma pantalla o la siguiente): números agregados + logos/ratings | Agendapro, Vagaro, Kommo, Square = 4/6 pegado al hero | Logos + cifras grandes, estático |
| 3 | **3–5 bloques de resultado**, un trabajo por bloque, con el flujo del producto | 6/6 (Kommo 4, HCP 5, Fresha 3 pestañas, Square acordeón de 5) | **1 clip de 3,5–10 s por bloque** (HyperFrames) |
| 4 | **Rubros**: un producto, muchos rubros, elegís el tuyo | Square paneles+video 16 s, HCP carrusel 50+, Agendapro 14 tarjetas, Fresha 14 tipos, Vagaro nav = 5/6 | Conmutador interactivo con captura real por rubro |
| 5 | **Números de resultado** en grande | Fresha, Agendapro (bloque propio), Kommo (en testimonios), Vagaro (uptime/volumen) = 4/6 | Texto display |
| 6 | **Testimonios** con nombre y negocio | Kommo, HCP, Fresha, Vagaro = 4/6 | Tarjetas; video opcional CON controles |
| 7 | **Precios**: sección con montos (2/6) o al menos "Precios" en nav (6/6) | Square y Kommo en home; el resto a un clic | Tarjetas de plan |
| 8 | **Cierre**: una frase + el MISMO CTA del hero | 6/6 ("Make your next move", "No pierdas más tiempo", "Crea tu cuenta y empieza gratis") | Texto + CTA |

Rango de tamaño: 8,5–14,3 pantallas de escritorio, 7–13 secciones (medido). FAQ: solo
las 2 LATAM-belleza (Agendapro, Fresha) = no es ley, es opcional. Nav fija con CTA
siempre visible: 4/6 medido (HCP lleva el formulario entero en la nav) = ley.

### Dónde encajan los videos HyperFrames

La sección que pide video es la **#3 (bloques de resultado)** — y el formato ya está
medido: **un clip por bloque, 3,5–10 segundos, mudo, sin controles, disparado al entrar
en viewport, mostrando UN flujo real del producto** (Kommo es el molde exacto; Fresha
lo hace en loops de 7 s dentro de marcos de teléfono). El hero admite un segundo video
más largo (Square 18 s, Kommo 32 s) pero es opcional: Fresha y Agendapro abren con
captura estática real y les alcanza.

Con las capturas reales que ya tenemos, los tres clips de Onia se mapean así:

1. **Bloque "La agenda se llena sola"** → clip del panel: el día se puebla de citas,
   el recordatorio sale, la cita queda confirmada (captura real del panel).
2. **Bloque "El bot atiende por vos"** → clip del editor del chatbot: se escribe el
   horario en el formulario y el probador contesta al instante (captura real de
   Configuración → Chatbot, la misma que hoy está en el hero v2 como imagen fija).
3. **Bloque "Los cobros no se enfrían"** → clip del bot de WhatsApp contestando a un
   cliente y el cobro registrándose en el panel.

Producción: HyperFrames (HTML→video) con las capturas reales + cursor animado sobre la
UI, exactamente el estilo Kommo (UI simplificada, el elemento que importa agrandado).
Presupuesto por clip: webm mudo, apuntar a que los 3 clips juntos pesen menos que UNO
de los de Kommo (sus 5 suman ~15 MB de media — medido — y eso NO se copia).

### Dónde encaja la mecánica de Fanvue que Sergio sí quiere

El **conmutador de rubros pegado al scroll** (`components/landing-v2/rubros.tsx` +
`packages/blocks/src/sticky-niche-switcher.ts`) es exactamente la sección **#4 del
esqueleto** — y no es un invento nuestro: Square hace la misma idea con paneles
expandibles por industria (con un video de 16 s por panel), Agendapro con 14 tarjetas y
Housecall Pro con un carrusel de 50+ oficios. La versión Onia ya construida (un producto,
muchos rubros, banda que conmuta al scroll) se conserva tal cual, con sus reglas ya
escritas: una captura real por rubro y link solo donde la página del rubro existe.

### Checklist de 10 puntos para el rediseño (cada uno con su líder)

1. **H1 = categoría+audiencia o dolor con objeto; jamás abstracto.** (Agendapro/Fresha/
   Vagaro "software n°1 para [rubro]"; Kommo "Potencia tus chats, evita todo el caos".)
   Onia: v1 como base, sumándole la categoría en kicker o bajada. Sin "n°1": no fabricar.
2. **Bajada de 3 verbos con objeto, ≤60 caracteres de medida.** ("Organiza citas, cobra
   sin fricciones y haz crecer tu negocio" — Agendapro.)
3. **UN CTA primario "Prueba gratis X días" en pantalla 1, repetido idéntico hasta el
   cierre, con "sin tarjeta" al lado.** (HCP "No credit card required"; Kommo "Gratis
   por 14 días"; Agendapro un solo botón.)
4. **El producto real a la vista en pantalla 1–2:** captura verdadera del panel en marco
   de dispositivo, con datos vivos de demo. (Fresha abre con el calendario real;
   Agendapro con el carrusel de dispositivos.)
5. **Confianza pegada al hero — solo lo verificable.** (Kommo pone Meta Partner + G2
   bajo el CTA; Agendapro sus números + Capterra.) Onia sin clientes pagando: rubros
   vivos en producción, WhatsApp oficial, datos exportables — cero testimonios
   inventados (regla de la casa).
6. **3–5 bloques de resultado, uno por trabajo, cada uno con su clip HyperFrames de
   3,5–10 s mudo in-view.** (Kommo: 4 bloques, clips medidos de 3,5/4/5,6/10 s;
   Fresha: loops de 7 s.)
7. **Sección de rubros = el conmutador ya construido, con captura real por rubro.**
   (Square industry panels; Agendapro 14 tarjetas; HCP 50+ oficios.)
8. **Números solo con fuente propia y verificable; los de resultado de clientes recién
   cuando existan clientes.** (Los líderes los usan — Fresha "89% menos inasistencias" —
   pero sin fuente visible: se copia el FORMATO grande, no la impostura.)
9. **Nada de: lista completa de features, quiénes somos, stack técnico, párrafos.**
   (0 de 6 los tienen en el home.) Todo se agrupa en trabajos; el detalle vive en
   páginas interiores.
10. **Cierre de una frase + mismo CTA, y "Precios" siempre a un clic en la nav fija.**
    ("Make your next move" — Square; "No pierdas más tiempo" — Fresha; nav fija con CTA
    en 4/6.) Presupuesto de la casa intacto: 150 KB JS / 30 KB CSS — los 6 líderes lo
    revientan (8,5–42,7 MB medidos) y ahí NO se los imita.

---

## Qué NO se pudo medir

- **Jobber y Toast**: muro Cloudflare/CAPTCHA (2026-08-20). No se midieron; se declararon
  y se reemplazaron. No se intentó saltar ningún muro.
- **El paso 2 de los funnels** (qué pasa tras `Start Free Trial`): detrás de registro.
- **Si las cifras de resultado de Fresha/Agendapro son reales**: en el home no citan
  fuente. Acá se tratan como copy, y por la regla de la casa ninguna se repite como
  verdad propia.
- **El detector de secciones del instrumento** subcuenta en sitios con wrappers profundos
  (Square reportó 3 secciones, Kommo 2): la capa 5 de este doc salió de la pasada humana
  con capturas, que es exactamente para lo que el contrato la exige.
- **Interacciones vivas** (hover de los conmutadores, el paso 2 de los tabs): se midió
  DOM y capturas por pantalla, no sesión grabada.
