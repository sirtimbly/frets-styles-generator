#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const postcss = require("postcss");
let importer = require("postcss-import");
let camelcase = require("camel-case");
let program = require("commander");
let isWatching = false;
let usedClasses = [];
let classProperties = [];
let protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf(new String())).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
// console.log(protectedGetters.join(", "));
program
    .version("0.1.2")
    .usage("[options] inputFile outputFile")
    .option("-w, --watch", "watch the file for changes")
    .parse(process.argv);
const inputFile = program.args[0];
const outputFile = program.args[1];
const watchMode = program.watch;
readFile(inputFile, outputFile);
function readFile(input, output) {
    console.log("reading " + input);
    fs.readFile(input || "./src/base.css", (err, data) => {
        if (err) {
            throw new Error("Couldn't read input file: " + input);
        }
        postcss([importer({ root: "./src/" })]).process(data.toString())
            .then((result) => {
            usedClasses = [];
            classProperties = [];
            if (result && result.root) {
                result.root.walkRules((rule) => {
                    if (rule.selector.startsWith(".") &&
                        !rule.selector.includes(":")) {
                        const dotless = rule.selector.substr(1); // .replace("-", "_").replace("-", "_");
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
                    }
                });
            }
            const typeScriptClass = `
    import * as Maquette from "maquette";
    
    export class BaseStyles {
        public chain: string[];
        public conditions: boolean[] = [];
        public classProps: any = {};
        private writeConditionIndex: number = 0;
        private readConditionIndex: number = 0;
        private classObjectMode: boolean = false;
    
        constructor(selector: string) {
            this.chain = new Array<string>();
            if (selector.length > 0) {
                this.chain.push(selector);
            }
            return this;
        }
    
        public when = (condition: boolean): BaseStyles => {
            this.classObjectMode = true;
            this.conditions[this.writeConditionIndex] = condition;
            return this;
        }
    
        public andWhen = (condition: boolean): BaseStyles => {
            this.classObjectMode = true;
            this.writeConditionIndex++;
            this.readConditionIndex++;
            return this.when(condition);
    
        }
    
        public otherwise = (): BaseStyles => {
            this.classObjectMode = true;
            return this.andWhen( !this.conditions[this.readConditionIndex]);
        }
    
        public h = (properties?: Maquette.VNodeProperties, ...children: Maquette.VNodeChild[]): Maquette.VNode => {
            if (this.classObjectMode) {
                throw Error("You can't build a vnode when you are using this for building a classes object");
            }
            return Maquette.h(this.toString(), properties, children);
        }
    
        public toObj = () => {
            if (!this.classObjectMode) {
                // tslint:disable-next-line:max-line-length
                throw Error("You need to call at least one conditional method in order to use this as a classes object generator");
            }
            return this.classProps;
        }
    
        get div(): BaseStyles { return new BaseStyles("div"); }
        get span(): BaseStyles { return new BaseStyles("span"); }
        get button(): BaseStyles { return new BaseStyles("button.btn"); }
        get input(): BaseStyles { return new BaseStyles("input.input"); }
        get label(): BaseStyles { return new BaseStyles("label.label"); }
        get select(): BaseStyles { return new BaseStyles("select.select"); }
        get textarea(): BaseStyles { return new BaseStyles("textarea.textarea"); }
    
        public toString = (): string => {
            if (this.classObjectMode) {
                throw Error("You can't build a selector string when you are calling conditional methods");
            }
            return this.chain.join(".");
        }
    
        public $ = (className: string): BaseStyles => {
            return this.add(className);
        }
    
        public add = (className: string): BaseStyles => {
            if (this.classObjectMode) {
                this.classProps[className] = this.conditions[this.readConditionIndex];
            } else if (className.length > 0) {
                this.chain.push(className);
            }
            return this;
        }

        ${classProperties.join("\n")}

}

export const $$ = (selector?: string): BaseStyles =>  {
    return new BaseStyles("" + selector || "");
};

export const $ = $$();

`;
            // console.log(typeScriptClass);
            console.log(`writing ${classProperties.length} members into ${output}`);
            fs.writeFileSync(output || "./src/base-styles.ts", typeScriptClass);
            if (watchMode && !isWatching) {
                isWatching = true;
                console.log("Watching for changes...");
                fs.watchFile(input, () => readFile(input, output));
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3R5bGUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9idWlsZC1zdHlsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlCQUF5QjtBQUN6QixtQ0FBbUM7QUFFbkMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVuQyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFHdkIsSUFBSSxXQUFXLEdBQWEsRUFBRSxDQUFDO0FBQy9CLElBQUksZUFBZSxHQUFhLEVBQUUsQ0FBQztBQUVuQyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JLLDRDQUE0QztBQUM1QyxPQUFPO0tBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQztLQUNoQixLQUFLLENBQUMsZ0NBQWdDLENBQUM7S0FDdkMsTUFBTSxDQUFDLGFBQWEsRUFBRSw0QkFBNEIsQ0FBQztLQUVuRCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXJCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVuQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBRWhD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