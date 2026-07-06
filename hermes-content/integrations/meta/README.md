# ONIA Meta Ads engine (`@onia/meta-ads`)

Motor de Meta Ads de ONIA: **propone** campañas usando los creativos del motor de
contenido y las manda a una landing de Web Factory (con Pixel). **DRY por
defecto, cero gasto.** Activar una campaña o poner presupuesto pasa por la
aprobación explícita de Sergio.

> Setup de la cuenta Meta (lo hace Sergio): `../../docs/ONIA_META_SETUP_Y_ADS_RUNBOOK.md`.

## Diseño (self-contained, sin dependencias)

CommonJS + builtins de Node + `fetch` global (Node ≥18). Mismo estilo que
`scripts/*.js`. Sin npm install.

```
src/
  config.js        # lee credenciales de env (nunca hardcode); DRY por defecto
  schema.js        # valida specs de campaña (objetivos ODAX)
  build.js         # builders puros -> objetos PAUSED (nunca ACTIVE)
  approval.js      # freno de gasto: cola de aprobación (borrador->Sergio->activa)
  creative-map.js  # creativo del content-engine -> plan de anuncio (a una landing)
  pixel.js         # Pixel base + evento CAPI + dedup por event_id
  client.js        # Marketing API: DRY por defecto; publicar/activar = gated
  index.js         # barrel
test/              # node:assert, 49 tests, cero llamadas a Meta
examples/          # dry-run-demo.js (corre sin credenciales)
```

## Correr

```bash
node test/all.test.js         # 49 tests, cero red, cero gasto
node examples/dry-run-demo.js # arma un borrador completo y lo imprime
```

## Modelo de seguridad (3 capas — cualquiera frena el gasto)

1. **Builders → siempre `PAUSED`.** Un objeto nacido acá no puede ser `ACTIVE`.
2. **DRY por defecto.** Cada write devuelve `{ dryRun, request }` sin tocar la
   red. Publicar a Meta exige `dry:false` **+** `live:true` **+** una aprobación
   de Sergio (`assertActivationAllowed`). `activate()`/`setBudget()` están gateados
   siempre, incluso con `dry:false`.
3. **Físico.** Sin método de pago en la cuenta, Meta no puede cobrar (runbook §2).

Lecturas (`getInsights`) no gastan → no están gateadas.

## Uso (cuando estén las credenciales)

```js
const { MarketingApiClient, mapCreativeToAdPlan, resolveCredentials, isDryDefault } = require('@onia/meta-ads');

const credentials = resolveCredentials(process.env);           // de /root/.hermes/.env
const client = new MarketingApiClient({ credentials, dry: isDryDefault(process.env) });

// 1. creativo del motor de contenido -> plan de anuncio (borrador, a una landing)
const plan = mapCreativeToAdPlan({
  creative,                          // brief del content-engine o { type, image_hash, ... }
  page_id: process.env.META_PAGE_ID,
  destinationUrl: 'https://onia.com.bo/dentalgest',
  pixelId: credentials.pixelId,
  campaignName: 'ONIA · DentalGest · lead',
});

// 2. DRY: devuelve la request, NO publica
const draft = await client.createCampaign({ name: plan.campaign.name, objective: plan.campaign.objective });

// 3. publicar/activar = SOLO con aprobación de Sergio (ver approval.js)
```

## Secretos

Nunca en código ni en git. `.env` server-side del VPS (`/root/.hermes/.env`) o
credencial Header Auth de n8n. Ver `.env.example` y el runbook §6.

## Integra con

- **Motor de contenido** (`content-engine` / Higgsfield): entra como `creative`
  en `mapCreativeToAdPlan`. Acepta el shape de `video-brief-template.json`.
- **Web Factory landings**: el `destinationUrl`. El Pixel va en la landing →
  `PIXEL_LANDING_HANDOFF.md` (lo integra la sesión wf-landing).
- **onia-center + infra**: `HANDOFF.md` (cuando Meta esté verificado).
