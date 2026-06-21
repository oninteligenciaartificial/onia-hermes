import type { FormEvent } from "react";
import { FileText, MessageSquareText } from "lucide-react";
import type { Note, Tone } from "../types";
import { SectionPanel, StatusPill } from "./ui";

const noteTone: Record<Note["type"], Tone> = {
  nota: "info",
  objecion: "warning",
  riesgo: "danger",
  promesa: "danger",
  pregunta: "neutral",
};

export function NotesSection({
  notes,
  noteForm,
  onChange,
  onSubmit,
}: {
  notes: Note[];
  noteForm: { title: string; body: string };
  onChange: (value: { title: string; body: string }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionPanel
      id="notas"
      label="Llamadas"
      title="Notas importantes"
      description="Todo lo prometido, preguntado u objetado debe quedar escrito para proteger margen, entrega e imagen profesional."
      icon={MessageSquareText}
      density="compact"
    >
      <form className="seller-mini-form" onSubmit={onSubmit}>
        <input
          value={noteForm.title}
          onChange={(event) => onChange({ ...noteForm, title: event.target.value })}
          placeholder="Titulo de la nota"
        />
        <textarea
          value={noteForm.body}
          onChange={(event) => onChange({ ...noteForm, body: event.target.value })}
          placeholder="Objecion, promesa, pregunta tecnica o siguiente paso"
        />
        <button type="submit">
          <FileText size={15} />
          Anotar
        </button>
      </form>

      <div className="seller-notes">
        {notes.map((note) => (
          <article key={note.id}>
            <div>
              <StatusPill tone={noteTone[note.type]}>{note.type}</StatusPill>
              <small>{note.linkedLead}</small>
            </div>
            <strong>{note.title}</strong>
            <p>{note.body}</p>
            <footer>{note.owner}</footer>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}
