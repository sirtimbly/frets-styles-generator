# frets-styles-generator

Genreates a typescript class from a given input css file.

Uses postcss under the hood.

Includes an optional watch flag `-w`.

Used in conjunction with FRETS and/or a hyperscript implementation. This particular template is specifically for the Maquette hyperscript implementation. Meaning it outputs a ts file that expects maquette to be available for import, so you will need 'maquette' in your project as a dependency.

I find it especially useful for rapid prototyping if you point it at [BaseCSS](https://github.com/basscss/bassplate) or [tachyons](http://tachyons.io/) because then you have a chainable typescript method for every "atomic" css class.
