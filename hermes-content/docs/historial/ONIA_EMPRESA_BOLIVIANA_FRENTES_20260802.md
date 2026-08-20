# Cómo vive una empresa boliviana — los frentes reales vs lo que Onia cubre

> **2026-08-02.** Pedido de Sergio: *"pensá primero como una empresa en Bolivia — con
> empleados, contabilidad, flujo de caja, tipo de cambio, lo legal — decime cómo está
> estructurado esto hoy y qué tenemos que mejorar"*. Regla de la skill fiscal: tasas
> con fuente citada; lo no verificado se marca ⚠️ y se confirma con RND/DS vigente
> ANTES de cablearlo en código. Esto es mapa estratégico, no asesoría contable.

## 1. Los 7 frentes de una empresa formal en Bolivia

### F1 — Nacer y existir (legal/abogacía)
SEPREC (matrícula de comercio, renovación anual) → NIT en el SIN (régimen general) →
licencia de funcionamiento municipal → ROE (Registro Obligatorio de Empleadores,
Min. Trabajo) si contrata. Con abogado: testimonio de constitución (si es SRL/SA),
poderes del representante, contratos laborales **visados ante el MTEPS**, contratos
comerciales. La unipersonal (la mayoría de nuestros clientes) se salta el testimonio
pero NO el resto.

### F2 — Tener empleados (laboral / RRHH) — el frente más pesado
- Contrato escrito visado · planilla mensual declarada (Oficina Virtual del MTEPS).
- **Cargas sociales**: aporte laboral a la Gestora Pública (~12,71% del bruto ⚠️
  desglose exacto a verificar) que el empleador RETIENE, + aporte patronal (CNS 10% +
  riesgo profesional + vivienda + solidario patronal ⚠️ verificar alícuotas vigentes).
- **Derechos que el dueño siempre calcula mal a mano**: aguinaldo (doble si el PIB
  supera 4,5% — se anuncia por año) · prima anual sobre utilidades · **bono de
  antigüedad en escala de salarios mínimos (esta lógica YA VIVE EN EL CORE, módulo
  payroll, testeada)** · quinquenios · finiquito con sus plazos.
- RC-IVA de dependientes: el empleador es agente de retención; el empleado descarga
  con facturas (Form. 110). Un dolor administrativo mensual clásico.

### F3 — Tributar (el SIN)
- **IVA 13%** (Ley 843): débito por ventas − crédito por compras CON factura. Por eso
  toda compra sin factura es plata perdida — el sistema debe empujar a pedir factura.
- **IT 3%** mensual sobre ingresos brutos (se compensa con IUE pagado ⚠️ mecánica a
  cablear con fuente).
- **IUE 25%** anual sobre utilidad neta; fecha de cierre según rubro ⚠️ (comercio y
  servicios ≠ industria ≠ agro — verificar la del cliente); pago hasta 120 días después.
- Vencimientos mensuales **por último dígito del NIT (D.S. 25619) — YA en producción**
  en `/contabilidad`.
- Retenciones cuando comprás a alguien SIN factura (RC-IVA/IT/IUE según el caso ⚠️) —
  el clásico que nadie hace y el SIN cobra con multa.

### F4 — Facturar (SIAT)
Modalidades: Portal Web gratis (tipear a mano) · computarizada/electrónica en línea.
**Deadline duro: facturación EN LÍNEA obligatoria 30-sep-2026** — esto convierte
nuestro emisor (bloqueado solo por el NIT, S2/D2) en una urgencia de mercado: miles
de negocios van a NECESITAR un sistema homologado en semanas.

### F5 — La caja y el tipo de cambio (el frente 2026)
- La plata entra por: efectivo, QR (QR Simple, comisión 0), transferencia, tarjeta.
  El dueño vive del **corte diario** (ya lo tenemos) y de saber **quién le debe**.
- **TC flotante desde jun-2026** (6,96 murió; oficial ~11-12 Bs/USD variable): el
  importador compra en USD y vende en Bs — si no recalcula precios con el TCO del
  día, **vende a pérdida sin saberlo**. Nuestro costeo ya exige el TCO manual; falta
  el dato automático diario.
- Crédito a clientes (fiar) y a proveedores (CxP) — hoy NO lo cubrimos (anotado).
- ITF sobre movimientos bancarios ⚠️ (alícuota y alcance vigente a verificar).

### F6 — El banco
Cuenta empresa (exige matrícula + NIT + poder) · QR para cobrar · el extracto como
fuente de verdad de la conciliación — exactamente lo que la reunión BCP (D5) destraba.

### F7 — La operación diaria (donde se gana o pierde la plata)
Agenda/pedidos · inventario valorado · cobrar lo fiado · reponer stock a tiempo ·
saber si HOY fue bueno. Es el frente donde vivimos y el que mejor cubrimos.

## 2. Veredicto honesto del mapa

| Frente | Cobertura hoy | El hueco |
|---|---|---|
| F7 Operación | ✅ fuerte (3 rubros) | FEFO/conteos sin UI |
| F3 Tributario | ✅ núcleo (IVA/IT/RCV/calendario NIT) | IUE anual · retenciones a terceros ⚠️ |
| F5 Caja/TC | 🟡 corte + costeo TCO manual | **TCO automático diario · fiados (CxC) · CxP** |
| F4 SIAT | 🟡 motor listo | NIT (D2) — y el 30-sep-2026 juega a favor |
| F2 RRHH | 🔴 **el core TIENE payroll (bono antigüedad testeado) y NO está portado** | portar = módulo RRHH casi gratis |
| F1 Legal | 🔴 no cubierto | recordatorios de renovaciones (SEPREC/licencia) = barato y útil |
| F6 Banco | 🔴 manual | reunión BCP (D5) |

## 3. ¿Los agentes 24/7 funcionan? — respuesta directa

**El motor sí; el auto aún no salió del garaje.** Runtime encendido en prod, patrón
propone→cola→aprobás→ejecuta con idempotencia y cupo. Lo que falta para que un
cliente lo SIENTA: (1) el cron sembrando propuestas reales (C3, siguiente), (2) el
envío real por WhatsApp (Meta, D3). El dashboard v2 que aprobaste les da la vitrina
("El sistema trabajó por vos").

**Un agente por frente** (el empaquetado natural):
F7 → Recordatorios/Recall/Stock (ya diseñados) · F5 → **Cobrador de fiados** + vigía
del TCO diario · F3 → vigía de vencimientos (ya) + Radar Normativo (¡ya corre para
nosotros en n8n — se productiza!) · F2 → alertas de planilla (aguinaldo/prima/
antigüedad) · F1 → recordatorio de renovaciones anuales.

## 4. Lo nuevo de Sergio: RRHH, reuniones, notas — el empaquetado

- **RRHH**: portar payroll del core (bono antigüedad + planilla) + ficha del empleado
  + recordatorios laborales. Es el frente F2 entero y el core ya tiene la plata
  calculada. **La mejora #1 en costo/beneficio.**
- **Reuniones**: la agenda ya existe (dental) — generalizarla a "citas internas"
  (reunión de equipo, visita de proveedor) es reuso, no construcción.
- **Notas**: la capacidad `collaboration` (comentarios y documentos) está en el
  contrato — notas por cliente/producto/cita, y `knowledge_base` (ya declarada por
  importadora) como "manual interno del negocio".
- Otros que empaquetan bien y son baratos: **documentos del negocio** (NIT, matrícula,
  licencia con fecha de vencimiento y alerta) · **checklist de apertura/cierre del
  día** (work_items) · export "carpeta para tu contador" (RCV+planilla+respaldo en un
  zip mensual).

## 5. El orden que propongo (tras pensar como la empresa)

1. **RRHH/planilla** (portar payroll del core) — F2 es el frente más doloroso y ya
   está pagado en el core.
2. **Fiados (CxC) + compras a crédito (CxP)** — cierran F5 y alimentan el crédito
   fiscal; el agente Cobrador pasa a tener datos reales.
3. **TCO diario automático** (external gate) — F5, crítico para importadora.
4. **Carpeta del contador + documentos con vencimiento** — empaquetado barato, F1/F3.
5. Reuniones/notas — reuso de agenda + collaboration.

⚠️ = verificar tasa/fecha con RND/DS vigente antes de cablear (regla de la casa).
