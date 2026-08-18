# n8n — por qué te llegaba ruido a Telegram y qué fallaba

> 2026-08-18. Sergio: *"revisa mi telegram me llegan cosas innecesarias y revisa n8n, porque hay
> cosas que corren y fallan, revisa y fix"*. Todo lo de abajo está medido contra la base de n8n,
> no supuesto.

## 1. El hallazgo: una sola causa raíz explicaba casi todo

**El contenedor `dentalgest-staging-supabase-db` ya no existe** — DentalGest staging se desmontó y
quedó un volumen huérfano. Dos cosas seguían apuntándole:

```
1 contenedor muerto
   ├── vps-healthcheck.sh lo tenía en su lista REQ  → alerta cada 2 h  → 12 mensajes/día
   └── "ONIA - Aviso de pago QR (Telegram)" usaba
       la credencial Postgres que apunta ahí        → 1287 fallos en 7 días
              └── el Monitor de Salud n8n los detecta
                  y avisa (correctamente) cada hora → 24 mensajes/día
```

**36 mensajes diarios diciendo "todo bien" o "algo falla", por un contenedor que ya no existe.**

## 2. Lo que NO era

Verificado antes de tocar nada:

| Sospechoso | Veredicto |
|---|---|
| `Vigilante del chatbot` (1010 corridas/semana) | ✅ **inocente** — tiene compuerta `¿Hay problema?` y de 30 corridas mandó **0** mensajes |
| `Agenda: Recordatorios` (336 corridas) | ✅ 0 de 30 mandaron |
| `Agente Integraciones self-hosted` (28) | ✅ 0 de 28 |
| `Monitor de Salud n8n` | ✅ bien construido — devuelve `[]` si no hay fallos. Escribía porque **sí había** fallos |

**Los monitores estaban bien hechos. El problema era real y venían avisando.**

## 3. 🔴 El bug que afectaba a TODOS los workflows

El nodo Telegram de n8n, si no le especificás nada, **fuerza Markdown**
(`Telegram/GenericFunctions.js` línea 31):

```js
if (!additionalFields.parse_mode) {
    additionalFields.parse_mode = 'Markdown';
}
```

Con texto escrito por una IA eso es una bomba: un `*` o un `_` sin cerrar y Telegram devuelve
**400 `can't parse entities`** y **el mensaje entero no llega**. No se degrada — desaparece.

Así murió el **briefing diario**: 0 éxitos y 6 errores, seis días sin briefing, con el error
`Can't find end of the entity starting at byte offset 1713`.

**Corregido: 33 nodos Telegram en 29 workflows pasados a `parse_mode: 'HTML'`.** Verificado:
41 nodos en HTML, **0 en Markdown**.

Por qué HTML y no texto plano: n8n no ofrece "sin formato" — si el campo va vacío pone Markdown.
HTML solo se rompe con `<`, muchísimo más raro en prosa en español que `*` y `_`
(un `snake_case` o un `**negrita**` de IA rompen Markdown siempre).

## 4. Lo aplicado

| Arreglo | Efecto |
|---|---|
| Sacado `dentalgest-staging-supabase-db` de `REQ` en `/opt/onia/vps-healthcheck.sh` (con backup) | healthcheck en verde: `{"ok":true,...,"problems":""}` → **-12 mensajes/día** |
| Despublicado `ONIA - Aviso de pago QR (Telegram)` | **-1287 fallos** → y con eso **-24 mensajes/día** del monitor |
| 33 nodos Telegram → `parse_mode: 'HTML'` | el briefing diario vuelve a llegar; deja de perderse cualquier mensaje con `_` o `*` |

**No se perdió ninguna alerta real:** `WF-02: QR Payment Alerts` cubre la misma función por Gmail a
`business@onia.com.bo`, y está sano. Además **hay 0 pagos pendientes** en las últimas 20 corridas —
el circuito está dormido porque todavía no hay clientes pagando.

## 5. ⚠️ Lección de operación — cómo NO reiniciar n8n

`docker restart <contenedor>` sobre una tarea de **Docker Swarm** deja un zombi: swarm da la tarea
por muerta (`exit 137`), levanta un reemplazo, y el `restart` revive la vieja **fuera de su
control**. Quedan **dos n8n contra la misma base sqlite** — triggers duplicados y riesgo de
corrupción.

```bash
# MAL
docker restart n8n-sergio_n8n.1.xxxxx

# BIEN
docker service update --force n8n-sergio_n8n
```

Pasó hoy, se detectó y se limpió (`docker stop` + `rm` del zombi, servicio de vuelta en 1/1).
Traefik además tarda ~1 minuto en re-registrar el contenedor nuevo: da "Service is not reachable"
y **no es un error, es propagación**.

## 6. Queda pendiente

| Qué | Nota |
|---|---|
| Rehacer el aviso de pago QR por Telegram | Sobre la RPC de Supabase (`n8n_pending_qr_payments`, como WF-02) en vez de Postgres, con freno anti-repetición por archivo marcador. **Sin urgencia: 0 clientes pagando** |
| `ONIA - Radar de Novedades IA` | 5 errores contra 79 éxitos — sin diagnosticar |
| `ONIA - Agente Entrega de proyectos` | 1 error, 0 éxitos |
| Volumen huérfano `dentalgest-staging-supabase_db-config` | se puede borrar |
