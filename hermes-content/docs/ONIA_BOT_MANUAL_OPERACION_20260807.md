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

**El bot no improvisa.** El grueso de lo que dice sale de un guion escrito y
versionado; el modelo de IA solo entra cuando el guion no entendió (ver abajo).
Es deliberado: un bot comercial que improvisa inventa precios y promete cosas.

| Fuente | Qué aporta | Cada cuánto se actualiza | Quién puede cambiarla |
|---|---|---|---|
| **Guion** (`config.mjs`, objeto `SCRIPT`) | Los 20 mensajes: bienvenida, horarios, confirmación, precio, baja, soporte | **Al desplegar código** | Claude, con tests |
| **Conocimiento** (`knowledge.json` en el VPS) | Los hechos: duración y modalidad de la demo, horario de atención, preguntas frecuentes, **y los rubros que el bot reconoce** | **En caliente, máx. 5 min** (TTL 300 s) | **Vos, sin desplegar** |
| **Cal.com** | Los dos horarios que ofrece, y la reserva real | **En vivo, en cada turno** | Tu calendario |
| **Supabase** (`onia_center`) | El estado de cada conversación y el lead en el CRM | En cada turno | El bot |
| **Chatwoot** | Los mensajes y el traspaso a humano | Tiempo real | Vos, desde la app |

### El modelo de lenguaje SÍ está conectado — y hace muy poco a propósito

Verificado el 2026-08-07 en el proceso que corre: `LITELLM_KEY` presente,
`LITELLM_BASE` apuntando al LiteLLM del VPS, `ONIA_BOT_MODEL=gpt-4o-mini`.
Probado con una llamada real: responde.

> Nota: `docker exec onia-center printenv` **no** muestra estas variables,
> porque `webhook-server.sh` se las pasa al proceso con `-e` al arrancarlo, no
> al contenedor. Mirar el entorno del contenedor lleva a concluir, falsamente,
> que el modelo está apagado. Para verificarlo de verdad:
> `docker exec onia-center pgrep -f webhook-server.mjs` y leer `/proc/<pid>/environ`.

**Cuándo interviene:** solo cuando el prospecto escribe algo que el guion no
entiende. El orden es: guion primero → si no se entendió, el modelo reformula
la pregunta pendiente → al **segundo** malentendido, se deriva a un humano
(`offScript.maxBeforeHandoff: 2`).

**Qué tiene prohibido**, por prompt de sistema: dar precios, planes, features,
cifras, plazos, casos de clientes, inventar datos o prometer cualquier cosa.
Máximo 2 frases. Y si la llamada falla o tarda, devuelve vacío y el bot sigue
con el guion — nunca queda mudo por culpa del modelo.

Costo: `gpt-4o-mini`, 160 tokens máximo por intervención. Despreciable.

### Cómo editar el conocimiento sin desplegar

```bash
nano /opt/onia/bot/knowledge.json
/opt/onia/bot/webhook-server.sh knowledge
```

Ese comando **valida antes de aplicar**. Si metés un precio, una promesa o una
clave que no existe, **rechaza el archivo entero** y el bot sigue con lo
anterior. Nunca queda a medias.

### Agregar un producto nuevo (sin desplegar)

Cuando Onia lanza un módulo nuevo, el bot se entera editando esto:

```json
"productos": [
  { "key": "dental", "nombre": "Dental", "queResuelve": "agenda, recordatorios y cobros de una clínica" },
  { "key": "veterinaria", "nombre": "Veterinaria", "queResuelve": "fichas, vacunas y recordatorios" },

  { "key": "web", "tipo": "servicio", "nombre": "la web de tu negocio" },
  { "key": "videos_ia", "tipo": "servicio", "nombre": "videos e influencers con IA" }
]
```

Con eso, quien pregunte *"¿qué hacen?"* recibe la lista al día y la conversación sigue
hacia la demo.

**Son dos cosas distintas, y la diferencia importa:**

| | Qué es | Cómo lo dice el bot |
|---|---|---|
| **módulo** (por defecto) | Software de la plataforma. Puede no estar construido. | En viñetas. Sólo los armados se nombran como tales; el resto va junto en *"en construcción, sin humo"*. |
| **`"tipo": "servicio"`** | Trabajo que ya entregamos: web, chatbot, videos e influencers con IA, redes, automatizaciones. | En una frase: *"Y además hacemos…"*. Nunca sale como en construcción, porque existe. |

Un módulo tiene que decir `queResuelve` (si no, la viñeta es un nombre y nada más).
Un servicio no lo necesita: el nombre ya lo dice.

**Lo que el archivo NO puede hacer: decir que un módulo está listo.** Cuál está armado
lo decide una lista congelada en el código (`MODULOS_LISTOS`, hoy sólo `dental`).
Todo módulo que agregues sale como *"en construcción, sin humo"* — la misma frase que
usa la web. Encenderlo es un commit, con el módulo construido delante. No es burocracia:
es lo único que impide que el bot venda un sistema que todavía no existe.

### Agregar un rubro nuevo (sin desplegar)

Cuando aparece un rubro que el bot todavía no reconoce — el prospecto escribe
"tengo una funeraria" y el bot no entiende a qué se dedica — se agrega así:

```json
"rubrosExtra": [
  {
    "key": "funeraria",
    "label": "servicios funerarios",
    "fuerte": ["funeraria", "velatorio", "sala de velacion"],
    "debil": []
  }
]
```

- **`fuerte`** = palabras que en un WhatsApp de trabajo no significan otra cosa.
  Matchean solas.
- **`debil`** = palabras comunes ("bodega", "local"). Sólo cuentan si vienen
  detrás de algo que indique posesión: *"tengo una bodega"* sí, *"estoy en la
  bodega"* no. **Ante la duda, la palabra va en `debil`.**
- **`key`** es lo que se guarda en el CRM: minúsculas, sin tildes ni espacios.
- **`label`** es cómo se lo lee el prospecto: *"ya me contaste que te dedicás a
  servicios funerarios"*.

Al aplicar, el validador **corre las 62 conversaciones del banco de prueba** con
y sin tu léxico. Si una palabra tuya hace que el bot clasifique mal o se invente
un dato, **no se publica** y te dice cuánto bajó. Por eso una palabra corta o
demasiado común rebota: no es capricho, es que rompe conversaciones reales.

Tres cosas que **no** se pueden hacer desde el archivo, a propósito:

| No se puede | Por qué |
|---|---|
| Borrar un rubro del código | Editar sólo agrega. Quitar es un commit. |
| Prometer que "el módulo X ya está listo" | Nombrar una feature que no existe es una promesa. Va en código. |
| Escribir una regex | Una mala cuelga el bot entero. Se escriben palabras; el bot las compila. |

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
| ~~Publicar la app de Meta~~ | ✅ **HECHO 2026-08-07.** Meta confirmó "tu app está disponible para el público". El icono NO era obligatorio. El bot ya le responde a cualquiera |

El ícono está listo en el repo:
`web-factory/apps/onia-platform/public/brand/v2/onia-icon-1024.png`

### Importante

> Revisado contra producción el **2026-08-16**. Lo cerrado se tacha acá mismo en vez de
> abrir otro doc de pendientes — ver `ONIA_ESTADO_CHATBOT_Y_VOZ_20260816.md`.

| Qué | Detalle |
|---|---|
| ~~**Disparadores de n8n**~~ | ✅ **CERRADO 2026-08-16.** Se resolvió con **cron del VPS, no con n8n** (menos piezas, mismo efecto): `followup` :17 · `reminder` :32 · `postdemo` :47 · `usage` 12:00 UTC. Los cuatro corridos en seco antes de encender: 0 candidatos |
| **Webhook abierto** | `ONIA - Disparador de Agentes` acepta llamadas sin ninguna verificación. Le falta el nodo de secreto que los otros tres webhooks del panel sí tienen. **Sin verificar el 16-ago** |
| ~~**DMARC**~~ | ✅ **PUBLICADO.** `v=DMARC1; p=none; rua=mailto:business@onia.com.bo; fo=1`. Queda subirlo de `p=none` a `p=quarantine` cuando los informes confirmen que no hay falsos positivos |
| ~~**Método de pago en Meta**~~ | ✅ **CARGADO.** El error 131042 se resolvió cuando la tarjeta pasó |
| **La rama LLM estuvo apagada hasta el 16-ago** | `LITELLM_KEY` no existía en `webhook.env`: `askLiteLLM()` devolvía vacío y todo caía al texto de respaldo. Encendida con llave propia y `gpt-4.1-mini` |
| **El seguimiento no tiene hora de silencio** | Dispara a las 20 h del último mensaje entrante, así que puede salir a las 6 AM. El recordatorio sí tiene el freno (`quietBeforeHour: 8`). Ponerle el freno achica la ventana de Meta: **decisión de Sergio** |

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

### 7.1 Medir el bot: los tres niveles

El bot es el único agente nuestro que corre con un modelo pago de verdad
(`gpt-4.1-mini` vía LiteLLM — verificado en `/opt/onia/bot/webhook.env`). Los tres
agentes del producto (Recall/Cobrador/Captador) redactan con plantillas y cuestan
USD 0,00: a esos los cubren sus tests unitarios y no hay nada de modelo que medir.

```bash
cd hermes-content/deploy/vps-ops/bot

# 1. Tests unitarios (505): que el código haga lo que dice el código.
node --test *.test.mjs

# 2. Banco de decisión (62 casos): qué RUTA toma con mensajes reales de dueños.
node bench.mjs

# 3. Evals (12 tareas, método StockPilot): el TEXTO que sale, las cifras del
#    conocimiento publicado, el contrato JSON de n8n y la rama del modelo.
#    Imprime tabla: PASS/FAIL por tarea, tokens y ms.
node --test evals/evals.test.mjs
```

Las 11 tareas deterministas de los evals son **gratis** y corren siempre. La única
cara (E12, la rama off-guion contra `gpt-4.1-mini` real) está **gateada**: sin
`ONIA_EVAL_LLM=1` + `LITELLM_KEY` se reporta `NO CORRIDO` con el costo estimado
(~199 tokens de entrada + ≤160 de salida ≈ **USD 0,00034 por corrida**, precio
gpt-4.1-mini 0,40/1,60 USD por millón, tabla de LiteLLM leída el 2026-08-20).
Es trivial, pero la regla es la regla: **gasto de modelo = permiso explícito de
Sergio**, y un número no corrido se reporta como no corrido, nunca inventado.

Baseline del 2026-08-20 (código `34704261cca8`): 505/505 tests · 62/62 banco ·
11/11 evals deterministas · E12 estimada, no corrida.

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

Relacionados: `historial/ONIA_BOT_GOLIVE_RUNBOOK_20260801.md` (el alta paso a paso y las
trampas de Meta) · `ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md` (diseño de la capa
editable) · `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (llamadas, aún sin
construir).
