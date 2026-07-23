import { redirect } from "next/navigation";

// El satélite Video Lab quedó absorbido por la vista "Estudio de Contenido" del
// panel (ONIA Center → /next/estudio). Conservamos source.ts para reusar tipos y
// seed; esta ruta solo redirige a la vista nueva.
export default function Page() {
  redirect("/onia-center/next/estudio");
}
