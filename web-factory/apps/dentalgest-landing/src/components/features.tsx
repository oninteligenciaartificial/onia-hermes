import { ScreenshotFrame } from "./screenshot-frame";

export function Features() {
  return (
    <section className="features" aria-labelledby="features-heading">
      <div className="container">
        <div data-reveal>
          <h2 id="features-heading">
            Una sola herramienta para operar tu clínica
          </h2>
          <p className="section-intro">
            DentalGest no es &ldquo;un sistema más para llenar&rdquo;. Es el
            que trabaja mientras vos atendés.
          </p>
        </div>
        <div className="bento reveal-stagger">
          <div className="bento-cell cell-a" data-reveal>
            <h3>Agenda + odontograma en un solo lugar</h3>
            <p>
              Citas, historias clínicas y odontograma digital por paciente.
              Abrís la ficha y ves todo: qué se hizo, qué falta, cuánto debe.
              Sin carpetas, sin buscar en el cuaderno.
            </p>
            <ScreenshotFrame title="DentalGest — Agenda y odontograma" />
          </div>
          <div className="bento-cell cell-b" data-reveal>
            <h3>Facturá al SIAT sin tipear</h3>
            <p>
              Terminás el tratamiento, apretás un botón y la factura sale al
              SIN con los datos que ya están en el sistema. Nada de re-tipear
              paciente por paciente en otra página.
            </p>
          </div>
          <div className="bento-cell cell-c" data-reveal>
            <h3>Un agente que reprograma y cobra</h3>
            <p>
              Cuando un paciente cancela o no confirma, el agente de DentalGest
              le ofrece otro horario y llena el hueco. Y cuando hay una cuota
              pendiente, manda el cobro con QR — sin que vos tengas que
              perseguir a nadie. Vos aprobás, él ejecuta.
            </p>
          </div>
          <div className="bento-cell cell-d" data-reveal>
            <h3>Todo por WhatsApp</h3>
            <p>
              Tus pacientes ya viven en WhatsApp — es la app número 1 de
              Bolivia. Confirmaciones, reprogramaciones y cobros llegan por
              donde la gente sí responde. Vos también: consultale al sistema tu
              día sin abrir la computadora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
