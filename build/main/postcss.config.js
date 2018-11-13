var postcss = require('postcss');
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGNzcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGNzcy5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZix1REFBdUQ7SUFDdkQsT0FBTyxFQUFFO1FBQ1AsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDckM7UUFDRCxrQkFBa0IsRUFBRSxFQUFFO1FBQ3RCLHNCQUFzQixFQUFFLEVBQUU7UUFDMUIsMkJBQTJCLEVBQUUsRUFBRTtRQUMvQixjQUFjLEVBQUUsRUFBRTtRQUNsQix3QkFBd0IsRUFBRSxFQUFFO1FBQzVCLDBCQUEwQixFQUFFLEVBQUU7UUFDOUIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsU0FBUyxFQUFFO1lBQ1QsTUFBTSxFQUFFLFNBQVM7U0FDcEI7S0FDQTtJQUNELEtBQUssRUFBRSxhQUFhO0lBQ3BCLEdBQUcsRUFBRSxNQUFNO0NBQ1osQ0FBQSJ9