interface FaqItem {
  pregunta: string;
  respuesta: string;
}

const PREGUNTAS: FaqItem[] = [
  {
    pregunta: "¿Necesito comprar un software para cumplir con el SIN?",
    respuesta:
      "No. El SIN tiene un Portal Web gratuito donde podés emitir tus facturas tipeándolas una por una. DentalGest te sirve si querés que la factura salga sola desde la ficha del paciente, sin re-tipear nada — y que además la clínica entera (agenda, historias, cobros) viva en el mismo lugar.",
  },
  {
    pregunta: "¿Mis datos y los de mis pacientes están seguros?",
    respuesta:
      "Sí. Tus datos viven en una base de datos cifrada con respaldos automáticos, y cada clínica accede solo a lo suyo con usuario y contraseña. Las historias clínicas son tuyas: si un día te vas, te llevás tus datos.",
  },
  {
    pregunta: "¿Qué pasa si se corta el internet en el consultorio?",
    respuesta:
      "DentalGest funciona desde cualquier dispositivo con conexión — computadora, tablet o tu celular. Si el wifi del consultorio se cae, seguís operando con los datos del teléfono. Y las citas y mensajes de tus pacientes se procesan en la nube, así que nada se pierde mientras tanto.",
  },
  {
    pregunta: "¿Cuánto cuesta empezar? ¿Hay costo de instalación?",
    respuesta:
      "No. La implementación y la migración de tus datos (pacientes, historias, saldos) están incluidas en cualquier plan. Pagás la mensualidad y nada más. Empezás con una demo por WhatsApp, sin compromiso.",
  },
  {
    pregunta: "¿El agente responde solo? ¿Y si dice algo que no quiero?",
    respuesta:
      "El agente trabaja con tu aprobación: propone la reprogramación o el cobro, y vos decidís con un toque si sale o no. Nada se envía a un paciente sin que lo hayas autorizado. Con el tiempo, vos elegís qué cosas puede hacer solo.",
  },
];

export function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="section-head-center" data-reveal>
          <h2 id="faq-heading">Preguntas frecuentes</h2>
        </div>
        <div className="faq-list" data-reveal>
          {PREGUNTAS.map((item) => (
            <details className="faq-item" key={item.pregunta}>
              <summary>
                {item.pregunta}
                <span className="faq-icon" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
