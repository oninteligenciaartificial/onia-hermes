# ONIA — Captura de gastos para crédito fiscal / deducción (2026-07-10)

Empieza YA, gratis, sin trámite. Cada gasto bien capturado = plata que NO pagás de impuestos.
Complementa `ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md`. El Agente Finanzas lee estos gastos y
arma la postura fiscal (`finance_summary.tax_posture`).

## Identidad tributaria de ONIA (poné esto en TODOS los billings)

- **Razón social:** LESLIE MERCADO MORENO (empresa unipersonal)
- **NIT:** 5371375010
- **País:** Bolivia · **Cierre fiscal:** diciembre

## Qué hacer en cada herramienta (billing) y qué guardar

| Herramienta | En Billing/Facturación cargar | Guardar cada mes |
|---|---|---|
| **Claude / Anthropic** | Business name: LESLIE MERCADO MORENO · Tax ID/NIT: 5371375010 · dirección Bolivia | Invoice PDF + cargo de tarjeta |
| **ElevenLabs** | Company + Tax ID = mismos datos | Invoice + cargo tarjeta |
| **Higgsfield** | Billing con razón social + NIT | Invoice + cargo tarjeta |
| **Vercel / otros SaaS del exterior** | Business billing + Tax ID | Invoice + cargo tarjeta |
| **Gasto NACIONAL** (internet, alquiler, equipos, servicios) | **exigir FACTURA a NIT 5371375010** | La factura boliviana |

Regla de oro: **si es del exterior, no dan factura boliviana** (no hay crédito IVA, pero se
deduce del IUE reteniendo IUE-BE 12,5%). **Si es nacional, SIEMPRE pedí factura al NIT** (te da
crédito fiscal IVA del 13%). Sin factura nacional = 13% regalado.

## Cómo entra al sistema (mecanismo, ya probado en vivo)

Script en el VPS: `/opt/onia/expense-insert-run.sh` (fuente:
`hermes-content/deploy/vps-ops/expense-insert.mjs`). Registra el gasto + su evidencia (factura)
con los flags fiscales, en estado `pending` (Sergio aprueba en el cierre). Uso:

```bash
EXPENSE_B64="$(printf '%s' '{
  "amount": 200, "moneda": "USD",
  "provider": "Anthropic Claude", "category": "IA",
  "reason": "Claude Code suscripcion mensual",
  "center": "onia_services",
  "hasFactura": false, "esExterior": true, "deducible": true,
  "facturaRef": "INV-123", "spentAt": "2026-07-10"
}' | base64 -w0)" bash /opt/onia/expense-insert-run.sh
```

Campos:
- `amount` (Bs; para USD, usar el importe en Bs del cargo de tarjeta), `moneda`.
- `provider`, `category`, `reason`.
- `center`: `onia_services` (default), `onia_media` (video/creatividad), etc.
- `hasFactura`: true si tenés factura **boliviana** válida (da crédito IVA).
- `esExterior`: true si es proveedor del exterior (sin crédito IVA; gatilla retención IUE-BE 12,5%).
- `deducible`: default true (gasto del negocio).
- `facturaRef`, `spentAt` (YYYY-MM-DD, default hoy).

El script devuelve el impacto fiscal estimado (crédito IVA / crédito perdido / retención IUE-BE).

## Qué calcula el Agente Finanzas con esto

En `finance_summary.tax_posture` (mensual, estimación): IVA crédito, IVA saldo a favor,
**crédito fiscal perdido** (gastos nacionales sin factura), **retenciones IUE-BE** (exterior),
IUE estimado. El panel lo muestra en Finanzas (contrato `ONIA_FINANCE_SUMMARY_CONTRACT.md`).

## Pendiente (bloqueado por dato / trámite de Sergio)
- **Último dígito NIT = 0** ya está; falta confirmar el **calendario de vencimientos** IVA/IT
  (RND SIN vigente) para encender recordatorios — `tax_posture.vencimiento_dia` queda `null` hasta eso.
- **Emisión SIAT en trámite** → mientras, `siat_emitting=false` (sin débito IVA formal; el crédito
  se acumula como saldo a favor). Al activarse, se prende el cálculo de IVA débito/IT sobre ventas.
- Mejora futura: webhook/Telegram para cargar gastos sin SSH (hoy es el script, ya funcional).

> Estimación operativa, no asesoría definitiva. El IUE anual y la aplicación exacta del IUE-BE
> los valida un contador matriculado; ONIA deja todo preparado y trackeado.
