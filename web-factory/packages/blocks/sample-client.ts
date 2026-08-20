/**
 * Sample client for the gallery (`pnpm blocks:demo`).
 *
 * Deliberately labelled sample copy. The gallery proves the blocks render and
 * compose; it is not a client site and it must never read as one, so every
 * string here says "muestra" and no number, credential or claim is invented.
 */
import type { SiteClient } from "./src/types";

const SAMPLE_COPY = "Copy de muestra: aca va el dato real del cliente.";

/** Shape of the client the landing/clinic stylesheets are built from. */
export type SampleLandingClient = SiteClient & {
  slug: string;
  colores: { primary: string; secondary: string; accent: string; bg: string; fg: string };
  tipografia: { heading: string; body: string };
  seo: { title: string; description: string; ogImage: string };
};

export const SAMPLE_CLIENT: SampleLandingClient = {
  nombre: "Marca de muestra",
  slug: "blocks-demo",
  tagline: "El titular de muestra ocupa dos lineas",
  descripcion: "Bajada de muestra: una frase que explica que hace el negocio y para quien.",
  logo: "MM",
  heroPoster: "./assets/hero-consultorio.webp",
  imagenSecundaria: "./assets/detalle-atencion.webp",
  colores: {
    // Tokens ONIA del sitio de muestra. Los bloques no leen estos hexes: leen
    // --color-* , asi que cambiar el cliente cambia toda la galeria.
    primary: "#2f4f45",
    secondary: "#1a1a18",
    accent: "#8a8378",
    bg: "#faf8f5",
    fg: "#1a1a18",
  },
  tipografia: { heading: "Onest", body: "Onest" },
  contacto: {
    email: "hola@ejemplo.test",
    tel: "+591 700 00000",
    whatsapp: "https://wa.me/59170000000",
    direccion: "Direccion de muestra, Santa Cruz",
  },
  redes: {
    ig: "https://instagram.com/ejemplo",
    fb: "https://facebook.com/ejemplo",
    linkedin: "",
    x: "",
  },
  servicios: [
    { titulo: "Servicio de muestra", desc: SAMPLE_COPY, icono: "sparkles" },
    { titulo: "Servicio de muestra", desc: SAMPLE_COPY, icono: "shield-check" },
    { titulo: "Servicio de muestra", desc: SAMPLE_COPY, icono: "activity" },
    { titulo: "Servicio de muestra", desc: SAMPLE_COPY, icono: "heart" },
  ],
  beneficios: [
    "Beneficio de muestra",
    "Beneficio de muestra",
    "Beneficio de muestra",
  ],
  credenciales: [
    "Credencial de muestra",
    "Credencial de muestra",
    "Credencial de muestra",
  ],
  proceso: [
    { titulo: "Paso de muestra", desc: SAMPLE_COPY },
    { titulo: "Paso de muestra", desc: SAMPLE_COPY },
    { titulo: "Paso de muestra", desc: SAMPLE_COPY },
  ],
  faq: [
    { pregunta: "Pregunta de muestra?", respuesta: SAMPLE_COPY },
    { pregunta: "Pregunta de muestra?", respuesta: SAMPLE_COPY },
  ],
  cta: { texto: "Escribir por WhatsApp", url: "#top" },
  seo: {
    title: "Marca de muestra",
    description: "Sitio de muestra de la galeria de bloques.",
    ogImage: "",
  },
};
