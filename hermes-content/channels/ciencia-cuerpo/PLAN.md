# PLAN — "La Ciencia de tu Cuerpo" (carril `yt-ciencia-cuerpo`)

Canal YouTube faceless, español, long-form (8-12 min), estilo Kurzgesagt: ciencia
visualizada de cómo funciona el cuerpo humano. Motor de ingresos = vistas/AdSense
(CPM), no funnelea a producto (a diferencia de `onia-automatiza`, carril K). Mejora
la salud del espectador **enseñando el mecanismo**, nunca recetando una acción.

Dueño de carpeta: `hermes-content/channels/ciencia-cuerpo/**`. Ver
`COORDINATION_MANIFEST.md` (carril L) y `CLAUDE.md` (sección "Desarrollo en
paralelo — carriles").

## 1. Por qué YMYL manda todo el diseño

Salud = "Your Money or Your Life" para Google/YouTube: la vara de calidad y el
riesgo de sanción son mucho más altos que en el canal hermano. Dos políticas
reales gobiernan cada decisión de este canal (verificadas 2026-07-08):

- **Medical misinformation policy** de YouTube: 3 categorías — *Prevention*,
  *Treatment*, *Denial*. Se elimina contenido que contradiga a una autoridad de
  salud (OMS o nacional) sobre prevención, tratamiento o que niegue que una
  condición existe. [Política oficial](https://support.google.com/youtube/answer/13813322)
  · [Visión de largo plazo de YouTube](https://blog.youtube/inside-youtube/a-long-term-vision-for-medical-misinformation-policies/)
- **Disclosure de contenido alterado/sintético** (`altered or synthetic
  content`), vigente desde 2024 y con enforcement activo desde 2025: obligatorio
  cuando el contenido es **realista** (se podría confundir con algo real). El
  contenido claramente animado/ilustrado, o IA usada solo como *production
  assistance* (guion, miniatura, título), **no** dispara la etiqueta.
  [Blog oficial](https://blog.youtube/news-and-events/disclosing-ai-generated-content/)
  · [Ayuda: cómo se hizo este contenido](https://support.google.com/youtube/answer/15447836)

**Consecuencia de diseño:** el canal se mantiene siempre en el lado seguro de
ambas políticas si:
1. Cada video **explica un mecanismo** (qué le pasa a una célula/órgano/sistema),
   nunca prescribe una acción ("hacé esto", "dejá de comer X", "esto cura Y").
2. El estilo visual es **ilustración/animación estilizada** (células, órganos,
   diagramas abstractos — como Kurzgesagt), no video foto-realista de personas o
   eventos reales. Esto es intencional por 3 razones: (a) evita casi por completo
   el gatillo de "contenido sintético realista", (b) es el lenguaje visual real
   de este género (Kurzgesagt es ilustración plana, no video generado), y (c) es
   **mucho más barato** — ver §5 Presupuesto.
3. Cada afirmación causal tiene fuente citada real (paper revisado por pares, NIH,
   OMS, CDC) — nunca una afirmación "porque sí" o de memoria del modelo.

Aun así, **por regla de Sergio (no negociable), el toggle "AI use" se deja
siempre en ON/Yes** en la subida (`status.containsSyntheticMedia = true` en el
script), aunque la política estricta de YouTube no lo exigiría para animación
estilizada. Es el default seguro: falso positivo de disclosure no tiene costo;
un falso negativo si YouTube reclasifica el contenido como más realista de lo
pensado sí lo tiene (strike, remonetización forzada, ver §7).

## 2. Formato y cadencia

- **Duración:** 8-12 min (long-form, monetizable con anuncios medios; también
  habilita capítulos).
- **Estructura estándar** (ajustar por tema):
  1. Hook (0:00-0:20): pregunta o dato que rompe intuición ("¿Por qué tu cuerpo
     se incendia a propósito cuando tenés fiebre?").
  2. Contexto (0:20-1:30): qué sabemos, por qué importa.
  3. Mecanismo, paso a paso (1:30-8:00): el cuerpo del video — 3 a 5 "escenas"
     de mecanismo, cada una con su propio micro-hook.
  4. Qué NO sabemos todavía / matices (8:00-9:30): honestidad científica,
     evita sobre-simplificar.
  5. Cierre + disclaimer + CTA de suscripción (9:30-fin).
- **Cadencia recomendada para arrancar: 1-2 videos/semana** (no 2-3). Motivo:
  ver la matemática de créditos en §5 — a 2-3/semana con calidad Kurzgesagt el
  gasto en Higgsfield excede el plan mensual. Subir cadencia una vez que exista
  biblioteca de assets reusable (§5) y datos reales de qué temas rinden.
- **Idioma:** español (arbitraje de idioma: el nicho ciencia/salud explicativa
  está mucho más saturado en inglés que en español).

## 3. Los 20 temas — ángulo/tesis + fuente verificada

Ángulo Kurzgesagt: cada tema es un **mecanismo**, no un consejo. Fuente = la
verificada esta sesión (2026-07-08) vía búsqueda directa, no memoria del modelo.
`★` = piloto de esta sesión.

| # | Tema | Ángulo / tesis | Fuente verificada |
|---|------|-----------------|--------------------|
| 1★ | Azúcar y el cerebro | El azúcar activa el mismo circuito dopaminérgico mesolímbico (núcleo accumbens) que ciertas drogas de abuso — mecanismo real y medible, no metáfora | [Sugars and Sweet Taste: Addictive or Rewarding? (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8468293/) · [Intense Sweetness Surpasses Cocaine Reward (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC1931610/) |
| 2 | Qué hace el cerebro mientras dormís | El sistema glinfático "lava" el cerebro de desechos metabólicos durante el sueño profundo; depende de que baje la noradrenalina | [The Sleeping Brain and the Glymphatic System (PMC/NIH)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7698404/) · [Nature Reviews Neurology 2024](https://www.nature.com/articles/s41582-024-00963-x) |
| 3 | Cómo tu sistema inmune reconoce un virus en minutos | Dos sistemas en capas: el innato ataca todo por igual en horas, el adaptativo aprende y recuerda de por vida | [Overview of the Immune System (NIAID/NIH)](https://www.niaid.nih.gov/research/immune-system-overview) |
| 4 | Por qué las células dejan de dividirse (envejecimiento) | Las células senescentes no mueren, "se jubilan mal": dejan de dividirse pero siguen secretando señales inflamatorias (SASP) que dañan el tejido vecino | [Hallmarks and mechanisms of cellular senescence (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12322153/) |
| 5 | El microbioma que decide tu ánimo | Comunicación bidireccional intestino-cerebro vía nervio vago, hormonas e inmunidad — el eje microbiota-intestino-cerebro | [The Brain-Gut-Microbiome Axis (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6047317/) |
| 6 | Qué le hace el cortisol a tu cuerpo día tras día | El sistema de estrés agudo salva la vida; el mismo eje HPA activado crónicamente enferma — "motor acelerado todo el día" | [Understanding the stress response (Harvard Health)](https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response) |
| 7 | Cómo una fibra muscular rota se vuelve más fuerte | El entrenamiento no "rompe" músculo per se: activa mTORC1, que ordena sintetizar más proteína muscular de la que se dañó | [Molecular responses to acute exercise (Physiological Reviews)](https://journals.physiology.org/doi/full/10.1152/physrev.00054.2021) |
| 8 | Qué es realmente la autofagia (ayuno intermitente) | El mecanismo de "reciclaje celular" es real en modelos animales; en humanos la evidencia es todavía mixta/limitada — buen tema para bajar el hype sin negar la biología | [Ensayo clínico NIH NCT02673515](https://clinicaltrials.gov/study/NCT02673515) · [Estudio en humanos 2026 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/40345145/) |
| 9 | Por qué tu cuerpo se "incendia" a propósito (fiebre) | La fiebre no es un error: sube la temperatura del campo de batalla porque a las células inmunes les conviene más el calor que a los patógenos | [NIH Research Matters: fever and immune cells](https://www.nih.gov/news-events/nih-research-matters/how-heat-fever-inflammation-affects-immune-cells) · [Physiology, Fever (StatPearls/NIH)](https://www.ncbi.nlm.nih.gov/books/NBK562334/) |
| 10 | Cómo una vacuna le enseña a tu cuerpo a recordar | Una vacuna es un simulacro de incendio: entrena células de memoria B y T sin el riesgo real de la enfermedad | [Explaining How Vaccines Work (CDC)](https://www.cdc.gov/vaccines/basics/explaining-how-vaccines-work.html) · [Understand memory, design better vaccines (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3303227/) |
| 11 | Por qué el café te despierta (y por qué deja de funcionar) | La cafeína no da energía: bloquea receptores de adenosina (A2A), tapando la señal de sueño que sigue acumulándose | [Adenosine, caffeine, and sleep-wake regulation (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9541543/) |
| 12 | Qué le hace el alcohol al cerebro y al hígado, minuto a minuto | Seguir una copa de alcohol por el hígado (acetaldehído tóxico) y el cerebro (comunicación neuronal alterada) en tiempo real | [Alcohol Metabolism (NIAAA)](https://www.niaaa.nih.gov/publications/alcohol-metabolism) · [Alcohol's Effects on the Body (NIAAA)](https://www.niaaa.nih.gov/alcohols-effects-health/alcohols-effects-body) |
| 13 | Cómo tu cerebro decide que algo duele | El dolor no ocurre en el dedo golpeado: la nocicepción es la señal, el dolor es la interpretación cerebral (por eso el mismo golpe duele distinto según contexto) | [Pain Processing in the Human Nervous System (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3438523/) · [The Anatomy and Physiology of Pain (NCBI/NIH)](https://www.ncbi.nlm.nih.gov/books/NBK219252/) |
| 14 | Las 3 fases de curar una herida | Curar una herida es una obra en construcción de hasta un año: hemostasia/inflamación → proliferación → remodelación, con un equipo celular distinto en cada fase | [Wound Healing: A Comprehensive Review (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8432991/) |
| 15 | Por qué tus huesos se demuelen y reconstruyen solos | Osteoclastos derriban, osteoblastos construyen — una negociación celular permanente que da forma al esqueleto | [Osteoblast-Osteoclast Communication and Bone Homeostasis (PMC/NIH)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7564526/) |
| 16 | La cascada hormonal que reconstruye un cuerpo (pubertad) | Un interruptor en el hipotálamo (eje HPG) se enciende y desata años de cascada hormonal que reconstruyen el cuerpo entero | [Hypothalamic control of puberty (Frontiers in Endocrinology)](https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2019.00828/pdf) |
| 17 | Cómo se forma un recuerdo a nivel neuronal | Un recuerdo no se "guarda" en un lugar: es un patrón de conexiones neuronales que se vuelve físicamente más fuerte (potenciación a largo plazo) | [The synaptic plasticity and memory hypothesis (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3843897/) |
| 18 | Qué pasa en el cerebro cuando algo se vuelve adictivo | No es "falta de voluntad": el circuito de recompensa se recalibra y sube el umbral de lo que se siente placentero (tolerancia) | [Drugs, Brains, and Behavior: The Science of Addiction (NIDA)](https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/drugs-brain) |
| 19 | El reloj de 24h que corre en cada una de tus células | No hay un solo reloj: cada célula corre su propio cronómetro molecular (genes CLOCK/BMAL1/PER/CRY), sincronizado por un reloj maestro en el hipotálamo | [2017 Nobel Prize — mecanismos moleculares del ritmo circadiano (PMC/NIH)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6138759/) |
| 20 | Cómo una pastilla de azúcar cura de verdad (efecto placebo) | El efecto placebo no es "en tu cabeza" en sentido despectivo: libera opioides y dopamina reales, medibles, con mecanismo neuroquímico propio | [Neurobiological Mechanisms of the Placebo Effect (PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6725834/) |

Backlog completo con notas de producción y fuentes secundarias vive en
`pipeline/topics-backlog.json` (mismo contenido, formato máquina para que el
pipeline lo consuma).

## 4. Guardrails YMYL (duros — bloquean publicación si fallan)

1. **Cero consejo/diagnóstico/cura.** Ningún guion puede decir "hacé esto",
   "dejá de", "tomá X", "esto cura/previene Y". Se permite: "así es como el
   cuerpo hace Z". Filtro simple: si la frase se puede responder con "¿debería
   yo hacer esto?", está mal formulada — reescribir a mecanismo.
2. **Fuente real por afirmación causal**, no por video. Guion trae marcador
   `[n]` inline; la descripción resuelve `[n]` a URL real. Nunca inventar un
   estudio, nunca citar "un estudio dice" sin URL verificable.
3. **Disclaimer obligatorio**, textual, en dos lugares:
   - Hablado o en pantalla dentro del video (dentro de los primeros 60s o en el
     cierre): *"Este video es contenido educativo y no reemplaza el consejo de
     un profesional de la salud."*
   - Primera línea de la descripción de YouTube (mismo texto).
4. **No tratamiento/prevención/negación de una condición específica.** Si un
   tema roza tratamiento (ej. ayuno, fiebre), el guion se mantiene en "qué hace
   el cuerpo", nunca en "qué deberías hacer vos". Dos fuentes independientes
   mínimo si el tema es sensible (cáncer, vacunas, salud mental, adicciones).
5. **Sin personaje "experto/doctor" de IA.** No se inventa un presentador con
   bata blanca ni credenciales falsas. Voz narradora neutral, sin afirmar
   autoridad médica.
6. **Anti-baneo (política jul-2025 "inauthentic content").** Igual que
   `onia-automatiza`: ángulo propio + variedad real entre videos + fuentes
   citadas + calidad de producción real. Prohibido: guion de LLM sin editar,
   voz genérica de stock, slideshow de stills sin animación, subir en tandas
   idénticas.
7. **Disclosure "AI use" = ON siempre** en la subida (ver §1), sin importar que
   la política estricta no lo exija para animación estilizada.
8. **Nada se publica sin aprobación explícita de Sergio** — incluye script,
   asset visual final y decisión de publicar (ver `pipeline/approval-matrix.json`).

## 5. Presupuesto de producción — la matemática que define el estilo visual

Cuenta actual: Higgsfield plan **Ultra**, 3000 créditos/mes (verificado en esta
sesión). Un video de 8-12 min generado como **video continuo** de Higgsfield
sería insostenible: incluso al modelo barato (`kling3_0_turbo`/`seedance_2_0`,
~5-9 créditos por segundo según `video-factory/engine/higgsfield/adapter.mjs`),
8-12 min (480-720s) cuestan **2400-6480 créditos — 1 a 2 meses enteros de plan
en un solo video.** Esto no es viable ni es el lenguaje visual correcto para
este género de todos modos (Kurzgesagt es ilustración plana con movimiento
simple, no video foto-realista continuo).

**Modelo de producción real (barato + correcto para el estilo):**

- **Biblioteca de assets reusable** (construir una vez, amortizar entre
  videos): ~100-150 ilustraciones base de órganos/células/sistemas/fondos
  abstractos en el estilo visual del canal (paleta + trazo fijos). Costo de
  imagen es mucho menor que video (referencia: plan Ultra estima ~12.000
  imágenes con nano-banana/seedream por los mismos 3000 créditos/mes, es decir
  ~0.25 créditos/imagen en promedio).
- **Por video:** 40-60 stills (nuevos + reusados de la biblioteca) animados con
  pan/zoom tipo Ken Burns vía `ffmpeg` (gratis, sin costo de crédito) +
  10-15 clips "hero" cortos (5-8s, modelo barato) para los 3-5 momentos de
  mayor impacto del guion.
- **Estimación por video piloto:** ~50 imágenes nuevas (~15-25cr) + 12 clips
  hero de 6s @ ~7cr/s (~500cr) ≈ **550-650 créditos por video** — ver desglose
  real en `pilot/001-azucar-y-el-cerebro/shot-list.json`.
- **A 1-2 videos/semana** (4-8/mes) esto da ~2200-5200 créditos/mes — todavía
  ajustado contra el plan de 3000cr, por eso la recomendación es **empezar en
  1/semana**, medir qué tanto se puede reusar la biblioteca (el costo baja con
  cada video porque se reusan más stills), y subir cadencia con datos reales o
  con top-up de créditos si el rendimiento (vistas/RPM) lo justifica.
- **Voz narrada:** no sale de créditos Higgsfield — usa el stack de audio ya
  existente en el repo (`hermes-content/skills/audio-elevenlabs.md`). Costo
  separado, a confirmar por minuto de narración final.

Ningún gasto real ocurre sin aprobación de Sergio — ver §7 y
`pipeline/approval-matrix.json`.

## 6. Herramientas de tendencia (selección de tema)

Mismo stock de herramientas que `onia-automatiza` (carril K), aplicado a
ciencia/salud en vez de AI-tools:

- **Google Trends** (gratis): estacionalidad real — "sistema inmune" sube en
  temporada de gripe, "sueño" sube en enero (propósitos de año nuevo), "estrés"
  sube en época de exámenes/fin de año fiscal.
- **Autocomplete de YouTube + pestaña Trends** (gratis): intención real de
  búsqueda en español — ej. "por que no puedo dormir", "que le hace el azucar
  al cuerpo". Frasear el hook del video con el lenguaje real de la búsqueda.
- **vidIQ** (free/pago): volumen de búsqueda vs. competencia por keyword,
  filtro por idioma/país — para decidir el orden de producción de los 20 temas.
- **TikTok Creative Center** (gratis): qué ángulos de "body science" ya están
  virales en corto — se adapta el ÁNGULO a long-form, nunca se copia el video.
- **Regla:** un tema con alto volumen de búsqueda en español + pocos
  explicadores en video largo y bien producido en español = hueco real.

## 7. Matriz de aprobación (resumen — completa en `pipeline/approval-matrix.json`)

| Acción | Permitido sin Sergio | Texto de aprobación requerido |
|--------|----------------------|-------------------------------|
| Investigar tema, armar research brief, escribir guion, fact-check | Sí | — |
| Crear prompts visuales / shot list | Sí | — |
| Generar imágenes/video pagos (Higgsfield) | No | `Apruebo generación IA pagada: <pilot_id> presupuesto <creditos>` |
| Generar voz narrada paga | No | `Apruebo voz IA pagada: <pilot_id> presupuesto <monto>` |
| Conectar YouTube API (OAuth) | No | `Apruebo conectar YouTube API: <channel_id>` |
| Subida privada a YouTube | No | `Apruebo subida privada YouTube: <content_id>` |
| Publicación pública | No | `Apruebo publicar YouTube: <content_id>` |
| Activar cron/n8n autónomo | No | `Apruebo schedule n8n: <workflow_id>` |

## 8. Pipeline (resumen — detalle en `pipeline/README.md`)

`tema → research brief con fuentes → guion con marcadores [n] → shot list
(Higgsfield + ffmpeg pan/zoom) → ensamblado + narración → metadata (título,
descripción con fuentes resueltas, tags, miniatura, disclaimer) → DRY-run de
subida → gate Sergio → subida privada real → gate Sergio → público.`

## 9. Fase 0 — lo que solo Sergio puede hacer

1. Crear el canal de YouTube "La Ciencia de tu Cuerpo" (o confirmar nombre
   final si cambia).
2. Google Cloud: proyecto + credenciales OAuth 2.0 (client id/secret, tipo
   Desktop) con scope `youtube.upload`, y **pasar la auditoría de compliance**
   de Google (gratis; sin ella las subidas quedan en privado — bloqueo real,
   igual que en `onia-automatiza`). Hoy no existe ninguna credencial de
   YouTube en n8n (`list_credentials` solo devuelve Sheets/Calendar/Drive de
   Google) — confirmado en esta sesión.
3. Confirmar cadencia real (1/semana recomendado para arrancar vs. 2-3 del
   brief original) y presupuesto mensual de créditos Higgsfield para este
   canal (ver §5 — la matemática de 2-3/semana excede el plan Ultra actual).
4. Aprobar el piloto (`pilot/001-azucar-y-el-cerebro/`) antes de gastar
   créditos reales de generación — ver §7.

## Fuentes generales de esta investigación (2026-07-08)

Todas las fuentes de la tabla §3 más: [Medical misinformation policy — YouTube Help](https://support.google.com/youtube/answer/13813322) ·
[A long term vision for YouTube's medical misinformation policies](https://blog.youtube/inside-youtube/a-long-term-vision-for-medical-misinformation-policies/) ·
[How we're helping creators disclose altered or synthetic content](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) ·
[Understanding "How this content was made" disclosures](https://support.google.com/youtube/answer/15447836) ·
[YouTube Data API v3 — Videos resource / containsSyntheticMedia](https://developers.google.com/youtube/v3/docs/videos).
