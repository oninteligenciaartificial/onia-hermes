import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { businessSnapshotDataSchema } from "../data/platform-business-snapshot-contract";
import { previewBusinessSnapshot, profileFromBusinessSnapshot } from "./from-business-snapshot";
// Synthetic confirmations exercise the protocol, never authenticate a real approval.
function fixture(label = "A") {
  const data = businessSnapshotDataSchema.parse({ businessName: `SYNTHETIC Clinic ${label}`, contact: label === "A" ? { email: "a@example.test", whatsapp: "123456789", address: "Address A" } : { phone: "987654321" }, services: [{ title: `Service ${label}`, description: `Description ${label}` }], hours: `Hours ${label} 9–18` });
  const contentHash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
  return { packageVersion: 1, organizationId: `org-${label}`, requestId: `request-${label}`, revision: 1, contentHash, snapshot: { version: 1, organizationId: `org-${label}`, revision: 1, editedByProfileId: "synthetic", updatedAt: "2026-10-12T10:00:00Z", status: "CONFIRMED", data, confirmation: { revision: 1, contentHash, confirmedByProfileId: "synthetic", confirmedAt: "2026-10-12T10:01:00Z" } } };
}
const context = (label = "A") => ({ organizationId: `org-${label}`, requestId: `request-${label}`, expectedRevision: 1, project: { slug: "same-slug", template: "landing-clinic" as const, industry: "dental" as const } });
it("complete replacement: B cannot inherit A's email, WhatsApp, address, services or hours", () => {
  const a = profileFromBusinessSnapshot(fixture(), context());
  const b = profileFromBusinessSnapshot(fixture("B"), context("B"));
  expect(a.contacto.email).toBe("a@example.test");
  expect(b.contacto).toEqual({ email: "", tel: "987654321", whatsapp: "", direccion: "", horario: "Hours B 9–18" });
  expect(b.servicios).toEqual([{ titulo: "Service B", desc: "Description B", icono: "sparkles", url: "" }]);
  expect(b.cta.url).toBe("#contacto");
});
it("actual existing engine HTML contains confirmed data in separate request output scopes", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "snapshot-test-"));
  try {
    const a = await previewBusinessSnapshot(fixture(), context(), root);
    const b = await previewBusinessSnapshot(fixture("B"), context("B"), root);
    expect(a.outputDir).not.toBe(b.outputDir);
    const htmlA = await readFile(path.join(a.outputDir, "index.html"), "utf8");
    const htmlB = await readFile(path.join(b.outputDir, "index.html"), "utf8");
    for (const value of ["SYNTHETIC Clinic A", "a@example.test", "Service A", "Description A", "Hours A 9–18", "Address A"]) expect(htmlA).toContain(value);
    for (const value of ["SYNTHETIC Clinic B", "987654321", "Service B", "Description B", "Hours B 9–18"]) expect(htmlB).toContain(value);
    for (const value of ["a@example.test", "Address A", "Service A", "Hours A"]) expect(htmlB).not.toContain(value);
    expect(htmlB).not.toContain("wa.me/987654321");
    expect(b.files.map((file) => path.basename(file))).toEqual(["index.html", "site.css"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});
const invalid = [
  (p: any) => { p.organizationId = "wrong"; },
  (p: any) => { p.snapshot.organizationId = "wrong"; },
  (p: any) => { p.requestId = "wrong"; },
  (p: any) => { p.revision = 2; },
  (p: any) => { p.snapshot.revision = 2; },
  (p: any) => { p.packageVersion = 2; },
  (p: any) => { p.snapshot.version = 2; },
  (p: any) => { p.snapshot.status = "DRAFT"; p.snapshot.confirmation = null; },
  (p: any) => { p.snapshot.data.hours = "Tampered"; },
  (p: any) => { p.snapshot.confirmation.revision = 2; },
  (p: any) => { p.contentHash = "0".repeat(64); },
  (p: any) => { delete p.snapshot.data.hours; const h = createHash("sha256").update(JSON.stringify(businessSnapshotDataSchema.parse(p.snapshot.data))).digest("hex"); p.contentHash = h; p.snapshot.confirmation.contentHash = h; },
  (p: any) => { p.project = { slug: "../../escape" }; },
];
for (const [index, mutate] of invalid.entries()) {
  it(`invalid packet ${index} rejects before any output write`, async () => {
    const root = await mkdtemp(path.join(tmpdir(), "snapshot-reject-"));
    const packet = fixture(); mutate(packet);
    try {
      await expect(previewBusinessSnapshot(packet, context(), root)).rejects.toThrow();
      expect(await readdir(root)).toEqual([]);
    } finally { await rm(root, { recursive: true, force: true }); }
  });
}
it("operator context cannot choose other industry/template or unsafe slug", () => {
  for (const project of [{ slug: "../escape", template: "landing-clinic", industry: "dental" }, { slug: "safe", template: "store", industry: "dental" }, { slug: "safe", template: "landing-clinic", industry: "other" }]) {
    expect(() => profileFromBusinessSnapshot(fixture(), { ...context(), project } as any)).toThrow();
  }
});
