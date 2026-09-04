# Sales kit — quién lo usa hoy

> **2026-08-27, decisión de Sergio: NO hay equipo de ventas.** No hay vendedora, no
> hay colaboradores comerciales, no hay nadie externo vendiendo Onia.
> **El que vende es Sergio.**

## Qué significa para lo que hay acá

Este material **no se descarta**: enseña a vender, y eso le sirve al que vende.
Lo que se archivó es distinto — todo lo que asumía **un vendedor tercero**:
paquetes de acceso, decks de reclutamiento, esquemas de comisión, runbooks de
calendario para terceros, un CRM de vendedores. Esa gente no existe, y un doc que
la supone manda a cualquier sesión a construir para un puesto vacío.

Fue a `hermes-content/docs/historial/`: es una foto de cuando se planeaba un
equipo, y como toda foto **no es fuente de verdad**.

| Archivo | Para qué sirve hoy |
|---|---|
| `01-ONE-PAGER-OFERTA.md` | qué se ofrece, en una hoja |
| `02-GUION-DEMO.md` | cómo se muestra el producto sin improvisar |
| `03-SCRIPTS-WHATSAPP.md` | primer contacto y seguimiento |
| `04-OBJECIONES.md` | qué responder cuando frenan |
| `05-CHECKLIST-CAPTURAS.md` | qué capturas hacen falta antes de mostrar |

## Reglas que siguen mandando

- **Los precios se LEEN**, no se escriben acá: planes en
  `onia-platform/lib/subscription-plans.ts`, add-ons en `lib/pricing.ts`. Si un
  archivo de esta carpeta dice otro número, está roto.
- **No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos
  o cifras de resultados.
- **No exhibir obra**: nada de "muy pronto", "beta" ni "en construcción" en algo
  que ve un cliente.
- 🔴 **La factura fiscal NO se ofrece.** Onia todavía no emite factura con valor
  fiscal: el trámite ante el SIN está en curso y **sin fecha**
  (`hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md` es la fuente). No se
  nombra en ningún mensaje de arranque, no va en ninguna tabla de planes, no se
  cobra y **no se da una fecha aunque la pidan**. Si el prospecto pregunta, la
  respuesta entera está en `01-ONE-PAGER-OFERTA.md` §«La factura del SIN».

  > Nace del 2026-09-04: los cinco archivos de esta carpeta decían «factura SIAT
  > incluida en los 3 planes, sin costo aparte» —el one-pager lo ponía con ✅ en
  > la tabla de precios y el guion mandaba a mostrarlo en pantalla—. Es la
  > mentira más cara que teníamos: el cliente que más factura es la clínica, y
  > la descubre justo después de pagar. `ONIA_V1_ALCANCE.md` la marcaba como
  > bloqueante para escribirle a los leads.
- **Se vende el SISTEMA; el asistente es un add-on.** El titular es la gestión
  del negocio (agenda, fichas, caja, cobros, contabilidad). El asistente de
  WhatsApp es una línea de add-ons, nunca el encabezado.
- **Cero autobombo.** Nada sobre nosotros, el equipo, la tecnología ni "somos
  chicos pero". La objeción se contesta con lo que el sistema hace por SU
  negocio, o con los 14 días de prueba para que lo vea solo.
- **Un solo producto: Onia.** `DentalGest` no es una marca ni un producto — al
  cliente se le nombra su rubro ("el módulo dental"). Los cinco archivos lo
  usaban como nombre comercial hasta el 2026-09-04.

## Lo que NO hay que volver a crear

Mientras no exista un equipo de ventas, **no se escribe material dirigido a un
vendedor**: ni onboarding de vendedores, ni tablas de comisión, ni decks de
reclutamiento, ni CRM de fuerza de ventas. Si aparece la necesidad, primero
existe la persona y después el documento — al revés se llenó esta carpeta de
material para un puesto que nunca se ocupó.
