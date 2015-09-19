import Ember from 'ember';


export default Ember.Controller.extend({

  title: function() {
    return this.get('model.name');
  }.property('model'),
  
});
