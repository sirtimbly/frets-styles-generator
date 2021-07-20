import * as fs from "fs";
const importer = require("postcss-import");
import postcss, { Result, Rule } from "postcss";
const camelcase = require("camel-case");
const protectedGetters = Object.getOwnPropertyNames(
  Object.getPrototypeOf("")
).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
export default function readFile(
  input: string,
  output: string,
  opts: {
    templatePath: string;
    customPlugins: any[];
    inputPath: string;
    watchMode?: boolean;
    overwrite: boolean;
  }
) {
  const { templatePath, customPlugins, inputPath, watchMode, overwrite } = opts;
  let isWatching = false;

  let usedClasses: string[] = [];
  let classProperties: string[] = [];
  console.log("reading " + input);
  const dirparts = input.split("/");
  if (dirparts[dirparts.length - 1][0] === "_") {
    return; // don't process files tht start with and underscore
  }
  fs.readFile(input, (err: NodeJS.ErrnoException, data: Buffer) => {
    if (err) {
      console.error("Couldn't read input file: " + input);
      return;
    }
    // if (customConfigObject && customConfigObject.path) {
    //   customConfigObject.path = customConfigObject.path.map(
    //     x => process.cwd() + "/" + x
    //   );
    // }
    // const opts = Object.assign(customConfigObject || {}, { root: inputPath });
    // console.log("Using Config: ", opts);

    postcss([importer({ root: inputPath }), ...customPlugins])
      .process(data.toString(), {
        from: inputPath,
      })
      .then((result: Result) => {
        usedClasses = [];
        classProperties = [];
        if (result && result.root) {
          result.root.walkRules((rule: Rule) => {
            if (
              rule.selector.startsWith(".") &&
              (rule.selector.startsWith(".hover") ||
                !rule.selector.includes(":"))
            ) {
              const splitOnCommas = rule.selector.split(/,\s/);
              splitOnCommas.forEach((x: string) => {
                let dotless = x.substr(1); // .replace("-", "_").replace("-", "_");
                let classname = camelcase(dotless);
                if (
                  classname.includes(".") ||
                  // (dotless.includes(":") && !dotless.startsWith(".hover")) ||
                  dotless.includes(">") ||
                  dotless.includes("+")
                ) {
                  return;
                }
                classname = classname.replace(/Hover$/, "");
                dotless = dotless.replace(/:hover$/, "");
                if (protectedGetters.indexOf(classname) >= 0) {
                  classname = classname[0].toUpperCase() + classname.substr(1);
                }
                if (usedClasses.indexOf(classname) >= 0) {
                  return;
                }
                usedClasses.push(classname);
                classProperties.push(
                  `get ${classname}() { return this.add("${dotless}"); }`
                );
              });
            }
          });
        }
        let typeScriptClass = "";
        let templFn: (props: string[]) => string;
        try {
          templFn = require(templatePath).default;
          //   console.log("Loading template", templFn);
          typeScriptClass = templFn(classProperties);
        } catch (error) {
          console.error("Couldnt' load or use template", error);
        }
        // console.log(typeScriptClass);
        console.log(`writing ${classProperties.length} members into ${output}`);
        fs.writeFileSync(output, typeScriptClass);
        if (overwrite) {
          fs.writeFileSync(input, result.css);
        }
        if (watchMode && !isWatching) {
          isWatching = true;
          console.log("Watching for changes...");
          fs.watchFile(input, () => readFile(input, output, opts));
        }
      });
  });
}
