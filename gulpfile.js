const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const hash = require('gulp-hash');
const del = require('del');
const htmlreplace = require('gulp-html-replace');

const distPath = 'dist';

gulp.task('clean-dist', () => {
    return del(`${distPath}/**`);
});

let hashedFilename = "";
gulp.task('minify-css', ['clean-dist'], (cb) => {
    return gulp.src('css/*.css')
        .pipe(hash())
        .pipe(cleanCSS({compatibility: 'ie8'}, (details) => {
            hashedFilename = details.name;
            console.log(`Emitted file: ${hashedFilename}`);
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('emit-imgs', () => {
    return gulp.src('assets/*.png')
        .pipe(gulp.dest(distPath));
});

gulp.task('emit-html', ['minify-css', 'emit-imgs'], () => {
    return gulp.src('html/index.html')
        .pipe(htmlreplace({
            css: hashedFilename,
            ghImg: {
                src: 'github.png',
                tpl: '<img src="%s" alt="My Github" />'
            },
            liImg: {
                src: 'linkedin.png',
                tpl: '<img src="%s" alt="My LinkedIn" />'
            },
            me: {
                src: 'me-rect.png',
                tpl: '<img class="hide-lte-749" style="align-self:center;" src="%s" alt="Me" />'
            }
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('default', ['emit-html'])