# Plan de desarrollo y venta — qué construir, en qué orden, y cómo se vende

**Un solo plan por frente.** Cada función sale de un problema verificado, no de una lista de
deseos. Estado del producto y del código medido el **2026-08-24**.

> **No duplica** lo que ya está escrito. La psicología de precios de la competencia vive en
> `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` (6 mecanismos leídos de las páginas reales) y el
> método para subir precios sin perder clientes en
> `propuestas/ONIA_PRICING_ESTRATEGIA_ESCALADA_2026.md`. Los precios y funciones actuales
> están en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. **Este doc los ATA en un orden ejecutable.**

---

## 1. La pieza que desbloquea dos cosas a la vez

**Multi-sucursal.** `branchId` da cero coincidencias en todo el repo, y de ella dependen:

- **El plan Empresa (Bs 2.900).** Su `activationMessage` promete *"multi-sucursal"*. Sin
  eso, hoy Completo y Empresa tienen **límites idénticos** — Bs 1.400 de diferencia por
  nada. Es el señuelo de Lovable que nuestro propio doc jura no copiar.
- **Bolivian Electric.** Su venta se traba exactamente ahí: *"si no te alcanzó en tu
  almacén, tenés que hacer primero un pedido interno… y de ahí recién podés facturar."*

**Una función, dos bloqueos.** Por eso va primera.

**Qué incluye:** `branchId` en los modelos que corresponda · stock por almacén · pedido
interno entre sucursales · que la factura espere el ingreso.

---

## 2. Por frente

### Plataforma

| # | Función | Por qué | Costo |
|---|---|---|---|
| 1 | **Multi-sucursal** | §1 | grande |
| 2 | **Gatear lo que el add-on de inventario cobra** | Hoy compras, proveedores y alertas son **gratis para todos** (`/comercio/fiados` sin gate) y el add-on cobra Bs 180 por ellas | chico |
| 3 | **Contador de uso visible** | `checkPatientLimit` devuelve `current` y `limit` y **nadie los muestra**: el cliente choca con un 403 sin aviso | chico |
| 4 | **Techo blando** | aviso al 80% + un mes de tolerancia, en vez del rebote | medio |
| 5 | **Buscar cliente por NIT** | Bolivian Electric no puede copiar NIT y nombre de alguien ya registrado | chico |
| 6 | **Archivo digital por factura** | cuando el SIN pide papeles de años atrás, *"a veces no lo pillamos"* | medio |

### Chatbot

| # | Función | Por qué | Costo |
|---|---|---|---|
| 1 | **Llenar `knowledge.json`** | Tiene **un solo hecho**. El motor está perfecto y el bot no sabe nada del negocio. **Es contenido, no código** | chico |
| 2 | **Embedded Signup en el panel** | Somos Tech Provider con App Review aprobado. Es la ruta ya decidida (17-ago) | medio |
| 3 | **Formulario de alta del bot** | el cliente arma el suyo; se prueba primero con el bot propio de Onia | medio |
| 4 | **Que el bot lea el conocimiento por org** | el editor está en producción; falta que el bot de WhatsApp lea la fila | chico |

🔴 **Access Verification de Meta vence el 20-oct-2026.** Es la única fecha dura del frente.

### Webs

Lead magnet vivo. Sigue la cola con veredicto: **P03** (el que trae plata) → **P01**
`motion-design-skill` → **P02** → **P04**. `genjutsu` al final y solo `cast`.

### Infra

Sana: steal 9%, load 1,2, webs bajo 1 s. Queda `docker update --restart=no` a
Temporal/Elasticsearch/Speaches, y **crear la skill de infra que no existe** — es el carril
con el conocimiento más caro y hoy vive solo en memorias sueltas.

---

## 3. Cómo se vende, con la psicología aplicada a NUESTRA escalera

Los mecanismos están en `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md`. Acá van aterrizados.

### 3.1 Los tres movimientos que no cuestan código nuevo

**Mostrar el ancla.** Empresa (Bs 2.900) existe en `pricing.ts` pero está **fuera del
checkout**. Ponerlo como cuarta columna "hablar con ventas" hace que **Bs 1.500 se lea
barato sin cambiar un solo precio**. Es el movimiento de Webflow con Team $2.500 al lado de
Premium $25.
⚠️ **Mostrarlo NO es venderlo.** Mientras no exista multi-sucursal, es ancla y nada más.

**El anual como número grande.** El descuento ya es ~17% (10 meses por 12) y **no lo decimos
en ninguna parte**: vive como comentario en el código. Es la misma plata con mejor lectura,
y baja el churn.

**Cobrar en bolivianos, y decirlo.** Los siete comparables cotizan en dólares. Con la
devaluación, un precio atado al dólar **subió 63% sin entregar nada nuevo**. Que el precio
no se mueva solo es una ventaja concreta contra Wix, Shopify y Squarespace acá — pero hay
que **escribirlo en la página de precios**, no dejarlo implícito.

### 3.2 El salto que hay que vender

**Básico → Profesional es el único escalón con diferencia funcional real.** Ahí entran
reportes completos, agenda pública, facturas recurrentes y agentes. De Completo para arriba
solo se levantan topes.

Consecuencia para el discurso: **todo el argumento vive en Profesional.** Básico es la
puerta barata de probar; Completo se ofrece cuando los topes molestan de verdad, nunca como
"el plan bueno".

### 3.3 Marca de agua en vez de recorte

Hoy la agenda pública **no existe** en Básico. Un techo invisible no vende nada.
Mejor: dejarla disponible con un *"Powered by Onia"* visible, y que los Bs 150 compren
**quitar la marca**. El cliente ve lo que se pierde en vez de chocar con una puerta cerrada.

### 3.4 Lo que NO hacemos, y conviene tenerlo dicho

- **Nada de acantilado de renovación.** Hostinger sube 3,67x al renovar. Con la devaluación,
  el cliente boliviano ya vive con que todo sube solo: eso quema lo único que todavía no
  tenemos, que es reputación. Y contradice el precio fundador congelado, que ya está decidido.
- **Nada de % sobre la facturación del cliente.** No es ejecutable: `gatewayEnabled: false`
  en los cinco planes — no procesamos pagos, no hay dónde retener. Venderlo sería prometer
  lo que no podemos cobrar.
- **Nada de créditos como unidad.** El dueño de una ferretería no sabe cuántos créditos
  cuesta agendar. Nuestra unidad ya está bien: **la conversación** (500/mes).
- **Nada de prepago largo.** El plazo se **premia con descuento**, no se exige. Para caja
  diaria ya existe el ciclo semanal.

### 3.5 El flanco que hay que cerrar antes de que lo usen

`WHATSAPP_ADDON.meta.markupPct: 20` dice *"pass-through al costo + 20%"*, mientras el
`fullLabel` le promete al cliente que *"el excedente de Meta va al costo"*.
**Lety.ai vende literalmente "0% markup" como su tesis central.** Si cobramos 20% y decimos
que no, es el ataque más fácil que nos pueden hacer. **O se cobra y se dice, o se borra el
markup.** Decisión pendiente.

---

## 4. El orden, en una línea

**Multi-sucursal** (desbloquea Empresa y Bolivian Electric) → **los tres movimientos de
precio que no cuestan código** → **llenar el conocimiento del bot** → **gatear el add-on de
inventario** → **techo blando y contador visible**.

### Lo que espera decisión de Sergio

1. **¿Empresa se construye o se saca de la oferta?** Hoy no se puede vender sin prometer
   multi-sucursal.
2. **¿El markup de Meta es 20% o es a costo?** El código y la etiqueta dicen cosas distintas.
3. **¿Los precios de webs y consultoría entran en la regla de fuente única?** Hoy no tienen
   contra qué medirse.
4. **El seguimiento del bot no tiene hora de silencio** — puede escribir a las 6 de la
   mañana. Esperando desde el 16-ago.
