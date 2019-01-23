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
    .usage("[options] inputPath")
    .option("-w, --watch", "watch the file for changes")
    .option("-o, --overwrite", "overwrite the css files that are parsed with the PostCSS processed result", false)
    .option("-t, --template <path>", "specify a custom template file [path to a js module]")
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
const walker = walk.walk(inputPath);
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
if (customPlugins) {
    if (customPlugins["import"]) {
        delete customPlugins["import"];
    }
    if (customPlugins["atImport"]) {
        delete customPlugins["atImport"];
    }
    if (customPlugins["importer"]) {
        delete customPlugins["importer"];
    }
}
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
        postcss([...customPlugins, importer({ root: inputPath })])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFFbkMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBRXZCLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLGVBQWUsR0FBYSxFQUFFLENBQUM7QUFFbkMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQ2pELE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQzFCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEYsNENBQTRDO0FBQzVDLE9BQU87S0FDSixPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ2hCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQztLQUM1QixNQUFNLENBQUMsYUFBYSxFQUFFLDRCQUE0QixDQUFDO0tBQ25ELE1BQU0sQ0FDTCxpQkFBaUIsRUFDakIsMkVBQTJFLEVBQzNFLEtBQUssQ0FDTjtLQUNBLE1BQU0sQ0FDTCx1QkFBdUIsRUFDdkIsc0RBQXNELENBQ3ZEO0tBRUEsS0FBSyxDQUFDLE9BQU8s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