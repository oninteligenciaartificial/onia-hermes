import { BookOpen, ShieldCheck } from "lucide-react";
import type { PlaybookItem } from "../types";
import { SectionPanel, StatusPill } from "./ui";

const playbookToneLabel = {
  success: "regla clave",
  info: "guia",
  warning: "revisar",
  danger: "riesgo",
  neutral: "nota",
} as const;

export function PlaybookSection({ playbook }: { playbook: PlaybookItem[] }) {
  return (
    <SectionPanel
      id="biblioteca"
      label="Biblioteca"
      title="Reglas para vender sin riesgo"
      description="Guia rapida para mantener consistencia comercial, evitar promesas peligrosas y saber cuando escalar a Sergio."
      icon={BookOpen}
      density="compact"
    >
      <div className="seller-library">
        {playbook.map((item) => (
          <article key={item.id}>
            <ShieldCheck size={16} />
            <div>
              <div>
                <strong>{item.title}</strong>
                <StatusPill tone={item.tone}>{playbookToneLabel[item.tone]}</StatusPill>
              </div>
              <p>{item.body}</p>
              <small>{item.detail}</small>
            </div>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}
