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
   **Cada plan lleva ventaja Y desventaja (regla Sergio 2026-07-05):** además
   del `resultado`, usar el campo `limite` del generador para decir el tope o
   qué NO incluye — el límite hace creíble la ventaja y empuja el upgrade.
   Si una feature vendida aún no está liberada (ej. inventario detallado Q3,
   SIAT al certificar, bot al verificar Meta), marcar su disponibilidad en el
   texto — nunca venderla como disponible hoy.

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

10. **Direccion visual aprobada.** Usar Bench, Garabato y HSB Engineers como
    benchmark interno de diseno para propuestas, decks y webs. No copiarlos
    literalmente: tomar su jerarquia, limpieza, ritmo, seriedad y foco comercial
    como piso de calidad. Si el cliente exige otro estilo, crear una version
    mejor o mas adecuada desde ese nivel.

11. **Solo datos relevantes.** Cada bloque debe ayudar a vender, decidir,
    entender alcance, entender valor, entender riesgo o avanzar al siguiente
    paso. Eliminar secciones de relleno, promesas vagas, metricas inventadas,
    listas repetidas y texto puesto solo para llenar espacio.

12. **No fabricar.** Si falta dato del cliente (brochure, sector), pedirlo o
    marcarlo. Personalizar con datos reales (cartera, números, sector).

## Secciones v3 del generador (usar cuando suman, no por default)

Campos opcionales de `clientes.json` (data: imágenes +72% cierre, prueba
social +34%, CTA claro convierte lectura en respuesta):

- `imagenes[]` — ambientación editorial o fotos REALES en `propuestas/assets/`.
  NUNCA screenshots falsos de producto. **REGLA (2026-07-05): generar imágenes
  en plataformas externas (Higgsfield, fal.ai, etc.) requiere permiso previo de
  Sergio en cada caso; validar la idea antes de ejecutar; con permiso, usar el
  modelo más barato (nano_banana 1k, no soul_2 2k).**
- `casos[]` — prueba social SOLO con casos reales; vacío hasta tener el caso
  fundador (Bolivian Electric).
- `comparativa` — tabla vs. statu quo (ej. TR4 vs ONIA) ANTES del pricing.
- `proximosPasos[]` + `ctaWhatsapp` — 3 pasos + botón wa.me prefilleado.
- `portada` + `resumenEjecutivo` — solo propuestas enterprise/formales.
- `moneda` — header de precios en USD o mixto.

Roadmap completo: `hermes-content/docs/ONIA_PROPUESTAS_V3_PLAN_20260705.md`
(Fase 2 contenido real, Fase 3 propuesta trackeable en VPS, Fase 4 video QR).

## Comandos

```text
Crea propuesta ONIA: <cliente> | <necesidad>
Perfecciona propuesta: <slug>
Cotiza add-on: <cliente> | <add-on>
Envia propuesta: <slug>  (PDF + mensaje de envío)
```

## Clientes actuales (clientes.json)

bench · garabato · hsb-engineers · lia-albertengo · aw-climatizacion
(+ variantes aw-climatizacion-web / aw-climatizacion-chatbot) · dentalgest ·
onia-empresarial

> `dentalgest` y `onia-empresarial` son propuestas de producto (SaaS/enterprise),
> con precios del catálogo v2 (`onia-core/ONIA_CATALOGO_COMERCIAL_2026.md`).
> Antes de ENVIARLAS, Sergio valida los precios v2 (ítem S1 del plan 2026-07-05);
> el pendiente exacto está en el campo `_todo` de cada cliente en `clientes.json`.
> Propuestas en USD o moneda mixta: usar el campo opcional `moneda` del generador.

## Flujo de envío

1. Generar/actualizar con el generador.
2. Verificar con `generar-propuestas.test.js`.
3. Adjuntar el PDF + mensaje breve (disculpa demora si aplica, qué es, CTA suave).
4. Registrar la oportunidad en el CRM de prospección (ver [crm-prospeccion-onia]).
