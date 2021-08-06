#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
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
__markAsModule(exports);
__export(exports, {
  subdir: () => subdir
});
var import_path = __toModule(require("path"));
var import_estrella = __toModule(require("estrella"));
function subdir(name) {
  return import_path.default.join(process.cwd(), name);
}
const [opts] = import_estrella.cliopts.parse(["p, production", "Creates a production build."], ["o, outdir", "Output directory, defaults to `build/`"], ["s, sourcedir", "Output directory, defaults to `src/`"]);
const src = subdir(opts.sourcedir || "src/");
const output = subdir(opts.outdir || "build/main/");
const staticDir = subdir("static/");
const cssFilter = /\.css$/i;
const staticFilter = /\.html$/i;
const buildOpts = {
  entry: (0, import_estrella.glob)(src + "**/*.ts"),
  outdir: output,
  bundle: false,
  format: "cjs",
  platform: "node",
  ...opts.production ? {debug: false, sourcemap: false, minify: false} : {debug: true, sourcemap: true, minify: false}
};
(async () => {
  console.log("\u{1F3B8} Build the JS");
  return (0, import_estrella.build)(buildOpts);
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  subdir
});
