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
| Íconos | render 3D estilo clay/glass "app icon inflado", sombra RICA abajo (`drop-shadow(0 30px 45px rgba(0,0,0,.25))`, ganadora del experimento 02-sep), vista frontal, ~23% del ancho c/u |
| Layout | grid 2 arriba + 2 abajo, texto centrado al medio; márgenes generosos (~12% laterales) |
| Label de ícono | sans regular negra ~34px, centrada bajo el ícono |
| Claim central | Archivo wght 900 wdth 62, word-spacing .09em, negra ~130px (tipografía de marca — reemplaza a Inter, ver ONIA_MARCA_SISTEMA) |
| Subclaim | Archivo semibold gris `#8E8E8E` ~56px |
| Fondo | `#F6F4F1` plano, SIN grano (probado y descartado, ver abajo) |

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

## Producción y experimentos

- **Generador:** `scripts/marca-personal/generar-statement-post.py` (HTML + Chrome
  headless, mismo patrón que los otros generadores del carril).
- **Experimento textura/sombra (02-sep)**, `experimento-textura-statement.py`, salida
  en `carousels/out/experimento-textura-statement/`: comparadas 3 variantes sobre la
  pieza real "Mi oficina entera" — sin textura, grano sutil, grano + sombra rica.
  **Gana la sombra de ícono más rica**, ya aplicada al generador. El grano
  (feTurbulence) se descarta: triplicó el peso del PNG (172KB→900KB) y no se
  distingue a esta escala — regla "verificar es MIRAR".

## Ideas listas para Sergio (misma fórmula)

- ✅ "Mi oficina entera" → [laptop · café · WhatsApp · Claude] — producida 02-sep en
  `carousels/out/statement-mi-oficina-entera.png`
- "Bs 0 en sueldos" / "mi equipo son 4 cosas" → [Claude Code · n8n · Higgsfield · laptop]
  (n8n e Higgsfield sin ícono propio en el set — pendiente si se quiere esta variante)
- "16 años. 4 herramientas. 1 empresa."
- "Atender clientes 24/7 solo requiere 3 cosas" → [WhatsApp · Claude · n8n] (dueños de negocio)
- Portadas de los carruseles del mes usan este mismo esqueleto.
