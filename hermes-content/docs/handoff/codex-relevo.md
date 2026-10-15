
# Relevo vigente Infra → Astra — 2026-10-15

**META:** resolver la causa observada y demostrar all-cloud. **PRUEBA DE HECHO:** ejecución Cloud/browser y E2E recuperable, recibos sanitizados, resultados y QA independiente, incluida evidencia real de independencia de la PC. **PARADA:** bloqueo concreto de cuota/acceso/permiso sensible; preservar lo logrado. No dar por cumplido por duración, mocks, documentación o delegación.

## Autoridad y propiedad

Sergio Urcullo pidió nueva sesión Astra, investigar/corregir hasta all-cloud, registrar fallos y realizar las pruebas necesarias sin límite de cantidad prefijado. Esta orden reemplaza los topes anteriores de pruebas y las dos lecturas diagnósticas pendientes de consentimiento, dentro de las cuotas disponibles. No autoriza gasto ilimitado, producción/deploy, transferencia de secretos, instalaciones ni terceros. Conservar el registro histórico; no confundir nueva autoridad con reset o replay de efectos consumidos.

Sucesora `01a13f7b-a156-7150-ba99-b4ff682163a1`: **ACK_OWNERSHIP_ACTIVE**; ejecutor exclusivo `/root/r4_recovery`, madre coordina/revisa. Propiedad reclamada en `COORDINATION_MANIFEST.md`. La madre anterior `01a13cc1-12e9-79a0-97e8-4899f05a5c95` solo preserva/releva; sesiones anteriores en pausa operativa, sin ejecución duplicada. La madre verificó el monitor antiguo PAUSED mediante herramienta y automation.toml; no heredarlo por clonación automática. Rutas CODE, DOCS congelada y cola única están en el manifest.

## Checkpoint recuperable

- R4 `f90f55bc-48d8-406f-a11e-05ddd2683014`; submit aceptado `task_e_6ad045ab00c08327bb4ea958581c5c82`; entorno `6abad782eba0819196ca234dc3abc327`, **ONIA Hermes — revisión y desarrollo**. Contadores históricos: 1 submit, 2 status, 1 collect. Status #2 CLI: `ERROR`/`no diff`, causa `UNKNOWN`. URL derivada en browser abrió solo composer; no cuatro JSON públicos, prueba browser Cloud ni PC-off. No atribuir causa a cuenta/workspace sin evidencia.
- Recibos externos: `E:/onia-wt/r4-final-checkpoint-20261015.json`, `E:/onia-wt/r4-status2-directed-capture-20261015.json`, `E:/onia-wt/r4-result-collection-20261015.json`. Mantener cola `unknown`/`needs_reconcile`, intent y efectos consumidos; no resetear. Guardar las nuevas operaciones separadas y auditadas.
- Caller/recuperación/entrega CODE publicados en rama; QA independiente final: 20 focal + 47 compatibilidad. Entrega local preparada, no enlazada ni probada viva. Preflight reportó gateway VPS activo y metadata PTB 22.8/HTTPX 0.28.1/HTTPcore 1.0.9; Codex ausente del PATH efectivo del gateway, `auth.json` del HOME predeterminado ausente y `CODEX_HOME` unset. No demuestra ausencia global ni estado actual permanente.
- Evidencia canónica: `hermes-content/docs/handoff/hermes-harness-20261012/evidence/native-host-source-20261014.md`. Probe externo: `E:/onia-wt/native-host-runtime-preflight-20261015`. El SDK probe accidental con `--help` ejecutó SSH antes de revisión: exit 2, causa desconocida, sin SDK PASS. Tres runners corregidos con main guard/argparse/dry-run/`--execute` y bloqueo ante recibo previo; 15 tests independientes con mocks, cero subprocess reales, recibo original intacto. No repetir probes gastados a ciegas; preparar prueba nueva explícita bajo la autoridad vigente.

## Fallos y aprendizaje que debe aplicar la sucesora

1. No preservar stderr/status #1 impidió diagnosticar. Capturar error sanitizado, fase, exit code y hashes; nunca secretos.
2. Alargar guards y pruebas locales dejó abierto el fallo Cloud real. Cada próximo paso debe cerrar una incertidumbre observada; no aparentar avance con tests repetidos.
3. Heartbeat cada 15 minutos consultó agentes terminados durante horas sin avance. Pausar el monitor anterior y coordinar por eventos/cambios útiles.
4. Cuota, tokens acumulados y caché no miden contexto activo: U/W = `UNKNOWN` sin evidencia directa. Relevo compacto, no transcripts completos.
5. `--help` tuvo efectos top-level: conservar la corrección y regresiones descritas; ayuda/import/dry-run nunca deben ejecutar efectos.
6. Errores iniciales Bot-only, índice de polling request y hash Unicode se corrigieron antes de publicar; conservar regresiones focales ya hechas. Ninguno acredita PASS vivo.

## Delta ejecutado por sucesora — 2026-10-15 12:32 UTC

R4 real recuperado en UI `/remote/task_e_6ad045ab00c08327bb4ea958581c5c82`: setup falló exit1 porque receta seleccionó cero fuentes binarias Ubuntu elegibles. No causa browser ni cuenta demostrada. Diagnóstico aparte `task_e_6ad0c5a6abec8327a067f26b0e8445f2` alcanzó agente (~8min), pero UI de éxito no expuso stdout setup; JSON no recuperado. Setup/mantenimiento originales restaurados y readback hashes exactos. Cola R4 sin cambios. Segundo diagnóstico `task_e_6ad0c8cad0808327a72fa0c2980d7f76` recuperó JSON+marcador42: cuatro entradas binarias Noble en archivo .list, todas excluidas por host/ruta de receta; host/ruta real ocultos, firma no verificada. Setup/mantenimiento restaurados exactos otra vez 12:45 UTC. Próximo probe suficiente de fuente/trust offline: ejecutor código `/root/apt_trust_code` Sol6.1 medium; `/root/r4_recovery` conserva browser exclusivo y solo docs mientras código/QA. Evidencia: `hermes-harness-20261012/evidence/r4-recovery-20261015/recovery.md`. Evitar lecturas amplias redundantes; Luna low mecánica, Sol6.1 medium código, Sol low QA, Astra causa ambigua material; un ejecutor+revisor.

## Próximo avance

El diagnóstico de setup ya cerró la causa observada: las cuatro fuentes Noble usan `snapshot.ubuntu.com/ubuntu/20260828T000000Z/`, excluida por el selector histórico archive/security y ruta `/ubuntu`. El próximo gate es aprobación humana de UNA prueba nueva setup-only con UUID `9fc238a7-aa41-433c-8681-a9bf6ec6a340`, no repetir R4. Revisar contrato/manifiesto en `hermes-harness-20261012/evidence/r4-recovery-20261015/snapshot-recipe-candidate/`. Manifiesto PENDING_APPROVAL/false, referencias null; QA independiente 13/13 más bash-n, payload embebido exacto. Ninguna instalación real de este candidato, cambio de consumer/autoridad/guard ni browser/E2E/PC-off está demostrado. Tras aprobación específica, ejecutar solo el contrato setup-only, recuperar recibo real completo y restaurar setup/mantenimiento por hash; después revisar integración/admisión y browser/E2E por separado. No crear otro orquestador ni resetear cola/lease/intent.

## Cierre recuperable del lote diagnóstico y paquete setup-only

- Diagnóstico 1: `task_e_6ad0c5a6abec8327a067f26b0e8445f2`, setup exitoso sin JSON recuperado de UI; configuración/mantenimiento restaurados según `diagnostic-config-restore.json`.
- Diagnóstico 2: `task_e_6ad0c8cad0808327a72fa0c2980d7f76`, JSON de clasificación y marcador42 recuperados; restauración documentada en `observable-config-restore.json`.
- Diagnóstico 3: `task_e_6ad0ceffce048327a2ac40888465fe00`, JSON de trust completo en `trust-result-full.json`: 11707 bytes raw, SHA256 `1be880a4428df75a2095349ad719800f03273245b3d8c6eab2f8ad34493139d7`; archivo con LF 11708 bytes. Incluye 4 fuentes, 6 InRelease y 33 paquetes. Cuatro firmas locales verificadas contra keyring Ubuntu existente; confianza global/frescura/vínculo source-index-payload UNKNOWN, candidatos 20 UNKNOWN/2 NONE/11 conocidos. `trust-result-full-receipt.json` confirma hash raw exacto del DOM y conserva el resumen previo insuficiente.
- `trust-config-restore.json` tenía un error de transcripción de Luna en setup_sha256 (sufijo de mantenimiento copiado); se conserva histórico. `trust-config-restore-reverified.json` corrige mediante lectura DOM actual tras reload 13:46 UTC y hashes locales de originales privados: setup14832B SHA57f1f52c4898c6aad6ba494d2e010e009959fd17296089fcf223b3f7a3817a62 y mantenimiento144B SHA6a3ea5b3f45cc9a6066d94824ccfedb8c301dd572f5a36ee3bac398d9ad2a726. Ambos coinciden exactamente; cache/política observados sin cambio. No hubo edición de settings. Antes de cualquier instalación futura volver a verificar baseline. Ningún script original privado, credencial, cookie o DB forma parte del lote.
- Receta candidata SHA256 `27609d8506e41dcdf4190a68991bbffcdf76499cf3aecd9a57e8c097431d4b15`; wrapper pendiente SHA256 `559c35713de54ec7f49b1a485dfb73c407a3017e3bb791c7e3c7aecff828b736`. Conserva 33 APT y cuatro versiones Python, Chromium156.0.8078.4/revisión1248. Activación futura solo cambia cuatro campos previstos del manifiesto y regenera wrapper; no receta. Marcador `ONIA_SETUP_TRIAL_COMPLETED`/exit42 solo después de recibo real root-owned coherente.
- Consumer histórico continúa pinneado y no acepta este digest nuevo ni la operación futura; arquitectura decidió setup-only primero. El plan posterior de autorización/admisión está documentado, NO implementado. Cola/DB/leases/intents/recibos anteriores intactos.
- Aprendizajes: recuperar JSON completo con hash desde DOM, no sustituir por resumen ni reconstruir espacios desde AX; set-e evita marcador de éxito tras fallo; ACK de cese antes de transferir escritor; Luna extracción incompleta escalada a Sol sin métricas de costo/tiempo. Nota pequeña autorizada fuera de Git: `C:/Users/PC/.codex/memories/extensions/ad_hoc/notes/20261015T134028Z-r4-snapshot-resultado-routing.md`. Estado detallado en `recovery.md`; no heredar aprobaciones históricas de instalación.

---

# Historial: relevo a Codex (5-oct-2026, ~22:00 UTC)

El bloque siguiente conserva la cola histórica de producto; no es el encargo operativo de esta sucesora Infra.

A Claude se le acaban los tokens. **Codex (OpenAI, en la PC Windows de Sergio Urcullo) sigue con la 1.0.** Cada tarea tiene un
prompt autocontenido en `hermes-content/docs/handoff/codex-tareas/<TAREA>.md`. Codex no ve los chats ni el `CLAUDE.md`, así que
todo lo que necesita está en su prompt.

- **Quién revisa:** la madre v2 (local, la que lanza Codex en la PC), la madre (local) o Plataforma (`session_01HhnFgkeF6nLGvjrfjt1o2C`).
  Si ninguna tiene tokens, Sergio Urcullo mergea solo lo que permite el §5.
- Plan de la 1.0: `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md` §1 (15 puntos: del 1 al 4 para el 16-oct, todos para el 30-oct).
- Se trabaja en ramas `codex/*` con PR. **Mergear a `master` de onia-platform es publicar**: el cron del VPS publica `master` cada
  3 h, en el minuto 50, y no revisa migraciones.

## 1. Estado al 5-oct, ~22:00 UTC
- **En producción** (release `97fe3061`): #108; #109 (punto 12, lo hizo Codex); #111 (punto 2).
- **Sin publicar, a cargo de Plataforma:**
  - #110, caja diaria (punto 8). La hizo Codex y pasó la revisión. Faltan las capturas, el OK de Sergio Urcullo y aplicar la
    migración `20261004190000` antes del swap.
  - P2, presupuesto por fases (punto 7). Es un parche en `docs/cola/capturas-presupuesto-fases/` y espera el OK.
  - SQL del B22 (punto 3). Espera el OK textual.
- **Ya están hechas y salen de la cola:**
  - T2, auditoría de cobro (PR #115).
  - T3, edición de los reels 1 y 2 (`daf57276`).
  - T4, voseo del bot (el grep da 0).
  - T5, competencia (mapa y 16 fichas, PR #121).
- **Los 5 competidores sin ficha (Huli, Reservo, Clinera, Calu, Fluker) no se hacen**: no mueven la etapa, que es conseguir
  clientes. No hace falta abrir sesiones de competencia.

## 2. Cola de Codex, en orden

| # | Tarea (`$tarea`) | Punto | Rama (`$rama`) | Migración | Quién mergea |
|---|---|---|---|---|---|
| 1 | `C15-factura-al-aprobar` | 15 | `codex/punto-15-factura-al-aprobar` | sí, `20261006100000` | Solo Plataforma, después de que Sergio Urcullo confirme que OniaAgency factura en el Portal Web del SIN |
| 2 | `C13-gracia-y-no-renovar` | 13 | `codex/punto-13-gracia-y-no-renovar` | no | Con revisión, porque toca el corte de la cuenta. Si no hay Claude en 48 h, Sergio Urcullo con el CI verde |
| 3 | `C14-terminos-con-version` | 14 | `codex/punto-14-terminos-con-version` | sí, `20261006110000` | Solo Plataforma, después del punto 1 y con el OK de Sergio Urcullo sobre la casilla de aceptación (es texto legal) |
| 4 | `C11a-reprogramar-y-reserva-avisa` | 11 | `codex/punto-11-reprogramar-y-reserva-avisa` | no | Sergio Urcullo, con el CI verde |
| 5 | `C11b-feriados` | 11 | `codex/punto-11-feriados` | no | Sergio Urcullo, con el CI verde. **Se clona RECIÉN cuando C11a está mergeado** |
| 6 | T1, edición de los brutos (§10) | — | — | — | Espera los videos |

- **Se corren de a dos en paralelo, cada una en su carpeta:** primero C15 y C13, después C14 y C11a. C11b va sola, al final,
  cuando C11a ya está en master.
- **Por qué este orden:**
  - El 15 y el 13 protegen el cobro: que cada pago salga facturado y que un pago atrasado no corte la clínica el mismo día.
  - El 14 toca el checkout, así que va después de la prueba de cobro (punto 1) para no moverlo mientras se prueba.
  - El 11 es la agenda del día a día.
- **El punto 11 quedó en 2 tareas** porque las dos tocan `app/api/booking/appointments/route.ts` y su `route.test.ts`. Por eso
  C11b no arranca hasta que C11a esté mergeado: si corren juntas, el test choca seguro.

## 3. Cómo se lanza (PowerShell, copiar y pegar)
Medido el 4-oct:
- El CLI 0.139 no corre `gpt-6-*`: se usa `-m gpt-5.5`.
- Con `git worktree`, Codex no puede commitear. Por eso se usa un **clon completo por tarea**.
- PowerShell no acepta `<`: el prompt se le pasa a Codex con un pipe.

```powershell
# A. Una vez por ventana (sin esto los acentos le llegan rotos a Codex)
$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false
git -C C:\dev\proyectos\onia-hermes fetch origin
Test-Path C:\dev\proyectos\onia-platform\node_modules     # tiene que decir True

# A2. Comprobar que los prompts ya están publicados (tiene que imprimir el título de C15)
git -C C:\dev\proyectos\onia-hermes show "origin/main:hermes-content/docs/handoff/codex-tareas/C15-factura-al-aprobar.md" | Select-Object -First 1

# B. Por tarea: cambiar SOLO esta línea (los valores están en la tabla del §2)
$tarea = "C15-factura-al-aprobar"; $rama = "codex/punto-15-factura-al-aprobar"

# C. Clon completo, rama y node_modules compartido por junction
#    (si la carpeta ya existe porque estás relanzando, saltá este paso y andá al D)
$d = "C:\dev\proyectos\onia-platform-codex-$tarea"
git clone https://github.com/oninteligenciaartificial/onia-platform $d
git -C $d switch -c $rama
cmd /c mklink /J "$d\node_modules" "C:\dev\proyectos\onia-platform\node_modules"

# D. Lanzar Codex. El prompt se lee de origin/main, así que tu copia de hermes no se toca
git -C C:\dev\proyectos\onia-hermes show "origin/main:hermes-content/docs/handoff/codex-tareas/$tarea.md" | codex exec -m gpt-5.5 --full-auto -C $d -
```
- **Si el paso A2 dice «does not exist»:** no se lanza nada. Los prompts todavía no están en `main`: se le avisa a la madre.
- **Si el `Test-Path` da False:** en vez del `mklink`, correr `Push-Location $d; npm ci; Pop-Location` (tarda unos minutos).
- **Para correr dos tareas a la vez:** dos ventanas de PowerShell, cada una con su paso A y su paso B.
- **Si Codex avisa que llegó al límite de la semana:** anotar la hora y relanzar el mismo paso D cuando vuelva. El prompt le dice
  que siga desde lo que ya está en el árbol.

## 4. Cuando Codex termina
```powershell
git -C $d log --oneline -2      # arriba tiene que estar el commit de Codex
git -C $d status --short        # vacío
git -C $d push -u origin $rama
```
Si en la carpeta quedó `CODEX_COMMIT.txt`, es porque el sandbox no lo dejó commitear. Antes del push:
```powershell
git -C $d add -A
git -C $d reset -q -- CODEX_COMMIT.txt
git -C $d commit -F "$d\CODEX_COMMIT.txt"
Remove-Item "$d\CODEX_COMMIT.txt"
```
Después del push, el paso siguiente depende de si hay Claude:
- **Hay Claude:** en la sesión de la madre se escribe «`<tarea>` pusheada». La madre abre el PR y lo revisa.
- **No hay Claude:** abrir el link que imprime el push («Create a pull request…») y apretar «Create pull request». Después se
  espera el CI verde y se mergea solo si el §5 lo permite.

**Arreglos de una revisión:**
1. Quien revisa deja `codex-tareas/<tarea>-arreglos.md` en `main`.
2. Sergio Urcullo corre, en la MISMA carpeta y sin clonar de nuevo:
   `git -C C:\dev\proyectos\onia-hermes fetch origin; git -C C:\dev\proyectos\onia-hermes show "origin/main:hermes-content/docs/handoff/codex-tareas/$tarea-arreglos.md" | codex exec -m gpt-5.5 --full-auto -C $d -`
3. Después, `git -C $d push`.

**Limpieza, cuando el PR quedó mergeado:**
```powershell
cmd /c rmdir "$d\node_modules"     # PRIMERO la junction: si no, se borra el node_modules compartido
Remove-Item -Recurse -Force $d
```

## 5. Reglas de merge (leer antes de apretar «Merge»)
- 🔴 **Un PR con migración (C15, C14 y también el #110) NUNCA lo mergea Sergio Urcullo solo.** El publicador del VPS publica
  `master` cada 3 h sin mirar migraciones. Si sale el código nuevo sin la columna creada, Prisma falla con P2022 en cada consulta
  de ese modelo. C14 toca `organizations`, así que **se caería todo el panel**. Lo mergea Plataforma después de aplicar la
  migración en `supabase-db`, con backup antes (skill `onia-db`).
- **Diseño nuevo o texto legal pasan por Sergio Urcullo**, que mira la pieza renderizada. En esta cola no hay pantallas nuevas:
  son botones y campos sobre pantallas que ya existen. Hay DOS textos legales:
  - el cambio de los Términos §3.4 (7 días de gracia). Codex no lo hace: deja el texto propuesto en el resumen de C13;
  - la casilla «Leí y acepto los Términos y condiciones (versión …)» de C14, en el checkout, el add-on y el modal de Mi plan.
    C14 no se mergea sin que Sergio Urcullo vea la captura.
- **El resto se mergea con el CI verde y la revisión.** Sin Claude, alcanza con el CI verde para C11a y C11b. C13 espera la
  revisión hasta 48 h.
- **Si GitHub muestra «conflicts», no se resuelve desde la web.** Lo resuelve Plataforma o la madre.
- **C15 se mergea solo después de que Sergio Urcullo confirme que OniaAgency emite facturas en el Portal Web del SIN.** Si no
  puede, ningún pago real se podría aprobar.
- **Publicado no es terminado: se MIRA en producción.** Después de cada merge publicado (máximo 3 h), Plataforma o la madre abre
  la pantalla renderizada y la mira:
  - C15 → `/admin/payments`;
  - C13 → Configuración › Mi plan, y la banda del panel con una cuenta vencida de QA;
  - C14 → `/checkout`, `/settings/addon-chatbot` y el modal de pago de Mi plan;
  - C11a → la agenda y `/book`;
  - C11b → Configuración › Horarios y `/book` en un día cerrado.

  Si no hay Claude, Sergio Urcullo abre esas pantallas y manda captura.

## 6. Revisión (la madre o Plataforma)
- **Revisión proporcional al riesgo:**
  - C15, C13 y C14 tocan plata: 2 lentes, y cada hallazgo HIGH se verifica en el código.
  - C11a y C11b: un revisor y una pasada.
- **Qué mirar sí o sí:**
  - C15: que INVOICED se resuelva antes de la guarda de PENDING sin aflojarla.
  - C13: que Mi plan no diga «solo lectura» durante la gracia paga.
  - C14: que `QRPaymentModal` también mande la casilla.
  - C11a: que NO limpie las marcas `*SentAt`, porque son el cupo mensual.
  - C11b: que use la ruta nueva `clinic-settings/feriados`, abierta a todos los rubros con agenda.
- **Los tests se corren en el checkout propio de la rama** (`npx vitest run <archivos del prompt>`); no alcanza con creerle a
  Codex. El commit de un arreglo lleva el gate en el mismo comando (`echo "$out" | grep -q failed && exit 1`).
- **El `tsc` local falla** porque el cliente de Prisma compartido no tiene las columnas nuevas. El gate de tipos es el CI del PR
  (lint, typecheck, toda la suite y build).

## 7. Lo que NO es de Codex (queda en Plataforma)
Punto 1 (cobro de punta a punta con +qapago, y mirar /checkout, /help y /patients/import, que cierra la parte visual de los
puntos 2 y 12) · arreglos de Meta (`lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts` utilityBob, la línea en
/precios) · capturas, OK y publicación de #110 · SQL del B22 (3) · respaldos en R2 (4, espera el token) · aplicar P2 (7, espera
el OK) · demo del recall (9) · WhatsApp en cada cita y la frase de coexistencia (10, toca `CanalWhatsappCard.tsx`, el mismo aviso
que los arreglos de Meta; es el PR #112) · agenda por profesional (5) y odontograma de 5 caras (6), que son diseño nuevo y el 6
choca con P2 en `FichaVista.tsx` · verificar en prod la parte (a) del 14 · aplicar las migraciones de C14 y C15 · pasar `/book`
entera a usted · **nuevo, sale de C11a:** volver a mandar el recordatorio de la hora nueva cuando el de la vieja ya salió. Necesita
un registro de consumo aparte, porque las marcas `*SentAt` son el contador del cupo mensual; lleva migración.

**Por qué no choca:**
- Ninguna tarea de Codex toca el código de esa cola. Los arreglos de Meta tocan `pricing.ts`, `meta-cobra-el-servicio.ts`,
  /precios y `CanalWhatsappCard`.
- El punto 1 se prueba en PRODUCCIÓN, sobre el código que ya está: C15 y C14 se mergean después.
- `lib/audit.ts` y `proxy.ts` quedan intactos, para que el parche P2 siga aplicando limpio y #110 (que también toca `audit.ts`)
  no choque.
- `api-route-registry.ts` lo tocan tres:
  - #110 inserta `"caja-diaria"` arriba de `"clinic-settings"`;
  - C11b agrega `"clinic-settings/feriados"` debajo de `"doctor-schedules/[id]"`;
  - C13 agrega `"organization/renovacion"` debajo de `"organization/qr-cobro"`, en otra lista.

  Son zonas separadas.
- C15 y C14 agregan campos a `SubscriptionPayment` en lugares separados del schema: después de `reviewedBy` y después de
  `receiptPath`. #110 toca `Organization` (relaciones, ~:70) y C14 agrega `termsVersion` en ~:30.
- `SettingsClient.tsx`: C13 agrega una prop al final de `Props`; C11b, un campo al tipo de `clinicSettings` (~:64) y un bloque
  en la sección «Horario de atención». `settings/page.tsx` y `PlanClient.tsx` los toca SOLO C13. `QRPaymentModal.tsx` lo toca SOLO
  C14.

## 8. Trampas ya pagadas
- `gpt-6-*` falla con el CLI 0.139: se usa `-m gpt-5.5`.
- Con `git worktree`, el `.git` queda fuera del sandbox y Codex no commitea: se usa un clon completo.
- `node_modules` es un junction compartido. En el clon no se corre `npm install`, `npm ci` ni `prisma generate`. Antes de borrar
  la carpeta se hace `cmd /c rmdir` de la junction (el 29-sep se borró a medias el compartido).
- El caché de vitest vive en el `node_modules` compartido. Si con dos ventanas corriendo un test falla raro, se relanza esa
  tarea sola.
- Vitest en Windows reescribe algunos `.snap` a LF: `git checkout -- <snap>`. Fallan solo en Windows y no son de la tarea:
  `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).
- `next dev` con node_modules por junction necesita `--webpack`. No hace falta para estas tareas.
- **Empujar una rama `claude/*` la publica sola.** Codex usa `codex/*`.
- El `main` local de la PC puede tener commits sin publicar: por eso el prompt se lee de `origin/main`, no del disco.

## 9. Lo que depende de Sergio Urcullo (solo lo que toca a Codex)
1. Lanzar las tareas (§3) y pushear al terminar (§4).
2. Confirmar que OniaAgency emite facturas en el Portal Web del SIN. Sin eso, C15 no se mergea.
3. Aprobar el texto nuevo de los Términos §3.4 (7 días de gracia) que propone C13.
4. Mirar la captura de la casilla de aceptación de C14 y dar el OK.
5. Decidir si en el plan SEMANAL la gracia también es de 7 días (equivale a un ciclo). Mientras tanto queda en 7.
6. Decidir si los dueños pasan a «usted». Mientras tanto, Codex escribe el panel en el registro del archivo (hoy, vos) y lista
   los textos nuevos para cambiarlos de una vez.
7. Punto 1: confirmar el correo de +qapago y aprobar el pago de PRUEBA. Va antes de mergear C14 y C15.
8. Mandar los brutos para T1.

El resto de los pendientes de Sergio Urcullo está en `handoff/madre-local.md` y en `handoff/onia-1.0-nube.md` §6.

## 10. T1: edición de lo que grabó Sergio Urcullo (espera los brutos)
- **Fuentes:**
  - los bloques 1 a 5 de `hermes-content/docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`;
  - las fichas de `KIT-GRABACION.md`;
  - las skills `edicion-referentes` (elegir el molde ANTES de editar), `editor-videos` y `ver-videos`.
- **META:** por cada pieza, transcripción, **tabla de cortes y preview 360p**, para que Sergio Urcullo los vea ANTES de cortar
  (regla de oro).
- **PRUEBA:** una carpeta por pieza con la tabla y el preview, y la lista en el resumen.
- **PARADA:**
  - No se renderiza el final sin su OK.
  - Si falta el recorte del fondo verde, se arma pantalla partida con la receta de Santiago.
  - Sale una versión por pieza, no tres.
- **Cómo se lanza:** cuando lleguen los brutos, la madre (o la sesión de Marca personal) escribe `codex-tareas/T1-<fecha>.md`
  con la carpeta de los brutos. Se corre en una carpeta propia, no en el checkout principal de hermes.

## 11. Si algo se corta a mitad
- **Si Codex se corta:** el clon conserva los cambios (`git -C $d status`). Se relanza el mismo paso D, sin el C: el prompt le
  dice que siga desde lo que ya está.
- **Si se corta la madre:** este archivo y la tabla del §2 alcanzan para seguir. Los PRs abiertos se ven en GitHub con el
  filtro `head:codex/`.
