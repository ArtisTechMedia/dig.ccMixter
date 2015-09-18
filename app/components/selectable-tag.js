import Ember from 'ember';

export default Ember.Component.extend({
  //tagName: 'a',
  
  actions: {
    toggle: function() {
      var tag = this.get('tag');
      tag.toggleProperty('isSelected');
      if( tag.get('isSelected') ) {
         this.get('target').pushObject(tag);
      } else {
        this.get('target').removeObject(tag);
      }
    }
  }
});
