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
    horario?: string;
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
    /** Per-service destination; blocks that give each service its own CTA use it. */
    url?: string;
  }>;
  beneficios?: string[];
  credenciales?: string[];
  /**
   * The steps. `imagen`/`imagenAlt` are optional because a step can also be a
   * frame of a scene (scroll-story-hero); text-only blocks ignore them.
   */
  proceso?: Array<{ titulo: string; desc: string; imagen?: string; imagenAlt?: string }>;
  procesoKicker?: string;
  procesoTitulo?: string;
  faq?: Array<{ pregunta: string; respuesta: string }>;
  cta: {
    texto: string;
    url: string;
  };
};
