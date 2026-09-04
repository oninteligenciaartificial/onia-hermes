import type { FormEvent } from "react";
import { Plus, UserRoundCheck } from "lucide-react";
import type { LeadFormState } from "../types";
import { SectionPanel } from "./ui";

export function CaptureSection({
  leadForm,
  onChange,
  onSubmit,
}: {
  leadForm: LeadFormState;
  onChange: (value: LeadFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionPanel
      id="captura"
      label="Captura rapida"
      title="Registrar prospecto sin perder contexto"
      description="El objetivo no es llenar campos por llenar. Es guardar lo minimo para saber que vender, cuando llamar y que no prometer."
      icon={UserRoundCheck}
      action={<span className="seller-section-count">5 campos</span>}
    >
      <form className="seller-form" onSubmit={onSubmit}>
        <label>
          Empresa
          <input
            value={leadForm.empresa}
            onChange={(event) => onChange({ ...leadForm, empresa: event.target.value })}
            placeholder="Ej. Clinica, tienda, taller"
          />
        </label>
        <label>
          Rubro
          <input
            value={leadForm.rubro}
            onChange={(event) => onChange({ ...leadForm, rubro: event.target.value })}
            placeholder="Dental, estetica, comercio"
          />
        </label>
        <label>
          Ciudad
          <input
            value={leadForm.ciudad}
            onChange={(event) => onChange({ ...leadForm, ciudad: event.target.value })}
            placeholder="Santa Cruz"
          />
        </label>
        <label>
          Canal principal
          <select value={leadForm.canal} onChange={(event) => onChange({ ...leadForm, canal: event.target.value })}>
            <option>WhatsApp</option>
            <option>Instagram</option>
            <option>Llamada</option>
            <option>Email</option>
            <option>Referido</option>
          </select>
        </label>
        <label className="seller-form-wide">
          Dolor probable
          <textarea
            value={leadForm.dolor}
            onChange={(event) => onChange({ ...leadForm, dolor: event.target.value })}
            placeholder="Que problema parece tener y que debemos validar en la llamada"
          />
        </label>
        <button type="submit">
          <Plus size={16} />
          Guardar lead y revisar
        </button>
      </form>
    </SectionPanel>
  );
}
