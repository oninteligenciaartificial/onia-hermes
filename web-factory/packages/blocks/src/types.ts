export type Listing = {
  titulo: string;
  precio: string;
  zona: string;
  tipo: string;
  operacion: "venta" | "alquiler";
  dormitorios?: number;
  banos?: number;
  imagen?: string;
  imagenAlt?: string;
  destacado?: boolean;
};

export type SiteClient = {
  nombre: string;
  tagline: string;
  descripcion: string;
  logo: string;
  contacto: {
    email: string;
    tel: string;
    whatsapp: string;
    direccion: string;
  };
  redes: {
    ig: string;
    fb: string;
    linkedin: string;
    x: string;
  };
  heroVideo?: string;
  heroPoster?: string;
  imagenSecundaria?: string;
  heroVariant?: "auto" | "fullbleed" | "split" | "typographic" | "video";
  rubro?: string;
  disponibilidad?: string;
  ctaSecundariaTexto?: string;
  servicios: Array<{
    titulo: string;
    desc: string;
    icono: string;
  }>;
  beneficios?: string[];
  credenciales?: string[];
  proceso?: Array<{ titulo: string; desc: string }>;
  procesoKicker?: string;
  procesoTitulo?: string;
  faq?: Array<{ pregunta: string; respuesta: string }>;
  listings?: Listing[];
  zonas?: string[];
  wordmarkBreak?: string;
  cta: {
    texto: string;
    url: string;
  };
};
