# Onia Platform — qué da cada plan

> **2026-08-01.** Sergio: *"cada plan tiene que tener funciones diferentes y dependiendo
> del volumen y de lo que PAGUEN, que es lo más importante: lo que paguen"*.
>
> Este doc traduce eso a la matriz que el código tiene que gatear. Precio ratificado en
> [[pricing-dentalgest-ratificado]] y `ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md`.

---

## 0. Lo que está mal HOY, y por qué bloquea la oferta

Leído de `lib/plan-limits.ts` en el producto, no supuesto:

| Defecto | Qué significa |
|---|---|
| **`clinic` y `enterprise` son el objeto idéntico** | Dos precios distintos que entregan exactamente lo mismo. Si un cliente compara, no hay respuesta honesta a "¿y qué me da el caro?" |
| **Ningún plan gatea los agentes de IA** | El producto se vende como "agentes 24/7" y el plan no los limita. Lo que más cuesta producir es lo único que se regala igual a todos |
| **`inventoryIncluded: true` en TODOS**, incluido `free` | Cero diferenciación |
| **`gatewayEnabled: false` en TODOS**, incluido `enterprise` | La pasarela está apagada hasta arriba |
| **La diferencia es solo "más de lo mismo"** | Pacientes, usuarios, emails y 4 booleanos. Es una escalera de cantidad, no de valor |

**La consecuencia comercial:** un plan que solo da "más pacientes" se negocia por precio.
Un plan que da **una función que el de abajo no tiene** se negocia por valor. Hoy tenemos
lo primero.

---

## 1. El salto de valor — la regla que ordena todo

Mismo criterio que ya usamos en propuestas: los niveles **no** se distinguen por volumen,
se distinguen por lo que el negocio pasa a poder hacer.

| Plan | El salto | En una frase al cliente |
|---|---|---|
| **Básico** | **Ordenar** | Dejás el cuaderno y el WhatsApp suelto |
| **Profesional** | **Llenar la agenda** | La agenda se llena sola y dejás de perder pacientes |
| **Clínica** | **Piloto automático** | El sistema trabaja de noche: cobra, agenda y responde |
| **Grupo Clínico** | **Mandar varias sedes** | Ves las sedes juntas y comparás |

Si un plan no puede explicar su salto en una línea, el plan está mal armado.

---

## 2. La matriz

Precio de lanzamiento vigente (fase sin portafolio) entre paréntesis. Anual = 10 meses.

| | **Básico**<br>Bs 390 (320) | **Profesional**<br>Bs 890 (750) | **Clínica**<br>Bs 1.990 (1.500) | **Grupo Clínico**<br>a medida |
|---|---|---|---|---|
| **Pacientes activos** | 300 | 1.500 | ilimitado | ilimitado |
| **Usuarios** | 2 | 5 | 15 | ilimitado |
| **Sedes** | 1 | 1 | 1 | varias |
| Agenda + ficha clínica | ✅ | ✅ | ✅ | ✅ |
| Inventario simple | ✅ | ✅ | ✅ | ✅ |
| Reporte básico | ✅ | ✅ | ✅ | ✅ |
| **Reservas online del paciente** | — | ✅ | ✅ | ✅ |
| **Recordatorios automáticos** | — | ✅ | ✅ | ✅ |
| Reportes completos | — | ✅ | ✅ | ✅ |
| Facturas recurrentes | — | ✅ | ✅ | ✅ |
| **Exportar todo (CSV)** | — | — | ✅ | ✅ |
| **Facturación electrónica SIAT** | — | — | ✅ | ✅ |
| **Pasarela de cobro** | — | — | ✅ | ✅ |
| **Consolidado multi-sede** | — | — | — | ✅ |

### Los agentes — donde está el precio de verdad

Es lo que cuesta producir (tokens) y lo que más valor entrega. Se gatea por **cuáles** y
por **cuántas propuestas al mes**.

| | Básico | Profesional | Clínica | Grupo |
|---|---|---|---|---|
| **Agentes activos** | ninguno | Recordatorios · Recall | + Cobrador · Vendedor | + a medida |
| **Propuestas del agente / mes** | — | 200 | 1.500 | ilimitado |
| Cola de aprobación | — | ✅ | ✅ | ✅ |
| **Chatbot de WhatsApp** | add-on | add-on | **incluido** | incluido |

**El patrón no cambia entre planes: el agente propone, el dueño aprueba, recién ahí se
ejecuta.** Eso no es una limitación de los planes baratos — es el producto. Automatización
que no manda nada sin permiso es exactamente lo que hace que un dentista la acepte.

### Add-ons (se suman a cualquier plan)

| Add-on | Precio | Nota |
|---|---|---|
| Chatbot WhatsApp IA | mensual | Incluido desde Clínica. **El botón de WhatsApp es gratis en todos** — lo que se cobra es el bot que responde y califica |
| Usuario extra | por asiento | Máx. 3 asientos extra en Básico |
| Inventario avanzado | mensual | El simple ya viene incluido |

---

## 3. Cómo se degrada — la parte que casi siempre se hace mal

Cuando el trial vence sin pago, o el pago falla:

1. **Nunca se borra nada.** Los datos del paciente son historia clínica; borrarlos por
   falta de pago es un problema legal, no una decisión de producto.
2. **Se degrada a lectura + exportar.** El dueño siempre puede sacar SUS datos, aunque no
   pague. Eso además es lo que hace que confíe en entrar.
3. **Los agentes se apagan primero.** Es lo que cuesta plata producir.
4. **Aviso a los 3 días, al vencer, y a los 7 días después.**

Estados del plan: `trialing` → `active` → `past_due` → `canceled`.

---

## 3-bis. Plan SEMANAL + revisión de montos contra el valor (ratificado 2026-08-02)

Sergio juntó las dos opciones: mensual + promos **y además** semanal, con revisión de
montos contra el cálculo de valor.

**Revisión contra el valor** (`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md`):

| Plan | Precio lanz. | Valor conservador | Valor medio | Captura del valor |
|---|---|---|---|---|
| Básico 320 | vs 911 | 35% | — | ✅ sano |
| Pro 750 | vs 911 conservador | 82% ⚠️ | vs 3.527 → **21%** | ✅ sano en el caso medio |
| Full 1.500 | — | — | vs 13.599 optimista → 11% | ✅ holgado |

**Veredicto: los montos NO cambian.** Pro captura solo 21% del valor del caso medio —
regla sana de SaaS (cobrar 20-30% del valor entregado). El único caso apretado es la
clínica chica del escenario conservador, y para ella existe Básico. El problema que el
cálculo señala sigue siendo targeting (a quién se le vende Pro), no precio. Falta el
ticket promedio real de SCZ (D1) para afinar el argumento, no el monto.

**Plan semanal** — puerta de entrada para negocios de caja diaria (mercados,
ferreterías chicas): la plata entra por día, comprometer un mes asusta.

| Plan | Mensual | **Semanal** | Prima |
|---|---|---|---|
| Básico | Bs 320 | **Bs 89/sem** | ~20% — la flexibilidad se paga |
| Pro | Bs 750 | **Bs 199/sem** | ~15% |
| Full | Bs 1.500 | — solo mensual/anual | el plan de compromiso no se fracciona |

Reglas: semanal se cobra por adelantado · sin trial encima (el trial ES la puerta
gratis; semanal es la puerta barata — no se apilan) · al 2º mes seguido en semanal,
el sistema le propone pasar a mensual mostrándole cuánto ahorraría. Pendiente de
código: ciclo `weekly` en la suscripción (extensión de `plan-state`/activación) —
anotado en C de la agenda.

## 4. La prueba gratis

**14 días, sin tarjeta, plan Profesional completo.**

Por qué Profesional y no Básico: el trial tiene que mostrar el salto que se está vendiendo.
Si probás el Básico, probás un cuaderno digital y no hay nada que extrañar cuando vence.
Si probás el Profesional, ves la agenda llenándose sola — y eso sí se extraña.

Por qué sin tarjeta: en Bolivia pedir tarjeta por adelantado corta la mayoría de las altas,
y encima hoy **no tenemos la pasarela** hasta la reunión del BCP. Sin tarjeta la cadena
funciona completa desde ya.

Límite anti-abuso: una prueba por NIT y por número de WhatsApp.

---

## 5. Lo que hay que cambiar en el código

Para el carril de producto — orden de ejecución:

1. `PLAN_LIMITS`: diferenciar `clinic` de `enterprise` (hoy son idénticos).
2. Agregar el gate de agentes: `agentsEnabled: string[]` y `agentProposalsPerMonth`.
3. `gatewayEnabled: true` desde `clinic`.
4. Estado `trialing` + `trialEndsAt` + la degradación de §3.
5. El contador de propuestas del agente tiene que ser **fail-closed**, igual que ya quedó
   el cupo de WhatsApp: si no se puede contar el consumo, se deniega. Un contador que
   falla abierto es una factura de tokens sin techo.

---

## 6. Lo que falta decidir, y es de Sergio

| # | Qué | Por qué importa |
|---|---|---|
| 1 | **Ticket promedio por cita en Santa Cruz** | Sin ese número el argumento de venta no se puede poner en plata |
| 2 | Precio exacto del add-on de chatbot | Es el add-on con más margen |
| 3 | Si el Grupo Clínico se vende ya o recién con 3 casos | Vender multi-sede sin haberlo probado es prometer de más |

---

Fuentes: `ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` (el cálculo de valor) ·
`PRICING_RATIONALE_INTERNO.md` §0 (precio de lanzamiento) ·
`ONIA_SELF_SERVICE_ARQUITECTURA_20260731.md` (dónde se corta el cobro hoy).
