/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
  });

  /** bootstrap **/
  
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/css/bootstrap-theme.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  var bootstrapFonts = new Funnel('bower_components/bootstrap/dist/fonts', {
    destDir: 'fonts'
  });

  app.import({
    development: 'bower_components/font-awesome/css/font-awesome.css',
    production: 'bower_components/font-awesome/css/font-awesome.min.css'
  });

  var fontAwesomeFonts = new Funnel('bower_components/font-awesome/fonts', {
    destDir: 'fonts'
  });
    
  return app.toTree( [ bootstrapFonts, fontAwesomeFonts, /* smImages */] );
};
