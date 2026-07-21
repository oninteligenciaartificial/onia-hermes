import { redirect } from "next/navigation";
import { headers } from "next/headers";

// La raiz depende del dominio: el panel interno (onia-center.vercel.app y el
// dominio propio center.onia.com.bo servido desde el VPS) va a /onia-center
// (el Jarvis). Cualquier otro host (el proyecto/dominio propio de Nuvia, ej.
// nuvia-store.vercel.app) va directo a la tienda.
export default async function Home() {
  const host = (await headers()).get("host") || "";

  if (host.includes("onia-center") || host.includes("center.onia.com.bo")) {
    redirect("/onia-center");
  }

  redirect("/nuvia");
}
