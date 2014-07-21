module.exports = function(yo) {
  
  var dependencies = [
    'gulp',
    'gulp-util',
    'gulp-plumber',
    'vinyl-source-stream',
    'vinyl-transform',
    'pretty-hrtime',
    'gulp-livereload',
    'gulp-stylus',
    'gulp-autoprefixer',
    'gulp-csso',
    'watchify',
    'exorcist',
    'gulp-uglify',
    'http-server',
    'gulp-livereload'
  ];
  
  if(yo.useEs6ify) {
    dependencies.push('es6ify');
  }
  
  if(yo.useJade) {
    dependencies.push('gulp-jade');
  }
  
  return dependencies;
  
};