# Video Factory — Implementation Plan (MVP)

> **ARCHIVADO / NO EJECUTAR — 2026-09-22.** Este plan describe el esqueleto de julio que ya
> existe y conserva decisiones superadas (MCP como runtime, costos hardcodeados y ONIA/Sergio
> automáticos). La política vigente está en `HIGGSFIELD_VIDEO_SYSTEM.md`, la spec reevaluada en
> `VIDEO_FACTORY_DESIGN.md` y el estado en
> `handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`. La siguiente implementación real debe usar
> CLI + cotización viva + aprobación + reconciliación; no ejecutar las tareas de este archivo.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Montar el esqueleto declarativo de `video-factory/` (contratos, formatos, lanes, engine base, radar) que produce planes de video validados y los registra en el Video Lab, sin generar todavía.

**Architecture:** Carpeta `video-factory/` mundo-aparte (deps propias). Contratos zod validan todo boundary. El `engine/` arma un plan (formato + lane + modelo + costo estimado) y `track.mjs` es la única escritura de estado hacia `.hermes/video-lab/jobs/`. El motor Higgsfield vive detrás de un adapter con runtime inyectable (MCP en fase 2), así que el MVP no gasta créditos.

**Tech Stack:** Node ESM (`.mjs`), `zod` (validación), `commander` (CLI), `node:test` (test runner nativo, sin deps extra).

**Spec:** `hermes-content/docs/VIDEO_FACTORY_DESIGN.md`

---

## File Structure (MVP)

```
video-factory/
├── package.json                  # deps: zod, commander; script test
├── FACTORY.md                    # frontera + cómo usar
├── skills/README.md              # skills Higgsfield declaradas como dependencia
├── contracts/
│   ├── lane.schema.mjs           # zod: lane + gates
│   ├── format.schema.mjs         # zod: definición de formato
│   ├── intake.schema.mjs         # zod: brief de entrada
│   └── job.schema.mjs            # zod: job (espejo Video Lab + provenance)
├── lanes/
│   ├── cliente.json  onia.json  sergio.json
├── formats/
│   ├── ugc-ad.json  reel-onia.json  sergio-talking-head.json
├── engine/
│   ├── higgsfield/
│   │   ├── model-map.mjs         # mapModel(format) → { model, params }
│   │   └── adapter.mjs           # estimateCost + createHiggsfieldAdapter (runtime inyectable)
│   ├── plan.mjs                  # inputHash + buildPlan
│   └── track.mjs                 # findByHash + writeJob (idempotente) → Video Lab
├── radar/
│   ├── refresh.mjs               # saveSnapshot + latestSnapshot
│   └── snapshots/2026-07-03-*.json
├── data/intakes/demo.json        # intake de ejemplo
├── cli.mjs                       # vf plan | radar
└── test/*.test.mjs
```

Todos los comandos se corren con la Bash tool (POSIX) desde `video-factory/`.

---

### Task 0: Scaffolding

**Files:**
- Create: `video-factory/package.json`
- Create: `video-factory/FACTORY.md`
- Create: `video-factory/skills/README.md`

- [ ] **Step 1: Create `video-factory/package.json`**

```json
{
  "name": "video-factory",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Fábrica de video de ONIA — produce planes y jobs, motor Higgsfield reemplazable.",
  "scripts": {
    "test": "node --test"
  },
  "dependencies": {
    "commander": "^12.1.0",
    "zod": "^3.23.8"
  }
}
```

- [ ] **Step 2: Create `video-factory/FACTORY.md`**

```markdown
# ONIA Video Factory

Fábrica de video para ONIA. Convierte un brief en un plan de pieza validado y lo
registra en el Video Lab del brain. Motor objetivo: Higgsfield CLI + Skills, reemplazable.

## Frontera (CRÍTICO)

- `onia-hermes/` (raíz) = brain: operaciones, Video Lab, CRM, contenido. NO se toca.
- `onia-hermes/video-factory/` (aquí) = producción de media. Mundo aparte, deps propias.
- La fábrica produce y **escribe el estado al Video Lab** (`.hermes/video-lab/jobs/`).
  NO publica, NO toca CRM/finanzas.

## Uso

1. Crear `data/intakes/<slug>.json` (validado por `contracts/intake.schema.mjs`).
2. `node cli.mjs plan --intake data/intakes/<slug>.json` → imprime un plan; su costo histórico no autoriza gasto.
3. La generación real queda bloqueada hasta implementar wrapper CLI, cotización viva y aprobación.

## Lanes

- cliente: gate antes de generar (brief + costo). No publicable sin OK.
- onia: gate de brief + costo + identidad; no publicable.
- sergio: gate de brief + costo + identidad; no publicable.

Ver `../hermes-content/docs/VIDEO_FACTORY_DESIGN.md` para el diseño completo.
```

- [ ] **Step 3: Create `video-factory/skills/README.md`**

```markdown
# Skills Higgsfield (dependencia del motor)

La fábrica envuelve las Skills oficiales de Higgsfield (hechas para Claude Code):

- `higgsfield-generate` — imagen/video/3D/audio en 30+ modelos + Marketing Studio.
- `higgsfield-soul-id` — identidad face-faithful reusable (Sergio).
- `higgsfield-product-photoshoot` — imagen de producto brand-quality.
- `higgsfield-marketplace-cards` — cards de producto / A+ modules.

Repo: https://github.com/higgsfield-ai/skills — instalables con `npx skills add`.
En este entorno también están disponibles como MCP tools (`generate_video`,
`show_marketing_studio`, `personal_clipper_create`, `get_workflow_instructions`).
No reimplementar orquestación: envolver.
```

- [ ] **Step 4: Install deps and verify test runner**

Run: `cd video-factory && npm install && npm test`
Expected: install OK; `node --test` runs with `tests 0` (no test files yet) and exits 0.

- [ ] **Step 5: Commit**

```bash
git add video-factory/package.json video-factory/FACTORY.md video-factory/skills/README.md
git commit -m "feat(video-factory): scaffolding (package, FACTORY.md, skills dep)"
```

---

### Task 1: Contract — lane.schema

**Files:**
- Create: `video-factory/contracts/lane.schema.mjs`
- Test: `video-factory/test/lane.schema.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { laneSchema, parseLane } from "../contracts/lane.schema.mjs";

test("lane válida pasa", () => {
  const lane = { id: "cliente", gate_before_generate: true, require_approved_brief: true, require_cost_estimate: true, identity_gate: false, publishable: false };
  assert.deepEqual(parseLane(lane), lane);
});

test("id fuera de enum falla", () => {
  assert.throws(() => parseLane({ id: "otra", gate_before_generate: false, require_approved_brief: false, require_cost_estimate: false, identity_gate: false, publishable: true }));
});

test("campo booleano faltante falla", () => {
  assert.throws(() => laneSchema.parse({ id: "onia" }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/lane.schema.test.mjs`
Expected: FAIL — `Cannot find module '../contracts/lane.schema.mjs'`

- [ ] **Step 3: Write minimal implementation**

```javascript
import { z } from "zod";

export const laneSchema = z.object({
  id: z.enum(["cliente", "onia", "sergio"]),
  gate_before_generate: z.boolean(),
  require_approved_brief: z.boolean(),
  require_cost_estimate: z.boolean(),
  identity_gate: z.boolean(),
  publishable: z.boolean(),
});

export function parseLane(input) {
  return laneSchema.parse(input);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/lane.schema.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/contracts/lane.schema.mjs video-factory/test/lane.schema.test.mjs
git commit -m "feat(video-factory): lane schema (zod)"
```

---

### Task 2: Contract — format.schema

**Files:**
- Create: `video-factory/contracts/format.schema.mjs`
- Test: `video-factory/test/format.schema.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFormat } from "../contracts/format.schema.mjs";

const valid = {
  id: "reel-onia", engine_model: "seedance_2_0", aspect_ratio: "9:16",
  duration_s: 8, lane: "onia",
  shots: [{ n: 1, description: "Hook" }],
  negative_prompt: "No placeholder text.",
  requires_gate: ["review"], generate_audio: false,
};

test("formato válido pasa y aplica defaults", () => {
  const out = parseFormat(valid);
  assert.equal(out.engine, "higgsfield");
  assert.equal(out.shots[0].n, 1);
});

test("shots vacío falla", () => {
  assert.throws(() => parseFormat({ ...valid, shots: [] }));
});

test("gate desconocido falla", () => {
  assert.throws(() => parseFormat({ ...valid, requires_gate: ["magic"] }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/format.schema.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
import { z } from "zod";

export const shotSchema = z.object({
  n: z.number().int().positive(),
  description: z.string().min(1),
  seconds: z.number().positive().optional(),
});

export const formatSchema = z.object({
  id: z.string().min(1),
  engine: z.literal("higgsfield").default("higgsfield"),
  engine_model: z.string().min(1),
  aspect_ratio: z.enum(["9:16", "16:9", "1:1", "4:3", "3:4", "auto"]),
  duration_s: z.number().positive(),
  lane: z.enum(["cliente", "onia", "sergio"]),
  shots: z.array(shotSchema).min(1),
  hook: z.string().optional(),
  negative_prompt: z.string().min(1),
  requires_gate: z.array(z.enum(["brief", "cost", "identity", "review"])).default([]),
  generate_audio: z.boolean().default(false),
});

export function parseFormat(input) {
  return formatSchema.parse(input);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/format.schema.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/contracts/format.schema.mjs video-factory/test/format.schema.test.mjs
git commit -m "feat(video-factory): format schema (zod)"
```

---

### Task 3: Contract — intake.schema

**Files:**
- Create: `video-factory/contracts/intake.schema.mjs`
- Test: `video-factory/test/intake.schema.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIntake } from "../contracts/intake.schema.mjs";

test("intake mínimo válido aplica defaults", () => {
  const out = parseIntake({ slug: "cafe-luna", lane: "cliente", format: "ugc-ad" });
  assert.deepEqual(out.refs, []);
  assert.equal(out.consent, false);
});

test("lane inválida falla", () => {
  assert.throws(() => parseIntake({ slug: "x", lane: "vip", format: "ugc-ad" }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/intake.schema.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
import { z } from "zod";

export const intakeSchema = z.object({
  slug: z.string().min(1),
  lane: z.enum(["cliente", "onia", "sergio"]),
  format: z.string().min(1),
  negocio: z.string().optional(),
  oferta: z.string().optional(),
  tema: z.string().optional(),
  objetivo: z.string().optional(),
  refs: z.array(z.string()).default([]),
  consent: z.boolean().default(false),
});

export function parseIntake(input) {
  return intakeSchema.parse(input);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/intake.schema.test.mjs`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/contracts/intake.schema.mjs video-factory/test/intake.schema.test.mjs
git commit -m "feat(video-factory): intake schema (zod)"
```

---

### Task 4: Contract — job.schema

**Files:**
- Create: `video-factory/contracts/job.schema.mjs`
- Test: `video-factory/test/job.schema.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJob } from "../contracts/job.schema.mjs";

const base = {
  id: "vf-20260703-001", status: "waiting_approval", format: "reel-onia",
  lane: "onia", model: "seedance_2_0", input_hash: "abc123",
  created_at: "2026-07-03T00:00:00Z", updated_at: "2026-07-03T00:00:00Z",
};

test("job válido aplica defaults", () => {
  const out = parseJob(base);
  assert.deepEqual(out.source_urls, []);
  assert.equal(out.identity_ok, false);
  assert.equal(out.engine, "higgsfield");
});

test("status desconocido falla", () => {
  assert.throws(() => parseJob({ ...base, status: "done" }));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/job.schema.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
import { z } from "zod";

export const jobStatus = z.enum([
  "waiting_approval", "approved_for_generation", "generating", "generated",
  "avatar_review_pending", "needs_revision", "approved_for_publish", "published",
]);

export const jobSchema = z.object({
  id: z.string().min(1),
  status: jobStatus,
  format: z.string().min(1),
  lane: z.enum(["cliente", "onia", "sergio"]),
  engine: z.string().default("higgsfield"),
  model: z.string().min(1),
  credits_estimated: z.number().nonnegative().optional(),
  credits_used: z.number().nonnegative().optional(),
  source_urls: z.array(z.string()).default([]),
  soul_id: z.string().optional(),
  identity_ok: z.boolean().default(false),
  input_hash: z.string().min(1),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

export function parseJob(input) {
  return jobSchema.parse(input);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/job.schema.test.mjs`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/contracts/job.schema.mjs video-factory/test/job.schema.test.mjs
git commit -m "feat(video-factory): job schema (zod)"
```

---

### Task 5: Lanes data + validation test

**Files:**
- Create: `video-factory/lanes/cliente.json`, `onia.json`, `sergio.json`
- Test: `video-factory/test/lanes.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseLane } from "../contracts/lane.schema.mjs";

async function load(id) {
  return parseLane(JSON.parse(await readFile(new URL(`../lanes/${id}.json`, import.meta.url), "utf8")));
}

test("cliente exige gate antes de generar y no es publicable", async () => {
  const l = await load("cliente");
  assert.equal(l.gate_before_generate, true);
  assert.equal(l.publishable, false);
});

test("onia es auto y publicable", async () => {
  const l = await load("onia");
  assert.equal(l.gate_before_generate, false);
  assert.equal(l.publishable, true);
});

test("sergio tiene gate de identidad", async () => {
  const l = await load("sergio");
  assert.equal(l.identity_gate, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/lanes.test.mjs`
Expected: FAIL — `ENOENT` lanes/cliente.json.

- [ ] **Step 3: Create the three lane files**

`video-factory/lanes/cliente.json`:
```json
{
  "id": "cliente",
  "gate_before_generate": true,
  "require_approved_brief": true,
  "require_cost_estimate": true,
  "identity_gate": false,
  "publishable": false
}
```

`video-factory/lanes/onia.json`:
```json
{
  "id": "onia",
  "gate_before_generate": false,
  "require_approved_brief": false,
  "require_cost_estimate": false,
  "identity_gate": false,
  "publishable": true
}
```

`video-factory/lanes/sergio.json`:
```json
{
  "id": "sergio",
  "gate_before_generate": false,
  "require_approved_brief": false,
  "require_cost_estimate": false,
  "identity_gate": true,
  "publishable": true
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/lanes.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/lanes video-factory/test/lanes.test.mjs
git commit -m "feat(video-factory): lanes cliente/onia/sergio con gates"
```

---

### Task 6: Formats data (3 ancla) + validation test

**Files:**
- Create: `video-factory/formats/ugc-ad.json`, `reel-onia.json`, `sergio-talking-head.json`
- Test: `video-factory/test/formats.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseFormat } from "../contracts/format.schema.mjs";

async function load(id) {
  return parseFormat(JSON.parse(await readFile(new URL(`../formats/${id}.json`, import.meta.url), "utf8")));
}

test("ugc-ad es lane cliente con gate brief+cost", async () => {
  const f = await load("ugc-ad");
  assert.equal(f.lane, "cliente");
  assert.ok(f.requires_gate.includes("brief"));
  assert.ok(f.requires_gate.includes("cost"));
});

test("sergio-talking-head exige gate de identidad", async () => {
  const f = await load("sergio-talking-head");
  assert.equal(f.lane, "sergio");
  assert.ok(f.requires_gate.includes("identity"));
});

test("reel-onia es 9:16 seedance", async () => {
  const f = await load("reel-onia");
  assert.equal(f.aspect_ratio, "9:16");
  assert.equal(f.engine_model, "seedance_2_0");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/formats.test.mjs`
Expected: FAIL — `ENOENT` formats/ugc-ad.json.

- [ ] **Step 3: Create the three format files**

`video-factory/formats/ugc-ad.json`:
```json
{
  "id": "ugc-ad",
  "engine": "higgsfield",
  "engine_model": "marketing_studio_video",
  "aspect_ratio": "9:16",
  "duration_s": 15,
  "lane": "cliente",
  "shots": [
    { "n": 1, "description": "Hook: problema del negocio en 2s", "seconds": 3 },
    { "n": 2, "description": "Demo de la oferta/producto en uso", "seconds": 9 },
    { "n": 3, "description": "CTA claro a WhatsApp", "seconds": 3 }
  ],
  "hook": "Interrupción visual en el primer segundo",
  "negative_prompt": "No logos de terceros. No likeness de terceros. No testimonios falsos. No claims financieros engañosos. No placeholder text.",
  "requires_gate": ["brief", "cost", "review"],
  "generate_audio": false
}
```

`video-factory/formats/reel-onia.json`:
```json
{
  "id": "reel-onia",
  "engine": "higgsfield",
  "engine_model": "seedance_2_0",
  "aspect_ratio": "9:16",
  "duration_s": 8,
  "lane": "onia",
  "shots": [
    { "n": 1, "description": "Hook educativo sobre automatización", "seconds": 3 },
    { "n": 2, "description": "Explicación visual clara del concepto", "seconds": 5 }
  ],
  "hook": "Dato o pregunta que frena el scroll",
  "negative_prompt": "No logos de terceros. No testimonios falsos. No claims financieros engañosos. No placeholder text.",
  "requires_gate": ["review"],
  "generate_audio": false
}
```

`video-factory/formats/sergio-talking-head.json`:
```json
{
  "id": "sergio-talking-head",
  "engine": "higgsfield",
  "engine_model": "seedance_2_0",
  "aspect_ratio": "9:16",
  "duration_s": 5,
  "lane": "sergio",
  "shots": [
    { "n": 1, "description": "Still identidad-lock (text2image_soul_v2), revisar antes de animar" },
    { "n": 2, "description": "Motion mínimo: respiración, micro movimiento de cabeza, un parpadeo" }
  ],
  "hook": "Founder directo a cámara",
  "negative_prompt": "No cara de Sergio sin aprobación. No elongación facial, no cuello estirado, no ojos más grandes, no piel de cera, no look CGI. No logos, no watermark, no placeholder text.",
  "requires_gate": ["identity", "review"],
  "generate_audio": false
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/formats.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/formats video-factory/test/formats.test.mjs
git commit -m "feat(video-factory): formatos ancla ugc-ad/reel-onia/sergio-talking-head"
```

---

### Task 7: Engine — model-map

**Files:**
- Create: `video-factory/engine/higgsfield/model-map.mjs`
- Test: `video-factory/test/model-map.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { mapModel } from "../engine/higgsfield/model-map.mjs";

test("marketing_studio_video mapea a modo ugc 720p", () => {
  const { model, params } = mapModel({ engine_model: "marketing_studio_video", aspect_ratio: "9:16", duration_s: 15, generate_audio: false });
  assert.equal(model, "marketing_studio_video");
  assert.equal(params.mode, "ugc");
  assert.equal(params.resolution, "720p");
  assert.equal(params.aspect_ratio, "9:16");
});

test("seedance_2_0 mapea a modo std 720p", () => {
  const { params } = mapModel({ engine_model: "seedance_2_0", aspect_ratio: "9:16", duration_s: 8, generate_audio: false });
  assert.equal(params.mode, "std");
  assert.equal(params.duration, 8);
});

test("modelo sin override conserva params base", () => {
  const { params } = mapModel({ engine_model: "veo3_1_lite", aspect_ratio: "9:16", duration_s: 6, generate_audio: true });
  assert.equal(params.generate_audio, true);
  assert.equal(params.mode, undefined);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/model-map.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
const OVERRIDES = {
  marketing_studio_video: { mode: "ugc", resolution: "720p" },
  seedance_2_0: { mode: "std", resolution: "720p" },
};

export function mapModel(format) {
  const params = {
    aspect_ratio: format.aspect_ratio,
    duration: format.duration_s,
    generate_audio: format.generate_audio,
    ...(OVERRIDES[format.engine_model] ?? {}),
  };
  return { model: format.engine_model, params };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/model-map.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/engine/higgsfield/model-map.mjs video-factory/test/model-map.test.mjs
git commit -m "feat(video-factory): model-map por modelo Higgsfield"
```

---

### Task 8: Engine — adapter (estimateCost + runtime inyectable)

**Files:**
- Create: `video-factory/engine/higgsfield/adapter.mjs`
- Test: `video-factory/test/adapter.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateCost, createHiggsfieldAdapter } from "../engine/higgsfield/adapter.mjs";

test("estimateCost multiplica rate por duración", () => {
  assert.equal(estimateCost({ model: "marketing_studio_video", duration_s: 15 }), 120);
  assert.equal(estimateCost({ model: "seedance_2_0", duration_s: 8 }), 40);
});

test("estimateCost de modelo desconocido lanza", () => {
  assert.throws(() => estimateCost({ model: "no-existe", duration_s: 5 }));
});

test("generate sin runtime no gasta (engine_runtime_required)", async () => {
  const adapter = createHiggsfieldAdapter();
  const out = await adapter.generate({ id: "j1" });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "engine_runtime_required");
});

test("generate con runtime delega", async () => {
  const runtime = { generate: async (job) => ({ ok: true, id: job.id }) };
  const adapter = createHiggsfieldAdapter({ runtime });
  const out = await adapter.generate({ id: "j2" });
  assert.deepEqual(out, { ok: true, id: "j2" });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/adapter.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
const CREDIT_RATE = {
  marketing_studio_video: 8,
  seedance_2_0: 5,
  seedance_2_0_mini: 3,
  veo3_1_lite: 4,
  kling3_0: 9,
};

export function estimateCost({ model, duration_s }) {
  const rate = CREDIT_RATE[model];
  if (rate == null) throw new Error(`estimateCost: modelo desconocido ${model}`);
  return Math.ceil(rate * duration_s);
}

export function createHiggsfieldAdapter({ runtime } = {}) {
  return {
    estimateCost,
    async generate(job) {
      if (!runtime) return { ok: false, reason: "engine_runtime_required", job };
      return runtime.generate(job);
    },
    async getStatus(id) {
      if (!runtime) return { id, status: "unknown", reason: "engine_runtime_required" };
      return runtime.getStatus(id);
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/adapter.test.mjs`
Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/engine/higgsfield/adapter.mjs video-factory/test/adapter.test.mjs
git commit -m "feat(video-factory): adapter Higgsfield (estimateCost + runtime inyectable)"
```

---

### Task 9: Engine — plan (inputHash + buildPlan)

**Files:**
- Create: `video-factory/engine/plan.mjs`
- Test: `video-factory/test/plan.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { inputHash, buildPlan } from "../engine/plan.mjs";

const intake = { slug: "cafe-luna", lane: "cliente", format: "ugc-ad", oferta: "2x1 miércoles", refs: [], consent: false };
const format = { id: "ugc-ad", engine_model: "marketing_studio_video", aspect_ratio: "9:16", duration_s: 15, lane: "cliente", requires_gate: ["brief", "cost", "review"], generate_audio: false };
const lane = { id: "cliente", gate_before_generate: true, require_approved_brief: true, require_cost_estimate: true, identity_gate: false, publishable: false };

test("inputHash es estable y corto", () => {
  assert.equal(inputHash(intake), inputHash({ ...intake }));
  assert.equal(inputHash(intake).length, 16);
});

test("buildPlan calcula costo y respeta gate", () => {
  const plan = buildPlan(intake, format, lane);
  assert.equal(plan.model, "marketing_studio_video");
  assert.equal(plan.credits_estimated, 120);
  assert.equal(plan.gate_before_generate, true);
  assert.equal(plan.input_hash.length, 16);
});

test("buildPlan falla si lane del formato no coincide con intake", () => {
  assert.throws(() => buildPlan({ ...intake, lane: "onia" }, format, lane));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/plan.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
import { createHash } from "node:crypto";
import { mapModel } from "./higgsfield/model-map.mjs";
import { estimateCost } from "./higgsfield/adapter.mjs";

export function inputHash(intake) {
  const json = JSON.stringify({
    slug: intake.slug, format: intake.format, lane: intake.lane,
    tema: intake.tema ?? null, oferta: intake.oferta ?? null,
  });
  return createHash("sha256").update(json).digest("hex").slice(0, 16);
}

export function buildPlan(intake, format, lane) {
  if (format.lane !== intake.lane) {
    throw new Error(`buildPlan: formato ${format.id} es lane ${format.lane}, intake pide ${intake.lane}`);
  }
  const { model, params } = mapModel(format);
  const credits_estimated = estimateCost({ model, duration_s: format.duration_s });
  return {
    slug: intake.slug,
    format: format.id,
    lane: lane.id,
    model,
    params,
    credits_estimated,
    requires_gate: format.requires_gate,
    gate_before_generate: lane.gate_before_generate,
    input_hash: inputHash(intake),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/plan.test.mjs`
Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/engine/plan.mjs video-factory/test/plan.test.mjs
git commit -m "feat(video-factory): buildPlan (modelo + costo + gate + hash)"
```

---

### Task 10: Engine — track (writeJob idempotente → Video Lab)

**Files:**
- Create: `video-factory/engine/track.mjs`
- Test: `video-factory/test/track.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeJob, findByHash } from "../engine/track.mjs";

function job(over = {}) {
  return {
    id: "vf-001", status: "waiting_approval", format: "reel-onia", lane: "onia",
    model: "seedance_2_0", input_hash: "hash-a", created_at: "t", updated_at: "t",
    ...over,
  };
}

test("writeJob escribe y findByHash lo encuentra", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "vl-"));
  const res = await writeJob(job(), dir);
  assert.equal(res.written, true);
  const found = await findByHash("hash-a", dir);
  assert.equal(found.id, "vf-001");
  const raw = JSON.parse(await readFile(path.join(dir, "vf-001.json"), "utf8"));
  assert.equal(raw.status, "waiting_approval");
});

test("no sobrescribe un job ya generated (idempotente)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "vl-"));
  await writeJob(job({ status: "generated" }), dir);
  const res = await writeJob(job({ id: "vf-002", status: "waiting_approval" }), dir);
  assert.equal(res.written, false);
  assert.equal(res.reason, "idempotent_skip");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/track.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```javascript
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { parseJob } from "../contracts/job.schema.mjs";

const DEFAULT_DIR = path.resolve(process.env.VIDEO_LAB_DIR ?? ".hermes/video-lab/jobs");

export async function findByHash(hash, dir = DEFAULT_DIR) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = JSON.parse(await readFile(path.join(dir, f), "utf8"));
    if (raw.input_hash === hash) return raw;
  }
  return null;
}

export async function writeJob(job, dir = DEFAULT_DIR) {
  const valid = parseJob(job);
  const existing = await findByHash(valid.input_hash, dir);
  if (existing && ["generated", "approved_for_publish", "published"].includes(existing.status)) {
    return { written: false, reason: "idempotent_skip", job: existing };
  }
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${valid.id}.json`), JSON.stringify(valid, null, 2) + "\n", "utf8");
  return { written: true, job: valid };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd video-factory && node --test test/track.test.mjs`
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add video-factory/engine/track.mjs video-factory/test/track.test.mjs
git commit -m "feat(video-factory): track writeJob idempotente al Video Lab"
```

---

### Task 11: Radar — snapshot store + snapshot inicial

**Files:**
- Create: `video-factory/radar/refresh.mjs`
- Create: `video-factory/radar/snapshots/2026-07-03-models.json`
- Create: `video-factory/radar/snapshots/2026-07-03-presets.json`
- Test: `video-factory/test/radar.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { saveSnapshot, latestSnapshot } from "../radar/refresh.mjs";

test("saveSnapshot + latestSnapshot roundtrip", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "radar-"));
  await saveSnapshot("models", [{ id: "seedance_2_0" }], { dir, date: new Date("2026-07-01") });
  await saveSnapshot("models", [{ id: "veo3_1" }], { dir, date: new Date("2026-07-03") });
  const latest = await latestSnapshot("models", { dir });
  assert.equal(latest[0].id, "veo3_1");
});

test("latestSnapshot sin datos devuelve null", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "radar-"));
  assert.equal(await latestSnapshot("presets", { dir }), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/radar.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `radar/refresh.mjs`**

```javascript
import { writeFile, readFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SNAP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "snapshots");

export async function saveSnapshot(kind, data, { dir = SNAP_DIR, date = new Date() } = {}) {
  const stamp = date.toISOString().slice(0, 10);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${stamp}-${kind}.json`);
  await writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  return file;
}

export async function latestSnapshot(kind, { dir = SNAP_DIR } = {}) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  const matches = files.filter((f) => f.endsWith(`-${kind}.json`)).sort();
  if (matches.length === 0) return null;
  return JSON.parse(await readFile(path.join(dir, matches.at(-1)), "utf8"));
}
```

- [ ] **Step 4: Create `radar/snapshots/2026-07-03-models.json`**

```json
[
  { "id": "cinematic_studio_3_0", "name": "Cinema Studio Video 3.0", "tags": ["cinematic", "4k"] },
  { "id": "cinematic_studio_video_v2", "name": "Cinema Studio Video", "tags": ["cinematic", "multi-shot"] },
  { "id": "marketing_studio_video", "name": "Marketing Studio", "tags": ["ugc", "ads"] },
  { "id": "clipify", "name": "Personal Clipper", "tags": ["youtube", "clips"] },
  { "id": "higgsfield_preset", "name": "Higgsfield Preset", "tags": ["preset", "viral"] },
  { "id": "seedance_2_0", "name": "Seedance 2.0", "tags": ["reference", "identity", "4k"] },
  { "id": "seedance_2_0_mini", "name": "Seedance 2.0 Mini", "tags": ["fast", "budget"] },
  { "id": "kling3_0", "name": "Kling v3.0", "tags": ["multi-shot", "audio"] },
  { "id": "kling3_0_turbo", "name": "Kling 3.0 Turbo", "tags": ["fast"] },
  { "id": "veo3_1", "name": "Google Veo 3.1", "tags": ["ultra-realistic"] },
  { "id": "veo3_1_lite", "name": "Google Veo 3.1 Lite", "tags": ["fast", "budget"] },
  { "id": "wan2_7", "name": "Wan 2.7", "tags": ["audio", "character"] },
  { "id": "grok_video_v15", "name": "Grok Video 1.5", "tags": ["audio", "cinematic"] },
  { "id": "gemini_omni", "name": "Gemini Omni Flash", "tags": ["audio", "reference"] },
  { "id": "minimax_hailuo", "name": "Minimax Hailuo", "tags": ["physics", "emotion"] }
]
```

- [ ] **Step 5: Create `radar/snapshots/2026-07-03-presets.json`**

```json
[
  { "id": "c292001b-68e6-41af-a3a7-4177fef263e9", "name": "DRIFT RACING" },
  { "id": "6372c588-7ace-48e9-ad4c-6565c2d2f817", "name": "CGI BREAKDOWN" },
  { "id": "d4b067de-0200-490b-a44c-e9c8edac35a0", "name": "2000'S PAPARAZZI" },
  { "id": "66eb1fd6-d795-45c2-babd-a4731180896a", "name": "RED CARPET" },
  { "id": "70d7a995-7864-4776-b616-cc1590c02dab", "name": "ZOMBIE DANCE" },
  { "id": "0b8cb55f-1475-4229-a8ce-974a8f369f2f", "name": "NIGHT VISION" },
  { "id": "f58ed219-84e8-4edc-ac72-a2b63c2af357", "name": "OFFICE CCTV" },
  { "id": "b1335ed5-1829-47aa-8c7f-e4453f8e8f09", "name": "RACE WINNER" }
]
```

Note: the full 40+ preset set is refreshed live from the MCP `presets_show` tool via `saveSnapshot("presets", data)`. This file is a curated seed.

- [ ] **Step 6: Run test to verify it passes**

Run: `cd video-factory && node --test test/radar.test.mjs`
Expected: PASS — 2 tests.

- [ ] **Step 7: Commit**

```bash
git add video-factory/radar
git commit -m "feat(video-factory): radar snapshot store + seed 2026-07-03"
```

---

### Task 12: CLI + demo intake + full test run

**Files:**
- Create: `video-factory/data/intakes/demo.json`
- Create: `video-factory/cli.mjs`
- Test: `video-factory/test/cli.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const run = promisify(execFile);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test("cli plan imprime modelo y costo estimado", async () => {
  const { stdout } = await run("node", ["cli.mjs", "plan", "--intake", "data/intakes/demo.json"], { cwd: root });
  assert.match(stdout, /marketing_studio_video/);
  assert.match(stdout, /credits_estimated/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd video-factory && node --test test/cli.test.mjs`
Expected: FAIL — `ENOENT` cli.mjs / demo.json.

- [ ] **Step 3: Create `data/intakes/demo.json`**

```json
{
  "slug": "cafe-luna",
  "lane": "cliente",
  "format": "ugc-ad",
  "negocio": "Café Luna",
  "oferta": "2x1 en café los miércoles",
  "objetivo": "reservas por WhatsApp",
  "refs": [],
  "consent": false
}
```

- [ ] **Step 4: Write `cli.mjs`**

```javascript
#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Command } from "commander";
import { parseIntake } from "./contracts/intake.schema.mjs";
import { parseFormat } from "./contracts/format.schema.mjs";
import { parseLane } from "./contracts/lane.schema.mjs";
import { buildPlan } from "./engine/plan.mjs";
import { latestSnapshot } from "./radar/refresh.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const readJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), "utf8"));

const program = new Command();
program.name("vf").description("ONIA Video Factory CLI");

program
  .command("plan")
  .requiredOption("--intake <file>", "ruta al intake JSON")
  .action(async (opts) => {
    const intake = parseIntake(await readJson(opts.intake));
    const format = parseFormat(await readJson(`formats/${intake.format}.json`));
    const lane = parseLane(await readJson(`lanes/${intake.lane}.json`));
    const plan = buildPlan(intake, format, lane);
    console.log(JSON.stringify(plan, null, 2));
  });

program
  .command("radar")
  .option("--kind <kind>", "models | presets", "models")
  .action(async (opts) => {
    const snap = await latestSnapshot(opts.kind);
    console.log(JSON.stringify(snap ?? [], null, 2));
  });

program.parseAsync();
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd video-factory && node --test test/cli.test.mjs`
Expected: PASS — 1 test.

- [ ] **Step 6: Run the FULL suite**

Run: `cd video-factory && npm test`
Expected: PASS — all tests across every `test/*.test.mjs` file green.

- [ ] **Step 7: Commit**

```bash
git add video-factory/cli.mjs video-factory/data/intakes/demo.json video-factory/test/cli.test.mjs
git commit -m "feat(video-factory): CLI plan/radar + demo intake"
```

---

## Done Criteria (MVP)

- `cd video-factory && npm test` verde (todas las tareas).
- `node cli.mjs plan --intake data/intakes/demo.json` imprime plan con modelo `marketing_studio_video`, costo estimado y `gate_before_generate: true`.
- `node cli.mjs radar --kind models` imprime el snapshot 2026-07-03.
- Ningún path genera video ni marca `identity_ok` automáticamente (adapter sin runtime = `engine_runtime_required`).

## Fuera de alcance (Fase 2)

- Wrapper CLI real `doctor/quote/submit/poll/reconcile/download/qa` con ledger.
- Formatos: `explainer`, `viral-preset`, `clip-from-long`, `product-showcase`.
- Panel: galería Video Lab en Onia Center + botones Telegram.
- n8n: recordatorios, polling, botones de aprobación; CLI fallback desatendido.
