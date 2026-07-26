// Browser — ventana de navegador que entra con una captura adentro.
//
// Reemplazo animado de `make-mockup.mjs --template browser`. La ventana entra
// con un pop sutil (scale+fade, ease-out-expo). Los dots y la pill de URL
// aparecen en cascada (la interfaz "cobra vida"). La captura se revela con un
// wipe de abajo hacia arriba vía clip-path (NUNCA layout).
//
// `image`: ruta a un archivo (render.mjs la convierte a data URI, self-contained,
// igual que make-mockup.mjs) o ya una data URI si se llama programáticamente.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { tokens, u, FONT_STACK, ThemeMode, cardShadow } from "../lib/tokens";
import { useEnterExit } from "../lib/motion";

export interface BrowserProps {
  urlLabel?: string;
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

export const browserDefaultProps: Required<BrowserProps> = {
  urlLabel: "onia.com.bo",
  title: "Tu web, andando",
  subtitle: "hecha con ONIA",
  image: "",
  accent: "#FF7A00",
  theme: "dark",
  width: 1100,
  height: 760,
  durationInSeconds: 3.2,
  fps: 30,
};

const Lock: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
    <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.4" />
    <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
  </svg>
);

export const Browser: React.FC<BrowserProps> = (props) => {
  const {
    urlLabel = browserDefaultProps.urlLabel,
    title = browserDefaultProps.title,
    subtitle = browserDefaultProps.subtitle,
    image,
    accent = browserDefaultProps.accent,
    theme = browserDefaultProps.theme,
  } = props;
  const { width } = useVideoConfig();
  const t = tokens(accent, theme);

  const win = useEnterExit({ enterMs: 300 });
  const chrome = useEnterExit({ delayFrames: 4, enterMs: 220 });
  const dot2 = useEnterExit({ delayFrames: 6, enterMs: 200 });
  const dot3 = useEnterExit({ delayFrames: 9, enterMs: 200 });
  const reveal = useEnterExit({ delayFrames: 7, enterMs: 300, exitMs: 180 });

  const stagePad = u(width, 40);
  const winScale = 0.94 + win.enter * 0.06;
  const winTranslate = win.offset * u(width, 22);
  const revealPct = (1 - reveal.enter) * 100;

  return (
    <AbsoluteFill style={{ padding: stagePad, fontFamily: FONT_STACK }}>
      <div
        style={{
          position: "relative",
          width: u(width, 1000),
          borderRadius: u(width, 34),
          background: `linear-gradient(158deg, ${t.ink2} 0%, ${t.ink} 62%)`,
          border: `1px solid ${t.hairline}`,
          boxShadow: cardShadow(width),
          overflow: "hidden",
          opacity: win.opacity,
          transform: `translateY(${winTranslate}px) scale(${winScale})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: u(width, 20),
            padding: `${u(width, 24)}px ${u(width, 28)}px`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            borderBottom: `1px solid ${t.hairline}`,
            opacity: chrome.opacity,
          }}
        >
          <div style={{ display: "flex", gap: u(width, 12), flex: "0 0 auto" }}>
            <span style={{ width: u(width, 20), height: u(width, 20), borderRadius: 999, background: "#FF5F57", transform: `scale(${chrome.enter})` }} />
            <span style={{ width: u(width, 20), height: u(width, 20), borderRadius: 999, background: "#FEBC2E", opacity: dot2.opacity, transform: `scale(${dot2.enter})` }} />
            <span style={{ width: u(width, 20), height: u(width, 20), borderRadius: 999, background: "#28C840", opacity: dot3.opacity, transform: `scale(${dot3.enter})` }} />
          </div>
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              gap: u(width, 12),
              height: u(width, 50),
              padding: `0 ${u(width, 22)}px`,
              borderRadius: 999,
              background: "rgba(0,0,0,0.34)",
              border: `1px solid ${t.hairline}`,
              fontSize: u(width, 25),
              fontWeight: 600,
              color: t.muted,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              whiteSpace: "nowrap",
              opacity: dot3.opacity,
            }}
          >
            <Lock size={u(width, 19)} color={t.muted} />
            <b style={{ color: t.text, fontWeight: 700 }}>{urlLabel}</b>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            background: t.ink,
            height: props.height ? props.height - u(width, 130) : undefined,
            minHeight: u(width, 420),
            clipPath: `inset(${revealPct}% 0 0 0)`,
          }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                padding: `${u(width, 96)}px ${u(width, 72)}px`,
                minHeight: u(width, 420),
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: u(width, 18),
                background: `radial-gradient(120% 100% at 0% 0%, color-mix(in oklab, ${t.accent} 14%, transparent), transparent 60%)`,
              }}
            >
              <h1 style={{ fontSize: u(width, 70), fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02, color: t.text, margin: 0 }}>{title}</h1>
              <p style={{ fontSize: u(width, 31), fontWeight: 500, color: t.muted, margin: 0 }}>{subtitle}</p>
              <div style={{ display: "flex", gap: u(width, 14), marginTop: u(width, 28) }}>
                <i style={{ height: u(width, 12), width: u(width, 150), borderRadius: 999, background: t.accent, display: "block" }} />
                <i style={{ height: u(width, 12), width: u(width, 96), borderRadius: 999, background: t.hairline, display: "block" }} />
                <i style={{ height: u(width, 12), width: u(width, 58), borderRadius: 999, background: t.hairline, display: "block" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
