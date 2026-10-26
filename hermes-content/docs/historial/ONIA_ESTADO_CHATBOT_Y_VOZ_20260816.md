# Onia — Estado del carril chatbot + voz (2026-08-16)

Estado verificado contra producción el 2026-08-16, no contra la memoria ni contra
lo que dicen los docs. Cada afirmación de acá abajo tiene la prueba al lado.

**Reemplaza como lectura de estado de ESTE carril** a `ONIA_TABLERO_20260709.md` y
`ONIA_ESTADO_Y_RUMBO_20260726.md` (los dos son de julio y ninguno cubre el bot).
Para el diseño del bot siguen valiendo, sin cambios: `ONIA_BOT_MANUAL_OPERACION_20260807.md`
(operación), `ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md` (los hechos editables),
`ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` (N clientes) y
`ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (voz).

---

## 1. Lo que cambió hoy — y cómo se verificó

| Qué | Prueba |
|---|---|
| **La rama LLM quedó encendida** | Turno real fuera de guion: *"mmm no se, capaz despues vemos eso tranquilo nomas"* → el bot reformuló la pregunta pendiente. `off_guion:1 · llm_ok · replySource:llm · guardrail:ok` |
| **Los 4 barridos entraron en cron** | `followup` :17 · `reminder` :32 · `postdemo` :47 · `usage` 12:00 UTC. Los cuatro corridos en seco ANTES de programarlos: 0 candidatos |
| **`postdemo-run.sh` corría siempre en seco** | No leía `webhook.env`, caía al `:-true`. Arreglado y desplegado. Commit `f3d1a540` |
| **El lead del CRM no se creaba NUNCA** | `leads.business_type` es NOT NULL sin default; el bot mandaba `null` → `23502` y el insert entero moría. Verificado después: `comercio` / `Santa Cruz` / `data_complete=true`. Commit `bb100379` |

**Modelo elegido: `gpt-4.1-mini`**, con llave propia (`onia-bot-chatwoot`, alias en
LiteLLM, tope USD 10/30 días, solo ese modelo). No se eligió por precio — la
diferencia con `gpt-4o-mini` son USD 0,14 al mes a 1.000 mensajes. Se eligió por
obediencia: toda la seguridad de esa rama depende de que respete el "PROHIBIDO dar
precios", y cada desobediencia se convierte en un texto de respaldo que el
prospecto lee como evasiva.

### Lo que sigue apagado o vacío

- **`knowledge.json` tiene UN solo hecho** (la FAQ del SIAT) + el horario. Cero
  rubros, cero disparadores extra. No es un problema de código: es contenido.
- **El seguimiento no tiene hora de silencio.** Dispara a las 20 h del último
  mensaje del prospecto, así que puede salir a las 6 de la mañana. El recordatorio
  de demo sí tiene el freno (`quietBeforeHour: 8`); el seguimiento no. Ponerle el
  freno achica la ventana de Meta de 4 h a menos y a veces se perdería el
  seguimiento. **Decisión de Sergio, no se toca sin eso.**
- **Cero prospectos reales.** Las 9 conversaciones de la base son pruebas nuestras.

---

## 2. Auditoría de credibilidad de los docs

Se probó cada afirmación verificable de los docs del carril contra producción.

| Afirmación | Doc | Realidad hoy | Veredicto |
|---|---|---|---|
| La marca blanca de Chatwoot NO es viable: un cron diario restaura el branding | multicliente 2-ago §2 | `INSTALLATION_NAME=Chatwoot`, `BRAND_NAME=Chatwoot`, `LOGO=/brand-assets/logo.svg` | ✅ **el doc tenía razón** |
| Seguimiento y recordatorio no tienen quién los llame | manual 7-ago §6 | Era cierto hasta hoy | ⚠️ **cerrado hoy** — con cron, no con n8n |
| `onia.com.bo` no tiene DMARC | manual 7-ago §6 | `v=DMARC1; p=none; rua=mailto:business@onia.com.bo` | ❌ **vencido** |
| Falta método de pago en Meta | manual 7-ago §6 | Cargado; el 131042 se resolvió | ❌ **vencido** |
| Bolivia no está excluida de la Calling API | voz 2-ago + research 15-ago | Confirmado en fuente primaria | ✅ |

**Los docs son creíbles.** Los tres que importan (multicliente, voz, capa de
conocimiento) describen decisiones tomadas con evidencia y hoy siguen siendo
correctos. Lo que envejeció son las *listas de pendientes*, que es lo esperable —
un pendiente se cierra y nadie vuelve a tacharlo.

### Dos fallas mías que esta auditoría dejó a la vista

**1. Rebrandeé Chatwoot a Onia el 15-ago y lo reporté como hecho. Ya volvió a
decir "Chatwoot".** El doc del 2-ago decía exactamente que iba a pasar y por qué
(`ReconcilePlanConfigService`, encadenado al cron de las 00:00). No lo leí antes de
hacerlo. Trabajo perdido, y peor: reportado como terminado.

**2. Respondí "cómo construiría el agente de llamadas" desde cero, con un doc de
1.058 líneas ya escrito sobre eso.** Mi respuesta se saltó la fase F1 —
**separar las llamadas de los mensajes antes de encender nada**. Si se habilita
`calls` en la misma app, los webhooks de llamada caen en Chatwoot, que responde 200
y los descarta: el que llama escucha silencio y el diagnóstico equivocado ("no
funciona la API") cuesta días. Eso no estaba en lo que respondí.

**La regla que sale de acá:** antes de responder o construir algo de un carril,
buscar el doc del carril. `hermes-content/docs/` tiene 200 archivos y `research/`
otros 37 — la probabilidad de que el tema ya esté escrito es alta.

---

## 3. Lo que me toca a mí, según la documentación

| Ítem | Fuente | Estado |
|---|---|---|
| Minimización de datos en el chatbot | `PROMPTS_POR_SESION.md` §`chatbot` | ✅ verificado: el cuerpo entrante se guarda como `(entrante — texto no persistido)` |
| D1 — "el bot no guarda" | `PROMPTS_POR_SESION.md` línea 901 | ✅ no estaba roto: 3 filas en 24 h; el "0 de hoy" era el corte UTC |
| Encender la rama LLM | este doc §1 | ✅ hoy |
| Barridos del embudo en cron | manual 7-ago §6 | ✅ hoy |
| Cargar `knowledge.json` con hechos por rubro | capa de conocimiento 6-ago | ⬜ **lo próximo** |
| Atribución de anuncios click-to-WhatsApp | — | ⬜ Chatwoot descarta el `referral`; un lead de pauta entra sin origen |
| Voz F0 (medir latencia en número de prueba) | voz 2-ago §6 | ⬜ bloqueado por nada — se puede hacer ya |
| Voz F1 (separar llamadas de mensajes) | voz 2-ago §2 y §6 | ⬜ ANTES de F2, no después |

## 4. Lo que depende de Sergio

| Ítem | Por qué bloquea |
|---|---|
| **Business Verification de Meta** | Es el portero de la Calling API (tier 2.000). App enviada a revisión hoy |
| **S2 — NIT para SIAT** | Sin eso no hay emisión real y el producto la promete. Vence el 30-sep |
| **Entel VOZip** — credenciales SIP registrables desde un servidor | Decide si existe el camino B de voz |
| **Hora de silencio del seguimiento** | §1: WhatsApp a las 6 AM castiga el quality rating; ponerle freno pierde seguimientos |
| **Los hechos por rubro** | Yo los redacto, vos los aprobás. Sin eso el bot sabe vender Onia y poco más |

## 5. Lo que quedó en `main`

`f3d1a540` — el cierre post-demo deja de correr siempre en seco
`bb100379` — el lead del CRM se creaba nunca y se actualizaba a medias

503/503 verde. Ninguno toca `web-factory/apps/site`, así que no aplica el gate de `tsc`.

---

## 6. Lo que hay que corregir en el mundo real (no en un doc)

**El branding de Chatwoot vuelve solo cada 24 h.** Hay tres salidas y ninguna es
gratis: (a) aceptarlo y vender el agente, no la bandeja — es lo que el doc del
2-ago recomienda y sigue siendo lo correcto; (b) pagar USD 19/agente/mes, que
igual deja la app móvil diciendo "Chatwoot"; (c) un cron nuestro que lo pise
después del suyo — pelea contra el proveedor todas las noches y se rompe en
cada actualización.

**Recomendación: (a).** Lo que se vende es el bot que califica, agenda y deriva.
La bandeja es "la herramienta profesional que usamos, open source, y tus datos son
tuyos" — que además es argumento contra el lock-in. Pero hay que decidirlo y
escribirlo, porque hoy hay un logo puesto a mano que ya no existe.
