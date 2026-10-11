# Cola · Plataforma Onia 1.0

Orden: lo que destraba cobrar primero. Cada PR: **leer la revisión de Hermes** (`cola/loop/hermes-jarvis.md`, §E…; un HIGH abierto = no se mergea, regla de la madre del 11-oct), integrar con master, suite completa, mergear, `publicar.sh`, MIRAR en prod.

- [x] #141 S1+S1b (IPv6 por /64): en producción desde el 9-oct 18:50 UTC (`release-c94b9daa`), mirado.
- [x] #143 F1 (la letra dentro del sistema) y #142 U2+U2b (pago de usted): en producción desde el 10-oct 18:50 UTC (`release-21f0c7e6`), mirados a las 19:17 (el checkout con login lo mira la madre).
- [x] #144 `/book` de usted: en producción desde el 10-oct 18:50 UTC, mirado a 390 y 1440.
- [ ] #136 = las 5 pantallas: **mergeado** `282ae3ab` (11-oct 05:46 UTC, CI y secretos en verde; el árbol de master es idéntico al probado con 10.505 en verde). Sale a las 06:50 UTC. Falta MIRARLO sin login (release, `/offline.html`, `sw.js`, logs) y con login la madre. Entró con 2 HIGH de la revisión E3 de Hermes que no leí (caja: «1.500» = Bs 1,50 sin confirmar ni reabrir; borrar paciente borra sus caras): el arreglo es F136.
- [ ] #140 widget W1-W1e + W1f (se presenta con el nombre de la clínica, bundle del 10-oct) + infra: origen solo para Cloudflare, bloquear `/public/api/` en Chatwoot y `hmac_mandatory` en los inboxes API. Espera el OK de diseño de Sergio Urcullo a W1f.
- [x] #139 canal privado (punto 3): en producción desde el 10-oct 18:50 UTC, migración registrada a las 18:44. Falta solo MIRAR «En vivo» con login (madre).
- [x] #114 factura (punto 15) y #145 logo de `/book`: en producción desde el 10-oct 21:55 UTC (`release-d8ca5a32`), mirados sin login (`/admin/payments` lo mira la madre).
- [ ] #124 términos (punto 14, migración ya aplicada) y después #113 gracia C13 (actualizar `PlanClient.estado-real` y `vencimientos` al mergear): esperan el sí de Sergio Urcullo (legal).
- [x] #118, #119, #110, #127, #129 y #130: GitHub los marcó mergeados al entrar #136 (05:46 UTC). #135 (apilado sobre #129) cerrado a mano como incluido.
- [ ] #146 títulos públicos de usted: **mergeado** `a7d8c1ed` (05:47 UTC, Hermes: APROBAR). Sale a las 06:50 UTC con #136. Falta mirar el título de `/login`.
- [x] Demo del lunes 12-oct (07-11 UTC): plan `reset=2` + lista C1-C7 → `cola/demo-venta-refresco.md` (11-oct). Correrlo pide el sí de Sergio Urcullo acá.
- [ ] #132 K1 (respuesta al recordatorio): **después** según el corte (nadie lo llama hasta conectar el WhatsApp del negocio).
- [ ] F136, los 2 HIGH de #136 (caja es-BO + confirmar y reabrir; caras como expediente): lo corre la madre en Codex Astra (`codex/f136-caja-odontograma`), PR después de las 07:10 UTC. Plataforma revisa con la revisión de Hermes, integra y mergea antes de las 09:20 para que salga a las 09:50. No se duplica.
- [ ] U3 (`/agents` y el Inicio de usted): PR de la madre a las 07:12 UTC. Revisar, integrar, mergear.
- [ ] U3b (el resto de las pantallas del video C1-C7 de usted): **terminado** en `claude/optimistic-ride-1sp5fe` `d8c486f5`. Tiene `tsc` 0, la suite 10.532 en verde y 0 rojos, y eslint 0. Va sin `/agents` y sin los `agents-*.ts` que se ven ahí: son de U3, así no choca. El contrato Codex quedó cancelado. El PR se abre después de los 4 de la madre (07:12 UTC), para que su CI vaya primero, y se mergea después de U3. Falta MIRARLO con login (madre).
- [ ] U4 registrarse, confirmar el correo y entrar, de usted (absorbe Q9 de Hermes): contrato `codex-tareas/plataforma-U4-usted-registro-y-entrada.md`, `pendiente`. Lo lanza la madre; Plataforma revisa, integra, mergea y mira `/login` y `/register`.
- [ ] U5 el alta guiada, la guía de inicio y el recorrido, de usted: contrato `codex-tareas/plataforma-U5-usted-configurar-el-negocio.md`, `pendiente`. Mismo camino que U4; corre en paralelo (solo comparten la línea base del trinquete).
- [ ] P-01 la prueba anon del B22 (`scripts/verificacion/b22-anon.mjs`): contrato `codex-tareas/plataforma-P01-b22-anon.md`, `pendiente`. Se corre contra producción solo después de aplicar el B22, que pide el sí de Sergio Urcullo.
- [ ] P-02 la guarda de la demo, un solo id por correo (`scripts/demo-venta/resolver-org.sh`): contrato `codex-tareas/plataforma-P02-demo-un-solo-id.md`, `pendiente`. Al integrarlo, el paso 1 de `cola/demo-venta-refresco.md` lo usa.
- [ ] U6 correos y avisos del plan de usted (`lib/email.ts`, `lib/subscription/**`, `lib/plan-limits.ts`, `components/plan/AsientosCard.tsx`): escribir el contrato cuando #113 se mergee o se descarte, porque #113 cambia esos mismos archivos.
- [ ] Infra de la bandeja en tiempo real (webhook de Chatwoot + `CHATWOOT_EVENTOS_SECRET` + recrear el contenedor): el control de permisos frenó el `docker exec` del script en producción (11-oct 05:27 UTC), aun en modo solo lectura. Necesita la línea de Sergio Urcullo en esta sesión o que lo corra la madre. Sin eso la bandeja anda con sondeo.
- [ ] Refrescar la demo dental en prod (`scripts/demo-venta/seed-demo.sql`, pasos en `cola/demo-venta-refresco.md`) y sacar las capturas C1-C7 del VSL
- [ ] Mirar con login lo publicado el 8-oct (#128): agenda «Hoy» con WhatsApp, «sin confirmar», tarjeta del chatbot; y el punto 11 (reprogramar, días cerrados en `/book`, aviso de reserva online)
- [ ] SQL del B22 (REVOKE a anon) aplicado y medido (no entró en el sí del 10-oct)

## Bloqueado (solo Sergio Urcullo)
- Respaldo afuera (punto 4): bucket R2 (gasto).
- SIAT etapa VI: el CAFC del piloto.

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima tarea técnica pertinente, cargar `equipo-de-agentes` y `aprender-de-todo`; usar la regla de contexto verificable de la ficha «cinco archivos antes de vibe code» y registrar sesión, fuentes canónicas, artefacto y prueba en esa ficha. No crear documentos duplicados ni abrir otro frente para demostrarlo.
