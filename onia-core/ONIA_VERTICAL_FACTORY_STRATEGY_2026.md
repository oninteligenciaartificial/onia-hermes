# Onia Vertical Factory Strategy 2026

Fecha: 2026-07-03.
Estado: estrategia canonica de verticales y go-to-market.
Owner: Onia / Hermes.

## Tesis

Onia no vende un ERP generico. Vende **sistemas especializados por rubro**
construidos sobre un solo nucleo (ONIA Core) y un solo motor (GestiOS base).

```text
ONIA Core (contrato unico)
  + motor GestiOS (tenant, UI, permisos, reportes)
  + pack vertical del rubro (vocabulario, checklists, KPIs, intake, oferta)
  = producto especializado que el cliente siente hecho para su negocio
```

ProveeGest **no es solo electrico**. Es el vertical de distribucion B2B
(importadoras, mayoristas, distribuidoras de cualquier rubro). Bolivian
Electric es el primer skin de validacion porque es cliente real. Lo mismo
aplica a todos los verticales: el primer cliente define el skin, el pack queda
reutilizable para todo el rubro.

## Que contiene un pack vertical

| Pieza | Entidad core que la implementa | Ejemplo dental | Ejemplo distribucion |
|---|---|---|---|
| Vocabulario | `WorkItem.type`, `BusinessPartner.partnerType` | presupuesto, recall | cotizacion, reposicion |
| Rutinas | `ProcessChecklist` | apertura consultorio, consentimiento | seguimiento cotizacion, recepcion mercaderia |
| Panel del dueno | `SavedView` sobre `owner_dashboard` | citas hoy, no asistio, cobros | pipeline por vendedor, cotizaciones vencidas |
| Intake | `intakePolicy` canales | formulario web + WhatsApp gated | WhatsApp vendedores + formulario B2B |
| Oferta | registry + propuestas | Bs. 320-1500/mes | validacion con BE |

Regla dura: un pack NO agrega tablas al core. Si un rubro parece necesitar una
entidad nueva, primero se verifica si es dominio vertical (vive en el producto,
como Patient o Animal) o si es transversal real (entra al contrato con proceso
de version).

## Mapa de rubros (cobertura total)

Ver `contract.json > verticalFactory.roadmapRubros`. Resumen:

| Ola | Rubros | Vehiculo |
|---|---|---|
| 1 (ahora) | Dental, Distribucion B2B | DentalGest beta, ProveeGest + Bolivian Electric |
| 2 (post-beta) | Pymes general, Agro ganaderia | GestiOS, Ganadero OS |
| 3 (packs rapidos) | Estetica, Veterinaria, Gastronomia, Servicios profesionales | packs sobre DentalGest/GestiOS |
| 4 (explorar) | Educacion, Construccion/ferreteria, Turismo | packs sobre GestiOS/ProveeGest |

Criterio de priorizacion de un rubro nuevo (en orden):

1. Cliente real dispuesto a pagar (como Bolivian Electric).
2. Dolor pagable y repetido en el rubro (cotizaciones, citas, cobranza).
3. Distancia al pack mas cercano (estetica esta a un paso de dental;
   ferreteria a un paso de distribucion).
4. Capacidad de soporte de Onia en ese momento.

## Estrategia de desarrollo

1. **Core primero (hecho):** contrato beta v0.3.0 con 17 entidades, panel del
   dueno e intake definidos. El validador es el gate.
2. **DentalGest beta:** primera implementacion completa del patron. Todo lo
   que se construya (panel, work items, aprobaciones) se disena como motor
   reutilizable + pack dental, no como codigo dental suelto.
3. **ProveeGest con Bolivian Electric:** segunda implementacion. Valida
   partners B2B, cotizaciones con SLA, aprobaciones de descuento y tableros
   por vendedor/sucursal. El intake WhatsApp ya construido (seller-router,
   Chatwoot) se conecta como canal de intake normalizado.
4. **Factory mode:** desde el tercer vertical, meta = pack nuevo en semanas:
   config + checklists + vistas + oferta. Cero codigo core nuevo.
5. Cada vertical nuevo actualiza: adapter (si es producto separado), registry
   comercial, skill de orquestacion de Hermes y mapa de adopcion.

## Estrategia de ventas

Palancas ya existentes que la factory aprovecha:

- **Pipeline CRM y prospeccion** (`CRM_AND_PROSPECTING.md`): prospectar POR
  RUBRO con el dolor del pack, no con features genericas. El mensaje es
  "sistema para clinicas dentales" / "sistema para importadoras", nunca
  "software de gestion".
- **Web-factory como puerta de entrada:** la web (Bs. 790-2900) captura al
  negocio; cuando pide seguimiento/cotizaciones/reportes se escala al vertical
  con core (SaaS mensual). La web alimenta el intake (`web_form`).
- **Oferta de arranque** (registry, valida hasta 2026-07-31, 20 clientes):
  usarla para cerrar los primeros casos por rubro.
- **Caso de exito por rubro antes de escalar:** 1 cliente feliz por vertical
  (clinica para DentalGest, BE para ProveeGest) genera el material de venta
  del rubro completo (demo con datos del rubro, testimonio, numeros).
- **Comisiones:** vendedor origen cobra por venta nueva (regla ya definida);
  los packs nuevos amplian el catalogo vendible sin subir costo de desarrollo.
- **Consultoria Onia como cuña:** para negocios que no saben que comprar,
  la auditoria express detecta el rubro y aterriza en el vertical correcto.

## Metricas de la factory

| Metrica | Meta inicial |
|---|---|
| Tiempo de pack nuevo (rubro adyacente) | <= 4 semanas |
| Clientes cobrados por vertical antes de abrir otro | >= 1 caso de exito |
| Reuso de core por vertical | 100% (cero tablas core nuevas por pack) |
| Escalado web -> SaaS | medir % de clientes web que suben a vertical |
