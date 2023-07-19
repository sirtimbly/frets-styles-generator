import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

import { Baretest } from "./typings/baretest";
import postcss from "postcss";
import { GetResultProcessor } from "../src/processFile";
import importer from "postcss-import";

const file = "gds-bootstrap.css";
const directory = path.join(process.cwd(), "build/_tests/");
const output = path.join(process.cwd(), "build/_tests/gds-bootstrap-styles.ts");
export const configGdsTest = async (test: Baretest): Promise<void> => {
  const customPlugins = [importer({ root: directory })];
  test("create gds-bootstrap standard file for react", async () => {
    await postcss(customPlugins)
      .process(fs.readFileSync(directory + file), {
        from: directory,
      })
      .then(
        GetResultProcessor({
          input: file,
          inputPath: directory,
          output: output,
          templatePath: path.join(
            process.cwd(),
            "build/main/templates/react.js"
          ),
          customPlugins: [],
          overwrite: true,
        })
      )
      .catch((err: NodeJS.ErrnoException) => {
        if (err) {
          console.error("Couldn't process file: " + file, err);
          return;
        }
      });

    console.log("entering read and verify step");
    const expectedOutput = fs.readFileSync(
      path.join(process.cwd(), "build/_tests/gds-bootstrap.txt")
    );
    const result = fs.readFileSync(output);
    assert.strictEqual(result.equals(expectedOutput), true);
  });
};
