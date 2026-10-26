# ¿El mini PC es la única opción? — alternativas de formato y de entrega (2026-08-06)

Duodécima parte. Sergio preguntó si el mini PC es la única vía. **No lo es**, y una de las
alternativas puede generar ingreso **antes** de importar nada.

---

## 1. Primero, las debilidades reales del mini PC

Un cliente serio —una financiera, un estudio grande— va a plantear estas, y hay que tener la
respuesta:

| Debilidad | Por qué importa | Respuesta |
|---|---|---|
| **Sin memoria ECC** | Un error de bit corrompe datos sin avisar. Servidores y workstations profesionales tienen ECC | Real. Para banca o salud crítica, se ofrece el formato servidor |
| **Sin redundancia** | Una sola fuente, sin RAID. Si falla, se cae todo | Se mitiga con backup y con SLA de repuesto |
| **Expansión nula** | No le agregás GPU ni discos después | Es un producto cerrado, se vende así |
| **Garantía de consumo** | No es garantía empresarial | La garantía la damos nosotros |
| **Térmica en Santa Cruz** | Carga sostenida en clima caliente | Medir en la unidad de prueba |

**No son objeciones fatales — pero explican por qué el catálogo necesita más de un formato.**

---

## 2. Alternativas de FORMATO

| Formato | Cuándo conviene | Contra |
|---|---|---|
| **Mini PC** (lo analizado) | 80 % de los casos. Silencioso, chico, barato | Sin ECC ni redundancia |
| **Workstation torre con GPU** | Cuando se necesita velocidad de prefill y expansión. **Es armable → margen propio** | Grande, ruidosa, más consumo |
| **Servidor rack 1U/2U** | Financiera, cooperativa, clínica grande con sala de servidores. **ECC, fuentes redundantes, gestión remota IPMI** | Caro, necesita rack y refrigeración |
| **Laptop con GPU** | Nicho real: **el abogado que viaja con sus expedientes** y no quiere dejarlos en la nube | Poca memoria, térmica limitada |
| **Jetson / edge** | Visión en planta o retail | No sirve para LLM serio |

---

## 3. 🎯 Alternativas de ENTREGA — acá está lo importante

**El producto no es el fierro: es "IA privada funcionando".** Hay cinco maneras de entregar eso,
y **tres no requieren importar nada.**

### Opción A — El cliente ya tiene el hardware ⭐ **la más rápida**

Muchísimas empresas en Santa Cruz ya tienen una PC decente o un servidor subutilizado. Un
equipo con una **RTX 3060 / 4060 de 12–16 GB corre modelos de 7–14B** sin problema — que es
exactamente la gama **Onia Recepción**.

| | |
|---|---|
| **Qué vendemos** | Instalación, configuración, integración y soporte |
| **Importamos** | **Nada** |
| **Inventario** | **Cero** |
| **Garantía de hardware** | **No la damos** — es del cliente |
| **Tiempo hasta la primera factura** | **Días** |
| Contra | Ticket más bajo, y depende de lo que el cliente tenga |

### Opción B — El cliente compra el hardware, nosotros configuramos

Él compra donde quiera —incluso en plaza en Santa Cruz—, nosotros cobramos implementación y
soporte. Mismo beneficio que A, con hardware nuevo y adecuado.

### Opción C — Colocation en un datacenter boliviano

**Santa Cruz tiene 4 datacenters**, y **Tigo DC Bolivia está certificado Tier III** —
redundancia, disponibilidad y seguridad auditadas. **ITC-SERVICIOS** está en proceso de
certificación, en un complejo de dos torres con vigilancia 24/7, CCTV y control de acceso
biométrico.

| | |
|---|---|
| Cómo funciona | El servidor del cliente vive en el datacenter, no en su oficina |
| **Ventaja de soberanía** | **Los datos no salen de Bolivia** — que es el argumento de venta central |
| Para el cliente | No maneja energía, refrigeración ni seguridad física |
| **Para nosotros** | **Mucho más fácil de soportar**: un solo lugar, acceso garantizado, energía estable |
| Contra | Cuota mensual del datacenter, y ya no está "en su oficina" |

[Datacenters en Santa Cruz](https://www.datacentermap.com/bolivia/santa-cruz-de-la-sierra/) ·
[Tigo DC Bolivia Tier III](https://www.datacenters.com/tigo-business-tigo-dc-bolivia) ·
[ITC-SERVICIOS](https://www.datacentermap.com/bolivia/santa-cruz-de-la-sierra/itc-servicios/)

> **Esto resuelve la térmica y la energía de un plumazo** — los dos riesgos físicos que veníamos
> arrastrando por el clima de Santa Cruz.

### Opción D — Alquiler en vez de venta

En lugar de USD 6.000 de golpe, **USD 300–400 por mes**. Baja muchísimo la barrera de entrada y
convierte el hardware en ingreso recurrente.

**Contra:** ONIA financia el fierro, o sea que necesita capital — justo lo que hoy no sobra.
Vale como **fase 2**, cuando haya flujo.

### Opción E — Servidor compartido nuestro, en Bolivia

Varios clientes chicos sobre una caja nuestra alojada acá. Más barato para ellos.
**Contra:** ya no es "privado" en sentido estricto, aunque sí "en Bolivia". Sirve para clientes
que quieren soberanía de país, no aislamiento total.

---

## 4. Comparación

| Vía | ¿Importa? | Capital | Tiempo a 1ª venta | Ticket | Recurrente |
|---|---|---|---|---|---|
| **A. Hardware del cliente** ⭐ | **No** | **Cero** | **Días** | Bajo | ✅ |
| **B. Cliente compra** | **No** | **Cero** | Semanas | Medio | ✅ |
| **C. Colocation** | **No** (o sí, más adelante) | Bajo | Semanas | Medio | ✅✅ |
| D. Alquiler | Sí | **Alto** | Meses | — | ✅✅✅ |
| E. Compartido | Sí (una caja) | Medio | Semanas | Bajo | ✅✅ |
| **Mini PC importado** | **Sí** | Medio | **Meses** | **Alto** | ✅ |

---

## 5. La corrección honesta

Estuvimos armando un plan de importación completo. **Sigue siendo válido y el registro conviene
igual** — pero **no tiene que ser el primer paso.**

**La opción A no requiere importar, no requiere capital, no requiere el registro de importador,
y puede facturar en días.** Y hace algo que ninguna investigación puede: **prueba si alguien
paga por esto.**

**Secuencia recomendada:**

1. **Ahora — Opción A/B.** Buscar clientes que ya tengan hardware o que puedan comprarlo.
   Vender instalación + configuración + soporte. **Ingreso inmediato, cero riesgo.**
2. **En paralelo** — trámites de SEPREC, SIN y Aduana (gratis, no bloquean nada).
3. **Con 2–3 clientes pagando** — comprar la unidad de prueba y validar el stack.
4. **Con demanda repetida** — primera importación contra pedido, con 50 % de anticipo.
5. **Con flujo estable** — evaluar alquiler (D) y colocation (C) como líneas recurrentes.

**El fierro importado no es el negocio: es la forma de capturar más margen una vez que el
negocio ya existe.**

---

## Fuentes

- [Datacenters en Santa Cruz de la Sierra](https://www.datacentermap.com/bolivia/santa-cruz-de-la-sierra/) · [Bolivia — 5 instalaciones](https://www.datacentermap.com/bolivia/)
- [Tigo DC Bolivia — Tier III](https://www.datacenters.com/tigo-business-tigo-dc-bolivia) · [Millicom/Tigo — Uptime Institute](https://uptimeinstitute.com/clients/millicom-tigo)
- [ITC-SERVICIOS Santa Cruz](https://www.datacentermap.com/bolivia/santa-cruz-de-la-sierra/itc-servicios/) · [Entel Data Center](https://www.entel.bo/EmpCorporativoDataCenter)
