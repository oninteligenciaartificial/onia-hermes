# Handoff — carril `chatbot`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23.
>
> ⚠️ **Procedencia.** Esto NO lo ejecutó el carril del chatbot. Lo encontró y lo arregló a
> medias el carril de contenido (`claude/ads-creatividades-publicos`) mientras intentaba
> filmar una demo real del producto; aplicó **sólo el fix mínimo** y paró para no chocar
> carriles. Se transcribe acá para que no se pierda. **Nada de lo de abajo fue re-verificado
> por quien escribe este archivo** — está marcado qué se midió y qué no.
>
> **Infra = UN dueño a la vez** (`CLAUDE.md` §4). Antes de tocar Chatwoot o el VPS,
> asegurarse de que ningún otro carril esté adentro.

---

**Objetivo**

Que el bot público de `onia.com.bo` conteste, y que el widget deje de decirle a cada
visitante que no hay nadie. *Hecho* = abrir el widget en el sitio, mandar dos mensajes y
**VER la respuesta en pantalla** (no en la base), sin cartel de ausencia.

---

**Qué quedó EN PRODUCCIÓN**

**El widget público NUNCA le respondió a nadie**, desde siempre.

- **Causa raíz medida:** el usuario bot (`users.id=3`, `business+bot@onia.com.bo`) **no era
  miembro del inbox 4** ("Onia Web", `website_token 9k5i7xnAgCbSse1EZwVChZLw`). Sí lo era de
  los inboxes 5, 6 y 7. Sin membresía, Chatwoot rechaza el POST del motor.
- **Por qué era invisible:** el adapter marca el mensaje como `sent` igual — su warning no se
  persiste. El fallo no dejaba rastro en ningún lado.
- **Evidencia:** mensajes por inbox → **inbox 4 = 3 entrantes / 0 salientes**; inbox 6 = 25/43;
  inbox 7 = 4/6. Chatwoot SÍ entregaba (`WebhookJob` "Performed" sin errores hacia
  `http://onia-center:3020/webhook/chatwoot/<secret>`, algunos de 5 s = el motor trabajando).
  El motor SÍ funciona: mensaje `id=154` (conversación 30, inbox 6, `message_type=1`,
  sender User 3) es una respuesta real generada.

**FIX APLICADO** (única escritura hecha):

```sql
insert into inbox_members (user_id, inbox_id, created_at, updated_at)
values (3, 4, now(), now());   -- → fila id 9
```

**Verificado:** el usuario bot ahora postea en la conversación 31 del inbox 4 con **HTTP 200**
— ese POST era exactamente lo que fallaba antes. Mensaje de prueba `id=160` creado y borrado.

**Rollback:** `delete from inbox_members where id = 9;`

---

**Qué quedó a medias, y dónde**

### 1. 🔴 Falta la verificación punta a punta REAL
No se llegó a abrir el widget de `onia.com.bo`, mandar dos mensajes y ver la respuesta
renderizada. Chatwoot empezó a devolver **"Retry later"** (rate limit de creación de contactos
del widget por IP) después de varias pruebas. Hay que esperar a que baje y **confirmar
MIRANDO**. Un `HTTP 200` en la base **no** es la verificación: la regla del proyecto es que
toda pantalla que ve un cliente se abre y se mira renderizada.

### 2. 🔴 El widget dice que no hay nadie — y en inglés
Texto actual a la vista de **todo visitante**: *"Estamos ausentes en este momento / We will be
back as soon as possible"*. Es lo contrario del argumento de venta, sobre un bot que contesta
al instante. Lo que se sabe:

- `inboxes.working_hours_enabled = false` en el inbox 4.
- `inboxes.out_of_office_message` **ya tiene el texto correcto en español** ("El asistente
  responde al instante, a cualquier hora.") — pero el widget no lo usa.
- `account_users`: los dos usuarios tienen `availability = 0` **pero `auto_offline = true`**,
  así que Chatwoot los pasa a ausente al rato.
- El string en inglés sugiere que el embed de la landing no pasa `locale: 'es'`. **Pasar
  `&locale=es` en la URL del widget NO cambió ese texto** (probado, no funcionó).
- **Camino propuesto, SIN validar:** activar `working_hours` 24/7 en el inbox 4, **o** poner
  `auto_offline = false` al usuario bot. Hay que verificar **cuál de los dos gobierna
  realmente el `is_online` del widget** en Chatwoot 4.12.1 — no asumir.

### 3. ✅ El bot de la ferretería no usa su conocimiento — NO es una regresión
Al inbox 6 se le preguntó *"¿A qué hora abren?"* y contestó el pitch genérico de Onia (M0), no
el horario de la ferretería. **El parte original pedía revisar si era regresión. No lo es** —
está documentado desde el 2026-08-16 en la memoria `chatbot-editor-conocimiento-prod`:

1. **Paso (b) nunca se hizo:** el bot vivo sigue leyendo `/opt/onia/bot/knowledge.json`
   **GLOBAL**. La fila por organización (`public.chatbot_knowledge`) existe, pero **sólo la
   consume el probador** de `/settings/chatbot`, no las conversaciones reales.
2. **Las plantillas M0/M4 siguen siendo el pitch de venta DE ONIA** — el motor nació como bot
   de leads de Onia. El conocimiento por org cambia nombre, horario y hechos; **no convierte
   al bot en recepcionista del rubro del cliente.**

O sea: responde así **porque así está construido**. Cerrar esto es el paso (b), no un bugfix.
**Consecuencia comercial: hasta que el paso (b) esté vivo, el chatbot por rubro no se vende
como recepcionista** — sería prometer lo que no hace.

### 4. Tardanza sin medir
La respuesta del motor tardó **más de 14 s** en aparecer. Falta medirlo en serio y decidir si
es aceptable. Un bot que se vende como "responde al instante" y tarda 14 s tiene un problema
de promesa, no sólo de performance.

### 5. 🔴 El motor corre desde `/tmp` — y contradice a la memoria
El proceso vivo es `node /tmp/onia-bot/webhook-server.mjs` dentro del contenedor
`onia-center`. **`/tmp` no sobrevive a la recreación del contenedor.**

⚠️ **Esto no cuadra con lo documentado:** la memoria `chatbot-editor-conocimiento-prod` dice
que el motor vive en **`/opt/onia/bot/`** (`preview-route.mjs`, `knowledge.json`,
`webhook-server.sh` con su allowlist `-e`). O el proceso se relevantó desde otra ruta, o hubo
una regresión de deploy. **Hay que averiguar cuál de las dos rutas está sirviendo de verdad
antes de tocar nada** — si se edita `/opt` mientras corre `/tmp`, el cambio no hace efecto y
parece que "no funciona el arreglo".

Además su stdout repite decenas de veces `[onia-webhook] escuchando en :3020/webhook/chatwoot`
— **parece reiniciarse en bucle.** Verificar.

### 6. Limpieza de QA
Conversaciones 30 y 31 (inboxes 4 y 6) creadas por estas pruebas, más ~26 conversaciones
"ZZ QA Ferreteria" / "ZZ QA Clinica" que ensucian la bandeja.

⚠️ **Ojo, hay un cruce con el carril de la web:** las capturas `public/v2/*.webp` de la landing
salieron de ese lote de QA y **tienen inquilinos cruzados y el nombre de Sergio** — ver
`ONIA_WEB_IMAGENES_DE_CONTEXTO.md` §10. No borrar la data de QA sin avisar a ese carril si
todavía se usa como fuente de capturas.

---

**Archivos y cambios**

- Base `onia-chatbot` (contenedor `chatwoot-db`), cuenta Chatwoot `id=2`: **una sola fila
  insertada**, `inbox_members id=9`. Nada más se escribió.
- Ningún archivo del repo se tocó.

**Acceso:** VPS `187.77.16.63`, llave `~/.ssh/onia_hermes_vps_ed25519`.
Base: `docker exec $(docker ps -qf name=chatwoot-db) psql -U postgres -d 'onia-chatbot'`.

---

**Intentos fallidos**

- **`&locale=es` en la URL del widget no cambia el texto en inglés.** Descartado como camino.
- **Rate limit por IP:** varias pruebas seguidas de creación de contacto desde el widget hacen
  que Chatwoot devuelva "Retry later". Hay que espaciar las pruebas o cambiar de IP; insistir
  no destraba.
- **Confiar en que el adapter reporta el fallo:** no lo hace. Marca `sent` aunque Chatwoot
  rechace el POST. Por eso el bot estuvo mudo sin que nadie lo notara. **Para saber si el bot
  contestó, contar mensajes salientes por inbox en la base, no leer el log del adapter.**

---

**Qué depende de Sergio**

1. **Decidir el orden** frente a la cola de la web y de v1.0 — este carril toca infra y la
   regla es un dueño a la vez.
2. **Confirmar que se puede borrar la data de QA** (conversaciones y organizaciones
   `ZZ QA *`), coordinando con el carril de la web que la usó para capturas.

---

**Próximos pasos**

1. **Resolver dónde vive el motor de verdad** (`/tmp` vs `/opt`) y por qué reinicia en bucle.
   Es lo primero: sin eso, cualquier otro arreglo puede no tener efecto. *Listo* = un solo
   proceso estable, servido desde `/opt/onia/bot/`, sin la línea de arranque repetida.
2. **Sacar el cartel de ausencia del widget.** Probar `auto_offline=false` en el usuario bot
   contra `working_hours` 24/7 en el inbox 4, y **verificar cuál gobierna el `is_online`** en
   Chatwoot 4.12.1. *Listo* = abrir `onia.com.bo`, ver el widget sin cartel y en español.
3. **Verificación punta a punta MIRANDO**: dos mensajes en el widget de `onia.com.bo` y la
   respuesta del motor en pantalla. Esperar a que baje el rate limit.
4. **Medir la latencia** de la respuesta y decidir si 14 s es aceptable para algo que se vende
   como instantáneo.
5. **Paso (b)**: que el motor consuma `public.chatbot_knowledge` por organización en
   conversaciones reales, no sólo en el probador. Es lo que separa "bot de leads de Onia" de
   "recepcionista del cliente" — y hasta que esté, eso no se vende.
6. Limpieza de QA (punto 6), coordinada.

**Pendientes anotados y NO perseguidos**

- Las plantillas M0/M4 como pitch de Onia son una decisión de diseño del motor, no un bug:
  cambiarlas es parte del paso (b), no algo a "arreglar" suelto.
