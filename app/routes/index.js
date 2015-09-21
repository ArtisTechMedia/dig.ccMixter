import Ember from 'ember';

export default Ember.Route.extend({
  queryOptions: Ember.inject.service(),
  
  // cribbed from Pagable and elsewhere
  // todo: maybe make a mixin
  _setupWatcher: function() {
    this.get('queryOptions').on('optionsChanged',this,this._optionsWatcher);
  }.on('init'),
  
  _optionsWatcher: function(optName) {
    // This is broken for sub-routes
    if( this.router.currentRouteName === this.routeName ) {
      if( optName === 'licenseScheme' ) {
        var value = this.get('queryOptions.' + optName) ;
        if( value === 'all' ) {
          value = 'query';
        }
        this.transitionTo(value);
      }
    }
  },
  
});
