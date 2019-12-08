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
    .option("-r, --react", "use the react template by default")
    .option("-p, --purge", `Allow purgecss in your custom postcss.config.js to purge the output files.
     Default is to skip purgecss plugin if it's in your project postcss.config`, false)
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
    filters: ["node_modules"]
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
customPlugins = customPlugins.filter(p => {
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
            from: inputPath
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFFbkMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBRXZCLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLGVBQWUsR0FBYSxFQUFFLENBQUM7QUFFbkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQ2pELE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQzFCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEYsNENBQTRDO0FBQzVDLE9BQU87S0FDSixPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ2hCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztLQUM1QixNQUFNLENBQUMsYUFBYSxFQUFFLDRCQUE0QixDQUFDO0tBQ25ELE1BQU0sQ0FDTCxpQkFBaUIsRUFDakIsMkVBQTJFLEVBQzNFLEtBQUssQ0FDTjtLQUNBLE1BQU0sQ0FDTCx1QkFBdUIsRUFDdkIsc0RBQXNELENBQ3ZEO0tBQ0EsTUFBTSxDQUFDLGFBQWEs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