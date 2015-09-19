import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    togglePlay: function(upload) {	
      this.sendAction('togglePlay',upload);
    },  
  
    popup: function(name,hash) {
      this.sendAction('popup',name,hash);
    }
  }

});
