import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Camera,
  ClipboardCheck,
  Code2,
  Database,
  ExternalLink,
  Factory,
  FileCode2,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Layers3,
  ListChecks,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import "../onia-center.css";
import { WebFactoryIntakeForm } from "./intake-form";
import { MotionArticle, MotionReveal } from "./motion-shell";
import { getWebFactoryCenterSnapshot, type WebFactoryClientRecipe, type WebFactoryRecipeStatus } from "./source";

export const dynamic = "force-static";

export const metadata = {
  title: "Web Factory | ONIA Center",
};

export default async function WebFactoryCenterPage() {
  const snapshot = await getWebFactoryCenterSnapshot();

  return (
    <main className="onia-center-page onia-webfactory-page">
      <aside className="onia-center-sidebar onia-webfactory-sidebar">
        <div className="onia-brand">
          <span>
            <Factory size={20} />
          </span>
          <div>
            <strong>Web Factory</strong>
            <small>Modulo operativo</small>
          </div>
        </div>

        <nav className="onia-nav" aria-label="Navegacion Web Factory">
          <div className="onia-nav-group">
            <span>Modulo</span>
            <Link href="/onia-center">
              <ArrowLeft size={15} />
              <span>ONIA Center</span>
              <small>Volver</small>
            </Link>
            <Link className="is-active" href="/onia-center/web-factory" aria-current="page">
              <Factory size={15} />
              <span>Web Factory</span>
              <small>Operativo</small>
            </Link>
            <Link href="/onia-center?view=integraciones">
              <Workflow size={15} />
              <span>Integraciones</span>
              <small>Estado</small>
            </Link>
          </div>

          <div className="onia-nav-group">
            <span>Clientes</span>
            {snapshot.recipes.slice(0, 7).map((recipe) => (
              <a href={`#recipe-${recipe.slug}`} key={recipe.slug}>
                <Globe2 size={15} />
                <span>{recipe.name}</span>
                <small>{recipe.statusLabel}</small>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      <section className="onia-center-main">
        <header className="onia-hero onia-webfactory-hero">
          <div>
            <span className="onia-eyebrow">ONIA Center / IA y automatizacion</span>
            <h1>Web Factory operativo</h1>
            <p>
              Lee recetas, capturas, codigo revisable, referencias y previews reales para producir webs con menos
              diseno generico y mas criterio por rubro.
            </p>
          </div>
          <div className="onia-hero-actions">
            <Link href="/onia-center?view=integraciones">
              <Workflow size={16} />
              Integraciones
            </Link>
            <Link href="/nuvia">
              <Play size={16} />
              Ver Nuvia
            </Link>
          </div>
        </header>

        <MotionReveal className="onia-active-module onia-webfactory-metrics" ariaLabel="Estado general Web Factory">
          <MetricCard icon={Layers3} label="Recetas" value={`${snapshot.counts.designRecipes}/${snapshot.counts.clientProfiles}`} detail="Clientes con diseno generado" />
          <MetricCard icon={BadgeCheck} label="Operativas" value={String(snapshot.counts.ready)} detail="Sin warnings y con preview" />
          <MetricCard icon={Camera} label="Screenshots" value={String(snapshot.counts.screenshots)} detail="Capturas usadas en recetas" />
          <MetricCard icon={Code2} label="Codigo" value={String(snapshot.counts.codeReferences)} detail="Referencias permitidas tras review" />
        </MotionReveal>

        <MotionReveal className="onia-panel onia-webfactory-intake-contract">
          <SectionHeader
            icon={ClipboardCheck}
            eyebrow="Alimentacion"
            title="Que datos necesita el generador"
            description={snapshot.intakeContract.status}
          />

          <div className="onia-webfactory-contract-grid">
            <article>
              <h3>Datos minimos</h3>
              <ul>
                {snapshot.intakeContract.minimumFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>Reglas de recursos</h3>
              <ul>
                {snapshot.intakeContract.resourceRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>Salidas del flujo</h3>
              <div className="onia-webfactory-output-list">
                {snapshot.intakeContract.outputs.map((output) => (
                  <div key={output.target}>
                    <span className={`onia-webfactory-status-dot is-${output.status}`} />
                    <strong>{output.label}</strong>
                    <code>{output.target}</code>
                    <p>{output.detail}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </MotionReveal>

        <WebFactoryIntakeForm />

        <MotionReveal className="onia-panel onia-webfactory-playbook">
          <SectionHeader
            icon={Workflow}
            eyebrow="Paso a paso"
            title="Como Arthur y Sergio usan la Web Factory"
            description="Arthur puede preparar datos, referencias, assets y revision interna. Sergio mantiene aprobacion sobre precio, alcance, entrega y deploy."
          />

          <div className="onia-webfactory-step-grid">
            {snapshot.workflowSteps.map((step) => (
              <article key={step.step}>
                <div className="onia-webfactory-step-number">{step.step}</div>
                <div className="onia-webfactory-step-body">
                  <div className="onia-webfactory-step-head">
                    <span>{step.owner}</span>
                    <strong>{step.title}</strong>
                    <small>Visible para {step.visibleTo.map(formatRoleLabel).join(", ")}</small>
                  </div>
                  <dl>
                    <div>
                      <dt>Entrada</dt>
                      <dd>{step.input}</dd>
                    </div>
                    <div>
                      <dt>Accion</dt>
                      <dd>{step.action}</dd>
                    </div>
                    <div>
                      <dt>Salida</dt>
                      <dd>{step.output}</dd>
                    </div>
                    <div>
                      <dt>Aprobacion</dt>
                      <dd>{step.approval}</dd>
                    </div>
                  </dl>
                  {step.command ? (
                    <code>
                      {step.command}
                    </code>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal className="onia-panel onia-webfactory-command-center">
          <SectionHeader
            icon={Terminal}
            eyebrow="Comandos canonicos"
            title="De datos clave a preview revisable"
            description="Estos comandos mantienen el flujo: referencias actuales, inteligencia, receta, build y smoke test."
          />

          <div className="onia-webfactory-command-grid">
            {snapshot.operatingCommands.map((command) => (
              <article key={command.command}>
                <span>{command.label}</span>
                <code>{command.command}</code>
                <p>{command.purpose}</p>
              </article>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal className="onia-panel onia-webfactory-automation">
          <SectionHeader
            icon={RefreshCw}
            eyebrow="Automatizaciones"
            title="Funciones que podemos automatizar"
            description="La regla es simple: automatizamos captura, analisis, recetas, previews y QA; dejamos precio, derechos, cliente y deploy bajo aprobacion humana."
          />

          <div className="onia-webfactory-automation-grid">
            {snapshot.automationFunctions.map((automation) => (
              <article key={automation.id} className={`is-${automation.status}`}>
                <div className="onia-webfactory-automation-head">
                  <span>{automation.owner}</span>
                  <strong>{automation.title}</strong>
                  <small>{automation.statusLabel} / {automation.cadence}</small>
                </div>
                <dl>
                  <div>
                    <dt>Trigger</dt>
                    <dd>{automation.trigger}</dd>
                  </div>
                  <div>
                    <dt>Entrada</dt>
                    <dd>{automation.input}</dd>
                  </div>
                  <div>
                    <dt>Salida</dt>
                    <dd>{automation.output}</dd>
                  </div>
                  <div>
                    <dt>Aprobacion</dt>
                    <dd>{automation.approval}</dd>
                  </div>
                </dl>
                {automation.command ? <code>{automation.command}</code> : null}
                <p>{automation.nextAction}</p>
              </article>
            ))}
          </div>

          <div className="onia-webfactory-automation-summary">
            <article>
              <Database size={16} />
              <div>
                <strong>Automatizar ya</strong>
                <p>Intake, referencias, inteligencia, receta, preview, QA y watcher Nuvia.</p>
              </div>
            </article>
            <article>
              <ListChecks size={16} />
              <div>
                <strong>Requiere aprobacion</strong>
                <p>Precio, alcance, derechos de media, contacto client-facing, deploy y gastos externos.</p>
              </div>
            </article>
          </div>
        </MotionReveal>

        <MotionReveal className="onia-panel onia-webfactory-github">
          <SectionHeader
            icon={Code2}
            eyebrow="Repos GitHub"
            title="Fuentes de diseno por estrellas y actividad"
            description={`${snapshot.githubDesignSources.policy} Actualizado: ${formatDate(snapshot.githubDesignSources.generatedAt)}.`}
          />

          {snapshot.githubDesignSources.skillSources.length > 0 ? (
            <div className="onia-webfactory-skill-sources">
              <div>
                <h3>Skills y criterio visual</h3>
                <p>Primero se usan para razonar direccion, calidad, riesgos y patrones. No son fuentes para copiar identidades.</p>
              </div>
              <div className="onia-webfactory-github-grid is-skills">
                {snapshot.githubDesignSources.skillSources.slice(0, 6).map((source) => (
                  <article key={source.fullName}>
                    <div>
                      <strong>{source.fullName}</strong>
                      <span>{source.category}</span>
                    </div>
                    <p>{source.usage}</p>
                    <small>{source.risk}</small>
                    <div className="onia-webfactory-github-meta">
                      <span>
                        <Star size={13} />
                        {formatNumber(source.stars)} stars
                      </span>
                      <span>{source.license}</span>
                    </div>
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        Abrir fuente <ExternalLink size={13} />
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="onia-webfactory-github-subhead">
            <h3>Componentes, sistemas y motion</h3>
            <p>Despues se revisa codigo reutilizable, licencias y componentes utiles para implementar sin copiar una web literal.</p>
          </div>

          <div className="onia-webfactory-github-grid">
            {snapshot.githubDesignSources.repos.slice(0, 8).map((repo) => (
              <article key={repo.fullName}>
                <div>
                  <strong>{repo.fullName}</strong>
                  <span>{repo.license}</span>
                </div>
                <p>{repo.usage}</p>
                <small>{repo.description}</small>
                <div className="onia-webfactory-github-meta">
                  <span>
                    <Star size={13} />
                    {formatNumber(repo.stars)} stars
                  </span>
                  <span>{formatDate(repo.pushedAt)}</span>
                </div>
                {repo.url ? (
                  <a href={repo.url} target="_blank" rel="noreferrer">
                    Abrir repo <ExternalLink size={13} />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal className="onia-webfactory-grid" ariaLabel="Recetas por cliente">
          {snapshot.recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </MotionReveal>

        <MotionReveal className="onia-webfactory-two-column" ariaLabel="Inteligencia y pendientes">
          <article className="onia-panel onia-webfactory-intelligence">
            <SectionHeader
              icon={Sparkles}
              eyebrow="Banco de patrones"
              title="Inteligencia de diseno actual"
              description={snapshot.intelligence.policy}
            />

            <div className="onia-webfactory-intel-stats">
              <span>
                <strong>{snapshot.intelligence.summary.sources}</strong>
                fuentes
              </span>
              <span>
                <strong>{snapshot.intelligence.summary.examples}</strong>
                ejemplos
              </span>
              <span>
                <strong>{snapshot.intelligence.summary.screenshots}</strong>
                capturas
              </span>
              <span>
                <strong>{snapshot.intelligence.summary.reusableCodeRepositories}</strong>
                repos
              </span>
            </div>

            <div className="onia-webfactory-source-list">
              {snapshot.intelligence.topSources.map((source) => (
                <article key={source.id}>
                  <div>
                    <strong>{source.name}</strong>
                    <span>{source.licenseStatus}</span>
                  </div>
                  <p>{source.usage}</p>
                  <small>
                    {source.examples} ejemplos / {source.screenshots} screenshots / {source.codeBlocks} bloques
                  </small>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      Abrir fuente <ExternalLink size={13} />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel onia-webfactory-pending">
            <SectionHeader
              icon={Gauge}
              eyebrow="Control operativo"
              title="Pendientes antes de vender en automatico"
              description="El modulo ya prepara previews internos; la entrega al cliente sigue pasando por revision ONIA."
            />

            <div className="onia-webfactory-action-list">
              {snapshot.nextActions.map((action) => (
                <article key={`${action.priority}-${action.title}`}>
                  <span className={`onia-webfactory-priority is-${action.priority}`}>{action.priority}</span>
                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            {snapshot.missingRecipeProfiles.length > 0 ? (
              <div className="onia-webfactory-missing">
                <strong>Perfiles sin receta</strong>
                {snapshot.missingRecipeProfiles.map((profile) => (
                  <div key={profile.slug}>
                    <span>{profile.name}</span>
                    <code>{profile.command}</code>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="onia-webfactory-docs">
              <strong>Fuentes canonicas</strong>
              {snapshot.canonicalDocs.map((doc) => (
                <code key={doc.path}>
                  {doc.label}: {doc.path}
                </code>
              ))}
              <small>Root: {snapshot.webFactoryRoot}</small>
              <small>Ultima lectura: {formatDate(snapshot.generatedAt)}</small>
            </div>
          </article>
        </MotionReveal>
      </section>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article>
      <span>
        <Icon size={17} />
        {label}
      </span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function RecipeCard({ recipe }: { recipe: WebFactoryClientRecipe }) {
  return (
    <MotionArticle className={`onia-panel onia-webfactory-recipe is-${recipe.status}`} id={`recipe-${recipe.slug}`}>
      <div className="onia-webfactory-recipe__head">
        <div>
          <span>{recipe.template} / {recipe.verticalLabel}</span>
          <h2>{recipe.name}</h2>
          <p>{recipe.designRead.objective}</p>
        </div>
        <StatusPill status={recipe.status}>{recipe.statusLabel}</StatusPill>
      </div>

      <div className="onia-webfactory-recipe__stats">
        <span>
          <strong>{recipe.confidenceScore}</strong>
          confianza
        </span>
        <span>
          <strong>{recipe.sectionCount}</strong>
          secciones
        </span>
        <span>
          <strong>{recipe.referenceCount}</strong>
          refs
        </span>
        <span>
          <strong>{recipe.codeReferenceCount}</strong>
          codigo
        </span>
      </div>

      <div className="onia-webfactory-artifacts">
        <Artifact icon={FileCode2} label="Perfil" ready={recipe.artifacts.hasProfile} path={recipe.paths.profile} />
        <Artifact icon={Wand2} label="Receta" ready={recipe.artifacts.hasMarkdown} path={recipe.paths.markdown} />
        <Artifact icon={RefreshCw} label="Contexto" ready={recipe.artifacts.hasContext} path={recipe.paths.context} />
        <Artifact icon={Play} label="Preview" ready={recipe.artifacts.hasPreview} path={recipe.paths.preview} />
      </div>

      <div className="onia-webfactory-read">
        <p>
          <strong>Direccion:</strong> {recipe.designRead.visualDirection}
        </p>
        <p>
          <strong>Riesgo:</strong> {recipe.designRead.genericRisk}
        </p>
      </div>

      <div className="onia-webfactory-references">
        <h3>Referencias exactas</h3>
        {recipe.references.slice(0, 4).map((reference) => (
          <article key={`${recipe.slug}-${reference.role}-${reference.sourceName}-${reference.url}`}>
            <div>
              <strong>{reference.sourceName}</strong>
              <span>{reference.role} / {reference.licenseStatus}</span>
            </div>
            <p>{reference.reuseGuidance}</p>
            {reference.url ? (
              <a href={reference.url} target="_blank" rel="noreferrer">
                Ver <ExternalLink size={13} />
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <div className="onia-webfactory-code">
        <h3>Codigo referencial</h3>
        {recipe.codeReferences.slice(0, 3).map((reference) => (
          <article key={`${recipe.slug}-${reference.repo}-${reference.file}`}>
            <div>
              <strong>{reference.repo}</strong>
              <span>{reference.license} / {reference.status}</span>
            </div>
            <code>{reference.file}</code>
            <p>{reference.reuseRule}</p>
          </article>
        ))}
      </div>

      {recipe.clientMediaRequests.length > 0 || recipe.requiredMedia.length > 0 ? (
        <div className="onia-webfactory-media">
          <ImageIcon size={15} />
          <div>
            <strong>Assets necesarios</strong>
            <p>{[...recipe.requiredMedia, ...recipe.clientMediaRequests].slice(0, 4).join(" / ")}</p>
          </div>
        </div>
      ) : null}

      {recipe.warnings.length > 0 ? (
        <div className="onia-webfactory-warnings">
          <AlertTriangle size={15} />
          <div>
            <strong>Warnings</strong>
            <p>{recipe.warnings.join(" / ")}</p>
          </div>
        </div>
      ) : null}

      <div className="onia-webfactory-next-command">
        <ShieldCheck size={15} />
        <code>{recipe.commands.buildPreview}</code>
      </div>
    </MotionArticle>
  );
}

function Artifact({
  icon: Icon,
  label,
  ready,
  path,
}: {
  icon: LucideIcon;
  label: string;
  ready: boolean;
  path: string;
}) {
  return (
    <div className={ready ? "is-ready" : "is-missing"}>
      <span>
        <Icon size={14} />
        {label}
      </span>
      <small>{ready ? "Listo" : "Falta"}</small>
      <code>{path}</code>
    </div>
  );
}

function StatusPill({ status, children }: { status: WebFactoryRecipeStatus; children: ReactNode }) {
  return <span className={`onia-webfactory-status is-${status}`}>{children}</span>;
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="onia-section-heading">
      <span>
        <Icon size={16} />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatRoleLabel(role: "arthur" | "sergio" | "area") {
  const labels = {
    arthur: "Arthur",
    sergio: "Sergio",
    area: "responsable de area",
  };

  return labels[role];
}
