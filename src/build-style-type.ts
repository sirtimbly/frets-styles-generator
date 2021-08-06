#! /usr/bin/env node

import * as fs from "fs";
import readFile from "./processFile";
import { Plugin } from "postcss";
import { basename } from "estrella";
import importer = require("postcss-import");
import program = require("commander");
import walk = require("walk");
import normalize = require("normalize-path");

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
let cliTemplatePath = __dirname + "/templates/maquette.js";
if (program.react) {
  cliTemplatePath = __dirname + "/templates/react.js";
}
if (program.template) {
  cliTemplatePath = normalize(process.cwd() + "/" + program.template);
}
console.log("Using Template", cliTemplatePath);

// const outputFile = program.args[1];

const watchMode = program.watch;

console.log("reading directory " + inputPath);
const walker = walk.walk(inputPath, {
  filters: ["node_modules"],
});
// const customConfigObject: { path?: string[] } = {};
let customPlugins: Plugin[] = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";

if (!fs.existsSync(postCssConfigPath)) {
  postCssConfigPath = __dirname + "/postcss.config.js";
}
customPlugins = [
  importer({ root: inputPath }),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ...require(postCssConfigPath).plugins,
];

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
        overwrite: program.overwrite,
      });
    }
  }
  next();
});

export { customPlugins };
