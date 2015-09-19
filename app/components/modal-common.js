import Ember from 'ember';

export default Ember.Component.extend({
  appEvents:    Ember.inject.service(),

  _init: function() {
    this.get('appEvents').on( 'popup.properties.' + this.get('modalName'), this, this.setProperties );
  }.on('init'),
  
  willDestroyElement: function() {
    this.get('appEvents').off('popup.properties.' + this.get('modalName'));
  }
});
