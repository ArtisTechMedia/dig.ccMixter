import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    popup: function(name,hash) {
      this.sendAction('popup',name,hash);
    }
  }

});
