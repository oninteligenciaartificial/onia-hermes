# Onia Nuvia Accounting Model 2026

Estado: interno Sergio/ONIA.
Fecha: 2026-06-21.
Visibilidad: privado Sergio/ONIA. No enviar completo a Arthur.

## Veredicto

Onia y Nuvia no pueden sobrevivir si todo se reparte como ganancia antes de
recuperar costos, capital, herramientas y reservas.

Decision operativa:

```text
Primero costos. Luego supervivencia ONIA/Nuvia. Luego pagos operativos
presupuestados, si existen. Luego utilidad y ganancia de Sergio como dueno.
```

Arthur se maneja como colaborador comercial-operativo en Onia general. En
Nuvia, su ganancia financiera depende del capital real por lote/campana. La
unica excepcion historica es su aporte de Bs. 300 al primer lote de productos
de Nuvia, que se respeta solo para ese lote.

## Centros contables

| Centro | Para que sirve | Responsable |
|---|---|---|
| Onia Servicios | Webs, automatizaciones, consultoria, SaaS, sistemas, auditorias. | Sergio |
| Fondo Onia | Herramientas, apps, IA, VPS, caja critica y recuperacion de capital. | Sergio |
| Capital Sergio/ONIA | Aporte de Bs. 15.000, deuda, reservas y compras aprobadas. | Sergio |
| Capital Arthur Recuperable | Apps o gastos mensuales Onia pagados por Arthur con aprobacion de Sergio. | Sergio aprueba |
| Nuvia | Producto, inventario, empaque, ventas, campanas y reparto Nuvia. | Sergio |
| Reserva Nuvia | Reposicion, empaques, devoluciones, muestras y logistica futura. | Sergio |
| Onia Media | Videos, filmaciones, canales, activos publicitarios y contenido. | Sergio |
| Sergio ingreso dueno | Ganancia/retiro de Sergio despues de proteger Onia. | Sergio |
| Arthur pago operativo | Pago fijo aprobado antes por trabajo real, cierre, seguimiento o lote 001. | Sergio aprueba |

Regla:

```text
Si un ingreso o gasto no tiene centro contable, no se reparte.
```

## Cuentas minimas por movimiento

Cada ingreso, gasto o inversion debe guardar:

1. fecha;
2. centro contable;
3. tipo: ingreso, costo, inversion, reserva, retiro o transferencia;
4. concepto;
5. monto;
6. quien pago;
7. quien debe recuperar;
8. proyecto/lote/campana;
9. responsable operativo;
10. comprobante o nota;
11. estado: pendiente, aprobado, pagado, recuperado, perdido o cerrado.

## Orden de caja Onia Servicios

Usar para webs, auditorias, automatizaciones, sistemas, consultoria y SaaS.

Formula:

```text
Ingreso cobrado
- impuestos/comisiones/plataforma si aplica
- costos directos del cliente
- herramientas externas especificas
= ingreso neto operativo

Ingreso neto operativo
- Fondo ONIA protegido
- comisiones o variables aprobadas
= utilidad Sergio/ONIA
```

Durante la prueba de 60 dias:

| Concepto | Regla |
|---|---|
| Fondo Onia Servicios | 40% del ingreso neto operativo cuando aplica el acuerdo Arthur. |
| Arthur | 0% a 50% segun participacion real, evidencia y nivel de rescate de Sergio. |
| Sergio | Minimo 10% cuando Arthur hace todo aprobado; sube si Sergio vende, corrige, dirige, rescata o termina. |

Sergio puede recibir utilidad del proyecto solo despues de registrar Fondo Onia,
costos y pagos variables aprobados.

La recuperacion del capital Sergio/ONIA y de aportes operativos Arthur se
calcula con la politica canonica de
`historial/ONIA_CAPITAL_RECOVERY_AND_ARTHUR_INVESTMENT_POLICY_2026.md`. El 40% Fondo Onia
no es dinero libre: primero cubre herramientas, caja chica y reserva minima; solo
el excedente se usa para recuperar capital.

## Orden de caja Nuvia

Usar para productos, empaques, envios, Meta Ads de Nuvia y contenido Nuvia.

Formula base corregida:

```text
Venta cobrada Nuvia
- comisiones de pago/devoluciones
- devolucion de capital de producto vendido al inversionista real
- bolsas/empaque/etiquetas
- transporte/envio
- Meta Ads de esa campana
- herramientas premium prorrateadas
- produccion externa si aplica
= ganancia bruta real Nuvia

Ganancia bruta real Nuvia
- 20% Fondo ONIA
- caja chica Nuvia
- Reserva Nuvia bootstrap o estable
= utilidad distribuible Nuvia

Utilidad distribuible Nuvia
= utilidad de inversionistas, repartida segun capital real del lote/campana
```

Regla dura:

```text
No hay reparto Nuvia si no se recupero capital de producto vendido y costos
directos. Capital recuperado no es ganancia; es devolucion al inversionista.
```

## Analisis Nuvia 2026-06-25

Fuente revisada:

- `web-factory/data/clients/nuvia.finance.json`
- generado: `2026-06-25T01:27:30.316Z`
- productos publicos analizables: 315

Snapshot con la formula comercial actual:

| Metrica | Valor |
|---|---:|
| Productos publicos | 315 |
| Venta Nuvia teorica total catalogo | Bs. 74.340,75 |
| Ganancia objetivo neta total | Bs. 54.741,46 |
| Ganancia objetivo neta con descuentos | Bs. 54.499,32 |
| Venta promedio por producto | Bs. 236,00 |
| Ganancia objetivo promedio | Bs. 173,78 |
| Ganancia objetivo promedio con descuentos | Bs. 173,01 |
| Productos con ganancia objetivo menor a Bs. 80 | 14 |
| Productos con ganancia objetivo Bs. 80 a Bs. 150 | 134 |
| Productos con ganancia objetivo mayor o igual a Bs. 150 | 167 |

Lectura:

```text
Estos numeros no son margen real todavia. Son margen objetivo segun la formula
comercial cargada en Nuvia. Antes de pagar trabajo operativo, repartir utilidad
o meter pauta, hay que registrar costo real de compra, stock, empaque,
transporte, comisiones, descuentos, herramienta premium y devoluciones.
```

Riesgo principal:

```text
Si Nuvia reparte segun la ganancia objetivo sin registrar costo real, puede
creer que gano dinero cuando en caja perdio.
```

Categorias con mayor ganancia objetivo total:

| Categoria | Productos | Venta teorica | Ganancia objetivo |
|---|---:|---:|---:|
| Antiedad | 98 | Bs. 30.349,55 | Bs. 22.348,22 |
| Proteccion solar | 67 | Bs. 13.266,00 | Bs. 9.768,49 |
| Limpieza facial | 35 | Bs. 6.072,00 | Bs. 4.471,16 |
| Cabello y unas | 22 | Bs. 6.049,45 | Bs. 4.454,54 |
| Hidratacion | 28 | Bs. 5.703,50 | Bs. 4.199,83 |

Decision:

```text
Nuvia no debe tratar todo el catalogo como inventario. Debe operar por lote,
producto validado y campana pequena. El catalogo sirve para demanda asistida;
la caja real se maneja por productos comprados, vendidos y cobrados.
```

## Formula de margen real Nuvia

Cada unidad vendida debe calcular:

```text
precio_cobrado
- costo_real_producto
- empaque_bolsa_etiqueta
- transporte_subsidiado
- comision_pago
- descuento_real
- costo_ads_por_unidad
- herramienta_premium_prorrateada
- devolucion_o_merma_prorrateada
= margen_real_unitario
```

Luego:

```text
margen_real_unitario / precio_cobrado = margen_real_pct
```

Puertas de decision:

| Margen real unitario | Decision |
|---|---|
| Menor o igual a Bs. 0 | Bloquear venta/reparto. Se vendio mal o faltan datos. |
| Bs. 1 a Bs. 40 | Venta debil. Sin pago operativo, sin ads, sin descuento. |
| Bs. 41 a Bs. 80 | Solo organico. No pagar bono; cuidar caja. |
| Bs. 81 a Bs. 150 | Producto operativo. Puede absorber costos operativos pequenos si fueron presupuestados antes. |
| Mayor a Bs. 150 | Producto fuerte. Puede entrar a campana controlada. |

Puertas por porcentaje:

| Margen real % | Decision |
|---|---|
| Menor a 25% | No escalar. No pagar bonos. |
| 25%-35% | Vender solo con bajo costo operativo. |
| 35%-50% | Puede operar con fondo, reserva y caja chica. |
| Mayor a 50% | Puede probar ads y contenido premium controlado. |

Regla:

```text
Nuvia bootstrap no paga bonos porcentuales. Si hay trabajo operativo pagado, se
presupuesta como costo directo antes de vender y debe entrar al calculo de
margen real.
```

## Fondo Nuvia

Nuvia necesita dos protecciones:

| Fondo | Porcentaje | Para que sirve |
|---|---:|---|
| Fondo Onia | 20% del margen real | Paga uso de marca, sistema, herramientas, direccion, Higgsfield y Onia Center. |
| Caja chica Nuvia | Monto fijo por cierre | Bolsas extra, transporte menor, cambios, entregas pequenas, imprevistos y supervivencia. |
| Reserva Nuvia bootstrap | 20% del margen real | Recomprar producto, bolsas, transporte, devoluciones y muestras mientras Nuvia no vive sola. |
| Reserva Nuvia estable | 10% del margen real | Mantener reposicion cuando Nuvia ya tiene caja propia. |

Durante arranque:

```text
margen_real
- 20% Fondo ONIA
- caja chica Nuvia
- 20% Reserva Nuvia bootstrap
= utilidad distribuible bootstrap
```

Cuando Nuvia ya vive sola:

```text
margen_real
- 20% Fondo ONIA
- caja chica Nuvia
- 10% Reserva Nuvia estable
= utilidad distribuible estable
```

Nuvia puede pasar de reserva bootstrap a reserva estable solo cuando cumpla:

1. dos meses positivos seguidos;
2. reserva suficiente para reponer el siguiente lote;
3. no depender de capital nuevo Sergio para comprar producto;
4. stock critico cubierto;
5. sin gastos premium sin recuperar;
6. ventas registradas en Onia Center.

## Cuando Nuvia vive sola

Nuvia vive sola cuando puede comprar, vender, reponer y resolver problemas sin
que Sergio tenga que poner capital externo cada mes.

Checklist:

| Condicion | Minimo |
|---|---|
| Reserva Nuvia | Cubre 1 lote siguiente + bolsas + transporte + devoluciones estimadas. |
| Rotacion | Producto vendido o validado en maximo 30-45 dias. |
| Margen real | Minimo 35% despues de costos directos. |
| Ventas | 2 cierres mensuales positivos. |
| Herramientas premium | Uso prorrateado y recuperado. |
| Seguimiento | CRM/ONIA Center completo. |

Antes de ese punto:

- Sergio no deberia retirar fuerte desde Nuvia;
- Arthur no debe cobrar bonos porcentuales;
- la prioridad es recuperar capital, formar reserva y probar productos.

Despues de ese punto:

- Nuvia compra inventario desde su propia reserva;
- Sergio puede retirar utilidad segun semaforo;
- Arthur puede ganar mejor si aporta capital real, opera un rol aprobado o se
  define un pago fijo por tarea rentable;
- se pueden probar campañas con presupuesto de Nuvia, no con caja ciega de
  Onia.

## Diferencia entre capital, utilidad y variable

Para evitar malentendidos:

| Concepto | Que significa | Quien lo recibe |
|---|---|---|
| Devolucion de capital | Recuperar lo que alguien puso para comprar producto, pauta o costo directo aprobado. | Quien puso ese dinero. |
| Fondo Onia | Porcion para sostener herramientas, apps, IA, VPS, caja y recuperacion de capital Onia. | ONIA/Sergio controla. |
| Aporte operativo recuperable | Apps, IA, VPS o gasto mensual Onia pagado por Arthur con aprobacion previa. | Arthur recupera solo desde excedente Fondo Onia. |
| Reserva Nuvia | Caja para recomprar producto, empaques, devoluciones, muestras y logistica. | Nuvia, control Sergio. |
| Pago operativo presupuestado | Pago fijo por tarea de venta, seguimiento, contenido o entrega, incluido como costo antes de vender. | Arthur u operador aprobado. |
| Utilidad inversionista | Ganancia despues de costos, fondos, caja chica y pagos operativos presupuestados. | Segun quien puso capital real. |

Arthur puede ganar por tres vias:

1. capital real aportado a ese lote/campana;
2. utilidad proporcional despues de fondos, reservas y caja chica;
3. pago fijo por tarea si fue aprobado y presupuestado antes de vender.

No puede cobrar bono porcentual adicional en bootstrap. Si trabaja y tambien
aporta capital, su trabajo no duplica automaticamente su participacion
financiera.

## Lote Nuvia 001

Este lote se separa del futuro para evitar conflicto.

| Concepto | Monto |
|---|---:|
| Capital Sergio producto inicial | Bs. 300 |
| Capital Arthur producto inicial | Bs. 300 |
| Total lote inicial | Bs. 600 |

Reglas:

1. Arthur conserva derecho economico sobre su aporte de Bs. 300 solo en el Lote
   Nuvia 001.
2. Ese aporte no le da propiedad sobre Onia, herramientas, marca, Higgsfield,
   Meta Ads, canales, sistemas ni futuros lotes.
3. Si el Lote 001 se vende sin pauta nueva ni costos premium pagados por
   Sergio/ONIA, la utilidad distribuible puede repartirse 50% Sergio y 50%
   Arthur despues de Fondo Onia, caja chica y Reserva Nuvia.
4. Si Sergio/ONIA paga Meta Ads, Higgsfield, produccion, transporte adicional o
   costos nuevos para vender el Lote 001, esos costos se recuperan primero.
5. Si Arthur no cofinancia esos costos nuevos, el reparto del Lote 001
   financiado por Onia pasa a una regla protegida: Sergio/ONIA 70% y Arthur 30%
   de utilidad distribuible, salvo acuerdo escrito por campana.
6. Si Arthur cofinancia 50% de producto, pauta y costos directos de una campana
   del Lote 001, puede volver a 50% de utilidad distribuible de esa campana.

## Nuvia futuros lotes

Desde el siguiente lote, la regla cambia.

| Quien pone capital directo | Como se reparte |
|---|---|
| Sergio/ONIA paga 100% producto/campana | Arthur no es socio financiero; solo puede tener pago fijo preaprobado como costo directo. |
| Sergio/ONIA paga producto y Arthur trabaja | Arthur no cobra bono porcentual en bootstrap; su trabajo se paga como costo fijo aprobado si el margen lo permite. |
| Sergio y Arthur pagan 50/50 producto, pauta y costos | Puede haber reparto hasta 50/50 despues de Fondo Onia, caja chica y Reserva Nuvia. |
| Arthur pone menos de 50% de costos directos | Su participacion financiera se calcula proporcionalmente. |
| Onia pone herramientas, pauta o produccion premium | Onia recupera primero y conserva control de reparto. |

## Pagos operativos en Nuvia

Nuvia no es una web ni una automatizacion. Nuvia vende productos fisicos y el
margen se consume rapido con empaque, transporte, descuentos, pauta, devoluciones
y herramientas premium.

Por eso, durante bootstrap, Nuvia no paga bonos porcentuales por trabajo. Si
Arthur u otra persona hace trabajo operativo, se maneja como pago fijo
preaprobado y debe entrar al costo de la campana antes de vender.

| Trabajo operativo | Como se paga en bootstrap |
|---|---|
| Idea, grabacion simple o apoyo sin venta | Bs. 0, cuenta como apoyo/evidencia. |
| Contenido aprobado para campana | Pago fijo solo si se presupuesto antes. |
| Responder mensajes y registrar interesados | Pago fijo pequeno o tarea semanal, no porcentaje. |
| Seguimiento completo | Pago fijo si la campana lo puede absorber. |
| Cierre real cobrado | Se reconoce en scorecard; pago fijo solo si estaba aprobado. |
| Entrega y postventa | Sale de caja chica Nuvia si fue necesario y aprobado. |
| Campana rentable repetible | Revisar regla nueva cuando Nuvia viva sola. |

Condiciones:

1. No se paga sobre ventas brutas.
2. No se paga sobre capital recuperado.
3. No se paga si reduce caja chica o Reserva Nuvia.
4. No se paga si falta CRM, comprobante, entrega o aprobacion.
5. No se paga si el margen real unitario queda por debajo de Bs. 80.
6. Si no estaba presupuestado antes de vender, no se paga como costo de Nuvia.

Regla:

```text
En Nuvia bootstrap, primero sobrevive la caja. Despues se reparte utilidad por
capital. El trabajo operativo se paga solo si fue costo aprobado antes de vender.
```

## Casos posibles Nuvia

### Caso A - Sergio financia 100%, Arthur no trabaja

Arthur cobra 0%. Sergio/ONIA recupera capital y recibe utilidad despues de
Fondo Onia y Reserva Nuvia.

### Caso B - Sergio financia 100%, Arthur apoya poco

Arthur cobra Bs. 0 salvo que exista un pago fijo preaprobado como costo de la
campana. Si no hay venta, margen real o evidencia, no se paga.

### Caso C - Sergio financia 100%, Arthur cierra ventas

Arthur no cobra porcentaje sobre utilidad distribuible en bootstrap. Si se
quiere pagar cierre, debe ser un pago fijo preaprobado e incluido como costo
antes de calcular el margen real.

### Caso D - Sergio financia 100%, Arthur opera todo

En etapa bootstrap, Arthur no cobra bono porcentual aunque opere. Si la campana
necesita que Arthur opere contenido, mensajes, cierre o entrega, se define un
pago fijo antes de lanzar la campana y se descuenta como costo directo.

Los bonos porcentuales solo se revisan en el futuro si Nuvia ya vive sola, tiene
reserva propia y margen real probado.

### Caso E - Sergio pone 80% y Arthur 20%

Se recupera capital 80/20. Luego, despues de Fondo Onia y Reserva Nuvia:

- si Arthur no trabaja: utilidad de inversionistas 80/20;
- si Arthur trabaja: puede tener pago fijo preaprobado como costo directo, y el
  resto se reparte 80/20;
- techo Arthur por utilidad financiera: su porcentaje de capital real.

### Caso F - Sergio pone 50% y Arthur 50%

Puede existir reparto 50/50 de utilidad de inversionistas si ambos pusieron
50% de producto, pauta y costos directos. Si uno trabaja mas, se puede acordar
pago fijo operativo antes de la campana, pero ese pago entra como costo directo
antes del margen. El Fondo Onia, caja chica Nuvia y Reserva Nuvia siempre se
descuentan antes de repartir utilidad.

### Caso G - Arthur pone capital pero no cumple trabajo

Arthur conserva su participacion financiera proporcional, pero no cobra pago
operativo.

### Caso H - Arthur no pone capital y Sergio usa Higgsfield/Meta Ads

Sergio/ONIA recupera herramienta/pauta como costo directo. Arthur solo puede
cobrar un pago fijo si fue aprobado antes y si hay margen real suficiente.

### Caso I - Campana pierde dinero

- Si Arthur no puso capital, no paga perdida, pero no cobra bono porcentual ni
  pago operativo no presupuestado.
- Si Arthur puso capital, pierde proporcionalmente al capital aportado.
- Sergio decide si se liquida, pausa o reinvierte.

## Meta Ads para Nuvia

Meta Ads no es gasto general. Es costo directo de campana.

Antes de pautar debe existir:

- producto y stock;
- costo completo;
- margen bruto estimado superior a 40%;
- pieza/anuncio;
- landing o WhatsApp/CRM;
- responsable de responder en menos de 24 horas;
- presupuesto maximo y fecha de corte;
- regla de reparto escrita para esa campana.

Escenarios:

### Sergio/ONIA paga la pauta

```text
Venta - costos - pauta ONIA - herramientas premium = margen operativo
```

Luego:

- Onia recupera pauta y costos primero;
- Fondo Onia recibe 20% de la ganancia bruta real;
- caja chica Nuvia se separa antes de repartir;
- Reserva Nuvia recibe 20% en bootstrap o 10% cuando Nuvia viva sola;
- Arthur no gana bono porcentual; solo pago fijo si fue presupuestado antes;
- Sergio/ONIA recibe el resto.

### Arthur cofinancia la pauta

Si Arthur paga 50% de producto, pauta y costos directos aprobados:

- ambos recuperan segun lo que pusieron;
- ambos absorben perdida segun lo que pusieron;
- utilidad distribuible puede repartirse hasta 50/50;
- Fondo Onia y Reserva Nuvia igual se descuentan antes.

### La campana pierde

Si Arthur no cofinancio:

- Arthur no paga la perdida;
- Arthur tampoco recibe reparto financiero;
- no recibe pago operativo si ese pago no estaba presupuestado antes.

Si Arthur cofinancio:

- la perdida se asume proporcional al capital aportado.

## Ingreso de Sergio como dueno

Sergio debe ganar, pero sin matar Onia.

Orden:

1. cubrir costos directos;
2. cubrir herramientas y operacion;
3. alimentar Fondo Onia;
4. alimentar Reserva Nuvia cuando sea Nuvia;
5. recuperar capital Sergio/ONIA;
6. pagar costos operativos presupuestados;
7. retirar utilidad Sergio/dueno.

Semaforo de retiros:

| Estado | Condicion | Retiro Sergio |
|---|---|---|
| Rojo | Caja operativa menor a 1 mes o herramientas en riesgo | No retiro fijo; solo utilidad directa si no compromete pagos. |
| Amarillo | Caja cubre 1-2 meses pero capital no recuperado | Retiro limitado: 10%-20% de utilidad neta del mes. |
| Verde | Caja cubre 2 meses, no hay atrasos y hay ventas nuevas | Retiro Sergio: 20%-30% de utilidad neta + plan de recuperacion de capital. |
| Escala | 2 meses positivos seguidos | Definir sueldo/retiro mensual de Sergio. |

Regla:

```text
Sergio no debe ser el ultimo en cobrar si Sergio pone capital, herramientas,
direccion, riesgo, marca y rescate operativo. Pero tampoco debe retirar antes
de pagar costos criticos de ONIA.
```

## Cierre semanal y mensual

### Diario

- registrar ingresos y gastos;
- registrar responsable;
- registrar evidencia;
- revisar caja;
- marcar bloqueos.

### Viernes

- revisar ventas cobradas;
- revisar costos por centro;
- revisar si Nuvia tiene margen real;
- aprobar o retener pagos operativos presupuestados;
- definir si se pausa ads, inventario o gastos.

### Fin de mes

- cerrar Onia Servicios;
- cerrar Nuvia por lote/campana;
- cerrar Onia Media;
- separar Fondo Onia;
- separar Reserva Nuvia;
- calcular recuperacion o reparto Arthur si corresponde;
- calcular retiro Sergio si corresponde;
- actualizar capital recuperado.

## Ejemplos

### Lote 001 sin pauta nueva

| Concepto | Monto |
|---|---:|
| Ventas cobradas | Bs. 1.200 |
| Producto lote 001 | -Bs. 600 |
| Bolsas/transporte | -Bs. 100 |
| Margen operativo | Bs. 500 |
| Fondo Onia 20% | -Bs. 100 |
| Caja chica Nuvia | -Bs. 50 |
| Reserva Nuvia bootstrap 20% | -Bs. 100 |
| Utilidad distribuible | Bs. 250 |
| Sergio 50% | Bs. 125 |
| Arthur 50% | Bs. 125 |

Ademas, cada uno recupera su capital de producto cuando el lote se repone/cierra
segun registro.

### Lote 001 con pauta pagada por Onia

| Concepto | Monto |
|---|---:|
| Ventas cobradas | Bs. 2.000 |
| Producto lote 001 | -Bs. 600 |
| Bolsas/transporte | -Bs. 150 |
| Meta Ads pagado por Onia | -Bs. 300 |
| Produccion/Higgsfield prorrateado | -Bs. 150 |
| Margen operativo | Bs. 800 |
| Fondo Onia 20% | -Bs. 160 |
| Caja chica Nuvia | -Bs. 50 |
| Reserva Nuvia bootstrap 20% | -Bs. 160 |
| Utilidad distribuible | Bs. 430 |
| Sergio/ONIA 70% | Bs. 301 |
| Arthur 30% | Bs. 129 |

Lectura: Arthur sigue ganando por su lote inicial, pero Sergio/ONIA gana mas
porque puso pauta, herramientas, produccion y riesgo adicional.

### Lote futuro pagado 100% por Sergio/ONIA

| Concepto | Monto |
|---|---:|
| Ventas cobradas | Bs. 4.000 |
| Devolucion capital producto Sergio | -Bs. 2.000 |
| Empaque/logistica | -Bs. 250 |
| Ganancia bruta real | Bs. 1.750 |
| Fondo Onia 20% | -Bs. 350 |
| Caja chica Nuvia | -Bs. 100 |
| Reserva Nuvia bootstrap 20% | -Bs. 350 |
| Utilidad distribuible | Bs. 950 |
| Ganancia Sergio/ONIA | Bs. 950 |

Resultado Sergio:

- recupera Bs. 2.000 de capital;
- gana Bs. 950;
- Onia recibe Bs. 350;
- Nuvia guarda Bs. 350 de reserva y Bs. 100 de caja chica.

Arthur recibe Bs. 0 porque no puso capital. Si su trabajo de cierre se quiere
pagar, debe aprobarse como costo fijo antes de vender.

### Lote futuro pagado 100% por Sergio con Arthur operando completo preaprobado

| Concepto | Monto |
|---|---:|
| Ventas cobradas | Bs. 4.000 |
| Devolucion capital producto Sergio | -Bs. 2.000 |
| Empaque/logistica | -Bs. 250 |
| Pago fijo Arthur aprobado antes | -Bs. 150 |
| Ganancia bruta real | Bs. 1.600 |
| Fondo Onia 20% | -Bs. 320 |
| Caja chica Nuvia | -Bs. 100 |
| Reserva Nuvia bootstrap 20% | -Bs. 320 |
| Utilidad distribuible | Bs. 860 |
| Ganancia Sergio/ONIA | Bs. 860 |

Este caso requiere evidencia completa: contenido, mensajes, seguimiento, cierre,
entrega y CRM sin rescate fuerte. Arthur ya cobro Bs. 150 como costo operativo,
no como porcentaje de utilidad.

## Preguntas para Arthur

Usar estas preguntas para cerrar la contabilidad sin pelear.

1. Confirmas que en Onia general eres colaborador/empleado variable y no socio
   propietario de Onia?
2. Confirmas que tus Bs. 300 invertidos aplican solo al Lote Nuvia 001 y no a
   futuros productos, herramientas, marca, campañas, sistemas ni Onia Media?
3. Para el Lote Nuvia 001, si se vende sin pauta nueva pagada por Onia,
   aceptas que se descuenten costos, 20% Fondo Onia, caja chica y 20% Reserva
   Nuvia bootstrap antes de repartir?
4. Si ONIA/Sergio paga Meta Ads, Higgsfield, produccion o costos nuevos para
   vender Nuvia, quieres cofinanciar 50% de esos costos o prefieres ganar como
   operador con pago fijo preaprobado solo si el margen lo permite?
5. Si no cofinancias pauta/costos nuevos, aceptas que Onia recupere primero y
   que tu porcentaje baje porque Sergio esta asumiendo el riesgo?
6. Para futuros lotes, quieres poner capital 50/50 real o prefieres no poner
   dinero y apoyar sin porcentaje de utilidad?
7. Si decides no poner capital nuevo, que tareas exactas puedes cumplir cada
   semana: responder mensajes, hacer llamadas, grabar, editar, cerrar ventas,
   entregar productos o registrar CRM?
8. Aceptas que no hay reparto Nuvia si no existe margen positivo despues de
   producto, bolsas, transporte, pauta, herramientas y costos directos?
9. Aceptas que todo debe estar en Onia Center/CRM para contar como venta,
   gasto, cierre, comision o reparto?
10. Prefieres cierre de Nuvia quincenal informativo y pago mensual, o pago
    quincenal solo cuando el lote/campana ya este cerrado y sin reclamos?
11. Si una campana pierde dinero y no cofinanciaste, aceptas que no pierdes
    dinero pero tampoco tienes reparto financiero ni pago operativo si no estaba
    presupuestado antes?
12. Si una campana pierde dinero y si cofinanciaste, aceptas asumir la perdida
    proporcional al capital que pusiste?
13. Quieres que Nuvia siga como proyecto con aportes 50/50 por lote, o que
    Nuvia sea financiada por ONIA/Sergio y tu rol sea comercial/operativo?
14. Si no pones capital nuevo, que tareas puedes cumplir sin pedir porcentaje
    sobre utilidad: contenido, mensajes, seguimiento, cierre, entrega o CRM?
15. Aceptas que en Nuvia bootstrap no hay bonos porcentuales y que cualquier
    pago operativo debe estar aprobado antes como costo de campana?

## Recomendacion para la conversacion

No abrir con porcentajes. Abrir con estructura:

```text
Quiero separar lo que ya pusiste en Nuvia de lo que ONIA va a financiar desde
ahora. Tus Bs. 300 del primer lote se respetan, pero si ONIA paga herramientas,
pauta, producto o costos nuevos, eso se recupera primero y cambia el reparto.
La idea es que Nuvia crezca sin matar ONIA y que tu ganancia dependa de capital
real, o de pagos fijos aprobados antes cuando el margen lo permita.
```

## Regla final

```text
Arthur puede ganar en Nuvia por capital real o por pago fijo preaprobado. No
puede ganar como socio si no arriesga capital, y no puede cobrar antes de que
ONIA y Nuvia recuperen costos, caja chica, reservas y supervivencia.
```
