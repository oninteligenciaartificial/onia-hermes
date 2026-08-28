# Banco oficial de Lucía — qué se puede usar HOY

> **Este archivo manda sobre qué imagen de Lucía entra en una pieza.** Se lee ANTES de
> escribir un brief. Si una foto no está en la lista blanca de abajo, no se usa: no importa
> que se vea linda, que esté en el repo, ni que otra pieza vieja la haya usado.
>
> Nace del error del 2026-08-28: se produjeron L08 y L09 con el banco `calibracion-20260806`,
> que Sergio había descartado el 15-ago. `LUCIA.md` lo decía, pero tiene 50 KB y el dato
> estaba en la línea 90. Un archivo largo no es una fuente de verdad consultable.
>
> El detalle de personaje, voz, prompts y motores sigue en [`LUCIA.md`](LUCIA.md). Acá van
> **solo los archivos** y **solo el veredicto**.

---

## La cara

**No se genera con Soul. Se genera con el Element-ancla.**

| Rol | Qué | ID |
|---|---|---|
| **ANCLA** — con esto se genera | `lucia-ancla-2026-08` · va como `<<<452d8375-…>>>` en el prompt, motor `nano_banana_2` @ 2k | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` |
| **RESPALDO** — si el ancla falla en un encuadre | `lucia-surgical-anchor` | `902eeebb-89e9-4477-8426-c555b20f7ecc` |
| **VARA de QA** — se compara, NO se genera | `STACK-rasgos-10-angulos.jpg` | — |

⛔ **Soul `36305a9b` (LUCIA-REAL-v2-clean): PROHIBIDO.** Sale con la piel roja, ignora el
atuendo pedido, y se entrenó con frames de una persona real sin permiso documentado.
⛔ **Soul v3 `e6d8703c`:** perdió el A/B del 22-ago y le cambia el color de ojos a gris azulado.

### Cómo se reconoce la cara correcta

Piel oliva de **tono parejo** con textura · **pecas contables** en nariz y pómulos ·
**argollas doradas chicas** + cadenita fina · ojos marrones almendrados · cejas gruesas
oscuras · pelo castaño ondulado a los hombros.

### Cómo se reconoce la MUERTA (la que hay que rechazar)

**Mejillas y nariz rojas o inflamadas**, tipo rosácea, con las pecas tapadas por la rojez ·
cara más redonda · pelo más lacio y parejo. Es la piel de la persona real del video fuente.
**Si la cara está roja, la foto está mal. Es la señal más rápida que hay.**

### Rasgos sagrados (nunca se limpian)

`pecas` > `argollas de oro + cadenita` > `algo terracota #E4714E en cuadro`.
⛔ El verde de ONIA `#00D26A` **no entra** en sus piezas: es de la marca, no de ella.

---

## ✅ Lista blanca — lo único que se puede usar en una pieza

| Carpeta / archivo | Qué hay | Formato |
|---|---|---|
| `tanda-20260821/` | **El banco principal.** 10 PNG: `L1`, `L1b`, `L2`, `L2b`, `L3`, `L4`, `L4b`, `L5`, `L5b`, `L6` | 896×1200 (3:4) |
| `tanda-20260821/BROLL-TEST/` | `IMG-01`…`IMG-05` + `frame-ugc-0s`, `frame-ugc-6s` | varía |
| `prueba-realismo-20260815/` | `r1-cafe`, `r2-calle`, `r3-escritorio` | 1792×2400 (3:4) |
| `biblioteca-20260808/` | **Solo** `13-cafe-celular.jpg` y `14-cafe-tecleando.jpg` (las otras 10 nunca bajaron) | 1856×2304 (4:5) |
| `avatar-20260806/FOTO-PERFIL-LUCIA.jpg` | **Solo ese archivo** de esa carpeta. Es la foto de perfil | 1:1 |
| `historias-20260823/` | Lo más reciente. 8 historias | 9:16 |
| `reel-lanzamiento-20260822/final/` + `qc/` | El reel v7 y su tira de QC | 9:16 |
| `prueba-motor-20260813/` | **Solo** `C-elem-ancla-closeup`, `D-elem-ancla-medio`, `E-elem-surgical-closeup` | 9:16 |

El render de carrusel es **1080×1350 (4:5)**, así que el 3:4 de `tanda` y `prueba-realismo`
entra con recorte mínimo. Las 9:16 se recortan fuerte: sirven para historias, no para carrusel.

---

## 🔴 Lista negra — archivado en `_ARCHIVO-NO-USAR/`

| Qué | Por qué |
|---|---|
| `calibracion-20260806/` (las 15, incluidas v2 y v3) | **Piel roja del Soul prohibido.** Es la carpeta que rompió L08 y L09 |
| `perfil-20260806/` (completa) | Misma rojez |
| `avatar-20260806/` salvo `FOTO-PERFIL-LUCIA.jpg` | Rojez; y dos archivos son directamente **otra cara** |
| `prueba-soul-v3/A-soul-v3.png` | Ojos gris azulados, pecas borradas |
| `prueba-motor-20260813/A-soul-medio`, `B-soul-closeup` | Tomas del Soul perdedor |
| `references/models/pecas-clean-v2/`, `pecas-source-frames/` | Frames de una persona real. Dejaron de ser la vara el 15-ago |
| `references/models/lucia-content-bank-20260709/`, `lucia-demos-20260709/` | Banco viejo con look de IA, rechazado por Sergio |

**Mixta, no se archiva pero no se usa en bloque:** `posts-20260807/` es el workspace activo
(ahí viven los briefs). De su banco de fotos, `P1-hace-un-ano.jpg` es canónica; `P3` y `P5`
tienen piel roja; `P2`, `P4` y `P6` tienen deriva de estructura.

### Docs superados que ordenan lo contrario

- `docs/ONIA_MODELOS_RAIZ.md` — se autodeclara "este índice manda", es del 10-ago y manda usar
  el Soul prohibido. **Superado por `LUCIA.md`.**
- `docs/ONIA_FORMATOS_ADENDA_PERSONAJES.md` — del 24-ago, planifica con "Soul de Lucía".

---

## Cómo se hace cumplir

No depende de que alguien se acuerde. `scripts/carousel_gate.js` valida toda ruta de imagen de
una pieza de Lucía contra esta lista blanca y **falla antes de renderizar** si aparece una
descartada. La lista vive en `scripts/lucia_banco.json`, y este archivo es su explicación.
