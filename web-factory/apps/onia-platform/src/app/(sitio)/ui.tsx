import type { ReactNode } from "react";
import {
  NAV_HEADER,
  NAV_PRODUCTO,
  NAV_DECIDIR,
  NAV_LEGAL,
  EMPEZAR_URL,
  LOGIN_URL,
} from "./nav";
import { CTA_ALTA } from "./alta";
import { modulosEncendidosEn } from "./modulos-de-la-cuenta";
import type { PlanId } from "@/lib/pricing";
import { BarraSitio } from "./barra";
import { MobileMenu } from "./menu";
import s from "./sitio.module.css";

/**
 * Primitivas del sitio público (v3). Componentes de servidor puros — sin
 * estado ni efectos; el único cliente de este árbol es el conmutador de
 * rubros.
 */

/* ---------- PANEL DIBUJADO (el resultado, no la captura) ----------------- */

type Tone = "green" | "ink" | "paper" | "signal";

const toneClass: Record<Tone, string> = {
  green: s.shape,
  ink: `${s.shape} ${s.shapeInk}`,
  paper: `${s.shape} ${s.shapePaper}`,
  signal: `${s.shape} ${s.shapeSignal}`,
};

/**
 * Los paneles dibujados. Cada uno muestra el RESULTADO del cliente, no la
 * pantalla del sistema (Sergio, 2026-09-01, textual: "no coloques capturas
 * literales del sistema, se ve mal, coloca cosas referenciales").
 *
 * Los cinco últimos son los rubros del conmutador, y NO son el mismo panel con
 * otro título: cada uno dibuja lo que gana ESE negocio, con las palabras que el
 * sistema le pone delante — el dentista ve tratamientos con hora, la ferretería
 * ve la caja cortada por método de pago, la importadora ve qué cotización sigue
 * viva, la estética ve a la clienta que no volvió y el estudio ve el
 * IVA y el IT del mes. El vocabulario no se inventa acá: sale de
 * onia-platform/lib/onboarding/vocabulario.ts, y el resultado, de lo que este
 * mismo sitio ya publica rubro por rubro en (sitio)/rubros/page.tsx.
 */
export type PanelId =
  | "agentes"
  | "chat"
  | "cuenta"
  | "dental"
  | "comercio"
  | "importadora"
  | "estetica"
  | "servicios";

/**
 * Rótulo accesible de cada panel. Va en el CONTENEDOR con role="img": el panel
 * se anuncia como UNA imagen con su frase, y no como fragmentos sueltos de
 * interfaz ("07:10 · cerrado", "Aprobar", "Aprobar", "Aprobar"...).
 *
 * Vive acá y no en el call site a propósito: cada panel tiene UN rótulo
 * correcto, y dejarlo en la llamada era la forma segura de publicar uno vacío
 * — que es exactamente lo que pasaba con el `alt` de la captura.
 */
const panelLabel: Record<Exclude<PanelId, "cuenta">, string> = {
  agentes:
    "Pendientes de aprobación a las 07:10, con el negocio todavía cerrado: tres propuestas que los agentes dejaron escritas en su corrida de la mañana, cada una con su botón de aprobar. Nada se manda hasta que el dueño aprueba.",
  chat:
    "Conversación de WhatsApp a las 23:40: alguien pregunta si atienden el sábado y ya tiene la respuesta con el horario que el negocio publicó.",
  // El de "cuenta" NO está acá: enumera los mismos módulos que dibuja, así que
  // depende del plan igual que las pastillas. Lo arma `labelDe`, abajo — una
  // cadena fija diría "y agentes ya encendidos" a quien usa lector de pantalla
  // justo en el plan que los tiene apagados.
  dental:
    "Agenda del día de una clínica dental: cada paciente con su hora y su tratamiento, dos citas ya confirmadas y una marcada para llamar.",
  comercio:
    "Cierre de caja de una ferretería: el día cortado por método de pago — efectivo, QR, tarjeta y fiado —, cada uno con su barra.",
  importadora:
    "Cotizaciones de una importadora eléctrica: una aprobada, una enviada y una esperando respuesta.",
  estetica:
    "Tratamientos en curso de un centro de estética: dos al día y uno de una clienta que no volvió.",
  servicios:
    "Cierre de mes de un estudio profesional: el IVA y el IT del mes ya armados con lo cobrado en Onia, y el reporte del mes esperando revisión.",
};

/**
 * Los módulos del panel de cuenta se DERIVAN del plan que el panel dibuja: la
 * lista y su porqué viven en `./modulos-de-la-cuenta`.
 *
 * Acá estaban tipeados, los cinco, para cualquier plan — y uno de ellos
 * ("Agentes") el plan de entrada lo tiene apagado. Ver ese archivo.
 */

/** Lo que los agentes dejan escrito. Sin números ni nombres de cliente: un
 *  conteo inventado dentro de una interfaz creíble se lee como dato real, y no
 *  hay un solo cliente pagando todavía. La misma regla rige los cinco rubros:
 *  hay horas y estados, nunca montos ni cantidades.
 *
 *  Son TRES y no cuatro por dos razones medidas. (a) Con cuatro filas el panel
 *  desbordaba su propia caja —`overflow: hidden` y 8-10px de más entre 900 y
 *  1920—, y el aire de abajo quedaba en la mitad del de arriba: leía cargado
 *  hacia el pie. (b) La cuarta era "Responder las consultas de anoche", que es
 *  el trabajo del chatbot y se muestra dibujada en el panel de al lado, en esta
 *  misma página. Un panel que promete lo que el vecino ya prueba gasta una fila
 *  en repetirse. */
/*  Y son CORTOS: a 375 la fila deja 161px para el texto, y con el piso
 *  tipográfico nuevo "Volver a invitar a quien no vino" pedía 162 — un solo
 *  píxel de más, que en `text-overflow: ellipsis` no se come un píxel sino
 *  cuatro caracteres ("quien no vi…"). Las otras dos entraban con CERO de
 *  margen. Un rótulo de cola de aprobación se escribe corto igual. */
const PENDIENTES = [
  "Recordar citas de mañana",
  "Avisar los pagos vencidos",
  "Invitar a quien no vino",
] as const;

/** Caja del día de la ferretería. El ancho de la barra es una FORMA, no una
 *  cifra: el argumento es "tu día ya viene cortado por método de pago", y un
 *  monto escrito dentro de una interfaz creíble se lee como plata real. */
const CAJA = [
  { metodo: "Efectivo", w: "88%" },
  { metodo: "QR", w: "62%" },
  { metodo: "Tarjeta", w: "37%" },
  { metodo: "Fiado", w: "19%" },
] as const;

/**
 * `sello` es opcional a propósito: el panel de cuenta vive en /empezar, que es
 * genérica, y ahí no hay rubro que estampar todavía. Llevaba "Dental" quemado —
 * la única imagen de "tu cuenta" del sitio mostraba una cuenta dental, en una
 * página cuyo copy promete la configuración DE TU rubro, y contra la regla de
 * la casa: no se le vende sólo a clínicas. Poner un número ("6 rubros") en su
 * lugar habría sido peor: hoy conviven tres cuentas distintas de rubros.
 */
function Head({ titulo, sello }: { titulo: string; sello?: string }) {
  return (
    <div className={s.panelHead}>
      <span className={s.panelMark} />
      <span className={s.panelTitle}>{titulo}</span>
      {sello ? <span className={s.panelStamp}>{sello}</span> : null}
    </div>
  );
}

/**
 * Fila de lista: hora o marca a la izquierda, el texto en el medio y una
 * pastilla a la derecha. La pastilla VERDE es lo único que espera a la persona
 * (Aprobar, Llamar, Revisar) y la apagada es un estado ya resuelto.
 *
 * La regla muerde en las listas MIXTAS —dental, importadora, estética,
 * servicios—: ahí va exactamente una verde, porque con todas iguales el ojo no
 * sabe dónde caer. La cola de aprobación es la excepción declarada: se titula
 * "Para aprobar" y todo lo que lista está, por definición, esperando — apagar
 * una sería decir que ya se mandó, que es justo lo contrario de lo que el panel
 * promete.
 */
function Fila({
  hora,
  txt,
  pill,
  hecho,
}: {
  hora?: string;
  txt: string;
  pill: string;
  hecho?: boolean;
}) {
  return (
    <li className={s.panelRow}>
      {hora ? (
        <span className={s.panelHora}>{hora}</span>
      ) : (
        <span className={s.panelSq} />
      )}
      <span className={s.panelTxt}>{txt}</span>
      <span className={`${s.panelAct}${hecho ? ` ${s.panelActSoft}` : ""}`}>
        {pill}
      </span>
    </li>
  );
}

function PanelCuerpo({ panel, plan }: { panel: PanelId; plan?: PlanId }) {
  switch (panel) {
    case "agentes":
      return (
        <>
          {/* "Para aprobar" y no "Pendientes de aprobación": con el piso
              tipográfico nuevo el título largo pedía 155px en una cabecera de
              134px a 375, y se cortaba con ellipsis contra el sello de la hora.
              El sello se queda —"07:10 · cerrado" ES medio argumento—, así que
              el que cede es el título. Decía "03:12": los agentes corren UNA
              vez por día, a las 07:00 La Paz (cron 0 11 * * *), no de
              madrugada. Mismo largo, así que la cabecera no se mueve. */}
          <Head titulo="Para aprobar" sello="07:10 · cerrado" />
          <ul className={s.panelRows}>
            {PENDIENTES.map((q) => (
              <Fila key={q} txt={q} pill="Aprobar" />
            ))}
          </ul>
          <p className={s.panelFoot}>Nada se manda hasta que lo aprobás.</p>
        </>
      );

    case "chat":
      return (
        <>
          <Head titulo="WhatsApp del negocio" sello="23:40 · cerrado" />
          <div className={s.panelChat}>
            <div className={`${s.panelMsg} ${s.panelIn}`}>
              Hola, ¿atienden mañana sábado?
            </div>
            <div className={`${s.panelMsg} ${s.panelOut}`}>
              Sí, sábado de 9:00 a 13:00.
            </div>
            <div className={`${s.panelMsg} ${s.panelIn}`}>
              Perfecto, paso a la mañana. ¡Gracias!
            </div>
          </div>
          <p className={s.panelFoot}>Contestó con el horario que vos publicaste.</p>
        </>
      );

    case "cuenta":
      return (
        <>
          <Head titulo="Tu cuenta" />
          <div className={s.panelGrid}>
            {modulosEncendidosEn(plan).map((m) => (
              <span key={m} className={s.panelPill}>
                <span className={s.panelSq} />
                <span className={s.panelPillTxt}>{m}</span>
              </span>
            ))}
          </div>
          <p className={s.panelFoot}>Encendidos desde el primer día.</p>
        </>
      );

    /* --- los cinco rubros del conmutador --- */

    case "dental":
      return (
        <>
          <Head titulo="Hoy en la agenda" sello="Dental" />
          <ul className={s.panelRows}>
            <Fila hora="09:00" txt="Ortodoncia" pill="Confirmada" hecho />
            <Fila hora="10:30" txt="Limpieza" pill="Confirmada" hecho />
            <Fila hora="11:15" txt="Control" pill="Llamar" />
          </ul>
          <p className={s.panelFoot}>
            Cada paciente con su hora, su tratamiento y su teléfono.
          </p>
        </>
      );

    case "comercio":
      return (
        <>
          <Head titulo="Caja del día" sello="Comercio" />
          <div className={s.panelBars}>
            {CAJA.map((c) => (
              <div key={c.metodo} className={s.panelBarRow}>
                <span className={s.panelBarLbl}>{c.metodo}</span>
                <span className={s.panelBarTrack}>
                  <span className={s.panelBarFill} style={{ width: c.w }} />
                </span>
              </div>
            ))}
          </div>
          <p className={s.panelFoot}>
            La caja cuadrada, y el fiado fuera del cuaderno.
          </p>
        </>
      );

    case "importadora":
      return (
        <>
          <Head titulo="Cotizaciones" sello="Importadora" />
          <ul className={s.panelRows}>
            <Fila txt="Cables y conductores" pill="Aprobada" hecho />
            <Fila txt="Tableros eléctricos" pill="Enviada" hecho />
            <Fila txt="Luminarias LED" pill="Responder" />
          </ul>
          <p className={s.panelFoot}>Sabés qué cotización sigue viva.</p>
        </>
      );

    /* Lo que este panel dibuja SON los tratamientos del producto, y sale de
       `origin/master` de onia-platform medido el 2026-09-19 —no de otra
       pantalla de este mismo sitio—: `esteticagest-clinical` es el pack
       clínico con `navClinicaDe`, que renombra `/patients` a «Clientas» y
       `/treatments` a «Tratamientos» (`lib/platform/vertical-pack.ts`), y el
       Recall corre en ese rubro (`guardaClientesEnPatients` + `tieneAgenda`,
       `lib/onia-core/modules/agents-por-rubro.ts`) disparando por
       `recallAfterDays`: por TIEMPO SIN VOLVER. Antes decía «Paquetes en
       curso» con un contador de sesiones hechas y faltantes, y ese saldo el
       producto no lo lleva — `PatientTreatment` tiene estado, no total
       contratado.
       2026-10-01: la tercera fila decía «Control post-tratamiento · En agenda»
       y se sacó por corrección de Sergio Urcullo: el Recall dispara por tiempo
       sin volver y PROPONE a quién invitar; un control ya agendado solo no es
       lo que se demuestra acá. Quedó otro tratamiento al día. */
    case "estetica":
      return (
        <>
          <Head titulo="Tratamientos en curso" sello="Estética" />
          <ul className={s.panelRows}>
            <Fila txt="Limpieza facial" pill="Al día" hecho />
            <Fila txt="Depilación láser" pill="No volvió" />
            <Fila txt="Peeling químico" pill="Al día" hecho />
          </ul>
          <p className={s.panelFoot}>
            La clienta que dejó el tratamiento a medias no se pierde.
          </p>
        </>
      );

    /* El IVA y el IT del mes SON del producto, y el panel los nombra: medido el
       2026-09-17 contra `origin/master` de onia-platform, no contra pricing.ts.
       `lib/onia-core/modules/accounting-logic.ts` calcula débito y crédito
       fiscal al 13 %, el IT al 3 % y el vencimiento por último dígito de NIT
       (D.S. 25619); `app/(dashboard)/contabilidad/page.tsx` los pinta —
       "Resumen IVA/IT del mes", "Saldo IVA a pagar"— y su cabecera declara que
       el escalón `basic` ya trae "resumen basico de impuestos del mes +
       vencimiento por NIT", o sea desde el plan más barato. Y llega a ESTE
       rubro: `lib/platform/contabilidad-transversal.test.ts` demuestra que
       /contabilidad es segmento COMÚN, no de un pack.

       ⚠️ Entre el 2026-09-02 (4384f7e8) y hoy el panel decía "Ventas del mes ·
       Compras del mes", borrado por fabricado con este razonamiento: que la
       promesa "no aparece en lib/pricing.ts". La premisa es cierta y la
       conclusión no —pricing.ts vende el MÓDULO ("contabilidad básica de
       compras y ventas", "contabilidad completa (RCV, balance y export)") y no
       enumera las salidas—, así que no encontrar ahí la palabra IVA no prueba
       que el sistema no lo arme: hay que preguntárselo al motor. El costo fue
       de la otra dirección, la que casi nadie mira: ofrecer de MENOS. Quedaron
       quince días con la cabecera de este mismo archivo (arriba) diciendo que
       el estudio "ve el IVA y el IT del mes", /rubros, /nosotros,
       /v1/modulos/dental y lib/siat.ts prometiéndolo, y sólo este panel —el
       dibujo, lo único que el lead MIRA— callándolo.

       Que las dos superficies del mismo rubro no puedan volver a separarse lo
       vigila `(sitio)/el-panel-dibuja-lo-que-la-pagina-promete.test.ts`.

       La pastilla verde sigue siendo una sola (la regla de `Fila`): lo armado
       queda apagado y lo que espera a la persona es el reporte. */
    case "servicios":
      return (
        <>
          <Head titulo="Cierre del mes" sello="Servicios" />
          <ul className={s.panelRows}>
            <Fila txt="IVA del mes" pill="Armado" hecho />
            <Fila txt="IT del mes" pill="Armado" hecho />
            <Fila txt="Reporte del mes" pill="Revisar" />
          </ul>
          <p className={s.panelFoot}>
            Con lo que cobrás en Onia, el IVA y el IT ya armados.
          </p>
        </>
      );
  }
}

/**
 * El panel solo, sin el mat de color: lo usa el conmutador de rubros, donde el
 * mat ES la ranura del rodillo y el color lo pone el rubro.
 */
/**
 * El rótulo accesible. El del panel de cuenta se DERIVA de los módulos que ese
 * plan enciende, por el mismo motivo que las pastillas: es la misma lista dicha
 * otra vez, y una lista tipeada al lado de una derivada es como esto se rompe.
 */
function labelDe(panel: PanelId, plan?: PlanId): string {
  if (panel !== "cuenta") return panelLabel[panel];
  const modulos = modulosEncendidosEn(plan).map((m) => m.toLowerCase());
  const enumerados =
    modulos.length > 1
      ? `${modulos.slice(0, -1).join(", ")} y ${modulos.at(-1)}`
      : modulos.join("");
  return `Una cuenta recién creada, con ${enumerados} ya encendidos.`;
}

export function PanelDibujado({ panel, plan }: { panel: PanelId; plan?: PlanId }) {
  return (
    <div className={s.panel} role="img" aria-label={labelDe(panel, plan)}>
      <PanelCuerpo panel={panel} plan={plan} />
    </div>
  );
}

/**
 * Bloque de color que dibuja una interfaz INVENTADA mostrando el resultado del
 * cliente. Cero <img>, cero <svg>, cero sombra: la profundidad es la tarjeta
 * clara apoyada sobre el mat de color del tono. Mismo invariante que el hero
 * aprobado el 2026-09-01, y el `aspect-ratio` fijo del mat sigue reservando el
 * alto de la columna (cero CLS).
 *
 * `panel` es OBLIGATORIO y ya no existe una rama de imagen: la regresión
 * "volvamos a cablear la captura" no compila, que vale más que un test.
 */
export function Shape({
  panel,
  plan,
  tone = "green",
}: {
  panel: PanelId;
  plan?: PlanId;
  tone?: Tone;
}) {
  return (
    <div className={toneClass[tone]}>
      <PanelDibujado panel={panel} plan={plan} />
    </div>
  );
}

/* ---------- bloque de sección plano ------------------------------------- */

const surfaceClass: Record<Tone, string> = {
  paper: s.paper,
  ink: s.ink,
  green: s.green,
  signal: s.signalBlock,
};

export function Block({
  surface = "paper",
  children,
  id,
  labelledBy,
  className,
}: {
  surface?: Tone | "paperDim";
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  /** Ajuste puntual del ritmo de UN bloque (hoy: el aire del hero en teléfono). */
  className?: string;
}) {
  const cls = surface === "paperDim" ? s.paperDim : surfaceClass[surface as Tone];
  return (
    <section
      className={`${s.block} ${cls}${className ? ` ${className}` : ""}`}
      id={id}
      aria-labelledby={labelledBy}
    >
      <div className={s.inner}>{children}</div>
    </section>
  );
}

/* ---------- botones y kicker -------------------------------------------- */

export function Btn({
  href,
  children,
  variant = "solid",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "line";
  external?: boolean;
}) {
  const cls = variant === "line" ? `${s.btn} ${s.btnLine}` : s.btn;
  const ext = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a className={cls} href={href} {...ext}>
      {children}
    </a>
  );
}

/**
 * El rotulo chico sobre el titular, con su punto verde.
 *
 * El punto es un `<span>` de verdad y no un `::before`, por dos motivos que se
 * descubrieron juntos el 2026-09-24 mirando la portada en telefono:
 *
 *  1. Como pseudo-elemento era un ITEM FLEX hermano del texto, asi que cuando
 *     el rotulo parte en dos lineas dentro de un bloque centrado, el texto se
 *     centra DENTRO de su propia caja y el punto se queda solo contra el borde
 *     izquierdo — en la portada quedaban 44 px de vacio entre el punto y su
 *     etiqueta, en la PRIMERA pantalla que ve un lead. Siendo parte del flujo
 *     del texto, el punto viaja con la primera palabra y se centra con ella.
 *  2. Un `::before` no tiene caja consultable: `getBoundingClientRect` no lo
 *     alcanza, asi que NINGUN gate podia medir esa distancia. El defecto se
 *     arreglo dos veces en el eje vertical (ver `.kicker` en el CSS) y las dos
 *     veces lo encontro un ojo, no un gate. Con un nodo real, la distancia
 *     punto-texto la mide `scripts/mirar-primera-pantalla.mjs` en cada vuelta.
 *
 * `data-kicker-dot` es el ancla del gate: sobrevive al hash de CSS Modules,
 * que cambia con cada build y no sirve para agarrarse.
 */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className={s.kicker} data-kicker="">
      <span className={s.kickerDot} data-kicker-dot="" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ---------- datos estructurados ----------------------------------------- */

/**
 * Inyecta el JSON-LD de la página. Existía en la v1 (Organization,
 * SoftwareApplication, Service, Article, FAQPage, BreadcrumbList) y NO se
 * pierde en el rediseño: cada página trae el suyo con la ruta nueva.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------- chrome ------------------------------------------------------ */

/**
 * La barra del sitio. El markup y el estado viven en `barra.tsx` (cliente:
 * necesita saber si la pagina esta scrolleada). Aca queda el CTA, que es el
 * mismo <Btn> del resto del sitio y no necesita estado — se pasa como children
 * para no arrastrar el boton entero al bundle del cliente.
 */
export function Header() {
  return (
    <BarraSitio>
      <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
    </BarraSitio>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerBrand}>
          {/* Pie oscuro: wordmark claro + punto verde (§4-bis del manual de
              marca). Antes decia «Onia» + punto final, que no es la marca. */}
          <span className={s.wordmark}>
            <img
              className={s.logoImg}
              src="/brand/v2/onia-logo-dark.svg"
              alt="Onia"
              width={65}
              height={26}
            />
          </span>
          <p className={s.footerTag}>Sistema de gestión con IA · Bolivia</p>
        </div>

        <nav className={s.footerNav} aria-label="Producto">
          <p className={s.footerGroup}>Producto</p>
          {NAV_PRODUCTO.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className={s.footerNav} aria-label="Decidir">
          <p className={s.footerGroup}>Decidir</p>
          {NAV_DECIDIR.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={LOGIN_URL}>Entrar</a>
        </nav>
      </div>

      <div className={s.footerLegal}>
        {/* Los legales viven UNA vez, en el producto. Acá se linkean. */}
        {NAV_LEGAL.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        {/* Exhibir NIT y «EMITE FACTURA» es obligación del SIN (150 UFV). */}
        <span>Onia · NIT 5371375010 · EMITE FACTURA</span>
      </div>
    </footer>
  );
}
