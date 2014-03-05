var
  gulp = require('gulp'),<% if(useJade) { %>
  jade = require('gulp-jade'),
  <% } %>stylus = require('gulp-stylus'),<% if(useLivereload) { %>
  livereload = require('gulp-livereload'),
  <% } %>
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  uglify = require('gulp-uglify');

gulp.task('default', function() {

  var watchers = [
    gulp.watch('css/**/*', ['css']),
    gulp.watch('js/**/*', ['js']),
    gulp.watch('views/**/*', ['html'])
  ];
  <% if(useLivereload) { %>
  var server = livereload();

  watchers.forEach(function(watcher) {
    watcher.on('change', function(file) {
      server.changed(file.path);
    });
  });
<% } %>
});

gulp.task('css', function() {
  return gulp.src('css/app.styl')
    .pipe(stylus({
        paths: ['node_modules', 'css'],
        'include css': true
    }))
    .pipe(autoprefixer('last <%= autoprefixerVersions %> version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(csso())
    .pipe(gulp.dest('./build/'));
});

gulp.task('js', function() {
  return gulp.src('js/app.js')
    .pipe('uglify')
    .pipe(gulp.dest('./build/'));
});

<% if(useJade) { %>gulp.task('html', function() {
  return gulp.src('views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'));
});<% } %>
