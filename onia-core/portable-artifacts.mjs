/*
 * Manifest de artefactos PORTABLES de ONIA Core (anti-drift).
 *
 * Los productos (DentalGest, GestiOS, ...) NO importan @onia/core como paquete
 * npm: son TS/Prisma en repos separados y el core es .mjs en este monorepo. Lo
 * que hacen es PORTAR la logica pura a mano (copiar mjs -> traducir a ts, con un
 * comentario "Origen: @onia/core@<version> <archivo> sha256:<hash>"). Funciona,
 * pero si el core corrige un bug (ej. una tasa fiscal) el producto que copio NO
 * se entera: drift silencioso.
 *
 * Este manifest registra, por cada artefacto portable, el hash actual + la
 * version del core. La receta anti-drift:
 *   - Al portar, el producto guarda el sha256 del manifest en su comentario.
 *   - Para detectar drift: comparar el sha256 guardado vs el del manifest actual.
 *     Distinto = el core cambio ese artefacto -> re-portar.
 *
 * El validador (portable-artifacts.test.mjs / validate) exige que el JSON
 * committeado coincida con los archivos reales, asi que NO puede quedar viejo:
 * si cambias un .logic.mjs sin regenerar el manifest, el test falla.
 *
 * Regenerar:  node onia-core/portable-artifacts.mjs --write
 * Ver:        node onia-core/portable-artifacts.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const oniaCoreDir = dirname(fileURLToPath(import.meta.url));

// Sub-secciones de config de datos que los productos portan de los .json de
// modulo. Se hashea la SUB-SECCION, no el archivo entero: agregar un track a
// accounting.json no debe marcar drift de su bolivianConfig (que no cambio).
const CONFIG_ARTIFACTS = [
  { module: "accounting", jsonKey: "bolivianConfig" },
  { module: "invoicing", jsonKey: "siatConfig" },
  { module: "payroll", jsonKey: "laborConfig" },
  { module: "dental", jsonKey: "clinicalConfig" },
];

// Seeds de datos que un producto puede copiar tal cual.
const SEED_ARTIFACTS = ["modules/accounting.seed.bolivia.json"];

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Serializacion canonica (llaves ordenadas recursivamente) para que el hash de
 * una sub-seccion no dependa del orden de propiedades en el .json.
 */
export function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/** Los .logic.mjs de logic/ y modules/ (lo que los productos re-implementan). */
export function listLogicArtifacts() {
  const artifacts = [];
  for (const dir of ["logic", "modules"]) {
    const full = resolve(oniaCoreDir, dir);
    for (const name of readdirSync(full)) {
      if (name.endsWith(".logic.mjs")) {
        artifacts.push(`${dir}/${name}`);
      }
    }
  }
  return artifacts.sort();
}

export function buildManifest() {
  const contract = JSON.parse(readFileSync(resolve(oniaCoreDir, "contract.json"), "utf8"));
  const artifacts = [];

  for (const rel of listLogicArtifacts()) {
    const content = readFileSync(resolve(oniaCoreDir, rel), "utf8");
    artifacts.push({ id: rel, kind: "logic", path: `onia-core/${rel}`, sha256: sha256(content) });
  }

  for (const { module, jsonKey } of CONFIG_ARTIFACTS) {
    const json = JSON.parse(readFileSync(resolve(oniaCoreDir, `modules/${module}.json`), "utf8"));
    const section = json[jsonKey];
    artifacts.push({
      id: `modules/${module}.json#${jsonKey}`,
      kind: "config",
      path: `onia-core/modules/${module}.json`,
      jsonKey,
      sha256: sha256(canonicalize(section)),
    });
  }

  for (const rel of SEED_ARTIFACTS) {
    const content = readFileSync(resolve(oniaCoreDir, rel), "utf8");
    artifacts.push({ id: rel, kind: "seed", path: `onia-core/${rel}`, sha256: sha256(content) });
  }

  artifacts.sort((a, b) => a.id.localeCompare(b.id));
  return {
    note: "Generado por onia-core/portable-artifacts.mjs. No editar a mano; correr `node onia-core/portable-artifacts.mjs --write`.",
    coreVersion: contract.version,
    artifactCount: artifacts.length,
    artifacts,
  };
}

export function loadManifest() {
  return JSON.parse(readFileSync(resolve(oniaCoreDir, "PORTABLE_ARTIFACTS.json"), "utf8"));
}

/** Diferencias entre el manifest committeado y el estado real de los archivos. */
export function manifestDrift() {
  const current = buildManifest();
  let committed;
  try {
    committed = loadManifest();
  } catch {
    return { missing: true, mismatches: [], current };
  }
  const committedById = new Map(committed.artifacts.map((a) => [a.id, a.sha256]));
  const currentById = new Map(current.artifacts.map((a) => [a.id, a.sha256]));
  const mismatches = [];
  for (const [id, sha] of currentById) {
    if (committedById.get(id) !== sha) {
      mismatches.push({ id, committed: committedById.get(id) ?? null, current: sha });
    }
  }
  for (const id of committedById.keys()) {
    if (!currentById.has(id)) {
      mismatches.push({ id, committed: committedById.get(id), current: null });
    }
  }
  return { missing: false, versionChanged: committed.coreVersion !== current.coreVersion, mismatches, current };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const manifest = buildManifest();
  if (process.argv.includes("--write")) {
    writeFileSync(resolve(oniaCoreDir, "PORTABLE_ARTIFACTS.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    process.stdout.write(`PORTABLE_ARTIFACTS.json escrito: ${manifest.artifactCount} artefactos (core v${manifest.coreVersion}).\n`);
  } else {
    process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
  }
}
