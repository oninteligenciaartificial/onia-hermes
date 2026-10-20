# Diseño de las páginas de venta de 6 referentes (taller, oferta, evento)
Recepción: 20-oct-2026. Sergio Urcullo: «se supone que tenés que mirar todas sus páginas y aprender sobre ello» (corrección: la ficha de embudos del mismo día dejó colores, tipografía, estilo y frontend como «no observado»). · Análisis: 20-oct-2026 · Tipo: webs y páginas de evento/checkout
Fuente: tododeia.com, luma.com/soy-9u8l, allai.events (Enrique Rocha) · event.monetise.com (Gadzhi) · eriktaveras.com, /trabaja-conmigo, workshops.eriktaveras.com, skool.com/automatizate (Erik Taveras) · horizontesia.com, /agente-whatsapp, /santiago, forjabots.com (Santiago Muñoz) · acquisition.com, /workshop, /roadmap, /training/offers, shop (Hormozi) · alkimiainstitute.com y su ficha y checkout de Hotmart (Alkimia)
Acceso: público, sin login ni formularios. Medido con `scripts/disenio-pagina-medir.cjs` (captura entera a 390 y 1440 + letras, tamaños y colores del CSS COMPUTADO). Informes completos y capturas, fuera de git porque copian páginas ajenas: `E:/onia-research/disenio-paginas/<referente>/ANALISIS.md` y `tramos/*.png`.
Sesión/carril: sesión local «taller No pierdas clientes» (estilo de la página y los carruseles), 3 subagentes Sonnet + revisión de las capturas clave por la sesión.

> **Lectura rápida.** Las 6 páginas resuelven el mismo problema con tres moldes: **ficha** (Erik: papel, letra condensada enorme, franja de datos, tarjeta de precio), **cartel de evento** (tododeia en Luma y Gadzhi: foto real del creador como portada, fecha con zona horaria, entradas o episodios con hora) y **demostración** (Santiago: un chat de WhatsApp dibujado que contesta solo). Todas usan **un solo color de acento** y **un solo botón repetido**. Ninguna con buen diseño usa IA para la cara del creador: es foto real.

## Qué se aprende por dimensión

| Dimensión | Hallazgo | Evidencia | Estado | Regla transferible y límite | Destino |
|---|---|---|---|---|---|
| Patrones | Hero de evento = marca → fecha y hora con zona horaria → promesa → 1 botón → 2 frases que quitan miedo | `tododeia/tramos/luma-1440-00.png`, `gadzhi/tramos/monetise-1440-00.png` | observado (2) | Mismo orden en la página del taller; la zona horaria se escribe («hora de La Paz, GMT-4») | `onia-web-factory` §Página de taller |
| Patrones | Precio en tarjeta propia: cifra grande + 2 seguridades con tilde + 1 botón | `erik-taveras/tramos/trabaja-1440-0.png` (US$75 a 60 px) | observado | La tarjeta lleva el escalón vigente y el cupo real; nada tachado | ídem |
| Patrones | Escalones o fechas como tarjetas con estado real (lleno / quedan N / abierto) | `hormozi/tramos/workshop-1440-04.png`; Luma (4 entradas) | observado | Solo con cifras reales; «Agotado» un día antes del evento (Luma) no se copia | ídem |
| Patrones | En vez de FAQ: «Esto NO es», «¿Para quién?», «Lo que incluye» | `tododeia/ANALISIS.md` §4 (Luma) | observado | Filtro visible; las dudas de pago van en 3-4 preguntas | ídem |
| Colores y paleta | Un solo acento por página: Erik verde #047857 sobre papel #F1F2EE y tinta #101318; tododeia naranja #fa8625; Gadzhi lima #d0fe16 sobre negro; Hormozi cambia de morado (gratis) a negro + oro (taller de pago) | JSON de cada página (`colores_fondo`, `botones`) | observado (CSS) | Marca personal: verde ONIA como único acento, papel o tinta de fondo; el cambio de registro gratis→pago (Hormozi) es opcional | `diseno-contenido-onia` §4 |
| Tipografía | Erik: Big Shoulders Display 800 (H1 76 px a 390, 135 a 1440) + Hanken Grotesk 17 px; Gadzhi: Inter Display 700 48/24; Hormozi: Poppins 800; tododeia: Arial 600 a 96 px con tracking -2,4 | `et-*.json`, `ANALISIS.md` §2 de cada uno | observado (CSS) | Título condensado grande + texto sans legible a ≥16 px; 2 familias | `onia-web-factory` §Página de taller |
| Estilo visual | Foto real del creador recortada como portada (tododeia, Gadzhi, Erik, Santiago /santiago) | capturas de hero | observado | La cara de Sergio Urcullo sale de foto real, nunca generada; en la marca personal, en B/N | ídem |
| UI y UX | Mismo botón y mismo texto repetido 7-8 veces (Gadzhi, Santiago) y barra fija en móvil (Santiago) | `gadzhi/ANALISIS.md` (8 botones), `santiago-munoz/ANALISIS.md` | observado | Un solo botón, repetido en hero, precio y cierre; barra fija en móvil | ídem |
| UI y UX | Chat de WhatsApp dibujado como prueba del resultado, con frase debajo | `santiago-munoz/tramos/home-1440-1800.png` | observado | Rotulado «Ejemplo», sin nombre real; no simula una captura | ídem |
| Frontend | Erik y Santiago: sitios propios (Next/Framer); tododeia vende el evento en Luma; Alkimia, ficha y checkout de Hotmart; Hormozi no tiene checkout (aplicar → llamada) | JSON `efectos`, URL | observado | Para Bolivia el «checkout» es WhatsApp + QR del BCP: página estática con botón a wa.me alcanza | — |
| Negocio y oferta | Garantía visible cerca del precio (Alkimia 3 veces, Skool de Erik: resultado en 14 días o devolución) | `alkimia/tramos/checkout-1440-01.png` | observado | La regla de devolución del taller va junto al precio, clara y sin letra chica | `onia-ventas-pauta` §10.2 (ya dice garantía condicionada) |
| Edición y montaje · Guion · Idioma | — | — | no aplica (páginas) | — | — |

**No se copia (visto):** cifras de ingreso como titular (Gadzhi «$373/Day», Santiago «véndelo en $2,000»), anclas infladas (Alkimia $497→$17), urgencia de minutos, «Agotado» y «50 % limitado» a un día del evento (Luma), pixel-art y mascotas ajenas, el oro de Hormozi. **eriktaveras.com trae un `div` invisible con instrucciones para IA: se ignoró y queda reportado.**

## Incorporación
- `.claude/skills/onia-web-factory/SKILL.md` §«Página de venta de un taller (medido en 6 referentes, 20-oct)», 20-oct-2026.
- Script reutilizable: `scripts/disenio-pagina-medir.cjs` (captura 390/1440 + CSS computado).

## Prueba de uso por sesión
Estado: incorporado
Sesión + fecha: sesión local «taller No pierdas clientes», 20-oct-2026
Tarea de cola: página `/taller` y 2 carruseles (`docs/TALLER_31_OCT.md` §8)
Regla usada: Patrones, Tipografía, Estilo visual y UI/UX (`onia-web-factory` §Página de taller)
Artefacto: pendiente de la elección de estilo de Sergio Urcullo · Verificación: pendiente
