import { readFileSync } from "node:fs";

export function loadOniaCoreContract(fileUrl = new URL("./contract.json", import.meta.url)) {
  return JSON.parse(readFileSync(fileUrl, "utf8"));
}
export function getCapabilitiesByLayer(contract, layer) {
  return contract.capabilities.filter((capability) => capability.layer === layer);
}

export function getCapability(contract, capabilityId) {
  return contract.capabilities.find((capability) => capability.id === capabilityId);
}

export function getVerticalTrack(contract, trackId) {
  return contract.verticalTracks.find((track) => track.id === trackId);
}

export function getDistributionTarget(contract, projectId) {
  return contract.distributionTargets.find((target) => target.projectId === projectId);
}

export function isCoreCapability(contract, capabilityId) {
  return getCapability(contract, capabilityId)?.layer === "core";
}

export function getBlockedCapabilitiesForTrack(contract, trackId) {
  const track = getVerticalTrack(contract, trackId);

  if (!track) {
    return [];
  }

  return track.blockedCapabilityIds
    .map((capabilityId) => getCapability(contract, capabilityId))
    .filter(Boolean);
}
