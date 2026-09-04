# Onia 1.0 — alcance cerrado

> **Doc vivo, sin fecha: se EDITA.** Nace el 2026-09-04, cuando Sergio dijo: *"me parece que nos
> abrimos mucho, dejemos operativo a una versión 1.0"*. Mientras este documento diga `EN CURSO`,
> **nada que no esté en la lista de abajo se desarrolla**: se anota y espera.

---

## El objetivo, uno solo

**Tres negocios pagando el plan Profesional antes del 30 de septiembre de 2026.**

Se mide así, sin interpretación: filas en `organizations` con plan `professional` y un pago
registrado y aprobado, de negocios que no son de Sergio ni de su familia.

Si el 30 de septiembre hay 0, el problema no es el producto: es la venta.
Si hay 3, la versión 1.1 la decide lo que pidan esos tres, no nosotros.

---

## Qué ES la versión 1.0

Un negocio de Bolivia se registra solo, carga a sus clientes, agenda, cobra, y el dueño ve su día
desde el celular. **Todo esto ya está vivo y verificado en producción.**

| Pieza | Estado |
|---|---|
| Registro solo, con 14 días de prueba | ✅ vivo |
| Agenda y citas (crear, ver el día, agenda pública) | ✅ vivo |
| Clientes o pacientes con su ficha | ✅ vivo |
| Cobros: factura interna, pago, recibo imprimible | ✅ vivo |
| Contabilidad: libro de compras, resumen de IVA para el contador | ✅ vivo |
| Chatbot del sitio web con cuota de 500 conversaciones | ✅ vivo (add-on) |
| Entrar seguro: bloqueo por intentos, verificación en dos pasos | ✅ vivo |
| Panel con lo del día | ⚠️ funciona, pero se rediseña (ver 1.0-b) |

### Lo que falta para poder cobrar, y es corto

1. **Material de venta honesto.** La web y el guion prometen factura del SIN, que está apagada.
   *En corrección (`t_db9acebf`).* **Bloquea escribirle a los leads.**
2. **El dueño conecta su WhatsApp.** Meta ya aprobó los permisos; el botón está vivo. Falta que
   Sergio lo pruebe una vez para poder mostrarlo. *1 clic suyo.*
3. **Panel de inicio en tres renglones** y **Configuración de 7 pestañas a una página**. Es lo que
   separa "lo probé y me perdí" de "lo entendí solo". *Diseño aprobado pendiente.*
4. **Cobrar el plan sin fricción.** Hoy: transferencia + comprobante + aprobación a mano. Funciona,
   pero cada paso pierde gente. *El QR del BCP está construido y espera credenciales de Sergio.*

---

## Qué NO es la versión 1.0

Nada de esto se desarrolla hasta tener los tres clientes pagando. Se nombra solo si el cliente
pregunta, y se responde con la verdad: **todavía no**.

- Facturación fiscal SIAT (trámite al 24,8 %; el Punto de Venta 1 depende del SIN y de Sergio).
- Instagram y Messenger del cliente (código listo, escondido tras bandera; espera App Review).
- La agenda que se actualiza sola (el servicio ya corre, falta la entrega de eventos).
- Uso sin internet.
- API pública para terceros (existe y funciona; no se promete ni se vende todavía).
- Los agentes que proponen acciones (40 corridas, 0 propuestas: no se vende lo que no propone).

---

## Precios: cómo escalan

Fuente única: `onia-platform/lib/subscription-plans.ts` (planes) y `lib/pricing.ts` (add-ons).
Ningún documento ni página define precios: los **lee** de ahí.

| Plan | Mes | Semana | Año | Tope |
|---|---:|---:|---:|---|
| Básico | Bs 320 | Bs 89 | Bs 3.200 | 1 usuario · 30 clientes |
| **Profesional** | **Bs 750** | Bs 199 | Bs 7.500 | 5 usuarios · 1.500 clientes |
| Completo | Bs 1.500 | — | Bs 15.000 | sin tope de usuarios |
| Empresa | Bs 2.900 | — | Bs 29.000 | se cotiza, no se compra en la web |

**El precio escala por tres ejes, no por antojo:** cuánta gente usa el sistema (usuarios), cuánto
volumen maneja (clientes), y qué agrega (add-ons: asistente Bs 390, agenda pública, usuario extra
Bs 70). Un negocio que crece sube de plan porque **choca con un tope**, no porque le subimos el
precio.

**La promesa que sostiene vender temprano:** *todo lo que agreguemos a tu plan durante el primer
año entra sin costo extra.* Cuesta cero hoy, hace que el que compra ahora gane por comprar antes, y
nos obliga a mejorar. **No se promete una función concreta ni una fecha**: se promete el plan.

---

## El orden de trabajo (1.0-b, después de vender)

Cerrado y sin desvíos. Cada paso se despliega y se verifica antes del siguiente.

1. Panel de inicio en tres renglones, con el primer día resuelto.
2. Configuración: de 7 pestañas a una página con «Configuración avanzada».
3. Cobros: cliente, catálogo y total pegado al botón.
4. Contabilidad: arriba, cuánto pagar y hasta cuándo.
5. Velocidad: el panel abre en menos de 1,5 s.

---

## Lo que decide Sergio, y nadie más

Escribirle a un cliente · publicar con su cara o la de Lucía · gastar plata · el Punto de Venta 1
en el SIN · las credenciales del banco · conectar su WhatsApp · y el sí o no a cada pieza de diseño
antes de que reemplace una pantalla viva.
