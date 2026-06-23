"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  Ban,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Crown,
  Database,
  EyeOff,
  FileCheck2,
  Gauge,
  HandCoins,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Percent,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UsersRound,
  WalletCards,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import "./onia-center.css";
import type { CenterTone, OperationalService, RoleId } from "./types";
import {
  arthurScorecard,
  dataModelTables,
  evidenceGates,
  expenseSeed,
  incomeSeed,
  leadSeed,
  nuviaExample,
  oniaCenterSeedSource,
  operationalServices,
  paymentExamples,
  premiumToolPolicies,
  privateCapital,
  roleDefinitions,
  sourceDocuments,
  sustainabilityTargets,
} from "./source";
import {
  auditLogSeed,
  collabIngestionItems,
  collaborators,
  externalAdapters,
  inventoryItems,
  operatingOrganizations,
  repoStrategy,
} from "./operating-source";
import {
  calculateNuviaLot,
  calculatePayment,
  canSeePrivateCapital,
  businessRuleAudit,
  centerSnapshot,
  formatBs,
  formatPercent,
  getServiceValidation,
  getVisibleCenters,
  growthTarget,
  serviceValidations,
} from "./engine";
import {
  getAdapterSummary,
  getBolivianModuleSummary,
  getCollabSafetySummary,
  getMembershipSummary,
  getOperatingDashboardSummary,
  getTaskStatusTone,
  getVisibleProjects,
  getVisibleReviews,
  getVisibleTasks,
} from "./operating-engine";
import { OperatingWorkspace } from "./operating-workspace";

type NavItem = {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "uso-diario", label: "Uso diario", detail: "Captura", icon: ClipboardCheck },
  { id: "ideas", label: "Ideas", detail: "Reels e IA", icon: Lightbulb },
  { id: "dashboard", label: "Dashboard", detail: "Operacion", icon: BarChart3 },
  { id: "proyectos", label: "Proyectos", detail: "ONIA", icon: BriefcaseBusiness },
  { id: "tareas", label: "Tareas", detail: "Revision", icon: ClipboardCheck },
  { id: "collab", label: "Collab", detail: "Ingestion", icon: Database },
  { id: "bolivian", label: "Bolivian", detail: "Modulo", icon: Building2 },
  { id: "ceo", label: "CEO", detail: "Sergio privado", icon: Crown },
  { id: "servicios", label: "Servicios", detail: "Catalogo y bloqueo", icon: Layers3 },
  { id: "roles", label: "Roles", detail: "Permisos", icon: UsersRound },
  { id: "arthur", label: "Arthur", detail: "60 dias", icon: UserCheck },
  { id: "finanzas", label: "Finanzas", detail: "Centros", icon: WalletCards },
  { id: "nuvia", label: "Nuvia", detail: "Lotes", icon: Boxes },
  { id: "pagos", label: "Pagos", detail: "Comisiones", icon: HandCoins },
  { id: "evidencias", label: "Evidencias", detail: "Gates", icon: FileCheck2 },
  { id: "premium", label: "Premium", detail: "Herramientas", icon: Zap },
  { id: "seguridad", label: "Seguridad", detail: "Privacidad", icon: ShieldCheck },
];

const centerBalances = [
  {
    center: "ONIA Servicios",
    amountBs: centerSnapshot.monthlyNetSalesBs,
    detail: "Ventas netas registradas en Center",
    privateOnly: false,
  },
  {
    center: "Fondo ONIA",
    amountBs: centerSnapshot.oniaFundAccumulatedBs,
    detail: "40% de ventas netas registradas",
    privateOnly: false,
  },
  { center: "Nuvia", amountBs: 0, detail: "Sin lotes reales cargados todavia", privateOnly: false },
  { center: "Reserva Nuvia", amountBs: 0, detail: "10% solo cuando existan lotes cerrados", privateOnly: false },
  { center: "ONIA Media", amountBs: 0, detail: "Sin ingresos cobrados registrados", privateOnly: false },
  { center: "Sergio owner income", amountBs: 0, detail: "Retiro privado no aprobado", privateOnly: true },
  { center: "Arthur variable", amountBs: 0, detail: "No hay variables aprobadas sin evidencia", privateOnly: false },
];

const serviceIconById: Record<string, LucideIcon> = {
  "onia-motor-local-growth": Sparkles,
  "onia-motor-local-starter": Target,
  "onia-motor-local-pro": Workflow,
  "web-pro-onia": Building2,
};

function TonePill({ tone, children }: { tone: CenterTone; children: React.ReactNode }) {
  return <span className={`onia-tone-pill is-${tone}`}>{children}</span>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="onia-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <Icon size={18} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  privateBlocked,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: CenterTone;
  privateBlocked?: boolean;
}) {
  return (
    <article className={`onia-metric is-${tone} ${privateBlocked ? "is-private" : ""}`}>
      <span>
        {privateBlocked ? <EyeOff size={18} /> : <Icon size={18} />}
      </span>
      <p>{label}</p>
      <strong>{privateBlocked ? "Oculto" : value}</strong>
      <small>{privateBlocked ? "Visible solo para Sergio / Direccion ONIA." : detail}</small>
    </article>
  );
}

function ProgressBar({ value, tone }: { value: number; tone: CenterTone }) {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <div className={`onia-progress is-${tone}`} aria-label={`Progreso ${width}`}>
      <span style={{ width }} />
    </div>
  );
}

function ServiceCard({ service }: { service: OperationalService }) {
  const Icon = serviceIconById[service.id] ?? Layers3;
  const validation = getServiceValidation(service.id);
  const canSell = validation?.canSell ?? false;
  const isPriority = service.id === "onia-motor-local-growth";

  return (
    <article className={`onia-service-card ${isPriority ? "is-priority" : ""} ${canSell ? "can-sell" : "is-blocked"}`}>
      <div className="onia-service-card__top">
        <span>
          <Icon size={18} />
        </span>
        <div>
          <strong>{service.name}</strong>
          <small>{service.plan}</small>
        </div>
        <TonePill tone={canSell ? "green" : "red"}>{canSell ? "vendible" : "bloqueado"}</TonePill>
      </div>

      <div className="onia-price-grid">
        <div>
          <span>Setup</span>
          <strong>{service.setupPriceBs ? formatBs(service.setupPriceBs, { compact: true }) : "No definido"}</strong>
        </div>
        <div>
          <span>Mensual</span>
          <strong>{service.isRecurring ? formatBs(service.monthlyPriceBs ?? 0, { compact: true }) : "No aplica"}</strong>
        </div>
        <div>
          <span>Centro</span>
          <strong>{service.accountingCenter ?? "Falta"}</strong>
        </div>
      </div>

      <p>{service.salesScript ?? service.risk ?? "Servicio pendiente de catalogo operativo completo."}</p>

      {service.includes?.length ? (
        <ul className="onia-compact-list">
          {service.includes.slice(0, 5).map((item) => (
            <li key={item}>
              <CheckCircle2 size={14} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!canSell ? (
        <div className="onia-blocker">
          <Ban size={15} />
          <span>Falta: {validation?.missing.join(", ")}</span>
        </div>
      ) : (
        <div className="onia-blocker is-ok">
          <BadgeCheck size={15} />
          <span>Checklist, evidencia, centro y comision/variable definidos.</span>
        </div>
      )}
    </article>
  );
}

function PrivateCapitalPanel({ visible }: { visible: boolean }) {
  if (!visible) {
    return (
      <article className="onia-private-panel is-hidden">
        <LockKeyhole size={18} />
        <div>
          <strong>Capital privado oculto</strong>
          <p>Arthur, vendedores y freelancers no ven capital Sergio, deuda exacta, runway, recuperacion ni caja real completa.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="onia-private-panel">
      <div className="onia-private-panel__summary">
        <div>
          <span>Capital Sergio/ONIA</span>
          <strong>{formatBs(privateCapital.grossCapitalBs)}</strong>
        </div>
        <div>
          <span>Deuda exacta</span>
          <strong>{formatBs(privateCapital.exactDebtBs)}</strong>
        </div>
        <div>
          <span>Caja despues deuda</span>
          <strong>{formatBs(privateCapital.estimatedCashAfterDebtBs)}</strong>
        </div>
        <div>
          <span>Runway privado</span>
          <strong>{centerSnapshot.runwayMonths.toFixed(2)} meses</strong>
        </div>
      </div>

      <div className="onia-capital-grid">
        <section>
          <h3>Bloque protegido</h3>
          {privateCapital.protectedBuckets.map((bucket) => (
            <div className="onia-ledger-row" key={bucket.name}>
              <span>{bucket.name}</span>
              <strong>{formatBs(bucket.amountBs)}</strong>
              <small>{bucket.rule}</small>
            </div>
          ))}
        </section>
        <section>
          <h3>Crecimiento controlado</h3>
          {privateCapital.growthBuckets.map((bucket) => (
            <div className="onia-ledger-row" key={bucket.name}>
              <span>{bucket.name}</span>
              <strong>{formatBs(bucket.amountBs)}</strong>
              <small>{bucket.rule}</small>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}

export default function OniaCenterPage() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("sergio");
  const role = roleDefinitions.find((item) => item.id === selectedRole) ?? roleDefinitions[0];
  const privateVisible = canSeePrivateCapital(selectedRole);
  const visibleCenters = useMemo(() => getVisibleCenters(selectedRole), [selectedRole]);
  const visiblePremium = premiumToolPolicies.filter((policy) => policy.visibility.includes(selectedRole));
  const blockedServices = serviceValidations.filter((validation) => !validation.canSell).length;
  const nuvia = calculateNuviaLot(nuviaExample);
  const payments = paymentExamples.map((payment) => ({ input: payment, result: calculatePayment(payment) }));
  const salesTone = centerSnapshot.salesStatus === "green" ? "green" : centerSnapshot.salesStatus === "yellow" ? "yellow" : "red";
  const operatingSummary = getOperatingDashboardSummary();
  const visibleProjects = useMemo(() => getVisibleProjects(selectedRole), [selectedRole]);
  const visibleTasks = useMemo(() => getVisibleTasks(selectedRole), [selectedRole]);
  const visibleReviews = useMemo(() => getVisibleReviews(selectedRole), [selectedRole]);
  const collabSummary = getCollabSafetySummary();
  const bolivianSummary = getBolivianModuleSummary();
  const adapterSummary = getAdapterSummary();
  const membershipSummary = getMembershipSummary(selectedRole);
  const projectNameById = useMemo(
    () => new Map(visibleProjects.map((project) => [project.id, project.name])),
    [visibleProjects],
  );

  return (
    <main className="onia-center-page">
      <aside className="onia-center-sidebar" aria-label="Navegacion ONIA Center">
        <Link className="onia-back-link" href="/">
          <ChevronRight size={15} />
          Hermes Control
        </Link>

        <div className="onia-brand">
          <span>
            <Crown size={20} />
          </span>
          <div>
            <strong>ONIA Center</strong>
            <small>Sistema operativo</small>
          </div>
        </div>

        <nav className="onia-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a href={`#${item.id}`} key={item.id}>
                <Icon size={15} />
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </a>
            );
          })}
        </nav>

        <section className="onia-role-switcher" aria-label="Selector de rol">
          <span>Vista activa</span>
          {roleDefinitions.map((item) => (
            <button
              className={selectedRole === item.id ? "is-active" : ""}
              key={item.id}
              type="button"
              onClick={() => setSelectedRole(item.id)}
            >
              <strong>{item.title.split(" / ")[0]}</strong>
              <small>Nivel {item.level}</small>
            </button>
          ))}
        </section>
      </aside>

      <section className="onia-center-main">
        <header className="onia-hero">
          <div>
            <span className="onia-eyebrow">Fuentes reales / reglas 2026</span>
            <h1>ONIA Center</h1>
            <p>
              Sistema operativo para ventas, servicios, finanzas, Nuvia, pagos, evidencia y herramientas premium.
              No aprueba comisiones sin evidencia ni vende servicios incompletos.
            </p>
          </div>
          <div className="onia-hero-actions">
            <a href="#servicios">
              <Layers3 size={16} />
              Servicios
            </a>
            <a href="#pagos">
              <HandCoins size={16} />
              Pagos
            </a>
            <a href="#evidencias">
              <ShieldCheck size={16} />
              Evidencias
            </a>
          </div>
        </header>

        <section className="onia-source-strip" aria-label="Fuentes canonicas">
          {sourceDocuments.map((source) => (
            <code key={source}>{source}</code>
          ))}
        </section>

        <OperatingWorkspace selectedRole={selectedRole} />

        <section className="onia-panel onia-repo-strategy" id="dashboard" aria-label="Dashboard operativo ONIA">
          <SectionHeader
            eyebrow="Decision operativa"
            title="onia-center ejecuta; Hermes piensa; collab aporta"
            description="No abrimos otro repo todavia. Primero consolidamos el sistema operativo aqui, con limites claros entre privado y colaborativo."
            icon={BarChart3}
          />
          <div className="onia-repo-grid">
            <article>
              <span>Cerebro privado</span>
              <strong>{repoStrategy.privateBrain}</strong>
              <p>Memoria, estrategia, decisiones sensibles, precios internos y reglas privadas.</p>
            </article>
            <article>
              <span>Sistema operativo</span>
              <strong>{repoStrategy.operatingApp}</strong>
              <p>CRM, proyectos, tareas, vendedores, colaboradores, Bolivian, StockCam, evidencias y auditoria.</p>
            </article>
            <article>
              <span>Trabajo colaborativo</span>
              <strong>{repoStrategy.collabWorkspace}</strong>
              <p>Arthur sube aportes saneados; ONIA Center los revisa antes de importar.</p>
            </article>
          </div>
          <div className="onia-operating-metrics">
            <MetricCard
              label="Proyectos activos"
              value={String(operatingSummary.activeProjects)}
              detail={`${visibleProjects.length} visibles para el rol actual.`}
              icon={BriefcaseBusiness}
              tone="green"
            />
            <MetricCard
              label="Tareas abiertas"
              value={String(operatingSummary.openTasks)}
              detail={`${visibleTasks.length} asignadas o visibles para este rol.`}
              icon={ClipboardCheck}
              tone="blue"
            />
            <MetricCard
              label="Pendientes revision"
              value={String(operatingSummary.pendingReviews)}
              detail={`${visibleReviews.length} visibles para este rol.`}
              icon={FileCheck2}
              tone={operatingSummary.pendingReviews > 0 ? "yellow" : "green"}
            />
            <MetricCard
              label="Alertas operativas"
              value={String(operatingSummary.alerts)}
              detail="Suma revisiones, bloqueos y adaptadores en riesgo."
              icon={AlertTriangle}
              tone={operatingSummary.alerts > 0 ? "red" : "green"}
            />
          </div>
          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla de repos:</strong>
            <span>{repoStrategy.rule}</span>
          </div>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="proyectos">
            <SectionHeader
              eyebrow="Proyectos ONIA"
              title="Portafolio operativo filtrado por rol"
              description="ONIA Center maneja los proyectos; la logica vertical profunda queda en su sistema correspondiente."
              icon={BriefcaseBusiness}
            />
            <div className="onia-project-list">
              {visibleProjects.map((project) => (
                <article key={project.id}>
                  <div>
                    <span>{project.productLine}</span>
                    <strong>{project.name}</strong>
                    <p>{project.description}</p>
                  </div>
                  <TonePill tone={project.status === "active" ? "green" : project.status === "blocked" ? "red" : "blue"}>
                    {project.status}
                  </TonePill>
                  <small>{project.nextStep}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel" id="tareas">
            <SectionHeader
              eyebrow="Tareas y revision"
              title="Operacion diaria con evidencia"
              description="Arthur solo aparece como colaborador con tareas, aportes, briefs y entregables revisables."
              icon={ClipboardCheck}
            />
            <div className="onia-task-list">
              {visibleTasks.length ? (
                visibleTasks.map((task) => (
                  <article key={task.id}>
                    <div>
                      <span>{projectNameById.get(task.projectId) ?? "Proyecto privado"}</span>
                      <strong>{task.title}</strong>
                      <p>
                        {task.source} / {task.evidenceRequired ? "requiere evidencia" : "sin evidencia requerida"}
                      </p>
                    </div>
                    <TonePill tone={getTaskStatusTone(task.status)}>{task.status}</TonePill>
                  </article>
                ))
              ) : (
                <article className="is-empty">
                  <div>
                    <span>Vista filtrada</span>
                    <strong>No hay tareas visibles para este rol</strong>
                    <p>Las tareas sensibles o no asignadas quedan ocultas.</p>
                  </div>
                  <TonePill tone="blue">privacidad</TonePill>
                </article>
              )}
            </div>
            <div className="onia-review-strip">
              {visibleReviews.map((review) => (
                <article key={review.id}>
                  <span>{review.priority}</span>
                  <strong>{review.title}</strong>
                  <small>{review.status}</small>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="collab">
            <SectionHeader
              eyebrow="Ingestion desde onia-hermes-collab"
              title="Bandeja de aportes revisables"
              description="El repo colaborativo es entrada saneada, no fuente privada ni sistema operativo."
              icon={Database}
            />
            <div className="onia-collab-summary">
              <div>
                <span>En cola</span>
                <strong>{collabSummary.queued}</strong>
              </div>
              <div>
                <span>Sensibles</span>
                <strong>{collabSummary.sensitive}</strong>
              </div>
              <div>
                <span>Importables</span>
                <strong>{collabSummary.importable}</strong>
              </div>
              <div>
                <span>Rechazados</span>
                <strong>{collabSummary.rejected}</strong>
              </div>
            </div>
            <div className="onia-collab-list">
              {collabIngestionItems.map((item) => (
                <article key={item.id}>
                  <div>
                    <span>{item.classification}</span>
                    <strong>{item.sourcePath}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <TonePill tone={item.sensitivity === "sensitive" ? "red" : item.sensitivity === "internal" ? "yellow" : "green"}>
                    {item.sensitivity}
                  </TonePill>
                </article>
              ))}
            </div>
            <div className="onia-rule-strip">
              <ShieldCheck size={17} />
              <strong>Regla:</strong>
              <span>{collabSummary.rule}</span>
            </div>
          </article>

          <article className="onia-panel" id="bolivian">
            <SectionHeader
              eyebrow="Bolivian Electric"
              title="Modulo propio sobre base reusable"
              description="Bolivian se personaliza por configuracion; TR4 no entra al core."
              icon={Building2}
            />
            {selectedRole === "sergio" ? (
              <div className="onia-module-list">
                {bolivianSummary.modules.map((module) => (
                  <article key={module.id}>
                    <div>
                      <span>{module.moduleType}</span>
                      <strong>{module.name}</strong>
                      <p>{module.note}</p>
                    </div>
                    <TonePill tone={module.status === "blocked" ? "red" : module.status === "ready" ? "green" : "blue"}>
                      {module.status}
                    </TonePill>
                  </article>
                ))}
              </div>
            ) : (
              <PrivateCapitalPanel visible={false} />
            )}
            <div className="onia-blocker">
              <AlertTriangle size={15} />
              <span>{bolivianSummary.tr4Rule}</span>
            </div>
          </article>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="seguridad">
            <SectionHeader
              eyebrow="Seguridad y privacidad"
              title="Separacion entre privado, operativo y colaborativo"
              description="El rol actual determina alcance visible. La seguridad real queda pendiente de Supabase Auth/RLS."
              icon={ShieldCheck}
            />
            <div className="onia-security-grid">
              <article>
                <span>Rol actual</span>
                <strong>{role.title}</strong>
                <p>Scope: {membershipSummary.scopeLabel}. Membresias registradas: {membershipSummary.memberships.length}.</p>
              </article>
              <article>
                <span>Organizaciones</span>
                <strong>{operatingOrganizations.length}</strong>
                <p>ONIA privado, collab saneado y Bolivian como workspace de cliente.</p>
              </article>
              <article>
                <span>Colaboradores</span>
                <strong>{collaborators.length}</strong>
                <p>Arthur queda como colaborador, no socio ni aprobador financiero.</p>
              </article>
              <article>
                <span>Auditoria seed</span>
                <strong>{auditLogSeed.length}</strong>
                <p>Primeras acciones canonicas registradas sin secretos.</p>
              </article>
            </div>
          </article>

          <article className="onia-panel">
            <SectionHeader
              eyebrow="Adaptadores externos"
              title="TR4, Notion, n8n, WhatsApp, Cal y StockCam"
              description="Los sistemas externos se conectan como adaptadores, no como parte del core."
              icon={Workflow}
            />
            <div className="onia-collab-summary">
              <div>
                <span>Total</span>
                <strong>{adapterSummary.total}</strong>
              </div>
              <div>
                <span>Auditoria</span>
                <strong>{adapterSummary.auditRequired}</strong>
              </div>
              <div>
                <span>Bloqueados</span>
                <strong>{adapterSummary.blocked}</strong>
              </div>
              <div>
                <span>Escritura</span>
                <strong>{adapterSummary.writable}</strong>
              </div>
            </div>
            <div className="onia-adapter-list">
              {externalAdapters.map((adapter) => (
                <article key={adapter.id}>
                  <div>
                    <span>{adapter.systemType}</span>
                    <strong>{adapter.name}</strong>
                    <p>{adapter.rule}</p>
                  </div>
                  <TonePill tone={adapter.status === "blocked" || adapter.status === "audit_required" ? "red" : "blue"}>
                    {adapter.status}
                  </TonePill>
                </article>
              ))}
            </div>
            <div className="onia-rule-strip">
              <Boxes size={17} />
              <strong>StockCam:</strong>
              <span>{inventoryItems.length} item demo; el MVP real sera foto, codigo, cantidad, ubicacion y exportacion.</span>
            </div>
          </article>
        </section>

        <section className="onia-panel onia-system-base" aria-label="Base operativa Fase 1">
          <SectionHeader
            eyebrow="Fase 1 - Base operativa"
            title="Modelo, seed y datos reales"
            description="El seed inicial sale del JSON vendor panel. Leads, ingresos y gastos reales quedan en cero hasta conectarlos a Notion/Supabase."
            icon={Database}
          />
          <div className="onia-seed-summary">
            <article>
              <span>Seed fuente</span>
              <strong>{oniaCenterSeedSource.sourcePath}</strong>
              <small>{oniaCenterSeedSource.principle}</small>
            </article>
            <article>
              <span>Leads reales cargados</span>
              <strong>{leadSeed.length}</strong>
              <small>No se inventan prospectos.</small>
            </article>
            <article>
              <span>Ingresos reales cargados</span>
              <strong>{incomeSeed.length}</strong>
              <small>Ventas netas salen de registros reales.</small>
            </article>
            <article>
              <span>Gastos reales cargados</span>
              <strong>{expenseSeed.length}</strong>
              <small>Todo gasto futuro exige centro contable.</small>
            </article>
          </div>
          <div className="onia-model-table">
            {dataModelTables.map((table) => (
              <article key={table.name}>
                <span>{table.name}</span>
                <strong>{table.purpose}</strong>
                <small>
                  SQL {table.implementedInSql ? "OK" : "pendiente"} / App {table.implementedInApp ? "OK" : "pendiente"}
                </small>
              </article>
            ))}
          </div>
        </section>

        <section className="onia-role-banner">
          <div>
            <span>Rol actual</span>
            <strong>{role.title}</strong>
            <p>{role.description}</p>
          </div>
          <TonePill tone={privateVisible ? "green" : "blue"}>{privateVisible ? "acceso completo" : "vista filtrada"}</TonePill>
        </section>

        <section className="onia-panel" aria-label="Reglas de negocio implementadas">
          <SectionHeader
            eyebrow="Fase 2 - Reglas de negocio"
            title="Bloqueos ejecutables"
            description="Estas reglas son calculadas por el motor, no solo texto en pantalla."
            icon={ShieldCheck}
          />
          <div className="onia-rule-audit">
            {businessRuleAudit.map((rule) => (
              <article className={`is-${rule.severity}`} key={rule.id}>
                {rule.passed ? <CheckCircle2 size={15} /> : <Ban size={15} />}
                <div>
                  <strong>{rule.label}</strong>
                  <p>{rule.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="onia-metrics" id="ceo" aria-label="Dashboard CEO Sergio">
          <MetricCard
            label="Ventas netas del mes"
            value={formatBs(centerSnapshot.monthlyNetSalesBs)}
            detail="Registradas en ONIA Center. No se inventan ingresos."
            icon={Banknote}
            tone={salesTone}
          />
          <MetricCard
            label="Fondo ONIA acumulado"
            value={formatBs(centerSnapshot.oniaFundAccumulatedBs)}
            detail="40% de ventas netas registradas."
            icon={PiggyBank}
            tone={salesTone}
          />
          <MetricCard
            label="Faltante para cubrir"
            value={formatBs(centerSnapshot.missingForMonthlyNeedBs)}
            detail={`Necesidad conservadora ${formatBs(sustainabilityTargets.conservativeMonthlyNeedBs)}.`}
            icon={AlertTriangle}
            tone={centerSnapshot.missingForMonthlyNeedBs > 0 ? "red" : "green"}
          />
          <MetricCard
            label="Meta venta neta mensual"
            value={formatBs(sustainabilityTargets.requiredMonthlyNetSalesBs)}
            detail={`Meta semanal ${formatBs(sustainabilityTargets.weeklyTargetLowBs, { compact: true })}-${formatBs(
              sustainabilityTargets.weeklyTargetHighBs,
              { compact: true },
            )}.`}
            icon={Target}
            tone="blue"
          />
          <MetricCard
            label="Capital Sergio/ONIA"
            value={formatBs(privateCapital.grossCapitalBs)}
            detail="Privado; capital de supervivencia y crecimiento controlado."
            icon={Crown}
            tone="neutral"
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Deuda exacta"
            value={formatBs(privateCapital.exactDebtBs)}
            detail="Privado; no visible para Arthur ni vendedores."
            icon={ReceiptText}
            tone="yellow"
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Runway"
            value={`${centerSnapshot.runwayMonths.toFixed(2)} meses`}
            detail={`Caja despues de deuda / ${formatBs(sustainabilityTargets.conservativeMonthlyNeedBs)}.`}
            icon={Gauge}
            tone={centerSnapshot.runwayStatus}
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Recuperacion capital"
            value={formatBs(0)}
            detail={`Registrado recuperado hoy; capital base ${formatBs(privateCapital.grossCapitalBs)}.`}
            icon={Calculator}
            tone="neutral"
            privateBlocked={!privateVisible}
          />
        </section>

        <section className="onia-status-grid">
          <article className={`onia-status-card is-${salesTone}`}>
            <div>
              <span>Semaforo motor de ventas</span>
              <strong>{salesTone === "green" ? "Verde" : salesTone === "yellow" ? "Amarillo" : "Rojo"}</strong>
              <p>
                El 40% del Fondo ONIA no cubre la existencia mensual hasta registrar al menos{" "}
                {formatBs(sustainabilityTargets.requiredMonthlyNetSalesBs)} netos.
              </p>
            </div>
            <ProgressBar value={centerSnapshot.fundProgressPercent} tone={salesTone} />
          </article>

          <article className={`onia-status-card is-${privateVisible ? centerSnapshot.runwayStatus : "blue"}`}>
            <div>
              <span>Semaforo caja/runway</span>
              <strong>{privateVisible ? (centerSnapshot.runwayStatus === "green" ? "Verde" : "Amarillo") : "Oculto"}</strong>
              <p>
                {privateVisible
                  ? "Caja privada despues de deuda cubre mas de 2 meses, pero el motor comercial sigue rojo por ventas registradas."
                  : "Esta informacion incluye capital y caja real; solo Sergio puede verla."}
              </p>
            </div>
            <ProgressBar value={privateVisible ? centerSnapshot.runwayMonths * 50 : 0} tone={privateVisible ? centerSnapshot.runwayStatus : "blue"} />
          </article>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="servicios">
            <SectionHeader
              eyebrow="Catalogo Operativo de Servicios"
              title="El sistema empuja ONIA Motor Local Growth"
              description={`${blockedServices} servicio(s) quedan bloqueados hasta completar campos obligatorios.`}
              icon={Layers3}
            />
            <div className="onia-growth-card">
              <div>
                <span>Servicio prioritario</span>
                <strong>ONIA Motor Local Growth</strong>
                <p>
                  Setup {formatBs(2900, { compact: true })}, mensualidad {formatBs(1900, { compact: true })}. Meta:{" "}
                  {growthTarget.activeClients} clientes activos = {formatBs(growthTarget.monthlyRevenueBs, { compact: true })}/mes y{" "}
                  {formatBs(growthTarget.fundBs, { compact: true })} al Fondo ONIA.
                </p>
              </div>
              <TonePill tone={growthTarget.coversMonthlyNeed ? "green" : "yellow"}>caballito principal</TonePill>
            </div>
            <div className="onia-service-grid">
              {operationalServices.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          </article>

          <article className="onia-panel" id="roles">
            <SectionHeader
              eyebrow="Roles y permisos"
              title="Arthur coordina, Sergio aprueba"
              description="Arthur esta arriba de vendedor normal, pero no es socio ni aprueba dinero."
              icon={UsersRound}
            />
            <div className="onia-role-grid">
              {roleDefinitions.map((item) => (
                <article className={`onia-role-card ${item.id === selectedRole ? "is-active" : ""}`} key={item.id}>
                  <span>Nivel {item.level}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>{item.privateAccess ? "Puede ver modulo privado Sergio." : "Vista sin capital privado."}</small>
                </article>
              ))}
            </div>

            <div className="onia-permission-box">
              <div>
                <CheckCircle2 size={17} />
                <strong>Puede</strong>
                <ul>
                  {role.can.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Ban size={17} />
                <strong>No puede</strong>
                <ul>
                  {role.cannot.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>

        <section className="onia-panel" id="arthur">
          <SectionHeader
            eyebrow="Operacion Arthur 60 dias"
            title="Scorecard semanal con evidencia"
            description="Semana aprobada: minimo 80%, sin fallar CRM/ONIA Center, seguimientos ni reporte semanal."
            icon={UserCheck}
          />
          <div className="onia-scorecard-grid">
            {arthurScorecard.map((item) => (
              <article key={item.id}>
                <span>{item.area}</span>
                <strong>{item.minimum}</strong>
                <small>{item.required ? "obligatorio" : "operativo"}</small>
              </article>
            ))}
          </div>
          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla dura:</strong>
            <span>Si no esta en ONIA Center o Notion, no cuenta.</span>
          </div>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="finanzas">
            <SectionHeader
              eyebrow="Finanzas y centros contables"
              title="Caja por centro y reglas de fondo"
              description="Los saldos actuales no se inventan; lo no cargado aparece en Bs. 0 registrado."
              icon={WalletCards}
            />
            <div className="onia-center-table">
              {centerBalances.map((balance) => {
                const hidden = balance.privateOnly && !privateVisible;
                return (
                  <article className={hidden ? "is-hidden" : ""} key={balance.center}>
                    <span>{balance.center}</span>
                    <strong>{hidden ? "Oculto" : formatBs(balance.amountBs)}</strong>
                    <small>{hidden ? "Solo Sergio." : balance.detail}</small>
                  </article>
                );
              })}
            </div>

            <div className="onia-accounting-grid">
              {visibleCenters.map((center) => (
                <article key={center.id}>
                  <TonePill tone={center.tone}>{center.name}</TonePill>
                  <strong>{center.owner}</strong>
                  <p>{center.rule}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel">
            <SectionHeader
              eyebrow="Modulo privado"
              title="Capital interno Sergio"
              description="Esta seccion se filtra automaticamente por rol."
              icon={LockKeyhole}
            />
            <PrivateCapitalPanel visible={privateVisible} />
          </article>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="nuvia">
            <SectionHeader
              eyebrow="Nuvia"
              title="Lotes con costo completo"
              description="Primero se recupera capital y costos. Despues 20% Fondo ONIA, 10% Reserva Nuvia y solo luego variables."
              icon={Boxes}
            />
            <div className="onia-nuvia-ledger">
              <div><span>Ventas cobradas</span><strong>{formatBs(nuviaExample.salesCollectedBs)}</strong></div>
              <div><span>Capital producto Sergio</span><strong>-{formatBs(nuviaExample.productCapitalRecoveryBs)}</strong></div>
              <div><span>Empaque/logistica</span><strong>-{formatBs(nuviaExample.packagingLogisticsBs)}</strong></div>
              <div><span>Ganancia bruta real</span><strong>{formatBs(nuvia.realGrossProfitBs)}</strong></div>
              <div><span>Margen bruto</span><strong>{formatPercent(nuvia.grossMarginPercent)}</strong></div>
              <div><span>Fondo ONIA 20%</span><strong>-{formatBs(nuvia.oniaFundBs)}</strong></div>
              <div><span>Reserva Nuvia 10%</span><strong>-{formatBs(nuvia.nuviaReserveBs)}</strong></div>
              <div><span>Utilidad antes variable</span><strong>{formatBs(nuvia.distributableBeforeVariableBs)}</strong></div>
              <div><span>Arthur cierre 12%</span><strong>-{formatBs(nuvia.arthurVariableBs)}</strong></div>
              <div><span>Ganancia Sergio/ONIA</span><strong>{formatBs(nuvia.investorUtilityBs)}</strong></div>
            </div>
            <div className={`onia-blocker ${nuvia.canApproveDistribution ? "is-ok" : ""}`}>
              {nuvia.canApproveDistribution ? <BadgeCheck size={15} /> : <Ban size={15} />}
              <span>
                {nuvia.canApproveDistribution
                  ? "Distribucion calculable: margen bruto minimo 40%, evidencia y aprobacion Sergio presentes."
                  : "Bloqueado: falta margen, evidencia o aprobacion Sergio."}
              </span>
            </div>
          </article>

          <article className="onia-panel" id="pagos">
            <SectionHeader
              eyebrow="Pagos y comisiones"
              title="Motor bloquea pagos sin evidencia"
              description="Gastos externos, reclamos y devoluciones se descuentan antes de aprobar."
              icon={HandCoins}
            />
            <div className="onia-payment-list">
              {payments.map(({ input, result }, index) => (
                <article className={`is-${result.status}`} key={`${input.role}-${index}`}>
                  <div>
                    <span>{input.role === "seller" ? "Vendedor normal" : "Arthur"}</span>
                    <strong>{formatBs(result.payableBeforeApprovalBs)}</strong>
                    <small>
                      Setup {formatPercent(result.setupRate)} / primer mes {formatPercent(result.firstMonthRate)}
                    </small>
                  </div>
                  <TonePill tone={result.approved ? "green" : result.status === "pendiente_sergio" ? "yellow" : "red"}>
                    {result.status.replaceAll("_", " ")}
                  </TonePill>
                  <p>
                    Adelanto quincenal: {formatBs(result.biweeklyAdvanceBs)}. Cierre mensual: {formatBs(result.monthlyCloseBs)}.
                  </p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="onia-two-column">
          <article className="onia-panel" id="evidencias">
            <SectionHeader
              eyebrow="Evidencias"
              title="Lo que bloquea pagos y semanas"
              description="Cada gate define prueba, responsable y que queda bloqueado."
              icon={ClipboardCheck}
            />
            <div className="onia-evidence-grid">
              {evidenceGates.map((gate) => (
                <article key={gate.id}>
                  <span>{gate.title}</span>
                  <strong>{gate.requiredProof}</strong>
                  <p>{gate.blocks}</p>
                  <small>{gate.owner}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel" id="premium">
            <SectionHeader
              eyebrow="Herramientas premium"
              title="Higgsfield, IA y pauta por centro"
              description="Arthur no puede pedir generaciones premium sin brief aprobado."
              icon={Zap}
            />
            <div className="onia-premium-list">
              {visiblePremium.map((policy) => (
                <article key={policy.id}>
                  <Percent size={16} />
                  <div>
                    <strong>{policy.center}</strong>
                    <span>{policy.allocation}</span>
                    <p>{policy.rule}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <footer className="onia-footer">
          <span>
            <BarChart3 size={16} />
            JSON vendor panel parseado en validacion local.
          </span>
          <span>
            <ShieldCheck size={16} />
            Nada publicado ni enviado a clientes.
          </span>
        </footer>
      </section>
    </main>
  );
}
