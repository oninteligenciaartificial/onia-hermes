import React from "react";
import { Composition } from "remotion";
import { ProductSell, type VideoSpec } from "./templates/ProductSell";
import isdinSpec from "./data/nuvia-isdin-fusion-water-spf50-001.json";

// One template -> N videos: every video is the same <ProductSell> composition
// fed a different spec via inputProps. render.mjs sanitizes missing assets to
// null before rendering so the pipeline runs even before shots/voice exist.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProductSell"
      component={ProductSell}
      defaultProps={{ spec: isdinSpec as VideoSpec }}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={660}
      calculateMetadata={({ props }) => {
        const m = props.spec.meta;
        return {
          durationInFrames: m.totalDurationInFrames,
          fps: m.fps,
          width: m.width,
          height: m.height,
        };
      }}
    />
  );
};
