
## PAUSADA · MASCOTA-HIGGSFIELD — Sergio 02-sep: "la mascota no es necesaria por ahora". NO generar, NO gastar creditos en esto. Los prompts quedan abajo por si la reactiva.

PRIMERA corrida con cupo (el grace_daily_limit se resetea por dia): generar las 3
variantes con `higgsfield generate create text2image_soul_v2 --prompt "..."` usando
EXACTO estos prompts (0,12 cr c/u, cost antes, transactions despues, registrar lote):

1. TILE: "flat 2D cartoon illustration of a cute robot mascot character, thick bold black ink outlines, solid flat green color fill #00C661, pure white background, hand-drawn indie webcomic animation style, rounded square head, two tall oval black eyes with tiny white glints, thin curved eyebrows, small spring antenna with a green ball tip, chunky small rounded body, white rounded chest panel with three green equalizer bars, short tube arms with white glove hands, short legs with rounded feet, standing and waving, full body, completely flat colors, no shading, no gradients, no 3D render, no photorealism, minimal clean sticker-like vector art"
2. TV: mismo prompt pero cabeza = "retro TV shaped head with slightly rounded dark screen face, two glowing green oval eyes and thin eyebrows drawn on the screen"
3. CASCO: mismo prompt pero cabeza = "round space-helmet head with a big glossy black visor showing one white glint" y cuerpo mas chico.

Bajar las 3 a hermes-content/references/ui-patterns/mascota-onia/candidatos-higgsfield/,
MIRARLAS, commitear y avisar a Sergio por Telegram (onia-tg.sh) con 1 linea para que
elija. NO adoptar ninguna sin su OK.

⚠️ **Reintentar el MISMO dia no sirve** (medido 02-sep: dos corridas, ~17:00 y ~18:00 UTC,
mismo `grace_daily_limit_reached`, cero cargo las dos). El cupo es diario y de la cuenta
compartida. **Reintentar en la primera corrida de un DIA nuevo**, no en la vuelta
siguiente — y si vuelve a fallar ahi, registrar y esperar al dia siguiente otra vez.
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
| P9 | **Statement-post "Mi oficina entera"** | ✅ 2026-09-02: `carousels/out/statement-mi-oficina-entera.png` — generador nuevo `scripts/marca-personal/generar-statement-post.py`, patrón statement-3d-minimal, claim del banco de la FICHA |
| P10 | **Práctica: experimento textura/sombra statement** | ✅ 2026-09-02: A/B/C en `carousels/out/experimento-textura-statement/` — gana sombra de ícono más rica, grano descartado (triplica peso, no se ve). Aplicado al generador y a las FICHAs de `statement-3d-minimal` y `spec-sheet-editorial`. BASE_CONTENIDO §6 cerrado |
| P11 | **Carrusel 3 "Las 5 tareas que más tiempo te roban"** | ✅ 2026-09-02: 7 láminas en `carousels/out/carrusel-tareas-automatizadas/` — generador nuevo `scripts/marca-personal/generar-carrusel-tareas.py`, marco spec-sheet en portada, contenido 100% de BASE_CONTENIDO §1 (contenido/servidor/chatbot/n8n/Higgsfield, todo probado por nosotros). CTA "Comentá COMUNIDAD" |
| P12 | **Práctica: 3 candidatos mascota 3D Onia** | ✅ 2026-09-02: `carousels/out/experimento-mascota-onia/` (A-cubo/B-blob/C-chip, 0,36 cr Higgsfield). Gana A-cubo, veredicto en BASE_CONTENIDO §6 — **falta OK de Sergio antes de adoptarla**. De paso: se descubrió que el ítem "nano_banana_flash vs soul_v2" de §5 estaba mal cotizado (1,5 cr real vs 0,12 cr asumido) — abortado sin gastar, anotado para no reintentarlo |
| P13 | **Grid grayscale "Señales de que ya necesitás automatizar"** | ✅ 2026-09-02 (tanda intensiva): `carousels/out/lamina-grid-senales.png` (161KB) — generador nuevo `scripts/marca-personal/generar-lamina-grid-senales.py`, mismo patrón visual que `generar-lamina-grid-ia.py` (iconos 3D grayscale + highlight verde), ángulo distinto: autodiagnóstico de dueño de negocio (6 señales), no lista de capacidades — evita duplicar la lámina existente |
| P14 | **Práctica: veredicto skills del radar (unlazy / shuohao)** | ✅ 2026-09-02: evaluadas por lectura de fuente, SIN instalar (instalar tocaría `.claude/skills/` fuera de este carril). Ninguna se adopta acá; `unlazy` (disciplina de gates de cierre) queda propuesta para `docs-auditoria`/`onia-cola`. Veredicto completo en BASE_CONTENIDO §5 |
| P15 | **Pieza de venta: "Un sistema, no una lista de apps"** | ✅ 2026-09-02 (tanda intensiva): 5 láminas `carousels/out/carrusel-sistema-venta/` — generador nuevo `scripts/marca-personal/generar-carrusel-sistema.py`. Promesas de `ONIA_CATALOGO_DE_VENTA.md` §4 (agenda/clientes/servicios/inventario, las 4 🟢), sin precio. CTA "Escribime AUTOMATIZAR" |
| P16 | **Práctica: arte Higgsfield vs ícono Fluent en portada** | ✅ 2026-09-02: A/B en `carousels/out/experimento-arte-higgsfield-vs-icono/` (0,12 cr) — gana el arte Higgsfield (engranajes verdes: literaliza "sistema" mejor que un laptop y encaja con la paleta). Regla nueva: arte pago SOLO en portada/hero, interior sigue en íconos Fluent gratis (tope 1 cr/día). Aplicado a P15. BASE_CONTENIDO §6 "más imágenes" cerrado a la mitad (falta la mitad "foto real de Sergio", bloqueada por falta de identity assets en este carril) |
| P17 | **Statement-post "16 años · 4 herramientas · 1 empresa"** | ✅ 2026-09-02 (tanda intensiva): `carousels/out/statement-16-anos-4-herramientas.png` — generador nuevo `scripts/marca-personal/generar-statement-16anos.py`, claim del banco pendiente de la FICHA de `statement-3d-minimal`, íconos [laptop·Claude·WhatsApp·agenda] |
| P18 | **Práctica: label de ícono en statement-3d-minimal (A/B)** | ✅ 2026-09-02 (tanda intensiva): A (sans negra) vs B (Geist Mono mayúscula gris) en `carousels/out/experimento-label-icono-statement/` — gana B, no compite con el claim y unifica con el marco spec-sheet. Aplicado a `generar-statement-post.py` (regenerado) y a P17. De paso corrigió un bug real: con claim de 2-3 líneas la fila inferior de íconos se solapaba con el handle — arreglado antes de publicar. Veredicto en BASE_CONTENIDO §6 |

| P19 | **Historias-quiz 04-06 (build-in-public)** | ✅ 2026-09-02 (tanda intensiva): `carousels/out/historias-quiz/historia-04..06.png` — 04 guardián del VPS (`*/10` cron real), 05 meta-contenido "esta historia la escribió mi servidor" (4×/día), 06 "el empleado que no duerme" (Bs 0 de **sueldo**). Material de BASE_CONTENIDO §1, todo probado; las dos cifras contadas en vivo con `crontab -l`, no de memoria. Opciones de encuesta + respuesta correcta en SEMANA1 |
| P20 | **Práctica: banda segura de historias 9:16 (A/B/C)** | ✅ 2026-09-02 (tanda intensiva): `carousels/out/experimento-safearea-historia/` — gana **C** (banda segura + tipografía 88%). **Encontró un defecto real que estaba publicable:** el handle quedaba tachado por la barra "Enviar mensaje" de IG y ~40% de la zona de encuesta caía bajo la interfaz. Aplicado al generador, **las 6 historias regeneradas**, y quedó el gate `chequear-banda-segura-historias.py`. Veredicto en BASE_CONTENIDO §6. ⚠️ §5/§6 **ya no tenían pendientes ejecutables** (4 bloqueados: assets de identidad, runtime HyperFrames, OK de Sergio sobre la mascota) — este experimento lo inventó el loop, y dejó anotado el siguiente |
| P21 | **Carrusel 4 "Cómo contesto a cada cliente sin estar yo"** | ✅ 2026-09-02 (tanda intensiva): 7 láminas en `carousels/out/carrusel-atender-clientes/` + hoja de revisión `CONTACTO-7-laminas.png` — generador nuevo `scripts/marca-personal/generar-carrusel-atender.py`. Es el ítem 4 del plan mensual. Promesas 100 % de la fila "Chatbot con IA (web + WhatsApp)" de `ONIA_CATALOGO_DE_VENTA.md` (🟢 vivo), **sin precio**; CTA comunidad exacto. Se le **quitó el "en 30 segundos"** que traía el título del plan: esa cifra no está medida en ningún lado |
| P22 | **Práctica: la portada leída al tamaño en que la ve el público** | ✅ 2026-09-02 (tanda intensiva): A/B/C en `carousels/out/experimento-portada-miniatura/` — gana **C** (jerarquía por tamaño: contexto chico gris + remate gigante wdth 125). A 13 % (grilla de perfil) es la única variante que se sigue leyendo. **Defecto real:** el subtítulo gris de todas las portadas viejas es peso muerto — invisible al tamaño del feed y encima le roba tamaño al título. Aplicado a P21 y a la FICHA de `spec-sheet-editorial`; queda pendiente pasar las 5 portadas viejas al patrón (hay que elegir el remate de cada una a mano). **Segundo experimento inventado por el loop**: §5/§6 siguen sin pendientes ejecutables. De paso el gate se atrapó a sí mismo (la hoja salía cortada) y apareció una trampa del CSS: un resaltado pegado a un signo de puntuación deja un hueco visible |

| P23 | **Guiones D · E · F (los 3 "por delante")** | ✅ 2026-09-02 (tanda intensiva): en `ONIA_MARCA_PERSONAL_SEMANA1.md`. **D** "Mi servidor se arregla solo" (gancho #8, build-in-public) · **E** "Hoy despedí a mi diseñador. Era yo." (gancho #3, deadpan, el arte por terminal con el costo antes) · **F** "Tu negocio ya te está pidiendo un empleado" (gancho #13, **el único de venta**, CTA "Escribime AUTOMATIZAR"). Las promesas de F salen 100 % de la fila *"Chatbot con IA (web + WhatsApp)"* de `ONIA_CATALOGO_DE_VENTA.md` (✅ vivo), **sin precio**. Las 3 cifras que se dicen en cámara se contaron **en vivo esta corrida** (`crontab -l` → guardián cada 10 min y loop 4×/día; `higgsfield generate cost` → 0,12 cr), y el guion E lleva la advertencia de no decir "siempre funciona" (el cupo es compartido) |
| P24 | **Práctica: el verde de marca — la §7 de Sergio no estaba ejecutada** | ✅ 2026-09-02 (tanda intensiva): A/B/C con **contraste medido**, no supuesto, en `carousels/out/experimento-verde-marca/`. **Hallazgo:** §7 fijaba `#00C661` "SIEMPRE" y **4 de los 12 generadores estaban en `#1F7A4D`** — las dos piezas de venta y los dos carruseles más nuevos. **Cambiar el hex a secas habría roto la pieza:** ahí el verde era *color de texto*, y `#00C661` como tinta da **2,12:1** (reprueba AA). **Gana C** — verde de **fondo** + tinta negra, **8,72:1** — que es como ya lo usaban los otros generadores. Aplicado a los 4 + las 4 piezas regeneradas + FICHA. **De paso:** se retiró el marco "TECHNICAL SPEC" que Sergio descartó y seguía vivo en esos 4, se corrigieron los docstrings que lo anunciaban como ganador, y se arregló que el CTA del carrusel de tareas salía en **negro** (variable de verde declarada y no usada). Hoja de verificación: `carousels/out/CHEQUEO-verde-y-marco.png` |

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
| 2 | Drop del día siguiente preparado y pulido | 🔄 loop, diario | ✅ D1 (Claude Code) en `docs/cola/drops/2026-09-03.md` — ya escrito; las vueltas de 13:56 y 17:56 UTC lo dejaron intacto a propósito. Siguiente: D2 (5 prompts) para 2026-09-04, lo escribe la primera vuelta del 03-sep |
| 6 | Captura real de un sticker de encuesta de IG | ⬜ SERGIO (10 seg) | pantallazo pegando una encuesta en una historia — sin eso, el tamaño de la zona punteada de las historias-quiz está a ojo (ver BASE_CONTENIDO §6, próximo experimento) |
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
