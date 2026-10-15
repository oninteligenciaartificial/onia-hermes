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

## SUBIDA (11-oct, 10:19 UTC) — `plataforma-152-restos-20261011.bundle`

Rama `usted-todo` (`80f6fef1`, ya empujada a `claude/optimistic-ride-1sp5fe` el 11-oct a las 10:19 UTC): es #152 con U3 (#153), U4 (#148) y U5 (#149) adentro, sobre `master` `fd72cd55` (con #147).
Suma los restos de usted que encontró Hermes (E16 y E10): la agenda, Pendientes, el Inicio, `/agents` y el registro. La línea
base del trinquete está resuelta como base más deltas (total 399). `tsc` 0 y suite completa 10.655 en verde, 0 rojos.
Es **fast-forward** sobre `claude/optimistic-ride-1sp5fe` (`d8c486f5`): se sube sin force. Plataforma la empuja a las
10:10 UTC; si esta sesión murió antes, la sube quien la retome:

```bash
git fetch <ruta>/plataforma-152-restos-20261011.bundle usted-todo:usted-todo
git push origin usted-todo:claude/optimistic-ride-1sp5fe     # actualiza #152; con CI verde y la pasada de Hermes, se mergea
```

## Lista para subir (11-oct, 01:30 UTC) — `plataforma-titulos-usted-20261011.bundle`

Pedido de la madre v4: la pestaña de `/login` decía «…que maneja tu negocio…». Rama `titulos-usted` (`b0e021f2`),
**un commit sobre `master` `d8ca5a32`**: título por defecto, descripciones para buscadores y para compartir, y el portal
de requerimientos pasan a usted; un gate nuevo (`__tests__/titulos-publicos-de-usted.test.ts`, falla con el texto viejo)
caza también el tuteo, que el trinquete de voseo no veía. tsc 0 y suite completa 10.060 en verde. Son textos: no espera
a nadie.

```bash
git fetch <ruta>/plataforma-titulos-usted-20261011.bundle titulos-usted:titulos-usted
git push origin titulos-usted:fix/titulos-de-usted     # y PR contra master; con CI verde se mergea
```

## Listas para subir (10-oct, ~20:30 UTC) — `plataforma-listas-20261010.bundle`

Armadas y probadas en la nube sobre `master` `922a0da9`: tsc 0 y suite completa en verde, 0 rojos, en las cinco. Cada una es
**fast-forward** sobre la cabeza actual de su PR: se suben sin force. Solo chocaba `docs/CHANGELOG.md` (#110 y #119): quedaron
las dos entradas.

```bash
git fetch origin
git fetch <ruta>/plataforma-listas-20261010.bundle 'refs/heads/*:refs/remotes/listas/*'
git push origin listas/t124-version:codex/punto-14-aceptacion-terminos   # #124: ya, no espera a nadie
git push origin listas/i110-v3:codex/punto-8-caja-diaria                  # #110: con el OK de diseño
git push origin listas/i119-v3:codex/c6b1-caras-api                       # #119: con el OK de diseño
git push origin listas/i118-v3:codex/c5-agenda-dia-20261006               # #118: con el OK de diseño
git push origin listas/i140-w1f:integ/w1-w1b                              # #140: con el OK de diseño
```

| Rama | Punta | Sobre (cabeza del PR) | Qué suma | Suite |
|---|---|---|---|---|
| `t124-version` | `23a3abb3` | `2ee1dcfe` (#124) | La versión 1.3 de los términos (`2191bf56`, cherry-pick). Sin ella, cada alta guarda «1.2», que el cliente nunca vio | 10.063 |
| `i110-v3` | `65c5f2f3` | `1c5112a9` (#110) | Caja v3 (`wip/c110`) + `master` | 10.106 |
| `i119-v3` | `a6484bca` | `3e0575ef` (#119) | Odontograma v3 (`wip/c119`) + `master` | 10.157 |
| `i118-v3` | `a8b31bfd` | `510b3bcd` (#118) | Agenda del día v3 (`wip/c118`) + `master` | 10.096 |
| `i140-w1f` | `34f86438` | `f981cd4a` (#140) | W1f (el chat se presenta con el nombre de la clínica) + `master` | 10.174 |

Sus migraciones ya están aplicadas en producción (10-oct). Push fuera de los minutos :20-:55 de las horas del cron y,
si la cola del CI no está vacía, no en la hora antes del cron (skill `onia-infra` §4).

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

## 15-oct · `plataforma-seguimiento-171-20261015.bundle` — LISTA PARA SUBIR

Los arreglos de las revisiones de onia-platform #171 (checkout de usted, motivo del QR rechazado a la vista, `/inbox` que no
se cae, roles y clientes de usted, `fiados.ts` con teléfono numérico), los de M1c (cantidades, cotización, traspaso y
venta) y las lecciones en las skills: 16 commits sobre `b9acfa13` (la cabeza de #171), hasta `37560f53`. `tsc` 0, eslint 0
y suite completa 11.625/0 (09:28 UTC). Plataforma los sube a `claude/optimistic-ride-1sp5fe` a las 10:11, fuera de la
ventana de publicación.

```bash
git fetch origin claude/optimistic-ride-1sp5fe   # trae b9acfa13
git bundle verify plataforma-seguimiento-171-20261015.bundle
git fetch plataforma-seguimiento-171-20261015.bundle claude/optimistic-ride-1sp5fe:seguimiento-171
```

## 15-oct · `plataforma-barrido-usted-2-20261015.bundle` — LISTA PARA SUBIR

El barrido de usted del aviso de solo lectura: la constante `MENSAJE_SUSCRIPCION_VENCIDA` (la manda `proxy.ts` a toda escritura de una
cuenta en solo lectura) de usted y conservando dónde renovar, sus ~27 copias a mano en `app/api` reemplazadas por ella, el banner fijo de
solo lectura, el modal de prueba vencida, el error de red, la venta de mostrador y el add-on del chatbot. 8 commits sobre `37560f53` (la
cabeza de #171), hasta `c18d58c0`. `tsc` 0, eslint 0 y suite completa 11.659/0. Sale en el PR siguiente a #171 (la rama
`claude/optimistic-ride-1sp5fe` se reinicia desde `master` cuando entre #171).

```bash
git fetch origin claude/optimistic-ride-1sp5fe   # trae 37560f53
git bundle verify plataforma-barrido-usted-2-20261015.bundle
git fetch plataforma-barrido-usted-2-20261015.bundle barrido-usted-2:barrido-usted-2
```
