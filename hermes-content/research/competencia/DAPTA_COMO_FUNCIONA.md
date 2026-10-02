# Dapta: cómo funciona, cómo cobra y cómo consigue clientes

**Fuente de verdad del tema.** Si algo cambia, se edita este archivo. La foto de julio
(`docs/historial/ONIA_DAPTA_PLATAFORMA_UNIFICADA_20260723.md` y la captura `s_www.dapta.ai_.html`,
`dateModified` 25-jul-2026) queda como historia.

**Cuándo y cómo se midió:** 1-oct-2026 por la noche, hora de La Paz (2-oct en UTC). Cuatro investigadores:
la app por dentro (cuenta Free del espacio «OnIA»), la web y el precio (curl + WebFetch), la empresa
(prensa y bases de datos) y la adquisición (Biblioteca de Anuncios de Meta, redes). Este doc los cruza y
marca dónde no coinciden.

**Leyenda:** `[V]` verificado en la fuente primaria · `[D]` lo dice Dapta, sin verificar · `[T]` lo dice
un tercero · `[inf]` inferencia nuestra · ⚠️ contradicción entre fuentes.

**Capturas:** «cap. NN» = `dapta/app/NN-*.jpg` (app, 1-oct). Las páginas guardadas están en `dapta/web/`.

---

## 1. Resumen en 5 líneas

1. **Qué es:** una plataforma horizontal de agentes de IA de voz y texto para PyMEs de EE.UU. y LatAm. Su
   trabajo central es llamar a cada lead, calificarlo, agendarlo y pasarlo al CRM. Hoy la arma un asistente
   propio, **Dapti** `[V]`.
2. **Cómo gana plata:** suscripción prepaga en USD por créditos. Los planes son Pro $99, Scale Up $499 y
   Prime $1.499. **1.000 créditos = US$1 en todos los planes**: los planes caros no abaratan el crédito;
   suman personas (sesiones 1 a 1, gerente de cuenta, grupo de WhatsApp), usuarios y espacios, y Dapti
   incluido `[V]`. El minuto de llamada atendida cuesta US$0,33 `[V]`.
3. **Cómo consigue clientes:** la cara del fundador (su TikTok tiene 140,9K seguidores; sus vlogs sacan
   12K-18K vistas y los tutoriales 400-930). Además: pauta en Meta (9 de 38 títulos venden un webinar gratis;
   el destino del resto no se pudo ver, §5.1), una agencia de pauta comprada (Beezion), un tercero que vende un
   curso de USD 1.950 con créditos de Dapta adentro, y afiliados (⚠️ 30% por 12 meses en /partners, 15%
   recurrente en /es/partners, §3.4) `[V]`/`[T]`.
4. **Qué cambió desde julio:** el precio no. El titular pasó de categoría («plataforma todo-en-uno») a
   resultado («Create your first AI sales agent in 2 minutes»). Se sumaron el sello SOC 2, Dapta Forms,
   «Sequences» (antes «Campaigns»), la industria Seguros, la página /for-ai-agents y el anuncio de la compra de
   Beezion. **Dapti y «Dapta MCP» ya estaban en el menú de la captura de julio**: no son nuevos. La FAQ pasó de
   «over 300 tools» a «1.000+» (el JSON-LD de la misma captura de julio ya decía «1000+ Integrations»; dentro
   de la app se ven 15). WhatsApp directo con Meta y la tabla de consumo de los docs **no se pueden comparar**:
   en julio no se miró la app ni los docs.
5. **Para Onia:** Dapta **no compite hoy por la clínica de Santa Cruz**: no tiene plantillas dentales, no da
   números de Bolivia, cobra en USD con tarjeta y tiene 0 anuncios en Bolivia. Sirve como espejo de **cómo
   se vende**. La decisión de julio (no volverse plataforma horizontal por créditos) se sostiene, y su propia
   tabla de precios la refuerza.

---

## 2. El producto por dentro

### 2.1 Primera experiencia

| Qué se ve | Fuente |
|---|---|
| El inicio es un chat con Dapti: «Hola Leslie, ¿cómo te ayudo?». Arriba hay 4 accesos: crear agente de voz, crear agente de texto, crear un flujo y AI Notetaker | cap. 01 `[V]` |
| Dapti tiene dos modelos: Lite (rápido) y Max (con candado, PRO) | cap. 03 `[V]` |
| «Connect your tools to Dapta» con íconos de Sheets, HubSpot, Calendar, WhatsApp y Gmail. No son clicables | cap. 01, 05 `[V]` |
| La barra lateral muestra siempre «¡Conviértete en un Pro!», la barra de créditos (0 / 1.7K) y «Mejorar plan» | cap. 01, 45 `[V]` |
| Los 4 accesos probablemente envían un mensaje a Dapti y gastan créditos: no se tocaron | cap. 04 `[inf]` |

### 2.2 Crear un agente

| Paso | Voz | Texto | Fuente |
|---|---|---|---|
| Entrada | «Nuevo agente» → «Crear con Dapti» o «Crear desde cero» | Igual | cap. 07, 13 |
| Plantillas | 4, **por función**: Personalizado, Lia (califica leads), Alex (llamadas en frío), Julia (recepcionista). Ninguna por industria | 4: Custom, Julia (recepción), Alf (ventas e-commerce), Diana (atención) | cap. 08, 13 |
| Idioma | Solo inglés o español latinoamericano | Multi-idioma | cap. 09, 11 |
| Datos | No se avanzó: el paso 2 («Prueba tu agente») gasta créditos | Contexto del agente → contexto de la empresa (nombre, URL con «Generar contexto», descripción) → prueba | cap. 11, 15 |
| Editor | - | Pestañas: Configuración, Probar, Análisis, Historial, Métrica, Canales. Prompt en Markdown con «Mejorar con IA». Secciones: Brains, Etiquetas, Acciones, Comportamiento (cierra a las 24 h, mensajes cortos, «escribiendo…»), Seguimientos, Webhooks | cap. 17 |
| Clics al borrador | - | **5 clics y el borrador ya queda guardado** («Continuar» guarda solo) | cap. 13-16 |
| Para que atienda de verdad | Hace falta un número de teléfono, y **comprar un número está detrás del muro de pago** («Activar Pro») | Hace falta conectar WhatsApp o el widget, y publicar | cap. 20, 22, 23 |

`[inf]` «Tu primer agente en 2 minutos» es verdad para el **borrador**. Un agente que atiende llamadas reales
exige plan pago.

### 2.3 Secciones del menú

| Sección | Qué tiene | Fuente |
|---|---|---|
| Agentes de voz | Agentes, Historial, Números (verificados, comprados, cumplimiento), Troncales SIP, Canales. En Canales solo «WhatsApp (legado)», con **conexiones nuevas en pausa** | cap. 06, 21, 50, 51 |
| Agentes de texto | Agentes, Inbox, Text Logs, Equipos, Plantillas de mensajes, Etiquetas, Canales (WhatsApp directo con Meta, WhatsApp legado, Dapta Widget) | cap. 10, 42 |
| Secuencias de voz | 4 pasos: objetivo y agente (con A/B de agentes) → configurar → fuente de datos → mapeo | cap. 39, 40 |
| Secuencias de texto | 4 pasos; **exige un canal de WhatsApp** | cap. 41 |
| CRM | Tabla de contactos con importar y exportar | cap. 30 |
| Dapta Forms («Nuevo») | Formularios gratis de varios pasos, con lógica, puntaje de leads y agenda | cap. 31 |
| Flow Studio | 26 plantillas (IA 11, CRMs 8, otras 7). **Ninguna de clínicas ni dental** | cap. 32, 33 |
| Data Studio | Brains (web, archivos, texto), Tablas, Archivos de plantilla | cap. 34-36 |
| AI Notetaker | Bot para Meet/Zoom/Teams. Primer calendario gratis, 100 h sin gastar créditos | cap. 43, 44 |
| Cuenta | Mi cuenta, **Acceso MCP** (Claude, Cursor, Codex; hasta 10 claves), Credenciales, Facturación, Referidos | cap. 29, 45 |
| Ayuda | Docs, Academia, chat en vivo (Intercom), base de UserGuiding | cap. 37, 49 |

### 2.4 Integraciones y canales

| Dónde se mide | Qué hay | Fuente |
|---|---|---|
| Web, julio | «over 300 tools» en la FAQ; el JSON-LD de la misma página ya decía «1000+ Integrations» | captura de julio `[V]` |
| Web, hoy | «1,000+ tools» | dapta.ai, /for-ai-agents/ `[D]` |
| App, Credenciales | **15**: Google Sheets, OpenAI, Gemini, Anthropic, Notion, WordPress, HubSpot, Gmail, OneDrive, Google Calendar, Excel, Outlook, SMTP, Meta Ads, GoHighLevel | cap. 46 `[V]` |
| App, canales de mensajería | **WhatsApp (Meta) y Dapta Widget.** No hay Instagram, Messenger, SMS ni correo como canal | cap. 20, 42 `[V]` |
| Academia, lecciones de integración | Google Calendar, Sheets, Cal.com, HubSpot, Kommo, GoHighLevel, Slack | cap. 37 |

⚠️ **Web contra app:**
- La web vende SMS como canal de texto; la app no lo muestra.
- La web vende «WhatsApp AI Calls»; la app dice que las conexiones nuevas de voz por WhatsApp están en pausa (cap. 50).
- (sin verificar) Un informe dice que la web renombró el notetaker a «Dapta SIG». No aparece en ninguna página
  guardada y el menú de la home del 1-oct (copia guardada y WebFetch) dice «AI Notetaker», igual que la app.

---

## 3. Precio y créditos

### 3.1 Planes (USD; igual en inglés y en español)

| Plan | Mes | Año | Créditos | Usuarios / espacios | Soporte | Dapti |
|---|---|---|---|---|---|---|
| Free | $0 | - | ⚠️ ver 3.4 | 1 / 1 | Autoservicio | Se cobra por respuesta |
| Pro | $99 (o $0 los primeros 7 días) | $990 | 100.000 (~300 min) | 5 / 5 | Email y chat, una sesión técnica | Se cobra por respuesta |
| Scale Up | $499 | $4.990 | 500.000 (~1.500 min) | Ilimitados / 25 | Onboarding asistido, 4 sesiones 1 a 1 por mes | Incluido |
| Prime | $1.499 | «Habla con ventas» | 1.500.000 (~4.500 min) | Ilimitados / 70 | Gerente de cuenta, ingeniero dedicado, grupo de WhatsApp o Slack | Incluido |
| Enterprise | A medida | - | Por consumo | A medida | SLA, on-premise, pago por transferencia | Incluido |

Fuentes: dapta.ai/pricing (1-oct) `[V]`; app, `/billing/plans` (cap. 23-25) `[V]`; docs, `plans-and-pricing`
(`dapta/web/d_plans-and-pricing.md`) `[V]`. El pago anual (16,7% menos) aparece en la app y en los docs,
**no en /pricing**.

### 3.2 Qué consume cada cosa

| Uso | Créditos | US$ | Fuente |
|---|---|---|---|
| Llamada atendida | 333 por minuto, redondeado hacia arriba | 0,333/min | docs `how-credits-work` `[V]` |
| Buzón de voz / no atiende | 75 / 45 | 0,075 / 0,045 | ídem |
| Llamada a tu número de prueba | 0 | 0 | ídem |
| Llamada web desde el navegador | 0 en planes pagos, 200/min en Free | 0,20/min en Free | ídem |
| Respuesta de IA por texto | ⚠️ docs: 40 con cualquier modelo. App: 40 (GPT 5.1, GPT-4o, Claude Sonnet 4.6), 20 (GPT-4o mini, GPT-5 nano, Gemini Flash Lite), 15 y 12 (modelos abiertos) | 0,012-0,04 | docs; cap. 18, 19 `[V]` |
| Mensaje escrito por una persona desde el Inbox | 10 | 0,01 | docs |
| Envío de WhatsApp | No sale de los créditos: **Meta lo cobra directo a la cuenta Meta del cliente** | lo cobra Meta | docs |
| Número de EE.UU. | ~1.380/mes | ~1,38 | docs |
| Números de otros países (los pide Soporte) | CO 28k, MX 13k, PE 270k, AR 16k, BR 9k, CL 14k… **Bolivia no figura** | 9-270/mes | docs |
| Respuesta de Dapti | Costo real del modelo × 2 (promedio 150) | ~0,15 | docs |
| Ejecución de un flujo | 1, más los nodos de IA a costo × 2 | 0,001 | docs |

**Sin sobrecargo:** con saldo en 0 se detienen las llamadas, los mensajes y Dapti. La recarga es de US$1 por
1.000 créditos, con opción de recarga automática `[V]` (docs de billing).

### 3.3 Fricción para empezar

| Paso | Qué pasa | Fuente |
|---|---|---|
| Registro | Home → «Get Started for Free» → nombre, apellido y email → código por email, o Google. Unos 3 pasos | docs `how-to-create-an-account` `[V]`; no se recorrió en vivo |
| Cuenta gratis | No pide tarjeta. Sirve para explorar y armar agentes. Llamadas reales: no, porque el número está detrás del muro de pago | docs; cap. 22-23 |
| Prueba | Solo de Pro, 7 días con 100k créditos. **Pide tarjeta y cobra sola al día 7** | docs `plans-and-pricing` `[V]`; la tarjeta no se vio en la app |
| Reembolso | **No hay garantía.** Cancelar no devuelve el período pagado; los créditos no se reembolsan. Excepciones caso por caso | docs `refunds` `[V]` |
| Moneda | Todo en USD, también en la web en español. Sin precio local | /pricing, /es/precios `[V]` |

### 3.4 Contradicciones de precio

| Tema | Fuente A | Fuente B | Estado |
|---|---|---|---|
| Créditos del plan Free | Home: 2.000 | App: 1.672 («1.7K»), período 23-sep → 23-oct (cap. 27, 28). Docs: la bolsa mensual exige plan pago | ⚠️ Sin resolver. La app sugiere un ciclo mensual `[inf]` |
| Tarjeta Free | Home la muestra | /pricing ya no la tiene (desde por lo menos el 12-ago, Wayback) | ⚠️ |
| Prime | Calculadora de /pricing: ~3.000 min o 20.000 mensajes | Docs y app: ~4.500 min; 1,5M ÷ 40 = 37.500 mensajes | La calculadora es la que no cuadra |
| Dos listas de precios | /pricing: 99 / 499 / 1.499 | /es/inicio-v2/ sigue viva con Lite $19, Business $249 y Free con 10K | ⚠️ Página vieja sin bajar |
| Afiliados y partners | /partners (EN): 30% durante 12 meses, certificación obligatoria | /es/partners: 15% recurrente o 30% por 12 meses «en campañas»; cita un plan Business $249 que ya no existe | ⚠️ |

---

## 4. La empresa

### 4.1 Ficha

| Dato | Valor | Fuente (fecha) | Estado |
|---|---|---|---|
| Origen | Nació como constructor no-code de APIs; pasó a agentes de IA de ventas en 2023 | techla.pro (25-mar-2023); refreshmiami.com (6-dic-2023) | `[V]` prensa |
| Fundación | ⚠️ /for-ai-agents dice «Founded in 2024 in Bogotá»; la prensa la ubica en ene/feb-2023 | dapta.ai/for-ai-agents (29-sep-2026); prensa 2023 | Contradicción |
| CEO | Nicolás Rojas Niño (antes fundó Imagine Apps; Forbes 30 Promesas 2024) | colombiaone.com (14-feb-2026); emergeamericas.com | `[V]` |
| Cofundador | Daniel Ordóñez | enter.co (11-abr-2024) | `[V]`. Otros nombres que aparecen en buscadores: sin verificar |
| Sede | Miami (prensa 2023-24) → hoy Scottsdale/Phoenix, Arizona. El equipo trabaja en Bogotá | LinkedIn; careers.dapta.ai (1-oct) | `[V]` |
| Equipo | ~50 personas (LinkedIn: rango 11-50, 59 listados; Caplight: 51) | linkedin.com/company/dapta-ai; caplight.com | `[T]` aproximado |
| Vacantes | 8, todas en Bogotá (una también en Buenos Aires remoto y otra en Phoenix) | careers.dapta.ai/jobs (1-oct) | `[V]` |
| Head of Growth | Alejandro Sarmiento, fundador de Beezion | startupslatam.com (29-jul-2026) | `[V]` |

### 4.2 Inversión

| Ronda | Monto | Fuente | Estado |
|---|---|---|---|
| Startco (antes del giro) | US$750k | techla.pro (mar-2023) | `[V]` prensa |
| Pre-seed (dic-2023 / abr-2024) | US$1-1,2M (algunas fuentes: 1,4M). Lideran Fen Ventures y LatinLeap; participan 500 Global, Seedstars y otros | enter.co; refreshmiami | `[V]` |
| «Serie A» | US$4M (5-may-2025) | tracxn.com | **No verificado**, sin prensa |
| Total | US$5,4M / US$8,2M | growthtalent.org (abr-2026) / caplight.com (jun-2026) | **No verificado** |
| Shark Tank Colombia 2024 | Pidió US$101.000 por el 2% | andresospina.co | No se sabe si cerró |
| Y Combinator | Ninguna evidencia | búsquedas | No verificado |

### 4.3 Tracción: todo lo dice Dapta, nada auditado

| Fecha | Cifra | Fuente |
|---|---|---|
| dic-2023 | 500 empresas | refreshmiami.com |
| abr-2024 | 1.500+ empresas en 37 países | enter.co |
| jun-2025 | 30.000+ cuentas activas en 32 países | portafolio.co |
| jul-2026 | 187.000 usuarios, 70.000+ activos al mes, 24 países, 1.000+ demos al mes | startupslatam.com (29-jul); blog de Dapta (18-ago) |
| sep-2026 | «Más de 150.000 empresas» | 30xventas.substack.com (15-sep) |
| Home hoy | «50.000+ empresas» (igual que en julio), 4.7, SOC 2, 98% de satisfacción, respuesta en menos de 3 min | dapta.ai (1-oct) |
| /for-ai-agents | «100,000+ users» | dapta.ai/for-ai-agents (29-sep) |
| Ingresos / ARR | **No publicados** | - |

- La nota 4.7 de la home no tiene fuente; Trustpilot muestra **4,8 con 144 reseñas** (WebFetch, 1-oct) `[T]`.
- `[inf]` Los países bajan de 37 a 24 mientras los «usuarios» suben a 187k: cuentan registros, no clientes que
  pagan. La lectura de julio («cifra de vidriera») se mantiene.

---

## 5. Cómo consigue clientes

### 5.1 Anuncios en Meta (Biblioteca de Anuncios, 1-oct)

| Dato | Valor |
|---|---|
| Anuncios activos de la página «Dapta» (id 181083051744223) | **38**. Por país: Colombia 29, México 19, EE.UU. 9, **Bolivia 0** (un anuncio puede ir a varios países) |
| Antigüedad | 37 de 38 se crearon el 30-sep y el 1-oct-2026; uno el 17-sep |
| Mensajes (título del enlace) | «Descubre cómo Dapta te ayuda a crecer» (16) · «La IA que califica y agenda leads por ti» (13) · «Webinar gratuito para equipos de ventas» (6) · «Webinar Completamente Gratis» (3) |
| ¿Hubo anuncios en julio? | **No verificable**: fuera de la UE la biblioteca no guarda los anuncios comerciales inactivos |
| Tercero que pauta | La página «Andres Bilbao» («Rappi & 30x Co-Founder», según 30x.com) tiene 178 anuncios activos. Los que salen al buscar «Dapta» llevan al curso **AI Sales 2.0 de 30X**: USD 1.950, 5 semanas, empieza el 5-oct, lo dictan el CEO de Dapta y Bilbao, e incluye «+100K créditos gratis de Dapta» ([30x.com/programas/ai-sales](https://30x.com/programas/ai-sales), re-leída el 1-oct) |

No se pudo ver el texto, el formato ni el destino de cada anuncio: la API no trae el texto y la ficha da 403.
Por eso **no se sabe** si los anuncios llevan a la demo con 2.000 créditos (§5.3) ni si alguno vende el plan.

### 5.2 Contenido orgánico (1-oct)

| Canal | Tamaño | Qué rinde |
|---|---|---|
| TikTok del CEO (@nicolasimagine) | **140,9K seguidores**, 1,4M likes, 652 videos | El canal más grande |
| TikTok de la empresa | 17,5K seguidores, 507 videos | - |
| YouTube de la empresa | 7,28K suscriptores, 1,2K videos | **Vlogs del CEO: 12K-18K vistas. Tutoriales: 400-930.** Shorts: casi todos debajo de 100 |
| Frecuencia en YouTube | ~20 videos largos entre jul y ago; 4 en las últimas 4 semanas | Bajó (YouTube solo da fechas relativas) |
| LinkedIn de la empresa | 17.062 seguidores | Posts en español: IA contra trabajo manual, noticias, humor |
| Newsletter del CEO | «Esta semana en IA», semanal | Solo noticias, no vende Dapta |
| Instagram | No verificado (pide login) | - |

Fuentes: youtube.com/@dapta-ai, tiktok.com/@nicolasimagine, tiktok.com/@dapta.ai, linkedin.com/company/dapta-ai,
nicolasimagine.substack.com. Según 30xventas (15-sep) `[T]`, la estrategia es de más de 20 videos diarios en más
de 20 cuentas.

### 5.3 Embudo

| Pieza | Estado al 1-oct | Contra julio | Fuente |
|---|---|---|---|
| Registro gratis | «Get Started for Free» → app.dapta.ai/register | Igual | dapta.ai |
| Demo con humano | Abre un Dapta Forms: **«Obtén 2.000 créditos gratis al agendar»**, con **una sola pregunta de dolor** (leads que nadie llama, leads de WhatsApp que se enfrían, soporte lento) | No medido en julio | forms.dapta.ai/jwmq4e/alec/dapta-ventas-4-3 |
| Webinar diario «Dapta 101» | Reserva por cal.com | Ya estaba | banner de dapta.ai/es |
| Webinar del CEO | «Aprende cómo usar IA para vender hasta un 70% más», por Zoom: **896 asistentes**. Ya pasó («Past Event»; Luma no muestra la fecha) | No comparable: sin fecha no se sabe si es posterior a julio | luma.com/6c2cbtpz (re-leída el 1-oct) |
| Banner vencido | ⚠️ Un informe lo ve oculto (webinar del 26-ago); otro lo ve visible en inglés anunciando una fecha ya pasada | - | HTML de home y /pricing |
| Referidos | $50 por cada persona que compra un plan; el referido recibe 100K créditos | - | cap. 47, 25 |
| Agencias que revenden | Ej.: Simbionte (Colombia) cobra la implementación aparte: US$500, 1.000 o 1.500 | - | simbionte.co/dapta-ai |
| Agendar demo | Pasó de una página de WordPress a su propio Forms (el botón Custom de /pricing todavía apunta a la vieja) | Cambió | links de la home |
| Página para asistentes de IA | /for-ai-agents/: ficha oficial para que ChatGPT y compañía lean a Dapta | Nueva | dapta.ai/for-ai-agents |

### 5.4 Academia y comunidad

| Pieza | Estado | Fuente |
|---|---|---|
| Academia **dentro de la app** | Funciona: lecciones en inglés y español (primeros pasos 5, voz 15, texto 8, casos de uso 6, integraciones 16). Uno de los casos es «Cómo las clínicas médicas usan IA para agendar citas 24/7» | cap. 37, 38 |
| Escuela pública en Teachable (enlazada desde el sitio) | **«Esta escuela no tiene productos disponibles»** | dapta-academy-s-school.teachable.com |
| Comunidad Skool «AI Sales & Beer» | La home la enlaza; **da 404** | skool.com/ai-sales-beer |
| Comunidad para clientes | Solo en Prime (grupo de WhatsApp o Slack) | cap. 25 |

### 5.5 Qué cambió desde julio, todo junto

| Tema | Julio | Hoy | Estado |
|---|---|---|---|
| Precios Pro / Scale / Prime | $99 / $499 / $1.499 | Igual | Sin cambio `[V]` |
| Agentes y flujos ilimitados | Sí | Sí | Sin cambio |
| Titular | «Close Deals Faster With AI…» / «all-in-one … platform built for SMBs» | «Create your first AI sales agent in 2 minutes» | **Cambió** `[V]` |
| Integraciones | «over 300 tools» en la FAQ (el JSON-LD ya decía «1000+») | «1,000+ tools» (en la app, 15) | Cambió la cifra visible |
| Dapti y «Dapta MCP» | Ya en el menú de la captura | Siguen | Sin cambio en la web (la app no se vio en julio) |
| «50,000+ companies», «<3 min», «98%» | Sí | Igual | Sin cambio |
| SOC 2 | No estaba | En el hero y en /customers | **Nuevo** |
| Menú | Campaigns | Sequences + Dapta Forms | Renombrado + nuevo |
| Industrias | Educación, SaaS, abogados, hogar, inmobiliaria | + Seguros | Nuevo |
| Etiqueta del Free | «Premium support» (error) | «Self service» | Corregido |
| Tabla de consumo pública | No se miraron los docs | Docs con tarifas por uso | No comparable |
| WhatsApp | No se miró la app | Conexión directa con Meta; lo viejo es «legado» y la voz por WhatsApp está en pausa | No comparable `[inf]`: el «legado» sugiere cambio de proveedor |
| Notetaker | «AI Notetaker» | «AI Notetaker» en la home (1-oct). «Dapta SIG»: (sin verificar) | Sin cambio visible |
| Casos publicados | 17 (Wayback, 15-ago; sin copia guardada) | 19 | +2 (sin verificar) |
| Beezion (agencia de pauta) | No era de Dapta según lo público; la compra ya estaba cerrada (fines de mayo) pero sin anunciar | Anunciada el 29-jul (startupslatam.com) | **Nuevo para nosotros** |
| Academia y comunidad | Enlaces presentes | Teachable vacío, Skool 404 | Rotos hoy (no se sabe si ya fallaban en julio) |

---

## 6. Qué le sirve a Onia HOY

**Marco:** Etapa 1, vender Onia Platform a clínicas dentales de 2-6 profesionales en Santa Cruz, sin abrir
líneas nuevas. El sistema es la oferta y el chatbot es un add-on. Cero autobombo. Son ideas para evaluar: decide
Sergio Urcullo. Están ordenadas por impacto sobre esfuerzo, salvo 6.5, que espera al primer cliente pagando.

### 6.1 El anuncio vende un paso gratis, con UNA pregunta de dolor

- **Qué hace Dapta:** 9 de los 38 títulos de anuncio venden un webinar gratis; el destino del resto no se vio
  (§5.1). En la web, la demo regala 2.000 créditos al agendar y abre con una sola pregunta de tres opciones
  (§5.3). `[inf]` que esa demo sea el destino de la pauta.
- **Cómo se vería en Onia:** el paso gratis ya existe y la web ya lo dice: «14 días de prueba con el plan
  Profesional, sin tarjeta» (home, /empezar, /agentes y /nosotros del espejo del sitio, grep del 1-oct). Falta
  llevarlo a donde llega el lead de pauta, que es WhatsApp (`ONIA_ADQUISICION_Y_PAUTA.md` §5.1-5.5): el bot
  abre con una sola pregunta de dolor con tres botones (pacientes que faltan a la cita / pacientes que no
  volvieron / cobros pendientes) y cierra con «14 días gratis, sin tarjeta». La respuesta elige qué mostrar en
  la demo. **No reemplaza a las 5 preguntas de calificación** (§5.5): la «conversación calificada» se sigue
  midiendo con las 5 (§5.6). «No volvieron» se respalda con el Recall de producción (sin visita ≥180 días) y,
  desde el 2-oct, también con el tratamiento a medias: la 1.0 está en producción (`release-8f07e537`, §5.4 de
  ese doc). Y la pregunta de dolor va **después** del filtro dueño / empleado / paciente de §5.2, no en su lugar.
- **Contraste que juega a favor:** la prueba de Dapta pide tarjeta, cobra sola al día 7 y no reembolsa (docs
  `plans-and-pricing` y `refunds`); Lety también cobra la tarjeta antes (checkout de Stripe visto por Sergio
  Urcullo el 31-ago, memoria `lety-cobra-tarjeta-antes-del-trial`). La de Onia no pide tarjeta (sitio, grep
  del 1-oct) y se paga por QR al final, así que no hay cobro automático (sin verificar en producción: la copia
  local de `onia-platform` del 12-sep tiene `app/api/subscription-payment/bcp-qr`). Se dice lo de Onia, sin
  nombrar a nadie.
- **Qué NO copiar:** regalar créditos (Onia no vende créditos, decisión de julio). Tampoco el webinar: Dapta
  junta 896 asistentes con una audiencia grande (140K en el TikTok del CEO) `[inf]`, y a Onia le costaría
  horas de Sergio Urcullo sin audiencia.
- **Esfuerzo:** bajo (guion del bot y la pieza; carril Ventas y pauta). **Impacto:** alto cuando se encienda
  la pauta.

### 6.2 Un titular de resultado, no de categoría

- **Qué hace Dapta:** pasó de «plataforma todo-en-uno para PyMEs» a «tu primer agente de ventas en 2
  minutos». Promete un resultado y un tiempo, no una categoría.
- **Dónde está Onia:** la home titula «Todo el negocio, en una pantalla» (espejo del sitio, 1-oct). Es el tipo
  de titular que Dapta dejó.
- **Cómo se vería en Onia:** en las piezas para dental, el resultado que producción ya entrega: «el paciente de
  mañana que no confirmó, con el mensaje ya escrito» (verificado por el carril Plataforma,
  `ONIA_ADQUISICION_Y_PAUTA.md` §5.4). En la home, que es para todos los rubros, probar un titular de
  resultado que valga para los siete. Cualquier plazo («en X minutos») se **cronometra** antes de escribirlo.
- **Qué NO copiar:** el plazo inventado. El «2 minutos» de Dapta es un borrador, no un agente atendiendo
  (§2.2). Tampoco el encuadre de «crear un agente»: Onia vende el sistema.
- **Esfuerzo:** bajo (copy y una medición). Una superficie viva no se cambia sin que Sergio Urcullo vea la
  pieza terminada. **Impacto:** medio-alto.

### 6.3 «Qué pagás y a quién», en tres líneas, junto al precio

- **Qué hace Dapta:** publica qué consume cada cosa, dice que Meta cobra el WhatsApp directo a la cuenta del
  cliente y que no hay cobro por exceso (§3.2).
- **Cómo se vería en Onia:** al lado del precio, tres líneas: el plan fijo en Bs (lee de
  `onia-platform/lib/subscription-plans.ts`), el chatbot como add-on (lee de `lib/pricing.ts`) y lo que cobra
  un tercero a nombre de la clínica, al costo. Responde la objeción «¿y después me cobran más?».
- **Antes de escribirlo:** verificar cómo se factura hoy el WhatsApp de cada clínica (si la conversación de
  Meta la paga la cuenta de la clínica). **No verificado.**
- **Qué NO copiar:** el crédito como unidad de venta. Su propia tabla lo muestra: el crédito cuesta lo mismo en
  todos los planes, así que la escalera vende personas (más usuarios y Dapti incluido), y Onia no tiene esas
  personas. Tampoco el «se para en
  0»: a una clínica no se le corta la confirmación de citas a mitad de mes.
- **Esfuerzo:** bajo-medio. **Impacto:** medio.

### 6.4 En la prueba, mostrar lo que Onia ya hizo, no lo que falta pagar

- **Qué hace Dapta:** muestra en todas las pantallas la caja «¡Conviértete en un Pro!» con la barra de
  créditos, y pone el muro de pago justo en el paso que da valor: el número de teléfono (cap. 01, 22, 23).
- **Cómo se vería en Onia:** durante los 14 días, una línea fija en el panel con el valor de la semana (por
  ejemplo, «12 citas confirmadas · 4 pacientes para llamar»; las cifras son ilustrativas y la línea solo puede
  contar lo que producción ya hace, §5.4 de `ONIA_ADQUISICION_Y_PAUTA.md`) y los días que quedan. Pasar de prueba a pago es
  la conversión que decide la Etapa 1. **Primero verificar si el panel ya tiene algo así** (no verificado).
- **Qué NO copiar:** el muro de pago dentro de la prueba (Onia promete el plan completo 14 días) ni la barra
  de consumo.
- **Esfuerzo:** medio (carril Plataforma). **Impacto:** alto.

### 6.5 Referido entre clínicas, recién con el primer cliente pagando

- **Qué hace Dapta:** paga $50 por cada referido que compra y le regala 100K créditos al referido. El banner
  está en cada pantalla de facturación (cap. 25, 47).
- **Cómo se vería en Onia:** «Traé otra clínica: un mes gratis para las dos», pagado en meses de plan, no en
  efectivo. Santa Cruz es chica y se mueve por boca a boca. Es un descuento: lo decide Sergio Urcullo.
- **Qué NO copiar:** el programa de afiliados y partners (30%, certificación, obligación de publicar). No hay
  equipo de ventas y la regla prohíbe material para vendedores.
- **Esfuerzo:** bajo. **Impacto:** medio, desde el cliente 1.

### 6.6 La cara del fundador rinde más que el tutorial

- **Qué hace Dapta:** los vlogs del CEO sacan 12K-18K vistas y los tutoriales 400-930. El TikTok del CEO
  tiene 8 veces los seguidores del de la empresa (§5.2). `[inf]` que la diferencia sea por la cara y no por el
  tema.
- **Cómo se vería en Onia:** **no suma horas ni es para la Etapa 1.** Solo un criterio para el contenido que el
  carril Marca personal ya hace: preferir el detrás de escena con la cara de Sergio Urcullo al tutorial de
  producto. Los tutoriales quedan para clientes, para bajar horas de soporte. El contenido es el último canal
  en `ONIA_ADQUISICION_Y_PAUTA.md` §4 y hoy no llega al dueño de clínica.
- **Qué NO copiar:** 20 videos por día en 20 cuentas (`[T]` 30xventas; pide un equipo, y el techo de Onia son
  las horas de Sergio Urcullo). Tampoco presentarse por la plata levantada o el tamaño de la empresa: es
  autobombo. (sin verificar) Un informe cita un «CEO de startup de $30M»; no hay captura ni fuente de esa
  frase.
- **Esfuerzo:** bajo si se queda en criterio; alto si se suman horas. **Impacto en la Etapa 1:** bajo.

### 6.7 Lo que NO se copia (y la razón)

| De Dapta | Por qué no |
|---|---|
| Plataforma horizontal con créditos como unidad de venta | Decisión de julio, reforzada: el crédito vale lo mismo en todos los planes, así que la escalera vende personas, usuarios y Dapti incluido. Onia vende un sistema por rubro con plan fijo |
| «50.000+ empresas», «4.7» sin fuente, sellos | Cero clientes pagando: prohibido fabricar. Cero autobombo |
| «Respuesta en menos de 3 min», «98% de satisfacción» | Es una promesa de equipo; Onia es una persona |
| Enlazar una academia vacía, una comunidad caída o un webinar vencido | Viola «la venta nunca exhibe obra». Lección práctica: revisar que cada enlace de la web de Onia lleve a algo vivo |
| Dos listas de precios vivas a la vez | Es justo el error que la regla de una sola fuente de verdad evita |
| Prueba con tarjeta y sin reembolso | Es la ventaja de Onia; no se pierde |
| Comprar una agencia de pauta o sumar un curso pago con un tercero | Pide capital y gente; no es Etapa 1 |

---

## 7. Fuentes y lo que no se pudo verificar

### 7.1 Fuentes principales (todas leídas el 1-oct-2026 salvo indicación)

| Fuente | Qué respalda | Copia en el repo |
|---|---|---|
| app.dapta.ai (cuenta Free, espacio «OnIA») | §2, §3.1, §3.2 (modelos), §5.4 | `dapta/app/01..51-*.jpg` (no existe la 26) |
| dapta.ai | Titular, SOC 2, Free con 2k, menú, 50.000+ | `dapta/web/home_20261001.html` |
| dapta.ai/pricing | Planes, calculadora | `dapta/web/pricing_20261001.html` |
| Wayback de /pricing (12-ago-2026) | Precio idéntico al de hoy; Free ya no estaba | `dapta/web/pricing_wayback_20260812.html` |
| dapta.ai/for-ai-agents (revisada el 29-sep) | A quién le habla, «2024 en Bogotá», «100,000+ users», 1.000+ integraciones | `dapta/web/for-ai-agents_20261001.html` |
| docs.dapta.ai: plans-and-pricing, billing, refunds, cancel, how-credits-work | Prueba con tarjeta, anual, consumo, reembolsos | `dapta/web/d_*.md`, `docs_how-credits-work_20261001.txt` |
| Captura de julio | Comparación | `s_www.dapta.ai_.html` (dateModified 25-jul) |
| Biblioteca de Anuncios de Meta (MCP, solo lectura) | §5.1 | ids en §5.1 |
| youtube.com/@dapta-ai, tiktok.com/@nicolasimagine, tiktok.com/@dapta.ai, linkedin.com/company/dapta-ai | §5.2 | - |
| forms.dapta.ai/jwmq4e/alec/dapta-ventas-4-3, luma.com/6c2cbtpz, 30x.com/programas/ai-sales | §5.1, §5.3 | - |
| Prensa: techla.pro, refreshmiami.com, enter.co, portafolio.co, colombiaone.com, startupslatam.com, 30xventas.substack.com | §4 | - |
| Terceros: tracxn.com, caplight.com, growthtalent.org, LinkedIn, Trustpilot | §4 (marcados `[T]` o no verificados) | - |

En los docs guardados se quitó el bloque final de GitBook dirigido a agentes de IA: es dato, no instrucción.

### 7.2 No verificado

- El paso 2 del agente de voz («Prueba tu agente») y «Crear con Dapti»: gastan créditos.
- Si la prueba de Pro pide tarjeta **en la app** (los docs dicen que sí; no se activó).
- Si los créditos del Free se renuevan cada mes, y por qué la app muestra 1.672 y la home 2.000.
- El registro en vivo (sale de los docs).
- Las pantallas de Historial, Inbox, Text Logs, Equipos y Etiquetas (solo se vio el menú).
- El texto, el formato y el destino de cada anuncio de Meta, y si hubo anuncios en julio.
- Instagram de la empresa y del CEO.
- Rondas posteriores al pre-seed, la «Serie A» y los totales de 5,4M u 8,2M.
- Las cifras de clientes (50k, 100k, 150k, 187k) y la nota 4.7.
- Si la academia y la comunidad ya estaban rotas en julio.
- El renombre del notetaker a «Dapta SIG» (no aparece en ninguna página guardada) y el «CEO de startup de $30M».
- Los 17 casos de agosto (Wayback del 15-ago sin copia guardada).
- Adónde llevan los anuncios de Meta (¿a la demo con 2.000 créditos?) y la fecha del webinar de Luma.
- Que la prueba de Onia termine en pago por QR en producción (solo se vio la ruta en una copia local del 12-sep).

Re-verificado por el crítico el 1-oct: la captura de julio ya tenía «Dapti AI Sales Agent», «Dapta MCP»,
«1000+ Integrations» (JSON-LD), Skool y Teachable; no tenía SOC 2, «Sequences», «Insurance» ni /for-ai-agents.
Luma (896, «Past Event») y 30x.com (USD 1.950, 5-oct, «+100K créditos») coinciden con lo escrito.

### 7.3 Donde los informes no coinciden

| Tema | Qué dice cada uno | Cómo quedó |
|---|---|---|
| Dapti | Un informe no lo verificó; otros dos lo vieron en la app y en /dapti-ai-agent | **Existe** `[V]` |
| Precio anual | Uno: «no hay precio anual a la vista». Otro: solo en los docs. El de adentro: en la app | Está en la app y en los docs; no en /pricing |
| Costo por mensaje | Docs: 40 con cualquier modelo. App: 12 a 40 según el modelo | ⚠️ Las dos fuentes son primarias; la app manda para lo que se cobra hoy `[inf]` |
| Academia | «Rota» contra «funciona» | Las dos cosas: funciona dentro de la app, la escuela pública está vacía |
| Partners | 30% / 12 meses (EN) contra 15% recurrente (ES) | ⚠️ Las dos páginas están vivas y no coinciden |
| Banner del webinar del 26-ago | Oculto contra visible | ⚠️ Sin resolver; menor |

### 7.4 Pendiente de Sergio Urcullo

- **Borrador de agente de texto «Julia» en la cuenta de Dapta** (espacio «OnIA», id
  `1142c277-4d36-481e-aa82-7a4f34376b0a`). Se guardó solo al apretar «Continuar» en el asistente. No está
  publicado, no tiene canal y no gastó créditos. No se borró porque borrar es irreversible: decidí si se borra.
- En la recorrida también se saltó el tour de AI Notetaker. No se envió nada a Dapti, no se conectó nada y no
  se aceptaron términos.
