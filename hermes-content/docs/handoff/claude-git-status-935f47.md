# Handoff — carril `claude/git-status-935f47`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23.

**Objetivo**

Terminar el producto para poder venderlo y fotografiarlo, uno por uno, sin dejar nada a
medias. *Hecho* = los 8 ítems de la cola de terminación cerrados y en producción
(`ONIA_PENDIENTES_PARA_LANZAR.md` §"LA COLA DE TERMINACIÓN").

**Los 8 están cerrados en código. Dos cosas NO están publicadas** — ver el campo siguiente. Al
final Sergio abrió un frente nuevo (imágenes con Higgsfield) que queda apenas empezado y
documentado abajo para retomarlo sin re-descubrir nada.

---

**Qué quedó EN PRODUCCIÓN**

Todo lo de los ítems 1 a 7 está vivo y verificado en producción:

- Formato de moneda boliviano, un solo nombre por plan, medidor de plan vivo en los 7 rubros.
- Calendario de citas al derecho, 6 tablas legibles en el teléfono, ayuda filtrada por rubro.
- **Caja con carrito multi-línea + anulación** — era el único bloqueo funcional de comercio.
- **Panel propio de importadora** y **panel dental rediseñado**.
- Web publicada en `onia.com.bo` con la oferta completa; alta cerrada → "Pedí tu acceso".
- **Embedded Signup de WhatsApp encendido**: Configuration ID `1834223392073753`, dominio
  `chat.onia.com.bo`, las 3 variables en Chatwoot (van en `installation_configs`, **no** en el
  entorno del servicio — ese camino no habría funcionado nunca).
- **Lote final desplegado y MIRADO**: `/login` en producción dice "Entrá a tu cuenta".
  Runtime `lVvLKgQAmf10lZ8kk583x`, rollback en `runtime-next.prev-20260823-021701`.

---

**Qué quedó a medias, y dónde**

### 1. Commits listos y SIN DEPLOYAR

| Repo | Commits | Qué es |
|---|---|---|
| `onia-platform` master | `2a2b77b` `a5ee33f` `6d34e62` `78ac58c` `78d549e` | fix de `/contact` + guard 20 + seed de 5 inquilinos + skill |
| `onia-hermes` rama `claude/git-status-935f47` | `8a2d74b6` `1bb5ed96` | conmutador de rubros con las fotos reales |

Ninguno cambia comportamiento en producción, así que no hay urgencia — pero **el de la landing
necesita el OK de Sergio antes del swap**: cambia una superficie viva y la regla es que él VEA
la pieza terminada. Se le mandaron las capturas (5 paradas a 1440 + apilado a 390) y **no
llegó a responder**.

⚠️ `onia.com.bo` **no lo sirve Vercel**: lo sirve el contenedor `onia-landing` del VPS.
Pushear a main NO publica nada; hay que buildear y hacer swap.

### 2. El frente de imágenes con Higgsfield — recién empezado

Sergio, al final de la sesión: *"las capturas hazlas con higgsfield pero que tengan
correlacion con lo que quieras mostrar, y recuerda que la web tiene que ser funcional mostrar
usos practicos y mas que todo vender, termina y manda tus subagentes"*.

**Interpretación ya tomada (no re-discutirla):** las capturas de INTERFAZ siguen siendo reales
— generar una UI falsa con IA sería *fabricar producto*, que está prohibido. Higgsfield genera
las imágenes de **contexto y uso**: personas de Bolivia en su negocio. Hoy la web es 100%
texto + interfaz, sin una sola foto humana.

Lo averiguado, para no repetirlo:

- **Cuenta Higgsfield**: 2.178,31 créditos, plan `ultra` (consultado con `balance`).
- **Modelos**: `soul_2` (Soul 2.0 — UGC realista de personas; ratios 1:1, 16:9, 9:16, 4:3, 3:4,
  3:2, 2:3; quality 1.5k|2k) y `gpt_image_2` (OpenAI, mejor cuando hay tipografía). También
  existen `cinematic_studio_2_5` y `marketing_studio_image`.
- **⚠️ El MCP no acepta los parámetros sueltos.** `generate_image` con
  `{model, prompt, aspect_ratio, quality}` devuelve
  `Input validation error: ... params: Invalid input`. Espera un objeto `params`. **Inspeccionar
  el esquema real antes del primer intento.** Se perdió un intento por esto y **no se generó
  ninguna imagen: cero créditos gastados.**
- **Las 3 ranuras de la home ya tienen captura real** (`/v2/capturas/panel|agentes|whatsapp.webp`).
  La del hero se miró: **está bien, no desactualizada** — muestra Bs 4.633,40, cómo te pagaron,
  cuadre de caja, fiado vencido y una propuesta del agente esperando aprobación, y correlaciona
  con el titular. **No hay que reemplazarla**: las fotos de Higgsfield SUMAN, no sustituyen
  interfaz.

**Hay un workflow en vuelo con el trabajo de diseño**, lanzado justo antes de cerrar:

```
runId      wf_4ca119e5-8e7
script     C:\Users\PC\.claude\projects\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674-web-factory-apps-onia-platform\946633e2-5c52-475c-9d6a-565e4b92c3c0\workflows\scripts\onia-web-vende-con-imagenes-wf_4ca119e5-8e7.js
transcript C:\Users\PC\.claude\projects\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\946633e2-5c52-475c-9d6a-565e4b92c3c0\subagents\workflows\wf_4ca119e5-8e7
```

Tres fases: 4 lentes en paralelo (qué le falta a la web para vender · el momento real a
retratar por rubro · dirección fotográfica anti-stock · reglas vinculantes sobre IA en
superficie de venta), un verificador escéptico que busca contradicciones **entre** ellos, y un
plan final de 6-10 imágenes con prompt en inglés, ubicación exacta (archivo:línea), la frase de
la web con la que correlaciona y el riesgo de regla de cada una.

**Cómo retomarlo:** leer primero `journal.jsonl` del transcript — ahí está el retorno real de
cada agente. Si terminó, el plan ya está escrito y sólo falta generar. Si se cortó, relanzar con
`Workflow({scriptPath, resumeFromRunId: "wf_4ca119e5-8e7"})`: los agentes completados devuelven
caché al instante.

### 3. Lo que sigue abierto de antes

- **Login visual**: diagnosticado, no tocado. Panel izquierdo con un tercio vacío en el medio,
  verde de un solo tono sin capas, aviso de Supabase **azul** que rompe la paleta, tarjeta
  blanca sobre gris sin presencia.
- **Switcher de rubros en móvil**: sigue apilando en vez de cambiar al scrollear. Hoy apila las
  cinco capturas, cada una con su etiqueta — fallback digno, pero no es lo que pidió.
- **Telegram para pedidos de acceso**: las variables están en `app.env` pero el contenedor no
  las tomó (`docker restart` no relee `--env-file`). Requiere recrear el contenedor (3 redes,
  hay datos de clientes). Hoy el aviso sale por correo, que funciona.
- **Composición de la sección de rubros**: la columna derecha del encabezado está vacía y sobra
  aire. Medido: 4.980 px de 12.574 (40% de la home). Las fotos llenaron la tarjeta, no la
  composición.

---

**Archivos y cambios**

- `onia-platform/app/contact/page.tsx` — 9 arreglos: 5 fugas dentales + 3 tildes + meta.
- `onia-platform/__tests__/terminacion-lote-final.test.ts` — **guard 20**: ninguna ruta pública
  (`app/contact`, `app/(auth)`) puede nombrar clínica, pacientes, doctores ni tratamientos.
- `onia-platform/prisma/seed-demo.ts` — 5 inquilinos, ruteo explícito por track,
  `CATALOGO_POR_TRACK`, `CLIENTES_POR_TRACK`, `limpiarMarcasDemo`, `diaDeClinica` idempotente.
- `onia-platform/.claude/skills/onia-verificacion/SKILL.md` — baseline 1989 + dos trampas nuevas.
- `web-factory/apps/onia-platform/src/app/(sitio)/switcher.tsx` + `sitio.module.css` — fotos
  cableadas, tarjeta 290×340 → 478×560, marco, etiqueta en móvil.
- `web-factory/apps/onia-platform/public/rubros/*.webp` — 5 recortes, 224 KB en total.
- `hermes-content/docs/ONIA_PENDIENTES_PARA_LANZAR.md` — cola cerrada + los 4 defectos que
  hubo que arreglar antes de poder fotografiar.

**Cómo regenerar las capturas de rubro** (el arnés se borró: era scratch. Esta es la receta):

1. Postgres desechable: `node serve.mjs` en el `pgtool/` del scratchpad (`embedded-postgres`,
   puerto **55432**, base `onia_demo`). El data dir ya está sembrado y persiste.
2. Sembrar: `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/onia_demo
   PLATFORM_LAYER=1 AGENTS_RUNTIME=1 npx tsx prisma/seed-demo.ts`. Es idempotente.
3. Dev server con env **por entorno**, nunca `.env.local` — ese apunta a PRODUCCIÓN por túnel, y
   en Next el entorno real le gana al archivo. Neutralizar también las `BCP_QR_*`: son
   credenciales de pasarela y un cobro de prueba sería plata de verdad.
4. Sesión sin contraseña: stub de Supabase Auth en `127.0.0.1:15321` (`auth-stub.mjs` del
   scratchpad) + cookie `sb-127-auth-token` con un JWT **sin firma** cuyo `sub` es el `userId`
   del perfil admin (`demo-demo-<slug>-admin`). El stub no valida firma. **Sólo local.**
5. Recortar a **478×560** (ratio 0,853, el de la tarjeta) con `deviceScaleFactor: 3`, y
   convertir a webp 956×1120 con el `sharp` que ya tiene la landing.

---

**Intentos fallidos**

- **Di por bueno un recorte mirándolo en el archivo, no en su destino.** Se veía nítido a
  1434 px y era ilegible en la tarjeta de 290 px. Regla nueva en la skill `onia-verificacion`:
  una imagen se juzga **montada al tamaño real en que se va a ver**.
- **Supuse que `seedDemoData` era agnóstico de rubro "porque viene del core".** Falso: siembra
  el catálogo dental para cualquier track — un estudio contable vendía "Resina compuesta". Lo
  delató consultar la base, no leer el código.
- **El seed afirmaba en un comentario que los motivos de cita "van a secas".** Falso en la base:
  había `Demo · `, `(demo)` y `(demo, hace 220 días)`, justo en dental, que es el rubro que más
  se fotografía.
- **Creí que quitar la píldora del rubro empeoraba el móvil.** También falso: ya estaba en
  `display:none` ahí. Comprobarlo evitó "arreglar" algo que no rompí — y destapó que en móvil
  nunca hubo etiqueta, que sí se agregó.
- **El primer guard de fugas dentales mordió su propio comentario**: leía las líneas crudas en
  vez de la fuente sin comentarios que usan los demás guards del archivo.
- **Reporté un `__webpack_modules__ is not a function` como si fuera del cambio.** Era el
  `.next` del dev server pisado por un `next build` corrido en paralelo. Con `.next` limpio:
  cero errores de página. **Un build y un dev server no comparten `.next`.**
- **`next build` de la landing falla en Windows** con `EPERM: symlink` al armar el standalone.
  No es del cambio: compila y genera las 31 páginas, y en Linux (VPS/CI) el symlink funciona.
- **Primer intento con Higgsfield rechazado por el esquema** (`params: Invalid input`). Sin costo.

---

**Qué depende de Sergio**

1. 🔴 **Mirar el conmutador con las fotos y dar el OK.** Sin eso no hay swap de la landing.
   Se le mandaron las capturas de las 5 paradas y el apilado móvil.
2. **El clic de prueba del Embedded Signup** — `chat.onia.com.bo` → Ajustes → Entradas → Nueva
   → WhatsApp → "Connect with WhatsApp Business". Es lo único que prueba el handshake con Meta.
3. **Mirar el panel dental en producción** — nadie lo vio renderizado; vive tras el login.
4. **Decisión**: ¿el botón de Google se habilita (necesita credenciales de Google Cloud) o se
   esconde? Hoy está visible y roto — el proveedor nunca estuvo configurado.
5. **Access Verification de Meta** — enviada, vence el **20/10/2026**.
6. **Número del plan de Higgsfield** (dijo ~$100) para cerrar el cuadro de costos.
7. **Rotaciones** cuando tenga su laptop: password de Postgres, tokens de Meta del historial,
   claves de Supabase en 4 workflows dormidos de n8n.

---

**Próximos pasos**

1. **Recuperar el plan de imágenes** del workflow `wf_4ca119e5-8e7` (leer `journal.jsonl`
   primero). *Listo* = el plan de 6-10 imágenes con sus prompts, guardado como doc del repo.
2. **Resolver el esquema del MCP de Higgsfield** y generar. *Listo* = las imágenes en `public/`,
   miradas una por una, sin manos deformes ni texto inventado en las pantallas del fondo.
3. **Cablearlas y mostrarle la web entera a Sergio** antes de publicar. *Listo* = OK explícito
   sobre esa pieza — construir y publicar son dos permisos distintos.
4. Deployar `onia-platform` (contact + guard + seed) y hacer el swap de la landing.
5. Rediseñar el visual del login (los 4 defectos de arriba). *Listo* = capturas a 390 y 1440
   leídas, sin el vacío del medio ni el azul ajeno.
6. Switcher móvil: que cambie de rubro al scrollear en vez de apilar.

**Pendientes anotados y NO perseguidos** (para que la próxima sesión no los tome por bugs):

- Dental, estética y servicios cierran el día en el mismo **Bs 942,50**: comparten el fixture de
  cobros. No se ve en las fotos elegidas — sólo comercio muestra un total — por eso no se tocó.
- La foto de servicios muestra **"Crédito fiscal Bs 0,00 · 0 compras registradas"**. Es honesto
  (no hay compras sembradas) pero un cero en una foto de venta no ayuda: sembrar compras.
- El hero de la home tiene una inconsistencia menor de formato: conviven `Bs 1.806` y
  `Bs 1.147,50` en la misma tarjeta.
