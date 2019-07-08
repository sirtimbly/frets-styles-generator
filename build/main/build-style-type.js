#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const postcss = require("postcss");
const importer = require("postcss-import");
const camelcase = require("camel-case");
const program = require("commander");
const walk = require("walk");
const normalize = require("normalize-path");
let isWatching = false;
let usedClasses = [];
let classProperties = [];
const protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf("")).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
// console.log(protectedGetters.join(", "));
program
    .version("0.2.0")
    .usage("inputPath [options]")
    .option("-w, --watch", "watch the file for changes")
    .option("-o, --overwrite", "overwrite the css files that are parsed with the PostCSS processed result", false)
    .option("-t, --template <path>", "specify a custom template file [path to a js module]")
    .option("-p, --purge", `Allow purgecss in your custom postcss.config.js to purge the output files.
     Default is to skip purgecss plugin if it's in your project postcss.config`, false)
    //  .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
    .parse(process.argv);
const inputPath = normalize(program.args[0] || "./src");
let templatePath = __dirname + "/templates/maquette.js";
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
walker.on("file", (root, stat, next) => {
    if (!stat.isDirectory()) {
        const extension = stat.name.split(".")[1];
        if (extension === "css") {
            const inputFile = stat.name.split(".")[0];
            readFile(root + "/" + stat.name, root + `/${inputFile.split()}-styles.ts`);
        }
    }
    next();
});
// const customConfigObject: { path?: string[] } = {};
let customPlugins = [];
let postCssConfigPath = process.cwd() + "/postcss.config.js";
if (!fs.existsSync(postCssConfigPath)) {
    postCssConfigPath = __dirname + "/postcss.config.js";
}
customPlugins = require(postCssConfigPath).plugins;
const removeThesePlugins = ["postcss-import"];
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
function readFile(input, output) {
    console.log("reading " + input);
    const dirparts = input.split("/");
    if (dirparts[dirparts.length - 1][0] === "_") {
        return; // don't process files tht start with and underscore
    }
    fs.readFile(input, (err, data) => {
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
            .then((result) => {
            usedClasses = [];
            classProperties = [];
            if (result && result.root) {
                result.root.walkRules((rule) => {
                    if (rule.selector.startsWith(".") && !rule.selector.includes(":")) {
                        const splitOnCommas = rule.selector.split(/,\s/);
                        splitOnCommas.forEach((x) => {
                            const dotless = x.substr(1); // .replace("-", "_").replace("-", "_");
                            let classname = camelcase(dotless);
                            if (classname.includes(".") ||
                                dotless.includes(":") ||
                                dotless.includes(">") ||
                                dotless.includes("+")) {
                                return;
                            }
                            if (protectedGetters.indexOf(classname) >= 0) {
                                classname = classname[0].toUpperCase() + classname.substr(1);
                            }
                            if (usedClasses.indexOf(classname) >= 0) {
                                return;
                            }
                            usedClasses.push(classname);
                            classProperties.push(`get ${classname}() { return this.add("${dotless}"); }`);
                        });
                    }
                });
            }
            let typeScriptClass = "";
            let templFn;
            try {
                templFn = require(templatePath).default;
                //   console.log("Loading template", templFn);
                typeScriptClass = templFn(classProperties);
            }
            catch (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFFbkMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBRXZCLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLGVBQWUsR0FBYSxFQUFFLENBQUM7QUFFbkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQ2pELE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQzFCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEYsNENBQTRDO0FBQzVDLE9BQU87S0FDSixPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ2hCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztLQUM1QixNQUFNLENBQUMsYUFBYSxFQUFFLDRCQUE0QixDQUFDO0tBQ25ELE1BQU0sQ0FDTCxpQkFBaUIsRUFDakIsMkVBQTJFLEVBQzNFLEtBQUssQ0FDTjtLQUNBLE1BQU0sQ0FDTCx1QkFBdUIsRUFDdkIsc0RBQXNELENBQ3ZEO0tBQ0EsTUFBTSxDQUNMLGFBQWEs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