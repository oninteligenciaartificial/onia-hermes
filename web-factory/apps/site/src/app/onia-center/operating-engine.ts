import type { CenterTone, ProjectRecord, RoleId, TaskRecord } from "./types";
import {
  collabIngestionItems,
  collaborators,
  deliverables,
  externalAdapters,
  featureReadinessItems,
  integrationConnectors,
  operatingClients,
  operatingMemberships,
  operatingOrganizations,
  operatingProjectModules,
  operatingProjects,
  operatingTasks,
  reviewQueue,
} from "./operating-source";

const privateProjectLines = new Set<ProjectRecord["productLine"]>(["onia-center", "bolivian"]);

export function getOperatingDashboardSummary() {
  const activeProjects = operatingProjects.filter((project) => project.status === "active").length;
  const pendingReviews = reviewQueue.filter((item) => item.status === "pending").length;
  const openTasks = operatingTasks.filter((task) => !["approved", "blocked"].includes(task.status)).length;
  const blockedTasks = operatingTasks.filter((task) => task.status === "blocked").length;
  const activeClients = operatingClients.filter((client) => client.status === "active").length;
  const leads = operatingClients.filter((client) => client.status === "lead").length;
  const collabQueued = collabIngestionItems.filter((item) => item.status === "queued").length;
  const adapterRisks = externalAdapters.filter((adapter) => ["blocked", "audit_required"].includes(adapter.status)).length;

  return {
    organizations: operatingOrganizations.length,
    activeProjects,
    openTasks,
    pendingReviews,
    blockedTasks,
    activeClients,
    leads,
    collaborators: collaborators.length,
    deliverables: deliverables.length,
    collabQueued,
    adapterRisks,
    alerts: pendingReviews + blockedTasks + adapterRisks,
  };
}

export function getVisibleProjects(role: RoleId) {
  if (role === "sergio") {
    return operatingProjects;
  }

  return operatingProjects.filter((project) => !project.privateStrategy && !privateProjectLines.has(project.productLine));
}

export function getVisibleTasks(role: RoleId) {
  if (role === "sergio") {
    return operatingTasks;
  }

  return operatingTasks.filter((task) => !task.sensitive && task.assignedRole === role);
}

export function getVisibleReviews(role: RoleId) {
  if (role === "sergio") {
    return reviewQueue;
  }

  return reviewQueue.filter((item) => !item.sensitive && item.reviewerRole === role);
}

export function getCollabSafetySummary() {
  const sensitive = collabIngestionItems.filter((item) => item.sensitivity === "sensitive").length;
  const rejected = collabIngestionItems.filter((item) => item.status === "rejected").length;
  const importable = collabIngestionItems.filter((item) =>
    item.status === "approved" || item.status === "imported",
  ).length;

  return {
    queued: collabIngestionItems.filter((item) => item.status === "queued").length,
    sensitive,
    rejected,
    importable,
    rule:
      "Todo aporte de onia-hermes-collab entra como cola: clasificar, redactorizar, aprobar o rechazar antes de importar.",
  };
}

export function getBolivianModuleSummary() {
  const project = operatingProjects.find((item) => item.id === "project-bolivian-os");
  const modules = operatingProjectModules.filter((module) => module.projectId === "project-bolivian-os");
  const blocked = modules.filter((module) => module.status === "blocked").length;

  return {
    project,
    modules,
    blocked,
    tr4Rule:
      "TR4 es adaptador externo: primero exportacion/importacion manual, sin credenciales, sin escritura y sin prometer tiempo real.",
  };
}

export function getAdapterSummary() {
  return {
    total: externalAdapters.length,
    blocked: externalAdapters.filter((adapter) => adapter.status === "blocked").length,
    auditRequired: externalAdapters.filter((adapter) => adapter.status === "audit_required").length,
    writable: externalAdapters.filter((adapter) => adapter.writeAllowed).length,
  };
}

export function getIntegrationReadinessSummary() {
  return {
    total: integrationConnectors.length,
    connected: integrationConnectors.filter((connector) => connector.status === "connected").length,
    ready: integrationConnectors.filter((connector) => connector.status === "ready").length,
    configPending: integrationConnectors.filter((connector) => connector.status === "config_pending").length,
    planned: integrationConnectors.filter((connector) => connector.status === "planned").length,
    blocked: integrationConnectors.filter((connector) => connector.status === "blocked").length,
    manualOnly: integrationConnectors.filter((connector) => connector.status === "manual_only").length,
    highPriority: integrationConnectors.filter((connector) => connector.priority === "alta").length,
  };
}

export function getFeatureReadinessSummary() {
  return {
    total: featureReadinessItems.length,
    readyToUse: featureReadinessItems.filter((item) => item.status === "ready_to_use").length,
    prepared: featureReadinessItems.filter((item) => item.status === "prepared_pending_connection").length,
    planned: featureReadinessItems.filter((item) => item.status === "planned").length,
    blocked: featureReadinessItems.filter((item) => item.status === "blocked").length,
  };
}

export function getIntegrationTone(status: (typeof integrationConnectors)[number]["status"]): CenterTone {
  if (status === "connected" || status === "ready") {
    return "green";
  }

  if (status === "config_pending" || status === "manual_only") {
    return "yellow";
  }

  if (status === "blocked") {
    return "red";
  }

  return "blue";
}

export function getFeatureTone(status: (typeof featureReadinessItems)[number]["status"]): CenterTone {
  if (status === "ready_to_use") {
    return "green";
  }

  if (status === "prepared_pending_connection") {
    return "yellow";
  }

  if (status === "blocked") {
    return "red";
  }

  return "blue";
}

export function getMembershipSummary(role: RoleId) {
  const memberships = operatingMemberships.filter((membership) => membership.role === role);
  const sensitiveAccess = memberships.some((membership) => membership.canViewSensitive);

  return {
    memberships,
    sensitiveAccess,
    scopeLabel: sensitiveAccess ? "privado Sergio" : "restringido",
  };
}

export function getTaskStatusTone(status: TaskRecord["status"]): CenterTone {
  if (status === "approved") {
    return "green";
  }

  if (status === "blocked") {
    return "red";
  }

  if (status === "review") {
    return "yellow";
  }

  return "blue";
}
