# Funciones de la competencia que entran en la 1.0 (lista corta)

> 16-oct-2026. Pedido de Sergio Urcullo (orden del 16-oct: «mirar a todos los competidores de Onia Platform y agarrar
> funciones que nos sirvan»). Un tema = un archivo sin fecha: se EDITA.
> **Alcance:** solo investigación. No toca código. La lista va al hilo Plataforma 1.0, que decide el orden de construcción.
> **Fuentes:** no se rehizo el análisis. Se cruzaron `BACKLOG_DE_PRODUCTO.md` (8-oct, 14 rivales),
> `PRODUCTO_COMPETENCIA_RESUMEN.md`, `MAPA_COMPETENCIA.md` y `docs/ONIA_NIVEL_REFERENTES_BRECHA.md` (B01-B77) con el plan
> `docs/ONIA_PLAN_1.0_Y_CAJA.md`, y se sumó una pasada web del 16-oct para comercio, importadora, estética y servicios
> (los rubros que las pasadas anteriores casi no cubrían). Estado de cada brecha: medido el 2-8 oct; **el hilo Plataforma
> lo reconfirma en producción antes de construir**.

## Criterio

Entra en la 1.0 si cumple las cuatro: (1) un rival que el cliente ideal conoce ya la tiene, (2) se ve en la demo o en la
primera semana de prueba, (3) se construye con lo que Onia ya tiene, sin Meta, sin SIAT y sin gasto, (4) sirve a más de un
rubro o al dental, que se vende primero. Lo que depende de Meta, del SIAT o de un trámite queda para después.

## Lista corta: 7 funciones

| # | Función | Quién la tiene (fuente) | Rubros | Brecha | Esfuerzo |
|---|---|---|---|---|---|
| 1 | **Agenda de día y semana con una columna por profesional** | Doctocliq, Dentalink (`DOCTOCLIQ_TEARDOWN.md`, `DENTALINK_TEARDOWN.md`); AgendaPro (`AGENDAPRO_CITALO_TEARDOWN.md`) | dental, estética, servicios | B01 | M |
| 2 | **Agenda que no miente:** estado en 1 clic, reprogramar devuelve la cita a «pendiente» con sus recordatorios, feriados y vacaciones que respeta la reserva online | Doctocliq, Dentalink, AgendaPro, NativeCode (`ANUNCIANTES_FICHAS_CORTAS.md`) | dental, estética, servicios | B02, B03, B04 | S a M (feriados: S; vacaciones y bloqueos por profesional: M) |
| 3 | **Botón «Enviar por WhatsApp» en cada cita** con el recordatorio y el link de confirmar ya armados (`wa.me`) | Doctocliq (recordatorio con botones encendido de fábrica), Huli, Calu (`HULI_FICHA.md`, `CALU_FICHA.md`) | dental, estética, servicios | B08 | S |
| 4 | **Presupuesto por fases con estado** (aceptado, abandonado, terminado) y PDF o link. En estética es el **paquete de sesiones**: AgendaPro muestra en la ficha cuántas sesiones lleva cada tratamiento y cuáles están sin pagar | Doctocliq, Dentalink; AgendaPro (página de estética, 16-oct) | dental, estética, servicios | B14 (+ #2 del backlog) | M |
| 5 | **Caja diaria con apertura, cierre por medio de pago y descuadre** | Doctocliq, Dentalink; el cierre de caja es el gancho de los sistemas de comercio (Control Facilito, YoFacturo) | dental, estética, servicios (comercio ya lo tiene) | B17 | M, reusa `cajaTotals` de comercio |
| 6 | **Plantilla precargada por rubro al registrarse** (servicios, horarios, mensajes de ejemplo, categorías) | Lety (`LETY_FICHA.md`) | los 5 | #3 del backlog | S |
| 7 | **Lista de citas canceladas y faltas por recuperar**, conectada al reprogramador que ya existe | Dentalink (tarea «Cita»), Fluker (`FLUKER_FICHA.md`) | dental, estética, servicios | #1 del backlog | S |

**Paso 0 (no es copiar, es arreglar):** el detector de tratamiento a medias hoy no encuentra a nadie (cuenta «En progreso»,
la ficha carga «Pendiente») y es el argumento central contra Dentalink, AgendaPro y Doctocliq. Va antes de todo (B15, B16;
`BACKLOG_DE_PRODUCTO.md` arriba). Sin eso, el Recall no se puede mostrar en la demo. El punto 7 es independiente: solo selecciona citas canceladas o con falta y las pasa al reprogramador que ya existe.

### Si sobra tiempo antes del 30-oct (en este orden)

- **Comisión por profesional sobre lo cobrado** (B36 / #5 del backlog): AgendaPro la calcula sola desde la venta; la pide
  la estética con 2-6 profesionales. S a M, después del punto 5.
- **Cuenta corriente del cliente: anticipo, saldo a favor y cuotas** (B35): sirve a servicios profesionales (honorarios por
  etapas) y a estética (paquetes). Fuente de servicios: solo un artículo de un proveedor argentino sobre cómo debe ser un
  sistema para estudios jurídicos (YoFacturo, 2026), que describe la función pero no prueba que un rival boliviano la tenga.
  Tratarla como idea, no como evidencia.

## Qué se encontró por rubro (para no repetir la búsqueda)

| Rubro | Rivales mirados | Conclusión |
|---|---|---|
| Dental | Doctocliq, Dentalink/Medilink, TuDoc, Huli, Dt.Dental, Calu, Reservo, Clinera | Cubierto a fondo. Las funciones 1-5 y 7 salen de acá. Ventaja de Onia: el tratamiento a medias solo (cuando funcione). |
| Estética | AgendaPro (16-oct), Agenda en Día, Fluker, Calendico, CitaPro | Piden agenda por profesional, sesiones por tratamiento, comisión automática y recordatorio de 1 a 3 días. AgendaPro no menciona consentimiento ni «antes y después» como función explícita; Onia puede ganar ahí después (no es 1.0). |
| Servicios profesionales | Casi ninguno boliviano con producto visible; Odoo/Datec como alternativa de integrador | **Hueco de evidencia.** Ningún rival directo hallado. No se copia nada con fuente firme; la función 6 y la cuenta corriente son lo más defendible. No inventar «lo que hace la competencia» para este rubro. |
| Comercio | Control Facilito, Mi Factura Bolivia, eDoc Pyme, YoFacturo (aún sin Bolivia), Odoo | **No compite sin factura SIAT**: Mi Factura da ventas, inventario y SIAT por Bs 320; Control Facilito, Bs 772 con SIAT. Mientras el SIAT esté apagado, comercio se muestra como caja, fiados y kardex y **no se compara** con ellos. Lo que ellos tienen y a Onia le falta es la factura, no una función suelta. Factura de contingencia sin internet (Mi Factura): después, junto al SIAT. |
| Importadora | Control Facilito (la nombra como cliente), NITRO (contable, sin módulo de importaciones documentado), Odoo/Datec | **No se halló ningún rival con costeo de importación ni seguimiento de cotizaciones B2B**: es probable ventaja de Onia, pero «no lo encontré» no prueba «no existe». Misma barrera que comercio: la factura. |

## Para después de la 1.0 (con su motivo)

- Recordatorio por WhatsApp con botones desde el número de Onia (B06, B40), conectar el WhatsApp del cliente con coexistencia
  (B10, B11, #7) y campañas a un segmento (#8, B71): dependen de Meta, del chip prepago y del gasto.
- Seña con QR al reservar (Reservo, Calu): depende de la API QR del BCP.
- Odontograma por caras (B13), anamnesis, consentimiento digital (legal, [ok Sergio Urcullo]), radiografías, periodontograma.
- Seguimiento de la consulta abandonada (Fluker, SendyPro): necesita WhatsApp entrante vivo.
- Bandeja con pausa del bot y asignación, origen del lead por anuncio (#9, #10): van con el add-on del chatbot.
- Factura SIAT en el plan y factura de contingencia: la 1.0 la sigue prometiendo solo por correo y manual (B20).
- Varias sedes (B67), convenios con aseguradoras (B74), citas en serie (B49), lista de espera (B53).

## Ya está en el plan 1.0: no duplicar

Gracia de 7 días antes de cortar, «no renovar», términos aceptados con versión, importar CSV con `;`, respaldos fuera del
VPS, cobro de punta a punta, anual que cobra 11 meses (Mi Factura Bolivia). Son del hilo Plataforma y su cola
(`cola/loop/plataforma.md`).

## Lo que NO se copia (se repite en las fichas)

Tarjeta antes de la prueba (Lety, Eholo), borrar datos al no pagar (Wati, Dentalink), mínimos de 6 meses (Kommo), precio
tachado inventado (Control Facilito), cobrar por documento con recargas (eDoc Pyme), fee de implementación (Control
Facilito), límites por cantidad de facturas (Mi Factura).

## Límites de esta pasada

- Web pública de hoy, sin cuentas de prueba. Los precios de los rivales de comercio vienen de las fichas del 3-oct y deben
  recontarse antes de usarlos en material de venta.
- YoFacturo no tiene precios ni producto para Bolivia todavía (lista de espera). NITRO no publica precios.
- Los rubros servicios, comercio e importadora se pueden profundizar con la Biblioteca de anuncios y cuentas de prueba, que
  salen de la PC (la nube no abre esas cuentas ni Facebook).
