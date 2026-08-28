# 🔴 Archivo — nada de acá entra en una pieza

Todo lo que está en esta carpeta muestra una cara de Lucía que **Sergio descartó el
2026-08-15**: *"esas no se usan, no son consistentes."*

Son salidas del Soul `36305a9b`, que se entrenó con frames de un video de una persona real.
De ahí sale el defecto que las delata: **mejillas y nariz enrojecidas**, con las pecas tapadas
por la rojez, y sin las argollas doradas. Al lado de una foto del banco vigente se ve que son
dos acabados distintos.

Se archiva en vez de borrar porque documenta cómo NO tiene que verse, y porque el histórico
del carril las cita.

| Carpeta | Qué era |
|---|---|
| `pecas-clean-v2/` | 18 frames de video de una persona real. Fue la vara de QA hasta el 15-ago |
| `pecas-source-frames/` | Frames crudos del video, incluida la cuarentena `OTRA-PERSONA-video-B-NO-USAR/` |
| `lucia-content-bank-20260709/` | Banco viejo generado con Soul. Rechazado por look de IA |
| `lucia-demos-20260709/` | Demos del mismo banco |

⚠️ Las dos primeras son material de una persona real sin permiso documentado. No se publican
ni se usan para entrenar nada.

**Lo que sí se usa está en [`../../modelos/lucia/BANCO-OFICIAL.md`](../../modelos/lucia/BANCO-OFICIAL.md).** El gate
(`scripts/carousel_gate.js`) valida contra esa lista y falla antes de renderizar si alguien
vuelve a agarrar algo de acá.
