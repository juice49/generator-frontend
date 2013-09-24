'use strict';




var
  util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  FrontendGenerator;




FrontendGenerator = module.exports = function FrontendGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

util.inherits(FrontendGenerator, yeoman.generators.Base);




FrontendGenerator.prototype.askFor = function askFor() {

  var cb = this.async();

  console.log(this.yeoman);

  var prompts = [
    {
      name: 'projectName',
      message: 'What would you like to call this project?'
    },
    {
      name: 'useJade',
      type: 'confirm',
      message: 'Would you like to use Jade?',
      default: true
    },
    {
      name: 'useJquery',
      type: 'confirm',
      message: 'Would you like to use jQuery?',
      default: false
    }
  ];

  this.prompt(prompts, function(props) {
    this.projectName = props.projectName;
    this.useJade = props.useJade;
    this.useJquery = props.useJquery;
    cb();
  }.bind(this));

};




FrontendGenerator.prototype.app = function app() {

  this.mkdir('js');
  this.mkdir('css');
  this.mkdir('img');
  this.mkdir('components');
  this.mkdir('build');

  if(this.useJade) {
    this.mkdir('views');
    this.mkdir('views/layouts');
  }

};




FrontendGenerator.prototype.projectfiles = function projectfiles() {

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.copy('gitignore', '.gitignore');
  this.copy('bowerrc', '.bowerrc');

  if(this.useJade) {
    this.template('_base.jade', 'views/layouts/base.jade');
  } else {
    this.template('_index.html', 'index.html');
  }

};