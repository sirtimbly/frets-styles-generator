<a href="https://www.npmjs.com/package/frets-styles-generator"><img alt="npm" src="https://img.shields.io/npm/v/frets-styles-generator"></a>

# frets-styles-generator

Generates a chainable API class from a given input CSS file. This was designed for use with utility css libraries like [basscss](https://basscss.com/) and [tailwindcss](https://tailwindcss.com/). The typescript class is perfect for making hyperscript function fun and easy and expressive. This makes writing frontend reactive code without JSX easy. Think of it as an alternative to css modules.

```ts
import { $ } from "./output-styles";
$.div.p_3.bgBlack.textWhite.fontExtrabold.textCenter.text_4xl.h("hello world");
```

Uses postcss under the hood.

## Installation

`npm install frets-styles-generator --save-dev`

And here is more recommended starter packages with common postcss plugins, and purgecss, and support for @import.

`npm install -D postcss-cli postcss-import postcss-preset-enc purgecss purge-css-from-frets cssnano `

## Usage

`npx frets-styles-generator [input-dir] --react` (--react flag uses the react template for output)

The first argument you pass to the program will be the directory to scan for CSS files. It defaults to "./src" if you leave the argument out. Each CSS file that is found will be run through postcss (utilizing the [postcss-import](https://github.com/postcss/postcss-import) plugin by default) and then turned into a .ts file like [orginialFilename-styles.ts] based on the template specified. The default template is for [maquette](https://github.com/AFASSoftware/maquette) hyperscript functions.

Optionally pass this argument `-t '[path to custom template.js file]'` to specify a custom template.

Used in conjunction with FRETS and/or another hyperscript implementation. Ships with a maquette template and a react template.

The default template is specifically for the Maquette hyperscript implementation. Meaning it outputs a ts file that expects maquette to be available for import, so you will need 'maquette' in your project as a dependency. I'm mostly developing on the react template now and don't plan on using maquette in future projects.

## Other Options

`-w` watches for file changes.

`-o` which will overwrite the original css file, and includes the `postcss-import` plugin.

`-p` or `--purge` flag will allow the use of purgecss (must also be configured in postcss.config.js) for production builds.

## React Template Features

Outputs `React.createElement` functions. Also includes several helpful utility functions in the output class like:

### Display Utils

`.hide(value: Boolean)` and `.show(value: Boolean)` which add `display: none` and `display: inherit` based on the passed boolean value.

### Inject Props

Normally all props that you might use in react have to be passed into the final `.h()` function call as the first argument. Sometimes you need to insert some props to a reusable instance of a BaseStyles class, and then add styles to that class later. The `.injectProps` function helps with this.

Here's an example of using it to create a reusable button abstraction that can be rendered as either an `<a>` or `<button>`.

```ts
export default class Button {
  constructor(private tag: string = "a") {}
  private selector = $$(
    this.tag
  ).py_1.px_3.roundedSm.flex.justifyAround.capitalize.cursorPointer.selectNone.ringBlue_200.toSelector();

  get primary(): BaseStyles {
    return $$(this.selector).injectProps(
      this.tag === "a" ? { href: "#void" } : {}
    ).bgBlue_600.hoverBgBlue_800.border.borderBlue_900.textWhite;
  }

  get secondary(): BaseStyles {
    return $$(this.selector).injectProps(
      this.tag === "a" ? { href: "#void" } : {}
    ).bgBlue_200.border.borderBlue_400.hoverBgBlue_600.textBlue_900
      .hoverTextWhite;
  }
  get tertiary(): BaseStyles {
    return $$(this.selector).injectProps(
      this.tag === "a" ? { href: "#void" } : {}
    ).bgGray_200.border.borderBlue_800.hoverBgGray_600.textBlue_900
      .hoverTextWhite;
  }
}

export const $Button = (tag?: "a" | "button"): Button => {
  return new Button(tag);
};

export const $LinkBtn = $Button("a");
export const $Btn = $Button("button");
```

### beforeClick

Similarly sometimes you want to inject certain functionality into a clickable element and still allow other developers to add their own functionality to the onClick event handler.

```ts
const trackingClicker = $.button.beforeClick((e) => {
  /*track events*/
});
```

### $onClick()

The module when generated exports several members including an '$onClick` higher order function that helps with wrapping click event functions around the basestyle class instance you provide to the following function. This style is a more expressive way to

```ts
$.div.h($onClick(() => setMyValue(""))($LinkBtn.secondary, "Clear"));
```

### $onFormSubmit()

Similar to the $onClick function this will allow you to wrap a set of elements in a `<form>` with a provided onSubmit handler with `event.preventDefault()` called first.

```ts
$formOnSubmit(() => setShowList(true)).flex.flexCol.itemsStretch.h(
  TextInput(registerField("Username")),
  TextInput(registerField("Password")),
  $Btn.primary.mt_2.h("Log In")
);
```

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
