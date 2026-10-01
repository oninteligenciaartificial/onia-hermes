# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

Regla: CLAUDE.md §1 «Sesión MADRE local + carriles en la nube». Método (ids, canales medidos, entornos, cómo abrir
sesiones, ronda): **skill `onia-sesion-madre`**. Este archivo es el ESTADO al 1-oct ~23:45 UTC.

## 0. Al abrir una madre nueva (en este orden)

1. **Remote Control encendido** en esta sesión (botón de la barra). Sin él la madre no ve ni le habla a la nube
   (`ListAgents` sale vacío). El 1-oct, tras reiniciar la PC, volvió apagado y prenderlo por herramienta dio 403.
2. **Chrome abierto con la extensión Claude conectada** (`list_connected_browsers` ≠ `[]`). Es la sesión de
   Sergio Urcullo en Meta, Buffer, Doctocliq.
3. **Recrear la ronda:** `CronCreate` `13,43 * * * *` con el prompt de la skill (solo vive mientras la madre está abierta).
4. `ListAgents` → mandar a cada sesión de la nube que la madre volvió y pedir su estado (contestan en su transcript).

## 1. Objetivo

Ordenar a todas las sesiones por mensaje y destrabar lo que necesita la PC para cobrar al primer cliente (Etapa 1:
5 clínicas pagando, Bs 3.750/mes). **Hecho =** canales medidos ✅, skill creada ✅, cada sesión con su tarea ✅,
tareas A-D con resultado mandado a Plataforma: A ✅ (resultado: bloqueado por Meta), B ✅ (diagnosticado),
C ⏸ (espera capturas de Sergio Urcullo), D ✅ (web renderizada y mostrada; espera su OK).

## 2. Qué quedó EN PRODUCCIÓN (1-oct)

- Plataforma `release-8ff1284d`: PR #96 (alta solo con los 5 rubros que se venden), PR #97 («Completada» bloqueada
  en citas futuras, «Ver mi plan» lleva a pagar, ayuda sin pantallas prohibidas), `/privacidad` sin React #418,
  `/rubros` móvil arreglado. Publicado y verificado por Plataforma.
- Skill `onia-sesion-madre` (rama `claude/onia-sesion-madre-77f719`, 10 commits, a main en este cierre).
- CLAUDE.md: regla de **autoconocimiento** (cada sesión escribe lo aprendido en su skill, mismo commit).
- Lucía: `@lucia.antelo.oficial` conectada a la app `OnIA Social API` (IG id 17841442427551217, webhook activo).
- Entorno `onia-higgsfield`: `ELEVENLABS_API_KEY`, red completa y variables `ONIA_VPS_*` (las cargó Sergio Urcullo).

## 3. Qué quedó a medias y dónde

| Frente | Estado exacto | Dónde / cómo se retoma |
|---|---|---|
| **A. Plantilla `onia_codigo_verificacion`** | Bloqueada por Meta **también desde la interfaz**: «Esta cuenta de WhatsApp Business no tiene permiso para crear una plantilla de mensaje». Pago descartado: la WABA tiene Visa ···· 4028 predeterminada. La verificación por WhatsApp del alta queda **APAGADA** (decisión de Sergio Urcullo). | Plataforma redacta el caso de soporte a Meta; lo abre Sergio Urcullo en Business Support Home. Plan B `wa.me` en rama, apagado. |
| **B. Conector Meta Ads** | Ve «NUVO 1usd» y «Arthur Fuentes», no ONIA Ads `1073680778314945`. | Sergio Urcullo: claude.ai → Conectores → Meta Ads → reconectar con su usuario de ONIA Ads. Y tarjeta en ONIA Ads. |
| **C. SIAT** | Sin capturas. | Sergio Urcullo: filas 4 y 6 de la etapa VI, «Listado de Etapas», CAFC del piloto (motivos 5-7). |
| **D. Web 1.0** | Rama `wip/web-v1-correcciones-20261001` `15ec950d`: los 4 arreglos ✅ (Crece 4 usuarios, /agentes, /chatbot, FAQ SIAT). Pasados a Plataforma 4 detalles: coma cortada en /precios a 390 px, «Bs / mes» de Completo, títulos de /chatbot desalineados, «asistente» en legales. Capturas para Sergio Urcullo enviadas (`scratchpad/web-v1/v2/para-sergio-*.png`). | Sergio Urcullo decide: home nueva corta (3.742 px vs 14.284), tarjeta Crece cargada, texto legal v1.3. Con su OK, Plataforma publica. Worktree local `.claude/worktrees/web-v1-revision` (detached, limpio, 6,9 GB) — borrable. |
| **PR #79 Hermes** (`claude/kind-cannon-7hkc3c`) | Revisión adversarial (48 agentes): **NO MERGEAR**. 1 HIGH (la rutina iría con la llave root del VPS) + el «sí» se puede saltar + 8 más. Lista de 10 correcciones enviada a Control y a «Hermes-Jarvis Sergio Urcullo». | Veredicto completo: `scratchpad/../tasks/wn2ulzhnh.output` (temporal). Re-revisar cuando llegue el commit corrector. Después: merge → token de la rutina (Sergio) → `aplicar`. |
| **Doctocliq por dentro** | Cuenta de Sergio Urcullo ya existía (logueada en Chrome). Recorrido parcial: 26 capturas (cuenta/plan, agenda, recordatorios, pacientes) en `scratchpad/doctocliq-adentro/`. Faltan presupuesto, inactivos/marketing, caja, reportes, chat. | Subagente `acca7ff0354316c20` (reanudable). Al terminar, copiar a `hermes-content/research/competencia/doctocliq/cuenta-de-prueba/` y pasárselo a Plataforma. OK de Sergio Urcullo para datos de prueba con su número/correo. |
| **Citalo / AgendaPro por dentro** | No empezado. Dentalink descartado (exige vendedor). | Sergio Urcullo dice si ya tiene cuenta; si no, la crea él (la madre no crea cuentas) y la madre la recorre. |
| **Las 2 pruebas por vencer** | Lectura de producción bloqueada por el control de permisos («Production Reads»). | Consulta de solo lectura en `scripts/sql/pruebas-por-vencer.sql`; la corre Sergio Urcullo o da el permiso. Borradores A/B en el transcript de la Ventas vieja. |
| **Lucía** | Reels L02/L05 hechos con PIL+ffmpeg a mano: error. Pedido rehacer L08/L02/L05 con `editor-videos` (método Santiago), costo 0. Falta su relevo para cargar la llave del VPS. TikTok de Lucía: Buffer gratis lleno (3/3); Sergio Urcullo decide cuenta aparte (A) o pagar (B). Token IG de Lucía al VPS: comando con portapapeles dado a Sergio Urcullo. | Transcript de «Lucia v4 session - Higgsfield». |
| **Plataforma sucesora por rutina** | `cse_01Pxvxvv14Zga4CtshH26xg3` (entorno Onia, ambos repos, todos los conectores): estaba clonando; no se vio su paso 0. Sergio Urcullo también abrió «Onia Platform SIAT runner». **Puede haber dos Plataformas.** | Leer `get_run_log` de `cse_01Pxvxvv14Zga4CtshH26xg3`; si trabaja en paralelo a la otra, que Sergio Urcullo la frene en claude.ai/code → Rutinas. |
| **Respaldo local** | Rama LOCAL `respaldo/autosync-5f0c8aec-20260930` (149 archivos de un auto-sync del 30-sep que main no tiene; también está como 1 commit sin pushear en el `main` del checkout principal). | Decide Sergio Urcullo: publicar o descartar. No está en GitHub. |

## 4. Archivos

`.claude/skills/onia-sesion-madre/SKILL.md` · `CLAUDE.md` (autoconocimiento) · `scripts/sql/pruebas-por-vencer.sql` ·
este handoff. Temporales en `C:/Users/PC/AppData/Local/Temp/claude/.../scratchpad/`: `web-v1/` (capturas rama vs prod),
`doctocliq-adentro/`, `hermes-diagnostico.txt` (diagnóstico de Hermes, 1206 líneas).

## 5. Intentos fallidos (y su causa)

- **Plantilla de autenticación:** API y ahora también interfaz → mismo bloqueo de cuenta. No repetir; va soporte de Meta.
- **Sesiones abiertas por rutina desde la NUBE** (`create_trigger` de Lucía): nacen sin repo ni conectores. Desde la
  madre con `RemoteTrigger create` + `sources` sí traen repos y conectores, pero **no aparecen en la barra** de
  Sergio Urcullo → prefiere abrirlas él con el texto de arranque.
- **Control de permisos local** frenó: lectura de producción por SSH, barrido de `%TEMP%`, `rm -rf` de restos de
  worktrees. No se rodea: va a la lista de Sergio Urcullo.
- **Extensión de Chrome** se desconecta sola; reintentar `list_connected_browsers`. Pestañas en segundo plano cuelgan
  el screenshot: usar `get_page_text`.
- **Subagentes de la madre no tienen `RemoteTrigger`**: los transcripts de la nube los lee la madre en su contexto.
- WebFetch trajo una versión vieja de la página de precios de WhatsApp (72 h); la renderizada dice 7 días.

## 6. Qué depende de Sergio Urcullo

1. Remote Control encendido y Chrome abierto en la PC.
2. Meta Ads: reconectar el conector + tarjeta en ONIA Ads.
3. Web 1.0: OK a la home corta, a la tarjeta Crece y al texto legal v1.3.
4. Caso de soporte a Meta por la plantilla de autenticación (texto lo prepara Plataforma).
5. Capturas del SIAT.
6. Correr `scripts/sql/pruebas-por-vencer.sql` o dar permiso de lectura de producción.
7. Lucía: token IG al VPS (comando dado) y TikTok (A o B).
8. Cuenta demo en producción: ¿se crea? (sin ella no hay demo de venta).
9. OK a los mensajes de los 6 leads y al primer lote de 5 prospectos.
10. Disco: limpiar Temp (Configuración → Almacenamiento), cachés de Chrome/CapCut/Spotify; decidir Docker (32 GB),
    CapCut viejo (14,8), `C:\dev\tmp-filtro` (14,3), carpetas huérfanas (13) y la revisión de 7 worktrees con cambios
    (41 GB). Hoy C: tiene ~15 GB libres.
11. Archivar sesiones viejas: Control, «Onia platform development handoff», Ventas y Marca viejas, la Lucía vieja y
    la sesión vacía de rutina de Lucía.

## 7. Próximos pasos (madre)

1. Paso 0 de arriba. 2. Ronda: estado de cada sesión nueva (Plataforma, Ventas, Marca, Lucía, Hermes-Jarvis).
3. Terminar Doctocliq por dentro → pasárselo a Plataforma. 4. Re-revisar PR #79 cuando llegue el corrector.
5. Recapturar la web cuando Plataforma pushee los 4 detalles. 6. Verificar los 28 prospectos de Ventas si su entorno
no llega a Facebook. 7. Citalo/AgendaPro cuando Sergio Urcullo tenga las cuentas.
