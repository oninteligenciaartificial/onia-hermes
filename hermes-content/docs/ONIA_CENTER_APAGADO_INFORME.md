# Apagar center.onia.com.bo — informe

> Relevado en vivo el 2026-08-29 a pedido de Sergio ("es un sistema que no se usa, eliminalo").
> **Conclusión corta: el sitio se puede bajar; el contenedor NO se puede borrar.**
>
> ✅ **EJECUTADO el 2026-08-29.** Sergio pausó el proyecto de Vercel, y se dieron de baja los dos
> routers de `center.onia.com.bo` en `/etc/easypanel/traefik/config/onia-manual-routes.yaml`.
> Traefik relee ese archivo en caliente: **no se tocó el contenedor ni se reinició nada.**
>
> Verificado después: el dominio da **404** y el host de Vercel **503**, o sea la cotización con
> el precio viejo (Bs 1.500 + 1.490 contra los Bs 390 reales) dejó de ser pública en los dos
> lados. El chatbot sigue `ok:true` con la base a 22 ms y el contenedor `Up 4 days` — nunca se
> reinició, porque Chatwoot le pega por la red interna (`onia-center:3020`) y no por el dominio.
> Los otros cinco dominios siguen en 200.
>
> Se comprobó antes de tirar, y no se asumió: **0 de 37 workflows activos** de n8n llaman a ese
> dominio, y la tienda Nuvia no depende de él (el propio middleware la redirige afuera).
>
> Revertir es un comando — el respaldo quedó como
> `onia-manual-routes.yaml.bak-bajar-center-20260829165348`.
>
> **Sigue en pie el resto del informe:** el contenedor NO se borra.

## 1. Veredicto

**Sí se puede apagar el SITIO, pero NO se puede borrar el CONTENEDOR que se llama `onia-center`.** Son dos cosas distintas con el mismo nombre, y ahí está toda la decisión: la web/panel no la usa nadie hace 28 días y se puede bajar hoy sin romper nada; pero adentro de ese mismo contenedor vive el **motor del chatbot de ventas de Onia**, y si lo borrás el chatbot queda mudo en el widget y en WhatsApp.

Verificado en vivo, recién:

```
docker exec onia-center ps -o pid,args   →  PID 1: next-server (el sitio)
docker exec onia-center wget -qO- http://localhost:3020/health
→ {"ok":true,"service":"onia-chatbot-webhook","db":{"ok":true,"latencyMs":24},...}

Chatwoot, tabla webhooks (base onia-chatbot):
2 | http://onia-center:3020/webhook/chatwoot/5c7663f2...
```

Ese es el **único** webhook que Chatwoot tiene configurado. Un contenedor, dos inquilinos: la web muerta y el chatbot vivo.

---

## 2. Qué se apaga si lo borramos

| Cosa | ¿Está viva hoy? | Qué pasa si se borra el contenedor |
|---|---|---|
| 🔴 **Motor del chatbot (puerto 3020)** | **VIVA** — `ok:true`, base a 24 ms, conversaciones del 29-ago 05:37 | **El chatbot deja de responder.** Widget y WhatsApp mudos |
| 🔴 **18 workflows ACTIVOS de n8n** (`docker exec onia-center node`) | **VIVOS** — 8 corrieron con éxito hoy (Radar 16:00, Finanzas 11:15, Vendedor 12:30, Tareas 10:50) | Fallan todos en el nodo SSH |
| 🔴 **Watchdog cada 2 min** (`*/2 * * * * /opt/onia/bot/webhook-watchdog.sh`, verificado en el crontab) | **VIVO** | Deja de re-insertar la regla de firewall que el bot necesita. Ya pasó: 4 días sin base en agosto |
| 🔴 **forms.onia.com.bo/alta-cliente.html → CRM** | **VIVO** (HTTP 200) | El formulario sigue aceptando, pero el lead NO entra al CRM |
| 🔴 **Canario del guardián (cada 10 min)** | **VIVO** | Empieza a gritar a Telegram cada 10 minutos |
| 🟡 Endpoints públicos de Nuvia (checkout, estado de pago) | Vivos y públicos (responden 400, no 401) | Se caen. No pude confirmar quién los llama |
| ⚪ **El panel /onia-center (12 rutas)** | **APAGADO de hecho** — último login humano 2026-08-03; 248 pendientes en la cola y **1 sola aprobación en toda su historia**; 222 tareas todas en `todo`; cero disparos de agentes | Nada. Ya no lo usa nadie |
| ⚪ Tráfico del dominio | **CERO** — en 6 días de log: 0 intentos de login, 3 hits a la API (todos 401), el resto escáneres | Nada |
| ⚪ Webhook de Cal.com hacia center | Configurado pero **nunca escribió una reserva** (0 filas) | Nada |
| ⚪ Deploy por GitHub Actions de center | **ROTO desde el 23-ago** (4 corridas seguidas en failure) | Se elimina una Action que hoy falla en cada push |
| ⚪ /vendedores/* y /factory/* (públicos, **sin login**) | Vivos: muestran "Comisión pendiente Bs. 232,50" de un equipo de ventas que no existe | Se caen — probablemente a favor, ya estaban marcadas para bajar |
| 🟢 **Los datos** (55 tablas, 2.386 ítems de radar, 97 leads) | Viven en `supabase-db`, otro contenedor, con respaldo diario 04:10 | **No se pierde nada.** Ni una fila |

**Lo importante:** ninguna superficie de cliente enlaza a center (0 coincidencias en el build de app.onia.com.bo, onia.com.bo, propuestas y sales-kit). Bajar el dominio no le produce un 404 a ningún cliente.

---

## 3. /admin vs center

| Qué da | /admin (onia-platform) | center |
|---|---|---|
| Alta/baja de clínicas, cambiar plan, prender add-ons | ✅ | — |
| Pagos de suscripción (aprobar comprobantes) | ✅ | — |
| Usuarios de todas las clínicas | ✅ (/admin/global-users) | — |
| Pedidos de acceso (`/register`) | ✅ | — |
| Estado de los chatbots por org | ✅ | — |
| **Pipeline de leads / CRM** | ❌ | ✅ **solo center** |
| **Cola de revisión de los agentes** | ❌ | ✅ **solo center** |
| **Radar de novedades IA (2.386 ítems)** | ❌ | ✅ **solo center** |
| **Botón de disparar agentes a mano** | ❌ | ✅ **solo center** |
| **Finanzas internas de Onia** | ❌ | ✅ **solo center** |

Lo que "solo da center" son las 5 cosas que nadie abrió en un mes. La cola tiene 248 pendientes y 1 aprobación histórica: no es una capacidad que se pierda, es una que nunca se usó.

---

## 4. Lo que pediste: métricas, pagos, usuarios

| Lo que pediste | Pantalla | Estado |
|---|---|---|
| **Usuarios** | `/admin/global-users` | ✅ **Cableada.** Lee todos los perfiles de todas las orgs, con filtro por rol y buscador |
| **Pagos** | `/admin/payments` | ✅ **Cableada** y global — pero **hoy la tabla tiene 0 filas** (`select count(*) from subscription_payments` → 0). Funciona; todavía no hay qué mostrar |
| **Métricas** | — | ❌ **NO EXISTE.** Cero cifras de dinero agregadas en todo el panel |

Concretamente falta construir: ingresos del mes / MRR, ingreso por plan y por add-on, altas y bajas por período, churn, suscripciones vencidas o por vencer (el dato `planEnd` ya existe y nadie lo mira), y cobros pendientes en Bs con cuánto lleva esperando cada uno. Verificado por búsqueda de agregación sobre pagos: no hay ni un `sum`, ni un `groupBy`, ni un total en ninguna parte de `/admin`.

**Dos bugs de alcance que conviene arreglar junto con esto:**
- `/admin/audit` dice "Auditoría" pero filtra por TU organización. Como sos de "Onia (interna)", te muestra 0 filas mientras los 8 eventos reales viven en las orgs cliente.
- `/admin/users` no es la lista global — es el "Equipo" de tu propia org colgado del menú de Super Admin. Entrás por ahí y parece que la plataforma tiene 1 usuario. La buena es `/admin/global-users`.

---

## 5. El rol SUPERADMIN

**No hace falta darte nada: ya lo tenés y lo estás usando.**

```sql
select role, count(*) from public.profiles group by 1;
→ ADMIN 2, DOCTOR 1, SUPERADMIN 1, STAFF 1

superadmin@onia.com.bo | Superadmin Onia | SUPERADMIN | last_sign_in_at = 2026-08-29 00:55
```

Esa es tu cuenta y firmó sesión ayer. Dos aclaraciones:

- `oninteligenciaartificial@gmail.com` **no existe** en la plataforma — ni cuenta ni perfil. Ahí no hay "cambio de rol" posible: habría que crear cuenta nueva. No hace falta.
- `sergio@onia.com.bo` existe en Auth pero **no tiene perfil**, así que con ese mail hoy no entrás al dashboard. Entrá con `superadmin@onia.com.bo`.

Si algún día hace falta otro superadmin: no hay botón ni API para darlo (las dos rutas que escriben rol tienen lista blanca que excluye SUPERADMIN a propósito). Es SQL a mano contra la base del VPS:

```sql
UPDATE public.profiles SET role = 'SUPERADMIN' WHERE email = '<mail>';
```

El gate es sólido: todo `/admin` cae detrás de un chequeo de servidor y cada página y cada API lo repite por su cuenta. Verificado en vivo: las 6 rutas de `/admin` devuelven 307 → /login sin sesión.

---

## 6. Las opciones

**A. Bajar el dominio, dejar el contenedor** ← lo que la evidencia sostiene
Sacás el registro DNS y el router de Traefik. El sitio deja de existir; el contenedor sigue corriendo con el chatbot adentro.
- **Costo:** casi cero. Perdés 12 rutas que nadie abre, y de paso se caen `/vendedores/*` y `/factory/*` (las huérfanas que ya querías bajar).
- **Riesgo:** bajo. El único cabo suelto es Nuvia checkout — chequear antes si alguna tienda le pega.
- **Ojo:** el contenedor sigue llamándose `onia-center`, así que el nombre miente. Es feo, pero no rompe nada.

**B. Borrar el contenedor entero**
- **Costo:** alto. Chatbot mudo, 18 workflows caídos, watchdog de firewall apagado, alta de clientes sin llegar al CRM, canario gritando cada 10 min.
- **Riesgo:** alto, y no hace falta correrlo hoy. Si algún día querés esto, primero hay que **mudar el motor del chatbot a su propio contenedor** — es un trabajo aparte, chico, y hay que hacerlo antes, no después.

**C. No apagar nada, solo usar `/admin`**
- **Costo:** cero.
- **Riesgo:** siguen publicadas sin login las páginas de vendedores con comisiones ficticias.

**Recomendación: A, y en paralelo construir la capa de métricas en `/admin`.** Porque apagar center no te da las métricas — center tampoco las tenía. Lo que querés ver (ingresos, MRR, vencimientos) hay que construirlo, y el lugar correcto es `/admin`, no center.

---

## 7. Lo que no se pudo verificar

- **No abrí `/admin` con sesión de superadmin.** No tengo la contraseña y no iba a crear una sesión en producción. Todo lo del panel está leído del código y de la base, no mirado en pantalla. Si querés el veredicto visual, entrá vos y sacá captura — o pasame la credencial.
- **No abrí las pantallas de center con datos.** Todas rebotan al login. Que hay datos lo sé por la base, no por la pantalla.
- **Nuvia checkout:** el endpoint está vivo y es público, pero no encontré quién lo llama. Antes de bajar el dominio, hay que revisar el proyecto de Vercel `nuvia-store`.
- **Dos workflows activos** ("Nuevo Lead speed-to-lead" y "Generar Propuesta") dependen del contenedor, pero n8n solo guarda 14 h de ejecuciones y en esa ventana no aparecen. No sé si corren o están muertos de hecho.
- **Por qué falla el deploy de center desde el 23-ago:** confirmé las 4 fallas, no leí el log de error.
- Los 2.386 ítems de radar y las 222 tareas: verifiqué cantidad y frescura, **no si el contenido sirve**. 222 tareas que nadie tocó en un mes pueden ser deuda, no activo.
