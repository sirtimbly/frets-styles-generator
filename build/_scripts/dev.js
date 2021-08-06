#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  subdir: () => subdir
});
var path = __toModule(require("path"));
var import_estrella = __toModule(require("estrella"));
function subdir(name) {
  return path.join(process.cwd(), name);
}
const [opts] = import_estrella.cliopts.parse(["p, production", "Creates a production build."], ["o, outdir", "Output directory, defaults to `build/`"], ["s, sourcedir", "Output directory, defaults to `src/`"]);
const src = subdir(opts.sourcedir || "src/");
const output = subdir(opts.outdir || "build/main/");
const buildOpts = __spreadValues({
  entry: (0, import_estrella.glob)(src + "**/*.ts"),
  outdir: output,
  bundle: false,
  format: "cjs",
  platform: "node"
}, opts.production ? { debug: false, sourcemap: false, minify: false } : { debug: true, sourcemap: true, minify: false });
(async () => {
  console.log("\u{1F3B8} Build the JS");
  return (0, import_estrella.build)(buildOpts);
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  subdir
});
