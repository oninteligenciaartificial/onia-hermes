import type { LucideIcon } from "lucide-react";

export type Tone = "success" | "info" | "warning" | "danger" | "neutral";

export type LeadStatus =
  | "Nuevo"
  | "Investigado"
  | "Calificado"
  | "Mensaje preparado"
  | "Aprobado para contactar"
  | "Contactado"
  | "Respondio"
  | "Demo agendada"
  | "Propuesta enviada"
  | "Ganado";

export type Priority = "alta" | "media" | "baja";

export type Lead = {
  id: string;
  empresa: string;
  rubro: string;
  ciudad: string;
  canal: string;
  estado: LeadStatus;
  prioridad: Priority;
  producto: string;
  dolor: string;
  seguimiento: string;
  contacto: string;
  valorEstimado: string;
  siguienteAccion: string;
  datosCompletos: boolean;
};

export type LeadFormState = {
  empresa: string;
  rubro: string;
  ciudad: string;
  canal: string;
  dolor: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  type: "nota" | "objecion" | "riesgo" | "promesa" | "pregunta";
  owner: string;
  linkedLead: string;
};

export type Idea = {
  id: string;
  title: string;
  body: string;
  signal: string;
  stage: "nueva" | "revisar" | "aprobada";
};

export type Income = {
  id: string;
  client: string;
  service: string;
  charged: string;
  netAmount: string;
  commission: string;
  status: "pendiente" | "aprobada" | "pagada" | "retenida";
  paymentDate: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
};

export type WebDiagnostic = {
  id: string;
  label: string;
  whyItMatters: string;
  missingSignal: string;
  offer: string;
};

export type PlaybookItem = {
  id: string;
  title: string;
  body: string;
  detail: string;
  tone: Tone;
};

export type DailyAction = {
  id: string;
  time: string;
  title: string;
  detail: string;
  owner: string;
  tone: Tone;
};

export type ServiceScope = {
  id: string;
  service: string;
  includes: string[];
  needs: string[];
  notIncluded: string;
};

export type SectionChrome = {
  label: string;
  title: string;
  description: string;
};

export type SellerNavigationItem = {
  id: string;
  href: string;
  label: string;
  detail: string;
};

export type SellerScreen = {
  label: string;
  title: string;
  description: string;
  tags: string[];
  primaryAction?: {
    href: string;
    label: string;
  };
};

export type RequirementGroup = {
  id: string;
  title: string;
  owner: string;
  priority: "obligatorio" | "operativo" | "siguiente";
  items: string[];
  why: string;
};

export type OperationSnapshot = {
  trial: string;
  debt: string;
  initialInvestment: string;
  operatingCashAfterDebt: string;
  monthlyBaseExpense: string;
  pettyCash: string;
  conservativeMonthlyNeed: string;
  runway: string;
  monthlyNetTarget: string;
  healthySixtyDayTarget: string;
};

export type OperatingCenter = {
  id: string;
  title: string;
  owner: string;
  status: "activo" | "vigilado" | "bloqueado";
  tone: Tone;
  purpose: string;
  rules: string[];
};

export type PayoutRule = {
  id: string;
  case: string;
  fund: string;
  arthur: string;
  sergio: string;
  condition: string;
};

export type EvidenceGate = {
  id: string;
  title: string;
  requiredProof: string;
  blocks: string;
  owner: string;
};

export type WeeklyTarget = {
  id: string;
  area: string;
  arthur: string;
  sergio: string;
  status: "obligatorio" | "operativo";
};

export type NuviaClosureRule = {
  id: string;
  item: string;
  value: string;
  rule: string;
};

export type PaymentCadence = {
  id: string;
  incomeType: string;
  calculation: string;
  payment: string;
};
