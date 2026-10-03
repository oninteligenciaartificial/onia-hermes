# Handoff — relevo a Codex (desde el 4-oct, 16:57 La Paz)

Lo escribió la madre de Claude el 3-oct, cuando Sergio Urcullo avisó que los tokens de Claude se acababan. **Codex está
al 100 % de su semana hasta el domingo 4-oct, 20:57 UTC (16:57 La Paz)**: antes de esa hora no arranca nada. La cuenta
y sus reglas están en la memoria `codex-cuenta-y-reparto`. Las skills, en `.claude/skills/` (la tabla está en `AGENTS.md`).
Se trabaja en ramas `codex/*` con PR: nada directo a main.

## Reglas para cada tarea
- Arranca con **META / PRUEBA DE HECHO / REGLA DE PARADA**, escritas en el PR.
- **Effort medio**. Una tarea por sesión; la sesión se cierra al terminar.
- Leer por sección (grep/sed), nunca transcripts.
- Onia les habla de **usted** a los clientes.
- Gasto, mensajes a terceros, producción y SIAT: siempre con el OK de Sergio Urcullo.

## Cola, en orden

### T1 · Edición de lo que Sergio Urcullo grabó el 3-oct (urgente)
- Los brutos los manda él (bloques 1-5 de `hermes-content/docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`; fichas
  en `KIT-GRABACION.md`).
- **META:** por cada pieza, transcripción + **tabla de cortes + preview 360p**, para que Sergio Urcullo los vea ANTES de
  cortar (regla de oro). Skills: `ver-videos`, `editor-videos`, `edicion-referentes`.
- **PRUEBA:** una carpeta por pieza con la tabla y el preview, y la lista en el PR.
- **PARADA:** no se renderiza el final sin su OK. Si falta el recorte del fondo verde, se arma pantalla partida
  (receta Santiago).

### T2 · Auditoría: cobro automático y autoservicio (pedido de Sergio Urcullo, 3-oct)
- ✅ **HECHA por la madre v2 el 3-oct** (`hermes-content/docs/research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`, PR #115). Codex NO la hace.
- **META:** documento `hermes-content/docs/research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md` con:
  - (a) cómo cobran y dan de alta sin humanos los mejores SaaS y ERP (Alegra, Siigo, Holded, Odoo, Bind, y
    AgendaPro/Doctocliq/Dentalink para clínicas): prueba, checkout, cobro recurrente, reintentos, factura y baja;
  - (b) qué leyes de Bolivia aplican a un SaaS que cobra en línea: Ley 453 del consumidor, contratos de adhesión,
    factura SIAT, IUE-BE si hay proveedores del exterior, ASFI para pagos con QR, datos personales. Con la fuente citada
    (skill `onia-contabilidad-bolivia`);
  - (c) auditoría del flujo real de onia-platform, de `/register` a la prueba, el plan, el QR del BCP, el comprobante y
    la aprobación: qué es manual hoy, con archivo:línea;
  - (d) propuesta ordenada para que quede lo más automatizado posible, con esfuerzo y riesgo.
- **PRUEBA:** el doc en un PR, con fuentes y archivo:línea. **PARADA:** solo lectura. Sin código; un solo doc.

### T3 · Análisis de EDICIÓN de los reels que manda Sergio Urcullo
- Regla de Sergio Urcullo (3-oct): de cada contenido que manda se analiza el **mensaje**, el **tema** y la **edición**,
  mirando bien el video.
- **META:** completar `hermes-content/references/video-intake/2026-10-03-reels-genjutsu-y-fiesta-ia.md` con:
  - ritmo de corte (cortes por cada 10 s);
  - tipografía, posición y animación de los subtítulos;
  - transiciones, zooms, b-roll, efectos de sonido y música;
  - los primeros 3 s cuadro por cuadro.

  Herramientas: `ver-videos` (`fetch-video.mjs`, `text-frames.mjs` y Gemini con un prompt de edición). Mismo análisis
  para el TikTok `https://vt.tiktok.com/ZSbm3Scje/`.
- **PRUEBA:** la ficha con las 4 partes en cada video. **PARADA:** solo esos videos.

### T4 · Barrido de «usted» en el bot (solo si Ventas no lo cerró)
- Mirar antes `git log -- hermes-content/deploy/vps-ops/bot/knowledge.onia.json`.
- **META:** 0 voseo en las respuestas del bot. **PRUEBA:** el grep da 0 y la suite está verde en Linux.
  **PARADA:** solo texto.

## Pendientes de Sergio Urcullo (no son de Codex)
- Firma de la respuesta a la pauta (versión en usted, en el chat del 3-oct).
- Tarjeta asignada a ONIA Ads (hoy está solo en la empresa y en el WhatsApp).
- WhatsApp vinculado a la página «Onia».
- OK a las plantillas de los 6 leads (las propone Plataforma).
- ¿La web y los anuncios pasan a usted?
- Plan de campañas con Bs 4.000 y objetivo de la 1.0 (lo arma la madre).
- OK a los costos de Higgsfield antes de generar.
