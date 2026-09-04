# Rubro dental y estética/spa — qué falta, qué se adopta, qué diferencia

Investigación para ONIA. Mercado: Bolivia, negocios de 1-5 personas que hoy usan cuaderno o Excel.

**Cómo se verificó cada cosa.** Los huecos de la sección A se comprobaron leyendo
`C:\dev\proyectos\onia-platform\prisma\schema.prisma` (lista de modelos y campos), no de memoria.
Cada repo de la sección B se verificó con `gh api repos/...` (licencia SPDX, estrellas, `pushed_at`
reales al 2026-08-23) o con `npm view`. Lo que no pude renderizar está marcado **NO VERIFICADO**.

---

## A) Qué le falta de verdad

Ordenado por cuánto duele, no por cuán lindo es.

| # | Hueco | El problema del negocio | Costo |
|---|---|---|---|
| 1 | **Cuenta corriente del paciente y pago en cuotas** | Un tratamiento cuesta más que el sueldo del mes: el paciente paga en partes y la dueña lo anota en un cuaderno. Hoy `Payment` exige `invoiceId`, así que no existe "cuánto me debe Juan en total" ni una cuota con fecha de vencimiento. | Medio |
| 2 | **Presupuesto firmado y su tasa de aceptación** | El odontólogo cotiza 5 tratamientos, el paciente acepta 2, y nadie vuelve a llamar por los otros 3. No hay modelo de presupuesto para pacientes (existe `OniaCommerceQuote`, pero es del módulo comercio y no cuelga de `Patient`). | Medio |
| 3 | **Lista de espera que rellena el hueco** | Cancelan la cita de mañana 10:00 y el sillón queda vacío: pérdida pura. `NO_ASISTIO` se registra, pero no hay nada que reaccione a la cancelación. | Chico |
| 4 | **Consentimiento informado firmado** | Toda la firma es en papel y se pierde; es también la única defensa legal si hay reclamo. Cero modelos de consentimiento o firma en el schema. | Chico |
| 5 | **Fotos clínicas antes/después, con permiso de publicación aparte** | La estética vive de esto y hoy vive en el celular personal de la dueña. Falta adjuntar foto al paciente y, separado, la marca "esta la puedo publicar". | Medio |
| 6 | **Bonos/paquetes de sesiones prepagadas** | "Compró 10 sesiones de láser, le quedan 4" — el corazón comercial de estética/spa, y además plata cobrada que todavía se debe en servicio. No existe. | Medio |
| 7 | **Recall / reactivación** | El paciente de limpieza vuelve solo si alguien se acuerda de llamarlo; a los 7 meses ya se fue a otro lado. Solo hacen falta fechas, ningún dato raro. | Chico |
| 8 | **Repricing por tipo de cambio** | Los insumos dentales son importados y en dólares; con el TC flotando (RM 245/2026) la lista de precios queda vieja en semanas. Ya está diseñado en `onia-core/ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md` para importadoras: hay que **encenderlo** para dental, no rediseñarlo. | Chico |
| 9 | **Agenda por sillón, no solo por profesional** | Dos sillones y un odontólogo, o un sillón y dos: `Appointment` solo tiene `doctorId`, así que se puede sobrevender el box. | Medio |
| 10 | **Arqueo de caja diario** | Cobran en efectivo y al cierre nadie sabe si cuadra. Existe `OniaCommerceCashCount` en comercio: es reuso, no obra nueva. | Chico |
| 11 | **Ficha de estética (no odontograma)** | El único mapa clínico es `ToothRecord`. Estética necesita zona del cuerpo/rostro, alergias, contraindicaciones y parámetros del equipo por sesión. | Medio |
| 12 | **Comisión por tratamiento al profesional asociado** | El odontólogo asociado cobra % por procedimiento, no sueldo. `OniaEmpresaCommission` existe para colaboradores comerciales: hay que enchufarlo a `PatientTreatment`. | Chico |

> **Lo más barato de todo:** 3 de estos 12 (arqueo, comisión, presupuesto) ya tienen un
> hermano funcionando en el módulo comercio/empresa. Portar antes que escribir.

---

## B) Open source que podamos adoptar o portar

### Sirve (licencia permisiva verificada)

| Repo | Licencia | ⭐ | Último commit | Qué sirve | Veredicto |
|---|---|---|---|---|---|
| [szimek/signature_pad](https://github.com/szimek/signature_pad) | MIT | 12.013 | 2026-08-12 | Firma en canvas, táctil, suave. npm `signature_pad@5.1.4` MIT. | **Adoptar** (huecos 2 y 4) |
| [Hopding/pdf-lib](https://github.com/Hopding/pdf-lib) | MIT | 8.597 | 2024-07-17 (dormido, estable) | Estampar la firma y generar el PDF del consentimiento/presupuesto. | **Adoptar** |
| [nerdyman/react-compare-slider](https://github.com/nerdyman/react-compare-slider) | MIT (npm v4.0.0) | NO VERIFICADO (estrellas) | npm publicado 2026-03-20 | Comparador antes/después con handle arrastrable. | **Adoptar** (hueco 5) |
| [node-saml/xml-crypto](https://github.com/node-saml/xml-crypto) | MIT (npm 6.1.2) | NO VERIFICADO | npm publicado 2025-04-24 | Firma XMLDSig — lo que el SIAT exige y nadie regala hecho. | **Adoptar** |
| [calcom/cal.com](https://github.com/calcom/cal.com) (redirige a `calcom/cal.diy`) | **MIT** — leí el archivo LICENSE, son 21 líneas de MIT limpio | 47.885 | 2026-08-08 | La lógica de disponibilidad: slots, buffers, tiempo mínimo de aviso, timezones. Ojo: fue AGPL en el pasado, hoy no. | **Portar la lógica de slots** (huecos 3 y 9) |
| [schedule-x/schedule-x](https://github.com/schedule-x/schedule-x) | MIT | 2.536 | 2026-08-14 | Calendario moderno. Sus `packages/` **no incluyen vista por recurso**, así que multi-sillón no sale gratis. | Evaluar |
| [SGrappelli/pronto](https://github.com/SGrappelli/pronto) | MIT | 40 | 2026-08-22 | Booking + CRM + POS con recordatorios por WhatsApp, self-hosted. Alcance casi idéntico al nuestro. | **Referencia de alcance** |
| [clawnify/OpenDentist](https://github.com/clawnify/OpenDentist) | MIT | 13 | 2026-08-22 (repo creado 2026-04-28) | Agenda multi-sala + planes de tratamiento. Muy joven para depender de él. | Referencia |
| [clawnify/OpenSalon](https://github.com/clawnify/OpenSalon) | MIT | 28 | 2026-08-23 | Equivalente para estética/spa. | Referencia |
| [biomathcode/react-odontogram](https://github.com/biomathcode/react-odontogram) | ⚠️ `package.json` dice MIT pero **el repo no tiene archivo LICENSE** (la API de GitHub devuelve `null`) | 73 | 2026-04-30 | Ya tenemos odontograma. Sin LICENSE en el repo, no lo tocaría. | Solo mirar |
| `rrule` (npm) | BSD-3-Clause | — | npm publicado 2023-11-10 | Recurrencias para recall e intervalos por tratamiento. | Adoptar |

### No sirve — verificado, para que nadie lo vuelva a proponer

`documenso/documenso` **AGPL-3.0** (14.696⭐) · `formbricks/formbricks` **NOASSERTION** (12.809⭐) ·
`invoiceninja/invoiceninja` **NOASSERTION** (10.020⭐) · `twentyhq/twenty` **NOASSERTION** (55.410⭐) ·
`openemr/openemr` **GPL-3.0** · `alextselegidis/easyappointments` **GPL-3.0** ·
`frappe/erpnext` **GPL-3.0** · `alselawi/apexo-flutter` **GPL-3.0** (dental, 69⭐, muerto desde 2025-01).

Dos trampas que se ven MIT y no lo son:

- **FullCalendar**: el core es MIT (20.615⭐, 2026-07-24), pero la vista de recursos/timeline
  — justo lo que hace falta para multi-sillón — vive en `fullcalendar/fullcalendar-scheduler`
  (redirige a `fullcalendar-workspace`), licencia **NOASSERTION**, es el producto premium de pago.
- **Chatwoot** (36.113⭐): **NOASSERTION**. Correrlo self-hosted para nosotros es una cosa;
  redistribuirlo dentro de lo que le vendemos a un cliente es otra. Revisar antes de empaquetarlo.

Mención aparte: `WhiskeySockets/Baileys` (**MIT**, 10.819⭐, 2026-08-23) habla WhatsApp sin API
oficial. Funciona, pero es contra los ToS de Meta y el número del cliente es lo que se banea.
No lo pondría dentro de un producto que cobramos.

### SIAT Bolivia: no hay nada que adoptar

Busqué `siat facturacion bolivia` y `facturacion electronica bolivia`. Todo lo que apareció
tiene **0-2 estrellas y ningún archivo de licencia**: `kplian/sis_siat_old` (2023),
`yamaka/FELBO` (2023), los cuatro repos de `PhoenixCoderGit` (el más nuevo 2024-06),
`Nicky-nn/isi_odoo` (2025-08). Sin licencia = todos los derechos reservados: se pueden **leer
como referencia del XML y la firma**, no copiar. `sinticbolivia/MonoInvoices*ApiClient` son
clientes de una **API comercial de terceros** — es la opción "comprar en vez de construir",
no open source. Conclusión: la firma XML se arma con `xml-crypto` y el resto es nuestro.

---

## C) Innovación que diferencia

Cada idea anclada a lo que le pasa al negocio, no a la tecnología.

1. **El hueco se rellena solo por WhatsApp.** Cancelan a las 8 de la mañana; el sistema ofrece
   ese horario a la lista de espera por WhatsApp y el primero que contesta "SI" se lo queda.
   Curve Dental cobra por esto y lo llama SmartFill; ningún competidor boliviano lo tiene y
   el hueco de mañana 10:00 vale Bs 300 reales. Usa lo que ya está: `confirmToken` y el canal
   de WhatsApp vivo.

2. **El presupuesto se firma en el celular del paciente, ahí mismo.** El odontólogo muestra el
   plan en la tablet, el paciente firma con el dedo, sale un PDF por WhatsApp. Y la pantalla que
   nadie tiene: **cuánto presupuestaste este mes, cuánto te aceptaron, cuánto cobraste.** Ese
   número es el que decide si la clínica crece.

3. **Cuenta corriente del paciente con recordatorio de cuota.** Fiar es cultural acá y hoy vive
   en un cuaderno. "Juan debe Bs 1.200, cuota de Bs 300 vence el viernes" → mensaje automático.
   Es el hueco #1 y ningún sistema local lo hace bien.

4. **Botón "repreciar al tipo de cambio de hoy".** Con el TC flotando desde junio 2026, la lista
   de precios de una clínica que importa insumos queda vieja en semanas. Guardás el costo en USD
   y repreciás contra el TC diario del BCB. **La investigación ya está hecha** para importadoras:
   esto es encenderlo en dental, no diseñarlo.

5. **Antes/después con dos permisos distintos.** Una casilla es "guardar en la historia clínica",
   otra es "puedo publicarlo". La segunda arma el post con el comparador ya montado. La estética
   vive de Instagram y hoy eso pasa por el celular personal de la dueña, sin permiso escrito.

6. **"Hace 7 meses que no viene".** Una lista, ordenada, de quién debería haber vuelto y no volvió,
   con el botón de escribirle. Es plata que ya está en la base de datos.

**Lo que NO propongo, y por qué:** IA de diagnóstico sobre radiografías (necesita un dataset
etiquetado que no tenemos y un sensor que el cliente no compró) y recepcionista de voz con IA
(el minuto de voz cuesta y este cliente factura en efectivo). Ambas las venden Dentrix y Zenoti;
para un negocio de 1-5 personas en Bolivia son humo caro.

---

## D) Referencias visuales

Las cinco primeras las abrí y leí. Las últimas dos devolvieron 403 al renderizar.

| # | Referencia | Qué patrón concreto robar |
|---|---|---|
| 1 | [Fresha for Business](https://www.fresha.com/for-business) ✅ leída | La **ficha de cliente 360 en una sola vista**: historial de reservas, preferencias, método de pago y valor de vida juntos, sin pestañas. Y el depósito previo presentado como *función anti-no-show*, no como fricción de cobro. |
| 2 | [Curve Dental](https://www.curvedental.com/) ✅ leída | **SmartFill** (emparejar lista de espera con cancelaciones) como feature con nombre propio en el nav. Y el plan de tratamiento con **eSignature presentado "chairside"** — la firma pasa en el sillón, no en recepción. |
| 3 | [Zenoti](https://www.zenoti.com/) ✅ leída | **"Memberships & Packages", "Consent Forms" y "Photo Manager" son items de primer nivel del menú**, no ajustes escondidos. Eso es la jerarquía correcta para estética: lo prepagado y la foto son el negocio. |
| 4 | [Dentrix](https://www.dentrix.com/products/dentrix) ✅ leída | **Cuentas por cobrar como módulo propio**, al lado de facturación y no dentro. Más el dashboard que separa *producción* de *cobranza*: dos números distintos, y confundirlos es el error clásico. |
| 5 | [Booksy Biz](https://biz.booksy.com/en-us) ✅ leída | **Comisión y propina autocalculadas** en la misma pantalla del cobro, y los sellos de fidelidad digitales. También: reservar desde Instagram como entrada principal — en Bolivia ese es el canal real. |
| 6 | [Dribbble — tag `dental-dashboard`](https://dribbble.com/tags/dental-dashboard) · shots [27151491](https://dribbble.com/shots/27151491-DentalPro-Dental-Practice-Management-Dashboard) y [20652471](https://dribbble.com/shots/20652471-Dental-Management-System) | URLs del índice de búsqueda. **Contenido NO VERIFICADO** — Dribbble devolvió 403 al renderizar. Abrir a mano antes de usarlos como referencia. |
| 7 | [Mobbin — flujos de booking](https://mobbin.com/explore/mobile/flows/booking-reserving) · [Land-book health & medical](https://land-book.com/gallery?category=health-medical) | Ambas 403 al fetch (protección anti-bot). URLs del índice de búsqueda, **contenido NO VERIFICADO**. Mobbin exige cuenta. |
