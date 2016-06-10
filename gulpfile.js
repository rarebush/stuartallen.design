var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var browserSync = require('browser-sync');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var pages = require('./app/data/pages.json');

var paths = {
    scripts: 'app/scripts/**/*'
    , images: 'app/images/**/*'
    , scss: 'app/scss/**/*.scss'
    , partials: 'app/partials/**/*'
    , templates: 'app/templates/**/*'
    , data: 'app/data/pages.json'
    , html: 'app/**/*.html'
    , fonts: 'app/fonts/**/*'
    , videos: 'app/videos/**/*'
    , resources: 'app/resources/**/*'
    , destination: 'dist'
};

var pathsDist = {
    scripts: 'dist/scripts/**/*'
    , images: 'dist/images/**/*'
    , css: 'dist/css/**/*'
    , html: 'dist/**/*.html'
    , fonts: 'dist/fonts/**/*'
    , destination: 'dist'
}

// clean
gulp.task('clean', function (cb) {
    del([paths.destination], cb);
});
// styles
gulp.task('styles', function () {
    return sass('app/scss/styles.scss')
        .pipe(autoprefixer('last 1 version'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({
            stream: true
        }));
});
// scripts
gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest('dist/scripts'));
});
// images
gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'));
});
// videos
gulp.task('videos', function () {
    return gulp.src(paths.videos)
        .pipe(gulp.dest('dist/videos'));
});
// resources
gulp.task('resources', function () {
    return gulp.src(paths.resources)
        .pipe(gulp.dest('dist/resources'));
});
// fonts
gulp.task('fonts', function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});
// create templates with handlebars
gulp.task('handlebars', function () {

    // handlebars compile

    options = {
        batch: ['./app/partials']
        , compile: {
            noEscape: true
        }
    }

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i]
            , fileName = page.pageId.replace(/ +/g, '-').toLowerCase();

        gulp.src(paths.templates)
            .pipe(handlebars(page, options))
            .pipe(rename(fileName + ".html"))
            .pipe(gulp.dest('./dist'));
    }

});

// build site in dist
gulp.task('build', ['handlebars', 'scripts', 'images', 'videos', 'resources', 'fonts', 'styles']);

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', ['build'], function () {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
    // styles watch
    gulp.watch(paths.scss, ['styles']);
    // scripts watch
    gulp.watch(paths.scripts, ['scripts']);
    // images watch
    gulp.watch(paths.images, ['images']);
    // videos watch
    gulp.watch(paths.videos, ['videos']);
    // resources watch
    gulp.watch(paths.resources, ['resources']);
    // build html watch
    gulp.watch([paths.partials, paths.templates, paths.data], ['handlebars']);
    // watch everything else
    gulp.watch([pathsDist.html, pathsDist.images, pathsDist.scripts, pathsDist.fonts], reload);
});