# Skill: propuestas-comerciales-onia

Usar esta skill cuando Sergio pida crear, cotizar, perfeccionar o enviar una
propuesta comercial a un cliente (web, tienda, sistema, automatización).

## Leer primero

- `hermes-content/propuestas/generador/README.md`
- `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md`
- `hermes-content/propuestas/PLAYBOOK_CONSTRUCCION_INTERNO.md`
- `hermes-content/propuestas/ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`
- `hermes-content/propuestas/BCP_PASARELA_CREDENCIALES_INTERNO.md`
- `hermes-content/docs/ONIA_PRICING_2026.md`

## Regla base

Toda propuesta se genera con el sistema en
`hermes-content/propuestas/generador/` — NUNCA escribir HTML a mano.

```bash
node generar-propuestas.js <slug> --pdf   # un cliente
node generar-propuestas.js --pdf          # todos
node generar-propuestas.test.js           # verificar antes de publicar
```

Cliente nuevo = agregar un objeto a `clientes.json` y correr el generador.

## Cada propuesta DEBE cumplir

1. **Niveles diferenciados por valor, no por páginas:**
   - Nivel 1 = estar online (presencia).
   - Nivel 2 = convertir (captar clientes / briefs / leads).
   - Nivel 3 = automatizar (motor de captación + seguimiento, valor recurrente).
   Explicar la diferencia en una línea en `notaPaquetes`.

2. **Resultado por paquete** (`resultado`): frase de resultado concreto, no solo
   qué incluye. Ej: "Convertís tu audiencia en briefs".

3. **Propuesta de valor** (`valor[]`): sección "Por qué te conviene" con ROI real
   — automatización, conseguir más clientes, ahorro de tiempo, autoridad. No
   vender "una web", vender resultado.

4. **Plazo de entrega** (`plazoEntrega`) visible.

5. **Dominio + hosting a cargo del cliente**, a su nombre. Nunca en el precio.

6. **Costos de terceros excluidos:** dominio, hosting, comisión pasarela,
   créditos IA, mensajería WhatsApp pagada, pauta.

7. **WhatsApp:** el botón click-to-chat va INCLUIDO en la web (simple). Lo que se
   cobra como add-on es el **chatbot IA** (responde, califica, deriva solo).

8. **Pricing:** cobrar la automatización y el resultado, no los píxeles. El margen
   vive en lo recurrente (Cuidado Web / GestiOS / videos). Línea estándar:
   Landing 2,000 / Web Pro 4,500.

9. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos
   plantillas. Maximizar producción.

10. **No fabricar.** Si falta dato del cliente (brochure, sector), pedirlo o
    marcarlo. Personalizar con datos reales (cartera, números, sector).

## Comandos

```text
Crea propuesta ONIA: <cliente> | <necesidad>
Perfecciona propuesta: <slug>
Cotiza add-on: <cliente> | <add-on>
Envia propuesta: <slug>  (PDF + mensaje de envío)
```

## Clientes actuales (clientes.json)

bench · garabato · hsb-engineers · lia-albertengo

## Flujo de envío

1. Generar/actualizar con el generador.
2. Verificar con `generar-propuestas.test.js`.
3. Adjuntar el PDF + mensaje breve (disculpa demora si aplica, qué es, CTA suave).
4. Registrar la oportunidad en el CRM de prospección (ver [crm-prospeccion-onia]).
