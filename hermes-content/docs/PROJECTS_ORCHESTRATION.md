# Onia Projects Orchestration

## Objetivo
Convertir Hermes en el centro de mando comercial de Onia para decidir que
vender, a quien, con que contenido, por que canal y con que aprobacion.

Hermes coordina. n8n ejecuta flujos. Los proyectos entregan valor. Sergio
aprueba acciones client-facing.

## Proyectos activos

| Proyecto | Ruta local | Rol comercial | Cliente ideal | Oferta principal |
|---|---|---|---|---|
| DentalGest | `C:\dev\Proyectos\dental-saas` | SaaS vertical para clinicas dentales | Clinicas dentales de Bolivia | CRM, agenda, seguimiento, recordatorios y demo |
| Gesti-OS | `C:\dev\Proyectos\Gestios` | Sistema operativo de gestion empresarial | Pymes con operaciones en Excel o WhatsApp | Tareas, clientes, estados, reportes y visibilidad |
| Web Onia | `C:\dev\Proyectos\Web-Onia` | Sitio y vitrina de Onia | Prospectos que investigan antes de comprar | Autoridad, portfolio, landing y captacion |
| Paginas web Onia | por cliente | Servicio cash-flow | Negocios locales y profesionales | Landing/web + formulario + seguimiento |
| Marketing Higgsfield | Hermes Video Lab | Pausado como oferta principal | Uso interno y muestras aprobadas | No vender videos IA por ahora |
| Consultoria Onia | `hermes-content/docs/historial/ONIA_CONSULTING_SERVICES_2026.md` | Diagnostico, instalacion y acompanamiento | Negocios que necesitan ordenar procesos antes de comprar herramientas | Auditoria, roadmap, instalacion, capacitacion y soporte consultivo |
| AlfredHQ | `C:\dev\Proyectos\AlfredHQ` | Sistema/experimento interno | Uso interno | Evaluar antes de vender |

## Escalera comercial

1. Entrada rapida: auditoria express o diagnostico pagado.
2. Servicio inicial: pagina web o landing de captacion.
3. Sistema de seguimiento: CRM, Telegram, email, Chatwoot o n8n.
4. Producto vertical: DentalGest o Gesti-OS.
5. Consultoria/implementacion: instalar flujo, capacitar y documentar.
6. Retainer: cuidado web, soporte operativo o monitoreo de automatizaciones.

## Precios conocidos

Oferta de arranque comercial vigente hasta 2026-07-31 o primeros 20 clientes
cobrados:

- DentalGest: Bs. 320, Bs. 750 y Bs. 1500/mes.
- Gesti-OS: Bs. 350, Bs. 530, Bs. 800 y Bs. 1250/mes.
- Landing: Bs. 790.
- Web Negocio: Bs. 1500.
- Web Pro Onia: Bs. 2900.
- Portal o sistema web mini: desde Bs. 6500.
- Auditoria Express: Bs. 250.
- Diagnostico + Plan: Bs. 690.
- Instalacion simple: Bs. 1500.
- Implementacion operativa: desde Bs. 3900.
- Conexion de canal social: Bs. 690 setup.
- Automatizacion simple n8n: Bs. 790 setup.
- Flujo n8n aprobaciones: Bs. 1200 setup.

Regla: DentalGest y Gesti-OS mantienen su precio actual. Videos IA/Higgsfield no
se venden como producto independiente por ahora.

Onia Platform (el pack dental es un rubro, no un producto aparte):

- Básico: Bs. 320/mes, sin setup obligatorio.
- Profesional: Bs. 750/mes, sin setup obligatorio.
- Completo: Bs. 1.500/mes, sin setup obligatorio.
- Empresa: Bs. 2.900/mes + implementación desde Bs. 3.500.
- Anual = 10 meses. Semanal (Bs. 89 / Bs. 199) solo en Básico y Profesional.
- Onboarding opcional: **cotizado por alcance** (`pricing.ts`: "Onboarding guiado — Cotizado por alcance"). Los montos fijos 290/690/1.490 no existen en el código.
- Chatbot de WhatsApp: **Bs. 390/mes o Bs. 3.900/año, sin cargo inicial**; los mensajes se los
  cobra Meta al cliente en su propia cuenta.

⚠️ Corregido 2026-08-27: decía `Basico/Profesional/Clinica`, faltaba Empresa y listaba un
onboarding de 290/690/1.490 que el código no tiene. Los montos se leen de
`onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts`.

Gesti-OS:

- Basico: Bs. 350/mes, sin setup obligatorio.
- Crecer: Bs. 530/mes, sin setup obligatorio.
- Pro: Bs. 800/mes, onboarding recomendado.
- Empresarial: Bs. 1250/mes, implementacion cotizada si hay alcance extra.
- Add-ons: WhatsApp Business, pagos QR, e-commerce y exportacion contable
  segun plan/proveedor. El inventario avanzado NO es add-on: se retiro de la
  oferta el 2026-08-27 y sus funciones van incluidas. WhatsApp queda bloqueado hasta
  verificacion Meta. SIAT no se vende por ahora.

Marketing Higgsfield:

- Pausado como producto comercial independiente.
- No vender videos IA, packs Higgsfield ni promesas de contenido con IA.
- Usar solo para muestras internas o propuestas aprobadas caso por caso.

Paginas web:

- Landing Express: Bs. 790.
- Web Negocio: Bs. 1500.
- Web Pro Onia: Bs. 2900.
- SaaS / portal personalizado mini: desde Bs. 6500.
- Care plan: Bs. 190, Bs. 390 o Bs. 690/mes.

Conectores cross-platform:

- Conexion de canal social: Bs. 690 setup.
- Automatizacion simple n8n: Bs. 790 setup para formulario/lead -> registro ->
  aviso -> tarea.
- Flujo n8n aprobaciones: Bs. 1200 setup para estados recibido, pendiente,
  aprobado, rechazado y notificado.
- Soporte/cuidado recurrente: cotizado aparte segun criticidad, cambios,
  logs, credenciales y tiempo de respuesta.

Consultoria e implementaciones:

- Auditoria Express: Bs. 250.
- Diagnostico + Roadmap: Bs. 690.
- Instalacion Starter: Bs. 1900.
- Implementacion Operativa: Bs. 3900-6500.
- Acompanamiento Consultivo: Bs. 1200-2900/mes.
- Transformacion Onia: desde Bs. 9500.

Referencia canonica de precios de PLATAFORMA: `onia-platform/lib/subscription-plans.ts`
(planes) y `onia-platform/lib/pricing.ts` (add-ons), transcritos con sus funciones en
`historial/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. *(`historial/ONIA_PRICING_2026.md` quedó degradado el
2026-08-27.)* Las cifras de web/consultoría de arriba no tienen fuente en código y **se
cotizan caso por caso** (decisión 2026-08-24): no se corrigen contra `pricing.ts`.

## Que vender segun senal

### Clinica dental

Vender primero:

- DentalGest demo.
- Web/landing si no tiene presencia clara.
- Auditoria Express si no sabemos donde se pierden consultas.

Dolores:

- pacientes que escriben y no se registran;
- presupuestos que quedan sin seguimiento;
- citas olvidadas;
- mensajes repartidos entre redes, web y llamadas.

CTA recomendado:

- "Te puedo mostrar una demo corta de DentalGest."

### Pyme con equipo, tareas o clientes

Vender primero:

- Gesti-OS.
- Automatizacion n8n.
- Dashboard simple de operacion.

Dolores:

- Excel infinito;
- reportes manuales;
- responsables poco claros;
- clientes o tareas sin estado.

CTA recomendado:

- "Te muestro como quedaria tu operacion en un tablero simple."

### Negocio sin web clara

Vender primero:

- pagina web o landing.
- formulario de lead;
- CRM simple;
- automatizacion simple n8n si ya recibe consultas.

Dolores:

- redes no convierten;
- no hay sitio que explique oferta;
- todo depende de responder manualmente.

CTA recomendado:

- "Te hago una auditoria rapida de captacion."

### Negocio con presencia debil

Vender primero:

- Auditoria Express.
- Web/landing.
- Diagnostico si no se entiende el problema.
- Automatizacion simple n8n si ya hay formulario o leads.

Dolores:

- publica, pero no convierte;
- no explica bien su oferta;
- no tiene CTA claro;
- no hay seguimiento.

CTA recomendado:

- "Te hago una auditoria express y te digo que conviene corregir primero."

### Negocio con procesos confusos pero sin compra clara

Vender primero:

- auditoria express;
- diagnostico + roadmap;
- instalacion starter si ya hay dolor concreto;
- implementacion operativa si hay equipo y responsables.

Dolores:

- "no se por donde empezar";
- herramientas sueltas sin proceso;
- equipo que usa WhatsApp, Excel y notas al mismo tiempo;
- decision lenta porque no hay mapa claro.

CTA recomendado:

- "Hagamos una auditoria corta y te digo que conviene instalar primero."

## Flujo operativo

1. Hermes toma un prospecto, rubro o idea.
2. Revisa `hermes-content/references/onia-projects-registry.json`.
3. Elige oferta primaria y oferta secundaria.
4. Crea diagnostico corto: senal, dolor, oferta, CTA.
5. Prepara mensaje y pieza de contenido si aplica.
6. Envia a Telegram para aprobacion.
7. n8n registra decision en CRM.
8. Solo despues de aprobacion se contacta o se publica.

## Comandos Hermes

```text
hermes-command telegram --message "<mensaje>"
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara venta Web ONIA: <negocio>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
Mapa proyectos ONIA
Siguiente accion comercial ONIA
```

Para Telegram/n8n, usar siempre el entrypoint general:

```bash
hermes-command telegram --message "Prepara venta DentalGest: <clinica>"
```

El JSON debe responder con `telegram_reply`: oferta, dolor probable, CTA, canal
recomendado, aprobacion necesaria y siguiente accion.

## Reglas

- No contactar prospectos sin aprobacion explicita.
- No publicar videos, piezas o propuestas client-facing sin aprobacion.
- No usar WhatsApp automatico hasta verificacion de negocio.
- No inventar resultados, clientes, precios ni testimonios.
- No pegar secretos en docs ni chat.
- Usar datos publicos para prospeccion.

## n8n recomendado

Workflow: `ONIA - Orquestador Comercial`

1. Trigger manual, Telegram o schedule.
2. Input: empresa, rubro, ciudad, URL o proyecto.
3. Cargar registro de proyectos.
4. Clasificar oportunidad.
5. Generar mensaje y siguiente accion.
6. Enviar a Telegram con botones: aprobar, editar, investigar mas, descartar.
7. Registrar en CRM.
8. Si aprobado, ejecutar canal permitido.

## Prioridad de ejecucion

1. DentalGest para 50 clinicas ya listadas.
2. Web/landing para negocios sin presencia clara.
3. Gesti-OS para pymes con operaciones repetitivas.
4. Auditoria Express para convertir dudas en diagnosticos pagos.
5. Automatizacion simple n8n como upsell despues de web, formulario o CRM.

Sprint inmediato:

- Preparar 10 mensajes DentalGest para las clinicas de mayor prioridad.
- Preparar 5 auditorias web para negocios con presencia debil.
- Preparar 5 prospectos Gesti-OS para pymes con operacion visible.
- Preparar 5 auditorias express listas para enviar como oferta de entrada.
