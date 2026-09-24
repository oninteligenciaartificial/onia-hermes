# El agente de cada negocio — diseño (fuente de verdad)

> Pedido de Sergio Urcullo, 24-sep-2026: *"que hiciera algo así como un agente de inteligencia
> artificial para que las empresas lo puedan usar. Algo así como un Hermes, pero mucho más fácil"*.
> Diseñado sobre una lectura del código (`onia-platform` master `a028d911`, `onia-hermes` main
> `61f5de6f`) y del VPS del 24-sep, tres enfoques independientes y dos jueces. Decisiones de Sergio
> Urcullo tomadas el mismo día, marcadas ✅.

## 1. Qué es y qué NO es

- **Es la evolución de lo que ya vendemos**: los 6 agentes incluidos desde el plan Crece, la barra
  «Preguntá por tu negocio» y el chatbot. Pasa el test de las tres preguntas
  (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §10): mismo cliente que paga · sin el sistema no tiene nada que
  proponer · se entrega sin horas de Sergio por cliente.
- **No es un producto aparte** ("un Hermes fácil para cualquier empresa"): ese marco falla las tres
  preguntas y sería la décima línea de negocio.
- **Regla dura: ninguna integración a medida por cliente.** La primera convierte esto en agencia.
- **Nombre:** ninguno nuevo y **nunca «Hermes»** (dos cosas con ese nombre ya nos hicieron
  diagnosticar mal). En el panel: «Agentes» y «Preguntá por tu negocio».

## 2. Decisiones

| # | Decisión | Estado |
|---|---|---|
| D1 | Los agentes usan un modelo de verdad | ✅ Sergio Urcullo, 24-sep |
| D2 | **Plantilla por negocio**: la IA escribe UNA vez, por negocio y por agente, una plantilla con `{nombre}` `{fecha}` `{hora}` `{monto}` en el tono del rubro; el dueño la aprueba una vez; el sistema la llena. **La IA nunca ve datos de clientes ni pacientes** | ✅ 24-sep (reemplaza la redacción mensaje por mensaje de `56752b95`) |
| D3 | **WhatsApp del dueño ya**: lo que hay que decidir le llega por WhatsApp y aprueba con `ok`/`no` | ✅ 24-sep |
| D4 | **Cupo de IA por plan**; al tope vuelve el texto fijo, el cliente nunca ve «sin crédito» | ✅ 24-sep |
| D5 | Desde qué número de WhatsApp le escribe Onia al dueño | ⏳ Pendiente (ver §7) |
| D6 | Modelo rápido de clasificación (Jev, TypeSafe AI) | Solo después de una prueba en español (ver §6) |

## 3. Piezas (todas dentro de la plataforma, nada instalado por cliente)

| Pieza | Qué hace | Reusa |
|---|---|---|
| **Lectores** | Consultan los datos del negocio con los permisos de quien pregunta y dicen de dónde sale cada número | Las 4 preguntas de la barra (deuda, cobrado hoy, agenda, stock bajo), aislamiento por `organizationId`, roles |
| **Decisor** | Decide a quién/cuándo proponer, con reglas fijas y sin IA | `lib/onia-core/modules/agents-runtime.ts` (queda como está) |
| **Portero** | Topes, prohibiciones, duplicados, y manda a aprobación. **Nuevo: respeta el permiso de aprobar** (existe en roles y hoy nadie lo verifica) y el dueño elige quién aprueba | `agents-config.ts`, `roles.ts`, cola de aprobaciones |
| **Redactor** (única pieza con IA) | Genera la plantilla del negocio para cada agente. Un control rechaza montos, precios, links o datos escritos por la IA; si falla, queda el texto fijo | LiteLLM con la clave `onia-platform-agentes` (US$5/30 d, solo gpt-4.1-mini) creada el 24-sep; cliente, validación y topes de `56752b95` |
| **Aprobación y envío** | El dueño ve el texto exacto, aprueba, sale una sola vez, queda registrado | `/pending`, `lib/onia-core/dispatch` |
| **Cupo de IA** | Cuenta las llamadas por negocio y mes según el plan | Mismo mecanismo que el cupo del chatbot, sin migración |
| **Vigía** | Si los agentes fallan o pasan 48 h sin correr: aviso en la pantalla de agentes y en Sentry (no en el Telegram saturado); un aviso al caer y otro al volver | `onia_agents_runs` |
| **Resumen** | «¿Qué hago hoy?»: 3 prioridades con link a donde se resuelve cada una (aprobaciones pendientes → agenda de hoy → deuda o stock). Si no hay nada, no se manda nada | Las 4 preguntas de la barra, `/pending`, vocabulario por rubro |
| **Canal del dueño** (D3) | Resumen diario por WhatsApp + `ok <n>` / `no <n>` + las 4 preguntas de datos | Ver §5 |

## 4. Qué puede hacer el agente

- **Leer** (con los permisos de quien pregunta): las 4 preguntas de datos (deuda y cobrado solo si esa
  persona puede ver finanzas), lo que encontró cada agente, pendientes, tareas, cupo de IA.
- **Hacer solo, dentro del sistema**: crear tareas y seguimientos de una lista cerrada; armar el resumen.
- **Hacer con aprobación**: mandar mensajes a clientes del negocio (WhatsApp o link wa.me), usar una
  plantilla nueva escrita por la IA (se aprueba una vez).
- **Nunca**: mover plata, pagar, borrar, cambiar configuración, precios o planes; leer datos clínicos;
  publicar lo que sabe el chatbot (solo proponerlo); tocar otro negocio; obedecer lo que diga el
  mensaje de un tercero.

**Memoria:** los datos del negocio son la memoria. Reglas fijas en el código; preferencias que elige
el dueño (tú/usted, quién aprueba, qué agentes); sin memoria de conversaciones (lo que va a la IA no
crece). Aprende sin IA: si el dueño rechaza 3 veces seguidas el mismo tipo de propuesta, el agente se
pausa y le pregunta.

## 5. WhatsApp del dueño (D3)

1. **Vincular**: en el panel, «Recibí tus pendientes por WhatsApp» muestra un código de un solo uso;
   el dueño lo manda al número de Onia y queda vinculado (teléfono ↔ usuario ↔ negocio). Solo roles
   que pueden aprobar.
2. **Resumen diario** a la hora que elige, por **plantilla aprobada por Meta** (categoría utilidad):
   las 3 prioridades y las propuestas numeradas. Si no hay nada, no se manda.
3. **Responde en la ventana de 24 h**: `ok 2` / `no 2`; enviar a un cliente pide confirmación
   («¿Confirmás enviar a Ana? SI»). Las preguntas de datos van por las 4 intenciones fijas: **ninguna
   cifra la escribe el modelo**.
4. **Ruteo seguro**: SOLO un teléfono vinculado y verificado entra en «modo dueño»; todo lo demás
   sigue en el bot de ventas. Un error de ruteo mandaría datos del negocio a un prospecto: allowlist
   explícita + tests que lo prueban.
5. **Costos**: plantilla de utilidad pagada después del 1-oct-2026 (fin de la ventana gratis); ~1 por
   dueño por día — cifra exacta a medir con la factura de Meta, no supuesta. **Requiere** el método
   de pago de Meta cargado antes del 1-oct.

## 6. Modelos

- **Redactar plantillas y razonar con criterio**: gpt-4.1-mini vía LiteLLM (US$0,000947 por llamada,
  medido en 30 días). Nada más chico que «mini» para juicio: el «nano» de Hermes inventó un límite que
  no existía.
- **Jev** (TypeSafe AI, 15-sep-2026): modelo de decisión, no genera texto; devuelve probabilidades
  para sí/no, opciones y puntajes en 70-500 ms a US$0,042/M tokens. Sirve para clasificar (intención
  del mensaje, lead caliente/frío, ¿este borrador promete un descuento?); **no** para redactar ni para
  montos/fechas. En acceso anticipado, sin español documentado. Entra solo si una prueba cerrada con
  ~200 mensajes reales anonimizados iguala o supera a gpt-4.1-mini en español.

## 7. Topes y costos (D4)

| Plan | Llamadas de IA por negocio y mes (propuesta) |
|---|---|
| Crece | 50 |
| Profesional (y el trial) | 150 |
| Completo / Empresa | 400 |

Con plantillas, un negocio usa ~10-20 llamadas al mes (US$0,01-0,02). Tope global: clave
`onia-platform-agentes`, US$5/30 d — se sube a medida que entran clientes. Al tope: texto fijo.
El saldo lo maneja Onia; el dueño nunca ve «créditos».

**Pendiente D5 — número del canal del dueño:** (a) el mismo número de Onia que usa el bot de ventas,
separando por teléfono vinculado; (b) un número nuevo dedicado (SIM + alta en Meta, acción de Sergio
Urcullo). El diseño recomienda (b): aísla el riesgo de ruteo y no mezcla prospectos con clientes.

## 8. Subproyectos, en orden

| # | Qué | Cuándo | Cómo se mide |
|---|---|---|---|
| 1 | **Correa**: permiso de aprobar respetado y elegible, vigía, «por qué» en cada propuesta | 1.0 | Test: sin permiso no aprueba · aviso del vigía mirado en pantalla · cada propuesta muestra regla y dato |
| 2 | **Redactor por plantilla** (D2) + cupo por plan (D4) | 1.0 | Gasto por negocio visible · plantillas aprobadas/rechazadas · alarma si cae al texto fijo por falla |
| 3 | **WhatsApp del dueño** (D3): vincular, resumen diario, `ok`/`no`, 4 preguntas | Ya (tras D5) | Tiempo entre propuesta y decisión · costo por plantilla medido |
| 4 | **«¿Qué hago hoy?»** en barra e inicio (comparte función con el resumen del #3) | Con el #3 | Aprobaciones decididas el mismo día |
| 5 | **Preguntas libres** («¿cuánto me debe Juan?»): la IA elige qué consultar, la cifra sale de la base; Jev si pasa la prueba | Con clientes | Baja de consultas de soporte por negocio |

**Ojo:** con datos de prueba los agentes corren y no proponen nada. Para medir si sirven hay que
sembrar una org `ZZ QA` con datos realistas (deudores, pacientes que no volvieron, stock bajo).

## 9. Qué copiamos de Hermes y qué evitamos

- **Copiar:** llega solo por el canal que el dueño usa · 3 prioridades o una decisión con fuente ·
  `ok`/`no` en el mismo chat · pocos trabajos útiles · gasto medido · fallas visibles.
- **Evitar:** que el dueño toque claves o archivos · fallas silenciosas (9 días caído por claves,
  8-11 días sin crédito, trabajos pausados solos al cambiar de modelo) · memoria sin tope o que la IA
  se reescribe (21 reglas quedaron en 11) · un solo proveedor sin respaldo (acá el respaldo es el
  texto fijo) · plantillas genéricas encendidas.
