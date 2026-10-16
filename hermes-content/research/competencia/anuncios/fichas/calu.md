# Calu: ficha de la Biblioteca (corte 2026-10-10)

> Datos del conector `Meta_ads` (solo anuncios activos); lecturas a mano de `LECTURAS.json`. **La edad de un anuncio no es rendimiento.** Estudio completo y límites: `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`.

| | |
|---|---|
| Páginas | Calu (`292222707822649`) |
| Anuncios vistos | 5 de 5 activos estimados · lista **completa** · **el 11-oct la Biblioteca devolvió más (ver `../TANDA-11OCT.md` §2): esta lista NO es completa** |
| Más viejo | 43 d |
| Con más de 30 d | 1 |
| Titulares distintos | 4 |
| Moneda del anuncio | ARS |

## Qué vende y cómo lo muestra

- **Qué vende:** Agenda de turnos, ficha del paciente y recordatorios por WhatsApp para consultorios de Argentina (empresa Chedoc SRL, `CALU_FICHA.md`). Cobra el anuncio en ARS. (observado)
- **Formato:** No observable en esta tanda.
- **Oferta y botón:** «Probá Calu gratis · Chatea con nosotros» (8-oct). El botón «Chatea con nosotros» lleva a un chat (inferencia: no se sabe a cuál). (titulares: observado)
- **Patrón:** La pregunta del papel «¿Seguís acumulando fichas y papeles…?» (43 d). El 3-oct tenía 15 anuncios y el más viejo de 94 d («Conocé Calu en 2 minutos», «Probá Calu Gratis» de 53 d); el corte del 10-oct trajo 5 y el más viejo de 43 d, pero **el 11-oct Calu devolvió 13 anuncios** y esos mismos de prueba siguen («Probá Calu Gratis» `1020546507258888`, 61 d; `4123186177973035`, 37 d; «Conocé Calu en 2 minutos» `2054036308538572`): **la inferencia «dejaron de aparecer» era un artefacto del corte y se retira** (`TANDA-11OCT.md` §2). (observado el 11-oct)

## Qué copiar y qué no (catálogo §7 y §8)

- **Copiar:** La pregunta del dolor concreto del papel (N2).
- **No copiar:** —

## Anuncios que pasan de 30 días

| Titular | Copias | Días | Ids |
|---|---|---|---|
| ¿Seguís acumulando fichas y papeles para las historias clínicas de tus pacientes? | 1 | 43 d | `1408444331257598` |

## Titulares de los de 30 días o menos (los 8 más repetidos)

| Titular | Copias | Días |
|---|---|---|
| Calu | 2 | 2-22 d |
| Chatea con nosotros | 1 | 2 d |
| Empezá el 2027 con Calu. | 1 | 15 d |

## Límites

- Lista completa de la página. **Contraejemplo** posible a «prueba gratis = dura» (regla R3 de la skill §8.3), con esa salvedad.
- El conector no trae formato, texto principal, botón, público ni gasto; lo marcado «(observado)» sale de los titulares o de las capturas del 1-3 oct.
- Se regenera con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sobre un JSON nuevo (re-medición del 24-oct).
