# Desde dónde se maneja Onia — la cuenta, los accesos y si conviene una sola consola

Escrito para Sergio. Todo lo de acá se verificó en vivo contra producción el
**2026-08-29** (base del VPS, contenedores, DNS, HTTP y el navegador). Lo que no
se pudo verificar está dicho como tal.

---

## La respuesta, primero

1. **Sí, `superadmin@onia.com.bo` sirve para manejar el producto.** Tiene perfil,
   su rol es `SUPERADMIN` y pertenece a la organización **Onia (interna)**. Es la
   **única** cuenta con ese rol. Entra por `https://app.onia.com.bo/admin`.

2. **`sergio@onia.com.bo` NO entra al dashboard del producto.** Existe en Auth
   pero **no tiene perfil**, así que el sistema lo saca a `/dashboard` y ahí no
   hay ninguna organización asignada. **Pero sí es tu cuenta de ONIA Center**
   (`center.onia.com.bo`). Son dos puertas distintas con el mismo mail: no las
   mezcles.

3. **No, no conviene una sola consola.** Ni metida en `/admin` ni como panel
   aparte. Lo que resuelve tu problema real es lo más barato: **una página de
   enlaces con instrucciones** (opción c). El porqué está en la sección 3.

4. **Desde un localhost, no.** Hoy en tu PC hay **dos cosas que parecen locales y
   son distintas**: `127.0.0.1:55322` es la base local de verdad (Docker), y
   `127.0.0.1:54321/54322/54329` es un **túnel SSH al VPS**. Dos comandos para
   distinguirlas en la sección 4.

5. **Google Analytics no mide nada.** El código está y está montado; la variable
   `NEXT_PUBLIC_GA_ID` **no existe en producción**. Cero datos de tráfico desde
   siempre. Detalle en la sección 5.

---

## 1. La cuenta — qué dice la base de producción

Consultado con `ssh root@187.77.16.63` → `docker exec supabase-db psql`.

### Los 5 perfiles que existen

| Perfil | Mail | Rol | Organización |
|---|---|---|---|
| Superadmin Onia | `superadmin@onia.com.bo` | **SUPERADMIN** | Onia (interna) |
| QA Chatbot Onia | `oninteligenciaartificial+qachatbot@gmail.com` | ADMIN | ZZ QA Clinica Chatbot |
| QA Comercio Onia | `oninteligenciaartificial+qacomercio@gmail.com` | ADMIN | ZZ QA Ferreteria Tornillo |
| Dra. QA Uno | (sin usuario) | DOCTOR | ZZ QA Clinica Chatbot |
| QA Vendedor Uno | (sin usuario) | STAFF | ZZ QA Ferreteria Tornillo |

**Cuatro de cinco son de QA.** El único perfil real es el tuyo. Las tres
organizaciones que hay son `Onia (interna)` y dos de prueba (`ZZ QA ...`).

### superadmin@onia.com.bo

- Usuario de Auth `752c934e-cc57-48a1-b188-e11e0f88e49b`, creado el 2026-08-18.
- **Último ingreso: 2026-08-29 00:55 UTC.** O sea: entra, funciona.
- Perfil `c0f400c2856583d277ff1bd14`, rol `SUPERADMIN`, org `onia-interna`.
- La puerta `/admin` se abre exactamente con eso. El guardia está en
  `app/(dashboard)/admin/layout.tsx`: si no hay perfil o el rol no es
  `SUPERADMIN`, te manda a `/dashboard`. Verificado en vivo: pedir `/admin` sin
  sesión responde `307 → /login`.
- Dentro del panel hay 7 secciones: Clínicas, Pedidos de acceso, Pagos, Planes,
  Usuarios, Chatbots y Auditoría.

### sergio@onia.com.bo

- Usuario de Auth `fd79100c-846f-4cc2-a662-00d77202ae78`, creado el 2026-07-04,
  último ingreso 2026-08-01.
- **No tiene fila en `profiles`.** Con ese mail hoy no manejás nada del producto.
- Sí es tu cuenta en ONIA Center: figura como `sergio` / "Sergio Urcullo",
  rol `sergio`, estado `active`, atado a ese mismo usuario de Auth.

### Dos cosas que te van a morder si no las sabés

**a) El `?schema=dentalgest` es una mentira piadosa.** La variable de producción
dice `postgresql://...@db:54329/postgres?schema=dentalgest`, pero el schema
`dentalgest` tiene **0 tablas**. Las 73 tablas del producto están en `public`.
Si alguien (o alguna sesión mía) va a buscar a `dentalgest`, no encuentra nada y
concluye que la base está vacía. No lo está.

**b) Sobra gente con acceso.** En ONIA Center siguen **activos**:

| Usuario | Nombre | Rol | Estado |
|---|---|---|---|
| `arthur` | Arthur Fuentes | arthur | **active** |
| `seller_001` | Camila | seller | **active** |
| `seller_002` | Jeronimo | seller | active (sin usuario de Auth) |

Arthur ya no colabora y no hay equipo de ventas. Camila (`vendedora@onia.com.bo`)
tiene usuario de Auth vivo. **Darlos de baja es decisión tuya y es de un minuto.**
No lo toqué: esta tarea era de solo lectura.

---

## 2. Dónde se maneja cada cosa, hoy

Todo lo de abajo se probó con `curl` contra la URL real.

| Qué | Dónde se entra | Con qué cuenta | ¿Entrás solo hoy? |
|---|---|---|---|
| **Panel de administración del producto** | `https://app.onia.com.bo/admin` | `superadmin@onia.com.bo` | **Sí** |
| Dashboard del producto (vista cliente) | `https://app.onia.com.bo/dashboard` | la misma | Sí |
| **ONIA Center** | `https://center.onia.com.bo` | `sergio@onia.com.bo` | **Sí** |
| **Docker / Easypanel** (todos los contenedores) | `https://hqdqgh.easypanel.host` | `oninteligenciaartificial@gmail.com` | **Sí** |
| **n8n** (26 contenedores, 1 instancia viva) | `https://n8n-sergio-n8n.hqdqgh.easypanel.host` | cuenta owner propia de n8n | Sí |
| **Chatwoot** (canal del chatbot) | `https://chat.onia.com.bo` | `oninteligenciaartificial@gmail.com` (usuario "OnIA") | **Sí** |
| Postiz (publicación en redes) | `https://postiz.onia.com.bo` | cuenta propia de Postiz | Sí |
| Landing pública | `https://onia.com.bo` | no tiene panel: se deploya | — |
| Formularios | `https://forms.onia.com.bo` | nginx estático, sin panel | — |
| `cal.onia.com.bo` | ya no es panel: redirige a `/empezar` | — | — |
| **Supabase — API de producción** | `https://app.onia.com.bo/supabase` | claves `anon` / `service_role` | no es una pantalla |
| **Supabase — Studio de producción** | **NO EXISTE** | — | **No** |
| Supabase Studio local | `http://localhost:55323` | — | Sí, pero es tu base local |
| Supabase en la nube ("Dental-gest") | `supabase.com` | tu cuenta | Sí — **pero NO es producción** |
| **Vercel** | `vercel.com`, equipo `oninteligenciaartificial-8139's projects` (plan hobby) | tu cuenta | Sí — **pero no sirve nada de onia.com.bo** |
| **Cloudflare** (DNS + correo entrante) | `dash.cloudflare.com` | tu cuenta | Sí *(no verificado: el MCP de Cloudflare pide autorización que no puedo dar desde acá)* |
| **Correo** | Gmail, `oninteligenciaartificial@gmail.com` | tu cuenta | Sí |
| Sentry (errores de producción) | `sentry.io`, org `onia-agency`, proyecto `onia-platform` | tu cuenta | Sí |
| VPS por consola | `ssh root@187.77.16.63` con `onia_hermes_vps_ed25519` | la llave | Sí, con la llave |

### Cuatro aclaraciones que valen plata

- **No hay Supabase Studio en producción.** El stack del VPS levanta `db`, `auth`,
  `rest`, `storage`, `kong`, `edge-functions` e `imgproxy` — **no hay contenedor
  de Studio ni de meta**. Para mirar la base de producción hoy no hay pantalla:
  es `ssh` + `psql`. Eso es lo único de esta lista que sí tiene sentido resolver.
- **El proyecto "Dental-gest" de Supabase en la nube está ACTIVE_HEALTHY y no es
  producción.** Es un fantasma que ya hizo diagnosticar mal antes. Producción es
  el `supabase-db` self-hosted del VPS.
- **Vercel no sirve nada tuyo.** Hay 16 proyectos en el equipo (incluido
  `dental-gest` y `onia-center`), pero `onia.com.bo` y `app.onia.com.bo` los sirve
  el VPS vía Traefik. Pushear a `main` no publica nada en el dominio.
- **El correo entra por Cloudflare y sale por el VPS.** Los MX de `onia.com.bo`
  apuntan a `route1/2/3.mx.cloudflare.net` (Email Routing → reenvía a Gmail) y el
  SPF es `v=spf1 ip4:187.77.16.63 include:_spf.mx.cloudflare.net ~all` (sale por
  el Postfix del VPS). Google Workspace quedó fuera y ya no se paga.

---

## 3. ¿Tiene sentido UNA sola consola?

**No. Y la razón no es técnica, es de dueño.**

Tu problema real no es "tener muchas pantallas". Es que **no te acordás con qué
mail entra cada cosa**. Eso se arregla con una lista, no con software.

### (a) Meter todo dentro de `/admin` — no

Chatwoot, n8n, Easypanel y Cloudflare no son *datos tuyos*: son **productos
enteros**, con su propia interfaz, su propio login y su propio modelo de
permisos. Reimplementarlos adentro de `/admin` es meses de trabajo para quedar
peor que el original.

Y hay algo más grave: `app.onia.com.bo` es la app que **también usan tus
clientes**. Meterle adentro la llave del VPS, el token de Cloudflare o la API key
de n8n significa que un solo agujero en la app de clientes entrega la infra
entera. Hoy están separados y eso es una virtud, no un desorden.

### (b) Un panel aparte — ya lo intentaste y está muerto

Existe `hermes-content/docs/historial/HERMES_OS_CONTROL_CENTER_2026.md` (junio) que decidió
exactamente eso: un "Control Tower" en `localhost:3010` y un dashboard en
`localhost:9119`. **Verificado hoy: no hay nada escuchando en ninguno de los dos
puertos.** Un panel que hay que mantener y que nadie enciende es trabajo con
valor cero — y encima manda a cada sesión nueva a mantenerlo.

### (c) Una página de enlaces con instrucciones — **sí, esto**

Es lo que conviene. Y ya casi está escrita: **es la tabla de la sección 2**.

Si querés una pantalla, que sea eso mismo en HTML: 20 líneas colgadas en algo que
ya existe (por ejemplo `forms.onia.com.bo/interno`). Sin base de datos, sin
sesión, sin mantenimiento. Costo: una tarde. Riesgo: cero. Si el día de mañana un
servicio cambia de URL, editás una línea.

### Lo que sí conviene unificar (y no es una pantalla)

1. **El mail de recuperación de todo → `oninteligenciaartificial@gmail.com`.**
   Ese ya es el mail de Easypanel y de Chatwoot. Que sea el de todo.
2. **Las claves en un gestor de contraseñas**, no en tu cabeza ni en un `.env`.
   Es esto —y no un panel— lo que hace que "entres solo" a cualquier cosa.
3. **Una pantalla para mirar la base de producción.** Es el único hueco real de
   la lista. Hoy son `ssh` + `psql`.

### Y una sola *cuenta* para todo, tampoco

`superadmin@onia.com.bo` es una cuenta **del producto Onia**. No puede ser la de
Cloudflare, ni la de Easypanel, ni la de Vercel — esas son cuentas de proveedores
externos con su propia identidad. Lo unificable es el mail de recuperación, no la
credencial.

---

## 4. Localhost vs producción — cómo saber contra qué estás parado

Esto es lo que más caro sale, porque **hay puertos locales que no son locales**.

En tu PC ahora mismo:

> **Desde el 26-oct el watchdog de arranque (`--tunnel-only`) abre solo `3108` (Speaches).** Los túneles de abajo
> ya no están abiertos siempre: se piden con `ONIA_SUPABASE_TUNNEL_ENABLED=true` (54320-54329) u
> `ONIA_SPEAKR_TUNNEL_ENABLED=true` (3107), o corriendo la app de ONIA Center sin `--tunnel-only`. Motivo: cualquier
> proceso de la PC llegaba a la base de producción. La tabla queda como referencia de qué es cada puerto.

| Puerto | Quién lo tiene | Qué es de verdad |
|---|---|---|
| `127.0.0.1:55321-55330` | `com.docker.backend.exe` | **LOCAL.** Tu Supabase de desarrollo (base en `55322`, Studio en `55323`) |
| `127.0.0.1:54321` | `ssh.exe` | **VPS.** Túnel al Kong de producción |
| `127.0.0.1:54322` | `ssh.exe` | **VPS.** Túnel al Kong de producción (HTTPS) |
| `127.0.0.1:54329` | `ssh.exe` | **VPS.** Túnel — pero no llega a ningún lado (ver abajo) |

El túnel está abierto por este proceso (verificado):

```
ssh.exe -N -i C:\Users\PC\.ssh\onia_hermes_vps_ed25519 \
  -L 54321:127.0.0.1:54321 -L 54322:127.0.0.1:54322 -L 54329:127.0.0.1:54329 ... \
  root@187.77.16.63
```

### Los dos comandos

**Comando 1 — ¿este puerto es mío o es el VPS?** (PowerShell)

```powershell
Get-NetTCPConnection -LocalPort 54329 -State Listen |
  ForEach-Object { (Get-Process -Id $_.OwningProcess).ProcessName }
```

- Responde **`ssh`** → estás contra el **VPS (PRODUCCIÓN)**.
- Responde **`com.docker.backend`** → es tu **Docker (LOCAL)**.

Cambiá el `54329` por el puerto que quieras chequear. Hoy: `54321`, `54322` y
`54329` dan `ssh`; `55322` da `com.docker.backend`.

**Comando 2 — ¿a qué base apunta lo que voy a levantar?** (Git Bash)

```bash
grep DATABASE_URL /c/dev/proyectos/onia-platform/.env.local
```

Hoy responde `...@127.0.0.1:54329/postgres?schema=dentalgest`. Cruzalo con el
comando 1: ese `54329` es `ssh`, o sea que **el archivo de desarrollo apunta a un
túnel a producción**, no a tu base local.

### Por qué eso todavía no rompió nada (y por suerte, no por diseño)

Verificado hoy en el VPS: en el host solo escuchan `127.0.0.1:54321` y
`127.0.0.1:54322`. El contenedor `supabase-db` **no publica ningún puerto al
host** — su Postgres está en `54329` *dentro* de la red de Docker (`PGPORT=54329`,
por eso la app usa `db:54329` y le funciona). Resultado: el túnel de `54329`
llega al host del VPS y ahí no hay nadie. La conexión se cae sola.

**Corrección a `onia-platform/docs/DESARROLLO_LOCAL.md`.** Ese doc dice que "el
54322 SÍ llega, y es el puerto de la base", y que cambiar `54329 → 54322`
convertiría tu entorno de desarrollo en producción. **Es falso.** El `54322` del
VPS es `supabase-kong` sirviendo HTTPS (`127.0.0.1:54322 → kong:8443`), no
Postgres. Poner `54322` en el `DATABASE_URL` no te da la base: te da el portero
de la API, y falla igual. La conclusión del doc (no toques eso) sigue siendo
buena; el motivo estaba mal, y un motivo mal escrito manda a la próxima sesión al
archivo equivocado.

### La regla corta

- Si en la barra del navegador dice `localhost` o `127.0.0.1` → es tu PC.
- Si dice `app.onia.com.bo`, `center.onia.com.bo`, `chat.onia.com.bo` → es
  producción, y lo que toques ahí lo ve el cliente.
- **Un puerto `127.0.0.1` NO garantiza que sea local.** El comando 1 es el que
  decide.
- Y entrá siempre por `localhost`, nunca por `127.0.0.1`: en desarrollo Next
  bloquea recursos cross-origin, la página no hidrata y los botones quedan
  muertos **sin ningún error visible**.

---

## 5. Google Metrics — no estás midiendo nada

### Lo que hay

El código está y está montado:

- `components/analytics/GoogleAnalytics.tsx` — lee `process.env.NEXT_PUBLIC_GA_ID`
  y carga `gtag`.
- `app/layout.tsx` línea 149 — lo monta en todas las páginas.
- `next.config.ts` — el CSP ya permite `googletagmanager.com` y
  `google-analytics.com`. O sea: la parte difícil ya está hecha.

### Lo que falta

**La variable no existe en producción.** Contadas las ocurrencias de `GA_ID` en el
entorno del contenedor `onia-platform`: **cero**. Tampoco en `onia-landing` ni en
`onia-center`. En `.env.example` figura como `NEXT_PUBLIC_GA_ID=""` — vacía.

Sin la variable, el componente devuelve `null` y `gtag` **nunca se carga**. No es
que mida mal: **no mide**. No hay una sola visita registrada, ni la hubo nunca.

### Lo que sí está midiendo

- **Sentry** — sí está cableado y activo en producción (org `onia-agency`,
  proyecto `onia-platform`). Errores, no visitas.
- **Search Console** — el dominio tiene
  `google-site-verification=leBxfxrXjoOKWZOKi6Dijw9MLgw655w6mvME78bj83c` en el
  TXT, así que la propiedad está verificada. Mide búsquedas, no visitas.
- **Cloudflare Web Analytics — bloqueada.** Al abrir `app.onia.com.bo` la consola
  del navegador tira, dos veces:
  `Loading the script 'https://static.cloudflareinsights.com/beacon.min.js' violates the following Content Security Policy directive: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com"`.
  Cloudflare está inyectando su beacon y **tu propio CSP lo está tirando**. Otra
  métrica que creés que tenés y no tenés.

### Encenderlo

10 minutos, tres pasos:

1. Crear la propiedad GA4 y sacar el Measurement ID (`G-XXXXXXXXXX`).
2. Agregar `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` al entorno del contenedor.
3. **Rebuildear en el VPS** — no alcanza con reiniciar. Es una variable
   `NEXT_PUBLIC_*`: Next la hornea dentro del bundle en tiempo de build.
   Y ojo: buildear **con `app.env`, nunca con un `.env.local` presente**, o el
   bundle sale con `127.0.0.1` adentro.

Para el beacon de Cloudflare: o lo apagás en el dashboard de Cloudflare (si vas a
usar GA4, es redundante), o agregás `https://static.cloudflareinsights.com` al
`script-src` del CSP en `next.config.ts`. Elegí uno; tener los dos y que uno
falle en silencio es lo peor de los tres mundos.

---

## Cómo se verificó (para repetirlo)

```bash
# Base de producción — perfiles, roles y organizaciones
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres' <<'SQL'
select p.id, p."userId", u.email, p.name, p.role, o.name as org
from public.profiles p
left join auth.users u on u.id::text = p."userId"
left join public.organizations o on o.id = p."organizationId";
SQL

# Variables reales de producción (sin exponer secretos)
ssh ... 'docker inspect onia-platform --format "{{range .Config.Env}}{{println .}}{{end}}"'

# Dominios publicados
ssh ... "grep -rhoE 'Host\(\`[^\`]+\`\)' /etc/easypanel/traefik | sort -u"

# Qué escucha en el VPS
ssh ... 'ss -tlnp | grep -E ":5432[0-9]"'
```

Y la pantalla se **miró**, no se supuso: `app.onia.com.bo/login` renderiza el
formulario ("Hola de nuevo", 1 form, 2 inputs) y `/admin` responde `307 → /login`
sin sesión.

---

## Lo que queda pendiente y depende de vos

1. **Dar de baja a Arthur y a Camila en ONIA Center** (siguen `active`).
2. **Decidir si querés una pantalla para mirar la base de producción** — es el
   único hueco real del inventario.
3. **Encender GA4** (o decidir que no te importa y sacar el código muerto).
4. **Resolver el beacon de Cloudflare**: apagarlo o dejarlo pasar en el CSP.
5. **`.env.local` de `onia-platform` apunta al túnel de producción.** Hoy no
   rompe porque el puerto no llega, pero es una escopeta cargada apuntando al
   pie. Debería apuntar a `127.0.0.1:55322` (tu base local de verdad).
