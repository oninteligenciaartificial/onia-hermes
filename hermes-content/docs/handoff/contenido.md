# Handoff: carril contenido (sesión de nube, 2026-09-25)

> Rama `claude/onia-content-scripts-cvat9r` · PR #40 (borrador) · índice del carril:
> [`../ONIA_CIRCUITO_DE_CONTENIDO.md`](../ONIA_CIRCUITO_DE_CONTENIDO.md).

## Objetivo

Ordenar el carril contenido y dejarlo listo para producir, con la regla de Sergio Urcullo:
*"tiene que enseñar algo, y si hay que grabar la pantalla, tiene que ser real"*.

**Definición de hecho:**
- índice único del carril, mapa de todos los docs y frontera entre sesiones;
- sistema de guiones con plantilla y formatos por plataforma;
- una tanda completa como molde, con sus capturas reales;
- protocolo entre sesiones;
- las decisiones pendientes en una sola lista.

**Estado: cumplido.** A la tarde se sumó lo que decidió Sergio Urcullo en el punto 1:
- las 4 ramas del carril quedaron integradas en el PR #40;
- el piloto «IA Lab Santa Cruz» quedó congelado;
- el carrusel del sábado 26 quedó corregido.

**Queda la Fase 1 de movimientos de docs:** espera a que se mergee el PR #40.

## Qué quedó EN PRODUCCIÓN

**Nada.** No se publicó ni se desplegó ninguna pieza, y el PR sigue en borrador. Todo lo de abajo
está construido y verificado, pero falta mergearlo o publicarlo.

## Qué quedó a medias, y dónde

1. **Integración de las 4 ramas: ✅ hecha el 25-sep** con OK explícito de Sergio Urcullo. Merges
   en este orden:
   - `35102c1a` deadab;
   - `dfe8a4c9` marca-comunidad-plan;
   - `79140e01` sergio-vault-growth;
   - `f43c3fcc` samuel.

   Los choques se resolvieron así:
   - **Pack editorial:** conserva las dos mejoras, sin defaults (Bóveda y firma sólo si el brief
     las trae).
   - **Skill de carruseles:** tiene dos estructuras, una para la pauta de ONIA y otra para el
     orgánico de Sergio.
   - **Brief de Samuel:** gana la retoma de Codex, con una cita a la versión anterior.

   Pasan los 45 tests de `carousel_render.test.js`. El contador decía «32» porque imprimía el
   total a mitad de archivo; se corrigió.

   **Llega a `main` recién cuando se mergee el PR #40.** No se mergea `origin/main` dentro de la
   rama: el auto-sync haría fast-forward de `main` al cerrar el turno y se saltaría la revisión.
   Medido a las 18:00 UTC: la rama mergea limpio contra `main`.
2. **Congelamiento del IA Lab (`7e4ef195`).** Lleva la marca 🧊 en todos los lugares donde aparece:
   - `ONIA_COMUNIDAD_CONTENIDO`, `MARCA_PERSONAL_OPERACION_DIARIA` y `TRES_CARRILES`;
   - el plan del 23 al 27-sep y la entrega de carruseles;
   - el carrusel del domingo 27, cuyo zip pasó a llamarse `…-CONGELADO.zip`.

   Tampoco salen las 3 piezas con SANTA CRUZ del sábado 26 ni la encuesta del lunes 28.
   ⚠️ **La audiencia nueva («jóvenes y aficionados a la IA») NO se congeló.** La opción que eligió
   Sergio Urcullo la incluía, pero en los docs está registrada como decisión suya del 21-sep, y
   volverla atrás restituía la regla vieja de «el carrusel no enseña el cómo». Se le avisó; si
   quiere congelarla, es un commit.
3. **Carrusel `sergio-agente-loop` del sábado 26: ✅ corregido (`93a3a54d`).**
   - **Láminas 3, 4 y 6:** alineadas con el G2 del 22-sep (Basic LLM Chain + Structured Output
     Parser; el AI Agent sólo si el modelo elige herramientas).
   - **Backticks:** fuera de todas las láminas.
   - **Cierre:** GUARDALO, con firma y sin palabra para comentar.
   - **Paquete:** zip nuevo y hoja de contacto real. La anterior era una captura de un error de
     Edge.

   Si se despliega `/agentes`, se puede volver a ARQUITECTURA: se agregan `comment_trigger` y
   `resource` al brief y se re-renderiza.
4. **Páginas de recurso en 404.** Medido en producción el 25-sep: `/automatizar`, `/agentes` y
   `/mcp` de `sergiourcullo.vercel.app` no existen, mientras que `/stack` responde 200. Se
   escribieron el 21-sep y nunca se desplegaron.
   - `/agentes` ya está corregida en el repo.
   - Desplegar las tres es una publicación: decide Sergio Urcullo. El deploy es manual por MCP de
     Vercel (`sitio-sergiourcullo/README.md`).
5. **Fase 1 del orden de docs:** son los 33 movimientos seguros de `historial/MAPA_DOCS_20260925.md`
   §4.3. Se hacen después de mergear el PR #40.
6. **Tanda Opus 5.5**
   ([`../contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md`](../contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md)).
   - **Listo:** guion, capturas (9 de 9 tomas), carrusel, checklist, texto de LinkedIn y drops.
   - **Falta de Sergio Urcullo:** grabar la cámara de C1-C3 y la demo de YouTube en su PC, y
     aprobar el carrusel.
   - ⚠️ **Hay que agregar `identity` y `follow_cta` a su brief antes de re-renderizarlo:** el
     render ahora exige firma en el orgánico de Sergio.
   - Codex hizo otro carrusel de Opus 5.5 el 22-sep, agendado para el miércoles 23. Hay que
     preguntar si salió.
7. **Marcas de lo que choca (`749dccc4`).**
   - Los guiones 3 y 4 del 21-sep (AI Agent para clasificar) quedan para reescribir antes de grabar.
   - Cinco guiones dicen en primera persona «todo corre en una PC vieja de mi casa».
   - La guía pública `/stack` dice lo mismo («Una PC vieja con Ubuntu — el servidor», «la única
     que pago es la que piensa»). Corregirla es publicar: decide Sergio Urcullo.
8. **Carrusel:** el pack `community-editorial` numera las láminas, pero la regla 1 de
   `carousels/CAROUSEL_SYSTEM.md` dice «sin numeración». Hay que decidir cuál manda.

## Archivos y cambios

| Qué | Dónde |
|---|---|
| La regla, la plantilla, las plataformas y los estados entre sesiones (+ regla de datos de ejemplo, §2) | `contenido/SISTEMA_DE_GUIONES.md` |
| Llamadas 1 a 1 (comunidad 15 min · Diagnóstico para clínicas 30 min, de Plataforma) | `contenido/LLAMADAS_1A1.md` |
| @oniahq y la pauta | `contenido/MARCA_ONIA.md` |
| Cómo se publica hoy (todo a mano) | `contenido/PUBLICACION.md` |
| Índice único (§6 ramas integradas, §7 decisiones) | `../ONIA_CIRCUITO_DE_CONTENIDO.md` |
| Sesiones vivas, protocolo y dueños por dominio | `COORDINATION_MANIFEST.md` (raíz) |
| Tres investigaciones | `../research/ONIA_{REFERENTES_ROCHA_TAVERAS_MUNOZ,STACK_GENERACION_ALTERNATIVAS,METODO_SANTIAGO_EDICION}_20260925.md` |
| Fotos medidas del día | `../historial/contenido/{INVENTARIO_GUIONES,ESTADO_OPERATIVO_CONTENIDO}_20260925.md` · `../historial/MAPA_DOCS_20260925.md` |
| Herramientas | `scripts/contenido/capturar-web.mjs` · `scripts/contenido/recortar-capturas.mjs` · `scripts/carousel_render.js` (`faltantesCtaSergio`) |
| Tanda Opus 5.5 | guion, `hermes-content/captures/2026-09-25-opus-5-5/`, `carousels/out/sergio-opus-5-5-errores-400-20260925/`, `recursos/comunidad/opus-5-5-migracion/` |
| Carrusel del sábado 26 corregido | `carousels/briefs/marca-personal/sergio-agente-loop-20260921.json` → `carousels/out/sergio-agente-loop-20260921{/,-para-publicar.zip}` |
| Página de recurso corregida, sin desplegar | `hermes-content/sitio-sergiourcullo/agentes/index.html` |

## Intentos fallidos

Lo que no hay que repetir:

- **La herramienta de captura se colgó en silencio más de 5 min.** `page.evaluate(() => document.fonts.ready)`
  devolvía el objeto `FontFaceSet` y Playwright intentaba serializarlo. Se arregló con
  `.then(() => true)` y ahora toda fase tiene un límite con nombre (`conLimite`).
- **Chromium no confiaba en la CA del proxy** (`ERR_CERT_AUTHORITY_INVALID`). Se arregló con
  `certutil -A` de `/root/.ccr/agent-proxy-ca.crt` en `sql:/root/.pki/nssdb`. **Nunca** con
  `ignoreHTTPSErrors`.
- **La marca de unión metía palabras ajenas a la cifra** en frases de dos renglones: ahora hay un
  rectángulo por renglón. **El cursor tapaba el "40%":** ahora apunta al final de la frase.
- **Capturas de escritorio ilegibles en el carrusel (~12 px):** se captura en viewport de teléfono.
- **En Linux, el Chromium completo con `--headless=new` corta 88 px el render de carruseles.** Se
  usa `CAROUSEL_BROWSER=…/headless_shell`.
- **Matar procesos por patrón mata al propio shell (exit 144), dos veces en el día.** Pasó con
  `pkill -f` y también con `ps aux | grep "[p]atrón" | xargs kill`, porque el patrón está en la
  línea de comando del bash que lo invoca. **Se mata por PID**, tomado de `$!` al lanzar.
- **`cmd && VAR=x && servidor &` manda TODA la cadena a segundo plano.** `VAR` queda vacía en el
  shell de adelante y los archivos se escribieron en `/` (`/shot-agentes.cjs`,
  `/agentes-movil.png`). Una verificación de seguridad bloqueó borrarlos. Quedaron ahí, fuera del
  repo; el contenedor es efímero.
- **Una comprobación de Python falló y el render corrió igual**, porque los comandos iban en
  líneas separadas y no encadenados con `&&`. El render pisó `out/` con el brief viejo, y se
  restauró con `git checkout`. Todo lo que depende de un paso anterior va encadenado con `&&`.
- **`grep -rl … hermes-content | xargs sed` se colgó más de 2 min:** recorría videos pesados. Se
  editan listas explícitas de archivos.
- **Tres subagentes con `isolation: worktree` llenaron el disco** (5,9 GB cada checkout). Las
  tareas que sólo crean archivos van sin worktree.
- **Denegado por permisos, a la mañana:** integrar ramas ajenas sin OK, leerlas después e instalar
  un pre-push local. No se insistió. Con el OK explícito de Sergio Urcullo, la integración pasó.
- **Red de la sesión:** 403 para instagram, youtube, tiktok, threads, skool, cal.com, tododeia,
  eriktaveras, higgsfield, elevenlabs, fal, `www-cdn.anthropic.com` y `sergiourcullo.vercel.app`.
  El sitio personal se mide con `web_fetch_vercel_url` del MCP de Vercel, que es sólo lectura.

## Qué depende de Sergio Urcullo

1. **Mergear el PR #40.** Recién ahí lo integrado llega a `main` y lo ven las otras sesiones.
2. **Desplegar o no** `/automatizar`, `/agentes` y `/mcp` (404 hoy). Corregir o no `/stack`.
3. **Publicar el carrusel del sábado 26** con el zip nuevo, y no el del 21-sep.
4. **Grabar:** la cámara de C1, C2 y C3 y la demo de YouTube de Opus 5.5 en su PC.
5. **Aprobar el carrusel de Opus 5.5** (`PUBLICAR.md`). Decir si salió el del miércoles 23.
6. **Cadencia.** Hay 4 cifras vivas. La recomendación de esta sesión: 1 tema por semana, con
   1 YouTube, 3 cortos, 1 carrusel, 1 LinkedIn y 6 drops.
7. **Llamadas:** duraciones, cerrar la de 20 min pública, arreglar el `/30min` que da 404 y crear
   el evento del Diagnóstico.
8. **Facturación:** bajar Higgsfield de Ultra y aclarar el cobro de US$348. Revisar el plan de
   ElevenLabs: el Free no permite uso comercial.
9. **¿Congelar también la audiencia nueva?** Hoy sigue vigente (ver arriba).
10. **Resto del índice (§7):** firma de Samuel, qué es «Trial», Higgsfield en el contenido,
    `sergiourcullo.com`, la Bóveda antes de prometerla, la campaña de @oniahq.
11. **Los 54 commits sin pushear** de la sesión «onia plattform» de su PC (05:24 UTC del 25-sep).

## Próximos pasos

1. Seguir el recorrido «punto por punto» con Sergio Urcullo. El punto 1 está cerrado; los
   puntos 2 a 6 siguen arriba.
2. Con el PR #40 mergeado: Fase 1 de docs y mover a `historial/` los handoffs vencidos
   (`marca-personal-carruseles.md` del 10-sep y `yt-canal.md` del 06-sep).
3. **Abrir la sesión de EDICIÓN en su PC**, donde vive el material crudo. Tiene que leer primero:
   - `research/ONIA_METODO_SANTIAGO_EDICION_20260925.md`;
   - el archivo de la tanda Opus 5.5.
4. El próximo tema semanal, con la plantilla de `SISTEMA_DE_GUIONES.md`.
