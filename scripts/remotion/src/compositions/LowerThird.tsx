// LowerThird — placa inferior que entra y sale.
//
// Distinta de las otras 4: el riel de acento hace un wipe izquierda→derecha
// (clip-path), y el bloque de texto entra deslizándose desde la izquierda +
// subiendo un poco (translateX + translateY + fade). A la salida el conjunto
// baja y se desvanece MÁS RÁPIDO que la entrada (spec: "entra y sale").
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { tokens, u, FONT_STACK, ThemeMode, cardShadow } from "../lib/tokens";
import { useEnterExit } from "../lib/motion";

export interface LowerThirdProps {
  // Índice requerido por <Composition>: sin schema Zod, Remotion pide que las
  // props satisfagan Record<string, unknown>.
  [key: string]: unknown;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  theme?: ThemeMode;
  width?: number;
  height?: number;
  durationInSeconds?: number;
  fps?: number;
}

export const lowerThirdDefaultProps: Required<LowerThirdProps> = {
  eyebrow: "ONIA",
  title: "Dental Gest",
  subtitle: "gestión de clínicas dentales",
  accent: "#FF7A00",
  theme: "dark",
  width: 1080,
  height: 300,
  durationInSeconds: 2.6,
  fps: 30,
};

export const LowerThird: React.FC<LowerThirdProps> = (props) => {
  const {
    eyebrow = lowerThirdDefaultProps.eyebrow,
    title,
    subtitle = lowerThirdDefaultProps.subtitle,
    accent = lowerThirdDefaultProps.accent,
    theme = lowerThirdDefaultProps.theme,
  } = props;
  const { width } = useVideoConfig();
  const t = tokens(accent, theme);

  const plate = useEnterExit({ enterMs: 300, exitMs: 200 });
  const bar = useEnterExit({ enterMs: 260, exitMs: 180 });
  const text = useEnterExit({ delayFrames: 3, enterMs: 260, exitMs: 200 });

  const stagePad = u(width, 44);
  const plateTranslate = plate.offset * u(width, 20);
  const barWipe = (1 - bar.enter) * 100;

  return (
    <AbsoluteFill style={{ padding: stagePad, fontFamily: FONT_STACK, justifyContent: "flex-end" }}>
      <div
        style={{
          position: "relative",
          width: width - stagePad * 2,
          borderRadius: u(width, 26),
          background: `linear-gradient(158deg, ${t.ink2} 0%, ${t.ink} 62%)`,
          border: `1px solid ${t.hairline}`,
          boxShadow: cardShadow(width),
          overflow: "hidden",
          opacity: plate.opacity,
          transform: `translateY(${plateTranslate}px)`,
          padding: `${u(width, 34)}px ${u(width, 44)}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: u(width, 10),
            background: `linear-gradient(180deg, ${t.accent}, ${t.accentDeep})`,
            clipPath: `inset(0 ${barWipe}% 0 0)`,
          }}
        />
        <div
          style={{
            opacity: text.opacity,
            transform: `translate(${(1 - text.enter) * -u(width, 22) + text.offset * u(width, 10)}px, ${text.offset * u(width, 8)}px)`,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: u(width, 12),
                fontSize: u(width, 22),
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: t.accent,
                marginBottom: u(width, 8),
              }}
            >
              <i style={{ width: u(width, 12), height: u(width, 12), borderRadius: 999, background: t.accent, display: "block" }} />
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: u(width, 54),
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: t.text,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: u(width, 8),
                fontSize: u(width, 27),
                fontWeight: 500,
                color: t.muted,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
