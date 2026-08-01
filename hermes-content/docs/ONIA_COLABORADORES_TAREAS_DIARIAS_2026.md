# Onia - Tareas diarias de colaboradores comerciales 2026

Estado: contenido operativo, listo para el panel.
Fecha: 2026-07-18.
Uso: define que hace cada colaborador cada dia. Es el contenido que la vista
"Mi dia" del Onia Center arma automaticamente. Regla:
`ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`. Panel:
`ONIA_COLABORADORES_PANEL_SPEC_2026.md`.

## Division por colaborador (para no cruzarse)

Cada uno prospecta SOLO en su territorio. Propuesta ajustable; los nombres reales
los pone Sergio.

| Colaborador | Territorio (rubro) | Producto ancla | Ofertas de entrada |
|---|---|---|---|
| 1 - Salud y servicios | dentales, consultorios, estetica, profesionales | Onia Dental | Landing Bs. 790, Auditoria Bs. 250 |
| 2 - Comercio y pymes | tiendas, distribuidoras, gastronomia, inventario | Onia Comercio | Web Bs. 1.500, Automatizacion n8n Bs. 790 |

Regla anti-colision: nadie contacta un lead fuera de su territorio ni un lead con
otro responsable. Un lead 7 dias sin seguimiento se reasigna.

## Dia tipo (los dos, distinto rubro)

| Bloque | Que hace | Donde se registra | Cuota del dia |
|---|---|---|---|
| Apertura | Abre "Mi dia": seguimientos que vencen, leads nuevos, tareas asignadas. Ordena prioridades. | Onia Center | - |
| Prospeccion | Busca negocios de su rubro (Instagram, Google Maps, Facebook) y los registra con datos completos. | Captura / CRM | 7-8 prospectos |
| Contacto | Envia mensajes personalizados a leads aprobados con la plantilla del manual. | CRM / notas | 10 mensajes |
| Seguimiento | Responde y hace follow-up de los que vencen hoy. | CRM / seguimientos | 5 seguimientos |
| Llamadas / demos | Llamadas comerciales y demos del producto ancla, si hay agenda. | Agenda comercial | segun agenda |
| Cierre del dia | Actualiza CRM, deja proximo paso en cada lead, registra evidencia, marca cuota. | Onia Center | CRM al 100% |

## No-negociables de cada dia

1. CRM / Onia Center al dia (si no esta registrado, no cuenta).
2. Seguimientos que vencian hoy, hechos.
3. Cada lead tocado queda con proximo paso agendado.
4. Nada prometido fuera de la lista de precios aprobada.

## Meta semanal (scorecard)

35 prospectos nuevos, 25 contactos, 20 seguimientos, 8 llamadas, 3 demos, 3
propuestas, CRM 100% el viernes, 1 reporte. Semana aprobada = >=80% + los 3
innegociables (CRM, seguimiento, reporte). Detalle en el doc del sistema.

## Como se ve en Onia Center

La vista "Mi dia" (spec seccion B) arma la lista sola con 4 fuentes: cuota diaria
fija, seguimientos que vencen hoy, leads nuevos del territorio sin contactar, y
tareas asignadas por Arthur/Sergio. Muestra progreso semanal y semaforo personal.
El colaborador entra, ve su lista y trabaja sobre ella; no arma nada a mano.
