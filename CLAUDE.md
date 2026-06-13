# CLAUDE.md — ONIA Hermes

Instrucciones de proyecto para Claude. Override sobre defaults.

## Propuestas comerciales (REGLA)

Toda propuesta a cliente se genera con el sistema en
`hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
Nunca escribir HTML de propuesta a mano.

Cada propuesta DEBE cumplir:

1. **Niveles diferenciados con claridad.** Los 3 paquetes no se distinguen por
   "más páginas" sino por un salto de valor:
   - Nivel 1 = estar online (presencia).
   - Nivel 2 = convertir (captar clientes / briefs / leads).
   - Nivel 3 = automatizar (motor de captación + seguimiento, valor recurrente).
   En `notaPaquetes` explicar la diferencia en una línea.

2. **Resultado por paquete** (`resultado`): cada paquete lleva una frase de
   resultado concreto, no solo qué incluye. Ej: "Convertís tu audiencia en briefs".

3. **Propuesta de valor** (`valor[]`): sección "Por qué te conviene" con el ROI
   real — automatización, conseguir más clientes, ahorro de tiempo, autoridad
   para cerrar cuentas más grandes. No vender "una web", vender resultado.

4. **Dominio + hosting a cargo del cliente**, a su nombre. Nunca en nuestro precio.

5. **Costos de terceros excluidos**: dominio, hosting, comisión pasarela,
   créditos IA, mensajería WhatsApp pagada, pauta.

6. **Add-ons especificados**: conexión redes, videos IA, cuidado web,
   pasarela — cada uno con setup y mensual.
   - **WhatsApp**: el botón click-to-chat va INCLUIDO en la web (simple). Lo que
     se cobra como add-on es el **chatbot IA** (responde, califica, deriva solo) —
     no confundir el botón gratis con el chatbot pago.

7. **Pricing**: cobrar la automatización y el resultado, no los píxeles. El
   margen vive en lo recurrente (Cuidado Web / GestiOS / videos). La web única se
   precia para cerrar y abrir el mensual. Línea estándar: Landing 2,000 / Web Pro
   4,500. Ver `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md`.

8. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos
   plantillas. Objetivo: maximizar producción.

9. **No fabricar.** Si falta dato del cliente (brochure, sector), no inventar —
   pedirlo o marcarlo. Personalizar con datos reales (cartera, números, sector).

Docs internos de referencia: `PRICING_RATIONALE_INTERNO.md`,
`PLAYBOOK_CONSTRUCCION_INTERNO.md`, `ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`,
`BCP_PASARELA_CREDENCIALES_INTERNO.md`.

## Git

- Commits: conventional (`feat:`, `fix:`, `docs:`, etc.).
- Push a `main` solo cuando el usuario lo pida.
