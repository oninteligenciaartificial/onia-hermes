# Onia Leads Priority 2026

Fuente principal: `hermes-content/references/prospectos-clinicas-bolivia-2026.csv`.

Estado: cartera inicial investigada. No contactar sin aprobacion explicita.

> ⚠️ **Los nombres de plan de este doc se corrigieron el 2026-08-27.** Decían `DentalGest
> Basico / Profesional / Clinica`; hoy los planes se llaman **Básico · Profesional · Completo ·
> Empresa** (`PLAN_LABELS` en `onia-platform/lib/pricing.ts`) y Onia vende 7 rubros, no solo
> clínicas. Los precios y las comisiones se leen de
> `onia-platform/lib/subscription-plans.ts`, no de acá.

## Resumen

- Total leads dentales: 50.
- Prioridad alta: 29.
- Prioridad media: 21.
- Canal permitido por ahora: Instagram/Facebook publico, LinkedIn, email publico
  o formulario web.
- Canal bloqueado: WhatsApp automatico hasta verificacion Meta.

## Premios de referencia para vendedores

| Venta sugerida | Premio vendedor |
|---|---:|
| Plan Básico | Bs. 112 |
| Plan Profesional | Bs. 262,50 |
| Plan Completo | Bs. 525 |
| Landing | Bs. 79 |
| Web Profesional | Bs. 180 |
| Web Pro Onia | Bs. 348 |
| Auditoria Express | Bs. 25 |
| Diagnostico + Plan | Bs. 69 |
| Automatizacion simple n8n | Bs. 79 |

## Top 15 leads para empezar

| # | Lead | Ciudad | Senal | Dolor probable | Oferta inicial | Upsell | Premio probable |
|---:|---|---|---|---|---|---|---:|
| 1 | CRO - Clinica de Rehabilitacion Odontologica | Santa Cruz | Web, varias sedes y varios telefonos | Multi-sede necesita trazabilidad por sucursal | Plan Completo | Web/landing + reportes | Bs. 525 + upsell |
| 2 | Odontoking Clinica Dental | Santa Cruz | Web y marca clara | Puede mejorar embudo y seguimiento | Plan Profesional | Web optimizada + CRM | Bs. 262,50 + upsell |
| 3 | Odontolaser | Santa Cruz | Web, Facebook y tratamientos tecnologicos | Tratamientos especializados requieren seguimiento | Plan Profesional | Diagnostico + Plan | Bs. 262,50 + Bs. 69 |
| 4 | Paz Dental | Santa Cruz | Web, Facebook, zona Equipetrol | Alto valor por paciente | Plan Profesional | Landing de tratamientos | Bs. 262,50 + upsell |
| 5 | Estetic Dent Santa Cruz | Santa Cruz | Web estetica y autoridad profesional | Embudos por tratamiento estetico | Plan Profesional | Web Pro Onia | Bs. 262,50 + Bs. 348 |
| 6 | CEO Clinica de Odontologia Especializada | Santa Cruz | Web y especialidad | Ortodoncia/odontopediatria con consultas repetitivas | Plan Profesional | Web + contenido educativo manual | Bs. 262,50 + upsell |
| 7 | Clinica Dental Cortez | La Paz | Web y email publico | Captacion web y seguimiento de citas | Plan Profesional | Landing | Bs. 262,50 + Bs. 79 |
| 8 | Clinica Dental Love | La Paz | Marca clara y email con dominio | Integrar redes, agenda y seguimiento | Plan Profesional | Diagnostico + Plan | Bs. 262,50 + Bs. 69 |
| 9 | ASISTA - Clinica Dental | Santa Cruz | Facebook y contacto publico, sin web clara | Leads dispersos por redes | Plan Básico | Landing | Bs. 112 + Bs. 79 |
| 10 | Bio Odontologia | Santa Cruz | Perfil social como canal principal | Agenda y consultas por redes sin CRM | Plan Básico | n8n simple interno | Bs. 112 + Bs. 79 |
| 11 | Consultorio Dental Dr. Rodrigo Garcia | La Paz | Web en Blogspot | Presencia digital mejorable | Landing | Plan Básico | Bs. 79 + Bs. 112 |
| 12 | Clinica Dental DuoDent | Santa Cruz | Canal social visible sin web | Mensajes de redes sin sistema | Plan Básico | Auditoria Express | Bs. 112 + Bs. 25 |
| 13 | Clinica Dental Jauregui | Santa Cruz | Facebook/email y horario amplio | Citas o presupuestos olvidados | Plan Básico | Recordatorios internos | Bs. 112 |
| 14 | Merdel Clinica Odontologica | Santa Cruz | Facebook y email publico | Consultas sociales sin seguimiento | Plan Básico | Agenda asistida | Bs. 112 |
| 15 | Odontologia Morales | Santa Cruz | Perfil social como canal principal | Gestion manual de consultas | Plan Básico | Landing | Bs. 112 + Bs. 79 |

## Mensajes listos para aprobacion

### Lead con web y tratamientos de alto valor

```text
Hola, soy Sergio de ONIA. Vi que tienen presencia web y tratamientos que suelen
generar consultas de alto valor. Justo estamos preparando DentalGest: un sistema
para ordenar consultas, citas, presupuestos pendientes y seguimiento de pacientes.

Si les sirve, les muestro una demo corta y vemos si encaja con su flujo actual.
```

### Lead con Facebook o Instagram como canal principal

```text
Hola, soy Sergio de ONIA. Vi que reciben consultas por redes y creo que hay una
oportunidad simple: que cada consulta quede registrada, con estado y seguimiento,
para que no se pierdan pacientes potenciales.

Estamos preparando DentalGest y puedo mostrarles una demo corta esta semana.
```

### Lead multi-sede o equipo grande

```text
Hola, soy Sergio de ONIA. Vi que manejan varios puntos de contacto y eso suele
volver dificil saber que consulta respondio cada sede o en que estado quedo cada
paciente potencial.

DentalGest puede ordenar consultas, citas y seguimiento por equipo/sucursal. Si
les sirve, les muestro una demo corta.
```

### Lead con web antigua o debil

```text
Hola, soy Sergio de ONIA. Vi su presencia digital y creo que hay una mejora
rapida: una pagina clara para captar consultas y un sistema simple para darles
seguimiento.

Si quieres, te preparo una auditoria corta con 2 mejoras puntuales.
```

## Criterios de priorizacion

Alta prioridad:

- Tiene web y tratamientos de alto valor.
- Tiene varias sedes o varios telefonos.
- Tiene marca clara y posibilidad de pagar Pro/Clinic.
- Tiene email publico o formulario web.

Media prioridad:

- Solo Facebook/Instagram.
- Consultorio pequeno.
- Contacto publico limitado.
- Se debe validar actividad antes de escribir.

## Siguiente lote

Para Gesti-OS, paginas web, auditorias y n8n fuera del rubro dental, crear listas por
rubro con estos filtros:

- pymes que publican actividad operativa;
- empresas que muestran pedidos, obras, clientes o agenda;
- negocios con web debil o sin formulario;
- marcas que publican poco pero tienen oferta visual;
- empresas con LinkedIn activo pero sin sistema claro de captacion.
