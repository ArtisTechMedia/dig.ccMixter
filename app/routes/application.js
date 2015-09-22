import Ember from 'ember';

export default Ember.Route.extend( {
  audioPlayer:  Ember.inject.service(),
  queryOptions: Ember.inject.service(),
  appEvents:    Ember.inject.service(),
  
  currentOpenModal: '',
  
  _init: function() {
    this.get('appEvents').on('popup.closed', this, this.onPopupClosed);
  }.on('init'),
  
  onPopupClosed: function() {
    // In some (all?) cases this call is triggering the follow assert:
    //
    // Uncaught Error: Assertion Failed: You must use Ember.set() to set 
    // the `element` property (of <dig.ccMixter@component:modal-popup::ember895>) to `null`.
    //
    // Should probably track that down one of these days
    this.disconnectOutlet( { outlet: 'modal', parentView: 'application' } );
    this.set('currentOpenModal',null);
  },

  openPopup: function(name,hash) {
    this.render( name + '-shim', { 
      into: 'application', 
      outlet: 'modal',
     });
  
    this.set('currentOpenModal',name);
  
    if( typeof hash !== 'undefined' && Object.keys(hash).length > 0 ) {
        this.get('appEvents').triggerWhen( 'popup.properties.'+name, hash );
    }
  },
    
  actions: {
    
    popup: function( name, hash ) {
      if( this.get('currentOpenModal') ) {
        this.onPopupClosed();
        Ember.run.next(this,() => {
          this.openPopup(name,hash);
        });
      } else {
        this.openPopup(name,hash);
      }
    },

    search: function(text) {
      this.set('queryOptions.searchText', text);
      if( this.router.currentRouteName !== 'dig' ) {
        this.transitionTo('dig');
      }
    },

    togglePlay: function(upload) {
      this.get('audioPlayer').togglePlay(upload);
    },

    clearOptions: function() {
      this.get('queryOptions').applyDefaults();
    },
    
  },
  
});
