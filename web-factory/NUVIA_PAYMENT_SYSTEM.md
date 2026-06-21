# Nuvia Payment System

Last update: 2026-06-20

## Objective

Prepare Nuvia for real ecommerce checkout without exposing secrets or pretending that payments are active before credentials exist.

The system is provider-ready:

1. The browser keeps the cart UI and sends cart lines to a server endpoint.
2. The server recalculates totals from trusted product data.
3. The server creates an order in Supabase when configured.
4. The server creates a BNB QR Simple payment when BNB credentials are configured.
5. If credentials are missing, the API returns `configuration_pending` with the exact missing variables.

## Files

- Next checkout endpoint: `web-factory/apps/site/src/app/api/nuvia/checkout/route.ts`
- Payment status endpoint: `web-factory/apps/site/src/app/api/nuvia/payments/[paymentId]/status/route.ts`
- Server commerce adapter: `web-factory/apps/site/src/lib/nuvia-commerce.ts`
- Cart UI integration: `web-factory/apps/site/src/components/nuvia/nuvia-store.tsx`
- Styles: `web-factory/apps/site/src/app/globals.css`
- Database migration: `supabase/migrations/20260620_web_factory_nuvia_payments.sql`
- Environment template: `web-factory/.env.example`

## API Contract

### Create checkout

`POST /api/nuvia/checkout`

Request:

```json
{
  "storeSlug": "nuvia",
  "provider": "bnb_qr_simple",
  "items": [
    { "id": "isdin-fusion-water-magic-spf-50", "quantity": 1 }
  ],
  "customer": {
    "name": "",
    "email": "",
    "phone": "",
    "city": "",
    "address": "",
    "notes": ""
  }
}
```

Response modes:

- `payment`: order and payment were created.
- `quote`: at least one product is missing final price.
- `configuration_pending`: the order was calculated, but Supabase and/or BNB credentials are missing.
- `invalid_request`: cart input is invalid.

### Check payment status

`GET /api/nuvia/payments/:paymentId/status`

This reads the stored payment status from Supabase. A real BNB polling/webhook worker must update `web_factory.payments.status` after credentials and official production behavior are confirmed.

## Database

Migration `20260620_web_factory_nuvia_payments.sql` adds:

- `web_factory.orders`
- `web_factory.order_items`
- `web_factory.payment_providers`
- `web_factory.payments`
- `web_factory.payment_events`
- `web_factory.pending_payment_checks`

Seeded providers:

- `bnb_qr_simple`
- `yape_manual`
- `bank_transfer_manual`

RLS is enabled. No public browser policies are added. Browser code must never talk directly to the private Supabase service.

## Required Credentials

Supabase:

```env
WEB_FACTORY_SUPABASE_URL=
WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY=
WEB_FACTORY_SUPABASE_SCHEMA=web_factory
```

BNB:

```env
BNB_ENV=sandbox
BNB_ACCOUNT_ID=
BNB_AUTHORIZATION_ID=
BNB_AUTH_BASE_URL=
BNB_QR_BASE_URL=
BNB_WEBHOOK_SECRET=
```

Fallback channels:

```env
YAPE_BUSINESS_PHONE_OR_QR=
NUVIA_BANK_NAME=
NUVIA_BANK_ACCOUNT=
NUVIA_BANK_ACCOUNT_OWNER=
```

## Activation Steps

1. Apply migrations to the private ONIA Supabase stack.
2. Add Supabase service URL/key to the server environment only.
3. Ask BNB for sandbox credentials for Open Banking / QR Simple.
4. Set BNB environment variables.
5. Create a test checkout from `/nuvia`.
6. Confirm QR generation.
7. Confirm status verification behavior with BNB official docs.
8. Add webhook or scheduled polling to update `web_factory.payments`.
9. Only then show payment as active in production.

## Risk Rules

- Do not collect card data directly.
- Do not expose Supabase service role keys to the browser.
- Do not mark orders as paid from frontend events.
- Do not rely on client subtotal; backend recalculates.
- Do not activate Apple Pay, Google Pay or card payments until a real provider confirms Bolivia support, commissions and settlement.
