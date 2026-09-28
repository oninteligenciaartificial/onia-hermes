# Los cuatro referentes en cada formato, carruseles 100 % IA y marketing con IA

> **Investigación del 2026-09-25** · sesión CONTENIDO (subagente de investigación) · solo lectura:
> no se inició sesión en ninguna red, **no se generó ninguna imagen y no se gastó ningún crédito**.
> **Es research con fecha: historia, no fuente de verdad.** Las cifras de terceros envejecen y se
> vuelven a medir antes de usarlas. Las reglas siguen mandando desde los docs sin fecha:
> `CLAUDE.md`, `contenido/SISTEMA_DE_GUIONES.md`, `contenido/MARCA_ONIA.md`,
> `skills/carruseles-onia.md` y `HIGGSFIELD_VIDEO_SYSTEM.md`.
>
> Pedido textual de Sergio Urcullo, 25-sep: *«quiero que tomes como referencia a Muñoz y a los otros
> en YouTube, no solo a uno por cada cosa. Y revisá bien todo lo de todos. ¿Y por qué no tomás los
> carruseles hechos 100% con inteligencia artificial? Se supone que nosotros hacemos eso también. Y
> quiero que veas el tema de marketing con inteligencia artificial.»*
>
> **No repite** lo que ya está en `ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ_20260925.md` (perfiles,
> audiencias, embudos, llamadas 1 a 1) ni en `ONIA_REFERENTE_ANAS_ANDALUSI_20260925.md` (historia,
> escalera de precios, deuda de credibilidad). Los cita con su § cuando hace falta. Corrige la
> tabla de `SISTEMA_DE_GUIONES.md` §7, que asigna **un** referente por formato: acá están **los
> cuatro en cada formato** (§1 y §4).

## Límite de esta investigación (leer primero)

1. **Red.** Siguen bloqueados (403 del proxy) instagram.com, youtube.com, tiktok.com, threads,
   skool, tododeia.com y eriktaveras.com; no se reintentaron. Hoy además:
   - **WebFetch devolvió `EGRESS_BLOCKED`** también en sitios de terceros (videohighlight.com,
     thusie.com). En la práctica **todo lo web sale del buscador** (WebSearch).
   - **`api.github.com` respondió 403** («GitHub access to this repository is not enabled for this
     session»). Sí funcionaron `git clone --depth 1` y la búsqueda de repos del conector de GitHub
     (estrellas, forks y fechas).
2. **Lo que se vio con los ojos [V]:** 27 repos clonados de los cuatro referentes y de terceros
   (lista en §8), sus READMEs, prompts, scripts y **las imágenes de ejemplo que publican** (se
   armaron hojas de contacto y se miraron): historias de Muñoz, capturas de Open Carrusel, un
   carrusel de terceros y el carrusel modelo de ONIA del 25-sep.
3. **YouTube:** solo títulos, fechas y descripciones que indexa el buscador. **No se vio ninguna
   duración, capítulo ni miniatura publicada [NV].** Lo único visual de YouTube es el **método** de
   miniaturas de Muñoz, que está en su repo.
4. **Marcas:**
   - **[V]** visto: repo clonado, archivo leído o imagen mirada.
   - **[S]** fragmento o resumen del buscador; puede mezclar fuentes. La URL está en §8.
   - **[D]** fecha deducida del ID del post (método en §7).
   - **[O]** doc de ONIA, citado como `archivo:línea` o `archivo §`.
   - **[I]** inferencia de esta investigación.
   - **[NV]** no verificable con lo que hay.
   - **«atribución probable»:** el título apareció al buscar al referente, pero el canal no se
     pudo confirmar.
5. **Fecha de consulta de todas las fuentes: 2026-09-25.**

---

## Resumen

1. **Nadie hace todo, y cada uno es fuerte en un formato distinto.** YouTube: Muñoz (tutoriales
   «lo hice», maratones, casos) y Taveras (experimento con número). Carruseles: Rocha (estructura
   y herramienta) y Muñoz (IA pura). Historias: solo Muñoz tiene un sistema visible. Directos: los
   cuatro, cada uno a su modo. LinkedIn: casi nadie. Newsletter: **nadie** (§1).
2. **YouTube, lo que comparten** [S][I]:
   - un **número, precio o tiempo en el título** («$200», «$5,000 en 30 minutos», «7 horas»,
     «+60.000 €»);
   - la **primera persona con verbo de obra** («Construí», «Hice», «Despedí»);
   - el **formato declarado** en el título («TUTORIAL PASO A PASO», «Día 1», «Curso completo»);
   - el largo es **donde vive el cómo completo**, y cierra con la comunidad o el curso.
3. **«Carrusel 100 % IA» significa dos cosas opuestas** [V]:
   - **Muñoz (píxel):** Nano Banana Pro dibuja la lámina entera, texto incluido. Unos US$0,70 por
     7 láminas (según su README), letra manuscrita escrita por el modelo, sin control de tildes y
     generación en paralelo sin referencia de estilo.
   - **Rocha (código):** Claude escribe HTML y un Chromium sin pantalla lo fotografía. Texto
     exacto, edición por lámina, cero imágenes generadas. **ONIA ya hace esto**
     (`scripts/carousel_render.js`).
4. **El propio Muñoz cambió la regla en sus historias** (abr-2026) [V]: la IA solo hace fondos,
   ilustraciones e íconos; **nunca** fotos suyas, capturas de apps ni «imágenes que deben verse
   reales»; el texto lo pone el código. Es la misma frontera que ya tiene ONIA.
5. **Propuesta para ONIA (§2.8):** «100 % IA» = **la IA hace todo el proceso** (guion, dirección de
   arte, ilustración, composición, QA), pero:
   - **el texto lo compone el motor**;
   - **la prueba es una captura real**;
   - la IA solo **ilustra sin letras, sin pantallas y sin personas**.

   Cuesta **US$0,12-0,77 por carrusel** con Higgsfield o GPT Image 2 (hasta US$1,21 con Google
   directo), con un tope de 9 imágenes incluidos los reintentos y aprobación por lote. **Hoy entra
   sin tocar código solo en portada y cierre.** En @oniahq, la IA solo hace de fondo u objeto
   decorativo.
6. **Marketing con IA — lo que más pesa** (§3):
   - **(a)** los cuatro usan IA para su propio marketing y **publican la máquina como contenido**
     (la máquina de Muñoz es la más completa [V]);
   - **(b)** lo que cobra credibilidad es la **persona o la prueba sintética**: el UGC de Muñoz
     pone a una mujer generada con IA a decir «yo ya hice mi app, te juro» [V]; Anas tiene un clon
     diario [S];
   - **(c)** el tema de marketing con IA en el que **más piezas publicaron** en 2026 es **«Claude +
     Meta Ads»**, después del conector oficial del 29-abr-2026 [S]. Cuánto les rindió: [NV].

---

## 1. La matriz: cada referente en cada formato

### 1.0 En una tabla

| Formato | Enrique Rocha | Erik Taveras | Santiago Muñoz | Anas Andaloussi |
|---|---|---|---|---|
| **YouTube largo** | el canal existe; **ningún título largo indexado** [NV] | experimento con número y «¿vale la pena?», build de su SaaS, directo por hito [S][O] | «lo hice», maratones de 6-7 h, casos de miembros; intro y miniatura hechas por su máquina de IA [S][V] | serie de clases en vivo «AI Fundamentals Día 1-3», TEDx, invitado en podcasts [S] |
| **Shorts** | [NV] | la pestaña existe; títulos [NV] | shorts animados por código (estilo Vox y pizarra) [V] | clips de TV y podcasts, también en cuentas de fans [S] |
| **Reels / TikTok** | «Claude ahora…» + guía + palabra clave vía ManyChat [S] | número + herramienta + guía de la comunidad; objeto físico como prueba [S][V] | reel partido + «Comentá PALABRA» [O][S] | clon de IA a diario + su cara real; ideas y demos sobre sí mismo [S] |
| **Carruseles** | «Stop AI slop» (estructura) + Open Carrusel (Claude → HTML) [O][V] | [NV] | acuarela 100 % Nano Banana Pro (repos feb-abr) + prompt de Claude «editorial» a cambio de un comentario [V][S] | carruseles de fotos en TikTok (jun-2025) [S][D]; en IG [NV] |
| **Historias** | [NV] | [NV] | **sistema completo**: 7 categorías por semana, 35 estructuras, render híbrido [V] | [NV] |
| **LinkedIn** | no encontrado | perfil B2B; reacciona a noticias (Opus 5.5) [S] | ocasional [S] | posts de texto 2022-2024 [S][D] |
| **Directos** | eventos en Luma: talleres, AMAs, cupo limitado [S] | directo de YouTube atado a un hito (20k) [S] | 2 por semana dentro de Skool [S] | clases gratis por días [S] |
| **Guía web** | 268 guías públicas, sin registro [S] | «cada reel trae su guía», con registro [S] | blog con el año en el título + «El Stack de Santi» [S] | landings de «clase gratis» [S] |
| **Comunidad** | bóveda pública + eventos [S] | AutoDev gratis con XP; también un Skool, estado [NV] [S] | Skool USD 57-64/mes [S] | Telegram gratis (2023) [S] |
| **Email / newsletter** | no hay newsletter visible [NV] | AutoDev captura el email [S] | rutinas en la nube que mandan emails internos (leads) [V] | registro a clases [S] |
| **Repos** | 31, ~1 por semana, portada con diseño [V] | 28, pocos y de producto [V] | 67, ~1,3 por semana: **toda su máquina de contenido** [V] | ninguno [V] |

### 1.1 YouTube largo (la prioridad del pedido)

**Enrique Rocha** — `youtube.com/@soyenriquerocha`

- El canal existe [S], pero el buscador **no devolvió ni un título largo suyo** [NV]. Lo que sí
  indexa son sus reels replicados en Facebook (§1.3).
- Su «largo» vive en otro lado [S]:
  - las **guías web** (268);
  - los **libros PDF** de más de 500 páginas;
  - los **eventos en Luma**.
- [I] YouTube no es su canal principal. Para él, el largo **se lee, no se mira**.

**Erik Taveras** — `youtube.com/@ErikTaverasT` (18,5K suscriptores [V: su README, 15-sep-2026])

| Título real | ID · fecha | Qué es |
|---|---|---|
| «Construí mi propio SaaS de WhatsApp que gestiona clientes solo» | `ecg6gbZXXu8` · 05-feb-2026 [S] | recorrido completo de TalosFlow, su producto |
| «IA en LOCAL con Ollama + OpenClaw + Sorteo ESPECIAL 20k - ¿Explotará mi servidor?» | `IVLUDojtoYU` · 16-feb-2026 [S] | directo por hito: tensión + pregunta de riesgo |
| «El poder de 24GB de VRAM por menos de $200: Tesla P40 en 2026» | `M6lZSmgMKxk` · may-2026 [S] | experimento de hardware con precio en el título |
| «Automatización de Negocios con IA (Con Erik Taveras) – [100]» | `UKTvIaIXqi4` · 23-jun-2025 [S] | invitado en el podcast *Los Verdaderos Códigos* |

- **Listas de reproducción** [S]: «Ruta n8n Desde Cero a Pro», «WhatsApp + n8n para Negocios»,
  «Agentes IA para Empresas» y «Automatizaciones que Generan Dinero».
- **Estructura** [O: ficha del 17-sep]: Prueba 1/2/3 numeradas, monitoreo en tiempo real, revisión
  y cierre con «¿vale la pena?». 11-12 capítulos.
- **CTA:** la guía en AutoDev y la consultoría (`ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ` §2.8).
- **Frecuencia** [I, por las fechas halladas]: más o menos **uno por mes**.
- **Atribución NV** (salieron al buscarlo, pero el canal no está confirmado):
  - «Tutorial N8N: ¡Construir Chatbot en WhatsApp! (Método fácil)» (`M5ZSjBnACtM`);
  - «Montando un Servidor de Empresa en mi Oficina: Mi Home Lab 2026» (`HTe930O2Gqc`,
    12-feb-2026);
  - «IA Local vs IA en la Nube: ¿Realmente vale la pena correr modelos en tu computadora?»
    (`qS6CX5nZk6g`, 30-mar-2026).
- **Próximamente** [S]: un curso «Claude Code para Empresas» dirigido a equipos de desarrollo,
  con tres módulos: CLI, agentes y equipos (`eriktaveras.com/claude-code`).

**Santiago Muñoz** — `youtube.com/@SantiMunozIA` (el README de Forja enlaza también
`@horizontesia`)

| Título real | ID · fecha | Patrón |
|---|---|---|
| «Despedí a mi editor y contraté a Claude Code» | `QRhX4zU1jso` · 14-jul-2026 [S] | historia en primera persona + método |
| «Claude Code Acaba de Destruir a los Editores de Video (TUTORIAL PASO A PASO)» | `RSomDkV2Aj0` · 22-jul-2026 [S] (atribución probable) | «X acaba de destruir a Y» + formato entre paréntesis |
| «Deja de perder clientes: Construye un Chatbot de $5,000 en 30 minutos» | `x361xBKBdic` · 26-jul-2026 [S] (sale Forja → probable) | dolor + precio + tiempo |
| «Claude Code 2026: Curso Completo (7 Horas) Sin Programar» | `w_pyNNAnoAc` · grabado en sep-2026 [S] | maratón: «más de 6 horas», «17 módulos y 8 proyectos en vivo» [S] |
| «De Consultor a Experto en IA: La Transformación de Rodolfo» | `cxkJPLiKoy4` · 16-jul-2025 [S] | caso de un miembro |
| «Hice su Sitio en Menos de 30 Minutos Usando IA» / «Hice un Sitio Web con IA para un Negocio EN PERSONA en 30 Minutos» | `mVzvBewfAuo` · 23-jul-2025 / `KWXIK4iS8OQ` · 14-jul-2025 [S] (la segunda, atribución probable) | «lo hice para alguien», con reloj |

- **La intro está hecha por su máquina** [V: repo `intro-edit-pipeline-skill`]. Para intros
  horizontales de 60-90 s:
  - Whisper transcribe palabra por palabra;
  - Nano Banana 2 genera **B-roll dibujado tipo pizarra** (10-24 imágenes según la duración);
  - Suno pone la música;
  - HyperFrames compone subtítulos palabra por palabra y tipografía animada;
  - entre 0,5 y 6 s aparece una **«tarjeta de play»**;
  - en los **últimos 6 s**, tres **insignias de prueba social: edad, años con IA y tamaño de la
    comunidad**.
- **Las miniaturas las genera Nano Banana Pro entera** [V: repo `thumbnail-horizontes-ia`,
  abr-2026]:
  - parte de **15 fotos reales de Santiago** y el prompt pide «no alterar la cara»;
  - arriba va el tema («TUTORIAL COMPLETO») y abajo el calificador («DESDE CERO»);
  - tiene tres estilos:
    - **A** · 3D CGI tipo «MrBeast»;
    - **B** · logo del producto, con *«web mockups, dashboards, floating screens»*: **pantallas
      generadas**;
    - **C** · el nicho de Claude Code, con cinco patrones sacados de miniaturas ajenas: «lista en
      pizarra» (74K vistas), «viejo vs nuevo» (55K), «pila de carpetas» (43K), «mascota 3D +
      libro» (24K) y «dashboard» (12K).
  - Las miniaturas **publicadas**: [NV].
- **CTA** [S]: Skool + horizontesia.com, con «plantilla incluida».
- **Frecuencia** [I, por las fechas]: en julio de 2026, **tres largos en dos semanas**.

**Anas Andaloussi** — `youtube.com/@anasandaloussii` (canal `UCohyqNzk8uM47jQtk6cQjHw`)

| Título real | ID · fecha | Patrón |
|---|---|---|
| «Cómo Aprender Inteligencia Artificial en 2024 \| AI Fundamentals Día 1 Con Anas Andaloussi» | `36gIZmMB3AY` · oct-2024 [S] | clase en vivo por días |
| «AI Fundamentals \| Día 1 \| Cómo Transformar Tu Carrera Con IA» | `0qLV_JN7vsU` [S] | beneficio en el título |
| «Cómo Ganar Dinero Gracias a la Inteligencia Artificial \| AI Fundamentals Día 3 Con Anas Andaloussi» | `00gcPM7NZbg` [S] | dinero + serie |
| «AI Fundamentals - Cómo Multiplicar Tus Ingresos con IA» | `jmNKKyDYWPc` [S] | dinero |
| «El futuro ya está aquí (pero no todos pueden verlo) \| Anas Andaloussi \| TEDxESIC University» | `-Jvz7gbtN9E` · evento del 18-mar-2025 [S] | **escenario de terceros** |

- **Como invitado** [S]:
  - «+60.000€ al mes con Inteligencia Artificial (18 años)» (`OZvTy_qRaTY`);
  - «CEO de 2 empresas de IA con 18 años» (`22le5LxLwws`);
  - «Toda la verdad sobre Anas Andaloussi | Ep 91» (`AqzTzuvzetk`, 2-jul-2025, **2 h 05 min**).
- **CTA:** `udia.es/ai-fundamentals` → clase gratis → curso (`ONIA_REFERENTE_ANAS` §1.4).
- **Atribución NV:** «Curso Experto en IA Generativa UDIA… Primera Clase» (`sVVJXY71wOQ`). Puede ser
  de un afiliado.

**Lo que comparten en YouTube** [I, sobre los títulos de arriba]:

1. **Número, precio o tiempo en el título**: Taveras «$200», «20k»; Muñoz «$5,000», «30 minutos»,
   «7 horas»; Anas «+60.000 €», «18 años».
2. **Primera persona con verbo de obra:** «Construí», «Hice», «Despedí».
3. **El formato declarado en el título:** «(TUTORIAL PASO A PASO)», «Curso Completo (7 Horas)»,
   «Día 1».
4. **La prueba es la obra:** el SaaS funcionando, la placa de video medida, el sitio hecho en
   persona o el alumno transformado.
5. **El largo enseña el cómo completo** y cierra con la comunidad o el curso. Nadie vende lo caro
   desde el título.

**Lo que los separa:**

- Anas usa YouTube como **aula en vivo y escenario prestado** (TEDx, podcasts), no como tutorial.
- Rocha casi no lo usa: su largo **se lee** (guías y libros).
- Muñoz es el único que **automatiza el empaque del video** (intro y miniatura) con IA [V].

### 1.2 Shorts

- **Rocha:** [NV].
- **Taveras:** el canal tiene pestaña de *shorts* [S]; los títulos, [NV]. Sus TikToks son
  instrucciones cortas de n8n. Por ejemplo, «Como conseguir las credenciales básicas de N8N?»
  (18-jun-2025 [D]) y «Otros usos de N8N…» (19-jun-2025 [D]).
- **Muñoz:** **shorts animados hechos 100 % con código** [V]:
  - `video-vox`: estilo Vox, Remotion, voz, música y efectos; 32★;
  - `video-pizarra`: pizarra con JavaScript + GSAP y música de Suno; creado el **24-sep-2026**.
- **Anas:** shorts de apariciones [S]: «Anas Andaloussi y Gloosito sobre la IA en las empresas» y
  «El futuro de las redes sociales ft. Anas Andaloussi». Además hay canales de fans
  (`@AnasAndaloussishorts`, cuentas de clips en TikTok) y no se sabe cuáles son oficiales [NV].

### 1.3 Reels y TikTok

**Rocha.** Títulos reales de sus reels replicados en Facebook [S]:

- «Claude Opus 5 cómo usarlo guía definitiva»;
- «Claude ahora nunca va olvidar algo»;
- «Claude ahora se vuelve tu equipo completo»;
- «Agente de WhatsApp con Claude 😮‍💨»;
- «Aprende a escribir Prompts para Claude»;
- «Aprende Básicos de Claude Code»;
- «Diseña con Claude con las mejores skills»;
- «Combinar Claude con Codex es impresionante».

Patrón: **la herramienta + un verbo en presente + un emoji**, o **«Aprende X»**. En Threads suma
*«…y la guía completa paso a paso 👇»* [S]. Los DMs los automatiza con **ManyChat**, que aparece en
su «Stack IA Creador» [S].

**Taveras.** Número + herramienta + «unite a la comunidad» (ya documentado en el doc base, §2.4).
Nuevos:

- «N8n, Claude o Hermes…» y «3D Printing Claude» figuran entre sus TikToks populares [S];
- un **unboxing** del mini PC Beelink con OpenClaw (20-abr-2026 [D]).

**Muñoz.** Reel partido: cabeza abajo (~45 %) y prueba arriba (~55 %) [O: ficha del 17-sep].
Nuevos:

- un TikTok enseña a **hacer carruseles con Claude** y pide *comentar «Carrusel»* para mandar el
  prompt exacto [S; fecha NV];
- «Por eso amo a claude» (15-abr-2026 [D]) y «Claude code 🙏🏻» (04-mar-2026 [D]);
- en 2025, humor y herramienta en el caption [S][D]: «Crea resúmenes de YouTube con inteligencia
  artificial» (02-ene), «Solo falta que la IA me haga el café 😔» (19-ene), «Faltó mencionar a
  whapi, que igual tiene prueba gratis y alcanza perfecto 😎» (22-ene) y «Lo que se viene este mes
  👀👀» (27-may).

**Anas.** Hay dos caras [S]:

- **el clon de IA** (HeyGen + ElevenLabs, entrenado con **2 minutos** de grabación) publica a
  diario: el equipo investiga y la IA genera y edita;
- **su cara real**, en sus reels y en TV.

Su video más viral trata sobre **la IA y los datos personales: más de 6 M de vistas** [S].

### 1.4 Carruseles (el detalle está en §2)

- **Rocha:**
  - el carrusel «Stop AI slop» (16-sep-2026, 3,1k likes en un día [O]);
  - la herramienta **Open Carrusel**: 467★ y 82 forks [V]; su guía se titula *«Open Carrusel —
    Claude acaba de matar a Canva»* [S];
  - la guía «Claude Design · 5 versiones de tu landing o carrusel en minutos» [S];
  - «Claude Banana», que usa Nano Banana para hacer carruseles y visuales, dentro de «5 Skills
    Claude para Creators» [S].
- **Taveras:** [NV].
- **Muñoz:**
  - **cinco repos de carruseles con IA** entre feb y abr-2026 [V] (§2.2);
  - el TikTok «comentá Carrusel», con un **prompt de Claude** para un carrusel editorial: serif +
    sans, un color principal, fondo oscuro con contraste crema [S]. [I] Pasó de «la IA dibuja
    todo» a sumar **«Claude diseña»**.
- **Anas:** publica **carruseles de fotos en TikTok** (14 y 22-jun-2025 [D]; método [NV]). En
  Instagram, [NV].

### 1.5 Historias

Solo **Muñoz** tiene un sistema visible [V: repo `instagram-stories-skill`, 11-abr-2026].
Su **marco semanal de 7 categorías** está tomado de *erex.marketing*:

| Día | lunes | martes | miércoles | jueves | viernes | sábado | domingo |
|---|---|---|---|---|---|---|---|
| Categoría | encuestas | lead magnet | libre | lead magnet | CTA directo | libre | urgencia |

- **Tres semanas tipo:** «resucitar la cuenta», «para principiantes» y «vender sí o sí».
- **35 estructuras de guion.** Las más fuertes para él son «Soltamos la bomba» y «Storytelling
  chisme».
- **Tres niveles de interacción:** sticker → respuesta corta → DM. *«Las historias no venden
  porque hablas, venden porque alguien te responde.»*
- **Render híbrido:**
  - fondos de pixel art generados con Nano Banana 2;
  - **texto compuesto por código** (Pillow; Space Grotesk + Instrument Serif; cian #00E5FF);
  - **sus fotos reales** y **capturas reales enmarcadas sin modificar**.
- **La palabra clave del CTA no la renderiza la máquina:** Santiago la agrega con el texto nativo
  de Instagram para poder cambiarla sin regenerar el PNG.
- **Encuestas:** el tercio inferior se deja libre para el sticker nativo.

Se miraron 11 láminas de ejemplo [V]: fotos suyas + pixel art (billetes quemándose, un cofre) +
tipografía con tildes correctas («¿Cuánto crees…?», «hacerlo tú mismo»).

Rocha, Taveras y Anas: [NV].

### 1.6 LinkedIn

- **Rocha:** no se encontró perfil activo.
- **Taveras:** perfil B2B. Publicó sobre el lanzamiento y los precios de **Claude Opus 5.5**: el
  formato es **reacción a una noticia con cifras** [S].
- **Muñoz:** posts ocasionales; en 2024 el perfil decía «comunidad de más de 450 miembros» [S].
- **Anas:** posts de texto en 2022-2024: lanzamientos, gratitud y voz generacional [S][D]. Por
  ejemplo, uno de UDIA del 19-sep-2024 [D].
- [I] **Sigue siendo carril libre**, como dijo el doc base (§5.5).

### 1.7 Directos

- **Rocha:** calendario en **Luma**: masterclasses, talleres y AMAs, con registro gratis y
  recordatorios automáticos; *«sesiones íntimas con cupo limitado»* [S].
- **Taveras:** directo de YouTube **atado a un hito** (sorteo por los 20k) [S].
- **Muñoz:** **dos por semana dentro de Skool**: jueves 21:00, dudas; domingos, masterclass [S].
- **Anas:** **clases gratis por días** («AI Fundamentals», 3 días) y otras en vivo, como una de
  producción audiovisual con IA [S].

### 1.8 Guía web

- **Rocha:** `tododeia.com/community/<slug>`, pública y sin registro [S]. Títulos de marketing con
  IA en §3.1.
- **Taveras:** en AutoDev, **cada reel trae su guía**, con registro [S]. Por ejemplo, «Guía de
  Home Lab» v1.0 (04-may-2026) y «Monta tu primer Home Lab (desde una PC de $100)» (actualizada
  el 08-jul-2026).
- **Muñoz:** blog con el **año en el título**, pensado para buscadores [S]. Por ejemplo, «Cómo
  hacer un chatbot de WhatsApp con IA para tu negocio (2026)». Además, «El Stack de Santi» en
  `apps.horizontesia.com` [S].
- **Anas:** landings de **clase gratis** en `udia.es` [S].

### 1.9 Comunidad

Ya documentada en los dos docs base. Solo un dato nuevo: **Taveras tiene o tuvo un Skool,
«Academia IA - N8N - Taveras»**, con un primer curso de chatbot de WhatsApp con n8n [S; fecha y
estado NV]. Su comunidad visible hoy es AutoDev, en plataforma propia y gratis [S]. Si el Skool
sigue activo: [NV].

### 1.10 Email / newsletter

**Ninguno de los cuatro tiene una newsletter visible** [NV]. El email aparece solo como captura:

- Taveras, en el **registro de AutoDev** [S];
- Anas, en el **registro a las clases** [S];
- Rocha, en los **recordatorios de Luma** [S];
- Muñoz lo usa **puertas adentro**: rutinas de Claude en la nube que mandan correos (Reporte
  Semanal de Marketing, Daily Ads Health Check, Hot Leads Daily Digest y CAPI Health Monitor) [V:
  repo `horizontes-routines-config`].

### 1.11 Repos (estrellas del 25-sep-2026 [V])

- **Rocha: 31 repos.**
  - Los más fuertes: `whatsapp-agentkit` 511★ / 159 forks, `the-architect` 508★, `open-carrusel`
    467★, `cyber-neo` 272★, `claude-webkit` 252★ y `editor-pro-max` 252★.
  - Su **marketing con IA:** `claude-ads` 91★, `humanizalo` 90★, `claude-banana` 98★ y
    `avater-appkit` 5★ (29-ago-2026).
  - Otros creadores **adaptan sus repos MIT**: por ejemplo, un kit web «adaptado para España» a
    partir de su Claude Web Builder [S].
- **Taveras: 28 repos.**
  - Pocos y **de producto:** `django-saas-boilerplate` 249★, `facturas-opensource` 93★ (OCR +
    validación de la DGII dominicana) y `modelnap` 16★ (15-sep-2026, app de macOS firmada).
  - En el README del panel ESP32 usa **links de afiliado** de Amazon.
- **Muñoz: 67 repos.**
  - `forja` 113★ / 51 forks, `crear-agente` 74★, `video-vox` 32★ y `sofia-voice-agent` 31★.
  - **Todos los generadores de contenido que usa** (carrusel, historias, miniaturas, intro, UGC,
    Meta Ads y videos virales) tienen **entre 0 y 6★**.
- **Anas:** ninguno.

### 1.12 El patrón que atraviesa todos los formatos

La fórmula común ya está escrita (`ONIA_REFERENTE_ANAS` §3.2): **una unidad concreta, su prueba a
la vista, la cara de quien la hizo y una puerta gratis al paso siguiente**. Esta investigación le
suma dos observaciones:

1. **Cada formato alimenta al de al lado, en el mismo sentido** [I]:
   - el reel promete y la guía, el repo o la plantilla cumplen;
   - el largo enseña y la comunidad o el curso acompañan;
   - el directo convierte.
2. **La máquina que produce los formatos también es contenido** [V]. Muñoz la publica en repos,
   Rocha la vuelve herramienta (Open Carrusel, Editor Pro Max), Anas la muestra («me cloné») y
   Taveras la pone en un objeto (sus paneles).

---

## 2. Carruseles hechos 100 % con IA

### 2.1 Qué quiere decir «100 % IA»: dos métodos opuestos y uno del medio

| | **Píxel** — Muñoz | **Código** — Rocha | **Híbrido** — Muñoz en historias |
|---|---|---|---|
| Quién hace la lámina | un modelo de imagen dibuja la lámina entera, texto incluido | Claude escribe HTML/CSS y un navegador sin pantalla la fotografía | la IA dibuja el fondo o la ilustración y el código pone el texto y las capturas |
| Texto | lo **escribe el modelo** (manuscrito) | texto real, exacto y editable | texto real |
| Tildes y ñ | sin control: dependen del modelo | exactas | exactas |
| Prueba real (capturas) | el modelo la **redibuja** (lo advierte el propio Santiago) | se inserta tal cual | se enmarca sin tocar |
| Costo por carrusel | ~US$0,70 por 7 láminas (su README) | el plan de Claude; US$0 en imágenes | centavos por imagen |
| Qué hace ONIA hoy | nada | **esto** (`carousel_render.js`) | a medias: portadas con fondos de origen no documentado (§2.7) |

### 2.2 El método exacto de Muñoz: `santmun/carousel-horizontes-ia` [V]

**Repo:** creado el 11-abr-2026, un solo commit, 2★. Sus hermanos, con el mismo motor:

| Repo | Fecha | ★ | Qué hace |
|---|---|---|---|
| `carruselesdef` | 03-mar-2026 | 4 | además escribe el contenido |
| `tweet-carousel` | 22-mar-2026 | 1 | tweet → carrusel en 2-3 min, «~US$0,70 por 7 láminas» |
| `instagram-carousel-generator` | 03-abr-2026 | 2 | — |
| `carruanimados` | 09-abr-2026 | 1 | carrusel **animado**: Nano Banana 2 → Kling 2.6 (loop de 5 s) → Remotion → MP4 1080×1080 |

**Piezas:**

1. el agente `carousel-generator`, que diseña las láminas;
2. la skill `/carousel-gen`, con un flujo obligatorio de 4 pasos: brief → referencia de portada →
   logos → generar;
3. el script `generate-carousel.py` (1.474 líneas);
4. una plantilla JSON de estilo.

**Modelo y parámetros:**

- **Nano Banana Pro vía Kie AI**: `POST api.kie.ai/api/v1/jobs/createTask`, con
  `model: "nano-banana-pro"`, `aspect_ratio: "4:5"`, `resolution: "2K"` y `output_format: "png"`
  (`script/generate-carousel.py:44-52`, `:638-670`).
- Después consulta el estado cada 5 s, hasta 60 veces.

**Cómo resuelve el texto:**

- **No lo resuelve: se lo pasa al modelo.** El prompt de cada lámina lleva el título y los
  bullets entre comillas y **describe la letra**: *«Large handwritten font, navy blue (#1A365D),
  48-56pt… Body text: Medium handwritten, black (#1F2937), 28-36pt»* (`:238-490`).
- Solo en el cierre agrega *«Escribe el texto TAL COMO ESTÁ»*.
- No hay revisión ortográfica: si una lámina sale mal, se regenera a mano con
  `--regenerate-slides "2,4"`.

**Cómo mantiene la consistencia:**

- **Solo con el prompt:** el mismo bloque `base_style` en todas las láminas (paleta con códigos
  hex, «tipografía handwritten», zonas por porcentaje).
- **No usa semilla ni imagen de referencia de estilo.**
- **Genera todas las láminas en paralelo** (`ThreadPoolExecutor`): ninguna ve a la anterior.
- Las únicas referencias son los **logos reales** (URL en `image_input`) y la **foto real** de
  Santiago en el cierre.

**El prompt, en esqueleto** (`:238-330`):

```
Instagram carousel slide (1080x1350px, ratio 4:5).
STYLE: Hand-drawn watercolor and colored pencil illustration. Minimalist, friendly, educational.
- Fondos claros (beige #F5F1E8, crema #FAF9F6, blanco) · Tipografía handwritten escrita por la IA
PORTADA… IDEAS DE ILUSTRACIÓN CREATIVA: el logo en 3D gigante… perspectiva forzada…
Título en tipografía handwritten bold: "{title}" · TEXT CONTENT: {content}
COMPOSITION: Ilustración dominante… Título grande navy blue (#1A365D), 72-80pt
NO watermark, NO username, NO branding text · Safe margins: 60px
```

**Costo y tiempo** (lo que dice el repo):

- **~US$0,10 por imagen, ~US$0,70 por 7 láminas**; ~US$1,00 por 10.
- El tiempo **se contradice dentro del mismo repo**: «15-25 minutos» (README) contra «7-10
  minutos» (skill).

**Fallas conocidas** (del propio repo):

1. **«Logos inventados/genéricos»** figura en su resolución de problemas.
2. **Los timeouts de la API.**
3. **La regeneración por lámina existe porque salen láminas malas.**
4. **Contradicción de marca de agua:** la plantilla pide *«@sanmunoz.ia bottom right, 10%
   opacity»* y todos los prompts dicen *«NO watermark, NO username»*.
5. **Abandonó «generar + editar» con `nano-banana-edit`** porque *«duplica costo»*: el logo va en
   una sola pasada.

**El límite del texto, dicho por otro referente:**

- La base de conocimiento de `claude-banana`, el repo de Rocha para Nano Banana, fija como regla
  dura **«25 caracteres como máximo para texto fiable; 2-3 bloques de texto por imagen; el texto
  entre comillas»** [V: `knowledge/safety-and-text.md`].
- Una lámina de contenido de Santiago pide título + bullets de 28-36 pt: **por encima de ese
  límite** [I].
- TikTok tiene una página de búsqueda «Cómo corregir la ortografía de Nano Banana» [S]: el
  problema es conocido [I].
- **Tildes:** su plantilla de miniaturas escribe «es **INCREIBLE**», sin tilde
  (`agent/thumbnail-director.md:258`) [V]. Sus palabras clave van **sin acentos por regla**
  (`historias-ig-skill/skill/historias-ig.md:57`, `:334`) [V]; el motivo no está escrito [NV].

**Lo que vino después.** El TikTok «comentá Carrusel» comparte un **prompt de Claude** para un
carrusel «editorial profesional» con tipografía mixta, serif + sans [S]. [I] Sugiere que, para
láminas con mucho texto, él también terminó **diseñando con Claude** en vez de dibujar con el
modelo de imagen.

### 2.3 El método exacto de Rocha: `Hainrixz/open-carrusel` [V]

**Repo:** creado el 15-abr-2026; 467★ y 82 forks. Next.js 16, local, arranca con un comando
(`/start` en Claude Code).

**Modelo:**

- **Claude Code CLI** como subproceso (`claude -p …`), con `--allowedTools Bash WebFetch Read` y
  **`--max-budget-usd 1.00` por mensaje** (`src/app/api/chat/route.ts:57-77`).
- **No genera imágenes:** solo usa las que sube el usuario (logo y referencias).

**Cómo resuelve el texto:**

- Claude escribe cada lámina como **HTML de cuerpo** y la sube con `curl` a la API local.
- `wrapSlideHtml()` es **el contrato único entre la vista previa y la exportación**
  (`src/lib/slide-html.ts`).
- Puppeteer fotografía a **1080×1350** (también 1:1 y 9:16), con las fuentes de Google
  **incrustadas en base64**.
- Resultado: **texto exacto, editable por lámina y con deshacer.**

**Cómo mantiene la consistencia:**

- El **kit de marca** (5 colores, 2 fuentes, logo y palabras de estilo) se inyecta en el prompt
  de sistema **en cada pedido**.
- Hay **presets de estilo** guardables y **referencias visuales** que Claude estudia con `Read`.
- Reglas: *«same margins, same font sizes across slides»*, pero también *«vary backgrounds between
  slides»* (`src/lib/chat-system-prompt.ts`).

**El arco que impone el prompt:**

1. **gancho** de 8 palabras como máximo;
2. **planteo** en 2 láminas;
3. **valor**, una idea por lámina, en 3;
4. **resumen**;
5. **CTA** («Follow / Save / Share»).

Además, *«3 alternative hooks»* (pregunta, estadística, afirmación contraria), caption de 150-300
caracteres y 20-30 hashtags.

**Costo:** el del plan de Claude del usuario, con tope de US$1 por mensaje; **US$0 en imágenes**.

**Fallas conocidas:**

- Su propia resolución de problemas cita que falla la exportación (Chromium) y que *«The AI keeps
  generating slides that ignore my brand colors»*.
- La **captura de su README** muestra lo que sale sin dirección: navy + píldora roja
  «PRODUCTIVITY» y *«5 Habits That 10x Your Productivity»*. **Correcto pero genérico** [V].
- [I] Por eso el mismo Rocha publica «Stop AI slop»: la herramienta no trae criterio, **se lo da
  el que la usa**.

### 2.4 Lado a lado

| | Muñoz (píxel) | Rocha (código) |
|---|---|---|
| Modelo | Nano Banana Pro (Kie AI) | Claude Code (HTML) + Puppeteer |
| Texto dentro de la imagen | lo escribe el modelo | real (HTML) |
| Consistencia | un bloque de estilo repetido; generación en paralelo, sin referencia | kit de marca + presets + referencias, una lámina a la vez |
| Corrección | se regenera la lámina entera | se cambia una palabra |
| Prueba real | el modelo la puede redibujar | se inserta tal cual |
| Costo por carrusel | ~US$0,70 por 7 láminas + reintentos | plan de Claude (tope de US$1 por mensaje) |
| Tiempo | 7-25 min según el propio repo | minutos |
| Tracción del repo | 1-4★ | 467★ / 82 forks |
| Se ve «hecho con IA» | **sí**: acuarela y letra manuscrita generadas | depende de la dirección de arte |

### 2.5 El propio Muñoz puso una frontera (historias, abr-2026) [V]

`instagram-stories-skill/knowledge/06-render-workflow.md`, textual:

- **Nano Banana, cuándo sí** (`:71-73`): *«Backgrounds abstractos/texturizados (pixel art
  estético) · Ilustraciones conceptuales (no fotos realistas) · Iconos y elementos gráficos»*.
- **Cuándo no** (`:76-78`): *«Para generar fotos de Santiago · Para generar screenshots de apps ·
  Para generar imágenes que deben verse como reales»*.
- **Capturas** (`:44-46`): *«NO modifico el contenido de la captura. Solo la enmarcó
  estéticamente.»* · *«Nunca: generar mockups falsos de apps ni usar capturas genéricas.»*
- **Si pasa una foto suya como referencia**, el prompt exige *«The reference image must remain
  pixel-identical»*, porque *«Nano Banana tiende a reinterpretar»*.

**Es la misma frontera de ONIA** («no fabricar pantallas con IA», `CLAUDE.md` §5;
`SISTEMA_DE_GUIONES.md` §1). La diferencia: Santiago la aplicó a sus **historias**, no a sus
**carruseles** ni a sus **miniaturas**, donde el estilo B genera dashboards.

### 2.6 Quién más publica carruseles hechos con IA, y cómo les va

**De los cuatro:**

- **Muñoz**, en píxel y ahora también con Claude;
- **Rocha**, como herramienta de código y como guía de Claude Design;
- **Anas**, carruseles de fotos en TikTok, con método [NV];
- **Taveras**, [NV].

**Otros, en español e inglés:**

- **`ecomcircle/carousel-generator`** (01-may-2026) [V]:
  - Claude, con plan Max, escribe 9 láminas: Gancho → Dolor → Valor ×5 → Recap → CTA;
  - Nano Banana (Gemini 2.5 Flash Image) aporta una foto opcional;
  - HTML + Playwright renderiza;
  - **Apify raspa el feed de otro creador para copiarle el estilo**;
  - **US$0-0,07 por carrusel**;
  - su ejemplo **repite la misma foto en las 9 láminas** [V], justo el «afiche repetido» que
    `CLAUDE.md` §5 prohíbe.
- **Plantillas de n8n** [S]: «Create & publish Instagram carousels with AI research, Nano Banana
  Pro & Slack» y «GPT-5, Nano Banana, and Blotato».
- **Guías** [S]: Metricool («Cómo crear carruseles con IA usando Claude y Metricool MCP»), un
  Substack en español («Crea carruseles para Instagram con Claude. Sin saber programar ni diseño»)
  y Morgan DeBaun («How I Use Claude Design for High Performing Carousels», 21-jul-2026). Esta
  última destaca que el diseño por Claude da *texto sin letras derretidas* y permite *cambiar una
  palabra sin regenerar la lámina*.

**Cómo les va:**

- **No hay métricas públicas de ningún carrusel hecho con IA** [NV].
- **Señales indirectas:**
  - el repo de código de Rocha juntó **más de 100 veces las estrellas** de los de píxel de Muñoz
    (467 contra 1-4) [V]. Es interés por la herramienta, no rendimiento de los carruseles [I];
  - Muñoz usa el carrusel con IA **como lead magnet** («comentá Carrusel») [S];
  - «Stop AI slop» —cuyo método de producción es [NV]— hizo 3,1k likes en un día [O].
- **Datos del formato** (terceros, 2026) [S]:
  - Socialinsider: carruseles 0,55 % de interacción, reels ~0,50-0,52 % e imágenes sueltas
    ~0,35 %;
  - según Buffer, los reels tienen ~36 % más alcance;
  - Metricool: las imágenes sueltas pierden alcance e interacción año contra año.
- **La etiqueta de IA:**
  - Meta detecta **C2PA/IPTC** y marca **«Info de IA»** [S];
  - Google firma sus imágenes con **SynthID** en los píxeles [S];
  - en TikTok, los posts con aviso de IA hicieron **~7-8 % menos likes** [S];
  - pero **los avisos detallados sobre cómo se usó la IA se reciben mejor** que los genéricos
    (SSIR, 2026) [S].

### 2.7 Lo que ya existe en ONIA

- **`scripts/carousel_render.js`** [V]. Es la **misma arquitectura que Open Carrusel**:
  - brief JSON → un HTML por lámina → Chrome sin pantalla → PNG de 1080×1350 (también cuadrado e
    historia);
  - 7 packs; el default es `community-editorial`;
  - **`carousel_pipeline.js`** hace «generar (OpenAI) → renderizar → publicar solo con
    `--publish`».

  **ONIA ya hace carruseles «hechos por IA» al estilo de Rocha.**
- **Assets** (`skills/carruseles-onia.md`) [V]:
  - `npm run image:openai` usa **gpt-image-1**, por defecto `quality high` y con fondo
    transparente (`scripts/openai_image.js`);
  - hay un objeto 3D de Higgsfield ya recortado para reusar
    (`assets/onia/automation-node-clean-3d.png`).
- **La regla vigente de la skill:** *«Nunca un carrusel generado entero por IA»* y *«Nunca
  inventar UI con un generador de imágenes»* [V].
- **Dónde entra hoy una imagen en el pack editorial** [V: `scripts/carousel_pack_editorial.js`]:
  - como `bg` (foto a sangre con velo) **solo en la portada y el cierre** (`:18-23`, `:261`); los
    interiores son «papel»;
  - en un interior, la única vía es el visual `screenshot`, **cuya etiqueta por defecto es
    «PRODUCTO REAL»** (`:109-121`).

  ⚠️ **Poner ahí una ilustración de IA sin cambiar la etiqueta la presentaría como producto
  real.** Hoy, una ilustración de IA solo entra **en portada o cierre**. Un visual propio para
  ilustraciones sería trabajo de código: no se hizo.
- **El carrusel modelo del 25-sep** [V] (`carousels/out/sergio-seguimiento-3-partes-20260925/`):
  - 9 láminas con la estructura de Rocha y texto exacto;
  - su portada usa `references/marca-personal-sergio/fondos/cuaderno-02.png`;
  - esa carpeta tiene un `_AB-PROMPTS.png` con tres escritorios fotorrealistas (laptop, lámpara,
    ventana) [V]: **parecen generados y su origen no está documentado** [I];
  - **ONIA ya mezcla imágenes de IA sin trazabilidad** (modelo, prompt, costo).
- **Gasto** [V]: `HIGGSFIELD_VIDEO_SYSTEM.md` exige `generate cost` y aprobación antes de
  **cualquier imagen o video pago**; `CLAUDE.md` §5 permite **aprobar por lote** con brief,
  costo o tope y cantidad.
- **Precios por imagen:** en la tabla de abajo. El precio de **gpt-image-1**, que es lo que usa
  hoy el script de ONIA: [NV].
- **Estado del proveedor** [O]:
  - la CLI de Higgsfield **no estaba operativa el 22-sep** (pide un nuevo login);
  - el cobro anual sigue **en reclamo**;
  - la regla «Nada de Higgsfield» se levantó el 17-sep para **enseñarlo**
    (`cola/PLAN-VIDEOS-11-20-SEP.md:28`).

**Precios por imagen** [O: `ONIA_STACK_GENERACION_ALTERNATIVAS_20260925.md` §2.3, con sus propias
marcas; ningún precio autoriza una compra]:

| Modelo | US$ por imagen |
|---|---|
| Nano Banana Pro con créditos de Higgsfield | 0,066-0,086 |
| Nano Banana Pro directo de Google | 0,134 |
| GPT Image 2 (calidad media) | 0,041 |
| GPT Image 2 (calidad alta) | 0,165 |
| Soul 2 (Higgsfield) | ~0,004 |

### 2.8 Propuesta: el carrusel 100 % IA de ONIA, sin romper las reglas

**La definición** (la decide Sergio Urcullo; §5): **«100 % IA» es el proceso, no los píxeles.**

- La IA **investiga, escribe el guion, dirige el arte, ilustra, compone y revisa**.
- Hay tres cosas que **no inventa**:
  1. **el texto**, que lo compone el motor con tildes y ñ exactas;
  2. **la prueba**, que es una captura real con manifiesto;
  3. **la gente**: ni personas reconocibles ni presentadores sintéticos haciéndose pasar por
     reales.

Es el modo **híbrido** (§2.1): el que Santiago aplica en sus historias y el que ya permite
`SISTEMA_DE_GUIONES.md` §1, donde un *mockup* es un marco alrededor de una captura real.

**Receta** (marca personal, `@sergiourcullo`):

1. **Las dos líneas primero.** Se llenan ENSEÑA y PRUEBA (`SISTEMA_DE_GUIONES.md` §0). Si una
   lámina necesita prueba, sale de `scripts/contenido/capturar-web.mjs` o la graba una persona
   (§8 de ese doc). **Nunca la genera un modelo.**
2. **El brief lo escribe Claude**, con la estructura de Rocha que ya está en la skill:
   1. tesis;
   2. una unidad por lámina con su nombre exacto;
   3. «así no / así sí»;
   4. la lámina que se guarda;
   5. criterio y un solo CTA.
3. **Una biblia visual por serie, no por carrusel.** Es un párrafo fijo: técnica, paleta y trazo.
   - **No fotorrealista**, para que nadie la lea como la foto del escritorio de Sergio Urcullo.
   - La paleta sale del pack editorial [V]: tinta `#10221a`, papel `#f7f5ef` y **un solo detalle
     en verde `#13c978`**.
4. **Pocas imágenes, con trabajo:**
   - **hasta 3**: portada, un concepto y cierre;
   - como hoy el pack solo acepta imagen en portada y cierre (§2.7), **empezar por esas dos**;
   - el resto son las tarjetas del motor (terminal, checklist, tabla, flujo) y las capturas
     reales;
   - cada lámina cumple una función distinta (`CLAUDE.md` §5, «prohibido el carrusel de afiches
     repetidos»).
5. **Prompt sin letras.** Plantilla propuesta [I]:

   ```
   Ilustración editorial para la portada de un carrusel de Instagram, 4:5, 2K.
   Técnica: tinta y grabado sobre papel crema; trazo visible; nada de brillo ni degradado "IA".
   Paleta: tinta #10221a, papel #f7f5ef, UN solo detalle en verde #13c978.
   Escena: <una metáfora del tema, un objeto protagonista>.
   Composición: el objeto en el tercio inferior; el tercio superior VACÍO (ahí va el título).
   Prohibido: letras, números, logos, interfaces, pantallas con contenido, personas reconocibles.
   ```

   Si hace falta una palabra dentro de la escena, **no**: la regla de Rocha (≤25 caracteres) sirve
   para decorar, no para enseñar.
6. **Consistencia por referencia, en orden:**
   1. **primero la portada**;
   2. se mira y se aprueba;
   3. **esa imagen va como referencia de estilo** de las otras («misma técnica, paleta y trazo;
      cambia solo el objeto: …»).

   Nano Banana admite varias imágenes de referencia; la base de `claude-banana` habla de hasta 14
   [V: `knowledge/model-notes.md`]. Esto **corrige la falla del script de Santiago**, que genera
   en paralelo y sin referencia.
7. **Presupuesto por lote**, antes de generar (`CLAUDE.md` §5; `HIGGSFIELD_VIDEO_SYSTEM.md`,
   «Flujo de gasto obligatorio»). Se arma un job con modelo, resolución, cantidad, precio unitario
   **del día** (`higgsfield generate cost` o la página del proveedor) y un tope. **Sergio Urcullo
   aprueba el lote.** Cuentas con los precios del §2.7 [O][I]:

   | Proveedor | 3 imágenes | Tope de 9 (con 6 reintentos) |
   |---|---|---|
   | Nano Banana Pro (Higgsfield) | US$0,20-0,26 | US$0,59-0,77 |
   | GPT Image 2 (media) | US$0,12 | US$0,37 |
   | Nano Banana Pro (Google directo) | US$0,40 | US$1,21 |

   Con un carrusel cada ~4 días (la regla del reemplazo de B-roll, `ONIA_MARCA_PERSONAL_TRES_CARRILES.md`
   §1), el peor caso es **≈ US$6 por mes con Higgsfield** y **≈ US$9 con Google directo** [I].
8. **Composición y verificación:**
   1. `node scripts/carousel_render.js` con `bg` por lámina;
   2. hoja de contacto;
   3. **abrir cada PNG** («verificar es MIRAR»).

   Se revisa:
   - que no haya letras escondidas en la ilustración (con zoom);
   - que el verde toque un solo detalle;
   - que el título no tape el objeto;
   - las tildes;
   - que ningún fondo se repita.
9. **Trazabilidad:** un `manifest` junto al brief con modelo, prompt, referencias, costo previsto
   y real, y fecha. Es lo mismo que exige `HIGGSFIELD_VIDEO_SYSTEM.md` para los jobs. Hoy falta
   para los fondos de la carpeta `fondos/` (§6).
10. **Declararlo, no esconderlo:**
    - el caption dice *«Ilustraciones hechas con IA; el texto, las plantillas y las capturas son
      reales»*;
    - **no se borran los metadatos C2PA**;
    - el aviso detallado es el que mejor se recibe (§2.6), y además es identidad: Sergio Urcullo
      enseña a construir con IA.
11. **La máquina como contenido.** Una pieza, carrusel o reel, *«Así hace mis carruseles una IA:
    el costo real, el prompt y las tres cosas que no la dejo hacer»*. Enseña, conecta y es lo que
    hacen los cuatro (§1.12).
    - Como recurso de «comentá CARRUSEL», **solo** si la receta está publicada y la palabra
      activa. Hoy `@sergiourcullo` no tiene palabras automáticas (`contenido/PUBLICACION.md` §2),
      así que se contesta a mano y **una palabra por vez** (`SISTEMA_DE_GUIONES.md` §3).
12. **Medir contra el modo código.** Guardados, compartidos y seguidores a las 48 h y a los 7
    días (`SISTEMA_DE_GUIONES.md` §6). Si la ilustración no mueve guardados, se vuelve al código
    puro, que es gratis.

**En `@oniahq` (dueño de clínica): no.** Allí manda la regla de venta (`CLAUDE.md` §5;
`contenido/MARCA_ONIA.md` §3):

- producto visible con **UI real del tenant demo**;
- la IA solo como **fondo u objeto decorativo** (el nodo 3D ya existente se reusa: no se genera
  otro);
- ninguna persona sintética como odontóloga, paciente o clienta;
- la pauta sigue en **«no todavía»** (`MARCA_ONIA.md` §4).

**Qué no se toma del modo píxel:**

1. **Texto dibujado por el modelo.** Tildes sin control, no se edita y se regenera la lámina
   entera.
2. **La misma acuarela en todas las láminas.** Es la serie de afiches que `CLAUDE.md` §5 prohíbe.
3. **Logos «integrados» o redibujados por IA.** Los logos reales los pone el motor.
4. **Capturas pasadas por el modelo.** Las reinterpreta; lo dice el propio Santiago.
5. **Fotos fotorrealistas «del escritorio de Sergio Urcullo»** como las de la carpeta `fondos/`. Si no son reales,
   que se note que son ilustración.

**Experimento opcional** (lo decide Sergio Urcullo): **un** carrusel en modo píxel, declarado
como tal, contra la misma pieza en modo código. Costaría ~US$0,5-1,2 [O][I]. Sirve para dejar de
discutir de memoria.

---

## 3. Marketing con IA: qué hacen los cuatro para sí mismos

### 3.1 Qué usa cada uno

**Enrique Rocha**

- **Clones y avatares:**
  - su «Stack IA Creador» incluye **HeyGen** (avatar) y **ElevenLabs** (voz) [S];
  - construyó **Avatar App Kit** sobre la API de Higgsfield. Su propio README admite *«Likeness is
    not solved yet»* [V];
  - si publica con avatar: [NV].
- **Automatización de contenido:**
  - Open Carrusel y Editor Pro Max (Remotion) [V];
  - «5 Skills Claude para Creators» [S]: Hyperframes, «Last 30 Days» (tendencias en vivo), Claude
    Banana, Claude Video Vision (desarma un reel viral cuadro por cuadro) y Apify (datos de
    IG/FB);
  - «Agente de Storytelling»: un viral se vuelve plantilla para tu historia [S];
  - `humanizalo` (40 patrones de escritura de IA) [V].
- **DMs:** **ManyChat** para «comentá X» → DM [S].
- **Imagen y video:**
  - «Claude Banana» con Nano Banana [S][V];
  - «Awesome GPT Image 2 · 4.430 prompts» [S];
  - «Director de arte con Higgsfield» [S];
  - Veo y SeeDance en su stack [S].
- **Anuncios:**
  - `claude-ads`: auditoría de Meta, Google y TikTok, «158 checks», **US$0** [V];
  - guías: «Andromeda · 8 reglas para Meta Ads con Claude», «Claude Meta Ads», «Meta Ads CLI
    Oficial» y «Ads Pro» [S];
  - **«Cloud Ads Flow»**: Cowork baja los **10 mejores anuncios de la biblioteca pública de Meta**
    por país y nicho, y Higgsfield hace 10 nuevos con el mismo estilo y la misma estructura de
    gancho [S];
  - **«Clonar anuncios»**, con el Ad Multiplier de Higgsfield [S].

**Erik Taveras**

- **Clones y avatares:** no se encontró nada [NV].
- **Automatización de contenido:**
  - **paneles físicos** que se vuelven contenido: un ESP32 con las **estadísticas de su Instagram
    vía Graph API** y una Raspberry Pi con el **gasto de Claude Code** [V];
  - un bot de 2020 que publicaba citas con fotos de una cámara [V].
- **DMs:** «comentá 'quiero el dashboard'» → micro-guía de **US$19** [S]. El panel también está
  gratis en GitHub (repo del 07-ago-2026, con link de afiliado de Amazon) [V]. Si la guía paga fue
  antes o después: [NV].
- **Producto:** **TalosFlow**, un CRM de WhatsApp con agente de IA: su producto **y** su
  demostración [V][S].
- **LinkedIn:** reacción a noticias con cifras [S].

**Santiago Muñoz** — **la máquina más completa**, toda en repos públicos [V]:

- **Clones y avatares:**
  - **UGC sintético** (`ugc-ad-meta`, may-2026): un pool de **6 «mujeres latinas» generadas con
    GPT Image 2** y lip-sync con **Kling 3.0 o Seedance 2.0** vía Higgsfield. Cuesta **~54
    créditos (≈ US$1-2) por anuncio**.
  - Guion fijo de 6 escenas de 5 s, con glosario fonético: «Claude» → «Klaud», «IA» → «i a».
  - **Pausa obligatoria antes de gastar.**
  - Sube a Meta **EN PAUSA** con `is_ai_powered: true`.
- **Automatización de contenido:**
  - carruseles (Nano Banana Pro), historias (híbrido), miniaturas (Nano Banana Pro con su cara
    real), intros de YouTube (Whisper + Nano Banana 2 + Suno + HyperFrames) y shorts (Remotion,
    GSAP);
  - **videos virales** de cualquier nicho: Apify + Supadata → 3 tablas en Notion, por **menos de
    US$0,50 por corrida**;
  - `radar`: un modelo juzga 100 videos de YouTube.
- **DMs:** «Comentá PALABRA», con palabras sin acentos [V][S].
- **Imagen y video:** Kie AI (Nano Banana Pro/2, Kling 2.6) y Higgsfield (Kling 3.0, GPT Image 2)
  [V].
- **Anuncios:**
  - `meta-ads-launch`: campaña + 3 conjuntos + 3 copies (dolor / aspiracional / «te quedás
    atrás») + **9 imágenes a mano alzada (3 estilos × 3 ángulos) × 3 formatos = 27 archivos**,
    todo **EN PAUSA con prefijo [TEST]**, LATAM de 28-45 años, 7 días;
  - rutinas diarias en la nube: salud de los anuncios, CAPI y un digest de leads calientes [V].

**Anas Andaloussi**

- **Clones y avatares:** su **clon** (HeyGen + ElevenLabs, 2 minutos de grabación) **publica a
  diario**. Por feb-2025 llevaba 14 M de vistas y 40K seguidores en IG. En Informativos Telecinco,
  **su avatar lo reemplazó al final de la nota** [S].
- **Automatización de contenido:** su equipo investiga y la IA **genera y edita** [S]. Vende eso
  como curso: *«sistemas de contenido automatizado… sin ser influencer»* (ChatGPT, ElevenLabs,
  HeyGen, Zapier, Notion) [S].
- **DMs:** «Escríbeme y te ayudo gratis»; «RT y comenta: GRATIS» [S].
- **Imagen y video:** QuickTok (su herramienta de video con IA) [S]. El video con IA también es
  tema de clase: dio una en vivo sobre producción audiovisual con IA [S].
- **Anuncios:** [NV].

### 3.2 Qué funciona

1. **Mostrar la máquina con su costo y lo que produce.**
   - Muñoz pone el costo por corrida en cada README;
   - Rocha, «$0»;
   - Taveras mide sus costos (OpenClaw «US$50-100 por fin de semana» contra Ollama).

   La máquina **es** contenido y **es** lead magnet [V][S].
2. **El lead magnet es la herramienta, no el PDF:** «comentá Carrusel» → el prompt (Muñoz) [S];
   Open Carrusel y la guía «Claude acaba de matar a Canva» (Rocha) [S][V].
3. **El discurso contra lo genérico vende entre creadores:** «Stop AI slop», `humanizalo` y la
   promesa de *«design that doesn't look AI-generated»* (Rocha) [V][S].
4. **El clon como motor de alcance.** El de Anas sumó 14 M de vistas hasta feb-2025 [S]. La cara
   real la sigue poniendo él, en TV, podcasts y colaboraciones [S].
5. **Subirse a la herramienta nueva.** Rocha tiene al menos 8 guías de anuncios con Claude, varias
   sobre el conector oficial de Meta [S]. Las fechas de cada guía: [NV].

### 3.3 Qué les costó credibilidad (o se la puede costar)

1. **La persona sintética que habla como real** [V: `ugc-ad-meta/workflow/02-script-rules.md`].
   - El guion de ejemplo pone a la mujer generada a decir *«Ahora aprendo de gente que de verdad
     está construyendo cosas»* y *«Yo ya hice mi propia app con Klaud, te juro que sí»*.
   - Con la bandera de IA de Meta y todo, **es un testimonio en la forma**.
   - No se encontró una polémica pública [NV]. Es justo lo que `CLAUDE.md` §5 prohíbe: *«nunca se
     hace pasar por cliente… ni testimonio»*.
2. **La pantalla inventada.** El estilo B de las miniaturas de Muñoz pide *«web mockups,
   dashboards, floating screens»* [V]. Y la plantilla `ui-mockup` de `claude-banana` pide *«enough
   realistic placeholder content… to feel like a functioning application»* [V].
3. **El clon diario y las cifras infladas** (Anas; deuda completa en `ONIA_REFERENTE_ANAS` §2.8).
   El doc de Anas ya concluyó que **un avatar diario mata el pilar de conexión** [O].
4. **La identidad que deriva.** Avatar App Kit lo reconoce: el Teleport da *«someone who looks a
   bit like you»* [V]. Es la misma lección de ONIA con Lucía [O].
5. **El aviso de IA genérico baja la interacción** (~7-8 % en TikTok) [S]. El aviso detallado no
   tiene ese costo (§2.6).

### 3.4 Temas de «marketing con IA» que les rinden como contenido

| Tema | Quién | Evidencia |
|---|---|---|
| **Claude + Meta Ads**, después del conector oficial (29-abr-2026) | Rocha (≥8 guías), Muñoz (skills + video de Skool «Meta Ads y Claude acaba de cambiar todo») | [S][V] |
| **«Así hago mi contenido con IA»**: editor, carrusel, miniaturas, clon | Muñoz («Despedí a mi editor…»), Rocha (Editor Pro Max, Open Carrusel), Anas («Inmortalizándome con IA») | [S][V] |
| **Que no se note la IA** | Rocha («Stop AI slop», `humanizalo`) | [S][V] |
| **Espiar y clonar lo que funciona**: biblioteca de anuncios, virales | Rocha (Cloud Ads Flow, Clonar anuncios), Muñoz (videos virales, `radar`) | [S][V] |
| **Venderle marketing con IA a negocios**: «3 servicios para armar tu agencia» | Rocha. El ejemplo es literal: *«get me all the dentists in Guadalajara with their WhatsApp»* | [S] |
| **La IA y los datos personales** | Anas: su video más viral, 6 M+ | [S] |

**Métricas por tema:** [NV].

**Señal para ONIA** [I]: **los dentistas ya son blanco de las «agencias de IA»** que enseñan estos
referentes. La clínica de Santa Cruz va a recibir ofertas parecidas. Diferenciarse por **producto
visible y cero promesas infladas** es más creíble que por «IA».

---

## 4. Traducción a ONIA: los cuatro en cada formato

### 4.0 Marco (lo que manda sobre esta sección)

- **Etapa 1: 5 clientes.** El cuello de botella no es el contenido: son **los leads sin
  responder** (`contenido/MARCA_ONIA.md` §4). **No se pauta todavía.**
- **Dos audiencias casi sin cruce** (`MARCA_ONIA.md` §1):
  - **`@sergiourcullo`:** jóvenes que quieren **construir o vender con IA**;
  - **`@oniahq`:** el **dueño de una clínica de Santa Cruz**, que pasa la *prueba del vendedor*.
- **Reglas de contenido:** ENSEÑA/PRUEBA; lo inventado se declara; cero cifras de ONIA; cero obra;
  un solo CTA (`SISTEMA_DE_GUIONES.md` §0-§3).
- **Ya descartado** en los docs base: comunidad paga, reventa, cursos de 6-7 h, plataforma con XP
  y cifras de ingreso.

En cada tabla: **qué tomar de CADA referente** para cada cuenta y **qué no**. «—» quiere decir
que ese referente no trabaja el formato o que no aplica a esa cuenta.

### 4.1 YouTube largo

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | cada largo con **su guía de URL estable**: el video enseña y la guía guarda los comandos | la guía para dueños enlazada desde el video | — |
| **Taveras** | **experimento numerado + número en el título + «¿vale la pena?»**, uno por mes (ya guionado en E1-E3) | «**medido en vivo**»: con la clínica de prueba, «¿cuántos pacientes no volvieron? Lo vemos en 10 minutos», con datos de prueba declarados | sorteos |
| **Muñoz** | «**lo hice para alguien en persona**», con consentimiento. **Intro de 60-90 s** con el pipeline que ONIA ya tiene (`editor-videos` / HyperFrames). **Insignias solo con datos ciertos** (edad, Bolivia, días construyendo), confirmados el día de grabar. **Miniatura con foto REAL** y los patrones «lista en pizarra» o «viejo vs nuevo»; texto por código | «configuré Onia para una clínica real», con permiso y sin datos de pacientes ni cifras de resultado | maratones de 6-7 h; «X acaba de destruir a Y»; insignia de «comunidad de N» sin N real; **pantallas inventadas en la miniatura** |
| **Andaloussi** | **la clase en vivo que después se sube** como largo | **clase mensual de 45 min para dueños** (ya propuesta en `ONIA_REFERENTE_ANAS` §4.1) | títulos de plata + edad |

### 4.2 Shorts

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | — (sin datos); se reusa el reel | — | — |
| **Taveras** | recorte del largo **con el número del experimento** | recorte de la demo con **el número que calcula el dueño** | — |
| **Muñoz** | **explainer animado sin cara**, 100 % código. ONIA ya tiene la skill `faceless-explainer` (HyperFrames): no hace falta Remotion | 30 s del **mecanismo con la pantalla real de Onia** | caricatura genérica sin prueba |
| **Andaloussi** | **recortes de charlas** de Sergio Urcullo, cuando existan | recorte de la charla del gremio, si se da | cuentas de clips que nadie controla |

### 4.3 Reels y TikTok

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | gancho de **novedad fechada** («Claude ahora…») con `vence:` a las 48 h (`SISTEMA_DE_GUIONES.md` §2) | — (noticias prohibidas en `@oniahq`) | el emoji como reemplazo de la idea |
| **Taveras** | **número + herramienta + guía**; **el objeto real en cámara** | el número lo pone el dueño (su propia cuenta), nunca una cifra de Onia | cifras de ingreso propias |
| **Muñoz** | **reel partido** (prueba arriba, cara abajo), una palabra resaltada en verde | reel partido con **la pantalla real de Onia arriba** | amarillo/cian; **UGC sintético** |
| **Andaloussi** | el **clon como TEMA** de una sola pieza (con aprobación de costo) y la **historia de origen contada siempre igual** | nada de avatar | un clon que publica a diario |

### 4.4 Carruseles

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | **estructura** (tesis → unidad con su nombre exacto → así no / así sí → lámina que se guarda → criterio) y **motor de código**: ya adoptados | la misma disciplina con la **secuencia de pauta** de la skill (dolor → plata → causa → producto real → mecanismo → control → CTA) | la estética genérica por defecto de Open Carrusel |
| **Taveras** | la lámina de prueba muestra **un objeto o una captura medible** | una lámina con **la lista de reactivación real** (tenant demo) | — |
| **Muñoz** | **ilustración de IA sin letras** (§2.8) y **la receta como recurso** cuando haya palabra activa | IA **solo** para fondo u objeto decorativo | texto dibujado por el modelo; acuarela en todas las láminas; logos o capturas pasados por el modelo |
| **Andaloussi** | subir **las mismas láminas como carrusel de fotos en TikTok**: el carril «Trial» ya va a TikTok mientras la cuenta tenga menos de 1.000 seguidores [I] | el mismo PDF en **LinkedIn** | — |

### 4.5 Historias

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | — [NV] | — | — |
| **Taveras** | — [NV] | — | — |
| **Muñoz** | **secuencia de tres niveles** (sticker → pregunta → recurso). **La palabra clave con el texto nativo de IG**, así el PNG no cambia. **Tercio inferior libre** para el sticker. Encuesta los lunes y lead magnet solo si existe | encuesta o caja de preguntas para **juntar las dudas reales de dueños** («¿sabés cuántos pacientes no volvieron?») | «urgencia» con cupos que no existen |
| **Andaloussi** | — [NV]. Su equivalente es el detrás de escena de la TV | — | — |

### 4.6 LinkedIn

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | — (no lo usa) | — | — |
| **Taveras** | **reacción a una noticia con el dato verificado** y qué significa para un negocio | el mismo formato con un dato **del gremio** (con fuente) | cifras sin fuente |
| **Muñoz** | — (nada propio que copiar) | — | — |
| **Andaloussi** | posts **en primera persona**: gratitud, «mi generación», lanzamientos → «construyendo Onia» | la lección **aplicada a la clínica** | facturación |

### 4.7 Directos

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | **registro gratis con recordatorio y cupo** (tipo Luma): capta el email sin construir nada [I] | lo mismo para la clase de dueños | — |
| **Taveras** | directo **atado a un hito real** (p. ej., llegar a 1.000 seguidores y habilitar los Trial Reels) | — | sorteos con plata |
| **Muñoz** | **uno cada dos semanas**, «construimos en vivo» (ya propuesto), no dos por semana | — | la garantía 1 a 1 |
| **Andaloussi** | la «**clase gratis**» como formato | **clase mensual para dueños** | — |

### 4.8 Guía web

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | **pública, sin registro, una por pieza**. Requiere `/boveda` desplegada; al 25-sep no lo estaba | una guía en el sitio de Onia: «armá hoy la lista de pacientes que no volvieron» [I] | — |
| **Taveras** | la guía **de cada reel, con el archivo** | — | pedir registro para leer |
| **Muñoz** | artículos con el **año en el título**, para buscadores | lo mismo, escrito para el dueño | — |
| **Andaloussi** | landing de **clase gratis** | landing de la clase mensual | «título oficial» |

### 4.9 Comunidad (ya existe: WhatsApp, canal Announcements + grupo General)

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | lo de afuera, **público** (guías); lo de adentro, los archivos | — | — |
| **Taveras** | **presentaciones** y «**mostrá lo que armaste**», sin plataforma | — | plataforma propia con XP |
| **Muñoz** | el directo **dentro** de la comunidad | — | Skool pago; reventa |
| **Andaloussi** | canal gratis de anuncios (ya existe: Announcements) | — | — |

### 4.10 Email / newsletter

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Los cuatro** | **nadie tiene newsletter**: no es prioridad. El email llega solo por el registro a directos y eventos | **el alta de 14 días ya captura el email** | abrir una newsletter ahora: son horas que la Etapa 1 no tiene |

### 4.11 Repos

| Referente | `@sergiourcullo` | Dueño de clínica | No tomar |
|---|---|---|---|
| **Rocha** | **uno por mes**, con portada y arranque en un comando (ya propuesto; lo decide Sergio Urcullo) | — | — |
| **Taveras** | el repo con **historia de producto** (ModelNap), cuando haya uno | — | links de afiliado |
| **Muñoz** | **publicar la propia máquina**. Candidato: la receta del carrusel de §2.8, sin datos ni claves | — | 67 repos: dispersión |
| **Andaloussi** | — | — | — |

---

## 5. Qué depende de Sergio Urcullo

1. **La definición de «carrusel 100 % IA»** (§2.8): el proceso lo hace la IA; el texto y la prueba
   son reales; la IA ilustra sin letras.
   - Si la aprueba, la frase de la skill *«Nunca un carrusel generado entero por IA»*
     (`skills/carruseles-onia.md`) pasaría a decir algo como *«nunca texto, pantallas ni personas
     generadas por IA»*.
   - **Este doc no la editó:** el pedido era un solo archivo nuevo.
2. **Proveedor y tope por lote:**
   - la CLI de Higgsfield no estaba operativa el 22-sep y el cobro sigue en reclamo;
   - la clave de OpenAI existe, pero el precio actual de gpt-image-1 no se verificó.
3. **El experimento del modo píxel** (§2.8, al final): uno, declarado, a ~US$0,5-1,2.
4. **Declarar la IA en el caption** (recomendado) y no borrar metadatos.
5. **Miniaturas de YouTube con su foto real compuesta por IA** (el método de Muñoz). Toca su
   identidad, y el carril de Sergio Urcullo en `HIGGSFIELD_VIDEO_SYSTEM.md` («Lanes» → «Sergio»)
   dice *«Do not use generated face or voice without approval»*.
6. **Habilitar los dominios bloqueados** para mirar de verdad los reels, las duraciones y las
   miniaturas antes de copiarles la forma.

## 6. Pendientes fuera de este objetivo (anotados, no hechos)

1. **La trazabilidad de `references/marca-personal-sergio/fondos/`:**
   - `cuaderno-02.png`, `desk-01.png` y `laptop-03.png` no tienen manifiesto (modelo, prompt,
     costo);
   - `_AB-PROMPTS.png` sugiere que son generados [I];
   - `cuaderno-02.png` es la portada del carrusel modelo del 25-sep.
2. **Un visual «ilustración» en `carousel_pack_editorial.js`**, con una etiqueta que no diga
   «PRODUCTO REAL». Sin eso, la ilustración de IA solo entra en portada y cierre (§2.7). Es
   trabajo de código, con su test.
3. **La tabla de `SISTEMA_DE_GUIONES.md` §7** sigue con un referente por formato. La versión con
   los cuatro es el §4 de este doc. No se editó.
4. **El índice del carril** (`ONIA_CIRCUITO_DE_CONTENIDO.md`) no enlaza este doc ni el de Anas.
5. **Títulos de YouTube con atribución NV** (§1.1): se confirman mirando el canal.

## 7. Fechas deducidas (cómo se calcularon)

Mismo método que en `ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ_20260925.md` §7.

- **TikTok:** `id >> 32` = segundos Unix.
  - Muñoz: 7613430195395022100 → 04-mar-2026; 7629039622542069012 → 15-abr-2026;
    7455319196155530501 → 02-ene-2025; 7461743975469272326 → 19-ene-2025;
    7462817531766525190 → 22-ene-2025; 7509255071813651719 → 27-may-2025.
  - Taveras: 7630902914336230669 (Beelink) → 20-abr-2026; 7517138561552878861 → 18-jun-2025;
    7517544501041188110 → 19-jun-2025.
  - Andaloussi: fotos 7515946731205414166 → 14-jun-2025 y 7518742636019191062 → 22-jun-2025;
    video 7525518150465572118 → 10-jul-2025.
- **LinkedIn:** `activity >> 22` = milisegundos. Andaloussi 7242513391100039168 → 19-sep-2024;
  ESIC (TEDx) 7346426271020605442 → 03-jul-2025.

## 8. Fuentes (todas consultadas el 2026-09-25)

### Repos clonados y leídos [V]

- **Muñoz:**
  - https://github.com/santmun/carousel-horizontes-ia · https://github.com/santmun/carruselesdef ·
    https://github.com/santmun/instagram-carousel-generator · https://github.com/santmun/tweet-carousel ·
    https://github.com/santmun/carruanimados
  - https://github.com/santmun/instagram-stories-skill · https://github.com/santmun/historias-ig-skill ·
    https://github.com/santmun/instagram-stories-generator
  - https://github.com/santmun/thumbnail-horizontes-ia · https://github.com/santmun/intro-edit-pipeline-skill ·
    https://github.com/santmun/ugc-ad-meta · https://github.com/santmun/meta-ads-launch ·
    https://github.com/santmun/horizontes-routines-config · https://github.com/santmun/videos-virales-skill ·
    https://github.com/santmun/radar · https://github.com/santmun/video-pizarra
- **Rocha:**
  - https://github.com/Hainrixz/open-carrusel · https://github.com/Hainrixz/claude-banana ·
    https://github.com/Hainrixz/avater-appkit · https://github.com/Hainrixz/humanizalo ·
    https://github.com/Hainrixz/claude-ads · https://github.com/Hainrixz/construyeconia ·
    https://github.com/Hainrixz/tododeia-animaciones · https://github.com/Hainrixz/tiktok-live-animations
- **Taveras:** https://github.com/eriktaveras/eriktaveras (README del 15-sep-2026) ·
  https://github.com/eriktaveras/esp32-data-panel
- **Terceros:** https://github.com/ecomcirclesocial-ecom/carousel-generator
- **Estrellas, forks y fechas** de los 31 repos de Hainrixz, los 67 de santmun y los 28 de
  eriktaveras: búsqueda de repos del conector de GitHub (`user:<cuenta>`).

### YouTube (títulos por el buscador) [S]

- **Taveras:**
  - https://www.youtube.com/@ErikTaverasT · https://www.youtube.com/channel/UCeo1MU4H-KuPpmUaWiyICIA/videos
  - https://www.youtube.com/watch?v=ecg6gbZXXu8 · https://www.youtube.com/watch?v=M6lZSmgMKxk ·
    https://www.youtube.com/watch?v=IVLUDojtoYU · https://www.youtube.com/watch?v=UKTvIaIXqi4
  - Atribución NV: https://www.youtube.com/watch?v=M5ZSjBnACtM · https://www.youtube.com/watch?v=HTe930O2Gqc ·
    https://www.youtube.com/watch?v=qS6CX5nZk6g
- **Muñoz:**
  - https://www.youtube.com/@SantiMunozIA · https://www.youtube.com/watch?v=QRhX4zU1jso ·
    https://www.youtube.com/watch?v=RSomDkV2Aj0 · https://www.youtube.com/watch?v=x361xBKBdic ·
    https://www.youtube.com/watch?v=w_pyNNAnoAc · https://www.youtube.com/watch?v=cxkJPLiKoy4 ·
    https://www.youtube.com/watch?v=mVzvBewfAuo · https://www.youtube.com/watch?v=KWXIK4iS8OQ
- **Andaloussi:**
  - https://www.youtube.com/@anasandaloussii · https://www.youtube.com/watch?v=36gIZmMB3AY ·
    https://www.youtube.com/watch?v=0qLV_JN7vsU · https://www.youtube.com/watch?v=00gcPM7NZbg ·
    https://www.youtube.com/watch?v=jmNKKyDYWPc · https://www.youtube.com/watch?v=-Jvz7gbtN9E ·
    https://www.youtube.com/watch?v=OZvTy_qRaTY · https://www.youtube.com/watch?v=22le5LxLwws ·
    https://www.youtube.com/watch?v=AqzTzuvzetk
  - Shorts: https://www.youtube.com/shorts/MmtMhv-Q7uI · https://www.youtube.com/shorts/QTD38_yUtmY
  - Atribución NV: https://www.youtube.com/watch?v=sVVJXY71wOQ
- **Rocha:** https://www.youtube.com/@soyenriquerocha (sin títulos largos indexados)

### Reels, TikTok, Threads y Facebook [S]

- **Rocha:**
  - https://www.facebook.com/soyenriquerocha/videos/claude-opus-5-c%C3%B3mo-usarlo-gu%C3%ADa-definitiva-/1064593116125592/
  - https://www.facebook.com/soyenriquerocha/videos/claude-ahora-nunca-va-olvidar-algo-/1472218357716727/
  - https://www.facebook.com/soyenriquerocha/videos/agente-de-whatsapp-con-claude-/2047284662485234/
  - https://www.facebook.com/soyenriquerocha/videos/aprende-a-escribir-prompts-para-claude-/1769065447597207/
  - https://www.facebook.com/soyenriquerocha/videos/aprende-b%C3%A1sicos-de-claude-code-/1513865400096301/
  - https://www.facebook.com/soyenriquerocha/videos/claude-ahora-se-vuelve-tu-equipo-completo-/1049353900962853/
  - https://www.facebook.com/soyenriquerocha/videos/dise%C3%B1a-con-claude-con-las-mejores-skills-/1217481897077607/
  - https://www.facebook.com/soyenriquerocha/videos/combinar-claude-con-codex-es-impresionante-/1045380851557206/
  - https://www.threads.com/@soyenriquerocha/post/Daj7hMmiMDt
- **Muñoz:**
  - https://www.tiktok.com/@sanmunoz.ia/video/7613430195395022100 ·
    https://www.tiktok.com/@sanmunoz.ia/video/7629039622542069012 ·
    https://www.tiktok.com/@sanmunoz.ia/video/7455319196155530501 ·
    https://www.tiktok.com/@sanmunoz.ia/video/7461743975469272326 ·
    https://www.tiktok.com/@sanmunoz.ia/video/7462817531766525190 ·
    https://www.tiktok.com/@sanmunoz.ia/video/7509255071813651719
  - https://www.tiktok.com/discover/prompt-claude-ai-para-crear-carruseles (el prompt de «comentá Carrusel»)
- **Taveras:**
  - https://www.tiktok.com/@erik.py/video/7630902914336230669 ·
    https://www.tiktok.com/@erik.py/video/7517138561552878861 ·
    https://www.tiktok.com/@erik.py/video/7517544501041188110
- **Andaloussi:**
  - https://www.tiktok.com/@anasandaloussi10/photo/7515946731205414166 ·
    https://www.tiktok.com/@anasandaloussi10/photo/7518742636019191062 ·
    https://www.tiktok.com/@anasandaloussi10/video/7525518150465572118

### Guías y sitios [S]

- **Rocha (tododeia):**
  - https://www.tododeia.com/about · https://www.tododeia.com/community/open-carrusel ·
    https://www.tododeia.com/community/claude-design-5-versiones · https://www.tododeia.com/community/claude-design ·
    https://www.tododeia.com/community/cinco-skills-creators · https://www.tododeia.com/community/stop-ai-slop ·
    https://www.tododeia.com/community/stack-ai-contenido · https://www.tododeia.com/community/awesome-gpt-image-2
  - Anuncios: https://www.tododeia.com/community/claude-meta-ads · https://www.tododeia.com/community/andromeda-rules-for-claude ·
    https://www.tododeia.com/community/meta-ads-claude-code · https://www.tododeia.com/community/meta-ads-cli-oficial ·
    https://www.tododeia.com/community/cloud-ads-flow · https://www.tododeia.com/community/clonar-anuncios ·
    https://www.tododeia.com/community/ads-pro · https://www.tododeia.com/community/agencia-marketing-claude
  - Higgsfield y avatares: https://www.tododeia.com/community/avatar-app-kit · https://www.tododeia.com/community/higgsfield-mcp ·
    https://www.tododeia.com/community/higgsfield-director-de-arte · https://www.tododeia.com/community/gpt-6-astra-higgsfield
  - Otros: https://www.tododeia.com/community/3-servicios-agencia-ia · https://www.tododeia.com/community/agente-storytelling ·
    https://www.tododeia.com/community/agente-de-correo · https://luma.com/soyenriquerocha
- **Taveras:**
  - https://comunidad.eriktaveras.com/ · https://comunidad.eriktaveras.com/resources/guia-de-home-lab/ ·
    https://comunidad.eriktaveras.com/resources/guia-monta-tu-primer-home-lab-desde-una-pc-de-100/
  - https://eriktaveras.com/claude-code · https://www.skool.com/academia-n8n-taveras-7451/about ·
    https://www.linkedin.com/in/eriktaveras/ · https://talosflow.io/
- **Muñoz:**
  - https://www.horizontesia.com/ · https://www.horizontesia.com/blog/chatbot-whatsapp-ia-negocio ·
    https://apps.horizontesia.com/ · https://www.horizontesiabot.com/ · https://forjabots.com/en/ ·
    https://www.skool.com/horizontes-ia-9992/about · https://www.linkedin.com/in/santiago-munoz-ibarra/
- **Andaloussi:**
  - https://emprendedores.es/ideas-de-negocio/ia-avatar/ ·
    https://www.eldiariodemadrid.es/articulo/madrid/joven-que-ha-clonado-imagen-ia-revoluciona-redes-sociales/20250207122138090087.html
  - https://www.esic.edu/sala-de-prensa/notasdeprensa/esic-university-reune-en-tedx-esicuniversity-ocho-expertos-para-hablar ·
    https://es.linkedin.com/posts/anas-andaloussi-798203228_udia-activity-7242513391100039168-d4pI
- **Carruseles con IA (terceros):**
  - https://n8n.io/workflows/11694-create-and-publish-instagram-carousels-with-ai-research-nano-banana-pro-and-slack/ ·
    https://n8n.io/workflows/8877-automate-instagram-carousel-creation-with-gpt-5-nano-banana-and-blotato/
  - https://morgandebaun.substack.com/p/how-i-use-claude-design-for-high ·
    https://oliviamba.substack.com/p/94-crea-carruseles-para-instagram ·
    https://metricool.com/claude-ai-carousel-generator-metricool-mcp/ ·
    https://www.tiktok.com/discover/como-corregir-la-ortograf%C3%ADa-de-nano-banana
- **Datos del formato y etiqueta de IA:**
  - https://metricool.com/press-release-instagram-study-2026/ ·
    https://contentdrips.com/blog/2026/06/instagram-reels-vs-carousels-2026-guide/ ·
    https://carouselli.com/blog/instagram-carousel-engagement
  - https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/ ·
    https://influencermarketinghub.com/ai-disclosure-rules/ · https://ssir.org/articles/entry/ai-disclosures-social-media-disengagement ·
    https://link.springer.com/article/10.1007/s12525-026-00883-2
- **Conector de Meta Ads:**
  - https://felipevergara.co/blogs/ia/mcp-meta-ads-claude/ ·
    https://marketing4ecommerce.mx/claude-ya-puede-gestionar-campanas-en-meta-ads/

### Internas (checkout de `onia-hermes`, rama `claude/onia-content-scripts-cvat9r`) [O][V]

- `hermes-content/docs/research/ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ_20260925.md`
- `hermes-content/docs/research/ONIA_REFERENTE_ANAS_ANDALUSI_20260925.md`
- `hermes-content/docs/research/ONIA_STACK_GENERACION_ALTERNATIVAS_20260925.md` (§1.2, §2.3)
- `hermes-content/docs/contenido/SISTEMA_DE_GUIONES.md` (§0-§4, §7) ·
  `hermes-content/docs/contenido/MARCA_ONIA.md` (§1-§4) · `hermes-content/docs/contenido/PUBLICACION.md` (§2)
- `hermes-content/docs/ONIA_MARCA_PERSONAL_TRES_CARRILES.md` (§1)
- `hermes-content/skills/carruseles-onia.md` · `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `scripts/carousel_render.js` · `scripts/carousel_pack_editorial.js` · `scripts/carousel_pipeline.js` ·
  `scripts/openai_image.js`
- `hermes-content/carousels/out/sergio-seguimiento-3-partes-20260925/` ·
  `hermes-content/references/marca-personal-sergio/fondos/`
- `hermes-content/docs/cola/PLAN-VIDEOS-11-20-SEP.md:28`
- `CLAUDE.md` (§2 «Verificar es MIRAR», §3, §5 «Publicidad que no parezca hecha por IA» y
  «Higgsfield»)
