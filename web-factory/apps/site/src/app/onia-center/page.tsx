import { redirect } from "next/navigation";

// El panel operativo nuevo vive en /onia-center/next/**. El monolito anterior se
// retiro (operating-workspace.tsx eliminado); esta raiz ahora lleva al panel nuevo.
export default function OniaCenterPage() {
  redirect("/onia-center/next/hoy");
}
