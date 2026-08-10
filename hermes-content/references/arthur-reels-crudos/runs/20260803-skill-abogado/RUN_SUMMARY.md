# Run — "Hacé que la IA deje de darte la razón" (Arthur) · 2026-08-03

Segundo reel de Arthur. **Formato tutorial**: talking-head + grabaciones de pantalla.
Serie: enseñanza / criterio. Entregable: `final/arthur-skill-abogado.mp4` · 49,3 s · 1080x1920.

## Material de origen

| Archivo | Qué es | Notas |
|---|---|---|
| `IMG_4745.MOV` | Talking head | 4K 60 HEVC HDR, rotación −90, 53,8 s. **Cámara por debajo de la altura de los ojos** — mucho techo en cuadro. Corregir en la próxima. |
| `clip 1.mp4` | Configuración → Habilidades → Agregar → formulario | 15 s |
| `clip 2.mp4` | Los 3 campos + Crear + skill en la lista | 10 s |
| `clip 3.mp4` | La pregunta + `Habilidad ejecutada` + razonando | 60 s (se usan 4,2) |
| `clip 4.mp4` | La respuesta con veredicto | 15 s (se usan 9) |

Los clips de pantalla se grabaron con `GRABAR-PANTALLA.bat` (ffmpeg gdigrab por región).
**Game Bar no sirve en esta PC** — "no cumple los requisitos de hardware para capturas".

## Estructura final

| Tramo | Qué se ve | Fuente |
|---|---|---|
| 0 – 10,90 s | Cara. Gancho + promesa | ken burns 1.00→1.09 |
| 10,90 – 20,50 s | `sec1` sobre fondo desenfocado | clip 1 acelerado a 9,6 s |
| 20,50 – 31,30 s | `sec2` — el formulario completo | clip 2 estirado a 10,8 s |
| 31,30 – 35,50 s | `sec3` — pregunta + skill ejecutada | clip 3, t 20→24,2 |
| 35,50 – 44,47 s | `sec4` — el veredicto | clip 4, t 6→15 |
| 44,47 – 49,21 s | Cara. CTA | ken burns 1.10→1.01 |

**Fondo durante los tramos de pantalla:** el propio talking-head desenfocado
(`boxblur=26`) y oscurecido (`brightness −0.20`). Así su cara nunca desaparece del
todo y no hace falta un PiP.

## ⚠ Confidencialidad — qué se sacó y cómo

Tres exposiciones reales, todas resueltas **antes** del render final:

1. **Nombre de cliente + contrato.** La primera toma del clip 3/4 (grabada desde un chat
   con acceso al repo) devolvió *"la propuesta de Franco Marín (7.900 + 890/mes)"* en el
   cuerpo de la respuesta. **Se regrabó desde un chat sin acceso a los archivos** — no se
   intentó tapar: era texto en scroll y el difuminado sobre texto en movimiento no es fiable.
2. **Lista de proyectos en la barra lateral** (gesti-os, Bolivian Electric, web factory,
   onia-plattform…). En `sec1` y `sec2` se difumina la región `x 0-410, y 330-890`; en
   `sec3` y `sec4` se recorta directamente (`crop` desde x=410), que además mejora el
   encuadre vertical.
3. **`AlfredHQ`** en el encabezado de la conversación y una mención a *"construir Alfred"*
   en el cuerpo. Arthur no confirmó si es público, así que **se eliminó por recorte**:
   `sec3` recorta desde y=100 y `sec4` desde y=292 (arranca en "Veredicto"). Cero difuminado
   sobre texto móvil.

**Regla que sale de acá:** grabar demos SIEMPRE desde un chat sin acceso al repo. La skill
funciona igual y no arrastra datos de clientes al cuadro.

## Correcciones del transcriptor

Whisper entendió mal 7 tokens. Se parchearon en `segments-cut.json` por índice:

| Índice | Whisper | Real |
|---|---|---|
| 1, 31 | "ida" | **IA** |
| 3 | "habla razón" | **da la razón** |
| 110 | "hombreito" | **dé un veredicto** |
| 119 | "diferentes de" | **a diferencia de** |
| 132 | "si" | **sí** |
| 160 | "cinco estas" | **cinco de estas** |

## Cadena

`normalizar (6m18s) → transcribir → cut-plan → PREVIEW → cortar → ken → montaje →
subtítulos + tags → SFX → master`

- Corte: 53,78 → 49,21 s · 9 silencios (5,88 s) · 0 muletillas
- Subtítulos karaoke 88 pt, MarginV 285
- 5 tags de paso, mismo tratamiento que el reel anterior (panel translúcido + guion verde)
- 4 whoosh a −12/−13 dB con ducking, uno por cambio de tramo
- Master: **−21,88 → −14,30 LUFS**, pico −1,24 dBTP

## v2 — ajustes pedidos por Arthur (VIGENTE)

Entregable vigente: **`final/arthur-skill-abogado-v2.mp4`** · 48,6 s.

| Pedido | Solución |
|---|---|
| *"que el blur no tape tanto la pantalla"* | En `sec1` se dejó de difuminar la barra lateral y se **recortó fuera del cuadro** (`crop=1136:866:84:56`, el panel de configuración solo). Cero blur, y de paso el texto entra más grande. |
| *"el clip 2 se acabe ni bien le dé a Crear"* | `sec2` corta en 6,5 s — el clic a Crear ocurre en ~5,9 s — y **congela el último cuadro** (`tpad=stop_mode=clone`) hasta completar los 10,8 s de narración. El formulario completo se queda quieto en pantalla: es justo el cuadro que la gente pausa para copiar. |
| *"al final que se corte más rápido, cuando ponga la mano"* → luego *"que la mano llegue a la cámara y ahí se corte"* | Corte final a **48,85 s** (v3). Secuencia: 48,2 señala a cámara · 48,5 la mano abierta llena el cuadro · 48,7 tapa el lente · corte. Los últimos ~4 cuadros son el manotazo, y eso **se lee como cierre a propósito**, no como error. El tag del CTA se estira a 48,62 para acompañar hasta el negro. |

**Aprendizaje:** recortar > difuminar. Siempre que el dato sensible esté en un borde del
cuadro, sacarlo por `crop` es más limpio, más seguro y deja el contenido útil más grande.
El blur queda para cuando lo confidencial está en el medio y no hay forma de recortar.

## Pendiente

- Arthur nunca confirmó si `AlfredHQ` es público. Se resolvió por recorte, pero conviene
  saberlo para las próximas piezas.
- Probar las 5 skills del lead magnet antes de repartirlas
  (`hermes-content/lead-magnets/skills-negocios/`). El CTA promete cinco.
