# Mara BO v2 — la modelo boliviana (reemplaza a Mara ONIA v1)

> 2026-08-06. Sergio: *"que la segunda modelo se vea más latina y que nos sirva a ONIA que
> sean bolivianas"*. Mara v1 era pelirroja de piel clara — no leía como boliviana y no servía
> para vender e-commerce local.

## Identidad vigente

| Dato | Valor |
|---|---|
| **Soul (usar este)** | `Mara BO v2` → `6c94bbf0-bc71-4fe1-841e-f366bdb00b6e` |
| Soul jubilado | ~~`Mara ONIA v1` `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f`~~ (pelirroja — **no usar más**) |
| Element de la cara base | `mara-bo-v2-cara` → `550088fc-a18d-4762-9d51-0aed5a9044bf` |
| Cara elegida | opción **D** del casting: mestiza urbana boliviana |

**Bloque de identidad** (pegar en todos los prompts, sin editar):

```
Bolivian mestiza woman, 27, light olive-tan skin, oval face, expressive dark brown eyes,
natural thick eyebrows, dark brown hair in a soft blunt shoulder-length cut with a middle
part, real skin texture with visible pores.
```

Atuendos y escenarios: los mismos definidos para Mara en
`hermes-content/docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` §2 (beige/marfil/camel,
interiores minimalistas luminosos). Solo cambió la cara, no la línea estética.

## Cómo se construyó (repetible para modelo 3, 4, 5)

1. **Casting:** 4 caras con `soul_2` sin `soul_id` (texto puro), mismo set y misma luz para
   que la única variable sea el rostro → `casting-20260806/_CASTING-MARA-BO.jpg`. ~0,5 cr.
2. **Element:** la cara elegida se convierte en Reference Element (instantáneo, gratis).
3. **Set de entrenamiento:** 11 fotos con `nano_banana_2` + el placeholder `<<<element_id>>>`,
   variando ángulo, expresión, luz y distancia, con ropa lisa y neutra para que el Soul
   aprenda la CARA y no el vestuario. 1,5 cr c/u ≈ 16 cr.
4. **Filtro humano:** revisar el set antes de entrenar. En esta tanda **1 de 11 salió otra
   mujer** y se excluyó — si entra al entrenamiento, contamina el Soul para siempre.
5. **Entrenar:** `show_characters(action='train')` con las 10 buenas + la cara original.
   ~10 min, no bloquea.

**Costo total de crear una modelo IA nueva desde cero: ~42 créditos.**
(0,5 casting + ~16,5 set de entrenamiento + **25 el entrenamiento del Soul**.)

> ⚠️ **Corregido:** primero anoté ~17 cr porque di por sentado que entrenar un Soul era gratis.
> **No lo es: cuesta 25 cr** (verificado en `AVATAR-CONSISTENCY-SCHEME.md`, historial real de
> transacciones). Pensarlo antes de entrenar — un Soul entrenado sobre la cara equivocada son
> 25 créditos tirados.

## Reglas que siguen valiendo

- Los prompts van **solo en afirmativo** — las negaciones producen el defecto
  (`ONIA_MODELOS_RECETA_VISUAL_20260806.md` §1).
- Etiqueta de IA obligatoria en la bio el día que tenga cuenta.
- Mara presenta y demuestra; **nunca testimonia como usuaria** (FTC).
