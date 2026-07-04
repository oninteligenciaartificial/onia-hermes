"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCopy, ClipboardList, MessageSquareText, Route } from "lucide-react";
import type { OpeningMessage, SalesDecision } from "../types";
import { SectionPanel } from "./ui";

export function SalesKitSection({
  decisions,
  messages,
  checklist,
}: {
  decisions: SalesDecision[];
  messages: OpeningMessage[];
  checklist: string[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
    } catch {
      // clipboard no disponible: se ignora, el texto sigue visible para copiar a mano
    }
  }

  return (
    <>
      <SectionPanel
        label="Guia"
        title="Como decidir que ofrecer"
        description="Regla rapida para elegir la oferta correcta segun lo que dice el cliente, sin improvisar."
        icon={Route}
        density="compact"
      >
        <div className="seller-decision-list">
          {decisions.map((decision) => (
            <article key={decision.id}>
              <span>{decision.situation}</span>
              <ArrowRight size={14} />
              <strong>{decision.offer}</strong>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        label="Apertura"
        title="Mensajes base"
        description="Primeros mensajes por tipo de negocio. Personalizar el nombre y el detalle antes de enviar."
        icon={MessageSquareText}
        density="compact"
      >
        <div className="seller-message-list">
          {messages.map((message) => (
            <article key={message.id}>
              <header>
                <strong>{message.audience}</strong>
                <button type="button" onClick={() => copy(message.id, message.message)}>
                  {copiedId === message.id ? (
                    <>
                      <Check size={13} /> Copiado
                    </>
                  ) : (
                    <>
                      <ClipboardCopy size={13} /> Copiar
                    </>
                  )}
                </button>
              </header>
              <p>{message.message}</p>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        label="CRM"
        title="Datos que debe registrar"
        description="Sin estos datos no hay comision aprobada ni seguimiento. Se cargan en ONIA Center / Notion."
        icon={ClipboardList}
        density="compact"
      >
        <ul className="seller-checklist">
          {checklist.map((item) => (
            <li key={item}>
              <Check size={14} />
              {item}
            </li>
          ))}
        </ul>
      </SectionPanel>
    </>
  );
}
