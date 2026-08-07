# Onia — Manual de operación del chatbot

> Para Sergio. Qué corre, de dónde saca lo que dice, qué hay que mirar y cada
> cuánto. Escrito el 2026-08-07, el día después de ponerlo en producción.
>
> Si vas con prisa, leé solo §4 (qué mirar) y §5 (las trampas).

---

## 1. El circuito, en una línea

```
+591 75414930 → Meta → Chatwoot (inbox 5) → webhook de cuenta
              → motor del bot (onia-center:3020) → respuesta → WhatsApp
```

Probado punta a punta el 2026-08-06: mensaje real, respuesta en 7 segundos,
acuse de lectura. **n8n no participa** de este circuito.

Piezas y dónde viven:

| Pieza | Dónde | Identificador |
|---|---|---|
| Número | Meta Cloud API | `phone_number_id` 1283320641524523 |
| Cuenta de WhatsApp | portfolio OniaAgency (verificado) | WABA 4429061034078857 |
| App de Meta | portfolio OniaAgency | `1078962684709749` "Onia Bot" |
| Bandeja | Chatwoot self-hosted, **cuenta 2** | inbox 5, channel 3 |
| Motor | contenedor `onia-center`, puerto 3020 | `/opt/onia/bot/` en el VPS |
| Agenda | Cal.com | reserva real, 30 minutos |

---

## 2. De dónde saca lo que dice — las cinco fuentes

**El bot no improvisa.** No hay modelo de lenguaje respondiendo: cada palabra
sale de un guion escrito y versionado. Esto es deliberado — un bot comercial
que improvisa termina inventando precios y prometiendo cosas.

| Fuente | Qué aporta | Cada cuánto se actualiza | Quién puede cambiarla |
|---|---|---|---|
| **Guion** (`config.mjs`, objeto `SCRIPT`) | Los 20 mensajes: bienvenida, horarios, confirmación, precio, baja, soporte | **Al desplegar código** | Claude, con tests |
| **Conocimiento** (`knowledge.json` en el VPS) | Los hechos: duración y modalidad de la demo, horario de atención, preguntas frecuentes | **En caliente, máx. 5 min** (TTL 300 s) | **Vos, sin desplegar** |
| **Cal.com** | Los dos horarios que ofrece, y la reserva real | **En vivo, en cada turno** | Tu calendario |
| **Supabase** (`onia_center`) | El estado de cada conversación y el lead en el CRM | En cada turno | El bot |
| **Chatwoot** | Los mensajes y el traspaso a humano | Tiempo real | Vos, desde la app |

**El modelo de lenguaje está APAGADO.** Existe una sola rama que lo usaría
(`askLiteLLM` en `run-turn.mjs`), solo para reformular una pregunta que el
prospecto no entendió, y con prohibición explícita de dar precios, cifras o
promesas. Hoy no tiene clave configurada, así que nunca se llama.

### Cómo editar el conocimiento sin desplegar

```bash
nano /opt/onia/bot/knowledge.json
/opt/onia/bot/webhook-server.sh knowledge
```

Ese comando **valida antes de aplicar**. Si metés un precio, una promesa o una
clave que no existe, **rechaza el archivo entero** y el bot sigue con lo
anterior. Nunca queda a medias.

---

## 3. Los horarios — son DOS cosas distintas y se confunden

### 3.1 Horario de atención (`businessHours`)

Define cuándo el bot considera que es "fuera de horario". Hoy:

```
lun a vie · 9:00 a 18:00 · America/La_Paz (UTC-4, Bolivia no tiene horario de verano)
```

**Esto está puesto a mano, no lo deduje de vos.** Si tu disponibilidad real es
otra —clases, por ejemplo— hay que cambiarlo, y se cambia en `knowledge.json`
sin desplegar.

### 3.2 Disponibilidad para reservar (Cal.com)

Esto es lo que de verdad importa: **los dos horarios que el bot ofrece salen de
tu Cal.com en vivo**, no de una lista fija. Si tu calendario está lleno, el bot
ofrece otros; si está vacío, no tiene qué ofrecer.

**Y desde el cambio de embudo, el primer mensaje ABRE con los dos horarios.**
O sea: si Cal.com no responde, lo primero que ve todo prospecto sale roto. Es
la dependencia más frágil del sistema.

La demo dura **30 minutos**, y ese número alimenta a la vez el texto del guion
y el bloqueo en el calendario. Hay un test que falla si alguien los separa.

---

## 4. Qué mirar, y cada cuánto

### Todos los días (30 segundos)

**¿Cal.com tiene disponibilidad para los próximos días?** Es lo primero que ve
un prospecto. Sin horarios, el mensaje de bienvenida no funciona.

### Una vez por semana (2 minutos)

```bash
/opt/onia/bot/webhook-server.sh status
```

Mirá dos cosas de la respuesta:

- **`"knowledge":{"source":"file"`** — si dice `"code"`, tu archivo de
  conocimiento dejó de aplicarse y el bot volvió a los valores del código.
  Revisá `lastError`.
- **`"ok":true`** — pero ojo, que responda no garantiza que corra el código
  nuevo (ver §5.2).

También: **la calidad del número en WhatsApp Manager**. Si baja a amarillo o
rojo, Meta está por limitarte. Se arregla dejando de escribir a quien no
contesta.

### Una vez al mes

- **Saldo del chip.** Una recarga chica cada 2-3 meses. Si la telefónica
  recicla la línea, **perdés el número y todo lo que está construido encima**.
- **Que nadie haya instalado WhatsApp en ese chip.** Nunca. Ni para probar.

### Siempre, sin excepción

- **El chip jamás toca la app de WhatsApp.**
- **El bot nunca cotiza.** El precio lo das vos en la demo, con los números del
  cliente adelante. Ese guardarraíl protege tu margen.

---

## 5. Las cinco trampas que ya nos costaron un día

Esta sección es la más valiosa del documento. Todo lo de acá **pasó de verdad**
el 2026-08-06, y todo falló **en silencio**.

### 5.1 Construido no es encendido

El seguimiento automático (insistir a las 22 h cuando alguien queda a medias)
estaba **construido, probado y desplegado**... y nunca agendado en ningún cron.
Cero ejecuciones desde que se escribió.

> **Regla:** una función solo existe si corre en producción y lo verificaste
> ahí. Un flag apagado es trabajo con valor cero.

### 5.2 El éxito puede mentir

Tres casos el mismo día:

- El servidor respondía `ok: true`... **con el código viejo**. El despliegue no
  había surtido efecto porque el proceso anterior nunca murió.
- Chatwoot recibía los mensajes de Meta, devolvía **200**, y los tiraba a la
  basura porque el canal estaba marcado como inactivo.
- 20 workflows de n8n marcan **"success"** todos los días sin hacer nada,
  porque usan variables de entorno que ese plan no soporta.

> **Regla:** "no dio error" no es "funcionó". Verificá el efecto, no el código
> de respuesta.

### 5.3 Un hecho escrito en dos lugares siempre diverge

El guion prometía **15 minutos** de demo y Cal.com bloqueaba **45**. Convivieron
meses. El prospecto aceptaba creyendo una cosa y su calendario le decía otra.

> **Regla:** un hecho, un lugar. Si tiene que aparecer en dos, que los dos lean
> del mismo sitio y que un test falle si se separan.

### 5.4 Aceptar a medias es peor que rechazar

Cuando el archivo de conocimiento no valida, se rechaza **entero**. Aplicar la
mitad deja un estado que nadie puede razonar. Es la falla que ya costó días con
la sincronización del core.

### 5.5 La ventana de 24 horas de Meta gobierna todo lo saliente

Meta solo deja escribirle a alguien **dentro de las 24 horas de su último
mensaje**. Pasado eso, solo salen plantillas aprobadas, que hoy no existen y
que además exigen método de pago.

Esto ya rompió dos cosas: el seguimiento (que consideraba elegibles
conversaciones de hasta 7 días) y el recordatorio de la demo. Por eso el link
de la reunión **se manda al reservar**, no después: en ese momento la ventana
está abierta con certeza.

---

## 6. Pendientes al 2026-08-07

### Bloqueante — sin esto no hay clientes

| Qué | Estado |
|---|---|
| **Publicar la app de Meta** | Falta el **ícono 1024x1024** y el interruptor final. Ya están cargados privacidad, condiciones, eliminación de datos y categoría. Con la app sin publicar, **el bot solo le responde a quien tenga rol en la app** |

El ícono está listo en el repo:
`web-factory/apps/onia-platform/public/brand/v2/onia-icon-1024.png`

### Importante

| Qué | Detalle |
|---|---|
| **Disparadores de n8n** | El seguimiento y el recordatorio no tienen quién los llame. Comando exacto documentado en `N8N_WORKFLOW.md` §5B |
| **Webhook abierto** | `ONIA - Disparador de Agentes` acepta llamadas sin ninguna verificación. Le falta el nodo de secreto que los otros tres webhooks del panel sí tienen |
| **DMARC** | `onia.com.bo` no tiene registro. Cualquiera puede falsificar correos desde tu dominio |
| **Método de pago en Meta** | Sin él solo funcionan las conversaciones que inicia el cliente (que son gratis, así que el bot opera igual) |

### Menor

- El número viejo **78491375** sigue circulando. Conviene convertirlo en
  redirector automático antes de darlo de baja.
- Ampliar la política de privacidad con la sección del chatbot (la página
  existe y es válida para Meta, pero cubre la plataforma, no el bot).
- Dos workflows de n8n sin archivar: les falta habilitar el acceso MCP.

---

## 7. Comandos que vas a usar

```bash
# Estado del bot
/opt/onia/bot/webhook-server.sh status

# Reiniciarlo
/opt/onia/bot/webhook-server.sh restart

# Ver los últimos registros
/opt/onia/bot/webhook-server.sh logs 50

# Editar los hechos del bot (sin desplegar)
nano /opt/onia/bot/knowledge.json
/opt/onia/bot/webhook-server.sh knowledge

# Ver a quién le mandaría seguimiento, sin mandar nada
/opt/onia/bot/followup-run.sh

# Ver a quién le mandaría recordatorio, sin mandar nada
/opt/onia/bot/reminder-run.sh
```

Los dos últimos son de solo lectura: muestran a quién le escribirían y por qué
descartan al resto. **Corrélos antes de encender cualquier envío automático.**

---

## 8. Accesos

| Qué | Dónde | Usuario |
|---|---|---|
| Chatwoot | `onia-chatbot-chatwoot.hqdqgh.easypanel.host` | `oninteligenciaartificial@gmail.com`, **cuenta 2** |
| VPS | `187.77.16.63` | llave `~/.ssh/onia_hermes_vps_ed25519` |
| Correo saliente | Google Workspace, `business@onia.com.bo` | contraseña de aplicación, cargada en Chatwoot |

**Secretos:** el token de Meta vive dentro de Chatwoot; el secreto de la app de
Meta en `/opt/onia/bot/webhook.env` (permisos 600, fuera de git). Ninguno pasó
nunca por el chat ni por un documento, y así tiene que seguir.

---

Relacionados: `ONIA_BOT_GOLIVE_RUNBOOK_20260801.md` (el alta paso a paso y las
trampas de Meta) · `ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md` (diseño de la capa
editable) · `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (llamadas, aún sin
construir).
