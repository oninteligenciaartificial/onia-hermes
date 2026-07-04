import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// Static output by default: every page is prerendered to HTML. Only components
// marked with a `client:*` directive ship JS and hydrate in the browser. That is
// the whole point of the PoC — the dashboard shell is static, one chart is live.
export default defineConfig({
  integrations: [react(), tailwind()],
});
