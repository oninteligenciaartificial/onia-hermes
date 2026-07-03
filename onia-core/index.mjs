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

export function getEntity(contract, entityId) {
  return contract.entities.find((entity) => entity.id === entityId);
}

export function getCoreEntityIds(contract) {
  return contract.entities.map((entity) => entity.id);
}

export function getCoreCapabilityIds(contract) {
  return getCapabilitiesByLayer(contract, "core").map((capability) => capability.id);
}

export function getAnsweredQuestionIds(contract, layer = "core") {
  const answered = new Set();

  for (const capability of getCapabilitiesByLayer(contract, layer)) {
    for (const questionId of capability.answers) {
      answered.add(questionId);
    }
  }

  return answered;
}

export function getUnansweredQuestions(contract, layer = "core") {
  const answered = getAnsweredQuestionIds(contract, layer);
  return contract.questions.filter((question) => !answered.has(question.id));
}

export function getOrphanEntityIds(contract) {
  const referenced = new Set();

  for (const capability of contract.capabilities) {
    for (const entityId of capability.entityIds) {
      referenced.add(entityId);
    }
  }

  return contract.entities
    .map((entity) => entity.id)
    .filter((entityId) => !referenced.has(entityId));
}

export function getTrackReadiness(contract, trackId) {
  const track = getVerticalTrack(contract, trackId);

  if (!track) {
    return null;
  }

  const required = track.requiredCapabilityIds
    .map((capabilityId) => getCapability(contract, capabilityId))
    .filter(Boolean);

  return {
    trackId: track.id,
    status: track.status,
    requiredCount: required.length,
    coreCount: required.filter((capability) => capability.layer === "core").length,
    moduleCount: required.filter((capability) => capability.layer !== "core").length,
    blockedCount: track.blockedCapabilityIds.length,
  };
}
