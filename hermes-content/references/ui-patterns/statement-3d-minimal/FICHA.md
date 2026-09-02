# Patrón: statement-3d-minimal

> Referencia: bastian.xu, post `DctVTm1RRx7` (2026-09-01), guardada en
> `referencia-bastianxu.jpg`. Pedido por Sergio para su marca personal: "estos me
> gustan, aprende cómo hacerlos".

## Qué es

**Imagen ÚNICA tipo statement** (no carrusel): una idea provocadora reducida a objetos.
Fórmula del copy: `[resultado deseable] + "solo requiere N cosas" + los N objetos`.
Vive del "guardar" y del comentario ("¿pero cómo?" — la curiosidad ES el engagement:
el único comentario del post de referencia es exactamente esa pregunta).

## Receta visual (medida sobre el original 1350×1688, 4:5)

| Elemento | Spec |
|---|---|
| Lienzo | 1080×1350 (4:5) — el original usa 1350×1688 |
| Fondo | blanco cálido `#F6F4F1` plano, sin gradientes ni texturas |
| Íconos | render 3D estilo clay/glass "app icon inflado", sombra suave abajo, vista frontal, ~23% del ancho c/u |
| Layout | grid 2 arriba + 2 abajo, texto centrado al medio; márgenes generosos (~12% laterales) |
| Label de ícono | sans regular negra ~34px, centrada bajo el ícono |
| Claim central | sans **ultra-black** negra ~150px ("$10k/mes") |
| Subclaim | sans semibold gris `#8E8E8E` ~64px |
| Tipografía | SF Pro Display / **Inter** (nuestro equivalente) |

## Cómo lo producimos

1. **Plantilla:** `plantilla.html` en esta carpeta (1080×1350, tokens CSS). Cambiar
   claim + subclaim + 4 íconos = pieza nueva en minutos. Render: abrir en Chrome →
   screenshot 1:1, o HyperFrames→PNG para lote.
2. **Íconos 3D propios:** generar UNA vez un set consistente vía **Higgsfield WEB**
   (regla: nunca MCP) con prompt fijo:
   > "3D app icon in soft clay render style, subtle drop shadow, front view, centered,
   > isolated on warm white background #F6F4F1, high quality, minimal"
   Set inicial: Claude, WhatsApp, Instagram, n8n, Notion, laptop, foco, gráfico, café.
   Lote chico de imagen = ya autorizado. Guardar acá en `iconos/`.
3. `iconos-mock/` tiene 4 recortes de la referencia — SOLO para preview interno,
   no se publican (son renders ajenos).

## Ideas listas para Sergio (misma fórmula)

- "Bs 0 en sueldos" / "mi equipo son 4 cosas" → [Claude Code · n8n · Higgsfield · laptop]
- "16 años. 4 herramientas. 1 empresa."
- "Atender clientes 24/7 solo requiere 3 cosas" → [WhatsApp · Claude · n8n] (dueños de negocio)
- "Mi oficina entera" → [laptop · café · WhatsApp · Claude]
- Portadas de los carruseles del mes usan este mismo esqueleto.
