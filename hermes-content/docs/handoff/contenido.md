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

**Estado: cumplido, salvo dos cosas:**
- la **integración de las 4 ramas del carril**: bloqueada por permisos, la decide Sergio Urcullo;
- la **Fase 1 de movimientos de docs**, que espera esa integración.

## Qué quedó EN PRODUCCIÓN

**Nada.** No se publicó ninguna pieza y el PR está en borrador. Todo lo de abajo está construido
y verificado, pero no está publicado ni mergeado.

## Qué quedó a medias, y dónde

1. **Integración de las ramas del carril** (`codex/marca-comunidad-plan`,
   `codex/sergio-vault-growth`, `codex/samuel-grabaciones-20260921`,
   `claude/marca-personal-carruseles-dist-deadab`).
   - Se probó en un worktree temporal: dos entran limpias y dos chocan en 3 archivos.
   - Se resolvió así, con 32 de 32 tests de `carousel_render.test.js` en verde:
     - **`scripts/carousel_pack_editorial.js`:** conservar las dos mejoras (CTA directo de la
       rama de marca personal + recurso de la Bóveda y firma de Codex), pero **sin defaults**.
       Codex imprimía "RECURSO EN LA BÓVEDA" y "Soy Sergio Urcullo" en todos los cierres,
       también en la pauta de @oniahq y con `/boveda` sin desplegar.
     - **`hermes-content/skills/carruseles-onia.md`:** dos estructuras, una para la pauta de ONIA
       y otra para el orgánico de Sergio Urcullo.
     - **`hermes-content/docs/cola/BRIEF-SAMUEL-VIDEOS.md`:** gana la retoma de Codex (posterior
       y sin la promesa absoluta sobre Soul), citando el bloqueo anterior.
   - **No se aplicó.** El sistema de permisos lo denegó ("Modify Shared Resources"), y también
     cualquier lectura posterior de esas ramas. Los commits de la integración quedaron sólo en
     ese contenedor y **se pierden**; se rehace en minutos con esta receta.
   - Merge en este orden: deadab → marca-comunidad-plan → sergio-vault-growth → samuel.
2. **Fase 1 del orden de docs:** los 33 movimientos seguros de
   `historial/MAPA_DOCS_20260925.md` §4.3. Esperan la integración: si se mueven antes, los
   archivos nuevos de las ramas aterrizan en las rutas viejas.
3. **Tanda Opus 5.5**
   ([`../contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md`](../contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md)).
   - **Listo:** guion, capturas, carrusel, checklist, texto de LinkedIn y drops.
   - **Falta de Sergio Urcullo:** grabar la cámara de C1-C3, grabar la demo de YouTube en su PC,
     aprobar el carrusel y pegar los drops.
4. **Capturas de video de la tanda**
   (`hermes-content/captures/2026-09-25-opus-5-5/`): ver la nota al final de este archivo sobre
   si la corrida final terminó.
5. **Carrusel:** el pack `community-editorial` numera las láminas ("02 / 08"), pero la regla 1
   de `carousels/CAROUSEL_SYSTEM.md` dice "sin numeración". Es el pack aprobado el 21-sep; no se
   tocó. Hay que decidir si la regla o el pack.
6. **Contradicciones sin resolver.** Son decisiones, no trabajo, y están en el §7 del índice.

## Archivos y cambios

| Qué | Dónde |
|---|---|
| La regla, la plantilla, las plataformas y los estados entre sesiones | `contenido/SISTEMA_DE_GUIONES.md` |
| Llamadas 1 a 1 (comunidad 15 min · Diagnóstico para clínicas 30 min, de Plataforma) | `contenido/LLAMADAS_1A1.md` |
| @oniahq y la pauta (la decisión vivía sólo en un handoff) | `contenido/MARCA_ONIA.md` |
| Cómo se publica hoy (todo a mano) | `contenido/PUBLICACION.md` |
| Índice único (CIRCUITO absorbe a MADRE) | `../ONIA_CIRCUITO_DE_CONTENIDO.md` |
| Mapa por dominio, precios marcados como no fuente | `../LEEME-PRIMERO.md` |
| Sesiones vivas, protocolo y dueños por dominio | `COORDINATION_MANIFEST.md` (raíz) |
| Tres investigaciones | `../research/ONIA_{REFERENTES_ROCHA_TAVERAS_MUNOZ,STACK_GENERACION_ALTERNATIVAS,METODO_SANTIAGO_EDICION}_20260925.md` |
| Fotos medidas del día | `../historial/contenido/{INVENTARIO_GUIONES,ESTADO_OPERATIVO_CONTENIDO}_20260925.md` · `../historial/MAPA_DOCS_20260925.md` |
| Herramientas | `scripts/contenido/capturar-web.mjs` (captura real verificada) · `scripts/contenido/recortar-capturas.mjs` |
| Tanda Opus 5.5 | guion, `hermes-content/captures/2026-09-25-opus-5-5/`, `carousels/out/sergio-opus-5-5-errores-400-20260925/`, `recursos/comunidad/opus-5-5-migracion/` |
| Higiene | `.gitignore` ignora `.claude/worktrees/`; `cola/README.md` ya no apunta a un archivo fantasma |

## Intentos fallidos

Lo que no hay que repetir:

- **La herramienta de captura se colgó en silencio más de 5 min.** `page.evaluate(() => document.fonts.ready)`
  devolvía el objeto `FontFaceSet` y Playwright intentaba serializarlo. Se arregló con
  `.then(() => true)` y ahora toda fase tiene un límite con nombre (`conLimite`).
- **Chromium no confiaba en la CA del proxy** (`ERR_CERT_AUTHORITY_INVALID`). La base NSS la creó
  vacía el primer Playwright del día. Se arregló con `certutil -A` de `/root/.ccr/agent-proxy-ca.crt`
  en `sql:/root/.pki/nssdb`. **Nunca** con `ignoreHTTPSErrors`.
- **La marca de unión metía palabras ajenas a la cifra** en frases de dos renglones. Ahora hay
  un rectángulo por renglón, y resaltador desde 2 renglones.
- **El cursor apuntado al medio tapaba el "40%".** Ahora apunta al final de la frase.
- **Las capturas de escritorio en el carrusel quedaban ilegibles (~12 px).** Se capturó en
  viewport de teléfono.
- **En Linux, el render de carruseles con el Chromium completo y `--headless=new` corta 88 px.**
  Se usa `CAROUSEL_BROWSER=…/headless_shell`.
- **`pkill -f <patrón>` mató a su propio shell** (exit 144), porque el patrón estaba en la línea
  de comando. Se usa `ps aux | grep "[n]ode …"`.
- **Tres subagentes con `isolation: worktree` llenaron el disco:** cada checkout pesa 5,9 GB y
  el tercero falló. Las tareas que sólo crean archivos van sin worktree.
- **Denegado por permisos:** integrar ramas ajenas, leerlas después de esa negativa, e instalar
  un pre-push local que bloqueara el fast-forward de `main` del auto-sync. No se insistió. Como
  `main` avanzó 7 commits durante la sesión, el auto-sync no puede hacer fast-forward: el camino
  es el PR.
- **Red de la sesión:** 403 para instagram, youtube, tiktok, threads, skool, cal.com, tododeia,
  eriktaveras, higgsfield, elevenlabs, fal y `www-cdn.anthropic.com`. Por eso las imágenes de la
  página del anuncio no cargan en la captura; el texto sí es real.

## Qué depende de Sergio Urcullo

1. **Integrar las 4 ramas del carril** (receta arriba). Después, la Fase 1 de docs.
2. **Grabar:**
   - C1, C2 y C3: cámara, siguiendo la tabla de cada guion;
   - la demo de YouTube de Opus 5.5 en su PC, con su clave de API.
3. **Aprobar el carrusel** (`PUBLICAR.md`) y decidir si los drops D1-D3 pasan a `cola/drops/`.
4. **Cadencia.** Hay 4 cifras vivas. La recomendación de esta sesión: 1 tema por semana, con
   1 YouTube, 3 cortos, 1 carrusel, 1 LinkedIn y 6 drops.
5. **Llamadas:**
   - duraciones (15 comunidad / 30 Diagnóstico);
   - cerrar la de 20 min pública;
   - arreglar el `/30min` que da 404;
   - crear el evento del Diagnóstico.
6. **Facturación:**
   - bajar Higgsfield de Ultra y cerrar el cobro de US$348 (las fuentes se contradicen);
   - revisar el plan de ElevenLabs, porque el Free no permite uso comercial.
7. **Red del entorno de nube:** si quiere que una sesión mire perfiles o capture redes, agregar
   esos dominios en la configuración del entorno.
8. **Resto del índice (§7):**
   - firma de Samuel;
   - qué es "Trial";
   - ¿Higgsfield en el contenido?;
   - `sergiourcullo.com`;
   - piloto presencial contra la Etapa 1;
   - la Bóveda antes de prometerla;
   - la campaña de @oniahq, que nombra módulos 🟡.
9. **Los 54 commits sin pushear** de la sesión "onia plattform" en su PC (05:24 UTC del 25-sep).

## Próximos pasos

1. Sergio Urcullo decide la integración → una sesión la aplica con la receta y hace la Fase 1.
2. **Abrir la sesión de EDICIÓN en su PC**, donde vive el material crudo. Tiene que leer primero:
   - `research/ONIA_METODO_SANTIAGO_EDICION_20260925.md` (qué decidir);
   - el archivo de la tanda Opus 5.5 (qué editar y con qué capturas).
3. El próximo tema semanal, con la plantilla de `SISTEMA_DE_GUIONES.md`, sale de
   `ONIA_MAPA_DE_TEMAS.md` o de lo que se repita en las llamadas 1 a 1.
4. Mover a `historial/` los handoffs vencidos del carril (`marca-personal-carruseles.md` del
   10-sep, `yt-canal.md` del 06-sep) cuando se integren las ramas: sus sucesores viven ahí.
