"use client";

import type { FormEvent, ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { initialIdeas, initialLeads, initialNotes } from "../data";
import type { Idea, Lead, LeadFormState, Note } from "../types";

const emptyLeadForm: LeadFormState = {
  empresa: "",
  rubro: "",
  ciudad: "",
  canal: "WhatsApp",
  dolor: "",
};

type SellerWorkspaceValue = {
  leads: Lead[];
  notes: Note[];
  ideas: Idea[];
  leadForm: LeadFormState;
  noteForm: { title: string; body: string };
  ideaForm: { title: string; body: string };
  setLeadForm: (value: LeadFormState) => void;
  setNoteForm: (value: { title: string; body: string }) => void;
  setIdeaForm: (value: { title: string; body: string }) => void;
  addLead: (event: FormEvent<HTMLFormElement>) => void;
  addNote: (event: FormEvent<HTMLFormElement>) => void;
  addIdea: (event: FormEvent<HTMLFormElement>) => void;
};

const SellerWorkspaceContext = createContext<SellerWorkspaceValue | null>(null);

export function SellerWorkspaceProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [leadForm, setLeadForm] = useState<LeadFormState>(emptyLeadForm);
  const [noteForm, setNoteForm] = useState({ title: "", body: "" });
  const [ideaForm, setIdeaForm] = useState({ title: "", body: "" });

  const value = useMemo<SellerWorkspaceValue>(
    () => ({
      leads,
      notes,
      ideas,
      leadForm,
      noteForm,
      ideaForm,
      setLeadForm,
      setNoteForm,
      setIdeaForm,
      addLead(event) {
        event.preventDefault();
        if (!leadForm.empresa.trim() || !leadForm.rubro.trim()) return;

        setLeads((current) => [
          {
            id: `lead-${Date.now()}`,
            empresa: leadForm.empresa.trim(),
            rubro: leadForm.rubro.trim(),
            ciudad: leadForm.ciudad.trim() || "Sin ciudad",
            canal: leadForm.canal,
            estado: "Nuevo",
            prioridad: "media",
            producto: "Auditoria Express",
            dolor: leadForm.dolor.trim() || "Dolor pendiente de validar.",
            seguimiento: "Definir proximo contacto",
            contacto: "Pendiente",
            valorEstimado: "Por cotizar",
            siguienteAccion: "Completar datos, investigar presencia digital y preparar primer mensaje.",
            datosCompletos: false,
          },
          ...current,
        ]);
        setLeadForm(emptyLeadForm);
      },
      addNote(event) {
        event.preventDefault();
        if (!noteForm.title.trim() || !noteForm.body.trim()) return;

        setNotes((current) => [
          {
            id: `note-${Date.now()}`,
            title: noteForm.title.trim(),
            body: noteForm.body.trim(),
            type: "nota",
            owner: "Vendedor",
            linkedLead: "Captura local",
          },
          ...current,
        ]);
        setNoteForm({ title: "", body: "" });
      },
      addIdea(event) {
        event.preventDefault();
        if (!ideaForm.title.trim() || !ideaForm.body.trim()) return;

        setIdeas((current) => [
          {
            id: `idea-${Date.now()}`,
            title: ideaForm.title.trim(),
            body: ideaForm.body.trim(),
            signal: "captura local",
            stage: "nueva",
          },
          ...current,
        ]);
        setIdeaForm({ title: "", body: "" });
      },
    }),
    [ideaForm, ideas, leadForm, leads, noteForm, notes],
  );

  return <SellerWorkspaceContext.Provider value={value}>{children}</SellerWorkspaceContext.Provider>;
}

export function useSellerWorkspace() {
  const context = useContext(SellerWorkspaceContext);

  if (!context) {
    throw new Error("useSellerWorkspace debe usarse dentro de SellerWorkspaceProvider.");
  }

  return context;
}
