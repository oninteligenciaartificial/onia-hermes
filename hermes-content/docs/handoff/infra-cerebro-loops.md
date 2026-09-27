# Handoff — carril `infra-cerebro-loops`

## Estado vigente — continuidad en Codex, 21-sep-2026

Esta sección sustituye las afirmaciones de rama limpia/mergeada y los próximos
pasos del cierre anterior. El historial de Claude de abajo se conserva como evidencia.

1. **Objetivo:** sostener la infraestructura que permite desarrollar y operar ONIA
   Platform. Sergio Urcullo trasladó el carril de Claude a esta tarea de Codex.
2. **Producción medida por Codex a las 20:18–20:25 UTC:** gateway Hermes `active`,
   memoria 49.298 bytes y archivo histórico 339.462 bytes; túnel VPS `:2222` sin
   listener; cron VPS con cero entradas activas `onia-loop.sh`. Los logs sincronizados
   de casa siguen fechados 19-sep. Platform, Supabase, SMTP, n8n y Chatwoot figuran
   levantados; login Platform, Chatwoot y landing respondieron HTTP 200 (0,124 / 0,337 /
   0,093 s en esa muestra). Esto no certifica un flujo autenticado ni restore de DB.
   **Despliegue aprobado completado a las 20:40:24 UTC**, sin reinicios ni cambios de cron.
3. **Integración:** rama `codex/infra-producto-integracion-20260921`, sobre `90769552`
   (`origin/main`), worktree `C:/dev/proyectos/onia-hermes-infra-integracion`.
   Se transfieren únicamente los tres scripts, sus pruebas y documentación. El origen
   `codex/infra-producto-20260921` sobre `7d76b79d` queda preservado en el worktree de
   Claude, incluidos sus temporales no versionados. NO se mergea toda aquella rama.
   Commit integrado/pusheado a `origin/main`: `063e5e54e2543791c0e0a1117dad6a01e2d76a8c`.
4. **Cambios y pruebas:** límite por bytes en `consolidar-memoria.sh` con archivo
   íntegro/dedup, error honesto ante tablero inaccesible en `parte-diario.sh`, reintento
   de notificaciones fallidas en `vigia-loops-remotos.sh`. 12 pruebas de memoria y
   4 de alertas pasan en WSL Linux; las suites shell existentes de parte/vigía también.
   Se reprodujeron primero los fallos. Un revisor independiente detectó el efecto de
   `set -e` ante bloques vacíos; corregido y cubierto. README contiene aplicación y rollback.
5. **Límites e intentos fallidos:** el handoff del checkout principal de Hermes estaba
   atrasado frente al último transcript y rama de Claude; leer la sesión y `7d76b79d`
   evitó repetir sus arreglos. `claude-mem` no devolvió las observaciones recientes del
   producto; se recuperó la conversación local directamente. No usar el checkout sucio
   `onia-platform/claude/f2-f3-panel` como base. El límite nuevo no controla escrituras
   directas del memory tool de Hermes; el archivo por hash no compacta memoria existente.
6. **Autorización:** Sergio Urcullo aprobó explícitamente integrar/pushear y aplicar
   estos tres scripts al VPS con respaldo y rollback. No incluye reinicios, cambio de
   cron, mensajes de prueba, migraciones ni reactivar loops. Los loops invocan `claude -p`: moverlos de
   máquina no resuelve el agotamiento de cuota. No se configuró un scheduler Codex nuevo.
7. **Siguiente orden:** tanda integrada y aplicada; revisar backup de Hermes
   (fallback inseguro de SQLite a `cp` y copia de memoria vacía antes de validarla);
   recuperar nodo-casa y comprobar una vuelta real con ejecutor disponible; verificar
   dos corridas de Hermes sin error TPM. El desarrollo interactivo en Codex puede seguir
   sin esperar a Claude. No afirmar que los loops quedaron reactivados.

### Evidencia de aplicación — 21-sep, 20:40 UTC

- Instalados únicamente `/root/bin/onia-consolidar-memoria.sh`,
  `/root/bin/onia-parte-diario.sh` y `/root/bin/onia-vigia-loops-remotos.sh`,
  `root:root`, modo 755; hashes y `bash -n` verificados antes/después.
- Respaldo privado modo 700: `/root/backups/onia-infra-20260921T203640Z/`.
  Contiene originales, hashes originales/nuevos, commit fuente y estados de
  contenedores/gateway/cron antes y después. Rollback preparado:
  `bash /root/backups/onia-infra-20260921T203640Z/rollback.sh`.
  NO fue necesario ejecutarlo en producción; restauración real no ensayada aquí.
- El instalador validó los hashes vivos previos para no pisar cambios concurrentes,
  respaldó antes de cambiar, usó rename por archivo y rollback ante fallo o señales
  HUP/INT/TERM. No ejecutó ninguno de los jobs ni mandó mensajes de prueba.
- Cron idéntico por SHA-256; contenedores sin cambios de inicio/reinicios/estado;
  `hermes-gateway.service` conserva estado e inicio. `hermes` NO es el nombre
  de esa unidad: consultar el nombre corto devolvió `inactive`, no una caída.
- Smoke posterior: Platform login HTTP 200 / 0,130 s, Chatwoot 200 / 0,292 s,
  landing 200 / 0,098 s; 0 coincidencias `error|fatal` en los últimos 5 min del
  log de Platform. Solo una muestra, no prueba E2E de auth/DB ni SLA.
- Memoria aún 49.298 bytes; ningún cambio manual de contenido. Cero entradas
  activas `onia-loop.sh` en cron del VPS; túnel `:2222` sigue ausente. La entrega
  real de alertas y el procesamiento por cron quedan pendientes de observación
  natural: los 39 checks locales usaron archivos temporales/Telegram simulado.
- `package.json` incluye también la prueba de parte diario; las nuevas pruebas
  Python se descubren en la cadena existente. No se ejecutó el `npm test` global.
- Para rollback duradero hay que reconciliar también la fuente de sincronización;
  restaurar solo runtime permite que un sync posterior vuelva a instalar lo nuevo.
  Nunca restaurar una MEMORY antigua sobre aprendizajes nuevos.

| Runtime | SHA-256 instalado |
| --- | --- |
| `onia-consolidar-memoria.sh` | `890fc9559a497189271937c301983b734c821a553241f2b90adc3007ad50d21f` |
| `onia-parte-diario.sh` | `4d8c272b0f99905760d56d1ef9a3330a6b6e40357475ac28bd7364933bb8a940` |
| `onia-vigia-loops-remotos.sh` | `440d5fc065d14c315e57f9b44939aa61805d47725c6e9689ead0606713bf8c18` |

Skills utilizadas: `onia-router`, `onia-infra`, `debugging-and-error-recovery`,
recuperación `claude-mem:mem-search` y revisión de arquitectura con
`codebase-onboarding`. Sin nuevas dependencias ni consultas a APIs de pago.

---

## Historial de Claude (anterior a la continuidad de Codex)

> Rama `claude/infra-loops-revision-3fc7b1` (ya **mergeada a `main`**, nada suelto).
> Escrito 2026-09-21 15:30 La Paz. Sesiones del 17-sep (Claude) → continúa en **Codex**.
> Medido en vivo hoy, no leído de docs.

## 1. Objetivo

Revisar la infra de los loops y dejar a **Hermes funcionando como el único canal** con
Sergio Urcullo (Telegram), sin panel.

**Hecho =** Hermes viva con crédito y modelo barato, resúmenes diarios llegando solos, y el
inventario de automatización escrito. **Cumplido**, con dos cosas que se rompieron después
(abajo).

## 2. Qué quedó EN PRODUCCIÓN (verificado hoy 21-sep)

- **Hermes viva y sola en el canal.** Gateway `active` bajo systemd, **0 errores de gateway
  duplicado** desde el arreglo del 17 (venían 939 en una tarde).
  - `hermes-weekday-work-agenda` — 08:00 La Paz L-V — **ok hoy 08:02**
  - `hermes-daily-content-video-plan` — 08:10 diario — ⚠️ hoy cortó (ver §3)
  - `onia-ordenador-tablero` — 13:00 y 23:00 — ⚠️ 3 fallos seguidos por TPM (ver §3)
  - `onia-veredicto-sergio` — 16:00 — ok (última buena: 20-sep)
- **Voz matinal (Jarvis).** `/root/bin/onia-jarvis-voz.sh`, cron VPS `25 12 * * *` (08:25
  La Paz): narra agenda + guiones con ElevenLabs y los manda como audio a Telegram.
  Probado de punta a punta. Voz PREMADE `Daniel` (`onwK4e9ZLuTAKqWW03F9`) — la clonada del
  `.env` da 401 `subscription_required` en el plan actual.
- **Modelos**: chat y los 2 resúmenes en `gpt-5-mini`; ordenador-tablero y veredicto en
  `gpt-5-nano`. Crédito de OpenAI recargado por Sergio Urcullo el 17-sep.
- **Publicador automático: DESTRABADO.** El 17 estaba frenado en las 3 superficies por la
  guarda de precio; hoy `plataforma / landing / bot: al dia`. Ya no espera firma.
- **Panel «Cerebro»: APAGADO a propósito** (decisión de Sergio Urcullo: solo Telegram).
  Reversible, nada borrado: contenedor `onia-glance` parado, `onia-cerebro.service`
  deshabilitado, cron del agregador comentado en el crontab.

## 3. Qué quedó a medias / roto, y DÓNDE

### 🔴 Los 4 loops de nodo-casa están MUERTOS hace 2 días
Última vuelta: **19-sep 19:33 UTC** (`chatbot-cola`, `onia-cola`, `web-venta`,
`recorrido-cliente`). Causa medida: **el túnel inverso está caído → WSL apagado** en
`DESKTOP-0GGGNMF`. Es el mismo modo de falla del 17-sep, ya documentado: WSL se apaga solo
aunque Windows siga prendido, y **la tarea de arranque solo lo revive al logon**, así que
nadie lo levanta.

**Y el vigía no avisó**: `/var/log/onia-vigia-loops-remotos.log` está mudo. Eso es lo que
hay que arreglar, más que los loops.

⚠️ **CORREGIDO 2026-09-21 19:50 UTC, medido: el vigía SÍ detectó y SÍ avisó. Lo que falla
es a QUIÉN le avisa.** El log está en 0 bytes porque el script no escribe a stdout cuando
tiene éxito — no porque no haya corrido. La prueba está en sus marcas de estado y en el
registro del enrutador:

```
/var/lib/onia-vigia-remotos/_apagon        2026-09-20 01:34   (lo tocó al declarar el apagón)
onia-tg.log 2026-09-19T21:34Z  TAREA t_9b20c3cc  🔴 Loop callado: chatbot-cola
onia-tg.log 2026-09-19T23:04Z  TAREA t_27f3d756  🔴 Loop callado: web-venta
onia-tg.log 2026-09-20T01:34Z  TAREA t_c6f54fcb  🔴 la PC de casa no da senales — sus 4 loops callados
```

**El defecto real, y es de diseño:** la línea del cron llama a `onia-tg.sh` SIN
`ONIA_TG_DIRECTO=1`, así que desde el 2026-09-08 el aviso no sale a Telegram: **se convierte
en una tarea del tablero**. Y el tablero lo leen **los loops**. O sea: *el aviso de que los
loops están muertos se le entrega a los loops muertos*. Es una carta al buzón del difunto.

**Y el parte diario lo tapó, no lo destapó.** `onia-parte-diario.sh` nombra sólo las 5 tareas
`[auto:]` más viejas y cuenta el resto. La tarea del apagón es la **#16 de 16** — la más
nueva —, así que las mañanas del 20 y del 21 el único mensaje del día listó drops faltantes
del 9 y 10 de septiembre y resumió la caída real como *«… y 11 más en el tablero»*.
Los dos mensajes salieron con 661 bytes idénticos (`onia-tg.log`: `OK message_id=6718`,
`message_id=6749`).

**Arreglo de una línea** (`crontab -e`, y el gemelo de `onia-vigia-vps.log` tiene el mismo
agujero):

```
4,34 * * * * ONIA_TG_DIRECTO=1 ONIA_LOG_DIR=/var/log/homelab /root/bin/onia-vigia-loops-remotos.sh >> /var/log/onia-vigia-loops-remotos.log 2>&1
```

Y el parte diario tiene que ordenar por gravedad/novedad antes de recortar a 5, o su recorte
va a seguir escondiendo justo lo que acaba de romperse.

```bash
# comprobar desde el VPS
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 'ss -tln | grep 2222 || echo CAIDO'
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 '/root/bin/casa.sh "uptime"'
```
Reparar exige a Sergio Urcullo encender WSL en esa PC (no hay sudo remoto).

⚠️ **CORREGIDO 2026-09-21, medido: recuperar los loops NO exige tocar esa PC.** Lo que exige
esa PC es recuperarlos *ahí*. El VPS está **entero y listo** para correrlos hoy — se contó en
vivo, no se supuso:

| pieza | estado en el VPS |
|---|---|
| corredor `/root/bin/onia-loop.sh` | existe, 33 KB, 8-sep |
| prompts `/root/bin/loops/*.md` | **17 desplegados**, los 4 caídos incluidos |
| worktrees `/root/loops/` | `onia-hermes`, `onia-platform` + 6 espejos de carril |
| `claude` CLI | `/usr/bin/claude` **2.1.197**, autenticado — `claude -p` contesta |
| líneas de cron `onia-loop.sh` | **CERO** |

Lo único que falta son las líneas del cron. Es decir: **la máquina que no se puede prender
sola es la única que corre los loops, teniendo al lado una que está prendida hace 28 días.**
Eso no es una avería, es la arquitectura — y es lo que hay que decidir, no parchar.

⚠️ Mudarlos de vuelta **no es sólo descomentar**: `scripts/loops_registrados.mjs` compara en
las dos direcciones contra `hermes-content/docs/cola/loops.md`, así que las filas tienen que
pasar de `casa` a `VPS` **en el mismo movimiento** o `main` se pone roja para todos los
carriles. El orden y la trampa están escritos en ese mismo archivo.

### ⚠️ Dos jobs de Hermes fallando hoy
- `onia-ordenador-tablero`: `RateLimitError ... TPM Limit 200000, Used 56050, Requested
  144473` — **3 fallos seguidos**. El prompt manda demasiado contexto de una; el techo ya
  no es el saldo, es tokens-por-minuto del tier.
- `hermes-daily-content-video-plan`: `Interrupted by shutdown before terminal completion`
  (hoy 08:12). Una sola vez, no es patrón todavía.

### 🔴 Lo que costaron esas 48 h sin loops (medido 2026-09-21 19:50 UTC)

Los loops no son "trabajo extra": son **lo único que arregla lo que se rompe solo**. Sin
ellos el sistema no se detiene — se degrada en silencio y sigue reportando normalidad.

1. **El chatbot de ventas estuvo mudo ~33 horas.** `/var/log/onia-bot-watchdog.log`:
   **408 ciclos fallidos el 20-sep + 587 el 21-sep**, uno cada 2 min, con el watchdog
   reiniciándolo y escribiendo *«sigue caido despues del reinicio»* cada vez. Se recuperó
   solo a las **19:34 UTC de hoy**. Arrancó el día siguiente a la muerte de los loops.
   El watchdog **sí** avisó por Telegram (va directo, no por el enrutador), pero avisa
   **una vez por incidente** y después calla: 33 h de caída = 1 mensaje.
2. **5 prospectos reales colgados hace 23-28 días** (`onia-vigia-sin-respuesta.log`), dos
   de ellos WhatsApp con intención explícita — uno dice literalmente que *está evaluando un
   sistema de gestión para una clínica*, que es el cliente ideal del doc de estrategia. Más
   2 atendidos por el bot que no volvieron y nadie miró. El vigía los cuenta cada 2 h desde
   hace semanas; su aviso también se convierte en tarea del tablero que nadie lee.
3. **Y mientras tanto el parte diario dijo que todo estaba bajo control.** Ver la corrección
   de §3: la caída era la tarea #16 de 16 y quedó fuera del recorte de 5.

**La conclusión incómoda, en una línea:** el cerebro tiene ojos (los vigías miden bien),
tiene manos (los loops arreglan de verdad) y tiene boca (Telegram) — pero desde el 08-sep
**la boca está conectada a las manos y no a Sergio Urcullo**, así que cuando las manos se
mueren nadie se entera.

### 🔴 Y el precio del ruido: el repo pesa 11 GB

- `.git` del monorepo: **11 GB en disco, 3,75 GiB de pack**.
- Causa medida: `hermes-content/docs/recorrido/` son **124 PNG (25 MB)** que el loop
  `recorrido-cliente` **recommitea enteros cada vuelta** — **202 commits en 14 días** tocando
  esa carpeta, **2.320 de los ~4.700 toques de archivo del período (≈49%)**.
- Del total de 14 días: **1.178 commits de `root` (los loops)** vs 309 de Sergio Urcullo, y
  por tipo **369 `docs:` contra 128 `feat:`**. La mayor parte del trabajo autónomo se está
  yendo en documentar el sistema y en versionar capturas, no en producto.
- Capturas de verificación: son evidencia, no fuente. Van a `.gitignore` + artefacto de CI,
  o el repo se duplica cada mes.

### Sin commitear
**Nada.** Árbol limpio y la rama ya está en `origin/main`.

## 4. Archivos

| archivo | qué es |
|---|---|
| `hermes-content/docs/ONIA_CEREBRO.md` | **fuente de verdad**: las 5 capas del cerebro y qué existe de cada una |
| `scripts/loops/extras/jarvis-voz.sh` | voz matinal → `/root/bin/onia-jarvis-voz.sh` |
| `scripts/cerebro/onia-cerebro-datos.py` | agregador (apagado) → `/root/bin/` |
| `scripts/cerebro/glance.yml` · `index.html` · `Cerebro.bat` | superficie apagada, historia |
| `hermes-content/docs/cola/loops.md` | qué loop corre dónde (fuente de verdad, la lee un gate) |

## 5. Intentos fallidos — lo que NO era

1. **El panel, DOS veces.** Primero HTML propio dark genérico; después portado a la
   dirección «Hoy» del repo; después Glance con 5 páginas. Sergio Urcullo lo bajó igual:
   *"mucha información innecesaria"*. **Lección: el Cerebro no necesitaba una pantalla —
   el canal es Telegram.** No volver a proponer panel.
2. **Codear UI sin mirar `hermes-content/references/ui-patterns/`.** El repo ya tenía dos
   direcciones de panel con feedback suyo (`panel-claro-premium/index-v3.html`,
   `dashboard-minimal/`). Saltármelas costó dos rechazos.
3. **`hermes-gateway-restart.sh` está ENVENENADO.** Hace `gateway stop`/`run` y deja un
   gateway fuera de systemd; systemd choca contra él en loop (939 errores en una tarde).
   **Reiniciar Hermes es `systemctl restart hermes-gateway.service` y nada más.**
4. **Tras recargar crédito, LiteLLM sigue diciendo "no credits" un rato** (cooldown del
   deployment). Probar contra `api.openai.com` DIRECTO antes de concluir que no entró.
5. **`gpt-5-nano` no sirve para resúmenes con juicio**: inventó una agenda entera con un
   "rate limit del login" inexistente. Los resúmenes van en `mini` con regla de citar fuente.
6. **«localhost no funciona»**: el túnel SSH moría con mi sesión. Cualquier cosa que Sergio
   Urcullo tenga que abrir necesita lanzador propio, no un túnel mío.

## 6. Qué depende de Sergio Urcullo

- 🔴 **Encender WSL en nodo-casa** — hoy los 4 loops llevan 2 días parados. Es físico.
- **8 tareas bloqueadas en el tablero** esperando su ok. Las más caras:
  `t_13f09d9a` (5 desconocidos escribieron y nadie contestó) · `t_3b9d0ded` (2 atendidos por
  el bot que no volvieron) · `t_39a0c27c` (SIAT: crear Punto de Venta 1, 5 min en el portal,
  frena la mitad de la homologación) · ~~`t_040684cb` (mirar si el correo de confirmación cae
  en Spam)~~.
  ⚠️ **`t_040684cb` ya NO depende de él — cerrada el 2026-09-27 por `chatbot-cola`.** La
  respuesta la había dado él mismo el 12-sep (**Recibidos**; commit `d4d43078`, escrito con su
  propia cuenta de git) y el pedido siguió preguntándosela 15 días. Se corrige acá porque una
  lista de «depende de Sergio Urcullo» que nombra una decisión ya tomada es exactamente lo que
  hace que la próxima sesión se la vuelva a pedir. Las otras filas de esta viñeta **no** se
  re-midieron en esa vuelta: siguen como estaban.
- Decidir si los **12 jobs `hermes-*` pausados** (kickoff de lunes, finanzas del viernes,
  cierre del domingo) se reviven o se borran.

## 6.b 🔴 LA CAUSA RAÍZ DEL HARNESS: la memoria de Hermes entraba entera en cada llamada

Medido el 2026-09-21 con `hermes prompt-size`. No es un job mal escrito: es el sistema
entero pagando el mismo peaje en cada request.

```
ANTES                                  DESPUÉS
system prompt   425.692 B (~106k tok)  87.419 B (~22k tok)     −79 %
  memoria       387.907 B               49.634 B
```

**Dentro de la memoria, UNA sección se comía el 90 %:** «Método: gates», **336 KB y 469 de
las 563 entradas** — lecciones que los loops fueron dejando con `onia-aprender.sh`. Todo lo
demás junto (producto, precios, infra, loops, bot, fiscal, git, verificación) son **39 KB**.

**Y crecía.** De los respaldos de 6 h:

| cuándo | MEMORY.md |
|---|---|
| 18-sep 18:17 | 281.174 B |
| 19-sep 06:17 | 328.739 B |
| 19-sep 18:17 | 381.206 B |
| 20-sep 00:17 | 387.569 B |

**+106 KB en 30 h (~3,5 KB/hora, ~85 KB/día) mientras los loops corrían.** Dejó de crecer
sólo porque los loops se murieron el 19-sep 19:33. Es decir: **el harness se estaba
estrangulando solo, y lo único que lo frenó fue romperse.** Cada vuelta de cada loop le
sumaba contexto a todos los jobs y a cada mensaje que Sergio Urcullo le manda por Telegram.

**Eso es lo que reventaba `onia-ordenador-tablero`**: pedía 133.899 tokens por llamada con
un techo de 200.000 TPM, sin haber leído todavía un solo archivo. Los `Requested 144473` no
salían de los docs: salían de arrancar con la memoria encima.

⚠️ **`memory_char_limit: 48000` YA estaba en `/root/.hermes/config.yaml` y esta versión de
Hermes NO lo aplica**: inyecta el archivo completo. No confiar en ese parámetro.

**Lo hecho (reversible):** la sección «Método: gates» se movió entera a
`/root/.hermes/memories/ARCHIVO-metodo-gates.md` (339 KB, `grep`-eable) y en su lugar quedó
un puntero que dice cómo buscarla y que lo que sea REGLA vuelve a su sección. **No se
resumió ni se reescribió nada** — justo lo que `consolidar-memoria.sh` advierte que no hay
que hacer, porque pedirle a un modelo que compacte le hace tirar reglas. Backup en
`MEMORY.md.bak-20260921-2007-aligerar` y respaldos cada 6 h en `/root/backups/hermes-memory/`.

🔴 **Lo que falta, y es lo que hace que esto no se repita:** `onia-aprender.sh` escribe en
una memoria que no tiene techo. Mientras los loops estén apagados no crece; **el día que
vuelvan, vuelve a subir ~85 KB por día**. Antes de encender los loops hay que ponerle un
tope a esa sección (rotar a archivo al pasar de X KB, igual que se rota un log).

## 7. Próximos pasos (en orden, con «hecho» medible)

1. **Que el vigía grite cuando nodo-casa muere.** Hecho = con WSL apagado a propósito,
   llega un aviso a Telegram en menos de 1 hora. Hoy falló en silencio 2 días.
2. **Arreglar el TPM de `onia-ordenador-tablero`.** Hecho = `hermes cron doctor` en verde
   dos corridas seguidas. Vía: recortar el contexto del prompt (manda 144k de una) o
   partirlo en dos pasadas.
3. **Revivir los loops** una vez que WSL vuelva. Hecho = las 4 vueltas del día en
   `/var/log/homelab/` con fecha de hoy.
4. **Capa 1 del cerebro (`goals.yaml`)** — ver §Roadmap de `ONIA_CEREBRO.md`. Hecho = la
   agenda matutina cita el objetivo de la etapa vigente al priorizar.
5. **Triage de entrantes (capa 2)** — hecho = cero "desconocido sin contestar" con más de
   24 h. Hoy eso vive como tarea bloqueada, que es justo lo que el triage evitaría.

⚠️ **No abrir el frente del panel de nuevo.** Está decidido y apagado.
