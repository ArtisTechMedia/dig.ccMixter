import Ember from 'ember';
import { translationMacro as t } from "ember-i18n";

var queryOpts = {

  licenseScheme: { 
    defaultValue: 'all',
    queryParam: 'lic' 
  },   

  limit: {
    defaultValue: 10,
    queryParam: 'limit' 
  },   

  instrumentalOnly: {
    defaultValue: false,
    queryParam: 'reqtags',
    model: 'instrumental,-vocals,-male_vocals,-female_vocals' 
  },   

  recent: {
    defaultValue: false,
    queryParam: 'digrank',
    model: '10000' 
  }, 
}; 

export default Ember.Controller.extend( {

  i18n:         Ember.inject.service(),
  audioPlayer:  Ember.inject.service(),  
  queryOptions: Ember.inject.service(),
  appEvents:    Ember.inject.service(),

  searchCollector: '',

  titlePrefix: 'dig: ',
  
  title:  t('app.pageTitle'),
  
  _init: function() {
    this.get('queryOptions').installOptions(queryOpts);
  }.on('init'),
  
  pageTitle: function() {
    var forRoute = this.get('currentPath');
    var title = this.get('title');
    var c = this.container.lookup('controller:' + forRoute);
    if( c && c.get('title') ) {
      title = c.get('title');
    }
    return this.titlePrefix + title;  
  }.property('currentPath'),
  
  setPageTitle: function() {
    this.container.lookup('application:main').setPageTitle( this.get('pageTitle'), this );
  }.observes('currentPath'),

  considerOptions: function() {
    if( !Ember.isFastBoot() ) {
      var route = this.container.lookup('route:' + this.get('currentPath'));
      this.set('queryOptions.hiddenOptions', route.get('hiddenOptions') || {});
      this.toggleOptions( route.get('wantsOptions') );
    }
  }.observes('currentPath'),
    
  watchForLicenseWidget: function() {
    // fade {{if queryOptions.hiddenOptions.licenseScheme 'out' 'in'}}
    this.get('appEvents').trigger( 'browser.script.run', 'slide-options', this.get('queryOptions.hiddenOptions.licenseScheme') );
  }.observes('queryOptions.hiddenOptions.licenseScheme'),
  
  _optionsShowing: false,
  
  toggleOptions: function(show) {
    Ember.run.next(this,() => {
      if( !this._optionsShowing && show ) {
        this._optionsShowing = true;
        Ember.$('#qop').slideDown(600);
      }
      else if( this._optionsShowing && !show ) {
        this._optionsShowing = false;
        Ember.$('#qop').slideUp(400);
      }
    });
  },
    
  scrollToAnchor: function(name) {
    try {  
      var anchor = Ember.$('a[name="'+name+'"]');
      var offset = 0; 
      Ember.$('html,body').animate({ scrollTop: Ember.$(anchor).offset().top - offset },
          { duration: 'slow', easing: 'swing'});
      }
    catch( e ) {
      Ember.debug('wups ' + e.toString() );
    }
  },

  actions: {

    goToAnchor: function(routeName,anchor) {
      if( this.get('currentPath') === routeName ) {
        this.scrollToAnchor(anchor);
      } else {
        this.transitionToRoute(routeName).then(() => {
          Ember.run.next(this,this.scrollToAnchor,anchor);
        });
      }
    },
  },
  
  licenseInfo: function() {
    var licRoute = this.container.lookup('route:licenses');
    return licRoute.model();
  }.property(),
      
});

