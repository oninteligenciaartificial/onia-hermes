# Hermes: QA de Onia y ventanilla del turno de noche

> **Fuente de verdad del rol de Hermes.** Doc vivo, sin fecha en el nombre: se EDITA.
> Pedido de Sergio Urcullo, 10-oct: *«pasalo a QA pero dale un uso, es un agente, se supone que tiene que
> orquestar las cosas o para qué sirve Hermes, dale un buen uso e investigá»*.
> Sale de: handoff `handoff/hermes-jarvis.md` (ESTADO 9-oct), skill `onia-hermes-jarvis`, `ONIA_HARNESS.md`
> §3-§5, `cola/loop/madre.md` §G-H, `ONIA_CEREBRO.md` §«La regla de entrega» y los scripts nombrados abajo.
> Estado del carril: el handoff. Método: la skill. Esto: qué hace Hermes, cada cuánto y qué no hace.

## Veredicto

- **Hoy Hermes no orquesta: es una ventanilla de Telegram.** Todo lo que lo haría útil está construido, probado
  en un VPS simulado y apagado detrás de `aplicar`, que nunca corrió.
- **Su uso: ser lo único que trabaja y le habla a Sergio Urcullo con la PC apagada.** Le toca hacer QA con los
  vigías que ya existen, pasar todos los avisos por la aduana y ordenar el turno de noche (relojes, colas
  paradas, aprobaciones `ok`/`block`). No suma monitores: hace que los que ya existen se vean vivos.
- **No orquesta a las sesiones ni al código.** Las sesiones de la nube las reparte la jefa (`AGENTS.md` §1; la nube no puede
  mandar mensajes), y Hermes no programa: un modelo barato ya inventó una agenda entera.

## 1. QA: qué mira, cada cuánto, con qué y a quién avisa

Todo lo de esta tabla ya existe en el VPS y corre sin LLM. Se puede probar y no gasta cuota. Lo que falta es
saber si cada vigía está vivo (tarea Q2) y que avise por la aduana (Q3).

| Qué mira | Cada cuánto | Con qué (ya existe) | Estado hoy | Si falla, a quién |
|---|---|---|---|---|
| Web, /login, /register: glifos, texto ancla, peso y tiempo | 15 min | `onia-mirar-cliente.mjs` | existe; sin medir si vive | caída >30 min sin arreglo: **Sergio Urcullo**, interrupción 4. Si se arregla sola: línea de salud |
| Camino de alta y login (Kong → auth, /login 200) | 5 min | `auth-canary.sh`, `claude-guardia-canario.sh` | existen; sin medir si viven | igual |
| Pantallas con sesión (/dashboard, /checkout) | después de cada publicación que cambió el release | `onia-mirar.js` (magic link) con la cuenta de prueba de QA | no corre solo: la madre lo hizo a mano (A3) | Q5 |
| Publicación de onia-platform | 8 ventanas por día, a las :50 de 00, 03… 21 UTC (3 caen de noche en La Paz) | log del publicador (la ruta se mide en Q2) | falló dos días seguidos a las 15:50 UTC y nadie avisó (A3b) | 2 ventanas seguidas sin publicar: tarea para Plataforma + resumen. Nunca interrupción: prod sigue con el release anterior |
| Bot: conversaciones sin respuesta | 2 h | `onia-vigia-sin-respuesta.sh` | vivo: a las 16:39 UTC marcó 8 colgadas y 5 sin respuesta | nueva: interrupción 1. Las viejas siguen en NECESITO cada mañana hasta que alguien conteste |
| Comprobantes de pago PENDING | su cron | `vigia-comprobantes.sh` | log vacío: mudo o sano, no se sabe | interrupción 3 (plata que espera su OK) |
| Respaldos | diario | JSON de `backup-onia-postgres` | `restoreVerified:false` por diseño: nunca se restauró | falta el de hoy o pesa 20 % menos que el anterior: tarea para Plataforma + salud. La restauración probada es el punto 4 de Plataforma; Hermes la nombra los miércoles hasta que exista |
| CI de master, disco, crédito de IA | su cron | `vigia-ci.sh`, `vigia-disco.sh`, `vigia-credito-ia.sh` | logs vacíos | tablero (Plataforma o madre) + línea de salud |
| Los vigías mismos | diario | latido (Q4) + diagnóstico programado (Q2) | no existe: hoy mudo y sano se ven igual | resumen: «N vigías mudos: …» |
| Revisión semanal | miércoles, latido de las 10:57 | la sesión de la nube lee el diagnóstico de la semana | no existe | 3 bloques en su cola, sección «Hallazgos para otros»; la jefa los reparte |

**Embudo.** Ya se cubren las conversaciones (sin respuesta) y los pagos (comprobantes). Las **altas nuevas**
quedan afuera: avisarlas exige leer `organizations` de producción y eso espera el OK de Sergio Urcullo (§6).

**Reglas de aviso (la regla de entrega, sin cambios):**
- A Sergio Urcullo solo le llega el resumen de las 06:30, el cierre de las 21:30 y las cuatro interrupciones.
- Lo que el sistema puede arreglar solo va al tablero y sale como UNA línea en el resumen.
- Lo que encuentra la sesión de la nube para otro dueño va a «Hallazgos para otros» en su cola. La madre lo
  manda con `SendMessage` en la ronda; con la PC apagada espera, salvo que sea una caída, que ya le llegó a él.
- **Capturas a 390 y 1440 px** (harness §6): las sigue mirando la madre con Chrome. Pasan a Hermes recién cuando
  una prueba muestre que la nube puede bajar un artifact de Actions. Hasta entonces, el QA semanal usa los
  números deterministas de `onia-mirar-cliente` (peso, ms, ancho de glifo, texto ancla).

## 2. Orquestación con la PC apagada

Cuando la PC de Sergio Urcullo está apagada, Hermes hace cuatro cosas:
- dirige unos 20 vigías a la aduana, que decide qué le llega a él, qué va al tablero y qué espera;
- lleva el circuito `ok`/`block` (solo dispara scripts del VPS sin LLM);
- a las 06:30 dice qué vence y qué cola se paró, para que la madre redespache a las 07:53;
- más adelante, si Sergio Urcullo lo decide, toma pedidos suyos para Claude desde Telegram.

| Capacidad | Estado | Pieza | ¿Construir de más para la etapa 1? |
|---|---|---|---|
| Circuito `ok <id>` / `block <id>` | **existe y funciona**, con ruido | `vigia-aprobaciones.sh` + gateway | no se construye nada: `aplicar` hace que pregunte a la aduana antes de mandar |
| Avisos de caída (guardián, canarios, mirar-cliente) | **existen**; `madre.md` A8 da vivo al guardián (10-oct), pero nadie midió si avisa, y su credencial tiene 36 días | `claude-guardia*.sh`, `auth-canary.sh` | no: medir (Q2) y pasarlos por la aduana (Q3) |
| Resumen 06:30 y cierre 21:30 en Pasó · Necesito · Sigue | **existe apagado** | `jarvis-resumen.sh` | no: lo enciende `aplicar` (Q1) |
| Aduana: 4 interrupciones, silencio de 22:00 a 06:30, bloques | **existe apagado** | `onia-tg.sh` | no: `aplicar` (Q1) |
| Calendario por chat (crear, mover, cancelar con su sí) | **existe apagado** | `agenda.sh` | no: `aplicar` (Q1) |
| Parte diario viejo | **muerto** desde el 09-09 | `parte-diario.sh` | no: el resumen lo reemplaza y `aplicar` apaga su cron |
| Avisos que hoy pasan por fuera de la aduana (n8n lead sin respuesta, chatbot seguimiento, backup, monitor n8n) | **existen**, sin silencio ni bloques | n8n + canarios | **no es de más**: sin esto no se cumple el hecho «24 h sin nada fuera de la regla» (Q3) |
| Relojes que vencen en 72 h o menos, en el resumen | **no existe** | `jarvis-resumen.sh` lee §G de `madre.md` en el clon del VPS | **no es de más**: hay 5 fechas en 25 días (13, 13-18, 16 y 30-oct, 4-nov) y ninguna alarma salta. Reemplaza el vigía nuevo del cambio 8 del harness, sin mensajes nuevos (Q4) |
| Colas sin movimiento >24 h, en el resumen | **no existe** | `git log` de `cola/loop/*.md` en el clon | no: unas 10 líneas; le dice a la madre de las 07:53 qué redespachar (Q4) |
| Latido por vigía | **no existe** | envoltorio en el crontab + línea de salud | no: hoy 5 o más vigías no se distinguen entre mudo y sano (Q4) |
| VPS visible desde GitHub cada día | **existe solo manual** | workflow nuevo que corre únicamente `diagnostico` | no: es lo que deja a la nube hacer QA con la PC apagada **sin darle SSH ni pedir un sí** (Q2) |
| QA con sesión después de cada publicación | **no existe** (la madre lo hizo a mano) | `onia-mirar.js` + cuenta de prueba | **en el borde, vale**: entran 10 PRs con migraciones (B1-B10, B1 «o prod cae») y 3 de las 8 ventanas son de noche (Q5) |
| Pedidos de Sergio Urcullo a Claude desde Telegram | **existe apagado**: falta la rutina y la llave | `pedido-claude.sh` + `respuestas-pedidos.sh` | decisión de Sergio Urcullo (§6) |
| Despertar sesiones de la nube desde el VPS | **no existe**; el VPS no tiene credencial de RemoteTrigger | ninguna | **de más**: los latidos ya corren solos con la PC apagada. Lo que falta es quién les cargue trabajo, y eso es la madre |
| Que Hermes reordene sesiones o mergee | no | ninguna | **de más y prohibido**: dos orquestadores se pisan |

## 3. Qué NO hace

- **No publica**: ni contenido, ni deploys, ni dispara `publicar.sh`.
- **No gasta**: ni Higgsfield, ni ElevenLabs (la voz de Jarvis queda caída sin cuota y no se recarga), ni Meta
  Ads, ni planes.
- **No contacta terceros**: no contesta las conversaciones colgadas del bot; se las nombra a Sergio Urcullo y a
  Plataforma.
- **No toca la base de producción**: ni escribe ni corre SQL suelto, y lee solo por los vigías que ya existen.
  La excepción es Q5: el magic link de la cuenta de prueba de QA deja un token de un solo uso en `auth`. Nunca
  se usa con superadmin ni con una cuenta real.
- **No cambia el VPS por su cuenta.** Crontab, n8n, SOUL y `/root/.hermes` cambian por PR revisado y los aplica
  la madre, que es la única dueña de la infra. La sesión de la nube lee el VPS por los logs de Actions, no por SSH.
- **No aprueba por Sergio Urcullo.** El `ok <id>` de Telegram solo dispara scripts del VPS sin LLM.
- No abre el portal del SIAT, no toca Lucía ni Meta, no edita las colas de otras sesiones y no mergea PRs de
  otros carriles.

## 4. Modelo y latido

| Pieza | Hoy | Propuesta |
|---|---|---|
| Vigías, aduana, latidos, chequeos de Q5 | sin LLM | sin LLM: deterministas y con prueba |
| Chat del gateway | `gpt-5-mini` | igual |
| Resumen y cierre | `gpt-5-mini` (`ONIA_JARVIS_MODELO`) | igual |
| Ordenador del tablero de las 13:00 | `gpt-5-nano` | igual |
| Sesión de la nube Hermes-Jarvis | **Opus, latido cada hora (:57), cola vacía**: 24 turnos por día que terminan en «nada desbloqueado» | **Sonnet**, 07:57, 10:57, 13:57, 16:57 y 19:57 La Paz (`57 11,14,17,20,23 * * *` UTC; respeta el mínimo de 1 h de las rutinas). Con la cola vacía contesta en una línea y termina. El del miércoles 10:57 hace el QA semanal |
| Revisión de cambios a `aplicar.sh`, la aduana o los pedidos | Opus de la madre | Codex `revisar` (otra familia de modelos), y un subagente Opus solo si toca `aplicar.sh` o la firma |
| Leer logs y armar tablas | (no hay) | subagente Haiku |

Pasa de 24 turnos de Opus por día a 5 de Sonnet. La primera semana se mide en la
billetera (E1 de `madre.md`). No está medido si la madre puede cambiarle el modelo a una sesión de la nube. Si
no puede, igual queda el ahorro grande, que viene de la cadencia.

## 5. Cola inicial

Para pegar en `cola/loop/hermes-jarvis.md`, junto con una sección nueva «Hallazgos para otros». Van en orden:
un PR por tarea, CI verde y revisión antes de mergear.

- [ ] **Q1 Verificar el encendido.** La madre corre `diagnostico` y después `aplicar` desde la PC, entre las 06:30
  y las 22:00 de La Paz (runbook `TELEGRAM_COMMAND_CENTER.md` §8). Hermes lee los dos logs de Actions con el MCP
  de GitHub y verifica sección por sección. Las pruebas P2-P5 las escribe Sergio Urcullo en su Telegram cuando
  la madre se lo pida. **Hecho:** el log de `aplicar` sin ❌, P2-P5 en verde, el resumen de las 06:30 y el cierre
  de las 21:30 llegaron. **Sí de Sergio Urcullo: no se vuelve a pedir.** Lo cubre «todo lo que esté revisado
  está aprobado» (10-oct, sesión madre), y lo corre la madre.
- [ ] **Q2 VPS visible cada día sin la PC.**
  - Un workflow nuevo, `hermes-qa-diario.yml`, con `schedule` a las 10:00 UTC y el mismo `concurrency:
    hermes-jarvis` y el mismo runner propio del VPS (no gasta minutos de Actions). Corre SOLO
    `diagnostico.sh`, sin input. `aplicar` y `revertir` siguen solo manuales.
  - Una sección «latidos» en `diagnostico.sh`: cada línea del crontab con su log y su última escritura. Marca
    MUDO lo que pasó más de dos veces su cadencia.
  - Con el dato, contesta cuatro preguntas:
    1. si `claude-guardia` avisa de verdad (A8 de `madre.md` lo da vivo; hipótesis a medir: credencial de
       36 días vencida);
    2. si `vps-backup.sh` sigue en el cron respaldando `dentalgest-staging-supabase-db` en vez de `supabase-db`;
    3. dónde escribe el publicador de las :50;
    4. la cadencia real de `vigia-aprobaciones` (2 min según el harness, 30 min según lo medido hoy).

  **Hecho:** la primera corrida programada en verde con la tabla, y las cuatro respuestas en «Hallazgos para
  otros» con su dueño. **Sí: no** (solo lectura); lo une la jefa o QA por PR (`AGENTS.md` §4).
- [ ] **Q3 Fase 2 de la aduana: nada le grita por fuera.**
  - Pasan por `onia-tg.sh`: «Vigia lead sin respuesta» de n8n (`*/30`), «Chatbot: seguimiento», el aviso de
    «Backup diario» (el respaldo sigue; se saca solo el aviso) y «Monitor de Salud n8n».
  - Los canarios de caída esperan los 30 min de la interrupción 4. La caída es lo único que pasa de noche.

  **Hecho:** 24 h medidas en su Telegram con solo el resumen, el cierre y las cuatro interrupciones (hecho (1)
  del carril), contadas por el diagnóstico programado. **Sí: no.** Los flujos de n8n los cambia la madre, con
  respaldo.
- [ ] **Q4 El resumen de las 06:30 dice lo que nadie empuja.**
  - (a) Los relojes que vencen en 72 h o menos, de la tabla §G de `cola/loop/madre.md` en el clon del VPS: un
    rango «13 al 18-oct» cuenta desde el 13, «sin fecha» no sale y uno vencido sale en 🔴.
  - (b) Las colas de `cola/loop/*.md` sin commit hace más de 24 h.
  - (c) Los vigías mudos. Cada línea del crontab que pone `aplicar` lleva un envoltorio que escribe la fecha y
    el código de salida en `/var/lib/onia-latido/<nombre>`.
  - Los relojes de Sergio Urcullo van en NECESITO; lo demás, en la línea de salud.

  **Hecho:** una prueba con un `madre.md` de ejemplo (el reloj de mañana aparece, uno a 10 días no, uno vencido
  sale en rojo), una prueba con un latido viejo que sale como mudo, y un resumen real con la sección.
  **Sí: no.** Reemplaza el vigía de relojes del cambio 8 del harness, sin mensajes nuevos.
- [ ] **Q5 QA después de cada publicación.**
  - Cada 15 min, un script del VPS compara el release que corre `onia-platform` (`release-<sha>`) con el último
    que vio.
  - Si cambió, abre /dashboard y /checkout con `onia-mirar.js` y la cuenta de prueba de QA. Chequea sin LLM la
    respuesta, que no haya texto de error y el tiempo.
  - El correo de la cuenta de prueba va **fijo en el script**, nunca por argumento: `onia-mirar.js` usa la clave
    service role y abre sesión con cualquier correo que reciba, superadmin o cliente real incluidos.
  - Si una ventana de las :50 pasa sin release nuevo, lo anota. Dos seguidas: tarea para Plataforma y línea en
    el resumen.
  - Si lo roto no se arregló en 30 min: interrupción 4 por la aduana.

  **Hecho:** en el VPS simulado, un release roto da un aviso y una ventana fallida da una línea; en vivo, la
  próxima publicación deja su renglón en el log. **Sí: no.** La cuenta es de prueba y la clave service role no
  sale del VPS.

## 6. Lo único que decide Sergio Urcullo

La madre se lo pide UNA vez, todo junto. Nada de esto frena Q1-Q5.
1. **Pedidos a Claude desde Telegram**, lo que hace de Hermes un orquestador de verdad con la PC apagada. Él crea
   la rutina, el entorno «Pedidos de Hermes» sin variables y la llave, nunca por chat. Choca con el harness §6,
   que no usa sesiones abiertas por una rutina ni Telegram como aprobación para un LLM. Recomendación:
   después de 7 días con Q1-Q3 estables.
2. **Aviso de cada alta nueva**: lectura de `organizations` de producción, solo lectura. Sirve para la pauta del
   16-oct, y lee la base de producción.
3. **«Hoy salió» con lo que él sube a mano**: leer los medios del día de Instagram con el token de publicar, una
   credencial fuera de su tarea original.
4. Si Q2 confirma que el guardián no avisa por la credencial: renovarla es un login suyo en el VPS.

## 7. Mensaje de arranque (madre → Hermes-Jarvis)

```
Hermes-Jarvis: desde hoy sos el QA de Onia y la ventanilla del turno de noche (Sergio Urcullo, 10-oct: «pasalo a QA pero dale un uso»). Tu rol está en hermes-content/docs/HERMES_ROL_QA.md: leelo antes que nada, junto con la skill onia-hermes-jarvis.
Tu cola (cola/loop/hermes-jarvis.md) tiene Q1-Q5: van en ese orden, un PR por tarea, CI verde y revisión antes de mergear.
Q1: `aplicar` lo corro yo hoy desde la PC; vos leés el log del run en Actions y verificás sección por sección. No le vuelvas a pedir el sí a Sergio Urcullo: el 10-oct dijo «todo lo que esté revisado está aprobado».
En el VPS sos de solo lectura: lo que cambie el crontab, n8n, el SOUL o /root/.hermes va por PR y lo aplico yo. No publicás, no gastás, no le escribís a terceros y no tocás la base de producción.
A Sergio Urcullo solo le llegan el resumen de las 06:30, el cierre de las 21:30 y las cuatro interrupciones. Lo demás va al tablero o a «Hallazgos para otros» en tu cola, con dueño, y la jefa lo reparte.
Tu latido pasa a 07:57, 10:57, 13:57, 16:57 y 19:57 La Paz, en Sonnet; con la cola vacía contestás en una línea y terminás. El de los miércoles a las 10:57 es el QA semanal.
Hecho del rol: 24 h medidas en su Telegram sin nada fuera de la regla de entrega, y un resumen que nombra cada vigía mudo y cada reloj a 72 h o menos.
```

## 8. Lo que este doc cambia en otros (lo edita la madre)

- `ONIA_HARNESS.md` §4 fila 17 y §6 «Frenos»: **Lucía no se pausa** (Sergio Urcullo, 10-oct: es aprendizaje de
  Higgsfield y una cuenta para facturar después). El freno pasa a ser: primero Review/QA a un latido por día y
  después menos agentes.
- `ONIA_HARNESS.md` §7 cambio 8 (vigía de relojes nuevo): lo reemplaza Q4. §4 fila 18 y §6 «Hermes pasa a ser
  Review/QA»: apuntan a este doc.
- `madre.md` C3 (sí o no a `aplicar`): cerrado por el 10-oct. H7: resuelto por este doc.
- Cabecera de `hermes-jarvis.yml` («nunca por horario»): sigue valiendo para `aplicar` y `revertir`. El
  diagnóstico programado va en otro workflow (Q2).

## No verificado (10-oct)

- Si viven los crons de `onia-mirar-cliente`, `auth-canary` y los vigías de CI, crédito, comprobantes y disco.
  Lo mide Q2.
- Qué cuenta de prueba usa Q5 y su correo («ZZ QA Pago» existe como org de prueba). /admin/payments queda afuera:
  pide superadmin.
- Si la madre puede cambiarle el modelo a una sesión de la nube, y si la nube puede bajar un artifact de Actions.
- Si después de `aplicar` sigue algún aviso de n8n fuera de la aduana. Lo cuenta el diagnóstico de Q3.
- Si la sesión de la nube puede pushear ramas nuevas a onia-hermes (Plataforma no puede a onia-platform, F5). Si
  no puede, cada PR de Q2-Q5 sale como bundle en `cola/ramas-locales/` y lo pushea la madre.
