import { redirect } from "next/navigation";
import { headers } from "next/headers";

// La raiz depende del dominio: onia-center.vercel.app (panel interno) sigue
// yendo a /onia-center. Cualquier otro host (el proyecto/dominio propio de
// Nuvia) va directo a la tienda. Revisar esta heuristica si onia-center suma
// un dominio propio que no contenga "onia-center".
export default async function Home() {
  const host = (await headers()).get("host") || "";

  if (host.includes("onia-center")) {
    redirect("/onia-center");
  }

  redirect("/nuvia");
}
