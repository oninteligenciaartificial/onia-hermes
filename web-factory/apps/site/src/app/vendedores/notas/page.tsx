"use client";

import { sellerScreens } from "../data";
import { NotesSection } from "../_components/notes-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";
import { useSellerWorkspace } from "../_components/seller-workspace";

export default function NotasPage() {
  const { notes, noteForm, setNoteForm, addNote } = useSellerWorkspace();

  return (
    <>
      <SellerScreenHeader screen={sellerScreens.notas} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Que se anota siempre"
              description="La nota debe ayudar a vender mejor o evitar riesgo."
              items={[
                "Objecion exacta del cliente.",
                "Promesa hecha por ventas o por Sergio.",
                "Pregunta tecnica que necesita validacion.",
                "Condicion de precio, urgencia o decision.",
              ]}
            />
            <OperatingBlock
              title="Escalar a Sergio"
              description="No todo necesita a Sergio, pero estos casos si."
              items={[
                "WhatsApp automatico, pagos, integraciones o IA sensible.",
                "Cliente pide garantia de resultados.",
                "Alcance de sistema sin discovery.",
                "Descuento alto o condicion especial.",
              ]}
            />
          </>
        }
      >
        <NotesSection notes={notes} noteForm={noteForm} onChange={setNoteForm} onSubmit={addNote} />
      </SellerScreenGrid>
    </>
  );
}
