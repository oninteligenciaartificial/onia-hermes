# Onia frente a los referentes: qué le falta al producto entero, medido

Sistema de gestión dental (agenda, ficha, cobros, WhatsApp, reserva online) y chatbot add-on, contra Doctocliq,
Dentalink/Medilink, AgendaPro, Citalo, TuDoc, Dapta, Sendy y Lety.

**Encargos de Sergio Urcullo:** «que quedemos al nivel de Lety o Dapta» (31-ago, el chatbot) y «terminá de mirar
Dapta y todo lo que le falta a Onia Platform» (2-oct, el producto entero). Este documento lo traduce a capacidades
nombrables, dice cuáles ya están (con archivo y línea) y cuáles no, ordenadas por cercanía a vender.

> Fuente de verdad del tema, sin fecha en el nombre: se **EDITA**, no se reemplaza por una copia nueva. Precios:
> `onia-platform/lib/subscription-plans.ts` (planes) y `lib/pricing.ts` (add-ons); acá no se escribe ni un número
> de precio. El resumen corto es `research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` y apunta acá. Dapta por
> dentro: `research/competencia/DAPTA_COMO_FUNCIONA.md`.

---

## Estado 2026-10-02

**Cómo se midió.** Contra el código, no contra los docs: `onia-platform` `origin/master` `75982ba8` (contiene
`af2ded5c`, publicado hoy), el motor del bot en `onia-hermes` `origin/main` y las ramas sin publicar de los dos
repos. Competencia: los teardowns de `research/competencia/` y las cuentas de prueba de Doctocliq y Dapta. Cada
brecha la contrastó un verificador contra el código; donde corrigió, manda su versión. No se tocó producción, la
base ni el VPS: lo que depende de producción lo dice la fila.

**Cuenta:** 76 brechas confirmadas: **23 P0**, **23 P1** y **30 P2**. B43 se refutó (ver «Lo que se creyó que
faltaba y ya está»). B37, B38 y B41 bajaron de P1 a P2 en la verificación; el motivo está en su fila.

- **P0:** sin esto no se le vende a una clínica de 2-6 profesionales, o se rompe con el primer cliente.
- **P1:** la clínica lo nota en la prueba, pero se puede vender sin esto.
- **P2:** suma después del quinto cliente, o lo pide un tipo de clínica que no es el de entrada.

**Cómo leer la evidencia.** Rutas de Onia: relativas a `onia-platform` en `origin/master`, con `(d)/` =
`app/(dashboard)/`. «Bot» = `hermes-content/deploy/vps-ops/bot/` en `origin/main`. «Hermes» = el repo
`onia-hermes`: sus rutas `docs/`, `deploy/` e `infra/` están dentro de `hermes-content/`, y `web-factory/` en la raíz.
«Auditoría» = `docs/research/ONIA_AUDITORIA_20261002.md` y «handoff nube» = `docs/handoff/onia-1.0-nube.md`.
Competencia, en `research/competencia/`: «Doctocliq adentro» = `doctocliq/cuenta-de-prueba/DOCTOCLIQ_ADENTRO.md`,
«Doctocliq» = `DOCTOCLIQ_TEARDOWN.md`, «Dentalink» = `DENTALINK_TEARDOWN.md`, «AgendaPro/Citalo» =
`AGENDAPRO_CITALO_TEARDOWN.md`, «TuDoc» = `TUDOC_TEARDOWN.md`, «Dapta» = `DAPTA_COMO_FUNCIONA.md`, «Sendy» =
`SENDYPRO_TEARDOWN.md` y «Sendy brechas» = `SENDYPRO_BRECHAS_CHATBOT.md`. `:NN` es la línea y «cap. NN» la captura.

**En una línea:** para vender pesan la agenda que usa recepción (B01, B02, B04, B05), el WhatsApp que confirma solo
(B06 a B11), la ficha que el dentista toca en la demo (B12, B13, B14) y la caja (B17). Para no romper el primer
cliente pesan B20 a B22: la factura prometida, los respaldos y los datos expuestos.

### P0

| Id | Qué falta | Quién lo tiene | Cómo está Onia hoy | Evidencia | Esfuerzo |
|---|---|---|---|---|---|
| B01 | Vista de día y semana con una columna por profesional o sillón (grilla por hora, huecos a la vista), y filtro por profesional | Doctocliq («Detallado por doctor», «Diaria por consultorio»), Dentalink («Diaria global» por sillón). NativeCode muestra la semana de un profesional elegido | **No existe.** `/appointments` es un mes con la lista del día en un panel; `/agenda` es la lista de hoy. El mes no se filtra por profesional | Onia: `(d)/appointments/AgendaClient.tsx:187-190, 644-675`; `(d)/agenda/AgendaClient.tsx`; 0 resultados de vista semana o día en master y ramas. Competencia: Doctocliq adentro :32 (cap. 07, 09); Dentalink :67 y `dentalink/menu-crm.jpg`; `anuncios/nativecode/1788651168932693-2.png` | Mediano: grilla sobre las mismas citas y horarios, sin migración |
| B02 | Marcar confirmó, vino o no vino en 1 clic desde la agenda de hoy | Doctocliq (popover), Dentalink (estado en la fila), NativeCode («Control de estado») | **Parcial.** Los botones Confirmar, Completada y No asistió existen en `/appointments`; desde Hoy son 3 pasos (link, tocar el día, tocar el botón) | Onia: `(d)/agenda/AgendaClient.tsx:178-227, 304`; `(d)/appointments/AgendaClient.tsx:153, 462-484, 879-910`. Competencia: Doctocliq adentro :34 (cap. 06); `dentalink/menu-crm.jpg`; `anuncios/nativecode/1401049335530050-2.png` | Chico: reusar `cambiarEstado` y las reglas `ofreceConfirmar`, `ofreceCompletada` y `ofreceNoAsistio` en cada fila |
| B03 | Al reprogramar, la cita nueva vuelve a PENDIENTE y recupera sus recordatorios | Doctocliq (la original queda «Reprogramada», la nueva «Pendiente») | **Parcial.** El PATCH mueve la cita pero no limpia `reminder24hSentAt`, `reminder2hSentAt`, `whatsapp*SentAt` ni `confirmToken`, y conserva CONFIRMADA. Falla cuando el recordatorio ya salió: el típico «recibió el de 24 h y pidió cambiar». El aviso del cambio al paciente es solo por correo | Onia: `app/api/appointments/[id]/route.ts:86-99`; `app/api/cron/appointment-reminders/route.ts:100-106, 552-568`; `lib/agenda/aviso-de-cambio-de-cita.ts:104, 146`. Competencia: Doctocliq adentro :141 (cap. 71-72) | Chico: al cambiar la fecha, limpiar las marcas y volver a PENDIENTE, con un test |
| B04 | Feriados, vacaciones y bloqueos por profesional que respeten la agenda y la reserva online | AgendaPro (bloqueos por profesional y recurso), NativeCode (Agenda › Bloqueos, «Día Libre») | **No existe.** La columna `holidays` existe y la API la acepta, pero ninguna pantalla la escribe y ningún cálculo de turnos la lee: un feriado sale libre en `/book`. Lo único parecido es apagar un día de la semana a un profesional, para todas las semanas | Onia: `prisma/schema.prisma:1202-1230`; `app/api/clinic-settings/route.ts:14, 67`; `app/api/booking/slots/route.ts:61-71`; `app/api/appointments/availability/route.ts:104-114`. Competencia: AgendaPro/Citalo :23, :37; `anuncios/nativecode/1401049335530050-2.png` y `1788651168932693-2.png` | Chico para feriados (pantalla y lectura en los dos calculadores); mediano con bloqueos por profesional |
| B05 | Que la reserva online avise: campana, push y tiempo real a la clínica, y confirmación al paciente | Dentalink (entra «no validada» y recepción la valida; correo al agendar), Doctocliq (correo al agendar), AgendaPro y Citalo (confirmación inmediata) | **No existe el aviso.** La cita queda PENDIENTE pero aparece solo al recargar: sin campana, push ni `publicarCita`. El paciente recibe correo solo si dejó uno (es opcional); si cierra la pestaña pierde el link a «Mis citas» | Onia: `app/api/booking/appointments/route.ts:1-13, 186, 295-373`; `app/(public)/book/[orgSlug]/page.tsx:290-296`; el alta del panel sí avisa: `lib/agenda/crear-cita.ts:131-134, 236-280`. Competencia: Dentalink :70, :77 y `dentalink/agenda-online.jpg`; Doctocliq adentro :56 (cap. 11); AgendaPro/Citalo :66, :73 | Chico: exportar o adaptar `avisarCitaCreada` (hoy privada) y llamar a `publicarCita` |
| B06 | Recordatorio por WhatsApp con botones que funcione de fábrica, sin que la clínica conecte su número ni compre el add-on | Doctocliq (encendido en la prueba, sale de su número), Citalo (WABA integrada); Dentalink (add-on cobrado por mensaje) | **En obra.** Publicado en `release-8f07e537` pero inerte: sale solo del número propio de la clínica (DG-054), solo con el plan Completo o Empresa o con el add-on, y con la plantilla aprobada en su WABA. 0 números de clientes conectados; la prueba con el chip («Clínica Sergio») está en curso. Aunque salga bien, Básico, Crece y Profesional siguen sin WhatsApp salvo que compren el add-on | Onia: `lib/whatsapp/plantilla-recordatorio.ts:1-140`; `app/api/cron/appointment-reminders/route.ts:398-482`; `lib/whatsapp.ts:54-83`; `lib/plan-catalogo.ts:129, 145`; handoff nube §2, §6. Competencia: Doctocliq adentro :49-51; AgendaPro/Citalo :25, :48; Dentalink :70. De 18 anuncios de `anuncios/`, 8 hablan de confirmación o recordatorio y 4 nombran WhatsApp | Mediano para cerrar el camino actual (chip, plantilla y primer envío real). La brecha de fondo la decide Sergio Urcullo: DG-054 y el permiso por plan (B09, B40) |
| B07 | Desplegar el arreglo del bot para que tocar un botón del recordatorio dé una sola respuesta | Precondición de B06 (en Doctocliq y Dentalink el botón cambia el estado) | **En obra.** El arreglo está en `origin/main` (`2f85bdd2`, `ffb65f75`) sin desplegar: `deploy-bot.sh` se niega por 11 tests rojos de la pauta (`363dcf10`, espera la firma de Sergio Urcullo). Sin desplegar, el toque recibe dos respuestas y el bot queda callado en esa conversación. Hoy no le pasa a nadie (0 números conectados); urge el día que se conecte el chip | Bot: `chatwoot-adapter.mjs:503-560`; `deploy-bot.sh:44-48`. Hermes: handoff nube §3, §5, §7.0b; auditoría :109. Competencia: Doctocliq :35, :114; Dentalink :70-71 | Chico: firmar `363dcf10` o sacarlo del deploy. Antes, confirmar en Linux que otros 17 fallos son solo de Windows |
| B08 | Botón «Enviar por WhatsApp» en cada cita, con el recordatorio y el link para confirmar ya armados (wa.me) | Doctocliq («Enviar WhatsApp manual»), Dentalink (WhatsApp Web con mensaje y link), AgendaPro (manual gratis desde la cita) | **Parcial.** En la cita solo está el botón de correo. Hay wa.me sin texto en la ficha y wa.me con texto en `/pending`, pero solo para el Confirmador (Crece o más, citas PENDIENTE de mañana) y sin link de confirmación. El `confirmToken` se genera solo en el endpoint de correo, después del corte «sin correo, 422» | Onia: `(d)/appointments/AgendaClient.tsx:439-453, 817-846`; `(d)/patients/[id]/FichaVista.tsx:629-640`; `lib/onia-core/modules/agents-logic.ts:777-897`; `lib/onia-core/dispatch/channels.ts:137-176`; `app/api/email/appointment-reminder/[id]/route.ts:66-80`; `lib/email.ts:578-580`. Competencia: Doctocliq adentro :34-35; Dentalink :70; AgendaPro/Citalo :25 | Chico: sacar el token a un helper y armar el wa.me en cada cita, en cualquier plan. Es el único WhatsApp que anda hoy sin Meta |
| B09 | WhatsApp automático al paciente dentro de la prueba de 14 días | Doctocliq (recordatorio activo de fábrica, saldo de regalo, sin conectar número). Citalo no: no da prueba de 14 días y su cupo depende del plan | **Parcial.** La prueba es Profesional, que no trae WhatsApp: conectar el número da 403 sin el add-on, y el envío sale solo del número propio. Sí trae el correo automático de 24 h y 2 h y el Confirmador, que el dueño manda a mano por wa.me | Onia: `lib/subscription/plan-state.ts:29`; `lib/plan-catalogo.ts:112-113, 129`; `app/api/chatbot-canal-whatsapp/route.ts:156-161`; `app/api/cron/appointment-reminders/route.ts:46, 209, 349-354`. Competencia: Doctocliq adentro :49-53, :140; AgendaPro/Citalo :10, :48 | No es chico: cambiar el permiso no alcanza. O se conecta el número en la prueba (trabado por B10 y B11) o se manda desde un número de Onia (B40; Meta cobra cada mensaje desde el 1-oct). Lo decide Sergio Urcullo |
| B10 | Coexistencia real con la app WhatsApp Business al conectar el número | Dapta; AgendaPro (Julia y Sofía) | **No existe en el código; sí en la pantalla.** La pantalla promete que el número «sigue siendo tuyo en tu app»; el código pide el flujo estándar (`featureType` vacío), descarta el evento de fin del flujo de coexistencia y no suscribe `history`, `smb_app_state_sync` ni `smb_message_echoes`. Una clínica que conecta el número de todos los días podría perder la app | Onia: `lib/chatbot/embedded-signup.ts:109, 142`; `lib/chatwoot.ts:353-361`; `(d)/settings/chatbot/CanalWhatsappCard.tsx:272-290`. Hermes: `docs/ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md:307-316`; handoff nube :78. Competencia: Dapta §2.7; AgendaPro/Citalo :25 | Chico lo inmediato: quitar o condicionar la promesa de la pantalla antes del primer cliente. Mediano lo de fondo: el flujo de coexistencia, su evento, si Chatwoot v4.12.1 lo soporta y la configuración de la app en Meta; confirmarlo con el chip |
| B11 | Diálogo con casilla «leí y cumplo» antes de «Conectar mi WhatsApp»: ventanas emergentes, número libre, web o Instagram que coincida, PIN de dos pasos y el asistente de IA de Meta apagado | Dapta (diálogo con 4 ítems; el PIN y el asistente, solo en su doc) | **Parcial.** Onia ya avisa del método de pago y del cobro de Meta antes del botón, y del bloqueador de ventanas después de que falla. No dice nada del PIN ni del asistente de Meta; sin el PIN el registro falla sin avisar | Onia: `(d)/settings/chatbot/CanalWhatsappCard.tsx:221, 278-292`; `lib/chatbot/meta-cobra-el-servicio.ts:74-79`; búsqueda de PIN o asistente de Meta en el flujo: 0. Competencia: Dapta §2.7 | Chico: una pantalla con casilla antes del popup. Onia lo mostraría en el producto; Dapta lo deja en la doc |
| B12 | Ver la historia clínica completa (la ficha corta en 10 consultas y 10 citas) | Doctocliq (historia clínica y notas de evolución), Dentalink (Ficha 3.0 con línea de tiempo) | **Parcial.** La ficha trae las últimas 10 consultas, sin «ver todo». El GET de todas existe pero ninguna pantalla lo llama (y ordena por `createdAt`, no por fecha). Las citas también cortan en 10 y ningún export incluye la historia | Onia: `(d)/patients/[id]/page.tsx:88-91, 102-105`; `FichaVista.tsx:296-340`; `app/api/patients/[id]/records/route.ts:32-36`; `app/api/settings/export/route.ts`. Competencia: Doctocliq adentro :68 (cap. 27); Dentalink :68 | Chico: vista «ver todo» sobre el GET, paginada si hace falta |
| B13 | Odontograma por caras (oclusal, mesial, distal, vestibular, lingual) | Doctocliq (selector de 5 caras, 3 clics), Dentalink (clic en la pieza o la cara) | **No existe.** Un estado por diente (`@@unique([patientId, toothNumber])`); la cara solo se puede escribir en las notas | Onia: `prisma/schema.prisma:876-901`; `components/odontogram/Odontogram.tsx:12-30, 86`; `app/api/teeth/route.ts:10-45`. Competencia: Doctocliq adentro :71 (cap. 29-30), :77 (cap. 31); Dentalink :68 y `dentalink/odontograma.jpg` | Mediano: cambiar la clave única (o un mapa cara a estado), migración, Zod y un dibujo de 5 zonas. Va con B31 y B68 |
| B14 | Presupuesto clínico como documento: total, descuento, fases, estado del plan (aceptado, rechazado, terminado) y PDF o link para el paciente | Doctocliq (link público sin login, fases, 6 estados), Dentalink (fases, alternativo, 3 formatos, envío) | **Parcial.** Hay plan por ítem con precio de catálogo, estado por ítem y avance, más una tarea de seguimiento a los 7 días de un ítem pendiente. Sin total, descuento, fases, estado del plan, PDF ni link. El «presupuesto por fases con link público» está en un worktree de la nube SIN commits | Onia: `components/patients/PlanDeTratamiento.tsx:32-37, 85-86, 160-176, 285-310`; `prisma/schema.prisma:925-945`; `lib/onia-core/generators.ts:18, 51-87`; base para reusar: la cotización de importadora (`prisma/schema.prisma:1674-1692`, `app/print/cotizacion/[id]`). Hermes: handoff nube :50. Competencia: Doctocliq adentro :79-82 (cap. 33-40); Dentalink :69 | Mediano a grande: modelo, pantalla, PDF y link público sin login (no existe en ningún lado). Commitear ya lo del worktree |
| B15 | Cargar tratamientos con fecha pasada y lista de «en curso sin próxima cita» | Doctocliq («Servicios por terminar»); Dentalink solo con tarea manual | **En obra; en el código no existe.** El alta pone la fecha de hoy y reinicia el reloj de 21 días del recall, así que en una prueba de 14 días el recall de tratamiento a medias no encuentra a nadie con lo que carga la clínica. El arreglo está en el worktree `wt-plat-dev` SIN commits | Onia: `app/api/patients/[id]/treatments/route.ts:15-21`; `.../[treatmentRowId]/route.ts:21, 47`; `prisma/schema.prisma:932` (la columna `date` ya existe); `lib/onia-core/modules/agents-tratamiento-a-medias.ts:35, 141-145, 209-216`. Hermes: handoff nube :50. Competencia: Doctocliq adentro :84, :121 (cap. 63); Dentalink :37-45 | Chico: `date` opcional y no futura en el Zod del POST y un campo en `PlanDeTratamiento.tsx`, sin migración. La lista es otra pantalla chica |
| B16 | Ver al recall de tratamiento a medias encontrar a alguien en producción | Nadie: es el diferencial de Onia | **Parcial.** Publicado y encendido en `af2ded5c`. El seed de demo crea el caso y un test prueba que el evaluador real lo propone. Nunca se lo vio proponer en producción | Onia: `lib/onia-core/modules/agents-runtime.ts:1960-1966`; `agents-tratamiento-a-medias.ts:35, 56, 131-163`; `prisma/seed-demo-datos.ts:311-316, 390` y su test :295. Hermes: handoff nube :48-49. Competencia: Dentalink :37; Dapta §4.4; Doctocliq adentro :100 | Chico: correr el seed en la org demo, dejar correr el agente y MIRAR `/pending`. Antes, comprobar que aprobar no le escribe a un número inventado |
| B17 | Caja diaria: apertura con fondo, cierre por medio de pago con descuadre, egresos del día y quién cobró | Doctocliq (abono inicial, desglose, quién abre y cierra), Dentalink («Sin descuadres de caja»), Citalo (descuadre, egresos por categoría) | **No existe en los rubros clínicos.** No hay caja en el menú; «Te pagaron hoy» es un total sin desglose. Quién cobró queda solo en la auditoría del superadmin, y los gastos de `/empresa` no se cruzan con el día. Comercio tiene arqueo de efectivo, sin apertura ni egresos | Onia: `components/layout/navigation.ts:60-122`; `lib/platform/vertical-pack.ts:177, 317, 463`; `prisma/schema.prisma:1063-1080` (Payment sin `userId`); `(d)/dashboard/page.tsx:234-238, 326-336`; `app/api/payments/route.ts:131-136`; `lib/comercio/caja.ts:90-104`. Competencia: Doctocliq adentro :102-110 (cap. 54-56); Dentalink :73 y `anuncios/CAPTURAS-HECHAS.md:41`; AgendaPro/Citalo :50 | Mediano: `cajaTotals` de comercio sirve tal cual para el cierre por medio; la apertura con fondo y los egresos de caja son nuevos |
| B18 | Importar pacientes desde el Excel de la clínica sin romperse (`;` de Excel en Bolivia, comillas, `.xlsx`, duplicados) | Dentalink (Excel hasta 10.000), Doctocliq (menú importar; la plantilla que valida duplicados sale de su web) | **Parcial.** Parte cada línea con `split(',')`: un CSV guardado desde Excel con configuración boliviana usa `;` y falla entero. Solo acepta `.csv`, no busca duplicados y corta en 500 filas. Comercio ya usa un lector que detecta `,` o `;` | Onia: `(d)/patients/import/page.tsx:24-32, 92, 104, 251`; `app/api/patients/import/route.ts:67, 117-133`; `lib/csv.ts:17-28`; `(d)/comercio/importar/ImportarCatalogo.tsx:23`. Competencia: Dentalink :80; Doctocliq adentro :65; Doctocliq :76-77 | Chico: usar `parseCsvConCabecera` y avisar duplicados por CI o teléfono. `.xlsx` pide una dependencia nueva (con aprobación) |
| B19 | Pedir ayuda a una persona desde `/help` y el asistente | Doctocliq (chat Intercom), Dapta (chat en vivo); TuDoc lo promete | **Parcial.** El producto ya tiene WhatsApp de soporte con número por defecto (prueba bloqueada, checkout, plan, comunicaciones). En `/help` y en el asistente solo aparece si existe `SOPORTE_CONTACTO`, que faltaba en el contenedor el 29-sep (no se re-midió), y aun así sale como texto sin link | Onia: `lib/contact.ts:37-48` (`oniaWaHref`); `app/components/TrialBlockedModal.tsx:131`; `app/api/ayuda/route.ts:43-46`; `(d)/help/page.tsx:38`; `components/ayuda/AsistenteAyuda.tsx:242-247`; `components/ayuda/FaqAyuda.tsx:203`; `.env.example:281-286`. Hermes: `docs/research/onia-1.0-29sep/ADMINISTRAR_PARA_VENDER.md:213, 298`. Competencia: Doctocliq adentro :22 (cap. 01); Dapta §2.3 | Chico: usar `oniaWaHref()` como link en el asistente y la FAQ, y mirarlo renderizado |
| B20 | El checkout promete «Te emitimos factura por cada pago» y nada la emite | Promesa propia | **No existe.** El pago de la suscripción no tiene ningún enganche de facturación; encender `SIAT_EMISSION` no alcanza, porque la emisión solo está cableada a las facturas de la clínica a sus pacientes. El CI o NIT del pagador sí se pide y le llega al superadmin | Onia: `app/checkout/CheckoutClient.tsx:776, 840`; `lib/subscription/activation.ts` (sin factura); `lib/fiscal/flags.ts:6-15`; `app/api/invoices/[id]/route.ts:8`; `app/api/subscription-payment/route.ts:74, 204, 227`. Hermes: `docs/ONIA_CATALOGO_DE_VENTA.md` §6.2, §7 | Chico hoy: que el texto diga solo lo que se hace. Facturar a mano por el portal del SIN depende de que OniaAgency tenga la modalidad habilitada (no verificado). Cablearlo a la suscripción va con B45 |
| B21 | Respaldos fuera del VPS (base de la plataforma, Chatwoot y adjuntos) y una restauración probada, antes del primer dato clínico real | Requisito propio (Dapta muestra SOC 2 Tipo II, no respaldos) | **Parcial.** Hay `pg_dump` diario de `supabase-db` y export de n8n, los dos en el mismo disco. No hay copia afuera ni respaldo de `chatwoot-db` ni de Storage; el último respaldo marca `restoreVerified=false` y la única restauración fue a mano el 24-sep | Onia: `docs/ONIA_V1_BACKUP_DIARIO_2026-09-23.md:74`; `scripts/backup-onia-postgres.sh`. Hermes: `deploy/vps-ops/vps-backup.sh:2`; `infra/vps-db/scripts/backup-dentalgest.sh:14, 56` (rclone a R2, sin instalar); auditoría :152, :164 | Mediano: adaptar el script de R2 a `supabase-db`, `chatwoot-db` y Storage; el bucket lo crea Sergio Urcullo; una restauración probada |
| B22 | Cerrar lo expuesto antes del primer dato clínico: canal de tiempo real público con motivo y notas de la cita, 2 tablas con permisos de anon, Easypanel y n8n públicos, contenedor QA contra la base de producción | Requisito propio | **No existe.** El canal de la agenda es público por `organizationId` y lleva `reason` y `notes`. Dos tablas nacieron con RLS pero sin REVOKE (anon puede hacer TRUNCATE). Easypanel y n8n responden en público. El QA escucha solo en la máquina, pero comparte base y Auth con producción. La skill `onia-db` dice «cero grants a anon» y no es cierto desde el 11-sep | Onia: `lib/realtime/publicar-cita.ts:15-19, 52-53, 89`; `hooks/useAppointmentsRealtime.ts:58-60`; migraciones `20260911010000_add_onia_renewal_reminder_sends` y `20260918030000_add_onia_whatsapp_sends` (molde: `20260821000000_add_access_requests` :43-53); `docs/PROJECT_BACKLOG.md:462`. Hermes: `docs/ONIA_CONSOLA_UNICA_Y_ACCESOS.md:104-105`; auditoría :153-156, :172-173 | Mediano y con el OK de Sergio Urcullo (toca infraestructura). Lo chico va ya: sacar `reason` y `notes` del payload y una migración de REVOKE |
| B23 | El bot de ventas confirma «Listo, agendado» aunque Cal.com no responde | Dapta (agenda dentro del chat de verdad); CitaPro lo promete en un anuncio | **En obra.** Con Cal.com caído confirma y agrega «Estoy confirmando ese horario con Sergio»: modo degradado elegido el 3-sep, Sergio Urcullo recibe el aviso por Telegram y confirma a mano. El arreglo B1 está en un worktree de la nube SIN commits. Todavía no hay cuenta demo. El bot de ventas no promete audios: si llega uno, pide que lo escriban | Bot: `config.mjs:347, 532, 640`; `run-turn.mjs:578-589`; `calcom-booking.mjs:151-154, 169-172, 472-484`. Hermes: handoff nube :50, §7.0b; auditoría §2.3. Competencia: Dapta §2.6; `anuncios/citapro/1880949689530541.txt` | Chico: commitear B1 y mandar el link `cal.com/20min` en vez de confirmar |

### P1

| Id | Qué falta | Quién lo tiene | Cómo está Onia hoy | Evidencia | Esfuerzo |
|---|---|---|---|---|---|
| B24 | Reprogramar arrastrando la cita, con estado «Reprogramada» y la original visible | Doctocliq (arrastrar, confirmar, original tachada), Dentalink (arrastrar en la semana) | **Parcial.** Se reprograma con el modal «Editar», con control de choques, aviso al profesional y correo al paciente con la hora anterior. Faltan el arrastre (no hay semana ni día, B01), el estado y el rastro en la base | Onia: `prisma/schema.prisma:1194-1200`; `(d)/appointments/AgendaClient.tsx:488-507, 855`; `lib/agenda/reprogramar-cita.ts:67`; `lib/agenda/aviso-de-cambio-de-cita.ts:96-148`. Competencia: Doctocliq adentro :141, :171 (cap. 71-72); Dentalink :67 | Mediano, después de B01 |
| B25 | Sillón o consultorio como recurso de la agenda | Doctocliq (vista diaria por consultorio), Dentalink (sillón al dar la cita, vista por sillón) | **No existe.** La cita solo tiene `doctorId` y el choque se calcula por profesional | Onia: `prisma/schema.prisma:1093-1131, 1223-1258`; `lib/appointment-conflicts.ts:28, 43`. Competencia: Doctocliq adentro :32, :138 y `doctocliq/cuenta-de-prueba/09-agenda-vista-por-consultorio.jpg`; Dentalink :67 | Mediano: modelo de recurso y choque por recurso |
| B26 | Que el paciente reprograme solo, en un paso, conservando la cita | AgendaPro (reagendar desde el correo, con límites), Citalo (cancela y elige otro horario en el momento); CitaPro lo dice en un anuncio | **No existe.** Solo confirmar o cancelar; el botón «Reprogramar» de WhatsApp le avisa al equipo. Desde «Mis citas» el paciente cancela y vuelve a reservar en dos pasos con «Agendar» | Onia: `lib/booking/acciones-del-paciente.ts:17`; `app/cita/acciones.ts:25`; `lib/whatsapp/respuesta-al-recordatorio.ts:163-193`; `app/(public)/book/my-appointments/[token]/page.tsx:246-252, 340-352`. Competencia: AgendaPro/Citalo :24, :47, :66; `anuncios/citapro/1073401725052434.txt` | Mediano: elegir el hueco nuevo desde el token, con el cálculo de `/book` |
| B27 | Link de reserva visible y copiable en la Agenda, para todo el equipo | Doctocliq (URL con «Copiar» en la configuración de la agenda), Dentalink, Citalo | **Parcial.** Solo un enlace «Ver link público» en Configuración › Mi plan, sin la URL ni «Copiar», y esa pestaña la ven solo los administradores | Onia: `(d)/settings/PlanClient.tsx:1045-1056`; `(d)/settings/secciones.ts:109-116`. Competencia: `doctocliq/cuenta-de-prueba/12-agenda-config-reserva-online.jpg` (Doctocliq adentro :39-40); Dentalink :77; AgendaPro/Citalo :47, :61 | Chico: la URL con «Copiar» en la Agenda |
| B28 | Que lo que hace el paciente se vea al instante en el panel | Dentalink (el estado cambia solo, cola «no validada», push al profesional) | **Parcial.** Una reserva desde `/book` o el bot y una cancelación desde «Mis citas» no avisan ni se ven en tiempo real. Las respuestas por `/cita` y por los botones de WhatsApp van a la campana solo del profesional, nunca a recepción, y sin push. La campana escucha un canal que no entrega | Onia: `lib/agenda/crear-cita.ts:134, 258`; `app/api/appointments/[id]/route.ts:128, 218`; `app/api/booking/appointments/route.ts:339, 358, 428`; `lib/agenda/aviso-respuesta-del-paciente.ts:51-73`; `components/layout/NotificationBell.tsx:28-46`; `lib/realtime/publicar-cita.ts:3-10`. Competencia: Dentalink :70-71, :77, :79 | Chico: `publicarCita`, notificación y push en los cuatro caminos, con recepción entre los destinatarios, y la campana por broadcast. Va con B05 |
| B29 | Registrar la evolución desde la cita y aviso de «cita atendida sin nota» | Doctocliq | **No existe.** La consulta se carga solo desde la ficha y no guarda la cita | Onia: `(d)/patients/[id]/FichaVista.tsx:301`; `prisma/schema.prisma:852-873`; `(d)/appointments/AgendaClient.tsx:891-898`; `lib/onia-core/generators.ts:36-61`. Competencia: Doctocliq adentro :21, :34 (cap. 06) | Chico el enlace desde la cita completada; el aviso pide guardar la cita en la consulta (migración) |
| B30 | Anamnesis con formulario fijo (enfermedades, embarazo, anticoagulantes…) que genere alertas | Dentalink, Doctocliq; AgendaPro solo con ficha configurable (Premium). Citalo no | **Parcial.** Hay grupo sanguíneo, alergias en texto y alertas médicas tipadas con 4 severidades. El cuestionario libre de Requerimientos llega al portal, pero no a la ficha ni a las alertas | Onia: `prisma/schema.prisma:821-822, 2080`; `components/patients/MedicalAlertForm.tsx:11-22`; `FichaVista.tsx:255, 604`; `lib/onia-core/requerimientos.ts:68-90`. Competencia: Dentalink :68; Doctocliq :16; Doctocliq adentro :69; AgendaPro/Citalo :28, :51 | Mediano |
| B31 | Odontograma infantil (piezas 51 a 85) y con historia (inicial, evolución, alta) | Doctocliq (Inicial, Evolución, Alta; adulto, mixto y niño según su web), Dentalink (versión cada 24 h, nada se borra) | **No existe.** Solo las 32 piezas permanentes; guardar pisa el estado anterior sin rastro | Onia: `lib/dental/fdi.ts:5-16`; `app/api/teeth/route.ts:14-17, 35-45`; `prisma/schema.prisma:888`. Competencia: Doctocliq adentro :70 (cap. 28); Doctocliq :17; Dentalink :68 | Mediano: ampliar las piezas y guardar versiones. Va con B13 |
| B32 | Radiografías y fotos clínicas con miniatura, nombre, tipo y borrado | Dentalink (galería fechada), Doctocliq (archivos por plan) | **Parcial.** Se suben JPG, PNG, WebP o PDF de hasta 10 MB con 4 tipos fijos (sin radiografía ni foto), sin nombre ni miniatura, y no hay forma de borrar o anular. El bucket `clinical-docs` no se verificó en producción | Onia: `lib/onia-core/collab.ts:116`; `components/patients/PatientCollab.tsx:53-58, 310, 325-359`; `app/api/onia-core/documents/route.ts:19-21, 107`. Competencia: Dentalink :68 y `anuncios/dentalink/1086920147535259-3.png`; Doctocliq :16-17 | Mediano: tipos, nombre, miniaturas y borrado o anulación con auditoría (backend nuevo) |
| B33 | Consentimiento informado con plantilla por tratamiento, firma y PDF en la ficha | Dentalink (configuración y pestaña), AgendaPro (Premium), Doctocliq (add-on) | **Parcial, por dos caminos.** Se sube el papel escaneado (la pantalla nunca manda `signedAt`), o Requerimientos › Firma manda un link al portal donde el paciente escribe su nombre. Faltan plantillas por tratamiento, firma dibujada, el PDF firmado como documento de la ficha y el vínculo con el plan | Onia: `lib/onia-core/collab.ts:116`; `app/api/onia-core/documents/route.ts:74, 132`; `PatientCollab.tsx:219-224`; `lib/onia-core/requerimientos.ts:37, 64-65, 278-283`; `app/(public)/portal/[token]/portal-client.tsx:380-398`. Competencia: `dentalink/agenda-online.jpg`, `dentalink/odontograma.jpg`; AgendaPro/Citalo :28; Doctocliq adentro :19, :23 | Mediano, reusando la firma de Requerimientos y el portal |
| B34 | Cobrar desde el plan de tratamiento: precio por paciente, abono por ítem, doctor y nota por ítem, marca «Deuda» y distintivo en la agenda | Doctocliq (abono por ítem, fila roja «Deuda»), Dentalink (cobrar prestaciones, «Deudas» en la agenda) | **Parcial.** Se cobra con una factura armada a mano desde el catálogo (se carga dos veces), con abonos por factura y el saldo en rojo en la ficha. Faltan el botón «Cobrar» desde el plan, el precio propio del ítem, el abono por ítem, doctor y nota en la pantalla (la API ya los acepta), la marca «Deuda» y el distintivo en la agenda | Onia: `prisma/schema.prisma:905-945, 1007-1080`; `PlanDeTratamiento.tsx:93-100, 293`; `app/api/patients/[id]/treatments/route.ts:18-19`; `(d)/billing/new/NewInvoiceClient.tsx:52-60`; `app/api/payments/route.ts:68-110`; `FichaVista.tsx:380, 393, 652-657, 671`. Competencia: Doctocliq adentro :83-84; Dentalink :73 y `dentalink/menu-crm.jpg` | Mediano |
| B35 | Anticipo o saldo a favor, y cuotas atadas al tratamiento | Doctocliq (cuotas sobre el presupuesto, saldo a favor), Dentalink (cuotas y abonos) | **Parcial.** Se emula con facturas recurrentes mensuales con fecha de fin (desde Profesional) o con abonos sobre una factura grande. Todo pago exige factura, el pago de más se rechaza y el cobrador no sabe de planes de pago | Onia: `app/api/payments/route.ts:16, 86-88`; `lib/onia-core/modules/agents-runtime.ts:478-482, 522`; `prisma/schema.prisma:1364-1394`; `lib/plan-catalogo.ts`. Competencia: Doctocliq :25-26; Doctocliq adentro :92; Dentalink :73. El «anticipo» de CitaPro es una seña de reserva, no esto | Mediano |
| B36 | Ingresos y comisiones por profesional sobre lo cobrado | Doctocliq, Dentalink (liquidaciones), Citalo y AgendaPro (comisiones en caja) | **Parcial.** La liquidación existe en `/empresa`, pero la base se tipea a mano porque el cobro no guarda el doctor; `/reports` solo cuenta citas por doctor | Onia: `lib/empresa/comisiones.ts:1-19`; `app/api/empresa/commissions/route.ts:10-12`; `prisma/schema.prisma:320-336, 1007-1080`; `(d)/reports/page.tsx:68-69, 249-316`. Competencia: Doctocliq adentro :110, :119, :121; Dentalink :97 y `dentalink/agenda-online.jpg`; AgendaPro/Citalo :27, :50, :52 | Mediano, después de B34: con el doctor en el cobro, `comisiones.ts` no cambia la cuenta |
| B39 | Muestra del recordatorio al dueño al crear su primera cita, y empujones de la prueba por WhatsApp | Doctocliq (modal «¡Revisa tu WhatsApp!») | **La muestra no existe; los empujones están apagados.** Bienvenida, día 2 y día 11 están construidos y esperan la verificación del número del dueño, trabada por la plantilla AUTHENTICATION que Meta rechaza y por `ONIA_VERIFICACION_WHATSAPP=plantillas`; el cron no está en el crontab. La verificación inversa (rama sin publicar) destrabaría la verificación, no los empujones | Onia: `lib/whatsapp-onia/activacion.ts:1-8, 136-163`; `lib/whatsapp-onia/plantillas.ts:53-55, 118`; `lib/whatsapp-onia/interruptor.ts:20-34`; rama `origin/v1/verificacion-inversa`. Hermes: auditoría :78, :166; handoff nube :38. Competencia: Doctocliq adentro :140 (cap. 69-70), :160 | Chico para la muestra (una plantilla UTILITY nueva con `enviarPlantillaDesdeOnia`), atado a la verificación y al consentimiento del dueño |
| B40 | Recordatorio por WhatsApp desde el número de Onia con el nombre de la clínica, sin que la clínica conecte nada | Doctocliq (verificado); AgendaPro y Citalo (inferido en su teardown) | **No existe, por decisión (DG-054).** Onia ya manda plantillas desde su WABA al dueño, y el bot ya contesta los botones del recordatorio | Onia: `lib/whatsapp.ts:55-66`; `docs/PROJECT_BACKLOG.md:435`; `lib/whatsapp-onia/enviar.ts`; `lib/whatsapp-onia/plantillas.ts:1-20`. Competencia: Doctocliq adentro :50; AgendaPro/Citalo :25, :48 | Mediano a grande: plantilla de utilidad, cupo por plan y, lo caro, que las respuestas vuelvan a la clínica correcta. Requiere que Sergio Urcullo revise DG-054 |
| B42 | Migrar desde otro sistema: citas futuras y más de 500 pacientes de una vez | Doctocliq (importa desde Google Calendar; migración asistida), Dentalink (carga masiva hecha por ellos) | **Parcial.** Solo pacientes por CSV con tope de 500 (una clínica con 2.000 fichas sube 4 veces); no importa citas | Onia: `app/api/patients/import/route.ts:13-21, 66-68`. Competencia: Dentalink :80; Doctocliq :11-12, :76-77 | Mediano: importar citas futuras (CSV o `.ics`) y subir el tope. Tratamientos y saldos quedan como hipótesis: ningún teardown dice que la competencia los migre |
| B44 | Agenda en el celular del profesional: PWA instalada y push probados en Android y iPhone reales | Doctocliq y Dentalink (apps nativas), Agenda en Día | **Parcial: falta verificar, no construir.** Manifest, service worker, botón de instalar y push están en producción, probados solo en Chromium de escritorio. La clave VAPID ya falló una vez por no hornearse en el build | Onia: `public/manifest.json`; `public/sw.js:4`; `components/layout/InstalarOnia.tsx:25`; `hooks/usePushNotifications.ts:60`; `lib/push.ts:30`. Hermes: `docs/handoff/codex-continuar-1.0.md:268-270`; `docs/handoff/chatbot.md:534, 543`. Competencia: Doctocliq :69; Dentalink :79; `anuncios/ultrapack/1418092519699070-2.png` | Chico: instalarla y recibir un aviso de cita en 2 teléfonos, y confirmar que el bundle trae `NEXT_PUBLIC_VAPID_PUBLIC_KEY` |
| B45 | Emisión SIAT encendida para las facturas de la clínica y para las de Onia | TuDoc lo dice en su landing (no verificable); Doctocliq y Dentalink no facturan en Bolivia | **En obra.** Certificación IX 160/160 y VI 380/560, 0 rechazos; faltan los VI motivos 5-7 con el CAFC del piloto (límite: 4-nov). `SIAT_EMISSION` apagado: hoy salen notas de venta. El plan Empresa lista «Integración SIAT» y el checkout promete factura (B20) | Onia: `lib/fiscal/flags.ts:14-15`; `lib/fiscal/siat-client.ts:122-125`; `lib/fiscal/emission-service.ts:55`; `(d)/settings/PlanClient.tsx:354`. Hermes: rama `origin/wip/siat-validar-cada-paquete` (`70328e2e`); handoff nube :52. Competencia: TuDoc :8-21, :42-46 | Grande: terminar la certificación y el permiso por organización |
| B46 | QR dinámico del BCP que activa el plan solo | Requisito propio de cobro. Lo citado de Doctocliq y Citalo es el cobro al paciente (seña o link), que no existe en Onia y que ningún competidor da en Bolivia | **Apagado.** Código y callback hechos; sin las 6 variables `BCP_QR_*` responde 503 y la pantalla esconde la opción. Hay otra vía escrita (n8n por extracto bancario) sin workflow verificado | Onia: `lib/gateway/bcp-qr.ts:72-96`; `app/api/subscription-payment/bcp-qr/route.ts:9, 61-64`; `app/api/webhooks/bcp/route.ts:133-196`; `app/api/n8n/callback/subscription-approve/route.ts:28-41`. Competencia: AgendaPro/Citalo :14-17, :105 | Chico en código; espera el trámite del BCP. Con 5 clientes alcanza la aprobación manual: P1 discutible |
| B47 | El alta muestra y guarda los términos y la privacidad 1.2; la web publica la 1.3 | Requisito propio | **Parcial.** `VERSION_TERMINOS` es 1.2 en master y en todas las ramas; la web dice 1.3 (términos del 1-oct, privacidad del 29-sep) | Onia: `lib/legal/version-terminos.ts:6-7`; `app/api/auth/register/route.ts:420, 443`; `app/(auth)/register/SignupForm.tsx:702`; test `app/api/auth/register/route.test.ts:478`. Hermes: `web-factory/apps/onia-platform/src/content/legal/terminos.md:5` y `privacidad.md:5-6`; en vivo onia.com.bo/terminos y /privacidad | Chico: subir la constante y el test el mismo día; mejor una versión propia para la privacidad |
| B48 | Velocidad de la web de venta: LCP de 3,4 a 3,7 s; `/precios` y `/empezar` se ven vacías hasta cargar el JS | Requisito propio | **En obra.** El HTML ya viene armado del servidor, pero el componente `Reveal` lo esconde con `opacity:0` hasta que carga el JS. W1 está en un worktree de la nube sin commits | Hermes: `web-factory/apps/onia-platform/src/motion/reveal.tsx:1, 51`; `(sitio)/precios/page.tsx:127`; `(sitio)/empezar/page.tsx:104`; auditoría :18, :63-68, :142; handoff nube :50 | Chico (horas): no ocultar lo que se ve sin scroll en las 11 páginas. Commitear W1 antes |
| B68 | Catálogo de hallazgos del odontograma: faltan endodoncia, extracción indicada, prótesis o puente, sellante y aparatología | Doctocliq (atajos, buscador y lista larga), Dentalink (lista de lesiones) | **No existe.** 7 estados fijos; el dentista lo nota al primer clic de la demo | Onia: `prisma/schema.prisma` enum `ToothCondition`; `app/api/teeth/route.ts:18`. Competencia: Doctocliq adentro §4 (cap. 29-30); Dentalink §2 (AY/9493218) | Chico: ampliar el enum y la leyenda (migración y `Odontogram.tsx`). Va con B13 y B31 |
| B69 | Cobrar desde la cita, con el servicio ya cargado | Doctocliq («Registrar pago» en la cita), Dentalink (desde la agenda o la ficha), Citalo (ingreso al completar la cita) | **No existe.** La cita solo enlaza a la ficha; para cobrar, recepción va a Facturación › Nuevo y carga todo otra vez | Onia: `(d)/agenda/AgendaClient.tsx:227`; 0 resultados de cobro o pago en las dos agendas. Competencia: Doctocliq adentro §2 (cap. 06); Dentalink §2 Caja (AY/9493249); AgendaPro/Citalo §2 | Chico a mediano: una acción en la cita que abra `PaymentModal` con el paciente y el servicio |

### P2

| Id | Qué falta | Quién lo tiene | Cómo está Onia hoy | Evidencia | Esfuerzo |
|---|---|---|---|---|---|
| B37 | Cerrar cada seguimiento con un resultado propio («volver a contactar en N días», «cerrar el caso» sin dar de baja) y tasa de éxito por agente | Dentalink (3 resultados y reporte, solo Titanium; lo respalda su ayuda, no la captura) | **Parcial.** Ver los pacientes recuperados en Bs ya está en producción («Lo que te dejó Onia», atribución a 30 días) y el caso «volvió» se cierra solo. Falta que el dueño elija el resultado: hoy es un enfriamiento fijo de 30 días. Bajó de P1 a P2 porque la prueba de valor ya existe | Onia: `lib/resultados/lo-que-te-dejo.ts:367-396`; `lib/resultados/atribucion.ts:1-15`; `lib/onia-core/modules/agents-vigencia.ts:1-16`; `agents-runtime.ts:160, 275`; `prisma/schema.prisma:2156-2176`; `(d)/pending/pending-client.tsx:493-545`. Competencia: Dentalink :44-49 | Chico: resultado y fecha en la acción, y un menú en la tarjeta de la propuesta |
| B38 | Canal de correo para el Recall y el Reprogramador cuando no hay WhatsApp | AgendaPro (Charly por correo, pago aparte); Dentalink tiene correo masivo, no recall por agente | **Parcial.** Los agentes solo tienen WhatsApp o el wa.me manual. La confirmación de la cita ya sale sola por correo con botones. Bajó a P2: los teardowns dicen que en Santa Cruz el paciente casi no lee el correo | Onia: `lib/onia-core/dispatch/envelope.ts:12, 27-35`; `lib/onia-core/dispatch/channels.ts:3-5, 218`; `lib/email.ts:575-584`. Competencia: AgendaPro/Citalo :26, :102; Dentalink :72, :109 | Chico a mediano: un canal `email` con baja y cupo |
| B41 | Las notas de voz del bot están caídas y el catálogo todavía promete «fotos y audios» | Sendy (imágenes y notas de voz) | **Parcial.** Speaches cayó el 19-sep; el respaldo con OpenAI está en `origin/main` desde `4f135c0b`, pero no se sabe si está desplegado (el deploy del bot está trabado, B07). Las fotos andan. El producto no promete audio (`faq.ts:314` dice solo fotos, protegido por un test); la promesa vieja está en el catálogo. Bajó a P2: no hay WhatsApp de cliente conectado | Bot: `audio-transcribe.mjs:1-60`; `vision.mjs`. Onia: `lib/ayuda/faq.ts:314`; `lib/pricing-honestidad.test.ts:192-197`. Hermes: `docs/ONIA_CATALOGO_DE_VENTA.md:80, 131`; auditoría :51; handoff nube :73, :153. Competencia: Sendy brechas :22, :54 | Chico: corregir el catálogo :80, y destrabar el deploy con la clave del respaldo o poner `ONIA_AUDIO_ENABLED=false` |
| B49 | Citas en serie (controles cada N semanas hasta una fecha) | Doctocliq («Frecuencia»), Dentalink («citas múltiples», sin decir cada N semanas) | **No existe.** `crearCita` crea una sola cita | Onia: `prisma/schema.prisma:1093-1129`; `lib/agenda/crear-cita.ts:80, 111`. Competencia: Doctocliq :11; Doctocliq adentro :137 (cap. 67); Dentalink :67 | Mediano: N citas con control de choques |
| B50 | Estados extra (en sala de espera, en consulta) | Doctocliq (8 fijos; su propio teardown recomienda no copiarlos), Dentalink (personalizables) | **No existe.** 5 estados fijos | Onia: `prisma/schema.prisma:1194-1200`; `lib/agenda/estado-de-cita.ts:24`. Competencia: Doctocliq adentro :33, :151; Dentalink :71 | No son «dos valores más»: cada estado pasa por las reglas de `estado-de-cita.ts`, los agentes y el cron; con color configurable, un modelo nuevo |
| B51 | Sincronizar la agenda del profesional con Google Calendar (o un feed iCal) | Dentalink, AgendaPro, TuDoc; Doctocliq solo importa | **Parcial.** Solo el enlace «Agregar a Google Calendar» en el correo al paciente | Onia: `lib/email.ts:329-345, 561, 604`. Competencia: Dentalink :67; AgendaPro/Citalo :23; TuDoc :27; Doctocliq :11-12 | Chico un feed iCal de solo lectura; grande la sincronización de ida y vuelta |
| B52 | Política de cancelación (horas mínimas) y seña al reservar | AgendaPro (horas mínimas y seña), Dentalink (pago anticipado, solo Chile), CitaPro (anticipo) | **No existe.** El paciente cancela hasta la hora de inicio; la configuración de la clínica no tiene ningún campo para esto | Onia: `app/cita/por-que-no-se-responde.ts:21-27`; `lib/booking/acciones-del-paciente.ts:66-73`; `app/api/booking/appointments/route.ts:389-392`. Competencia: AgendaPro/Citalo :24, :27, :47, :105; Dentalink :77; `anuncios/citapro/1880949689530541.txt` | Chico la regla; mediano la seña, después de B46 |
| B53 | Lista de espera para turnos que se liberan | Citalo (a mano) | **No existe.** El Reprogramador ya ofrece el hueco a quien faltó o canceló en 14 días y a los «sin volver» del Recall; falta el paciente que pide un turno antes | Onia: `lib/onia-core/modules/agents-reprogramador.ts:25-27, 250-286`; `agents-runtime.ts:1179, 1882`. Competencia: AgendaPro/Citalo :76, :104 | Chico: un tercer origen «espera» en `candidatosParaHueco` |
| B54 | Freno al abuso de la reserva pública | Requisito propio | **Parcial.** Solo un límite por IP en memoria, que se reinicia con cada deploy. Quien escribe un teléfono conocido le cuelga una cita a un paciente existente y reactiva al dado de baja. La cita entra PENDIENTE | Onia: `app/api/booking/appointments/route.ts:185, 192-195, 212, 312-321, 346`; `lib/rate-limit.ts:1-2, 11, 128-131`; `lib/honeypot.ts:15` | Chico: el honeypot que ya usa el registro y validar el teléfono boliviano; Turnstile después |
| B55 | Periodontograma, ortodoncia por etapas y estética facial | Doctocliq (periodontograma y ortodoncia), Dentalink (los tres) | **No existe.** Solo como nombres del catálogo | Onia: `prisma/schema.prisma:852-901`; `lib/onboarding/vocabulario.ts:193-194, 212`. Competencia: Doctocliq adentro :69 (cap. 27); Dentalink :68 | Grande: tres módulos clínicos |
| B56 | Plantillas de medicamentos en la receta (y mandarla por WhatsApp) | TuDoc (vademécum, solo en su marketing y de medicina general) | **Parcial.** La receta se crea e imprime con texto libre. Que la competencia mande la receta no tiene evidencia (Dentalink manda el presupuesto). La impresión pide sesión, así que no sirve como link para el paciente. La más baja de la lista | Onia: `(d)/patients/[id]/prescriptions/PrescriptionsClient.tsx:151-226, 295-300`; `app/print/prescription/[id]/page.tsx:16-30`; `prisma/schema.prisma:1181`. Competencia: TuDoc :28, :30; Dentalink :68-69; Doctocliq adentro :69 | Chico: wa.me con los medicamentos en el texto, como `lib/importadora/cotizacion-whatsapp.ts:57` |
| B57 | Apoderado del menor, etiquetas visibles (VIP, Impuntual) y fuente de captación del paciente con su reporte | Doctocliq | **No existe.** Solo un contacto de emergencia en texto libre, que no sirve como apoderado legal. `discoverySource` mide cómo llegó la clínica a Onia, no el paciente a la clínica | Onia: `prisma/schema.prisma:25-29, 811-844`; `(d)/patients/new/NewPatientForm.tsx:229-251`. Competencia: Doctocliq adentro :64, :67, :92, :123 (cap. 22, 25, 61) | Chico: tres campos y un gráfico en `/reports` |
| B58 | Que la clínica elija el plazo del recall de control (y, si quiere, uno por tratamiento: limpieza, implantes) | Dentalink (un plazo al terminar el presupuesto, Titanium), Doctocliq (segmento por días y plantillas de control, Marketing premium) | **Parcial.** 180 días fijos en el código, contados desde la última cita atendida; la clínica no los puede cambiar. Ningún competidor tiene un plazo por tratamiento | Onia: `lib/onia-core/modules/agents-runtime.ts:151-161, 436-440, 2015-2019`; `agents-logic.ts:427`. Competencia: Dentalink :24-35; Doctocliq adentro :91-95 (cap. 51) | Chico: plazo configurable por organización; un intervalo opcional en el catálogo de tratamientos |
| B59 | Inventario dental con lote y vencimiento, y la tarea de reponer en dental | Doctocliq (vencimiento y consumo por paciente; el descuento de stock no se vio), Dentalink (lote, vencimiento, semáforo) | **Parcial.** Stock, mínimo y aviso de stock bajo en el panel y el asistente están vivos. Sin lote ni vencimiento, y las salidas son a mano. El Reponedor no corre en dental (lee el inventario de comercio), y el catálogo §8.4 lo promete a «rubros con inventario» | Onia: `prisma/schema.prisma:956-998`; `app/api/inventory/movements/route.ts:63-68`; `(d)/dashboard/page.tsx:203-209`; `lib/onia-core/modules/agents-por-rubro.ts:55`; `lib/platform/vertical-pack.ts:760-761`; `agents-runtime.ts:734-747`; `lib/comercio/lots.ts`. Competencia: Doctocliq adentro :84, :131 (cap. 65-66); Dentalink :75 | Mediano: lote y vencimiento reusando lo de comercio, y el Reponedor sobre el inventario dental. La frase del catálogo se corrige ya |
| B60 | Órdenes y pagos a laboratorio, y compras a proveedores | Dentalink (órdenes y pagos), Doctocliq (solo el nombre del menú) | **No existe en dental.** Hay piezas sin pantalla (el socio de tipo «laboratorio», el pendiente «seguimiento_laboratorio») y compras con cuentas por pagar hechas para comercio y cerradas a dental. Hoy se registra como gasto, sin categoría de laboratorio | Onia: `prisma/schema.prisma:782-799, 1775-1797`; `(d)/setup/setup-client.test.ts:50-55`; `lib/platform/api-route-registry.ts:53-58, 79-80`; `lib/empresa/categorias.ts:14-23`. Competencia: Dentalink :75; Doctocliq adentro (cap. 02, 65) | Mediano, menos que desde cero |
| B61 | Conversión de presupuestos por doctor, y servicios terminados y por terminar por profesional | Doctocliq (cap. 58, 63), Dentalink (conversión por doctor) | **Parcial.** Ya están el top 5 de tratamientos facturados y el balance clínico (realizado, en curso, cancelado) para toda la organización. La ficha no carga el doctor del tratamiento aunque el campo existe | Onia: `(d)/reports/page.tsx:249-300`; `lib/onia-core/clinical-balance.ts:52-60`; `prisma/schema.prisma:933`; `app/api/patients/[id]/treatments/route.ts:18, 97`. Competencia: Doctocliq adentro :111, :120-121; Dentalink :76 | Chico lo de por profesional; la conversión espera a B14 |
| B62 | Cumpleaños y pedido de reseña en Google después de la cita | Doctocliq (premium), AgendaPro (Premium, sin reseña), Dentalink (Titanium, NPS); CitaPro lo dice en un anuncio | **Cumpleaños apagado y roto; reseña no existe.** El cumpleaños vive en n8n (WF-05, inactivo, apunta a hosts muertos), fuera del producto. Ningún agente pide reseña | Onia: `n8n/workflows/WF-05-retention.json:2, 507`; `app/api/n8n/whatsapp/send/route.ts:23, 90`; `agents-runtime.ts:150-245`. Hermes: `docs/handoff/codex-continuar-1.0.md:868-870`. Competencia: Doctocliq adentro :47, :54; AgendaPro/Citalo :31; Dentalink :72; `anuncios/CAPTURAS-HECHAS.md:78-81` | Chico: un agente más con plantilla aprobada, dentro del producto |
| B63 | Que el bot del cliente reserve dentro del chat, sin mandar el link | Dapta (Calendars), AgendaPro (Julia), Doctocliq (Soyla); CitaPro lo promete | **No existe, por decisión del 1-oct:** manda `/book/<slug>`. El mecanismo ya funciona en el embudo de ventas de Onia contra Cal.com (ofrecer horarios, elegir, reservar) | Bot: `recepcionista.mjs:145-165`; `knowledge.mjs:1491-1494`; `run-turn.mjs:553`; `bot-engine.mjs:941-1014, 1199`. Competencia: Dapta §2.6; AgendaPro/Citalo :30; Doctocliq :63-64 | Mediano: cambiar el destino a la agenda de la organización (`/api/booking/slots` y `/api/booking/appointments`), cuidando el aislamiento |
| B64 | Que la conversación nazca como lead, y que la bandeja filtre leads, sin responder y anuncio de origen | Doctocliq (filtros de leads y chats sin responder), Dapta (filtro «Anuncio de Meta»), Sendy (CRM en tablero) | **Parcial.** El contacto ya entra solo a la lista de pacientes, con el canal en las notas. No nace como lead (nadie alimenta el intake `lead_conversacion`), `/inbox` no filtra, y Chatwoot 4.12.1 descarta el dato del anuncio | Onia: `app/api/webhooks/chatwoot/route.ts:129-133`; `lib/chatbot/contacto-desde-chatwoot.ts:115-170`; `lib/onia-core/intake.ts:19`; `app/api/bandeja/route.ts:20`; `(d)/inbox/InboxClient.tsx:166-176`. Bot: `chatwoot-adapter.mjs:130-134`; `bot-engine.mjs:296-303`. Competencia: Doctocliq adentro :130 (cap. 64); Dapta §2.5; Sendy :31 | Chico los filtros; mediano el lead; el anuncio pide capturar el dato antes de Chatwoot |
| B65 | Rubro elegido desde el anuncio o la web (`/register?rubro=dental`) | Citalo (`business_type_intent=DENTAL&country=BO`) | **No existe.** El alta arranca con el rubro vacío; la web solo pasa `?plan=` | Onia: `app/(auth)/register/SignupForm.tsx:150, 162-167, 418-420`. Hermes: `web-factory/apps/onia-platform/src/app/(sitio)/nav.ts:177`. Competencia: AgendaPro/Citalo :57-59, :97 | Chico: leer `rubro` validado contra `RUBROS_ACTIVOS` y enlazarlo desde la web y los anuncios dentales |
| B66 | Pago dividido en varios medios en un solo cobro | Dentalink, Doctocliq | **Parcial.** Un medio por pago; se arma con dos abonos (el modal precarga el saldo). El punto de venta de comercio no tiene ese atajo | Onia: `app/api/payments/route.ts:15-22, 80-108`; `(d)/billing/[id]/PaymentModal.tsx:34-35`; `lib/comercio/ventas.ts:55, 295`. Competencia: Dentalink :73, :114; Doctocliq adentro :83 (cap. 41) | Chico |
| B67 | Varias sedes (agenda, caja y reportes por sede) | Dentalink (bodega por sucursal), AgendaPro (multiubicación), Citalo (caja por sucursal); TuDoc lo dice | **No existe en dental.** Comercio tiene almacenes solo para stock; los roles ya traen un alcance sin usar. Al cliente no se le promete (un test lo cuida), aunque `/admin/plans` todavía lista «Multi-sucursal cotizada» | Onia: `prisma/schema.prisma:686-693, 1537`; `(d)/settings/PlanClient.promesas-del-contrato.test.ts:8, 64`; `lib/subscription/panel-de-planes.ts:89`. Competencia: Dentalink :75; AgendaPro/Citalo :46, :50; TuDoc :39, :92 | Grande. El cliente ideal tiene una sola sede |
| B70 | Reserva online por servicio, con su duración (y precio, si la clínica quiere) | Doctocliq (motivo con duración y precio), Dentalink (por profesional, especialidad o servicio) | **No existe.** `/book` manda siempre 30 min y el motivo es texto libre; el dueño no puede cambiar la duración desde el panel. Falla escondida: si la duración de la clínica dejara de ser 30, el servidor rechazaría todas las reservas | Onia: `app/(public)/book/[orgSlug]/page.tsx:161, 707-718`; `app/api/booking/appointments/route.ts:244-249`; `(d)/settings/modelo-por-rubro.ts:46`; `Treatment.durationMin` sin usar en la reserva. Competencia: Doctocliq §1 (Reserva online); Doctocliq adentro §2 (cap. 13); Dentalink §2 (AY/9493139) | Mediano: elegir el servicio y turnos de esa duración |
| B71 | Mandar un mensaje a un grupo de la propia base (sin visita hace 6 meses, hay huecos esta semana) | Doctocliq (add-on), Dentalink (Titanium), AgendaPro | **No existe.** Los agentes proponen de a un paciente; Comunicaciones solo muestra los recordatorios. Roza N02: va solo como envío chico, con tope y plantilla aprobada, y si exige plantilla de marketing se reevalúa | Onia: `(d)/communications/page.tsx`; `lib/onia-core/modules/agents-por-rubro.ts`. Competencia: Doctocliq §2; Dentalink §2 (AY/9493451); AgendaPro/Citalo §1 | Mediano a grande, después de B06 y B09 |
| B72 | Logo de la clínica en la receta, el presupuesto y el comprobante | Doctocliq (PDF del presupuesto con logo) | **No existe.** Los impresos llevan nombre, dirección y teléfono en texto; la organización no tiene logo | Onia: `prisma/schema.prisma` (Organization); `app/print/prescription/[id]/page.tsx:256-261`. Competencia: Doctocliq adentro §4b (cap. 35-36) | Chico: subir la imagen como el QR de cobro y mostrarla en `app/print/*` |
| B73 | Presupuestar y cobrar en dólares con tipo de cambio, junto al boliviano | Doctocliq (moneda en el presupuesto) | **No existe.** Precios, facturas y pagos no guardan moneda; la organización tiene un solo código, BOB | Onia: `prisma/schema.prisma` (Treatment, Invoice, Payment, `Organization.currencyCode`); `lib/utils.ts:60-63`. Competencia: Doctocliq adentro §4b (cap. 33-34), §4e (cap. 62); Doctocliq §1 | Mediano. Con la devaluación de 2026 el tratamiento caro se cotiza en dólares, y hoy eso pasa fuera del sistema |
| B74 | Convenios con empresas y aseguradoras | Dentalink (convenios, descuento por planilla), Doctocliq (aseguradora en la ficha y filtro) | **No existe en dental.** | Onia: búsqueda de convenio, aseguradora o seguro en `app/`, `lib/` y `prisma/`: solo el costeo de importadora. Competencia: Dentalink §2 Caja (AY/9493249, AY/9493252); Doctocliq adentro §4 (cap. 25, 48) | Mediano. Cuántas clínicas de Santa Cruz lo usan: preguntarlo al calificar |
| B75 | Imprimir o descargar la historia clínica de un paciente (pedido del paciente, derivación) | TuDoc (lo dice su landing) | **No existe.** Solo se imprime la receta; el export es un ZIP de todo el negocio, solo para administradores | Onia: `(d)/patients/[id]/prescriptions/PrescriptionsClient.tsx:299`; `app/print/*`; `app/api/settings/export/route.ts`. Competencia: TuDoc §1 | Chico a mediano: `app/print/historia/[patientId]` con consultas, odontograma y alertas |
| B76 | Retomar desde la bandeja una conversación de más de 24 h con una plantilla aprobada | Dapta (módulo de plantillas), Doctocliq, AgendaPro | **No existe.** Pasadas 24 h la bandeja bloquea la respuesta y manda al dueño a su propio WhatsApp | Onia: `app/api/bandeja/[id]/route.ts:114-124`; `lib/chatbot/ventana-de-respuesta.ts:45-48`. Competencia: Dapta §2.5, §2.7; Doctocliq §2; AgendaPro/Citalo §1 | Mediano, después de B06 y B09 |
| B77 | Lo que trae el asistente de WhatsApp, medido en citas: que la cita guarde de dónde vino | Dapta (metas logradas, costo por resultado, embudo), Doctocliq (embudo de leads, «citas en línea») | **No existe.** La bandeja muestra las conversaciones atendidas hoy y el cupo; la cita no guarda su origen, así que el dueño no ve si el add-on se paga solo | Onia: `(d)/inbox/InboxClient.tsx:231-240`; `prisma/schema.prisma` (Appointment sin origen). Competencia: Dapta §2.5, §2.6; Doctocliq adentro §4c (cap. 53), §4e (cap. 60) | Chico a mediano: un campo de origen que carguen `/api/booking` y el link del bot, y una línea en la bandeja |

---

## Lo que Onia hace mejor

Con evidencia de los dos lados. Sirve para saber qué no romper, no para la publicidad: la venta no compara con
nadie por nombre.

1. **Recall de tratamiento a medias** (en progreso sin venir 21 días, o plan empezado con pasos pendientes).
   Nadie más lo tiene: Dentalink no dispara ninguna de sus tareas para ese caso (Dentalink §1, «El hueco»),
   Doctocliq trae 13 plantillas de recall y ninguna para tratamiento sin terminar (Doctocliq adentro §4c, cap. 51)
   y Dapta no lo trabaja (Dapta §4.4). Onia: `lib/onia-core/modules/agents-tratamiento-a-medias.ts`, publicado en
   `af2ded5c`. Falta verlo con datos (B16).
2. **Una persona en el medio:** los agentes proponen y el dueño aprueba en `/pending`; la IA nunca ve datos de
   pacientes (`lib/onia-core/modules/agents-plantilla.ts:1-22`). Dentalink vende lo contrario: flujos de IA que
   contactan sin aprobación (Dentalink §1, AY/12961769).
3. **Precio público en bolivianos y alta sola con 14 días sin tarjeta** (`lib/subscription-plans.ts`;
   `lib/subscription/plan-state.ts:22`). Dentalink y TuDoc esconden el precio y entran solo por demo; Doctocliq,
   Citalo y Dapta cobran en dólares; Lety y Dapta piden tarjeta antes de la prueba.
4. **Lo fiscal boliviano dentro del producto:** resumen de IVA, RCV de compras y ventas, vencimiento por NIT,
   gastos con crédito fiscal y planilla con DS 21060, Ley 065 y RC-IVA (`lib/fiscal/*`, `lib/rrhh/planilla.ts`).
   Dentalink dice que «no es software contable»; Doctocliq deja en la cuenta de Bolivia el IGV y la «Boleta»
   peruanos (Doctocliq adentro §5).
5. **SIAT en certificación con 0 rechazos** (IX 160/160 y VI 380/560 al 2-oct). Doctocliq y Dentalink no listan
   Bolivia en su facturación (Doctocliq §1 Facturación; Dentalink §2 Facturación); lo de TuDoc no se puede
   verificar (TuDoc §0). Encenderla es B45.
6. **Recordatorios por correo de 24 h y 2 h incluidos con cupo, sin cobro por mensaje**, y Confirmar o Cancelar
   que solo cambian la cita al apretar, no al abrir el link (`app/cita/acciones.ts:21-75`;
   `app/api/cron/appointment-reminders/route.ts:546-571`). Dentalink cobra el WhatsApp por mensaje con un texto
   que no se cambia (Dentalink §2); la página de confirmación de Doctocliq es texto sin diseño (Doctocliq adentro
   §2, cap. 08).
7. **Llenar huecos sin pagar aparte:** el Reprogramador ofrece un turno cancelado de las próximas 72 h a hasta 3
   personas (`lib/onia-core/modules/agents-reprogramador.ts:25-27`). AgendaPro lo vende aparte (Charly) y Citalo lo
   hace a mano (AgendaPro/Citalo §1 y §3).
8. **Los datos son del cliente:** la prueba vencida pasa a solo lectura sin borrar nada
   (`lib/subscription/plan-state.ts:112`), y «Exportar todos mis datos» en ZIP está en cualquier plan
   (`app/api/settings/export/route.ts`). Dentalink bloquea a los 15 días de impago y borra la cuenta a los 30
   (Dentalink §2 Onboarding).
9. **Inventario de insumos en todos los planes** (`lib/plan-catalogo.ts`, `inventoryIncluded: true`); en Doctocliq
   es solo del plan Avanzado (Doctocliq §1 Inventario).
10. **Alertas médicas con 4 severidades siempre arriba de la ficha** (`components/patients/MedicalAlertForm.tsx`;
    `(d)/patients/[id]/FichaVista.tsx:241-262`), doble factor obligatorio por rol (`lib/mfa/policy.ts:40`) y cada
    doctor ve solo su agenda (`(d)/appointments/AgendaClient.tsx:175`; `app/api/appointments/route.ts:41`).

## Lo que frena vender y no es producto

Ninguna de estas se arregla con código. Casi todas esperan a Sergio Urcullo.

1. **Contestar los leads que llegaron solos:** los 3 pedidos de acceso de agosto y las conversaciones 35, 37 y 58.
   Los borradores están listos y no se mandó nada: falta el OK de Sergio Urcullo y que los mande desde su
   teléfono (el número de ventas no puede escribir primero pasadas 24 h). Antes, confirmar si la conversación 35
   es Odontoking.
2. **Primer lote de 12 prospectos dentales de Santa Cruz:** listos con su mensaje, nadie contactado. Cada envío
   espera el OK de Sergio Urcullo y lo manda él (`docs/ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.6).
3. **Cuenta demo de venta en producción:** en curso, con OK del 2-oct. Sin ella no hay demo, y el bot de ventas ya
   ofrece demos (B23). Es también donde se verifica B16.
4. **Un pago real de punta a punta en producción:** 0 pagos registrados. Comprobante, correo, aprobación de Sergio
   Urcullo en `/admin/payments` y plan activo nunca se probaron en producción.
5. **El criterio de salida de la Etapa 1 no cierra con el precio vigente.** El cliente ideal entra por Crece y, con
   su precio actual (`subscription-plans.ts`), 5 clínicas no llegan al ingreso mensual del §4 de la estrategia,
   que se calculó con un precio de Profesional que ya no rige. Sergio Urcullo decide si la salida es 5 clientes o
   el monto.
6. **Medir las horas de soporte por cliente desde el primero:** es la métrica que define el techo del negocio
   (estrategia §9 y §12) y hoy no se anota en ningún lado.
7. **Decisiones de empaquetado pendientes:** si Crece, Profesional y la prueba traen el WhatsApp automático o es
   el add-on (destraba B09); si se reabre DG-054 para mandar recordatorios desde el número de Onia (B40); cuánto
   dura la demo (30, 20 o 10 minutos según la fuente); cómo se vende el agente captador (`addon.captador`, hoy sin
   precio).
8. **Pauta:** falta la tarjeta en la cuenta de ONIA Ads (`has_payment_method` en false el 1-oct); el OK del
   presupuesto de la prueba (`ONIA_ADQUISICION_Y_PAUTA.md`) con el tipo de cambio real de la tarjeta; quién
   contesta las conversaciones y en cuánto tiempo; aprobar D1 y D4; la pieza con Sergio Urcullo mostrando la
   pantalla; crear la campaña en pausa; ver el píxel disparar en «Probar eventos»; verificar
   `/v1/modulos/dental` como página de entrada; vincular Instagram.
9. **Caso de soporte con Meta por la plantilla AUTHENTICATION** (code 10, subcode 2388185): bloquea la
   verificación del alta y B39. Lo abre Sergio Urcullo, junto con el PIN de dos pasos y la descripción del perfil
   en WhatsApp Manager.
10. **Titular del QR de cobro de la suscripción:** el checkout dice OniaAgency y el QR del BCP muestra un nombre de
    persona; puede frenar el pago. Se resuelve con el banco.
11. **SIAT: el CAFC del piloto y la captura del «Listado de Etapas»**, para los VI motivos 5-7 (180 casos) antes
    del 4-nov. El portal del SIAT lo abre solo Sergio Urcullo, a mano.
12. **Credenciales del API QR del BCP:** el código del QR dinámico está hecho (B46) y espera el trámite del banco.
13. **Barrer las contradicciones del material de venta:** el catálogo §8 dice que el tratamiento a medias no se
    puede prometer y Adquisición §0.4 que D4 sí; §8.4 promete el Reponedor en rubros con inventario (no corre en
    dental, B59); §8.5 dice que la ayuda con números sirve a todos los rubros; §5 y §8 se contradicen sobre fotos
    y audios (B41); §8.6 promete leer la web sin decir que no lee sitios hechos con JavaScript; la estrategia §6
    muestra abierta la privacidad que ya se cerró.
14. **Pruebas activas por vencer:** la lectura de producción está bloqueada por permisos. Sergio Urcullo corre
    `scripts/sql/pruebas-por-vencer.sql` (en `onia-hermes`) o da el permiso. Los borradores A y B están en el
    transcript de la sesión de Ventas anterior.
15. **CIO 2026 Santa Cruz:** canal de eventos del rubro con fecha sin confirmar. En 2025 fue del 1 al 3 de
    octubre, así que puede ser estos días.

## Lo que no se copia y por qué

| Id | Qué | Quién lo tiene (evidencia) | Por qué no |
|---|---|---|---|
| N01 | Agentes de voz y llamadas con IA (recepcionista telefónica, confirmación por llamada) | Dapta (Dapta §2.3, §3.2; su único caso de clínicas es de voz, §4.4), Dentalink (Contact Center), Lety | Es otra línea de negocio, con costo por minuto y soporte propio; la clínica de Santa Cruz vive en WhatsApp, no en el teléfono |
| N02 | Difusiones y campañas masivas por WhatsApp o correo, secuencias salientes y segmentos | Sendy, Dapta (Dapta §2.3, Secuencias), Doctocliq (add-on CRM, bloqueado aun en Avanzado: Doctocliq adentro §4c, cap. 52), Dentalink (Titanium), AgendaPro | Meta cobra caro las plantillas de marketing y arriesgan el número de la clínica; el recall dirigido de a uno, con aprobación, es mejor mensaje. El envío chico a un grupo de la propia base queda como B71 (P2) |
| N03 | IA que les escribe a los pacientes sola, sin aprobación | Dentalink (flujos automáticos, AY/12961769), CitaPro (`anuncios/citapro/2253602242100999.txt`), AgendaPro (Sofía insiste) | El dueño aprueba antes de que se le escriba a su paciente (decisión D2 del 24-sep, `agents-plantilla.ts:4-9`). Es la promesa de Onia y evita un mensaje equivocado. Un recordatorio fijo de cita (B06, B40) no es esto: no lo escribe una IA |
| N04 | Directorio público donde los pacientes encuentran la clínica | Dentalink (Gerty.com, AY/17061686), AgendaPro, Calendico | Es un negocio de dos lados aparte; necesita miles de negocios para tener sentido |
| N05 | Marca blanca, subcuentas para agencias, afiliados y referidos con comisión | Lety (`docs/historial/ONIA_COMPETENCIA_LETY_AI_20260806.md` §1-2), Dapta (Dapta §5.3, §3.4) | No hay equipo de ventas (regla del 27-ago) y la reventa por agencias es otra línea de negocio. Gamificación, ligas y mentores de Sendy: tampoco |
| N06 | Constructor de flujos, cientos de integraciones, MCP y webhooks salientes | Dapta (Dapta §2.3, §2.4), Sendy, Lety | El dueño de una clínica no arma flujos, y cada integración es soporte. Onia ya tiene una API de pacientes y citas (`app/api/v1/patients/route.ts`, `app/api/v1/appointments/route.ts`) |
| N07 | Cobro por créditos de IA, clave propia del cliente y elección de modelo | Dapta (Dapta §3.2), Lety, Sendy («Modelo de IA»), Dentalink (créditos por plan) | Un precio fijo en bolivianos se vende mejor que créditos en dólares, y el costo de IA de Onia es casi cero (`lib/plan-catalogo.ts:99, 115, 131`, cupo del redactor por plan) |
| N08 | IA clínica: análisis de radiografías, simulador de sonrisa, dictado de evoluciones | Dentalink (créditos por uso), TuDoc (en su plan a futuro) | Costo por uso y riesgo regulatorio; no toca el dolor de entrada, el paciente que no volvió |
| N09 | Plan gratis para siempre | Doctocliq, Citalo (AgendaPro/Citalo §2) | Los que no pagan consumen horas de soporte, que son el techo del negocio; la meta es 5 que paguen (`lib/subscription/plan-state.ts:22`: prueba de 14 días) |
| N10 | App nativa para iOS y Android | Doctocliq (3,4 estrellas), Dentalink (3 calificaciones), AgendaPro, Sendy, Dapta | La PWA alcanza para ver el día (B44); las apps de la competencia tienen pocas reseñas y doble mantenimiento |
| N11 | Respuestas con audio de voz y vendedor IA por embudo de anuncio | Sendy (Sendy brechas §1; Sendy, «Vendedor IA por EMBUDO») | Está pensado para comercio electrónico por Click-to-WhatsApp, no para una clínica que agenda |
| N12 | Telemedicina, pantalla de sala de espera, chat interno, gift cards, tarjeta de sellos y terminal de cobro | Doctocliq (add-ons, Doctocliq adentro §1, cap. 05), TuDoc §3, AgendaPro | Ninguno lo pide la clínica de 2-6 profesionales para comprar; cada uno es mantenimiento extra |
| N13 | Alta acompañada con sesiones 1 a 1 y carga de datos hecha por el proveedor | Dapta (Scale Up y Prime, Dapta §3.1), Dentalink (AY/9488192), Doctocliq | Son horas de Sergio Urcullo por cliente; el camino es que la clínica importe sola (B18, B42) |
| N14 | Precio oculto y alta solo por demo con vendedor | Dentalink, TuDoc (TuDoc §0) | No hay equipo de ventas y el autoservicio es la ventaja: Onia publica el precio y tiene alta sola |

## Lo que se creyó que faltaba y ya está

**Refutadas el 2-oct:**

- **R1 (era B43). Invitar al equipo por correo en vez de que el dueño escriba la contraseña de cada uno:** ya
  existe. `(d)/team/InviteModal.tsx:36` abre en modo «invitar» y :58 llama a `/api/admin/users`, que usa
  `inviteUserByEmail` (`app/api/admin/users/route.ts:108`) con tope de usuarios por plan (:101) y control de
  coadministradores (:92-99); el administrador del negocio pasa por `lib/auth.ts:151`. El correo de marca existe
  (`public/correos-auth/invitacion.html`, `docs/CORREOS_AUTH_MARCA.md:130`: vivo). Fijar la contraseña
  (`app/api/team/route.ts:27`) es solo el modo secundario. Además, ningún teardown documenta invitación por correo
  en la competencia.
- **R2. Planilla del lado patronal, aguinaldo, finiquito y contabilidad plena:** no es una brecha, porque la
  competencia no lo tiene (Dentalink :97, :123-124; Doctocliq :126; AgendaPro/Citalo :96, :110; TuDoc :89). En
  Onia, `/rrhh` está vivo con la planilla del mes del lado laboral y export CSV (`(d)/rrhh/page.tsx`,
  `app/api/rrhh/planilla-export/route.ts`, permiso por plan en `lib/plan-limits.ts:534-538`); el lado patronal no
  se liquida a propósito (`lib/rrhh/planilla.ts:15-16, 44`). Aguinaldo, indemnización y finiquito existen solo
  como funciones sin pantalla (`lib/onia-core/modules/payroll-logic.ts:239-304`). `/contabilidad` está vivo con
  IVA, RCV, balance de comprobación y CSV (`lib/fiscal/balance-comprobacion.ts:1-7`: «No es contabilidad plena»).
  Se había cargado con el id B68, que quedó para el catálogo del odontograma.

**Mitades que ya estaban** (las encontró la verificación; la brecha quedó solo con lo que falta):

- Ver los pacientes recuperados en Bs: vivo en el panel desde el 29-sep (B37).
- El contacto que escribe por WhatsApp entra solo a la lista de pacientes (B64).
- WhatsApp de soporte con número por defecto en la prueba bloqueada, el checkout y el plan (B19).
- El producto no promete notas de voz; la promesa vieja está solo en el catálogo (B41).
- Plan de tratamiento por ítem con precio y estado, y seguimiento automático del ítem quieto (B14).
- Reprogramar con control de choques y aviso al profesional y al paciente (B24).
- El Reprogramador ya llena huecos con quien faltó, canceló o no volvió (B53).
- Abonos parciales y facturas recurrentes que emulan cuotas (B35, B66).
- Alertas médicas tipadas y firma de conformidad por el portal (B30, B33).

**Cerrado desde el 31-ago** (lo que la foto de abajo daba por abierto):

- **El bot del cliente manda el link de reserva de su organización en vez de derivar** (escalón 1 de §3.1):
  `ad16b8ce`, 31-ago, `recepcionista.mjs:16-18, 162, 286`.
- **El catálogo ya no dice que el alta está cerrada** (§3.0 y A5): `ONIA_CATALOGO_DE_VENTA.md` §1 dice «lo elegís
  al registrarte, probás 14 días».
- **El captador ya no cuelga de `addon.inmobiliaria`** (§3.3): tiene su propio `addon.captador`
  (`lib/onia-core/modules/agents-runtime.ts:184`). Sigue sin venderse: es una decisión de empaquetado.

La lista del 31-ago («Lo que creíamos que nos faltaba y ya está») sigue en §2 de la foto.

---

## Foto del 31-ago-2026: el chatbot frente a Lety, Dapta y Sendy

> Lo que sigue es la medición del 31-ago, solo del chatbot. Se conserva lo que sigue valiendo; lo que cambió está
> marcado **(2-oct)** con su evidencia. Verificado entonces contra `onia-platform` master `e46e9ee`, el motor en
> `hermes-content/deploy/vps-ops/bot/` y producción (`app.env`, el env del contenedor `onia-platform` y `/register`
> renderizada). Referentes: `research/competencia/SENDYPRO_TEARDOWN.md` (cuenta real, 30-ago),
> `docs/historial/ONIA_COMPETENCIA_LETY_AI_20260806.md` y la captura `research/competencia/s_www.dapta.ai_.html`.

### 0. El marco: dónde estábamos parados

Contado en la base de producción el 31-ago:

- **3 pedidos de acceso**, sin contestar: `clinica klein` (21-ago, dental, Santa Cruz), `Clinica Leonardo` (23-ago,
  estética, Santa Cruz), `consultorio dental sonrisa feliz` (28-ago, dental, Santa Cruz). Eran **10, 8 y 3 días**.
- **4 organizaciones** en total (Onia interna y QA). **Cero clientes pagando.**
- Los tres pidieron **el rubro que sí funciona** (dental o estética). No faltaba producto para atenderlos: faltaba
  contestarles.

**(2-oct)** Siguen sin respuesta: los borradores están listos y falta el OK y el envío de Sergio Urcullo («Lo que
frena vender», punto 1). Sigue sin haber clientes pagando.

**Consecuencia para todo lo que sigue:** cualquier capacidad que no acerque al primer cliente pagando va al final,
por impresionante que sea.

### 1. Qué significa «su nivel», concretamente

Una capacidad por línea, cada una verificable. La columna **Referente** dice quién la tiene (S = Sendy, L = Lety,
D = Dapta). La columna **¿Nos aplica?** es el filtro: **Onia no es lo que ellos son.** Ellos venden un vendedor por
WhatsApp; Onia vende un sistema por rubro **con** chatbot. Estos ids (A1 a F4) son del chatbot del 31-ago: no
confundir B1-B9 con las brechas B01-B77 de arriba.

#### A. Que el dueño arme y cambie su asistente solo

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| A1 | Plantilla pre-armada por rubro o nicho | S, L (46 nichos) | Sí |
| A2 | Editar el guion **conversando** («atendé también los domingos») | S | Sí: es la mejor idea de los tres |
| A3 | Ver el guion actual en **pasos numerados legibles** | S | Sí |
| A4 | Publicar sin poder romperlo (validación todo o nada) | **ninguno** | Sí: es nuestro, no de ellos |
| A5 | Alta del producto **self-service en menos de 1 hora** | L (7 pasos) | Sí: el benchmark |
| A6 | Encender el canal (widget web o WhatsApp) sin pedirle nada a nadie | S, L | Sí |

#### B. Que el asistente atienda de verdad

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| B1 | Contesta 24/7 en el canal del cliente | S, L, D | Sí |
| B2 | Entiende **notas de voz** | (no visto en S) | Sí: en Bolivia media conversación es audio |
| B3 | Entiende **fotos** | (no visto en S) | Sí |
| B4 | Lee **comprobantes de pago** y avisa | S (validación por visión) | Sí: acá todos pagan con QR y mandan captura |
| B5 | **Contesta fuera de guion** (LLM libre sobre el conocimiento del negocio) | S, L, D | Sí, con guardrails |
| B6 | **Cierra**: agenda la cita, toma el pedido, cobra | S (cobra), L (Stripe), D (agenda) | Sí: es nuestro argumento entero |
| B7 | Insiste al que no responde, con cadencia configurable | S (20 min, 1,7 h, 3 h) | Sí |
| B8 | **Frase activadora por campaña** (un embudo por anuncio o link) | S | Sí |
| B9 | **Difusiones masivas** a la base | S | Dudoso: ver §3.6 |

#### C. Que el humano tome el control cuando hace falta

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| C1 | Bandeja propia, con candado bot-humano | S («Súper Chat») | Sí |
| C2 | Aviso al celular cuando escriben | S, D | Sí |
| C3 | Fotos, videos y audios visibles en la bandeja | S | Sí |

#### D. Que lo conversado **toque el negocio**

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| D1 | El contacto queda como **cliente o lead en el sistema** | S (CRM propio), D (actualiza tu CRM) | Sí: acá ganamos o perdemos |
| D2 | La cita queda **en la agenda real** | D | Sí |
| D3 | El cobro queda **en la caja** | S (QR) | Sí |
| D4 | **Métricas del asistente** (cuánto contestó, cuánto derivó, qué le preguntan) | S («Analizar»), D («Analyze and grow») | Sí |

#### E. Que se pueda comprar y cobrar

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| E1 | Precio público, sin llamada de ventas | S (21 niveles), L, D | Sí |
| E2 | Contratar y pagar desde adentro del producto | S (Hotmart o comprobante manual) | Sí |
| E3 | Que el que no paga **no use** el add-on | S (límite de chats por día) | Sí |

#### F. Canales

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| F1 | Widget web propio | L, D | Sí |
| F2 | WhatsApp oficial (API Cloud) | S, L, D | Sí |
| F3 | Instagram DM o Messenger | S(-), L | Tal vez: los 3 pedidos vinieron de Instagram |
| F4 | **Voz**: agente que atiende llamadas | D (su titular), L | **No hoy**: ver §3.6 |

### 2. Cuáles ya teníamos el 31-ago

Verificado **en el código**, no en los docs.

| # | Estado | Evidencia |
|---|---|---|
| A1 | ✅ | `onia-platform/lib/chatbot/plantillas.ts:216` `plantillaDeTrack()`: doc pre-armado por rubro; 6 rubros con plantilla, `ganadero-offline` da `null` a propósito |
| A2 | ✅ | Panel: `app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx:74` · ruta `app/api/chatbot-knowledge/sugerir/` · motor `bot/editor-sugerir.mjs:47` (LiteLLM temp 0, prohibido inventar): doble candado motor y espejo |
| A3 | ✅ | `app/(dashboard)/settings/chatbot/ChatbotClient.tsx:672-677` «Así atiende tu asistente», pasos en vivo |
| A4 | ✅ | `bot/knowledge.mjs` `validateKnowledge` todo o nada, espejo `lib/chatbot/knowledge.ts` y `bot/guardrails.mjs` |
| A5 | ✅ | **El alta automática está abierta en producción.** `docker exec onia-platform printenv ONIA_ALTA_AUTOMATICA` dio `abierta`; `ONIA_REGISTRO_CONFIRMA_CORREO` dio `si`; `supabase-auth2` `GOTRUE_MAILER_AUTOCONFIRM` dio `false`. `/register` renderiza el `SignupForm`. **(2-oct)** El catálogo y el resto del material ya lo dicen (ver «Cerrado desde el 31-ago») |
| A6 | ✅ web · ⏳ WhatsApp | Canal web self-service: `app/api/chatbot-canal-web/route.ts`. WhatsApp: Embedded Signup encendido del lado servidor. **(2-oct)** La prueba con el chip está en curso, y antes del primer cliente faltan B10 y B11 |
| B1 | ✅ | `bot/recepcionista.mjs`, sobre `bot/chatwoot-adapter.mjs` |
| B2 | ✅ el 31-ago · ⚠️ caído | `bot/audio-transcribe.mjs`: Speaches self-hosted, modelo `faster-whisper-small`. **(2-oct)** Speaches cayó el 19-sep y no se sabe si el respaldo está desplegado (B41) |
| B3 | ✅ | `bot/vision.mjs` y `recepcionista.mjs` (R_ATTACH_VISTO, doble filtro: guardrails y cero dígitos) |
| B4 | ✅ | `bot/recepcionista.mjs` R_COMPROBANTE: lee el monto como **eco** del documento, jamás una cifra nuestra, y **nunca dice «pago confirmado»** |
| B7 | ✅ | Perilla en `ChatbotClient.tsx:460` (encendida por defecto), barrido `bot/insistencia-run.mjs` y cron cada 30 min en el VPS |
| B8 | ✅ | `bot/recepcionista.mjs` `campanaExacta` **antes del saludo** y `lib/chatbot/knowledge.ts:101` `campanas` (máximo 10): sirve con `wa.me/<num>?text=<frase>` en la bio de Instagram, sin anuncios |
| C1 | ✅ | `app/(dashboard)/inbox/page.tsx` e `InboxClient.tsx`; candado: el motor arma en `takeoverTurn` y desarma al resolver |
| C2 | ✅ sin probar en celular | `lib/chatbot/push-te-escribieron.ts` y el relay del webhook. **(2-oct)** Sigue sin probarse en un teléfono real (B44) |
| C3 | ✅ | `InboxClient.tsx`: imagen en línea, reproductores de video y audio, link de archivo |
| E1 | ✅ | `lib/pricing.ts` |
| E2 | ✅ | `app/(dashboard)/settings/addon-chatbot/page.tsx`: el dueño paga y sube el comprobante; el superadmin aprueba en `/admin/payments` y se enciende `Organization.whatsappAddon` |
| E3 | ✅ | El paywall real es el booleano `Organization.whatsappAddon` y se aplica: `app/api/chatbot-canal-web/route.ts:64` devuelve 403 sin add-on. Lo que queda abierto es el **editor**, y eso es un buen embudo (armás tu bot gratis, pagás para encenderlo) |
| F1, F2 | ✅ | `bot/chatwoot-onboard.mjs:78` `CREATABLE_CHANNELS = {api, web_widget}` y WhatsApp por Embedded Signup |

#### Lo que creíamos que nos faltaba y ya estaba (31-ago)

1. **El alta self-service (A5), el benchmark de Lety, estaba viva en producción.** El guion de venta puede decir
   «probás 14 días gratis, sin tarjeta» porque es lo que la página muestra.
2. **El paywall del add-on (E3) funciona.** El catálogo lo daba por roto; el 403 está puesto.
3. **El editor conversacional (A2)**, la copia número 1 de Sendy, estaba entero, con más seguridad que el
   original: el guion pasa por el validador todo o nada antes de publicarse.
4. **Los comprobantes por visión (B4)** y **las frases de campaña (B8)** estaban vivos. B8 sirve **sin anuncios**.
5. **El aviso de pedido de acceso (Telegram y correo) estaba encendido en producción** (`lib/aviso-acceso.ts`): las
   3 solicitudes sí avisaron. No había bug: había una cola que nadie trabajaba.

### 3. Cuáles no, y qué costaría cada una (31-ago)

Ordenadas por cercanía al primer cliente pagando, no por dificultad. Sin horas inventadas: qué toca, de qué tamaño
es contra lo que ya existe, y si depende de una decisión de Sergio Urcullo.

#### 3.0 La previa, que no es de producto: **contestar la cola**

- **Qué desbloquea:** el primer cliente pagando. Es el único camino que ya existe entero.
- **Qué toca:** tres mensajes de WhatsApp. Cero código.
- **Depende de Sergio Urcullo:** totalmente, y solo de él. **(2-oct)** Sigue abierta («Lo que frena vender», 1).
- ~~Editar `ONIA_CATALOGO_DE_VENTA.md` §6 y `handoff/chatbot.md` para que dejen de decir que el alta está
  cerrada.~~ **(2-oct)** Hecho en el catálogo; lo que queda en `handoff/chatbot.md` es una entrada fechada del
  30-ago, historia.

#### 3.1 El bot **no devolvía nada al sistema** (D1, D2, D3)

El posicionamiento contra Sendy es esta frase: *«cuando el bot de Sendy vende, te anota en un CRM aparte; cuando el
nuestro atiende, la cita queda EN tu agenda y el cobro EN tu caja»*. El 31-ago, en el código, eso era falso:

- `bot/recepcionista.mjs` decía *«JAMAS precios, jamas agendar solo»* y *«El bot no agenda ni vende solo»*.
- El canal de intake existe pero **nadie lo alimenta**: `lib/onia-core/intake.ts` declara `whatsapp_chatwoot` →
  `lead_conversacion`, y en todo el motor no hay una sola llamada a `/api/onia-core/intake`.
- El único puente entre los dos mundos es de ida: la plataforma escribe `chatbot_knowledge` y el bot la lee.
  `bot_conversations` no existe en el schema de Prisma.

✅ **Ya no se promete en la superficie de venta (cerrado el 31-ago):** el precio se corrigió en `f47d615` («vendíamos
que el bot agenda y el bot no agenda») y el doc de pricing del chatbot, ese mismo día.

- **Qué desbloquea:** el único argumento por el que alguien elegiría el add-on de Onia en vez de Sendy, que es más
  barato (`lib/pricing.ts`, `SENDYPRO_TEARDOWN.md`). Sin esto somos un chatbot más, y más caro.
- **Escalón 1, barato:** que el recepcionista mande el link de reserva de su organización (`/book/<slug>`) en vez de
  derivar. **(2-oct) ✅ CERRADO:** `ad16b8ce` (31-ago), `recepcionista.mjs:16-18, 162, 286`. La cita queda en la
  agenda real (D2) por la reserva pública.
- **Escalón 2:** que el contacto nazca en el sistema. **(2-oct) A medias:** ya entra solo como paciente
  (`lib/chatbot/contacto-desde-chatwoot.ts`), no como lead. Lo que falta es B64.
- **Escalón 3, el cobro en la caja (D3):** sigue trabado por las credenciales del BCP (B46).

#### 3.2 Fuera de guion **no contesta nadie** (B5)

**(2-oct) Sigue igual:** `bot/recepcionista.mjs:19` y `:321`, «SIN LLM… lo contesta el humano del negocio». El bot
del cliente responde horarios, servicios, info de cita, las FAQ del dueño, la frase de campaña, foto y comprobante;
todo lo demás se deriva.

Los tres referentes contestan cualquier cosa con un LLM. La razón para no hacerlo era buena (un LLM que inventa un
precio o un diagnóstico en una clínica es un problema de verdad), pero el dueño compra «asistente 24/7» y descubre
que contesta pocas cosas, y eso se nota en la demo.

- **Qué toca:** una rama LLM **anclada al documento del negocio como única fuente**, con los guardrails de salida y
  el filtro de cifras de la visión. El molde ya está: `bot/editor-sugerir.mjs` (temp 0, schema embebido, prohibido
  inventar, y si no valida se rechaza entero). **Mediano.**
- **Depende de Sergio Urcullo:** sí, es decisión suya. Es el único punto donde se afloja el candado que nos hace
  más seguros que Sendy. La versión conservadora («contesta solo con lo que el dueño escribió, y si no está lo dice
  y deriva») lo afloja poco.

#### 3.3 El agente que trae clientes está **gateado por un add-on que no se vende**

El 31-ago el captador colgaba de `addon.inmobiliaria`, que no estaba en el catálogo. **(2-oct)** Ahora tiene su
propio `addon.captador` (`lib/onia-core/modules/agents-runtime.ts:184`), pero sigue sin precio ni venta
(`lib/platform/capacidades-con-efecto.ts:17`): el único agente que persigue plata nueva no se enciende nunca.

- **Qué toca:** decidir cómo se vende (¿va con el chatbot?, ¿es su propio add-on?). El agente ya está escrito, con
  su cola de aprobación humana y su enfriamiento. **Chico.**
- **Depende de Sergio Urcullo:** una decisión de empaquetado («Lo que frena vender», 7).

#### 3.4 **Cero métricas** del asistente (D4)

Lo único que ve el dueño es «N conversaciones atendidas hoy», calculado en el navegador sobre la lista cargada: no
es una métrica. No hay cuántas contestó solo, cuántas derivó ni qué le preguntan y no sabe. **(2-oct)** Sigue igual;
la parte de citas está en B77.

- **Qué desbloquea:** **la renovación** (el dueño ve para qué paga el add-on) y el dato para armar el precio. «Qué
  le preguntan y no sabe» es además la lista de FAQ que el dueño tiene que escribir.
- **Qué toca:** el motor ya guarda las notas del turno (`faq:horario`, `handoff:...`) en `bot_messages` y
  `bot_conversations`; falta una lectura agregada y una tarjeta en `/inbox` o `/settings/chatbot`. **Mediano**, y
  cruza el límite entre los dos mundos (las conversaciones no están en Prisma).
- **Depende de Sergio Urcullo:** no.

#### 3.5 Instagram DM y Messenger como canal del **cliente** (F3)

**(2-oct) Sigue igual:** `bot/chatwoot-onboard.mjs:78` solo crea inboxes `api` y `web_widget`. Chatwoot soporta
Instagram y Messenger; para el cliente no está cableado.

- **Qué desbloquea:** los 3 pedidos de agosto vinieron de Instagram. Para una clínica o una estética de Santa Cruz,
  el DM de Instagram no es un canal secundario.
- **Qué toca:** el tipo de inbox en el alta y el OAuth de la página del cliente; el motor no cambia. **Mediano**, y
  arrastra papeleo de Meta.
- **Depende de Sergio Urcullo:** permisos de Meta por cliente. Y el circuito propio de comentario a DM en Instagram
  tiene 2 rechazos de Meta y 0 leads: no está probado.

#### 3.6 Lo que **no** hay que copiar todavía: difusiones y voz

**(2-oct)** Ahora está en «Lo que no se copia y por qué» (N01, N02, N05). Lo que cambió: el audio entrante, que se
daba por resuelto, está caído desde el 19-sep (B41).

### 4. Lo que no se pudo verificar el 31-ago

- **El push «te escribieron» en un celular real.** **(2-oct)** Sigue sin probarse (B44).
- **El popup de Embedded Signup con un +591 real.** **(2-oct)** La prueba con el chip está en curso (B06, B10, B11).
- **Cuántos chats al mes aguanta el costo de IA con clientes de verdad.** La medición existe para una foto; para
  una conversación completa, no.
- **Si `notify_sergio` está bien acotado.** El motor emite ese efecto en cada handoff, también en el modo
  recepcionista de un cliente (`bot/bot-engine.mjs`), y viaja por n8n al Telegram de Sergio Urcullo. Con un cliente
  real puede volverse ruido; no se midió.

### 5. Resumen del 31-ago en una línea

Al nivel de ellos faltaban **dos cosas de producto** (que el bot devuelva algo al sistema y que conteste fuera de
guion) y ninguna era la que faltaba ese día: contestarle a tres clínicas que golpearon la puerta. **(2-oct)** La
primera está a medias (el link de reserva sí, el lead no), la segunda sigue igual, y la puerta sigue sin
contestarse.

Ver también: `CLAUDE.md` (una sola fuente de verdad) · `ONIA_CATALOGO_DE_VENTA.md` ·
`research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` · `research/competencia/DAPTA_COMO_FUNCIONA.md` ·
`research/competencia/SENDYPRO_TEARDOWN.md` · `docs/handoff/chatbot.md` · `historial/ONIA_PRICING_CHATBOT_PROPUESTA.md`.
