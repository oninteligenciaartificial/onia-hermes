# Dos paneles de comandas — competidores directos, mismo mes, dos países

- **Videos:** https://www.instagram.com/p/DcCSKN8CDon/ (17 s, ES/Argentina) ·
  https://www.instagram.com/p/DaaAYsRA1mp/ (27 s, PT/Brasil, sin voz)
- **Carril:** B, con lectura de producto según `competitor-profiling`
- **Cobertura real:** audio 100% del argentino ([verbatim](transcripciones/Instagram-DcCSKN8CDon.txt)) ·
  el brasilero **no tiene voz**, leído solo por fotograma · 3 de 9 y 1 de 13 fotogramas leídos
- **Veredicto: SIRVE YA — es el mapa de features del rubro gastronomía**

> **Alcance honesto.** `competitor-profiling` pide scrapear el sitio, precios, reviews y SEO. No
> se hizo: de estos productos solo tengo lo que el video muestra. Esto es un **perfil parcial
> desde evidencia visual**, no un perfil completo. Lo que falta está listado abajo.

---

## Competidor 1 — DougMenu (Argentina)

**Evidencia dura leída en pantalla** (fotograma 3): la barra del navegador muestra
`doug-fiard-beta.vercel.app/dashboard/pedidos`, la pestaña dice *"Comandas · DougMenu"*, y una
franja superior dice *"Tu plan se renueva en 26 días y 10 horas"*.

De ahí salen tres hechos, no interpretaciones:

| Hecho | De dónde |
|---|---|
| **Corre en Vercel, en un subdominio `-beta`** | la URL |
| **Es SaaS por suscripción con renovación** | la franja del plan |
| **Tiene niveles: hay badges `PRO` en el menú lateral** | sidebar, junto a Promociones y Estadísticas |

**El tablero (Comandas):** tres columnas — `Nuevo` · `En preparación` · `Listo` — con indicador
*"● En vivo"* y contador *"1 activos"*. Se arrastra la tarjeta para cambiar de estado, dicho
textual: *"a medida que avanza, simplemente mueves la tarjeta para actualizar su estado."*

**La tarjeta de pedido** trae, todo en una sola vista: número (`#FFA9604`), antigüedad
(*"hace menos de un minuto"*), badge `Delivery`, nombre y teléfono del cliente, dirección
(Av. Corrientes 1234, CABA), **un mapa embebido con el pin**, ítems con precio unitario
(1x Doble Cheddar $5.900), nota del pedido, **TOTAL $8.700**, **método de pago (Efectivo)**,
una franja de código de barras (ticket para impresora) y el botón `Aceptar y preparar`.

**El editor de menú** (fotograma 8): tarjetas de producto con foto, nombre, descripción, precio,
**Stock: 30**, toggle **Visible** y borrar; categorías (Bebidas); botón `+ Producto`.

> Detalle de producción, no de producto: las fotos de hamburguesas son **generadas con IA**
> (pan azul, pan rosado — no existen en el local). Catálogo demo sin sesión de fotos. Costo cero,
> y se ve profesional. Eso es reusable para las demos nuestras.

## Competidor 2 — panel brasilero (sin marca visible)

Filmado de una pantalla, sin voz, crédito *"por Rafael Ventura"*. En portugués. Comparte el
mismo esqueleto y agrega dos cosas que el argentino no muestra:

- **`Parear impressora`** — emparejado de impresora térmica por Bluetooth, en la interfaz.
- **Estado `Saiu pra entrega`** (salió para entrega) — o sea, la máquina de estados llega
  **más allá de "Listo"**, hasta el reparto, con contador de minutos.
- Métricas al pie en vivo: `Total: 2` · `Receita: R$ 70` · `Ticket: R$ 39` · `Entrega: 0min`.
- Separación de canal: `Balcao - Mesa` (mostrador/mesa) vs delivery.

## El mapa de features que sale de los dos

Esto es lo que un negocio de comida ya considera **normal** en 2026. Si vendemos el rubro sin
esto, se nota:

| # | Feature | Doug (AR) | BR | Nota |
|---|---|---|---|---|
| 1 | Tablero por estados, arrastrable, en vivo | ✅ | ✅ | mínimo indispensable |
| 2 | Ticket con cliente + dirección + **mapa** | ✅ | — | el mapa ahorra la llamada |
| 3 | Método de pago en la tarjeta | ✅ | — | decide si el repartidor lleva cambio |
| 4 | Impresión térmica de comanda | código de barras | **pareo Bluetooth** | el local lo pide siempre |
| 5 | Estado hasta **entregado**, con reloj | — | ✅ | acá se mide el servicio |
| 6 | Métricas del día al pie (total, ticket promedio) | — | ✅ | es la razón por la que el dueño abre el panel |
| 7 | Editor de menú con **stock** y **visible** | ✅ | — | agotar un ítem sin llamar a nadie |
| 8 | Canal separado: salón vs delivery | — | ✅ | |
| 9 | Suscripción con niveles (`PRO`) | ✅ | — | modelo de negocio idéntico al nuestro |

## Lectura competitiva honesta

**Dónde son más fuertes que nosotros hoy:** tienen **producto de rubro terminado y mostrable**.
Un dueño de local ve 17 segundos y entiende qué compra. Nuestro material del rubro comercio no
tiene una demo así.

**Dónde somos más fuertes:** ellos son **una app de un rubro**. Nosotros somos plataforma con
módulos y **facturación fiscal boliviana** — que es exactamente lo que un local de Bolivia va a
necesitar sí o sí antes del 1-oct-2026, y que un SaaS argentino o brasilero no le va a dar nunca.
Ese es el foso, no el tablero kanban.

**La amenaza real:** no son empresas grandes. Es **una persona con Vercel y un subdominio beta**.
La barrera de entrada al rubro es baja y se está llenando.

## Lo que falta para que esto sea un perfil de verdad

No lo tengo y lo digo: precio de cada plan, qué separa `PRO` del gratis, cuántos clientes,
si facturan, y el dominio real (el que se ve es de preview). Se consigue entrando a la web —
tarea de la sesión de marketing/venta, no de esta.

## A dónde va

| Sesión | Qué |
|---|---|
| **`onia-plattform`** | las 9 features contra el módulo comercio/gastronomía: cuáles hay, cuáles no (prompt E3) |
| **marketing** | el formato de demo de 17 s + fotos de catálogo generadas (prompt E7) |
