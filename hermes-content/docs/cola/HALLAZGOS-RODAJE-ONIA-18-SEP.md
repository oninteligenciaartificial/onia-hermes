# Hallazgos del rodaje en Onia Platform · 18-sep

> Salieron de grabar el recorrido COMPLETO con una cuenta nueva y real (org demo
> «Tienda La Esquina», comercio, creada por `/register` el 17-sep). No son opiniones:
> cada uno frenó la grabación en un punto concreto. **Van al carril del producto, no a
> éste** — acá quedan anotados con su evidencia para que no se pierdan.

## 1 · 🔴 El onboarding carga productos SIN stock, y Caja bloquea la venta

El paso 3 del onboarding («¿Qué vendés y a cuánto?») guarda nombre y precio. No pide
cantidad. Resultado: los 3 productos quedan con **stock 0**, y al intentar la primera
venta —que es el paso 4 del propio checklist «Primeros pasos»— Caja responde:

> `Stock insuficiente: disponible 0, solicitado 1`

El usuario nuevo queda trabado justo en la acción que el sistema le pide hacer. El
stock inicial sólo se carga desde **Catálogo → Nuevo producto → «Stock inicial»**, y
nada en el onboarding ni en el checklist lo dice.

**Evidencia:** `debug-venta-final.png` del primer intento (ticket armado, error en rojo).

## 2 · 🔴 El SKU es obligatorio de hecho, pero no está marcado

En «Nuevo producto», si se deja el SKU vacío el botón **«Guardar producto» queda
deshabilitado** y ningún texto explica por qué. Los campos obligatorios llevan `*`
(Nombre lo tiene); SKU no. Con SKU cargado, guarda al instante.

**Evidencia:** el primer run falló con `element is not enabled`; el segundo, idéntico
pero con SKU, guardó y dejó el producto con sus 24 unidades.

## 3 · ⚠️ El ticket de Caja persiste entre sesiones

Un ticket a medias (producto agregado, sin cobrar) sigue ahí al volver a entrar días
después. Puede hacer que alguien cobre algo que agregó en otro momento. Quitar item
por item es la única salida visible.

## Lo que SÍ funcionó, sin un solo tropiezo

- Registro en 2 pasos + correo de confirmación + activación.
- Onboarding completo (datos, horarios, catálogo, equipo) con su pantalla de resumen
  «Tienda La Esquina ya está en Onia».
- Alta de producto con stock → venta en Caja → **«Venta registrada: Bs 12,00 en
  Efectivo»** + recibo + total del día + la venta listada.
- El panel reflejó la venta al instante (Bs 12,00, 100 % efectivo, «Vendiendo desde
  las 15:39»).
- El asistente del sistema respondió con pasos numerados y un botón directo a la
  pantalla («Ir a Equipo»).
