"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Transition } from "motion/react";

type MotionShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  delay?: number;
};

const viewport = { once: true, amount: 0.18 };

function revealTransition(delay = 0): Transition {
  return { duration: 0.42, ease: "easeOut", delay };
}

function useReveal(delay = 0) {
  const shouldReduceMotion = useReducedMotion();

  return {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport,
    transition: revealTransition(delay),
  };
}

export function MotionReveal({ children, className, id, ariaLabel, delay }: MotionShellProps) {
  const reveal = useReveal(delay);

  return (
    <LazyMotion features={domAnimation}>
      <m.section id={id} className={className} aria-label={ariaLabel} {...reveal}>
        {children}
      </m.section>
    </LazyMotion>
  );
}

export function MotionArticle({ children, className, id, ariaLabel, delay }: MotionShellProps) {
  const reveal = useReveal(delay);

  return (
    <LazyMotion features={domAnimation}>
      <m.article id={id} className={className} aria-label={ariaLabel} {...reveal}>
        {children}
      </m.article>
    </LazyMotion>
  );
}
