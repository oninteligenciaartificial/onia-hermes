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
  heroPoster?: string;
  imagenSecundaria?: string;
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
  cta: {
    texto: string;
    url: string;
  };
};
