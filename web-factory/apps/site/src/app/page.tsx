import { redirect } from "next/navigation";

// La raiz va directo al panel real (ONIA Center). El viejo snapshot estatico
// "Hermes OS Control Center" (jun 2026) quedo obsoleto; la info de migracion
// vive en hermes-content/docs y ya no se sirve como homepage.
export default function Home() {
  redirect("/onia-center");
}
