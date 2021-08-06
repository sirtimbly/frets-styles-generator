#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
var import_estrella2 = __toModule(require("estrella"));
var import_child_process = __toModule(require("child_process"));
var import_rimraf = __toModule(require("rimraf"));
var import_cpx = __toModule(require("cpx"));
const testOutputDir = "build/_tests/";
!async function() {
  await import_rimraf.default.sync(testOutputDir + "*");
  import_cpx.default.copySync("tests/*.?(css|txt)", testOutputDir);
  const files = (0, import_estrella2.glob)("src/**/*.ts*").concat((0, import_estrella2.glob)("tests/**/*.ts"));
  const buildOpts = {
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
    onEnd: startTests
  };
  await (0, import_estrella2.build)(buildOpts);
}();
async function startTests() {
  console.log("\u{1F3B8} Built Source Code");
  const time = new Date().getTime();
  const nodeTest = (0, import_child_process.spawn)(`${process.execPath}`, [`build/_tests/tests/test.js`]);
  nodeTest.stdout.on("data", (data) => {
    console.log(`[TEST]: ${data}`);
  });
  nodeTest.stderr.on("data", (data) => {
    console.error(`[TEST ERROR]: ${data}`);
  });
  nodeTest.on("close", (code) => {
    console.log(`\u{1F3B8} Test run finished in ${new Date().getTime() - time}ms`);
    if (!import_estrella2.cliopts.watch) {
      process.exit();
    }
  });
}
