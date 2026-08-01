# Onia Platform — ¿se puede comprar a las 3 de la mañana?

> 2026-07-31. **Análisis y especificación. No se implementó nada.**
> Los hallazgos marcados ✅ los verifiqué yo contra el código, no salen de un reporte.
> Lo del BCP que no está documentado va como `[PREGUNTAR AL BANCO]`.

---

## La respuesta en cinco líneas

1. **No es self-service hoy.** A las 3 AM alguien **sí** crea su cuenta y entra al trial de 7 días.
   Lo que **no** puede es *comprar*: paga a un QR estático, sube una captura y espera a un humano.
2. **El corte exacto:** `app/api/subscription-payment/route.ts` crea el comprobante en `PENDING`
   y **no toca el plan**. ✅ Verificado. Ahí termina el circuito automático.
3. **No existe entidad de suscripción.** ✅ El contrato son dos columnas: `organizations.plan` y
   `planEnd`. `SubscriptionPayment` es un comprobante, no una suscripción. Sin estados no hay
   renovación, ni gracia, ni suspensión, ni historial.
4. **Faltan cuatro piezas en cadena:** suscripción con estados → cargo con referencia propia →
   una única función de alta idempotente → adaptador del banco. **Solo la última depende del BCP.**
5. **Recomendación: híbrido asimétrico.** Self-service real solo en el plan de entrada; venta
   asistida en los altos. Pero **el circuito se construye igual**, porque su primer uso no es
   vender: es *renovar* sin perder al cliente que ya se vendió.

---

## 1. Dónde se corta, exactamente

| # | Paso | ¿Corre solo a las 3 AM? |
|---|---|---|
| 1 | Landing con precios → `/register?plan=…` | ✅ Sí |
| 2 | **El plan elegido se descarta** (`register/page.tsx`) | ⚠️ Bug silencioso: todos entran igual |
| 3 | Registro: cuenta + organización | ✅ Sí, funciona |
| 4 | Trial de 7 días + 1 de gracia | ✅ Sí |
| 5 | Elegir plan y pagar | ⚠️ Solo desde adentro, con sesión |
| 6 | El QR | ⚠️ Imagen **estática**, la misma para todos, sin monto ni referencia |
| 7 | Subir captura + tipear datos | ⚠️ La referencia la tipea el usuario, y es **opcional** |
| 8 | **🔴 EL CORTE** — `subscription-payment/route.ts` | ❌ **Acá se detiene todo** |
| 9 | Se le dice *"se activará en las próximas horas"* | ❌ Promesa de horas, no de minutos |
| 10 | Activación del plan | ❌ **Humano**, o n8n sin verificar el pago |

### Los cuatro hallazgos que importan

**(a) El único camino "automático" no verifica nada bancario.** ✅
`autoApprove` solo comprueba que plan, ciclo y monto coincidan con el catálogo — datos que el
propio atacante elige. **Ninguna de las tres cosas prueba que el dinero llegó.** Una captura
editada con el monto correcto pasa el filtro.

**(b) 🔴 `planEnd` se recalcula desde HOY, no desde el período vigente.** ✅ Verificado en los
**dos** caminos de activación. Si un cliente paga el día 10 con el período corriendo hasta el 30,
**pierde 20 días pagados**. Es un bug de plata que ya existe, sin banco de por medio.

**(c) 🔴 Hay dos puertas de alta, y la que usan los clientes es la vieja.** ✅
`provisionOrganization` —la puerta genérica por rubro, con transacción, roles y entitlements—
**no tiene ningún llamador de producción**: solo la usan los tests y el alta de demos. El registro
real crea la organización *inline*, con **`plan: "professional"` hardcodeado** y campos de clínica.
**Consecuencia: hoy el self-service solo sabe dar de alta clínicas dentales.** El segundo rubro no
tiene puerta de entrada.

**(d) La pasarela que existe es del otro plano y está apagada.** `processPayment()` no tiene
llamador, `gatewayEnabled` está en `false` en los cinco planes, y las credenciales están scopeadas
por organización — **la cuenta de Onia no tiene dónde vivir**. Lo único bueno y reusable es el
webhook de PagosNet: firma HMAC sobre el cuerpo crudo, lock transaccional y reconciliación de
montos.

---

## 2. La brecha, por bloques

### Bloque 0 — NO depende del banco. Se puede empezar el lunes.

| # | Pieza | Por qué primero |
|---|---|---|
| B0.1 | **Entidad `subscriptions` con máquina de estados** (pendiente → pagada → activa → vencida → suspendida) | Es el corazón. Sin estados no hay renovación ni gracia, y el plan se sigue sobrescribiendo |
| B0.2 | **UNA sola función de alta** (`applyEntitlement`) y que los dos caminos manuales la llamen | Si no, cada disparador nuevo duplica la lógica |
| B0.3 | **Cargo con referencia propia** (`onia_sub_<id>_<periodo>`) y `UNIQUE` | Sin identificador propio no se sabe quién pagó. Hoy lo tipea el usuario |
| B0.4 | **`payment_events` con `UNIQUE(proveedor, eventoId)`** | La idempotencia real |
| B0.5 | **Unificar la puerta:** que el registro llame a `provisionOrganization` | Hoy el self-service solo pare clínicas dentales |
| B0.6 | **El contrato de cobro tiene que saber representar un QR** | El QR estático existe porque `PaymentResult` solo tiene `redirectUrl` |
| B0.7 | **Cancelación autoservicio** | El **art. 7 e) de la RD 079/2022** exige que la autorización sea revocable por el ordenante |
| B0.8 | **Cerrar el agujero de la captura** (§4) | Es lo único de la lista que es una vulnerabilidad, no una función faltante |

### Bloque 1 — depende de la reunión del 5-ago
Adaptador del banco · webhook firmado con anti-replay (con el secreto de firma **separado** de la
API key) · o reconciliador por consulta si no hay webhook · **y un reconciliador de respaldo
obligatorio en los tres escenarios**, porque un webhook se puede perder.

### Bloque 2 — recurrencia
Generar el cobro del período siguiente · avisos a −7/−3/−1 días · gracia de pago · suspensión que
**no borra datos**: reactivar es pagar, no migrar.

---

## 3. Los tres escenarios del banco

Lo que cambia **no es el código del alta** —es el mismo en los tres— sino **el disparador, la
latencia y qué se le promete al cliente en pantalla**.

| | (a) Webhook | (b) Solo consulta | (c) Ni una ni otra |
|---|---|---|---|
| **Qué dice la pantalla** | "Tu cuenta está activa" | "Te avisamos en ~N minutos" | "A primera hora; mientras tanto te extendimos 48 h" |
| **Latencia** | Segundos | Minutos `[PREGUNTAR]` | Horas / horario laboral |
| **Trabajo humano por venta** | Cero | Cero, salvo colgados | **Uno por venta y por renovación** |
| **Costo permanente** | Bajo | Medio | **Alto y creciente** |
| **¿"Comprá ahora" en la landing?** | Sí | Sí, con el copy correcto | No sin asterisco |

**La regla de la pantalla: informar el estado real, nunca prometer.** No decir "tu cuenta está
lista" antes de tener el evento en la base. Si a los 90 segundos no llegó, se pasa al mensaje del
escenario (b) sin drama y sin error rojo.

### 🔑 La palanca más importante de todo el documento

En los escenarios (b) y (c), **lo que el cliente compra a las 3 AM no es el acceso — es la
continuidad del acceso.** El trial ya se lo dio.

De ahí sale la regla de diseño: **recibir un comprobante extiende automáticamente el acceso 48
horas**, aunque el pago todavía no esté confirmado. Nadie que pagó se queda afuera, el peor
ticket de soporte deja de existir, y el riesgo queda acotado — 48 h de acceso no son un plan pago.

Y el caso real más probable **no** es "un desconocido compra de madrugada". Es: **a un cliente le
vence el trial un domingo, paga, y el lunes descubre que quedó bloqueado.** Eso lo resuelve esta
regla, y no necesita banco.

---

## 4. 🔴 El agujero que ya está abierto

Cuatro problemas que se suman:

1. **`autoApprove` activa un plan sin verificación bancaria.**
2. **No hay límite de intentos** en el endpoint que sube comprobantes — el registro sí lo tiene.
3. **La referencia de transacción es opcional y no se deduplica**: el mismo comprobante se puede
   presentar dos veces, o desde dos cuentas.
4. **La evidencia caduca antes que la disputa**: la URL del comprobante dura 7 días.

**Arreglo inmediato, sin depender del banco (≈1 día):** que `autoApprove` **deje de escribir el
plan** hasta que exista verificación real —que marque revisado y avise, nada más— · límite de
intentos en el endpoint · referencia obligatoria y única · revisar siempre por la ruta del
archivo, no por la URL firmada.

---

## 5. La recomendación

> **Construir el circuito completo, pero no venderlo como self-service todavía.**

- **Plan de entrada (Bs 320):** compra sola, 24/7. Es el único donde el margen no aguanta una
  demo.
- **Planes altos:** el botón "Comprar" **funciona igual**, pero al lado, con el mismo peso, "Ver
  una demo de 20 minutos". La demo se ofrece como beneficio, **nunca como muro**.
- **Lo que NO se hace:** esconder el precio detrás de "contactar ventas". En Bolivia eso se lee
  como "es caro y no lo quieren decir".

**El porqué, en una frase:** con cero clientes y 11 semanas de runway, **el self-service no traba
la primera venta —la confianza sí—, pero el circuito de suscripción traba todas las renovaciones**.
Con 5 clientes, cada baja evitable es el 20% del negocio. Y además cierra un agujero de seguridad
que hoy está abierto en producción.

---

## 6. Tres preguntas nuevas para el banco

Se suman a las que ya están en `ONIA_BCP_REUNION_20260805.md`:

- **¿El aviso trae la hora de acreditación o la de la notificación?** Define qué pasa cuando un
  pago acredita tarde.
- **¿Se puede consultar el estado por NUESTRO identificador**, o solo por el del banco? Sin eso,
  si se pierde el id del banco el reconciliador queda ciego.
- **¿El extracto de movimientos por rango es accesible por API?** Es el plan C real: conciliar
  contra el extracto en vez de contra una captura.

---

Relacionado: `ONIA_BCP_REUNION_20260805.md` · `ONIA_PAGOS_ARQUITECTURA_20260730.md` ·
`ONIA_PRICING_MODELO_20260730.md` · `ONIA_ENFOQUE_20260727.md`
