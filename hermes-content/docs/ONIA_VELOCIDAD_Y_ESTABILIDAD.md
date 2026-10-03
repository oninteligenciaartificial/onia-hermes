# Onia: velocidad y que no se caiga

29-sep-2026, para Sergio Urcullo. Se midió producción (app.onia.com.bo, onia.com.bo, el VPS y la base) y se leyó el código de producción (master c3b92067) y del candidato 1.0 sin publicar (codex/v1-integracion-20260927). Todo en solo lectura: nada se reinició, se borró ni se cambió.

Cómo leer este informe:
- **[V]** = medido, con el comando o el archivo que lo prueba. **[I]** = inferido, no medido.
- **TTFB**: cuánto tarda en empezar a llegar la respuesta. **LCP**: cuándo aparece lo principal de la pantalla. **p50**: la mitad de las veces tarda menos que eso. **p95**: 95 de cada 100 veces tarda menos.
- **KB gz**: peso comprimido que realmente viaja por la red.
- Los códigos entre paréntesis (FRONTEND-01, BACKEND-02, ESTABILIDAD-03...) remiten a la medición original. Cada uno pasó por un revisor escéptico; acá solo quedan los confirmados y los dudosos, marcados como tales.

---

## 1. En 8 líneas

1. **Hoy no se cae.** 99,97 % de disponibilidad en 31 días (3 fallas en 8.880 chequeos cada 5 min), 0 errores de servidor en 72 h y 0 reinicios del producto [V].
2. **El servidor es rápido sin sesión y lento con sesión.** /login se arma en 15-20 ms, pero /dashboard tarda 301 ms (p50) y 465 ms (p95), y las listas de citas, pacientes y tratamientos tardan 580-630 ms (p50), medido en el servidor [V].
3. **Desde Bolivia se suma la distancia.** El servidor está en Boston: una página nueva empieza a llegar en unos 0,7 s (mediana 705-804 ms). En un celular lento de laboratorio, el login se ve en 1,7-2,2 s y queda usable en unos 4,5 s; la home tarda 2,9 s en mostrarse [V].
4. **Que no se caiga hoy es más suerte que diseño.** Todo corre en un solo VPS, la app espera sin límite a la base y a los servicios externos, y su chequeo de salud no mira la base [V].
5. **Riesgo 1: los respaldos están en el mismo disco que la base.** Si se pierde el VPS se pierden los datos y los respaldos juntos, y nadie probó que el respaldo diario se pueda restaurar [V].
6. **Riesgo 2: nadie vigila desde afuera.** Todos los vigías viven dentro del mismo VPS: si el VPS entero cae, no sale ningún aviso [V].
7. **Riesgo 3: una traba deja la app colgada y "verde".** Si la base, Chatwoot, WhatsApp o Meta no responden, la app se queda esperando, el chequeo dice "sano" y nada la reinicia [V].
8. **Lo que más frena:** cada pantalla pregunta "¿quién es este usuario?" hasta 3 veces, dando la vuelta por Cloudflare (~100 ms cada vez), y todas las páginas bajan una fuente de íconos de 250 KB. Los tres riesgos se arreglan con cambios chicos y gratis antes de publicar la 1.0.

---

## 2. Cómo está hoy (línea base)

| Métrica | Valor | Cómo se midió |
|---|---|---|
| Momento | 29-sep-2026, 12:05-13:16 UTC (08:05-09:16 La Paz) | `date -u` en el VPS |
| Código en producción | imagen `release-c3b92067` = master c3b92067; arrancó 29-sep 03:27 UTC; 0 reinicios; sin OOM | `docker inspect onia-platform` + `git rev-parse origin/master` [V] |
| Máquina | 4 vCPU; 15.992 MB de RAM (4.770 usados, 11.221 disponibles); swap 4.084 de 8.191 MB; carga 0,5-1,0 | `free -m; uptime; nproc` [V] |
| Presión de memoria | 0,00 (no falta RAM) | `cat /proc/pressure/memory` [V] |
| Disco / | 87 % (167 de 193 GB; 26 GB libres); alerta automática recién a 88 % | `df -h /`; `onia-vigia-disco.sh:24` [V] |
| CPU propia (promedio diario) | 11-13 % ocupada (21 al 28-sep) | `sar -u -f /var/log/sysstat/saNN` [V] |
| CPU robada por vecinos (steal) | 2,5 % (21-sep) a 6,4 % (28-sep), antes de que existiera el CI en el VPS | `sar -u` + `docker inspect` (runners creados 29-sep 02:25 UTC) [V] |
| Disponibilidad | 99,97 % en 31 días: 8.880 chequeos, 3 fallas (29-ago, 07-sep, 19-sep) | `/var/log/onia-auth-canary.log` [V] (el canario corre dentro del VPS) |
| Errores de servidor | 0 respuestas 5xx en 72 h (11.032 requests al producto) | log de acceso de Traefik, `scripts/tr.sh` [V] |
| Tiempo en el servidor, sin sesión | /login 15-20 ms; web onia.com.bo 4-12 ms | `curl` desde el VPS directo al contenedor [V] |
| Tiempo en el servidor, con sesión | páginas y APIs dinámicas: p50 125 ms, p95 487 ms, p99 776 ms, máx 3.434 ms (n=10.239) | Traefik 72 h [V] |
| Pantallas y APIs clave (p50 / p95) | /dashboard 301/465 ms; /api/appointments 583/766; /api/patients 618/739; /api/treatments 631/786; /api/bandeja 640/898; /api/notifications 312/529 | Traefik 72 h, agrupado por ruta [V] |
| "¿Quién es el usuario?" (GoTrue /user) | 7.547 llamadas en 72 h, 7.515 hechas por el propio VPS; p50 101 ms, p95 209 ms; 1,53 llamadas por request con sesión | Traefik, router `https-app-supabase-manual` [V] |
| Desde Bolivia, conexión nueva (TTFB) | onia.com.bo/ 705 ms (p90 1.000); /precios 804; app /login 710 (p90 953); /register 707 (p90 1.025) | `curl -w` x10 desde la PC en Bolivia [V] (una sola red) |
| Desde Bolivia, conexión abierta | borde de Cloudflare 109-124 ms; ir hasta Boston suma ~110-135 ms más | `curl` a un archivo en caché vs uno que sale del servidor [V] |
| Peso de /login | ~666 KB en 29 requests: JS 312,5 KB gz, fuentes 307,8 KB (íconos 249,8), CSS 26,1, HTML 7,8, imágenes 11,5 | `curl` de cada recurso + Playwright (671 KB) [V] |
| JS de primera carga por ruta | 322-371 KB gz (mediana 327); base común a todas 213 KB gz; /settings/chatbot la más pesada (371) | `scripts/firstload.js` sobre el `.next` del candidato del 27-sep [V] |
| Laboratorio, celular lento (150 ms, 1,6 Mbps, CPU 4x) | /login LCP 1.684-2.192 ms y carga completa ~4,5 s; /register LCP 1.784; home LCP 2.892-2.964 (5.764 en la primera corrida); /precios LCP 3.288; saltos de pantalla (CLS) 0-0,005 | `scripts/vitals.js`, Playwright ya instalado [V] |
| Laboratorio, escritorio | LCP 1,1-1,5 s en todas; CLS 0 | `scripts/vitals.js` [V] |
| Base de datos | Postgres 15.8; 37 MB; 20 de 100 conexiones; caché 99,88 %; la consulta más lenta de la app 139 ms; sin límite de tiempo por consulta (`statement_timeout` 0) | `psql` solo SELECT/SHOW, `pg_stat_statements` [V] |
| Respaldos | diario 07:00 UTC (2,16 MB, 9,2 s) + otro a las 04:10 UTC; todos en el mismo disco; `restoreVerified: false`; 1 sola prueba de restauración, manual, el 24-sep | `ls -lt /root/backups/*`, `postgres-export-job.status.json` [V] |
| Corte en cada publicación | ~5 s (29-sep) y ~7 s (24-sep); hay canario previo, vuelta atrás automática y 1 contenedor de respaldo | `/var/log/onia-deploy-aprobado.log`, `swap-imagen.sh` [V] |
| Certificados | borde de Cloudflare vence 13-nov-2026; el del VPS 30-oct-2026 (se renueva solo, sin errores en 30 días) | `openssl s_client` [V] |
| Reinicio pendiente | 2 kernels nuevos + libc sin aplicar; último arranque 24-ago | `/var/run/reboot-required.pkgs`, `last -x reboot` [V] |
| Memoria agotada (OOM) | 1 caso en 7 días: 29-sep 02:54 UTC, dentro del runner de CI; producción no se enteró | `journalctl -k`, `dmesg` [V] |

---

## 3. Lo que puede tirar el sistema

La probabilidad es una estimación [I] basada en lo medido; el impacto y la defensa están respaldados por la evidencia citada.

| # | Qué pasa | Probabilidad | Impacto | Defensa más barata | Cuándo |
|---|---|---|---|---|---|
| C1 | **Respaldos en el mismo disco.** Los 4 destinos están en `/dev/sda1`; no hay rclone, restic ni S3; el envío a R2 de `backup-dentalgest-cloud.sh` está comentado (ESTABILIDAD-01) | Baja por mes, pero sin vuelta atrás | Se pierden todos los datos y sus respaldos | Copia diaria cifrada a Cloudflare R2: ~66 MB/mes, USD 0 | **Antes de publicar 1.0** |
| C2 | **Nadie vigila desde afuera.** Todos los vigías corren en el mismo VPS; no existe `/api/health` (da 401). El 22-ago la caída la encontraron personas (ESTABILIDAD-02) | Media (ya pasó una vez) | Caída total sin aviso hasta que alguien lo nota | UptimeRobot gratis: 3 monitores cada 5 min | **Antes de publicar 1.0** |
| C3 | **La base se traba y congela todo.** El pool de la app tiene 10 conexiones y espera sin límite (`pg-pool index.js:206`); ni la base ni el rol `postgres` tienen `statement_timeout` (BACKEND-02 y hallazgo nuevo de estabilidad) | Baja: consulta más lenta hoy 139 ms, 0 errores en 72 h. El disparador real sería un cambio manual o un script que bloquee una tabla | Todas las pantallas cuelgan sin error | Un archivo (`lib/prisma.ts`): esperar conexión 5 s, consulta 20 s, transacción ociosa 30 s | **Antes de publicar 1.0** |
| C4 | **Un servicio externo se cuelga.** 11 llamadas sin límite de espera (Chatwoot, aviso de tiempo real, WhatsApp x3, Meta, SIAT, n8n, facturas recurrentes, admin WhatsApp) y el correo sin timeout. Node espera hasta ~300 s [I]. La bandeja consulta Chatwoot cada 5 y 15 s, y crear o editar una cita espera el aviso de tiempo real (BACKEND-03, ESTABILIDAD-08) | Baja-media: depende de terceros | Se cuelgan la bandeja, el alta de citas y los recordatorios | `AbortSignal.timeout(...)` en cada llamada (1-2 h) | **Antes de publicar 1.0** |
| C5 | **El chequeo de salud es ciego y nada reinicia.** El chequeo pide `/` y eso no toca la base; Docker no reinicia un contenedor "unhealthy"; auth2, onia-center (motor del bot), la web, n8n y Chatwoot ni siquiera tienen chequeo; `claude-guardia.sh` solo levanta contenedores apagados. Además `/api/appointments` y `/api/patients` devuelven 500 sin dejar registro, así que Sentry no los ve (BACKEND-06, ESTABILIDAD-11) | Baja hoy | Un cuelgue (C3/C4) queda caído hasta que alguien lo ve | `/api/health` con `SELECT 1` en 2 s + reinicio tras 3 fallos seguidos + aviso por Telegram | 1.0.1 |
| C6 | **Los crons de clientes fallan en silencio.** 0 avisos en los 6 runners (recordatorios, trial, renovaciones, agentes, facturas recurrentes, core). Ya fallaron sin que nadie lo supiera: recordatorios 4 veces 522, 1 vez 523, 1 timeout de 120 s y 1 error de conexión; trial 2 veces 500 y 1 timeout de 60 s (ESTABILIDAD-04) | Alta (ya pasó) | Un paciente no recibe su recordatorio; no se sabe cuándo pasó porque el log no tiene fecha | Una línea por runner que llame a `onia-tg.sh "cron X falló"` si el comando sale con error (el helper ya existe) | **Antes de publicar 1.0** |
| C7 | **El CI corre en el VPS de producción.** Los runners pueden usar 2 de 4 vCPU con la misma prioridad que producción. Durante el CI la CPU sube a 38-54 % y el steal a 8,7-16,9 %. Además, si hay un CI corriendo, `build-and-stage.sh:55` bloquea el build de producción y los hotfix (ESTABILIDAD-03 + 1 hallazgo nuevo) | Media: son ~2 vCPU sostenidas ~4 h, parecido al ollama que provocó la penalidad del 22-ago | Penalidad de CPU de Hostinger (no se levanta sola); hotfix trabado | `docker update --cpus 1 --cpu-shares 256` (15 min, reversible) + tests con `--maxWorkers=2` | **Antes de publicar 1.0** |
| C8 | **QA escribe en la base de producción.** `onia-platform-qa` usa la misma base y el mismo GoTrue que producción, como superusuario (BACKEND-05) | Baja-media | Un test o una limpieza mal escrita borra datos reales; QA compite por CPU con los clientes | Base separada para QA (medio día) | Decisión de Sergio |
| C9 | **Reconstruir el VPS no es repetible.** El crontab (43 entradas), las rutas de Traefik, los alias de red y `app.env` existen solo en el VPS. El tiempo de recuperación nunca se midió [I: horas a días] (ESTABILIDAD-05) | Baja | Si hay que armar otro VPS, se reconstruye de memoria | Meter esos archivos en la copia cifrada de C1 + runbook "VPS desde cero" | **Antes de publicar 1.0** |
| C10 | **La restauración no se prueba sola.** Pérdida máxima ~21 h de datos: no hay registro continuo (WAL/PITR) y el script `verify-restore.sh` existe pero no está en cron (ESTABILIDAD-06) | Baja | Descubrir que el respaldo no sirve justo cuando hace falta | Restauración semanal automática en un contenedor descartable + aviso | 1.0.1 |
| C11 | **Reinicio pendiente, arranque en frío no probado desde el 24-ago.** Desde entonces cambió todo el arranque: imagen, runners, alias, 43 crons (ESTABILIDAD-13) | Baja, pero Hostinger puede forzarlo | Si algo no vuelve solo, se descubre a las 3 AM | Reinicio planificado a las 04:00 La Paz, con alguien mirando | Decisión de Sergio |
| C12 | **La sesión depende de Cloudflare.** Cada chequeo de sesión sale del VPS a Cloudflare y vuelve. Si Cloudflare o la ruta `/supabase` fallan, el panel responde 503 con la app y la base sanas. Los 522/523 de C6 usan esa misma vuelta (ESTABILIDAD-09) | Baja | Panel caído entero | Usar la dirección interna (`kong:8000`), ver L1 | 1.0.1 |
| C13 | **Un solo VPS para todo:** 26 contenedores (producto, base, bot, n8n, Chatwoot, web, CI) (ESTABILIDAD-17) | Baja | Cae todo junto | Primero C1 + C2 + C9 (gratis); un VPS de reserva solo con clientes pagando | Decisión de Sergio |
| C14 | **La web de venta cae con el VPS:** su HTML no se guarda en Cloudflare (`cf-cache-status: DYNAMIC`) (ESTABILIDAD-16, FRONTEND-04) | Baja | onia.com.bo fuera de línea | Regla de caché en Cloudflare o "Always Online" (sin verificar si ya está activo) | 1.0.1 |
| C15 | **Errores del navegador invisibles.** El Sentry del navegador viaja en todas las páginas pero está apagado: no se pasó la variable al build (`Dockerfile` l.19-25 y l.32). Resultado: `hasDsn=false`, `enabled=false` (hallazgo nuevo de frontend) | Ya pasa | No se ve cuándo se rompe una pantalla | Pasar `NEXT_PUBLIC_SENTRY_DSN` al build (o sacar Sentry del cliente) | 1.0.1 |
| C16 | **Disco al 87 % y la alerta salta al 88 %.** Hay 7 carpetas `build-*` viejas (~22 GB) que no usa ningún contenedor; ya hay podas semanales (ESTABILIDAD-07) | Baja: 26 GB libres; tasa de crecimiento sin medir | Con el disco lleno la base no puede escribir: caída total | Borrar los 7 builds (con tu OK) + guardar un `df` diario | 1.0.1 |
| C17 | **Cada deploy corta lo que está en curso.** Primero para el viejo y después arranca el nuevo: ~5-7 s de corte (hallazgo nuevo de backend) | Segura en cada deploy; hoy 0 errores 5xx visibles | Se pierde un guardado a medias | Arrancar el nuevo antes de parar el viejo [I: hay que revisar cómo enruta Traefik] | 1.0.1 |
| C18 | **Sin techo de memoria en los servicios** (producto, base, n8n, Chatwoot, onia-center) (ESTABILIDAD-10) | Baja: 11,2 GB libres, presión 0 | Un vecino desbocado puede tumbar la base | Poner techo a n8n, Chatwoot y onia-center en 2-3 veces su uso + proteger la base y la app al reiniciar | 1.0.1 |
| C19 | **Un `apt install` cualquiera actualiza Docker y reinicia todo.** Ya pasó el 3-sep (ESTABILIDAD-12) | Baja | Reinicio de todos los contenedores | `apt-mark hold docker-ce docker-ce-cli containerd.io` (5 min) | 1.0.1 |
| C20 | **El límite de intentos público vive en memoria** y no se poda; se vacía en cada deploy. Upstash y Traefik ya cubren lo sensible (ESTABILIDAD-15) | Baja | Menor | Podar el Map o pasarlo a Upstash | 1.0.1 |

---

## 4. Lo que lo hace lento

| # | Qué pasa | Cuánto cuesta hoy [V] | Arreglo más barato | Mejora esperada y cómo se mide | Cuándo |
|---|---|---|---|---|---|
| L1 | **"¿Quién es el usuario?" se pregunta varias veces y por Cloudflare.** Lo preguntan el proxy (`proxy.ts:173`), el layout (`layout.tsx:66-67`) y `getTenantProfile` (`lib/auth.ts:50-52`). Son 3 veces en una carga completa y 1,53 en promedio. Todas usan la dirección pública (BACKEND-01 alta, FRONTEND-07, ESTABILIDAD-09) | /user p50 101 ms, p95 209; /dashboard p50 301 ms; la vuelta por Cloudflare suma 20-70 ms por llamada frente a 1-6 ms por la dirección interna | (1) el layout reusa `getTenantProfile`; (2) el proxy pasa el usuario verificado en un encabezado interno que siempre sobrescribe: 1 sola llamada por request; (3) dirección interna `kong:8000` | [I] /dashboard p50 de ~300 a ~110-150 ms. Se mide con `tr.sh`: llamadas a /user por request ≤ 1,0 y p50 de /dashboard antes y después | 1.0.1 (riesgo medio-alto: toca el login; el 04-sep la dirección interna rompió la cookie) |
| L2 | **Fuente de íconos de 250 KB en todas las páginas**, con 3 ejes de diseño que no se usan (FRONTEND-01 alta) | 249.740 B en producción y 260.768 B en el candidato. /login en celular lento con la fuente: carga 4.521-4.943 ms, 666 KB. Sin la fuente: 3.641-3.649 ms, 415 KB | Fijar GRAD=0 y wght=400 con `fonttools varLib.instancer` en `scripts/subset-iconos.mjs`: 72.976 B, sin cambio visible. No fijar opsz, porque la barra lateral usa 20 a propósito | ~1 s menos hasta que el login queda usable en celular (medido bloqueando la fuente). Gate: fuente ≤ 80 KB | **Antes de publicar 1.0** |
| L3 | **La fuente y los logos se guardan solo 4 horas y Cloudflare los revalida contra Boston en cada visita** (FRONTEND-05) | Fuente: `REVALIDATED` 3 de 3, TTFB 0,67-0,69 s; logo de la web 0,92 s; los archivos de `/_next/static` sí dan HIT en 0,54 s | En `next.config.ts` → `headers()`: `/fonts/*` con caché de 1 año (la URL ya lleva `?v=` con hash); logos 1 día con `stale-while-revalidate` | `curl -D -` muestra `cf-cache-status: HIT` y `max-age=31536000` | **Antes de publicar 1.0** |
| L4 | **El menú no precarga nada**, ni al pasar el mouse. El comentario de `Sidebar.tsx:169-170` dice lo contrario y es falso en Next 16.2.7 (`link.js:108` y `:334`) (FRONTEND-03) | Cada clic es un pedido en frío: 143 ms en el servidor (p50) + ~110-135 ms a Boston + ~110 ms al borde | Precargar al pasar el mouse, al enfocar o al tocar (`router.prefetch`), sin volver a la precarga masiva del 04-sep | [I] el clic del menú sin espera de red cuando el gesto llega antes. Vigilar con `tr.sh` que la carga de navegación no se dispare | 1.0.1 |
| L5 | **La pantalla de citas pide sus datos después de pintarse.** 5 pedidos a APIs lentas (`appointments/page.tsx`, 1.090 líneas, cliente). `/api/patients` además trae todos los pacientes sin límite (FRONTEND-09, BACKEND-07) | /api/appointments p50 583 ms (p90 700); patients 618 (722); treatments 631 (748); doctor-schedules 582 (707); /api/me 444. Con datos de prueba: con volumen real será peor [I] | Primer dibujo con los datos desde el servidor; pacientes de a 50 con búsqueda | Desaparecen 4-5 pedidos por visita. Medir p50/p95 de la pantalla en Traefik | 1.0.1 |
| L6 | **La bandeja depende de Chatwoot en cada consulta**, cada 5 y cada 15 s (`InboxClient.tsx:125,134`) (BACKEND-03) | /api/bandeja p50 640 ms, p95 898, contra 312 ms de una API similar sin Chatwoot [I: ~330 ms son de Chatwoot] | El límite de 5 s de C4; más allá no se midió | p95 de /api/bandeja en Traefik | Antes de 1.0 (el límite) |
| L7 | **JS de primera carga de 310-370 KB gz por ruta.** Sentry apagado igual viaja (~47 KB gz de peso muerto). supabase-js se carga en /login aunque la contraseña va por `/api/auth/login`. Hay 0 cargas diferidas (`next/dynamic`) (FRONTEND-06) | /login 312,5 KB gz; Sentry 47.171 B gz; supabase-js 48.570 + 11.906 B gz | `import()` diferido de supabase-js en LoginForm y SignupForm (~60 KB gz menos); Sentry: encenderlo (C15) o sacarlo (-47 KB); carga diferida de los editores de /settings/chatbot | /login ≤ 260 KB gz con `firstload.js` | 1.0.1 |
| L8 | **En celular, la home pasa ~0,8 s acomodando la página antes de mostrar algo.** No es JavaScript: una tarea de 907-946 ms antes del primer pintado, repartida en Layout 808 ms + UpdateLayoutTree 137 ms (hallazgo nuevo de frontend) | Primer pintado 2.448-2.488 ms; LCP 2.892-2.964 ms. El CSS tiene 14 `text-wrap:pretty`, 12 `balance`, filtros blur y 6 `backdrop-filter` [I: la regla exacta no se aisló] | Perfilar el CSS con la tipografía nueva de la rama web; mostrarte el resultado renderizado antes de publicar | LCP móvil ≤ 2,5 s con `vitals.js` + `trace.js` | 1.0.1 |
| L9 | **El servidor está en Boston y los usuarios en Bolivia** (FRONTEND-02, BACKEND-10) | ~110-135 ms más por cada pedido que no sale de la caché. Medido desde una sola red | Gratis: menos idas y vueltas (L1, L5) y más caché en el borde (L3, L10). Con plata: mudar el servidor o Argo | TTFB desde Bolivia con `curl -w`, medido desde 2-3 redes de Santa Cruz antes de decidir | Decisión de Sergio |
| L10 | **El HTML de onia.com.bo no se guarda en Cloudflare**, aunque el servidor lo marca cacheable por 1 año (FRONTEND-04) | TTFB 242-253 ms contra 116-118 ms de algo en caché; 9.853 pedidos en 72 h llegan todos al VPS | Regla de caché de Cloudflare + **purga obligatoria** al publicar. Sin purga, el HTML viejo apunta a archivos que ya no existen | `cf-cache-status: HIT` en /, /precios, /agentes | 1.0.1 (panel de Cloudflare) |
| L11 | **CPU robada por vecinos de Hostinger** (hallazgo nuevo de estabilidad) | 28-sep de 14 a 24 UTC: nuestra CPU 6,6 %, robada 9,1 % (picos 13-15 %). Subió de 2,54 % a 6,39 % entre el 21 y el 28-sep | Reclamo a Hostinger o pedir cambio de nodo. Recortar el CI no lo arregla | `sar -u` diario: steal ≤ 5 % | Decisión de Sergio |
| L12 | **El proxy consulta la sesión también en `/sw.js` y en páginas públicas** cuando hay cookie (`proxy.ts:173` va antes del `return` de las rutas públicas) (hallazgo nuevo de backend) | 457 de 1.118 pedidos a /sw.js tardan ≥ 80 ms (p50 16 ms) | Salir antes, o sacar sw.js y el manifest del matcher | p50/p90 de /sw.js en `tr.sh` | 1.0.1 |
| L13 | **Esperas en fila en el layout y el dashboard**, sin `Promise.all`; solo 2 pantallas de carga genéricas (BACKEND-09, FRONTEND-11) | Poco en caliente (0,2-0,8 ms por consulta); 10-33 ms si hay que abrir conexión | `Promise.all` + skeletons en las 5 rutas más usadas; conexiones que se mantienen abiertas (lo trae C3) | p50 de /dashboard en `tr.sh` | 1.0.1 |
| L14 | **Conexiones que se abren y cierran sin parar** (BACKEND-04, **dudoso**) | 1.176.094 sesiones en ~25,6 días; abrir una cuesta 10-33 ms. No se pudo probar que GoTrue sea parte del problema | Ya lo cubre C3 (mínimo 2 conexiones, 5 min antes de cerrar) | Sesiones por día en `pg_stat_database` | Con C3 |
| L15 | **Cargas ajenas al producto en la misma base** (BACKEND-12) | Consulta del radar de Hermes: media 239 ms, máx 5,4 s. El sondeo de Realtime es el 82,8 % del tiempo de la base, con 0 suscriptores | Índice `created_at DESC` en `onia_center.ai_radar_items` (15 min) | Media del radar < 10 ms en `pg_stat_statements` | 1.0.1 |
| L16 | **Índices y memoria de Postgres de fábrica** (BACKEND-08, BACKEND-11) | Sin efecto hoy: 418 filas en el producto, caché 99,9 % | Índices compuestos por organización; memoria de Postgres cuando la base pase ~500 MB-1 GB | `EXPLAIN` en una base de prueba con datos sembrados | 1.0.1 / cuando crezca |
| L17 | **La confirmación pública de cita (/cita) no muestra "Enviando..."** (FRONTEND-12) | 0,5-1 s sin ninguna señal en el celular [I] | Botón con `useFormStatus` (30 min) | Mirarla renderizada | 1.0.1 |
| L18 | **La tipografía nueva del candidato no está medida** (FRONTEND-13, **dudoso**) | Probables 3 archivos precargados, no 5 [I]: Instrument Sans es variable, IBM Plex Mono estática | `weight: 'variable'` en Instrument Sans y `preload: false` en la mono | Suma de `*.p.woff2` precargados en /login en el build del VPS | **Antes de publicar 1.0** |

---

## 5. Presupuestos y gates permanentes

Son los números que el rediseño y cada deploy tienen que cumplir. La columna "Hoy" dice si hoy se cumple. Donde el gate no existe todavía, se indica.

| Qué | Presupuesto | Hoy [V] | Cómo se mide solo | Cuándo corre |
|---|---|---|---|---|
| Fuente de íconos | ≤ 80 KB | 249.740 B en prod, 260.768 B en el candidato: **no cumple** | Test que lee el tamaño de `public/fonts/material-symbols-outlined.woff2`. No existe; crearlo | Cada PR |
| Fuentes precargadas en /login | ≤ 150 KB en total | 307,8 KB: **no cumple** (con L2: ~131 KB) | Script post-build: suma de los `rel=preload` de fuentes. Crearlo | Cada build en el VPS |
| JS de primera carga (gz) | Ya: ninguna ruta pasa de 375 KB y ninguna crece más de 10 KB por PR sin explicar por qué. Después de L7: /login y /register ≤ 260 KB, panel ≤ 330 KB | 322-371 KB; /login 312,5 KB | `firstload.js` sobre el `.next` del build (hoy en `scripts/velocidad/`; hay que llevarlo al repo) | Cada build en el VPS |
| LCP, celular lento de laboratorio (150 ms, 1,6 Mbps, CPU 4x) | ≤ 2.500 ms en /login, /register, onia.com.bo/ y /precios | /login 1.684-2.192 cumple; home 2.892-2.964 y /precios 3.288 **no cumplen** | `vitals.js` (Playwright ya instalado) contra producción | Después de cada deploy |
| Saltos de pantalla (CLS) | ≤ 0,1 | 0-0,005: cumple | `vitals.js` | Después de cada deploy |
| Bloqueo del hilo (TBT), celular de laboratorio | ≤ 200 ms | /login 338 ms: **no cumple**; home 147-170 ms: cumple | `tbt2.js` | Después de cada deploy |
| Tiempo en el servidor (Traefik, 72 h) | Dinámicas p95 ≤ 500 ms; /dashboard p50 ≤ 200 ms; APIs p95 ≤ 800 ms | 487 cumple; 301 **no**; /api/bandeja 898 **no**, el resto cumple | `tr.sh` como cron diario de solo lectura, con aviso por Telegram si se pasa. Crearlo | Diario |
| Llamadas a /user por request con sesión | ≤ 1,0 | 1,53: **no cumple** | `tr.sh` (cuenta de /supabase/auth/v1/user ÷ requests dinámicas) | Diario |
| Errores de servidor | 5xx ≤ 0,1 % de las requests | 0 %: cumple | `tr.sh` | Diario |
| Disponibilidad vista desde afuera | ≥ 99,9 % al mes; /login responde en ≤ 1,0 s | Solo existe el canario interno (99,97 %); TTFB desde Bolivia 710 ms (p90 953) | UptimeRobot (mide caída y tiempo de respuesta) | Cada 5 min |
| Límites de espera | 0 `fetch` sin `signal` en `lib/` y `app/api/` (salvo excepciones anotadas); la app con `statement_timeout` 20 s y 5 s para conseguir conexión | 11 llamadas sin límite; `statement_timeout` 0: **no cumple** | Test de CI con grep + `/api/health` que devuelve el `statement_timeout` activo | Cada PR / cada 30 s |
| Salud real | `/api/health` hace `SELECT 1` en ≤ 2 s; 3 fallos seguidos = reinicio + aviso | No existe | Chequeo del contenedor + guardia | Cada 30 s |
| Corte por deploy | ≤ 10 s | 5-7 s: cumple | Log del publicador (desde que para el viejo hasta SWAP OK) | Cada deploy |
| CI en el VPS | CPU ≤ 1,5 de 4 vCPU en total y con menor prioridad que producción (cpu-shares 256/128 contra 1024); RAM ≤ 7,5 GB (47 % de 16 GB, el tope de hoy, no se sube); steal durante el CI ≤ 10 % | Hasta 2 vCPU con la misma prioridad; steal 8,7-16,9 % durante el CI: **no cumple** | `docker inspect` (NanoCpus, CpuShares, Memory) + `sar -u` diario | Diario |
| Memoria del host | ≥ 4 GB disponibles | 11,2 GB: cumple | `free -m` en la guardia | Cada 10 min |
| Disco | Uso ≤ 80 % (≥ 38 GB libres); aviso al 80 %, crítico al 88 % | 87 %: **no cumple** (tras borrar los builds, ~76 % [I]) | `onia-vigia-disco.sh` con umbral 80 + `df` diario a un log | Diario |
| Antigüedad del respaldo | Último dump ≤ 26 h; última copia fuera del VPS ≤ 26 h; última restauración probada ≤ 8 días | Dump: cumple (29-sep 07:00 UTC). Copia externa: **no existe**. Restauración automática: **no existe** (la última manual fue el 24-sep) | Heartbeat al final de cada copia (healthchecks.io, mencionado por estabilidad; plan sin verificar) + `status.json` con `restoreVerified` | Diario / semanal |

---

## 6. Plan en orden

Primero lo que evita caídas y no cuesta nada, después velocidad, al final lo que cuesta plata. "Antes de 1.0" va en la rama del candidato. Los cambios en el VPS los hace **una sola sesión a la vez** (regla de infra), y publicar sigue necesitando tu OK.

1. **Límite de espera a la base** (`lib/prisma.ts`: conseguir conexión 5 s, consulta 20 s, transacción ociosa 30 s, mínimo 2 conexiones, 5 min antes de cerrarlas). Quién: Claude. Riesgo: bajo (la consulta más lenta hoy es de 139 ms). Se verifica con `show statement_timeout` = 20 s dentro del contenedor y, en una base **descartable**, abriendo 11 `pg_sleep(30)`: la número 11 tiene que fallar a los ~5 s. Ojo: la "QA" actual usa la base de producción (C8), así que no sirve para esta prueba.
2. **Límite de espera a los servicios externos**: Chatwoot 5 s; aviso de tiempo real 2 s y por la dirección interna; WhatsApp, Meta y n8n 10 s; SIAT 15-20 s; correo 10/10/20 s. Quién: Claude. Riesgo: bajo (un proveedor lento pasa a dar error rápido). Se verifica con un test donde el `fetch` nunca responde y tiene que cortar dentro del plazo, y con un grep que dé 0 `fetch` sin `signal`.
3. **Aviso por Telegram cuando falla un cron de clientes** (6 runners, una línea cada uno con `onia-tg.sh`). Quién: Claude, en el VPS. Riesgo: nulo. Se verifica con `grep -c onia-tg` = 1 en cada runner y un aviso de prueba que llega.
4. **Monitor externo gratis (UptimeRobot)**: app.onia.com.bo/login con la palabra "Iniciar sesi", onia.com.bo y el bot. Quién: tú creás la cuenta (Claude no crea cuentas) y Claude te pasa las URLs. Riesgo: nulo. Se verifica cuando llega un aviso de prueba a tu correo o Telegram.
5. **Copia diaria cifrada fuera del VPS (Cloudflare R2)**: dump, Storage, `app.env`, `.env` de Supabase, crontab y rutas de Traefik. Quién: tú creás el bucket y un token limitado a ese bucket (5 min) y aprobás traer rclone; Claude escribe el script y el aviso si falla. Riesgo: bajo (se cifra antes de subir). Se verifica bajando el archivo del día desde R2 y descifrándolo en la PC.
6. **Bajar la prioridad del CI en el VPS**: `docker update --cpus 1 --cpu-shares 256 onia-runner-platform`, `--cpu-shares 128 onia-runner-hermes` y tests con `--maxWorkers=2`. Quién: Claude, con tu OK porque toca contenedores. Riesgo: el CI tarda 30-50 % más; producción no se toca; se revierte con otro `docker update`. Se verifica con `docker inspect` y `sar -u` durante el próximo CI (steal ≤ 10 %).
7. **Fuente de íconos de 250 a 73 KB + caché de 1 año para `/fonts`** (logos 1 día). Quién: Claude. Riesgo: bajo (el test de íconos ya cubre que no se pierdan glifos). Se verifica con el tamaño ≤ 80 KB, `cf-cache-status: HIT` y `vitals.js` en /login.
8. **Medir la tipografía nueva del candidato** en el build del VPS (Instrument Sans variable, mono sin precarga). Quién: Claude. Riesgo: bajo. Se verifica con la suma de fuentes precargadas ≤ 150 KB.
9. **Runbook "VPS desde cero"** y su configuración dentro de la copia cifrada. Quién: Claude. Riesgo: nulo. Se verifica cuando otra sesión lo sigue en papel sin preguntar nada. Medir el tiempo real de recuperación queda para una prueba aparte.
10. **Salud real y reinicio automático**: `/api/health` con `SELECT 1`, chequeo del contenedor apuntando ahí, reinicio tras 3 fallos seguidos con aviso, y registrar el error en los `catch` que hoy devuelven 500 en silencio. Quién: Claude. Riesgo: bajo-medio (con 3 fallos seguidos no entra en bucle). Se verifica en un entorno descartable: se apaga la base, health da 503, el contenedor queda "unhealthy" y se reinicia.
11. **Encender el Sentry del navegador** (pasar `NEXT_PUBLIC_SENTRY_DSN` al build). Esos 47 KB ya se descargan hoy sin servir para nada. Quién: Claude, con tu confirmación. Riesgo: bajo. Se verifica con `getOptions().enabled = true` (`scripts/sentry.js`) y un error de prueba que aparece en Sentry.
12. **Una sola consulta de sesión por request y por la dirección interna** (L1). Quién: Claude. Riesgo: medio-alto; necesita tests del proxy, del MFA y de la cookie, y mirar el login renderizado antes de publicar. Se verifica con /user por request ≤ 1,0 y /dashboard p50 ≤ 200 ms en `tr.sh`.
13. **Precarga del menú por gesto** (L4) y **supabase-js diferido en /login y /register** (L7, -60 KB gz). Quién: Claude. Riesgo: bajo. Se verifica con `firstload.js` y `tr.sh`.
14. **Citas con datos desde el servidor y pacientes paginados** (L5). Quién: Claude. Riesgo: medio (página grande: se hace por partes). Se verifica con el p50 de la pantalla y menos pedidos por visita.
15. **Caché de Cloudflare para el HTML de la web**, con purga obligatoria en el script de publicación y "Always Online" (L10, C14). Quién: tú en el panel de Cloudflare, o autorizás el conector de Cloudflare (hoy pide inicio de sesión); Claude agrega la purga. Riesgo: medio si falta la purga. Se verifica con `cf-cache-status: HIT`.
16. **Home en celular: perfilar los 0,8 s de Layout** (L8). Quién: Claude; vos mirás la pieza renderizada antes de publicar. Riesgo: bajo. Se verifica con LCP móvil ≤ 2,5 s.
17. **Limpieza chica**: borrar los 7 `build-*` (22 GB, con tu OK, es irreversible); `apt-mark hold` de Docker; techo de memoria a n8n, Chatwoot y onia-center; podar el límite de intentos en memoria; índice del radar; botón de /cita; salida temprana del proxy en `/sw.js`; índices compuestos. Quién: Claude. Riesgo: bajo en general (el borrado es irreversible y n8n nunca se reinicia con `docker restart`). Se verifica punto por punto con el comando de cada hallazgo.
18. **Restauración de prueba semanal automática** (C10) y **deploy sin corte** (C17). Quién: Claude. Riesgo: bajo. Se verifica con `restoreVerified: true` y 0 requests cortadas durante un deploy.
19. **Decisiones que cuestan tiempo o plata** (sección 7): reinicio planificado, base de QA separada, reclamo a Hostinger, mudar el servidor, VPS de reserva, CI fuera del VPS.

---

## 7. Lo que depende de Sergio Urcullo

Los costos están en USD con su fuente. No los paso a Bs para no usar un tipo de cambio sin verificar hoy.

| Decisión | Costo | Fuente | Recomendación |
|---|---|---|---|
| Crear el bucket de Cloudflare R2 + un token limitado, y aprobar rclone (herramienta de copia a la nube: imagen Docker `rclone/rclone` o paquete del sistema; sirve para subir los respaldos) | USD 0: ~66 MB/mes, dentro de los 10 GB-mes gratis | developers.cloudflare.com/r2/pricing (citado por el área de estabilidad; no se reverificó hoy) | **Sí, antes de 1.0** |
| Crear la cuenta de UptimeRobot | EUR 0 (50 monitores, cada 5 min) | uptimerobot.com/pricing (citado por estabilidad) | **Sí, antes de 1.0** |
| Bajar la prioridad del CI en el VPS, o sacar el CI a GitHub | Bajar prioridad: gratis, el CI tarda 30-50 % más. Sacarlo: minutos de GitHub Actions (la cuota Free se agotó el 27-sep); precio no verificado | ESTABILIDAD-03 | Bajar la prioridad ya; lo otro, después |
| Borrar los 7 builds viejos (~22 GB) | Gratis, irreversible | `du -sh /opt/onia-platform/build-*` | Sí, después de confirmar que nada los usa |
| Reinicio planificado del VPS (aplica 2 kernels + libc; mide si todo vuelve solo) | Corte estimado de 2-5 min [I] | ESTABILIDAD-13 | Sí, un día a las 04:00 La Paz con alguien mirando |
| Base separada para QA | Medio día; los e2e se rompen hasta tener sus datos propios | BACKEND-05 | Sí, antes de tener el primer cliente real |
| Sentry del navegador: encenderlo o sacarlo | Encenderlo: 0 KB extra (ya se descarga); el costo del plan de Sentry no se verificó. Sacarlo: -47 KB | Hallazgo nuevo de frontend | Encenderlo |
| Regla de caché y "Always Online" en Cloudflare | [I] disponible en el plan gratuito; no verificado | ESTABILIDAD-16 | Sí, con purga obligatoria al publicar |
| Reclamo a Hostinger por la CPU robada por vecinos | Gratis | Hallazgo nuevo de estabilidad (steal 9,1 % con nuestra carga en 6,6 %) | Sí, con los números de `sar` adjuntos |
| Mudar el servidor a Sudamérica | Ahorra ~110-135 ms por cada pedido que no sale de la caché. Precio y oferta de Hostinger en São Paulo **no verificados**. Migración de días (base, n8n, Chatwoot) | FRONTEND-02, BACKEND-10 | **Todavía no**: primero L1, L5 y L10, que son gratis, y medir desde 2-3 redes de Santa Cruz |
| Argo Smart Routing de Cloudflare (acelera el tramo hasta Boston sin mudarse) | Pago; precio **no verificado** en esta revisión | FRONTEND-02 | Evaluarlo solo si después de L1/L5/L10 sigue lento |
| VPS de reserva tibio | USD 8,99/mes precio de entrada (Hostinger KVM 2, 2 vCPU/8 GB); la renovación es más cara | hostinger.com/vps-hosting (citado por estabilidad) | No con 0 clientes; sí cuando haya clientes pagando |

---

## 8. Lo que no se pudo medir y por qué

- **Velocidad real de las pantallas con sesión** (LCP, INP de /dashboard, /pending, /agenda): la regla prohíbe iniciar sesión. Solo hay tiempos del servidor (Traefik) y lectura del código.
- **Datos de usuarios reales** (Cloudflare Web Analytics) y **la configuración de Cloudflare** (reglas de caché, Always Online, modo SSL): el conector de Cloudflare pide autorización.
- **Trazas y alertas de Sentry**: no se usó su token, para no manipular secretos.
- **Capacidad máxima bajo carga**: las pruebas de carga están prohibidas; solo se correlacionó con el tráfico real de 72 h.
- **APIs con volumen real**: todas las cuentas son de prueba (4 pacientes, 0 citas). Los 580-630 ms son un piso, no un techo.
- **Por qué GoTrue tarda ~100 ms**: su trabajo en la base es de ~0,3 ms; la causa no se aisló.
- **Tamaño real del candidato 1.0 con la tipografía nueva**: el `.next` local es del 27-sep y no se puede compilar (solo quedan ~5 GB libres en C:).
- **Ritmo de crecimiento del disco**: no hay historial (`onia-vigia-disco.log` está vacío porque solo escribe al pasar el 88 %).
- **Tiempo de recuperación de un VPS perdido y de un reinicio en frío**: medirlos exige cortar o escribir.
- **Respaldos o snapshots propios de Hostinger**: requieren el panel.
- **OOM anteriores al 22-sep**: journald guarda solo 7 días.
- **Latencia de la app mientras corre el CI**: solo se midió CPU y steal durante el CI.
- **Otras redes de Bolivia**: una sola PC y un solo proveedor.
- **Safari de iPhone y celulares físicos**: el laboratorio fue Chromium con la red y la CPU frenadas.
- **HTTP/3 en uso real**: el curl local no lo soporta.
- **Qué hacen los 44 workflows de n8n contra la app**: no se enumeraron. n8n usa su propia base.
- **Renovación del certificado del VPS** (vence 30-oct): todavía no ocurrió; no se pudo observar.

**Hallazgos refutados (descartados):**
- FRONTEND-08, "la home bloquea 1,45 s por las animaciones": re-medido, el bloqueo después del primer pintado es de 147-170 ms. El costo real está antes del pintado y es Layout (L8).
- FRONTEND-10, "brotli ahorraría 18 %": el brotli que aplica Cloudflare ahorra solo 1,5 % en /login (377.919 a 372.245 B) y varios archivos salen más pesados.
- ESTABILIDAD-14, "LiteLLM pierde memoria ~40 MB/día": el swap estuvo plano del 25 al 28-sep (4.085.331 a 4.087.560 kB) y casi no se lee (0,59-4,31 páginas/s).

**Correcciones parciales** (el hallazgo sigue en pie, pero con este ajuste):
- ESTABILIDAD-03: la subida del steal no la causó el CI, porque los runners nacieron el 29-sep. Son los vecinos de Hostinger (L11).
- FRONTEND-07: la parte "el rate limit de Traefik puede cortar la sesión" es falsa: los límites solo aplican al login con contraseña y al alta.
- BACKEND-02: el `pg_dump` y los deploys no bloquean a la app (los deploys no migran); el riesgo real son los cambios manuales. Baja a media.
- BACKEND-04: la hipótesis del pool de GoTrue no se pudo probar; GoTrue no generó conexiones en 13 minutos de medición.
- ESTABILIDAD-08: `lib/gateway.ts:134` sí tiene límite (15 s) y `app/api/patients/route.ts:93` no frena al usuario.
- FRONTEND-06: la opción "aligerar Sentry" no aplica, porque Sentry está apagado (C15).
- Línea base: hay **un** contenedor de respaldo para volver atrás, no dos.

---

## Anexo técnico: cómo repetir las mediciones

Los scripts usados se copiaron al lado de este informe, en `scripts/velocidad/` (la carpeta temporal de la sesión: **conviene llevarlos al repo**, por ejemplo a `hermes-content/deploy/vps-ops/medicion/`, antes de que se borren). Ninguno imprime secretos.

**Acceso al VPS** (desde `C:/dev/proyectos/onia-hermes/.claude/worktrees/skills-setup-config-8d4674`):
```bash
VPS_HOST=187.77.16.63 VPS_USER=root VPS_KEY_PATH="C:/Users/PC/.ssh/onia_hermes_vps_ed25519" node scripts/vps-cmd.js "<comando>"
# atajos: scripts/velocidad/vps-desde-windows.sh "<comando>" · scripts/velocidad/vr.sh <script-local.sh> · scripts/velocidad/runsql.sh <archivo.sql>
```

**Latencia desde afuera** (10 veces por URL, en serie):
```bash
curl -sS -o /dev/null -H 'Accept-Encoding: br, gzip' -w 'dns=%{time_namelookup} con=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} size=%{size_download}\n' https://app.onia.com.bo/login
curl -sS -D - -o /dev/null https://onia.com.bo/            # cabeceras: cache-control, cf-cache-status
curl -s https://app.onia.com.bo/cdn-cgi/trace              # colo y loc (desde la PC y desde el VPS)
```

**Tiempo en el servidor, sin red** (en el VPS; la IP del contenedor puede cambiar):
```bash
curl -s -o /dev/null -w '%{time_total}\n' -H 'Host: app.onia.com.bo' http://172.22.0.2:3000/login
curl -s -o /dev/null -w '%{time_total}\n' http://127.0.0.1:8091/
```

**Percentiles reales por ruta** (log de Traefik de 72 h; 5xx, clases y rutas más lentas):
```bash
scripts/vr.sh scripts/tr.sh
# por router: docker service logs easypanel-traefik --since 72h | grep https-app-onia-com-bo | awk -f pct.awk
```

**La vuelta por Cloudflare contra la dirección interna** (dentro del contenedor, solo tiempos):
```bash
docker exec -i onia-platform node < scripts/sk_hop.js     # /auth/v1/health: pública vs kong:8000, en caliente y en frío
docker exec -i onia-platform node < scripts/lat.js        # + ping a Upstash
```

**Base de datos** (solo SELECT/SHOW):
```bash
echo "show statement_timeout; show shared_buffers; select count(*) from pg_stat_activity;" | docker exec -i supabase-db psql -U postgres -X
# pg_stat_statements: select ... from extensions.pg_stat_statements join pg_roles r on r.oid=userid order by total_exec_time desc limit 20;
scripts/runsql.sh scripts/q1.sql     # churn de sesiones (espera 30 s)
scripts/runsql.sh scripts/q3.sql     # llamadas de GoTrue/app en 5,5 min
```

**Máquina, CPU robada, swap y disco**:
```bash
uptime; free -m; swapon --show; cat /proc/pressure/{cpu,memory,io}
LC_ALL=C sar -u -f /var/log/sysstat/sa28     # $7 = %steal, $8 = %idle
LC_ALL=C sar -S -f /var/log/sysstat/sa28; LC_ALL=C sar -W -f /var/log/sysstat/sa28
df -h /; docker system df; nice -n19 ionice -c3 du -xh -d1 /opt
docker stats --no-stream
docker inspect -f '{{.Name}} mem={{.HostConfig.Memory}} cpus={{.HostConfig.NanoCpus}} shares={{.HostConfig.CpuShares}} restarts={{.RestartCount}} health={{if .State.Health}}{{.State.Health.Status}}{{end}}' $(docker ps -q)
journalctl -k --since '7 days ago' | grep -i 'killed process'
```

**Disponibilidad, respaldos y crons**:
```bash
wc -l /var/log/onia-auth-canary.log   # sondeos; las fallas se contaron con grep sobre ese log (el patrón exacto no quedó registrado: mirar el formato antes)
tail -5 /var/log/onia-db-backup.log; cat /root/backups/onia-postgres-v1/postgres-export-job.status.json
ls -lt /root/backups/*/ | head; which rclone restic borg aws
for f in /root/bin/run-onia-*.sh; do echo "$f $(grep -ciE 'tg|telegram' $f)"; done
grep -o 'curl: ([0-9]*)' /var/log/onia-appointment-reminders.log | sort | uniq -c; grep -o 'curl: ([0-9]*)' /var/log/onia-trial-drip.log | sort | uniq -c
cat /var/run/reboot-required.pkgs; last -x reboot | head -3
```

**Front: peso, JS por ruta y laboratorio** (Playwright 1.60 ya instalado en el candidato; no instala nada):
```bash
node scripts/firstload.js C:/dev/proyectos/onia-platform-v1-integracion-20260927/.next
node scripts/vitals.js https://onia.com.bo/ https://onia.com.bo/precios https://app.onia.com.bo/login https://app.onia.com.bo/register
node scripts/tbt2.js; node scripts/trace.js      # bloqueo del hilo y traza de Layout en la home
node scripts/sentry.js                           # ¿Sentry del navegador encendido?
curl -s -o ms.woff2 'https://app.onia.com.bo/fonts/material-symbols-outlined.woff2?v=fe4e6d3a0b' && wc -c ms.woff2
# ahorro de la fuente (fontTools local): fonttools varLib.instancer ms.woff2 GRAD=0 wght=400 -o gw.woff2  -> 72.976 B
```
