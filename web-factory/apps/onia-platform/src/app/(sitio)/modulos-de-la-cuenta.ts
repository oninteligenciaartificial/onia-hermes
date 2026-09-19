import {
  CAPACIDADES_INCLUIDAS,
  plan,
  type CapacidadIncluida,
  type PlanId,
} from "@/lib/pricing";

/**
 * Los módulos que dibuja el panel «Tu cuenta», DERIVADOS del plan que ese panel
 * está mostrando.
 *
 * 🔴 POR QUE EXISTE. Medido el 2026-09-19 sobre `onia.com.bo` SERVIDA, leyendo
 * el texto renderizado. El panel pintaba cinco pastillas —Clientes, Caja,
 * Inventario, Contabilidad y **Agentes**— rematadas con «Encendidos desde el
 * primer día», y en la portada se dibuja DOS veces:
 *
 *   1. en el hero, pegado debajo de la única línea de precio del fold:
 *      «14 días de prueba con el plan Profesional, sin tarjeta. Después, desde
 *      Bs 320 al mes» — o sea con el Básico a la vista; y
 *   2. en «ADENTRO · Tres cosas que vas a usar todos los días», que no habla de
 *      la prueba: habla del producto.
 *
 * Y `agentsIncluded` es **false** en `basic` (`onia-platform/lib/plan-catalogo.ts`,
 * ref publicado): los agentes entran recién en Crece, Bs 550. La misma pantalla
 * se desmentía tres secciones más abajo, donde la tarjeta «02 · RECUPERAR» los
 * vende como el motivo de subir. El que pagaba Bs 320 se enteraba DESPUES de
 * pagar, que es el peor momento en el que puede llegar.
 *
 * Es el MISMO defecto que `NOTA_PRUEBA_POR_PLAN` (lib/pricing.ts) documenta
 * palabra por palabra —«recién al pagar Bs 320 se le apagaban los agentes, las
 * reservas online y los reportes completos»—, en la superficie a la que esa
 * cura no viajó: se arreglaron las TARJETAS y quedó el DIBUJO, que es lo único
 * que el lead mira antes de scrollear.
 *
 * POR QUE NINGUN GATE LO VEIA, que es lo que hace nueva a esta clase:
 *  - no hay un solo monto en el panel → `precios:fuente` y `precios:vivos`
 *    firman verde con sus 43 cifras;
 *  - no tipea ningún nombre de plan junto a la capacidad → invisible a
 *    `capacidad-incluida.test.ts`;
 *  - no es un cuantificador universal («todos los módulos», «cualquier plan»)
 *    → invisible a `prueba-vs-plan.test.ts` y a `desbloqueo-que-no-se-tipea`;
 *  - `el-panel-dibuja-lo-que-la-pagina-promete.test.ts` ya cruza los paneles,
 *    pero su eje es rubro × panel: el de la cuenta no es de ningún rubro.
 * El eje nuevo es **panel × PLAN**: una lista de módulos con un alcance
 * TEMPORAL pegado («desde el primer día») y ningún plan nombrado.
 *
 * Por eso la lista no se tipea: cada módulo declara QUÉ capacidad del catálogo
 * lo enciende (`exige`), y el panel filtra por el plan que dibuja. El día que
 * el producto vuelva a mover `agentsIncluded` de escalón, el dibujo se mueve
 * solo — que es justo lo que no pasó la vez anterior.
 */
interface ModuloDeLaCuenta {
  nombre: string;
  /**
   * La capacidad del catálogo que lo enciende, o `null` si es núcleo y viene en
   * TODOS los planes (clientes, caja, inventario y contabilidad básica entran
   * desde el Básico: lo dice su propia tarjeta en `lib/pricing.ts`).
   *
   * Obligatorio a propósito: un módulo nuevo no puede nacer sin contestar quién
   * lo enciende, que es exactamente como entró «Agentes» acá.
   */
  exige: CapacidadIncluida | null;
}

/**
 * Los módulos del panel de cuenta. Son EXACTAMENTE los que nombra el copy que
 * queda al lado en /empezar («Todo encendido: caja, inventario, contabilidad,
 * la cola de agentes y la agenda…») más «Clientes», que nombra la descripción
 * del sitio. Nada acá es una promesa nueva.
 *
 * ⚠️ Acá hubo «Facturación», y estaba mal por dos motivos a la vez. Primero, la
 * lista no coincidía con el párrafo pegado al costado —dos listas de módulos
 * distintas, lado a lado, en la misma pantalla, sin inventario ni contabilidad
 * y con una capacidad de más—. Segundo y peor: iba bajo el remate «Encendidos
 * desde el primer día» mientras la FAQ de la home dice que la homologación
 * sigue en trámite y que por ahora se factura en el Portal Web del SIN. La
 * ilustración prometía lo que el texto del mismo sitio tiene que desmentir.
 *
 * «Agentes» se quedó por la MISMA prueba que echó a «Facturación» —¿el resto
 * del sitio tiene que desmentir esto?— sólo que la respuesta dependía del plan,
 * y nadie se la había hecho al dibujo.
 */
export const MODULOS_DE_LA_CUENTA: readonly ModuloDeLaCuenta[] = [
  { nombre: "Clientes", exige: null },
  { nombre: "Caja", exige: null },
  { nombre: "Inventario", exige: null },
  { nombre: "Contabilidad", exige: null },
  { nombre: "Agentes", exige: "agentes" },
];

/**
 * Los módulos que un plan tiene ENCENDIDOS, en el orden en que se dibujan.
 *
 * Tira si no le pasan plan, y la baranda va acá —en el producto— y no en el
 * tipo: las tres pantallas que dibujan este panel se prerenderizan en
 * `npm run build`, así que un llamador que se olvide del plan rompe el build
 * nombrando el problema, en vez de dibujar en silencio una cuenta que promete
 * de más. Un valor por defecto sería el efecto real: el defecto entero nace de
 * que el panel dibujaba lo mismo para cualquier plan.
 */
export function modulosEncendidosEn(id: PlanId | undefined): readonly string[] {
  if (!id) {
    throw new Error(
      'El panel «Tu cuenta» dibuja los módulos que enciende UN plan: sin `plan` no se puede dibujar sin prometer de más (src/app/(sitio)/modulos-de-la-cuenta.ts).',
    );
  }
  const elPlan = plan(id);
  return MODULOS_DE_LA_CUENTA.filter(
    (m) => m.exige === null || elPlan[CAPACIDADES_INCLUIDAS[m.exige]] === true,
  ).map((m) => m.nombre);
}
