'use strict';




var
  util = require('util'),
  path = require('path'),
  exec = require('child_process').exec,
  async = require('async'),
  yeoman = require('yeoman-generator'),
  _ = require('lodash'),
  FrontendGenerator;




FrontendGenerator = module.exports = function FrontendGenerator(args, options, config) {

	var _this = this;

  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
    	skipInstall: options['skip-install'],
    	callback: function() {
    		this.emit('dependenciesInstalled');
    	}.bind(this)
    });
  });

  this.on('dependenciesInstalled', function() {
  	async.series([grunt, gitInit]);
  });

  function grunt(cb) {
		exec('grunt', function(err, stdout, stderr) {
			if(err) console.log(err);
			if(stderr) console.log(stderr);
			if(stdout) console.log(stdout);
			cb(null);
		});
  }

	function gitInit(cb) {
		if(_this.git) {
			exec('git init && git add . && git commit -am "Initial commit"', function(err, stdout, stderr) {
				if(err) console.log(err);
				if(stderr) console.log(stderr);
				if(stdout) console.log(stdout);
				cb(null);
			});
		}
	}

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

}; util.inherits(FrontendGenerator, yeoman.generators.Base);




FrontendGenerator.prototype.askFor = function askFor() {

  var
    _this = this,
    cb = this.async();

  console.log(this.yeoman);

  var prompts = [
    {
      name: 'projectName',
      message: 'What would you like to call this project?',
      default: 'My Awesome Project'
    },
    {
      name: 'useJade',
      type: 'confirm',
      message: 'Would you like to use Jade?',
      default: false
    },
    {
      name: 'useJquery',
      type: 'confirm',
      message: 'Would you like to use jQuery?',
      default: false
    },
    {
      when: function(res) {
        return res.useJquery;
      },
      name: 'jQueryVersion',
      message: 'What version of jQuery?',
      default: '1.10.2'
    },
    {
      name: 'autoprefixerVersions',
      message: 'How many browser versions back should Autoprefixer patch for?',
      default: 2
    },
    {
      name: 'useLivereload',
      message: 'Would you like to use live reload?',
      default: true
    },
    {
      when: function(res) {
        return res.useLivereload
      },
      name: 'livereloadPort',
      message: 'What port should live reload use?',
      default: 35729
    },
    {
      name: 'git',
      message: 'Would you like me to initialise a git repository?',
      default: true
    }
  ];

  this.prompt(prompts, function(props) {

    _(props).forEach(function(value, prop) {
      _this[prop] = value;
    });

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
  this.template('_gruntfile.js', 'gruntfile.js');
  this.copy('gitignore', '.gitignore');
  this.copy('bowerrc', '.bowerrc');
  this.copy('css/app.styl', 'css/app.styl');
  this.copy('css/dependencies.styl', 'css/dependencies.styl');
  this.copy('css/styleguide.styl', 'css/styleguide.styl');
  this.copy('js/app.js', 'js/app.js');

  if(this.useJade) {
    this.template('views/layouts/_base.jade', 'views/layouts/base.jade');
    this.template('views/_index.jade', 'views/index.jade');
  } else {
    this.template('views/_index.html', 'index.html');
  }

};