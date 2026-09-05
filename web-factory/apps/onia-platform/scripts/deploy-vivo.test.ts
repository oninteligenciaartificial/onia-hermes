import { describe, expect, it } from "vitest";

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  NO_PUDE_MEDIR,
  STAGED_CUBRE,
  STAGED_MARCA,
  STAGED_NINGUNO,
  STAGED_VIEJO,
  ZONA,
  diagnosticar,
  evaluarStaged,
  llegaAlCliente,
} from "./deploy-vivo.mjs";

/**
 * El gate del gate: que `deploy-vivo.mjs` no pueda fallar ABIERTO.
 *
 * Todo lo que este archivo comprueba nace del mismo suceso, medido el
 * 2026-09-04: los cuatro números del objetivo de este carril daban verde
 * —prohibidos 0, precios fuera de fuente 0, CTA rotos 0, favicon 200— mientras
 * SEIS arreglos ya mergeados a `main` no llegaban al cliente. Entre ellos, los
 * nueve botones «Creá tu cuenta» que seguían abriendo otra página de venta.
 *
 * El termómetro era el favicon, y el favicon no puede detectar esto: una vez
 * que un deploy lo trae, da 200 para siempre. Queda clavado en verde y firma
 * "el deploy está al día" sobre un sitio de ocho horas de antigüedad.
 */
describe("deploy-vivo: el diagnóstico", () => {
  /**
   * Las dos entradas vienen en unidades distintas —git da segundos, `statSync`
   * da milisegundos— y confundirlas invierte el veredicto en silencio. Se
   * escriben con nombre para que el test no pueda mentir por un factor de mil.
   */
  const seg = (s: number) => s;
  const ms = (s: number) => s * 1000;
  const commit = (ct: number, subject = "fix: algo") => ({
    sha: `sha${ct}`,
    ct,
    subject,
  });

  it("da ROJO cuando main tiene commits de la zona posteriores al build vivo", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(1_000),
      commits: [commit(seg(2_000), "fix: el CTA no creaba la cuenta")],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(ARREGLOS_VARADOS);
    expect(r.varados).toHaveLength(1);
    expect(r.varados[0].subject).toContain("CTA");
  });

  it("da VERDE cuando el build vivo es posterior a todo commit de la zona", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(3_000),
      commits: [commit(seg(1_000)), commit(seg(2_000))],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(AL_DIA);
    expect(r.varados).toHaveLength(0);
  });

  /**
   * El modo de fallo que este gate existe para no repetir. Cada rama que no
   * puede medir tiene que salir por NO_PUDE_MEDIR, nunca por AL_DIA: un gate
   * que no corrió no es un gate que pasó.
   */
  describe("no puede fallar en verde", () => {
    it("sin fecha del build vivo NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: null,
        commits: [],
        homeStatus: 200,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
      expect(r.codigo).not.toBe(AL_DIA);
    });

    it("sin respuesta de git NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: ms(1_000),
        commits: null,
        homeStatus: 200,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
    });

    it("si la home no responde 200 NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: ms(3_000),
        commits: [commit(seg(1_000))],
        homeStatus: 502,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
    });

    /**
     * Un `git log` vacío tiene DOS causas opuestas —no hay nada varado, o el
     * comando falló— y confundirlas es exactamente cómo esta familia de gates
     * se rinde en verde. Por eso la lista vacía sólo vale si el llamador la
     * midió: `[]` es un dato, `null` es la ausencia de dato.
     */
    it("distingue «cero varados» de «no pude preguntar»", () => {
      expect(
        diagnosticar({ buildIdMtimeMs: ms(9), commits: [], homeStatus: 200 })
          .codigo,
      ).toBe(AL_DIA);
      expect(
        diagnosticar({ buildIdMtimeMs: ms(9), commits: null, homeStatus: 200 })
          .codigo,
      ).toBe(NO_PUDE_MEDIR);
    });
  });

  /**
   * El empate importa: `next build` escribe el BUILD_ID cuando TERMINA, así que
   * un commit con el mismo segundo ya está adentro. Tratarlo como varado haría
   * pedir un deploy que no hace falta — y un pedido de deploy inventado le
   * llega a Sergio igual que uno real.
   */
  it("un commit del mismo segundo que el build NO está varado", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(5_000),
      commits: [commit(seg(5_000))],
      homeStatus: 200,
    });
    expect(r.codigo).toBe(AL_DIA);
  });
});

/**
 * El build ya armado: decir CUÁL publicar, y callarse cuando no sirve.
 *
 * Nace de un fallo medido tres veces el mismo día (2026-09-04) sobre la MISMA
 * tarea de deploy, que es la única superficie por donde estos arreglos llegan
 * al cliente:
 *
 *   12:40 — se pidió publicar un staged que traía viva la etiqueta «Facturación
 *           SIAT» que el commit siguiente ya había sacado. Se habría publicado
 *           el hero nuevo Y de paso una promesa falsa.
 *   16:41 — se corrigió con el comando bueno, verificado adentro.
 *   20:55 — esa carpeta ya no existía (la borró el build siguiente), así que la
 *           tarea le pedía a Sergio un comando que sólo podía darle un error.
 *
 * Los tres son el mismo defecto: la ruta se COPIA de una medición anterior en
 * vez de derivarse. Un comando que ya no corre no se ve distinto de una
 * decisión pendiente — nadie revisa si la carpeta sigue viva— y el arreglo no
 * llega al cliente ningún día.
 */
describe("deploy-vivo: qué build hay armado para publicar", () => {
  const seg = (s: number) => s;
  const ms = (s: number) => s * 1000;
  const commit = (ct: number, subject = "fix: algo") => ({
    sha: `sha${ct}`,
    ct,
    subject,
  });
  const staged = (ctSegundos: number) => ({
    ruta: `/opt/onia-landing/runtime-next.new-${ctSegundos}`,
    buildId: `build-${ctSegundos}`,
    mtimeMs: ms(ctSegundos),
  });

  it("ofrece el build armado cuando es posterior a todos los arreglos", () => {
    const r = evaluarStaged({
      staged: staged(5_000),
      varados: [commit(seg(1_000)), commit(seg(2_000))],
    });

    expect(r.estado).toBe(STAGED_CUBRE);
    expect(r.faltan).toHaveLength(0);
  });

  /**
   * El caso de las 12:40. El staged es más nuevo que el build VIVO —así que
   * parece publicable— pero más viejo que el último arreglo. Publicarlo deja
   * ese arreglo afuera y encima cierra el pedido: nadie vuelve a mirar.
   */
  it("NO ofrece un build anterior a algún arreglo, y nombra el que quedaría afuera", () => {
    const r = evaluarStaged({
      staged: staged(3_000),
      varados: [commit(seg(1_000)), commit(seg(9_000), "fix: el pie vendía la factura SIAT")],
    });

    expect(r.estado).toBe(STAGED_VIEJO);
    expect(r.estado).not.toBe(STAGED_CUBRE);
    expect(r.faltan).toHaveLength(1);
    expect(r.faltan[0].subject).toContain("SIAT");
  });

  /**
   * El caso de las 20:55: la carpeta se borró. Sin build utilizable la salida
   * tiene que mandar a ARMARLO, nunca imprimir una ruta igual — un comando que
   * el swap rechaza con `ERR: bad STAGE path` se lee como deploy pedido.
   */
  it("sin ningún build armado NO inventa una ruta", () => {
    const r = evaluarStaged({ staged: null, varados: [commit(seg(1_000))] });

    expect(r.estado).toBe(STAGED_NINGUNO);
    expect(r.faltan).toHaveLength(1);
  });

  /**
   * El empate, igual que en `diagnosticar`: `next build` escribe el BUILD_ID al
   * TERMINAR, así que un commit del mismo segundo ya entró al build. Tratarlo
   * como faltante mandaría a rearmar un build que ya sirve.
   */
  it("un arreglo del mismo segundo que el build armado ya está adentro", () => {
    const r = evaluarStaged({ staged: staged(5_000), varados: [commit(seg(5_000))] });

    expect(r.estado).toBe(STAGED_CUBRE);
  });

  /**
   * Se comprueba lo MISMO que comprueba `swap-and-verify.sh` para aceptar una
   * ruta. Si este marcador se despega del script, el gate vuelve a ofrecer
   * rutas que el swap rechaza, que es el fallo de las 20:55 con otra cara.
   */
  it("valida el mismo archivo que exige el swap", () => {
    expect(STAGED_MARCA).toBe("apps/onia-platform/server.js");
  });
});

/**
 * El ancla contra el recorte del árbol. Ya pasó dos veces en este carril con
 * otros gates: la cobertura se declara con una lista de raíces escritas a mano
 * y el día que algo queda fuera de esa lista, deja de tener gate sin que nada
 * se ponga rojo. Acá la zona es UNA y es la del carril entera.
 */
describe("deploy-vivo: la zona que vigila", () => {
  it("vigila la app completa, no una lista de subcarpetas", () => {
    expect(ZONA).toBe("web-factory/apps/onia-platform");
  });
});

/**
 * Qué cuenta como «arreglo que el cliente no ve» — y por qué NO es «todo commit
 * de la zona».
 *
 * EL SUCESO, medido el 2026-09-04 20:48 La Paz. El gate decía «8 arreglos
 * varados» y, peor, «NO publicar el build que hay armado: es anterior a 2
 * arreglos». Esos dos commits eran `scripts/deploy-vivo.mjs` y su test —el
 * propio instrumento— y un script del repo no viaja en el bundle de Next: el
 * navegador de un lead no puede verlo ni antes ni después de publicar. O sea
 * que el gate invalidaba un build que SÍ traía los cuatro arreglos reales, y
 * mandaba a rearmarlo desde cero.
 *
 * El costo no es cosmético y ya está medido: la tarea de deploy envejeció TRES
 * veces el mismo día. Cada vuelta de este carril commitea alguna herramienta,
 * eso marca el staged como viejo, se rearma, y la carpeta nueva borra la que
 * la tarea nombraba. El pedido no podía estabilizarse nunca, y cuatro arreglos
 * de la primera pantalla llevaban el día entero sin llegar a nadie.
 *
 * Es la familia inversa a la que este carril ya cazó cuatro veces: no falla
 * ABIERTO (aprobar lo roto) sino CERRADO, y por eso nadie lo audita — un número
 * alto y estable se lee como diagnóstico, no como síntoma. La corrección
 * mantiene el sesgo seguro: se SHIPPEA por defecto, y sólo una lista corta y
 * nombrada de cosas que Next nunca empaqueta queda afuera.
 */
describe("deploy-vivo: qué archivos llegan de verdad al cliente", () => {
  const enZona = (p: string) => `${ZONA}/${p}`;

  it("un commit que sólo toca herramientas del carril NO es un arreglo varado", () => {
    const r = diagnosticar({
      buildIdMtimeMs: 1_000 * 1000,
      commits: [
        {
          sha: "4f6e3aad8",
          ct: 2_000,
          subject: "fix: el pedido de deploy nombraba una carpeta borrada",
          archivos: [
            enZona("scripts/deploy-vivo.mjs"),
            enZona("scripts/deploy-vivo.test.ts"),
          ],
        },
      ],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(AL_DIA);
    expect(r.varados).toHaveLength(0);
  });

  it("un commit que toca una pantalla SÍ es un arreglo varado", () => {
    const r = diagnosticar({
      buildIdMtimeMs: 1_000 * 1000,
      commits: [
        {
          sha: "7816fc783",
          ct: 2_000,
          subject: "feat: la primera pantalla vendía el add-on",
          archivos: [enZona("src/app/(sitio)/page.tsx")],
        },
      ],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(ARREGLOS_VARADOS);
    expect(r.varados).toHaveLength(1);
  });

  /**
   * El caso mixto es el que decide el diseño: basta UN archivo que viaje para
   * que el commit cuente. Exigir que TODOS viajen sería la puerta por la que se
   * cuela un arreglo real escondido detrás de un test — el fallo abierto.
   */
  it("basta un solo archivo que viaje para que el commit cuente", () => {
    const r = diagnosticar({
      buildIdMtimeMs: 1_000 * 1000,
      commits: [
        {
          sha: "77de88173",
          ct: 2_000,
          subject: "fix: el asistente decía «todavía en construcción»",
          archivos: [
            enZona("src/app/v1/empezar/whatsapp.test.ts"),
            enZona("src/app/v1/empezar/whatsapp.ts"),
            enZona("vitest.config.ts"),
          ],
        },
      ],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(ARREGLOS_VARADOS);
  });

  describe("llegaAlCliente: se shippea por defecto", () => {
    it("deja afuera sólo lo que Next nunca empaqueta", () => {
      expect(llegaAlCliente([enZona("scripts/mirar-venta.mjs")])).toBe(false);
      expect(llegaAlCliente([enZona("src/app/(sitio)/precios.test.ts")])).toBe(false);
      expect(llegaAlCliente([enZona("src/lib/__tests__/x.ts")])).toBe(false);
      expect(llegaAlCliente([enZona("vitest.config.ts")])).toBe(false);
    });

    it("cuenta el código, los estilos y los estáticos", () => {
      expect(llegaAlCliente([enZona("src/components/site-footer.tsx")])).toBe(true);
      expect(llegaAlCliente([enZona("src/app/(sitio)/sitio.module.css")])).toBe(true);
      expect(llegaAlCliente([enZona("public/favicon.ico")])).toBe(true);
      expect(llegaAlCliente([enZona("next.config.mjs")])).toBe(true);
    });

    /**
     * `package.json` queda del lado que viaja a propósito, aunque el commit que
     * motivó todo esto sólo le agregara un script de test: ahí también se
     * declaran las dependencias, y una subida de versión sí cambia el bundle.
     * Ante la duda, el sesgo va hacia «hay que rearmar», nunca hacia «publicá
     * ese build viejo».
     */
    it("ante la duda cuenta como que viaja", () => {
      expect(llegaAlCliente([enZona("package.json")])).toBe(true);
      expect(llegaAlCliente([enZona("un-archivo-que-nadie-previo.xyz")])).toBe(true);
    });

    /**
     * Un commit sin lista de archivos es ausencia de dato, no prueba de que no
     * viaje: si `git log --name-only` deja de contestar, el gate tiene que
     * seguir pidiendo el deploy. Es la misma regla que separa `[]` de `null` en
     * el resto de este archivo.
     */
    it("sin lista de archivos NO se descarta el commit", () => {
      expect(llegaAlCliente(undefined)).toBe(true);
      expect(llegaAlCliente([])).toBe(true);
    });
  });
});
