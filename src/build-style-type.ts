#! /usr/bin/env node

import * as fs from "fs";
import readFile from "./processFile";
import { Plugin } from "postcss";
import { basename, cliopts, dirname } from "estrella";
import importer = require("postcss-import");

import walk = require("walk");
import normalize = require("normalize-path");
// const program = new Command();
const [opts] = cliopts.parse(
  ["input", "Input File or Directory", "<input>"],
  [
    "o, overwrite",
    "overwrite the css files that are parsed with the PostCSS processed result",
  ],
  [
    "template",
    "specify a custom template file [path to a js module]",
    "<template>",
  ],
  ["react", "use the react template by default"],
  ["watchmode", "watch for changes in the found css files"],
  [
    "purge",
    `Allow purgecss in your custom postcss.config.js to purge the output files. (Default is to skip purgecss plugin if it's in your project postcss.config)`,
  ]
);

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

// const outputFile = program.args[1];
console.log("watch?", opts.watchmode);
const watchMode = opts.watchmode;

// const customConfigObject: { path?: string[] } = {};
let customPlugins: Plugin[] = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";

if (!fs.existsSync(postCssConfigPath)) {
  postCssConfigPath = __dirname + "/postcss.config.js";
}

if (!fs.existsSync(postCssConfigPath)) {
  console.error(`postcss.config.js file is missing in root directory`);
  process.exit(1);
}
customPlugins = [
  importer({ root: inputPath }),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ...require(postCssConfigPath).plugins,
];

const removeThesePlugins: string[] = ["postcss-import"];
if (!opts.purge) {
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
if (!fs.statSync(inputPath).isDirectory()) {
  console.log("Read File", inputPath);
  const root = dirname(inputPath);
  readFile({
    input: inputPath,
    output: root + `/${basename(inputPath, ".css")}-styles.ts`,
    templatePath: cliTemplatePath,
    customPlugins,
    inputPath,
    watchMode,
    overwrite: opts.overwrite,
  });
} else {
  console.log("reading directory " + inputPath);
  const walker = walk.walk(inputPath, {
    filters: ["node_modules"],
  });
  walker.on("file", (root, stat, next) => {
    if (!stat.isDirectory()) {
      const extension = stat.name.split(".")[1];
      if (extension === "css") {
        const inputFile = stat.name.split(".")[0];
        readFile({
          input: root + "/" + stat.name,
          output: root + `/${basename(inputFile, ".css")}-styles.ts`,
          templatePath: cliTemplatePath,
          customPlugins,
          inputPath,
          watchMode,
          overwrite: opts.overwrite,
        });
      }
    }
    next();
  });
}
// console.log(customPlugins);

export { customPlugins };
