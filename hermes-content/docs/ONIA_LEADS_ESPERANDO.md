# Los leads que están esperando — quiénes son y dónde viven

> **Doc vivo, sin fecha: se EDITA.** Es la lista real de las personas que contactaron a Onia
> por su cuenta y todavía no tienen respuesta.
>
> **Por qué existe este archivo.** `COLA.md` y `ONIA_DEFINICION_DE_TERMINADO.md` afirmaban,
> los dos, que estas personas estaban *"anotadas en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y
> en la cola del chatbot: no se pierden"*. **Era falso**: la §8 de ese archivo habla de una
> rama de git, y no hay cola del chatbot en el repo. Verificado el 2026-08-31 — la frase
> "7 personas" no aparecía en ningún otro archivo. La estrategia entera ("no se les escribe
> hasta terminar el producto") sólo es segura si los leads sobreviven a la espera; una nota
> que dice que están guardados y no lo están es peor que no tener la nota.

**Nadie de esta lista fue contactado.** Sergio decide cuándo y con qué mensaje.

---

## Dónde viven de verdad (sistemas de registro)

Este archivo es el índice, **no la fuente**. Los datos vivos están en dos bases de producción:

| Grupo | Sistema | Cómo se leen |
|---|---|---|
| Pedidos de acceso (`/register`) | `supabase-db` (VPS), tabla `public.access_requests` | Pantalla `/admin/solicitudes` (SUPERADMIN). Tiene marca de "contactado" |
| Quienes le escribieron al bot | Chatwoot del VPS, base `onia-chatbot` | **Hoy no hay pantalla**: los inboxes 4 y 5 no pertenecen a ninguna organización |

⚠️ **Los del bot no son visibles en `/inbox`.** Medido el 2026-08-31 en producción: la única
org con `clinic_settings.chatwootInboxId` es `zz-qa-clinica-chatbot-9k651` → inbox **7** (el de
QA). Los inboxes **4 (Onia Web)** y **5 (Onia WhatsApp)**, donde están *todos* los leads reales,
son huérfanos. Es el punto 1 de `ONIA_DEFINICION_DE_TERMINADO.md`, confirmado en vivo.

---

## 1. Pedidos de acceso — 3, ninguno contactado

Leídos de `access_requests` el 2026-08-31. `contactedAt` NULL en los tres.

| Fecha | Nombre | Negocio | Rubro | WhatsApp | Email | Ciudad |
|---|---|---|---|---|---|---|
| 21-ago | Maximo Romano | clinica klein | dental | +591 57400703 | maximoromano234@gmail.com | Santa Cruz |
| 23-ago | Leonardo Chuquimia | Clinica Leonardo | estética | +591 70077133 | leonardoventas07@gmail.com | Santa Cruz |
| 28-ago | EDWIN BENAVIDEZ AYALA | consultorio dental sonrisa feliz | dental | +59169016505 | soporte_cmf@hotmail.com | Santa Cruz |

Estos **no corren riesgo de perderse**: tienen tabla propia, pantalla propia y estado de
contactado. El de `clinica klein` es el primer registro real que recibió el sistema.

## 2. Escribieron al bot — 4, y a dos no les contestó nadie

Conversaciones de Chatwoot con mensaje entrante real (se excluyen las de prueba del inbox 3
"ONIA Demo", las del inbox 7 de QA, y las de Sergio).

| Conv | Fecha | Canal | Contacto | Qué dijo | Le respondieron |
|---|---|---|---|---|---|
| 35 | 25-ago | WhatsApp (inbox 5) | +59173232758 ("F") | **Clínica odontológica de 4 doctores** — 6 preguntas concretas, abajo | **NADA. Cero mensajes salientes** |
| 37 | 28-ago | WhatsApp (inbox 5) | +59173021804 ("mariohassen") | *"vengo de la web de Onia. Quiero saber si me sirve para mi negocio"* | **NADA. Cero mensajes salientes** |
| 36 | 27-ago | Widget web (inbox 4) | dejó `Saguilera@ds-santacruz.bo` **en el cuerpo del mensaje** | *"Quiero información"* + su correo | Sólo plantillas automáticas |
| 34 | 24-ago | Widget web (inbox 4) | anónimo, sin dato de contacto | *"hola"* | Sólo plantillas automáticas |

**Dos cosas que sólo se ven mirando la base:**

1. **A los dos de WhatsApp no les llegó ni una plantilla.** No es que la respuesta fuera mala:
   no hubo ninguna. El de 4 doctores lleva **6 días** de silencio.
2. **El correo del lead 36 vive dentro del texto del mensaje**, no en el campo `email` del
   contacto. Si nadie lee esa conversación, ese dato no existe en ningún lado.

### El lead calificado (conv 35) — sus 6 preguntas, textuales

Es el lead más calificado que recibió el sistema. No pide demo: pide capacidades concretas y
el costo total. Responderle exige responder esto, así que queda escrito acá.

> Estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores […] La
> función que más nos interesa es poder identificar pacientes que tienen un tratamiento
> pendiente pero que […] cancelaron una cita o dejaron de asistir y posteriormente no
> volvieron a programar.

1. ¿Puede generar una lista de pacientes con tratamiento pendiente y **sin próxima cita**?
2. ¿Esa lista se puede pedir por períodos (15 / 30 / 60+ días sin volver)?
3. ¿Genera **alerta o reporte semanal/mensual** automático para que la asistente haga seguimiento?
4. Si un paciente cancela y no reprograma, ¿el sistema **lo identifica solo**?
5. ¿Está en el plan normal o es un **módulo adicional**?
6. ¿Se puede **exportar a Excel/PDF**?

Cierra con: *"No estamos buscando todavía activar una cuenta […] Primero queremos confirmar si
el sistema tiene estas funciones y cuál sería el costo total para una clínica de 4 doctores."*

**Antes de contestarle hay que verificar en el producto, una por una, cuáles de las 6 son
ciertas hoy.** Contestar de memoria a este lead es exactamente la forma de quemarlo.

---

## 3. Borradores de respuesta (1-oct) — esperan el OK de Sergio Urcullo

> Escritos por Ventas y pauta el **2026-10-01**. **No se envió nada.** Cada uno sale solo con el OK de
> Sergio Urcullo sobre el texto y el canal. Van de usted y piden disculpas por la demora: llevan 33 a 41
> días sin respuesta, y fingir que no pasó el tiempo suena peor.

### 3.1 Conv 35 — «F», clínica de 4 doctores (WhatsApp +59173232758)

**La 1.0 está en producción:** `release-4dc829e8` la contiene (medido por `ONIA_CATALOGO_DE_VENTA.md` el
1-oct; `3d5f954` es ancestro de `4dc829e`). Las respuestas se verificaron **leyendo el código** de `onia-platform`
en `origin/master` (`a7f228c`, 1-oct), no en pantalla: antes de enviar, mirar en la cuenta propia que
`/pending` muestre el tratamiento a medias.

| Pregunta | Respuesta | De dónde sale |
|---|---|---|
| 1. Lista de tratamiento pendiente sin próxima cita | **Sí**, a los 21 días sin venir | `agents-tratamiento-a-medias.ts`: `EN_PROGRESO`, sin cita PENDIENTE/CONFIRMADA por delante, `TRATAMIENTO_A_MEDIAS_DIAS = 21`. Solo dental y estética |
| 2. Por períodos 15/30/60+ | **No.** Corte fijo de 21 días; la lista se ordena por días sin venir | misma función, `sort` por `diasSinVenir` |
| 3. Alerta o reporte semanal/mensual | **No es un reporte**: es la cola de `/pending` con el mensaje ya escrito, que un humano aprueba | `/pending`; el cron `onia-agents` |
| 4. Cancela y no reprograma: lo detecta solo | **Sí**: el Reprogramador lo propone dentro de los 14 días si no tiene otra cita | `agents-reprogramador.ts`: `CANCELADA` y `NO_ASISTIO`, `REPROGRAMAR_VENTANA_DIAS = 14` |
| 5. Plan o módulo adicional | **En el plan, desde Crece** | `plan-catalogo.ts`: `agentsIncluded: true` desde `crece` |
| 6. Excel/PDF | **CSV (abre en Excel), desde Básico; PDF no.** La lista de seguimiento se trabaja en pantalla, no se exporta | `csvExportEnabled` desde `basic`; `app/api/settings/export` |
| Costo para 4 doctores | 4 doctores + 1 asistente = 5 usuarios → **Profesional, Bs 890/mes**. Crece (Bs 550/mes) pasa a 4 usuarios con `a7f228c`, **que todavía no está en producción** (`release-4dc829e8` dice 3): no se cotiza Crece para 4 hasta que se publique | `subscription-plans.ts` `DEFAULT_PLAN_AMOUNTS` y `plan-catalogo.ts` en `a7f228c`. **El día del envío, re-leerlos**: la env var puede pisar el monto en producción |

Mensaje propuesto:

> Buen día, soy Sergio Urcullo, de Onia. El 25 de agosto nos preguntó por el seguimiento de pacientes con
> tratamiento pendiente y nadie le respondió: le pido disculpas. Le contesto sus seis preguntas.
>
> 1. Sí. Todos los días Onia arma la lista de pacientes con un tratamiento en curso que llevan tres semanas
>    sin venir y no tienen cita por delante, cada uno con su tratamiento y los días que lleva sin venir.
> 2. No por períodos a elección: el corte es a las tres semanas, y la lista se ordena por días sin venir,
>    así que primero aparece el que todavía está a tiempo.
> 3. No es un reporte semanal: es una lista diaria en la pantalla de Pendientes, con el mensaje para cada
>    paciente ya escrito. La asistente lo revisa y lo manda desde el WhatsApp de la clínica.
> 4. Sí. Si un paciente cancela o falta y no tiene otra cita, aparece para reprogramarlo.
> 5. Está incluido en el plan, no es un módulo aparte.
> 6. Pacientes y citas se exportan en CSV, que se abre en Excel. En PDF, no.
>
> Para los 4 doctores y una asistente, cada uno con su usuario, es el plan Profesional: Bs 890 al mes.
> Una condición: el sistema lo detecta con los tratamientos cargados en la ficha de cada paciente.
>
> ¿Le muestro cómo se ve en una llamada de 20 minutos, con una clínica de ejemplo?

### 3.2 Pedidos de acceso (WhatsApp de cada uno)

El alta está abierta desde el 29-ago: ya pueden crear la cuenta solos. Lo que se ofrece es la demo.

| Para | Mensaje propuesto |
|---|---|
| Maximo Romano · clinica klein · dental · +591 57400703 | Hola Maximo, soy Sergio Urcullo, de Onia. En agosto pidió acceso a Onia para la clínica Klein y nadie le respondió: le pido disculpas. ¿Sigue buscando ordenar la agenda de la clínica? Le muestro cómo funciona en una llamada de 20 minutos, con una clínica de ejemplo, y si le sirve le dejo la cuenta lista. ¿Le queda bien esta semana? |
| Leonardo Chuquimia · Clinica Leonardo · estética · +591 70077133 | Hola Leonardo, soy Sergio Urcullo, de Onia. En agosto pidió acceso a Onia para la Clínica Leonardo y nadie le respondió: le pido disculpas. ¿Sigue buscando ordenar las citas de la clínica? Le muestro cómo funciona en una llamada de 20 minutos, con un ejemplo de estética, y si le sirve le dejo la cuenta lista. ¿Le queda bien esta semana? |
| Edwin Benavidez Ayala · consultorio dental sonrisa feliz · dental · +591 69016505 | Hola Edwin, soy Sergio Urcullo, de Onia. En agosto pidió acceso a Onia para el consultorio Sonrisa Feliz y nadie le respondió: le pido disculpas. ¿Sigue buscando ordenar la agenda del consultorio? Le muestro cómo funciona en una llamada de 20 minutos, con un ejemplo dental, y si le sirve le dejo la cuenta lista. ¿Le queda bien esta semana? |

Antes de enviar: mirar en `/admin/solicitudes` (o en `organizations` por correo) si alguno **ya creó la
cuenta** después del 29-ago. Si la creó, el mensaje cambia: se le pregunta cómo le fue, no se le ofrece
acceso. Edwin dice «consultorio»: si atiende solo, le calza Básico, que no trae el seguimiento automático;
en la demo no se le muestra lo que su plan no incluye.

### 3.3 Escribieron al bot

| Para | Canal | Mensaje propuesto |
|---|---|---|
| Conv 37 · «mariohassen» · +59173021804 | WhatsApp | Hola, soy Sergio Urcullo, de Onia. Nos escribió el 28 de agosto desde la web y nadie le contestó: disculpe la demora. Para decirle si le sirve, ¿qué negocio tiene y cuántas personas trabajan con usted? Con eso le digo en dos líneas qué le resolvería Onia. |
| Conv 36 · `Saguilera@ds-santacruz.bo` | Correo · asunto: *La información que pidió de Onia* | Hola, soy Sergio Urcullo, de Onia. El 27 de agosto nos pidió información desde la web y no le respondimos a tiempo: disculpe. Onia es un sistema de gestión para negocios de Santa Cruz: agenda, fichas y cobros, y cada mañana le deja escrito el mensaje para la persona de mañana que no confirmó su cita. ¿Me cuenta qué tipo de negocio tiene? Con eso le muestro en 20 minutos lo que le sirve, con un ejemplo. |
| Conv 34 · anónimo, «hola» | — | Sin dato de contacto: no hay a quién escribirle |

Conv 36: si se confirma que es la Clínica Dental «DS» (hipótesis de `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.2),
el correo puede nombrar la clínica. Hasta confirmarlo, no.

---

## Cómo se vuelven a leer (reproducible)

```bash
# 1. Pedidos de acceso
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -x -c "SELECT name, \"businessName\", whatsapp, email, city, \"createdAt\", \"contactedAt\" FROM public.access_requests ORDER BY \"createdAt\";"'
```

```bash
# 2. Conversaciones del bot con mensaje entrante real
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i $(docker ps -qf name=chatwoot-db) psql -U postgres -d "onia-chatbot" -x -c "SELECT c.id, c.inbox_id, ct.name, ct.phone_number, c.created_at::date, count(m.id) FILTER (WHERE m.message_type=1) AS respuestas FROM conversations c JOIN contacts ct ON ct.id=c.contact_id LEFT JOIN messages m ON m.conversation_id=c.id GROUP BY 1,2,3,4,5 ORDER BY c.created_at;"'
```

## Lo que hace falta para poder contestarles

- **Punto 1 y 2 de `ONIA_DEFINICION_DE_TERMINADO.md`** (bandeja del cliente, y que el bot no
  prometa agendar si no agenda). Carril chatbot.
- **Que los inboxes 4 y 5 dejen de ser huérfanos**, o al menos que alguien lea esas
  conversaciones a mano hasta entonces. Mientras tanto, este archivo es la única copia legible
  de lo que dijeron.
