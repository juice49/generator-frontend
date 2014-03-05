module.exports = function(yo) {

  var devDependencies = [
    'gulp',
    'gulp-stylus',
    'gulp-autoprefixer',
    'gulp-csso',
    'gulp-uglify'
  ];

  if(yo.useJade) {
    devDependencies.push('gulp-jade');
  }

  if(yo.useLivereload) {
    devDependencies.push('gulp-livereload');
  }

  return devDependencies;

};
