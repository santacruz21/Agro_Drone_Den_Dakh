const { src, dest, series, watch } = require('gulp');
const gulp = require('gulp');
const terser = require('gulp-terser')
const deleted = require("gulp-deleted")
const sourcemaps = require ('gulp-sourcemaps')
const csso = require('gulp-csso')
const sass =require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename') 
const plumber = require('gulp-plumber')
const imagemin = require('gulp-imagemin')
const svgstore = require('gulp-svgstore')
const server = require('browser-sync')

const pipeline = require('readable-stream').pipeline
const uglify = require('gulp-uglify-es').default
const del = require('del');
const { notify } = require('browser-sync');


const html = function() {
    return gulp.src('./source/index.html').pipe(gulp.dest("./build/"));
}

// const js = function() {
//     return gulp.src("./source/js/script.js")
//     .pipe(terser())
//     .pipe(gulp.dest("./build/js"))
// }   

 
// const clean = function() {
//     return gulp.src('./source').pipe(deleted({dest: "./build", patterns: ["**/**"]}))
//      .pipe(gulp.dest)
// }

function css () {
    return src('source/scss/style.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(csso())
        .pipe(autoprefixer())
        .pipe(rename('style.min.scss'))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('build/css'))
    } 
function cssNomin () {
    return src('./source/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass()) 
        .pipe(autoprefixer())
        .pipe(dest('build/css'))
    } 

function images () {
    return src('./sourse/img/**/*.{jpg,jpeg,png}')
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.mozjpeg({progressive: true})
    ])).pipe(dest('build/img'))   
}

function sprite() {
    return src('./source/img/icon-*.svg')
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(svgstore({
        inlineSvg: true
        }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'))
    }

function js() {
    return pipeline(
        src('./source/js/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write("."),
        rename({suffix: ".min"}),
        dest("build/js")
    )
}

function serve (){
    server.init({
        server: 'build/',
        notify: false,
        open: true,
        cors: true,
        ui: false
    })
    watch('./source/scss/**/*scss', series(css, cssNomin, refresh))
    watch('source/*.html', series(html,refresh))
}

function refresh (done){
    server.reload()
    done() 
}
 
function copy() { 
    return src([
        './source/fonts/**/*',
        './source/*.ico'
    ],{
        base: 'source'
    })
    .pipe(dest('build'))
    }

function clean() {
    return del('build')
}


exports.html = html 
exports.clean = clean
exports.css = css
exports['css-nomin'] = cssNomin 
exports.images = images 
exports.js = js
exports.serve = serve
exports.build = gulp.series(clean,html, js)
exports.start = series(
    clean,
    images,
    copy,
    html,
    css,
    cssNomin,
    sprite,
    js,
    serve
)