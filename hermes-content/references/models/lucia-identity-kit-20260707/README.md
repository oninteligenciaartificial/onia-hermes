# Lucia — Identity Kit definitivo (2026-07-07)

Kit de identidad "perfecto" pedido por Sergio despues de detectar que `soul_2` genera
arrugas de forehead no naturales en expresiones fuertes (cejas muy levantadas: sorpresa,
risa grande). Mismo patron que el workflow de Sergio
(`sergio-approved-media/identity-shoots/20260605-nano-banana-face-teeth-lock/`):
contact sheet con neutral, sonrisa suave, sonrisa completa, 3/4, perfil — mas un panel
extra de expresion fuerte para validar el fix.

## Metodo (diferente del Nivel 1 default)

- Modelo: `nano_banana_pro` (rutea a `nano_banana_2` internamente), NO `soul_2`.
- Reference Element: **solo** `ced20cc2-3388-4d98-92ee-b0fcd961aa62`
  (`lucia-face-real-anchor` — frame REAL del video de Sergio, escalado 2K, sin
  generacion de IA). No se combino con Elements de outfit/lugar para no diluir
  fidelidad.
- Prompt siempre con: "poreless smooth forehead skin zero wrinkles" + "Keep her exact
  identical face, freckles, hair and features".
- Costo: 2cr/imagen (vs 0.12cr de `soul_2` — ~16x mas caro, pero resuelve el artefacto
  que `soul_2` no resuelve con negativos de texto solos).

## Resultado (verificado, ver `contact-identity-kit.png`)

| Archivo | Expresion/angulo | Forehead |
|---|---|---|
| `kit-01-neutral.png` | Neutral, boca cerrada | Liso |
| `kit-02-slight-smile.png` | Sonrisa suave | Liso |
| `kit-03-full-smile.png` | Sonrisa completa, dientes visibles | Liso |
| `kit-04-threequarter.png` | 3/4 angulo | Liso |
| `kit-05-profile.png` | Perfil | Liso |
| `kit-06-surprised.png` | Sorpresa, cejas MUY levantadas, boca abierta | **Liso incluso en el caso mas exigente** |

Identidad consistente en las 6: mismas pecas, cejas, ojos, nariz, forma de labios, pelo.
Este es el caso de prueba mas duro (cejas levantadas) y no muestra el artefacto que si
aparecia con `soul_2` (ver `emotion-surprised.png` en `avatar-lab/20260706-lucia-content-batch/style-iteration/` para el contraste).

## Como usarlo de ahora en mas

- **Para expresiones fuertes / cejas levantadas / reacciones grandes:** usar este metodo
  (`nano_banana_pro` + `ced20cc2-...` solo, sin combinar otros Elements).
- **Para expresiones calmas/sonrisa suave/feed generico:** `soul_2` + `36305a9b-...`
  sigue siendo el default barato (0.12cr), ya validado, sin el artefacto en estos casos.
- Estas 6 imagenes son ahora la referencia canonica de "Lucia perfeccionada" — comparar
  contra estas (ademas de contra `pecas-clean-v2/`) en el QA de cualquier generacion
  nueva con expresion fuerte.

Ver regla completa en `AVATAR-CONSISTENCY-SCHEME.md` (seccion Nivel 1, pitfall de
forehead).
