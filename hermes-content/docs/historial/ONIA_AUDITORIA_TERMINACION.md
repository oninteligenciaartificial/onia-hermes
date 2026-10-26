# Auditoría de terminación del producto — qué falta para que una captura venda

> **2026-08-22.** Nace de una orden de Sergio: *"antes de colocar las imágenes termina el
> sistema para que las imágenes salgan bien"*. Se frenaron las capturas para la web y se
> auditó el producto primero.
>
> **Método:** 38 pantallas abiertas con datos reales (sembrado de demo contra un Postgres
> desechable), **84 capturas** a 1440 y 390, leídas una por una. No es lectura de código.
> Evidencia en el scratchpad de la sesión; el data dir del Postgres queda persistido para
> no re-sembrar de cero.

---

## Lo que se sospechó y era FALSO

Se reporta primero, porque casi entra como bug:

| Sospecha | Verificación | Veredicto |
|---|---|---|
| Los iconos salen como texto (el bug que vio un cliente en el login) | cada `<span>` de icono mide exactamente 24 px; el subset pesa 243 KB | **No existe. El arreglo aguantó** |
| El contador de propuestas es invisible (negro sobre negro) | en viewport real se ve verde; en la captura *fullPage* lo tapa el FAB `position:fixed` | **Artefacto de captura** |
| `/agents` en ferretería renderiza el catálogo | el gate redirige a `/comercio`; se leyó la URL antes de que asentara | **El aislamiento por rubro FUNCIONA** |
| "Exportar CSV" de Contabilidad no hace nada | `GET /api/fiscal/rcv-export` → 200 con 38 filas | **Funciona** |
| "Aceptar" cotización no hace nada | la fila quedó `accepted` y la UI lo refleja | **Funciona** |

También limpio: cero `"285 BOB"`, cero `"muy pronto"/"beta"/"próximamente"` en pantallas de rubro.

---

## Estado por rubro

| Rubro | Veredicto |
|---|---|
| **Comercio** (ferretería) | El más terminado. El panel de hoy **es fotografiable ya**: Bs 4.633,40, 11 tickets, medios de pago, cuadre de caja, fiado vencido |
| **Dental** | Es el rubro VIVO y tiene el panel **más flojo**: H1 *"Panel del dueño, Dra."*, *"Dr(a). Dra. Ana Ríos"* ×5, hero en Bs 0 |
| **Importadora** | **No está terminado.** Le muestra el panel de mostrador de la ferretería: ofrece "Nueva venta" y "Hacer corte" (que ni están en su menú) y ni una palabra de cotizaciones, embarques ni costeo, que ES su nav |

Joyas que sí están terminadas y valen: **`/importadora/costeo`** (FOB→costo puesto, DS 5646, TCO del BCB obligatorio — *"el sistema no inventa tasa"*), **`/contabilidad`** (IVA/IT con Ley 843 y D.S. 25619, vencimiento por NIT), **`/agents`** dental, y **`/pending`** (muestra el texto exacto que va a salir por WhatsApp).

---

## Los 19, ordenados por impacto de venta ÷ horas

### Lote 1 — los que delatan "sin terminar" en cualquier captura (~10 h)

| # | Qué | h |
|---|---|---|
| 1 | **Precios en formato inglés en la pantalla donde se paga**: `Bs. 1,500` — en Bolivia se lee *un boliviano con cincuenta*. `toLocaleString()` sin locale (15 usos) + literales. Y `Bs.` con punto en 30 lugares contra el `Bs ` del resto | 2 |
| 2 | **Un plan, tres nombres**: badge "Completo" vs tarjeta "Full" vs botón "Pagar Full". Regresión ya corregida una vez | 1 |
| 3 | `Panel del dueño, Dra.` + `Dr(a). Dra. Ana Ríos` ×5 | 1 |
| 4 | **No hay vuelta al panel** en comercio ni importadora (el menú arranca en `/comercio`) | 0,5 |
| 5 | `Catalogo` sin tilde (h1 + pie, 3 rubros) | 0,2 |
| 6 | `capitalize` sobre frases: "Agenda De Hoy", "Sábado, 22 De Agosto De 2026" | 1 |
| 7 | `No_asistio` en la leyenda del calendario | 0,5 |
| 8 | **Jerga y hoja de ruta a la vista**: `agent_action`, `RESEND_API_KEY no esta configurado`, `Clinic y Enterprise usan esta vista`, `fase enterprise` | 2 |
| 9 | **El medidor de plan está MUERTO en 6 de 7 rubros**: cuenta `patient.count()`, así que una ferretería ve "0 / 1.500" para siempre. Es el medidor que avisa cuándo conviene pagar más | 2 |

### Lote 2 — condición para fotografiar dental e importadora (~9 h)

| # | Qué | h |
|---|---|---|
| 10 | El sembrado no les da **ventas del día**: sus dos pantallas insignia salen en Bs 0. Y hay `Demo ·` delante de cada cita y facturas `#DEMO-323533` | 5 |
| 11 | **Restos dentales en comercio**: `/settings` habla de "pacientes", "citas" y "duración 30 min" a una ferretería; `/team` dice "Doctores 0" | 4 |

### Lote 3 — se ven rotas o incompletas (~27 h)

| # | Qué | h |
|---|---|---|
| 12 | **El calendario de `/appointments` se ve al revés**: los huecos vacíos previos al día 1 son cajas verdes rellenas y lo más prominente de la pantalla; los días reales son números sueltos | 4 |
| 13 | **Seis tablas se cortan en 390** (comercio, inventario, contabilidad, rrhh, cotizaciones, accounting): scrollean sin señal y las columnas que importan nacen fuera de pantalla. **El patrón correcto YA EXISTE** en `/patients` y `/billing` (colapsan a tarjetas) — falta aplicarlo | 10 |
| 14 | **La ayuda ofrece pantallas que el rubro no tiene** (Facturación, Reportes a una ferretería) | 4 |
| 15 | Tildes faltantes en copy de UI + **registro mezclado**: voseo y tuteo en pantallas adyacentes | 3 |
| 16 | Estado vacío de inventario dental dice *"No hay insumos que coincidan"* sin filtro puesto (se lee como error); banda negra del panel con 55% de vacío | 6 |

### Lote 4 — producto de verdad, no maquillaje (~48 h) — DECISIÓN DE SERGIO

| # | Qué | h |
|---|---|---|
| 17 | **La caja vende UN producto por venta.** No hay carrito, ni ticket multi-línea, ni lista de las ventas del día para revisar o anular. Bloqueo funcional real del rubro comercio | 16 |
| 18 | **Panel propio de importadora** (cotizaciones/embarques/costeo en vez del mostrador ajeno) | 16 |
| 19 | **Rediseño del panel dental** — es el rubro vivo y su pantalla más floja | 16 |

**La pregunta que decide el calendario:** ¿se fotografían **solo comercio y dental**, y importadora espera a v1.1? Con eso se sale mucho antes.

---

## Lo que NO se pudo mirar

- **4 de 7 rubros** (estética, veterinaria, servicios, ganadero): el sembrado solo crea tres inquilinos. **No se opina de sus pantallas.**
- **Peso y latencia reales**: todo corrió en `next dev`. Ese número no dice nada de producción. Único dato válido: el subset de iconos pesa **243 KB** (era 3,9 MB).
- Sub-pantallas de detalle y alta (`/patients/[id]`, odontograma, `/billing/new`, una venta completa en caja), el tema oscuro, y los envíos reales de WhatsApp/email.
- **El chip "Conectando"** de `/agenda` y `/appointments` nunca conecta en local (no hay Realtime). **Hay que mirarlo en producción antes de fotografiar esas dos.**
