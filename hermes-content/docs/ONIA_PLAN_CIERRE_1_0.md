# PLAN DE CIERRE 1.0 — un solo plan, las notas de Sergio adentro

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
(cola sin rojos técnicos; falta el OK VISUAL de Sergio — ver F2) · 🔴 5 SIAT (PdV 1 creado,
runner corriendo; faltan etapa VIII y Fase 2).

## Fase 1 — SIAT hasta el final (el único 🔴 estructural)

1. **[IA]** Runner de la matriz completa hasta secarla (corre AHORA; vigilarlo y relanzar
   si corta). Listo = todas las etapas menos la VIII al 100 % en el portal.
2. **[S]** Llamada al SIN por la **etapa VIII**: 800 10 3444 — ¿se puede quitar la
   modalidad Electrónica conservando los casos? (la vía del portal está caída). Listo =
   respuesta del SIN; si es no, decidimos certificado AGETIC con la cuenta delante.
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

Llamada etapa VIII · crédito OpenAI (capa libre del bot + Hermes VPS) · tarjeta Meta
antes del 1-oct · 2 horarios de demo (S12) · aprobar los 2 borradores de agentes ·
declaración NIT (día 13) · su "ok" final del bot (Fase 2.3).
