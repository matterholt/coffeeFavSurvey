//Gulp.js configuration
//https://www.sitepoint.com/introduction-gulp-js/

const
    //modules
    gulp = require('gulp'),
    //images
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin'),
    //HTML
    htmlclean = require('gulp-htmlclean'),
    //JS
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    //CSS
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),
    //browser reload
    browserSync = require('browser-sync').create();

    //development mode?
    devBuild = (process.env.NODE_ENV !== 'production'),

    //folders
    folder = {
        src: 'src/', 
        build: 'build/'
    };

gulp.task('browserSync',()=>{
    browserSync.init({
        server:{
            baseDir: 'folder.build/html'
        },
    })
})



//image processing
gulp.task('images',()=>{
    var out = folder.build + 'images/'

    return gulp.src(folder.src + 'images/**/*')
        .pipe(newer(out))
        .pipe(imagemin({ optimizationLevel: 5}))
        .pipe(gulp.dest(out));
})

//HTML processing
gulp.task('html',['images'], ()=>{
    var 
        out = folder.build + 'html/'
        page = gulp.src(folder.src + 'html/**/*')
        .pipe(newer(out));

        //minify production code

        if (!devBuild) {
            page = page.pipe(htmlclean());
        }

        return page.pipe(gulp.dest(out));
});

//JavaScript processing
gulp.task('js', ()=>{
    
    var jsbuild = gulp.src(folder.src + 'js/**/*')
    .pipe(deporder())
    .pipe(concat('main.js'));

    if(!devBuild) {
        jsbuild = jsbuild
        .pipe(stripdebug())
        .pipe(uglify());
    }
});

//CSS processing
gulp.task('css',['images'], ()=>{

    var postCssOpts = [
        assets({ loadPaths: ['images/']}),
        autoprefixer({ browsers: ['last 2 version', '>2%']}),
        mqpacker
    ];

    if (!devBuild) {
        postCssOpts.push(cssnao);
    }

    return gulp.src(folder.src + 'scss/main.scss')
      .pipe(sass({
          outputStyle: 'nested',
          imagePath: 'images/',
          precision: 3,
          errLogToConsole: true
      }))
      .pipe(postcss(postCssOpts))
      .pipe(gulp.dest(folder.build + 'css/'))
//code added for
      .pipe(browserSync.stream());
});


//Run all task
gulp.task('run',['browserSync', 'html','css','js']);

//watch for changes
gulp.task('watch',()=>{
//image changes
    gulp.watch(folder.src + 'images/**/*', ['images']);
//html changes
    gulp.watch(folder.src + 'html/**/*', ['html']);
//javascript changes
    gulp.watch(folder.src + 'js');
//css changes
    gulp.watch(folder.src + 'scss/**/*', ['css']);

});

//gulp default task
gulp.task('default',['run', 'watch']);






//npm install gulp-deporder gulp-concat gulp-strip-debug gulp-uglify --save-dev

/*
CSS
    postcss-assets to manage assets. This allows us to use properties such as background: resolve('image.png'); to resolve file paths or background: inline('image.png'); to inline data-encoded images.
    autoprefixer to automatically add vendor prefixes to CSS properties.
    css-mqpacker to pack multiple references to the same CSS media query into a single rule.
    cssnano to minify the CSS code when running in production mode.
 */