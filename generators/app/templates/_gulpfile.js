'use strict'

var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    minify      = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    plumber     = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    neat        = require('node-neat').includePaths,
    fs          = require('fs'),
    run         = require('gulp-run'),
    runSequence = require('run-sequence');

// Helper functions.
function isDirectory(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  }
  catch (err) {
    return false;
  }
}

//////////////////////////////
// PATHS
//////////////////////////////
var path = {
  sassWatch: [
    'assets/scss/*.scss',
    'assets/scss/**/*.scss',
    'pattern-lab-source/**/*.scss'
  ],
  sass_src_S: 'assets/scss/style.scss',
  sass_src_P: 'assets/scss/print.scss',
  sass_dest: 'dist/css',
  js_lint_src: [
      'dist/js/*.js'
  ],
  js_src : [
      'assets/js/*.js'
  ],
  js_dest : 'dist/js/'
};

//////////////////////////////
// BrowserSync
//////////////////////////////
gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        proxy: "<%= projectHost %>",
        notify: false
    });
});

gulp.task('bs-reload', function (){
    browserSync.reload();
});

//////////////////////////////
// JS Tasks
//////////////////////////////
gulp.task('js', function () {
    gulp.src(path.js_src)
        .on('error',console.log.bind(console))
        .pipe(uglify())
        .on('error',console.log.bind(console))
        .pipe(concat('main.js'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/js'))
        .on('error',console.log.bind(console));
});

//////////////////////////////
// SASS Tasks
//////////////////////////////
gulp.task('sass', function(){
    gulp.src(path.sass_src_S)
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .on('error',console.log.bind(console))
        .pipe(minify())
        .on('error',console.log.bind(console))
        .pipe(concat('style.css'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .on('error',console.log.bind(console));
    gulp.src(path.sass_src_P)
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .on('error',console.log.bind(console))
        .pipe(minify())
        .on('error',console.log.bind(console))
        .pipe(concat('print.css'))
        .on('error',console.log.bind(console))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .on('error',console.log.bind(console));
});

//////////////////////////////
// SPRITE Tasks
//////////////////////////////
gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/img/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../img/sprite.png'
  })).on('error',console.log.bind(console));
  spriteData.img.pipe(gulp.dest('dist/img/')).on('error',console.log.bind(console));
  spriteData.css.pipe(gulp.dest('assets/scss/config/')).on('error',console.log.bind(console));
});

//////////////////////////////
// Images Task
//////////////////////////////
var allowedFiles = [
  'assets/img/*.png',
  'assets/img/*.jpg',
  'assets/img/*.jpeg',
  'assets/img/*.gif',
  'assets/img/*.svg'
];
gulp.task('images', function () {
  var spriteData = gulp.src(allowedFiles)
  .pipe(gulp.dest('dist/img/')).on('error',console.log.bind(console));
});

//////////////////////////////
// Font Task
//////////////////////////////
gulp.task('fonts', function () {
    gulp.src(['assets/fonts/*']).pipe(gulp.dest('dist/fonts'))
});

//////////////////////////////
// Watch Tasks
//////////////////////////////
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(path.js_src, ['js']).on('error',console.log.bind(console));
    gulp.watch(path.sassWatch, ['sass-change']).on('error',console.log.bind(console));
    gulp.watch('assets/img/sprite/*.*', ['sprite']).on('error',console.log.bind(console));
    gulp.watch('dist/js/*.*').on('change', browserSync.reload);
    gulp.watch(['pattern-lab-source/_patterns/**/*.twig', 'pattern-lab-source/_patterns/**/*.json'], ['patterns-change']);
});

//////////////////////////////
//Default Tasks
//////////////////////////////
gulp.task('default', [
    'js',
    'watch',
    'sprite',
    'images',
    'fonts',
]);

//////////////////////////////
/// BUILD TASK FOR JENKINS
//////////////////////////////
gulp.task('build', [
    'sass',
    'js',
    'sprite',
    'images',
    'fonts'
]);

/**
 * Task sequence to run when Sass files have changed.
 */
gulp.task('sass-change', function () {
  runSequence('sass', 'patterns-change');
});

/**
 * Task sequence to run when StarterKit pattern files have changed.
 */
gulp.task('patterns-change', function () {
  runSequence('pl:generate', 'bs-reload');
});

/**
 * Generates Pattern Lab front-end.
 */
gulp.task('pl:generate', function () {
  if (isDirectory('./pattern-lab')) {
    return run('php ./pattern-lab/core/console --generate').exec();
  }
});
