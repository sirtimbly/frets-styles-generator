#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const postcss = require("postcss");
let importer = require("postcss-import");
let camelcase = require("camel-case");
let program = require("commander");
const walk = require("walk");
const normalize = require("normalize-path");
let isWatching = false;
let usedClasses = [];
let classProperties = [];
let protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf(new String())).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
// console.log(protectedGetters.join(", "));
program
    .version("0.1.4")
    .usage("[options] inputPath")
    .option("-w, --watch", "watch the file for changes")
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
let customConfigObject = {};
let postCssConfigPath = process.cwd() + "/postcss.config.js";
if (!fs.existsSync(postCssConfigPath)) {
    postCssConfigPath = __dirname + "/postcss.config.js";
}
customConfigObject = require(postCssConfigPath).plugins["postcss-import"];
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
        if (customConfigObject && customConfigObject.path) {
            customConfigObject.path = customConfigObject.path.map(x => process.cwd() + "/" + x);
        }
        const opts = Object.assign(customConfigObject || {}, { root: inputPath });
        console.log("Using Importer Config: ", opts);
        postcss([importer(opts)])
            .process(data.toString())
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
            fs.writeFileSync(input, result.css);
            if (watchMode && !isWatching) {
                isWatching = true;
                console.log("Watching for changes...");
                fs.watchFile(input, () => readFile(input, output));
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFFbkMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBRXZCLElBQUksV0FBVyxHQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLGVBQWUsR0FBYSxFQUFFLENBQUM7QUFFbkMsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQy9DLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUNwQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLDRDQUE0QztBQUM1QyxPQUFPO0tBQ0osT0FBTyxDQUFDLE9BQU8sQ0FBQztLQUNoQixLQUFLLENBQUMscUJBQXFCLENBQUM7S0FDNUIsTUFBTSxDQUFDLGFBQWEsRUFBRSw0QkFBNEIsQ0FBQztLQUNuRCxNQUFNLENBQ0wsdUJBQXVCLEVBQ3ZCLHNEQUFzRCxDQUN2RDtLQUVBLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkIsTUFBTSxTQUFTLEdBQUcs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