import Ember from 'ember';

// <a href='#' {{action 'toggle' tag}} data-tag="{{catId}}-{{tag.id}}">

export default Ember.Component.extend({
  tagName: 'li',
  
  click: function() {
    var tag = this.get('tag');
    if( tag.toggleProperty('isSelected') ) {
       this.get('target').pushObject(tag);
    } else {
      this.get('target').removeObject(tag);
    }
  }
});
