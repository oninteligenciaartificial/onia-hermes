# Hermes, calendario y agentes — 28-sep-2026

## Diagnóstico verificado

Lectura del VPS entre 21:00 y 21:11 UTC, sin ejecutar modelos ni modificarlo.
Hermes está activo; tiene 14 jobs, cuatro habilitados. La agenda laboral de las
08:00 y los guiones de 08:10 terminaron interrumpidos hoy (`gpt-5-mini`). El
ordenador del tablero de 13:00 falló con 429 TPM (`gpt-5-nano`); solicitó 104.709
tokens cuando ya había usado 110.875 de 200.000. Conserva `context_from:[self]`.
El veredicto de 16:00 terminó correctamente (`gpt-5-nano`). Es estado del job,
no confirmación independiente de entrega de Telegram.

El archivo de agenda generado hoy propone producto 09:00–11:00 sin consultar
Google Calendar, en conflicto con el colegio. Los prompts de agenda, guiones y
veredicto no acreditan disponibilidad real. El router determinista también tiene
horarios fijos: una hora como 11:45 podía recibir «SI» sin consultar eventos.

Fuentes vivas: `/root/.hermes/cron/jobs.json`,
`/root/.hermes/out/agenda-hoy.txt` y nodo de Calendar de la ejecución n8n de
21:00:55 UTC. No se copiaron secretos ni datos de clientes a este informe.
Tablero correcto: `--board onia`, con 40 ready, 5 todo y 18 blocked; la base
por defecto vacía no representa el trabajo de ONIA.

## Calendar y Cal.com son componentes distintos

- Google Calendar personal ya tiene compromisos y bloques ONIA. Codex verificó
  74 eventos en la semana 28-sep–4-oct y, por instrucción de Sergio de repartir
  prioridades, concretó ocho instancias del 29-sep al 2-oct: tres Platform,
  tres clientes y dos marca personal. Conservó horarios, privacidad y recurrencia
  de las demás fechas: 74 eventos después, cero cambios en los otros 66.
- Esa edición la realizó Codex con el conector autorizado, no Hermes. El recibo
  privado de antes/después queda ignorado por Git en Platform
  `.verif-tmp/integration-checks/calendar-private-receipt-20260928.json`.
- Hermes tiene la skill Google Workspace, pero no su OAuth directo ni `gws`.
  n8n sí tiene OAuth funcional en `ONIA - Agenda: Recordatorios`
  (`uwqJDGwkkWJaFtLU`): el nodo de eventos terminó success hoy. Aún no se verificó
  que use la misma cuenta/calendario; no equivale a integrar ese acceso en Hermes.
- `ONIA - Agenda Create API` (`kB10A8oLWioS8lXP`) sirve para crear. No sustituir
  una lectura de disponibilidad por una llamada a ese webhook. Briefing Diario,
  Agenda + energía y Cal Booking están apagados.
- Cal self-hosted no tiene contenedores; `cal.onia.com.bo` redirige a `/empezar`.
  El proceso del bot apunta a `http://calcom:3000`, que no existe ahora. Sus slots
  proceden de ventanas fijas, no de la agenda real. Configuración del proceso y
  archivo `webhook.env` difieren. El fallback hosted recibió 403 desde VPS:
  acceso y sincronización no confirmados, no prueba de que esté caído.

Siguiente implementación operativa: aprovechar el OAuth n8n existente con una
lectura acotada de eventos/busy, confirmar cuenta, zona y calendario, y entregar
ese resultado a Hermes. Si la lectura falla, dar prioridades sin asignar horas.
El ciclo debe terminar verificando los eventos escritos; un mensaje generado no
es un evento creado. No hace falta otro scheduler para los mismos cuatro jobs.

## Corrección local del router

`scripts/hermes_command_center.py` retira las tablas y ventanas fijas usadas por
`Plan Sergio hoy` y `Puedo reunirme`. Sin lector real responde `Agenda no verificada`
y `calendar_verified=false`; las prioridades se reparten entre Platform, clientes
y marca personal, sin asignar horas ni alterar compromisos. Se mantienen `action`,
`telegram_reply`, `ok=true` y salida CLI 0 para que el caller presente la respuesta:
`ok` acredita que la consulta fue procesada, no que exista disponibilidad.

La regresión focal está en `scripts/hermes_command_calendar.test.py`. Las skills
`agenda-calendario.md` y `brief-diario-onia.md` distinguen capacidad actual de
diseño previsto y conservan las políticas comerciales mediante el runbook Cal.
El parche no conecta OAuth, no cambia los prompts de jobs vivos ni modifica el
bot de reservas: la disponibilidad real sigue siendo trabajo pendiente.

Validación del delta: **9/9 pruebas de calendario**, **10/10 de regresión DentalGest**,
compilación de dos archivos Python y `git diff --check` correctos. Las regresiones
fallaron antes del cambio. Revisión independiente real **GPT-5.5 medium**, sin
hallazgos P0/P1/P2 en el alcance suministrado; el integrador verificó los cinco
hashes de fuentes revisadas y seis archivos de evidencia. El reviewer no ejecutó
pruebas ni comprobó producción. [Recibo y límites](revision-calendario-20260928.json).

## Modelos y agentes de esta tarea

Los registros de ejecución locales confirman padre **GPT-6 Astra ultra** y los
tres hijos **GPT-6 Sol ultra**. Los seis frentes fueron tandas repartidas entre
esos tres hijos, no seis subagentes simultáneos. Mi web, cobro, agenda, correo,
onboarding, web pública y SIAT recibieron implementación/revisión según su dueño.
La QA cerró; luego se reutilizaron agentes para Hermes/Calendar, videos/Paperclip
y documentación. No se confunden con los cuatro loops Claude del homelab.

Las revisiones adicionales de la tanda se ejecutaron realmente con GPT-5.5
medium; Luna no estaba admitido por ese CLI. Para futuras tareas acotadas,
seguir [AI_MODEL_ROUTING_2026](../AI_MODEL_ROUTING_2026.md): Sol medium para
implementación corriente y scripts para verificaciones mecánicas; reservar el
esfuerzo mayor para incertidumbre y riesgos. No afirmar que Hermes ya dirige
estos subagentes: por ahora los coordina el agente padre de Codex.

El [homelab](homelab-orquestacion-20260927.md) ejecutó QA útil el 27-sep. Hoy el
túnel no responde y los logs sincronizados se detienen a las 16:00 UTC. No hay
evidencia de operación continua después de esa hora ni causa confirmada.

## Cloud preparado, ejecución pendiente

Se crearon dos entornos con repositorios que ya eran accesibles en Codex:

- [Platform](https://chatgpt.com/codex/cloud/settings/environment/6abad6a0aae081919f0b315818becb21):
  Node 22, npm ci, Prisma generate mediante postinstall, datos sintéticos de
  loopback sólo para setup.
- [Hermes](https://chatgpt.com/codex/cloud/settings/environment/6abad782eba0819196ca234dc3abc327):
  Node 22, Corepack/pnpm 10.33.3 y lockfile de Web Factory.

Ambos: sin secretos, internet del agente desactivado, setup/mantenimiento
guardados. **Instalación Cloud todavía no probada; cero tareas enviadas**. Crear
el entorno no migra sesiones ni activa trabajo recurrente. Los cambios revisados
siguen sin commit/push en ramas locales; Cloud todavía no puede obtenerlos.
`git ls-remote` al cierre confirma Platform master `9a1afc34` y Hermes main
`9bdb8bb8`; la integración Hermes se probó sobre `02a4eef8` y hay que conciliar
ese avance antes de publicar. No existe remotamente la rama de integración.

La [continuidad preparada de Platform](../../../../onia-platform-v1-integracion-20260927/docs/ONIA_CLOUD_HANDOFF_20260928.md)
define la rama, evidencia, siguiente encargo y gates. La automatización local
antigua está pausada y apunta al candidato del 14-sep; no se reactivó.
No se puede hacer handoff de una tarea local directamente a Cloud.
[Fuente oficial](https://learn.chatgpt.com/docs/remote-connections).

## Paperclip y referentes

[Paperclip](https://github.com/paperclipai/paperclip) es un coordinador de agentes,
MIT, con tareas, responsables, historial, costes, políticas de revisión y
reservas por ejecución. La release revisada es
[v2026.916.1](https://github.com/paperclipai/paperclip/releases/tag/v2026.916.1).
Incluye adaptadores Claude, Codex y Hermes; Node >=24.11 para el propio servidor.
Esto no exige cambiar Node de los productos ONIA, que pueden seguir aislados.

Su checkout atómico coordina los workers que usan su API, no bloquea nuestros
loops externos ni los archivos que escriben. `hermes_gateway` requiere la API
REST/SSE de Hermes autenticada; el gateway de Telegram activo no demuestra ese
servicio. No arregla red, calendario ni conflictos si los ejecutores siguen fuera.
[Adaptadores](https://docs.paperclip.ing/reference/adapters/hermes-gateway/),
[reservas](https://docs.paperclip.ing/reference/api/issues/).

Recomendación: piloto separado con dos workers, 5–10 tareas sintéticas,
activación manual, sin credenciales productivas. Medir doble asignación,
recuperación de caída, coste, revisión y entrega. Desactivar la omisión de
permisos del adaptador Claude y mantener aislamiento real. No se instaló.
Evitar sumar un panel hasta comprobar que reemplaza coordinación duplicada.

Reels suministrados: [Ddz9G7KIEfT](https://www.instagram.com/sanmunoz.ia/reel/Ddz9G7KIEfT/)
pertenece a sanmunoz.ia; [Ddxz2P_uCp6](https://www.instagram.com/eriktaveras/reel/Ddxz2P_uCp6/)
sí es de Erik Taveras y su caption trata de invocar subagentes. Se verificaron
autores/captions en Chrome, no se obtuvo transcripción ni se escuchó todo el audio.
No se atribuye a esos videos contenido deducido de otras fuentes.

## Activaciones que siguen pendientes

1. Validar la identidad del Calendar n8n y preparar el puente de lectura;
   después probar un día sin eventos, uno ocupado, un fallo y una replanificación.
2. Publicar el parche que retire disponibilidad ficticia y actualizar prompts
   vivos/jobs con backup, comparación de hashes y rollback; después observar
   una ejecución sin invocar manualmente modelos adicionales.
3. Conciliar y publicar las ramas de revisión para que Cloud reciba el candidato
   exacto, sin merge ni despliegue. Ejecutar un encargo acotado antes de programar.
4. Reducir contexto heredado del ordenador tras revisar su contrato, y comprobar
   que desaparezca el 429. Aumentar modelo o frecuencia no arregla el exceso de
   contexto.

No se cambiaron VPS, n8n, cron, OAuth, servicios ni credenciales. El calendario
personal y la creación de los dos entornos Cloud son las acciones externas
realizadas y verificadas en este corte.

## Corte Claude 28-sep 21:40 La Paz — verificado en lectura, NO desplegado

**Calendarios.** El conector de esta sesión y el OAuth de n8n (`Google Calendar account`,
workflows `uwqJDGwkkWJaFtLU` lectura y `kB10A8oLWioS8lXP` creación) son la MISMA cuenta
empresarial `oninteligenciaartificial@gmail.com`: ve su `primary` (owner) y feriados BO
(reader). Cero eventos del 29-sep al 5-oct; sin eventos creados desde agosto. El calendario
personal de Sergio Urcullo (organizador de los 74 eventos del recibo privado) NO está
compartido con esa cuenta. Consecuencia: toda lectura vía n8n hoy devuelve "vacío" y
`agendar` escribe en el calendario empresarial, no donde viven los compromisos.
Falta: Sergio Urcullo comparte su calendario personal con la cuenta empresarial con permiso
"Ver solo disponibilidad"; luego n8n usa la operación Availability (freebusy) sobre ese id.
Sin cambios de OAuth: el credencial ya tiene alcance Calendar.

**Router: hoy no lo invoca nadie.** `/root/.hermes/scripts/hermes_command_center.py` es
`c8660a38` en CRLF (sha `8626cccf…`, 5-jul). Su log `logs/command-center-events.jsonl`
(escrito en cada `_dispatch`) no cambia desde 2026-07-05 16:35 UTC y el workflow n8n
`vuicWsvh0hwqKhYs` no tiene ejecuciones. Publicar el parche es correcto pero no cambia
lo que Sergio Urcullo recibe hoy.

**Lo que sí llega:** `hermes-weekday-work-agenda` (08:00, gpt-5-mini) entregó a Telegram
el 21, 22, 23, 24, 25 y 28-sep (28-sep: `message_id=6983`, 08:02:47). Su `last_status=error`
("Interrupted by shutdown") es un falso negativo: el job terminó 08:02:11, el fence local
expiró 08:02:43 y la entrega salió igual. La voz 08:25 (`/var/log/onia-jarvis-voz.log`)
dice "narrado y enviado" los siete días del 22 al 28-sep. El job carga
`operaciones-dashboard`, `video-lab-higgsfield` y `marca-personal-sergio`, NO
`agenda-calendario`: el "09:00-11:00" de hoy lo inventa el modelo. Para cortarlo hace falta
tocar el job (`hermes cron edit 9089322cc256 --add-skill agenda-calendario`, con backup de
`cron/jobs.json`), que es un cambio vivo aparte del parche.

**Runbook (dueño del VPS; nada de esto se ejecutó):**
1. Fuente = blobs LF de `d3be0b4a` vía `git show`, NUNCA la copia de trabajo (CRLF mixto,
   sha `b6e1929d…`). Esperados: router `13097b40…`, agenda-calendario `1233a669…`,
   brief-diario `e39a631f…`.
2. Pre-check en el VPS: router `8626cccf…`, `skills/agenda-calendario.md` `c40141a9…`,
   `skills/brief-diario-onia.md` `1becfc7f…`. Si alguno difiere, PARAR.
3. Backup `cp -p <f> <f>.bak-cal-20260928` de los tres; `scp` a `/tmp`; `cp` sobre el destino
   (preserva dueño y modo).
4. Sin reinicio: el router corre por invocación (`/usr/local/bin/hermes-command`) y las skills
   se releen por sesión (manifest mtime/size). No tocar `hermes-gateway.service`.
5. Verificar: sha256 = paso 1; `python3 -m py_compile`; `hermes-command telegram --message
   "Plan Sergio hoy"` → `calendar_verified: false`, "Agenda no verificada", sin HH:MM;
   "Puedo reunirme martes 11:45?" → sin "SI". Cada llamada agrega 1 línea al jsonl (esperado).
6. Rollback: `cp -p <f>.bak-cal-20260928 <f>` de los tres y re-verificar los sha del paso 2.
