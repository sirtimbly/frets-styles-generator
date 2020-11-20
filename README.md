<a href="https://www.npmjs.com/package/frets-styles-generator"><img alt="npm" src="https://img.shields.io/npm/v/frets-styles-generator"></a>

# frets-styles-generator

Generates a chainable API module from a given input CSS file. This was designed for use with utility css libraries like [basscss](https://basscss.com/) and [tailwindcss](https://tailwindcss.com/). The typescript class is perfect for making hyperscript function fun and easy and expressive. This makes writing frontend reactive code without JSX easy.

```ts
import { $ } from "./output-styles";
$.div.p_3.bgBlack.textWhite.fontExtrabold.textCenter.text_4xl.h("hello world");
```

Uses postcss under the hood.

## Installation

`npm install frets-styles-generator --save-dev`

And here is more recommended starter packages with common postcss plugins, and purgecss, and support for @import.

`npm install postcss-cli postcss-import postcss-preset-enc purgecss purge-css-from-frets cssnano -D`

## Usage

`npx frets-styles-generator [input.css] [output.css] -t [node_modules/frets/styles-generator/build/templates/react.js] `

The first argument you pass to the program will be the directory to scan for CSS files. It defaults to "./src" if you leave the argument out. Each CSS file that is found will be run through postcss (utilizing the [postcss-import](https://github.com/postcss/postcss-import) plugin by default) and then turned into a .ts file like [orginialFilename-styles.ts] based on the template specified. The default template is for [maquette](https://github.com/AFASSoftware/maquette) hyperscript functions.

Optionally pass this argument `-t '[path to custom template.js file]'` to specify a custom template.

Used in conjunction with FRETS and/or another hyperscript implementation. Ships with a maquette template and a react template. This particular template is specifically for the Maquette hyperscript implementation. Meaning it outputs a ts file that expects maquette to be available for import, so you will need 'maquette' in your project as a dependency.

## Other Options

`-w` watches for file changes.

`-o` which will overwrite the original css file using the postcss-import plugin.

`-p` or `--purge` flag will allow the use of purgecss (must also be configured in postcss.config.js).

## Purging unused CSS

The generation of the typescript class suffers from the same inefficiency as atomic CSS. It includes a bunch of members that you may not be currently using in your actual source code. The atomic CSS people have found that using [purgecss](https://www.purgecss.com/) will greatly reduce file size by scanning your source code files for classnames that are used and only including those selectors in the final css output.

We can use the same technology for two purposes in FRETS. First, we configure postcss to scan our `src/**/.ts` files with the custom extractor [purgecss-from-frets](https://www.npmjs.com/package/purgecss-from-frets) and when we use PostCSS to compile browser-ready css we will get only the selectors that are neccessary!

Here's my sample postcss config.

```js
const postcssPresetEnv = require("postcss-preset-env");
var atImport = require("postcss-import");
var purgecss = require("@fullhuman/postcss-purgecss");

var purgeFromFrets = require("purgecss-from-frets");

module.exports = {
  plugins: [
    atImport(),
    postcssPresetEnv({
      stage: 1,
      browsers: "last 2 versions",
    }),
    purgecss({
      content: ["./src/components/**/*.ts"],
      extractors: [{ extractor: purgeFromFrets, extensions: ["ts"] }],
      whitelist: ["html", "body", "input", "button", "select"],
      whitelistPatterns: [/icon/, /green/],
      rejected: true,
    }),
    // cssnano({
    //   preset: 'default',
    // })
  ],
  input: "src/base.css",
  dir: "dist",
};
```

Now to solve the other half of the problem. Normally when frets-styles-generator analyzes your source css file it purposefully removes the purgecss plugin so that you have access to the entire set of class names from your css file when writing typscript code.

But, during your build script you can actually re-generate the `*-styles.ts` files with the `-p` flag to allow purgecss to remove unused selectors from your typescript class too! This will significantly decrease the size of your `*-styles.ts` files before they get compiled into final javascript bundles by webpack.

Here's a sample build script from my package.json.

```json
"build:prod": "frets-styles-generator src/base.css src/base-styles.ts -p && cross-env NODE_ENV=production webpack -p && npm run css && npm run css:minify",
```

I find it especially useful for rapid prototyping if you point it at [BaseCSS](https://github.com/basscss/bassplate) or [tachyons](http://tachyons.io/) because then you have a chainable typescript method for every "atomic" css class.

## Custom Templates

See the [current maquette template](https://gitlab.com/FRETS/frets-styles-generator/blob/master/src/templates/maquette.ts) for an example.

It should be possible to build templates for using the preact, react, or vue hyperscript functions.
