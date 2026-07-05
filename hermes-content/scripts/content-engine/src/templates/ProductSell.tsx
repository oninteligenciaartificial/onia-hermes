import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ---------- Types (data contract: one spec -> one video) ---------- */

export type Scene = {
  id: string;
  from: number;
  durationInFrames: number;
  image: string | null;
  kind: "presenter" | "product" | "cta";
  kenBurns: "in" | "out";
};

export type VideoSpec = {
  id: string;
  meta: { fps: number; width: number; height: number; totalDurationInFrames: number };
  brand: {
    name: string;
    logo: string | null;
    tagline: string;
    colors: Record<string, string>;
  };
  product: {
    name: string;
    shortName: string;
    brand: string;
    size: string;
    price: string;
    promoLabel: string;
    promoPrice: string;
    image: string | null;
    benefits: string[];
  };
  cta: { headline: string; sub: string; handle: string };
  audio: { voice: string | null; music: string | null };
  scenes: Scene[];
  subtitles: { text: string; from: number; to: number }[];
};

const FONT = "'Onest','Inter','SF Pro Display',system-ui,-apple-system,'Segoe UI',sans-serif";

/* ---------- Background: brand gradient + slow teal glow ---------- */

const Background: React.FC<{ c: Record<string, string> }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const gy = interpolate(t, [0, 1], [38, 62]);
  return (
    <AbsoluteFill style={{ backgroundColor: c.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% ${gy}%, ${c.navy} 0%, ${c.ink} 60%, #05090f 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 30% at 50% 30%, ${c.teal}33 0%, transparent 70%)`,
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Presenter / placeholder panel with Ken Burns ---------- */

const SceneView: React.FC<{ scene: Scene; product: VideoSpec["product"]; c: Record<string, string> }> = ({
  scene,
  product,
  c,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, scene.durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const zoom = scene.kenBurns === "in" ? [1.06, 1.16] : [1.16, 1.06];
  const scale = interpolate(p, [0, 1], zoom as [number, number]);
  const appear = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  if (scene.kind === "product") {
    return <ProductStage product={product} c={c} />;
  }

  if (scene.image) {
    return (
      <AbsoluteFill style={{ opacity: appear }}>
        <Img
          src={staticFile(scene.image)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
        />
        <AbsoluteFill
          style={{ background: "linear-gradient(180deg, rgba(5,9,15,0.15) 0%, rgba(5,9,15,0) 35%, rgba(5,9,15,0.75) 100%)" }}
        />
      </AbsoluteFill>
    );
  }

  // Placeholder branded panel (used until Mara shots exist).
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: appear }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(60% 40% at 50% 45%, ${c.teal}22, transparent 70%)`, transform: `scale(${scale})` }}
      />
      <div style={{ fontFamily: FONT, color: `${c.cream}88`, fontSize: 40, letterSpacing: 6, fontWeight: 600, textTransform: "uppercase" }}>
        toma: presentadora
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Product stage: real packshot + animated price ---------- */

const ProductStage: React.FC<{ product: VideoSpec["product"]; c: Record<string, string> }> = ({ product, c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 180 }, durationInFrames: 28 });
  const y = interpolate(rise, [0, 1], [80, 0]);
  const float = Math.sin(frame / 18) * 10;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 720, height: 720, borderRadius: "50%", background: `radial-gradient(circle, ${c.teal}33, transparent 65%)`, transform: `translateY(${y * 0.5}px)` }} />
      {product.image ? (
        <Img
          src={staticFile(product.image)}
          style={{ width: 620, height: 900, objectFit: "contain", transform: `translateY(${y + float}px)`, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))" }}
        />
      ) : (
        <div style={{ width: 360, height: 620, borderRadius: 40, background: `${c.cream}18`, border: `2px solid ${c.teal}66`, transform: `translateY(${y + float}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: `${c.cream}aa`, fontSize: 30 }}>
          producto
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Top brand bar ---------- */

const BrandBar: React.FC<{ brand: VideoSpec["brand"] }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c = brand.colors;
  return (
    <div style={{ position: "absolute", top: 70, left: 60, right: 60, display: "flex", alignItems: "center", gap: 18, opacity: o }}>
      {brand.logo ? (
        <Img src={staticFile(brand.logo)} style={{ height: 64, objectFit: "contain" }} />
      ) : (
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: c.cream, letterSpacing: -1 }}>
          {brand.name}
        </div>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: FONT, fontSize: 26, color: `${c.cream}cc`, fontWeight: 500, letterSpacing: 0.5 }}>
        {brand.tagline}
      </div>
    </div>
  );
};

/* ---------- Price overlay (from product scene onward) ---------- */

const PriceOverlay: React.FC<{ product: VideoSpec["product"]; showFrom: number }> = ({ product, showFrom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < showFrom) return null;
  const s = spring({ frame: frame - showFrom, fps, config: { damping: 140 }, durationInFrames: 22 });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const c = product;
  return (
    <div style={{ position: "absolute", top: 250, right: 60, transform: `scale(${scale})`, transformOrigin: "top right", opacity: s }}>
      <div style={{ background: "#FF6B6B", color: "white", fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: "14px 30px", borderRadius: 24, boxShadow: "0 18px 40px rgba(255,107,107,0.35)" }}>
        {c.price}
      </div>
      <div style={{ marginTop: 10, textAlign: "right", fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#F5B400" }}>
        {c.promoLabel} · {c.promoPrice}
      </div>
    </div>
  );
};

/* ---------- Product name + benefits chips (product scene) ---------- */

const ProductInfo: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const s = spec.scenes.find((x) => x.kind === "product");
  if (!s) return null;
  const local = frame - s.from;
  if (local < 0 || local > s.durationInFrames) return null;
  const o = interpolate(local, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c = spec.brand.colors;
  return (
    <div style={{ position: "absolute", bottom: 430, left: 60, right: 60, opacity: o, fontFamily: FONT }}>
      <div style={{ color: c.cream, fontWeight: 800, fontSize: 58, lineHeight: 1.05, letterSpacing: -1 }}>
        {spec.product.name}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
        {spec.product.benefits.map((b) => (
          <div key={b} style={{ background: `${c.teal}22`, border: `1.5px solid ${c.teal}`, color: c.cream, borderRadius: 999, padding: "10px 22px", fontSize: 28, fontWeight: 600 }}>
            {b}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- Subtitles ---------- */

const Subtitles: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const cur = spec.subtitles.find((s) => frame >= s.from && frame < s.to);
  if (!cur) return null;
  const local = frame - cur.from;
  const pop = interpolate(local, [0, 7], [0.85, 1], { extrapolateRight: "clamp" });
  const o = interpolate(local, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const c = spec.brand.colors;
  return (
    <div style={{ position: "absolute", bottom: 210, left: 70, right: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${pop})`, background: "rgba(5,9,15,0.72)", backdropFilter: "blur(6px)", borderRadius: 22, padding: "20px 34px", maxWidth: 900 }}>
        <span style={{ fontFamily: FONT, color: "white", fontWeight: 700, fontSize: 46, lineHeight: 1.18, textAlign: "center", display: "block", textShadow: "0 2px 10px rgba(0,0,0,0.5)", borderBottom: `4px solid ${c.teal}` }}>
          {cur.text}
        </span>
      </div>
    </div>
  );
};

/* ---------- CTA end card ---------- */

const CtaCard: React.FC<{ spec: VideoSpec; scene: Scene }> = ({ spec, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 160 }, durationInFrames: 24 });
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const c = spec.brand.colors;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: s }}>
      {scene.image ? (
        <>
          <Img src={staticFile(scene.image)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,9,15,0.6) 0%, rgba(5,9,15,0.35) 42%, rgba(5,9,15,0.88) 100%)" }} />
        </>
      ) : null}
      <div style={{ transform: `scale(${scale})`, textAlign: "center", fontFamily: FONT, padding: 40, position: "relative" }}>
        {spec.brand.logo ? (
          <Img src={staticFile(spec.brand.logo)} style={{ height: 110, objectFit: "contain", marginBottom: 30 }} />
        ) : (
          <div style={{ fontWeight: 800, fontSize: 96, color: c.cream, letterSpacing: -2, marginBottom: 20 }}>{spec.brand.name}</div>
        )}
        <div style={{ color: c.cream, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -1 }}>{spec.cta.headline}</div>
        <div style={{ color: `${c.cream}cc`, fontWeight: 500, fontSize: 38, marginTop: 18 }}>{spec.cta.sub}</div>
        <div style={{ display: "inline-block", marginTop: 40, background: c.coral, color: "white", fontWeight: 800, fontSize: 52, padding: "20px 44px", borderRadius: 999 }}>
          {spec.product.price} · {spec.product.promoLabel}
        </div>
        <div style={{ color: `${c.cream}99`, fontWeight: 600, fontSize: 34, marginTop: 34 }}>{spec.cta.handle}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Progress bar ---------- */

const Progress: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${w}%`, background: color }} />;
};

/* ---------- Root template ---------- */

export const ProductSell: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const c = spec.brand.colors;
  const productScene = spec.scenes.find((s) => s.kind === "product");
  const priceFrom = productScene ? productScene.from + 40 : 300;

  return (
    <AbsoluteFill>
      <Background c={c} />

      {spec.scenes.map((scene) =>
        scene.kind === "cta" ? (
          <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
            <CtaCard spec={spec} scene={scene} />
          </Sequence>
        ) : (
          <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
            <SceneView scene={scene} product={spec.product} c={c} />
          </Sequence>
        )
      )}

      <BrandBar brand={spec.brand} />
      <ProductInfo spec={spec} />
      <PriceOverlay product={spec.product} showFrom={priceFrom} />
      <Subtitles spec={spec} />
      <Progress color={c.teal} />

      {spec.audio.voice ? <Audio src={staticFile(spec.audio.voice)} /> : null}
      {spec.audio.music ? <Audio src={staticFile(spec.audio.music)} volume={0.18} /> : null}
    </AbsoluteFill>
  );
};
