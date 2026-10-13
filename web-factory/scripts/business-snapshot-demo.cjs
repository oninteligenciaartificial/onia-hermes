#!/usr/bin/env node
// OFFLINE ONLY: all fixtures/receipts are synthetic, not actual human approval.
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { build } = require("esbuild");
const factoryRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
function option(name) { const i = args.indexOf(name); if (i < 0 || !args[i + 1]) throw new Error(`Required ${name}`); return path.resolve(args[i + 1]); }
async function main() {
  const platformRoot = option("--platform-root");
  const outputRoot = option("--output");
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), "onia-transport-demo-"));
  globalThis.fetch = () => { throw new Error("Network forbidden in offline demo"); };
  try {
    const platformBundle = path.join(scratch, "platform.cjs");
    const consumerBundle = path.join(scratch, "consumer.cjs");
    await build({ entryPoints: [path.join(platformRoot, "lib/web-requests/business-snapshot.ts")], outfile: platformBundle, bundle: true, platform: "node", format: "cjs", logLevel: "error" });
    await build({ entryPoints: [path.join(factoryRoot, "generate/from-business-snapshot.ts")], outfile: consumerBundle, bundle: true, platform: "node", format: "cjs", logLevel: "error" });
    const platform = require(platformBundle);
    const consumer = require(consumerBundle);
    await fs.mkdir(outputRoot, { recursive: true });
    await fs.writeFile(path.join(outputRoot, "SYNTHETIC-NOT-HUMAN-APPROVAL.txt"), "Offline synthetic confirmed receipts. Data preview only; no live auth binding, DB, AI, design approval or publication.\n");
    const results = [];
    let rejections = 0;
    for (const label of ["A", "B"]) {
      const trusted = { organizationId: `demo-org-${label}`, requestId: `demo-request-${label}`, expectedRevision: 1, project: { slug: "same-dental-slug", template: "landing-clinic", industry: "dental" } };
      const data = { hours: `Hours ${label}: Monday 9–18`, services: [{ description: `Description ${label} confirmed`, title: `Service ${label}` }], contact: label === "A" ? { address: "Address A", email: "a@example.test", whatsapp: "123456789" } : { phone: "987654321" }, businessName: `SYNTHETIC Clinic ${label}` };
      const server = { organizationId: trusted.organizationId, profileId: "synthetic-fixture", now: new Date("2026-10-12T10:00:00Z") };
      const draft = platform.saveBusinessSnapshotDraft(null, { data, expectedRevision: null }, server);
      const confirmed = platform.confirmBusinessSnapshot(draft, { expectedRevision: 1, expectedContentHash: platform.businessSnapshotContentHash(data) }, server);
      // Actual Platform export, actual JSON serialization, actual existing engine.
      const serialized = JSON.stringify(platform.exportBusinessSnapshot(confirmed, trusted));
      const packet = JSON.parse(serialized);
      await fs.writeFile(path.join(outputRoot, `synthetic-${label}.packet.json`), serialized);
      await fs.writeFile(path.join(outputRoot, `synthetic-${label}.trusted-context.json`), JSON.stringify(trusted, null, 2));
      const profile = consumer.profileFromBusinessSnapshot(packet, trusted);
      assert.equal(profile.contacto.horario, data.hours);
      assert.equal(profile.servicios[0].titulo, data.services[0].title);
      const result = await consumer.previewBusinessSnapshot(packet, trusted, path.join(outputRoot, "html"));
      const html = await fs.readFile(path.join(result.outputDir, "index.html"), "utf8");
      for (const text of [data.businessName, data.hours, data.services[0].title, data.services[0].description]) assert.ok(html.includes(text));
      if (label === "B") {
        assert.ok(html.includes("987654321"));
        for (const text of ["Address A", "a@example.test", "Service A", "Hours A", "wa.me/987654321"]) assert.ok(!html.includes(text));
        assert.equal(profile.cta.url, "#contacto");
      } else {
        assert.ok(html.includes("a@example.test"));
        assert.ok(html.includes("Address A"));
      }
      results.push(result);
      const mutations = [
        p => { p.organizationId = "wrong"; }, p => { p.requestId = "wrong"; },
        p => { p.revision = 2; }, p => { p.packageVersion = 2; },
        p => { p.snapshot.version = 2; }, p => { p.snapshot.status = "DRAFT"; p.snapshot.confirmation = null; },
        p => { p.snapshot.data.hours = "tampered"; }, p => { p.snapshot.confirmation.revision = 2; },
        p => { delete p.snapshot.data.hours; p.contentHash = platform.businessSnapshotContentHash(p.snapshot.data); p.snapshot.confirmation.contentHash = p.contentHash; },
      ];
      const rejectRoot = path.join(outputRoot, "rejected-output-must-not-exist");
      for (const mutate of mutations) {
        const bad = JSON.parse(serialized); mutate(bad);
        await assert.rejects(consumer.previewBusinessSnapshot(bad, trusted, rejectRoot)); rejections++;
      }
      for (const patch of [{ organizationId: "wrong" }, { requestId: "wrong" }, { expectedRevision: 2 }]) {
        await assert.rejects(consumer.previewBusinessSnapshot(packet, { ...trusted, ...patch }, rejectRoot)); rejections++;
      }
      await assert.rejects(fs.access(rejectRoot));
      assert.throws(() => platform.exportBusinessSnapshot(draft, trusted));
    }
    assert.notEqual(results[0].outputDir, results[1].outputDir);
    const summary = { label: "SYNTHETIC: not human approval; offline protocol/data preview", engine: "existing buildClientProfileFromIntake + generateSite", packageVersion: 1, source: "Platform #170 base 65ae1326 + export delta; Hermes #198 base 85f4e3b8", cases: results.length, rejectionsBeforeWrite: rejections, outputDirectories: results.map(r => r.outputDir), liveServiceBinding: "CLOSED", publication: false };
    await fs.writeFile(path.join(outputRoot, "summary.json"), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  } finally { await fs.rm(scratch, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
