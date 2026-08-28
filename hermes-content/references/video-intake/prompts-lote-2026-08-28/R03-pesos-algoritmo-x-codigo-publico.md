# R03 · Los pesos reales del algoritmo de X, leídos de su código público

- **Destino:** `marketing`
- **Sale de:** [la ficha](../2026-08-28-pesos-algoritmo-x-codigo-publico.md) · `DcE8336Ixby`
- **Fuente:** https://www.instagram.com/p/DcE8336Ixby/
- **Qué falta para hacerlo hoy:** Verificar los pesos contra el repo público antes de construir nada encima.

---

```text
Objetivo único: verificar los pesos del algoritmo de X contra el código público y, si se confirman, escribir el CTA que corresponde.

De dónde sale: ficha `pesos-algoritmo-x-codigo-publico` (IG DcE8336Ixby). El reel muestra en pantalla el repo xai-org/x-algorithm (2.814 archivos) y esta tabla de pesos:

  copiar el link ........ 20.0
  reply (comentar) ...... 5.0
  compartir por DM ...... 5.0
  quote al tweet ........ 5.0
  retweet ............... 1.0
  like .................. 0.5
  report ............... -234.0

Y el fragmento: fn rank_post(p: &Post) { score += 20.0 * p.copy_link; score -= 234.0 * p.reports; }

REGLA DE ENTRADA: esos números salen de una CAPTURA, no de haber abierto el repo. Son dato de segunda mano. Este prompt existe justamente para no construir estrategia sobre una captura.

Pasos:

1) Abrir el repo público xai-org/x-algorithm y buscar la función de ranking real. Confirmar o desmentir CADA peso, citando archivo y línea. Si el repo cambió o la función no existe con ese nombre, decirlo — eso también es un resultado.

2) Anotar la FECHA de la verificación. Un algoritmo cambia; dentro de tres meses este documento es historia, no fuente.

3) Si los pesos se confirman, escribir qué cambia para nosotros:
   - el CTA en X deja de ser "dale like" y pasa a ser "copiá el link y mandáselo a alguien"
   - compartir por DM vale lo mismo que comentar: pedir el DM explícitamente
   - un report resta 234, o sea más de diez links copiados. Contenido polémico sale carísimo: definir qué NO publicamos

4) Cerrar el pendiente viejo del corpus sobre este mismo repo, que quedó SIN EVIDENCIA porque nadie lo abrió. Enlazarlo.

5) Si los pesos NO se confirman, escribir eso mismo con la misma claridad y descartar la ficha. Un desmentido documentado vale tanto como una confirmación.

LISTO = un documento con cada peso confirmado o desmentido citando archivo y línea del repo, con fecha de verificación, y el CTA para X escrito (o la constancia de que los datos no se sostienen).
```
