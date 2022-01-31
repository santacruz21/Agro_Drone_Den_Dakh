const { dest } = require('gulp');
const gulp = require('gulp');
const terser = require('gulp-terser')
const deleted = require("gulp-deleted")

const html = function() {
    return gulp.src('./source/index.html').pipe(gulp.dest("./build/"));
}

const js = function() {
    return gulp.src("./source/js/script.js")
    .pipe(terser())
    .pipe(gulp.dest("./build/js"))
}
 
const clean = function() {
    return gulp.src('./source').pipe
     deleted({dest: "./build", patterns: ["**/**"]}).pipe(gulp.dest)
}
exports.html = html
exports.js = js
exports.clean = clean
exports.build = gulp.series(clean,html, js)