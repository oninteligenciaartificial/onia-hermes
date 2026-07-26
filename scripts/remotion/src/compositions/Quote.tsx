// Quote — texto con revelado tipográfico por palabra o por línea.
//
// Reemplazo animado de `make-mockup.mjs --template quote`. La tarjeta y la
// comilla gigante (textura, detrás del texto) entran con fade+scale. Cada
// palabra (o línea, según `revealBy`) aparece en cascada: opacity+translateY
// con ease-out-expo, arrancando `stepFrames` después de la anterior. La
// atribución entra al final, deslizándose desde la izquierda.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Card } from "../components/Card";
import { tokens, u, FONT_STACK, ThemeMode } from "../lib/tokens";
import { useEnterExit } from "../lib/motion";
import { EASE_OUT_EXPO } from "../lib/easing";
import { splitLines, splitWords } from "../lib/text";

export interface QuoteProps {
  text?: string;
  attribution?: string;
  accent?: string;
  theme?: ThemeMode;
  revealBy?: "word" | "line";
  width?: number;
  height?: number;
  durationInSeconds?: number;
  fps?: number;
}

export const quoteDefaultProps: Required<QuoteProps> = {
  text: "Tu equipo, atendiendo mientras vos dormís",
  attribution: "",
  accent: "#FF7A00",
  theme: "dark",
  revealBy: "word",
  width: 1000,
  height: 620,
  durationInSeconds: 3.4,
  fps: 30,
};

const RevealToken: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  width: number;
  durationMs?: number;
  display?: React.CSSProperties["display"];
}> = ({ children, frame, startFrame, width, durationMs = 180, display = "inline-block" }) => {
  const { fps } = useVideoConfig();
  const durationFrames = Math.max(2, Math.round((durationMs / 1000) * fps));
  const local = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    easing: EASE_OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display,
        opacity: local,
        transform: `translateY(${(1 - local) * u(width, 16)}px)`,
      }}
    >
      {children}
    </span>
  );
};

export const Quote: React.FC<QuoteProps> = (props) => {
  const {
    text = quoteDefaultProps.text,
    attribution = quoteDefaultProps.attribution,
    accent = quoteDefaultProps.accent,
    theme = quoteDefaultProps.theme,
    revealBy = quoteDefaultProps.revealBy,
  } = props;
  const { width, fps } = useVideoConfig();
  const t = tokens(accent, theme);
  const frame = useCurrentFrame();

  const card = useEnterExit({ enterMs: 260 });

  const stepFrames = Math.max(2, Math.round(fps * (revealBy === "word" ? 0.055 : 0.14)));
  const tokenStart = 4; // frames de gracia tras la entrada de la tarjeta

  let attributionDelay = tokenStart;
  const body = revealBy === "line" ? (
    (() => {
      const lines = splitLines(text);
      return lines.map((line, i) => {
        const start = tokenStart + i * stepFrames;
        attributionDelay = start + 10;
        return (
          <div key={i} style={{ display: "block" }}>
            <RevealToken frame={frame} startFrame={start} width={width}>
              {line}
            </RevealToken>
          </div>
        );
      });
    })()
  ) : (
    (() => {
      const words = splitWords(text);
      let wordIndex = 0;
      return words.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <React.Fragment key={i}>{tok}</React.Fragment>;
        const start = tokenStart + wordIndex * stepFrames;
        wordIndex += 1;
        attributionDelay = start + 8;
        return (
          <RevealToken key={i} frame={frame} startFrame={start} width={width}>
            {tok}
          </RevealToken>
        );
      });
    })()
  );

  const attribReveal = interpolate(frame, [attributionDelay, attributionDelay + 12], [0, 1], {
    easing: EASE_OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stagePad = u(width, 44);
  const cardTranslate = card.offset * u(width, 20);
  const cardScale = 1 - card.offset * 0.03;

  return (
    <AbsoluteFill style={{ padding: stagePad, fontFamily: FONT_STACK, justifyContent: "center" }}>
      <Card
        width={width}
        tokens={t}
        railProgress={card.enter}
        style={{
          opacity: card.opacity,
          transform: `translateY(${cardTranslate}px) scale(${cardScale})`,
          width: u(width, 1000),
          padding: `${u(width, 78)}px ${u(width, 80)}px ${u(width, 66)}px ${u(width, 86)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 0,
            left: u(width, 34),
            top: -u(width, 46),
            fontSize: u(width, 320),
            lineHeight: 1,
            fontWeight: 800,
            color: `color-mix(in oklab, ${t.accent} 30%, transparent)`,
            pointerEvents: "none",
          }}
        >
          &ldquo;
        </div>
        <p
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: u(width, 62),
            fontWeight: 700,
            lineHeight: 1.16,
            letterSpacing: "-0.03em",
            color: t.text,
            margin: 0,
          }}
        >
          {body}
        </p>
        {attribution ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: u(width, 18),
              marginTop: u(width, 40),
              fontSize: u(width, 29),
              fontWeight: 600,
              color: t.muted,
              letterSpacing: "-0.01em",
              opacity: attribReveal,
              transform: `translateX(${(1 - attribReveal) * -u(width, 18)}px)`,
            }}
          >
            <i style={{ width: u(width, 58), height: u(width, 4), borderRadius: 999, background: t.accent, display: "block" }} />
            {attribution}
          </div>
        ) : null}
      </Card>
    </AbsoluteFill>
  );
};
