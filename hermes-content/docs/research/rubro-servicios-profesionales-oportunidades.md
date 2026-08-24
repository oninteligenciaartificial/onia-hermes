# Rubro servicios profesionales — qué debería ser

Investigación de producto. El rubro `gestios-servicios-profesionales` hoy es el catálogo de
comercio con la palabra "Servicios" encima. Este doc propone un rumbo, no un menú de opciones.

Verificado en código (`onia-platform`, 2026-08-23):
- `lib/platform/vertical-pack.ts:340` — la nav del rubro NO tiene entrada de clientes. Tiene
  "Citas" y "Agenda de hoy". Ese es el bug que se vendía.
- `lib/onboarding/vocabulario.ts:130` — el ejemplo del propio onboarding es **"Estudio Contable
  Rojas"**. El producto ya eligió el sub-rubro y nadie lo siguió.
- `/requerimientos` existe completo (dominio + APIs equipo/portal + portal público con token HMAC
  + 2 e2e con capturas). `docs/REQUERIMIENTOS_ONBOARDING.md`: *"ningún pack la lista aún en su nav"*.

---

## A) Qué necesita realmente este rubro

### El sub-rubro: **estudio contable**. No jurídico, no agencia.

1. **Es el único de los tres donde ONIA ya tiene el 80%.** Contabilidad Bolivia (IVA 13%, IT 3%,
   RCV, vencimiento por dígito de NIT), caja, por cobrar, planilla y `/requerimientos` cubren el
   mes de un contador chico. Para un estudio jurídico ONIA tiene **0%**: no hay expediente, no hay
   plazo procesal, no hay parte contraria. Para una agencia tampoco, y encima compite contra
   Notion/Trello gratis.
2. **El 1-oct-2026 le pone una pistola en la cabeza a todo el mercado.** La facturación en línea
   se vuelve obligatoria y **el contador es quien se lo resuelve a sus clientes**. Es la única
   fecha del calendario boliviano que obliga a cambiar de software a alguien que no quería.
3. **Disposición a pagar: ya cobra iguala mensual.** Entiende la suscripción porque vende una.
   Un abogado chico factura por caso y no tiene ingreso predecible; una agencia de 2 personas
   compra software cuando le sobra.
4. **Es canal, no solo cliente.** Un estudio contable con 30 clientes es un revendedor natural de
   los 6 rubros que ONIA ya vende. Ningún otro sub-rubro trae distribución adentro.

> ⚠️ **NO VERIFICADO**: no tengo un conteo de estudios contables en Bolivia ni de su gasto en
> software. El argumento es cualitativo. Antes de comprometer roadmap grande, contar en SEPREC /
> Colegio de Auditores cuántos hay en Santa Cruz y La Paz.

### Funciones, ordenadas por cuánto duele no tenerlas

| # | Función | El problema, en una frase | Costo |
|---|---|---|---|
| 1 | **Cliente = empresa con NIT** | El estudio atiende NITs con razón social, representante legal, régimen y dígito de vencimiento; hoy solo puede cargar una persona con CI, y ni eso porque la nav no tiene la pantalla | Medio |
| 2 | **Tablero de vencimientos del mes** | "¿A quién le vence mañana?" vive en un Excel; se le pasa uno, el cliente paga multa y culpa al estudio | **Chico** — la regla del dígito ya está codeada, falta la vista |
| 3 | **Requerimientos mensuales recurrentes** | La primera semana de cada mes se va persiguiendo por WhatsApp las facturas de compra y venta de 30 clientes | **Chico para encender** (ya está construido), medio para la repetición mensual |
| 4 | **Iguala mensual con cobranza automática** | Factura lo mismo a los mismos 30 clientes todos los meses y después persigue el pago uno por uno | Medio |
| 5 | **Carpeta del cliente por período** | Los PDFs llegan por WhatsApp y viven en el celular del contador; cuando Impuestos pide respaldo, no aparece | Chico — `OniaCoreDocument` ya guarda |
| 6 | **Horas gruesas por cliente + rentabilidad** | No sabe que el cliente de Bs 500/mes le come 12 horas y el de Bs 1.200 le come 3 | Medio |
| 7 | **Firma de conformidad de la declaración** | "Yo nunca aprobé ese formulario" — no hay rastro de que el cliente vio y aceptó | **Chico** — el tipo `firma` ya existe en requerimientos |
| 8 | **SIAT: emitir por cuenta del cliente** | Al 1-oct-2026 sus 30 clientes tienen que emitir en línea y ninguno sabe cómo | **Grande** — y es la palanca más grande del rubro |
| 9 | **Bandeja WhatsApp del estudio** | Todo entra por el WhatsApp personal del contador y no queda registro por cliente | Grande — existe como add-on (Chatwoot), no como parte del rubro |

### Sobre `/requerimientos`: **sí, es la pieza clave, y está apagada**

El mes de un estudio contable ES un ciclo de requerimientos: pedir → recordar → recibir → revisar
→ aceptar/rechazar → cerrar el período. Eso es exactamente la máquina que ya está construida
(`open → in_progress → done`, rechazo con motivo obligatorio, portal sin login, tope 10MB,
PDF/JPG/PNG/WebP). Lo que falta para que sea el corazón del rubro son tres cosas chicas:

1. **Ponerla en la nav** del pack (`SERVICIOS_NAV_ITEMS`) — hoy solo se llega escribiendo la URL.
2. **Plantilla mensual**: un set de requerimientos que se re-crea cada período por cliente.
3. **El recordatorio por WhatsApp** (fase 2 del doc del módulo, ya tiene dónde engancharse).

Sin eso, el rubro sigue vendiendo "Citas" a alguien que no agenda citas.

---

## B) Open source: qué se adopta y qué solo se mira

**Veredicto: no hay nada que forkear.** Todo el software del rubro (firma, time tracking,
facturación recurrente, gestión de casos) es **AGPL-3.0** o está muerto. Lo adoptable son
librerías chicas y permisivas. Verificado con `gh repo view` / `npm view` el 2026-08-23.

### Se adopta (licencia permisiva, pieza concreta)

| Repo / paquete | Licencia | Estrellas / actividad | Para qué |
|---|---|---|---|
| [szimek/signature_pad](https://github.com/szimek/signature_pad) | MIT | 12.013 · push 2026-08-12 | Capturar el trazo de firma en el portal del cliente. Hoy la "firma" es nombre + timestamp |
| [Hopding/pdf-lib](https://github.com/Hopding/pdf-lib) | MIT | 8.597 · push **2024-07-17** (estable, no muerto: es la base de medio ecosistema) | Estampar la firma y una hoja de constancia sobre el PDF entregado |
| [vbuch/node-signpdf](https://github.com/vbuch/node-signpdf) | MIT | 939 · push 2026-07-20 | Firma PKCS#7 real cuando haga falta más que conformidad |
| [commenthol/date-holidays](https://github.com/commenthol/date-holidays) (npm `date-holidays`) | ISC AND CC-BY-3.0 | `data/countries/BO.yaml` **existe** (verificado por API) | Feriados bolivianos para el cálculo de plazos y vencimientos hábiles |
| [jkbrzt/rrule](https://github.com/jkbrzt/rrule) (npm `rrule`) | BSD-3-Clause | 3.738 · push 2024-06-27 | Recurrencia de la iguala mensual y de las plantillas de requerimientos |
| [naptha/tesseract.js](https://github.com/naptha/tesseract.js) | Apache-2.0 | 38.660 · push 2026-05-17 | Leer el NIT y el importe de la foto de factura que el cliente sube por el portal |
| npm `cron-parser` | MIT | v5.10.0 | Programar el disparo de la tanda mensual |

### Solo se mira (AGPL / "other" / peso muerto — leer el modelo, no el código)

| Repo | Licencia | Estado | Qué mirar |
|---|---|---|---|
| [docusealco/docuseal](https://github.com/docusealco/docuseal) | **AGPL-3.0** | 18.352 ⭐ · activo | El editor de campos sobre PDF y el flujo de firmante |
| [documenso/documenso](https://github.com/documenso/documenso) | **AGPL-3.0** | 14.696 ⭐ · activo | Modelo de datos de documento/destinatario/audit trail |
| [kimai/kimai](https://github.com/kimai/kimai) | **AGPL-3.0** | 4.934 ⭐ · activo | Cómo modelan tarifa por cliente/proyecto/actividad |
| [solidtime-io/solidtime](https://github.com/solidtime-io/solidtime) | **AGPL-3.0** | 8.874 ⭐ · activo | UX del registro de tiempo moderno |
| [invoiceninja/invoiceninja](https://github.com/invoiceninja/invoiceninja) | "other" (Elastic-style, **requiere licencia comercial**) | 10.020 ⭐ | Facturación recurrente + portal de cliente. No tocar el código |
| [killbill/killbill](https://github.com/killbill/killbill) | **Apache-2.0** ✅ | 5.699 ⭐ · activo | Legalmente adoptable, pero es Java y pesa más que todo ONIA. Mirar el modelo de suscripción/dunning, no importarlo |
| [OpenSignLabs/OpenSign](https://github.com/OpenSignLabs/OpenSign) | "other" | 6.900 ⭐ | Idem DocuSeal, sin ventaja |

### Gestión de casos / expedientes y PSA: **no existe nada usable**

`gh search repos "legal case management"` / `"law firm practice management"` devuelve proyectos
de 0-39 estrellas, sin licencia declarada, muchos de ellos proyectos de grado. El mejor con
licencia clara es [Open-Scaffold-Labs/OpenLawFirm](https://github.com/Open-Scaffold-Labs/OpenLawFirm)
(MIT, **0 estrellas**, push 2026-05-21) — no es una base, es un esqueleto. Argumento extra para
no elegir el sub-rubro jurídico.

### SIAT Bolivia: **el open source está muerto**

Lo que hay (verificado): `yamaka/FELBO` (0⭐, 2023, sin licencia), `arielfad/cuf-siat-bolivia`
(0⭐, 2024, sin licencia), `DeGsoft/firma-factura-electronica-siat-java` (Apache-2.0, **1⭐**,
último commit 2023-06), los 4 repos de `PhoenixCoderGit` (0-1⭐, 2023). `gh search code
"codigoUnicoFactura SIAT"` devuelve **cero** resultados. Nadie publicó el algoritmo del CUF ni un
cliente del SIAT mantenido. ONIA lo construye o no lo tiene — y quien lo tenga primero se lleva
el rubro entero.

---

## C) Innovación: qué traer a un estudio boliviano de 3 personas

1. **El mes es el objeto, no el proyecto.** Harvest/Toggl/Clio organizan por proyecto o matter
   porque su cliente factura por hora. Un contador boliviano vive en **períodos**: agosto se
   abre, se persigue, se declara, se cierra. La pantalla principal debería ser una grilla
   *clientes × período* con un semáforo por celda, no un dashboard de KPIs.
   → *Problema*: hoy no hay una sola pantalla que responda "¿cuánto me falta para cerrar agosto?".

2. **Requerimientos que se piden solos por WhatsApp.** Karbon y Canopy mandan el recordatorio por
   mail. En Bolivia el mail no se lee. La tanda mensual sale por WhatsApp con el link del portal,
   y el cliente sube la foto de la factura desde el celular sin crear cuenta (el portal ya
   funciona así).
   → *Problema*: la primera semana del mes del contador se va en perseguir.

3. **Horas retroactivas en bloques, no cronómetro.** Nadie en un estudio de 3 personas le da
   "play" a un timer. Al cerrar el día, una fila por cliente y bloques de 15 minutos. Con eso
   solo alcanza para el número que importa: **Bs por hora real por cliente**, que es el que
   dispara la conversación de subir la iguala.
   → *Problema*: la iguala no se actualizó desde antes de la devaluación y nadie sabe cuál subir.

4. **El SIAT como producto del estudio, no como feature de ONIA.** El contador emite por cuenta
   de sus clientes desde una sola pantalla, y le cobra a cada uno por eso. ONIA le vende la
   herramienta y él se queda el margen. Es la diferencia entre venderle a un estudio y que un
   estudio te venda a 30 empresas.
   → *Problema*: 1-oct-2026, 30 clientes que no saben emitir en línea.

5. **La conformidad firmada como default.** Cada declaración que sale lleva la firma del cliente
   en el portal antes de presentarse. Cuesta poco (el tipo `firma` ya existe) y borra el "yo
   nunca aprobé eso", que es el riesgo profesional real del contador.

6. **Precio con cláusula de ajuste visible.** Con la devaluación, un contrato en Bs a 12 meses se
   licúa. Mostrar la iguala con su fecha de revisión y proponer el ajuste automáticamente es una
   feature de producto en Bolivia, no un detalle contable.

**Lo que NO hay que copiar:** el timer global de Clio, el módulo de trust accounting, la carga de
tarifas por abogado y todo lo que asume facturación por hora al cliente final. No es el modelo.

---

## D) Referencias visuales

| URL | Qué robar, concreto |
|---|---|
| https://www.getharvest.com/time-tracking/time-tracking-dashboard | Tarjetas de entrada apiladas con **"Total de hoy" al pie**, y el **monto no facturado resaltado** dentro del reporte. Portar como "Bs sin cobrar" arriba de la grilla del mes |
| https://www.withmoxie.com/product-pages/client-portal | Portal **sin cuenta**, URL propia, y **prompts proactivos al entrar** ("pagá esto, firmá esto, aprobá esto"). Es literalmente lo que le falta a `/portal/[token]`: hoy muestra la lista, no empuja la acción |
| https://www.getcanopy.com/accounting-client-portal/ | **Document Checklist** móvil: escanear con la cámara, usar una foto, pegar del portapapeles. El cliente boliviano ya le manda foto de la factura al contador — que la mande al checklist |
| https://help.clio.com/hc/en-us/articles/9289741706779-Time-Entries | El **acceso al registro de tiempo desde el header, en cualquier pantalla**. Robar el emplazamiento (siempre a un clic), no el cronómetro |
| https://karbonhq.com/resources/time-billing-software-accountants/ | Comparativa que la propia categoría escribe sobre sí misma: sirve para saber qué da por sentado un contador que ya evaluó software |
| https://mobbin.com/explore/web/screens/dashboard | Galería de dashboards web reales, para la grilla clientes × período |
| https://www.saasui.design/best-saas-ui-design-inspiration | Índice de galerías de UI de SaaS por tipo de pantalla |

> `land-book.com` devolvió **HTTP 403** al fetch — existe, pero **NO VERIFICADO** su contenido
> desde acá. `godly.website`: **NO VERIFICADO**, no lo abrí.

---

## Lo primero que hay que hacer (opinión)

Tres cambios chicos, en este orden, y el rubro deja de estar roto y empieza a tener rumbo:

1. Pantalla de clientes en la nav, con ficha de **empresa con NIT** (arregla el bug de venta).
2. `/requerimientos` en `SERVICIOS_NAV_ITEMS` + plantilla mensual (enciende lo ya construido).
3. Tablero de vencimientos por dígito de NIT (usa una regla que ya está en el código).

Recién después: iguala recurrente, horas gruesas y SIAT. El SIAT es la apuesta grande y tiene
fecha: **1-oct-2026**.
