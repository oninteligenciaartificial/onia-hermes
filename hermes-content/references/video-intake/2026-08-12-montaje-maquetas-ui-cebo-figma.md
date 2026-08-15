# Montaje de maquetas UI al ritmo — cebo "comentá FIGMA"

- **Fuente:** https://www.instagram.com/reel/DbsnCscPCow/ · 7.7 s · sin voz (música con letra)
- **Visto:** 2026-08-12 (Gemini nativo)
- **Archivo:** `Instagram-DbsnCscPCow.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-DbsnCscPCow.md](transcripciones/2026-08-12-Instagram-DbsnCscPCow.md)

## Qué dice realmente

Tres pantallas en 7,7 segundos, sin locución:

- **00:00-00:01** — fondo negro, texto rosa curvado: *"Developers are gonna hate me for this."*
- **00:01-00:06** — cinco maquetas/wireframes de webs y dashboards en gris y negro, sobre un
  fondo de pared con sombras de sol, cortadas al ritmo de la música. Marca de agua
  `@bea_ui.ux`. Unos ~5 segundos para 5 piezas: **algo así como un segundo cada una**.
- **00:06-00:07** — vuelta al negro, texto rosa: *"Comment "FIGMA" to get the figma file"*.

No hay explicación, ni código, ni herramienta, ni proceso. El audio es letra de canción
(*"lemme drive… to the left, to the right"*) — Whisper devuelve un solo segmento con "to the
left" repetido decenas de veces, o sea cero información (§8b de la síntesis: cuando hay texto
en pantalla, el texto manda sobre el audio).

El video **no afirma ninguna cifra, precio ni resultado**. No hay nada que verificar salvo la
cuenta `@bea_ui.ux`, que tampoco se verificó.

## Veredicto: HUMO

Cae exacto en dos de los cuatro filtros de ruido del §5 de `SINTESIS_CORPUS.md`:

- **Clip mudo de UI ≤7 s con cebo de comentario** → *sólo entra si el diseño o el código se LEE
  en pantalla*. Acá no: cinco maquetas en gris a ~1 s cada una, con sombras encima y sin un solo
  detalle sostenido. **Por eso no aplica la excepción de referencia reconstruible**: no hay
  interfaz legible que portar a `ui-patterns/` — no se distinguen tipografías, espaciados,
  estados ni jerarquía. Reconstruirla sería inventarla.
- **CTA palabra-clave → DM** → ya catalogado desde el 9-ago y presente en 20 de las 40 piezas
  del corpus. Este es el nº 21 y no agrega ni un matiz de guion. Además sigue gateado por el
  token de Instagram (S6).

El único elemento con forma propia es el gancho de antagonismo (*"los devs me van a odiar"*),
y apunta a la audiencia equivocada: le habla a diseñadores y desarrolladores, no al dueño de
negocio formal boliviano que es nuestro comprador — el hueco nº 1 de la síntesis, que este
video vuelve a no tapar.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Marketing con IA | Ninguna. El mecanismo comentario→DM ya está anotado (V-7 / A2) y bloqueado por S6; anotarlo otra vez es el desperdicio que el §5 pide cortar |
| web-factory / `ui-patterns` | Ninguna. No califica como referencia reconstruible: nada legible en pantalla. Si hace falta material de portafolio, el molde válido ya está en [antes/después FIND](2026-08-09-web-antes-despues-find-real-estate.md) |
| Intake | Confirma el filtro: clip mudo ≤7 s + cebo de comentario + nada legible = `HUMO` de ficha corta, sin análisis largo |

## Riesgo

Dos, y ninguno técnico:

- **De tiempo.** Es el caso exacto de humo predecible desde el primer vistazo. El costo no es el
  video: es gastarle el mismo esfuerzo de análisis que a una pieza útil.
- **De copia.** El montaje se apoya en un audio de trend (letra de canción con derechos) y en
  maquetas ajenas. Replicar el formato con nuestro material está bien; usar ese audio o esas
  pantallas, no.
