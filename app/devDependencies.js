module.exports = function(yo) {

  var devDependencies = [
    'gulp',
    'gulp-util',
    'gulp-stylus',
    'gulp-autoprefixer',
    'gulp-csso',
    'gulp-uglify',
    'http-server'
  ];

  if(yo.useJade) {
    devDependencies.push('gulp-jade');
  }

  if(yo.useLivereload) {
    devDependencies.push('gulp-livereload');
  }

  return devDependencies;

};
