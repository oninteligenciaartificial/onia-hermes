import type {
  AccountingCenter,
  BusinessRuleResult,
  CommissionRecord,
  ExpenseRecord,
  IncomeRecord,
  NuviaLotRecord,
  OperationalService,
  PaymentInput,
  PremiumToolUsage,
  RoleId,
} from "./types";
import {
  accountingCenters,
  commissionSeed,
  evidenceSeed,
  expenseSeed,
  incomeSeed,
  nuviaLotsSeed,
  nuviaExample,
  operationalServices,
  premiumUsageSeed,
  privateCapital,
  rolePermissions,
  sustainabilityTargets,
  vendorCommissionRules,
} from "./source";

export const serviceRequiredFields = [
  { key: "setupPriceBs", label: "precio setup" },
  { key: "monthlyPriceBs", label: "precio mensual si aplica", recurringOnly: true },
  { key: "accountingCenter", label: "centro contable" },
  { key: "excludedCosts", label: "costos excluidos" },
  { key: "evidenceRequired", label: "evidencia requerida" },
  { key: "deliveryOwner", label: "responsable de entrega" },
  { key: "premiumToolLimit", label: "limite herramientas premium" },
  { key: "commissionOrVariable", label: "comision o pago aprobado" },
  { key: "minimumMargin", label: "margen minimo" },
  { key: "closeChecklist", label: "checklist de cierre" },
  { key: "deliveryChecklist", label: "checklist de entrega" },
] as const;

const blockedTextPattern = /pendiente|por definir|no definido/i;

export function formatBs(value: number, options: { compact?: boolean } = {}) {
  const maximumFractionDigits = options.compact && Number.isInteger(value) ? 0 : 2;

  return `Bs. ${new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value)}`;
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function hasUsableValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 && !value.some((item) => typeof item === "string" && blockedTextPattern.test(item));
  }

  if (typeof value === "string") {
    return value.trim().length > 0 && !blockedTextPattern.test(value);
  }

  return value !== undefined && value !== null;
}

export function validateOperationalService(service: OperationalService) {
  const missing: string[] = [];

  for (const field of serviceRequiredFields) {
    if ("recurringOnly" in field && field.recurringOnly && !service.isRecurring) {
      continue;
    }

    if (field.key === "commissionOrVariable") {
      if (!hasUsableValue(service.sellerCommission) && !hasUsableValue(service.arthurVariable)) {
        missing.push(field.label);
      }
      continue;
    }

    const value = service[field.key as keyof OperationalService];
    if (!hasUsableValue(value)) {
      missing.push(field.label);
    }
  }

  return {
    serviceId: service.id,
    canSell: missing.length === 0,
    missing,
  };
}

export const serviceValidations = operationalServices.map(validateOperationalService);

export function getServiceValidation(serviceId: string) {
  return serviceValidations.find((validation) => validation.serviceId === serviceId);
}

export function calculateSustainability() {
  const monthlyNetSalesBs = sustainabilityTargets.registeredMonthlyNetSalesBs;
  const oniaFundAccumulatedBs = monthlyNetSalesBs * (sustainabilityTargets.servicesFundPercent / 100);
  const missingForMonthlyNeedBs = Math.max(
    0,
    sustainabilityTargets.conservativeMonthlyNeedBs - oniaFundAccumulatedBs,
  );
  const monthlySalesProgressPercent =
    sustainabilityTargets.requiredMonthlyNetSalesBs > 0
      ? (monthlyNetSalesBs / sustainabilityTargets.requiredMonthlyNetSalesBs) * 100
      : 0;
  const fundProgressPercent =
    sustainabilityTargets.conservativeMonthlyNeedBs > 0
      ? (oniaFundAccumulatedBs / sustainabilityTargets.conservativeMonthlyNeedBs) * 100
      : 0;
  const runwayMonths = privateCapital.estimatedCashAfterDebtBs / sustainabilityTargets.conservativeMonthlyNeedBs;

  return {
    monthlyNetSalesBs,
    oniaFundAccumulatedBs,
    missingForMonthlyNeedBs,
    monthlySalesProgressPercent,
    fundProgressPercent,
    runwayMonths,
    salesStatus: monthlyNetSalesBs >= sustainabilityTargets.requiredMonthlyNetSalesBs ? "green" : monthlyNetSalesBs > 0 ? "yellow" : "red",
    runwayStatus: runwayMonths >= 2 ? "green" : runwayMonths >= 1 ? "yellow" : "red",
  } as const;
}

export function calculateGrowthTarget() {
  const monthlyRevenueBs =
    sustainabilityTargets.growthActiveClientsTarget *
    (operationalServices.find((service) => service.id === "onia-motor-local-growth")?.monthlyPriceBs ?? 0);
  const fundBs = monthlyRevenueBs * (sustainabilityTargets.servicesFundPercent / 100);

  return {
    activeClients: sustainabilityTargets.growthActiveClientsTarget,
    monthlyRevenueBs,
    fundBs,
    coversMonthlyNeed: fundBs >= sustainabilityTargets.conservativeMonthlyNeedBs,
  };
}

export function getVisibleCenters(role: RoleId): AccountingCenter[] {
  return accountingCenters.filter((center) => center.visibility.includes(role));
}

export function getVisibleVendorCommissionRules(role: RoleId) {
  return vendorCommissionRules.filter((rule) => rule.visibility.includes(role));
}

export function canSeePrivateCapital(role: RoleId) {
  return role === "sergio";
}

export function hasPermission(role: RoleId, permission: string) {
  const explicit = rolePermissions.find((item) => item.roleId === role && item.permission === permission);

  if (explicit) {
    return explicit.allowed;
  }

  return role === "sergio";
}

export function canViewPrivateField(role: RoleId, field: "capital" | "exact_debt" | "internal_profit" | "capital_recovery" | "full_cash") {
  if (role === "sergio") {
    return true;
  }

  return !["capital", "exact_debt", "internal_profit", "capital_recovery", "full_cash"].includes(field);
}

export function calculateIncomeNet(input: IncomeRecord) {
  return input.grossAmountBs - input.externalCostsBs - input.discountsBs - input.refundsBs;
}

export function validateExpense(input: ExpenseRecord): BusinessRuleResult {
  const hasCenter = Boolean(input.centerId);
  const approvedBySergio = input.status !== "approved" || input.approvedBy === "sergio";
  const hasEvidenceWhenApproved = input.status !== "approved" || Boolean(input.evidenceId);

  if (!hasCenter) {
    return {
      id: `expense-${input.id}`,
      label: "No gasto sin centro contable",
      passed: false,
      severity: "blocker",
      detail: "El gasto no puede aprobarse ni registrarse como operativo sin centro contable.",
    };
  }

  if (!approvedBySergio || !hasEvidenceWhenApproved) {
    return {
      id: `expense-${input.id}`,
      label: "Gasto requiere evidencia y Sergio",
      passed: false,
      severity: "blocker",
      detail: "Un gasto aprobado necesita evidencia y aprobacion final de Sergio.",
    };
  }

  return {
    id: `expense-${input.id}`,
    label: "Gasto con centro",
    passed: true,
    severity: "ok",
    detail: "El gasto tiene centro contable y respeta aprobacion.",
  };
}

export function validateCommission(input: CommissionRecord): BusinessRuleResult {
  const hasEvidence = Boolean(input.evidenceId) && evidenceSeed.some((evidence) => evidence.id === input.evidenceId && evidence.status === "approved");
  const approvedBySergio = input.status !== "approved" || input.approvedBy === "sergio";

  if (!hasEvidence) {
    return {
      id: `commission-${input.id}`,
      label: "No comision sin evidencia",
      passed: false,
      severity: "blocker",
      detail: "La comision queda bloqueada hasta tener evidencia aprobada.",
    };
  }

  if (!approvedBySergio) {
    return {
      id: `commission-${input.id}`,
      label: "No pago sin aprobacion Sergio",
      passed: false,
      severity: "blocker",
      detail: "Ningun pago puede aprobarse sin Sergio.",
    };
  }

  return {
    id: `commission-${input.id}`,
    label: "Comision validable",
    passed: true,
    severity: "ok",
    detail: "Tiene evidencia aprobada y aprobacion final correcta.",
  };
}

export function validatePremiumUsage(input: PremiumToolUsage): BusinessRuleResult {
  if (!input.centerId) {
    return {
      id: `premium-${input.id}`,
      label: "No uso premium sin centro asignado",
      passed: false,
      severity: "blocker",
      detail: "Higgsfield/IA premium debe cargarse a un centro antes de usarse.",
    };
  }

  if (input.status === "approved" && input.approvedBy !== "sergio") {
    return {
      id: `premium-${input.id}`,
      label: "Uso premium requiere Sergio",
      passed: false,
      severity: "blocker",
      detail: "Arthur y vendedores no aprueban herramientas premium.",
    };
  }

  return {
    id: `premium-${input.id}`,
    label: "Uso premium trazable",
    passed: true,
    severity: "ok",
    detail: "Tiene centro asignado y aprobacion correcta si aplica.",
  };
}

export function calculatePayment(input: PaymentInput) {
  const sellerRule = input.sellerCommissionRuleId
    ? vendorCommissionRules.find((rule) => rule.id === input.sellerCommissionRuleId)
    : undefined;
  const sellerRate = input.sellerCommissionRate ?? sellerRule?.commissionRatePercent ?? 10;
  const setupRate = input.role === "seller" ? sellerRate : input.arthurSetupRate ?? 0;
  const firstMonthRate = input.role === "seller" ? sellerRate : input.arthurFirstMonthRate ?? 0;
  const firstPaymentNetCollectedBs =
    input.firstPaymentNetCollectedBs ?? input.setupNetCollectedBs + input.firstMonthNetCollectedBs;
  const sellerCommissionEnabled =
    input.role === "seller" && (!sellerRule || sellerRule.commissionType === "percent" || sellerRule.commissionType === "fixed");
  const grossEarnedBs =
    input.role === "seller"
      ? sellerRule?.commissionType === "fixed" && sellerRule.fixedCommissionBs !== undefined
        ? sellerRule.fixedCommissionBs
        : sellerCommissionEnabled
          ? firstPaymentNetCollectedBs * (sellerRate / 100)
          : 0
      : input.setupNetCollectedBs * (setupRate / 100) + input.firstMonthNetCollectedBs * (firstMonthRate / 100);
  const averageRate = input.role === "seller" ? sellerRate / 100 : (setupRate + firstMonthRate) / 2 / 100;
  const claimDeductionBs = input.claimsOrRefundsBs * averageRate;
  const payableBeforeApprovalBs = Math.max(0, grossEarnedBs - claimDeductionBs);
  const approved = input.evidenceComplete && input.sergioApproved && payableBeforeApprovalBs > 0;
  const status = !input.evidenceComplete
    ? "bloqueado_sin_evidencia"
    : !input.sergioApproved
      ? "pendiente_sergio"
      : approved
        ? "aprobado"
        : "sin_pago";
  const biweeklyAdvanceBs = approved ? payableBeforeApprovalBs * 0.2 : 0;
  const monthlyCloseBs = approved ? payableBeforeApprovalBs - biweeklyAdvanceBs : 0;

  return {
    role: input.role,
    sellerRule,
    firstPaymentNetCollectedBs,
    setupRate,
    firstMonthRate,
    grossEarnedBs,
    claimDeductionBs,
    payableBeforeApprovalBs,
    approved,
    status,
    biweeklyAdvanceBs,
    monthlyCloseBs,
  };
}

export function calculateNuviaLot(input = nuviaExample) {
  const arthurOperatingPaymentBs = input.arthurOperatingPaymentBs ?? 0;
  const directCostsBs =
    input.productCapitalRecoveryBs +
    input.packagingLogisticsBs +
    input.transportBs +
    input.adsBs +
    input.premiumToolsBs +
    input.externalProductionBs +
    input.refundsAndFeesBs +
    arthurOperatingPaymentBs;
  const realGrossProfitBs = input.salesCollectedBs - directCostsBs;
  const grossMarginPercent = input.salesCollectedBs > 0 ? (realGrossProfitBs / input.salesCollectedBs) * 100 : 0;
  const marginOk = grossMarginPercent >= 40;
  const costsRecovered = realGrossProfitBs > 0;
  const oniaFundBs = costsRecovered ? realGrossProfitBs * 0.2 : 0;
  const nuviaReservePercent = input.nuviaReservePercent ?? 20;
  const nuviaReserveBs = costsRecovered ? realGrossProfitBs * (nuviaReservePercent / 100) : 0;
  const nuviaPettyCashBs = costsRecovered ? input.nuviaPettyCashBs ?? 0 : 0;
  const distributableUtilityBs = costsRecovered
    ? Math.max(0, realGrossProfitBs - oniaFundBs - nuviaPettyCashBs - nuviaReserveBs)
    : 0;
  const arthurVariableBs = 0;
  const investorUtilityBs = distributableUtilityBs;

  return {
    directCostsBs,
    realGrossProfitBs,
    grossMarginPercent,
    marginOk,
    costsRecovered,
    oniaFundBs,
    nuviaPettyCashBs,
    nuviaReservePercent,
    nuviaReserveBs,
    distributableBeforeVariableBs: distributableUtilityBs,
    distributableUtilityBs,
    arthurOperatingPaymentBs,
    arthurVariableBs,
    investorUtilityBs,
    canApproveDistribution: costsRecovered && marginOk && input.evidenceComplete && input.sergioApproved,
  };
}

export function validateNuviaLot(input: NuviaLotRecord): BusinessRuleResult {
  const calculation = calculateNuviaLot(input);
  const hasEvidence = Boolean(input.evidenceId) && evidenceSeed.some((evidence) => evidence.id === input.evidenceId && evidence.status === "approved");
  const hasCompleteCosts =
    input.productCapitalRecoveryBs > 0 &&
    input.packagingLogisticsBs >= 0 &&
    input.transportBs >= 0 &&
    input.adsBs >= 0 &&
    input.premiumToolsBs >= 0 &&
    input.externalProductionBs >= 0 &&
    input.refundsAndFeesBs >= 0;

  if (!hasCompleteCosts) {
    return {
      id: `nuvia-${input.id}`,
      label: "No Nuvia sin costos completos",
      passed: false,
      severity: "blocker",
      detail: "El lote debe tener capital recuperado y costos directos completos.",
    };
  }

  if (!calculation.marginOk) {
    return {
      id: `nuvia-${input.id}`,
      label: "Margen Nuvia insuficiente",
      passed: false,
      severity: "blocker",
      detail: `Margen ${formatPercent(calculation.grossMarginPercent)}; minimo operativo 40%.`,
    };
  }

  if (!hasEvidence || !input.sergioApproved) {
    return {
      id: `nuvia-${input.id}`,
      label: "Nuvia requiere evidencia y Sergio",
      passed: false,
      severity: "blocker",
      detail: "No hay reparto Nuvia sin evidencia aprobada y aprobacion final Sergio.",
    };
  }

  return {
    id: `nuvia-${input.id}`,
    label: "Lote Nuvia calculable",
    passed: true,
    severity: "ok",
    detail: "Costos completos, margen >= 40%, evidencia y Sergio OK.",
  };
}

export function calculateOniaServicesFund(incomes: IncomeRecord[] = incomeSeed) {
  const netServicesSalesBs = incomes
    .filter((income) => income.centerId === "onia-services")
    .reduce((sum, income) => sum + calculateIncomeNet(income), 0);

  return {
    netServicesSalesBs,
    oniaFundBs: netServicesSalesBs * 0.4,
  };
}

export function getCashStatus(runwayMonths: number) {
  if (runwayMonths >= 2) {
    return "green";
  }

  if (runwayMonths >= 1) {
    return "yellow";
  }

  return "red";
}

export function runBusinessRuleAudit(): BusinessRuleResult[] {
  const serviceResults = operationalServices.map((service) => {
    const validation = validateOperationalService(service);
    return {
      id: `service-${service.id}`,
      label: "No servicio sin campos obligatorios",
      passed: validation.canSell,
      severity: validation.canSell ? "ok" : "blocker",
      detail: validation.canSell
        ? `${service.name} puede venderse.`
        : `${service.name} bloqueado: ${validation.missing.join(", ")}.`,
    } satisfies BusinessRuleResult;
  });

  const permissionResults: BusinessRuleResult[] = [
    {
      id: "permission-arthur-private-capital",
      label: "Arthur no ve capital privado Sergio",
      passed: !canViewPrivateField("arthur", "capital"),
      severity: !canViewPrivateField("arthur", "capital") ? "ok" : "blocker",
      detail: "La vista Arthur oculta capital, deuda exacta, caja completa y recuperacion.",
    },
    {
      id: "permission-seller-private-profit",
      label: "Vendedor no ve utilidad interna",
      passed: !canViewPrivateField("seller", "internal_profit"),
      severity: !canViewPrivateField("seller", "internal_profit") ? "ok" : "blocker",
      detail: "La vista vendedor es simple y sin utilidad interna.",
    },
  ];

  return [
    ...serviceResults,
    ...commissionSeed.map(validateCommission),
    ...expenseSeed.map(validateExpense),
    ...nuviaLotsSeed.map(validateNuviaLot),
    ...premiumUsageSeed.map(validatePremiumUsage),
    ...permissionResults,
  ];
}

export const centerSnapshot = calculateSustainability();
export const growthTarget = calculateGrowthTarget();
export const nuviaSnapshot = calculateNuviaLot();
export const businessRuleAudit = runBusinessRuleAudit();
