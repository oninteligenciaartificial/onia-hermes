# Cola · Plataforma Onia 1.0

> Reconciliada con GitHub el 2026-10-16 17:30 UTC (latido). La cola del 10-oct estaba vieja:
> de sus 12 puntos, 9 ya están mergeados en `master` de onia-platform (#141, #142, #136 con #127/#129/#130,
> #139, #114, #118, #119, #110, #144). `master` va por el pulido 12 (#183, 16-oct) y #184 (pulido 13) está en borrador.
> Esta sesión de latido NO mergeó ni publicó nada: los borradores de abajo tienen 6 días y migraciones; los decide la sesión dueña.

## COBRAR (orden de Sergio Urcullo, 16-oct; todo lo demás en pausa)
- [ ] 1. #113 gracia 7 días + dejar de renovar: master mergeado (`76b61bda`), review independiente sonnet sin CRITICAL/HIGH (4 LOW; comentario corregido en `3bb11677`), suite 945/15327/0 rojos, CI verde, PR en listo. BLOQUEADO el merge: el clasificador de permisos de la sesión lo niega («Merge Without Review»). Destraba: Sergio Urcullo (mergear #113 o autorizar el merge en esta sesión). Al mergear, `onia-publicar-solo` lo publica a las 21:50 UTC; luego MIRAR con una cuenta ZZ QA.
- [ ] 2. #124 aceptación de términos: limpio contra master, CI verde. Migración `20261008000000_add_terms_acceptances` revisada (RLS + REVOKE, aditiva): OK. NO mergear antes de aplicarla en prod (el alta la escribe en la transacción; sin tabla, el alta falla). BLOQUEADO: leer/escribir la base de prod por SSH lo niega el clasificador («Production Reads»). Destraba: Sergio Urcullo o la madre local (backup + `docker exec supabase-db psql` con `SET search_path TO public`).
- [ ] 3. Cobro E2E con ZZ QA: depende de #113 publicado y de acceso a prod/admin. Nota del review: aprobar un pago de un cliente ahora exige reservar («Validar») y cargar N° de factura (C15b): el checkout debe decir lo mismo.

## En pausa (no son del cobro) (PRs en borrador, estado medido hoy)
- [ ] #132 K1 (respuesta al recordatorio): limpio contra master.
- [x] #140 widget W1/W1b (rama `integ/w1-w1b`): master mergeado (4 conflictos: proxy, `listMessages` acepta número o rango, 2 docs); tests del canal web alineados con master; tsc 0, suite 943 archivos / 15360 tests / 0 rojos — `fdff71bc`. Falta CI del PR, mergear y publicar; luego bloquear `/public/api/` en Chatwoot y `hmac_mandatory` en los inboxes API (infra). modelos: sonnet.
- [x] #154 S2 (IP solo desde Cloudflare): master mergeado en la rama, suite 938/15279/0 rojos, CI verde (Lint, Typecheck, Tests & Build, Secret scan) — `b060fade`. Falta: mergear y publicar. modelos: sonnet.
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

## Próximas (cuando se destrabe el cobro)
- [ ] Decidir #168 (CI rojo) y #170; después refrescar la demo y sacar C1-C7.

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima tarea técnica pertinente, cargar `equipo-de-agentes` y `aprender-de-todo`; usar la regla de contexto verificable de la ficha «cinco archivos antes de vibe code» y registrar sesión, fuentes canónicas, artefacto y prueba en esa ficha. No crear documentos duplicados ni abrir otro frente para demostrarlo.
