import Ember from 'ember';


export default Ember.Controller.extend({
  queryOptions: Ember.inject.service(),
  application: Ember.inject.controller(),
  
  poolItemForTrackbackPopup: { },

  title: function() {
    return this.get('model.name');
  }.property('model'),
  
  actions: {

    doTrackbackPopup: function(poolItem) {
      this.set('poolItemForTrackbackPopup',poolItem);
      Ember.$('#trackbackPopup').modal('show');
    },
    
    doTrackbackForm: function() {
      Ember.$('#trackbackForm').modal('show');
    },
    
    doSharePopup: function() {
      Ember.$('#sharePopup').modal('show');
    },
  },
});
