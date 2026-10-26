# Handoff — carril `infra de loops` (rama `claude/onia-infra-setup-09ca24`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-08 05:30 UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

**Terminar la configuración de la infra: canarios, loops, Hermes y configuración básica.**

**Hecho** = (1) `web-venta` corriendo en nodo-casa y `loops_registrados.mjs` verde en las DOS
máquinas · (2) `canario-visual` decidido y aplicado · (3) Hermes sin trabajos rotos en silencio ·
(4) `onia-vigia-aprobaciones.sh` versionado.

**✅ Los cuatro cumplidos.** Verificados mirando el estado, no suponiéndolo.

Sergio Urcullo amplió el alcance durante la sesión, y esas ampliaciones también se cerraron:
**mudar TODOS los loops a la PC de casa** (el VPS queda solo con la app), **congelar todo lo que
no sea Onia Platform**, **acceso directo al nodo sin que él pegue comandos**, **subir cadencias
con verificación de que los loops no se pisan entre sí**, **automatización comentario→DM de
Instagram configurable por video**, **cerrar la firma del webhook** y **archivar las 3 copias
apagadas del workflow**.

🔴 **Y apareció un hallazgo que es más grande que el objetivo.** Está en §7: **Hermes consumía
7 a 13 millones de tokens de OpenAI por día** (~US$ 41-47/mes) contra un tope de gateway de
**US$ 50 cada 30 días**. Entraba raspando, y si lo cruzaba, LiteLLM corta todo y Hermes se
apaga sin avisar.

**✅ Decidido y aplicado el 2026-09-08 por Sergio Urcullo:** *"no subimos, acomodemos para que
gaste lo menos posible; gastamos en cosas innecesarias, te lo digo siempre, mensajes a telegram
que no tienen sentido"*. **No se subió ni el cupo ni el tope: se bajó el consumo.** Detalle y
números en §7.

---

## 2. Qué quedó EN PRODUCCIÓN

Medido el 2026-09-08 05:00-05:30 UTC.

| pieza | estado |
|---|---|
| Gate `loops_registrados.mjs` — **VPS** | ✅ *"coinciden en id y horario, en las dos direcciones"* · 0 loops en cron, 0 filas "VPS" |
| Gate `loops_registrados.mjs` — **nodo-casa** | ✅ mismo veredicto · 4 loops en cron, 4 filas "casa" |
| Mudanza de loops al nodo | ✅ **los 4 loops vivos corren en casa**; el VPS ya no corre ninguno |
| `onia.com.bo` · `app.onia.com.bo` · `chat.onia.com.bo` | ✅ 200 los tres |
| Túnel inverso nodo→VPS | ✅ el nodo publica su sshd en el `127.0.0.1:2222` del VPS (`GatewayPorts no` lo mantiene interno) |
| Hermes gateway | ✅ `active` · 9 trabajos activos |
| `onia-veredicto-sergio` | ✅ sin `drift_skip` — modelo fijado y trabajo reanudado |
| `onia-vigia-aprobaciones.sh` | ✅ versionado (ya lo estaba: ver §5.3) |
| Guarda anti-retrabajo en `onia-loop.sh` | ✅ cada loop sincroniza con **su rama base** ANTES de medir. ⚠️ Estuvo **muda en `onia-platform`** hasta el 8-sep: ese repo usa `master` y la guarda comparaba contra `origin/main` fijo — el `\|\| echo 0` convertía el `fatal` en CERO. Ese worktree estaba **12 commits atrás** sin avisar. Arreglado: ahora pregunta la base (`origin/HEAD`, con `main`/`master` de respaldo) y **avisa si no la encuentra**, en vez de callarse |
| Disco del VPS | ✅ **65 %** (venía de 89 %) |
| Workflow IG `1jS4jwmNmvcQpqqH` | ✅ activo, con capa por video y verificación de firma **en modo observar** |
| 3 copias apagadas del workflow IG | ✅ archivadas, con respaldo crudo en `/root/n8n-copia-*.archivada.json` |

**Tablero:** 56 tareas abiertas.

---

## 3. Qué quedó a medias, y dónde

### 3.1 🔴 La firma del webhook de Instagram OBSERVA, no bloquea

Está armada y probada de punta a punta, pero **deja pasar todo**. Falta un dato que sólo puede
dar un comentario real: hay **dos apps de Meta** en el sistema (`1562215408796050` en
`.hermes/.env`, `1078962684709749` en `app.env`) y **no se sabe cuál firma este webhook**.

**Por qué no se activó igual:** encender el rechazo con el secreto equivocado tira **todos** los
comentarios reales, y no se nota hasta que alguien pregunta por qué no le llegó nada.

Doc completo: [`ONIA_IG_COMENTARIO_A_DM.md`](../historial/ONIA_IG_COMENTARIO_A_DM.md) §3.

### 3.2 La capa por video existe y está VACÍA a propósito

`VIDEOS = {}` en el nodo `Parsear comentario`. Con la tabla vacía el comportamiento es idéntico
al de antes: **es la capa, no el dato**. Los datos los pone Sergio Urcullo por reel (§6).

Rige la regla que ya estaba escrita: **una palabra no se activa hasta que su recurso responda
200.** Una palabra sin recurso es peor que ninguna: la persona comenta, recibe un link roto, y
esa es la única impresión que le queda de la marca.

### 3.3 nodo-casa no sobrevive a un corte de luz

**Es el único punto único de fallo del sistema**: el único camino a `main` vive ahí. Falta el
BIOS y el arranque automático — depende de Sergio Urcullo (§6).

### 3.4 Anotado y NO hecho (fuera del objetivo, decidido no perseguirlo)

- **Tailscale** para cerrar el puerto 22 público del VPS.
- Versionar `loops-remotos.txt` / `loops-vps.txt`.
- Puntos #5, #6 y #7 del doc de producto (script de deploy, cerrar pedidos de deploy contra el
  `BUILD_ID` vivo, entorno de pruebas). **#6 toca el circuito de aprobaciones, que ya se
  silenció solo una vez** — no se toca de paso.

---

## 4. Archivos y cambios

| archivo | qué cambió |
|---|---|
| `hermes-content/docs/cola/loops.md` | fuente de verdad: los 4 loops pasaron de **VPS** a **casa**; cadencias subidas (`13,43 * * * *` chatbot-cola, `9 * * * *` recorrido-cliente); decisión escrita de `canario-visual`; sección "Mudados a nodo-casa"; fila de `onia-vigia-ci.sh` |
| `scripts/loops/onia-loop.sh` | **guarda anti-retrabajo**: `git fetch` + cuenta los commits de atraso contra `main`; si hay atraso y el árbol está limpio, mergea antes de medir; si hay conflicto, aborta, mide sobre el árbol viejo y **avisa por Telegram**. Nunca sincroniza si hay cambios sin commitear |
| `scripts/loops/instalar-homelab.sh` | shims de `docker` y `onia-vps.sh`; los 3 loops que faltaban en el CATÁLOGO; symlink de `docker` en `/usr/bin`; el chequeo compara **rutas resueltas** (§5.2 #10) |
| `scripts/loops/preparar-nodo.sh` | **nuevo**, 72 líneas, idempotente: symlink de docker, `openssh-server` atado a `127.0.0.1`, autoriza la pubkey del VPS (la busca el propio nodo), instala `onia-tunel-inverso.sh` + cron `*/5` y `@reboot` |
| `scripts/loops/vigia-ci.sh` + `vigia-ci.test.sh` | **nuevos**: avisan la transición rojo→verde de GitHub Actions; 13 casos; parsea con `node`, no `python3`; ante error de la API **no toca ninguna marca** |
| `scripts/loops/vigia-loops-remotos.sh` + `.test.sh` | `ONIA_VIGIA_MAQUINA` parametrizado para que no culpe *"a la PC de casa"* por un loop del VPS; un loop le agregó después la ventana de gracia para recién mudados (marcas `.alta`) |
| `scripts/loops/vigia-disco.sh` | `ONIA_DISCO_MAQUINA` / `ONIA_DISCO_CAIDA`; omite la línea de docker donde docker no existe |
| `web-factory/apps/onia-platform/scripts/deploy-vivo.test.ts` | `HAY_GIT` + `it.skipIf` en los 3 casos que dependen de git (**zona de web-venta** — se avisó en el commit) |
| `CLAUDE.md` | regla nueva: *"`main` se mueve DEBAJO tuyo mientras medís"*, con sus comandos verificados |
| `hermes-content/docs/historial/ONIA_IG_COMENTARIO_A_DM.md` | **nuevo**: el circuito IG completo — por qué no te banea, estado de la firma, la regla de la palabra sin recurso, cómo se configura una palabra por video, por qué `success` no prueba nada |
| `hermes-content/deploy/vps-ops/ig-firma.sh` | **nuevo**, 61 líneas, versionado: verifica el HMAC **en el VPS**, cuerpo en base64, prueba los dos secretos candidatos, **nunca los imprime** |
| n8n `1jS4jwmNmvcQpqqH` | capa `VIDEOS` por media_id; `media_id`, `palabra_de_video`, `firma_ok`, `firma_motivo` en la salida; webhook con `rawBody: true`; 3 nodos nuevos `Firma: preparar` / `Firma: verificar` / `Firma: veredicto` |

---

## 5. Intentos fallidos

**El campo que casi nadie escribe. Estos son los callejones — no los repitas.**

### 5.1 De esta sesión, lo peor primero

1. 🔴 **Diagnostiqué mal el rate limit de Hermes y "arreglé" algo que ya existía.** Vi el 429 y
   el *"try again in 6.279s"*, concluí *"nadie reintenta"*, y agregué `num_retries: 3` a
   `litellm.config.yaml`. **Falso: Hermes YA reintentaba** — la corrida forzada lo mostró en
   pantalla: `attempt 2/3`, `attempt 3/3`, con esperas de 2,7 s y 5,6 s. Peor: sumar 3 reintentos
   de LiteLLM sobre los 3 de Hermes da **9 pedidos** por vuelta contra un cupo ya saturado, o sea
   **empeoraba exactamente lo que pretendía arreglar**. **Revertido** desde el `.bak`; verificado
   que `num_retries` ya no está en el archivo y que LiteLLM volvió con 200.
   **La lección: leí el mensaje de error y no la salida del programa.** El programa decía en
   pantalla que ya reintentaba.
2. **Creí que el rate limit lo había causado yo** al encender 7 trabajos de Hermes ese día. El
   historial lo desmiente: el 3 y 4 de septiembre fallaba el **100 %** de las vueltas; hoy falla
   el **44 %**. Venía de antes y **mejoró**.
3. **Un `sed` sin espacio** (`"conclusion":"success"` contra `"conclusion": "success"`) hizo pasar
   un test que no probaba nada.
4. **Test negativo de gitleaks mal construido**: puse una clave falsa en una línea nueva, pero la
   regla `curl-auth-header` necesita el `curl` en contexto, así que nunca disparó. Dije en voz
   alta una conclusión falsa sobre `condition = "AND"` y estuve por meter una exención de archivo
   entero creyéndola angosta. Se arregló reemplazando el marcador **en su lugar**.

### 5.2 Trampas de máquina que costaron horas

5. **`read -s` no da retroalimentación** → el token de GitHub se pegó tres veces (279 B = 93 × 3)
   y la API respondió `Bad credentials`. Se diagnosticó mirando la **forma** del archivo sin
   imprimirlo nunca.
6. **`grep -F -f -`** en una regla del CLAUDE.md leía los patrones de su propio stdin.
7. **Un centinela colgado de mi sesión SSH murió con `Connection reset` (255)** sin medir nada.
   Se movió *detached* dentro del VPS.
8. **Peleé cuatro veces con el escapado anidado** (heredocs dentro de `ssh`, backticks en
   `node -e`). La skill `onia-infra` lo dice literal: **escribí el script, `scp`, ejecutalo.**
   Recién a la cuarta lo hice bien. Es la trampa más cara y la más documentada.
9. **El instalador ejecutó los backticks de sus propios comentarios** (heredoc `<<SHIM` sin
   comillas) — dentro del comentario que advertía que eso pasa.
10. **Un chequeo que mentía**: `command -v docker` evaluado en el shell del instalador contra una
    ruta cruda que era un symlink → rojo permanente con todo funcionando. Se arregló comparando
    **rutas resueltas** con `readlink -f`.
11. **Un script escribió `undefined` literal en `loops.md`** y devolvió *"fila agregada"*. Se
    detectó **mirando el archivo**.
12. **`pgrep` se matcheó a sí mismo tres veces en un día**, una de ellas **con el truco del
    corchete** (`[g]ateway run`), porque mi propio comando contenía el texto literal en otro lado.
13. **Selector equivocado dos veces** en la verificación del menú: `header a[...]` cuenta también
    el menú móvil. Reporté dos números mal y me corregí dos veces **después de mirar la página
    renderizada**.

### 5.3 Hipótesis que resultaron falsas

14. **"`onia-vigia-aprobaciones.sh` no está versionado"** (venía del handoff anterior). **Falso.**
    Medido: está, **byte a byte idéntico**, y el sync lo despliega. La causa del error: el prefijo
    `onia-` que agrega `poner` hace que el nombre en el repo y el del VPS nunca coincidan en un grep.
15. **"El arreglo de Hermes es un comando".** Son **tres**: `edit` fija el modelo pero **no
    reanuda**; hace falta `resume`; y `doctor` reporta la **última** corrida, así que sólo un `run`
    real limpia el rojo.
16. **Mi receta del paso 10 era un abrazo mortal**: "primero el VPS" bloquea al integrador para
    siempre. El orden correcto es **NODO → TABLA → VPS**.
17. **"El VPS se ahoga de CPU".** **Era el disco** (89 %, 22 GB libres; load 2,17/4 con 80,9 %
    ocioso). Y el corolario que costó tiempo: **mudar un loop NO libera disco** — `web-venta` se
    mudó y sus 3,1 GB se quedaron.
18. **`deploy-vivo.mjs` compara marcas de tiempo, no contenido**: `publicar.sh` dijo *"YA ESTÁ
    PUBLICADO"* dos veces sobre un sitio que servía el menú viejo.

### 5.4 El patrón que se repite

**Instrumentos que miden un sustituto en vez de la cosa**: el favicon en vez del contenido, la
marca de tiempo en vez del contenido, el commit en vez del deploy, `"success"` en vez de la
entrega, `command -v` en vez de la ruta resuelta, y hoy el mensaje de error en vez de la salida
del programa. **Si el instrumento puede dar verde con la cosa rota, el instrumento está roto.**

---

## 6. Qué depende de Sergio Urcullo

| # | qué | por qué no lo puedo hacer yo | criterio de listo |
|---|---|---|---|
| 1 | 🔴 **BIOS: "Restore on AC Power Loss" = encendido**, y dejar `homelab-wsl-arranque.ps1` en el arranque de Windows | es la BIOS de su PC | corte de luz simulado → el nodo vuelve solo y el cron corre |
| ~~2~~ | ~~Subir el cupo (TPM) de OpenAI~~ | — | ✅ **RESUELTO 2026-09-08: dijo que NO se sube.** Se bajó el consumo (§7) |
| ~~3~~ | ~~Decidir sobre el tope de gasto del gateway~~ | — | ✅ **RESUELTO 2026-09-08: el tope queda en US$ 50/30 días** (§7) |
| 4 | **El link del reel, la palabra y el recurso** del primer video | es su contenido | los 3 datos, y el recurso responde 200 |
| 5 | **Un comentario real** en un post de las cuentas conectadas | Meta sólo firma eventos reales | el veredicto dice cuál de los dos secretos coincide |

---

## 7. 🔴 El hallazgo nuevo: Hermes y el cupo de OpenAI

**Lo medí porque el doctor de Hermes subió de 3 a 5 y no quise escribir el handoff sin saber por
qué.** Cuatro de esos rojos eran corridas viejas sin importancia. El quinto no.

### Qué pasa, con los números

`onia-ordenador-tablero` —**el trabajo que le pone tareas al tablero que leen los 15 loops**—
muere con:

```
Rate limit reached for gpt-5-mini ... on tokens per min (TPM):
Limit 500000, Used 427598, Requested 124730. Please try again in 6.279s.
```

**No lo ahoga nadie de afuera: se ahoga solo.** Es un agente que hace **14 a 29 llamadas
seguidas**, y cada una arrastra **110.000 a 180.000 tokens** de contexto acumulado. Cuatro
intentos de 124.730 en 12 segundos son **498.920** de un cupo de **500.000 por minuto**. El
reintento se come su propio cupo — por eso agregarle más reintentos lo empeora (§5.1 #1).

### El volumen, del registro de LiteLLM (no de memoria)

| día | tokens | US$ |
|---|---|---|
| 2026-09-03 | 25.636.096 | 5,74 |
| 2026-09-04 | 8.895.228 | 0,92 |
| 2026-09-06 | 9.272.453 | 0,77 |
| 2026-09-07 | 13.639.550 | 1,16 |
| 2026-09-08 *(parcial)* | 7.694.918 | 0,50 |

**US$ 10,89 en 8 días ≈ US$ 41/mes.** El `max_budget` del gateway es **US$ 50 cada 30 días**.

⚠️ **El comentario de `litellm.config.yaml` dice *"hoy el gasto real es ~US$ 0.008/mes"*. Está
desactualizado por cuatro órdenes de magnitud** — y por eso el tope parecía holgado. Si el tope
se cruza, **LiteLLM corta todo y Hermes se apaga en silencio**: el modo de falla que este
proyecto ya conoce de memoria.

### ✅ Qué se decidió y qué se aplicó (2026-09-08)

Sergio Urcullo: *"no subimos, acomodemos para que gaste lo menos posible; gastamos en cosas
innecesarias, te lo digo siempre, mensajes a telegram que no tienen sentido"*.

**Tenía razón en la conexión que yo no había hecho: esos mensajes SON el gasto.** Antes de
tocar nada, se atribuyó el consumo por paridad de hora (el ordenador corre `0 */2` = sólo horas
pares; todo lo demás cae en otras horas):

| quién | llamadas | tokens | US$ (7 días) |
|---|---|---|---|
| **horas pares** = `onia-ordenador-tablero` | 857 | 52.417.756 | **8,21 — el 74 %** |
| resto (los 7 genéricos + ad-hoc) | 379 | 20.310.625 | 2,87 |

**Dos cortes, aplicados y verificados:**

1. **`onia-ordenador-tablero`: de `0 */2` a `0 */6`** — de 12 vueltas al día a 4. El tablero
   tiene **56 tareas abiertas**: a los loops no les falta trabajo, les sobra. Corta dos tercios
   del 74 %.
2. **Los 7 trabajos genéricos de Hermes, PAUSADOS**: `daily-operational-status`,
   `weekly-kickoff`, `weekday-work-agenda`, `tuesday-prospecting`, `wednesday-build-sprint`,
   `friday-finance-ops-review`, `sunday-weekly-review`. Son plantillas de NousResearch que sólo
   escupen Telegram, **y las había encendido yo ese mismo día**. Ese es el ruido que él señala.

**Sigue vivo lo que sirve:** `onia-ordenador-tablero` (alimenta a los 15 loops) y
`onia-veredicto-sergio`. **Nada se borró** — `hermes cron resume <id>` los devuelve.

**Estimación, a confirmar con datos reales en unos días:** de ~US$ 47/mes a **~US$ 13/mes**.

**Lo que NO se hizo, a propósito:** achicar el contexto de Hermes (110-180k tokens por llamada).
Es lo correcto de fondo, **pero Hermes no es nuestro** (NousResearch): tocarlo es tocar a un
tercero, y con estos dos cortes el problema de gasto deja de ser urgente.

---

## 7.b Los avisos: de 443 mensajes por día a uno

Sergio Urcullo, 2026-09-08: *"solo quiero que hermes me escriba para preguntas de desarrollo,
para terminar un enfoque o para poner una nueva tarea; si no, que no me escriba. Y si se friega
el CI o los loops, que él lo arregle y que solo diga que está todo en orden"*.

**El número que le da la razón**, del propio registro de `onia-tg.sh`:

| día | mensajes que le llegaron |
|---|---|
| 2026-09-04 | **443** |
| 2026-09-05 | 256 |
| 2026-09-06 | 242 |
| 2026-09-07 | 226 |

**Dieciocho scripts** le escribían por ahí. Un aviso cada tres minutos no es un aviso: es ruido,
y el ruido esconde justo el mensaje que sí importaba.

### Cómo quedó

`/root/bin/onia-tg.sh` dejó de ser un enviador y pasó a ser un **enrutador**:

- **Por defecto un aviso NO se manda: se convierte en TAREA del tablero**, que es de donde los
  loops sacan trabajo. Un CI roto o un loop caído ahora **se arregla**, no se avisa. Las tareas
  llevan la marca `[auto:<clave>]` y se **deduplican**: el mismo aviso repetido no crea 144
  tareas al día.
- **Sólo con `ONIA_TG_DIRECTO=1` sale a Telegram.** Hoy lo usan el circuito de aprobaciones
  (donde él TIENE que decidir, marcado en el crontab) y el parte diario.
- **`onia-parte-diario.sh`, nuevo, `0 9 * * *`**: UN mensaje al día. *"Todo en orden"*, o la
  lista corta de lo que el sistema no pudo arreglar solo. Sólo nombra lo que ya lleva más de
  12 h abierto — reportar una tarea recién creada sería el mismo ruido con otro nombre, porque
  el loop todavía no tuvo su vuelta.

**Probado antes de dejarlo**, con reversión automática si fallaba: (1) un aviso crea tarea y no
manda Telegram · (2) repetido no duplica · (3) el camino directo sigue llegando.

### El error que casi lo arruina, y su lección

La primera versión usaba `grep -q` dentro de una tubería, con `set -o pipefail`. **`grep -q`
corta al primer match, el productor muere con SIGPIPE (141), y `pipefail` reporta la tubería
entera como fallida aunque el match exista.** La prueba dijo *"no creó la tarea"* con la tarea
creada y visible en el tablero.

**Estaba en la deduplicación también**: habría dicho SIEMPRE "no existe" y este script crearía
144 tareas iguales por día — **el mismo ruido, mudado de Telegram al tablero**. Se arregló con
`grep -c`, que no corta al primer match. Es el mismo patrón de §5.4: un instrumento que da rojo
con la cosa funcionando.

### Lo que queda abierto de esto

- ✅ **`onia-veredicto-sergio`: RESUELTO, y no estaba roto.** Se forzó una corrida: salió bien y
  el propio planificador lo registró — `cron.scheduler: Job '94f352c07554': delivered to
  telegram:<chat>`. Y ese chat es **el MISMO** que usan los vigías (comparado por hash, sin
  imprimir ids). **Siempre le llegó: lo enterraban los otros 226 mensajes del día.** Con el
  ruido apagado, se ve.
- ⚠️ **El reloj del VPS es UTC, no La Paz** (`timedatectl` → `Etc/UTC`). Un script propio
  rotulaba su salida como *"hora en el VPS (La Paz)"* y con eso llegué a decir que el veredicto
  *"debió dispararse hace 37 minutos"*: eran las **12:39 La Paz**, no las 16:39, y faltaban más
  de tres horas para su turno. **No había ningún bug de planificador.** Otro instrumento
  midiendo un sustituto (§5.4) — esta vez, una etiqueta que yo mismo escribí mal.
- **`onia-vigia-sin-respuesta.sh`** (alguien le escribió al bot y nadie contestó) ahora va al
  tablero como todo lo demás. **Es el único que yo dejaría en directo**: un prospecto esperando
  es urgente y una tarea puede quedarse horas. Se cambia con `ONIA_TG_DIRECTO=1` en su línea del
  crontab, si él quiere.

---

## 8. Próximos pasos, en orden

1. **Sergio Urcullo hace el #1 de §6** (BIOS + arranque de Windows). *Listo* = corte de luz
   simulado y el nodo vuelve solo con su cron corriendo. **Es el único punto único de fallo.**
2. **Confirmar el ahorro con datos reales** (3-4 días después del 2026-09-08). *Listo* = la
   consulta de §7 sobre `LiteLLM_SpendLogs` da por debajo de US$ 4 semanales. Si no bajó, el
   siguiente corte es `onia-ordenador-tablero` a `0 */12`.
3. **Un comentario real en Instagram** → leer el veredicto → **pasar la firma a bloquear**.
   *Listo* = `Firma: veredicto` corta con `firma_ok: false`, y un evento inventado por `curl` ya
   no pasa.
4. **Recién ahí, activar la primera palabra por video.** *Listo* = un comentario real recibe el DM
   y Meta devuelve `message_id` — **no alcanza con que la ejecución diga `success`**.
5. **Vigilar una semana la guarda anti-retrabajo**: que ningún loop vuelva a quedar cientos de
   commits atrás de `main`. *Listo* = cero avisos de conflicto por Telegram.
6. **Anotados, sin fecha:** Tailscale, versionar `loops-remotos.txt` / `loops-vps.txt`, y los
   puntos #5/#6/#7 del doc de producto.

---

## 9. Las tres máquinas

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — i5-12400F, 12 hilos, 1 TB. **Los 4 loops** | existe `/root/.onia-nodo` con `casa` |
| **VPS** | `srv1360183` · 187.77.16.63 — **solo la app** | existe el CLI de Hermes |

Se reconocen por **archivo, nunca por hostname**. ⚠️ En `nodo-casa` ya estás **dentro** de WSL
si el prompt dice `compu_pc_casa_sergio@DESKTOP-0GGGNMF`: `wsl` es un comando de Windows y ahí
no existe. Y **se llega desde el VPS**, sin su teclado:
`ssh -i /root/.ssh/vps-a-nodo -p 2222 root@127.0.0.1`.
