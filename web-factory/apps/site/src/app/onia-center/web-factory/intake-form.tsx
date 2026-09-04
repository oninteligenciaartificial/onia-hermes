"use client";

import { useMemo, useState } from "react";

type IntakeFormState = {
  name: string;
  slug: string;
  template: "landing" | "store";
  industry: string;
  offer: string;
  tagline: string;
  description: string;
  location: string;
  whatsapp: string;
  email: string;
  instagram: string;
  references: string;
  antiReferences: string;
  styleKeywords: string;
  logoText: string;
  primaryColor: string;
  accentColor: string;
  heroAsset: string;
  heroVideo: string;
  assetPermission: "client-owned" | "generate-ai" | "stock-licensed" | "pending";
  mediaNotes: string;
  services: string;
  benefits: string;
  categories: string;
  products: string;
  primaryCtaText: string;
  whatsappMessage: string;
  domain: string;
  hosting: string;
  paymentMethods: string;
  legalName: string;
  missing: string;
};

const initialState: IntakeFormState = {
  name: "",
  slug: "",
  template: "landing",
  industry: "",
  offer: "",
  tagline: "",
  description: "",
  location: "Bolivia",
  whatsapp: "",
  email: "",
  instagram: "",
  references: "",
  antiReferences: "",
  styleKeywords: "",
  logoText: "",
  primaryColor: "#0f766e",
  accentColor: "#f59e0b",
  heroAsset: "",
  heroVideo: "",
  assetPermission: "pending",
  mediaNotes: "",
  services: "",
  benefits: "",
  categories: "",
  products: "",
  primaryCtaText: "Solicitar informacion",
  whatsappMessage: "",
  domain: "",
  hosting: "Onia Web Factory",
  paymentMethods: "",
  legalName: "",
  missing: "",
};

export function WebFactoryIntakeForm() {
  const [form, setForm] = useState<IntakeFormState>(initialState);
  const [copied, setCopied] = useState("");
  const [runtimeStatus, setRuntimeStatus] = useState("");
  const [isSavingRuntime, setIsSavingRuntime] = useState(false);
  const intake = useMemo(() => buildIntake(form), [form]);
  const missing = useMemo(() => getMissing(form), [form]);
  const clientRequest = useMemo(() => buildClientRequest(form, missing), [form, missing]);
  const intakeJson = useMemo(() => JSON.stringify(intake, null, 2), [intake]);
  const nextCommand = useMemo(() => buildNextCommand(form), [form]);

  function update<K extends keyof IntakeFormState>(key: K, value: IntakeFormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.slug) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("No se pudo copiar");
    }
  }

  function downloadJson() {
    const blob = new Blob([intakeJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.slug || "web-factory-intake"}.intake.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function saveToOniaCenter() {
    const slug = form.slug || slugify(form.name) || "cliente-web";
    const now = new Date().toISOString();
    const noteId = `wf-intake-${slug}-${Date.now()}`;
    const taskId = `wf-preview-${slug}-${Date.now()}`;
    const missingText = missing.length ? missing.join(", ") : "sin faltantes criticos para preview interno";

    setIsSavingRuntime(true);
    setRuntimeStatus("Guardando intake en Onia Center...");

    try {
      const noteResponse = await postRuntimeEntity("note", {
        id: noteId,
        kind: "nota",
        title: `Web Factory intake: ${form.name || slug}`,
        detail: [
          clientRequest,
          "",
          `Comando siguiente: ${nextCommand}`,
          "",
          "JSON intake:",
          intakeJson,
        ].join("\n"),
        linkedTo: `web-factory:${slug}`,
        visibility: "team_safe",
        createdAt: now,
      });

      if (!noteResponse.ok) {
        setRuntimeStatus(noteResponse.message);
        return;
      }

      const taskResponse = await postRuntimeEntity("task", {
        id: taskId,
        projectId: "web-factory",
        title: `Preparar preview Web Factory: ${form.name || slug}`,
        assignedRole: "arthur",
        status: "todo",
        priority: missing.length ? "alta" : "media",
        evidence: [
          `Guardar intake como web-factory/data/intakes/${slug}.json.`,
          `Ejecutar: ${nextCommand}.`,
          "Revisar receta, assets, derechos, responsive, imagenes rotas y CTA.",
          `Faltantes: ${missingText}.`,
        ].join(" "),
        createdAt: now,
      });

      if (!taskResponse.ok) {
        setRuntimeStatus(taskResponse.message);
        return;
      }

      setRuntimeStatus("Intake guardado como nota y tarea en Onia Center.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el intake.";
      setRuntimeStatus(message);
    } finally {
      setIsSavingRuntime(false);
    }
  }

  return (
    <section className="onia-panel onia-webfactory-intake" id="web-factory-intake">
      <div className="onia-section-heading">
        <span>Formulario</span>
        <h2>Intake para generar una web</h2>
        <p>
          Carga los datos clave, referencias, imagenes y recursos. El resultado queda listo para convertirlo en perfil
          cliente y receta Web Factory.
        </p>
      </div>

      <div className="onia-webfactory-intake-grid">
        <fieldset>
          <legend>Datos del negocio</legend>
          <TextInput label="Nombre" value={form.name} onChange={(value) => update("name", value)} />
          <TextInput label="Slug" value={form.slug} onChange={(value) => update("slug", slugify(value))} />
          <label>
            Template
            <select value={form.template} onChange={(event) => update("template", event.target.value as IntakeFormState["template"])}>
              <option value="landing">Landing</option>
              <option value="store">Store</option>
            </select>
          </label>
          <TextInput label="Rubro" value={form.industry} onChange={(value) => update("industry", value)} />
          <TextInput label="Oferta principal" value={form.offer} onChange={(value) => update("offer", value)} />
          <TextInput label="Ciudad / pais" value={form.location} onChange={(value) => update("location", value)} />
          <TextInput label="Tagline" value={form.tagline} onChange={(value) => update("tagline", value)} />
          <TextArea label="Descripcion" value={form.description} onChange={(value) => update("description", value)} rows={3} />
        </fieldset>

        <fieldset>
          <legend>Marca y referencias</legend>
          <TextInput label="Logo texto" value={form.logoText} onChange={(value) => update("logoText", value)} />
          <div className="onia-webfactory-inline-fields">
            <TextInput label="Color principal" value={form.primaryColor} onChange={(value) => update("primaryColor", value)} />
            <TextInput label="Color acento" value={form.accentColor} onChange={(value) => update("accentColor", value)} />
          </div>
          <TextArea
            label="Referencias exactas (una URL por linea, opcional: titulo | url | usar | evitar)"
            value={form.references}
            onChange={(value) => update("references", value)}
            rows={4}
          />
          <TextArea
            label="Anti-referencias (lo que NO debe parecer)"
            value={form.antiReferences}
            onChange={(value) => update("antiReferences", value)}
            rows={3}
          />
          <TextArea
            label="Palabras de estilo"
            value={form.styleKeywords}
            onChange={(value) => update("styleKeywords", value)}
            rows={2}
          />
        </fieldset>

        <fieldset>
          <legend>Imagenes y recursos</legend>
          <label>
            Permiso de assets
            <select value={form.assetPermission} onChange={(event) => update("assetPermission", event.target.value as IntakeFormState["assetPermission"])}>
              <option value="pending">Pendiente</option>
              <option value="client-owned">Cliente envia assets propios</option>
              <option value="generate-ai">Onia puede generar imagenes IA</option>
              <option value="stock-licensed">Usar stock/licencia aprobada</option>
            </select>
          </label>
          <TextInput label="Hero imagen/poster" value={form.heroAsset} onChange={(value) => update("heroAsset", value)} />
          <TextInput label="Hero video" value={form.heroVideo} onChange={(value) => update("heroVideo", value)} />
          <TextArea
            label="Notas de media"
            value={form.mediaNotes}
            onChange={(value) => update("mediaNotes", value)}
            rows={3}
          />
          <TextArea label="Beneficios (uno por linea)" value={form.benefits} onChange={(value) => update("benefits", value)} rows={3} />
          <TextArea label="Servicios (titulo | descripcion)" value={form.services} onChange={(value) => update("services", value)} rows={3} />
        </fieldset>

        <fieldset>
          <legend>Tienda, contacto y operacion</legend>
          <TextArea label="Categorias (una por linea)" value={form.categories} onChange={(value) => update("categories", value)} rows={2} />
          <TextArea
            label="Productos (titulo | categoria | precio | descripcion | imagen)"
            value={form.products}
            onChange={(value) => update("products", value)}
            rows={4}
          />
          <TextInput label="WhatsApp" value={form.whatsapp} onChange={(value) => update("whatsapp", value)} />
          <TextInput label="Email" value={form.email} onChange={(value) => update("email", value)} />
          <TextInput label="Instagram" value={form.instagram} onChange={(value) => update("instagram", value)} />
          <TextInput label="CTA principal" value={form.primaryCtaText} onChange={(value) => update("primaryCtaText", value)} />
          <TextArea label="Mensaje WhatsApp" value={form.whatsappMessage} onChange={(value) => update("whatsappMessage", value)} rows={2} />
          <TextInput label="Dominio" value={form.domain} onChange={(value) => update("domain", value)} />
          <TextInput label="Hosting" value={form.hosting} onChange={(value) => update("hosting", value)} />
          <TextInput label="Metodos de pago" value={form.paymentMethods} onChange={(value) => update("paymentMethods", value)} />
          <TextInput label="Razon social/legal" value={form.legalName} onChange={(value) => update("legalName", value)} />
        </fieldset>
      </div>

      <div className="onia-webfactory-intake-output">
        <article>
          <div>
            <strong>Pendientes</strong>
            <span>{missing.length ? `${missing.length} faltante(s)` : "Listo para preview interno"}</span>
          </div>
          <ul>
            {(missing.length ? missing : ["Sin pendientes criticos para preview inicial."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <div>
            <strong>Mensaje para pedir recursos</strong>
            <button type="button" onClick={() => copyText("mensaje", clientRequest)}>
              Copiar
            </button>
          </div>
          <pre>{clientRequest}</pre>
        </article>

        <article>
          <div>
            <strong>JSON intake</strong>
            <span>{copied}</span>
          </div>
          <div className="onia-webfactory-intake-actions">
            <button type="button" onClick={() => copyText("json", intakeJson)}>
              Copiar JSON
            </button>
            <button type="button" onClick={downloadJson}>
              Descargar JSON
            </button>
            <button type="button" onClick={saveToOniaCenter} disabled={isSavingRuntime}>
              {isSavingRuntime ? "Guardando..." : "Guardar en Onia Center"}
            </button>
          </div>
          {runtimeStatus ? <p className="onia-webfactory-runtime-status">{runtimeStatus}</p> : null}
          <code className="onia-webfactory-next-command-inline">{nextCommand}</code>
          <pre>{intakeJson}</pre>
        </article>
      </div>
    </section>
  );
}

async function postRuntimeEntity(entity: "note" | "task", data: unknown): Promise<{ ok: boolean; message: string }> {
  const response = await fetch("/api/onia-center/runtime", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ entity, data }),
  });
  const result = await response.json().catch(() => null) as { ok?: boolean; message?: string; mode?: string } | null;

  if (!response.ok || !result?.ok) {
    const mode = result?.mode ? `${result.mode}: ` : "";
    return {
      ok: false,
      message: `${mode}${result?.message ?? "Runtime Onia Center no disponible. Copia/descarga el JSON y guardalo manualmente."}`,
    };
  }

  return { ok: true, message: "Guardado." };
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label>
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} />
    </label>
  );
}

function buildIntake(form: IntakeFormState) {
  return {
    project: {
      slug: form.slug || slugify(form.name) || "cliente-web",
      template: form.template,
      package: "web-factory",
      owner: "Onia",
    },
    business: {
      name: form.name,
      industry: form.industry,
      offer: form.offer,
      tagline: form.tagline,
      description: form.description,
      location: form.location,
      trustProofs: splitLines(form.benefits).slice(0, 4),
    },
    brand: {
      logoText: form.logoText,
      colors: {
        primary: form.primaryColor || undefined,
        accent: form.accentColor || undefined,
      },
      typography: { heading: "Onest", body: "Onest" },
      styleKeywords: splitLines(form.styleKeywords),
      references: parseReferences(form.references, "visual"),
      antiReferences: parseReferences(form.antiReferences, "anti-reference"),
    },
    media: {
      heroVideo: form.heroVideo,
      heroPoster: form.heroAsset,
      heroImage: form.heroAsset,
      assetPermission: form.assetPermission,
      notes: form.mediaNotes,
    },
    content: {
      services: parseServices(form.services),
      benefits: splitLines(form.benefits),
      categories: splitLines(form.categories),
      products: parseProducts(form.products),
    },
    conversion: {
      primaryCtaText: form.primaryCtaText,
      whatsappMessage: form.whatsappMessage,
    },
    contact: {
      email: form.email,
      whatsapp: form.whatsapp,
      address: form.location,
    },
    social: {
      instagram: form.instagram,
    },
    operations: {
      domain: form.domain,
      hosting: form.hosting,
      paymentMethods: splitComma(form.paymentMethods),
      legalName: form.legalName,
      missing: splitLines(form.missing),
    },
  };
}

function getMissing(form: IntakeFormState) {
  const missing = new Set(splitLines(form.missing));
  if (!form.name) missing.add("nombre del negocio");
  if (!form.industry) missing.add("rubro");
  if (!form.offer) missing.add("oferta principal");
  if (!form.logoText) missing.add("logo o texto de marca");
  if (!splitLines(form.references).length) missing.add("referencias visuales exactas");
  if (!form.heroAsset && !form.heroVideo) missing.add("imagen/video hero o permiso para generarlo");
  if (!form.whatsapp && !form.email) missing.add("canal de conversion");
  if (form.template === "store" && !splitLines(form.products).length) missing.add("productos con precio, descripcion e imagen");
  if (form.template === "store" && !splitComma(form.paymentMethods).length) missing.add("metodos de pago");
  if (!form.domain) missing.add("dominio o decision de hosting");
  return Array.from(missing);
}

function buildClientRequest(form: IntakeFormState, missing: string[]) {
  const name = form.name || "tu negocio";
  return [
    `Para crear la web de ${name} necesito estos datos y recursos:`,
    "",
    "1. Logo o texto exacto de marca.",
    "2. 3 a 6 referencias de webs que te gustan, con que usar y que evitar.",
    "3. Imagen principal o permiso para generar imagen IA/usar stock licenciado.",
    "4. Fotos reales de productos, local, equipo, trabajos o casos.",
    "5. Oferta principal, beneficios, servicios y preguntas frecuentes.",
    "6. WhatsApp/email, redes, dominio, hosting y metodos de pago si es tienda.",
    "7. Precios, politicas comerciales y razon social si corresponde.",
    "",
    missing.length ? `Pendiente ahora: ${missing.join(", ")}.` : "Con esto ya se puede preparar preview interno.",
    "",
    "Nota: Onia revisa alcance, precio y permisos antes de enviar o publicar la web.",
  ].join("\n");
}

function buildNextCommand(form: IntakeFormState) {
  const slug = form.slug || slugify(form.name) || "cliente-web";
  return `pnpm factory:build -- --input data/intakes/${slug}.json --force`;
}

function parseReferences(value: string, fallbackType: "visual" | "anti-reference") {
  return splitLines(value).map((line) => {
    const [titleOrUrl, url, use, avoid] = line.split("|").map((item) => item.trim());
    const resolvedUrl = url || titleOrUrl;
    return {
      title: url ? titleOrUrl : "",
      url: resolvedUrl,
      type: fallbackType,
      use: use || "",
      avoid: avoid || "",
    };
  });
}

function parseServices(value: string) {
  return splitLines(value).map((line) => {
    const [title, description] = line.split("|").map((item) => item.trim());
    return { title, description: description || title, icon: "sparkles" };
  });
}

function parseProducts(value: string) {
  return splitLines(value).map((line) => {
    const [title, category, price, description, image] = line.split("|").map((item) => item.trim());
    return {
      title,
      category: category || "General",
      price: price || "Consultar",
      description: description || title,
      image: image || "",
    };
  });
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
