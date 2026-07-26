// Stat — tarjeta de dato con número que cuenta hacia arriba.
//
// Reemplazo animado de `make-mockup.mjs --template stat`. Entrada: la tarjeta
// sube y aparece (ease-out-expo), el riel de acento crece, y si --value es un
// número puro ("6", "1200"), cuenta desde 0 con deceleración. Label y sublabel
// entran en cascada un poco después (jerarquía por tiempo, no solo por escala).
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Card } from "../components/Card";
import { tokens, u, FONT_STACK, ThemeMode } from "../lib/tokens";
import { useEnterExit, useCountUp, isPureNumber, formatBolivianNumber } from "../lib/motion";

export interface StatProps {
  value: string;
  label?: string;
  eyebrow?: string;
  sublabel?: string;
  accent?: string;
  theme?: ThemeMode;
  width?: number;
  height?: number;
  durationInSeconds?: number;
  fps?: number;
}

export const statDefaultProps: Required<StatProps> = {
  value: "6",
  label: "DOCTORES",
  eyebrow: "",
  sublabel: "",
  accent: "#FF7A00",
  theme: "dark",
  width: 900,
  height: 640,
  durationInSeconds: 3,
  fps: 30,
};

export const Stat: React.FC<StatProps> = (props) => {
  const {
    value = statDefaultProps.value,
    label = statDefaultProps.label,
    eyebrow = statDefaultProps.eyebrow,
    sublabel = statDefaultProps.sublabel,
    accent = statDefaultProps.accent,
    theme = statDefaultProps.theme,
  } = props;
  const { width } = useVideoConfig();
  const t = tokens(accent, theme);

  const card = useEnterExit();
  const cascade = useEnterExit({ delayFrames: 5 });
  const halo = useEnterExit({ enterMs: 460 });

  const pureNumber = isPureNumber(value);
  const decimals = pureNumber && value.includes(".") ? value.split(".")[1].length : 0;
  const target = pureNumber ? Number(value) : 0;
  const counted = useCountUp(target, { durationMs: 640 });
  const displayValue = pureNumber
    ? formatBolivianNumber(counted, decimals)
    : value;

  // Tamaño de fuente por longitud (mismo criterio de make-mockup: encoge si el
  // valor final es largo, para que "1.200" no se desborde igual que "6").
  const n = displayValue.length;
  const fs = n <= 1 ? 268 : n <= 2 ? 240 : n <= 3 ? 208 : n <= 5 ? 176 : n <= 7 ? 146 : 112;

  const stagePad = u(width, 52);
  const cardTranslate = card.offset * u(width, 26);
  const cardScale = 1 - card.offset * 0.03;

  return (
    <AbsoluteFill style={{ padding: stagePad, fontFamily: FONT_STACK }}>
      <Card
        width={width}
        tokens={t}
        railProgress={card.enter}
        style={{
          opacity: card.opacity,
          transform: `translateY(${cardTranslate}px) scale(${cardScale})`,
          width: "max-content",
          minWidth: u(width, 560),
          maxWidth: u(width, 1000),
          padding: `${u(width, 62)}px ${u(width, 80)}px ${u(width, 58)}px ${u(width, 84)}px`,
        }}
      >
        {/* halo detrás del número: profundidad sin ensuciar */}
        <div
          style={{
            position: "absolute",
            zIndex: 0,
            right: -u(width, 90),
            top: -u(width, 120),
            width: u(width, 430),
            height: u(width, 430),
            borderRadius: 999,
            opacity: 0.55 * halo.enter,
            background: `radial-gradient(circle, color-mix(in oklab, ${t.accent} 26%, transparent), transparent 68%)`,
          }}
        />
        {eyebrow ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: u(width, 14),
              fontSize: u(width, 26),
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.muted,
              opacity: cascade.opacity,
              transform: `translateX(${cascade.offset * u(width, 14)}px)`,
            }}
          >
            <i
              style={{
                display: "block",
                width: u(width, 14),
                height: u(width, 14),
                borderRadius: 999,
                background: t.accent,
                boxShadow: `0 0 ${u(width, 22)}px ${t.accent}`,
              }}
            />
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: fs * (width / 1000),
            fontWeight: 800,
            lineHeight: 0.94,
            letterSpacing: "-0.045em",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            width: "max-content",
            marginTop: eyebrow ? u(width, 24) : 0,
            color: t.text,
          }}
        >
          {displayValue}
        </div>
        {label ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: u(width, 22),
              fontSize: u(width, 38),
              fontWeight: 800,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: t.accent,
              opacity: cascade.opacity,
              transform: `translateX(${cascade.offset * u(width, 14)}px)`,
            }}
          >
            {label}
          </div>
        ) : null}
        {sublabel ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: u(width, 12),
              fontSize: u(width, 31),
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: t.muted,
              opacity: cascade.opacity,
              transform: `translateX(${cascade.offset * u(width, 14)}px)`,
            }}
          >
            {sublabel}
          </div>
        ) : null}
      </Card>
    </AbsoluteFill>
  );
};
