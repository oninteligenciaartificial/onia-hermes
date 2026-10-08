# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

## VIGENTE — 8-oct-2026: Sergio devuelve la orquestación a Claude

Sergio indicó a Codex «serás orquestado por Claude». Claude vuelve a ser la única madre principal y Codex queda ejecutor/revisor. Leer primero el bloque 8-oct de [`madre-codex.md`](madre-codex.md), que conserva entregas y bloqueos recientes. No reanudar los IDs históricos ni ejecutar los procedimientos de abajo como si siguieran vigentes. Receptora Claude exacta/acuse aún no identificados; transferencia de rol decidida, conexión automática no probada. Heartbeat de la antigua madre Codex pausado; ningún nuevo loop creado.

Regla: CLAUDE.md §1. Método (ids, canales, cómo se delega a Codex, tokens): **skill `onia-sesion-madre`**.
Este archivo es el ESTADO al **5-oct, 20:40 UTC**, cuando Sergio Urcullo pidió «cambio de sesión madre».
La madre saliente (`cfdce1bb…`, rama `claude/onia-sesion-madre-77f719`, worktree `infra-loops-revision-3fc7b1`) llevaba
días abierta y su conversación costó ~777 M de tokens. **La madre nueva arranca de cero y lee solo esto.**

## ▶ VIGENTE — 5-oct ~21:15 UTC: la madre estuvo en la NUBE y vuelve a la PC

Sergio Urcullo abrió la madre en la nube por error (`session_01BZwYEL4eSUkdPWL36ibLkd`, entorno «onia-higgsfield») y pidió
volverla local. **Desde la nube se ordena bien a las sesiones de la nube, pero no se llega a las locales ni al Chrome.**
Lo de abajo (§0-§7) sigue valiendo; esto es lo nuevo.

**Hecho en la madre de la nube (todo en `main`):**
- Leídos los 5 «RESUMEN PARA LA MADRE NUEVA» (Plataforma, Ventas, Marca, Lucía, Hermes). Confirmado: #108, #109 y #111
  están en producción (release `97fe3061`, bundles mirados por Plataforma).
- Mergeados los handoffs #128, #129, #130, #131, #133 y #137 (skill madre con los ids nuevos + tareas de la madre v2).
- Plataforma: tarea de la **prueba del chip** (solo lectura en prod: `listoParaConectar`, `addon.whatsapp`, correo
  `+qachip`; verificar plantilla `recordatorio_cita` e inbox después de «conectado»).
- **Hallazgo:** `onia-platform/lib/chatbot/embedded-signup.ts:142` manda `featureType: ""` (alta estándar: el número
  pasa a la API), pero `CanalWhatsappCard.tsx` promete coexistencia («sigue siendo tuyo en tu app»). Pasado a Plataforma:
  si la promesa es falsa, se corrige el texto.
- Guía del chip dada a Sergio Urcullo: chip SIN WhatsApp instalado → Otorgar `addon.whatsapp` en
  `/admin/organizations/cmuqzov3y000001mzmrcq0i2t/capacidades` → entrar con `+qachip` → Configuración → Chatbot →
  Conectar → portafolio nuevo y nombre visible **«Onia Pruebas»** (lo eligió él; no el portafolio «Onia») → SMS → «conectado»
  → 3 citas a 1 h 30-2 h 30 con su número personal como paciente, un botón distinto en cada recordatorio.
- Lucía pidió VPS: recomendación a Sergio Urcullo, **no** (la llave vive solo en «Onia»). El `ls` de
  `/root/.config/onia-publicar/` que pidió lo frenó el control de permisos («Production Reads»): no se reenvía a otra sesión.
- Competencia: **no abrir sesiones** (mapa de 28 + fichas; faltan clientes, no estudio).

**Lo que estaba en vuelo (ya en `main`; la madre de la nube se puede archivar):**
1. ✅ Hecho (onia-hermes#141): cola de Codex en `docs/handoff/codex-relevo.md` + 5 prompts en `docs/handoff/codex-tareas/`
   (C15, C13, C14, C11a, C11b), con el estado medido de los 15 puntos; la lista completa de pendientes de Sergio Urcullo
   está en §6b. Plataforma ya sabe qué archivos no toca. Falta que la madre v2 la lance (su handoff, tarea 2).
2. ✅ Hecho: el TikTok `https://vt.tiktok.com/ZSbm3Scje/` (mandado el 3-oct, nunca analizado) está en
   `references/video-intake/2026-10-05-tiktok-ZSbm3Scje.md`. Qué tomar: la serie «Día N/7» con el cierre «Mañana» y las
   tarjetas que se arman con el dato.

**Sesiones al 21:10 UTC** (ids en la skill `onia-sesion-madre`):
- **Plataforma:** trabajando (prueba del chip + punto 1).
- **Ventas:** en pausa, sin tarea. Propuesta: 10 clínicas dentales de Santa Cruz con señal + el mensaje 1:1 de cada una
  para que lo mande Sergio Urcullo (sin enviar nada).
- **Marca:** carruseles agendados para el martes 6, 16:00. Espera 3 decisiones de Sergio Urcullo: rehacer las 10 láminas o
  publicar los 7 carruseles sin ellas; agendar N03 («modo auto») el viernes 9; subir los 6 guiones a Drive.
- **Lucía:** bloqueada (cuenta demo para las pantallas reales; pide VPS).
- **Hermes:** abrió el PR #138 con 2 revisores. Verificar qué es: su handoff dice que nada avanza sin el sí de Sergio Urcullo.
- **Madre v2 nueva:** `session_01CYBTxzz2ti5WAStSfSAruE` (local, «Madre v2 de Onia: revisión de PRs»), esperando tarea.
  Sus tareas están en `madre-v2-revision.md` § «VIGENTE — 5-oct». Desde la PC se le escribe con `SendMessage`.

**Intentos fallidos desde la nube (no repetir):**
- `list_events` / `send_message` a una sesión local: `elevated_session_untrusted_device`; a una local cerrada: `session_inactive`.
- Conector de Gmail: «Precondition check failed» (no se puede confirmar el correo de las QA desde la nube).
- `ssh onia-vps` de solo lectura: frenado por «Production Reads».
- `git grep` sobre todo `hermes-content` tarda más de 120 s (repo pesado): acotar rutas.

**Primeros pasos de la madre local:**
1. Paso 0 (Remote Control, Chrome, `ListAgents`).
2. Mandarle a la madre v2 su tarea por `SendMessage`.
3. Darle tarea a Ventas (la de arriba).
4. Leer en el transcript de Plataforma cómo salió la prueba del chip.
5. Revisar el PR #138 de Hermes.
6. Cuando la cola de Codex esté en `main`, archivar la madre de la nube (`session_01BZwYEL4eSUkdPWL36ibLkd`).

## 0. Al abrir (en este orden)
1. Remote Control encendido; Chrome con la extensión Claude (`list_connected_browsers` ≠ []).
2. `ListAgents`. Cada sesión deja en su transcript un **«RESUMEN PARA LA MADRE NUEVA»** (pedido el 5-oct): leer SOLO ese
   evento con `RemoteTrigger get_run_log` (es lo último de cada transcript). La madre v2 (local
   `local_4cf12f8b-cd4b-4c1a-8900-f37da63ae707`) contesta por SendMessage.
3. **Un resumen vale solo si viene de la sesión que corresponde.** El 5-oct llegó un «resumen de la madre v2» desde
   `observer-sessions-*` (el observador de claude-mem) con datos falsos: decía que #109 y #110 eran de hermes y que el
   handoff de la v2 «se subió», y su último commit era del 4-oct. Se ignora. El de la v2 llega desde `local_4cf12f8b…`.
4. No recrear la ronda de 30 min salvo que Sergio Urcullo la pida: gasta tokens sin novedad.

## 1. Objetivo vigente (decidido por Sergio Urcullo, 3/4-oct)
**La 1.0 lista para cobrarle a las primeras 5 clínicas dentales**: `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md`
(15 puntos; los 1-4 para el **16-oct**, todo para el **30-oct**). Orden del negocio de Sergio Urcullo:
1) marca personal + auditorías + llamadas 1 a 1 + comunidad (gratis); 2) la 1.0; 3) competencia (ya cubierta).
Caja de **Bs 4.000**. Gasto fijo de ~Bs 1.611/mes (Codex USD 100, VPS USD 40, Higgsfield anual ya pagado).
Techo para conseguir clientes: **Bs 1.400** (Meta 750). Solo dental hasta tener la factura del SIAT.

## 2. Qué quedó en producción / en main
- **onia-platform master** (verificar el deploy: el handoff de Plataforma decía `release-13b67dda` del 3-oct):
  - #108 (tratamiento a medias en la prueba de 14 días, agenda y cobros, textos a pacientes de **usted**, seguridad B22
    del canal de citas);
  - #109 (punto 12, de Codex: CSV con «;» + WhatsApp de soporte en /help);
  - #111 (punto 2: la factura llega después de verificar el pago y el titular del QR se explica).
  Mergeados del 4 al 5-oct. **Confirmar con Plataforma que están PUBLICADOS y mirados en prod.**
- **Docs en onia-hermes main:**
  - el plan de la 1.0 y la caja;
  - la auditoría de cobro y autoservicio (`research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`);
  - el costo del chatbot (`research/ONIA_COSTO_CHATBOT_META_2026.md`: Bs 390 = ~99 % de margen; Meta le cobra a la
    clínica, con 1.000 mensajes de servicio gratis por número y por mes, verificado en la página renderizada);
  - el mapa de 28 competidores (`research/competencia/MAPA_COMPETENCIA.md` + fichas);
  - el plan de grabación por escena (`docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`) y el KIT-GRABACION;
  - fichas de montaje y video-intake de los reels (mensaje + tema + edición);
  - el playbook de seguimiento de leads (`sales-kit/SEGUIMIENTO-LEADS.md`);
  - el kit de Lucía (7 fotos + 3 clips, 30,5 cr aprobados por Sergio Urcullo el 3-oct, #118);
  - las capturas del presupuesto por fases (`docs/cola/capturas-presupuesto-fases/`, #116);
  - la corrección fiscal: hoy NO hay IVA a servicios digitales del exterior, solo IUE-BE 12,5 % (#123).

## 3. A medias y dónde
| Frente | Estado exacto | Cómo se retoma |
|---|---|---|
| **Caja diaria (punto 8, Codex)** | onia-platform#110 (draft), rama `codex/punto-8-caja-diaria`, head `83f93948`. APROBADA por la madre v2 en 2 vueltas (9 hallazgos arreglados + 2 LOW; 21 tests verdes). Migración `20261004190000_add_daily_cash` **APLICAR ANTES DEL SWAP**. | Plataforma saca capturas (pedido) → la madre se las muestra a Sergio Urcullo → con su OK lo publica Plataforma. Worktree de Codex: `C:/dev/proyectos/onia-platform-codex-caja` (borrar al mergear). |
| **Presupuesto por fases (P2)** | Separado de #108 y sin publicar. Capturas en main (`docs/cola/capturas-presupuesto-fases/`, 12 PNG). | Mostrárselas a Sergio Urcullo (ya se le mandaron 2 el 5-oct) → con su OK lo publica Plataforma. |
| **SQL de permisos del B22 en prod** | `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql`: solo REVOKE, sin datos. **Falta el OK de Sergio Urcullo** para correrlo. | Pedírselo de nuevo; con su OK textual se lo pasás a Plataforma. |
| **Plantillas A y B para los 6 leads de agosto** | Texto aprobado («está bueno»). Desde la nube el control de permisos frenó crearlas porque la orden vino de la madre. El seguimiento ya está (`sales-kit/SEGUIMIENTO-LEADS.md`). | Sergio Urcullo las crea en WhatsApp Manager o se lo pide directo a Plataforma en esa sesión. Después: «salen». |
| **Meta / pauta** | ONIA Ads sigue SIN tarjeta: a Sergio Urcullo le falta el «control total» de la cuenta publicitaria («Unable to update permissions»). El número del bot **+591 75414930** hay que vincularlo a la página «Onia» («Conectar otro número»; no borrar su celular 78491375). | Configuración de la empresa → Usuarios → Personas → él → control total de ONIA Ads → Métodos de pago → Visa 4028. Verificar con `ads_get_ad_accounts` (`has_payment_method`). La pauta va desde el 16-oct, con reglas de corte (plan §3). |
| **Firma de la respuesta del bot a la pauta** | Versión de USTED en el chat del 3-oct; el commit `363dcf10` está en main sin publicar. | Pedir «firmo»; Ventas actualiza el knowledge y lo publica. |
| **Grabación** | Sergio Urcullo grababa el 3/4-oct con PLAN-GRABACION. | Cuando mande los brutos: T1 de Codex (`docs/handoff/codex-relevo.md`) o Marca → tabla de cortes + preview 360p ANTES de cortar. |
| **Hermes** | #94 en main y apagado. Propuesta: que el autosync deje de hacer fast-forward de main (variable para el integrador). Toca CLAUDE.md. | Sí o no de Sergio Urcullo. Si es sí, los 3 MEDIUM + el cambio del autosync, con revisión fuerte. |
| **Codex** | CLI `0.139` viejo: `gpt-6-*` falla y se usa `-m gpt-5.5`. | Preguntar si se actualiza el CLI (`npm i -g @openai/codex`, pide OK). Cola: `docs/handoff/codex-relevo.md`. |

## 4. Archivos de la madre
`.claude/skills/onia-sesion-madre/SKILL.md` (tokens y delegación a Codex) · `.claude/skills/ver-videos/SKILL.md` (regla
mensaje/tema/edición) · `AGENTS.md` (skills para Codex) · `docs/handoff/codex-relevo.md` · este archivo.

## 5. Intentos fallidos (y su causa)
- **Aviso por Telegram programado vía Hermes (3-oct):** no salió. La nube no entra al VPS si la orden viene de otra
  sesión. Los avisos los manda la madre desde la PC.
- **`codex exec` sin `-m`:** falla (`gpt-6-luna` del config no está soportado; los gpt-6 piden un CLI más nuevo).
- **Codex no puede commitear:** el `.git` del worktree queda fuera del sandbox. Commitea la madre.
- **La madre subió un test rojo (`5c58175c`):** el `grep` de la salida no cortaba la cadena. Ahora hay un gate en el comando.
- **Plantillas y skills editadas «a pedido de otra sesión»:** el control de permisos de la nube las frena
  (Self-Modification, «transacción real»). Lo que es de Sergio Urcullo lo pide él en la sesión destino.
- **«1.000 mensajes gratis» de Meta:** primero se leyó en la ayuda de Wati, después WebFetch trajo una versión vieja que
  decía «sin tramo». La verdad salió de la página **renderizada en Chrome**.
- **Tokens:** la v2 gastó ~425 M y esta madre ~1.840 M, el 95 % releyendo contexto. Madres cortas y workflows de 5
  agentes como máximo.

## 6. Qué depende de Sergio Urcullo (en orden)
1. OK al SQL de permisos del B22 (seguridad, sin datos).
2. Control total de ONIA Ads → tarjeta; número 75414930 en la página.
3. Crear las plantillas A y B en WhatsApp Manager (o pedirlo en la sesión de Plataforma) → «salen».
4. Firmar la respuesta del bot a la pauta.
5. Ver las capturas: el presupuesto por fases (ya están) y la caja diaria (pendientes).
6. Sí o no al cambio del autosync de Hermes. ¿Actualizar Codex?
7. Fechas y techo del plan (16-oct / 30-oct, Bs 1.400). ¿La web y los anuncios pasan a usted?
8. CAFC del SIAT; bucket de respaldos (punto 4); titular del QR con el BCP.

## 6b. Lista COMPLETA de lo que depende de Sergio Urcullo (5-oct, medida contra los 8 handoffs)

Ordenada por lo que más acerca a cobrarle a 5 clínicas. 🔴 = bloquea los puntos 1-4 del 16-oct. Manda sobre §6.

1. 🔴 **OK textual para correr en producción el SQL de permisos del B22 (punto 3)** — Cierra el punto 3: el código ya está publicado (#108), pero 2 tablas siguen abiertas a la clave pública (GET anónimo da 200) hasta correr el REVOKE. No toca datos.
   - Escribilo DIRECTO en la sesión Plataforma (si lo pasa la madre, el control de permisos de la nube lo frena): «OK: corré en producción prisma/migrations/20261003230000_revoke_anon_onia_sends (solo REVOKE de permisos, sin datos)».
   - Plataforma lo corre y verifica: GET anónimo a /rest/v1/onia_whatsapp_sends → 401 y 0 grants.
   - Listo cuando Plataforma te contesta «401 y 0 grants».
2. 🔴 **Punto 1: cobro completo con la cuenta de prueba «ZZ QA Pago» (+qapago)** — Es el punto 1 de la 1.0: hoy hay 0 pagos registrados. Sin el cobro de punta a punta probado no se le puede cobrar a ninguna clínica.
   - Abrí el Gmail de Onia (oninteligenciaartificial@gmail.com), buscá el correo de confirmación enviado a oninteligenciaartificial+qapago@gmail.com y tocá el enlace (la nube no puede: el conector de Gmail falla).
   - Escribile a Plataforma: «correo de +qapago confirmado».
   - Plataforma hace el checkout del plan Básico con el comprobante «PRUEBA» y te avisa.
   - Entrá con tu superadmin a app.onia.com.bo/admin/payments y aprobá el pago de «ZZ QA Pago» SIN emitir factura (es prueba, no entra plata).
   - Escribile a Plataforma: «aprobado». Ella verifica que el plan quedó activo y mira /checkout, /help y /patients/import (eso cierra también la verificación de los puntos 2 y 12).
   - Si Plataforma perdió la clave (vive solo en su scratchpad), que use «Recuperar acceso»: el correo llega al mismo Gmail.
3. 🔴 **Crear el bucket de respaldos en Cloudflare R2 y aprobar rclone (punto 4)** — Cierra el punto 4: hoy los respaldos viven en el mismo disco del VPS y nunca se probó una restauración. Tiene que estar antes de que una clínica cargue pacientes reales. Costo USD 0 (entra en los 10 GB gratis).
   - En el panel de Cloudflare, abrí R2 y creá el bucket «onia-backups».
   - Creá un token de API limitado a ese bucket. No lo pegues en ningún chat: cargalo donde te indique Plataforma (regla de hermes-content/skills/seguridad-credenciales.md).
   - Escribile a Plataforma: «bucket onia-backups y token listos; apruebo traer rclone (imagen Docker rclone/rclone)».
   - Abrí el panel de Hostinger, buscá si el VPS tiene snapshots y decíselo a Plataforma.
   - Plataforma instala la copia diaria cifrada (supabase-db, chatwoot-db, Storage y n8n) y prueba una restauración. Listo cuando te muestra el archivo del día bajado de R2 y restaurado.
4. 🔴 **Confirmar que OniaAgency puede facturar en el Portal Web del SIN (ensayo sin emitir)** — Desde el 5-oct el checkout en producción promete «factura por correo después de verificar el pago» (punto 2). Si el portal no deja facturar, el primer cobro rompe esa promesa, y cobrar sin factura arriesga una clausura de 6 a 48 días (punto 15).
   - Abrí vos, a mano, pweb.impuestos.gob.bo con las credenciales de OniaAgency. Si operás vos y no Leslie, que ella te autorice.
   - Entrá a «Emisión Factura Compra Venta» SIN emitir (toda factura emitida es real): confirmá la sucursal 0, el punto de venta y que esté cargado el servicio «Suscripción Onia» con su código.
   - Con el contador, elegí la actividad de la suscripción (4651200 o 6209920) y confirmá que exista en el clasificador nuevo del RNC. Plazo de la homologación: 30-oct.
   - Mandale una captura a Plataforma: «sí factura» o qué falta.
5. **Cuenta demo «Clínica Demo Onia»: confirmar su correo y darle module.agents (punto 9)** — Cierra el punto 9 y destraba las demos de venta (hacen falta unas 20 para 5 clientes), las pantallas reales de los reels de Lucía y la imagen del día 3 del seguimiento de leads.
   - En el Gmail de Onia, buscá el correo de confirmación enviado a oninteligenciaartificial+demo@gmail.com y tocá el enlace.
   - Entrá con tu superadmin a app.onia.com.bo/admin/organizations/cmur09d75000601mz12vg59qn/capacidades.
   - En «Módulos», otorgá module.agents.
   - Escribile a Plataforma: «demo confirmada y con module.agents». Ella mira que el recall proponga a Natalia Terceros y Marcelo Vargas.
6. **Crear las plantillas A y B y mandárselas a los leads de agosto** — Canal 1, el más barato: 7 personas que ya escribieron y esperan desde agosto (Bs 0 a 7, ~3 demos). El texto ya lo aprobaste («está bueno»); solo falta crearlas y mandarlas.
   - Creá A (disculpa + demo de 20 min) y B (disculpa + respuestas en pantalla en 20 min) en WhatsApp Manager del 75414930, con los botones «Sí, coordinemos» / «Ahora no». O escribile vos directo a Plataforma en SU sesión: «creá las plantillas A y B de los leads de agosto» (si lo pide la madre, el control de permisos lo frena).
   - Antes de mandar, mirá en app.onia.com.bo/admin/solicitudes si Maximo, Leonardo o Edwin ya crearon cuenta: si la crearon, se les pregunta cómo les fue, sin ofrecer demo.
   - Mandalas desde Chatwoot, inbox 5 «Onia WhatsApp», con TU usuario (así el bot se calla). A: Maximo, Leonardo y Edwin. B: «F» (4 doctores) y Mario. A «F» no se le promete el tratamiento a medias.
   - Al sexto (Saguilera, solo correo): el borrador de ONIA_LEADS_ESPERANDO.md §3.3, por correo.
   - Escribile a Ventas: «salieron». Ventas sigue con las respuestas de SEGUIMIENTO-LEADS.md §2.
7. **Auditoría gratis: elegir A o B y crear el evento en cal.com** — Es el paso del embudo gratis (lo primero de tu orden: marca personal + auditorías + llamadas 1 a 1) que convierte seguidores en llamadas. Hoy no existe en ningún lado, y los mensajes 1 a 1 dependen de esto.
   - Leé ONIA_COMUNIDAD_CONTENIDO.md § «Auditoría gratis y llamada 1 a 1» y contestale a Marca personal: «A» (recomendada: para dueños de clínicas dentales de Santa Cruz) o «B».
   - En cal.com, al lado de «Llamada 1 a 1», creá el evento «Auditoría gratis de su clínica», enlace cal.com/sergiourcullo/auditoria, 20 min, Google Meet, con la descripción y las 2 preguntas obligatorias del doc. O pedíselo a la madre, que lo hace con Chrome.
   - Poné el enlace en tu bio y en el grupo «Onia Community».
   - Avisale a Ventas para que meta la auditoría en los mensajes 1 a 1.
8. **OK a los 12 mensajes a prospectos y decidir MUN** — Canal 2: los prospectos de agosto dan unas 4 demos a Bs 0. Todavía no se contactó a nadie.
   - Abrí https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV (versión 8, 12 listos). Si ya aprobaste la auditoría, pedile antes a Ventas la versión que la ofrece.
   - Mensaje por mensaje: OK o cambio, escrito a Ventas.
   - MUN: decí si entra con 2 sedes en Santa Cruz o sale.
   - Mandalos vos desde tu WhatsApp (botón «Abrir en WhatsApp» de la página) y avisale a Ventas para que anote cada envío con la fecha.
9. **Aprobar el seguimiento de los días 3, 7 y 14 (4 plantillas, la imagen y el audio)** — Si los leads no contestan en 24 h, cada toque necesita una plantilla aprobada por Meta. Conviene crearlas ya, porque Meta tarda en aprobarlas. Costo ≈ USD 1,5.
   - Leé la tabla de SEGUIMIENTO-LEADS.md §3 (seguimiento_d3_imagen, seguimiento_d7_audio, seguimiento_d14_cierre y seguimiento_30d) y escribile a Ventas: OK o qué cambiar.
   - Imagen del día 3: OK a pendientes-confirmador.png, o sacá una de producción en la demo (/pending).
   - Grabá una nota de voz de ~30 s sobre esa captura: Ventas la arma como video con el comando ffmpeg del doc.
   - Creálas en WhatsApp Manager (MARKETING, sin variables) o pedíselo a Plataforma en SU sesión.
10. **Firmar la respuesta del bot a la pauta** — Sin la firma no se publica el bot de usted (#114) y deploy-bot.sh sigue frenado por los 11 tests rojos del commit 363dcf10. Las conversaciones de la pauta del 16-oct caen en ese bot.
   - Leé el texto en .claude/skills/onia-ventas-pauta/SKILL.md §1 («¡Gracias por escribir desde el anuncio! Para mostrarle Onia con el caso de su clínica…»).
   - Escribile a Ventas: «firmo» o el cambio.
   - Ventas lo pone en knowledge.onia.json y corre la suite. La madre o el carril chatbot lo publica.
11. **ONIA Ads: control total, tarjeta y el 75414930 vinculado a la página «Onia»** — Medido el 5-oct: act_1073680778314945 sigue con has_payment_method: false. Sin tarjeta no se crea nada en Meta, ni siquiera en pausa, y no hay pauta el 16-oct.
   - En business.facebook.com, portfolio OniaAgency (1451773736711697): Configuración de la empresa → Usuarios → Personas → vos → dale control total de ONIA Ads.
   - Si vuelve «Unable to update permissions», mandale una captura a la madre.
   - En ONIA Ads → Métodos de pago → elegí la Visa ···· 4028.
   - En la página «Onia» de Facebook, buscá «Conectar otro número» (WhatsApp) y vinculá el +591 75414930. No borres tu celular 78491375.
   - Avisale a Ventas: verifica con ads_get_ad_accounts que has_payment_method dé true.
12. **Fechas, caja y OK de gasto de Meta desde el 16-oct** — Sin tu OK escrito no se enciende la prueba de pauta (canal 4, unas 3 demos con Bs 750), y las fechas de la 1.0 siguen siendo una propuesta.
   - Confirmá las fechas: 16-oct para los puntos 1-4 y 30-oct para la 1.0.
   - Confirmá la caja de §2: reserva Bs 2.533 y techo Bs 1.400 (Meta 750). Ojo: §5 todavía dice reserva Bs 3.226; vale la de §2.
   - Confirmá que el VPS está pago (la renovación figuraba pendiente desde el 29-sep). El plan reserva Bs 1.383 para 3 meses.
   - OK de gasto: US$4 por día durante 14 días desde el 16-oct, con los cortes de los días 3, 7 y 14 (plan §3).
   - Decidí quién contesta las conversaciones de la pauta antes de 24 h.
   - En el próximo extracto, anotá a qué tipo de cambio te cobró el banco la tarjeta (si pasa de 13,4, se corta antes del día 14).
   - Escribíselo a la madre: Ventas crea la campaña en pausa y la enciende con ese OK.
13. **Grabarte 30 s con la pantalla para el anuncio** — Los 7 anuncios de la competencia que sobreviven tienen una persona, y D1 no. El presentador IA queda descartado: el plan §4 no permite generaciones pagas para la pauta este mes.
   - Grabá 30 s, celular vertical, mostrando la pantalla real de la demo.
   - Subilo a Drive «Videos Onia Octubre» y avisale a Ventas.
   - D1 v3 se te muestra recién cuando Ventas saque «La IA escribe el mensaje» (el catálogo §8 no lo permite).
14. **Decidir hasta dónde llega el «usted»** — Pacientes y bot de ventas ya van de usted. Quedan de vos la web, los anuncios, la app y los correos al dueño, dos plantillas de Meta y el recepcionista. Una respuesta destraba a 3 sesiones.
   - Contestale a la madre 4 sí o no: 1) ¿la web y los anuncios, de usted? 2) ¿la app y los correos al dueño, de usted? 3) ¿plantillas nuevas de seguimiento_demo y recordatorio_demo, de usted? 4) ¿el recepcionista (R_*), de usted, o lo elige cada negocio?
   - La madre reparte: web y app a Plataforma, anuncios y plantillas a Ventas.
15. **Publicar el video N03 «modo auto»** — Está terminado desde el 3-oct y es la única pieza de video lista de la marca personal (tu canal n.º 1).
   - Miralo: se te mandó el 4-oct como archivo y está en el VPS en /root/publicar/n03-modo-auto/final.mp4 (con caption.txt).
   - O lo subís vos, o en la sesión Marca personal pasás el modo de «Auto» a «Accept edits» y escribís «publicalo en <red> el <día y hora>».
16. **Grabar y subir los brutos de los bloques 1 (verde) y 2** — En Drive solo está el bruto de N03 del 1-oct: sin brutos no hay videos nuevos ni nada para editar (Codex T1 y Marca personal esperan).
   - Grabá siguiendo docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md y KIT-GRABACION.md, con el bloque verde primero, trípode, micrófono de solapa y una toma de cierre.
   - Subilos a Drive «Videos Onia Octubre».
   - Avisale a Marca personal (o a Codex, tarea T1): te muestran la tabla de cortes y el preview en 360p ANTES de cortar.
17. **Los 18 carruseles: aprobar, decidir las 10 láminas y agendar** — Están renderizados y revisados desde el 3-oct. El calendario del 3 al 20-oct ya se corrió y no salió ninguno.
   - Mirá https://claude.ai/artifact/FzA8mtJhv81wwADHhYfGgK (las 10 láminas a rehacer están en naranja).
   - Escribile a Marca personal: «rehacé las 10» (1,20 cr, tope 1,50) o «van sin imagen».
   - Escribí «ok, agendá» y pasá esa sesión de «Auto» a «Accept edits» (en Auto, publicar queda bloqueado).
   - Marca reprograma las fechas y te muestra el calendario nuevo.
18. **OK al presupuesto por fases (P2, punto 7)** — Cierra el punto 7. Las capturas ya están; es diseño nuevo, así que necesita que lo veas antes de publicar.
   - Mirá las 12 capturas en hermes-content/docs/cola/capturas-presupuesto-fases/ (dental y estética, a 390 y 1440). Dos ya te llegaron el 5-oct.
   - Escribile a Plataforma: «OK P2» o qué cambiar.
   - Plataforma aplica presupuesto-por-fases-p2.patch, pasa el CI y publica.
19. **OK a la caja diaria (punto 8, #110) cuando lleguen las capturas** — Cierra el punto 8. Ya tiene la revisión aprobada en 2 vueltas; falta que veas la pantalla nueva.
   - Esperá las capturas en hermes-content/docs/cola/capturas-caja-diaria/: sin abrir; abierta con 4 cobros y 1 egreso; cerrada con descuadre; como dueño y como recepción.
   - Escribile a Plataforma: «OK caja diaria» o qué cambiar.
   - Plataforma corre la migración 20261004190000 ANTES del swap y publica.
20. **Mirar con tu sesión las pantallas que ya están publicadas** — Verificar es mirar: lo publicado el 4-oct (#108) y el tablero «La operación» (#107) nadie lo miró con una cuenta de dueño o de superadmin, y se va a mostrar en las demos.
   - En app.onia.com.bo/patients, el filtro «A medias».
   - En la ficha de un paciente con saldo, la etiqueta «Deuda».
   - En /agenda, «Mañana sin confirmar» y una cita «Reprogramada».
   - En /dashboard con tu superadmin, el tablero «La operación» (tiene que decir 0 de 5 pagando, Bs 0).
   - Si algo se ve mal, mandale la captura a Plataforma.
21. **Titular del QR de cobro con el BCP** — El checkout dice OniaAgency y el QR del BCP muestra un nombre de persona. Desde #111 está explicado en pantalla, pero puede frenar el pago de una clínica.
   - Andá o llamá al BCP y pedí que el QR de cobro muestre OniaAgency.
   - De paso, preguntá por el trámite de las credenciales del API QR (el QR dinámico ya está programado y espera eso).
   - Si cambia, avisale a Plataforma para sacar la aclaración del checkout.
22. **SIAT: CAFC del piloto, llamada al SIN y prórroga (vence el 4-nov)** — El trámite 9473 vence el 4-nov. Sin el CAFC no se corren los 180 casos que faltan y se pierde la factura automática, la que después destraba comercio y servicios.
   - Vos, a mano, en el portal del SIAT: sacá el CAFC del piloto para los sectores 1 y 17, sucursal 0 (y puntos de venta 0 y 1 si lo pide por punto de venta). Captura del código y el rango.
   - Llamá al 800 10 3444 con las preguntas de ONIA_FACTURACION_ESTADO_REAL.md §7 (primero la 1 y la 7).
   - Con la respuesta 7, pedí la prórroga de 60 días (Autorización de Sistemas → Solicitud de Prórroga) antes del 4-nov.
   - Mandale las capturas a Plataforma (las carga en /opt/onia-siat/runner-20260929/).
23. **Actualizar el CLI de Codex** — Codex sigue con la 1.0 cuando se acaben los tokens de Claude. Con el CLI 0.139, los modelos gpt-6 fallan y hay que forzar -m gpt-5.5.
   - En la PC, dale el OK a la madre para correr: npm i -g @openai/codex.
   - Que pruebe codex --version y una tarea corta sin -m.
   - Si falla, se sigue con -m gpt-5.5 como hasta ahora.
24. **WhatsApp Manager: caso de soporte por la plantilla AUTHENTICATION, PIN y descripción** — Meta no deja crear la plantilla de autenticación (code 10, subcode 2388185), y eso bloquea la verificación del alta por WhatsApp. El PIN protege el número de ventas.
   - Abrí WhatsApp Manager del 75414930 y buscá cómo abrir un caso de soporte con el error «Esta cuenta de WhatsApp Business no tiene permiso para crear una plantilla de mensaje» (code 10, subcode 2388185, AUTHENTICATION). No uses UTILITY con el código.
   - Activá el PIN de dos pasos.
   - Cargá una descripción de una línea en el perfil.
25. **Lucía: decidir D2 a D6, mirar el kit y conectar su Instagram** — Ningún reel de Lucía puede salir: L02 está editado y espera tu OK, y K1-K4 esperan además la cuenta demo (ítem 5).
   - Contestale a Lucía D2-D6 de hermes-content/docs/cola/lucia-diario/PLAN.md. Recomendado: D2 sí (Reel primero); D3 todavía no; D4 sin voz; D5 OK o corregir los 10 datos de LUCIA.md §0-canon; D6 sí, en la pieza #8.
   - Mirá references/modelos/lucia/v4/kit/kit-fotos-hoja.jpg y kit-clips-preview.mp4, y decí OK o no a L02 («Este video no fue grabado»).
   - Conectá @lucia.antelo.oficial como te indique la sesión y en Instagram buscá y activá «Perfil generado con IA».
   - Reservá «Lucía Antelo» en las otras redes (@mindshft.ai vende otra «Lucía»).
26. **Molde Boceto y largo de los guiones R y G** — El molde Boceto (videos sin cara) está sin probar, y los guiones de ~60 s no entran en el molde Pablo de 21 s.
   - Si querés probar el Boceto, sacá fotos de 4 a 6 dibujos tuyos y subilas a Drive.
   - Escribile a Marca personal si los guiones R y G se acortan a 21 s o quedan largos.
27. **Hermes: sí o no al cambio del autosync, y después la llave de la rutina** — Hermes está apagado en el VPS. El autosync sigue metiendo ramas claude/* a main sin revisión (#82 y #76 entraron así).
   - En la sesión Hermes-Jarvis, escribí «sí» o «no» al cambio: que el autosync deje de hacer fast-forward de main y solo lo haga el integrador, con una variable. Si es sí, se corrige la regla de CLAUDE.md.
   - Escribí «sí» a cerrar los 3 MEDIUM antes de la llave.
   - Después: entorno «Pedidos de Hermes» sin variables, la rutina y la llave según handoff/hermes-jarvis.md §7, pasos 2 a 4. Nunca por chat.
   - Correr aplicar por el workflow entre las 06:30 y las 22:00 de La Paz: gh workflow run hermes-jarvis.yml --ref main -f accion=aplicar.
   - Decidí si se revoca GH_ACTIONS_TOKEN del entorno «Onia»: hoy cualquier sesión puede despachar aplicar, revertir o el deploy.
28. **Cuentas de prueba: cambiar la clave expuesta y autorizar el borrado al cerrar** — La clave de «ZZ QA Clínica Chip» se pasó por chat y hay que tratarla como expuesta. Las cuentas de prueba no se borran sin tu OK.
   - Entrá con esa cuenta (oninteligenciaartificial+qachip@gmail.com) a app.onia.com.bo/profile y cambiá la clave.
   - Cuando cierre la 1.0, escribile a Plataforma: «OK, borrá las QA» (ZZ QA Pago, ZZ QA Clínica Chip).
29. **Competencia: decir que no a las capturas que faltan** — Quedan AgendaPro, Doctoralia y Eholo esperando tu OK de gasto. Recomendación: no, porque la competencia ya está cubierta (mapa de 28 y 16 fichas) y no cambia la 1.0.
   - Escribile a la madre: «competencia cerrada, no se hacen más capturas», o «OK, de a un anunciante» con el tope.

## 7. Próximos pasos (madre nueva)
1. Paso 0 y los resúmenes de cada sesión.
2. Confirmar con Plataforma qué está PUBLICADO (#108, #109, #111) y mirado en prod.
3. Capturas de la caja diaria → Sergio Urcullo → publicar con la migración antes del swap.
4. Destrabar la lista de §6 con Sergio Urcullo, de a una.
5. Siguientes puntos de la 1.0 para Codex (sin pisar a Plataforma): mirar `ONIA_PLAN_1.0_Y_CAJA.md` §1 y elegir los
   cerrados (5, 6, 10 y 11 tocan agenda y pacientes: coordinar con Plataforma antes).
