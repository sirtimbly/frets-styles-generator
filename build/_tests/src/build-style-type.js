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
const walk = require("walk");
const normalize = require("normalize-path");
const [opts] = import_estrella.cliopts.parse(["input", "Input File or Directory", "<input>"], [
  "o, overwrite",
  "overwrite the css files that are parsed with the PostCSS processed result"
], [
  "template",
  "specify a custom template file [path to a js module]",
  "<template>"
], ["react", "use the react template by default"], ["watchmode", "watch for changes in the found css files"], [
  "purge",
  `Allow purgecss in your custom postcss.config.js to purge the output files. (Default is to skip purgecss plugin if it's in your project postcss.config)`
]);
console.log("Parsing arguments...");
console.log("options: ", JSON.stringify(opts));
const inputPath = normalize(opts.input || "./src");
let cliTemplatePath = __dirname + "/templates/maquette.js";
if (opts.react) {
  cliTemplatePath = __dirname + "/templates/react.js";
}
if (opts.template) {
  cliTemplatePath = normalize(process.cwd() + "/" + opts.template);
}
console.log("Using Template", cliTemplatePath);
console.log("watch?", opts.watchmode);
const watchMode = opts.watchmode;
let customPlugins = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";
if (!fs.existsSync(postCssConfigPath)) {
  postCssConfigPath = __dirname + "/postcss.config.js";
}
if (!fs.existsSync(postCssConfigPath)) {
  console.error(`postcss.config.js file is missing in root directory`);
  process.exit(1);
}
customPlugins = [
  importer({root: inputPath}),
  ...require(postCssConfigPath).plugins
];
const removeThesePlugins = ["postcss-import"];
if (!opts.purge) {
  removeThesePlugins.push("postcss-plugin-purgecss");
}
customPlugins = customPlugins.filter((p) => {
  if (p && p.postcssPlugin && removeThesePlugins.includes(p.postcssPlugin)) {
    console.log("skipping plugin: ", p.postcssPlugin);
    return false;
  }
  return true;
});
if (!fs.statSync(inputPath).isDirectory()) {
  console.log("Read File", inputPath);
  const root = (0, import_estrella.dirname)(inputPath);
  (0, import_processFile.default)({
    input: inputPath,
    output: root + `/${(0, import_estrella.basename)(inputPath, ".css")}-styles.ts`,
    templatePath: cliTemplatePath,
    customPlugins,
    inputPath,
    watchMode,
    overwrite: opts.overwrite
  });
} else {
  console.log("reading directory " + inputPath);
  const walker = walk.walk(inputPath, {
    filters: ["node_modules"]
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
          overwrite: opts.overwrite
        });
      }
    }
    next();
  });
}
//# sourceMappingURL=build-style-type.js.map
