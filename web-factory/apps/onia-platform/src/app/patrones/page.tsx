import type { Metadata } from "next";
import { PatronesDemo } from "./patrones-demo";

export const metadata: Metadata = {
  title: "Patrones de scroll — Web Factory",
  robots: { index: false, follow: false },
};

/**
 * Banco vivo de patrones de scroll. Ruta interna (noindex) para revisar los
 * componentes nuevos del kit contra el diseno real, no contra una captura.
 */
export default function PatronesPage() {
  return <PatronesDemo />;
}
