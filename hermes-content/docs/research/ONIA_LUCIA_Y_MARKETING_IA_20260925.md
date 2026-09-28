# Lucía y el marketing con IA de ONIA — estado real, opciones y qué conviene

> **Research del 2026-09-25 · foto de un día, NO fuente de verdad.** Vive en `docs/research/` con
> fecha a propósito (`CLAUDE.md` §2): si contradice a un doc sin fecha, gana el doc sin fecha.
> Responde dos pedidos de Sergio Urcullo del 25-sep: *«Lucía queda de lado, ¿no? ¿O cómo lo
> podemos hacer?»* y *«quiero que veas el tema de marketing con inteligencia artificial»*.
>
> **Sólo lectura.** No se generó nada, no se gastó un crédito, no se llamó a ninguna API paga, no
> se abrió Higgsfield ni el VPS y no se tocó ninguna cuenta de anuncios. Lo único externo:
> búsquedas web y consultas al Centro de ayuda de Meta con la herramienta de lectura del conector
> de Meta Ads. Ese conector está logueado en **otra** cuenta, y por eso no se usó para nada que
> tenga que ver con cuentas.
>
> **Precios.** Todo precio de Higgsfield, OpenAI o ElevenLabs que aparece acá es **dato histórico,
> a re-verificar** en vivo antes de gastar (`CLAUDE.md:466-467`). Ningún precio de ONIA aparece
> acá: se leen de `onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts`.
>
> **Rutas.** `docs/` = `hermes-content/docs/` · `lucia/` = `hermes-content/references/modelos/lucia/`
> · `campaña/` = `hermes-content/campaigns/onia-platform-meta-2026-09-21/` · `ESTRATEGIA` =
> `docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` · `JSON` = `lucia/LUCIA-HIGGSFIELD-IDENTITY.json` ·
> `ONIA_STACK…` = `docs/research/ONIA_STACK_GENERACION_ALTERNATIVAS_20260925.md`.
> Base medida: `origin/main` = `e8542de2`, en un clon superficial.

---

## 0. La respuesta en tres líneas

1. **Sí, Lucía queda de lado, y en los hechos ya quedó.** Está congelada desde el 05-sep, y la
   campaña de Meta del 21-sep ni la nombra: para su video UGC inventó otra presentadora IA.
2. **Aunque la etapa lo permitiera, su cara actual no se puede publicar.** El propio repo registra
   que sale de frames del video de una mujer real, y no hay consentimiento documentado. Ese
   bloqueo no se destraba trabajando más.
3. **Cómo puede volver:** como presentadora de los anuncios de ONIA, reconstruida 100% sintética,
   y sólo si gana un A/B contra Sergio Urcullo a cámara cuando haya pauta. Hasta entonces conviene
   que siga congelada: no se pierde nada medible.

---

## 1. Estado real de Lucía hoy

### 1.1 Qué es: las tres cosas a la vez, y ése es parte del problema

| Rol | Evidencia |
|---|---|
| **Presentadora y vendedora de ONIA** | *"Vende: La plataforma ONIA"*, y su métrica única son las demos con `src=lucia-*` (`lucia/LUCIA.md:66-69`). Sergio Urcullo, 01-sep: *«lucía también puede vender onia… onia también ugc de lucía o de otro perfil»* (`docs/MODELO_DE_CONTENIDO_DOS_CUENTAS.md:11-13`) |
| **Influencer propia de la marca** | Cuenta `@lucia.antelo.oficial`. Pilares: meta-IA 30%, vida en Santa Cruz 30%, el problema 30%, terceros 10%; cadencia de 3 por semana (`hermes-content/contenido/LUCIA.md:44-63`). *"Lucía convence al que todavía no sabe que la IA le sirve"* (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:29-30`) |
| **Producto a vender** | *"la vitrina viva del producto «te creamos tu influencer IA»"* (`LUCIA.md:68`) |

Es una IA declarada: *"Es IA y lo dice… es el gancho"* (`LUCIA.md:86`). Tiene la etiqueta de
Creador de IA activada desde el 31-ago (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:57-58`) y nunca da
testimonio (`LUCIA.md:88-91`).

⚠️ **Su destinatario quedó viejo.** `LUCIA.md:83` le habla al *"dueño de un negocio formal de 1 a
20 personas"*, justo el rango que `docs/ONIA_CLIENTE_IDEAL.md:185` corrigió a **2 a 6
profesionales**.

### 1.2 Cuándo y por qué se congeló

- **El 05-sep.** Sergio Urcullo: *"quiero que te enfoques en solo los loops que nos lleven a
  terminar de desarrollar la Onia Platform… que quede congelado hasta decisión nueva"*
  (`docs/cola/loops.md:538-540`). La fila del loop dice: `lucia` · `37 9,21 * * *` ·
  *"Guiones, briefs y prompts de modelos/Higgsfield. No toca `onia-platform` ni acerca un
  cierre."* (`:553`).
- **La regla de fondo.** La Etapa 1 manda *"Congelar (no borrar) todo lo que no sea Onia Platform
  + chatbot"* (`ESTRATEGIA:218-219`). El influencer IA es *"otro producto entero"* y da ❌ en las
  tres preguntas (`ESTRATEGIA:378`). `docs/contenido/MARCA_ONIA.md:111` lo registra así.
- **El 06-sep** se sacó del VPS su worktree `onia-hermes-lucia`, de 5,7 GB, en la rama
  `claude/lucia-vps` (`loops.md:600-606`).
- **Sin dueño.** `COORDINATION_MANIFEST.md:106` declara `hermes-content/references/{modelos,models,…}/**`
  *"CONGELADO — sin dueño; sólo con decisión de Sergio Urcullo"*.
- ⚠️ **Congelado en el papel, no del todo en los hechos:**
  - El 22 y el 23-sep entraron el sistema Higgsfield/Lucía y el plan v4 (commits `76b98ef9` y
    `59cb759d`), sin gasto.
  - Al congelar el 05-sep, `lucia-cierre.sh` siguió corriendo `claude -p --max-turns 60` todos
    los días a las 11:10 y gastaba cuota (`scripts/loops/extras/congelar-loops-vps.sh:92-95`).
    **No verifiqué hoy si sigue vivo:** la infraestructura tiene un solo dueño a la vez.

### 1.3 Qué está construido

| Pieza | Estado | Evidencia |
|---|---|---|
| Cuenta `@lucia.antelo.oficial` | Existe desde el 20-ago, tipo Creador, conectada a Postiz y a la app de Meta (mensajes y comentarios) | `contenido/LUCIA.md:14` |
| Seguidores | **0**, medido por API el 22-ago; el plan del 24-ago repite 0. **No re-medido** | `docs/ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md:9-14`; `docs/ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md:21` |
| Publicaciones | 0 al 22-ago. El 03-sep la cola dice «feed = 1» sin aclarar de qué cuenta. **No re-medido** | `hermes-content/PARA-PUBLICAR/COLA.md:8`, `:88`; `docs/historial/contenido/ESTADO_OPERATIVO_CONTENIDO_20260925.md:327` |
| Leads atribuidos | **Ninguno.** De los 3 registros sólo uno tiene `src`, y se lo pusieron a mano | `docs/handoff/meta-ads-prospeccion.md:66-69` |
| Comentario→DM | `SISTEMA` y `HUMO` activas para Lucía en n8n `1jS4jwmNmvcQpqqH`; su `entry_id` sigue sin fijar | `ESTADO_OPERATIVO…:242`; `docs/ONIA_CIRCUITO_COMENTARIO_DM.md:239-241` |
| Cara: Element | `lucia-skin-v1` (`58bbd635…`), 7 ángulos. Es el baseline, pero **nunca se comparó en A/B** contra el respaldo `902eeebb…` | `JSON:38-55` |
| Cara: Souls | `36305a9b` **prohibido**, entre otras cosas por consentimiento no documentado; el v3 `e6d8703c`, rechazado | `JSON:56-83` |
| Cara: Marketing Studio | Avatar `Lucia ONIA v4 FINAL`, aislado del resto: no se puede llevar a otra superficie y hay que revalidarlo | `JSON:85-91` |
| Canon | 5 imágenes (los docs hablaban de 7). No sirven como dataset, y una tiene seis dedos | `JSON:135-153`; `lucia/LUCIA-V4-PERFECTION-PLAN.md:58-70` |
| Plan v4 | Escrito, con **0 créditos** gastados; el dataset no empezó | `LUCIA-V4-PERFECTION-PLAN.md:189-196` |
| Voz | «Marcela», de ElevenLabs, **colombiana** | `LUCIA.md:388-389` |
| Piezas terminadas sin publicar | Reel de lanzamiento v6 (22 s), 8 historias, carrusel L6, D13 y D14 | `docs/handoff/claude-ads-creatividades-publicos.md:102-115`, `:236`; `PARA-PUBLICAR/COLA.md:92-95` |
| Peso en el repo | **788 MB: 89 videos y 142 imágenes**, medido hoy con `du` y `find` | el radar §38 ya lo marcaba (761,7 MB el 03-sep) |
| Trabajo sin integrar | `origin/claude/lucia-vps` tenía 17 commits fuera de `main` (02-sep). El clon `/root/loops/lucia-contenido` tenía **2 commits sin pushear** (06-sep) | `docs/handoff/docs-auditoria.md:17-19`; `loops.md:616-619` |

Todo ese material es **borrador interno hasta resolver los derechos**
(`JSON:23`: `"existing_assets": "internal_draft_only_until_resolved"`).

### 1.4 Qué la bloquea

**1. El gate legal de consentimiento. Es el principal.**

- **¿Se basa en el rostro de una persona real? Sí, según el propio repo.**
  - *"Toda la identidad cuelga de frames de **un video de una persona real**. En los frames de QA
    aparece sosteniendo un producto de marca… el «video B» resultó ser **otra persona
    distinta**"* (`LUCIA.md:660-667`).
  - El Soul `36305a9b` se entrenó con *"18 frames… del video A (el único 100% confirmado de la
    persona correcta)"* (`hermes-content/references/models/AVATAR-CONSISTENCY-SCHEME.md:19-24`,
    `:193`).
  - El Element `ced20cc2` es un *"frame REAL del video"* (`LUCIA.md:137`).
  - El título de `AVATAR-CONSISTENCY-SCHEME.md:190` lo presenta como un video que tenía
    Sergio Urcullo. **De dónde salió no está escrito en ningún lado.**
- **¿Hay consentimiento firmado? En el repo no hay ninguno.**
  - Busqué «cesión de derechos», «autorización de imagen», «consentimiento
    firmado/escrito/documentado» y «model release». Sólo aparecen la regla propia (*"No se usa
    cara ni voz de nadie sin consentimiento escrito"*, `docs/HIGGSFIELD_FULL_CAPABILITIES_MAP.md:519`)
    y el pendiente.
  - El manifest lo dice: `rights_gate.status: "unresolved"` (`JSON:14-16`).
  - La pregunta *"¿De dónde salieron esos videos y hay permiso?"* está abierta desde agosto, y
    sólo la puede contestar Sergio Urcullo (`contenido/LUCIA.md:126`).
- **Lo que hay hoy no alcanza:**
  - El Element vigente es generado, pero *"No resuelve la pregunta del §9 —el ancla nació de
    ahí— pero achica el problema"* (`LUCIA.md:170-174`).
  - *"No declarar «100% sintética» solo porque una imagen intermedia fue generada; importa el
    linaje"* (`docs/handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md:111`).
  - Hasta la cara que hay que rechazar, la de piel roja, es *"la piel de la persona real del video
    fuente"* (`lucia/BANCO-OFICIAL.md:80-84`).
- **Por qué pesa:**
  - La Constitución boliviana (art. 21, num. 2) reconoce el derecho a la propia imagen. El repo
    mismo lo usa para frenar la copia de caras ajenas
    (`hermes-content/references/video-intake/2026-08-12-avatares-ia-prompt-json-zeus.md:66-69`).
  - Una pauta paga es el uso de máxima exposición de esa cara.
  - *Esto no es opinión legal.* Conservar la cara exigiría identificar a la mujer, conseguir su
    consentimiento escrito y consultar a un abogado boliviano.
- **Las dos salidas que admite el manifest** (`JSON:17-20`):
  - **Documentar el consentimiento de todas las fuentes humanas.** Es improbable: la fuente no
    está identificada y *"vino de más de una fuente"* (`contenido/LUCIA.md:126`).
  - **Reconstruirla desde un canon 100% sintético** (el plan v4). Eso significa que **vuelve el
    personaje, no la cara**.

**2. El gate de entrenamiento.**

- Los Términos de Higgsfield (5.2 iv) prohíben entrenar modelos con sus propios outputs sin
  autorización escrita, aunque su propia ayuda de «AI Influencer» lo recomiende
  (`LUCIA-V4-PERFECTION-PLAN.md:40-47`).
- En el manifest: `training_rights_gate: unresolved` y
  `new_soul_training: blocked_until_license_is_confirmed` (`JSON:25-36`).
- Lo leí del plan y no lo re-verifiqué: `higgsfield.ai` está bloqueado por el proxy
  (`ONIA_STACK…:13-16`).

**3. La herramienta.**

- La sesión de la CLI no está operativa y pide `higgsfield auth login`
  (`HIGGSFIELD-LUCIA-SYSTEM…:72-73`).
- El cobro de Higgsfield está en estado incierto (`ONIA_STACK…:82-98`):
  - pago fallido el 01-sep;
  - un cargo anual de US$348 en reclamo desde el 07-sep;
  - la regla «Nada de Higgsfield» para los videos del 11 al 20-sep.
- El video del 21-sep no se generó porque no se pudo cotizar en vivo (`campaña/README.md:131-133`).

**4. La etapa.** Aunque se resuelva todo lo anterior, la pauta sigue frenada
(`MARCA_ONIA.md:146-151`) y la cuenta de anuncios tiene cuatro bloqueos (§3.2).

### 1.5 Cuánto se gastó y cuánto costaría seguir

> Todo es **dato histórico, a re-verificar**. Lucía no tiene un libro de gastos propio. El gasto
> de Higgsfield es de la cuenta entera: Lucía, los avatares de Sergio Urcullo, Mara y Marketing
> Studio.

**Lo gastado, hasta donde se puede reconstruir:**

| Concepto | Cifra | Fuente |
|---|---|---|
| Suscripción Higgsfield Ultra | US$130 = Bs 1.365 al mes (registro del 01-jun). El 31-ago la cuenta decía «3.000 cr/mes por $99 facturado anual» | `docs/FINANCE_LOG_2026.md:21`; `lucia/TECNICA-HIGGSFIELD.md:236` |
| Valor del crédito | de US$0,033 (plan anual) a US$0,043 (plan mensual) | `TECNICA-HIGGSFIELD.md:239`; `ONIA_STACK…:134` |
| Uso histórico de toda la cuenta, al 01-sep | 4.900,85 créditos · 782 generaciones · unos US$196 | `TECNICA-HIGGSFIELD.md:897-898` |
| Agosto, su mes pico | ~1.040 créditos ≈ **US$34-45** | `ONIA_STACK…:31-35`, `:109` |
| Sus días más fuertes | 21-ago: 313,45 cr (69 generaciones) · 23-ago: 83,30 cr · 02-sep: 72,67 cr | `lucia/BITACORA-PERFECCION.md:389-393` |
| Septiembre | ~27 créditos, y después pausa | `ONIA_STACK…:110` |
| Pauta de Lucía | Bs 0: nunca se pautó | — |
| Horas | **No se registraron** (tampoco se registran las de soporte, `ESTRATEGIA:452-456`). El volumen se ve en las 1.042 líneas de `LUCIA.md`, las 1.450 de `TECNICA-HIGGSFIELD.md`, los 96 KB de bitácora y dos loops diarios hasta el 05-sep | — |

**Lectura: en créditos, Lucía costó poco.** Lo que costó fue la suscripción, de US$99 a 130 por
mes. Es ~37% del gasto con el que la estrategia calcula el break-even (`ONIA_STACK…:54-58`). Y
costó horas de sesión que no acercaron ningún cierre.

**Lo que costaría seguir**, con tarifas medidas en agosto y a re-cotizar con `higgsfield generate cost`:

| Qué | Créditos | US$ (a 0,033-0,043 por crédito) | De dónde sale la tarifa |
|---|---|---|---|
| Reconstrucción v4: 24 candidatas para un dataset de 20 | fuera de Higgsfield, por el gate 2 (p. ej. GPT Image en calidad alta, ≈US$0,165 c/u, según un tercero) | ~US$4-7 | `ONIA_STACK…:208` |
| Entrenamiento del Soul v4 | **la CLI no expone el precio**: hace falta un tope aprobado | ? | `LUCIA.md:18-19` |
| A/B de identidad (fase 1: 9 stills; fase 2: hasta 12 más) | 18-42 | ~US$0,6-1,8 | `LUCIA-V4-PERFECTION-PLAN.md:134-149` |
| UGC de 27 s (2 tomas habladas, con reintentos) | ~60-270 | ~US$2-12 | `LUCIA.md:781-803`, `:827`; `ONIA_STACK…:144-147` |
| Mantener Ultra | 3.000 cr/mes | US$99-130/mes | arriba |
| Voz para uso comercial | ElevenLabs Starter como mínimo: el plan Free no da licencia comercial | ~US$5-6/mes | `ONIA_STACK…:58-59`, `:446` |

**Horas de Sergio Urcullo (estimación propia).** Reconstruir y validar a Lucía v4 le pide aprobar
siete cosas: el retrato master, el tope de gasto, el dataset, el A/B, el costo del video, el corte
y la publicación. Son **unas 3 a 5 h, repartidas en 2 a 4 semanas**, más las sesiones del agente.
La historia muestra dónde se traba: el reel v6 espera su OK desde el 22-ago
(`claude-ads-creatividades-publicos.md:102-103`, `:236`).

---

## 2. Cómo podría volver sin romper la Etapa 1

### 2.1 El test de tres preguntas, adaptado a la publicidad propia

El test está hecho para los añadidos que se le **venden** al cliente (`ESTRATEGIA:359-367`).
`MARCA_ONIA.md:84-87` ya marca la diferencia: la publicidad **propia** de ONIA no es «contenido o
ads como servicio». Para una pieza de marketing, las tres preguntas se leen así:

1. ¿Le habla al **mismo cliente** que compra el núcleo, la clínica de `ONIA_CLIENTE_IDEAL.md:22-24`?
2. ¿**Deja de tener sentido sin el núcleo**? Es decir: ¿su único trabajo es mostrar y vender ONIA
   Platform?
3. ¿Se sostiene **sin horas de Sergio Urcullo por cliente**? Es decir: ¿una pieza sirve para todos
   y no abre un proyecto por venta?

A eso se suma un filtro que no es del test sino de la etapa: **¿sirve HOY?** *"El test dice si
algo MERECE construirse. La etapa dice CUÁNDO"* (`ESTRATEGIA:627`).

### 2.2 Las opciones

| Opción | P1 | P2 | P3 | ¿Hoy? | Plata (histórico) | Horas de Sergio Urcullo | Riesgo principal |
|---|---|---|---|---|---|---|---|
| **a) Lucía presentadora de los anuncios de ONIA**: explica y muestra la pantalla real; nunca es clienta ni odontóloga | ✅ si el guion es el de la clínica | ✅ | ✅ se produce una vez | ❌ gate de derechos y sin pauta | v4 ~US$5-10 + el Soul (precio ?) + video ~US$2-12; la suscripción aparte | ~3-5 h | la cara actual no se puede publicar: «Lucía» vuelve con otra cara |
| **b) Lucía influencer con cuenta propia** | ❌ le habla al que *"todavía no sabe que la IA le sirve"* | ❌ funciona sola: alcance, comunidad, «te creamos tu influencer» | ❌ 3 a 7 piezas por semana, más DMs | ❌ | suscripción + ~25-45 cr por reel | todas las semanas | es la décima línea (`CLAUDE.md:38-42`); hay cuentas IA suspendidas aun con etiqueta (anecdótico, `docs/research/ONIA_TENDENCIAS_INFLUENCERS_IA_20260821.md:134-138`) |
| **c) Seguir congelada** | — | — | — | ✅ | Bs 0 | 0, más tres cabos sueltos (§4) | se enfría el know-how (mitigado: está escrito) |
| **d1) Sergio Urcullo a cámara**, con el guion de la campaña | ✅ | ✅ | ✅ | ✅ sirve ya por WhatsApp, uno a uno | 0 créditos | ~1 h: grabar y mirar la tabla de cortes y el preview a 360p (`CLAUDE.md:469-470`) | no es «UGC de IA»: el cambio tiene que ser **explícito**, nunca silencioso (`CLAUDE.md:437-440`) |
| **d2) La presentadora IA original del 21-sep**, que no es Lucía | ✅ | ✅ | ✅ | 🟡 sólo con pauta | ~US$2-12 por video | ~1 h | sus dos anclas no parecen la misma mujer, y la puesta en escena la muestra como empleada de clínica (§2.3 e) |
| **d3) Video de producto sin cara**: pantalla real, subtítulos y voz, hecho con HyperFrames | ✅ | ✅ | ✅ | ✅ | 0 créditos (se renderiza en local) | ~15-30 min de revisión | frena menos el scroll que una cara |
| **d4) Avatar IA de Sergio Urcullo**, con su propio Soul (`docs/HIGGSFIELD_VIDEO_SYSTEM.md:169-177`) | ✅ | ✅ | ✅ | 🟡 | créditos + etiqueta IA | ~1 h | falsa economía: grabarse cuesta menos y no lleva etiqueta |

**Qué dice la evidencia sobre qué convierte:**

- En categorías donde pesa la confianza, el contenido patrocinado humano convierte **hasta 2,7
  veces mejor** que el de influencers virtuales. El engagement extra de estos últimos es *"de
  curiosidad, no de confianza"* (`ONIA_TENDENCIAS_INFLUENCERS_IA_20260821.md:23-28`; fuente
  secundaria).
- El repo ya lo había anotado: *"no hay evidencia independiente de que el UGC con IA convierta
  mejor que el real"* (`docs/historial/ONIA_ECOMMERCE_PLAYBOOK_20260806.md:178`, que es historia).
- **Para ONIA es hipótesis, no dato propio.** Lo decide el A/B.

### 2.3 La opción más fuerte para que Lucía vuelva, la (a), y lo que hay que resolver antes

(a) es la única de las que usan a Lucía que no abre una línea nueva: presenta el núcleo, le habla
a la clínica y no cobra horas por cliente. Esto es lo que falta, en orden.

**a) Derechos y consentimiento.**

- Hay que elegir una de las dos salidas del §1.4.
- Si es la reconstrucción:
  - se sigue el plan v4 (`LUCIA-V4-PERFECTION-PLAN.md:16-26`, con sus gates en `:177-187`);
  - cada imagen lleva su manifest: `source_model`, `source_asset_or_job_id`,
    `license_or_written_permission` y `training_rights_status` (`JSON:29-34`);
  - el dataset sale **de fuera** de los outputs de Higgsfield mientras no haya autorización
    escrita, y se verifica la licencia del generador que se use;
  - **no entra nada del banco actual.**

**b) La etiqueta de IA en Meta: política vigente, consultada el 25-sep.**

| Caso | Qué exige Meta | Fuente |
|---|---|---|
| Anuncio **comercial** (el nuestro) con una persona fotorrealista generada | **No hay autodeclaración obligatoria.** Sólo es obligatoria en anuncios sobre temas sociales, elecciones o política | Centro de ayuda de Meta, *About media created or edited with AI* (`facebook.com/business/help/1486382031937045`) |
| Mismo anuncio, detección automática | Meta detecta con estándares de la industria los medios hechos con herramientas de IA de terceros y muestra **«AI info»** en *Sobre este anuncio*. Si hay una persona fotorrealista, la etiqueta puede subir **al lado de «Publicidad»**. Según fuentes secundarias, la detección se amplió el 01-jun-2026 | Coinis, Cinerads y ALM Corp (§6). La página oficial `facebook.com/business/help/1010479435004531` está bloqueada por el proxy |
| Herramientas generativas de la propia Meta | *"may include AI info on the About this ad screen… or have an AI info label next to the ad label"* | `facebook.com/business/help/1766652437485798` |
| Etiqueta puesta por detección | **No se puede pedir que se quite** | `…/help/1486382031937045` |
| **Orgánico** en Instagram (la cuenta de Lucía o @oniahq) | Hay que usar «Agregar etiqueta de IA» al publicar video fotorrealista o audio realista creado o alterado digitalmente. Meta puede penalizar si se omite | Meta Newsroom, feb-2024 (la leí en el resumen del buscador: la página está bloqueada por el proxy) |

**Consecuencias:**

- Una presentadora IA fotorrealista en un anuncio de ONIA va a llevar «AI info», la declare uno o
  no.
- **La regla de la casa ya lo resuelve: se declara siempre** (`LUCIA.md:86`;
  `MODELO_DE_CONTENIDO_DOS_CUENTAS.md:57-58`; `campaña/ugc-dental-30s.md:101`).
- Conviene sumar una línea en pantalla, *«presentadora virtual de ONIA»*, para que nadie la lea
  como empleada de una clínica.

**c) Costo por video, con aprobación.**

- El flujo obligatorio es brief → modelo y parámetros en vivo → `higgsfield generate cost` →
  aprobación de Sergio Urcullo → **un** borrador → QA → recién ahí variantes
  (`HIGGSFIELD_VIDEO_SYSTEM.md:64-73`; `CLAUDE.md:462-465`, `:471-475`).
- Antes hay que reautenticar la CLI por OAuth, y Sergio Urcullo tiene que cerrar el tema del cobro
  (`ONIA_STACK…:97-98`).
- El paso a paso ya está escrito en `campaña/ugc-dental-30s.md:140-149`.

**d) La prueba A/B contra Sergio Urcullo a cámara.** El diseño, con las reglas de Meta:

- **Una sola variable: quién presenta.** Todo lo demás igual: el guion (`ugc-dental-30s.md:21-41`),
  los insertos de pantalla real, los subtítulos, el CTA, el público y el presupuesto.
- **Herramienta:** *Experiments* de Meta. El A/B no tiene costo extra, admite hasta 5 versiones y
  no solapa audiencias (`facebook.com/business/help/1915029282150425`, `…/1738164643098669`).
- **Duración:** mínimo 7 días, máximo 30 (`facebook.com/business/help/290009911394576`).
- **Métrica:** costo por registro completado (`campaña/README.md:103-109`).
  - Con el presupuesto chico que cabe hoy, lo más probable es que la prueba decida por atención
    (retención a 3 s, CTR, costo por visita) y no por registros.
  - La regla de decisión se fija **antes** de mirar los resultados. Por ejemplo: si la IA no gana
    por un margen claro, se queda Sergio Urcullo, que no carga ni etiqueta ni gate.
- **Condiciones previas:**
  - los cuatro bloqueos de la cuenta de anuncios;
  - la atribución `?src=`/`utm`;
  - un evento de registro o un Lead Form (`MARCA_ONIA.md:177-203`; `meta-ads-prospeccion.md:64-72`).
- ⚠️ **Otra cuenta.** El conector de Meta Ads de las sesiones está en otra cuenta (NUVO, Arthur
  Fuentes). La prueba se arma por Graph API desde el VPS, o a mano (`meta-ads-prospeccion.md:59-62`).

**e) Lo demás que falta, sea con Lucía v4 o con la presentadora del 21-sep:**

1. **Continuidad de identidad.** Miré las dos anclas del 21-sep lado a lado y, a mi ojo, no son
   la misma mujer:
   - la selfie aparenta 35-40 años y tiene el pelo recogido;
   - la del escritorio aparenta 25-28, lleva el pelo suelto y tiene otra forma de cara;
   - y el guion pide *"Mantener cara, edad, cabello…"* (`ugc-dental-30s.md:17-18`).

   Lo tiene que confirmar Sergio Urcullo mirándolas. El arreglo barato es sacar la toma de
   escritorio y sacar todas las tomas de la selfie.
2. **Puesta en escena.** El prompt pide a alguien *"who looks like a competent small dental-clinic
   administrator"*, en una recepción dental (`campaña/assets/README.md:15-19`). El guion dice que
   no es empleada de una clínica (`ugc-dental-30s.md:5-6`). Con una cara realista y sin
   declararse, se lee como un testimonio implícito, y eso roza `CLAUDE.md:437-440`.
3. **Detalles en cuadro.** La selfie trae un logo de diente generado en la pared (el prompt
   negativo pedía *"no generated logo"*) y un póster de una ciudad andina, en un anuncio para una
   clínica cruceña.
4. **Capturas del producto.** Las tres que usa el guion (`paso-07d-cita-en-agenda.png`,
   `alta-inline-en-el-modal-de-cita.png` y `paso-08-cobro.png`) **no están en este repo**: las
   busqué en todo el árbol, y el inventario del 25-sep dice lo mismo. Hay que rehacerlas desde el
   tenant demo antes de montar.
5. **Voz.** La de Lucía es colombiana (`LUCIA.md:388-389`), en contra de su propio argumento de
   ser *"local y creíble en Bolivia"* (`LUCIA.md:498-499`). Para una clínica cruceña conviene una
   voz boliviana o la de Sergio Urcullo, y hay que confirmar la licencia comercial
   (`ONIA_STACK…:446`).
6. **Precio y público.** El «desde Bs …/mes» se compara contra `subscription-plans.ts` antes de
   publicar, y el público pasa de «Bolivia» a Santa Cruz + 25 km (`MARCA_ONIA.md:229-237`).

### 2.4 Recomendación

**Que siga congelada.** Como presentadora pasa el test, pero no la etapa, y su cara tiene un
bloqueo que no es de trabajo sino de derecho. Congelarla no pierde nada medible.

**El orden que sí sirve a la Etapa 1:**

1. **Ahora, a Bs 0:** contestar a los 5 leads y arreglar el one-pager (§3.2, #1 y #2).
2. **Ahora, a 0 créditos y con ~1 h de Sergio Urcullo:** grabar la demo con el guion que ya
   existe, a cámara, y editarla con `editor-videos`.
   - Sirve hoy por WhatsApp, uno a uno, para los 5 leads y las 20 clínicas.
   - En una conversación uno a uno, una cara real de Santa Cruz vale más que un avatar que hay
     que explicar.
3. **Cuando haya pauta:**
   - primero los estáticos y el carrusel, que ya están renderizados y cuestan 0 créditos
     (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:60-70`);
   - después el A/B del §2.3 d: **Sergio Urcullo contra una presentadora IA con derechos limpios**
     (~US$2-12 por video, a cotizar).
4. **Lucía v4 se reconstruye sólo si gana la variante IA** y Sergio Urcullo decide pagar la
   reconstrucción, que le lleva ~3-5 h. Si pierde, queda como personaje archivado, con reglas y
   recetas que sirven para cualquier presentador.

**Si Sergio Urcullo quiere presentadora IA desde el primer video,** la opción más limpia hoy es la
del 21-sep (d2), con la continuidad arreglada, y no Lucía. Su linaje es de texto a imagen
(`campaña/assets/README.md:5-45`) y no parte de ninguna persona real. Igual hay que registrar la
licencia del generador.

---

## 3. Marketing con IA para ONIA

### 3.1 Qué hay en el repo

| Herramienta | Qué hace | Estado | Costo |
|---|---|---|---|
| **Carruseles**: `scripts/carousel_render.js`, pack `community-editorial` | De un brief JSON a PNG de 1080×1350, con capturas reales | Vivo; la campaña del 21-sep está renderizada | Bs 0: corre con Node y Edge (`hermes-content/skills/carruseles-onia.md:12-21`) |
| **Imágenes de OpenAI**: `npm run image:openai` (`scripts/openai_image.js`, gpt-image-1) | Objetos, escenas, fondos | Funciona con `OPENAI_API_KEY` | ~US$0,005 a 0,165 por imagen según la calidad, según un tercero (`ONIA_STACK…:208`). Esa tarifa es de GPT Image 2; el script usa gpt-image-1 y calidad `high` por defecto: re-verificar |
| **`imagegen` de Codex** | Generó las anclas de la presentadora del 21-sep | Se usó una vez | según la cuenta |
| **Higgsfield**: CLI y skills `higgsfield-generate` y `higgsfield-soul-id` | Imagen, video, UGC, Marketing Studio, lipsync, Soul | La CLI no tiene sesión y el cobro está en duda | Ultra, US$99-130/mes; por pieza, `ONIA_STACK…:132-148` |
| **Voz**: ElevenLabs (Marcela, `tts-elevenlabs.mjs`) | Narración | Plan no verificado | ~US$5-6/mes si es Starter |
| **HyperFrames**: skills `product-launch-video`, `faceless-explainer`, `talking-head-recut`, `embedded-captions` y otras | Video hecho desde HTML: demo de producto, subtítulos, placas | Instalado | Bs 0 (se renderiza en local) |
| **`editor-videos`** (método Santiago) | Corta silencios y agrega subtítulos y efectos a un video real | Instalado; es lo que se usa en septiembre | Bs 0 |
| **Comentario→DM**: n8n `1jS4jwmNmvcQpqqH` | Una palabra clave dispara un DM con un recurso | Entrega verificada el 28-ago (`ONIA_CIRCUITO_COMENTARIO_DM.md:14-17`) | Bs 0 (corre en el VPS) |
| **Postiz** (`scripts/postiz_schedule.mjs`) | Programa publicaciones | Estuvo caído unas 3 semanas, hasta el 04-sep (`MARCA_ONIA.md:262`) | Bs 0 |
| **Meta Ads**: motor en `/opt/onia/meta-ads/` y Graph API | Campañas | 4 bloqueos (17-sep) y la decisión «todavía no» | el presupuesto lo decide Sergio Urcullo |
| **Prospección con IA** | 20 clínicas dentales de Santa Cruz investigadas y verificadas (16-ago), con guion de primer contacto; más la ruta de Meta Ad Library | Sin usar | Bs 0 (`docs/ONIA_PROSPECTOS_DENTAL_SCZ.md:1-40`; `docs/CRM_PROSPECTING.md:20-28`) |
| **Chatbot** (add-on vivo) | Recepción 24/7 en la web y el WhatsApp de ONIA | Vivo, pero los inboxes 4 y 5, donde caen los leads, no pertenecen a ninguna organización | sin costo adicional (`docs/ONIA_LEADS_ESPERANDO.md:27-30`) |

### 3.2 Lo que sirve para venderle a las clínicas (Etapa 1), en orden

El orden va de lo que cuesta cero y está más cerca de un pago a lo que cuesta más.

| # | Qué | La IA que hace el trabajo | Costo | Horas (estimación) | Por qué va en ese lugar |
|---|---|---|---|---|---|
| 1 | **Contestar a los 5 leads.** Antes, verificar en el producto las 6 funciones que pidió la clínica de 4 doctores. Para los 2 de WhatsApp hace falta una plantilla aprobada | Claude, que redacta y verifica contra el producto | Bs 0 | ~2 h de agente + ~1 h de Sergio Urcullo | *"pagar por leads nuevos mientras cinco gratis esperan… es tirar la plata"* (`meta-ads-prospeccion.md:153-159`). El cuello de botella nunca fue el mercado (`ONIA_CLIENTE_IDEAL.md:170-171`) |
| 2 | **Arreglar el one-pager**, que vende «DentalGest» y planes viejos, y **barrer la promesa del DM de SISTEMA**, que manda a un Cal apagado | Claude y el generador | Bs 0 | ~1-2 h, más la revisión de Sergio Urcullo | es lo que se manda por WhatsApp (`MARCA_ONIA.md:168-169`, `:277-283`) |
| 3 | **Prospectar las 20 clínicas** ya investigadas, con las 5 preguntas de calificación | Claude, búsqueda web y Ad Library | Bs 0 | ~2 h para re-verificar y ~10 min por mensaje. **Mandarlos lo decide Sergio Urcullo** | es el cliente ideal exacto y no necesita pauta. Los datos son del 16-ago: hay que re-verificarlos |
| 4 | **Atribución**: que `?src=`/`utm` llegue hasta `/register`, más un evento de registro o un Lead Form | código del carril web o del producto | Bs 0 | ~1-3 h | sin esto ninguna campaña se puede medir (`meta-ads-prospeccion.md:64-72`) |
| 5 | **Pauta con los estáticos y el carrusel v2** ya renderizados | `carousel_render.js` y capturas reales | producción Bs 0; el presupuesto lo fija Sergio Urcullo | 5 min suyos (tarjeta y vincular la página), más ~1 h para mirar las piezas | los ganchos se prueban en estático antes que en video (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:60-70`) |
| 6 | **Demo en video**: Sergio Urcullo a cámara (`editor-videos`) o producto sin cara (HyperFrames) | skills instaladas | 0 créditos | ~1 h suya, o ~15-30 min de revisión | *"Producto visible o no sale"* (`CLAUDE.md:434-436`). Sirve en WhatsApp y en pauta |
| 7 | **Hacer visibles los leads del bot**: que los inboxes 4 y 5 aparezcan en el panel y que el barrido cubra lo viejo | chatbot (carril `chatbot-cola`) | Bs 0 | lo hace el carril chatbot | que nadie vuelva a esperar 31 días (`meta-ads-prospeccion.md:129-132`) |
| 8 | **Comentario→DM de @oniahq**, con piezas pensadas para la clínica | n8n | Bs 0 | ~30 min de barrido | sólo rinde si @oniahq publica, y no publica desde agosto (`MARCA_ONIA.md:43`) |
| 9 | **UGC con presentador IA** | Higgsfield | ~US$2-12 por video, más la suscripción | ~1 h por video | va último: sólo con la pauta andando, un gancho ganador y el A/B del §2.3 |

**El costo fijo de las herramientas de IA también es marketing.**

- En septiembre se usaron ~27 créditos. Ajustar Ultra (bajar de plan, o pasar a la API de pago
  por uso que Higgsfield abrió el 16-sep) bajaría el break-even de ~5 a ~3-4 clientes
  (`ONIA_STACK…:40-43`, `:54-58`).
- Antes de bajar, hay que confirmar qué pasa con los Souls y los Elements (`ONIA_STACK…:444`). Si
  se perdieran, a Lucía le costaría poco: su cara actual igual no se puede publicar.
- Lo decide Sergio Urcullo.

### 3.3 Lo que sirve a la marca personal, que no cuenta como avance de la Etapa 1

- **Los números de `@sergiourcullo` al 22-sep:** 81 publicaciones, 503 seguidores, 101.934
  visualizaciones en 30 días (76% de no seguidores) y **45 clics externos**
  (`ESTADO_OPERATIVO…:320-321`).
- **Herramientas:** grabación real con `editor-videos`, carruseles `community-editorial`, las
  recetas de Higgsfield para Sergio Urcullo (`docs/ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`), la
  serie de YouTube y Postiz.
- **Para qué sirve:** es autoridad frente a otra audiencia (`MARCA_ONIA.md:67-87`). Ahí vive
  también la excepción IA Lab que se decidió hoy (`ESTRATEGIA:225-238`).
- **Límite:** una pieza de acá no pasa a @oniahq ni a la pauta sin la prueba del vendedor
  (`MARCA_ONIA.md:82-83`).

### 3.4 Lo que es otra línea, y está congelado

- Lucía como influencer y «te creamos tu influencer IA».
- Las otras modelos IA (Mara, Modelo 2).
- Contenido o ads como servicio, y `video-factory`.
- Un «Open Higgsfield» propio (`ONIA_STACK…:44-53`).

Todas fallan el test (`ESTRATEGIA:377-379`) o están marcadas como congeladas
(`COORDINATION_MANIFEST.md:106`).

### 3.5 Lo que no hay que hacer ahora

- Entrenar un Soul, generar o publicar nada con la cara actual de Lucía (`JSON:21-23`).
- Reactivar el loop `lucia` o sus crons sueltos.
- Generar el UGC antes de que haya pauta: sin distribución, un video pago no mueve el número.
- Pautar antes de contestar a los 5.

---

## 4. Hallazgos laterales (anotados, no hechos)

1. Las dos anclas de la presentadora del 21-sep no parecen la misma mujer (§2.3 e.1).
2. Las capturas del producto que usa el guion UGC no están en este repo (§2.3 e.4).
3. `MARCA_ONIA.md:111` cita la fila del influencer como `ESTRATEGIA:364`, pero hoy está en `:378`:
   la excepción IA Lab de hoy corrió 14 líneas. **Corregido el mismo 25-sep**, junto con las otras
   tres citas que había corrido (`MARCA_ONIA.md:85`, `cola/plataforma-v1.md:804` y
   `ONIA_STACK_GENERACION_ALTERNATIVAS_20260925.md:468`).
4. `contenido/LUCIA.md:52` tiene un pilar *«Vida de dueña de negocio»* que choca con
   `LUCIA.md:88-89`, donde Lucía no cuenta que tiene un negocio. Ése es el camino al testimonio
   fingido.
5. `LUCIA.md:83` le habla al negocio «de 1 a 20 personas», el perfil que
   `ONIA_CLIENTE_IDEAL.md:185` corrigió.
6. `lucia-cierre.sh` podía seguir corriendo después del congelamiento
   (`congelar-loops-vps.sh:92-95`). No lo verifiqué hoy.
7. Desde el 06-sep hay 2 commits sin pushear en `/root/loops/lucia-contenido` (`loops.md:616-619`).
   Si se borra ese clon, se pierden.
8. Lucía ocupa 788 MB en `main`. Es el radar §38, y lo decide Sergio Urcullo.
9. No está registrada la procedencia de la foto de portada del carrusel
   (`web-factory/apps/onia-platform/public/contexto/dental.webp`). Si es generada, Meta puede
   rotular también el carrusel.

---

## 5. Qué decide Sergio Urcullo

| # | Decisión | Opciones | Costo de cada una |
|---|---|---|---|
| 1 | **Qué pasa con Lucía** | congelada (recomendado) · reconstruirla en v4 · intentar el consentimiento de la fuente | Bs 0 · ~3-5 h + ~US$5-10 + el Soul (precio ?) · identificar a la persona y un abogado |
| 2 | **Quién pone la cara en la primera demo** | él a cámara (recomendado) · la presentadora IA del 21-sep · sin cara | ~1 h y 0 créditos · ~1 h + ~US$2-12 · ~20 min |
| 3 | **Contestar a los 5 leads**, y con qué mensaje | — | Bs 0 |
| 4 | **Destrabar la pauta** (tarjeta y vincular la página) y dar el OK explícito | — | 5 min; el presupuesto, a fijar |
| 5 | **El plan de Higgsfield**, y el reclamo de los US$348 | mantener Ultra · bajar de plan · API de pago por uso | US$99-130/mes, o menos |
| 6 | Los cabos sueltos de Lucía: la rama `lucia-vps`, los commits sin pushear y los 788 MB | radar §29 y §38 | — |

---

## 6. Cómo se re-verifica esto

- **Derechos:** `lucia/LUCIA-HIGGSFIELD-IDENTITY.json` → `rights_gate.status`.
- **La cuenta de Lucía:** abrir el perfil y **mirarlo**. Un dato de agosto no vale para hoy.
- **Leads y pagos:** los dos comandos de `ONIA_CLIENTE_IDEAL.md:223-233`.
- **La cuenta de anuncios:** `meta-ads-prospeccion.md:197-205`, por Graph API desde el VPS. El
  conector de Meta Ads no sirve: ve otra cuenta.
- **Higgsfield:** `higgsfield account status` y `higgsfield generate cost …`, nunca `create`. El
  estado del cobro lo ve Sergio Urcullo en `higgsfield.ai/me/settings/subscription`.
- **Crons de Lucía:** `crontab -l | grep -i lucia` en el VPS, con el dueño de infra de ese momento.

## 7. Fuentes externas (consultadas el 25-sep)

- Meta, *About media created or edited with AI*:
  https://www.facebook.com/business/help/1486382031937045 (leída con la herramienta del Centro de
  ayuda).
- Meta, IA en Advantage+:
  - https://www.facebook.com/business/help/1766652437485798
  - https://www.facebook.com/business/help/297506218282224
- Meta, pruebas A/B y Experiments:
  - https://www.facebook.com/business/help/290009911394576
  - https://www.facebook.com/business/help/1738164643098669
  - https://www.facebook.com/business/help/1915029282150425
- Meta, *About AI info on ads created or edited with generative AI tools*:
  https://www.facebook.com/business/help/1010479435004531 (sólo el resumen del buscador: la página
  está bloqueada por el proxy).
- Meta Newsroom, etiquetado de contenido hecho con IA:
  https://about.fb.com/news/2024/02/labeling-ai-generated-images-on-facebook-instagram-and-threads/
  (bloqueada por el proxy).
- Fuentes secundarias:
  - https://coinis.com/blog/meta-ai-content-labeling-facebook-instagram-ads-2026
  - https://www.cinerads.com/blog/ai-ad-disclosure-requirements
  - https://almcorp.com/news/meta-ai-labels-facebook-instagram-ads-disclosure-2026/
  - https://influencermarketinghub.com/ai-disclosure-rules/
- Constitución Política del Estado de Bolivia, art. 21:
  - https://bolivia.justia.com/nacionales/nueva-constitucion-politica-del-estado/primera-parte/titulo-ii/capitulo-tercero/seccion-i/
  - http://www.scielo.org.bo/scielo.php?script=sci_arttext&pid=S2070-81572013000100003

---

## 8. Resumen en 10 líneas

1. **Estado:** Lucía está congelada desde el 05-sep por la Etapa 1, y la campaña del 21-sep ya usa otra presentadora IA. Hoy es a la vez influencer, presentadora y producto a vender.
2. **Qué hay construido:** la cuenta `@lucia.antelo.oficial` (0 seguidores medidos; 1 publicación registrada), el Element `lucia-skin-v1`, un avatar en Marketing Studio, la voz Marcela, reglas y recetas, y 788 MB en `main`.
3. **Bloqueo principal:** su cara sale de frames del video de una mujer real, sin consentimiento documentado (`LUCIA.md:660-667`; `rights_gate: unresolved`). Hasta resolverlo no se publica ni se entrena nada.
4. **Salida realista:** reconstruirla 100% sintética (plan v4). Vuelve el personaje, no la cara, y el dataset no puede salir de outputs de Higgsfield sin permiso escrito.
5. **Gasto (histórico, a re-verificar):** Lucía no tiene libro propio. En agosto, su pico, se usaron ~1.040 créditos ≈ US$34-45. Lo caro es Ultra: US$99-130 por mes, con ~27 créditos usados en septiembre.
6. **Opciones:** como influencer propia sería la décima línea y falla las tres preguntas. Como presentadora de los anuncios de ONIA pasa el test, pero no la etapa.
7. **Recomendada:** seguir congelada (Bs 0). La primera demo, con Sergio Urcullo a cámara (0 créditos, ~1 h). Con pauta, un A/B contra una presentadora IA con derechos limpios (~US$2-12 por video, a cotizar).
8. **Marketing con IA que sirve hoy, a Bs 0:** contestar a los 5 leads, prospectar las 20 clínicas ya investigadas, arreglar la atribución y usar los estáticos y el carrusel ya renderizados.
9. **Meta:** en anuncios comerciales no hay autodeclaración obligatoria, pero Meta rotula «AI info» a las personas generadas y esa etiqueta no se quita. En orgánico hay que etiquetar el video realista. La casa declara siempre.
10. **Decide Sergio Urcullo:** congelar o reconstruir a Lucía; quién pone la cara en la demo; contestar a los 5; la tarjeta y la página para la pauta; el plan de Higgsfield y el reclamo de US$348.
