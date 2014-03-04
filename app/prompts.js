module.exports = [
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
