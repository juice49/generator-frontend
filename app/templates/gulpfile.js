var
  gulp = require('gulp'),
  gutil = require('gulp-util'),<% if(useJade) { %>
  jade = require('gulp-jade'),
  <% } %>stylus = require('gulp-stylus'),<% if(useLivereload) { %>
  livereload = require('gulp-livereload'),
  <% } %>
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  uglify = require('gulp-uglify'),
  httpServer = require('http-server');

gulp.task('default', ['css', 'js', 'html']);

gulp.task('watch', function() {

  gulp.watch('css/**/*', ['css']);
  gulp.watch('js/**/*', ['js']);
  gulp.watch('views/**/*', ['html']);

  gutil.log('Watching files...');
  <% if(useLivereload) { %>
  var
    lrWatcher = gulp.watch(['build/**', '*.html']),
    server = livereload(<%= livereloadPort %>);

  lrWatcher.on('change', function(file) {
    server.changed(file.path);
  });
  <% } %>
  httpServer.createServer({ root: './' })
    .listen(1337, '0.0.0.0', function() {
      gutil.log('HTTP server running on:', gutil.colors.cyan('1337'));
    });

});

gulp.task('css', function() {
  return gulp.src('css/app.styl')
    .pipe(stylus({
      paths: ['node_modules', 'css'],
      set: ['include css']
    }))
    .pipe(autoprefixer('last <%= autoprefixerVersions %> version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(csso())
    .pipe(gulp.dest('./build/'));
});

gulp.task('js', function() {
  return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});

<% if(useJade) { %>gulp.task('html', function() {
  return gulp.src('views/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./'));
});<% } %>
