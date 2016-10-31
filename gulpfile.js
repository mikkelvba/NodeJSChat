(function () {
    'use strict';
    var gulp = require('gulp'),
        plumber = require('gulp-plumber'),
        rename = require('gulp-rename');
    var autoprefixer = require('gulp-autoprefixer');
    var babel = require('gulp-babel');
    var jshint = require('gulp-jshint');
    var imagemin = require('gulp-imagemin'),
        cache = require('gulp-cache');
    var sass = require('gulp-sass');
    var browserSync = require('browser-sync');
    var nodemon = require('gulp-nodemon');
    var uglify = require('gulp-uglify');
    var cssmin = require('gulp-cssmin');
    var beautify = require('gulp-beautify');

    gulp.task('images', function(){
        gulp.src('src/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('static/img/'));
    });

    gulp.task('styles', function(){
        gulp.src(['src/styles/**/*.sass'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
            .pipe(sass())
            .pipe(autoprefixer('last 2 versions'))
            .pipe(cssmin())
            .pipe(gulp.dest('static/css/'));
    });

    gulp.task('scripts', function(){
        return gulp.src('src/js/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
            .pipe(jshint())
            .pipe(beautify({indentSize: 2}))
            .pipe(jshint.reporter('default'))
            .pipe(babel())
            .pipe(uglify())
            .pipe(gulp.dest('static/js/'));
    });

    // Tjek App for fejl
    gulp.task('hint', function(){
        return gulp.src('app/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
            .pipe(jshint())
            .pipe(beautify({indentSize: 2}))
            .pipe(jshint.reporter('default'));
    });

    gulp.task('default', function(){
        gulp.watch('src/styles/**/*.sass', ['styles']);
        gulp.watch('src/js/**/*.js', ['scripts']);
    });

    // [Frontend] Gulp watch køres under udvikling - Img/Sass eksport
    gulp.task('watch', function(){
        gulp.watch('src/styles/**/*.sass', ['styles']);
        gulp.watch('src/js/**/*.js', ['scripts']);
        nodemon({
            script: 'server.js', 
            ext: 'js html'
        });
        browserSync.init(null, {
            proxy: "http://localhost:3000",
            files: ["public/**/*.*"],
            browser: "google chrome",
            port: 7000,
        });
    });
}());
