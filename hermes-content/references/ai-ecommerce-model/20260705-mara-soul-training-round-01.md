# Mara ONIA — Soul entrenado (Round 01)

- **Fecha:** 2026-07-05
- **Objetivo:** dejar a Mara DEFINIDA como avatar reusable (identidad fija) via Higgsfield Soul, aprobado por Sergio.
- **Soul ID:** `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f`
- **Nombre:** `Mara ONIA v1`
- **Tipo:** `soul_2` (Higgsfield Soul V2)
- **Estado:** training (arrancado 2026-07-05; ~10 min).

## Identidad entrenada

**Importante:** el banco `identity-bank-50/` es la identidad **pelirroja luxury** (pelo cobrizo, pecas, piel clara, ojos verde/avellana) — NO la castaña "Mara Vale" del round-01. Es la mas desarrollada y consistente del repo (score 94), por eso se eligio para el Soul. Si se quiere la castaña, se reentrena con otro set (gratis).

## Set de entrenamiento

10 fotos faciales verificadas (angulos y expresiones variados, misma cara):
`identity-bank-50/photos/mara_identity_01.jpg` .. `mara_identity_10.jpg`
(hoja fuente: `20260605-mara-luxury-identity-bank-sheet-01-face-expressions-4k.png`).

media_ids subidos a Higgsfield:
`8c7fac75`, `a0dbb9ec`, `c08762ed`, `36de9252`, `c791fdd7`, `d160b9b2`, `a7c7e6a8`, `f5058b7d`, `53942c3e`, `62f5505a`.

## Costo (REGLA Sergio: solo barato)

- Entrenar Soul: sin cargo visible en el historial de transacciones (parece incluido en plan ultra).
- Generar con `soul_2` + este soul_id: **~0.12 cr/imagen**.
- Comparar: nano_banana_2 1.5-3cr; z_image 0.15cr (no fija identidad); Seedance video 45-135cr (evitar). Ver [[radar-ia-content-production]] y [[gasto-plataformas-validar-primero]].

## Como usar el Soul (cuando este `ready`)

```
generate_image  model=soul_2  soul_id=b8f5c353-faaf-44eb-ae5a-4e0bacfd333f
                quality=2k  aspect_ratio=9:16  prompt="<escena/outfit/luz>"
```
Solo funciona con `soul_2` (Soul V2) y `soul_cinema_studio`. Para otros modelos (nano/seedream/kling/seedance) usar Reference Element en su lugar.

## Siguiente

1. Verificar identidad: 3-4 imagenes de prueba (rutas UGC / premium / lifestyle) a 0.12cr c/u.
2. Si la cara sale consistente -> Mara queda DEFINIDA y lista para contenido ecommerce.
3. Recien despues, si Sergio aprueba, animar (modelo de video = gasto aparte, validar antes).
