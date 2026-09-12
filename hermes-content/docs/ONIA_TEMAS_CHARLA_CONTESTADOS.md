<!-- Fuente de verdad: los temas de la charla AgenTICs (12-sep-2026) contestados
punto por punto con evidencia web verificada (workflow de 15 agentes: 7
investigadores + 7 criticos + sintesis). Las notas crudas viven en
historial/TEMAS_CHARLA_AGENTICS_20260912.md. Si una decision cambia, se EDITA
este archivo. -->

# ONIA — TEMAS DE LA CHARLA, ORDENADOS Y CONTESTADOS

Fuente: notas crudas de Sergio Urcullo en AgenTICs 2026 (12-sep, UPSA). Cada punto contrastado contra 7 informes verificados con fuentes web consultadas ahora. Datos internos de Onia se marcan como [interno]. Nada de esto es asesoría de inversión.

## Mapa de grupos

| Grupo | Tema | Notas que caen ahí | Veredicto dominante |
|---|---|---|---|
| A | Precios y forma de vender el SaaS | planes/límites, ROI, tiempo-hasta-valor, lanzar sin el 100% | HACER YA (casi todo es empaquetar lo que existe) |
| B | IA propia / infraestructura LLM | open source, homelab, DGX Spark, entrenar modelos | CONGELAR el fierro; HACER YA la API barata |
| C | Hermes, agentes y n8n | equipos de agentes, MCP, estandarizar antes de automatizar | PLANIFICAR con guardrails |
| D | Venta, narrativa y ERPs | tutoriales, riesgos de IA, EasyContact/Facilito, CRMs caros | HACER YA (posicionamiento gratis) |
| E | Santa Cruz / ecosistema | networking, gobierno, Villarroel/Villafuerte, comunidad | HACER YA comunidad; CONGELAR gobierno |
| F | Negocios nuevos | cripto, YC, Uber-like, dropshipping, pasivo, B2C masivo | CONGELAR todo (la evidencia confirma la regla de la casa) |

---

## Grupo A — Precios y forma de vender

### "Todo en un solo plan con límites estilo ManyChat" (YA DECIDIDO: queda la escalera C de 4 planes)
- **Evidencia:** el pricing híbrido (suscripción + topes de consumo) es el modelo con mayor crecimiento mediano medido: 21% (https://www.maxio.com/resources/2025-saas-pricing-trends-report). La escalera C ya decidida es exactamente eso.
- **Veredicto: HECHO / no reabrir.** La decisión tomada coincide con la evidencia. Único añadido pendiente: topes de mensajes del bot como palanca de upgrade.

### "Medir cuándo se recupera la inversión / mostrar el tiempo que ahorra la IA (el valor)"
- **Evidencia:** las apps con IA cobran 41% más por usuario pero retienen peor (21,1% anual vs 30,7% sin IA) — el que no demuestra valor recurrente pierde al cliente en meses (https://www.revenuecat.com/blog/growth/ai-app-retention-study). La retención se compra mostrando resultado, no features.
- **Veredicto: HACER YA.** Un contador simple en el panel: "este mes el bot atendió X conversaciones ≈ Y horas de una persona ≈ Bs Z" (Bs Z contra un sueldo mínimo prorrateado). Es UI sobre datos que ya existen en Chatwoot/el motor. 1-2 días, Bs 0.

### "Mostrar tiempo-hasta-producción y tiempo-hasta-primer-valor"
- **Evidencia:** los upgrades ocurren en los meses 2-4 del cliente, 3x más en el mes 2 que en el 9 — la ventana de demostrar valor es el arranque (https://chartmogul.com/reports/saas-billing-report/). Los ERPs caros venden la puesta en marcha como producto con nombre (SAP Activate: Discover→Prepare→Explore→Realize→Deploy→Run; https://www.sap.com/products/erp/activate-methodology.html).
- **Veredicto: HACER YA.** "Plan de arranque Onia": checklist de 5 pasos por rubro DENTRO del asistente de registro ya construido (datos→configuración→primera cita→primer cobro→primera semana medida). Self-service, cero horas de Sergio Urcullo por cliente. NO copiar el fee de onboarding tipo HubSpot: cada hora de implementación es hora del fundador y baja el techo del negocio [interno: el techo son horas de soporte].

### "Lanzar sin el 100% hecho, demostrar ROI rápido"
- **Evidencia:** en el mercado de apps de suscripción, las lanzadas en 2025 capturan solo 3% del revenue y las pre-2020 el 69% — esperar a estar "completo" solo regala tiempo de distribución (https://www.revenuecat.com/state-of-subscription-apps).
- **Veredicto: HECHO en espíritu, con un límite.** La regla de la casa ya lo dice: se vende lo VIVO, y la venta nunca exhibe obra ("muy pronto" prohibido). Lanzar incompleto sí; anunciarlo incompleto no.

### "Marketing para empresas dentro de los planes: vender resultados, no solo operar"
- **Evidencia:** en SMB el NRR mediano es ~97% — la expansión viene de add-ons al MISMO cliente, no de logos nuevos (https://optif.ai/learn/questions/b2b-saas-net-revenue-retention-benchmark/).
- **Veredicto: PLANIFICAR.** Como copy sí ("el bot te consigue citas", no "el bot contesta mensajes"): reescritura de landing, 1 día. Como SERVICIO de marketing operado por Onia: NO — falla la pregunta 3 del test (horas del fundador por cliente) y sería línea nueva.

### Bonus del grupo (no estaba en las notas pero la evidencia lo grita): plan anual prepagado
- **Evidencia:** en tickets bajos (<$25 ARPA) la retención anual es 62% vs 41% mensual (https://chartmogul.com/reports/saas-billing-report/). Descuento de 2 meses = precio efectivo -16,7%; con 5 anuales el break-even queda cubierto un año por adelantado [interno: break-even ≈ 5 clientes].
- **Veredicto: HACER YA** (agregar a `subscription-plans.ts` + pasarela QR; ofrecerlo en meses 2-4 del cliente).

---

## Grupo B — IA propia / infraestructura LLM

### "Modelos open source (Gemma, Kimi) en VPS pago u homelab gratis, invertir en infraestructura LLM (IMPORTANTE)"
- **Evidencia:** Kimi K3 son 2,8 billones de parámetros y 1,56 TB de pesos — es modelo de API, imposible en casa (https://www.yottalabs.ai/post/kimi-k3-specs-benchmarks-how-to-access-2026). Gemma 4 sí tiene tamaños edge (E2B/E4B, Apache 2.0) (https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/; el 12B salió aparte: https://huggingface.co/google/gemma-4-12B). En VPS CPU-only lo realista es un 3-4B a 10-15 tok/s (https://valebyte.com/en/blog/your-own-llm-on-a-cpu-vps-ollama-llama_cpp-with-7b-13b-models/). La cuenta: el chatbot completo (~3.000 conversaciones/mes) cuesta en API ~US$1,5-3/mes ≈ Bs 20-35. "Invertir en infra LLM" con esa factura no tiene matemática.
- **Veredicto: CONGELAR el fierro, HACER YA la API.** Motor del bot en API barata vía credencial de n8n con fallback multi-proveedor. PROHIBIDO instalar modelos en el VPS Hostinger (ollama ya lo estranguló una vez y costó penalidad [interno]). Homelab con Ollama SOLO si la PC ya tiene GPU ≥8GB y SOLO para loops internos donde caerse no cuesta nada — gasto Bs 0, cero compras.

### "Evaluar dónde open source vs nube"
- **Evidencia:** APIs de modelos chicos regaladas: Qwen3.7 Flash $0.03/$0.13 por millón de tokens en el tramo <32K (https://getdeploying.com/llms/qwen3.7-flash; sube a $0.20/$0.80 con contexto largo: https://www.aimadetools.com/blog/qwen-3-7-flash-complete-guide/); DeepSeek V4 Flash $0.14/$0.28 según su pricing, pero agregadores reportan reemplazo por V4.1 Flash con tramos peak/off-peak (https://benchlm.ai/deepseek/api-pricing) — verificar en la consola oficial el día de cablear; gpt-5.4-mini $0.75/$4.50 como fallback (https://openrouter.ai/openai/gpt-5.4-mini). El break-even del self-hosting se estima en decenas de millones de tokens POR DÍA (estimación; la fuente no pudo verificarse hoy).
- **Veredicto: DECIDIDO por la cuenta.** Nube hasta >100 clientes de chatbot activos. Presupuestar por token, no por modelo (los nombres rotan cada 6 meses). Riesgo a nombrar en contrato: datos de clientes bolivianos en servidores de proveedores chinos — mitigable eligiendo proveedor por cliente sensible.

### "Entrenar modelos locales para venderlos (NVIDIA, DGX Spark)"
- **Evidencia:** DGX Spark subió a US$4.699 y un AMD Strix Halo de ~US$2.348 rinde parecido en FP8/FP16 (https://intuitionlabs.ai/articles/nvidia-dgx-spark-review). US$4.699 ≈ 130 AÑOS de la factura de API del bot, o ~940 mensualidades del plan chico [interno].
- **Veredicto: CONGELAR.** Es la décima línea disfrazada (revivir Onia Box): cliente distinto, sentido sin el núcleo, horas del fundador en fierros. Falla las tres preguntas. Anotado, no se toca.

### "Revisar Hugging Face"
- **Evidencia:** los pesos abiertos que importan ya están mapeados: Qwen3 denso 0.6B-32B Apache 2.0 (https://willitrunai.com/blog/qwen-3-gpu-requirements), Gemma 4, Ministral 3 (3B/8B/14B) y Mistral Small 4 (119B MoE, Apache 2.0) (https://mistral.ai/news/mistral-small-4/). En el ranking de Artificial Analysis, GLM-5.3 y Kimi K3 empatan arriba (44) — ambos solo por API (https://x.com/ArtificialAnlys/status/2097025645889069094).
- **Veredicto: HECHO.** El mapa ya está en este documento; no hace falta una sesión de "explorar Hugging Face". Se revisita cuando cambie la necesidad, no por curiosidad.

### "Temperaturas de IA para que aprenda procesos sola"
- **Evidencia:** ninguno de los informes respalda que un LLM "aprenda procesos solo" ajustando temperatura; lo que sí está medido es el riesgo de agencia excesiva: OWASP ASI03 "Identity and Privilege Abuse" (fundado en Excessive Agency LLM06:2025) pide mínimo privilegio + human-in-the-loop (https://www.indusface.com/learning/owasp-top-10-agentic-ai/).
- **Veredicto: CONGELAR como está formulado.** Un bot que "aprende solo" de conversaciones reales es el bot que inventa precios — y Moffatt v. Air Canada dice que el dueño paga lo que el bot promete (https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot). El conocimiento del bot se versiona y publica con revisión humana [interno: ya se publica a mano — el problema real es que quede desactualizado, no que no aprenda].

---

## Grupo C — Hermes, agentes y n8n

### "Mirar más n8n self-hosted"
- **Evidencia:** [interno] ya está: instancia self-hosted viva en el VPS, 44 workflows activos, 7 con claves hardcodeadas pendientes de limpiar.
- **Veredicto: HECHO — lo que falta es higiene, no más n8n.** Pendiente concreto ya anotado: mover las 7 claves a credenciales de n8n y encender la validación HMAC de calcom-booking.

### "Encontrar los problemas y estandarizar ANTES de automatizar"
- **Evidencia:** es la lección transversal de los 7 informes: los marketplaces mueren por liquidez, no por software (https://www.raftlabs.com/blog/two-sided-marketplace-failure-rate); los ERPs caros venden el playbook, no solo el código (SAP Activate). Automatizar un proceso roto lo rompe más rápido.
- **Veredicto: HACER YA como regla, no como proyecto.** Se escribe en una línea en el CLAUDE.md del carril de agentes: "ningún workflow nuevo sin el proceso manual documentado y ejecutado 3 veces primero". Bs 0.

### "Equipos de agentes (revisor, desarrollador, crítico) y perfeccionar a Hermes" / "Agentes que orquestan agentes"
- **Evidencia:** el patrón enterprise 2026 exige techo de gasto, aprobación humana para dinero/PII y logs inmutables por acción (https://atlan.com/know/ai-agent/enterprise-ai-agent-guardrails-checklist/ — blog de vendor, no estándar; coherente con OWASP). [interno] Hermes ya tiene 15 loops, circuito de aprobaciones por Telegram y la lección vivida: ante un techo de gasto, primero ATRIBUIR el consumo, después cortar.
- **Veredicto: PLANIFICAR, acotado.** Perfeccionar Hermes sí, pero con objetivo medible por loop (regla ya escrita el 3-sep) y sin agregar loops nuevos hasta que el de publicación (el pendiente del sistema) cierre. "Agentes que orquestan agentes" sin un trabajo concreto que orquestar es arquitectura especulativa: no se construye.

### "Cerebro personal Hermes: plan del día, finanzas, tareas, briefs" (YA EN CONSTRUCCIÓN)
- **Veredicto: HECHO en curso — terminar antes de ampliar.** Regla de la casa: nada a medias; el handoff del carril manda.

### "MCP de Onia Platform"
- **Evidencia:** ninguna del exterior; es infraestructura interna.
- **Veredicto: PLANIFICAR con gatillo.** Un MCP del producto solo paga cuando hay agentes externos que lo consuman o >1 integrador. Hoy el consumidor sería Hermes, que ya llega por API/DB. Se anota; se construye cuando un caso de uso real lo pida (ej.: el bot necesitando leer agenda del sistema — que hoy se resuelve por el backend directo).

### "Alimentar la IA para que funcione sola, fácil e ilustrado; ver si se vende fuera de Onia Platform"
- **Evidencia:** vender el chatbot FUERA del sistema contradice la propia nota de Sergio ("sin sistema no funciona el chatbot y viceversa") y el add-on pasa el test de 3 preguntas justamente porque se vende al MISMO cliente del sistema [interno: margen del add-on ~99,8%].
- **Veredicto: CONGELAR la venta suelta.** El bot suelto compite contra EasyContact y ManyChat sin diferencial; pegado al sistema no tiene competencia local. La parte "fácil e ilustrado" sí: HACER YA un editor de conocimiento con ejemplos por rubro (ya existe el editor; falta el ilustrado).

---

## Grupo D — Venta, narrativa y ERPs

### "Empezar a vender cosas simples a empresas y potenciar tutoriales"
- **Evidencia:** el comprador está mapeado: dueño de negocio formal, y Santa Cruz concentra 54% de las startups del país (dato del Mapeo 2021 vía https://cadecocruz.org.bo/index.php?op=51&nw=7600 — dato viejo, usar con esa etiqueta; el Mapeo TIC 2025 confirma 155 startups activas y SaaS 23% como vertical líder: https://emprenderfuturo.org/noticias/mapeo-tic-bolivia-2025-el-ecosistema-tecnologico-se-consolida-y-le-hace-frente-al-entorno-economico-desafiante/).
- **Veredicto: HACER YA la venta simple (es el núcleo: sistema + bot, precio claro). PLANIFICAR tutoriales** como material de marketing del producto vivo (videos con el pipeline HyperFrames ya construido), NO como línea de "cursos".

### "Video y aprendizaje sobre riesgos y límites de operar IA en empresas"
- **Evidencia:** hay contenido real y verificado para eso: Air Canada obligada a honrar lo que su bot inventó — CAD 812,02, fallo 2024 BCCRT 149 del 14-feb-2024 (https://www.mccarthy.ca/en/insights/blogs/techlex/moffatt-v-air-canada-misrepresentation-ai-chatbot); EU AI Act art. 50 obliga a revelar que es IA desde el 2-ago-2026 (https://artificialintelligenceact.eu/article/50/); Bolivia sin ley de datos pero con acción constitucional viva (CPE art. 130) y consentimiento expreso exigido por DS 1793 art. 56 (https://www.lexivox.org/norms/BO-RE-DSN1793.html); opt-in obligatorio de WhatsApp (https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in).
- **Veredicto: HACER YA, en dos piezas.** (1) La página de límites del contrato + 8 guardrails en el motor (disclosure, bot que nunca inventa precios, opt-in registrado, cero facturación autónoma, ARCO operable, mínimo privilegio, techo de gasto, log por conversación) — 2-3 días, Bs 0, requisito del núcleo. (2) UN video "el bot que le costó plata a Air Canada" como contenido de venta: educa al mercado y posiciona a Onia como el que opera con límites. NO convertirlo en "consultoría de compliance" — eso sería línea nueva.

### "Revisar EasyContact y Facilito (ERPs)"
- **Evidencia:** ninguno es ERP. Facilito es la aplicación GRATUITA del propio SIN para declaraciones (desde 2016) — nombrarlo competidor sería un error factual (https://boliviaemprende.com/noticias/el-sin-presenta-facilito-herramienta-para-tributar-por-internet). EasyContact es bandeja omnicanal con agentes IA — pero su web devuelve 403 y NADA de su ficha está verificado: no citarlo en material de venta hasta tener fuente directa. Compite con el add-on chatbot, no con el sistema.
- **Veredicto: HECHO — revisados y descartados como amenaza al núcleo.** Pendiente menor: cuando EasyContact publique precios, comparar contra el add-on de Bs 390.

### "Revisar CRMs y ERPs carísimos y documentar guías para que funcione la empresa"
- **Evidencia:** ya revisados con números: SAP B1 cloud $95-250/usuario/mes con implementación $15.000-150.000 (https://www.erpresearch.com/pricing/sap-business-one); Salesforce hoy: Starter $25, Pro Suite $100, Core $195, Advanced $395, Max $550/usuario/mes, solo Starter mensual (https://www.salesforce.com/sales/pricing/); los locales (Emizor, Codex, Ahorasoft) venden solo compliance SIAT — Codex Bs 2.000-2.500/año o Bs 167-208/mes (https://sinergyasoftware.com/codex-facturacion), Sintic Bs 1.250 único (https://sinticbolivia.net/productos/facturacion-electronica-siat-odoo/) — y los grandes esconden el precio.
- **Veredicto: HACER YA el posicionamiento que sale gratis de esto:** precios PÚBLICOS en la web (diferenciarse de Emizor/Ahorasoft que obligan a cotizar) + el argumento "ellos te cobran Bs 1.000-2.500/año solo por facturar; Onia gestiona el negocio entero por Bs 320/mes". Las "guías para que funcione la empresa" = el Plan de arranque del grupo A, no un documento de 40 páginas.

### "Definir cómo vender Onia para el mercado boliviano"
- **Evidencia:** ya está definido y ratificado [interno, 3-sep]: se vende el SISTEMA por rubro, el bot es add-on, cero autobombo, medido contra lety.ai/dapta.ai de HOY. La evidencia nueva solo agrega el ángulo anti-facturadores de arriba.
- **Veredicto: HECHO — ejecutar, no redefinir.**

### "La IA no rinde como una persona real salvo en venta" / "Sin sistema no funciona el chatbot y viceversa: ecosistema"
- **Evidencia:** consistente con los datos: las apps IA cobran más pero retienen peor (RevenueCat, URL arriba) — la IA sola no sostiene la relación; el sistema sí. Y en Bolivia el pitch "reemplazá empleados" es además un riesgo legal para el cliente: la automatización NO es causal de despido (art. 16 LGT; Ley 1468/2022 — https://bolivia.infoleyes.com/articulo/103659).
- **Veredicto: HECHO — son las dos tesis correctas del negocio.** Se escriben tal cual en el copy: "atiende 24/7 y vende", jamás "despedí a tu secretaria".

---

## Grupo E — Santa Cruz / ecosistema

### "Networking en Santa Cruz, potenciar la IA cruceña / comunidad para implementar IA"
- **Evidencia:** AgenTICs 2026 verificado (12-sep, UPSA, Bs 30-100) con Ricardo Lira de la Vega (Claude Ambassador), Lesly Zerna (GDE) y Carla Florida (n8n Ambassador) (http://www.gdgsantacruz.org/). Onia corre n8n + Claude en producción: es exactamente el caso que esos embajadores buscan mostrar.
- **Veredicto: HACER YA.** Esta semana: contactar por LinkedIn/X a Lira de la Vega y Florida con demo de 10 minutos del bot vivo. Costo: Bs 0-100 y horas acotadas. Registrar a Onia en el directorio del Mapeo TIC (Fundación Emprender Futuro). La "Startup Week" NO está verificada como evento 2026 — confirmar que exista antes de agendar.

### "Hablar con el gobierno / Villafuerte y Juan de Dios Villarroel / infraestructura para Santa Cruz / datos sensibles"
- **Evidencia:** Villarroel NO es concejal: dirige la Dirección de Tecnología e Innovación de la Gobernación (https://www.juandediosvillarroel.com/; cargo según https://www.eldia.com.bo/2026-08-26/santa-cruz/gobernacion-activa-segunda-fase-de-digitalizacion-del-hospital-san-juan-de-dios.html), ejecutando salud digital bajo el gobernador Velasco (perfil tech: https://santacruz.gob.bo/biografia). Villafuerte es concejal SUPLENTE (titular Andrea Vaca, VOS) hoy en rol de fiscalización (https://unitel.bo/noticias/politica/estas-son-las-autoridades-del-concejo-de-santa-cruz-de-la-sierra-para-la-gestion-2026-2031-HB20304267). No existe ningún convenio Gobernación/Alcaldía con Anthropic ni Google.
- **Veredicto: CONGELAR govtech.** Vender al Estado falla las tres preguntas (cliente distinto, sentido sin el núcleo, SICOES consume al fundador) y con firmante por poder (Leslie) la fricción es máxima. Lo único: seguir a Villarroel en redes y un mensaje corto "esto ya lo hacemos con negocios privados" — sin propuesta, sin piloto gratis. El "hub digital" de Velasco sirve como viento de marketing ("Santa Cruz se digitaliza, tu negocio también"), no como cliente.

### "Meetings gratis para potenciar uso de IA y marca personal"
- **Evidencia:** el costo real no es la entrada sino los días del fundador; el único cuello de botella medido de Onia son clientes, no visibilidad genérica.
- **Veredicto: PLANIFICAR con filtro duro:** solo eventos donde esté el COMPRADOR (dueño de negocio formal), máximo 1 por mes. Charlas a developers = networking placentero que no factura; se hace solo si sobra la semana.

---

## Grupo F — Negocios nuevos (cripto, YC, Texas, Uber, dropshipping, pasivo, B2C masivo)

### "Cripto"
- **Evidencia:** los que facturan cobran la mesa: Tether ganó >USD 10.000M en 2025 quedándose el rendimiento de USD 122.000M en Treasuries sin pagarle nada al tenedor (https://www.coindesk.com/business/2026/01/30/tether-s-gold-holdings-top-usd17-billion-as-net-profits-surpassed-usd10-billion-for-2025); Coinbase USD 7.181M de ingresos (+9,4%) y 1.200M de utilidad cobrando fees (https://www.macrotrends.net/stocks/charts/COIN/coinbase-global/revenue). El lado del que compra tokens: 53,2% de todos los tokens ya no operan, 11,6M murieron en 2025 (https://www.coindesk.com/markets/2026/01/14/more-than-half-of-all-crypto-tokens-have-failed-and-most-died-in-2025) y en Pump.fun solo 4,55% sobrevive 90 días (https://www.coingecko.com/research/publications/average-lifespan-of-pumpfun-tokens). Bolivia sí legalizó el riel: RD 082/2024 del BCB (https://blockchaininternacional.com/evolucion-del-marco-regulatorio-de-los-criptoactivos-en-bolivia/), USD 294M en el 1er semestre 2025, +630% (https://www.bloomberglinea.com/latinoamerica/bolivia/por-que-hay-un-boom-de-criptomonedas-en-bolivia-no-es-por-entusiasmo-tecnologico/), integración bancaria nov-2025 (https://bravenewcoin.com/insights/bolivia-makes-historic-move-to-integrate-crypto-and-stablecoins-into-banking-system); Toyota, BYD y Yamaha aceptan USDT (https://cryptonews.com/news/toyota-byd-and-yamaha-now-accept-usdt-payments-in-bolivia-tether-ceo-confirms/).
- **Veredicto: CONGELAR como negocio (sería la línea 10, regulada: registro PSAV ante la UIF). PLANIFICAR con gatillo:** aceptar USDT como medio de cobro vía banca regulada (Bisa/BCP) cuando UN cliente real lo pida — instrucción de pago en la factura, cero código, facturado en Bs al tipo de cambio del día. Nunca tesorería en cripto ni wallet caliente en el VPS.

### "Y Combinator / incubadoras"
- **Evidencia:** YC es un fondo: $500K por 7% + SAFE MFN (https://www.ycombinator.com/blog/ycs-500-000-standard-deal), 3 meses presenciales en SF y matriz obligatoria en EEUU/Canadá/Singapur/Caimán (https://www.ycombinator.com/faq); el 40% entra solo con una idea. Portafolio >USD 600.000M y 90+ unicornios — el negocio es la ley de potencias (https://valueaddvc.com/blog/yc-batch-outcomes-the-exit-data-behind-y-combinators-top-companies). No hay caso boliviano confirmado en YC.
- **Veredicto: CONGELAR con gatillo escrito.** Irse 3 meses con 0 clientes mata la única máquina de conseguirlos, y los SAFEs los firmaría Leslie (caso no contemplado por YC). Gatillo: con 5+ clientes pagando y crecimiento semanal medible, la aplicación se manda en un fin de semana (aplicar cuesta Bs 0). "Prepararse para YC" como proyecto = línea 10 disfrazada.

### "Startups mudándose a Texas"
- **Evidencia:** relato vencido: las relocalizaciones California→Texas cayeron (dato oficial: 15 en 2022, 9 en 2023 — gov.texas.gov, Headquarter_Relocations_Texas.pdf) y el capital de IA volvió a San Francisco: 10,2M sqft de oficinas firmadas en 2025, récord desde 2019, Anthropic tomando 300 Howard entero.
- **Veredicto: DESCARTAR.** Titular de otra geografía y otro estadio; cero decisión de Onia depende de esto.

### "Plataforma tipo Uber"
- **Evidencia:** el problema es liquidez de dos lados, no software (https://www.raftlabs.com/blog/two-sided-marketplace-failure-rate); Uber acumuló ~USD 31.500M de pérdidas operativas desde 2014 y recién en 2023 tuvo su primer resultado operativo positivo (https://www.irishtimes.com/business/2023/08/01/uber-makes-first-operating-profit-after-racking-up-315bn-of-losses/).
- **Veredicto: CONGELAR.** Exige capital que subsidie ambos lados durante años. Una persona, cero caja: falla las tres preguntas.

### "Dropshipping"
- **Evidencia:** 90% de tiendas mueren en meses y solo 1-5% construye negocio sostenible (https://trueprofit.io/blog/dropshipping-success-rate); apenas 1,5% supera $50K/mes, con proveedores poco fiables como causa dominante (https://whop.com/blog/dropshipping-statistics/).
- **Veredicto: CONGELAR.** Competir contra 90% de mortalidad con capital de ads que no hay.

### "Ingresos pasivos"
- **Evidencia:** la mediana real de un side hustle en EEUU es $200/mes y 67% reporta burnout (https://www.surveymonkey.com/curiosity/side-hustle-statistics/). Lo único "pasivo" con evidencia a favor está DENTRO del SaaS: anualidades (62% vs 41% de retención), add-ons y topes de consumo.
- **Veredicto: CONGELAR el mito; HACER YA la versión real** (grupo A: plan anual + add-on + topes).

### "Producto masivo no-B2B porque los SaaS bajaron de precio y la gente puede crearlo sola"
- **Evidencia:** las apps lanzadas en 2025 capturan 3% del revenue del mercado contra 69% de las pre-2020 (https://www.revenuecat.com/state-of-subscription-apps) — que "la gente pueda crearlo sola" hace la distribución MÁS cara, no más barata; y las apps IA retienen 30% peor (RevenueCat, URL arriba).
- **Veredicto: CONGELAR.** Es un negocio de distribución que Onia no tiene, con un comprador que no es el suyo. Línea 10 de manual.

---

## Los 5 primeros pasos (empresa de 1 persona, 0 clientes)

1. **Guardrails + página de límites del bot** (Grupo D/C) — 2-3 días, Bs 0. Disclosure, bot que solo responde desde conocimiento versionado, opt-in registrado, cero facturación/cobro autónomo, log por conversación. Es requisito del núcleo antes de operar en empresas ajenas (Air Canada: el dueño paga lo que el bot promete) y protege el activo más frágil: el número de WhatsApp.
2. **Precios públicos + posicionamiento anti-facturadores en la web** (Grupo D) — 1-2 días, Bs 0. "Ellos: Bs 1.000-2.500/año solo por facturar. Onia: el negocio entero desde Bs 320/mes." Los competidores locales esconden precios; mostrarlos es diferenciación gratis.
3. **Plan anual prepagado (10 meses) + contador de valor en el panel** (Grupo A) — 2-3 días, Bs 0. Retención 62% vs 41% en tickets bajos; 5 anuales = break-even cubierto un año. El contador "X conversaciones ≈ Y horas ≈ Bs Z" es la munición de renovación.
4. **Contactar a los embajadores de AgenTICs con el bot vivo** (Grupo E) — esta semana, Bs 0. Lira de la Vega (Claude) y Florida (n8n): Onia es su caso de uso soñado en producción; una mención suya vale más que cualquier ad. De paso, alta en el directorio del Mapeo TIC.
5. **Cerrar lo abierto de Hermes/n8n antes de cualquier agente nuevo** (Grupo C) — limpiar las 7 claves hardcodeadas, terminar el cerebro personal en curso, y fijar la regla "proceso manual 3 veces antes de automatizarlo". Todo lo del grupo F queda anotado y congelado: la evidencia de 2024-2026 no debilitó la regla de la décima línea — la confirmó con números.