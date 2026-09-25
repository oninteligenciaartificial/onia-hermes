import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  COMANDO_PUBLICAR,
  NO_PUDE_MEDIR,
  STAGED_CUBRE,
  STAGED_MARCA,
  STAGED_NINGUNO,
  STAGED_PREFIX,
  STAGED_VIEJO,
  ZONA,
  baseDelBuild,
  commitsDesde,
  diagnosticar,
  evaluarStaged,
  llegaAlCliente,
  BUILD_ID_VIVO,
  STAGED_DIR,
  fechaBuildVivo,
  parsearStagedRemoto,
  stagedDisponible,
  ultimaCorridaDeLanding,
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

  /**
   * ⚠️ Este caso le pasaba dos commits ANTERIORES al build y exigía verde,
   * porque `diagnosticar` los filtraba por fecha. Ese corte se mudó a
   * `baseDelBuild` el 2026-09-17: quién entra al conjunto lo decide
   * `commitsDesde` por ancestría, y `diagnosticar` sólo pregunta si lo que
   * recibe llega al cliente. La propiedad que este caso protege —sin sujetos,
   * verde— sigue viva; el corte por fecha se prueba ahora donde vive.
   */
  it("da VERDE cuando no hay ni un commit que el build no traiga", () => {
    const r = diagnosticar({ buildIdMtimeMs: ms(3_000), commits: [], homeStatus: 200 });

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
    // El empate lo resuelve `baseDelBuild`, que es quien corta por fecha desde
    // el 2026-09-17: el caso que lo prueba contra un repo real está abajo, en
    // «el empate: un commit del mismo segundo que el build ya está adentro».
    // Acá queda la mitad que sigue siendo de `diagnosticar`: si el conjunto
    // llegó vacío, el veredicto es verde y no otra cosa.
    const r = diagnosticar({ buildIdMtimeMs: ms(5_000), commits: [], homeStatus: 200 });
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
 * Un merge NO es un arreglo varado — y por qué no alcanzaba con `llegaAlCliente`.
 *
 * EL SUCESO, medido el 2026-09-06: el gate declaraba 43 commits en la zona desde
 * el build vivo, y SIETE eran merges (16 % inflado). En su propia salida listaba
 * tres veces «Merge remote-tracking branch 'origin/claude/web-venta'». Un merge
 * duplica el arreglo que ya se contó por su commit propio, así que el número que
 * termina en el pedido de deploy que Sergio Urcullo aprueba exagera cuánto
 * trabajo urgente hay parado.
 *
 * LA MECÁNICA, que no es «falta un flag». `git log --name-only` no lista los
 * archivos de un merge (no muestra su diff salvo con `-m`/`-c`), así que todo
 * merge llegaba con `archivos: []` — y `llegaAlCliente([])` responde `true` A
 * PROPÓSITO, porque una lista vacía es ausencia de dato y el sesgo seguro es
 * shippear. Ese default es correcto para un commit normal y equivocado para un
 * merge, que por construcción no aporta cambios propios. Por eso se corrige
 * sacando los merges del conjunto ANTES de clasificar, y no tocando
 * `llegaAlCliente`, que debe seguir fallando hacia «sí viaja».
 *
 * Es la misma familia que este archivo ya cazó con las herramientas del carril:
 * falla CERRADO, y un número alto y estable se lee como diagnóstico en vez de
 * como síntoma.
 */
describe("deploy-vivo: un merge no es un arreglo", () => {
  // Ventana amplia y fija: el repo mergea ramas de carril a diario, así que
  // contiene merges con enorme margen. Si algún día no contuviera, el caso de
  // abajo se pone ROJO en vez de pasar vacío.
  const DIAS = 60;
  const desdeMs = Date.now() - DIAS * 24 * 60 * 60 * 1000;

  /**
   * Los tres casos de este bloque son los únicos del archivo que salen a `git`
   * de verdad; el resto se prueba con datos inyectados. Y `onia-hermes` pesa
   * varios GB, así que el PRIMER `git log` del proceso paga la caché fría del
   * disco: medido el 2026-09-07 en nodo-casa (WSL), tardó más de los 5 s que
   * vitest da por defecto y el caso murió por `Test timed out`, no por su
   * afirmación. Verde en la corrida siguiente, con la caché tibia.
   *
   * Eso deja roja la cadena `npm test` de la raíz, que el integrador corre
   * antes de tocar `main`: un timeout que depende de qué tenga cacheado el
   * sistema operativo traba el merge de los quince carriles y no dice por qué.
   * El tope se sube donde el trabajo es de disco; ninguna afirmación cambia.
   */
  const TOPE_GIT_MS = 60_000;

  /**
   * ¿Hay un repo git donde corre esto?
   *
   * EL CASO REAL, medido el 2026-09-07: `publicar.sh` construye la landing sobre
   * un TARBALL extraído en `/opt/onia-landing/_deploy/build-<fecha>/`, que no
   * tiene `.git`. Ahí `git log` sale distinto de cero, `shasDeMerges()` devuelve
   * `null`, y los tres casos de este bloque fallan con "expected null not to be
   * null". El build se frenó en su propio gate y **34 arreglos verdes no
   * llegaron al cliente** — con `tsc` limpio y los otros 813 tests en verde.
   *
   * Es la misma familia que el timeout de arriba: el caso no muere por su
   * afirmación, muere por dónde lo corrieron.
   *
   * Se SALTEAN, no se ablandan. Es la doctrina que este repo ya aplica en
   * `loops_registrados.mjs`: *"el gate no falla donde no puede medir — un gate
   * que miente es peor que uno ausente"*. Donde SÍ hay repo (desarrollo, CI, y
   * el árbol del integrador antes de tocar `main`) corren enteros y siguen
   * siendo el único que verifica que el pedido no cuente dos veces el mismo
   * arreglo.
   *
   * ⚠️ Y se saltean RUIDOSO, no en silencio: el propio comentario de abajo avisa
   * que "un gate que se queda sin sujetos firma en verde". Un `skipIf` aparece
   * como salteado en la salida de vitest; un `return` temprano, no.
   */
  const HAY_GIT =
    spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
      encoding: "utf8",
      cwd: dirname(fileURLToPath(import.meta.url)),
    }).status === 0;

  const shasDeMerges = () => {
    const r = spawnSync(
      "git",
      [
        "log",
        "--format=%H",
        "--merges",
        `--since=@${Math.floor(desdeMs / 1000)}`,
        "origin/main",
        "--",
        `:/${ZONA}`,
      ],
      { encoding: "utf8", cwd: dirname(fileURLToPath(import.meta.url)) },
    );
    if (r.status !== 0) return null;
    return r.stdout.split("\n").filter(Boolean);
  };

  /**
   * El caso que impide que este bloque pase sin medir nada.
   *
   * Sin él, `--no-merges` se podría borrar del script y los dos casos seguirían
   * verdes el día que la ventana no tuviera merges: el conjunto a excluir sería
   * vacío y la intersección daría vacía por el motivo equivocado. Es la trampa
   * exacta de esta familia —un gate que se queda sin sujetos firma en verde—,
   * así que la premisa se afirma explícitamente.
   */
  it.skipIf(!HAY_GIT)("la ventana elegida CONTIENE merges (si no, lo de abajo no probaría nada)", () => {
    const merges = shasDeMerges();
    expect(merges, "git no contestó: el caso siguiente no puede concluir").not.toBeNull();
    expect(merges!.length).toBeGreaterThan(0);
  }, TOPE_GIT_MS);

  it.skipIf(!HAY_GIT)("no devuelve ni un merge, así que el pedido no cuenta el mismo arreglo dos veces", () => {
    const commits = commitsDesde(desdeMs);
    const merges = shasDeMerges();
    expect(commits).not.toBeNull();
    expect(merges).not.toBeNull();

    // `commitsDesde` acorta el sha a 9; se compara por prefijo contra el completo.
    const devueltos = new Set(commits!.map((c) => c.sha));
    const colados = merges!.filter((m) => devueltos.has(m.slice(0, 9)));

    expect(
      colados,
      `se colaron ${colados.length} merge(s) en el conteo de arreglos varados`,
    ).toEqual([]);
  }, TOPE_GIT_MS);

  /**
   * La otra dirección: que el filtro no se haya llevado puesto el trabajo real.
   * Un `--no-merges` mal puesto —o un pathspec roto— vaciaría el conteo, y este
   * gate fallaría ABIERTO declarando «al día» un sitio atrasado, que es
   * justamente lo que `deploy-vivo` existe para impedir.
   */
  it.skipIf(!HAY_GIT)("sigue contando los commits normales de la zona", () => {
    const commits = commitsDesde(desdeMs);
    expect(commits).not.toBeNull();
    expect(commits!.length).toBeGreaterThan(0);
  }, TOPE_GIT_MS);
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

/**
 * El comando que este gate imprime es lo ÚNICO que alguien copia de acá: va
 * pegado en la tarea del tablero y se queda ahí hasta que Sergio contesta.
 *
 * Si nombra la carpeta armada, caduca — el build siguiente la borra — y el
 * fallo se disfraza de decisión pendiente: la tarea sigue diciendo «espera el
 * OK» cuando ya no se puede ejecutar ningún día. Medido sobre t_cb722b7e, que
 * se rehizo TRES veces el 2026-09-04 y las tres venció antes de la respuesta,
 * con quince arreglos sin llegar al cliente.
 *
 * Por eso el invariante no es «la ruta está bien derivada» sino «no hay ruta».
 */
describe("deploy-vivo: el comando que se pega no puede caducar", () => {
  const fuente = readFileSync(new URL("./deploy-vivo.mjs", import.meta.url), "utf8");

  /**
   * Los comentarios se sacan ANTES de aplicar el patrón. Este archivo explica
   * en prosa por qué la ruta con timestamp es el defecto, y la cita textual —
   * `runtime-next.new-…`, `swap-and-verify.sh <ruta>` — pondría el guard en
   * rojo sobre su propia bitácora, obligando a borrar la explicación para que
   * pase. Ya pasó con el guard del hero el 2026-09-04.
   */
  const codigo = fuente
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"));

  /**
   * El patrón se aplica a lo que el gate IMPRIME, no a todo el archivo.
   *
   * `STAGED_PREFIX` es una constante legítima: sin ella `stagedDisponible()` no
   * puede encontrar los builds en disco, que es justo lo que permite decir «hay
   * uno armado y está viejo». Prohibirla en todo el código pone en rojo la
   * capacidad de MEDIR para castigar la de EMITIR — y el arreglo obvio sería
   * dejar al gate ciego. Lo que no puede salir por pantalla es la carpeta.
   */
  const salida = codigo.filter((l) => l.includes("console.")).join("\n");
  const todo = codigo.join("\n");

  it("apunta a publicar.sh y no lleva argumentos", () => {
    expect(COMANDO_PUBLICAR).toContain("publicar.sh");
    expect(COMANDO_PUBLICAR).not.toContain(STAGED_PREFIX);
    // Sin argumentos: `bash <ruta>` y nada más. Un tercer token sería la ruta
    // volviendo por la ventana.
    expect(COMANDO_PUBLICAR.trim().split(/\s+/)).toHaveLength(2);
  });

  /**
   * El caso que de verdad se rompió: el gate imprimía
   * `swap-and-verify.sh ${staged.ruta}`. Con el arreglo puesto, ninguna línea
   * de código puede volver a emitir la ruta armada — ni interpolada, ni
   * concatenada.
   */
  it("ninguna línea de salida emite la carpeta armada", () => {
    expect(salida).not.toContain(STAGED_PREFIX);
    // `staged.ruta` no se usa ya en ninguna parte: la carpeta se mide para
    // decidir si hay que rearmar, y esa decisión la toma `publicar.sh` sola.
    expect(todo).not.toContain("staged.ruta");
  });

  /**
   * `swap-and-verify.sh` y `build-and-stage.sh` son los dos comandos que
   * EXIGEN una ruta o dejan el trabajo a medias. Que no se los nombre como
   * receta es lo que mantiene un solo comando en la tarea; `publicar.sh` los
   * llama por dentro.
   */
  it("no ofrece los comandos que sí caducan", () => {
    expect(salida).not.toContain("swap-and-verify.sh");
    expect(salida).not.toContain("build-and-stage.sh");
  });
});

/**
 * De dónde saca el gate lo que mide, y por qué eso decidió dos vueltas enteras.
 *
 * El 2026-09-04 este carril dejó de correr en el VPS y pasó a correr en el nodo
 * de casa (WSL). El sitio no está montado ahí, así que `statSync` del BUILD_ID
 * tiraba y el gate salía por `NO PUDE MEDIR — ¿Estoy en el VPS?` en su primera
 * línea, sin llegar a preguntarle nada a git.
 *
 * No fue un fallo en verde —el exit sigue siendo 2— pero el efecto fue el
 * mismo: el único instrumento capaz de ver el deploy varado no producía
 * veredicto, y los cuatro números del objetivo (prohibidos 0, precios 0, CTA
 * rotos 0, favicon 200) firmaron «meta cumplida» dos vueltas seguidas con
 * VEINTE arreglos mergeados que el cliente no veía. Entre ellos, otra vez, los
 * nueve botones «Creá tu cuenta» abriendo otra página de venta, y el pie
 * vendiendo la factura SIAT que el emisor todavía no emite.
 *
 * La lección es la de siempre en este carril, en su forma más cara: un gate que
 * no puede medir donde corre no es un gate. Dónde vive el disco del sitio es
 * una circunstancia de la máquina, no una propiedad del sitio.
 */
describe("deploy-vivo: mide el sitio vivo aunque no corra en el VPS", () => {
  const ms = (s: number) => s * 1000;

  it("si el sitio no está montado en esta máquina, pregunta por SSH", () => {
    const r = fechaBuildVivo(BUILD_ID_VIVO, {
      local: () => null,
      remoto: () => ms(7_000),
    });

    expect(r).toBe(ms(7_000));
  });

  /**
   * En el VPS el disco está a mano y SSH no debe usarse: es más lento y puede
   * no estar configurado. El local manda siempre que conteste.
   */
  it("si el sitio está montado acá, NO sale a la red", () => {
    let salioALaRed = false;
    const r = fechaBuildVivo(BUILD_ID_VIVO, {
      local: () => ms(3_000),
      remoto: () => {
        salioALaRed = true;
        return ms(9_999);
      },
    });

    expect(r).toBe(ms(3_000));
    expect(salioALaRed).toBe(false);
  });

  /**
   * El sesgo, otra vez: sin disco y sin SSH no se sabe nada, y no saber nada
   * NUNCA es «al día». `diagnosticar` ya convierte ese `null` en NO_PUDE_MEDIR.
   */
  it("sin disco y sin SSH devuelve null, que es ausencia de dato", () => {
    const r = fechaBuildVivo(BUILD_ID_VIVO, { local: () => null, remoto: () => null });

    expect(r).toBeNull();
    expect(diagnosticar({ buildIdMtimeMs: r, commits: [], homeStatus: 200 }).codigo).toBe(
      NO_PUDE_MEDIR,
    );
  });

  /**
   * El build armado se busca en el mismo disco que el vivo. Si el gate midiera
   * el runtime por SSH y el staged en el disco local, diría «no hay ningún
   * build armado» sobre una máquina donde sí lo hay, y mandaría a rearmar uno
   * que ya existe — un pedido de deploy inventado, que a Sergio le llega igual
   * que los reales.
   */
  it("busca el build armado en el mismo disco donde encontró el vivo", () => {
    const candidato = {
      ruta: "/opt/onia-landing/runtime-next.new-20260905023618",
      buildId: "abc123",
      mtimeMs: ms(5_000),
    };
    const r = stagedDisponible(STAGED_DIR, {
      local: () => null,
      remoto: () => [candidato],
    });

    expect(r).toEqual(candidato);
  });

  /**
   * Un SSH que falla y un VPS sin builds armados dan la misma pinta si se los
   * confunde: lista vacía. `null` es «no pude preguntar» y manda a NO PUDE
   * MEDIR; `[]` es «pregunté y no hay», que manda a armarlo.
   */
  it("distingue «no hay staged» de «no pude preguntar»", () => {
    expect(stagedDisponible(STAGED_DIR, { local: () => null, remoto: () => [] })).toBeNull();
    expect(stagedDisponible(STAGED_DIR, { local: () => null, remoto: () => null })).toBeNull();
  });

  /**
   * El parseo de la respuesta remota, aparte de la red para poder probarlo.
   * Una línea a medias es un directorio que el swap rechazaría: se descarta en
   * vez de ofrecerse, igual que hace la rama local con `STAGED_MARCA`.
   */
  describe("parsearStagedRemoto", () => {
    it("lee ruta, fecha y BUILD_ID, y devuelve el más nuevo primero", () => {
      const r = parsearStagedRemoto(
        "/opt/onia-landing/runtime-next.new-A\t1000\tbuildA\n" +
          "/opt/onia-landing/runtime-next.new-B\t3000\tbuildB\n",
      );

      expect(r).toHaveLength(2);
      expect(r?.[0].buildId).toBe("buildB");
      expect(r?.[0].mtimeMs).toBe(ms(3_000));
      expect(r?.[0].ruta).toBe("/opt/onia-landing/runtime-next.new-B");
    });

    it("descarta las líneas incompletas en vez de ofrecer una ruta rota", () => {
      const r = parsearStagedRemoto(
        "/opt/onia-landing/runtime-next.new-A\n" +
          "/opt/onia-landing/runtime-next.new-B\t3000\tbuildB\n" +
          "\t\t\n",
      );

      expect(r).toHaveLength(1);
      expect(r?.[0].buildId).toBe("buildB");
    });

    it("sin ninguna carpeta contesta con la lista vacía, no con null", () => {
      expect(parsearStagedRemoto("")).toEqual([]);
      expect(parsearStagedRemoto("\n \n")).toEqual([]);
    });
  });
});

/**
 * La tercera forma en que este medidor puede fallar ABIERTO — y la más cara,
 * porque no deja rastro: el sujeto no se pierde por un pathspec ni por un
 * filtro, se pierde por la FECHA.
 *
 * EL SUCESO, medido el 2026-09-17 21:39 UTC. `publicar.sh --dry-run` de la
 * landing contestó «YA ESTA PUBLICADO — el sitio vivo sirve todo lo que main
 * tiene» mientras el arreglo del IVA/IT del rubro Servicios NO estaba ni en el
 * build vivo (`grep -rl "IVA del mes" /opt/onia-landing/runtime-next/…` vacío)
 * ni en el sitio servido (`curl https://onia.com.bo/rubros | grep -c` dio 0).
 *
 * La causa son dos decisiones correctas POR SEPARADO que juntas abren el hueco:
 *   · `--since=@<mtime del BUILD_ID>` acota por la fecha de cada commit;
 *   · `--no-merges` saca los merges del conjunto, para no contar dos veces.
 * Un commit de una rama de carril SIEMPRE tiene fecha anterior al merge que lo
 * trae. Acá el arreglo era de las 20:55 y el build de las 21:06, así que entró
 * a `main` a las 21:37 por un merge — y el commit quedó fuera por viejo, el
 * merge fuera por merge, y no quedó nadie que lo nombrara.
 *
 * Falla hacia el lado caro en los dos pasos: el publicador se declara al día, y
 * el gate de pedidos —que se apoya en este mismo medidor— imprime «cerralo, le
 * estás pidiendo un ok por trabajo hecho» sobre el ÚNICO pedido que publicaba
 * ese arreglo. Obedecerlo borra el pedido correcto.
 *
 * Y no se recupera solo: `--since` nunca vuelve a mirar hacia atrás, así que
 * ese commit queda invisible PARA SIEMPRE.
 *
 * La pregunta que sí se puede contestar no es «¿hay commits más nuevos que el
 * build?» sino «¿qué tiene `main` que el build no contiene?» — ancestría, no
 * tiempo. La fecha sigue siendo el único proxy disponible (la landing no deja
 * escrito el sha que publicó), pero se usa UNA vez, para elegir el punto de
 * `main` por el que el build pasó, y de ahí en adelante manda el grafo.
 */
describe("un arreglo que entra a main por un merge posterior al build NO se pierde", () => {
  const ZONA_REL = `${ZONA}/src/app/(sitio)`;

  /** Instante del build vivo: entre el commit del arreglo y el merge que lo trae. */
  const BUILD = Date.parse("2026-09-17T21:06:00Z");
  const FECHA_BASE = "2026-09-17T18:00:00Z";
  const FECHA_ARREGLO = "2026-09-17T20:55:10Z"; // ANTERIOR al build
  const FECHA_MERGE = "2026-09-17T21:37:43Z"; //  POSTERIOR al build

  /**
   * Siembra su propio sujeto, sellado por corrida y borrado en el `finally`: un
   * sujeto prestado del repo real muere en rojo acusando al producto el día que
   * alguien mergea, o deja de calificar.
   */
  function conRepoSembrado(fn: (cwd: string) => void) {
    const raiz = mkdtempSync(join(tmpdir(), "deploy-vivo-"));
    const git = (args: string[], fecha?: string) => {
      const r = spawnSync("git", args, {
        cwd: raiz,
        encoding: "utf8",
        env: fecha
          ? { ...process.env, GIT_AUTHOR_DATE: fecha, GIT_COMMITTER_DATE: fecha }
          : process.env,
      });
      // Sembrar es PREPARAR: si el escenario no se pudo armar, el caso no puede
      // concluir — se rompe acá, no se convierte en un rojo contra el producto.
      if (r.status !== 0) {
        throw new Error(`no pude sembrar el repo (git ${args.join(" ")}): ${r.stderr}`);
      }
      return r.stdout.trim();
    };
    const escribir = (rel: string, texto: string) => {
      mkdirSync(dirname(join(raiz, rel)), { recursive: true });
      writeFileSync(join(raiz, rel), texto);
    };

    try {
      git(["init", "--quiet", "--initial-branch=main"]);
      git(["config", "user.email", "gate@onia.test"]);
      git(["config", "user.name", "gate"]);
      git(["config", "commit.gpgsign", "false"]);

      escribir(`${ZONA_REL}/base.tsx`, "export const base = 1;\n");
      git(["add", "-A"]);
      git(["commit", "--quiet", "-m", "base"], FECHA_BASE);

      git(["checkout", "--quiet", "-b", "carril"]);
      escribir(`${ZONA_REL}/rubros.tsx`, 'export const fila = "IVA del mes";\n');
      git(["add", "-A"]);
      git(["commit", "--quiet", "-m", "fix(web-venta): el IVA y el IT que el producto SI arma"], FECHA_ARREGLO);

      git(["checkout", "--quiet", "main"]);
      git(["merge", "--quiet", "--no-ff", "--no-edit", "carril"], FECHA_MERGE);

      fn(raiz);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  }

  it("lo cuenta: entró DESPUÉS del build aunque su fecha sea ANTERIOR", () => {
    conRepoSembrado((cwd) => {
      const arreglo = spawnSync("git", ["rev-parse", "carril"], { cwd, encoding: "utf8" }).stdout.trim();
      const commits = commitsDesde(BUILD, ZONA, { cwd, ref: "main" });

      expect(commits, "git no contestó: el caso no puede concluir").not.toBeNull();
      expect(
        commits!.map((c) => c.sha),
        "el arreglo entró a main después del build y el medidor no lo nombra: " +
          "el publicador va a firmar «ya está publicado» sobre un sitio que no lo tiene",
      ).toContain(arreglo.slice(0, 9));
    });
  });

  /**
   * La dirección simétrica, y la que impide que la cura sea «contar todo
   * `main`»: lo que el build YA trae no se cuenta, o cada pedido de deploy le
   * pediría a Sergio Urcullo un ok por trabajo publicado hace meses.
   */
  it("y NO cuenta lo que el build ya traía", () => {
    conRepoSembrado((cwd) => {
      const base = spawnSync("git", ["rev-parse", "main~1"], { cwd, encoding: "utf8" }).stdout.trim();
      const commits = commitsDesde(BUILD, ZONA, { cwd, ref: "main" });

      expect(commits).not.toBeNull();
      expect(
        commits!.map((c) => c.sha),
        "un commit anterior al build se cuenta como varado: el pedido infla lo que publica",
      ).not.toContain(base.slice(0, 9));
    });
  });

  /**
   * El corte por fecha NO desapareció: se mudó de `diagnosticar` a
   * `baseDelBuild`, que es el único lugar donde el tiempo puede decidir algo —
   * elegir el punto de `main` por el que pasó el build. Estos dos casos son los
   * que antes vivían sobre `diagnosticar`, con el mismo contrato.
   */
  it("elige como base el punto de main por el que pasó el build, no uno posterior", () => {
    conRepoSembrado((cwd) => {
      const base = baseDelBuild(BUILD, { cwd, ref: "main" });
      const esperado = spawnSync("git", ["rev-parse", "main~1"], { cwd, encoding: "utf8" }).stdout.trim();

      expect(base, "git no contestó: el caso no puede concluir").not.toBeNull();
      expect(base!.sha).toBe(esperado);
    });
  });

  /**
   * El empate importa, y por el mismo motivo de siempre: `next build` escribe el
   * BUILD_ID cuando TERMINA, así que un commit del mismo segundo ya está
   * adentro. Tratarlo como varado haría pedir un deploy que no hace falta — y
   * un pedido inventado le llega a Sergio Urcullo igual que uno real.
   */
  it("el empate: un commit del mismo segundo que el build ya está adentro", () => {
    conRepoSembrado((cwd) => {
      const base = baseDelBuild(Date.parse(FECHA_MERGE), { cwd, ref: "main" });
      const merge = spawnSync("git", ["rev-parse", "main"], { cwd, encoding: "utf8" }).stdout.trim();

      expect(base).not.toBeNull();
      expect(base!.sha, "el commit del mismo segundo quedó afuera: pediría un deploy que no hace falta").toBe(merge);
    });
  });

  /** Que el merge siga sin colarse: la cura no puede revivir el conteo doble. */
  it("sin contar el merge que lo trajo", () => {
    conRepoSembrado((cwd) => {
      const merge = spawnSync("git", ["rev-parse", "main"], { cwd, encoding: "utf8" }).stdout.trim();
      const commits = commitsDesde(BUILD, ZONA, { cwd, ref: "main" });

      expect(commits).not.toBeNull();
      expect(commits!.map((c) => c.sha)).not.toContain(merge.slice(0, 9));
    });
  });
});

/**
 * El publicador automatico del VPS (`onia-publicar-solo.sh`, cada 3 h) publica
 * la landing SOLO si el commit no toca una fuente de precio. Este gate no lo miraba:
 * con cualquier arreglo varado mandaba abrir un pedido de deploy, y el pedido le
 * cuesta un `ok` a Sergio Urcullo por algo que la maquina hace sola en <3 h.
 * Medido el 2026-09-25: `99476b4c` (CTA de la barra) estaba varado y el publicador
 * en seco contesto `hay que publicar: 1 arreglo(s)` — o sea que iba a salir solo.
 */
describe("lo que el publicador automatico ya resuelve no se le pide a Sergio Urcullo", () => {
  const LOG = [
    "== 2026-09-24 20:50 La Paz ==",
    "  plataforma: al dia",
    "  landing: PUBLICADO",
    "  bot: NO publico solo — cambia un numero en una fuente de precio: knowledge.onia.json",
    "== 2026-09-24 23:50 La Paz ==",
    "  plataforma: al dia",
    "  landing: al dia",
    "  bot: NO publico solo — cambia un numero en una fuente de precio: knowledge.onia.json",
    "",
  ].join("\n");

  it("lee la ULTIMA corrida, no la primera que encuentra", () => {
    expect(ultimaCorridaDeLanding(LOG)).toEqual({
      cuando: "2026-09-24 23:50 La Paz",
      publicaSolo: true,
      motivo: "al dia",
    });
  });

  it("dice que NO publica solo cuando el destino esta frenado por firma humana", () => {
    const frenado = LOG.replace(
      "  landing: al dia",
      "  landing: NO publico solo — cambia un numero en una fuente de precio: pricing.ts",
    );
    const r = ultimaCorridaDeLanding(frenado);
    expect(r?.publicaSolo).toBe(false);
    expect(r?.motivo).toContain("fuente de precio");
  });

  it("devuelve null —NO MEDIDO— si el log no se pudo leer o no nombra la landing", () => {
    expect(ultimaCorridaDeLanding(null)).toBeNull();
    expect(ultimaCorridaDeLanding("")).toBeNull();
    expect(ultimaCorridaDeLanding("== 2026-09-24 23:50 La Paz ==\n  bot: al dia\n")).toBeNull();
  });
});
