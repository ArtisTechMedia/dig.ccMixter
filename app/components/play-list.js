import Ember from 'ember';

export default Ember.Component.extend({

  actions: {

    togglePlay: function(upload) {	
      this.sendAction('togglePlay',upload);
    },  
  
    popup: function(name,hash) {
      // hack this in for now
      if( name === 'download' ) {
        var store = this.container.lookup('store:uploads');
        store.info(hash.upload.id).then( u => {
          hash.upload = u;
          this.sendAction('popup',name,hash);
        });
      } else {      
        this.sendAction('popup',name,hash);
      }
    }
  }

});
