/*
 * Loader y helpers de los niveles de tamano de negocio (business-tiers.json).
 * Traduce el catalogo comercial YA DECIDIDO (planes pymes + Empresarial) a
 * datos consultables: que capabilities del core, que modulos y que limites
 * trae cada nivel. Read-only respecto al contrato/modulos.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const oniaCoreDir = dirname(fileURLToPath(import.meta.url));

export function loadBusinessTiers(fileUrl = new URL("./business-tiers.json", import.meta.url)) {
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}

export function getFamily(tiersDoc, familyId) {
  return tiersDoc.families.find((family) => family.id === familyId);
}

export function getTier(tiersDoc, tierId) {
  return tiersDoc.tiers.find((tier) => tier.id === tierId);
}

export function getTiersForFamily(tiersDoc, familyId) {
  return tiersDoc.tiers.filter((tier) => tier.familyId === familyId);
}

export function getFamilyForVerticalTrack(tiersDoc, trackId) {
  return tiersDoc.families.find((family) => (family.appliesToVerticalTracks ?? []).includes(trackId));
}

export function getTiersForVerticalTrack(tiersDoc, trackId) {
  const family = getFamilyForVerticalTrack(tiersDoc, trackId);
  return family ? getTiersForFamily(tiersDoc, family.id) : [];
}

/** Ids de modulo requeridos por un nivel (sin el detalle de "focus"). */
export function moduleIdsForTier(tier) {
  return (tier?.modules ?? []).map((module) => module.id);
}

/**
 * True si un nivel alcanza (>=) los limites de otro: mismo orden que en
 * business-tiers.json. null en un limite significa "sin tope" (siempre alcanza).
 */
export function tierMeetsLimits(tier, required = {}) {
  const limits = tier?.limits ?? {};
  return Object.keys(required).every((key) => {
    const cap = limits[key];
    if (cap === null || cap === undefined) {
      return true; // sin tope
    }
    return cap >= (required[key] ?? 0);
  });
}

/**
 * El nivel MAS CHICO de una familia que alcanza los limites requeridos, en el
 * orden en que aparecen en tiersDoc.tiers (de menor a mayor, tal como esta
 * escrito el catalogo). null si ninguno alcanza.
 */
export function recommendTierForLimits(tiersDoc, familyId, required = {}) {
  const candidates = getTiersForFamily(tiersDoc, familyId);
  return candidates.find((tier) => tierMeetsLimits(tier, required)) ?? null;
}

export const oniaCoreDirname = oniaCoreDir;

function isMainModule() {
  return process.argv[1] && import.meta.url === `file://${resolve(process.argv[1]).replace(/\\/g, "/")}`;
}

if (isMainModule()) {
  const doc = loadBusinessTiers();
  process.stdout.write(`${doc.tiers.map((tier) => tier.id).join(", ")}\n`);
}
