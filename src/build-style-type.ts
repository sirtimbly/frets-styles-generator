#! /usr/bin/env node
// let fs = require("fs");

// let postcssConfig = require("./postcss.config");

import * as fs from "fs";
import postcss, { Result, Rule } from "postcss";

const importer = require("postcss-import");
const camelcase = require("camel-case");
const program = require("commander");
const walk = require("walk");
const normalize = require("normalize-path");

let isWatching = false;

let usedClasses: string[] = [];
let classProperties: string[] = [];

const protectedGetters = Object.getOwnPropertyNames(
  Object.getPrototypeOf("")
).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
// console.log(protectedGetters.join(", "));
program
  .version("0.2.0")
  .usage("inputPath [options]")
  .option("-w, --watch", "watch the file for changes")
  .option(
    "-o, --overwrite",
    "overwrite the css files that are parsed with the PostCSS processed result",
    false
  )
  .option(
    "-t, --template <path>",
    "specify a custom template file [path to a js module]"
  )
  .option("-r, --react", "use the react template by default")
  .option(
    "-p, --purge",
    `Allow purgecss in your custom postcss.config.js to purge the output files.
     Default is to skip purgecss plugin if it's in your project postcss.config`,
    false
  )
  //  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
  .parse(process.argv);

const inputPath = normalize(program.args[0] || "./src");
let templatePath = __dirname + "/templates/maquette.js";
if (program.react) {
  templatePath = __dirname + "/templates/react.js";
}
if (program.template) {
  templatePath = normalize(process.cwd() + "/" + program.template);
}
console.log("Using Template", templatePath);

// const outputFile = program.args[1];

const watchMode = program.watch;

console.log("reading directory " + inputPath);
const walker = walk.walk(inputPath, {
  filters: ["node_modules"],
});
walker.on("file", (root: any, stat: any, next: () => any) => {
  if (!stat.isDirectory()) {
    const extension = stat.name.split(".")[1];
    if (extension === "css") {
      const inputFile = stat.name.split(".")[0];
      readFile(
        root + "/" + stat.name,
        root + `/${inputFile.split()}-styles.ts`
      );
    }
  }
  next();
});

// const customConfigObject: { path?: string[] } = {};
let customPlugins: any[] = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";

if (!fs.existsSync(postCssConfigPath)) {
  postCssConfigPath = __dirname + "/postcss.config.js";
}
customPlugins = require(postCssConfigPath).plugins;

const removeThesePlugins: string[] = ["postcss-import"];
if (!program.purge) {
  // we don't want purge to run by default
  removeThesePlugins.push("postcss-plugin-purgecss");
}

customPlugins = customPlugins.filter((p) => {
  if (p && p.postcssPlugin && removeThesePlugins.includes(p.postcssPlugin)) {
    console.log("skipping plugin: ", p.postcssPlugin);
    return false;
  }
  return true;
});

// console.log(customPlugins);

function readFile(input: string, output: string) {
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
        if (program.overwrite) {
          fs.writeFileSync(input, result.css);
        }
        if (watchMode && !isWatching) {
          isWatching = true;
          console.log("Watching for changes...");
          fs.watchFile(input, () => readFile(input, output));
        }
      });
  });
}
