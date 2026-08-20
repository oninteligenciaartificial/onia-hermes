# Respaldo n8n — 2026-08-20

Export completo de los **136 workflows** de la instancia n8n del VPS (`n8n-sergio_n8n`, Swarm).
Un archivo por workflow, nombrado `<id>.json`. Generado con `n8n export:workflow --all --separate`.

> **SECRETOS REDACTADOS.** 7 workflows tenian claves hardcodeadas en los nodos (24 JWT de Supabase,
> 2 API keys de Google, 1 key de OpenAI `sk-proj-`). En esta copia estan reemplazadas por
> `__REDACTED_*__`. **Esta copia NO es restaurable tal cual.** El export crudo, sin redactar, vive
> solo en el VPS: `/root/backups/n8n-backup-20260820-RAW.tar.gz` (196 KB).

| id | nombre | activo | nodos | actualizado |
|---|---|---|---|---|
| `O0NHmyqP6Fyk4f0b` | Alta de Cliente ONIA → CRM + Correo | **SI** | 5 | 2026-08-16 |
| `mboH09gPgu5kAoHm` | Brief de Produccion ONIA → Correo | **SI** | 2 | 2026-08-07 |
| `SemAJNk7ZoZxA8D7` | Cuestionario Cliente ONIA → Correo | **SI** | 2 | 2026-08-07 |
| `6q0y6m9rFwFiPrXC` | ONIA - Agenda + energia del dia | **SI** | 4 | 2026-07-22 |
| `kB10A8oLWioS8lXP` | ONIA - Agenda Create API | **SI** | 3 | 2026-07-03 |
| `X6gd3EBW7Y3z9xTg` | ONIA - Agenda: Cal.com Booking | **SI** | 5 | 2026-07-04 |
| `uwqJDGwkkWJaFtLU` | ONIA - Agenda: Recordatorios | **SI** | 4 | 2026-07-03 |
| `XRS9fWY4yFMQQftF` | ONIA - Agente Building in Public | **SI** | 5 | 2026-07-10 |
| `Su4vVZCB9rtJ3gAy` | ONIA - Agente CEO Mensual | **SI** | 5 | 2026-07-22 |
| `nZkaXaZVKzgtwUqU` | ONIA - Agente Contenido y Media Lab (borradores) | **SI** | 5 | 2026-07-22 |
| `TBECCNhi334cOLTG` | ONIA - Agente Entrega de proyectos | **SI** | 5 | 2026-07-22 |
| `oKSTNdvS58ixBgnl` | ONIA - Agente Finanzas y Fondo ONIA | **SI** | 5 | 2026-07-09 |
| `GjNeraAVnY7HduCG` | ONIA - Agente Integraciones self-hosted | **SI** | 5 | 2026-07-22 |
| `nkPMoUYQ9DMIL9gM` | ONIA - Agente Prospector (CRM) | **SI** | 6 | 2026-07-22 |
| `ynNMGtW8TCDCBMdS` | ONIA - Agente Radar YT (ideas, panel-only) | **SI** | 2 | 2026-07-22 |
| `C96NmbalLhaTEf0G` | ONIA - Agente Vendedor (borradores) | **SI** | 5 | 2026-07-22 |
| `gN7pQld6Lh3qAcTS` | ONIA - Backup diario | **SI** | 4 | 2026-08-11 |
| `AooUOwSMSAaFLQnA` | ONIA - Chatbot: seguimiento y recordatorio | **SI** | 7 | 2026-08-13 |
| `gWrVHU8OxI9yugc4` | ONIA - Comentario IG -> DM (Private Reply) | **SI** | 13 | 2026-08-18 |
| `b6hjjNJFLuLXhRm3` | ONIA - Digest semanal (panel -> Telegram) | **SI** | 4 | 2026-07-22 |
| `fek4OoxRlNfpD6GZ` | ONIA - Disparador de Agentes (panel) | **SI** | 7 | 2026-08-11 |
| `rwQuwSvd29bV34EY` | ONIA - Generar Propuesta (oficial) | **SI** | 10 | 2026-07-06 |
| `drFWP7nttzvtZzso` | ONIA - Monitor de Salud n8n | **SI** | 4 | 2026-07-03 |
| `WA6VkNu5OHo6Npem` | ONIA - Nuevo Lead (speed-to-lead) | **SI** | 9 | 2026-07-06 |
| `ECC1THa2kTmOGepY` | ONIA - Nuvia Sourcing Score (v1) | **SI** | 9 | 2026-07-06 |
| `UMpcKi7wfMmC9KCw` | ONIA - Propuesta Abierta (pixel) | **SI** | 2 | 2026-07-05 |
| `QGXVyRSgrArxfolj` | ONIA - Radar de Novedades IA | **SI** | 5 | 2026-07-22 |
| `OovRU4r0o7pvglJP` | ONIA - Radar Normativo Bolivia | **SI** | 6 | 2026-07-04 |
| `xQaO3Sfsl9XzMiid` | ONIA - Reporte diario Sergio + Arthur | **SI** | 6 | 2026-07-07 |
| `Er2jSjR2fnKbDXMN` | ONIA - Sync estado agentes (24/7 real) | **SI** | 2 | 2026-07-22 |
| `jcmJ509pTJeqJU0Z` | ONIA - Sync gasto IA (LiteLLM -> panel) | **SI** | 2 | 2026-07-22 |
| `ZjaHUEMJVMXkLlmO` | ONIA - Tareas diarias reales (CRM -> panel) | **SI** | 2 | 2026-07-22 |
| `vuicWsvh0hwqKhYs` | ONIA - Telegram Command Center | **SI** | 16 | 2026-07-22 |
| `5ReZhW6QheZfbuuC` | ONIA - Vigilante del chatbot (alerta Telegram) | **SI** | 6 | 2026-08-12 |
| `VaX3lx0zibnNbg57` | ONIA - VPS Healthcheck | **SI** | 5 | 2026-08-11 |
| `GFeCZKr1zQT6CVN8` | ONIA - Web Factory QA | **SI** | 5 | 2026-07-04 |
| `aHFLqEtzqvq6SE3e` | ONIA - Web Factory VPS Radar | **SI** | 8 | 2026-07-22 |
| `ONIADailyBrief001` | ONIA Center - Briefing diario operativo | **SI** | 6 | 2026-07-22 |
| `w3vgUCV1yMkv70TW` | ONIA Intake Cliente a Telegram | **SI** | 3 | 2026-07-03 |
| `9bF53cn0lkvdUyZT` | WF-02: QR Payment Alerts | **SI** | 7 | 2026-08-07 |
| `DKSPEsrRYDtoSaG0` | WF-07: Payment Reconciliation | **SI** | 7 | 2026-08-07 |
| `F0HOvw0lpGqTdpQS` | WF-08: Welcome Email for New Patients | **SI** | 4 | 2026-08-07 |
| `cA7PMtzHFR47NR9W` | WF-09: Trial Expired Alert | **SI** | 5 | 2026-08-07 |
| `wImYWwbHGVK5tvIA` | WF-SENTRY-01 - Sentry Codex Triage | **SI** | 7 | 2026-07-03 |
| `tP2mP5BeE7bETof9` | . | no | 0 | 2026-03-20 |
| `jVrufLM0aWnYLj8c` | [UDIA] Mi primer workflow | no | 7 | 2026-07-04 |
| `9d6jOYklaeYTdllJ` | [UDIA] Primer flujo sencillo | no | 3 | 2026-07-04 |
| `p73krZtQA0IYzaKZ` | 💥 Generate AI Viral Videos with VEO 3 and Upload to TikTok  | no | 19 | 2026-03-29 |
| `GWLdEFdUsHcuusng` | Action in app Udia | no | 19 | 2026-07-04 |
| `Si1cPoh65Ld4z7Ej` | Atlas AI Media - YouTube Content Factory Draft v1 | no | 5 | 2026-06-05 |
| `wFCVE4eSNMzHOCaB` | BE - SLA reassign (test, cada 2 min) | no | 2 | 2026-08-18 |
| `CKquvEw7eVdl7dH8` | chatbot onia | no | 8 | 2026-05-15 |
| `yBAui4NeLxVbS6yf` | Chatbot Onia | no | 3 | 2026-05-15 |
| `XxiHPNgpsL5FsHct` | DentalGest - Email Intake (ONIA Core) | no | 3 | 2026-08-07 |
| `t17aey6LEAhAITWp` | Ejercicio flujo de datos | no | 5 | 2026-07-04 |
| `A36FdAXRPKW6ULoM` | formularios con mensajes finales | no | 8 | 2026-07-04 |
| `ak94elj76ZnDihaE` | Generate AI viral videos with VEO 3 and upload to TikTok | no | 19 | 2026-03-21 |
| `qOVpQwPZplQKYkMc` | GestiOS — Birthday WA [WF-GS-03] | no | 6 | 2026-05-27 |
| `xx4wzzzqZBGfu836` | GestiOS — Plan Expiry WA [WF-GS-02] | no | 6 | 2026-05-27 |
| `6oowIHo8G9baBOYc` | GestiOS — Weekly Admin Digest [WF-GS-04] | no | 6 | 2026-08-07 |
| `Qa8DRaOMKb6D8E5h` | Hermes Drive Download Test IMG 0198 | no | 2 | 2026-06-02 |
| `lryabRhGQW4WIuJG` | Hermes Radar Diario Creativo y Clientes | no | 10 | 2026-07-03 |
| `T3qtKnj94fBXQsxY` | Hermes Telegram Chat ID Capture | no | 3 | 2026-07-04 |
| `p581sT9qsuJWJwZm` | Hermes TEMP - Apply DentalGest Safe RPC Stubs | no | 2 | 2026-06-05 |
| `DnYZpcKpTYSeaq9G` | Hermes TEMP - DentalGest PostgREST Status Check | no | 2 | 2026-07-04 |
| `QsYDofU4pRy3fZPp` | Hermes Temporary Drive Download Bridge | no | 3 | 2026-06-02 |
| `zediOCdtlP1zpImK` | Mara Daily Content — Trend Research | no | 4 | 2026-06-15 |
| `dfSpN5mb5leC2SyM` | My workflow | no | 0 | 2026-02-21 |
| `dpkbcbEUDyRU60l3` | My workflow 2 | no | 0 | 2026-03-21 |
| `dxt3DySjoG2ZDXhF` | My workflow 3 | no | 4 | 2026-05-15 |
| `8Jb45VT5MgmrahPI` | Nodos Core y HTTP REQUEST | no | 3 | 2026-07-04 |
| `Se3ue1V8HOtdcie1` | Novedades IA Diarias - Perplexity a ClickUp | no | 4 | 2026-03-29 |
| `qdAEP9seSxp5whXh` | ONIA - Agenda: Briefing Diario | no | 4 | 2026-07-04 |
| `PEo2XKM1l1bgEwIr` | ONIA - Agenda: Crear Evento | no | 5 | 2026-07-04 |
| `2gk5aOIvIHBbttqJ` | ONIA - Aviso de pago QR (Telegram) | no | 5 | 2026-08-14 |
| `bJhSGHPYsaICEeKm` | ONIA - Chatbot Demo (Chatwoot) | no | 4 | 2026-07-26 |
| `kUwiJdrmw6hJsAXv` | ONIA - Comentario IG -> DM (Private Reply) | no | 9 | 2026-08-18 |
| `mxl618u4eT209hTc` | ONIA - Comentario IG -> DM (Private Reply) | no | 11 | 2026-08-18 |
| `w1GUalEbvYnLROUI` | ONIA - Comentario IG -> DM (Private Reply) | no | 10 | 2026-08-18 |
| `XcF5ydMLz3R0IYMd` | ONIA - Comentario IG -> DM (Private Reply) | no | 10 | 2026-08-18 |
| `GnmIyrHWb1mO5eNy` | ONIA - Demo Asistente Diario | no | 4 | 2026-07-04 |
| `aOb3lNzewdGckb9H` | ONIA - Demo Cliente New Sakura | no | 4 | 2026-06-16 |
| `437BdFPI3cR0OP0E` | ONIA - Guiones Diarios de Contenido | no | 5 | 2026-07-04 |
| `NDXLJiR00ciQx72V` | ONIA - Guiones Diarios de Contenido | no | 5 | 2026-07-10 |
| `jspfoUsjQfQ1VXY4` | ONIA - Prospeccion diaria | no | 3 | 2026-07-04 |
| `rGvQb4CRBdJPwrp1` | ONIA - Prospeccion Diaria | no | 5 | 2026-07-05 |
| `VeCHKr6wkK5Wet25` | ONIA - Scheduled Operations Pack | no | 23 | 2026-07-05 |
| `tUaQasfCDGOXEl2j` | ONIA - Tipo de cambio Bolivia diario | no | 5 | 2026-07-04 |
| `nAGwe7DzxNQzMxXk` | ONIA - Video Intake (link por Telegram) | no | 4 | 2026-08-12 |
| `iqsnnQXlJyypiew8` | ONIA - Web Factory VPS Radar | no | 7 | 2026-07-04 |
| `FGqyNTrQfMIFiVG2` | ONIA — Pipeline Llamada → Propuesta | no | 12 | 2026-07-05 |
| `W2RvWYYLruUILTPl` | OnIA Bolivia - Chatwoot WhatsApp Bot | no | 2 | 2026-05-15 |
| `mwAL9Vx15ouc50OW` | practica flujo de datos | no | 8 | 2026-07-04 |
| `mrwDIycuY7SgkFG0` | prueba de datos | no | 8 | 2026-07-04 |
| `WICrWsMh5SOCGkms` | TEMP - Crear credencial Postgres VPS | no | 2 | 2026-08-14 |
| `Ca1oi36rEfM8gayJ` | TEMP - Diagnostico cual Supabase cred = kvepqgikokjlacxngkiw | no | 4 | 2026-08-14 |
| `AU2CUCAvmLBkFQeV` | TEMP - Diagnostico DB Postgres account | no | 2 | 2026-08-14 |
| `FRobuOxGPFp0N1F2` | TEMP - Diagnostico red docker VPS para payalert | no | 2 | 2026-08-14 |
| `ygAvtixiBfOKLFhO` | TEMP - Schema credencial postgres | no | 2 | 2026-08-14 |
| `Pg3g88TpGPZR759E` | TEMP - Smoketest Payment Alert DB | no | 2 | 2026-08-14 |
| `7DLfsyV1qPlTfsTI` | TEMP - Test credencial Postgres VPS | no | 2 | 2026-08-14 |
| `HKTDjx21ohYeO19Y` | udia | no | 2 | 2026-07-04 |
| `Ex4Uf3PHb19tt3fz` | UDIA Bot telegram errores | no | 2 | 2026-07-04 |
| `kYt1MnjOe1rnL5Rk` | Udia credenciales | no | 3 | 2026-07-04 |
| `uRZxWpe41EambE0W` | udia if y switch | no | 5 | 2026-07-04 |
| `8tQz364A2iDlUexR` | UDIA Workflow de Prueba | no | 0 | 2026-07-04 |
| `8xbGEIiNh6ctwUEF` | WF-00: Appointment Reminders | no | 11 | 2026-05-20 |
| `rROEMfHl1KVRvvbS` | WF-00: Appointment Reminders | no | 17 | 2026-08-07 |
| `NDgVcJGnvrgK91St` | WF-01: Trial Warnings | no | 7 | 2026-08-07 |
| `C9wNxI78lJUrcU4n` | WF-03: Recurring Invoice Delivery | no | 10 | 2026-08-07 |
| `8mO8JA5X0ILtvA1q` | WF-04: Overdue Invoice Dunning | no | 18 | 2026-08-07 |
| `Zzc1PgVzaKxOPxck` | WF-05: Birthday & Cleaning Reminder | no | 19 | 2026-08-07 |
| `3VUUpM6FRTXzTSdA` | WF-06: Weekly Clinic Digest | no | 9 | 2026-08-07 |
| `bfNDDU0b4rOfhHmH` | WF-08: GestiOS WhatsApp Onboarding | no | 9 | 2026-05-24 |
| `JN4tcboVyFKv4qGA` | WF-10: WhatsApp Addon Onboarding | no | 13 | 2026-08-07 |
| `7avrjjM6NoRnTUrL` | WF-11 Post-Treatment Follow-up | no | 10 | 2026-08-07 |
| `BUAMdJ1pz16CZ997` | WF-11: Patient Sync Incremental (Chatwoot) | no | 8 | 2026-05-24 |
| `uAEgHBsVNkkfcAzd` | WF-12: Plan Activation Confirmation | no | 6 | 2026-08-07 |
| `DtKnm7mTGTmM4dXu` | WF-13: WhatsApp Quota Alert | no | 9 | 2026-08-07 |
| `MedkND258rck68om` | WF-DISCORD-01: Resumen Diario de Agenda | no | 4 | 2026-06-09 |
| `M7m23v5JpPh4je76` | WF-DISCORD-02: Recordatorios de Eventos | no | 3 | 2026-06-09 |
| `rqwQv6THGv3JU4tx` | WF-DISCORD-03 Crear Evento desde Discord | no | 6 | 2026-06-09 |
| `s7Ha6NlI3p51bEmQ` | WF-DISCORD-04 — Alertas de Tareas Pendientes en Notion | no | 5 | 2026-05-27 |
| `KQsJ9l87LsWzhn7e` | WF-DISCORD-04: Alertas Tareas Notion | no | 6 | 2026-06-09 |
| `kfE43OhmczUkAKiN` | WF-DISCORD-05 Asistente Discord | no | 11 | 2026-06-09 |
| `1Ci5Vt94VRN9sO3G` | WF-DISCORD-06 — Alertas de suscripciones próximas | no | 5 | 2026-05-27 |
| `dtl2ru7enIbao76C` | WF-DISCORD-06: Alertas de Suscripciones | no | 5 | 2026-06-09 |
| `dybtwU9dejZXwYKF` | WF-GS-01 — Trial Expiry Warning- Gesti-os | no | 11 | 2026-05-24 |
| `CllIkRkqdcGXS67o` | WF-GS-05 — Nuevo Tenant Notificación Admin - Gestios | no | 4 | 2026-05-24 |
| `jtLIb0i6jxAZOvwa` | WF-GS-05: BCP Auto Payment Confirmation | no | 11 | 2026-07-03 |
| `H1PDrinGPYtBcyhw` | WF-GS-ERR-01: Sentry to GitHub Issue Draft | no | 3 | 2026-06-04 |
| `JMPS3Cv4GWKoWRwQ` | WF-PROSP-01: Daily Lead Finder Bolivia | no | 12 | 2026-06-04 |
| `B5yKh4RxrYjAHIq6` | WF-PROSP-02: Email Scraping Retry | no | 9 | 2026-06-04 |
| `LMEFUMl4oiK8izNX` | ZZ TEST credenciales Gmail (borrar) | no | 4 | 2026-08-07 |
| `2m9l8UCZObqEF8eM` | ZZ TEST remitente credencial nueva (borrar) | no | 2 | 2026-08-18 |
| `MqKr54wUwAkXEGPy` | ZZ TEST remitentes Gmail ronda 2 (borrar) | no | 3 | 2026-08-07 |

Total: 136 workflows — 44 activos, 92 inactivos.
