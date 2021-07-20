export default function readFile(input: string, output: string, opts: {
    templatePath: string;
    customPlugins: any[];
    inputPath: string;
    watchMode?: boolean;
    overwrite: boolean;
}): void;
