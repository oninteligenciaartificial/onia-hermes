# Project Price Update Prompts 2026

Use these prompts in each project repo so pricing, plans, landing copy, seed
data and sales screens stay aligned with ONIA Pricing 2026.

## DentalGest

Target repo:

```text
C:\dev\Proyectos\dental-saas
```

Prompt:

```text
Actualiza DentalGest con los precios actuales ONIA 2026.

Contexto:
- DentalGest es SaaS self-service para clinicas dentales.
- No debe existir setup obligatorio.
- Los clientes pueden crear su cuenta, subir/cargar sus datos y empezar solos.
- El onboarding es opcional y se vende como acelerador.

Precios actuales:
- Basico: Bs. 320/mes.
- Profesional: Bs. 750/mes.
- Clinica: Bs. 1,500/mes.

Onboarding opcional:
- Carga guiada express: Bs. 290.
- Configuracion asistida: Bs. 690.
- Migracion + capacitacion equipo: Bs. 1,490.

Comisiones comerciales para mostrar solo en docs internos/admin, no en landing publica:
- SaaS mensual: 35% de la primera mensualidad neta cobrada, una sola vez.
- SaaS anual prepago: 8% del anual neto cobrado.
- Onboarding: 10% del pago neto cobrado.

Tareas:
1. Buscar todos los precios antiguos en el repo.
2. Actualizar landing, pricing cards, seed data, constants, tests y docs.
3. Cambiar cualquier copy que diga setup obligatorio.
4. Agregar copy: "Empieza solo con tu mensualidad. Si quieres, ONIA puede ayudarte a dejar todo configurado."
5. Mantener WhatsApp automation bloqueado hasta verificacion Meta.
6. Validar con tests/lint/build disponibles.
7. Reportar archivos modificados y cualquier precio restante encontrado.
```

## Gesti-OS

Target repo:

```text
C:\dev\Proyectos\Gestios
```

Prompt:

```text
Actualiza Gesti-OS con los precios actuales ONIA 2026.

Contexto:
- Gesti-OS es SaaS de gestion operativa para pymes.
- Basico debe poder ser self-service.
- Crecer y Pro pueden recomendar onboarding, pero no bloquear la compra.
- Empresarial se cotiza si requiere alcance especial.

Precios actuales:
- Basico: Bs. 350/mes.
- Crecer: Bs. 530/mes.
- Pro: Bs. 800/mes.
- Empresarial: Bs. 1,250/mes.

Implementacion opcional:
- Kickstart: Bs. 790.
- Implementacion operativa: Bs. 1,900.
- Procesos a medida: desde Bs. 5,000.

Add-ons:
- SIAT: USD 25/mes.
- Pagos QR: USD 15/mes.
- E-commerce: USD 20/mes.
- Exportacion contable: USD 18/mes.
- WhatsApp Business: pendiente hasta verificacion Meta.

Comisiones comerciales para docs internos/admin, no landing publica:
- Basico/Crecer/Pro/Empresarial mensual: 35% de la primera mensualidad neta cobrada, una sola vez.
- Plan anual prepago: 8% del anual neto cobrado.
- Empresarial: 35% del primer pago neto cobrado.
- Implementacion: 10% del pago neto cobrado.

Tareas:
1. Buscar y reemplazar precios antiguos.
2. Actualizar pricing cards, checkout, admin constants, docs y seed data.
3. Aclarar que Basico no requiere setup.
4. Mostrar implementacion como opcional/recomendada, no obligatoria.
5. Mantener WhatsApp bloqueado hasta verificacion Meta.
6. Validar tests/lint/build disponibles.
7. Reportar archivos modificados y precios restantes encontrados.
```

## Web ONIA / Websites

Target repo:

```text
C:\dev\Proyectos\Web-Onia
```

Prompt:

```text
Actualiza Web ONIA con la nueva tabla comercial 2026 para servicios web.

Precios:
- Landing: Bs. 790.
- Web Profesional: Bs. 1,500.
- Web Pro ONIA: Bs. 2,900.
- SaaS / portal personalizado / mini sistema: desde Bs. 6,500.

Care plan:
- Basico: Bs. 190/mes.
- Crecimiento: Bs. 390/mes.
- Pro: Bs. 690/mes.

Comisiones internas:
- Landing: 10% del pago neto cobrado.
- Web Profesional / Web Pro ONIA: 12% del pago neto cobrado.
- SaaS / portal personalizado / mini sistema: 10% solo con margen aprobado.
- Care plan: 50% de la primera mensualidad neta cobrada, una sola vez.

Reglas comerciales:
- Servicios/proyectos: 50% anticipo, 50% contra entrega.
- No prometer ventas garantizadas.
- Pauta publicitaria separada.

Tareas:
1. Actualizar secciones de servicios, pricing, propuestas y CTAs.
2. Reposicionar la web como "captacion + seguimiento", no solo diseno.
3. Agregar upsell hacia auditoria, CRM y n8n simple.
4. Buscar precios viejos y reportar cualquier hallazgo.
5. Validar tests/lint/build disponibles.
```

## Hermes / Auditorias y n8n

Target repo:

```text
C:\dev\Expermimentos\Hermes
```

Prompt:

```text
Actualiza Hermes con la tabla comercial 2026 para auditorias, n8n simple y
materiales de vendedores. Videos IA / Higgsfield queda pausado como oferta
comercial; no debe aparecer en tablas de precios ni propuestas de venta.

Auditorias:
- Auditoria Express: Bs. 250.
- Diagnostico + Plan: Bs. 690.

n8n simple:
- Conexion canal social: Bs. 690 setup.
- Automatizacion simple n8n: Bs. 790 setup.
- Flujo aprobacion n8n: Bs. 1,200 setup.
- Monitoreo n8n: Bs. 150/mes.

Alcance n8n:
- Entrada: formulario, lead, email, planilla o registro manual.
- Logica: asignar estado, responsable, prioridad, tarea o aprobacion.
- Salida: Telegram, email, Sheets, Notion o CRM interno.
- Excluye WhatsApp automatico, scraping masivo, APIs pagadas, login de terceros y soporte continuo no cotizado.

Comisiones:
- Auditorias y n8n setup: 10% del pago neto cobrado.
- Monitoreo n8n: 10% de la primera mensualidad neta cobrada.

Tareas:
1. Actualizar docs canonicos, referencias JSON, skills y decks.
2. Mantener aprobaciones obligatorias antes de publicar/contactar.
3. Validar que videos IA / Higgsfield no aparezcan como oferta activa.
4. Validar que no haya secretos en docs.
5. Validar JSON y comandos disponibles.
6. Desplegar con npm run deploy:hermes-content solo si la validacion local pasa.
```
