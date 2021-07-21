import * as fs from "fs";
// const readFileAsync = fs.promises.readFile;
// const importer = require("postcss-import");
import postcss, { Result, Rule } from "postcss";
const camelcase = require("camel-case");
const protectedGetters = Object.getOwnPropertyNames(
  Object.getPrototypeOf("")
).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);

export type TOpts = {
  input: string;
  output: string;
  templatePath: string;
  customPlugins: any[];
  inputPath: string;
  overwrite: boolean;
  watchMode?: boolean;
  debug?: boolean;
};
export default async function readFile(opts: TOpts) {
  const { customPlugins, inputPath, input } = opts;

  console.log("reading " + input);
  const dirparts = input.split("/");
  if (dirparts[dirparts.length - 1][0] === "_") {
    return; // don't process files tht start with and underscore
  }

  return postcss(customPlugins)
    .process(fs.readFileSync(input), {
      from: inputPath,
    })
    .then(GetResultProcessor(opts))
    .catch((err: NodeJS.ErrnoException) => {
      if (err) {
        console.error("Couldn't process file: " + input, err);
        return;
      }
    });
}

export const GetResultProcessor = (opts: TOpts) => {
  const { templatePath, watchMode, overwrite, debug, output, input } = opts;

  let isWatching = false;

  let usedClasses: string[] = [];
  let classProperties: string[] = [];

  const time1 = new Date().getTime();
  return (result: Result) => {
    if (result && result.root) {
      result.root.walkRules((rule: Rule) => {
        if (
          rule.selector.startsWith(".") &&
          (rule.selector.startsWith(".hover") || !rule.selector.includes(":"))
        ) {
          const splitOnCommas = rule.selector.split(/,\s/);
          splitOnCommas.forEach((x: string) => {
            let dotless = x.substr(1);
            let classname = camelcase(dotless);
            if (
              classname.includes(".") ||
              dotless.includes(">") ||
              dotless.includes("+")
            ) {
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
            classProperties.push(
              `get ${classname}() { return this.add("${dotless}"); }`
            );
          });
        }
      });
      if (debug) {
        console.log(
          `🕐 walk rules complete: ${new Date().getTime() - time1}ms`
        );
      }
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
    if (debug) {
      console.log(`🕐 templating complete: ${new Date().getTime() - time1}ms`);
    }
    // console.log(typeScriptClass);
    console.log(`writing ${classProperties.length} members into ${output}`);
    fs.writeFileSync(output, typeScriptClass);
    if (debug) {
      console.log(
        `🕐 write file sync complete: ${new Date().getTime() - time1}ms`
      );
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
      console.log(`🕐 All Done: ${new Date().getTime() - time1}ms`);
    }
  };
};
