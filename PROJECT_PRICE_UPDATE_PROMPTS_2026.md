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
Actualiza DentalGest con la nueva estrategia de precios ONIA 2026.

Contexto:
- DentalGest es SaaS self-service para clinicas dentales.
- No debe existir setup obligatorio.
- Los clientes pueden crear su cuenta, subir/cargar sus datos y empezar solos.
- El onboarding es opcional y se vende como acelerador.

Precios:
- Starter: Bs. 349/mes.
- Pro: Bs. 590/mes.
- Clinic: Bs. 990/mes.

Oferta fundadores primeros 10 clientes:
- Starter: Bs. 290/mes.
- Pro: Bs. 490/mes.
- Clinic: Bs. 790/mes.

Onboarding opcional:
- Carga guiada express: Bs. 290.
- Configuracion asistida: Bs. 690.
- Migracion + capacitacion equipo: Bs. 1,490.

Comisiones comerciales para mostrar solo en docs internos/admin, no en landing publica:
- SaaS mensual: 50% de la primera mensualidad neta cobrada, una sola vez.
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
Actualiza Gesti-OS con la nueva estrategia de precios ONIA 2026.

Contexto:
- Gesti-OS es SaaS de gestion operativa para pymes.
- Starter debe poder ser self-service.
- Operativo y Pro pueden recomendar onboarding, pero no bloquear la compra.
- Enterprise se cotiza.

Precios:
- Starter: Bs. 490/mes.
- Operativo: Bs. 790/mes.
- Pro: Bs. 1,290/mes.
- Enterprise: desde Bs. 2,490/mes.

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
- Starter/Operativo/Pro mensual: 50% de la primera mensualidad neta cobrada, una sola vez.
- Plan anual prepago: 8% del anual neto cobrado.
- Enterprise: 8% del primer pago neto cobrado.
- Implementacion: 10% del pago neto cobrado.

Tareas:
1. Buscar y reemplazar precios antiguos.
2. Actualizar pricing cards, checkout, admin constants, docs y seed data.
3. Aclarar que Starter no requiere setup.
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
- Landing Express: Bs. 1,490.
- Web Negocio: Bs. 2,900.
- Web Pro IA: Bs. 5,900.
- SaaS / portal personalizado: desde Bs. 9,500.

Care plan:
- Basico: Bs. 190/mes.
- Crecimiento: Bs. 390/mes.
- Pro: Bs. 690/mes.

Comisiones internas:
- Landing Express: 10% del pago neto cobrado.
- Web Negocio / Web Pro IA: 12% del pago neto cobrado.
- SaaS / portal personalizado: 8% del pago neto cobrado; 10% solo con margen aprobado.
- Care plan: 50% de la primera mensualidad neta cobrada, una sola vez.

Reglas comerciales:
- Servicios/proyectos: 50% anticipo, 50% contra entrega.
- No prometer ventas garantizadas.
- Pauta publicitaria separada.

Tareas:
1. Actualizar secciones de servicios, pricing, propuestas y CTAs.
2. Reposicionar la web como "captacion + seguimiento", no solo diseno.
3. Agregar upsell hacia CRM, n8n y contenido Higgsfield.
4. Buscar precios viejos y reportar cualquier hallazgo.
5. Validar tests/lint/build disponibles.
```

## Hermes / Higgsfield Marketing

Target repo:

```text
C:\dev\Expermimentos\Hermes
```

Prompt:

```text
Actualiza Hermes con la tabla comercial 2026 para Marketing con Higgsfield,
conectores y materiales de vendedores.

Marketing con Higgsfield:
- Video unit: Bs. 450.
- Sprint 8: Bs. 2,200/mes.
- Growth 16: Bs. 3,900/mes.
- Authority 24: Bs. 6,500/mes.
- Performance System: desde Bs. 9,500/mes.

Precio de entrada primeros 5 clientes:
- Sprint 8: Bs. 1,800/mes.
- Growth 16: Bs. 3,200/mes.
- Authority 24: Bs. 5,500/mes.

Conectores:
- Instagram: incluido si ya existe token Meta.
- TikTok API: Bs. 900 setup + Bs. 150/mes monitoreo.
- YouTube Shorts API: Bs. 900 setup + Bs. 150/mes monitoreo.
- LinkedIn API: Bs. 900 setup + Bs. 150/mes monitoreo.
- n8n aprobaciones/publicacion: Bs. 1,800 setup + Bs. 350/mes monitoreo.

Comisiones:
- Video unit: 10% del pago neto cobrado.
- Sprint/Growth/Authority: 15% del primer mes neto cobrado, una sola vez.
- Performance: 10% del primer mes neto cobrado, una sola vez.
- Conectores: 10% del setup neto cobrado. El monitoreo mensual no genera comision adicional.

Tareas:
1. Actualizar docs canonicos, referencias JSON, skills y decks.
2. Mantener aprobaciones obligatorias antes de publicar/contactar.
3. Validar que no haya secretos en docs.
4. Validar JSON y comandos disponibles.
5. Desplegar con npm run deploy:hermes-content solo si la validacion local pasa.
```
