var
  util = require('util'),
  git = require('gift'),
  async = require('async'),
  yeoman = require('yeoman-generator'),
  prompts = require('./prompts'),
  dependencies = require('./dependencies'),
  devDependencies = require('./devDependencies'),
  _ = require('lodash');




/**
 * Frontend Generator
 */
var FrontendGenerator = module.exports = function(args, options, config) {

	var _this = this;

  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    async.parallel([
      function(cb) {
        return _this.npmInstall(devDependencies, { 'save-dev': true }, cb);
      },
      function(cb) {
        return _this.npmInstall(dependencies, { save: true }, cb);
      }
    ], function() {
      _this.emit('dependenciesInstalled');
    });
  });

  this.on('dependenciesInstalled', function() {
    if(_this.git) {
      gitInit();
    }
  });

};

util.inherits(FrontendGenerator, yeoman.generators.Base);




/**
 * Ask For
 */
FrontendGenerator.prototype.askFor = function() {

  var
    _this = this,
    cb = this.async();

  console.log(this.yeoman);

  this.prompt(prompts, function(props) {

    _(props).forEach(function(value, prop) {
      _this[prop] = value;
    });

    cb();

  });

};




/**
 * Project Files
 *
 * Create directory structure for project and copy files.
 */
FrontendGenerator.prototype.projectfiles = function() {

  this.mkdir('js');
  this.mkdir('css');
  this.mkdir('img');
  this.mkdir('components');
  this.mkdir('build');

  this.template('package.json');
  this.copy('gitignore', '.gitignore');
  this.copy('css/app.styl');
  this.copy('css/dependencies.styl');
  this.copy('js/app.js');

  if(this.useJade) {
    this.mkdir('views');
    this.mkdir('views/layouts');
    this.template('views/partials/html.jade');
    this.template('views/layouts/base.jade');
    this.template('views/index.jade');
  } else {
    this.template('views/index.html');
  }

};




/**
 * Git Init
 *
 * Init repo in current directory
 * Add all files
 * Commit `Initial`
 */
function gitInit() {
  git.init('./', function(err, repo) {
    async.series([
      function(cb) {
        return repo.add('.', cb);
      },
      function(cb) {
        repo.commit('Initial', { all: true });
        return cb();
      }
    ]);
  });
}
