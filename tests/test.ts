import baretest from "baretest";
import { Baretest } from "./typings/baretest";

const test: Baretest = baretest("Processing Library");

// A big ol' list of tests to set up and run
// import new tests and call them here
import configureAppTest from "./tailwind.spec";
configureAppTest(test);

!(async function () {
  await test.run();
  process.exit();
})();
