#!/usr/bin/env node
import * as path from "path";
import { build, cliopts, BuildConfig, glob } from "estrella";

export function subdir(name: string): string {
  return path.join(process.cwd(), name);
}
// for configuring this script's command line arguments, see also
// https://github.com/rsms/estrella#your-build-script-becomes-a-cli-program
const [opts] = cliopts.parse(
  ["p, production", "Creates a production build."],
  ["o, outdir", "Output directory, defaults to `build/`"],
  ["s, sourcedir", "Output directory, defaults to `src/`"]
);

// set up all the directories we want to work in
const src = subdir(opts.sourcedir || "src/");
const output = subdir(opts.outdir || "build/main/");

// the es-build options we will apply to your typescript
const buildOpts: BuildConfig = {
  entry: glob(src + "**/*.ts"),
  outdir: output,
  bundle: false,
  format: "cjs",
  platform: "node",
  ...(opts.production
    ? { debug: false, sourcemap: false, minify: false }
    : { debug: true, sourcemap: true, minify: false }),
};

/**
 * ==========================================
 * Start running custom build steps here.
 * ==========================================
 */

/**
 * Build and Transpile Sources
 */
(async () => {
  // Run es-build on our typescript source, watch mode is built in
  console.log("🎸 Build the JS");
  return build(buildOpts);
})();
