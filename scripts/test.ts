#!/usr/bin/env node
import { BuildConfig } from "estrella";
import { build, glob, cliopts } from "estrella";
import { spawn } from "child_process";
import Rimraf from "rimraf";
import * as cpx from "cpx";
const testOutputDir = "build/_tests/";

/*
 * Builds all src and test files then executes the tests whenever it finishes.
 * Watch mode is supported with -watch.
 */
!(async function () {
  await Rimraf.sync(testOutputDir + "*");
  cpx.copySync("tests/*.?(css|txt)", testOutputDir);
  const files = glob("src/**/*.ts*").concat(glob("tests/**/*.ts"));
  // console.log('files', files)
  // the es-build options we will apply to your typescript
  const buildOpts: BuildConfig = {
    entry: files,
    outdir: testOutputDir,
    outbase: "./",
    format: "cjs",
    bundle: false,
    debug: true,
    sourcemap: true,
    incremental: true,
    minify: false,
    tslint: "on",
    onEnd: startTests,
  };
  await build(buildOpts);
})();

/**
 * Spawns a node process to run the tests
 */
async function startTests() {
  console.log("🎸 Built Source Code");
  const time = new Date().getTime();
  const nodeTest = spawn(`${process.execPath}`, [`build/_tests/tests/test.js`]);

  nodeTest.stdout.on("data", (data) => {
    console.log(`[TEST]: ${data}`);
  });

  nodeTest.stderr.on("data", (data) => {
    console.error(`[TEST ERROR]: ${data}`);
  });

  nodeTest.on("close", () => {
    console.log(`🎸 Test run finished in ${new Date().getTime() - time}ms`);
    if (!cliopts.watch) {
      process.exit();
    }
  });
}
