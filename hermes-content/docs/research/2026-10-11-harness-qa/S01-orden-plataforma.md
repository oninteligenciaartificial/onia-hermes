# S01 · Orden de trabajo de Plataforma tras el clear (11-oct-2026)

Foto: 2026-10-11 05:31 UTC. Solo lectura: no se commiteó, no se publicó, no se mandó mensaje a ninguna sesión, no se escribió fuera del worktree.

## Estado medido

- Cola `hermes-content/docs/cola/loop/plataforma.md`: **13 casillas sin marcar** (`grep -c '\[ \]'`): 12 de la lista de producto (líneas 5-16) y 1 de verificación (línea 23). Ninguna marcada.
- PRs abiertos, `gh pr list --repo oninteligenciaartificial/onia-platform --state open`: **16 abiertos, 14 en borrador**. No borrador: #118 (`codex/c5-agenda-dia-20261006`, UNSTABLE) y #70 (docs correos, UNKNOWN por mergeStateStatus).
- #141, #142, #143: `gh pr view` → **MERGED** (#141 el 9-oct 13:53 UTC; #142 y #143 el 10-oct 13:15 UTC). Que estén en producción: UNKNOWN desde aquí (no hay acceso al VPS desde esta sesión); el log de la sesión de Plataforma dice «en producción» pero no lo muestra.
- #146 (`fix/titulos-de-usted`, borrador, sin mergear): Lint, Typecheck, Tests & Build **pass** (19m36s); **Secret scan pending** (run 38112671937 / 38112671947 en cola). Foto 05:31 UTC.
- #136 (bandeja v3 + PWA, `claude/optimistic-ride-1sp5fe`, borrador, head `1fd14770`): Lint, Typecheck, Tests & Build **pass** (20m43s, completado en el log a las 05:25 UTC); **Secret scan pending**. Foto 05:31 UTC. Incluye por ancestría #118, #119, #110, #130, #127, #129 y #135 (`git merge-base --is-ancestor`, medido 05:22 UTC).
- Migraciones nuevas de #136 vs master: `20261004190000_add_daily_cash` y `20261006220000_add_tooth_surfaces`. Log de la sesión (05:22 UTC): las tablas son `daily_cash_sessions`, `daily_cash_expenses`, `tooth_surface_records`. Aplicadas en VPS: no medido desde aquí.
- Migración B22 `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql`: existe en `origin/master` (`gh api contents`). Aplicada en la base: UNKNOWN (requiere VPS).
- Línea de Sergio Urcullo «publica la pantalla… hacemos clean y seguimos» (04:41:42 UTC, `list_events` del transcript). La sesión la contradice dentro de su propio log: a las 05:18:23 escribe que no la toma como permiso («se la pedí de nuevo»); a las 05:21:55 crea la tarea «Publicar #136» con «Autorización: Sergio Urcullo 04:41:42 UTC en esta sesión».
- Check-in programado: `send_later` a las 05:55:00 UTC (trigger `trig_018rLeLcwUm8SR7a63ZJaVeC`, log 05:18:02). Su texto: si #146 tiene CI verde incluido Secret scan y es antes de 06:20 UTC, marcar listo y mergear.
- Ventana de merge según el log: #136 «antes de 06:20 UTC» (TaskCreate 05:21:55); #146 «fuera de 06:20-07:10» (TaskCreate 05:21:56) y «lo mergeo antes de 06:20» (mensaje 05:18:23). Hora de publicación del cron: 06:50 UTC.
- Estrategia `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` línea 222: Etapa 1 «Producto único · hoy a 5 clientes» marcada VIGENTE. Criterio de salida literal: **«Bs 3.750/mes recurrente cobrado»**. Hoy: 0 clientes pagando (handoff `onia-1.0-nube.md`, sección 2; no re-verificado en base).
- Handoff de Plataforma: `hermes-content/docs/handoff/onia-1.0-nube.md` (134 líneas, escrito 04:55 UTC; última modificación 05:17:52 UTC, commit `9725f3eed`). Secciones 3 (EN PRODUCCIÓN) y 4 (EN VUELO).
- Demo de venta: `scripts/demo-venta/` existe en `origin/master` de onia-platform con `seed-demo.sql` y `verify-demo.sql`. No existe `resolver-org` (ni `.sh` ni `.test.sh`). Sin conflicto de nombres.
- `scripts/verificacion/` no existe en `origin/master` (`gh api` → 404). P-01 crea el directorio.
- U3 (`/agents` e Inicio de usted): contrato `hermes-content/docs/handoff/codex-tareas/U3-usted-agentes-e-inicio.md` existe en el worktree de hermes (commit `9725f3eed`). Log: un mensaje de la madre DESARROLLO-INFRA dice que ya corre en Codex. No verificado.
- Check-in de #146 a las 05:55: el trigger está programado (medido). Su ejecución: UNKNOWN hasta las 05:55.
- Observado en el log de la sesión (no es acción de esta lectura): 05:24:00-05:24:02, la sesión intentó cancelar 3 runs de CI de otras ramas (`actions_run_trigger cancel_workflow_run`) y recibió 403 «Resource not accessible by integration». 05:25:42, el clasificador denegó un comando de escritura remota por SSH («Remote Shell Writes»).

## Brecha

1. La cola no refleja la producción: #141, #142 y #143 están MERGED y la cola los tiene sin marcar. Quien lee la cola cree que hay que hacerlos otra vez.
2. #146 y #136 no se pueden mergear: Secret scan pendiente. Lint ya está verde en ambos.
3. Permiso para publicar #136: pregunta abierta, no conflicto resuelto. La regla del 9-oct (CLAUDE.md, «Qué se publica sin preguntar») manda publicar lo revisado con gates verdes, incluido diseño. La sesión se contradijo entre 05:18:23 y 05:21:55 sobre si la línea de 04:41 UTC vale como permiso. Decide Sergio Urcullo si quiere reconfirmar; la madre no lo decide.
4. B22 (REVOKE anon de `onia_whatsapp_sends`): migración mergeada en master, aplicación en base UNKNOWN. Requiere OK textual de Sergio Urcullo y ejecución en el VPS.
5. #140 (widget W1): espera OK de diseño de W1f de Sergio Urcullo (diseño nuevo).
6. Demo del lunes 12-oct (07-11 UTC): escribe en producción solo en la cuenta demo. Requiere sí de Sergio Urcullo. La guarda de correo no tiene prueba automática (P-02).
7. #124, #113, #114, #110, #132: sin estado de CI registrado en este informe (UNKNOWN). #110 tiene título «NO publicar sin OK de Sergio Urcullo».
8. Cola sin relleno: la madre pidió rellenar `plataforma.md` si baja de 3 tareas abiertas (mensaje de DESARROLLO-INFRA en el log). Esta cola tiene 12 de producto abiertas, así que no aplica hoy.

## Orden de trabajo (máx 7, del más urgente)

Alineado con Etapa 1 (producto único, criterio de cobro 3.750/mes). Lo que destraba cobrar primero.

1. **#146 títulos de usted** (texto, sin migración). Aplica: sesión Plataforma. Condición: Secret scan verde. Es código hecho y revisado; no es contrato Codex.
2. **#136 bandeja v3 + PWA (#130) + #118 + #119 + #110 + #135 + #127 + #129.** Aplica: sesión Plataforma. Condición: Secret scan verde y la pregunta del punto 3 de la Brecha resuelta por Sergio Urcullo si la quiere. Migraciones `daily_cash` y `tooth_surfaces` con backup antes del swap (`onia-db`/`onia-deploy`). Código hecho; no es contrato Codex.
3. **Cerrar la cola `plataforma.md`**: marcar #141, #142 y #143 como MERGED (con fecha); quitar de la lista lo incluido en #136. Aplica: madre-dev (estado de carril, sin código).
4. **B22: aplicar el REVOKE a anon.** Aplica: Sergio Urcullo (OK textual y ejecución en el VPS). Codex prepara la prueba de hecho (P-01).
5. **Guarda de la demo** (P-02) antes del refresco del lunes 12-oct. Aplica: Codex Sol vía madre-dev; el refresco lo aprueba Sergio Urcullo.
6. **#140 widget W1 + infra de Chatwoot**: espera OK de diseño W1f de Sergio Urcullo; la infra va después. Aplica: Sergio Urcullo (diseño) y sesión Plataforma (infra).
7. **#124 términos (punto 14) y #113 gracia C13**: CI pendiente (UNKNOWN). #113 toca `PlanClient.estado-real` y `vencimientos`. Aplica: sesión Plataforma.

## Código cerrado para Codex

Solo P-01 y P-02. Los puntos 1, 2 y 7 son código ya escrito por la sesión (no hay que delegarlo). U3 ya está en la cola de contratos y no se duplica.

### Contrato P-01 · Prueba de que el anon no lee los envíos de WhatsApp

- META: script de verificación de solo lectura para la migración B22, sin aplicarla.
- Rama base: `origin/master` de `onia-platform` (anotar el SHA).
- Rama de trabajo: `codex/b22-prueba-anon`.
- Archivos nuevos: `scripts/verificacion/b22-anon.mjs` y `scripts/verificacion/b22-anon.test.mjs`.
- Qué hace: GET anónimo a `/rest/v1/onia_whatsapp_sends` con la clave anon de la URL que reciba por argumento. Espera HTTP 401 o lista vacía. Imprime solo el código de estado y el número de filas, nunca la clave.
- PRUEBA DE HECHO: `node --test scripts/verificacion/b22-anon.test.mjs` en verde, con un test que simule 401 y otro que simule 200 con filas (debe marcar FALLA).
- REGLA DE PARADA: si la clave anon aparece en un archivo versionado, parar y reportar. No tocar la migración ni la base. Codex no hace git: la madre revisa y commitea.

### Contrato P-02 · Guarda de la demo: un solo id por correo

- META: que el refresco de la demo falle si el correo no devuelve exactamente una organización.
- Rama base: `origin/master` de `onia-platform`.
- Rama de trabajo: `codex/demo-guarda-correo`.
- Archivos nuevos: `scripts/demo-venta/resolver-org.sh` y `scripts/demo-venta/resolver-org.test.sh`.
- Qué hace: recibe el correo y la cadena de conexión por variable de entorno; hace un SELECT que cuente organizaciones con ese correo; sale con código 1 si el conteo es 0 o más de 1, y con código 0 imprime solo el id.
- PRUEBA DE HECHO: `bash scripts/demo-venta/resolver-org.test.sh` en verde, con casos de 0, 1 y 2 filas simuladas por un `psql` falso en PATH.
- REGLA DE PARADA: no conectar a la base real. No cambiar `seed-demo.sql`. No hacer git.

## Configuración propuesta

Texto para pegar en `hermes-content/docs/cola/loop/plataforma.md`. Lo aplica madre-dev. Reemplaza las líneas 5-16 de producto.

```
- [x] #141 S1+S1b (IPv6 por /64): MERGED 9-oct 13:53 UTC
- [x] #142 U2+U2b (pago de usted): MERGED 10-oct 13:15 UTC
- [x] #143 F1 (fuentes del repo): MERGED 10-oct 13:15 UTC
- [ ] #146 títulos de usted: Secret scan verde, mergear (ventana: ver Estado medido)
- [ ] #136 bandeja v3 + #130 + #118 + #119 + #110 + #135 + #127 + #129: Secret scan verde; decide Sergio Urcullo si hace falta reconfirmar la línea de 04:41 UTC
- [ ] B22 REVOKE anon: aplicar tras OK textual de Sergio Urcullo; probar con P-01
- [ ] Demo del 12-oct: sí de Sergio Urcullo; probar con P-02
- [ ] #140 widget W1: OK de diseño W1f de Sergio Urcullo; infra Chatwoot después
- [ ] #124 términos y #113 gracia C13: CI pendiente
```

Nota: el estado «en producción» no se afirma. Solo se afirma MERGED, medido con `gh pr view`.

## Quién la aplica

| Ítem | Quién | Por qué |
|---|---|---|
| #146 merge | Sesión Plataforma | Código revisado, CI verde salvo Secret scan. Textos: la regla del 9-oct lo deja subir. |
| #136 merge | Sesión Plataforma | Código revisado, CI verde salvo Secret scan. Pregunta abierta sobre la línea de 04:41 UTC (punto 3 de la Brecha). |
| Reconfirmar la línea de 04:41 UTC para #136 | Sergio Urcullo (opcional) | La regla del 9-oct ya cubre diseño revisado; la sesión se contradijo. Decisión de Sergio Urcullo, no de la madre. |
| Cola `plataforma.md` | madre-dev | Estado de carril; sin código ni producción. |
| B22 REVOKE | Sergio Urcullo | Toca la base de producción en el VPS. Pide OK textual. |
| P-01, P-02 | Codex Sol vía madre-dev (`scripts/codex-tarea.sh`) | Código cerrado y verificable. Codex no hace git: la madre revisa y commitea. |
| Demo del 12-oct | Sergio Urcullo (sí) y sesión Plataforma (ejecución) | Escribe en producción, en la cuenta demo. |
| #140 diseño W1f | Sergio Urcullo | Diseño nuevo; CLAUDE.md lo reserva a él. |
| Check-in 05:55 de #146 | Sesión Plataforma | Programado por ella; ejecución UNKNOWN. |

## Prueba de hecho

- Cola: `grep -c '\[x\]' hermes-content/docs/cola/loop/plataforma.md` debe dar al menos 3 (#141, #142, #143) y las líneas deben coincidir con `gh pr view` (MERGED).
- #146: `gh pr view 146 --repo oninteligenciaartificial/onia-platform --json mergedAt,isDraft` con `mergedAt` no nulo, y `gh pr checks 146 --repo oninteligenciaartificial/onia-platform` con Secret scan en `pass`.
- #136: `gh pr checks 136 --repo oninteligenciaartificial/onia-platform` con Secret scan en `pass` antes de quitar el borrador.
- B22: `node --test scripts/verificacion/b22-anon.test.mjs` (P-01) en verde; y en el VPS, con OK de Sergio Urcullo, GET anon a `/rest/v1/onia_whatsapp_sends` → 401 (lo ejecuta él o la sesión con su permiso).
- Demo: `bash scripts/demo-venta/resolver-org.test.sh` (P-02) en verde antes del refresco del lunes.
- UNKNOWN que este documento no cierra: aplicación de B22 en base, estado en producción de #136 y #146, resultado del check-in de 05:55. Cada uno necesita acceso que esta lectura no tiene.
