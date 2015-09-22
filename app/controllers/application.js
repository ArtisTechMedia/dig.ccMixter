import Ember from 'ember';
import PopupInvoker from '../mixins/popup-invoker';
import Pageable from '../routes/pageable';
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend( PopupInvoker, {

  i18n:         Ember.inject.service(),
  audioPlayer:  Ember.inject.service(),  
  queryOptions: Ember.inject.service(),

  licenseInfo: function() {
    var licController = this.container.lookup('controller:licenses');
    return licController.get('licenseInfo');
  }.property(),
    
  searchCollector: '',

  titlePrefix: 'dig: ',
  
  title:  t('app.pageTitle'),
  
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
      this.toggleOptions( route instanceof Pageable );
    }
  }.observes('currentPath'),
    
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

    clearOptions: function() {
      this.get('queryOptions').setAllToDefault();
    },
    
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
});

