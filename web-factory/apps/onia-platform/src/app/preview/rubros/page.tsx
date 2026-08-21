import { Reveal } from "@/motion";
import { PRUEBA } from "@/lib/pricing";
import { Block, Btn, Kicker } from "../ui";
import { Switcher } from "../switcher";
import s from "../preview.module.css";

/**
 * Apartado de RUBROS. Un producto, muchos rubros — el conmutador es la estrella.
 * Seis rubros vivos y vendibles hoy; el vocabulario por rubro es lo que cada
 * negocio ve en la misma base (no son productos distintos). Solo dental tiene
 * página propia hoy (/modulos/dental): el resto se nombra, no se linkea a una
 * URL muerta. Cero "muy pronto" (regla: la venta nunca exhibe obra).
 */

const RUBROS: readonly { nombre: string; ve: string; href?: string }[] = [
  {
    nombre: "Dental",
    ve: "Pacientes, tratamientos, odontograma y agenda por sillón.",
    href: "/modulos/dental",
  },
  { nombre: "Comercio", ve: "Productos, stock, ventas y fiados." },
  { nombre: "Importadora", ve: "Depósito, lotes, proveedores y costos de importación." },
  { nombre: "Estética", ve: "Clientes, sesiones, paquetes y recordatorios." },
  { nombre: "Veterinaria", ve: "Animales, fichas, vacunas y control de peso." },
  { nombre: "Servicios", ve: "Clientes, trabajos, cotizaciones y cobros." },
];

export default function PreviewRubros() {
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
                <h3 className={s.h3}>
                  {r.href ? (
                    <a className={s.link} href={r.href}>
                      {r.nombre} →
                    </a>
                  ) : (
                    r.nombre
                  )}
                </h3>
                <p>{r.ve}</p>
              </div>
            ))}
          </div>
          <p className={s.note} style={{ marginTop: "2em" }}>
            Seis rubros vivos y vendibles hoy. ¿El tuyo es otro? Escribinos y lo
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
            <Btn href="/prueba-gratis">Probá {PRUEBA.dias} días gratis</Btn>
          </div>
        </Reveal>
      </Block>
    </>
  );
}
