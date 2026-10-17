# Onia - Colaboradores Comerciales sin inversion 2026

Estado: canonico interno Sergio/Onia.
Fecha: 2026-07-18.
Uso: sistema para incorporar y administrar colaboradores comerciales que NO
aportan capital, pagados 100% por resultado, en prueba de 60 dias por fases.

> Fuente de verdad. El acuerdo por colaborador
> (`ONIA_ACUERDO_COLABORADOR_COMERCIAL_PLANTILLA_2026.md`) y la spec del panel
> (`ONIA_COLABORADORES_PANEL_SPEC_2026.md`) cuelgan de este documento. Reusa la
> mecanica ya probada; no la duplica. Fuentes madre:
> `hermes-content/docs/historial/orquestacion-vieja/ONIA_COMPANY_OPERATING_MODEL_2026.md`, `ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md`,
> `ONIA_VENDOR_MANUAL_2026.md`, `ONIA_PANEL_VENDEDORES_2026.md`,
> `ONIA_HERMES_COLLABORATOR_ACCESS_MODEL_2026.md`,
> `ONIA_HERMES_COLLABORATOR_SETUP_RUNBOOK_2026.md`.

## Veredicto

Dos colaboradores comerciales-operativos entran sin capital, pagados por
resultado, en prueba de 60 dias dividida en dos fases:

```text
Fase 1 (dia 1-30)  = Plan A. Cero riesgo de caja. 100% variable, sin base.
Fase 2 (dia 31-60) = Plan B. Solo si pasan el filtro. Suma base recuperable y
                     premia la produccion propia.
```

Regla que ordena todo: primero Onia vive, despues se reparte. No aportan capital,
no son socios, no son empleados. Ganan cuando Onia cobra.

## 1. Encuadre y nivel

- Rol interno: `Colaborador Comercial-Operativo - prueba 60 dias`.
- Nivel 0 -> 1 del operating model (arriba de nada, abajo de coordinador). NO
  Nivel 2: Arthur ya es el coordinador; no hay tres coordinadores.
- Coordinacion diaria: Arthur (si esta activo) o Sergio. Sergio aprueba dinero,
  precios, descuentos, contactos sensibles y comisiones.
- No son socios de Onia, no participan de Onia Dental, Onia Comercio, Hermes, Web
  Factory ni Nuvia salvo comision por venta aprobada.
- No son empleados formales. Ver seccion 10 (riesgo laboral).

## 2. Como ganan - dos fases

Los porcentajes se calculan sobre el monto NETO realmente cobrado, despues de
descontar costos directos externos (impuestos, pauta, dominio, hosting,
pasarela, APIs, WhatsApp, creditos IA, herramientas del cliente). Una venta
cobrada = una comision. Sin cobro + CRM completo, no hay pago.

### Fase 1 (dia 1-30) - Plan A

| Servicio | Comision colaborador | Regla |
|---|---:|---|
| Onia Dental / Onia Comercio mensual | 35% | Solo sobre el primer pago neto |
| Add-on mensual aprobado | 35% | Solo sobre el primer pago neto |
| Pagina web (vende o produce) | 12% | Sobre pago neto cobrado |
| Auditoria / diagnostico / n8n / conector | 10% | Sobre neto cobrado |
| Sistema personalizado | 10% | Sobre primer pago neto |

- Sin base fija. Cero compromiso de caja.
- Bonos: solo con semaforo en verde (ver seccion 9). En caja roja/amarilla se
  difieren.
- Piso diario/semanal obligatorio igual que en Fase 2 (seccion 3).

### Fase 2 (dia 31-60) - Plan B, solo si pasa el filtro

| Servicio | Comision colaborador | Cambia vs Fase 1 |
|---|---:|---|
| Onia Dental / Onia Comercio mensual | 35% | igual |
| Pagina web - solo la vende | 12% | igual |
| Pagina web - vende Y produce completa | 18% | premia producir, no solo vender |
| Auditoria / diagnostico / n8n | 10% | igual |

- Base recuperable: Bs. 400/mes, tope 2 meses, solo si cumplio >=80% del piso.
  Es adelanto, no sueldo: se descuenta contra las comisiones que genere. Si
  vende, no le cuesta nada extra a Onia; si cumple el piso pero no vende, el
  riesgo maximo expuesto es Bs. 400/mes por persona.
- Bonos activos (seccion 9).
- Escalera: 4 semanas verdes seguidas suben la comision web de 12% a 15% de forma
  permanente.

### Criterio de paso Fase 1 -> Fase 2

Se pasa a Plan B al dia 31 solo si en los primeros 30 dias:

1. Logro 3 de 4 semanas verdes (>=80% del piso sin fallar los innegociables).
2. Consiguio al menos 1 venta cobrada, o pipeline real (propuestas enviadas +
   seguimientos vivos registrados).
3. Mantuvo CRM / Onia Center ordenado.

Si no cumple: sigue en Plan A otros 30 dias o sale de la prueba. Ningun ascenso
es por calendario; se gana con evidencia.

### Orden de cada cobro

```text
1. Cobro real confirmado y registrado.
2. - costos directos externos del cliente.
3. - comision del colaborador segun tabla (solo sobre lo cobrado).
4. Lo restante queda en Onia: Fondo Onia, entrega, herramientas, utilidad.
```

La comision baja (10%-35%) ya deja a Onia por delante, porque Onia paga entrega,
soporte, herramientas, mantenimiento y riesgo de cancelacion.

### Cierres y pagos

- Adelanto quincenal: hasta 20% del pago ganado/aprobable, con cobro real,
  evidencia y CRM completo.
- Cierre mensual: pago final aprobado menos adelantos. Si hubo reclamo,
  devolucion o entrega no aprobada, se compensa en el siguiente cierre.
- Nadie cobra si: el cliente no pago, falta CRM, la venta no fue aprobada, hubo
  promesa no autorizada, o el cliente cancela/pide reembolso antes de 30 dias.

## 3. Piso diario y semanal (obligatorio, si o si)

Cuota diaria minima:

- 20 prospectos revisados
- 10 mensajes bien personalizados
- 5 seguimientos
- 1 a 2 demos u oportunidades agendadas
- CRM / Onia Center actualizado al cierre del dia

Scorecard semanal:

| Area | Minimo semanal |
|---|---:|
| Prospectos nuevos completos | 35 |
| Contactos / mensajes / llamadas reales | 25 |
| Seguimientos realizados | 20 |
| Llamadas o audios comerciales | 8 |
| Reuniones o demos agendadas | 3 |
| Propuestas / auditorias / diagnosticos enviados | 3 |
| CRM / Onia Center actualizado (viernes) | 100% |
| Reporte semanal | 1 |

- Semana aprobada = >=80% del total y sin fallar los tres innegociables: CRM al
  dia, seguimientos, reporte semanal. Fallar uno invalida la semana.
- Consecuencias: 1 semana fallida = feedback; 2 semanas = variable mas bajo y
  baja de responsabilidad; 3 semanas seguidas = pausa o salida.
- Regla dura: si no esta registrado en Onia Center, no cuenta para pago,
  seguimiento, cierre ni evaluacion.

## 4. Territorio y anti-colision (dos personas, no una)

- Cada colaborador tiene territorio propio por rubro o zona, para no pisarse.
- Cada lead guarda `vendedor_origen` y `responsable_actual`. Nadie contacta un
  lead con otro responsable.
- Derecho de origen: quien registra completo el lead lo trabaja. Un lead 7 dias
  sin seguimiento se reasigna y pierde derecho de origen.
- Deals compartidos: la participacion se reparte por evidencia registrada, por
  campos (origen / contacto / seguimiento / cierre / brief / produccion / QA), no
  por percepcion.

## 5. Registro obligatorio - Onia Center

Fuente de verdad operativa: Onia Center `/onia-center/equipo` (vista segura por
rol) sobre el schema Supabase `onia_sales`. Mientras el panel termina de cablear
el scorecard y los pagos, Notion -> CRM Vendedores Onia es respaldo.

Se registra: leads, contactos, seguimientos, notas de llamada, demos, propuestas,
cobros, evidencia de entrega, scorecard y comisiones. La vista de equipo NO
muestra capital de Sergio, deuda, caja completa, lotes Nuvia ni estrategia
interna.

## 6. Trabajo con clientes (con obligacion)

Pueden liderar solos:

- primera llamada / diagnostico simple;
- brief de web o contenido;
- seguimiento comercial;
- venta de web simple dentro de precios aprobados;
- onboarding basico de cliente.

Escalan siempre a Sergio:

- descuentos, sistemas complejos, tickets > Bs. 2.900;
- contratos, credenciales, integraciones (pagos, WhatsApp, Meta, APIs);
- reclamos y clientes sensibles.

Obligaciones de servicio (SLA):

- responder el mismo dia laboral;
- registrar cada interaccion en CRM antes de la proxima accion;
- todo cliente con proximo paso agendado;
- lead 7 dias sin seguimiento se reasigna;
- entrega con checklist / QA antes de marcarla hecha;
- no prometer nada fuera de lista.

## 7. Acceso y seguridad (P0-P4)

- No ven secretos (P0), ni finanzas/acuerdos/porcentajes internos (P1).
- Ven interno saneado (P2), colaboracion (P3) y publico (P4).
- Trabajan en el repo saneado `onia-hermes-collab`, nunca en `onia-hermes`
  privado. Permisos GitHub `Triage`/`Write`, `main` protegido, PR obligatorio.
- Detalle: `ONIA_HERMES_COLLABORATOR_ACCESS_MODEL_2026.md` y su runbook.

## 8. Ritmo y calendario

| Momento | Que pasa |
|---|---|
| Lunes | Prioridades de la semana; leads y tareas asignadas |
| Diario | Cuota diaria + seguimientos que vencen + CRM al dia |
| Viernes | Cierre semanal conjunto: scorecards de ambos, feedback |
| Quincenal | Adelanto <=20% sobre lo ganado/aprobable |
| Dia 30 | Filtro Fase 1 -> Fase 2 por colaborador |
| Fin de mes | Cierre mensual y pago final |
| Dia 60 | Decision: continuar, renegociar o salir |

## 9. Bonos por sobresaliente

Activos en ambas fases, pagados solo con semaforo en verde (Fondo Onia ya cubrio
herramientas y reserva):

| Bono | Se gatilla | Recompensa |
|---|---|---:|
| Meta mensual | mas de 4 ventas cobradas en el mes | Bs. 250 |
| Recurrencia SaaS | cada Onia Dental/Onia Comercio que llega a 30 dias activo | Bs. 120 |
| Calidad | mes completo sin reclamos ni rescates de Sergio | Bs. 150 |
| Discrecional | algo excepcional que Sergio reconozca | definido por Sergio |

Escalera (mejora estructural, no bono): 4 semanas verdes seguidas suben la
comision web a 15%. 8 semanas + ventas constantes habilitan revisar base fija o
subir de nivel.

## 10. Riesgo laboral y mitigacion

- Bolivia reconoce relacion laboral por dependencia + subordinacion +
  remuneracion. Horario impuesto + continuidad + pago fijo pueden configurar
  empleo (aguinaldo, finiquito, beneficios).
- Mitigacion: relacion por resultado, sin horario rigido impuesto, sin
  exclusividad, prueba a plazo, y en Fase 2 la base es recuperable y con tope, no
  sueldo.
- Antes de renovar al dia 60 o formalizar, validar con abogado/contador. Este
  documento es estructura interna de negocio, no asesoria legal ni tributaria.

## Fuentes canonicas

- `hermes-content/docs/historial/orquestacion-vieja/ONIA_COMPANY_OPERATING_MODEL_2026.md`
- `ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `ONIA_PANEL_VENDEDORES_2026.md`
- `ONIA_HERMES_COLLABORATOR_ACCESS_MODEL_2026.md`
- `ONIA_HERMES_COLLABORATOR_SETUP_RUNBOOK_2026.md`
- **Precios: `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts` (add-ons)** — la fuente. Transcritos junto a sus funciones en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. *(`ONIA_PRICING_2026.md` quedó degradado el 2026-08-27: es historia de junio, no fuente.)*
