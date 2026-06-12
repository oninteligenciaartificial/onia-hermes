export function visionPipelineUnavailable(): never {
  throw new Error(
    "Vision reference-to-code runs from the Claude side with stitch MCP or image-to-code. See harvester/vision/README.md.",
  );
}
