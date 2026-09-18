import {
  ASSET_PERMISSION_LABELS,
  type AssetPermission,
  type WebIntakeDraft,
} from "@/content/web-intake";
import styles from "./web-configurator.module.css";

type Props = {
  value: WebIntakeDraft;
  onChange: (field: keyof WebIntakeDraft, value: string) => void;
};

export function WebPreviewIntake({ value, onChange }: Props) {
  return (
    <fieldset className={`${styles.step} ${styles.intakeStep}`} id="datos-preview">
      <legend className={styles.stepTitle}>
        <span className={styles.stepNumber}>01</span>
        Poné tu negocio en el preview
      </legend>
      <p className={styles.stepHint}>Nombre, rubro y oferta cambian el preview al instante. Los campos con * son necesarios para enviar.</p>

      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span>Nombre del negocio *</span>
          <input type="text" autoComplete="organization" required value={value.businessName} onChange={(event) => onChange("businessName", event.target.value)} placeholder="Ej. Casa Norte" />
        </label>
        <label className={styles.formField}>
          <span>Rubro *</span>
          <input type="text" required value={value.industry} onChange={(event) => onChange("industry", event.target.value)} placeholder="Ej. Estudio de yoga" />
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>¿Qué ofrecés principalmente? *</span>
          <input type="text" required value={value.offer} onChange={(event) => onChange("offer", event.target.value)} placeholder="Ej. Clases para moverte, respirar y sentirte mejor" />
          <small>Este texto será el titular principal del preview.</small>
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>Descripción breve</span>
          <textarea rows={3} value={value.description} onChange={(event) => onChange("description", event.target.value)} placeholder="Contá en dos frases qué hacés y por qué deberían elegirte." />
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>Servicios o productos principales</span>
          <textarea rows={3} value={value.services} onChange={(event) => onChange("services", event.target.value)} placeholder={"Escribí hasta 3, uno por línea\nEj. Clases individuales\nTalleres para empresas"} />
        </label>
      </div>
    </fieldset>
  );
}

type RequestProps = Props & {
  missing: readonly string[];
};

export function WebRequestDetails({ value, missing, onChange }: RequestProps) {
  return (
    <fieldset className={`${styles.step} ${styles.requestStep}`} id="datos-solicitud">
      <legend className={styles.stepTitle}>
        <span className={styles.stepNumber}>08</span>
        Datos para enviar tu solicitud
      </legend>
      <p className={styles.stepHint}>Completá el contacto y los detalles que nos ayudan a entender exactamente qué necesitás.</p>

      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span>Tu nombre *</span>
          <input type="text" autoComplete="name" required value={value.contactName} onChange={(event) => onChange("contactName", event.target.value)} placeholder="Ej. Andrea Flores" />
        </label>
        <label className={styles.formField}>
          <span>WhatsApp *</span>
          <input type="tel" autoComplete="tel" required value={value.whatsapp} onChange={(event) => onChange("whatsapp", event.target.value)} placeholder="Ej. +591 70000000" />
        </label>
        <label className={styles.formField}>
          <span>Email</span>
          <input type="email" autoComplete="email" value={value.email} onChange={(event) => onChange("email", event.target.value)} placeholder="nombre@negocio.com" />
        </label>
        <label className={styles.formField}>
          <span>Ciudad</span>
          <input type="text" autoComplete="address-level2" value={value.city} onChange={(event) => onChange("city", event.target.value)} placeholder="Ej. Santa Cruz" />
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>¿Ya tenés web? Pegá el link</span>
          <input type="url" inputMode="url" value={value.currentUrl} onChange={(event) => onChange("currentUrl", event.target.value)} placeholder="https://tu-web-actual.com" />
          <small>Para no pedirte lo que ya está publicado.</small>
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>Web de referencia</span>
          <input type="url" inputMode="url" value={value.referenceUrl} onChange={(event) => onChange("referenceUrl", event.target.value)} placeholder="https://una-web-que-me-gusta.com" />
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>Fotografías para la web</span>
          <select value={value.assetPermission} onChange={(event) => onChange("assetPermission", event.target.value as AssetPermission)}>
            {Object.entries(ASSET_PERMISSION_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label className={`${styles.formField} ${styles.formFieldWide}`}>
          <span>¿Qué más necesitás?</span>
          <textarea rows={3} value={value.notes} onChange={(event) => onChange("notes", event.target.value)} placeholder="Páginas especiales, funciones, fechas, cosas que querés evitar..." />
        </label>
      </div>

      <div className={styles.formStatus} data-ready={missing.length === 0} aria-live="polite">
        <strong>{missing.length === 0 ? "Datos mínimos completos" : `Faltan ${missing.length} datos obligatorios`}</strong>
        <span>{missing.length === 0 ? "Ya podés enviar una solicitud clara." : missing.join(", ")}</span>
      </div>
      <p className={styles.privacyNote}>Nada se guarda mientras probás. Los datos se incluyen en el mensaje solo cuando decidís enviarlo por WhatsApp.</p>
    </fieldset>
  );
}
