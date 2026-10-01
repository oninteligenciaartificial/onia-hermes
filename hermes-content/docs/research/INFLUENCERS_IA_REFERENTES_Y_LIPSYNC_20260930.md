# Influencers IA: referentes, patrones, reglas de plataforma y modelos de video con voz

Investigación para Lucía (ONIA) · 2026-09-30 · Es un documento de research. No es fuente de verdad: cifras,
precios y catálogos cambian, así que hay que volver a medirlos en vivo antes de usarlos.

---

## Resumen ejecutivo (10 líneas)

1. **El referente que más se parece a lo que buscamos es Lu do Magalu, no Aitana.** Es un personaje de la propia marca que vende el catálogo de su empresa: a jun-2026 tenía 9,1 M de seguidores en IG (Axios) y su canal «WhatsApp da Lu» ya pasó los R$100 M en ventas, con una conversión 3× mayor que los otros canales (Mobile Time, 07-07-2026). Persona + chatbot es exactamente el esquema de ONIA.
2. Kenza Layli para Hyundai repite el patrón: persona IA + chatbot en 8 idiomas. La agencia declara un ROI de 20×, dato que no está auditado.
3. **Declarar que es IA ya no es opcional.** Desde el 31-08-2026 Instagram exige la etiqueta «AI-generated profile» a las cuentas cuya persona es IA. Una cuenta sin etiqueta deja de ser recomendable en Reels, Explore y sugeridos. TikTok, por su parte, exige etiquetar el contenido realista hecho con IA.
4. Higgsfield incrusta C2PA en lo que genera (Términos §6.4, 26-07-2026), así que Meta y TikTok van a poner la etiqueta solos igual. Conviene declararlo nosotros primero y usarlo como parte del personaje, que es lo que ya prevé LUCIA.md.
5. **Los fracasos siguen tres patrones:** engaño (Emily Pellegrini, Mia Zelu), apropiarse de experiencias reales (Miquela con el abuso sexual en 2019 y la leucemia en 2025) y reemplazar a un humano a la vista del público (Alba Renai en Mediaset, 2024-2026).
6. **En B2B la apuesta es temprana y no está probada.** Según Linqia 2026, sólo el 9% de los marketers piensa trabajar con influencers virtuales y apenas el 2% piensa crear un avatar propio. No encontré ningún caso verificable de vocero IA de un SaaS en LatAm. La métrica de «demos agendadas» es la correcta.
7. Según la meta-análisis de JAMS 2026 (210 estudios), cuanto más humana se ve la persona, más credibilidad y confianza genera. Los posts donde aparece interactuando con humanos logran más engagement. Para Lucía eso significa mostrarla con personas reales que dieron su consentimiento, nunca con clientes inventados.
8. **Benchmarks de video (fin de sep-2026).** En el ranking imagen-a-video de Arena.ai (21-09) los primeros son MiniMax H3, Gemini Omni 1.1 Flash, Wan 3.0 y Seedance 2.5/2.0. En el de Artificial Analysis con audio lideran MiniMax H3 (Max) y Gemini Omni Flash. Kling 3.0 y Veo 3.1 quedaron más abajo. No existe un arena público específico de lip-sync.
9. **Todos esos modelos están en Higgsfield** (catálogo MCP consultado hoy). Los que aceptan nuestro audio (la voz Marcela) son Seedance 2.0/2.5, MiniMax H3, Wan 2.7/3.0 y Grok 1.5. Kling 3.0, Veo 3.1 y Gemini Omni generan su propia voz, así que necesitan `sync_so` para usar la de Marcela.
10. **Propuesta de A/B para un selfie UGC de 8-10 s en español**, cuatro variantes:
    - (A) Seedance 2.5 con audio de Marcela: 70 cr por 10 s en 720p (preflight en vivo).
    - (B) MiniMax H3 con audio de Marcela: costo no verificado.
    - (C) Gemini Omni Flash 1.1 + `sync_so`: 30 cr + sync.
    - (D) control: Kling 3.0 + `sync_so`: 17,5 cr + sync.

    Es gasto de video, así que requiere la aprobación explícita de Sergio Urcullo.

---

## Método y límites (leer antes de citar un número)

- **El `WebFetch` estaba bloqueado por el proxy de salida** para casi todos los dominios: Instagram, Wikipedia,
  Axios, TechCrunch, CNN, Artificial Analysis, Meta Transparency, TikTok Support, virtualhumans.org, invideo y
  otros. Instagram no se pudo abrir de ninguna forma. **Cada cifra de seguidores viene del extracto que
  devuelve el buscador sobre la página citada**, no de una lectura directa. Por eso cada cifra lleva fuente y
  fecha. Si la fecha no se conoce, lo digo.
- Lo que sí se pudo leer directo: páginas de `higgsfield.ai` (blog, help center, términos) y el **catálogo en
  vivo de Higgsfield por MCP** (`models_explore`, 2026-09-30). También hice **tres preflights de costo con
  `get_cost:true`**, que no crean ningún job ni gastan créditos. El cuarto preflight (MiniMax H3) lo bloqueó el
  clasificador de permisos y no lo reintenté, así que ese costo queda **sin verificar**.
- Se cruzó todo con el estado interno de `hermes-content/references/modelos/lucia/LUCIA.md` (voz Marcela,
  pruebas de lipsync del 15, 18 y 21 de agosto), sin modificar el repo.
- Muchos blogs de 2026 reciclan cifras viejas. Un ejemplo es el «5,67% vs 1,89% de engagement» de
  HypeAuditor, que viene de un informe de ~2019-2020. Donde lo detecté, lo marco.

---

## Parte 1 — Referentes

### 1.1 Tabla resumen

| Referente | Tipo | Dueño | Nicho | Seguidores (fuente, fecha) | Cómo declara que es IA |
|---|---|---|---|---|---|
| **Lu do Magalu** (BR) | 3D estilizado | **Marca** (Magazine Luiza) | retail, tecnología, ofertas | IG 9,1 M · FB 14 M · TikTok 7,5 M · YT 3 M · X 1,2 M ([Axios, datos al 10-06-2026](https://www.axios.com/2026/06/15/lu-do-magalu-virtual-influencer-brazil)) | Es la cuenta oficial `@magazineluiza`; visiblemente un personaje |
| **Nat Natura** (BR) | 3D / chatbot | **Marca** (Natura) | belleza, cabello rizado | no verificado | Mascota de la marca que maneja el X oficial ([UFPE](https://repositorio.ufpe.br/handle/123456789/50654)) |
| **CB (ex-Baianinho)** (BR) | 3D estilizado | **Marca** (Casas Bahia) | retail, gamer/streamer | «10 M en las redes de la marca» (no es cifra propia de CB; [Meio & Mensagem](https://www.meioemensagem.com.br/marketing/casas-bahia-apresenta-baianinho-totalmente-remodelado)) | Mascota declarada |
| **Aitana López** (ES) | Fotorreal (SDXL + Photoshop) | Agencia The Clueless | fitness, gaming, lifestyle | 391 K IG (fecha no verificada; [El Destape](https://www.eldestapeweb.com/sociedad/redes-sociales/quien-es-aitana-lopez-la-ia-influencer-como-se-creo-2025828205049) / [Wikipedia](https://en.wikipedia.org/wiki/Aitana_L%C3%B3pez)) | La agencia dice que la lanzó «dejando claro» que es IA. Hubo reportes de bio sin mención explícita ([Fortune, 21-02-2024](https://fortune.com/europe/2024/02/21/ai-influencers-secretive-creators-thousands-dollars/)) |
| **Alba Renai** (ES) | Fotorreal | **Medio** (Mediaset / Be a Lion) | presentadora de TV (Supervivientes) | ~17-20 K IG ([Infobae, 17-03-2026](https://www.infobae.com/espana/2026/03/17/lluvia-de-criticas-a-supervivientes-y-mediaset-por-mantener-a-su-presentadora-mas-polemica-alba-renai-no-la-queremos-queremos-a-maria-lamela/)) | Presentada públicamente como IA |
| **Mar.ia** (MX) | 3D/CGI | Freelander Studio | lifestyle, causas, comida mexicana | 107 K IG (dato de 2020; [El Universal](https://www.eluniversal.com.mx/techbit/ella-es-maria-la-primera-humana-virtual-mexicana/)) | «Humana virtual» |
| **Squad MGC** (CL) | Fotorreal | Agencia MGC | 5 personas para marcas | sin métricas públicas ([Pauta, 24-02-2025](https://www.pauta.cl/dato-en-pauta/2025/02/24/los-primeros-influencers-latam-hiperrealistas-creados-con-ia.html)) | Lanzados como IA |
| **Lil Miquela** (US) | CGI | Brud → Dapper Labs | música, moda | IG 2,27 M y TikTok 3,3 M (ago-2026, extracto de [HypeAuditor](https://hypeauditor.com/instagram/lilmiquela/)/[Favikon](https://www.favikon.com/blog/top-ai-influencers-social-media)). Otra fuente dice 2,6 M ([Everything-PR](https://everything-pr.com/ai-influencers-lil-miquela-aitana-lopez-virtual-brand-ambassadors)): no concuerdan | Narrativa de «robot» en bio y captions |
| **Imma** (JP) | CGI fotorreal | Aww Inc. | moda, arte | ~379 K IG / 447 K TikTok («2026» según extracto, sin fecha exacta: no verificado) | Bio: «I'm a virtual girl» ([VirtualHumans](https://virtualhumans.org/human/imma-gram)) |
| **Milla Sofia** (FI) | Fotorreal (Stable Diffusion) | Netmylly Oy (empresa de IT y e-commerce) | viajes, moda | 552,3 K IG (sep-2026, [infludata](https://infludata.com/rankings/top-20-influencer-finland-media-instagram)). Otras fuentes dicen 675-682 K: no concuerdan | Bio: «I'm an AI creation» ([Greek City Times, 2023](https://greekcitytimes.com/2023/07/26/milla-sofia-the-blonde-influencer-who-posted-from-greece-is-an-ai-creation/)) |
| **Kenza Layli** (MA) | Fotorreal | Agencia Phoenix AI (Myriam Bessa) | lifestyle, cultura marroquí | ~200 K IG, 45 K TikTok (jul-2024, [CNN](https://www.cnn.com/2024/07/11/style/miss-ai-pageant-winner-kenza-layli)) | Declarada; ganó «Miss AI» |
| **Rozy** (KR) | Fotorreal | Sidus Studio X | moda, **seguros** (Shinhan Life) | 130-144 K (datos 2021-2023; sin cifra 2026) | Declarada |
| **Lucy** (KR) | 3D fotorreal | **Marca** (Lotte Home Shopping) | live commerce | no verificado | Declarada |
| **Emily Pellegrini** | Fotorreal | Anónimo | «chica ideal», contenido para adultos | 137 K en 4 meses (2024, [Yahoo/Fortune](https://finance.yahoo.com/news/ai-influencers-making-secretive-creators-121608358.html)) | **Al principio no lo declaraba**; hoy está etiquetada |
| **Mia Zelu** | Fotorreal | Anónimo | lifestyle, eventos | 150 K+ (jul-2025, [Tennis.com](https://www.tennis.com/news/articles/ai-influencer-mia-zelu-went-viral-wimbledon-artificial-intelligence-social-media)) | Lo decía en la bio, pero **escondido tras «más»** |
| **Noonoouri** | 3D estilizado (muñeca) | Joerg Zuber | moda → música (Warner, 2023) | 400 K+ (2023, [Hypebeast](https://hypebeast.com/2023/9/warner-music-signs-record-deal-ai-generated-popstar-noonoouri-artificial-intelligence)) | Obvio por el estilo |
| **Shudu** | CGI | The Diigitals | modelo de moda | no verificado | Declarada; hubo backlash por representación |

**Vocero IA de B2B, tech o SaaS en LatAm: no encontré ningún caso documentado y verificable.** Lo más parecido
son Rozy (seguros), Kenza con Hyundai (chatbot de venta) y Lu (reviews y tips de apps). Hay agencias
colombianas que venden «clones» IA de gerentes, pero la cifra que publican (+US$10 K facturados en semanas) es
un reclamo de la propia empresa ([Portafolio](https://www.portafolio.co/emprendimiento/empresas-colombianas-apuestan-por-influenciadores-virtuales-impulsados-por-ia-636070)).
Un blog listaba «Maya de Rappi, 420 K» y «Valentina, 380 K», pero **no pude confirmar que existan**, así que
quedaron afuera.

### 1.2 Fichas: formatos, monetización y la lección para ONIA

**Lu do Magalu**, la más relevante.
- **Formatos.** Arrancó en 2009 con unboxings y reviews en YouTube y tips de apps y software. Hoy hace Reels y
  TikTok, aparece en videoclips (la ropa que usó se agotó en la app, según Axios) y toma posturas sociales
  ([UFRGS](https://bibliotecadigital.ufrgs.br/handle/10183/259231?show=full)).
- **Cómo vende.** Vende el catálogo de su propia empresa. Axios estima US$2,5 M al año en posts patrocinados.
  El canal «WhatsApp da Lu» (IA de punta a punta, lanzado en nov-2025) pasó los R$100 M: 7,7 M de usuarios
  únicos en 8 meses, conversión 3× mayor que otros canales, NPS 84,5 y ~20% de recompra
  ([Mobile Time, 07-07-2026](https://www.mobiletime.com.br/noticias/07/07/2026/whatsapp-da-lu-chega-a/)).
- **Lección para ONIA.** La persona funciona como la cara del producto y lleva a una conversación de venta. El
  camino Lucía → chatbot de WhatsApp (el add-on que ya existe) es el mismo que ya probó Magalu.

**Kenza Layli.** Campaña de lanzamiento del Hyundai Kona en Marruecos: anuncios de YouTube, posts y **chatbot en
8 idiomas**, con 2.000+ conversaciones simultáneas y un ROI de 20× declarado
([Marketing Week 2026](https://www.marketingweek.com/ai-influencers-digital-twins-2026/); la agencia figura como
Pixel.ai en esa fuente y Phoenix AI en otras). El ROI no está auditado.
**Lección:** el valor está en el chatbot que atiende, no sólo en la cara.

**Milla Sofia.** La creó una empresa finlandesa de IT y e-commerce como cara de la campaña de su tienda online
([MediaPost](https://www.mediapost.com/publications/article/387736/milla-sofia-creator-believes-age-of-ai-virtual-inf.html)).
Declara abiertamente que es IA y aun así es de las cuentas que más crecen en Finlandia (+5,3% mensual, según
infludata, sep-2026). **Lección:** es el caso con el origen más parecido a ONIA, y demuestra que decir que es IA
no frena el crecimiento.

**Aitana López.** Fotos y carruseles, y sobre todo stories para marcas (restauración, belleza).
- **Monetización:** ~US$1.000 por post, entre €3 K y €11 K al mes según la fuente
  ([Entrepreneur](https://www.entrepreneur.com/business-news/this-ai-fitness-model-makes-11000-a-month/465975),
  [Mercado Negro](https://www.mercadonegro.pe/marketing/marketing-digital/asi-es-aitana-lopez-la-influencer-creada-con-ia-que-genera-ingresos-por-mas-de-us-4000-al-mes/)).
  Tiene además Fanvue a US$15 al mes, una plataforma tipo OnlyFans.
- **Lección:** la firma visual fija (el pelo rosa) sí ayuda. Pero **la vía Fanvue es veneno para una marca B2B**,
  y el modelo de agencia no aplica a ONIA.

**Lil Miquela.**
- **Formatos:** música, moda, vlogs. **Ingresos:** marcas como Prada, Calvin Klein y Samsung.
- **Backlash:**
  - Un vlog de 2019 sobre un «abuso sexual» ([PAPER](https://www.papermag.com/lil-miquela-sexual-assault-vlog-2641593301.html)).
  - El beso con Bella Hadid para Calvin Klein en 2019, acusado de queerbaiting; CK se disculpó.
  - En may-2025, un «diagnóstico de leucemia» para la ONG NMDP, criticado como «disrespectful» aunque
    llevaba disclaimer ([MM+M](https://www.mmm-online.com/news/lil-miquela-leukemia-ai-influencer-marketing/)).
- **Lección:** narrativa sí, pero **nunca actuar vivencias reales ajenas**. Para Lucía eso significa no
  inventar «me pasó con mi paciente» ni fingir el dolor de un cliente.

**Alba Renai.** Mediaset la volvió a poner en Supervivientes 2026 y la respuesta fue otra vez «no queremos IA,
queremos a María Lamela» ([eldiario.es](https://www.eldiario.es/vertele/noticias/mediaset-desoye-criticas-trae-vuelta-alba-renai-presentadora-hecha-ia-cobertura-supervivientes-2026_1_13072335.html)).
**Lección:** cuando la IA ocupa a la vista el lugar de una persona, el público reacciona mal. Lucía tiene que
presentarse como ayuda para el dueño, no como reemplazo de su recepcionista.

**Mar.ia.** Construyó su identidad con lo local: antojitos, memes, artesanías de Taxco
([Heraldo de México](https://heraldodemexico.com.mx/tecnologia/2021/5/10/conoce-maria-la-primera-influencer-virtual-mexicana-que-pide-su-elote-con-chile-del-que-pica-294288.html)).
**Lección:** para Lucía, Santa Cruz tiene que ser real (calor, lugares, comida), no un decorado genérico. Esto
coincide con lo que ya marca LUCIA.md §4 sobre el otoño.

**Imma.** Pone «I'm a virtual girl» en la bio y aun así trabaja con marcas premium (IKEA, Porsche, Valentino).
**Lección:** declarar que es IA no le quita estatus.

**Rozy.** Hizo más de 100 comerciales, incluido uno de un seguro de vida (Shinhan Life)
([Korea.net](https://www.korea.net/NewsFocus/Culture/view?articleId=203388)).
**Lección:** una persona virtual puede ser la cara de un rubro «serio», no sólo de moda.

**Lucy (Lotte).** Como conductora de live commerce agotó bolsos Miu Miu en 25 minutos
([KED Global, 27-01-2023](https://www.kedglobal.com/retail/newsView/ked202301270001)).
**Lección:** una demo en vivo o en formato «te lo muestro» vende más que la foto de lifestyle.

**Emily Pellegrini y Mia Zelu.** Crecieron gracias a la confusión: deportistas y millonarios les escribían
creyendo que eran reales, y en Wimbledon Mia Zelu fingió estar presente.
**Lección:** ese crecimiento se paga con desconfianza. Además, hoy Instagram penaliza a quien no lo declara.

**Noonoouri.** Muestra que no hace falta fotorrealismo para vender: la estilización esquiva el valle
inquietante.
**Shudu.** Recibió críticas por ser una modelo negra creada por un fotógrafo blanco que se queda con la
ganancia ([Refinery29](https://www.refinery29.com/en-us/2018/03/192224/shudu-gram-black-fake-supermodel-fenty-beauty)).
**Lección:** cuidar la representación de la mujer boliviana y evitar estereotipos.

---

## Parte 2 — Patrones

### 2.1 Lo que tienen en común los que funcionan

1. **Una identidad fija y reconocible**: la misma cara, un rasgo firma (el pelo rosa de Aitana e Imma) y un
   mundo recurrente. En ONIA eso ya lo cubren Soul ID, el canon de outfits y lugares y la rúbrica.
2. **Un personaje con postura, no sólo una cara.** Lu opina sobre temas sociales; Mar.ia defiende causas.
   LUCIA.md §1-bis ya lo tiene escrito: está en contra del «humo de la IA».
3. **La divulgación como rasgo del personaje.** Miquela es «robot», Milla dice «I'm an AI creation», Imma se
   presenta como «virtual girl».
   - El dilema: según un estudio en ScienceDirect de 2025, una divulgación muy prominente **baja la
     credibilidad** ([ScienceDirect 2025](https://www.sciencedirect.com/science/article/pii/S2451958825001575)).
     Pero **no declararlo** hoy tiene castigo de plataforma y termina en backlash.
   - Cómo se resuelve: declararlo y usarlo como gancho («hace un año yo no existía»).
4. **La utilidad pesa más que la belleza.** Lu nació para explicar productos y hoy responde y vende por
   WhatsApp. Lucy vende en vivo. Kenza atiende en un chatbot.
5. **Aparecer con humanos que interactúan con ella sube el impacto**, más que la sola presencia de alguien
   ([JAMS 2026](https://link.springer.com/article/10.1007/s11747-026-01185-x)). En ONIA eso sólo puede ser con
   personas reales y con consentimiento. Nada de «clientes» fabricados, que además prohíbe CLAUDE.md.
6. **El diseño humano gana confianza y el estilizado gana novedad.** Es la conclusión de la meta-análisis de
   210 estudios ([JAMS 2026](https://link.springer.com/article/10.1007/s11747-026-01186-w)). Para vender
   software a un dueño de negocio conviene lo humano y creíble.
7. **Mezcla de contenido.** Los posts no patrocinados logran más engagement que los patrocinados
   ([Tandfonline 2025](https://www.tandfonline.com/doi/full/10.1080/00218499.2025.2464300)). **No encontré
   ningún ratio numérico con evidencia** (el típico «80/20» no tiene respaldo). La propuesta es medirlo con la
   métrica única, demos con `src=lucia-*`, en vez de adoptar un número de blog.
8. **Formatos por función:**
   - Reels y TikTok con talking-head selfie, para el gancho.
   - Carruseles, para educar.
   - Stories diarias, para dar continuidad.
   - Vivos o demos («te lo muestro»), para vender.
   - Chatbot, para cerrar.

   El producto tiene que verse en pantalla real, como exige la regla de pauta de CLAUDE.md.
9. **Responder comentarios en personaje** y sostener conversaciones en tiempo real, como hace Lu.

### 2.2 Fracasos y backlash

| Tipo | Caso | Qué pasó |
|---|---|---|
| Engaño | Emily Pellegrini, Mia Zelu, Milla Sofia al principio («posteó desde Grecia») | La gente creyó que eran reales. Al revelarse, llegaron las acusaciones de manipulación |
| Apropiarse de lo real | Miquela: abuso sexual (2019) y leucemia (2025) | «Estás jugando con traumas reales» |
| Reemplazar humanos a la vista | Alba Renai (2024 y 2026). Anuncios con IA de Coca-Cola, J.Crew, Valentino y McDonald's ([Digiday](https://digiday.com/marketing/with-ai-backlash-building-marketers-reconsider-their-approach/), [Marketplace, 26-05-2026](https://www.marketplace.org/episode/2026/05/26/amid-ai-backlash-brands-are-leaning-into-the-human-side-of-marketing)) | Rechazo al «AI slop». Algunas marcas retiraron campañas |
| Representación | Shudu | Críticas por lucrar con la imagen de una mujer negra |
| Valle inquietante y artefactos | J.Crew (un pie al revés). Internamente: Veo lite con «movimientos raros al hablar» y deriva del lip-sync | Un solo artefacto delata la pieza |
| Sexualización | Aitana y Emily en Fanvue | Riesgo de reputación para cualquier marca seria |
| Engagement que no convierte | El «5,67% vs 1,89%» es una cifra reciclada (HypeAuditor ~2019-20, [WERSM](https://wersm.com/report-virtual-influencers-get-nearly-3-times-better-engagement-rate-than-real-influencers/)); **no está verificada para 2026** | Estudios de 2026 muestran que el humano gana en autenticidad y confianza ([JTAER 2026](https://doi.org/10.3390/jtaer21070209)) |

**Contexto de mercado** ([ContentGrip](https://www.contentgrip.com/ai-virtual-influencers-b2b/)):
- La apertura de las marcas a los creadores IA cayó del 86% (oct-2024) al 60% (ago-2025).
- En la encuesta de la WFA (abr-2025), el 60% no piensa adoptarlos y sólo el 15% los probó.
- Según Linqia 2026, el 9% piensa trabajar con ellos y el 2% crear un avatar propio.
- Entre los que no los adoptan, el 96% da como motivo la confianza.

---

## Parte 3 — Reglas de plataforma vigentes

### 3.1 Instagram / Meta

- **Etiqueta de perfil «AI-generated profile» (31-08-2026).**
  - Reemplaza a la etiqueta «AI creator», lanzada en mayo de 2026
    ([MediaPost, 06-05-2026](https://www.mediapost.com/publications/article/414862/instagram-unveils-new-ai-creator-account-label.html)).
  - Se activa en Editar perfil → «AI-generated profile».
  - Aparece en el perfil, en la búsqueda, junto a los posts, Reels y Stories, y junto a comentarios y DMs.
  - Un perfil con persona IA **sin etiqueta queda fuera de las recomendaciones** (Reels, Explore, cuentas
    sugeridas). Se recupera etiquetando o apelando desde Account Status.
  - No hace falta para quien sólo usa IA para editar fotos o textos.
  - Fuentes: [TechCrunch, 31-08-2026](https://techcrunch.com/2026/08/31/instagram-puts-new-limits-on-undisclosed-ai-profiles/),
    [9to5Google](https://9to5google.com/2026/08/31/instagram-ai-generated-influencers-label-update/),
    [Social Media Today](https://www.socialmediatoday.com/news/instagram-updates-tags-for-ai-profiles/829235/).
    **No encontré la página oficial de Instagram con este anuncio.** Hay que verificarlo en la app al crear o
    editar el perfil.
  - **Para Lucía, esto convierte la regla de LUCIA.md («etiqueta IA obligatoria en la bio») en una condición
    de alcance.** Hay que activar el toggle, no alcanza con escribirlo en la bio.
- **«AI info» por post.**
  - Meta **exige** declarar el video fotorrealista o el audio realista creado o alterado digitalmente, y puede
    penalizar a quien no lo haga.
  - Detecta sola las señales C2PA/IPTC.
  - Fuentes oficiales: [Meta, 04-2024](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
    y [Transparency Center, «Labeling AI content»](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content).
  - Si el post ya lleva «AI info», la etiqueta de perfil no se duplica en ese post.
- **Higgsfield y la procedencia** ([Términos, act. 26-07-2026](https://higgsfield.ai/terms-of-use-agreement)).
  - §6.4: puede incrustar marcas C2PA en los resultados.
  - §5.5: obliga a declarar la IA donde la ley lo pida y **prohíbe quitar esas marcas**.
  - §4.4: el uso comercial es libre.
  - §4.2(b): hace falta consentimiento para cualquier rostro o voz de persona real.
- **Contenido de marca.**
  - Si Lucía publica sobre ONIA en su propia cuenta, es **publicidad de primera parte**. La etiqueta «Paid
    partnership» sirve para etiquetar a un socio *externo*, así que técnicamente no aplica.
  - Aun así, **la relación comercial tiene que ser evidente**: en la bio, «IA creada por ONIA», y nunca
    presentarla como una usuaria o clienta independiente que recomienda el sistema.
  - Si algún día Lucía promociona a terceros, o ONIA le paga a otro creador, sí va la etiqueta
    ([Instagram Help](https://help.instagram.com/1109894795810258),
    [Meta: enforcement](https://www.facebook.com/business/help/1303055829784334)).
  - Hay blogs que dicen que desde mar-may 2026 los anuncios con creadores deben ir como Partnership Ads
    obligatorios. **Es un dato discutido**: Cohley señala que la fuente original no tiene fecha
    ([ContentGrip](https://www.contentgrip.com/meta-branded-content-rules-update/) vs
    [Cohley](https://www.cohley.com/blog/meta-partnership-ads-requirements)).
- **Anuncios.**
  - La obligación estricta de declarar la IA aplica a los anuncios de temas sociales, elecciones y política.
  - Al resto de los anuncios Meta les pone «AI info» solo cuando detecta IA (fuentes de terceros:
    [Cinerads](https://www.cinerads.com/blog/ai-ugc-facebook-ad-policy)).

### 3.2 TikTok

- **Etiqueta AIGC obligatoria** para imágenes, audio o video realistas generados o muy editados con IA,
  incluidos los avatares de apariencia real.
  - Etiqueta automática por C2PA y marcas de agua invisibles.
  - Prohíbe la IA que imita la cara o la voz de una persona real sin permiso, y la que representa a personas
    privadas.
  - Oficial: [Community Guidelines, Integrity & Authenticity](https://www.tiktok.com/community-guidelines/en/integrity-authenticity),
    [Newsroom: labels](https://newsroom.tiktok.com/new-labels-for-disclosing-ai-generated-content?lang=en),
    [Creator Academy](https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label).
- **El usuario puede pedir «ver menos IA»** con un control en su feed
  ([TikTok Newsroom, nov-2025](https://newsroom.tiktok.com/more-ways-to-spot-shape-and-understand-ai-content?lang=en)).
  Eso implica un techo de alcance para cualquier cuenta IA. TikTok entró al comité directivo de C2PA el
  27-07-2026 ([C2PA](https://c2pa.org/c2pa-welcomes-tiktok-to-steering-committee/)).
- **Actualización de las guías** publicada el 25-08-2026 y vigente desde el 24-09-2026, con reglas de
  etiquetado AIGC más claras. Fuente de terceros, no verificada en la página oficial
  ([Storika](https://www.storika.ai/guides/tiktok-community-guidelines-update-2026-brand-risk)).
- **Anuncios:** se habla de una etiqueta «AI Disclosure» a nivel de anuncio en Ads Manager desde ene-2026
  ([Cinerads](https://www.cinerads.com/blog/tiktok-ai-content-policy)). **No verificado en la fuente
  oficial.** Los posts promocionales llevan además el toggle de contenido comercial.

### 3.3 Bolivia y LatAm (breve)

- **Bolivia.**
  - La **Ley 453** (4-12-2013) prohíbe la publicidad engañosa y garantiza el derecho a información veraz
    ([texto, BCB](https://www.bcb.gob.bo/webdocs/normativa/2013%20-%20LEY%200453%20-%20Derechos%20Usuarios%20y%20Consumidores.pdf)).
    No tiene nada específico sobre IA, pero una empresa responde por lo que su IA afirma
    ([ECG Legal](https://ecglegal.com.bo/blog/la-proteccion-del-consumidor-frente-al-uso-de-ia)).
    Aplicado a Lucía: **ninguna capacidad ni cifra de Onia que no exista**, lo que coincide con la regla de
    CLAUDE.md de no fabricar.
  - El **proyecto de Ley 178/2024-2025 sobre IA** (prohíbe usar la IA para manipular o engañar) pasó el Senado
    el 22-10-2025 y sigue pendiente en Diputados. **Todavía no obliga a nada**
    ([El Deber](https://eldeber.com.bo/pais/senado-aprueba-proyecto-ley-uso-inteligencia-artificial-da-prerrogativas-agetic_1761265348),
    [Levellers](https://www.levellers.ai/what-is/ai-regulation-bolivia)).
- **Brasil.** La nueva guía de CONAR para influencers rige desde el 01-06-2026.
  - Las personas virtuales tienen que dejar claro que no son humanas.
  - La identificación de la publicidad va al inicio del video, nunca escondida en «más».
  - El contenido hecho con IA sigue las mismas reglas de veracidad.
  - Fuentes: [Mondaq](https://www.mondaq.com/brazil/social-media/1793482/conar-atualiza-guia-de-publicidade-com-influenciadores),
    [Cescon Barrieu](https://cesconbarrieu.com.br/marketing-de-influencia-conar/).
    Es el estándar más explícito de la región y sirve como piso de buenas prácticas.
- **Colombia y México.** La guía de la SIC (2020) pide #publicidad y prevé multas
  ([SIC](https://www.sic.gov.co/content/gu%C3%ADa-de-buenas-pr%C3%A1cticas-en-la-publicidad-trav%C3%A9s-de-influenciadores)).
  PROFECO pide #PublicidadPagada ([guía](https://www.profeco.gob.mx/influencers/doc/Profeco-GuiadePublicidadparaInfluencers.pdf)).
  En Argentina hay un proyecto en el Senado que alcanzaría a las imágenes de personas hechas con IA
  ([Diario Judicial](https://www.diariojudicial.com/news-98169-influencers-en-la-mira)).

---

## Parte 4 — Modelos de video con boca y voz (fin de sep-2026)

### 4.1 Benchmarks

- **Arena.ai, imagen-a-video (21-09-2026; 2,08 M votos, 48 modelos)**
  ([arena.ai](https://arena.ai/leaderboard/image-to-video)):

  | # | Modelo | Elo |
  |---|---|---|
  | 1 | MiniMax H3 | 1495 |
  | 2 | Gemini Omni 1.1 Flash | 1488 |
  | 3 | Wan 3.0 | 1480 |
  | 4 | Seedance 2.5 720p | 1477 |
  | 5 | Seedance 2.0 720p | 1475 |
  | 6 | Gemini Omni Flash | 1465 |
  | 7 | HiDream O1 | 1456 |
  | 8 | Grok Imagine Video 1.5 | 1456 |

  Veo 3.1 con audio: ~1398, puesto 13.
- **Artificial Analysis, imagen-a-video CON audio** (extracto del buscador consultado el 30-09; la página
  estaba bloqueada) ([AA](https://artificialanalysis.ai/video/leaderboard/image-to-video)):

  | # | Modelo | Elo |
  |---|---|---|
  | 1 | MiniMax H3 Max (post-entrenado por fal) | 1194 |
  | 2 | MiniMax H3 | 1181 |
  | 3 | Gemini Omni Flash | 1178 |
  | 4 | Seedance 2.0 720p | 1176 |
  | 5 | HiDream-O1 | 1174 |

  Más abajo aparecen Veo 3.1 (1082) y Kling 3.0 Pro 1080p (1073, puesto 12).
- **Artificial Analysis, texto-a-video con audio (26-09-2026):** Gemini Omni Flash ~1233, Wan 3.0 ~1229,
  MiniMax H3 Max ~1227 (extracto).
- **No hay un arena público de lip-sync o talking-head.** Existe un marco académico, THEval
  ([arXiv](https://arxiv.org/html/2511.04520v3)). Las notas sobre calidad de lip-sync vienen de reviews, que
  son de calidad desigual.

### 4.2 Qué hay en Higgsfield (catálogo MCP en vivo, 30-09-2026) y cómo rinde cada uno

La voz oficial de Lucía es **Marcela** (ElevenLabs), según LUCIA.md §11. Por eso la columna clave es si el
modelo **acepta `audio_references`**. Si no los acepta, habla con una voz propia y hace falta pasar después por
`sync_so`.

| Modelo (`id`) | Audio nativo | Acepta nuestro audio | Duración | Notas de lip-sync y español | Costo (créditos) |
|---|---|---|---|---|---|
| **Seedance 2.5** (`seedance_2_5`) | sí | **sí** (modo `omni_reference`) | 4-30 s; 480/720/1080p; modo borrador a 480p | Salió el 31-07-2026. Audio y video salen en la misma pasada ([fal](https://fal.ai/learn/tools/what-is-seedance-2-5)). Español soportado; hay que revisar cada toma ([blog no oficial](https://www.seedance.tv/blog/seedance-2-5-supported-languages)). **En ONIA está sin probar** | **70 cr por 10 s, 720p, con audio (preflight en vivo)**. Blog de Higgsfield: 52 cr por 8 s 720p ([06-08-2026](https://higgsfield.ai/blog/seedance-2-5-pricing-2026)) |
| **Seedance 2.0** (`seedance_2_0`, `_mini`) | sí | **sí** | 4-15 s; hasta 4k | Mandarín e inglés rinden mejor. Para otros idiomas, lo más fiable es **conducirlo con un clip de voz** ([Cutout](https://www.cutout.pro/learn/blog-seedance-2-0-audio-guide/)). Admite «unlim». **En ONIA está sin probar para lipsync** | ~45 cr por 10 s 720p ([Krea](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs)): no verificado en vivo |
| **MiniMax H3** (`minimax_h3`) | sí (estéreo) | **sí** | 4-15 s; **sólo 2K** en Higgsfield | Salió el 31-07-2026. Lip-sync en **11 idiomas, incluido español** ([Runware](https://runware.ai/docs/models/minimax-h3/guides/sound-and-voice)). Hay también `minimax_h3_max` (480/768p): **no queda claro si es la versión «post-trained by fal» que encabeza AA** | **No verificado** (preflight bloqueado). Referencia externa: US$0,14/s ([Atlas](https://www.atlascloud.ai/blog/tips/minimax-h3-lip-sync-and-audio)) |
| **Gemini Omni Flash 1.1** (`gemini_omni_flash_1_1`) | sí | no | 3-10 s; 360p-4k | Salió el 27-08-2026. Google declara **sólo el inglés evaluado del todo**. Los tests muestran deriva del lip-sync en diálogos largos ([BuildFast](https://blog.buildfastwithai.com/gemini-omni-1-1-flash-review-accuracy-price-is-it-worth-it-2026)). Lleva marca SynthID | **30 cr por 10 s 720p (preflight en vivo)** + `sync_so` |
| **Gemini Omni Flash** (`gemini_omni`) | sí | no | 4-10 s, 720p | **Sergio Urcullo lo calificó «espectacular» el 21-ago**: el mejor UGC probado hasta ahora (LUCIA.md §10-bis) | 24 cr (medido internamente) + `sync_so` |
| **Kling 3.0** (`kling3_0`) | sí | no (Voice Binding está en la web, no en el MCP) | 3-15 s | El español es uno de sus 5 idiomas ajustados ([Kling](https://kling.ai/blog/kling-video-3-omni-native-lip-sync-audio-guide)). Internamente: «bien, pero se equivoca frases y va más lento» (21-ago). El pipeline `kling3_0_turbo` + `sync_so` remap ya se probó punta a punta el 18-ago | **17,5 cr por 10 s std con sonido (preflight en vivo)** |
| **Veo 3.1** (`veo3_1`, `_lite`) | sí | no | 4/6/8 s (máximo 8) | Pensado para inglés; el español no es su fuerte ([Atlas](https://www.atlascloud.ai/blog/guides/ai-video-models-native-audio-compared)). Internamente, la versión lite hizo «movimientos raros al hablar» | ~58 cr por 8 s ([Higgsfield](https://higgsfield.ai/blog/make-ai-lipsync-videos)) |
| **Wan 3.0** (`wan3_0`, `_prime`) | sí | **sí** | 2-30 s | Salió en ago-2026. Voz multilingüe, **español sin confirmar**. **Ojo:** su antecesor `wan2_7` fue descartado para lipsync por Sergio Urcullo (15-ago). Wan 3.0 es otra generación y está sin probar | no verificado |
| **Grok Video 1.5** (`grok_video_v15`) | sí | **sí** | 2-15 s | Sin reviews de lip-sync en español. Sin probar | no verificado |
| **Sync Lipsync 3** (`sync_so`) | aplica el audio que se le da (video-a-video) | **sí** | según el video de entrada | Salió el 06-04-2026. 95+ idiomas, perfiles, oclusiones ([sync.so](https://sync.so/sync-3)). Modo `remap` | **18,15 cr medidos** (clip de 5 s, LUCIA.md) |
| FLUX 3 Video, Happy Horse | sí | no | 5-20 s / 3-15 s | Happy Horse 1.0 **no incluye español**. La versión 1.1 sí, pero no se sabe cuál corre en Higgsfield | no verificado |

**Sólo en la web (Lipsync Studio), no en el catálogo MCP de hoy:** Higgsfield Speak 2.0 (imagen + audio;
5/10/15 s), Kling Avatars 2.0 (hasta 5 min), Wan 2.5 Speak, Infinite Talk, Kling 2.6 Lipsync y Kling Lipsync
([Help Center, 01-09-2026](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-lipsync-voiceover-and-aspect-ratios)).
Por la regla de CLAUDE.md, la web se usa a mano, así que la prueba la haría Sergio Urcullo.

**Voz en Higgsfield:** para español, ElevenLabs v4 (`elevenlabs_v4`). **Qwen TTS no incluye español.** Igual,
la voz oficial de Lucía se genera local con ElevenLabs y no cuesta créditos de Higgsfield (LUCIA.md §11).

### 4.3 Shortlist para el A/B (selfie UGC en español, 8-10 s, 9:16, voz Marcela)

Condiciones iguales para las cuatro variantes:
- el **mismo still aprobado** (Soul);
- el **mismo guion** (~22-28 palabras);
- el **mismo mp3 de Marcela**;
- 720p.

| Variante | Pipeline | Por qué entra | Costo estimado por toma |
|---|---|---|---|
| **A** | `seedance_2_5` omni_reference: still + mp3 de Marcela como `audio_references`, en una sola pasada | Top-4 en Arena.ai. Es el único candidato de primera línea que podría **evitar `sync_so`** | 70 cr (en vivo). Se puede bajar con borrador a 480p |
| **B** | `minimax_h3`: still + mp3 de Marcela como `audio_references` | #1 en Arena.ai y en AA con audio. Tiene español entre sus 11 idiomas | **hay que medirlo antes** (sólo 2K) |
| **C** | `gemini_omni_flash_1_1` hablando nativo en español → `sync_so` remap con Marcela | Su antecesor fue el mejor según Sergio Urcullo (21-ago). La 1.1 es #2 en Arena.ai | 30 + sync (~18 medidos en 5 s; confirmar para 10 s) |
| **D (control)** | `kling3_0` nativo en español → `sync_so` remap | Es el pipeline **ya probado punta a punta**. El más barato | 17,5 + sync |

Reservas si fallan A o B: `seedance_2_0` (más barato, admite unlim) y `wan3_0` o `grok_video_v15` (aceptan
audio, sin probar). Como control manual en la web: Speak 2.0 y Kling Avatars 2.0.

**Qué medir en cada toma:**
- sincronía labio-audio (mirando cuadro a cuadro las consonantes p/b/m);
- dientes y boca;
- deriva de identidad contra Soul;
- microexpresiones y manos;
- que diga el texto exacto (verificarlo con Whisper);
- costo por toma **aprobada**, incluidos los re-rolls.

**Gasto:** es un lote de video. Por la regla de CLAUDE.md, cada job necesita `higgsfield generate cost` y la
**aprobación explícita de Sergio Urcullo** antes de crearse. Los costos de esta tabla son una referencia, no
una autorización.

---

## Fuentes principales, por parte

- **Parte 1:** Axios (15-06-2026), Mobile Time (07-07-2026), UFRGS, Marketing Week 2026, MediaPost, Fortune
  2024, Entrepreneur, eldiario.es e Infobae (03-2026), MM+M (2025), PAPER (2019), KED Global (2023), Korea.net,
  Hypebeast (2023), Refinery29 (2018), Tennis.com (2025), infludata (09-2026), ContentGrip. Todas enlazadas
  en el texto.
- **Parte 2:** JAMS 2026 (dos artículos), ScienceDirect 2025, JTAER 2026, Tandfonline 2025, Digiday,
  Marketplace (26-05-2026).
- **Parte 3:** about.fb.com (2024), transparency.meta.com, help.instagram.com, TechCrunch, 9to5Google y Social
  Media Today (31-08-2026), términos de Higgsfield (26-07-2026), TikTok Community Guidelines, TikTok Newsroom,
  C2PA, Ley 453 (BCB), El Deber, CONAR (Mondaq), SIC, PROFECO.
- **Parte 4:** arena.ai (21-09-2026), Artificial Analysis (extractos), catálogo MCP de Higgsfield y preflights
  (30-09-2026), blog y help center de Higgsfield, Kling, sync.so, fal, Runware, BuildFastWithAI, Atlas Cloud,
  Krea y LUCIA.md (interno).
