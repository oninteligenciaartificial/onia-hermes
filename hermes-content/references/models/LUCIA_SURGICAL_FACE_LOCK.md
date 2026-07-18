# Lucia Surgical Face Lock

Mismo metodo que `sergio-approved-media/higgsfield-runs/20260606-avatar-surgical-identity-shoot/SERGIO_SURGICAL_FACE_LOCK.md`,
adaptado a Lucia. Pedido explicito de Sergio (2026-07-07): la cara sigue saliendo
distinta en cada video, hace falta un photoshoot completo (cuerpo, cara, sonrisa,
nariz, orejas) sobre fondo blanco para lockear identidad de una vez.

## Objetivo

Crear un banco de referencia completo de Lucia con bloqueo quirurgico de identidad.
Prioridad absoluta: misma persona reconocible en todos los angulos y encuadres.

## Ancla real (unica fuente de identidad)

- `ced20cc2-3388-4d98-92ee-b0fcd961aa62` (Reference Element `lucia-face-real-anchor`) —
  frame REAL del video de Sergio (pecas-A-15), escalado 2K, sin generacion de IA.
- Modelo: `nano_banana_pro` (rutea a `nano_banana_2`), NO `soul_2` — `soul_2` es el que
  produce el artefacto de forehead "abollado" en expresiones fuertes.

## Rasgos que son sagrados (de `lucia-onia-identity-bible.md`)

- Edad aparente ~26-28.
- Pelo castano oscuro ondulado, largo-medio, raya al medio.
- Piel calida oliva/bronceada con textura real.
- **Pecas marcadas en nariz y mejillas — NUNCA limpiar ni suavizar.** (a diferencia de
  un retoque comercial normal, las pecas son el rasgo distintivo, deben quedar SIEMPRE)
- Ojos marrones, almendrados.
- Cejas gruesas oscuras naturales.
- Labios llenos naturales.
- Aritos de argolla dorados chicos (accesorio de identidad).
- Nariz y orejas: forma real de la referencia, sin adelgazar/agrandar/redibujar.
- Cuerpo: esbelta natural, proporcionada (de la bible).

## Prohibido

- Crear una persona parecida pero distinta.
- Cambiar distancia entre ojos, tamano de ojos, forma de nariz, labios, menton,
  mandibula, dientes, edad o estructura del craneo.
- Arrugas de forehead que no esten en la referencia real (el bug ya conocido).
- Piel plastica, demasiado suavizada, o "modelo generico".
- Usar un output ya generado como identidad base — solo el ancla real.

## Limpieza permitida

- Iluminacion pareja de estudio, fondo blanco limpio.
- Nitidez y balance de color.
- Nada que altere estructura facial real.

## Shot list (fondo blanco, estudio, 10 tomas)

| # | Toma | Encuadre |
|---|---|---|
| 1 | Frontal neutral | Cara, expresion neutral, boca cerrada |
| 2 | Frontal sonrisa suave | Cara, sonrisa relajada |
| 3 | Frontal sonrisa completa | Cara, sonrisa grande con dientes visibles |
| 4 | Perfil izquierdo | Cara de perfil, nariz/menton/oreja/linea mandibular |
| 5 | Perfil derecho | Cara de perfil opuesto, oreja/nacimiento del pelo/cuello |
| 6 | Tres cuartos izquierdo | Volumen facial, cejas, ojo lateral, puente nasal |
| 7 | Tres cuartos derecho | Transicion frente-perfil |
| 8 | Detalle nariz/rostro | Close-up de nariz y zona de pecas |
| 9 | Detalle oreja/nacimiento del pelo | Close-up lateral de oreja y pelo |
| 10 | Cuerpo completo | De pie, pose neutral, cuerpo entero visible |

## Criterio de aprobacion

Una toma solo pasa si, al compararla contra `pecas-clean-v2/lucia-clean-01.png` (frame
real) y contra las otras 9 tomas de este shoot, se reconoce como la MISMA persona:
mismas pecas, cejas, ojos, nariz, forma de labios, pelo. Si una toma se ve "mas linda"
pero cambia algun rasgo, se rechaza y se regenera.

## Resultado (2026-07-07) — `contact-sheet.png`

Las 10 tomas generadas, fondo blanco liso, `nano_banana_pro` + ancla real
`ced20cc2-...` (mismo metodo que el Identity Kit anterior). QA:
- Forehead liso en las 10, incluso en la sonrisa grande (03) — sin el artefacto de
  arrugas de `soul_2`.
- Pecas, cejas, ojos, nariz, forma de labios y pelo consistentes en las 10 tomas.
- **Nota de QA (no es error de identidad):** las pecas se ven mas marcadas en las
  tomas frontales (01-03) que en perfil/tres-cuartos (04-07) — es una variacion normal
  de como la luz pega en distintos angulos, no una inconsistencia estructural. Si hace
  falta mas pecas visibles de perfil, reforzar "freckles clearly visible" en el prompt
  de esos angulos especificamente en una proxima iteracion.
- Cuerpo completo (10): build esbelta proporcionada, consistente con la bible.

Archivos: `01-front-neutral.png` ... `10-full-body.png` en esta misma carpeta,
mas `contact-sheet.png` con las 10 en grilla para revision rapida.

## ✅ APROBADO por Sergio (2026-07-07) — "ahora esta perfecta"

Este shoot queda como **la unica referencia de identidad de Lucia**. Se elimino
`lucia-identity-kit-20260707/` (el kit de 6 fotos anterior, superado por este de 10).

**Nuevo Reference Element creado:** `902eeebb-89e9-4477-8426-c555b20f7ecc`
("lucia-surgical-anchor"), desde `03-front-big-smile.png`. Es el nuevo ancla de
ESTILO para generar variedad (combos con outfit/lugar) — el ancla de VERDAD para QA
sigue siendo `ced20cc2-...` (frame de video real), no se reemplaza esa por una foto
generada aunque este aprobada; sirven para cosas distintas.

**Validado en combo** (outfit+lugar+`lucia-surgical-anchor`): 2 pruebas
(`new-anchor-bathroom.png` con look clean-girl, `new-anchor-street.png` con
streetwear) — identidad consistente, forehead liso. Nota: en la de calle el modelo
metio una gorra con logo real (NY) sin pedirselo, mismo pitfall que el logo Nike de
antes — reforzar "no brand logos" en cualquier prompt con accesorios/ropa.
