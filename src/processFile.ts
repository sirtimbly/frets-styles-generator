import * as fs from "fs";
// const readFileAsync = fs.promises.readFile;
// const importer = require("postcss-import");
import postcss, { Result, Rule, AcceptedPlugin } from "postcss";
import { camelCase } from "camel-case";
const protectedGetters = Object.getOwnPropertyNames(
  Object.getPrototypeOf("")
).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);

export type TOpts = {
  input: string;
  output: string;
  templatePath: string;
  customPlugins: AcceptedPlugin[];
  inputPath: string;
  overwrite: boolean;
  watchMode?: boolean;
  debug?: boolean;
};
export default async function readFile(opts: TOpts): Promise<void> {
  const { customPlugins, inputPath, input } = opts;

  console.log("reading " + input);
  const directoryParts = input.split("/");
  if (directoryParts[directoryParts.length - 1][0] === "_") {
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

type TProcessor = (result: Result) => void;
export const GetResultProcessor = (opts: TOpts): TProcessor => {
  const { templatePath, watchMode, overwrite, debug, output, input } = opts;

  let isWatching = false;

  const usedPropertyNames: string[] = [];
  const usedClassStrings: string[] = [];
  const classProperties: string[] = [];

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
            let dotLess = x.substring(1);
            let className = camelCase(dotLess);
            if (
              className.includes(".") ||
              dotLess.includes(">") ||
              dotLess.includes("+")
            ) {
              return;
            }
            className = className.replace(/Hover$/, "");
            dotLess = dotLess.replace(/:hover$/, "");
            if (protectedGetters.indexOf(className) >= 0) {
              className = "_" + className;
            }
            if (usedPropertyNames.indexOf(className) >= 0) {
              return;
            }
            usedClassStrings.push(dotLess);
            usedPropertyNames.push(className);
            classProperties.push(
              `get ${className}() { return this.add("${dotLess}"); }`
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
    let templateFn: (props: string[]) => string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      templateFn = require(templatePath).default;
      typeScriptClass = templateFn(classProperties);
    } catch (error) {
      console.error("Couldn't load or use template", error);
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
