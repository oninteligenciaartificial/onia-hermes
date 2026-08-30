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
| `calibracion-20260806/` | Las 15 de calibración (L1..L15). **Es la que rompió L08 y L09 el 28-ago** |
| `perfil-20260806/` | Set de perfil con la misma rojez |
| `avatar-20260806-descartes/` | Descartes de avatar. Dos de ellos son directamente otra cara |
| `prueba-soul-v3/` | Soul v3: ojos gris azulados y pecas borradas. Perdió el A/B del 22-ago |
| `prueba-motor-20260813-soul/` | Las dos tomas del Soul perdedor de esa prueba |
| `L09-assets/` | Recorte de una foto de calibración, usado un día en L09 |

**Lo que sí se usa está en [`../BANCO-OFICIAL.md`](../BANCO-OFICIAL.md).** El gate
(`scripts/carousel_gate.js`) valida contra esa lista y falla antes de renderizar si alguien
vuelve a agarrar algo de acá.

## `L07-tres-gratis.json` — retirada 2026-08-30

**Es la misma pieza que `L08-tres-de-cinco-gratis.json`**, que la reescribio y quedo publicable.
Misma palabra HUMO, misma promesa, y el titular identico salvo que una escribe "3 de 5" y la otra
"tres de las cinco". Publicar las dos era publicar el mismo post dos veces.

Convivieron en el repo porque el gate revisaba **cada brief contra el registro**, nunca **una pieza
contra otra**: las dos pasaban perfectas por separado. Se arreglo agregando `revisarLote()` a
`scripts/carousel_gate.js` (`node scripts/carousel_gate.js --lote <dir>`), que normaliza cifra y
palabra ("tres" = "3") antes de comparar — sin eso la pareja daba 0,55 de parecido y se colaba.
Con la normalizacion da 1,00.

Se conserva por si el texto de alguna lamina intermedia sirve. **No se publica.**
