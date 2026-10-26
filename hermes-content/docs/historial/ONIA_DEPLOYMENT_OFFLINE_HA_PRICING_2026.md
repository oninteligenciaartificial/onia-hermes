# ONIA - Plan de Despliegue: Offline, Alta Disponibilidad, Precios e Instalador (2026)

Fecha: 2026-07-22. Estado: plan de despliegue (extiende `onia-core/ONIA_DEPLOYMENT_MODELS_2026.md`).
Owner: ONIA / Hermes. Desarrollado con subagentes (2026-07-22).

Responde las preguntas de Sergio (2026-07-22): instalar el sistema localmente en el servidor de una empresa, funcionar offline si se corta internet, garantizar que el SaaS este siempre activo, el posicionamiento ERP vs SaaS, y el precio/costo de cada modelo de entrega.

> **Base:** `onia-core/ONIA_DEPLOYMENT_MODELS_2026.md` define los 3 modelos de entrega (A = SaaS cloud, B = VPS gestionado, C = on-premise). Este doc los EXTIENDE con offline-first, alta disponibilidad, precios e instalador on-prem. Contexto: core v1.0.0 COMPLETO; DentalGest es un SaaS real ~90% vendible; emisor SIAT listo pre-piloto.

---

## Posicionamiento ERP + empaquetado del instalador on-premise

> Extiende `onia-core/ONIA_DEPLOYMENT_MODELS_2026.md`. Ese doc fija los 3 modelos de entrega (A SaaS cloud, B VPS gestionado, C on-premise), deja hecho el ensayo de backup/restore y marca 4 pendientes para "vender el Modelo C mañana". Esta sección resuelve dos de ellos: el **posicionamiento comercial** (cómo se nombra y se vende) y el **empaquetado reproducible** del instalador. No repite los 3 modelos; los usa como dado.

---

### Parte 1 — Posicionamiento: es un ERP, no un "SaaS"

**El error de framing que hay que corregir.** "SaaS" describe *cómo entregamos* (software por suscripción, hosteado por nosotros), no *qué es* el producto. Lo que ONIA construyó — DentalGest y sus hermanos sobre ONIA Core v1.0.0 (9 módulos: operaciones, inventario/comercio, finanzas, nómina, conocimiento, automatización, agentes human-in-the-loop, etc.) — es un **ERP**: gestiona la empresa entera (operación + finanzas/contabilidad + fiscal Bolivia SIAT + agentes IA 24/7). Ese mismo ERP, misma base de código, se entrega de 3 formas. "SaaS mensual" es una de las tres, la puerta de entrada barata.

| Eje | SaaS ("lo que decís hoy") | ERP (lo que realmente es) |
|---|---|---|
| Qué vende | "una app en la nube por mes" | "el sistema que corre tu empresa" |
| Percepción de precio | gasto chico recurrente | inversión de infraestructura del negocio |
| Techo de cuenta | pyme | empresa mediana/grande con datos sensibles |
| Modelo de entrega | A (cloud) | A **o** B (VPS gestionado) **o** C (en tu servidor) |

**Regla de naming según con quién hablás:**

- **Cliente chico / clínica / pyme** → hablás de **"sistema" o "plataforma" en la nube, por mes**. No decís "ERP" (asusta, suena caro y lento). Vendés Modelo A.
- **Empresa mediana / grande / con área de sistemas** → decís **"ERP boliviano con IA"** y ofrecés **"tu ERP en tu propio servidor"** (Modelo B o C). Acá "ERP" suma: es el vocabulario que el gerente ya usa para justificar la compra.

#### Mensaje de venta por segmento (un párrafo cada uno)

**Chico (SaaS mensual — Modelo A).**
> "Tené tu clínica/negocio funcionando online hoy, sin instalar nada ni comprar servidores. Agenda, cobros, facturación electrónica SIAT y un asistente que trabaja 24/7 respondiendo y ordenando tu operación. Pagás por mes desde ~320 Bs y arrancás esta semana. Si más adelante querés todo en tu propia máquina, es el mismo sistema: te lo mudamos." *(Precios lanzamiento DentalGest 320/750/1500 Bs/mes; ratificados 390/890/1990.)*

**Mediano (VPS gestionado — Modelo B).**
> "Tu empresa con su propia infraestructura, sin que tengas que operar nada. Ponemos tu ERP, tu WhatsApp y tus automatizaciones en un servidor tuyo; nosotros lo administramos, actualizamos y monitoreamos. Tus datos viven en tu servidor, no en una nube compartida, y pagás una gestión mensual — no un equipo de sistemas." *(Modelo ya probado con Bolivian Electric.)*

**Grande / "los datos no salen de acá" (on-premise — Modelo C).**
> "Tu ERP completo dentro de tu empresa: corre en tu servidor, en tu red, sin depender de internet para operar. Datos 100% adentro — para cumplimiento, para tu directorio, para tu tranquilidad. Nosotros lo instalamos, lo integramos con tus sistemas locales y te damos soporte remoto por túnel seguro, con respaldos diarios a tu propio NAS. Licencia anual + instalación, no una suscripción que se corta si dejás de pagar el mes."

#### Qué NO somos (posicionamiento defensivo)

- **No competimos con SAP / Oracle / Dynamics.** Esos son proyectos de 6–18 meses, consultoras caras y rigidez. Nuestro pitch es lo opuesto.
- **Somos el ERP boliviano con IA:** (1) **nativo Bolivia** — SIAT, IVA/IT/IUE, tipo de cambio flotante (RM 245/2026), Bs y USD, realidad de PyME sin internet estable; (2) **rápido de implementar** — semanas, no meses; (3) **vertical por rubro** — DentalGest (clínicas), GestiOS (servicios), ProveeGest (importadoras/distribuidoras), Ganadero OS (offline-first), no un genérico que hay que parametrizar 6 meses; (4) **con agentes IA de fábrica**, no un módulo de "IA" pegado después.
- **Una línea para cerrar:** *"SAP es para cuando ya sos una corporación. ONIA es el ERP que te lleva hasta ahí — hecho en Bolivia, con IA, andando en semanas."*

---

### Parte 2 — Empaquetado del instalador on-premise (Modelo C)

**Punto de partida (ya existe, no rehacer).** El artefacto base está construido: `docker-compose.selfhost` de DentaGest (app Next.js + Supabase completo + Caddy) con la migración de **namespace `dentalgest` (schema)**, más un stack de ensayo `dentalgest-staging-supabase` corriendo *healthy* en el VPS ONIA, y el **ensayo de backup/restore ya ejecutado** (pg_dump custom del schema `dentalgest` → restore a base scratch → 24/24 tablas verificadas, 2026-07-04). Lo que falta NO es tecnología nueva: es **empaquetar lo que existe en un procedimiento repetible** para que instalar en un cliente sea checklist, no aventura.

> Nota de repos: el `docker-compose.selfhost` vive en el repo de producto **DentaGest** (separado, por la regla de "productos con cliente van aparte"). El instalador que se define abajo es un envoltorio operativo alrededor de ese artefacto; no toca el core ni el cerebro Hermes.

#### 2.1 — Script/checklist de instalación (`install-onprem.sh`)

**Requisitos mínimos del cliente (pre-check que corre el instalador antes de tocar nada):**

| Requisito | Mínimo | Ideal | Nota Bolivia |
|---|---|---|---|
| SO | Linux (Ubuntu 22.04+/Debian) **o** Windows 10/11 con Docker Desktop | Linux server dedicado | Windows Docker Desktop sirve para equipos chicos (lo dice el doc base); Linux para el que quiere estabilidad |
| Docker | Docker Engine 24+ y Docker Compose v2 | idem | el instalador lo detecta; si falta, guía de instalación por SO |
| CPU / RAM | 4 vCPU / 8 GB | 4 vCPU / 16 GB | referencia: el VPS ONIA (4 vCPU/15GB) corre un stack más pesado; el selfhost de un cliente es más liviano |
| Disco | 40 GB libres SSD | 100 GB SSD | + espacio para volúmenes de Postgres y backups locales |
| Red | LAN estable | + NAS en la red | acceso desde la red local; internet NO requerido para operar (clave en Bolivia) |
| Túnel soporte | Tailscale instalable | idem | opcional pero recomendado para actualizaciones/soporte |

**Flujo del script (idempotente, seguro de re-correr):**

```
1.  pre-check    → verifica SO, Docker, RAM/CPU/disco; aborta con mensaje claro si falta algo
2.  fetch        → clona/actualiza el repo DentaGest a un tag FIJADO (no "latest": ej. v1.0.0)
3.  secrets      → genera .env desde plantilla: POSTGRES_PASSWORD, JWT/anon/service keys de
                   Supabase, WEBUI/app secrets (todo aleatorio, nunca hardcodeado)
4.  namespace    → confirma schema `dentalgest` en las migraciones (ya existe)
5.  up           → docker compose -f docker-compose.selfhost up -d
6.  migrate      → corre migraciones + seed inicial de la organización
7.  wizard       → deja lista la URL local para el wizard /setup (crea la org, 9/9 entidades)
8.  siat         → configura el external_gate del emisor SIAT (NIT del cliente) — [VERIFICAR: S2 NIT]
9.  health       → espera healthchecks (app, db, caddy) en verde; imprime checklist de verificación
10. handoff      → genera un reporte de instalación (versión, puertos, credenciales admin en sobre cerrado)
```

**Checklist de verificación post-instalación (imprime el script, se firma en la entrega):**

- [ ] `docker compose ps` → todos los servicios *healthy*
- [ ] App abre en la red local (`http://<ip-servidor>:<puerto>`)
- [ ] Login admin funciona; wizard `/setup` completó la organización
- [ ] Se emite una **factura SIAT de prueba** (external_gate respondiendo)
- [ ] Backup manual corre y produce un dump válido (ver 2.3)
- [ ] Túnel Tailscale conectado y ONIA puede alcanzar el host (ver 2.2)

#### 2.2 — Runbook de actualización remota por túnel Tailscale, con rollback

**Principio:** actualizar es `git pull` a un **tag nuevo** + `docker compose up -d`, siempre en **ventana acordada** con el cliente, con **rollback ensayado** antes de tocar producción. Nunca "latest": se avanza de tag a tag para que el rollback sea determinístico.

**Pre-condiciones de la ventana:**

- Backup fresco tomado **antes** de actualizar (dump + snapshot de volúmenes si aplica).
- Anotar el **tag/SHA actual** (`git rev-parse HEAD`) como punto de rollback.
- Cliente avisado; ventana fuera de horario de atención.

**Procedimiento (por túnel Tailscale, ONIA entra por SSH a la tailnet del cliente):**

```
# 0. conectar por Tailscale a la máquina del cliente, cd al repo
# 1. respaldo previo (obligatorio)
./backup-now.sh                          # dump + verificación (2.3)
git rev-parse HEAD > /tmp/rollback.sha   # punto de retorno

# 2. traer la versión nueva (tag fijado, revisado antes en staging ONIA)
git fetch --tags
git checkout v1.1.0

# 3. aplicar
docker compose -f docker-compose.selfhost pull
docker compose -f docker-compose.selfhost up -d
# migraciones idempotentes se corren en el arranque

# 4. verificar (mismos checks que la instalación)
./healthcheck.sh                         # servicios healthy + factura SIAT de prueba

# 5a. si OK → cerrar ventana, registrar versión
# 5b. si FALLA → ROLLBACK
git checkout $(cat /tmp/rollback.sha)
docker compose -f docker-compose.selfhost up -d
./restore-if-needed.sh                   # restaura el dump previo SOLO si una migración
                                         # avanzó el schema de forma incompatible
```

**Reglas de rollback:**

- Rollback de **código/imagen** siempre es seguro (volver al tag anterior).
- Rollback de **datos** solo si una migración destructiva corrió: por eso el backup previo es innegociable. Las migraciones deben ser **forward-only e idempotentes**; las destructivas se marcan y se prueban en el staging ONIA **antes** de la ventana del cliente.
- **Tailscale como estándar de soporte:** una tailnet por relación, ACL que limita el acceso ONIA a los hosts del cliente. [VERIFICAR: decidir si es la tailnet de ONIA con el cliente como nodo, o la del cliente con ONIA invitado — implica quién es dueño del control de acceso.]

#### 2.3 — Backup: dump diario a NAS + copia cifrada offsite opcional

Reutiliza el procedimiento ya ensayado (pg_dump custom del schema, restore verificado). Falta solo automatizarlo como cron, que es justo el pendiente que el doc base deja abierto.

| Capa | Qué | Dónde | Frecuencia | Retención (propuesta) |
|---|---|---|---|---|
| Diario local | `pg_dump -Fc` del schema `dentalgest` + volúmenes de archivos | **NAS del cliente** (montado en la red local) | nocturno (cron) | 30 días rotativos |
| Offsite opcional | copia del dump **cifrada (gpg/age)** | storage ONIA (R2/S3) o disco externo | diario o semanal | 90 días |
| Verificación | restore de prueba a base scratch | en el mismo host o staging ONIA | mensual | — |

```
# backup-now.sh (esqueleto; corre por cron y a mano)
pg_dump -Fc -n dentalgest -f /mnt/nas/backups/dentalgest_$(date +%F).dump
# opcional offsite cifrado:
age -r $ONIA_BACKUP_PUBKEY -o backup.age dentalgest_$(date +%F).dump && rclone copy backup.age onia-r2:client-xyz/
# verificación mensual: pg_restore a base scratch, contar tablas (esperado 24/24), limpiar
```

- **NAS es el destino natural** (lo dice el doc base): si el cliente ya tiene NAS (común en empresa con ERP local), se aprovecha; no se vende hardware salvo que no lo tenga.
- La copia offsite es **opt-in** (algunos clientes on-prem justamente NO quieren que nada salga: se respeta y se documenta que renunciaron al offsite).
- **Cifrado siempre** en la copia que sale de la LAN; la clave la custodia ONIA, nunca viaja con el backup.

#### 2.4 — Checklist de entrega / onboarding del cliente on-prem

| Fase | Ítem | Responsable |
|---|---|---|
| **Pre-venta** | Confirmar Modelo C es el correcto (señal: "los datos no salen" / ERP local a integrar) | ONIA comercial |
| | Relevar hardware (¿tiene servidor?, ¿NAS?, SO), NIT para SIAT, sistemas a integrar (ej. SQL Server tipo TR4) | ONIA |
| **Contrato** | Licencia anual + instalación + plan de soporte firmados; alcance de integraciones | ambos |
| **Instalación** | Correr `install-onprem.sh`; pasar checklist de verificación (2.1) | ONIA |
| | Configurar túnel Tailscale + ACL de soporte | ONIA |
| | Configurar backup a NAS + (opcional) offsite cifrado; correr primer backup y verificar | ONIA |
| **Datos** | Migrar/cargar datos iniciales del cliente; wizard `/setup`; emitir factura SIAT de prueba | ambos |
| **Capacitación** | Sesión de uso con el equipo del cliente; entregar guía rápida por rubro | ONIA |
| **Handoff** | Documento de entrega: versión instalada, puertos, credenciales admin (sobre cerrado), datos del túnel, ventana de mantenimiento pactada, contacto de soporte y SLA | ONIA |
| **Post** | Agendar primera ventana de actualización; monitoreo (Uptime Kuma apuntando por túnel, opcional) | ONIA |

#### 2.5 — Estructura de precio del Modelo C (para completar el pendiente #2 del doc base)

El doc base pide "definir precio de licencia + instalación + soporte anual" y lo deja abierto. Es **decisión de negocio (bloqueo humano S1)**, así que acá va solo la *estructura* y un rango con supuesto explícito, no el número final.

| Componente | Qué cubre | Rango propuesto [VERIFICAR — S1] | Supuesto |
|---|---|---|---|
| Licencia anual | derecho de uso del ERP on-prem + updates del año | ~12–18 meses del plan SaaS equivalente | ancla: plan top **Empresa Bs 2.900/mes ≈ 34.800 Bs/año** (Completo Bs 1.500 ≈ 18.000/año), leídos de `subscription-plans.ts`; on-prem debe recuperar el margen recurrente que se pierde al no hostear |
| Instalación (one-time) | pre-check, install, integración, capacitación, handoff | fijo por complejidad (chico vs con integraciones tipo TR4) | cobra el trabajo real de campo, no los píxeles |
| Soporte anual | actualizaciones por túnel, incidentes, verificación de backups | % de la licencia (ej. 15–25%/año) | recurrente que reemplaza el margen del SaaS |

- **Regla ONIA aplicada:** se cobra la automatización, el resultado y el soporte recurrente, no "el software". El margen del Modelo C vive en el **soporte anual + updates**, igual que el mensual del SaaS.
- **Dominio/hosting/energía del servidor: a cargo del cliente** (es su fierro), nunca dentro del precio ONIA — consistente con la regla de propuestas.
- Conversión Bs↔USD: presentar en **Bs primario**; el USD es referencial y **flota a diario** desde RM 245/2026 (oficial ~9.83 + spread bancario ~0.10). Fijar la equivalencia USD al momento de cotizar, no en el doc.

---

### Cómo esto cierra los pendientes del doc base

El doc base lista 4 pendientes para "vender el Modelo C mañana". Esta sección entrega:

1. **Instalador reproducible (script + checklist)** → 2.1 + 2.4 ✅
2. **Precio licencia + instalación + soporte** → estructura en 2.5, número final pendiente de **S1** ⏳
3. **Runbook de actualización remota por túnel con rollback** → 2.2 ✅
4. **Probar restore completo en staging** → el drill de schema ya corrió (24/24); falta el **restore completo (no solo schema)** que el doc marca en fase 5 ⏳

Quedan como código a escribir (no diseño): los tres scripts esqueleto (`install-onprem.sh`, `backup-now.sh`, `healthcheck.sh`/`restore-if-needed.sh`) y el drill de restore completo. Todo se apoya en artefactos que ya existen.

---

## Offline-first / tolerancia a cortes (internet y luz)

> Extiende `ONIA_DEPLOYMENT_MODELS_2026.md`. Aquel doc define *dónde* corre el sistema (A SaaS cloud, B VPS gestionado, C on-premise). Esta sección responde la pregunta que sigue: **¿qué pasa cuando se cae internet o la luz?** — por modelo, con qué se sigue trabajando y con qué no, y por qué la **factura SIAT nunca se pierde**.

### Regla de oro: separar "se cae internet" de "se cae la luz"

Son dos fallas distintas y se mitigan distinto. Confundirlas lleva a promesas falsas al cliente.

| Falla | Qué deja de funcionar | Mitigación |
|---|---|---|
| **Internet externo** (el proveedor del cliente se cae) | Llamadas a servicios externos: SIAT, WhatsApp, LLM, y —en cloud (A/B)— el propio servidor | En on-premise (C) **no afecta la operación** (todo es red local). En SaaS/cloud, la salva la capa offline del dispositivo. Los externos se **difieren/encolan**, no se pierden. |
| **Luz / red local** (se corta la corriente o cae el switch/router de la oficina) | En C, el servidor local se apaga → cae todo lo local. En A/B, siguen funcionando las tablets con batería mientras tengan cache offline | **UPS** en el servidor local + red (C); baterías de los dispositivos; captura offline en el navegador (A/B) |

La conclusión operativa: **on-premise tolera cortes de internet; ningún modelo tolera un corte de luz sin UPS/batería.** Vender esto claro evita la queja "me dijeron que funcionaba sin internet y se apagó todo".

---

### Modelo C (on-premise): corre en la red LOCAL

El sistema y su base viven en un servidor/mini-PC dentro de la empresa (stack `docker-compose.selfhost` de DentaGest, ya construido — ver doc base §Modelo C). Los usuarios acceden por la red interna (LAN/Wi-Fi de la oficina).

**Qué garantiza:**
- Si se cae **internet externo**, el sistema **sigue operando adentro sin degradación**: agenda, fichas, caja, notas, inventario — todo va contra el servidor local por LAN, que no necesita internet.
- Sólo se **cae si se corta la luz o la red local** (switch/router/servidor). No es un problema de internet, es de infraestructura eléctrica.

**Requisitos que ONIA especifica en la instalación:**
1. **UPS (no-break) en el servidor local + el switch/router.** Da autonomía para cerrar bien una operación o aguantar un microcorte. Rango orientativo para un mini-PC/NUC + red: UPS de ~600–1200 VA, en Bolivia **[VERIFICAR precio local]** ≈ Bs 400–1.000 (USD ~60–145), línea SOHO tipo APC/Forza. Supuesto: consumo bajo (mini-PC + router), 15–40 min de autonomía; no cubre jornada entera (para eso, generador, fuera de alcance ONIA).
2. **La app no depende de llamadas externas para operar.** Diseño obligatorio: SIAT, WhatsApp y LLM son **opcionales/diferibles**, nunca en el camino crítico de guardar una cita, un cobro o una nota. Si el SIN o WhatsApp no responden, la operación local se completa igual y lo externo queda en cola.
3. **Backup local** al NAS/disco externo de la oficina (dump nocturno; ver doc base §NAS y §Ensayo de backup/restore ya ejecutado). Un corte de luz no debe implicar pérdida de datos: Postgres es transaccional y el UPS permite apagado ordenado.

**Internet en Modelo C sólo hace falta para:** emitir SIAT en línea, enviar WhatsApp, respuestas de agentes IA (LLM), actualizaciones remotas y soporte por túnel (Tailscale). Todo eso es **diferible**: se acumula y se procesa al volver el enlace.

---

### Modelo A (SaaS) y B (VPS gestionado): tolerancia offline en el dispositivo

En SaaS (A) y en VPS gestionado en la nube (B), el servidor está **fuera** de la oficina. Si el cliente pierde internet, el navegador/tablet no llega al servidor → sin una capa offline, la app se cae aunque el servidor esté sano. La tolerancia hay que construirla **en el dispositivo**.

> Nota Modelo B: depende de **dónde vive el VPS**. Si es un VPS en datacenter (caso Bolivian Electric, srv1793230), desde la oficina se comporta igual que SaaS ante un corte de internet local. Si el cliente aloja el VPS físicamente en su edificio, se comporta como on-premise. **[VERIFICAR con cada cliente B]** — ver Preguntas abiertas.

**Arquitectura offline (porta el patrón YA probado en Ganadero OS):**

```text
PWA / navegador
  -> service worker (cachea app shell: la app carga sin red)
  -> IndexedDB (lectura local de lo bajado en el último sync)
  -> cola de mutaciones (mutationQueue) — captura offline
  -> sync engine -> /api/sync/pull y /api/sync/push al reconectar
  -> Postgres canónico (Supabase/VPS)
```

Fuente del patrón: `Ganaderos-Os/docs/OFFLINE_FIRST.md` + entidades ya en el schema (`Ganaderos-Os/prisma/schema.prisma`):
- **`SyncDevice`** — registra cada dispositivo (`deviceKey` único por organización).
- **`SyncOperation`** — **idempotencia** por `clientMutationId` (si la operación ya se aplicó, devuelve el resultado previo; reenviar la cola no duplica).
- **`SyncConflict`** — conflictos que no se resuelven solos, para revisión humana.
- Cada entidad sincronizable lleva **`version`** (control optimista) y **`deletedAt`** (soft delete, nunca borrado físico offline).

**Resolución de conflictos (regla portada de Ganadero OS):**
1. `baseVersion === server.version` → aplica el cambio y sube `version + 1`.
2. `baseVersion < server.version` → crea `SyncConflict` (alguien editó primero); se resuelve: *mantener servidor* / *aplicar mi cambio* / *fusión manual*.
3. Operación ya vista por `clientMutationId` → devuelve resultado previo (idempotente).
4. Registro eliminado (`deletedAt != null`) → bloquea o pide revisión.
5. **Eventos append-only** (cobro, nota clínica, pesaje, movimiento) casi nunca chocan: se insertan sin conflicto si la entidad padre existe. Los **datos maestros** (paciente, animal) sí usan `baseVersion`.

**UX offline obligatoria** (no ocultar el estado; Ganadero OS §UX): "Sin conexión: guardando en este dispositivo" · "Pendiente de sincronizar: N cambios" · "Sincronizado hace X min" · "Conflictos por revisar".

**Estado real (honestidad, no inventar):** DentalGest hoy es un SaaS Next.js (Supabase Cloud + Vercel) que **requiere internet para operar** — la capa PWA offline **aún no está portada** a DentalGest; existe **diseñada y con entidades de servidor listas en Ganadero OS**. Portarla a DentalGest/GestiOS es **roadmap**, no estado actual. Ver Preguntas abiertas (decisión de alcance y pricing).

---

### Facturación SIAT offline: se ENCOLA en contingencia, NO se pierde

Esta es la operación más delicada porque toca al SIN, y aplica a **los tres modelos**: emitir factura en línea necesita alcanzar al SIN. Cuando el SIN no responde (por corte de internet o caída del propio SIN), **el emisor entra en contingencia** — no frena la venta.

Mecánica ya construida y testeada (`hermes-content/integrations/siat/`, 262 tests; el core nunca factura, es `external_gate`):
- **Detección conservadora** (`contingencia.mjs → shouldEnterContingency`): se considera sano **sólo** si el SIN respondió `ok === true`; ante timeout, error o silencio, **entra en contingencia** para no frenar la emisión.
- **Acumulación en paquetes ≤ 500** (`packageOfflineInvoices`; `PACKAGE_LIMITS.offlineMax = 500`).
- **Reenvío dentro de 48 h** (`isOfflineSendOverdue`; `DEADLINES.offlineSendHours = 48`) y ventana de **evento significativo hasta 48 h** después (`isSignificantEventWindowOpen`).
- **Clasificación de estado del SIN** al reprocesar: `901 pendiente` / `904 observada` / `908 validado` (`classifyBySinStatus`).
- La factura queda en la **cola de la máquina de estados** (`emission-state.mjs`: `queued → sent → validated|observed|rejected`); si el transporte cae, sigue en cola, **no entregada** (`emitter.mjs`). Al volver el enlace, el scheduler reenvía.

Traducción para el cliente: **la venta se cobra y el comprobante se genera en el momento**; el envío legal al SIN se completa automáticamente al reconectar, dentro de los plazos de la norma. Base normativa y códigos: `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md` §2.3 (contingencia y eventos significativos). Esto **no es asesoría fiscal**.

---

### Tabla: operación × modelo × tolera-offline

Semántica de "offline" **según el modelo** (importante, cambia el significado de cada celda):
- **Modelo C (on-premise):** "offline" = sin internet externo, **con red y luz local up**. Todo lo local funciona pleno; sólo lo externo se difiere.
- **Modelos A / B-cloud:** "offline" = el dispositivo perdió internet y no llega al servidor. Lo salva **la capa PWA offline** (roadmap en DentalGest; ver nota).

| Operación | C (on-premise, sin internet) | A / B-cloud (dispositivo sin internet) | Notas |
|---|---|---|---|
| Consultar agenda / ficha / historial | ✅ pleno (LAN) | ✅ lectura de lo bajado en el último sync (IndexedDB) | En A/B, sólo lo pre-cargado |
| Registrar / editar cita o turno | ✅ pleno | ✅ se encola (mutationQueue) → sync al reconectar | Append/maestro con `version` |
| Registrar cobro / pago en caja | ✅ pleno | ✅ se encola (append-only, sin conflicto) | El dinero se registra; SIAT va aparte |
| Registrar nota clínica / evolución | ✅ pleno | ✅ se encola (append-only) | Idempotente por `clientMutationId` |
| Registrar inventario / movimiento / gasto | ✅ pleno | ✅ se encola | |
| **Emitir factura SIAT en línea** | ⏳ **contingencia** (paquetes ≤500, reenvío ≤48 h) | ⏳ **contingencia** (misma cola del emisor) | **No se pierde**; se completa al reconectar |
| Anular factura SIAT | ⏳ se difiere; plazo legal hasta día 9 del mes siguiente | ⏳ se difiere | Ventana amplia; no urge offline |
| Enviar WhatsApp / recordatorio | ⏳ se encola (n8n/proveedor) | ⏳ se encola | Externo diferible |
| Respuesta de agente IA (LLM) | ⏳ se difiere | ⏳ se difiere | Opcional; nunca en camino crítico |
| Cambiar plan / billing / pagos | ❌ online-only | ❌ online-only | Requiere pasarela + servidor |
| Gestión de usuarios / superadmin | ❌ online-only | ❌ online-only | Seguridad: no offline |
| Importación masiva / borrado definitivo | ❌ online-only | ❌ online-only | Irreversible: nunca offline |

Leyenda: ✅ funciona offline · ⏳ se captura/encola y se completa al reconectar (no se pierde) · ❌ requiere conexión al servidor.

---

### Qué compromete ONIA por modelo (dónde importa internet y dónde no)

| Modelo | Compromiso ante corte de **internet** | Compromiso ante corte de **luz/red local** | Qué instala/recomienda ONIA |
|---|---|---|---|
| **A — SaaS cloud** | Con capa PWA offline (roadmap): lectura + captura en el dispositivo; sync al reconectar. Sin ella (hoy): **requiere internet** | Depende de la batería del dispositivo | Roadmap PWA offline; mientras tanto, SLA de internet a cargo del cliente |
| **B — VPS gestionado** | Igual que A si el VPS es cloud; igual que C si el VPS está físico en la oficina **[VERIFICAR por cliente]** | Igual criterio | Definir ubicación del VPS en el onboarding |
| **C — on-premise** | **Sistema disponible pleno** (todo local). Internet sólo para SIAT/WhatsApp/LLM/updates/soporte — todo diferible | **Cae si no hay luz/red**; UPS da autonomía y apagado ordenado | **UPS** en servidor + red, backup a NAS/disco, app sin dependencias externas en el camino crítico |
| **SIAT (los 3)** | **Nunca se pierde una factura**: contingencia con paquetes ≤500 y reenvío ≤48 h; venta/comprobante en el acto | Con UPS/batería, la venta se registra local; el envío al SIN se difiere | Emisor de contingencia ya construido (262 tests) |

**Mensaje comercial honesto por modelo:**
- **"Los datos no salen de mi empresa" / internet inestable →** Modelo C. Es el único que **sigue trabajando sin internet** de forma nativa (con UPS para la luz).
- **"Quiero empezar ya, tengo internet decente" →** Modelo A. Rápido de vender; la tolerancia offline en el dispositivo es roadmap.
- **En todos:** *la facturación electrónica no se te cae* — si el SIN o tu internet fallan, la factura entra en contingencia y se legaliza sola al volver la conexión, dentro de los plazos de ley.


---

## Alta disponibilidad / "Siempre activo" (SaaS)

> Extiende `ONIA_DEPLOYMENT_MODELS_2026.md`. Aquel doc define **dónde** corre cada
> modelo (A SaaS cloud / B VPS gestionado / C on-premise) y la tabla de escala por
> etapas. Esta sección define **cómo garantizamos que no se caiga** — y es honesta
> sobre lo que YA vive vs lo que falta formalizar.

El "siempre activo" que vendemos al cliente son tres promesas concretas: (1) la app
responde cuando la abre, (2) si algo se cae, nos enteramos nosotros antes que él, y
(3) si se pierden datos, hay de dónde restaurarlos. Hoy la base ya está — Vercel +
Supabase gestionados dan HA de plataforma "gratis" (backups/PITR gestionados, ver
Modelo A) — y encima corre **monitoreo autónomo real** (Uptime Kuma + 3 chequeos por
n8n/agentes). Lo que falta es **formalizar el contrato**: SLA escrito por tier,
health endpoint estándar en cada producto, off-site del backup y runbook de incidente.

### 1. Qué monitoreamos (capas y herramientas que YA existen)

El monitoreo NO es un solo servicio: son tres capas que se cubren entre sí. Las tres
ya corren en el VPS ONIA y alertan a **Telegram (Hermes)** — silenciosas si todo OK.

| Capa | Qué vigila | Herramienta (estado) | Cadencia | Alerta |
|---|---|---|---|---|
| **Sintético externo** (¿responde la app al usuario?) | HTTP 200 de la app en Vercel, del emisor SIAT, del panel ONIA Center | **Uptime Kuma** — YA vive en el VPS | cada 1-5 min `[VERIFICAR monitores cargados]` | push si cae / si latencia alta |
| **Infra del VPS** (contenedores + recursos) | Contenedores críticos (`n8n`, `onia-center`, `traefik`, `dentalgest-supabase-db`, `chatwoot`, `litellm`) + disco + RAM | **n8n "ONIA - VPS Healthcheck"** (`VaX3lx0zibnNbg57`) → `/opt/onia/vps-healthcheck.sh` | cada 2 h | Telegram **solo si hay problema** |
| **Integraciones self-hosted** (¿el motor interno vive?) | Supabase privado, LiteLLM gateway, Speaches STT — fetch con timeout 4 s y refleja estado en `integration_connectors` | **`selfhosted-health-agent.mjs`** (agente Integraciones, `docker exec onia-center`) | cada 6 h | Telegram **solo si un conector cae** |

**Lo que falta cerrar en esta capa (accionable):**

- **Health endpoint estándar por producto.** Uptime Kuma hoy puede pingar la home,
  pero la home puede responder 200 con la DB caída. Hace falta un endpoint dedicado
  por producto — propuesta `GET /api/health` que devuelva `{ ok, db, version, ts }`
  chequeando (a) proceso vivo y (b) un `SELECT 1` a Supabase. En DentalGest **no está
  confirmado que exista** `[VERIFICAR en repo DentalGest]`; en web-factory/ONIA Center
  hay rutas de estado (`api/onia-center/runtime`, `.../auth/status`) pero no un
  `/api/health` unificado. **Ítem: agregar `/api/health` a cada SaaS y apuntar un
  monitor Uptime Kuma a él.**
- **SIAT como monitor de primera clase.** El emisor ya tiene lógica de contingencia
  (`contingencia.mjs`: `shouldEnterContingency` entra en offline ante cualquier
  respuesta que no sea `ok === true` del SIN). Falta un monitor externo que vigile
  **nuestro** endpoint del emisor y un aviso cuando entramos/salimos de contingencia
  (hoy la lógica existe, la observabilidad de "¿cuántas facturas quedaron en cola?"
  no está expuesta a Uptime Kuma).

**Umbrales propuestos** (ninguno definido formalmente hoy — `[DECISIÓN Sergio]`):

| Señal | Warning | Crítico (alerta inmediata) |
|---|---|---|
| App HTTP (Vercel/panel) | latencia > 2 s | caída / ≥ 2 checks fallidos seguidos |
| DB (via `/api/health`) | `SELECT 1` > 500 ms | error de conexión |
| Disco VPS | > 80 % | > 90 % |
| RAM VPS | > 85 % | swap sostenido / OOM kill |
| Cola offline SIAT | > 50 facturas sin enviar | > 400 (cerca del límite de paquete 500) o > 40 h sin reenvío (límite 48 h) |

### 2. Redundancia por etapa de escala (reusa la tabla de escala)

La HA sigue las **mismas etapas** de la tabla de escala del deployment doc — no se
adelanta infra que no se necesita. Esta es la columna "qué da HA en cada etapa":

| Etapa (del deployment doc) | HA que YA da la plataforma | Qué se agrega para HA |
|---|---|---|
| **1 (hoy, 0-50 orgs)** | Vercel edge multi-región + Supabase Pro (backups/PITR gestionados) = HA base sin operar nada | Nada de infra; solo **monitoreo** (ya está) + health endpoints + SLA escrito |
| **2 (50-300 orgs)** | Supabase compute dedicado | **Read-replica** para reportes pesados (aísla lecturas de la ruta transaccional); PgBouncer si suben conexiones concurrentes |
| **3 (300-1000 orgs)** | VPS dedicado por producto o Supabase enterprise | **Failover Postgres** (réplica en standby) + PgBouncer + backups automatizados (ya ensayados); balanceo si hay 2+ VPS |
| **4 (multi-país / miles)** | DB por región/vertical | Redundancia por región; servicio gestionado o sysadmin dedicado |

Regla honesta: **hoy estamos en etapa 1** y la redundancia de DB/failover NO existe
porque no hace falta — la damos gestionada. El disparador para invertir en
read-replica/failover es el mismo del deployment doc: ~50 orgs o ~US$100/mes por
producto. No prometer failover multi-nodo en un contrato de etapa 1.

### 3. Backups y recuperación (formalizar lo que ya se probó)

Lo más sólido que tenemos. **El ensayo de backup+restore YA se ejecutó** (deployment
doc, 2026-07-04: `pg_dump` del schema `dentalgest` → restore a base scratch → 24
tablas origen = 24 restauradas) y **el cron nocturno YA corre**:

| Pieza | Estado |
|---|---|
| Cron backup diario 03:00 | **VIVO** — n8n "ONIA - Backup diario" (`gN7pQld6Lh3qAcTS`): dump Supabase DentalGest + export de workflows y credenciales n8n cifradas → `/opt/onia/backups`, **rotación 7 días**, Telegram OK/FALLO |
| Restore verificado | **HECHO una vez** (drill 2026-07-04 + `pg_dumpall` válido) |
| **Off-site** (resistir caída total del server) | **FALTA** — hoy la copia vive en el mismo VPS. Ítem pendiente: subir a Cloudflare R2 (crear bucket + token, agregar upload al final de `vps-backup.sh`) |
| **Restore probado periódicamente** | **FALTA formalizar** — el drill fue puntual. Ítem: cron mensual de "restore drill" a base scratch + aviso Telegram con el resultado (que "hay backup" no basta; hay que probar que restaura) |
| On-prem (Modelo C) | Definido en deployment doc: dump nocturno a **NAS** + copia cifrada offsite. Mismo script, distinto destino |

Retención propuesta a formalizar `[DECISIÓN Sergio]`: **7 días diarios** (ya) + **4
semanales** + **12 mensuales** para el off-site R2 (hoy solo hay 7 diarios locales).

### 4. Runbook de incidente + SLA por tier

**Runbook (detección → post-mortem).** Hoy los pasos 1-2 ya son automáticos; los 3-5
son manuales y hay que escribirlos como checklist:

1. **Detección** — Uptime Kuma / n8n healthcheck dispara. (auto, ya)
2. **Alerta** — push a Telegram/Hermes con qué cayó. (auto, ya)
3. **Diagnóstico** — clasificar: ¿app (Vercel)? ¿DB (Supabase)? ¿VPS/contenedor? ¿dependencia externa (SIN/WhatsApp)? Cada uno tiene dueño y acción distinta.
4. **Restore / rollback** — app: redeploy de la build verde anterior en Vercel; contenedor: `docker restart` (o auto, ver §5); DB: PITR gestionado de Supabase / restore del último dump; SIAT caído: **no es incidente nuestro** → entra en contingencia (cola offline 48 h, ya automatizado).
5. **Post-mortem** — nota corta (qué, cuánto duró, causa, fix, cómo evitarlo). Guardar en `hermes-content/docs/`.

**SLA por tier.** Ninguno está prometido hoy por escrito. Propuesta honesta —
**objetivos best-effort, sin penalización contractual en etapa 1**, porque no podemos
prometer más que nuestra dependencia más débil (Supabase Pro / Vercel Pro **no
publican SLA contractual**; el 99.9% con crédito es solo tier Enterprise `[VERIFICAR
tier Supabase/Vercel al firmar]`):

| Tier | Planes (Bs/mes) | Objetivo uptime | Downtime tolerado | Qué prometemos | Qué NO prometemos |
|---|---|---|---|---|---|
| **Estándar** — Básico y Profesional | 320–750 | **99.5 %** (best-effort) | ~3,6 h/mes | Monitoreo 24/7, backup diario, restauración ante pérdida de datos | Crédito/penalización; failover multi-nodo |
| **Pro** — Completo y Empresa | 1.500–2.900 | **99.9 %** (best-effort) | ~44 min/mes | Lo anterior + off-site backup + prioridad de atención | SLA contractual con penalización (hasta subir a Supabase Enterprise) |
| **VPS gestionado (Modelo B) / On-prem (Modelo C)** | según contrato | **SLA de respuesta**, no de uptime | — | Tiempo de respuesta a incidente (ej. < 4 h hábiles), backup gestionado | Uptime de la app: la infra es del cliente; su internet/hardware manda |

Nota comercial: en Bolivia muchas PyMEs **no tienen internet estable** — el uptime
percibido depende tanto de su conexión como de nuestra plataforma. Por eso el Modelo
C (on-prem, red local) es el que da "siempre activo" real a quien tiene internet
malo, y el SLA on-prem se mide en **respuesta a soporte**, no en % de uptime que no
controlamos.

### 5. Autorecuperación (que se levante solo)

- **Reinicio automático de contenedores.** Docker/Easypanel con `restart: unless-stopped`
  (o `always`) levanta cualquier contenedor que muera. **`[VERIFICAR]` que la restart
  policy esté seteada en TODOS los servicios críticos** (n8n, onia-center, supabase-db,
  litellm, traefik) — es la primera línea de autorecuperación y es 1 línea de compose.
- **Cron de agentes idempotente.** Ya lo es por diseño del core: los agentes dedupean
  por `review_queue` pendiente / por fecha (no re-procesan), son read-only o dejan solo
  borradores, y son autónomos (corren dentro del contenedor por `docker exec`, **no
  dependen del laptop de Sergio**). Si un run falla, el siguiente lo retoma sin
  duplicar. El emisor SIAT hereda lo mismo: máquina de estados con transición única
  (draft→queued→sent→validated) y reversión única, más cola offline si el transporte
  cae.
- **Falta:** healthcheck a nivel Docker (`HEALTHCHECK` en el Dockerfile/compose) para
  que Easypanel reinicie por "unhealthy" y no solo por "exited". Hoy el chequeo de
  salud vive en n8n (cada 2 h) — bueno para avisar, lento para autorecuperar.

### 6. Resumen honesto: existe hoy vs falta formalizar

| Existe HOY (verificado) | Falta formalizar (ítems accionables) |
|---|---|
| Uptime Kuma en el VPS | Cargar/documentar monitores contra `/api/health` de cada producto + SIAT |
| 3 chequeos autónomos (VPS 2 h, integraciones 6 h, radar) con alerta Telegram | Health endpoint `/api/health` estándar en cada SaaS (`[VERIFICAR]` DentalGest) |
| Backup diario 03:00 + rotación 7 días + restore probado una vez | Off-site a R2 + restore drill mensual automatizado + retención 7/4/12 |
| HA de plataforma gestionada (Vercel + Supabase PITR) | SLA escrito por tier + umbrales de alerta acordados |
| Contingencia SIAT (offline 48 h, cola ≤500) automatizada | Monitor externo + métrica de cola offline expuesta |
| Cron de agentes idempotente y autónomo | `HEALTHCHECK` Docker + confirmar `restart: unless-stopped` en todos los críticos |
| Runbook implícito (detección + alerta automáticas) | Runbook escrito (diagnóstico → rollback → post-mortem) |


---

## Precio y costo de los 3 modelos de entrega

> Extiende `ONIA_DEPLOYMENT_MODELS_2026.md` (modelos A/B/C) con la capa económica: qué cobramos, qué nos cuesta y cuál es el margen de cada modelo, anclado en el pricing **ya ratificado** de DentalGest y en los costos de infra que ya están medidos en `ONIA_TARGET_STACK_DECISION_2026.md`. No re-precia los planes; los aterriza por modelo de entrega.

### Nota de moneda (leer antes de las tablas)

Los planes están ratificados en **Bs**. La conversión a USD usa el **tipo oficial ~6,96 Bs/USD** [VERIFICAR: en 2026 Bolivia arrastra brecha con el dólar paralelo — el USD real para pagar infra cuesta bastante más que el oficial]. Esto tiene una consecuencia directa de negocio:

- Nuestros ingresos entran en **Bs**; nuestra infra cloud (Supabase, Vercel) se paga en **USD reales**, que en Bolivia son escasos y caros de conseguir.
- Por eso cada US$25/mes fijo de infra "pesa" más de lo que sugiere el tipo oficial, y **refuerza la regla ya decidida: cloud para velocidad de venta, selfhost para margen**. El costo en dólares es el argumento económico central de esta sección.

---

### Modelo A — SaaS cloud: precio por organización, costo por producto

**Precio (lo que ya está ratificado, DentalGest):**

| Plan (`PLAN_LABELS`) | Bs/mes | Bs semanal | Anual (total) | ≈ USD/mes |
|---|---:|---:|---:|---:|
| Básico (`basic`) | **320** | 89 | 3.200 | ~28 |
| Profesional (`professional`) ⭐ | **750** | 199 | 7.500 | ~65 |
| Completo (`clinic`) | **1.500** | — | 15.000 | ~130 |
| Empresa (`enterprise`) | **2.900** | — | 29.000 | ~252 |

Anual = **2 meses gratis (10x)**. Empresa suma **implementación desde Bs 3.500**. El semanal
existe solo en Básico y Profesional, con prima (~20% y ~15%): es la puerta para negocios de
caja diaria. USD referencial a Bs 11,50.

⚠️ **Corregido 2026-08-27.** Acá había una tabla de DOS precios —"lista" 390/890/1.990/3.900 y
"lanzamiento" 320/750/1.500/2.900— con la nota *"el código valida el pago = precio de
lanzamiento; la lista es solo ancla en propuesta"*. **Esa columna "lista" no existe en ninguna
parte del código:** `DEFAULT_PLAN_AMOUNTS` tiene UN precio por plan y ciclo, y es el de esta
tabla. Un ancla que nadie puede validar es una cifra inventada esperando salir en una
propuesta — y de ahí salieron los 390/890/1.990 que todavía viven en el generador de
propuestas. También se corrigieron los nombres (`Ordenado`, `Clínica`, `Grupo Clínico` →
`PLAN_LABELS`) y el USD, calculado a Bs ~6,96 de antes de la devaluación.
**Onboarding: cotizado por alcance** (`pricing.ts`), no 290/690/1.490.
**`GestiOS` no es un producto**: es un rubro de Onia Platform y sus repos son legado.

**Costo ONIA — la clave es que la infra es por PRODUCTO, no por organización:**

| Concepto | Costo | Nota |
|---|---:|---|
| Supabase Pro (1 proyecto por producto) | ~US$25/mes | 100 clínicas = 1 DB, no 100 |
| Vercel (con crons) | US$0–20/mes | plan según tráfico |
| **Infra fija por producto** | **~US$25–45/mes** | baseline; sube con overages de compute/bandwidth |
| Créditos IA / mensajería WhatsApp Meta / comisión pasarela | pass-through | los paga el cliente, nunca en nuestro costo |

Como el costo fijo se reparte entre TODAS las orgs activas del producto, el **costo marginal por organización se desploma con la escala**:

| Orgs activas del producto | Costo infra por org/mes | vs ARPU lanzamiento (Prof. ~US$108) |
|---:|---:|---:|
| 10 | ~US$4,5 (Bs ~31) | margen infra ~96% |
| 25 | ~US$1,8 (Bs ~13) | margen infra ~98% |
| 50 | ~US$0,9 (Bs ~6) | margen infra >99% |

**Lectura:** en SaaS el margen sobre infra es altísimo apenas se pasa de ~15–20 orgs; el costo variable REAL no es la infra sino el **humano** (soporte, onboarding). El punto débil del Modelo A es al revés: con **1–3 orgs** el costo fijo (~US$45/mes) se come una porción grande de un solo plan Básico (Bs 320 ≈ US$46). Por eso el trigger de migración a selfhost (abajo) es a los ~50 orgs, no antes.

**Add-ons del Modelo A (recurrente premium sobre el plan):**

| Add-on | Setup Bs | Mensual Bs | Estado |
|---|---:|---:|---|
| Chatbot WhatsApp N1 / N2 ⭐ / N3 | 300 / 1.500 / desde 3.500 | 200 / 550 / desde 900 | ratificado (escalera) |
| WhatsApp operativo DentalGest | 650 | 350 + Meta | requiere aprobación Meta |
| Agenda pública / usuario extra / insumos | — | 150 / 70 / 80 | ratificado |
| **SIAT — facturación electrónica** (emisor `external_gate`) | **990–1.900** | **150–350 por NIT/sucursal** | **[VERIFICAR con Sergio]** — pre-piloto, bloqueo S2 (NIT). Certificado y costos SIAT los paga el cliente. Se vuelve casi obligatorio (facturación en línea exigible 30-sep-2026) |
| **Agentes 24/7** (módulo `agents`, human-in-the-loop) — el diferenciador vendible | setup por carril | **550–1.200 por carril** o bundle 1.500–2.500 | **[VERIFICAR con Sergio]** — tier premium sobre Clínica/Grupo Clínico; se apoya en módulos `automation`+`agents` del core |

> SIAT y Agentes 24/7 **todavía no tienen precio en el catálogo**: los rangos de arriba son propuesta con supuesto, no números cerrados.

---

### Modelo B — VPS gestionado ("ONIA Managed Bridge")

Estructura: **el cliente paga su propio VPS** (infra a su nombre, costo ONIA = **0**) + **fee de gestión mensual a ONIA** + un **setup único**. Easypanel es gratis (open source); el costo es solo el VPS. Ya probado con Bolivian Electric.

| Concepto | Rango propuesto | Quién paga |
|---|---:|---|
| VPS (referencia: Hostinger KVM 4, 4 vCPU/16GB — el mismo del VPS ONIA) | **~US$12–15/mes** (término anual) a **~US$25–30/mes** (mensual) [VERIFICAR precio vigente Hostinger/proveedor] | **cliente** |
| Setup ONIA (one-time): provisión, deploy del stack, n8n + Chatwoot + Postgres, migración básica, capacitación | **Bs 3.500–7.000** (US$500–1.000) | cliente → ONIA |
| Gestión mensual ONIA: monitoreo (Uptime Kuma), updates, soporte, ajustes n8n, backups | **Bs 700–1.400/mes** (US$100–200) según alcance | cliente → ONIA |

**Margen ONIA:** la gestión es **~90%+** (no cargamos infra; solo tiempo de operador vía SSH). El setup es margen sobre horas.

**Cuándo conviene vs SaaS:** empresa **mediana** que quiere SU infraestructura y SUS canales (WhatsApp/n8n propios) sin operar nada, y que valora control sobre velocidad. Es el modelo natural cuando además hay que **integrar un ERP local en la misma red** (caso TR4 de BE: SQL Server en solo-lectura). No es para la pyme que "quiere empezar ya" (esa es SaaS).

**Palanca interna (no confundir con el modelo cliente):** el mismo stack selfhost es lo que ONIA usa para **migrar un PRODUCTO entero** de Supabase cloud a un VPS dedicado cuando cruza el trigger de margen (~50 orgs o US$100/mes). Ahí ONIA cambia ~US$45/mes de cloud gestionado por ~US$15–30/mes de VPS + trabajo de operación propio.

---

### Modelo C — On-premise: licencia + instalación + soporte

Supuesto: **empresa mediana (≈10–30 usuarios) que exige que los datos no salgan de su empresa**. El artefacto ya existe (`docker-compose.selfhost` de DentaGest + ensayo de backup/restore hecho). Costo de infra para ONIA = **0** (corre en el servidor del cliente). Se vende como tres piezas:

| Componente | Rango propuesto (supuesto 10–30 usuarios) | Base |
|---|---:|---|
| **Instalación** (one-time): deploy del stack selfhost, migración de datos, hardening, túnel de soporte (Tailscale), capacitación | **Bs 10.500–28.000** (US$1.500–4.000) [VERIFICAR alcance] | trabajo + entrega reproducible |
| **Licencia** — opción anual | **Bs 14.000–42.000/año** (US$2.000–6.000) según usuarios/módulos | recurrente |
| **Licencia** — opción perpetua + mantenimiento | **Bs 42.000–105.000** (US$6.000–15.000) + **18–20%/año** de mantenimiento | clásico ERP |
| **Soporte anual** (SLA, ventana de actualización `git pull + compose up`, restore ensayado) | **Bs 8.400–25.000/año** (US$1.200–3.600) por niveles | recurrente |
| Hardware (mini-PC/NUC o servidor) + NAS para backup | lo pone/paga el **cliente**; si ya tiene NAS, se aprovecha | — |

**Comparación con ERPs locales y por qué el premium está justificado:** los ERPs bolivianos/regionales de mediana empresa (tipo Softland, SAP Business One, sistemas locales sobre SQL Server/PowerBuilder) cobran **licencia por usuario + implementación cara + soporte anual**, y no traen IA ni facturación SIAT nativa [VERIFICAR números de competidores — no fabricar cifras]. ONIA **no compite por precio bajo**: el foso son tres cosas que el ERP local no da juntas — **(1) IA + agentes 24/7 human-in-the-loop**, **(2) fiscal Bolivia / SIAT nativo y al día**, **(3) datos en el server del propio cliente (soberanía)**. Ese paquete sostiene el premium; vender barato aquí destruye el posicionamiento.

---

### Tabla comparativa maestra

| Modelo | A quién | Setup (one-time) | Recurrente | Costo infra ONIA | Margen ONIA | Cuándo venderlo |
|---|---|---:|---:|---:|---|---|
| **A — SaaS cloud** | Clínica/pyme que quiere empezar ya | **Bs 0** (no hay setup obligatorio; el onboarding se cotiza por alcance) | Bs 320–2.900/mes (+ add-ons SIAT/agentes/WhatsApp) | ~US$25–45/mes por **producto** (repartido entre orgs) | Muy alto >20 orgs (>95% infra); bajo con 1–3 orgs; costo real = soporte humano | Default. Máxima velocidad de venta; el gancho es la web/onboarding barato → mensual |
| **B — VPS gestionado** | Empresa mediana que quiere su infra + WhatsApp/n8n propios, sin operar | Bs 3.500–7.000 | Bs 700–1.400/mes (gestión) | **0** (VPS lo paga el cliente, ~US$15–30/mes) | ~90%+ sobre gestión (solo tiempo de operador) | Control + canales propios; integrar ERP local en misma red (TR4/BE) |
| **C — On-premise** | Empresa que exige datos adentro | Bs 10.500–28.000 (instalación) | Licencia Bs 14.000–42.000/año **o** perpetua Bs 42.000–105.000 + 18–20% mant.; soporte Bs 8.400–25.000/año | **0** (server del cliente) | Alto por contrato; ciclo de venta largo, instalación intensiva en horas | "Los datos no salen de mi empresa"; premium justificado por IA + SIAT + soberanía |

### Regla de decisión de margen (ya decidida)

```text
Cloud gestionado  = velocidad de venta y datos críticos → Modelo A por defecto.
Selfhost (B / C)  = margen, donde no arriesga datos de clientes.
Trigger de migración de un PRODUCTO a VPS dedicado:
   ~50 organizaciones activas   O   ~US$100/mes de infra por producto.
```

En una frase para vender: **A para arrancar rápido y llenar el embudo; B y C para capturar margen y clientes que exigen su propio servidor.** El costo en USD de la infra cloud es lo que define el punto donde conviene saltar de A a selfhost.

---

## Preguntas abiertas / decisiones de Sergio

Lo que los subagentes marcaron como pendiente de tu decision o de un dato a verificar:

- **[erp]** S1 (pricing): definir número final de licencia anual + instalación one-time + % de soporte anual del Modelo C. La sección propone estructura y rangos con supuesto, pero el monto es decisión de negocio de Sergio.
- **[erp]** S2 (NIT SIAT): el paso de configurar el external_gate del emisor SIAT en la instalación on-prem depende del NIT del cliente y del estado del emisor pre-piloto. ¿Se instala con SIAT activo o se entrega y se conecta después?
- **[erp]** Tailscale: ¿la tailnet es de ONIA (cliente como nodo invitado) o del cliente (ONIA invitado)? Define quién controla el acceso de soporte y las ACLs.
- **[erp]** Storage offsite: ¿se usa R2/S3 de ONIA para las copias cifradas offsite, o disco externo del cliente? Impacta costo recurrente y quién custodia la clave de cifrado.
- **[erp]** Compromiso de soporte Windows: ¿se soporta oficialmente Windows + Docker Desktop para clientes chicos, o se estandariza en Linux para reducir superficie de soporte?
- **[erp]** Restore completo: el drill ejecutado fue solo del schema (24/24). Falta ensayar el restore COMPLETO (con auth/roles) en el staging ONIA antes de comprometerlo como garantía de recuperación al cliente.
- **[erp]** SLA de la ventana de actualización: definir frecuencia de updates, tiempo de respuesta a incidentes y penalidades para el plan de soporte anual on-prem.
- **[offline]** Modelo B — ¿el VPS del cliente vive en datacenter (cloud) o físicamente en su oficina? Cambia por completo el comportamiento offline (cloud = como SaaS; físico = como on-premise). Definir por cliente en el onboarding.
- **[offline]** Alcance/roadmap — ¿se porta la capa PWA offline (service worker + IndexedDB + mutationQueue + Sync*) de Ganadero OS a DentalGest/GestiOS, o esos productos quedan online-only con SLA de internet a cargo del cliente? Decisión de producto + impacto en pricing (esfuerzo de portar no trivial).
- **[offline]** UPS — ¿ONIA revende/incluye el UPS en el paquete de instalación on-premise o sólo lo especifica y lo compra el cliente? Falta cerrar modelo/proveedor y precio local en Bolivia [VERIFICAR ~Bs 400–1.000].
- **[offline]** Cifrado de la cache local (IndexedDB) en dispositivos de recepción compartidos: Ganadero OS dejó el cifrado fuerte fuera de MVP y recomienda usuario propio por trabajador + 'cerrar sesión y borrar datos locales'. ¿Se acepta ese criterio para clínicas/comercios o se exige más (p.ej. expiración agresiva de cache)?
- **[offline]** Retención/expiración de la cache offline por vertical (cuántos días de datos se bajan y cuándo se purgan) — no definido; afecta uso de disco del dispositivo y superficie de datos en reposo.
- **[offline]** Código exacto de tipoEmisión para contingencia (EMISSION_TYPES.CONTINGENCY marcado [VERIFICAR]) y confirmación del flujo de reenvío contra el ambiente piloto real — bloqueado por credenciales SIAT (S2/NIT).
- **[offline]** ¿Existe requisito de un segundo enlace/failover de internet (4G de respaldo) para clientes que sí necesitan SIAT/WhatsApp en tiempo casi real, como servicio gestionado por ONIA? Hoy no está contemplado.
- **[ha]** SLA por tier: ¿objetivos best-effort (99.5% Estándar / 99.9% Pro) sin penalización, o pasamos a Supabase Enterprise para poder prometer 99.9% contractual con crédito? Definir antes de escribirlo en propuestas.
- **[ha]** Retención de backups off-site: ¿confirmamos 7 diarios + 4 semanales + 12 mensuales en Cloudflare R2? Requiere crear bucket + API token (bloqueo de infra pendiente).
- **[ha]** Umbrales de alerta (disco 80/90%, RAM 85%, latencia 2s, cola SIAT 50/400): ¿se aprueban esos cortes o se ajustan?
- **[ha]** ¿Qué monitores tiene cargados Uptime Kuma HOY? No pude verificarlo desde el repo; hay que revisar la instancia en el VPS para saber si ya apunta a la app Vercel / SIAT o solo a infra.
- **[ha]** Health endpoint: ¿DentalGest (repo separado) ya expone /api/health con chequeo de DB? Si no, agregarlo es el primer ítem para que el monitoreo sintético sea real y no un ping a la home.
- **[ha]** SLA on-prem/VPS gestionado: definir el tiempo de respuesta a incidente que prometemos (propuesta < 4 h hábiles) ya que ahí no controlamos el uptime de la infra del cliente.
- **[pricing]** Tipo de cambio a usar en propuestas: oficial ~6,96 Bs/USD u otro por la brecha con el paralelo 2026. Afecta toda conversion Bs<->USD y el costo real en dolares de la infra cloud. [VERIFICAR con Sergio]
- **[pricing]** Precio del add-on SIAT (facturacion electronica): propuesto Bs 990-1.900 setup + 150-350/mes por NIT/sucursal — no esta en catalogo. Bloqueo S2 (NIT SIAT). Confirmar montos y si se cobra por sucursal.
- ✅ **[pricing] Agentes 24/7 (modulo agents): CERRADO, y no se cobra aparte.** Van **incluidos desde Profesional** (`PLAN_LIMITS.agentsIncluded`), no como tier ni como add-on por carril. Los rangos que proponía este doc (Bs 550-1.200 por carril, bundle 1.500-2.500/mes) nunca existieron en el codigo. Y su **costo de API es CERO**: los tres agentes redactan con plantillas, no llaman a ningun modelo (`ONIA_AGENTES_COSTO_API.md` §2.1) — o sea que si algun dia se les pone precio, no hay piso de costo variable que respetar.
- **[pricing]** Costo mensual vigente del VPS para Modelo B (Hostinger KVM 4 u otro proveedor): usado rango ~US$12-30/mes segun termino. Confirmar plan y precio 2026.
- **[pricing]** Modelo C: cerrar rangos de licencia (anual vs perpetua+mantenimiento), instalacion y soporte para empresa mediana; hoy son propuesta con supuesto 10-30 usuarios. Falta tambien el punto 2 pendiente del deployment doc: 'definir precio de licencia + instalacion + soporte anual'.
- **[pricing]** Comparacion con ERPs locales bolivianos (Softland/SAP B1/sistemas locales): no se citaron cifras para no fabricar. Si se quiere usar el argumento de precio en ventas, conseguir referencias reales de licencia/usuario e implementacion.
- **[pricing]** Ganadero OS (offline-first) no tiene planes ratificados como DentalGest/GestiOS; si se vende on-premise/offline conviene una tabla de precios propia.
