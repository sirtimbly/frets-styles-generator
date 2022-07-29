#! /usr/bin/env node
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
  customPlugins: () => customPlugins
});
var fs = __toModule(require("fs"));
var import_processFile = __toModule(require("./processFile"));
var import_estrella = __toModule(require("estrella"));
const importer = require("postcss-import");
const program = require("commander");
const walk = require("walk");
const normalize = require("normalize-path");
program.version("0.2.0").usage("inputPath [options]").option("-w, --watch", "watch the file for changes").option("-o, --overwrite", "overwrite the css files that are parsed with the PostCSS processed result", false).option("-t, --template <path>", "specify a custom template file [path to a js module]").option("-r, --react", "use the react template by default").option("-p, --purge", `Allow purgecss in your custom postcss.config.js to purge the output files.
     Default is to skip purgecss plugin if it's in your project postcss.config`, false).parse(process.argv);
const inputPath = normalize(program.args[0] || "./src");
let cliTemplatePath = __dirname + "/templates/maquette.js";
if (program.react) {
  cliTemplatePath = __dirname + "/templates/react.js";
}
if (program.template) {
  cliTemplatePath = normalize(process.cwd() + "/" + program.template);
}
console.log("Using Template", cliTemplatePath);
const watchMode = program.watch;
console.log("reading directory " + inputPath);
const walker = walk.walk(inputPath, {
  filters: ["node_modules"]
});
let customPlugins = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";
if (!fs.existsSync(postCssConfigPath)) {
  postCssConfigPath = __dirname + "/postcss.config.js";
}
customPlugins = [
  importer({root: inputPath}),
  ...require(postCssConfigPath).plugins
];
const removeThesePlugins = ["postcss-import"];
if (!program.purge) {
  removeThesePlugins.push("postcss-plugin-purgecss");
}
customPlugins = customPlugins.filter((p) => {
  if (p && p.postcssPlugin && removeThesePlugins.includes(p.postcssPlugin)) {
    console.log("skipping plugin: ", p.postcssPlugin);
    return false;
  }
  return true;
});
walker.on("file", (root, stat, next) => {
  if (!stat.isDirectory()) {
    const extension = stat.name.split(".")[1];
    if (extension === "css") {
      const inputFile = stat.name.split(".")[0];
      (0, import_processFile.default)({
        input: root + "/" + stat.name,
        output: root + `/${(0, import_estrella.basename)(inputFile, ".css")}-styles.ts`,
        templatePath: cliTemplatePath,
        customPlugins,
        inputPath,
        watchMode,
        overwrite: program.overwrite
      });
    }
  }
  next();
});
//# sourceMappingURL=build-style-type.js.map
