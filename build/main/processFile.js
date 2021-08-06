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
  GetResultProcessor: () => GetResultProcessor,
  default: () => readFile
});
var fs = __toModule(require("fs"));
var import_postcss = __toModule(require("postcss"));
const camelcase = require("camel-case");
const protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf("")).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
async function readFile(opts) {
  const {customPlugins, inputPath, input} = opts;
  console.log("reading " + input);
  const dirparts = input.split("/");
  if (dirparts[dirparts.length - 1][0] === "_") {
    return;
  }
  return (0, import_postcss.default)(customPlugins).process(fs.readFileSync(input), {
    from: inputPath
  }).then(GetResultProcessor(opts)).catch((err) => {
    if (err) {
      console.error("Couldn't process file: " + input, err);
      return;
    }
  });
}
const GetResultProcessor = (opts) => {
  const {templatePath, watchMode, overwrite, debug, output, input} = opts;
  let isWatching = false;
  let usedClasses = [];
  let classProperties = [];
  const time1 = new Date().getTime();
  return (result) => {
    if (result && result.root) {
      result.root.walkRules((rule) => {
        if (rule.selector.startsWith(".") && (rule.selector.startsWith(".hover") || !rule.selector.includes(":"))) {
          const splitOnCommas = rule.selector.split(/,\s/);
          splitOnCommas.forEach((x) => {
            let dotless = x.substr(1);
            let classname = camelcase(dotless);
            if (classname.includes(".") || dotless.includes(">") || dotless.includes("+")) {
              return;
            }
            classname = classname.replace(/Hover$/, "");
            dotless = dotless.replace(/:hover$/, "");
            if (protectedGetters.indexOf(classname) >= 0) {
              classname = "_" + classname;
            }
            if (usedClasses.indexOf(classname) >= 0) {
              return;
            }
            usedClasses.push(classname);
            classProperties.push(`get ${classname}() { return this.add("${dotless}"); }`);
          });
        }
      });
      if (debug) {
        console.log(`\u{1F550} walk rules complete: ${new Date().getTime() - time1}ms`);
      }
    }
    let typeScriptClass = "";
    let templFn;
    try {
      templFn = require(templatePath).default;
      typeScriptClass = templFn(classProperties);
    } catch (error) {
      console.error("Couldnt' load or use template", error);
    }
    if (debug) {
      console.log(`\u{1F550} templating complete: ${new Date().getTime() - time1}ms`);
    }
    console.log(`writing ${classProperties.length} members into ${output}`);
    fs.writeFileSync(output, typeScriptClass);
    if (debug) {
      console.log(`\u{1F550} write file sync complete: ${new Date().getTime() - time1}ms`);
    }
    if (overwrite) {
      fs.writeFileSync(input, result.css);
    }
    if (watchMode && !isWatching) {
      isWatching = true;
      console.log("Watching for changes...");
      fs.watchFile(input, () => readFile(opts));
    }
    if (debug) {
      console.log(`\u{1F550} All Done: ${new Date().getTime() - time1}ms`);
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetResultProcessor
});
