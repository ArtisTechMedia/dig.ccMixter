import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'modal', 'fade' ],
  appEvents:    Ember.inject.service(),
  
  $e: function() {
    return Ember.$(this.get('element'));
  }.property('element'),
  
  showModal: function() {
    if( this.get('showing') ) {
      this.get('$e').modal('show');
    } else {
      this.get('$e').modal('hide');
    }
  }.observes('showing'),
  
  actions: {
    submit: function() {
      this.sendAction();
    },
  },
  
  didInsertElement: function() {
    this.get('$e').on( 'hidden.bs.modal', () => {
      this.set('showing',false);
      this.get('appEvents').trigger('popup.closed');
    });
    this.showModal();
  },
  
  willDestroyElement: function() {
    var $e = this.get('$e');
    $e.off('.bs.modal');
    $e.modal('hide');    
  },
});
