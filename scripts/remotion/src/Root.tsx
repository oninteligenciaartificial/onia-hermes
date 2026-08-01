// Registro de las 5 composiciones ONIA. `calculateMetadata` hace que
// width/height/fps/duración sean dinámicos por props (igual ergonomía que
// make-mockup.mjs: --width/--height/--duration en vez de recompilar), y fija
// el codec/pixelFormat/imageFormat por default para que incluso
// `npx remotion render` a mano saque WebM transparente de fábrica.
import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { Browser, browserDefaultProps, BrowserProps } from "./compositions/Browser";
import { LowerThird, lowerThirdDefaultProps, LowerThirdProps } from "./compositions/LowerThird";
import { Phone, phoneDefaultProps, PhoneProps } from "./compositions/Phone";
import { Quote, quoteDefaultProps, QuoteProps } from "./compositions/Quote";
import { Stat, statDefaultProps, StatProps } from "./compositions/Stat";

interface WithTiming {
  durationInSeconds?: number;
  fps?: number;
  width?: number;
  height?: number;
}

interface TimingDefaults {
  durationInSeconds: number;
  fps: number;
  width: number;
  height: number;
}

function metadataFor<T extends WithTiming & Record<string, unknown>>(defaults: TimingDefaults): CalculateMetadataFunction<T> {
  return ({ props }) => {
    const fps = props.fps ?? defaults.fps;
    const durationInSeconds = props.durationInSeconds ?? defaults.durationInSeconds;
    return {
      fps,
      durationInFrames: Math.max(1, Math.round(durationInSeconds * fps)),
      width: Math.round(props.width ?? defaults.width),
      height: Math.round(props.height ?? defaults.height),
      defaultVideoImageFormat: "png",
      defaultPixelFormat: "yuva420p",
      defaultCodec: "vp8",
    };
  };
}

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Stat"
        component={Stat}
        durationInFrames={90}
        fps={30}
        width={statDefaultProps.width}
        height={statDefaultProps.height}
        defaultProps={statDefaultProps}
        calculateMetadata={metadataFor<StatProps>(statDefaultProps)}
      />
      <Composition
        id="Browser"
        component={Browser}
        durationInFrames={96}
        fps={30}
        width={browserDefaultProps.width}
        height={browserDefaultProps.height}
        defaultProps={browserDefaultProps}
        calculateMetadata={metadataFor<BrowserProps>(browserDefaultProps)}
      />
      <Composition
        id="Phone"
        component={Phone}
        durationInFrames={96}
        fps={30}
        width={phoneDefaultProps.width}
        height={phoneDefaultProps.height}
        defaultProps={phoneDefaultProps}
        calculateMetadata={metadataFor<PhoneProps>(phoneDefaultProps)}
      />
      <Composition
        id="Quote"
        component={Quote}
        durationInFrames={102}
        fps={30}
        width={quoteDefaultProps.width}
        height={quoteDefaultProps.height}
        defaultProps={quoteDefaultProps}
        calculateMetadata={metadataFor<QuoteProps>(quoteDefaultProps)}
      />
      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={78}
        fps={30}
        width={lowerThirdDefaultProps.width}
        height={lowerThirdDefaultProps.height}
        defaultProps={lowerThirdDefaultProps}
        calculateMetadata={metadataFor<LowerThirdProps>(lowerThirdDefaultProps)}
      />
    </>
  );
};
