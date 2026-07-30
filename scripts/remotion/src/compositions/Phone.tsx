// Phone — mockup de celular con contenido que se desliza.
//
// Reemplazo animado de `make-mockup.mjs --template phone`. El teléfono entra
// desde abajo (translateY + fade, ease-out-expo). La captura de pantalla hace
// un drift vertical LENTO y continuo durante todo el clip (como un feed que
// scrollea solo) — la diferencia real contra el PNG estático. Marco con
// overflow:hidden fijo (no anima layout, solo el transform del contenido).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { tokens, u, FONT_STACK, ThemeMode } from "../lib/tokens";
import { useEnterExit } from "../lib/motion";

export interface PhoneProps {
  // Índice requerido por <Composition>: sin schema Zod, Remotion pide que las
  // props satisfagan Record<string, unknown>.
  [key: string]: unknown;
  title?: string;
  subtitle?: string;
  image?: string;
  accent?: string;
  theme?: ThemeMode;
  width?: number;
  height?: number;
  durationInSeconds?: number;
  fps?: number;
}

export const phoneDefaultProps: Required<PhoneProps> = {
  title: "Reservá tu cita",
  subtitle: "en 2 toques",
  image: "",
  accent: "#FF7A00",
  theme: "dark",
  width: 640,
  height: 1200,
  durationInSeconds: 3.2,
  fps: 30,
};

export const Phone: React.FC<PhoneProps> = (props) => {
  const {
    title = phoneDefaultProps.title,
    subtitle = phoneDefaultProps.subtitle,
    image,
    accent = phoneDefaultProps.accent,
    theme = phoneDefaultProps.theme,
  } = props;
  const { width, durationInFrames } = useVideoConfig();
  const t = tokens(accent, theme);
  const frame = useCurrentFrame();

  const frameMotion = useEnterExit({ enterMs: 300 });

  // Drift continuo de la captura, de punta a punta del clip: no es un loop
  // (es una función directa de frame, sin wrap), simplemente una deriva lenta
  // hacia arriba que se detiene un poco antes de terminar para no cortar feo.
  const driftEnd = Math.max(1, durationInFrames - 6);
  const drift = interpolate(frame, [0, driftEnd], [0, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stagePad = u(width, 40);
  const phoneTranslate = frameMotion.offset * u(width, 34);
  const screenH = props.height ? props.height - u(width, 200) : u(width, 1300);

  return (
    <AbsoluteFill style={{ padding: stagePad, fontFamily: FONT_STACK, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: width - stagePad * 2,
          padding: u(width, 26),
          borderRadius: u(width, 112),
          background: "linear-gradient(150deg, #2A2E37 0%, #0B0D12 46%, #23262E 100%)",
          opacity: frameMotion.opacity,
          transform: `translateY(${phoneTranslate}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -u(width, 5),
            top: u(width, 300),
            height: u(width, 190),
            width: u(width, 9),
            borderRadius: 999,
            background: "linear-gradient(180deg,#3A3F4A,#15181F)",
          }}
        />
        <div
          style={{
            position: "relative",
            borderRadius: u(width, 90),
            overflow: "hidden",
            background: t.ink,
            border: "1px solid rgba(0,0,0,0.6)",
            height: screenH,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: u(width, 26),
              transform: "translateX(-50%)",
              width: u(width, 300),
              height: u(width, 76),
              borderRadius: 999,
              background: "#05070A",
              zIndex: 2,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          />
          {image ? (
            <img
              src={image}
              alt=""
              style={{
                display: "block",
                width: "100%",
                height: `calc(100% + ${u(width, 96)}px)`,
                objectFit: "cover",
                transform: `translateY(${drift}%)`,
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: u(width, 14),
                padding: `${u(width, 74)}px ${u(width, 56)}px ${u(width, 96)}px`,
                background: `radial-gradient(130% 62% at 50% 100%, color-mix(in oklab, ${t.accent} 26%, transparent), transparent 66%)`,
              }}
            >
              <h1 style={{ fontSize: u(width, 72), fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.04, color: t.text, margin: 0 }}>{title}</h1>
              <p style={{ fontSize: u(width, 34), color: t.muted, fontWeight: 500, margin: 0 }}>{subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
