const { series, src, dest } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const hash = require('gulp-hash');
const del = require('del');
const htmlreplace = require('gulp-html-replace');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const distPath = 'dist';

function cleanDist() {
    return del(`${distPath}/**`);
}

let hashedCSSFilename = "";
function minifyCSS() {
    const prefixConfig = {
        browsers: ['last 2 version']
    };
    const prefixPlugins = [
        autoprefixer(prefixConfig)
    ];
    return src('css/*.css')
        .pipe(postcss(prefixPlugins))
        .pipe(hash())
        .pipe(cleanCSS({compatibility: 'ie8'}, (details) => {
            hashedCSSFilename = details.name;
            console.log(`Emitted file: ${hashedCSSFilename}`);
        }))
        .pipe(dest(distPath));
}
function emitImgs() {
    return src('assets/*')
        .pipe(dest(distPath));
}
function emitHTML(cb) {
    return src('html/*.html')
        .pipe(htmlreplace({
            css: hashedCSSFilename,
            ghImg: {
                src: 'github-green.png',
                tpl: '<img src="%s" alt="My Github" />'
            },
            liImg: {
                src: 'linkedin-green.png',
                tpl: '<img src="%s" alt="My LinkedIn" />'
            },
            me: {
                src: 'me-1.jpg',
                tpl: '<img class="hide-lte-749" style="align-self:center;" src="%s" alt="Me" />'
            }
        }))
        .pipe(dest(distPath));
}
exports.default = series(cleanDist, minifyCSS, emitImgs, emitHTML);
