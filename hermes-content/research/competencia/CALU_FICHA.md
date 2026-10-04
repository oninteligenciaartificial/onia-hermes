# Calu: ficha (4-oct-2026)
> Fuentes: https://www.calu.app · https://www.calu.app/planes · https://calu.app/terminos-y-condiciones · https://citas.calu.app/cuentaDemo · API de precios que usa la propia página: https://api2.chedoc.com/api/planPrices. Solo web pública, sin cuenta.
> Nombre ambiguo: existe «Calú» (calucalu.com.ar), otra agenda. Se eligió **calu.app** porque es la que le vende a consultorios de salud (médicos, odontólogos) en LatAm.

## Qué es y de dónde
- Agenda de turnos + ficha del paciente + recordatorios por WhatsApp. Empresa: Chedoc SRL, Argentina (TyC).
- Dice «+3.000 profesionales de salud usan Calu» en la home y «Más de 5000 profesionales» en el alta. Las dos cifras no coinciden.

## A quién le vende y rubros
- Profesionales independientes y centros de salud y belleza: médicos, odontólogos, nutricionistas, estética. La pantalla de alta dice: «Organizá tu centro de salud y belleza».
- El precio es por agenda (por profesional). La API trae tramos de 1, 2, 3 y de 4 a 5 agendas.

## Precio (planes para 1 agenda, mensual)
- En la página aparece «$... /mes». El monto lo carga un script desde la API, y la API no dice la moneda.
- Fuera de Argentina (por defecto): Organiza 23 · Automatiza 27 · Optimiza 32 · Potencia 37. Es probable que sean USD.
- En Argentina (`?country=ARG`): Organiza ARS 40.192 · Automatiza 46.221 · Optimiza 55.466 · Potencia 75.315, todos + IVA.
- Pagando el año: 20% de descuento. Con 2 agendas, Automatiza cuesta 44. Para Bolivia la API no devuelve nada: no visible.
- Gancho de venta: «pagas por 1 agenda menos de $1.200 por día».

## Alta y prueba
- 7 días gratis («Probalo 7 días gratís», plan Automatiza).
- Autoservicio en citas.calu.app/cuentaDemo. La primera pantalla pide solo correo y contraseña, no pide tarjeta. Los pasos que siguen: no visibles (habría que crear cuenta).
- En cada plan hay un botón «Contactar un asesor» que abre WhatsApp.

## Cobro
- Al paciente: seña o cobro por adelantado con Mercado Pago. Calu se queda una comisión que baja con el plan: 4% en Organiza, 2% en Automatiza, 1% en Optimiza. El profesional define la seña (0-100%) y el plazo para cancelar (TyC §7).
- Cómo paga el profesional su suscripción: no visible. Los TyC dicen que no hay permanencia y que la baja se pide de forma expresa.
- QR y transferencia: no visibles.

## Onboarding
- Según el plan: capacitación por video, grupal, personalizada o «configuración personalizada del centro».
- Soporte por mail en Organiza y por chat de WhatsApp desde Automatiza.

## WhatsApp y recordatorios
- Recordatorios por WhatsApp con cupo según el plan: 50, 200, 1.000 o ilimitados. Dice que bajan el ausentismo «hasta 60%».
- El paciente se saca el turno solo (autogestión, desde Automatiza). Incluye historia clínica, recetas electrónicas (de 1 a 5 profesionales) y sitio web.

## Factura
- Factura electrónica (AFIP/ARCA): no visible. Solo menciona «Administración contable» y «Registro de pago de servicios».

## Qué hace mejor que Onia
- El recordatorio por WhatsApp ya funciona y se vende por cupo. Onia hoy solo recuerda por correo.
- La seña con Mercado Pago baja el ausentismo y cobra sola. Onia aprueba a mano el QR del BCP.

## Qué copiar (ideas, decide Sergio Urcullo)
- Seña opcional al reservar, con plazo para cancelar que define el dueño.
- Mostrar el precio como costo por día («menos de Bs X por día»).
- Recordatorios con cupo por plan: hace visible el valor del plan caro.

## Qué NO copiar
- Precio escondido detrás de un script y de «Contactar un asesor».
- Cobrar comisión por cada cobro: el dueño la siente como impuesto.
- Prueba de 7 días: Onia da 14 sin tarjeta y conviene mantenerlo.
