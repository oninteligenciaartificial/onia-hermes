# Validación de la madre · guiones G4 y G5 de Lucía (10-oct-2026)

Revisor: Opus, solo lectura. Fuente: rama `origin/claude/zealous-babbage-fvtjck`
(`hermes-content/docs/cola/lucia-diario/guiones/G4-seis-motores-de-imagen-una-cara.md`,
`.../G5-como-se-mide-una-cara.md`, `videos/lucia-entrega/README.md`, `videos/lucia-g4|g5/pie.txt`,
`qa/revision-2.md`, `qa/grep-prohibidas.txt`). Cifras contrastadas a mano contra
`hermes-content/references/modelos/lucia/v4/PROCEDENCIA.jsonl` línea 97. Reglas: `LUCIA.md` (§ inicial y §7),
memoria `lucia-influencer-posicionamiento`, skill `aprender-de-todo`. 0 créditos, sin re-render ni re-medición de caras.

## Veredicto

| Guion | Veredicto | Se publica |
|---|---|---|
| **G4** «Seis motores de imagen, una cara» | **APROBADO** | Sí, con el render que ya está en `videos/lucia-entrega/g4-final-1080x1920.mp4` (SHA `ec4c450f…`) |
| **G5** «Cómo mido si una cara es la de Lucía» | **APROBADO** | Sí, con `videos/lucia-entrega/g5-final-1080x1920.mp4` (3ra pasada, SHA `6eed3ade…`) |

Orden según el README de entrega: G4 en la semana 2 · día 5; G5 después. Condición que no depende del guion: el token de
Instagram de Lucía vence entre el 13 y el 18-oct; la primera pieza sale antes o se renueva.

## G4: chequeo por criterio

| Criterio | Resultado | Evidencia |
|---|---|---|
| Cifras verdaderas y que se pueden mostrar | OK | A 0,806 · B 0,794 · C 0,737 · D 0,702 · E 0,691 · F 0,658, y créditos 1 · 0,5 · 2 · 2,5 · 3 · 2,75: coinciden con PROCEDENCIA. Lección 2: A 0,83/0,839 y B 0,35/0,831 coinciden. Las tres conclusiones del pie («el que ya uso la sostuvo en tres», «pagar más no la mejoró», «el más barato la perdió en una de tres») se desprenden de esos números |
| Límites del método dichos en pantalla | OK | «Una toma cada uno: es una prueba, no una regla.» y «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» a 44 px |
| Declara que es IA | OK | Rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 3 s, a 40 px; pie que abre con «personaje hecho con IA»; etiqueta de IA por API al publicar |
| No se hace pasar por persona real ni usa marcas ni caras ajenas | OK | Motores como «Imagen A a F»; logos de C y E y sillones dentales de C difuminados (revisión 2: H1 y H2 cerrados); la foto B del café va rotulada «Imagen B · café · 0,35», no como Lucía; ninguna frase de profesión (el ambo es vestuario) |
| Promete algo de Onia que no existe | No promete nada | Sin producto, sin cliente, sin testimonio; `grep-prohibidas`: 0 coincidencias |
| Gancho ≤ 3 s y CTA único | OK | «¿Cuál conserva su cara?» a opacidad plena a 1,5 s; un único CTA: «Seguime: cada semana, una prueba.» (el pie dice lo mismo). Duración 59,75 s |

**Decisión que la revisión 2 dejó a la madre (R2-1, sellos rojos «bajo el piso» en E y F antes de la nota del ruido):
se dejan como están (opción a).** Dicen la verdad respecto del piso que el mismo video fija, y a los 45,6 s el video
aclara el ruido. No hace falta re-renderizar.

No bloquean (solo si se re-renderiza por otro motivo, 0 cr, una línea de `plan.json` cada uno):
- R2-3: «El café: B perdió la cara.» → «Escena 2: B perdió la cara.». La escena 3 de B también es un café y ahí la
  mantuvo (0,83). El espectador no se entera, porque en pantalla solo aparece el café de la escena 2.
- «Pagar más no mejora el parecido.» → «Pagar más no mejoró el parecido.» (6 palabras), para que coincida con el pie y con
  «es una prueba, no una regla».
- R2-2 (el parche de C toca la manga): sin cambios; solo se nota con zoom de 2,5x o más.

## G5: chequeo por criterio

| Criterio | Resultado | Evidencia |
|---|---|---|
| Cifras verdaderas y que se pueden mostrar | OK | A 0,806 · F 0,658 · B del café 0,350. Motor 5 (Kling O3, solo referencias): cuadro 0 = 0,798 con la cara de 89 px. Motor 6: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771, es decir mínimo 0,77, máximo 0,80, promedio 0,784, todo dentro de ±0,03. Motor 4 a los 4,0 s: 0,796, con el letrero inventado (nota en PROCEDENCIA). La numeración de motores coincide con la de G2 (`videos/lucia-g2/README.md`) |
| «el medidor avisa» bajo 200 px | Verdad | `.claude/skills/lucia/scripts/face-gate.sh` línea 60 imprime «(cara < 200 px: poco confiable)» |
| Lo que el video no afirma | OK | No dice que el número baje con la cara chica (el control da −0,004 a −0,010). Presenta ±0,03 como un tamaño aproximado del ruido y 0,70 como una decisión («Lo elegí yo») |
| Declara que es IA | OK | Rótulo de 0 a 3 s, a 40 px, y el pie. «Su cara oficial» y «lo inventó el motor» evitan confundirla con una persona real o con «la IA» |
| Persona real, marcas o caras ajenas | OK | Medidor y motores sin nombre; el letrero inventado está difuminado y el video lo dice («Lo difuminé: lo inventó el motor.»); B del café rotulada como «otra persona» |
| Promete algo de Onia que no existe | No promete nada | `grep-prohibidas`: 0 coincidencias |
| Gancho ≤ 3 s y CTA único | OK | «¿Cómo sé que sigue siendo ella?» a opacidad plena a ~1,4 s; un único CTA: «Seguime: cada semana, una prueba.». Duración 57,5 s |

Los tres ARREGLAR de la revisión 2 (R2-1 «cabe en ±0,03», R2-2 «el medidor avisa: lo reviso a ojo», R2-3 «lo inventó el
motor») aparecen en el texto del render final (`qa/grep-prohibidas.txt`) y en `pie.txt`, que es igual al pie del guion.

No bloquea: «Un número, de 0 a 1» es una simplificación, porque la similitud del coseno puede dar negativo. En la práctica,
las caras de otras personas dan como máximo 0,224, así que no cambia nada de lo que muestra el video.

## Lo que no verifiqué
- No miré los cuadros de los renders finales: me apoyo en `qa/revision-2.md` (cuadros mirados) y en el texto extraído del
  DOM (`grep-prohibidas.txt`). El render de la 3ra pasada de G5 no tuvo una revisión independiente de cuadros; sus cambios
  son exactamente los tres textos que pidió el revisor.
- Sigue pendiente de antes: si las 8 referencias de medición se solapan con las 6 de entrada. Afecta a todos los motores
  por igual, así que la comparación entre ellos se mantiene.

Idea para el banco (no se aplica): para el objetivo de aprender Higgsfield, nombrar las herramientas como uso propio
(sin presentarlo como recomendación pagada) le daría al espectador algo que pueda repetir. Hoy la regla del carril dice que no se nombran terceros.
