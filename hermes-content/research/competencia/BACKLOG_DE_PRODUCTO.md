# Backlog de producto de Onia según la competencia

> Pedido de Sergio Urcullo (8-oct): «equipo para analizar competencias; tenés browser, hacelo por todas». 14 competidores, analizados por 7 agentes desde las fuentes públicas de hoy, y priorizados por un octavo. Un tema = un archivo sin fecha: se actualiza este.

Marcas: **[NV]** = no verificado hoy, sale de una ficha vieja o de terceros. **[ok Sergio Urcullo]** = antes de publicar necesita su decisión: diseño nuevo, texto legal, Meta o plata.

**Paso 0, que no es copiar sino arreglar:** el detector de tratamiento a medias hoy no encuentra a nadie. Solo cuenta los tratamientos «En progreso», pero la ficha los carga como «Pendiente». Es el argumento central contra Dentalink, AgendaPro y Doctocliq, así que va antes que todo lo de abajo. Va por Plataforma y entra antes del 30-oct.

## 1. Las 10 funciones a copiar (impacto en vender y retener, dividido por esfuerzo)

| # | Qué es | Quién la tiene | Cómo la haría Onia | Esfuerzo | Dueño | ¿Antes del 30-oct? |
|---|---|---|---|---|---|---|
| 1 | Lista de citas canceladas y faltas por recuperar | Dentalink (tarea «Cita»), Fluker | Las citas canceladas o con falta entran a una lista. El reprogramador que ya existe propone el mensaje en «Pendientes» y el dueño lo aprueba | S | Codex | Sí |
| 2 | Presupuesto con estados (aceptado, abandonado, terminado) y por fases | Doctocliq, Dentalink | Estado en el presupuesto. «Abandonado» y «aceptado sin terminar» alimentan el recall. PDF sin montos opcional | M | Codex para la lógica y el PDF. Plataforma para la pantalla y la migración si hace falta | Sí, si no requiere migración pesada |
| 3 | Plantilla precargada por rubro al registrarse (servicios, horarios, mensajes de ejemplo) | Lety | Al crear la organización con rubro dental, sembrar el catálogo base de forma idempotente. Baja el soporte por cliente | S | Codex | Sí |
| 4 | Recordatorio por WhatsApp con «Confirmar» y «No podré asistir» de un toque | Doctocliq, AgendaPro, Huli, Fluker, Dentalink | Plantilla utility por Cloud API. La respuesta del paciente cambia el estado de la cita. Escalera como AgendaPro: correo primero, WhatsApp solo a quien no confirmó | M a L | Codex para el intérprete de respuestas. Plataforma para el envío y Meta | El intérprete sí. El envío real depende del chip prepago y del número |
| 5 | Comisión por doctor dentro de caja | Dentalink (Pro) | Reporte de fin de mes por profesional sobre los cobros. El cliente ideal tiene de 2 a 6 profesionales | S a M | Codex | Sí, si sobra tiempo |
| 6 | Seguimiento de la consulta abandonada («preguntó el precio y no reservó») | Fluker (30 min, 2 h, 24 h), SendyPro (cadencia) | Un agente nuevo con el patrón actual: propone el mensaje y el dueño aprueba. Cadencia visible y editable | M | Codex | No: necesita WhatsApp entrante vivo |
| 7 | Conectar el WhatsApp del cliente solo, con coexistencia y requisitos antes del botón | Wati, Kommo, Dapta | Embedded Signup, casilla «leí y cumplo» y el mensaje «sigues usando tu WhatsApp en el celular». Es lo que hoy bloquea vender el add-on | M | Plataforma [ok Sergio Urcullo: Meta] | No, es el primero después |
| 8 | Campaña a un segmento («sin visita hace 6 meses») con plantilla aprobada y costo de Meta a la vista antes de enviar | SendyPro, Wati, Kommo, Leadsales, AgendaPro, Respond.io | Segmento fijo, plantilla aprobada, costo estimado y baja. Va después de la 4 y la 7 | M a L | Codex para el segmento y el costo. Plataforma para el envío | No |
| 9 | Bandeja de recepción: pausa del bot cuando entra un humano, asignación de chats y respuestas rápidas | Manychat, Wati, Respond.io | Pausa de 30 min al tomar el chat, asignar a recepción o al doctor, textos guardados | S | Codex | No (va con el add-on) |
| 10 | Origen del lead y citas por anuncio (clic a WhatsApp, CAPI) | Kommo, Respond.io, SendyPro, Fluker | Campo de origen en la conversación y en la cita, y un reporte «de qué anuncio salió cada cita». Sostiene el add-on de campañas de Meta | S a M | Codex para el reporte. Plataforma para el tracking | No |

**Lo siguiente, fuera del top 10:**
- Seña con QR del BCP al reservar (AgendaPro). Depende de la API QR del BCP, que sigue en trámite.
- Consentimiento informado digital (Fluker, Dentalink, AgendaPro Premium). [ok Sergio Urcullo: legal]
- Arreglar la transcripción de notas de voz (SendyPro). Hoy está caída y el catálogo promete «fotos y audios».
- Agenda por sillón con arrastrar y soltar.
- Editor del guion conversando, con el validador actual detrás (SendyPro).
- PWA con push probada en 2 teléfonos antes de pensar en una app nativa.

## 2. Tres tareas para Codex ya (código cerrado, sin producción y sin migraciones)

**A. Intérprete de respuestas de confirmación (#4)**
- **META:** en onia-platform, rama `codex/confirmacion-respuesta`, una función pura que recibe el texto o el id de botón de la respuesta del paciente y la cita, y devuelve `confirmar | cancelar | reprogramar | desconocido`. Más la transición de estado de la cita que ya existe en el modelo. No envía nada a Meta.
- **PRUEBA DE HECHO:** tests con al menos 20 respuestas reales de clínica («1», «sí», «confirmo», «no puedo», «otro día», un emoji, vacío) en verde, más `tsc --noEmit` y la suite completa en verde.
- **REGLA DE PARADA:** si el estado «confirmada» no existe en el schema, parar y reportarlo. No crear la migración.

**B. Citas canceladas y faltas por recuperar (#1)**
- **META:** rama `codex/recuperar-canceladas`. Selector de las citas canceladas o con falta de los últimos N días, sin cita futura del mismo paciente. Conectarlo al agente reprogramador que ya existe para que proponga el mensaje en «Pendientes», con la aprobación del dueño de siempre.
- **PRUEBA DE HECHO:** test con datos semilla. Una cancelada sin cita futura aparece en la lista. Una cancelada con cita futura no aparece. Una propuesta queda en «Pendientes» sin enviarse. `tsc` y la suite en verde.
- **REGLA DE PARADA:** si no encuentra el reprogramador o necesita una tabla nueva, parar y reportar. Nada de envío real ni de pantallas nuevas.

**C. Plantilla precargada del rubro dental (#3)**
- **META:** rama `codex/semilla-dental`. Al crear una organización dental se siembran los servicios típicos, el horario de ejemplo y los mensajes base, con una función idempotente que se dispara en el alta existente.
- **PRUEBA DE HECHO:** un test crea la organización dos veces y no hay duplicados. Una organización de otro rubro no recibe la semilla dental. `tsc` y la suite en verde.
- **REGLA DE PARADA:** no inventar precios: los servicios van sin monto o con 0. Si hace falta tocar el esquema, parar.

## 3. Precios: la competencia contra Onia

**Onia** (`subscription-plans.ts` y `pricing.ts` en `origin/master`, convertidos a 11,37 Bs por USD):

| Plan o add-on | Precio | En USD | Usuarios |
|---|---|---|---|
| Básico | Bs 320/mes | ≈28 | 2 |
| Crece | Bs 550 | ≈48 | 4 |
| Profesional | Bs 890 | ≈78 | 5 |
| clinic (Full) | Bs 1.290, con el agente de WhatsApp incluido | ≈113 | ilimitados |
| Grupo | Bs 2.900 | ≈255 | ilimitados |
| Agente de WhatsApp | Bs 390/mes, sin instalación | ≈34 | - |
| Agenda pública en Básico | Bs 150 | ≈13 | - |
| Usuario extra | Bs 70 | ≈6 | - |

- El plan anual son 10 meses.
- Meta le cobra los mensajes directo al cliente.
- La agenda pública viene incluida desde Crece.

**Competencia:**

| Competidor | Precio de entrada / medio / alto | Unidad de cobro | Ejemplo con 3 doctores o 4 usuarios |
|---|---|---|---|
| Doctocliq | USD 19 / 29 / 49 | por doctor | Avanzado ×3 = USD 147 (Onia Crece ≈48) |
| Dentalink | Cotización | - | - |
| AgendaPro | CLP 15.900 a 249.900 + IVA [NV, del 1-oct] | por profesional, WhatsApp aparte | - |
| HuliPractice | MXN 590 / 991 + IVA, bot de WhatsApp MXN 240 por 30 conversaciones | por médico | - |
| Kommo | USD 20 / 30 / 45 | por usuario, mínimo 6 meses | Pro ×4 = USD 180 |
| Leadsales | USD 97 / 133 / 247. Agente aparte, 87 a 793 [NV: moneda] | plan | - |
| Wati | USD 45-59 / 95-119 / 239-299 [NV hoy] | plan + contactos | - |
| Manychat | USD 14 / 29 / 69 / 139 al año [NV] | contactos | - |
| Respond.io | USD 79-99 / 159-199 / 279-349 | plan + contactos activos + créditos de IA | - |
| Dapta | USD 99 / 499 / 1.499 | créditos | - |
| SendyPro | USD 19 / 39, la IA con la API key del cliente | plan | - |
| Lety | USD 97 / 297 / 497 | agencias, no clínicas | - |
| Fluker | Cotización | - | - |
| Lucy (Datec) | 500 / 990 + 1,2-1,3 % por venta [NV: moneda] | plan + % de venta | - |

En todos, salvo Onia, Meta se paga aparte o por saldo. En Onia también lo paga el cliente, pero en su propia cuenta y sin recargo.

## 4. Argumentos de venta donde ganamos (honestos hoy)

1. **El sistema entero en un plan:** ficha, odontograma, presupuesto, caja, inventario, contabilidad y planilla. De los 14, solo Dentalink, Doctocliq, AgendaPro y Huli gestionan la clínica. Los otros 10 son solo chat o CRM.
2. **Bolivianos, QR del BCP, 14 días sin tarjeta, alta sola y precio público.** Dapta, Lety y Huli piden tarjeta. Dentalink, Fluker y Lucy van por cotización o demo. AgendaPro y Doctocliq dan 7 días.
3. **Precio por plan, no por doctor, usuario, contacto ni crédito.** Una clínica de 3 doctores paga Bs 550 (≈USD 48), contra USD 147 en Doctocliq o USD 180 en Kommo (que además no trae ficha).
4. **Agentes con aprobación del dueño en el plan,** sin saltar de plan ni firmar contrato largo. Doctocliq ata Soyla a contrato semestral o anual, Leadsales cobra el agente de 87 a 793 y Kommo lo da recién desde Avanzado.
5. **No se borra nada si no paga:** el sistema queda en solo lectura. Lety dice que puede borrar el contenido y Dentalink borra a los 30 días.
6. **El recall de tratamiento a medias incluido**, contra Charly de AgendaPro (desde CLP 149.900 y solo por correo). **Este argumento NO se usa hasta cerrar el paso 0.**

**Todavía no se usan:**
- La factura del SIAT, porque sigue en certificación.
- «La IA agenda» o «atiende por WhatsApp».
- «Ningún competidor factura»: Lucy dice que factura y cobra con QR dentro del chat.

## 5. Lo que no se copia

- **Cobrar por crédito, contacto activo, usuario, doctor o porcentaje de venta** (Dapta, Respond.io, Kommo, Doctocliq, Lucy).
- **Tarjeta obligatoria para la prueba, pago por adelantado, mínimo de 6 meses o add-ons de IA atados a contrato largo** (Dapta, Lety, Huli, Kommo, Doctocliq).
- **Precio escondido, alta solo por demo o implementación a medida de 1 a 2 semanas** (Dentalink, Fluker, Lucy).
- **Plan gratis permanente** (Doctocliq): regala horas de soporte.
- **Voz y llamadas salientes, omnicanal con TikTok y VoIP, flujos visuales de nodos, CRM kanban de e-commerce, o integraciones tipo Zapier y MCP sin un cliente que las pida.**
- **WhatsApp por QR no oficial** (SendyPro, Leadsales Básico) y que el cliente traiga su propia API key de IA (SendyPro).
- **Directorios o marketplaces de pacientes, simulador de sonrisa, telemedicina, rayos X con IA, crédito en cuotas al paciente, marca blanca para agencias o servicios de agencia.** Todos fallan el test de las tres preguntas.
- **Topes que apagan el bot a mitad de mes** (Wati), plantillas con el logo del proveedor (AgendaPro) y borrar datos por impago.
- **Prometer «la IA agenda sola», cifras de landing sin fuente, academias o webinars vacíos** («la venta nunca exhibe obra»).

**Pendiente de verificar:**
- Hoy: los montos de Wati, el precio oficial de Manychat y su cobro por WhatsApp, y la moneda del Lead Agent de Leadsales y de Lucy.
- Del 1-oct, sin reconfirmar: los precios de AgendaPro.
- Ningún video de ningún competidor se vio.

**Fuentes de precios de Onia:**
- `C:/dev/proyectos/onia-platform` → `origin/master:lib/subscription-plans.ts`
- `origin/master:lib/pricing.ts`
- `origin/master:lib/plan-catalogo.ts`

---

## Fichas por competidor

=== Dapta (dapta.ai) + Sendy (buscá el Sendy de WhatsApp o ventas por IA que compite en LatAm) ===
# Competencia de producto: Dapta y SendyPro, contra Onia (2026-10-08)

**Cómo se hizo.** Se partió de los teardowns existentes: `DAPTA_COMO_FUNCIONA.md`, `SENDYPRO_TEARDOWN.md`, `SENDYPRO_BRECHAS_CHATBOT.md` y `docs/ONIA_NIVEL_REFERENTES_BRECHA.md`. Hoy se reverificó solo lo público con WebFetch y WebSearch. No se creó ninguna cuenta ni se inició sesión. El navegador no se usó hoy: las capturas de la app de Dapta son del 1 y 2-oct y la cuenta de SendyPro es la de Sergio Urcullo (30-ago). Video y YouTube no se pudieron ver.

Marcas: `[V]` verificado hoy en la web pública · `[P]` verificado antes por cuenta propia · `[D]` lo dice el proveedor, sin verificar · `[?]` no verificado.

## (a) Fichas

### Dapta (dapta.ai)
- **Qué vende:** plataforma horizontal de agentes de IA de voz y texto para pymes de EE.UU. y LatAm. Su trabajo central es llamar al lead, calificarlo, agendarlo y pasarlo al CRM `[P]`. No tiene vertical de salud ni de clínicas `[V]`. Las industrias listadas son educación, SaaS, abogados, hogar, inmobiliaria y seguros.
- **Módulos que se vieron dentro de la app `[P]`:**
  - agentes de voz y de texto;
  - Inbox, Text Logs y Call Logs;
  - Equipos y Etiquetas;
  - plantillas de mensaje;
  - Tareas;
  - Sequences y Forms;
  - Calendars (una cita por agente, horario fijo, sin reprogramar);
  - el asistente Dapti, que arma el agente;
  - un servidor MCP.
- **Integraciones:**
  - WhatsApp: conexión directa con Meta, con coexistencia con la app Business. Meta cobra el envío directo a la cuenta del cliente `[P]`. Hay páginas de producto de WhatsApp AI Calls y AI Agents `[V]`.
  - Cantidad de integraciones: dicen "1.000+"; dentro de la app se vieron 15 `[D]`/`[P]`.
- **Precios (USD, solo en dólares):** la página /pricing coincide con lo registrado el 2-oct `[V]`.

  | Plan | Mes | Qué incluye |
  |---|---|---|
  | Pro | $99 | 100k créditos (~300 min), 5 usuarios |
  | Scale Up | $499 | 500k créditos, usuarios ilimitados, 4 sesiones 1 a 1 al mes |
  | Prime | $1.499 | 1,5M créditos, gerente de cuenta, grupo de WhatsApp o Slack |
  | Enterprise | A medida | Por consumo |

  - 1.000 créditos = US$1 en todos los planes. Una llamada atendida cuesta US$0,33 por minuto, y una respuesta de IA por texto entre 12 y 40 créditos según el modelo `[P]`.
  - El pago anual (16,7% menos) está en la app y en los docs, no en /pricing `[P]`.
  - Bolivia no figura entre los países con números `[P]`.
  - La web publica dos listas de precios a la vez: /es/inicio-v2 sigue con Lite $19 y Business $249 `[P]`.
- **Onboarding:** hay cuenta Free sin tarjeta, pero sin llamadas reales. La prueba es solo de Pro: 7 días, pide tarjeta y cobra sola al día 7. No hay reembolso `[P]`. Hoy /pricing solo dice "Get Started for Free" y no da duración ni condiciones `[V]`.
- **Reseñas:** Trustpilot 4,5 sobre 5 con 17 reseñas. Una reseña de 1 estrella advierte sobre el pago por adelantado. Dapta no responde a las negativas. No aparece ficha en G2 ni en Capterra `[V]`.
- **Fuentes:** https://www.dapta.ai/pricing · https://ca.trustpilot.com/review/dapta.ai · `research/competencia/DAPTA_COMO_FUNCIONA.md`.
- **Sin verificar `[?]`:** "50.000+ empresas", la nota 4.7 y SOC 2 (son dichos de Dapta). El WebFetch de hoy devolvió un banner de webinar del 26-ago: es una captura vieja, no un cambio real.

### SendyPro (sendypro.com)
- **Qué vende:** chatbot de IA solo para WhatsApp, orientado a e-commerce. Se presenta como "WhatsApp API Oficial + IA que vende por ti" `[V]`. No es un sistema de gestión: es el bot más un CRM liviano.
- **Funciones públicas `[V]`:**
  - vendedor IA con memoria que lee texto, imágenes y notas de voz, y responde con audio de voz latina;
  - handoff a humano;
  - campañas masivas con segmentación y programación;
  - Súper Chat que une WhatsApp y Gmail en una bandeja;
  - CRM, kanban y flujos visuales;
  - OCR de comprobantes para validar pagos y actualizar órdenes;
  - app Android.
- **Dentro de la cuenta de Sergio Urcullo `[P]`:** "Entrena a Vendedor IA", un chat donde el dueño edita el guion hablando, con el guion en pasos numerados al lado. También hay 5 agentes por rol, embudo por frase activadora de anuncio, difusiones, lista negra, IA con la API key del propio cliente (OpenAI o Anthropic) y mediciones con Meta CAPI.
- **Integraciones `[V]`:** Shopify, Google Sheets, Gmail, Google Calendar, Zapier, Webhooks y Meta API. No tiene pagos locales ni facturación `[P]`.
- **Precios (USD, cada 30 días) `[V]`:**

  | Plan | Precio | Qué incluye |
  |---|---|---|
  | Inicial | $19 | 1 API oficial con hasta 150 clientes automáticos por día, 1 QR |
  | Completo | $39 | Automatización ilimitada, 1 API de calentamiento, 1 QR |
  | Paquetes extra | $39 cada uno | +1 API, +1 respaldo, +1 QR |

  Usuarios, vendedores, CRM, campañas y flujos son ilimitados en todos los planes. Dentro de la app se vieron 21 niveles `[P]`.
- **Onboarding:** "Empezar Gratis", sin duración ni condiciones publicadas `[V]`. El cobro es por Hotmart o por transferencia manual con comprobante `[P]`.
- **Reseñas:** no hay ninguna pública. La búsqueda de hoy no encontró nada de SendyPro, ni en G2 ni en Capterra.
- **Lo que no dice la web `[V]`:** no menciona Bolivia, clínicas ni ningún rubro, ni agenda o reserva propia (solo la integración con Google Calendar). Tampoco publica el país ni la empresa.
- **Sin verificar `[D]`:** "Partner oficial de Meta", "500+ empresas", "99,9%" y el OCR (no hay demo probada).
- **Fuentes:** https://sendypro.com/ · `SENDYPRO_TEARDOWN.md` · `SENDYPRO_BRECHAS_CHATBOT.md`.

## (b) Funciones que Onia NO tiene, por impacto

Dapta y SendyPro son del carril chatbot y WhatsApp, no del sistema clínico. Por eso esta lista cubre ese carril. Las brechas de agenda, ficha y caja (Dentalink, Doctocliq, etc.) ya están en `docs/ONIA_NIVEL_REFERENTES_BRECHA.md`. Los códigos B son los de ese doc.

**Dueños:** Codex = código cerrado. Plataforma = producción, migraciones o criterio visual.

| # | Función | Quién la tiene | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|---|
| 1 | El bot agenda dentro del chat, sin mandar el link (B63, B23) | Dapta (Calendars) | Cambiar el destino de la reserva a la agenda de la organización. Mientras tanto, mandar el link y no decir "agendado" si no hay confirmación | M | Plataforma |
| 2 | Mensaje a un grupo de la base ("sin visita hace 6 meses", "hay huecos esta semana") (B71) | SendyPro (campañas), Dapta (Sequences) | Una campaña con segmento fijo, plantilla aprobada y baja. Va después de B06 y B09 | M a L | Plataforma, con el motor del bot en Codex |
| 3 | Retomar una conversación de más de 24 h con una plantilla aprobada (B76) | Dapta (plantillas) | Selector de plantilla en la bandeja | M | Plataforma |
| 4 | Editar el guion del bot conversando, con vista previa del cambio antes de publicar | SendyPro ("Entrena a Vendedor IA") | Un chat en `/settings/chatbot` que traduce "atendé los domingos" a un cambio con vista previa. El validador todo-o-nada actual queda detrás | M | Codex para el traductor; Plataforma para la pantalla |
| 5 | Guion de solo lectura en pasos numerados ("así atiende hoy tu asistente") | SendyPro | Renderizar el documento publicado como pasos | S | Plataforma |
| 6 | Cadencia de insistencia visible y editable por el dueño (B7 del carril) | SendyPro (20 min, 1,7 h, 3 h) | Mostrar la perilla y la cadencia que ya existen | S | Plataforma |
| 7 | La conversación nace como lead, con filtros y origen del anuncio (B64, B77) | Dapta (metas logradas, embudo), SendyPro (CAPI) | Campo de origen en la cita y filtros en la bandeja | S a M | Plataforma |
| 8 | Frase activadora por anuncio y rubro preelegido desde el link (B65) | SendyPro; Citalo | Leer `rubro` validado desde el link. La frase activadora ya existe en el bot, falta la pauta | S | Plataforma |
| 9 | Notas de voz entrantes funcionando (B41) | SendyPro | Reparar la transcripción, que está caída, y corregir el catálogo que hoy promete "fotos y audios" | S | Codex |
| 10 | Requisitos de WhatsApp antes del botón y coexistencia real (B10, B11) | Dapta | Diálogo con casilla "leí y cumplo" y pedir la coexistencia que la pantalla ya promete | S | Plataforma |
| 11 | Responder con audio de voz latina | SendyPro | Ninguna por ahora (ver d) | L | Codex |
| 12 | App móvil nativa | SendyPro (Android) | Primero probar la PWA con push en 2 teléfonos reales (B44) | S | Plataforma |
| 13 | Integraciones tipo Zapier, webhooks y MCP | Ambos | Un webhook de salida por evento, solo si un cliente lo pide | M | Plataforma |

El orden pesa así: 1 y 2 se preguntan en la demo y mueven la venta. De 4 a 6 y el 9 es bajar horas de soporte por cliente, que es el techo real del negocio. El 13 queda último porque hoy no hay un cliente que lo pida.

## (c) Lo que tienen peor que Onia (argumentos de venta)

**Frente a Dapta:**
- No tiene rubro clínico: no ve tratamientos ni fichas. No recupera al paciente con tratamiento a medias, y Onia lo detecta solo (falta verlo encontrar a alguien en producción, B16) `[P]`.
- Todo es en USD, con tarjeta y sin números de Bolivia. Onia cobra en bolivianos con QR del BCP.
- Prueba de 7 días que pide tarjeta y cobra sola, y no hay reembolso. Onia da 14 días sin tarjeta.
- Los créditos se agotan y paran las llamadas y los mensajes. El plan de Onia es fijo.
- Tiene dos listas de precios vivas, enlaces rotos (academia vacía, comunidad caída) y dichos sin auditar `[P]`.
- El precio de entrada es US$99 al mes. Ese es el precio de entrada para pymes bolivianas, sin vertical.

**Frente a SendyPro:**
- Es solo un bot en WhatsApp, sin agenda, ficha, caja ni inventario. Cuando su bot vende, anota en un CRM aparte. En Onia la cita queda en la agenda y el cobro en la caja.
- Cobra la IA aparte: el cliente trae su propia API key de OpenAI, que exige cuenta y tarjeta internacional. Onia absorbe la IA.
- El plan más barato limita a 150 clientes automáticos por día. Onia no tiene ese límite.
- El guion lo ajusta la IA sin controles deterministas. Onia tiene un validador todo-o-nada.
- Conecta un WhatsApp por QR no oficial junto al oficial. Es una zona gris con Meta.
- No se verificó país, empresa ni reseñas públicas `[V]`.
- Usa Hotmart o transferencia manual. Nada de facturación ni de pagos locales.

**Advertencia de honestidad:** hoy el agente conversacional de WhatsApp de Onia está después de la prueba real (decisión 1-oct), con cero clientes pagando y cero conectados. No se puede vender como ventaja de funcionamiento, solo de diseño. Además, nunca decir "la IA agenda sola" ni "la IA atiende por WhatsApp".

## (d) Lo que no conviene copiar

- **Créditos como unidad de venta** (Dapta). Rompe el plan fijo y la ventaja de Onia en bolivianos.
- **Voz y llamadas salientes** (Dapta). Es otro negocio, no pasa el test de las tres preguntas, y sin números de Bolivia ni horas de soporte no es de Etapa 1.
- **IA propia del cliente con su API key** (SendyPro). Es justo la fricción que Onia elimina.
- **Gamificación, ligas, mentores** (SendyPro). Es su comunidad, no el producto de Onia.
- **WhatsApp por QR no oficial** (SendyPro). Riesgo con Meta. No copiar sin decisión de Sergio Urcullo.
- **Flujos visuales sin código y CRM kanban de e-commerce** (SendyPro). Onia ya es el sistema entero y ese es el modelo viejo.
- **"IA ajusta el guion" sin validador.** Si se copia el editor conversacional (#4), va con el validador actual.
- **Cifras de landing sin fuente** ("50.000+ empresas", "500+ empresas", "99,9%") y una prueba con tarjeta y sin reembolso. Hay cero clientes pagando y está prohibido fabricar.
- **Enlaces a academias o comunidades vacías, o a webinars vencidos.** Viola "la venta nunca exhibe obra".

## Pendiente (no se hizo hoy)

- Sergio Urcullo: ver los videos de YouTube y las páginas de G2 y Capterra de ambos con su navegador, porque desde acá no abren.
- Sergio Urcullo: revisar si el borrador "Julia" en la cuenta de Dapta (espacio "OnIA") se deja o se borra.
- Por verificar: el precio exacto de Dapta en la app hoy y si el Free se renueva, que sigue contradictorio (1.672 contra 2.000 créditos).
- Por verificar: si SendyPro tiene un plan público de 21 niveles o solo los dos de la web. La web muestra dos planes más paquetes de $39.

=== Lety (lety.ai) + Fluker AI ===
**Alcance:** solo web pública, sin cuentas. Me apoyé en WebFetch y WebSearch. No abrí el navegador integrado ni verifiqué videos de YouTube. Toda comparación con Onia sale de `ONIA_CATALOGO_DE_VENTA.md` §2-§8.

## (a) Fichas

### Lety (lety.ai), medido hoy 8-oct-2026
- **Qué vende:** una plataforma white-label para agencias que revenden agentes de IA con su marca. No le vende a la clínica directamente.
- **Producto:**
  - Agentes precargados para 12 verticales y 46 nichos. "Dental clinic" es uno: intake, citas y preguntas sobre tratamientos.
  - Genera el prompt a partir de una frase e indexa archivos y URLs.
  - Canales: WhatsApp, Instagram, chat web y email.
  - Dominio propio, logo de la agencia y facturación por cliente.
  - Multi-tenant con subcuentas y un panel por cliente.
  - Una calculadora de ingresos para la agencia.
- **Integraciones:**
  - Dice tener "900+ MCP", pero otra fuente dice 600+; el número no es confiable.
  - Nombra HubSpot, Salesforce, Google Calendar, Calendly, Cal.com, Stripe, PayPal y Mercado Pago.
  - Dice que cobra con Stripe Connect.
  - No nombra "WhatsApp Cloud API". Dice que las sesiones de WhatsApp se pasan a Meta sin recargo.
- **Precios** (https://lety.ai/pricing):
  - Starter USD 97/mes (2 subcuentas), Standard USD 297 (10), Unlimited USD 497.
  - La moneda no está rotulada, pero la ficha del 3-oct la lee como USD.
  - Los tokens del modelo se pasan al costo.
- **Onboarding:** 7 días gratis con tarjeta (Stripe), asistente de 7 pasos, cancelación en dos clics y demo opcional.
- **Reseñas:**
  - G2 tiene el perfil sin reseñas (0).
  - No hay ficha en Capterra.
  - Solo hay comentarios del lanzamiento en Product Hunt (5-may-2026).
  - Las cifras de clientes se contradicen: 250+ agencias según Product Hunt, 1000+ según Village.
- **No verificado:**
  - Si tiene facturación fiscal o recordatorios propios de clínica.
  - La videodemo (hay un botón "Watch video", no lo vi).
  - Los logos de clientes y los contadores (en la web los contadores salen en cero).

### Fluker AI (flukerai.com), medido hoy
- **Qué vende:** un agente de IA para clínicas y estética que convierte mensajes en citas. No es un sistema de gestión.
- **Producto:**
  - Canales: WhatsApp, Messenger, Instagram y TikTok.
  - Agenda en "tu calendario" (no dice cuál), confirma y recuerda citas, y tiene página de reservas.
  - Automatiza seguimientos: tras una conversación abandonada (30 min, 2 h o 24 h), tras cancelaciones y tras ausencias.
  - Consentimiento informado con firma digital por código e IP.
  - Un CRM básico con historial de citas, notas y documentos.
  - App móvil para el equipo (los enlaces de descarga apuntan a example.com, así que no existe publicada).
  - Envía conversiones a Meta (CAPI).
  - Ofrece "crédito" para que el paciente pague en cuotas y desembolsa los martes.
- **Precios:** no visibles ("Cotiza"). `/precios` da 404.
- **Onboarding:** sin autoservicio; piden demo por WhatsApp, sin video. Configuran ellos "a mano".
- **Países:** testimonios de Medellín, Quito y Panamá; Bolivia no aparece.
- **Reseñas:** la búsqueda no halló nada independiente.
- **No verificado:**
  - Precio.
  - Facturación.
  - Qué calendario usa.
  - El proveedor del crédito.
  - Seguridad y privacidad.

## (b) Funciones que Onia NO tiene (por impacto en clínicas y pymes bolivianas)

| # | Función | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|
| 1 | Recordatorio y confirmación de cita por WhatsApp (Fluker) | Plantilla utility por Cloud API: confirmar, reprogramar o cancelar con respuesta del paciente. Hoy Onia solo manda correo. Depende del chip prepago. | M | Plataforma (producción y Meta); la lógica de respuesta, Codex |
| 2 | Seguimiento de la conversación abandonada (Fluker) | Un agente que, a los 30 min / 2 h / 24 h de un "preguntó precio y no reservó", propone el mensaje y el dueño lo aprueba en «Pendientes». Es el dolor #1 del cliente ideal. | M | Codex (agente nuevo sobre el patrón existente) |
| 3 | Reactivar a los que faltaron o cancelaron (Fluker) | Extender el reprogramador y el recall (el agente "tratamiento a medias" ya existe) a ausencias y cancelaciones. | S | Codex |
| 4 | Consentimiento informado digital (Fluker) | Enviar un enlace con un código de verificación, firma registrada con fecha e IP y guardada en la ficha dental. | M | Codex; revisar el texto legal con Sergio Urcullo antes de publicar |
| 5 | Plantilla precargada al registrarse (Lety) | El alta ya elige rubro; precargar servicios, mensajes y horarios de ejemplo para que algo funcione el primer día. | S | Codex; el criterio visual lo define Plataforma |
| 6 | Cobro con reintentos y días de gracia (Lety) | Hoy el QR se aprueba a mano. Copiar solo la regla escrita de gracia y reintentos; la tarjeta no aplica. | S (regla) / L (automatizar el QR) | Plataforma (producción) |
| 7 | Eventos de conversión a Meta (CAPI, Fluker) | Enviar "cita agendada" a Meta para optimizar la pauta, cuando haya pauta de clientes. | M | Codex; credenciales por Plataforma |
| 8 | App móvil del equipo (Fluker) | Fluker anuncia una, pero sus enlaces de descarga están rotos: no hay prueba de que exista. Evaluar un PWA antes de construir. | L | Plataforma |
| 9 | Calendarios externos y CRM por MCP (Lety) | No es prioridad para pymes bolivianas. Solo revisar Google Calendar. | M | Codex |

No pude comprobar que Onia carezca de lo siguiente, así que solo lo anoto: la firma digital por código, la página de reservas propia de Fluker (Onia ya tiene link de reserva) y el CRM básico.

## (c) Lo que tienen peor que nosotros (argumentos de venta)
- **Ninguno es un sistema de gestión.** Onia incluye ficha clínica, odontograma, presupuesto, cobros, caja, inventario, contabilidad y planilla. Fluker agenda; Lety construye agentes.
- **Precio y alta:**
  - Lety pide tarjeta para probar, algo que corta el alta en Bolivia. Onia da 14 días sin tarjeta, con precio visible.
  - Fluker no muestra precio ni deja registrarse solo.
- **Cobro y facturación:**
  - Lety cobra con Stripe y tarjeta; Onia usa QR del BCP, el medio local.
  - Ninguno de los dos menciona SIAT ni facturación boliviana (a Fluker no se la vi; a Lety no la vi). Esto no vale como argumento hasta que Onia encienda la factura SIAT (§7).
- **Bolivia:** Fluker no muestra clientes bolivianos y Lety está en Miami.
- **Datos:** los términos de Lety dicen que el contenido "puede borrarse" si no se paga. Onia deja el sistema en solo lectura y no borra nada.
- **Madurez:** Lety tiene 0 reseñas en G2 y cifras de clientes inconsistentes.
- **Control de la IA:** en Onia el dueño aprueba cada mensaje en «Pendientes».

## (d) Lo que no conviene copiar
- Tarjeta obligatoria para la prueba (Lety).
- Borrar datos si no se paga (Lety).
- Vender a intermediarios y revender con marca blanca (Lety); Onia le vende a la clínica.
- Precio escondido y alta solo por demo (Fluker).
- Prometer "la IA agenda sola" o que los agentes agenden dentro del chat; el catálogo de Onia lo prohíbe (§5).
- Crédito en cuotas al paciente (Fluker): es dinero de terceros, tiene riesgo regulatorio y es otro negocio.
- Servicios de agencia (SEO, gestión de pauta): fallan el test de tres preguntas.
- Funciones que hoy no se pueden cumplir, como el "24/7 con IA" en WhatsApp: el agente de WhatsApp de Onia sigue pendiente y no debe nombrarse en la venta.

## Pendiente
- **Dapta, Sendy y los demás:** no los revisé en esta pasada. Solo existen fichas anteriores (`DAPTA_TEARDOWN.md`, `SENDYPRO_TEARDOWN.md`, `MAPA_COMPETENCIA.md`), sin actualizar.
- **Videos y capturas de YouTube:** no verificados.

**Fuentes:**
- https://lety.ai
- https://lety.ai/pricing
- https://flukerai.com
- https://www.g2.com/sellers/lety-ai
- https://www.producthunt.com/p/lety-ai
- Fichas internas: `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/LETY_FICHA.md`
- Fichas internas: `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/FLUKER_FICHA.md`
- `C:/dev/proyectos/onia-hermes/hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`

=== Kommo (kommo.com) + Leadsales (leadsales.io) ===
# Kommo y Leadsales vs Onia: análisis de producto (8-oct-2026)

**Cómo se hizo.** Usé WebSearch y WebFetch sobre páginas públicas. No usé el navegador integrado, así que no vi las pantallas renderizadas. Solo tengo las rutas de las capturas que listan sus webs. No creé cuentas. Ya existían `KOMMO_FICHA.md` y `LEADSALES_FICHA.md` (3-oct) en `hermes-content/research/competencia/`. Las verifiqué contra la web de hoy y agregué funciones, reseñas y diferencias. Lo no verificado va marcado **[NV]**.

## (a) Fichas

### Kommo (kommo.com)
- **Qué vende.** CRM con IA para conversaciones de WhatsApp, Instagram, TikTok y Messenger. Rubros que nombra: belleza, retail, educación, inmobiliaria. Es horizontal, sin pack por rubro.
- **Módulos (home).**
  - Embudos múltiples, buzón unificado, Salesbot sin código, difusión por WhatsApp y analítica con ROI y origen de anuncios.
  - **Reservas** (marcado «NUEVO»): página de reserva, calendarios, agendado por IA y recordatorios.
  - Kommo IA: respuestas 24/7, comentarios de Instagram, tareas de seguimiento y detección de leads calientes.
  - Agente de IA de ventas, agente de IA para reservas y Copilot del CRM.
  - Herramientas gratis: calculadora del costo de WhatsApp (Meta), generador de link y de QR de WhatsApp.
  - Marketplace con unas 100 integraciones, y API/SDK.
- **Precios.**
  - Web pública, USD por usuario/mes, solo en bloques de 6 meses o más:

    | Plan | Precio | Qué incluye |
    |---|---|---|
    | Básico | 20 | 1 número de WhatsApp, 1 Instagram |
    | Avanzado | 30 | Automatización, difusión, bots, hasta 3 agentes de IA, 3 números |
    | Pro | 45 | Reservas, hasta 50 agentes de IA, agendado por IA, números ilimitados |
    | Empresarial | A medida | SSO, gestor dedicado |

  - La ficha del 3-oct, vista desde Bolivia, mostraba BOB 240 / 360 / 540 por usuario. Es la misma estructura, con otra moneda a la vista.
  - Lo de Meta se paga aparte, y el pago mensual no existe.
- **Alta.** 14 días gratis, sin tarjeta, autoservicio. WhatsApp con Embedded Signup y coexistencia.
- **Reseñas.** Capterra ~4,3 (~195 reseñas). G2 ~4,1 (49 reseñas). Son cifras de agregadores, no las leí directo.
  - A favor: la integración con WhatsApp, el historial unificado, Salesbot y el precio.
  - En contra: soporte lento, costos ocultos (el compromiso de 6 meses, la API de WhatsApp y los widgets del marketplace), configuración de WhatsApp confusa y reportes limitados.
- **Fuentes:** kommo.com/es/precios/comparar-planes/, kommo.com/es/, [Capterra](https://capterra.com/p/120048/amoCRM/reviews/) (listado con el nombre viejo amoCRM).
- **Demos.** No encontré una demo en video concreta. Solo la lista de reproducción de YouTube y youtube.com/@kommoes, que no abrí **[NV]**.

### Leadsales (leadsales.io, Querétaro, México)
- **Qué vende.** CRM para WhatsApp, Facebook e Instagram para equipos de ventas de pymes. Sin rubro fijo. Sus casos son educación y asesoría. El logo de Doctoralia aparece, pero sin caso de uso.
- **Módulos.**
  - Embudo con dueño por etapa (persona o IA) y buzón compartido con notas y mensajes programados.
  - Asignación automática de leads y agenda de tareas.
  - Campañas masivas con plantillas aprobadas y métricas.
  - **WhatsApp Flows** (formularios dentro del chat) y Leadbot (menú de preguntas frecuentes que deriva a una persona).
  - **Lead Agent (Beta):** agente de IA por etapa, con simulador de pruebas.
  - App móvil.
- **Precios.** Aparece como USD/mes (con MXN al lado) y suben así:

  | Plan | USD/mes | Usuarios | Embudos | Notas |
  |---|---|---|---|---|
  | Básico | 97 | 3 | 5 | WhatsApp tipo «Messenger/Web», sin campañas masivas ni Lead Agent |
  | Profesional | 133 | 4 | 10 | API oficial, 10 USD/mes de saldo Meta |
  | Avanzado | 247 | 5 | Ilimitados | API oficial, 20 USD/mes de saldo Meta |

  - Descuentos: -10 % a 3 meses, -15 % a 6, -20 % al año.
  - El saldo de Meta se acumula.
  - Sin cargo de Meta en conversaciones iniciadas desde anuncios (primeras 72 h) ni en 1.000 mensajes de servicio al mes por número.
  - **Lead Agent:** primer mes gratis. Después Starter 87, Growth 297 y Scale 793. La página muestra MXN y USD, pero la moneda del precio no es clara **[NV]**.
  - Usuario extra: sin precio público.
- **Alta.** Prueba de 14 días solo en el Básico. En Profesional y Avanzado no aparece prueba de la plataforma. Sin permanencia, y guarda el espacio 90 días al cancelar.
- **Reseñas.** Capterra 3,9 con solo 8 reseñas. Capterra lista un precio inicial de USD 83,99 que no coincide con la web, así que no lo uso **[NV]**. No encontré ficha en G2. Elogian lo fácil de usar y el soporte. No leí las dos reseñas de 1 estrella.
- **Fuentes:** leadsales.io/precios/, leadsales.io, [Capterra](https://www.capterra.com/p/215729/Leadsales-CRM/reviews/). Capturas en leadsales.io/product/*.png. Demo en video del producto: no hay, solo entrevistas de clientes.

**Dapta y Sendy:** ya tienen teardown en la carpeta (`DAPTA_TEARDOWN.md`, `SENDYPRO_TEARDOWN.md`). No los repetí.

## (b) Funciones que Onia NO tiene, por impacto

Onia tiene hoy bandeja, agentes con aprobación del dueño y agenda. El agente conversacional de WhatsApp está construido pero sin probar en real (catálogo §5).

| # | Función | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|
| 1 | Conectar WhatsApp solo, con coexistencia | Embedded Signup más el mensaje «sigues usando tu WhatsApp en el celular». Es lo que ambos venden primero. | M | Plataforma (producción y Meta) |
| 2 | Formularios dentro del chat (WhatsApp Flows) | Anamnesis, datos del paciente y motivo de consulta antes de la cita. Es lo de mayor valor para clínicas. | M | Codex (formulario) y Plataforma (publicar) |
| 3 | Difusión con plantillas aprobadas | Campaña de «volvé a tu control» con costo y saldo a la vista antes de enviar. Se alinea con el recall. | M | Codex (código) y Plataforma (envío real) |
| 4 | Cálculo de costo de Meta antes de enviar | Calculadora pública, o al menos el costo estimado antes de la campaña. | S | Codex |
| 5 | Agente de IA que agenda desde el chat | Kommo lo pone en su plan Pro. En Onia el catálogo prohíbe prometerlo. Copiar solo el diseño, no la promesa, y solo tras la prueba real. | L | Plataforma |
| 6 | Embudo kanban de leads y consultas | Útil para primeras consultas, cotizaciones B2B y presupuestos pendientes. | M | Codex |
| 7 | Origen de anuncios y ROI (clic a WhatsApp) | Reporte «de qué anuncio llegó cada cita». Sirve para vender la pauta. | M | Codex, con tracking en Plataforma |
| 8 | Simulador de prueba del agente | El dueño prueba el bot antes de activarlo. Baja el riesgo de que hable mal. | S | Codex |
| 9 | Leadbot: menú de preguntas frecuentes que deriva | Onia ya tiene guion. Falta el menú y la derivación visibles. | S | Codex |
| 10 | Alerta de mensajes sin responder y leads sin gestionar | Métrica simple en la bandeja, sin IA. | S | Codex |
| 11 | App móvil | Leadsales la anuncia en las tiendas. Onia la tiene planificada (doc de bandeja). | L | Plataforma |
| 12 | Canales Instagram, Facebook y TikTok | Kommo y Leadsales los cubren. | L | Plataforma |

Pricing, para decidir con Sergio Urcullo (no es código):
- Dar el agente «gratis el primer mes» como gancho del add-on.
- Incluir saldo de Meta en el plan, acumulable.

Aclaro un límite: las prioridades 1 a 3 asumen que la 1.0 sale primero. Falta la prueba real de WhatsApp y del pago (catálogo §6).

## (c) Lo que tienen peor que nosotros (argumentos de venta)

1. **Son CRM genéricos.** No hay ficha clínica, odontograma, presupuesto, caja ni contabilidad. Onia es el sistema de gestión por rubro y el bot es un add-on.
2. **Pagar en dólares.** Kommo factura solo en USD y con 6 meses por adelantado. Leadsales cobra por Stripe en USD o MXN. Onia cobra por QR del BCP, en moneda local y con prueba sin tarjeta.
3. **Precio por usuario (Kommo).** Castiga a la clínica con recepción más varios doctores. Onia incluye 4 usuarios en Crece.
4. **Costos ocultos.** Los usuarios de Kommo se quejan de la API de WhatsApp y los widgets aparte. En Leadsales, el usuario extra no tiene precio público.
5. **IA escondida en el plan caro.** Kommo da agentes desde Avanzado. Leadsales cobra el agente aparte, en un escalón de 87 a 793. Onia es el agente propuesto con aprobación del dueño, sin salto de plan.
6. **Sin facturación ni contabilidad boliviana.** Ninguno muestra SIAT, NIT ni planilla local. Ojo: Onia tampoco tiene la factura del SIAT todavía (catálogo §7), así que este argumento no se usa aún.
7. **Soporte (Kommo).** Las reseñas lo señalan como lento y con respuestas de guion.
8. **Muy pocas reseñas (Leadsales).** Solo 8 en Capterra, así que no hay prueba social sólida.

## (d) Lo que no conviene copiar

- Pago mínimo de 6 meses por adelantado y solo en USD.
- Precio por usuario.
- Agente de IA obligando a subir de plan.
- Tres niveles del agente con salto de 87 a 793 USD, que empuja a hablar con ventas.
- Plan base con conexión no oficial de WhatsApp (Leadsales Básico: «Messenger/Web»). Expone el número a bloqueo de Meta (inferencia).
- Canales sociales (Instagram, TikTok): dispersan antes de tener clientes pagando.
- Prometer que la IA agenda sola. Contradice el catálogo de Onia (§5 y §8).
- Ninguno de los dos es competencia directa de la clínica dental: son CRM de ventas. Medirnos solo contra ellos distrae de Dentalink y AgendaPro (`DENTALINK_TEARDOWN.md`, `AGENDAPRO_CITALO_TEARDOWN.md`).

## Archivos y límites

- Revisados: `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/KOMMO_FICHA.md`, `LEADSALES_FICHA.md` y `C:/dev/proyectos/onia-hermes/hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (§1 a §8).
- No escribí ni modifiqué archivos.
- Pendiente de verificar: ver las pantallas con el navegador, abrir el canal de YouTube de Kommo, leer las reseñas de 1 estrella de Leadsales y confirmar la moneda del Lead Agent.

=== Wati (wati.io) + Manychat (manychat.com) ===
**Resumen:** Wati y Manychat son plataformas de conversación (WhatsApp, Instagram) y no un sistema de gestión por rubro. No compiten con la agenda, la ficha ni los cobros de Onia. Compiten solo con el add-on de chatbot y la bandeja.

**Límites de esta pasada:**
- No abrí el navegador integrado.
- Los videos no se vieron. La web de Wati no trae ningún video, solo el canal youtube.com/WATIWhatsAppTeamInbox y un enlace para reservar una demo. Manychat devolvió 403 a la lectura automática.
- La ficha de Manychat se apoya en la revisión hecha el 2-oct por la sesión madre en el Chrome de Sergio Urcullo, más búsquedas de hoy. Los precios de Manychat no están verificados contra su página oficial hoy.

## (a) Fichas

### Wati (wati.io)
- **Qué vende:** WhatsApp Business API con bandeja de equipo, chatbot sin código, campañas (broadcasts), anuncios que abren WhatsApp (CTWA), llamadas por WhatsApp, catálogo, varios números, coexistencia con la app del celular y agentes de IA («Astra»). También vende Instagram/Messenger. Dice tener 100+ integraciones (Salesforce, Zoho, HubSpot, Shopify, WooCommerce, Klaviyo, Zapier, Make, PayTabs). Los pagos dentro del chat no aparecen en su home.
- **Precios (USD/mes, anual / mensual), según `WATI_FICHA.md` del 3-oct, visto desde Bolivia:**
  - Growth 45 / 59 (3 usuarios, 500 contactos activos, 1 agente de IA).
  - Pro 95 / 119 (5 usuarios, 1.000 contactos, 2 agentes).
  - Business 239 / 299 (10 usuarios, 2.500 contactos).
  - Extras: 20 USD por 250 contactos, 29 USD por número adicional.
  - Meta se cobra aparte, desde un saldo prepago.
  - **No verificado hoy:** la lectura de hoy de wati.io/pricing no mostró los montos (la página se carga por JavaScript). Sí confirmó los límites por plan, la prueba de 7 días y que el anual ahorra hasta ~25 %.
- **Alta:** 7 días gratis sin tarjeta, autoservicio o demo. Paga con tarjeta internacional o PayPal; transferencia solo en el plan anual.
- **Reseñas:** Capterra 4,6 sobre 202 reseñas (actualizado el 2-mar-2026). Elogian la facilidad de uso y la bandeja compartida. Critican el precio para negocios chicos, ~5 días de onboarding, demoras en aprobar plantillas, analítica básica en el plan de entrada y que solo cubre WhatsApp. No obtuve el puntaje de G2.
- **Fuentes:** wati.io, wati.io/pricing/, `hermes-content/research/competencia/WATI_FICHA.md`, [Capterra](https://www.capterra.com/p/204314/WATI/reviews/?page=9), [Hackceleration](https://hackceleration.com/labs/review/wati).

### Manychat (manychat.com)
- **Qué vende:** automatización de mensajes directos en Instagram, Messenger, TikTok y WhatsApp, pensada para creadores y vendedores.
  - Su pieza más fuerte es comentario a mensaje directo, con plantillas por objetivo. Hay ~25 y ninguna es de clínica ni de salud.
  - Tiene editor visual de flujos con métricas por paso, bandeja con pausa del bot cuando entra un humano, y una IA propia en beta (respuestas con tus conocimientos y comentarios).
  - Se conecta como socio oficial de Meta. Esa fue la revisión del 2-oct.
- **Precios (USD, de la revisión del 2-oct):**
  - Free $0: 25 contactos activos.
  - Essential $14 al mes anual ($168 al año): 250 contactos.
  - Pro $29 al mes anual ($348 al año): 2.500 contactos, con IA.
  - Business $69: 7.500 contactos.
  - Advanced $139: 25.000 contactos.
  - Si te pasás del límite, cobran un excedente por contacto ($0,10 / $0,05 / $0,025 / $0,004 según el plan) y no apagan nada.
  - Prueba de 14 días, reembolso dentro de 30 días.
  - **WhatsApp:** la revisión del 2-oct lo marcó como función de pago. Una fuente de terceros dice que exige Pro y que la IA suma $29 al mes. Los precios mensuales difieren entre fuentes (una dice 17 / 39 / 99 / 199). **Sin confirmar** contra la página oficial.
  - Una fuente de terceros dice que desde el 2-mar-2026 el plan Free bajó de 1.000 a 25 contactos.
- **Reseñas:** Capterra 4,6 sobre 72 reseñas, con atención al cliente en 4,0. Elogian el constructor sin código y el paso a humano. Critican la desconexión de cuentas de Meta, el soporte débil y el cobro.
- **Fuentes:** `REVISION-HERRAMIENTAS-CHATBOT.md` (sección Manychat), [Capterra](https://www.capterra.com/p/206636/ManyChat/reviews/), [eesel](https://www.eesel.ai/blog/manychat-pricing), [YourGPT](https://yourgpt.ai/blog/comparison/manychat-review).

## (b) Lo que Onia NO tiene, por impacto para clínicas y pymes bolivianas

Dueño: **Codex** = código cerrado. **Plataforma** = producción, migraciones o criterio visual.

| # | Función | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|
| 1 | Conectar el WhatsApp del cliente solo (Wati: Embedded Signup y coexistencia) | Botón «Conectar mi WhatsApp» con el número de la clínica que sigue usando la app del celular. Es lo que hoy bloquea vender el add-on. | M | Plataforma |
| 2 | Pausa automática del bot cuando un humano toma el chat (Manychat) | Ajuste «pausar 30 min» y reasignar al mismo agente al reabrir. | S | Codex |
| 3 | Campañas con plantillas aprobadas por Meta (Wati) | Mensaje masivo al segmento «no volvió» con plantilla. Fuera de las 24 h es la única forma de escribir. | M | Plataforma (cobra Meta) |
| 4 | Asignación de chats por operador (Wati, Manychat) | Reparto manual primero y por reglas después; la recepción lo necesita. | S | Codex |
| 5 | Medidor de consumo visible y exceso blando (Manychat) | Mensajes del add-on contra lo que cubre el plan, y avisar y cobrar el excedente en vez de cortar el bot. | S | Codex |
| 6 | Autodiagnóstico de la conexión con Meta (Manychat) | Pantalla «todo está bien» y botón «reparar permisos». Baja el soporte, que es el techo del negocio. | M | Plataforma |
| 7 | Métricas por flujo y por paso (Manychat) | Enviados, respondidos y citas generadas, para probar el valor del add-on. | M | Codex |
| 8 | Respuestas rápidas y plantillas de chat (Wati) | Textos guardados en la bandeja. | S | Codex |
| 9 | Anuncio que abre WhatsApp, con atribución (Wati) | Marcar de qué anuncio vino el contacto. Meta da 7 días gratis a esas conversaciones. | M | Plataforma |
| 10 | Clonar la configuración del bot de una clínica a la siguiente (Manychat) | Copiar o publicar como plantilla. | M | Codex |
| 11 | Integraciones (Zapier, Make, Google Sheets) | API o webhooks abiertos. Poco valor para la clínica chica. | L | Codex |
| 12 | App móvil y llamadas por WhatsApp (Wati) | Aviso al celular de la recepción. La llamada no es prioridad. | L | Plataforma |

## (c) Lo que tienen peor que nosotros (argumentos de venta)

- **No son un sistema de gestión.** No tienen agenda, ficha, odontograma, presupuesto, cobros, caja, contabilidad ni planilla. El cliente pagaría esto más un sistema aparte.
- **Wati pausa el bot a mitad de mes** si te pasás del tope de contactos, y el paciente queda sin respuesta.
- **Cobro en dólares con tarjeta internacional** (Wati, Manychat). En Bolivia deja afuera a muchos; Wati acepta transferencia solo en el plan anual. Onia cobra en bolivianos con QR del BCP.
- **Precio de Wati alto para una clínica chica:** desde 45 USD al mes más Meta, con tope de 500 contactos. Capterra lo critica por caro.
- **Wati exige onboarding de ~5 días**, y su ayuda se contradice sobre si se puede usar el número actual. Onia promete 14 días sin tarjeta y el registro solo.
- **Manychat no tiene nada para salud o clínicas:** sus plantillas son de sorteos y afiliados. Mezcla español con inglés, y su página de precios está en inglés. No detecta pacientes con tratamiento a medias.
- **Manychat depende de la conexión con Meta,** que se cae según sus propias reseñas, y su soporte tiene 4,0 en Capterra.
- **Ninguno factura en Bolivia ni cobra online acá** (SIAT sigue en certificación en Onia, así que no se nombra todavía).

## (d) Lo que no conviene copiar

- El tope de contactos que apaga el bot (Wati).
- Cobrar solo con tarjeta internacional.
- Empujar «mejorá tu plan» en cada pantalla (Manychat).
- Un checklist que marca como hecho algo que está pausado (Manychat).
- Plantillas de creador: sorteos, afiliados, seguidores. Onia debe hacerlas por rubro.
- Voz y llamadas por WhatsApp, y el sistema de agentes ilimitados de Wati Business. No pasan el test de tres preguntas del negocio.
- Prometer «la IA agenda sola» o «responde lo que le preguntes». El catálogo de Onia lo prohíbe.
- El flujo visual completo de nodos de Manychat. Es mucho esfuerzo y el cliente ideal no arma flujos.

## Verificado y no verificado

- **Verificado en la web hoy:**
  - Funciones y titulares de wati.io.
  - Límites por plan de Wati, la prueba de 7 días y el ahorro anual de ~25 %.
  - Capterra: Wati 4,6 (202 reseñas), Manychat 4,6 (72).
- **No verificado:**
  - Los montos actuales de Wati.
  - El precio oficial de Manychat y su cobro por WhatsApp.
  - El puntaje de G2 de ambos.
  - Cualquier video.

Archivos usados:
- `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/WATI_FICHA.md`
- `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/REVISION-HERRAMIENTAS-CHATBOT.md`
- `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md`
- `C:/dev/proyectos/onia-hermes/hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`

=== Datec / Lucy (datec.ai) + Respond.io ===
**Fichas de Datec/Lucy y Respond.io, y brechas frente a Onia**

Lo medido hoy (2026-10-08) viene de páginas públicas, sin crear cuentas ni iniciar sesión. Ninguna de las dos aparecía en `research/competencia/` ni en `competitor-profiles/` (grep sin resultados útiles). El resumen vigente de la carpeta es `PRODUCTO_COMPETENCIA_RESUMEN.md`. Lo no verificado va marcado [NV].

## (a) Fichas

### Datec / Lucy (Bolivia, lucy.datec.ai)

- **Qué vende:** Lucy es un agente de ventas por WhatsApp. Lo lanzó Datec el 30-abr-2026 en Bolivia, según [Los Tiempos](https://www.lostiempos.com/actualidad/economia/20260430/datec-lanza-lucy-ecosistema-ia-vender-whatsapp-interrupciones). Datec dice tener 27 años y operar en 6 países. No es un sistema de gestión.
- **Sectores objetivo (prensa):** gastronomía, retail, servicios (la nota nombra clínicas médicas, veterinarias y centros de belleza), entretenimiento e independientes.
- **Planes (configurador de la web):** hay que elegir rubro y después uno de tres paquetes.
  - **Lucy Sales:** agente de ventas 24/7, menú digital con fotos y precios, cobro con QR y links de pago, y facturación electrónica automática.
  - **Lucy Logistics:** delivery, coordinación de envíos, tracking en tiempo real y notificaciones por etapa.
  - **Lucy Universe:** ventas, coordinación, remarketing y atención unificados. Suma reportes por servicio profesional, promociones y recordatorios automáticos, cobros y segmentación de clientes.
- **Funciones declaradas (web):** consulta de catálogo e inventario sincronizado con ERP/CRM, pago con QR dentro del chat, tracking, y escalado a humano con todo el contexto.
- **Precios (solo se vio Lucy Universe, tamaños XS y S):**
  - XS, "Emprendedor": $500/mes, hasta 750 ventas/mes, más 1,3% (o 1,2%) por venta procesada.
  - S, "Negocio": $990/mes, hasta 2.000 ventas/mes, más 1,25% (o 1,2%) por venta procesada.
  - Más de 5.000 ventas/mes: a medida.
  - Se marcan como "precio de lanzamiento". No dice si el $ es USD ni si ese cargo por venta es de ellos o de la pasarela [NV]. Tampoco vi los precios de Sales ni de Logistics [NV].
- **Onboarding:** no hay prueba gratis visible ni registro propio. El flujo termina en "Hablar por WhatsApp" o correo. La implementación tarda "2 semanas" según el configurador y "7 a 10 días hábiles" según su FAQ. Es decir, entra un vendedor y hay un proyecto de implementación.
- **Resultados que anuncia:** +30% de respuesta útil, -80% de carga operativa, +15% de conversión, -35% de costo de adquisición. Todo "esperado en 30-60 días", sin fuente. La demo del chat es simulada, según su propia web.
- **No verificado:**
  - Reseñas: no encontré en G2 ni Capterra reseñas de Datec/Lucy. La búsqueda devolvió un listado "Lucy: AI Assistant" cuya relación con Datec no pude confirmar.
  - Si usa WhatsApp Cloud API oficial, y cómo se factura con el SIAT.
  - Videos de demo: no los busqué.
- **Fuentes:** lucy.datec.ai (navegador), Los Tiempos (arriba).

### Respond.io (global, respond.io)

- **Qué vende:** una bandeja de conversaciones omnicanal (WhatsApp, Instagram, Facebook, TikTok, correo) con agentes de IA y automatización. No es un sistema de gestión por rubro.
- **Funciones (respond.io/features):**
  - Bandeja de equipo y llamadas (WhatsApp Business Calls, Messenger, VoIP).
  - Agentes de IA que responden, califican leads, rutean, recomiendan productos, gestionan reservas y comparten datos de pago.
  - Difusiones masivas, CRM y gestión de leads propios, encuestas CSAT dentro del chat, y reportes de ROI por anuncio, agente y canal.
  - Meta y TikTok figuran como partners. La página de funciones no menciona WhatsApp Cloud API ni Stripe [NV].
- **Precios ([respond.io/pricing](https://respond.io/pricing), USD al mes, facturación anual / mensual):**

| Plan | Anual | Mensual | Usuarios incluidos | Créditos IA |
|---|---|---|---|---|
| Starter | $79 | $99 | 5 (extra $12) | 5.000 |
| Growth | $159 | $199 | 10 (extra $20) | 10.000+ |
| Advanced | $279 | $349 | 10 (extra $24) | 20.000+ |
| Enterprise | a medida | a medida | ilimitados | 40.000+ |

  - Los agentes de IA y los workflows están desde Growth. Starter no los lista.
  - Se cobra por contactos activos al mes: $12 por cada 100 extra en Growth y $15 en Advanced.
  - Los créditos de IA extra cuestan $15 por cada 1.000.
  - Los costos de WhatsApp van aparte, a tarifa Meta, y se recargan en la plataforma.
- **Onboarding:** prueba de 7 días sin tarjeta, con nivel Growth, 5 usuarios y 1.000 contactos, sin difusiones.
- **Reseñas ([G2](https://g2.com/products/respond-io/reviews?page=2) y [Capterra](https://capterra.com/p/179311/Rocketbots/reviews/)):** G2 muestra 4,8/5 con 406 reseñas, y Capterra entre 4,6 y 4,7 con unas 52 a 60. Lo que más valoran es la facilidad de uso, el soporte y la configuración rápida. Se quejan del precio por contactos activos al crecer, de integraciones débiles (por ejemplo Magento obliga a pasar por Zapier) y de un caso de caída con reembolso rechazado.
- **No verificado:** capturas y videos del producto, y qué canales o integraciones trae cada plan. La tabla de contactos de la página de precios salió ilegible, así que el límite por plan no está claro.

## (b) Funciones que Onia NO tiene

Ordenadas por impacto en clínicas y pymes bolivianas. El dueño sigue la regla de tu pedido: Codex es código cerrado, Plataforma es producción, migraciones o criterio visual.

| # | Función | Quién la tiene | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|---|
| 1 | **Cobro con QR dentro del chat de WhatsApp** | Lucy | Que el agente mande el QR del BCP o un link de pago con el monto del tratamiento o de la cuota. Hoy el QR solo activa el plan de Onia. | M | Plataforma (toca pagos y producción) |
| 2 | **Factura emitida desde la conversación** | Lucy | Depende de terminar el SIAT, que hoy está apagado. No se nombra en venta hasta entonces. | L | Plataforma |
| 3 | **Recordatorios y difusiones por WhatsApp** | Respond.io (difusiones) y Lucy (promociones y recordatorios) | Plantillas aprobadas por Meta para confirmar, recuperar y avisar cobros. Onia hoy solo manda correo. Ya está en la brecha B06. | M | Codex para la lógica. Plataforma para la conexión del WhatsApp del cliente. |
| 4 | **Bandeja con asignación, estados y encuesta CSAT** | Respond.io | Asignar conversación a recepción o doctor y marcar abierta o cerrada. La encuesta de satisfacción después de cerrar. Onia tiene `/inbox`, pero no verifiqué si asigna o cierra. [NV] | M | Codex |
| 5 | **Reporte por canal, anuncio o agente** | Respond.io | Contar de dónde llega cada paciente (anuncio, orgánico, referido) y el tiempo de respuesta. Sirve para justificar la pauta de la clínica. | S | Codex |
| 6 | **Resultados prometidos y casos con cifras** | Lucy | Solo cuando haya un cliente real con datos. Hoy hay cero. | S | Sergio Urcullo |
| 7 | **Catálogo con fotos y precios compartido en el chat** | Lucy | Útil para comercio e importadora, no para dental. | M | Codex |
| 8 | **Tracking de pedido** | Lucy | Solo para comercio e importadora. Prioridad baja. | L | Plataforma |

El #1 no existe en el catálogo de Onia. En §5 el agente conversacional de WhatsApp está en pausa hasta la prueba real, así que ahí no hay nada que copiar todavía.

## (c) Lo que tienen peor que nosotros (argumentos de venta)

- **Ninguno es un sistema de gestión.** Lucy y Respond.io atienden el chat. Ninguno tiene ficha clínica, odontograma, agenda con profesionales, caja ni contabilidad. Onia es el sistema y el chat se suma como add-on.
- **Lucy no deja probar.** Hay que hablar con un vendedor y esperar de 7 a 14 días de implementación. Onia: te registrás solo y probás 14 días sin tarjeta.
- **Lucy cobra por volumen de venta.** El plan base es de $500 a $990 al mes más un porcentaje por cada venta. Eso se piensa para comercio, no para una clínica con 3 doctores. [NV: moneda y base exacta del porcentaje.]
- **Respond.io está en dólares y por contacto activo.** Starter $79 anual y Growth $159. Los costos de WhatsApp van aparte a tarifa Meta. Los propios usuarios se quejan de que sube al crecer.
- **Los resultados de Lucy no tienen fuente.** Es una demo simulada con cifras "esperadas". Onia no promete cifras.
- **Ninguno tiene el hueco de Onia:** detectar solo al paciente con tratamiento a medias. En la web de Lucy no vi nada equivalente [NV, no revisé todos sus agentes].
- **Cuidado con el contraargumento de Lucy:** sí dice facturar y cobrar con QR dentro del chat, y Onia no puede decir eso hoy. No usar "ningún competidor factura" sin verificar.

## (d) Lo que no conviene copiar

- **Cobro por porcentaje de cada venta (Lucy).** Una clínica no vende por unidades de WhatsApp, y el cargo variable complica la cotización.
- **Implementación a medida, con proyecto de 2 semanas.** Rompe el techo del negocio: las horas de Sergio Urcullo por cliente.
- **Cifras "esperadas" sin cliente real.** Prohibido por la regla de no fabricar.
- **Precio por contacto activo (Respond.io).** Castiga el crecimiento y es lo que más critican.
- **Omnicanalidad completa (TikTok, llamadas VoIP, Messenger).** Para una clínica boliviana, WhatsApp y a lo sumo Instagram bastan. Más canales son más soporte.
- **Una página de venta sobre "ventas perdidas" y "bots tontos".** Es el discurso de comercio, no el de salud. Onia vende el sistema.
- **Atajo para el dueño:** el paquete "Universe" de Lucy mezcla ventas, remarketing y reportes. Copiarlo entero sería abrir otra línea de negocio, y falla las tres preguntas de §10 de `ONIA_ESTRATEGIA_DE_EMPRESA.md`.

**Pendiente mío, no hecho:** no abrí el YouTube de ninguna de las dos, y los G2 y Capterra de Respond.io son datos de búsqueda, no páginas leídas completas. No volví a Lucy Sales ni Logistics para ver sus precios. No escribí nada en el repo.

=== Dentalink (softwaredentalink.com) + Doctocliq (doctocliq.com) ===
**Medido el 2026-10-08.** Dentalink y Doctocliq ya tenían teardown del 2026-10-01 (`research/competencia/DENTALINK_TEARDOWN.md` y `DOCTOCLIQ_TEARDOWN.md`). Ahí están los módulos, el recall y la comparación con Onia, así que no los repetí. Hoy volví a leer las páginas de planes y busqué reseñas.

No pude ver ningún video: en el teardown del 1-oct YouTube bloqueaba esta IP, y hoy no volví a intentarlo. Tampoco creé cuentas ni inicié sesión. Los videos de Dentalink están anotados por ID en su teardown para verlos desde la PC.

## (a) Fichas

**Dentalink / Medilink (Healthatom, Santiago de Chile)** — software dental y médico para Latinoamérica.
- **Planes:** Esencial, Pro y Titanium, en `softwaredentalink.com/planes`.
  - Esencial: agenda, ficha con odontograma y periodontograma, presupuestos, caja, confirmación de citas, agendamiento online y consentimientos.
  - Pro suma convenios, laboratorios, inventario, gastos, pago a odontólogos y reportes.
  - Titanium suma las tareas automáticas de recall, chat interno, estética facial, ortodoncia, campañas por email y encuestas NPS.
- **IA incluida en los tres planes:** notas clínicas, resumen clínico y simulador de sonrisa. Clinical Copilot figura como «Próximamente».
- **Add-ons:** Contact Center (WhatsApp y teléfono con IA), Contralor IA, Reportes IA, telemedicina, firma de documentos y análisis de rayos X.
- **Precio:** no se publica. Solo «Solicita tu cotización».
- **Onboarding:** no hay alta sola. Se coordina una demo o acceso de prueba con ventas.
- **Bolivia:** no aparece en ningún artículo de su centro de ayuda, ni en facturación.
- **Reseñas:** Capterra tiene una ficha con muy pocas valoraciones (2 usuarios, 5.0, una reseña de 2022). No encontré G2.
- **Fuentes:** `softwaredentalink.com/planes`, el teardown del 1-oct (290 artículos de ayuda rastreados) y Capterra `/p/196361/Dentalink/`.

**Doctocliq (Perú, fundada en 2019)** — gestión dental y estética, con alta sola.
- **Precios (USD por mes, por doctor):**

| Plan | USD/mes | Qué trae |
|---|---|---|
| Gratis | 0 | 30 pacientes o citas al mes, sin WhatsApp |
| Individual | 19 | 50 pacientes o citas, 50 recordatorios por WhatsApp |
| Básico | 29 | pacientes ilimitados, 100 recordatorios |
| Avanzado | 49 | caja avanzada, inventario, laboratorio, estadísticas |

  - Todos incluyen 8 usuarios gratis.
  - Los precios incluyen impuestos solo en Perú y México.
  - La página no aclara qué periodo de facturación corresponde al precio mostrado.
  - Se pagan mensual, semestral o anual, con descuento en los plazos largos.
- **Prueba:** 7 días del plan Avanzado, sin tarjeta.
- **Add-ons:** Soyla IA (agente en WhatsApp que agenda) y Marketing, ambos solo con contrato semestral o anual. También facturación electrónica (Perú, México, Colombia y Ecuador) y chat interno.
- **Bolivia:** no figura.
- **Reseñas:** ComparaSoftware muestra 0 opiniones y SoftwareWorld no tiene reseñas aprobadas. Play Store: 3,4 con 46 reseñas, según el teardown. Los testimonios son de su propia web.
- **Sin verificar:** los precios de Dentalink (no publicados) y los de Doctocliq en Bolivia. La página de planes tiene errores internos. Los recordatorios de Avanzado salen como 100 en la tabla y 150 en la lista. La caja del Básico aparece como «básica» en la lista y solo en Avanzado en la tabla.
- **Fuentes:** `doctocliq.com/planes-y-precios`, el teardown del 1-oct y la búsqueda de reseñas (SoftwareWorld, ComparaSoftware).

## (b) Lo que Onia no tiene, por impacto

Dueños: **Codex** = código cerrado. **Plataforma** = producción, migraciones o criterio visual.

| # | Función | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|
| 1 | Recordatorio y confirmación por WhatsApp de un toque | Botones Confirmar y «No podré asistir» que cambian el estado de la cita solo. Doctocliq lo trae en todos los planes de pago, con crédito mensual. Hoy Onia solo manda correo. | M | Plataforma (WhatsApp de un cliente real; depende del chip prepago) |
| 2 | Lista de «canceladas pendientes de recuperar» | Una cita cancelada o con falta pasa a una lista con tarea de seguimiento. Es la tarea «Cita» de Dentalink. Se puede armar con el reprogramador que ya tenemos. | S | Codex |
| 3 | Presupuesto que vende | Presupuesto por fases, estados (aceptado, abandonado, terminado), alternativas e impresión sin montos. Desde el odontograma, como Doctocliq. Los estados abandonado y aceptado alimentan el recall. | M | Codex (lógica y PDF), Plataforma (pantalla) |
| 4 | Agenda por sillón con arrastrar y soltar, y citas en serie | Con 2-6 profesionales comparten sillones. | M | Plataforma (criterio visual) |
| 5 | Comisiones por doctor dentro de caja | Es la cuenta de fin de mes con varios profesionales. Onia ya tiene planilla. | S–M | Codex |
| 6 | Caja de recepción completa | Abonos parciales, cuotas, pago dividido y caja por usuario con cierre. | M | Codex |
| 7 | App móvil del dueño | Ver agenda y caja desde afuera. Las dos apps son débiles: Dentalink tiene 3 calificaciones en iOS y Doctocliq 3,4 con 46 reseñas. Una web responsive bien hecha alcanza. | M | Plataforma |
| 8 | Odontograma más profundo | Periodontograma, ortodoncia, versionado de cambios, denticiones adulto, mixta e infantil. | L | Codex |
| 9 | Dictado de notas por voz | Dentalink lo trae incluido en los tres planes. | M | Codex |
| 10 | Encuestas NPS y reseña de Google | Campañas automáticas con reglas. Va después de WhatsApp. | S | Codex |

Cada función se prueba con el flujo real de una clínica antes de ofrecerla, como pide el catálogo.

## (c) Lo que tienen peor que nosotros (argumentos de venta)

1. **Tratamiento a medias.**
   - Dentalink no lo detecta: sus 4 tareas automáticas no cubren al paciente que vino, hizo parte del tratamiento y no volvió.
   - Doctocliq lo trata como un segmento que alguien arma a mano, dentro de un add-on semestral o anual.
   - Ojo: el detector de Onia existe pero hoy no encuentra a nadie. Solo cuenta tratamientos «En progreso», la ficha los carga «Pendiente», y hay 0 cargados. Está anotado en el handoff de Plataforma. No se vende hasta arreglarlo (catálogo §8).
2. **Entrar sin hablar con nadie.** Onia: alta sola, 14 días sin tarjeta y planes públicos. Dentalink: cotización y demo, sin precio a la vista. Doctocliq: 7 días y precio en USD.
3. **Hecho para Bolivia.** Ninguno factura en Bolivia ni nombra el QR del BCP. La factura SIAT de Onia sigue en certificación, así que todavía no es argumento de venta.
4. **Administración completa en el plan.**
   - Contabilidad, planilla y gastos, más cuatro agentes (tratamiento a medias, confirmador, reprogramador y cobrador).
   - Dentalink se declara «no es software contable».
   - Doctocliq no trae contabilidad ni planilla.
5. **IA de WhatsApp atada a contrato largo.** Soyla y Marketing de Doctocliq exigen semestral o anual. Contact Center de Dentalink es add-on cotizado aparte. Nosotros pondríamos el recordatorio en el plan.
6. **Precio por doctor.** Doctocliq cobra por doctor, y en Perú cada doctor extra cuesta S/ 30. Con 3 doctores Avanzado ya son USD 147 por mes, sin contar add-ons. Solo se puede comparar con el precio de Onia en `subscription-plans.ts`. No escribo cifras de Onia acá.
7. **Reseñas casi inexistentes.** Es débil como prueba de calidad de ellos, pero también para nosotros: no se fabrican.

## (d) Lo que no conviene copiar

- **Plan gratis permanente** (Doctocliq: 30 pacientes o citas al mes). Con 0 clientes pagando y soporte como único techo, regalar soporte quema horas de Sergio Urcullo. La prueba de 14 días ya cumple.
- **Precio por doctor y cobro por mensaje de WhatsApp.** Complica la cuenta y la prueba. El plan por usuarios con 4 en Crece encaja mejor con el cliente ideal.
- **Add-ons de IA solo con contrato semestral.** Frena la primera venta.
- **Facturación para otros países y verificación de DNI contra RENIEC.** Es Perú. Para Bolivia es el SIAT.
- **Bloqueo de cuenta a los 15 días de impago y borrado a los 30** (Dentalink). Choca con la regla de Onia de no borrar nada.
- **Directorio público de pacientes** (Gerty, Dentalink) y **simulador de sonrisa con IA.** Son un negocio o un costo aparte, no gestión de clínica. Fallan el test de tres preguntas del catálogo.
- **Telemedicina y análisis de rayos X con IA.** Son riesgo clínico y regulatorio, y no los pide el cliente ideal.
- **Contact Center que escribe solo por WhatsApp sin aprobación.** Onia propone y el dueño aprueba. Con 0 clientes, ese control es parte de lo que se vende.

**Competidores pedidos por Sergio Urcullo pero no cubiertos:** esta tarea fue solo Dentalink y Doctocliq. Dapta y Sendy ya tienen fichas (`DAPTA_TEARDOWN.md`, `SENDYPRO_TEARDOWN.md`) y los demás tienen las suyas en `research/competencia/`. Hoy no los revisé.

Sources:
- [Doctocliq, planes y precios](https://doctocliq.com/planes-y-precios)
- [Dentalink, planes](https://www.softwaredentalink.com/planes)
- [Capterra, Dentalink](https://www.capterra.com/p/196361/Dentalink/)
- [SoftwareWorld, Doctocliq](https://www.softwareworld.co/software/doctocliq-reviews/)
- [ComparaSoftware, Doctocliq](https://www.comparasoftware.com/doctocliq-es)

Archivos base: `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/DENTALINK_TEARDOWN.md`, `C:/dev/proyectos/onia-hermes/hermes-content/research/competencia/DOCTOCLIQ_TEARDOWN.md` y `C:/dev/proyectos/onia-hermes/hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`.

=== AgendaPro (agendapro.com) + HuliPractice (hulipractice.com) ===
## Alcance y límites de esta pasada

Revisé las fichas internas existentes y verifiqué en vivo con WebFetch y WebSearch.

- **Fichas internas leídas:** `AGENDAPRO_CITALO_TEARDOWN.md` (1-oct), `HULI_FICHA.md` (4-oct), `MAPA_COMPETENCIA.md` y `ONIA_CATALOGO_DE_VENTA.md` (1-oct).
- **Verificado hoy (8-oct):** precios y add-ons de HuliPractice, las reseñas de Capterra y GetApp, y la página dental de AgendaPro.
- **No verificado:**
  - `agendapro.com/cl/planes` y `/cl/precios` devolvieron 404 hoy. Los precios de AgendaPro son los del 1-oct (fuente AP-planes) y no se pudieron reconfirmar.
  - No usé el navegador integrado, así que no vi capturas ni videos nuevos.
  - YouTube bloqueó esta IP en la pasada del 1-oct. Los videos `Hw46jlPf4mU` y `LrsAQlkSUeE` siguen sin mirarse.
  - G2 y Trustpilot no aparecieron en la búsqueda.
- **No pedido por el brief, pero relevante:** los demás competidores nombrados por Sergio Urcullo (Dapta, Sendy y otros) están fuera de este encargo. Ya tienen `DAPTA_TEARDOWN.md` y `SENDYPRO_TEARDOWN.md` en la carpeta de competencia.

## (a) Fichas por competidor

### AgendaPro (Chile, Y Combinator)

**Qué vende:** agenda y caja multirrubro, con reserva online, recordatorios, ficha, reportes, marketing e IA por WhatsApp.

- **Cobertura:** CL, MX, AR, CO, PE, UY, ES y BR. No tiene página de Bolivia. El pago online solo funciona en CL, AR, MX, UY, CO y PE (AP-sitemap y AP-pagofaq, 1-oct). Hoy no encontré mención de Bolivia en las páginas dentales por país.
- **Escala que declara:** más de 135.000 profesionales usuarios (web de AgendaPro, vía búsqueda del 8-oct). El 1-oct decía más de 20.000 negocios.
- **Precios Chile (1-oct, CLP + IVA, no reconfirmados hoy):**

  | Plan | Precio mensual |
  |---|---|
  | Individual | 15.900 |
  | Básico | 34.900 |
  | Premium | 54.900 |
  | Pro | 249.900 |

  - El precio sube con la cantidad de profesionales.
  - El anual regala 2 meses.
  - Capterra lista un precio inicial de USD 19 y prueba gratis.
- **Paquetes de WhatsApp:** desde CLP 5.000/mes por 50 mensajes, unos CLP 100 por mensaje. La plantilla es fija y lleva su logo.
- **IA en WhatsApp:** Julia contesta y agenda. Sofía confirma, reabre la conversación y reagenda. Usan el número del propio negocio vía la API oficial de Meta. El precio de Sofía no está publicado.
- **Recall:** Charly, desde CLP 149.900/mes, solo por email.
- **Ficha clínica:**
  - Página dental, hoy: ficha digital personalizable con archivos e imágenes, órdenes de laboratorio, inventario, CRM, email de fechas especiales y pago online anticipado.
  - Esa página no menciona odontograma, presupuesto de tratamiento ni consentimiento (WebFetch del 8-oct). Pueden existir sin estar en esa página; no está verificado. Lo que sí figura en su ayuda (1-oct) es firma del profesional y consentimiento informado, solo desde Premium.
- **Alta:** un formulario, 7 días gratis, sin demo obligatoria para el plan base.
- **Reseñas, Capterra 4,8/5 con 158 reseñas, actualizado en junio de 2026:**
  - Elogian la agenda y el multiprofesional.
  - Critican que el WhatsApp se compra aparte y que los mensajes incluidos son pocos.
  - Una reseña en Secret (4,7/5 con 19 reseñas) dice que cada función extra cuesta dinero.
- **Fuentes:** [Capterra](https://www.capterra.com/p/218709/AgendaPro/reviews/), [GetApp](https://www.getapp.com/communication-software/a/agendapro/), [Secret](https://www.joinsecret.com/es/agendapro/reviews), [página dental](https://agendapro.com/es/dental/software-odontologico) y las fuentes AP-* de `AGENDAPRO_CITALO_TEARDOWN.md`.

### HuliPractice (Huli, Costa Rica y México)

**Qué vende:** software médico con IA, solo salud. Es la marca de la empresa Huli; el resto de su ecosistema son HuliHealth (directorio), HuliVida (expediente del paciente) y MediCupón.

- **Precios, reconfirmados hoy (MXN + IVA, [hulipractice.com/mx/precios](https://www.hulipractice.com/mx/precios)):**

  | Plan o add-on | Precio |
  |---|---|
  | Expediente clínico | 590/mes, o 7.080/año (sin descuento anual) |
  | Expediente con Notas IA | 991/mes, con 200 notas |
  | Clínica u Hospital | Cotización |
  | Notas IA como add-on | 401/mes por 200 |
  | Bot Asistente de WhatsApp | 240/mes por 30 conversaciones, 8 por cada extra |

  - La página no aclara cómo se relaciona el add-on de 401 con el plan de 991.
  - Clínica u Hospital incluye multi-médico, multi-sede, facturación consolidada, recordatorios por WhatsApp y email, API y métricas.
- **Prueba:** no hay prueba gratis. Hay demo guiada de 10 a 15 minutos y "garantía de reembolso de 30 días" en la promoción vigente. No aparecen medios de pago en la página de precios.
  - La ficha de 4-oct, con el centro de ayuda, dice que el único medio es tarjeta con débito automático.
- **Normativa y factura:** NOM-004 y NOM-024, factura CFDI de México y catálogo CIE-10 (listado de Capterra).
- **Reseñas:** Capterra lista a Huli con 0 reseñas de usuarios y sin prueba gratis ([Capterra](https://www.capterra.com/p/10033749/Huli/)). No hay opinión de usuarios que citar.
- **Pauta:** unos 140 anuncios activos en Meta el 2-oct (`CAPTURAS-HECHAS.md`).
- **Fuentes:** [precios](https://www.hulipractice.com/mx/precios), [Capterra](https://www.capterra.com/p/10033749/Huli/) y `HULI_FICHA.md`.

## (b) Lo que Onia NO tiene, ordenado por impacto en clínicas y pymes bolivianas

**Dueños:** Codex es código cerrado con criterio claro. Plataforma es producción, migraciones o criterio visual.

| # | Función | Quién la tiene | Qué copiar | Esfuerzo | Dueño |
|---|---|---|---|---|---|
| 1 | **Recordatorio por WhatsApp con confirmar, cancelar o reprogramar en un toque.** Onia hoy manda solo correo. | AgendaPro, Huli | Escalera de AgendaPro: correo primero, WhatsApp solo a quien no confirmó, y reagendar desde el mensaje. | L | Plataforma, porque depende del chip prepago y de "Conectar mi WhatsApp" |
| 2 | **Autogestión del paciente con política**: horas mínimas para cambiar y un máximo de cambios. Al liberarse un hueco, aviso a una lista de espera. | AgendaPro; lista de espera manual en Citalo | Política configurable y hueco liberado que vuelve a venderse. | M | Codex para la política y la lista; Plataforma para el link público |
| 3 | **Seña o pago anticipado al reservar.** Onia no tiene pago online del paciente. | AgendaPro, pero no cobra en Bolivia | Seña con QR del BCP, terreno libre en Bolivia. Pasa por la API de QR del BCP, trámite en curso. | M | Plataforma, porque toca plata y producción |
| 4 | **Factura electrónica dentro del sistema.** El SIAT está apagado en producción. | Huli con CFDI, AgendaPro con SII; ninguno en Bolivia | Terminar la certificación y encender la emisión. | L | Plataforma |
| 5 | **Cobro 100% automático** del plan. Hoy Sergio Urcullo aprueba el comprobante a mano. | Huli, con débito automático | El débito por tarjeta no aplica en Bolivia. Copiar solo la idea: que el plan se active sin intervención. | M | Plataforma |
| 6 | **Campañas a la base de pacientes**: cumpleaños, "hay huecos esta semana", difusión. | AgendaPro | Plantillas cortas por segmento, aprobadas por el dueño, igual que los agentes actuales. | M | Codex |
| 7 | **Reportes de ocupación** (horas pico y valle, por profesional, descarga a Excel). | AgendaPro | Reporte único de ocupación por franja. | S | Codex |
| 8 | **Notas clínicas con IA**, dictado a nota. | Huli: 200 notas al mes | Solo si hay demanda real de clínicas. La IA de Onia hoy es el redactor de plantillas; el 2-oct no tenía uso real. | L | Plataforma, por el riesgo de datos clínicos |
| 9 | **Ficha configurable por categorías, y generación desde un PDF**. | AgendaPro, solo desde Premium | Plantillas de ficha por rubro para estética y servicios. Onia dental ya tiene odontograma. | M | Codex |
| 10 | **Directorio de captación de pacientes nuevos.** | Huli (HuliHealth), AgendaPro (marketplace) | No copiar ahora: falla el test de tres preguntas (ver sección d). | L | No aplica |
| 11 | **App móvil nativa.** | AgendaPro | No verificado cuánto la usan las clínicas. Primero medir el uso real de la web móvil. | L | Plataforma |
| 12 | **Add-on de WhatsApp con mínimo bajo y precio por conversación extra.** | Huli: 240 por 30, 8 cada extra | Ya anotado como idea 13 en `MAPA_COMPETENCIA.md`. Define precios Sergio Urcullo, en `pricing.ts`. | S | Plataforma, con decisión de Sergio Urcullo |

Los puntos 1 al 3 son los de mayor impacto: ya salen del top 5 de la pasada del 1-oct y son los que más reducen ausencias.

## (c) Lo que tienen peor que nosotros (argumentos de venta)

- **Bolivia:** AgendaPro no tiene página ni cobro online en el país. Huli solo cobra con tarjeta y no tiene presencia boliviana verificada. Onia usa QR del BCP, precio local y 14 días del plan Profesional sin tarjeta (AgendaPro da 7).
- **Cobrar por separado el WhatsApp:** es la queja que repiten las reseñas de AgendaPro. Los agentes de Onia hoy no cobran por mensaje, aunque el WhatsApp conversacional todavía no está conectado.
- **Recall clínico:** el detector de tratamiento a medias de Onia corre todos los días sin costo extra. Charly de AgendaPro cuesta desde CLP 149.900 y solo manda correo. Huli no tiene recall.
  - Cuidado: el detector hoy no encuentra a nadie (catálogo §8). No se puede vender como funcionando hasta que se corrija en onia-platform.
- **Odontograma:** Onia lo tiene. En la página dental de AgendaPro no aparece (no verificado en su ayuda).
- **Cinco rubros y gestión de fondo:** contabilidad, planilla, gastos, inventario y cinco rubros en un producto. Huli es solo salud. AgendaPro es agenda más caja.
- **Un solo producto:** Huli tiene cuatro marcas en su ecosistema, lo que confunde. Onia es uno.
- **Precio de entrada:** Huli cobra mensual en MXN con IVA y sin prueba. Onia prueba 14 días sin tarjeta.

## (d) Lo que no conviene copiar

- **Pago primero con tarjeta y reembolso (Huli).** Corta el alta en Bolivia, donde la tarjeta internacional no es la norma.
- **Cuatro marcas en un ecosistema (Huli).** Onia es un solo producto.
- **Solo salud (Huli).** Onia vende cinco rubros.
- **Directorio y marketplace de pacientes.** Falla el test de tres preguntas de la estrategia: es otro negocio, no un add-on. Congelado por la regla de no abrir líneas nuevas.
- **Cobrar cada función por separado (AgendaPro).** Es el reclamo más repetido en sus reseñas. Los add-ons de Onia deben ser pocos y claros.
- **Plantillas con el logo del proveedor (AgendaPro).** Contradice el objetivo de que el mensaje salga con la voz del negocio.
- **Prometer "la IA agenda sola".** Ya está vetado en el catálogo §5. Ni Julia ni Sofía son copia aceptable hasta que el agente esté conectado y probado en real.
- **Factura de otro país.** CFDI y SII no sirven; la fiscal de Bolivia es el SIAT.

## Pendientes que dependen de Sergio Urcullo

1. Elegir qué se prioriza del top 3 de (b). Mi recomendación: 1, 2 y 3, en ese orden.
2. Que alguien con la PC mire los videos `Hw46jlPf4mU` y `LrsAQlkSUeE`.
3. Decidir si se hace la pasada con navegador para capturas de producto, o si alcanza con las capturas de `agendapro-citalo/`.

Archivos relevantes, todos en `C:/dev/proyectos/onia-hermes/hermes-content/`:
- `research/competencia/AGENDAPRO_CITALO_TEARDOWN.md`
- `research/competencia/HULI_FICHA.md`
- `research/competencia/MAPA_COMPETENCIA.md`
- `docs/ONIA_CATALOGO_DE_VENTA.md`
