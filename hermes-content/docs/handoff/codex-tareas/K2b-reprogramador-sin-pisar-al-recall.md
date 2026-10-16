# K2b · Reprogramador a 30 días sin pisar al detector de tratamiento a medias (arreglo de #133)

> **HECHO el 9-oct** (`9f6b737f`). Revisado por Plataforma: reparte a cada persona antes de las dos pasadas, con los
> seis casos pedidos (borde 30/31 incluido). Suite completa 9.821 en verde, tsc 0, eslint 0.

Sos Codex. Rama `codex/recuperar-canceladas` del PR #133 (la misma). `git branch --show-current` primero y `git merge origin/master`.

> **Sigue abierto al 9-oct 06:20 UTC** (medido sobre `6506d072`, con K23b ya hecho): `REPROGRAMAR_VENTANA_DIAS = 30`
> (`agents-reprogramador.ts:23`) contra `TRATAMIENTO_A_MEDIAS_DIAS = 21`, y nada separa a las personas entre los dos.
> La ventana del agente (`metadata.ventanaDias`, de K23b) ya llega a `getAgentFeed`: el arreglo tiene que respetarla.
> ⚠️ La tarea K23b decía que con ella #133 quedaba para mergear: era falso.

## Lo que encontró la revisión de Plataforma (8-oct)
#133 sube `REPROGRAMAR_VENTANA_DIAS` de 14 a 30. El detector de tratamiento a medias
(`lib/onia-core/modules/agents-tratamiento-a-medias.ts`, `TRATAMIENTO_A_MEDIAS_DIAS = 21`) está diseñado para arrancar
DESPUÉS del Reprogramador: «una falta reciente la trabaja él, no los dos a la vez» (comentarios del módulo y de
`agents-tratamiento-a-medias-filas.ts`, que cuenta la última visita desde una cita en cualquier estado). Con 30 días,
entre el día 21 y el 30 la misma persona sale en DOS propuestas en Pendientes (reprogramar y tratamiento a medias).

## Lo que se hace
- El traspaso vuelve a ser limpio: en la misma corrida, una persona con una cita perdida dentro de la ventana del
  Reprogramador NO entra al tratamiento a medias (la toma el Reprogramador, cuyo mensaje ya ofrece volver a agendar).
  Hacelo en el lugar que decide la corrida (`buildDraftsForKind` / el feed), no duplicando reglas en dos módulos.
- Mantené la ventana configurable (`metadata.ventanaDias`) pero documentá en el comentario de
  `TRATAMIENTO_A_MEDIAS_DIAS` y en `REPROGRAMAR_VENTANA_DIAS` cómo se reparten las personas.
- «no puedo otro dia» no es «reprogramar» (está en K1, #132): si lo tocás, sacalo; si no, dejalo.

## PRUEBA DE HECHO
- Test: persona con falta hace 25 días y un tratamiento a medias → una sola propuesta (Reprogramador).
- Test: persona con falta hace 40 días (fuera de los 30) y tratamiento a medias → la propone el detector.
- Los tests existentes del Reprogramador y del detector siguen verdes sin aflojarlos.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo (números reales).
