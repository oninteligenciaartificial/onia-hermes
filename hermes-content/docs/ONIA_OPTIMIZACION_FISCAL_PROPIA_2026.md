# ONIA — Optimización Fiscal Propia (Bolivia) 2026

Fecha: 2026-07-10. Owner: ONIA / Hermes (rol contador interno).
Complementa `onia-core/ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md` (que cubre el PRODUCTO
fiscal para clientes + cumplimiento). Este doc es sobre **los impuestos PROPIOS de ONIA**:
cómo pagar exactamente lo que la ley obliga y ni un boliviano más, con documentación impecable.

> **La línea (importante).** Hacemos **planificación fiscal legítima (elusión)**: maximizar
> crédito fiscal, deducir todo lo deducible, elegir bien el régimen, documentar impecable.
> **NO hacemos evasión** (ocultar ingresos, facturas de favor/compradas): en Bolivia el cruce
> del SIN lo detecta y sale carísimo (multas, clausura, riesgo penal). Minimizar legal + papeles
> perfectos es lo que protege la plata.
>
> **Esto NO es asesoría contable definitiva.** El régimen, las fechas y el cierre de IUE los
> valida un **contador matriculado**. ONIA prepara todo para que el contador solo revise y firme.

## 1. Los impuestos de ONIA (régimen general — CONFIRMAR con contador)

Fuente de rates: estrategia fiscal canónica (radar-confirmada 2026-07-04).

| Impuesto | Alícuota | Frecuencia | Base | Palanca de optimización |
|---|---|---|---|---|
| **IVA** | 13% | mensual | ventas (débito) − compras con factura (crédito) | **capturar crédito fiscal en CADA gasto** |
| **IT** | 3% | mensual | ingreso bruto | se compensa con el IUE pagado (no olvidar) |
| **IUE** | 25% | anual | utilidad neta (ingresos − gastos deducibles) | **deducir todo gasto legítimo documentado** |
| **RC-IVA** | 13% | mensual | dependientes / alquileres | solo si hay empleados en planilla (CONFIRMAR) |

Vencimientos mensuales **por último dígito del NIT** (calendario oficial SIN — no inventar fechas).

## 2. Las palancas legítimas (en orden de impacto)

### Palanca 1 — Crédito fiscal IVA (la que más plata deja en la mesa)
`IVA a pagar = débito (13% de ventas) − crédito (13% de compras CON factura al NIT de ONIA)`.
- **Pedir factura a nombre y NIT de ONIA por CADA gasto del negocio**: equipos, alquiler,
  internet, servicios, publicidad, honorarios locales, etc. Cada factura válida = 13% que NO pagás.
- Lo que la mayoría pierde: gastos sin factura → crédito perdido → pagás IVA de más.
- Validez del crédito: NIT correcto, gasto vinculado a la actividad gravada, dentro del período,
  y bancarizado si el monto lo exige.
- **Ojo herramientas del exterior** (OpenAI, Higgsfield, Vercel, fal, etc.): normalmente NO
  emiten factura fiscal boliviana → ese IVA no se recupera. Pero pueden ser **deducibles para
  IUE** con el respaldo correcto. Además, pagos al exterior por servicios pueden gatillar
  **retención IUE-BE (Beneficiarios del Exterior)** — punto fino, CONFIRMAR con contador.

### Palanca 2 — Deducciones IUE (25% de la utilidad)
`Utilidad = ingresos − gastos deducibles`. Cada gasto real documentado baja la base del 25%.
- Deducibles típicos de una software house: sueldos/honorarios, alquiler, servicios, **depreciación
  de equipos** (laptops, servidores), software, marketing, capacitación, gastos de la actividad.
- Separar **rigurosamente personal vs empresa** (gasto personal ≠ deducible).
- Honorarios (Arthur, freelancers) con la **retención correcta** y respaldo — deducibles.
- No deducibles / con límite: gastos sin respaldo, multas, gastos personales.

### Palanca 3 — Compensación IT ↔ IUE
El IUE pagado se usa como pago a cuenta del IT del período siguiente (hasta agotarlo). Si hay
utilidad, el IT deja de ser un costo puro. No olvidar aplicar la compensación.

### Palanca 4 — Régimen correcto
Software dev → casi seguro **régimen general** (los especiales Simplificado/Integrado no aplican
a servicios de software). Elegir mal = pagar de más o incumplir. CONFIRMAR con contador.

### Palanca 5 — Timing y formalidad
- Registrar ingresos/gastos en el período correcto.
- **Bancarizar pagos ≥ Bs 50.000** (si no, se pierde crédito/deducibilidad).
- Facturación en línea SIAT (obligatoria grupos finales 30-sep-2026): ONIA emite factura por sus
  ventas → genera débito, pero da formalidad y permite al cliente su crédito (argumento de venta).

## 3. Disciplina de documentación (lo que guardamos SIEMPRE)

Por cada **ingreso**: factura emitida (SIAT) + comprobante de cobro/banco.
Por cada **gasto**: factura de compra a NIT ONIA + respaldo bancario (si aplica) + a qué actividad
corresponde (deducible sí/no).
Mensual: **RCV** (registro de compras y ventas) al día en el SIAT. Archivo digital de respaldos.
Anual: estados financieros para IUE (los arma/valida el contador).

## 4. Cómo ONIA Center queda "al tanto" (diseño — se construye al confirmar régimen)

Extiende la capa de finanzas que ya existe (`income_entries`, `expense_entries`,
`finance_summary`) con la dimensión fiscal. **Read-only, no mueve plata, no reemplaza al contador.**

Campos a agregar al registrar dinero:
- ingresos → `iva_debito_bs` (13%), `it_bs` (3%), `factura_emitida` (ref SIAT).
- gastos → `tiene_factura` (bool), `iva_credito_bs` (13% si tiene factura), `deducible_iue` (bool),
  `factura_ref`, `bancarizado` (bool).

El **Agente Finanzas** calcula una **postura fiscal mensual** (nueva sección de `finance_summary`
o tabla `tax_posture`):
- IVA estimado a pagar = débito − crédito.
- IT del mes; IUE estimado acumulado del año.
- **Crédito fiscal PERDIDO** = gastos sin factura × 13% (plata dejada en la mesa → alerta para
  corregir el hábito).
- **Próximos vencimientos** por dígito de NIT (reusa el skill `impuestos-bolivia-operaciones` +
  el template `references/impuestos-bolivia.template.json`, hoy VACÍO — hay que llenarlo).

Todo queda como estimación con la etiqueta "confirmar con contador"; el sistema **prepara**, no
presenta ante el SIN.

## 5. Guardrails (lo que NO hacemos, nunca)
- Nada de facturas de favor/compradas ni gastos inventados (delito + el crédito se cae en el cruce).
- No ocultar ingresos ni subfacturar.
- No presentar cifras al SIN sin que el contador matriculado las valide.
- No asumir régimen ni fechas: se confirman con fuente oficial / contador.

## 6. Lo que falta para activar (bloqueantes de dato)
1. **Régimen tributario** de ONIA (general/otro) — CONFIRMAR.
2. **NIT + último dígito** (para el calendario de vencimientos).
3. **¿Empleados en planilla?** → define si aplica RC-IVA + aportes laborales.
4. **¿Ya emite facturas / está el NIT activo?** (SIAT).
5. **¿Contador matriculado en el loop?** (ONIA prepara; él valida/firma IUE y EEFF).

Con eso: (a) lleno `references/impuestos-bolivia.template.json`, (b) construyo la postura fiscal
en el Agente Finanzas, (c) activo los recordatorios de vencimiento.

## Fuentes
- `onia-core/ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md` (estrategia + rates radar-confirmados).
- `hermes-content/skills/impuestos-bolivia-operaciones.md`, `references/impuestos-bolivia.template.json`.
- Ley 843, DS 21530, RNDs del SIN (vía Radar Normativo). Validación final: contador matriculado.
