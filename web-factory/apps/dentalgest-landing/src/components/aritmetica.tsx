interface ReciboRow {
  label: string;
  value: string;
}

const FILAS: ReciboRow[] = [
  { label: "Ajuste de ortodoncia que no llegó", value: "Bs 300–350" },
  { label: "Segundo ajuste perdido en el mes", value: "Bs 300–350" },
];

function Fila({
  row,
  className,
}: {
  row: ReciboRow;
  className?: string;
}) {
  return (
    <div className={className ? `recibo-row ${className}` : "recibo-row"}>
      <span>{row.label}</span>
      <span className="recibo-dots" aria-hidden="true" />
      <span className="recibo-val">{row.value}</span>
    </div>
  );
}

export function Aritmetica() {
  return (
    <section className="aritmetica" aria-labelledby="aritmetica-heading">
      <div className="container">
        <h2 id="aritmetica-heading" data-reveal>
          Hacé la cuenta, no la fe
        </h2>
        <div className="recibo" data-reveal>
          {FILAS.map((row) => (
            <Fila key={row.label} row={row} />
          ))}
          <div className="recibo-rule" aria-hidden="true" />
          <Fila
            row={{ label: "Dos ausencias al mes", value: "Bs 600–700" }}
            className="recibo-subtotal"
          />
          <Fila
            row={{ label: "DentalGest Pro, por mes", value: "Bs 750" }}
            className="recibo-final"
          />
        </div>
        <p className="recibo-remate" data-reveal>
          El plan Pro (Bs 750) cuesta menos que dos ausencias de ortodoncia
          (Bs 300–350 cada una). Si el agente te salva dos citas al mes, ya se
          pagó.
        </p>
        <p className="recibo-endo" data-reveal>
          ¿Trabajás casos grandes? Una sola endodoncia multirradicular
          recuperada (Bs 2.100) paga el plan Full (Bs 1.500) y te sobran
          Bs 600.
        </p>
      </div>
    </section>
  );
}
