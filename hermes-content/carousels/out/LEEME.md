# 🔴 De acá NO se publica — es salida de render, no una cola

**Escrito el 2026-09-02.** `briefs/LEEME.md` declaró muerto el carril de briefs el 31-ago,
pero **la declaración nunca llegó hasta acá** — y acá es donde viven los JPG/PNG que un
humano puede subir. Quien abre esta carpeta ve 31 carpetas con pinta de carrusel terminado
y nada que le diga cuáles no van.

👉 **El carril vivo de @oniahq es `hermes-content/references/oniahq/briefs/`.**
👉 **Las piezas que se publican viven en `hermes-content/references/`, no acá.**
👉 La única carpeta viva de acá es **`ads/`** (creativos de Meta Ads, 8 piezas).

## Las 15 carpetas que salen del carril muerto

Son el render de un brief de `hermes-content/carousels/briefs/`, declarado muerto el 31-ago:

`lucia-reveal-20260809` · `nuvia-presentacion` · `onia-3-procesos-a-mano-20260617` ·
`onia-5-preguntas-de-siempre-20260820` · `onia-5-tareas-ia-20260617` ·
`onia-competencia-ia-20260617` · `onia-competencia-mientras-whatsapp-20260820` ·
`onia-costo-invisible-20260808` · `onia-cuaderno-no-avisa-20260820` ·
`onia-cuaderno-no-avisa-foto-20260820` · `onia-mitos-ia-20260808` ·
`onia-paradigma-escala-20260807` · `onia-recibo` · `onia-rip-cuaderno-20260809` ·
`onia-whatsapp-a-mano-20260808`

Las otras 15 (`VARIANTE-*`, `FOTO-*`, `formato-*`, `regresion-cta`, …) son pruebas del motor,
no piezas: mismo texto en distintos packs y formatos.

## Tres palabras que prometen un DM que nadie puede entregar

Medido el 02-sep cruzando cada brief contra `scripts/recompensas.json`, donde sólo están
registradas **SISTEMA, HUMO, LISTA, FACTURA y STACK**:

| brief / carpeta | palabra | registrada |
|---|---|---|
| `onia-mitos-ia-20260808` | MITO | 🔴 no |
| `onia-3-procesos-a-mano-20260617` | AUTO | 🔴 no |
| `onia-costo-invisible-20260808` | COSTO | 🔴 no |

Es el incidente RANKING del 26-ago: alguien comenta, el mapa de palabras no la tiene, la
persona no recibe nada y nadie se entera. **Matiz medido el 02-sep, mirando los JPG:** las
tres palabras viven en el **caption** del brief, no están quemadas en ninguna lámina — la
última lámina de `onia-mitos-ia-20260808` dice *«¿Cuál te frena a vos?»* y la de
`onia-costo-invisible` sólo *«COMENTÁ»*, sin palabra. O sea que el riesgo entra sólo si
alguien copia el caption del brief. Por eso no se toca el render: se declara acá.

## `onia-costo-invisible-20260808` no es un carrusel: son 7 capturas de un error

Las 7 láminas commiteadas el 20-ago (`b7132997`) son **el mismo archivo**, md5
`bac17211f184fd64cc61309f2e289ca5`, 32.258 B cada una: la pantalla *«No se encuentra el
archivo — ERR_FILE_NOT_FOUND»* de Edge. Estuvo 13 días en el repo pareciendo una pieza
terminada de 7 láminas.

Pasó porque `scripts/carousel_render.js` sólo preguntaba *«¿apareció un PNG?»*, y el
navegador **también escribe captura cuando no pudo abrir el HTML**: fotografía su propia
página de error y sale con código 0. El render imprimía `{ok:true}`.

✅ **Arreglado el 02-sep en el motor**, no en la carpeta: `assertSlidesDistintas()` corta el
render cuando todas las láminas salen byte a byte idénticas — la firma exacta de ese fallo.
Probada contra estos 7 archivos reales: los detecta. El fallo era transitorio (re-renderizar
hoy sale bien), así que lo que faltaba nunca fue el entorno: era la guarda.
