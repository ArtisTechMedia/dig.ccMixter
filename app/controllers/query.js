/* globals Ember */
import { TagUtils } from 'ccm-core';
import PageableController from './pageable';
import QuickText from '../mixins/quickt';


export default PageableController.extend(QuickText, {

  queryOptions: Ember.inject.service(), // template needs this
  application: Ember.inject.controller('application'),
  
  title: function() {
    return this.qt( 'queryOptions.deep' );
  }.property(),
  
  matchAnyTags: false,  
  
  selectedTags: [ ],
  
  tagQueryString: function() {
    return TagUtils.create( { source: this.get('selectedTags').mapBy( 'id' ) } ).toString();
  }.property('selectedTags.[]'),
  
  resetOffset: function() {
    this.set('offset',0);
  }.observes('selectedTags.[]'),
  
  enoughForMatchAny: function() {
    return this.get('selectedTags.length') > 1;
  }.property('selectedTags.[]'),
  
  actions: {
  
    remove: function(tag) {
      tag.set('isSelected',false);
      this.selectedTags.removeObject(tag);
    },

    clear: function() {
      this.selectedTags.forEach( t => t.set('isSelected',false) );
      this.set('selectedTags',[ ]);
    }

  },  
});
