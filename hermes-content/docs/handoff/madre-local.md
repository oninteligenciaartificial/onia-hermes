# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

Regla: CLAUDE.md §1 «Sesión MADRE local + carriles en la nube». Método (ids, canales medidos, entornos, cómo abrir
sesiones, ronda): **skill `onia-sesion-madre`**. Este archivo es el ESTADO al **3-oct ~15:20 UTC**, justo antes de que
Sergio Urcullo actualice Claude y reinicie la PC.

## 0. Al abrir una madre nueva (en este orden)

1. **Remote Control encendido** (sin él `ListAgents` sale vacío). **Chrome con la extensión Claude conectada**
   (`list_connected_browsers` ≠ `[]`).
2. **Recrear la ronda:** `CronCreate` `13,43 * * * *` con el prompt de la skill.
3. `ListAgents` y leer los transcripts SOLO de lo nuevo. **Alcance CONGELADO** (abajo): no repartir tareas nuevas.
4. Hay una **madre v2 «revisión»** (local, `local_4cf12f8b…`): revisa PRs y arma la tabla de resultados. Su estado:
   `handoff/madre-v2-revision.md` (rama `claude/sesion-madre-v2-revision-696bb0`).

## 1. Objetivo vigente

**Cerrar lo ya asignado y hacer la revisión de resultados con Sergio Urcullo.** Sergio Urcullo, 2-oct: *«no se añaden
más tareas después de las que ya hay; terminemos de hacerlas, cortamos, damos un vistazo y definimos cómo seguir»*.
Las 6 sesiones lo saben y están quietas esperando. Tokens solo en lo **necesario** (3-oct): lo que acerca a las 5
clínicas pagando o destraba main/producción; revisión proporcional al riesgo; nada de releer docs enteros.

## 2. Qué quedó EN MAIN / producción (2 y 3-oct)

- `ONIA_NIVEL_REFERENTES_BRECHA.md`: lo que le falta a Onia frente a la competencia, verificado contra master
  (23 P0, 23 P1, 30 P2). `DAPTA_COMO_FUNCIONA.md` es la fuente única de Dapta (recorrida y probada con créditos
  gratis). `research/competencia/REVISION-HERRAMIENTAS-CHATBOT.md`: Dapta, SendyPro y ManyChat por dentro.
- Videos: el bueno es **«Tu primera automatización» (22-sep, editado por Codex)**, rescatado con su receta en
  `videos/marca-personal/2026-09-21/RECETA.md`; el reel Astra/Fable (Codex, 14-sep) como referencia en
  `references/video-intake/2026-09-14-reel-astra-fable-codex/`. **Molde a replicar tal cual: Erik Taveras y
  Santiago Muñoz** → skill nueva `edicion-referentes` (la arma Marca, PR #100). editor-videos arranca con esto.
- Lucía: `references/modelos/lucia/MANUAL-PATRONES-INFLUENCERS-IA.md`. Decisiones: solo los rubros que vende Onia;
  «que no se identifique como odontóloga pero que tenga la ropa».
- PRs mergeados por la madre: #88, #91 (Hermes), #96 (main vuelve a verde, 19681b6b).
- Memoria: `codex-cuenta-y-reparto.md` (Codex = suscripción prolite con tope semanal; solo tareas cerradas).

## 3. Qué quedó a medias y dónde

| Frente | Estado exacto | Cómo se retoma |
|---|---|---|
| **CRITICAL platform#98** | El botón de respuesta al recordatorio se acepta desde el widget web: un anónimo confirma/cancela citas ajenas y ve el nombre. Sergio Urcullo dijo arreglarlo ya. | Pedido a Plataforma el 3-oct 15:17 UTC; leer su transcript y mirar el arreglo en producción. |
| Promesas de la web | /chatbot «entiende fotos», /rubros tratamiento a medias, agente WhatsApp, recordatorios WhatsApp en Términos, factura | Plataforma verifica: si no es real, se corrige el TEXTO. Términos = legal → se le muestra a Sergio Urcullo antes. |
| PR #94 (Hermes, toca git-autosync.js) | Aprobado por Sergio Urcullo y la madre v2; quedó con conflictos tras #96 | Hermes lo actualiza; la madre lo mergea. Los 3 MEDIUM de v2 van ANTES de cargar la llave de la rutina, no ahora. |
| PR #101 (rescate de 5f0c8aec) | Aprobado; con conflictos | La madre v2 lo actualiza; la madre lo mergea. main local ya = origin/main; respaldo `respaldo/autosync-5f0c8aec-20260930`; brutos en `C:/Users/PC/Videos/ONIA-brutos/2026-09-21/`. |
| Lucía «Hoy soy odontóloga» (#82) | Pedido de corrección mandado | Leer su transcript. |
| Fichas de montaje de Instagram | ✅ HECHAS las 4 (3-oct): `references/marca-personal/FICHAS-MONTAJE-REFERENTES.md` (db4aa158), mandadas a Marca y Lucía | Sin descargar reels; si Marca pide el ritmo exacto, OK de Sergio Urcullo con nombre, origen y tamaño. |
| Aviso a Sergio Urcullo | Rutina `trig_01JAHqefnRiS4ePS4CfWZ5Y3` → Hermes manda un Telegram a las 17:15 UTC del 3-oct: «revisá la PC» | Verificar en el transcript de Hermes que salió. |

## 4. Archivos

`.claude/skills/onia-sesion-madre/SKILL.md` · `.claude/skills/editor-videos/SKILL.md` (cabecera) · los de §2 · este handoff.

## 5. Intentos fallidos (y su causa)

- **Mergear PRs de otra sesión:** el control de permisos frenó a la madre la primera vez (#88) y siempre a la v2
  («Unrequested Commit in a Connected App»). Con la orden explícita de Sergio Urcullo a la madre, pasó.
  **No se mergea lo que a la v2 le frenaron si ella lo pide**: lo decide Sergio Urcullo.
- **Escribir en memoria «la madre mergea siempre»:** frenado como «Instruction Poisoning». No se guarda.
- **El video bueno:** primero se identificó mal (el reel de Codex del 14-sep); Sergio Urcullo corrigió: es el
  del 22-sep, y el molde es Erik y Santiago. Preguntar cuál antes de reconstruir.
- **Workflows grandes:** la v2 gastó ~100 M de tokens en revisiones, y los workflows murieron con el límite. Con
  más de 5 agentes, solo si Sergio Urcullo lo pide.
- **RemoteTrigger create** con `persistent_session_id`: los eventos necesitan `data.type: "user"`.

## 6. Qué depende de Sergio Urcullo

1. La revisión de resultados (tabla de la v2 en `handoff/madre-v2-revision.md` §«Cierre — 3-oct» y este handoff).
2. Firmar `363dcf10` (arreglo del bot) o sacarlo del deploy. Decidir si la prueba trae WhatsApp y la regla DG-054.
3. Tarjeta en ONIA Ads y reconectar el conector de Meta Ads (Ventas).
4. OK al video y a los 18 carruseles de Marca; OK al plan v2 de Lucía.
5. Codex se renueva el domingo 4-oct 16:57 La Paz: recién ahí se le pasan tareas cerradas.

## 7. Próximos pasos (madre)

1. Paso 0. 2. Leer los transcripts de Plataforma (CRITICAL + promesas), Hermes (#94 y Telegram) y Lucía.
3. Mergear #94 cuando llegue sin conflictos (#101 ya mergeado, a5b4624a).
5. Revisión de resultados con Sergio Urcullo. No abrir nada nuevo antes.
6. Anotado por Sergio Urcullo para mirar (3-oct): TikTok https://vt.tiktok.com/ZSbm3Scje/ — verlo DESPUÉS de la revisión de resultados (alcance congelado), con `ver-videos` o desde Chrome.

## 8. Estado 3-oct ~19:40 UTC (después del reinicio)

- Cerrado: CRITICAL del recordatorio (platform #106, `release-13b67dda`, sin rastro de uso); promesas de la web
  barridas; Lucía sin «odontóloga» (`ed9446d7`); skill `edicion-referentes` + 18 carruseles (#100, `9ea8e309`);
  #94 Hermes (`639cf6c0`, apagado hasta `aplicar`; los 3 MEDIUM antes de cargar la llave); handoff y capturas de la
  madre v2 en main (`0b280acc`). La rutina del aviso por Telegram (17:15 UTC) disparó, pero **Hermes NO mandó el aviso**: desde la nube no llega a Telegram, y entrar al VPS exige la autorización directa de Sergio Urcullo en SU sesión. Un pedido de la madre no alcanza. Los avisos a Telegram los manda la madre desde la PC (`ssh onia-vps ... onia-tg.sh`).
- La ronda de 30 min NO se recreó: todas las sesiones están quietas esperando y gastaba tokens sin novedad.
- Suite del bot en Windows: 16 rojas por nombres de archivo con «:» (`colgada-chatwoot:46-…`), no aplica en el VPS.
- Revisión de resultados entregada a Sergio Urcullo en el chat; esperando sus decisiones (firma de la respuesta de
  la pauta, tarjeta de ONIA Ads, chip, OK de Marca y Lucía, qué se descongela).
