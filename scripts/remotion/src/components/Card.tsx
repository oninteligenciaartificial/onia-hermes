// Tarjeta compartida por Stat y Quote: mismo lenguaje visual que la clase
// `.card` de make-mockup.mjs (degradé ink→ink2, borde hairline, filo de luz
// arriba vía mask, riel de acento a la izquierda). Puro CSS-in-JS inline —
// nada de <style> global para no chocar entre composiciones montadas juntas
// en el Studio.
import React from "react";
import type { DesignTokens } from "../lib/tokens";
import { cardShadow, u } from "../lib/tokens";

export interface CardProps {
  width: number;
  tokens: DesignTokens;
  /** Riel de acento a la izquierda. 0..1 = progreso de aparición (scaleY). */
  railProgress?: number;
  radius?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  width,
  tokens: t,
  railProgress = 1,
  radius,
  style,
  children,
}) => {
  const r = radius ?? u(width, 34);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: r,
        background: `linear-gradient(158deg, ${t.ink2} 0%, ${t.ink} 62%)`,
        border: `1px solid ${t.hairline}`,
        boxShadow: cardShadow(width),
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Regla de acento: barra CORTA al pie, alineada con el texto, que se dibuja
          de izquierda a derecha al entrar. Antes era una franja vertical de 12px en
          el borde izquierdo — patrón prohibido por las reglas de diseño de la casa
          (side-stripe border): lee a plantilla de alerta, no a pieza diseñada. Una
          regla tipográfica corta hace el mismo trabajo de acento y de entrada
          animada, pero es un recurso editorial deliberado. */}
      <div
        style={{
          position: "absolute",
          left: u(width, 84),
          bottom: u(width, 30),
          width: u(width, 132),
          height: u(width, 7),
          borderRadius: u(width, 7),
          transformOrigin: "left",
          transform: `scaleX(${railProgress})`,
          background: `linear-gradient(90deg, ${t.accent}, ${t.accentDeep})`,
        }}
      />
      {/* filo superior de luz — separa "diseñado" de "div con sombra" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          borderTop: `1px solid ${t.gloss}`,
          WebkitMaskImage: "linear-gradient(#000, transparent 42%)",
          maskImage: "linear-gradient(#000, transparent 42%)",
        }}
      />
      {children}
    </div>
  );
};
