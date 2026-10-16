# Reservo: ficha de la Biblioteca (corte 2026-10-10)

> Datos del conector `Meta_ads` (solo anuncios activos); lecturas a mano de `LECTURAS.json`. **La edad de un anuncio no es rendimiento.** Estudio completo y límites: `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`.

| | |
|---|---|
| Páginas | Reservo Software (`1006037402599174`) · Reservo (`1397618817156161`) |
| Anuncios vistos | 5 (la Biblioteca no dio el total de activos) · lista **completa** · **el 11-oct la Biblioteca devolvió más (ver `../TANDA-11OCT.md` §2): esta lista NO es completa** |
| Más viejo | 53 d |
| Con más de 30 d | 5 |
| Titulares distintos | 4 |
| Moneda del anuncio | CLP |

## Qué vende y cómo lo muestra

- **Qué vende:** Software médico de México (dos páginas: Reservo Software y Reservo) con el ángulo de estar en regla: «Cumple con las normativas legales», «ECE en regla con COFEPRIS», «Software médico certificado en México», «Tu consulta médica respaldada». Cobra el anuncio en CLP (inferencia: agencia o filial chilena). (observado)
- **Formato:** No observable en esta tanda.
- **Oferta y botón:** No observable (solo titulares).
- **Patrón:** Los 5 anuncios activos pasan de 30 d (47-53 d). El 3-oct eran 31 con el más viejo en 199 d (puede ser otra página). Es el mismo patrón de norma que Dt.Dental. (observado)

## Qué copiar y qué no (catálogo §7 y §8)

- **Copiar:** —
- **No copiar:** Norma y certificación: Onia no las tiene.

## Anuncios que pasan de 30 días

| Titular | Copias | Días | Ids |
|---|---|---|---|
| Cumple con las normativas legales | 2 | 53 d | `2306098163539011` `1056628280307783` |
| Software médico certificado en México | 1 | 53 d | `2131200374413642` |
| ECE en regla con COFEPRIS | 1 | 50 d | `1015323991509208` |
| Reservo Software | 1 | 47 d | `27227967266876051` |

## Capturas del 11-oct

Fuente: `../CAPTURAS-50D-11OCT.md`; días del corte 10-oct. La antigüedad no es rendimiento; las afirmaciones del anuncio no están verificadas.

| Id | Días al aire (fuente) | Formato que se ve | Texto principal | Llamado (titular · botón) | Ruta |
|---|---|---|---|---|---|
| `1056628280307783` | 53 (desde 18-ago) | **Imagen**: afiche con una frase sobre la COFEPRIS y la NOM-024 («¡Estamos certificados!») y una captura de pantalla pequeña del sistema (texto de la imagen leído a baja resolución). La tarjeta dice «varias versiones» | «¿Estás seguro de que tu clínica cumple con los estándares de COFEPRIS? • Expediente electrónico bajo la NOM-024 • Agenda y control financiero en un solo lugar. Descubre cómo Reservo te ayuda a mejorar tus procesos. Déjanos tus datos para obtener información personalizada sobre cómo podemos ayudarte.» | «Cumple con las normativas legales» + «Reservo software médico para profesionales de salud. Expediente clínico certificado NOM-024, agenda, finanzas, fidelización de pacientes y más.» · botón «Learn More» (formulario de datos) | `reservo/1056628280307783-11oct.png` |

## Límites

- Lista completa.
- El conector no trae formato, texto principal, botón, público ni gasto; lo marcado «(observado)» sale de los titulares o de las capturas del 1-3 oct.
- Se regenera con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sobre un JSON nuevo (re-medición del 24-oct).
