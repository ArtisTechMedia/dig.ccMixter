import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'modal', 'fade' ],
  appEvents:    Ember.inject.service(),
  

  showModal: function() {
    var $e = Ember.$(this.element);
    if( this.get('showing') ) {
      $e.modal('show');
    } else {
      $e.modal('hide');
    }
  }.observes('showing'),
  
  actions: {
    submit: function() {
      this.sendAction();
    },
  },
  
  didInsertElement: function() {
    var $e = Ember.$(this.element);
    $e.on( 'hidden.bs.modal', () => {
      this.set('showing',false);
      this.get('appEvents').trigger('popup.closed');
    });
    this.showModal();
  },
  
  willDestroyElement: function() {
    var $e = Ember.$(this.element);
    $e.off('.bs.modal');
    $e.modal('hide');    
  },
});
