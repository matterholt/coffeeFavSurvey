const gulp = require('gulp');
const sass= require('gulp-sass');
const browserSync= require('browser-sync').create();

const scssLoc = 'app/scss/**/*.scss';
const cssLoc = 'app/css';
const htmlLoc = 'app/*.html';
const jsLoc = 'app/js/**/*.js'; 

gulp.task('browserSync', ()=>{
    browserSync.init({
        server:{
            baseDir: 'app'
        },
    })
})

gulp.task('sass',()=>{
    return gulp.src(scssLoc)
    .pipe(sass())
    .pipe(gulp.dest(cssLoc))
    .pipe(browserSync.reload({
        stream: true    
    }))
})



gulp.task('watch',['browserSync','sass'],()=>{
    gulp.watch( scssLoc, ['sass']);
    gulp.watch( htmlLoc, browserSync.reload);
    gulp.watch( jsLoc, browserSync.reload)
})