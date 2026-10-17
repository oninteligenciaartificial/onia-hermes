# Onia Capital Recovery and Arthur Investment Policy 2026

> ⚠️ **DOCUMENTO HISTÓRICO — la parte de Arthur ya no aplica**: no colabora con Onia desde
> el 2026-08-23 (decisión de Sergio). Lo que sí sigue vigente es el criterio general de
> recuperación de capital; lo que asume a Arthur como parte, no.
> Marcado el 2026-08-31 al barrer los docs.

Estado: interno Sergio/ONIA.
Fecha: 2026-06-25.
Visibilidad: privado Sergio/ONIA. No enviar completo a Arthur.

> Actualizacion 2026-07-03: decidido que Arthur entra SIN capital Onia (ver
> `ONIA_ARRANQUE_ARTHUR_60_DIAS_20260703.md`). Por lo tanto
> `arthur_operating_capital_balance = 0`, no se abre linea de aporte recuperable
> para Arthur, y el 100% de la recuperacion va al capital de Sergio (deuda
> 2.414,49 primero, luego arranque 15.000,00). El split 70/30 y la seccion "Si
> Arthur paga apps o gastos mensuales de Onia" quedan inactivos hasta que exista
> acuerdo escrito nuevo.
>
> Ademas se agrega un **skim de recuperacion del 10% como apartado contable**:
> mientras `capital_pendiente > 0`, de cada ingreso neto de Onia Servicios se
> MARCA 10% como capital por recuperar ANTES del reparto, y el 40/50/10 se
> calcula sobre el 90% restante. El apartado se apaga cuando el capital queda en
> cero.
>
> Correccion clave (2026-07-03): el skim NO se paga en cada venta. Es un apartado
> en el ledger; la plata solo pasa a Sergio a fin de mes y solo si la caja quedo
> verde (Fondo cubrio herramientas + reserva). En caja roja/amarilla el skim se
> queda como caja operativa de Onia y la recuperacion se difiere. Esto respeta la
> regla "primero Onia vive": nunca se recupera capital en un mes que no cubrio su
> operacion. Formula:
>
> ```text
> skim_apartado = ingreso_neto * 0.10   (solo si capital_pendiente > 0)
> base_repartible = ingreso_neto * 0.90
> fondo_onia      = base_repartible * 0.40
>
> Si caja_verde:  recovery_total = skim_apartado_mes + max(0, fondo_excedente)
> Si caja_roja:   recovery_total = 0   (skim queda como operacion, se difiere)
> ```

## Veredicto

Arthur puede aportar dinero a Onia para pagar apps, IA, VPS o gastos
mensuales, pero ese aporte no lo convierte automaticamente en socio, dueno ni
acreedor de utilidades generales.

La figura correcta durante la prueba de 60 dias es:

```text
Aporte operativo recuperable, aprobado y registrado.
```

Regla principal:

```text
ONIA primero vive. Luego ONIA guarda. Luego ONIA devuelve capital. Luego ONIA
reparte utilidad.
```

Si un aporte no esta aprobado y registrado en Onia Center, no existe para
recuperacion, reparto ni decision.

## Montos base vigentes

Estos montos vienen de `FINANCE_LOG_2026.md` y deben actualizarse cuando Notion
o la contabilidad confirme cambios.

| Concepto | Monto |
|---|---:|
| Gasto mensual base registrado | Bs. 2.950,50 |
| Deuda operativa actual Sergio/ONIA | Bs. 2.414,49 |
| Capital de arranque Sergio/ONIA | Bs. 15.000,00 |
| Aporte historico Arthur Nuvia Lote 001 | Bs. 300,00 |

La deuda operativa de Bs. 2.414,49 es de Sergio/ONIA. Arthur no la paga, no la
compensa y no se descuenta de sus comisiones aprobadas, salvo acuerdo escrito
posterior.

El capital de arranque de Bs. 15.000 se recupera desde excedentes del Fondo
Onia, despues de cubrir herramientas, caja chica, reserva minima y gastos
criticos.

## Centros contables afectados

| Centro | Que registra | Regla |
|---|---|---|
| Onia Servicios | Webs, automatizaciones, sistemas, SaaS, consultoria y auditorias. | Usa Fondo Onia protegido de 40%. |
| Fondo Onia | Herramientas, apps, IA, VPS, caja, reservas y recuperacion de capital. | Solo Sergio aprueba uso. |
| Capital Sergio/ONIA | Capital inicial, deuda, compras y recuperacion de Sergio. | Prioridad de recuperacion por riesgo mayor. |
| Capital Arthur Recuperable | Apps/gastos mensuales aprobados pagados por Arthur. | No da propiedad ni porcentaje fijo. |
| Nuvia | Producto, inventario, empaque, transporte, Meta Ads y ventas Nuvia. | Reglas por lote/campana. |
| Reserva Nuvia | Reposicion, devoluciones, empaques y logistica. | No se reparte como utilidad. |
| Onia Media | Produccion audiovisual, canales, activos y piezas publicitarias. | Centro de costo/activo de Onia. |

## Definiciones

| Termino | Definicion operativa |
|---|---|
| Ingreso cobrado | Dinero recibido y confirmado. No promesa, no propuesta, no factura sin cobrar. |
| Ingreso neto operativo | Ingreso cobrado menos costos directos del cliente/proyecto. |
| Fondo Onia 40% | Porcion protegida de Onia Servicios para sostener la empresa. |
| Excedente Fondo Onia | Lo que sobra del Fondo Onia despues de gastos, caja chica y reserva minima. |
| Capital recuperable | Dinero aprobado que debe devolverse cuando exista excedente sano. |
| Aporte operativo Arthur | Pago aprobado de apps/gastos Onia hecho por Arthur. |
| Capital directo de proyecto | Dinero puesto para un lote, campana o cliente especifico. |
| Variable operativa | Pago por trabajo real, evidencia, cierre, entrega o seguimiento. |
| Retiro Sergio dueno | Dinero que Sergio puede retirar despues de proteger caja, reservas y recuperacion. |

## Regla del Fondo Onia 40%

El 40% no es utilidad libre. Es el pulmon de Onia.

Formula Onia Servicios:

```text
Ingreso cobrado
- costos directos del cliente
= ingreso neto operativo

Fondo ONIA = ingreso neto operativo x 40%
```

Uso obligatorio del Fondo Onia:

| Orden | Uso |
|---:|---|
| 1 | Pagar apps, IA, VPS, dominios, herramientas, backups y gastos fijos. |
| 2 | Cubrir caja chica operativa. |
| 3 | Completar reserva minima de operacion. |
| 4 | Recuperar capital Sergio/ONIA y aportes operativos Arthur aprobados. |
| 5 | Financiar crecimiento: equipo, pauta, activos, servidores o mejoras. |

Regla:

```text
La recuperacion de capital sale solo del excedente del Fondo ONIA.
No sale de ventas brutas, comisiones, caja chica ni reservas minimas.
```

## Cascada de cierre Onia Servicios

Cada cierre quincenal o mensual debe seguir este orden:

| Orden | Calculo |
|---:|---|
| 1 | Confirmar ingresos cobrados. |
| 2 | Restar costos directos de cliente/proyecto. |
| 3 | Calcular ingreso neto operativo. |
| 4 | Separar 40% Fondo Onia. |
| 5 | Calcular variables/comisiones aprobadas sobre la base correcta. |
| 6 | Calcular utilidad Sergio/ONIA del proyecto. |
| 7 | Dentro del Fondo Onia, pagar gastos fijos y caja chica. |
| 8 | Completar reserva minima. |
| 9 | Si sobra, activar recuperacion de capital. |
| 10 | Si todavia sobra, evaluar crecimiento o retiro Sergio segun semaforo. |

Formula de recuperacion:

```text
excedente_recuperable =
Fondo_ONIA_periodo
- gastos_fijos_periodo
- caja_chica_periodo
- reserva_minima_pendiente
```

Si `excedente_recuperable` es menor o igual a cero, no hay devolucion de capital
ese periodo.

## Prioridad de recuperacion de capital

Durante los 60 dias de prueba, mientras Sergio tenga capital pendiente y Arthur
tenga aportes operativos aprobados pendientes, la recuperacion se divide asi:

| Destino | Porcentaje del excedente recuperable |
|---|---:|
| Sergio/ONIA capital inicial | 70% |
| Arthur aporte operativo aprobado | 30% |

Reglas:

1. Si Arthur no tiene saldo pendiente, el 100% va a Sergio hasta recuperar el
   capital inicial.
2. Si Sergio ya recupero su capital inicial y Arthur tiene saldo pendiente, se
   puede devolver a Arthur hasta 100% del excedente recuperable.
3. Si el excedente no alcanza, el saldo queda pendiente para el siguiente
   cierre.
4. Ningun aporte genera interes salvo contrato escrito.
5. Ningun aporte da propiedad sobre Onia, clientes, sistemas, marca, cuentas,
   herramientas, canales ni propiedad intelectual.

## Si Arthur paga apps o gastos mensuales de Onia

Se permite solo bajo estas condiciones:

| Requisito | Regla |
|---|---|
| Aprobacion | Sergio debe aprobar antes del pago o dentro de 24 horas si fue urgencia real. |
| Cuenta | La herramienta debe quedar en cuenta/control de Onia o con acceso administrativo de Sergio. |
| Comprobante | Debe existir recibo, captura o nota verificable. |
| Centro | Debe registrarse como Onia, Nuvia, Onia Media, Cliente o Caja. |
| Tipo | Debe marcarse como `aporte_operativo_recuperable` si se devolvera. |
| Tope 60 dias | Recomendado: maximo Bs. 1.000 a Bs. 2.000 por mes sin nuevo acuerdo. |
| Recuperacion | Solo desde excedente recuperable del Fondo Onia. |

Gastos aceptables si estan aprobados:

- Claude;
- Codex;
- Higgsfield;
- VPS;
- Google Workspace;
- storage/backups;
- dominio o hosting necesario;
- herramienta de automatizacion;
- herramienta creativa necesaria para venta o entrega;
- gasto operativo menor con retorno claro.

Gastos no aceptables sin contrato especial:

- deuda anterior de Sergio/ONIA;
- compras personales;
- equipo a nombre de Arthur;
- comida, entretenimiento o movilidad no aprobada;
- subscripciones en cuenta personal sin acceso Onia;
- herramientas duplicadas sin ROI claro;
- pauta sin landing, CRM, responsable y fecha de corte;
- gasto hecho despues de que Sergio lo rechazo.

## Que gana Arthur por aportar a apps

Arthur no gana mas comision por pagar apps.

Arthur tiene dos cuentas separadas:

| Cuenta | Como gana |
|---|---|
| Trabajo operativo/comercial | Variable o comision segun venta, cierre, entrega y evidencia. |
| Aporte operativo recuperable | Devolucion del monto aprobado cuando exista excedente de Fondo Onia. |

Ejemplo:

```text
Arthur paga Bs. 1.365 de Higgsfield aprobado.
Ese pago no lo vuelve socio.
Ese pago no le sube el porcentaje de una web.
Ese pago crea saldo Arthur recuperable por Bs. 1.365.
```

Si ademas Arthur vende o entrega un proyecto, su variable se calcula por el rol
cumplido en ese proyecto. La devolucion de apps se calcula aparte.

## Diferencia entre aportar a Onia y aportar a Nuvia

No mezclar las bolsas.

| Caso | Se recupera desde | Participacion |
|---|---|---|
| Arthur paga Claude/Higgsfield/VPS general | Excedente Fondo Onia | No da participacion en Onia. |
| Arthur paga Meta Ads de Nuvia | Cierre de esa campana Nuvia | Participacion proporcional si fue capital directo aprobado. |
| Arthur compra producto Nuvia | Lote/campana Nuvia | Participacion proporcional a capital real. |
| Arthur paga gasto de cliente | Proyecto cliente | Se recupera como costo directo antes de margen. |
| Arthur paga deuda vieja Onia | Solo si hay contrato escrito | No recomendado durante 60 dias. |

Regla:

```text
Apps ONIA = aporte operativo recuperable.
Producto/pauta/costo directo Nuvia = capital directo de lote/campana.
Trabajo Arthur = variable operativa.
```

## Nuvia y consumo de herramientas premium

Nuvia no puede usar Higgsfield, Claude, Codex, servidores o herramientas
premium como si fueran gratis.

Si Nuvia usa herramientas Onia:

1. Se registra uso por herramienta, pieza, campana y responsable.
2. Se estima costo prorrateado.
3. Si la pieza se usa para vender Nuvia, el costo entra en el cierre de Nuvia.
4. Si la pieza no se publica ni vende, se marca como perdida/aprendizaje.
5. Si Arthur pidio la pieza, debe estar aprobado por Sergio y con brief.

Regla:

```text
Nuvia debe pagar o prorratear el uso premium antes de repartir utilidad.
```

## Onia Media y canales futuros

Onia Media no es un fondo separado por defecto. Es un centro de costo y activo de
Onia.

Si se crean canales de YouTube, cuentas de contenido o activos audiovisuales:

| Elemento | Regla |
|---|---|
| Propiedad | ONIA/Sergio salvo acuerdo escrito diferente. |
| Apps usadas | Se cargan al Fondo Onia o al centro que genero el costo. |
| Monetizacion futura | No se reparte por expectativa; se define cuando haya ingresos reales. |
| Arthur participa | Puede ganar por tarea, operacion o acuerdo de canal aprobado. |
| Inversion Arthur | Si paga gastos del canal, se registra como aporte operativo o capital directo del canal. |

Si un canal empieza a generar ingresos reales, debe cerrarse como centro
contable propio:

```text
Ingresos canal
- costos plataforma/produccion
- herramientas prorrateadas
- Fondo ONIA definido
- variables aprobadas
= utilidad del canal
```

## Pagos quincenales y mensuales

### Cierre quincenal

Sirve para:

- revisar ventas cobradas;
- calcular variables preliminares;
- pagar adelantos solo si caja esta sana;
- actualizar scorecard y evidencias;
- detectar si Fondo Onia no cubre gastos.

Regla:

```text
El pago quincenal no debe cerrar capital recuperable salvo que el proyecto o
periodo ya este cobrado, sin reclamos y con Fondo ONIA excedente.
```

### Cierre mensual

Sirve para:

- cerrar gastos reales de apps;
- cerrar Fondo Onia;
- confirmar caja chica;
- completar reserva;
- calcular recuperacion Sergio/Arthur;
- aprobar retiro Sergio;
- dejar saldos para el siguiente mes.

La recuperacion de capital se recomienda mensual, no diaria, para evitar que
Onia devuelva dinero antes de saber si puede vivir el mes completo.

## Ejemplos Onia Servicios

### Ejemplo 1: mes sano

| Concepto | Monto |
|---|---:|
| Ingreso neto operativo mensual | Bs. 20.000,00 |
| Fondo Onia 40% | Bs. 8.000,00 |
| Gastos fijos base | -Bs. 2.950,50 |
| Caja chica | -Bs. 500,00 |
| Reserva minima pendiente | -Bs. 1.000,00 |
| Excedente recuperable | Bs. 3.549,50 |

Recuperacion 70/30:

| Persona | Monto |
|---|---:|
| Sergio capital inicial | Bs. 2.484,65 |
| Arthur aporte operativo | Bs. 1.064,85 |

Si Arthur solo tenia Bs. 600 pendientes, recibe Bs. 600 y los Bs. 464,85
restantes vuelven a Sergio.

### Ejemplo 2: mes justo

| Concepto | Monto |
|---|---:|
| Ingreso neto operativo mensual | Bs. 8.000,00 |
| Fondo Onia 40% | Bs. 3.200,00 |
| Gastos fijos base | -Bs. 2.950,50 |
| Caja chica minima | -Bs. 249,50 |
| Excedente recuperable | Bs. 0,00 |

Resultado:

- Onia sobrevive.
- No se recupera capital ese mes.
- No se debe pagar crecimiento ni retirar mas dinero.

### Ejemplo 3: Arthur paga Higgsfield

| Concepto | Monto |
|---|---:|
| Arthur paga Higgsfield aprobado | Bs. 1.365,00 |
| Saldo Arthur recuperable creado | Bs. 1.365,00 |
| Comision Arthur por ventas | Se calcula aparte |
| Propiedad sobre Onia | 0% |

Si al cierre hay Bs. 2.000 de excedente recuperable:

| Destino | Monto |
|---|---:|
| Sergio capital inicial 70% | Bs. 1.400,00 |
| Arthur recuperacion 30% | Bs. 600,00 |
| Saldo Arthur pendiente | Bs. 765,00 |

### Ejemplo 4: Arthur paga Meta Ads de Nuvia

Si Arthur paga Bs. 1.000 de Meta Ads Nuvia y Sergio paga Bs. 4.000 de producto,
eso no es aporte general a Onia. Es capital directo de campana Nuvia.

| Persona | Capital directo | Participacion financiera base |
|---|---:|---:|
| Sergio/ONIA | Bs. 4.000 | 80% |
| Arthur | Bs. 1.000 | 20% |

El cierre debe seguir el modelo Nuvia:

```text
Venta Nuvia
- producto vendido
- empaque/transporte
- Meta Ads
- herramientas premium prorrateadas
= ganancia bruta real
- 20% Fondo ONIA
- 10% Reserva Nuvia
= utilidad distribuible
```

Arthur recupera su capital de pauta desde la campana, no desde el Fondo Onia
40% de servicios.

## Reglas para Onia Center

Onia Center debe implementar esta politica como datos, no como notas sueltas.

### Modulo: capital ledger

Campos minimos:

| Campo | Tipo esperado | Uso |
|---|---|---|
| `id` | texto/uuid | Movimiento unico. |
| `date` | fecha | Fecha del aporte o recuperacion. |
| `person` | Sergio, Arthur, Onia | Quien aporta o recupera. |
| `center` | Onia, Fondo Onia, Nuvia, Onia Media, Cliente | Centro contable. |
| `capital_type` | startup, operating_recoverable, direct_project, product_lot | Tipo de capital. |
| `amount_in` | numero | Monto aportado. |
| `amount_recovered` | numero | Monto ya devuelto. |
| `balance` | numero | Saldo pendiente. |
| `source_transaction_id` | texto/uuid | Movimiento origen. |
| `approved_by` | Sergio | Aprobador. |
| `approval_status` | requested, approved, rejected, closed | Estado. |
| `notes` | texto | Contexto breve. |

### Modulo: fondo closures

Campos minimos:

| Campo | Uso |
|---|---|
| `period_start` / `period_end` | Cierre quincenal o mensual. |
| `net_operating_income` | Ingreso neto Onia Servicios. |
| `fund_percentage` | Normalmente 40%. |
| `fund_amount` | Fondo Onia generado. |
| `fixed_tools_cost` | Apps/IA/VPS del periodo. |
| `petty_cash_cost` | Caja chica usada o separada. |
| `reserve_target` | Reserva minima definida. |
| `reserve_gap` | Cuanto falta para completar reserva. |
| `recovery_pool` | Excedente recuperable. |
| `sergio_recovery_due` | Monto calculado para Sergio. |
| `arthur_recovery_due` | Monto calculado para Arthur. |
| `owner_draw_allowed` | Retiro Sergio permitido por semaforo. |
| `status` | draft, review, approved, paid, locked. |

### Modulo: tool usage

Campos minimos:

| Campo | Uso |
|---|---|
| `tool` | Higgsfield, Claude, Codex, VPS, etc. |
| `center` | Onia, Nuvia, Onia Media, Cliente. |
| `campaign_or_project` | Campana, lote o cliente. |
| `requested_by` | Sergio, Arthur, vendedor u operador. |
| `approved_by` | Sergio. |
| `estimated_cost_bs` | Costo prorrateado. |
| `output_url_or_id` | Pieza, video, prompt o entregable. |
| `commercial_result` | vendido, publicado, rechazado, aprendizaje. |
| `charge_to_project` | true/false. |

### Modulo: payout approvals

Campos minimos:

| Campo | Uso |
|---|---|
| `person` | Beneficiario. |
| `payout_type` | variable, commission, capital_recovery, owner_draw. |
| `basis` | Venta, cierre, fondo, lote, campana o servicio. |
| `amount` | Monto calculado. |
| `evidence_status` | complete, partial, missing. |
| `cash_status` | red, yellow, green, strong. |
| `approved_by` | Sergio. |
| `payment_date` | Fecha programada. |
| `status` | pending, approved, paid, held, rejected. |

## Formulas para el sistema

```text
fondo_onia = net_operating_income * 0.40
```

```text
recovery_pool = max(
  0,
  fondo_onia
  - fixed_tools_cost
  - petty_cash_cost
  - reserve_gap
)
```

```text
sergio_recovery = min(
  sergio_capital_balance,
  recovery_pool * 0.70 + unused_arthur_recovery
)
```

```text
arthur_recovery = min(
  arthur_operating_capital_balance,
  recovery_pool * 0.30
)
```

Si `arthur_operating_capital_balance` es cero:

```text
sergio_recovery = min(sergio_capital_balance, recovery_pool)
arthur_recovery = 0
```

## Alertas obligatorias

Onia Center debe alertar cuando:

1. Fondo Onia del mes no cubre gastos base.
2. Reserva operativa es menor a 1 mes.
3. Se intenta pagar capital sin excedente recuperable.
4. Arthur solicita recuperacion sin aprobacion previa.
5. Arthur solicita comision y falta CRM/evidencia.
6. Nuvia usa Higgsfield sin campana aprobada.
7. Nuvia supera 70% de su limite de herramienta premium.
8. Un gasto no tiene centro contable.
9. Un retiro Sergio deja Onia en rojo.
10. Un proyecto nuevo no tiene precio, alcance y costo directo definido.

## Semaforo de caja

| Estado | Condicion | Decision |
|---|---|---|
| Rojo | Menos de 1 mes de gastos base cubierto. | No recuperar capital, no retirar, no crecer. |
| Amarillo | 1 a 2 meses cubiertos. | Recuperacion limitada, retiro Sergio bajo, cero gastos no criticos. |
| Verde | 2 meses cubiertos y ventas nuevas. | Recuperar capital segun regla, pagar variables sanas, invertir controlado. |
| Fuerte | 3 meses cubiertos y flujo positivo. | Acelerar recuperacion, equipo, pauta o retiro Sergio. |

## Rutina operativa

### Diario

- Registrar ingreso o gasto el mismo dia.
- Asociar centro contable.
- Adjuntar comprobante o nota.
- Marcar quien pago y quien debe recuperar.
- Registrar uso de herramienta premium.

### Viernes

- Revisar ventas cobradas.
- Revisar Fondo Onia acumulado.
- Revisar gastos fijos y caja chica.
- Revisar si Arthur tiene aportes aprobados pendientes.
- Revisar si hay variables aprobables.
- Bloquear gastos sin centro o sin evidencia.

### Quincenal

- Cerrar ventas cobradas hasta la fecha.
- Pagar variables solo si la base esta clara.
- No pagar capital recuperable si el Fondo Onia no cubre el mes.
- Dejar cierre en estado `review` si falta evidencia.

### Mensual

- Cerrar Fondo Onia.
- Cerrar Nuvia por lote/campana.
- Cerrar Onia Media si tuvo ingresos/costos.
- Actualizar capital Sergio pendiente.
- Actualizar capital Arthur pendiente.
- Aprobar recuperaciones.
- Evaluar retiro Sergio.
- Bloquear el periodo despues de aprobar.

## Clausulas internas recomendadas

Para cualquier anexo con Arthur:

```text
Los aportes realizados por Arthur para apps, herramientas, IA, VPS o gastos
mensuales de ONIA son aportes operativos recuperables solo si fueron aprobados
por Sergio y registrados en ONIA Center. Dichos aportes no otorgan propiedad,
participacion societaria, control, derecho sobre clientes, marca, sistemas,
cuentas, herramientas, canales, activos digitales ni utilidades generales de
ONIA.
```

```text
La recuperacion de aportes se realizara unicamente desde el excedente del Fondo
ONIA, despues de cubrir gastos operativos, caja chica, reserva minima y costos
criticos. Si no existe excedente, el saldo queda pendiente sin interes, salvo
acuerdo escrito diferente.
```

```text
Los pagos por trabajo comercial u operativo se calculan de forma separada a los
aportes de capital. Arthur puede cobrar variable por trabajo aprobado y tambien
recuperar aportes aprobados, pero una via no aumenta automaticamente la otra.
```

## Reglas que no se negocian durante 60 dias

1. Sergio controla Onia, caja, herramientas, contratos y estrategia.
2. Arthur no es socio de Onia por pagar apps.
3. El Fondo Onia de 40% no se reparte como ganancia.
4. La recuperacion de capital depende de excedente real.
5. Nuvia no puede consumir Higgsfield gratis.
6. Todo gasto debe tener centro contable.
7. Todo pago debe tener evidencia.
8. Todo cierre debe quedar en Onia Center.

## Revision a los 60 dias

Al terminar los 60 dias, revisar:

| Pregunta | Decision posible |
|---|---|
| Arthur cumplio scorecard semanal? | Subir rol, mantener prueba o bajar responsabilidad. |
| Arthur genero ventas cobradas? | Ajustar variable y responsabilidad comercial. |
| Arthur aporto capital con orden? | Mantener como aporte recuperable o negociar figura superior. |
| Onia recupero capital? | Acelerar recuperacion, pausar gastos o cambiar oferta. |
| Nuvia tuvo margen real? | Reinvertir, pausar o cambiar producto/campana. |
| Herramientas premium generaron ventas? | Mantener, reducir o reemplazar por self-hosted. |

Una figura superior para Arthur solo puede definirse con contrato nuevo:

- socio operativo de un centro;
- responsable de area con presupuesto;
- participacion por proyecto;
- empleado formal;
- proveedor/freelancer;
- colaborador comercial-operativo extendido.

## Relacion con otros documentos

Este documento complementa y manda para recuperacion de capital operativo:

- `FINANCE_LOG_2026.md`
- `hermes-content/docs/ONIA_INTERNAL_CAPITAL_ALLOCATION_2026.md`
- `hermes-content/docs/ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`
- `hermes-content/docs/historial/orquestacion-vieja/ONIA_COMPANY_OPERATING_MODEL_2026.md`
- `hermes-content/docs/ONIA_SUSTAINABILITY_DASHBOARD_SPEC_2026.md`
- `hermes-content/docs/ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md`

Si hay conflicto:

1. contrato firmado;
2. acuerdo privado de 60 dias;
3. este documento para recuperacion de capital y aportes a apps;
4. modelo contable ONIA/Nuvia;
5. ejemplos sueltos o conversaciones anteriores.
