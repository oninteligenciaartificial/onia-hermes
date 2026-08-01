interface ProblemaItem {
  num: string;
  titulo: string;
  texto: string;
}

const ITEMS: ProblemaItem[] = [
  {
    num: "01",
    titulo: "La silla vacía",
    texto:
      "Un paciente de ortodoncia que no llega son Bs 300–350 que no entran — y una hora que nadie más ocupa. En odontología de la región se pierde entre el 10% y el 30% de las citas (datos de Colombia y Chile; en Bolivia todavía no hay estudio publicado).",
  },
  {
    num: "02",
    titulo: "El cuaderno",
    texto:
      "La agenda en cuaderno, las historias en carpetas y los saldos en la cabeza. Cuando la asistente falta un día, la clínica queda ciega.",
  },
  {
    num: "03",
    titulo: "Perseguir cobros",
    texto:
      "Tratamientos largos, cuotas que nadie anota, pacientes a los que da vergüenza cobrarles por tercera vez. Lo que no se cobra a tiempo, casi nunca se cobra.",
  },
];

export function Problema() {
  return (
    <section className="problema" aria-labelledby="problema-heading">
      <div className="container">
        <div className="section-head-center" data-reveal>
          <h2 id="problema-heading">Tres agujeros por donde se te va la plata</h2>
          <p className="section-intro">
            No es falta de pacientes. Es lo que pasa entre una cita y la
            siguiente.
          </p>
        </div>
        <div className="problema-grid reveal-stagger">
          {ITEMS.map((item) => (
            <div className="problema-item" key={item.num} data-reveal>
              <p className="problema-num" aria-hidden="true">
                {item.num}
              </p>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
