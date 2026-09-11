import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { PROMESAS, sinComentariosDeAca as sinComentarios } from "../../../scripts/privacidad-viva.mjs";

/**
 * Ninguna pagina promete que alguien NO PUEDE VER algo sin que haya un cruce
 * que lo verifique contra el producto.
 *
 * LA CLASE, y por que ningun gate de este carril podia expresarla. Toda la
 * familia persigue promesas POSITIVAS —"esto lo hacemos"—: obra que sobra,
 * capacidad que no tenemos, rubro que falta, condicion que sobra, monto fuera
 * de fuente. Una promesa NEGATIVA es una garantia de privacidad, y su verdad no
 * esta escrita en ninguna pantalla de este repo: vive en un guard del producto,
 * que es otro repositorio. Ninguna palabra sobra ni falta, el precio sale de la
 * fuente, el enlace responde 200 y el rubro deriva bien — y la frase puede ser
 * falsa igual.
 *
 * NO ES HIPOTETICO. El dia que se escribio este gate (2026-09-10), la frase de
 * `/v1/modulos/dental` —"la recepcion agenda y cobra pero no ve historia
 * clinica ni odontograma"— era FALSA para el odontograma, que es la palabra que
 * la propia frase usa: `patients/[id]/odontogram/page.tsx` y
 * `print/prescription/[id]/page.tsx` leen el dato con `prisma` y no piden
 * `clinical.read`, asi que la recepcion los abre tipeando la URL. Son datos de
 * salud, que nuestra propia politica declara categoria sensible. Reportado al
 * dueno del producto en `t_03ddb1d7`.
 *
 * QUE VIGILA ESTE ARCHIVO Y QUE NO. Este es el gate PURO: solo mira que toda
 * promesa de esta forma publicada en el sitio este DECLARADA con el permiso que
 * el producto tiene que aplicar. Quien va a ver si el producto lo aplica de
 * verdad es el cruce vivo (`npm run privacidad:viva`), que necesita el otro
 * repo y por eso no puede estar en esta cadena: un gate que exija un repo
 * vecino se pone rojo por AMBIENTE en toda maquina que no lo tenga, y eso traba
 * el merge de los quince carriles.
 *
 * LA LISTA NO SE PUDRE PORQUE SE RE-MIDE EN LAS DOS DIRECCIONES: una frase
 * publicada sin declarar pone rojo, y una declaracion cuya frase ya no esta
 * publicada tambien. Una fila declarada en prosa no la vuelve a mirar nadie.
 */

const SRC = join(__dirname, "..", "..");
const RAICES = ["app", "lib", "components", "content"];

function archivosDelDisco(): string[] {
  const salida: string[] = [];
  const bajar = (dir: string) => {
    for (const entrada of readdirSync(dir)) {
      const completa = join(dir, entrada);
      if (statSync(completa).isDirectory()) {
        bajar(completa);
        continue;
      }
      if (!/\.tsx?$/.test(entrada)) continue;
      if (/\.test\.[cm]?tsx?$/.test(entrada)) continue;
      salida.push(completa);
    }
  };
  for (const raiz of RAICES) {
    try {
      bajar(join(SRC, raiz));
    } catch {
      /* una raiz que no existe no es un hallazgo */
    }
  }
  return salida;
}

/** No cruza fin de oracion: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';

/**
 * Un rol del negocio DEL CLIENTE. No alcanza "el equipo" ni "el usuario": la
 * promesa que importa nombra a quien se le cierra la puerta.
 */
const ROL = "\\b(?:recepci[oó]n|recepcionista|asistente|secretari[ao]|cajer[ao]|la caja)\\b";

/** La negacion de acceso: lo que convierte al rol en una garantia verificable. */
const NO_VE =
  "\\b(?:no (?:lo |la |los |las )?(?:ve|ven|puede ver|pueden ver|accede|acceden|entra|abre))\\b";

/** El rol y su negacion, en cualquier orden, dentro de la MISMA oracion. */
const FIRMA = new RegExp(`(?:${ROL}${SEP}{0,120}?${NO_VE}|${NO_VE}${SEP}{0,120}?${ROL})`, "i");

/** Las oraciones del archivo que llevan la firma, con el archivo donde viven. */
function promesasPublicadas(): { archivo: string; oracion: string }[] {
  const encontradas: { archivo: string; oracion: string }[] = [];
  for (const archivo of archivosDelDisco()) {
    // Sin comentarios: si no, la bitacora que EXPLICA una de estas promesas
    // dispara el gate y obedecerlo obliga a borrar el registro de lo que pasó.
    const codigo = sinComentarios(readFileSync(archivo, "utf8"));
    for (const oracion of codigo.split(/[.;!?]\s|\n/)) {
      if (FIRMA.test(oracion)) {
        encontradas.push({ archivo: relative(SRC, archivo), oracion: oracion.trim() });
      }
    }
  }
  return encontradas;
}

describe("una promesa de privacidad publicada tiene que estar cruzada contra el producto", () => {
  const publicadas = promesasPublicadas();

  it("ninguna frase de «este rol NO ve esto» se publica sin declarar", () => {
    const sinDeclarar = publicadas.filter(
      (p) => !PROMESAS.some((d: { marca: string }) => p.oracion.includes(d.marca)),
    );
    expect(
      sinDeclarar.map((p) => `${p.archivo}: ${p.oracion.slice(0, 140)}`),
      "El sitio promete que alguien no puede ver algo y NADIE lo cruza contra el producto. " +
        "Declarala en PROMESAS de scripts/privacidad-viva.mjs con el permiso que el producto " +
        "tiene que aplicar, y corré `npm run privacidad:viva` para ver si hoy es cierta.",
    ).toEqual([]);
  });

  it("ninguna promesa declarada sobra: si la frase ya no se publica, la fila se saca", () => {
    const huerfanas = PROMESAS.filter(
      (d: { marca: string }) => !publicadas.some((p) => p.oracion.includes(d.marca)),
    ).map((d: { marca: string; donde: string }) => `${d.donde}: ${d.marca}`);
    expect(
      huerfanas,
      "Una fila declarada que ya nadie publica deja de medirse y se lee como cobertura.",
    ).toEqual([]);
  });

  it("cada promesa declara DONDE se publica, y ese archivo existe", () => {
    for (const d of PROMESAS as { donde: string; marca: string }[]) {
      const archivo = join(SRC, "..", d.donde);
      expect(() => statSync(archivo), `${d.donde} no existe: el puntero de "${d.marca}" es fantasma`).not.toThrow();
    }
  });

  it("la firma reconoce la forma real de la frase que ya está publicada", () => {
    // El caso que YA CUMPLE. Sin él, un patrón que dejara de matchear nada
    // pasaría en verde: cero frases se lee igual que cero defectos.
    expect(publicadas.length).toBeGreaterThan(0);
    expect(FIRMA.test("la recepción agenda y cobra pero no ve historia clínica ni odontograma")).toBe(true);
  });

  it("no confunde una negación de OTRA cosa con una garantía de acceso", () => {
    // La dirección cara: acusar copy sano y mandar a reescribirlo.
    expect(FIRMA.test("La recepción agenda y cobra desde la misma pantalla")).toBe(false);
    expect(FIRMA.test("Nadie instala nada: no ve un proyecto de meses")).toBe(false);
  });
});
