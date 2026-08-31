// ─────────────────────────────────────────────────────────────────────────────
// Contenido del CLIENTE. Un solo lugar: ningún componente escribe copy propio.
//
// ⚠️ DATOS DE CONTACTO = DEMO. El WhatsApp y el teléfono de abajo son números
// de ejemplo (prefijo 591 7000 000x, reservados para demo interna). NO son de
// un negocio real y NO deben publicarse como si lo fueran. Al montar esto para
// un cliente real se reemplazan acá y en ningún otro archivo.
//
// Voz: de mostrador. Boliviano, directo, sin "soluciones integrales" ni
// "aliado estratégico". El que lee está por cruzar la ciudad con una lista en
// la mano y quiere saber si vale la pena.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_CONTACTO = true;

export const ferreteria = {
  nombre: "Ferretería Sur",
  marca: "FS",
  rubro: "comercio",
  tagline: "Si lo usás para arreglar algo, acá está",
  lede:
    "Herramienta, fierro, eléctrico, plomería y pintura en la zona sur de Santa Cruz. Mandá tu lista por WhatsApp y te decimos qué hay y cuánto sale, antes de que cruces la ciudad.",

  // ── Ubicación ──
  direccion: "Av. Santos Dumont, entre 3er y 4to anillo",
  zona: "Zona Sur",
  ciudad: "Santa Cruz de la Sierra",
  referencia: "A media cuadra del surtidor, vereda del frente al mercado",

  // ── Contacto (DEMO, ver aviso de arriba) ──
  whatsapp: "59170000003",
  telefono: "(3) 300-0003",

  // ── Horarios ──
  horarios: [
    { dias: "Lunes a viernes", abre: "07:30", cierra: "19:00" },
    { dias: "Sábado", abre: "07:30", cierra: "14:00" },
    { dias: "Domingo", abre: "", cierra: "", nota: "Cerrado" },
  ],
  horarioNota: "Los sábados sale más gente que entra: si es urgente, escribí temprano.",

  // ── Franja / ticker: capacidades reales del local, todas respaldadas abajo ──
  franja: [
    "Corte a medida",
    "Factura con NIT",
    "Entrega en obra",
    "Pago con QR",
    "Abierto sábados",
    "Pintura al color",
  ],

  // ── Categorías: lo que hay en góndola. El código va en mono, como en el
  //    estante del depósito. ──
  categorias: [
    {
      cod: "01",
      t: "Herramienta manual",
      d: "Lo que se agarra con la mano y dura veinte años si es de la buena.",
      items: ["Llaves y dados", "Alicates", "Martillos y combos", "Destornilladores", "Flexómetros y niveles"],
    },
    {
      cod: "02",
      t: "Herramienta eléctrica",
      d: "Taladros, amoladoras y sierras, con repuestos de los que se gastan.",
      items: ["Taladros y rotomartillos", "Amoladoras", "Sierras circulares", "Lijadoras", "Carbones y accesorios"],
    },
    {
      cod: "03",
      t: "Tornillería y fijación",
      d: "Por unidad, por kilo o por caja. Traé el que te sobró y te damos el mismo.",
      items: ["Pernos y tuercas", "Tirafondos", "Tarugos y anclajes", "Remaches", "Clavos"],
    },
    {
      cod: "04",
      t: "Eléctrico",
      d: "Cable por metro, cortado en el mostrador, del calibre que pide el plano.",
      items: ["Cable por metro", "Tomacorrientes e interruptores", "Llaves térmicas", "Cinta aislante", "Focos y reflectores LED"],
    },
    {
      cod: "05",
      t: "Plomería",
      d: "PVC, accesorios y grifería. Si traés el pedazo roto, lo igualamos.",
      items: ["Tubería PVC", "Codos, tees y uniones", "Llaves de paso", "Grifería", "Teflón y siliconas"],
    },
    {
      cod: "06",
      t: "Pintura y solventes",
      d: "Látex, esmalte y el color exacto preparado acá con tu muestra.",
      items: ["Látex y esmalte", "Thinner y aguarrás", "Brochas y rodillos", "Masilla y sellador", "Cintas de enmascarar"],
    },
    {
      cod: "07",
      t: "Construcción",
      d: "Lo pesado. Se coordina la entrega en obra el mismo día que se compra.",
      items: ["Cemento y cal", "Fierro de construcción", "Alambre de amarre", "Mallas", "Carretillas y baldes"],
    },
    {
      cod: "08",
      t: "Abrasivos y corte",
      d: "Discos, brocas y lijas para lo que haya que abrir.",
      items: ["Discos de corte y desbaste", "Brocas para concreto y metal", "Lijas en hoja y rollo", "Sierras copa", "Hojas de sierra"],
    },
    {
      cod: "09",
      t: "Seguridad industrial",
      d: "Lo que exige el maestro de obra antes de dejarte subir al andamio.",
      items: ["Cascos", "Guantes", "Lentes de protección", "Botines", "Arnés y línea de vida"],
    },
    {
      cod: "10",
      t: "Cerrajería",
      d: "Candados, cerraduras y duplicado de llaves mientras esperás.",
      items: ["Candados", "Cerraduras", "Bisagras", "Pasadores", "Duplicado de llaves"],
    },
  ],

  // ── Lo que se hace en el mostrador, no en la góndola ──
  mostrador: [
    { t: "Corte a medida", d: "Fierro, tubo y varilla cortados al largo que necesitás, para que entren en la movilidad." },
    { t: "Pintura al color", d: "Traé la muestra —un pedazo de pared, una tapa, una foto no— y preparamos el color acá." },
    { t: "Duplicado de llaves", d: "Se hace en el momento, mientras terminás de armar el resto de la lista." },
    { t: "Entrega en obra", d: "Dentro de la ciudad coordinamos la entrega del material pesado en la dirección de la obra." },
    { t: "Factura con NIT", d: "Se emite factura al momento. Si la obra la necesita a nombre de la empresa, decilo al pagar." },
    { t: "Cuenta a crédito", d: "Constructoras y maestros con cuenta abierta compran y liquidan a fin de mes." },
  ],

  // ── Cómo comprar: el circuito que el sitio quiere provocar ──
  comoComprar: [
    { t: "Mandá tu lista", d: "Foto del papel, nota de voz o escrita. Como te salga más rápido." },
    { t: "Te confirmamos", d: "Qué hay, qué falta, qué reemplaza a lo que falta, y cuánto sale todo junto." },
    { t: "Retirás o te llega", d: "Pasás por el mostrador con el pedido armado, o coordinamos la entrega en obra." },
  ],

  faq: [
    {
      q: "¿Cómo sé si tienen lo que busco?",
      a: "Escribí por WhatsApp con la marca o la medida —o mandá la foto de la pieza vieja— y te confirmamos si está en góndola antes de que salgas de tu casa.",
    },
    {
      q: "¿Hacen factura?",
      a: "Sí, factura con NIT emitida al momento de pagar. Si va a nombre de una empresa, avisá antes de que la emitamos.",
    },
    {
      q: "¿Entregan en obra?",
      a: "Dentro de Santa Cruz coordinamos la entrega del material pesado (cemento, fierro, agregados) en la dirección de la obra. La coordinamos al momento de la compra.",
    },
    {
      q: "¿Cómo puedo pagar?",
      a: "Efectivo, QR y transferencia. Las constructoras y los maestros con cuenta abierta liquidan a fin de mes.",
    },
    {
      q: "¿Venden por unidad o solo por caja?",
      a: "Las dos cosas. Tornillería y fijaciones salen por unidad, por kilo o por caja cerrada, y el precio cambia según cómo lo lleves.",
    },
  ],
} as const;

export function waLink(text: string): string {
  return `https://wa.me/${ferreteria.whatsapp}?text=${encodeURIComponent(text)}`;
}
