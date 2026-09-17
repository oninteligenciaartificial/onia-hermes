import type { CSSProperties } from "react";
import type { WebDirection, WebGoal, WebLayout, WebPreviewCard } from "@/content/web-configurator";
import styles from "./website-preview.module.css";

type Props = {
  direction: WebDirection;
  layout: WebLayout;
  goal: WebGoal;
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

function Action({ goal }: { goal: WebGoal }) {
  return <span className={styles.action}>{goal.cta} <span aria-hidden="true">↗</span></span>;
}

function Intro({ content, goal, compact = false }: { content: WebsitePreviewContent; goal: WebGoal; compact?: boolean }) {
  return (
    <div className={`${styles.intro} ${compact ? styles.introCompact : ""}`}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <h3>{content.headline}</h3>
      <p className={styles.lead}>{content.description}</p>
      <Action goal={goal} />
    </div>
  );
}

function Links({ cards, numbered = false }: { cards: readonly WebPreviewCard[]; numbered?: boolean }) {
  return (
    <div className={`${styles.links} ${numbered ? styles.linksNumbered : ""}`}>
      {cards.map((card, index) => (
        <div key={card.title} className={styles.linkItem}>
          <span className={styles.linkIndex}>{numbered ? String(index + 1).padStart(2, "0") : card.eyebrow}</span>
          <strong>{card.title}</strong>
          <small>{card.detail}</small>
          <span className={styles.linkArrow} aria-hidden="true">↗</span>
        </div>
      ))}
    </div>
  );
}

export function WebsitePreview({ direction, layout, goal, previewStyle, content }: Props) {
  return (
    <article
      className={styles.site}
      data-layout={layout.id}
      style={previewStyle}
      aria-label={`Vista previa de ${content.brand}: estructura ${layout.nombre}, estilo ${direction.nombre}`}
    >
      <div className={styles.nav} aria-hidden="true">
        <span className={styles.brand}>{content.brand}<span>.</span></span>
        <span className={styles.navLinks}>Inicio <span>Servicios</span> Nosotros <span>Contacto</span></span>
        <span className={styles.navAction}>Hablemos ↗</span>
      </div>

      {layout.id === "centrada" && (
        <>
          <section className={styles.centeredHero}><Intro content={content} goal={goal} /></section>
          <Media direction={direction} className={styles.panorama} />
          <section className={styles.section}><div className={styles.sectionHeading}><span>Lo que hacemos</span><strong>Una solución para cada paso.</strong></div><Links cards={content.cards} /></section>
        </>
      )}

      {layout.id === "portada" && (
        <>
          <section className={styles.cover}><Media direction={direction} className={styles.coverMedia} /><span className={styles.coverOverline}>{content.eyebrow}</span><h3>{content.headline}</h3></section>
          <section className={styles.editorialIntro}><p className={styles.eyebrow}>{content.eyebrow}</p><div><p>{content.description}</p><Action goal={goal} /></div></section>
          <section className={styles.section}><div className={styles.sectionHeading}><span>La selección</span><strong>Historias que merecen espacio.</strong></div><Links cards={content.cards} numbered /></section>
        </>
      )}

      {layout.id === "corporativa" && (
        <>
          <section className={styles.corporateHero}><Intro content={content} goal={goal} /><Media direction={direction} className={styles.corporateMedia} /></section>
          <div className={styles.trustBar}><span>Claridad en cada etapa</span><span>Soluciones a medida</span><span>Contacto directo</span></div>
          <section className={styles.section}><div className={styles.sectionHeading}><span>Áreas de trabajo</span><strong>Cómo podemos ayudarte.</strong></div><Links cards={content.cards} numbered /></section>
        </>
      )}

      {layout.id === "tipografica" && (
        <>
          <section className={styles.typeHero}><span className={styles.typeTag}>Una propuesta con carácter</span><Intro content={content} goal={goal} compact /></section>
          <Media direction={direction} className={styles.typeMedia} />
          <section className={styles.section}><div className={styles.sectionHeading}><span>Lo que sigue</span><strong>Pasemos de la idea a la acción.</strong></div><Links cards={content.cards} /></section>
        </>
      )}

      {layout.id === "humana" && (
        <>
          <section className={styles.humanHero}><Media direction={direction} className={styles.humanMedia} /><Intro content={content} goal={goal} /></section>
          <section className={styles.humanWelcome}><span>Qué gusto verte por aquí</span><p>Empezá por lo que necesitás. Nosotros te ayudamos con el resto.</p></section>
          <section className={styles.section}><Links cards={content.cards} /></section>
        </>
      )}

      {layout.id === "vitrina" && (
        <>
          <section className={styles.shopIntro}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h3>{content.headline}</h3></div><p>{content.description}</p></section>
          <div className={styles.categories}><span>Todas las opciones</span><span>Más elegidas</span><span>Novedades</span></div>
          <section className={styles.shopGrid}>
            {content.cards.map((card, index) => (
              <div key={card.title} className={styles.shopCard}>
                {index === 0 ? <Media direction={direction} className={styles.shopMedia} /> : <div className={`${styles.shopColor} ${index === 2 ? styles.shopColorAlternate : ""}`}><span>{String(index + 1).padStart(2, "0")}</span></div>}
                <div className={styles.shopCardCopy}><small>{card.eyebrow}</small><strong>{card.title}</strong><span>{card.detail} ↗</span></div>
              </div>
            ))}
          </section>
          <div className={styles.shopFooter}><Action goal={goal} /></div>
        </>
      )}
      <footer className={styles.footer}><span>Una vista de ejemplo · tu contenido será único</span><span>Diseñada con intención.</span></footer>
    </article>
  );
}
