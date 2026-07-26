# PLAN — "Máquina Humana" (carril `yt-ciencia-cuerpo`)

> Marca pública del canal: **Máquina Humana** (definida con Sergio 2026-07-09). El
> slug interno de la carpeta/carril sigue siendo `ciencia-cuerpo` — no se renombra
> para no romper referencias del manifest/lane; es solo un identificador interno.

Canal YouTube faceless, español, long-form (8-12 min), estilo Kurzgesagt: la ciencia
de **cómo rendís mejor — cuerpo y mente**. Qué pasa adentro tuyo cuando dormís, te
concentrás, te estresás, aprendés o te desmotivás, explicado para que entiendas cómo
funcionás. Motor de ingresos = vistas/AdSense (CPM), no funnelea a producto (a
diferencia de `onia-automatiza`, carril K).

**El marco "rendí mejor" (elegido con Sergio 2026-07-09):** el enfoque es
performance/autoconocimiento — mejor CPM y más buscado que "cuerpo" a secas, y menos
riesgoso que salud-medicina pura. PERO es también el más fácil de resbalar a consejo,
que es justo lo que el YMYL castiga. Por eso el canal se rige por una **regla dura**
(ver §4.0): **el título promete rendir, el video explica el mecanismo, la conclusión
la saca el espectador. Nunca "hacé esto".**

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
  1. Hook (0:00-0:20): gancho de rendimiento + dato que rompe intuición ("¿Por
     qué no te podés concentrar? No es falta de voluntad — mirá lo que pasa
     adentro de tu cerebro").
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
- **Motor de crecimiento (definido 2026-07-09):** cada long-form genera 2-3
  **Shorts** verticales (imán de suscriptores para la mitad "1.000 subs" del
  umbral YPP, ver §10); **packaging fuerte** (título + miniatura con el gancho de
  rendimiento = la palanca #1 de crecimiento en YouTube); y **estructura de serie**
  por tema (foco, sueño, motivación…) para encadenar vistas y construir la mitad
  "4.000 horas".
- **Idioma:** español (arbitraje: la ciencia explicativa de cuerpo+mente está
  mucho más saturada en inglés que en español). Reafirmado 2026-07-09: español
  para crecer de verdad; inglés queda como clon a futuro (el pipeline es agnóstico
  al idioma, solo cambian guion y voz).

## 3. Los 20 temas — gancho de rendimiento + mecanismo + fuente

Cada tema tiene DOS caras (ver §4.0): un **gancho de rendimiento** (el título, lo
que promete) y un **mecanismo** (lo que el video realmente explica, sin recetar).
`✓` = fuente ya verificada (búsqueda directa, no memoria del modelo). `○` = tema
nuevo del marco "rendí mejor"; su fuente se fija y verifica en el
`research-brief.json` ANTES de producir (gate duro del pipeline, §8) — nunca se
produce sin fuente real. `★` = piloto.

| # | Título (gancho de rendimiento) | Mecanismo que explica | Fuente |
|---|--------------------------------|------------------------|--------|
| 1★ | Por qué querés MÁS (azúcar y tu cerebro) | El azúcar pega en el mismo circuito dopaminérgico de recompensa que engancha; dos vías (sabor + calorías) | ✓ [Addictive or Rewarding? (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8468293/) · [Sweetness vs Cocaine (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC1931610/) |
| 2 | Por qué rendís mal sin dormir | El sistema glinfático "lava" el cerebro en el sueño profundo; sin eso se acumulan desechos | ✓ [Glymphatic system (NIH)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7698404/) |
| 3 | Por qué rendís peor bajo presión | El eje HPA/cortisol salva en agudo, pero crónico degrada foco y memoria | ✓ [Stress response (Harvard)](https://www.health.harvard.edu/staying-healthy/understanding-the-stress-response) |
| 4 | Por qué el café te deja de despertar | La cafeína tapa la adenosina (señal de sueño), que igual se sigue acumulando | ✓ [Adenosine & caffeine (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9541543/) |
| 5 | Cómo tu cerebro fija lo que aprendés | La memoria es un patrón de conexiones que se refuerza físicamente (LTP) | ✓ [Synaptic plasticity & memory (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3843897/) |
| 6 | El reloj interno que decide tu energía | Cada célula corre su reloj molecular, sincronizado por el hipotálamo | ✓ [Circadian Nobel 2017 (NIH)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6138759/) |
| 7 | Por qué es tan fácil engancharte | El circuito de recompensa se recalibra: sube el umbral del placer (tolerancia) | ✓ [Science of Addiction (NIDA)](https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/drugs-brain) |
| 8 | Por qué el mismo golpe duele distinto | El dolor no está en la herida: lo construye el cerebro según contexto | ✓ [Pain processing (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3438523/) |
| 9 | Cómo tu mente cura de verdad (placebo) | El placebo libera opioides y dopamina reales, medibles | ✓ [Placebo mechanisms (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6725834/) |
| 10 | Cómo un músculo roto se vuelve más fuerte | El entrenamiento activa mTORC1 → sintetiza más proteína de la que se dañó | ✓ [Molecular responses to exercise (Physiol Rev)](https://journals.physiology.org/doi/full/10.1152/physrev.00054.2021) |
| 11 | Cómo tu intestino te cambia el ánimo | Eje intestino-cerebro vía nervio vago, hormonas e inmunidad | ✓ [Brain-Gut-Microbiome (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6047317/) |
| 12 | Qué le hace el alcohol a tu cerebro, minuto a minuto | Acetaldehído tóxico en el hígado + comunicación neuronal alterada, en tiempo real | ✓ [Alcohol metabolism (NIAAA)](https://www.niaaa.nih.gov/publications/alcohol-metabolism) |
| 13 | Por qué envejecés (por dentro) | Células senescentes "se jubilan mal": dejan de dividirse pero secretan señales que dañan el tejido vecino | ✓ [Cellular senescence (NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12322153/) |
| 14 | Cómo tu cuerpo reconoce un virus en minutos | Innato (rápido, ataca todo) + adaptativo (aprende y recuerda de por vida) | ✓ [Immune system (NIAID)](https://www.niaid.nih.gov/research/immune-system-overview) |
| 15 | Por qué no te podés concentrar | Redes de atención + el costo real de cambiar de tarea (el "multitasking" no existe como creés) | ○ por verificar en research-brief |
| 16 | Por qué dejás todo para después | Sesgo del presente: el sistema límbico (quiere ya) le gana al prefrontal (piensa en después) | ○ por verificar en research-brief |
| 17 | Por qué un hábito se pega y cuesta romperlo | Bucle señal → rutina → recompensa; los ganglios basales lo automatizan | ○ por verificar en research-brief |
| 18 | Por qué arrancás con todo y después abandonás | La dopamina de la anticipación no es la misma que la de la recompensa | ○ por verificar en research-brief |
| 19 | Qué pasa en tu cerebro cuando tenés miedo | La amígdala dispara la alarma antes de que "pienses" el peligro | ○ por verificar en research-brief |
| 20 | ¿Se te agota la fuerza de voluntad? | Fatiga de decisión: lo que la evidencia muestra y lo que sigue en debate (honesto, no hype) | ○ por verificar en research-brief |

Banco de variedad (cuerpo puro, fuente ya verificada en el historial de esta
investigación, para intercalar y dar aire al canal): fiebre, vacunas, curar una
herida, huesos que se reconstruyen, pubertad, autofagia/ayuno intermitente.

Backlog en formato máquina: `pipeline/topics-backlog.json` (lo consumen el pipeline
y el radar; cada tema se completa y verifica su fuente en su `research-brief.json`
antes de producir).

## 4. Guardrails YMYL (duros — bloquean publicación si fallan)

0. **Regla del marco "rendí mejor" (la más importante de este canal).** El
   enfoque performance/autoconocimiento es el que más fácil se resbala a consejo.
   Blindaje: **el título/miniatura prometen rendir (gancho jugoso), el video
   explica el MECANISMO, y la conclusión práctica la saca el espectador solo.**
   Ejemplo correcto: título *"Por qué no te podés concentrar"* → adentro explico
   qué pasa con la atención y la dopamina, NO doy una lista de tips. Prohibido que
   el video derive en "para concentrarte hacé X". Si el guion cruza a receta, se
   reescribe o no se publica. Esta regla hace compatible el marco elegido con el
   resto del §4.
1. **Cero consejo/diagnóstico/cura.** Ningún guion puede decir "hacé esto",
   "dejá de", "tomá X", "esto cura/previene Y". Se permite: "así es como el
   cuerpo/cerebro hace Z". Filtro simple: si la frase se puede responder con
   "¿debería yo hacer esto?", está mal formulada — reescribir a mecanismo.
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

## 10. Distribución short-form (Shorts + TikTok) — agregado 2026-07-08

Pregunta de Sergio tras el primer entregable. No estaba en el brief original
(long-form 8-12min), investigado y verificado antes de construir.

**La idea central: los shorts no cuestan créditos nuevos.** Cada short se
recorta de los assets que el video largo YA generó (hero clips + stills del
`shot-list.json`), re-encuadrados a 9:16 con `ffmpeg`. Cero llamadas
adicionales a Higgsfield. Ver `pilot/001-azucar-y-el-cerebro/shorts-plan.json`
para el ejemplo real (3 shorts cortados del piloto).

### YouTube Shorts — no requiere integración nueva

YouTube clasifica un video como Short automáticamente por formato: **9:16,
≤3 minutos** (ya no hace falta el hashtag `#Shorts`, aunque ayuda a la
categorización). Se sube por el **mismo endpoint y el mismo script** que el
video largo (`scripts/upload-youtube.mjs`, `videos.insert`) — solo cambia el
archivo de video (vertical, corto) y el `metadata.json` (título/caption más
cortos). Mismas reglas duras: `containsSyntheticMedia: true`,
`made_for_kids: false`, `privacyStatus: "private"` hasta aprobación.

### TikTok — SÍ requiere una integración y una auditoría nuevas

Verificado contra la documentación oficial de TikTok (2026-07-08):

- API: **Content Posting API**, endpoint `POST /v2/post/publish/inbox/video/init/`
  con `source_info.source = "FILE_UPLOAD"` (subida por chunks) — ver
  `scripts/upload-tiktok.mjs`.
- **Dos modos, uno de los dos está prohibido en este canal:**
  - `DIRECT_POST` (scope `video.publish`) publica derecho al perfil — **no se
    usa nunca en este pipeline**, mismo espíritu que nunca subir "public" a
    YouTube.
  - `MEDIA_UPLOAD`/bandeja (scope `video.upload`) manda el video al inbox de
    TikTok y **una persona lo tiene que terminar de publicar a mano adentro
    de la app** — este es el modo que usa `scripts/upload-tiktok.mjs`, siempre,
    sin flag para cambiarlo. Ventaja real: el "nunca publicar sin aprobación
    humana" queda garantizado por el diseño de la propia API de TikTok, no
    solo por una regla nuestra.
  - Antes de publicar hay que llamar `creator_info/query` (requisito de la
    API, trae opciones de privacidad y duración máxima del creador).
- **Auditoría de TikTok** (2-6 semanas, igual de real que la de Google): sin
  una app aprobada por TikTok for Developers, el contenido queda restringido
  a "solo privado" — mismo patrón que YouTube, bloqueo nuevo e independiente.
  Bloqueo humano: Sergio tiene que registrar la app en
  [TikTok for Developers](https://developers.tiktok.com/) y pedir el scope
  `video.upload`.
- **Disclosure IA:** la Content Posting API **no expone hoy un campo
  equivalente a `containsSyntheticMedia`** (a diferencia de YouTube). Como el
  modo `MEDIA_UPLOAD` igual pasa por un humano dentro de la app, la mitigación
  es que **Sergio active el toggle "AI-generated content" de TikTok a mano**
  al terminar de publicar — el script se lo recuerda en pantalla.
- Specs de video: MP4/WebM, 3-600s, ≤4GB, 9:16 recomendado.

### Qué falta para que esto corra de verdad

1. Sergio: cuenta de creador en TikTok + registrar app en TikTok for
   Developers + pedir scope `video.upload` + pasar la auditoría (bloqueo
   real, no depende de esta sesión).
2. Mismo gate de siempre: nada se sube ni en YouTube Shorts ni en TikTok sin
   aprobación de Sergio (ver `pipeline/approval-matrix.json`).

## 11. Auditoría de capacidades Higgsfield — agregado 2026-07-08 (solo lectura, nada generado)

Pedido de Sergio: familiarizarse con todas las funciones de Higgsfield antes
de generar. Hecho vía herramientas de solo lectura del MCP (`balance`,
`transactions`, `models_explore`, `presets_show`, `get_workflow_instructions`,
etc.) — cero llamadas a `generate_*`.

### Hallazgo crítico: el pool de créditos es compartido y hay gasto concurrente activo

`list_workspaces` devuelve **un solo workspace** (privado, plan Ultra). Todos
los carriles que usan Higgsfield gastan del mismo pool. Balance real al
momento de esta auditoría: **2545.72 / 3000 créditos** — ya se gastaron
~454cr este ciclo. Y en `transactions` se ve gasto **activo en los últimos
~90 minutos** (11× Nano Banana Pro, Minimax Hailuo, Marketing Studio Video,
Wan 2.7, Seed Audio) que **no es de esta sesión** — es contenido UGC de otro
carril (Lucía/protector solar, contenido financiero) corriendo en paralelo.
Conclusión: el presupuesto de §5 de este documento **compite en tiempo real**
con el resto de ONIA, no es un presupuesto aislado de este canal. Cualquier
aprobación de gasto debería considerar esto.

### El workflow nativo "video-explainer" existe y calza casi exacto con este canal — pero es mucho más caro

`get_workflow_instructions(workflow="video-explainer")`: narrador único sobre
**N bloques fijos de 10s** (`N = minutos × 6`), un "style key" (una imagen)
que fija el look en TODOS los clips, ensamblado 100% server-side
(`explainer_video`, sin ffmpeg local), subtítulos opcionales quemados
(+0.05cr/bloque). Para un video de 9-10min esto es **N=54-60 bloques**.

- **Costo:** cada bloque es video real generado con `gemini_omni` (modelo
  "reference-driven video, native audio", no expone tarifa exacta en
  `models_explore`, pero por tier es plausible 5-10cr/s). 54-60 bloques × 10s
  × 5-10cr/s ≈ **2700-6000 créditos — 1 a 2 meses de plan completo en un solo
  video.** El pipeline custom de este canal (mayoría stills + 5 clips hero,
  ver §5 y `pilot/001-azucar-y-el-cerebro/shot-list.json`) estima ~360cr:
  **8-15x más barato.**
- El propio workflow **exige preguntarle a Sergio** estilo (galería
  obligatoria), duración, mascota, aspecto y subtítulos antes de generar
  nada — "never decide silently, never proceed without their answer". Mismo
  espíritu que nuestra regla de aprobación, pero más granular.
- 10 presets en `get_youtube_explainer_presets`: Pixel Art, Claymotion, Mixed
  Media, 3D Papercraft, **2D Illustrator** (el más parecido a Kurzgesagt),
  Whiteboard Doodle, Low Poly, 3D Mix, Isometric Flat Vector, Fluffy Toy.
  **Sin confirmar todavía:** los 10 presets están listados en `9:16`, y el
  propio doc dice "let the preset set the aspect" — no verifiqué si se puede
  forzar `16:9` (long-form horizontal) usando un preset, o si hace falta
  construir un style-key propio (rama "no photos" de la Fase 1) para eso.
- **Recomendación:** seguir con el pipeline custom (barato, ya construido y
  probado) para el piloto y la cadencia semanal. Reservar el workflow nativo
  para un video "insignia" puntual si el presupuesto lo justifica más
  adelante — no como default.

### Otros hallazgos

- **IDs de modelo reales** (mi `shot-list.json` tenía el placeholder
  `"nano_banana"`, corregido a `"nano_banana_pro"` en esta sesión — mejor
  ajuste además, porque sus tags incluyen `diagrams`/`text-rendering`).
  `kling3_0_turbo` (mis clips hero) sí era un ID real, confirmado.
- **Voces:** 30+ voces preset (`list_voices`). "Elena" ya se usó antes en
  este workspace para narración en español (ver memoria
  `content-engine-remotion`, video Nuvia/ISDIN) — candidata natural, pero la
  elección de voz es siempre de Sergio, tanto por nuestra regla como por la
  regla dura del propio workflow de Higgsfield.
- **Presets "virales"** (`presets_show`, 40+ items: DRIFT RACING, CGI
  BREAKDOWN, RED CARPET, ZOMBIE DANCE, etc.) son todos de contenido
  humano/UGC realista — ninguno aplica a nuestro estilo ilustrado abstracto.
  Confirma que las "tendencias" propias de Higgsfield no son un insumo útil
  para este canal en particular (si hace falta detectar tendencias de
  *contenido*, la fuente correcta sigue siendo vidIQ/Google Trends, §6).
- **Personal Clipper** (`personal_clipper_create`, sin uso todavía en la
  cuenta) suena como la herramienta correcta para auto-cortar Shorts de un
  video largo ya existente — pendiente de explorar en profundidad cuando
  exista un video largo real para cortar (ver §10).
- **Souls/Elements existentes** (Lucía, Mara, Sergio, Valentina) son todos de
  personas reales de otros carriles — ninguno aplica a un canal
  faceless/ilustrado.

## 12. Monetización — cómo llega y dónde se declara la plata (agregado 2026-07-08)

Pregunta de Sergio ("¿dónde facturaríamos? YT es lo más importante"). Corrección
de fondo primero: **no se le factura a YouTube.** Google, vía **AdSense** (la
capa financiera detrás de YouTube), nos paga; nosotros después **declaramos** ese
ingreso en Bolivia. El "dónde facturamos" son en realidad dos cosas separadas:
(1) dónde aterriza el dinero, y (2) bajo qué figura fiscal se declara.

### El portón: no hay ingreso hasta cruzar el YouTube Partner Program (YPP)

- **Ad revenue (lo que importa por CPM):** 1.000 suscriptores **+ 4.000 horas de
  reproducción en 12 meses** (o 10M de vistas de Shorts en 90 días).
- **Fan funding (Super Thanks, membresías) — antes:** 500 subs + 3.000 horas (o
  3M vistas Shorts en 90 días).
- **Dato clave que valida la estrategia long-form:** las horas de Shorts **NO
  cuentan** para las 4.000 horas. El video largo 8-12min es justamente lo que
  construye ese umbral; los Shorts solo dan un atajo si llegás a 10M de vistas.
- **Implicación honesta:** la monetización es un **milestone a meses**, no día 1.
  Se invierte producción (créditos + tiempo) ANTES de que exista un centavo de
  ad revenue. El radar y el pipeline construyen hacia ese umbral.

### Dónde aterriza (Bolivia)

- AdSense paga **mensual** (21-26 de cada mes), en USD, cuando el balance cruza
  el **umbral de $100**.
- Bolivia: la ruta realista es **Payoneer** (cuenta multi-moneda → banco local o
  tarjeta), muy usada en la región; hay hilo específico en la comunidad de
  AdSense sobre Payoneer en Bolivia. Transferencia bancaria SWIFT donde el banco
  la soporte. Los métodos exactos aparecen en la página "Agregar forma de pago"
  de la cuenta AdSense según el país — esa es la fuente de verdad, verificable
  cuando exista la cuenta.

### Lo que se descuenta antes de que salga de Google (impuesto EE.UU.)

- Todo creador no-estadounidense debe cargar el **W-8BEN** en AdSense. Si NO se
  carga: retención de respaldo de hasta 24% sobre el total.
- Con W-8BEN y **sin tratado fiscal EE.UU.–Bolivia** (Bolivia no tiene tratado
  de renta con EE.UU.): **30% de retención, pero solo sobre la porción de vistas
  de EE.UU.** — no sobre el ingreso global. Para un canal en español dirigido a
  LatAm, esa porción es chica (la mayoría de las vistas no son de EE.UU., y el
  ingreso de fuera de EE.UU. tiene 0% de retención estadounidense). **Confirmar
  con contador** — esto no es asesoría fiscal.

### Dónde se declara (Bolivia) — el vehículo

No se emite factura boliviana a Google; se **declara el ingreso de fuente
extranjera** bajo un NIT/régimen. A la fecha (2026-07-08) **no existe una entidad
ONIA registrada aparte** en el repo (la skill fiscal es plantilla vacía). El
vehículo de negocio concreto disponible es una **empresa unipersonal recién
abierta (a nombre de un familiar de Sergio)** con su NIT. El eje real de decisión
entonces es:

1. **Unipersonal (vehículo de negocio) — recomendado si el canal es activo de
   ONIA.** Ya existe y tiene NIT para declarar ingreso de negocio. Consolida la
   plata en los libros de ONIA en vez de mezclarla en lo personal.
2. **Sergio persona natural** — fallback simple; mezcla negocio con personal.
3. **US LLC** — más complejidad/costo, no elimina la obligación boliviana. Solo
   si el contador lo justifica.

**Restricción crítica (aplica sí o sí a la opción 1):** toda la cadena de
identidad de monetización tiene que ser LA MISMA persona/NIT — la cuenta de
**AdSense**, el formulario **W-8BEN**, y la cuenta **Payoneer/banco** de payout.
Como la unipersonal está a nombre de un familiar, eso significa que el ingreso es
legalmente suyo, declarado bajo su NIT, con su identidad en todo el KYC de
Google/Payoneer. No se puede "canal de Sergio, pago a la unipersonal del
familiar": el beneficiario debe coincidir. Es una decisión familiar consciente,
no algo para que pase por default.

### Qué podemos hacer (estructura fiscal — Ley 843, investigado 2026-07-08)

La unipersonal está en **Régimen General**. Justo el **DS 5563 (marzo 2026)**
cerró el vacío y dejó explícito que las empresas unipersonales son sujetos de
IVA/IT/IUE. Stack de impuestos:

- **IUE 25%** — sobre la **utilidad NETA** (ingresos menos gastos deducibles),
  anual.
- **IT 3%** — sobre el ingreso bruto, pero el **DS 5563 restituyó la
  compensación del IT con el IUE** (revirtió el DS 5327): el IT pagado se
  compensa con el IUE, así que en la práctica deja de ser un costo extra
  significativo.
- **IVA 13%** — pero ver la jugada de abajo.

**¿Es gravable en Bolivia?** Sí. Principio de **fuente** (Art. 42 Ley 843 + DS
24051): la actividad se realiza en territorio boliviano (el contenido se produce
acá) → renta de **fuente boliviana** → IUE aplica, aunque Google pague desde el
exterior y la audiencia sea global. El pagador extranjero no la vuelve renta del
exterior.

**La palanca REAL y confiable — IUE solo sobre la utilidad NETA.** Todo el costo
de producción (créditos Higgsfield, voz IA, VPS, dominios, equipos) es **gasto
deducible** con comprobante → baja la base del IUE. Guardar comprobante de cada
gasto desde el video 1 (conecta con el costeo del §5). Además, el DS 5563 habilita
**depreciación acelerada** de activos fijos comprados en 2026 (mitad de la vida
útil) — si la unipersonal compra equipo (PC, cámara), la deducción entra más rápido.

**IVA 13% — CORRECCIÓN de honestidad (2ª revisión).** En la 1ª pasada afirmé que
el AdSense calificaba como *exportación de servicios* con IVA 0%. **Reverificado,
eso NO es confiable en Bolivia:** la tasa cero es sobre todo para **exportación
de BIENES** (Ley 1489); en servicios solo aplica a sectores puntuales por leyes
específicas (ej. transporte internacional, Ley 3249) — y esa misma ley aclara que
*no constituye exportación de servicios* y no da crédito fiscal. Bolivia **no
tiene** una tasa-cero general de exportación de servicios donde el AdSense entre
solo. El IVA del AdSense es un **área gris real**: va de *no gravado por
territorialidad* (servicio consumido en el exterior) hasta *gravado al 13%*. **No
contar con el 0%.** Es la pregunta #1 para el matriculado.

**El W-8BEN (lado EE.UU.)** es independiente: se carga en AdSense para que EE.UU.
no retenga de más; su 30% pega solo sobre la porción de vistas de EE.UU. (chica
para un canal en español).

**Lo que el contador matriculado debe resolver/firmar:**
- **El tratamiento de IVA del AdSense** (no gravado por territorialidad vs gravado
  13% vs algún régimen) — acá está la plata y la incertidumbre real.
- Aplicación a tu caso de la **compensación IT-IUE** restituida por DS 5563.
- Formalidad de facturación del ingreso del exterior y del cobro en USD vía Payoneer.

**Balance honesto:** lo confiable es **IUE solo sobre utilidad neta (deducir toda
la producción) + IT compensado con el IUE (DS 5563)**. El IVA 0% que vendí en la
1ª pasada NO está respaldado; queda como pregunta abierta para el matriculado.
Esto **no es asesoría contable definitiva**.

### ¿Desde Bolivia, o con VPS/VPN/proxy?

Crear el canal/AdSense **desde Bolivia, como Bolivia** — sin VPN ni proxy para
aparentar otro país:
- Google define tu país por tu **dirección + formulario fiscal + cuenta de cobro**
  (Payoneer/banco), NO por tu IP. IP extranjero + payout boliviano = contradicción
  que puede **congelar la cuenta y la plata** (y queda a nombre del titular de la
  unipersonal).
- El **CPM depende de dónde están los espectadores**, no de dónde te conectás.
  VPN a EE.UU. no sube el CPM.
- Bolivia está habilitado para YPP; no hay nada que esquivar.
- Entrar a la cuenta **saltando de país** con VPN dispara las alertas de seguridad
  de Google (verificaciones, bloqueos temporales). Al crear/entrar: conexión
  normal de Bolivia, sin VPN.
- El **VPS SÍ** se usa — pero solo para correr el robot de subida (automatización
  con el token de la cuenta real). No define el país de la cuenta; puede estar en
  cualquier lado.
- Si se busca más CPM, la palanca es la **audiencia/idioma** (contenido en inglés
  para EE.UU. = otro canal), no un truco de IP.

### Sin construir todavía — lo que Sergio necesita destrabar

1. Decidir el **vehículo** (unipersonal vs personal) con el contador, asumiendo
   la restricción de identidad de arriba.
2. Abrir/confirmar **Payoneer** para el payout boliviano (a nombre que coincida
   con el vehículo elegido).
3. Al crear la cuenta AdSense: cargar el **W-8BEN** apenas se pueda.
Ninguno bloquea el pipeline ni el radar (que construyen hacia el umbral YPP);
bloquean el cobro, que recién aplica al cruzar 1.000 subs + 4.000 horas.

## Fuentes generales de esta investigación (2026-07-08)

Todas las fuentes de la tabla §3 más: [Medical misinformation policy — YouTube Help](https://support.google.com/youtube/answer/13813322) ·
[A long term vision for YouTube's medical misinformation policies](https://blog.youtube/inside-youtube/a-long-term-vision-for-medical-misinformation-policies/) ·
[How we're helping creators disclose altered or synthetic content](https://blog.youtube/news-and-events/disclosing-ai-generated-content/) ·
[Understanding "How this content was made" disclosures](https://support.google.com/youtube/answer/15447836) ·
[YouTube Data API v3 — Videos resource / containsSyntheticMedia](https://developers.google.com/youtube/v3/docs/videos).
