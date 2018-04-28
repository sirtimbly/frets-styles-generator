#! /usr/bin/env node
// let fs = require("fs");

// let postcssConfig = require("./postcss.config");

import * as fs from "fs";
import * as postcss from "postcss";

let importer = require("postcss-import");
let camelcase = require("camel-case");
let program = require("commander");
const walk = require("walk");
const normalize = require('normalize-path');

let isWatching = false;


let usedClasses: string[] = [];
let classProperties: string[] = [];

let protectedGetters = Object.getOwnPropertyNames(Object.getPrototypeOf(new String())).concat(["input", "button", "div", "select", "textarea", "label", "div", "$"]);
// console.log(protectedGetters.join(", "));
program
.version("0.1.2")
.usage("[options] inputPath")
.option("-w, --watch", "watch the file for changes")
// .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
.parse(process.argv);

const inputPath = normalize(program.args[0]);

// const outputFile = program.args[1];

const watchMode = program.watch;

console.log("reading directory " + inputPath);
const walker = walk.walk(inputPath);
walker.on("file", (root: any, stat: any, next: () => any) => {
    if (!stat.isDirectory()) {
        const extension = stat.name.split(".")[1];
        if (extension === "css") {
            const inputFile = stat.name.split(".")[0];
            readFile(root + "/" + stat.name, root + `/${inputFile.split()}-styles.ts`);
        }
    }
    next();
});

function readFile(input: string, output: string) {

    console.log("reading " + input);

    fs.readFile(input, (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
            console.error("Couldn't read input file: " + input);
            return;
        }
        postcss([importer({root: inputPath})]).process(data.toString())
        .then((result: postcss.Result) => {

            usedClasses = [];
            classProperties = [];
            if (result && result.root) {

                result.root.walkRules((rule: postcss.Rule) => {
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
                        if ( protectedGetters.indexOf(classname) >= 0) {
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

            const typeScriptClass =
    `
    import * as Maquette from "maquette";

    export default class BaseStyles {
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

        public h = (properties?: Maquette.VNodeProperties, children?: (string | Maquette.VNode | Maquette.VNodeChild)[]): Maquette.VNode => {
            if (this.classObjectMode) {
                throw Error("You can't build a vnode when you are using this for building a classes object");
            }
            if (typeof properties === "object" && properties.length > 0) {
                return Maquette.h(this.toString(), properties);
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
            if (this.chain.length === 1) {
                return this.chain[0] || "div";
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
            fs.writeFileSync(output, typeScriptClass);
            if (watchMode && !isWatching) {
                isWatching = true;
                console.log("Watching for changes...");
                fs.watchFile(input, () => readFile(input, output));
            }
        });
    });
}
