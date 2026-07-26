import type { RoleId } from "@/app/onia-center/types";
import type { TeamMember } from "@/lib/onia-center-store";

// Opcion de responsable elegible en los formularios de alta (lead / tarea).
// Conserva el userKey de la PERSONA para estampar ownerUserKey/assignedUserKey y
// separar dos personas del mismo rol (p. ej. dos vendedores) en el scorecard J-3.
export type AssigneeOption = {
  key: string;
  role: RoleId;
  userKey: string;
  label: string;
};

// Respaldo cuando getOniaCenterTeam() no devuelve roster (Supabase caido o vacio).
// userKeys reales del equipo comercial para que el scorecard siga separando por
// persona aun sin la lista viva. Camila y Jeronimo comparten rol "seller".
const FALLBACK_ASSIGNEES: AssigneeOption[] = [
  { key: "seller_001", role: "seller", userKey: "seller_001", label: "Camila" },
  { key: "seller_002", role: "seller", userKey: "seller_002", label: "Jeronimo" },
  { key: "arthur", role: "arthur", userKey: "arthur", label: "Arthur" },
  { key: "sergio", role: "sergio", userKey: "sergio", label: "Sergio" },
];

// Convierte el equipo real en opciones de responsable por PERSONA. Cada persona
// mantiene su userKey, asi Sergio puede asignar a Camila o a Jeronimo por separado
// y el POST estampa el userKey exacto (no solo el rol compartido).
export function buildAssignees(team: TeamMember[]): AssigneeOption[] {
  if (team.length === 0) {
    return FALLBACK_ASSIGNEES;
  }
  return team.map((member) => ({
    key: member.userKey,
    role: member.role,
    userKey: member.userKey,
    label: member.displayName,
  }));
}

// Responsable por defecto: primer vendedor si existe (los leads suelen ir a
// ventas), si no la primera persona de la lista.
export function defaultAssigneeKey(options: AssigneeOption[]): string {
  const firstSeller = options.find((option) => option.role === "seller");
  return firstSeller?.key ?? options[0]?.key ?? "";
}
