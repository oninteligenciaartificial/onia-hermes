// Contenido del cliente (mismo perfil que la demo estática dental-amanecer,
// para comparar la versión premium-animada contra la ligera). Un solo lugar.
export const clinic = {
  nombre: "Clínica Dental Amanecer",
  logo: "DA",
  tagline: "Tu próxima visita al dentista no tiene por qué doler",
  lede: "Odontología integral en Santa Cruz de la Sierra: evaluación honesta, presupuesto por escrito antes de empezar y agenda directa por WhatsApp, sin llamadas en espera.",
  direccion: "Av. Beni entre 2do y 3er anillo, Santa Cruz de la Sierra",
  whatsapp: "59170000001",
  promesas: ["Presupuesto antes de empezar", "Agenda por WhatsApp", "Pago por etapas"],
  servicios: [
    { t: "Evaluación y diagnóstico", d: "Revisión completa con radiografía si hace falta, y un plan por escrito antes de tocar nada." },
    { t: "Limpieza y prevención", d: "Profilaxis, flúor y control periódico para no llegar tarde a la caries." },
    { t: "Ortodoncia", d: "Brackets metálicos, estéticos y alineadores, con control mensual incluido." },
    { t: "Implantes y prótesis", d: "Reposición de piezas con evaluación ósea y opciones de pago por etapas." },
    { t: "Endodoncia", d: "Tratamiento de conducto en una o dos sesiones, con anestesia y sin sermones." },
    { t: "Urgencias", d: "Dolor agudo o golpe: espacio reservado el mismo día, también sábados." },
  ],
  proceso: [
    { t: "Escribinos por WhatsApp", d: "Contanos qué te pasa y elegimos el primer horario libre que te sirva." },
    { t: "Evaluación sin apuro", d: "Revisamos tu caso, te mostramos lo que vemos y respondemos todo." },
    { t: "Presupuesto por escrito", d: "Antes de empezar tenés el plan con costos y tiempos, en tu mano." },
    { t: "Tratamiento y control", d: "Hacemos el trabajo y agendamos el control para que dure." },
  ],
  faq: [
    { q: "¿Cuánto cuesta la primera consulta?", a: "La evaluación inicial tiene precio fijo y te lo decimos por WhatsApp antes de agendar. El presupuesto del tratamiento va por escrito y no cambia a mitad de camino." },
    { q: "¿Duele el tratamiento?", a: "Trabajamos con anestesia local y al ritmo que tu caso permita. Si algo molesta, se para y se ajusta." },
    { q: "¿Atienden urgencias?", a: "Sí. Reservamos espacio todos los días para dolor agudo o golpes, también los sábados por la mañana." },
    { q: "¿Puedo pagar en partes?", a: "Los tratamientos largos como ortodoncia o implantes se pagan por etapas, con el detalle en el presupuesto." },
  ],
} as const;

export function waLink(text: string): string {
  return `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(text)}`;
}
