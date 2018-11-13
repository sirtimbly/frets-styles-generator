var postcss = require('postcss')

module.exports = {
  // parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': {
      path: ['node_modules/tachyons/src/']
    },
    'postcss-fontpath': {},
    'postcss-custom-media': {},
    'postcss-custom-properties': {},
    'postcss-calc': {},
    'postcss-color-function': {},
    'postcss-discard-comments': {},
    'autoprefixer': {},
    'cssnano': {
      preset: 'default',
  }
  },
  input: 'src/app.css',
  dir: 'dist'
}
