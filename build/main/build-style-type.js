#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const processFile_1 = require("./processFile");
const importer = require("postcss-import");
const program = require("commander");
const walk = require("walk");
const normalize = require("normalize-path");
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
let customPlugins = [];
exports.customPlugins = customPlugins;
let postCssConfigPath = process.cwd() + "/postcss.config.js";
if (!fs.existsSync(postCssConfigPath)) {
    postCssConfigPath = __dirname + "/postcss.config.js";
}
exports.customPlugins = customPlugins = [
    importer({ root: inputPath }),
    ...require(postCssConfigPath).plugins,
];
const removeThesePlugins = ["postcss-import"];
if (!program.purge) {
    // we don't want purge to run by default
    removeThesePlugins.push("postcss-plugin-purgecss");
}
exports.customPlugins = customPlugins = customPlugins.filter((p) => {
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
            processFile_1.default({
                input: root + "/" + stat.name,
                output: root + `/${inputFile.split()}-styles.ts`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHlCQUF5QjtBQUN6QiwrQ0FBcUM7QUFDckMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDM0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU1Qyw0Q0FBNEM7QUFDNUMsT0FBTztLQUNKLE9BQU8sQ0FBQyxPQUFPLENBQUM7S0FDaEIsS0FBSyxDQUFDLHFCQUFxQixDQUFDO0tBQzVCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsNEJBQTRCLENBQUM7S0FDbkQsTUFBTSxDQUNMLGlCQUFpQixFQUNqQiwyRUFBMkUsRUFDM0UsS0FBSyxDQUNOO0tBQ0EsTUFBTSxDQUNMLHVCQUF1QixFQUN2QixzREFBc0QsQ0FDdkQ7S0FDQSxNQUFNLENBQUMsYUFBYSxFQUFFLG1DQUFtQyxDQUFDO0tBQzFELE1BQU0sQ0FDTCxhQUFhLEVBQ2I7K0VBQzJFLEVBQzNFLEtBQUssQ0FDTjtJQUNELG1GQUFtRjtLQUNsRixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXZCLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELElBQUksZUFBZSxHQUFHLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztBQUMzRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7SUFDakIsZUFBZSxHQUFHLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztDQUNyRDtBQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtJQUNwQixlQUFlLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3JFO0FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUUvQyxzQ0FBc0M7QUFFdEMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUVoQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0lBQ2xDLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztDQUMxQixDQUFDLENBQUM7QUFDSCxzREFBc0Q7QUFDdEQsSUFBSSxhQUFhLEdBQVUsRUFBRSxDQUFDO0FBOENyQixzQ0FBYTtBQTdDdEIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsb0JBQW9CLENBQUM7QUFFN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRTtJQUNyQyxpQkFBaUIsR0FBRyxTQUFTLEdBQUcsb0JBQW9CLENBQUM7Q0FDdEQ7QUFDRCx3QkFBQSxhQUFhLEdBQUc7SUFDZCxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7SUFDN0IsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPO0NBQ3RDLENBQUM7QUFFRixNQUFNLGtCQUFrQixHQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtJQUNsQix3Q0FBd0M7SUFDeEMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7Q0FDcEQ7QUFFRCx3QkFBQSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtRQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsRCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUMsQ0FBQztBQUVILDhCQUE4QjtBQUU5QixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQVMsRUFBRSxJQUFTLEVBQUUsSUFBZSxFQUFFLEVBQUU7SUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUN2QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLFNBQVMsS0FBSyxLQUFLLEVBQUU7WUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMscUJBQVEsQ0FBQztnQkFDUCxLQUFLLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSTtnQkFDN0IsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWTtnQkFDaEQsWUFBWSxFQUFFLGVBQWU7Z0JBQzdCLGFBQWE7Z0JBQ2IsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUzthQUM3QixDQUFDLENBQUM7U0FDSjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQyJ9