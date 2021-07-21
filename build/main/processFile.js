"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
// const readFileAsync = fs.promises.readFile;
// const importer = require("postcss-import");
const postcss_1 = require("postcss");
const camelcase = require("camel-case");
const protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf("")).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
async function readFile(opts) {
    const { customPlugins, inputPath, input } = opts;
    console.log("reading " + input);
    const dirparts = input.split("/");
    if (dirparts[dirparts.length - 1][0] === "_") {
        return; // don't process files tht start with and underscore
    }
    return postcss_1.default(customPlugins)
        .process(fs.readFileSync(input), {
        from: inputPath,
    })
        .then(exports.GetResultProcessor(opts))
        .catch((err) => {
        if (err) {
            console.error("Couldn't process file: " + input, err);
            return;
        }
    });
}
exports.default = readFile;
exports.GetResultProcessor = (opts) => {
    const { templatePath, watchMode, overwrite, debug, output, input } = opts;
    let isWatching = false;
    let usedClasses = [];
    let classProperties = [];
    const time1 = new Date().getTime();
    return (result) => {
        if (result && result.root) {
            result.root.walkRules((rule) => {
                if (rule.selector.startsWith(".") &&
                    (rule.selector.startsWith(".hover") || !rule.selector.includes(":"))) {
                    const splitOnCommas = rule.selector.split(/,\s/);
                    splitOnCommas.forEach((x) => {
                        let dotless = x.substr(1);
                        let classname = camelcase(dotless);
                        if (classname.includes(".") ||
                            dotless.includes(">") ||
                            dotless.includes("+")) {
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
                        classProperties.push(`get ${classname}() { return this.add("${dotless}"); }`);
                    });
                }
            });
            if (debug) {
                console.log(`🕐 walk rules complete: ${new Date().getTime() - time1}ms`);
            }
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
        if (debug) {
            console.log(`🕐 templating complete: ${new Date().getTime() - time1}ms`);
        }
        // console.log(typeScriptClass);
        console.log(`writing ${classProperties.length} members into ${output}`);
        fs.writeFileSync(output, typeScriptClass);
        if (debug) {
            console.log(`🕐 write file sync complete: ${new Date().getTime() - time1}ms`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc0ZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJvY2Vzc0ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QyxxQ0FBZ0Q7QUFDaEQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUNqRCxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUMxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBWWpFLEtBQUssVUFBVSxRQUFRLENBQUMsSUFBVztJQUNoRCxNQUFNLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUM1QyxPQUFPLENBQUMsb0RBQW9EO0tBQzdEO0lBRUQsT0FBTyxpQkFBTyxDQUFDLGFBQWEsQ0FBQztTQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMvQixJQUFJLEVBQUUsU0FBUztLQUNoQixDQUFDO1NBQ0QsSUFBSSxDQUFDLDBCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCLEtBQUssQ0FBQyxDQUFDLEdBQTBCLEVB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