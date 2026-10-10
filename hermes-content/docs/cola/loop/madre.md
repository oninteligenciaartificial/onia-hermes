# Cola · MADRE — libro único de puntos (nada se pierde)

Sergio Urcullo, 10-oct: *«quiero mínimo un subagente para cada cosa, ordenalo, no podemos perder cada punto, ese fue uno
de los errores de la anterior sesión madre»*. Un solo escritor: la madre. Cada punto tiene **dueño** (subagente con su
LLM, Codex, sesión o Sergio Urcullo), **estado** y **prueba**. La ronda (Haiku, cada 20 min) relee este archivo, marca lo
cerrado con su prueba y avisa lo que lleva más de 24 h sin moverse. Una sola madre: dos orquestadores se pisan.

Leyenda de dueño: `H` Haiku · `S` Sonnet · `O` Opus · `CxSol` / `CxAstra` Codex local · `CxNube` Codex cloud ·
`Plat` / `Marca` / `Ventas` / `Lucía` / `Hermes` sesiones de la nube · `SU` Sergio Urcullo.

## A. En curso (agentes trabajando ahora)
- [ ] A1 Equipos por sesión + guiones 17-23 oct (tendencias en vivo) — workflow `wf_b10e3aaa-a9f`: S referencia VoltAgent,
  3×S scouts web, H inventario, O guionista, O diseñador, O crítico → `docs/ONIA_EQUIPOS_POR_SESION.md` y
  `cola/plan-3-semanas/GRABAR-17-23-OCT.md`. Hecho = ambos en main + mensaje a cada sesión con su equipo.
- [x] A2 Análisis de `github.com/morluto/rea` (pedido de SU) — workflow `wf_7d7f64d2-ed6` (S función, O seguridad,
  S encaje/legal, S ficha) → `references/video-intake/2026-10-10-github-morluto-rea.md`. Hecho: ficha en main; veredicto = banco de ideas, NO instalar (riesgo alto en la PC, zona legal roja con competidores).
- [ ] A3 Publicación automática 15:50 UTC de master `32c7e0e8` (F1, #142, #139) — madre + Chrome a las 15:58 UTC.
  Hecho = /login y /checkout MIRADOS renderizados en prod, captura.

## B. Integrado con master, suite completa verde en la PC (dueño del merge: Plat, en su orden)
- [ ] B1 #114 C15b `5c5beaf8` (10.026/0, CLEAN) — **2 migraciones ANTES del merge** o prod cae (P2022).
- [ ] B2 #124 términos `2ee1dcfe` (9.943/0) — IP falsificable arreglada por CxAstra. **Texto legal: pasa por SU.**
- [ ] B3 #113 gracia `a8def40f` (10.017/0) — conflictos resueltos por CxSol; depende de B2 (términos).
- [ ] B4 #110 caja `1c5112a9` (9.965/0) — diseño + migración.
- [ ] B5 #119 odontograma `3e0575ef` (10.026/0) — diseño + migración.
- [ ] B6 #132 K1 `0abc65d5` (10.010/0).
- [ ] B7 #136 bandeja → `integ/bandeja-master` `1f529cf8` (10.189/0; el rojo de gitleaks fue carga, 10/10 solo) — diseño.
- [ ] B8 #140 widget → `integ/w1-fixes` `f981cd4a` (9.962/0): CxAstra sin hallazgos de seguridad; CxSol arregló 2 P2
  (sondeo tras envío fallido, orden 1-3-2). Falta la infra (`/public/api/` + `hmac_mandatory`).
- [ ] B9 #144 `/book` de usted (CxNube, 9.943 + trinquete) — sin migraciones; textos de producto → se publica sin preguntar.
- [ ] B10 #118 agenda por profesional — CLEAN, sin migración — diseño.

## C. Espera a Sergio Urcullo (se le pide UNA vez, en la sesión que corresponde)
- [ ] C1 En **Plataforma**: «sí, la regla del 9-oct es mía; publicá lo revisado; registrá y aplicá las migraciones con backup».
- [ ] C2 En **Marca**: la misma línea + «publicá las historias» + CTA «buscá X en Avisos» + grabar N07 y D03-A.
- [ ] C3 En **Hermes**: sí/no a `aplicar`.
- [ ] C4 Acá: Lucía G1 + renovar token de IG (vence 13-18 oct). El ensayo en el VPS lo frenó el control de permisos.
- [ ] C5 Acá: paridad nube = PC (16 skills + 2 agentes + reglas de memoria a CLAUDE.md/AGENTS.md). Frenado por permisos.
- [ ] C6 Acá: ¿CI como gate en vez de la suite de la PC? (más PRs en paralelo).
- [ ] C7 Gasto: bucket R2 (punto 4) · tarjeta en ONIA Ads + US$56 · el SIAT (CAFC, reloj 4-nov) · OK al REVOKE del B22.
- [ ] C8 Punto 1: aprobar en `/admin/payments` el pago de prueba de «ZZ QA Pago» (la madre lo prepara con Chrome).

## D. Sesiones de la nube (la madre les manda su siguiente tarea; la ronda verifica que la tomen)
- [ ] D1 Ventas: go/no-go del 13-oct + campaña lista para crear en pausa (mensaje 10-oct ~15 UTC; no lo tomó todavía).
- [ ] D2 Plataforma: demo refrescada (primera ventana: lunes 12-oct 07-11 UTC) + capturas C1-C7 → destraba Ventas y Lucía.
- [ ] D3 Marca: recibe GRABAR-17-23-OCT.md (A1) y su equipo.

## E. Gestión (la madre)
- [ ] E1 Billetera en cada ronda: % Codex (freno 80 %, refills solo al tope; reinicio 13-oct 23:57 La Paz), tokens 48 h por
  modelo, sesiones paradas. Base 10-oct: 1.503 M tokens/48 h, Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %.
- [ ] E2 Handoff al día en `handoff/madre-local.md` antes de que la conversación se haga larga.

## Cerrado hoy (con prueba)
- [x] Codex cloud `/book` de usted — task_e_6aca4e5cf680832784ec553ba5c3d5ef → PR #144.
- [x] Análisis 15 puntos de la 1.0, verificado por O — `e4243d84` (`research/2026-10-10-analisis-plataforma-1.0.md`).
- [x] #139 seguro de publicar (migración idempotente; el deploy no corre `prisma migrate`) — `2d567ac2`.
