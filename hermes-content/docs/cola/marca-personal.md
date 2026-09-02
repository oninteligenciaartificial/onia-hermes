# Cola — carril MARCA PERSONAL · COMUNIDAD · CONTRATO SAMUEL

> Índice del carril: `docs/ONIA_MARCA_PERSONAL_MADRE.md` (documento madre).

## PRODUCCIÓN DEL LOOP (2026-09-01 en adelante, orden de prioridad)

| # | Pieza | Estado |
|---|---|---|
| P1 | **Biblioteca de drops** | ✅ 2026-09-01: `ONIA_COMUNIDAD_BIBLIOTECA.md` + página Notion "Onia Community · Biblioteca" (borrador privado — **Sergio: abrirla → Compartir → Publicar en la web → fijar ese link en Avisos**) |
| P2 | **Drops semana 2** | ✅ 2026-09-01: 7 drops lun-dom en `ONIA_COMUNIDAD_CONTENIDO.md` (sáb se llena con señales del mié; jue y dom llevan el toque de Sergio) |
| P3 | **Radar mensual #1 para Samuel** | ✅ 2026-09-01: `ONIA_MARCA_PERSONAL_RADAR.md` (14 ganchos por serie + tabla tema→palabra→recurso) |
| P4 | **Carrusel 1 "5 prompts"** | ✅ 2026-09-01: 7 láminas 1080×1350 en `carousels/out/carrusel-5-prompts/` — íconos Fluent 3D (MIT), SIN esperar Higgsfield. Generador: `scripts/marca-personal/generar-carrusel-prompts.py`. Carrusel 2 ("3 cursos") pendiente, mismo generador |
| P5 | X banner + website | 🔴 el modal de edición de X lleva TODO el día sin montar en este entorno (probado 6+ veces, 2 navegadores, mobile incluido). **Alternativa de 1 min para Sergio desde el TELÉFONO:** app de X → Editar perfil → banner (mandate la imagen `ChatGPT Image 30 ago...png` de Descargas por WhatsApp a vos mismo) + Website: `https://chat.whatsapp.com/ENplPbR8GrbGsdMrGgLxzu` |
| P6 | Textos X/LinkedIn + captions + checklist completa | ✅ 2026-09-01: `docs/cola/PARA-PUBLICAR-HOY.md` (7 bloques copy-paste) + `ONIA_MARCA_PERSONAL_SEMANA1.md` § "Textos X/LinkedIn de la semana" (versión X y versión LinkedIn de Video A/B/C) |
| P7 | Encuesta de temario (semana 3) — redactarla cuando haya señales de 2 semanas | ⏸ |
| P8 | **Pieza de venta: chatbot/recepcionista IA** | ✅ 2026-09-02: mini-carrusel 5 láminas `carousels/out/carrusel-chatbot-venta/` — generador `scripts/marca-personal/generar-carrusel-chatbot.py`. Promesas SOLO de `ONIA_CATALOGO_DE_VENTA.md` §5 (chatbot 🟢 vivo), sin precio. CTA "Escribime AUTOMATIZAR" |

> **LOOP VPS: VIVO Y VERIFICADO** (2026-09-01). Cron diario 17:56 La Paz. Primera vuelta:
> 127 s, exit 0, escribió `drops/2026-09-02.md` (calidad verificada) y pusheó a
> `claude/marca-personal-loop`. ⚠️ Nota para el dueño del runner `onia-loop.sh`: el
> contador "sin pushear" dio falso positivo (contó ANTES de que el push del agente
> terminara de registrarse) — el aviso FALLO de las 21:58 era mentira, el push estaba hecho.

> Dueño: la sesión de estrategia/marca personal (esta). La sesión de higgsfield/modelos
> es dueña de Lucía · @oniahq · ads (su cola: `docs/cola/contenido.md`). Ninguna toca
> los archivos de la otra. División acordada 2026-09-01.
> Archivos de este carril: `docs/ONIA_MARCA_PERSONAL_*` · `docs/ONIA_COMUNIDAD_CONTENIDO.md`
> · `references/marca-personal/` · esta cola.

## HOY (el loop trabaja de arriba hacia abajo)

| # | Tarea | Estado | Nota |
|---|---|---|---|
| 1 | D0 en la comunidad (bienvenida + 3 cursos) | ⬜ SERGIO pega (30 seg) | texto listo en `ONIA_COMUNIDAD_CONTENIDO.md`; falta que agregue los 3 links del reel CERTIFICADOS |
| 2 | Drop del día siguiente preparado y pulido | 🔄 loop, diario | ✅ D1 (Claude Code) en `docs/cola/drops/2026-09-03.md`. Siguiente: D2 (5 prompts) para 2026-09-04 |
| 3 | Contrato: mandar `Acuerdo_Etapa2_Version_Firma.pdf` a Samuel | ⬜ SERGIO | el PDF "final" de Samuel era idéntico al anterior — NO firmar ese |
| 4 | X: banner + website (link comunidad) | 🔄 loop reintenta | modal rate-limited el 31-ago; asset en Descargas |
| 5 | Bios: link de comunidad en IG (y TikTok/FB/YT cuando se confirmen cuentas) | ⬜ SERGIO (IG 1 min) | LinkedIn ✅ ya lo tiene |

## SEMANAL (loop)

- **Lunes:** llenar tablero de KPIs (§3 de `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md`):
  miembros nuevos · solicitudes con `src` · demos. Sin esto no hay decisión de renovar.
- **Drops D1-D6** listos en `ONIA_COMUNIDAD_CONTENIDO.md`; el loop escribe la semana 2
  a partir de las reacciones de la semana 1.
- **3 posts de redes** de la semana definidos (secuela POV 5.4K · anti-agencia · interactivo).
- **Radar mensual para Samuel** (entregable del acuerdo): antes de la primera sesión de
  grabación, con palabra clave + recurso por video.

## ESPERANDO (no bloquea el loop)

- Números de Etapa 1 + fechas de grabación → los manda Samuel → al llegar: baseline en KPIs.
- Firma del contrato (Leslie + Samuel).
- Crudos de la primera sesión → activa el runbook de derivados (§5 de operación).

## Sueltos SIN DUEÑO detectados (propuesta de asignación — decide Sergio)

| Suelto | Por qué importa | Dueño propuesto |
|---|---|---|
| 🔴 Embudo comentario→DM roto (`neverError`, 0 DMs reales) + `cal.onia.com.bo` 502 | TODO el sistema de Samuel desemboca ahí; hoy los 30 videos caerían al vacío | **Carril infra/VPS** (guardián del VPS o sesión G) — es n8n+Docker, no estrategia |
| 🔴 Postiz caído (502 hoy) + cableo X/LinkedIn repost | sin Postiz no hay repost automático ni cola de publicación | Infra levanta el contenedor; el cableo después es mío |
| 🟡 Test de tercero del DM (comentar SISTEMA desde cuenta ajena) | única verificación real del embudo | **Sergio** (2 min, necesita cuenta ajena) |
| 🟡 Pago a Samuel por canal personal (no cuenta OniaAgency) | sin factura, salida del negocio sin respaldo = riesgo | **Sergio + Leslie** |
| 🟡 Onia Center CI rojo permanente (deploy roto desde 23-ago) | ruido que tapa fallos reales | sin dueño — anotado, decisión de Sergio si se archiva |
