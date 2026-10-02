"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { RequisitosGate } from "@/components/requisitos-gate";
import { REQUISITOS_WEB } from "@/content/requisitos";
import {
  DEFAULT_LAYOUT_BY_DIRECTION,
  isWebDirectionId,
  isWebLayoutId,
  isWebStackId,
  WEB_DIRECTIONS,
  WEB_FONTS,
  WEB_GOALS,
  WEB_LAYOUTS,
  WEB_PALETTES,
  type WebDirectionId,
  type WebFontId,
  type WebGoalId,
  type WebLayoutId,
  type WebPaletteId,
} from "@/content/web-configurator";
import {
  ASSET_PERMISSION_LABELS,
  EMPTY_WEB_INTAKE,
  getMissingWebIntakeFields,
  intakeCards,
  type WebIntakeDraft,
} from "@/content/web-intake";
import { CUIDADO_WEB, WEB_ADDONS, WEB_STACKS, precioWeb, type WebStackId } from "@/content/webs";
import type { AssistantPlan } from "@/content/web-assistant";
import { WebAssistant } from "./WebAssistant";
import { WebPreviewIntake, WebRequestDetails } from "./WebIntakeForm";
import { WebsitePreview, type WebsitePreviewContent } from "./WebsitePreview";
import styles from "./web-configurator.module.css";
import { decodePlatformSelection, platformRequestUrl } from "./platform-bridge";

type PreviewStyle = CSSProperties & Record<`--preview-${string}`, string>;
type CareId = "ninguno" | "basico" | "crecimiento" | "pro";

const CARE_INDEX: Record<Exclude<CareId, "ninguno">, number> = {
  basico: 0,
  crecimiento: 1,
  pro: 2,
};

const SCOPE_COPY: Record<WebStackId, { label: string; description: string }> = {
  landing: { label: "Esencial", description: "Una página, una oferta y una acción principal." },
  profesional: { label: "Completa", description: "Servicios, credenciales, proceso, preguntas y contacto." },
  pro: { label: "A medida", description: "Dirección de arte, copy de ONIA y seguimiento básico." },
  tienda: { label: "Catálogo", description: "Productos, carrito y pedido armado por WhatsApp." },
  ecommerce: { label: "Plataforma", description: "Shopify, Hotmart o Whop: frontend tuyo; cobro y entrega de la plataforma." },
};

const NEUTRAL_PREVIEW_CARDS = [
  { eyebrow: "Tu oferta", title: "Qué ofrecemos.", detail: "Ver servicios" },
  { eyebrow: "Nuestro proceso", title: "Cómo trabajamos.", detail: "Conocé el proceso" },
  { eyebrow: "Contacto", title: "Hablemos.", detail: "Escribinos" },
] as const;

function formatBs(value: number): string {
  return `Bs ${value.toLocaleString("es-BO")}`;
}

function colorLuminance(hex: string): number | null {
  const value = hex.replace("#", "");
  const parts = value.length === 3 ? value.split("").map((part) => part + part) : value.match(/.{2}/g);
  if (!parts || parts.length !== 3) return null;

  const [r, g, b] = parts.map((part) => {
    const channel = parseInt(part, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = colorLuminance(first);
  const secondLuminance = colorLuminance(second);
  if (firstLuminance === null || secondLuminance === null) return 1;
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastText(hex: string): string {
  const luminance = colorLuminance(hex);
  if (luminance === null) return "#ffffff";
  return 1.05 / (luminance + 0.05) >= 4.5 ? "#ffffff" : "#000000";
}

type Props = {
  /** Pestaña «Más información»: las especificaciones exactas de cada web. */
  especificaciones?: ReactNode;
};

export function WebConfigurator({ especificaciones }: Props) {
  const [tab, setTab] = useState<"configurador" | "info">("configurador");
  const [directionId, setDirectionId] = useState<WebDirectionId>("minimalista");
  const [layoutId, setLayoutId] = useState<WebLayoutId>("centrada");
  const [paletteId, setPaletteId] = useState<WebPaletteId>("papel-verde");
  const [accent, setAccent] = useState("#079E68");
  const [fontId, setFontId] = useState<WebFontId>("archivo");
  const [goalId, setGoalId] = useState<WebGoalId>("contactos");
  const [stackId, setStackId] = useState<WebStackId>("profesional");
  const [intake, setIntake] = useState<WebIntakeDraft>(EMPTY_WEB_INTAKE);
  const [crmAddon, setCrmAddon] = useState(false);
  const [careId, setCareId] = useState<CareId>("ninguno");
  const [origin, setOrigin] = useState<"onia" | "sergio">("onia");
  const [platformMode, setPlatformMode] = useState(false);
  const [bridgeError, setBridgeError] = useState("");
  const [mobilePane, setMobilePane] = useState<"opciones" | "preview">("opciones");

  function showMobilePane(pane: "opciones" | "preview") {
    setMobilePane(pane);
    requestAnimationFrame(() => document.getElementById("configurador-vistas")?.scrollIntoView({ block: "start" }));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presetDirection = params.get("estilo");
    const presetLayout = params.get("estructura");
    const presetStack = params.get("paquete");
    if (params.get("origen") === "sergio") setOrigin("sergio");
    if (params.get("origen") === "platform") setPlatformMode(true);

    if (isWebDirectionId(presetDirection)) {
      setDirectionId(presetDirection);
      setLayoutId(DEFAULT_LAYOUT_BY_DIRECTION[presetDirection]);
    }
    if (isWebLayoutId(presetLayout)) setLayoutId(presetLayout);
    if (isWebStackId(presetStack)) setStackId(presetStack);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("visual")) {
      const selected = Array.from(fragment.keys()).length === 1 ? decodePlatformSelection(fragment.get("visual")) : null;
      if (selected) {
        setDirectionId(selected.direction);
        setLayoutId(selected.layout);
        setPaletteId(selected.palette);
        setAccent(selected.accent);
        setFontId(selected.font);
        setGoalId(selected.goal);
        setStackId(selected.stack);
      } else setBridgeError("La selección recibida no es válida. Elegí una vista de referencia antes de continuar.");
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  const direction = WEB_DIRECTIONS.find((item) => item.id === directionId) ?? WEB_DIRECTIONS[0];
  const layout = WEB_LAYOUTS.find((item) => item.id === layoutId) ?? WEB_LAYOUTS[0];
  const palette = WEB_PALETTES.find((item) => item.id === paletteId) ?? WEB_PALETTES[0];
  const font = WEB_FONTS.find((item) => item.id === fontId) ?? WEB_FONTS[0];
  const goal = WEB_GOALS.find((item) => item.id === goalId) ?? WEB_GOALS[0];
  const stack = WEB_STACKS.find((item) => item.id === stackId) ?? WEB_STACKS[0];
  const crm = WEB_ADDONS[0];
  const care = careId === "ninguno" ? null : CUIDADO_WEB[CARE_INDEX[careId]];
  const estimatedTotal = stack.precio === null ? null : stack.precio + (crmAddon ? crm.precio : 0);
  const missingIntake = getMissingWebIntakeFields(intake);
  const missingPreviewBasics = !intake.businessName.trim() || !intake.industry.trim() || !intake.offer.trim();
  const customCards = useMemo(() => intakeCards(intake.services), [intake.services]);
  const hasBusinessContent = Boolean(intake.businessName.trim() || intake.industry.trim() || intake.offer.trim());

  const previewContent = useMemo<WebsitePreviewContent>(() => ({
    brand: intake.businessName.trim() || direction.marca,
    eyebrow: intake.industry.trim() || direction.promesa,
    headline: intake.offer.trim() || direction.hero,
    description: intake.description.trim() || (hasBusinessContent
      ? `Conocé la propuesta de ${intake.businessName.trim() || "este negocio"}, sus servicios y la forma más simple de comunicarte.`
      : direction.subcopy),
    cards: customCards.length ? customCards : hasBusinessContent ? NEUTRAL_PREVIEW_CARDS : direction.cards,
  }), [customCards, direction, hasBusinessContent, intake.businessName, intake.description, intake.industry, intake.offer]);

  function updateIntake(field: keyof WebIntakeDraft, value: string) {
    setIntake((current) => ({ ...current, [field]: value }));
  }

  /** El asistente (paso 00) deja todos los pasos elegidos y lleva al preview. */
  function applyPlan(plan: AssistantPlan) {
    const chosenPalette = WEB_PALETTES.find((item) => item.id === plan.palette) ?? WEB_PALETTES[0];
    setDirectionId(plan.direction);
    setLayoutId(plan.layout);
    setPaletteId(chosenPalette.id);
    setAccent(chosenPalette.accent);
    setFontId(plan.font);
    setGoalId(plan.goal);
    setStackId(plan.stack);
    setIntake((current) => ({
      ...current,
      businessName: plan.intake.businessName,
      industry: plan.intake.industry || current.industry,
      offer: plan.intake.offer,
      services: plan.intake.services || current.services,
      description: plan.intake.description || current.description,
      city: plan.intake.city || current.city,
    }));
    showMobilePane("preview");
  }

  const previewStyle = useMemo<PreviewStyle>(
    () => ({
      "--preview-bg": palette.background,
      "--preview-surface": palette.surface,
      "--preview-ink": palette.ink,
      "--preview-muted": palette.muted,
      "--preview-accent": accent,
      "--preview-accent-contrast": contrastText(accent),
      "--preview-accent-readable": contrastRatio(accent, palette.background) >= 4.5 ? accent : palette.ink,
      "--preview-display": font.css,
      "--preview-body": font.css,
    }),
    [accent, font.css, palette],
  );

  const mensaje = [
    estimatedTotal === null
      ? "Hola, vengo del configurador de webs de ONIA y quiero agendar una llamada para cerrar mi web."
      : "Hola, vengo del configurador de webs de ONIA.",
    ...(origin === "sergio" ? ["Llegué desde la página de Sergio."] : []),
    "DATOS DEL NEGOCIO",
    `Contacto: ${intake.contactName}.`,
    `Negocio: ${intake.businessName}.`,
    `Rubro y ciudad: ${intake.industry}${intake.city ? `, ${intake.city}` : ""}.`,
    `WhatsApp: ${intake.whatsapp}.`,
    ...(intake.email ? [`Email: ${intake.email}.`] : []),
    `Oferta principal: ${intake.offer.replace(/\.\s*$/, "")}.`,
    ...(intake.description ? [`Descripción: ${intake.description}`] : []),
    ...(intake.services ? [`Servicios o productos: ${intake.services.replace(/\r?\n/g, "; ")}`] : []),
    `Fotografías: ${ASSET_PERMISSION_LABELS[intake.assetPermission]}.`,
    ...(intake.currentUrl ? [`Web actual: ${intake.currentUrl}`] : []),
    ...(intake.referenceUrl ? [`Referencia: ${intake.referenceUrl}`] : []),
    ...(intake.notes ? [`Necesidades adicionales: ${intake.notes}`] : []),
    "",
    "ALCANCE Y PRECIO",
    `Nivel: ${SCOPE_COPY[stack.id].label}, ${stack.nombre}.`,
    `Precio base: ${precioWeb(stack)}.`,
    ...(crmAddon ? [`Extra: ${crm.nombre}, ${formatBs(crm.precio)} setup.`] : []),
    `Estimado de construcción: ${estimatedTotal === null ? "lo cerramos en una llamada" : formatBs(estimatedTotal)}.`,
    ...(estimatedTotal === null ? [] : [`Forma de pago 50/50: ${formatBs(estimatedTotal / 2)} para comenzar y ${formatBs(estimatedTotal / 2)} contra entrega.`]),
    `Cuidado web: ${care ? `${care.nombre}, ${formatBs(care.mensual)}/mes` : "sin plan mensual por ahora"}.`,
    "",
    "DISEÑO ELEGIDO",
    `Dirección visual: ${direction.nombre}.`,
    `Estructura: ${layout.nombre} (${layout.orden.join(" → ")}).`,
    `Paleta: ${palette.nombre}. Color principal elegido: ${accent}.`,
    `Tipografía: ${font.nombre}.`,
    `Objetivo principal: ${goal.nombre}.`,
  ].join("\n");

  return (
    <div className={styles.shell} id="configurador">
      {especificaciones && (
        <div className={styles.tabs} role="tablist" aria-label="Configurador o especificaciones">
          <button type="button" role="tab" id="tab-configurador" aria-selected={tab === "configurador"} aria-controls="panel-configurador" className={`${styles.tab} ${tab === "configurador" ? styles.tabOn : ""}`} onClick={() => setTab("configurador")}>
            Armá tu web
          </button>
          <button type="button" role="tab" id="tab-info" aria-selected={tab === "info"} aria-controls="panel-info" className={`${styles.tab} ${tab === "info" ? styles.tabOn : ""}`} onClick={() => setTab("info")}>
            Más información
          </button>
        </div>
      )}

      {/* Siempre en el HTML servido (precios y especificaciones indexables);
          sólo se oculta con `hidden` cuando la pestaña activa es la otra. */}
      {especificaciones && (
        <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" hidden={tab !== "info"}>
          {especificaciones}
        </div>
      )}

      <div id="panel-configurador" role="tabpanel" aria-labelledby="tab-configurador" hidden={tab !== "configurador"}>
      <div className={styles.intro}>
        <p className="kicker">Configurador en vivo</p>
        <h2 className="h2">Tu idea toma forma aquí.</h2>
        <p className="lead">
          El preview usa los datos que escribís. Las fotografías son referenciales y el diseño final se adapta a tu negocio.
        </p>
      </div>

      <div className={styles.mobileTabs} aria-label="Vistas del configurador">
        <button type="button" aria-pressed={mobilePane === "opciones"} onClick={() => showMobilePane("opciones")}>Opciones</button>
        <button type="button" aria-pressed={mobilePane === "preview"} onClick={() => showMobilePane("preview")}>Vista previa ↗</button>
      </div>

      <div className={styles.workspace} data-mobile-pane={mobilePane} id="configurador-vistas">
        <div className={styles.controls} aria-label="Opciones de diseño web">
          <WebAssistant onApply={applyPlan} />

          <WebPreviewIntake value={intake} onChange={updateIntake} />

          <fieldset className={styles.step}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>02</span>
              ¿Qué tiene que lograr?
            </legend>
            <div className={styles.goalGrid}>
              {WEB_GOALS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.goalOption} ${item.id === goalId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === goalId}
                  onClick={() => setGoalId(item.id)}
                >
                  <span className={styles.optionName}>{item.nombre}</span>
                  <span className={styles.optionDescription}>{item.descripcion}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={`${styles.step} ${styles.scopeStep}`}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>03</span>
              ¿Cuánta web?
            </legend>
            <p className={styles.stepHint}>Elegís cuánta web, y la ves antes de pagar: el preview cambia con cada nivel. Una pantalla, una web completa, una a medida, una tienda, un ecommerce. Si pedís algo fuera del alcance, lo confirmamos antes de empezar.</p>
            <div className={styles.scopeGrid}>
              {WEB_STACKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.scopeOption} ${item.id === stackId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === stackId}
                  onClick={() => setStackId(item.id)}
                >
                  <span className={styles.scopeLevel}>{SCOPE_COPY[item.id].label}</span>
                  <strong>{item.nombre}</strong>
                  <span className={styles.scopeDescription}>{SCOPE_COPY[item.id].description}</span>
                  <span className={styles.packagePrice}>{precioWeb(item)}</span>
                </button>
              ))}
            </div>

            {!platformMode && <div className={styles.quoteOptions}>
              <label className={styles.checkOption}>
                <input type="checkbox" checked={crmAddon} onChange={(event) => setCrmAddon(event.target.checked)} />
                <span><strong>{crm.nombre}</strong><small>{crm.descripcion}</small></span>
                <b>+ {formatBs(crm.precio)}</b>
              </label>
              <label className={styles.formField}>
                <span>Mantenimiento después de publicar</span>
                <select value={careId} onChange={(event) => setCareId(event.target.value as CareId)}>
                  <option value="ninguno">Sin plan mensual por ahora</option>
                  {(Object.keys(CARE_INDEX) as Exclude<CareId, "ninguno">[]).map((id) => {
                    const plan = CUIDADO_WEB[CARE_INDEX[id]];
                    return (
                      <option key={id} value={id}>
                        {plan.nombre}, {formatBs(plan.mensual)}/mes
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>}

            <div className={styles.quoteSummary} aria-live="polite">
              <span>Estimado de construcción</span>
              <strong>{estimatedTotal === null ? "A cotizar" : formatBs(estimatedTotal)}</strong>
              {estimatedTotal === null ? (
                <p>Esto no se arma solo: lo vemos con vos en una llamada, con el preview delante, y te damos precio cerrado.</p>
              ) : (
                <div className={styles.paymentSplit}>
                  <span><b>{formatBs(estimatedTotal / 2)}</b> para comenzar</span>
                  <span><b>{formatBs(estimatedTotal / 2)}</b> contra entrega</span>
                </div>
              )}
              {care && <small>Después: {care.nombre} por {formatBs(care.mensual)}/mes.</small>}
              <small>Dominio, hosting, fotos profesionales y herramientas externas se pagan aparte.</small>
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>04</span>
              La vibe: cómo se siente
            </legend>
            <div className={styles.optionGrid}>
              {WEB_DIRECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.option} ${item.id === directionId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === directionId}
                  onClick={() => { setDirectionId(item.id); setLayoutId(DEFAULT_LAYOUT_BY_DIRECTION[item.id]); }}
                >
                  <span className={styles.optionName}>{item.nombre}</span>
                  <span className={styles.optionDescription}>{item.descripcion}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.step}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>05</span>
              Estructura de la página
            </legend>
            <p className={styles.stepHint}>Cómo arranca la página: dónde va la foto y cómo entra el titular. La vibe elige una; podés cambiarla.</p>
            <div className={styles.layoutGrid}>
              {WEB_LAYOUTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.layoutOption} ${item.id === layoutId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === layoutId}
                  onClick={() => setLayoutId(item.id)}
                >
                  <span className={styles.layoutGlyph} data-layout={item.id} aria-hidden="true"><i /><i /><i /></span>
                  <span><span className={styles.optionName}>{item.nombre}</span><span className={styles.optionDescription}>{item.descripcion}</span></span>
                </button>
              ))}
            </div>
            <p className={styles.sectionOrder}>Orden: {layout.orden.join(" → ")}</p>
          </fieldset>

          <fieldset className={styles.step}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>06</span>
              Colores de marca
            </legend>
            <div className={styles.paletteGrid}>
              {WEB_PALETTES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.paletteOption} ${item.id === paletteId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === paletteId}
                  onClick={() => {
                    setPaletteId(item.id);
                    setAccent(item.accent);
                  }}
                >
                  <span className={styles.swatches} aria-hidden="true">
                    {item.swatches.map((swatch) => (
                      <span key={swatch} className={styles.swatch} style={{ backgroundColor: swatch }} />
                    ))}
                  </span>
                  <span>
                    <span className={styles.optionName}>{item.nombre}</span>
                    <span className={styles.optionDescription}>{item.descripcion}</span>
                  </span>
                </button>
              ))}
            </div>
            <label className={styles.customColor}>
              <span>O probá tu color de marca</span>
              <span className={styles.customColorControl}>
                <input
                  type="color"
                  value={accent}
                  aria-label="Elegir color de marca"
                  onChange={(event) => setAccent(event.target.value.toUpperCase())}
                />
                <code>{accent}</code>
              </span>
            </label>
          </fieldset>

          <fieldset className={styles.step}>
            <legend className={styles.stepTitle}>
              <span className={styles.stepNumber}>07</span>
              Tipografía
            </legend>
            <div className={styles.fontGrid}>
              {WEB_FONTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.fontOption} ${item.id === fontId ? styles.optionOn : ""}`}
                  aria-pressed={item.id === fontId}
                  onClick={() => setFontId(item.id)}
                >
                  <span className={styles.fontSample} style={{ fontFamily: item.css }}>
                    {item.muestra}
                  </span>
                  <span className={styles.optionName}>{item.nombre}</span>
                  <span className={styles.optionDescription}>{item.descripcion}</span>
                </button>
              ))}
            </div>
          </fieldset>

        </div>

        <div className={styles.previewColumn}>
          <div className={styles.previewFrame}>
            <div className={styles.previewToolbar}>
              <span className={styles.previewLive}><i /> Preview vivo</span>
              <span>{stack.nombre} · {direction.nombre}</span>
            </div>
            <WebsitePreview direction={direction} layout={layout} goal={goal} stack={stack.id} previewStyle={previewStyle} content={previewContent} />
          </div>

          <div className={styles.selection} aria-live="polite">
            <div>
              <span className={styles.selectionLabel}>Tu selección inicial</span>
              <strong>{layout.nombre} · {direction.nombre}</strong>
              <span>{palette.nombre} · {font.nombre} · {goal.nombre}</span>
            </div>
            <div className={styles.selectionPrice}>
              <span>{SCOPE_COPY[stack.id].label} · {stack.nombre}</span>
              <strong>{estimatedTotal === null ? "A cotizar" : formatBs(estimatedTotal)}</strong>
              {care && <small>+ {formatBs(care.mensual)}/mes</small>}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.order}>
        <div className={styles.orderIntro}>
          <p className="kicker">Siguiente paso</p>
          <h3 className="h3">{platformMode ? "Llevá tu elección a Mi web." : "Mandanos esta dirección y la aterrizamos a tu negocio."}</h3>
          <p>
            {platformMode ? "Esta vista es una referencia. En Mi web podrás confirmar la selección y guardar tu pedido. ONIA confirma alcance y precio antes de empezar." : "La selección es un punto de partida, no una plantilla cerrada. En WhatsApp confirmamos contenido, alcance, plazo y el precio final si necesitás extras."}
          </p>
        </div>
        <div className={styles.orderFlow}>
          {bridgeError && <p role="alert">{bridgeError}</p>}
          {platformMode ? <div>
            <a className="btn btn-primary" href={platformRequestUrl({ version: 1, goal: goalId, layout: layoutId, direction: directionId, palette: paletteId, accent, font: fontId, stack: stackId })} target="_blank" rel="noopener noreferrer">Continuar en Mi web</a>
            <p className={styles.stepHint}>Sólo viajan tus preferencias visuales. Tus datos de contacto se completan en tu cuenta. Si necesitás iniciar sesión, retomarás la selección al terminar.</p>
          </div> : <>
          <WebRequestDetails value={intake} missing={missingIntake} onChange={updateIntake} />
          <RequisitosGate
            req={REQUISITOS_WEB}
            mensaje={mensaje}
            cta={estimatedTotal === null ? "Pedir una llamada por WhatsApp" : `Pedir mi ${stack.nombre} por WhatsApp`}
            ready={missingIntake.length === 0}
            blockedHint={`Completá estos datos antes de enviar: ${missingIntake.join(", ")}.`}
            blockedTargetId={missingPreviewBasics ? "datos-preview" : "datos-solicitud"}
          />
          </>}
        </div>
      </div>
      </div>
    </div>
  );
}
