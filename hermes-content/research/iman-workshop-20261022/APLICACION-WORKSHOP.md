# Aplicación original al taller «Auditá tu negocio con IA» — borrador privado para revisión de Codex

> **Estado:** borrador privado del 22-oct-2026 (La Paz). No se publicó, envió ni grabó nada. No cambia `TALLER_31_OCT.md`, que sigue siendo la única fuente de la oferta; lo que choque con él queda marcado como **ALTERNATIVA PENDIENTE DE DECISIÓN**.
> **Venta:** sigue pausada (handoff del 20-oct). Todo lo de abajo se lee «relativo a la reapertura» (R). No se supone que el 21-oct ocurrió.
> **Evidencia:** `fuentes.json` (14 URLs únicas) y `evidencia/` (16 capturas). **Corrección única del 22-oct (hallazgos de Codex):** solo las **capturas** de `evidencia/` son evidencia inspeccionable. Todo lo que aquí diga «DOM», «CSS», «texto leído», fechas completas, capítulos, enlaces de oficialidad o conteos de elementos es **reportado por Claude, no verificado independientemente**: los extractos no se conservaron como archivo y no se reconstruyen. Cada afirmación sobre Gadzhi lleva una etiqueta: **[OBS]** observado por mí hoy en página o captura (lo que no está en una captura es «reportado, no verificado»), **[DEC]** declarado por la fuente (claim sin auditar), **[INF]** inferencia mía, **[PROP]** propuesta para el taller.

## 0. Qué se observó de verdad y qué no (léase antes de usar el resto)

| Superficie | Estado | Qué quedó |
|---|---|---|
| iman-gadzhi.com (S01) | observado (desktop) | Captura del hero; enlaces cruzados a IG, YouTube y X **[OBS]** → esas tres cuentas son las oficiales. |
| Instagram (S02) | **parcial** | Cabecera y bio (texto reportado) bajo un modal de registro; no se abrió ningún reel. |
| YouTube canal + videos (S03, S04) | observado | 6,23 M, 486 videos, 14 tarjetas leídas. |
| X (S05) | **parcial** | Perfil y texto de 5 posts bajo modal; ningún video reproducido. |
| Consulting.com (S06, S07) | observado | Hero con captura, resto reportado; agenda de llamada sin cupos. |
| Monetise (S08) | observado | VSL/oferta (texto reportado) + 2 capturas; video visto en un fotograma. |
| AI Income Challenge (S09) | observado | Landing del link de la bio, hero capturado. |
| Educate.io (S10) | parcial | Solo redirección (curl) a Consulting.com. |
| TikTok | **no oficial confirmado** | Ninguna cuenta enlazada desde sitio ni perfiles; no se abrió. |
| Móvil real | **no verificado** | La emulación no cambió el viewport. Todo lo «móvil» de Gadzhi es desconocido; lo móvil del §5 es propuesta mía. |
| Videos | **parcial** | Tráiler AIC V6: ~117 s de 313 s con subtítulos (3 fotogramas útiles). Los demás: solo metadatos/capítulos. Sin transcripción (yt-dlp dio HTTP 429). |

**Impacto:** el análisis de *guion* y *edición* de Gadzhi hoy es débil: sale de la ficha previa del 8/20-oct (**histórica, por transcripción, no por video visto**) más 3 fotogramas nuevos, cuyos instantes (≈27/76/117 s) son reportados, no visibles en las capturas. El análisis de *oferta, embudo, UI de páginas, CTA y arquitectura de campaña* sí está respaldado por observación directa de hoy.

## 1. Lo observado hoy, por capas

### 1.1 Ecosistema y embudo (mezcla: cada línea lleva su etiqueta)
- **[OBS, reportado]** Recorrido observado: **bio de IG (`link.consulting.com/ig-bio-aic`) → redirección con UTM de Instagram → landing del reto gratis (event.monetise.com), S09**. La bio de YouTube apunta a `/yt-bio-aic` (reportado; no se siguió ese enlace). **No se observó** el paso siguiente hacia una oferta de pago: la «cadena reto gratis → oferta de pago» es **[INF]**, no recorrida (no se abrió el formulario ni se hizo ningún registro).
- **[OBS, reportado]** En los **cuatro videos de la muestra** (S11–S14) la descripción visible lleva un CTA al Reto gratis de nov-2026; en S14 (publicado 18-ago) también. **[INF]** Que el CTA de S14 haya sido editado después no está demostrado: solo se sabe que hoy dice eso; podría estar desde antes o haberse cambiado. No se generaliza a «cada video» del canal.
- El tráiler del reto es un contenido más del canal (S11), con 401 mil vistas a 10 días.
- Consulting.com (S06) separa por nivel: Monetise (principiantes), UpLevel (consultoría), Quantum (≥ $20K/mes), Masterminds (por invitación). El único CTA de la portada es «Apply to Work With Us», repetido **3 veces** con el mismo destino `/assessment-call` (reportado). La página de agenda (S07) hoy muestra calendario sin disponibilidad.

### 1.2 Pitch y oferta **[OBS] el texto; [DEC] las cifras**
- Landing del reto (S09): barra superior fija con CTA + chip rojo «LIVE VIRTUAL EVENT: NOV 7TH – NOV 15TH» + titular «I Challenge YOU To Build A $373/Day AI Side Hustle In Just 5 Days» + prueba social en una línea + CTA «SAVE MY FREE SPOT» + dos micro-eliminadores de objeción («No showing your face», «No experience needed»). Luego: cinta de datos del aliado, agenda de 5 episodios con fecha y hora, historial de cifras escalonado ($8.9M → $15M → $31M → $41M → $155M «tracked», todo **[DEC]**), temario con 7 bloques con nombre y CTA final repetido.
- Monetise (S08): titular con promesa + objeciones negadas entre paréntesis, garantía en la primera pantalla («10x… or we keep working with you until you do*» con asterisco), VSL, lista de 9 testimonios con nombre y país en el cuerpo, apilado «OFFER 1–4» con «Value:» por ítem y «Total: $19,458+», garantía de 7 días, FAQ. Precio no visible en el texto leído.
- Cada bloque de contenido nombra un mecanismo con marca propia (Synthesise AI, Digital Product Formula 2.0, ListKit, Perfect Product Insurance Policy) **[OBS]**.

### 1.3 Diseño/UI — composición **[OBS por captura]**; familias, colores y valores CSS **reportados por Claude, no verificados independientemente** (sin extracto conservado)
| Superficie | Composición (captura) | Tipografía (reportada, sin extracto) | Color / CTA |
|---|---|---|---|
| iman-gadzhi.com | Foto de espalda frente al mar a pantalla completa, nombre en serif gigante sobre la foto, menú de 2 líneas, flecha de scroll. Cero CTA en el primer pantallazo. | `h1` «Reckless Neue Medium» 160 px; resto Inter y «Mona Sans Condensed SemiBold» | Foto fría y oscura; fondo de página rgb(0,0,0) |
| consulting.com | Fondo negro con humo gris; un titular, una línea de prueba, un botón. Barra superior fija. | Titular serif; subtítulo sans (no se midió la familia exacta del titular → **aproximado**) | Botón con degradé ámbar (aprox., por captura) sobre negro |
| monetise.com/waitlist | Barra con logo + CTA amarillo arriba a la derecha, titular con palabras clave en amarillo, video centrado, botón flotante de WhatsApp. | Manrope + Inter (reportado) | CTA `linear-gradient(290deg, rgb(254,255,173)… rgb(255,251,0)…)` texto negro (DOM) |
| landing del reto | Barra superior lima, hero a dos columnas (texto + retrato recortado con degradé lima), chip de fecha, botón grande blanco con halo. | CTA en «Mounsta Regular» (reportado) | CTA/acento `rgb(208,254,22)` sobre casi negro, texto negro (DOM) |

**[INF]** Las páginas comerciales usan la **misma regla**: fondo oscuro, **un** color de acento muy saturado reservado al CTA y a 2-3 palabras clave, y, en dos de las tres (Monetise y el reto), un retrato del emisor; Consulting.com no lo tiene en el hero. La portada personal, en cambio, no vende: es institucional. **[INF]** El stack (la página de agenda incluye un iframe de `framer.com`) sugiere Framer, no verificado.

### 1.4 Contenido (muestra de seis; detalle en `fuentes.json › piezas_muestra_seis`)
| # | Pieza (fuente) | Fecha | Formato | Qué se accedió | Hook / estructura / CTA **[OBS]** | Conexión con la oferta |
|---|---|---|---|---|---|---|
| 1 | Tráiler AIC V6 (S11) | 12-oct (reportado) | pitch, 5:14 | 3 fotogramas de la reproducción (`11-yt-trailer-AIC-V6-tras-anuncio.png`, `11-trailer-frame-1.png`, `11-trailer-frame-2.png`); los instantes ≈27, 76 y 117 s son **reportados por Claude, no visibles en las capturas** | **Hook inicial: no observado** (no se vio el segundo 0). Fragmentos vistos: un plano nocturno de una torre con letras verticales y subtítulo «Almaty Tower or city tower is wild»; otro fragmento con subtítulo «…online using AI. And I'm about to show you three ways to make money with AI in» y tres cajas numeradas. Prueba y cierre: **no observados**. CTA: solo el de la descripción (reportado). | Presentado como anuncio del reto en el título/descripción; **[INF]** el resto. |
| 2 | Claude, 24 min (S12) | 21-oct (reportado) | tutorial | 1 fotograma (`10-yt-LqCPwQ1IcA4.png`) + metadatos reportados | Hook inicial: **no observado**. Estructura y prueba: **no observadas**. Fotograma: gráfico «Expensive Burden / Powerful Tool» con subtítulo doblado. CTA: solo el de la descripción (reportado). | CTA al reto en descripción (reportado). |
| 3 | ChatGPT, 28 min (S14) | 18-ago (reportado) | tutorial | título + capítulos (reportados, sin captura de contenido) | Hook: **no observado**. Estructura: 11 capítulos (reportado). Prueba: **no observada**. | La descripción de hoy lleva CTA al reto; que se haya editado después es **[INF]**. |
| 4 | Construir un imperio (S13) | 15-oct (reportado) | contenido de marca | metadatos + capítulos (reportados); la captura no muestra contenido | Hook, estructura real, prueba y CTA del video: **no observados**. Solo título, capítulos y descripción (reportados). | La descripción lo enlaza con el reto (reportado). |
| 5 | Post fijado en X (S05) | 12-oct (visible en `08-x-com-gadzhiiman.png`) | corto (video 0:22, reportado) | texto del post; la captura muestra el inicio del post bajo un modal | Hook del video, estructura, prueba: **no observados** (video no reproducido). Texto inicial visible en la captura: «I've been keeping this a secret for a while…». CTA: **no observado**. | **[INF]** autoridad/anuncio de inversión. |
| 6 | VSL de Monetise (S08) | sin fecha visible | pitch largo | 1 fotograma en `06-monetise-waitlist.png` (subtítulo en inglés) | Titular de la página visible en la captura. Hook, estructura, prueba y CTA **del video**: **no observados**. | Página de oferta de pago (captura + texto reportado). |

Lo que **no** puedo afirmar con esto: duración exacta de planos, ritmo de cortes, frases del guion más allá de 3 subtítulos, ni qué parte del tutorial retiene audiencia.

### 1.5 Contraste con la ficha previa (histórica, no re-medida)
`2026-10-20-gadzhi-vender-valor-psicologia.md` y `2026-10-08-referente-gadzhi.md` analizaban **transcripción y mediciones históricas**. Hoy se agrega la capa que faltaba: perfiles, link de la bio, landing de reto, páginas y CTA reales. Lo que sigue en pie de la ficha anterior es candidato, no patrón probado.

## 2. Posicionamiento y promesa (dentro de la oferta vigente)

- **Duración (canon §1):** 90 minutos de contenido en dos bloques de 45, **más** una pausa de 5 entre ellos; el tiempo transcurrido es mayor que 90 min, y al volver se entra al mismo link. Aquí «90 min» siempre significa contenido.
- **Escalera (canon §2):** 50 cupos: los primeros 15 a Bs 50, los siguientes 20 a Bs 60 y los últimos 15 a Bs 70. El precio es el del momento en que se **acredita** el pago, no el de la consulta ni el del chat; el escalón cambia a mano al acreditarse los pagos 15 y 35.
- **Promesa canónica (sin cambios):** en 90 min de contenido en vivo por Meet armás, con tu propio negocio, tu lista de tareas repetidas y lo que te cuestan al mes, tu prioridad (una tarea) y tu primer paso.
- **Para quién sí:** dueños y equipos pequeños que repiten tareas (responder lo mismo, pasar datos, armar informes) y quieren ver cuánto les cuestan antes de comprar nada.
- **Para quién no:** negocios sin tareas repetidas, quien busca certificado, quien quiere que otro lo haga por él. (Texto de §1 de TALLER_31_OCT.)
- **Problema:** esas tareas no se cuentan, así que nadie sabe su costo.
- **Mecanismo [PROP]:** *«contar antes de automatizar»*: un inventario de tareas con tiempo y frecuencia, una prioridad y un paso. No promete ahorro.
- **Diferencia con Gadzhi [INF]:** él vende **un resultado de dinero** (ingresos) con prueba de volumen; el taller vende **claridad sobre el propio negocio** en una sola sesión, con salida entregable en el momento. Ahí el taller es más defendible, no menos: la prueba es lo que sale de la sesión, no un testimonio.
- **Evidencia propia necesaria (hoy no existe en el repo):** un caso real de Sergio con tareas y tiempos medidos (con permiso del negocio o propio), 3 capturas de una auditoría hecha en vivo, y quién ya reservó (solo con pagos acreditados). Sin eso, la prueba se limita a mostrar el método.
- **No usar:** cifras de Gadzhi, «sin experiencia / sin mostrar la cara», claims de ingresos, ni que sus resultados aplican a Bolivia.

## 3. Pitch y cierre (voseo; borradores, no enviados)

### 3.1 Pitch de 60–90 s (~190 palabras, ≈ 75 s hablado) — solo si la venta reabre
> «Si tenés un negocio, cada semana hacés las mismas tareas: contestar lo mismo, pasar datos de un lado a otro, armar el mismo informe. Casi nadie las cuenta, y por eso no sabés cuánto te cuestan.
> El sábado 31 de octubre a las 10 de la mañana, hora de La Paz, hago un taller en vivo de 90 minutos por Meet. Con tu propio negocio armás tres cosas: la lista de tus tareas repetidas y lo que te cuestan al mes, una prioridad para empezar y tu primer paso.
> No es para vos si tu negocio no repite tareas, si buscás un certificado o si querés que otro lo haga por vos. Y no te prometo ahorro ni resultados: te llevás claridad y un paso concreto.
> Son 50 cupos: los primeros 15 a 50 bolivianos, los siguientes 20 a 60 y los últimos 15 a 70, según cuándo se acredite tu pago. Entrá al link en mi perfil: ahí está la página con el botón para escribirme por WhatsApp, y yo te confirmo el cupo.»

**CTA realizable:** «Link en mi perfil» (canon de §4 de TALLER_31_OCT). Recorrido: bio de Instagram → `/auditoria` → botón a WhatsApp personal de Sergio → QR (§5). El botón de WhatsApp vive en la página, no en el perfil. Si la reapertura cambia la fecha, **ALTERNATIVA PENDIENTE**: reescribir fecha y escalón sin tocar el resto.

### 3.2 Cierre de la clase gratis (35 min, ~45 s) — fecha de la clase relativa a R
> «Lo que hicimos hoy fue el primer pasito: elegiste una tarea y la contaste. En el taller hacés eso con todo tu negocio y salís con tu lista, tu prioridad y tu primer paso. Hoy quedan [N cupos reales] y el precio del momento es [precio vigente]. Si te sirvió, entrá al link en mi perfil. Si no es para vos todavía, quedate con la lista que armaste hoy; es tuya.»

Regla: completar `[N]` y `[precio]` con datos reales de `SEGUIMIENTO-LEADS.md`; si no hay dato, no se dice.

## 4. Tres guiones de reel originales (borradores; **no hay prueba grabada ni se afirma que existe**)

> Los 3 guiones del PR #240 (`docs/orquesta/marca/234.md`) siguen siendo los vigentes para grabar; estos son **alternativas** para comparar, no reemplazos. Un solo CTA por pieza: «Link en mi perfil».

### Reel A — «Contá tus tareas» (25–30 s)
- **Hook (0–3 s), texto en pantalla + voz:** «¿Cuántas veces por semana contestás lo mismo?»
- **Demostración (3–22 s):** pantalla con una hoja de 5 filas (tarea / veces por semana / minutos); Sergio completa 3 filas con tareas típicas de un negocio chico y calcula horas al mes **con números marcados «ejemplo»**.
- **Planos/edición:** plano medio cámara a la altura de los ojos + inserto de pantalla; cortes cada 3–4 s; subtítulos grandes; sin música reconocible (música propia o libre de derechos).
- **CTA (22–28 s):** «En el taller del sábado 31 hacés esta lista con tu negocio. Link en mi perfil.» (venta reabierta).

### Reel B — «El costo que no ves» (30 s)
- **Hook:** «No es lo que cobrás. Es lo que repetís.»
- **Demostración:** tres tarjetas animadas (tarea → veces → costo mensual) con un ejemplo **inventado y rotulado «ejemplo»**, no un cliente.
- **Planos/edición:** solo gráficos + voz en off, ritmo 2 s por tarjeta, un único subrayado de color de acento de la marca de Sergio (no lima ni amarillo).
- **CTA:** «Link en mi perfil.»

### Reel C — «Una sola prioridad» (30–35 s)
- **Hook:** «Si querés automatizar todo, no automatizás nada.»
- **Demostración:** de 5 tareas en pantalla, tachar 4 con un criterio simple (frecuencia × minutos × qué tan estándar es) y dejar una; mostrar «primer paso: …» en una frase.
- **Planos/edición:** plano de pantalla + cara; el tachado como corte en seco; cierre con la frase de prioridad.
- **CTA:** «Esa elección la hacemos juntos el sábado 31. Link en mi perfil.»

**Límite:** ninguno promete ahorro; los números son ejemplos rotulados. **Pendiente:** Sergio decide si graba estas o las del PR #240.

## 5. Tres historias y una conversación de WhatsApp (borradores, no enviados)

### Historias (secuencia de 3 en un mismo día)
1. **Pregunta:** «¿Qué tarea repetís más veces por semana en tu negocio?» con sticker de pregunta.
2. **Muestra:** foto de una hoja con tu propio ejemplo; texto «Contarlo es el primer paso».
3. **Oferta:** «Sábado 31, 10:00, 90 min por Meet. Link en mi perfil.» + cupos reales **solo si hay dato**. (Fecha/hora relativas a la reapertura; no se ofrece si el cierre vigente ya pasó.)

### WhatsApp (1 a 1, lo manda Sergio a quien preguntó; tono vos)
> **Sergio:** Hola [nombre], vi que me preguntaste por el taller. ¿Qué tarea repetís más en tu negocio?
> **[Persona]:** (responde)
> **Sergio:** Esa justo la armamos en el taller del sábado 31 a las 10:00: son 90 minutos por Meet y te llevás tu lista de tareas, tu prioridad y tu primer paso. Los cupos son 50: 15 a Bs 50, 20 a Bs 60 y 15 a Bs 70, según cuándo se acredite tu pago. ¿Querés tu cupo?
> **[Si dice sí]:** Te paso el QR y apenas se acredite te confirmo el cupo.

No se envía nada ni se inventa disponibilidad; el QR, titular y devolución dependen de Leslie Mercado Moreno (condiciones 4 y 5 de §3).

## 6. Arquitectura de landing (no se publicó nada ni se tocó `sitio-sergiourcullo`)

### Orden de secciones y por qué
| # | Sección | Por qué existe | Principio observado |
|---|---|---|---|
| 1 | Barra superior fija con fecha + botón | La acción siempre a un toque | Landing del reto: barra fija con CTA y chip de fecha **[OBS]** |
| 2 | Hero: titular de promesa + línea de para quién + botón de WhatsApp | Un mensaje, una acción | Consulting.com: un titular, una prueba, un botón **[OBS]** |
| 3 | «Salís con»: 3 entregables (lista, prioridad, primer paso) | Prueba = lo que se lleva, no un testimonio | Agenda numerada de episodios con qué se aprende en cada uno **[OBS]** |
| 4 | Cómo es el taller: 90 min de contenido (2 × 45) + pausa de 5 | Quita incertidumbre de formato | Agenda por episodio con fecha/hora **[OBS]** |
| 5 | Para quién sí / no | Filtra y baja devoluciones | Gadzhi solo niega objeciones («no face, no experience») **[OBS]**; acá se invierte: se dicen límites reales **[PROP]** |
| 6 | Escalera: 15 a Bs 50, 20 a Bs 60, 15 a Bs 70, según pago acreditado; cupos reales | Urgencia verdadera | Gadzhi usa «ACT FAST» y cifras de volumen **[OBS]**; aquí solo cupos acreditados **[PROP]** |
| 7 | Sobre Sergio y evidencia propia | Confianza local | Retrato del emisor en Monetise y en el reto, no en Consulting.com **[OBS]**; el material propio aún falta |
| 8 | Condición de devolución (texto pendiente de Leslie) | Honestidad | Gadzhi pone garantía en la primera pantalla con asterisco **[OBS]**; acá no se promete más que lo vigente |
| 9 | FAQ breve | Objeciones | Monetise tiene FAQ al final **[OBS]** |
| 10 | CTA final repetido | Segundo punto de acción | Consulting.com repite el mismo CTA 3 veces **[OBS]** |

### Wireframe textual
```
DESKTOP (1440)                                  MÓVIL (390) [PROP, no verificado en Gadzhi]
[barra fija: Taller 31-oct · 10:00 · [Quiero mi cupo]]   [barra fija compacta: [Quiero mi cupo]]
┌────────────────────────────┬──────────────┐   ┌────────────────────┐
│ H1: promesa (1 línea)      │ retrato/foto │   │ H1 + línea para quién │
│ línea: para quién          │ de Sergio    │   │ [Quiero mi cupo]      │
│ [Quiero mi cupo]           │              │   │ retrato (debajo)      │
└────────────────────────────┴──────────────┘   └────────────────────┘
[Salís con: 3 tarjetas en fila]                 [3 tarjetas apiladas]
[Cómo son los 90 min: 2 bloques + pausa]        [timeline vertical]
[Para quién sí | Para quién no]                 [dos bloques apilados]
[15×Bs50 · 20×Bs60 · 15×Bs70 + «Quedan N»]                [tarjetas apiladas]
[Sobre Sergio] [Devolución] [FAQ] [CTA final]   [acordeón] [CTA final]
```
**Jerarquía:** 1) promesa y fecha, 2) botón, 3) entregables, 4) límites. El botón va en `https://wa.me/591<NÚMERO>?text=…` (canon). Cualquier cambio de estilo es propuesta para la **v4 del 17-oct** (`auditoria/index.html`), que sigue siendo la página vigente.

**Estilo [PROP]:** fondo oscuro o claro según la marca de Sergio, **un** color de acento para el botón y 2-3 palabras clave. No usar lima/amarillo/ámbar de Gadzhi ni retrato recortado con degradé; no copiar identidad.

## 7. Secuencia de lanzamiento relativa a la reapertura (R) y mediciones

> Mientras la venta siga pausada, nada de esto se publica. Se respeta el calendario de `TALLER_31_OCT.md §4` como referencia; si R no es el 21-oct, la fecha del taller es una **DECISIÓN PENDIENTE de Sergio** (no se cambia aquí).

| Día | Pieza (propuesta) | Medición real necesaria |
|---|---|---|
| R | Página con botón + historia 1 + 1.er lote de mensajes 1 a 1 | clics al botón / chats abiertos (WhatsApp), no «vistas» |
| R+1 | Historias con pregunta («¿qué tarea te come más horas?») + pauta (Bs 300 ya aprobada) | respuestas a la pregunta, costo por chat abierto |
| R+2 | Carrusel 2 «qué sale» + Chequeo 1 | pagos acreditados vs. umbrales de §7 |
| R+3/R+5/R+7 | Reels A/B/C (o los del PR #240) | alcance, guardados, clics a la bio |
| R+6 | Clase gratis (35 min), **solo si cae antes del cierre vigente** | asistentes y cuántos pagan en las 24 h siguientes |
| Cierre vigente: **jue 29-oct, 20:00** | Historias de cierre, recordatorio 1 a 1 a quien preguntó | pagos acreditados totales |

**Límite de la secuencia:** todo lo anterior debe caber antes del cierre vigente (jue 29-oct, 20:00 La Paz) y de los 6 pagos mínimos de ese corte. R+6/R+7 **no se desplazan automáticamente** más allá del cierre: si R cae tarde, hay que comprimir o quitar piezas; mover el cierre, la fecha o el mínimo es **decisión pendiente de Sergio**, no se asume aquí.

**Mediciones que hoy no existen y hay que armar:** origen de cada chat (la planilla `SEGUIMIENTO-LEADS.md` ya tiene «origen»), pagos acreditados por escalón, y clics reales al botón (**ALTERNATIVA PENDIENTE**: un enlace con UTM propio; no implementado).
**No se proyecta** conversión ni resultado: la tasa de 3 % de TALLER_31_OCT es un supuesto de planificación, no medición.
**Sin ampliar presupuesto:** solo los Bs 300 de pauta ya decididos.

## 8. Tabla fuente → principio → aplicación → límite

| Fuente | Principio | Aplicación exacta al taller | Límite |
|---|---|---|---|
| S09 landing del reto | Un hero con fecha, promesa y acción | Hero con «sáb 31 · 10:00 · 90 min» y botón a WhatsApp dentro de `/auditoria` | Su fecha es de un evento gratis; el nuestro es de pago |
| S09 | Agenda por sesión con «qué aprendés» | Sección «cómo son los 90 min» con 2 bloques | No prometer más de lo de §1 de TALLER_31_OCT |
| S06 | CTA único repetido | Mismo botón arriba, a la mitad y al final | Consulting.com apunta a llamadas de pago alto |
| S09/S12/S13/S14 | Cada pieza termina en el mismo próximo paso | «Link en mi perfil» en todas las piezas | Un CTA por día; el DM por comentario no está probado |
| S12/S14 | Títulos con promesa de tiempo | «Contá tus tareas en 10 minutos» solo si se mide | No usar la fórmula «Dame N minutos…» (reconocible) |
| S08 | Garantía visible | Mostrar la condición de devolución vigente | No dar asesoría legal; texto pendiente de Leslie |
| S08 | Mecanismo con nombre | Nombrar «contar antes de automatizar» | No inventar marca ni «Mapa» (plantilla inexistente) |
| S08/S09 | Objeciones negadas | Decir qué NO es el taller | Gadzhi niega barreras; acá se dicen límites verdaderos |
| S05/S09 | Autoridad por asociación | No aplicable | Sin socios equivalentes; no inventar |
| S02/S03/S05 | Ecosistema por cuenta con un solo enlace | La bio de IG apunta a `/auditoria` | Ya vigente en TALLER_31_OCT |

### Las 12 dimensiones de `aprender-de-todo` (estado honesto)
| Dimensión | Qué se aprendió | Calidad de evidencia |
|---|---|---|
| Patrones | Bio → link con UTM → landing gratis (observado); paso a pago **[INF]**; CTA de reto presente en los 4 videos de la muestra | Un solo emisor y recorrido parcial: candidato, no patrón |
| Colores y paleta | Fondo oscuro + un acento saturado en el CTA; lima `rgb(208,254,22)` y amarillo `rgb(255,251,0)` **reportados**; el resto aproximado | Reportado, sin extracto; la captura solo confirma apariencia |
| Tipografía | Reckless Neue + Mona Sans/Inter (personal), Manrope/Inter (Monetise), Mounsta (CTA del reto) | Reportado por Claude, no verificado independientemente |
| Edición y montaje | Sin timeline: 3 fotogramas del tráiler | **Hueco**: no se obtuvo |
| Estilo visual | Retrato del emisor + degradé de acento; foto cinematográfica en la personal | OBS por captura |
| Estructura de contenido | Capítulos y CTA en descripción (reportados); títulos de promesa de tiempo | Metadatos reportados; cuerpo de los videos no visto |
| Guion y gancho | Solo subtítulos de 2–3 fragmentos del tráiler; hook inicial no observado | **Débil** |
| Idioma y tono | Páginas en inglés, directo, mucho «YOU»; videos con doblaje automático en español | OBS parcial |
| UI y UX | Barra fija, CTA repetido, chip de fecha, WhatsApp flotante en Monetise | OBS desktop; móvil no verificado |
| Frontend | Fuentes y CSS de CTA reportados (sin extracto); Framer **inferido** | INF, reportado |
| Backend y arquitectura | No aplicable; solo la cadena UTM → landing visible | OBS parcial |
| Negocio y oferta | Reto gratis (observado) y oferta apilada de Monetise (texto reportado, captura parcial); relación entre ambas **[INF]** | Cifras **DEC** |

## 9. Propuesta de reglas para skills (no se editó ninguna)
1. **ver-videos / aprender-de-todo:** cuando la reproducción en navegador dé fotogramas pero no transcripción, registrar «t visto = X de Y s» en la ficha y no llamar «video visto» a lo demás.
2. **aprender-de-todo:** capturar y medir **un viewport móvil** solo si la emulación cambia `innerWidth`; si no, anotarlo como hueco (en esta sesión no cambió).
3. **onia-ventas-pauta:** un CTA único por pieza y enlazar con UTM propio cuando se pueda; registrar «CTA de campaña presente en videos de distinta fecha» como observación (no como reescritura demostrada).
4. **onia-web-factory:** al estudiar una landing ajena, guardar hero, CTA (CSS) y orden de secciones; no copiar paleta ni retrato.
5. **Cobertura:** distinguir OBS/DEC/INF/PROP en toda ficha de referente y declarar la superficie con modal de login como «parcial».

## 10. Decisiones pendientes de Sergio (no resueltas aquí)
1. ¿Se reabre la venta y con qué fecha R? (si cambia la fecha del taller, se actualiza TALLER_31_OCT; no este documento).
2. ¿Se graban los reels A/B/C o los del PR #240?
3. ¿Se acepta el mecanismo «contar antes de automatizar» como nombre público?
4. ¿Se habilita un enlace con UTM propio para medir clics?
5. Condiciones 1-5 de §3 de TALLER_31_OCT siguen en manos de Sergio y Leslie.

## 11. Verificación (código, no a mano)
```
cd hermes-content/research/iman-workshop-20261022
node -e "const j=require('./fuentes.json');const u=j.fuentes.map(f=>f.url);console.log(j.fuentes.length,new Set(u).size)"
```
Estado tras la corrección única: `fuentes.json` v2 marca cada lectura DOM/CSS como «reportado por Claude, no verificado independientemente» (campo `procedencia`) y lista los campos no observados. Resultado el 22-oct-2026: **14 fuentes, 14 URLs únicas**; acceso observado 7, parcial 7, bloqueado 0 como registro (las superficies sin abrir o bloqueadas están aparte, en `superficies_sin_abrir_o_bloqueadas`). Las 16 rutas de captura citadas existen en `evidencia/`.
