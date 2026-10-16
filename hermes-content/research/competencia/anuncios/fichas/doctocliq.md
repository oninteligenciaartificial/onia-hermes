# Doctocliq: ficha de la Biblioteca (corte 2026-10-10)

> Datos del conector `Meta_ads` (solo anuncios activos); lecturas a mano de `LECTURAS.json`. **La edad de un anuncio no es rendimiento.** Estudio completo y límites: `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`.

| | |
|---|---|
| Páginas | Doctocliq (`122294408384514`) |
| Anuncios vistos | 30 de 30 activos estimados · lista **completa** |
| Más viejo | 85 d |
| Con más de 30 d | 15 |
| Titulares distintos | 14 |
| Moneda del anuncio | MXN |

## Qué vende y cómo lo muestra

- **Qué vende:** Software de gestión para consultorios de doctores y doctoras en general (dental y estética entre ellos): agenda, ficha, recordatorios por WhatsApp y campañas. Cobra el anuncio en MXN; la landing de las capturas es doctocliq.com/ecuador. (observado)
- **Formato:** Videos de 10 a 66 s (capturas del 1-2 oct): 10 s con una frase y hechos con IA; 26-30 s con una historia generada con IA y pantallas reales; 31-66 s con un testimonio de un doctor real. **El mismo video de 10 s corre bajo dos titulares** («Evita cancelaciones de última hora» y «Prueba Doctocliq ahora»): prueban titulares sobre un creativo. (observado)
- **Oferta y botón:** «Prueba Doctocliq ahora/hoy», «Pruébalo gratis», «Crea tu cuenta GRATIS»: cuenta gratis, no demo. Botón «Ver detalles». (observado)
- **Patrón:** Un guion de dolor (la cita cancelada, la asistente que falta, «un paciente más») y un remate de control. 30 anuncios con 14 titulares; 15 pasan de 30 d. Concentra el patrón «control» del estudio (9 de 12 anuncios). (observado)

## Qué copiar y qué no (catálogo §7 y §8)

- **Copiar:** Un concepto en copias; el dolor del sillón vacío dicho llano (precedente de A1); el titular como oferta.
- **No copiar:** «+4000 doctores» y los testimonios (Onia tiene 0 clientes); «confirmaciones automáticas por WhatsApp» (no está vivo, catálogo §7); un presentador de IA hecho pasar por doctor (CLAUDE.md: el UGC de IA es un presentador original, nunca un testimonio).

## Anuncios que pasan de 30 días

| Titular | Copias | Días | Ids |
|---|---|---|---|
| La agenda que trabaja contigo | 2 | 85 d | `1014591764512827` `1738720983808867` |
| Prueba Doctocliq ahora | 3 | 53-85 d | `1748838402916201` `1952892278698712` `1048863268115509` |
| Dejá de perder citas. Mira cómo lograrlo. | 1 | 57 d | `895549733230235` |
| ¿Y por qué tú aún no digitalizas tu gestión? | 1 | 56 d | `1913624476275238` |
| El éxito no es casualidad | 2 | 45-54 d | `1089330193788206` `1456602893194865` |
| ¿Tu consultorio crece o solo sobrevive? | 1 | 54 d | `1684698082830679` |
| Todos ven lo mismo. Tú tienes el control. | 4 | 37-47 d | `1068421025910916` `2933585537003558` `1361355256175770` … |
| Prueba Doctocliq hoy | 1 | 45 d | `1065646535832597` |

## Titulares de los de 30 días o menos (los 8 más repetidos)

| Titular | Copias | Días |
|---|---|---|
| Esa paz mental es posible con Doctocliq | 4 | 12-27 d |
| ¿Tu consultorio funciona sin tu asistente? | 3 | 12-27 d |
| Toda tu clínica en un solo lugar | 2 | 12-27 d |
| ¿Y por qué tú aún no digitalizas tu gestión? | 1 | 12 d |
| Controla tu consultorio con Doctocliq | 1 | 19 d |
| Evita cancelaciones de última hora | 1 | 27 d |
| Menos administración. Más odontología. | 1 | 19 d |
| Prueba Doctocliq ahora | 1 | 16 d |

## Capturas del 11-oct

Fuente: `../CAPTURAS-50D-11OCT.md`; días del corte 10-oct. La antigüedad no es rendimiento; las afirmaciones del anuncio no están verificadas.

| Id | Días al aire (fuente) | Formato que se ve | Texto principal | Llamado (titular · botón) | Ruta |
|---|---|---|---|---|---|
| `1748838402916201` | 85 (desde 17-jul) | **Video 0:10, persona a cámara**: una doctora sentada en un consultorio (aspecto sintético, no verificado). Mismo texto y duración que `1952892278698712` de la ronda 1 | «Doctora, tu tiempo (y tu almuerzo) valen demasiado para que te cancelen a última hora. Prueba Doctocliq hoy.» | «Prueba Doctocliq ahora» (WWW.DOCTOCLIQ.COM) · botón «Ver detalles» | `doctocliq/1748838402916201-11oct.png` |
| `1738720983808867` | 85 (desde 17-jul) | **Video 0:30, mini-historia**: un niño sentado a la mesa esperando, con un reloj de pared (escena de aspecto sintético). Mismo titular y duración que `1014591764512827` de la ronda 1 | «Tu día ya es suficientemente ocupado como para estar resolviendo todo a última hora. Con Doctocliq, tus pacientes agendan sus citas en línea y reciben recordatorios automáticos, para que puedas trabajar con más tranquilidad. Miles de doctores en Latinoamérica ya lo hacen. Ahora te toca a ti.» | «La agenda que trabaja contigo» (DOCTOCLIQ.COM/CREA-TU-CUENTA) · botón «Ver detalles» | `doctocliq/1738720983808867-11oct.png` |

## Límites

- Lista completa (se vio todo lo activo).
- El conector no trae formato, texto principal, botón, público ni gasto; lo marcado «(observado)» sale de los titulares o de las capturas del 1-3 oct.
- Se regenera con `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sobre un JSON nuevo (re-medición del 24-oct).
