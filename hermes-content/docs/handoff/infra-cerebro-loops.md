# Handoff — carril `infra-cerebro-loops`

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

```bash
# comprobar desde el VPS
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 'ss -tln | grep 2222 || echo CAIDO'
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 '/root/bin/casa.sh "uptime"'
```
Reparar exige a Sergio Urcullo encender WSL en esa PC (no hay sudo remoto).

### ⚠️ Dos jobs de Hermes fallando hoy
- `onia-ordenador-tablero`: `RateLimitError ... TPM Limit 200000, Used 56050, Requested
  144473` — **3 fallos seguidos**. El prompt manda demasiado contexto de una; el techo ya
  no es el saldo, es tokens-por-minuto del tier.
- `hermes-daily-content-video-plan`: `Interrupted by shutdown before terminal completion`
  (hoy 08:12). Una sola vez, no es patrón todavía.

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
  frena la mitad de la homologación) · `t_040684cb` (mirar si el correo de confirmación cae
  en Spam).
- Decidir si los **12 jobs `hermes-*` pausados** (kickoff de lunes, finanzas del viernes,
  cierre del domingo) se reviven o se borran.

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
