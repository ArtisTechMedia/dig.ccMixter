import Ember from 'ember';
import PopupHost from 'ccm-core/mixins/popup-host';

export default Ember.Route.extend( PopupHost,  {
  audioPlayer:  Ember.inject.service(),
  queryOptions: Ember.inject.service(),
  
  currentOpenModal: '',
  
  actions: {
    
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
    
    playlistActions: function(actionType, model) {
      if( actionType === 'title' ) {
        this.transitionTo( 'uploads', model.artist.id, model.id );
      } else if( actionType === 'artist') {
        this.transitionTo( 'users', model.artist.id );
      }
    }
  },
  
});
