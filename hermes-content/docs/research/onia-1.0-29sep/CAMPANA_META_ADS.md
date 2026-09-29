# Plan de campaña Meta Ads para Onia (para aprobar)

Para Sergio Urcullo. Fecha: 2026-09-29. Estado: **PLAN, nada creado ni publicado en Meta, cero gasto.**

Base: inventario de módulos (carriles clínico, comercio y transversal, con su verificación), `ONIA_ESTRATEGIA_DE_EMPRESA.md` (etapa 1 vigente), `ONIA_CLIENTE_IDEAL.md`, `ONIA_CATALOGO_DE_VENTA.md`, precios de `lib/subscription-plans.ts` y `lib/pricing.ts` (candidato `onia-platform-v1-integracion-20260927`), sección "Publicidad que no parezca hecha por IA" del CLAUDE.md, skills `carruseles-onia` y `ugc-empresas-higgsfield`, memorias de Meta Ads y leads, y lecturas en vivo de hoy (detalle en §6).

---

## 0. Resumen en 8 líneas

1. Se promociona **un solo rubro al arrancar: clínica dental de Santa Cruz con 2 a 6 profesionales y recepción** (etapa 1 + cliente ideal). Estética queda como segundo conjunto, que se enciende con condiciones. Comercio, importadora y servicios **no se pautan** (CLIENTE_IDEAL §6: "se atiende si llega, no se busca").
2. Destino: **WhatsApp de ventas de Onia (click-to-WhatsApp)**, no el registro web. El registro no tiene píxel, no guarda `?src=` y no le avisa a nadie cuando entra un alta.
3. El gancho que funciona HOY en producción, desde el día 1: **"el paciente de mañana que no confirmó"**. El Confirmador deja el mensaje escrito cada mañana y vos lo mandás desde tu WhatsApp. El dolor #1 ("tratamiento a medias") solo se pauta **después de publicar la 1.0**, y aparece recién **21 días** después de cargar el plan de tratamiento.
4. Presupuesto: **mínimo Bs 70/día (Bs 980 en 14 días)** o **recomendado Bs 140/día (Bs 1.960)**. Los costos por resultado son **estimados**: Meta no tiene historial de la cuenta ONIA Ads (gasto 0).
5. Se paga sola con **1 cliente en plan Crece (Bs 550/mes) en unos 2 a 4 meses**, o con 1 Profesional (Bs 890/mes) en unos 1 a 2 meses. La salida de la etapa 1 (Bs 3.750/mes) son unos 5 clientes.
6. Antes de encender hay **7 cosas bloqueantes** (§6). Tres son solo tuyas: método de pago en ONIA Ads, vincular página, IG y WhatsApp a la cuenta, y firmar la frase de campaña del bot.
7. Lo que el anuncio NO puede decir: factura electrónica, "envío automático por WhatsApp", "desde el primer día" para la reactivación, confirmación de citas en el panel, paquetes (estética), testimonios o cifras de resultados.
8. El conector de Meta Ads de Claude **no ve ONIA Ads** (está logueado como NUVO / Arthur Fuentes). La cuenta real sí responde en lectura desde el VPS: activa, USD, gasto 0, **sin método de pago, sin páginas vinculadas y con el píxel sin disparar nunca**.

---

## 1. Qué se promociona primero y a quién

### 1.1 La decisión y por qué

| Pregunta | Respuesta | Fuente |
|---|---|---|
| Etapa vigente | Etapa 1: "cerrar cinco clientes con la versión 1.0". Salida: Bs 3.750/mes cobrado | ESTRATEGIA §0.5, §7 |
| Rubro que se persigue | **Dental** (el único con recorrido real). Estética es "la misma venta con otro vocabulario" | CLIENTE_IDEAL §1, §6 |
| Rubros que NO se pautan | Comercio, importadora y servicios (se atienden si llegan). Veterinaria y ganadería no se ofrecen | CLIENTE_IDEAL §6; CATALOGO §2 |
| Cliente | Clínica de Santa Cruz, 2 a 6 profesionales, con recepción, con NIT, tratamientos de varias sesiones, agenda en cuaderno, Excel o WhatsApp | CLIENTE_IDEAL §2 |
| Plan que se ofrece | **Crece** (2-3 profesionales) o **Profesional** (4-5). Nunca Básico: sin agentes no ve el diferenciador | CLIENTE_IDEAL §2 |
| Precio que puede ir en el anuncio | Crece Bs 550/mes · Profesional Bs 890/mes · 14 días de prueba (con plan Profesional) | `subscription-plans.ts:40-41`; `lib/subscription/plan-state.ts:22,29` |

Además de lo que dice la estrategia, hay un motivo para no pautar los otros rubros: el inventario les encontró huecos que un prospecto ve en la primera semana. Servicios aterriza en el panel de mostrador y no puede editar un servicio; comercio no puede editar productos ni cargar stock a un producto existente; importadora tiene el "pedido" como callejón sin salida.

### 1.2 Qué se puede prometer HOY (producción c3b92067) y qué solo con la 1.0

La regla es simple: si el inventario lo marca roto o "solo 1.0", no entra al anuncio mientras la 1.0 no esté publicada.

| Promesa candidata (dental) | ¿En producción hoy? | Evidencia | ¿Va en el anuncio? |
|---|---|---|---|
| Cada mañana, el mensaje escrito para cada paciente de mañana que no confirmó; lo aprobás y lo mandás desde tu WhatsApp | Sí: agente Confirmador, `draft_message` que se aprueba en Pendientes | `git show c3b92067:lib/onia-core/modules/agents-runtime.ts:1422-1445`; rótulo `agents-rotulos.ts` "Confirmador — citas de mañana" | **Sí, gancho principal hoy** |
| Recordatorio por correo 24 h y 2 h antes, con botón para confirmar o cancelar | Sí, medido de punta a punta el 24-sep | CATALOGO §4.1; `app/cita/page.tsx` [T] | Sí, como apoyo |
| Agenda con horarios libres por profesional y link para que el paciente reserve solo | Sí (reserva pública incluida desde Crece) | e2e cinco-rubros [E]; `plan-catalogo.ts` crece `publicBookingIncluded: true` | Sí |
| Ficha + odontograma + recetas + cobros (nota de venta) | Sí | e2e [E] | Sí, como prueba visual |
| "Onia te lista los pacientes que no volvieron hace 6 meses" (Recall) | Existe, pero **solo cuenta visitas COMPLETADAS registradas en Onia** (`agents-logic.ts:437` `if (!r?.lastVisitAt) continue`). Con pacientes recién importados no propone nada durante 180 días | `agents-runtime.ts:424-455` | **No como gancho** (no rinde en la prueba ni en los primeros meses) |
| "El paciente con tratamiento a medias que no volvió" (dolor #1) | **Solo 1.0.** Además dispara a los **21 días** sin actividad desde la carga del tratamiento (`TRATAMIENTO_A_MEDIAS_DIAS = 21`), y la prueba dura 14 | `lib/onia-core/modules/agents-tratamiento-a-medias.ts:26` | **Solo después de publicar la 1.0**, y diciendo el mecanismo ("si pasan 3 semanas...") |
| Recordatorio automático por WhatsApp | No: ninguna org tiene credenciales propias; el envío es manual con `wa.me` | verif. clínico, error 1 | **No** |
| Confirmar la cita / marcar "No asistió" desde el panel | **No existe el botón** | `app/api/appointments/[id]/route.ts:18` sin UI | **No** |
| Factura electrónica SIAT | No (`SIAT_EMISSION` vacío; hoy sale "Nota de venta, sin valor fiscal") | CATALOGO §7 | **No** |
| Resultados, testimonios, "X clínicas usan Onia" | 0 clientes pagando | CATALOGO §7 | **Nunca** |

### 1.3 Estética: segundo conjunto, con condición

Se enciende solo si se cumplen las tres:

1. La 1.0 está publicada. La web de estética ya promete el tratamiento a medias (`switcher.tsx`) y producción no lo entrega.
2. La cuenta demo de estética tiene datos. Hoy nace vacía (`demo-provisioning.ts:87`, seed `null`).
3. Hay una respuesta preparada para "¿maneja paquetes o sesiones prepagadas?", porque no existe (inventario, gravedad alta).

---

## 2. Objetivo y destino

### 2.1 Comparación

| | A. WhatsApp de ventas de Onia (click-to-WhatsApp) | B. Registro web `app.onia.com.bo/register?plan=` |
|---|---|---|
| ¿Meta puede optimizar hoy? | **Sí.** La meta "conversaciones" la cuenta Meta sin píxel | **No.** El píxel ONIA Web `1012611478191231` nunca disparó (sin `last_fired_time`, leído hoy) y no hay `fbq` en la web ni en la app |
| Atribución | Por la frase precargada. Chatwoot descarta el `referral` de Meta (`chatwoot-adapter.mjs:129-133`), así que la frase lleva el código del anuncio | Ninguna: `SignupForm` no lee `?src=` (solo `AccessRequestForm.tsx:47`, que hoy no se muestra); queda el desplegable auto-declarado "¿Cómo nos conociste?" |
| Aviso a Sergio | Sí: handoffs y colgadas del bot llegan por Telegram | **No**: `register/route.ts` no avisa un alta nueva |
| Qué ve el prospecto | Conversación con el bot, que califica, y demo con Sergio usando datos de ejemplo | Una prueba vacía. Con datos propios, los agentes que venden (Recall y tratamiento a medias) no proponen nada durante la prueba de 14 días (ver 1.2) |
| Encaje con la etapa 1 | "Onboarding a mano" es lo correcto en etapa 1 (ESTRATEGIA §7) | Autoservicio: es la salida de la etapa 2 |
| Costo de Meta por mensajes | Los mensajes de la ventana de 72 h de un anuncio click-to-WhatsApp son gratis | n/a |

**Decisión recomendada: A (WhatsApp) en esta fase.** B queda para cuando existan píxel, `?src=` y el aviso de alta (§2.3).

### 2.2 Qué hay que arreglar antes de A

1. **Frase de campaña en el bot.** El conocimiento admite **máximo 10 campañas** (`knowledge.mjs:158-160`, `maxItems: 10`) y hay **9 usadas** (`knowledge.onia.json` v2026-09-25.1). Queda **un solo lugar**, así que se usa **una frase-prefijo** para todos los anuncios (`prefijo: true`, soportado en `recepcionista.mjs:139`):
   - Frase: `Hola, vi el anuncio de Onia` (con `prefijo: true`).
   - Cada anuncio precarga: `Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.` El código D1, D2... queda en el texto de la conversación y es la atribución, que se busca en Chatwoot. `fraseCanonica` quita la puntuación y el prefijo sigue coincidiendo.
   - Respuesta propuesta (menos de 500 caracteres, sin precio ni duración de la demo; hay un test que vigila la duración): *"¡Hola! Soy el asistente automático de Onia. Para mostrarte lo que te sirve necesito dos datos: ¿cuántos profesionales atienden en tu clínica y quién agenda las citas hoy (recepción, vos, WhatsApp, cuaderno)? Con eso te digo qué plan te corresponde y te coordino una demo corta con Sergio, con una clínica de ejemplo cargada."*
   - Es una fuente con firma humana (`publicar-solo.sh` FIRMA_HUMANA): **la publicás vos** (o desde `/settings/chatbot` de onia-interna). Después se prueba mandando el texto exacto desde un teléfono que no sea el de Onia **y se mira la respuesta**, no el log.
2. **Número de WhatsApp de ventas vinculado a la página de Facebook de Onia**, para que el anuncio pueda abrir WhatsApp. **?** No se pudo leer por API: el token no tiene `pages_read_engagement` (error #100 hoy). Lo verificás en Business Settings.
3. **Método de pago en la WABA de Onia antes del 1-oct.** Desde esa fecha, pasados los 1.000 mensajes de servicio gratis del mes, Meta corta la entrega si no hay método de pago (memoria `meta-whatsapp-clientes`). Con pauta chica no se llega, pero es gratis dejarlo cargado.
4. **Demo dental que muestre el agente que se anuncia.** El seed dental (`lib/onia-core/demo-seed.ts:150-200`) trae un paciente frío de 220 días (Recall) y una factura vencida (Cobrador), pero **ninguna cita PENDIENTE para mañana** que dispare al Confirmador ni un tratamiento EN_PROGRESO de más de 21 días. Hay que verificar qué muestra `/pending` en una demo nueva y, si falta, pedir al carril de producto que sume esas dos filas. Es trabajo de otro carril: acá queda anotado, no se hace.
5. **Prueba más larga para leads de pauta** (solo cuando se anuncie el tratamiento a medias). Con 14 días de prueba y 21 días de umbral, el cliente nunca ve el aviso dentro de la prueba. Hoy se puede resolver sin código: `/admin/plans` → Editar → "días de prueba" (inventario transversal, [T]).

### 2.3 Para pasar a B más adelante (no bloquea A)

- Píxel `1012611478191231` en `onia.com.bo` y en `app.onia.com.bo/register`, con evento `CompleteRegistration` (ideal: más CAPI, que hoy no tiene token porque falta el correo del negocio en Info del negocio).
- `SignupForm` que lea `?src=`/`utm_*` y lo guarde (el esquema ya tiene `src` en `access_requests` y `discoverySource` en la org; `prisma/schema.prisma:25,2186`).
- Aviso por Telegram de alta nueva (hoy no existe; inventario transversal, faltante "alta").
- Que los 9 CTA de la home propaguen `?src=` (memoria `meta-ads-engine`, 17-sep).

---

## 3. Estructura

### 3.1 Campaña

| Campo | Valor propuesto |
|---|---|
| Cuenta | ONIA Ads `act_1073680778314945` (USD, America/La_Paz) |
| Página | Onia (`1140384625819526`) + Instagram de Onia (`17841423363059652`) |
| Objetivo | Clientes potenciales (Leads) con ubicación de conversión "Apps de mensajes → WhatsApp" y meta "maximizar conversaciones". Si la cuenta no ofrece esa combinación, Interacción → WhatsApp. **Confirmarlo en la interfaz al crear**, no lo verifiqué |
| Presupuesto | Del conjunto (ABO): hay un solo conjunto activo al inicio y así no se reparte |
| Estado al crearse | **PAUSADA** hasta tu OK explícito |
| Nombre | `ONIA-ETAPA1-DENTAL-SCZ-WA-2026-10` |

### 3.2 Conjuntos (un rubro por conjunto)

| | A. Dental (activo desde el día 1) | B. Estética (con condición, §1.3) |
|---|---|---|
| Zona | Santa Cruz de la Sierra + 20 km (personas que viven ahí) | Igual |
| Edad | 27-60 | 25-55 |
| Idioma | Español | Español |
| Intereses (**verificar que existan** en el buscador de Meta; no los inventé) | Odontología, clínica dental, ortodoncia, implantes dentales, "propietario de pequeña empresa" si aparece | Estética, medicina estética, cosmetología, spa, "propietario de pequeña empresa" |
| Público Advantage+ | Encendido si Meta lo impone. El anuncio hace el filtro con "si tu clínica tiene 2 o más profesionales..." | Igual |
| Ubicaciones | Feed y Reels de Instagram y Facebook, Stories. **Excluir Audience Network** (clics de baja calidad) | Igual |
| Públicos propios (desde el día 7) | Retargeting: quienes vieron el 50 % de un video o interactuaron con la página o el IG en 30 días. Semejantes: no, con 0 clientes no hay semilla | Igual |
| Horario | Siempre encendido (con presupuesto diario Meta no permite horario). Si querés cortar la madrugada, usar presupuesto total de 14 días con programación 07:00-21:00 | Igual |

Tamaño del público: **?** Se mide con el estimador de Meta al armar el conjunto. Es chico por naturaleza (dueños de clínica en una ciudad): hay que vigilar la frecuencia (§5).

### 3.3 Anuncios

Reglas para todas las piezas (CLAUDE.md "Publicidad que no parezca hecha por IA" + skills):
- Dolor exacto del rubro → consecuencia en plata → mecanismo con **pantalla real** → un solo CTA.
- Capturas **de la cuenta demo, sin datos personales**, y de la versión que esté en producción el día que corre el anuncio.
- Nunca UI generada con IA.
- Pack visual `community-editorial` (portada humana, interiores claros, verde solo de acento, sin pill "ONIA" arriba, footer `@oniahq`).
- Números: solo precios de la fuente. La consecuencia económica se la hace calcular al lector con **sus** números; no se inventan cifras.
- CTA único: **"Enviar mensaje"** (WhatsApp) con el texto precargado del código.

#### A. Dental. Cuatro ideas; D1 a D3 sirven HOY, D4 solo con la 1.0

**D1: "Los de mañana" (carrusel 7 láminas, 1080×1350). Válido hoy.**
- Texto precargado: `Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.`
- Láminas:
  1. Portada (foto humana real de una recepción, no generada): "Son las 18:00 y tu recepcionista todavía está llamando a los pacientes de mañana."
  2. Plata: "Cada silla vacía de mañana es una hora que tu doctor cobra en cero. Contá cuántas tuviste este mes."
  3. Causa: "Nadie confirma porque confirmar es llamar uno por uno."
  4. Producto real: captura de **Agenda de hoy** (`/agenda`).
  5. Mecanismo: captura de **Pendientes** con la propuesta del Confirmador y el botón "Enviar yo mismo por WhatsApp". Texto: "Cada mañana Onia te deja escrito el mensaje para cada paciente de mañana que no confirmó."
  6. Control humano: "Nada sale sin tu OK. Lo aprobás y lo mandás desde tu WhatsApp, con un toque." Apoyo: captura del correo de recordatorio de 24 h con "Confirmar / Cancelar".
  7. Oferta y CTA: "Para clínicas con 2 o más profesionales. Plan Crece Bs 550/mes · 14 días de prueba. Escribinos y te lo mostramos con una clínica de ejemplo."
- Texto principal: "Si tu clínica tiene 2 o más doctores y la agenda vive en la cabeza de la recepcionista, esto es para vos. Onia revisa la agenda cada mañana y te deja escrito el recordatorio para cada paciente de mañana que no confirmó. Vos lo aprobás. Plan Crece desde Bs 550/mes."
- Título: "El mensaje de mañana, ya escrito."

**D2: "Reservá sin llamarme" (video de pantalla de 20-25 s, 9:16, voz en off y subtítulos quemados, hecho con HyperFrames: costo 0). Válido hoy.**
- Texto precargado: `Hola, vi el anuncio de Onia (D2). Tengo una clínica dental.`
- Guion por tiempos:
  - 0-2 s, texto: "¿Cuántas veces por día te escriben '¿tenés turno el jueves?'"
  - 2-6 s, voz: "Cada consulta por WhatsApp es tu recepcionista parando lo que hace."
  - 6-14 s, pantalla real de `/book/<demo>`: elegir profesional, día y horario libre. Voz: "Con Onia le mandás un link: el paciente elige profesional, día y hora, solo con los horarios que de verdad tenés libres."
  - 14-19 s, pantalla real de la cita en `/appointments` y del correo de 24 h. Voz: "La cita cae en tu agenda y el recordatorio sale por correo un día y dos horas antes."
  - 19-23 s, voz: "Incluido desde el plan Crece. Escribinos y te lo mostramos."
  - Cierre: botón "Enviar mensaje".
- Ojo: la cita reservada nace PENDIENTE y en el panel no hay botón "Confirmar". No se dice "confirmada automáticamente".

**D3: "Lo que te deben" (estático o carrusel de 4 láminas). Válido hoy, secundario.**
- Texto precargado: `Hola, vi el anuncio de Onia (D3). Tengo una clínica dental.`
- Dolor: "Tratamientos cobrados en cuotas que nadie reclama porque da vergüenza escribir."
- Mecanismo real: Cobrador → borrador de recordatorio en Pendientes (captura) y "Cobros" con el saldo vencido (captura de `/billing`).
- No decir "factura": decir "cobros vencidos" (hoy es nota de venta sin valor fiscal).

**D4: "El tratamiento a medias" (carrusel de 8 láminas + versión UGC IA opcional). SOLO después de publicar la 1.0.**
- Texto precargado: `Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.`
- Láminas:
  1. Hook: "¿Cuántos pacientes empezaron una endodoncia en tu clínica y no volvieron?"
  2. Plata: "Contalos. Multiplicá por lo que te falta cobrar de cada tratamiento. Esa plata está sentada en tu agenda."
  3. Causa: "Nadie lo ve porque el paciente no canceló: simplemente no volvió a pedir cita."
  4. Captura real del **Plan de tratamiento** en la ficha.
  5. Mecanismo: "Si pasan 3 semanas sin que vuelva, Onia te lo marca y te deja el mensaje escrito con tu link de reserva" (captura de Pendientes con la propuesta).
  6. Control humano: "Vos lo aprobás. Nada sale solo."
  7. Para quién: "Clínicas con 2 a 6 profesionales y recepción."
  8. Oferta y CTA.
- Es la frase textual del lead calificado del 25-ago (CLIENTE_IDEAL §3), el mejor ancla que existe. Por eso vale esperar a la 1.0 para usarla.
- Versión UGC IA (solo si la pedís): presentador IA **original**, rol "te muestro", nunca dentista ni cliente; 25-30 s con al menos 8 s de UI real compuesta en posproducción; subtítulos; un CTA. Costo de Higgsfield consultado en vivo con `higgsfield generate cost` y aprobado pieza por pieza antes de generar.

#### B. Estética. Tres ideas; se preparan y no salen hasta cumplir §1.3

- **E1 "La clienta que dejó la serie a medias"** (1.0): la sesión 3 de 6 que nunca se agendó. Mecanismo: plan de tratamiento + aviso a las 3 semanas + mensaje con link. Precargado `(E1)`.
- **E2 "Tu agenda abierta a las 23:00"**: link de reserva (`/book`) para que la clienta reserve de noche sin escribir. Precargado `(E2)`.
- **E3 "Las de mañana"**: la versión estética de D1 (Confirmador). Precargado `(E3)`.
- Prohibido en estética: fotos de antes y después, cuerpos o caras "mejoradas". Es B2B: se muestra la agenda, no el tratamiento.

#### Orden de producción (todo gratis salvo UGC IA)

D1 (carrusel, `node scripts/carousel_render.js`) → D2 (HyperFrames) → D3 → D4 y E1-E3 cuando se cumplan sus condiciones. Cada pieza pasa el checklist de `carruseles-onia` y se muestra renderizada antes de subir.

---

## 4. Presupuesto

### 4.1 Escenarios (tipo de cambio de referencia Bs 11,37 por USD, `lib/pricing.ts:31`)

| Escenario | Por día | 14 días | En USD (cuenta en USD) |
|---|---|---|---|
| Mínimo | Bs 70 | **Bs 980** | ~USD 6,2/día · ~USD 86 total |
| Recomendado | Bs 140 | **Bs 1.960** | ~USD 12,3/día · ~USD 172 total |

El mínimo diario de la cuenta es USD 1 (`min_daily_budget: 100` centavos, leído hoy). Los dos escenarios lo superan. Los montos Bs 70 y Bs 140 coinciden con los escalones "standard/push" que ya estaban en el motor (`bolivia.js`, memoria `meta-ads-engine`).

### 4.2 Qué se puede esperar (TODO ESTIMADO, la cuenta no tiene historial)

Supuestos, con su origen:
- **Costo por conversación iniciada: Bs 8 a 20.** Estimado. Referencias genéricas (mayormente B2C): conversaciones de mensajes en LATAM USD 0,30-1,50 (≈ Bs 3,4-17), y Bs 1,00-3,50 por conversación en Bolivia antes de julio de 2025. Se sube el rango porque el público B2B de nicho es chico y caro. Fuentes al final.
- **Conversaciones que califican** (2-6 profesionales + recepción): **15 %**. Estimado; no hay datos propios.
- **Calificados que toman la demo: 50 %. Demos que cierran: 20 %.** Estimados.

| | Mínimo (Bs 980) | Recomendado (Bs 1.960) |
|---|---|---|
| Conversaciones | 49 a 122 | 98 a 245 |
| Calificadas (15 %) | 7 a 18 | 15 a 37 |
| Demos (50 %) | 4 a 9 | 7 a 18 |
| Clientes (20 %) | **0 a 2** | **1 a 4** |

El rango es ancho a propósito: con cero datos, cualquier número más preciso sería inventado. La primera semana reemplaza estos supuestos por datos reales (§5).

### 4.3 Cuántos clientes hacen falta para que se pague (precios reales)

| Plan | Mensual | Meses para recuperar Bs 980 | Meses para recuperar Bs 1.960 |
|---|---|---|---|
| Crece | Bs 550 | 1,8 | 3,6 |
| Profesional | Bs 890 | 1,1 | 2,2 |
| Crece + Profesional | Bs 1.440 | 0,7 | 1,4 |

- El margen bruto del producto es 94-99,8 % (ESTRATEGIA §0.6), así que el ingreso es prácticamente ganancia contra la pauta.
- **Tope de costo por cliente (CAC) propuesto: Bs 1.650** (3 meses de Crece). Con un cierre del 20 % de los calificados, eso da un **tope de ~Bs 330 por prospecto calificado**. Se corta antes, en Bs 250 (§5).
- La salida de la etapa 1 (Bs 3.750/mes) son, por ejemplo, 3 Profesional + 2 Crece (Bs 3.770) o 7 Crece (Bs 3.850).
- La renovación al mes 2 no se conoce (0 clientes). Hasta medirla, ningún cálculo supone más de 3 meses de vida.

---

## 5. Qué se mide cada semana y cuándo cortar o escalar

### 5.1 Tablero semanal (lunes)

| Métrica | De dónde sale |
|---|---|
| Gasto, CPM, CTR del enlace, frecuencia | Insights de Meta (Graph API desde el VPS, o el conector si se reconecta; §6) |
| Costo por conversación iniciada, por anuncio (D1, D2...) | Insights de Meta |
| Conversaciones con el código del anuncio | Chatwoot inbox 5: búsqueda "vi el anuncio de Onia" |
| **Calificados** (2-6 profesionales + recepción) | Etiqueta `calificado` que pone Sergio en Chatwoot. Es la métrica que manda |
| Demos agendadas y hechas | Cal.com (el link que use el bot) |
| Altas y rubro de cada alta | `/admin/metricas` (altas por mes) |
| Pagos aprobados | `subscription_payments` en `APPROVED` (CLIENTE_IDEAL §10) |
| Tiempo de respuesta de Sergio al handoff | Avisos de Telegram frente a la primera respuesta humana en Chatwoot |

### 5.2 Reglas de corte y escalado (umbrales estimados; se recalibran con la semana 1)

| Cuándo | Condición | Acción |
|---|---|---|
| Día 3-4 | Un anuncio gastó Bs 150 o más y su CTR de enlace es menor a 0,8 %, o su costo por conversación supera Bs 25 | Pausar ese anuncio y dejar los otros |
| Semana 1 | 20 conversaciones o más y **0 calificados** | **No subir presupuesto.** Reescribir el filtro del copy ("2 o más profesionales") o los intereses |
| Cualquier día | Frecuencia a 7 días mayor a 3,5 | Rotar la pieza (el público es chico) |
| Cualquier día | Un lead espera más de 4 h hábiles sin respuesta humana | Bajar el presupuesto hasta ponerse al día. Pagar por leads que nadie atiende es quemar plata |
| Día 14 | Costo por calificado mayor a Bs 250 y 0 demos | Cortar y revisar mensaje o público antes de gastar más |
| Día 14 | 1 pago o más, o 3 demos o más con prospectos calificados | Seguir 14 días más y subir 20-30 % cada 3-4 días mientras el costo por calificado quede bajo Bs 250 |
| Con la 1.0 publicada | D1 o D2 funcionan | Sumar D4. Encender estética (B) si se cumplen las condiciones de §1.3 |

---

## 6. Lo que tenés que hacer o aprobar, y lo que Claude puede hacer después

### 6.1 Estado medido hoy (solo lectura)

- **Conector de Meta Ads de Claude** (`ads_get_ad_accounts`, `ads_get_user_pages`): ve **solo "NUVO 1usd" (business NUVO) y "Arthur Fuentes" (BOB)**, y la página "NUVO". **ONIA Ads no aparece.** No se usa ninguna de esas dos cuentas (no son de Onia y Arthur ya no colabora). Tampoco se corrió `ads_insights_industry_benchmark`: exige una cuenta visible, y compararse contra cuentas de terceros no sirve.
- **ONIA Ads, leída desde el VPS con el token de System User (sin imprimirlo):**
  - `act_1073680778314945` "ONIA Ads": `account_status 1` (activa), USD, America/La_Paz, `amount_spent 0`.
  - **Sin `funding_source_details`**: no hay método de pago.
  - `promote_pages`: **vacío**.
  - `campaigns` (activas y pausadas): **vacío** (la campaña 1 quedó archivada el 1-sep, memoria).
  - Píxel "ONIA Web" `1012611478191231`: existe, **sin `last_fired_time`** (nunca disparó).
  - Business `1451773736711697` "OniaAgency": **`verification_status: verified`**.
- WhatsApp vinculado a la página y datos de la página: **?** (el token no tiene permiso de páginas).

### 6.2 Lo que es tuyo (Sergio Urcullo)

| # | Qué | Por qué es tuyo |
|---|---|---|
| 1 | Cargar método de pago en ONIA Ads. **La cuenta cobra en USD**: verificá con tu banco que la tarjeta acepte cargos internacionales en USD y su límite (**?** no lo sé) | Plata y datos de tarjeta |
| 2 | Vincular la página Onia y el Instagram de Onia a ONIA Ads, y el número de WhatsApp de ventas a la página | Acceso a Business Settings con tu sesión (Brave, según la memoria) |
| 3 | Cargar método de pago en la WABA de Onia antes del 1-oct | Plata |
| 4 | Aprobar y publicar la frase-prefijo del bot (§2.2.1) | Fuente con firma humana |
| 5 | Aprobar cada pieza (D1-D4, E1-E3) **vista renderizada** | "Construir y publicar son dos permisos distintos" |
| 6 | Aprobar el gasto: escenario (mínimo o recomendado) y fecha de inicio | Gasto |
| 7 | Decidir si D4 y estética esperan a la 1.0 (recomendado) y dar el OK de publicar la 1.0 | Decisión de producto |
| 8 | Comprometer tiempo de respuesta a los handoffs (4 h hábiles como máximo) y a las demos | Sos el único que vende |
| 9 | **Antes de pagar por leads nuevos, contestar a los que llegaron solos** (CLIENTE_IDEAL §3: 3 registros + la clínica de 4 doctores, "ninguno fue contactado"; **verificar si eso sigue así**) | Es el lead más barato que existe |
| 10 | Si querés que Claude opere la cuenta desde el chat: reconectar el conector de Meta Ads de claude.ai con el usuario de Meta que administra OniaAgency | Es tu login |

### 6.3 Lo que Claude puede hacer después (siempre en PAUSA y sin gastar)

- Armar las piezas gratis: carruseles con `carousel_render.js` y videos de pantalla con HyperFrames, sobre capturas de la cuenta demo. Revisar que no haya datos personales y mostrarlas renderizadas.
- Redactar la frase y la respuesta del bot, y probarla con `step()` del motor antes de que la publiques.
- Crear campaña, conjunto y anuncios **en estado PAUSED**, por dos caminos:
  - el motor del VPS `/opt/onia/meta-ads/`, que es DRY por defecto y activa solo con `live:true` + tu aprobación;
  - el conector de claude.ai, si lo reconectás a la cuenta correcta.
- Leer insights a diario y armar el tablero de §5.1: Meta (lectura) + Chatwoot + `/admin/metricas` + `subscription_payments`.
- Proponer cortes y escalados según §5.2. **Activar, subir presupuesto o encender un anuncio: siempre con tu OK explícito en ese momento.**
- Lo que no puede hacer: cargar la tarjeta, poner códigos de verificación, aprobar gasto, publicar piezas sin tu "Apruebo publicar <pieza>".

---

## 7. Riesgos

| Riesgo | Qué lo dispara | Cómo se evita |
|---|---|---|
| **Política de Meta: atributos personales y salud** | Copys como "¿Tenés caries?" o hablarle al lector como paciente | Se le habla al **dueño de la clínica** sobre su agenda, nunca al lector sobre su salud. "Si tu clínica tiene 2 o más doctores" está bien; "¿Sufrís de...?" no |
| Política de Meta: antes y después | Estética con fotos de resultados | Prohibido en estas piezas; se muestra la agenda, no el cuerpo |
| **Datos de pacientes en capturas** | Usar una cuenta con datos reales | Solo cuenta demo, revisada captura por captura. El producto guarda datos de salud: un nombre real en un anuncio es un incidente |
| **Promesa que el producto no cumple** | Decir "automático por WhatsApp", "desde el primer día", "confirmación en el panel", "factura", "paquetes" | Tabla §1.2. El prospecto de pauta ve la demo: si el anuncio exagera, se cae ahí, y encima quema confianza |
| **La prueba no muestra el valor** | Alta con datos propios: Recall necesita 180 días de historial en Onia y el tratamiento a medias 21 días, mientras la prueba dura 14 | Destino WhatsApp → demo con datos de ejemplo. Extender la prueba a mano en `/admin/plans` para leads de pauta. Pedir al carril de producto que el demo seed dispare Confirmador y tratamiento a medias |
| **"Hecho con IA"** | UGC con presentador IA o imágenes generadas | Presentador IA solo como explicador, declarado (etiqueta de IA de Meta, sin esconderlo); nunca finge ser dentista, clienta ni testimonio. UI siempre real. Tampoco se vende "con IA" como gancho: los agentes deciden por reglas y la IA solo redacta la plantilla a pedido (`agents-plantilla.ts`); el conocimiento del bot del cliente responde sin LLM (`recepcionista.mjs:19`) |
| Atribución ciega | Alguien borra el código precargado antes de enviar | Aceptarlo. Si llega "Hola" sin código y dentro de la campaña, se cuenta como "pauta probable". Recién la fase B (píxel + `?src=`) lo cierra |
| Leads sin atender | Sergio sin tiempo | Regla de §5.2: se baja presupuesto antes de dejar leads esperando. El techo del negocio son horas de soporte (ESTRATEGIA §9) |
| Web desalineada | Un prospecto entra a onia.com.bo/rubros y lee la promesa de estética (tratamiento a medias), que producción no entrega | El anuncio no lleva a la web. Se corrige la web o se publica la 1.0 antes de encender estética |
| Pago en USD desde Bolivia | Límites y comisiones de tarjetas para cargos internacionales | Verificar con el banco antes de encender (**?**) |
| Cuenta nueva sin historial | Revisión de anuncios lenta, aprendizaje con pocos resultados | Arrancar con 1 conjunto y 2-3 anuncios, no fragmentar. Esperar al día 3-4 antes de juzgar |
| Mezcla de ventas en el mismo WhatsApp | Leads de webs y de la plataforma en el mismo bot (memoria `web-lead-bot...`) | La frase-prefijo separa los de la pauta. No pautar webs (falla el test de tres preguntas, CLIENTE_IDEAL §5) |

---

### Fuentes externas de los costos estimados (§4.2)

- [Costo de Facebook Ads en Bolivia: guía completa 2025 (rikcarez.com)](https://rikcarez.com/costo-facebook-ads-bolivia-guia-completa/)
- [How Much Do Facebook Ads Cost in 2026? (stackmatix.com)](https://www.stackmatix.com/blog/facebook-ads-cost-complete-guide)
- [Click-to-WhatsApp Ads Benchmarks 2026 (getkanal.com)](https://getkanal.com/blog/click-to-whatsapp-ads-benchmarks-2026)
- [Facebook Ads CPM by Country 2026 (lebesgue.io)](https://lebesgue.io/facebook-ads/facebook-cpm-by-country)
- [Precios de la plataforma de WhatsApp Business (Meta, developers)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/?locale=es_LA)

Todas son promedios genéricos, mayormente de consumo, y no de Bolivia B2B. Por eso cada número de §4.2 dice "estimado".
