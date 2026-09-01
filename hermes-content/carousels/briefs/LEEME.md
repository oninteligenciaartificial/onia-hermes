# 🔴 CARRIL MUERTO — de acá no se publica nada

**Declarado el 2026-08-31**, corriendo el gate por lotes sobre los 20 briefs de esta carpeta.
No se borra nada: hay trabajo bueno acá y varias piezas vivas nacieron de estos textos. Pero
**esta carpeta no es una cola de publicación**, y tratarla como tal ya causó problemas.

## El carril vivo de @oniahq es otro

👉 **`hermes-content/references/oniahq/briefs/`** — 10 briefs, limpio.

## La evidencia, medida

```bash
node scripts/carousel_gate.js --lote hermes-content/carousels/briefs
```

**Cinco pares de piezas duplicadas exactas** (parecido 1.00 sobre la portada):

| Pieza | Su duplicado |
|---|---|
| `onia-5-preguntas-de-siempre-20260820` | `onia-5-preguntas-FOTO` |
| `onia-competencia-mientras-whatsapp-20260820` | `onia-competencia-FOTO` |
| `onia-cuaderno-no-avisa-20260820` | `onia-cuaderno-no-avisa-foto-20260820` |
| `onia-cuaderno-no-avisa-20260820` | `onia-cuaderno-VARIANTE-CLARA` |
| `onia-cuaderno-no-avisa-foto-20260820` | `onia-cuaderno-VARIANTE-CLARA` |

Son variantes de la misma pieza —una con foto, otra sin, otra "clara"— que quedaron todas con
el mismo titular. Publicar dos es publicar el mismo post dos veces.

## Dos defectos estructurales, no de contenido

1. **El trigger guarda la FRASE, no la palabra.** Acá dice `"comment_trigger": "Comentá SISTEMA"`
   en vez de `"SISTEMA"`. El circuito de n8n matchea la **palabra** que alguien comenta, así que
   una frase entera nunca va a coincidir con nada. Los briefs del carril vivo lo guardan bien.
2. **Dos palabras piden comentarios y no existen en el registro:** `AUTO`
   (`onia-recibo-*`) y `NUVIA` (*"Escribí NUVIA en los comentarios"*). Ninguna está en
   `scripts/recompensas.json` ni en el mapa vivo de n8n. Si una de esas piezas sale, el lead
   comenta y **no recibe nada** — es el incidente RANKING del 26-ago otra vez.

Otras dos, `MITO` y `COSTO`, aparecen sólo en la prosa del caption, sin campo declarado: el gate
ni las ve.

## Qué hacer si alguna de estas piezas vale la pena

No publicarla desde acá. **Portarla al carril vivo**: copiar el brief a
`hermes-content/references/oniahq/briefs/`, dejar el trigger como **palabra sola**, y registrar
esa palabra en `scripts/recompensas.json` antes de que exista un solo comentario esperándola.
