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
