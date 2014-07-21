var
  path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  transform = require('vinyl-transform'),
  prettyTime = require('pretty-hrtime'),
  //streamify = require('gulp-streamify'),
  plumber = require('gulp-plumber'),<% if(useJade) { %>
  jade = require('gulp-jade'),<% } %>
  stylus = require('gulp-stylus'),
  csso = require('gulp-csso'),
  livereload = require('gulp-livereload'),
  autoprefixer = require('gulp-autoprefixer'),
  watchify = require('watchify'),
  exorcist = require('exorcist'),<% if(useEs6ify) { %>
  es6ify = require('es6ify'),<% } %>
  // uglifify
  httpServer = require('http-server'),
  config = {},
  paths = {};



function browserify(file, outputFile, add) {

	var bundler, basename, shim;

	if(outputFile instanceof Array) {
		add = outputFile.slice();
		outputFile = undefined;
	}

	add = add || [];
	basename = path.basename(file);
	outputFile = outputFile || basename;

	/*shim = browserifyGlobalShim.configure({
		jquery: 'jQuery'
	});*/

	bundler = watchify()
		//.add(es6ify.runtime)
		.add(add)
		//.transform(es6ify)
		.require(require.resolve(file), { entry: true })
		//.transform({ global: true }, uglifyify)
		//.transform({ global: true }, shim)
		.on('update', rebundle);

	function exorcise(filename) {
		return exorcist(paths.build + path.basename(filename) + '.map');
	}

	function rebundle() {

		var start = new process.hrtime();

		return bundler.bundle({ debug: true })
      .on('error', function(e) {
        gutil.beep();
        gutil.log(gutil.colors.red('Browserify Error'), e);
      })
			.pipe(source(outputFile))
			.pipe(transform(exorcise))
			.pipe(gulp.dest(paths.build))
			.on('end', function() {
				//var duration = (new Date() - startDate) + ' ms';
        var duration = prettyTime(process.hrtime(start));
				gutil.log('Browserified', '\'' + gutil.colors.cyan(file) + '\'', ' -> \'' + gutil.colors.cyan('./build/' + outputFile) + '\' after', gutil.colors.magenta(duration));
			});

	}

	return rebundle();

}



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
  gulp.watch('views/**/*', ['html']);
  
  // Watch built files to trigger livereload
  lr = livereload(config.livereloadPort);
  lrWatcher = gulp.watch([paths.build + '/**', '*.html']);

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
    'include css': true
  };
  
  return gulp.src('css/app.styl')
    .pipe(errorHandler())
    .pipe(stylus(stylusConfig))
    .pipe(autoprefixer('last <%= autoprefixerVersions %> version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(csso())
    .pipe(gulp.dest(paths.build));
    
});



gulp.task('app.js', function() {
  return browserify('./js/app.js');
});



/*gulp.task('js', function() {

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

});*/


<% if(useJade || useExpandobem) { %>gulp.task('html', function() {
  return gulp.src('./views/*.jade')<% if(useJade) { %>
    .pipe(errorHandler())
    .pipe(jade())<% } if(useExpandobem) { %>
    .pipe(transform(expandobem.processStream))<% } %>
    .pipe(gulp.dest('./'));
});<% } %>



gulp.task('default', ['app.js', 'css'<% if(useJade || useExpandobem) { %>, 'html'<% } %>]);