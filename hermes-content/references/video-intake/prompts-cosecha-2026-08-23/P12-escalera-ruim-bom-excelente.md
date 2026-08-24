# P12 · Plantilla HyperFrames: escalera comparativa RUIM/BOM/EXCELENTE, parametrizada por rubro

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-escalera-ruim-bom-excelente.md) · `Db60O6OxWU5` · @tiagolemosx
- **Fuente:** https://www.instagram.com/p/Db60O6OxWU5/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Solo el talking-head: o Sergio graba 16 s de corrido, o se usa a Lucía (ElevenLabs = gasto, requiere permiso explícito caso por caso). Y una decisión chica: la palabra-gatillo del comentario — por la decisión del 2026-08-23 el objeto que mandamos por DM es agendar demo en cal.onia.com.bo, no un PDF, así que 'COMENTA GPT' se porta como 'COMENTA DEMO'. Nada más está bloqueado. Advertencia al portarlo: la regla 'la venta nunca exhibe obra' obliga a que el escalón RUIM sea una pieza genérica de rubro, NUNCA material propio con marca Onia encima.

---

```text
Construí en HyperFrames una plantilla de video vertical reutilizable llamada `escalera-comparativa`, portada del reel https://www.instagram.com/p/Db60O6OxWU5/ (@tiagolemosx). Antes de codear leé la skill `hyperframes` (entrada), después `hyperframes-core` y `hyperframes-cli`. NO reinventes el motor.

QUÉ ES EL PATRÓN (medido con ffprobe sobre el original, no estimado): 15,810 s · 720x1280 · 30 fps · **0 cortes** al umbral de escena 0,3. Es UNA sola toma continua con cámara fija; todo el ritmo lo hacen overlays que aparecen. Estructura: 4 bloques temáticos de ~3,95 s; dentro de cada bloque entran 3 láminas de izquierda a derecha (~1,3 s cada una) etiquetadas RUIM / BOM / EXCELENTE; los últimos ~3 s son CTA.

LO QUE TENÉS QUE ENTREGAR:

1. Una composición HyperFrames con:
   - Banda gráfica FIJA en el tercio superior: fila de hasta 3 piezas verticales ratio 4:5, separación regular, etiqueta centrada debajo de cada una en mayúsculas, blanco #FFFFFF con sombra suave (usá una grotesca geométrica pesada; la del original no se declara, elegí Poppins o Montserrat SemiBold).
   - Los dos tercios inferiores son una PISTA VACÍA reservada para el talking-head. Dejala declarada como track con su hueco documentado — todavía no tenemos la toma, y no la inventes.
   - Aparición DURA de cada lámina (sin fade, sin slide): así es el original.
   - Pill de CTA al final: border-radius total, blanco sólido, sombra difusa, dos pesos tipográficos dentro. Texto: `COMENTA` / `"DEMO"`. NO uses "GPT" — nuestro lead magnet decidido el 2026-08-23 es agendar demo en cal.onia.com.bo.

2. Parametrización por rubro: un solo JSON de entrada con `{ rubro, bloques: [ { titulo, laminas: [ruim, bom, excelente] } ] }`. Cambiar de dental a comercio o gastronomía debe ser editar ese JSON y volver a renderizar, nada más.

3. Tres láminas de ejemplo del módulo dental, hechas en HTML/CSS (NO con generador pago — no hay permiso de gasto en este prompt), siguiendo esta rúbrica que es el hallazgo del post:
   - RUIM: todo el brief impreso encima, 12-18 elementos de texto, 5+ colores saturados peleando, jerarquía plana, el producto tapado por sus claims.
   - BOM: se borra ~70% del texto; queda título + 2 líneas + CTA; UNA familia tipográfica con título 5-6x el cuerpo; 2-3 colores; producto con aire.
   - EXCELENTE: mismo copy que BOM, pero con UNA idea visual fuerte. El texto no baja más, sube el concepto.
   REGLA DURA: el escalón RUIM debe ser una pieza GENÉRICA de rubro, nunca material con la marca Onia encima. La regla "la venta nunca exhibe obra" prohíbe mostrar trabajo propio etiquetado como malo.

4. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "escalera comparativa", anotando el mecanismo: N estados del mismo objeto, aparición secuencial sin transición, sobre plano fijo sin cortes, animación cue-ada por gesto y no por beat.

NO HAGAS: no generes imágenes con Higgsfield ni ElevenLabs (gasto = permiso explícito de Sergio, caso por caso). No grabes ni sintetices el talking-head. No inventes testimonios, logos ni cifras de clientes (cero clientes pagando).

LISTO = existe un MP4 renderizado por HyperFrames a 1080x1920 de ~13 s con los 4 bloques de láminas y el pill `COMENTA "DEMO"`, verificado ABRIENDO el archivo y mirando 3 capturas (t=2 s, t=8 s, t=12 s) — no un exit code 0; más el JSON de rubro y una línea de comando documentada que re-renderiza el mismo video cambiando `rubro: dental` por `rubro: comercio`.
```
