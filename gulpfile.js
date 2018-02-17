const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const hash = require('gulp-hash');
const del = require('del');
const htmlreplace = require('gulp-html-replace');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const distPath = 'dist';

gulp.task('clean-dist', () => {
    return del(`${distPath}/**`);
});

let hashedCSSFilename = "";
gulp.task('minify-css', ['clean-dist'], (cb) => {
    const prefixConfig = {
        browsers: ['last 2 version']
    };
    const prefixPlugins = [
        autoprefixer(prefixConfig)
    ];
    return gulp.src('css/*.css')
        .pipe(postcss(prefixPlugins))
        .pipe(hash())
        .pipe(cleanCSS({compatibility: 'ie8'}, (details) => {
            hashedCSSFilename = details.name;
            console.log(`Emitted file: ${hashedCSSFilename
        }`);
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('emit-imgs', () => {
    return gulp.src('assets/*.png')
        .pipe(gulp.dest(distPath));
});

gulp.task('emit-html', ['minify-css', 'emit-imgs'], () => {
    return gulp.src('html/*.html')
        .pipe(htmlreplace({
            css: hashedCSSFilename
        ,
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