// Globals window
import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.isFastBoot = function() { return typeof FastBoot !== 'undefined'; };

if( Ember.isFastBoot() ) {
  window.clearTimeout = function() {
    Ember.debug('clearTimeout() called in server mode');
  };
}

App = Ember.Application.extend({
  modulePrefix:  config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver:    Resolver,
  
  setPageTitle: function(text,caller) {
    if( Ember.isFastBoot() ) {
      var renderer = caller.container.lookup('renderer:-dom');
      renderer._dom.document.title = text;
    } else {
      Ember.run.next(this, () => {
        Ember.$('head').find('title').text(text);
      });
    }
  },
});

loadInitializers(App, config.modulePrefix);


export default App;
