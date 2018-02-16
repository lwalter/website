const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const hash = require('gulp-hash');
const del = require('del');
const htmlreplace = require('gulp-html-replace');

gulp.task('clean-dist', () => {
    return del('dist/**');
});

let hashedFilename = "";
gulp.task('minify-css', ['clean-dist'], (cb) => {
    return gulp.src('css/*.css')
        .pipe(hash())
        .pipe(cleanCSS({compatibility: 'ie8'}, (details) => {
            hashedFilename = details.name;
            console.log(`Emitted file: ${hashedFilename}`);
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('emit-html', ['minify-css'], () => {
    console.log(hashedFilename);
    return gulp.src('html/index.html')
        .pipe(htmlreplace({
            css: hashedFilename
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['emit-html'])