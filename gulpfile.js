var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  connect = require('gulp-connect');

gulp.task('js', function() {
  gulp.src('./client/scripts/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('assets'))
});

gulp.task('watch', function() {
  gulp.watch('./client/scripts/*.js', ['js']);
  gulp.watch('./client/scripts/controllers/*.js', ['js']);
});

gulp.task('connect', function() {
  connect.server({
    root: './client',
    livereload: true
  })
});

gulp.task('server', function() {
  connect.server({
    root: '.',
    livereload: true
  })
});

gulp.task('serve', ['connect', 'watch']);

//gulp.task('default', ['coffee', 'js']);
