# Onia — Optimización Fiscal Propia (Bolivia) 2026

Fecha: 2026-07-10. Owner: Onia / Hermes (rol contador interno).
Complementa `onia-core/ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md` (que cubre el PRODUCTO
fiscal para clientes + cumplimiento). Este doc es sobre **los impuestos PROPIOS de Onia**:
cómo pagar exactamente lo que la ley obliga y ni un boliviano más, con documentación impecable.

> **La línea (importante).** Hacemos **planificación fiscal legítima (elusión)**: maximizar
> crédito fiscal, deducir todo lo deducible, elegir bien el régimen, documentar impecable.
> **NO hacemos evasión** (ocultar ingresos, facturas de favor/compradas): en Bolivia el cruce
> del SIN lo detecta y sale carísimo (multas, clausura, riesgo penal). Minimizar legal + papeles
> perfectos es lo que protege la plata.
>
> **Esto NO es asesoría contable definitiva.** El régimen, las fechas y el cierre de IUE los
> valida un **contador matriculado**. Onia prepara todo para que el contador solo revise y firme.

## 1. Los impuestos de Onia (régimen general — CONFIRMAR con contador)

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
- **Pedir factura a nombre y NIT de Onia por CADA gasto del negocio**: equipos, alquiler,
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
- Facturación en línea SIAT *(decía «obligatoria grupos finales 30-sep-2026»: ese plazo quedó sin efecto, RND 102600000038, 30-sep-2026; corregido el 3-oct)*: Onia emite factura por sus
  ventas → genera débito, pero da formalidad y permite al cliente su crédito (argumento de venta).

## 3. Disciplina de documentación (lo que guardamos SIEMPRE)

Por cada **ingreso**: factura emitida (SIAT) + comprobante de cobro/banco.
Por cada **gasto**: factura de compra a NIT Onia + respaldo bancario (si aplica) + a qué actividad
corresponde (deducible sí/no).
Mensual: **RCV** (registro de compras y ventas) al día en el SIAT. Archivo digital de respaldos.
Anual: estados financieros para IUE (los arma/valida el contador).

## 4. Cómo Onia Center queda "al tanto" (diseño — se construye al confirmar régimen)

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

## 6. Estado confirmado (2026-07-10) y lo que falta

**Confirmado por Sergio** (cargado en `references/impuestos-bolivia.template.json`):
- Régimen: **General** → aplican IVA (13%), IT (3%), IUE (25%).
- **Sin empleados en planilla** (socios/honorarios) → **RC-IVA no aplica** (reevaluar si contrata).
- **Facturación SIAT: en trámite** (aún no emite).
- **Sin contador matriculado**: Onia prepara todo; un matriculado valida/firma el IUE anual.

**Falta 1 dato:** el **NIT + último dígito** (para fijar las fechas de vencimiento del calendario SIN).

**Acciones prioritarias (dado el estado):**
1. **Completar la emisión SIAT** (trámite) — necesario para facturar formalmente a clientes desde un
   sistema propio. [acción de Sergio] ⚠️ *Corregido el 3-oct: decía «obligatorio para todos antes del
   30-sep-2026». Nunca fue para todos (solo grupos 9° a 12°, por NIT) y ese plazo quedó sin efecto
   (RND 102600000038, 30-sep-2026). Onia ya cumple facturando por el Portal Web del SIN.*
2. **Capturar crédito fiscal en las COMPRAS desde YA**, aunque todavía no se emita: cada gasto con
   factura al NIT de Onia acumula **saldo a favor de IVA** para cuando arranquen las ventas. Cuesta
   cero y es la palanca #1.
3. Honorarios (Arthur/freelancers): con factura o retención correcta → deducibles para IUE.
4. Separar personal vs empresa desde el primer boliviano.

Con el NIT: (a) completo el calendario de vencimientos, (b) construyo la postura fiscal en el
Agente Finanzas (IVA/IT/IUE + crédito perdido), (c) activo los recordatorios.

## 7. Herramientas del exterior (Claude, ElevenLabs, Higgsfield, SaaS/IA) — investigado 2026-07-10

Son las facturas que más gasta Onia. Respuesta a "¿se pueden presentar?":

- **Crédito fiscal IVA (13%): NO.** No son facturas autorizadas por el SIN (sin CUF ni NIT
  boliviano) → no dan crédito fiscal. Ese 13% no se recupera por esa vía.
- **Deducción IUE (25%): SÍ, condicionada.** Un gasto del exterior es deducible si (a) está
  vinculado a la actividad gravada (lo está — son herramientas de producción), (b) tiene respaldo
  (invoice del proveedor + comprobante de pago con tarjeta/banco), y (c) se **retiene y paga el
  IUE-BE (12.5% efectivo)** sobre el pago al exterior (Ley 843 Art. 51; DS 24051; Formulario 530
  mensual, Boleta 3050). El **comprobante de retención sustituye a la factura** para deducir. Sin
  la retención, el SIN puede observar/rechazar el gasto.
- **Conviene formalizarlo:** pagás 12.5% de retención para deducir al 25%. Con utilidad, el neto
  es a favor (~12.5 puntos) frente a no presentarlos.
- **Novedad — servicios digitales (DS 4732 + resoluciones SIN):** Bolivia ya grava el consumo de
  servicios digitales del exterior (software, plataformas, streaming) con IVA/IT. Claude,
  ElevenLabs y Higgsfield caen exactamente ahí; puede que ya te apliquen IVA/IT en el pago y/o que
  el proveedor deba registrarse ante el SIN. La **interacción entre este régimen y la retención
  IUE-BE es el punto más fino → validar con contador matriculado.**
- **Práctica por proveedor:** cargar razón social + NIT de Onia en el billing de cada herramienta
  (Anthropic/Stripe, ElevenLabs, Higgsfield lo permiten) y guardar invoice + comprobante. El
  sistema trackea cada pago al exterior con su retención.

## Fuentes
- Internas: `onia-core/ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md`,
  `hermes-content/skills/impuestos-bolivia-operaciones.md`, `references/impuestos-bolivia.template.json`.
- Legal: Ley 843, DS 21530, DS 24051 (IUE-BE), DS 4732 (servicios digitales), RNDs del SIN (Radar Normativo).
- Investigación 2026-07-10: impuestos.com.bo (IUE-BE), boliviaimpuestos.com (gastos deducibles / IUE-BE),
  emba.com.bo (ampliación IVA servicios digitales), ppolegal.com (tributación no domiciliados).
- **Validación final: contador matriculado** (esto no es asesoría definitiva).
