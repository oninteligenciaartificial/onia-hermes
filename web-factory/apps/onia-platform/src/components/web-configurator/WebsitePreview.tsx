import type { CSSProperties } from "react";
import type { WebDirection, WebGoal, WebLayout, WebPreviewCard } from "@/content/web-configurator";
import type { WebStackId } from "@/content/webs";
import styles from "./website-preview.module.css";

/**
 * El preview del configurador. Tres ejes, y cada botón mueve el suyo:
 *
 *  - ALCANCE (`stack`): cuánta web hay. Landing = una pantalla sin menú;
 *    Profesional = menú, servicios, confianza, proceso, preguntas, contacto;
 *    Pro = lo anterior con dirección de arte (foto a sangre, «sobre nosotros»,
 *    galería, lugar para un testimonio, pie completo); Tienda = categorías y
 *    grilla de productos con pedido por WhatsApp; Ecommerce = tienda con
 *    carrito, pago con tarjeta, envío y el sello de la plataforma.
 *  - DIRECCIÓN (`direction`): cómo se ve. Va como `data-direction` y el CSS
 *    cambia tipografía, aire, radios, tarjetas, botones y fondos — no sólo la foto.
 *  - OBJETIVO (`goal`): el bloque de acción. Agenda para reservas, WhatsApp
 *    para contactos, formulario para cotizaciones, opciones para catálogo.
 *
 * `layout` sólo elige la composición del hero.
 *
 * Sergio Urcullo, 2026-09-17: «cuando aprieta la vibe sólo cambia las imágenes,
 * y cuando cambia el pricing debería verse una web más noob, más pro y más
 * mejor». Nada de cifras ni testimonios inventados: los lugares se muestran
 * como lugares («acá va…»).
 */
type Props = {
  direction: WebDirection;
  layout: WebLayout;
  goal: WebGoal;
  stack: WebStackId;
  previewStyle: CSSProperties;
  content: WebsitePreviewContent;
};

export interface WebsitePreviewContent {
  readonly brand: string;
  readonly eyebrow: string;
  readonly headline: string;
  readonly description: string;
  readonly cards: readonly WebPreviewCard[];
}

const PROCESO = [
  { title: "Escribinos", detail: "Contanos qué necesitás." },
  { title: "Te contestamos", detail: "Con opciones y horarios." },
  { title: "Empezamos", detail: "Sin vueltas." },
] as const;

const PREGUNTAS = [
  "¿Cómo se agenda?",
  "¿Qué formas de pago aceptan?",
  "¿Atienden fuera de horario?",
] as const;

function Media({ direction, className = "" }: { direction: WebDirection; className?: string }) {
  return (
    <div
      className={`${styles.media} ${className}`}
      role="img"
      aria-label={`Fotografía de referencia para el estilo ${direction.nombre}`}
      data-photo={direction.id}
    />
  );
}

function Action({ goal, className = "" }: { goal: WebGoal; className?: string }) {
  return <span className={`${styles.action} ${className}`}>{goal.cta} <span aria-hidden="true">↗</span></span>;
}

function Intro({ content, goal, compact = false }: { content: WebsitePreviewContent; goal: WebGoal; compact?: boolean }) {
  return (
    <div className={`${styles.intro} ${compact ? styles.introCompact : ""}`}>
      {!compact && <p className={styles.eyebrow}>{content.eyebrow}</p>}
      <h3>{content.headline}</h3>
      <p className={styles.lead}>{content.description}</p>
      <Action goal={goal} />
    </div>
  );
}

function Nav({ content, stack, goal }: { content: WebsitePreviewContent; stack: WebStackId; goal: WebGoal }) {
  const shop = stack === "tienda" || stack === "ecommerce";
  return (
    <div className={styles.nav} aria-hidden="true">
      <span className={styles.brand}>{content.brand}<span>.</span></span>
      {stack !== "landing" && (
        <span className={styles.navLinks}>
          {shop ? <>Inicio <span>Catálogo</span> Envíos <span>Contacto</span></> : <>Inicio <span>Servicios</span> Nosotros <span>Contacto</span></>}
        </span>
      )}
      <span className={styles.navRight}>
        {stack === "ecommerce" && <span className={styles.navGhost}>Ingresar</span>}
        {shop ? <span className={styles.cart}>Carrito <b>0</b></span> : <span className={styles.navAction}>{stack === "landing" ? goal.cta : "Hablemos"} ↗</span>}
      </span>
    </div>
  );
}

/** Composición del hero: la elige «Estructura». */
function Hero({ layout, direction, goal, content }: { layout: WebLayout; direction: WebDirection; goal: WebGoal; content: WebsitePreviewContent }) {
  switch (layout.id) {
    case "portada":
      return (
        <>
          <section className={styles.cover}><Media direction={direction} className={styles.coverMedia} /><span className={styles.coverOverline}>{content.eyebrow}</span><h3>{content.headline}</h3></section>
          <section className={styles.editorialIntro}><p className={styles.eyebrow}>{content.eyebrow}</p><div><p>{content.description}</p><Action goal={goal} /></div></section>
        </>
      );
    case "corporativa":
      return <section className={styles.corporateHero}><Intro content={content} goal={goal} /><Media direction={direction} className={styles.corporateMedia} /></section>;
    case "tipografica":
      return (
        <>
          <section className={styles.typeHero}><span className={styles.typeTag}>{content.eyebrow}</span><Intro content={content} goal={goal} compact /></section>
          <Media direction={direction} className={styles.typeMedia} />
        </>
      );
    case "humana":
      return <section className={styles.humanHero}><Media direction={direction} className={styles.humanMedia} /><Intro content={content} goal={goal} /></section>;
    case "vitrina":
      return <section className={styles.shopIntro}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h3>{content.headline}</h3></div><p>{content.description}</p></section>;
    default:
      return (
        <>
          <section className={styles.centeredHero}><Intro content={content} goal={goal} /></section>
          <Media direction={direction} className={styles.panorama} />
        </>
      );
  }
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return <div className={styles.sectionHeading}><span>{kicker}</span><strong>{title}</strong></div>;
}

/** Landing: tres puntos en una línea, sin tarjetas. */
function Benefits({ cards }: { cards: readonly WebPreviewCard[] }) {
  return (
    <section className={styles.benefits}>
      {cards.map((card, index) => (
        <div key={card.title} className={styles.benefit}><span>{String(index + 1).padStart(2, "0")}</span><strong>{card.title}</strong></div>
      ))}
    </section>
  );
}

function Services({ cards, direction, withMedia = false }: { cards: readonly WebPreviewCard[]; direction: WebDirection; withMedia?: boolean }) {
  return (
    <section className={styles.section}>
      <SectionHeading kicker="Servicios" title="Lo que hacemos por vos." />
      <div className={styles.cards}>
        {cards.map((card, index) => (
          <div key={card.title} className={styles.card}>
            {withMedia ? (index === 0 ? <Media direction={direction} className={styles.cardMedia} /> : <div className={styles.cardTone} />) : <span className={styles.cardIcon} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
            <strong>{card.title}</strong>
            <small>{card.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  return (
    <div className={styles.trustBar}><span>Atención con turno</span><span>Respuesta el mismo día</span><span>Pagos claros</span></div>
  );
}

function About({ direction, content }: { direction: WebDirection; content: WebsitePreviewContent }) {
  return (
    <section className={styles.about}>
      <Media direction={direction} className={styles.aboutMedia} />
      <div>
        <p className={styles.eyebrow}>Sobre {content.brand}</p>
        <h4>Quiénes somos y por qué hacemos esto.</h4>
        <p>Acá va la historia de {content.brand}: desde cuándo, quiénes atienden y qué los hace distintos. La escribimos con vos.</p>
      </div>
    </section>
  );
}

function Gallery({ direction }: { direction: WebDirection }) {
  return (
    <section className={styles.gallery} aria-label="Galería de ejemplo">
      <Media direction={direction} className={styles.galleryMain} />
      <div className={styles.galleryTone}><span>tu foto</span></div>
      <div className={`${styles.galleryTone} ${styles.galleryToneAlt}`}><span>tu foto</span></div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className={styles.testimonial}>
      <p className={styles.eyebrow}>Lo que dicen tus clientes</p>
      <blockquote>«Acá va la frase de un cliente tuyo, con su nombre. La ponemos cuando nos la mandes.»</blockquote>
    </section>
  );
}

function Process() {
  return (
    <section className={styles.section}>
      <SectionHeading kicker="Cómo funciona" title="Tres pasos, sin vueltas." />
      <ol className={styles.process}>
        {PROCESO.map((step, index) => (
          <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.title}</strong><small>{step.detail}</small></li>
        ))}
      </ol>
    </section>
  );
}

function Faq() {
  return (
    <section className={styles.section}>
      <SectionHeading kicker="Preguntas frecuentes" title="Lo que te van a preguntar." />
      <div className={styles.faq}>
        {PREGUNTAS.map((q) => <div key={q} className={styles.faqItem}><span>{q}</span><b aria-hidden="true">+</b></div>)}
      </div>
    </section>
  );
}

function Categories({ ecommerce }: { ecommerce: boolean }) {
  return (
    <div className={styles.categories}>
      <span>Todo</span><span>Más pedidos</span><span>Novedades</span>{ecommerce && <span>Suscripciones</span>}
    </div>
  );
}

function Products({ cards, direction, ecommerce }: { cards: readonly WebPreviewCard[]; direction: WebDirection; ecommerce: boolean }) {
  // Los servicios del cliente primero; el resto son lugares para sus productos, no repeticiones.
  const items = [...cards, ...Array.from({ length: Math.max(0, 6 - cards.length) }, (_, i) => ({ eyebrow: "", title: `Tu producto ${String(cards.length + i + 1).padStart(2, "0")}`, detail: "" }))].slice(0, 6);
  return (
    <section className={styles.shopGrid}>
      {items.map((card, index) => (
        <div key={`${card.title}-${index}`} className={styles.shopCard}>
          {index === 0 ? <Media direction={direction} className={styles.shopMedia} /> : <div className={`${styles.shopColor} ${index % 3 === 2 ? styles.shopColorAlternate : ""}`}><span>{String(index + 1).padStart(2, "0")}</span></div>}
          <div className={styles.shopCardCopy}>
            <strong>{card.title}</strong>
            <span className={styles.price}>Precio a confirmar</span>
            <em className={styles.buy}>{ecommerce ? "Agregar al carrito" : "Pedir por WhatsApp"}</em>
          </div>
        </div>
      ))}
    </section>
  );
}

function CheckoutBar() {
  return (
    <div className={styles.checkout}>
      <span><b>Pago con tarjeta</b>, seguro</span>
      <span><b>Envío</b> a todo el país</span>
      <span><b>Suscripciones</b> y accesos</span>
      <span className={styles.platform}>Sobre Shopify · Hotmart · Whop</span>
    </div>
  );
}

/** El bloque de acción: lo que la web tiene que lograr. */
function ActionBlock({ goal, content }: { goal: WebGoal; content: WebsitePreviewContent }) {
  if (goal.id === "reservas") {
    return (
      <section className={styles.actionBlock}>
        <div><p className={styles.eyebrow}>Agenda</p><h4>Elegí un día y una hora.</h4><p>Queda reservado al instante, con confirmación en pantalla.</p></div>
        <div className={styles.agenda} aria-hidden="true">
          <div className={styles.agendaDays}><span>Lun</span><span className={styles.on}>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span></div>
          <div className={styles.agendaSlots}><span>09:00</span><span className={styles.on}>10:30</span><span>15:00</span><span>16:30</span></div>
          <Action goal={goal} className={styles.actionWide} />
        </div>
      </section>
    );
  }
  if (goal.id === "cotizaciones") {
    return (
      <section className={styles.actionBlock}>
        <div><p className={styles.eyebrow}>Cotización</p><h4>Contanos qué necesitás.</h4><p>Te respondemos con un presupuesto claro, por escrito.</p></div>
        <div className={styles.form} aria-hidden="true">
          <span className={styles.field}>Tu nombre</span>
          <span className={styles.field}>Qué necesitás</span>
          <span className={`${styles.field} ${styles.fieldTall}`}>Cantidades, medidas, fechas</span>
          <Action goal={goal} className={styles.actionWide} />
        </div>
      </section>
    );
  }
  if (goal.id === "catalogo") {
    return (
      <section className={styles.actionBlock}>
        <div><p className={styles.eyebrow}>Catálogo</p><h4>Mirá y comparás sin apuro.</h4><p>Todo lo que ofrece {content.brand}, ordenado para elegir.</p></div>
        <div className={styles.chips} aria-hidden="true"><span>Servicios</span><span>Packs</span><span>Novedades</span><Action goal={goal} className={styles.actionWide} /></div>
      </section>
    );
  }
  return (
    <section className={styles.actionBlock}>
      <div><p className={styles.eyebrow}>Contacto</p><h4>Escribinos y te contestamos hoy.</h4><p>Un mensaje directo a WhatsApp, con tu consulta ya escrita.</p></div>
      <div className={styles.whats} aria-hidden="true">
        <span className={styles.bubble}>Hola {content.brand}, quiero más información.</span>
        <Action goal={goal} className={styles.actionWide} />
      </div>
    </section>
  );
}

function Footer({ content, stack }: { content: WebsitePreviewContent; stack: WebStackId }) {
  if (stack === "landing") {
    return <footer className={styles.footer}><span>{content.brand}</span><span>WhatsApp · Dirección</span></footer>;
  }
  if (stack === "pro" || stack === "ecommerce") {
    return (
      <footer className={styles.footerFull}>
        <div><span className={styles.brand}>{content.brand}<span>.</span></span><small>{content.eyebrow}</small></div>
        <div><b>Navegación</b><small>Inicio</small><small>{stack === "ecommerce" ? "Catálogo" : "Servicios"}</small><small>Contacto</small></div>
        <div><b>Contacto</b><small>WhatsApp</small><small>Correo</small><small>Dirección y horarios</small></div>
        <div><b>{stack === "ecommerce" ? "Compras" : "Legal"}</b><small>{stack === "ecommerce" ? "Envíos y devoluciones" : "Términos"}</small><small>{stack === "ecommerce" ? "Pagos seguros" : "Privacidad"}</small></div>
      </footer>
    );
  }
  return <footer className={styles.footer}><span>{content.brand} · WhatsApp · Correo</span><span>Dirección y horarios</span></footer>;
}

export function WebsitePreview({ direction, layout, goal, stack, previewStyle, content }: Props) {
  const shop = stack === "tienda" || stack === "ecommerce";
  return (
    <article
      className={styles.site}
      data-layout={layout.id}
      data-direction={direction.id}
      data-stack={stack}
      style={previewStyle}
      aria-label={`Vista previa de ${content.brand}: alcance ${stack}, estructura ${layout.nombre}, estilo ${direction.nombre}`}
    >
      <Nav content={content} stack={stack} goal={goal} />
      <Hero layout={layout} direction={direction} goal={goal} content={content} />

      {stack === "landing" && (
        <>
          <Benefits cards={content.cards} />
          <ActionBlock goal={goal} content={content} />
        </>
      )}

      {stack === "profesional" && (
        <>
          <Services cards={content.cards} direction={direction} />
          <Trust />
          <Process />
          <Faq />
          <ActionBlock goal={goal} content={content} />
        </>
      )}

      {stack === "pro" && (
        <>
          <Trust />
          <Services cards={content.cards} direction={direction} withMedia />
          <About direction={direction} content={content} />
          <Gallery direction={direction} />
          <Testimonial />
          <Process />
          <Faq />
          <ActionBlock goal={goal} content={content} />
        </>
      )}

      {shop && (
        <>
          <Categories ecommerce={stack === "ecommerce"} />
          <Products cards={content.cards} direction={direction} ecommerce={stack === "ecommerce"} />
          {stack === "ecommerce" && <CheckoutBar />}
          <ActionBlock goal={goal} content={content} />
        </>
      )}

      <Footer content={content} stack={stack} />
    </article>
  );
}
