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
  servicios: Array<{
    titulo: string;
    desc: string;
    icono: string;
  }>;
  cta: {
    texto: string;
    url: string;
  };
};
