# SendyPro — teardown desde la cuenta real de Sergio

> Mirado EN VIVO el 2026-08-30 (app.sendypro.com, cuenta activa de Sergio, plan Plata,
> línea "NUVO" +591 69902462 con WABA aprobado). Referente #3 del carril chatbot
> (con Lety y Dapta). Editar acá si Sendy cambia.

## Qué es

Plataforma boliviana/latam de **venta por WhatsApp para e-commerce**. Todo el producto
gira en UN loop: anuncio Click-to-WhatsApp → frase activadora → "Vendedor IA" del
embudo → cierra la venta (QR/transferencia) → mide compras contra lo que Meta atribuye
(CAPI). WhatsApp-only. Pricing por plan con LÍMITE de chats/día (15/150 visto) y
vencimiento (15 días restantes visibles — presión de renovación permanente).

## Su arquitectura visible

- **5 "agentes" por rol**: Vendedor, Operador, Analista, Marketero, Diseñador (IA por
  función, no por canal).
- **Vendedor IA por EMBUDO/producto**: cada producto tiene su vendedor con su frase
  activadora exacta ("Hola, quiero adquirir el Pack de Herrería…" — la frase que el
  anuncio precarga). Estados atendiendo/en descanso, categorías, pruebas A/B por
  vendedor, "Analizar".
- **⭐ "Entrena a Vendedor IA" (lo mejor del producto)**: el dueño EDITA EL BOT
  CONVERSANDO — escribe "cambiá el precio" / "agregá un método de pago" / "que recuerde
  a quien no responde" (+ chips de ideas rápidas, adjunta fotos/audios/docs) y la IA
  ajusta el guion. Al lado, el **guion actual en PASOS numerados legibles** (1. Saluda
  y presenta, 2. Pregunta cómo pagar, 3. QR o transferencia con INSISTENCIA programada
  "si no responde le insiste 3 veces: 20min / 1.7h / 3h", 4. Muestra el QR) + "Vista
  cliente" + botón "Guardar lo aprendido".
- **Súper Chat**: bandeja completa de tickets (equipo con colas y permisos).
- **CRM** con vistas, **kanban**, **tags**, **difusiones** (broadcast), **phrase lists**,
  **flow builders**, **lista negra global**, **plantillas API**.
- **Integraciones**: Google Sheets (cada nodo del flujo lee tu hoja), Shopify (catálogo),
  Meta CAPI (medición de ads), OrderyPro, Zentro. **IA**: OpenAI o Anthropic ("elige
  Haiku, Sonnet, Opus o Fable por nombre").
- **Gamificación**: ranking "TOP #476 Plata", liga de vendedores por ventas del mes,
  mentores/cursos de la comunidad.
- Footer con noticias del rubro + aviso del cobro por mensaje de WhatsApp (oct-2026).

## Sendy vs Onia — honesto

**Ellos ganan (hoy) en**: el loop de venta e-commerce puro — embudos por producto,
difusiones, CRM kanban, medición de anuncios, multi-vendedor A/B, edición conversacional
del guion. Es su ÚNICO producto y le llevan años.

**Nosotros ganamos en**: el bot vive DENTRO de un sistema real — agenda con citas de
verdad, clientes/pacientes, inventario, facturación (SIAT en camino), pagos QR del
banco, bandeja nativa, canal web propio (Sendy es WhatsApp-only), VISIÓN (el bot ve
fotos — ya vivo; no se lo vimos a Sendy), multi-rubro con plantillas y vocabulario,
guardrails deterministas (Sendy le fía el guion a la IA; nosotros validador
todo-o-nada + 6 reglas), sin límite artificial de chats, precio en Bs.

**Conclusión de posicionamiento**: NO competimos frontal en e-commerce puro. Sendy
vende un VENDEDOR; Onia vende el NEGOCIO ATENDIDO (recepcionista + sistema). El pitch
contra Sendy: "cuando el bot de Sendy vende, te anota en un CRM aparte; cuando el
nuestro atiende, la cita queda EN tu agenda y el cobro EN tu caja".

## Qué copiar (en orden)

1. **Editor conversacional del guion** ("enséñale conversando"): un chat en
   /settings/chatbot donde el dueño escribe "atendé también los domingos" y se traduce
   a un DIFF del doc (preview + Publicar; el validador todo-o-nada de siempre detrás —
   nuestra versión sería MÁS segura que la de Sendy). Mejora #1 de UX.
2. **Guion en pasos legibles** ("así atiende hoy tu asistente"): vista de solo-lectura
   que renderiza el doc publicado como pasos numerados — barata, gran efecto de
   confianza.
3. **Insistencia configurable por el dueño**: nuestros seguimientos/recordatorios ya
   existen como barridos — exponer cadencia y encendido en la UI.
4. **Frase activadora por anuncio** (embudo Click-to-WhatsApp): cuando encendamos Meta
   Ads; el motor de ads DRY ya existe en pausa.
5. **Límite de chats por plan como métrica visible** (no como freno): "chats
   automatizados hoy: N" en el dashboard — transparencia que Sendy usa bien.

## No copiar

- Gamificación/liga/mentores (es su comunidad, no nuestro producto).
- IA sin guardrails deterministas ("la IA ajustará el guion" a secas).
- WhatsApp-only.
