import { Config } from "@remotion/cli/config";

// Vertical short-form defaults. Heavy batch rendering moves to the VPS worker
// in phase 2; v1 renders a single video locally.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
