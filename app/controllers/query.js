/* globals Ember */
import TagUtils from '../lib/tags';
import PageableController from './pageable';
import { translationMacro as t } from "ember-i18n";

export default PageableController.extend({
    i18n:         Ember.inject.service(),
    queryOptions: Ember.inject.service(),
    
    selectedTags: [ ],
    catNames: ['genre', 'instr', 'mood'],
    categories: null,
    title: t('queryOptions.deep'),
    
    setupCategories: function() {
        var tagStore = this.container.lookup('store:tags');
        tagStore.query( { categories: this.catNames, details: true } )
            .then( tags => this.set('categories',tags) );
    }.on('init'),
    
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
    
    _tagWatcher: function() {
        var tags = TagUtils.create( { source: this.selectedTags.mapBy( 'id' ) } );
        this.set('queryOptions.extraTags', tags);
    }.observes( 'selectedTags.[]'),
        
        
});
