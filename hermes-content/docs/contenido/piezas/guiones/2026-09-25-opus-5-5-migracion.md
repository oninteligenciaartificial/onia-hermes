# Tema · Migrar a Claude Opus 5.5 sin que se rompa tu código

> Tanda escrita con [`../../SISTEMA_DE_GUIONES.md`](../../SISTEMA_DE_GUIONES.md): un tema, todas
> las plataformas, cada frase con su prueba real.
>
> **Reemplaza el enfoque del guion 8 de Codex del 22-sep** (rama `codex/marca-comunidad-plan`,
> sin integrar). Sus números coincidían con la página oficial, pero:
> - el gancho "salió hoy" venció a las 48 h, según la propia regla del carril;
> - presentaba el "40 % menos" sin su letra chica.
>
> Acá el tema deja de ser noticia y pasa a ser **tutorial**: lo que te rompe el código y cómo se
> arregla. Eso sigue sirviendo mientras la guía oficial diga lo mismo.

| Campo | Valor |
|---|---|
| **Audiencia** | marca personal: jóvenes y aficionados a la IA que construyen con la API o con Claude Code |
| **Enseña (el tema)** | quien migra sabe qué 4 configuraciones rechaza Opus 5.5, por qué el "40 % más barato" depende del effort y qué comando hace la migración |
| **Fuentes** | [anuncio oficial](https://www.anthropic.com/claude-opus-5-5) · [guía oficial de migración](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) — las dos **verificadas el 2026-09-25** con captura y manifiesto |
| **Vence** | re-verificar las dos páginas si se graba después del **2026-10-02** (más de 7 días) |
| **Capturas** | `hermes-content/captures/2026-09-25-opus-5-5/`: 9 tomas reales, cada una con el texto que el guion afirma, verificado en la página (`manifest.json`) |
| **Palabra de CTA** | ninguna: hoy las palabras no disparan nada ([`../../PUBLICACION.md`](../../PUBLICACION.md)). Los cortos cierran con "guardalo"; el checklist va a la comunidad |

## Estado de las piezas

| ID | Pieza | Estado | Siguiente paso · de quién |
|---|---|---|---|
| C1 | Corto · "4 cosas que te devuelven error 400 en Opus 5.5" | **verificado · capturas** | grabar la cámara: **Sergio Urcullo** |
| C2 | Corto · "El 40 % más barato tiene letra chica" | **verificado · capturas** | grabar la cámara: **Sergio Urcullo** |
| C3 | Corto · "Fast mode: 2,5× más rápido al doble de precio" | **verificado · capturas** | grabar la cámara: **Sergio Urcullo** |
| YT | YouTube (8-10 min) · "Migré un script a Opus 5.5: los 400 reales y el comando que los arregla" | **guion** | grabar la demo real en su PC (necesita su clave de API): **Sergio Urcullo** |
| CAR | Carrusel 8 láminas · checklist con capturas reales | **renderizado** | mirarlo y aprobar: **Sergio Urcullo** |
| LI | Post de LinkedIn | **verificado** | publicar: **Sergio Urcullo** |
| D1-D3 | Drops de comunidad + checklist descargable | **verificado** | pegar en Announcements: **Sergio Urcullo** |

---

## C1 · Corto 9:16 · "4 cosas que te devuelven error 400 en Opus 5.5"

- **ENSEÑA:** al terminar, quien lo vio puede revisar su código y sacar las 4 configuraciones que
  Opus 5.5 rechaza (thinking desactivado, `tool_choice` forzado, `temperature`/`top_p`/`top_k` y el
  prefill), o correr `/claude-api migrate`.
- **PRUEBA:** `M0-migracion-400`, `M1-migracion-cinco-reglas` (fotos 1, 3, 4, 5),
  `V1-vertical-cinco-reglas` (la misma guía en formato teléfono), `M3-…` (los mensajes de error
  literales) y `M2-migracion-comando`.
- **CTA:** "Guardalo para cuando migres" (sin recurso prometido).
- **LAYOUT:** B, partido. El apoyo va arriba y sale de las fotos M1/M3 recortadas al cuadrado del
  recuadro verde, o de V1 a pantalla completa.
- **EDICIÓN:** completa · **DURACIÓN:** ~42 s · **PALABRAS:** ~140.

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO | ZOOM / SFX | NOTA |
|---|---|---|---|---|---|---|---|
| 1 | 0-3 | «Si pasás tu código a Opus 5.5 sin tocar nada, te puede devolver error 400.» | — | CAM, gancho sin corte | `ERROR 400` | punch 1.00→1.08 · impact | guía: *"Where an item says a setting is rejected, the API returns a 400 error"* (M0) |
| 2 | 3-9 | «Uno: el thinking ya no se puede apagar. Si mandás thinking disabled, lo rechaza.» | «thinking» | M1 foto `1-thinking` → M3 foto `error-thinking` | `THINKING` | whoosh + pop | error literal: `"thinking.type.disabled" is not supported for this model.` |
| 3 | 9-15 | «Dos: no podés obligarlo a usar una herramienta. tool_choice en any o en tool: rechazado.» | «herramienta» | M1 foto `3-tool-choice` → M3 foto `error-tool-choice` | `TOOL_CHOICE` | whoosh + pop | error literal en M3 |
| 4 | 15-21 | «Tres: temperature, top_p y top_k. Cualquier valor que no sea el de fábrica: rechazado.» | «temperature» | M1 foto `4-sampling` | `TEMPERATURE` | whoosh + pop | "any other value is rejected" |
| 5 | 21-27 | «Cuatro: si terminabas los mensajes con una respuesta del asistente ya escrita, también.» | «asistente» | M1 foto `5-prefill` | `PREFILL` | whoosh + pop | "Don't end messages with a prefilled assistant turn: it is rejected" |
| 6 | 27-37 | «Lo más rápido: en Claude Code escribí barra claude-api migrate. Cambia el modelo, corrige esos parámetros y te deja la lista de lo que tenés que revisar a mano.» | «claude-api» | M2 foto `comando` (el recuadro sobre el comando) | `/claude-api migrate` | crash zoom al comando | la guía dice que **pregunta el alcance antes de editar** y que deja un checklist. No prometer que "lo hace todo" |
| 7 | 37-42 | «Guardalo para cuando migres.» | «Guardalo» | CTA: fondo desenfocado + texto centrado | `GUARDALO` | swish | sin palabra clave |

- **CÁMARA:** plano de cabeza y hombros al centro vertical (layout B). Gancho y CTA dos veces.
- **GLOSARIO:** "thinking" → `thinking` · "tool choice" → `tool_choice` · "top pe" → `top_p` ·
  "top ka" → `top_k` · "claude api migrate" → `/claude-api migrate`.
- **[EDICIÓN]:** beats 2-5, rótulo fijo arriba a la izquierda "según la guía oficial de
  Anthropic". Beat 6, el comando en tipografía monoespaciada, nunca reescrito a mano.

## C2 · Corto 9:16 · "El 40 % más barato de Opus 5.5 tiene letra chica"

- **ENSEÑA:** al terminar, quien lo vio sabe que el precio por token bajó 20 % (US$4 / US$20 por
  millón), que el "40 % menos" es **con la configuración por defecto** y que ese default de
  effort bajó de `high` a `medium`. Si su código fija `high`, tiene que medir su costo en vez de
  asumir el 40 %.
- **PRUEBA:** `A2-anuncio-costo` (fotos `40-por-ciento`, `4-y-20`, `cache`) y
  `M3-migracion-effort-y-errores` (foto `effort-explicito`).
- **CTA:** "Guardalo". **LAYOUT:** B. **DURACIÓN:** ~35 s.

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO | NOTA |
|---|---|---|---|---|---|---|
| 1 | 0-3 | «Anthropic dice que Opus 5.5 cuesta cuarenta por ciento menos. Tiene letra chica.» | — | CAM | `−40%?` | rótulo: "según Anthropic" |
| 2 | 3-9 | «El precio por token bajó veinte por ciento: cuatro dólares el millón de entrada, veinte el de salida.» | «precio» | A2 foto `4-y-20` | `$4 / $20` | "20% less than Opus 5" |
| 3 | 9-14 | «El caché, que es la mayor parte del costo cuando programás con agentes, bajó sesenta.» | «caché» | A2 foto `cache` | `CACHÉ −60%` | la página: *"which make up the majority of agentic and coding work costs"* |
| 4 | 14-24 | «Pero el cuarenta es "con la configuración por defecto". Y el effort por defecto bajó: en Opus 5 era high, ahora es medium.» | «defecto» | A2 foto `40-por-ciento` → M3 foto `effort-explicito` | `DEFAULT = MEDIUM` | "at default settings…"; "the default is medium, where Claude Opus 5's is high" |
| 5 | 24-32 | «Si tu código fija effort en high, no esperes el cuarenta. Medilo con tus propias tareas antes de cambiar.» | «Medilo» | CAM | `MEDILO` | conclusión propia, marcada como tal: no la dice Anthropic |
| 6 | 32-35 | «Guardalo.» | — | CTA | `GUARDALO` | — |

## C3 · Corto 9:16 · "Fast mode: 2,5× más rápido, al doble de precio"

- **ENSEÑA:** al terminar, quien lo vio sabe que el fast mode de Opus 5.5 da hasta 2,5× de
  velocidad a US$8 / US$40 por millón (el doble del precio normal), y tiene un criterio para
  usarlo: cuando esperar te cuesta más que los tokens, como una demo en vivo o iterar una
  interfaz, y no para trabajos que corren solos.
- **PRUEBA:** `A3-anuncio-fast-mode` (foto `fast-mode`) y `A2` foto `4-y-20` para comparar.
- **CTA:** "Seguime para el próximo". **LAYOUT:** B. **DURACIÓN:** ~30 s.

| # | t | HABLA (literal) | CUE | EN PANTALLA | TEXTO | NOTA |
|---|---|---|---|---|---|---|
| 1 | 0-3 | «Opus 5.5 tiene un modo que responde hasta dos veces y media más rápido. Pero te cobra el doble.» | — | CAM | `2,5× · $$` | — |
| 2 | 3-10 | «Fast mode: ocho dólares el millón de entrada y cuarenta el de salida. El normal es cuatro y veinte.» | «Fast» | A3 foto `fast-mode` → A2 foto `4-y-20` | `$8 / $40` | textual de la página |
| 3 | 10-22 | «Usalo cuando esperar te cuesta más que los tokens: una demo en vivo o cuando estás iterando una pantalla. Para un trabajo que corre solo de noche, no tiene sentido.» | «esperar» | CAM (+ B-roll de Sergio Urcullo programando) | `¿TE CUESTA ESPERAR?` | criterio propio, marcado como tal |
| 4 | 22-30 | «Está en Claude Code y en la plataforma. Seguime para el próximo.» | «Claude Code» | A3 (la frase marcada) | `CLAUDE CODE` | "available in Claude Code and the Claude Platform" |

## YT · YouTube 16:9 (8-10 min) · "Migré un script a Opus 5.5: los 400 reales y el comando que los arregla"

- **ENSEÑA:** al terminar, quien lo vio puede migrar su propio proyecto: sabe qué va a fallar,
  cómo se ve el error de verdad y qué hace `/claude-api migrate`.
- **PRUEBA:** una demo **real** grabada en la PC de Sergio Urcullo, más las capturas oficiales como
  apoyo. **No se reconstruye nada:** los errores que se muestran son los que devuelva la API
  en la grabación.
- **Por qué no la graba esta sesión:** en el repo no hay código propio que llame a la API de
  Claude (verificado con grep el 2026-09-25) y la demo necesita la clave de API de Sergio
  Urcullo. Ningún agente usa credenciales ajenas.

**Qué grabar (en orden, con cámara en archivo aparte):**

1. **Un script chico con la configuración vieja.** Un archivo que llame a `claude-opus-5` con
   `thinking: {"type": "disabled"}`, `temperature: 0.2` y `tool_choice` forzado. Datos de prueba.
   Se puede pedir a Claude Code en vivo, lo que además es contenido.
2. **Cambiar sólo el modelo** a `claude-opus-5-5` y correrlo. Grabar el **400 real** en la
   terminal. Se muestra el mensaje exacto que devuelva, que debería coincidir con la guía (M3).
3. **Abrir Claude Code y correr** `/claude-api migrate this project to claude-opus-5-5`. Grabar
   cuando pregunta el alcance y el diff que propone.
4. **Correr de nuevo:** funciona. Mostrar la respuesta, que ahora empieza con bloques de
   thinking (la guía lo explica).
5. **Cerrar con el effort:** probar la misma tarea en `medium` y en `high` y mostrar los tokens de
   salida de cada una. Es la prueba propia del corto C2, con los números de esa corrida y sin
   extrapolar.

**Estructura del video:**

| Bloque | Qué va |
|---|---|
| 0:00-0:30 | resultado primero: el 400 en pantalla y "en 8 minutos lo arreglamos" |
| 0:30-1:30 | qué cambió en Opus 5.5 (A2, A3, A4) |
| 1:30-6:00 | la demo: pasos 1 a 4 |
| 6:00-8:00 | el effort: paso 5, con los números propios |
| 8:00-9:00 | qué salió mal grabando, el checklist y la comunidad |

- **Capítulos:** los mismos bloques.
- **Título tentativo:** "Migré a Opus 5.5 y me devolvió 400: lo que cambia y el comando que lo
  arregla".

## CAR · Carrusel 1080×1350 · "Pasar a Opus 5.5 sin errores 400"

- **Brief:** `hermes-content/carousels/briefs/marca-personal/sergio-opus-5-5-errores-400-20260925.json`
  (motor oficial `scripts/carousel_render.js`, pack `community-editorial`).
- **Salida:** `hermes-content/carousels/out/sergio-opus-5-5-errores-400-20260925/`.
- **ENSEÑA:** el checklist de migración, con las 4 configuraciones rechazadas, el effort y el
  comando.
- **PRUEBA:** 6 de las 8 láminas llevan una captura real de la guía oficial, tomada en viewport de teléfono y recortada a la frase marcada (`hermes-content/captures/2026-09-25-opus-5-5/carrusel/`). Mirado lámina por lámina el 2026-09-25.

## LI · Post de LinkedIn (listo para pegar)

> Adjuntar la captura `A2-anuncio-costo-4-y-20.png`, o el carrusel en PDF.

```
Opus 5.5 cuesta 20 % menos por token. El "40 % más barato" que anunció Anthropic tiene una condición que conviene leer antes de migrar.

Lo medí contra la documentación oficial, porque en Onia usamos Claude todos los días:

1. El precio por millón de tokens bajó de 5/25 a 4/20 dólares. El caché bajó 60 %, y en trabajo con agentes es la mayor parte del costo.
2. El 40 % es "con la configuración por defecto". El effort por defecto pasó de high a medium: si tu integración fija high, tu ahorro va a ser otro. Hay que medirlo con tus tareas.
3. Cuatro configuraciones que antes funcionaban ahora devuelven error 400: desactivar el thinking, forzar una herramienta con tool_choice, cambiar temperature/top_p/top_k y el prefill del asistente.

La guía oficial trae un comando para Claude Code que hace la migración y deja la lista de lo que hay que revisar a mano: /claude-api migrate.

Si tu empresa tiene algo en producción con Claude, lo primero no es cambiar el modelo: es fijar el effort y medir.
```

## D1-D3 · Drops de comunidad (listos para pegar en Announcements)

> ⚠️ **No van a `cola/drops/<fecha>.md` hasta que Sergio Urcullo lo decida.** El recordatorio del
> VPS lee esa carpeta por fecha, y el plan de Codex del 22-28 sep (sin integrar) puede estar
> corriendo en el grupo. Estos van **después** de lo que ya se esté enviando.

**D1 · el checklist (archivo exclusivo)** — adjuntar
`hermes-content/recursos/opus-5-5-migracion/checklist-opus-5-5.pdf`:

```
🔧 Si usás Claude por API o en Claude Code, esto es para vos.

Opus 5.5 rechaza 4 configuraciones que antes andaban: si migrás sin sacarlas, error 400.
Te dejo el checklist completo que armé con la guía oficial: qué sacar, qué fijar, y el comando que lo migra solo.

Esto no lo subo a redes: es de acá.

¿Quién ya migró algo? Contá qué se les rompió 👇
```

**D2 · el pedido mínimo que pasa todo** (el ejemplo oficial, copiado tal cual de la guía):

```
📋 El pedido más chico que Opus 5.5 acepta sin errores, según la guía oficial: effort fijado y sin campo thinking.

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures",
        }
    ],
    output_config={"effort": "medium"},
)

Tres cosas que NO van: thinking disabled · tool_choice any/tool · temperature/top_p/top_k.
Ojo: la respuesta ahora trae bloques de thinking primero; leé el texto por tipo de bloque.

Reto de 10 min: buscá en tu proyecto "temperature" y "tool_choice". ¿Cuántos encontraste?
```

> **Verificado el 2026-09-25** contra la guía oficial (sección "What every request to Claude
> Opus 5.5 must satisfy", pestaña Python). Si pasó más de una semana, re-verificar antes de pegar.

**D3 · el cierre**:

```
🎙 Cierre de la semana: si tu código fija effort en high, el "40 % más barato" no es tu número. Medilo con tus tareas: misma consulta en medium y en high, y compará los tokens de salida.

¿Quieren que el próximo video sea la migración grabada de punta a punta? Respondan SÍ.
```

## Historias (3)

1. **Encuesta:** "¿Ya usás Opus 5.5?" Sí · No · ¿Qué es eso?
2. **Captura** de la guía (M1, foto `1-thinking`) con el texto "esto te rompe el código".
3. **Pregunta abierta:** "¿Qué se te rompió al migrar?"
