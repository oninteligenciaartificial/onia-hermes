import type { FormEvent } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import type { Idea, Tone } from "../types";
import { SectionPanel, StatusPill } from "./ui";

const ideaTone: Record<Idea["stage"], Tone> = {
  nueva: "neutral",
  revisar: "warning",
  aprobada: "success",
};

export function IdeasSection({
  ideas,
  ideaForm,
  onChange,
  onSubmit,
}: {
  ideas: Idea[];
  ideaForm: { title: string; body: string };
  onChange: (value: { title: string; body: string }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionPanel
      id="ideas"
      label="Aprendizaje comercial"
      title="Ideas, nichos y oportunidades"
      description="Las ideas de ventas son materia prima para nuevos paquetes. Se guardan con senal y estado para revisar con Sergio."
      icon={Sparkles}
      density="compact"
    >
      <form className="seller-mini-form" onSubmit={onSubmit}>
        <input
          value={ideaForm.title}
          onChange={(event) => onChange({ ...ideaForm, title: event.target.value })}
          placeholder="Idea, nicho o paquete"
        />
        <textarea
          value={ideaForm.body}
          onChange={(event) => onChange({ ...ideaForm, body: event.target.value })}
          placeholder="Que se podria vender o mejorar"
        />
        <button type="submit">
          <Lightbulb size={15} />
          Guardar idea
        </button>
      </form>

      <div className="seller-ideas">
        {ideas.map((idea) => (
          <article key={idea.id}>
            <Lightbulb size={15} />
            <div>
              <div>
                <strong>{idea.title}</strong>
                <StatusPill tone={ideaTone[idea.stage]}>{idea.stage}</StatusPill>
              </div>
              <p>{idea.body}</p>
              <small>{idea.signal}</small>
            </div>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}
