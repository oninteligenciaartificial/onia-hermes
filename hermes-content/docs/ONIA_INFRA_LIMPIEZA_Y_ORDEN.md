# ONIA — Limpieza del VPS y orden de la base

Fuente de verdad del estado de limpieza de la infraestructura. Sin fecha en el nombre: si
cambia, se **edita este archivo**.

Última pasada: **2026-08-20**, carril INFRA, un solo operador.
Sistema: VPS Hostinger `187.77.16.63` (`srv1360183`), panel Easypanel, Docker + Swarm.
Base de producción: **self-hosted en el VPS**, contenedor `supabase-db`, base `postgres`.

---

## 0. Resumen

| | |
|---|---|
| Espacio recuperado | **39 GB** (132 GB → 93 GB usados; 69% → 48%) |
| Backup de la base | `/root/backups/limpieza-20260820-131637/` (en el VPS) — **verificado legible** |
| Workflows n8n exportados | **136 de 136** → `hermes-content/deploy/vps-ops/n8n-backup-20260820/` |
| Datos borrados de la base | **ninguno** (solo lista propuesta, ver §5) |
| Workflows borrados | **ninguno** (solo lista propuesta, ver §4) |
| Contenedores tocados | **ninguno de los que corrían** (41 corriendo antes y después) |

Lo que se hizo es **reversible o sin pérdida**: backups de deploys viejos, workspaces de
build obsoletos, caché de npm y journal rotado. Lo que borra datos o automatizaciones
quedó **escrito y esperando aprobación de Sergio**.

---

## 1. Dos premisas de partida que resultaron FALSAS

Verificadas mirando, no suponiendo. Las dos, de haberse ejecutado a ciegas, rompían producción.

### 1.1 "Los ~130 workflows restantes son ejercicios del curso UDIA y diagnósticos TEMP"

**Falso.** De los 136 workflows, **44 están ACTIVOS** — no 2.

Entre los activos que se habrían borrado están el **Backup diario**, el **VPS Healthcheck**,
el **Vigilante del chatbot**, el **Monitor de Salud n8n**, el **Telegram Command Center**,
los **11 agentes** que alimentan ONIA Center, **WF-02 QR Payment Alerts**, **WF-07 Payment
Reconciliation** y el triage de Sentry. Lista completa en §4.1.

De los 92 inactivos, solo **33 son basura real**. Los otros **59 son trabajo parado**
(WF-xx de DentalGest, GestiOS, Discord, prospección): no son ejercicios, y decidir su
destino es de Sergio.

### 1.2 "Las tres organizaciones son de QA"

**Falso: son dos.** La tercera es la organización interna que **contiene al SUPERADMIN**.

| id | nombre | qué es | veredicto |
|---|---|---|---|
| `cmsvyguui000001ril9vhxbn2` | ZZ QA Clinica Chatbot | QA, rubro dental, creada 2026-08-16 | borrable |
| `cmsw0e715000001riifvox8al` | ZZ QA Ferreteria Tornillo | QA, rubro comercio, creada 2026-08-16 | borrable |
| `c956c02fccd8573cd6fcc5b35` | **Onia (interna)** | contiene el único perfil `SUPERADMIN` (`superadmin@onia.com.bo`) | **NO TOCAR** |

Borrar la tercera dejaba el panel superadmin sin ninguna cuenta con acceso.

---

## 2. Inventario — antes y después

### 2.1 Disco

| | Antes | Después |
|---|---|---|
| `/` usado | 132 GB / 193 GB (69%) | **93 GB / 193 GB (48%)** |
| `/opt` | 52 GB | **12 GB** |
| `/root/.npm` (caché) | 674 MB | 26 MB |
| `/var/log/journal` | 179 MB | 93 MB |
| Imágenes Docker | 55 GB (36 imágenes, todas en uso) | igual — nada que recuperar sin apagar servicios |
| Volúmenes Docker | 8,45 GB (28) | igual |
| Imágenes colgadas (`dangling`) | **0** | 0 |
| Caché de build Docker | **0** | 0 |

Docker no tenía nada colgado: el problema no era Docker, era `/opt`.

### 2.2 Qué ocupaba `/opt` — backups de deploy que nadie borró

Cada deploy renombraba el directorio vivo y dejaba la copia para siempre. Se acumularon:

| App | Backups `runtime-next.*` | Peso |
|---|---|---|
| `onia-center` | **77** | 24 GB |
| `onia-platform` | 21 | 2,8 GB |
| `onia-landing` | 16 | 1,1 GB |

Más 8 workspaces de build de `onia-platform` (`build-src*`, `_build`), 6 de ellos obsoletos: 13 GB.

**Verificación antes de borrar:** se inspeccionaron los mounts de los 41 contenedores
corriendo y de los 8 servicios Swarm. El único directorio montado por app es
`/opt/<app>/runtime-next` (sin sufijo). Ningún `.bak`/`.prev` estaba montado por nada.

### 2.3 Base de producción

La base **no tiene problema de espacio**: pesa 28 MB en total.

| Schema | Peso |
|---|---|
| `pg_catalog` | 19 MB |
| `onia_center` | 10 MB |
| `public` | 5,4 MB |
| `auth` | 2,4 MB |
| `web_factory` | 1,6 MB |
| resto (`onia_sales`, `onia_ops`, `storage`, `realtime`…) | < 1 MB c/u |

- **72 tablas en `public`**, casi todas vacías: el schema está aprovisionado por las
  migraciones Prisma para todos los módulos del core, se llenan cuando se enciende cada rubro.
  No es basura, es el core esperando clientes.
- **279 índices con 0 scans = 4 MB.** Casi todos son PK o UNIQUE (restricciones, no se
  tocan). **No hay nada que ganar limpiando índices**: el ahorro máximo teórico son 4 MB.
- **8 cuentas en `auth.users`**, 2 de ellas QA.

---

## 3. Backup — dónde quedó y cómo se verificó

**Ubicación (VPS):** `/root/backups/limpieza-20260820-131637/`

| Archivo | Tamaño |
|---|---|
| `postgres-20260820-131637.dump` (formato custom) | 1,93 MB |
| `postgres-20260820-131637.sql` (texto plano) | 4,54 MB |
| `_supabase-20260820-131637.dump` | 13 KB |
| `globals.sql` (roles y permisos) | 5,3 KB |

**Verificado abriéndolo, no solo mirando que exista:**

- `pg_restore --list` sobre el `.dump` → **1948 objetos** listados (schemas `public`,
  `auth`, `dentalgest`, `extensions`, `graphql`…). El archivo es legible y tiene estructura.
- El `.sql` contiene **203 bloques `COPY`** (tablas con datos) y cabecera válida
  `PostgreSQL database dump / version 15.8`.

**Backup crudo de n8n:** `/root/backups/n8n-backup-20260820-RAW.tar.gz` (196 KB, 136 workflows
sin redactar). Ver §4.3 — **este es el único restaurable**.

---

## 4. n8n — 136 workflows exportados

Instancia: servicio Swarm `n8n-sergio_n8n` (1/1). Existe además `n8n_n8n` en **0/0 réplicas**
— una instancia vieja apagada, con su volumen `n8n_n8n_data` intacto. **No se tocó.**

Export hecho con `n8n export:workflow --all --separate` (un archivo `<id>.json` por workflow).

### 4.1 Los 44 ACTIVOS — NUNCA borrar

| id | nombre |
|---|---|
| `O0NHmyqP6Fyk4f0b` | Alta de Cliente ONIA → CRM + Correo |
| `mboH09gPgu5kAoHm` | Brief de Produccion ONIA → Correo |
| `SemAJNk7ZoZxA8D7` | Cuestionario Cliente ONIA → Correo |
| `6q0y6m9rFwFiPrXC` | ONIA - Agenda + energia del dia |
| `kB10A8oLWioS8lXP` | ONIA - Agenda Create API |
| `X6gd3EBW7Y3z9xTg` | ONIA - Agenda: Cal.com Booking |
| `uwqJDGwkkWJaFtLU` | ONIA - Agenda: Recordatorios |
| `XRS9fWY4yFMQQftF` | ONIA - Agente Building in Public |
| `Su4vVZCB9rtJ3gAy` | ONIA - Agente CEO Mensual |
| `nZkaXaZVKzgtwUqU` | ONIA - Agente Contenido y Media Lab (borradores) |
| `TBECCNhi334cOLTG` | ONIA - Agente Entrega de proyectos |
| `oKSTNdvS58ixBgnl` | ONIA - Agente Finanzas y Fondo ONIA |
| `GjNeraAVnY7HduCG` | ONIA - Agente Integraciones self-hosted |
| `nkPMoUYQ9DMIL9gM` | ONIA - Agente Prospector (CRM) |
| `ynNMGtW8TCDCBMdS` | ONIA - Agente Radar YT (ideas, panel-only) |
| `C96NmbalLhaTEf0G` | ONIA - Agente Vendedor (borradores) |
| `gN7pQld6Lh3qAcTS` | **ONIA - Backup diario** |
| `AooUOwSMSAaFLQnA` | ONIA - Chatbot: seguimiento y recordatorio |
| `gWrVHU8OxI9yugc4` | ONIA - Comentario IG -> DM (Private Reply) ← **el bueno de los 5** |
| `b6hjjNJFLuLXhRm3` | ONIA - Digest semanal (panel -> Telegram) |
| `fek4OoxRlNfpD6GZ` | ONIA - Disparador de Agentes (panel) |
| `rwQuwSvd29bV34EY` | ONIA - Generar Propuesta (oficial) |
| `drFWP7nttzvtZzso` | **ONIA - Monitor de Salud n8n** |
| `WA6VkNu5OHo6Npem` | ONIA - Nuevo Lead (speed-to-lead) |
| `ECC1THa2kTmOGepY` | ONIA - Nuvia Sourcing Score (v1) |
| `UMpcKi7wfMmC9KCw` | ONIA - Propuesta Abierta (pixel) |
| `QGXVyRSgrArxfolj` | ONIA - Radar de Novedades IA |
| `OovRU4r0o7pvglJP` | ONIA - Radar Normativo Bolivia |
| `xQaO3Sfsl9XzMiid` | ONIA - Reporte diario Sergio + Arthur |
| `Er2jSjR2fnKbDXMN` | ONIA - Sync estado agentes (24/7 real) |
| `jcmJ509pTJeqJU0Z` | ONIA - Sync gasto IA (LiteLLM -> panel) |
| `ZjaHUEMJVMXkLlmO` | ONIA - Tareas diarias reales (CRM -> panel) |
| `vuicWsvh0hwqKhYs` | ONIA - Telegram Command Center |
| `5ReZhW6QheZfbuuC` | **ONIA - Vigilante del chatbot (alerta Telegram)** |
| `VaX3lx0zibnNbg57` | **ONIA - VPS Healthcheck** |
| `GFeCZKr1zQT6CVN8` | ONIA - Web Factory QA |
| `aHFLqEtzqvq6SE3e` | ONIA - Web Factory VPS Radar |
| `ONIADailyBrief001` | ONIA Center - Briefing diario operativo |
| `w3vgUCV1yMkv70TW` | ONIA Intake Cliente a Telegram |
| `9bF53cn0lkvdUyZT` | WF-02: QR Payment Alerts |
| `DKSPEsrRYDtoSaG0` | WF-07: Payment Reconciliation |
| `F0HOvw0lpGqTdpQS` | WF-08: Welcome Email for New Patients |
| `cA7PMtzHFR47NR9W` | WF-09: Trial Expired Alert |
| `wImYWwbHGVK5tvIA` | WF-SENTRY-01 - Sentry Codex Triage |

### 4.2 Los 33 borrables — ESPERAN APROBACIÓN DE SERGIO

Todos **inactivos**. Ya están exportados, así que borrarlos no pierde nada.

**Vacíos, 0 nodos (4)**

| id | nombre |
|---|---|
| `tP2mP5BeE7bETof9` | `.` |
| `dfSpN5mb5leC2SyM` | My workflow |
| `dpkbcbEUDyRU60l3` | My workflow 2 |
| `8tQz364A2iDlUexR` | UDIA Workflow de Prueba |

**Ejercicios del curso UDIA (12)**

| id | nombre |
|---|---|
| `jVrufLM0aWnYLj8c` | [UDIA] Mi primer workflow |
| `9d6jOYklaeYTdllJ` | [UDIA] Primer flujo sencillo |
| `GWLdEFdUsHcuusng` | Action in app Udia |
| `t17aey6LEAhAITWp` | Ejercicio flujo de datos |
| `A36FdAXRPKW6ULoM` | formularios con mensajes finales |
| `8Jb45VT5MgmrahPI` | Nodos Core y HTTP REQUEST |
| `mwAL9Vx15ouc50OW` | practica flujo de datos |
| `mrwDIycuY7SgkFG0` | prueba de datos |
| `HKTDjx21ohYeO19Y` | udia |
| `Ex4Uf3PHb19tt3fz` | UDIA Bot telegram errores |
| `kYt1MnjOe1rnL5Rk` | Udia credenciales |
| `uRZxWpe41EambE0W` | udia if y switch |

**Diagnósticos TEMP (10)**

| id | nombre |
|---|---|
| `p581sT9qsuJWJwZm` | Hermes TEMP - Apply DentalGest Safe RPC Stubs |
| `DnYZpcKpTYSeaq9G` | Hermes TEMP - DentalGest PostgREST Status Check |
| `QsYDofU4pRy3fZPp` | Hermes Temporary Drive Download Bridge |
| `WICrWsMh5SOCGkms` | TEMP - Crear credencial Postgres VPS |
| `Ca1oi36rEfM8gayJ` | TEMP - Diagnostico cual Supabase cred = kvepqgikokjlacxngkiw |
| `AU2CUCAvmLBkFQeV` | TEMP - Diagnostico DB Postgres account |
| `FRobuOxGPFp0N1F2` | TEMP - Diagnostico red docker VPS para payalert |
| `ygAvtixiBfOKLFhO` | TEMP - Schema credencial postgres |
| `Pg3g88TpGPZR759E` | TEMP - Smoketest Payment Alert DB |
| `7DLfsyV1qPlTfsTI` | TEMP - Test credencial Postgres VPS |

**Pruebas ZZ TEST — el propio nombre dice "(borrar)" (3)**

| id | nombre |
|---|---|
| `LMEFUMl4oiK8izNX` | ZZ TEST credenciales Gmail (borrar) |
| `2m9l8UCZObqEF8eM` | ZZ TEST remitente credencial nueva (borrar) |
| `MqKr54wUwAkXEGPy` | ZZ TEST remitentes Gmail ronda 2 (borrar) |

**Duplicados de Instagram — se queda `gWrVHU8OxI9yugc4` (activo), se van los otros 4**

| id | nodos |
|---|---|
| `XcF5ydMLz3R0IYMd` | 10 |
| `kUwiJdrmw6hJsAXv` | 9 |
| `mxl618u4eT209hTc` | 11 |
| `w1GUalEbvYnLROUI` | 10 |

### 4.3 Los 59 inactivos que NO son basura — decisión de Sergio

Trabajo real, terminado o a medias, apagado. No entran en ninguna limpieza automática.
Grupos: **WF-00 a WF-13** de DentalGest (recordatorios, dunning, cumpleaños, digest,
onboarding WhatsApp), **WF-GS-xx** de GestiOS, **WF-DISCORD-01..06**, **WF-PROSP-01/02**,
demos de cliente (New Sakura, Chatwoot), y duplicados de workflows ONIA que hoy tienen
gemelo activo (`ONIA - Prospeccion Diaria` x2, `Guiones Diarios` x2, `Web Factory VPS Radar` x2,
`WF-00 Appointment Reminders` x2). La lista completa con id está en el `README.md` del
directorio de respaldo.

### 4.4 ⚠️ SECRETOS HARDCODEADOS EN 7 WORKFLOWS

El scan del export encontró **claves vivas dentro de los nodos**:

- **24 JWT de Supabase**
- **2 API keys de Google** (`AIza…`)
- **1 key de OpenAI** (`sk-proj-…`)

Archivos afectados: `6oowIHo8G9baBOYc` (GestiOS Weekly Admin Digest), `7avrjjM6NoRnTUrL`
(WF-11 Post-Treatment Follow-up), `B5yKh4RxrYjAHIq6` (WF-PROSP-02), `JMPS3Cv4GWKoWRwQ`
(WF-PROSP-01), `qOVpQwPZplQKYkMc` (GestiOS Birthday WA), `rqwQv6THGv3JU4tx` (WF-DISCORD-03),
`xx4wzzzqZBGfu836` (GestiOS Plan Expiry WA).

**Por eso la copia del repo va REDACTADA** (`__REDACTED_JWT__`, `__REDACTED_GOOGLE_KEY__`,
`__REDACTED_OPENAI_KEY__`): con el auto-sync activo, un export crudo en el árbol de trabajo
se commitea y publica las claves. Verificado: **0 secretos residuales** en la copia del repo.

- Copia **redactada** (repo, no restaurable tal cual): `hermes-content/deploy/vps-ops/n8n-backup-20260820/`
- Copia **cruda** (solo VPS, restaurable): `/root/backups/n8n-backup-20260820-RAW.tar.gz`

**Pendiente para Sergio:** rotar esas 3 claves distintas y moverlas a **n8n Credentials**
(el plan VPS no soporta `$env`, pero sí credenciales tipo Header Auth).

---

## 5. Datos de QA en la base — lista propuesta, NADA borrado

Peso total: **despreciable** (< 50 KB de datos reales; las tablas ocupan 64–128 KB por el
mínimo de página de Postgres). Esto es **higiene, no espacio**: mientras estén, cualquier
métrica de "clientes" y cualquier prueba del panel superadmin cuenta clínicas que no existen.

### 5.1 ZZ QA Clinica Chatbot — `cmsvyguui000001ril9vhxbn2` (28 filas)

| tabla | filas |
|---|---|
| `doctor_schedules` | 14 |
| `audit_logs` | 6 |
| `profiles` | 2 |
| `invoices` | 2 |
| `patients` | 1 |
| `treatments` | 1 |
| `chatbot_knowledge` | 1 |
| `clinic_settings` | 1 |

### 5.2 ZZ QA Ferreteria Tornillo — `cmsw0e715000001riifvox8al` (12 filas)

| tabla | filas |
|---|---|
| `doctor_schedules` | 7 |
| `profiles` | 2 |
| `audit_logs` | 2 |
| `clinic_settings` | 1 |

### 5.3 Cuentas de autenticación de QA (2)

`oninteligenciaartificial+qachatbot@gmail.com` y `oninteligenciaartificial+qacomercio@gmail.com`
en `auth.users`. Se borran **junto con** sus orgs; borrar una sola de las dos partes deja
huérfana la otra.

### 5.4 Huérfanos reales — bug de integridad, no QA

Tres filas de `public.onia_commerce_products` apuntan a organizaciones que **ya no existen**:

| id producto | organizationId (inexistente) | nombre |
|---|---|---|
| `cmsuw2yqu000n01qmt9hhtcqi` | `cmsuw2nq9000f01qm8ot6u39a` | Taladro percutor 650W |
| `cmsuw55oi000z01qm8vczjumj` | `cmsuw4ujn000r01qmsn3kgbjr` | Cable THW 12 AWG rollo |
| `cmsuwckpd001k01qmkovvhxd4` | `cmsuwc9a3001c01qmbihahqos` | Consultoria contable mensual |

Sobrevivieron al borrado de sus organizaciones: **`onia_commerce_products` no tiene FK a
`organizations`** (las tablas dentales sí la tienen, con `ON DELETE CASCADE`). Además de
borrar las filas, hay que **agregar la FK**, o el próximo borrado de org vuelve a dejar basura.

### 5.5 Lo que NO se borra

- Organización `c956c02fccd8573cd6fcc5b35` **Onia (interna)** y su perfil `SUPERADMIN`.
- Cuentas `sergio@onia.com.bo`, `arthur@onia.com.bo`, `vendedora@onia.com.bo`,
  `superadmin@onia.com.bo`.
- Nota menor: `tukomaluko2310@gmail.com` y `sergio.urcullo.m@onia.local` existen en
  `auth.users` **sin perfil asociado** (nunca completaron onboarding). Sergio decide.

---

## 6. Qué se borró de verdad (y cuánto dio cada cosa)

| Grupo | Qué | Recuperado |
|---|---|---|
| Backups de deploy `runtime-next.*` | 75 de `onia-center`, 19 de `onia-platform`, 14 de `onia-landing` | **26,6 GB** |
| Workspaces de build obsoletos | `_build`, `build-src-viejo`, `build-src-aa2ab80`, `build-src-c84a1c0`, `build-src-0a4da68`, `build-src-662d388` | **13 GB** |
| Caché de npm | `npm cache clean --force` | 648 MB |
| Journal del sistema | `journalctl --vacuum-size=100M` | 87 MB |
| Imágenes Docker colgadas / caché de build | no había ninguna | 0 |
| **Total** | | **≈ 39 GB** |

**Criterio de conservación aplicado:**

- Se conserva el `runtime-next` **vivo** (el que está montado) **+ los 2 backups más
  recientes** de cada app, como punto de rollback.
- Se conserva `/opt/onia-platform/build-src` porque **el guardián lo usa**
  (`/root/bin/claude-guardia.sh` línea 63: `cd /opt/onia-platform/build-src`), y
  `build-src-nuevo` por ser el más reciente.
- Ninguno de los directorios borrados tenía `.git` ni trabajo sin commitear: son copias del
  fuente nombradas por el SHA que se construyó.

**Lo que NO se tocó a propósito:**

- Imágenes Docker (55 GB): las 36 están en uso por contenedores vivos.
- Volúmenes Docker: 11 figuran como "dangling", pero `n8n_n8n_data` pertenece al servicio
  Swarm `n8n_n8n` escalado a 0 — "sin contenedor" no es "sin usar". No se borró ninguno.
- `/root/.cache/ms-playwright` (1,2 GB): es el navegador con el que se verifican las pantallas.
- Contenedores corriendo, variables de entorno, modelos, redes, servicios Swarm.

---

## 7. Verificación posterior — mirando, no suponiendo

### 7.1 Login de producción — **RENDERIZA BIEN**

`https://app.onia.com.bo/login` abierto con Playwright + Chromium headless y la captura
**leída**, no solo guardada.

- HTTP **200**, `networkidle` en **2,77 s**.
- Título correcto, 2 inputs y 3 botones presentes.
- Captura: los iconos se ven como **glifos**, no como texto. Se ven bien el rayo,
  la tarjeta tachada, el robot, el escudo y el "crear cuenta".
- Único request fallido: `static.cloudflareinsights.com/beacon.min.js` bloqueado por CSP.
  Inocuo: es telemetría de Cloudflare.

> **Ojo con esta trampa.** El `innerText` de la página **sí** devuelve `credit_card_off` y
> `verified_user` — pero eso es **normal y correcto**: Material Symbols es una fuente de
> **ligaduras**, el texto del DOM *es* el nombre del icono y la fuente lo dibuja. Un grep
> del texto da falso positivo del bug viejo. **Solo la captura lo desmiente.** Confirmado
> además por código: la fuente `Material Symbols Outlined` figura como `loaded`, y
> `/fonts/material-symbols-outlined.woff2` responde 200 (243 KB, subset instalado el
> 2026-08-18 23:46 para resolver el problema de los 3,9 MB / 117 s; el original completo
> quedó de respaldo en `/root/ms-full-backup-20260815.woff2`).

### 7.2 Bot — **RESPONDE**

Corre como proceso node dentro del contenedor `onia-center`, puerto interno **3020**.

- `/health` → `{"ok":true,"service":"onia-chatbot-webhook","auth":{"ok":true},"db":{"ok":true,"latencyMs":40}}`
- `/preview` (turno real del motor, sin tocar base ni WhatsApp) con el mensaje
  *"hola, quiero saber los precios"* → devolvió **2 respuestas coherentes**
  (plantillas `M0_SIN_HORARIOS` y `M4_BODY`), en español, con el discurso comercial correcto.

### 7.3 Resto del sistema

- **41 contenedores corriendo** antes y después. Ninguno reiniciado (`docker ps` no muestra
  uptimes en segundos ni minutos).
- **`supabase-auth2` conserva su alias de red**: `supabase_default: [auth supabase-auth2]`.
  Desde `supabase-kong`, `getent hosts auth` → `172.19.0.5`. La cadena Kong→auth está sana
  (`/auth/v1/health` devuelve 401 "No API key found", que es Kong haciendo su trabajo).
- **8 servicios Swarm** en sus réplicas esperadas. No se reinició ninguno — y si hiciera
  falta, se usa `docker service update --force`, nunca `docker restart` (deja zombi).

**Nada se rompió. No hubo que revertir nada.**

---

## 8. Pendiente de aprobación de Sergio

| # | Qué | Riesgo si se hace | Riesgo si no se hace |
|---|---|---|---|
| 1 | Borrar los **33 workflows** de §4.2 | ninguno (exportados) | ruido: 136 workflows para encontrar 44 |
| 2 | Decidir los **59 inactivos** de §4.3 | perder trabajo parado | siguen ocupando la lista |
| 3 | **Rotar las 3 claves** hardcodeadas de §4.4 y moverlas a n8n Credentials | los 7 workflows dejan de correr hasta reconfigurar | claves vivas en 7 workflows y en un tar del VPS |
| 4 | Borrar las **2 orgs de QA** (40 filas) + sus 2 cuentas `auth` | ninguno (backup verificado) | métricas y panel superadmin con clínicas falsas |
| 5 | Borrar los **3 productos huérfanos** y **agregar la FK** faltante en `onia_commerce_products` | ninguno | el próximo borrado de org deja basura otra vez |
| 6 | Sacar el override `ONIA_BOT_MODEL=gpt-4.1-mini` de `/opt/onia/bot/webhook.env` | **cambia el comportamiento del bot** — requiere probar de nuevo el motor | el bot corre en un modelo distinto al previsto |

### Además, anotado y no tocado

- **El bot corre desde `/tmp` dentro del contenedor** (`/tmp/onia-bot/webhook-server.mjs`,
  levantado a mano el 2026-08-18). Si `onia-center` se reinicia, **el bot no vuelve solo**.
  Debería tener arranque propio (servicio o entrypoint), no un `docker exec` manual.
- **26 contenedores en estado `Dead`** que Docker lista pero ya no puede borrar
  (`docker rm` → "No such container"). Ocupan **0 bytes** — es metadata rancia del daemon.
  Se limpia sola con un reinicio de `dockerd`, que **baja todo el VPS**: solo en ventana de
  mantenimiento, no vale la pena por sí sola.
- **El guardián lee un fuente viejo**: `claude-guardia.sh` diagnostica contra
  `/opt/onia-platform/build-src` (2026-08-16), pero el último build es `build-src-nuevo`
  (2026-08-18). Diagnostica sobre código desactualizado. Cambiarlo es una línea, pero
  cambia comportamiento del guardián.
- **Los deploys no rotan sus backups.** Sin un `keep-2` en el script de deploy, en dos meses
  vuelven a ser 40 GB. Es la causa raíz de esta limpieza.
