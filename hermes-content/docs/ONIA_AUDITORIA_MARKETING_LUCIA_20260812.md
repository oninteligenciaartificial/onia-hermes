# Auditoría de marketing, Lucía y contenido — 2026-08-12

Para que Sergio la lea y decida. Cada fila tiene su evidencia; lo que no pude verificar dice
"no verificable" en vez de inventar un estado.

**Nota de método:** esta auditoría iba a correr con 6 agentes en paralelo. El workflow murió con
`You've hit your weekly limit`. La hice yo, directo contra el repo, el VPS y la cuenta de
Higgsfield. Es más angosta que la planeada — lo digo para que sepas qué tan a fondo se miró.

---

## El titular en 3 líneas

**Lucía está construida y sin publicar.** Seis posts renderizados, foto de perfil decidida,
biblioteca de 50 imágenes, dirección estética escrita — y **cero publicaciones**, porque la
cuenta todavía no existe y eso depende de vos.

**El canal donde caerían los leads está caído hace 6 días.** El chatbot no guarda una sola
conversación desde el 6-ago.

**Hay créditos gastados que no tenemos en la mano**: 12 piezas generadas en Higgsfield y nunca
descargadas.

---

## Tabla maestra

### 🟢 VIVO (corriendo y verificado)

| Cosa | Evidencia | Nota |
|---|---|---|
| Cuenta Higgsfield | consulta MCP hoy: plan `ultra`, **2.862,68 créditos** | `seedance_2_0` y `_mini`; NO existe "2.5"; tope 15 s/toma; `unlim.available=false` |
| Pipeline de carruseles | `hermes-content/carousels/out/` con **12 carpetas renderizadas** | producción real, incluye `onia-costo-invisible-20260808` y 2 de Lucía |
| Piezas de Lucía renderizadas | `references/modelos/lucia/posts-20260807/` — P1 a P6 `.jpg` + grid + auditoría de caras | listas para subir |
| Biblioteca visual de Lucía | 50 imágenes en `references/modelos/lucia/**` | 5 carpetas: avatar, calibración, perfil, posts, biblioteca |
| Dirección estética | `docs/ONIA_LUCIA_DIRECCION_ESTETICA_20260811.md` (commit `8b03329d`, ayer) | el frente está activo, no en pausa |

### 🟡 CONSTRUIDO Y APAGADO (vale cero hasta encenderse)

| Cosa | Evidencia | Qué falta |
|---|---|---|
| **Los 6 posts de Lucía** | renderizados el 07-ago, sin publicar | la cuenta de IG no existe todavía |
| **12 piezas de biblioteca** | `biblioteca-20260808/LEEME.md`: *"generadas en Higgsfield, NO descargadas todavía"* | **créditos ya gastados, archivo no recuperado.** Descargarlas antes de que caduque el CDN |
| Los 12 carruseles de `out/` | archivos en el repo | ninguna evidencia de publicación |
| Intake de video automático | `scripts/video-intake.mjs` + `.github/workflows/video-intake.yml` | 2 secrets + credencial de GitHub en n8n |
| Receta AD SPEC | `docs/HIGGSFIELD_AD_SPEC_RECETA_20260812.md` | OK de gasto para la primera generación |
| Los 6 patrones de UI | `references/ui-patterns/` | nadie los portó al producto |

### 🔴 BLOQUEADO

| Cosa | Quién/qué lo destraba |
|---|---|
| **Chatbot no guarda hace 6 días** | verificado hoy: `messages` 16 filas, último **2026-08-06 14:58**. La regla de firewall que se culpaba **ya no existe** → la causa es otra. Prompt `D1` |
| Publicación automática + DM del CTA | token de IG (**S6**) |
| Cuenta de Lucía | vos: crearla a mano, activar etiqueta de IA, reclamar `@oniahq` |
| Primer video de Lucía | vos: OK de gasto (~17 créditos) |
| Pauta Meta | sin método de pago + verificación de negocio en pausa |

### ⚪ NO VERIFICABLE EN ESTA PASADA

| Cosa | Por qué |
|---|---|
| Motor de Meta Ads | no hay `scripts/meta*` ni `scripts/ads*`; la memoria dice deployado, no lo confirmé |
| Postiz | sin docs que lo describan; la memoria dice bloqueado por un registro DNS |
| Qué skills de Hermes usa el bot del VPS | requiere inspección del VPS que no hice |

---

## Lo construido y apagado — lo que cuesta tenerlo así

**Lucía es el caso más caro.** Hay trabajo de al menos tres semanas: análisis de frentes,
sistema de contenido con métricas de 4 cuentas, 6 posts armados, foto de perfil elegida desde
una selfie de espejo, una P6 rehecha *"porque la vieja se veía muy IA"*, y ayer la dirección
estética. **Nada de eso existe para el mundo**: sin cuenta creada, el activo es una carpeta.

Y hay algo peor que apagado: **las 12 piezas generadas y no descargadas**. Ahí se gastaron
créditos y el archivo sigue en el CDN de un tercero. Si caduca el link, se pagó dos veces.

**El orden importa y hoy está invertido.** Se siguió produciendo contenido (dirección estética
ayer, carrusel nuevo, 4 fotos más) mientras el paso que desbloquea todo —crear la cuenta— sigue
sin hacerse. Cada pieza nueva aumenta el inventario sin publicar.

---

## Lo que depende de vos

| Ítem | Qué se destraba |
|---|---|
| Crear la cuenta de Lucía (manual, teléfono) | los 6 posts pasan de carpeta a publicados |
| Activar la etiqueta de contenido IA | requisito, no opcional — la publicación queda en regla |
| Reclamar `@oniahq` | hoy es `@oniaagency` y la bio de Lucía lo menciona |
| OK de gasto del primer video (~17 cr) | la pieza 7, que es la que rompe el formato foto |
| Token de IG (**S6**) | publicación automática + DM del CTA + medición |
| NIT / SIAT (**S2**) | emisión fiscal real, que el producto promete |

---

## Las preguntas que solo vos podés contestar

1. **¿Se crea la cuenta de Lucía esta semana, o se pausa la producción hasta crearla?**
   Crearla: los 6 posts salen ya. Pausar: dejás de acumular inventario sin publicar.
2. **¿Descargamos las 12 piezas de Higgsfield ahora?** Sí: recuperás créditos ya gastados.
   No: el riesgo es que caduque el link y haya que regenerar (y pagar otra vez).
3. **¿El esfuerzo comercial se concentra en un rubro?** (la misma de `C4`) Concentrar: un
   mensaje, una lista. Seguir con seis: más superficie, seis veces el trabajo, cero clientes hoy.
4. **¿Arthur produce Lucía o produce el kit de venta por rubro?** Lucía: marca a largo plazo.
   Kit (`C2`): material que se usa en la primera conversación de venta.
5. **¿El primer spec ad se hace con un producto de Bolivian Electric o de un prospecto real?**
   BE: control total, sin permiso de nadie. Prospecto: es prueba de venta, pero hay que elegirlo.

---

## Qué haría yo primero

**Arreglar el chatbot (`D1`), antes que cualquier cosa de contenido.**

El razonamiento: todo el frente de marketing —Lucía, carruseles, el CTA a DM, el kit de venta—
termina en una conversación. Ese canal está mudo hace 6 días y nadie lo notó. Publicar los 6
posts de Lucía con el canal caído es traer gente a una puerta cerrada.

Después, en este orden: crear la cuenta de Lucía (desbloquea 6 piezas terminadas) → descargar
las 12 de Higgsfield (recuperar lo pagado) → `C4`, la ruta al primer cliente.

**Lo que NO haría:** producir una pieza más de Lucía hasta que la cuenta exista. El inventario
sin publicar ya es suficiente.
