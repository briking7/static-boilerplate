'use strict';

const gulp        = require('gulp');
const del         = require('del');
const util        = require('gulp-util');
const sass        = require('gulp-sass');
const prefixer    = require('gulp-autoprefixer');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
const ghPages     = require('gulp-gh-pages');
const sassGlob    = require('gulp-sass-bulk-import');
const watch       = require('gulp-watch');
const babel       = require('gulp-babel');

var paths = {
  src: { root: 'src' },
  docs: { root: 'docs' },
  init: function() {
    this.src.sass        = this.src.root + '/scss/main.scss';
    this.src.templates   = this.src.root + '/**/*.hbs';
    this.src.javascript  = [this.src.root + '/js/**/*.js', '!' + this.src.root + '/js/libs/*.js'];
    this.src.libs        = this.src.root + '/js/libs/*.js';
    this.src.images      = this.src.root + '/images/**/*.{jpg,jpeg,svg,png,gif}';
    this.src.files       = this.src.root + '/*.{html,txt}';

    this.docs.css        = this.docs.root + '/css';
    this.docs.images     = this.docs.root + '/images';
    this.docs.javascript = this.docs.root + '/js';
    this.docs.libs       = this.docs.root + '/js/libs';
    this.docs.fonts       = this.docs.root + '/fonts';

    return this;
  },
}.init();

gulp.task('serve', () => {
  browserSync.init({
    server: paths.docs.root,
    open: false,
    notify: false,

    // Whether to listen on external
    online: false,
  });
});

gulp.task('icons', function() { 
  return gulp.src('./node_modules/font-awesome/fonts/**.*') 
    .pipe(gulp.dest('docs/fonts')); 
});

gulp.task('styles', () => {
  gulp.src([paths.src.sass])
    .pipe(sassGlob())
    .on('error', util.log)
    .pipe(sass({
      outPutStyle: 'compressed',
      includePaths: [
        'node_modules/bootstrap/scss',
        'node_modules/font-awesome/scss',
        'src/scss'
      ],
    }))
    .on('error', util.log)
    .pipe(prefixer('last 2 versions'))
    .on('error', util.log)
    .pipe(gulp.dest(paths.docs.css))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Compile handlebars/partials into html
*/
gulp.task('templates', () => {
  var opts = {
    ignorePartials: true,
    batch: ['src/partials'],
  };

  gulp.src([paths.src.root + '/*.hbs'])
    .pipe(handlebars(null, opts))
    .on('error', util.log)
    .pipe(rename({
      extname: '.html',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.docs.root))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('jquery', function(){
  return gulp.src('./node_modules/jquery/dist/jquery.min.js') 
    .pipe(gulp.dest('docs/js/libs')); 
});

gulp.task('popper', function(){
  return gulp.src('./node_modules/popper.js/dist/popper.min.js') 
    .pipe(gulp.dest('docs/js/libs')); 
});


gulp.task('bootstrap-js', function(){
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js') 
    .pipe(gulp.dest('docs/js/libs')); 
});

/*
* Bundle all javascript files
*/
gulp.task('scripts', () => {
  gulp.src(paths.src.javascript)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('bundle.js'))
    .on('error', util.log)
    .pipe(uglify())
    .on('error', util.log)
    .pipe(gulp.dest(paths.docs.javascript))
    .pipe(browserSync.reload({stream: true}));

  /*
  * Uglify JS libs and move to docs folder
  */
  gulp.src([paths.src.libs])
    .pipe(uglify())
    .on('error', util.log)
    .pipe(rename({
      suffix: '.min',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.docs.libs))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', () => {
  gulp.src([paths.src.images])
    .pipe(gulp.dest(paths.docs.images));
});

gulp.task('files', () => {
  gulp.src([paths.src.files])
    .pipe(gulp.dest(paths.docs.root));
});

watch(paths.src.images, () => {
  gulp.start('images');
});

watch(paths.src.files, () => {
  gulp.start('files');
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch(paths.src.javascript, ['scripts']);
  gulp.watch(paths.src.templates, ['templates']);
});

gulp.task('deploy', () => {
  return gulp.src([paths.docs.root + '/**/*'])
    .pipe(ghPages());
});

gulp.task('default', ['watch', 'serve', 'images', 'files', 'styles', 'scripts', 'templates', 'icons', 'jquery', 'popper', 'bootstrap-js']);
