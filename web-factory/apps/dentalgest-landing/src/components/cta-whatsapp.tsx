import { WHATSAPP_URL } from "@/lib/constants";

interface CtaWhatsAppProps {
  label: string;
  /** primary = teal; paper = boton papel para fondos teal (CTA final) */
  variant?: "primary" | "paper";
}

/** CTA WhatsApp click-to-chat (href unico de la landing). */
export function CtaWhatsApp({ label, variant = "primary" }: CtaWhatsAppProps) {
  const className = variant === "paper" ? "btn btn-paper" : "btn btn-primary";
  return (
    <a href={WHATSAPP_URL} className={className}>
      {label}
      <span className="btn-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}
