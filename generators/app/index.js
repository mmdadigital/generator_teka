'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var exec = require('sync-exec');
var _s = require('underscore.string');
var fs = require('fs');

var baseThemeList = {name: "TEKA", value: "teka", generator: "drupal-theme:teka" };

var TekaThemeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../../package.json');

    this.on('end', function () {
      //////////////////////////////
      // Move Yo Storage
      //////////////////////////////
      fs.renameSync('../.yo-rc.json', '.yo-rc.json');

      //////////////////////////////
      // If the --git flag is passed, initialize git and add for initial commit
      //////////////////////////////
      ///
      /*
      exec('git init');
      exec('git add . && git commit -m "Teka Generation"');
      */
    });
  }
});

TekaThemeGenerator.prototype.askForBase = function () {
  var cb = this.async();
  // Have Yeoman greet the user.
  this.log(yosay('Welcome to TEKA\'s theme generator!'));
  this.log(
    chalk.green(
      'With this you can create the scaffolding for your own Drupal TEKA theme.' + '\n'
    )
  );

  var prompts = [
    {
      type: 'string',
      name: 'projectName',
      message: 'What\'s your theme\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your theme\'s name';
        }
        return true;
      }
    },
    {
      type: 'string',
      name: 'projectHost',
      message: 'What\'s your dev host? '+ chalk.black('ex: my-project.dev') +' '+ chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your dev host';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'drupalVersion',
      message: 'What\'s your drupal\'s version?' + chalk.red(' (Required)'),
      choices: ['7.x', '8.x']
    },
    {
      type: 'confirm',
      name: 'patternLab',
      message: 'Do you want to use Pattern Lab?',
      default: false,
      when: function(answers) {
        return answers.drupalVersion == '8.x';
      },
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.projectHost = props.projectHost.replace(/\s+/g, '');
    this.projectSlug = _s.underscored(props.projectName);
    this.drupalVersion = props.drupalVersion;
    this.patternLab = props.patternLab;

    this.config.set('projectName', this.projectName);
    this.config.set('projectHost', this.projectHost);
    this.config.set('projectSlug', this.projectSlug);
    this.config.set('drupalVersion', this.drupalVersion);
    this.config.set('patternLab', this.patternLab);
    this.config.set('baseTheme', 'teka');

    cb();
  }.bind(this));
};

TekaThemeGenerator.prototype.drupal = function () {
  // Create our theme directory
  this.mkdir(this.projectSlug);
  // Set our destination to be the new directory.
  this.destinationRoot(this.projectSlug);

  // Make all the directories we know that we will need.
  this.mkdir('dist');
  this.mkdir('dist/css');
  this.mkdir('dist/js');
  this.mkdir('dist/js/lib');
  this.mkdir('dist/img');
  this.mkdir('assets');
  this.mkdir('assets/scss');
  this.mkdir('assets/scss/base');
  this.mkdir('assets/scss/components');
  this.mkdir('assets/scss/config');
  this.mkdir('assets/scss/partials');
  this.mkdir('assets/js');
  this.mkdir('assets/img');
  this.mkdir('assets/img/sprite');
  this.mkdir('templates');
  if (this.patternLab == true) {
    this.mkdir('pattern-lab-source');
  }

  // General theme files.
  if (this.drupalVersion == '7.x') {
    this.template('7.x/_teka.info', this.projectSlug+'.info');
    this.template('7.x/_template.php', 'template.php');
  }
  else {
    this.template('8.x/_teka.info.yml', this.projectSlug + '.info.yml');
    this.template('8.x/_teka.theme', this.projectSlug + '.theme');
    this.template('8.x/_teka.libraries.yml', this.projectSlug + '.libraries.yml');
  }

  // Populating directories.
  this.directory('scss/base', 'assets/scss/base');
  this.directory('scss/components', 'assets/scss/components');
  this.directory('scss/config', 'assets/scss/config');
  this.directory('scss/partials', 'assets/scss/partials');

  // Gulp settings file.
  this.template('_gulpfile.js', 'gulpfile.js');
  this.template('_package.json', 'package.json');

  // Images
  if (this.drupalVersion == '7.x') {
    this.copy('7.x/logo.png', 'logo.png');
  } else {
    this.copy('8.x/logo.svg', 'logo.svg');
  }
  this.copy('_screenshot.jpg', 'screenshot.jpg');
  this.copy('sample.png', 'assets/img/sprite/sample.png');

  // Sample JavaScript file.
  this.copy('script.js', 'assets/js/main.js');

  // Sample SCSS file.
  this.copy('scss/print.scss', 'assets/scss/print.scss');
  this.copy('scss/style.scss', 'assets/scss/style.scss');

  // Some config files we want to have.
  this.copy('ignore.gitignore', '.gitignore');
  this.copy('README.txt', 'README.txt');

  if (this.patternLab == true) {
    // Pattern lab source directory.
    this.directory('8.x/pattern-lab/pattern-lab-source', 'pattern-lab-source');
    this.directory('8.x/pattern-lab/templates', 'templates');
  }
};

module.exports = TekaThemeGenerator;
