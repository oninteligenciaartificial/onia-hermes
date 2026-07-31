"use client";

import { CtaRail } from "@/components/ui/cta-rail";
import { useRubro } from "@/components/rubro-context";
import { CAL_DEMO_URL, waLink } from "@/lib/site";
import { rubroPlanes } from "@/lib/pricing";

/**
 * Las salidas a la accion repartidas por la pagina, cada una con el mensaje
 * del momento en que aparece. Viven aca —y no en page.tsx— porque todas
 * necesitan el rubro elegido: el mensaje de WhatsApp sale ya contextualizado y
 * del otro lado no hay que volver a preguntar quien es.
 */

/** Despues de la prueba: el visitante ya vio el hueco. Lo unico que falta es el numero. */
export function RailPrecio() {
  return (
    <CtaRail
      etiqueta="Siguiente paso"
      titulo="Si ese cruce es tu problema, el precio está publicado."
      apoyo="Sin formulario y sin llamar para preguntarlo: los tres planes, con la letra chica escrita."
      acciones={[
        { label: "Ver los planes", href: "#precios", tipo: "ghost" },
      ]}
    />
  );
}

/**
 * Despues de ver al agente trabajar — el punto de mayor intencion de toda la
 * pagina. Es la UNICA banda en tono "loud" y la unica que ofrece la agenda
 * real (Cal.com propio) como accion principal.
 */
export function RailDemo() {
  const { rubro } = useRubro();
  const actual = rubroPlanes(rubro);
  const texto = `Hola, vengo de la web de Onia. Rubro: ${actual.mensaje}. Vi lo del agente que reprograma y quiero verlo andando.`;

  return (
    <CtaRail
      tono="loud"
      etiqueta="Verlo con tus números"
      titulo="Te lo mostramos andando con tu caso. 45 minutos."
      apoyo="Hacemos la cuenta con tus números, no con los nuestros: cuántas citas se te caen al mes y cuánto es eso en bolivianos. Si no te cierra, te lo decimos ahí mismo."
      acciones={[
        { label: "Elegir horario", href: CAL_DEMO_URL, externo: true },
        { label: "Prefiero escribir primero", href: waLink(texto), tipo: "ghost", externo: true },
      ]}
    />
  );
}

/** Despues del bloque fiscal: la duda que frena es el grupo del NIT, no el precio. */
export function RailFiscal() {
  const { rubro } = useRubro();
  const actual = rubroPlanes(rubro);
  const texto = `Hola, vengo de la web de Onia. Rubro: ${actual.mensaje}. Tengo una duda con la facturación en línea y mi NIT.`;

  return (
    <CtaRail
      etiqueta="Antes de comprar nada"
      titulo="¿No sabés si a tu NIT ya le corre el plazo?"
      apoyo="Preguntanos y te decimos dónde mirarlo en tu Oficina Virtual. No te lo vamos a afirmar nosotros ni te vamos a vender una obligación que no existe."
      acciones={[
        { label: "Preguntar por WhatsApp", href: waLink(texto), externo: true },
      ]}
    />
  );
}
