# Onia vs competencia: ¿es vendible y funcional hoy?

Para Sergio Urcullo. 29-sep-2026. Solo lectura y fuentes públicas: no creé ninguna cuenta y no hubo gasto.
Base: las fichas de competidores que trae esta corrida, `docs/ONIA_COMPETENCIA_Y_PAQUETE_20260928.md`, `CONCLUSION.md` §4-5 y el análisis del abogado del diablo.
Marcas: **[V]** verificado en la fuente citada o en el código, **[I]** inferido, **[D]** cuenta propia hecha sobre esos datos.
Producción = `origin/master` c3b92067. **SIN PUBLICAR** = está en el candidato (cef98232/6656e76c) y no en producción.

---

## 1. Veredicto (6 líneas)

1. **Funcional:** sí como sistema de gestión dental con agenda, ficha, odontograma, caja y reserva pública [V prod]. No como "recuperador de pacientes": el Recall, el Plan de tratamiento y el panel "Lo que te dejó Onia" están **SIN PUBLICAR**.
2. **Vendible hoy:** a lo sumo **una clínica piloto medida**, no venta abierta. La demo promete cosas que producción no entrega, y el copy dice "con IA" cuando el bot sigue un guion sin LLM (`lib/chatbot/guion-pasos.ts`).
3. **A quién sí:** clínica dental de SCZ con 2-6 profesionales que hoy usa Excel + WhatsApp o W-Odonto, que valora el precio en Bs, el QR del BCP, el soporte presencial y un precio por negocio y no por usuario.
4. **A quién no:** a quien ya usa Doctocliq (USD 29-49 con periodontograma y bot que agenda) o Dentalink (Contact Center IA). Tampoco a estética: no hay bonos, cabinas ni fotos de antes/después.
5. **Hueco de mercado real [V]:** ninguno de los verticales dentales revisados opera en Bolivia con precio en Bs, soporte local o SIAT (Dentalink, Doctocliq, DENTIDESK, Odontosys, Clinic Cloud). Ese hueco es de Onia, pero hay que llenarlo con producto publicado.
6. **Orden:** publicar la historia de la demo, probar un número real de WhatsApp, arreglar la UI de las 4 pantallas de la demo y corregir el copy "con IA". Recién después se vende a más de una clínica.

---

## 2. Matriz funcional

Columnas: Onia y los 7 más relevantes para una clínica dental de SCZ.
✔ = sí · parcial = con límites (se aclaran en la nota) · ✘ = no · ? = no verificado.
Cada celda lleva su código de fuente; las URL completas están en la tabla del final de esta sección.

| Capacidad | Onia | Dentalink | Doctocliq | AgendaPro | Kommo | Xmart Cloud | Rimay | W-Odonto |
|---|---|---|---|---|---|---|---|---|
| Precio público | ✔ Bs 320-1.290 [O1] | ✘ por demo; ~USD 29/usuario según Capterra [DL1][DL6] | ✔ USD 0/19/29/49 [DC1] | ✔ USD 9-199 [AP1] | ✔ USD 25-45/usuario, 6 meses mín. [KO1] | ✔ USD 34,99 + add-ons [XM1] | ✔ Bs 290/590 [RI1] | ✔ USD 100 pago único (precios 2019) [WO1] |
| Precio en Bs / cobro local | ✔ Bs + QR del BCP [O1][O9] | ✘ [DL5] | ✘ USD [DC1] | ✘ USD [AP1] | ✘ USD con tarjeta [KO1] | parcial: USD con extras en Bs [XM1] | ✔ Bs [RI1] | ✘ USD [WO1] |
| Ficha clínica + odontograma | ✔ odontograma FDI [O2] | ✔ [DL2] | ✔ [DC1] | parcial: ficha desde Premium, sin odontograma [AP1] | ✘ [KO1] | ✘ [XM1] | ✘ [RI1] | ✔ [WO1] |
| Periodontograma / ortodoncia / radiografías | ✘ (grep sin resultados en el candidato) [O2] | ✔ [DL2] | ✔ perio y orto; imágenes ? [DC1] | ✘ [AP1] | ✘ | ✘ | ✘ | parcial: radiografías sí [WO1] |
| Agenda online (el paciente reserva solo) | ✔ `/book/<org>` [O3] | ✔ [DL2] | ✔ [DC1] | ✔ [AP1] | parcial: vía Google Calendar [KO2] | ✔ módulo Agenda [XM1] | ✘ [RI1] | ✘ [WO1] |
| Recordatorio automático por WhatsApp | parcial: sale del número de ONIA y el Confirmador pide aprobación humana [O4] | ✔ 1-3 días antes, con botones que actualizan la agenda [DL3] | ✔ con cupo 50-150/mes [DC1] | parcial: add-on desde USD 7 [AP1] | parcial: por workflows [KO1] | ✔ [XM1] | ✘ [RI1] | ✘ [WO1] |
| Bot que agenda dentro del chat | ✘ manda el link `/book`; el bot sigue un guion sin LLM [O5] | ✔ Contact Center IA [DL4] | ✔ Soyla IA (add-on) [DC2] | ✔ Julia [AP2] | ✔ AI booking agent [KO2] | parcial: bot + Agenda, sin LLM declarado [XM1] | ✘ bot sin agenda [RI1] | ✘ |
| Reactivar tratamientos a medias | parcial: agente que redacta el mensaje y el dueño aprueba, **SIN PUBLICAR** [O6] | parcial: avisa al PERSONAL, no al paciente [DL7] | parcial: campañas de reactivación [DC3] | parcial: Charly + Julia reactiva chats [AP1][AP2] | ✘ solo broadcast [KO1] | ✘ [XM1] | ✘ [RI1] | ✘ |
| Caja / cobros / inventario | ✔ [O7] | ✔ [DL2] | ✔ inventario solo en Avanzado [DC1] | ✔ [AP1] | ✘ [KO1] | ✔ QR Simple + POS [XM1] | parcial: cobros QR, sin inventario [RI1] | parcial: cuentas por cobrar [WO1] |
| Factura SIAT | ✘ flag `SIAT_EMISSION` apagado [O8] | ✘ [DL5] | ✘ Bolivia fuera de la lista [DC1] | ✘ "Próximamente" [AP1] | ✘ | ✔ [XM2] | parcial: lo afirma el sitio, sin verificar [RI1] | ✘ [WO1] |
| App móvil | parcial: PWA instalable; push no probado en teléfonos [O9] | ✔ complementaria [DL6] | ✔ complementaria, "se congela" [DC4] | ✔ con quejas de lentitud [AP3] | ? [KO1] | ✘ [XM1] | ✘ [RI1] | ✘ escritorio [WO1] |
| Soporte presencial en SCZ | ✔ Sergio Urcullo [O9] | ✘ [DL5] | ✘ [DC1] | ✘ [AP4] | parcial: partner Magnet +591 [KO3] | parcial: boliviano, sede no verificada [XM1] | parcial: sede La Paz [RI1] | ✔ SCZ [WO1] |
| Prueba gratis en autoservicio | ✔ 14 días en `/register` [O10] | ✘ solo demo [DL1] | ✔ plan gratis de 30 pacientes [DC1] | ✔ "Prueba Gratis" [AP1] | ✔ 14 días [KO1] | ? | ✔ 14 días sin tarjeta [RI1] | ✘ |
| Panel de resultados / ROI | parcial: "Lo que te dejó Onia" **SIN PUBLICAR**, solo datos de prueba [O6] | parcial: 50+ reportes; Reportes IA "Próximamente" [DL2] | parcial: embudo + ingresos [DC1] | parcial: reportes de campañas [AP1] | parcial: pipeline [KO1] | ✘ [XM1] | parcial: CSAT/SLA [RI1] | ✘ |
| Clientes / prueba social | ✘ 0 pagando [O9] | ✔ 15.000+ clientes (Healthatom) [ML1] | parcial: "20+ países" [DC1] | ✔ 30.000+ negocios [AP1] | parcial: Trustpilot 1,9 [KO4] | ? | parcial: logos grandes no verificados [RI1] | parcial: vendido en 6 países [WO1] |

**Fuentes de la matriz**

| Código | Fuente |
|---|---|
| O1 | `onia-platform-v1-integracion-20260927/lib/subscription-plans.ts` (DEFAULT_PLAN_AMOUNTS) y `lib/pricing.ts` |
| O2 | `app/(dashboard)/patients/[id]/odontogram/page.tsx`, `lib/dental/fdi.ts` (en origin/master) |
| O3 | `app/(public)/book/[orgSlug]` (en origin/master) |
| O4 | `lib/whatsapp.ts` sendAppointmentReminder (master); `lib/whatsapp/plantilla-recordatorio.ts` (solo candidato) |
| O5 | `lib/chatbot/guion-pasos.ts`; handoff `codex-continuar-1.0.md` (punto 7, post-1.0) |
| O6 | `lib/resultados/lo-que-te-dejo.ts`, `atribucion.ts`; Recall en el candidato cef98232/6656e76c |
| O7 | `lib/cobros.ts`; rutas de comercio e `/inventory` (en origin/master) |
| O8 | `lib/fiscal/flags.ts` |
| O9 | `public/manifest.json`; memorias `cuentas-plataforma-todas-de-prueba.md` y `decisiones-sergio-25-sep-qr-icono-destrabe.md` |
| O10 | `ONIA_ALTA_AUTOMATICA=abierta`; `app.onia.com.bo/register` |
| DL1 | https://www.softwaredentalink.com/b/planes |
| DL2 | https://www.softwaredentalink.com/funcionalidades |
| DL3 | https://ayuda.softwaredentalink.com/es/articles/9493201-notificaciones-automaticas-por-whatsapp |
| DL4 | https://www.softwaredentalink.com/inteligencia-artificial/contact-center |
| DL5 | https://www.softwaredentalink.com/soporte |
| DL6 | https://www.capterra.com/p/196361/Dentalink/ |
| DL7 | https://www.softwaredentalink.com/co/aumenta-tus-ingresos/tareas-automaticas-de-captura |
| ML1 | https://www.softwaremedilink.com/planes |
| DC1 | https://doctocliq.com/planes-y-precios |
| DC2 | https://www.doctocliq.com/soyla-ia |
| DC3 | https://www.doctocliq.com/ |
| DC4 | https://apps.apple.com/pe/app/doctocliq/id1445399223 |
| AP1 | https://agendapro.com/es/planes |
| AP2 | https://agendapro.com/blog/ia-en-agendapro/ |
| AP3 | https://www.capterra.com/p/218709/AgendaPro/reviews/ |
| AP4 | https://agendapro.com/en (agendapro.cl/bo redirige con 301 a /cl: corrige el doc del 28-sep) |
| KO1 | https://www.kommo.com/pricing/ |
| KO2 | https://www.kommo.com/ai/ai-booking-agent/ |
| KO3 | https://magnetagencia.com/kommo-crm-partner/ |
| KO4 | https://www.trustpilot.com/review/kommo.com |
| XM1 | https://xmart.cloud/pricing/bot |
| XM2 | https://xmart.cloud/pricing/invoice |
| RI1 | https://rimay.tech/ (todo lo que dice el sitio queda como afirmación de marketing) |
| WO1 | https://www.wakosoft.com/wodonto_version_basica.html (certificado HTTPS vencido) |

---

## 3. UX: cómo se ven y se usan los mejores, y qué copiarles

Se copia el **patrón**, nunca la identidad. La base visual de Onia (verde/tinta, Archivo, etiquetas mono, sidebar agrupado) ya es propia y se mantiene.

| Patrón | Quién lo hace bien | Qué copiar en Onia |
|---|---|---|
| **Precio en 4 tarjetas + tabla ordenada por trabajo** | AgendaPro: tabla en Capta / Gestiona / Retiene y selector de profesionales [AP1] | Ordenar la tabla de planes por lo que le pasa al dueño ("Atender / Cobrar / Recuperar"), no por módulo. |
| **Un solo precio, "todo incluido"** | Booksy: USD 29,99 con todo adentro [https://biz.booksy.com/pricing] | Mostrar el **total del mes con Meta estimado en Bs** en la tarjeta. Hoy el costo de Meta aparece recién después, y esa es la queja número uno en LatAm (AgendaPro en Capterra, CONCLUSION §5). |
| **El recordatorio es la acción** | Dentalink: el paciente confirma o anula con un botón y la agenda cambia sola [DL3] | Recordatorio de cita **automático y sin aprobación**, con botones Confirmo / Reprogramar. La aprobación queda solo para la reactivación. |
| **Crear el agente describiéndolo** | Respond.io: plantilla "receptionist" y un Copilot que arma el agente desde una descripción [https://respond.io/ai-agents] | En `/settings/chatbot`: "Contanos tu clínica en 3 frases" para autocompletar el conocimiento, en vez de un formulario largo. |
| **Onboarding por rubro en minutos** | Lety: rubro, brief y agente listo [https://www.lety.ai/] | Que el onboarding de 5 pasos termine con **un agente ya propuesto en Pendientes**, para que el primer "aprobar" pase el día 1. |
| **Plantillas de un clic** | Manychat: 60+ plantillas [https://manychat.com/pricing] | 3-4 mensajes de Recall prearmados por tratamiento (endodoncia, ortodoncia, implante), en vez de texto libre. |
| **Mobile-first de verdad** | Booksy Biz: el teléfono es la interfaz principal [https://www.capterra.com/p/142741/Booksy/reviews/] | Pendientes en 375 px como bandeja de tarjetas de un toque (Aprobar / Editar / Descartar), sin la barra flotante encima. |

**Antipatrones que no hay que repetir**
- **Dentalink:** la configuración está enterrada (Administración > Configuraciones especiales > Agenda > Notificaciones) [https://ayuda.softwaredentalink.com/es/articles/9493282].
- **HighLevel:** el sidebar es interminable (CONCLUSION §4).
- **Fresha:** la lluvia de add-ons por miembro hace imposible calcular el total [https://www.fresha.com/es/pricing].

**Onia hoy, mirado en las capturas** (`revision-1.0/*.png`, `pulido-final/*.png`):
1. La barra "Preguntá por tu negocio" y el botón + **tapan contenido**: el texto de la propuesta en Pendientes a 375 px y el botón "Conectar mi WhatsApp" a 1280 px.
2. **Párrafos de 3-4 líneas** por tarjeta de agente y avisos de Meta larguísimos. La regla es un titular, un número y una acción; el porqué va detrás de "Ver por qué".
3. **Hora cruda** ("29/9/2026, 1:26:51 a. m."). Tiene que decir "hoy 01:26" o "hace 2 h".
4. **Escritorio vacío:** columnas a medio llenar y "No hay citas programadas" sin una acción al lado. Todo estado vacío tiene que ofrecer un botón ("Cargá tu primera cita" / "Importá tu Excel").
5. **Lo que ya funciona:** "El agente propone, vos decidís", los números grandes en "Lo que te dejó Onia", el vocabulario por rubro y la barra inferior de 6 pestañas.

---

## 4. Dónde gana Onia (demostrable en una demo de 15 min)

Solo lo que es **verdad hoy** o lo que se marca como SIN PUBLICAR. Sin publicar, el guion pierde los minutos 6-11.

| Min | Qué se muestra | Por qué gana | Estado |
|---|---|---|---|
| 0-2 | La tarjeta de precio en Bs, el QR del BCP y "un precio por clínica, no por usuario" | Dentalink se cotiza por demo y cobra por usuario [DL1][DL6]; Doctocliq y AgendaPro cobran en USD [DC1][AP1] | [V] prod |
| 2-4 | El alta en 2 pasos con el rubro dental y el vocabulario "Pacientes / Clínica" | Autoservicio de 14 días; Dentalink no tiene [DL1] | [V] prod |
| 4-6 | Ficha, odontograma FDI y reserva pública `/book` desde el celular del prospecto | Paridad con los grandes, en voseo y con soporte en SCZ | [V] prod |
| 6-9 | El Recall: "Juan dejó la endodoncia hace 24 días; mensaje listo, ¿lo mandás?" | Dentalink solo le avisa al personal [DL7]; Onia redacta el mensaje y el dueño aprueba | **SIN PUBLICAR** |
| 9-11 | "Lo que te dejó Onia": pacientes que volvieron y Bs cobrados | Nadie del grupo dental muestra la plata recuperada atribuida al agente [DL2][DC1] | **SIN PUBLICAR** |
| 11-13 | Caja del día y cobro | Todo en una cuenta: Kommo o Xmart obligan a sumar otras herramientas [KO1][XM1] | [V] prod |
| 13-15 | Cierre: "un tratamiento recuperado al mes paga Onia" y una propuesta de piloto medido a 30 días | Sin clientes no hay caso: se ofrece medirlo juntos | honesto |

**No se muestra en la demo:** el bot contestando una pregunta libre (deriva a una persona), la factura SIAT ni estética.

---

## 5. Los 10 huecos más caros para vender

El esfuerzo es **[I]** y está calculado para una persona con agentes. **1.0.1** = rediseño y publicación de lo que ya existe; **1.1** = producto nuevo.

| # | Hueco | Esfuerzo [I] | Entra en |
|---|---|---|---|
| 1 | El Recall, el Plan de tratamiento y "Lo que te dejó Onia" están SIN PUBLICAR: se demuestra algo que no se entrega | 1-2 días: swap con 3 migraciones aditivas + `ONIA_WHATSAPP_INBOX_ID=5` + verificación mirando | **1.0.1** |
| 2 | El copy dice "con IA" y el bot sigue un guion (riesgo de veracidad) | 2 h: barrido de `pricing.ts`, la web y los materiales | **1.0.1** |
| 3 | UI de la demo: la barra flotante tapa contenido, texto largo, hora cruda, estados vacíos sin acción | 2-3 días en 4 pantallas (Pendientes, Agentes, Chatbot, Dashboard) a 375/1024/1280 | **1.0.1** |
| 4 | WhatsApp con el número del cliente sin probar de punta a punta (coexistencia con el celular, pago de Meta con tarjeta boliviana) | 1 día de prueba real; depende de Sergio Urcullo y de una clínica | **1.0.1** (bloqueante) |
| 5 | El recordatorio de cita pide aprobación humana y sale del número de ONIA | 2-3 días: plantilla con botones en la WABA del cliente, envío automático y actualización de la agenda | **1.0.1** |
| 6 | Costo total real opaco: Meta aparte y en USD | 1 día: mostrar el total estimado en Bs en la tarjeta y en el checkout. El techo de Meta en Bs sigue siendo decisión de Sergio Urcullo | **1.0.1** (el mostrarlo) / 1.1 (el techo) |
| 7 | Sin LLM fuera del guion y sin agendar dentro del chat | 1-2 semanas: LLM con evals de voseo y precios del catálogo; después, la acción de agendar | **1.1** |
| 8 | Ficha dental sin periodontograma, ortodoncia ni radiografías | 1-2 semanas | **1.1** |
| 9 | SIAT no emite; la Fase 2 hay que pedirla antes del 04-nov-2026 | Trámite + homologación; el código ya existe detrás del flag | **1.1** (con fecha dura) |
| 10 | 0 clientes, 0 reseñas; el soporte es una sola persona y "la configuración la hace Onia" no está definida ni cobrada | 1 piloto medido + lista cerrada de configuración con tope de horas | **1.0.1** (definirlo) / 1.1 (escalarlo) |

**La 1.1 hacia dónde:** pasar de "sistema con agentes que proponen" a **"el sistema que te devuelve pacientes, medido en Bs"**: LLM honesto, agenda dentro del chat, ficha dental completa y SIAT emitiendo. Solo dental hasta tener 5 clínicas pagando (estrategia vigente: no abrir rubros).

---

## 6. Qué probar vos de primera mano

Esto lo hacés vos: yo no puedo crear cuentas. Creá cada cuenta con un correo de prueba y dejala abierta en el grupo de pestañas **"Claude"** de tu Chrome. Así después puedo **mirar** (solo lectura) lo que quedó abierto. **No cargues una tarjeta en ninguna.**

| Orden | Competidor | Cómo se entra | URL | Qué mirar (con cronómetro) |
|---|---|---|---|---|
| 1 | **Doctocliq** | Plan Gratis (30 pacientes/mes) | https://doctocliq.com/planes-y-precios | Minutos hasta la primera cita; cómo se ve el odontograma y el periodontograma; si Soyla aparece y con qué precio; la app en el celular |
| 2 | **AgendaPro** | "Prueba Gratis" en cada plan | https://agendapro.com/es/planes | Cómo te vende Julia dentro del producto; cuánto cuesta el WhatsApp; si deja elegir Bolivia al registrarte; la app de negocio |
| 3 | **Dentalink** | Solo demo con ventas | https://www.softwaredentalink.com/b/planes | Pedí la demo como clínica de SCZ: qué precio te dan en USD por usuario, si venden en Bolivia y si el Contact Center IA agenda en español rioplatense/boliviano |
| 4 | **Rimay** | 14 días sin tarjeta | https://rimay.tech/ | Es el rival local del add-on de Bs 390: si la "Facturación SIAT integrada" existe de verdad y cuánto tarda en conectar WhatsApp |
| 5 | **Respond.io** | 7 días sin tarjeta | https://respond.io/pricing | El patrón a copiar: crear un agente "receptionist" describiéndolo en una frase |
| 6 | **Kommo** | 14 días | https://www.kommo.com/pricing/ | Cómo agenda el AI booking agent; qué tan densa se siente la interfaz para una recepcionista |
| 7 | **DENTIDESK** | 15 días gratis | https://www.dentidesk.com/ | Solo la ficha: nomenclaturas de odontograma y especialidades (orto, perio, endo) como referencia para el hueco 8 |
| 8 | **Fresha** (opcional) | 7 días; muestra precios en BOB | https://www.fresha.com/es/pricing | Solo para estética: cómo resuelve bonos y paquetes. No compite en dental |

**Qué anotar en cada una (lo mismo para todas):**
1. Minutos desde el registro hasta la primera cita cargada.
2. Cuántos clics hay hasta el recordatorio por WhatsApp.
3. Qué te pide para conectar WhatsApp (Meta, tarjeta, número).
4. El total real del mes para 4 profesionales.
5. Una captura del celular a 375 px de la pantalla principal.

Con eso rehago la matriz con datos de primera mano y comparamos las mismas 5 cosas contra Onia.
