var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  plumber = require('gulp-plumber'),
  jade = require('gulp-jade'),
  stylus = require('gulp-stylus'),
  livereload = require('gulp-livereload'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  browserify = require('browserify'),
  es6ify = require('es6ify'),
  uglify = require('gulp-uglify'),
  httpServer = require('http-server'),
  config = {},
  paths = {};



config = {
  livereloadPort: <%= livereloadPort %>,
  httpPort: <%= httpPort %>
};



paths = {
  build: './build/'
};



function errorHandler() {
  return plumber({
    errorHandler: function(err) {
      gutil.beep();
      gutil.log(gutil.colors.red(err));
      this.emit('end');
    }
  });
}



gulp.task('watch', ['default', 'serve'], function() {
  
  var lr, lrWatcher;
  
  // Watch source files to trigger build
  gulp.watch('css/**/*', ['css']);
  gulp.watch('js/**/*', ['js']);
  gulp.watch('views/**/*', ['html']);
  
  // Watch built files to trigger livereload
  lr = livereload(config.livereloadPort);
  lrWatcher = gulp.watch(['build/**', '*.html']);

  lrWatcher.on('change', function(file) {
    lr.changed(file.path);
  });

});



gulp.task('serve', function() {

  var server = httpServer.createServer({ root: './' });

  server.listen(config.httpPort, '0.0.0.0', function() {
    gutil.log('HTTP server running on:', gutil.colors.cyan(config.httpPort));
  });

});



gulp.task('css', function() {
  
  var stylusConfig = {
    paths: ['node_modules', 'css'],
    set: ['include css']
  };
  
  return gulp.src('css/app.styl')
    .pipe(errorHandler())
    .pipe(stylus(stylusConfig))
    .pipe(autoprefixer('last <%= autoprefixerVersions %> version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(csso())
    .pipe(gulp.dest(paths.build));
    
});



gulp.task('js', function() {

	var bundle = browserify()
    .add(es6ify.runtime)
    .transform(es6ify)
    .require(require.resolve('./js/index.js'), { entry: true })
    .bundle();

	bundle.on('error', function(err) {
		gutil.beep();
		gutil.log(gutil.colors.red(err));
		this.emit('end');
	});

	return bundle
		.pipe(source('index.js'))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(paths.build));

});



gulp.task('html', function() {
  return gulp.src('./views/*.jade')
    .pipe(errorHandler())
    .pipe(jade())
    .pipe(gulp.dest('./'));
});



gulp.task('default', ['css', 'js', 'html']);