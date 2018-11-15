# frets-styles-generator

Genreates a typescript class from a given input css file. The typescript

Uses postcss under the hood.

## Installation

`npm install frets-styles-generator --save-dev`

## Usage

`node node_modules/.bin/frets-styles-generator`

The first argument you pass to the program will be the directory to scan for CSS files. It defaults to "./src" if you leave the argument out. Each CSS file that is found will be run through postcss (utilizing the [postcss-import](https://github.com/postcss/postcss-import) plugin by default) and then turned into a .ts file like [orginialFilename-styles.ts] based on the template specified. The default template is for [maquette](https://github.com/AFASSoftware/maquette) hyperscript functions.

Includes an optional watch flag `-w`.

Includes an options flag `-o` which will overwrite the original css file using the postcss-import plugin.

Used in conjunction with FRETS and/or another hyperscript implementation. This particular template is specifically for the Maquette hyperscript implementation. Meaning it outputs a ts file that expects maquette to be available for import, so you will need 'maquette' in your project as a dependency.

I find it especially useful for rapid prototyping if you point it at [BaseCSS](https://github.com/basscss/bassplate) or [tachyons](http://tachyons.io/) because then you have a chainable typescript method for every "atomic" css class.

## Custom Templates

See the [current maquette template](https://gitlab.com/FRETS/frets-styles-generator/blob/master/src/templates/maquette.ts) for an example.
