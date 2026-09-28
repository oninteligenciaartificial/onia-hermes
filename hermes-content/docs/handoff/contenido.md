# Handoff: carril contenido → Codex (2026-09-27)

> Rama `claude/onia-content-scripts-cvat9r` · PR #40 (borrador, mergea limpio contra `main` a las
> 20:08 UTC del 27-sep) · índice del carril: [`../ONIA_CIRCUITO_DE_CONTENIDO.md`](../ONIA_CIRCUITO_DE_CONTENIDO.md).
> Se pasa a Codex porque a la sesión de Claude le quedan pocos tokens (pedido de Sergio Urcullo, 27-sep).

## 0. Lo que pidió Sergio Urcullo el 27-sep (el encargo para Codex)

*«Quiero que diseñes y lancemos campañas en Meta y ordenes ya el contenido y demás… todo lo que es la
marca personal: contenido, guiones, posts, carruseles. Hay que grabar todo lo de la semana.»*

Orden de trabajo recomendado (cada punto tiene su sección abajo):
1. **Publicar la Bóveda** (autorizado, con verificación previa) → §3.
2. **Guiones de la semana 28-sep → 4-oct** en el molde del día modelo, para que Sergio grabe en dos
   sesiones → §5.
3. **Campaña de Meta para @oniahq**: diseñarla y dejarla en PAUSA hasta que Sergio apruebe monto y
   creatividades → §6.
4. **Ordenar los docs**: mergear el PR #40 (con OK de Sergio) y hacer la Fase 1 → §7.

## 1. Decisiones de Sergio Urcullo del 27-sep (registradas acá y en el índice §7)

| # | Pregunta | Respuesta | Qué implica |
|---|---|---|---|
| 1 | ¿Publicar la Bóveda? | **Sí, verificando que toda la información esté correcta** | §3 |
| 2 | Carrusel 100 % IA: ¿híbrido o píxel? | Pidió que se lo expliquen → explicado en §4; **la elección sigue pendiente** | no se generan imágenes pagas hasta que elija |
| 3 | Lucía: ¿sigue congelada? | **«No, usémosla para contenido de ONIA»** | bloqueada por consentimiento: ver §4.2 |
| 4 | `cuaderno-02.png`: ¿IA o foto? | **IA** | se declara IA en el caption; `references/marca-personal-sergio/fondos/PROCEDENCIA.md` |

## 2. Qué quedó EN PRODUCCIÓN

**Nada nuevo.** Ninguna pieza publicada ni desplegada desde esta sesión. El PR #40 no está mergeado.
Producción del sitio personal = commit `7412814` del repo `oninteligenciaartificial/sergiourcullo`
(último deploy ~19-sep): `/stack`, `/homelab`, `/vps`, `/claude-code` dan 200; `/boveda`,
`/automatizar`, `/agentes` y `/mcp` dan **404**.

## 3. La Bóveda: cómo se publica

- **Qué cambia:** páginas nuevas `boveda/`, `automatizar/`, `agentes/`, `mcp/` + `index.html`
  (portada: dice «VPS alquilado», ya no «la única que pago») + `estilo.css` (`.paso-num` vuelve a la
  regla original; las 4 guías publicadas quedaron idénticas píxel a píxel). **`README.md` NO se sube.**
- **Fuente:** `hermes-content/sitio-sergiourcullo/` de esta rama.
- **Cómo se despliega (verificado):** el proyecto Vercel `sergiourcullo` está conectado por git al
  repo `oninteligenciaartificial/sergiourcullo` (rama `main`). Push a ese repo = deploy a producción.
  El README del sitio dice «deploy manual por MCP»: eso quedó viejo, el último deploy salió del
  commit `7412814` del repo.
  ```bash
  git clone https://github.com/oninteligenciaartificial/sergiourcullo /tmp/sergiourcullo
  cd /tmp/sergiourcullo
  SRC=<onia-hermes>/hermes-content/sitio-sergiourcullo
  cp -r $SRC/boveda $SRC/automatizar $SRC/agentes $SRC/mcp .
  cp $SRC/index.html $SRC/estilo.css .
  git add -A && git commit -m "feat: la Bóveda — /boveda, /automatizar, /agentes, /mcp" && git push
  ```
- **Verificación antes de subir:** la lanzó esta sesión el 27-sep (subagente). Resultado en §3.1.
  Sin ese veredicto, **no se publica**: hay que re-verificar cada afirmación, comando y link,
  y mirar las 5 páginas renderizadas a 390 y 1280 px.
- **Después de subir:** medir las 4 rutas nuevas (el proxy del contenedor da 403 para
  `sergiourcullo.vercel.app`; se mide con `web_fetch_vercel_url` del MCP de Vercel o desde otra red)
  y actualizar la tabla de `contenido/PUBLICACION.md` §2: `MAPA`, `ARQUITECTURA` y `MCP` pasan a ✅,
  y se suma `BÓVEDA` → `/boveda`.

### 3.1 Resultado de la verificación

**Veredicto (27-sep): no se publica tal cual.** Reporte completo con los reemplazos exactos:
[`../historial/contenido/VERIF_BOVEDA_20260927.md`](../historial/contenido/VERIF_BOVEDA_20260927.md).

- **B1 — decide Sergio Urcullo:** el hero de la portada dice «6 herramientas en producción · 5 gratis ·
  $200 al mes todo el stack», y `/vps` dice «Bs 220 al mes» más la llave de Hermes que se paga por uso.
  Hay reemplazo por defecto en el reporte; «6 en producción» sólo lo puede confirmar él.
- **C5 — decide Sergio Urcullo:** «los archivos salen primero en la comunidad» no tiene respaldo (no hay
  drops desde el 20-sep). Si no los mandó, va el reemplazo del reporte.
- **C1–C4, C6, C7:** correcciones sin decisión, con texto listo (tiempos de lectura, comando de `/mcp`
  cortado en el teléfono, permisos en `/permissions`, el Webhook de n8n que responde «Immediately»,
  «cada pieza termina en un recurso», contraste del `IF` en modo oscuro). C2 y C4 probados a 390 px.
- **Bien:** 0 links internos rotos, 0 scroll horizontal, nombres de nodos de n8n 2.40 y comandos de
  Claude Code 2.1.283 confirmados, y las guías ya publicadas quedan idénticas.

**Receta:** aplicar C1–C4, C6 y C7 en `hermes-content/sitio-sergiourcullo/` → Sergio contesta B1 y
C5 → mirar las 5 páginas a 390 px → push al repo del sitio (arriba) → medir en producción.

## 4. Lo que hay que saber para decidir

### 4.1 Carrusel 100 % IA — los dos métodos (pregunta 2)

| | **Híbrido** (recomendado) | **Píxel** (Santiago Muñoz) |
|---|---|---|
| Qué hace la IA | la ilustración de fondo, **sin letras ni personas** | la lámina entera, **texto incluido** (Nano Banana Pro) |
| Quién pone el texto | nuestro motor (`carousel_pack_editorial.js`): tildes, ñ y números salen exactos | la IA: puede escribir mal una letra; se revisa **letra por letra** |
| Costo | centavos por imagen · US$0,12–0,77 por carrusel | ~US$0,10 por imagen · ~US$0,70 por 7 láminas |
| Riesgo | bajo | texto roto o inventado, pantallas falsas |

Reglas comunes: nada de prueba fabricada (la pantalla de ONIA siempre es captura real); cada lote se
aprueba con su costo; se declara IA en el caption. **Limitación técnica hoy:** el pack no tiene
tipo visual «ilustración»; `renderScreenshot` rotula toda imagen interior como «PRODUCTO REAL»,
así que la IA sólo puede ir en portada y cierre hasta agregar ese tipo (+ su test).
Fuente: `../research/ONIA_REFERENTES_POR_FORMATO_20260925.md` §2.8.

### 4.2 Lucía para contenido de ONIA (pregunta 3) — la respuesta honesta

Sergio Urcullo quiere usarla. **Hoy no se puede publicar a Lucía**, por una sola razón:
- su cara sale de frames del video de **una mujer real** y **no hay consentimiento documentado**
  (`../research/ONIA_LUCIA_Y_MARKETING_IA_20260925.md` §3). Publicarla expone a ONIA a un reclamo
  por uso de imagen.

Qué habilita la decisión:
- **Camino A — reconstruirla desde un canon 100 % sintético** (plan v4:
  `references/modelos/lucia/LUCIA-V4-PERFECTION-PLAN.md`, 0 créditos gastados). Es una cara nueva,
  sin fuente humana. Requiere aprobar un lote con costo, y el entrenamiento del Soul lleva
  aprobación específica (`CLAUDE.md`, Higgsfield).
- **Camino B — documentar el consentimiento** de la fuente. Improbable.

Cuando exista, entra como **presentador IA original de @oniahq**: explica y demuestra, se declara IA,
**nunca** se hace pasar por cliente, odontólogo ni testimonio (`CLAUDE.md`, «Publicidad que no
parezca hecha por IA»). No es una línea de negocio nueva: es publicidad propia (`MARCA_ONIA.md`).

## 5. La semana 28-sep → 4-oct: qué se graba

**Tema semanal: «Automatizar con criterio».** Cada día cierra con una palabra que lleva a una guía de
la Bóveda. Sólo se usa una palabra cuya página responde 200 el día de publicar
(`contenido/PUBLICACION.md` §2). Mezcla: ~50 % enseña · ~30 % vende enseñando · ~20 % conecta.
Estructura diaria: `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` (3 feed + 4 Trial + 3–5 Trial V2; mientras
@sergiourcullo tenga menos de 1.000 seguidores, Trial va a TikTok y Shorts).

| Día | Tema | Palabra → guía | Ya existe | Falta escribir |
|---|---|---|---|---|
| **Hoy dom 27** | cierre + seguimiento | — | carrusel IA Lab `carousels/out/sergio-comunidad-lab-santa-cruz-20260922-para-publicar.zip`; carrusel «3 partes» `carousels/out/sergio-seguimiento-3-partes-20260925/`; **E1 y C1** del día modelo | nada: E1 y C1 se graban (C1: Sergio confirma que las 3 reglas son suyas) |
| Lun 28 | Qué automatizar primero | `MAPA` → `/automatizar` | encuesta IA Lab (plan 23–27) | E/V/C del día |
| Mar 29 | El seguimiento que no molesta | — (V1: «14 días gratis») | V1 escrito; cortos 5–9 listados | cortos 5–9. **V1 y el 9 necesitan la org demo de Plataforma** con Recall proponiendo |
| Mié 30 | IF, modelo que clasifica, AI Agent o loop | `ARQUITECTURA` → `/agentes` | carrusel `sergio-agente-loop` (si no salió el 26); YouTube `carousels/out/yt-09-mcp-agentes-loops/GUION.md` | E/V/C |
| Jue 1 | MCP sin darle las llaves | `MCP` → `/mcp` | — | E/V/C |
| Vie 2 | n8n en una tarde | `N8N` → `/stack` paso 03 | tanda Opus 5.5 (`contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md`): C1–C3 + demo YouTube | E/V/C |
| Sáb 3 | Comunidad / IA Lab Santa Cruz | `SANTA CRUZ` (manual) | — | E/V/C |
| Dom 4 | La Bóveda + revisión semanal | `BÓVEDA` → `/boveda` | 5 guiones del domingo en `cola/PLAN-CONTENIDO-23-27-SEP-2026.md` | pasarlos al molde; elegir el tema de la semana siguiente |

**El molde** es `contenido/piezas/guiones/2026-09-25-dia-modelo-seguimiento-con-ia.md`: ficha
ENSEÑA/PRUEBA/AUDIENCIA/TRABAJO/FUENTES/CTA + tabla toma por toma con el texto literal. Plantilla y
reglas: `contenido/SISTEMA_DE_GUIONES.md`. Carruseles: `hermes-content/skills/carruseles-onia.md`
(render: `node scripts/carousel_render.js <brief>`; en Linux `CAROUSEL_BROWSER=…/headless_shell`).

**Para grabar todo en dos sesiones:** Codex escribe el lunes a la mañana los guiones de lun–jue;
Sergio graba el lunes a la tarde (~2 h: E/V/C de lun, mié y jue). Codex escribe vie–dom; Sergio graba
el miércoles (~2 h: vie, sáb, dom + Opus 5.5). V1 se graba el día que Plataforma entregue la org demo.

**Reglas que no se negocian:** cada pieza enseña algo concreto; pantalla real o no sale; datos de
ejemplo inventados se declaran; lo que Sergio dice de sí mismo lo confirma él; nada de «muy pronto»;
precios sólo de `onia-platform/lib/subscription-plans.ts` (planes) y `lib/pricing.ts` (add-ons). El
repo `onia-platform` quedó clonado en `/home/user/onia-platform` en esta sesión (efímero).

## 6. Campaña de Meta (@oniahq): diseño para dejar en PAUSA

- **Objetivo (Etapa 1):** conversaciones con clínicas de Santa Cruz de 2–6 profesionales con recepción
  (`ONIA_CLIENTE_IDEAL.md`). Dolor de entrada: el paciente con tratamiento a medias que no volvió.
- **Destino:** conversación por WhatsApp (Sergio califica con las 5 preguntas del cliente ideal) o
  alta de 14 días en `app.onia.com.bo/register` (verificar el día que siga abierta: `CLAUDE.md` §2).
- **Creatividades** (`CLAUDE.md` «Publicidad que no parezca hecha por IA» + `contenido/MARCA_ONIA.md`):
  dolor exacto → consecuencia en bolivianos («hacé la cuenta») → mecanismo comprobable (Recall con la
  cola de aprobación, **pantalla real**) → un solo CTA. Base: V1 del día modelo + carrusel «3 partes»
  adaptado a @oniahq. **Depende de la org demo de Plataforma.**
- **Mecánica:** el MCP de Meta Ads estaba conectado en la sesión de Claude (verificar si Codex lo
  tiene): cuentas (`ads_get_ad_accounts`) → páginas → datasets/píxel → crear campaña, conjunto y
  anuncio **en PAUSA** → Sergio los ve → recién ahí se activan.
- **Lo que decide Sergio Urcullo antes de gastar un boliviano:** presupuesto diario y total, duración,
  y las creatividades terminadas. No hay cifra aprobada.

## 7. Qué quedó a medias, y dónde

1. **PR #40** (borrador, 61 commits): integra las 4 ramas del carril, el sistema de guiones, las
   decisiones del 25-sep, la Bóveda corregida y el arreglo de citas (`d1318287`: la estrategia se cita
   por sección, no por línea). **Mergearlo lo decide Sergio.** No mergear `origin/main` dentro de la
   rama: el auto-sync haría fast-forward de `main`.
2. **Fase 1 del orden de docs:** 33 movimientos seguros en `historial/MAPA_DOCS_20260925.md` §4.3.
   Después del merge.
3. **Tanda Opus 5.5:** falta grabar C1–C3 y la demo de YouTube; agregar `identity` y `follow_cta` al
   brief del carrusel antes de re-renderizar.
4. **Guiones 3 y 4 del 21-sep** (AI Agent para clasificar): reescribir antes de grabar. Cinco guiones
   dicen «todo corre en una PC vieja de mi casa»: corregir.
5. **Pack de carruseles:** numera láminas y la regla 1 de `CAROUSEL_SYSTEM.md` dice «sin numeración».
   Falta el tipo visual «ilustración» para el carrusel híbrido.

## 8. Intentos fallidos (no repetir)

- **Clasificador de permisos:** denegó como «Production Deploy» el push al repo del sitio cuando no
  había autorización. Ahora sí la hay (27-sep), con verificación previa.
- **Captura colgada:** `page.evaluate(() => document.fonts.ready)` devuelve un `FontFaceSet` que no se
  serializa. Usar `.then(() => true)` y límite por fase.
- **Chromium y la CA del proxy:** `ERR_CERT_AUTHORITY_INVALID` → `certutil -A` de
  `/root/.ccr/agent-proxy-ca.crt` en `sql:/root/.pki/nssdb`. Nunca `ignoreHTTPSErrors`.
- **`pkill -f` y `grep | xargs kill` matan al propio shell** (exit 144). Matar por PID (`$!`).
- **`cmd && VAR=x && servidor &` manda toda la cadena a segundo plano** y escribió archivos en `/`.
- **Tres subagentes con `isolation: worktree` llenaron el disco** (5,9 GB cada uno).
- **Citas por número de línea a la estrategia se corrieron dos veces en dos días.** Citar por sección.
- **`git grep` amplio sobre todo el árbol tarda más de 2 min.** Filtrar por `*.md` y rutas.
- **Red del contenedor:** 403 para instagram, youtube, tiktok, higgsfield, elevenlabs, cal.com y
  `sergiourcullo.vercel.app`.

## 9. Qué depende de Sergio Urcullo

1. Elegir el método del carrusel IA (híbrido recomendado) — §4.1.
2. Lucía: aprobar el lote del plan v4 con su costo, o dejarla fuera — §4.2.
3. Presupuesto y creatividades de la campaña de Meta — §6.
4. Mergear el PR #40.
5. Grabar: E1 y C1 hoy; las dos sesiones de la semana — §5.
6. Confirmar que las «3 cosas que aprueba una persona» (C1) son su criterio.
7. Pedir a Plataforma la org demo con Recall proponiendo (V1, corto 9 y la pauta de Meta dependen).
8. Pendientes viejos: duración única de la llamada pública; bajar Higgsfield de Ultra y aclarar el
   cobro de US$348; firma del acuerdo con Samuel; comprar `sergiourcullo.com`.

## 10. Próximos pasos para Codex

1. Leer: este handoff → `../ONIA_CIRCUITO_DE_CONTENIDO.md` → `contenido/SISTEMA_DE_GUIONES.md` →
   el molde del día modelo → `ONIA_MARCA_PERSONAL_TRES_CARRILES.md`.
2. Publicar la Bóveda (§3) con la verificación hecha; actualizar `PUBLICACION.md` §2.
3. Escribir los guiones lun–jue en el molde y pasárselos a Sergio para la sesión de grabación.
4. Diseñar la campaña de Meta (§6) y dejarla en pausa con el resumen para que Sergio apruebe.
5. Con el PR #40 mergeado: Fase 1 de docs.
