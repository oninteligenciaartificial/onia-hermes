# Ramas que solo existían en el contenedor de Plataforma (resguardo del 9-oct)

La sesión de Plataforma solo puede pushear a `claude/optimistic-ride-1sp5fe`. El 9-oct, a las 04:18 UTC, estas ramas
tenían commits que no estaban en ningún remoto. Si el contenedor moría, se perdían. Quedan guardadas acá como paquetes
de git (`git bundle`), con los SHAs exactos.

## Cómo se restaura

```bash
# onia-platform (las bases tienen que estar en origin: codex/punto-8-caja-diaria, codex/c5-agenda-dia-20261006,
# codex/c6b1-caras-api y la historia de claude/optimistic-ride-1sp5fe)
git fetch origin
git fetch <ruta>/plataforma-ramas-locales-20261009.bundle 'refs/heads/*:refs/heads/*'
# onia-hermes
git fetch <ruta>/hermes-ramas-locales-20261009.bundle 'refs/heads/*:refs/heads/*'
```

`git bundle verify <archivo>` dice si falta alguna base.

## Qué hay en cada rama (onia-platform)

| Rama | Punta | Qué es | Estado |
|---|---|---|---|
| `wip/c118` | `9bcccc54` | Agenda del día v3: un profesional por columna, riel de horas, línea de ahora y burbujas. Va sobre `codex/c5-agenda-dia-20261006` | Espera el OK de diseño de Sergio Urcullo (capturas en `docs/cola/capturas-agenda-dia/v3`). Antes de integrarla, mergear `master` para que tome la barra de usted (U1) |
| `wip/c119` | `3c05cde0` | Odontograma v3: burbujas, leyenda con conteo, caries distinta de fractura. Va sobre `codex/c6b1-caras-api` | Espera el OK de diseño. Necesita la migración `20261006220000_add_tooth_surfaces` |
| `wip/c110` | `187a9eae` | Caja diaria v3: hoja principal, medios de pago en barra, cierre destacado, descuadre con signo. Va sobre `codex/punto-8-caja-diaria` | Espera el OK de diseño. Necesita la migración `20261004190000_add_daily_cash` ANTES del swap |
| `wip/cap110`, `wip/cap118`, `wip/cap119` | `51763ef3`, `8ca49017`, `a968db91` | Bancos `/dev/*` con los que se sacaron las capturas para el OK | Sirven para volver a capturar; no se publican solos |
| `wip/canal` | `92bdfb3b` | **Punto 3:** el canal de la agenda pasa a privado y la campana deja de abrir uno mudo (`7d6b02cb`), más una nota en las skills sobre mirar desde la nube. Los respaldos de esta rama ya están en `master` | Trae la migración `20261005140000_realtime_citas_privado` (infra de Realtime): se aplica con el OK de Sergio Urcullo. No está en ningún PR |
| `wip/terms` | `2191bf56` | **Punto 14:** el alta registra la versión 1.3 de los términos, la que publica el sitio. Va sobre la integración de #124 | #124 espera su migración `20261008000000_add_terms_acceptances`; este arreglo va con él |

Ya están en `master` (por contenido) y no se guardaron: `wip/p2` (presupuesto por fases) y `wip/respaldos`.

## Qué hay en la rama de onia-hermes

| Rama | Punta | Qué es | Estado |
|---|---|---|---|
| `wip/c16c-guarda` | `f154f1e09` | C16c del bot: el número de Onia siempre vende, un WhatsApp huérfano no contesta y la bandeja propia de Onia nunca queda huérfana ni ajena | El parche para aplicar sobre hermes#162 está también en `docs/handoff/codex-tareas/C16c-guarda-bandeja-de-onia.patch`. Publicar el bot es tarea del carril del chatbot |

## 10-oct (onia-platform)

| Rama | Punta | Qué es | Estado |
|---|---|---|---|
| `w1f` | `2c3423ae`, sobre `aae460c4` (la punta de #140) | **W1f:** el chat de la web se presenta con el nombre del negocio (`data-nombre`) y sin la marca Onia; contesta el asistente y, si hace falta, una persona del equipo. Pedido de Sergio Urcullo del 10-oct | Paquete `plataforma-w1f-20261010.bundle`. Se sube a la rama de #140 con `git fetch <ruta>/plataforma-w1f-20261010.bundle w1f` y `git push origin FETCH_HEAD:integ/w1-w1b` (avanza sin merge). Se publica con el OK de diseño de Sergio Urcullo sobre las capturas (enviadas el 10-oct) y la infra de #140 |
