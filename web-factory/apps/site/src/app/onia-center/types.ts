export type CenterTone = "green" | "yellow" | "red" | "blue" | "neutral";

export type RoleId = "sergio" | "area" | "arthur" | "seller" | "freelancer";

export type AccountingCenterId =
  | "onia-services"
  | "onia-fund"
  | "nuvia"
  | "nuvia-reserve"
  | "onia-media"
  | "sergio-owner-income"
  | "arthur-variable";

export type RoleDefinition = {
  id: RoleId;
  level: number;
  title: string;
  description: string;
  can: string[];
  cannot: string[];
  privateAccess: boolean;
};

export type PermissionKey =
  | "view_private_capital"
  | "view_internal_profit"
  | "approve_payments"
  | "approve_discounts"
  | "approve_expenses"
  | "approve_premium_tools"
  | "approve_nuvia_distribution"
  | "approve_own_commission"
  | "contact_sensitive_clients"
  | "act_as_partner";

export type RolePermission = {
  roleId: RoleId;
  permission: PermissionKey;
  allowed: boolean;
  reason: string;
};

export type AccountingCenter = {
  id: AccountingCenterId;
  name: string;
  owner: string;
  rule: string;
  visibility: RoleId[];
  tone: CenterTone;
};

export type OperationalService = {
  id: string;
  name: string;
  plan: string;
  priority: number;
  source: string;
  setupPriceBs?: number;
  monthlyPriceBs?: number | null;
  isRecurring: boolean;
  accountingCenter?: AccountingCenterId;
  oniaFundPercent?: number;
  excludedCosts?: string[];
  premiumToolLimit?: string;
  includes?: string[];
  notIncluded?: string[];
  deliverables?: string[];
  sla?: string;
  deliveryOwner?: string;
  requiresApproval?: string[];
  evidenceRequired?: string[];
  sellerCommission?: string;
  arthurVariable?: string;
  minimumMargin?: string;
  risk?: string;
  weeklyCapacity?: string;
  quoteTemplate?: string;
  salesScript?: string;
  closeChecklist?: string[];
  deliveryChecklist?: string[];
};

export type ServiceValidation = {
  serviceId: string;
  canSell: boolean;
  missing: string[];
};

export type LeadRecord = {
  id: string;
  companyName: string;
  businessType: string;
  city?: string;
  channel: string;
  source?: string;
  contactPermission: "approved" | "pending" | "no_contact";
  ownerRole: RoleId;
  pipelineStatus: string;
  suggestedServiceId?: string;
  priority: "alta" | "media" | "baja";
  painPoint?: string;
  nextFollowup?: string;
  dataComplete: boolean;
  evidenceIds: string[];
};

export type IncomeRecord = {
  id: string;
  serviceId: string;
  centerId: AccountingCenterId;
  leadId?: string;
  sellerRole?: RoleId;
  grossAmountBs: number;
  externalCostsBs: number;
  discountsBs: number;
  refundsBs: number;
  paymentReference?: string;
  evidenceId?: string;
  paidAt: string;
};

export type ExpenseRecord = {
  id: string;
  centerId?: AccountingCenterId;
  ownerRole: RoleId;
  amountBs: number;
  category: string;
  reason: string;
  evidenceId?: string;
  status: "pending" | "approved" | "rejected" | "reimbursed";
  approvedBy?: RoleId;
};

export type EvidenceRecord = {
  id: string;
  centerId: AccountingCenterId;
  actorRole: RoleId;
  type:
    | "crm"
    | "call"
    | "message"
    | "payment"
    | "delivery"
    | "cost"
    | "content"
    | "training"
    | "system"
    | "approval"
    | "premium_use";
  title: string;
  proofReference?: string;
  status: "pending" | "approved" | "rejected" | "retained";
  approvedBy?: RoleId;
};

export type ArthurScorecardItem = {
  id: string;
  area: string;
  minimum: string;
  required: boolean;
};

export type EvidenceGate = {
  id: string;
  title: string;
  requiredProof: string;
  blocks: string;
  owner: string;
};

export type NuviaLotInput = {
  salesCollectedBs: number;
  productCapitalRecoveryBs: number;
  packagingLogisticsBs: number;
  transportBs: number;
  adsBs: number;
  premiumToolsBs: number;
  externalProductionBs: number;
  refundsAndFeesBs: number;
  arthurVariableRate: number;
  evidenceComplete: boolean;
  sergioApproved: boolean;
};

export type NuviaLotRecord = NuviaLotInput & {
  id: string;
  lotName: string;
  sergioCapitalBs: number;
  arthurCapitalBs: number;
  evidenceId?: string;
};

export type PaymentInput = {
  role: "seller" | "arthur";
  setupNetCollectedBs: number;
  firstMonthNetCollectedBs: number;
  evidenceComplete: boolean;
  sergioApproved: boolean;
  claimsOrRefundsBs: number;
  arthurSetupRate?: number;
  arthurFirstMonthRate?: number;
};

export type CommissionRecord = PaymentInput & {
  id: string;
  centerId: AccountingCenterId;
  evidenceId?: string;
  status: "estimated" | "pending" | "approved" | "paid" | "blocked" | "discounted";
  approvedBy?: RoleId;
};

export type PremiumToolPolicy = {
  id: string;
  center: string;
  allocation: string;
  rule: string;
  visibility: RoleId[];
};

export type PremiumToolUsage = {
  id: string;
  centerId?: AccountingCenterId;
  actorRole: RoleId;
  toolName: string;
  usageReason: string;
  briefReference?: string;
  costBs: number;
  evidenceId?: string;
  status: "pending" | "approved" | "rejected" | "charged_to_center";
  approvedBy?: RoleId;
};

export type BusinessRuleResult = {
  id: string;
  label: string;
  passed: boolean;
  severity: "blocker" | "warning" | "ok";
  detail: string;
};

export type DataModelTable = {
  name: string;
  purpose: string;
  requiredForPhase: 1 | 2 | 3;
  implementedInSql: boolean;
  implementedInApp: boolean;
};

export type VisibilityScope =
  | "sergio_private"
  | "internal_restricted"
  | "collab_safe"
  | "seller_basic"
  | "freelancer_task"
  | "client_workspace";

export type OrganizationKind = "internal" | "client" | "collab" | "sandbox";

export type OrganizationRecord = {
  id: string;
  name: string;
  kind: OrganizationKind;
  visibility: VisibilityScope;
  ownerRole: RoleId;
  status: "active" | "setup" | "paused" | "archived";
  modules: string[];
  rule: string;
};

export type UserProfileRecord = {
  id: string;
  displayName: string;
  primaryRole: RoleId;
  status: "active" | "invited" | "blocked";
  accessNote: string;
};

export type MembershipRecord = {
  id: string;
  organizationId: string;
  userId: string;
  role: RoleId;
  canViewSensitive: boolean;
  scope: VisibilityScope;
};

export type ClientRecord = {
  id: string;
  organizationId: string;
  name: string;
  industry: string;
  city?: string;
  status: "lead" | "active" | "paused" | "archived";
  ownerRole: RoleId;
  sensitivity: "normal" | "sensitive" | "private";
};

export type ProjectStatus = "planning" | "active" | "review" | "blocked" | "paused" | "archived";

export type ProjectRecord = {
  id: string;
  organizationId: string;
  clientId?: string;
  name: string;
  productLine:
    | "onia-center"
    | "dentagest"
    | "gestios"
    | "webs"
    | "chatbots"
    | "automations"
    | "bolivian"
    | "content"
    | "stockcam";
  status: ProjectStatus;
  priority: "alta" | "media" | "baja";
  ownerRole: RoleId;
  privateStrategy: boolean;
  description: string;
  nextStep: string;
  modules: string[];
};

export type ProjectModuleRecord = {
  id: string;
  projectId: string;
  name: string;
  moduleType:
    | "crm"
    | "tasks"
    | "inventory_camera"
    | "knowledge"
    | "content"
    | "dashboard"
    | "finance"
    | "adapter"
    | "roadmap"
    | "processes";
  status: "planned" | "in_progress" | "ready" | "blocked";
  reusableCore: boolean;
  note: string;
};

export type TaskRecord = {
  id: string;
  projectId: string;
  title: string;
  type: "lead" | "brief" | "delivery" | "review" | "content" | "bolivian" | "system" | "blocker";
  status: "todo" | "in_progress" | "review" | "approved" | "blocked";
  priority: "alta" | "media" | "baja";
  assignedRole: RoleId;
  reviewerRole: RoleId;
  evidenceRequired: boolean;
  sensitive: boolean;
  source: "onia-center" | "onia-hermes" | "onia-hermes-collab" | "notion" | "external";
  dueLabel?: string;
};

export type CollaboratorRecord = {
  id: string;
  userId: string;
  displayName: string;
  role: RoleId;
  status: "trial" | "active" | "paused" | "blocked";
  allowedWork: string[];
  restrictions: string[];
};

export type DeliverableRecord = {
  id: string;
  taskId: string;
  collaboratorId: string;
  title: string;
  status: "draft" | "submitted" | "changes_requested" | "approved" | "rejected";
  evidenceReference?: string;
  reviewedBy?: RoleId;
  sensitive: boolean;
};

export type CollabIngestionClassification =
  | "lead"
  | "brief"
  | "task"
  | "content"
  | "bolivian"
  | "blocker"
  | "code"
  | "doc"
  | "other";

export type CollabIngestionItem = {
  id: string;
  sourceRepo: "onia-hermes-collab";
  sourcePath: string;
  authorUserId: string;
  classification: CollabIngestionClassification;
  sensitivity: "public_safe" | "internal" | "sensitive" | "rejected";
  status: "queued" | "approved" | "rejected" | "imported" | "redacted";
  summary: string;
  target?: string;
  reviewerRole?: RoleId;
};

export type ReviewQueueItem = {
  id: string;
  sourceType: "collab_ingestion" | "deliverable" | "lead" | "project" | "expense" | "premium";
  sourceId: string;
  title: string;
  priority: "alta" | "media" | "baja";
  status: "pending" | "approved" | "rejected" | "needs_changes";
  reviewerRole: RoleId;
  sensitive: boolean;
};

export type KnowledgeItem = {
  id: string;
  organizationId: string;
  projectId?: string;
  title: string;
  category: "process" | "sales" | "support" | "training" | "policy" | "technical";
  sensitivity: VisibilityScope;
  status: "draft" | "approved" | "archived";
};

export type ContentAsset = {
  id: string;
  projectId: string;
  title: string;
  channel: "instagram" | "whatsapp" | "web" | "telegram" | "internal";
  status: "idea" | "draft" | "review" | "approved" | "published";
  publicSafe: boolean;
};

export type IdeaReviewTool = "codex" | "claude" | "self_hosted" | "manual";

export type IdeaVisibilityScope = "sergio_private" | "assigned_only" | "team_safe";

export type IdeaInboxRecord = {
  id: string;
  title: string;
  sourceType: "instagram" | "tiktok" | "youtube" | "web" | "cliente" | "otro";
  sourceUrl?: string;
  category: "contenido" | "venta" | "producto" | "automatizacion" | "bolivian" | "web" | "chatbot" | "operacion";
  summary: string;
  whyUseful: string;
  targetProjectId: string;
  ownerRole: RoleId;
  visibility: IdeaVisibilityScope;
  reviewTool: IdeaReviewTool;
  status: "inbox" | "queued" | "reviewed" | "approved" | "archived";
};

export type AccessPolicyRecord = {
  id: string;
  roleId: RoleId;
  entityType: "lead" | "task" | "idea" | "review" | "finance" | "project" | "evidence";
  visibleScopes: IdeaVisibilityScope[] | VisibilityScope[];
  canCreate: boolean;
  canUpdateAssigned: boolean;
  canApprove: boolean;
  rule: string;
};

export type InventoryItem = {
  id: string;
  organizationId: string;
  projectId?: string;
  name: string;
  sku?: string;
  location?: string;
  expectedQty?: number;
  countedQty?: number;
  cameraRequired: boolean;
  status: "draft" | "counted" | "difference" | "approved";
};

export type ExternalAdapter = {
  id: string;
  name: string;
  systemType: "collab_repo" | "erp" | "notion" | "n8n" | "whatsapp" | "calendar" | "camera" | "github";
  organizationId?: string;
  projectId?: string;
  mode: "manual_review" | "manual_export" | "importer" | "scraping" | "api" | "database" | "sync";
  status: "planned" | "audit_required" | "ready" | "blocked" | "approved";
  writeAllowed: boolean;
  rule: string;
};

export type AuditLogEntry = {
  id: string;
  actorRole: RoleId;
  action: string;
  entity: string;
  sensitivity: VisibilityScope;
  summary: string;
};
