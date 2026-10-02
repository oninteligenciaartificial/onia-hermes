# Onia Platform 1.1: hacia dónde escalamos

Borrador del 29-sep-2026 para Sergio Urcullo. Es una propuesta: no construye nada y no cambia la etapa.

Rutas abreviadas como en `REGLAS_UI_ONIA.md`. `MEM/` = `C:/Users/PC/.claude/projects/C--dev-proyectos-onia-hermes/memory/`.

## El marco: la 1.1 sirve a la etapa vigente, no la reemplaza

- **Etapa vigente:** Etapa 1, producto único, de hoy a 5 clientes. Se sale con **Bs 3.750/mes recurrente cobrado** (`H/hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §7). La etapa no la cambia ninguna sesión.
- **Qué entra en la 1.1:**
  - lo que ayuda a **cerrar** esos 5 clientes,
  - lo que **baja las horas de soporte** por cliente (§9 de ese doc: el techo son las horas, no la tecnología),
  - lo que hace visible **lo que el sistema ganó**, que es la promesa de venta.
- **Filtro obligatorio:** todo lo demás pasa el test de tres preguntas (§10). Si falla, no entra.
- **La visión que ordena la 1.1:** todo empaquetado y fácil, como Manychat o Higgsfield. Son cosas que el dueño podría armar solo, pero que llegan envueltas. Los agentes trabajan por el negocio y un panel muestra lo que ganaron.

---

## Orden propuesto

Cada ítem lleva su criterio de **listo**, que siempre significa encendido en producción y verificado ahí mirando (`H/CLAUDE.md` §2).

### 1.1-A · Sistema visual 1.1 (base de todo lo demás)

- **Qué:** terminar `PLAN_REDISENO_1_0_1.md` y además:
  - la sidebar agrupada al estilo Hostinger, extendida a Cobros y Contabilidad (`MEM/feedback-panel-pestanas-completas-estilo-hostinger.md`), con `<details name>` nativo (`UP/sidebar-nav/index.html`);
  - `DataTable` para las 36 tablas hechas a mano (`MEM/ui-des-ia-sistema-instalado.md`, tandas 5-6);
  - el tema oscuro re-verificado.
- **Listo cuando:** las 32 reglas de `REGLAS_UI_ONIA.md` tienen gate (AUTO o RATCHET) en CI, las pantallas de la barra inferior pasan a 375, 390 y 1440 px, y Sergio Urcullo aprobó las capturas.
- **Depende de:** la decisión de color del acento y la tipografía única (`PLAN_REDISENO_1_0_1.md` §4).

### 1.1-B · "Lo que ganó Onia" + IA de verdad en lo que redactan los agentes

- **Qué:** hoy los agentes deciden por reglas y redactan con plantillas (`MEM/agentes-ia-sin-llm-auditoria-24-sep.md`). El 24-sep Sergio Urcullo decidió "ponerles un modelo de verdad":
  - redactan con gpt-4.1-mini vía LiteLLM y caen a plantilla si falla;
  - siempre esperan aprobación humana;
  - usan solo el nombre de pila y contexto no clínico.

  La memoria dice que `release-d3b24cbc` (25-sep) llevó el redactor IA y la correa (`MEM/prod-imagen-node22-24-sep.md`). **Hay que verificarlo en vivo antes de venderlo.**
- **Visual:** portar la línea de tiempo nocturna ya diseñada para 375 px al Inicio del producto: 02:47 el asistente contestó → 07:00 "Espera tu OK" → cierre "Todo contestado. Nada decidido sin vos". Va con datos reales y un contador de decisiones con una sola fuente (`UP/hero-onia/ui-viva/capturas/hero-375-v2.png`; `UP/dashboard-minimal/README.md`). Se suma el feed "qué cambió" de 3 a 5 ítems (`H/web-factory/docs/DESIGN_LEARNED_2026.md` §3b).
- **Listo cuando:**
  - en una org de prueba con datos que disparan propuestas, un agente redacta con el modelo;
  - el dueño aprueba desde el celular;
  - el Inicio muestra la cifra "pacientes que volvieron / Bs cobrados" derivada de esas acciones;
  - la línea de LiteLLM muestra el gasto en la clave `onia-platform-agentes`.
- **Depende de:** 1.1-A (KpiTile y PropuestaCard) y de la clave LiteLLM, que ya existe según la memoria.
- **Riesgo que hay que cerrar antes:** hoy se vende "Agentes con IA" y el copy es anterior a que la IA exista (`panel-de-planes.ts:147`, según la auditoría del 24-sep). Hasta que 1.1-B esté vivo, el copy tiene que decir lo que es. Es la regla de no prometer lo inexistente.

### 1.1-C · Plantillas Meta para los agentes

- **Qué:** pasadas 24 h de la ventana, WhatsApp solo deja enviar plantillas aprobadas por Meta (`MEM/meta-whatsapp-clientes.md`). Sin eso, Volver a citar y Cobrador no pueden escribirle al paciente que se fue hace semanas, que es justo el dolor #1 del cliente ideal (`H/hermes-content/docs/ONIA_CLIENTE_IDEAL.md`).
  - Una pantalla para crear y ver el estado de las plantillas (Pendiente / Aprobada / Rechazada con motivo) desde el panel.
  - Cada agente elige su plantilla.
- **Ventaja doble:** "crear una plantilla desde nuestra interfaz de punta a punta" es el screencast 1 que pide el App Review de Tech Provider (misma memoria). Construirla también desbloquea el botón de conectar WhatsApp para cada cliente.
- **Listo cuando:** hay una plantilla aprobada por Meta, creada desde el panel, y un agente la envía fuera de la ventana y llega.
- **Depende de:** App Review (2 permisos exactos) y el método de pago cargado en Meta (decisión del 25-sep, `MEM/decisiones-sergio-25-sep-qr-icono-destrabe.md`). Desde el 1-oct el mensaje utility cuesta ~Bs 0,13 y lo paga el cliente a Meta.

### 1.1-D · Agendar dentro del chat

- **Qué:** el agente conversacional ofrece horarios reales de la agenda y deja la cita **pendiente de confirmación** en el panel. La recepcionista la confirma con un toque, o el Confirmador la confirma.
- **Por qué:** es el "empaquetado" en estado puro. Cierra el circuito lead → cita sin horas de Sergio Urcullo.
- **Listo cuando:** un WhatsApp de prueba (el número de Onia, según la decisión del 25-sep) pide turno, recibe opciones, elige, y la cita aparece en `/agenda` con su origen marcado.
- **Depende de:** el motor del bot vivo en `onia-center:3020` (`MEM/chatbot-motor-vivo-y-deploy-18-sep.md`) y un endpoint de disponibilidad por org. El 29-sep se mergeó el arreglo de los 5 s al aceptar un horario (commit `102f7dfb` en onia-hermes): hay que partir de ahí.

### 1.1-E · Medidores y "Mi plan" (antes de tocar el precio)

- **Qué:** en "Mi plan", medidores de lo que se consume contra el cupo: conversaciones del agente conversacional, mensajes Meta del mes (los paga el cliente), propuestas y aprobaciones de agentes. Barra, proyección a fin de mes y un CTA (`H/web-factory/docs/DESIGN_LEARNED_2026.md` §3b, Billing & Usage). Los agentes de planes superiores se muestran **con candado gris** en vez de ocultarse (`VI/2026-08-20-sintesis-lote-13.md` T7).
- **El paquete único S/M queda como decisión de Sergio Urcullo.** Hoy corren 5 planes: 320 / 550 / 890 / 1290 / 2900 Bs al mes (`P/lib/subscription-plans.ts:39-45`). La dirección del 17-sep ("funciones, no tamaño; todo en un solo pago") está registrada como **a analizar, no aplicada** (`MEM/decisiones-plan-empresa-coadmins-pricing.md`). Los medidores sirven con cualquier estructura de precios. Si se decide S/M, se edita `subscription-plans.ts` y ningún otro archivo inventa montos.
- **Listo cuando:** el medidor lee los mismos contadores que usa el cobro (una sola fuente) y se ve a 375 px.
- **Depende de:** 1.1-A. Del precio no depende.

### 1.1-F · Campañas a los propios pacientes, con su costo a la vista

- **Qué entra:** el dueño elige un segmento (por ejemplo, "no vienen hace 6 meses"), una plantilla aprobada (1.1-C) y ve el costo estimado en Meta antes de enviar ("~Bs 0,13 × 84 = Bs 11, lo pagás a Meta"). Aprueba, y el panel muestra cuántos respondieron y cuántos agendaron. Pasa el test de tres preguntas: es el mismo cliente, no tiene sentido sin el núcleo y no requiere horas por cliente.
- **Qué NO entra:** manejar la publicidad paga del cliente (Meta Ads a su nombre). Eso es la línea "contenido/ads" congelada y cuesta horas de Sergio Urcullo por cliente (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §10).
- **Cómo se paga:** el mensaje lo paga el cliente directo a Meta (modelo elegido, `MEM/meta-whatsapp-clientes.md`). Onia no revende mensajes: eso exige ser Solution Partner.
- **Listo cuando:** una campaña de prueba sale, llega, y las citas que genera se atribuyen a ella en "Lo que ganó".
- **Depende de:** 1.1-C.

### 1.1-G · Versión para una empresa desde un archivo de configuración

- **Qué:** que el plan Empresa ("personalizado, por WhatsApp", decisión del 17-sep) se arme **encendiendo** módulos, vocabulario y agentes desde un archivo por org, no escribiendo código. La base ya existe en onia-core: `contract.json` y `business-tiers.json`, que tiene 6 tiers y cero callers fuera del core (`VI/2026-08-20-sintesis-lote-13.md` T7; skill `onia-core`).
- **Cuándo:** el mínimo (leer el archivo y encender módulos) cuando exista el primer cliente Empresa real. Lo demás es Etapa 2 (repetibilidad: "un cliente se da de alta y opera sin intervención").
- **Listo cuando:** una org nueva queda configurada desde el archivo sin tocar código, y el test lo prueba.

### Instrumentación mínima (acompaña a todo lo anterior)

Registrar dónde abandona una clínica: setup, primera cita y primer cobro. Con eso se prioriza por evidencia y no por gusto. Se guarda la lección y la métrica (`VI/2026-08-11-posthog-agentes-producto.md`, tabla `product_lessons`). No se instala PostHog: alcanza con eventos propios en la base.

---

## Qué NO entra en la 1.1

| Idea | Por qué no | Cuándo se reabre |
|---|---|---|
| **Llamadas de voz** (el bot atiende o llama) | No hay un solo cliente que lo haya pedido, trae costo por minuto y riesgo clínico, y no ayuda a cerrar los 5 | Con 5 clientes, si 2 o más lo piden |
| Rubros nuevos más allá de dental/estética | Etapa 1 = vender solo dental/estética (§7). Comercio se pule solo visualmente | Etapa 2 |
| Webs dentro de planes | Decisión pendiente del 17-sep; falla el test de tres preguntas (horas por cliente) | Cuando Sergio Urcullo decida |
| Manejo de Meta Ads para clientes | Es una línea congelada | No en esta etapa |
| App en tiendas y WhatsApp "Onia Avisos" | Decisión del 24-sep: primero push dentro de Onia; tiendas y número nuevo cuando haya clientes | Con clientes |
| Recharts, motion y otras dependencias nuevas | CSS y `Sparkline` alcanzan; toda instalación requiere aprobación | Si un gráfico real no se puede hacer sin ellas |
| Equipo, financiación, vendedor | Ya contestado y medido: NO (`H/CLAUDE.md` §1; §4-5 del doc de estrategia) | Etapa 4 |

## Dependencias (quién bloquea a quién)

```
1.1-A sistema visual ─┬─> 1.1-B lo que ganó + IA
                      ├─> 1.1-E medidores
                      └─> (todas las pantallas nuevas)
App Review Meta + pago ─> 1.1-C plantillas ─> 1.1-F campañas
motor bot :3020 ────────> 1.1-D agendar en el chat
primer cliente Empresa ─> 1.1-G configuración por archivo
```

## Lo que depende de Sergio Urcullo

1. El color del acento del panel y la tipografía única, que desbloquean 1.1-A.
2. Si el paquete pasa a S/M o sigue la escalera de 5 planes (1.1-E; el medidor sale igual).
3. Cómo se nombra a los agentes en la venta mientras 1.1-B no está vivo.
4. Grabar los screencasts del App Review de Meta: el primero sale de 1.1-C.
