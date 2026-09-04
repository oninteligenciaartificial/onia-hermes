import { renderLandingBody, renderLandingCss } from "@onia/templates";
import demoClientJson from "../../../../../data/clients/demo.json";
import { clientSchema } from "../../../../../data/schema";

const demoClient = clientSchema.parse(demoClientJson);

export default function FactoryPreviewPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: renderLandingCss(demoClient) }} />
      <div dangerouslySetInnerHTML={{ __html: renderLandingBody(demoClient) }} />
    </>
  );
}
