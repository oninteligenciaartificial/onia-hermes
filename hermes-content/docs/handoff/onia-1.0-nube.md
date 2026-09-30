# Handoff — onia-1.0-nube (sesión principal de Onia Platform, en la nube)

Sesión: https://claude.ai/code/session_01VGmpNv4eSMnpA3wXrypR4L · Rama de este doc: `claude/onia-platform-handoff-56d586-vjtzyj` (PR #58, borrador).
Complementa, no reemplaza, `handoff/sesion-madre.md` (rama `claude/sesion-madre-20260930`) y el bloque «EMPEZÁ ACÁ» de `handoff/codex-continuar-1.0.md` (rama `wip/v1-hermes-20260928`).

## 1. Objetivo

Publicar la 1.0 de Onia Platform y empezar a venderla. Hoy: relanzar en la nube los 3 carriles que se cortaron al mudar la sesión
(plata-permisos, cita-baja-api, capturas). Arreglar lo que apareció al MIRAR las capturas. Dejar todo integrado y verificado
visualmente, listo para que una sesión con acceso al VPS lo publique.

## 2. Qué quedó EN PRODUCCIÓN

**Nada.** No se publicó nada hoy: la nube no llega al VPS (ver §5). Todo lo de abajo está construido, probado y mirado en un entorno
aislado, **no encendido**.

## 3. Qué quedó a medias y dónde (todo commiteado y pusheado — no hay nada solo en el disco)

Repo `oninteligenciaartificial/onia-platform`. Base: candidato `6088e478` (`wip/v1-integracion-20260928`, PR #90).

| Rama (con respaldo `wip/…`) | Commit | Qué |
|---|---|---|
| `v1/plata-permisos` | `435352a` | Baja con deuda sin monto para quien no tiene Caja. Inicio de comercio sin plata. Panel, costeo y reprecio de importadora piden `finance.read`. Traspasos y crear almacén piden `inventory.write`. |
| `v1/cita-baja-api` | `4510d2f` | `/cita` rechaza citas pasadas o cerradas. Cancelar una cita pasada no avisa. `/api/v1/patients` oculta a los dados de baja salvo `?incluirBajas=1`. |
| `v1/agenda-hoy` | `99c32bb` | Agenda de hoy: NO_ASISTIO visible, grupo «Ya pasaron» y nombre del profesional. |
| `v1/pantallas-varias` | `1f89e16` | «Completar contacto», link de reserva visible, espacio bajo la barra, franja del plan, texto de baja por rubro y «Primeros pasos» sin retraso. |
| `v1/seed-demo` | `5356a6c` | El seed corre en base nueva, termina solo y es idempotente. Textos propios de cada rubro, tildes y hora de La Paz. Trae 2º profesional, cita de mañana sin confirmar y tratamiento a medias. |
| **`wip/v1-union-20260930`** | `c478b8a` | 6088e47 + los 5 de arriba. tsc 0 · vitest 8725 ok · lint 0 errores. **Verificado mirando** (A–H OK). |
| `v1/cierre-0930` (+`wip/v1-cierre-0930`) | `4fdb6fb` | Sobre la unión. Sin `finance.read` no se ven costos ni valores de inventario (incluye API de movimientos y `/inventory`). La guía se abre si falta un paso del rubro. `/cita` sin punto doble y en vos. vitest 8756 ok. **NO mirado todavía.** |

**Para publicar, la punta es `v1/cierre-0930` (`4fdb6fb`)**, que contiene todo lo anterior. Nada se mergeó al candidato (PR #90) ni a main/master.

Capturas: `hermes-content/carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/` (12 PNG + README). Son del candidato, **sin aprobar**.

## 4. Archivos

- En este repo: `.claude/skills/onia-infra/SKILL.md` (sección «Desde una sesión en la NUBE, el puerto 22 no sale») y la carpeta de capturas de arriba.
- En onia-platform, lo tocado por cada carril está en su rama (ver `git log 6088e47..4fdb6fb --stat`).
- Entorno aislado reproducible (se pierde si muere el contenedor): `scratchpad/entorno/` de esta sesión. Contiene docker-compose con supabase/postgres 17 + gotrue v2.196 + nginx + mailpit, `block-egress.cjs`, `cap.mjs` y `run-app.sh` (`next dev --webpack -p 3300`). Los pasos están en §7.

## 5. Intentos fallidos e hipótesis falsas

- **«El puerto 22 del VPS está bloqueado»: FALSO.** Desde la nube tampoco sale `github.com:22`. El proxy del contenedor acepta `CONNECT :22`, pero no pasa el banner SSH: solo deja salir HTTPS y WebSocket (medido: 101). No se arregla en el VPS. Camino propuesto: Cloudflare Tunnel + Access (service token) → `ssh.onia.com.bo`. No construido.
- La primera tanda de capturas tenía el link de reserva en `localhost:3300`. El link se escribe en la propuesta AL SEMBRAR, con la URL del entorno de ese momento. Para rehacerlas hay que borrar las propuestas **y** las solicitudes de aprobación y volver a correr los agentes.
- Turbopack entra en pánico con `node_modules` como symlink en los worktrees → usar `--webpack`.
- Los tests de `.github/scripts/rango-gitleaks.test.ts` se pasan de tiempo (5 s) con 5 vitest a la vez. Solos pasan. No es un bug del producto.
- Docker no arranca solo: hay que lanzar `dockerd &` a mano (el contenedor lo tiene instalado y somos root).
- El contenedor se reinició 2 veces y los resultados de los subagentes no llegaron solos. Se recuperaron de `~/.claude/projects/.../subagents/agent-*.jsonl`.

## 6. Qué depende de Sergio Urcullo

1. **Acceso al VPS desde la nube:** crear Cloudflare Tunnel + Access (pasos en la skill `onia-infra`) y cargar los secretos en el entorno. Si no, publicar sigue siendo desde la laptop.
2. **Aprobar o rechazar las capturas del candidato** para la pauta. Si se aprueban, van a la carpeta de la pauta y se avisa a Marca personal (`session_012ppFowADbJNtZ6WBMtqpuf`).
3. Decisiones de producto chicas:
   - Si al cancelar una cita pasada se avisa o no al profesional. Hoy no se avisa.
   - Si la vista del DOCTOR muestra el nombre del profesional. Hoy no.
   - Si se ponen botones Completada/No asistió en «Agenda de hoy». Hoy se enlaza a Citas.
4. Lo que ya estaba: reconectar Meta Ads con el usuario de ONIA Ads, SIAT (Listado de Pruebas + CAFC), cuentas de competencia, leer la política de privacidad v1.3.

## 7. Próximos pasos

1. **Mirar `v1/cierre-0930`** en el entorno aislado:
   - `/comercio/inventario` con usuario Recepción, sin Bs.
   - La guía, que se abre sola en la demo dental.
   - `/cita`, sin punto doble.

   Pasos del entorno: `dockerd &` → `docker compose up -d` → `prisma migrate deploy` → `seed-demo` → crear usuarios en GoTrue (`POST /auth/v1/admin/users`) → `run-app.sh` con `NEXT_PUBLIC_APP_URL=https://app.onia.com.bo` → `cap.mjs`.
2. Que el integrador lleve `v1/cierre-0930` al candidato (PR #90), o mergearlo ahí si esa es la decisión.
3. **Publicar** desde una sesión con acceso al VPS:
   - las 5 migraciones aditivas, con respaldo (las dos últimas ANTES del swap);
   - `ONIA_WHATSAPP_INBOX_ID=5`;
   - apagar el proveedor de teléfono de GoTrue;
   - merge del PR #90;
   - publicador;
   - MIRAR en producción.

   Además: **recrear la base de la cuenta demo** con el seed nuevo, porque las bases viejas conservan «Dona Carmen».
4. Pendientes anotados, fuera de alcance:
   - `/inventory` (insumos) solo bloquea al rol DOCTOR, no usa `inventory.read/write`.
   - En la vista Citas se puede marcar «Completada» en citas futuras.
   - El seed no genera tokens de `/cita`.
   - La franja de vencimiento de la cuenta demo no muestra «Ver mi plan».
   - La ayuda enlaza a pantallas que rebotan al usuario.
