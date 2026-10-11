# Sales kit — quién lo usa hoy

> **2026-08-27, decisión de Sergio Urcullo: NO hay equipo de ventas.** No hay vendedora,
> no hay colaboradores comerciales, no hay nadie externo vendiendo Onia.
> **El que vende es Sergio Urcullo.**

## Qué hay acá

Material para vender Onia a su cliente ideal (clínica de Santa Cruz, 2-6 profesionales con
recepción; ver `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`). Todo le habla al dolor #1: el
paciente con un tratamiento a medias que no volvió a agendar.

| Archivo | Para qué sirve hoy |
|---|---|
| `01-ONE-PAGER-OFERTA.md` | qué se ofrece, en una hoja (y en texto para WhatsApp) |
| `02-GUION-DEMO.md` | cómo se muestra el producto sin improvisar |
| `03-SCRIPTS-WHATSAPP.md` | primer contacto, re-apertura y seguimiento |
| `04-OBJECIONES.md` | qué responder cuando frenan |
| `05-CHECKLIST-CAPTURAS.md` | qué capturas hacen falta antes de mostrar |
| `06-VSL-DENTAL.md` | el video de venta (largo de ~4 min y corto de 60 s), cada frase atada a su fila de `ONIA_PROMESA_VS_PRODUCTO.md`; no se publica hasta tener la cuenta demo |
| `07-LEAD-DE-PAUTA-PRIMERAS-24H.md` | qué hace Sergio Urcullo con un lead que escribe primero desde un anuncio de la prueba 1 (D7-D11): el reloj de 24 h, la primera respuesta de usted según el caso, qué se contesta y qué se anota. Plan: todavía no hay anuncios creados |

**Kit 1.0 (2026-09-28).** Se reescribió entero sobre lo que hace la 1.0 de onia-platform
(candidato `ed163e26`, verificado contra el código). Lo que cambió respecto del kit de julio:

- **Marca**: Onia. El kit vendía "DentalGest", que era el nombre viejo del pack dental.
- **Precios**: los de la escalera vigente (Básico, Crece, Profesional, Completo, Empresa).
  El kit seguía cotizando los tres planes viejos con sus montos viejos.
- **Facturación**: la emisión SIAT está apagada. Lo real es "cada venta queda lista para
  cargar en el portal gratuito del SIN"; el kit prometía la factura "sin re-tipear".
- **Agentes**: se vende lo que existe, con el nombre de lo que hace (29-sep-2026): Reprograma,
  Vuelve a citar, Confirma citas y Recuerda cobros (en comercio e importadora, Avisa stock
  bajo; en importadora, Sigue cotizaciones). Todos proponen; el dueño aprueba cada mensaje;
  ninguno manda, cobra, compra ni reserva solo. Nunca decir «Cobra» ni «Repone stock».
- **Agente conversacional de WhatsApp** (antes "chatbot con IA"): contesta lo cargado,
  nunca da precios, manda el link de la agenda y pasa lo demás a una persona. No califica,
  no cotiza y no agenda solo. Lo de las fotos se sacó el 3-oct: el catálogo §8 no deja
  decirlo (en duda, ningún negocio en ese modo).
- **Implementación**: no se regala un servicio de carga de datos que nadie puede hacer. Lo
  real: no se cobra implementación, el dueño importa sus pacientes con el asistente de CSV.
- **Pago**: mensual o anual (10 meses), con el QR del BCP desde el checkout. No existe el
  cobro trimestral que decía el kit.

⚠️ **El agente Reprograma entra con la 1.0.** Hasta que la 1.0 esté en producción, no se
muestra en vivo ni se promete como disponible hoy (las capturas 6-8 esperan al deploy).

> **Archivados el 2026-09-28 (Sergio Urcullo)**: el deck de la reunión de Santa Cruz
> del 1-ago (`presentacion-scz-20260801/`) y el muestrario inmobiliario
> (`inmobiliario/`) se movieron a `hermes-content/docs/historial/`. Prometían de más
> —«el chatbot responde, agenda y cotiza solo», «agentes de IA autónomos 24/7»,
> «el agente atiende cada consulta y la persigue»— y el muestrario exhibía obra
> («Fase 1», un rubro que no se vende). Son fotos de un día: no se reenvían.

## Reglas que siguen mandando

- **Los precios se LEEN**, no se escriben de memoria: planes en
  `onia-platform/lib/subscription-plans.ts`, add-ons en `lib/pricing.ts`. Si un archivo de
  esta carpeta dice otro número, está roto, y el gate lo pone en rojo (abajo).
- **No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras
  de resultados. Los tickets para la cuenta son los del prospecto, no de mercado.
- **No exhibir obra**: nada de "muy pronto", "beta" ni "en construcción" en algo que ve un
  cliente. Lo que no está vivo no se nombra.
- **Nada de autobombo**: ni sobre nosotros, ni sobre otros sistemas.

## El gate

`npm run test:venta-honestidad` (`scripts/venta-honestidad.test.mjs`) lee los precios del
código publicado de onia-platform y falla si el kit:

- cita un monto en Bs que el código no cobra (planes, add-ons, recarga, tarifa de Meta);
- nombra un plan que no existe (los viejos Pro y Full);
- vende la marca vieja DentalGest;
- promete la factura "sin re-tipear" o que "sale sola" mientras el emisor no emita;
- promete emitir la factura SIAT;
- promete lo que el producto no hace hoy, con las MISMAS formas que vigilan la web
  (`web-factory/apps/onia-platform/scripts/promesa-que-el-producto-cumple.mjs`): que la IA
  escribe cada mensaje, que algo sale solo por WhatsApp, «agenda por profesional», que
  entiende fotos, que el sistema agenda solo, o un resultado («recupera pacientes»).

## TODO interno

- [ ] **Panel «Lo que te dejó Onia»**: está en construcción para la 1.0. Cuando salga
      integrado y verificado en producción, sumarlo al one-pager (§ Lo que te resuelve) y al
      guion de demo (§4, después de Pendientes). Hasta entonces no se nombra.
- [ ] Sacar las capturas de `05-CHECKLIST-CAPTURAS.md` (las del agente Reprograma, después del
      deploy de la 1.0).

## Lo que NO hay que volver a crear

Mientras no exista un equipo de ventas, **no se escribe material dirigido a un vendedor**:
ni onboarding de vendedores, ni tablas de comisión, ni decks de reclutamiento, ni CRM de
fuerza de ventas. Si aparece la necesidad, primero existe la persona y después el
documento: al revés se llenó esta carpeta de material para un puesto que nunca se ocupó.
