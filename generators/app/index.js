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
    }

  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName.replace(/\s+/g, '_').toLowerCase();
    this.projectHost = props.projectHost.replace(/\s+/g, '');
    this.projectSlug = _s.underscored(props.projectName);

    this.config.set('projectName', this.projectName);
    this.config.set('projectHost', this.projectHost);
    this.config.set('projectSlug', this.projectSlug);
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

  // General theme files.
  this.template('_teka.info', this.projectName+'.info');
  this.template('_template.php', 'template.php');

  // Populating directories.
  this.directory('scss/base', 'assets/scss/base');
  this.directory('scss/components', 'assets/scss/components');
  this.directory('scss/config', 'assets/scss/config');
  this.directory('scss/partials', 'assets/scss/partials');
  this.directory('templates', 'templates');

  // Gulp settings file.
  this.template('_gulpfile.js', 'gulpfile.js');
  this.template('_package.json', 'package.json');

  // Images
  this.copy('logo.png', 'logo.png');
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
};



module.exports = TekaThemeGenerator;
