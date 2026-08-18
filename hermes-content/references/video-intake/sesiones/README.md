# Un archivo por sesión — la raíz que se pega en cada una

Todo lo que salió del análisis de reels, **repartido por sesión**. Cada archivo es
autocontenido: trae el preámbulo, los tres gates y **todos** los prompts de esa sesión, viejos
y nuevos, en el orden en que conviene hacerlos. **No hace falta abrir otro archivo.**

Los dos archivos de origen siguen existiendo y son la fuente:
[PROMPTS_POR_SESION.md](../PROMPTS_POR_SESION.md) (26 videos, hasta el 15-ago) y
[PROMPTS_LOTE_2026-08-16.md](../PROMPTS_LOTE_2026-08-16.md) (E1–E11) y [PROMPTS_LOTE_2026-08-17.md](../PROMPTS_LOTE_2026-08-17.md) (F1–F3). Acá no hay nada nuevo:
está lo mismo, cortado por sesión. **Si cambia una regla, se edita el origen, no la copia.**

---

## PRODUCTO — construye el software

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [onia-plattform.md](onia-plattform.md) | `onia-plattform` | **F2 evals** · E1 molde de rubro · E3 las 9 features de gastronomía · agente de producto · visión por computadora | **E1** de los de producto — define el molde contra el que se mide E3. **F2 espera a F1** (corre en `pendiente`) |
| [chatbot.md](chatbot.md) | `chatbot` | **D1 el bot no guarda hace días** · E2 corte YMYL · minimización de datos | **D1** — está roto ahora mismo |
| [carrito-de-compra.md](carrito-de-compra.md) | `Carrito de compra` | carrito flotante | — |
| [estructura-de-pagos.md](estructura-de-pagos.md) | `Estructura de pagos` | checkout | el paso 1 de verificación puede matar la tarea |
| [importacion-de-productos.md](importacion-de-productos.md) | `Importación de productos` | portar dropzone y upload al flujo real | — |

## WEB

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [web-factory.md](web-factory.md) | `web-factory` | C1 indexabilidad · B1 packages/blocks · B2 generar desde learned model · capa de 5 skills visuales | **C1**, y **B1 antes que B2** (sin bloques, generar no produce nada) |

## MARKETING — vende lo construido

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [marketing.md](marketing.md) | marketing (Arthur) | A1 portafolio · E7 demo de 17 s · D4 espiar la pauta · C2 kit por rubro · A2 comentario→DM · A3 carruseles · A5 Meta Ads · A6 patrones como contenido · E11 demo en una toma | **A1** — es la que toca la caja más rápido |
| [influencers-ia.md](influencers-ia.md) | `INFLUENCERS IA` | E9 los 5 bloques del prompt + 3D estilizado · E6 la etiqueta de IA · A4 escenas · guion por escenas · los 12 puntos de Higgsfield | **E9** — es el que produce |
| [editor-de-videos.md](editor-de-videos.md) | `editor de videos` | E8 slate/cara con HyperFrames · E10 formato gemelo · animar interfaz | cualquiera: los dos cuestan **cero créditos** |

## VENTA Y ADMINISTRACIÓN

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [crm-prospeccion.md](crm-prospeccion.md) | CRM / prospección | **C4 la ruta al primer cliente** · los 7 roles contra el Vendedor que ya corre | **C4** — es lo único que ataca la falta de clientes |
| [propuestas.md](propuestas.md) | `propuestas` | C3 el costo de esperar | — |
| [pendiente.md](pendiente.md) | `pendiente` | **F1 auditar los 11 agentes** · **F3 partir CLAUDE.md** · E4 el loop de 3 roles (corregido) · D2 fechas que corren · D3 búsqueda de marca · B3 intake de video · B4 probar los 6 patrones · E5 Strix | **F1** — antes de construir agentes nuevos, ver cuáles sobran |

---

## El orden entre sesiones, si hay que elegir

1. **`chatbot` → D1.** Es lo único roto ahora mismo.
2. **CRM → C4.** Es lo único que ataca la falta de clientes.
3. **`pendiente` → F1.** Auditar los agentes que ya existen contra los tres antipatrones de Anthropic: 28× menos tokens salió de SACAR agentes, no de agregarlos. Recién después, E4 corregido.
4. **`web-factory` → C1.** Nuestra web no indexa y auditamos la ajena.
5. **marketing → A1.** Portafolio: costo cero, sube el precio.

## Los dos choques a cuidar

- **D1 y B3** son los dos de infra. No mandarlos juntos.
- **E9 y E6** son la misma sesión y el mismo tema. Van seguidos, no en paralelo.

## Lo que gatea gasto — no se ejecuta sin decir que sí

| Prompt | Qué gasta | Estado |
|---|---|---|
| **E5** Strix | consumo de LLM, necesita API key propia (las del `.env` están inválidas) | el prompt exige estimar y **parar** hasta aprobación |
| **E9** video con IA | créditos por generación; `unlim` no está disponible hoy | el prompt entrega el prompt listo, **no genera** |
| **A5** Meta Ads | pauta | deja todo listo **sin encender nada** |
| **D3** búsqueda de marca | Bs 75 | decisión de Sergio |
