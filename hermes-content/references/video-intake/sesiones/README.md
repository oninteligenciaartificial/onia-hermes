# Un archivo por sesión — la raíz que se pega en cada una

Todo lo que salió del análisis de reels, **repartido por sesión**. Cada archivo es
autocontenido: trae el preámbulo, los tres gates y **todos** los prompts de esa sesión, viejos
y nuevos, en el orden en que conviene hacerlos. **No hace falta abrir otro archivo.**

Los dos archivos de origen siguen existiendo y son la fuente:
[PROMPTS_POR_SESION.md](../PROMPTS_POR_SESION.md) (26 videos, hasta el 15-ago) y
[PROMPTS_LOTE_2026-08-16.md](../PROMPTS_LOTE_2026-08-16.md) (E1–E11) y [PROMPTS_LOTE_2026-08-17.md](../PROMPTS_LOTE_2026-08-17.md) (F1–F3) y [PROMPTS_LOTE_2026-08-18.md](../PROMPTS_LOTE_2026-08-18.md) (G1–G6) y [PROMPTS_LOTE_2026-08-19.md](../PROMPTS_LOTE_2026-08-19.md) (H1–H3, I1–I2) y [PROMPTS_LOTE_2026-08-20.md](../PROMPTS_LOTE_2026-08-20.md) (J1–J4). Acá no hay nada nuevo:
está lo mismo, cortado por sesión. **Si cambia una regla, se edita el origen, no la copia.**

---

## PRODUCTO — construye el software

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [onia-plattform.md](onia-plattform.md) | `onia-plattform` | **J4 los 6 tiers apagados** · **I1 onboarding de cliente** · **F2 evals** · E1 molde de rubro · E3 las 9 features de gastronomía · agente de producto · visión por computadora | **J4** — es un defecto EN PRODUCCIÓN, no una idea. Después I1, que ataca un costo semanal. Después E1 → E3. **F2 espera a F1** (corre en `pendiente`) |
| [chatbot.md](chatbot.md) | `chatbot` | **D1 el bot no guarda hace días** · E2 corte YMYL · minimización de datos | **D1** — está roto ahora mismo |
| [carrito-de-compra.md](carrito-de-compra.md) | `Carrito de compra` | carrito flotante | — |
| [estructura-de-pagos.md](estructura-de-pagos.md) | `Estructura de pagos` | checkout | el paso 1 de verificación puede matar la tarea |
| [importacion-de-productos.md](importacion-de-productos.md) | `Importación de productos` | portar dropzone y upload al flujo real | — |

## WEB

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [web-factory.md](web-factory.md) | `web-factory` | **J1 DESIGN.md por cliente** · **J2 bucle de práctica** · **I2 lista de requerimientos del cliente** · **G4 escalera de popups** · **G5 scroll GSAP** · C1 indexabilidad · B1 packages/blocks · B2 generar desde learned model · capa de 5 skills visuales | **G4** (convierte) → **C1** → **B1 antes que B2** (sin bloques, generar no produce nada) |

## MARKETING — vende lo construido

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [marketing.md](marketing.md) | marketing | **G3 el cliente real con la pantalla sustituida** · A1 portafolio · E7 demo de 17 s · D4 espiar la pauta · C2 kit por rubro · A2 comentario→DM · A3 carruseles · A5 Meta Ads · A6 patrones como contenido · E11 demo en una toma | **G3** — la prueba de venta que ningún demo consigue; después A1 |
| [influencers-ia.md](influencers-ia.md) | `INFLUENCERS IA` | **H2 primer ad_reference** · **G1 las dos plantillas + Marketing Studio** · **G6 foto realista** · E9 los 5 bloques del prompt + 3D estilizado · E6 la etiqueta de IA · A4 escenas · guion por escenas · los 12 puntos de Higgsfield | **G1** — separa cine de UGC antes de escribir nada |
| [editor-de-videos.md](editor-de-videos.md) | `editor de videos` | **J3 anuncio sin cara ni voz** · **H3 molde de 6 actos** · **G2 molde UGC de anuncio** · E8 slate/cara con HyperFrames · E10 formato gemelo · animar interfaz | cualquiera: los dos cuestan **cero créditos** |

## VENTA Y ADMINISTRACIÓN

| Archivo | Sesión | Qué lleva | Primero |
|---|---|---|---|
| [crm-prospeccion.md](crm-prospeccion.md) | CRM / prospección | **C4 la ruta al primer cliente** · los 7 roles contra el Vendedor que ya corre | **C4** — es lo único que ataca la falta de clientes |
| [propuestas.md](propuestas.md) | `propuestas` | C3 el costo de esperar | — |
| [pendiente.md](pendiente.md) | `pendiente` | **H1 análisis por escenas al intake** · **F1 auditar los 11 agentes** · **F3 partir CLAUDE.md** · E4 el loop de 3 roles (corregido) · D2 fechas que corren · D3 búsqueda de marca · B3 intake de video · B4 probar los 6 patrones · E5 Strix | **F1** — antes de construir agentes nuevos, ver cuáles sobran |

---

## ¿Cuáles ya se usaron?

**[ESTADO_DE_LOS_PROMPTS.md](../ESTADO_DE_LOS_PROMPTS.md)** — verificado contra el repo el
2026-08-20, prompt por prompt: 23 ejecutados, 12 parciales, 3 bloqueados y **22 sin usar**.
Ojo: este worktree está atrasado respecto de `origin/main`, así que antes de encolar algo
hay que mirar `main`, no el checkout local.

---

## El orden entre sesiones, si hay que elegir

1. **`chatbot` → D1** y **`onia-plattform` → J4.** Los dos únicos defectos en producción:
   el bot no guarda mensajes, y hay 6 tiers definidos con cero callers mientras la landing
   usa un campo de texto libre para el mismo dato.
2. **`onia-plattform` → I1.** El onboarding de cliente: deja de perseguirse documentos y
   credenciales por WhatsApp. Paso 1 del prompt puede convertirlo en "encender", no "construir".
3. **CRM → C4.** Es lo único que ataca la falta de clientes.
4. **`pendiente` → F1.** Auditar los agentes que ya existen contra los tres antipatrones de Anthropic: 28× menos tokens salió de SACAR agentes, no de agregarlos. Recién después, E4 corregido.
5. **`web-factory` → C1.** Nuestra web no indexa y auditamos la ajena.
6. **marketing → G3.** Filmar al cliente real y sustituir solo la pantalla: la comparación
   que ningún demo grabado consigue. Bloqueado hasta que haya un cliente con el sistema andando.
7. **marketing → A1.** Portafolio: costo cero, sube el precio.

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
| **G3** video_edit del cliente | créditos, **se factura por la duración del video FUENTE** | el prompt exige filmar 5-8 s y estimar antes |
| **G2** anuncio UGC | créditos por generación | entrega prompt + costo, **no genera** |
| **G6** foto realista | imagen = barato y permitido | avisar si son muchas |
