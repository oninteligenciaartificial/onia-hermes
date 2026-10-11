# AgendaPro: ficha de la Biblioteca (corte 2026-10-10)

> Datos del conector `Meta_ads` (solo anuncios activos); lecturas a mano de `LECTURAS.json`. **La edad de un anuncio no es rendimiento.** Estudio completo y límites: `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`.

| | |
|---|---|
| Páginas | AgendaPro (`1429581593936821`) |
| Anuncios vistos | 81 de 313 activos estimados · lista **PARCIAL** (tope de 50, más nuevos primero) |
| Más viejo | 247 d |
| Con más de 30 d | 25 |
| Titulares distintos | 68 |
| Moneda del anuncio | USD |

## Qué vende y cómo lo muestra

- **Qué vende:** Agenda y gestión para negocios de servicios de varios rubros (clínicas, estética, kine, capilar, barbería, spa, gimnasio); escribe un titular por rubro. Mezcla voseo, tuteo y usted. Cobra el anuncio en USD. (observado)
- **Formato:** No observable: el conector no trae el formato y las capturas del 1-3 oct no incluyen AgendaPro. Titulares unidos con « | » (hasta 6 en el de 247 d) en las piezas de 143 y 247 d: varias tarjetas o textos (inferencia). Dos anuncios de catálogo dinámico ({{product.name}}) de 247 y 134 d.
- **Oferta y botón:** «Agenda tu demostración gratis» ×5 (33-64 d) y «Prueba AgendaPro gratis» (19 d); en octubre pasa a la IA («La IA atiende tu WhatsApp», «Sofía trabaja por ti», «Reservas 24/7 sin contestar mensajes»). Los titulares son observados; el botón no es observable con el conector.
- **Patrón:** Un titular por rubro y por dolor: inasistencias («Menos inasistencias en tu clínica» 65 d, «90% menos inasistencias» 65 d), papel («Ficha clínica digital» 65 d, «Chau carpetas»), control («Toda su clínica en un lugar»). (observado)

## Qué copiar y qué no (catálogo §7 y §8)

- **Copiar:** **Un pack por rubro = un copy por rubro** (Onia se vende por rubro); la demostración como oferta.
- **No copiar:** Las cifras («90% menos inasistencias», «hasta 82% más»); «Sofía» y la IA que atiende o ordena (catálogo §8).

## Anuncios que pasan de 30 días

| Titular | Copias | Días | Ids |
|---|---|---|---|
| {{product.name}} | 2 | 134-247 d | `906748815086043` `3466067470216609` |
| AgendaPro | 1 | 247 d | `1967791207137782` |
| Sofia Llegó | 1 | 143 d | `1535822604884838` |
| La IA que organiza tu clínica | 1 | 111 d | `1201810243016378` |
| 90% menos inasistencias | 1 | 65 d | `1049927527448830` |
| La IA que llena tu barbería | 1 | 65 d | `1621260466240315` |
| Menos inasistencias en tu clínica | 1 | 65 d | `4317442781852742` |
| Transforma tu agenda hoy | 1 | 65 d | `2057587224878072` |
| Ficha clínica digital | 1 | 65 d | `1732613191123893` |
| La IA que tu clínica necesita | 1 | 65 d | `1354608690117964` |
| La IA atiende tu WhatsApp | 1 | 64 d | `1601426334721119` |
| La IA responde por tu clínica | 1 | 64 d | `2909862622680070` |
| Agenda tu demostración gratis | 3 | 33-64 d | `3652876658196882` `1729093184800543` `2139127186642600` |
| Agendá tu demostración gratis | 2 | 59-61 d | `933057809095580` `1365168568479805` |
| Tu clínica capilar merece una agenda ordenada | 1 | 40 d | `1050760674605424` |
| Que la IA ordene tu clínica | 1 | 38 d | `1757005002301371` |
| Tu clínica de kine, hasta 82% más | 1 | 36 d | `2956097904725102` |
| La ficha de cada paciente, lista | 1 | 36 d | `1050972634353495` |
| Seguí cada tratamiento | 1 | 32 d | `1060235429713193` |
| ¿Todo profesional? Menos tu agenda. Reservas online 24/7. Pruébalo gratis | 1 | 32 d | `823870454050334` |
| Todo tu centro médico en un lugar | 1 | 31 d | `1813199176516239` |

## Titulares de los de 30 días o menos (los 8 más repetidos)

| Titular | Copias | Días |
|---|---|---|
| 7 días gratis para tu spa | 3 | 2-8 d |
| Reservas 24/7 sin contestar mensajes | 3 | 8-11 d |
| Ahorra IVA con el POS de AgendaPro | 2 | 1-11 d |
| Reservas y pagos en automático | 2 | 2-6 d |
| ¿Cómo va el tratamiento? | 1 | 2 d |
| (sin titular) | 1 | 3 d |
| 90% menos inasistencias | 1 | 4 d |
| AgendaPro | 1 | 3 d |

## Límites

- Lista **parcial**: 313 activos, 81 vistos (tope de 50 por consulta, más nuevos primero). Es el de mayor antigüedad visible (247 d) pero esos son catálogo dinámico: no compararlo con los demás por antigüedad.
- El conector no trae formato, texto principal, botón, público ni gasto; lo marcado «(observado)» sale de los titulares o de las capturas del 1-3 oct.
- Se regenera con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sobre un JSON nuevo (re-medición del 24-oct).
