# Code review de todos los módulos — hallazgos verificados (2026-08-07)

**Método:** 9 revisores (uno por módulo) + verificación adversarial de cada
hallazgo grave. 55 hallazgos crudos → 19 CRITICAL/HIGH **confirmados** (1
descartado en verify) + ~20 MEDIUM. Repo producto `onia-platform` (master).
Resultado completo del workflow: `tasks/wonrdryym.output`.

**Contexto de por qué importa ahora:** Sergio pidió que el cliente compre y
configure SOLO. Los hallazgos marcados 🛒 son exactamente lo que rompe ese
camino self-service; los 💸 tocan plata; los 🔒 seguridad; los 🩺 datos clínicos.

## HIGH confirmados (19)

| # | 🏷 | Archivo | Qué pasa | Fix |
|---|---|---|---|---|
| 1 | 🛒💸 | `lib/subscription/plan-display.ts` | Checkout vende en Full/Clínica "Chatbot WhatsApp incluido", "Pasarela de cobro", "200/1.500 propuestas", "15 usuarios" — **ningún código los activa al aprobar el pago**. Cliente paga Bs 1.500 y el día 1 recibe 403 | La activación debe encender los add-ons prometidos, o el copy debe decir la verdad |
| 2 | 🛒 | `agents-runtime.ts:113` | Cliente Pro paga → al vencer el trial el runtime deja de correr Recall/Cobrador (el gate mira solo el entitlement, que venció; no mira el plan). La vitrina de agentes queda vacía para siempre | El gate del runtime debe incluir el bridge por plan (`agentsIncluded`) |
| 3 | 💸 | `admin/subscription-payments/route.ts:78` | Re-aprobar un pago ya aprobado (doble clic/retry) **regala un mes** cada vez. La ruta de n8n sí tiene el guard; esta no | Rechazar si `status !== PENDING` |
| 4 | 🩺 | `app/api/teeth/route.ts:9` | Odontograma **nunca guarda**: valida `patientId` como uuid pero es cuid → 400 siempre | Usar el validador cuid del repo |
| 5 | 🩺 | `app/api/teeth/route.ts:10` | `toothNumber` limita 1-32 pero la UI usa FDI 11-48 → media boca inguardable | Aceptar notación FDI |
| 6 | 🩺 | `Odontogram.tsx:150` | El guardado **muestra "Guardado" aunque el POST falle** → pérdida silenciosa de datos clínicos | Chequear `res.ok` |
| 7 | 🛒 | `api-route-registry.ts:55` | Estética/Vet/Servicios ven las pantallas clínicas pero sus **APIs los rechazan con 403** → 3 de 6 rubros vendidos tienen el flujo core roto (crear paciente, cita, alerta) | Sumar los 3 tracks a los owners de esas rutas |
| 8 | 💸 | `lib/invoice-number.ts:28` | Correlativo se rompe **permanentemente en la factura 10000/año** (orden lexicográfico "10000" < "9999") | Comparar numérico, no string |
| 9 | 💸 | `cron/recurring-invoices/route.ts:42` | El fix de race condition está **incompleto**: el cron no usa el wrapper de retry → factura recurrente se pierde ese día | Envolver en `withUniqueConstraintRetry` |
| 10 | 🔒 | `onboarding/extraccion/clientes.ts:115` | **SSRF**: la extracción del onboarding sigue redirects sin revalidar → cualquiera en trial alcanza servicios internos del VPS (169.254.169.254, Crawl4AI, n8n) | `redirect: manual` + revalidar cada salto contra la IP resuelta |
| 11 | 🔒 | `doctors/[id]/route.ts:89` | DELETE de doctor hace `deleteMany` de horarios **sin filtrar organizationId** → borra datos de otro tenant | Scopear por org (o dejar el cascade) |
| 12 | 🩺 | `patients/[id]/prescriptions/page.tsx:23` | Página de recetas **sin gate clinical.read** → recepción ve medicación, diagnósticos, alergias, tipo de sangre | Gatear igual que las otras superficies |
| 13 | 🩺 | `api/prescriptions/route.ts:84` | POST receta **ignora el doctor elegido** → queda a nombre del usuario logueado (documento médico-legal mal atribuido) | Leer `body.doctorId` validado contra la org |
| 14 | 🩺 | `patients/import/route.ts:101` | Celda género vacía **rompe TODA la importación** con 500 genérico (`'' ?? null` = `''`) | Usar `|| null` como en la ruta hermana |
| 15 | 💸 | `lib/comercio/stock.ts:82` | Ventas concurrentes se pisan (lee-modifica-escribe sin lock) → stock, COGS y margen mienten | `SELECT ... FOR UPDATE` como ya hace fiados |
| 16 | 📅 | `app/cita/page.tsx:49` | El link de confirmar/cancelar **muta la cita en un GET** → los escáneres de correo corporativo cancelan citas solos | Confirmación por POST |
| 17 | 📅 | `appointments/[id]/route.ts:42` | Reagendar (PATCH) **no valida conflictos ni usa el lock** → doble-booking por la vía de edición | Mismo lock+conflict que el POST |
| 18 | 📅 | `vercel.json:5` | Cron de recordatorios corre 1×/día pero las ventanas son de 1-2h → **la mayoría de las citas nunca recibe recordatorio** | Cron horario |
| 19 | 🛒 | (2º hallazgo agents, mismo root que #2) | Confirma #2 desde el ángulo del feed externo (403) | igual que #2 |

## MEDIUM (selección — lista completa en el output)

- `plan-display.ts` — mismo desajuste vendido-vs-real del checkout (detalle del #1).
- `booking/appointments/route.ts:130` 🛒 — el **portal público sigue creando citas para orgs con trial vencido o de baja** (no hay downgrade de plan).
- `subscription-payment/route.ts:132` 🛒 — el POST del comprobante **no dispara el flujo de auto-verificación** (WF-02 nunca se llama) → el pago queda PENDING y el checkout dice "verificando..." para siempre.
- `admin/payments/page.tsx:19` 🔒 — el gate del page admite rol ADMIN a un dataset cross-tenant (hoy lo tapa el layout; frágil).
- Zona horaria (varios) 📅 — disponibilidad y advisory-lock usan medianoche UTC → citas ≥20:00 La Paz invisibles / carrera de doble-booking a esa hora.
- Tokens de confirmación/portal 📅 — expiran mal, comparten fecha, se reusan vencidos.
- `patients/[id]/treatments` 🩺 — mismo bug uuid/cuid; y GET resuelve nombres de doctor sin scopear org (fuga latente).
- Import CSV — fecha imposible tumba la importación entera.

## Orden de ataque propuesto (por plata/riesgo, no por módulo)

**Tanda 1 — self-service + plata + datos (arreglo YA, todos claros y con test):**
#1 checkout honesto, #2/#19 agentes por plan, #3 replay de pago, #7 rubros 403,
#8 correlativo, #9 cron recurrentes, #4/#5/#6 odontograma, #14 import.

**Tanda 2 — seguridad:** #10 SSRF, #11 delete cross-tenant, #12 recetas gate.

**Tanda 3 — agenda/tiempo:** #16 GET-mutación, #17 PATCH sin lock, #18 cron,
#13 doctor de la receta, + los MEDIUM de timezone/tokens.

Regla: cada fix con su test, en rama del repo producto, **sin deployar** hasta OK
de Sergio (toca pagos/SIAT/multi-tenant en prod).
