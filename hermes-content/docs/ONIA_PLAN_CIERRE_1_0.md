# PLAN DE CIERRE 1.0 — un solo plan, las notas de Sergio adentro

> ⚠️ **10-oct:** qué se vende ya, qué va en la 1.1 y qué después lo dice `ONIA_1.0_CORTE.md`. Si este
> plan del 13-sep lo contradice (por ejemplo, «los 5 rubros» o «factura SIAT» dentro de la 1.0), gana el corte.

> Pedido de Sergio Urcullo (13-sep): *"antes de hacer cosas, primero leé mis notas y seguí
> un plan para cerrar la 1.0"*. Este ES el plan. Se EDITA acá (sin fecha en el nombre);
> el estado por punto vive en `cola/plataforma-v1.md` (Definición 1.0). Cada ítem dice
> QUIÉN lo hace: **[S]** Sergio · **[IA]** sesión de control + subagentes · **[loops]**
> los loops de nodo-casa · **[n8n]** workflow en el n8n self-hosted.

## Qué es "cerrada" (no cambia)

Un cliente de los 5 rubros **descubre, prueba, usa y paga** sin humanos de Onia y sin una
promesa falsa — y el sistema **factura SIAT** (Sergio la metió a la 1.0 el 12-sep).

## Estado real al 13-sep (medido, no heredado)

✅ 1 alta E2E (correo en Recibidos→clic→panel) · ✅ 3 cobro (escalera C viva) · ✅ 4 topes ·
✅ 7 panel · ✅ 9 opera sola · 🟢 2 rubros (dental 9/9, comercio 8/8 post-deploy; 3 en
rotación del loop) · 🟢 8 promesas (escalera barrida en las 3 superficies) · 🟢 6 chatbot
(cola sin rojos técnicos; falta el OK VISUAL de Sergio — ver F2) · 🟡 5 SIAT (PdV 1 creado;
**MATRIZ SECA: 5042/5042 (100 %)** en todo salvo la VIII — la VI cerró 560/560 en la
pasada 3 del 13-sep; wrapper F1.4 **desplegado** con health verde en :8517; etapa VIII:
Sergio decidió el 12-sep **mantener Electrónica** → firma digital en desarrollo; falta
leer el marcador del portal con su login y la Fase 2).

**Cerrado en la madrugada del 13-sep:** F1.4 wrapper en systemd (`onia-siat-wrapper`,
carga `siat-piloto.env` + `siat-wrapper.env`) · F1.5 y F3.5 vigías n8n ACTIVOS y probados
con mensajes reales · F2.1 **desplegado** (bot lee el editor del panel vía
`ONIA_KNOWLEDGE_URL`; health `panel.configurado:true`, fail-open al archivo hasta la
primera publicación) · F3.2 medido en prod (T1 0:24, T2 0:21 a máquina; copy propuesto en
rama `claude/tiempo-valor`, número lo elige Sergio) · F2.2+F3.3 construidos en rama
`claude/f2-f3-panel` (capturas enviadas a Sergio; su ok = merge+deploy) · Verificado en
Meta MIRANDO: WABA vivo "Onia" (4429061034078857, portfolio OniaAgency) **Verificado +
Aprobado + VISA \*4028** — la "cuenta inhabilitada" que asusta en WhatsApp Manager es el
WABA viejo (+591 75470140), legado, no bloquea nada · Horarios de demo propuestos de su
Cal.com: **lun 15 19:30 y mar 16 14:30** (esperan su ok).

## Fase 1 — SIAT hasta el final (el único 🔴 estructural)

1. **[IA]** Runner de la matriz completa hasta secarla (corre AHORA; vigilarlo y relanzar
   si corta). Listo = todas las etapas menos la VIII al 100 % en el portal.
2. ~~Quitar la modalidad Electrónica~~ **CAMBIÓ el 12-sep — decisión de Sergio Urcullo:
   "hazlo también con electrónica en línea"**. La etapa VIII se COMPLETA: **[IA]**
   investigar certificado para piloto (¿de prueba/autofirmado?) + implementar la firma
   XML del emisor (subagente en rama `claude/siat-firma-viii`); **[S/Leslie]** si ADSIB
   exige certificado emitido con trámite, lo tramita Leslie (titular) — pasos y costo
   quedarán en `ONIA_SIAT_TU_PARTE_DEL_TRAMITE.md`.
3. **[S]** Cuando el marcador dé 100 %: **solicitar Fase 2 (inspección), pedir VIRTUAL**.
4. **[IA]** El wrapper HTTP del emisor (`POST /fiscal/invoices` → `emitInvoice()`) para
   que el día de la autorización sea cambiar una env var. Se hace en paralelo, no bloquea.
5. **[n8n]** Workflow "vigía SIAT": lee el log del runner 2×/día y avisa por Telegram si
   se frena o si el marcador sube de hito (nota de Sergio: *"mirar más n8n"* — el n8n ya
   existe con 44 workflows; se le suma trabajo, no se instala nada).

## Fase 2 — El chatbot que SERGIO vea y entienda (su reclamo del 13-sep)

Nota textual: *"quiero ver qué tan configurado es, dónde ponés qué tiene que decir, su
temperatura, de dónde saca mi información — no se ve visualmente; no puedes enviar
mensajes sin que funcione antes"*. Y de la charla: *"alimentar la IA para que funcione
sola, fácil y bien explicado (ilustrado), no tanto texto"*.

1. **[IA] Hacer VISIBLE la configuración del bot de ventas en el panel** (dogfooding):
   hoy el bot de Onia lee su conocimiento del repo (`source: code`) mientras los clientes
   tienen EDITOR en pantalla (`/settings/chatbot`: qué sabe, probador, opciones avanzadas).
   Obra: el inbox de ventas de Onia pasa a leer el conocimiento PUBLICADO por el editor de
   la org interna — lo que digas en pantalla es lo que el bot dice. Listo = Sergio edita
   una respuesta en el panel y el bot la contesta en WhatsApp sin tocar el repo.
2. **[IA] La pantalla explica de dónde sale cada cosa**: en el editor, un bloque fijo
   "De dónde saco lo que digo" — precios (fuente única, no editables acá a propósito),
   horario, FAQs tuyas, y el guion fijo de venta (por qué es fijo: cero inventos con
   plata). "Temperatura": el flujo de venta es guion determinista (sin dial, a propósito);
   la capa libre (LLM) tendrá su control simple cuando haya crédito — se dice en pantalla,
   no se esconde.
3. **[S] Probarlo vos**: escribile al bot desde tu WhatsApp, editá algo en el panel,
   verificá que cambió. Listo = tu "ok, lo entiendo y funciona".
4. **[S→IA] Recién entonces: los 2-3 leads de agosto** con la plantilla `seguimiento_demo`
   (te la mostré: falta tu elección de destinatarios y TUS DOS HORARIOS de demo — S12).

## Fase 3 — Kilometraje de rubros y venta en paralelo

1. **[loops]** `recorrido-cliente` rota importadora → estética → servicios con su vara
   (8-9 pasos, `completo:true`, cero residuo). Listo = 5/5 rubros con corrida verde.
2. **[IA]** Tiempo-hasta-valor MEDIDO (nota: *"mostrar tiempo 1 y tiempo 2"*): cronometrar
   con la cuenta QA el alta→operando y alta→primer valor, y publicar el número en la
   landing. Listo = cifra real en pantalla, no promesa.
3. **[IA]** Contador "horas que te ahorró la IA" en el panel del cliente (nota: *"mostrar
   la diferencia de tiempo, el valor"*; evidencia RevenueCat del research). 1-2 días.
4. **[S]** Vender con el playbook `ONIA_VENDER_MIENTRAS_SE_DESARROLLA.md` (ya escrito,
   con tu semana tipo de 6,5-8 h y el día-por-día del 13 al 27-sep). Listo = 3 números
   semanales: conversaciones trabajadas / demos / pagos APPROVED.
5. **[n8n]** Aviso "lead sin respuesta > 1 h" a tu Telegram (la regla del playbook: cero
   leads >24 h; el n8n vigila, vos contestás).

## Fase 4 — Pulido guiado por la venta (no antes)

- Tutoriales ilustrados dentro del producto (nota: *"ilustrado, no tanto texto"*) — por
  rubro, sobre las pantallas reales. **[IA]**, arranca cuando haya 1 cliente pagando
  usándolas (estandarizar antes de automatizar — tu propia nota).
- Objeción repetida 2× en demos = ítem de cola con cita textual (la venta manda el
  roadmap). **[S anota / IA construye]**
- N1 personalización: ESPERA a un prospecto enterprise (decidido 13-sep).

## Lo que NO entra (decidido, no se reabre)

Veterinaria/ganadería, offline, pasarela automática, apps móviles, fierro LLM (DGX),
entrenar modelos para vender, cripto/marketplace/dropshipping — congelados con evidencia
en `ONIA_TEMAS_CHARLA_CONTESTADOS.md`.

## Dependencias vivas de Sergio (todas en su pantalla Hermes)

Su prueba del bot al llegar a casa (F2.3) · confirmar los 2 horarios de demo propuestos
(lun 15 19:30 / mar 16 14:30) · crédito OpenAI (dijo: lunes 15).
**Cerradas el 12/13-sep:** declaración NIT ✓ (la hizo él) · tarjeta Meta ✓ (verificada
mirando: VISA \*4028 en el WABA vivo, negocio Verificado) · borradores de agentes → los
prueba la IA en org QA (él delegó: "tú haz la prueba") · llamada VIII → reemplazada por
la decisión de completar Electrónica.
