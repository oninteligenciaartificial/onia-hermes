import type { Metadata } from "next";
import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { EMPEZAR_URL } from "../nav";
import { Block, Btn, Kicker } from "../ui";
import { Switcher } from "../switcher";
import s from "../sitio.module.css";

export const metadata: Metadata = {
  title: "Un sistema por rubro — dental, comercio, importadora y más | Onia",
  description:
    "Elegís tu rubro y la cuenta viene armada con sus pantallas y su vocabulario: pacientes y odontograma en dental, productos y fiados en comercio, lotes y costos en importadora. El mismo núcleo, hecho para Bolivia.",
  alternates: { canonical: "/rubros" },
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Elegís tu rubro y la cuenta ya viene armada",
    description:
      "No es un software distinto por industria: es el mismo núcleo con módulos y vocabulario propios de tu negocio.",
    url: "/rubros",
  },
};

/**
 * Apartado de RUBROS. Un producto, muchos rubros — el conmutador es la estrella.
 * Cinco rubros vivos y vendibles hoy; el vocabulario por rubro es lo que cada
 * negocio ve en la misma base (no son productos distintos). Ningún rubro
 * linkea afuera: la vieja /modulos/dental ya no existe como página — redirige
 * acá (308 en next.config.ts) porque mandar al visitante a otro cromo sin
 * retorno era la fuga del embudo. Cero "muy pronto" (regla: la venta nunca
 * exhibe obra).
 */

const RUBROS: readonly { nombre: string; ve: string }[] = [
  {
    nombre: "Dental",
    ve: "Pacientes, tratamientos, odontograma y agenda por sillón.",
  },
  { nombre: "Comercio", ve: "Productos, stock, ventas y fiados." },
  { nombre: "Importadora", ve: "Depósito, lotes, proveedores y costos de importación." },
  { nombre: "Estética", ve: "Clientes, sesiones, paquetes y recordatorios." },
  { nombre: "Servicios", ve: "Clientes, trabajos, cotizaciones y cobros." },
];

export default function Rubros() {
  return (
    <>
      <Block surface="paper">
        <Reveal>
          <Kicker>Un solo sistema</Kicker>
          <h1 className={s.display}>
            Elegís tu rubro y la cuenta ya viene <em>armada</em>.
          </h1>
          <p className={s.lead}>
            No es un software distinto por industria: es el mismo núcleo con
            módulos y vocabulario propios de tu negocio.
          </p>
        </Reveal>
        <Switcher />
      </Block>

      {/* Qué ve cada rubro */}
      <Block surface="paperDim" labelledBy="que-ve">
        <Reveal>
          <Kicker>Vocabulario por rubro</Kicker>
          <h2 id="que-ve" className={s.h2}>
            La misma base, con las palabras de tu negocio.
          </h2>
          <div className={s.cells}>
            {RUBROS.map((r) => (
              <div key={r.nombre} className={s.cell}>
                <h3 className={s.h3}>{r.nombre}</h3>
                <p>{r.ve}</p>
              </div>
            ))}
          </div>
          <p className={s.note} style={{ marginTop: "2em" }}>
            Cinco rubros vivos y vendibles hoy. ¿El tuyo es otro? Escribinos y lo
            vemos con tu caso.
          </p>
        </Reveal>
      </Block>

      {/* Cierre */}
      <Block surface="green" labelledBy="cierre-rubros">
        <Reveal>
          <h2 id="cierre-rubros" className={s.display} style={{ maxWidth: "16ch" }}>
            Armá tu cuenta con tu rubro.
          </h2>
          <div className={s.actions}>
            <Btn href={EMPEZAR_URL}>Probá {PRUEBA.dias} días gratis</Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
