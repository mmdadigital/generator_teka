# yo teka #

Repo for the amazing Teka drupal theme's yeoman generator.

### How to get started? ###

First, install Teka generator's package globally:
```
#!javascript
sudo npm i -g generator-teka
```

Then you go to your project's theme dir
```
#!javascript
cd /www/yourProject/sites/all/themes/
```

Run our yeoman generator (System will ask you for a project name)
And after install, enter in your theme dir
```
#!javascript
yo teka
cd theNameYouChose/
```

Install theme dependencies.
```
#!javascript
sudo npm i --unsafe-perm
```

Enable and set your theme as default.

### Gulp Build system ###

Compile and watch file changes.
```
#!javascript
gulp
```

### Pattern Lab integration (optional) ###
Install Component Libraries module:
```
drush dl components
drush en components -y
```

In the sub-theme root folder, clone Pattern Lab repository and install its dependencies:
```
git clone https://github.com/pattern-lab/edition-php-drupal-standard.git pattern-lab
cd pattern-lab
composer install
```

Edit pattern-lab/config/config.yml and update the following settings with these values:
```
sourceDir: ../pattern-lab-source
twigAutoescape: false
```

Generate Pattern Lab running:
```
gulp pl:generate
```

or

```
gulp
```
This command will also generate front-end and watch file changes for Pattern Lab.

To see Pattern Lab front-end, access:
http://my-project.dev/themes/my-theme/pattern-lab/public

### What's required? ###

* Nodejs installed
* Drupal core installed

### Whats comes with Teka? ###

* Bourbon + Neat for sass mixins and grids
* Spritesmith for sprite generation (Just save png files into assets/img/sprite and retrieve on dist/img/sprite.png)
* Sass compile and minify
* JS concat and uglify
