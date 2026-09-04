import type { ReactNode } from "react";
import {
  NAV_HEADER,
  NAV_PRODUCTO,
  NAV_SERVICIOS,
  NAV_DECIDIR,
  NAV_LEGAL,
  EMPEZAR_URL,
  LOGIN_URL,
} from "./nav";
import { CTA_ALTA } from "./alta";
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
 * viva, la estética ve las sesiones que faltan del paquete y el estudio ve el
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
 * interfaz ("03:12 · cerrado", "Aprobar", "Aprobar", "Aprobar"...).
 *
 * Vive acá y no en el call site a propósito: cada panel tiene UN rótulo
 * correcto, y dejarlo en la llamada era la forma segura de publicar uno vacío
 * — que es exactamente lo que pasaba con el `alt` de la captura.
 */
const panelLabel: Record<PanelId, string> = {
  agentes:
    "Pendientes de aprobación a las 03:12, con el negocio cerrado: tres propuestas que los agentes dejaron escritas de madrugada, cada una con su botón de aprobar. Nada se manda hasta que el dueño aprueba.",
  chat:
    "Conversación de WhatsApp a las 23:40: alguien pregunta si atienden el sábado y ya tiene la respuesta con el horario que el negocio publicó.",
  cuenta:
    "Una cuenta recién creada, con agenda, clientes, caja, inventario, contabilidad y agentes ya encendidos.",
  dental:
    "Agenda del día de una clínica dental: cada paciente con su hora y su tratamiento, dos citas ya confirmadas y una marcada para llamar.",
  comercio:
    "Cierre de caja de una ferretería: el día cortado por método de pago — efectivo, QR, tarjeta y fiado —, cada uno con su barra.",
  importadora:
    "Cotizaciones de una importadora eléctrica: una aprobada, una enviada y una esperando respuesta.",
  estetica:
    "Paquetes en curso de un centro de estética: cada tratamiento con las sesiones ya hechas y las que faltan, y el control post-tratamiento ya puesto en la agenda.",
  servicios:
    "Cierre de mes de un estudio profesional: las ventas y las compras del mes al día, y el reporte del mes esperando revisión.",
};

/**
 * Los módulos del panel de cuenta. Son EXACTAMENTE los que nombra el copy que
 * queda al lado en /empezar ("Todo encendido: agenda, caja, inventario,
 * contabilidad y la cola de agentes") más "Clientes", que nombra la descripción
 * del sitio. Nada acá es una promesa nueva.
 *
 * ⚠️ Acá decía "Facturación", y estaba mal por dos motivos a la vez. Primero,
 * la lista no coincidía con el párrafo pegado al costado —dos listas de módulos
 * distintas, lado a lado, en la misma pantalla, sin inventario ni contabilidad
 * y con una capacidad de más—. Segundo y peor: iba bajo el remate "Encendidos
 * desde el primer día" mientras la FAQ de la home dice que la homologación
 * sigue en trámite y que por ahora se factura en el Portal Web del SIN. La
 * ilustración prometía lo que el texto del mismo sitio tiene que desmentir.
 */
const MODULOS = [
  "Agenda",
  "Clientes",
  "Caja",
  "Inventario",
  "Contabilidad",
  "Agentes",
] as const;

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

/** Sesiones del paquete: lleno lo que ya se hizo. Es un dibujo y no un "3 de
 *  6" por la misma razón por la que las barras de la caja no llevan monto. */
function Sesiones({ hechas, total }: { hechas: number; total: number }) {
  return (
    <span className={s.panelDots}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={i < hechas ? `${s.panelDot} ${s.panelDotOn}` : s.panelDot}
        />
      ))}
    </span>
  );
}

function PanelCuerpo({ panel }: { panel: PanelId }) {
  switch (panel) {
    case "agentes":
      return (
        <>
          {/* "Para aprobar" y no "Pendientes de aprobación": con el piso
              tipográfico nuevo el título largo pedía 155px en una cabecera de
              134px a 375, y se cortaba con ellipsis contra el sello de la hora.
              El sello se queda —"03:12 · cerrado" ES medio argumento—, así que
              el que cede es el título. */}
          <Head titulo="Para aprobar" sello="03:12 · cerrado" />
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
            {MODULOS.map((m) => (
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

    case "estetica":
      return (
        <>
          <Head titulo="Paquetes en curso" sello="Estética" />
          <ul className={s.panelRows}>
            <li className={s.panelRow}>
              <span className={s.panelSq} />
              <span className={s.panelTxt}>Limpieza facial</span>
              <Sesiones hechas={3} total={6} />
            </li>
            <li className={s.panelRow}>
              <span className={s.panelSq} />
              <span className={s.panelTxt}>Depilación láser</span>
              <Sesiones hechas={5} total={6} />
            </li>
            <Fila txt="Control post-tratamiento" pill="En agenda" hecho />
          </ul>
          <p className={s.panelFoot}>
            Ninguna sesión del paquete queda en el aire.
          </p>
        </>
      );

    /* ⚠️ Este panel decía "Registro de ventas · IVA del mes · IT del mes", con
       el remate "Llegás al cierre con el IVA y el IT ya armados". Ninguna de
       las dos declaraciones aparece en lib/pricing.ts: el Básico promete
       "contabilidad básica de compras y ventas" y el Pro "contabilidad completa
       (RCV, balance y export)" — el IVA y el IT son formularios que se derivan
       de eso, y no un producto que ningún plan diga entregar armado. Era una
       capacidad fabricada dentro de una interfaz creíble. Ahora dice lo que la
       fuente dice, y la única pastilla verde es la que espera a la persona. */
    case "servicios":
      return (
        <>
          <Head titulo="Cierre del mes" sello="Servicios" />
          <ul className={s.panelRows}>
            <Fila txt="Ventas del mes" pill="Al día" hecho />
            <Fila txt="Compras del mes" pill="Al día" hecho />
            <Fila txt="Reporte del mes" pill="Revisar" />
          </ul>
          <p className={s.panelFoot}>
            Llegás al cierre con las compras y las ventas ordenadas.
          </p>
        </>
      );
  }
}

/**
 * El panel solo, sin el mat de color: lo usa el conmutador de rubros, donde el
 * mat ES la ranura del rodillo y el color lo pone el rubro.
 */
export function PanelDibujado({ panel }: { panel: PanelId }) {
  return (
    <div className={s.panel} role="img" aria-label={panelLabel[panel]}>
      <PanelCuerpo panel={panel} />
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
export function Shape({ panel, tone = "green" }: { panel: PanelId; tone?: Tone }) {
  return (
    <div className={toneClass[tone]}>
      <PanelDibujado panel={panel} />
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

export function Kicker({ children }: { children: ReactNode }) {
  return <p className={s.kicker}>{children}</p>;
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

export function Header() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <a className={s.wordmark} href="/" aria-label="Onia — inicio">
          Onia<b>.</b>
        </a>
        <nav className={s.nav} aria-label="Secciones">
          {NAV_HEADER.map((item) => (
            <a key={item.href} className={s.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={s.headerCta}>
          <a className={s.headerLogin} href={LOGIN_URL}>
            Entrar
          </a>
          <Btn href={EMPEZAR_URL}>{CTA_ALTA}</Btn>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.footerBrand}>
          <span className={s.wordmark} style={{ color: "#fff" }}>
            Onia<b>.</b>
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

        <nav className={s.footerNav} aria-label="Servicios">
          <p className={s.footerGroup}>Servicios</p>
          {NAV_SERVICIOS.map((item) => (
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
      </div>
    </footer>
  );
}
