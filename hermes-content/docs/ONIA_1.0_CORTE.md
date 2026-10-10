# Onia 1.0 — el corte: qué se vende ya, qué va en la 1.1 y qué después

> **Doc vivo, sin fecha: se EDITA.** Es la fuente única del corte de la 1.0. Hasta el 10-oct se
> llamaba `ONIA_V1_ALCANCE.md` (4 al 6-sep: objetivo de 3 clientes al 30-sep, las cuatro decisiones
> de precio del 6-sep y el recorrido de servicios y comercio). Ese texto sigue en git:
> `git log -p -- hermes-content/docs/ONIA_V1_ALCANCE.md`.
>
> Pedido de Sergio Urcullo, 10-oct: *«plataforma dejalo desarrollando la 1.0 (el sistema para los
> negocios por todos los rubros, siat, los agentes conversacionales y demás), definí hasta dónde la
> 1.0 para ya vender pero mantené la identidad de onia»*.

**Con qué convive, sin repetirlo:**

| Tema | Manda |
|---|---|
| Qué se dice en la venta, frase por frase | `ONIA_CATALOGO_DE_VENTA.md`. Si una fila de acá dice «1.0» y el catálogo no la tiene en ✅, **no se promete** |
| Los 15 puntos y su fecha | `ONIA_PLAN_1.0_Y_CAJA.md` |
| Cuándo se declara terminada | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §11: un cliente se registra solo, usa un día real y **paga el segundo mes** |
| A quién se le vende | `ONIA_CLIENTE_IDEAL.md` |
| Precios y topes | `onia-platform/lib/subscription-plans.ts`, `plan-catalogo.ts` y `pricing.ts`. Acá no hay montos |

---

## El criterio

- **1.0 = se vende ya.** Está en producción y alguien lo **miró** funcionando. Construido sin mirar no
  cuenta: «construido ≠ terminado» (`CLAUDE.md`).
- **1.1 = se sigue desarrollando.** Está construido o en curso y se vende el día que se publica y se
  mira. Lo que Sergio Urcullo pidió seguir desarrollando (todos los rubros, el SIAT y los agentes
  conversacionales) vive acá: no se frena, pero **no se promete** antes.
- **Después** = depende de un tercero que no controlamos o no sirve a la etapa 1.
- Todo sirve a la **etapa 1** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7, salida: 5 clientes pagando) y no
  baja la **identidad** (§5 de abajo).

**Medido el 10-oct** (SQL de solo lectura en la base de producción): **0 pagos de suscripción** (la
tabla está vacía) y 11 cuentas, entre ellas varias internas, demo o de QA. Hoy no hay ningún cliente
pagando: todo lo de abajo existe para conseguir el primero.

---

## 1. Rubros

| Rubro | Qué funciona hoy en producción | Corte |
|---|---|---|
| **Dental** | Alta sola que arranca con 6 servicios en Bs 0, horario de lunes a viernes y un aviso (K3, mirado el 9-oct con una cuenta QA nueva). Agenda, ficha con odontograma, tratamientos, cobros, inventario, contabilidad. Agentes corriendo cada día | **1.0. Se sale a buscar.** Agenda por profesional, odontograma de 5 caras y caja diaria: **1.1** (construidos, esperan el OK de diseño) |
| **Estética** | Las mismas pantallas y agentes que dental, con su vocabulario y sin odontograma | **1.0. Se sale a buscar**, junto con dental |
| **Importadora** | Alta sin la semilla dental, con costeo de importación, alerta de reprecio y cotizaciones; el cron le creó cobrador, reponedor y seguidor (medido el 9-oct) | **1.0 acotada:** costeo y alerta de reprecio (decisión del 30-sep, `ONIA_CLIENTE_IDEAL.md` §6). La cotización no sale del sistema y no hay comprobante de venta: **1.1** |
| **Comercio** | Catálogo, caja, fiados, clientes y recibo, recorridos en producción el 6-sep. Editar producto, precio y stock ya está en el código (`EditarProducto.tsx`, `AjustarStock.tsx`) | **1.1.** Se le escribe cuando la factura del SIN esté dentro del sistema (orden del 29-sep en `CLAUDE.md`) y alguien recorra la demo con una cuenta nueva |
| **Servicios profesionales** | Agenda, clientes sin datos clínicos, caja y contabilidad, recorridos el 4-sep | **1.1.** Misma condición del SIN, más la agenda de varios profesionales (#118) |
| Veterinaria y ganadería | El alta las rechaza (400) | **Después** |

## 2. SIAT y factura

| Pieza | Qué funciona hoy | Corte |
|---|---|---|
| Factura de Onia por cada cobro de suscripción | Se emite a mano en el Portal del SIN. Desde #114 (en `master` el 10-oct, sale a producción a las 21:50 UTC), el sistema **no aprueba un pago real sin el número de factura**. Los pagos automáticos quedan en «Falta factura» | **1.0** |
| Libro de compras y resumen de IVA para el contador | Vivo (`/contabilidad`) | **1.0** |
| Factura electrónica emitida desde el sistema, para Onia y para cada negocio | Homologación al 90 % (portal del SIN, 8-oct). Falta solo la etapa VI: 180 casos que piden el **CAFC del piloto** (pedido a Sergio Urcullo el 9-oct). El SIN da plazo hasta el **04/11/2026**. La emisión está apagada en producción | **1.1.** Se nombra el día que se emite y se mira una factura real. Es la llave de comercio y servicios (§1) |

## 3. Agentes que proponen y agentes conversacionales

| Pieza | Qué funciona hoy | Corte |
|---|---|---|
| Agentes que proponen y el dueño aprueba en «Pendientes» (recall, confirmador, reprogramador, cobrador, reponedor, seguidor) | Corren solos a las 07:00 de La Paz (0 errores del 3 al 8-oct). En la demo: 4 propuestas del recall y 1 del reprogramador (9-oct) | **1.0**, con las frases permitidas del catálogo §8 |
| Tratamiento a medias (lo pidió Sergio Urcullo) | En producción desde el 8-oct, incluida la carga de tratamientos ya empezados | **1.0 cuando se mire** en la demo con login. Hasta entonces la venta no lo nombra (catálogo §8) |
| Recordatorio de cita por correo, 24 h y 2 h antes | Vivo | **1.0** |
| «Enviar por WhatsApp» en cada cita y confirmar con 1 toque | En producción desde el 8-oct (#128). Falta mirarlo con login | **1.0 cuando se mire** |
| Bandeja de conversaciones en vivo y escribirle a un contacto nuevo | Construidas (#136) | **1.1:** esperan el OK de diseño |
| Chat de la web del negocio (se presenta con el nombre de la clínica, contesta el asistente y, si hace falta, una persona) | Construido (#140 + W1f) | **1.1:** espera el OK de diseño y su infra |
| Agente de WhatsApp del negocio (contesta, manda el link de reserva, deriva a una persona) | Construido, pero nunca se conectó el WhatsApp de un cliente | **1.1:** con el chip prepago y el primer mensaje real (decisión del 1-oct). Nunca se promete «la IA agenda sola» |
| Interpretar la respuesta al recordatorio (K1, #132) | Código revisado, pero ninguna parte del sistema lo llama | **Después:** necesita que el agente de WhatsApp esté conectado |

## 4. Cobro y QR

| Pieza | Qué funciona hoy | Corte |
|---|---|---|
| Checkout sin ayuda: 4 planes, 3 ciclos, de usted | Vivo; de usted desde el 10-oct (#142) | **1.0** |
| QR del BCP → el cliente sube el comprobante → Sergio Urcullo aprueba → plan activo | Vivo, con **0 pagos**. Falta la prueba de punta a punta (punto 1) | **1.0. Bloquea vender:** es lo primero |
| Prueba de 14 días de Profesional, 1 día de gracia y después solo lectura | Vivo | **1.0** |
| Guardar la prueba de que el cliente aceptó los términos (punto 14, #124) | Construido, con la migración aplicada el 10-oct. Antes del merge le falta registrar la versión 1.3 | **1.0.** No cambia ningún texto legal |
| 7 días de gracia en el plan pago y el botón «no renovar» (punto 13, #113) | Construido. Cambia §3.3 y §3.4 de los términos: el borrador 1.4 está en `cola/capturas-terminos/` | **1.0 con los términos 1.4**, después del sí de Sergio Urcullo y de Leslie Mercado Moreno (titular). Según §11 de los términos, a las cuentas que ya existen les rige a los 30 días |
| Respaldo fuera del VPS con una restauración probada (punto 4) | El código está listo, pero falta el bucket R2 | **1.0. Bloquea vender:** depende de Sergio Urcullo |
| QR que activa el plan solo (API del BCP) y tarjeta | No activo | **Después** |

## 5. Identidad

| Pieza | Qué funciona hoy | Corte |
|---|---|---|
| Un solo producto con packs por rubro. Se vende el sistema y el chatbot es un add-on, sin autobombo | Regla vigente (`CLAUDE.md` §3) | **1.0** |
| Lo que ve el cliente le habla de usted | Panel desde el 8-oct, checkout y reserva pública desde el 10-oct. Un gate de CI impide que vuelva el voseo: quedan **594** formas de vos en 262 archivos (línea base del 10-oct) | **1.0:** venta, alta y cobro. **1.1:** el resto, hasta 0 |
| La venta no exhibe obra («muy pronto», «beta») | Tests en el alta y el login | **1.0** |
| La letra de la marca dentro del sistema (Instrument Sans + IBM Plex Mono) | Vivo desde el 10-oct (F1) | **1.0** |
| El sitio onia.com.bo y sus términos hablan de vos | Términos 1.3 | **Decide Sergio Urcullo** (carril web) si pasan a usted. La versión 1.4 conserva el vos para no mezclar dentro del documento |

---

## ¿Hay que mover el orden de rubros de `CLAUDE.md`? No

El orden de `CLAUDE.md` es dental → importadora → el resto, y comercio y servicios esperan la factura
del SIN dentro del sistema. Este corte lo respeta, por tres números:

1. **El mercado no frena la etapa 1.** Santa Cruz tiene 125 clínicas y 1.812 consultorios dentales
   registrados (dato de ~2018): 5 clientes son entre el 1 y el 3 % (`ONIA_CLIENTE_IDEAL.md` §7).
2. **Sin factura del SIN, comercio y servicios pierden la demo** contra los sistemas bolivianos que sí
   facturan. La emisión llega con la etapa VI, que tiene plazo hasta el 04/11.
3. **El techo son las horas de soporte**, no los rubros (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9). Cada rubro
   que se sale a buscar suma demos y soporte a una sola persona.

**Una propuesta, no un cambio:** `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 todavía dice «vender **solo**
dental/estética». El 30-sep Sergio Urcullo sumó la importadora acotada (`ONIA_CLIENTE_IDEAL.md` §6 y el
orden de `CLAUDE.md`). Alinear esa línea lo decide él.

## Lo que falta para vender la 1.0, en orden

1. **Cobro de punta a punta** (punto 1): la madre en la PC y 1 clic de Sergio Urcullo. Desde #114, antes
   de aprobar hay que marcar «Cuenta interna de prueba verificada» en la cuenta «ZZ QA Pago».
2. **Respaldo afuera** (punto 4): el bucket R2 de Sergio Urcullo.
3. **Términos:** #124 entra sin esperar; el 1.4 con la gracia necesita el sí de Sergio Urcullo y de
   Leslie Mercado Moreno.
4. **Mirar con login** lo que ya está publicado: la agenda en vivo (#139), WhatsApp por cita y confirmar
   con 1 toque (#128), el checkout de usted y «Falta factura».
5. **La demo refrescada** para las capturas C1-C7 del video de venta.

**Pasan de 1.1 a 1.0 con una sola respuesta suya:** el OK de diseño de las 7 pantallas (bandeja,
contacto nuevo, agenda, odontograma, caja, app sin internet y el chat de la web), el CAFC del piloto
(SIAT) y el chip prepago (agente de WhatsApp).
