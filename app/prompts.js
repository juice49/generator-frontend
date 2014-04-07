module.exports = [
  {
    name: 'projectName',
    message: 'What would you like to call this project?',
    default: 'My Awesome Project'
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
    name: 'httpPort',
    message: 'What port should the development server use?',
    default: 1337
  },
  {
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