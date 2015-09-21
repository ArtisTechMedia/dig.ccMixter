/* globals Ember */
import TagUtils from '../lib/tags';
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
  i18n:     Ember.inject.service(),
  queryOptions: Ember.inject.service(),
  application: Ember.inject.controller('application'),
  
  matchAnyTags: false,  
  
  selectedTags: [ ],
  
  tagQueryString: function() {
    return TagUtils.create( { source: this.selectedTags.mapBy( 'id' ) } ).toString();
  }.property('selectedTags.[]'),
  
  catNames: ['genre', 'instr', 'mood'],
  
  categories: null,
  
  title: t('queryOptions.deep'),
  
  enoughForMatchAny: function() {
    return this.get('selectedTags.length') > 1;
  }.property('selectedTags.[]'),
  
  setupCategories: function() {
    var tagStore = this.container.lookup('store:tags');
    tagStore.query( { categories: this.catNames, details: true } )
      .then( tags => this.set('categories',tags) );
  },
  
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
