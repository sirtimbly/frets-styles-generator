# frets-styles-generator

Genreates a typescript class from a given input css file. 

Uses postcss under the hood.

Includes an optional watch flag `-w`.

Used in conjunction with FRETS and/or a hyperscript implementation like maquette. The current template outputs a ts file that expects maquette to be available, so you will need that in your project package.json as a dependency.

I find it especially useful if you point it at [BaseCSS](https://github.com/basscss/bassplate) or [tailwind](https://tailwindcss.com/).
