# Cola · Plataforma Onia 1.0

> Reconciliada con GitHub el 2026-10-16 17:30 UTC (latido). La cola del 10-oct estaba vieja:
> de sus 12 puntos, 9 ya están mergeados en `master` de onia-platform (#141, #142, #136 con #127/#129/#130,
> #139, #114, #118, #119, #110, #144). `master` va por el pulido 12 (#183, 16-oct) y #184 (pulido 13) está en borrador.
> Esta sesión de latido NO mergeó ni publicó nada: los borradores de abajo tienen 6 días y migraciones; los decide la sesión dueña.

## Abierto (PRs en borrador, estado medido hoy)
- [ ] #124 términos (punto 14): limpio contra master. Mergear y mirar el alta en prod.
- [ ] #132 K1 (respuesta al recordatorio): limpio contra master.
- [ ] #113 gracia C13: CONFLICTO con master. Rebasar, actualizar `PlanClient.estado-real` y `vencimientos`.
- [ ] #140 widget W1/W1b (rama `integ/w1-w1b`): CONFLICTO. Rebasar. Aparte: bloquear `/public/api/` en Chatwoot y `hmac_mandatory` en los inboxes API.
- [ ] #154 S2 (IP solo desde Cloudflare): CONFLICTO, CI cancelado. Rebasar y volver a correr.
- [ ] #168 web guiada dental: CI en rojo (1 failure). Ver la causa.
- [ ] #170 web business snapshot: limpio.
- [ ] #184 pulido 13: la sesión `optimistic-ride` lo termina (falta la tarjeta de la ayuda). No tocar.
- [ ] Refrescar la demo dental en prod (`scripts/demo-venta/seed-demo.sql`) y sacar las capturas C1-C7 del VSL.
- [ ] SQL del B22 (REVOKE a anon) aplicado y medido. Mergeado, no aplicado: espera el OK textual de Sergio Urcullo.

## Bloqueado
- Respaldo afuera (punto 4): bucket R2 (gasto). Destraba: Sergio Urcullo.
- SIAT etapa VI: el CAFC del piloto. Destraba: Sergio Urcullo (solo él abre el portal).
- Lectura de esta cola: `onia-hermes/main` quedó en el 10-oct (`2cdefca`) y `docs/ONIA_1.0_CORTE.md` no existe en `main`. Destraba: la madre (traer las ramas con las colas nuevas a `main`).
- Merge y publicación desde el latido: sin la cola vigente no se mergean borradores con migraciones. Destraba: la sesión Plataforma con la cola al día.

## Próximas 3 destrabadas (para terminar la 1.0)
- [ ] 1. Rebasar #113, #140 y #154 contra master y correr la suite completa (sin pushear entre :20 y :55 UTC en horas de publicación).
- [ ] 2. Mergear #124 y #132 (limpios) con CI verde, publicar con `publicar.sh` y MIRAR en prod.
- [ ] 3. Decidir #168 (CI rojo) y #170; después refrescar la demo y sacar C1-C7.

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima tarea técnica pertinente, cargar `equipo-de-agentes` y `aprender-de-todo`; usar la regla de contexto verificable de la ficha «cinco archivos antes de vibe code» y registrar sesión, fuentes canónicas, artefacto y prueba en esa ficha. No crear documentos duplicados ni abrir otro frente para demostrarlo.
