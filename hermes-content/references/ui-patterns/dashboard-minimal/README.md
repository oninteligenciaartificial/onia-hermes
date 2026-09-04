# Panel "Hoy" minimalista (mockup, 2026-09-03)

Pedido de Sergio: "un dashboard para la Onia Platform, minimalista y fácil de entender".

- `index.html`: mockup estático, un solo archivo, sin librerías. Abrir en el navegador.
- `panel-hoy-desktop.png` / `panel-hoy-mobile.png`: capturas renderizadas (Chromium headless).
- Artifact publicado: https://claude.ai/code/artifact/4db50463-d8be-474e-8cc4-68ac22faa9a9

## Decisiones

- **Tres preguntas del dueño y nada más**: qué tengo hoy (agenda, protagonista) · cuánta plata
  (cobrado hoy, 7 barras, por cobrar) · qué me toca decidir (asistente, vencidas, stock).
  Se sacaron del panel actual la fila de 6 KPIs, las facturas como lista aparte y los pendientes
  del equipo: van dentro de "decidir" o no van.
- **Una frase resume el día** antes de cualquier número.
- Lenguaje visual aprobado: base clara, cero sombras, verde en formas (barra "Hoy", punto de la
  cita en curso), texto verde solo `#027650`. Archivo como única familia. Tokens de `globals.css`.
- El asistente **prepara y espera aprobación**; nunca "envía solo" (contract.json:838).
- Vocabulario: es el panel clínico (pack dental), por eso dice "pacientes". Para otro rubro, sale de
  `lib/onboarding/vocabulario.ts`.

## Estado

Mockup, NO está en producción. Construir y publicar son dos permisos distintos: se porta a
`onia-platform/app/(dashboard)/dashboard/` solo con el OK de Sergio sobre ESTA pieza.
