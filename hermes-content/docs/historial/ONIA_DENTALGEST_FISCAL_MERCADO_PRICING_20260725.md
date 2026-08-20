# C7 — Decisión fiscal, de mercado y pricing para DentalGest (S1)

> **Carril C7 (research, no codea).** Fecha: 2026-07-25. Cierra los [VERIFICAR] que gatean venta y precios.
> Alimenta S1 (decisión de precios de Sergio) y el guion de venta.
> Docs hermanos: ONIA_VISION_ROADMAP_20260723.md · ONIA_C0_ESQUELETO_MAESTRO_20260723.md · ONIA_CARRILES_PROMPTS_20260723.md

---

# DentalGest — Decisión fiscal y de mercado para S1
**Síntesis de 3 investigaciones · Santa Cruz, Bolivia · 25-jul-2026**
Base de conversión: **Bs 11,37 / USD**, tipo de cambio oficial del BCB verificado hoy para el 25–27-jul-2026 ([bcb.gob.bo](https://www.bcb.gob.bo/)). Cierra el `[VERIFICAR]` que quedaba abierto del informe de benchmarks.

---

## 1. SIAT: ¿aspirina o vitamina para el dentista? (grupo + deadline)

**Veredicto: es aspirina con genérico gratis. Se vende como automatización, nunca como obligación de comprarnos.**

| Pregunta | Respuesta decidida | Fuente |
|---|---|---|
| ¿Está obligada una clínica dental chica? | Sí, con techo duro: **30-sep-2026** (plazo) → desde el **1-oct-2026** solo se emite en modalidad en línea. Cae en el tramo masivo 9°–12° | [SIN — nota de prensa RND 102600000007](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/) · [Impuestos de Bolivia — Normativa 2026](https://impuestos.com.bo/normativa-2026/) |
| ¿Grupo exacto (9°/10°/11°/12°)? | **UNKNOWN.** Depende del NIT, no del sector. No hay fuente oficial que diga "odontología = grupo N" | anexo RND / Oficina Virtual del contribuyente |
| ¿Se puede cumplir sin comprar software? | **Sí.** El **Portal Web en Línea** del SIN cumple la ley gratis, tipeando factura por factura. Sin CUIS, sin CUFD, sin firma digital | [SIAT — Portal Web en Línea](https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web) · [SIAT — Modalidades](https://siatinfo.impuestos.gob.bo/index.php/12-modalidades-de-facturacion) |
| ¿Qué trámite es del dentista? | Credenciales de Oficina Virtual. Nada más si va por Portal Web | [SIAT — Modalidades](https://siatinfo.impuestos.gob.bo/index.php/12-modalidades-de-facturacion) |
| ¿Qué trámite es nuestro? | **Homologación del sistema ante el SIN** (pruebas Fase 1) + CUIS + CUFD diario + sincronización de catálogos + XML según Anexo técnico | [SIAT — CUIS](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/implementacion-servicios-facturacion/codigos/solicitud-cuis) · [SIAT — CUFD](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/implementacion-servicios-facturacion/codigos/solicitud-cufd) |

**Las tres consecuencias que cambian el pitch:**

1. **Decir "por ley tenés que comprarnos" es falso y se refuta con un Google.** El dentista encuentra el Portal Web gratis y perdemos la venta y la confianza. Prohibido en material comercial.
2. **El deadline ya se prorrogó dos veces** (1-oct-2025 → 1-abr-2026 vía [RND 102500000036](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND-102500000036.pdf) → 30-sep-2026). Una tercera prórroga es **UNKNOWN pero plausible**. Usar la fecha como gancho de *timing*, no como amenaza absoluta.
3. **El diferenciador real no es "emitir", es "no re-tipear".** Ningún competidor dental LatAm de la lista (Dentalink, Dentiqa, Doctocliq, Citalo, AgendaPro) resuelve SIAT boliviano, y YoFacturo —que sí apunta a Bolivia— **todavía tiene el soporte SIAT en lista de espera** ([yo-facturo.com/bo](https://yo-facturo.com/bo/), actualizado 22-jun-2026). Ese hueco es el activo de pricing más valioso que tenemos **y caduca el 1-oct-2026**.

> **Alerta operativa, no comercial:** las ~9,5 semanas hasta el 30-sep son ventana de **ingeniería** antes que de venta. Sin homologación aprobada, "SIAT incluido" no se puede prometer como listo. Bloqueo conocido: el NIT. Pitch honesto mientras tanto: DentalGest opera la clínica y el dentista emite por Portal Web del SIN hasta que nuestro emisor esté homologado — se dice, no se esconde.

---

## 2. Mercado dental Bolivia (ticket Bs, no-show, WhatsApp, cantidad de clínicas)

**Ticket real en Santa Cruz** ([losodontologos.com](https://losodontologos.com/bolivia/precios-santa-cruz/) · [boliviaconsulta](https://dental.boliviaconsulta.com/blog/precio-brackets-bolivia/)):

| Tratamiento | Bs | Uso comercial |
|---|---|---|
| Consulta | 100 | unidad de comparación del Básico |
| Profilaxis + flúor | 200 | volumen |
| Resina 1 superficie | 150–350 | volumen |
| **Ajuste mensual de ortodoncia** | **300–350** | **la unidad de venta del Pro** |
| Endodoncia unirradicular / multirradicular | 1.200 / 2.100 | **la unidad de venta del Full** |
| Corona cerámica / implante sin corona | 2.100 / 3.000 | ROI de un solo caso |
| Ortodoncia completa | 3.000–5.500 | ingreso recurrente 12–24 meses |

**Citas perdidas — dato boliviano propio: UNKNOWN.** Comparables regionales (marcados como tales, nunca presentados como Bolivia):
- No-show odontológico "duro" **~9%**; Colombia **18–35%** de inasistencia en servicios odontológicos; Chile **23%** de pacientes que no completan el tratamiento ([SciELO Perú — revisión 2024](http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S1019-43552024000100063) · [Rev. Estomatológica Herediana](https://revistas.upch.edu.pe/index.php/REH/article/view/5331)).
- **Evidencia mixta sobre recordatorios:** SMS bajó no-show ~14% pero subió cancelaciones; recordatorio telefónico en Chile bajó inasistencia de 24% a 21% y **liberó hasta 40% de horas muertas**. → El valor está en **reprogramar y llenar el hueco**, no en "mandar recordatorios". El pitch del agente Recall debe decir *reprograma*, no *recuerda*.
- Frase autorizada para venta: *"En odontología de la región se pierde entre 10% y 30% de las citas y hasta 1 de cada 4 pacientes no termina el tratamiento (datos de Colombia y Chile; en Bolivia no hay estudio publicado)."*

**WhatsApp-first: validado.** >7,5 M usuarios activos ≈ 60% de la población y ~85% de los internautas; internet 8,77 M (70,2%) sobre ~12,5 M de habitantes ([DataReportal Digital 2025 Bolivia](https://datareportal.com/reports/digital-2025-bolivia) · [análisis local](https://www.erickhurtado.click/digital-2025-bolivia-internet-redes-sociales/)); app de mensajería #1 del país ([El Día, 2024](https://www.eldia.com.bo/2024-05-19/tecnologia/estudio-whatsapp-y-tiktok-son-las-redes-sociales-mas-utilizadas-en-bolivia.html)). Descartar el dato de "11 millones" que circula en fuentes secundarias: inconsistente con la población.

**SOM: estimación, no censo.** ~15.000 odontólogos colegiados en Bolivia concentrados en el eje Santa Cruz–Cochabamba–La Paz ([Dental Tribune](https://la.dental-tribune.com/news/la-odontologia-en-bolivia-2/), dato de ~2019, desactualizado). Derivado: consultorios de 1–3 sillones en Santa Cruz en el orden de **miles bajos (~1.000–3.000)** — **estimación propia, no cifra oficial**. Los directorios online listan suscriptores, no censo. Se cierra pidiendo el padrón al [Colegio de Odontólogos de Santa Cruz](https://santacruzodontologos.com/).

---

## 3. Pricing: ¿están bien 320/750/1.500? + insumos para S1

### 3.1 Dónde caen los planes (todo a Bs 11,37/USD, TCO BCB verificado)

| Plan | Bs | USD | Vecino más cercano | Veredicto |
|---|---|---|---|---|
| Básico | 320 | 28,1 | Dentalink 1 usuario 330 · Doctocliq Básico 330 · Citalo Negocio 341 · **piso real del mercado = 0** | **Mal anclado — pero el problema es el packaging, no el número** |
| **Pro** | **750** | **66,0** | 26% debajo de Dentiqa Starter (1.012) · ~10% arriba de Citalo Profesional (682) | **Correcto. Es el ancla y el plan por defecto** |
| Full | 1.500 | 131,9 | 11% debajo de Dentiqa Professional (1.694) · 47% debajo de Enterprise (2.831) | **Correcto, con techo evidente** |

Fuentes de competencia: [Capterra — Dentalink USD 29/usuario/mes](https://www.capterra.com/p/196361/Dentalink/) · [dentiqa.app](https://dentiqa.app/) · [doctocliq.com/planes-y-precios](https://www.doctocliq.com/planes-y-precios) · [citalo.app/bo/precios](https://www.citalo.app/bo/precios) · banda oficial del líder: consultorio pequeño USD 29–100/mes = **Bs 330–1.137** ([Dentalink](https://www.softwaredentalink.com/blog/cuanto-cuesta-digitalizar-clinica-dental)).

### 3.2 Las 4 decisiones para S1

**D1 — Mantener 320 / 750 / 1.500 tal cual. No mover ni un boliviano esta semana.**
El análisis de benchmarks propone bajar el Básico a 290. Se descarta: 30 Bs (-9%) no cruzan ningún umbral competitivo (sigue arriba de Citalo Individual a 170 y sigue compitiendo contra el gratis de Doctocliq y Turnito), y perforar el precio antes del primer cliente le enseña un piso al mercado que después no se recupera. El problema del Básico se arregla **no ofreciéndolo**, no abaratándolo.

**D2 — El Pro (750) es el único plan que se cotiza de entrada.** El Básico existe como **downsell** para no perder al consultorio de 1 sillón, y se menciona recién si el prospecto dice que no. El Full se propone cuando hay 2+ profesionales o alto flujo de WhatsApp. Un Free tier no se construye ahora: consume ingeniería y soporte que el runway no tiene.

**D3 — SIAT va incluido en LOS TRES planes.** Aquí las dos investigaciones chocan (una sugiere subirlo a Pro/Full) y se resuelve así: si el SIAT es upsell, el Básico se queda sin razón de existir y el guion de venta se rompe. Lo que sube de tier es **la automatización** (WhatsApp, reactivación, chatbot IA), no el cumplimiento. Corte entre niveles = *ordenar → cobrar y no perder pacientes → operar sola*; nunca "más pacientes" o "más usuarios" (ese corte obliga a competir contra gratis).

**D4 — Post-portafolio (3–5 casos): Pro → Bs 890–990, Full → Bs 1.990, Básico → Bs 390.** Justificación dura: el boliviano pasó de 6,96 a 11,37 por dólar, **+63,4%**, tras la flotación del 26–27-jun-2026 ([Infobae](https://www.infobae.com/america/america-latina/2026/06/27/bolivia-adoptara-un-esquema-de-flotacion-cambiaria-tras-15-anos-de-regimen-fijo/) · [BCB](https://www.bcb.gob.bo/)). Todo competidor tarifado en USD subió 63% en bolivianos **sin tocar su precio de lista**. El techo psicológico del mercado se movió; nuestros precios de lanzamiento se fijaron cuando el techo era otro. Los precios ya ratificados (390/890/1.990 = USD 34/78/175) siguen todos debajo de Dentiqa Professional.

### 3.3 Add-ons

| Add-on | Setup | Mensual | Anclaje |
|---|---|---|---|
| **Chatbot IA WhatsApp** (agenda, califica, deriva) | Bs 900–1.200 | **Bs 450–600** | Pro + chatbot = Bs 1.200–1.350, aún debajo de Dentiqa Professional (1.694). **El botón click-to-chat va gratis incluido; lo que se cobra es el bot que responde** |
| **Cupo extra de WhatsApp** | — | Bs 0,60–0,80 por mensaje sobre el cupo | Citalo cobra USD 0,05 = Bs 0,57/mensaje ([citalo.app/bo](https://www.citalo.app/bo/precios)). **Confirmado en la doc oficial de Meta:** Bolivia está en la región *Rest of Latin America*, los mensajes no-plantilla dentro de la ventana de servicio de 24h son **gratis**, y las plantillas *utility* entregadas dentro de una ventana abierta también son **gratis** ([Meta — WhatsApp pricing](https://developers.facebook.com/docs/whatsapp/pricing/)). Margen alto y estructuralmente sólido |
| **Implementación + migración** | **Bs 0 (regalada)** | — | La competencia cobra USD 200–800 = **Bs 2.274–9.096** ([Dentalink](https://www.softwaredentalink.com/blog/cuanto-cuesta-digitalizar-clinica-dental)). Es el descuento de mayor valor percibido y costo marginal casi cero |
| **Web / landing** | Bs 790 / Bs 1.500 | según tarifa Cuidado Web | Precio ONIA vigente, no re-cotizar |
| **Contador Pack** | Bs 500 | Bs 350–500 | **UNKNOWN de mercado** — fijar recién con 2–3 cotizaciones reales |

### 3.4 Aritmética de venta (usar textual)

- Pro **Bs 750 = dos ajustes de ortodoncia** (Bs 300–350 c/u). Si evita que dos pacientes de ortodoncia falten en el mes, ya se pagó.
- Full **Bs 1.500 = media endodoncia multirradicular** (Bs 2.100). Una endodoncia recuperada deja Bs 600 de sobra.
- Básico **Bs 320 = tres consultas** (Bs 100 c/u).
- Un implante recuperado (Bs 3.000) paga **dos meses de Full**.

### 3.5 Riesgos de precio (Bolivia, hoy)

- **Descalce cambiario — el más grave.** Ingresos en Bs, costos en USD (Supabase, Anthropic, Meta, hosting). Bs 750 valían USD 108 en mayo; hoy valen USD 66. El TCO se movió otra vez esta misma semana. → **Cláusula de ajuste semestral indexada al TCO del BCB o al IPC del INE, lo que sea mayor**, escrita en el contrato desde el día 1. Y piso interno en USD por plan con re-tarifa automática si se perfora.
- **Inflación 9,23% a 12 meses, 4,82% acumulada al primer semestre, 2,15% solo en junio** ([INE vía La Razón](https://larazon.bo/economia-y-empresa/2026/07/03/bolivia-acumula-una-inflacion-de-482-hasta-junio-segun-el-ine/) · [eju.tv](https://eju.tv/2026/07/la-inflacion-a-12-meses-llega-al-92-hasta-junio-la-acumulada-alcanza-el-482/)). → Nunca ofrecer "precio congelado de por vida".
- **Poder adquisitivo:** salario mínimo Bs 3.300 ([DS 5516](https://oxigeno.bo/el-salario-minimo-de-bs-3-300-rige-desde-el-1-de-enero-de-2026-que-establece-el-reglamento/)). El Full equivale a ~45% de un salario mínimo. → Vender con la aritmética de §3.4, no con features.
- **Churn involuntario por cobro manual.** El QR es el medio de pago del país (891 millones de transacciones en 2025, 94% de las OETF interbancarias — [Asoban vía ABI](https://abi.bo/transacciones-por-qr-mueve-mas-de-us-51-mil-millones-y-se-consolida-como-principal-metodo-de-pago/) · [BCB](https://www.bcb.gob.bo/?q=content%2Fcada-vez-m%C3%A1s-bolivianos-utilizan-medios-electr%C3%B3nicos-de-pago-el-favorito-es-el-qr-que-creci%C3%B3)) **pero no es recurrente**: cada mes alguien decide pagar de nuevo. → Cobrar **trimestral o semestral adelantado** (reduce 12 decisiones de pago a 4 o 2) y medir churn involuntario aparte del voluntario desde el mes 1.
- **Sobre-descuento.** El descuento va **siempre en plazo o en implementación, nunca en la tarifa de lista**.

---

## 4. Lo que queda UNKNOWN (a confirmar antes de venderlo como hecho)

| Ítem | Estado | Cómo se cierra | Bloquea |
|---|---|---|---|
| Grupo SIAT exacto de una clínica concreta (9°–12°) | **UNKNOWN** — depende del NIT, no del sector | En la venta: pedirle al prospecto que mire su Oficina Virtual. Nunca afirmarlo nosotros | Guion de venta (no decir "vos sos grupo X") |
| ¿Habrá cuarta prórroga después del 30-sep-2026? | **UNKNOWN** — ya se prorrogó 2 veces | No se puede cerrar. Vender timing, no ultimátum | Fuerza del gancho de urgencia |
| Fechas exactas de obligatoriedad de los grupos 5°–8° | **UNKNOWN** | RND específicas del SIN | Menor |
| **Homologación de DentalGest ante el SIN (Fase 1) + NIT** | Bloqueo interno abierto | Trámite propio. **Es la ruta crítica de las próximas 9 semanas** | Poder prometer "SIAT incluido y funcionando" |
| Tarifa Meta WhatsApp específica para Bolivia (utility/marketing) | Parcial: región y gratuidades **confirmadas** ([Meta](https://developers.facebook.com/docs/whatsapp/pricing/)); cifra USD por mensaje = UNKNOWN | Descargar el rate card CSV/PDF en USD de la doc de Meta | Margen fino del add-on de cupo extra |
| Tarifa de contador externo en Santa Cruz | **UNKNOWN** | 2–3 cotizaciones reales | Precio del Contador Pack |
| Comisión de QR Simple / pasarelas BO | **UNKNOWN** (hay notas internas de comisión 0, sin fuente pública) | Confirmar con el banco | Margen neto del cobro mensual |
| Tasa de no-show **boliviana** | **UNKNOWN** — no hay estudio publicado | Medirla con los primeros 3 clientes y volverla nuestro dato propietario | Fuerza del pitch del Recall |
| N° de consultorios en Santa Cruz | Estimación ~1.000–3.000, **no censo**; base de ~15.000 colegiados es de 2019 | Pedir padrón al [Colegio de Odontólogos de Santa Cruz](https://santacruzodontologos.com/) | Dimensionar meta comercial, no el precio |
| Precios reales de Dentalink Esencial/Pro/Titanium; Dentidesk; Emizor | No publicados / 404 | Pedir cotización como clínica boliviana de 2 sillones | Afinar el techo, no la decisión |
| Competidor dental **boliviano** con precio en Bs | **No se encontró ninguno** | Preguntar a 5 clínicas qué usan y cuánto pagan | Confirmar que el hueco es real |

---

## 5. Implicancias directas para la venta y el pitch

- **Nunca decir "por ley tenés que comprar DentalGest".** El Portal Web del SIN es gratis y el prospecto lo googlea. Decirlo primero nosotros nos da credibilidad: *"podés cumplir gratis tipeando cada factura en la página del SIN; nosotros hacemos que no tengas que hacerlo."*
- **El gancho es timing, no miedo:** *"Desde el 1 de octubre solo se factura en línea. Dejalo resuelto antes, no en la última semana."* Sin prometer que no habrá prórroga.
- **La aspirina que vendemos es la clínica ordenada y los pacientes que vuelven.** El SIAT es el quita-fricción que hace que no factures aparte. Ese es el orden del pitch, no al revés.
- **Cotizar siempre el Pro (Bs 750).** El Básico se menciona solo si dicen que no. Nunca abrir con tres precios.
- **SIAT incluido en los tres planes.** Lo que separa niveles es la automatización (WhatsApp, reactivación, chatbot), no el cumplimiento.
- **Abrir con la pregunta, no con el producto:** *"¿Cuántos pacientes te faltaron sin avisar el mes pasado? A Bs 300 el ajuste de ortodoncia, ¿cuánto es eso?"* Cerrar con: *"DentalGest te cuesta menos que dos de esas ausencias."*
- **El agente reprograma, no recuerda.** La evidencia sobre recordatorios es mixta; lo que mueve la aguja es llenar el hueco liberado. Vender eso.
- **Regalar la implementación como cierre** (vale Bs 2.274–9.096 a precio de mercado, nos cuesta casi nada). Jamás bajar la tarifa de lista.
- **Cobrar trimestral adelantado por QR**, con recordatorio automatizado del propio DentalGest (nos usamos a nosotros mismos como demo viva).
- **Contrato con cláusula de ajuste semestral indexada al TCO del BCB o IPC del INE**, lo que sea mayor. Se explica de frente: es el único país donde el dólar se movió 63% en un mes.
- **Cuando se cite un dato regional, decir que es regional.** "En Colombia y Chile…", nunca "en Bolivia el 30% de las citas se pierde". Esa disciplina es el activo de confianza con un dentista que va a poner su facturación en nuestras manos.
- **Prioridad de la próxima semana, en orden:** (1) homologación SIAT + NIT — es la ruta crítica; (2) 5 llamadas de campo a clínicas de Santa Cruz (cierran a la vez el UNKNOWN de competencia local, el de no-show y el primer pipeline); (3) padrón del Colegio. **No dedicar ni una reunión a discutir Bs 320 vs Bs 290.**