# Panel claro premium — maquetas del dashboard dental de Onia Platform

Maquetas HTML autocontenidas de la dirección "claro premium" para el panel.
Datos de muestra, **no es producción**. Rediseñan el MISMO contenido del panel
real (métricas del día, agenda de hoy, reactivación, aprobaciones del agente,
accesos rápidos).

## Los 3 archivos

| Archivo | Qué es |
|---|---|
| `index.html` | v1. Primera pasada de la dirección: banda de pulso con cifra dominante, 3 niveles de elevación sobre lienzo tintado `#EDF2EF`, agente como única superficie oscura. Tipografía: Manrope 700-800 (títulos y cifras) + Inter 400-600 (resto). |
| `index-letra-b.html` | Variante B de v1: **mismo layout y tokens que `index.html`; solo cambia el par tipográfico** a Bricolage Grotesque (display) + Schibsted Grotesk (UI). |
| `index-v2.html` | **VIGENTE.** Reorganización estructural sobre v1 (feedback Sergio 2026-08-16): sidebar = la navegación REAL completa (`navigation.ts`, vista ADMIN, 16 items), logo real del producto, shell de 3 zonas (nav · día · bandeja), pulso compacto horizontal, agenda como columna dominante con riel de tiempo, y el agente como bandeja de decisiones de altura completa con los 2 agentes reales (Cobrador y Recall). Usa el par tipográfico B ya decidido. |

## Por qué v2 es la vigente

- Todo lo que muestra mapea a una función que EXISTE según
  `hermes-content/docs/ONIA_AUDITORIA_FUNCIONAL_DENTAL.md`; lo faltante quedó
  marcado en sus notas (regla dura: no fabricar).
- Incorpora el sistema real: 16 items de nav de ADMIN, los 3 `quickActionItems`
  reales, el `bottomNavHrefs` real en móvil, y el correo propio verificado como
  canal (nada de WhatsApp, que es add-on gateado).
- v1 y letra-b quedan como historia de la dirección visual y del A/B tipográfico.

## Tipografía decidida

**Bricolage Grotesque 700-800 (títulos y cifras) + Schibsted Grotesk 400-700 (UI).**
Motivo registrado en las notas de `index-letra-b.html`: Bricolage tiene carácter
real sin volverse editorial; Schibsted es un grotesk de diario, ultra legible a
11-15px y con cifras tabulares. Woff2 variables subset latin, licencia OFL.

Las fuentes viven en esta misma carpeta, hermanas del HTML (cero CDN):
`BricolageGrotesque-var-latin.woff2`, `SchibstedGrotesk-var-latin.woff2` (par
decidido) y `Manrope-var-latin.woff2`, `Inter-var-latin.woff2` (solo para v1).

## Uso: referencia de porteo a onia-platform

La maqueta es referencia para portear la dirección al producto. **Los tokens
(lienzo, elevación e1/e2/e3, colores de estado, escala tipográfica, radios,
primitivos de componente) están en el bloque `<details class="notes">` al pie
de cada HTML.** Las notas de `index-v2.html` agregan además los patrones de Web
Factory usados, las decisiones de organización y la lista de faltantes.
