import { Reveal } from "@/motion";
import s from "./sitio.module.css";

/**
 * La conversación DIBUJADA del chatbot — nunca una captura (Sergio, 2026-09-01:
 * "no coloques capturas literales del sistema... coloca cosas referenciales").
 *
 * Es la pieza visual del bloque PROTAGONISTA del chatbot (Sergio, 2026-09-11:
 * "el tema de los chatbots es principal, que sea más protagonista, está al
 * final eso... que sea más visual"). Cada burbuja entra con <Reveal>
 * escalonado, como una conversación que va pasando; con reducir-movimiento
 * (lo que ve Sergio en su Windows) la conversación aparece entera de una —
 * el fallback también es la página.
 *
 * El guion respeta el límite REAL del bot: contesta con la información que el
 * negocio publicó, y lo que no puede resolver se lo deja al dueño CON la
 * conversación entera. Nada de reservas ni cotizaciones automáticas que el
 * producto no hace, y ni un monto dibujado (regla de la casa).
 */
const GUION = [
  {
    de: "cliente" as const,
    texto: "Hola, ¿tienen taladros Bosch? ¿Atienden mañana?",
    hora: "23:47",
  },
  {
    de: "onia" as const,
    texto:
      "Sí — tenemos Bosch y Makita en stock. Mañana atendemos de 8:30 a 18:00, en la misma dirección de siempre.",
    hora: "23:47",
  },
  {
    de: "cliente" as const,
    texto: "Perfecto. ¿Pueden reservarme uno?",
    hora: "23:48",
  },
  {
    de: "onia" as const,
    texto:
      "Con gusto: su pedido ya quedó registrado con esta conversación, y el encargado se lo confirma apenas abra el negocio.",
    hora: "23:48",
  },
];

export function ConversacionNocturna() {
  return (
    <div className={s.waCard} role="img" aria-label="Conversación de WhatsApp respondida por Onia a las 23:47: el agente conversacional contesta stock y horario con la información publicada, y el pedido queda registrado para que el encargado lo confirme al abrir.">
      <div className={s.waHead}>
        <span className={s.waDot} aria-hidden="true" />
        <span className={s.waQuien}>WhatsApp del negocio</span>
        <span className={s.waHora}>23:47</span>
      </div>
      <div className={s.waHilo} aria-hidden="true">
        {GUION.map((m, i) => (
          <Reveal key={i} delay={0.12 * i}>
            <div className={m.de === "onia" ? `${s.waMsg} ${s.waMsgOnia}` : s.waMsg}>
              <p className={s.waTexto}>{m.texto}</p>
              <span className={s.waMeta}>
                {m.de === "onia" ? `Onia · ${m.hora}` : m.hora}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.55}>
        <p className={s.waPie}>
          Respondido a las 23:47. La consulta no se perdió.
        </p>
      </Reveal>
    </div>
  );
}
