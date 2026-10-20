# Handoff — carril auditoría y limpieza del repo

> Sesión «Auditoría y limpieza del repo» (Haiku), archivada el 20-oct-2026 por la Principal al ordenar las sesiones. Backlog, no urgente: la etapa vigente es conseguir clientes. Lo de onia-platform (PR #187, «24/7» en pricing.ts) va a la sesión de Plataforma; el resto, por issues a la orquesta cuando haya cupo.


Escrito para la Principal. No se editó ningún repo para esta nota.

## 1. Decisiones de Sergio Urcullo (textuales, de sus mensajes)

- Token Claude Max en el VPS, respondiendo a «¿revocar?»: **"1.- revocar"**
- Crece, respondiendo a «¿3 o 4 usuarios?»: **"2.- 4"**
- Web, respondiendo a «¿lista pública "Desde Bs 2.000" o caso por caso?»: **no respondió eso.** Escribió: *"3.- Por ejemplo, quiero que las web, o sea, se desarrollen como así automáticamente, digamos, que diga, ok, te la hago tu web y poner un bot ahí que haga webs automáticamente. O sea, podría estar interesante. Obviamente con ya criterios míos y con algunas cosas ya definidas, pero de esa manera estaría bueno. Así que quiero que lo revises y me digas."* Es un pedido de revisión, no una decisión.
- Salidas generadas fuera de git, respondiendo a «¿Saco las salidas de git sin tocar la historia? (mi voto: sí)»: **"4.-.  esta bien"**. Lo leí como sí a sacarlas del índice, sin reescribir historia.

Nota: la decisión de rubros (dental → importadora), quién orquesta, usted/vos en web y anuncios, y qué es «visual» ya están escritas en CLAUDE.md por Sergio el 19-oct. No vienen de esta sesión.

## 2. Tareas de limpieza pendientes (cada una, con su «hecho cuando»)

Formato: tarea | quién decide | hecho cuando

1. Revocar token Claude Max del VPS (apagar línea del cron `claude-guardia.sh`, cerrar sesión de la CLI en el VPS, revocar en claude.ai) | Sergio ya dijo "revocar"; falta confirmar el apagado del guardián | cron sin esa línea; `oauthAccount` ausente en `/root/.claude.json`; Sergio confirma revocación en su cuenta
2. Mergear y desplegar PR #187 (Crece = 4) | Sergio | PR mergeado en master; deploy hecho; vitrina de Crece muestra "4 usuarios incluidos"
3. Borrar worktree `C:/dev/proyectos/onia-platform-crece4` (tiene node_modules) y su rama tras el merge | sesión sola, después de 2 | `git worktree list` sin esa entrada; carpeta borrada
4. Sacar 1.821 salidas generadas del índice de onia-hermes (3,47 GiB; sin tocar historia) | Sergio autorizó; bloqueado por permiso de crear worktree en repo compartido | PR con `.gitignore` y `git rm --cached`; `git ls-files` de esas rutas = 0 tras merge; respaldo verificado antes del merge
5. Actualizar la nota de `.gitignore` línea 49 ("outputs SÍ se suben") en el mismo PR de 4 | sesión sola (junto con 4) | nota dice lo nuevo
6. Respaldo de salidas (ya hecho): `E:\onia-respaldo-salidas-2026-10-20`, 1.821/1.821 verificados | hecho | verificado; no borrar hasta confirmar que la nube/otro equipo tiene lo necesario
7. Excluidos de 4 (requieren decisión de Sergio): `tmp-assets/` (fotos de Sergio), `identity-bank-50`, `mara-identity-20260616`, `sergio-approved-media/{inbox,processed,identity-shoots,final-avatar-identity-lock,talking-video-lock}`, `creator-video-references` (derechos), `references-inbox`, `assets/onia` | Sergio | decisión por carpeta anotada
8. Limpiar basura de `.git` (1,47 GiB de `tmp_pack_*` y `tmp_obj_*`) | Sergio (toca el repo compartido) | `git count-objects -vH` sin garbage; sin procesos git activos
9. Reescribir historia para bajar peso | Sergio (no recomendado ahora) | no hacer sin respaldo completo y aviso a todas las copias
10. Alinear docs de precios viejos (750 / 1.500 en QUE_SE_VENDE:22-23, PRICING_2026:82-83, PSICOLOGIA, PRECIOS_COMPETENCIA, DEPLOYMENT) con `subscription-plans.ts` (890 / 1.290) | sesión sola, en worktree de E: | `grep` de "750" y "1.500" en docs vivos = 0 fuera de `historial/`
11. Quitar "24/7" del tagline del chatbot en `onia-platform` (`pricing.ts:111` y `:321`) | sesión sola, PR en onia-platform | `grep "24/7"` en pricing.ts = 0; CATALOGO:129 se cumple
12. Corregir `ONIA_CLIENTE_IDEAL.md:60` y `:268` ("los agentes son el diferenciador") según CLAUDE.md (el sistema es la oferta; el bot es add-on) | sesión sola | frases eliminadas o reescritas
13. Quitar SIAT como ventaja en `ONIA_ADQUISICION_Y_PAUTA.md:138` | sesión sola | la línea no lo lista como diferenciador
14. Corregir `ONIA_ESTRATEGIA_DE_EMPRESA.md:224` y `:425` (solo dental) y `ONIA_ADQUISICION_Y_PAUTA.md:36-40` (dental y estética) con el orden de CLAUDE.md (dental → importadora → el resto) | sesión sola | las tres fuentes dicen lo mismo
15. Alinear CLAUDE.md:46 y :183, y `AGENTS.md:33` (madre) con «Hermes + programa fijo» | sesión sola, verificar en main | las tres fuentes en main dicen lo mismo
16. Corregir `AGENTS.md:30` y `CLAUDE.md:484` (empujar `claude/*` publica; integrador onia-cola) | sesión sola | texto dice que onia-cola murió (16-oct) y que empujar no publica
17. Alinear `AGENTS.md:290` (usted) con CLAUDE.md (desde 19-oct web y anuncios también usted) | sesión sola | ambos textos iguales
18. Copiar el gate "Step 2b" de embedded-captions de `.agents` a `.claude/skills/embedded-captions/SKILL.md` | sesión sola | `grep "Step 2b"` en ambas = presente
19. Copiar `higgsfield-soul-id/references/photo-guide.md` de `.claude` a `.agents` (versión 30-sep) | sesión sola | diff limpio
20. Copiar `media-use/audio/assets/sfx/.gitignore` de `.agents` a `.claude` | sesión sola | archivo en ambas
21. Mover a `historial/`: pauta vieja (PAUTA_COMPETENCIA_20260815, ADS_CAMPANA_1_LISTA_20260813, PLAN_CONTENIDO_Y_ADS_20260820, CRONOGRAMA_CONTENIDO_20260814, META_VIDEO1_GUION_20260815, GUION_ANUNCIO_SIN_CARA_20260820), superados (6), chatbot viejo (3), Lucía one-off (10), infra (11), `cola/plan-3-semanas`, VENDOR_SALES_PLAYBOOK_2026 (contradice "no hay equipo de ventas") | sesión sola (`git mv`) | nombres fuera de `docs/` vivos; sin links rotos
22. Mover a `historial/` o cerrar 26 handoffs de carriles muertos (lista en el reporte de agentes); conservar 7 (onia-cola, chatbot, fiscal, hermes-cal-nube-20260928, homelab-orquestacion-20260927, marca-sergio-guiones-20260927, onia-v1-panel-ui); fusionar cobro-e2e; borrar limpieza-skills tras confirmar | sesión sola; borrar = Sergio | `handoff/` solo con carriles vivos
23. Fusionar 21 docs con fecha en 7 grupos de tema y renombrar 8 vigentes sin fecha | sesión sola | un doc sin fecha por tema
24. `onia-core/business-tiers.json` tiene 390/890/1990 (fuente fantasma) | sesión sola: borrar o marcar histórico | sin referencias vivas
25. Campaña `editor-videos/scripts/seed-campaign.mjs:192` dice "Pro de DentalGest" | sesión sola: corregir o borrar | sin "DentalGest" en código de campaña
26. Skill `onia-propuestas`: precios web 790 / 1.500 y 2.000 / 4.500 "premium" | sesión sola; decisión de precios de Sergio (17-sep: básicos Landing 2.000 y Profesional 4.500; Pro y tienda en llamada) | skill alineada con `webs.ts`
27. CLAUDE.md:560 "a Sergio no se le habla de PRs" vs memoria del 19-oct (PR siempre con enlace) | sesión sola | texto coincide con memoria
28. Codex y git: CLAUDE.md:172 "Codex no hace git" vs AGENTS.md:105 "commitear y pushear" | sesión sola | texto coincide
29. Canal madre → nube (CLAUDE.md:190-193, skill §2bis) vs canal cortado el 17-oct | prueba técnica; sesión sola | un envío real probado y documentado; texto corregido
30. Plan de webs con bot (idea de Sergio, 20-oct): revisión hecha, pendiente de decisión y de plan | Sergio decide si quiere el plan | doc de plan aprobado por Sergio; no construir antes

## 3. PR #187

- Qué es: PR en `oninteligenciaartificial/onia-platform`, rama `fix/crece-4-usuarios` (commit `a3a2c11d`), base `master`. Título: "fix(plans): Crece pasa de 3 a 4 usuarios".
- Cambia: `lib/plan-catalogo.ts` (`users: 4` en crece y comentario de topes), `lib/subscription/plan-display.ts` y `app/(dashboard)/settings/PlanClient.tsx` (copia "4 usuarios"), y el test `lib/subscription/plan-promete-lo-que-el-rubro-alcanza.test.ts`.
- Pruebas: 474 tests de suscripciones en verde. Suite completa: 5693 en verde, 8 fallan en `.github/scripts/rango-gitleaks.test.ts` (no relacionado; no verificado en master).
- Estado al consultarlo (2026-10-20, `gh pr view`): **OPEN, no draft, no mergeado**, última actualización 19:22 UTC. Sigue vivo y sin revisar.
- Falta: merge (decisión de Sergio) y deploy.
