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
  configGdsTest: () => configGdsTest
});
var assert = __toModule(require("assert"));
var fs = __toModule(require("fs"));
var path = __toModule(require("path"));
var import_postcss = __toModule(require("postcss"));
var import_processFile = __toModule(require("../src/processFile"));
var import_postcss_import = __toModule(require("postcss-import"));
const file = "gds-bootstrap.css";
const directory = path.join(process.cwd(), "build/_tests/");
const output = path.join(process.cwd(), "build/_tests/gds-bootstrap-styles.ts");
const configGdsTest = async (test) => {
  const customPlugins = [(0, import_postcss_import.default)({root: directory})];
  test("create gds-bootstrap standard file for react", async () => {
    await (0, import_postcss.default)(customPlugins).process(fs.readFileSync(directory + file), {
      from: directory
    }).then((0, import_processFile.GetResultProcessor)({
      input: file,
      inputPath: directory,
      output,
      templatePath: path.join(process.cwd(), "build/main/templates/react.js"),
      customPlugins: [],
      overwrite: true
    })).catch((err) => {
      if (err) {
        console.error("Couldn't process file: " + file, err);
        return;
      }
    });
    console.log("entering read and verify step");
    const expectedOutput = fs.readFileSync(path.join(process.cwd(), "build/_tests/gds-bootstrap.txt"));
    const result = fs.readFileSync(output);
    assert.strictEqual(result.equals(expectedOutput), true);
  });
};
//# sourceMappingURL=gds-bootstrap.spec.js.map
