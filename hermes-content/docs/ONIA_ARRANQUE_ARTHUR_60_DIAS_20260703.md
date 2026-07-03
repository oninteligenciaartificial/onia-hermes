# ONIA - Arranque Arthur 60 dias (sin capital)

Estado: interno Sergio/ONIA.
Fecha de decision: 2026-07-03.
Dia 0: 2026-07-03.
Dia 60 / revision formal: 2026-09-01.

Este documento activa el acuerdo de 60 dias con Arthur en modo **colaborador sin
capital ONIA**. Manda sobre conversaciones previas para el arranque. No cambia el
contrato base; lo pone en marcha con la variante correcta.

Documentos que complementa:

- `ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md` (contrato base).
- `ONIA_CAPITAL_RECOVERY_AND_ARTHUR_INVESTMENT_POLICY_2026.md` (recuperacion capital).
- `FINANCE_LOG_2026.md` (montos vigentes).

## 1. Decision confirmada

Arthur **no aporta dinero a ONIA**. Sergio financia la operacion completa.

Consecuencias directas:

| Tema | Resultado |
|---|---|
| Figura de Arthur | Colaborador comercial y operativo, prueba 60 dias. No socio, no inversor. |
| Capital recuperable de Arthur en ONIA | Cero. No se abre linea de aporte recuperable. |
| Nuvia | Sigue 50/50 solo en inventario/producto. Separado de ONIA. Bs. 300 Lote 001. |
| Excedente Fondo ONIA | 100% recupera capital de Sergio (no hay split 70/30). |
| Propiedad de activos ONIA | 100% Sergio/ONIA, sin cambios. |
| Comision de Arthur | Solo variable segun tabla de intervencion (10%-50%), con evidencia. |

Nada del contrato base se rompe: "Modo colaborador sin capital ONIA" ya era el
caso previsto. Esta decision solo elimina la contabilidad de aportes de Arthur y
acelera la recuperacion de Sergio.

## 2. Plan de caja (Sergio)

Montos vigentes (`FINANCE_LOG_2026.md`):

| Concepto | Monto Bs |
|---|---:|
| Gasto mensual base | 2.950,50 |
| Deuda operativa | 2.414,49 |
| Capital de arranque | 15.000,00 |

Orden de recuperacion desde excedente del Fondo ONIA (40% protegido):

```text
1. Herramientas / apps / IA / VPS / Workspace del mes (2.950,50)
2. Caja chica aprobada
3. Reserva minima de operacion
4. Deuda operativa 2.414,49  (recuperar primero: es dinero prestado)
5. Capital de arranque 15.000,00  (objetivo: devolver a fuente familiar)
6. Recien despues: bonos, reinversion no urgente, retiro Sergio
```

Como Arthur no tiene saldo recuperable, aplica la formula del sistema:

```text
sergio_recovery = min(sergio_capital_balance, recovery_pool)
arthur_recovery = 0
```

Semaforo de caja (decide que se puede hacer cada cierre):

| Estado | Condicion | Decision |
|---|---|---|
| Rojo | < 1 mes de gasto base cubierto | No recuperar, no retirar, no crecer. Congelar compras. |
| Amarillo | 1-2 meses cubiertos | Recuperacion limitada, cero gasto no critico. |
| Verde | 2 meses + ventas nuevas | Recuperar segun regla, pagar variables sanas. |
| Fuerte | 3 meses + flujo positivo | Acelerar recuperacion o retiro Sergio. |

Regla dura: la deuda (2.414,49) se cubre antes que el capital de arranque, y el
capital de arranque antes que cualquier retiro personal de Sergio.

## 3. Setup ONIA Center (ya existe, solo activar)

La infraestructura ya esta construida:

- Panel `/vendedores` con Inicio, Captura, Pipeline, Webs, Notas, Ideas,
  Ingresos, Reglas, Requerimientos.
- Rol `arthur` mapeado a scope `internal_restricted` (no ve datos privados de
  caja de Sergio).
- Script de alta de usuario sin imprimir secretos.

### 3.1 Crear el usuario de Arthur

Requiere estas variables de entorno (no van al repo):

- `ONIA_CENTER_SUPABASE_URL`
- `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`
- una variable con el password temporal (min. 12 caracteres), ej. `ARTHUR_PW`

Comando:

```bash
node scripts/onia_center_auth_admin.js \
  --email arthur@oninteligencia.com \
  --password-env ARTHUR_PW \
  --user-key arthur \
  --display-name "Arthur Fuentes" \
  --role arthur \
  --organization onia
```

El password se lee de la variable y nunca se imprime. Arthur lo cambia en el
primer ingreso. Ajustar el email al real de Arthur antes de correr.

### 3.2 Regla de oro del panel

```text
Si no esta en ONIA Center o Notion, no cuenta para comision, seguimiento,
cierre, caja chica ni revision del viernes.
```

Mientras el panel termina de conectar datos reales, la fuente oficial sigue
siendo Notion -> CRM Vendedores ONIA.

## 4. Semana 1 operativa (2026-07-03 al 2026-07-10)

### Metas minimas de la semana

| Area | Minimo | Bloquea si falta |
|---|---:|---|
| Prospectos completos registrados | 35 | Semana no aprobada |
| Contactos / mensajes / llamadas reales | 25 | Semana no aprobada |
| Seguimientos realizados | 20 | Semana no aprobada |
| Llamadas o audios comerciales | 8 | - |
| Reuniones o demos agendadas | 3 | - |
| Propuestas / auditorias / diagnosticos enviados | 3 | - |
| Videos grabados ONIA/Nuvia | 5 | - |
| Piezas / carruseles listos | 3 | - |
| CRM al 100% el viernes | Si | Comision y semana |
| Reporte semanal | 1 | Continuidad |

Semana cumplida = 80% del total y sin fallar en las tres criticas: CRM,
seguimientos y reporte.

### Ofertas prioritarias (vender primero, caja rapida)

| Oferta | Precio ref. Bs | Por que |
|---|---:|---|
| Auditoria Express | 250 | Entrada fria, genera propuesta pagada. |
| Landing de Captacion | 790 | Facil, entrega corta, genera caso. |
| Diagnostico + Plan | 690 | Convierte confusion en venta. |
| Automatizacion simple n8n | 790 | Alta percepcion de valor. |
| Web Profesional | 1.500 | Buen ticket para caja y portafolio. |
| Web Pro ONIA | 2.900 | Mejor margen, negocio serio. |

Recurrencia (segundo foco): DentalGest (320-1.500/mes), GestiOS (350-1.250/mes),
Cuidado Web (190-690/mes).

Nota: CLAUDE.md del repo usa linea estandar Landing 2.000 / Web Pro 4.500 para
propuestas generadas. Los precios de arriba son el piso de referencia del
acuerdo de Arthur; Sergio confirma el precio final por propuesta.

### Objetivo de los 60 dias

| Meta | Minimo |
|---|---:|
| Ventas web/automatizacion cobradas | 6 a 8 |
| Clientes SaaS o recurrentes nuevos | 2 a 4 |
| Leads calificados registrados | 200 |
| Reuniones / demos realizadas | 12 a 16 |

Si al dia 60 no hay ventas ni pipeline real, se vuelve a pago por tarea.

### Ritmo semanal fijo

- **Lunes:** definir ofertas prioritarias, asignar prospectos y piezas,
  confirmar reuniones.
- **Diario:** Arthur revisa Inicio, registra leads en Captura, actualiza
  Pipeline antes de llamar, deja Nota despues de cada llamada, registra cobros
  en Ingresos como pendiente.
- **Viernes (cierre):** revisar caja, cobros, Fondo ONIA, comisiones con
  evidencia, pipeline caliente, entregas pendientes, seguimientos en riesgo.

### Checklist de cierre del viernes

- [ ] CRM/ONIA Center al 100%.
- [ ] Cobros de la semana registrados con comprobante.
- [ ] Fondo ONIA separado (40%) y anotado.
- [ ] Comisiones de Arthur clasificadas por nivel de intervencion.
- [ ] Pipeline: quien esta cerca de pagar.
- [ ] Entregas vendidas pero pendientes.
- [ ] Reporte semanal de Arthur recibido.
- [ ] Semaforo de caja actualizado.

## 5. Limpieza de documentos

| Documento | Accion |
|---|---|
| `propuestas/acuerdo-colaborador-onia-nuvia.html` | Vigente. Es el que acepta Arthur. Dia 0 = 2026-07-03. |
| `propuestas/arthur-inversion-onia-nuvia-tabla-20260625.html` | OBSOLETO. Era el escenario de Arthur invirtiendo. No enviar. |

## 6. Revision al dia 60 (2026-09-01)

Preguntas de decision:

1. Arthur cumplio el scorecard semanal?
2. Genero ventas cobradas reales?
3. Hay pipeline vivo y CRM ordenado?
4. ONIA recupero parte del capital?

Opciones al dia 60: continuar con mejores porcentajes, mantener solo por
tarea/comision, ajustar 30 dias mas, o terminar sin participacion en ONIA.
Ninguna revision otorga propiedad de ONIA.
