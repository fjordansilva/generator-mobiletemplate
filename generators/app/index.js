'use strict';

var 
    angularUtils = require('../util.js'),
    chalk        = require('chalk'),
    cordova      = require('cordova'),
    fs           = require('fs'),
    fsextra      = require('fs-extra'),    
    path         = require('path'),
    util         = require('util'),    
    yeoman       = require('yeoman-generator'),
    yosay        = require('yosay'),
    wiredep      = require('wiredep')    
;


module.exports = yeoman.generators.Base.extend({

  /**
  * Constructor del generador...
  */
  init: function () {
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));
    this.scriptAppName = this.appname + angularUtils.appName(this);

    if (typeof this.env.options.appPath === 'undefined') {
        try {
            this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
        } catch (e) {
        }
        this.env.options.appPath = this.env.options.appPath || 'app';
    }

    this.appPath = this.env.options.appPath;

    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.installDependencies({
                    //install sass bootstrap 
                });
      }      
    });

    this.on('dependenciesInstalled', function() {
      this.spawnCommand('grunt', ['develop']);
    });

    this.pkg = require('../../package.json');
  },

  /**
  * Mensaje de bienvenida
  */
  welcome: function() {
    // Have Yeoman greet the user.
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('Bienvenido al generador de apps para moviles con Cordova y AngularJS ' + chalk.red('MobileTemplate') + '!'));
    }
  },

  /**
  * Se pregunta al usuario algunos valores para Cordova.
  */
  promptCordovaParams: function() {
    var done = this.async();
    var prompts = [
      {
        type: 'input',
        name: 'cordovaappname',
        message: 'Cual es el nombre de la aplicacion? (No se permiten espacios)',
        default: 'HelloWorld'
      }, 
      {
        type: 'input',
        name: 'cordovapackagename',
        message: 'Cual es el identificador de la aplicacion? (Formato de dominio inverso. Ej: com.package.nombre)',
        default: 'es.connectis.' + this.appname
      }, 
      {
        type: 'checkbox',
        name: 'platforms',
        message: 'En que plataformas quieres que funcione la aplicacion?',
        choices: [
          {
            name: 'Android',
            value: 'android',
            checked: true
          }, {
            name: 'iOS',
            value: 'ios',
            checked: true
          }, {
            name: 'Blackberry 10',
            value: 'blackberry10',
            checked: false
          },{
            name: 'Windows Phone 8',
            value: 'wp8',
            checked: false
          }
        ]
      }, 
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Que plugins quieres incluir por defecto?',

        choices: [{
            name: 'Plugin Splashscreen',
            value: 'org.apache.cordova.splashscreen',
            checked: true
        }, {
            name: 'Plugin Console',
            value: 'org.apache.cordova.console',
            checked: true
        }, {
            name: 'Plugin Device',
            value: 'org.apache.cordova.device',
            checked: true
        }, {
            name: 'Plugin Dialogs',
            value: 'org.apache.cordova.dialogs',
            checked: true
        }, {
            name: 'Plugin InAppBrowser',
            value: 'org.apache.cordova.inappbrowser',
            checked: false
        }, {
            name: 'Plugin StatusBar',
            value: 'org.apache.cordova.statusbar',
            checked: true
        }, {
            name: 'Plugin PUSH (Personalizado)',
            value: 'https://github.com/fjordansilva/PushPlugin.git',
            checked: true
        }, {
            name: 'Plugin Network Information',
            value: 'org.apache.cordova.network-information',
            checked: false
        }, {
            name: 'Plugin Vibration',
            value: 'org.apache.cordova.vibration',
            checked: false
        }, {
            name: 'Plugin Battery Events',
            value: 'org.apache.cordova.battery-status',
            checked: false
        }, {
            name: 'Plugin Accelerometer (Device motion)',
            value: 'org.apache.cordova.device-motion',
            checked: false
        }, {
            name: 'Plugin Accelerometer (Device orientation)',
            value: 'org.apache.cordova.device-orientation',
            checked: false
        }, {
            name: 'Plugin Camera',
            value: 'org.apache.cordova.camera',
            checked: false
        }, {
            name: 'Plugin Contacts',
            value: 'org.apache.cordova.contacts',
            checked: false
        }, {
            name: 'Plugin Geolocation',
            value: 'org.apache.cordova.geolocation',
            checked: false
        }, {
            name: 'Plugin Media',
            value: 'org.apache.cordova.media',
            checked: false
        }, {
            name: 'Plugin Media Capture',
            value: 'org.apache.cordova.media-capture',
            checked: false
        }, {
            name: 'Plugin Access files on device',
            value: 'org.apache.cordova.file',
            checked: false
        }, {
            name: 'Plugin Access files on network/ File transfer (File API)',
            value: 'org.apache.cordova.file-transfer',
            checked: false
        }, {
            name: 'Plugin Globalization',
            value: 'org.apache.cordova.globalization',
            checked: false
        }]
    }];

    this.prompt(prompts, function(props) {
        //Cordova setup responses
        this.cordovaappname = props.cordovaappname;
        this.packagename = props.cordovapackagename;
        this.platforms = props.platforms;
        this.plugins = props.plugins;

        done();
    }.bind(this));
  },

  /**
  * Se pregunta al usuario algunos valores para Cordova.
  */
  promptAngularParams: function() {
    var done = this.async();

    this.prompt([
      {
        type: 'input',
        name: 'angularjsName',
        message: 'Que nombre le quieres dar a tu aplicacion Angular ?',
        default: this.cordovaappname + 'App'
      }, {
        type: 'input',
        name: 'appDescription',
        message: 'Descripcion de la aplicacion',
        default: 'Aplicacion movil Cordova y AngularJs'
      }, {
        type: 'input',
        name: 'appKeywords',
        message: 'Algunas keywords para la aplicacion',
        default: 'Cordova, AngularJS'
      }, {
        type: 'input',
        name: 'appAuthor',
        message: 'Autor de la aplicacion?',
        default: 'Connectis ICT'
      }], function(props) {
        // Respuesta para los valores de AngularJs
        this.appName = props.angularjsName;
        this.appDescription = props.appDescription;
        this.appKeywords = props.appKeywords;
        this.appAuthor = props.appAuthor;

        this.slugifiedAppName = this._.slugify(this.appName);
        this.humanizedAppName = this._.humanize(this.appName);
        this.capitalizedAppAuthor = this._.capitalize(this.appAuthor);

        done();

    }.bind(this));
  },

  /**
   * Se crea el proyecto Cordova con los valores que ha introducido el usuario.
   */
  setupCordovaProject: function() {
    var done = this.async();

    console.log("Creando la aplicacion Cordova: " + this.cordovaappname);

    try {
        cordova.create(process.cwd(), this.packagename, this.cordovaappname, function() {
            var cwd = process.cwd();
            console.log('****************************');
            console.log('1. Aplicacion Cordova creada');
            console.log('****************************');
            done();
        });
    } catch (err) {
        console.error('ERROR creando el proyecto Cordova: ' + err);
        process.exit(1);
    }
  },

  /**
   * Se eliminan los ficheros de ejemplo que añade Cordova por defecto.
   */
  cleanupCordovaProject: function() {
    var done = this.async();

    fsextra.remove('www/css', function(err) {
        if (err) {
            return console.error(err);
        }
    });
    fsextra.remove('www/img', function(err) {
        if (err) {
            return console.error(err);
        }
    });
    fsextra.remove('www/js', function(err) {
        if (err) {
            return console.error(err);
        }
    });
    fsextra.remove('www/index.html', function(err) {
        if (err) {
            return console.error(err);
        }
    });

    console.log('********************************************');
    console.log('2. Ficheros de ejemplo de Cordova eliminados');
    console.log('********************************************');

    done();
  },

  /**
   * Se añaden las plataformas que ha seleccionado el usuario.
   */
  addPlatformsToCordova: function() {
    var done = this.async();

    if (typeof this.platforms === 'undefined') {
        return;
    }
    console.log('*************************************************');
    console.log('3. Se añaden las plataformas móviles para Cordova');
    console.log('*************************************************');

    // Se añaden las plataformas de forma secuencial. Metodo recursivo
    function _addPlatform(index, platforms, next) {
      if (!(index < platforms.length)) {
        next();
        return;
      }

      try {
        console.log(chalk.green('+ ') + ' Intentando añadir la plataforma ' + chalk.red(platforms[index]) + ' al proyecto Cordova');
        cordova.platform('add', platforms[index], function() {
            console.log(chalk.green('? ') + ' Añadida la plataforma ' + chalk.green(platforms[index]) + ' al proyecto Cordova');
            _addPlatform(index + 1, platforms, next);
        });
      } catch (err) {
        console.error('ERROR añadiendo plataforma ' + platforms['index'] + ': ' + err);
        process.exit(1);
      }
    }

    // Se añade la primera plataforma
    _addPlatform(0, this.platforms, done);
  },

  /**
   * Se añaden los plugins seleccionados al proyecto.
   */
  addPluginsToCordova: function() {
    // Se añaden los plugins de forma secuencial. Metodo recursivo
    function _addPlugins(index, plugins, next) {
      if (!(index < plugins.length)) {
        next();
        return;
      }
      try {
        console.log(chalk.green('+ ') + ' Intentando añadir el plugin ' + chalk.red(plugins[index]) + ' al proyecto Cordova');
          
        cordova.plugin('add', plugins[index], function() {
          console.log(chalk.green('? ') + ' Plugin ' + chalk.green(plugins[index]) + ' añadido con éxito al proyecto Cordova');
          _addPlugins(index + 1, plugins, next);
        });
      } catch (err) {
        console.error('ERROR añadiendo el plugin ' + plugins['index'] + ': ' + err);
        process.exit(1);
      }
    }

    console.log('****************************************************************');
    console.log('4. Se añaden los Plugins seleccionados a las plataformas Cordova');
    console.log('****************************************************************');

    var done = this.async();
    if (this.plugins.length) {
      
      // Se añade el primer plugin
      _addPlugins(0, this.plugins, done);
    
    } else {
        console.log(chalk.gray('No se ha seleccionado ningun Plugin'));
        done();
    }
  },

  /**
   * Se copian los archivos del proyecto
   */
  copyProjectFiles: function() {
    console.log('*************************************');
    console.log('5. Copiando los archivos del proyecto');
    console.log('*************************************');

    this.copy('_Gruntfile.js',  'Gruntfile.js');
    this.copy('_editorconfig',  '.editorconfig');
    this.copy('_jshintrc',      '.jshintrc');
    this.copy('_gitignore',     '.gitignore');
    this.copy('_www-gitignore', 'www/.gitignore');
    this.copy('_bowerrc',       '.bowerrc');

    this.config.save(); //http://yeoman.io/blog/cleanup.html
  },

  /**
   * Se copian los archivos para npm y bower. Hay que personalizarlos.
   */
  parseTemplates: function() {
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  /*
   * Se crea la estructura del proyecto.
   */
  createAngularFolders: function(){
    console.log('****************************************************');
    console.log('6. Creando la estructura del proyecto para AngularJS');
    console.log('****************************************************');

    this.mkdir("app");
    this.mkdir("app/css");
    this.mkdir("app/img");
    this.mkdir("app/js");
    this.mkdir("app/lib");
    this.mkdir("app/modules");
    this.mkdir("app/modules/core");
    this.mkdir("app/modules/core/config");
    this.mkdir("app/modules/core/controllers");
    this.mkdir("app/modules/core/directives");
    this.mkdir("app/modules/core/filters");
    this.mkdir("app/modules/core/services");
    this.mkdir("app/modules/core/views");
    this.mkdir("hooks/after_platform_add");
  },

  /**
   * Se copian los archivos del proyecto Angular.
   */
  copyAgularFiles: function() {
    // this.template('cordova_plugins.js', 'hooks/after_platform_add/cordova_plugins.js');

    this.template('app/index.html', 'app/index.html');

    this.copy('app/css/index.css', 'app/css/index.css');    
    this.copy('app/js/config.js',  'app/js/config.js');
    this.copy('app/js/index.js',   'app/js/index.js');
    // Module: core
    this.copy('app/modules/core/core.js',             'app/modules/core/core.js');
    this.copy('app/modules/core/config/config.js',    'app/modules/core/config/config.js');
    this.copy('app/modules/core/config/routes.js',    'app/modules/core/config/routes.js');
    this.copy('app/modules/core/controllers/home.js', 'app/modules/core/controllers/home.js');
    this.copy('app/modules/core/directives/debug.js', 'app/modules/core/directives/debug.js');
    this.copy('app/modules/core/views/home.html',     'app/modules/core/views/home.html');
  }

});
