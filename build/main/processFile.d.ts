import { Result } from "postcss";
export declare type TOpts = {
    input: string;
    output: string;
    templatePath: string;
    customPlugins: any[];
    inputPath: string;
    overwrite: boolean;
    watchMode?: boolean;
    debug?: boolean;
};
export default function readFile(opts: TOpts): Promise<void>;
export declare const GetResultProcessor: (opts: TOpts) => (result: Result) => void;
